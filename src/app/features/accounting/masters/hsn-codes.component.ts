import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  AccountingMastersService,
  type HsnCodeRow,
} from '../services/accounting-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const EMPTY_HSN: HsnCodeRow = {
  pHsnCode: '',
  pProductName: '',
  pGstPercentage: 0,
};

@Component({
  selector: 'app-hsn-codes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CurrencyInputComponent,
    DataGridComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="hsn">
      <header><h2>HSN Codes</h2></header>

      <p-card [header]="form.pHsnId ? 'Edit HSN Code' : 'New HSN Code'">
        <div class="grid">
          <label class="field">
            <span>HSN Code<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="form.pHsnCode"
              name="hsn"
              maxlength="20"
            />
            <app-validation-message [message]="errors().pHsnCode" />
          </label>
          <label class="field">
            <span>Product Name<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="form.pProductName"
              name="product"
              maxlength="100"
            />
            <app-validation-message [message]="errors().pProductName" />
          </label>
          <label class="field">
            <span>GST %<sup>*</sup></span>
            <app-currency-input
              [(ngModel)]="form.pGstPercentage"
              name="gst"
              [maxFractionDigits]="2"
              [showCurrencySymbol]="false"
            />
            <app-validation-message [message]="errors().pGstPercentage" />
          </label>
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
            label="Reset"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-refresh"
            (onClick)="reset()"
          />
        </div>
      </p-card>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="hsn-codes"
        (rowDblClick)="edit($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      header h2 { margin: 0 0 0.75rem 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(180px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
      .hsn { display: flex; flex-direction: column; gap: 0.75rem; }
    `,
  ],
})
export class HsnCodesComponent implements OnInit {
  private readonly api = inject(AccountingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);

  protected readonly rows = signal<HsnCodeRow[]>([]);
  protected readonly saving = signal<boolean>(false);
  protected form: HsnCodeRow = { ...EMPTY_HSN };

  protected readonly errors = signal<{
    pHsnCode: string;
    pProductName: string;
    pGstPercentage: string;
  }>({ pHsnCode: '', pProductName: '', pGstPercentage: '' });

  protected readonly columns: DataGridColumn<HsnCodeRow>[] = [
    { field: 'pHsnCode', header: 'HSN Code', sortable: true, filter: true },
    { field: 'pProductName', header: 'Product', sortable: true, filter: true },
    {
      field: 'pGstPercentage',
      header: 'GST %',
      sortable: true,
      align: 'right',
      format: (v) => (typeof v === 'number' ? `${v.toFixed(2)}%` : ''),
    },
  ];

  protected readonly isValid = computed(() => {
    const f = this.form;
    return (
      !!f.pHsnCode &&
      !!f.pProductName &&
      typeof f.pGstPercentage === 'number' &&
      f.pGstPercentage >= 0 &&
      f.pGstPercentage <= 100
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.getHsnCodes().subscribe({
      next: (rows) => this.rows.set(rows ?? []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load HSN codes');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pHsnCode: this.form.pHsnCode ? '' : 'HSN code is required.',
        pProductName: this.form.pProductName ? '' : 'Product is required.',
        pGstPercentage:
          typeof this.form.pGstPercentage === 'number' &&
          this.form.pGstPercentage >= 0 &&
          this.form.pGstPercentage <= 100
            ? ''
            : 'GST % must be between 0 and 100.',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveHsnCodes(this.form).subscribe({
      next: () => {
        this.toast.success('HSN code saved.');
        this.reset();
        this.load();
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected edit(row: HsnCodeRow): void {
    this.form = { ...row };
  }

  protected reset(): void {
    this.form = { ...EMPTY_HSN };
    this.errors.set({ pHsnCode: '', pProductName: '', pGstPercentage: '' });
  }
}
