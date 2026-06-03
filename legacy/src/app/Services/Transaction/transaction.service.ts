import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { NullTemplateVisitor } from '@angular/compiler';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private commonService: CommonService) { }

  // /api/Banking/Transactions/ShareApplication/SaveShareApplication
  saveShareApplication(data): Observable<any> {
    try {
      return this.commonService.callPostAPI('/Banking/Transactions/ShareApplication/SaveShareApplication', data);
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }
  //  /api/Banking/InsuranceMember/GetallInsuranceMembers?MembertypeID
  getAllInsuranceSearchMembers(MembertypeID) {
    try {
      const params = new HttpParams().set('MembertypeID', MembertypeID);
      return this.commonService.callGetAPI('/Banking/InsuranceMember/GetallInsuranceMembers', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  getMemberTypeDetailsList() {
    try {
      return this.commonService.callGetAPI('/Banking/Masters/MemberType/BindMemberTypes', '', 'NO');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  // /Banking/Masters/ShareConfig/GetShareConfigViewDetails
  getShareConfigViewDetails() {
    try {
      return this.commonService.callGetAPI('/Banking/Masters/ShareConfig/GetShareConfigViewDetails', '', 'NO');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  //api/Banking/Transactions/ShareApplication/GetShareNames
  getShareNames(Membertype, Applicanttype) {
    try {
      const params = new HttpParams().set('Membertype', Membertype).set('Applicanttype', Applicanttype);
      return this.commonService.callGetAPI('/Banking/Transactions/ShareApplication/GetShareNames', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  //api/Banking/Transactions/ShareApplication/GetShareFaceValue

  getShareFaceValue(Membertype, Applicanttype, ShareName) {
    try {
      const params = new HttpParams().set('Membertype', Membertype).set('Applicanttype', Applicanttype).set('ShareName', ShareName);
      return this.commonService.callGetAPI('/Banking/Transactions/ShareApplication/GetShareFaceValue', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  //api/Banking/Transactions/ShareApplication/GetShareApplicationViewDetails
  getShareApplicationViewDetails() {
    try {
      return this.commonService.callGetAPI('/Banking/Transactions/ShareApplication/GetShareApplicationViewDetails', '', 'NO');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }
  //Banking/Transactions/ShareApplication/DeleteShareDetails
  

  DeleteShareDetails(ShareApplicationId): Observable<any> {
    try {
      const params = new HttpParams().set('ShareApplicationId', ShareApplicationId);
      return this.commonService.callPostAPI('/Banking/Transactions/ShareApplication/DeleteShareDetails?'+params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }


  //api/Banking/Transactions/ShareApplication/GetNomineeDetailsBasedonMemberRefid
  getNomineeDetailsBasedonMemberRefid(MembertypeID) {
    try {
      const params = new HttpParams().set('strmemberrefid', MembertypeID);
      return this.commonService.callGetAPI('/Banking/Transactions/ShareApplication/GetNomineeDetailsBasedonMemberRefid', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }
}
