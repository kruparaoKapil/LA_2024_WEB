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
import { InputTextModule } from 'primeng/inputtext';

import {
  CurrencyInputComponent,
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  BankReceiptsService,
  type BankReceiptKind,
} from '../services/bank-receipts.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<BankReceiptKind, string> = {
  fd: 'FD Receipt',
  rd: 'RD Receipt',
  savings: 'Savings A/C Receipt',
  share: 'Share Receipt',
  member: 'Member Receipt',
};

const VIEW_ROUTE: Record<BankReceiptKind, string> = {
  fd: '/banking/FdReceiptView',
  rd: '/banking/RdReceiptView',
  savings: '/banking/SAReceipt',
  share: '/banking/ShareReceiptView',
  member: '/banking/MemberReceiptView',
};

const PAY_MODE_OPTIONS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'NEFT/RTGS', value: 'NEFT' },
  { label: 'UPI', value: 'UPI' },
];

interface BankReceiptForm {
  pReceiptId?: number;
  pReceiptNo?: string;
  pReceiptDate: Date | null;
  pBranchName: string;
  pMemberCode: string;
  pMemberName: string;
  pMemberType: string;
  pAccountNo: string;
  pAccountId: number | null;
  pAmount: number | null;
  pMode: string;
  pChequeNo?: string;
  pChequeDate?: Date | null;
  pBankName?: string;
  pUpiTransactionRef?: string;
  pNarration: string;
  ptypeofoperation: string;
  [key: string]: unknown;
}

const EMPTY_FORM: BankReceiptForm = {
  pReceiptDate: new Date(),
  pBranchName: '',
  pMemberCode: '',
  pMemberName: '',
  pMemberType: '',
  pAccountNo: '',
  pAccountId: null,
  pAmount: null,
  pMode: 'CASH',
  pChequeNo: '',
  pChequeDate: null,
  pBankName: '',
  pUpiTransactionRef: '',
  pNarration: '',
  ptypeofoperation: 'CREATE',
};

interface MemberOption {
  pMemberCode: string;
  pMemberName: string;
  pMemberType: string;
  [key: string]: unknown;
}

interface AccountOption {
  pAccountId?: number;
  pAccountNo: string;
  pSchemeName?: string;
  [key: string]: unknown;
}

interface BranchOption {
  pBranchName: string;
  [key: string]: unknown;
}

/**
 * Single receipt new/edit shell for FD / RD / Savings / Share / Member
 * receipts. Replaces the legacy:
 *   - FdReceipt {view, new}      (~620 LOC)
 *   - RdReceipt {view, new}      (~590 LOC)
 *   - SaReceipt + ShareReceipt   (~700 LOC, savings+share share a folder)
 *   - MemberReceipt              (~480 LOC)
 *
 * Total: ~2400 LOC of legacy components → one signal-driven shell
 * parameterised by `data.kind`.
 */
