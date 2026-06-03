import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';

/**
 * Button that asks the global `<p-confirmDialog>` for confirmation before
 * emitting `confirmed`. Encapsulates the most common kendo-grid command-cell
 * pattern: "Delete" with a "Are you sure?" dialog.
 */
@Component({
  selector: 'app-confirm-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="label()"
      [icon]="icon()"
      [severity]="severity()"
      [outlined]="outlined()"
      [text]="text()"
      [size]="size()"
      [disabled]="disabled() || busy()"
      [loading]="busy()"
      (onClick)="ask()"
    />
  `,
})
export class ConfirmButtonComponent {
  private readonly confirm = inject(ConfirmationService);

  readonly label = input<string>('Delete');
  readonly icon = input<string>('pi pi-trash');
  readonly severity = input<'danger' | 'warn' | 'info' | 'success' | 'secondary' | 'help' | 'primary' | 'contrast'>('danger');
  readonly outlined = input<boolean>(true);
  readonly text = input<boolean>(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly busy = input<boolean>(false);
  readonly message = input<string>('Are you sure?');
  readonly header = input<string>('Confirm');
  readonly acceptLabel = input<string>('Yes');
  readonly rejectLabel = input<string>('Cancel');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected ask(): void {
    this.confirm.confirm({
      message: this.message(),
      header: this.header(),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.acceptLabel(),
      rejectLabel: this.rejectLabel(),
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.confirmed.emit(),
      reject: () => this.cancelled.emit(),
    });
  }
}
