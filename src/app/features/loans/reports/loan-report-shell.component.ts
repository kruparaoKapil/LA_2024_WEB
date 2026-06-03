import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
} from '../../../shared/ui';
import {
  LoanReportsService,
  type ReportRow,
} from '../services/loan-reports.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type LoanReportKind =
  | 'statement'
  | 'emi-chart'
  | 'dues'
  | 'gst'
  | 'collections'
  | 'disbursement-report';

const TITLES: Record<LoanReportKind, string> = {
  statement: 'Loan Statement',
  'emi-chart': 'EMI Chart Report',
  dues: 'Due Reports',
  gst: 'GST Report',
  collections: 'Collections Report',
  'disbursement-report': 'Disbursement Reports',
};

const DUES_TYPE_OPTIONS = [
  { label: 'Current', value: 'Current' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'All', value: 'All' },
];

/**
 * Generic loan-report shell: date-range filter + grid + Excel/PDF export
 * via `<app-data-grid>`. Replaces six near-identical legacy report
 * components by parameterising the report kind via route data.
 */
@Component({
  selector: 'app-loan-report-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
  ],
  template: `
    <div class="rep-shell">
      <header><h2>{{ title() }}</h2></header>

      <p-card>
        <div class="filters">
          @if (kind() === 'statement' || kind() === 'emi-chart') {
            <label class="field">
              <span>Application ID</span>
              <input
                pInputText
                [(ngModel)]="applicationId"
                name="appId"
                placeholder="Enter application ID…"
              />
            </label>
          } @else {
            <label class="field">
              <span>From</span>
              <app-date-input [(ngModel)]="fromDate" name="from" />
            </label>
            <label class="field">
              <span>To</span>
              <app-date-input [(ngModel)]="toDate" name="to" />
            </label>
            @if (kind() === 'dues') {
              <label class="field">
                <span>Dues Type</span>
                <app-select
                  [options]="duesTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [(ngModel)]="duesType"
                  [showClear]="false"
                />
              </label>
            }
          }
          <div class="run">
            <p-button
              label="Run Report"
              icon="pi pi-play"
              (onClick)="run()"
              [loading]="running()"
            />
          </div>
        </div>
      </p-card>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns()"
        [showSearch]="true"
        [showExportExcel]="true"
        [showExportPdf]="true"
        [paginator]="true"
        [pageSize]="20"
        [exportFilename]="exportFilename()"
        [emptyMessage]="emptyMessage()"
      />

      @if (rows().length > 0) {
        <p class="totals">
          {{ rows().length }} record{{ rows().length === 1 ? '' : 's' }}
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .rep-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters {
        display: flex;
        gap: 0.75rem;
        align-items: end;
        flex-wrap: wrap;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; min-width: 200px; }
      .run { margin-left: auto; }
      .totals { color: var(--p-text-muted-color, var(--p-surface-500)); font-size: 0.85rem; }
    `,
  ],
})
export class LoanReportShellComponent implements OnInit {
  private readonly api = inject(LoanReportsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly duesTypeOptions = DUES_TYPE_OPTIONS;

  protected readonly kind = signal<LoanReportKind>('statement');
  protected readonly rows = signal<ReportRow[]>([]);
  protected readonly running = signal<boolean>(false);

  protected applicationId: string = '';
  protected fromDate: Date = new Date(new Date().setDate(1));
  protected toDate: Date = new Date();
  protected duesType: string = 'Current';

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Report');
  protected readonly exportFilename = computed(() => `loan-${this.kind()}-report`);
  protected readonly emptyMessage = computed(() =>
    this.rows().length === 0 ? 'Set filters and click Run Report.' : '',
  );

  protected readonly columns = signal<DataGridColumn<ReportRow>[]>([]);

  ngOnInit(): void {
    const k = this.route.snapshot.data['reportKind'] as LoanReportKind | undefined;
    if (k) this.kind.set(k);
    const appId = this.route.snapshot.paramMap.get('applicationId');
    if (appId) {
      this.applicationId = appId;
      this.run();
    }
  }

  protected run(): void {
    this.running.set(true);
    this.loader.show();
    const handle = (rows: ReportRow[]) => {
      this.rows.set(rows ?? []);
      this.columns.set(this.deriveColumns(rows ?? []));
      this.running.set(false);
      this.loader.hide();
    };
    const fail = (err: { message?: string }) => {
      this.toast.error(err?.message ?? 'Failed to run report');
      this.running.set(false);
      this.loader.hide();
    };

    switch (this.kind()) {
      case 'statement':
        if (!this.applicationId) {
          this.toast.warn('Enter an application ID.');
          this.running.set(false);
          this.loader.hide();
          return;
        }
        this.api.getAccountStatement(this.applicationId).subscribe({
          next: (rows) => handle(rows),
          error: fail,
        });
        break;
      case 'emi-chart':
        if (!this.applicationId) {
          this.api.getEmiChartList().subscribe({ next: handle, error: fail });
        } else {
          this.api.getEmiChartReport(this.applicationId).subscribe({
            next: handle,
            error: fail,
          });
        }
        break;
      case 'dues':
        this.api
          .getDuesSummary({
            fromDate: this.toIso(this.fromDate),
            toDate: this.toIso(this.toDate),
            duesType: this.duesType,
          })
          .subscribe({ next: handle, error: fail });
        break;
      case 'gst':
        this.api
          .getGstReport(this.toIso(this.fromDate), this.toIso(this.toDate))
          .subscribe({ next: handle, error: fail });
        break;
      case 'collections':
      case 'disbursement-report':
        this.api
          .getDisbursedReport({
            FromDate: this.toIso(this.fromDate),
            ToDate: this.toIso(this.toDate),
          })
          .subscribe({ next: handle, error: fail });
        break;
    }
  }

  private deriveColumns(rows: ReportRow[]): DataGridColumn<ReportRow>[] {
    if (rows.length === 0) return [];
    const sample = rows[0];
    const keys = Object.keys(sample).slice(0, 12); // cap to keep grid readable
    return keys.map((k) => {
      const value = sample[k];
      const isNumeric = typeof value === 'number';
      return {
        field: k,
        header: k.replace(/^p/, '').replace(/([A-Z])/g, ' $1').trim(),
        sortable: true,
        filter: !isNumeric,
        align: isNumeric ? ('right' as const) : ('left' as const),
        format: isNumeric
          ? (v: unknown) =>
              typeof v === 'number'
                ? new Intl.NumberFormat('en-IN').format(v)
                : (v as string) ?? ''
          : undefined,
      } satisfies DataGridColumn<ReportRow>;
    });
  }

  private toIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
