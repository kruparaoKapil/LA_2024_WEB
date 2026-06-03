import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

/**
 * Indian-rupee numeric input. Replaces the dozen+ legacy directives
 * (`mycurrency-formatter`, `decimalwithcurrencyformat`, `roundecimal` for
 * money fields, `numbersonly`, etc.) plus visual currency formatting.
 *
 * Defaults: locale en-IN, mode 'decimal' (no symbol prefix in inputs by
 * convention; toggle `showCurrencySymbol` to render INR ₹ inline).
 */
@Component({
  selector: 'app-currency-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputNumberModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true,
    },
  ],
  template: `
    <p-inputNumber
      [(ngModel)]="value"
      [mode]="showCurrencySymbol() ? 'currency' : 'decimal'"
      currency="INR"
      locale="en-IN"
      [minFractionDigits]="minFractionDigits()"
      [maxFractionDigits]="maxFractionDigits()"
      [min]="min()"
      [max]="max()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [placeholder]="placeholder()"
      [showButtons]="showButtons()"
      [allowEmpty]="allowEmpty()"
      [useGrouping]="true"
      (onBlur)="onTouched()"
      styleClass="w-full"
    />
  `,
})
export class CurrencyInputComponent implements ControlValueAccessor {
  readonly minFractionDigits = input<number>(0);
  readonly maxFractionDigits = input<number>(2);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly readonly = input<boolean>(false);
  readonly showButtons = input<boolean>(false);
  readonly allowEmpty = input<boolean>(true);
  readonly showCurrencySymbol = input<boolean>(false);

  protected readonly value = signal<number | null>(null);
  protected readonly disabled = signal<boolean>(false);

  private internalChange: (val: number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    queueMicrotask(() => {
      const proxy = this.value;
      const orig = proxy.set.bind(proxy);
      proxy.set = (next) => {
        orig(next);
        this.internalChange(next);
      };
    });
  }

  writeValue(val: number | string | null | undefined): void {
    if (val === null || val === undefined || val === '') {
      this.value.set(null);
      return;
    }
    const num = typeof val === 'number' ? val : Number(val);
    this.value.set(Number.isNaN(num) ? null : num);
  }

  registerOnChange(fn: (val: number | null) => void): void {
    this.internalChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
