import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AuthStore } from '../auth/auth.store';

/**
 * Mirrors legacy `jwt.interceptor.ts`: Bearer token from `currentUser.pToken`
 * in sessionStorage. Cookie `token` is a fallback only.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const cookies = inject(CookieService);

  const token = store.user()?.pToken ?? cookies.get('token');
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
