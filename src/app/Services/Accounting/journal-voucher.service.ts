import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalVoucherService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetJvReport(Jvnumber): Observable<any> {
    try {
      const params = new HttpParams().set('Jvnumber', Jvnumber);
      return this._CommonService.callGetAPI('/Accounting/accountingtransactions/GetJournalVoucherReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
