import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RdInstallmentsChartService {

  constructor(private commonservice: CommonService) { }
  GetMemberDetails(Rdaccountno) {
    try {
      const params = new HttpParams().set('Rdaccountno', Rdaccountno);
      return this.commonservice.callGetAPI('/Banking/GetRdInstallmentchart', params, 'Yes')
    }
    catch (e) {
      this.commonservice.showErrorMessage(e);
    }

  }
}
