import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    if (!value) return;
    const next = value.toUpperCase();
    if (next !== value) this.control?.control?.setValue(next, { emitEvent: false });
  }
}
