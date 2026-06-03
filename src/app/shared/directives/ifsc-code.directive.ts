import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Forces input to uppercase while it does NOT yet match the IFSC pattern
 * `^[A-Z]{4}0\d{6}$`. Once the value matches, it is left as-is so further
 * typing does not retrigger the upper-casing.
 *
 * Selector kept identical to legacy directive.
 */
@Directive({
  selector: '[appIfsccodevalidator]',
  standalone: true,
})
export class IfscCodeDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly regex = /^[A-Z]{4}0\d{6}$/;

  @HostListener('input')
  onInput(): void {
    const value: string = this.el.nativeElement.value ?? '';
    if (!this.regex.test(value) && value !== value.toUpperCase()) {
      this.el.nativeElement.value = value.toUpperCase();
    }
  }
}
