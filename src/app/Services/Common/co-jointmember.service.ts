import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Subject, Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class CoJointmemberService {
  Membercode: any;
  Memeberid: any
  memberdetails = {}
  contacttype:any;
  details = {}
  ShareAccountdata = {}
  nomineeList={}
  CoJointmembervalidation:any;
  public MemberNomineeDetails = new Subject<any>();
   constructor(private _commonService: CommonService) { }
  _setfdMembercode(MemberCode, Memeberid) {
    debugger
    this.Membercode = MemberCode;
    this.Memeberid = Memeberid
    this.memberdetails = { MemberCode: this.Membercode, Memeberid: this.Memeberid }
  }
  _GetfdMembercode() {
    debugger
     return this.memberdetails;
  }
  _SetContacttype(Contacttype) {
    this.contacttype = Contacttype
  }
  _Getcontacttype() {
    debugger
    this.details = { membercode: this.Membercode, Contacttype: 'Individual' }
    return this.details
  }
  _GetfdMemebercode() {
    return this.Membercode;
  }
  _SetShareAccountdata(data) {
    debugger
    this.ShareAccountdata =data;
  }
  _GetShareAccountdata() {
    debugger
    return this.ShareAccountdata
  }
  _SetnomineeList(data) {
    debugger
    this.nomineeList =data;
  }
  _GetnomineeList() {
    debugger
    return this.nomineeList;
  }
  sendMemberNomineeDetails(nomineedata) {
    debugger;
    this.MemberNomineeDetails.next(nomineedata);
  }
  getMemberNomineeDetails(): Observable<any> {
    debugger;
    return this.MemberNomineeDetails.asObservable();
  }
  _SetCoJointmembervalidation(data) {
    debugger
    this.CoJointmembervalidation =data;
  }
  _GettCoJointmembervalidation() {
    debugger
    return this.CoJointmembervalidation;
  }
  SaveJointMember(data) {
    return this._commonService.callPostAPI('/Banking/SaveshareJointMembersandNomineeData', data);
  }
  GetJointMembers(membercode, Contacttype) {
    const params = new HttpParams().set('membercode', membercode).set('Contacttype', Contacttype);
    return this._commonService.callGetAPI('/Banking/Masters/GetallJointMembers', params, 'Yes')
  }
  GetMemberEditNomineeDetails(MemberCode,AccountType) {
    try {
      const params = new HttpParams().set('MemberCode', MemberCode).set('AccountType', AccountType);
      return this._commonService.callGetAPI('/Banking/GetMemberEditNomineeDetails', params, 'Yes');
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
}
