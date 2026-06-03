import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { LoaderService } from './core/loader/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, BlockUIModule, ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast position="top-right" />
    <p-confirmDialog />
    <p-blockUI [blocked]="loaderVisible()" styleClass="app-blockui">
      <div class="app-loader-overlay">
        <p-progressSpinner strokeWidth="3" />
        @if (loaderText(); as msg) {
          <span class="app-loader-text">{{ msg }}</span>
        }
      </div>
    </p-blockUI>
    <router-outlet />
  `,
  styles: [
    `
      :host ::ng-deep .app-blockui .p-blockui-overlay,
      :host ::ng-deep .p-blockui {
        z-index: 1100;
      }
      .app-loader-overlay {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        gap: 0.75rem;
        z-index: 1101;
      }
      .app-loader-text {
        color: white;
        font-weight: 500;
      }
    `,
  ],
})
export class App {
  private readonly loader = inject(LoaderService);
  protected readonly loaderVisible = computed(() => this.loader.visible());
  protected readonly loaderText = computed(() => this.loader.text());
}
