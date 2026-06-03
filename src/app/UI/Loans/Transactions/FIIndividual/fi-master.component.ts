import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FiApplicantsandothersComponent } from './fi-applicantsandothers.component';
import { FiKycandidentificationComponent } from './fi-kycandidentification.component';
import { FiPersonaldetailsComponent } from './fi-personaldetails.component';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { FiContacttypeComponent } from './fi-contacttype.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../Services/common.service';
import { FiSecurityandcollateralComponent } from './fi-securityandcollateral.component';
import { FiReferencesComponent } from './fi-references.component';
import { FiLoanspecficComponent } from './fi-loanspecfic.component';
import { FiLoandetailsComponent } from './fi-loandetails.component';
import { ChargemasterService } from 'src/app/Services/Loans/Masters/chargemaster.service';
import { FiExistingloansComponent } from './fi-existingloans.component';
import { FiReferralComponent } from './fi-referral.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
declare let $: any
@Component({
  selector: 'app-fi-master',
  templateUrl: './fi-master.component.html',
  styles: []
})
export class FiMasterComponent implements OnInit {

  @ViewChild(FiContacttypeComponent, { static: false }) FiContacttype: FiContacttypeComponent;
  @ViewChild(FiApplicantsandothersComponent, { static: false }) FiApplicantsandothers: FiApplicantsandothersComponent;
  @ViewChild(FiKycandidentificationComponent, { static: false }) FiKycandidentification: FiKycandidentificationComponent;
  @ViewChild(FiPersonaldetailsComponent, { static: false }) FiPersonaldetails: FiPersonaldetailsComponent;
  @ViewChild(FiSecurityandcollateralComponent, { static: false }) FiSecurityandcollateral: FiSecurityandcollateralComponent;
  @ViewChild(FiReferencesComponent, { static: false }) fiReferences: FiReferencesComponent;
  @ViewChild(FiLoanspecficComponent, { static: false }) fiLoanSpecific: FiLoanspecficComponent;
  @ViewChild(FiLoandetailsComponent, { static: false }) fiLoandDetails: FiLoandetailsComponent;
  @ViewChild(FiExistingloansComponent, { static: false }) fiExistingUserDetailsComponentData: FiExistingloansComponent;
  @ViewChild(FiReferralComponent, { static: false }) fiReferralData: FiReferralComponent
  counter = 5;
  lstApplicantandOthersData: any;
  routeVchApplicationId: any;
  totalLoanDetails: any;
  LoanDetails: any;
  enteredEmployeeData: any;
  forTenthTabData: any;
  SelectType: any;
  vchapplicationid: any;
  pContactId: any;
  selectedContactTypeForPersonalLoanComponent: any;
  contactRefrencId: any;

  notEditable: boolean = false;
  forClearButton: boolean = false;
  ShowDetailsOnTab: Boolean = false;

  // for 1st tab select contact type - Kiran Gaikwad
  selectedContactType: string = "Individual";
  dropdoenTabname: any;
  properDetails: any = [];
  movableproperDetails: any = [];
  GetFirstInformationTabsData: any = [];

  constructor(private _FIIndividualService: FIIndividualService,
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private chargemasterService: ChargemasterService,
    private _commonService: CommonService) { this.GetFirstInformationTabs(); }


