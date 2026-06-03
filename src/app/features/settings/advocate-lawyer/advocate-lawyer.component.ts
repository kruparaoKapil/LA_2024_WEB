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
  AdvocateLawyerRow,
  AdvocateLawyerService,
} from '../advocate-lawyer.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  DataGridComponent,
  DataGridColumn,
  DialogComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';

const empty = (): AdvocateLawyerRow => ({
  pAdvocateID: 0,
  pName: '',
  pIsActive: true,
});

@Component({
  selector: 'app-advocate-lawyer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    DataGridComponent,
    DialogComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Advocates / Lawyers</h2>
        <p-button label="New" icon="pi pi-plus" (onClick)="add()" />
      </div>

      <app-data-grid
        title="All Advocates / Lawyers"
        [rows]="rows()"
        [columns]="columns"
        [loading]="loading()"
        exportFilename="advocate-lawyer"
        (rowDblClick)="edit($event)"
      />

      <app-dialog
        [(visible)]="dialogOpen"
        [header]="editing() ? 'Edit' : 'New Advocate / Lawyer'"
        width="640px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Name *</label>
            <input
              pInputText
              [ngModel]="form().pName"
              (ngModelChange)="patch({ pName: $event })"
            />
            <app-validation-message [message]="errors().name" />
          </div>
          <div class="field">
            <label>Code</label>
            <input
              pInputText
              [ngModel]="form().pCode"
              (ngModelChange)="patch({ pCode: $event })"
            />
          </div>
          <div class="field">
            <label>Phone</label>
            <input
              pInputText
              inputmode="tel"
              [ngModel]="form().pPhone"
              (ngModelChange)="patch({ pPhone: $event })"
            />
          </div>
          <div class="field">
            <label>Email</label>
            <input
              pInputText
              type="email"
              [ngModel]="form().pEmail"
              (ngModelChange)="patch({ pEmail: $event })"
            />
          </div>
          <div class="field span-2">
            <label>Specialization</label>
            <input
              pInputText
              [ngModel]="form().pSpecialization"
              (ngModelChange)="patch({ pSpecialization: $event })"
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
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .span-2 {
        grid-column: 1 / -1;
      }
    `,
  ],
})
export class AdvocateLawyerComponent {
  private readonly svc = inject(AdvocateLawyerService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly rows = signal<AdvocateLawyerRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);
  protected readonly dialogOpen = signal<boolean>(false);
  protected readonly form = signal<AdvocateLawyerRow>(empty());
  protected readonly editing = computed(() => this.form().pAdvocateID > 0);

  protected readonly errors = computed(() => ({
    name: this.form().pName?.trim() ? '' : 'Name is required.',
  }));
  protected readonly canSave = computed(() => !this.errors().name);

  protected readonly columns: DataGridColumn<AdvocateLawyerRow>[] = [
    { field: 'pCode', header: 'Code', filter: true, width: '120px' },
    { field: 'pName', header: 'Name', filter: true },
    { field: 'pPhone', header: 'Phone', filter: true, width: '160px' },
    { field: 'pSpecialization', header: 'Specialization', filter: true },
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

  protected edit(row: AdvocateLawyerRow): void {
    this.form.set({ ...row });
    this.dialogOpen.set(true);
  }

  protected patch(part: Partial<AdvocateLawyerRow>): void {
    this.form.update((cur) => ({ ...cur, ...part }));
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.form(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as AdvocateLawyerRow;
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
