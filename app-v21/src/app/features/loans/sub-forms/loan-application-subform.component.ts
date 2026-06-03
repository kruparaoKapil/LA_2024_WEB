import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

import {
  CurrencyInputComponent,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { FIIndividualService } from '../services/fi-individual.service';
import { LoansMasterService } from '../services/loans-master.service';
import { SchemeService } from '../services/scheme.service';

interface LoanTypeOption {
  pLoantypeid: number;
  pLoantype: string;
  [key: string]: unknown;
}

interface LoanNameOption {
  pLoanid: number;
  pLoanname: string;
  pLoanID?: number;
  pLoanName?: string;
  [key: string]: unknown;
}

interface SchemeOption {
  pSchemeid: number;
  pSchemecode: string;
  pSchemename: string;
  pSchemeID?: number;
  pSchemeCode?: string;
  pSchemeName?: string;
  [key: string]: unknown;
}

interface ContactTypeOption {
  pContacttype: string;
}

interface ApplicantTypeOption {
  pApplicanttype: string;
}

interface PayinOption {
  pLoanpayin: string;
}

interface InterestTypeOption {
  pInteresttype: string;
}

interface InstallmentModeOption {
  pLoaninstalmentpaymentmode: string;
  pLoaninstalmentpaymentmodecode?: string;
}

const TENURE_TYPES = [
  { label: 'Months', value: 'Months' },
  { label: 'Years', value: 'Years' },
  { label: 'Days', value: 'Days' },
];

const EMI_TYPES = [
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Advance EMI', value: 'ADVANCE' },
  { label: 'Bullet', value: 'BULLET' },
  { label: 'Step-up', value: 'STEPUP' },
];

export interface LoanApplicationValue {
  pLoantype: string;
  pLoantypeid: number | null;
  pLoanname: string;
  pLoanid: number | null;
  pSchemeid: number | null;
  pSchemecode: string;
  pSchemename: string;
  pIsschemesapplicable: boolean;
  pContactType: string;
  pApplicantType: string;
  pLoanpayin: string;
  pInteresttype: string;
  pemitype: string;
  pAmountrequested: number | null;
  pTenureofloan: number | null;
  pTenuretype: string;
  pRateofinterest: number | null;
  pLoaninstalmentpaymentmode: string;
  pLoaninstalmentpaymentmodecode: string;
  pPurposeofloan: string;
  pInstalmentamount: number;
  pDateofapplication: Date | null;
  pPartprinciplepaidinterval: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_VALUE: LoanApplicationValue = {
  pLoantype: '',
  pLoantypeid: null,
  pLoanname: '',
  pLoanid: null,
  pSchemeid: null,
  pSchemecode: '',
  pSchemename: '',
  pIsschemesapplicable: false,
  pContactType: 'Individual',
  pApplicantType: 'Applicant',
  pLoanpayin: '',
  pInteresttype: '',
  pemitype: 'REGULAR',
  pAmountrequested: null,
  pTenureofloan: null,
  pTenuretype: 'Months',
  pRateofinterest: null,
  pLoaninstalmentpaymentmode: '',
  pLoaninstalmentpaymentmodecode: '',
  pPurposeofloan: '',
  pInstalmentamount: 0,
  pDateofapplication: new Date(),
  pPartprinciplepaidinterval: '',
  ptypeofoperation: 'CREATE',
};

/**
 * Loan-application sub-form: replaces the FI-Individual `Application`
 * tab from the legacy 1331-LOC `FiLoandetailsComponent`. Captures the
 * loan terms (amount, tenor, rate, EMI mode, scheme cascade) the
 * downstream Verification → Approval → Disbursement flow consumes.
 *
 * Cascade: loan type → loan name → contact + applicant → scheme →
 * pay-in → interest type → installment mode → min/max amount and rate.
 */
@Component({
  selector: 'app-loan-application-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    CurrencyInputComponent,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoanApplicationSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Loan Application</h4></header>

      <div class="grid">
        <label class="field">
          <span>Loan Type<sup>*</sup></span>
          <app-select
            [options]="loanTypes()"
            optionLabel="pLoantype"
            optionValue="pLoantype"
            [(ngModel)]="value.pLoantype"
            (ngModelChange)="onLoanTypeChange()"
            name="loanType"
            placeholder="Select loan type"
          />
          <app-validation-message [message]="errors().pLoantype" />
        </label>

        <label class="field">
          <span>Loan Name<sup>*</sup></span>
          <app-select
            [options]="loanNames()"
            optionLabel="pLoanname"
            optionValue="pLoanid"
            [(ngModel)]="value.pLoanid"
            (ngModelChange)="onLoanNameChange()"
            name="loanName"
            placeholder="Select loan"
          />
          <app-validation-message [message]="errors().pLoanid" />
        </label>

        <label class="field">
          <span>Date of Application<sup>*</sup></span>
          <app-date-input
            [(ngModel)]="value.pDateofapplication"
            (ngModelChange)="emit()"
            name="appDate"
            [maxDate]="today"
          />
        </label>

        <label class="field">
          <span>Purpose</span>
          <input
            pInputText
            [(ngModel)]="value.pPurposeofloan"
            (ngModelChange)="emit()"
            name="purpose"
            maxlength="200"
          />
        </label>

        <div class="field checkbox-field">
          <p-checkbox
            [(ngModel)]="value.pIsschemesapplicable"
            (ngModelChange)="onSchemeApplicableChange()"
            [binary]="true"
            inputId="schemeApplicable"
            name="schemeApplicable"
          />
          <label for="schemeApplicable">Scheme applicable</label>
        </div>

        @if (value.pIsschemesapplicable) {
          <label class="field">
            <span>Scheme</span>
            <app-select
              [options]="schemes()"
              optionLabel="pSchemename"
              optionValue="pSchemeid"
              [(ngModel)]="value.pSchemeid"
              (ngModelChange)="onSchemeChange()"
              name="scheme"
              placeholder="Select scheme"
            />
          </label>
        }

        <label class="field">
          <span>Pay-in<sup>*</sup></span>
          <app-select
            [options]="payins()"
            optionLabel="pLoanpayin"
            optionValue="pLoanpayin"
            [(ngModel)]="value.pLoanpayin"
            (ngModelChange)="onPayinChange()"
            name="payin"
            placeholder="Select pay-in"
          />
          <app-validation-message [message]="errors().pLoanpayin" />
        </label>

        <label class="field">
          <span>Interest Type<sup>*</sup></span>
          <app-select
            [options]="interestTypes()"
            optionLabel="pInteresttype"
            optionValue="pInteresttype"
            [(ngModel)]="value.pInteresttype"
            (ngModelChange)="onInterestTypeChange()"
            name="interestType"
            placeholder="Select interest type"
          />
          <app-validation-message [message]="errors().pInteresttype" />
        </label>

        <label class="field">
          <span>EMI Type</span>
          <app-select
            [options]="emiTypes"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="value.pemitype"
            (ngModelChange)="emit()"
            name="emiType"
            [showClear]="false"
          />
        </label>

        <label class="field">
          <span>Installment Mode<sup>*</sup></span>
          <app-select
            [options]="installmentModes()"
            optionLabel="pLoaninstalmentpaymentmode"
            optionValue="pLoaninstalmentpaymentmode"
            [(ngModel)]="value.pLoaninstalmentpaymentmode"
            (ngModelChange)="onInstallmentModeChange()"
            name="installmentMode"
            placeholder="Select mode"
          />
          <app-validation-message [message]="errors().pLoaninstalmentpaymentmode" />
        </label>

        <label class="field">
          <span>Amount Requested<sup>*</sup></span>
          <app-currency-input
            [(ngModel)]="value.pAmountrequested"
            (ngModelChange)="onAmountChange()"
            name="amount"
          />
          <app-validation-message [message]="errors().pAmountrequested" />
          @if (minMax()) {
            <small class="hint">
              Min:
              {{ minMax()?.minAmount | number: '1.0-0':'en-IN' }} · Max:
              {{ minMax()?.maxAmount | number: '1.0-0':'en-IN' }}
            </small>
          }
        </label>

        <label class="field">
          <span>Tenure<sup>*</sup></span>
          <input
            type="number"
            [(ngModel)]="value.pTenureofloan"
            (ngModelChange)="emit()"
            name="tenure"
            min="1"
            max="600"
          />
          <app-validation-message [message]="errors().pTenureofloan" />
        </label>

        <label class="field">
          <span>Tenure Type</span>
          <app-select
            [options]="tenureTypes"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="value.pTenuretype"
            (ngModelChange)="emit()"
            name="tenureType"
            [showClear]="false"
          />
        </label>

        <label class="field">
          <span>Rate of Interest (%)<sup>*</sup></span>
          <input
            type="number"
            [(ngModel)]="value.pRateofinterest"
            (ngModelChange)="emit()"
            name="rate"
            min="0"
            max="100"
            step="0.01"
          />
          <app-validation-message [message]="errors().pRateofinterest" />
          @if (minMax()) {
            <small class="hint">
              Min:
              {{ minMax()?.minRate }}% · Max: {{ minMax()?.maxRate }}%
            </small>
          }
        </label>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.75rem 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(180px, 1fr));
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
      .hint { color: var(--p-text-muted-color, var(--p-surface-500)); font-size: 0.7rem; }
    `,
  ],
})
export class LoanApplicationSubformComponent
  implements ControlValueAccessor, OnInit
{
  private readonly fi = inject(FIIndividualService);
  private readonly schemeApi = inject(SchemeService);
  private readonly loansApi = inject(LoansMasterService);
  private readonly toast = inject(ToastService);

  readonly applicationId = input<string | null>(null);

  protected readonly today = new Date();
  protected readonly tenureTypes = TENURE_TYPES;
  protected readonly emiTypes = EMI_TYPES;

  protected readonly loanTypes = signal<LoanTypeOption[]>([]);
  protected readonly loanNames = signal<LoanNameOption[]>([]);
  protected readonly schemes = signal<SchemeOption[]>([]);
  protected readonly contactTypes = signal<ContactTypeOption[]>([]);
  protected readonly applicantTypes = signal<ApplicantTypeOption[]>([]);
  protected readonly payins = signal<PayinOption[]>([]);
  protected readonly interestTypes = signal<InterestTypeOption[]>([]);
  protected readonly installmentModes = signal<InstallmentModeOption[]>([]);

  protected value: LoanApplicationValue = { ...EMPTY_VALUE };
  protected readonly minMax = signal<{
    minAmount: number;
    maxAmount: number;
    minRate: number;
    maxRate: number;
  } | null>(null);

  protected readonly errors = signal<{
    pLoantype: string;
    pLoanid: string;
    pLoanpayin: string;
    pInteresttype: string;
    pLoaninstalmentpaymentmode: string;
    pAmountrequested: string;
    pTenureofloan: string;
    pRateofinterest: string;
  }>({
    pLoantype: '',
    pLoanid: '',
    pLoanpayin: '',
    pInteresttype: '',
    pLoaninstalmentpaymentmode: '',
    pAmountrequested: '',
    pTenureofloan: '',
    pRateofinterest: '',
  });

  ngOnInit(): void {
    this.fi.getFiLoanTypes().subscribe({
      next: (rows) => this.loanTypes.set((rows as LoanTypeOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load loan types'),
    });
  }

  // -------- cascade handlers --------
  protected onLoanTypeChange(): void {
    const type = this.value.pLoantype;
    const match = this.loanTypes().find((t) => t.pLoantype === type);
    this.value.pLoantypeid = match?.pLoantypeid ?? null;
    this.resetDownstream(['pLoanid', 'pLoanname']);
    if (!type || !match) {
      this.loanNames.set([]);
      this.emit();
      return;
    }
    this.loansApi.getLoanNames(match.pLoantypeid).subscribe({
      next: (rows) => {
        const list = (rows as Record<string, unknown>[]).map((r) => ({
          pLoanid: (r['pLoanid'] ?? r['pLoanID']) as number,
          pLoanname: (r['pLoanname'] ?? r['pLoanName']) as string,
          ...r,
        })) as LoanNameOption[];
        this.loanNames.set(list);
      },
      error: (err) =>
        this.toast.error(err?.message ?? 'Failed to load loan names'),
    });
    this.emit();
  }

  protected onLoanNameChange(): void {
    const id = this.value.pLoanid ?? 0;
    const match = this.loanNames().find((n) => n.pLoanid === id);
    this.value.pLoanname = match?.pLoanname ?? '';
    this.resetDownstream([
      'pSchemeid',
      'pSchemecode',
      'pSchemename',
      'pLoanpayin',
      'pInteresttype',
      'pLoaninstalmentpaymentmode',
    ]);
    if (!id) {
      this.schemes.set([]);
      this.payins.set([]);
      this.emit();
      return;
    }
    this.fi.getContactTypes(id).subscribe({
      next: (rows) => this.contactTypes.set((rows as ContactTypeOption[]) ?? []),
    });
    this.schemeApi.getLoanSpecificSchemes(id).subscribe({
      next: (rows) => {
        const list = (rows as Record<string, unknown>[]).map((r) => ({
          pSchemeid: (r['pSchemeid'] ?? r['pSchemeID']) as number,
          pSchemecode: (r['pSchemecode'] ?? r['pSchemeCode'] ?? '') as string,
          pSchemename: (r['pSchemename'] ?? r['pSchemeName'] ?? '') as string,
          ...r,
        })) as SchemeOption[];
        this.schemes.set(list);
      },
    });
    if (!this.value.pIsschemesapplicable) {
      this.refreshPayins();
    }
    this.emit();
  }

  protected onSchemeApplicableChange(): void {
    if (!this.value.pIsschemesapplicable) {
      this.value.pSchemeid = null;
      this.value.pSchemecode = '';
      this.value.pSchemename = '';
    }
    this.refreshPayins();
    this.emit();
  }

  protected onSchemeChange(): void {
    const id = this.value.pSchemeid ?? 0;
    const match = this.schemes().find((s) => s.pSchemeid === id);
    this.value.pSchemecode = match?.pSchemecode ?? '';
    this.value.pSchemename = match?.pSchemename ?? '';
    this.refreshPayins();
    this.emit();
  }

  protected onPayinChange(): void {
    this.refreshInterestTypes();
    this.emit();
  }

  protected onInterestTypeChange(): void {
    this.refreshInstallmentModes();
    this.refreshMinMax();
    this.emit();
  }

  protected onInstallmentModeChange(): void {
    const code = this.installmentModes().find(
      (m) => m.pLoaninstalmentpaymentmode === this.value.pLoaninstalmentpaymentmode,
    );
    this.value.pLoaninstalmentpaymentmodecode =
      code?.pLoaninstalmentpaymentmodecode ?? '';
    this.emit();
  }

  protected onAmountChange(): void {
    const mm = this.minMax();
    if (mm && this.value.pAmountrequested) {
      if (this.value.pAmountrequested < mm.minAmount) {
        this.errors.update((e) => ({
          ...e,
          pAmountrequested: `Amount below minimum (${mm.minAmount}).`,
        }));
      } else if (this.value.pAmountrequested > mm.maxAmount) {
        this.errors.update((e) => ({
          ...e,
          pAmountrequested: `Amount above maximum (${mm.maxAmount}).`,
        }));
      } else {
        this.errors.update((e) => ({ ...e, pAmountrequested: '' }));
      }
    }
    this.emit();
  }

  // -------- helpers --------
  private refreshPayins(): void {
    if (!this.value.pLoanid) return;
    this.fi
      .getLoanPayins(
        this.value.pLoanid,
        this.value.pContactType,
        this.value.pApplicantType,
        this.value.pSchemeid ?? 0,
      )
      .subscribe({
        next: (rows) => this.payins.set((rows as PayinOption[]) ?? []),
      });
  }

  private refreshInterestTypes(): void {
    if (!this.value.pLoanid) return;
    this.fi
      .getLoanInterestTypes({
        loanId: this.value.pLoanid,
        schemeId: this.value.pSchemeid ?? 0,
        contactType: this.value.pContactType,
        applicantType: this.value.pApplicantType,
        loanPayIn: this.value.pLoanpayin,
      })
      .subscribe({
        next: (rows) =>
          this.interestTypes.set((rows as InterestTypeOption[]) ?? []),
      });
  }

  private refreshInstallmentModes(): void {
    if (!this.value.pLoanpayin || !this.value.pInteresttype) return;
    this.fi
      .getInstallmentModes(this.value.pLoanpayin, this.value.pInteresttype)
      .subscribe({
        next: (rows) =>
          this.installmentModes.set((rows as InstallmentModeOption[]) ?? []),
      });
  }

  private refreshMinMax(): void {
    if (!this.value.pLoanid || !this.value.pInteresttype) {
      this.minMax.set(null);
      return;
    }
    this.fi
      .getLoanMinAndMax({
        loanId: this.value.pLoanid,
        contactType: this.value.pContactType,
        applicantType: this.value.pApplicantType,
        loanPayIn: this.value.pLoanpayin,
        interestType: this.value.pInteresttype,
        schemeId: this.value.pSchemeid ?? 0,
      })
      .subscribe({
        next: (data) => {
          const d = data as
            | {
                pminamount?: number;
                pmaxamount?: number;
                pmininterest?: number;
                pmaxinterest?: number;
              }
            | null;
          if (!d) {
            this.minMax.set(null);
            return;
          }
          this.minMax.set({
            minAmount: d.pminamount ?? 0,
            maxAmount: d.pmaxamount ?? 0,
            minRate: d.pmininterest ?? 0,
            maxRate: d.pmaxinterest ?? 0,
          });
        },
      });
  }

  private resetDownstream(keys: (keyof LoanApplicationValue)[]): void {
    for (const k of keys) {
      (this.value as Record<string, unknown>)[k] = (EMPTY_VALUE as Record<string, unknown>)[k];
    }
  }

  // -------- CVA --------
  private internalChange: (val: LoanApplicationValue) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: LoanApplicationValue | null): void {
    this.value = val ? { ...EMPTY_VALUE, ...val } : { ...EMPTY_VALUE };
    if (this.value.pDateofapplication && !(this.value.pDateofapplication instanceof Date)) {
      this.value.pDateofapplication = new Date(this.value.pDateofapplication);
    }
    // Cascade refresh based on persisted values so dropdowns show
    // human-readable labels in edit mode.
    if (val && val.pLoantypeid) {
      this.loansApi.getLoanNames(val.pLoantypeid).subscribe({
        next: (rows) => {
          const list = (rows as Record<string, unknown>[]).map((r) => ({
            pLoanid: (r['pLoanid'] ?? r['pLoanID']) as number,
            pLoanname: (r['pLoanname'] ?? r['pLoanName']) as string,
            ...r,
          })) as LoanNameOption[];
          this.loanNames.set(list);
        },
      });
    }
    if (val && val.pLoanid) {
      this.schemeApi.getLoanSpecificSchemes(val.pLoanid).subscribe({
        next: (rows) => {
          const list = (rows as Record<string, unknown>[]).map((r) => ({
            pSchemeid: (r['pSchemeid'] ?? r['pSchemeID']) as number,
            pSchemecode: (r['pSchemecode'] ?? r['pSchemeCode'] ?? '') as string,
            pSchemename: (r['pSchemename'] ?? r['pSchemeName'] ?? '') as string,
            ...r,
          })) as SchemeOption[];
          this.schemes.set(list);
        },
      });
    }
  }
  registerOnChange(fn: (val: LoanApplicationValue) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // disabled rendering omitted in this revision
  }

  emit(): void {
    this.internalTouched();
    this.internalChange({ ...this.value });
  }
}
