import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JvDetailsService {

  constructor(private _commonserice : CommonService) { }

  ///api/HRMS/getEmployeeDetails

  getEmployeeDetails(branchid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('BranchId',branchid);
    return this._commonserice.callGetAPI('/HRMS/getEmployeeDetails',params,"YES");
  }


  ///api/HRMS/GetCalendarYear

  getCalendarYear() : Observable<any>{
    debugger;
    return this._commonserice.callGetAPI('/HRMS/GetCalendarYear','',"NO");
  }


  ///api​/HRMS​/GetCalendarYearMonthPayrollAuthorised

  getCalendarYearMonthPayrollAuthorised(calenderid,empcontactid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('CalendarId',calenderid).set('empContactId',empcontactid);
    return this._commonserice.callGetAPI('/HRMS/GetCalendarYearMonthPayrollAuthorised',params,"YES");
  }


  ///api/HRMS/GetAllowanceTypes_jvtypes

  getAllowanceTypes_jvtypes() : Observable<any>{
    debugger;
    return this._commonserice.callGetAPI('/HRMS/GetAllowanceTypes_jvtypes','',"NO");
  }


  ///api/HRMS/GetJVDetailsByType

  getJVDetailsByType(jvtype,monthyear,empcode) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('JVType',jvtype).set('MonthYear',monthyear).set('EmployeeCode',empcode);
      return this._commonserice.callGetAPI('/HRMS/GetJVDetailsByType',params,"YES");
    }
    catch (e){
      this._commonserice.showErrorMessage(e);
    }
  }


  ///api/HRMS/GetJVDetailsDuplicateCheck

  getJVDetailsDuplicateCheck(jvtype,monthyear) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('JVType',jvtype).set('MonthYear',monthyear);
      return this._commonserice.callGetAPI('/HRMS/GetJVDetailsDuplicateCheck',params,"YES");
    }
    catch (e){
      this._commonserice.showErrorMessage(e);
    }
  }

  
  //api/HRMS/SaveJVDetails
  saveJvDetails(data) :Observable<any>{
    debugger;
    try{
      return this._commonserice.callPostAPI('/HRMS/SaveJVDetails',data);
    }
    catch (e){
      this._commonserice.showErrorMessage(e);
    }
  }

  // saveJvDetails(data): Observable<any> {
  //   debugger;
  //   return this._commonserice.callPostAPI('/HRMS/SaveJVDetails', data).pipe(
  //     timeout(100000),
  //     catchError(err => {
  //       console.error('API call timed out', err);
  //       return of(null);
  //     })
  //   );
  // }
}
