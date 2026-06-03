import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * Constrains numeric input to `<integerLength>` digits before the decimal and
 * `<decimalLength>` digits after, where the limits arrive packed into a single
 * string `"<integerLength>@<decimalLength>"` (legacy convention preserved).
 *
 * Usage:  <input [appRoundecimal]="'10@2'" />
 */
@Directive({
  selector: '[appRoundecimal]',
  standalone: true,
})
export class RoundDecimalDirective {
  readonly appRoundecimal = input.required<string>();
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly regex = /^[0-9.]+$/;
  private readonly specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (this.specialKeys.includes(event.key)) return;

    const info = this.appRoundecimal().split('@');
    const roundLength = Number(info[0]);
    const decimalLength = Number(info[1]);

    const controlValue: string = (this.el.nativeElement.value ?? '').toString().replace(/,/g, '');
    const position = this.el.nativeElement.selectionStart ?? controlValue.length;
    const newValue =
      controlValue.slice(0, position) +
      (event.key === 'Decimal' ? '.' : event.key) +
      controlValue.slice(position);

    if (!controlValue.includes('.')) {
      if (controlValue.length > roundLength) {
        event.preventDefault();
        return;
      }
      if (controlValue.length === roundLength && event.key !== '.') {
        event.preventDefault();
        return;
      }
    } else {
      const decimalPart = controlValue.split('.')[1] ?? '';
      const integerPart = controlValue.split('.')[0];
      const newIntegerPart = newValue.split('.')[0];

      if (parseFloat(integerPart) !== parseFloat(newIntegerPart)) {
        if (newIntegerPart.length > roundLength) {
          event.preventDefault();
          return;
        }
        if (newIntegerPart.length === roundLength && event.key === '.') {
          event.preventDefault();
          return;
        }
      } else if (decimalPart.length >= decimalLength) {
        event.preventDefault();
        return;
      }
    }

    if (newValue !== '.' && newValue !== '00' && !newValue.includes('..')) {
      if (newValue && !this.regex.test(newValue)) {
        event.preventDefault();
        return;
      }
    } else {
      event.preventDefault();
      return;
    }

    if (event.key === '.' && decimalLength === 0) {
      event.preventDefault();
    }
  }
}
