import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface HrmsReportRow {
  [key: string]: unknown;
}

export interface CalendarYear {
  pCalendarId: number;
  pYearName: string;
  [key: string]: unknown;
}

export interface CalendarMonth {
  pMonthId: number;
  pMonthName: string;
  pMonthYear?: string;
  [key: string]: unknown;
}

/**
 * Consolidates all legacy HRMS services (~3100 LOC across 10 files,
 * many duplicating `GetCalendarYear` / `getProcessApproveEmployes`).
 * Drives payroll, attendance, on-roll, JV, employee, challana, and
 * report shells.
 */
@Injectable({ providedIn: 'root' })
export class HrmsService {
  private readonly api = inject(ApiClient);

  readonly editingEmployeeId = signal<number | null>(null);
  readonly editingEmployeeData = signal<Record<string, unknown> | null>(null);

  // ---- shared lookups ----
  getProcessApproveEmployees(branchId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/getProcessApproveEmployes', {
      BranchId: branchId,
    });
  }

  getCalendarYear(): Observable<CalendarYear[]> {
    return this.api.get<CalendarYear[]>('/HRMS/GetCalendarYear');
  }

  getCalendarYearMonthPayroll(calendarId: number): Observable<CalendarMonth[]> {
    return this.api.get<CalendarMonth[]>(
      '/HRMS/GetCalendarYearMonthPayroll',
      { CalendarId: calendarId },
    );
  }

  getCalendarYearMonthPayrollBeforeAuthorised(
    calendarId: number,
  ): Observable<CalendarMonth[]> {
    return this.api.get<CalendarMonth[]>(
      '/HRMS/GetCalendarYearMonthPayrollBeforeAuthorised',
      { CalendarId: calendarId },
    );
  }

  getCalendarYearMonthPayrollAuthorised(
    calendarId: number,
    empContactId?: number,
  ): Observable<CalendarMonth[]> {
    return this.api.get<CalendarMonth[]>(
      '/HRMS/GetCalendarYearMonthPayrollAuthorised',
      {
        CalendarId: calendarId,
        ...(empContactId != null ? { empContactId } : {}),
      },
    );
  }

  getCalendarYearMonth(calendarId: number): Observable<CalendarMonth[]> {
    return this.api.get<CalendarMonth[]>(
      '/HRMS/GetCalendarYearMonth',
      { CalendarId: calendarId },
    );
  }

  // ---- payroll process / approval ----
  getEmployeeDetailsPayroll(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeDetailsPayroll',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  saveEmpPayroll(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveEmpPayroll', data);
  }

  getEmployeeDetailsPayrollApproval(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeDetailsPayrollApproval',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  getEmployeeDetailsPayrollApproved(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeDetailsPayrollApproved',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  authoriseEmpPayroll(type: string, data: unknown): Observable<unknown> {
    const path = `/HRMS/AuthoriseEmpPayroll?Type=${encodeURIComponent(type)}`;
    return this.api.post(path, data);
  }

  // ---- attendance ----
  getEmployeeDetails(branchId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/getEmployeeDetails', {
      BranchId: branchId,
    });
  }

  getEmployeeDetailsAttendance(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeDetailsAttendance',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  saveEmployeeAttendance(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveEmployeeAttendance', data);
  }

  // ---- on-roll (allowances / advances / recoveries) ----
  getEmployeeDetailsOnroll(branchId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/getEmployeeDetailsOnroll', {
      BranchId: branchId,
    });
  }

  getAllowanceTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetAllowanceTypes');
  }

  getAllowanceDetails(employeeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetAllowanceDetails', {
      EmployeeId: employeeId,
    });
  }

  saveAllowanceDetails(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveAllowanceDetails', data);
  }

  deleteAllowance(allowanceId: number): Observable<unknown> {
    return this.api.post(
      `/HRMS/DeleteAllowance?allowanceid=${allowanceId}`,
      {},
    );
  }

  getRecoveryTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetRecoveryTypes');
  }

  getRecoveryDetails(employeeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetRecoveryDetails', {
      EmployeeId: employeeId,
    });
  }

  saveRecoveryDetails(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveRecoveryDetails', data);
  }

  getAdvanceTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetAdvanceTypes');
  }

  getAdvanceDetails(employeeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetAdvanceDetails', {
      EmployeeId: employeeId,
    });
  }

  saveAdvanceDetails(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveAdvanceDetails', data);
  }

  // ---- JV details ----
  getJvAllowanceTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetAllowanceTypes_jvtypes');
  }

  getJvDetailsByType(jvType: string, monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>('/HRMS/GetJVDetailsByType', {
      JVType: jvType,
      MonthYear: monthYear,
    });
  }

  saveJvDetails(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveJVDetails', data);
  }

  // ---- employee (SSC agenda) ----
  listEmployees(): Observable<Record<string, unknown>[]> {
    return this.api.get<Record<string, unknown>[]>('/HRMS/ViewEmployeedetails');
  }

  getEmployeeById(employeeId: number): Observable<unknown> {
    return this.api.get('/HRMS/GetEmployeedetailsbyid', {
      EmployeeId: employeeId,
    });
  }

  getDesignations(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetDesignations');
  }

  getBranchNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetBranchNames');
  }

  getRoles(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/Getroles');
  }

  saveContactEmployee(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveContactEmployee', data);
  }

  saveSscAgenda(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveSscAgenda', data);
  }

  saveEmployeeSalaryUpdate(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/saveEmployeeSalaryUpdate', data);
  }

  // ---- HRMS challana ----
  saveHrmsChallana(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveHrmsChallana', data);
  }

  viewHrmsChallana(): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>('/HRMS/Transactions/ViewHrmsChallana');
  }

  // ---- reports ----
  getPayslipDetails(monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>('/HRMS/GetPayslipDetails', {
      MonthYear: monthYear,
    });
  }

  getProfessionalTaxDetails(monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/getProffesionalTaxDetailsList',
      { MonthYear: monthYear },
    );
  }

  getEmployeeEsiDetails(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeEsiDetails',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  getEmployeePfDetails(
    branchId: number,
    monthYear: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeePFDetails',
      { BranchId: branchId, MonthYear: monthYear },
    );
  }

  getLoyaltyReport(monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetLoyalityReport',
      { MonthYear: monthYear },
    );
  }

  getLoyaltyCalendarYearMonth(calendarId: number): Observable<CalendarMonth[]> {
    return this.api.get<CalendarMonth[]>(
      '/HRMS/GetLoyalityCalendarYearMonth',
      { CalendarId: calendarId },
    );
  }

  getEmployeeBonusDetails(monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeBonusDetails',
      { MonthYear: monthYear },
    );
  }

  getEmployeeElDetails(monthYear: string): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetEmployeeELDetails',
      { MonthYear: monthYear },
    );
  }

  saveEarnedLeaves(data: unknown): Observable<unknown> {
    return this.api.post('/HRMS/SaveEarnedLeaves', data);
  }

  getBiometricAttendanceReport(
    branchSchema: string,
    fromDate: string,
    toDate: string,
    leaveType: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetBiometricAttendanceReportdata',
      {
        branchschema: branchSchema,
        fromdate: fromDate,
        todate: toDate,
        leavetype: leaveType,
      },
    );
  }

  getBiometricAttendanceSummary(
    branchSchema: string,
    empCode: string,
    fromDate: string,
    toDate: string,
    leaveType: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetBiometricAttendancesumarryReportData',
      {
        branchschema: branchSchema,
        empcode: empCode,
        fromdate: fromDate,
        todate: toDate,
        leavetype: leaveType,
      },
    );
  }

  getAttendance(
    branchSchema: string,
    fromDate: string,
    toDate: string,
  ): Observable<HrmsReportRow[]> {
    return this.api.get<HrmsReportRow[]>(
      '/HRMS/GetAttendance',
      { branchschema: branchSchema, fromdate: fromDate, todate: toDate },
    );
  }
}
