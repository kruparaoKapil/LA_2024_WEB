import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { DataGridComponent, type DataGridColumn } from '../../../shared/ui';
import {
  DisbursementService,
  type DisbursementRow,
} from '../services/disbursement.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Disbursement list — applications approved but not yet disbursed.
 * Replaces legacy `DisbursementListComponent` (kendo-grid based).
 */
@Component({
  selector: 'app-disbursement-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent],
  template: `
    <div class="dis-view">
      <h2>Loan Disbursements</h2>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="disbursements"
        (rowDblClick)="open($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .dis-view h2 { margin: 0 0 0.75rem 0; }
    `,
  ],
})
export class DisbursementViewComponent implements OnInit {
  private readonly api = inject(DisbursementService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<DisbursementRow[]>([]);

  protected readonly columns: DataGridColumn<DisbursementRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Applicant', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    {
      field: 'pApprovedAmount',
      header: 'Approved',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pDisbursedAmount',
      header: 'Disbursed',
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
    this.api.getDisbursementView().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load disbursements');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  open(row: DisbursementRow): void {
    void this.router.navigate(['/loans/Disbursment', row.pVchapplicationid]);
  }
}
