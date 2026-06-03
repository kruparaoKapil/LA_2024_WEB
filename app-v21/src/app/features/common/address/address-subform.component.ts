import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { LocationService, CountryOption, StateOption, DistrictOption } from '../location.service';
import { SelectComponent, ValidationMessageComponent } from '../../../shared/ui';

export interface AddressValue {
  paddress1?: string;
  paddress2?: string;
  pcity?: string;
  pCountryId?: number | null;
  pCountry?: string;
  pStateId?: number | null;
  pState?: string;
  pDistrictId?: number | null;
  pDistrict?: string;
  Pincode?: string;
  pRecordid?: number;
}

const PINCODE_RE = /^[0-9]{6}$/;

/**
 * Reusable address sub-form. Replaces legacy
 * `UI/Common/address/address.component.ts` (~325 LOC of FormBuilder
 * scaffolding + per-field setValidators / clearValidators acrobatics).
 *
 * Design:
 *  - Implements ControlValueAccessor so parents bind it via
 *    `[(ngModel)]="addressValue"` or a reactive form control.
 *  - State + District cascade is driven entirely by signals + `effect()`.
 *  - Country/State/District lookups use `LocationService` (cached).
 *  - Six-digit Pincode validation is local; full structural validation
 *    rolls up via the parent form's own validators.
 */
