import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
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
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { FIIndividualService } from '../services/fi-individual.service';

interface ReferralAgentOption {
  pReferralCode: string;
  pReferralname: string;
  pReferralId?: number;
  pContactId?: number;
}

interface EmployeeOption {
  pEmployeeId: number;
  pEmployeeName: string;
}

const COMMISSION_TYPE_OPTIONS = [
  { label: 'Percentage', value: 'Percentage' },
  { label: 'Amount', value: 'Amount' },
];

export interface ReferralValue {
  pIsReferralsapplicable: boolean;
  pReferralId: number;
  pReferralCode: string;
  pContactId: number;
  pReferralname: string;
  pEmployeeidId: number | null;
  pSalesPersonName: string;
  pCommisionValue: number | null;
  pCommissionType: string;
  pTypeofOperation: string;
  [key: string]: unknown;
}

const EMPTY_VALUE: ReferralValue = {
  pIsReferralsapplicable: false,
  pReferralId: 0,
  pReferralCode: '',
  pContactId: 0,
  pReferralname: '',
  pEmployeeidId: null,
  pSalesPersonName: '',
  pCommisionValue: null,
  pCommissionType: 'Percentage',
  pTypeofOperation: 'CREATE',
};

/**
 * Replaces 399-LOC `CoReferralComponent`. Single-record sub-form
 * (one referral per application). Loads referral agents + employees
 * once on init.
 */
@Component({
  selector: 'app-referral-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    CurrencyInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReferralSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Referral</h4></header>

      <div class="toggle">
        <p-checkbox
          [(ngModel)]="value.pIsReferralsapplicable"
          [binary]="true"
          inputId="refApplicable"
          (ngModelChange)="emit()"
        />
        <label for="refApplicable">Referral applicable</label>
      </div>

      @if (value.pIsReferralsapplicable) {
        <div class="grid">
          <label class="field">
            <span>Referral Agent<sup>*</sup></span>
            <app-select
              [options]="agents()"
              optionLabel="pReferralname"
              optionValue="pReferralCode"
              [(ngModel)]="value.pReferralCode"
              (ngModelChange)="onAgentChange()"
              name="agent"
              placeholder="Select agent"
            />
            <app-validation-message [message]="errors().agent" />
          </label>
          <label class="field">
            <span>Sales Person</span>
            <app-select
              [options]="employees()"
              optionLabel="pEmployeeName"
              optionValue="pEmployeeId"
              [(ngModel)]="value.pEmployeeidId"
              (ngModelChange)="onEmployeeChange()"
              name="salesPerson"
              placeholder="Select employee"
            />
          </label>
          <label class="field">
            <span>Commission Type</span>
            <app-select
              [options]="commissionTypes"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="value.pCommissionType"
              (ngModelChange)="emit()"
              name="commissionType"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>Commission Value</span>
            @if (value.pCommissionType === 'Percentage') {
              <input
                pInputText
                type="number"
                [(ngModel)]="value.pCommisionValue"
                (ngModelChange)="emit()"
                name="commissionPct"
                min="0"
                max="100"
              />
            } @else {
              <app-currency-input
                [(ngModel)]="value.pCommisionValue"
                (ngModelChange)="emit()"
                name="commissionAmt"
              />
            }
          </label>
        </div>
      }
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.75rem 0; }
      .toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .toggle label { cursor: pointer; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
    `,
  ],
})
export class ReferralSubformComponent
  implements ControlValueAccessor, OnInit
{
  private readonly fi = inject(FIIndividualService);
  private readonly toast = inject(ToastService);

  protected readonly commissionTypes = COMMISSION_TYPE_OPTIONS;

  protected readonly agents = signal<ReferralAgentOption[]>([]);
  protected readonly employees = signal<EmployeeOption[]>([]);
  protected value: ReferralValue = { ...EMPTY_VALUE };
  protected readonly errors = signal<{ agent: string }>({ agent: '' });

  ngOnInit(): void {
    this.fi.getReferralDetails().subscribe({
      next: (data) => this.agents.set((data as ReferralAgentOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load agents'),
    });
    this.fi.getAllEmployeeDetails().subscribe({
      next: (data) => this.employees.set((data as EmployeeOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load employees'),
    });
  }

  protected onAgentChange(): void {
    const code = this.value.pReferralCode;
    const match = this.agents().find((a) => a.pReferralCode === code);
    if (match) {
      this.value.pReferralname = match.pReferralname;
      this.value.pReferralId = match.pReferralId ?? 0;
      this.value.pContactId = match.pContactId ?? 0;
    }
    this.errors.set({ agent: code ? '' : 'Pick a referral agent.' });
    this.emit();
  }

  protected onEmployeeChange(): void {
    const id = this.value.pEmployeeidId;
    const match = this.employees().find((e) => e.pEmployeeId === id);
    this.value.pSalesPersonName = match?.pEmployeeName ?? '';
    this.emit();
  }

  // -------- CVA --------
  private internalChange: (val: ReferralValue) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: ReferralValue | null): void {
    this.value = val ? { ...EMPTY_VALUE, ...val } : { ...EMPTY_VALUE };
  }
  registerOnChange(fn: (val: ReferralValue) => void): void {
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
