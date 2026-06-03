import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DuesReportsService {

  constructor(private _CommonService:CommonService) { }

  GetDueReportByDate(FromDate, ToDate,recordid,fieldname,fieldtype,duestype){
    try {
      
      const params = new HttpParams().set('FromDate', FromDate).set('ToDate', ToDate).set('recordid', recordid).set('fieldname', fieldname).set('fieldtype', fieldtype).set('duestype',duestype);
      return this._CommonService.callGetAPI('/Loans/Reports/GetDuesSummaryReport',params, 'YES');
      }
     catch (e){
      this._CommonService.showErrorMessage(e);
       }

  }

  GetDueReportEmiByDate(loanid, transdate,todate,duestype){
    try {
      
      const params = new HttpParams().set('loanid', loanid).set('transdate', transdate).set('todate',todate).set('duestype',duestype);
      return this._CommonService.callGetAPI('/Loans/Transactions/Receipts/ViewParticularsDetails',params, 'YES');
      }
     catch (e){
      this._CommonService.showErrorMessage(e);
       }

  }
  GetGSTReportDetails(FromDate,ToDate):Observable<any>{
    try{
      const params=new HttpParams().set('FromDate', FromDate).set('ToDate',ToDate);
       return this._CommonService.callGetAPI('/Loans/Reports/GetGSTReport',params, 'YES');
      
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }

}
