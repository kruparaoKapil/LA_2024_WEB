import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReprintService {

  public reGrprintID = new Subject<any>();
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetReprintData(receiptno,recordid): Observable<any> {
    try {
      
      const params = new HttpParams().set('receiptno', receiptno).set('recordid', recordid);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetReprintCount', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetTransactiontypeData(): Observable<any> {
    try {
      
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetReprintBindDetails', '', 'N0');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  _setreprintid(data) {
    
    this.reGrprintID = data
    // this.GeneralReceiptView.next(data);
  }
  _getreprintid() {
    
    return this.reGrprintID
  }

  // Banking/Transactions/MaturityPayment/GetMaturitybondprint

  getMaturitybondprint(fdaccountno): Observable<any> {
    try {
      
      const params = new HttpParams().set('fdaccountno', fdaccountno);
      return this._CommonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturitybondprint', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/Banking/Transactions/MaturityPayment/GetMaturitybondprintbyid

  GetMaturitybondprintbyid(fdaccountno): Observable<any> {
    try {
      
      const params = new HttpParams().set('fdaccountno', fdaccountno);
      return this._CommonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturitybondprintbyid', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/MaturityPayment/GetMaturitybondconut

  getMaturityBondConut(fdaccountno,maturitytype): Observable<any> {
    try {
      
      const params = new HttpParams().set('fdaccountno', fdaccountno).set('maturitytype', maturitytype);
      return this._CommonService.callGetAPI('/Banking/Transactions/MaturityPayment/GetMaturitybondconut', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


}
