import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';

/**
 * Thin wrapper over `<p-toolbar>` with the canonical layout:
 *  - left slot: title + breadcrumb-style chips
 *  - right slot: action buttons
 *
 * Replaces `kendo-toolbar`. Use bare `<p-toolbar>` for advanced layouts.
 */
@Component({
  selector: 'app-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToolbarModule],
  template: `
    <p-toolbar [style]="{ 'background': background() }" styleClass="app-toolbar-wrap">
      <ng-template pTemplate="start">
        @if (title()) {
          <h2 class="title">{{ title() }}</h2>
        }
        <ng-content select="[slot=start]" />
      </ng-template>
      <ng-template pTemplate="end">
        <ng-content select="[slot=end]" />
      </ng-template>
    </p-toolbar>
  `,
  styles: [
    `
      .title {
        margin: 0;
        font-size: 1.1rem;
      }
      :host ::ng-deep .app-toolbar-wrap {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class ToolbarComponent {
  readonly title = input<string>('');
  readonly background = input<string>('var(--p-surface-0)');
}
