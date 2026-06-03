import { Component,Input, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CookieService } from 'ngx-cookie-service';
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';

declare let $: any
@Component({
  selector: 'app-savings-name-code',
  templateUrl: './savings-name-code.component.html',
  styles: []
})
export class SavingsNameCodeComponent implements OnInit {
   @Input() accountid: any;
  Savingnamescodeform: FormGroup

  SavingNameandCodeErrorMessages: any;
  loanTypesData: any
  companyDetails: any
  checkAccountid: any
  buttontype: any
  savebutton='Save & Continue';
  disablesavebutton=false;
  accId: any
  ccode: string = ""
  bcode: string = ""
  accountCode: string
  accNameandCode: string
  submitted = false;
  public loading = false;

  SavingAccConfigNameDisable: Boolean
  SavingAccConfigcodeDisable: Boolean
  ClearButtonHideShowInEdit: Boolean
  SeriesDisable: Boolean
  constructor(private _CommonService: CommonService, private fb: FormBuilder, private _loanmasterservice: LoansmasterService, private _savingaccountconfigService: SavingaccountconfigService, private toaster: ToastrService,private ActRoute: ActivatedRoute) { }

  ngOnInit() {
    debugger;
    this.savebutton='Save & Continue';
    this.disablesavebutton=false;
      if (this.accountid) {
      debugger
      this.buttontype = this._savingaccountconfigService.GetButtonClickType();
    }
   else{
     this.buttontype='New';
   }
    this.loading = (this.buttontype != "New" && this.buttontype != undefined) ? true : false;
    this.SavingAccConfigNameDisable = false
    this.SavingAccConfigcodeDisable = false
    this.SeriesDisable = false

    this.SavingNameandCodeErrorMessages = {}
    this.Savingnamescodeform = this.fb.group({
      Accountconfigid:[0],
      pSavingAccountname: ['', [Validators.required]],
      pSavingAccountcode: ['', [Validators.required]],
      pCompanycode: [''],
      pBranchcode: [''],
      pSeries: ['00001', [Validators.required]],
      pSerieslength: ['5'],
      pStatusname: [''],
      pStatusid: [''],
      pSavingaccnamecode:[''],
      pModifiedby: [this._CommonService.pCreatedby],
      pCreatedby: [this._CommonService.pCreatedby],
      pCreateddate: [null],
      pSavingAccountid: [''],
      ptypeofoperation:['']
    })
    this.ClearButtonHideShowInEdit = true
    this.GetCompanyBranchDetails();
    this.BlurEventAllControll(this.Savingnamescodeform);
    this.GetSavingNameAndCodeDetails();
  }
  GetCompanyBranchDetails() {
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {
      debugger;
      this.companyDetails = json
      this.ccode = this.companyDetails[0].pEnterprisecode
      this.bcode = this.companyDetails[0].pBranchcode
      this.Savingnamescodeform.controls.pCompanycode.setValue(this.ccode)
      this.Savingnamescodeform.controls.pBranchcode.setValue(this.bcode)

    })
  }

  GetSavingNameAndCodeDetails() {
    if (this.buttontype != "New") {
      debugger;
      let res = this._savingaccountconfigService.GetDatatableRowEditClick()
      let Edit_data = this._savingaccountconfigService.GetDatatableRowEditClick()

      if (res != null) {
        this.SavingAccConfigNameDisable = true
        this.SavingAccConfigcodeDisable = true
        this.SeriesDisable = true
        this.ClearButtonHideShowInEdit = false
        this.Savingnamescodeform.controls.pSavingAccountid.setValue(res.savingAccountNameandCodelist.pSavingAccountid);
        this.Savingnamescodeform.controls.pSavingAccountname.setValue(res.savingAccountNameandCodelist.pSavingAccountname);
        this.Savingnamescodeform.controls.pSavingAccountcode.setValue(res.savingAccountNameandCodelist.pSavingAccountcode);
        this.Savingnamescodeform.controls.pSeries.setValue(res.savingAccountNameandCodelist.pSeries);
        this.accNameandCode = res.savingAccountNameandCodelist.pSavingaccnamecode;
        let data = { "AccName": res.savingAccountNameandCodelist.pSavingAccountname, "Accountcode": res.savingAccountNameandCodelist.pSavingAccountcode, "Accountnamecode": res.savingAccountNameandCodelist.pSavingaccnamecode, "Accountconfigid": res.savingAccountNameandCodelist.pSavingAccountid }
        this._savingaccountconfigService._SetAccountNameAndCodeToNextTab(data)
        this.Savingnamescodeform.controls.pCompanycode.setValue(res.pCompanycode);
        this.Savingnamescodeform.controls.pBranchcode.setValue(res.pBranchcode);
        this.Savingnamescodeform.controls.ptypeofoperation.setValue("UPDATE");
        this.loading = false;
        //$('.nav-item a').removeClass('disableTabs');
      }
    }
    else {
      this.Savingnamescodeform.controls.ptypeofoperation.setValue("CREATE");
      this.Savingnamescodeform.controls.pSavingAccountid.setValue(0);
    }
  }
  CheckAccountNameAndCodeDuplicate(checkparamtype): boolean {

    let isValid: boolean = true;
    let Accname = this.Savingnamescodeform.controls.pSavingAccountname.value;
    let AccCode = this.Savingnamescodeform.controls.pSavingAccountcode.value;
    let Series = this.Savingnamescodeform.controls.pSeries.value;
    let errormsg = "";
    this.accId = 0;
    this._savingaccountconfigService.checkAccNameandCodeDuplicates(Accname, AccCode, checkparamtype, this.accId).subscribe(count => {
      debugger;
      if (!count) {
        isValid = true;
      }
      else {
        errormsg = checkparamtype == "Accname" ? "Saving Account Name Already Exists" : "Saving Account Code Already Exists";
        this.toaster.info(errormsg);
        this.Savingnamescodeform.controls.pSavingAccountname.setValue('');
        this.Savingnamescodeform.controls.pSavingAccountcode.setValue('');
        this.accNameandCode = "";
        this.Savingnamescodeform.controls.pSavingaccnamecode.setValue('');
        isValid = false;
      }
    })
    return isValid;
  }
  GenerateSavingAccConfigCode(event) {
    debugger;
    let AccName = event.currentTarget.value;
    let SavingAccid=this.Savingnamescodeform.controls.Accountconfigid.value;
    let SavingAccCode=this.Savingnamescodeform.controls.pSavingAccountcode.value;
    this.accountCode = "";
    if(AccName!=''){
    this._savingaccountconfigService.CheckSavingNameCodeDuplicate(SavingAccid,AccName,SavingAccCode).subscribe(res=>{
      debugger;
      if(res.pSchemeCount==0){
          let tempdata = AccName.split(' ')
      for (var i = 0; i < tempdata.length; i++) {
        this.accountCode += tempdata[i].charAt(0)
      }
      this.Savingnamescodeform.controls.pSavingAccountcode.setValue(this.accountCode);
      this.accNameandCode = this.accountCode + this.ccode + this.bcode + this.Savingnamescodeform.controls.pSeries.value;
      this.Savingnamescodeform.controls.pSavingaccnamecode.setValue(this.accNameandCode);
      }
      else{
        this._CommonService.showWarningMessage('A/C Type Name Already Exists.')
        this.Savingnamescodeform.controls.pSavingAccountname.setValue("");
         this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
        this.SavingNameandCodeErrorMessages.pSavingAccountcode=null; 
        this.Savingnamescodeform.controls.pSeries.setValue('00001');
        this.accNameandCode = "";
      }
    })
    }
    else {
      this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
      this.Savingnamescodeform.controls.pSeries.setValue('00001');
      this.accNameandCode = "";
      this.Savingnamescodeform.controls.pSavingaccnamecode.setValue(this.accNameandCode);
    }
  }
  CheckLoanCodeDuplicate() {
    debugger;
     let accName=this.Savingnamescodeform.controls.pSavingAccountname.value;
     let SavingAccid=this.Savingnamescodeform.controls.Accountconfigid.value;
     let SavingAccCode=this.Savingnamescodeform.controls.pSavingAccountcode.value;
    if(SavingAccCode!=''){
    this._savingaccountconfigService.CheckSavingNameCodeDuplicate(SavingAccid,accName,SavingAccCode).subscribe(res=>{
       if(res.pSchemeCodeCount==0){
      this.accountCode = this.Savingnamescodeform.controls.pSavingAccountcode.value.toUpperCase() + this.ccode + this.bcode + this.Savingnamescodeform.controls.pSeries.value
      this.accNameandCode = this.accountCode;
      this.Savingnamescodeform.controls.pSavingaccnamecode.setValue(this.accNameandCode);
       }
       else{
         this._CommonService.showWarningMessage('A/C Type Code Already Exists.');
        this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
        this.Savingnamescodeform.controls.pSeries.setValue('00001');
        this.accNameandCode = "";
       }
    });
     }
     else{
        this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
        this.Savingnamescodeform.controls.pSeries.setValue('00001');
        this.accNameandCode = "";
      }
    
  }


  GenerateSeries(event) {
    debugger;
    let str = event.currentTarget.value
    if (str != "") {
      if(Number(str)<=0){
         this.Savingnamescodeform.controls.pSeries.setValue('');
         this.accNameandCode='';
        this._CommonService.showWarningMessage("Series should not be Zero");
        return;
      }
      if (this.Savingnamescodeform.controls.pSavingAccountname.value != "" && this.Savingnamescodeform.controls.pSavingAccountcode.value != "" ) {
        this.accNameandCode = this.Savingnamescodeform.controls.pSavingAccountcode.value + this.ccode + this.bcode + str
        this.accNameandCode = this.accNameandCode.toUpperCase();
        this.Savingnamescodeform.controls.pSerieslength.setValue(str.length)
        this.Savingnamescodeform.controls.pSavingaccnamecode.setValue(this.accNameandCode);
      }
     
    }
  }
  nexttabclick() {
   
    if (this.buttontype != "New") {
      let str = "savingconfig"

      $('.nav-item a[href="#' + str + '"]').tab('show');
    //  $('.nav-item a').removeClass('disableTabs');
    }
    else {
    let SavingAccountid;
    debugger;
    let isValid = true
    if (this.checkValidations(this.Savingnamescodeform, isValid)) {
     
     let SavingAccid=this.Savingnamescodeform.controls.Accountconfigid.value;
      let accName = this.Savingnamescodeform.controls.pSavingAccountname.value;
      let accCode = this.Savingnamescodeform.controls.pSavingAccountcode.value;
      this.accId = 0;
      let checkparamtype = "Accname";
      let errormsg;
      this._savingaccountconfigService.CheckSavingNameCodeDuplicate(SavingAccid,accName,accCode).subscribe(count => {
        debugger;
        if (count.pSchemeCount==0 && count.pSchemeCodeCount==0) {
          let formdata = this.Savingnamescodeform.value;
          let Jsondata = JSON.stringify(formdata);
           this.loading = true;
          this.savebutton='Processing';
          this.disablesavebutton=true;
          this._savingaccountconfigService.saveAccountConfigNameAndCode(formdata).subscribe(res => {
            debugger;
            SavingAccountid = res;
            this.savebutton='Save & Continue';
            this.disablesavebutton=false;
            if (SavingAccountid != 0) {
              let data = { "AccName": accName, "Accountcode": accCode, "Accountnamecode": this.accNameandCode, "Accountconfigid": SavingAccountid }
              this._savingaccountconfigService._SetAccountNameAndCodeToNextTab(data)
              this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.Savingnamescodeform.value, "Accountnamecode");
              this._savingaccountconfigService._setValidationStatus(true);
              let str = "savingconfig"

              $('.nav-item a[href="#' + str + '"]').tab('show');
              //$('.nav-item a').removeClass('disableTabs');
            }

          }, err => {
            this.loading = false;
            this.disablesavebutton=false;
            this.savebutton='Save & Continue';
            this.toaster.error("Error while saving")
          });
        }
        else{
          if(Number(count.pSchemeCodeCount)!=0){
             this._CommonService.showWarningMessage('A/C Type Code Already Exists.');
             this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
             this.Savingnamescodeform.controls.pSeries.setValue('00001');
             this.accNameandCode = "";
          }
          else if(Number(count.pSchemeCount)!=0){
               this._CommonService.showWarningMessage('A/C Type Name Already Exists.')
               this.Savingnamescodeform.controls.pSavingAccountname.setValue("");
               this.SavingNameandCodeErrorMessages.pSavingAccountcode=null;
               this.Savingnamescodeform.controls.pSavingAccountcode.setValue("");
               this.Savingnamescodeform.controls.pSeries.setValue('00001');
               this.accNameandCode = "";
           }
        }
       
      })

     
    }
    else {
      this._savingaccountconfigService._setValidationStatus(false);
      let str = "savingnameandcode"

      $('.nav-item a[href="#' + str + '"]').tab('show');

    }
  }

  }
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
          this.SavingNameandCodeErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.SavingNameandCodeErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  } BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
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
      this._CommonService.showErrorMessage(e);
      return false;
    }



  }

  clearNameandCode() {
    this.savebutton='Save & Continue';
    this.disablesavebutton=false;
    this.Savingnamescodeform.controls.pSavingAccountname.setValue('');
    this.Savingnamescodeform.controls.pSavingAccountcode.setValue('');
    this.Savingnamescodeform.controls.pSeries.setValue('00001');
    this.accNameandCode = "";
    this.SavingNameandCodeErrorMessages = {};
  }
}
