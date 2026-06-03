import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
  CurrencyInputComponent,
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  DocumentUploadComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import {
  deleteRow,
  filterVisible,
  type ListRow,
} from './list-record.types';
import type { DocumentReference } from '../../../shared/ui/document-upload/document-upload.component';

const TITLE_DEED_OPTIONS = [
  { label: 'Leasehold', value: 'Leasehold' },
  { label: 'Freehold', value: 'Freehold' },
  { label: 'Patta', value: 'Patta' },
  { label: 'Ancestral', value: 'Ancestral' },
];

export interface PropertyRecord extends ListRow {
  pRecordid: number;
  pContactid: number;
  pTypeofproperty: string;
  pTitledeed: string;
  pDeeddate: Date | string | null;
  pPropertyownername: string;
  pAddressofproperty: string;
  pEstimatedmarketvalue: number;
  pPropertydocpath: string;
  pPropertydocpathname: string;
}

interface PropertyDraft {
  pTypeofproperty: string;
  pTitledeed: string;
  pDeeddate: Date | null;
  pPropertyownername: string;
  pAddressofproperty: string;
  pEstimatedmarketvalue: number | null;
  doc: DocumentReference | null;
}

const EMPTY_DRAFT: PropertyDraft = {
  pTypeofproperty: '',
  pTitledeed: 'Leasehold',
  pDeeddate: null,
  pPropertyownername: '',
  pAddressofproperty: '',
  pEstimatedmarketvalue: null,
  doc: null,
};

/**
 * Replaces 309-LOC `PropertyDetailsComponent`. Tracks list of properties
 * pledged as security; each row carries a document reference (deed copy)
 * uploaded via the new generic `<app-document-upload>` widget.
 */
