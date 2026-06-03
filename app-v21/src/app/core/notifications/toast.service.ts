import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Replacement for the legacy `ngx-toastr` `ToastrService` usage spread across
 * the old `common.service.ts` (`showErrorMessage`, `showInfoMessage`,
 * `showErrorMessageForLessTime`).
 *
 * Backed by PrimeNG's {@link MessageService}; the global `<p-toast>` outlet
 * lives on the root `App` component.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messages = inject(MessageService);

  success(detail: string, summary = 'Success', life = 3000): void {
    this.messages.add({ severity: 'success', summary, detail, life });
  }

  info(detail: string, summary = 'Info', life = 3000): void {
    this.messages.add({ severity: 'info', summary, detail, life });
  }

  warn(detail: string, summary = 'Warning', life = 4000): void {
    this.messages.add({ severity: 'warn', summary, detail, life });
  }

  error(detail: string, summary = 'Error', life = 5000): void {
    this.messages.add({ severity: 'error', summary, detail, life });
  }

  // Compatibility shims for legacy method names.
  showInfoMessage(msg: string): void {
    this.success(msg);
  }
  showErrorMessage(msg: string): void {
    this.error(msg);
  }
  showErrorMessageForLessTime(msg: string): void {
    this.error(msg, 'Error', 2500);
  }
}
