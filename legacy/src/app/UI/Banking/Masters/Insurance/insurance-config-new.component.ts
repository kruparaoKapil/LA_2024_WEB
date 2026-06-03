import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { InsuranceService } from 'src/app/Services/Insurance/insurance.service';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-insurance-config-new',
  templateUrl: './insurance-config-new.component.html',
  styles: []
})
export class InsuranceConfigNewComponent implements OnInit {

  insuranceConfigForm: FormGroup;
  insuranceSchemeConfigurationForm: FormGroup;
  refferalInsuranceConfigForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private _commonService: CommonService,
    private insuranceService: InsuranceService,
    private _fdrdservice: FdRdServiceService,
    private _loanmasterservice: LoansmasterService,
    private _TdsService: TdsdetailsService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
  }

  buttonName: string = 'Save';
  insuranceSchemeNameAndCode: string = '';

  notApplicableForInsuranceRefFlag: boolean = true;
  notApplicableTDSFlag: boolean = false;
  tdsShow: boolean = false;
  forFixed: boolean = true;;
  forPercentage: boolean = false;
  notEditable: boolean = false;
  ageFlag: Boolean = true;
  applicantTypeData: any;
  memberApplicantFlag: boolean = true;
  hideClearButton: boolean = false;
  isLoading: boolean = false;
  forDisableTabs: boolean = true;

  companyDetails: any;
  insuranceConfigMessage: any;
  companyCode: any;
  branchCode: any;
  memberTypeDetails: any;
  applicantTypes: any;
  interestPayOuts: any;
  insurenceName: any;
  insurenceNameCode: any;
  insuranceEditData: any;
  insurenceNameAndCodeData: any;
  insuranceData: any;
  urlObject: any
  insuranceConfigEditData: any;
  ipInsurenceconfigid: any;
  ipInsurencename: any;
  ipInsurencenamecode: any;
  meberTypeData: any;
  existingInsurenceNameCount: any;

  insuranceConfigFormDataGrid = [];
  tempGrid = [];
  memberTypeIds = [];
  tdsSectionDetails = [];
  editInsurenceReferralDetails = [];


  ngOnInit() {

    /**
     * Error message object initialization
     */
    this.insuranceConfigMessage = {};

    /**
     * Insurance config form initialization (start).
     */
    this.insuranceConfigForm = this.formBuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pInsurencename: ['', Validators.required],
      pInsurencecode: ['', Validators.required],
      pSeries: ['00001', Validators.required],
      pBranchcode: [''],
      pCompanycode: [''],
      pInsurencenamecode: [''],
      ptypeofoperation: ['']
    });
    /**
     * Insurance config form initialization (end).
     */

    /**
     * For edit getting insurance name and code using encrypted url (start).
     */
    if (this.activatedRouter.snapshot.params.urlObject != undefined) {
      this.urlObject = JSON.parse(atob(this.activatedRouter.snapshot.params.urlObject));
      if (this.urlObject.insurenceNameCode) {
        this.insurenceName = this.urlObject.insurenceName;
        this.insurenceNameCode = this.urlObject.insurenceNameCode;
        this.getInsurenceNameAndCodeDetails(this.insurenceName, this.insurenceNameCode);
        this.notEditable = true;
      }
    }
    /**
     * For edit getting insurance name and code using encrypted url (end).
     */


    /**
     * Second tab insurance scheme configuration form initialization (start).
     */
    this.insuranceSchemeConfigurationForm = this.formBuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pMembertypeid: [],
      pMembertype: ['', Validators.required],
      pApplicanttype: ['', Validators.required],
      pAgefrom: [],
      pAgeto: [],
      pInsuranceduration: [''],
      pPremiumamountpayable: [],
      pPremiumpayin: [''],
      pInsuranceclaimpayoutevent: [''],
      pInsuranceclaimamount: [],
      pPremiumrefund: [false],
      ptypeofoperation: [''],
      pStatusname: ['ACTIVE']
    });
    /**
     * Second tab insurance scheme configuration form initialization (end).
     */


    /**
     * To get member details calling api.
     */
    this._fdrdservice.GetMemberDetailsList().subscribe(json => {
      if (json) {
        this.memberTypeDetails = json
      }
    });

    this.getApplicantTypes('Individual');
    this.getInterestPayout();

    //<---------3rd tab------------>
    /**
     * Refferal insurance config form initialization (start).
     */
    this.refferalInsuranceConfigForm = this.formBuilder.group({
      pInsurenceconfigid: [0],
      pInsurencename: [""],
      pInsurencenamecode: [""],
      precordid: [0],
      pIsreferralcommissionapplicable: [false],
      pReferralcommissiontype: ["fixed"],
      pCommissionValue: [0],
      pIstdsapplicable: [false],
      pTdsaccountid: [""],
      pTdssection: [""],
      pTdspercentage: [0],
      pTypeofOperation: [""],
      createdby: [0],
      modifiedby: [0],
      pCreatedby: [this._commonService.pCreatedby],
      pModifiedby: [0],
      pStatusid: [""],
      pStatusname: [this._commonService.pStatusname],
      pEffectfromdate: [""],
      pEffecttodate: [""],
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    /**
     * Refferal insurance config form initialization (end).
     */


    /**
     * Geting TDS section details at loading the component.
     */
    this.getTDSsectiondetails();

    this.companyCode = '';
    this.branchCode = '';

    /**
     * Api to get company and branch details.
     */
    this.insuranceService.GetCompanyBranchDetails().subscribe(response => {
      if (response) {
        this.companyDetails = response;
        this.companyCode = this.companyDetails[0].pEnterprisecode;
        this.branchCode = this.companyDetails[0].pBranchcode;
        this.insuranceConfigForm.controls.pCompanycode.setValue(this.companyCode);
        this.insuranceConfigForm.controls.pBranchcode.setValue(this.branchCode);
      }
    });
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {

      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.insuranceConfigMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.insuranceConfigMessage[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {

      return false;
    }
    return isValid;
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {

      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {

    try {
      let formcontrol;

      formcontrol = fromgroup.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }

    }
    catch (e) {

      return false;
    }



  }


  // <----------------------------------------edit first tab start------------------------------------------------>
  /**
   * Calling api to get data for edit and patching the values to form object (start).
   * @param insurenceName 
   * @param insurenceNameCode 
   */
  getInsurenceNameAndCodeDetails(insurenceName, insurenceNameCode) {
    try {
      this.hideClearButton = true;
      this.insuranceService.getInsurenceNameAndCodeDetails(insurenceName, insurenceNameCode).subscribe(res => {
        if (res) {
          this.insuranceEditData = res;
          this.insuranceSchemeNameAndCode = this.insuranceEditData.pInsurencenamecode;
          this.ipInsurenceconfigid = Number(this.insuranceEditData.pInsurenceconfigid);
          this.insuranceConfigForm.patchValue({
            pCreatedby: this._commonService.pCreatedby,
            pInsurencename: this.insuranceEditData.pInsurencename,
            pInsurencecode: this.insuranceEditData.pInsurencecode,
            pSeries: this.insuranceEditData.pSeries,
            pBranchcode: this.insuranceEditData.pBranchcode,
            pCompanycode: this.insuranceEditData.pCompanycode,
            pInsurencenamecode: this.insuranceEditData.pInsurencenamecode,
            ptypeofoperation: 'UPDATE'
          });
          this.insuranceSchemeNameAndCode = this.insuranceEditData.pInsurencenamecode;
        }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }
  /**
   * Calling api to get data for edit and patching the values to form object (end).
   */
  // <----------------------------------------edit first tab end-------------------------------------------------->


  //<-------------------------------------1st tab create start----------------------------------------------------------->
  /**
   * On changing of insurance code generating the uniqe insurance (start).
   * Name and code
   * @param event 
   */
  onChangepInsurencecode(event) {
    let insuRenceCode = this.insuranceConfigForm.controls.pInsurencecode.value;
    if (insuRenceCode) {
      insuRenceCode = insuRenceCode.trim('').toUpperCase();
      this.insuranceSchemeNameAndCode = insuRenceCode + this.companyCode + this.branchCode + this.insuranceConfigForm.controls.pSeries.value;
      this.insuranceConfigForm.controls.pInsurencenamecode.setValue(this.insuranceSchemeNameAndCode);
      this.insuranceConfigForm.controls.pSeries.setValue(this.insuranceConfigForm.controls.pSeries.value);
      this.insuranceConfigMessage.pInsurencename = '';
    }
  }
  /**
   * On changing of insurance code generating the uniqe insurance Name and code (end).
   */


  /**
   * With the help of this function generating insurance scheme code (start).
   */
  generateInsuranceSchemeCode() {
    let pInsurencename = this.insuranceConfigForm.controls.pInsurencename.value.trim('');
    if (pInsurencename) {
      this.insuranceService.checkExistingInsurenceName(pInsurencename).subscribe(res => {
        this.existingInsurenceNameCount = res;
        if (this.existingInsurenceNameCount == 0) {
          let insurencecode = '';
          if (pInsurencename.includes(' ')) {
            let pInsurances = pInsurencename.split(' ');
            for (let index = 0; index < pInsurances.length; index++) {
              insurencecode = insurencecode + pInsurances[index].split('')[0].toUpperCase();
            }
          } else {
            insurencecode = pInsurencename.split('')[0].toUpperCase() + pInsurencename.split('')[pInsurencename.split('').length - 1].toUpperCase();
          }
          this.insuranceConfigForm.controls.pInsurencecode.setValue(insurencecode);
          this.insuranceSchemeNameAndCode = insurencecode + this.companyCode + this.branchCode + this.insuranceConfigForm.controls.pSeries.value;
          this.insuranceConfigForm.controls.pInsurencenamecode.setValue(this.insuranceSchemeNameAndCode);
          this.insuranceConfigMessage.pInsurencename = '';

        } else {
          this._commonService.showWarningMessage('Insurance Scheme Name already exist');
          this.insuranceConfigForm.controls.pInsurencecode.setValue('');
          this.insuranceConfigMessage.pInsurencecode = '';
          this.insuranceSchemeNameAndCode = '';
        }
      });
    } else {
      this.insuranceConfigForm.controls.pInsurencecode.setValue('');
      this.insuranceConfigMessage.pInsurencecode = '';
      this.insuranceSchemeNameAndCode = '';
    }

  }
  /**
   * With the help of this function generating insurance scheme code (end).
   */


  /**
   * To clear the form data re-initialization of form (start).
   */
  clearData() {
    this.insuranceConfigForm = this.formBuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pInsurencename: ['', Validators.required],
      pInsurencecode: [''],
      pSeries: ['00001'],
      pBranchcode: [''],
      pCompanycode: [''],
      pInsurencenamecode: [''],
      ptypeofoperation: ['']
    });
    this.insuranceSchemeNameAndCode = '';
  }
  /**
   * To clear the form data re-initialization of form (end).
   */


  /**
   * Api to save 1st tab data with required validations (start).
   * And after getting succes moving to second tab.
   */
  saveInsuranceConfig() {
    try {
      let isValid = true
      if (this.checkValidations(this.insuranceConfigForm, isValid)) {
        this.buttonName = 'Processing';
        this.isLoading = true;
        if (this.insuranceConfigForm.value.ptypeofoperation != 'UPDATE') {
          this.insuranceConfigForm.controls.ptypeofoperation.setValue('CREATE');
        }
        this.insuranceData = this.insuranceConfigForm.value;
        this.insuranceService.saveInsurenceNameAndCode(this.insuranceData).subscribe(res => {
          this.insurenceNameAndCodeData = res;
          this.ipInsurenceconfigid = Number(this.insurenceNameAndCodeData.pInsurenceconfigid);
          this.forDisableTabs = false;
          this.buttonName = 'Next';
          this.isLoading = false;

          let str = 'insurance-config';
          $('.nav-item a[href="#' + str + '"]').tab('show');
          if (this.insurenceNameCode) {
            this.getInsurenceConfigurationDetails(this.insurenceName, this.insurenceNameCode);
          }
        });
      }
    } catch (error) {
      this.buttonName = 'Save';
      this.isLoading = false;
      this.showErrorMessage(error);
    }
  }
  /**
   * Api to save 1st tab data with required validations (end).
   */
  //<-------------------------------------1st tab end--------------------------------------------->


  // <-----------------------------------2nd tab edit start--------------------------------------->
  /**
   * Second tab edit api caliing with below params (start).
   * @param insurenceName 
   * @param insurenceNameCode 
   */
  getInsurenceConfigurationDetails(insurenceName, insurenceNameCode) {
    try {
      this.buttonName = 'Save';
      this.isLoading = false;
      this.insuranceService.getInsurenceConfigurationDetails(insurenceName, insurenceNameCode).subscribe(res => {
        if (res) {
          this.insuranceConfigEditData = res;
          this.ipInsurenceconfigid = this.insuranceConfigEditData.pInsurenceconfigid;
          this.ipInsurencename = insurenceName;
          this.ipInsurencenamecode = insurenceNameCode;
          this.insuranceConfigEditData.lstInsurenceConfigartionDetails.forEach(element => {
            element.pPremiumamountpayable = this._commonService.currencyformat(element.pPremiumamountpayable);
            element.pInsuranceclaimamount = this._commonService.currencyformat(element.pInsuranceclaimamount);
            let age = {
              age: element.pAgefrom + '-' + element.pAgeto
            }
            this.insuranceConfigFormDataGrid.push(Object.assign(element, age));
          });
        }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }
  /**
   * Second tab edit api caliing with above params (end).
   */

  // <-----------------------------------2nd tab edit end----------------------------------------->



  //<-------------------------------------2nd tab create start--------------------------------------------->

  /**
   * Function to validate age (start).
   * From age should be less than To Age
   */
  validateFromAgeToAge() {
    let ageFrom = Number(this.insuranceSchemeConfigurationForm.value.pAgefrom);
    let ageTo = Number(this.insuranceSchemeConfigurationForm.value.pAgeto);
    if (ageTo > 0) {
      if (ageFrom > ageTo) {
        this.ageFlag = false;
        this._commonService.showWarningMessage('From age should be less than To Age');
      } else {
        this.ageFlag = true;
      }
    }
  }
  /**
   * Function to validate age (end).
   */


  /**
   * Function to validate the member type and applicant type pair in grid (start).
   */
  validateMeberAndApplicationPair(event1, event2) {
    if (this.insuranceConfigFormDataGrid.length > 0) {
      let members = event1;
      let applicants = event2;
      if (members && members.length > 0 && applicants && applicants.length > 0) {
        for (let index1 = 0; index1 < members.length; index1++) {
          const memberType = members[index1].pmembertype;
          for (let index2 = 0; index2 < applicants.length; index2++) {
            const applicantType = applicants[index2].pApplicanttype;
            for (let index = 0; index < this.insuranceConfigFormDataGrid.length; index++) {
              const gridMeber = this.insuranceConfigFormDataGrid[index].pMembertype;
              const gridApplicant = this.insuranceConfigFormDataGrid[index].pApplicanttype;
              if (memberType == gridMeber && applicantType == gridApplicant) {
                this._commonService.showWarningMessage('The pair of Member Type ' + memberType + ' and Applicant Type ' + applicantType + ' already exist');
                this.memberApplicantFlag = false;
              } else {
                this.memberApplicantFlag = true;
              }
            }

          }

        }

      }
    }
  }
  /**
   * Function to validate the member type and applicant type pair in grid (end).
   */



  /**
   * On change of  member type binding to form key (start).
   * and validating member and apllicant type pair in grid.
   * @param event 
   */ 
  memberTypeChange(event) {
    if (event && event.length != 0) {
      this.meberTypeData = event;
      this.validateMeberAndApplicationPair(this.meberTypeData, this.applicantTypeData);
      this.memberTypeIds = [];
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        this.memberTypeIds.push(element);
      }
      if (event.length == 1) {
        this.memberTypeIds = [];
        this.memberTypeIds.push(event[0]);
      }
      let uniques = [...new Map(this.memberTypeIds.map(o => [o.pmembertypeid, o])).values()];
      this.memberTypeIds = uniques;
      this.insuranceConfigMessage.pMembertype = '';
    } else {
      this.memberTypeIds = [];
    }
  }


  /**
   * On change of applicant type binding to form key.
   * and validating member and apllicant type pair in grid.
   * @param event 
   */
  applicantTypeChange(event) {
    if (event) {
      this.applicantTypeData = event;
      this.validateMeberAndApplicationPair(this.meberTypeData, this.applicantTypeData);
      this.insuranceConfigMessage.pApplicanttype = '';
    }
  }


  /**
   * Api to get applicant types
   * @param type 
   */
  getApplicantTypes(type) {

    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, 0).subscribe(json => {
        if (json) {
          this.applicantTypes = json;
        }
      })
    }
  }


  /**
   * Api to get Insurance Duration (start).
   */
  getInterestPayout() {
    this._loanmasterservice._getLoanpayins().subscribe(json => {
      if (json) {
        this.interestPayOuts = json;
      }
    });
  }
  /**
   * Api to get Insurance Duration (end).
   */



  /**
   * Checked and unchecked functionality Premium Refund
   * @param event 
   */
  premiumChecked(event) {
    if (event.target.checked) {
      let premiumRefund = event.target.checked;
      this.insuranceSchemeConfigurationForm.controls.pPremiumrefund.setValue(premiumRefund);
    } else {
      this.insuranceSchemeConfigurationForm.controls.pPremiumrefund.setValue(false);
    }
  }

  /**
   * Function for adding form object data to grid with required (start).
   * validation
   */
  addToGrid() {
    try {
      let isValid = true;
      if (this.checkValidations(this.insuranceSchemeConfigurationForm, isValid)) {
        if (this.memberApplicantFlag == true) {
          if (this.ageFlag == true) {
            let memberTypes = this.insuranceSchemeConfigurationForm.value.pMembertype;
            let applicantTypes = this.insuranceSchemeConfigurationForm.value.pApplicanttype;
            for (let index1 = 0; index1 < memberTypes.length; index1++) {
              for (let index2 = 0; index2 < applicantTypes.length; index2++) {
                this.insuranceSchemeConfigurationForm.controls.ptypeofoperation.setValue('CREATE');
                this.insuranceSchemeConfigurationForm.controls.pMembertype.setValue(memberTypes[index1]);
                this.insuranceSchemeConfigurationForm.controls.pApplicanttype.setValue(applicantTypes[index2]);
                this.memberTypeIds.forEach(element => {
                  if (element.pmembertype == memberTypes[index1]) {
                    this.insuranceSchemeConfigurationForm.controls.pMembertypeid.setValue(element.pmembertypeid);
                  }
                });
                let ageFrom = this.insuranceSchemeConfigurationForm.value.pAgefrom;
                let toAge = this.insuranceSchemeConfigurationForm.value.pAgeto;
                let age = {
                  age: ageFrom ? ageFrom : '' + '-' + toAge ? toAge : ''
                }
                let insuranceConfigFormData = this.insuranceSchemeConfigurationForm.value
                this.insuranceConfigFormDataGrid.push(Object.assign(insuranceConfigFormData, age));
                this.meberTypeData = [];
                this.applicantTypeData = [];
              }

            }
            this.BlurEventAllControll(this.insuranceSchemeConfigurationForm);
            this.insuranceSchemeConfigurationForm = this.formBuilder.group({
              pCreatedby: [this._commonService.pCreatedby],
              pMembertypeid: [],
              pMembertype: ['', Validators.required],
              pApplicanttype: ['', Validators.required],
              pAgefrom: [],
              pAgeto: [],
              pInsuranceduration: [''],
              pPremiumamountpayable: [],
              pPremiumpayin: [''],
              pInsuranceclaimpayoutevent: [''],
              pInsuranceclaimamount: [],
              pPremiumrefund: [false],
              ptypeofoperation: [''],
              pStatusname: ['ACTIVE']
            });
            $('#premium')[0].checked = false;

          } else {
            this._commonService.showWarningMessage('From age should be less than To Age');
          }
        } else {
          this._commonService.showWarningMessage('The pair of Member Type and Applicant Type already exist');
        }
      }
    } catch (error) {
      this.showErrorMessage(error);
    }
  }
  /**
   * Function for adding form object data to grid with required (end).
   * validation
   */



  /**
   * To delete the row from grid (start).
   * @param param 
   */
  removeHandlerConfig({ dataItem }) {
    const index: number = this.insuranceConfigFormDataGrid.indexOf(dataItem);
    if (index !== -1) {
      this.insuranceConfigFormDataGrid.splice(index, 1);
    }
  }
  /**
   * To delete the row from grid (end).
   */



  /**
   * Api to save second tab data with proper DTO structure (start).
   */
  saveInsuranceConfigGridData() {
    try {
      let isValid = true;
      this.tempGrid = this.insuranceConfigFormDataGrid
      let gridDto = {
        "lstInsurenceConfigartionDetails": [],
        "pInsurenceconfigid": this.ipInsurenceconfigid,
        "pInsurencename": this.insuranceData ? this.insuranceData.pInsurencename : this.ipInsurencename,
        "pInsurencenamecode": this.insuranceData ? this.insuranceData.pInsurencenamecode : this.ipInsurencenamecode,
        "createdby": 0,
        "modifiedby": 0,
        "pCreatedby": this._commonService.pCreatedby,
        "pModifiedby": 0,
        "pStatusid": "",
        "pStatusname": "ACTIVE",
        "pEffectfromdate": "",
        "pEffecttodate": "",
        "ptypeofoperation": "CREATE"
      }
      for (let index = 0; index < this.tempGrid.length; index++) {
        this.tempGrid[index].pAgefrom = this.tempGrid[index].pAgefrom ? Number(this.tempGrid[index].pAgefrom) : 0;
        this.tempGrid[index].pAgeto = this.tempGrid[index].pAgeto ? Number(this.tempGrid[index].pAgeto) : 0;
        this.tempGrid[index].pPremiumamountpayable = this.tempGrid[index].pPremiumamountpayable ? Number(this.tempGrid[index].pPremiumamountpayable.replace(/,/g, "")) : 0;
        this.tempGrid[index].pInsuranceclaimamount = this.tempGrid[index].pInsuranceclaimamount ? Number(this.tempGrid[index].pInsuranceclaimamount.replace(/,/g, "")) : 0;
      }
      gridDto.lstInsurenceConfigartionDetails = this.tempGrid;

      this.buttonName = 'Processing';
      this.isLoading = true;
      this.insuranceService.saveInsurenceConfigDetail(gridDto).subscribe(res => {
        this.buttonName = 'Next';
        this.isLoading = false;
        let str = 'referral-commission';
        $('.nav-item a[href="#' + str + '"]').tab('show');
        if (this.ipInsurencenamecode) {
          this.getInsurenceReferralDetails(this.ipInsurencename, this.ipInsurencenamecode);
        }
      });


    } catch (error) {
      this.buttonName = 'Save';
      this.isLoading = false;
      this.showErrorMessage(error);
    }
  }
  /**
   * Api to save second tab data with proper DTO structure (end).
   */


  // <---------------------------------------2nd tab end------------------------------------------------->


  // <-----------------------------------------3rd tab edit------------------------------------------------>

  /**
   * Api to get the 3rd tab referral data for edit (start).
   * @param insurenceName 
   * @param insurenceNameCode 
   */
  getInsurenceReferralDetails(insurenceName, insurenceNameCode) {
    try {
      this.hideClearButton = true;
      this.buttonName = 'Save';
      this.isLoading = false;
      this.insuranceService.getInsurenceReferralDetails(insurenceName, insurenceNameCode).subscribe(res => {
        if (res) {
          this.editInsurenceReferralDetails.push(res);
          this.notApplicableForInsuranceRefFlag = !this.editInsurenceReferralDetails[0].pIsreferralcommissionapplicable;
          this.ipInsurenceconfigid = this.editInsurenceReferralDetails[0].pInsurenceconfigid;
          this.refferalInsuranceConfigForm.patchValue({
            pInsurenceconfigid: this.editInsurenceReferralDetails[0].pInsurenceconfigid,
            pInsurencename: this.editInsurenceReferralDetails[0].pInsurencename,
            pInsurencenamecode: this.editInsurenceReferralDetails[0].pInsurencenamecode,
            precordid: this.editInsurenceReferralDetails[0].precordid,
            pIsreferralcommissionapplicable: this.editInsurenceReferralDetails[0].pIsreferralcommissionapplicable,
            pReferralcommissiontype: this.editInsurenceReferralDetails[0].pReferralcommissiontype,
            pCommissionValue: this._commonService.currencyformat(this.editInsurenceReferralDetails[0].pCommissionValue),
            pIstdsapplicable: this.editInsurenceReferralDetails[0].pIstdsapplicable,
            pTdsaccountid: this.editInsurenceReferralDetails[0].pTdsaccountid,
            pTdssection: this.editInsurenceReferralDetails[0].pTdssection,
            pTdspercentage: this.editInsurenceReferralDetails[0].pTdspercentage,
            pTypeofOperation: '',
            createdby: 0,
            modifiedby: 0,
            pCreatedby: this._commonService.pCreatedby,
            pModifiedby: 0,
            pStatusid: "",
            pStatusname: this._commonService.pStatusname,
            pEffectfromdate: "",
            pEffecttodate: "",
            ptypeofoperation: this.editInsurenceReferralDetails[0].pTypeofOperation
          });
          let type = this.editInsurenceReferralDetails[0].pReferralcommissiontype;
          this.tdsShow = this.editInsurenceReferralDetails[0].pIstdsapplicable;
          if (type == 'fixed') {
            this.forFixed = true;
            this.forPercentage = false;
          }
          else {
            this.forFixed = false;
            this.forPercentage = true;
          }
          if (this.editInsurenceReferralDetails[0].pTdssection == true) {
            this.getTDSsectiondetails();
          }

        }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }
  /**
   * Api to get the 3rd tab referral data for edit (end).
   */

  // <-----------------------------------------3rd tab edit------------------------------------------------>


  // <---------------------------------------3rd tab create start--------------------------------------------------->

  /**
   * Not applicable functionality referral tab.
   * @param event 
   */
  notApplicableForInsuranceRef(event) {
    this.notApplicableForInsuranceRefFlag = event.target.checked;
  }

  /**
   * TDS cehck and unchecked functionality (start).
   * @param event 
   */
  tdsCheck(event) {
    this.tdsShow = event.target.checked;
    if (this.tdsShow == true) {
      this.getTDSsectiondetails();
    }
  }
  /**
   * TDS cehck and unchecked functionality (end).
   */


  /**
   * Api to get TDS section details (start).
   */
  getTDSsectiondetails() {
    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {
        if (json != null) {
          this.tdsSectionDetails = json;
        }
      },
      (error) => {
        this._commonService.showErrorMessage(error);
      }
    );
  }
  /**
   * Api to get TDS section details (end).
   */



  /**
   * On change of commission value binding changed value to key (start).
   * @param event 
   */
  onCommissionChange(event) {
    let type = event.target.value;
    if (type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.refferalInsuranceConfigForm.patchValue({
        pCommissionValue: '',
        pReferralcommissiontype: type
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.refferalInsuranceConfigForm.patchValue({
        pCommissionValue: '',
        pReferralcommissiontype: type
      })
    }
  }
  /**
   * On change of commission value binding changed value to key (end).
   */




  /**
   * Referral commission applicable or not applicable (start).
   * @param selectedType 
   */
  referralCommissionApplicable(selectedType) {
    if (selectedType === 'YES') {
      this.refferalInsuranceConfigForm.patchValue({
        pIsreferralcommissionapplicable: true
      });
    } else {
      this.refferalInsuranceConfigForm.patchValue({
        pIsreferralcommissionapplicable: false
      });
    }
  }
  /**
   * Referral commission applicable or not applicable (end).
   */


   
  /**
   * Api to save the referral data with required DTO structure (start).
   */
  saveReferralData() {
    try {
      for (let index = 0; index < this.tdsSectionDetails.length; index++) {
        if (this.refferalInsuranceConfigForm.value.pTdssection == this.tdsSectionDetails[index].pTdsSection) {
          this.refferalInsuranceConfigForm.controls.pTdspercentage.setValue(Number(this.tdsSectionDetails[index].pTdsPercentage));
          break;
        }
      }

      this.refferalInsuranceConfigForm.patchValue({
        pInsurenceconfigid: this.ipInsurenceconfigid,
        pInsurencename: this.insuranceData.pInsurencename,
        pInsurencenamecode: this.insuranceData.pInsurencenamecode,
        pCommissionValue: this.refferalInsuranceConfigForm.value.pCommissionValue,
        pIstdsapplicable: this.tdsShow,
        pTdssection: this.refferalInsuranceConfigForm.value.pTdssection,
      });

      this.refferalInsuranceConfigForm.patchValue({
        pIsreferralcommissionapplicable: !this.notApplicableForInsuranceRefFlag
      });

      this.buttonName = 'Processing';
      this.isLoading = true;
      this.insuranceService.saveReferralData(this.refferalInsuranceConfigForm.value).subscribe(res => {
        this.buttonName = 'Next';
        this.isLoading = false;
        this.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/InsuranceConfigView');
        this.BlurEventAllControll(this.refferalInsuranceConfigForm);
        this.refferalInsuranceConfigForm = this.formBuilder.group({
          pInsurenceconfigid: [0],
          pInsurencename: [""],
          pInsurencenamecode: [""],
          precordid: [0],
          pIsreferralcommissionapplicable: [false],
          pReferralcommissiontype: ["fixed"],
          pCommissionValue: [0],
          pIstdsapplicable: [false],
          pTdsaccountid: [""],
          pTdssection: [""],
          pTdspercentage: [0],
          pTypeofOperation: [""],
          createdby: [0],
          modifiedby: [0],
          pCreatedby: [this._commonService.pCreatedby],
          pModifiedby: [0],
          pStatusid: [""],
          pStatusname: [this._commonService.pStatusname],
          pEffectfromdate: [""],
          pEffecttodate: [""],
          ptypeofoperation: [this._commonService.ptypeofoperation]
        });
      });
    } catch (error) {
      this.buttonName = 'Save';
      this.isLoading = false;
      this.showErrorMessage(error);
    }
  }
  /**
   * Api to save the referral data with required DTO structure (end).
   */


  /**
   * Function to clear the form data (start).
   */
  clearRefData() {
    this.notApplicableForInsuranceRefFlag = false;
    this.BlurEventAllControll(this.refferalInsuranceConfigForm);
    this.refferalInsuranceConfigForm = this.formBuilder.group({
      pInsurenceconfigid: [0],
      pInsurencename: [""],
      pInsurencenamecode: [""],
      precordid: [0],
      pIsreferralcommissionapplicable: [false],
      pReferralcommissiontype: ["fixed"],
      pCommissionValue: [0],
      pIstdsapplicable: [false],
      pTdsaccountid: [""],
      pTdssection: [""],
      pTdspercentage: [0],
      pTypeofOperation: [""],
      createdby: [0],
      modifiedby: [0],
      pCreatedby: [this._commonService.pCreatedby],
      pModifiedby: [0],
      pStatusid: [""],
      pStatusname: [this._commonService.pStatusname],
      pEffectfromdate: [""],
      pEffecttodate: [""],
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
  }
  /**
   * Function to clear the form data (end).
   */

  // <---------------------------------------3rd tab end--------------------------------------------------->
  back(){
    debugger;
    this.router.navigate(['/InsuranceConfigView']);
  }
}
