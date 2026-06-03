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
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

import {
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  LoanReceiptsService,
  type InstallmentDueRow,
  type ParticularRow,
  type ReceiptFormName,
} from '../services/loan-receipts.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

const MODE_OPTIONS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'NEFT', value: 'NEFT' },
  { label: 'RTGS', value: 'RTGS' },
  { label: 'IMPS', value: 'IMPS' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Card', value: 'CARD' },
];

const DUES_TYPE_OPTIONS = [
  { label: 'Current', value: 'Current' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'All', value: 'All' },
];

const INTEREST_MODE_OPTIONS = [
  { label: 'Continue', value: 'Continue' },
  { label: 'Skip', value: 'Skip' },
  { label: 'Add to Principal', value: 'AddToPrincipal' },
];

interface ReceiptForm {
  pVchapplicationid: string;
  pmodofreceipt: string;
  pbankname: string;
  pBranch: string;
  pbranchname: string;
  ptranstype: string;
  ptypeofpayment: string;
  pChequenumber: string;
  pchequedate: Date | null;
  pDattransdate: Date | null;
  pBank: string;
  pbankid: number;
  pCardNumber: string;
  pdepositbankid: number;
  pdepositbankname: string;
  pRecordid: number;
  pUpiname: string;
  pUpiid: string;
  pAmountReceived: number | null;
  pDuesType: string;
  pRemarks: string;
  // moratorium-specific
  pMoratoriumDate: Date | null;
  pMoratoriumMonths: number | null;
  pInterestMode: string;
  [key: string]: unknown;
}

const EMPTY_FORM: ReceiptForm = {
  pVchapplicationid: '',
  pmodofreceipt: 'CASH',
  pbankname: '',
  pBranch: '',
  pbranchname: '',
  ptranstype: '',
  ptypeofpayment: '',
  pChequenumber: '',
  pchequedate: new Date(),
  pDattransdate: new Date(),
  pBank: '',
  pbankid: 0,
  pCardNumber: '',
  pdepositbankid: 0,
  pdepositbankname: '',
  pRecordid: 0,
  pUpiname: '',
  pUpiid: '',
  pAmountReceived: null,
  pDuesType: 'Current',
  pRemarks: '',
  pMoratoriumDate: new Date(),
  pMoratoriumMonths: 1,
  pInterestMode: 'Continue',
};

/**
 * Single shell that handles Receipt / PartPayment / Moratorium screens.
 * The legacy stack was three near-identical components (`loanreceipt-new`
 * 1693 LOC, `partpayment` 1893 LOC, `moratorium` 670 LOC) — consolidating
 * saves ~3500 LOC. The active form is detected from the route's
 * `data.formName`.
 */
