import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SanctionletterService {

  constructor(private commonService: CommonService) { }
  GetSanctionLetterAllcount(){
    try {
      return this.commonService.callGetAPI('/Loans/Reports/GetSanctionLettersCount','', 'NO');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  GetSanctionLetterBystatus(letterstatus){
    debugger
    try {
      const params = new HttpParams().set('Letterstatus', letterstatus);
      return this.commonService.callGetAPI('/Loans/Reports/GetSanctionLetterMainData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }

    }
  SanctionletterdetailsByID(applicationid){
    try {
      const params = new HttpParams().set('VchapplicationID', applicationid);
      return this.commonService.callGetAPI('/Loans/Reports/GetSanctionLetterData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  SaveSanctionLetterdata(data){
    try {
      return this.commonService.callPostAPI('/Loans/Reports/Savesanctionletter',data);
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
}
