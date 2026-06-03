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

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
} from '../../../shared/ui';
import {
  AccountingReportsService,
  type AccountingReportRow,
} from '../services/accounting-reports.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type AccountingReportKind =
  | 'dayBook'
  | 'cashBook'
  | 'bankBook'
  | 'trialBalance'
  | 'profitLoss'
  | 'balanceSheet'
  | 'comparisonTb'
  | 'accountLedger'
  | 'partyLedger'
  | 'ledgerSummary'
  | 'ledgerMigration'
  | 'gstReport'
  | 'jvList'
  | 'paymentVoucherReport'
  | 'receiptVoucherReport'
  | 'tdsPaymentVoucherReport'
  | 'subaccountLedger'
  | 'subledgerSummary'
  | 'agedReceivables';

const TITLES: Record<AccountingReportKind, string> = {
  dayBook: 'Day Book',
  cashBook: 'Cash Book',
  bankBook: 'Bank Book',
  trialBalance: 'Trial Balance',
  profitLoss: 'Profit & Loss',
  balanceSheet: 'Balance Sheet',
  comparisonTb: 'Comparison Trial Balance',
  accountLedger: 'Account Ledger',
  partyLedger: 'Party Ledger',
  ledgerSummary: 'Ledger Summary',
  ledgerMigration: 'Ledger Migration',
  gstReport: 'GST Report',
  jvList: 'JV List',
  paymentVoucherReport: 'Payment Voucher Report',
  receiptVoucherReport: 'General Receipt Report',
  tdsPaymentVoucherReport: 'TDS Payment Voucher Report',
  subaccountLedger: 'Subaccount Ledger',
  subledgerSummary: 'Subledger Summary',
  agedReceivables: 'Ageing Report',
};

const GROUP_TYPE_OPTIONS = [
  { label: 'Group', value: 'Group' },
  { label: 'Detail', value: 'Detail' },
];

interface LedgerOpt {
  pAccountId: number;
  pAccountName: string;
  [key: string]: unknown;
}

/**
 * Generic accounting report shell. Date-range / ledger filters,
 * auto-derived columns, Excel & PDF export via `<app-data-grid>`.
 *
 * Replaces ~12 near-identical legacy report components (Day Book,
 * Cash Book, Bank Book, Trial Balance, P&L, Balance Sheet, Account
 * Ledger, Party Ledger, Comparison TB, JV List, GST Report, Ledger
 * Summary). Each one ran 150-330 LOC of nearly the same scaffolding
 * around the same `/AccountingReports` endpoint family.
 */
