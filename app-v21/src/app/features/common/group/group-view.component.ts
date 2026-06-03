import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { GroupRow, GroupService } from '../group.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { DataGridComponent, DataGridColumn } from '../../../shared/ui';

/**
 * Group list. Replaces legacy `UI/Common/group-view/group-view.component`
 * (kendo-grid → `<app-data-grid>`, `_GroupService` → `GroupService` via
 * `ApiClient`, ngx-toastr → `ToastService`, manual confirm dialogs →
 * `<app-confirm-button>`).
 */
@Component({
  selector: 'app-group-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Groups</h2>
        <p-button
          label="New Group"
          icon="pi pi-plus"
          (onClick)="addNew()"
        />
      </div>

      <app-data-grid
        title="All Groups"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="groups"
        (rowDblClick)="edit($event)"
      >
        <ng-template #emptyState>
          No groups configured yet.
        </ng-template>
      </app-data-grid>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1200px;
        margin-inline: auto;
      }
      .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .page-head h2 {
        margin: 0;
      }
      .row-actions {
        display: flex;
        gap: 0.4rem;
      }
    `,
  ],
})
export class GroupViewComponent {
  private readonly groups = inject(GroupService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);

  protected readonly rows = signal<GroupRow[]>([]);
  protected readonly loading = signal<boolean>(false);

  protected readonly columns: DataGridColumn<GroupRow>[] = [
    { field: 'pGroupcode', header: 'Code', filter: true, width: '120px' },
    { field: 'pGroupname', header: 'Name', filter: true },
    { field: 'pGrouptype', header: 'Type', filter: true, width: '160px' },
    {
      field: 'pMembercount',
      header: 'Members',
      align: 'right',
      width: '120px',
    },
  ];

  constructor() {
    this.refresh();
  }

  protected refresh(): void {
    this.loading.set(true);
    this.loader.show('Loading groups…');
    this.groups.getGroupView().subscribe({
      next: (list) => {
        this.rows.set(list ?? []);
        this.loading.set(false);
        this.loader.hide();
      },
      error: () => {
        this.loading.set(false);
        this.loader.hide();
      },
    });
  }

  protected addNew(): void {
    this.groups.clearRowEditId();
    void this.router.navigate(['/common/GroupCreation']);
  }

  protected edit(row: GroupRow): void {
    this.groups.setRowEditId(row.pGroupid);
    const id = btoa(String(row.pGroupid));
    void this.router.navigate(['/common/GroupCreation', { id }]);
  }

  protected remove(row: GroupRow): void {
    const userId = Number(this.auth.currentUserId()) || 0;
    this.loader.show('Deleting…');
    this.groups
      .deleteGroupDetails({
        pGroupID: row.pGroupid,
        pMemberId: 0,
        pTransactionType: 'DELETE',
        pGroupName: row.pGroupname,
        pCreatedby: userId,
        pTypeofoperation: 'VIEW',
      })
      .subscribe({
        next: (ok) => {
          this.loader.hide();
          if (ok === true) {
            this.toast.success('Record deleted successfully');
            this.refresh();
          }
        },
        error: () => this.loader.hide(),
      });
  }
}
