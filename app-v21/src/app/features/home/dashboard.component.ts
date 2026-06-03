import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash">
      <p-card>
        <ng-template pTemplate="header">
          <div class="header">
            <div>
              <h2>Welcome{{ greeting() }}</h2>
              <p class="muted">Migration shell — Angular 21 + PrimeNG</p>
            </div>
            <p-button
              label="Sign out"
              severity="secondary"
              [outlined]="true"
              icon="pi pi-sign-out"
              (onClick)="signOut()"
            />
          </div>
        </ng-template>

        <div class="tags">
          <p-tag value="Angular 21" severity="success" />
          <p-tag value="PrimeNG (Aura)" severity="info" />
          <p-tag value="Zoneless" severity="warn" />
          <p-tag value="Hash routing preserved" />
        </div>
        <p class="muted">
          Feature areas (Loans, Banking, Accounting, HRMS, TDS, Settings) will be
          ported into this shell in subsequent phases.
        </p>
      </p-card>
    </div>
  `,
  styles: [
    `
      .dash {
        padding: 1.5rem;
        max-width: 960px;
        margin-inline: auto;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--p-surface-200);
      }
      .header h2 {
        margin: 0;
      }
      .muted {
        color: var(--p-text-muted-color, var(--p-surface-500));
      }
      .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly greeting = computed(() => {
    const name = this.auth.store.user()?.pUserName;
    return name ? `, ${name}` : '';
  });

  protected signOut(): void {
    this.auth.logout();
  }
}
