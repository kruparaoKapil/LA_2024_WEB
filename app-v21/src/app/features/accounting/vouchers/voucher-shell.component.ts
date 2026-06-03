import { CommonModule } from '@angular/common';
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
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  VoucherService,
  type LedgerOption,
  type VoucherKind,
  type VoucherLine,
} from '../services/voucher.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

const TITLES: Record<VoucherKind, string> = {
  payment: 'Payment Voucher',
  receipt: 'General Receipt',
  journal: 'Journal Voucher',
  tdsPayment: 'TDS Payment Voucher',
  gstPayment: 'GST Payment Voucher',
  fundTransfer: 'Fund Transfer',
};

const VIEW_ROUTE: Record<VoucherKind, string> = {
  payment: '/accounting/PaymentvoucherView',
  receipt: '/accounting/GeneralreceiptView',
  journal: '/accounting/JournalvoucherView',
  tdsPayment: '/accounting/TdsPaymentvoucherView',
  gstPayment: '/accounting/GstpaymentVocher',
  fundTransfer: '/accounting/PendingFundTransfer',
};

const FORM_NAMES: Record<VoucherKind, string> = {
  payment: 'PaymentVoucher',
  receipt: 'GeneralReceipt',
  journal: 'JournalVoucher',
  tdsPayment: 'TDSPaymentVoucher',
  gstPayment: 'GSTPaymentVoucher',
  fundTransfer: 'FundTransfer',
};

const PAYMENT_MODE_OPTIONS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Bank', value: 'BANK' },
];

const TRANS_TYPE_OPTIONS = [
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'NEFT', value: 'NEFT' },
  { label: 'RTGS', value: 'RTGS' },
  { label: 'IMPS', value: 'IMPS' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Card', value: 'CARD' },
];

