import type { Routes } from '@angular/router';

import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Banking', screen, phase: 'Phase 9' },
});

/**
 * Banking feature routes — masters (FD/RD/Insurance/Member/Savings/Shares),
 * 25+ transactions, 60+ reports, 12 letter templates. Phase 9 wires the
 * generic shells (deposit-config, deposit-account, bank-receipt,
 * maturity, banking-letter, banking-report) to all the legacy hash
 * routes via route `data` parameters.
 */
export const BANKING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'masters',
    pathMatch: 'full',
  },

  // ============================================================
  //   M A S T E R S
  // ============================================================
  {
    path: 'masters',
    loadComponent: () =>
      import('./masters/member-view.component').then(
        (m) => m.MemberViewComponent,
      ),
  },

  // Member type (legacy: MembertypeView/MembertypeNew)
  {
    path: 'MembertypeView',
    loadComponent: () =>
      import('./masters/member-view.component').then(
        (m) => m.MemberViewComponent,
      ),
  },
  { path: 'MembertypeNew', ...placeholder('Member Type New') },

  // Member master (legacy: MemberView/MemberNew)
  {
    path: 'MemberView',
    loadComponent: () =>
      import('./masters/member-view.component').then(
        (m) => m.MemberViewComponent,
      ),
  },
  {
    path: 'MemberNew',
    loadComponent: () =>
      import('./masters/member-master.component').then(
        (m) => m.MemberMasterComponent,
      ),
  },
  {
    path: 'MemberNew/:id',
    loadComponent: () =>
      import('./masters/member-master.component').then(
        (m) => m.MemberMasterComponent,
      ),
  },

  // FD Config (legacy: FdView/FdNew)
  {
    path: 'FdView',
    loadComponent: () =>
      import('./masters/deposit-config-view.component').then(
        (m) => m.DepositConfigViewComponent,
      ),
    data: { kind: 'fd' },
  },
  {
    path: 'FdNew',
    loadComponent: () =>
      import('./masters/deposit-config-shell.component').then(
        (m) => m.DepositConfigShellComponent,
      ),
    data: { kind: 'fd' },
  },
  {
    path: 'FdNew/:id',
    loadComponent: () =>
      import('./masters/deposit-config-shell.component').then(
        (m) => m.DepositConfigShellComponent,
      ),
    data: { kind: 'fd' },
  },

  // RD Config (legacy: RdView/RdNew)
  {
    path: 'RdView',
    loadComponent: () =>
      import('./masters/deposit-config-view.component').then(
        (m) => m.DepositConfigViewComponent,
      ),
    data: { kind: 'rd' },
  },
  {
    path: 'RdNew',
    loadComponent: () =>
      import('./masters/deposit-config-shell.component').then(
        (m) => m.DepositConfigShellComponent,
      ),
    data: { kind: 'rd' },
  },
  {
    path: 'RdNew/:id',
    loadComponent: () =>
      import('./masters/deposit-config-shell.component').then(
        (m) => m.DepositConfigShellComponent,
      ),
    data: { kind: 'rd' },
  },

  // Savings / Shares / Insurance (placeholders for now)
  { path: 'SavingsView', ...placeholder('Savings Config View') },
  { path: 'SavingsNew', ...placeholder('Savings Config New') },
  { path: 'SharesConfigView', ...placeholder('Shares Config View') },
  { path: 'SharesConfigNew', ...placeholder('Shares Config New') },
  { path: 'InsuranceMemberView', ...placeholder('Insurance Member View') },
  { path: 'InsuranceMemberNew', ...placeholder('Insurance Member New') },
  { path: 'InsuranceConfigView', ...placeholder('Insurance Config View') },
  { path: 'InsuranceConfigNew', ...placeholder('Insurance Config New') },
  { path: 'LienEntry', ...placeholder('Lien Entry') },

  // ============================================================
  //   T R A N S A C T I O N S
  // ============================================================
  {
    path: 'transactions',
    loadComponent: () =>
      import('./transactions/deposit-account-view.component').then(
        (m) => m.DepositAccountViewComponent,
      ),
  },

  // FD / RD Account creation
  {
    path: 'FDACCreationView',
    loadComponent: () =>
      import('./transactions/deposit-account-view.component').then(
        (m) => m.DepositAccountViewComponent,
      ),
  },
  {
    path: 'FDACCreationNew',
    loadComponent: () =>
      import('./transactions/deposit-account-shell.component').then(
        (m) => m.DepositAccountShellComponent,
      ),
  },
  {
    path: 'FDACCreationNew/:accountNo',
    loadComponent: () =>
      import('./transactions/deposit-account-shell.component').then(
        (m) => m.DepositAccountShellComponent,
      ),
  },
  {
    path: 'RDACCreationView',
    loadComponent: () =>
      import('./transactions/deposit-account-view.component').then(
        (m) => m.DepositAccountViewComponent,
      ),
  },
  {
    path: 'RDACCreationNew',
    loadComponent: () =>
      import('./transactions/deposit-account-shell.component').then(
        (m) => m.DepositAccountShellComponent,
      ),
  },

  // Receipts (5 kinds → one shell)
  {
    path: 'FdReceiptView',
    loadComponent: () =>
      import('./transactions/bank-receipt-view.component').then(
        (m) => m.BankReceiptViewComponent,
      ),
    data: { kind: 'fd' },
  },
  {
    path: 'FdReceiptNew',
    loadComponent: () =>
      import('./transactions/bank-receipt-shell.component').then(
        (m) => m.BankReceiptShellComponent,
      ),
    data: { kind: 'fd' },
  },
  {
    path: 'RdReceiptView',
    loadComponent: () =>
      import('./transactions/bank-receipt-view.component').then(
        (m) => m.BankReceiptViewComponent,
      ),
    data: { kind: 'rd' },
  },
  {
    path: 'RdReceiptNew',
    loadComponent: () =>
      import('./transactions/bank-receipt-shell.component').then(
        (m) => m.BankReceiptShellComponent,
      ),
    data: { kind: 'rd' },
  },
  {
    path: 'SAReceipt',
    loadComponent: () =>
      import('./transactions/bank-receipt-shell.component').then(
        (m) => m.BankReceiptShellComponent,
      ),
    data: { kind: 'savings' },
  },
  {
    path: 'ShareReceipt',
    loadComponent: () =>
      import('./transactions/bank-receipt-shell.component').then(
        (m) => m.BankReceiptShellComponent,
      ),
    data: { kind: 'share' },
  },
  {
    path: 'ShareReceiptView',
    loadComponent: () =>
      import('./transactions/bank-receipt-view.component').then(
        (m) => m.BankReceiptViewComponent,
      ),
    data: { kind: 'share' },
  },
  {
    path: 'MemberReceipt',
    loadComponent: () =>
      import('./transactions/bank-receipt-shell.component').then(
        (m) => m.BankReceiptShellComponent,
      ),
    data: { kind: 'member' },
  },
  {
    path: 'MemberReceiptView',
    loadComponent: () =>
      import('./transactions/bank-receipt-view.component').then(
        (m) => m.BankReceiptViewComponent,
      ),
    data: { kind: 'member' },
  },

  // Maturity / Renewal / Interest payment / Pre-maturity
  {
    path: 'MaturityPayment',
    loadComponent: () =>
      import('./transactions/maturity-shell.component').then(
        (m) => m.MaturityShellComponent,
      ),
    data: { kind: 'maturity' },
  },
  {
    path: 'MaturityRenewal',
    loadComponent: () =>
      import('./transactions/maturity-shell.component').then(
        (m) => m.MaturityShellComponent,
      ),
    data: { kind: 'renewal' },
  },
  {
    path: 'InterestPayment',
    loadComponent: () =>
      import('./transactions/maturity-shell.component').then(
        (m) => m.MaturityShellComponent,
      ),
    data: { kind: 'interest-payment' },
  },
  {
    path: 'PreMaturity',
    loadComponent: () =>
      import('./transactions/maturity-shell.component').then(
        (m) => m.MaturityShellComponent,
      ),
    data: { kind: 'pre-maturity' },
  },

  // Bond preview / Maturity bond
  {
    path: 'BondPreview',
    loadComponent: () =>
      import('./transactions/bond-preview.component').then(
        (m) => m.BondPreviewComponent,
      ),
  },
  {
    path: 'MaturityBond',
    loadComponent: () =>
      import('./transactions/bond-preview.component').then(
        (m) => m.BondPreviewComponent,
      ),
  },

  // Misc transactions (placeholders for now)
  { path: 'CommissionPayment', ...placeholder('Commission Payment') },
  { path: 'LienRelease', ...placeholder('Lien Release') },
  { path: 'Transfer', ...placeholder('FD Transfer') },
  { path: 'SelfAdjustment', ...placeholder('Self Adjustment') },
  { path: 'SAWithdrawal', ...placeholder('SA Withdrawal') },
  { path: 'ShareApplication', ...placeholder('Share Application') },
  { path: 'ShareWithdrawal', ...placeholder('Share Withdrawal') },

  // ============================================================
  //   L E T T E R S   (12)
  // ============================================================
  {
    path: 'WelcomeLetter',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'welcome' },
  },
  {
    path: 'ChequeSubmissionLetter',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'cheque-submission' },
  },
  {
    path: 'DefaultReminderLetter',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'default-reminder' },
  },
  {
    path: 'DemandPromsoryNote',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'demand-promissory-note' },
  },
  {
    path: 'DisbursementRequestForm',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'disbursement-request-form' },
  },
  {
    path: 'FinalDisbursementAdvice',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'final-disbursement-advice' },
  },
  {
    path: 'ForeclosurePrepaymentRequest',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'foreclosure-prepayment-request' },
  },
  {
    path: 'LoanAgreement',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'loan-agreement' },
  },
  {
    path: 'LoanClosingCoveringLetter',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'loan-closing-cover' },
  },
  {
    path: 'LoanClosureCertificate',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'loan-closure-certificate' },
  },
  {
    path: 'PartDisbursementAdvice',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'part-disbursement-advice' },
  },
  {
    path: 'SanctionLetterNew',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'sanction' },
  },
  {
    path: 'letters',
    loadComponent: () =>
      import('./letters/banking-letter-shell.component').then(
        (m) => m.BankingLetterShellComponent,
      ),
    data: { letterKind: 'welcome' },
  },

  // ============================================================
  //   R E P O R T S   (25 kinds via one shell)
  // ============================================================
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'interest-payment' },
  },
  {
    path: 'InterestPaymentReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'interest-payment' },
  },
  {
    path: 'InterestTrendReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'interest-trend' },
  },
  {
    path: 'MaturityTrendReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'maturity-trend' },
  },
  {
    path: 'MaturityIntimationReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'maturity-intimation' },
  },
  {
    path: 'PreMaturityReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'pre-maturity' },
  },
  {
    path: 'PreMaturityMonthwise',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'pre-maturity-monthwise' },
  },
  {
    path: 'LienReleaseReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'lien-release' },
  },
  {
    path: 'SelfAdjustmentReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'self-adjustment' },
  },
  {
    path: 'MemberWiseReceiptsReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'member-wise-receipts' },
  },
  {
    path: 'BranchWiseReceiptsReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'branch-wise-receipts' },
  },
  {
    path: 'AgentPointsReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'agent-points' },
  },
  {
    path: 'AgentBusinessReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'agent-business' },
  },
  {
    path: 'TargetReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'target' },
  },
  {
    path: 'CashFlowReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'cash-flow' },
  },
  {
    path: 'ApplicationFormReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'application-form' },
  },
  {
    path: 'MemberEnquiry',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'member-enquiry' },
  },
  {
    path: 'MemberDetailsReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'member-details' },
  },
  {
    path: 'ShareIssueReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'share-issue' },
  },
  {
    path: 'SavingsAccountReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'savings-account' },
  },
  {
    path: 'ShareSavingsWithdrawReport',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'share-savings-withdraw' },
  },
  {
    path: 'ProductionSummary',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'production-summary' },
  },
  {
    path: 'ProductionAchieved',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'production-achieved' },
  },
  {
    path: 'ProductionTarget',
    loadComponent: () =>
      import('./reports/banking-report-shell.component').then(
        (m) => m.BankingReportShellComponent,
      ),
    data: { reportKind: 'production-target' },
  },
];
