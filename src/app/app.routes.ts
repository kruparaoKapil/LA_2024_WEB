import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

/**
 * Top-level route table.
 *
 * Layout:
 *  - `/Login` is a bare route (no shell, no auth requirement).
 *  - Everything else lives inside `AppShellComponent`, behind `authGuard`,
 *    and dispatches to per-feature lazy `*.routes.ts`.
 *
 * Hash routing is preserved (`withHashLocation()` in `app.config.ts`),
 * so legacy bookmarks like `#/Dashboard`, `#/CashBook`, `#/Fiindividual`
 * continue to resolve.
 */
export const routes: Routes = [
  {
    path: 'Login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      {
        path: 'Dashboard',
        loadComponent: () =>
          import('./features/home/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },

      // feature areas — each lazy-loads its own routes module
      {
        path: 'loans',
        loadChildren: () =>
          import('./features/loans/loans.routes').then((m) => m.LOANS_ROUTES),
      },
      {
        path: 'banking',
        loadChildren: () =>
          import('./features/banking/banking.routes').then(
            (m) => m.BANKING_ROUTES,
          ),
      },
      {
        path: 'accounting',
        loadChildren: () =>
          import('./features/accounting/accounting.routes').then(
            (m) => m.ACCOUNTING_ROUTES,
          ),
      },
      {
        path: 'hrms',
        loadChildren: () =>
          import('./features/hrms/hrms.routes').then((m) => m.HRMS_ROUTES),
      },
      {
        path: 'tds',
        loadChildren: () =>
          import('./features/tds/tds.routes').then((m) => m.TDS_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES,
          ),
      },
      {
        path: 'common',
        loadChildren: () =>
          import('./features/common/common.routes').then(
            (m) => m.COMMON_ROUTES,
          ),
      },

      // legacy hash routes pointed straight at the lazy modules so the
      // un-prefixed bookmarks (e.g. `#/CashBook`, `#/Fiindividual`) keep
      // resolving without a redirect hop.
      {
        path: '',
        loadChildren: () =>
          import('./features/loans/loans.routes').then((m) => m.LOANS_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/banking/banking.routes').then(
            (m) => m.BANKING_ROUTES,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/accounting/accounting.routes').then(
            (m) => m.ACCOUNTING_ROUTES,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/hrms/hrms.routes').then((m) => m.HRMS_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/tds/tds.routes').then((m) => m.TDS_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/common/common.routes').then(
            (m) => m.COMMON_ROUTES,
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'Login' },
];
