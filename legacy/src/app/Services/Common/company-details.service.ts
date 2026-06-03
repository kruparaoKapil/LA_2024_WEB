import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailsService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetCompanyData(): Observable<any> {
    try {
      
      return this._CommonService.callGetAPI('/Settings/GetcompanyNameandaddressDetails', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
