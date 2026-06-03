import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash">
      <p-card header="Migration shell — Angular 21 + PrimeNG">
        <p>
          This is the new app shell. Feature modules will be ported here
          phase-by-phase.
        </p>
        <div class="tags">
          <p-tag value="Angular 21" severity="success" />
          <p-tag value="PrimeNG (Aura)" severity="info" />
          <p-tag value="Zoneless" severity="warn" />
          <p-tag value="Hash routing preserved" />
        </div>
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
      .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
    `,
  ],
})
export class DashboardComponent {}
