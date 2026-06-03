import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MemberService } from '../../../../Services/Banking/member.service';
import { Router } from '@angular/router';

declare let $: any

@Component({
  selector: 'app-fi-references',
  templateUrl: './fi-references.component.html',
  styles: []
})
export class FiReferencesComponent implements OnInit {

  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  /**
   * Sending flag to retrive Fi-Referal edit data.
   */
  @Output() forFiReferalEditData = new EventEmitter();

  /**
   * Sending flag to retrive fi-Loan specific details data.
   */
  @Output() forGettingLoanSpecificDetailsDataEmit = new EventEmitter();

  /**
   * Sending flag to retrive Personal details data.
   */
  @Output() forGettingPersonalDetailsDataEmit = new EventEmitter();

  /**
   * Flag to not show the clear button while edit.
   */
  @Input() forClearButton: boolean;

  referenceForm: FormGroup;
  lstApplicantandOthersData = [];
  referenceFormData: [];
  public gridData: any[] = [];
  applicationReferenceData = [];

  notApplicableForReferencFlag: boolean = true;
  public isLoading: boolean = false;
  loading: boolean = false;

  referenceTypeErrorMessage: any;
  pVchapplicationid: any;
  loadDetailsData: any;
  FiMemberFormDetails: any
  pVchapplicationId: any
  pApplicantId: any
  FormName: any

  dropdoenTabname: string;
  buttonName = "Save & Continue";

  constructor(private formBuilder: FormBuilder,
    private _commonService: CommonService,
    private fIIndividualService: FIIndividualService,
    private _MemberService: MemberService, private router:Router ) { }

