import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Common', screen, phase: 'Phase 5' },
});

/**
 * Cross-cutting reusable screens used by every other feature area.
 * Phase 5 ports `GroupView`, `GroupCreation`, and `BranchSelection`.
 * Sub-form building blocks (address, bankdetails, kyc, personal-details,
 * contact-select) ship as standalone CVA components and are routed here
 * only as developer demo pages once consumers in Phase 7 are ready.
 */
export const COMMON_ROUTES: Routes = [
  // legacy hash routes
  {
    path: 'GroupView',
    loadComponent: () =>
      import('./group/group-view.component').then((m) => m.GroupViewComponent),
  },
  {
    path: 'GroupCreation',
    loadComponent: () =>
      import('./group/group-creation.component').then(
        (m) => m.GroupCreationComponent,
      ),
  },
  {
    path: 'BranchSelection',
    loadComponent: () =>
      import('./branch-selection/branch-selection.component').then(
        (m) => m.BranchSelectionComponent,
      ),
  },

  // sub-forms still pending in-context port (Phase 7)
  { path: 'Address', ...placeholder('Address (sub-form preview)') },
  { path: 'BankDetails', ...placeholder('Bank Details') },
  { path: 'KYCDocuments', ...placeholder('KYC Documents') },
  { path: 'PersonalDetails', ...placeholder('Personal Details') },
  { path: 'ContactSelect', ...placeholder('Contact Select') },
];
