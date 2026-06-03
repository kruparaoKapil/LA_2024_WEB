// import { Component, OnInit, Input } from '@angular/core';
// import { FormGroup, FormBuilder, Form, Validators } from '@angular/forms'
// import { CommonService } from 'src/app/Services/common.service';
// import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
// import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
// import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';

import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter,OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../../Services/common.service';
import { FIIndividualService } from '../../../../../Services/Loans/Transactions/fiindividual.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ContacmasterService } from '../../../../../Services/Loans/Masters/contacmaster.service';
import { FiPersonaldetailsIncomeComponent } from '../PersonalDetails/fi-personaldetails-income.component';
import { FiPersonaldetailsOtherincomeComponent } from '../PersonalDetails/fi-personaldetails-otherincome.component';
import { FiPersonaldetailsBusinessComponent } from '../PersonalDetails/fi-personaldetails-business.component';
import { FiPersonaldetailsFinancialperformanceComponent } from '../PersonalDetails/fi-personaldetails-financialperformance.component';

@Component({
  selector: 'app-personal-loan',
  templateUrl: './personal-loan.component.html',
  styles: []
})
export class PersonalLoanComponent implements OnInit{
  @ViewChild(FiPersonaldetailsIncomeComponent, { static: false }) IncomeFormdata: FiPersonaldetailsIncomeComponent;
  @ViewChild(FiPersonaldetailsOtherincomeComponent, { static: false }) otherIncomeFormdata: FiPersonaldetailsOtherincomeComponent;
  @ViewChild(FiPersonaldetailsBusinessComponent, {static: false}) activityDetails: FiPersonaldetailsBusinessComponent;
  @ViewChild(FiPersonaldetailsFinancialperformanceComponent, {static: false}) financialDetails: FiPersonaldetailsFinancialperformanceComponent;

  @Input() typeOfEmployement: string;
  @Input() enteredEmployeeDataToChild: any;
  @Input() oldData: any;
  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  tempFlag:string = '';
  enteredEmployeeData: any;
  pemploymenttype: any;
  incomeFormDataFromPersonalLoan: any;
  lstApplicantsandothers: any;
  employeemetForm: FormGroup;
  formValidationMessages: any;
  natureofOrganizationList: any;
  employementRoleList: any;
  personalLoanErrorMessage: any;
  
