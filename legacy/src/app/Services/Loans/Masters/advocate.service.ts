import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment"
import { Subject } from 'rxjs'
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class AdvocateService {
  TitleinLoanCreationSelect: any

  constructor(private _http: HttpClient, private _CommonService: CommonService) { }

  SetSelectTitileAdvocateCreation(title) {
    this.TitleinLoanCreationSelect = title
  }

  saveadvocatedata(data): Observable<any> {

    try {
      if (data.ptypeofoperation == 'CREATE') {
        let savedata = JSON.stringify(data)
        return this._CommonService.callPostAPI('/Settings/ReferralAdvocate/saveAdvocate', savedata);
      }
      if (data.ptypeofoperation == 'UPDATE') {
        let updatedata = JSON.stringify(data)
        return this._CommonService.callPostAPI('/Settings/ReferralAdvocate/UpdatedAdvocateLawer', updatedata);
      }
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  DeleteAdvocateDetail(data): Observable<any> {

    try {
      return this._CommonService.callPostAPI('/Settings/ReferralAdvocate/DeleteAdvocateLawer', data);
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  checkContactIndividual(contactdata, refdata): Observable<any> {
    try {
      const params = new HttpParams().set("ContactId", contactdata).set("RefId", refdata);
      return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/CheckAdvocateDuplicate', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getAdvocateDetails(loanTypeId): Observable<any> {
    const params = new HttpParams().set('Type', loanTypeId.toString());
    return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/getAdvocateLawterDetails', params, 'YES')
  }

  getViewAdvocateDetails(referralid): Observable<any> {
    const params = new HttpParams().set('Refid', referralid.toString());
    return this._CommonService.callGetAPI('/Settings/ReferralAdvocate/ViewAdvocateLawerDetails', params, 'YES')
  }
}

//api/Settings/ReferralAdvocate/UpdatedAdvocateLawer
