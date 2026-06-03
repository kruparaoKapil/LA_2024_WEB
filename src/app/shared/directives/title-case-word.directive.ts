import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Identical functional behaviour to {@link InitCapDirective} but kept as a
 * separate selector (`appTitlecaseword`) because legacy templates use both
 * names interchangeably; we preserve both during migration to avoid having
 * to grep-and-replace 437 templates.
 */
@Directive({
  selector: '[appTitlecaseword]',
  standalone: true,
})
export class TitleCaseWordDirective {
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    if (!value) return;
    const next = value.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
    );
    if (next !== value) this.control?.control?.setValue(next, { emitEvent: false });
  }
}
