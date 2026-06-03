import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../../Services/common.service';
import { FIIndividualService } from '../../../../../Services/Loans/Transactions/fiindividual.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ContacmasterService } from '../../../../../Services/Loans/Masters/contacmaster.service';
import { iif } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-fi-personaldetails-employment',
  templateUrl: './fi-personaldetails-employment.component.html',
  styles: []
})
export class FiPersonaldetailsEmploymentComponent implements OnInit {
  
  @Input() typeOfEmployement: string;
  @Output() enteredEmploeeData = new EventEmitter();
  @Input() showEmployeement : any;

  pemploymenttype: any;

  lstApplicantsandothers: any;
  employeemetForm: FormGroup;
  formValidationMessages: any;
  showEmployedDetails = true;
  showSelfEmployedDetails = false;
  natureofOrganizationList: any;
  employementRoleList: any;
  forUpdate: boolean = false;
  experenceDisplayName = 'Total Work experience in years';
  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pdateofcommencementConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  totalworkexperience: any;
  currentcompanyexperience: any;
  experiencemode: any;

  constructor(private _FormBuilder: FormBuilder,private datePipe: DatePipe, private _commonService: CommonService, private _FIIndividualService: FIIndividualService, private _ContacmasterService: ContacmasterService) {

    this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
    this.pdateofestablishmentConfig.showWeekNumbers = false;
    this.pdateofestablishmentConfig.maxDate = new Date();
    this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pdateofcommencementConfig.containerClass = 'theme-dark-blue';
    this.pdateofcommencementConfig.showWeekNumbers = false;
    //this.pdateofcommencementConfig.maxDate = new Date();
    this.pdateofcommencementConfig.dateInputFormat = 'DD/MM/YYYY';

  }

  ngOnInit() {
    
    this.formValidationMessages = {};
    this.employeemetForm = this.loadEmployeemetForm();

    this.getEmployementRoleList();
    this.getNatureofOrganizationList();
    this.showEmployedDetails = true;
    this.showSelfEmployedDetails = false;
    this.experenceDisplayName = 'Total Work experience in years';

    this.BlurEventAllControll(this.employeemetForm)
  }
  clearForm() {
    this.employeemetForm.reset();
    this.formValidationMessages = {};
    this.employeemetForm = this.loadEmployeemetForm();


  }
  onValueChange(event) {
    if(event) {
      this.employeemetForm.patchValue({
        pdateofcommencement : ''
      })
    }
  }
  loadInitData() {
    let date = new Date();
    this.employeemetForm['controls']['pdateofestablishment'].setValue(date);
    this.employeemetForm['controls']['pdateofcommencement'].setValue(date);
    this.employeemetForm['controls']['precordid'].setValue('0');
    this.employeemetForm['controls']['pemploymenttype'].setValue('Employed');
    this.employeemetForm['controls']['ptypeofoperation'].setValue(this.forUpdate ? 'UPDATE' : 'CREATE');
    this.employeemetForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
    this.employeemetForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
    this.employeemetForm['controls']['pnameoftheorganization'].setValue('');
    this.employeemetForm['controls']['pemploymentrole'].setValue('');
  }
  validateEmployeement(): boolean{
    let isValid = true;
    if (!this.employeemetForm.valid) {
      isValid = false;
    }
    return isValid;
  }

  /**<-----(start) get form data (start)-------> */
  getFormData(): any {
    let newdata;
    // try {
      if (this.validateEmployeement()) {
        return this.employeemetForm.value;
      }
      else {
        return null;
      }
    // }
    // catch (e) {
    //   this._commonService.showErrorMessage(e);
    // }
  }
  /**<-----(end) get form data (end)-------> */

  /**<-----(start) set form data (start)-------> */
  setFormData(formData) {
    // try {
        this.clearForm();
      if (formData) {
        
        this.employeemetForm.patchValue(formData);
        if (this.employeemetForm.controls.pemploymenttype.value.toUpperCase() == 'EMPLOYED') {
          this.showEmployedDetails = true;
          this.showSelfEmployedDetails = false;
          this.experenceDisplayName = 'Total Work experience in years';
        }
        else {
          this.showEmployedDetails = false;
          this.showSelfEmployedDetails = true;
          this.experenceDisplayName = 'Total Industry experience in years';
        }
      }
    // }
    // catch (e) {
    //   this._commonService.showErrorMessage(e);
    // }
  }
  /**<-----(end) set form data (end)-------> */
  Dateofcommencement()
  {
    debugger
    // if(event<this.employeemetForm.controls.pdateofestablishment.value)
    // {
    //   this.employeemetForm.controls.pdateofcommencement.setValue("");
    //   this._commonService.showWarningMessage("commencement date should not be less than establishment date")
    // }
    let commencementdate = this.datePipe.transform(new Date(this.employeemetForm.controls.pdateofcommencement.value), "dd-MMM-yyyy");
   
      let establishmentdate = this.datePipe.transform(new Date(this.employeemetForm.controls.pdateofestablishment.value), "dd-MMM-yyyy");
      if (establishmentdate > commencementdate) {
        this.employeemetForm.controls.pdateofcommencement.setValue(new Date);
      this._commonService.showWarningMessage("commencement date should not be less than establishment date")
      return;
    }
  }
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
  trackByFn(index, item) {
    return index; // or item.id
  }

/**<-----(start) get nature of Organization list from api(start)-------> */
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
/**<-----(end) get nature of Organization list from api(end)-------> */

/**<-----(start) get employment role list from api(start)-------> */
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
/**<-----(end) get employment role list from api(end)-------> */
  
/**<-----(start) changed employment radio button functionality(start)-------> */
    pemploymenttypeChange() {
    console.log("this.forUpdate : ",this.forUpdate);
    
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
/**<-----(end) changed employment radio button functionality(end)-------> */

  saveNatureofOrganization() {

  }
  saveEmployementRole() {

  }
  TotalWorkExp(event)
  {
    debugger;
    this.totalworkexperience=event.target.value*365;
    this.CheckExperience()
  }
  CurrentcompExp(event)
  {
    debugger;
    this.currentcompanyexperience=event.target.value;
   
    this.CheckExperience()
  }
  CheckExperience()
  {
    debugger;
    this.totalworkexperience=this.employeemetForm.controls.ptotalworkexp.value;
    this.currentcompanyexperience=this.employeemetForm.controls.pemployeeexp.value;
    this.experiencemode=this.employeemetForm.controls.pemployeeexptype.value
    if(!isNullOrUndefined(this.totalworkexperience) && 
    !isNullOrUndefined(this.currentcompanyexperience) && !isNullOrUndefined(this.experiencemode))
    {
      this.totalworkexperience=this.employeemetForm.controls.ptotalworkexp.value*365;
      if(this.experiencemode=="Years")
      {
        this.currentcompanyexperience=this.currentcompanyexperience*365
      }
      else{
        this.currentcompanyexperience=this.currentcompanyexperience*30
      }
      if(this.currentcompanyexperience>this.totalworkexperience)
      {
        this._commonService.showWarningMessage("current company experience should not be greater than total work experience");
        this.employeemetForm.controls.pemployeeexp.setValue("")
        
      }
    }
   
   
  }
  ExperienceMode(event)
  {
    debugger;
    this.experiencemode=event.target.value;
   
    this.CheckExperience()
  }
/**<-----(start) checking validations based on formgroup(start)-------> */
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
 /**<-----(end) checking validations based on formgroup(end)-------> */

}
