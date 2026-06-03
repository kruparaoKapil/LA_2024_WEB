import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AcknowledgementsService {

  constructor(private commonService: CommonService) { }
    GetAcknowledgementLetter(){  
   
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetAcknowledgementDetails', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  SendAcknowledgementLetter(data){
  try {
    return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveAcknowledgementDetails', data);
    }
   catch (e){
    this.commonService.showErrorMessage(e);
     }

  }
}
