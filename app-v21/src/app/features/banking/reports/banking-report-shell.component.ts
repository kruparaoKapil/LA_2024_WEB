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
  BankingReportsService,
  type BankingReportRow,
} from '../services/banking-reports.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type BankingReportKind =
  | 'interest-payment'
  | 'interest-trend'
  | 'maturity-trend'
  | 'maturity-intimation'
  | 'pre-maturity'
  | 'pre-maturity-monthwise'
  | 'lien-release'
  | 'self-adjustment'
  | 'member-wise-receipts'
  | 'branch-wise-receipts'
  | 'agent-points'
  | 'agent-business'
  | 'target'
  | 'cash-flow'
  | 'application-form'
  | 'member-enquiry'
  | 'member-details'
  | 'share-issue'
  | 'savings-account'
  | 'share-savings-withdraw'
  | 'production-summary'
  | 'production-achieved'
  | 'production-target';

const TITLES: Record<BankingReportKind, string> = {
  'interest-payment': 'Interest Payment Report',
  'interest-trend': 'Interest Payment Trend',
  'maturity-trend': 'Maturity Trend Report',
  'maturity-intimation': 'Maturity Intimation Report',
  'pre-maturity': 'Pre-Maturity Report',
  'pre-maturity-monthwise': 'Pre-Maturity Month-wise',
  'lien-release': 'Lien Release Report',
  'self-adjustment': 'Self Adjustment Report',
  'member-wise-receipts': 'Member-Wise Receipts',
  'branch-wise-receipts': 'Branch-Wise Receipts',
  'agent-points': 'Agent Points Report',
  'agent-business': 'Agent-Wise Business',
  target: 'Target Report',
  'cash-flow': 'Cash Flow Report',
  'application-form': 'Application Form',
  'member-enquiry': 'Member Enquiry',
  'member-details': 'Member Details',
  'share-issue': 'Share Issue Report',
  'savings-account': 'Savings Account Report',
  'share-savings-withdraw': 'Share / Savings Withdraw',
  'production-summary': 'Production Summary',
  'production-achieved': 'Production Achieved',
  'production-target': 'Production Target',
};

interface ReportFilters {
  fromDate: Date | null;
  toDate: Date | null;
  branchName: string;
  memberId: number | null;
  schemeId: number | null;
  accountNo: string;
  dateCheck: 'Yes' | 'No';
  paymentType: string;
  companyName: string;
  selectedMonth: string;
  maturityType: string;
  dateType: string;
  type: string;
  accountType: string;
  months: number;
  asOnMonth: string;
}

const DEFAULT_FILTERS: ReportFilters = {
  fromDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  })(),
  toDate: new Date(),
  branchName: '',
  memberId: null,
  schemeId: null,
  accountNo: '',
  dateCheck: 'Yes',
  paymentType: '',
  companyName: '',
  selectedMonth: new Date().toISOString().slice(0, 7),
  maturityType: 'FD',
  dateType: 'IssueDate',
  type: 'FD',
  accountType: 'Savings',
  months: 12,
  asOnMonth: new Date().toISOString().slice(0, 7),
};

const DATE_CHECK_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const TYPE_OPTIONS = [
  { label: 'FD', value: 'FD' },
  { label: 'RD', value: 'RD' },
];

const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Savings', value: 'Savings' },
  { label: 'Share', value: 'Share' },
];

/**
 * Generic banking-report shell that drives ~25 report screens via
 * `data.reportKind`. Replaces ~3500 LOC of legacy reports
 * (interest payment / maturity trend / pre-maturity / lien release /
 * self adjustment / member-wise / branch-wise / agent points /
 * agent business / target / cash flow / application form / member
 * enquiry / member details / share issue / savings / share-savings
 * withdraw / production trio).
 *
 * Filters auto-show based on `kind()`. Columns are auto-derived from
 * the first data row, then `<app-data-grid>` handles sort, search,
 * pagination and Excel / PDF export.
 */
