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

import {
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  DisbursementService,
  type DisbursementRow,
} from '../services/disbursement.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

const MODE_OPTIONS = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'NEFT', value: 'NEFT' },
  { label: 'RTGS', value: 'RTGS' },
  { label: 'IMPS', value: 'IMPS' },
  { label: 'UPI', value: 'UPI' },
];

const EMI_TYPE_OPTIONS = [
  { label: 'Standard EMI', value: 'EMI' },
  { label: 'Advance EMI', value: 'AdvanceEMI' },
  { label: 'Bullet', value: 'Bullet' },
];

interface DisbursementForm {
  pVchapplicationid: string;
  pDisbursementMode: string;
  pDisbursementDate: Date | null;
  pFirstInstallmentDate: Date | null;
  pEmiDay: number | null;
  pDisbursementAmount: number | null;
  pAdvanceEmiAmount: number;
  pBrokenDays: number;
  pBrokenAmount: number;
  pEmiType: string;
  pBankAccountNo: string;
  pIfscCode: string;
  pChequeNo: string;
  pTransactionRefNo: string;
  pRemarks: string;
  [key: string]: unknown;
}

interface EmiRow {
  pEmiNo: number;
  pEmiDate: string;
  pPrincipal: number;
  pInterest: number;
  pEmiAmount: number;
  pBalance: number;
  [key: string]: unknown;
}

const EMPTY_FORM: DisbursementForm = {
  pVchapplicationid: '',
  pDisbursementMode: 'NEFT',
  pDisbursementDate: null,
  pFirstInstallmentDate: null,
  pEmiDay: null,
  pDisbursementAmount: null,
  pAdvanceEmiAmount: 0,
  pBrokenDays: 0,
  pBrokenAmount: 0,
  pEmiType: 'EMI',
  pBankAccountNo: '',
  pIfscCode: '',
  pChequeNo: '',
  pTransactionRefNo: '',
  pRemarks: '',
};

/**
 * Disbursement shell — captures payout details (mode, dates, amounts)
 * and shows the live EMI schedule preview. Replaces multi-thousand-LOC
 * legacy disbursement screen.
 */
