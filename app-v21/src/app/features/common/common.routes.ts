import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'Common', screen, phase: 'Phase 5' },
});

/**
 * Cross-cutting reusable screens used by multiple feature areas. Ported
 * first (Phase 5) because every other feature consumes them.
 */
export const COMMON_ROUTES: Routes = [
  { path: 'GroupView', ...placeholder('Group View') },
  { path: 'GroupCreation', ...placeholder('Group Creation') },
  { path: 'BranchSelection', ...placeholder('Branch Selection') },
];
