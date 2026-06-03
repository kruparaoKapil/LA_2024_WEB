import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Subject, Observable } from 'rxjs'
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FdRdTransactionsService {

  Membercode: any;
  Memeberid: any
  ApplicantType; any;
  contactid: any;
  contactrefid: any;
  Fdaccountno: any;
  Nomineedetails: any = []
  contacttype: any;
  griddata: any = []
  Datatobind: any;
  memberdetails = {}
  status: any;
  fdaccountid: any;
  Details = {}
  commisiondata = {}
  private RdTransactionTab1Data = new Subject<any>();
  public jointMember = new Subject<any>();
  details = {}
  fdaccountno: any;
  businessentitystatus: any;

  constructor(private _commonService: CommonService) { }

  _SetRdTransTab1Data(data) {
    this.RdTransactionTab1Data.next(data)
  }
  _GetRdTransTab1Data(): Observable<any> {
    return this.RdTransactionTab1Data.asObservable();
  }
  GetapplicantTypes(ContactType) {
    debugger
    const params = new HttpParams().set('ContactType', ContactType);
    return this._commonService.callGetAPI('/Banking/Masters/FIMember/GetapplicantTypes', params, 'Yes')
  }
  GetMembersForFd(Contacttype, MemberType) {
    debugger
    const params = new HttpParams().set('ContactType', Contacttype).set('MemberType', MemberType)
    return this._commonService.callGetAPI('/Banking/GetallFDMembers', params, 'Yes')

  }
  GetFdSchemes(ApplicantType, MemberType) {
    const params = new HttpParams().set('ApplicantType', ApplicantType).set('MemberType', MemberType)
    return this._commonService.callGetAPI('/Banking/GetFdSchemes', params, 'Yes')
  }
  // GetFdSchemeDetails(FdDetailsRecordid)
  // {
  //   const params = new HttpParams().set('FdDetailsRecordid', FdDetailsRecordid);
  //   return this._commonService.callGetAPI('/Banking/GetFdSchemeDetails',params,'Yes')
  // }
  _setfdMembercode(MemberCode, Memeberid) {
    debugger
    this.Membercode = MemberCode;
    this.Memeberid = Memeberid
    this.memberdetails = { MemberCode: this.Membercode, Memeberid: this.Memeberid }
  }
  _GetfdMemebercode() {
    return this.Membercode
  }
  setcontacttype(Contacttype) {
    this.contacttype = Contacttype
    // const params = new HttpParams().set('membercode', this.Membercode).set('Contacttype', Contacttype);
    // return this._commonService.callGetAPI('/Banking/Masters/GetallJointMembers',params,'Yes')
  }
  _SetContacttype(Contacttype) {
    this.contacttype = Contacttype
  }
  SetBusinessEntityStatus(status) {
    this.businessentitystatus = status
  }
  GetBusinessEntityStatus() {
    return this.businessentitystatus
  }
  _Getcontacttype() {
    debugger
    this.details = { membercode: this.Membercode, Contacttype: this.contacttype }
    return this.details
  }
  _GetMemberdetails() {
    return this.memberdetails
  }
  _GetfdMemberid() {
    return this.Memeberid
  }
  GetJointMembers(membercode, Contacttype) {
    const params = new HttpParams().set('membercode', membercode).set('Contacttype', Contacttype);
    return this._commonService.callGetAPI('/Banking/Masters/GetallJointMembers', params, 'Yes')
  }
  GetFDMemberNomineeDetails(MemberCode) {
    const params = new HttpParams().set('MemberCode', MemberCode);
    return this._commonService.callGetAPI('/Banking/GetFDMemberNomineeDetails', params, 'Yes')
  }
  SaveFDMemberandSchemeData(data) {
    return this._commonService.callPostAPI('/Banking/SaveFDMemberandSchemeData', data);
  }
  _SetDataForJointMember(ApplicantType, pFdAccountId, Fdaccountno, Contactid, Contactrefid) {
    debugger
    this.ApplicantType = ApplicantType;
    this.Fdaccountno = Fdaccountno;
    this.fdaccountid = pFdAccountId
    this.Details = {
      ApplicantType: ApplicantType,
      FdAccountId: pFdAccountId,
      Fdaccountno: Fdaccountno,
      pContactid: Contactid,
      pContactrefid: Contactrefid
    }
  }
  _GetDataForJointMember() {
    return this.Details
  }
  SaveRefferalform(data) {
    return this._commonService.callPostAPI('/Banking/SaveFDReferralData', data);
  }
  GetFdTransactionData() {
    return this._commonService.callGetAPI('/Banking/GetFdTransactionData', '', 'NO')
  }
  DeleteFdTranscation(FdAccountNo, pCreatedby) {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo).set('pCreatedby', pCreatedby);
    return this._commonService.callPostAPI('/Banking/DeleteFdTransactions?' + params, null);
  }
  Getbranchdetails() {
    debugger
    return this._commonService.callGetAPI('/Banking/GetchitBranchDetails', '', 'NO')
  }

    Getbranchdetails1() {
    debugger
    return this._commonService.callGetAPI('/Banking/GetchitBranchDetails1', '', 'NO')
  }
  GetDataForBondPreview() {
    return this._commonService.callGetAPI('/Banking/Transactions/BondsPreview/GetBondsDetails', '', 'NO')
  }
  GetDataForBondPreview1(date) {
    const params = new HttpParams().set('date', date);
    return this._commonService.callGetAPI('/Banking/Transactions/BondsPreview/GetBondsDetails', params, 'Yes')
  }
  //Banking/Transactions/BondsPreview/GetBondspreDetails
  GetBondspreDetails(date) {
    const params = new HttpParams().set('date', date);
    return this._commonService.callGetAPI('/Banking/Transactions/BondsPreview/GetBondspreDetails', params, 'Yes')
  }
  GetBondPreviewReport(fdaccountnos) {
    console.log("selected fdnos are", fdaccountnos)
    const params = new HttpParams().set('fdaccountnos', fdaccountnos);
    return this._commonService.callGetAPI('/Banking/Transactions/BondsPreview/GetBondsPreviewDetails', params, 'Yes')
  }
  Getbranchstatus() {
    debugger
    return this._commonService.callGetAPI('/Banking/GetchitBranchstatus', '', 'NO')
  }
  GetTenureDetails(FDName, FdconfigId, TenureMode, MemberType) {
    const params = new HttpParams().set('FDName', FDName).set('FdconfigId', FdconfigId).set('TenureMode', TenureMode).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetFdTenuresofTable', params, 'Yes')
  }
  GetDepositAmount(FDName, FdconfigId, TenureMode, Tenure, MemberType) {
    const params = new HttpParams().set('FDName', FDName).set('FdconfigId', FdconfigId).set('TenureMode', TenureMode).set('Tenure', Tenure).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetFdDepositamountsofTable', params, 'Yes')
  }
  SaveJointMember(data) {
    return this._commonService.callPostAPI('/Banking/SaveFDJointMembersandNomineeData', data);
  }
  GetFdTransactionDetailsforEdit(FdAccountNo, FdAccountId) {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo).set('FdAccountId', FdAccountId).set('accounttype', 'FD Transaction');
    return this._commonService.callGetAPI('/Banking/GetFdTransactionDetailsforEdit', params, 'Yes')
  }
  GetIntrestAmount(pInterestMode, pInterestTenure, pDepositAmount, pInterestPayOut, pCompoundorSimpleInterestType, pInterestRate, pCalType) {
    const params = new HttpParams().set('pInterestMode', pInterestMode).set('pInterestTenure', pInterestTenure).set('pDepositAmount', pDepositAmount)
      .set('pDepositAmount', pDepositAmount).set('pInterestPayOut', pInterestPayOut).
      set('pCompoundorSimpleInterestType', pCompoundorSimpleInterestType).set('pInterestRate', pInterestRate).set('pCalType', pCalType);
    return this._commonService.callGetAPI('/Banking/GetMaturityamount', params, 'Yes')
  }
  SetDetailsForEdit(data) {
    this.Datatobind = data
  }

  GetDetailsForEdit() {
    return this.Datatobind
  }
  Newformstatus(status) {
    this.status = status
  }
  Newstatus() {
    return this.status
  }
  GetDataBasedOnTenure(ApplicantType, MemberType, FdconfigID, Fdname, Tenure, TenureMode, Depositamount) {
    const params = new HttpParams().set('ApplicantType', ApplicantType).set('MemberType', MemberType).set('FdconfigID', FdconfigID)
      .set('Fdname', Fdname).set('Tenure', Tenure).set('TenureMode', TenureMode).set('Depositamount', Depositamount)

    return this._commonService.callGetAPI('/Banking/GetFdSchemeDetails', params, 'Yes')
  }
  InterestamountsofTable(FDName, FdconfigId, TenureMode, Tenure, Depositamount, MemberType) {
    const params = new HttpParams().set('FDName', FDName).set('FdconfigId', FdconfigId).set('TenureMode', TenureMode).set('Tenure', Tenure).set('Depositamount', Depositamount).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/InterestamountsofTable', params, 'Yes')
  }
  MaturityamountsofTable(FDName, FdconfigId, TenureMode, Tenure, Depositamount, Interestamount, MemberType) {
    const params = new HttpParams().set('FDName', FDName).set('FdconfigId', FdconfigId).set('TenureMode', TenureMode)
      .set('Tenure', Tenure).set('Depositamount', Depositamount).set('Interestamount', Interestamount).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/MaturityamountsofTable', params, 'Yes')
  }
  PayoutsofTable(FDName, FdconfigId, TenureMode, Tenure, Depositamount, Interestamount, Maturityamount) {
    const params = new HttpParams().set('FDName', FDName).set('FdconfigId', FdconfigId).set('TenureMode', TenureMode)
      .set('Tenure', Tenure).set('Depositamount', Depositamount).set('Interestamount', Interestamount).set('Maturityamount', Maturityamount);
    return this._commonService.callGetAPI('/Banking/PayoutsofTable', params, 'Yes')
  }
  _SetNomineedetails(nomineedata) {
    this.Nomineedetails = nomineedata

  }
  _GetNomineeDetails() {
    return this.Nomineedetails
  }
  GetTotalDetails(Fdname, ApplicantType, MemberType) {
    const params = new HttpParams().set('Fdname', Fdname).set('ApplicantType', ApplicantType).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetFdSchemeDetailsforGrid', params, 'Yes')
  }
  GetDepositCount(Fdname, Depositamount, MemberType) {
    const params = new HttpParams().set('Fdname', Fdname).set('Depositamount', Depositamount).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetDepositamountCountofInterestRate', params, 'Yes')
  }
  GetTenureAndIntrestRate(Fdname, Depositamount, Tenure, TenureMode, InterestPayout, MemberType) {
    const params = new HttpParams().set('Fdname', Fdname).set('Depositamount', Depositamount).set('Tenure', Tenure).set('TenureMode', TenureMode).set('InterestPayout', InterestPayout).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetTenureandMininterestRateofInterestRate', params, 'Yes')
  }
  setfdaccountno(fdaccountno) {
    this.fdaccountno = fdaccountno
  }
  Getfdaccountno() {
    return this.fdaccountno
  }
  GetTenureModesnames(Fdname, ApplicantType, MemberType) {
    const params = new HttpParams().set('Fdname', Fdname).set('ApplicantType', ApplicantType).set('MemberType', MemberType);
    return this._commonService.callGetAPI('/Banking/GetFdSchemeTenureModes', params, 'Yes')
  }
  GetTransferSchemeNames() {
    return this._commonService.callGetAPI('/Banking/Transactions/GetFdSchemes', '', 'NO')
  }
  GetFromAccountDetails() {

    return this._commonService.callGetAPI('/Banking/Transactions/GetFdFromDetails', '', 'NO')
  }
  GetToAccountDetails(BranchName, Membercode) {
    const params = new HttpParams().set('BranchName', BranchName).set('Membercode', Membercode);
    return this._commonService.callGetAPI('/Banking/Transactions/GetFdToDetails', params, 'Yes')
  }
  GetTransferMemberDetails(BranchName) {
    const params = new HttpParams().set('BranchName', BranchName);
    return this._commonService.callGetAPI('/Banking/Transactions/FdTransfer/GetMemberDetails', params, 'Yes')
  }
  SaveTransferform(form) {
    return this._commonService.callPostAPI('/Banking/Transactions/SaveFdTransfer', form);
  }
  GetFdfromaccountdetailsbyid(FdAccountNo) {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonService.callGetAPI('/Banking/Transactions/GetFromAccountDetailsByid', params, 'Yes')
  }
  GetFdToaccountdetailsbyid(FdAccountNo) {
    const params = new HttpParams().set('FdAccountNo', FdAccountNo);
    return this._commonService.callGetAPI('/Banking/Transactions/GetToAccountFdDetailsByid', params, 'Yes')
  }
  _Setgriddata(griddata) {
    this.griddata = griddata
  }
  _Getgriddata() {
    return this.griddata
  }
  _setcommisiontype(type, value) {
    debugger
    this.commisiondata = { commissiontype: type, commissionvalue: value }
  }
  _GetCommisiontype() {
    debugger
    return this.commisiondata
  }
  _GetTab1Contacttype() {
    return this.contacttype
  }
  SaveBondPreview(data) {
    return this._commonService.callPostAPI('/Banking/Transactions/BondsPreview/SaveBondsPrint', data);
  }


  Getbranches(): Observable<any> {
    try {
      const params = new HttpParams();
      return this._commonService.callGetAPIWithout('/Banking/Transactions/FdReceipt/GetGlobalBranches', params, 'NO');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

}
