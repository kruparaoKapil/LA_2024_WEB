import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import {
  DataGridComponent,
  type DataGridColumn,
} from '../../../shared/ui';
import {
  BankingMastersService,
  type MemberRow,
} from '../services/banking-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-member-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="mem-view">
      <header>
        <h2>Members</h2>
        <p-button label="New Member" icon="pi pi-plus" (onClick)="newMember()" />
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="members"
        (rowDblClick)="edit($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      header h2 { margin: 0; }
    `,
  ],
})
export class MemberViewComponent implements OnInit {
  private readonly api = inject(BankingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<MemberRow[]>([]);

  protected readonly columns: DataGridColumn<MemberRow>[] = [
    { field: 'pMemberCode', header: 'Code', sortable: true, filter: true },
    { field: 'pMemberName', header: 'Name', sortable: true, filter: true },
    { field: 'pMemberType', header: 'Type', sortable: true, filter: true },
    { field: 'pContactType', header: 'Contact Type', sortable: true, filter: true },
    { field: 'pPhone', header: 'Phone', sortable: true },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.listFiMembers().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load members');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newMember(): void {
    this.api.newFormStatus.set('New');
    this.api.editingMemberId.set(null);
    this.api.editingMemberData.set(null);
    void this.router.navigate(['/banking/MemberNew']);
  }

  protected edit(row: MemberRow): void {
    this.api.newFormStatus.set('Edit');
    this.api.editingMemberId.set(row.pMemberId ?? null);
    this.api.editingMemberData.set(row);
    void this.router.navigate(['/banking/MemberNew', row.pMemberId ?? '']);
  }
}
