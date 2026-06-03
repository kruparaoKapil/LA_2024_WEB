import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiClient } from '../api/api-client.service';
import { AuthStore } from './auth.store';
import { LoginRequest, LoginResponse } from './auth.types';

/**
 * Replacement for the auth-related methods on legacy `UsersService`:
 * `_loginUser`, `_VerifyOTP`, `_logout`, `_getRoles`, `_getUser`,
 * password reset, etc.
 *
 * Behavioural contract (kept identical):
 * - POST `/login`  with body `{ username, password, ... }`
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

  verifyOtp(payload: unknown): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/VerifyOtp', payload).pipe(
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

  private applyLoginResponse(resp: LoginResponse | undefined | null): void {
    if (!resp) return;
    if (resp.user) this.store.setUser(resp.user);
    if (resp.roles) this.store.setRoles(resp.roles);
    if (resp.company) this.store.setCompany(resp.company);
  }
}
