import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BankbookService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetBankNames(): Observable<any> {
    try {
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBankNames', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetBankBookReportbyDates(FromDate,ToDate,_pBankAccountId): Observable<any> {
    try {
      const params = new HttpParams().set('FromDate', FromDate).set('ToDate', ToDate).set('_pBankAccountId', _pBankAccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBankBookDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
