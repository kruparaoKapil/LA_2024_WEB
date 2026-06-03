import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  VerificationService,
  type VerificationKind,
} from '../services/verification.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

interface VerificationDecision {
  pVerifiedById: number | null;
  pVerifiedBy: string;
  pVerificationStatus: 'Verified' | 'Rejected' | 'Pending' | string;
  pRemarks: string;
  [key: string]: unknown;
}

interface DocumentRow {
  pDocumentName: string;
  pDocumentNumber: string;
  pDocumentGroup?: string;
  pVerified?: boolean;
  [key: string]: unknown;
}

interface EmployeeOption {
  pEmployeeId: number;
  pEmployeeName: string;
}

const STATUS_OPTIONS = [
  { label: 'Verified', value: 'Verified' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Pending', value: 'Pending' },
];

const EMPTY_DECISION: VerificationDecision = {
  pVerifiedById: null,
  pVerifiedBy: '',
  pVerificationStatus: 'Pending',
  pRemarks: '',
};

/**
 * Single shell that handles all three verification kinds (Tele,
 * Document, Field). Behaviour varies by `kind`:
 *  - Tele / Field: capture verifier + status + remarks, then save
 *  - Document: same plus a checklist of KYC docs to mark as verified
 *
 * The legacy app had three near-identical components (~600 LOC each) for
 * this; consolidating saves ~1500 LOC and keeps the validation shape
 * uniform.
 */
@Component({
  selector: 'app-verification-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    CheckboxModule,
    DataGridComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="ver-shell">
      <header class="ver-header">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">
            Application: <strong>{{ applicationId() }}</strong>
          </p>
        </div>
        <div class="actions">
          <p-button
            label="Save"
            icon="pi pi-save"
            (onClick)="save()"
            [loading]="saving()"
            [disabled]="!isValid()"
          />
          <p-button
            label="Back"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-arrow-left"
            (onClick)="back()"
          />
        </div>
      </header>

      @if (kind() === 'Document') {
        <p-card header="Documents to verify">
          <app-data-grid
            [rows]="documents()"
            [columns]="docColumns"
            [showSearch]="false"
            [showExportExcel]="false"
            [showExportPdf]="false"
            [paginator]="false"
            emptyMessage="No KYC documents on file."
          />
        </p-card>
      }

      <p-card header="Decision">
        <div class="grid">
          <label class="field">
            <span>Verifier<sup>*</sup></span>
            <app-select
              [options]="employees()"
              optionLabel="pEmployeeName"
              optionValue="pEmployeeId"
              [(ngModel)]="decision.pVerifiedById"
              (ngModelChange)="onVerifierChange()"
              name="verifier"
              placeholder="Select verifier"
            />
            <app-validation-message [message]="errors().verifier" />
          </label>
          <label class="field">
            <span>Status<sup>*</sup></span>
            <app-select
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="decision.pVerificationStatus"
              name="status"
              [showClear]="false"
            />
          </label>
          <label class="field span-2">
            <span>Remarks</span>
            <textarea
              pTextarea
              rows="3"
              [(ngModel)]="decision.pRemarks"
              name="remarks"
              maxlength="500"
            ></textarea>
          </label>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .ver-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .ver-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .ver-header h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-2 { grid-column: span 2; }
    `,
  ],
})
export class VerificationShellComponent implements OnInit {
  private readonly api = inject(VerificationService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly statusOptions = STATUS_OPTIONS;

  protected readonly kind = signal<VerificationKind>('Tele');
  protected readonly applicationId = signal<string>('');
  protected readonly employees = signal<EmployeeOption[]>([]);
  protected readonly documents = signal<DocumentRow[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected decision: VerificationDecision = { ...EMPTY_DECISION };

  protected readonly errors = signal<{ verifier: string }>({ verifier: '' });

  protected readonly title = computed(() => `${this.kind()} Verification`);

  protected readonly docColumns: DataGridColumn<DocumentRow>[] = [
    { field: 'pDocumentGroup', header: 'Group' },
    { field: 'pDocumentName', header: 'Type' },
    { field: 'pDocumentNumber', header: 'Number' },
    {
      field: 'pVerified',
      header: 'Verified',
      align: 'center',
      format: (v) => (v ? '✓' : ''),
    },
  ];

  protected readonly isValid = computed(
    () => !!this.decision.pVerifiedById && !!this.decision.pVerificationStatus,
  );

  ngOnInit(): void {
    const dataKind = this.route.snapshot.data['kind'] as VerificationKind | undefined;
    if (dataKind) this.kind.set(dataKind);
    const id = this.route.snapshot.paramMap.get('applicationId') ?? '';
    this.applicationId.set(id);

    this.api.getEmployees().subscribe({
      next: (rows) => this.employees.set((rows as EmployeeOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load employees'),
    });

    if (id) this.load();
  }

  private load(): void {
    this.loader.show();
    const id = this.applicationId();
    const detail$ =
      this.kind() === 'Field'
        ? this.api.getFieldVerificationDetails(id)
        : this.api.getVerificationDetails(id);

    detail$.subscribe({
      next: (data) => {
        const d = data as VerificationDecision | null;
        if (d && typeof d === 'object') {
          this.decision = { ...EMPTY_DECISION, ...d };
        }
      },
      error: (err) => this.toast.error(err?.message ?? 'Failed to load decision'),
      complete: () => this.loader.hide(),
    });

    if (this.kind() === 'Document') {
      this.api.getDocumentsToVerify(id).subscribe({
        next: (rows) => this.documents.set((rows as DocumentRow[]) ?? []),
        error: (err) =>
          this.toast.error(err?.message ?? 'Failed to load documents'),
      });
    }
  }

  protected onVerifierChange(): void {
    const id = this.decision.pVerifiedById;
    const match = this.employees().find((e) => e.pEmployeeId === id);
    this.decision.pVerifiedBy = match?.pEmployeeName ?? '';
    this.errors.set({ verifier: id ? '' : 'Verifier is required.' });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({ verifier: 'Verifier is required.' });
      return;
    }
    this.saving.set(true);
    const payload = {
      ...this.decision,
      pApplicationid: this.applicationId(),
      pDocuments: this.kind() === 'Document' ? this.documents() : undefined,
    };
    const op =
      this.kind() === 'Field'
        ? this.api.saveFieldVerification(payload)
        : this.kind() === 'Document'
          ? this.api.saveDocumentVerification(payload)
          : this.api.saveTeleVerification(payload);
    op.subscribe({
      next: () => {
        this.api.setSnapshot(this.kind(), payload);
        this.toast.success('Verification saved.');
        this.back();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected back(): void {
    const seg =
      this.kind() === 'Field'
        ? 'FieldverificationView'
        : this.kind() === 'Document'
          ? 'DocumentverificationView'
          : 'TeleverificationView';
    void this.router.navigate(['/loans', seg]);
  }
}
