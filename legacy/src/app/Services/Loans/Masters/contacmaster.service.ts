import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Contactmaster, Conatactdetais, Contactaddress } from '../../../Models/Loans/Masters/contactmaster';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../../common.service';

@Injectable({
    providedIn: 'root'
})
export class ContacmasterService {
    editinfo = [];
    _Contactaddress: Contactaddress[] = [];
    httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    });

    loadContactForm = new EventEmitter();
    status: any;
  contactDataOnChange: any;
    constructor(private http: HttpClient, private _CommonService: CommonService) { }

    saveContactIndividual(data, formtype): Observable<any> {

        try {

            if (formtype == 'Save')
                return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/Savecontact', data);
            else
                return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/UpdateContact', data);
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    saveAddressType(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveAddressType', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    saveTypeofEnterprise(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveEnterpriseType', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    saveNatureofBussiness(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveBusinessTypes', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    checkContactIndividual(data): Observable<any> {



        debugger
        try {
            return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/GetPersonCount', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }


    checkTypeofEnterprise(data): Observable<any> {

        try {
            const params = new HttpParams().set('enterprisetype', data);

            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/checkInsertEnterpriseTypeDuplicates', params, 'YES');

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    checkNatureofBussiness(data): Observable<any> {

        try {

            const params = new HttpParams().set('businesstype', data);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/checkInsertBusinessTypesDuplicates', params, 'YES');

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    deleteContactIndividual(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/DeleteContact', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }


    getContactTotalDetails(data): Observable<any> {

        try {

            const params = new HttpParams().set('Type', data);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetContactDetails', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    gettitleDetails(): Observable<any> {

        try {
            return this._CommonService.callGetAPI('/Settings/getContacttitles', '', 'NO');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    getTypeofEnterprise(): Observable<any> {

        try {
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetEnterpriseType', '', 'NO');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    getNatureofBussiness(): Observable<any> {

        try {
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetBusinessTypes', '', 'NO');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    getdesignations(): Observable<any> {

        try {
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetDesignations', '', 'NO');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }

      sendstatus(status)
      {
        this.status=status
      }
      setstatus()
      {
          return this.status
      }
    getAddressTypeDetails(contactType): Observable<any> {

        try {
            //return this.http.get(this._CommonService.apiURL + '/loans/masters/contactmaster/GetAddressType?contactype=' + contactType);
            const params = new HttpParams().set('contactype', contactType);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetAddressType', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    checkAddressType(addresstype, contactype): Observable<any> {
        try {
            let options = {
                headers: this.httpHeaders
            };

            const params = new HttpParams().set('addresstype', addresstype).set('contactype', contactype);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/checkInsertAddressTypeDuplicates', params, 'YES');

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    getCountryDetails(): Observable<any> {

        try {
            return this._CommonService.callGetAPI('/Settings/getCountries', '', 'NO');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    getSateDetails(countryid: number): Observable<any> {

        try {
            const params = new HttpParams().set('id', countryid.toString());
            return this._CommonService.callGetAPI('/Settings/getStates', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    getDistrictDetails(stateid: number): Observable<any> {

        try {
            const params = new HttpParams().set('id', stateid.toString());
            return this._CommonService.callGetAPI('/Settings/getDistricts', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }


    loadEditInformation(_contacttype, _referecnceid) {
        this.editinfo = [{ referecnceid: _referecnceid, contacttype: _contacttype }]
    }

    getEditInformation(): any {

        return this.editinfo;

    }
    getContactDetailsByID(referenceid): Observable<any> {
        try {
            const params = new HttpParams().set('refernceid', referenceid);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/ViewContact', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactDetailsList(Type) {
        try {
            const params = new HttpParams().set('ViewName', Type);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetcontactviewByName', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    GetContactDetailsListIndex(Type,pageno,searchby) {
        try {
            const params = new HttpParams().set('ViewName', Type).set('endindex', pageno).set('searchby', searchby);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetcontactviewByName', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    GetEmployeeContacts(): Observable<any> {

        try {
            return this._CommonService.callGetAPI('/HRMS/GetEmployeeContacts', '', 'NO');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    GetContactDetailsListCount(Type,searchby){
        try {
            const params = new HttpParams().set('ViewName', Type).set('searchby', searchby);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetContactCount', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactListPersonDetails(RefId) {
        try {
            const params = new HttpParams().set('ContactRefID', RefId);
            return this._CommonService.callGetAPI('/Settings/Users/ContactData/GetContactData', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactDataDetails(loaddataType,RefId) {
        try {
            const params = new HttpParams().set('loaddataType', loaddataType).set('ContactRefID', RefId);
            return this._CommonService.callGetAPI('/Settings/Users/ContactData/GetContactDataDetails', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactPersonLoansDetails(RefId) {
        try {
            const params = new HttpParams().set('contactRefId', RefId);
            return this._CommonService.callGetAPI('/Settings/Users/ContactData/GetLoansByContactRefId', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactPersonGuarantorDetails(RefId) {
        try {
            const params = new HttpParams().set('contactRefId', RefId);
            return this._CommonService.callGetAPI('/Settings/Users/ContactData/GetGurantorsLoansByContactRefId', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactPersonCoApplicantDetails(RefId) {
        try {
            const params = new HttpParams().set('contactRefId', RefId);
            return this._CommonService.callGetAPI('/Settings/Users/ContactData/GetCoApplicantsLoansByContactRefId', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    GetContactPersonTransactionsDetails(RefId) {
        try {
            const params = new HttpParams().set('loanid', RefId);
            return this._CommonService.callGetAPI('/loans/Transactions/Receipts/GetTransactions', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    getContactDetailsrefid(referenceid): Observable<any> {
        try {
          debugger;
          const params = new HttpParams().set('refid', referenceid);
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetContactViewbyid', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      GetContactsList(): Observable<any> {

        try {


          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetContactsList', '','No');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }

      ///loans/masters/contactmasterNew/GetNousepanContactView

      GetContactPanList(): Observable<any> {

        try {


          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetNousepanContactView', '','No');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      GetSubContactdetails(data): Observable<any> {

        try {

          const params = new HttpParams().set('Type', data);
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetSubContactdetails', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }

      saveReferralDetails(data): Observable<any> {
        try {
          return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveContactReferral', data);

        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      getContactDetailsReferralByID(referenceid): Observable<any> {
        try {
          const params = new HttpParams().set('refernceid', referenceid);
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/ViewReferralContactDetails', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      getContactDetailsEmployeeByID(referenceid): Observable<any> {
        try {
          const params = new HttpParams().set('refernceid', referenceid);
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/ViewEmployeeContactDetails', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      getIntoducerDetails(): Observable<any> {

        try {
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetInterducedDetails', '', 'NO');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      getQualifications(): Observable<any> {

        try {
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/ViewQualificationDetails', '', 'NO');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }
      getRelationShip(): Observable<any> {
        return this._CommonService.callGetAPI('/loans/masters/contactmaster/getRelationShip', '', 'NO');
      }
      saveEmployeeDetails(data): Observable<any> {
        try {
          return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveContactEmployee', data);

        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }


    GetDuplicateKYCTesting(docname,docnumber): Observable<any> {
        try {
          debugger;
          const params = new HttpParams().set('docname', docname).set('docnumber', docnumber);
          return this._CommonService.callGetAPI('/loans/masters/contactmaster/DuplicateKYCTesting', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }



      savePanDeails(data) {
        return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/savePandocumentstore', data)
    }

    //loans/masters/contactmasterNew/duplicatornotpancard
    duplicatornotpancard(PANNO): Observable<any> {
        try {
          const params = new HttpParams().set('PANNO', PANNO);
          return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/duplicatornotpancard', params, 'YES');
        }
        catch (e) {
          this._CommonService.showErrorMessage(e);
        }
      }

      //api/loans/masters/contactmasterNew/SaveContactSupplier
      SaveContactSupplier(data) {
        return this._CommonService.callPostAPI('/loans/masters/contactmasterNew/SaveContactSupplier', data)
    }
     getDocumentProofs(): Observable<any> {
    debugger;
    try {
      return this._CommonService.callGetAPI('/Banking/GetDocumentTypes', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


       GetContactGlobalWith(searchbyvalue): Observable<any> {
        const params = new HttpParams().set('searchbyvalue', searchbyvalue);
        return this._CommonService.callGetAPIWithout('/loans/masters/contactmasterNew/GetContactGlobal', params, 'YES');
    }

     setContactGlobalDataOnChange(data) {
        debugger;
        this.contactDataOnChange = data
    }

     getContactGlobalDataOnChange() {
        debugger;
        return this.contactDataOnChange
    }

       GetPersonGlobalCount(referenceid): Observable<any> {
        try {
            const params = new HttpParams().set('referenceid', referenceid);
            return this._CommonService.callGetAPI('/loans/masters/contactmasterNew/GetPersonGlobalCount', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

      ViewContactGlobal(referenceid): Observable<any> {
        try {
            const params = new HttpParams().set('refernceid', referenceid);
            return this._CommonService.callGetAPIWithout('/loans/masters/contactmasterNew/ViewContactGlobal', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }


      getEasyChitAgentCode(pannumber): Observable<any> {
        try {
            debugger;
            const params = new HttpParams().set('pannumber', pannumber);
            return this._CommonService.callGetAPIWithout('/Plots/Transactions/PlotBooking/GetEasyChitAgentCode', params, 'YES');
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }


}
