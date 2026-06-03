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
  LoanReceiptsService,
  type ReceiptListRow,
} from '../services/loan-receipts.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Preclosure list — pulls active loans eligible for preclosure via
 * the same `/Receipts` endpoint family used by the receipts view, with
 * `formname=Preclosure`.
 */
@Component({
  selector: 'app-preclosure-tx-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent],
  template: `
    <div class="pre-view">
      <h2>Loan Preclosure</h2>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="loan-preclosures"
        (rowDblClick)="open($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .pre-view h2 { margin: 0 0 0.75rem 0; }
    `,
  ],
})
export class PreclosureTxViewComponent implements OnInit {
  private readonly api = inject(LoanReceiptsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<ReceiptListRow[]>([]);

  protected readonly columns: DataGridColumn<ReceiptListRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Customer', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    {
      field: 'pBalance',
      header: 'Outstanding',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    this.loader.show();
    this.api
      .getReceiptView(monthAgo.toISOString().slice(0, 10), today, 'Preclosure')
      .subscribe({
        next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
        error: (err) => {
          this.toast.error(err?.message ?? 'Failed to load preclosures');
          this.loader.hide();
        },
        complete: () => this.loader.hide(),
      });
  }

  open(row: ReceiptListRow): void {
    void this.router.navigate(['/loans/LoanpreclosureNew', row.pVchapplicationid]);
  }
}
