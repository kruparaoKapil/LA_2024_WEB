import { Injectable, computed, effect, signal } from '@angular/core';

import {
  BranchSelection,
  CompanyDetails,
  CurrentUser,
  RoleFunction,
  UserRolePackage,
} from './auth.types';

const KEY_USER = 'currentUser';
const KEY_ROLES = 'Urc';
const KEY_COMPANY = 'companydetails';
const KEY_BRANCH = 'SetBranch';

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

/**
 * Signal-backed mirror of legacy sessionStorage state.
 *
 * Replaces the ad-hoc reads/writes scattered across `UsersService`,
 * `CommonService`, and `AuthGuard`. All mutations flow through this store;
 * an `effect()` keeps sessionStorage in sync so refreshes survive.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  // ---- writable signals ----
  readonly user = signal<CurrentUser | null>(safeParse<CurrentUser>(sessionStorage.getItem(KEY_USER)));
  readonly roles = signal<UserRolePackage | null>(
    safeParse<UserRolePackage>(sessionStorage.getItem(KEY_ROLES)),
  );
  readonly company = signal<CompanyDetails | null>(
    safeParse<CompanyDetails>(sessionStorage.getItem(KEY_COMPANY)),
  );
  readonly branch = signal<BranchSelection | null>(
    safeParse<BranchSelection>(sessionStorage.getItem(KEY_BRANCH)),
  );

  // ---- computed views ----
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly currentUserId = computed(() => this.user()?.pUserID ?? 0);
  readonly token = computed(() => this.user()?.pToken ?? '');
  readonly functions = computed<RoleFunction[]>(() => this.roles()?.functionsDTOList ?? []);

  constructor() {
    effect(() => this.persist(KEY_USER, this.user()));
    effect(() => this.persist(KEY_ROLES, this.roles()));
    effect(() => this.persist(KEY_COMPANY, this.company()));
    effect(() => this.persist(KEY_BRANCH, this.branch()));
  }

  setUser(user: CurrentUser | null): void {
    this.user.set(user);
  }

  setRoles(roles: UserRolePackage | null): void {
    this.roles.set(roles);
  }

  setCompany(company: CompanyDetails | null): void {
    this.company.set(company);
  }

  setBranch(branch: BranchSelection | null): void {
    this.branch.set(branch);
  }

  clear(): void {
    this.user.set(null);
    this.roles.set(null);
    this.company.set(null);
    this.branch.set(null);
  }

  /**
   * Returns true when the user has view permission for the given route path
   * fragment, or when the path is the default `Dashboard` (always allowed for
   * authenticated users — matches legacy `AuthGuard.canActivate` behaviour).
   */
  canViewPath(path: string): boolean {
    if (!this.isAuthenticated()) return false;
    if (path === 'Dashboard' || path === '' || path === '/') return true;
    const list = this.functions();
    if (list.length === 0) return true; // no role data yet → don't block
    return list.some(
      (fn) => fn.pFunctionUrl === '/' + path && fn.pIsviewpermission === true,
    );
  }

  private persist(key: string, value: unknown): void {
    if (value === null || value === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }
}