  ngOnInit() {

    /**
     * to get the pVchapplicationid from backend By Ravi shanakr
     */
    this.getpVchapplicationid();

    /**
     * Object to bind the error messages.
     */
    this.referenceTypeErrorMessage = {};


    /**
     * Initialization of References form. 
     */
    this.referenceForm = this.formBuilder.group({
      pRefFirstname: ['', [Validators.maxLength(75), Validators.required]],
      pRefLastname: ['', Validators.maxLength(50)],
      pRefcontactNo: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.required]],
      pRefalternatecontactNo: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      pRefEmailID: ['', Validators.pattern],
      pRefAlternateEmailId: ['', Validators.pattern],
      pCreatedby: [0],
      ptypeofoperation: ['CREATE']
    });

    /**
     * To make blur calling function using form.
     */
    this.BlurEventAllControll(this.referenceForm);


    /**
     * To get first and second tab master data calling api.
     */
    this._MemberService._GetFiMemberTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.FiMemberFormDetails = res;
        this.pVchapplicationId = this.FiMemberFormDetails[0].pMemberReferenceId;
        this.pApplicantId = this.FiMemberFormDetails[0].pMemberId;
        this.FormName = this.FiMemberFormDetails[0].fromForm;
      }
    });
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
          this.checkValidations(formcontrol, isValid);
        }
        else if (formcontrol.validator) {
          this.referenceTypeErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.referenceTypeErrorMessage[key] += errormessage + ' ';
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
  /**
   * To adding form data in grid ((Start))
   */
  saveReference() {
    debugger
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.checkValidations(this.referenceForm, isvalid)) {
      if (this.referenceForm.valid) {

        if (this.referenceForm.value.pRefFirstname ||
          this.referenceForm.value.pRefLastname ||
          this.referenceForm.value.pRefcontactNo ||
          this.referenceForm.value.pRefalternatecontactNo ||
          this.referenceForm.value.pRefEmailID ||
          this.referenceForm.value.pRefAlternateEmailId) {
          addFlag = true;
        }
        else {
          addFlag = false;
        }
        if (addFlag) {
          let pRefcontactNo = parseInt(this.referenceForm.value["pRefcontactNo"])
          this.referenceForm.controls.pRefFirstname.setValue(this.referenceForm.value["pRefFirstname"]);
          this.referenceForm.controls.pRefLastname.setValue(this.referenceForm.value["pRefLastname"]);
          this.referenceForm.controls.pRefcontactNo.setValue(pRefcontactNo);
          this.referenceForm.controls.pRefalternatecontactNo.setValue(this.referenceForm.value["pRefalternatecontactNo"]);
          this.referenceForm.controls.pRefEmailID.setValue(this.referenceForm.value["pRefEmailID"]);
          this.referenceForm.controls.pRefAlternateEmailId.setValue(this.referenceForm.value["pRefAlternateEmailId"]);
          this.referenceForm.controls.pCreatedby.setValue(0);
          this.referenceForm.controls.ptypeofoperation.setValue('CREATE');
          if (this.applicationReferenceData.length > 0) {
            var isPresent = this.applicationReferenceData.some(function (el) { return el.pRefcontactNo == pRefcontactNo });
            if(isPresent==true){
              this._commonService.showWarningMessage("Contact number already exists...");
              return
            }
          }
          if (this.applicationReferenceData && this.applicationReferenceData.length > 0) {
            this.applicationReferenceData.push(this.referenceForm.value);
          } else {
            this.applicationReferenceData = [];
            this.applicationReferenceData.push(this.referenceForm.value);
          }

          this.referenceForm = this.formBuilder.group({
            pRefFirstname: ['', [Validators.maxLength(75), Validators.required]],
            pRefLastname: ['', Validators.maxLength(50)],
            pRefcontactNo: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.required]],
            pRefalternatecontactNo: ['', [Validators.minLength(10), Validators.maxLength(12)]],
            pRefEmailID: ['', Validators.pattern],
            pRefAlternateEmailId: ['', Validators.pattern],
            pCreatedby: [0],
            ptypeofoperation: ['CREATE']
          });

          // this.referenceForm = this.formBuilder.group({
          //   pRefFirstname: ['', Validators.maxLength(75)],
          //   pRefLastname: ['', Validators.maxLength(50)],
          //   pRefcontactNo: ['', Validators.maxLength(12)],
          //   pRefalternatecontactNo: ['', Validators.maxLength(12)],
          //   pRefEmailID: ['', Validators.maxLength(50)],
          //   pRefAlternateEmailId: ['', Validators.maxLength(50)],
          //   pCreatedby: [0],
          //   ptypeofoperation: [this._commonService.ptypeofoperation]
          // })
         // this.referenceForm.reset();
          this.BlurEventAllControll(this.referenceForm);
        }
      }
    }

  }
  /**
   * To adding form data in grid ((End))
   */


  /**
   * Error message 
   */
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  /**
   * Info message 
   */
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }


  /**
    * to get the pVchapplicationid from backend By Ravi shanakr
    */
  getpVchapplicationid() {
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.loadDetailsData = res;
      }
    });
  }

  /**
   * References data to save calling api with appropriate structure By Ravi shanakr ((Start))
   */
  saveGridDatatoApi() {
    try {
      let apiObject = {
        "pCreatedby": this._commonService.pCreatedby,
        "modifiedby": 0,
        "pIsreferencesapplicable": !this.notApplicableForReferencFlag,
        "pMemberReferenceid": this.pVchapplicationId,
        "pMemberId": this.pApplicantId,
        "lobjAppReferences": [
        ]
      };
      apiObject.lobjAppReferences = (Object.assign(this.applicationReferenceData));
      this.buttonName = "Processing";
      this.isLoading = true;
      let RefData = JSON.stringify(apiObject)
      if (this.FormName == "FiMemberDetailsForm") {
        this._MemberService.saveFiMemberApplicationReferenceData(apiObject).subscribe(response => {
          if (response) {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
            let str = "refferral";
            this.dropdoenTabname = "Referral";
            $('.nav-item a[href="#' + str + '"]').tab('show');
         
            this.forFiReferalEditData.emit(true);
          } else {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
          }
        }, (error) => {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        });

      }
      else {
        this.fIIndividualService.saveApplicationReferenceData(apiObject, this.loadDetailsData.pApplicantid, this.loadDetailsData.pVchapplicationid).subscribe(response => {
          if (response) {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
            // let str = "refferral";
            // this.dropdoenTabname = "Referral";
            // $('.nav-item a[href="#' + str + '"]').tab('show');
            let str;
            let temptabname;
            this.dropdoenTabname = this._commonService.GetFiTabName();
            let tempFirstInformationTabsData = this._FirstInformationTabsData;
            let data = this.fIIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
            str = data.tabId;
            temptabname = data.tabName;
            if(str=='' && temptabname==''){
              this.buttonName = "Submit";
              this.isLoading = false;
              this._commonService.showInfoMessage('Saved successfully');
              this.router.navigateByUrl('/FiView');
              return
            }
            this._commonService.SetFiTabName(temptabname);
              // let str = "applicants-others"
              // this.dropdoenTabname = "Applicants and Others";
              this.dropdoenTabname = temptabname;
              $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            this.forFiReferalEditData.emit(true);
          } else {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
          }
        }, (error) => {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        });
      }
    } catch (error) {
      this.showErrorMessage(error);
    }
  }

  /**
   * References data to save calling api with appropriate structure By Ravi shanakr ((End))
   */



  /**
   * To get references data while edit ((Start))
   */
  getApplicationReferenceData() {
    try {
      debugger;
      if (this.FormName == "FiMemberDetailsForm") {
        this.loading = true;
        this.fIIndividualService.getFIMemberApplicationReferenceData(this.pVchapplicationId).subscribe((response: any) => {
          if (response != null) {
            console.log('References edit data',response)
            this.notApplicableForReferencFlag = !(response.pIsreferencesapplicable);
            this.applicationReferenceData = response.lobjAppReferences;
          }
          this.loading = false;
        });
      }
      else {
        this.loading = true;
        this.fIIndividualService.getApplicationReferenceData(this.loadDetailsData.pApplicantid, this.loadDetailsData.pVchapplicationid).subscribe((response: any) => {
          if (response != null) {
            this.notApplicableForReferencFlag = !(response.pIsreferencesapplicable);
            this.applicationReferenceData = response.lobjAppReferences;
          }
          this.loading = false;
        });
      }
    } catch (error) {
      this.loading = false;
      this.showErrorMessage(error);
    }
  }

  /**
   * To get references data while edit ((End))
   */



  /**
   * To remove a row from grid. 
   */
  removeHandler(event) {
    this.applicationReferenceData.splice(event.rowIndex, 1);
  }

  /**
   * Clearing form data. 
   */
  clearFormData() {

    /**
    * Object to bind the error messages.
    */
    this.referenceTypeErrorMessage = {};


    /**
     * Initialization of References form. 
     */
    this.referenceForm = this.formBuilder.group({
      pRefFirstname: ['', Validators.maxLength(75)],
      pRefLastname: ['', Validators.maxLength(50)],
      pRefcontactNo: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      pRefalternatecontactNo: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      pRefEmailID: ['', Validators.pattern],
      pRefAlternateEmailId: ['', Validators.pattern],
      pCreatedby: [0],
      ptypeofoperation: ['CREATE']
    });

    /**
     * To make blur calling function using form.
     */
    this.BlurEventAllControll(this.referenceForm);
  }

  /**
   * Not applicable and applicable functionality for references by default Not applicable.
   */
  notApplicableForReferenc(event) {
    let checked = event.target.checked;
    if (checked == true) {
      this.notApplicableForReferencFlag = true;
    } else {
      this.notApplicableForReferencFlag = false;
      this.referenceForm.reset();

    }
  }

  /**
   * Next button click functionality.
   */
  NextTabClick() {
    debugger
    if (this.notApplicableForReferencFlag == false) {
      if (this.applicationReferenceData.length == 0) {
        this._commonService.showWarningMessage("References are required")
      }
      else {
        this.saveGridDatatoApi();
      }
    }

    else {
      this.saveGridDatatoApi();
    }

  }


  /**
   * For back button functionality. ((Start))
   */
  moveToPreviousTab() {
    debugger;
    if (this.FormName == "FiMemberDetailsForm") {
      this.applicationReferenceData = [];
      this.clearFormData();
      let str = 'personal-details';
      this.dropdoenTabname = "Personal Details";
      $('.nav-item a[href="#' + str + '"]').tab('show');
      this.forGettingPersonalDetailsDataEmit.emit(true);
    } else {
      // let str = 'loan-specific';
      // this.dropdoenTabname = "Loan Specific Fields";
      // $('.nav-item a[href="#' + str + '"]').tab('show');
      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
        let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
        if (pTabsectionname == this.dropdoenTabname) {
          str = tempFirstInformationTabsData[i - 1].pTabsectionid;
          temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
          this._commonService.SetFiTabName(temptabname);
        }
      }
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.forGettingLoanSpecificDetailsDataEmit.emit(true);
    }
  }

  /**
   * For back button functionality. ((End))
   */
}
