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
  DocumentGroupRow,
  DocumentsService,
  IdentificationDocumentRow,
} from '../services/documents.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  DataGridComponent,
  DataGridColumn,
  DialogComponent,
  SelectComponent,
  TabsComponent,
  TabItem,
  ValidationMessageComponent,
} from '../../../shared/ui';

const emptyGroup = (): DocumentGroupRow => ({
  pDocGroupID: 0,
  pDocGroupName: '',
  pIsActive: true,
});
const emptyDoc = (): IdentificationDocumentRow => ({
  pDocumenId: 0,
  pDocGroupName: '',
  pDocName: '',
  pIsActive: true,
});

/**
 * Documents master with two tabs — document groups + identification
 * documents. Replaces legacy `UI/Common/identification-documents/`
 * (which lived under Common but was loans-master in spirit).
 */
@Component({
  selector: 'app-loans-documents',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    DataGridComponent,
    DialogComponent,
    SelectComponent,
    TabsComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>Documents Master</h2>
        <p-button
          [label]="addLabel()"
          icon="pi pi-plus"
          (onClick)="onAdd()"
        />
      </div>

      <app-tabs [items]="tabs" [(active)]="activeTab">
        <ng-template #tabContent let-id>
          @if (id === 'groups') {
            <app-data-grid
              title="Document Groups"
              [rows]="groups()"
              [columns]="groupColumns"
              [loading]="loading()"
              exportFilename="document-groups"
              (rowDblClick)="editGroup($event)"
            />
          } @else if (id === 'documents') {
            <app-data-grid
              title="Identification Documents"
              [rows]="docs()"
              [columns]="docColumns"
              [loading]="loading()"
              exportFilename="documents"
              (rowDblClick)="editDoc($event)"
            />
          }
        </ng-template>
      </app-tabs>

      <!-- Group dialog -->
      <app-dialog
        [(visible)]="groupDialogOpen"
        [header]="editingGroup() ? 'Edit Document Group' : 'New Document Group'"
        width="520px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="field">
          <label>Group name *</label>
          <input
            pInputText
            [ngModel]="groupForm().pDocGroupName"
            (ngModelChange)="patchGroup({ pDocGroupName: $event })"
          />
          <app-validation-message [message]="groupErrors().name" />
        </div>

        <ng-template #footerTpl>
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            (onClick)="groupDialogOpen.set(false)"
          />
          <p-button
            [label]="editingGroup() ? 'Update' : 'Save'"
            icon="pi pi-check"
            [loading]="busy()"
            [disabled]="busy() || !canSaveGroup()"
            (onClick)="saveGroup()"
          />
        </ng-template>
      </app-dialog>

      <!-- Document dialog -->
      <app-dialog
        [(visible)]="docDialogOpen"
        [header]="editingDoc() ? 'Edit Document' : 'New Document'"
        width="640px"
        [showOk]="false"
        [showCancel]="false"
      >
        <div class="grid">
          <div class="field">
            <label>Document group *</label>
            <app-select
              [options]="groups()"
              optionLabel="pDocGroupName"
              optionValue="pDocGroupName"
              [ngModel]="docForm().pDocGroupName"
              (ngModelChange)="patchDoc({ pDocGroupName: $event })"
            />
            <app-validation-message [message]="docErrors().group" />
          </div>
          <div class="field">
            <label>Document name *</label>
            <input
              pInputText
              [ngModel]="docForm().pDocName"
              (ngModelChange)="patchDoc({ pDocName: $event })"
            />
            <app-validation-message [message]="docErrors().name" />
          </div>
        </div>

        <ng-template #footerTpl>
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            (onClick)="docDialogOpen.set(false)"
          />
          <p-button
            [label]="editingDoc() ? 'Update' : 'Save'"
            icon="pi pi-check"
            [loading]="busy()"
            [disabled]="busy() || !canSaveDoc()"
            (onClick)="saveDoc()"
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
export class DocumentsComponent {
  private readonly svc = inject(DocumentsService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly tabs: TabItem[] = [
    { id: 'groups', label: 'Document Groups', icon: 'pi pi-folder' },
    { id: 'documents', label: 'Documents', icon: 'pi pi-file' },
  ];
  protected readonly activeTab = signal<string>('groups');

  protected readonly groups = signal<DocumentGroupRow[]>([]);
  protected readonly docs = signal<IdentificationDocumentRow[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly busy = signal<boolean>(false);

  protected readonly groupDialogOpen = signal<boolean>(false);
  protected readonly groupForm = signal<DocumentGroupRow>(emptyGroup());
  protected readonly editingGroup = computed(
    () => this.groupForm().pDocGroupID > 0,
  );
  protected readonly groupErrors = computed(() => ({
    name: this.groupForm().pDocGroupName?.trim() ? '' : 'Group name is required.',
  }));
  protected readonly canSaveGroup = computed(() => !this.groupErrors().name);

  protected readonly docDialogOpen = signal<boolean>(false);
  protected readonly docForm = signal<IdentificationDocumentRow>(emptyDoc());
  protected readonly editingDoc = computed(() => this.docForm().pDocumenId > 0);
  protected readonly docErrors = computed(() => ({
    group: this.docForm().pDocGroupName?.trim() ? '' : 'Group is required.',
    name: this.docForm().pDocName?.trim() ? '' : 'Document name is required.',
  }));
  protected readonly canSaveDoc = computed(
    () => !this.docErrors().group && !this.docErrors().name,
  );

  protected readonly addLabel = computed(() =>
    this.activeTab() === 'groups' ? 'New Group' : 'New Document',
  );

  protected readonly groupColumns: DataGridColumn<DocumentGroupRow>[] = [
    { field: 'pDocGroupName', header: 'Group Name', filter: true },
    {
      field: 'pIsActive',
      header: 'Status',
      width: '120px',
      align: 'center',
      format: (_v, row) => (row.pIsActive === false ? 'Inactive' : 'Active'),
    },
  ];

  protected readonly docColumns: DataGridColumn<IdentificationDocumentRow>[] = [
    { field: 'pDocGroupName', header: 'Group', filter: true, width: '220px' },
    { field: 'pDocName', header: 'Document', filter: true },
    { field: 'pDocType', header: 'Type', width: '160px' },
    {
      field: 'pIsActive',
      header: 'Status',
      width: '120px',
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
    this.svc.getDocumentGroupNames().subscribe({
      next: (list) => this.groups.set(list ?? []),
    });
    this.svc.getDocumentIdProofTypes(0).subscribe({
      next: (resp) => {
        const list = (resp as IdentificationDocumentRow[]) ?? [];
        this.docs.set(list);
        this.loading.set(false);
        this.loader.hide();
      },
      error: () => {
        this.loading.set(false);
        this.loader.hide();
      },
    });
  }

  protected onAdd(): void {
    if (this.activeTab() === 'groups') this.addGroup();
    else this.addDoc();
  }

  protected addGroup(): void {
    this.groupForm.set(emptyGroup());
    this.groupDialogOpen.set(true);
  }
  protected editGroup(row: DocumentGroupRow): void {
    this.groupForm.set({ ...row });
    this.groupDialogOpen.set(true);
  }
  protected patchGroup(part: Partial<DocumentGroupRow>): void {
    this.groupForm.update((cur) => ({ ...cur, ...part }));
  }

  protected addDoc(): void {
    this.docForm.set(emptyDoc());
    this.docDialogOpen.set(true);
  }
  protected editDoc(row: IdentificationDocumentRow): void {
    this.docForm.set({ ...row });
    this.docDialogOpen.set(true);
  }
  protected patchDoc(part: Partial<IdentificationDocumentRow>): void {
    this.docForm.update((cur) => ({ ...cur, ...part }));
  }

  protected saveGroup(): void {
    if (!this.canSaveGroup()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.groupForm(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as DocumentGroupRow;
    this.svc.saveDocumentGroup(payload).subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(this.editingGroup() ? 'Updated.' : 'Saved.');
        this.groupDialogOpen.set(false);
        this.refresh();
      },
      error: () => {
        this.busy.set(false);
        this.loader.hide();
      },
    });
  }

  protected saveDoc(): void {
    if (!this.canSaveDoc()) return;
    this.busy.set(true);
    this.loader.show('Saving…');
    const payload = {
      ...this.docForm(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    } as IdentificationDocumentRow;
    const op = this.editingDoc()
      ? this.svc.updateIdentificationDocument(payload)
      : this.svc.saveIdentificationDocument(payload);
    op.subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(this.editingDoc() ? 'Updated.' : 'Saved.');
        this.docDialogOpen.set(false);
        this.refresh();
      },
      error: () => {
        this.busy.set(false);
        this.loader.hide();
      },
    });
  }
}
