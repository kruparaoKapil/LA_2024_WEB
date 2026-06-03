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
  ApprovalService,
  type ApprovalRow,
} from '../services/approval.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

const DECISION_OPTIONS = [
  { label: 'Approve', value: 'APPROVED' },
  { label: 'Reject', value: 'REJECTED' },
  { label: 'Hold', value: 'PENDING' },
];

interface ChargeRow {
  pChargesName: string;
  pChargesType: string;
  pChargesValue: number;
  pCalculatedAmount: number;
  [key: string]: unknown;
}

interface ApprovalDecision {
  pVchapplicationid: string;
  pApprovedAmount: number | null;
  pApprovedTenure: number | null;
  pInterestRate: number | null;
  pApprovalDate: Date | null;
  pApprovalStatus: string;
  pRemarks: string;
  [key: string]: unknown;
}

const EMPTY_DECISION: ApprovalDecision = {
  pVchapplicationid: '',
  pApprovedAmount: null,
  pApprovedTenure: null,
  pInterestRate: null,
  pApprovalDate: null,
  pApprovalStatus: 'APPROVED',
  pRemarks: '',
};

/**
 * Approval shell — applicant summary + decision form + computed
 * loan-wise charges grid. Replaces the multi-thousand-LOC legacy
 * `ApprovalCreationComponent`.
 */
