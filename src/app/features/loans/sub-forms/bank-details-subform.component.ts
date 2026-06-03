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
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
  DataGridComponent,
  type DataGridColumn,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';
import { IfscCodeDirective } from '../../../shared/directives/ifsc-code.directive';

export type BankRecordOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'OLD';

export interface BankRecord {
  precordid: number;
  pContactId: number;
  pBankId: number;
  pBankName: string;
  pBankAccountNo: string;
  pBankifscCode: string;
  pBankBranch: string;
  pIsprimaryAccount: boolean;
  ptypeofoperation: BankRecordOperation;
  [key: string]: unknown;
}

interface DraftBank {
  pBankId: number | null;
  pBankName: string;
  pBankAccountNo: string;
  pBankifscCode: string;
  pBankBranch: string;
}

const EMPTY_DRAFT: DraftBank = {
  pBankId: null,
  pBankName: '',
  pBankAccountNo: '',
  pBankifscCode: '',
  pBankBranch: '',
};

/**
 * Replaces legacy 555-LOC `BankdetailsnewComponent`. Implemented as a
 * Control Value Accessor so the FI Individual form can use it like any
 * other field:
 *
 *   <app-bank-details-subform [contactId]="contactId()" formControlName="banks" />
 *
 * Or with signal forms:
 *
 *   <app-bank-details-subform [contactId]="contactId()" [(ngModel)]="banks" />
 *
 * The component owns:
 *  - the in-memory list of bank records,
 *  - add/edit/delete with `ptypeofoperation` tracking the legacy lifecycle
 *    flag the API expects,
 *  - primary-account selection (radio across rows),
 *  - duplicate-account-number guard.
 */
