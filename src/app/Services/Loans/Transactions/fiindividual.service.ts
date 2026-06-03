import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class FIIndividualService {
  getApplicantandOthersData = new EventEmitter();

  getKycAndCreditscoreData = new EventEmitter();



  FiTab1Details: any
  private FiTab1Data = new Subject<any>()

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  CoApplicantList = [];

  constructor(private commonService: CommonService) { }

  //Get Id Proof Type List
  getDocumentGroupNames(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/masters/documentsmaster/GetDocumentGroupNames', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get Id Proof List
  getDocumentNames(pDocumentId): Observable<any> {
    try {
      const params = new HttpParams().set('DocId', pDocumentId.toString());
      return this.commonService.callGetAPI('/Settings/ReferralAdvocate/GetDocumentProofs', params, 'YES')
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  getIdProofTypeDetails(proofType): Observable<any> {
    try {
      const params = new HttpParams().set('pDocumentGroup', proofType);
      return this.commonService.callGetAPI('/loans/masters/documentsmaster/GetDocumentGroupNames', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  checkIdProofType(idprooftype): Observable<any> {
    try {
      let options = {
        headers: this.httpHeaders
      };
      const params = new HttpParams().set('idprooftype', idprooftype);
      return this.commonService.callGetAPI('/loans/masters/documentsmaster/SaveDocumentGroup(DTO)', params, 'YES');

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  saveIdProofType(data): Observable<any> {

    try {
      return this.commonService.callPostAPI('/loans/masters/documentsmaster/SaveDocumentGroup', data);

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  saveIdProof(data): Observable<any> {

    try {
      return this.commonService.callPostAPI('/loans/masters/documentsmaster/SaveIdentificationDocuments', data);

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  //Application Personal Details Start
  getEmployementRoleList(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetEmployementRoles', '', 'NO');

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Application Personal Details End

  GetSchemeNames(loanid) {
    try {
      const params = new HttpParams().set('Loanid', loanid);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetSchemenamescodes', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  SaveApplicationExistingLoanDetails(data): Observable<any> {

    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveApplicationexistingloansDetails', data);

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  GetApplicationExistingLoanDetails(contactreferenceid, vchapplicationid) {
    try {
      const params = new HttpParams().set('contactreferenceid', contactreferenceid).set('vchapplicationid', vchapplicationid)
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationExistingLoanDetails', params, 'YES')
    }


    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  SaveApplicationPersonalInformation(data): Observable<any> {
    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveApplicationPersonalInformation', data);

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  GetInterestRates(data) {
    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/GetInterestRates', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
    //let id="0"
    // const params = new HttpParams().set('Loanid', loanid).set('Contacttype', contacttype).set('Applicanttype', applicanttype)
    // .set('Loanpayin', loanpayin).set('schemeid',schemeid).set('interesttype',interestType);
  }


  getFiEmiSchesuleview(loanamount, interesttype, loanpayin, interestrate, tenureofloan, Loaninstalmentmode, emiprincipalpayinterval, emitype): Observable<any> {
    try {
      const params = new HttpParams().set('loanamount', loanamount).set('interesttype', interesttype).set('loanpayin', loanpayin)
        .set('interestrate', interestrate).set('tenureofloan', tenureofloan).set('Loaninstalmentmode', Loaninstalmentmode)
        .set('emiprincipalpayinterval', emiprincipalpayinterval).set('emitype',emitype);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFiEmiSchesuleview', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }

  }


  SaveFiTabDetails(data) {
    return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/Saveapplication', data);
  }


  getExistedGetApplicantCreditandkycdetails(strapplictionid) {
    const params = new HttpParams().set('Applicationid', strapplictionid);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicantCreditandkycdetails', params, 'YES');
  }
  getSecurityCollateralDetails(applicationid, strapplictionid): Observable<any> {
    try {
      const params = new HttpParams().set('applicationid', applicationid).set('strapplicationid', strapplictionid);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/getSecurityCollateralDetails', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  getGetApplicantCreditandkycdetails(applicationid, strapplictionid) {
    const params = new HttpParams().set('applicationid', applicationid).set('strapplicationid', strapplictionid);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicantCreditandkycdetails', params, 'YES');
  }

  saveApplicationReferenceData(data, applicationid, strapplictionid): Observable<any> {
    try {
      const params = new HttpParams().set('applicationid', applicationid).set('strapplictionid', strapplictionid);
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/SaveApplicationReferenceData?' + params, data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  getApplicationReferenceData(applicationId, vchapplicationID) {
    try {
      const params = new HttpParams().set('applicationId', applicationId).set('vchapplicationID', vchapplicationID);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationReferenceData', params, 'YES');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }


  ///mm
  getFIMemberApplicationReferenceData(vchapplicationID) {
    try {
      const params = new HttpParams().set('Applicationid', vchapplicationID);
      return this.commonService.callGetAPI('/Banking/Masters/FIMember/GetFIMemberReferenceInformation', params, 'YES');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  ///


  firstinformationSaveapplication(data): Observable<any> {
    try {

      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/Saveapplication', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }


  //Post SecurityAndCollateral Data
  saveApplicationSecurityCollateral(data): Observable<any> {
    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/saveApplicationSecurityCollateral', data);
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  //Post KycDocument Data
  savekycandidentificationdocuments(data): Observable<any> {
    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/Savekycandidentificationdocuments', data)
    }
    catch (e) {      
      this.commonService.showErrorMessage(e);
    }
  }

  getReferralAgentDetails(type) {
    try {
      const params = new HttpParams().set('Type', type);
      return this.commonService.callGetAPI('/Settings/ReferralAdvocate/getReferralAgentDetails', params, 'YES');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  getReferralDetails() {
    try {

      return this.commonService.callGetAPI('/Settings/ReferralAdvocate/getReferralDetails', '', 'NO');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  getallEmployeeDetails() {
    try {
      return this.commonService.callGetAPI('/Settings/Employee/GetallEmployeeDetails', '', 'NO');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  //Post ApplicantAndOthers Data
  saveApplicantsAndOthers(data): Observable<any> {
    try {
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/Saveapplicationsurityapplicantdetails', data)
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get All FI-Individual data for view - Kiran Gaikwad (started)
  getAllFiIndividualDataForView() {
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFirstInformationView', '', 'NO');
    } catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  //Get All FI-Individual data for view - Kiran Gaikwad (ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get selected FI-Individual usr data - Kiran Gaikwad (Started)
  getFiIndividualUserData(id) {
    try {
      const params = new HttpParams().set('Applicationid', id);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetAllLoandetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get selected FI-Individual usr data - Kiran Gaikwad (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get selected FI-Security and colletral data - Kiran Gaikwad (Started)
  getFiSecurityAndColletralData(applicationId, strapplicationId) {
    try {
      const params = new HttpParams().set('applicationid', applicationId).set('strapplicationid', strapplicationId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/getSecurityCollateralDetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get selected FI-Security and colletral data - Kiran Gaikwad (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->

  //Get FI-kyc documents data - Kiran Gaikwad (Started)
  getFiCreditAndKYCDocumentsData(applicationId, contactId) {
    try {
      const params = new HttpParams().set('applicationid', applicationId).set('contactid', contactId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicantCreditandkycdetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get FI-kyc documents data - Kiran Gaikwad (Ended)

  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get FI-Personal Information data - Kiran Gaikwad (Started)
  getFIPersonalDetailsData(strapplicationId) {
    try {
      const params = new HttpParams().set('strapplictionid', strapplicationId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationPersonalInformation', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get FI-Personal Information data - Kiran Gaikwad (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get FI-Existing users loan data - Kiran Gaikwad (Started)
  getFIExistingUsersData(contactreferenceId, strapplicationId) {
    try {
      const params = new HttpParams().set('contactreferenceid', contactreferenceId).set('strapplicationid', strapplicationId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetApplicationExistingLoanDetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get FI-Existing users loan data - Kiran Gaikwad (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->
  //Get FI-Co-applicants and guarranters data - Kiran Gaikwad (Started)

  getFiCoapplicantsAndGuarrantersData(applicationId) {
    try {
      const params = new HttpParams().set('Applicationid', applicationId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/Getsurietypersondetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  //Get FI-Co-applicants and guarranters data - Kiran Gaikwad (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->


  getLoanMinAndMaxValues(loanid, contacttype, applicanttype, loanpayin, interestType, schemeid) {
    let id = "0"
    const params = new HttpParams().set('Loanid', loanid).set('Contacttype', contacttype).set('Applicanttype', applicanttype)
      .set('Loanpayin', loanpayin).set('schemeid', schemeid).set('interesttype', interestType);
    return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetLoanMinandmaxAmounts', params, 'YES')
  }

  //Get FI-Contacttypes  data - Ravi Shankar (Ended)
  //--------------------------------------------------------------------------------------------------------------------------------------->
  getContacttypes(loanid) {
    try {
      const params = new HttpParams().set('loanid', loanid);
      return this.commonService.callGetAPI('/Settings/getContacttypes', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  getLoanpayins(loanid, contactType, applicantType, schemeId): Observable<any> {
    try {
      const params = new HttpParams().set('Loanid', loanid).set('Contacttype', contactType).set('Applicanttype', applicantType).set('schemeid', schemeId);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetLoanpayin', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  getLoanInterestTypes(loanid, schemeId, ContactType, ApplicantType, loanpayin): Observable<any> {
    try {
      const params = new HttpParams().set('Loanid', loanid).set('schemeid', schemeId).set('Contacttype', ContactType ? ContactType : '').set('Applicanttype', ApplicantType ? ApplicantType : '').set('Loanpayin', loanpayin ? loanpayin : "");
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetLoanInterestTypes', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  getFiLoanTypes(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/masters/loanmaster/getfiLoanTypes', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  GetFICompany(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFICompany', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  getInstallmentModes(loanPayIn, interestType) {
    try {
      const params = new HttpParams().set('loanpayin', loanPayIn).set('interesttype', interestType);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/getLoaninstalmentmodes', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  getSurityapplicants(contacttype): Observable<any> {
    try {
      const params = new HttpParams().set('contacttype', contacttype);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetSurityapplicants', params, 'YES');
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  deleteApplicantAndOthers(data) {
    try {
      debugger
      const params = new HttpParams().set('strapplictionid', data.strapplictionid).set('strconrefid', data.strconrefid).set('Createdby', data.Createdby);
      return this.commonService.callPostAPI('/loans/Transactions/Firstinformation/Deletesueritydetails?' + params, null);
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  GetFirstInformationTabs(): Observable<any> {
    try {
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFirstInformationTabs', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  private FITabFdRdDetailsData = new Subject<any>();
  _SetFITabFdRdDetails(FITabFdRdDetails, LoanType) {
    let data = { tabdata: FITabFdRdDetails, LoanType: LoanType }
    this.FITabFdRdDetailsData.next(data);
  }
  _GetFITabFdRdDetails(): Observable<any> {
    return this.FITabFdRdDetailsData.asObservable();
  }

  moevToNextTab(tempFirstInformationTabsData, dropdoenTabname) {
    debugger;
    let str;
    let temptabname;
    for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      if (pTabsectionname == dropdoenTabname) {
        if (tempFirstInformationTabsData.length > i + 1) {
          str = tempFirstInformationTabsData[i + 1].pTabsectionid;
          temptabname = tempFirstInformationTabsData[i + 1].pTabsectionname;
        } else {
          str = '';
          temptabname = '';
        }
        // if (str == undefined) {
        //   str = '';
        // }
        // if (temptabname == undefined) {
        //   temptabname = ''
        // }
      }
    }
    let data = { 'tabId': str, 'tabName': temptabname };
    return data;
  }
  // movetoViewpage() {
  //   this.buttonName = "Submit";
  //   this.isLoading = false;
  //   this._CommonService.showInfoMessage('Saved successfully');
  //   this.router.navigateByUrl('/FiView');
  // }


  GetFITabFdRdEditDetails(Applicationid, LoanName) {
    try {
      const params = new HttpParams().set('Applicationid', Applicationid).set('LoanName', LoanName);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFITabFdRdEditDetails', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }

  GetFITabFdRdEditDepositsasLien(Applicationid, LoanName) {
    try {
      const params = new HttpParams().set('Applicationid', Applicationid).set('LoanName', LoanName);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFITabFdRdEditDepositsasLien', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  GetFITabFdRdEditLoanagainstDeposit(Applicationid, LoanName) {
    try {
      const params = new HttpParams().set('Applicationid', Applicationid).set('LoanName', LoanName);
      return this.commonService.callGetAPI('/loans/Transactions/Firstinformation/GetFITabFdRdEditLoanagainstDeposit', params, 'YES');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
}