@Component({
  selector: 'app-approval-shell',
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
    <div class="approval-shell">
      <header class="ap-header">
        <div>
          <h2>Loan Approval</h2>
          <p class="muted">
            Application: <strong>{{ applicationId() }}</strong>
          </p>
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
        <p-card header="Applicant Summary">
          <div class="summary">
            <div><span>Applicant</span><strong>{{ s.pContactName }}</strong></div>
            <div><span>Loan</span><strong>{{ s.pLoanName }}</strong></div>
            <div><span>Scheme</span><strong>{{ s.pSchemeName }}</strong></div>
            <div>
              <span>Requested</span>
              <strong>{{ s.pLoanAmount | number: '1.0-0':'en-IN' }}</strong>
            </div>
          </div>
        </p-card>
      }

      <p-card header="Decision">
        <div class="grid">
          <label class="field">
            <span>Approved Amount<sup>*</sup></span>
            <app-currency-input
              [(ngModel)]="decision.pApprovedAmount"
              (ngModelChange)="recomputeCharges()"
              name="approvedAmount"
            />
            <app-validation-message [message]="errors().pApprovedAmount" />
          </label>
          <label class="field">
            <span>Tenure (months)<sup>*</sup></span>
            <input
              type="number"
              [(ngModel)]="decision.pApprovedTenure"
              (ngModelChange)="recomputeCharges()"
              name="tenure"
              min="1"
              max="600"
            />
            <app-validation-message [message]="errors().pApprovedTenure" />
          </label>
          <label class="field">
            <span>Interest Rate (%)<sup>*</sup></span>
            <input
              type="number"
              [(ngModel)]="decision.pInterestRate"
              name="interestRate"
              min="0"
              max="100"
              step="0.01"
            />
            <app-validation-message [message]="errors().pInterestRate" />
          </label>
          <label class="field">
            <span>Approval Date</span>
            <app-date-input
              [(ngModel)]="decision.pApprovalDate"
              name="approvalDate"
              [maxDate]="today"
            />
          </label>
          <label class="field">
            <span>Decision</span>
            <app-select
              [options]="decisionOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="decision.pApprovalStatus"
              name="status"
              [showClear]="false"
            />
          </label>
          <label class="field span-2">
            <span>Remarks</span>
            <textarea
              pTextarea
              rows="3"
              [(ngModel)]="decision.pRemarks"
              name="remarks"
              maxlength="500"
            ></textarea>
          </label>
        </div>
      </p-card>

      <p-card header="Loan-wise Charges">
        <app-data-grid
          [rows]="charges()"
          [columns]="chargeColumns"
          [showSearch]="false"
          [showExportExcel]="false"
          [showExportPdf]="false"
          [paginator]="false"
          emptyMessage="Enter amount + tenure to compute charges."
        />
        @if (charges().length > 0) {
          <div class="totals">
            Total charges:
            <strong>{{ totalCharges() | number: '1.0-0':'en-IN' }}</strong>
          </div>
        }
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .approval-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .ap-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .ap-header h2 { margin: 0; }
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
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-2 { grid-column: span 2; }
      .totals { margin-top: 0.5rem; text-align: right; }
    `,
  ],
})
export class ApprovalShellComponent implements OnInit {
  private readonly api = inject(ApprovalService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly decisionOptions = DECISION_OPTIONS;

  protected readonly applicationId = signal<string>('');
  protected readonly summary = signal<ApprovalRow | null>(null);
  protected readonly charges = signal<ChargeRow[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected decision: ApprovalDecision = { ...EMPTY_DECISION };

  protected readonly errors = signal<{
    pApprovedAmount: string;
    pApprovedTenure: string;
    pInterestRate: string;
  }>({ pApprovedAmount: '', pApprovedTenure: '', pInterestRate: '' });

  protected readonly chargeColumns: DataGridColumn<ChargeRow>[] = [
    { field: 'pChargesName', header: 'Charge' },
    { field: 'pChargesType', header: 'Type' },
    {
      field: 'pChargesValue',
      header: 'Value',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pCalculatedAmount',
      header: 'Amount',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
  ];

  protected readonly totalCharges = computed(() =>
    this.charges().reduce((acc, r) => acc + (r.pCalculatedAmount ?? 0), 0),
  );

  protected readonly isValid = computed(() => {
    const d = this.decision;
    return (
      !!d.pApprovedAmount &&
      d.pApprovedAmount > 0 &&
      !!d.pApprovedTenure &&
      d.pApprovedTenure > 0 &&
      d.pInterestRate !== null &&
      d.pInterestRate >= 0
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('applicationId') ?? '';
    this.applicationId.set(id);
    this.decision.pVchapplicationid = id;
    if (id) this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.getApprovalById(this.applicationId()).subscribe({
      next: (data) => {
        const d = data as (ApprovalRow & ApprovalDecision) | null;
        if (!d) return;
        this.summary.set(d);
        this.decision = {
          ...EMPTY_DECISION,
          pVchapplicationid: this.applicationId(),
          pApprovedAmount: d.pApprovedAmount ?? d.pLoanAmount ?? null,
          pApprovedTenure:
            (d['pApprovedTenure'] as number) ?? (d['pTenure'] as number) ?? null,
          pInterestRate: (d['pInterestRate'] as number) ?? null,
          pApprovalDate: (d['pApprovalDate'] as Date) ?? null,
          pApprovalStatus: d.pStatus ?? 'APPROVED',
          pRemarks: (d['pRemarks'] as string) ?? '',
        };
        this.recomputeCharges();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load application');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected recomputeCharges(): void {
    const s = this.summary();
    const amt = this.decision.pApprovedAmount ?? 0;
    const tenor = this.decision.pApprovedTenure ?? 0;
    if (!s || !amt || !tenor) {
      this.charges.set([]);
      return;
    }
    this.api
      .getLoanWiseCharges({
        loanName: s.pLoanName ?? '',
        amount: amt,
        tenor,
        applicantType: (s['pApplicantType'] as string) ?? 'Individual',
        loanPayIn: (s['pLoanPayIn'] as string) ?? 'EMI',
        transDate: new Date().toISOString().slice(0, 10),
        schemeId: (s['pSchemeId'] as number) ?? 0,
      })
      .subscribe({
        next: (rows) => this.charges.set((rows as ChargeRow[]) ?? []),
        error: (err) =>
          this.toast.error(err?.message ?? 'Failed to compute charges'),
      });
  }

  protected save(): void {
    if (!this.isValid()) {
      const errs = {
        pApprovedAmount:
          this.decision.pApprovedAmount && this.decision.pApprovedAmount > 0
            ? ''
            : 'Approved amount is required.',
        pApprovedTenure:
          this.decision.pApprovedTenure && this.decision.pApprovedTenure > 0
            ? ''
            : 'Tenure is required.',
        pInterestRate:
          this.decision.pInterestRate !== null && this.decision.pInterestRate >= 0
            ? ''
            : 'Interest rate is required.',
      };
      this.errors.set(errs);
      return;
    }

    this.saving.set(true);
    const payload = {
      ...this.decision,
      pCharges: this.charges(),
    };
    this.api.saveApproval(payload).subscribe({
      next: () => {
        this.toast.success('Approval saved.');
        this.back();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected back(): void {
    void this.router.navigate(['/loans/ApprovalView']);
  }
}
