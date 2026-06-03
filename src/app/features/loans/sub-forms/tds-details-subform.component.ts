import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
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
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

export interface TdsValue {
  pIstdsApplicable: boolean;
  ptdsSectionName: string;
  pIsgstApplicable: boolean;
  pStateName: string;
  pGstType: string;
  pGstNo: string;
  pStatusname: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const GST_TYPE_OPTIONS = [
  { label: 'Regular', value: 'Regular' },
  { label: 'Composition', value: 'Composition' },
  { label: 'Casual', value: 'Casual' },
  { label: 'Non-resident', value: 'Non-resident' },
];

const TDS_SECTION_OPTIONS = [
  { label: '194A — Interest other than securities', value: '194A' },
  { label: '194C — Contracts', value: '194C' },
  { label: '194H — Commission / brokerage', value: '194H' },
  { label: '194J — Professional / technical services', value: '194J' },
];

const EMPTY_VALUE: TdsValue = {
  pIstdsApplicable: false,
  ptdsSectionName: '',
  pIsgstApplicable: false,
  pStateName: '',
  pGstType: '',
  pGstNo: '',
  pStatusname: 'ACTIVE',
  ptypeofoperation: 'CREATE',
};

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[A-Z0-9]{1}$/;

/**
 * Replaces 536-LOC `TDSDetailsComponent`. Two independent toggles
 * (TDS / GST); validates GSTIN format on the fly.
 */
@Component({
  selector: 'app-tds-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    SelectComponent,
    ValidationMessageComponent,
    UppercaseDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TdsDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Tax Details (TDS / GST)</h4></header>

      <div class="block">
        <div class="toggle">
          <p-checkbox
            [(ngModel)]="value.pIstdsApplicable"
            [binary]="true"
            inputId="tdsApplicable"
            (ngModelChange)="emit()"
          />
          <label for="tdsApplicable">TDS applicable</label>
        </div>
        @if (value.pIstdsApplicable) {
          <div class="grid">
            <label class="field">
              <span>TDS Section<sup>*</sup></span>
              <app-select
                [options]="tdsSectionOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="value.ptdsSectionName"
                (ngModelChange)="emit()"
                name="tdsSection"
                placeholder="Select section"
              />
              <app-validation-message [message]="errors().tdsSection" />
            </label>
          </div>
        }
      </div>

      <div class="block">
        <div class="toggle">
          <p-checkbox
            [(ngModel)]="value.pIsgstApplicable"
            [binary]="true"
            inputId="gstApplicable"
            (ngModelChange)="emit()"
          />
          <label for="gstApplicable">GST applicable</label>
        </div>
        @if (value.pIsgstApplicable) {
          <div class="grid">
            <label class="field">
              <span>GST Type</span>
              <app-select
                [options]="gstTypeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="value.pGstType"
                (ngModelChange)="emit()"
                name="gstType"
                placeholder="Select GST type"
              />
            </label>
            <label class="field">
              <span>State</span>
              <input
                pInputText
                [(ngModel)]="value.pStateName"
                (ngModelChange)="emit()"
                name="state"
                maxlength="40"
              />
            </label>
            <label class="field">
              <span>GSTIN<sup>*</sup></span>
              <input
                pInputText
                [(ngModel)]="value.pGstNo"
                (ngModelChange)="onGstChange()"
                name="gstNo"
                appUppercase
                maxlength="15"
                placeholder="22AAAAA0000A1Z5"
              />
              <app-validation-message [message]="errors().gstNo" />
            </label>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.75rem 0; }
      .block + .block {
        margin-top: 1.25rem;
        padding-top: 1rem;
        border-top: 1px solid var(--p-surface-200);
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
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
export class TdsDetailsSubformComponent implements ControlValueAccessor {
  protected readonly tdsSectionOptions = TDS_SECTION_OPTIONS;
  protected readonly gstTypeOptions = GST_TYPE_OPTIONS;

  protected value: TdsValue = { ...EMPTY_VALUE };
  protected readonly errors = signal<{ tdsSection: string; gstNo: string }>({
    tdsSection: '',
    gstNo: '',
  });

  protected onGstChange(): void {
    const gst = (this.value.pGstNo ?? '').trim();
    if (!gst) {
      this.errors.update((e) => ({ ...e, gstNo: 'GSTIN is required.' }));
    } else if (!GST_REGEX.test(gst)) {
      this.errors.update((e) => ({ ...e, gstNo: 'Invalid GSTIN format.' }));
    } else {
      this.errors.update((e) => ({ ...e, gstNo: '' }));
    }
    this.emit();
  }

  // -------- CVA --------
  private internalChange: (val: TdsValue) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: TdsValue | null): void {
    this.value = val ? { ...EMPTY_VALUE, ...val } : { ...EMPTY_VALUE };
  }
  registerOnChange(fn: (val: TdsValue) => void): void {
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
