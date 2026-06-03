import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  TdsService,
  type TdsReportRow,
} from '../services/tds.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type TdsReportKind =
  | 'tds-report'
  | 'section-wise'
  | 'challana-payment-report'
  | 'cin-entry-report';

const TITLES: Record<TdsReportKind, string> = {
  'tds-report': 'TDS Report',
  'section-wise': 'Section Wise Report',
  'challana-payment-report': 'Challana Payment Report',
  'cin-entry-report': 'CIN Entry Report',
};

@Component({
  selector: 'app-tds-report-shell',
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
          @if (showDateRange()) {
            <label class="field">
              <span>From</span>
              <app-date-input [(ngModel)]="fromDate" name="from" />
            </label>
            <label class="field">
              <span>To</span>
              <app-date-input [(ngModel)]="toDate" name="to" />
            </label>
          }
          @if (showSection()) {
            <label class="field">
              <span>Section</span>
              <app-select
                [options]="sections()"
                optionLabel="pSectionName"
                optionValue="pSectionName"
                [(ngModel)]="sectionName"
              />
            </label>
          }
          @if (showChallanaNo()) {
            <label class="field">
              <span>Challana #</span>
              <app-select
                [options]="challanaNumbers()"
                optionLabel="pChallanaNo"
                optionValue="pChallanaNo"
                [(ngModel)]="challanaNo"
              />
            </label>
          }
          <p-button label="Run" icon="pi pi-play" (onClick)="run()" [loading]="loading()" />
        </div>
      </p-card>
      <p-card>
        <app-data-grid [rows]="rows()" [columns]="columns()" [exportFilename]="title()" />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .rep-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: flex-end; gap: 0.5rem 1rem; flex-wrap: wrap; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class TdsReportShellComponent implements OnInit {
  private readonly api = inject(TdsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<TdsReportKind>('tds-report');
  protected readonly rows = signal<TdsReportRow[]>([]);
  protected readonly columns = signal<DataGridColumn<TdsReportRow>[]>([]);
  protected readonly loading = signal(false);
  protected readonly sections = signal<Record<string, unknown>[]>([]);
  protected readonly challanaNumbers = signal<Record<string, unknown>[]>([]);

  protected fromDate: Date | null = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  })();
  protected toDate: Date | null = new Date();
  protected sectionName = '';
  protected challanaNo = '';

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'TDS Report');
  protected readonly showDateRange = computed(
    () => this.kind() !== 'challana-payment-report',
  );
  protected readonly showSection = computed(
    () => this.kind() === 'tds-report' || this.kind() === 'section-wise',
  );
  protected readonly showChallanaNo = computed(
    () =>
      this.kind() === 'challana-payment-report' || this.kind() === 'cin-entry-report',
  );

  ngOnInit(): void {
    const k = this.route.snapshot.data['reportKind'] as TdsReportKind | undefined;
    if (k) this.kind.set(k);
    if (this.showSection()) {
      this.api.getTdsSections().subscribe({
        next: (s) => this.sections.set((s as Record<string, unknown>[]) ?? []),
      });
    }
    if (this.kind() === 'challana-payment-report') {
      this.api.getChallanaPaymentNumbers().subscribe({
        next: (n) => this.challanaNumbers.set((n as Record<string, unknown>[]) ?? []),
      });
    }
    if (this.kind() === 'cin-entry-report') {
      this.api.getCinEntryChallanaNumbers().subscribe({
        next: (n) => this.challanaNumbers.set((n as Record<string, unknown>[]) ?? []),
      });
    }
  }

  protected run(): void {
    this.loading.set(true);
    this.loaderSvc.show();
    const from = this.fromDate?.toISOString().slice(0, 10) ?? '';
    const to = this.toDate?.toISOString().slice(0, 10) ?? '';

    const fetch = (() => {
      switch (this.kind()) {
        case 'challana-payment-report':
          return this.api.getChallanaPaymentReport(this.challanaNo);
        case 'cin-entry-report':
          return this.challanaNo
            ? this.api.getCinEntryByChallanaNo(this.challanaNo)
            : this.api.getCinEntryReportsBetweenDates(from, to);
        case 'section-wise':
          return this.api.getSectionWiseReport(from, to, this.sectionName);
        case 'tds-report':
        default:
          return this.api.getTdsReport(from, to, this.sectionName);
      }
    })();

    fetch.subscribe({
      next: (data) => {
        const rows = Array.isArray(data) ? data : [];
        this.rows.set(rows);
        this.columns.set(this.deriveColumns(rows));
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Report failed');
        this.loading.set(false);
        this.loaderSvc.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loaderSvc.hide();
      },
    });
  }

  private deriveColumns(rows: TdsReportRow[]): DataGridColumn<TdsReportRow>[] {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first).map((field) => ({
      field,
      header: field.replace(/^p_?/i, '').replace(/([A-Z])/g, ' $1').trim(),
      sortable: true,
      filter: true,
      align:
        typeof first[field] === 'number' ? ('right' as const) : ('left' as const),
    }));
  }
}
