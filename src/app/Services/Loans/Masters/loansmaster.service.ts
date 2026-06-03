import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment"
import { Subject } from 'rxjs'
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../../common.service';



@Injectable({
  providedIn: 'root'
})
export class LoansmasterService {

  private _listnClick = new Subject<any>();
  private _title = new Subject<any>()
  private _TabsLoanNameCodeData = new Subject<any>()
  private _IdentificationProofsData = new Subject<any>()

  constructor(private _http: HttpClient, private _CommonService: CommonService) { this._validationStatus = false; }
  _FindingValidationsBetweenComponents(): Observable<any> {
    return this._listnClick.asObservable();
  }

  _SetSelectTitileInLoanCreation(title) {
    this._title.next(title)
  }
  _GetSelectTitileInLoanCreation(): Observable<any> {

    return this._title.asObservable();
  }

  _checkValidationsBetweenComponents() {
    this._listnClick.next();
  }
  _setValidationStatus(data: any) {

    this._validationStatus = data
  }
  _getValidationStatus() {
    return this._validationStatus;
  }

  showErrorMessage(errormsg: string) {
    alert(errormsg);
  }
  private extractData(res: Response) {
    //let body = res.json();
    let body = res;
    return body;
  }
  private handleError(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  DataTableEditData: any
  TabsLoanNameCodeData: any
  ButtonClickType: string
  _validationStatus: any;
  LoanMasterData: any;
  loansnamecode: any;
  loansconfiguration: any;
  loansinstallmentduedate: any;
  loanspenalinterest: any;
  loansidentificationdocuments: any;
  loansreferralcommission: any;

  LoanConfigurationData: any

  LoanInstallmentDueDateData: any
  LoanInstallmentsDuDateData: any
  LoanReferralCommissionData: any
  ReferralCommissioLoan: any;
  IdentificationProofsData: any;
  PenalinterestData: any;
  HeaderTitleDataToDisplay: string

  TitleinLoanCreationSelect: any
  //public notify = new Subject<any>();
  //notifyObservable$ = this.notify.asObservable();

  //public notifyOther(data: any) {
  //  if (data) {
  //    this.notify.next(data);
  //  }
  //}

  //nag


  _addDataToLoanMaster(Loandata, FormName) {

    if (FormName == "loansnamecode") { this.loansnamecode = Loandata }
    if (FormName == "loansconfiguration") { this.loansconfiguration = Loandata }
    if (FormName == "loansinstallmentduedate") { this.loansinstallmentduedate = Loandata }
    if (FormName == "loanspenalinterest") { this.loanspenalinterest = Loandata }
    if (FormName == "loansidentificationdocuments") { this.loansidentificationdocuments = Loandata }
    if (FormName == "ReferralCommissioLoanList") { this.loansreferralcommission = Loandata }
    if (FormName == "penaltyConfigurationList") { this.ReferralCommissioLoan = Loandata }

  }


  _getDatafromLoanMaster() {

    if (this.loansnamecode !== undefined) {
      if (this.loansinstallmentduedate === undefined) { this.loansinstallmentduedate = [] } if (this.loansconfiguration === undefined) { this.loansconfiguration = [] } if (this.loansidentificationdocuments === undefined) { this.loansidentificationdocuments = [] } if (this.loansreferralcommission === undefined) { this.loansreferralcommission = []; }
      this.loansnamecode["instalmentdatedetailslist"] = this.loansinstallmentduedate;
      this.loansnamecode["loanconfigurationlist"] = this.loansconfiguration;
      this.loansnamecode["identificationdocumentsList"] = this.loansidentificationdocuments;
      this.loansnamecode["ReferralCommissioLoanList"] = this.loansreferralcommission;
      this.loansnamecode["penaltyConfigurationList"] = this.ReferralCommissioLoan;
    }
    return this.loansnamecode;
  }

  GetApplicanttypes(contactType, loanId) {
    const params = new HttpParams().set('contacttype', contactType).set('loanid', loanId);
    // return this._http.get(environment.apiURL + '/Settings/getApplicanttypes')

    return this._CommonService.callGetAPI('/Settings/getApplicanttypes', params, 'YES');
  }
  saveLoanMaster(data) {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };
    // return this._http.post(environment.apiURL + '/loans/masters/loanmaster/saveLoanMaster', data)
    return this._CommonService.callPostAPI('/loans/masters/loanmaster/saveLoanMaster', data);

  }
  UpdateLoanMaster(data) {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };
    // return this._http.post(environment.apiURL + '/loans/masters/loanmaster/updateLoanMaster', data)
    return this._CommonService.callPostAPI('/loans/masters/loanmaster/updateLoanMaster', data);
  }

  GetLoanDoucments(loanid) {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // })
    // let HttpParams = { 'pLoanId': loanid }
    // let options = {
    //   headers: httpHeaders,
    //   params: HttpParams
    // };   
    // return this._http.post(environment.apiURL + '/loans/masters/documentsmaster/Getdocumentidprofftypes', options);
    const params = new HttpParams().set('pLoanId', loanid)
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/Getdocumentidprofftypes', params);
  }
  // changed api url by Ravi Shankar as per Sowjanya discussion 31st Oct 2019
  GetLoanMasterLoantypes() {

    // return this._CommonService.callGetAPI('/loans/masters/loanmaster/getfiLoanTypes', '', 'NO')
      return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
    //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/getLoanTypes').map(this.extractData).catch(this.handleError);
    }

    getGstPercentages() {       
        return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetGstPercentages', '', 'NO')       
    }

  getLoanNamesForLoanReceipt() {
    return this._CommonService.callGetAPI('/loans/Transactions/Receipts/GetLoannames', '', 'NO')

  }
  getLoanMasterLoanNames(loanTypeId): Observable<any> {
    try {
      const params = new HttpParams().set('loanTypeId', loanTypeId.toString());
      return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanNames', params, 'YES')
      //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/getLoanNames', { params }).map(this.extractData).catch(this.handleError);
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  GetCompanyBranchDetails() {
    return this._CommonService.callGetAPI('/Settings/getCompanyandbranchdetails', '', 'NO')
    // return this._http.get(environment.apiURL + '/Settings/getCompanyandbranchdetails')
  }

  GetNameCodeData() {
    const params = new HttpParams()
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanMasterDetailsgrid', '', 'NO');
    //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/getLoanMasterDetails')
  }
  GetLoanDataToEdit(Loanid) {
    const params = new HttpParams().set('Loanid', Loanid);
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanMasterDetails', params, 'YES');
  }


  SaveLoanNameCode(Data: any) {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };
    // let data = Data

    // return this._http.post(environment.apiURL + '/loans/masters/loanmaster/saveLoanMaster', data, options)
    return this._CommonService.callPostAPI('/loans/masters/loanmaster/saveLoanMaster', Data);
  }

  UpdateLoanNameCodeDetails(Data: any) {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };
    // let data = Data
    // return this._http.post(environment.apiURL + '/loans/masters/loanmaster/updateLoanMaster', data, options)
    return this._CommonService.callPostAPI('/loans/masters/loanmaster/updateLoanMaster', Data);
  }

  CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, loanid) {

    //let httpHeaders = new HttpHeaders({
    //  'Content-Type': 'application/json',
    //  'Cache-Control': 'no-cache'
    //});
    //let HttpParams = { 'loanname': loanname, 'loancode': loancode, 'checkparamtype': checkparamtype, 'loanid': loanid }
    //let options = {
    //  headers: httpHeaders,
    //  params: HttpParams
    //};
    //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/checkInsertLoanNameandCodeDuplicates', options);
    const params = new HttpParams().set('loanname', loanname).set('loancode', loancode).set('checkparamtype', checkparamtype).set('loanid', loanid)
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/checkInsertLoanNameandCodeDuplicates', params, 'YES')
  }

  DataTableRowDeleteClick(loanid, modifiedby) {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    let options = {
      headers: httpHeaders
    };
    let data = { 'pLoanid': loanid, 'pModifiedby': modifiedby }

    // return this._http.post(environment.apiURL + '/loans/masters/loanmaster/DeleteLoanMaster', data, options);
    return this._CommonService.callPostAPI('/loans/masters/loanmaster/DeleteLoanMaster', data)

  }

  SetDatatableRowEditClick(data) {
    this.DataTableEditData = data
  }
  GetDatatableRowEditClick() {
    return this.DataTableEditData
  }

  SetLoanNameAndCodeToNextTab(data) {
    this.TabsLoanNameCodeData = data;
  }

  _SetLoanNameAndCodeToNextTab(data) {
    this._TabsLoanNameCodeData.next(data)
  }
  _GetLoanNameAndCodeDataInTabs(): Observable<any> {
    return this._TabsLoanNameCodeData
  }

  GetLoanNameAndCodeDataInTabs() {
    return this.TabsLoanNameCodeData
  }

  SetButtonClickType(type) {
    this.ButtonClickType = type
  }
  GetButtonClickType() {
    return this.ButtonClickType
  }

  _getLoanpayins() {

    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanpayins', '', 'NO')
    //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/getLoanpayins')

  }
  _getLoanInterestratetypes() {

    //return this._http.get(environment.apiURL + '/loans/masters/loanmaster/getLoanInterestratetypes')
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanInterestratetypes', '', 'NO')
  }

  SetInstallmentDueDatesData(data) {
    this.LoanInstallmentsDuDateData = data;
  }
  GetInstallmentDueDatesData() {
    return this.LoanInstallmentsDuDateData;
  }

  SetLoanInstallmentDueData(data) {
    this.LoanInstallmentDueDateData = data
  }
  GetLoanInstallmentDueData() {
    return this.LoanInstallmentDueDateData
  }

  SetLoanReferralCommissionData(data) {
    this.LoanReferralCommissionData = data
  }
  GetLoanReferralCommissionData() {
    return this.LoanReferralCommissionData
  }

  SetPenalinterestData(data) {
    this.PenalinterestData = data
  }
  GetPenalinterestData() {
    return this.PenalinterestData;
  }
  
  SetIdentificationProofsData(data) {
    this.IdentificationProofsData = data
  }
  _SetIdentificationProofsData(data) {
    this._IdentificationProofsData.next(data)
  }
  _GetIdentificationProofsData(): Observable<any> {
    return this._IdentificationProofsData;
  }
  GetIdentificationProofsData() {
    return this.IdentificationProofsData;
  }
  SetSelectTitileInLoanCreation(title) {
    this.TitleinLoanCreationSelect = title
  }
  GetSelectTitileInLoanCreation() {
    return this.TitleinLoanCreationSelect
  }


}
