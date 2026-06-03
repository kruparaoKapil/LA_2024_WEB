import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'

@Injectable({
  providedIn: 'root'
})
export class SavingtranscationService {
  AccountNoAndId: any;
  ButtonClickType: any;
  Data: any;
  constructor(private commonservice:CommonService) 
  { }
  GetMemberDetails(MemberTypeId,contactType)
  {
    debugger
    const params = new HttpParams().set('MemberTypeId', MemberTypeId).set('contactType',contactType);
  return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetMemberDetails',params,'Yes')

  }
  GetContactDetails(MemberID) {
    debugger
    const params = new HttpParams().set('MemberID', MemberID);
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetContactDetails', params, 'Yes')

  }
  GetSavingAccountDetails(Membertypeid, Applicanttype, SavingType)
  {
    const params = new HttpParams().set('Membertypeid', Membertypeid).set('Applicanttype', Applicanttype).set('Type', SavingType);
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetSavingAccountDetails', params, 'Yes')
  }
  GetSavingAccountConfigDetails(Savingconfigid,Membertypeid,Applicanttype, SavingType)
  {
    const params = new HttpParams().set('Savingconfigid', Savingconfigid).set('Membertypeid',Membertypeid).set('Applicanttype',Applicanttype).set('Type', SavingType);
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetSavingAccountConfigDetails',params,'Yes')
  }
  CheckMemberDuplicates(Memberid, savingaccountid):Observable<any> {
    const params = new HttpParams().set('Memberid', Memberid).set('savingaccountid', savingaccountid);
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/CheckMemberDuplicates', params, 'Yes')
  }
  SaveSavingAccountTransaction(Data) {
    debugger
    //return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
    return this.commonservice.callPostAPI('/Banking/Transactions/SavingTransaction/SaveSavingAccountTransaction', Data);
  }
  SaveJointmemberAndNominee(Data) {
    debugger
    //return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
    return this.commonservice.callPostAPI('/Banking/Transactions/SavingTransaction/SaveJointmemberAndNominee', Data);
  }
  SaveReferral(Data) {
    debugger
    //return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
    return this.commonservice.callPostAPI('/Banking/Transactions/SavingTransaction/SaveReferral', Data);
  }
  GetSavingAccountTransactionMainGrid() {
    debugger
    
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetSavingAccountTransactionMainGrid', '', 'No')

  }
  SetAccountNoAndId(data) {
    this.AccountNoAndId = data
  }
  GetAccountNoAndId() {
    return this.AccountNoAndId;
  }
  GetSavingAccountTransDetails(SavingAccountId,accounttype,savingsaccountNo) {
    debugger
    const params = new HttpParams().set('SavingAccountId', SavingAccountId).set('accounttype', accounttype).set('savingsaccountNo', savingsaccountNo);
    return this.commonservice.callGetAPI('/Banking/Transactions/SavingTransaction/GetSavingAccountTransDetails', params, 'Yes')

  }
  DeleteSavingTransaction(savingAccountid, modifiedby) {
    let data = { 'pSavingaccountid': savingAccountid, 'pCreatedby': modifiedby }
    return this.commonservice.callPostAPI('/Banking/Transactions/SavingTransaction/DeleteSavingAccountTrans', data)
  }

  SetButtonClickType(type) {
    debugger
    this.ButtonClickType = type
  }
  GetButtonClickType() {
    return this.ButtonClickType
  }
  SetSavingTransactionDetailsForEdit(data) {
    this.Data = data
  }
  GetSavingTransactionDetailsForEdit() {
    return this.Data
  }
  GetSavingAccountWithDrawalsDetails(Fromdate,Todate): Observable<any> {
    debugger
    const params = new HttpParams().set('FromDate', Fromdate).set('Todate', Todate)
    return this.commonservice.callGetAPI('/Banking/Transactions/Withdraw/ViewSavingAccountWithDrawals', params, 'YES')

  }
  SaveSavingAccountWithdrwals(data):Observable<any>{
    debugger;
 try{
 return this.commonservice.callPostAPI('/Banking/Transactions/Withdraw/SaveSavingAccountWithdrwals',data)
 }
 catch(e){
     this.commonservice.showErrorMessage(e);
 }
}
}
