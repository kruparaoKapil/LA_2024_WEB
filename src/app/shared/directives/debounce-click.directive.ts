import {
  Directive,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Replaces legacy `ButtonDoubleClickDirective`.
 * Same selector + output name as legacy so usages migrate by import only.
 *
 *   <button appButtonDoubleClick (debounceClick)="save()">Save</button>
 */
@Directive({
  selector: '[appButtonDoubleClick]',
  standalone: true,
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  readonly debounceTime = input<number>(300);
  readonly debounceClick = output<MouseEvent>();

  private readonly clicks = new Subject<MouseEvent>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime()))
      .subscribe((evt) => this.debounceClick.emit(evt));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
