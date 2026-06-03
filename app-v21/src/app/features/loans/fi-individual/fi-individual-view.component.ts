import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { DataGridComponent, type DataGridColumn } from '../../../shared/ui';
import {
  FIIndividualService,
  type FIApplicationRow,
} from '../services/fi-individual.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Replaces the legacy FI-Individual view (kendo-grid + custom paging).
 */
@Component({
  selector: 'app-fi-individual-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="fi-view">
      <div class="fi-view-toolbar">
        <h2>FI – Individual</h2>
        <p-button
          label="New Application"
          icon="pi pi-plus"
          (onClick)="newApplication()"
        />
      </div>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="fi-individual"
        (rowDblClick)="open($event)"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .fi-view-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }
      .fi-view-toolbar h2 {
        margin: 0;
      }
    `,
  ],
})
export class FIIndividualViewComponent implements OnInit {
  private readonly fi = inject(FIIndividualService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<FIApplicationRow[]>([]);

  protected readonly columns: DataGridColumn<FIApplicationRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Applicant', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    { field: 'pSchemeName', header: 'Scheme', sortable: true, filter: true },
    {
      field: 'pLoanAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, filter: true, align: 'center' },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.fi.getFiView().subscribe({
      next: (data) => this.rows.set(Array.isArray(data) ? data : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load applications');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  newApplication(): void {
    void this.router.navigate(['/loans/fi-individual/new']);
  }

  open(row: FIApplicationRow): void {
    void this.router.navigate(['/loans/fi-individual', row.pVchapplicationid]);
  }
}
