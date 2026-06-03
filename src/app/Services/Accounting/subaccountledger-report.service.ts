import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubaccountledgerReportService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetSubAccountLedger(): Observable<any> {
    try {
      //const params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('pmodeoftransaction', pmodeoftransaction);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetSubAccountLedgerDetails', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  GetAccountLedgerNames(SubLedgerName): Observable<any> {
    try {
      const params = new HttpParams().set('SubLedgerName', SubLedgerName);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetAccountLedgerNames', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetSubAccountLedgerReportData(SubLedgerName,parentid,fromDate,toDate): Observable<any> {
    try {
      const params = new HttpParams().set('SubLedgerName', SubLedgerName).set('parentid', parentid).set('fromDate', fromDate).set('toDate', toDate);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetSubAccountLedgerReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
