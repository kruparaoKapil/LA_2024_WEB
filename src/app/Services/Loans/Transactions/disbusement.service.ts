import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs/Rx'
import { delay, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisbusementService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetDisbursementViewData(): Observable<any> {

    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetDisbursementViewData', '', 'NO');
  }
  GetApprovedApplicationsByID(pvchapplicationid): Observable<any> {
    const params = new HttpParams().set('vchapplicationid', pvchapplicationid);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetApprovedApplicationsByID', params, 'YES');
  }
  SaveLoanDisbursement(data) {
    return this._CommonService.callPostAPI('/loans/Transactions/Disbursement/SaveLoanDisbursement', data)
  }
  GetEmiChartReport(pvchapplicationid) {
    const params = new HttpParams().set('vchapplicationid', pvchapplicationid);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetEmiChartReport', params, 'YES');
  }
  GetEmiChartViewData(): Observable<any> {
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetEmiChartView', '', 'NO');
  }

  GetBrowkenDaysandAmount(disbursementmode,pvchapplicationid,emiday,papprovedloanamount, ploandisbusableamount,intrestrate, tenure, disbursedate, firstinstallmentdate,disbursementstatus,ploanpayin) {
    debugger
    const params = new HttpParams().set('disbursementmode', disbursementmode).set('applicationid', pvchapplicationid).set('emiday', emiday).set('loanamount', papprovedloanamount).set('disburseamount', ploandisbusableamount).set('intrestrate', intrestrate).set('tenure', tenure).set('disbursedate', disbursedate).set('firstinstallmentdate', firstinstallmentdate).set('disbursementstatus', disbursementstatus).set('ploanpayin', ploanpayin);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetBrowkenDaysandAmount', params, 'YES');
  }

  GetAdvanceEMIAmount(disburseamount, intrestrate, tenure, emitype) {
    const params = new HttpParams().set('disburseamount', disburseamount).set('intrestrate', intrestrate).set('tenure', tenure).set('emitype', emitype);
    return this._CommonService.callGetAPI('/loans/Transactions/Disbursement/GetAdvanceEMIAmount', params, 'YES');
  } 
}
