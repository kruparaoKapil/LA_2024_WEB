import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthStore } from './auth.store';

/**
 * Functional replacement for the legacy class-based `AuthGuard` in
 * `src/app/Services/Settings/Users/_helpers/auth.guard.ts`.
 *
 * Preserves the legacy redirect target by going to `/Login` (the new app's
 * shell) and propagating `returnUrl` so post-login navigation can resume.
 * The role-based view permission check is delegated to {@link roleGuard}.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated()) return true;

  return router.createUrlTree(['/Login'], {
    queryParams: { returnUrl: state.url },
  });
};
