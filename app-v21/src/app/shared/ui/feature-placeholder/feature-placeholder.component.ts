import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

/**
 * Default landing for feature areas that are routed but not yet ported.
 * Each feature `*.routes.ts` mounts this component on routes whose
 * components have not migrated yet, surfacing the route's `data` so users
 * see exactly which screen is coming and in which migration phase.
 *
 * Route data shape:
 *   { feature: 'Loans', screen: 'Charges Master', phase: 'Phase 7' }
 */
@Component({
  selector: 'app-feature-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ButtonModule, TagModule, RouterLink],
  template: `
    <p-card styleClass="placeholder-card">
      <ng-template pTemplate="header">
        <div class="header">
          <div>
            <h2>{{ screen() }}</h2>
            <p class="muted">Feature area: {{ feature() }}</p>
          </div>
          <p-tag [value]="phase()" severity="info" />
        </div>
      </ng-template>

      <p>
        This screen has not been migrated yet. Its placeholder route is wired
        so users can already navigate here; the real implementation will land
        when {{ phase() }} runs.
      </p>

      <div class="links">
        <p-button
          label="Back to Dashboard"
          icon="pi pi-arrow-left"
          severity="secondary"
          [outlined]="true"
          routerLink="/Dashboard"
        />
      </div>
    </p-card>
  `,
  styles: [
    `
      :host ::ng-deep .placeholder-card {
        max-width: 720px;
        margin: 1.5rem auto;
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
        margin: 0.25rem 0 0;
      }
      .links {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
      }
    `,
  ],
})
export class FeaturePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly feature = computed(
    () => (this.route.snapshot.data['feature'] as string | undefined) ?? 'Feature',
  );
  protected readonly screen = computed(
    () => (this.route.snapshot.data['screen'] as string | undefined) ?? 'Screen',
  );
  protected readonly phase = computed(
    () => (this.route.snapshot.data['phase'] as string | undefined) ?? 'Coming soon',
  );
}
