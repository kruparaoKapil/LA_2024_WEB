import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DisbursmentLetterService {

  constructor(private commonService: CommonService) { }

  GetDisbursmentLetterAllcount(){
    try {
      return this.commonService.callGetAPI('/Loans/Reports/GetDisbursementLettersCount','', 'NO');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  GetDisbursmentLetterBystatus(letterstatus){
    try {
      const params = new HttpParams().set('Letterstatus', letterstatus);
      return this.commonService.callGetAPI('/Loans/Reports/GetDisbursalLetterMainData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }

    }
    DisbursmentLetterdetailsByID(applicationid,voucherno){
    try {
      const params = new HttpParams().set('VchapplicationID', applicationid).set('Voucherno',voucherno);
      return this.commonService.callGetAPI('/Loans/Reports/GetDisbursalLetterData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  SaveDisbursmentLetterdata(data){
    try {
      return this.commonService.callPostAPI('/Loans/Reports/SaveDisbursalLetter',data);
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }

}
