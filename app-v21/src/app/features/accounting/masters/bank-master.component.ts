import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  AccountingMastersService,
  type BankInformationRow,
} from '../services/accounting-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const EMPTY_BANK: BankInformationRow = {
  pbankname: '',
  pbranchname: '',
  paccountname: '',
  paccountnumber: '',
  pifsccode: '',
  pmicrcode: '',
  pUpiId: '',
};

const IFSC_RX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

@Component({
  selector: 'app-bank-master',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ValidationMessageComponent,
  ],
  template: `
    <div class="bank-master">
      <header class="bm-h">
        <div>
          <h2>{{ heading() }}</h2>
          <p class="muted">{{ subtitle() }}</p>
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
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-times"
            (onClick)="cancel()"
          />
        </div>
      </header>

      <p-card>
        <div class="grid">
          <label class="field">
            <span>Bank Name<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="bank.pbankname"
              name="bankName"
              maxlength="100"
            />
            <app-validation-message [message]="errors().pbankname" />
          </label>
          <label class="field">
            <span>Branch Name<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="bank.pbranchname"
              name="branchName"
              maxlength="100"
            />
            <app-validation-message [message]="errors().pbranchname" />
          </label>
          <label class="field">
            <span>Account Name</span>
            <input
              pInputText
              [(ngModel)]="bank.paccountname"
              name="accountName"
              maxlength="100"
            />
          </label>
          <label class="field">
            <span>Account Number<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="bank.paccountnumber"
              name="accountNo"
              maxlength="20"
            />
            <app-validation-message [message]="errors().paccountnumber" />
          </label>
          <label class="field">
            <span>IFSC Code<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="bank.pifsccode"
              (ngModelChange)="onIfscChange($event)"
              name="ifsc"
              maxlength="11"
              style="text-transform: uppercase;"
            />
            <app-validation-message [message]="errors().pifsccode" />
          </label>
          <label class="field">
            <span>MICR</span>
            <input
              pInputText
              [(ngModel)]="bank.pmicrcode"
              name="micr"
              maxlength="9"
            />
          </label>
          <label class="field">
            <span>UPI ID</span>
            <input
              pInputText
              [(ngModel)]="bank.pUpiId"
              name="upi"
              maxlength="50"
            />
          </label>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .bank-master { display: flex; flex-direction: column; gap: 0.75rem; }
      .bm-h {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .bm-h h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
    `,
  ],
})
export class BankMasterComponent implements OnInit {
  private readonly api = inject(AccountingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly status = computed(() => this.api.newFormStatus());
  protected readonly editingId = computed(() => this.api.editingBankRecordId());
  protected readonly saving = signal<boolean>(false);

  protected bank: BankInformationRow = { ...EMPTY_BANK };
  protected readonly errors = signal<{
    pbankname: string;
    pbranchname: string;
    paccountnumber: string;
    pifsccode: string;
  }>({
    pbankname: '',
    pbranchname: '',
    paccountnumber: '',
    pifsccode: '',
  });

  protected readonly heading = computed(() =>
    this.editingId() ? 'Edit Bank' : 'New Bank',
  );
  protected readonly subtitle = computed(() =>
    this.editingId()
      ? `Record #${this.editingId()}`
      : 'Add a new bank account record.',
  );

  protected readonly isValid = computed(() => {
    const b = this.bank;
    return (
      !!b.pbankname &&
      !!b.pbranchname &&
      !!b.paccountnumber &&
      !!b.pifsccode &&
      IFSC_RX.test(String(b.pifsccode))
    );
  });

  ngOnInit(): void {
    const id = this.editingId();
    if (id) this.load(id);
  }

  private load(id: number): void {
    this.loader.show();
    this.api.getBank(id).subscribe({
      next: (data) => {
        if (data) this.bank = { ...EMPTY_BANK, ...data };
      },
      error: (err) => this.toast.error(err?.message ?? 'Failed to load bank'),
      complete: () => this.loader.hide(),
    });
  }

  protected onIfscChange(value: string): void {
    this.bank.pifsccode = (value ?? '').toUpperCase();
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pbankname: this.bank.pbankname ? '' : 'Bank name is required.',
        pbranchname: this.bank.pbranchname ? '' : 'Branch name is required.',
        paccountnumber: this.bank.paccountnumber
          ? ''
          : 'Account number is required.',
        pifsccode: !this.bank.pifsccode
          ? 'IFSC is required.'
          : !IFSC_RX.test(String(this.bank.pifsccode))
            ? 'IFSC must be 11 chars: 4 letters + 0 + 6 alphanumerics.'
            : '',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveBank(this.bank).subscribe({
      next: () => {
        this.toast.success(`Bank ${this.editingId() ? 'updated' : 'created'}.`);
        this.cancel();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate(['/accounting/BankView']);
  }
}
