import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../Services/common.service';
import { FIIndividualService } from '../../../../../Services/Loans/Transactions/fiindividual.service';

@Component({
  selector: 'app-fi-personaldetails-family',
  templateUrl: './fi-personaldetails-family.component.html',
  styles: []
})
export class FiPersonaldetailsFamilyComponent implements OnInit {
  familyForm: FormGroup;

  @Input() showFamily: any;
    Familytotalmembers:any;
    FamilyEarningmembers:any;
  formValidationMessages: any;
  constructor(
    private _FormBuilder: FormBuilder, 
    private _commonService: CommonService, 
    private _FIIndividualService: FIIndividualService) { }

  ngOnInit() {
    this.formValidationMessages = {};
    this.familyForm = this._FormBuilder.group({
      precordid: [0],
      ptotalnoofmembers: [''],
      pnoofearningmembers: [''],
      pfamilytype: ['Joint Family'],
      pnoofboyschild: [''],
      pnoofgirlchild: [''],
      phouseownership: ['Owned'],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
    })
    this.BlurEventAllControll(this.familyForm);
  }
/**<-----(start) checking validations based on formgroup(start)-------> */
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
      return false;
    }
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
      return false;
    }
    return isValid;
  }
  /**<-----(end) checking validations based on formgroup(end)-------> */

  validateFamily(): boolean {
    let isValid = true;
    isValid = this.checkValidations(this.familyForm, isValid);
    return isValid;
  }

  Earningmembers(event)
  {
    debugger;
    this.FamilyEarningmembers=event.target.value;
    this.CheckMembers()
  }
  CheckMembers()
  {
    if(this.Familytotalmembers!="" && this.Familytotalmembers!=null && 
    this.FamilyEarningmembers!="" && this.FamilyEarningmembers!+null)
    {
       if(this.Familytotalmembers<this.FamilyEarningmembers)
       {
         this._commonService.showWarningMessage("earning members should not be more than total number of members in a family");
         this.familyForm.controls.pnoofearningmembers.setValue("")
        //  this.FamilyEarningmembers="";
        //  this.Familytotalmembers=""
       }
    }
  }
  Totalmembers(event)
  {
    debugger;
    this.Familytotalmembers=event.target.value;
    this.CheckMembers()
  }
/**<-----(start) Get form data(start)-------> */
  getFormData(): any {
    if (this.validateFamily()) {
      return this.familyForm.value;
    }
    else {
      return null;
    }
  }
/**<-----(end) Get form data(end)-------> */

  clearForm() {
    this.familyForm.reset();
    this.formValidationMessages = {};
    this.familyForm = this.loadInitData();
  }

/**<-----(start) Set form data(start)-------> */
  setFormData(formData) {
    debugger;
    try {
      this.clearForm();
      if (formData) {
        this.familyForm.patchValue(formData);
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
/**<-----(end) Set form data(end)-------> */

 loadInitData() {
   return this._FormBuilder.group({
    precordid: [0],
    ptotalnoofmembers: [''],
    pnoofearningmembers: [''],
    pfamilytype: ['Joint Family'],
    pnoofboyschild: [''],
    pnoofgirlchild: [''],
    phouseownership: ['Owned'],
    pCreatedby: [this._commonService.pCreatedby],
    pStatusname: [this._commonService.pStatusname],
    ptypeofoperation: [this._commonService.ptypeofoperation],
  })
 }
}
