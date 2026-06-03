import { CookieService } from 'ngx-cookie-service';

import { AuthStore } from './auth.store';

/** Clears stale session before branch pick / login (legacy starts fresh at branch screen). */
export function clearAuthSession(store: AuthStore, cookies: CookieService): void {
  store.clear();
  sessionStorage.removeItem('nomineeAndReferralStatus');
  sessionStorage.removeItem('referralStatus');
  sessionStorage.removeItem('nomineeDetailsMP');
  sessionStorage.removeItem('referralStatusMP');
  cookies.delete('token', '/');
}
