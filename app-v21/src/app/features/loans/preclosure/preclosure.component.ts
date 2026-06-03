import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import {
  PreclosureRow,
  PreclosureService,
} from '../services/preclosure.service';
import { LoanType } from '../services/scheme.service';
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

const empty = (): PreclosureRow => ({
  pRecordid: 0,
  pLoanid: 0,
  pPreclosureType: 'AMOUNT',
  pAmount: 0,
  pIsActive: true,
});

const TYPES = [
  { label: 'Amount', value: 'AMOUNT' },
  { label: 'Percentage', value: 'PERCENTAGE' },
];

@Component({
  selector: 'app-loans-preclosure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputNumberModule,
    DataGridComponent,
    DialogComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Preclosure Master</h2>
        <p-button label="New" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="All Preclosure Rules"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="preclosure"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit Preclosure' : 'New Preclosure'"
        width="640px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Loan *</label>
            <app-select
              [options]="loanTypes()"
              optionLabel="pLoanTypeName"
              optionValue="pLoanTypeID"
              [ngModel]="form().pLoanid"
              (ngModelChange)="patch({ pLoanid: $event })"
            />
            <app-validation-message [message]="errors().loan" />
          </div>
          <div class="field">
            <label>Type</label>
            <app-select
              [options]="types"
              optionLabel="label"
              optionValue="value"
              [ngModel]="form().pPreclosureType"
              (ngModelChange)="patch({ pPreclosureType: $event })"
            />
          </div>
          <div class="field">
            <label>{{ form().pPreclosureType === 'PERCENTAGE' ? 'Percentage' : 'Amount' }}</label>
            <p-inputNumber
              [ngModel]="amountValue()"
              (ngModelChange)="patchAmount($event)"
              [min]="0"
              [maxFractionDigits]="2"
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
export class PreclosureComponent {
  private readonly svc = inject(PreclosureService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly types = TYPES;
  protected readonly rows = signal<PreclosureRow[]>([]);
  protected readonly loanTypes = signal<LoanType[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly form = signal<PreclosureRow>(empty());
  protected readonly editing = computed(() => this.form().pRecordid > 0);

  protected readonly amountValue = computed(() => {
    const f = this.form();
    return f.pPreclosureType === 'PERCENTAGE'
      ? f.pPercentage ?? null
      : f.pAmount ?? null;
  });

  protected readonly errors = computed(() => ({
    loan: this.form().pLoanid > 0 ? '' : 'Loan is required.',
  }));
  protected readonly canSave = computed(() => !this.errors().loan);

  protected readonly columns: DataGridColumn<PreclosureRow>[] = [
    { field: 'pLoanName', header: 'Loan', filter: true },
    { field: 'pPreclosureType', header: 'Type', width: '140px' },
    {
      field: 'pAmount',
      header: 'Amount',
      align: 'right',
      width: '160px',
      format: (v) =>
        v == null ? '' : new Intl.NumberFormat('en-IN').format(Number(v)),
    },
    {
      field: 'pPercentage',
      header: '%',
      align: 'right',
      width: '100px',
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
    this.svc.getLoanTypes().subscribe({
      next: (list) => this.loanTypes.set(list ?? []),
    });
    this.refresh();
  }

  protected refresh(): void {
    this.loading.set(true);
    this.loader.show('Loading…');
    this.svc.list().subscribe({
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
  protected edit(row: PreclosureRow): void {
    this.form.set({ ...row });
    this.dialogOpen.set(true);
  }
  protected patch(part: Partial<PreclosureRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }
  protected patchAmount(val: number | null): void {
    if (this.form().pPreclosureType === 'PERCENTAGE') {
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
    } as PreclosureRow;
    const op = this.editing() ? this.svc.update(payload) : this.svc.save(payload);
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
