import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

/**
 * Wrapper around `<p-dialog>` with sensible defaults for modal content
 * (closable, draggable=false, modal=true, blockScroll=true, full Indian
 * banking-app feel).
 *
 * Slots:
 *  - default content (`<ng-content>`) for body
 *  - `#headerTpl` for custom header
 *  - `#footerTpl` for custom footer (overrides `showOk`/`showCancel`)
 */
@Component({
  selector: 'app-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="header()"
      [modal]="modal()"
      [closable]="closable()"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="dismissableMask()"
      [blockScroll]="true"
      [style]="dialogStyle()"
      [breakpoints]="{ '960px': '92vw', '640px': '100vw' }"
      (onShow)="opened.emit()"
      (onHide)="closed.emit()"
      [showHeader]="!headerTpl() && !!header()"
    >
      @if (headerTpl(); as tpl) {
        <ng-template pTemplate="header">
          <ng-container [ngTemplateOutlet]="tpl" />
        </ng-template>
      }

      <ng-content />

      @if (footerTpl(); as tpl) {
        <ng-template pTemplate="footer">
          <ng-container [ngTemplateOutlet]="tpl" />
        </ng-template>
      } @else if (showOk() || showCancel()) {
        <ng-template pTemplate="footer">
          @if (showCancel()) {
            <p-button
              [label]="cancelLabel()"
              severity="secondary"
              [outlined]="true"
              (onClick)="cancel()"
            />
          }
          @if (showOk()) {
            <p-button
              [label]="okLabel()"
              icon="pi pi-check"
              [loading]="okLoading()"
              [disabled]="okDisabled()"
              (onClick)="confirm()"
            />
          }
        </ng-template>
      }
    </p-dialog>
  `,
})
export class DialogComponent {
  readonly visible = model<boolean>(false);
  readonly header = input<string>('');
  readonly modal = input<boolean>(true);
  readonly closable = input<boolean>(true);
  readonly dismissableMask = input<boolean>(false);
  readonly width = input<string>('560px');
  readonly height = input<string | undefined>(undefined);

  readonly showOk = input<boolean>(true);
  readonly showCancel = input<boolean>(true);
  readonly okLabel = input<string>('Save');
  readonly cancelLabel = input<string>('Cancel');
  readonly okLoading = input<boolean>(false);
  readonly okDisabled = input<boolean>(false);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly okClick = output<void>();
  readonly cancelClick = output<void>();

  readonly headerTpl = contentChild<TemplateRef<unknown>>('headerTpl');
  readonly footerTpl = contentChild<TemplateRef<unknown>>('footerTpl');

  protected dialogStyle(): Record<string, string> {
    const out: Record<string, string> = { width: this.width() };
    if (this.height()) out['height'] = this.height()!;
    return out;
  }

  protected confirm(): void {
    this.okClick.emit();
  }
  protected cancel(): void {
    this.cancelClick.emit();
    this.visible.set(false);
  }
}
