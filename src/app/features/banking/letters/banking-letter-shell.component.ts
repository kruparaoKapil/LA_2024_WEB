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
import { InputTextModule } from 'primeng/inputtext';

import {
  DateInputComponent,
  RichEditorComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';

export type BankingLetterKind =
  | 'welcome'
  | 'cheque-submission'
  | 'default-reminder'
  | 'demand-promissory-note'
  | 'disbursement-request-form'
  | 'final-disbursement-advice'
  | 'foreclosure-prepayment-request'
  | 'loan-agreement'
  | 'loan-closing-cover'
  | 'loan-closure-certificate'
  | 'part-disbursement-advice'
  | 'sanction';

const TITLES: Record<BankingLetterKind, string> = {
  welcome: 'Welcome Letter',
  'cheque-submission': 'Cheque Submission Letter',
  'default-reminder': 'Default Reminder Letter',
  'demand-promissory-note': 'Demand Promissory Note',
  'disbursement-request-form': 'Disbursement Request Form',
  'final-disbursement-advice': 'Final Disbursement Advice',
  'foreclosure-prepayment-request': 'Foreclosure / Prepayment Request',
  'loan-agreement': 'Loan Agreement',
  'loan-closing-cover': 'Loan Closing Covering Letter',
  'loan-closure-certificate': 'Loan Closure Certificate',
  'part-disbursement-advice': 'Part Disbursement Advice',
  sanction: 'Sanction Letter (New)',
};

const TEMPLATES: Record<BankingLetterKind, string> = {
  welcome: `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>We warmly welcome you to <strong>[Company Name]</strong>. Your membership has been activated effective <strong>[Date]</strong>.</p>
    <p>Member Code: <strong>[Member Code]</strong></p>
    <p>You may now avail of our deposit, share and loan products. Please retain this letter for your records.</p>
    <br /><p>Yours sincerely,</p><p>Branch Manager</p>
  `,
  'cheque-submission': `
    <p>Dear Sir / Madam,</p>
    <p>We are submitting <strong>[Number]</strong> cheque(s) totalling <strong>₹[Amount]</strong>
    for collection / clearing. Cheque numbers and details are listed below.</p>
  `,
  'default-reminder': `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>Our records show that an installment of <strong>₹[Amount]</strong> due on <strong>[Due Date]</strong>
    against loan <strong>[Loan No]</strong> remains unpaid. Kindly clear the dues at the earliest to avoid
    penal charges.</p>
  `,
  'demand-promissory-note': `
    <p>On demand, I / we, <strong>[Member Name]</strong>, promise to pay
    <strong>[Company Name]</strong> the sum of <strong>₹[Amount]</strong> together with interest at the
    rate agreed upon, value received.</p>
    <p>Date: <strong>[Date]</strong></p><p>Place: <strong>[Place]</strong></p>
  `,
  'disbursement-request-form': `
    <p>To: The Branch Manager</p>
    <p>I, <strong>[Member Name]</strong>, having been sanctioned a loan of <strong>₹[Amount]</strong>
    against application <strong>[Application No]</strong>, request you to disburse the loan
    amount as per the agreed schedule.</p>
  `,
  'final-disbursement-advice': `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>This is to advise you that the final tranche of <strong>₹[Amount]</strong> against loan
    <strong>[Loan No]</strong> has been disbursed on <strong>[Date]</strong>. The total disbursed
    amount stands at <strong>₹[Total]</strong>.</p>
  `,
  'foreclosure-prepayment-request': `
    <p>To: The Branch Manager</p>
    <p>I, <strong>[Member Name]</strong>, request to foreclose / prepay loan <strong>[Loan No]</strong>
    on <strong>[Date]</strong>. The outstanding principal as on date is <strong>₹[Amount]</strong>.</p>
  `,
  'loan-agreement': `
    <h3>Loan Agreement</h3>
    <p>This agreement is made on <strong>[Date]</strong> between
    <strong>[Company Name]</strong> ("the Lender") and <strong>[Member Name]</strong> ("the Borrower").</p>
    <p>The Lender agrees to provide a loan of <strong>₹[Amount]</strong> at <strong>[Rate]%</strong>
    interest per annum, repayable over <strong>[Tenure]</strong> months as per the schedule attached.</p>
  `,
  'loan-closing-cover': `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>We thank you for promptly closing your loan account <strong>[Loan No]</strong>.
    The original documents are returned herewith. We wish you continued financial wellness.</p>
  `,
  'loan-closure-certificate': `
    <h3>Loan Closure Certificate</h3>
    <p>This is to certify that loan account <strong>[Loan No]</strong> in the name of
    <strong>[Member Name]</strong> has been closed in full on <strong>[Date]</strong>. No dues
    remain against the said account.</p>
  `,
  'part-disbursement-advice': `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>This is to advise you that a part disbursement of <strong>₹[Amount]</strong> against loan
    <strong>[Loan No]</strong> has been credited on <strong>[Date]</strong>. The cumulative
    disbursed amount is <strong>₹[Cumulative]</strong>.</p>
  `,
  sanction: `
    <p>Dear <strong>[Member Name]</strong>,</p>
    <p>We are pleased to inform you that your loan application has been sanctioned for
    <strong>₹[Amount]</strong> at <strong>[Rate]%</strong> interest, repayable over
    <strong>[Tenure]</strong> months. Please complete the formalities at the branch.</p>
  `,
};

interface LetterDetail {
  pMemberCode: string;
  pMemberName: string;
  pAccountNo: string;
  pLetterDate: Date | null;
  pBody: string;
  pRemarks: string;
}

const EMPTY_DETAIL: LetterDetail = {
  pMemberCode: '',
  pMemberName: '',
  pAccountNo: '',
  pLetterDate: new Date(),
  pBody: '',
  pRemarks: '',
};

/**
 * Single letter shell for the 12 banking letter screens. Replaces:
 *   - welcome-letter, cheque-submission, default-reminder-letter,
 *     demand-promsory-note, disbursement-request-form,
 *     final-disbursement-advice, foreclosure-prepayment-request-letter,
 *     loan-agreement, loan-closing-covering-letter,
 *     loan-closure-certificate, part-disbursement-advice,
 *     sanction-letter-new
 *
 * Combined LOC: ~3500. The new shell loads a default template for the
 * letter kind, lets the user edit it via `<app-rich-editor>`, and
 * prints with `window.print()` (CSS @media print hides chrome).
 *
 * Letters are persisted as part of their parent loan/deposit record
 * so this shell does not need its own backend service — it composes
 * with whatever workflow drove the user here.
 */
@Component({
  selector: 'app-banking-letter-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    InputTextModule,
    DateInputComponent,
    RichEditorComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="bl-shell">
      <header class="lh">
        <div>
          <h2>{{ title() }}</h2>
          <p class="muted">Edit, save and print the letter. Tokens like
          <code>[Member Name]</code>, <code>[Amount]</code> are replaced inline.</p>
        </div>
        <div class="actions">
          <p-button
            label="Reset to Template"
            icon="pi pi-refresh"
            severity="secondary"
            [outlined]="true"
            (onClick)="resetTemplate()"
          />
          <p-button label="Print" icon="pi pi-print" (onClick)="print()" />
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
            <span>Member Code</span>
            <input pInputText [(ngModel)]="detail.pMemberCode" name="memCode" maxlength="40" />
          </label>
          <label class="field">
            <span>Member Name</span>
            <input pInputText [(ngModel)]="detail.pMemberName" name="memName" maxlength="100" />
          </label>
          <label class="field">
            <span>Account / Loan #</span>
            <input pInputText [(ngModel)]="detail.pAccountNo" name="acc" maxlength="40" />
          </label>
          <label class="field">
            <span>Letter Date<sup>*</sup></span>
            <app-date-input [(ngModel)]="detail.pLetterDate" name="letterDate" />
            <app-validation-message [message]="errors().pLetterDate" />
          </label>
        </div>
      </p-card>

      <p-card header="Body" class="body-card">
        <div class="printable">
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
      .bl-shell { display: flex; flex-direction: column; gap: 0.75rem; }
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
      .body-card { min-height: 300px; }
      @media print {
        .lh, .actions, p-card[header='Footer'] { display: none !important; }
        .printable { font-size: 12pt; color: black; }
      }
    `,
  ],
})
export class BankingLetterShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<BankingLetterKind>('welcome');
  protected detail: LetterDetail = { ...EMPTY_DETAIL };
  protected readonly errors = signal<{ pLetterDate: string }>({
    pLetterDate: '',
  });

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Letter');

  ngOnInit(): void {
    const k = this.route.snapshot.data['letterKind'] as BankingLetterKind | undefined;
    if (k) this.kind.set(k);
    this.detail = {
      ...EMPTY_DETAIL,
      pBody: TEMPLATES[this.kind()].trim(),
    };
  }

  protected resetTemplate(): void {
    this.detail = {
      ...this.detail,
      pBody: TEMPLATES[this.kind()].trim(),
    };
  }

  protected print(): void {
    if (!this.detail.pLetterDate) {
      this.errors.set({ pLetterDate: 'Letter date is required.' });
      return;
    }
    window.print();
  }

  protected back(): void {
    void this.router.navigate(['/banking']);
  }
}
