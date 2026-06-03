import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashbookService {
  
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetCashBookReportbyDates(startDate,endDate,transType): Observable<any> {
    try {
      const params = new HttpParams().set('fromdate', startDate).set('todate', endDate).set('transType',transType);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/getCashbookData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
