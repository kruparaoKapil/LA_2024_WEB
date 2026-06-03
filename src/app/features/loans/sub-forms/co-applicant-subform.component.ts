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
import { TooltipModule } from 'primeng/tooltip';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
} from '../../../shared/ui';
import { ContactSelectComponent, type ContactSelectionEvent } from '../contact/contact-select.component';
import { ToastService } from '../../../core/notifications/toast.service';
import {
  deleteRow,
  filterVisible,
  type ListRow,
} from './list-record.types';

const APPLICANT_TYPE_OPTIONS = [
  { label: 'Co-Applicant', value: 'CoApplicant' },
  { label: 'Guarantor', value: 'Guarantor' },
];

export interface CoApplicantRecord extends ListRow {
  precordid: number;
  papplicanttype: 'CoApplicant' | 'Guarantor' | string;
  papplicantid: number;
  papplicantname: string;
  pcontactreferenceid: string;
  pcontacttype: string;
  pcontactnumber?: string;
  [key: string]: unknown;
}

/**
 * Replaces 396-LOC `CoJointmemberComponent` (legacy used kendo-grid +
 * `_GetMembers` Subject). Co-applicants are picked through the
 * Phase-7B contact-select autocomplete.
 */
@Component({
  selector: 'app-co-applicant-subform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DataGridComponent,
    ContactSelectComponent,
    SelectComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CoApplicantSubformComponent),
      multi: true,
    },
  ],
  template: `
    <section>
      <header><h4>Co-Applicants &amp; Guarantors</h4></header>

      <div class="picker">
        <label class="field">
          <span>Role</span>
          <app-select
            [options]="applicantTypeOptions"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="pickedRole"
            name="applicantType"
            [showClear]="false"
          />
        </label>
        <label class="field grow">
          <span>Add Person</span>
          <app-contact-select
            #picker
            selectType="Contact"
            placeholder="Search contact to add as {{ pickedRole === 'Guarantor' ? 'guarantor' : 'co-applicant' }}…"
            (contactSelected)="onContactSelected($event)"
          />
        </label>
      </div>

      <ng-template #actionsTpl let-row>
        <p-button
          icon="pi pi-trash"
          [rounded]="true"
          [text]="true"
          severity="danger"
          size="small"
          pTooltip="Remove"
          (onClick)="removeRow(row)"
        />
      </ng-template>

      <app-data-grid
        [rows]="visibleRows()"
        [columns]="columns()"
        [showSearch]="false"
        [showExportExcel]="false"
        [showExportPdf]="false"
        [paginator]="false"
        emptyMessage="No co-applicants or guarantors yet."
      />
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      header h4 { margin: 0 0 0.75rem 0; }
      .picker {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        align-items: end;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .grow { flex: 1; }
    `,
  ],
})
export class CoApplicantSubformComponent
  implements ControlValueAccessor, AfterViewInit
{
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly applicantTypeOptions = APPLICANT_TYPE_OPTIONS;
  protected pickedRole: 'CoApplicant' | 'Guarantor' = 'CoApplicant';

  @ViewChild('actionsTpl', { static: true })
  protected actionsTpl?: TemplateRef<{ $implicit: CoApplicantRecord; value: unknown }>;
  @ViewChild('picker') protected picker?: ContactSelectComponent;

  protected readonly records = signal<CoApplicantRecord[]>([]);
  protected readonly visibleRows = computed(() => filterVisible(this.records()));

  protected readonly columns = signal<DataGridColumn<CoApplicantRecord>[]>([]);

  ngAfterViewInit(): void {
    this.columns.set([
      { field: 'papplicanttype', header: 'Role' },
      { field: 'papplicantname', header: 'Name' },
      { field: 'pcontactreferenceid', header: 'Reference ID' },
      { field: 'pcontactnumber', header: 'Mobile' },
      {
        field: '__actions',
        header: 'Actions',
        sortable: false,
        align: 'center',
        width: '100px',
        cellTemplate: this.actionsTpl,
      },
    ]);
    this.cdr.detectChanges();
  }

  // -------- CVA --------
  private internalChange: (val: CoApplicantRecord[]) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: CoApplicantRecord[] | null): void {
    this.records.set(Array.isArray(val) ? val.map((r) => ({ ...r })) : []);
  }
  registerOnChange(fn: (val: CoApplicantRecord[]) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(_isDisabled: boolean): void {
    // disabled rendering omitted in this revision
  }

  // -------- handlers --------
  protected onContactSelected(evt: ContactSelectionEvent): void {
    const dup = this.records().find(
      (r) =>
        r.ptypeofoperation !== 'DELETE' &&
        r.papplicantid === evt.contactId &&
        r.papplicanttype === this.pickedRole,
    );
    if (dup) {
      this.toast.warn(
        `${evt.contactName} is already added as ${this.pickedRole}.`,
      );
      this.picker?.reset();
      return;
    }

    const next = [
      ...this.records(),
      {
        precordid: 0,
        papplicanttype: this.pickedRole,
        papplicantid: evt.contactId,
        papplicantname: evt.contactName,
        pcontactreferenceid: evt.referenceId,
        pcontacttype: String(evt.contactType ?? ''),
        pcontactnumber: evt.contactNo,
        ptypeofoperation: 'CREATE',
      } satisfies CoApplicantRecord,
    ];
    this.records.set(next);
    this.picker?.reset();
    this.emit();
  }

  protected removeRow(row: CoApplicantRecord): void {
    this.records.set(deleteRow(this.records(), row) as CoApplicantRecord[]);
    this.emit();
  }

  private emit(): void {
    this.internalTouched();
    this.internalChange(this.records());
  }
}
