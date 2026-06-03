import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs/Rx'

@Injectable({
  providedIn: 'root'
})
export class AccountingTransactionsService {

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  ledgeraccountslist: any = [];
  constructor(private http: HttpClient, private _CommonService: CommonService) { }
  private challanaAmount: number = 0;

  setChallanaAmount(value: number) {
    debugger
    this.challanaAmount = value;
    console.log('this is from service', this.challanaAmount)
  }
  getChallanaAmount(): number {
    return this.challanaAmount;
  }

  GetPaymentVoucherExistingData(): Observable<any> {
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetPaymentVoucherExistingData', '', 'NO');
  }


  GetGeneralReceiptExistingData(): Observable<any> {
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetGeneralReceiptsData', '', 'NO');
  }

  GetReceiptsandPaymentsLoadingData(formname): Observable<any> {
    const params = new HttpParams().set('formname', formname);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetReceiptsandPaymentsLoadingData', params, 'YES');
  }
  GetBankDetailsbyId(pbankid): Observable<any> {
    debugger
    const params = new HttpParams().set('pbankid', pbankid);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetBankDetailsbyId', params, 'YES');
  }
  GetSubLedgerData(pledgerid): Observable<any> {
    const params = new HttpParams().set('pledgerid', pledgerid);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetSubLedgerData', params, 'YES');
  }
  getPartyDetailsbyid(ppartyid): Observable<any> {
    const params = new HttpParams().set('ppartyid', ppartyid);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/getPartyDetailsbyid', params, 'YES');
  }

  GetBanksList(): Observable<any> {
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetBankntList', '', 'NO')
  }

  GetChequesOnHandData(bankid): Observable<any> {
    const params = new HttpParams().set('_BankId', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetChequesOnHandData', params, 'YES')
  }

  SaveChequesOnHand(data) {
    return this._CommonService.callPostAPI('/Accounting/ChequesOnHand/SaveChequesOnHand', data)
  }

  DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetChequesOnHandData_New', params, 'YES');
  }