interface VoucherHeader {
  pVoucherDate: Date | null;
  pVoucherNo: string;
  pNarration: string;
  pTotalAmount: number;
  // payment-specific
  pmodofpayment: string;
  ptranstype: string;
  pbankname: string;
  pbranchname: string;
  pbankid: number | null;
  pChequenumber: string;
  pchequedate: Date | null;
  pCardNumber: string;
  pUpiname: string;
  pUpiid: string;
  pDocStorePath: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_HEADER: VoucherHeader = {
  pVoucherDate: new Date(),
  pVoucherNo: '',
  pNarration: '',
  pTotalAmount: 0,
  pmodofpayment: 'BANK',
  ptranstype: 'CHEQUE',
  pbankname: '',
  pbranchname: '',
  pbankid: null,
  pChequenumber: '',
  pchequedate: new Date(),
  pCardNumber: '',
  pUpiname: '',
  pUpiid: '',
  pDocStorePath: '',
  ptypeofoperation: 'CREATE',
};

const EMPTY_LINE: VoucherLine = {
  pledgerid: null,
  pledgername: '',
  psubledgerid: null,
  psubledgername: '',
  pamount: 0,
  pactualpaidamount: 0,
  pisgstapplicable: false,
  pgstpercentage: 0,
  pgstamount: 0,
  pistdsapplicable: false,
  ptdsamount: 0,
  pTdsSection: '',
  pTdsPercentage: 0,
  ppartyid: null,
  ppartyname: '',
  ptypeofoperation: 'CREATE',
};

/**
 * Single new/edit shell for every voucher kind. Replaces:
 *   • 1655-LOC `paymentvoucher-new`
 *   • 1769-LOC `generalreceipt-new`
 *   • 1702-LOC `journalvoucher-new`
 *   • the TDS/GST/FundTransfer voucher screens
 *
 * The legacy stack reimplemented the same ledger-line grid + bank fields
 * + GST/TDS toggles in each component. Consolidating saves ~5500 LOC.
 *
 * Behaviour is parameterised by `data.voucherKind`:
 *   • `journal` shows debit/credit columns and hides bank fields
 *   • `tdsPayment` defaults TDS section + uses TDS-only ledger list
 *   • `gstPayment` enables the GST sub-form on every line
 *   • `fundTransfer` shows From-Bank / To-Bank with a single amount
 */
@Component({
  selector: 'app-voucher-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    InputTextModule,
    TooltipModule,
    CurrencyInputComponent,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="vch-shell">
      <header class="vh">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">
            {{ header.pVoucherNo ? 'Voucher #' + header.pVoucherNo : 'New voucher' }}
          </p>
        </div>
        <div class="actions">
          <p-button
            label="Save"
            icon="pi pi-save"
            (onClick)="save()"
            [loading]="saving()"
            [disabled]="!isValid()"
          />
          <p-button
            label="Back"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-arrow-left"
            (onClick)="back()"
          />
        </div>
      </header>

      <p-card header="Header">
        <div class="grid">
          <label class="field">
            <span>{{ kind() === 'fundTransfer' ? 'Transfer Date' : 'Voucher Date' }}<sup>*</sup></span>
            <app-date-input
              [(ngModel)]="header.pVoucherDate"
              name="vDate"
              [maxDate]="today"
            />
            <app-validation-message [message]="errors().pVoucherDate" />
          </label>
          @if (kind() !== 'journal' && kind() !== 'fundTransfer') {
            <label class="field">
              <span>Mode<sup>*</sup></span>
              <app-select
                [options]="paymentModeOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="header.pmodofpayment"
                name="mode"
                [showClear]="false"
              />
            </label>
            @if (header.pmodofpayment === 'BANK') {
              <label class="field">
                <span>Trans Type</span>
                <app-select
                  [options]="transTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [(ngModel)]="header.ptranstype"
                  name="transType"
                  [showClear]="false"
                />
              </label>
              <label class="field">
                <span>Bank</span>
                <input
                  pInputText
                  [(ngModel)]="header.pbankname"
                  name="bankName"
                />
              </label>
              @if (header.ptranstype === 'CHEQUE') {
                <label class="field">
                  <span>Cheque No</span>
                  <input
                    pInputText
                    [(ngModel)]="header.pChequenumber"
                    name="chqNo"
                    maxlength="20"
                  />
                </label>
                <label class="field">
                  <span>Cheque Date</span>
                  <app-date-input
                    [(ngModel)]="header.pchequedate"
                    name="chqDate"
                  />
                </label>
              }
              @if (header.ptranstype === 'UPI') {
                <label class="field">
                  <span>UPI Name</span>
                  <input
                    pInputText
                    [(ngModel)]="header.pUpiname"
                    name="upiName"
                  />
                </label>
                <label class="field">
                  <span>UPI ID</span>
                  <input pInputText [(ngModel)]="header.pUpiid" name="upiId" />
                </label>
              }
            }
          }
          <label class="field span-3">
            <span>Narration<sup>*</sup></span>
            <textarea
              pTextarea
              rows="2"
              [(ngModel)]="header.pNarration"
              name="narration"
              maxlength="500"
            ></textarea>
            <app-validation-message [message]="errors().pNarration" />
          </label>
        </div>
      </p-card>

      <p-card [header]="kind() === 'journal' ? 'Debits & Credits' : 'Line Items'">
        <div class="lines-toolbar">
          <p-button
            label="Add Line"
            icon="pi pi-plus"
            severity="secondary"
            [outlined]="true"
            (onClick)="addLine()"
          />
        </div>

        <app-data-grid
          [rows]="visibleLines()"
          [columns]="lineColumns()"
          [showSearch]="false"
          [showExportExcel]="false"
          [showExportPdf]="false"
          [paginator]="false"
          emptyMessage="No lines yet — click Add Line."
        />

        <div class="line-editor" *ngIf="editingIndex() !== null">
          <h4>Editing line #{{ (editingIndex() ?? 0) + 1 }}</h4>
          <div class="grid">
            <label class="field">
              <span>Ledger<sup>*</sup></span>
              <app-select
                [options]="ledgers()"
                optionLabel="pledgername"
                optionValue="pledgerid"
                [(ngModel)]="editingLine.pledgerid"
                (ngModelChange)="onLedgerChange()"
                name="ledger"
                placeholder="Pick ledger"
              />
            </label>
            <label class="field">
              <span>Amount<sup>*</sup></span>
              <app-currency-input
                [(ngModel)]="editingLine.pamount"
                (ngModelChange)="syncTotal()"
                name="lineAmt"
              />
            </label>
            @if (kind() !== 'journal' && kind() !== 'fundTransfer') {
              <label class="field">
                <span>Party</span>
                <input
                  pInputText
                  [(ngModel)]="editingLine.ppartyname"
                  name="party"
                  maxlength="100"
                />
              </label>
            }
          </div>
          <div class="line-actions">
            <p-button
              label="Apply"
              icon="pi pi-check"
              size="small"
              (onClick)="applyLine()"
              [disabled]="!editingLine.pledgerid || !editingLine.pamount"
            />
            <p-button
              label="Cancel"
              severity="secondary"
              [outlined]="true"
              icon="pi pi-times"
              size="small"
              (onClick)="editingIndex.set(null)"
            />
          </div>
        </div>

        <div class="totals">
          Total:
          <strong>{{ header.pTotalAmount | number: '1.0-2':'en-IN' }}</strong>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .vch-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .vh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .vh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-3 { grid-column: span 3; }
      .lines-toolbar { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
      .line-editor { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--p-surface-300); }
      .line-editor h4 { margin: 0 0 0.5rem 0; }
      .line-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
      .totals { margin-top: 0.5rem; text-align: right; font-size: 0.95rem; }
    `,
  ],
})
export class VoucherShellComponent implements OnInit {
  private readonly api = inject(VoucherService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly paymentModeOptions = PAYMENT_MODE_OPTIONS;
  protected readonly transTypeOptions = TRANS_TYPE_OPTIONS;

  protected readonly kind = signal<VoucherKind>('payment');
  protected readonly saving = signal<boolean>(false);
  protected readonly ledgers = signal<LedgerOption[]>([]);
  protected readonly lines = signal<VoucherLine[]>([]);
  protected readonly editingIndex = signal<number | null>(null);
  protected editingLine: VoucherLine = { ...EMPTY_LINE };
  protected header: VoucherHeader = { ...EMPTY_HEADER };

  protected readonly errors = signal<{
    pVoucherDate: string;
    pNarration: string;
    pLines: string;
  }>({ pVoucherDate: '', pNarration: '', pLines: '' });

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Voucher');

  protected readonly visibleLines = computed(() =>
    this.lines().filter((l) => l.ptypeofoperation !== 'DELETE'),
  );

  protected readonly isValid = computed(() => {
    const h = this.header;
    return (
      !!h.pVoucherDate &&
      !!h.pNarration &&
      this.visibleLines().length > 0 &&
      this.visibleLines().every((l) => l.pledgerid && l.pamount > 0)
    );
  });

  protected readonly lineColumns = computed<DataGridColumn<VoucherLine>[]>(() => [
    { field: 'pledgername', header: 'Ledger', sortable: true },
    {
      field: 'pamount',
      header: this.kind() === 'journal' ? 'Debit / Credit' : 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'ppartyname', header: 'Party' },
    {
      field: 'pgstamount',
      header: 'GST',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : '',
    },
    {
      field: 'ptdsamount',
      header: 'TDS',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : '',
    },
  ]);

  ngOnInit(): void {
    const k = this.route.snapshot.data['voucherKind'] as VoucherKind | undefined;
    if (k) this.kind.set(k);
    this.loadLedgers();
  }

  private loadLedgers(): void {
    this.loader.show();
    const formName = FORM_NAMES[this.kind()];
    this.api.getLedgerAccountList(formName).subscribe({
      next: (rows) => this.ledgers.set(rows ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load ledgers'),
      complete: () => this.loader.hide(),
    });
  }

  protected addLine(): void {
    const next = [...this.lines(), { ...EMPTY_LINE }];
    this.lines.set(next);
    this.editingIndex.set(next.length - 1);
    this.editingLine = { ...EMPTY_LINE };
  }

  protected applyLine(): void {
    const idx = this.editingIndex();
    if (idx === null) return;
    const list = [...this.lines()];
    const existing = list[idx];
    const merged: VoucherLine = {
      ...existing,
      ...this.editingLine,
      ptypeofoperation:
        existing.ptypeofoperation === 'OLD' ? 'UPDATE' : existing.ptypeofoperation,
    };
    list[idx] = merged;
    this.lines.set(list);
    this.editingIndex.set(null);
    this.syncTotal();
  }

  protected onLedgerChange(): void {
    const ledger = this.ledgers().find((l) => l.pledgerid === this.editingLine.pledgerid);
    if (ledger) this.editingLine.pledgername = ledger.pledgername;
  }

  protected syncTotal(): void {
    this.header.pTotalAmount = this.visibleLines().reduce(
      (acc, l) => acc + (l.pamount ?? 0),
      0,
    );
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pVoucherDate: this.header.pVoucherDate ? '' : 'Voucher date is required.',
        pNarration: this.header.pNarration ? '' : 'Narration is required.',
        pLines:
          this.visibleLines().length > 0 ? '' : 'Add at least one line.',
      });
      return;
    }
    this.saving.set(true);
    this.syncTotal();
    const payload = {
      ...this.header,
      ppaymentsslistcontrols: this.lines(),
      lines: this.lines(),
    };
    this.api.saveByKind(this.kind(), payload).subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.back();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected back(): void {
    void this.router.navigate([VIEW_ROUTE[this.kind()]]);
  }
}
