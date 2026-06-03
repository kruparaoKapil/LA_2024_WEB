import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Settings', screen, phase: 'Phase 6' },
});

export const SETTINGS_ROUTES: Routes = [
  { path: 'users', ...placeholder('Users') },
  { path: 'user-rights', ...placeholder('User Rights') },
  { path: 'add-menu', ...placeholder('Add Menu') },
  { path: 'menu-sorting', ...placeholder('Menu Sorting') },
  { path: 'branch-config', ...placeholder('Branch Config') },
  { path: 'company-config', ...placeholder('Company Config') },
  { path: 'employees', ...placeholder('Employees') },
  { path: 'advocate-lawyer', ...placeholder('Advocate / Lawyer') },
  { path: 'referral-agent', ...placeholder('Referral Agent') },
  { path: 'contacts', ...placeholder('Contacts') },
  { path: 'generate-id', ...placeholder('Generate ID Master') },

  // legacy paths preserved
  { path: 'UsersView', ...placeholder('Users View') },
  { path: 'UsersRegistration', ...placeholder('User Registration') },
  { path: 'UserRights', ...placeholder('User Rights') },
  { path: 'UserRights/:id', ...placeholder('User Rights') },
  { path: 'AddMenu', ...placeholder('Add Menu') },
  { path: 'AddMenu/:id', ...placeholder('Add Menu') },
  { path: 'MenuSorting', ...placeholder('Menu Sorting') },
  { path: 'BranchConfig', ...placeholder('Branch Config') },
  { path: 'CompanyConfig', ...placeholder('Company Config') },
  { path: 'EmployeeView', ...placeholder('Employee View') },
  { path: 'EmployeeMaster', ...placeholder('Employee Master') },
  { path: 'EmployeeMaster/:id', ...placeholder('Employee Master') },
  { path: 'AdvocateLawyerView', ...placeholder('Advocate Lawyer View') },
  { path: 'AdvocateLawyerMaster', ...placeholder('Advocate Lawyer Master') },
  { path: 'AdvocateLawyerMaster/:id', ...placeholder('Advocate Lawyer Master') },
  { path: 'ReferralAgentView', ...placeholder('Referral Agent View') },
  { path: 'ReferralAgentMaster', ...placeholder('Referral Agent Master') },
  { path: 'ReferralAgentMaster/:id', ...placeholder('Referral Agent Master') },
  { path: 'PartyView', ...placeholder('Party View') },
  { path: 'PartyMaster', ...placeholder('Party Master') },
  { path: 'PartyMaster/:id', ...placeholder('Party Master') },
  { path: 'ContactList', ...placeholder('Contact List') },
  { path: 'ContactList/:id', ...placeholder('Contact List') },
  { path: 'ContactListDetailView', ...placeholder('Contact List Detail View') },
  { path: 'ContactListDetailView/:id', ...placeholder('Contact List Detail View') },
  { path: 'GenerateidMaster', ...placeholder('Generate ID Master') },
];
