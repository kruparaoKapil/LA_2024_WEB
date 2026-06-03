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
import {
  FIIndividualLoanSpecificService,
  type VehicleModel,
} from '../services/fi-individual-loan-specific.service';
import type { DocumentReference } from '../../../shared/ui/document-upload/document-upload.component';

export interface MovablePropertyRecord extends ListRow {
  pRecordid: number;
  pContactid: number;
  pTypeofvehicle: string;
  pVehicleownername: string;
  pVehiclemodelandmake: string;
  pRegistrationno: string;
  pEstimatedmarketvalue: number;
  pVehicledocpath: string;
  pVehicledocpathname: string;
}

interface MovableDraft {
  pTypeofvehicle: string;
  pVehicleownername: string;
  pVehiclemodelandmake: string;
  pRegistrationno: string;
  pEstimatedmarketvalue: number | null;
  doc: DocumentReference | null;
}

const EMPTY_DRAFT: MovableDraft = {
  pTypeofvehicle: '',
  pVehicleownername: '',
  pVehiclemodelandmake: '',
  pRegistrationno: '',
  pEstimatedmarketvalue: null,
  doc: null,
};

/**
 * Replaces 319-LOC `MovablePropertyDetailsComponent`. Static vehicle-make
 * catalog lives on `FIIndividualLoanSpecificService` (Phase 7B).
 */
@Component({
  selector: 'app-movable-property-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DataGridComponent,
    CurrencyInputComponent,
    SelectComponent,
    DocumentUploadComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MovablePropertySubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Movable Property (Vehicles)</h4></header>

      <form (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="grid">
          <label class="field">
            <span>Type<sup>*</sup></span>
            <input
              pInputText
              name="vehicleType"
              [(ngModel)]="draft.pTypeofvehicle"
              maxlength="60"
            />
            <app-validation-message [message]="errors().pTypeofvehicle" />
          </label>
          <label class="field">
            <span>Make / Model</span>
            <app-select
              [options]="vehicleModels"
              optionLabel="modeltype"
              optionValue="modeltype"
              [(ngModel)]="draft.pVehiclemodelandmake"
              name="vehicleMake"
              placeholder="Manufacturer"
            />
          </label>
          <label class="field">
            <span>Registration No</span>
            <input
              pInputText
              name="regNo"
              [(ngModel)]="draft.pRegistrationno"
              maxlength="20"
            />
          </label>
          <label class="field">
            <span>Owner<sup>*</sup></span>
            <input
              pInputText
              name="vehicleOwner"
              [(ngModel)]="draft.pVehicleownername"
              maxlength="80"
            />
            <app-validation-message [message]="errors().pVehicleownername" />
          </label>
          <label class="field">
            <span>Estimated Value<sup>*</sup></span>
            <app-currency-input
              [(ngModel)]="draft.pEstimatedmarketvalue"
              name="vehicleValue"
            />
            <app-validation-message [message]="errors().pEstimatedmarketvalue" />
          </label>
          <label class="field span-2">
            <span>Vehicle Document</span>
            <app-document-upload
              [(ngModel)]="draft.doc"
              [newFileName]="docName()"
              accept=".pdf,.jpg,.jpeg,.png"
              name="vehicleDoc"
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
        emptyMessage="No vehicles pledged."
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
export class MovablePropertySubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly loanSpecific = inject(FIIndividualLoanSpecificService);

  readonly contactId = input<number>(0);

  protected readonly vehicleModels: VehicleModel[] = [
    ...this.loanSpecific.vehicleModels,
  ];

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: MovablePropertyRecord; value: unknown }>;

  protected readonly records = signal<MovablePropertyRecord[]>([]);
  protected readonly visibleRows = computed(() => filterVisible(this.records()));
  protected readonly editingIndex = signal<number | null>(null);
  protected draft: MovableDraft = { ...EMPTY_DRAFT };

  protected readonly errors = signal<{
    pTypeofvehicle: string;
    pVehicleownername: string;
    pEstimatedmarketvalue: string;
  }>({
    pTypeofvehicle: '',
    pVehicleownername: '',
    pEstimatedmarketvalue: '',
  });

  protected readonly columns = signal<DataGridColumn<MovablePropertyRecord>[]>([]);
  protected readonly docName = computed(() =>
    this.draft.pTypeofvehicle
      ? this.draft.pTypeofvehicle.replace(/\s+/g, '-')
      : 'vehicle',
  );

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'pTypeofvehicle', header: 'Type' },
      { field: 'pVehiclemodelandmake', header: 'Make / Model' },
      { field: 'pRegistrationno', header: 'Reg No' },
      { field: 'pVehicleownername', header: 'Owner' },
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
  private internalChange: (val: MovablePropertyRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: MovablePropertyRecord[] | null): void {
    this.records.set(Array.isArray(val) ? val.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: MovablePropertyRecord[]) => void): void {
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
    const docPath = this.draft.doc?.filePath ?? '';
    const docFileName = this.draft.doc?.fileName ?? '';
    const next = [...this.records()];

    if (editing === null) {
      next.push({
        pRecordid: 0,
        pContactid: this.contactId(),
        pTypeofvehicle: this.draft.pTypeofvehicle.trim(),
        pVehicleownername: this.draft.pVehicleownername.trim(),
        pVehiclemodelandmake: this.draft.pVehiclemodelandmake,
        pRegistrationno: this.draft.pRegistrationno.trim(),
        pEstimatedmarketvalue: this.draft.pEstimatedmarketvalue ?? 0,
        pVehicledocpath: docPath,
        pVehicledocpathname: docFileName,
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pTypeofvehicle: this.draft.pTypeofvehicle.trim(),
        pVehicleownername: this.draft.pVehicleownername.trim(),
        pVehiclemodelandmake: this.draft.pVehiclemodelandmake,
        pRegistrationno: this.draft.pRegistrationno.trim(),
        pEstimatedmarketvalue: this.draft.pEstimatedmarketvalue ?? 0,
        pVehicledocpath: docPath || existing.pVehicledocpath,
        pVehicledocpathname: docFileName || existing.pVehicledocpathname,
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      };
    }

    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: MovablePropertyRecord): void {
    const idx = this.records().findIndex((r) => r === row);
    if (idx < 0) return;
    this.editingIndex.set(idx);
    this.draft = {
      pTypeofvehicle: row.pTypeofvehicle,
      pVehicleownername: row.pVehicleownername,
      pVehiclemodelandmake: row.pVehiclemodelandmake,
      pRegistrationno: row.pRegistrationno,
      pEstimatedmarketvalue: row.pEstimatedmarketvalue,
      doc: row.pVehicledocpath
        ? {
            filePath: row.pVehicledocpath,
            fileName: row.pVehicledocpathname || row.pVehicledocpath,
          }
        : null,
    };
  }

  protected deleteFromGrid(row: MovablePropertyRecord): void {
    this.records.set(deleteRow(this.records(), row) as MovablePropertyRecord[]);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({
      pTypeofvehicle: '',
      pVehicleownername: '',
      pEstimatedmarketvalue: '',
    });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(): {
    pTypeofvehicle: string;
    pVehicleownername: string;
    pEstimatedmarketvalue: string;
  } {
    const d = this.draft;
    return {
      pTypeofvehicle: d.pTypeofvehicle.trim() ? '' : 'Vehicle type is required.',
      pVehicleownername: d.pVehicleownername.trim() ? '' : 'Owner name is required.',
      pEstimatedmarketvalue:
        d.pEstimatedmarketvalue && d.pEstimatedmarketvalue > 0
          ? ''
          : 'Estimated value is required.',
    };
  }
}
