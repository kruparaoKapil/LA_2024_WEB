import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentVoucherService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetPaymentVoucherbyId(paymentId): Observable<any> {
    try {
      const params = new HttpParams().set('paymentId', paymentId);
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetPaymentVoucherReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
}
