import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-fi-personaldetails-income',
  templateUrl: './fi-personaldetails-income.component.html',
  styles: []
})
export class FiPersonaldetailsIncomeComponent implements OnInit {

  @Input() showIncome: any;
  personalIncomeDetailsIncomeForm: FormGroup;
  personalIncomeDetailsIncomeValidationErrors: any;
  incomeValidationErrors: any;
  incomegridData=[];
  @Output() forComputeDetailsEmit = new EventEmitter();

  constructor(private formbuilder: FormBuilder, private _commonService: CommonService) { }

  ngOnInit() {
    this.GetFormgroupData();
    this.BlurEventAllControll(this.personalIncomeDetailsIncomeForm);
  }

  GetFormgroupData() {
    this.incomeValidationErrors = {};
    this.personalIncomeDetailsIncomeForm = this.formbuilder.group({
      pRefbankId: [0],
      pReferralId: [0],
      precordid: [0],
      pgrossannualincome: [''],
      pnetannualincome: [''],
      paverageannualexpenses: [''],
    
      pCreatedby: [this._commonService.pCreatedby],
  
      pStatusname: [this._commonService.pStatusname],
   
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    this.BlurEventAllControll(this.personalIncomeDetailsIncomeForm)
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
          this.incomeValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.incomeValidationErrors[key] += errormessage + ' ';
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

/**<-----(start) Set data to form(start)-------> */
setFormData(formData) {
    try {
      this.personalIncomeDetailsIncomeForm.reset();
      this.clearForm();
      if (formData) {
        formData.pgrossannualincome = this._commonService.currencyformat(formData.pgrossannualincome);
        formData.pnetannualincome = this._commonService.currencyformat(formData.pnetannualincome);
        formData.paverageannualexpenses = this._commonService.currencyformat(formData.paverageannualexpenses);

        this.personalIncomeDetailsIncomeForm.patchValue(formData);
        this.forComputeDetailsEmit.emit(this.personalIncomeDetailsIncomeForm.value);
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
/**<-----(end) Set data to form(end)-------> */

  clearForm() {
    this.personalIncomeDetailsIncomeForm.reset();
    this.GetFormgroupData();
  }

/**<-----(start)checking validation of entered gross annualincome value to net anuualincome value (start)-------> */
   enteredAnnualIncome(event) {
    let enteredValue = Number(((event.target.value).toString()).replace(/,/g, ""));
    let netAnnual = Number(((this.personalIncomeDetailsIncomeForm.value.pnetannualincome).toString()).replace(/,/g, ""));
    if(netAnnual) {
      if(enteredValue < netAnnual) {
        this.incomeValidationErrors.pgrossannualincome = "Please enter valid data";
        this._commonService.showWarningMessage("Gross Annual Income should be greater than Net Annual Income");
      }
      else {
        this.incomeValidationErrors.pgrossannualincome = '';
        this.incomeValidationErrors.pnetannualincome = '';
      }
    }
    this.forComputeDetailsEmit.emit(this.personalIncomeDetailsIncomeForm.value);
  }
/**<-----(end)checking validation of entered gross annualincome value to net anuualincome value (end)-------> */

/**<-----(start)checking validation of entered net annualincome value to gross anuualincome value (start)-------> */
  enteredNetAnnualIncome(event) {
    let enteredValue = Number(((event.target.value).toString()).replace(/,/g, ""));
    let grossAnnual = Number(((this.personalIncomeDetailsIncomeForm.value.pgrossannualincome).toString()).replace(/,/g, ""));
    if(grossAnnual) {
      if(enteredValue > grossAnnual) {
        //this.incomeValidationErrors.pnetannualincome = "Please enter valid data";
        this._commonService.showWarningMessage("Net Annual Income should be lessthan or Equal to Gross Annual Income");
        this.personalIncomeDetailsIncomeForm.controls.pnetannualincome.setValue('');
      }
      else {
        this.incomeValidationErrors.pgrossannualincome = '';
        this.incomeValidationErrors.pnetannualincome = '';
      }
    }
/**<-----(start)emit personal Income Details Income Form data to other income form(start)-------> */
    this.forComputeDetailsEmit.emit(this.personalIncomeDetailsIncomeForm.value);
/**<-----(end)emit personal Income Details Income Form data to other income form(end)-------> */

  }
/**<-----(end)checking validation of entered net annualincome value to gross anuualincome value (end)-------> */

/**<-----(start)emit average annual value to other income form(start)-------> */
onEnteredAverageAnnualExpenses() {    
    this.forComputeDetailsEmit.emit(this.personalIncomeDetailsIncomeForm.value);
  }
/**<-----(end)emit average annual value to other income form(end)-------> */

}
