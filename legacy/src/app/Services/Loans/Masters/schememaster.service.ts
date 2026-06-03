import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class SchememasterService {
  editloanid;
  editschemeid;
  recordid;
  data: [];
  status: any;
  constructor(private http: HttpClient, private _CommonService: CommonService) { }
  
 
  getLoanTypes(): Observable<any> {
    // return this.http.get<any[]>(environment.apiURL + "/loans/masters/loanmaster/getLoanTypes")
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanTypes', '', 'NO')
  }
 
  getLoanNames(loanTypeId): Observable<any> {
    const params = new HttpParams().set('loanTypeId', loanTypeId.toString());
    // return this.http.get<any[]>(environment.apiURL + "/loans/masters/loanmaster/getLoanNames", { params })
    return this._CommonService.callGetAPI('/loans/masters/loanmaster/getLoanNames', params, 'YES')
  }
  getLoanspecificSchemeMasterDetails(loanid): Observable<any> {
    const params = new HttpParams().set('loanid', loanid.toString());
    // return this.http.get<any[]>(environment.apiURL + "/loans/masters/schememaster/getLoanspecificSchemeMasterDetails", { params })
    return this._CommonService.callGetAPI('/loans/masters/schememaster/getLoanspecificSchemeMasterDetails', params, 'YES')
  }
  saveschememaster(schememasterdata) {
    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };    
    // return this.http.post(environment.apiURL + "/loans/masters/schememaster/saveSchemeMaster", schememasterdata, options)
    return this._CommonService.callPostAPI('/loans/masters/schememaster/saveSchemeMaster', schememasterdata)
  }
  CheckDuplicateSchemeNames(Schemename): Observable<any> {
    const params = new HttpParams().set('Schemename', Schemename.toString());
    //return this.http.get<any>(environment.apiURL + "/loans/masters/schememaster/CheckDuplicateSchemeNames", { params })
    return this._CommonService.callGetAPI('/loans/masters/schememaster/CheckDuplicateSchemeNames', params, 'YES')
  }
  CheckDuplicateSchemeCodes(schemecode):Observable<any>
  {
    const params = new HttpParams().set('schemecode', schemecode.toString());
    return this._CommonService.callGetAPI('/loans/masters/schememaster/CheckDuplicateSchemeCodes', params, 'YES')
  }
  getDataToGrid(): Observable<any> {
    //return this.http.get<any>(environment.apiURL + "/loans/masters/schememaster/getSchemeMasterDetails")
    return this._CommonService.callGetAPI('/loans/masters/schememaster/getSchemeMasterDetailsgrid    ', '', 'NO')
  }
  loadEditInformation(d) {
    this.data = d
  }
  getEditInformation() {
    return this.data;
  }
  getRecordid(recordid) {
    this.recordid = recordid;
  }
  sendrecordid() {
    return this.recordid
  }
  getDataToBind(recordid): Observable<any> {

    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // })
    // let HttpParams = { 'schemeId': recordid.sid, 'loanId': recordid.lid }
    // let options = {
    //   headers: httpHeaders,
    //   params: HttpParams
    // };

    // return this.http.get<any[]>(environment.apiURL + "/loans/masters/schememaster/getSchemeMasterDetailsbyId", options)
    const params = new HttpParams().set('schemeId', recordid.sid).set('loanId', recordid.lid)
    return this._CommonService.callGetAPI('/loans/masters/schememaster/getSchemeMasterDetailsbyId', params, 'YES')
  }
  newformstatus(status) {
    this.status = status
  }
  newstatus() {
    return this.status
  }
  updateschememaster(updatedschememasterdata) {
    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let options = {
    //   headers: httpHeaders
    // };   
    // return this.http.post(environment.apiURL + "/loans/masters/schememaster/UpdateSchemeMaster", updatedschememasterdata, options)
    return this._CommonService.callPostAPI('/loans/masters/schememaster/UpdateSchemeMaster', updatedschememasterdata)
  }
  DeleteSchemeMaster(deleteddata)
  {
    
    //let path = '/loans/masters/schememaster/DeleteSchemeMaster', deleteddata;
    //return this._CommonService.callPostAPIMultipleParameters(path)
    return this._CommonService.callPostAPI('/loans/masters/schememaster/DeleteSchemeMaster', deleteddata)
  }
}
