import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeOnrollService {

  constructor(private _commonservice : CommonService) { }

  ///api/HRMS/getEmployeeDetails

  getEmployeeDetails(pbranch_id) : Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('BranchId',pbranch_id);
      return this._commonservice.callGetAPI('/HRMS/getEmployeeDetailsOnroll',params,"YES");
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
  }

  ///api​/HRMS​/GetAllowanceTypes

  GetAllowanceTypes() :Observable<any>{
    debugger;
    return this._commonservice.callGetAPI('/HRMS/GetAllowanceTypes','',"NO");
  }

  //api/HRMS/GetAllowanceDetails

  GetAllowanceDetails(empid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('employeecontactid',empid);
    return this._commonservice.callGetAPI('/HRMS/GetAllowanceDetails',params,"YES");
  }


  //api/HRMS/GetSubInterducedDetails

  GetSubInterducedDetails(){
    debugger;
    return this._commonservice.callGetAPI('/HRMS/GetSubInterducedDetails','',"NO");
  }

  ///api/HRMS/SaveAllowanceDetails

  SaveAllowanceDetails(data){
    debugger;
    try{
      return this._commonservice.callPostAPI('/HRMS/SaveAllowanceDetails',data);
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
  }

  //HRMS//DeleteAllowance 

  deleteAllowanceDetails(allowanceid){
    return this._commonservice.callPostAPI('/HRMS/DeleteAllowance?allowanceid='+allowanceid, '');  
  }

  ///api/HRMS/GetRecoveryTypes

  GetRecoveryTypes() :Observable<any>{
    debugger;
    return this._commonservice.callGetAPI('/HRMS/GetRecoveryTypes','',"NO");
  }

  //api/HRMS/SaveRecoveryDetails

  SaveRecoveryDetails(data) :Observable<any>{
    debugger;
    try{
      return this._commonservice.callPostAPI('/HRMS/SaveRecoveryDetails',data);
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
  }

  ///api/HRMS/GetAdvanceTypes

  GetAdvanceTypes() :Observable<any>{
    debugger;
    return this._commonservice.callGetAPI('/HRMS/GetAdvanceTypes','',"NO");
  }

  //api/HRMS/SaveAdvanceDetails

  SaveAdvanceDetails(data) : Observable<any>{
    debugger;
    try{
      return this._commonservice.callPostAPI('/HRMS/SaveAdvanceDetails',data);
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
  }


//api/HRMS/GetAdvanceDetails

GetAdvanceDetails(empid): Observable<any>{
debugger;
const params = new HttpParams().set('employeecontactid',empid);
return this._commonservice.callGetAPI('/HRMS/GetAdvanceDetails',params,"YES");
}

deleteAdvanceDetails(advanceid){
  return this._commonservice.callPostAPI('/HRMS/DeleteAdvance?advanceid='+advanceid, '');  
}


//api/HRMS/GetRecoveryDetails

GetRecoveryDetails(empid) :Observable<any>{
  debugger;
const params = new HttpParams().set('employeecontactid',empid);
return this._commonservice.callGetAPI('/HRMS/GetRecoveryDetails',params,"YES");
}

deleteRecoveryDetails(recoveryid){
  return this._commonservice.callPostAPI('/HRMS/DeleteRecovery?recoveryid='+recoveryid, '');  
}

}
