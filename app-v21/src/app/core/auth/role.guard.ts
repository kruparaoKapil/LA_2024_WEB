import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthStore } from './auth.store';

/**
 * Functional replacement for the role/permission portion of the legacy
 * `AuthGuard.canActivate`. Composes with {@link authGuard} when both are
 * applied to a route via `canActivate: [authGuard, roleGuard]`.
 *
 * Reads the route's `path` segment and checks `pFunctionUrl + pIsviewpermission`
 * exactly as the legacy code did.
 */
export const roleGuard: CanActivateFn = (route) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  const path = route.routeConfig?.path ?? '';
  if (store.canViewPath(path)) return true;
  return router.createUrlTree(['/Dashboard']);
};
