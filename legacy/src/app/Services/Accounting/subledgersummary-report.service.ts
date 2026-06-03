import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubledgersummaryReportService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetSubLedgerAccountNames(): Observable<any> {
    try {

      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetMainAccountHeads', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetAccountHeadNames(pAccountType): Observable<any> {
    try {
      const params = new HttpParams().set('acctype', pAccountType);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetSubLedgerAccountNames', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  GetSubLedgerSummaryReportData(mainAccountid, parentids, fromDate, toDate): Observable<any> {
    try {
      const params = new HttpParams().set('mainAccountid', mainAccountid).set('parentids', parentids).set('fromDate', fromDate).set('toDate', toDate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetSubLedgerSummaryReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetMonthlyComparisionReportData(mainAccountid, parentids, fromDate, toDate): Observable<any> {
    try {
      const params = new HttpParams().set('mainAccountid', mainAccountid).set('parentids', parentids).set('fromDate', fromDate).set('toDate', toDate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetMonthlyComparisionReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