@Component({
  selector: 'app-bank-receipt-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CurrencyInputComponent,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="br-shell">
      <header class="rh">
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
            <span>Receipt Date<sup>*</sup></span>
            <app-date-input
              [(ngModel)]="form.pReceiptDate"
              name="receiptDate"
              [maxDate]="today"
            />
          </label>
          <label class="field">
            <span>Branch<sup>*</sup></span>
            <app-select
              [options]="branches()"
              optionLabel="pBranchName"
              optionValue="pBranchName"
              [(ngModel)]="form.pBranchName"
              (ngModelChange)="onBranchChange()"
            />
          </label>
          <label class="field">
            <span>Member<sup>*</sup></span>
            <app-select
              [options]="members()"
              optionLabel="pMemberName"
              optionValue="pMemberCode"
              [(ngModel)]="form.pMemberCode"
              (ngModelChange)="onMemberChange()"
            />
            <app-validation-message [message]="errors().pMemberCode" />
          </label>
          <label class="field">
            <span>Account<sup>*</sup></span>
            <app-select
              [options]="accounts()"
              optionLabel="pAccountNo"
              optionValue="pAccountNo"
              [(ngModel)]="form.pAccountNo"
              (ngModelChange)="onAccountChange()"
            />
            <app-validation-message [message]="errors().pAccountNo" />
          </label>
          <label class="field">
            <span>Amount<sup>*</sup></span>
            <app-currency-input [(ngModel)]="form.pAmount" name="amount" />
            <app-validation-message [message]="errors().pAmount" />
          </label>
          <label class="field">
            <span>Mode<sup>*</sup></span>
            <app-select
              [options]="payModeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="form.pMode"
              [showClear]="false"
            />
          </label>
          <ng-container *ngIf="form.pMode === 'CHEQUE'">
            <label class="field">
              <span>Cheque #</span>
              <input pInputText [(ngModel)]="form.pChequeNo" name="chq" maxlength="20" />
            </label>
            <label class="field">
              <span>Cheque Date</span>
              <app-date-input [(ngModel)]="form.pChequeDate" name="chqDate" />
            </label>
            <label class="field">
              <span>Bank</span>
              <input pInputText [(ngModel)]="form.pBankName" name="bank" maxlength="100" />
            </label>
          </ng-container>
          <ng-container *ngIf="form.pMode === 'UPI' || form.pMode === 'NEFT'">
            <label class="field">
              <span>{{ form.pMode === 'UPI' ? 'UPI Reference' : 'Transaction Reference' }}</span>
              <input pInputText [(ngModel)]="form.pUpiTransactionRef" name="ref" maxlength="60" />
            </label>
          </ng-container>
          <label class="field span-3">
            <span>Narration</span>
            <input pInputText [(ngModel)]="form.pNarration" name="nar" maxlength="200" />
          </label>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .br-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      .rh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .rh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-3 { grid-column: span 3; }
    `,
  ],
})
export class BankReceiptShellComponent implements OnInit {
  private readonly api = inject(BankReceiptsService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly payModeOptions = PAY_MODE_OPTIONS;

  protected readonly kind = signal<BankReceiptKind>('fd');
  protected readonly branches = signal<BranchOption[]>([]);
  protected readonly members = signal<MemberOption[]>([]);
  protected readonly accounts = signal<AccountOption[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected form: BankReceiptForm = { ...EMPTY_FORM };
  protected readonly errors = signal<{
    pMemberCode: string;
    pAccountNo: string;
    pAmount: string;
  }>({ pMemberCode: '', pAccountNo: '', pAmount: '' });

  protected readonly heading = computed(() => `${TITLES[this.kind()]} – New`);
  protected readonly subtitle = computed(() => {
    switch (this.kind()) {
      case 'fd':
        return 'Receive an interest payout / partial against a fixed deposit.';
      case 'rd':
        return 'Receive an installment against a recurring deposit.';
      case 'savings':
        return 'Receive a deposit into a savings account.';
      case 'share':
        return 'Receive a share contribution.';
      case 'member':
        return 'Receive a generic member receipt.';
    }
  });

  protected readonly isValid = computed(() => {
    const f = this.form;
    return !!f.pMemberCode && !!f.pAccountNo && !!f.pAmount && f.pAmount > 0;
  });

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as BankReceiptKind | undefined;
    if (k) this.kind.set(k);
    this.api.getFdBranches().subscribe({
      next: (rows) => this.branches.set((rows as BranchOption[]) ?? []),
    });
    if (this.kind() === 'savings') {
      this.api.getSavingsAccountNames().subscribe({
        next: (rows) => this.accounts.set((rows as AccountOption[]) ?? []),
      });
    } else if (this.kind() === 'share') {
      this.api.getShareAccountNames().subscribe({
        next: (rows) => this.accounts.set((rows as AccountOption[]) ?? []),
      });
    }
  }

  protected onBranchChange(): void {
    if (!this.form.pBranchName) return;
    this.api
      .getMemberDetails(this.form.pMemberType || '', this.form.pBranchName)
      .subscribe({
        next: (rows) => this.members.set((rows as MemberOption[]) ?? []),
      });
  }

  protected onMemberChange(): void {
    const member = this.members().find(
      (m) => m.pMemberCode === this.form.pMemberCode,
    );
    if (member) {
      this.form.pMemberName = member.pMemberName;
      this.form.pMemberType = member.pMemberType;
    }
    if (this.kind() === 'fd' || this.kind() === 'rd' || this.kind() === 'member') {
      this.api
        .getFdAccountsByMember(this.form.pMemberCode, this.form.pBranchName)
        .subscribe({
          next: (rows) => this.accounts.set((rows as AccountOption[]) ?? []),
        });
    }
  }

  protected onAccountChange(): void {
    const acc = this.accounts().find(
      (a) => a.pAccountNo === this.form.pAccountNo,
    );
    if (!acc) return;
    this.form.pAccountId = acc.pAccountId ?? null;
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pMemberCode: this.form.pMemberCode ? '' : 'Member is required.',
        pAccountNo: this.form.pAccountNo ? '' : 'Account is required.',
        pAmount:
          this.form.pAmount && this.form.pAmount > 0
            ? ''
            : 'Amount must be > 0.',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveByKind(this.kind(), this.form).subscribe({
      next: () => {
        this.toast.success(`${TITLES[this.kind()]} saved.`);
        this.cancel();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate([VIEW_ROUTE[this.kind()]]);
  }
}
