import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsmasterService {
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })


  constructor(private http: HttpClient, private _CommonService: CommonService) { }
  GetDocumentGroupNames(): Observable<any> {
    return this._CommonService.callGetAPI('/loans/masters/documentsmaster/GetDocumentGroupNames', '', 'NO')
    // return this.http.get<any[]>(environment.apiURL + '/loans/masters/documentsmaster/GetDocumentGroupNames');
  }
  SaveDocumentGroup(data) {
    // let options = {
    //   headers: this.httpHeaders,
    // };
    // return this.http.post(environment.apiURL + '/loans/masters/documentsmaster/SaveDocumentGroup', data,options)
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/SaveDocumentGroup', data)
  }
  SaveIdentificationDocuments(data: any) {
    //let options = {
      //headers: this.httpHeaders,
    //};
    // return this.http.post(environment.apiURL + '/loans/masters/documentsmaster/SaveIdentificationDocuments', data,options)
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/SaveIdentificationDocuments', data)
  }
  Getdocumentidprofftypes(): Observable<any> {
    // let HttpParams = { 'pLoanId': "0" }
    // let options = {
    //   headers: this.httpHeaders,
    //   params: HttpParams
    // };
    // return this.http.post<any[]>(environment.apiURL + '/loans/masters/documentsmaster/Getdocumentidprofftypes', options)
    const options = new HttpParams().set('pLoanId', "0")
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/GetdocumentidproffDetails', options)
  }

  checkProofTypeDuplicates(DocGroupName) {
    const params = new HttpParams().set('DocGroupName', DocGroupName.toString());
    // return this.http.get<any>(environment.apiURL + "/loans/masters/documentsmaster/CheckDuplicateGroupNames", { params })
    return this._CommonService.callGetAPI('/loans/masters/documentsmaster/CheckDuplicateGroupNames', params, 'YES')
  }

  checkDocumentsDuplicates(prooftype, proof, id) {
    // let HttpParams = { 'DocGroupName': prooftype, 'DocName': proof, 'DocumenId': id }
    // let options = {
    //   headers: this.httpHeaders,
    //   params: HttpParams
    // };
    // return this.http.get<any>(environment.apiURL + "/loans/masters/documentsmaster/CheckDuplicateDocNamesBasedonGroupName", options)
    const params = new HttpParams().set('DocGroupName', prooftype).set('DocName', proof).set('DocumenId', id)
    return this._CommonService.callGetAPI('/loans/masters/documentsmaster/CheckDuplicateDocNamesBasedonGroupName', params, 'YES')
  }

  updateDocumentsForm(data) {
    // let options = {
    //   headers: this.httpHeaders,
    // };
    // return this.http.post(environment.apiURL + '/loans/masters/documentsmaster/UpdateIdentificationDocuments', data, options);
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/UpdateIdentificationDocuments', data)
  }

  deleteDocuments(data) {
    // let options = {
    //   headers: this.httpHeaders,
    // };
    // return this.http.post(environment.apiURL + '/loans/masters/documentsmaster/DeleteIdentificationDocuments', data, options);
    return this._CommonService.callPostAPI('/loans/masters/documentsmaster/DeleteIdentificationDocuments', data)
  }

}
