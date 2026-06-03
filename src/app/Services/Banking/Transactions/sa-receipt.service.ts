import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Subject, Observable } from 'rxjs'
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SAReceiptService {

  constructor(private _CommonService: CommonService) { }

  GetReceiptsandPaymentsLoadingData(formname):Observable<any> {
        const params = new HttpParams().set('formname', formname);
        return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetReceiptsandPaymentsLoadingData', params, 'YES');
    }
    SaveMemberReceipt(data):Observable<any> {
        return this._CommonService.callPostAPI('/Banking/Transactions/SDReceipt/SaveMemberReceipt',data);
    }
    GetSavingAccountNames():Observable<any> {
    debugger;
    try{
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetSavingAccountNameDetails','', 'NO')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  GetSavingAccountNumbers(SavingConfigid):Observable<any>{
       debugger;
    try{
    const params = new HttpParams().set('SavingConfigid', SavingConfigid);
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetSavingAccountNumberDetails',params , 'YES')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  getTransactionDetails(SavingAccountId):Observable<any>{
       debugger;
    try{
    const params = new HttpParams().set('SavingAccountId', SavingAccountId);
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetSavingTransaction',params , 'YES')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  SaveSAReceipt(data):Observable<any>{
       debugger;
    try{
    return this._CommonService.callPostAPI('/Banking/Transactions/SDReceipt/SaveSavingsReceipt',data)
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  GetSavingReceiptDetails(FromDate,Todate):Observable<any> {
    debugger
    const params = new HttpParams().set('FromDate', FromDate).set('Todate', Todate)
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetSavingReceiptView', params, 'YES')

  }
  
  GetShareAccountNames():Observable<any> {
    debugger;
    try{
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetShareAccountNameDetails','', 'NO')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  
  GetShareAccountNumbers(ShareConfigid):Observable<any>{
       debugger;
    try{
    const params = new HttpParams().set('ShareConfigid', ShareConfigid);
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetShareAccountNumberDetails',params , 'YES')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  getShareAccountTransactionDetails(ShareAccountId):Observable<any>{
       debugger;
    try{
    const params = new HttpParams().set('ShareAccountId', ShareAccountId);
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetShareTransaction',params , 'YES')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  SaveShareReceipt(data):Observable<any>{
       debugger;
    try{
    return this._CommonService.callPostAPI('/Banking/Transactions/SDReceipt/SaveShareReceipt',data)
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }
  GetShareReceiptDetails(FromDate,Todate):Observable<any> {
    debugger
    const params = new HttpParams().set('FromDate', FromDate).set('Todate', Todate)
    return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetShareReceiptView', params, 'YES')
  }
  GetSAvingsAccountDetails(Membercode):Observable<any>{
       debugger;
    try{
    const params = new HttpParams().set('Membercode', Membercode);
    return this._CommonService.callGetAPI('/Banking/Transactions/RDReceipt/GetAdjustmentDetils',params , 'YES')
    }
    catch(e){
        this._CommonService.showErrorMessage(e);
    }
  }

  getViewBalanceAmout(SavingAccountId):Observable<any>{
    debugger;
 try{
 const params = new HttpParams().set('accountid', SavingAccountId);
 return this._CommonService.callGetAPI('/Banking/Transactions/Withdraw/ViewBalanceAmout',params , 'YES')
 }
 catch(e){
     this._CommonService.showErrorMessage(e);
 }
}
GetWithDrawalTransaction(SavingAccountId):Observable<any>{
  debugger;
try{
const params = new HttpParams().set('accountid', SavingAccountId);
return this._CommonService.callGetAPI('/Banking/Transactions/Withdraw/GetWithDrawalTransaction',params , 'YES')
}
catch(e){
   this._CommonService.showErrorMessage(e);
}
}
GetSavingAccountType():Observable<any> {
  debugger;
  try{
  return this._CommonService.callGetAPI('/Banking/Transactions/SDReceipt/GetSavingAccountNameDetails','', 'NO')
  }
  catch(e){
      this._CommonService.showErrorMessage(e);
  }
}
}