@Component({
  selector: 'app-disbursement-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    DataGridComponent,
    CurrencyInputComponent,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="dis-shell">
      <header class="ds-header">
        <div>
          <h2>Loan Disbursement</h2>
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

      @if (summary(); as s) {
        <p-card header="Approved Application">
          <div class="summary">
            <div><span>Applicant</span><strong>{{ s.pContactName }}</strong></div>
            <div><span>Loan</span><strong>{{ s.pLoanName }}</strong></div>
            <div>
              <span>Approved</span>
              <strong>{{ s.pApprovedAmount | number: '1.0-0':'en-IN' }}</strong>
            </div>
          </div>
        </p-card>
      }

      <p-card header="Disbursement Details">
        <div class="grid">
          <label class="field">
            <span>Mode<sup>*</sup></span>
            <app-select
              [options]="modeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="form.pDisbursementMode"
              name="mode"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>EMI Type</span>
            <app-select
              [options]="emiTypeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="form.pEmiType"
              (ngModelChange)="recomputeAdvanceEmi()"
              name="emiType"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>Disbursement Date<sup>*</sup></span>
            <app-date-input
              [(ngModel)]="form.pDisbursementDate"
              (ngModelChange)="recomputeBrokenDays()"
              name="disbDate"
            />
            <app-validation-message [message]="errors().pDisbursementDate" />
          </label>
          <label class="field">
            <span>First Installment Date<sup>*</sup></span>
            <app-date-input
              [(ngModel)]="form.pFirstInstallmentDate"
              (ngModelChange)="recomputeBrokenDays()"
              name="firstInst"
            />
            <app-validation-message [message]="errors().pFirstInstallmentDate" />
          </label>
          <label class="field">
            <span>EMI Day</span>
            <input
              type="number"
              [(ngModel)]="form.pEmiDay"
              (ngModelChange)="recomputeBrokenDays()"
              name="emiDay"
              min="1"
              max="31"
            />
          </label>
          <label class="field">
            <span>Disbursement Amount<sup>*</sup></span>
            <app-currency-input
              [(ngModel)]="form.pDisbursementAmount"
              (ngModelChange)="recomputeBrokenDays()"
              name="disbAmount"
            />
            <app-validation-message [message]="errors().pDisbursementAmount" />
          </label>
          <label class="field">
            <span>Broken Days</span>
            <input
              type="number"
              [ngModel]="form.pBrokenDays"
              name="brokenDays"
              readonly
            />
          </label>
          <label class="field">
            <span>Broken Amount</span>
            <app-currency-input
              [ngModel]="form.pBrokenAmount"
              name="brokenAmount"
            />
          </label>
          @if (form.pEmiType === 'AdvanceEMI') {
            <label class="field">
              <span>Advance EMI</span>
              <app-currency-input
                [ngModel]="form.pAdvanceEmiAmount"
                name="advanceEmi"
              />
            </label>
          }
          @if (form.pDisbursementMode === 'Cheque') {
            <label class="field">
              <span>Cheque No</span>
              <input
                [(ngModel)]="form.pChequeNo"
                name="chequeNo"
                maxlength="20"
              />
            </label>
          }
          @if (form.pDisbursementMode !== 'Cash' && form.pDisbursementMode !== 'Cheque') {
            <label class="field">
              <span>Bank A/C No</span>
              <input
                [(ngModel)]="form.pBankAccountNo"
                name="bankAcct"
                maxlength="20"
              />
            </label>
            <label class="field">
              <span>IFSC</span>
              <input
                [(ngModel)]="form.pIfscCode"
                name="ifsc"
                maxlength="11"
              />
            </label>
            <label class="field">
              <span>Reference No</span>
              <input
                [(ngModel)]="form.pTransactionRefNo"
                name="ref"
                maxlength="40"
              />
            </label>
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

      <p-card header="EMI Schedule (Preview)">
        <app-data-grid
          [rows]="emiRows()"
          [columns]="emiColumns"
          [showSearch]="false"
          [showExportExcel]="true"
          [showExportPdf]="true"
          [paginator]="true"
          [pageSize]="12"
          exportFilename="emi-schedule"
          emptyMessage="EMI schedule will appear after save."
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .dis-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .ds-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .ds-header h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
    `,
  ],
})
export class DisbursementShellComponent implements OnInit {
  private readonly api = inject(DisbursementService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly modeOptions = MODE_OPTIONS;
  protected readonly emiTypeOptions = EMI_TYPE_OPTIONS;

  protected readonly applicationId = signal<string>('');
  protected readonly summary = signal<DisbursementRow | null>(null);
  protected readonly emiRows = signal<EmiRow[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected form: DisbursementForm = { ...EMPTY_FORM };

  protected readonly errors = signal<{
    pDisbursementDate: string;
    pFirstInstallmentDate: string;
    pDisbursementAmount: string;
  }>({
    pDisbursementDate: '',
    pFirstInstallmentDate: '',
    pDisbursementAmount: '',
  });

  protected readonly emiColumns: DataGridColumn<EmiRow>[] = [
    { field: 'pEmiNo', header: '#', align: 'center' },
    { field: 'pEmiDate', header: 'Date', align: 'center' },
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
      field: 'pEmiAmount',
      header: 'EMI',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pBalance',
      header: 'Balance',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
  ];

  protected readonly isValid = computed(() => {
    const f = this.form;
    return (
      !!f.pDisbursementDate &&
      !!f.pFirstInstallmentDate &&
      !!f.pDisbursementAmount &&
      f.pDisbursementAmount > 0
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('applicationId') ?? '';
    this.applicationId.set(id);
    this.form.pVchapplicationid = id;
    if (id) this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.getApprovedById(this.applicationId()).subscribe({
      next: (data) => {
        const d = data as DisbursementRow | null;
        this.summary.set(d);
        if (d) {
          this.form.pDisbursementAmount =
            d.pApprovedAmount ?? this.form.pDisbursementAmount;
        }
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load application');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected recomputeBrokenDays(): void {
    const s = this.summary();
    const f = this.form;
    if (
      !s ||
      !f.pDisbursementDate ||
      !f.pFirstInstallmentDate ||
      !f.pEmiDay ||
      !f.pDisbursementAmount
    ) {
      return;
    }
    this.api
      .getBrokenDaysAndAmount({
        disbursementMode: f.pDisbursementMode,
        vchApplicationId: this.applicationId(),
        emiDay: f.pEmiDay,
        approvedLoanAmount: s.pApprovedAmount ?? 0,
        disbursableAmount: f.pDisbursementAmount,
        interestRate: (s['pInterestRate'] as number) ?? 0,
        tenure: (s['pApprovedTenure'] as number) ?? 0,
        disburseDate: this.toIso(f.pDisbursementDate),
        firstInstallmentDate: this.toIso(f.pFirstInstallmentDate),
        disbursementStatus: 'Approved',
        loanPayIn: (s['pLoanPayIn'] as string) ?? 'EMI',
      })
      .subscribe({
        next: (data) => {
          const r = data as { pBrokenDays?: number; pBrokenAmount?: number } | null;
          this.form = {
            ...this.form,
            pBrokenDays: r?.pBrokenDays ?? 0,
            pBrokenAmount: r?.pBrokenAmount ?? 0,
          };
        },
      });
  }

  protected recomputeAdvanceEmi(): void {
    const s = this.summary();
    const f = this.form;
    if (f.pEmiType !== 'AdvanceEMI' || !s || !f.pDisbursementAmount) {
      this.form = { ...this.form, pAdvanceEmiAmount: 0 };
      return;
    }
    this.api
      .getAdvanceEmiAmount({
        disburseAmount: f.pDisbursementAmount,
        interestRate: (s['pInterestRate'] as number) ?? 0,
        tenure: (s['pApprovedTenure'] as number) ?? 0,
        emiType: f.pEmiType,
      })
      .subscribe({
        next: (data) => {
          const r = data as { pAdvanceEmiAmount?: number } | null;
          this.form = {
            ...this.form,
            pAdvanceEmiAmount: r?.pAdvanceEmiAmount ?? 0,
          };
        },
      });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pDisbursementDate: this.form.pDisbursementDate
          ? ''
          : 'Disbursement date is required.',
        pFirstInstallmentDate: this.form.pFirstInstallmentDate
          ? ''
          : 'First installment date is required.',
        pDisbursementAmount:
          this.form.pDisbursementAmount && this.form.pDisbursementAmount > 0
            ? ''
            : 'Disbursement amount is required.',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveDisbursement(this.form).subscribe({
      next: () => {
        this.toast.success('Disbursement saved.');
        this.api
          .getEmiChartReport(this.applicationId())
          .subscribe({
            next: (rows) => this.emiRows.set((rows as EmiRow[]) ?? []),
          });
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected back(): void {
    void this.router.navigate(['/loans/DisbursmentView']);
  }

  private toIso(d: Date | string | null): string {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
}