  GetBankBalance(bankid) {
    const params = new HttpParams().set('_recordid', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetBankBalance', '', 'NO');
  }

  GetChequesIssuedData(bankid): Observable<any> {
    const params = new HttpParams().set('_BankId', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetChequesIssued', params, 'YES')
  }

  DataFromBrsDatesChequesIssued(frombrsdate, tobrsdate, bankid) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetIssuedCancelledCheques_New', params, 'YES');
  }

  SaveChequesIssued(data) {
    return this._CommonService.callPostAPI('/Accounting/ChequesOnHand/SaveChequesIssued', data)
  }

  GetChequesInBankData(bankid): Observable<any> {
    const params = new HttpParams().set('depositedBankid', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetChequesInBankData', params, 'YES')
  }

  SaveChequesInBank(data) {
    return this._CommonService.callPostAPI('/Accounting/ChequesOnHand/SaveChequesInBank', data)
  }

  DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('depositedBankid', bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetClearedReturnedCheques_New', params, 'YES');
  }

  savePaymentVoucher(data) {
    return this._CommonService.callPostAPI('/accounting/accountingtransactions/SavePaymentVoucher', data)
  }

  ///api/accounting/accountingtransactions/SaveTdsPaymentVoucher

  saveTDSPaymentVoucher(data) {
    return this._CommonService.callPostAPI('/accounting/accountingtransactions/SaveTdsPaymentVoucher', data)
  }

  saveGeneralReceipt(data) {
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveGeneralReceipt', data)
  }
  saveJournalVoucher(data) {
    return this._CommonService.callPostAPI('/accounting/accountingtransactions/SaveJournalVoucher', data)
  }
  GetJournalVoucherData(): Observable<any> {
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetJournalVoucherData', '', 'NO');
  }
  UnusedhequeCancel(data) {
    return this._CommonService.callPostAPI('/Accounting/AccountingReports/UnusedhequeCancel', data)
  }
  getGstPercentages() {
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetGstPercentages', '', 'NO')
  }
  getTDSsectiondetails(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsSectionNo', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getTDSsectiondetails1(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/TDS/Challana/GetTdssectiondetails', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //TDS/Challana/GetTdssectiondetails


  // =============================

  GetTwotypeAccountHeads(): Observable<any> {
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetTwotypeAccountHeads', '', 'NO');
  }

  GetthreetypeAccountHeads(parentid): Observable<any> {
    const params = new HttpParams().set('parentid', parentid);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetthreetypeAccountHeads', params, 'YES');
  }

  Gettwotypetotaltransactionscount(accountid): Observable<any> {
    const params = new HttpParams().set('accountid', accountid);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/Gettwotypetotaltransactionscount', params, 'YES');
  }

  Getthreetypeaccountnamecount(accountid, ACCOUNTNAME): Observable<any> {
    const params = new HttpParams().set('ACCOUNTNAME', ACCOUNTNAME).set('accountid', accountid);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/Getthreetypeaccountnamecount', params, 'YES');
  }
  SavethreetypeSubcategory(ACCOUNTNAME, accountid) {
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SavethreetypeSubcategory?ACCOUNTNAME=' + ACCOUNTNAME + '&accountid=' + accountid, '')

  }

  //api/Accounting/AccountingTransactions/GetTdsLedgerAccountHeads
  getTdsLedgerAccountHeads(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetTdsLedgerAccountHeads', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  //api/accounting/accountingtransactions/getTdsPartyid

  getTdsPartyById(ppartyid): Observable<any> {
    const params = new HttpParams().set('ppartyid', ppartyid);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsPartyid', params, 'YES');
  }

  //accounting/accountingtransactions/getTdsections

  getTdsections(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsections', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/accounting/accountingtransactions/getTdsectionsbyid
  getTdsectionsbyid(section): Observable<any> {
    const params = new HttpParams().set('section', section);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsectionsbyid', params, 'YES');
  }

  //api/Accounting/ChequesOnHand/GetBrsstatementdeposite

  GetBrsstatementdeposite(FromDate, Todate, _BankId): Observable<any> {
    const params = new HttpParams().set('FromDate', FromDate).set('Todate', Todate).set('_BankId', _BankId);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetBrsstatementdeposite', params, 'YES');
  }

  //api/Accounting/ChequesOnHand/GetBrsstatementcredit

  GetBrsstatementcredit(FromDate, Todate, Bankid): Observable<any> {
    const params = new HttpParams().set('FromDate', FromDate).set('Todate', Todate).set('Bankid', Bankid);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetBrsstatementcredit', params, 'YES');
  }



///Accounting/ChequesOnHand/GetBrsstatementJv'
 GetBrsstatementJv(FromDate, Todate, _BankId): Observable<any> {
    const params = new HttpParams().set('FromDate', FromDate).set('Todate', Todate).set('_BankId', _BankId);
    return this._CommonService.callGetAPI('/Accounting/ChequesOnHand/GetBrsstatementJv', params, 'YES');
  }

  UpdateScheduleid(asondate, ConnInfo, branchid): Observable<any> {
    debugger;
    const params = new HttpParams().set('asondate', asondate).set('ConnInfo', ConnInfo).set('branchid', branchid);
    return this._CommonService.getReportAPI('/api/Reports/ChitReports/UpdateScheduleid', params, 'Yes');
  }

  //api/Reports/ChitReports/profitloss

  getProfitAndLoss(asondate, branchid, ConnInfo): Observable<any> {
    debugger;
    const params = new HttpParams().set('asondate', asondate).set('branchid', branchid).set('ConnInfo', ConnInfo);
    return this._CommonService.getReportAPI('/api/Reports/ChitReports/profitloss', params, 'Yes');
  }
  ///Accounting/AccountingTransactions/Getbankcount
  getbankcount(accountId): Observable<any> {
    const params = new HttpParams().set('accountid', accountId);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/Getbankcount', params, 'Yes');
  }
  getPartyDetails(): Observable<any> {
    debugger;
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetPartyDetails', '', "NO");
  }

  ///api/Accounting/AccountingTransactions/getGSTVoucherDetailsByID
  getGSTVoucherDetailsByID(contactId): Observable<any> {
    const params = new HttpParams().set('contactId', contactId);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getGSTVoucherDetailsByID', params, "YES");
  }

  //AccountingTransactions/SaveGSTPaymentVoucher
  saveGSTPaymentVoucher(data) {
    return this._CommonService.callPostAPI('/AccountingTransactions/SaveGSTPaymentVoucher', data)
  }

  // FILTER ACC HEADS

  setFilterAccountHeads(accountHeadList){
    this.ledgeraccountslist = accountHeadList;
  }

  getLedgerAccountsList():any{
    let list=this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' && 
      item.pledgername !== 'TDS-194H PAYABLE' && 
      item.pledgername !== 'TDS-194J PAYABLE' && 
      item.pledgername !== 'HS-SALE ADVANCE' && 
      item.pledgername !== 'SALE ADVANCE' && 
      item.pledgername !== 'SALE ADVANCE-HRB' && 
      item.pledgername !== 'OS-SALE ADVANCE' && 
      item.pledgername !== 'INTEREST PAIDTO APPLICANT' && 
      item.pledgername !== 'OUT STANDING PAYABLE' && 
      item.pledgername !== 'OUTSTANDING PROMOTER SALARY' && 
      item.pledgername !== 'INTEREST PAID A/C' && 
      item.pledgername !== 'TDS-1006 PAYABLE-194H'  && 
      item.pledgername !== 'TDS-1027 PAYABLE-194J-FEE' && 
      item.pledgername !== 'TDS-1026 PAYABLE-194J-CTC' && 
      item.pledgername !== 'TDS-1024 PAYABLE-194C' && 
      item.pledgername !== 'TDS-1022 PAYABLE-194A' && 
      item.pledgername !== 'TDS-1006 PAYABLE' &&
      item.pledgername !== 'TDS-1022 PAYABLE' &&
      item.pledgername !== 'TDS-1026 PAYABLE' &&
      item.pledgername !== 'TDS-1009 PAYABLE'
   );
    return list;
  }

  getLedgerAccountsList1():any{
    let list=this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' && 
      item.pledgername !== 'TDS-194H PAYABLE' && 
      item.pledgername !== 'TDS-194J PAYABLE' && 
      item.pledgername !== 'HS-SALE ADVANCE' && 
      item.pledgername !== 'SALE ADVANCE' && 
      item.pledgername !== 'SALE ADVANCE-HRB' && 
      item.pledgername !== 'OS-SALE ADVANCE' && 
      item.pledgername !== 'INTEREST PAIDTO APPLICANT' && 
      item.pledgername !== 'OUT STANDING PAYABLE' && 
      item.pledgername !== 'INTEREST PAID A/C' && 
      item.pledgername !== 'TDS-1006 PAYABLE-194H'  && 
      item.pledgername !== 'TDS-1027 PAYABLE-194J-FEE' && 
      item.pledgername !== 'TDS-1026 PAYABLE-194J-CTC' && 
      item.pledgername !== 'TDS-1024 PAYABLE-194C' && 
      item.pledgername !== 'TDS-1022 PAYABLE-194A' &&
      item.pledgername !== 'TDS-1006 PAYABLE' &&
      item.pledgername !== 'TDS-1022 PAYABLE' &&
      item.pledgername !== 'TDS-1026 PAYABLE' &&
      item.pledgername !== 'TDS-1009 PAYABLE'
    );
    return list;
  }

   getPartyDetail(): Observable<any> {
        return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetPartyDetails','', 'NO')
      }
  Updatecomparisionid(fromdate, todate, branchid, ConnInfo) {
  let params = new HttpParams().set('fromdate', fromdate).set('todate', todate) .set('branchid', branchid).set('ConnInfo', ConnInfo);
  return this._CommonService.getReportAPI('/api/Reports/ChitReports/ComparisionTBreportremo', params, 'Yes' );
}

  UpdateScheduleledgerid(asondate, ConnInfo, branchid): Observable<any> {
    debugger;
    const params = new HttpParams().set('asondate', asondate).set('ConnInfo', ConnInfo).set('branchid', branchid);
    return this._CommonService.getReportAPI('/api/Reports/ChitReports/UpdateScheduleTBLedgerid', params, 'Yes');
  }

    GetSubLedgerMigrationData(ledgername): Observable<any> {
    const params = new HttpParams().set('ledgername', ledgername);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetSubLedgerMigrationData', params, 'YES');
  }
   GetUsersCompanyCodes(): Observable<any> {
    debugger;
    // const params = new HttpParams();
    return this._CommonService.callGetAPIWithout('/Accounting/AccountingTransactions/GetUsersCompanyCodes', '', 'NO');
  }
 
  GetUsersBranchCodes(company_name: any, login_branch: any, login_company_name: any): Observable<any> {
    const params = new HttpParams().set('company_name', company_name).set('login_branch', login_branch).set('login_company_name', login_company_name);
    return this._CommonService.callGetAPIWithout('/Accounting/AccountingTransactions/GetUsersBranchCodes', params, 'YES');
  }

    GetReceiptsandPaymentsLoadingData2(formname: any, BranchSchema: any, GlobalSchema: any, CompanyCode: any, BranchCode: any, TaxesSchema: any): Observable<any> {
    const params = new HttpParams().set('formname', formname).set('BranchSchema', BranchSchema)
      .set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode).set('TaxesSchema', TaxesSchema);
    return this._CommonService.callGetAPI('/Accounts/GetReceiptsandPaymentsLoadingData', params, 'YES');
  }
  GetSubLedgerData1(pledgerid: any, BranchSchema: any, CompanyCode: any, LocalSchema: any, BranchCode: any, GlobalSchema: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('LocalSchema', LocalSchema).set('BranchCode', BranchCode).set('GlobalSchema', GlobalSchema);
    return this._CommonService.callGetAPI('/Accounts/GetSubLedgerData', params, 'YES');
  }
  GetBankDetailsbyId1(pbankid: any, BranchSchema: any, GlobalSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pbankid', pbankid).set('BranchSchema', BranchSchema).set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    // return this._CommonService.getAPI('/Accounts/BankNames', params, 'YES');
    return this._CommonService.callGetAPI('/Accounts/GetBankDetailsbyId', params, 'YES');
  }

  saveFundTransfer(data: any) {
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveFundTransfer', data);
}

GetPendingFundTransfers(logincompanybranch: string): Observable<any> {
    const params = new HttpParams().set('logincompanybranch', logincompanybranch);
    return this._CommonService.callGetAPIWithout(
        '/Accounting/AccountingTransactions/GetPendingFundTransfers', params, 'YES'
    );
}

SaveFundTransferReceipt(data: any): Observable<any> {
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveFundTransferReceipt', JSON.stringify(data)
    );
}

GetLoginBranchInfo(loginbranchid : any):Observable<any>{
  const params = new HttpParams().set('loginbranchid', loginbranchid);
    return this._CommonService.callGetAPIWithout('/Accounting/AccountingTransactions/GetLoginBranchInfo', params, 'YES');
}

}
