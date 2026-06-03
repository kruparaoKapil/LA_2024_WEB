import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DisbursmentReportsService {

 
  constructor(private _CommonService:CommonService) { }

    GetDisbursedReportDetails(data){
    try {
      
       
        return this._CommonService.callPostAPI('/loans/Transactions/Disbursement/GetDisbursedReportDetails', data);
      }
     catch (e){
      this._CommonService.showErrorMessage(e);
       }

    }

    GetDisbursedReportDuesDetails(data){
      try {
        
          //const params = new HttpParams().set('fieldname', fieldname).set('type', type).set('month', month);
          return this._CommonService.callPostAPI('/loans/Transactions/Disbursement/GetDisbursedReportDuesDetails', data);
        }
       catch (e){
        this._CommonService.showErrorMessage(e);
         }
  
      }
}
