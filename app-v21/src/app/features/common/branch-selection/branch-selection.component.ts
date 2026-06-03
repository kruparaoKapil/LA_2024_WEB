import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '../../../core/auth/auth.store';
import { ApiClient } from '../../../core/api/api-client.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { firstValueFrom } from 'rxjs';

interface BranchRow {
  pBranchID: number;
  pBranchName: string;
  pBranchCode?: string;
  pIsActive?: boolean;
}

/**
 * Branch picker shown after login when the authenticated user has access
 * to multiple branches. Replaces the legacy `BranchSelection` route which
 * lived in `app.module.ts`'s inline routes and used kendo-grid.
 *
 * On selection it persists `SetBranch` via `AuthStore.setBranch()` (which
 * mirrors the legacy `sessionStorage.setItem('SetBranch', ...)`) and
 * routes to `/Dashboard`.
 */
@Component({
  selector: 'app-branch-selection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardModule, ButtonModule, ListboxModule],
  template: `
    <div class="page">
      <p-card header="Select branch" styleClass="picker">
        @if (loading()) {
          <p>Loading branches…</p>
        } @else if (branches().length === 0) {
          <p>No branches assigned to your account.</p>
        } @else {
          <p-listbox
            [options]="branches()"
            [(ngModel)]="selected"
            optionLabel="pBranchName"
            [filter]="true"
            filterBy="pBranchName,pBranchCode"
            [listStyle]="{ 'max-height': '320px' }"
          />
        }
        <ng-template pTemplate="footer">
          <p-button
            label="Continue"
            icon="pi pi-arrow-right"
            iconPos="right"
            [loading]="busy()"
            [disabled]="!selected() || busy()"
            (onClick)="confirm()"
          />
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 560px;
        margin: 2rem auto;
      }
      :host ::ng-deep .picker .p-card-footer {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class BranchSelectionComponent {
  private readonly api = inject(ApiClient);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);

  protected readonly branches = signal<BranchRow[]>([]);
  protected readonly selected = signal<BranchRow | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly busy = signal<boolean>(false);

  constructor() {
    void this.loadBranches();
  }

  private async loadBranches(): Promise<void> {
    this.loader.show('Loading branches…');
    try {
      const list = await firstValueFrom(
        this.api.get<BranchRow[]>('/Settings/BranchConfig/getBranchesByUser', {
          userId: this.auth.currentUserId(),
        }),
      );
      const active = (list ?? []).filter((b) => b.pIsActive !== false);
      this.branches.set(active);
      if (active.length === 1) {
        this.selected.set(active[0]);
      }
    } catch {
      this.toast.error('Could not load branches.');
    } finally {
      this.loading.set(false);
      this.loader.hide();
    }
  }

  protected confirm(): void {
    const branch = this.selected();
    if (!branch) return;
    this.busy.set(true);
    this.auth.setBranch({
      pBranchID: branch.pBranchID,
      pBranchName: branch.pBranchName,
      pBranchCode: branch.pBranchCode,
    });
    this.toast.success(`Working in ${branch.pBranchName}.`);
    void this.router.navigate(['/Dashboard']);
  }
}
