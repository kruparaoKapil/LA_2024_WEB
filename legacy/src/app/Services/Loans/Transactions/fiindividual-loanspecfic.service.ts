import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FIIndividualLoanspecficService {

vehiclemodel:any=[{modeltype:'Aircraft'},
{modeltype:'APRILIA'},{modeltype:'ASHOK LEYLAND'},{modeltype:'AUDI INDIA'},
{modeltype:'BAJAJ AUTO LTD'},{modeltype:'BENELLI'},{modeltype:'BMW INDIA'},
{modeltype:'CHINKARA MOTORS'},{modeltype:'FORCE MOTORS'},
{modeltype:'FORD INDIA'},{modeltype:'HERO ELECTRIC'},{modeltype:'HERO MOTOCORP LTD'},{modeltype:'Heavy Motor Vehicle'},
{modeltype:'HINDUSTAN MOTORS'},{modeltype:'HONDA CARS INDIA'},{modeltype:'HONDA MOTORCYCLE & SCOOTER INDIA (PVT) LTD'},
{modeltype:'HYOSUNG'},{modeltype:'HYUNDAI MOTOR INDIA'},{modeltype:'INDIA YAMAHA MOTOR PVT LTD'},
{modeltype:'ISUZU MOTORS INDIA'},{modeltype:'JAWA'},{modeltype:'JEEP INDIA'},
{modeltype:'KIA MOTORS INDIA'},{modeltype:'KTM'},{modeltype:'MAHINDRA & MAHINDRA'},
{modeltype:'MAHINDRA TWO WHEELERS LTD'},{modeltype:'MARUTI SUZUKI'},{modeltype:'MERCEDES-BENZ INDIA'},
{modeltype:'MG MOTOR INDIA'},{modeltype:'NISSAN MOTOR INDIA'},{modeltype:'PIAGGIO VEHICLES PVT LTD'},
{modeltype:'PORSCHE INDIA'},{modeltype:'PREMIER'},{modeltype:'RENAULT INDIA'},
{modeltype:'REVA'},{modeltype:'ROYAL ENFIELD'},{modeltype:'SKODA INDIA'},
{modeltype:'SUZUKI MOTORCYCLE INDIA PVT LTD'},{modeltype:'TARA INTERNATIONAL'},{modeltype:'TATA MOTORS'},
{modeltype:'TOYOTA KIRLOSKAR MOTOR'},{modeltype:'TVS MOTOR COMPANY LTD'},{modeltype:'UM LOHIA TWO WHEELERS PVT LTD'},
{modeltype:'VOLKSWAGEN INDIA'},{modeltype:'Watercraft'},]
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  constructor(private commonService: CommonService) { }  
  
  
 
  getGoldLoanTypes(pGoldArticleTypeId){
    const params = new HttpParams().set('loanid', pGoldArticleTypeId);
    return this.commonService.callGetAPI('/loans/masters/ChargesMaster/GetLoanWiseChargesName', params, 'YES');

  }
  saveLoanData(data):Observable<any>{
    try{
      const params = new HttpParams().set('applicationid', data.pApplicationid).set('strapplictionid', data.pVchapplicationid);
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveLoanSpecificDetails?'+params,data);
    }
    catch(e){
      this.commonService.showErrorMessage(e);
    }
  }

  savePersonalLoanData(data):Observable<any>{
    try{
      // const params = new HttpParams().set('applicationid', data.pApplicationid).set('strapplictionid', data.pVchapplicationid);
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/saveApplicatntPersonalLoan',data);
    }
    catch(e){
      this.commonService.showErrorMessage(e);
    }
  }
  saveloanAgainstPropertyData(data):Observable<any>{
    try{
      //const params = new HttpParams().set('applicationid', data.pApplicationid).set('strapplictionid', data.pvchapplicationid);
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/saveApplicationLoanAgainstpropertyLoanspecificfiels',data);
    }
    catch(e){
      this.commonService.showErrorMessage(e);
    }
  }

  deleteGoldLoanType(Data: any) {
 
  }

  checkGoldLoanTypes(pGoldArticleTypeId): Observable<any>{
    const params = new HttpParams().set('goldArticleTypeId', pGoldArticleTypeId);
    return this.commonService.callGetAPI('', params, 'YES');    

  } 

  getLoanType(data):Observable<any>{
    try{
      const params = new HttpParams().set('LoanType', data);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationIds',params,'YES');
    }
    catch(e){
      this.commonService.showErrorMessage(e);
    }
  }

 // /api/loans/Transactions/Firstinformation/GetApplicationExistingLoanDetails
 getApplicantLoanSpecificDetails(strapplictionid):Observable<any>{
  try{
    const params = new HttpParams().set('strapplictionid', strapplictionid);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicantLoanSpecificDetails',params,'YES');
  }
  catch(e){
    this.commonService.showErrorMessage(e);
  }
}

saveConsumableproductTypes(data):Observable<any>{
  try{
    return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveConsumableproductTypes',data);
  }
  catch(e){
    this.commonService.showErrorMessage(e);
  }
}
getConsumableproductTypes(): Observable<any> {
  try {
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetConsumableproductTypes', '', 'NO');
  }
  catch (e) {
    this.commonService.showErrorMessage(e);
  }
}
  
 getPersonalLoanEightTabData(strapplictionid) {
  try {
    const params = new HttpParams().set('strapplictionid', strapplictionid);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationPersonalLoanInformation', params, 'YES');
  }
  catch (e) {
    this.commonService.showErrorMessage(e);
  }
 }
 }

 