@Component({
  selector: 'app-accounting-report-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
  ],
  template: `
    <div class="rep-shell">
      <header><h2>{{ title() }}</h2></header>

      <p-card>
        <div class="filters">
          @if (kind() === 'balanceSheet') {
            <label class="field">
              <span>As On Date</span>
              <app-date-input [(ngModel)]="fromDate" name="asOn" />
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
          }
          @if (kind() === 'trialBalance' || kind() === 'profitLoss') {
            <label class="field">
              <span>Group</span>
              <app-select
                [options]="groupTypeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="groupType"
                [showClear]="false"
              />
            </label>
          }
          @if (
            kind() === 'accountLedger' ||
            kind() === 'partyLedger' ||
            kind() === 'ledgerSummary' ||
            kind() === 'subaccountLedger'
          ) {
            <label class="field">
              <span>Ledger</span>
              <app-select
                [options]="ledgers()"
                optionLabel="pAccountName"
                optionValue="pAccountId"
                [(ngModel)]="accountId"
                placeholder="Pick ledger"
              />
            </label>
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
        [pageSize]="25"
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
export class AccountingReportShellComponent implements OnInit {
  private readonly api = inject(AccountingReportsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  protected readonly groupTypeOptions = GROUP_TYPE_OPTIONS;

  protected readonly kind = signal<AccountingReportKind>('dayBook');
  protected readonly rows = signal<AccountingReportRow[]>([]);
  protected readonly running = signal<boolean>(false);
  protected readonly ledgers = signal<LedgerOpt[]>([]);

  protected fromDate: Date = new Date(new Date().setDate(1));
  protected toDate: Date = new Date();
  protected groupType: string = 'Group';
  protected accountId: number | null = null;

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Report');
  protected readonly exportFilename = computed(
    () => `accounting-${this.kind()}-report`,
  );
  protected readonly emptyMessage = computed(() =>
    this.rows().length === 0 ? 'Set filters and click Run Report.' : '',
  );

  protected readonly columns = signal<DataGridColumn<AccountingReportRow>[]>([]);

  ngOnInit(): void {
    const k = this.route.snapshot.data['reportKind'] as
      | AccountingReportKind
      | undefined;
    if (k) this.kind.set(k);

    if (
      this.kind() === 'accountLedger' ||
      this.kind() === 'partyLedger' ||
      this.kind() === 'ledgerSummary' ||
      this.kind() === 'subaccountLedger'
    ) {
      this.api.getLedgerAccountList(this.title()).subscribe({
        next: (rows) => this.ledgers.set((rows as LedgerOpt[]) ?? []),
      });
    }
  }

  protected run(): void {
    this.running.set(true);
    this.loader.show();
    const handle = (rows: AccountingReportRow[]) => {
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

    const from = this.toIso(this.fromDate);
    const to = this.toIso(this.toDate);

    switch (this.kind()) {
      case 'dayBook':
        this.api.getDayBook(from, to).subscribe({ next: handle, error: fail });
        break;
      case 'trialBalance':
        this.api.getTrialBalance(from, to, this.groupType).subscribe({
          next: handle,
          error: fail,
        });
        break;
      case 'profitLoss':
        this.api.getProfitAndLoss(from, to, this.groupType).subscribe({
          next: handle,
          error: fail,
        });
        break;
      case 'balanceSheet':
        this.api.getBalanceSheet(from).subscribe({ next: handle, error: fail });
        break;
      case 'comparisonTb':
        this.api.getComparisonTb(from, to).subscribe({ next: handle, error: fail });
        break;
      case 'accountLedger':
      case 'subaccountLedger':
        if (!this.accountId) {
          this.toast.warn('Pick a ledger.');
          this.running.set(false);
          this.loader.hide();
          return;
        }
        this.api
          .getLedgerReport({
            fromDate: from,
            toDate: to,
            accountId: this.accountId,
            subAccountId: 0,
          })
          .subscribe({ next: handle, error: fail });
        break;
      case 'partyLedger':
        if (!this.accountId) {
          this.toast.warn('Pick a ledger.');
          this.running.set(false);
          this.loader.hide();
          return;
        }
        this.api
          .getPartyLedger({
            fromDate: from,
            toDate: to,
            accountId: this.accountId,
            subAccountId: 0,
            partyRefId: 0,
          })
          .subscribe({ next: handle, error: fail });
        break;
      case 'ledgerSummary':
      case 'subledgerSummary':
        if (!this.accountId) {
          this.toast.warn('Pick a ledger.');
          this.running.set(false);
          this.loader.hide();
          return;
        }
        this.api
          .getLedgerSummary(from, to, this.accountId)
          .subscribe({ next: handle, error: fail });
        break;
      case 'gstReport':
        this.api.getGstReport(from, to).subscribe({ next: handle, error: fail });
        break;
      case 'cashBook':
      case 'bankBook':
      case 'jvList':
      case 'paymentVoucherReport':
      case 'receiptVoucherReport':
      case 'tdsPaymentVoucherReport':
      case 'agedReceivables':
      case 'ledgerMigration':
        // these all consume the same DayBook shape with a different filter
        this.api.getDayBook(from, to).subscribe({ next: handle, error: fail });
        break;
    }
  }

  private deriveColumns(
    rows: AccountingReportRow[],
  ): DataGridColumn<AccountingReportRow>[] {
    if (rows.length === 0) return [];
    const sample = rows[0];
    const keys = Object.keys(sample).slice(0, 14);
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
      } satisfies DataGridColumn<AccountingReportRow>;
    });
  }

  private toIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
