import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Accounting', screen, phase: 'Phase 8' },
});

export const ACCOUNTING_ROUTES: Routes = [
  // -------- masters --------
  {
    path: 'BankView',
    loadComponent: () =>
      import('./masters/bank-view.component').then((m) => m.BankViewComponent),
  },
  {
    path: 'BankMaster',
    loadComponent: () =>
      import('./masters/bank-master.component').then((m) => m.BankMasterComponent),
  },
  {
    path: 'AccountTree',
    loadComponent: () =>
      import('./masters/account-tree.component').then((m) => m.AccountTreeComponent),
  },
  {
    path: 'HsnCodes',
    loadComponent: () =>
      import('./masters/hsn-codes.component').then((m) => m.HsnCodesComponent),
  },
  // Cheque management & sub-category remain placeholders until requested.
  { path: 'AccountsView', ...placeholder('Accounts View') },
  { path: 'AccountsMaster', ...placeholder('Accounts Master') },
  { path: 'ChequemanagementView', ...placeholder('Cheque Management View') },
  { path: 'ChequemanagementMaster', ...placeholder('Cheque Management Master') },
  { path: 'SubCategory', ...placeholder('Sub Category') },

  // -------- transactions: vouchers --------
  {
    path: 'PaymentvoucherView',
    loadComponent: () =>
      import('./vouchers/voucher-view.component').then((m) => m.VoucherViewComponent),
    data: { voucherKind: 'payment' },
  },
  {
    path: 'PaymentvoucherNew',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'payment' },
  },
  {
    path: 'PaymentvoucherNew/:id',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'payment' },
  },
  {
    path: 'GeneralreceiptView',
    loadComponent: () =>
      import('./vouchers/voucher-view.component').then((m) => m.VoucherViewComponent),
    data: { voucherKind: 'receipt' },
  },
  {
    path: 'GeneralreceiptNew',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'receipt' },
  },
  {
    path: 'GeneralreceiptNew/:id',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'receipt' },
  },
  {
    path: 'JournalvoucherView',
    loadComponent: () =>
      import('./vouchers/voucher-view.component').then((m) => m.VoucherViewComponent),
    data: { voucherKind: 'journal' },
  },
  {
    path: 'JournalvoucherNew',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'journal' },
  },
  {
    path: 'JournalvoucherNew/:id',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'journal' },
  },
  {
    path: 'TdsPaymentvoucherView',
    loadComponent: () =>
      import('./vouchers/voucher-view.component').then((m) => m.VoucherViewComponent),
    data: { voucherKind: 'tdsPayment' },
  },
  {
    path: 'TDSPaymentvoucher',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'tdsPayment' },
  },
  {
    path: 'TDSPaymentvoucher/:id',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'tdsPayment' },
  },
  {
    path: 'GstVoucher',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'gstPayment' },
  },
  {
    path: 'GstpaymentVocher',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'gstPayment' },
  },
  {
    path: 'FundTransfer',
    loadComponent: () =>
      import('./vouchers/voucher-shell.component').then((m) => m.VoucherShellComponent),
    data: { voucherKind: 'fundTransfer' },
  },
  {
    path: 'PendingFundTransfer',
    loadComponent: () =>
      import('./vouchers/voucher-view.component').then((m) => m.VoucherViewComponent),
    data: { voucherKind: 'fundTransfer' },
  },

  // -------- transactions: cheques --------
  {
    path: 'ChequesonHandNew',
    loadComponent: () =>
      import('./cheques/cheques-shell.component').then((m) => m.ChequesShellComponent),
    data: { bucket: 'OnHand' },
  },
  {
    path: 'ChequesIssuedNew',
    loadComponent: () =>
      import('./cheques/cheques-shell.component').then((m) => m.ChequesShellComponent),
    data: { bucket: 'Issued' },
  },
  {
    path: 'ChequesinBankNew',
    loadComponent: () =>
      import('./cheques/cheques-shell.component').then((m) => m.ChequesShellComponent),
    data: { bucket: 'InBank' },
  },

  // -------- reports --------
  ...[
    { path: 'DayBook', kind: 'dayBook' },
    { path: 'CashBook', kind: 'cashBook' },
    { path: 'BankBook', kind: 'bankBook' },
    { path: 'TrialBalance', kind: 'trialBalance' },
    { path: 'ProfitAndLoss', kind: 'profitLoss' },
    { path: 'BalanceSheet', kind: 'balanceSheet' },
    { path: 'ComparisionTrialBalance', kind: 'comparisonTb' },
    { path: 'AccountLedger', kind: 'accountLedger' },
    { path: 'PartyLedger', kind: 'partyLedger' },
    { path: 'LedgerExtract', kind: 'ledgerSummary' },
    { path: 'AccountLedgerMigration', kind: 'ledgerMigration' },
    { path: 'GstReportNew', kind: 'gstReport' },
    { path: 'JvList', kind: 'jvList' },
    { path: 'JournalvoucherReport', kind: 'jvList' },
    { path: 'PaymentVoucherReports', kind: 'paymentVoucherReport' },
    { path: 'GeneralReceiptReports', kind: 'receiptVoucherReport' },
    { path: 'TdsPaymentVoucherReports', kind: 'tdsPaymentVoucherReport' },
    { path: 'SubaccountLedgerreports', kind: 'subaccountLedger' },
    { path: 'SubledgerSummary', kind: 'subledgerSummary' },
    { path: 'AgeingReport', kind: 'agedReceivables' },
  ].flatMap((r) => [
    {
      path: r.path,
      loadComponent: () =>
        import('./reports/accounting-report-shell.component').then(
          (m) => m.AccountingReportShellComponent,
        ),
      data: { reportKind: r.kind },
    },
    {
      path: `${r.path}/:id`,
      loadComponent: () =>
        import('./reports/accounting-report-shell.component').then(
          (m) => m.AccountingReportShellComponent,
        ),
      data: { reportKind: r.kind },
    },
  ]),

  // -------- still-placeholder reports --------
  { path: 'BRStatment', ...placeholder('Bank Recon Statement') },
  { path: 'BRStatmentNew', ...placeholder('Bank Recon Statement (New)') },
  { path: 'ChequeEnquiry', ...placeholder('Cheque Enquiry') },
  { path: 'ChequeCancel', ...placeholder('Cheque Cancel') },
  { path: 'ChequeReturn', ...placeholder('Cheque Return') },
  { path: 'IssuedCheque', ...placeholder('Issued Cheque') },
  { path: 'BrsReports', ...placeholder('BRS Reports') },
  { path: 'BRSPreview', ...placeholder('BRS Preview') },
  { path: 'BRSPreview/:id', ...placeholder('BRS Preview') },

  // top-level slugs kept for backwards compat
  { path: 'masters', ...placeholder('Accounting Masters') },
  { path: 'transactions', ...placeholder('Accounting Transactions') },
  { path: 'reports', ...placeholder('Accounting Reports') },
];
