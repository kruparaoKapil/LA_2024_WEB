import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

/**
 * Single-select wrapper that consolidates legacy `kendo-dropdownlist`,
 * `<ng-select>`, `ngx-select-ex`, and bare `<select>` usages.
 *
 *   <app-select
 *     [options]="branches()"
 *     optionLabel="pBranchName"
 *     optionValue="pBranchID"
 *     placeholder="Select branch"
 *     [(ngModel)]="branchId" />
 */
@Component({
  selector: 'app-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <p-select
      [(ngModel)]="value"
      [options]="options()"
      [optionLabel]="optionLabel()"
      [optionValue]="optionValue()"
      [placeholder]="placeholder()"
      [filter]="filter()"
      [filterBy]="filterBy() || optionLabel()"
      [showClear]="showClear()"
      [disabled]="disabled()"
      [virtualScroll]="virtualScroll()"
      [virtualScrollItemSize]="38"
      [appendTo]="'body'"
      (onChange)="onTouched()"
      (onBlur)="onTouched()"
      styleClass="w-full"
    />
  `,
})
export class SelectComponent implements ControlValueAccessor {
  readonly options = input<unknown[]>([]);
  readonly optionLabel = input<string>('label');
  readonly optionValue = input<string | undefined>(undefined);
  readonly placeholder = input<string>('Select…');
  readonly filter = input<boolean>(true);
  readonly filterBy = input<string>('');
  readonly showClear = input<boolean>(true);
  readonly virtualScroll = input<boolean>(false);

  protected readonly value = signal<unknown>(null);
  protected readonly disabled = signal<boolean>(false);

  private internalChange: (val: unknown) => void = () => {};
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

  writeValue(val: unknown): void {
    this.value.set(val ?? null);
  }
  registerOnChange(fn: (val: unknown) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
