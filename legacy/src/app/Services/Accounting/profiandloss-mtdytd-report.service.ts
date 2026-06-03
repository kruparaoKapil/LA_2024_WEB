import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfiandlossMtdytdReportService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetMtdYtdPandL(ReportType, fromDate): Observable<any> {
    try {
      const params = new HttpParams().set('ReportType', ReportType).set('fromDate', fromDate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetMtdYtdPandL', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
