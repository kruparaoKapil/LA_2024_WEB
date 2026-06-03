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
  // -------- Phase 7B: contact list + FI Individual shell --------
  {
    path: 'ContactView',
    loadComponent: () =>
      import('./contact/contact-view.component').then(
        (m) => m.ContactViewComponent,
      ),
  },
  {
    path: 'ContactViewNew',
    loadComponent: () =>
      import('./contact/contact-view.component').then(
        (m) => m.ContactViewComponent,
      ),
  },
  { path: 'ContactForm', ...placeholder('Contact Form') },
  { path: 'ContactMore', ...placeholder('Contact More') },
  { path: 'ContactMoreNew', ...placeholder('Contact More (New)') },
  { path: 'ContactNew', ...placeholder('Contact New') },
  { path: 'ContactNewViewDetailed', ...placeholder('Contact View — Detailed') },
  { path: 'ContactIndividual', ...placeholder('Contact Individual') },
  { path: 'ContactBusiness', ...placeholder('Contact Business') },
  { path: 'LoansCreation', ...placeholder('Loan Creation') },

  // FI Individual (multi-step form, biggest feature)
  {
    path: 'FiView',
    loadComponent: () =>
      import('./fi-individual/fi-individual-view.component').then(
        (m) => m.FIIndividualViewComponent,
      ),
  },
  {
    path: 'fi-individual',
    loadComponent: () =>
      import('./fi-individual/fi-individual-view.component').then(
        (m) => m.FIIndividualViewComponent,
      ),
  },
  {
    path: 'fi-individual/new',
    loadComponent: () =>
      import('./fi-individual/fi-individual-shell.component').then(
        (m) => m.FIIndividualShellComponent,
      ),
  },
  {
    path: 'fi-individual/:applicationId',
    loadComponent: () =>
      import('./fi-individual/fi-individual-shell.component').then(
        (m) => m.FIIndividualShellComponent,
      ),
  },
  {
    path: 'Fiindividual',
    loadComponent: () =>
      import('./fi-individual/fi-individual-shell.component').then(
        (m) => m.FIIndividualShellComponent,
      ),
  },
  {
    path: 'Fiindividual/:applicationId',
    loadComponent: () =>
      import('./fi-individual/fi-individual-shell.component').then(
        (m) => m.FIIndividualShellComponent,
      ),
  },

  // -------- Phase 7C: verification + approval + disbursement flow --------
  // Tele verification
  {
    path: 'TeleverificationView',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Tele' },
  },
  {
    path: 'Televerification',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Tele' },
  },
  {
    path: 'Televerification/:applicationId',
    loadComponent: () =>
      import('./verification/verification-shell.component').then(
        (m) => m.VerificationShellComponent,
      ),
    data: { kind: 'Tele' },
  },
  // Document verification
  {
    path: 'DocumentverificationView',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Document' },
  },
  {
    path: 'Documentverification',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Document' },
  },
  {
    path: 'Documentverification/:applicationId',
    loadComponent: () =>
      import('./verification/verification-shell.component').then(
        (m) => m.VerificationShellComponent,
      ),
    data: { kind: 'Document' },
  },
  // Field verification
  {
    path: 'FieldverificationView',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Field' },
  },
  {
    path: 'Fieldverification',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Field' },
  },
  {
    path: 'Fieldverification/:applicationId',
    loadComponent: () =>
      import('./verification/verification-shell.component').then(
        (m) => m.VerificationShellComponent,
      ),
    data: { kind: 'Field' },
  },
  // Generic VerificationView (legacy hash routed here too)
  {
    path: 'VerificationView',
    loadComponent: () =>
      import('./verification/verification-view.component').then(
        (m) => m.VerificationViewComponent,
      ),
    data: { kind: 'Tele' },
  },
  {
    path: 'VerificationNew',
    loadComponent: () =>
      import('./verification/verification-shell.component').then(
        (m) => m.VerificationShellComponent,
      ),
    data: { kind: 'Tele' },
  },
  {
    path: 'VerificationNew/:applicationId',
    loadComponent: () =>
      import('./verification/verification-shell.component').then(
        (m) => m.VerificationShellComponent,
      ),
    data: { kind: 'Tele' },
  },

  // Approval
  {
    path: 'ApprovalView',
    loadComponent: () =>
      import('./approval/approval-view.component').then(
        (m) => m.ApprovalViewComponent,
      ),
  },
  {
    path: 'AprovalView',
    loadComponent: () =>
      import('./approval/approval-view.component').then(
        (m) => m.ApprovalViewComponent,
      ),
  },
  {
    path: 'AprovalNew',
    loadComponent: () =>
      import('./approval/approval-shell.component').then(
        (m) => m.ApprovalShellComponent,
      ),
  },
  {
    path: 'AprovalNew/:applicationId',
    loadComponent: () =>
      import('./approval/approval-shell.component').then(
        (m) => m.ApprovalShellComponent,
      ),
  },
  {
    path: 'Approval/:applicationId',
    loadComponent: () =>
      import('./approval/approval-shell.component').then(
        (m) => m.ApprovalShellComponent,
      ),
  },

  // Disbursement
  {
    path: 'DisbursementView',
    loadComponent: () =>
      import('./disbursement/disbursement-view.component').then(
        (m) => m.DisbursementViewComponent,
      ),
  },
  {
    path: 'DisbursmentView',
    loadComponent: () =>
      import('./disbursement/disbursement-view.component').then(
        (m) => m.DisbursementViewComponent,
      ),
  },
  {
    path: 'DisbursementNew',
    loadComponent: () =>
      import('./disbursement/disbursement-shell.component').then(
        (m) => m.DisbursementShellComponent,
      ),
  },
  {
    path: 'DisbursementNew/:applicationId',
    loadComponent: () =>
      import('./disbursement/disbursement-shell.component').then(
        (m) => m.DisbursementShellComponent,
      ),
  },
  {
    path: 'Disbursment/:applicationId',
    loadComponent: () =>
      import('./disbursement/disbursement-shell.component').then(
        (m) => m.DisbursementShellComponent,
      ),
  },

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
