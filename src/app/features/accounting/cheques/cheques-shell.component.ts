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

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  SelectComponent,
} from '../../../shared/ui';
import {
  ChequesService,
  type ChequeBucket,
  type ChequeRow,
} from '../services/cheques.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<ChequeBucket, string> = {
  OnHand: 'Cheques on Hand',
  Issued: 'Cheques Issued',
  InBank: 'Cheques in Bank',
};

interface BankOption {
  precordid: number;
  pbankname: string;
  [key: string]: unknown;
}

/**
 * Single shell for Cheques-On-Hand / Cheques-Issued / Cheques-In-Bank.
 * Replaces three near-identical legacy components by parameterising
 * behaviour via `data.bucket`. Date-range filter feeds the BRS-aware
 * endpoints that drive Bank Recon Statement workflows.
 */
@Component({
  selector: 'app-cheques-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataGridComponent,
    DateInputComponent,
    SelectComponent,
  ],
  template: `
    <div class="chq-shell">
      <header><h2>{{ title() }}</h2></header>

      <p-card>
        <div class="filters">
          <label class="field">
            <span>Bank<sup>*</sup></span>
            <app-select
              [options]="banks()"
              optionLabel="pbankname"
              optionValue="precordid"
              [(ngModel)]="bankId"
              placeholder="Select bank"
            />
          </label>
          <label class="field">
            <span>From</span>
            <app-date-input [(ngModel)]="fromDate" name="from" />
          </label>
          <label class="field">
            <span>To</span>
            <app-date-input [(ngModel)]="toDate" name="to" />
          </label>
          <div class="run">
            <p-button
              label="Load"
              icon="pi pi-search"
              (onClick)="load()"
              [loading]="loading()"
              [disabled]="!bankId"
            />
            <p-button
              label="Save"
              icon="pi pi-save"
              severity="success"
              (onClick)="save()"
              [loading]="saving()"
              [disabled]="!hasChanges()"
            />
          </div>
        </div>
      </p-card>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="multi"
        [(selection)]="selectedRows"
        [exportFilename]="exportFilename()"
        emptyMessage="Pick a bank and click Load."
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .chq-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters {
        display: flex;
        align-items: end;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; min-width: 200px; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .run { margin-left: auto; display: flex; gap: 0.5rem; }
    `,
  ],
})
export class ChequesShellComponent implements OnInit {
  private readonly api = inject(ChequesService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly bucket = signal<ChequeBucket>('OnHand');
  protected readonly banks = signal<BankOption[]>([]);
  protected readonly rows = signal<ChequeRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected selectedRows: ChequeRow[] = [];

  protected bankId: number | null = null;
  protected fromDate: Date = new Date(new Date().setDate(1));
  protected toDate: Date = new Date();

  protected readonly title = computed(() => TITLES[this.bucket()] ?? 'Cheques');
  protected readonly exportFilename = computed(
    () => `cheques-${this.bucket().toLowerCase()}`,
  );
  protected readonly hasChanges = computed(() =>
    this.rows().some((r) => r.ptypeofoperation && r.ptypeofoperation !== 'OLD'),
  );

  protected readonly columns: DataGridColumn<ChequeRow>[] = [
    { field: 'pChequeNo', header: 'Cheque No', sortable: true, filter: true },
    { field: 'pPartyName', header: 'Party', sortable: true, filter: true },
    { field: 'pChequeDate', header: 'Date', sortable: true, align: 'center' },
    {
      field: 'pChequeAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pVoucherNo', header: 'Voucher', sortable: true },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    const b = this.route.snapshot.data['bucket'] as ChequeBucket | undefined;
    if (b) this.bucket.set(b);
    this.api.getBanksList().subscribe({
      next: (rows) => this.banks.set((rows as BankOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load banks'),
    });
  }

  protected load(): void {
    if (!this.bankId) return;
    this.loading.set(true);
    const args = {
      fromDate: this.toIso(this.fromDate),
      toDate: this.toIso(this.toDate),
      bankId: this.bankId,
    };
    const obs =
      this.bucket() === 'OnHand'
        ? this.api.getOnHandByBrsRange(args)
        : this.bucket() === 'Issued'
          ? this.api.getIssuedByBrsRange(args)
          : this.api.getInBankByBrsRange(args);
    obs.subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load cheques');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected save(): void {
    this.saving.set(true);
    const data = this.rows();
    const obs =
      this.bucket() === 'OnHand'
        ? this.api.saveChequesOnHand(data)
        : this.bucket() === 'Issued'
          ? this.api.saveChequesIssued(data)
          : this.api.saveChequesInBank(data);
    obs.subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.saving.set(false);
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  private toIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
