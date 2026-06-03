import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgentForSaleService {

  constructor(private _commonService : CommonService) { }

  //api/SaleAgreement/GetSaleagreementCompanydetails
  getSaleagreementCompanydetails() :Observable<any>{
    debugger;
    return this._commonService.callGetAPI('/SaleAgreement/GetSaleagreementCompanydetails','',"NO");
  }

  //api/SaleAgreement/GetRightsofcompanyoverland
  getRightsofcompanyoverland(buildingid){
    debugger;
    return this._commonService.callGetAPI('/SaleAgreement/GetRightsofcompanyoverland?buildingid='+buildingid,'',"NO");
  }

  GetAggrementmemberDetails(memberid,fdaccountid) {
      const params = new HttpParams().set('memberid', memberid).set('fdaccountid', fdaccountid);
      return this._commonService.callGetAPI('/SaleAgreement/GetAggrementmemberDetails', params, 'Yes')
    }

    getAggrementCompanyAddress() :Observable<any>{
      debugger;
      return this._commonService.callGetAPI('/SaleAgreement/GetAggrementCompanyaddress','',"NO");
    }

    GetAuthorizedpersons() :Observable<any>{
      debugger;
      return this._commonService.callGetAPI('/SaleAgreement/GetAuthorizedpersons','',"NO");
    }

    //SaleAgreement/GetAggrementFloorInventory

    GetAggrementFloorInventory() :Observable<any>{
      debugger;
      return this._commonService.callGetAPI('/SaleAgreement/GetAggrementFloorInventory','',"NO");
    }

    ///Banking/Transactions/BondsPreview/GetSaleaggrementDetails

  

    GetSaleaggrementDetails(memberid) {
      const params = new HttpParams().set('memberid', memberid);
      return this._commonService.callGetAPI('/Banking/Transactions/BondsPreview/GetSaleaggrementDetails', params, 'Yes')
    }

    //api/SaleAgreement/SaleaggrementPrewiew

    saveSaleAgreementPreview(data) {
      return this._commonService.callPostAPI('/SaleAgreement/SaleaggrementPrewiew', data);
    }

    ///api/SaleAgreement/Saleaggrement

    saveSaleAggrement(data) {
      return this._commonService.callPostAPI('/SaleAgreement/Saleaggrement', data);
    }

    ///api/SaleAgreement/GetSaleaggrementconut

    getSaleaggrementCount(fdaccountid,memberid) {
      const params = new HttpParams().set('fdaccountid', fdaccountid).set('memberid', memberid);
      return this._commonService.callGetAPI('/SaleAgreement/GetSaleaggrementconut', params, 'Yes')
    }

    //SaleAgreement/GetSaleaggrementNominee

    GetSaleaggrementNominee(fdaccountid) {
      const params = new HttpParams().set('fdaccountid', fdaccountid);
      return this._commonService.callGetAPI('/SaleAgreement/GetSaleaggrementNominee', params, 'Yes')
    }

    //SaleAgreement/GetAuthorizedpersons1

     GetAuthorizedpersons1() :Observable<any>{
      debugger;
      return this._commonService.callGetAPI('/SaleAgreement/GetAuthorizedpersons1','',"NO");
    }

    //api/SaleAgreement/saveauthorizedpersons

    saveAuthorizedPersons(data) {
      return this._commonService.callPostAPI('/SaleAgreement/saveauthorizedpersons', data);
    }




}
