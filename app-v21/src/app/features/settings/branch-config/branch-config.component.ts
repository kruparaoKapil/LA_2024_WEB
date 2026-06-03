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

import {
  BranchConfigService,
  BranchRow,
} from '../branch-config.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  AddressSubformComponent,
  AddressValue,
} from '../../common/address/address-subform.component';
import {
  DataGridComponent,
  DataGridColumn,
  DialogComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';

const emptyBranch = (): BranchRow => ({
  pBranchID: 0,
  pBranchName: '',
  pBranchCode: '',
  pIsActive: true,
});

const toAddressValue = (b: BranchRow): AddressValue => ({
  paddress1: b.pAddress1,
  paddress2: b.pAddress2,
  pcity: b.pcity,
  pCountry: b.pCountry,
  pState: b.pState,
  pDistrict: b.pDistrict,
  Pincode: b.pPincode,
});

const mergeAddress = (b: BranchRow, addr: AddressValue | null): BranchRow => ({
  ...b,
  pAddress1: addr?.paddress1,
  pAddress2: addr?.paddress2,
  pcity: addr?.pcity,
  pCountry: addr?.pCountry,
  pState: addr?.pState,
  pDistrict: addr?.pDistrict,
  pPincode: addr?.Pincode,
});

/**
 * Branch master. List of branches in `<app-data-grid>`; create/edit in a
 * `<app-dialog>` with the reusable `<app-address-subform>` for address
 * fields. Replaces legacy `branch-config.component.ts`
 * (kendo-grid + bsDatepicker + 600 LOC of FormBuilder scaffolding).
 */
@Component({
  selector: 'app-branch-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    DataGridComponent,
    DialogComponent,
    AddressSubformComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Branches</h2>
        <p-button label="New Branch" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="All Branches"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="branches"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit Branch' : 'New Branch'"
        width="720px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Branch name *</label>
            <input
              pInputText
              [ngModel]="form().pBranchName"
              (ngModelChange)="patch({ pBranchName: $event })"
            />
            <app-validation-message [message]="errors().name" />
          </div>
          <div class="field">
            <label>Branch code *</label>
            <input
              pInputText
              [ngModel]="form().pBranchCode"
              (ngModelChange)="patch({ pBranchCode: $event })"
            />
            <app-validation-message [message]="errors().code" />
          </div>
        </div>

        <app-address-subform
          [ngModel]="address()"
          (ngModelChange)="onAddressChange($event)"
          title="Branch Address"
        />

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
        margin-bottom: 1rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `,
  ],
})
export class BranchConfigComponent {
  private readonly branchSvc = inject(BranchConfigService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly rows = signal<BranchRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);

  protected readonly form = signal<BranchRow>(emptyBranch());
  protected readonly address = signal<AddressValue | null>(null);
  protected readonly editing = computed(() => this.form().pBranchID > 0);

  protected readonly errors = computed(() => ({
    name: this.form().pBranchName?.trim() ? '' : 'Branch name is required.',
    code: this.form().pBranchCode?.trim() ? '' : 'Branch code is required.',
  }));

  protected readonly canSave = computed(
    () => !this.errors().name && !this.errors().code,
  );

  protected readonly columns: DataGridColumn<BranchRow>[] = [
    { field: 'pBranchCode', header: 'Code', filter: true, width: '120px' },
    { field: 'pBranchName', header: 'Name', filter: true },
    { field: 'pcity', header: 'City', filter: true, width: '160px' },
    { field: 'pState', header: 'State', filter: true, width: '160px' },
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
    this.loader.show('Loading branches…');
    this.branchSvc.getBranchDetails().subscribe({
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
    this.form.set(emptyBranch());
    this.address.set(null);
    this.dialogOpen.set(true);
  }

  protected edit(row: BranchRow): void {
    this.form.set({ ...row });
    this.address.set(toAddressValue(row));
    this.dialogOpen.set(true);
  }

  protected patch(part: Partial<BranchRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }

  protected onAddressChange(value: AddressValue | null): void {
    this.address.set(value);
    this.form.update((cur) => mergeAddress(cur, value));
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.form(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as BranchRow;
    this.branchSvc.saveBranch(payload).subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(this.editing() ? 'Branch updated.' : 'Branch created.');
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
