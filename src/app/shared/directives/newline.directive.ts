import { Directive, HostListener } from '@angular/core';

/**
 * Captures Enter key in `<textarea>` and inserts a literal newline instead of
 * letting the surrounding form submit. Behaviour preserved verbatim.
 */
@Directive({
  selector: '[appNewline]',
  standalone: true,
})
export class NewlineDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopImmediatePropagation();
      const target = event.target as HTMLTextAreaElement | HTMLInputElement;
      target.value = (target.value ?? '') + '\n';
    }
  }
}
