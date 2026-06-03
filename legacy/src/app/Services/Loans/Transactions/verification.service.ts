import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  Telecerification: any;
  Documentverification: any;
  Fieldverification: any;
  returnFormData: any;

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });


  constructor(private commonService: CommonService) { }

  _addDataToVerification(Data, FormName) {
    
    if (FormName == "Televerification") { this.Telecerification = Data }
    if (FormName == "DocumentVerification") { this.Documentverification = Data }
    if (FormName == "FieldVerification") { this.Fieldverification = Data }

  }


  _getDatafromVerification(FormName) {
    
    if (FormName == "Televerification") { this.returnFormData = this.Telecerification  }
    if (FormName == "DocumentVerification") { this.returnFormData = this.Documentverification }
    if (FormName == "FieldVerification") { this.returnFormData = this.Fieldverification }

    return this.returnFormData;
  }


  GetVerificationdetails(Id) {
    const params = new HttpParams().set('strapplicationid', Id);
    return this.commonService.callGetAPI('/loans/Transactions/Verification/GetVerificationDetails', params, 'YES');

  }
  GetFieldverificationdetails(Id) {
    const params = new HttpParams().set('strapplicationid', Id);
    return this.commonService.callGetAPI('/loans/Transactions/Verification/GetFieldVerificationDetails', params, 'YES');

  }
  GetFiDocumentsToVerify(Id) {
    const params = new HttpParams().set('strapplicationid', Id);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFiDocumentlDetails', params, 'YES');

  }

  GetAllApplicantVerificationDetails(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Verification/GetAllApplicantVerificationDetails', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  GetEmployees(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/Settings/Employee/GetallEmployeeDetails', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  SaveTeleVerification(data): Observable<any> {

    try {
  
      return this.commonService.callPostAPI('/loans/Transactions/Verification/SaveVerificationDetails', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  SaveFieldVerification(data): Observable<any> {

    try {

      return this.commonService.callPostAPI('/loans/Transactions/Verification/Savefieldverification', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  SaveDocumentVerification(data): Observable<any> {

    try {

      return this.commonService.callPostAPI('/loans/Transactions/Verification/SaveFIVerificationDetails', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  GetPanValidStatus() {
  try {
    return this.commonService.callGetAPI('/Banking/Transactions/FdReceipt/GetPanValidStatus', '', 'NO');
  }
  catch (errormssg) {
    this.commonService.showErrorMessage(errormssg);
  }
}
GetPanValidDetails(searchtext,searchtype){
  debugger;
  try{
    const params=new HttpParams().set('searchtext',searchtext).set('searchtype',searchtype)
    return this.commonService.callGetAPI('/Banking/GetPanValidDetails',params,'YES');
  }
  catch(errormssg){
    this.commonService.showErrorMessage(errormssg);
  }
}
SavePanValidDetails(PanValidId,ContactId,UserId,pipaddress,DocumentFileName,GuidFileName,ApprovedBy,searchtype){
  try {
    debugger
    return this.commonService.callPostAPI('/Banking/Transactions/FdReceipt/SavePanValidDetails?PanValidId='+PanValidId+'&ContactId='+ContactId+'&UserId='+UserId+'&pipaddress='+pipaddress+'&DocumentFileName='+DocumentFileName+'&GuidFileName=' + GuidFileName +'&ApprovedBy='+ApprovedBy+'&searchtype='+searchtype, {});
  }
  catch (errormssg) {
    this.commonService.showErrorMessage(errormssg);
  }
}
 getEmployeeName(searchtype) {    

  debugger
  const params = new HttpParams().set("searchtype",searchtype);
  return this.commonService.callGetAPI("/HRMS/GetSubInterducedDetails", params, 'YES');
}
   GetAuthorizedforform121(searchtype) {    
  debugger
  const params = new HttpParams().set("searchtype",searchtype);
  return this.commonService.callGetAPI("/Banking/Transactions/FdReceipt/GetAuthorizedforform121", params, 'YES');
}
  GetSubscriberContactDetails(searchtype, formName, localSchema): Observable<any> {

    const params = new HttpParams().set('searchtype', searchtype).set('formName', formName).set('localSchema', localSchema);

    return this.commonService.callGetAPI('/Subscriber/GetSubscriberContactDetails', params, 'YES');
    // return this._CommonService.getAPI('/Subscriber/GetSubscriberContactDetails', '', 'NO');
  }
//     GetCompanynames1() {
//   return this.commonService.callGetAPI('/ChitTransactions/GetCompanynames', '', 'NO');
// }
GetUidForEdit(){
   return this.commonService.callGetAPI('/ChitTransactions/GetUidForEdit', '', 'NO');
}
}
