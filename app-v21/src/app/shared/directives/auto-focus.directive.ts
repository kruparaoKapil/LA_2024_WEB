import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Replaces legacy `AutoFocusDirective`. Selector preserved.
 * Focus on first render only (legacy `ngAfterContentChecked` re-focused on
 * every check, which fought user keyboard navigation — that has been fixed).
 */
@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  readonly appAutoFocus = input<boolean>(true);
  private readonly el = inject(ElementRef<HTMLInputElement>);

  ngAfterViewInit(): void {
    if (this.appAutoFocus() === false) return;
    queueMicrotask(() => this.el.nativeElement.focus());
  }
}