@Component({
  selector: 'app-banking-report-shell',
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
              <app-date-input [(ngModel)]="filters.fromDate" name="from" />
            </label>
            <label class="field">
              <span>To</span>
              <app-date-input [(ngModel)]="filters.toDate" name="to" />
            </label>
          }
          @if (showAsOn()) {
            <label class="field">
              <span>As On Month</span>
              <input pInputText type="month" [(ngModel)]="filters.asOnMonth" name="asOn" />
            </label>
          }
          @if (showSelectedMonth()) {
            <label class="field">
              <span>Month</span>
              <input pInputText type="month" [(ngModel)]="filters.selectedMonth" name="month" />
            </label>
          }
          @if (showMonthsField()) {
            <label class="field">
              <span>Months</span>
              <input
                pInputText
                type="number"
                [(ngModel)]="filters.months"
                name="months"
                min="1"
                max="60"
              />
            </label>
          }
          @if (showAccountNo()) {
            <label class="field">
              <span>Account No</span>
              <input pInputText [(ngModel)]="filters.accountNo" name="acc" maxlength="40" />
            </label>
          }
          @if (showBranch()) {
            <label class="field">
              <span>Branch</span>
              <input pInputText [(ngModel)]="filters.branchName" name="br" maxlength="60" />
            </label>
          }
          @if (showDateCheck()) {
            <label class="field">
              <span>Date filter</span>
              <app-select
                [options]="dateCheckOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="filters.dateCheck"
                [showClear]="false"
              />
            </label>
          }
          @if (showTypeField()) {
            <label class="field">
              <span>Deposit Type</span>
              <app-select
                [options]="typeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="filters.maturityType"
                [showClear]="false"
              />
            </label>
          }
          @if (showAccountTypeField()) {
            <label class="field">
              <span>Account Type</span>
              <app-select
                [options]="accountTypeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="filters.accountType"
                [showClear]="false"
              />
            </label>
          }
          <p-button
            label="Run"
            icon="pi pi-play"
            (onClick)="run()"
            [loading]="loading()"
          />
        </div>
      </p-card>

      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns()"
          [exportFilename]="title()"
          emptyMessage="No data — adjust filters and run."
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .rep-shell { display: flex; flex-direction: column; gap: 0.75rem; }
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
export class BankingReportShellComponent implements OnInit {
  private readonly api = inject(BankingReportsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<BankingReportKind>('interest-payment');
  protected filters: ReportFilters = { ...DEFAULT_FILTERS };
  protected readonly rows = signal<BankingReportRow[]>([]);
  protected readonly columns = signal<DataGridColumn<BankingReportRow>[]>([]);
  protected readonly loading = signal<boolean>(false);

  protected readonly dateCheckOptions = DATE_CHECK_OPTIONS;
  protected readonly typeOptions = TYPE_OPTIONS;
  protected readonly accountTypeOptions = ACCOUNT_TYPE_OPTIONS;

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Banking Report');

  protected readonly showDateRange = computed(() => {
    const k = this.kind();
    return ![
      'interest-payment',
      'interest-trend',
      'maturity-trend',
      'application-form',
      'member-enquiry',
      'cash-flow',
      'production-summary',
      'production-achieved',
      'production-target',
    ].includes(k);
  });

  protected readonly showAsOn = computed(() => this.kind() === 'cash-flow');
  protected readonly showSelectedMonth = computed(() =>
    ['production-summary', 'production-achieved', 'production-target'].includes(
      this.kind(),
    ),
  );
  protected readonly showMonthsField = computed(() => this.kind() === 'cash-flow');
  protected readonly showAccountNo = computed(() =>
    ['application-form', 'member-enquiry'].includes(this.kind()),
  );
  protected readonly showBranch = computed(() =>
    [
      'lien-release',
      'self-adjustment',
      'branch-wise-receipts',
      'maturity-intimation',
    ].includes(this.kind()),
  );
  protected readonly showDateCheck = computed(() =>
    [
      'member-details',
      'share-issue',
      'savings-account',
      'share-savings-withdraw',
      'pre-maturity',
      'member-wise-receipts',
      'branch-wise-receipts',
    ].includes(this.kind()),
  );
  protected readonly showTypeField = computed(() =>
    ['pre-maturity-monthwise', 'pre-maturity'].includes(this.kind()),
  );
  protected readonly showAccountTypeField = computed(
    () => this.kind() === 'share-savings-withdraw',
  );

  ngOnInit(): void {
    const k = this.route.snapshot.data['reportKind'] as BankingReportKind | undefined;
    if (k) this.kind.set(k);
  }

  protected run(): void {
    const f = this.filters;
    const from = f.fromDate ? f.fromDate.toISOString().slice(0, 10) : '';
    const to = f.toDate ? f.toDate.toISOString().slice(0, 10) : '';

    this.loading.set(true);
    this.loaderSvc.show();

    const fetch = (() => {
      switch (this.kind()) {
        case 'interest-payment':
          return this.api.getInterestPaymentReport();
        case 'interest-trend':
          return this.api.getInterestTrendGrandTotalByDate(to);
        case 'maturity-trend':
          return this.api.getMaturityTrendReport();
        case 'maturity-intimation':
          return this.api.getMaturityIntimationReport({
            schemeId: f.schemeId ?? 0,
            branchName: f.branchName,
            fromDate: from,
            toDate: to,
          });
        case 'pre-maturity':
          return this.api.getPreMaturityReport({
            fromDate: from,
            toDate: to,
            type: f.maturityType,
            dateChecked: f.dateCheck,
          });
        case 'pre-maturity-monthwise':
          return this.api.getPreMaturityMonthwise({
            maturityType: f.maturityType,
            dateType: f.dateType,
            fromDate: from,
            toDate: to,
          });
        case 'lien-release':
          return this.api.getLienReleaseReport({
            branchName: f.branchName,
            fromDate: from,
            toDate: to,
          });
        case 'self-adjustment':
          return this.api.getSelfAdjustmentReport({
            paymentType: f.paymentType,
            companyName: f.companyName,
            branchName: f.branchName,
            fromDate: from,
            toDate: to,
          });
        case 'member-wise-receipts':
          return this.api.getMemberWiseReceiptsReport({
            memberId: f.memberId ?? 0,
            fromDate: from,
            toDate: to,
            dateChecked: f.dateCheck,
          });
        case 'branch-wise-receipts':
          return this.api.getBranchWiseReceiptsReport({
            branchId: 0,
            branchName: f.branchName,
            fromDate: from,
            toDate: to,
            dateChecked: f.dateCheck,
          });
        case 'agent-points':
          return this.api.getAgentPointsSummary({
            receiptFromDate: from,
            receiptToDate: to,
            chequeFromDate: from,
            chequeToDate: to,
          });
        case 'agent-business':
          return this.api.getAgentWiseBusinessReport({
            receiptFromDate: from,
            receiptToDate: to,
            chequeFromDate: from,
            chequeToDate: to,
          });
        case 'target':
          return this.api.getTargetReportSummary({
            receiptFromDate: from,
            receiptToDate: to,
            chequeFromDate: from,
            chequeToDate: to,
          });
        case 'cash-flow':
          return this.api.getCashFlowSummary(f.asOnMonth, f.months);
        case 'application-form':
          return this.api.getApplicationFormDetails(f.accountNo);
        case 'member-enquiry':
          return this.api.getMemberEnquiryDetails(f.accountNo);
        case 'member-details':
          return this.api.getMemberDetailsReport({
            dateCheck: f.dateCheck,
            fromDate: from,
            toDate: to,
          });
        case 'share-issue':
          return this.api.getShareIssueReport({
            dateCheck: f.dateCheck,
            fromDate: from,
            toDate: to,
          });
        case 'savings-account':
          return this.api.getSavingsAccountReport({
            dateCheck: f.dateCheck,
            fromDate: from,
            toDate: to,
          });
        case 'share-savings-withdraw':
          return this.api.getShareSavingsWithdrawDetails({
            accountType: f.accountType,
            dateCheck: f.dateCheck,
            fromDate: from,
            toDate: to,
          });
        case 'production-summary':
          return this.api.getProductSummary(f.selectedMonth);
        case 'production-achieved':
          return this.api.getProductionAchieved(f.selectedMonth);
        case 'production-target':
          return this.api.getProductionTarget(f.selectedMonth);
      }
    })();

    fetch.subscribe({
      next: (rows) => {
        const data = Array.isArray(rows) ? rows : [];
        this.rows.set(data);
        this.columns.set(this.deriveColumns(data));
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

  private deriveColumns(rows: BankingReportRow[]): DataGridColumn<BankingReportRow>[] {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first).map((field) => ({
      field,
      header: this.toHeader(field),
      sortable: true,
      filter: true,
      align:
        typeof first[field] === 'number'
          ? ('right' as const)
          : ('left' as const),
      format:
        typeof first[field] === 'number'
          ? (v: unknown) =>
              typeof v === 'number'
                ? new Intl.NumberFormat('en-IN').format(v)
                : (v as string) ?? ''
          : undefined,
    }));
  }

  private toHeader(field: string): string {
    return field
      .replace(/^p_?/i, '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  }
}
