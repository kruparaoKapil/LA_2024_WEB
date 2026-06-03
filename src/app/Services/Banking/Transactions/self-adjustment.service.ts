import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Subject } from 'rxjs'
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class SelfAdjustmentService {
  editdata: any;
  status: any;
  constructor(private _http: HttpClient, private _CommonService: CommonService) { }
  SaveSelfOrAdjustment(Data) {
    debugger
    return this._CommonService.callPostAPI('/Banking/Masters/SelfAdjustment/SaveSelforAdjustment', Data);
  }
  GetSelfOrAdjustment() {

    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/ViewSelfAdjustmendtetails', '', 'NO');
  }
  GetSchemeNames(Branchname) {
    const params = new HttpParams().set('BranchName', Branchname);
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetSchemeType', params, 'YES')
  }
  GetMembers(branchname, fdconfigid) {
    const params = new HttpParams().set('branchname', branchname).set('fdconfigid', fdconfigid);
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetMembers', params, 'YES');
  }
  GetFdAccNumbers(branchname, memberid, fdconfigid) {
    debugger
    const params = new HttpParams().set('branchname', branchname).set('memberid', memberid).set('fdconfigid', fdconfigid);;
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetFdAcnumbers', params, 'YES');
  }
  GetCompanyAdjustment() {
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetCompanyname', '', 'NO')
  }
  GetBranchAdjustment(Companyname) {
    const params = new HttpParams().set('Companyname', Companyname);
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetBranchName', params, 'YES')
  }
  GetBankDetailsForSelf(Contactid) {
    const params = new HttpParams().set('Contactid', Contactid);
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetBankDetails', params, 'YES')
  }
  GetDetailsForEdit(memberid, fdid) {
    const params = new HttpParams().set('memberid', memberid).set('fdid', fdid);
    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetSelfAdjustmendtetailsByid', params, 'YES')
  }
  GetFDBranchDetails() {

    return this._CommonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetFDBranchDetails', '', 'NO')
  }
  _SetEditDetails(data) {
    this.editdata = data
  }
  _GetEditdetails() {
    return this.editdata
  }
  Newformstatus(status) {
    this.status = status
  }
  Newstatus() {
    return this.status
  }
  // /Banking/Transactions/FdReceipt/GetEasychitbranchcao
  getEasyChitBranchCao() {
    return this._CommonService.callGetAPIWithout('/Banking/Transactions/FdReceipt/GetEasychitbranchcao', '', 'NO')
  }
  //Banking/Transactions/FdReceipt/GetEasychitbranch

  getEasyChitBranch() {
    return this._CommonService.callGetAPIWithout('/Banking/Transactions/FdReceipt/GetEasychitbranch', '', 'NO')
  }
  getChitGroupCode(companyname) {
    const params = new HttpParams().set('companyname', companyname);
    return this._CommonService.callGetAPIWithout('/Banking/Transactions/FdReceipt/Getchitgroupcode', params, 'YES')
  }
  SaveProjectionReport(Data):Observable<any> {
    debugger
    return this._CommonService.callPostAPI('/Accounting/AccountingReports/SaveProjectionReport', Data);
  }
  
}
