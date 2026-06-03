import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';

import { ToastService } from '../../core/notifications/toast.service';
import {
  PreLoginBranchService,
  type BranchLocationRow,
  type BranchNameRow,
  type PreLoginBranchSelection,
} from '../../core/auth/pre-login-branch.service';

/**
 * First screen in the legacy app (`path: ''` before `/Login`).
 * User picks office location → branch card → Go → login.
 */
@Component({
  selector: 'app-pre-login-branch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, CardModule, SelectModule],
  template: `
    <div class="prelogin-shell">
      <p-card header="Select office / branch" styleClass="prelogin-card">
        <div class="location-row">
          <label for="location">Office / Branch location</label>
          <p-select
            inputId="location"
            [options]="locations()"
            [ngModel]="selectedLocation()"
            optionLabel="pbranchlocation"
            optionValue="pbranchlocation"
            placeholder="Select location"
            [filter]="true"
            [showClear]="true"
            (ngModelChange)="onLocationChange($event)"
            styleClass="w-full"
          />
        </div>

        @if (loadingBranches()) {
          <p class="hint">Loading branches…</p>
        } @else if (selectedLocation() && branches().length === 0) {
          <p class="hint">No branches found for this location.</p>
        } @else if (branches().length > 0) {
          <div class="branch-grid">
            @for (b of branches(); track b.pbranch_id) {
              <button
                type="button"
                class="branch-card"
                [class.active]="selectedBranch()?.pbranch_id === b.pbranch_id"
                (click)="pickBranch(b)"
              >
                {{ b.pbranchname }}
              </button>
            }
          </div>
        }

        <div class="actions">
          <p-button
            label="Go"
            icon="pi pi-arrow-right"
            iconPos="right"
            [disabled]="!selectedBranch()"
            (onClick)="goToLogin()"
          />
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .prelogin-shell {
        display: grid;
        place-items: center;
        min-height: 100dvh;
        padding: 1.5rem;
        background: var(--p-surface-50);
      }
      :host ::ng-deep .prelogin-card {
        width: min(720px, 100%);
      }
      .location-row {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 1.25rem;
      }
      .hint {
        color: var(--p-text-muted-color, var(--p-surface-500));
        margin: 0.5rem 0;
      }
      .branch-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 0.75rem;
        max-height: 250px;
        overflow-y: auto;
        margin-bottom: 1rem;
      }
      .branch-card {
        padding: 1rem;
        border: 1px solid var(--p-surface-300);
        border-radius: var(--p-border-radius, 6px);
        background: var(--p-surface-0);
        cursor: pointer;
        font-weight: 600;
        color: var(--p-primary-color);
        text-align: center;
      }
      .branch-card:hover,
      .branch-card.active {
        border-color: var(--p-primary-color);
        background: var(--p-surface-100);
      }
      .actions {
        display: flex;
        justify-content: flex-end;
      }
      .w-full {
        width: 100%;
      }
    `,
  ],
})
export class PreLoginBranchComponent implements OnInit {
  private readonly api = inject(PreLoginBranchService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly locations = signal<BranchLocationRow[]>([]);
  protected readonly branches = signal<BranchNameRow[]>([]);
  protected readonly selectedLocation = signal<string | null>(null);
  protected readonly selectedBranch = signal<BranchNameRow | null>(null);
  protected readonly loadingBranches = signal(false);

  ngOnInit(): void {
    this.api.clearSelection();
    this.api.getBranchLocations().subscribe({
      next: (list) => {
        const sorted = [...(list ?? [])].sort((a, b) =>
          (a.pbranchlocation ?? '').localeCompare(b.pbranchlocation ?? ''),
        );
        this.locations.set(sorted);
      },
      error: () => this.toast.error('Could not load branch locations.'),
    });
  }

  protected onLocationChange(location: string | null): void {
    this.selectedLocation.set(location);
    this.selectedBranch.set(null);
    this.branches.set([]);
    if (!location) return;

    this.loadingBranches.set(true);
    this.api.getBranchNameDetails(location).subscribe({
      next: (rows) => this.branches.set(rows ?? []),
      error: () => this.toast.error('Could not load branches for this location.'),
      complete: () => this.loadingBranches.set(false),
    });
  }

  protected pickBranch(branch: BranchNameRow): void {
    this.selectedBranch.set(branch);
  }

  protected goToLogin(): void {
    const branch = this.selectedBranch();
    if (!branch) {
      this.toast.warn('Please select a branch.', 'Branch required');
      return;
    }
    const payload: PreLoginBranchSelection = {
      pbranch_id: branch.pbranch_id,
      pbranch_name: branch.pbranchname,
      pbranch_location: branch.pbranchlocation,
    };
    this.api.saveSelection(payload);
    void this.router.navigate(['/Login']);
  }
}
