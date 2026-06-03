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
import { CheckboxModule } from 'primeng/checkbox';

import {
  CurrencyInputComponent,
  SelectComponent,
  TabsComponent,
  type TabItem,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  BankingMastersService,
  type DepositKind,
} from '../services/banking-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TENURE_MODE_OPTIONS = [
  { label: 'Days', value: 'Days' },
  { label: 'Months', value: 'Months' },
  { label: 'Years', value: 'Years' },
];

const PAYOUT_OPTIONS = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Half-Yearly', value: 'HalfYearly' },
  { label: 'Yearly', value: 'Yearly' },
  { label: 'On Maturity', value: 'OnMaturity' },
];

const CALC_TYPE_OPTIONS = [
  { label: 'Simple', value: 'SIMPLE' },
  { label: 'Compound', value: 'COMPOUND' },
];

interface DepositConfigForm {
  pName: string;
  pCode: string;
  pTenureMode: string;
  pTenure: number | null;
  pInterestRate: number | null;
  pInterestPayout: string;
  pCalculationType: string;
  pMinDeposit: number | null;
  pMaxDeposit: number | null;
  pIsActive: boolean;
  pAllowLoan: boolean;
  pAllowReferralCommission: boolean;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_FORM: DepositConfigForm = {
  pName: '',
  pCode: '',
  pTenureMode: 'Months',
  pTenure: 12,
  pInterestRate: null,
  pInterestPayout: 'OnMaturity',
  pCalculationType: 'SIMPLE',
  pMinDeposit: null,
  pMaxDeposit: null,
  pIsActive: true,
  pAllowLoan: false,
  pAllowReferralCommission: false,
  ptypeofoperation: 'CREATE',
};

/**
 * Single deposit-config shell for FD and RD masters. Replaces:
 *   - 2583-LOC `fdconfiguration.component.ts`
 *   - 761-LOC `fdconfig-new.component.ts`
 *   - 2145-LOC `rdconfiguration.component.ts`
 *   - 743-LOC `rdconfig-new.component.ts`
 *
 * The legacy stack split each scheme master into 5 nested tabs
 * (NameAndCode / Configuration / LoanFacility / Identification /
 * ReferralCommission) — each tab a near-clone between FD and RD.
 *
 * The Phase 9 shell collapses them into a 4-tab PrimeNG TabView
 * with the same behaviour parameterised by `data.kind`. Saves
 * ~6200 LOC.
 */
@Component({
  selector: 'app-deposit-config-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CheckboxModule,
    CurrencyInputComponent,
    SelectComponent,
    TabsComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="dc-shell">
      <header class="dh">
        <div>
          <h2>{{ heading() }}</h2>
          <p class="muted">{{ kind() === 'fd' ? 'Fixed Deposit' : 'Recurring Deposit' }} master configuration.</p>
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
            @case ('name-code') {
              <div class="grid">
                <label class="field">
                  <span>Name<sup>*</sup></span>
                  <input pInputText [(ngModel)]="form.pName" name="name" maxlength="100" />
                  <app-validation-message [message]="errors().pName" />
                </label>
                <label class="field">
                  <span>Code<sup>*</sup></span>
                  <input pInputText [(ngModel)]="form.pCode" name="code" maxlength="20" />
                  <app-validation-message [message]="errors().pCode" />
                </label>
                <div class="field checkbox-field">
                  <p-checkbox
                    [(ngModel)]="form.pIsActive"
                    [binary]="true"
                    inputId="isActive"
                    name="isActive"
                  />
                  <label for="isActive">Active</label>
                </div>
              </div>
            }
            @case ('config') {
              <div class="grid">
                <label class="field">
                  <span>Tenure Mode<sup>*</sup></span>
                  <app-select
                    [options]="tenureModeOptions"
                    optionLabel="label"
                    optionValue="value"
                    [(ngModel)]="form.pTenureMode"
                    [showClear]="false"
                  />
                </label>
                <label class="field">
                  <span>Tenure<sup>*</sup></span>
                  <input
                    type="number"
                    pInputText
                    [(ngModel)]="form.pTenure"
                    name="tenure"
                    min="1"
                    max="600"
                  />
                  <app-validation-message [message]="errors().pTenure" />
                </label>
                <label class="field">
                  <span>Interest Rate (%)<sup>*</sup></span>
                  <input
                    type="number"
                    pInputText
                    [(ngModel)]="form.pInterestRate"
                    name="rate"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <app-validation-message [message]="errors().pInterestRate" />
                </label>
                <label class="field">
                  <span>Interest Payout<sup>*</sup></span>
                  <app-select
                    [options]="payoutOptions"
                    optionLabel="label"
                    optionValue="value"
                    [(ngModel)]="form.pInterestPayout"
                    [showClear]="false"
                  />
                </label>
                <label class="field">
                  <span>Calculation Type<sup>*</sup></span>
                  <app-select
                    [options]="calcTypeOptions"
                    optionLabel="label"
                    optionValue="value"
                    [(ngModel)]="form.pCalculationType"
                    [showClear]="false"
                  />
                </label>
                <label class="field">
                  <span>Min Deposit</span>
                  <app-currency-input [(ngModel)]="form.pMinDeposit" name="minDep" />
                </label>
                <label class="field">
                  <span>Max Deposit</span>
                  <app-currency-input [(ngModel)]="form.pMaxDeposit" name="maxDep" />
                </label>
              </div>
            }
            @case ('loan-facility') {
              <div class="grid">
                <div class="field checkbox-field">
                  <p-checkbox
                    [(ngModel)]="form.pAllowLoan"
                    [binary]="true"
                    inputId="allowLoan"
                    name="allowLoan"
                  />
                  <label for="allowLoan">Allow Loan against deposit</label>
                </div>
                <p class="muted span-3">
                  Loan facility limit, percentage and identification documents
                  are configured against the loan master ({{ kind() === 'fd' ? 'FD-as-Collateral' : 'RD-as-Collateral' }}).
                </p>
              </div>
            }
            @case ('referral') {
              <div class="grid">
                <div class="field checkbox-field">
                  <p-checkbox
                    [(ngModel)]="form.pAllowReferralCommission"
                    [binary]="true"
                    inputId="allowRef"
                    name="allowRef"
                  />
                  <label for="allowRef">Allow referral commission</label>
                </div>
                <p class="muted span-3">
                  Per-scheme commission slabs are managed under
                  <strong>Settings &gt; Referral Agents</strong>.
                </p>
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
      .dc-shell { display: flex; flex-direction: column; gap: 0.75rem; }
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
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .checkbox-field {
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        align-self: end;
      }
      .span-3 { grid-column: span 3; }
    `,
  ],
})
export class DepositConfigShellComponent implements OnInit {
  private readonly api = inject(BankingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly tenureModeOptions = TENURE_MODE_OPTIONS;
  protected readonly payoutOptions = PAYOUT_OPTIONS;
  protected readonly calcTypeOptions = CALC_TYPE_OPTIONS;

  protected readonly tabs: TabItem[] = [
    { id: 'name-code', label: 'Name & Code' },
    { id: 'config', label: 'Configuration' },
    { id: 'loan-facility', label: 'Loan & Facility' },
    { id: 'referral', label: 'Referral Commission' },
  ];
  protected activeTab = 'name-code';

  protected readonly kind = signal<DepositKind>('fd');
  protected readonly saving = signal<boolean>(false);
  protected form: DepositConfigForm = { ...EMPTY_FORM };

  protected readonly errors = signal<{
    pName: string;
    pCode: string;
    pTenure: string;
    pInterestRate: string;
  }>({ pName: '', pCode: '', pTenure: '', pInterestRate: '' });

  protected readonly heading = computed(() => {
    const editing =
      this.kind() === 'fd' ? this.api.editingFdConfig() : this.api.editingRdConfig();
    return editing
      ? `Edit ${this.kind() === 'fd' ? 'FD' : 'RD'} – ${editing.name}`
      : `New ${this.kind() === 'fd' ? 'FD' : 'RD'} Config`;
  });

  protected readonly isValid = computed(() => {
    const f = this.form;
    return (
      !!f.pName &&
      !!f.pCode &&
      typeof f.pTenure === 'number' &&
      f.pTenure > 0 &&
      typeof f.pInterestRate === 'number' &&
      f.pInterestRate >= 0 &&
      f.pInterestRate <= 100
    );
  });

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as DepositKind | undefined;
    if (k) this.kind.set(k);
    const editing =
      this.kind() === 'fd' ? this.api.editingFdConfig() : this.api.editingRdConfig();
    if (!editing) return;
    this.loader.show();
    const get =
      this.kind() === 'fd'
        ? this.api.getFdConfigurationDetails(editing.name, editing.code)
        : this.api.getRdConfigurationDetails(editing.name, editing.code);
    get.subscribe({
      next: (data) => {
        if (data && typeof data === 'object') {
          this.form = { ...EMPTY_FORM, ...(data as Record<string, unknown>) };
        }
      },
      error: (err) =>
        this.toast.error(err?.message ?? 'Failed to load configuration'),
      complete: () => this.loader.hide(),
    });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pName: this.form.pName ? '' : 'Name is required.',
        pCode: this.form.pCode ? '' : 'Code is required.',
        pTenure:
          typeof this.form.pTenure === 'number' && this.form.pTenure > 0
            ? ''
            : 'Tenure must be > 0.',
        pInterestRate:
          typeof this.form.pInterestRate === 'number' &&
          this.form.pInterestRate >= 0 &&
          this.form.pInterestRate <= 100
            ? ''
            : 'Rate must be between 0 and 100.',
      });
      return;
    }
    this.saving.set(true);
    // The legacy backend wants two calls: name+code first, then full config.
    const saveNameCode =
      this.kind() === 'fd'
        ? this.api.saveFdNameAndCode({ FDName: this.form.pName, FdNameCode: this.form.pCode })
        : this.api.saveRdNameAndCode({ RdName: this.form.pName, RdNameCode: this.form.pCode });
    saveNameCode.subscribe({
      next: () => {
        const saveConfig =
          this.kind() === 'fd'
            ? this.api.saveFdConfiguration(this.form)
            : this.api.saveRdConfiguration(this.form);
        saveConfig.subscribe({
          next: () => {
            this.toast.success(
              `${this.kind() === 'fd' ? 'FD' : 'RD'} configuration saved.`,
            );
            this.cancel();
          },
          error: (err) => {
            this.toast.error(err?.message ?? 'Save failed');
            this.saving.set(false);
          },
        });
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate([this.kind() === 'fd' ? '/banking/FdView' : '/banking/RdView']);
  }
}
