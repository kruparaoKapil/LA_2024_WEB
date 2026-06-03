import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  CurrencyInputComponent,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  TdsService,
  type PanContactRow,
} from '../services/tds.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type TdsFormKind =
  | 'form15h'
  | 'form121'
  | 'form15h-reprint'
  | 'form121-reprint';

const TITLES: Record<TdsFormKind, string> = {
  form15h: 'Form 15-H',
  form121: 'Form 121',
  'form15h-reprint': 'Form 15-H Reprint',
  'form121-reprint': 'Form 121 Reprint',
};

@Component({
  selector: 'app-tds-form-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DateInputComponent,
    SelectComponent,
    CurrencyInputComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="tds-form">
      <header class="fh">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">Simplified shell — full multi-tab legacy forms deferred.</p>
        </div>
        <div class="actions">
          @if (isReprint()) {
            <p-button label="Print" icon="pi pi-print" (onClick)="print()" />
          } @else {
            <p-button label="Save" icon="pi pi-save" (onClick)="save()" [loading]="saving()" [disabled]="!isValid()" />
          }
        </div>
      </header>
      <p-card>
        <div class="grid">
          <label class="field">
            <span>Contact<sup>*</sup></span>
            <app-select
              [options]="contacts()"
              optionLabel="pContactName"
              optionValue="pContactID"
              [(ngModel)]="contactId"
              (ngModelChange)="onContactChange()"
            />
          </label>
          <label class="field">
            <span>Fiscal Year<sup>*</sup></span>
            <input pInputText [(ngModel)]="fiscalYear" name="fy" maxlength="9" placeholder="2024-2025" />
          </label>
          @if (isReprint()) {
            <label class="field">
              <span>Form UID</span>
              <input pInputText [(ngModel)]="formUid" name="uid" />
            </label>
          } @else {
            <label class="field">
              <span>Estimated Income</span>
              <app-currency-input [(ngModel)]="estimatedIncome" name="inc" />
            </label>
            <label class="field">
              <span>Declaration Date</span>
              <app-date-input [(ngModel)]="declarationDate" name="dec" />
            </label>
          }
        </div>
        <app-validation-message [message]="error()" />
      </p-card>
      @if (isReprint() && printHtml()) {
        <div class="printable" [innerHTML]="printHtml()"></div>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .tds-form { display: flex; flex-direction: column; gap: 0.75rem; }
      .fh { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
      .fh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; font-size: 0.85rem; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .printable { display: none; }
      @media print {
        .fh, p-card { display: none !important; }
        .printable { display: block; padding: 1rem; }
      }
    `,
  ],
})
export class TdsFormShellComponent implements OnInit {
  private readonly api = inject(TdsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<TdsFormKind>('form15h');
  protected readonly contacts = signal<PanContactRow[]>([]);
  protected readonly saving = signal(false);
  protected readonly printHtml = signal('');
  protected readonly error = signal('');

  protected contactId: number | null = null;
  protected fiscalYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  protected estimatedIncome: number | null = null;
  protected declarationDate: Date | null = new Date();
  protected formUid = '';
  protected companyId = 1;

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'TDS Form');
  protected readonly isReprint = computed(() =>
    this.kind().includes('reprint'),
  );
  protected readonly isValid = computed(
    () => this.contactId != null && !!this.fiscalYear,
  );

  ngOnInit(): void {
    const k = this.route.snapshot.data['formKind'] as TdsFormKind | undefined;
    if (k) this.kind.set(k);
    this.api.getContactsWithoutPan().subscribe({
      next: (rows) => {
        if (rows?.length) this.contacts.set(rows);
      },
    });
  }

  protected onContactChange(): void {
    if (!this.isReprint() || !this.contactId || !this.formUid) return;
    this.api.getForm15HReport(this.formUid).subscribe({
      next: (data) => {
        const row = Array.isArray(data) ? data[0] : data;
        this.printHtml.set(
          row
            ? `<pre>${JSON.stringify(row, null, 2)}</pre>`
            : '<p>No data for UID.</p>',
        );
      },
    });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.error.set('Contact and fiscal year are required.');
      return;
    }
    this.saving.set(true);
    const payload = {
      pContactId: this.contactId,
      fiscalYear: this.fiscalYear,
      estimated_total_income_amount: this.estimatedIncome,
      declarationDate: this.declarationDate,
      formKind: this.kind(),
    };
    this.api.saveForm15H(payload).subscribe({
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
    if (!this.formUid) {
      this.onContactChange();
    }
    window.print();
  }
}