@Component({
  selector: 'app-bank-details-subform',
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
    ValidationMessageComponent,
    UppercaseDirective,
    IfscCodeDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BankDetailsSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section class="bank-subform">
      <header class="bank-subform-header">
        <h4>Bank Details</h4>
      </header>

      <form class="bank-form" (submit)="$event.preventDefault(); addOrUpdate()">
        <div class="row">
          <label>
            <span>Bank Name<sup>*</sup></span>
            <input
              pInputText
              type="text"
              name="bankName"
              [(ngModel)]="draft.pBankName"
              placeholder="State Bank of India"
              maxlength="100"
            />
            <app-validation-message [message]="errors().bankName" />
          </label>

          <label>
            <span>A/C Number<sup>*</sup></span>
            <input
              pInputText
              type="text"
              name="accountNo"
              [(ngModel)]="draft.pBankAccountNo"
              maxlength="32"
            />
            <app-validation-message [message]="errors().accountNo" />
          </label>

          <label>
            <span>IFSC Code</span>
            <input
              pInputText
              type="text"
              name="ifsc"
              [(ngModel)]="draft.pBankifscCode"
              appUppercase
              appIfsccodevalidator
              maxlength="11"
            />
            <app-validation-message [message]="errors().ifsc" />
          </label>

          <label>
            <span>Branch</span>
            <input
              pInputText
              type="text"
              name="branch"
              [(ngModel)]="draft.pBankBranch"
              maxlength="100"
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

      <ng-template #primaryTpl let-row>
        <input
          type="radio"
          name="primary-bank"
          [checked]="row.pIsprimaryAccount"
          (change)="setPrimaryRow(row)"
        />
      </ng-template>

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
        emptyMessage="No bank accounts added yet."
      />
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bank-subform-header h4 {
        margin: 0 0 0.5rem 0;
      }
      .bank-form .row {
        display: grid;
        grid-template-columns: repeat(2, minmax(180px, 1fr)) 140px 1fr auto;
        gap: 0.75rem;
        align-items: end;
      }
      .bank-form label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      .bank-form label span sup {
        color: var(--p-red-500, #dc2626);
      }
      .bank-form .actions {
        display: flex;
        gap: 0.5rem;
      }
      :host ::ng-deep .primary-cell {
        text-align: center;
      }
    `,
  ],
})
export class BankDetailsSubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** ContactId stamp that gets recorded on every CREATE row. */
  readonly contactId = input<number>(0);

  @ViewChild('primaryTpl', { static: true })
  protected primaryTpl?: TemplateRef<{ $implicit: BankRecord; value: unknown }>;
  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: BankRecord; value: unknown }>;

  // ---- list state ----
  protected readonly records = signal<BankRecord[]>([]);
  protected readonly visibleRows = computed(() =>
    this.records().filter((r) => r.ptypeofoperation !== 'DELETE'),
  );

  // ---- editing state ----
  protected readonly editingIndex = signal<number | null>(null);
  protected draft: DraftBank = { ...EMPTY_DRAFT };
  protected readonly errors = signal<{
    bankName: string;
    accountNo: string;
    ifsc: string;
  }>({ bankName: '', accountNo: '', ifsc: '' });

  protected readonly columns = signal<DataGridColumn<BankRecord>[]>([]);

  ngAfterViewInit(): void {
    this.columns.set([
      {
        field: 'pIsprimaryAccount',
        header: 'Primary',
        align: 'center',
        sortable: false,
        width: '90px',
        cellTemplate: this.primaryTpl,
      },
      { field: 'pBankName', header: 'Bank' },
      { field: 'pBankAccountNo', header: 'A/C Number' },
      { field: 'pBankifscCode', header: 'IFSC' },
      { field: 'pBankBranch', header: 'Branch' },
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

  // ----------------- CVA -----------------
  private internalChange: (val: BankRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(rows: BankRecord[] | null): void {
    this.records.set(Array.isArray(rows) ? rows.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: BankRecord[]) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // disabled rendering omitted in this revision
  }

  // ----------------- editing -----------------
  protected addOrUpdate(): void {
    const errors = this.validate(this.draft);
    this.errors.set(errors);
    if (errors.bankName || errors.accountNo || errors.ifsc) {
      return;
    }

    const editing = this.editingIndex();
    const dupAccountNoIndex = this.records().findIndex(
      (r, i) =>
        i !== editing &&
        r.ptypeofoperation !== 'DELETE' &&
        r.pBankAccountNo.trim() === this.draft.pBankAccountNo.trim(),
    );
    if (dupAccountNoIndex >= 0) {
      this.toast.warn('Account number already exists.');
      return;
    }

    const next = [...this.records()];
    if (editing === null) {
      const isFirst = next.filter((r) => r.ptypeofoperation !== 'DELETE').length === 0;
      next.push({
        precordid: 0,
        pContactId: this.contactId(),
        pBankId: this.draft.pBankId ?? 0,
        pBankName: this.draft.pBankName.trim(),
        pBankAccountNo: this.draft.pBankAccountNo.trim(),
        pBankifscCode: this.draft.pBankifscCode.trim(),
        pBankBranch: this.draft.pBankBranch.trim(),
        pIsprimaryAccount: isFirst,
        ptypeofoperation: 'CREATE',
      });
    } else {
      const existing = next[editing];
      next[editing] = {
        ...existing,
        pBankName: this.draft.pBankName.trim(),
        pBankAccountNo: this.draft.pBankAccountNo.trim(),
        pBankifscCode: this.draft.pBankifscCode.trim(),
        pBankBranch: this.draft.pBankBranch.trim(),
        ptypeofoperation:
          existing.ptypeofoperation === 'CREATE' ? 'CREATE' : 'UPDATE',
      };
    }

    this.records.set(next);
    this.cancelEdit();
    this.emit();
  }

  protected editRow(row: BankRecord): void {
    const masterIndex = this.records().findIndex((r) => r === row);
    if (masterIndex < 0) return;
    this.editingIndex.set(masterIndex);
    this.draft = {
      pBankId: row.pBankId,
      pBankName: row.pBankName,
      pBankAccountNo: row.pBankAccountNo,
      pBankifscCode: row.pBankifscCode,
      pBankBranch: row.pBankBranch,
    };
  }

  protected deleteRow(row: BankRecord): void {
    const next = this.records()
      .map((r) => {
        if (r !== row) return r;
        if (r.ptypeofoperation === 'CREATE') {
          return null as unknown as BankRecord;
        }
        return { ...r, ptypeofoperation: 'DELETE' as BankRecordOperation };
      })
      .filter((r) => r !== null) as BankRecord[];

    if (row.pIsprimaryAccount) {
      const remaining = next.filter((r) => r.ptypeofoperation !== 'DELETE');
      if (remaining.length > 0) {
        remaining[0].pIsprimaryAccount = true;
        if (remaining[0].ptypeofoperation === 'OLD') {
          remaining[0].ptypeofoperation = 'UPDATE';
        }
      }
    }
    this.records.set(next);
    this.emit();
  }

  protected setPrimaryRow(row: BankRecord): void {
    const next = this.records().map((r) => {
      if (r.ptypeofoperation === 'DELETE') return r;
      const isPrimary = r === row;
      return {
        ...r,
        pIsprimaryAccount: isPrimary,
        ptypeofoperation:
          r.ptypeofoperation === 'CREATE' ? 'CREATE' : ('UPDATE' as BankRecordOperation),
      };
    });
    this.records.set(next);
    this.emit();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.draft = { ...EMPTY_DRAFT };
    this.errors.set({ bankName: '', accountNo: '', ifsc: '' });
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }

  private validate(d: DraftBank): {
    bankName: string;
    accountNo: string;
    ifsc: string;
  } {
    const out = { bankName: '', accountNo: '', ifsc: '' };
    if (!d.pBankName.trim()) out.bankName = 'Bank name is required.';
    if (!d.pBankAccountNo.trim()) out.accountNo = 'Account number is required.';
    if (d.pBankifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(d.pBankifscCode.trim())) {
      out.ifsc = 'IFSC code is invalid.';
    }
    return out;
  }
}
