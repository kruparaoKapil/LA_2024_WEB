import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LienEntryService {
  Data: any;
  ButtonClickType: any;
    constructor(private commonservice: CommonService) { }



  GetFdDetails(Memberid, BranchName, type)
    {
    const params = new HttpParams().set('Memberid', Memberid).set('chitbranchname', BranchName).set('type', type);
  return this.commonservice.callGetAPI('/banking/masters/LienEntry/Getfddetails',params,'Yes')

  }
  GetMemberDetails(BranchName) {
    const params = new HttpParams().set('chitbranchname', BranchName);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetMemberDetails', params, 'Yes')

  }
  GetBranchDetails(){
    return this.commonservice.callGetAPI('/Banking/GetchitBranchDetails','','No')
  }
  GetBranchDetails1(){
    return this.commonservice.callGetAPI('/Banking/GetchitBranchDetails1','','No')
  }
  GetMemberFdDetails(Memberid,Fdaccountno){
    const params = new HttpParams().set('Memberid', Memberid).set('Fdraccountno', Fdaccountno);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/Getmemberfddetails',params,'Yes')
  }
  SaveLienEntry(data){
return this.commonservice.callPostAPI('/banking/masters/LienEntry/SaveLienentry',data);
  }

​//api​/banking​/masters​/LienEntry​/SaveLienentry1
SaveLienEntry1(data){
  return this.commonservice.callPostAPI('/banking/masters/LienEntry/SaveLienentry1',data);
    }

    SaveLienEntry2(data){
      return this.commonservice.callPostAPI('/banking/masters/LienEntry/SaveLienentry2',data);
        }
    ///api/banking/masters/LienEntry/GetLienentryById
    GetLienentryById(LienentrtByID) {
      const params = new HttpParams().set('LienentrtByID', LienentrtByID);
      return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetLienentryById', params, 'Yes');
    }

    GetLienentryById1(Lienids) {
      const params = new HttpParams().set('Lienids', Lienids);
      return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetLienentryById1', params, 'Yes');
    }
  GetLienMaingridView(){
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/Lienviewdata','','No');
  }
  GetLienEntryData(Lienid) {
    const params = new HttpParams().set('Lienid', Lienid);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetLienentryforEdit', params, 'Yes');
  }
  DeleteLienEntry(Lienid) {
    const params = new HttpParams().set('Lienid', Lienid);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/DeleteLienEntry', params, 'Yes');
  }
  GetLienMembers(Branchname) {
    const params = new HttpParams().set('Branchname', Branchname);
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/LienReleaseMembercode', params, 'Yes');
  }
  GetLienFdAccountNos(Membercode, BranchName) {
    const params = new HttpParams().set('Membercode', Membercode).set('BranchName', BranchName);
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/LienReleaseMemberfd', params, 'Yes');
  }
  GetLienReleaseData(Membercode, Fdraccountno, LienDate) {
    const params = new HttpParams().set('Membercode', Membercode).set('Fdraccountno', Fdraccountno).set('LienDate', LienDate);
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/GetLienreleasedata', params, 'Yes');
  }
  SaveLienRelease(data) {
    return this.commonservice.callPostAPI('/banking/Transactions/LienReleaseTransactions/SaveLienreleaseentry', data);
  }
  GetLienReleaseMaingridView() {
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/Lienreleaseviewdata', '', 'No');
  }
  DeleteLienRelease(Lienid) {
    const params = new HttpParams().set('Lienid', Lienid);
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/DeleteLienreleaseentry', params, 'Yes');
  }
  GetLiendata(Fdaccountno) {
    const params = new HttpParams().set('Fdaccountno', Fdaccountno);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetLiendata', params, 'Yes');
  }
  GetFDBranchDetails() {
    // const parms = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this.commonservice.callGetAPI('/banking/masters/LienEntry/GetFDBranchDetails', '', 'No');
  }
  GetLienReleaseBranches() {
    // const parms = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this.commonservice.callGetAPI('/banking/Transactions/LienReleaseTransactions/GetBranches', '', 'No');
  }
  SetLienEntryDataForEdit(data) {
    this.Data = data
  }
  GetLienEntryDataForEdit() {
    return this.Data;
  }
  SetButtonClickType(type) {
    debugger
    this.ButtonClickType = type
  }
  GetButtonClickType() {
    return this.ButtonClickType
    }



    GetSchemedetails() {
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetSchemename', '', 'No')

    }
    GetCompanydetails() {
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetCompany', '', 'No')

    }
    GetBranchDetailsIP(companyname) {
        const params = new HttpParams().set('companyname', companyname);
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetBranchName', params, 'Yes')

    }
    //Banking/Transactions/IntrestPayment/GetBranchName1
    GetBranchName1(companyname) {
      const params = new HttpParams().set('companyname', companyname);
      return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetBranchName1', params, 'Yes')

  }
    RunInterestPaymentFunction() {
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/RunInterestPaymentFunction', '', 'No')

    }
    GetShowmemberdetails(schemeid, paymenttype, companyname, branchname, forthemonth) {
        const params = new HttpParams().set('schemeid', schemeid).set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname).set('forthemonth', forthemonth);
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetMemberPaymenthistory', params, 'Yes')

    }
    GetInterestReport(forthemonth,schemeid, paymenttype, companyname, branchname)
    {
      const params = new HttpParams().set('forthemonth', forthemonth).set('schemeid', schemeid).set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname);
      return this.commonservice.callGetAPI('/Banking/Report/LAReports/interestreport', params, 'Yes')
    }
    GetShowInterestPaymentReport(schemeid, paymenttype, companyname, branchname, pdatecheked, frommonthof, tomonthof, type,accountno) {
        const params = new HttpParams().set('schemeid', schemeid).set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname).set('pdatecheked', pdatecheked).set('frommonthof', frommonthof).set('tomonthof', tomonthof).set('type', type).set('fdaccountno', accountno);
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetShowInterestPaymentReport', params, 'Yes')

    }
    GetShowmemberdetails1(splitData) {
        const params = new HttpParams().set('splitData', splitData);
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetMemberPaymenthistory1', params, 'Yes')

    }
    GetShowInterestpaymentdetailsforview() {
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetShowInterestpaymentdetailsforview', '', 'No')

    }
    saveInterestPayment(data) {
        return this.commonservice.callPostAPI('/Banking/Transactions/IntrestPayment/SaveInterestPayment', data)
    }

    ShowPromoterSalaryDetails(agentid, asondate) {
        const params = new HttpParams().set('agentid', agentid).set('asondate', asondate);
        return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/ShowPromoterSalaryDetails', params, 'Yes')

    }
    // api/Banking/Transactions/CommissionPayment/ShowPromoterSalaryDetails1

    ShowPromoterSalaryDetails1(agentid, monthyear) {
      const params = new HttpParams().set('agentid', agentid).set('monthyear', monthyear);
      return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/ShowPromoterSalaryDetails1', params, 'Yes')

  }


    ShowPromoterSalaryReport(agentid, frommonthof, tomonthof, type, pdatecheked) {
        const params = new HttpParams().set('agentid', agentid).set('frommonthof', frommonthof).set('tomonthof', tomonthof).set('type', type).set('pdatecheked', pdatecheked);
        return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/ShowPromoterSalaryReport', params, 'Yes')

    }
    GetAgentDetails() {
        return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/GetAgentDetails', '', 'No')

    }
    SaveCommisionPayment(data) {
        return this.commonservice.callPostAPI('/Banking/Transactions/CommissionPayment/SaveCommisionPayment', data)
    }
    GetAgentContactDetails(agentid) {
        const params = new HttpParams().set('agentid', agentid);
        return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/GetAgentContactDetails', params, 'Yes')

    }
    GetBankDetails(agentid)
    {
      const params = new HttpParams().set('agentid', agentid);
      return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/GetAgentBankDetails', params, 'Yes')

    }
    GetViewCommisionpaymentdetails() {
        return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/GetViewCommisionpaymentdetails', '', 'No')

    }
    GetCPAdjustmentDetils(contactid) {
      const params = new HttpParams().set('contactid', contactid);
      return this.commonservice.callGetAPI('/Banking/Transactions/CommissionPayment/GetCPAdjustmentDetils',params, 'Yes')

  }
//Accounting/AccountingTransactions/GetLedgerBalance
getLedgerBalance(accountid) {
    const params = new HttpParams().set('accountid', accountid);
    return this.commonservice.callGetAPI('/Accounting/AccountingTransactions/GetLedgerBalance',params, 'Yes')

}


// GetInterestReport1(forthemonth,schemeid, paymenttype, companyname, branchname)
// {
//   const params = new HttpParams().set('forthemonth', forthemonth).set('schemeid', schemeid).set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname);
//   return this.commonservice.callGetAPI('/Banking/Report/LAReports/interestreport1', params, 'Yes')
// }
GetInterestReport1(forthemonth, schemeid, paymenttype, companyname, branchname, bankname) {

  const params = new HttpParams()
    .set('forthemonth', forthemonth)
    .set('schemeid', schemeid)
    .set('paymenttype', paymenttype)
    .set('companyname', companyname)
    .set('branchname', branchname)
    .set('bankname', bankname);

  return this.commonservice.callGetAPI(
    '/Banking/Report/LAReports/interestreport1',
    params,
    'Yes'
  );
}

 GetBankNames() {
        return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetBankNames', '', 'No')

    }




}
