import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CommonService } from '../../../../Services/common.service';
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any
@Component({
  selector: 'app-loan-facility',
  templateUrl: './loan-facility.component.html',
  styles: []
})
export class LoanFacilityComponent implements OnInit {
  loanFacilityform: FormGroup
  loanFacilityErrorMessages: any;
  Interestpayouts: any;
  savingConfigid: any;
  savingAccname: any;
  savebutton='Save & Continue';
  disablesavebutton=false;
  public loanyes: boolean = false;
  public loading = false;
  public lstageperiodtype = [
    {
      "periodtype": "Days"
    },
    {
      "periodtype": "Months"
    },
    {
      "periodtype": "Years"
    }
  ];
  
  constructor(private fb: FormBuilder, private _loanmasterservice: LoansmasterService, private _CommonService: CommonService, private _savingaccountconfigService: SavingaccountconfigService, private toaster: ToastrService) { }

  ngOnInit() {
    this.savebutton='Save & Continue';
    this.disablesavebutton=false;
    this.loanFacilityErrorMessages = {}
    this.loanFacilityform = this.fb.group({
      pEligiblepercentage: [''],
      pAgeperiod: [''],
      pAgeperiodtype: [''],
      pIsloanfacilityapplicable: [false],
      pModifiedby: [this._CommonService.pCreatedby],
      pCreatedby: [this._CommonService.pCreatedby],
      pSavingConfigid: [''],
      pSavingAccname: [''],
      ptypeofoperation: ['CREATE']
    })
 
    this.GetInterestPayout();
    this.BlurEventAllControll(this.loanFacilityform);
    this._savingaccountconfigService._FindingValidationsBetweenComponents().subscribe(() => {
      let IsValid = true;
      debugger;
      if (this.checkValidations(this.loanFacilityform, IsValid)) {
        let loanfacilityapplicable = this.loanFacilityform.controls.pIsloanfacilityapplicable.value;
        
        this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.loanFacilityform.value, "LoanFacility")
        this._savingaccountconfigService._setValidationStatus(true);
        this._savingaccountconfigService._set_RedirectFormname("");
        let str = "mandatorykyc"
      }
      else {
        let str = "loanfacility"
        this._savingaccountconfigService._setValidationStatus(false);
        this._savingaccountconfigService._set_RedirectFormname(str);
     
      


      }
    });
    let type = this._savingaccountconfigService.GetButtonClickType();
    if (type == "Edit") {
      debugger;
      let Edit_data = this._savingaccountconfigService.GetDatatableRowEditClick()
      let res = this._savingaccountconfigService.GetLoanFacilityData()
      if (res != null) {
        this.savingConfigid = Edit_data.savingAccountNameandCodelist.pSavingAccountid;
        this.savingAccname = Edit_data.savingAccountNameandCodelist.pSavingAccountname;
        this.loanFacilityform.controls.pEligiblepercentage.setValue(res.pEligiblepercentage);
        this.loanFacilityform.controls.pAgeperiod.setValue(res.pAgeperiod);
        this.loanFacilityform.controls.pAgeperiodtype.setValue(res.pAgeperiodtype == null ? "" : res.pAgeperiodtype);
        this.loanFacilityform.controls.pIsloanfacilityapplicable.setValue(res.pIsloanfacilityapplicable);
        this.loanFacilityform.controls.ptypeofoperation.setValue("UPDATE");
        if (res.pIsloanfacilityapplicable) {
          this.loanyes = true;
        }
        else {
          this.loanyes = false;
        }
        this.IsloanfacilityChange();
      }
    }
    this.GetAccountNameAndCode();
  }
  GetInterestPayout() {
    this._loanmasterservice._getLoanpayins().subscribe(json => {
      if (json) {
        this.Interestpayouts = json
      }
    });
  }
  IsloanfacilityChange() {
    debugger;
    let Isloanfacility = this.loanFacilityform.controls.pIsloanfacilityapplicable.value;
    if (Isloanfacility) {
      this.loanyes = true;
      this.loanFacilityform.controls.pEligiblepercentage.setValidators([Validators.required])
      this.loanFacilityform.controls.pAgeperiod.setValidators([Validators.required])
      this.loanFacilityform.controls.pAgeperiodtype.setValidators([Validators.required])

      this.loanFacilityform.controls.pEligiblepercentage.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiod.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiodtype.updateValueAndValidity()

  
    }
    else {
      this.loanyes = false;
      this.clearLoanfacility();
      this.loanFacilityform.controls.pEligiblepercentage.clearValidators()
      this.loanFacilityform.controls.pAgeperiod.clearValidators()
      this.loanFacilityform.controls.pAgeperiodtype.clearValidators()

      this.loanFacilityform.controls.pEligiblepercentage.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiod.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiodtype.updateValueAndValidity()
    }
    this.BlurEventAllControll(this.loanFacilityform);
    this.loanFacilityErrorMessages = {};
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
          this.loanFacilityErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.loanFacilityErrorMessages[key] += errormessage + ' ';
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
  }
  BlurEventAllControll(fromgroup: FormGroup) {

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
  nexttabclick() {



    debugger;
    let isValid = true
    if (this.checkValidations(this.loanFacilityform, isValid)) {
      this.loading = true;
      let loanfacilityapplicable = this.loanFacilityform.controls.pIsloanfacilityapplicable.value;
      this.loanFacilityform.controls.pSavingConfigid.setValue(this.savingConfigid);
      this.loanFacilityform.controls.pSavingAccname.setValue(this.savingAccname);
     
      
      let formdata = (this.loanFacilityform.value)
      let jsondata = JSON.stringify(formdata);
      this.savebutton='Processing';
      this.disablesavebutton=true;
      this._savingaccountconfigService.SaveLoanFacility(jsondata).subscribe(res => {
        this.loading = false;
        if (res) {
          this.savebutton='Save & Continue';
          this.disablesavebutton=false;
          this.loading = false;
          this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.loanFacilityform.value, "LoanFacility");
          this._savingaccountconfigService._setValidationStatus(true);
          let str = "mandatorykyc"

          $('.nav-item a[href="#' + str + '"]').tab('show');
        }
      }, err => {
        this.loading = false;
        this.savebutton='Save & Continue';
        this.disablesavebutton=false;
        this.toaster.error("Error while saving")
      });
      
    }
    else {
      this._savingaccountconfigService._setValidationStatus(false);
      let str = "LoanFacility"

      $('.nav-item a[href="#' + str + '"]').tab('show');

    }
  }

  public GetAccountNameAndCode() {
    this._savingaccountconfigService._GetAccountNameAndCode().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        debugger;
        //console.log("LoanDetails : ",res);
        this.savingConfigid = res.Accountconfigid;
        this.savingAccname = res.AccName;
        //console.log("res in master", res);

      }
    })
  }
  public clearLoanfacility() {
    this.loanyes = false;
    this.loanFacilityform.controls.pIsloanfacilityapplicable.setValue(false);
    this.loanFacilityform.controls.pEligiblepercentage.setValue('');
    this.loanFacilityform.controls.pAgeperiod.setValue('');
    this.loanFacilityform.controls.pAgeperiodtype.setValue('');
    this.loanFacilityErrorMessages = {};
      this.loanFacilityform.controls.pEligiblepercentage.clearValidators()
      this.loanFacilityform.controls.pAgeperiod.clearValidators()
      this.loanFacilityform.controls.pAgeperiodtype.clearValidators()

      this.loanFacilityform.controls.pEligiblepercentage.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiod.updateValueAndValidity()
      this.loanFacilityform.controls.pAgeperiodtype.updateValueAndValidity()
    this.savebutton='Save & Continue';
  }
}
