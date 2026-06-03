import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountingMastresService {
  recordid: any;
  status: any;
  adressdetails: any;
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetBankUPIDetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/Masters/GetBankUPIDetails', '', 'NO')
  }
  GetBAnkDetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/Masters/GetBAnkDetails', '', 'NO')
  }
  ViewChequeManagementDetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/Masters/ViewChequeManagementDetails', '', 'NO')
  }
  GenerateBookId(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/Masters/GenerateBookId', '', 'NO')
  }
  viewbankinformation() {
    return this._CommonService.callGetAPI('/Accounting/Masters/ViewBankInformationDetails', '', 'No')
  }
  viewbank(recordid) {
    const params = new HttpParams().set('precordid', recordid);
    return this._CommonService.callGetAPI('/Accounting/Masters/ViewBankInformation', params, 'Yes')
  }
  getbankdetails(recordid) {
    this.recordid = recordid
  }
  editbankdetails() {
    return this.recordid
  }

  newformstatus(status) {
    this.status = status
  }
  newstatus() {
    return this.status
  }
  savebankinformation(bankinformationdata) {

    return this._CommonService.callPostAPI('/Accounting/Masters/SaveBankInformation', bankinformationdata)
  }
  SaveChequeManagement(cheqinformation) {
    debugger;
    return this._CommonService.callPostAPI('/Accounting/Masters/SaveChequeManagement    ', cheqinformation)
  }
  GetAccountTreeDetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetAccountTreeList', '', 'NO')
  }
  SaveAccounts(accountsdata): Observable<any> {

    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveAccountMaster', accountsdata)
  }
  CheckAccountnameDuplicate(Accountname, Accounttype, Parentid): Observable<any> {
    const params = new HttpParams().set('Accountname', Accountname).set('AccountType', Accounttype).set('ParentId', Parentid);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/checkAccountnameDuplicates', params, 'YES')

  }
  GetExistingChequeCount(BankId, ChqFromNo, ChqToNo): Observable<any> {

    const params = new HttpParams().set('BankId', BankId).set('ChqFromNo', ChqFromNo).set('ChqToNo', ChqToNo);
    return this._CommonService.callGetAPI('/Accounting/Masters/GetExistingChequeCount', params, 'YES')

  }
  GetCheckDuplicateDebitCardNo(bankinformationdata): Observable<any> {


    return this._CommonService.callPostAPI('/Accounting/Masters/GetCheckDuplicateDebitCardNo', bankinformationdata)
  }

  GetAccountTreeNewDetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/AccountTreeNew', '', 'NO')
  }
  GetAccountTree(): Observable<any> {

    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetAccountTree', '', 'NO')
  }
  getTDSsectiondetails(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsSectionNo', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  getGstPercentages() {
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetGstPercentages', '', 'NO')
  }
  GetSubLedgerData(pledgerid): Observable<any> {
    const params = new HttpParams().set('pledgerid', pledgerid);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetSubLedgerData', params, 'YES');
  }
  GetAccountTreeSearch(searchText) {
    const params = new HttpParams().set('searchterm', searchText);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/AccountTreeSearch', params, 'YES');

  }
  SaveAccountsNew(accountsdata): Observable<any> {

    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveAccountHeads', accountsdata)
  }

  saveGstVoucher(data) {

    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/savegstvocuher', data)
  }

  getHsnCodes(): Observable<any> {
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getHsnCodes', '', 'no');
  }


  saveHsnCodes(data): Observable<any> {
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/saveHsnCodes', data)
  }

  //Accounting/AccountingTransactions/getGSTVoucherDetailsByID

  getGSTVoucherDetailsByID(contactId): Observable<any> {
    const params = new HttpParams().set('contactId', contactId);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getGSTVoucherDetailsByID', params, 'YES');
  }

  //Accounting/AccountingTransactions/getProductNames

  getProductNames(): Observable<any> {
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getProductNames', '', 'no');
  }

  //Accounting/AccountingTransactions/getHSNCodeByProductNames
  //productName
  getHSNCodeByProductNames(productName): Observable<any> {
    const params = new HttpParams().set('productName', productName);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getHSNCodeByProductNames', params, 'YES');
  }

  //Accounting/AccountingTransactions/getInvoiceCount

  getInvoiceCount(invoiceNo): Observable<any> {
    const params = new HttpParams().set('invoiceNo', invoiceNo);
    return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/getInvoiceCount', params, 'YES');
  }
///api/accounting/accountingtransactions/getTdsectionsbyid
  getTdsectionsbyid(section): Observable<any> {
    const params = new HttpParams().set('section', section);
    return this._CommonService.callGetAPI('/accounting/accountingtransactions/getTdsectionsbyid', params, 'YES');
  }

  GetTdssectiondetails(): Observable<any> {
    try {
      const params = new HttpParams()
      return this._CommonService.callGetAPI('/TDS/Challana/GetTdssectiondetails', params, 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
