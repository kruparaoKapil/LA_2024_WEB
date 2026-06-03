import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'HRMS', screen, phase: 'Phase 10' },
});

export const HRMS_ROUTES: Routes = [
  { path: 'transactions', ...placeholder('HRMS Transactions') },
  { path: 'reports', ...placeholder('HRMS Reports') },

  { path: 'EmployeeAttendance', ...placeholder('Employee Attendance') },
  { path: 'EmployeeOnroll', ...placeholder('Employee On-roll') },
  { path: 'PayrollProcess', ...placeholder('Payroll Process') },
  { path: 'PayrollApproval', ...placeholder('Payroll Approval') },
  { path: 'PayrollApprovalReport', ...placeholder('Payroll Approval Report') },
  { path: 'SalaryUpdate', ...placeholder('Salary Update') },
  { path: 'SalaryStatementReport', ...placeholder('Salary Statement Report') },
  { path: 'SalaryStatementReportNew', ...placeholder('Salary Statement Report (New)') },
  { path: 'SSCAgenda', ...placeholder('SSC Agenda') },
  { path: 'PaySlip', ...placeholder('Pay Slip') },
  { path: 'PaySlipPreview', ...placeholder('Pay Slip Preview') },
  { path: 'LoyalityStatement', ...placeholder('Loyalty Statement') },
  { path: 'EmployeeMontlyBonus', ...placeholder('Employee Monthly Bonus') },
  { path: 'ESIStatement', ...placeholder('ESI Statement') },
  { path: 'PFStatement', ...placeholder('PF Statement') },
  { path: 'ProfessionalTax', ...placeholder('Professional Tax') },
  { path: 'EarnedLeaves', ...placeholder('Earned Leaves') },
  { path: 'LeaveDeatails', ...placeholder('Leave Details') },
  { path: 'BiometricAttendanceReport', ...placeholder('Biometric Attendance Report') },
  { path: 'BiometricAttendenceSummaryReport', ...placeholder('Biometric Attendance Summary') },
  { path: 'JvDetails', ...placeholder('JV Details') },
  { path: 'EmployeeNewHrms', ...placeholder('Employee (HRMS)') },
  { path: 'EmployeeNewView', ...placeholder('Employee View') },
  { path: 'EmployeeSalaryUpdate', ...placeholder('Employee Salary Update') },
  { path: 'PromoteSalaryReport', ...placeholder('Promote Salary Report') },
  { path: 'ChallanaEntryHRMS', ...placeholder('Challana Entry (HRMS)') },
  { path: 'ViewChallanaEntryHRMS', ...placeholder('View Challana Entry (HRMS)') },
];
