import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

/**
 * Multi-select wrapper. Replaces `ng-multiselect-dropdown`,
 * `kendo-multiselect`, `ngx-treeview` (when used as a flat picker), etc.
 */
@Component({
  selector: 'app-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MultiSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  template: `
    <p-multiSelect
      [(ngModel)]="value"
      [options]="options()"
      [optionLabel]="optionLabel()"
      [optionValue]="optionValue()"
      [placeholder]="placeholder()"
      [filter]="filter()"
      [filterBy]="filterBy() || optionLabel()"
      [maxSelectedLabels]="maxSelectedLabels()"
      [selectedItemsLabel]="selectedItemsLabel()"
      [disabled]="disabled()"
      [showClear]="showClear()"
      [appendTo]="'body'"
      [display]="chips() ? 'chip' : 'comma'"
      (onChange)="onTouched()"
      (onPanelHide)="onTouched()"
      styleClass="w-full"
    />
  `,
})
export class MultiSelectComponent implements ControlValueAccessor {
  readonly options = input<unknown[]>([]);
  readonly optionLabel = input<string>('label');
  readonly optionValue = input<string | undefined>(undefined);
  readonly placeholder = input<string>('Select…');
  readonly filter = input<boolean>(true);
  readonly filterBy = input<string>('');
  readonly maxSelectedLabels = input<number>(3);
  readonly selectedItemsLabel = input<string>('{0} selected');
  readonly showClear = input<boolean>(true);
  readonly chips = input<boolean>(false);

  protected readonly value = signal<unknown[]>([]);
  protected readonly disabled = signal<boolean>(false);

  private internalChange: (val: unknown[]) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    queueMicrotask(() => {
      const proxy = this.value;
      const orig = proxy.set.bind(proxy);
      proxy.set = (next) => {
        orig(next);
        this.internalChange(next);
      };
    });
  }

  writeValue(val: unknown[] | null | undefined): void {
    this.value.set(Array.isArray(val) ? val : []);
  }
  registerOnChange(fn: (val: unknown[]) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
