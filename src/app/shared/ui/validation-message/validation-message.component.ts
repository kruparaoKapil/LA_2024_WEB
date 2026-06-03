import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Inline form-field error display, drop-in replacement for legacy
 * `<app-validation-message [messgae]="..." />` (sic). Accepts the legacy
 * `messgae` input AND a properly-spelled `message` input so existing
 * call sites work and new code can use the corrected name.
 */
@Component({
  selector: 'app-validation-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (text(); as t) {
      <small class="invalid-feedback-cst">{{ t }}</small>
    }
  `,
  styles: [
    `
      .invalid-feedback-cst {
        color: var(--p-red-500);
        display: block;
        margin-top: 0.15rem;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class ValidationMessageComponent {
  readonly message = input<string | null | undefined>('');
  /** Legacy mis-spelled input alias kept for compatibility. */
  readonly messgae = input<string | null | undefined>('');

  protected readonly text = computed(
    () => this.message() || this.messgae() || '',
  );
}
