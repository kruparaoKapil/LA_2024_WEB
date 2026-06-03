import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-fi-personaldetails-business',
  templateUrl: './fi-personaldetails-business.component.html',
  styles: []
})
export class FiPersonaldetailsBusinessComponent implements OnInit {
  
  businessActivityForm:FormGroup;

  businessActivityErrorMessage: any;

  @Input() showBusinessActivity: any;

  businessActivityGriddata=[];

  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pdateofcommencementConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();


  constructor(
    private formbuilder: FormBuilder,
    private _commonService: CommonService) { 
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
    
    this.businessActivityErrorMessage={};
    this.businessActivityForm = this.formbuilder.group({
      pbusinessactivity: [''],
      pestablishmentdate : [''],
      pcommencementdate : [''],
      pcinnumber : [''],
      pgstinno : [''],
      pCreatedby: [this._commonService.pCreatedby],
  
      pStatusname: [this._commonService.pStatusname],
   
      ptypeofoperation: [this._commonService.ptypeofoperation]
    
    })
  
    this.BlurEventAllControll(this.businessActivityForm);

  }
/**<-----(start) checking validations based on formgroup(start)-------> */
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
          this.businessActivityErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.businessActivityErrorMessage[key] += errormessage + ' ';
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
/**<-----(end) checking validations based on formgroup(end)-------> */

/**<-----(start) saving business activity details (start)-------> */
saveBusinessActivityDetails(){
    let isvalid = true;
    if (this.checkValidations(this.businessActivityForm, isvalid)) {
      this.businessActivityForm.value.pCreatedby = this._commonService.pCreatedby;
     this.businessActivityGriddata.push(this.businessActivityForm.value)

    }
  }
/**<-----(end) saving business activity details (end)-------> */

/**<-----(start) set business activity details to form(start)-------> */
  setFormData(formData) { 
    try {
      this.clearForm();
      
      if (formData) {
        this.businessActivityForm.patchValue(formData);
    }
  }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
    
  }
/**<-----(end) set business activity details to form(end)-------> */

  clearForm() {
    this.businessActivityForm.reset();
    this.businessActivityErrorMessage = {};
  }

  onValueChange(event) {
    if(event) {
      this.businessActivityForm.patchValue({
        pcommencementdate : ''
      })
    }
  }
}
