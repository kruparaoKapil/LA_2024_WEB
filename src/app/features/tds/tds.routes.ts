import type { Routes } from '@angular/router';

import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'TDS', screen, phase: 'Phase 10 follow-up' },
});

export const TDS_ROUTES: Routes = [
  { path: '', redirectTo: 'TdsReport', pathMatch: 'full' },

  {
    path: 'PanUpdate',
    loadComponent: () =>
      import('./masters/pan-update.component').then((m) => m.PanUpdateComponent),
  },
  {
    path: 'PanValidation',
    loadComponent: () =>
      import('./masters/pan-validation.component').then(
        (m) => m.PanValidationComponent,
      ),
  },
  {
    path: 'Form15h',
    loadComponent: () =>
      import('./masters/tds-form-shell.component').then(
        (m) => m.TdsFormShellComponent,
      ),
    data: { formKind: 'form15h' },
  },
  {
    path: 'Form121',
    loadComponent: () =>
      import('./masters/tds-form-shell.component').then(
        (m) => m.TdsFormShellComponent,
      ),
    data: { formKind: 'form121' },
  },
  {
    path: 'Form15hreprint',
    loadComponent: () =>
      import('./masters/tds-form-shell.component').then(
        (m) => m.TdsFormShellComponent,
      ),
    data: { formKind: 'form15h-reprint' },
  },
  {
    path: 'Form121Reprint',
    loadComponent: () =>
      import('./masters/tds-form-shell.component').then(
        (m) => m.TdsFormShellComponent,
      ),
    data: { formKind: 'form121-reprint' },
  },

  {
    path: 'TdsReport',
    loadComponent: () =>
      import('./reports/tds-report-shell.component').then(
        (m) => m.TdsReportShellComponent,
      ),
    data: { reportKind: 'tds-report' },
  },
  {
    path: 'SectionWiseReport',
    loadComponent: () =>
      import('./reports/tds-report-shell.component').then(
        (m) => m.TdsReportShellComponent,
      ),
    data: { reportKind: 'section-wise' },
  },
  {
    path: 'Challanapaymentreport',
    loadComponent: () =>
      import('./reports/tds-report-shell.component').then(
        (m) => m.TdsReportShellComponent,
      ),
    data: { reportKind: 'challana-payment-report' },
  },
  {
    path: 'Challanapaymentreport/:id',
    loadComponent: () =>
      import('./reports/tds-report-shell.component').then(
        (m) => m.TdsReportShellComponent,
      ),
    data: { reportKind: 'challana-payment-report' },
  },
  {
    path: 'CINEntryReport',
    loadComponent: () =>
      import('./reports/tds-report-shell.component').then(
        (m) => m.TdsReportShellComponent,
      ),
    data: { reportKind: 'cin-entry-report' },
  },

  {
    path: 'ChallanaChecking',
    loadComponent: () =>
      import('./transactions/challana-tds-shell.component').then(
        (m) => m.ChallanaTdsShellComponent,
      ),
    data: { kind: 'checking' },
  },
  {
    path: 'ChallanaPayment',
    loadComponent: () =>
      import('./transactions/challana-tds-shell.component').then(
        (m) => m.ChallanaTdsShellComponent,
      ),
    data: { kind: 'payment' },
  },
  {
    path: 'CINEntry',
    loadComponent: () =>
      import('./transactions/challana-tds-shell.component').then(
        (m) => m.ChallanaTdsShellComponent,
      ),
    data: { kind: 'cin-entry' },
  },

  { path: 'TdsAccountsSetup', ...placeholder('TDS Accounts Setup') },
  { path: 'masters', ...placeholder('TDS Masters') },
  { path: 'transactions', ...placeholder('TDS Transactions') },
  { path: 'reports', ...placeholder('TDS Reports') },
];
