import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface EmployeeRow {
  pEmployeeID: number;
  pEmployeeName: string;
  pEmployeeCode?: string;
  pDesignation?: string;
  pBranchName?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly api = inject(ApiClient);

  /** State previously held on the legacy service as plain fields. */
  readonly familyDetails = signal<unknown>(null);
  readonly employeeId = signal<number | null>(null);
  readonly tabName = signal<string>('');
  readonly buttonStatus = signal<string>('');

  getEmployeeDetails(): Observable<EmployeeRow[]> {
    return this.api.get<EmployeeRow[]>(
      '/Settings/Employee/GetallEmployeeDetails',
    );
  }

  saveEmployee(data: unknown): Observable<unknown> {
    return this.api.post('/Settings/Employee/SaveEmployeeDetails', data);
  }

  updateEmployee(data: unknown): Observable<unknown> {
    return this.api.post('/Settings/Employee/updateEmployee', data);
  }

  getDetailsForUpdate(id: number): Observable<unknown> {
    return this.api.get('/Settings/Employee/GetEmployeeDetailsOnId', {
      employeeID: id,
    });
  }

  checkDuplicates(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Settings/Employee/checkEmployeeCountinMaster',
      data,
    );
  }

  checkEmployeeRoleDuplicates(name: string): Observable<unknown> {
    return this.api.post(
      `/Settings/Employee/checkEmployeeRoleExistsOrNot?Rolename=${encodeURIComponent(name)}`,
      '',
    );
  }

  saveEmployeeRole(data: unknown): Observable<unknown> {
    return this.api.post('/Settings/Employee/SaveEmployeeRole', data);
  }
}
