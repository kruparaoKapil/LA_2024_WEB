import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JvListReportServicesService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetJvListReport(fromdate, todate, pmodeoftransaction): Observable<any> {
    try {
      const params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('pmodeoftransaction', pmodeoftransaction);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetJvListDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  
  GetJvListReport1(fromdate, todate, modeOfTransaction,Formname): Observable<any> {
    try {
      const params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('modeOfTransaction', modeOfTransaction).set('Formname', Formname);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetJvListDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getFormNameDetails() {
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetFormNameDetails', '', 'No');
}

//Accounting/AccountingReports/GetFILDNameDetails

// getFILDNameDetails() {
//   return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetFILDNameDetails', '', 'No');
// }
//Accounting/AccountingReports/GetTrnastype


getFILDNameDetails(formname): Observable<any> {
  try {
    const params = new HttpParams().set('formname', formname);
    return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetTrnastype', params, 'YES');
  }
  catch (e) {
    this._CommonService.showErrorMessage(e);
  }
}
}
