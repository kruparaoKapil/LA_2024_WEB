import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Subject, Observable } from 'rxjs'
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RdTransactionsService {


  Membercode: any;
  Memeberid: any
  ApplicantType; any;
  contactid: any;
  contactrefid: any;
  Rdaccountno: any;
  Nomineedetails: any = []
  contacttype: any;
  griddata: any = []
  Datatobind: any;
  memberdetails = {}
  status: any;
  RdAccountId: any;
  Details = {}
  commisiondata = {}
  private RdTransactionTab1Data = new Subject<any>();
  public MemberNomineeDetails = new Subject<any>();
  public NomineeDetails = new Subject<any>();
  details = {}
  businessentitystatus: any;

  constructor(private _commonService: CommonService) { }

  sendMemberNomineeDetails(nomineedata) {
    this.MemberNomineeDetails.next(nomineedata);
  }
  getMemberNomineeDetails(): Observable<any> {
    debugger;
    return this.MemberNomineeDetails.asObservable();
  }

  setcontacttype(Contacttype) {
    this.contacttype = Contacttype
    // const params = new HttpParams().set('membercode', this.Membercode).set('Contacttype', Contacttype);
    // return this._commonService.callGetAPI('/Banking/Masters/GetallJointMembers',params,'Yes')
  }
  _SetContacttype(Contacttype) {
    this.contacttype = Contacttype
  }
  Newformstatus(status) {
    this.status = status
  }
  Newstatus() {
    return this.status
  }
  SetDetailsForEdit(data) {
    this.Datatobind = data
  }

  GetDetailsForEdit() {
    return this.Datatobind
  }
  _setrdMembercode(MemberCode, Memeberid) {
    debugger
    this.Membercode = MemberCode;
    this.Memeberid = Memeberid
    this.memberdetails = { MemberCode: this.Membercode, Memeberid: this.Memeberid }
  }
  _GetrdMemebercode() {
    return this.Membercode
  }

  _setcommisiontype(type, value) {
    debugger
    this.commisiondata = { commissiontype: type, commissionvalue: value }
  }
  _GetCommisiontype() {
    debugger
    return this.commisiondata
  }
  GetapplicantTypes(ContactType) {
    debugger
    const params = new HttpParams().set('ContactType', ContactType);
    return this._commonService.callGetAPI('/Banking/Masters/FIMember/GetapplicantTypes', params, 'Yes')
  }
  Getbranchdetails() {
    debugger
    return this._commonService.callGetAPI('/Banking/GetchitBranchDetails', '', 'NO')
  }
  Getbranchstatus() {
    debugger
    return this._commonService.callGetAPI('/Banking/GetchitBranchstatus', '', 'NO')
  }

  SetBusinessEntityStatus(status) {
    this.businessentitystatus = status
  }
  GetBusinessEntityStatus() {
    return this.businessentitystatus
  }
  _SetDataForJointMember(ApplicantType, pRdAccountId, Rdaccountno, Contactid, Contactrefid) {
    debugger
    this.ApplicantType = ApplicantType;
    this.Rdaccountno = Rdaccountno;
    this.RdAccountId = pRdAccountId
    this.Details = {
      ApplicantType: ApplicantType,
      RdAccountId: pRdAccountId,
      Rdaccountno: Rdaccountno,
      pContactid: Contactid,
      pContactrefid: Contactrefid
    }
  }
  _GetDataForJointMember() {
    return this.Details
  }
  _Setgriddata(griddata) {
    this.griddata = griddata
  }
  _Getgriddata() {
    return this.griddata
  }

  _Seteditdata(griddata) {
    this.griddata = griddata
  }
  _Geteditdata() {
    return this.griddata
  }

  _GetTab1Contacttype() {
    return this.contacttype
  }
  _SetNomineedetails(nomineedata) {
    this.Nomineedetails = nomineedata
  }
  _GetNomineeDetails() {
    return this.Nomineedetails
  }
  _Getcontacttype() {
    debugger
    this.details = { membercode: this.Membercode, Contacttype: this.contacttype }
    return this.details
  }

  _GetMemberdetails() {
    return this.memberdetails
  }

  /**RD Transaction Service */

  GetRDInterestamountsofTable(RDName, RdconfigId, TenureMode, Tenure, instalmentamount, MemberType) {
    try {
      const params = new HttpParams().set('RDName', RDName).set('RdconfigId', RdconfigId).set('TenureMode', TenureMode).set('Tenure', Tenure).set('instalmentamount', instalmentamount).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRDInterestamountsofTable', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRdSchemes(ApplicantType, MemberType): Observable<any> {

    try {
      const params = new HttpParams().set('ApplicantType', ApplicantType).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRdSchemes', params, 'YES');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRdTotalDetails(Rdname, ApplicantType, MemberType) {
    try {
      const params = new HttpParams().set('ApplicantType', ApplicantType).set('Rdname', Rdname).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRdSchemeDetailsforGrid', params, 'YES');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  GetRdSchemeTenureModes(Rdname, ApplicantType, MemberType) {
    try {
      const params = new HttpParams().set('Rdname', Rdname).set('ApplicantType', ApplicantType).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRdSchemeTenureModes', params, 'YES')
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }


  GetRdSchemeDetails(ApplicantType, MemberType, RdconfigID, Rdname, Tenure, Tenuremode, instalmentamount) {
    try {
      const params = new HttpParams().set('ApplicantType', ApplicantType).set('MemberType', MemberType).set('RdconfigID', RdconfigID)
        .set('Rdname', Rdname).set('Tenure', Tenure).set('Tenuremode', Tenuremode).set('instalmentamount', instalmentamount)
      return this._commonService.callGetAPI('/Banking/GetRdSchemeDetails', params, 'YES')
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRDDepositamountCountofInterestRate(Rdname, instalmentamount, MemberType) {
    try {
      const params = new HttpParams().set('Rdname', Rdname).set('instalmentamount', instalmentamount).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRDDepositamountCountofInterestRate', params, 'YES')
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  GetRdTransactionData() {
    try {
      const params = new HttpParams();
      return this._commonService.callGetAPI('/Banking/GetRdTransactionData', '', 'NO')
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRdTenuresofTable(RDName, RdconfigId, TenureMode, MemberType) {
    try {
      const params = new HttpParams().set('RDName', RDName).set('RdconfigId', RdconfigId).set('TenureMode', TenureMode).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRdTenuresofTable', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRdInstallmentsamountsofTable(RDName, RdconfigId, TenureMode, Tenure, MemberType) {
    try {
      const params = new HttpParams().set('RDName', RDName).set('RdconfigId', RdconfigId).set('TenureMode', TenureMode).set('Tenure', Tenure).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRdInstallmentsamountsofTable', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRDTenureandMininterestRateofInterestRate(Rdname, instalmentamount, Tenure, TenureMode, InterestPayout, MemberType) {
    try {
      const params = new HttpParams().set('Rdname', Rdname).set('instalmentamount', instalmentamount).set('Tenure', Tenure).set('TenureMode', TenureMode).set('InterestPayout', InterestPayout).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRDTenureandMininterestRateofInterestRate', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRDMaturityamount(pInterestMode, pInterestTenure, instalmentamount, pInterestPayOut, pCompoundorSimpleInterestType,pCompoundType, pInterestRate, pCalType) {
    try {
      const params = new HttpParams().set('pInterestMode', pInterestMode).set('pInterestTenure', pInterestTenure).set('instalmentamount', instalmentamount).set('pInterestPayOut', pInterestPayOut).set('pCompoundorSimpleInterestType', pCompoundorSimpleInterestType).set('pCompoundType', pCompoundType).set('pInterestRate', pInterestRate).set('pCalType', pCalType);
      return this._commonService.callGetAPI('/Banking/GetRDMaturityamount', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  SaveRDMemberandSchemeData(data) {
    try {
      return this._commonService.callPostAPI('/Banking/SaveRDMemberandSchemeData', data);
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  SaveRDJointMembersandNomineeData(data) {
    try {
      return this._commonService.callPostAPI('/Banking/SaveRDJointMembersandNomineeData', data);
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  SaveRDReferralData(data) {
    try {
      return this._commonService.callPostAPI('/Banking/SaveRDReferralData', data);
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  GetMemberNomineeDetails(MemberCode) {
    try {
      const params = new HttpParams().set('MemberCode', MemberCode);
      return this._commonService.callGetAPI('/Banking/GetMemberNomineeDetails', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRDallJointMembers(membercode, Contacttype) {
    try {
      const params = new HttpParams().set('membercode', membercode).set('Contacttype', Contacttype);
      return this._commonService.callGetAPI('/Banking/Masters/GetRDallJointMembers', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  GetRdTransactionDetailsforEdit(RdAccountNo, RdAccountId, accounttype) {
    try {
      const params = new HttpParams().set('RdAccountNo', RdAccountNo).set('RdAccountId', RdAccountId).set('accounttype', accounttype);
      return this._commonService.callGetAPI('/Banking/GetRdTransactionDetailsforEdit', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }


  GetRDPayoutsofTable(RDName, RdconfigId, TenureMode, Tenure, instalmentamount, Interestamount, Maturityamount) {
    try {
      const params = new HttpParams().set('RDName', RDName).set('RdconfigId', RdconfigId).set('TenureMode', TenureMode)
        .set('Tenure', Tenure).set('instalmentamount', instalmentamount).set('Interestamount', Interestamount).set('Maturityamount', Maturityamount);
      return this._commonService.callGetAPI('/Banking/GetRDPayoutsofTable', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  DeleteRdTransactions(RdAccountNo, pCreatedby) {
    try {
      //const params = new HttpParams().set('RdAccountNo', RdAccountNo).set('pCreatedby', pCreatedby);
      //return this._commonService.callPostAPI('/Banking/DeleteRdTransactions' + RdAccountNo=, null);

      let Url = '/Banking/DeleteRdTransactions?RdAccountNo=' + RdAccountNo +'&pCreatedby='+pCreatedby;
      return this._commonService.callPostAPI(Url,'');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }

  }
  GetRDMaturityamountsofTable(RDName, RdconfigId, TenureMode, Tenure, instalmentamount, Interestamount, MemberType) {
    try {
      const params = new HttpParams().set('RDName', RDName).set('RdconfigId', RdconfigId).set('TenureMode', TenureMode)
        .set('Tenure', Tenure).set('instalmentamount', instalmentamount).set('Interestamount', Interestamount).set('MemberType', MemberType);
      return this._commonService.callGetAPI('/Banking/GetRDMaturityamountsofTable', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }


  GetMembersForRd(Contacttype, MemberType,GroupID) {
    try {
      const params = new HttpParams().set('ContactType', Contacttype).set('MemberType', MemberType).set('GroupID',GroupID)
      return this._commonService.callGetAPI('/Banking/GetallRDMembers', params, 'Yes')
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
}
