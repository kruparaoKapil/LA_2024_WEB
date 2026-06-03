import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

/**
 * Wraps PrimeNG `<p-datepicker>` with the legacy bank app's defaults:
 *  - dd/MM/yyyy display format
 *  - en-IN locale
 *  - calendar icon, clearable
 *  - works with reactive forms and ngModel via ControlValueAccessor
 *
 * Replaces both `kendo-datepicker` and `bsDatepicker` usages.
 */
@Component({
  selector: 'app-date-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePickerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
  template: `
    <p-datepicker
      [(ngModel)]="value"
      [dateFormat]="dateFormat()"
      [showIcon]="showIcon()"
      [showClear]="showClear()"
      [showButtonBar]="showButtonBar()"
      [readonlyInput]="readonlyInput()"
      [disabled]="disabled()"
      [placeholder]="placeholder()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [showTime]="showTime()"
      [timeOnly]="timeOnly()"
      [hourFormat]="hourFormat()"
      [appendTo]="'body'"
      (onSelect)="onTouched()"
      (onClose)="onTouched()"
      (onClear)="onTouched()"
      iconDisplay="input"
      styleClass="w-full"
    />
  `,
})
export class DateInputComponent implements ControlValueAccessor {
  /** PrimeNG date format token (dd/mm/yy means 4-digit year). */
  readonly dateFormat = input<string>('dd/mm/yy');
  readonly showIcon = input<boolean>(true);
  readonly showClear = input<boolean>(true);
  readonly showButtonBar = input<boolean>(true);
  readonly readonlyInput = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly minDate = input<Date | undefined>(undefined);
  readonly maxDate = input<Date | undefined>(undefined);
  readonly showTime = input<boolean>(false);
  readonly timeOnly = input<boolean>(false);
  readonly hourFormat = input<'12' | '24'>('24');

  protected readonly value = signal<Date | null>(null);
  protected readonly disabled = signal<boolean>(false);

  private internalChange: (val: Date | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    // bridge signal → form control on change
    queueMicrotask(() => {
      const proxy = this.value;
      const orig = proxy.set.bind(proxy);
      proxy.set = (next) => {
        orig(next);
        this.internalChange(next);
      };
    });
  }

  writeValue(value: Date | string | null | undefined): void {
    if (value === null || value === undefined || value === '') {
      this.value.set(null);
      return;
    }
    if (value instanceof Date) {
      this.value.set(value);
      return;
    }
    const parsed = new Date(value);
    this.value.set(Number.isNaN(parsed.getTime()) ? null : parsed);
  }

  registerOnChange(fn: (val: Date | null) => void): void {
    this.internalChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
