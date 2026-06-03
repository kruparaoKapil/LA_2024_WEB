import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

/**
 * Migration-era landing page. The full banking dashboard (charts, period
 * comparisons, KPI tiles) ports in Phase 9; until then this surface
 * confirms the auth shell is wired and offers quick navigation into the
 * feature areas as they come online.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, TagModule, ButtonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash">
      <p-card>
        <ng-template pTemplate="header">
          <div class="header">
            <h2>Welcome{{ greeting() }}</h2>
            <p class="muted">Migration shell — Angular 21 + PrimeNG (Aura)</p>
          </div>
        </ng-template>

        <div class="tags">
          <p-tag value="Angular 21" severity="success" />
          <p-tag value="PrimeNG (Aura)" severity="info" />
          <p-tag value="Zoneless" severity="warn" />
          <p-tag value="Hash routing preserved" />
        </div>
        <p class="muted">
          Feature areas land here as their migration phases run. Use the
          left sidebar to navigate; un-ported screens render a placeholder
          so existing bookmarks keep working.
        </p>

        <div class="quick-grid">
          @for (q of quick; track q.label) {
            <p-button
              [label]="q.label"
              [icon]="q.icon"
              severity="secondary"
              [outlined]="true"
              [routerLink]="q.link"
            />
          }
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .dash {
        max-width: 1100px;
        margin-inline: auto;
      }
      .header {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--p-surface-200);
      }
      .header h2 {
        margin: 0 0 0.25rem;
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
      .quick-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.5rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);

  protected readonly greeting = computed(() => {
    const name = this.auth.store.user()?.pUserName;
    return name ? `, ${name}` : '';
  });

  protected readonly quick = [
    { label: 'Loans', icon: 'pi pi-credit-card', link: '/loans/masters' },
    { label: 'Banking', icon: 'pi pi-building-columns', link: '/banking/masters' },
    { label: 'Accounting', icon: 'pi pi-calculator', link: '/accounting/masters' },
    { label: 'HRMS', icon: 'pi pi-users', link: '/hrms/transactions' },
    { label: 'TDS', icon: 'pi pi-percentage', link: '/tds/masters' },
    { label: 'Settings', icon: 'pi pi-cog', link: '/settings/users' },
  ];
}
