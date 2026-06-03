import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
} from '../../../shared/ui';
import {
  BankReceiptsService,
  type BankReceiptKind,
  type BankReceiptRow,
} from '../services/bank-receipts.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<BankReceiptKind, string> = {
  fd: 'FD Receipts',
  rd: 'RD Receipts',
  savings: 'Savings A/C Receipts',
  share: 'Share Receipts',
  member: 'Member Receipts',
};

const NEW_ROUTE: Record<BankReceiptKind, string> = {
  fd: '/banking/FdReceiptNew',
  rd: '/banking/RdReceiptNew',
  savings: '/banking/SAReceipt',
  share: '/banking/ShareReceipt',
  member: '/banking/MemberReceipt',
};

/**
 * Generic list shell for the 5 banking receipt screens
 * (FD / RD / Savings / Share / Member). Uses `data.kind` from the
 * route to drive title, dataset, and "New" navigation.
 */
@Component({
  selector: 'app-bank-receipt-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, DataGridComponent, DateInputComponent],
  template: `
    <div class="rcpt-view">
      <header>
        <h2>{{ title() }}</h2>
        <div class="filters">
          <app-date-input [(ngModel)]="fromDate" name="from" placeholder="From" />
          <app-date-input [(ngModel)]="toDate" name="to" placeholder="To" />
          <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="load()" />
          <p-button label="New" icon="pi pi-plus" (onClick)="newReceipt()" />
        </div>
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        [exportFilename]="exportFilename()"
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
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    `,
  ],
})
export class BankReceiptViewComponent implements OnInit {
  private readonly api = inject(BankReceiptsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<BankReceiptKind>('fd');
  protected readonly rows = signal<BankReceiptRow[]>([]);
  protected fromDate: Date | null = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  })();
  protected toDate: Date | null = new Date();

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Bank Receipts');
  protected readonly exportFilename = computed(() => `${this.kind()}-receipts`);

  protected readonly columns: DataGridColumn<BankReceiptRow>[] = [
    { field: 'pReceiptNo', header: 'Receipt #', sortable: true, filter: true },
    { field: 'pReceiptDate', header: 'Date', sortable: true, align: 'center' },
    { field: 'pAccountNo', header: 'Account', sortable: true, filter: true },
    { field: 'pMemberName', header: 'Member', sortable: true, filter: true },
    {
      field: 'pAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pMode', header: 'Mode', sortable: true, align: 'center' },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as BankReceiptKind | undefined;
    if (k) this.kind.set(k);
    this.load();
  }

  protected load(): void {
    this.loader.show();
    const from = this.fromDate ? this.fromDate.toISOString().slice(0, 10) : '';
    const to = this.toDate ? this.toDate.toISOString().slice(0, 10) : '';
    this.api.getViewByKind(this.kind(), from, to).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load receipts');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newReceipt(): void {
    void this.router.navigate([NEW_ROUTE[this.kind()]]);
  }

  protected edit(row: BankReceiptRow): void {
    void this.router.navigate([NEW_ROUTE[this.kind()], row.pReceiptId ?? '']);
  }
}
