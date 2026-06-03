import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiClient } from '../api/api-client.service';
import { AuthStore } from './auth.store';
import { CurrentUser, LoginRequest, LoginResponse } from './auth.types';

/**
 * Replacement for the auth-related methods on legacy `UsersService`:
 * `_loginUser`, `_VerifyOTP`, `_logout`, `_getRoles`, `_getUser`,
 * password reset, etc.
 *
 * Behavioural contract (kept identical):
 * - POST `/login`  with body `{ pUserName, pPassword, pOtp }`
 * - POST `/VerifyOtp` with body
 * - On logout, clear sessionStorage and navigate to `/Login` (legacy used `/`).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse, LoginRequest>('/login', req).pipe(
      tap((resp) => this.applyLoginResponse(resp)),
    );
  }

  verifyOtp(payload: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse, LoginRequest>('/VerifyOtp', payload).pipe(
      tap((resp) => this.applyLoginResponse(resp)),
    );
  }

  resetPassword(username: string): Observable<unknown> {
    return this.api.post(
      `/Settings/Users/UserAccess/ResetPassword?Username=${encodeURIComponent(username)}`,
      '',
    );
  }

  changePassword(username: string, password: string): Observable<unknown> {
    const url =
      '/Settings/Users/UserAccess/ChangePassword?Username=' +
      encodeURIComponent(username) +
      '&password=' +
      encodeURIComponent(password);
    return this.api.post(url, '');
  }

  logout(): void {
    this.store.clear();
    void this.router.navigate(['/Login']);
  }

  private applyLoginResponse(resp: LoginResponse | CurrentUser | undefined | null): void {
    if (!resp) return;
    // Legacy API returns the user DTO at the top level (pUserID, pToken, …).
    if ('pUserID' in resp && !('user' in resp)) {
      this.store.setUser(resp as CurrentUser);
      return;
    }
    const wrapped = resp as LoginResponse;
    if (wrapped.user) this.store.setUser(wrapped.user);
    if (wrapped.roles) this.store.setRoles(wrapped.roles);
    if (wrapped.company) this.store.setCompany(wrapped.company);
  }
}
