import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, Form } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-fi-personaldetails-otherincome',
  templateUrl: './fi-personaldetails-otherincome.component.html',
  styles: []
})
export class FiPersonaldetailsOtherincomeComponent implements OnInit {
  personalOtherIncomeDetailsIncomeForm:FormGroup;

  @Input() showIncome: any;
  @Input() incomeFormData:any;
  @Input() incomeFormDataFromPersonalLoan: any;

  otherIncomeGridData=[];

  otherincomeValidationErrors:any;
  dataOFCompute: any;

  previousData=0;
  NewData=0;

  colorBoolean: boolean = false;
  sourceNameFlag :boolean = true;

  constructor
  (private formbuilder: FormBuilder, 
    private _commonService: CommonService) { }

  ngOnInit() {
    this.otherincomeValidationErrors = {};
    this.personalOtherIncomeDetailsIncomeForm = this.formbuilder.group({
      pRefbankId: [0],
      pReferralId: [0],
      precordid: [0],
      psourcename: [''],
      pgrossannual: [''],
     
      pCreatedby: [this._commonService.pCreatedby],
    
      pStatusname: [this._commonService.pStatusname],
  
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    this.BlurEventAllControll(this.personalOtherIncomeDetailsIncomeForm);
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
          this.otherincomeValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.otherincomeValidationErrors[key] += errormessage + ' ';
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

  /**<-----(start) Add other income form data to grid(start)-------> */
  saveOtherincomedetail(){
    let isvalid = true;
    if(this.otherIncomeGridData.length > 0){
      for (let i = 0; i < this.otherIncomeGridData.length; i++) {
        if(this.otherIncomeGridData[i].psourcename == this.personalOtherIncomeDetailsIncomeForm.value.psourcename){
          this.sourceNameFlag =  false;
          break;
        }
      else{
        this.sourceNameFlag =  true;
      } 
      }
      console.log("this.otherIncomeGridData",this.otherIncomeGridData,this.sourceNameFlag);
  }
  else{
    this.sourceNameFlag =  true;
  }    
    if(this.personalOtherIncomeDetailsIncomeForm.value.psourcename) {
      this.otherincomeValidationErrors.psourcename = '';
      this.BlurEventAllControll(this.personalOtherIncomeDetailsIncomeForm);
      if((this.personalOtherIncomeDetailsIncomeForm.value.psourcename ||
        this.personalOtherIncomeDetailsIncomeForm.value.pgrossannual)) {
          if(this.sourceNameFlag) {
  
            this.personalOtherIncomeDetailsIncomeForm.value.pgrossannual = this.personalOtherIncomeDetailsIncomeForm.value.pgrossannual ? this._commonService.currencyformat(this.personalOtherIncomeDetailsIncomeForm.value.pgrossannual) : 0;
            this.otherIncomeGridData.push(this.personalOtherIncomeDetailsIncomeForm.value)
            this.personalOtherIncomeDetailsIncomeForm = this.formbuilder.group({
              pRefbankId: [0],
              pReferralId: [0],
              precordid: [0],
              psourcename: [''],
              pgrossannual: [''],
             
              pCreatedby: [this._commonService.pCreatedby],
            
              pStatusname: [this._commonService.pStatusname],
          
              ptypeofoperation: [this._commonService.ptypeofoperation]
            });
            this.BlurEventAllControll(this.personalOtherIncomeDetailsIncomeForm);
          }
          else{
              this._commonService.showWarningMessage("Source Name is already exist")
          }
    }
    this.computeData();
    }
    else {
      this.otherincomeValidationErrors.psourcename = 'Source name is required';
      this.BlurEventAllControll(this.personalOtherIncomeDetailsIncomeForm);
    }
}
  /**<-----(end) Add other income form data to grid(end)-------> */

  /**<-----(start) Remove one record from grid(start)-------> */
  public removeHandler({ dataItem }) {
  const index: number = this.otherIncomeGridData.indexOf(dataItem);
        if (index !== -1) {
          this.otherIncomeGridData.splice(index, 1);
        }
        this.computeData();
}
 /**<-----(end) Remove one record from grid(end)-------> */

  /**<-----(start) compute the Estimated Annual Savings functionality(start)-------> */
  computeData(){  
  let previousData = 0;
    for (let i = 0; i < this.otherIncomeGridData.length; i++) {      
     previousData = previousData + Number(((this.otherIncomeGridData[i].pgrossannual).toString()).replace(/,/g, "")) ;
   }
   if(this.incomeFormData) {
     this.dataOFCompute = 
     (Number(((this.incomeFormData.pnetannualincome).toString()).replace(/,/g, "")) - Number(((this.incomeFormData.paverageannualexpenses).toString()).replace(/,/g, "")))+Number(previousData);
        this.dataOFCompute = this.dataOFCompute ?  this._commonService.currencyformat(this.dataOFCompute) : 0;
   }   
   if(this.incomeFormDataFromPersonalLoan) {
    this.dataOFCompute = 
    (Number(((this.incomeFormDataFromPersonalLoan.pnetannualincome).toString()).replace(/,/g, "")) - Number(((this.incomeFormDataFromPersonalLoan.paverageannualexpenses).toString()).replace(/,/g, "")))+Number(previousData);
       this.dataOFCompute = this.dataOFCompute ?  this._commonService.currencyformat(this.dataOFCompute) : 0;
   }
   let tempData = JSON.parse(JSON.stringify(this.dataOFCompute));
   let tempDataWitoutCommas = tempData ? (tempData.toString()).replace(/,/g, "") : 0;
   if(tempDataWitoutCommas < 0) {
     this.colorBoolean = true;
   }
   else {
    this.colorBoolean = false;
   }
 return this.dataOFCompute;
}
  /**<-----(end) compute the Estimated Annual Savings functionality(end)-------> */

/**<-----(start) Source Name Change functionality(checking validations of source name)(start)-------> */
 onSourceNameChange() {
  if(this.personalOtherIncomeDetailsIncomeForm.value.psourcename) {
    this.otherincomeValidationErrors.psourcename = '';
  }
  else {
    this.otherincomeValidationErrors.psourcename = 'Source name is required';
  }
  this.BlurEventAllControll(this.personalOtherIncomeDetailsIncomeForm);
}
/**<-----(end) Source Name Change functionality(checking validations of source name)(end)-------> */

}
