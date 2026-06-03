import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TreeModule } from 'primeng/tree';
import type { TreeNode } from 'primeng/api';

import {
  AccountingMastersService,
  type AccountTreeNode,
} from '../services/accounting-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Read-only chart-of-accounts viewer using `<p-tree>`. Replaces the
 * Kendo TreeView in the legacy Account Tree screen.
 */
@Component({
  selector: 'app-account-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, CardModule, InputTextModule, TreeModule],
  template: `
    <div class="acc-tree">
      <header>
        <h2>Account Tree</h2>
        <p class="muted">
          Chart of accounts grouped by parent. Use the search box to filter.
        </p>
      </header>

      <p-card>
        <div class="search">
          <input
            pInputText
            [(ngModel)]="searchTerm"
            (keydown.enter)="search()"
            placeholder="Search account name…"
          />
          <p-button label="Search" icon="pi pi-search" (onClick)="search()" />
          <p-button
            label="Reset"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-refresh"
            (onClick)="reset()"
          />
        </div>

        <p-tree
          [value]="treeData()"
          [filter]="true"
          filterPlaceholder="Filter…"
          selectionMode="single"
          styleClass="acc-tree-pt"
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .acc-tree { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .search {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      .search input { flex: 1; max-width: 360px; }
      :host ::ng-deep .acc-tree-pt { max-height: 600px; overflow: auto; }
    `,
  ],
})
export class AccountTreeComponent implements OnInit {
  private readonly api = inject(AccountingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);

  protected searchTerm = '';
  protected readonly raw = signal<AccountTreeNode[]>([]);

  protected readonly treeData = computed<TreeNode[]>(() =>
    this.toTreeNodes(this.raw()),
  );

  ngOnInit(): void {
    this.reset();
  }

  private toTreeNodes(rows: AccountTreeNode[]): TreeNode[] {
    return rows.map((node) => ({
      label: `${node.pAccountName}${node.pAccountType ? ` (${node.pAccountType})` : ''}`,
      data: node,
      icon: 'pi pi-folder',
      expandedIcon: 'pi pi-folder-open',
      children: node.children?.length ? this.toTreeNodes(node.children) : undefined,
    }));
  }

  protected search(): void {
    if (!this.searchTerm.trim()) {
      this.reset();
      return;
    }
    this.loader.show();
    this.api.searchAccountTree(this.searchTerm).subscribe({
      next: (rows) => this.raw.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Search failed');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected reset(): void {
    this.searchTerm = '';
    this.loader.show();
    this.api.getAccountTree().subscribe({
      next: (rows) => this.raw.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load account tree');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }
}
