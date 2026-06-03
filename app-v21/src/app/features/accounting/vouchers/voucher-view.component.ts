import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import {
  DataGridComponent,
  type DataGridColumn,
} from '../../../shared/ui';
import {
  VoucherService,
  type VoucherKind,
  type VoucherListRow,
} from '../services/voucher.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<VoucherKind, string> = {
  payment: 'Payment Vouchers',
  receipt: 'General Receipts',
  journal: 'Journal Vouchers',
  tdsPayment: 'TDS Payment Vouchers',
  gstPayment: 'GST Payment Vouchers',
  fundTransfer: 'Pending Fund Transfers',
};

const NEW_ROUTE: Record<VoucherKind, string> = {
  payment: '/accounting/PaymentvoucherNew',
  receipt: '/accounting/GeneralreceiptNew',
  journal: '/accounting/JournalvoucherNew',
  tdsPayment: '/accounting/TDSPaymentvoucher',
  gstPayment: '/accounting/GstpaymentVocher',
  fundTransfer: '/accounting/FundTransfer',
};

/**
 * Single list shell for every voucher screen — Payment / Receipt /
 * Journal / TDS / GST / Pending Fund Transfer. The active kind is
 * read from `data.voucherKind`. Replaces five separate ~120-160 LOC
 * legacy `*-view.component.ts` files.
 */
@Component({
  selector: 'app-voucher-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="vch-view">
      <header>
        <h2>{{ title() }}</h2>
        <p-button
          [label]="'New ' + singular()"
          icon="pi pi-plus"
          (onClick)="newVoucher()"
        />
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
        align-items: center;
        margin-bottom: 0.75rem;
      }
      header h2 { margin: 0; }
    `,
  ],
})
export class VoucherViewComponent implements OnInit {
  private readonly api = inject(VoucherService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<VoucherKind>('payment');
  protected readonly rows = signal<VoucherListRow[]>([]);

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Vouchers');
  protected readonly singular = computed(() => {
    const t = TITLES[this.kind()] ?? 'Voucher';
    return t.replace(/s$/, '');
  });
  protected readonly exportFilename = computed(() => `vouchers-${this.kind()}`);

  protected readonly columns: DataGridColumn<VoucherListRow>[] = [
    { field: 'pVoucherNo', header: 'Voucher No', sortable: true, filter: true },
    { field: 'pVoucherDate', header: 'Date', sortable: true, align: 'center' },
    { field: 'pPartyName', header: 'Party', sortable: true, filter: true },
    { field: 'pNarration', header: 'Narration', sortable: true, filter: true },
    {
      field: 'pTotalAmount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['voucherKind'] as VoucherKind | undefined;
    if (k) this.kind.set(k);
    this.load();
  }

  private load(): void {
    this.loader.show();
    const obs =
      this.kind() === 'payment'
        ? this.api.getPaymentVoucherExisting()
        : this.kind() === 'receipt'
          ? this.api.getGeneralReceiptsExisting()
          : this.kind() === 'journal'
            ? this.api.getJournalVouchers()
            : this.kind() === 'fundTransfer'
              ? this.api.getPendingFundTransfers('')
              : this.api.getPaymentVoucherExisting();
    obs.subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load vouchers');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newVoucher(): void {
    void this.router.navigate([NEW_ROUTE[this.kind()]]);
  }

  protected open(row: VoucherListRow): void {
    void this.router.navigate([NEW_ROUTE[this.kind()], row.pVoucherId ?? row.pVoucherNo ?? '']);
  }
}
