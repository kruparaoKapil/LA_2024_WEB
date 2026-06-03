import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { TreeModule } from 'primeng/tree';
import type { TreeNode } from 'primeng/api';

/**
 * Wraps `<p-tree>`. Replaces `kendo-treeview` and `ngx-treeview`.
 * For tabular tree displays, use PrimeNG's `<p-treeTable>` directly.
 */
@Component({
  selector: 'app-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeModule],
  template: `
    <p-tree
      [value]="nodes()"
      [(selection)]="selection"
      [selectionMode]="selectionMode()"
      [loading]="loading()"
      [filter]="filter()"
      [filterMode]="'lenient'"
      [filterPlaceholder]="filterPlaceholder()"
      [scrollHeight]="scrollHeight()"
      (onNodeSelect)="nodeSelect.emit($event.node)"
      (onNodeUnselect)="nodeUnselect.emit($event.node)"
      (onNodeExpand)="nodeExpand.emit($event.node)"
      (onNodeCollapse)="nodeCollapse.emit($event.node)"
      styleClass="w-full"
    />
  `,
})
export class TreeComponent {
  readonly nodes = input.required<TreeNode[]>();
  readonly selectionMode = input<'single' | 'multiple' | 'checkbox' | undefined>(undefined);
  readonly loading = input<boolean>(false);
  readonly filter = input<boolean>(true);
  readonly filterPlaceholder = input<string>('Search…');
  readonly scrollHeight = input<string>('flex');

  readonly selection = model<TreeNode | TreeNode[] | null>(null);

  readonly nodeSelect = output<TreeNode>();
  readonly nodeUnselect = output<TreeNode>();
  readonly nodeExpand = output<TreeNode>();
  readonly nodeCollapse = output<TreeNode>();
}