@Component({
  selector: 'app-receipts-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    InputTextModule,
    CurrencyInputComponent,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="rcp-shell">
      <header class="rh">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">Application: <strong>{{ applicationId() }}</strong></p>
        </div>
        <div class="actions">
          <p-button
            label="Save"
            icon="pi pi-save"
            (onClick)="save()"
            [loading]="saving()"
            [disabled]="!isValid()"
          />
          <p-button
            label="Back"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-arrow-left"
            (onClick)="back()"
          />
        </div>
      </header>

      @if (loanInfo(); as info) {
        <p-card header="Loan Summary">
          <div class="summary">
            <div><span>Customer</span><strong>{{ info.pContactName }}</strong></div>
            <div><span>Loan</span><strong>{{ info.pLoanName }}</strong></div>
            <div>
              <span>Outstanding</span>
              <strong>{{ info.pBalance | number: '1.0-0':'en-IN' }}</strong>
            </div>
            <div>
              <span>Next EMI</span>
              <strong>{{ info.pNextEmiDate ?? '—' }}</strong>
            </div>
          </div>
        </p-card>
      }

      @if (formName() !== 'Moratorium') {
        <p-card header="Particulars">
          <app-data-grid
            [rows]="particulars()"
            [columns]="particularColumns"
            [showSearch]="false"
            [showExportExcel]="false"
            [showExportPdf]="false"
            [paginator]="false"
            emptyMessage="No particulars to apply."
          />
          <div class="totals">
            Total particulars:
            <strong>{{ totalParticulars() | number: '1.0-0':'en-IN' }}</strong>
          </div>
        </p-card>
      }

      <p-card [header]="formCardHeader()">
        <div class="grid">
          @if (formName() === 'Moratorium') {
            <label class="field">
              <span>Moratorium Date<sup>*</sup></span>
              <app-date-input
                [(ngModel)]="form.pMoratoriumDate"
                name="moratoriumDate"
              />
            </label>
            <label class="field">
              <span>Months<sup>*</sup></span>
              <input
                type="number"
                [(ngModel)]="form.pMoratoriumMonths"
                name="moratoriumMonths"
                min="1"
                max="60"
              />
            </label>
            <label class="field">
              <span>Interest Mode</span>
              <app-select
                [options]="interestModeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="form.pInterestMode"
                name="interestMode"
                [showClear]="false"
              />
            </label>
          } @else {
            <label class="field">
              <span>Mode<sup>*</sup></span>
              <app-select
                [options]="modeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="form.pmodofreceipt"
                name="mode"
                [showClear]="false"
              />
            </label>
            <label class="field">
              <span>Transaction Date<sup>*</sup></span>
              <app-date-input
                [(ngModel)]="form.pDattransdate"
                name="transDate"
                [maxDate]="today"
              />
              <app-validation-message [message]="errors().pDattransdate" />
            </label>
            <label class="field">
              <span>Amount<sup>*</sup></span>
              <app-currency-input
                [(ngModel)]="form.pAmountReceived"
                name="amount"
              />
              <app-validation-message [message]="errors().pAmountReceived" />
            </label>
            <label class="field">
              <span>Dues Type</span>
              <app-select
                [options]="duesTypeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="form.pDuesType"
                (ngModelChange)="reloadInstallments()"
                name="duesType"
                [showClear]="false"
              />
            </label>
            @if (form.pmodofreceipt === 'CHEQUE') {
              <label class="field">
                <span>Cheque No</span>
                <input
                  pInputText
                  [(ngModel)]="form.pChequenumber"
                  name="chequeNo"
                  maxlength="20"
                />
              </label>
              <label class="field">
                <span>Cheque Date</span>
                <app-date-input [(ngModel)]="form.pchequedate" name="chequeDate" />
              </label>
              <label class="field">
                <span>Bank</span>
                <input pInputText [(ngModel)]="form.pbankname" name="bankName" />
              </label>
            }
            @if (form.pmodofreceipt !== 'CASH' && form.pmodofreceipt !== 'CHEQUE') {
              <label class="field">
                <span>Reference No</span>
                <input pInputText [(ngModel)]="form.pCardNumber" name="refNo" />
              </label>
              <label class="field">
                <span>Deposit Bank</span>
                <input pInputText [(ngModel)]="form.pdepositbankname" name="depBank" />
              </label>
            }
            @if (form.pmodofreceipt === 'UPI') {
              <label class="field">
                <span>UPI Name</span>
                <input pInputText [(ngModel)]="form.pUpiname" name="upiName" />
              </label>
              <label class="field">
                <span>UPI ID</span>
                <input pInputText [(ngModel)]="form.pUpiid" name="upiId" />
              </label>
            }
          }
          <label class="field span-2">
            <span>Remarks</span>
            <textarea
              pTextarea
              rows="3"
              [(ngModel)]="form.pRemarks"
              name="remarks"
              maxlength="500"
            ></textarea>
          </label>
        </div>
      </p-card>

      @if (formName() !== 'Moratorium') {
        <p-card header="Installment Schedule">
          <app-data-grid
            [rows]="installments()"
            [columns]="installmentColumns"
            [showSearch]="false"
            [showExportExcel]="false"
            [showExportPdf]="false"
            [paginator]="false"
            emptyMessage="Pick a transaction date to load installments."
          />
        </p-card>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .rcp-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .rh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .rh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem 1rem;
      }
      .summary div { display: flex; flex-direction: column; }
      .summary span { font-size: 0.75rem; color: var(--p-text-muted-color, var(--p-surface-500)); text-transform: uppercase; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(180px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-2 { grid-column: span 2; }
      .totals { margin-top: 0.5rem; text-align: right; }
    `,
  ],
})
export class ReceiptsShellComponent implements OnInit {
  private readonly api = inject(LoanReceiptsService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly modeOptions = MODE_OPTIONS;
  protected readonly duesTypeOptions = DUES_TYPE_OPTIONS;
  protected readonly interestModeOptions = INTEREST_MODE_OPTIONS;

  protected readonly formName = signal<ReceiptFormName>('Receipt');
  protected readonly applicationId = signal<string>('');
  protected readonly loanInfo = signal<{
    pContactName?: string;
    pLoanName?: string;
    pBalance?: number;
    pNextEmiDate?: string;
    [key: string]: unknown;
  } | null>(null);
  protected readonly particulars = signal<ParticularRow[]>([]);
  protected readonly installments = signal<InstallmentDueRow[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected form: ReceiptForm = { ...EMPTY_FORM };

  protected readonly errors = signal<{
    pDattransdate: string;
    pAmountReceived: string;
  }>({ pDattransdate: '', pAmountReceived: '' });

  protected readonly title = computed(() => {
    switch (this.formName()) {
      case 'Receipt':
        return 'Loan Receipt';
      case 'PartPayment':
        return 'Part Payment';
      case 'Moratorium':
        return 'Moratorium';
      default:
        return 'Loan Transaction';
    }
  });

  protected readonly formCardHeader = computed(() =>
    this.formName() === 'Moratorium' ? 'Moratorium Details' : 'Receipt Details',
  );

  protected readonly totalParticulars = computed(() =>
    this.particulars().reduce((acc, p) => acc + (p.pParticularAmount ?? 0), 0),
  );

  protected readonly particularColumns: DataGridColumn<ParticularRow>[] = [
    { field: 'pParticularName', header: 'Particular' },
    {
      field: 'pParticularAmount',
      header: 'Amount',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
  ];

  protected readonly installmentColumns: DataGridColumn<InstallmentDueRow>[] = [
    { field: 'pInstallmentNo', header: '#', align: 'center' },
    { field: 'pDueDate', header: 'Due Date', align: 'center' },
    {
      field: 'pPrincipal',
      header: 'Principal',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pInterest',
      header: 'Interest',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pPenalInterest',
      header: 'Penal',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pTotal',
      header: 'Total',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
  ];

  protected readonly isValid = computed(() => {
    const f = this.form;
    if (this.formName() === 'Moratorium') {
      return !!f.pMoratoriumDate && !!f.pMoratoriumMonths;
    }
    return !!f.pDattransdate && !!f.pAmountReceived && f.pAmountReceived > 0;
  });

  ngOnInit(): void {
    const dataFormName = this.route.snapshot.data['formName'] as ReceiptFormName | undefined;
    if (dataFormName) this.formName.set(dataFormName);
    const id = this.route.snapshot.paramMap.get('applicationId') ?? '';
    this.applicationId.set(id);
    this.form.pVchapplicationid = id;
    if (id) this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.getLoanDetailsForReceipt(this.applicationId()).subscribe({
      next: (data) => this.loanInfo.set(data as Record<string, unknown> | null),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load loan'),
      complete: () => this.loader.hide(),
    });

    if (this.formName() !== 'Moratorium') {
      this.api
        .getParticulars(
          this.applicationId(),
          this.toIso(this.form.pDattransdate ?? new Date()),
          this.formName(),
        )
        .subscribe({
          next: (rows) => this.particulars.set(rows ?? []),
        });
      this.reloadInstallments();
    }
  }

  protected reloadInstallments(): void {
    if (this.formName() === 'Moratorium') return;
    this.api
      .getInstallmentsView(
        this.applicationId(),
        this.toIso(this.form.pDattransdate ?? new Date()),
        this.form.pDuesType,
      )
      .subscribe({
        next: (rows) => this.installments.set(rows ?? []),
      });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pDattransdate: this.form.pDattransdate ? '' : 'Date is required.',
        pAmountReceived:
          this.form.pAmountReceived && this.form.pAmountReceived > 0
            ? ''
            : 'Amount is required.',
      });
      return;
    }
    this.saving.set(true);
    const payload = {
      ...this.form,
      pParticulars: this.particulars(),
    };
    const op =
      this.formName() === 'PartPayment'
        ? this.api.savePartPayment(payload)
        : this.formName() === 'Moratorium'
          ? this.api.saveMoratorium(payload)
          : this.api.saveReceipt(payload);
    op.subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.back();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected back(): void {
    const path =
      this.formName() === 'PartPayment'
        ? '/loans/PartPaymentView'
        : this.formName() === 'Moratorium'
          ? '/loans/MoratoriumView'
          : '/loans/LoanreceiptView';
    void this.router.navigate([path]);
  }

  private toIso(d: Date | string): string {
    const date = d instanceof Date ? d : new Date(d);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
}
