import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';
@Injectable({
  providedIn: 'root'
})
export class SscAgendaService 
{
  recordid:any;
   status:any;
   adressdetails:any;
   employeeEditData : any;
   employeeEditDataStatus : any;
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  // /api/HRMS/getSSCAgendaEmployeeDetails
 
  
  getSSCAgendaEmployeeDetails(sscagendatype) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set("sscagendatype",sscagendatype);
      return this._CommonService.callGetAPI('/HRMS/getSSCAgendaEmployeeDetails',params,"YES");
    }
    catch (e){
      this._CommonService.showErrorMessage(e);
    }
  } 

  GetDesignations() :Observable<any>{
    debugger;
    return this._CommonService.callGetAPI('/HRMS/GetDesignations','',"NO");
  }

//api/HRMS/GetDesignations
 getDesignations(): Observable<any> {    
    return this._CommonService.callGetAPI('/HRMS/GetDesignations', '', 'NO')
  }

  //api/HRMS/SaveSscAgenda

  saveSscAgenda(sscAgentData) {
    
    return this._CommonService.callPostAPI('/HRMS/SaveSscAgenda', sscAgentData)
  }


  // ====================================

  getEmployeeDesignations() : Observable<any>{
    debugger;
    return this._CommonService.callGetAPI('/HRMS/GetDesignations','','NO');
  }

  getEmployeeRoles() : Observable<any>{
    debugger;
    try{
      return this._CommonService.callGetAPI('/HRMS/Getroles','','NO');
    }
    catch (e){
      this._CommonService.showErrorMessage(e);
    }
  }
///api/Common/GetBranchNames

GetBranchNames() : Observable<any>{
    debugger;
    return this._CommonService.callGetAPI('/HRMS/GetBranchNames','','NO');
  }

  ///api/Common/getRelationShip

  getRelationShip() : Observable<any>{
    debugger;
    return this._CommonService.callGetAPI('/HRMS/getRelationShip','','NO');
  }
  //Configuration/GlobalConfiguration/ViewQualificationDetails

  ViewQualificationDetails() : Observable<any>{
    debugger;
    return this._CommonService.callGetAPI('/HRMS/ViewQualificationDetails','','NO');
  }

  SaveContactEmployee(data) : Observable<any>{
    debugger;
    try{
      return this._CommonService.callPostAPI('/HRMS/SaveContactEmployee',data);
    }
    catch (e){
      this._CommonService.showErrorMessage(e);
    }
  }


  SaveSscAgenda(data):Observable<any>{
    debugger;
    try{
      return this._CommonService.callPostAPI('/HRMS/SaveSscAgenda',data);
    }
    catch (e){
      this._CommonService.showErrorMessage(e);
    }
  }

  saveEmployeeSalaryUpdate(data) : Observable<any>{
    debugger;
    try{
      return this._CommonService.callPostAPI('/HRMS/saveEmployeeSalaryUpdate',data);
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }

  getSSCAgendaExistingornot(empid,ssagendatype) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('employeeid',empid).set('sscagendatype',ssagendatype)
      return this._CommonService.callGetAPI('/HRMS/GetSSCAgendaExistingornot',params,"YES");
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/HRMS/ViewEmployeedetails
  viewEmployeedetails() : Observable<any>{
    debugger;
    try{
      return this._CommonService.callGetAPI('/HRMS/ViewEmployeedetails',"","No");
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  } 
 
  //api/HRMS/GetEmployeedetailsbyid
  getEmployeedetailsbyid(empid){
    debugger;
    try{
      const params = new HttpParams().set('empid',empid);
      return this._CommonService.callGetAPI('/HRMS/GetEmployeedetailsbyid',params,"YES");
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }

  _setemployeeEditData(data){
    debugger;
    this.employeeEditData = data;
  }

  _setEmployeeEditDataStatus(status){
    debugger;
    this.employeeEditDataStatus = status;
  }

  _getEmployeeEditDataStatus(){
    debugger;
    return this.employeeEditDataStatus;
  }

  _getEmployeeEditData(){
    debugger;
    return this.employeeEditData;
  }
}
