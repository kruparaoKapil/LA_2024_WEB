import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
familyDetails:any;
employeeId:any;
tabname:any;
buttonstatus:any;
  constructor(private _CommonService:CommonService) { }

  private Data = new Subject<any>();

 getFamilyDetailsForm(data){
  this.familyDetails=data;
 }

 sendFamilyDetailsForm(){
   return this.familyDetails;
 }

 getTitleOnClick(title)
 {
   
   this.tabname=title;
 }
 
 sendTitle(){
   return this.tabname;
 }

 GetButtonStatus(data){
    this.buttonstatus=data;
 }

 SendButtonStatus(){
    return this.buttonstatus;
 }

 GetEmployeeIdForUpdate(id){
   this.employeeId=id;
 }

 SendEmployeeIdForUpdate(){
   
   return this.employeeId;
 }

 SaveEmployeeRole(data){
  return this._CommonService.callPostAPI('/Settings/Employee/SaveEmployeeRole', data)
 }

 GetEmployeeDetails():Observable<any>{
   
 // const params = new HttpParams().set('Type', data);
  return this._CommonService.callGetAPI('/Settings/Employee/GetallEmployeeDetails','', 'NO')
 }

 SaveEmployeeForm(data){
   
   return this._CommonService.callPostAPI('/Settings/Employee/SaveEmployeeDetails', data)
 }

 GetDetailsForUpdate(id){
  const params = new HttpParams().set('employeeID', id)
  return this._CommonService.callGetAPI('/Settings/Employee/GetEmployeeDetailsOnId', params, 'YES')
 }

 UpdateEmployeeForm(data){
  return this._CommonService.callPostAPI('/Settings/Employee/updateEmployee', data)
 }
 
 CheckDuplicates(data){
  return this._CommonService.callPostAPI('/Settings/Employee/checkEmployeeCountinMaster', data)
 }
 
CheckEmployeeRoleDuplicates(name){
 let path='/Settings/Employee/checkEmployeeRoleExistsOrNot?Rolename=' + name;
  return this._CommonService.callPostAPIMultipleParameters(path)
}
  _SetButtonShowHide() {
   this.Data.next();
 }
 _GetButtonShowHide(): Observable<any> {
   return this.Data.asObservable();
}

}
