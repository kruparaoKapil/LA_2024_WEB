import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoanStatementServicesService {

  constructor(private _CommonService:CommonService) { }

  GetAccountstatementReport(VchapplicationID){
    try {
      
      const params = new HttpParams().set('VchapplicationID', VchapplicationID);
      return this._CommonService.callGetAPI('/Loans/Reports/GetAccountstatementReport',params, 'YES');
      }
     catch (e){
      this._CommonService.showErrorMessage(e);
       }

    }
}
