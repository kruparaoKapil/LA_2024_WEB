import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'Login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Dashboard',
    loadComponent: () =>
      import('./features/home/dashboard.component').then((m) => m.DashboardComponent),
  },
  // Lazy feature routes will be wired here in Phase 4:
  // { path: '', loadChildren: () => import('./features/loans/loans.routes').then(m => m.LOANS_ROUTES) },
  // { path: '', loadChildren: () => import('./features/banking/banking.routes').then(m => m.BANKING_ROUTES) },
  // { path: '', loadChildren: () => import('./features/accounting/accounting.routes').then(m => m.ACCOUNTING_ROUTES) },
  // { path: '', loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
  // { path: '', loadChildren: () => import('./features/hrms/hrms.routes').then(m => m.HRMS_ROUTES) },
  // { path: '', loadChildren: () => import('./features/tds/tds.routes').then(m => m.TDS_ROUTES) },
  // { path: '', loadChildren: () => import('./features/common/common.routes').then(m => m.COMMON_ROUTES) },
  { path: '**', redirectTo: 'Login' },
];
