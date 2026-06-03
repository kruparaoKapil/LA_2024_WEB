import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-fi-personaldetails-education',
  templateUrl: './fi-personaldetails-education.component.html',
  styles: []
})
export class FiPersonaldetailsEducationComponent implements OnInit {
  personEducationDetailsForm:FormGroup;

  @Input() showEducation: any;

  educationValidationErrors: any;

  constructor(
    private formbuilder: FormBuilder, 
    private _commonService: CommonService) { }

  ngOnInit() {
    this.loadInitData();
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
          this.educationValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.educationValidationErrors[key] += errormessage + ' ';
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

  validateFamily(): boolean {
    let isValid = true;
    isValid = this.checkValidations(this.personEducationDetailsForm, isValid);
    return isValid;
  }
  /**<-----(start) get education form details from form(start)-------> */
  getFormData(): any {
    if (this.validateFamily()) {
      return this.personEducationDetailsForm.value;
    }
    else {
      return null;
    }
  }
  /**<-----(end) get education form details from form(end)-------> */

  /**<-----(start) set education form details from form(start)-------> */
    setFormData(formData) {
    try {
      this.personEducationDetailsForm.reset();
      this.clearForm();
      if (formData) {
        this.personEducationDetailsForm.patchValue(formData);
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  /**<-----(end) set education form details from form(end)-------> */

  clearForm() {
    this.personEducationDetailsForm.reset();
    this.loadInitData();
  }

  loadInitData() {
    this.educationValidationErrors = {};
    this.personEducationDetailsForm = this.formbuilder.group({
      pRefbankId: [0],
      pReferralId: [0],
      pqualification: [''],
      pnameofthecourseorprofession: [''],
      poccupation: [''],
    
      pCreatedby: [this._commonService.pCreatedby],
  
      pStatusname: [this._commonService.pStatusname],
   
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    this.BlurEventAllControll(this.personEducationDetailsForm)
  }
}
