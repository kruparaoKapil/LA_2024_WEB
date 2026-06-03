import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceService {

  constructor(private _CommonService: CommonService) { }

  getEmployeeDetails(BranchId): Observable<any> {
    debugger;
    try {
      debugger;
      const params = new HttpParams().set('BranchId', BranchId);
      return this._CommonService.callGetAPI('/HRMS/getEmployeeDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  GetExistingTypes(BranchSchema) {
    try {
      const params = new HttpParams().set('BranchSchema', BranchSchema);
      return this._CommonService.callGetAPI("/Transactions/HRMSTransactions/GetExistingAdvanceTypes", params, "YES");
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  GetCalendarYear() {
    debugger;

    return this._CommonService.callGetAPI('/HRMS/GetCalendarYear', '', 'NO');

  }


  GetCalendarYearMonth(CalendarId): Observable<any> {
    debugger;
    const params = new HttpParams().set('CalendarId', CalendarId);
    return this._CommonService.callGetAPI('/HRMS/GetCalendarYearMonth', params, 'YES');

  }

  GetEmployeeAttendanceDetails(BranchId, Year, Month): Observable<any> {
    debugger;
    try {
      const params = new HttpParams().set('BranchId', BranchId).set('Year', Year).set('Month', Month);

      return this._CommonService.callGetAPI('/HRMS/GetEmployeeDetailsAttendance', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }

  }

  SaveEmployeeAttendance(data): Observable<any> {
    debugger;
    try {
      debugger;
      return this._CommonService.callPostAPI('/HRMS/SaveEmployeeAttendance', data);
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  //HRMS/SaveHrmsChallana

  saveHrmsChallana(data): Observable<any> {
    debugger;
    try {
      debugger;
      return this._CommonService.callPostAPI('/HRMS/SaveHrmsChallana', data);
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  viewHrmsChallana() {
    debugger;
    return this._CommonService.callGetAPI('/HRMS/Transactions/ViewHrmsChallana', '', 'NO');
  }


}
