import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralReceiptService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetGeneralReceiptbyId(ReceiptId): Observable<any> {
    try {
      const params = new HttpParams().set('ReceiptId', ReceiptId);
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/GetgeneralreceiptReportData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }

  }

  ///api/Banking/Transactions/MaturityPayment/GetMaturitybondById

  getMaturityBondById(Maturitybonds_Id,Meturitybond_type): Observable<any> {
    try {
      const params = new HttpParams().set('Maturitybonds_Id', Maturitybonds_Id).set('Meturitybond_type', Meturitybond_type);
      return this._CommonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturitybondById', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }

  }
}
