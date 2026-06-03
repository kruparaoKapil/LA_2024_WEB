import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class BranchconfigService {





  constructor(private _http: HttpClient, private _CommonService: CommonService) { }

  getAddressTypes(): Observable<any> {
    try {
      //return this.http.get(this._CommonService.apiURL + '/loans/masters/contactmaster/GetAddressType?contactype=' + contactType);
      const params = new HttpParams().set('contactype', "BUSINESS ENTITY");
      return this._CommonService.callGetAPI('/loans/masters/contactmaster/GetAddressType', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getBranchDetails(): Observable<any> {
    try {
      const params = new HttpParams();
      return this._CommonService.callGetAPI('/Settings/Branch/getBranchDetails', params, 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  checkbranchnameDuplicates(branchname, branchcode, branchid): Observable<any> {
    const params = new HttpParams().set('branchname', branchname.toString()).set('branchcode', branchcode).set('branchid', branchid);
    return this._CommonService.callGetAPI('/Settings/Branch/checkbranchnameDuplicates', params, 'YES')
  }


  saveBranchconfigformdata(data): Observable<any> {
    return this._CommonService.callPostAPI('/Settings/Branch/SaveBranchDetails', data)
  }

}
