import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../Services/common.service';

@Injectable({
  providedIn: 'root'
})
export class TdsdetailsService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }


  getTDSsectiondetails(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/getTdsSectionNo', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getGSTdetails(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/getGstType', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  saveTDS(data) {
    return this._CommonService.callPostAPI('/Settings/ReferralAdvocate/SaveTdsSectionNo', data);
  }
  saveGST(data) {
    return this._CommonService.callPostAPI('/Settings/ReferralAdvocate/SaveGstType', data);
  }

  checkTDS(Tds): Observable<any> {
    try {
      const params = new HttpParams().set("TdsSecName", Tds);
      return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/CheckTdsSectionDuplicate', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  checkGST(GST): Observable<any> {
    try {
      const params = new HttpParams().set("strGstType", GST);
      return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/CheckGstTypeDuplicate', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

}

//api/Settings/ReferralAdvocate/getGstType

// //api/Settings/ReferralAdvocate/getTdsSectionNo
