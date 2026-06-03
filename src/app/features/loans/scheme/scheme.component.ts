import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import {
  LoanName,
  LoanType,
  SchemeRow,
  SchemeService,
} from '../services/scheme.service';
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

const empty = (): SchemeRow => ({
  pSchemeID: 0,
  pSchemeName: '',
  pSchemeCode: '',
  pInterestRate: 0,
  pTenure: 12,
  pIsActive: true,
});

@Component({
  selector: 'app-loans-scheme',
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
        <h2>Scheme Master</h2>
        <p-button label="New Scheme" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="All Schemes"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="schemes"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit Scheme' : 'New Scheme'"
        width="720px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Loan type *</label>
            <app-select
              [options]="loanTypes()"
              optionLabel="pLoanTypeName"
              optionValue="pLoanTypeID"
              [ngModel]="loanTypeId()"
              (ngModelChange)="onLoanTypeChange($event)"
            />
            <app-validation-message [message]="errors().loanType" />
          </div>
          <div class="field">
            <label>Loan name *</label>
            <app-select
              [options]="loanNames()"
              optionLabel="pLoanName"
              optionValue="pLoanID"
              [ngModel]="form().pLoanID"
              (ngModelChange)="patch({ pLoanID: $event })"
            />
            <app-validation-message [message]="errors().loan" />
          </div>
          <div class="field">
            <label>Scheme name *</label>
            <input
              pInputText
              [ngModel]="form().pSchemeName"
              (ngModelChange)="patch({ pSchemeName: $event })"
            />
            <app-validation-message [message]="errors().name" />
          </div>
          <div class="field">
            <label>Scheme code *</label>
            <input
              pInputText
              [ngModel]="form().pSchemeCode"
              (ngModelChange)="patch({ pSchemeCode: $event })"
            />
            <app-validation-message [message]="errors().code" />
          </div>
          <div class="field">
            <label>Interest rate (%)</label>
            <p-inputNumber
              [ngModel]="form().pInterestRate ?? null"
              (ngModelChange)="patch({ pInterestRate: $event ?? undefined })"
              [min]="0"
              [max]="100"
              [maxFractionDigits]="2"
            />
          </div>
          <div class="field">
            <label>Tenure (months)</label>
            <p-inputNumber
              [ngModel]="form().pTenure ?? null"
              (ngModelChange)="patch({ pTenure: $event ?? undefined })"
              [min]="1"
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
        max-width: 1200px;
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
        grid-template-columns: 1fr 1fr;
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
export class SchemeComponent {
  private readonly svc = inject(SchemeService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly rows = signal<SchemeRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly form = signal<SchemeRow>(empty());
  protected readonly editing = computed(() => this.form().pSchemeID > 0);

  protected readonly loanTypes = signal<LoanType[]>([]);
  protected readonly loanTypeId = signal<number | null>(null);
  protected readonly loanNames = signal<LoanName[]>([]);

  protected readonly errors = computed(() => ({
    loanType: this.loanTypeId() ? '' : 'Loan type is required.',
    loan: this.form().pLoanID ? '' : 'Loan name is required.',
    name: this.form().pSchemeName?.trim() ? '' : 'Scheme name is required.',
    code: this.form().pSchemeCode?.trim() ? '' : 'Scheme code is required.',
  }));
  protected readonly canSave = computed(
    () =>
      !this.errors().loanType &&
      !this.errors().loan &&
      !this.errors().name &&
      !this.errors().code,
  );

  protected readonly columns: DataGridColumn<SchemeRow>[] = [
    { field: 'pSchemeCode', header: 'Code', filter: true, width: '120px' },
    { field: 'pSchemeName', header: 'Scheme', filter: true },
    { field: 'pLoanName', header: 'Loan', filter: true, width: '200px' },
    {
      field: 'pInterestRate',
      header: 'Rate %',
      align: 'right',
      width: '100px',
    },
    { field: 'pTenure', header: 'Tenure', align: 'right', width: '100px' },
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
    // cascade loan-type → loan-names
    effect(() => {
      const id = this.loanTypeId();
      if (!id) {
        this.loanNames.set([]);
        return;
      }
      this.svc.getLoanNames(id).subscribe({
        next: (list) => this.loanNames.set(list ?? []),
      });
    });
  }

  protected refresh(): void {
    this.loading.set(true);
    this.loader.show('Loading schemes…');
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

  protected onLoanTypeChange(id: number | null): void {
    this.loanTypeId.set(id);
    this.patch({ pLoanID: undefined });
  }

  protected add(): void {
    this.form.set(empty());
    this.loanTypeId.set(null);
    this.dialogOpen.set(true);
  }
  protected edit(row: SchemeRow): void {
    this.form.set({ ...row });
    this.dialogOpen.set(true);
  }
  protected patch(part: Partial<SchemeRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.form(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as SchemeRow;
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
