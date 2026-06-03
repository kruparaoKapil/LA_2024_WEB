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

import {
  DataGridComponent,
  type DataGridColumn,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import {
  deleteRow,
  filterVisible,
  type ListRow,
  type ListRowOperation,
} from './list-record.types';

export interface FamilyMemberRecord extends ListRow {
  pfamilyrecordid: number;
  pTotalnoofmembers: number;
  pContactpersonname: string;
  pRelationwithemployee: string;
  pContactnumber: string;
}

interface FamilyDraft {
  pTotalnoofmembers: number | null;
  pContactpersonname: string;
  pRelationwithemployee: string;
  pContactnumber: string;
}

const EMPTY_DRAFT: FamilyDraft = {
  pTotalnoofmembers: null,
  pContactpersonname: '',
  pRelationwithemployee: '',
  pContactnumber: '',
};

/**
 * Replaces 209-LOC `FamilyDetailsComponent` (legacy lived under
 * `<app-personal-details>`). CVA-shaped so consumers do
 *
 *   <app-family-details-subform [(ngModel)]="familyMembers" />
 *
 * Validates total-members count, requires unique person names, blocks
 * the placeholder phone number "0000000000" the legacy code rejected.
 */
@Component({
  selector: 'app-family-details-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    DataGridComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FamilyDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Family Details</h4></header>

      <form (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="row">
          <label>
            <span>Total Members<sup>*</sup></span>
            <p-inputNumber
              [(ngModel)]="draft.pTotalnoofmembers"
              name="totalMembers"
              [min]="1"
              [max]="20"
            />
            <app-validation-message [message]="errors().totalMembers" />
          </label>
          <label>
            <span>Person Name<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="draft.pContactpersonname"
              name="personName"
              maxlength="60"
            />
            <app-validation-message [message]="errors().personName" />
          </label>
          <label>
            <span>Relationship<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="draft.pRelationwithemployee"
              name="relation"
              maxlength="40"
            />
            <app-validation-message [message]="errors().relation" />
          </label>
          <label>
            <span>Mobile<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="draft.pContactnumber"
              name="mobile"
              maxlength="15"
            />
            <app-validation-message [message]="errors().mobile" />
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
        emptyMessage="No family members added yet."
      />
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.5rem 0; }
      form .row {
        display: grid;
        grid-template-columns: 130px 1fr 1fr 1fr auto;
        gap: 0.75rem;
        align-items: end;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      label span sup { color: var(--p-red-500, #dc2626); }
      .actions { display: flex; gap: 0.5rem; }
    `,
  ],
})
export class FamilyDetailsSubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: FamilyMemberRecord; value: unknown }>;

  protected readonly records = signal<FamilyMemberRecord[]>([]);
  protected readonly visibleRows = computed(() => filterVisible(this.records()));

  protected readonly editingIndex = signal<number | null>(null);
  protected draft: FamilyDraft = { ...EMPTY_DRAFT };

  protected readonly errors = signal<{
    totalMembers: string;
    personName: string;
    relation: string;
    mobile: string;
  }>({ totalMembers: '', personName: '', relation: '', mobile: '' });

  protected readonly columns = signal<DataGridColumn<FamilyMemberRecord>[]>([]);

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'pContactpersonname', header: 'Name' },
      { field: 'pRelationwithemployee', header: 'Relation' },
      { field: 'pContactnumber', header: 'Mobile' },
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
  private internalChange: (val: FamilyMemberRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: FamilyMemberRecord[] | null): void {
    this.records.set(Array.isArray(val) ? val.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: FamilyMemberRecord[]) => void): void {
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
    const errs = this.validate(this.draft);
    this.errors.set(errs);
    if (errs.totalMembers || errs.personName || errs.relation || errs.mobile) return;

    const editing = this.editingIndex();
    const dupIndex = this.records().findIndex(
      (r, i) =>
        i !== editing &&
        r.ptypeofoperation !== 'DELETE' &&
        r.pContactpersonname.toLowerCase() ===
          this.draft.pContactpersonname.trim().toLowerCase(),
    );
    if (dupIndex >= 0) {
      this.toast.warn('A family member with that name already exists.');
      return;
    }

    const next = [...this.records()];
    if (editing === null) {
      const visibleCount = filterVisible(next).length;
      const total = this.draft.pTotalnoofmembers ?? 0;
      if (visibleCount >= total) {
        this.toast.warn(
          `You declared ${total} members but already have ${visibleCount} added.`,
        );
        return;
      }
      next.push({
        pfamilyrecordid: 0,
        pTotalnoofmembers: total,
        pContactpersonname: this.draft.pContactpersonname.trim(),
        pRelationwithemployee: this.draft.pRelationwithemployee.trim(),
        pContactnumber: this.draft.pContactnumber.trim(),
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pTotalnoofmembers:
          this.draft.pTotalnoofmembers ?? existing.pTotalnoofmembers,
        pContactpersonname: this.draft.pContactpersonname.trim(),
        pRelationwithemployee: this.draft.pRelationwithemployee.trim(),
        pContactnumber: this.draft.pContactnumber.trim(),
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      } as FamilyMemberRecord;
    }
    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: FamilyMemberRecord): void {
    const idx = this.records().findIndex((r) => r === row);
    if (idx < 0) return;
    this.editingIndex.set(idx);
    this.draft = {
      pTotalnoofmembers: row.pTotalnoofmembers,
      pContactpersonname: row.pContactpersonname,
      pRelationwithemployee: row.pRelationwithemployee,
      pContactnumber: row.pContactnumber,
    };
  }

  protected deleteFromGrid(row: FamilyMemberRecord): void {
    this.records.set(deleteRow(this.records(), row) as FamilyMemberRecord[]);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({ totalMembers: '', personName: '', relation: '', mobile: '' });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(d: FamilyDraft): {
    totalMembers: string;
    personName: string;
    relation: string;
    mobile: string;
  } {
    const out = { totalMembers: '', personName: '', relation: '', mobile: '' };
    if (!d.pTotalnoofmembers || d.pTotalnoofmembers <= 0) {
      out.totalMembers = 'Total members is required.';
    }
    if (!d.pContactpersonname.trim()) {
      out.personName = 'Person name is required.';
    }
    if (!d.pRelationwithemployee.trim()) {
      out.relation = 'Relationship is required.';
    }
    const phone = d.pContactnumber.trim();
    if (!phone) {
      out.mobile = 'Mobile is required.';
    } else if (phone === '0000000000') {
      out.mobile = 'Enter a valid mobile number.';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(phone)) {
      out.mobile = 'Mobile must be 10–15 digits.';
    }
    return out;
  }
}
