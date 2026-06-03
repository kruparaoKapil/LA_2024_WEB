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

import {
  GenerateIdRow,
  GenerateIdService,
} from '../generate-id.service';
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

interface FormNameOption {
  pFormName: string;
}
interface ModeOption {
  pModeOfTransaction: string;
}

const empty = (): GenerateIdRow => ({
  pTransactionID: 0,
  pFormName: '',
  pModeOfTransaction: '',
  pTransactionCode: '',
  pStartFrom: 1,
  pIsActive: true,
});

/**
 * Generate-ID master. Replaces legacy
 * `UI/Settings/generateid-master/generateid-master.component`.
 */
@Component({
  selector: 'app-generate-id',
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
        <h2>Generate ID Master</h2>
        <p-button label="New" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="ID Generators"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="generate-id-master"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit Generator' : 'New Generator'"
        width="640px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Form *</label>
            <app-select
              [options]="forms()"
              optionLabel="pFormName"
              optionValue="pFormName"
              [ngModel]="form().pFormName"
              (ngModelChange)="onFormNameChange($event)"
            />
            <app-validation-message [message]="errors().formName" />
          </div>
          <div class="field">
            <label>Mode of transaction *</label>
            <app-select
              [options]="modes()"
              optionLabel="pModeOfTransaction"
              optionValue="pModeOfTransaction"
              [ngModel]="form().pModeOfTransaction"
              (ngModelChange)="patch({ pModeOfTransaction: $event })"
            />
            <app-validation-message [message]="errors().mode" />
          </div>
          <div class="field">
            <label>Transaction code *</label>
            <input
              pInputText
              [ngModel]="form().pTransactionCode"
              (ngModelChange)="patch({ pTransactionCode: $event })"
            />
            <app-validation-message [message]="errors().txCode" />
          </div>
          <div class="field">
            <label>Prefix</label>
            <input
              pInputText
              [ngModel]="form().pPrefix"
              (ngModelChange)="patch({ pPrefix: $event })"
            />
          </div>
          <div class="field">
            <label>Suffix</label>
            <input
              pInputText
              [ngModel]="form().pSuffix"
              (ngModelChange)="patch({ pSuffix: $event })"
            />
          </div>
          <div class="field">
            <label>Start from</label>
            <p-inputNumber
              [ngModel]="form().pStartFrom ?? null"
              (ngModelChange)="patch({ pStartFrom: $event ?? undefined })"
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
export class GenerateIdComponent {
  private readonly svc = inject(GenerateIdService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly rows = signal<GenerateIdRow[]>([]);
  protected readonly forms = signal<FormNameOption[]>([]);
  protected readonly modes = signal<ModeOption[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly form = signal<GenerateIdRow>(empty());
  protected readonly editing = computed(
    () => (this.form().pTransactionID ?? 0) > 0,
  );

  protected readonly errors = computed(() => ({
    formName: this.form().pFormName ? '' : 'Form is required.',
    mode: this.form().pModeOfTransaction ? '' : 'Mode is required.',
    txCode: this.form().pTransactionCode?.trim()
      ? ''
      : 'Transaction code is required.',
  }));

  protected readonly canSave = computed(
    () =>
      !this.errors().formName && !this.errors().mode && !this.errors().txCode,
  );

  protected readonly columns: DataGridColumn<GenerateIdRow>[] = [
    { field: 'pFormName', header: 'Form', filter: true },
    { field: 'pModeOfTransaction', header: 'Mode', filter: true, width: '180px' },
    { field: 'pTransactionCode', header: 'Code', filter: true, width: '160px' },
    { field: 'pPrefix', header: 'Prefix', width: '100px' },
    { field: 'pSuffix', header: 'Suffix', width: '100px' },
    {
      field: 'pStartFrom',
      header: 'Start From',
      width: '120px',
      align: 'right',
    },
  ];

  constructor() {
    this.refresh();
    this.svc.getFormNames().subscribe({
      next: (list) => this.forms.set((list as FormNameOption[]) ?? []),
    });
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

  protected onFormNameChange(name: string): void {
    this.patch({ pFormName: name, pModeOfTransaction: '' });
    if (!name) {
      this.modes.set([]);
      return;
    }
    this.svc.getModeOfTransaction(name).subscribe({
      next: (list) => this.modes.set((list as ModeOption[]) ?? []),
    });
  }

  protected add(): void {
    this.form.set(empty());
    this.modes.set([]);
    this.dialogOpen.set(true);
  }
  protected edit(row: GenerateIdRow): void {
    this.form.set({ ...row });
    this.dialogOpen.set(true);
    if (row.pFormName) {
      this.svc.getModeOfTransaction(row.pFormName).subscribe({
        next: (list) => this.modes.set((list as ModeOption[]) ?? []),
      });
    }
  }
  protected patch(part: Partial<GenerateIdRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.form(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as GenerateIdRow;
    this.svc.save(payload).subscribe({
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
