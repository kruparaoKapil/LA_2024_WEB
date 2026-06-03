import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LedgerExtractReportService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetLedgerExtractReport(fromdate, todate): Observable<any> {
    try {
      const params = new HttpParams().set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetLedgerExtractDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
