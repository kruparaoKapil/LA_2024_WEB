import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GenerateidService {

  constructor(private _CommonService: CommonService) { }

  private Data = new Subject<any>();

  GetFormNames() {
    return this._CommonService.callGetAPI('/Settings/GetFormnames', '', 'NO')
  }
  GetModeOfTransaction(FormName) {
    try {
      const params = new HttpParams().set('Formname', FormName);
      return this._CommonService.callGetAPI('/Settings/GetModeofTransaction', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  checkTransactionCodeExist(TransactionCode) {
    try {
      const params = new HttpParams().set('TransactionCode', TransactionCode);
      return this._CommonService.callGetAPI('/Settings/checkTransactionCodeExist', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  SaveGenerateIdMaster(data) {
    return this._CommonService.callPostAPI('/Settings/SaveGenerateIdMaster', data)
  }
  GetGenerateidmasterList() {
    return this._CommonService.callGetAPI('/Settings/GetGenerateidmasterList', '', 'NO')
  }
}
