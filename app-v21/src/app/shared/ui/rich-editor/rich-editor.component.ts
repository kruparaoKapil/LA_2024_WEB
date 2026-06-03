import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

/**
 * Wraps PrimeNG `<p-editor>` (Quill). Replaces `@progress/kendo-angular-editor`.
 *
 * The legacy editor was used for letter templates and notes; for those the
 * recommended path in this migration is HTML+print-CSS routes (Phase 9), but
 * for free-form rich text inside settings/notes screens this wrapper is the
 * one-line drop-in.
 */
@Component({
  selector: 'app-rich-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
  template: `
    <p-editor
      [(ngModel)]="value"
      [readonly]="readonly()"
      [style]="{ height: height() }"
      [placeholder]="placeholder()"
      (onTextChange)="onTouched()"
      styleClass="w-full"
    />
  `,
})
export class RichEditorComponent implements ControlValueAccessor {
  readonly height = input<string>('220px');
  readonly placeholder = input<string>('');
  readonly readonly = input<boolean>(false);

  protected readonly value = signal<string>('');

  private internalChange: (val: string) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    queueMicrotask(() => {
      const proxy = this.value;
      const orig = proxy.set.bind(proxy);
      proxy.set = (next) => {
        orig(next);
        this.internalChange(next ?? '');
      };
    });
  }

  writeValue(val: string | null | undefined): void {
    this.value.set(val ?? '');
  }
  registerOnChange(fn: (val: string) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // p-editor has no `disabled`; toggle readonly instead at consumer level.
  }
}
