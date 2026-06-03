import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AuthStore } from '../auth/auth.store';

const AUTH_SKIP_PATHS = ['/login', '/VerifyOtp'];

function isAuthRequest(url: string): boolean {
  const path = url.split('?')[0].toLowerCase();
  return AUTH_SKIP_PATHS.some((p) => path.endsWith(p.toLowerCase()));
}

/**
 * Legacy `jwt.interceptor.ts`: Bearer from `currentUser.pToken` in session.
 * Never attach Authorization on login/OTP — a stale cookie token causes 401.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (isAuthRequest(req.url)) {
    return next(req);
  }

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
