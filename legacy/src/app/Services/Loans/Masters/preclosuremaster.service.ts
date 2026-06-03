import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class PreclosureService {
  editinfo: any;
  deleteinfo: any;
  status: any;
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  constructor(private _http: HttpClient, private _CommonService: CommonService) { }
  getLoanTypes(): Observable<any> {
    //return this._http.get<any>(environment.apiURL + '/loans/masters/loanmaster/getLoanTypes')
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
  }

  sendPreclosurechargesform(data): Observable<any> {
    // let options = {
    //   headers: this.httpHeaders
    // };
    // return this._http.post<any>(environment.apiURL + '/loans/masters/ChargesMaster/SavePreclouserCharges', data, options);
    return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/SavePreclouserCharges', data)
  }

  getDatatopreclosureview(): Observable<any> {
    // let options = {
    //   headers: this.httpHeaders,
    // };
    // return this._http.get<any[]>(environment.apiURL + '/loans/masters/ChargesMaster/ViewPreclouserCharges', options);
    return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/ViewPreclouserCharges', '', 'NO')
  }

  loadEditInformation(data) {
    this.editinfo = data;
  }

  getEditInformation() {
    return this.editinfo;
  }

  getDatatobind(edit): Observable<any> {
    // 
    // let HttpParams = { 'Recordid': edit.pRecordid, 'Loanid': edit.pLoanid }
    // let options = {
    //   headers: this.httpHeaders,
    //   params: HttpParams
    // };
    // return this._http.get<any[]>(environment.apiURL + '/loans/masters/ChargesMaster/GetePreclouserCharges', options);
    const params = new HttpParams().set('Recordid', edit.pRecordid).set('Loanid', edit.pLoanid)
    return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetePreclouserCharges', params, 'YES')
  }

  saveUpdatedform(data): Observable<any> {
    // let options = {
    //   headers: this.httpHeaders,
    // };
    // return this._http.post<any>(environment.apiURL + '/loans/masters/ChargesMaster/UpdatePreclouserCharges', data, options);
    return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/UpdatePreclouserCharges', data)
  }

  getStatusFromPreclosureView(data) {
    this.status = data;
  }

  sendStatusToPreclosureMaster() {
    return this.status;
  }

  deletePreclosureMaster(loanid, recordid,id): Observable<any> {
   
    // let HttpParams = { 'Loanid': loanid, 'Recordid': recordid }
    // let options = {
    //   headers: this.httpHeaders,
    //   params: HttpParams
    // };
    // return this._http.post<any>(environment.apiURL + "/loans/masters/ChargesMaster/DeletePreclouserCharges", options);
    let path = '/loans/masters/ChargesMaster/DeletePreclouserCharges?Loanid=' + loanid + '&Recordid=' + recordid + '&userid=' +id;
    return this._CommonService.callPostAPIMultipleParameters(path);
  }

  checkPreClosureDuplicates(loanid): Observable<any> {
    const params = new HttpParams().set('Loanid', loanid.toString());
    // return this._http.get<any>(environment.apiURL + "/loans/masters/ChargesMaster/CheckDuplicateLoanid", { params })
    return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/CheckDuplicateLoanid', params, 'YES')
  }


}
