import type { Routes } from '@angular/router';

import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Loans', screen, phase: 'Phase 7' },
});

/**
 * Loans feature routes. Each path mirrors the legacy hash route name where
 * possible so existing user bookmarks (e.g. `#/Fiindividual`) keep working.
 *
 * Components hot-swap to real implementations as Phase 7 progresses. Until
 * then, routes resolve to {@link FeaturePlaceholderComponent}.
 */
export const LOANS_ROUTES: Routes = [
  // landing pages off the sidebar
  { path: 'masters', ...placeholder('Loans Masters') },
  { path: 'transactions', ...placeholder('Loans Transactions') },
  { path: 'reports', ...placeholder('Loans Reports') },

  // -------- Phase 7A: real masters --------
  {
    path: 'ChargesMaster',
    loadComponent: () =>
      import('./charges/charges.component').then((m) => m.ChargesComponent),
  },
  {
    path: 'Documents',
    loadComponent: () =>
      import('./documents/documents.component').then((m) => m.DocumentsComponent),
  },
  {
    path: 'SchemeView',
    loadComponent: () =>
      import('./scheme/scheme.component').then((m) => m.SchemeComponent),
  },
  {
    path: 'SchemeMaster',
    loadComponent: () =>
      import('./scheme/scheme.component').then((m) => m.SchemeComponent),
  },
  {
    path: 'PreclosureView',
    loadComponent: () =>
      import('./preclosure/preclosure.component').then(
        (m) => m.PreclosureComponent,
      ),
  },
  {
    path: 'PreclosureMaster',
    loadComponent: () =>
      import('./preclosure/preclosure.component').then(
        (m) => m.PreclosureComponent,
      ),
  },

  // -------- still placeholders --------
  { path: 'LoansMaster', ...placeholder('Loans Master (multi-tab)') },
  { path: 'ChargeconfigurationView', ...placeholder('Charge Configuration View') },
  { path: 'ChargeconfigurationMaster', ...placeholder('Charge Configuration Master') },
  { path: 'ContactForm', ...placeholder('Contact Form') },
  { path: 'ContactMore', ...placeholder('Contact More') },
  { path: 'ContactMoreNew', ...placeholder('Contact More (New)') },
  { path: 'ContactNew', ...placeholder('Contact New') },
  { path: 'ContactNewViewDetailed', ...placeholder('Contact View — Detailed') },
  { path: 'ContactViewNew', ...placeholder('Contact View (New)') },
  { path: 'ContactView', ...placeholder('Contact View') },
  { path: 'ContactIndividual', ...placeholder('Contact Individual') },
  { path: 'ContactBusiness', ...placeholder('Contact Business') },
  { path: 'LoansCreation', ...placeholder('Loan Creation') },

  // FI Individual (multi-step form, biggest feature)
  { path: 'FiView', ...placeholder('FI View') },
  { path: 'Fiindividual', ...placeholder('FI Individual') },
  { path: 'Fiindividual/:id', ...placeholder('FI Individual') },

  // verification + approval + disbursement flow
  { path: 'VerificationView', ...placeholder('Verification View') },
  { path: 'VerificationNew', ...placeholder('Verification New') },
  { path: 'VerificationNew/:id', ...placeholder('Verification New') },
  { path: 'Televerification', ...placeholder('Tele Verification') },
  { path: 'Televerification/:id', ...placeholder('Tele Verification') },
  { path: 'Documentverification', ...placeholder('Document Verification') },
  { path: 'Documentverification/:id', ...placeholder('Document Verification') },
  { path: 'Fieldverification', ...placeholder('Field Verification') },
  { path: 'Fieldverification/:id', ...placeholder('Field Verification') },
  { path: 'AprovalView', ...placeholder('Approval View') },
  { path: 'AprovalNew', ...placeholder('Approval New') },
  { path: 'AprovalNew/:id', ...placeholder('Approval New') },
  { path: 'DisbursementView', ...placeholder('Disbursement View') },
  { path: 'DisbursementNew', ...placeholder('Disbursement New') },
  { path: 'DisbursementNew/:id', ...placeholder('Disbursement New') },

  // receipts + closure + moratorium
  { path: 'LoanreceiptView', ...placeholder('Loan Receipt View') },
  { path: 'LoanreceiptNew', ...placeholder('Loan Receipt New') },
  { path: 'LoanreceiptNew/:id', ...placeholder('Loan Receipt New') },
  { path: 'LoanpreclosureView', ...placeholder('Loan Preclosure View') },
  { path: 'LoanpreclosureNew', ...placeholder('Loan Preclosure New') },
  { path: 'PartPayment', ...placeholder('Part Payment') },
  { path: 'PartPaymentView', ...placeholder('Part Payment View') },
  { path: 'Moratorium', ...placeholder('Moratorium') },
  { path: 'MoratoriumView', ...placeholder('Moratorium View') },

  // letters & reports
  { path: 'DeliveryorderNew', ...placeholder('Delivery Order') },
  { path: 'DeliveryorderNew/:id', ...placeholder('Delivery Order') },
  { path: 'AcknowledgementsNew', ...placeholder('Acknowledgements') },
  { path: 'AcknowledgementsNew/:id', ...placeholder('Acknowledgements') },
  { path: 'SanctionLetter', ...placeholder('Sanction Letter') },
  { path: 'SanctionLetter/:id', ...placeholder('Sanction Letter') },
  { path: 'DisburementLetter', ...placeholder('Disbursement Letter') },
  { path: 'DisburementLetter/:id', ...placeholder('Disbursement Letter') },
  { path: 'CollectionsReport', ...placeholder('Collections Report') },
  { path: 'CollectionsReport/:id', ...placeholder('Collections Report') },
  { path: 'Duereports', ...placeholder('Due Reports') },
  { path: 'Duereports/:id', ...placeholder('Due Reports') },
  { path: 'DisbursmentReports', ...placeholder('Disbursement Reports') },
  { path: 'DisbursmentReports/:id', ...placeholder('Disbursement Reports') },
  { path: 'LoanStatement', ...placeholder('Loan Statement') },
  { path: 'LoanStatement/:id', ...placeholder('Loan Statement') },
  { path: 'EmiChartView', ...placeholder('EMI Chart View') },
  { path: 'EmiChartReport', ...placeholder('EMI Chart Report') },
  { path: 'EmiChartReport/:id', ...placeholder('EMI Chart Report') },
];
