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

import {
  DateInputComponent,
  RichEditorComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  LoanLettersService,
  type LetterKind,
} from '../services/loan-letters.service';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';

interface LetterDetail {
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pAmount?: number;
  pVoucherno?: string;
  pLetterDate: Date | string | null;
  pBody: string;
  pStatus: string;
  pRemarks: string;
  [key: string]: unknown;
}

const EMPTY_DETAIL: LetterDetail = {
  pVchapplicationid: '',
  pLetterDate: new Date(),
  pBody: '',
  pStatus: 'Pending',
  pRemarks: '',
};

const TITLES: Record<LetterKind, string> = {
  sanction: 'Sanction Letter',
  disbursement: 'Disbursement Letter',
  deliveryorder: 'Delivery Order',
  acknowledgement: 'Acknowledgement Letter',
};

const VIEW_ROUTE: Record<LetterKind, string> = {
  sanction: '/loans/SanctionLetterView',
  disbursement: '/loans/DisburementLetterView',
  deliveryorder: '/loans/DeliveryorderView',
  acknowledgement: '/loans/AcknowledgementsView',
};

/**
 * Letter detail / print shell. Replaces the four legacy letter
 * components (~1100 LOC combined) with a single rich-editor-driven
 * shell: load template → edit → save → print via the browser's native
 * print path (no Kendo PDF export needed; the existing rich editor
 * renders cleanly to printable HTML).
 */
@Component({
  selector: 'app-letter-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    DateInputComponent,
    RichEditorComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="lt-shell">
      <header class="lh">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">Application: <strong>{{ applicationId() }}</strong></p>
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
            label="Print"
            severity="secondary"
            icon="pi pi-print"
            (onClick)="print()"
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

      <p-card header="Header">
        <div class="grid">
          <label class="field">
            <span>Customer</span>
            <input [value]="detail.pContactName ?? ''" readonly />
          </label>
          <label class="field">
            <span>Loan</span>
            <input [value]="detail.pLoanName ?? ''" readonly />
          </label>
          <label class="field">
            <span>Letter Date<sup>*</sup></span>
            <app-date-input
              [(ngModel)]="detail.pLetterDate"
              name="letterDate"
            />
            <app-validation-message [message]="errors().pLetterDate" />
          </label>
        </div>
      </p-card>

      <p-card header="Body" class="body-card">
        <div #printable class="printable">
          <app-rich-editor
            [(ngModel)]="detail.pBody"
            placeholder="Letter body…"
          />
        </div>
      </p-card>

      <p-card header="Footer">
        <label class="field">
          <span>Internal Remarks</span>
          <textarea
            pTextarea
            rows="3"
            [(ngModel)]="detail.pRemarks"
            name="remarks"
            maxlength="500"
          ></textarea>
        </label>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .lt-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .lh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .lh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .field input[readonly] {
        padding: 0.5rem;
        border: 1px solid var(--p-surface-300);
        border-radius: 0.4rem;
        background: var(--p-surface-50);
      }
      .body-card { min-height: 300px; }
      @media print {
        .lh, .actions, p-card[header='Footer'] { display: none !important; }
        .printable {
          font-size: 12pt;
          color: black;
        }
      }
    `,
  ],
})
export class LetterShellComponent implements OnInit {
  private readonly api = inject(LoanLettersService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<LetterKind>('sanction');
  protected readonly applicationId = signal<string>('');
  protected readonly saving = signal<boolean>(false);
  protected detail: LetterDetail = { ...EMPTY_DETAIL };

  protected readonly errors = signal<{ pLetterDate: string }>({
    pLetterDate: '',
  });

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Letter');
  protected readonly isValid = computed(() => !!this.detail.pLetterDate);

  ngOnInit(): void {
    const k = this.route.snapshot.data['letterKind'] as LetterKind | undefined;
    if (k) this.kind.set(k);
    const id = this.route.snapshot.paramMap.get('applicationId') ?? '';
    this.applicationId.set(id);
    this.detail.pVchapplicationid = id;
    if (id) this.load();
  }

  private load(): void {
    this.loader.show();
    const voucherNo = this.route.snapshot.queryParamMap.get('voucherno') ?? undefined;
    this.api.getById(this.kind(), this.applicationId(), voucherNo).subscribe({
      next: (data) => {
        const d = data as LetterDetail | null;
        if (d && typeof d === 'object') {
          this.detail = { ...EMPTY_DETAIL, ...d };
          if (this.detail.pLetterDate && !(this.detail.pLetterDate instanceof Date)) {
            this.detail.pLetterDate = new Date(this.detail.pLetterDate);
          }
        }
      },
      error: (err) => this.toast.error(err?.message ?? 'Failed to load letter'),
      complete: () => this.loader.hide(),
    });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({ pLetterDate: 'Letter date is required.' });
      return;
    }
    this.saving.set(true);
    this.api.save(this.kind(), this.detail).subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected print(): void {
    window.print();
  }

  protected back(): void {
    void this.router.navigate([VIEW_ROUTE[this.kind()]]);
  }
}