@Component({
  selector: 'app-property-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DataGridComponent,
    DateInputComponent,
    CurrencyInputComponent,
    SelectComponent,
    DocumentUploadComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertyDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Property Details (Immovable)</h4></header>

      <form (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="grid">
          <label class="field">
            <span>Type of Property<sup>*</sup></span>
            <input
              pInputText
              name="propertyType"
              [(ngModel)]="draft.pTypeofproperty"
              maxlength="60"
            />
            <app-validation-message [message]="errors().pTypeofproperty" />
          </label>
          <label class="field">
            <span>Title Deed</span>
            <app-select
              [options]="titleDeedOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="draft.pTitledeed"
              name="titleDeed"
            />
          </label>
          <label class="field">
            <span>Deed Date</span>
            <app-date-input
              [(ngModel)]="draft.pDeeddate"
              name="deedDate"
              [maxDate]="today"
            />
          </label>
          <label class="field">
            <span>Owner Name<sup>*</sup></span>
            <input
              pInputText
              name="ownerName"
              [(ngModel)]="draft.pPropertyownername"
              maxlength="80"
            />
            <app-validation-message [message]="errors().pPropertyownername" />
          </label>
          <label class="field span-2">
            <span>Address<sup>*</sup></span>
            <input
              pInputText
              name="address"
              [(ngModel)]="draft.pAddressofproperty"
              maxlength="200"
            />
            <app-validation-message [message]="errors().pAddressofproperty" />
          </label>
          <label class="field">
            <span>Estimated Value<sup>*</sup></span>
            <app-currency-input
              [(ngModel)]="draft.pEstimatedmarketvalue"
              name="estimatedValue"
            />
            <app-validation-message [message]="errors().pEstimatedmarketvalue" />
          </label>
          <label class="field span-2">
            <span>Property Document</span>
            <app-document-upload
              [(ngModel)]="draft.doc"
              [newFileName]="docName()"
              accept=".pdf,.jpg,.jpeg,.png"
              name="propertyDoc"
            />
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
          (onClick)="deleteFromGrid(row)"
        />
      </ng-template>

      <app-data-grid
        [rows]="visibleRows()"
        [columns]="columns()"
        [showSearch]="false"
        [showExportExcel]="false"
        [showExportPdf]="false"
        [paginator]="false"
        emptyMessage="No properties pledged."
      />
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.5rem 0; }
      form .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(160px, 1fr));
        gap: 0.75rem;
        align-items: end;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-2 { grid-column: span 2; }
      .actions { display: flex; gap: 0.5rem; grid-column: span 2; }
    `,
  ],
})
export class PropertyDetailsSubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly contactId = input<number>(0);

  protected readonly today = new Date();
  protected readonly titleDeedOptions = TITLE_DEED_OPTIONS;

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: PropertyRecord; value: unknown }>;

  protected readonly records = signal<PropertyRecord[]>([]);
  protected readonly visibleRows = computed(() => filterVisible(this.records()));
  protected readonly editingIndex = signal<number | null>(null);
  protected draft: PropertyDraft = { ...EMPTY_DRAFT };

  protected readonly errors = signal<{
    pTypeofproperty: string;
    pPropertyownername: string;
    pAddressofproperty: string;
    pEstimatedmarketvalue: string;
  }>({
    pTypeofproperty: '',
    pPropertyownername: '',
    pAddressofproperty: '',
    pEstimatedmarketvalue: '',
  });

  protected readonly columns = signal<DataGridColumn<PropertyRecord>[]>([]);

  protected readonly docName = computed(() =>
    this.draft.pTypeofproperty
      ? this.draft.pTypeofproperty.replace(/\s+/g, '-')
      : 'property',
  );

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'pTypeofproperty', header: 'Type' },
      { field: 'pTitledeed', header: 'Title Deed' },
      { field: 'pPropertyownername', header: 'Owner' },
      { field: 'pAddressofproperty', header: 'Address' },
      {
        field: 'pEstimatedmarketvalue',
        header: 'Value (₹)',
        align: 'right',
        format: (v) =>
          typeof v === 'number'
            ? new Intl.NumberFormat('en-IN').format(v)
            : (v as string) ?? '',
      },
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
  private internalChange: (val: PropertyRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: PropertyRecord[] | null): void {
    this.records.set(Array.isArray(val) ? val.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: PropertyRecord[]) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // disabled rendering omitted in this revision
  }

  // -------- editing --------
  protected addOrUpdate(): void {
    const errs = this.validate();
    this.errors.set(errs);
    if (Object.values(errs).some(Boolean)) return;

    const editing = this.editingIndex();
    const next = [...this.records()];
    const docPath = this.draft.doc?.filePath ?? '';
    const docFileName = this.draft.doc?.fileName ?? '';

    if (editing === null) {
      next.push({
        pRecordid: 0,
        pContactid: this.contactId(),
        pTypeofproperty: this.draft.pTypeofproperty.trim(),
        pTitledeed: this.draft.pTitledeed,
        pDeeddate: this.draft.pDeeddate,
        pPropertyownername: this.draft.pPropertyownername.trim(),
        pAddressofproperty: this.draft.pAddressofproperty.trim(),
        pEstimatedmarketvalue: this.draft.pEstimatedmarketvalue ?? 0,
        pPropertydocpath: docPath,
        pPropertydocpathname: docFileName,
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pTypeofproperty: this.draft.pTypeofproperty.trim(),
        pTitledeed: this.draft.pTitledeed,
        pDeeddate: this.draft.pDeeddate,
        pPropertyownername: this.draft.pPropertyownername.trim(),
        pAddressofproperty: this.draft.pAddressofproperty.trim(),
        pEstimatedmarketvalue: this.draft.pEstimatedmarketvalue ?? 0,
        pPropertydocpath: docPath || existing.pPropertydocpath,
        pPropertydocpathname: docFileName || existing.pPropertydocpathname,
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      };
    }

    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: PropertyRecord): void {
    const idx = this.records().findIndex((r) => r === row);
    if (idx < 0) return;
    this.editingIndex.set(idx);
    this.draft = {
      pTypeofproperty: row.pTypeofproperty,
      pTitledeed: row.pTitledeed,
      pDeeddate: row.pDeeddate ? new Date(row.pDeeddate) : null,
      pPropertyownername: row.pPropertyownername,
      pAddressofproperty: row.pAddressofproperty,
      pEstimatedmarketvalue: row.pEstimatedmarketvalue,
      doc: row.pPropertydocpath
        ? {
            filePath: row.pPropertydocpath,
            fileName: row.pPropertydocpathname || row.pPropertydocpath,
          }
        : null,
    };
  }

  protected deleteFromGrid(row: PropertyRecord): void {
    this.records.set(deleteRow(this.records(), row) as PropertyRecord[]);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({
      pTypeofproperty: '',
      pPropertyownername: '',
      pAddressofproperty: '',
      pEstimatedmarketvalue: '',
    });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(): {
    pTypeofproperty: string;
    pPropertyownername: string;
    pAddressofproperty: string;
    pEstimatedmarketvalue: string;
  } {
    const d = this.draft;
    return {
      pTypeofproperty: d.pTypeofproperty.trim() ? '' : 'Property type is required.',
      pPropertyownername: d.pPropertyownername.trim() ? '' : 'Owner name is required.',
      pAddressofproperty: d.pAddressofproperty.trim() ? '' : 'Address is required.',
      pEstimatedmarketvalue:
        d.pEstimatedmarketvalue && d.pEstimatedmarketvalue > 0
          ? ''
          : 'Estimated value is required.',
    };
  }
}
