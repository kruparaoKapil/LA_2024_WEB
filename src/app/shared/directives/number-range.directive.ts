import { Directive, HostListener, input } from '@angular/core';

interface NumberRangeRef {
  inputRef: HTMLInputElement;
  minValue: number;
  maxValue: number;
}

/**
 * Clamps an external input ref's value to [min, max] on each keyup.
 * Selector preserved (`appNumberRange`) so existing templates do not need
 * to change their attribute binding.
 */
@Directive({
  selector: '[appNumberRange]',
  standalone: true,
})
export class NumberRangeDirective {
  readonly inputRefObject = input.required<NumberRangeRef>();

  @HostListener('keyup')
  onKeyUp(): void {
    const ref = this.inputRefObject();
    const v = Number(ref.inputRef.value);
    if (v > ref.maxValue) ref.inputRef.value = String(ref.maxValue);
    else if (v < ref.minValue) ref.inputRef.value = String(ref.minValue);
  }
}
