import { Directive, HostListener, inject, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Title-cases each whitespace-delimited word as the user types.
 * Legacy directive `appInitCap` had two `@HostListener('input')` decorators
 * that fought each other; consolidated into one.
 */
@Directive({
  selector: '[appInitCap]',
  standalone: true,
})
export class InitCapDirective {
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
