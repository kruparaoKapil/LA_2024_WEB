import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { ContactMasterService } from '../services/contact-master.service';
import { FIIndividualService } from '../services/fi-individual.service';

export type KycRecordOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'OLD';

export interface KycRecord {
  precordid: number;
  pContactId: number;
  pDocumentGroup: string;
  pDocumentName: string;
  pDocumentNumber: string;
  pDocumentReferenceMonth?: string;
  pDocumentReferenceYear?: string;
  pDocumentImagePath?: string;
  ptypeofoperation: KycRecordOperation;
  [key: string]: unknown;
}

interface DraftKyc {
  pDocumentGroup: string;
  pDocumentName: string;
  pDocumentNumber: string;
}

interface DocumentGroup {
  pDocumentGroup: string;
  [key: string]: unknown;
}

interface DocumentName {
  pDocumentName: string;
  [key: string]: unknown;
}

const EMPTY_DRAFT: DraftKyc = {
  pDocumentGroup: '',
  pDocumentName: '',
  pDocumentNumber: '',
};

/**
 * Replaces 746-LOC `KycdocumentsnewComponent`. Emphasis on the
 * primary use-case: build a list of KYC docs (PAN, Aadhaar, …) with
 * group / type / number, optional reference month/year, and per-row
 * lifecycle markers the legacy API consumes.
 *
 * File-upload preview is intentionally deferred — the upload widget hits
 * a separate endpoint in the legacy app and the UX is being redesigned
 * around a generic `<app-document-upload>` slated for Phase 7C.
 */
