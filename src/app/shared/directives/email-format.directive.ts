import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Lower-cases all alphabetic input as the user types. Used in email fields
 * where the legacy regex was only a sentinel for whether to trigger the
 * lower-case substitution. Behaviour preserved.
 */
@Directive({
  selector: '[appEmailFormat]',
  standalone: true,
})
export class EmailFormatDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const value: string = this.el.nativeElement.value ?? '';
    const next = value.toLowerCase();
    if (next !== value) this.el.nativeElement.value = next;
  }
}
