import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * PrimeNG `<p-tabs>` wrapper. Replaces `tabset` from ngx-bootstrap.
 * Pass `items` and supply a `<ng-template #tabContent let-id>` to render
 * each tab's body, OR project content via the legacy slot pattern.
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TabsModule],
  template: `
    <p-tabs [(value)]="active" [scrollable]="scrollable()">
      <p-tablist>
        @for (item of items(); track item.id) {
          <p-tab [value]="item.id" [disabled]="item.disabled ?? false">
            @if (item.icon) {
              <i [class]="item.icon"></i>
            }
            <span>{{ item.label }}</span>
          </p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        @for (item of items(); track item.id) {
          <p-tabpanel [value]="item.id">
            @if (panelTpl(); as tpl) {
              <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: item.id, item }" />
            }
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class TabsComponent {
  readonly items = input.required<TabItem[]>();
  readonly scrollable = input<boolean>(true);
  readonly active = model<string>('');

  readonly panelTpl = contentChild<TemplateRef<{ $implicit: string; item: TabItem }>>('tabContent');
}
