import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { CommonService } from '../../Services/common.service';
import { Subject } from 'rxjs'
import { Observable } from 'rxjs/Rx'

@Injectable({
  providedIn: 'root'
})
export class MemberService {


  private FiMemberTab1Data = new Subject<any>();

  constructor(private _http: HttpClient, private _CommonService: CommonService) { }


  private _listnClick = new Subject<any>();

  SaveingMemberDetailsForEdit: any

  SaveingFiMemberDetailsForEdit: any
  Buttontype: any;
  dateofbirth:any;

  CheckMemberTypeDuplicate(membertype) {
    const params = new HttpParams().set('MemberType', membertype);
    return this._CommonService.callGetAPI('/Banking/Masters/MemberType/CheckDuplicateMemberType', params, 'YES')

  }
  CheckMemberNameMemberCodeDuplicate(memberid,MemberType,MemberTypeCode): Observable<any> {
     const params = new HttpParams().set('memberid', memberid).set('MemberType', MemberType).set('MemberTypeCode', MemberTypeCode);
    return this._CommonService.callGetAPI('/Banking/Masters/MemberType/CheckDuplicateMemberNameCode', params, 'YES')
  }
  GetFIMemberNames(ContactType)
  {
    const params = new HttpParams().set('ContactType', ContactType);
    return this._CommonService.callGetAPI('/loans/Transactions/Firstinformation/GetFIMemberNames', params, 'YES')
  }
  GetFITabFdRdDetails(Memberid,LoanName)
  {
    const params = new HttpParams().set('Memberid', Memberid).set('LoanName',LoanName);
    return this._CommonService.callGetAPI('/loans/Transactions/Firstinformation/GetFITabFdRdDetails', params, 'YES')
  }
  CheckDocumentList(Documentid,ReferenceNo)
  {
    const params = new HttpParams().set('Documentid', Documentid).set('ReferenceNo',ReferenceNo);
    return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/CheckDocumentExist', params, 'YES')
  }
  SaveMemberTypeDetails(Data) {
    debugger
    //return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
    return this._CommonService.callPostAPI('/Banking/Masters/MemberType/SaveMemberType', Data);
  }
  UpdateMemberTypeDetails(Data) {
    return this._CommonService.callPostAPI('/Banking/Masters/MemberType/UpdateMemberType', Data);
  }
  GetMemberDetailsList() {
    return this._CommonService.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', '', 'NO')
  }

  GeFIMemberDetailsList() {
    return this._CommonService.callGetAPI('/Banking/Masters/GetallFIMembers', '', 'NO')
  }
  
  DeleteMemberDetails(memberid) {

    let path = '/Banking/Masters/MemberType/DeleteMemberType?MemberID=' + memberid
    return this._CommonService.callPostAPIMultipleParameters(path);
  }

  DeleteFiMemberDetails(MemberReferenceID, Userid) {
    let path = '/Banking/Masters/FIMember/DeleteFIMember?MemberReferenceID=' + MemberReferenceID + '&Userid=' + Userid
    return this._CommonService.callPostAPIMultipleParameters(path);
  }

  //Tab1
  SaveFIMemberMasterDetails(Data) {
    return this._CommonService.callPostAPI('/Banking/Masters/FIMember/SaveFIMemberMasterData', Data);
  }
  //Tab 4
  saveFiMemberApplicationReferenceData(data): Observable<any> {
    try {
      //  const params = new HttpParams().set('applicationid', applicationid).set('strapplictionid', strapplictionid);
      //  return this._CommonService.callPostAPI('/Banking/Masters/FIMember/SaveFIMemberReferenceData?'+ params, data);

      // const params = new HttpParams().set('applicationid', applicationid).set('strapplictionid', strapplictionid);
      return this._CommonService.callPostAPI('/Banking/Masters/FIMember/SaveFIMemberReferenceData', data);

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  //
  //Tab5
  SaveFIMemberReferalDetails(Data) {
    return this._CommonService.callPostAPI('/Banking/Masters/FIMember/SaveFIMemberReferralData', Data);
  }
  //


  // getting Data To Edit
  GetFIMemberDataToEditById(MemberRefId) {
    const params = new HttpParams().set('MemberReferenceId', MemberRefId);
    return this._CommonService.callGetAPI('/Banking/Masters/FIMember/GetFIMemberData', params, 'YES')
  }
  //

  CheckContactDuplicate(ContactReferenceId) {
    let path = '/Banking/Masters/checkMemberCountinMaster?ContactReferenceId=' + ContactReferenceId
    return this._CommonService.callPostAPIMultipleParameters(path);
  }

  CheckContactDuplicate1(ContactReferenceId) {
    const params = new HttpParams().set('ContactReferenceId', ContactReferenceId);
    return this._CommonService.callGetAPI('/Banking/Masters/checkMemberCountinMaster', params, 'YES')
  }


  SetMemberDetailsForEdit(data) {
    this.SaveingMemberDetailsForEdit = data
  }
  GetMemberDetailsForEdit() {
    return this.SaveingMemberDetailsForEdit
  }

  SetFIMemberDetailsForEdit(data) {
    this.SaveingFiMemberDetailsForEdit = data
  }
  GetFIMemberDetailsForEdit() {
    return this.SaveingFiMemberDetailsForEdit
  }

  SetButtonType(type) {
    this.Buttontype = type
  }
  GetButtonType() {
    return this.Buttontype
  }

  _SetFiMemberTab1Data(data) {
    this.FiMemberTab1Data.next(data)
  }
  _GetFiMemberTab1Data(): Observable<any> {
    return this.FiMemberTab1Data.asObservable();
  }
  SetDob(dob)
  {
    this.dateofbirth=dob
  }
  GetDob()
  {
    return this.dateofbirth
  }
}
