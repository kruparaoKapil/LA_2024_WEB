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
  ReactiveFormsModule,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { SelectComponent } from '../../../shared/ui';
import { LocationService } from '../../common/location.service';
import { ToastService } from '../../../core/notifications/toast.service';

export interface PersonalDetailsValue {
  presidentialstatus: 'Resident' | 'Non-Resident';
  pplaceofbirth: string;
  pcountryofbirth: string;
  pnationality: string;
  pminoritycommunity: string;
  pmaritalstatus: 'Married' | 'Unmarried' | 'Divorced' | 'Widowed';
  pStatusname: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_VALUE: PersonalDetailsValue = {
  presidentialstatus: 'Resident',
  pplaceofbirth: '',
  pcountryofbirth: '',
  pnationality: '',
  pminoritycommunity: '',
  pmaritalstatus: 'Married',
  pStatusname: 'Active',
  ptypeofoperation: 'CREATE',
};

/**
 * Replaces 235-LOC `PersonalDetailsComponent`. Modelled as a CVA so the
 * FI Individual shell consumes it via `[(ngModel)]="personalDetails"`.
 *
 * Family details (legacy `<app-family-details>`) are slated for Phase 7C
 * along with movable/property/employment/co-applicant — they share the
 * same list-of-rows pattern and we'll deliver them together.
 */
@Component({
  selector: 'app-personal-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    SelectComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonalDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section class="personal-subform">
      <header><h4>Personal Details</h4></header>

      <div class="grid">
        <div class="field">
          <label>Residential Status</label>
          <div class="radio-row">
            <p-radioButton
              name="resStatus"
              value="Resident"
              [(ngModel)]="value.presidentialstatus"
              (ngModelChange)="emit()"
              inputId="resi-resident"
            />
            <label for="resi-resident">Resident</label>
            <p-radioButton
              name="resStatus"
              value="Non-Resident"
              [(ngModel)]="value.presidentialstatus"
              (ngModelChange)="emit()"
              inputId="resi-nri"
            />
            <label for="resi-nri">Non-Resident</label>
          </div>
        </div>

        <div class="field">
          <label>Marital Status</label>
          <div class="radio-row">
            @for (m of maritalOptions; track m) {
              <p-radioButton
                name="marital"
                [value]="m"
                [(ngModel)]="value.pmaritalstatus"
                (ngModelChange)="emit()"
                [inputId]="'marital-' + m"
              />
              <label [for]="'marital-' + m">{{ m }}</label>
            }
          </div>
        </div>

        <label class="field">
          <span>Place of Birth</span>
          <input
            pInputText
            type="text"
            [(ngModel)]="value.pplaceofbirth"
            (ngModelChange)="emit()"
            name="placeOfBirth"
            maxlength="80"
          />
        </label>

        <div class="field">
          <label>Country of Birth</label>
          <app-select
            [options]="countries()"
            optionLabel="pCountryName"
            optionValue="pCountryName"
            placeholder="Select country"
            [(ngModel)]="value.pcountryofbirth"
            (ngModelChange)="emit()"
            name="countryOfBirth"
          />
        </div>

        <label class="field">
          <span>Nationality</span>
          <input
            pInputText
            type="text"
            [(ngModel)]="value.pnationality"
            (ngModelChange)="emit()"
            name="nationality"
            maxlength="60"
          />
        </label>

        <label class="field">
          <span>Minority Community</span>
          <input
            pInputText
            type="text"
            [(ngModel)]="value.pminoritycommunity"
            (ngModelChange)="emit()"
            name="minorityCommunity"
            maxlength="60"
          />
        </label>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .personal-subform header h4 {
        margin: 0 0 0.75rem 0;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      .radio-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .radio-row label {
        margin-right: 1rem;
        cursor: pointer;
      }
    `,
  ],
})
export class PersonalDetailsSubformComponent
  implements ControlValueAccessor, OnInit
{
  private readonly location = inject(LocationService);
  private readonly toast = inject(ToastService);

  protected readonly countries = this.location.countries;
  protected readonly maritalOptions: ReadonlyArray<
    PersonalDetailsValue['pmaritalstatus']
  > = ['Married', 'Unmarried', 'Divorced', 'Widowed'];

  protected value: PersonalDetailsValue = { ...EMPTY_VALUE };

  ngOnInit(): void {
    this.location.loadCountries().catch((err) =>
      this.toast.error(err?.message ?? 'Failed to load countries'),
    );
  }

  // -------- CVA --------
  private internalChange: (val: PersonalDetailsValue) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: PersonalDetailsValue | null): void {
    this.value = val ? { ...EMPTY_VALUE, ...val } : { ...EMPTY_VALUE };
  }
  registerOnChange(fn: (val: PersonalDetailsValue) => void): void {
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
