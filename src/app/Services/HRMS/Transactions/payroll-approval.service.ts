import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PayrollApprovalService {

  constructor(private _commonserice : CommonService) { }

  


getProcessApproveEmployes(BranchId,): Observable<any> {
  debugger;
  try {
    debugger;
    const params = new HttpParams().set('BranchId', BranchId);
    return this._commonserice.callGetAPI('/HRMS/getProcessApproveEmployes', params, 'YES');
  }
  catch (e) {
    this._commonserice.showErrorMessage(e);
  }

}

GetCalendarYearMonthDetails(CalendarId): Observable<any> {
  debugger;
     const params = new HttpParams().set('CalendarId', CalendarId);
     return this._commonserice.callGetAPI('/HRMS/GetCalendarYearMonthPayrollBeforeAuthorised', params, 'YES');

   }

   GetPayRollApprovalDetails(BranchId, MonthYear): Observable<any> {
    debugger;
    const params = new HttpParams().set('BranchId',BranchId ).set('MonthYear', MonthYear);

    return this._commonserice.callGetAPI('/HRMS/GetEmployeeDetailsPayrollApproval', params, 'YES');

  }

  GetCalendarYear() {
    debugger;

    return this._commonserice.callGetAPI('/HRMS/GetCalendarYear', '' ,'NO');

  }

  SavePayrollApproval(data) {
    debugger
    try {
      return this._commonserice.callPostAPI('/HRMS/AuthoriseEmpPayroll', data);
    }

    catch (e) {
      this._commonserice.showErrorMessage(e);
    }

  }

  getEmployeeDetailsPayrollApproved(MonthYear,BranchId) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('MonthYear',MonthYear).set('BranchId',BranchId);
      return this._commonserice.callGetAPI('/HRMS/GetEmployeeDetailsPayrollApproved',params,"YES");
    }
    catch(e){
      this._commonserice.showErrorMessage(e);
    }
  }

  /////

   ///api/HRMS/GetCalendarYearMonthPayrollAuthorised
   getCalendarYearMonthPayrollAuthorised(CalendarId,empContactId) :Observable<any>{
    debugger;
    const params = new HttpParams().set('CalendarId',CalendarId).set('empContactId',empContactId);
    return this._commonserice.callGetAPI('/HRMS/GetCalendarYearMonthPayrollAuthorised',params,"YES");
  }

  ///api/HRMS/GetCalendarYear
  getCalendarYear() : Observable<any>{
    debugger;
    return this._commonserice.callGetAPI('/HRMS/GetCalendarYear',"","NO");
  }

   GetEmployeeSalaryReimbursement(MonthYear,BranchId) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('MonthYear',MonthYear).set('BranchId',BranchId);
      return this._commonserice.callGetAPI('/HRMS/GetEmployeeSalaryReimbursement',params,"YES");
    }
    catch(e){
      this._commonserice.showErrorMessage(e);
    }
  }
}
