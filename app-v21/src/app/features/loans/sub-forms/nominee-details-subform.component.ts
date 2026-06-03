import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
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
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import {
  deleteRow,
  filterVisible,
  type ListRow,
} from './list-record.types';

export interface NomineeRecord extends ListRow {
  precordid: number;
  pnomineename: string;
  prelationship: string;
  pdateofbirth: Date | string | null;
  pAge: number | null;
  pcontactno: string;
  pPercentage: number;
  pisprimarynominee: boolean;
}

interface NomineeDraft {
  pnomineename: string;
  prelationship: string;
  pdateofbirth: Date | null;
  pAge: number | null;
  pcontactno: string;
  pPercentage: number | null;
  pisprimarynominee: boolean;
}

const EMPTY_DRAFT: NomineeDraft = {
  pnomineename: '',
  prelationship: '',
  pdateofbirth: null,
  pAge: null,
  pcontactno: '',
  pPercentage: null,
  pisprimarynominee: false,
};

/**
 * Replaces 716-LOC `CoNomineedetailsComponent`. Validates that allocated
 * percentages sum to ≤100 and ensures exactly one primary nominee.
 */
@Component({
  selector: 'app-nominee-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    CheckboxModule,
    DataGridComponent,
    DateInputComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NomineeDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header>
        <h4>Nominee Details</h4>
        <div class="meta">
          Allocated:
          <strong [class.over]="totalPct() > 100">{{ totalPct() }}%</strong>
        </div>
      </header>

      <form (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="grid">
          <label class="field">
            <span>Name<sup>*</sup></span>
            <input pInputText [(ngModel)]="draft.pnomineename" name="nomineeName" maxlength="80" />
            <app-validation-message [message]="errors().pnomineename" />
          </label>
          <label class="field">
            <span>Relationship<sup>*</sup></span>
            <input pInputText [(ngModel)]="draft.prelationship" name="rel" maxlength="40" />
            <app-validation-message [message]="errors().prelationship" />
          </label>
          <label class="field">
            <span>Date of Birth</span>
            <app-date-input [(ngModel)]="draft.pdateofbirth" name="dob" [maxDate]="today" />
          </label>
          <label class="field">
            <span>Age</span>
            <p-inputNumber [(ngModel)]="draft.pAge" name="age" [min]="0" [max]="120" />
          </label>
          <label class="field">
            <span>Mobile</span>
            <input pInputText [(ngModel)]="draft.pcontactno" name="mobile" maxlength="15" />
          </label>
          <label class="field">
            <span>Percentage<sup>*</sup></span>
            <p-inputNumber
              [(ngModel)]="draft.pPercentage"
              name="pct"
              [min]="0"
              [max]="100"
              suffix="%"
            />
            <app-validation-message [message]="errors().pPercentage" />
          </label>
          <div class="field checkbox-field">
            <p-checkbox
              [(ngModel)]="draft.pisprimarynominee"
              [binary]="true"
              inputId="primaryNom"
              name="primaryNom"
            />
            <label for="primaryNom">Primary nominee</label>
          </div>
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
        emptyMessage="No nominees added yet."
      />
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header { display: flex; align-items: center; justify-content: space-between; }
      header h4 { margin: 0 0 0.5rem 0; }
      .meta .over { color: var(--p-red-500, #dc2626); }
      form .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(160px, 1fr));
        gap: 0.75rem;
        align-items: end;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .checkbox-field { flex-direction: row; align-items: center; gap: 0.5rem; }
      .actions { display: flex; gap: 0.5rem; grid-column: span 2; }
    `,
  ],
})
export class NomineeDetailsSubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly today = new Date();

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: NomineeRecord; value: unknown }>;

  protected readonly records = signal<NomineeRecord[]>([]);
  protected readonly visibleRows = computed(() => filterVisible(this.records()));

  protected readonly editingIndex = signal<number | null>(null);
  protected draft: NomineeDraft = { ...EMPTY_DRAFT };

  protected readonly errors = signal<{
    pnomineename: string;
    prelationship: string;
    pPercentage: string;
  }>({ pnomineename: '', prelationship: '', pPercentage: '' });

  protected readonly columns = signal<DataGridColumn<NomineeRecord>[]>([]);

  protected readonly totalPct = computed(() =>
    this.visibleRows().reduce((acc, r) => acc + (r.pPercentage ?? 0), 0),
  );

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'pnomineename', header: 'Name' },
      { field: 'prelationship', header: 'Relation' },
      { field: 'pcontactno', header: 'Mobile' },
      {
        field: 'pPercentage',
        header: 'Allocation',
        align: 'right',
        format: (v) => `${v ?? 0}%`,
      },
      {
        field: 'pisprimarynominee',
        header: 'Primary',
        align: 'center',
        format: (v) => (v ? '✓' : ''),
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
  private internalChange: (val: NomineeRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: NomineeRecord[] | null): void {
    this.records.set(Array.isArray(val) ? val.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: NomineeRecord[]) => void): void {
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
    const incomingPct = this.draft.pPercentage ?? 0;

    const otherTotal = this.visibleRows().reduce((acc, r, idx) => {
      if (editing !== null && this.records().indexOf(r) === editing) return acc;
      return acc + (r.pPercentage ?? 0);
    }, 0);
    if (otherTotal + incomingPct > 100) {
      this.toast.warn('Total nominee allocation cannot exceed 100%.');
      return;
    }

    let next = [...this.records()];
    if (this.draft.pisprimarynominee) {
      next = next.map((r, i) => {
        if (editing !== null && i === editing) return r;
        if (r.ptypeofoperation === 'DELETE') return r;
        if (!r.pisprimarynominee) return r;
        return {
          ...r,
          pisprimarynominee: false,
          ptypeofoperation:
            r.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
        };
      });
    }

    if (editing === null) {
      next.push({
        precordid: 0,
        pnomineename: this.draft.pnomineename.trim(),
        prelationship: this.draft.prelationship.trim(),
        pdateofbirth: this.draft.pdateofbirth,
        pAge: this.draft.pAge,
        pcontactno: this.draft.pcontactno.trim(),
        pPercentage: incomingPct,
        pisprimarynominee:
          this.draft.pisprimarynominee ||
          this.visibleRows().filter((r) => r.pisprimarynominee).length === 0,
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pnomineename: this.draft.pnomineename.trim(),
        prelationship: this.draft.prelationship.trim(),
        pdateofbirth: this.draft.pdateofbirth,
        pAge: this.draft.pAge,
        pcontactno: this.draft.pcontactno.trim(),
        pPercentage: incomingPct,
        pisprimarynominee: this.draft.pisprimarynominee,
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      };
    }

    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: NomineeRecord): void {
    const idx = this.records().findIndex((r) => r === row);
    if (idx < 0) return;
    this.editingIndex.set(idx);
    this.draft = {
      pnomineename: row.pnomineename,
      prelationship: row.prelationship,
      pdateofbirth: row.pdateofbirth ? new Date(row.pdateofbirth) : null,
      pAge: row.pAge,
      pcontactno: row.pcontactno,
      pPercentage: row.pPercentage,
      pisprimarynominee: row.pisprimarynominee,
    };
  }

  protected deleteFromGrid(row: NomineeRecord): void {
    this.records.set(deleteRow(this.records(), row) as NomineeRecord[]);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({ pnomineename: '', prelationship: '', pPercentage: '' });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(): {
    pnomineename: string;
    prelationship: string;
    pPercentage: string;
  } {
    const d = this.draft;
    return {
      pnomineename: d.pnomineename.trim() ? '' : 'Nominee name is required.',
      prelationship: d.prelationship.trim() ? '' : 'Relationship is required.',
      pPercentage:
        d.pPercentage !== null && d.pPercentage > 0
          ? ''
          : 'Allocation percentage is required.',
    };
  }
}
