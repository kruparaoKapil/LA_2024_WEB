import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Banking', screen, phase: 'Phase 9' },
});

/**
 * Banking feature routes — masters (FD/RD/Insurance/Member/Savings/Shares),
 * transactions, 60+ reports, 12 letter templates. Routes resolve to the
 * placeholder component until Phase 9.
 */
export const BANKING_ROUTES: Routes = [
  { path: 'masters', ...placeholder('Banking Masters') },
  { path: 'transactions', ...placeholder('Banking Transactions') },
  { path: 'reports', ...placeholder('Banking Reports') },
  { path: 'letters', ...placeholder('Banking Letters') },

  // masters
  { path: 'MembertypeView', ...placeholder('Member Type View') },
  { path: 'MembertypeNew', ...placeholder('Member Type New') },
  { path: 'MemberView', ...placeholder('Member View') },
  { path: 'MemberNew', ...placeholder('Member New') },
  { path: 'MemberNew/:id', ...placeholder('Member New') },
  { path: 'FdView', ...placeholder('FD Config View') },
  { path: 'FdNew', ...placeholder('FD Config New') },
  { path: 'FdNew/:id', ...placeholder('FD Config New') },
  { path: 'RdView', ...placeholder('RD Config View') },
  { path: 'RdNew', ...placeholder('RD Config New') },
  { path: 'RdNew/:id', ...placeholder('RD Config New') },
  { path: 'SavingsView', ...placeholder('Savings Config View') },
  { path: 'SavingsNew', ...placeholder('Savings Config New') },
  { path: 'SharesConfigView', ...placeholder('Shares Config View') },
  { path: 'SharesConfigNew', ...placeholder('Shares Config New') },
  { path: 'InsuranceMemberView', ...placeholder('Insurance Member View') },
  { path: 'InsuranceMemberNew', ...placeholder('Insurance Member New') },
  { path: 'InsuranceConfigView', ...placeholder('Insurance Config View') },
  { path: 'InsuranceConfigNew', ...placeholder('Insurance Config New') },

  // transactions (subset — full list ports in Phase 9)
  { path: 'FdReceiptView', ...placeholder('FD Receipt View') },
  { path: 'FdReceiptNew', ...placeholder('FD Receipt New') },
  { path: 'RdReceiptView', ...placeholder('RD Receipt View') },
  { path: 'RdReceiptNew', ...placeholder('RD Receipt New') },
  { path: 'SAReceipt', ...placeholder('SA Receipt') },
  { path: 'MemberReceipt', ...placeholder('Member Receipt') },
  { path: 'MemberReceiptView', ...placeholder('Member Receipt View') },
  { path: 'ShareReceipt', ...placeholder('Share Receipt') },
  { path: 'ShareReceiptView', ...placeholder('Share Receipt View') },
  { path: 'MaturityPayment', ...placeholder('Maturity Payment') },
  { path: 'MaturityBond', ...placeholder('Maturity Bond') },
  { path: 'InterestPayment', ...placeholder('Interest Payment') },
  { path: 'CommissionPayment', ...placeholder('Commission Payment') },
  { path: 'LienEntry', ...placeholder('Lien Entry') },
  { path: 'LienRelease', ...placeholder('Lien Release') },

  // letters
  { path: 'WelcomeLetter', ...placeholder('Welcome Letter') },
  { path: 'DefaultReminderLetter', ...placeholder('Default Reminder Letter') },
  { path: 'LoanAgreement', ...placeholder('Loan Agreement') },
  { path: 'DemandPromsoryNote', ...placeholder('Demand Promissory Note') },
  { path: 'ChequeSubmissionLetter', ...placeholder('Cheque Submission Letter') },
];
