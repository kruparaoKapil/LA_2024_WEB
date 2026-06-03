import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Subject, Observable } from 'rxjs'
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaturityPaymentService {
  ButtonClickType: any;
  MaturityPayment: any;
  constructor(private _commonService: CommonService) { }

  GetDepositIds(BranchName, MaturityType, Schemeid) {
    const parms = new HttpParams().set("BranchName", BranchName).set("MaturityType", MaturityType).set("Schemeid", Schemeid);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetDepositIds', parms, 'Yes');
  }
  GetPreMaturityDetails(FDAccountno, Date, type) {
    const parms = new HttpParams().set("FDAccountno", FDAccountno).set("Date", Date).set("type", type);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetPreMaturityDetails', parms, 'Yes');
  }
  GetSchemeNames() {
    return this._commonService.callGetAPI('/Banking/Masters/SelfAdjustment/GetSchemeType', '', 'NO')
  }
  GetMaturityBondView() {
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityBondView', '', 'NO')
  }
  SaveMaturityBond(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturitybond', data)
  }
  GetSchemeNamesNew(BranchName, MaturityType) {
    const parms = new HttpParams().set("BranchName", BranchName).set("MaturityType", MaturityType);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetSchemeType', parms, 'Yes')
  }
  GetMaturityBranchDetails(MaturityType) {
    const parms = new HttpParams().set("MaturityType", MaturityType);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityBranchDetails', parms, 'Yes')
  }
  GetMaturityMembers(PaymentType, Depositype) {
    const parms = new HttpParams().set("PaymentType", PaymentType).set("Depositype", Depositype);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityMembers', parms, 'Yes')
  }

    Getdelayinterestmembers(PaymentType, Depositype) {
    const parms = new HttpParams().set("PaymentType", PaymentType).set("Depositype", Depositype);
    return this._commonService.callGetAPI('/Banking/Transactions/Delayinterest/Getdelayinterestmembers', parms, 'Yes')
  }

  GetMaturityMembersForDuplicate(PaymentType, Depositype, membername) {
    const parms = new HttpParams().set("PaymentType", PaymentType).set("Depositype", Depositype).set("membername", membername);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityMembers', parms, 'Yes')
  }
  //Banking/Transactions/MaturityPayment/GetRenwalMembers

  getRenwalMembers(Depositype) {
    const parms = new HttpParams().set("Depositype", Depositype);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetRenwalMembers', parms, 'Yes')
  }

  GetMaturityDelayFdDetails(PaymentType, Memberid, Date) {
    const parms = new HttpParams().set("PaymentType", PaymentType).set("Memberid", Memberid).set("Date", Date);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetDelayInterestFdDetails', parms, 'Yes')
  }

GetMaturityFdDetails(PaymentType, Memberid, Date) {
    const parms = new HttpParams().set("PaymentType", PaymentType).set("Memberid", Memberid).set("Date", Date);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityFdDetails', parms, 'Yes')
  }
  GetMaturityPaymentDetailsView() {
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityPaymentView', '', 'NO')
  }
  SaveMaturityPayment(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturityPayment', data)
  }

   SaveDelayIntrest(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/DelayInterest/SaveDelayInterest', data)
  }
  SaveMaturityPaymentForAdjustment(data) {
    try {
      return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturityPaymentAdjustment', data)
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  GetFdTransactionDetails(FdAccountNo) {
    const parms = new HttpParams().set("FdAccountNo", FdAccountNo);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetFdTransactionDetails', parms, 'Yes')
  }
  SaveMaturityRenewal(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturityRenewal', data)
  }
  GetLienDetails(FdAccountNo) {
    const parms = new HttpParams().set("FdAccountNo", FdAccountNo);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetLienDetails', parms, 'Yes');
  }
  SetButtonClickType(type) {
    debugger
    this.ButtonClickType = type
  }
  GetButtonClickType() {
    return this.ButtonClickType
  }
  SetMaturityPayment(data) {
    this.MaturityPayment = data;
  }
  GetMaturityPayment() {
    return this.MaturityPayment
  }


  GetSchemeType(MaturityType, Transtype) {
    const parms = new HttpParams().set("MaturityType", MaturityType).set("Deposittype", Transtype);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetSchemeType', parms, 'Yes')
  }
  GetDeposit(MaturityType, Deposittype, Schemeid) {
    const parms = new HttpParams().set("MaturityType", MaturityType).set("Deposittype", Deposittype).set("Schemeid", Schemeid);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetDepositIds', parms, 'Yes')
  }
  GetMaturityDetails(FDAccountno, Date, Maturitytype, Deposittype, Accontsid) {
    debugger;
    const parms = new HttpParams().set("FDAccountno", FDAccountno).set("Date", Date).set("Maturitytype", Maturitytype).set("Deposittype", Deposittype).set("Accontsid", Accontsid);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetPreMaturityDetails', parms, 'Yes')
  }
  GetFdDetailsById(FdAccountNo, FdaccountId) {
    const parms = new HttpParams().set('FdAccountNo', FdAccountNo).set('FdaccountId', FdaccountId);
    return this._commonService.callGetAPI('/Banking/Transactions/FdReceipt/GetFdDetailsByid', parms, 'Yes');
  }
  GetRDDetailsById(AccountNo) {
    const parms = new HttpParams().set('AccountNo', AccountNo);
    return this._commonService.callGetAPI('/Banking/Transactions/RDReceipt/GetAccountDetailsByid', parms, 'Yes');
  }
  SaveMaturitybond(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturitybond', data);
  }

  ///api/Banking/Transactions/MaturityPayment/SaveMaturitybond1

  SaveMaturitybond1(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/MaturityPayment/SaveMaturitybond1', data);
  }

  //api/Banking/Transactions/MaturityPayment/Getlienrealsecount
  getLienRealseCount(Paccountno) {
    const parms = new HttpParams().set('Paccountno', Paccountno);
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/Getlienrealsecount', parms, 'Yes');
  }
  //api/Accounting/AccountingTransactions/Gettdsdeductcount

  getTdsDeductCount(appid) {
    const parms = new HttpParams().set('appid', appid);
    return this._commonService.callGetAPI('/Accounting/AccountingTransactions/Gettdsdeductcount', parms, 'Yes');
  }

  //Accounting/AccountingTransactions/Getinoprativecount

  getInOprativeCount(appid) {
    const parms = new HttpParams().set('appid', appid);
    return this._commonService.callGetAPI('/Accounting/AccountingTransactions/Getinoprativecount', parms, 'Yes');
  }

  GetInterestDelayDetails(memberId, date) {
    const parms = new HttpParams()
      .set("memberId", memberId)
      .set("date", date);

    return this._commonService.callGetAPI(
      '/Banking/Transactions/MaturityPayment/GetInterestDelayDetails',
      parms,
      'Yes'
    );
  }

    GetMaturityRenewalDetailsView() {
    return this._commonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturityRenewaltView', '', 'NO')
  }

  getTDSExemptCount(appid) {
  const parms = new HttpParams().set('appid', appid);
  return this._commonService.callGetAPI('/Accounting/AccountingTransactions/GetTDSExemptCount', parms, 'Yes');
}


}
