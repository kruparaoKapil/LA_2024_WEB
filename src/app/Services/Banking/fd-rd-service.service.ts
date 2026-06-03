import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'


@Injectable({
  providedIn: 'root'
})
export class FdRdServiceService {
  tabname:any;
  constructor(private _commonservice:CommonService) { }
  getTitleOnClick(title) {

    this.tabname = title;
  }
  sendTitle() {

    return this.tabname;
  }
  GetMemberDetailsList() {
    return this._commonservice.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', '', 'NO')
  }

  getRdConfigDetails() {
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdViewDetails', '', 'NO');
  }

  saveRdNameAndCode(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/SaverdNameAndCode', data);
  }

  saveRdConfigurationDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/Saverdconfigarationdetails', data);
  }

  saveRdConfigurationFacilityDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/SaveRdloanfacilityDetails', data);
  }

  saveRdIndentificationDocuments(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/SaveRDIdentificationDocumentsDetails', data);
  }

  saveRefferalDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/SaveRdReferralDetails', data);
  }

  getFdConfigDetails() {
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdViewDetails', '', 'NO');
  }

  saveFdNameAndCode(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/SaveFDNameAndCode', data);
  }

  saveFdConfigurationDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/SaveFDConfigurationDetails', data);
  }

  // getFdConfigId(fdName,fdNameAndCode) {
  //   const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
  //   return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdConfigurationDetails', params, 'YES');
  // }

  saveFdLoanFacilityDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/SaveFDLoanFacilityDetails', data);
  }

  saveFdIndentificationDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/SaveFDIdentificationDocumentsDetails', data);
  }

  saveFdRefferalDetails(data) {
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/SaveFDReferralCommissionDetails', data);
  }

  getFdNameAndCode(fdName,fdNameAndCode) {
    const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdNameAndCode', params, 'YES');
  }

  getFdConfigurationDetails(fdName,fdNameAndCode) {
    const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdConfigurationDetails', params, 'YES');
  }

  getFdLoanAndFacilityDetails(fdName,fdNameAndCode) {
    const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdLoanFacilityDetails', params, 'YES');
  }

  getFdReferralDetails(fdName,fdNameAndCode) {
    const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdReferralCommissionDetails', params, 'YES');
  }

  getFdIdentificationDetails(fdName,fdNameAndCode) {
    const params = new HttpParams().set('FDName', fdName).set('FdNameCode', fdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/GetFdIdentificationDocumentsDetails', params, 'YES');
  }

  getRdNameAndCode(rdName,rdNameAndCode) {
    const params = new HttpParams().set('RdName', rdName).set('RdNameCode', rdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdNameAndCodeDetails', params, 'YES');
  }

  getRdConfigurationDetails(rdName,rdNameAndCode) {
    const params = new HttpParams().set('RdName', rdName).set('RdNameCode', rdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdConfigurationDetails', params, 'YES');
  }

  getRdLoanAndFacilityDetails(rdName,rdNameAndCode) {
    const params = new HttpParams().set('RdName', rdName).set('RdNameCode', rdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdloanfacilityDetails', params, 'YES');
  }

  getRdReferralDetails(rdName,rdNameAndCode) {
    const params = new HttpParams().set('RdName', rdName).set('RdNameCode', rdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdReferralDetails', params, 'YES');
  }

  getRdIdentificationDetails(rdName,rdNameAndCode) {
    const params = new HttpParams().set('RdName', rdName).set('RdNameCode', rdNameAndCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/GetRdIdentificationDocumentsDetails', params, 'YES');
  }

  removeItemFromRdViewGrid(rdConfigId) {
    const params = new HttpParams().set('RdConfigId', rdConfigId);
    return this._commonservice.callPostAPI('/Banking/Masters/RdConfig/DeleteRdConfiguration?'+params, null);
  }

  removeItemFromFdViewGrid(fdConfigId) {
    const params = new HttpParams().set('FdConfigId', fdConfigId);
    return this._commonservice.callPostAPI('/Banking/Masters/FdConfig/DeleteFixedDepositConfig?'+params, null);
  }
  Checkduplicatename(FDname,FdnameCode) {
    const params = new HttpParams().set('FDName', FDname).set('FdnameCode',FdnameCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/CheckDuplicateFDName', params, 'YES');
  }
  CheckRDNameCodeDuplicate(RDconfigid,RDName,RdCode):Observable<any>{
    try{
       const params = new HttpParams().set('RDconfigid', RDconfigid).set('RDName',RDName).set('RdCode',RdCode);
    return this._commonservice.callGetAPI('/Banking/Masters/RdConfig/CheckDuplicateRDName', params, 'YES');
    }
     catch (e) {
            this._commonservice.showErrorMessage(e);
        }
  }
  CheckFDNameCodeDupllicate(FDConfigid,FDName,FdnameCode):Observable<any>{
    try{
       const params = new HttpParams().set('FDConfigid', FDConfigid).set('FDName',FDName).set('FdnameCode',FdnameCode);
    return this._commonservice.callGetAPI('/Banking/Masters/FdConfig/CheckDuplicateFDName', params, 'YES');
    }
     catch (e) {
            this._commonservice.showErrorMessage(e);
        }
  }
}
