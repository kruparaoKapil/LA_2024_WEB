import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetLedgerAccountList(formname): Observable<any> {
    try {
      const params = new HttpParams().set('formname', formname);
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetLedgerAccountList', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetLedgerReport(fromDate, toDate, pAccountId, pSubAccountId): Observable<any> {
    try {
      const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('pAccountId', pAccountId).set('pSubAccountId', pSubAccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetAccountLedgerDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetPartyLedgerReport(fromDate, toDate, pAccountId, pSubAccountId, pPartyRefId): Observable<any> {
    try {
      const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('pAccountId', pAccountId).set('pSubAccountId', pSubAccountId).set('pPartyRefId', pPartyRefId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetPartyLedgerDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  GetDayBook(fromdate, todate): Observable<any> {
    try {
      const params = new HttpParams().set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/getDaybook', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetTrialBalance(fromdate,todate,grouptype){
    const params = new HttpParams().set('fromDate',fromdate).set('todate',todate).set('GroupType',grouptype);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetTrialBalance', params, 'YES');
  }


  GetProfitAndLossdata(fromdate, todate, grouptype) {
    const params = new HttpParams().set('fromDate', fromdate).set('todate', todate).set('GroupType', grouptype);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetProfitAndLossData', params, 'YES');
  }

  GetLedgerSummary(fromDate,todate, AccountId):Observable<any>
  {
    
    try {
      const params = new HttpParams().set('fromDate', fromDate).set('todate',todate).set('pAccountId', AccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetLedgerSummary', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetBalanceSheet(fromdate) {
    const params = new HttpParams().set('fromDate', fromdate);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBalanceSheetDetails', params, 'YES');
  }
  GetComparisionTB(fromdate, todate) {
    const params = new HttpParams().set('fromDate', fromdate).set('todate', todate);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetComparisionTB', params, 'YES');
  }

  GetReferenceNo(formname,transno){
    const params = new HttpParams().set('FormName', formname).set('TransactionNo', transno);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetReferenceNo', params, 'YES');
  }
  GetIssuedChequesDetails(ChqNo) {
    const params = new HttpParams().set('pChequeNo', ChqNo);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetIssuedChequesDetails', params, 'YES');
  }
  GetReceivedChequesDetails(ChqNo) {
    const params = new HttpParams().set('pChequeNo', ChqNo);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetReceivedChequesDetails', params, 'YES');
  }
  GetChequeCancelDetails(strFromDate, strToDate) {
    const params = new HttpParams().set('fromdate', strFromDate).set('todate', strToDate);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetChequeCancelDetails', params, 'YES');
  }
  GetChequeReturnDetails(strFromDate, strToDate) {
    const params = new HttpParams().set('fromdate', strFromDate).set('todate', strToDate);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetChequeReturnDetails', params, 'YES');
  }

  GetBankChequeDetails(BankId) {
    const params = new HttpParams().set('_BankId', BankId);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetIssuedChequeNumbers', params, 'YES');
  }
  GetIssuedBankDetails(BankId, _ChqBookId, _ChqFromNo, _ChqToNo) {
    const params = new HttpParams().set('_BankId', BankId).set('_ChqBookId', _ChqBookId).set('_ChqFromNo', _ChqFromNo).set('_ChqToNo', _ChqToNo);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetIssuedChequeDetails', params, 'YES');
  }

  GetTrendReport(month) {
    const params = new HttpParams().set('monthname', month);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetDisbursementTrendReport', params, 'YES');
  }
 
  GetCollectionDuesTrendReport(month,type){
    const params = new HttpParams().set('monthname', month).set('type',type);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetCollectionandDuesTrendReport', params, 'YES');
  }

  GetAccountledger(): Observable<any> {
    try {
      
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetAccountledger', '', 'N0');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetPartyDetails(): Observable<any> {
    try {
      
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetPartyDetails', '', 'N0');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetAddressDocdetails(contactid):Observable<any>{
    const params = new HttpParams().set('contactid', contactid);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetAddressDocdetails',params,'YES');
  }

  Getgstreport(fromdate,todate):Observable<any>{
    const params = new HttpParams().set('fromdate', fromdate).set('todate', todate);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/Getgstreport',params,'YES');
  }

  
    GetLedgerMigrationList(formname): Observable<any> {
    try {
      const params = new HttpParams().set('formname', formname);
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetLedgerMigrationList', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

    GetLedgerMigrationReport(fromDate, toDate, LedgerName, SubLedgerName): Observable<any> {
    try {
      const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('LedgerName', LedgerName).set('SubLedgerName', SubLedgerName);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetLedgerMigrationDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
