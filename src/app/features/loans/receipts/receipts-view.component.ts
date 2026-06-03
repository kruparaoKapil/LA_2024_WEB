import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
} from '../../../shared/ui';
import {
  LoanReceiptsService,
  type ReceiptFormName,
  type ReceiptListRow,
} from '../services/loan-receipts.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<ReceiptFormName, string> = {
  Receipt: 'Loan Receipts',
  PartPayment: 'Part Payments',
  Moratorium: 'Moratorium',
  Preclosure: 'Preclosures',
};

const ROUTE_FOR_NEW: Record<string, string> = {
  Receipt: '/loans/LoanreceiptNew',
  PartPayment: '/loans/PartPayment',
  Moratorium: '/loans/Moratorium',
};

/**
 * Single list shell for receipts / part-payment / moratorium screens.
 * The active `formName` is detected from the route's `data.formName`
 * so all three screens share one component.
 */
@Component({
  selector: 'app-receipts-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DataGridComponent, DateInputComponent],
  template: `
    <div class="rcp-view">
      <header>
        <h2>{{ title() }}</h2>
        <div class="filters">
          <label>
            <span>From</span>
            <app-date-input [(ngModel)]="fromDate" name="from" />
          </label>
          <label>
            <span>To</span>
            <app-date-input [(ngModel)]="toDate" name="to" />
          </label>
        </div>
      </header>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        [exportFilename]="exportFilename()"
        (rowDblClick)="open($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 0.75rem;
        gap: 1rem;
      }
      header h2 { margin: 0; }
      .filters { display: flex; gap: 0.75rem; }
      .filters label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; min-width: 180px; }
    `,
  ],
})
export class ReceiptsViewComponent implements OnInit {
  private readonly api = inject(LoanReceiptsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly formName = signal<ReceiptFormName>('Receipt');
  protected readonly rows = signal<ReceiptListRow[]>([]);

  protected fromDate: Date = new Date(new Date().setDate(1));
  protected toDate: Date = new Date();

  protected readonly columns: DataGridColumn<ReceiptListRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Customer', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    { field: 'pTransDate', header: 'Date', sortable: true, align: 'center' },
    {
      field: 'pAmountReceived',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pBalance',
      header: 'Balance',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  constructor() {
    effect(() => {
      const _f = this.formName();
      this.load();
    });
  }

  ngOnInit(): void {
    const dataFormName = this.route.snapshot.data['formName'] as ReceiptFormName | undefined;
    if (dataFormName) this.formName.set(dataFormName);
  }

  protected title(): string {
    return TITLES[this.formName()] ?? 'Loan Transactions';
  }

  protected exportFilename(): string {
    return `loans-${this.formName().toLowerCase()}`;
  }

  private toIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private load(): void {
    this.loader.show();
    if (this.formName() === 'Moratorium') {
      this.api.getMoratoriumView().subscribe({
        next: (rows) => this.rows.set(((rows as ReceiptListRow[]) ?? [])),
        error: (err) => {
          this.toast.error(err?.message ?? 'Failed to load');
          this.loader.hide();
        },
        complete: () => this.loader.hide(),
      });
      return;
    }
    this.api
      .getReceiptView(this.toIso(this.fromDate), this.toIso(this.toDate), this.formName())
      .subscribe({
        next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
        error: (err) => {
          this.toast.error(err?.message ?? 'Failed to load');
          this.loader.hide();
        },
        complete: () => this.loader.hide(),
      });
  }

  open(row: ReceiptListRow): void {
    const path = ROUTE_FOR_NEW[this.formName()];
    if (!path) return;
    void this.router.navigate([path, row.pVchapplicationid]);
  }
}
