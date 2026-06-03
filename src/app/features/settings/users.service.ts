import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface UserRow {
  pUserID: number;
  pUserName: string;
  pUsercontactRefId?: string;
  pDesignation?: string;
  pIsActive?: boolean;
  pStatus?: string;
}

export interface UserRegistrationPayload {
  pUserID?: number;
  pUserName: string;
  pPassword?: string;
  pUsercontactRefId?: string;
  pDesignation?: string;
  pBranchId?: number;
  pCreatedBy?: number;
  [key: string]: unknown;
}

export interface UserRightsFunction {
  pFunctionID: number;
  pFunctionName: string;
  pFunctionUrl: string;
  pIsviewpermission: boolean;
  pIsaddpermission: boolean;
  pIseditpermission: boolean;
  pIsdeletepermission: boolean;
  pIsprintpermission: boolean;
  [key: string]: unknown;
}

/**
 * Settings/Users API surface. Replaces the legacy `UsersService` Settings
 * methods (login/OTP/logout already moved to `AuthService` in Phase 2A;
 * the legacy file's Banking-dashboard methods will move to a dedicated
 * `BankingDashboardService` during Phase 9).
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiClient);

  getAllEmployees(): Observable<UserRow[]> {
    return this.api.get<UserRow[]>('/Settings/Users/UserAccess/GetAllEmployees');
  }

  getUserView(): Observable<UserRow[]> {
    return this.api.get<UserRow[]>('/Settings/Users/UserAccess/GetUserView');
  }

  selectUsers(): Observable<UserRow[]> {
    return this.api.get<UserRow[]>('/Settings/Users/UserRights/GetUsers');
  }

  getRoles(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/Users/UserRights/GetRoles');
  }

  checkUserName(userName: string): Observable<number> {
    return this.api.get<number>('/Settings/Users/UserAccess/CheckUserName', {
      UserName: userName,
    });
  }

  checkContactId(refId: string): Observable<number> {
    return this.api.get<number>(
      '/Settings/Users/UserAccess/CheckUsercontactRefID',
      { Contactrefid: refId },
    );
  }

  saveRegistration(data: UserRegistrationPayload): Observable<unknown> {
    return this.api.post('/Settings/Users/UserAccess/SaveUserAccess', data);
  }

  /** Note: legacy passes username/password as query string, not body. */
  changePassword(username: string, password: string): Observable<unknown> {
    const path = `/Settings/Users/UserAccess/ChangePassword?Username=${encodeURIComponent(
      username,
    )}&password=${encodeURIComponent(password)}`;
    return this.api.post(path, '');
  }

  resetPassword(username: string): Observable<unknown> {
    return this.api.post(
      `/Settings/Users/UserAccess/ResetPassword?Username=${encodeURIComponent(username)}`,
      '',
    );
  }

  toggleStatus(userId: number, status: string): Observable<unknown> {
    return this.api.post(
      `/Settings/Users/UserAccess/UserActiveInactive?Userid=${userId}&Status=${encodeURIComponent(status)}`,
      '',
    );
  }

  getNavigation(
    type: 'User' | 'Designation',
    userOrDesignation: string,
  ): Observable<UserRightsFunction[]> {
    return this.api.get<UserRightsFunction[]>(
      '/Settings/Users/UserRights/GetUserRights',
      { Type: type, UserOrDesignation: userOrDesignation },
    );
  }

  saveNavigation(
    type: 'User' | 'Designation',
    userOrDesignation: string,
    rights: unknown,
  ): Observable<unknown> {
    const path = `/Settings/Users/UserRights/SaveUserRight?Type=${encodeURIComponent(
      type,
    )}&UserOrDesignation=${encodeURIComponent(userOrDesignation)}`;
    return this.api.post(path, rights);
  }

  getUserRightsByUserName(userName: string): Observable<UserRightsFunction[]> {
    return this.api.get<UserRightsFunction[]>(
      '/Settings/Users/UserRights/GetUserRightsBasedonUserName',
      { UserName: userName },
    );
  }

  getBranchLocations(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/Branch/GetBranchLocationDetails');
  }

  getBranchNameDetails(branchname: string): Observable<unknown> {
    return this.api.get('/Settings/Branch/GetBranchNameDetails', { branchname });
  }
}
