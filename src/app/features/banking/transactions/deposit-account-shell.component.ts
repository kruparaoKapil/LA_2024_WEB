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
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
  TabsComponent,
  type TabItem,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  DepositsService,
  type SchemeOption,
} from '../services/deposits.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const PAYMENT_MODE_OPTIONS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'NEFT/RTGS', value: 'NEFT' },
  { label: 'UPI', value: 'UPI' },
];

interface NomineeRow {
  pNomineeName: string;
  pRelation: string;
  pAllocation: number;
  pIsPrimary: boolean;
  ptypeofoperation: 'CREATE' | 'UPDATE' | 'DELETE' | 'OLD';
  [key: string]: unknown;
}

interface DepositAccountForm {
  pAccountId?: number;
  pAccountNo?: string;
  pBranchName: string;
  pMemberCode: string;
  pMemberName: string;
  pMemberType: string;
  pContactType: string;
  pApplicantType: string;
  pSchemeId: number | null;
  pSchemeName: string;
  pTenureMode: string;
  pTenure: number | null;
  pDepositAmount: number | null;
  pInterestRate: number | null;
  pInterestPayout: string;
  pIssueDate: Date | null;
  pMaturityAmount: number;
  pMaturityDate: Date | null;
  pPaymentMode: string;
  pNominees: NomineeRow[];
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_FORM: DepositAccountForm = {
  pBranchName: '',
  pMemberCode: '',
  pMemberName: '',
  pMemberType: '',
  pContactType: 'Individual',
  pApplicantType: 'Applicant',
  pSchemeId: null,
  pSchemeName: '',
  pTenureMode: 'Months',
  pTenure: null,
  pDepositAmount: null,
  pInterestRate: null,
  pInterestPayout: '',
  pIssueDate: new Date(),
  pMaturityAmount: 0,
  pMaturityDate: null,
  pPaymentMode: 'CASH',
  pNominees: [],
  ptypeofoperation: 'CREATE',
};

const EMPTY_NOMINEE: NomineeRow = {
  pNomineeName: '',
  pRelation: '',
  pAllocation: 100,
  pIsPrimary: true,
  ptypeofoperation: 'CREATE',
};

interface MemberOption {
  pMemberCode: string;
  pMemberName: string;
  pMemberType: string;
  [key: string]: unknown;
}

interface BranchOption {
  pBranchName: string;
  [key: string]: unknown;
}

/**
 * Deposit account shell — covers FD-AC-Creation and RD-AC-Creation.
 * Replaces the multi-tab legacy flow (Member-Scheme + Joint-Member +
 * Nominee + Referral, ~1500 LOC across 3 components) with a 3-tab
 * PrimeNG TabView and signal-driven cascade:
 *   Tab 1 — Member + Scheme: branch, member-type, member, applicant,
 *           scheme, tenure-mode, tenure, deposit amount, interest rate,
 *           live maturity calculation.
 *   Tab 2 — Nominees (CVA-style list with primary + allocation).
 *   Tab 3 — Payment mode + issue date.
 */
@Component({
  selector: 'app-deposit-account-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CurrencyInputComponent,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
    TabsComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="da-shell">
      <header class="dh">
        <div>
          <h2>{{ heading() }}</h2>
          <p class="muted">{{ subtitle() }}</p>
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
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-times"
            (onClick)="cancel()"
          />
        </div>
      </header>

      <app-tabs [items]="tabs" [(active)]="activeTab">
        <ng-template #tabContent let-id>
          @switch (id) {
            @case ('member-scheme') {
          <div class="grid">
            <label class="field">
              <span>Branch<sup>*</sup></span>
              <app-select
                [options]="branches()"
                optionLabel="pBranchName"
                optionValue="pBranchName"
                [(ngModel)]="form.pBranchName"
                placeholder="Pick branch"
              />
            </label>
            <label class="field">
              <span>Member<sup>*</sup></span>
              <app-select
                [options]="members()"
                optionLabel="pMemberName"
                optionValue="pMemberCode"
                [(ngModel)]="form.pMemberCode"
                (ngModelChange)="onMemberChange()"
                placeholder="Pick member"
              />
              <app-validation-message [message]="errors().pMemberCode" />
            </label>
            <label class="field">
              <span>Scheme<sup>*</sup></span>
              <app-select
                [options]="schemes()"
                optionLabel="pSchemename"
                optionValue="pSchemeid"
                [(ngModel)]="form.pSchemeId"
                (ngModelChange)="onSchemeChange()"
                placeholder="Pick scheme"
              />
              <app-validation-message [message]="errors().pSchemeId" />
            </label>
            <label class="field">
              <span>Tenure<sup>*</sup></span>
              <input
                type="number"
                pInputText
                [(ngModel)]="form.pTenure"
                (ngModelChange)="recomputeMaturity()"
                name="tenure"
                min="1"
                max="600"
              />
              <app-validation-message [message]="errors().pTenure" />
            </label>
            <label class="field">
              <span>Deposit Amount<sup>*</sup></span>
              <app-currency-input
                [(ngModel)]="form.pDepositAmount"
                (ngModelChange)="recomputeMaturity()"
                name="deposit"
              />
              <app-validation-message [message]="errors().pDepositAmount" />
            </label>
            <label class="field">
              <span>Interest Rate (%)<sup>*</sup></span>
              <input
                type="number"
                pInputText
                [(ngModel)]="form.pInterestRate"
                (ngModelChange)="recomputeMaturity()"
                name="rate"
                min="0"
                max="100"
                step="0.01"
              />
              <app-validation-message [message]="errors().pInterestRate" />
            </label>
            <label class="field">
              <span>Interest Payout</span>
              <input pInputText [value]="form.pInterestPayout" readonly />
            </label>
            <label class="field">
              <span>Maturity Amount</span>
              <input
                pInputText
                [value]="form.pMaturityAmount | number: '1.0-0':'en-IN'"
                readonly
              />
            </label>
                <label class="field">
                  <span>Maturity Date</span>
                  <app-date-input
                    [(ngModel)]="form.pMaturityDate"
                    name="maturityDate"
                    [disabled]="true"
                  />
                </label>
              </div>
            }
            @case ('nominees') {
              <div class="lines-toolbar">
                <p-button
                  label="Add Nominee"
                  icon="pi pi-plus"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="addNominee()"
                />
              </div>
              <app-data-grid
                [rows]="visibleNominees()"
                [columns]="nomineeColumns"
                [showSearch]="false"
                [showExportExcel]="false"
                [showExportPdf]="false"
                [paginator]="false"
                emptyMessage="No nominees yet."
              />
              @if (editingNomineeIndex() !== null) {
                <div class="line-editor">
                  <h4>Editing nominee #{{ (editingNomineeIndex() ?? 0) + 1 }}</h4>
                  <div class="grid">
                    <label class="field">
                      <span>Name<sup>*</sup></span>
                      <input pInputText [(ngModel)]="editingNominee.pNomineeName" name="nomName" maxlength="100" />
                    </label>
                    <label class="field">
                      <span>Relation<sup>*</sup></span>
                      <input pInputText [(ngModel)]="editingNominee.pRelation" name="nomRel" maxlength="50" />
                    </label>
                    <label class="field">
                      <span>Allocation %<sup>*</sup></span>
                      <input
                        type="number"
                        pInputText
                        [(ngModel)]="editingNominee.pAllocation"
                        name="nomAlloc"
                        min="1"
                        max="100"
                      />
                    </label>
                  </div>
                  <div class="line-actions">
                    <p-button label="Apply" icon="pi pi-check" size="small" (onClick)="applyNominee()" />
                    <p-button label="Cancel" severity="secondary" [outlined]="true" icon="pi pi-times" size="small" (onClick)="editingNomineeIndex.set(null)" />
                  </div>
                </div>
              }
            }
            @case ('payment') {
              <div class="grid">
                <label class="field">
                  <span>Issue Date<sup>*</sup></span>
                  <app-date-input
                    [(ngModel)]="form.pIssueDate"
                    (ngModelChange)="recomputeMaturity()"
                    name="issueDate"
                    [maxDate]="today"
                  />
                </label>
                <label class="field">
                  <span>Payment Mode<sup>*</sup></span>
                  <app-select
                    [options]="paymentModeOptions"
                    optionLabel="label"
                    optionValue="value"
                    [(ngModel)]="form.pPaymentMode"
                    [showClear]="false"
                  />
                </label>
              </div>
            }
          }
        </ng-template>
      </app-tabs>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .da-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .dh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .dh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .lines-toolbar { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
      .line-editor { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--p-surface-300); }
      .line-editor h4 { margin: 0 0 0.5rem 0; }
      .line-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    `,
  ],
})
export class DepositAccountShellComponent implements OnInit {
  private readonly api = inject(DepositsService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly paymentModeOptions = PAYMENT_MODE_OPTIONS;

  protected readonly tabs: TabItem[] = [
    { id: 'member-scheme', label: 'Member & Scheme' },
    { id: 'nominees', label: 'Nominees' },
    { id: 'payment', label: 'Payment' },
  ];
  protected activeTab = 'member-scheme';

  protected readonly branches = signal<BranchOption[]>([]);
  protected readonly members = signal<MemberOption[]>([]);
  protected readonly schemes = signal<SchemeOption[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected form: DepositAccountForm = { ...EMPTY_FORM, pNominees: [] };
  protected readonly editingNomineeIndex = signal<number | null>(null);
  protected editingNominee: NomineeRow = { ...EMPTY_NOMINEE };

  protected readonly errors = signal<{
    pMemberCode: string;
    pSchemeId: string;
    pTenure: string;
    pDepositAmount: string;
    pInterestRate: string;
  }>({
    pMemberCode: '',
    pSchemeId: '',
    pTenure: '',
    pDepositAmount: '',
    pInterestRate: '',
  });

  protected readonly visibleNominees = computed(() =>
    this.form.pNominees.filter((n) => n.ptypeofoperation !== 'DELETE'),
  );

  protected readonly heading = computed(() =>
    this.api.editingDeposit() ? 'Edit FD Account' : 'New FD Account',
  );
  protected readonly subtitle = computed(() => {
    const dep = this.api.editingDeposit();
    return dep ? `Account ${dep.accountNo}` : 'Open a new fixed deposit account.';
  });

  protected readonly isValid = computed(() => {
    const f = this.form;
    return (
      !!f.pMemberCode &&
      !!f.pSchemeId &&
      !!f.pTenure &&
      !!f.pDepositAmount &&
      f.pDepositAmount > 0 &&
      typeof f.pInterestRate === 'number' &&
      f.pInterestRate > 0 &&
      this.visibleNominees().reduce((s, n) => s + (n.pAllocation ?? 0), 0) <= 100
    );
  });

  protected readonly nomineeColumns: DataGridColumn<NomineeRow>[] = [
    { field: 'pNomineeName', header: 'Name' },
    { field: 'pRelation', header: 'Relation' },
    {
      field: 'pAllocation',
      header: 'Allocation %',
      align: 'right',
      format: (v) => (typeof v === 'number' ? `${v}%` : ''),
    },
    {
      field: 'pIsPrimary',
      header: 'Primary',
      align: 'center',
      format: (v) => (v ? 'Yes' : 'No'),
    },
  ];

  ngOnInit(): void {
    this.api.getBranches().subscribe({
      next: (rows) => this.branches.set((rows as BranchOption[]) ?? []),
    });
    this.api.listMembers('Individual', '').subscribe({
      next: (rows) => this.members.set((rows as MemberOption[]) ?? []),
    });
    this.api.getFdSchemes('Applicant', '').subscribe({
      next: (rows) => this.schemes.set(rows ?? []),
    });

    const editing = this.api.editingDeposit();
    if (editing) {
      this.loader.show();
      this.api
        .getDepositForEdit({
          accountNo: editing.accountNo,
          accountId: editing.accountId,
        })
        .subscribe({
          next: (data) => {
            if (data && typeof data === 'object') {
              this.form = {
                ...EMPTY_FORM,
                ...(data as Record<string, unknown>),
                pNominees:
                  ((data as Record<string, unknown>)['pNominees'] as NomineeRow[]) ?? [],
              };
            }
          },
          error: (err) => this.toast.error(err?.message ?? 'Failed to load account'),
          complete: () => this.loader.hide(),
        });
    }
  }

  protected onMemberChange(): void {
    const member = this.members().find((m) => m.pMemberCode === this.form.pMemberCode);
    if (!member) return;
    this.form.pMemberName = member.pMemberName;
    this.form.pMemberType = member.pMemberType;
  }

  protected onSchemeChange(): void {
    const scheme = this.schemes().find((s) => s.pSchemeid === this.form.pSchemeId);
    if (!scheme) return;
    this.form.pSchemeName = scheme.pSchemename ?? '';
    this.recomputeMaturity();
  }

  protected recomputeMaturity(): void {
    const f = this.form;
    if (
      !f.pDepositAmount ||
      !f.pInterestRate ||
      !f.pTenure ||
      !f.pIssueDate
    ) {
      this.form.pMaturityAmount = 0;
      this.form.pMaturityDate = null;
      return;
    }
    // Simple-interest fallback: backend recomputes server-side on save.
    const months =
      f.pTenureMode === 'Months'
        ? f.pTenure
        : f.pTenureMode === 'Years'
          ? f.pTenure * 12
          : Math.round((f.pTenure / 30) * 100) / 100;
    const interest = (f.pDepositAmount * f.pInterestRate * months) / 1200;
    this.form.pMaturityAmount = Math.round((f.pDepositAmount + interest) * 100) / 100;
    const maturity = new Date(f.pIssueDate);
    if (f.pTenureMode === 'Years') maturity.setFullYear(maturity.getFullYear() + f.pTenure);
    else if (f.pTenureMode === 'Months') maturity.setMonth(maturity.getMonth() + f.pTenure);
    else maturity.setDate(maturity.getDate() + f.pTenure);
    this.form.pMaturityDate = maturity;
  }

  protected addNominee(): void {
    const next = [...this.form.pNominees, { ...EMPTY_NOMINEE }];
    this.form = { ...this.form, pNominees: next };
    this.editingNomineeIndex.set(next.length - 1);
    this.editingNominee = { ...EMPTY_NOMINEE };
  }

  protected applyNominee(): void {
    const idx = this.editingNomineeIndex();
    if (idx === null) return;
    const list = [...this.form.pNominees];
    const existing = list[idx];
    list[idx] = {
      ...existing,
      ...this.editingNominee,
      ptypeofoperation:
        existing.ptypeofoperation === 'OLD' ? 'UPDATE' : existing.ptypeofoperation,
    };
    this.form = { ...this.form, pNominees: list };
    this.editingNomineeIndex.set(null);
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pMemberCode: this.form.pMemberCode ? '' : 'Member is required.',
        pSchemeId: this.form.pSchemeId ? '' : 'Scheme is required.',
        pTenure: this.form.pTenure ? '' : 'Tenure is required.',
        pDepositAmount:
          this.form.pDepositAmount && this.form.pDepositAmount > 0
            ? ''
            : 'Deposit amount is required.',
        pInterestRate:
          typeof this.form.pInterestRate === 'number' && this.form.pInterestRate > 0
            ? ''
            : 'Interest rate is required.',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveMemberAndScheme(this.form).subscribe({
      next: () => {
        this.toast.success('Deposit account saved.');
        this.cancel();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate(['/banking/FDACCreationView']);
  }
}
