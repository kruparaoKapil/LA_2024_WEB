import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DeliveryorderService {

  constructor(private commonService: CommonService) { }
  GetDeliveryorderAllcount(){
    try {
      return this.commonService.callGetAPI('/Loans/Reports/GetDeliveryOrdersCount','', 'NO');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  GetDeliveryorderBystatus(letterstatus){
    try {
      const params = new HttpParams().set('Letterstatus', letterstatus);
      return this.commonService.callGetAPI('/Loans/Reports/GetDeliveryOrderLetterMainData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }

    }
    DeliveryorderdetailsByID(applicationid){
    try {
      const params = new HttpParams().set('VchapplicationID', applicationid);
      return this.commonService.callGetAPI('/Loans/Reports/GetDeliveryOrderLetterData',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  SaveDeliveryorderdata(data){
    try {
      return this.commonService.callPostAPI('/Loans/Reports/Savedeliveryorderletter',data);
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
}
