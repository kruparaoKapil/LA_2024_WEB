import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';
import { CommonService } from 'src/app/Services/common.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styles: []
})
export class ApplicationFormComponent implements OnInit {
  fdaccountno: any;

  constructor(private _fb:FormBuilder,private _CommonService:CommonService,private memberenquiryservice:MembrEnquiryService) { }
  ApplicationForm:FormGroup;
  memberdetails:any=[]
  Applicationformvalidations={}
  ngOnInit() 
  {
    this.ApplicationForm=this._fb.group({
      pFdAccountNo:['',Validators.required],
      pMobileNo:[''],

    })

    this.memberenquiryservice.GetApplicationFdnames().subscribe(json=>{
      if(json)
      {
        console.log("json",json);
        this.memberdetails=json

        
      }
    })
this.BlurEventAllControll(this.ApplicationForm)
  }
MemberChanges(event)
{
  debugger;
  this.fdaccountno=btoa(event.pFdAccountNo.split('-')[0]);


}
customSearchFn(term: string, item: any) {
  debugger;
  console.log(item)
  term = term.toLowerCase();
  if (isNullOrEmptyString(item.pMobileNo)) {
    return item.pFdAccountNo.toLowerCase().indexOf(term) > -1  ;
  }
  else {
    return item.pFdAccountNo.toLowerCase().indexOf(term) > -1  || item.pMobileNo.toString().toLowerCase().indexOf(term) > -1;
  }
  
}
showdetails()
{
  let isValid = true;
  if(this.checkValidations(this.ApplicationForm, isValid))
  {
    window.open('/#/ApplicationFormReport?id='+this.fdaccountno)
  }
  
  
}
checkValidations(group: FormGroup, isValid: boolean): boolean {
  debugger
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
              this.Applicationformvalidations[key] = '';
              if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                  let lablename;
                  lablename = (document.getElementById(key) as HTMLInputElement).title;
                  let errormessage;
                  for (const errorkey in formcontrol.errors) {
                      if (errorkey) {
                          errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                          this.Applicationformvalidations[key] += errormessage + ' ';
                          isValid = false;
                      }
                  }
              }
          }
      }
  }
  catch (e) {
      // this.showErrorMessage(e);
      // return false;
  }
  return isValid;
}
showErrorMessage(errormsg: string) {
  this._CommonService.showErrorMessage(errormsg);
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
}
