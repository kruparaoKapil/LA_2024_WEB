import type { Routes } from '@angular/router';

import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'HRMS', screen, phase: 'Phase 10 follow-up' },
});

export const HRMS_ROUTES: Routes = [
  { path: '', redirectTo: 'EmployeeNewView', pathMatch: 'full' },

  {
    path: 'EmployeeNewView',
    loadComponent: () =>
      import('./masters/employee-view.component').then(
        (m) => m.EmployeeViewComponent,
      ),
  },
  {
    path: 'EmployeeNewHrms',
    loadComponent: () =>
      import('./masters/employee-shell.component').then(
        (m) => m.EmployeeShellComponent,
      ),
  },
  {
    path: 'EmployeeNewHrms/:id',
    loadComponent: () =>
      import('./masters/employee-shell.component').then(
        (m) => m.EmployeeShellComponent,
      ),
  },

  {
    path: 'EmployeeAttendance',
    loadComponent: () =>
      import('./transactions/attendance-shell.component').then(
        (m) => m.AttendanceShellComponent,
      ),
  },
  {
    path: 'EmployeeOnroll',
    loadComponent: () =>
      import('./transactions/onroll-shell.component').then(
        (m) => m.OnrollShellComponent,
      ),
  },
  {
    path: 'PayrollProcess',
    loadComponent: () =>
      import('./transactions/payroll-shell.component').then(
        (m) => m.PayrollShellComponent,
      ),
    data: { kind: 'process' },
  },
  {
    path: 'PayrollApproval',
    loadComponent: () =>
      import('./transactions/payroll-shell.component').then(
        (m) => m.PayrollShellComponent,
      ),
    data: { kind: 'approval' },
  },
  {
    path: 'JvDetails',
    loadComponent: () =>
      import('./transactions/jv-details-shell.component').then(
        (m) => m.JvDetailsShellComponent,
      ),
  },
  {
    path: 'ChallanaEntryHRMS',
    loadComponent: () =>
      import('./transactions/challana-hrms-shell.component').then(
        (m) => m.ChallanaHrmsShellComponent,
      ),
    data: { kind: 'entry' },
  },
  {
    path: 'ViewChallanaEntryHRMS',
    loadComponent: () =>
      import('./transactions/challana-hrms-shell.component').then(
        (m) => m.ChallanaHrmsShellComponent,
      ),
    data: { kind: 'view' },
  },

  {
    path: 'SalaryStatementReport',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'salary-statement' },
  },
  {
    path: 'SalaryStatementReportNew',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'salary-statement' },
  },
  {
    path: 'PayrollApprovalReport',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'payroll-approval-report' },
  },
  {
    path: 'PaySlip',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'pay-slip' },
  },
  {
    path: 'PaySlipPreview',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'pay-slip' },
  },
  {
    path: 'LoyalityStatement',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'loyalty-statement' },
  },
  {
    path: 'EmployeeMontlyBonus',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'employee-monthly-bonus' },
  },
  {
    path: 'ESIStatement',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'esi-statement' },
  },
  {
    path: 'PFStatement',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'pf-statement' },
  },
  {
    path: 'ProfessionalTax',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'professional-tax' },
  },
  {
    path: 'EarnedLeaves',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'earned-leaves' },
  },
  {
    path: 'BiometricAttendanceReport',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'biometric-attendance' },
  },
  {
    path: 'BiometricAttendenceSummaryReport',
    loadComponent: () =>
      import('./reports/hrms-report-shell.component').then(
        (m) => m.HrmsReportShellComponent,
      ),
    data: { reportKind: 'biometric-summary' },
  },

  { path: 'SSCAgenda', ...placeholder('SSC Agenda') },
  { path: 'SalaryUpdate', ...placeholder('Salary Update') },
  { path: 'EmployeeSalaryUpdate', ...placeholder('Employee Salary Update') },
  { path: 'PromoteSalaryReport', ...placeholder('Promote Salary Report') },
  { path: 'LeaveDeatails', ...placeholder('Leave Details') },
  { path: 'MembertypeView', ...placeholder('Member Type (HRMS)') },
  { path: 'transactions', ...placeholder('HRMS Transactions') },
  { path: 'reports', ...placeholder('HRMS Reports') },
];
