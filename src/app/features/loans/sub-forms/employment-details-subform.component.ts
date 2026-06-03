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

import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import {
  CurrencyInputComponent,
  DateInputComponent,
  SelectComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { FIIndividualService } from '../services/fi-individual.service';

interface EmploymentRoleOption {
  pEmploymentRoleId: number;
  pEmploymentRoleName: string;
}

export interface EmploymentDetailsValue {
  pEmploymentCompanyName: string;
  pdesignation: string;
  pEmploymentRoleId: number | null;
  pEmploymentRoleName: string;
  pEmploymentJoiningDate: Date | string | null;
  pEmploymentCTC: number | null;
  pbasicsalary: number | null;
  pkhcno: string;
  pesino: string;
  ppfno: string;
  pispf: boolean;
  pisesi: boolean;
  ppassportno: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_VALUE: EmploymentDetailsValue = {
  pEmploymentCompanyName: '',
  pdesignation: '',
  pEmploymentRoleId: null,
  pEmploymentRoleName: '',
  pEmploymentJoiningDate: null,
  pEmploymentCTC: null,
  pbasicsalary: null,
  pkhcno: '',
  pesino: '',
  ppfno: '',
  pispf: false,
  pisesi: false,
  ppassportno: '',
  ptypeofoperation: 'CREATE',
};

/**
 * Streamlined employment-details sub-form. The legacy
 * `EmployeeDetailsNewComponent` is 888 LOC because it covered
 * career history, education, training, etc. — that depth belongs in
 * the dedicated HRMS module (Phase 10). For FI-Individual we capture
 * the essential employment fields the credit-decision flow needs.
 */
@Component({
  selector: 'app-employment-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    CurrencyInputComponent,
    DateInputComponent,
    SelectComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmploymentDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Employment</h4></header>
      <div class="grid">
        <label class="field">
          <span>Company Name</span>
          <input
            pInputText
            [(ngModel)]="value.pEmploymentCompanyName"
            (ngModelChange)="emit()"
            name="company"
            maxlength="120"
          />
        </label>
        <label class="field">
          <span>Designation</span>
          <input
            pInputText
            [(ngModel)]="value.pdesignation"
            (ngModelChange)="emit()"
            name="designation"
            maxlength="80"
          />
        </label>
        <label class="field">
          <span>Role</span>
          <app-select
            [options]="roles()"
            optionLabel="pEmploymentRoleName"
            optionValue="pEmploymentRoleId"
            [(ngModel)]="value.pEmploymentRoleId"
            (ngModelChange)="onRoleChange()"
            name="role"
            placeholder="Select role"
          />
        </label>
        <label class="field">
          <span>Joining Date</span>
          <app-date-input
            [(ngModel)]="value.pEmploymentJoiningDate"
            (ngModelChange)="emit()"
            name="joiningDate"
            [maxDate]="today"
          />
        </label>
        <label class="field">
          <span>CTC (Annual)</span>
          <app-currency-input
            [(ngModel)]="value.pEmploymentCTC"
            (ngModelChange)="emit()"
            name="ctc"
          />
        </label>
        <label class="field">
          <span>Basic Salary</span>
          <app-currency-input
            [(ngModel)]="value.pbasicsalary"
            (ngModelChange)="emit()"
            name="basicSalary"
          />
        </label>
        <label class="field">
          <span>KHC Number</span>
          <input
            pInputText
            [(ngModel)]="value.pkhcno"
            (ngModelChange)="emit()"
            name="khcNo"
            maxlength="40"
          />
        </label>
        <label class="field">
          <span>Passport</span>
          <input
            pInputText
            [(ngModel)]="value.ppassportno"
            (ngModelChange)="emit()"
            name="passport"
            maxlength="20"
          />
        </label>

        <div class="checkbox-row">
          <p-checkbox
            [(ngModel)]="value.pispf"
            (ngModelChange)="emit()"
            [binary]="true"
            inputId="pf"
          />
          <label for="pf">PF Applicable</label>

          <input
            pInputText
            [(ngModel)]="value.ppfno"
            (ngModelChange)="emit()"
            name="pfNo"
            placeholder="PF Number"
            maxlength="20"
            [disabled]="!value.pispf"
          />
        </div>

        <div class="checkbox-row">
          <p-checkbox
            [(ngModel)]="value.pisesi"
            (ngModelChange)="emit()"
            [binary]="true"
            inputId="esi"
          />
          <label for="esi">ESI Applicable</label>

          <input
            pInputText
            [(ngModel)]="value.pesino"
            (ngModelChange)="emit()"
            name="esiNo"
            placeholder="ESI Number"
            maxlength="20"
            [disabled]="!value.pisesi"
          />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.75rem 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .checkbox-row {
        grid-column: span 2;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
      }
      .checkbox-row label {
        margin-right: 1rem;
      }
      .checkbox-row input {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class EmploymentDetailsSubformComponent
  implements ControlValueAccessor, OnInit
{
  private readonly fi = inject(FIIndividualService);
  private readonly toast = inject(ToastService);

  protected readonly today = new Date();
  protected readonly roles = signal<EmploymentRoleOption[]>([]);
  protected value: EmploymentDetailsValue = { ...EMPTY_VALUE };

  ngOnInit(): void {
    this.fi.getEmploymentRoles().subscribe({
      next: (data) => this.roles.set((data as EmploymentRoleOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load roles'),
    });
  }

  protected onRoleChange(): void {
    const id = this.value.pEmploymentRoleId;
    const match = this.roles().find((r) => r.pEmploymentRoleId === id);
    this.value.pEmploymentRoleName = match?.pEmploymentRoleName ?? '';
    this.emit();
  }

  // -------- CVA --------
  private internalChange: (val: EmploymentDetailsValue) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: EmploymentDetailsValue | null): void {
    this.value = val ? { ...EMPTY_VALUE, ...val } : { ...EMPTY_VALUE };
  }
  registerOnChange(fn: (val: EmploymentDetailsValue) => void): void {
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