@Component({
  selector: 'app-kyc-documents-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DataGridComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KycDocumentsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section class="kyc-subform">
      <header class="kyc-subform-header">
        <h4>KYC Documents</h4>
      </header>

      <form (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="row">
          <label>
            <span>Document Group<sup>*</sup></span>
            <app-select
              [options]="documentGroups()"
              optionLabel="pDocumentGroup"
              optionValue="pDocumentGroup"
              placeholder="Select group"
              [(ngModel)]="draft.pDocumentGroup"
              (ngModelChange)="onGroupChange()"
              name="docGroup"
            />
            <app-validation-message [message]="errors().docGroup" />
          </label>

          <label>
            <span>Document Type<sup>*</sup></span>
            <app-select
              [options]="documentNames()"
              optionLabel="pDocumentName"
              optionValue="pDocumentName"
              placeholder="Select type"
              [(ngModel)]="draft.pDocumentName"
              name="docName"
            />
            <app-validation-message [message]="errors().docName" />
          </label>

          <label>
            <span>Document Number<sup>*</sup></span>
            <input
              pInputText
              type="text"
              name="docNumber"
              [(ngModel)]="draft.pDocumentNumber"
              maxlength="40"
            />
            <app-validation-message [message]="errors().docNumber" />
          </label>

          <div class="actions">
            <p-button
              [label]="editingIndex() === null ? 'Add' : 'Update'"
              [icon]="editingIndex() === null ? 'pi pi-plus' : 'pi pi-check'"
              type="submit"
              size="small"
            />
            @if (editingIndex() !== null) {
              <p-button
                label="Cancel"
                severity="secondary"
                [outlined]="true"
                size="small"
                (onClick)="cancelEdit()"
              />
            }
          </div>
        </div>
      </form>

      <ng-template #actionsTpl let-row>
        <p-button
          icon="pi pi-pencil"
          [rounded]="true"
          [text]="true"
          severity="info"
          size="small"
          pTooltip="Edit"
          (onClick)="editRow(row)"
        />
        <p-button
          icon="pi pi-trash"
          [rounded]="true"
          [text]="true"
          severity="danger"
          size="small"
          pTooltip="Delete"
          (onClick)="deleteRow(row)"
        />
      </ng-template>

      <app-data-grid
        [rows]="visibleRows()"
        [columns]="columns()"
        [showSearch]="false"
        [showExportExcel]="false"
        [showExportPdf]="false"
        [paginator]="false"
        emptyMessage="No KYC documents added yet."
      />
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .kyc-subform-header h4 {
        margin: 0 0 0.5rem 0;
      }
      .kyc-subform form .row {
        display: grid;
        grid-template-columns: repeat(3, minmax(160px, 1fr)) auto;
        gap: 0.75rem;
        align-items: end;
      }
      .kyc-subform label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      .kyc-subform label span sup {
        color: var(--p-red-500, #dc2626);
      }
      .kyc-subform .actions {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class KycDocumentsSubformComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  private readonly contacts = inject(ContactMasterService);
  private readonly fi = inject(FIIndividualService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly contactId = input<number>(0);

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: KycRecord; value: unknown }>;

  protected readonly documentGroups = signal<DocumentGroup[]>([]);
  protected readonly documentNames = signal<DocumentName[]>([]);

  protected readonly records = signal<KycRecord[]>([]);
  protected readonly visibleRows = computed(() =>
    this.records().filter((r) => r.ptypeofoperation !== 'DELETE'),
  );

  protected readonly editingIndex = signal<number | null>(null);
  protected draft: DraftKyc = { ...EMPTY_DRAFT };

  protected readonly errors = signal<{
    docGroup: string;
    docName: string;
    docNumber: string;
  }>({ docGroup: '', docName: '', docNumber: '' });

  protected readonly columns = signal<DataGridColumn<KycRecord>[]>([]);

  protected readonly selectedGroup = signal<string>('');

  constructor() {
    effect(() => {
      const group = this.selectedGroup();
      if (!group) {
        this.documentNames.set([]);
        return;
      }
      this.fi.getIdProofTypeDetails(group).subscribe({
        next: (names) => this.documentNames.set((names as DocumentName[]) ?? []),
      });
    });
  }

  ngOnInit(): void {
    this.fi.getDocumentGroupNames().subscribe({
      next: (groups) => this.documentGroups.set((groups as DocumentGroup[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load KYC groups'),
    });
  }

  protected onGroupChange(): void {
    this.selectedGroup.set(this.draft.pDocumentGroup);
    this.draft.pDocumentName = '';
  }

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'pDocumentGroup', header: 'Group' },
      { field: 'pDocumentName', header: 'Type' },
      { field: 'pDocumentNumber', header: 'Number' },
      {
        field: '__actions',
        header: 'Actions',
        sortable: false,
        align: 'center',
        width: '140px',
        cellTemplate: this.actionsTpl,
      },
    ]);
    this.cdr.detectChanges();
  }

  // -------- CVA --------
  private internalChange: (val: KycRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(rows: KycRecord[] | null): void {
    this.records.set(Array.isArray(rows) ? rows.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: KycRecord[]) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // disabled state currently no-op; UX does not surface a disabled mode
  }

  // -------- editing --------
  protected addOrUpdate(): void {
    const errors = this.validate(this.draft);
    this.errors.set(errors);
    if (errors.docGroup || errors.docName || errors.docNumber) return;

    const editing = this.editingIndex();

    // Duplicate (group, type, number) protection.
    const dupIndex = this.records().findIndex(
      (r, i) =>
        i !== editing &&
        r.ptypeofoperation !== 'DELETE' &&
        r.pDocumentGroup === this.draft.pDocumentGroup &&
        r.pDocumentName === this.draft.pDocumentName &&
        r.pDocumentNumber.trim() === this.draft.pDocumentNumber.trim(),
    );
    if (dupIndex >= 0) {
      this.toast.warn('This KYC document already exists.');
      return;
    }

    const next = [...this.records()];
    if (editing === null) {
      next.push({
        precordid: 0,
        pContactId: this.contactId(),
        pDocumentGroup: this.draft.pDocumentGroup,
        pDocumentName: this.draft.pDocumentName,
        pDocumentNumber: this.draft.pDocumentNumber.trim(),
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pDocumentGroup: this.draft.pDocumentGroup,
        pDocumentName: this.draft.pDocumentName,
        pDocumentNumber: this.draft.pDocumentNumber.trim(),
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      };
    }

    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: KycRecord): void {
    const idx = this.records().findIndex((r) => r === row);
    if (idx < 0) return;
    this.editingIndex.set(idx);
    this.draft = {
      pDocumentGroup: row.pDocumentGroup,
      pDocumentName: row.pDocumentName,
      pDocumentNumber: row.pDocumentNumber,
    };
  }

  protected deleteRow(row: KycRecord): void {
    const next = this.records()
      .map((r) => {
        if (r !== row) return r;
        if (r.ptypeofoperation === 'CREATE') return null as unknown as KycRecord;
        return { ...r, ptypeofoperation: 'DELETE' as KycRecordOperation };
      })
      .filter((r) => r !== null) as KycRecord[];
    this.records.set(next);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({ docGroup: '', docName: '', docNumber: '' });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(d: DraftKyc): {
    docGroup: string;
    docName: string;
    docNumber: string;
  } {
    return {
      docGroup: d.pDocumentGroup ? '' : 'Document group is required.',
      docName: d.pDocumentName ? '' : 'Document type is required.',
      docNumber: d.pDocumentNumber.trim() ? '' : 'Document number is required.',
    };
  }
}
