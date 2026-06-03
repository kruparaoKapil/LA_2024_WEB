import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class RdReceiptService {

  constructor(private commonservice:CommonService) { }
  GetMemberDetails(MemberType)
  {
    debugger
    const params = new HttpParams().set('MemberType', MemberType);
  return this.commonservice.callGetAPI('/Banking/Transactions/RDReceipt/GetMemberDetails',params,'Yes')

  }
   GetAccountDetails(Membercode)
  {
    debugger
    const params = new HttpParams().set('Membercode', Membercode);
  return this.commonservice.callGetAPI('/Banking/Transactions/RDReceipt/GetAccountDetails',params,'Yes')

  }
  GetRDReceiptDetails(FromDate, Todate) {
    const parms = new HttpParams().set('FromDate', FromDate).set('Todate', Todate);
    return this.commonservice.callGetAPI('/Banking/Transactions/RDReceipt/GetRdReceiptDetails', parms, 'Yes');
  }
  GetselectAccountDetails(accountno)
  {
    debugger
    const params = new HttpParams().set('AccountNo', accountno);
  return this.commonservice.callGetAPI('/Banking/Transactions/RDReceipt/GetAccountDetailsByid',params,'Yes')

  }
  GetViewDues(accountno,transdate)
  {
    debugger
    const params = new HttpParams().set('AccountNo', accountno).set('transdate', transdate);
  return this.commonservice.callGetAPI('/Banking/Transactions/RDReceipt/GetViewDues',params,'Yes')

  }
  SaveReceipt(data):Observable<any>{
    debugger;
 try{
 return this.commonservice.callPostAPI('/Banking/Transactions/RDReceipt/SaveRdReceipt',data)
 }
 catch(e){
     this.commonservice.showErrorMessage(e);
 }
}
}
