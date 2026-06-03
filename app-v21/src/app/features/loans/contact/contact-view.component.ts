import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { DataGridComponent, type DataGridColumn } from '../../../shared/ui';
import {
  ContactMasterService,
  type ContactRow,
} from '../services/contact-master.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Replaces legacy `ContactNewViewComponent` (350+ LOC, kendo-grid +
 * server-paged endpoint).
 *
 * The legacy implementation paged via `endindex / searchby` query params.
 * We swap that for client-side paging through `<app-data-grid>` which
 * already handles sort + filter + global search uniformly.
 */
@Component({
  selector: 'app-contact-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent],
  template: `
    <app-data-grid
      title="Contacts"
      [rows]="rows()"
      [columns]="columns"
      selectionMode="single"
      exportFilename="contacts"
      (rowDblClick)="open($event)"
    />
  `,
})
export class ContactViewComponent implements OnInit {
  private readonly contacts = inject(ContactMasterService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<ContactRow[]>([]);

  protected readonly columns: DataGridColumn<ContactRow>[] = [
    { field: 'pContactName', header: 'Name', sortable: true, filter: true },
    { field: 'pContacttype', header: 'Type', sortable: true, filter: true },
    { field: 'pContactNo', header: 'Mobile', sortable: true, filter: true },
    { field: 'pEmail', header: 'Email', sortable: true, filter: true },
    { field: 'pPanNumber', header: 'PAN', sortable: true, filter: true },
    {
      field: 'pIsActive',
      header: 'Active',
      sortable: true,
      align: 'center',
      format: (value) => (value === true ? 'Yes' : value === false ? 'No' : ''),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.contacts.getContactsByName('Contacts').subscribe({
      next: (data) => this.rows.set(Array.isArray(data) ? data : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load contacts');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  open(row: ContactRow): void {
    void this.router.navigate(['/loans/contact', row.pContactRefId]);
  }
}
