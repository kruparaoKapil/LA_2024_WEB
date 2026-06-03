import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InsuranceMemberService {
  ButtonClickType: string
  Data:any;
  constructor(private _commonservice: CommonService) { }
  SetButtonClickType(type) 
  {
    debugger
    this.ButtonClickType = type
  }
  GetButtonClickType() {
    return this.ButtonClickType
  }
  GetMemberDetailsList() {
    return this._commonservice.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', '', 'NO')
  }

  GetallInsurancemembers(MembertypeID) {
    const params = new HttpParams().set('MembertypeID', MembertypeID);
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetallInsuranceMembers', params, 'YES')
  }
  GetInsuranceSchemes(Membertype, Applicanttype) {
    const params = new HttpParams().set('Membertype', Membertype).set('Applicanttype', Applicanttype);
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetInsuranceSchemes', params, 'YES')
  }
  GetApplicantsDetails() {
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetApplicants', '', 'NO')
  }
  GetInsurenceSchemeDetails(InsuranceSchemeId) {
    const params = new HttpParams().set('InsuranceSchemeId', InsuranceSchemeId);
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetInsuranceSchemeDetails', params, 'YES')
  }
  saveInsurenceMemberDetail(data): Observable<any> {
    try {
      return this._commonservice.callPostAPI('/Banking/InsuranceMember/SaveInsuranceMember', data);
    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
    }
  }
  GetMemberDetailsforview(MemberId) {
    const params = new HttpParams().set('MemberId', MemberId);
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetMemberDetailsforview', params, 'YES')
  }
  GetInsuranceMembersMainGrid() {
    return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetInsuranceMembersMainGrid', '', 'NO')
  }
DeleteInsuranceMember(MemberReferenceID,Userid)
{
  debugger
  let path = '/Banking/InsuranceMember/DeleteInsuranceMember?MemberReferenceID=' + MemberReferenceID + '&Userid=' + Userid ;
 
  return this._commonservice.callPostAPIMultipleParameters(path);
}
  GetMemberDetailsforEdit(MemberReferenceID, Recordid)
  {
    const params = new HttpParams().set('MemberReferenceID', MemberReferenceID).set('Recordid', Recordid);
  return this._commonservice.callGetAPI('/Banking/InsuranceMember/GetMemberDetailsforEdit', params, 'YES')
  }
  checkInsuranceMemberDuplicates(MemberCode, InsuranceconfigID, InsuranceType, Recordid) {
    debugger
    const params = new HttpParams().set('MemberCode', MemberCode).set('InsuranceconfigID', InsuranceconfigID).set('InsuranceType', InsuranceType).set('Recordid', Recordid);
    return this._commonservice.callPostAPI('/Banking/InsuranceMember/checkInsuranceMemberDuplicates?' + params, 'YES');
 
  }
SetInsuranceMemberDetailsForEdit(data)
{
  this.Data=data
}
GiveInsuranceMemberDetailsForEdit()
{
  return this.Data
}
GetMemberDetailsformname(formname) {
  const params = new HttpParams().set('formname', formname);
  return this._commonservice.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', params, 'YES');
}
}
