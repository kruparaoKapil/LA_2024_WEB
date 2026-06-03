import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';

import { UsersService, UserRow } from '../users.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  DataGridComponent,
  DataGridColumn,
} from '../../../shared/ui';

/**
 * Replaces legacy `UI/Settings/Users/usersview/usersview.component.ts`
 * (kendo-grid + ngx-toastr + manual filter).
 */
@Component({
  selector: 'app-users-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TagModule, DataGridComponent],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Users</h2>
        <p-button
          label="New User"
          icon="pi pi-user-plus"
          (onClick)="add()"
        />
      </div>

      <app-data-grid
        title="All Users"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="users"
        (rowDblClick)="edit($event)"
      />
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
    `,
  ],
})
export class UsersViewComponent {
  private readonly usersSvc = inject(UsersService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);

  protected readonly rows = signal<UserRow[]>([]);
  protected readonly loading = signal<boolean>(false);

  protected readonly columns: DataGridColumn<UserRow>[] = [
    { field: 'pUserName', header: 'Username', filter: true },
    { field: 'pUsercontactRefId', header: 'Contact Ref', filter: true, width: '150px' },
    { field: 'pDesignation', header: 'Designation', filter: true, width: '180px' },
    {
      field: 'pStatus',
      header: 'Status',
      width: '120px',
      align: 'center',
      format: (_v, row) => (row.pIsActive === false ? 'Inactive' : 'Active'),
    },
  ];

  constructor() {
    this.refresh();
  }

  protected refresh(): void {
    this.loading.set(true);
    this.loader.show('Loading users…');
    this.usersSvc.getUserView().subscribe({
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

  protected add(): void {
    void this.router.navigate(['/settings/UsersRegistration']);
  }

  protected edit(row: UserRow): void {
    void this.router.navigate([
      '/settings/UsersRegistration',
      { id: btoa(String(row.pUserID)) },
    ]);
  }

  protected toggleStatus(row: UserRow): void {
    const next = row.pIsActive === false ? 'ACTIVE' : 'INACTIVE';
    this.loader.show('Updating status…');
    this.usersSvc.toggleStatus(row.pUserID, next).subscribe({
      next: () => {
        this.toast.success(`User ${next.toLowerCase()}.`);
        this.refresh();
      },
      error: () => this.loader.hide(),
    });
  }
}
