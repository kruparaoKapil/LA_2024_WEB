import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Settings', screen, phase: 'Phase 6 (extended)' },
});

/**
 * Phase 6 ports:
 *  - Users (view + registration)
 *  - Branch Config (list + dialog edit, with cascading address sub-form)
 *  - Advocate / Lawyer (list + dialog edit)
 *  - Referral Agent (list + dialog edit)
 *  - Generate ID Master (list + dialog edit, with form/mode cascade)
 *
 * Multi-tab forms (Company Config, Employee Master with family/property
 * sub-tabs, User Rights with menu tree, Add Menu, Menu Sorting, Party
 * Master with contact tree) are intentionally deferred — they flow
 * through Phase 7 alongside the FIIndividual sub-forms they share.
 */
export const SETTINGS_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users-view.component').then((m) => m.UsersViewComponent),
  },
  {
    path: 'UsersView',
    loadComponent: () =>
      import('./users/users-view.component').then((m) => m.UsersViewComponent),
  },
  {
    path: 'UsersRegistration',
    loadComponent: () =>
      import('./users/users-registration.component').then(
        (m) => m.UsersRegistrationComponent,
      ),
  },

  {
    path: 'branch-config',
    loadComponent: () =>
      import('./branch-config/branch-config.component').then(
        (m) => m.BranchConfigComponent,
      ),
  },
  {
    path: 'BranchConfig',
    loadComponent: () =>
      import('./branch-config/branch-config.component').then(
        (m) => m.BranchConfigComponent,
      ),
  },

  {
    path: 'advocate-lawyer',
    loadComponent: () =>
      import('./advocate-lawyer/advocate-lawyer.component').then(
        (m) => m.AdvocateLawyerComponent,
      ),
  },
  {
    path: 'AdvocateLawyerView',
    loadComponent: () =>
      import('./advocate-lawyer/advocate-lawyer.component').then(
        (m) => m.AdvocateLawyerComponent,
      ),
  },
  {
    path: 'AdvocateLawyerMaster',
    loadComponent: () =>
      import('./advocate-lawyer/advocate-lawyer.component').then(
        (m) => m.AdvocateLawyerComponent,
      ),
  },

  {
    path: 'referral-agent',
    loadComponent: () =>
      import('./referral-agent/referral-agent.component').then(
        (m) => m.ReferralAgentComponent,
      ),
  },
  {
    path: 'ReferralAgentView',
    loadComponent: () =>
      import('./referral-agent/referral-agent.component').then(
        (m) => m.ReferralAgentComponent,
      ),
  },
  {
    path: 'ReferralAgentMaster',
    loadComponent: () =>
      import('./referral-agent/referral-agent.component').then(
        (m) => m.ReferralAgentComponent,
      ),
  },

  {
    path: 'generate-id',
    loadComponent: () =>
      import('./generate-id/generate-id.component').then(
        (m) => m.GenerateIdComponent,
      ),
  },
  {
    path: 'GenerateidMaster',
    loadComponent: () =>
      import('./generate-id/generate-id.component').then(
        (m) => m.GenerateIdComponent,
      ),
  },

  // -------- placeholders for multi-tab screens deferred to Phase 7+ --------
  { path: 'user-rights', ...placeholder('User Rights (menu tree)') },
  { path: 'UserRights', ...placeholder('User Rights (menu tree)') },
  { path: 'add-menu', ...placeholder('Add Menu') },
  { path: 'AddMenu', ...placeholder('Add Menu') },
  { path: 'menu-sorting', ...placeholder('Menu Sorting (drag/drop)') },
  { path: 'MenuSorting', ...placeholder('Menu Sorting (drag/drop)') },
  { path: 'company-config', ...placeholder('Company Config (multi-tab)') },
  { path: 'CompanyConfig', ...placeholder('Company Config (multi-tab)') },
  { path: 'employees', ...placeholder('Employee Master (multi-tab)') },
  { path: 'EmployeeView', ...placeholder('Employee View') },
  { path: 'EmployeeMaster', ...placeholder('Employee Master (multi-tab)') },
  { path: 'contacts', ...placeholder('Contacts') },
  { path: 'PartyView', ...placeholder('Party View') },
  { path: 'PartyMaster', ...placeholder('Party Master (multi-tab)') },
  { path: 'ContactList', ...placeholder('Contact List') },
  { path: 'ContactListDetailView', ...placeholder('Contact List Detail View') },
];
