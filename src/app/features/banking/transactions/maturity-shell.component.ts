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
import { DepositsService } from '../services/deposits.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type MaturityKind = 'maturity' | 'renewal' | 'interest-payment' | 'pre-maturity';

const TITLES: Record<MaturityKind, string> = {
  maturity: 'Maturity Payment',
  renewal: 'Maturity Renewal',
  'interest-payment': 'Interest Payment',
  'pre-maturity': 'Pre-Maturity Payment',
};

const TYPE_OPTIONS = [
  { label: 'FD', value: 'FD' },
  { label: 'RD', value: 'RD' },
];

/**
 * Generic maturity / renewal / interest-payment / pre-maturity shell.
 * Replaces ~3 large legacy screens (`Maturity Payment`, `maturity-renewal-new`,
 * `Interest Payment`) by parameterising the workflow via `data.kind`.
 *
 * Lists eligible accounts, lets the user select rows, edit pay-out
 * details inline, and submits the chosen rows in a single batch.
 */
@Component({
  selector: 'app-maturity-shell',
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
    <div class="mat-shell">
      <header><h2>{{ title() }}</h2></header>

      <p-card>
        <div class="filters">
          <label class="field">
            <span>Deposit Type</span>
            <app-select
              [options]="typeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="depositType"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>As On Date</span>
            <app-date-input [(ngModel)]="asOnDate" name="asOn" />
          </label>
          <p-button
            label="Load"
            icon="pi pi-search"
            (onClick)="load()"
            [loading]="loading()"
          />
          <p-button
            label="Save Selected"
            icon="pi pi-save"
            severity="success"
            [disabled]="!selectedRows.length"
            (onClick)="save()"
          />
        </div>
      </p-card>

      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns"
          selectionMode="multi"
          [(selection)]="selectedRows"
          [exportFilename]="title()"
          emptyMessage="Choose deposit type + date and load eligible accounts."
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .mat-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem 1rem;
        flex-wrap: wrap;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class MaturityShellComponent implements OnInit {
  private readonly api = inject(DepositsService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  protected readonly typeOptions = TYPE_OPTIONS;
  protected readonly kind = signal<MaturityKind>('maturity');
  protected readonly rows = signal<Record<string, unknown>[]>([]);
  protected selectedRows: Record<string, unknown>[] = [];
  protected readonly loading = signal<boolean>(false);

  protected depositType = 'FD';
  protected asOnDate: Date | null = new Date();

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Maturity');

  protected readonly columns: DataGridColumn<Record<string, unknown>>[] = [
    { field: 'pAccountNo', header: 'Account No', sortable: true, filter: true },
    { field: 'pMemberName', header: 'Member', sortable: true, filter: true },
    { field: 'pSchemeName', header: 'Scheme', sortable: true },
    {
      field: 'pDepositAmount',
      header: 'Deposit',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pMaturityAmount',
      header: 'Maturity',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pMaturityDate', header: 'Maturity Date', align: 'center' },
    { field: 'pStatus', header: 'Status', align: 'center' },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as MaturityKind | undefined;
    if (k) this.kind.set(k);
  }

  protected load(): void {
    if (!this.asOnDate) {
      this.toast.warn('As-on date is required.');
      return;
    }
    this.loading.set(true);
    this.loaderSvc.show();
    const date = this.asOnDate.toISOString().slice(0, 10);
    const fetch =
      this.kind() === 'renewal'
        ? this.api.getMaturityRenewalView()
        : this.kind() === 'interest-payment'
          ? this.api.getInterestPaymentDetails(date, date)
          : this.api.getMaturityPaymentView();
    fetch.subscribe({
      next: (rows) =>
        this.rows.set(
          Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [],
        ),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load');
        this.loading.set(false);
        this.loaderSvc.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loaderSvc.hide();
      },
    });
  }

  protected save(): void {
    const rows = this.selectedRows;
    if (!rows.length) return;
    this.loaderSvc.show();
    const payload = { rows };
    const save =
      this.kind() === 'renewal'
        ? this.api.saveMaturityRenewal(payload)
        : this.kind() === 'interest-payment'
          ? this.api.saveDelayInterest(payload)
          : this.api.saveMaturityPayment(payload);
    save.subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.selectedRows = [];
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.loaderSvc.hide();
      },
      complete: () => this.loaderSvc.hide(),
    });
  }
}
