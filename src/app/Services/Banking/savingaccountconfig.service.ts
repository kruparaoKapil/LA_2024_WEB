import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs'
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../common.service';


@Injectable({
  providedIn: 'root'
})
export class SavingaccountconfigService {
  _validationStatus: any;
  _RedirectForm: any;
  Accountnamecode: any;
  Accountconfiguration: any;
  LoanFacility: any;
  identificationdocuments: any;
  ReferralCommissioLoan: any;
  IdentificationProofsData: any;
  ButtonClickType: string
  DataTableEditData: any
  private _listnClick = new Subject<any>();
  private _TabsLoanNameCodeData = new Subject<any>()
  private _IdentificationProofsData = new Subject<any>()
  private _TabsAccountNameCodeData = new Subject<any>()


  EditAccountnamecode: any;
  EditAccountconfiguration: any;
  EditLoanFacility: any;
  Editdentificationdocuments: any;
  EditReferralCommissioLoan: any;
  EditIdentificationProofsData: any;



  constructor(private _http: HttpClient, private _CommonService: CommonService) { this._validationStatus = false; this._RedirectForm = ""; }

  _SetAccountNameAndCodeToNextTab(data) {
    this._TabsAccountNameCodeData.next(data)
  }
  _GetAccountNameAndCode():Observable<any> {
    return this._TabsAccountNameCodeData.asObservable();
   
  }

  _set_RedirectFormname(data: any) {

    this._RedirectForm = data
  }
  _setValidationStatus(data: any) {

    this._validationStatus = data
  }
  _addDataToSavingAccountConfigMaster(Configdata, FormName) {
    if (FormName == "Accountconfiguration") { this.Accountconfiguration = Configdata }
    if (FormName == "identificationdocuments") { this.identificationdocuments = Configdata }
    if (FormName == "LoanFacility") { this.LoanFacility = Configdata }
    if (FormName == "ReferralCommissioLoan") { this.ReferralCommissioLoan = Configdata }
    if (FormName == "Accountnamecode") { this.Accountnamecode = Configdata }
  }
  checkAccNameandCodeDuplicates(accname, acccode, checkparamtype, accid) {
    const params = new HttpParams().set('Accname', accname).set('Acccode', acccode).set('checkparamtype', checkparamtype).set('SavingAccid', accid)
    return this._CommonService.callGetAPI('/banking/masters/savingAccountConfig/checkInsertAccNameandCodeDuplicates', params, 'YES')
  }
  GetMemberDetailsList() {
    return this._CommonService.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', '', 'NO')
  }
  GetSavingMemberTypeDetails() {
    return this._CommonService.callGetAPI('/Banking/Masters/MemberType/GetSavingMemberTypeDetails', '', 'NO')
  }
  _GetIdentificationProofsData(): Observable<any> {
    return this._IdentificationProofsData;
  }
  GetIdentificationProofsData() {
    return this.EditIdentificationProofsData;
  }
  _FindingValidationsBetweenComponents(): Observable<any> {
    return this._listnClick.asObservable();
  }
  _checkValidationsBetweenComponents() {
    this._listnClick.next();
  }
  _getValidationStatus() {
    return this._validationStatus;
  }
  _getRedirectFormname() {
    return this._RedirectForm;
  }
  _getDatafromSavingAccountConfigMaster() {

    if (this.Accountnamecode !== undefined) {
      if (this.Accountconfiguration === undefined) { this.Accountconfiguration = [] } if (this.LoanFacility === undefined) { this.LoanFacility = [] } if (this.identificationdocuments === undefined) { this.identificationdocuments = [] } if (this.ReferralCommissioLoan === undefined) { this.ReferralCommissioLoan = []; }
      this.Accountnamecode["savingAccountConfiglist"] = this.Accountconfiguration;
      this.Accountnamecode["LoanFacilityList"] = this.LoanFacility;
      this.Accountnamecode["identificationdocumentsList"] = this.identificationdocuments;
      this.Accountnamecode["ReferralCommissionList"] = this.ReferralCommissioLoan;
     
    }
    return this.Accountnamecode;
  }
  saveAccountConfigNameAndCode(data) {


    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/saveAccountConfigNameAndCode', data);

  }
  saveAccountConfig(data) {

   
    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/saveAccountConfig', data);

  }
  SaveLoanFacility(data) {


    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/SaveLoanFacility', data);

  }
  SaveIdentificationdocuments(data) {


    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/SaveIdentificationdocuments', data);

  }
  SaveReferralCommission(data) {


    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/SaveReferralCommission', data);

  }
  GetSavingAccountConfigData() {
    return this._CommonService.callGetAPI('/banking/masters/savingAccountConfig/GetSavingAccountConfigData', '', 'NO')
  }
  CheckSavingNameCodeDuplicate(SavingAccid,SavingAccName,SavingAccCode):Observable<any>{
    try{
        const params = new HttpParams().set('SavingAccid', SavingAccid).set('SavingAccName', SavingAccName).set('SavingAccCode', SavingAccCode)
    return this._CommonService.callGetAPI('/banking/masters/savingAccountConfig/GetSavingAccNameCodeCount', params, 'YES')
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }
  GetButtonClickType() {
    return this.ButtonClickType
  }
  GetSavingAccountConfigDataToEdit(SavingAccountId) {
    const params = new HttpParams().set('SavingAccountId', SavingAccountId);
    return this._CommonService.callGetAPI('/banking/masters/savingAccountConfig/GetAccountConfigDetails', params, 'YES')
  }

  DeleteSavingaccountconfig(savingAccountid, modifiedby) {
    let data = { 'pSavingAccountid': savingAccountid, 'pModifiedby': modifiedby }
    return this._CommonService.callPostAPI('/banking/masters/savingAccountConfig/DeleteSavingAccountConfig', data)
  }

  SetButtonClickType(type) {
    this.ButtonClickType = type
  }
  SetDatatableRowEditClick(data) {
    this.DataTableEditData = data
  }
  SetSavingAccountnamecodeData(data) {
    this.EditAccountnamecode = data
  }

  SetSavingAccountConfigurationData(data) {
    this.EditAccountconfiguration = data
  }
  SetLoanFacilityData(data) {
    this.EditLoanFacility = data
  }
  SetIdentificationProofsData(data) {
    this.EditIdentificationProofsData = data
  }
  SetReferralCommissioData(data) {
    this.EditReferralCommissioLoan = data
  }
  GetDatatableRowEditClick() {
    return this.DataTableEditData
  }
  GetLoanFacilityData() {
    return this.EditLoanFacility
  }
  GetReferralCommissioData() {
    return this.EditReferralCommissioLoan
  }
}