@Component({
  selector: 'app-address-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    InputTextModule,
    SelectComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressSubformComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset class="address" [disabled]="disabled()">
      <legend>{{ title() }}</legend>

      <div class="row">
        <div class="field">
          <label>Address line 1</label>
          <input
            pInputText
            [ngModel]="addr1()"
            (ngModelChange)="setField('paddress1', $event)"
          />
        </div>
        <div class="field">
          <label>Address line 2</label>
          <input
            pInputText
            [ngModel]="addr2()"
            (ngModelChange)="setField('paddress2', $event)"
          />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>City *</label>
          <input
            pInputText
            [ngModel]="city()"
            (ngModelChange)="setField('pcity', $event)"
          />
          <app-validation-message [message]="cityErr()" />
        </div>
        <div class="field">
          <label>Pincode *</label>
          <input
            pInputText
            inputmode="numeric"
            maxlength="6"
            [ngModel]="pincode()"
            (ngModelChange)="setField('Pincode', $event)"
          />
          <app-validation-message [message]="pincodeErr()" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Country *</label>
          <app-select
            [options]="countries()"
            optionLabel="pCountryName"
            optionValue="pCountryId"
            placeholder="Country"
            [ngModel]="countryId()"
            (ngModelChange)="onCountryChange($event)"
          />
          <app-validation-message [message]="countryErr()" />
        </div>
        <div class="field">
          <label>State *</label>
          <app-select
            [options]="states()"
            optionLabel="pStateName"
            optionValue="pStateId"
            placeholder="State"
            [ngModel]="stateId()"
            (ngModelChange)="onStateChange($event)"
          />
          <app-validation-message [message]="stateErr()" />
        </div>
        <div class="field">
          <label>District *</label>
          <app-select
            [options]="districts()"
            optionLabel="pDistrictName"
            optionValue="pDistrictId"
            placeholder="District"
            [ngModel]="districtId()"
            (ngModelChange)="onDistrictChange($event)"
          />
          <app-validation-message [message]="districtErr()" />
        </div>
      </div>
    </fieldset>
  `,
  styles: [
    `
      .address {
        border: 1px solid var(--p-surface-200);
        border-radius: 6px;
        padding: 0.75rem 1rem 1rem;
        margin-bottom: 1rem;
      }
      .address legend {
        padding: 0 0.5rem;
        color: var(--p-primary-color);
        font-weight: 600;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      .row:has(.field:nth-child(2):last-child) {
        grid-template-columns: 1fr 1fr;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      label {
        font-size: 0.85rem;
        color: var(--p-text-secondary-color, var(--p-surface-600));
      }
    `,
  ],
})
export class AddressSubformComponent implements ControlValueAccessor {
  private readonly location = inject(LocationService);

  readonly title = input<string>('Address');
  readonly required = input<boolean>(true);

  // ---- atomic field signals ----
  protected readonly addr1 = signal<string>('');
  protected readonly addr2 = signal<string>('');
  protected readonly city = signal<string>('');
  protected readonly pincode = signal<string>('');
  protected readonly countryId = signal<number | null>(null);
  protected readonly stateId = signal<number | null>(null);
  protected readonly districtId = signal<number | null>(null);
  protected readonly recordId = signal<number>(0);
  protected readonly disabled = signal<boolean>(false);

  // ---- option lists ----
  protected readonly countries = signal<CountryOption[]>([]);
  protected readonly states = signal<StateOption[]>([]);
  protected readonly districts = signal<DistrictOption[]>([]);

  // ---- error signals (lazy: empty string when pristine) ----
  protected readonly touched = signal<boolean>(false);
  protected readonly cityErr = () =>
    this.touched() && this.required() && !this.city().trim() ? 'City is required.' : '';
  protected readonly pincodeErr = () => {
    if (!this.touched()) return '';
    const v = this.pincode();
    if (!v && this.required()) return 'Pincode is required.';
    if (v && !PINCODE_RE.test(v)) return 'Pincode must be 6 digits.';
    return '';
  };
  protected readonly countryErr = () =>
    this.touched() && this.required() && !this.countryId() ? 'Country is required.' : '';
  protected readonly stateErr = () =>
    this.touched() && this.required() && !this.stateId() ? 'State is required.' : '';
  protected readonly districtErr = () =>
    this.touched() && this.required() && !this.districtId() ? 'District is required.' : '';

  private internalChange: (val: AddressValue | null) => void = () => {};
  private internalTouched: () => void = () => {};

  constructor() {
    void this.location.loadCountries().then((c) => this.countries.set(c));

    // cascade: country → states (and reset state/district)
    effect(() => {
      const cid = this.countryId();
      if (!cid) {
        this.states.set([]);
        return;
      }
      void this.location.getStates(cid).then((s) => this.states.set(s));
    });

    // cascade: state → districts (and reset district)
    effect(() => {
      const sid = this.stateId();
      if (!sid) {
        this.districts.set([]);
        return;
      }
      void this.location.getDistricts(sid).then((d) => this.districts.set(d));
    });
  }

  protected setField(
    field: 'paddress1' | 'paddress2' | 'pcity' | 'Pincode',
    value: string,
  ): void {
    if (field === 'paddress1') this.addr1.set(value ?? '');
    else if (field === 'paddress2') this.addr2.set(value ?? '');
    else if (field === 'pcity') this.city.set(value ?? '');
    else this.pincode.set(value ?? '');
    this.markTouched();
    this.emit();
  }

  protected onCountryChange(val: unknown): void {
    const id = typeof val === 'number' ? val : Number(val) || null;
    this.countryId.set(id);
    this.stateId.set(null);
    this.districtId.set(null);
    this.markTouched();
    this.emit();
  }
  protected onStateChange(val: unknown): void {
    const id = typeof val === 'number' ? val : Number(val) || null;
    this.stateId.set(id);
    this.districtId.set(null);
    this.markTouched();
    this.emit();
  }
  protected onDistrictChange(val: unknown): void {
    const id = typeof val === 'number' ? val : Number(val) || null;
    this.districtId.set(id);
    this.markTouched();
    this.emit();
  }

  private markTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.internalTouched();
    }
  }

  private emit(): void {
    const cName = this.countries().find((c) => c.pCountryId === this.countryId())?.pCountryName;
    const sName = this.states().find((s) => s.pStateId === this.stateId())?.pStateName;
    const dName = this.districts().find((d) => d.pDistrictId === this.districtId())?.pDistrictName;
    const value: AddressValue = {
      paddress1: this.addr1(),
      paddress2: this.addr2(),
      pcity: this.city(),
      Pincode: this.pincode(),
      pCountryId: this.countryId(),
      pCountry: cName,
      pStateId: this.stateId(),
      pState: sName,
      pDistrictId: this.districtId(),
      pDistrict: dName,
      pRecordid: this.recordId(),
    };
    this.internalChange(value);
  }

  // ---- ControlValueAccessor ----
  writeValue(val: AddressValue | null | undefined): void {
    if (!val) {
      this.addr1.set('');
      this.addr2.set('');
      this.city.set('');
      this.pincode.set('');
      this.countryId.set(null);
      this.stateId.set(null);
      this.districtId.set(null);
      this.recordId.set(0);
      this.touched.set(false);
      return;
    }
    this.addr1.set(val.paddress1 ?? '');
    this.addr2.set(val.paddress2 ?? '');
    this.city.set(val.pcity ?? '');
    this.pincode.set(val.Pincode ?? '');
    this.countryId.set(val.pCountryId ?? null);
    this.stateId.set(val.pStateId ?? null);
    this.districtId.set(val.pDistrictId ?? null);
    this.recordId.set(val.pRecordid ?? 0);
  }

  registerOnChange(fn: (val: AddressValue | null) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
