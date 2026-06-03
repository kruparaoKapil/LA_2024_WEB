import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembrEnquiryService {

  constructor(private _commonservice:CommonService) { }

  GetMemberDetailsList() {
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberDetails', '', 'NO')
  }
  
 GetMemberTransactions(Memberid) {
  const params = new HttpParams().set('Memberid', Memberid);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberTransactions',params,'Yes')
  }
  GetMemberShareDetails(Memberid) {
  const params = new HttpParams().set('Memberid', Memberid);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetShareAccountDetais',params,'Yes')
  }
  GetMemberSavingAccountDetails(Memberid) {
  const params = new HttpParams().set('Memberid', Memberid);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetSavingAccountDetais',params,'Yes')
  }
  GetRDAccountDetails(Memberid) {
  const params = new HttpParams().set('Memberid', Memberid);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetRDDetais',params,'Yes')
  }
  GetSavinaccountDetailsReport(accountno)
  {
    const params = new HttpParams().set('accountno', accountno);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetSavinaccountDetailsReport',params,'Yes')
  }
  GetRDDetailsReport(accountno)
  {
    const params = new HttpParams().set('accountno', accountno);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetRDDetailsReport',params,'Yes')
  }
  GetMemberReceiptDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
  return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberReceiptDetails',params,'Yes')
  }
  GetMemberShareReceiptDetails(accountno)
    {
        const params = new HttpParams().set('accountno', accountno);
        return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetShareDetailsReport', params, 'Yes');
    }
  GetMemberNomineeDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberNomineeDetails',params,'Yes')
  }
  GetMemberInterestPaymentDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberInterestPaymentDetails',params,'Yes')
  }
  GetMemberPromoterSalaryDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberPromoterSalaryDetails',params,'Yes')
  }
  GetMemberLiensDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberLiensDetails',params,'Yes')
  }
  GetMemberMaturityBondsDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberMaturityBondsDetails',params,'Yes')
  }
  GetMemberMaturityPaymentsDetails(FdAccountNo)
  {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberMaturityPaymentsDetails',params,'Yes')
  }
  GetApplicationFdnames()
  {
    return this._commonservice.callGetAPI('/Banking/Report/LAReports/GetApplicationFdnames', '', 'NO')
  }
}