  showIncome:boolean=true;
  showEmployeement:boolean=true;
  personalLoanIncomedetails = true;
  personalLoanShowEmployeement=true;
  showEmployedDetails = true;
  showSelfEmployedDetails = false;
  forUpdate: boolean = false;
  experenceDisplayName = 'Total Work experience in years';

  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pdateofcommencementConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private _FormBuilder: FormBuilder, 
    private _commonService: CommonService, 
    private _FIIndividualService: FIIndividualService, 
    private _ContacmasterService: ContacmasterService) {

    this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
    this.pdateofestablishmentConfig.showWeekNumbers = false;
    this.pdateofestablishmentConfig.maxDate = new Date();
    this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pdateofcommencementConfig.containerClass = 'theme-dark-blue';
    this.pdateofcommencementConfig.showWeekNumbers = false;
    this.pdateofcommencementConfig.maxDate = new Date();
    this.pdateofcommencementConfig.dateInputFormat = 'DD/MM/YYYY';
  }
  ngOnInit() {
    this.loadEmploymentInitData();
    this.loadInitData();
    this.getEmployementRoleList();
    this.getNatureofOrganizationList();
  }
  clearForm() {
    this.employeemetForm.reset();
    this.loadInitData();
  }
  loadInitData() {
    let date = new Date();
    this.employeemetForm['controls']['pdateofestablishment'].setValue(date);
    this.employeemetForm['controls']['pdateofcommencement'].setValue(date);
    this.employeemetForm['controls']['pemploymenttype'].setValue('Employed');
    this.employeemetForm['controls']['ptypeofoperation'].setValue(this.forUpdate ? 'UPDATE' : 'CREATE');
    this.employeemetForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
    this.employeemetForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
    this.employeemetForm['controls']['pnameoftheorganization'].setValue('');
    this.employeemetForm['controls']['pemploymentrole'].setValue('');
    this.employeemetForm['controls']['pisapplicable'].setValue(true);
  }


  validateEmployeement(): boolean{
    let isValid = true;
    if (!this.employeemetForm.valid) {
      isValid = false;
    }
    return isValid;
  }
  /** <----(start) get employee form data(start)------> */
  getFormData(): any {
    let newdata;
    try {
      if (this.validateEmployeement()) {
        newdata = this.employeemetForm.value;
      }
      else {
        newdata = null;
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
    return newdata;
  }
  /** <----(end) get employee form data(end)------> */

  /** <----(start) set employee form data(start)------> */
    setFormData(formData) {
    try {
      this.employeemetForm.reset();
      this.clearForm();
      if (formData) {
        this.employeemetForm.patchValue(formData);
        if (this.employeemetForm.controls.pemploymenttype.value.toUpperCase() == 'EMPLOYED') {
          this.showEmployedDetails = true;
          this.showSelfEmployedDetails = false;
          this.experenceDisplayName = 'Enter Total Work experience in years';
        }
        else {
          this.showEmployedDetails = false;
          this.showSelfEmployedDetails = true;
          this.experenceDisplayName = 'Enter Total Industry experience in years';
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  /** <----(end) set employee form data(end)------> */

  loadEmployeemetForm() {
    return this._FormBuilder.group({

      pemploymenttype: ['Employed'],
      pnameoftheorganization: [''],
      pEnterpriseType: [''],
      pemploymentrole: [''],
      pofficeaddress: [''],
      pofficephoneno: [''],
      preportingto: [''],
      pemployeeexp: [''],
      pemployeeexptype: ['Years'],
      ptotalworkexp: [''],
      pdateofestablishment: [''],
      pdateofcommencement: [''],
      pgstinno: [''],
      pcinno: [''],
      pisapplicable: [true],
      pdinno: [''],
      ptradelicenseno: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this.forUpdate ? 'UPDATE' : 'CREATE']
    })
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  /**<------(start) Getting Natureof Organization List  from api(start)----> */
    getNatureofOrganizationList() {
    this._ContacmasterService.getTypeofEnterprise().subscribe(json => {
      if (json != null) {
        this.natureofOrganizationList = json
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  /**<------(end) Getting Natureof Organization List  from api(end)----> */

  /**<------(start) Getting Employement Role data from api(start)----> */
  getEmployementRoleList() {

    this._FIIndividualService.getEmployementRoleList().subscribe(json => {
      if (json != null) {
        this.employementRoleList = json
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  /**<------(end) Getting Employement Role data from api(end)----> */

  /**<------(start) functionality of radio button change of employement(start)----> */
  pemploymenttypeChange() {    
     if (this.employeemetForm.controls.pemploymenttype.value.toUpperCase() == 'EMPLOYED') {
      this.employeemetForm = this.loadEmployeemetForm();
       this.showEmployedDetails = true;
       this.showSelfEmployedDetails = false;
       this.experenceDisplayName = 'Total Work experience in years';
     }
     else {
      this.employeemetForm = this.loadEmployeemetSelfEmployeeForm();
       this.showEmployedDetails = false;
       this.showSelfEmployedDetails = true;
       this.experenceDisplayName = 'Total Industry experience in years';
     }
   }
  /**<------(end) functionality of radio button change of employement(end)----> */

/**<-----(start) checking validatons based on formgroup(start)----> */
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
      this.showErrorMessage(e);
      return false;
    }
  }
/**<-----(end) checking validatons based on formgroup(end)----> */

/**<-----(start) emit compute details to personal loan (personal details)(start)----> */
  forComputeDetailsEmit(event) { 
    if(event) {
      this.incomeFormDataFromPersonalLoan = event;
    this.otherIncomeFormdata.incomeFormDataFromPersonalLoan = event;
    this.otherIncomeFormdata.computeData();
    }
  }
/**<-----(end) emit compute details to personal loan (personal details)(end)----> */

/**<-----(start) load form data of self-employment (initdata)(start)-----> */
  loadEmployeemetSelfEmployeeForm() {    
    return this._FormBuilder.group({
      pemploymenttype: ['Self Employed'],
      pnameoftheorganization: [''],
      pEnterpriseType: [''],
      pemploymentrole: [''],
      pofficeaddress: [''],
      pofficephoneno: [''],
      preportingto: [''],
      pemployeeexp: [''],
      pemployeeexptype: ['Years'],
      ptotalworkexp: [''],
      pdateofestablishment: [new Date()],
      pdateofcommencement: [new Date()],
      pgstinno: [''],
      pcinno: [''],
      pdinno: [''],
      precordid: [0],
      ptradelicenseno: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this.forUpdate ? 'UPDATE' : 'CREATE']
    })
  }
/**<-----(end) load form data of self-employment (initdata)(end)-----> */

/**<-----(start) load form data of employment (initdata)(start)-----> */
  loadEmploymentInitData() {
    this.formValidationMessages = {};
    this.employeemetForm = this.loadEmployeemetForm();
    this.showEmployedDetails = true;
    this.showSelfEmployedDetails = false;
    this.experenceDisplayName = 'Enter Total Work experience in years';
    this.BlurEventAllControll(this.employeemetForm);
  }
/**<-----(end) load form data of employment (initdata)(end)-----> */

}

