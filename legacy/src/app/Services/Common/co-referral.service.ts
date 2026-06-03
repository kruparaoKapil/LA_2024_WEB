import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoReferralService {
  commisiondata = {}
  CoReferralvalidation:any;
  constructor(private commonService: CommonService) { }
  getReferralDetails() {
    try {
      
      return this.commonService.callGetAPI('/Settings/ReferralAdvocate/getReferralDetails', '', 'NO');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  getallEmployeeDetails() {
    try {
      return this.commonService.callGetAPI('/Settings/Employee/GetallEmployeeDetails', '', 'NO');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  SaveReferralData(data) {
    try {
      return this.commonService.callPostAPI('/Banking/SaveReferralData', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  
  ///api/TDS/Challana/SaveReferralData1



  SaveReferralData1(data) {
    try {
      return this.commonService.callPostAPI('/TDS/Challana/SaveReferralData1', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  //TDS/Challana/GetMaturityPaymetOldById

  GetMaturityPaymetOldById(MaturityPayment_Id)
  {
    
    const params = new HttpParams().set('MaturityPayment_Id', MaturityPayment_Id);
    return this.commonService.callGetAPI('/TDS/Challana/GetMaturityPaymetOldById',params,'Yes')
  }

  ///api/TDS/Challana/GetMaturityPaymetNewById

  GetMaturityPaymetNewById(MaturityPayment_Id)
  {
    
    const params = new HttpParams().set('MaturityPayment_Id', MaturityPayment_Id);
    return this.commonService.callGetAPI('/TDS/Challana/GetMaturityPaymetNewById',params,'Yes')
  }

  _setcommisiontype(type, value) {
    debugger
    this.commisiondata = { commissiontype: type, commissionvalue: value }
  }
  _GetCommisiontype() {
    debugger
    return this.commisiondata;
  }

  _SetCoReferralvalidation(data) {
    debugger
    this.CoReferralvalidation =data;
  }
  _GettCoReferralvalidation() {
    debugger
    return this.CoReferralvalidation;
  }
}