  ngOnInit() {
    this.dropdoenTabname = "Select Applicant";
    this._commonService.SetFiTabName(this.dropdoenTabname);
    this.GetFirstInformationTabsData = [];

    /**-------(Start)------When click on edit button in Fi-view, this id we will get-----(Start)---
     * -----> This notEditable boolean is using for 1st tab not editing while editing time
     */
    if (this._route.snapshot.params['id']) {
      this.routeVchApplicationId = atob(this._route.snapshot.params['id']);
      this.notEditable = true;
    }
    else {
      this.notEditable = false;
    }
    /**-------(End)------When click on edit button in Fi-view, this id we will get-----(End)--- */

    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.vchapplicationid = res.pVchapplicationid;
        this.pContactId = res.pApplicantid;
        this.ShowDetailsOnTab = true;
        this.LoanDetails = res;
      }
    })

    /**-----(Start)---- For getting and setting Applicant and others in all tabs (where we need) -----(Start)----- */
    this._FIIndividualService.getApplicantandOthersData.subscribe(json => {
      this.getApplicantandOthersData();
    })
    /**-----(End)---- For getting and setting Applicant and others in all tabs (where we need) -----(End)----- */

    this.GetFirstInformationTabs();
  }

  /**------(Start)-----Permission data in all tabs (where we need)------(Start)---- */

  GetFirstInformationTabs() {
    this._FIIndividualService.GetFirstInformationTabs().subscribe(json => {
      if (json != null) {
        this.GetFirstInformationTabsData = json;
      }
    })
  }

  /**------(End)-----Permission data in all tabs (where we need)------(End)---- */


  /**------(Start)-----Setting Applicant and others data in all tabs (where we need)------(Start)---- */
  getApplicantandOthersData() {
    this.lstApplicantandOthersData = [];
    //--> Only main Applicant data from 1st tab i.e. FiContacttype ViewChild
    let data = this.FiContacttype.ApplicantData;
    this.lstApplicantandOthersData.push(data)
    //--> Getting Applicant and others data from 3rd tab 
    let lstApplicantsandothers = this.FiApplicantsandothers.lstOtherApplicants;
    if (lstApplicantsandothers && lstApplicantsandothers.length > 0)
      this.lstApplicantandOthersData.push(...lstApplicantsandothers);
    //---> status boolean is added for status in 4th and 5th tab.. 
    for (let i = 0; i < this.lstApplicantandOthersData.length; i++) {
      let obj = {
        status: false
      }
      this.lstApplicantandOthersData[i] = Object.assign(obj, this.lstApplicantandOthersData[i])
    }
    //--> Assigning applicant and others data for 4th tab
    this.FiKycandidentification.lstApplicantsandothers = this.lstApplicantandOthersData;

    let forFifthTabUsersData = JSON.parse(JSON.stringify(this.lstApplicantandOthersData));
    if (forFifthTabUsersData && forFifthTabUsersData.length > 0) {
      for (let y = 0; y < forFifthTabUsersData.length; y++) {
        forFifthTabUsersData[y].status = false;
      }
    }
    //--> Assigning applicant and others data for 5th tab
    this.FiPersonaldetails.lstApplicantsandothers = forFifthTabUsersData
    let forSecurityColletralArray = JSON.parse(JSON.stringify(this.lstApplicantandOthersData));
    for (let index = 0; index < forSecurityColletralArray.length; index++) {
      let obj = {
        status: false
      }
      forSecurityColletralArray[index] = Object.assign(obj, forSecurityColletralArray[index])
    }
    //--> Assigning applicant and others data for 6th tab
    this.FiSecurityandcollateral.lstApplicantsandothers = forSecurityColletralArray;
    //--> Assigning applicant and others data for 9th tab
    this.fiReferences.lstApplicantandOthersData = this.lstApplicantandOthersData;
    //--> Assigning applicant and others data for 8th tab
    this.fiLoanSpecific.lstApplicantandOthersData = this.lstApplicantandOthersData;
    //--> Assigning applicant and others data for Loan against property 
    if (this.fiLoanSpecific.loanagainstPropertyFormdata) {
      this.fiLoanSpecific.loanagainstPropertyFormdata.movablepropertydetailsParent.lstApplicantsandothers = this.lstApplicantandOthersData;
      this.fiLoanSpecific.loanagainstPropertyFormdata.propertydetailsParent.lstApplicantsandothers = this.lstApplicantandOthersData;
    }
  }
  /**------(End)-----Setting Applicant and others data in all tabs (where we need)------(End)---- */

  MoveToNextTab(tabno, tabname) {
    let str = tabname
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }

  /**------(Start)---- To show KYC documents in Business loan in 8th tab----------(Start)----- */
  kycDocumentdetailsTOBusiness(event) {
    if (this.fiLoanSpecific.businessFormdata)
      this.fiLoanSpecific.businessFormdata.identificationproof = event;
  }
  /**------(End)---- To show KYC documents in Business loan in 8th tab----------(End)----- */

  /**------(Start)----- Event form <app-fi-contacttype> component --------(Start)-------
   * -----> After selecting contact this event will fire.
   */
  onSelectContactType(event) {
    this.selectedContactType = event;
  }
  /**------(End)----- Event form <app-fi-contacttype> component --------(End)------- */

  securityColletralPropertyDetails(event) {

  }
  securityColletralmovablePropertyDetails(event) {

  }

  /**-----(Start)---This is using for selected contact sending from 5th tab to 8th tab----(Start)---- */
  selectedContactTypeForPersonalLoan(event) {
    this.selectedContactTypeForPersonalLoanComponent = event;
  }
  /**-----(End)---This is using for selected contact sending from 5th tab to 8th tab----(End)---- */

  enteredEmployeeDetails(event) {

  }

  /**----(Start)---- this is for Personal details in 5th tab---------------(Start)-------
   * -----> We are getting this data from (8th tab - Personal loan tab) to (5th tab - Personal details tab) 
   *        Employement details
   */
  eightTabPersonalData(event) {
    if (this.FiPersonaldetails.FiPersonalinformationModel) {
      if (this.lstApplicantandOthersData && this.lstApplicantandOthersData.length) {
        for (let i = 0; i < this.lstApplicantandOthersData.length; i++) {
          if (this.lstApplicantandOthersData[i].papplicanttype == 'Applicant') {
            this.FiPersonaldetails.FiPersonalinformationModel.PersonalEmployeementList = [];
            this.FiPersonaldetails.FiPersonalinformationModel.PersonalEmployeementList.push(event);
          }
        }
      }
    }
  }
  /**----(End)---- this is for Personal details in 5th tab---------------(End)------- */

  /**-------(Start)-------- This is using for 8th tab top box ---------(Start)--------
   * ------> In 8th tab one box is there. In that box we are showing data which is coming from 2nd tab.
   *         So this event or method coming form 2nd tab
   */
  loanDetails(event) {
    this.fiLoanSpecific.loanDetailsofchild = event;
  }
  /**-------(End)------- This is using for 8th tab top box ---------(End)-------- */

  /**------(Start)---------- For 2nd tab setting or binding data ---------(Start)----------------------- 
   * -----> We have no directly API to get 2nd tab data. Only one API is there to get
   *        1st and 2nd tab data. SO this totalTwotabsData() will call when 1st get API will call
   *        and it will call when 3rd tab back button clickig time also.
  */
  totalTwotabsData(event) {
    if (event) {
      this.fiLoandDetails.forThirdrdTabBackButton = true;
      this.contactRefrencId = event.LoanDetails.pVchapplicationid;
      this.forTenthTabData = event.LoanDetails;
      let evendData = event.LoanDetails;
      this.LoanDetails = event.LoanDetails;
      this.ShowDetailsOnTab = event.ShowDetailsOnTab;

      this._FIIndividualService.getLoanpayins(evendData.pLoanid, evendData.pContacttype, evendData.pApplicanttype, evendData.pschemeid).subscribe(payins => {
        if (payins != null) {
          this.fiLoandDetails.Loanpayins = payins
        }
      })

      this._FIIndividualService.getLoanInterestTypes(evendData.pLoanid, evendData.pschemeid, evendData.pContacttype, evendData.pApplicanttype, evendData.pLoanpayin ? evendData.pLoanpayin : '').subscribe(interestRates => {
        if (interestRates != null) {
          this.fiLoandDetails.LoanInterestratetypes = interestRates;
        }
      });

      let data = {
        pLoanid: evendData.pLoanid,
        pContacttype: evendData.pContacttype,
        pApplicanttype: evendData.pApplicanttype,
        pLoanpayin: evendData.pLoanpayin,
        pInteresttype: evendData.pInteresttype,
        pAmountrequested: evendData.pAmountrequested,
        pDateofapplication: this._commonService.formatDateFromDDMMYYYY(evendData.pDateofapplication),
        pTenureofloan: evendData.pTenureofloan,
        pschemeid: evendData.pschemeid
      }
      this.fiLoandDetails.Loanid = evendData.pLoanid;
      this.fiLoandDetails.Contacttype = evendData.pContacttype;
      this.fiLoandDetails.Applicanttype = evendData.pApplicanttype;
      this.fiLoandDetails.loadPayIn = evendData.pLoanpayin;
      this.fiLoandDetails.interestType = evendData.pInteresttype;
      this.fiLoandDetails.enteredAmountRequestedValue = evendData.pAmountrequested;
      this.fiLoandDetails.schemeid = evendData.pschemeid;

      this.fiLoandDetails.FiLoanDetailsForm.patchValue({
        pDateofapplication: this._commonService.formatDateFromDDMMYYYY(evendData.pDateofapplication),
        pAmountrequested: this._commonService.currencyformat(evendData.pAmountrequested),
        pPurposeofloan: evendData.pPurposeofloan,
        pInteresttype: evendData.pInteresttype,
        pLoanpayin: evendData.pLoanpayin,
        pTenureofloan: evendData.pTenureofloan,
        pTenuretype: evendData.pTenuretype,
        pRateofinterest: evendData.pRateofinterest,
        pIsschemesapplicable: evendData.pIsschemesapplicable,
        pLoaninstalmentpaymentmode: evendData.pLoaninstalmentpaymentmode,
        pSchemename: evendData.pSchemename,
        pSchemecode: evendData.pSchemecode,
        pCreatedby: evendData.pCreatedby,
        pPartprinciplepaidinterval: evendData.pPartprinciplepaidinterval,
        pInstalmentamount: this._commonService.currencyformat(evendData.pInstalmentamount),
        ptypeofoperation: 'UPDATE',
      });

      /**
       * FD and RD Loan BInd Edit Data Start
       */

      // if (evendData.pLoantype == 'Loan Against Deposits' && (evendData.pLoanname == 'Fd Loan' || evendData.pLoanname == 'Rd Loan')) {
      //   this._FIIndividualService.GetFITabFdRdEditDetails(evendData.pVchapplicationid, evendData.pLoanname).subscribe((resposne: any) => {
      //     this.fiLoandDetails.FdRdTabData=[...this.fiLoandDetails.FdRdTabData,...resposne];
      //     this.fiLoandDetails.FdRdTabData.push(resposne);
      //   });
      // }
      /**
      * FD and RD Loan BInd Edit Data End
      */
      if (this.fiLoandDetails.FiLoanDetailsForm.controls['pInteresttype'].value.toUpperCase() == 'DIMINISHING' &&
        this.fiLoandDetails.FiLoanDetailsForm.value.pLoaninstalmentpaymentmode == 'Only Interest (Principle is paid at end of tenure)') {
        this.fiLoandDetails.hideCalculateEmiButton = true;
      }

      this._FIIndividualService.getInstallmentModes(evendData.pLoanpayin, evendData.pInteresttype).subscribe((resposne: any) => {
        if (resposne) {
          this.fiLoandDetails.LoanInstllmentModes = resposne;
          for (let i = 0; i < resposne.length; i++) {
            if (resposne[i].pLoaninstalmentpaymentmode == evendData.pLoaninstalmentpaymentmode) {
              if (resposne[i].pLoaninstalmentpaymentmodecode == 'PP') {
                this.fiLoandDetails.openPartPrincipalText = true;
                this.fiLoandDetails.selectedLoanInstallmentMode = 'PP';
              }
              this.fiLoandDetails.FiLoanDetailsForm.patchValue({
                pLoaninstalmentpaymentmodecode: resposne[i].pLoaninstalmentpaymentmodecode,
                pLoaninstalmentpaymentmode: resposne[i].pLoaninstalmentpaymentmodecode
              })
              break;
            }
          }
        }
      })

      if (evendData.pTenureofloan && evendData.pTenureofloan != 0) {
        this.fiLoandDetails.tensureFlag = true;
      }
      if (evendData.pAmountrequested && evendData.pAmountrequested != 0) {
        this.fiLoandDetails.amountRequestedFlag = true;
        this.fiLoandDetails.amountCheckFlag = true;
      }
      if (evendData.pRateofinterest && evendData.pRateofinterest != 0) {
        this.fiLoandDetails.interestFlag = true;
      }
      if (this.fiLoandDetails.tensureFlag &&
        this.fiLoandDetails.amountRequestedFlag &&
        this.fiLoandDetails.amountCheckFlag &&
        this.fiLoandDetails.interestFlag) {
        this.fiLoandDetails.nextStepValidateBoolean = true;
      }

    }
  }
  /**------(End)---------- For 2nd tab setting or binding data ---------(End)----------------------- */

  /**-------(Start)------- For refresh 2nd tab --------------------(Start)---------
   * -----> Here while creating time if user will change any data in 1st tab we have to
   *        refresh 2nd tab.
   * -----> But while editing time we already disabled first tab.
   * -----> here forClearButton is using for show or hide Clear button.
   */
  refreshSecondTabData(data) {
    this.GetFirstInformationTabs();
    if (data) {
      if (this.contactRefrencId == undefined || this.contactRefrencId == null || this.contactRefrencId == '') {
        this.dropdoenTabname = this._commonService.GetFiTabName();
        this.fiLoandDetails.ngOnInit();
        if (data.backFlag == false) {
          let checked = { checked: true }
          let data = { currentTarget: checked }
          this.fiLoandDetails.CheckScheme(data);
        }
        this.forClearButton = true;
      }
      else {
        this.dropdoenTabname = this._commonService.GetFiTabName();
        this.forClearButton = false;
      }
    }
    else {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      this.forClearButton = false;
      if (this.fiLoandDetails.FiLoanDetailsForm.value.pIsschemesapplicable == true) {
        this.fiLoandDetails.schemeFlag = false;
        this.fiLoandDetails.schemedisable = true;
        $('#Scheme')[0].checked = true;
        this.fiLoandDetails.editSchemeCode = this.fiLoandDetails.FiLoanDetailsForm.value.pSchemecode;
      }
    }
  }
  /**-------(End)---- For refresh second tab --------------------(End)--------- */

  enteredIncomeDetails(event) {

  }

  enteredOtherIncomeDetails(event) {

  }

  /**--------(Start)---- For getting Loan specific details - 8th tab------(Start)-----------
   * -------> This method will call after saving of Existing loans - 7th tab
   */
  getDataForLoanspecific(event) {
    if (event) {
      this.dropdoenTabname = "Loan Specific Fields";
      if (this.fiLoanSpecific.businessFormdata) {
        this.fiLoanSpecific.businessFormdata.businessLoanErrorMessage = {};
        this.fiLoanSpecific.businessFormdata.businessaddressForm = this.formBuilder.group({
          businesspaddress1: [''],
          businesspaddress2: [''],
          businesspcity: [''],
          pCountryId: [''],
          pStateId: [''],
          pDistrictId: [''],
          businesspCountry: [''],
          businesspState: [''],
          businesspDistrict: [''],
          businessPincode: [''],
        })
        this.fiLoanSpecific.businessFormdata.BlurEventAllControll(this.fiLoanSpecific.businessFormdata.businessaddressForm);
      }
      if (this.fiLoanSpecific.personalFormdata) {
        if (this.routeVchApplicationId) {
          this.fiLoanSpecific.personalFormdata.forUpdate = true;
        }
        else {
          this.fiLoanSpecific.personalFormdata.forUpdate = false;
        }
      }
      //--> It will use for getting details when we have Loan Against Property
      this.fiLoanSpecific.getLoanAgainstPropertyEightTabData();
      //--> It will use for getting details when we have Personal Loan
      this.fiLoanSpecific.getPersonalLoanDetailsForEightTab();
      //--> It will use for remaining loans
      this.fiLoanSpecific.getApplicantLoanSpecificDetails(this.routeVchApplicationId ? this.routeVchApplicationId : event.Vchapplicationid);
    }
  }
  /**--------(End)---- For getting Loan specific details - 8th tab------(End)----------- */

  /**--------(Start)------for getting and editing 6th tab(Security and colletral) - Kiran Gaikwad (Started)----*/
  forSecurityColletralGetData(event) {
    if (event) {
      this.dropdoenTabname = "Security and Collateral";
      this.FiSecurityandcollateral.getSecurityAndColletralData();
    }
  }
  /**--------(End)------for getting and editing 6th tab(Security and colletral) - Kiran Gaikwad (Ended)---*/
  /**---------(Start)------ for getting and editing 4th tab(KYC and credit score) --------- Kiran Gaikwad (Start)---- */
  forGettingKYCAndCreditScoreData(event) {
    if (event) {
      this.dropdoenTabname = "KYC Documents";
      /**----- (Start) Here forCreate variable for ptypeofopertaion----------- (Start)-----
       * -----> Because while creating time we will get some already existed KYC documents,
       *        If these document's ptypeofopertaion as UPDATE, then we have to send as CREATE.
       */
      if (this.routeVchApplicationId) {
        this.FiKycandidentification.forCreate = false;
      }
      else {
        this.FiKycandidentification.forCreate = true;
      }
      /**----- (End) Here forCreate variable for ptypeofopertaion----------- (End)----- */

      this.FiKycandidentification.getKYCAndCreditScoreDataForEditing();
    }
  }
  /**---------(End)------ for getting and editing 4th tab(KYC and credit score) --------- Kiran Gaikwad (End)---- */

  /**------(Start)-----for getting and editing 5th tab(Personal Details) - Kiran Gaikwad (Started)------- */
  forPersonalDetailsGetAndEditEmitEvent(event) {
    debugger
    if (event) {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      if (this.routeVchApplicationId) {
        if (this.FiPersonaldetails && this.FiPersonaldetails.employmentDetails) {
          this.FiPersonaldetails.employmentDetails.forUpdate = true;
        }
      }
      else {
        if (this.FiPersonaldetails && this.FiPersonaldetails.employmentDetails) {
          this.FiPersonaldetails.employmentDetails.forUpdate = false;
        }
      }
      this.FiPersonaldetails.getPersonalDetailsDataForEditingAndGetting();
    }
  }
  /**------(End)-----for getting and editing 5th tab(Personal Details) - Kiran Gaikwad (End)------- */

  /** 
   *-------(Start)---- for getting and editing 3rd tab(Co-applicants & guaranters)-----(Start)------
   */
  forCoapplicantAndGuarantersDataEmit(eventData) {
    let data = eventData;

    if (data.event) {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      this.SelectType = this.FiContacttype.SelectType;
      if (data.forEditFirstTabEdit == false) {
        this.notEditable = true;
      }
      else {
        this.notEditable = false;
      }
      /**
       *  here we are calling data getting API's by using View Child
       */
      this.FiApplicantsandothers.getCoapplicantsAndGuarrantersData();
      this.FiApplicantsandothers.getSurityapplicants();
    }
  }
  /**-------(End)---- for getting and editing 3rd tab(Co-applicants & guaranters)-----(End)------ */

  /** 
   *-------(Start)---- for getting and editing 7th tab(Existing users data)-----(Start)------
   */
  forGettingAndEditingExistingUsersEmit(event) {
    if (event) {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      this.fiExistingUserDetailsComponentData.getExistingUsersDataForEditingAndGetting();
    }
  }
  /**-------(End)---- for getting and editing 7th tab(Existing users data)-----(End)------ */

  /**-------(Start)------- To get Fi references data - 9th tab----------(Start)--------- */
  getFiReferencesGetDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      this.fiReferences.getApplicationReferenceData();
    }
  }
  /**-------(End)------- To get Fi references data - 9th tab----------(End)--------- */

  /**----- (Start)--- For Fi referral - 10th tab data binding or setting data-------(Start)-----
   * ----> Here there is no seperate API for 10th tab. We are geting 10th tab data from 1st tab getting
   *       API.
   * ----> Here forTenthTabData variable is using for data binding. We are seeting data to this varibale 
   *       in totalLoanDetails() method.
   * ----> So there is no sepearates for 2nd tab and 10th tab getting data. we are using 1st tab get API
   */
  forFiReferalEditData(event) {
    if (event) {
      this.dropdoenTabname = this._commonService.GetFiTabName();
      if (this.forTenthTabData) {
        this.fiReferralData.notApplicableForReferralFlag = !(this.forTenthTabData.pIsreferralapplicable);
        this.fiReferralData.referralForm.patchValue({
          pReferralname: this.forTenthTabData.pReferralname,
          pSalespersonname: this.forTenthTabData.pSalespersonname
        })
        this.fiReferralData.getReferralAgentDetails();
        this.fiReferralData.getallEmployeeDetails();
        this.fiReferralData.agentReferenceId = this.forTenthTabData.preferralcontactrefid;
        this.fiReferralData.employeeReferenceId = this.forTenthTabData.psalespersoncontactrefid;
      }
    }
  }
  /**----- (End)--- For Fi referral - 10th tab data binding or setting data-------(End)----- */

  /**------(Start)----- For updating Property details in Security colletral - 6th tab--------(Start)-
   * -----> Here we are getting Property details from Loan Against Property loan in Loan 
   *        specific component By using this data we are updating the grid data in 
   *        Security colletral - 6th data.
   *        Because we are using same component in Security colletral(6th tab) and 
   *        Loan against Property(in Loan specific - 8th tab)
   */
  forMasterPropertyDetailsEmit(event) {
    this.FiSecurityandcollateral.propertyDetailsComponent.tempArr = [];
    if (event) {
      if (this.FiSecurityandcollateral) {
        if (this.FiSecurityandcollateral.propertyDetailsComponent.tempArr && this.FiSecurityandcollateral.propertyDetailsComponent.tempArr.length > 0) {
          let array1 = this.FiSecurityandcollateral.propertyDetailsComponent.tempArr;
          let array2 = event;
          let array3 = [...array1, ...array2];
          this.FiSecurityandcollateral.propertyDetailsComponent.propertyGridData = [];
          this.FiSecurityandcollateral.propertyDetailsComponent.propertyGridData = array3;
        }
        else {
          this.FiSecurityandcollateral.propertyDetailsComponent.propertyGridData = event;
        }
      }
    }
  }
  /**------(End)----- For updating Property details in Security colletral - 6th tab--------(End)- */

  /**------(Start)----- For updating Movable Property details in Security colletral - 6th tab--------(Start)-
   * -----> Here we are getting Movable Property details from Loan Against Property loan in 
   *        Loan specific component By using this data we are updating the Movable property 
   *        grid data in Security colletral - 6th data.
   *        Because we are using same component in Security colletral(6th tab) and 
   *        Loan against Property(in Loan specific - 8th tab)
   */
  forMasterMovalbleProprtyDetailsEmit(event) {
    this.FiSecurityandcollateral.movablePropertyDetailsComponent.tempArr = [];
    if (event) {
      if (this.FiSecurityandcollateral) {
        if (this.FiSecurityandcollateral.movablePropertyDetailsComponent.tempArr && this.FiSecurityandcollateral.movablePropertyDetailsComponent.tempArr.length > 0) {
          let array1 = this.FiSecurityandcollateral.movablePropertyDetailsComponent.tempArr;
          let array2 = event;
          let array3 = [...array1, ...array2];
          this.FiSecurityandcollateral.movablePropertyDetailsComponent.movablePropertyGridData = [];
          this.FiSecurityandcollateral.movablePropertyDetailsComponent.movablePropertyGridData = array3;
        }
        else {
          this.FiSecurityandcollateral.movablePropertyDetailsComponent.movablePropertyGridData = event;
        }
      }
    }
  }
  /**------(End)----- For updating Movable Property details in Security colletral - 6th tab--------(End)- */

  /**-----(Start)----- For sending type of contact to 3rd tab------------(Start)--------
   * -----> Here we are sending either Individual or Business Entity form 
   *        1st tab to 3rd tab.
   */
  forContactTypeEmit(event) {
    this.FiApplicantsandothers.SelectType = event;
  }
  /**-----(End)----- For sending type of contact to 3rd tab------------(End)-------- */

  /**------(Start)--- For setting Business activity details in Personal loan in Loan specific (8th tab)----(Start)---- 
   * -----> Here we are getting business activity details from Personal details - 5th tab. 
   *        By using this 5th tab business activity details, we are sending to Personal loan.
  */
  enteredBusinessActivityDetails(event) {
    if (this.fiLoanSpecific.personalFormdata) {
      event.pcommencementdate = new Date(event.pcommencementdate);
      event.pestablishmentdate = new Date(event.pestablishmentdate);
      this.fiLoanSpecific.personalFormdata.activityDetails.setFormData(event);
    }
  }
  /**------(End)--- For setting Business activity details in Personal loan in Loan specific (8th tab)----(End)---- */

  /**------(Start)--- For setting Business Financial details in Personal loan in Loan specific (8th tab)----(Start)---- 
   * -----> Here we are getting business Financial details from Personal details - 5th tab.
   *        By using this 5th tab business Financial details, we are sending to Personal loan.
  */
  enteredBusinessFinancialDetails(event) {
    if (this.fiLoanSpecific.personalFormdata) {
      this.fiLoanSpecific.personalFormdata.financialDetails.businessFincialGriddata = event;
    }
  }
  /**------(End)--- For setting Business Financial details in Personal loan in Loan specific (8th tab)----(End)---- */

  /**-------(Start)---- For setting Property and Movable property details in Loan against property ----(Start)--- */
  forLoanSpecificData(event) {
    if (this.fiLoanSpecific.loanagainstPropertyFormdata) {
      this.fiLoanSpecific.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData = event.tempData1;
      this.fiLoanSpecific.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData = event.tempData2;
    }
  }
  /**-------(End)---- For setting Property and Movable property details in Loan against property ----(End)--- */

  /** -------(Start)---- For back button in 2nd tab while create and Edit time--------(Start)-- */
  forGettingContactDataEmit(data) {

    this.fiLoandDetails.forDatePickerCount = 0;
    if (data.event == true) {
      if (this.routeVchApplicationId != null &&
        this.routeVchApplicationId != '' &&
        this.routeVchApplicationId != undefined) {
        this.notEditable = true;
        this.dropdoenTabname = this.fiLoandDetails.dropdoenTabname;
        this.FiContacttype.getFiIndividualUserData();
      }
      else {
        this.dropdoenTabname = this.fiLoandDetails.dropdoenTabname;
        this.FiContacttype.getFiIndividualUserData();
      }
    }
  }
  /** -----(End)---- For back button in 2nd tab while create and Edit time--------(End)-- */

  /**------(Start)------------- To get 2nd tab details -------------(Start)----------------
   * -----> This method will execute when we are click on 3rd tab (Fi Applicant and others) back button.
   */
  forGettingLoanDetailsDataEmit(eventData) {
    if (eventData.event == true) {
      this.dropdoenTabname = this.FiApplicantsandothers.dropdoenTabname;
      this.fiLoandDetails.forThirdrdTabBackButton = true;
      this.fiLoandDetails.forDatePickerCount = -1;
      this.fiLoandDetails.FiLoanDetailsForm.patchValue({
        pAmountrequested: this._commonService.currencyformat(this.fiLoandDetails.FiLoanDetailsForm.value.pAmountrequested)
      });
      this._FIIndividualService.getFiIndividualUserData(eventData.pVchapplicationid ? eventData.pVchapplicationid : this.vchapplicationid).subscribe((response: any) => {
        if (response && response[0]) {
          let data = {
            ShowDetailsOnTab: true,
            LoanDetails: response[0],
            EligibleAmountDetails: response[1]
          }
          this.fiLoandDetails.forThirdrdTabBackButton = true;
          this.totalTwotabsData(data);
        }
      })
    }
  }
  /**------(End)------------- To get 2nd tab details -------------(End)---------------- */

  /**----------(Start)----- For getting Applicant and others (3rd tab) API --------(Start)---------
     * --------> This event is coming from <fi-kycandidentification> component (4th tab) - Back button click
     */
  forGettingApplicantAndOthersDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.FiKycandidentification.dropdoenTabname;
      this.FiApplicantsandothers.getCoapplicantsAndGuarrantersData();
    }
  }
  /**----------(End)----- For getting Applicant and others (3rd tab) API --------(End)--------- */

  /**----------(Start)----- For getting KYC documents (4th tab) API --------(Start)---------
     * --------> This event is coming from <fi-personaldetails> component (5th tab) - Back button click
     */
  forGettingKYCDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.FiPersonaldetails.dropdoenTabname;
      this.FiKycandidentification.forCreate = false;
      this.FiKycandidentification.getKYCAndCreditScoreDataForEditing();
    }
  }
  /**----------(End)----- For getting KYC documents (4th tab) API --------(End)--------- */

  /**----------(Start)----- For getting Personal Details (5th tab) API --------(Start)---------
     * --------> This event is coming from <fi-securitycolletral> component (6th tab) - Back button click
     */
  forGettingPersonalDetailsDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.FiSecurityandcollateral.dropdoenTabname;
      this.FiPersonaldetails.getPersonalDetailsDataForEditingAndGetting();
    }
  }
  /**----------(End)----- For getting Personal Details (5th tab) API --------(End)--------- */

  /**----------(Start)----- For getting Security colletral details (6th tab) API --------(Start)---------
     * --------> This event is coming from <fi-existingloans> component (7th tab) - Back button click
     */
  forGettingSecurityColletralDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.fiExistingUserDetailsComponentData.dropdoenTabname;
      this.FiSecurityandcollateral.getSecurityAndColletralData()
    }
  }
  /**----------(End)----- For getting Security colletral details (6th tab) API --------(End)--------- */

  /**----------(Start)----- For getting Existing loans details (7th tab) API --------(Start)---------
     * --------> This event is coming from <fi-loanspecific> component (8th tab) - Back button click
     */
  forGettingExistingLoansDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.fiLoanSpecific.dropdoenTabname;
      this.fiExistingUserDetailsComponentData.getExistingUsersDataForEditingAndGetting();
    }
  }
  /**----------(End)----- For getting Existing loans details (7th tab) API --------(End)--------- */

  /**----------(Start)----- For getting Loan specific details (8th tab) API --------(Start)---------
     * --------> This event is coming from <fi-references> component (9th tab) - Back button click
     */
  forGettingLoanSpecificDetailsDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.fiReferences.dropdoenTabname;
      this.fiLoanSpecific.getApplicantLoanSpecificDetails(this.vchapplicationid ? this.vchapplicationid : this.routeVchApplicationId);
    }
  }
  /**----------(End)----- For getting Loan specific details (8th tab) API --------(End)--------- */

  /**----------(Start)----- For getting FI References details (9th tab) API --------(Start)---------
     * --------> This event is coming from <fi-referral> component (10th tab) - Back button click
     */
  forGettingReferencesDataEmit(event) {
    if (event) {
      this.dropdoenTabname = this.fiReferralData.dropdoenTabname;
      this.fiReferences.getApplicationReferenceData();
    }
  }
  /**----------(End)----- For getting FI References details (9th tab) API --------(End)--------- */
}
