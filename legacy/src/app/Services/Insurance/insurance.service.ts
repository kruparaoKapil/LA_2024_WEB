import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(private _commonservice: CommonService) { }

  GetCompanyBranchDetails() {
    return this._commonservice.callGetAPI('/Settings/getCompanyandbranchdetails', '', 'NO');
    // return this._http.get(environment.apiURL + '/Settings/getCompanyandbranchdetails')
  }


  saveInsurenceNameAndCode(data): Observable<any> {
    try {
      return this._commonservice.callPostAPI('/Banking/Masters/InsurenceConfig/SaveInsurenceNameAndCode', data);
    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
    }
  }

  saveInsurenceConfigDetail(data): Observable<any> {
    try {
      return this._commonservice.callPostAPI('/Banking/Masters/InsurenceConfig/SaveInsurenceConfigDetails', data);
    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
    }
  }

  getInsurenceViewDetails() {
    try {
      return this._commonservice.callGetAPI('/Banking/Masters/InsurenceConfig/GetInsurenceViewDetails', '', 'NO');
    } catch (error) {
      this._commonservice.showErrorMessage(error);
    }
  }

  saveReferralData(data): Observable<any> {
    try {
      return this._commonservice.callPostAPI('/Banking/Masters/InsurenceConfig/SaveInsurenceReferralDetails', data);
    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
    }
  }

  deleteInsuranceConfigData(insurenceConfigId): Observable<any> {
    try {
      const params = new HttpParams().set('InsurenceConfigId', insurenceConfigId);
      return this._commonservice.callPostAPI('/Banking/Masters/InsurenceConfig/DeleteInsurenceConfiguration?'+params, 'YES');
    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
    }
  }

  // /Banking/Masters/InsurenceConfig/GetInsurenceNameAndCodeDetails?InsurenceName=Insurance&InsurenceNameCode=IEKITFD00001
  getInsurenceNameAndCodeDetails(insurenceName,insurenceNameCode){
    try {
      const params = new HttpParams().set('InsurenceName', insurenceName).set('InsurenceNameCode', insurenceNameCode);
      return this._commonservice.callGetAPI('/Banking/Masters/InsurenceConfig/GetInsurenceNameAndCodeDetails', params, 'YES');
    } catch (error) {
      this._commonservice.showErrorMessage(error);
    }
  }
  ///Banking/Masters/InsurenceConfig/GetInsurenceConfigurationDetails?InsurenceName=KCS&InsurenceNameCode=KSKITFD00001
  getInsurenceConfigurationDetails(insurenceName,insurenceNameCode){
    try {
      const params = new HttpParams().set('InsurenceName', insurenceName).set('InsurenceNameCode', insurenceNameCode);
      return this._commonservice.callGetAPI('/Banking/Masters/InsurenceConfig/GetInsurenceConfigurationDetails', params, 'YES');
    } catch (error) {
      this._commonservice.showErrorMessage(error);
    }
  }
  // /Banking/Masters/InsurenceConfig/GetInsurenceReferralDetails?InsurenceName=kapil%20groups&InsurenceNameCode=KGKITFD00001
  getInsurenceReferralDetails(insurenceName,insurenceNameCode){
    try {
      const params = new HttpParams().set('InsurenceName', insurenceName).set('InsurenceNameCode', insurenceNameCode);
      return this._commonservice.callGetAPI('/Banking/Masters/InsurenceConfig/GetInsurenceReferralDetails', params, 'YES');
    } catch (error) {
      this._commonservice.showErrorMessage(error);
    }
  }
  // api/Banking/Masters/InsurenceConfig/GetInsurenceNameCount
  checkExistingInsurenceName(insurenceName){
    try {
      const params = new HttpParams().set('InsurenceName', insurenceName);
      return this._commonservice.callGetAPI('/Banking/Masters/InsurenceConfig/GetInsurenceNameCount', params, 'YES');
    } catch (error) {
      this._commonservice.showErrorMessage(error);
    }
  }
}
