import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { CommonService } from 'src/app/Services/common.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-selectsubscriber',
  templateUrl: './selectsubscriber.component.html',
  styles: []
})
export class SelectsubscriberComponent implements OnInit {
  contactSelectForm: FormGroup;
  showContactsGrid = false;
  formValidationMessages: any = {};
  contactsSelected: any = [];
  controltype:any;
  dropDownControlName: any = '';
  pageeventstatus: any = false;
  controleventstatus: any = false;
  contactsList: any = [];
  dropDownDataSearchLength: any = 2;
  @Input() formName: any;
  @Input() controlName: any;
  @Output() returnedData1 = new EventEmitter();
  constructor(private _commonService: CommonService, private _FormBuilder: FormBuilder,private _contacmasterservice: ContacmasterService) { }

  ngOnInit() 
  {
    let formname = this.formName;
    this.contactSelectForm = this._FormBuilder.group({
      contactid: [null],
      contacttype: [''],
      contactreferenceid: [''],
      contactmobilenumber: [''],
      contactemailid: [''],
      contactname: ['', Validators.required],
      ptypeofoperation:['']
    });
   this.GetContactsList();
    this.BlurEventAllControll(this.contactSelectForm);

    if(this.formName=="Removal Notice"){
      this.contactSelectForm.controls.contactname.clearValidators();
      this.contactSelectForm.controls.contactname.updateValueAndValidity();
    }
  }

BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Contact Select', 'BlurEventAllControll', error);

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
    catch (error) {
      //this._commonService.exceptionHandlingMessages('Contact Select', 'setBlurEvent', error);

      return false;
    }



  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Contact Select', 'checkValidations', error);

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

          // this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Contact Select', 'GetValidationByControl', error);

      return false;
    }
    return isValid;
  }

  dropDownsHideShow(dropdownname) {

    try {
      this.dropDownControlName = dropdownname;
      this.controleventstatus = true;
      this.pageeventstatus = false;
    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'dropDownsHideShow', error);
    }
  }
  customSearchFn(term: string, item: any) {
    
    console.log(item)
    term = term.toLowerCase();
    if (isNullOrEmptyString(item.contactmobilenumber)) {
      return item.contactname.toLowerCase().indexOf(term) > -1 || item.contactemailid.toLowerCase().indexOf(term) > -1 ;
    }
    else {
      return item.contactname.toLowerCase().indexOf(term) > -1 || item.contactemailid.toLowerCase().indexOf(term) > -1 || item.contactmobilenumber.toString().toLowerCase().indexOf(term) > -1;
    }
    
  }
  filterContactGrid(event) {
    debugger;
    try {
      const val = event.target.value.toLowerCase();

      // let contactname = this.subscriberForm.controls.contactname.value;
      console.log(val);
      this.showContactsGrid = false;
      this.contactSelectForm.controls.contactid.setValue('');
      if (parseInt(val.length) > parseInt(this.dropDownDataSearchLength)) {
        this.showContactsGrid = true;
        /*friday*/
       this.GetSubscriberContactDetails(val.toUpperCase());
      }
      else {
        this.contactsList = [];
        this.contactSelectForm.controls.contactid.setValue(this.contactsList);
      }
      //if(event.target.value=="" && this.formName=="Removal Notice"){
      //  this._noticeservice.clearContactdata.emit();
      //}
    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'filterContactGrid', error);
    }
  }

  hideShowDropDownGrids() {
    try {
      this.showContactsGrid = false;
      if (this.pageeventstatus == false) {
        if (this.dropDownControlName == 'Contact')
          this.showContactsGrid = true;
      }
    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'hideShowDropDownGrids', error);
    }

  }

  /*friday*/
  GetContactsList() {
    try {
      debugger;
      this._contacmasterservice.GetContactsList().subscribe(json => {
        debugger;
        try {
          if (json != null) {
            this.contactsList = json;

          }
        }
        catch (error) {
          //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
        }
      },
        (error) => {

          this._commonService.showErrorMessage(error);
        });
    }
    catch (error) {
      //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
    }
  }
  GetSubscriberContactDetails(Type) {
    try {
      debugger;
      this._contacmasterservice.GetSubContactdetails(Type).subscribe(json => {
        debugger;
        try {
          if (json != null) {
            this.contactsList = json;

          }
        }
        catch (error) {
          //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
        }
      },
        (error) => {

          this._commonService.showErrorMessage(error);
        });
    }
    catch (error) {
      //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
    }
  }
// ContactGridRowSelect({ selected }) {
//     debugger;
//     try {

//       this.contactSelectForm.controls.contactid.setValue(selected[0].contactid);
//       this.contactSelectForm.controls.contacttype.setValue(selected[0].contacttype);
//       this.contactSelectForm.controls.contactreferenceid.setValue(selected[0].contactreferenceid);
//       this.contactSelectForm.controls.contactname.setValue(selected[0].contactname);
//       this.contactSelectForm.controls.contactmobilenumber.setValue(selected[0].contactmobilenumber);
//       this.contactSelectForm.controls.contactemailid.setValue(selected[0].contactemailid);
//       this.pageeventstatus = false;
//       this.hideShowDropDownGrids();
//      // this.returnedData.emit(selected[0].contactid);
     
//      if (this.formName == 'Contact Master')
// //alert(this.contactSelectForm.controls.contacttype.value);
//      //let data={"pcontactid":this.contactSelectForm.controls.contactid.value,"Pcontacttype":this.contactSelectForm.controls.contacttype.value}
//      this.returnedData1.emit(this.contactSelectForm.value);
//     // if (this.formName == 'Chit Receipt')
//     //    this._commonService.getContactInformationEvent.emit();
//     //    else
//     //    this._commonService.getContactAddressEvent.emit();
//     //if(this.formName=='Removal Notice')
//     //this._noticeservice.getRemovalNoticeDataSearch.emit();
//     }
//     catch (error) {
//      // this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'ContactGridRowSelect', error);
//     }
//   }

ContactGridRowSelect(event) {
  debugger;
  try {
 if(event){
   
    this.contactSelectForm.controls.contacttype.setValue(event.contacttype);
    this.contactSelectForm.controls.contactreferenceid.setValue(event.contactreferenceid);
    this.contactSelectForm.controls.contactname.setValue(event.contactname);
    this.contactSelectForm.controls.contactmobilenumber.setValue(event.contactmobilenumber);
    this.contactSelectForm.controls.contactemailid.setValue(event.contactemailid);
    this.pageeventstatus = false;
    this.hideShowDropDownGrids();
   // this.returnedData.emit(selected[0].contactid);
   
   if (this.formName == 'Contact Master')
//alert(this.contactSelectForm.controls.contacttype.value);
   //let data={"pcontactid":this.contactSelectForm.controls.contactid.value,"Pcontacttype":this.contactSelectForm.controls.contacttype.value}
   this.returnedData1.emit(this.contactSelectForm.value);
  // if (this.formName == 'Chit Receipt')
  //    this._commonService.getContactInformationEvent.emit();
  //    else
  //    this._commonService.getContactAddressEvent.emit();
  //if(this.formName=='Removal Notice')
  //this._noticeservice.getRemovalNoticeDataSearch.emit();
  }else{
     this.clearContact();
     this.returnedData1.emit(null);
}
  }
  catch (error) {
   // this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'ContactGridRowSelect', error);
  }
}

validateContact(): boolean {
  let isValid = true;
  isValid = this.checkValidations(this.contactSelectForm, isValid);
  return isValid;
}
clearContact()
{
  this.ngOnInit();
  this.contactsSelected=[];
}
}