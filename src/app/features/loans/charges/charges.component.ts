import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { ChargeRow, ChargesService } from '../services/charges.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  DataGridComponent,
  DataGridColumn,
  DialogComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';

const empty = (): ChargeRow => ({
  pChargeID: 0,
  pChargeName: '',
  pChargeType: 'AMOUNT',
  pAmount: 0,
  pIsActive: true,
});

const TYPES = [
  { label: 'Amount', value: 'AMOUNT' },
  { label: 'Percentage', value: 'PERCENTAGE' },
];

/**
 * Charges Master. Replaces legacy
 * `UI/Loans/Masters/Charges/charges-master.component`. List + dialog
 * edit, signal-only, with Excel/PDF export inherited from
 * `<app-data-grid>`.
 */
@Component({
  selector: 'app-loans-charges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DataGridComponent,
    DialogComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Charges Master</h2>
        <p-button label="New Charge" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="All Charges"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="charges"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit Charge' : 'New Charge'"
        width="640px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Charge name *</label>
            <input
              pInputText
              [ngModel]="form().pChargeName"
              (ngModelChange)="patch({ pChargeName: $event })"
            />
            <app-validation-message [message]="errors().name" />
          </div>
          <div class="field">
            <label>Type</label>
            <app-select
              [options]="types"
              optionLabel="label"
              optionValue="value"
              [ngModel]="form().pChargeType"
              (ngModelChange)="patch({ pChargeType: $event })"
            />
          </div>
          <div class="field">
            <label>{{ form().pChargeType === 'PERCENTAGE' ? 'Percentage' : 'Amount' }}</label>
            <p-inputNumber
              [ngModel]="amountValue()"
              (ngModelChange)="patchAmount($event)"
              [min]="0"
              [maxFractionDigits]="2"
              currency="INR"
              locale="en-IN"
            />
          </div>
        </div>

        <ng-template #footerTpl>
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            (onClick)="dialogOpen.set(false)"
          />
          <p-button
            [label]="editing() ? 'Update' : 'Save'"
            icon="pi pi-check"
            [loading]="busy()"
            [disabled]="busy() || !canSave()"
            (onClick)="save()"
          />
        </ng-template>
      </app-dialog>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin-inline: auto;
      }
      .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .page-head h2 {
        margin: 0;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `,
  ],
})
export class ChargesComponent {
  private readonly svc = inject(ChargesService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly types = TYPES;
  protected readonly rows = signal<ChargeRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly form = signal<ChargeRow>(empty());
  protected readonly editing = computed(() => this.form().pChargeID > 0);

  protected readonly amountValue = computed(() => {
    const f = this.form();
    return f.pChargeType === 'PERCENTAGE'
      ? f.pPercentage ?? null
      : f.pAmount ?? null;
  });

  protected readonly errors = computed(() => ({
    name: this.form().pChargeName?.trim() ? '' : 'Charge name is required.',
  }));
  protected readonly canSave = computed(() => !this.errors().name);

  protected readonly columns: DataGridColumn<ChargeRow>[] = [
    { field: 'pChargeName', header: 'Charge', filter: true },
    { field: 'pChargeType', header: 'Type', width: '140px' },
    {
      field: 'pAmount',
      header: 'Amount',
      align: 'right',
      width: '140px',
      format: (v) =>
        v == null ? '' : new Intl.NumberFormat('en-IN').format(Number(v)),
    },
    {
      field: 'pPercentage',
      header: 'Percentage',
      align: 'right',
      width: '120px',
      format: (v) => (v == null ? '' : `${v}%`),
    },
    {
      field: 'pIsActive',
      header: 'Status',
      width: '100px',
      align: 'center',
      format: (_v, row) => (row.pIsActive === false ? 'Inactive' : 'Active'),
    },
  ];

  constructor() {
    this.refresh();
  }

  protected refresh(): void {
    this.loading.set(true);
    this.loader.show('Loading charges…');
    this.svc.getChargeNames('ACTIVE').subscribe({
      next: (list) => {
        this.rows.set(list ?? []);
        this.loading.set(false);
        this.loader.hide();
      },
      error: () => {
        this.loading.set(false);
        this.loader.hide();
      },
    });
  }

  protected add(): void {
    this.form.set(empty());
    this.dialogOpen.set(true);
  }
  protected edit(row: ChargeRow): void {
    this.form.set({ ...row });
    this.dialogOpen.set(true);
  }
  protected patch(part: Partial<ChargeRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }
  protected patchAmount(val: number | null): void {
    if (this.form().pChargeType === 'PERCENTAGE') {
      this.patch({ pPercentage: val ?? undefined });
    } else {
      this.patch({ pAmount: val ?? undefined });
    }
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.form(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as ChargeRow;
    const op = this.editing()
      ? this.svc.updateChargesName(payload)
      : this.svc.saveChargesName(payload);
    op.subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(this.editing() ? 'Updated.' : 'Saved.');
        this.dialogOpen.set(false);
        this.refresh();
      },
      error: () => {
        this.busy.set(false);
        this.loader.hide();
      },
    });
  }
}
