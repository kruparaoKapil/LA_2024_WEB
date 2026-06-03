import { Component,Input,OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CommonService } from '../../../../Services/common.service';
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
declare let $: any
@Component({
  selector: 'app-referral-commission',
  templateUrl: './referral-commission.component.html',
  styles: []
})
export class ReferralCommissionComponent implements OnInit {
  @Input() accountid:any;
  ReferralCommissionform: FormGroup
  ReferralCommissionErrorMessages: any
  public loading = false;
  tdsshow = false;
  button = 'Save';
  disablesavebutton=false;
  SavingConfigid: any;
  buttontype:any;
  SavingAccname: any;
   public TDSsectiondetails: any;
  public loanyes: boolean = false;
  constructor(private fb: FormBuilder, private _loanmasterservice: LoansmasterService, private _CommonService: CommonService, private _savingaccountconfigService: SavingaccountconfigService, private router: Router, private toaster: ToastrService, private _TdsService: TdsdetailsService) { }

  ngOnInit() {
    this.loading = false;
    this.buttontype='';
    this.disablesavebutton=false;
    this.button='Save';
    this.ReferralCommissionErrorMessages = {}
    this.ReferralCommissionform = this.fb.group({
      pIsreferralcommissionapplicable: [false],
      pIstdsapplicable: [false],
      pReferralcommissioncalfield: [''],
      pReferralcommissiontype:     [''],
      pCommissionValue: [''],
      pSavingConfigid: [''],
      pSavingAccname: [''],
      ptypeofoperation: ['CREATE'],
      ptdssection: [''],

      pModifiedby: [this._CommonService.pCreatedby],
      pCreatedby: [this._CommonService.pCreatedby],
      

     
    })
    this.BlurEventAllControll(this.ReferralCommissionform);
    //this.ReferralCommissionform.controls.pReferralcommissioncalfield.setValue('Number of saving a/c');
    this.ReferralCommissionform.controls.pReferralcommissiontype.setValue("Fixed");

    this.DataBindingToEdit();
    this.GetAccountNameAndCode();
    this.getTDSsectiondetails();
  }
  getTDSsectiondetails(): void {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
        }
      },
      (error) => {

        this._CommonService.showErrorMessage(error);
      }
    );
  }
  DataBindingToEdit() {
  debugger;
  if(this.accountid){
       this.buttontype = this._savingaccountconfigService.GetButtonClickType()
  }
  else{
    this.buttontype='New';
  }
  
    if (this.buttontype != "New") {

      let res = this._savingaccountconfigService.GetReferralCommissioData()
      console.log(res)
      
      let Edit_data = this._savingaccountconfigService.GetDatatableRowEditClick()
      if(Edit_data){
      this.ReferralCommissionform.controls.ptypeofoperation.setValue('UPDATE')
      this.SavingConfigid = Edit_data.savingAccountNameandCodelist.pSavingAccountid;
      this.SavingAccname = Edit_data.savingAccountNameandCodelist.pSavingAccountname;
      }
      debugger;
      if (res.pSavingConfigid!=0) {
        this.ReferralCommissionform.controls.pIsreferralcommissionapplicable.setValue(res.pIsreferralcommissionapplicable);
        this.loanyes = true;
        this.ReferralCommissionform.controls.pReferralcommissioncalfield.setValue(res.pReferralcommissioncalfield);

        this.ReferralCommissionform.controls.pReferralcommissiontype.setValue(res.pReferralcommissiontype);
        if(res.pCommissionValue!='' && res.pCommissionValue!= '0'){
        let commisionvalue=this._CommonService.currencyformat(res.pCommissionValue);
        this.ReferralCommissionform.controls.pCommissionValue.setValue(commisionvalue);
        }
        if (res.pIstdsapplicable) {
          this.tdsshow = true;
        }
        else {
          this.tdsshow = false;
        }
        this.referralCommissionChange();
        this.ReferralCommissionform.controls.pIstdsapplicable.setValue(res.pIstdsapplicable);
        this.ReferralCommissionform.controls.ptdssection.setValue(res.ptdssection);

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
          this.ReferralCommissionErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ReferralCommissionErrorMessages[key] += errormessage + ' ';
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

  SaveAccountConfig() {
    debugger;

    let isValid = true

    if (this.checkValidations(this.ReferralCommissionform, isValid)) {


      this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.ReferralCommissionform.value, "ReferralCommissioLoan")

     // this._savingaccountconfigService._checkValidationsBetweenComponents();

      //let validationStatus = this._savingaccountconfigService._getValidationStatus();
      debugger;
      let formname = this._savingaccountconfigService._getRedirectFormname();
      if (isNullOrUndefined(formname) || isNullOrEmptyString(formname)) {
       
    let IsReferralCommission = this.ReferralCommissionform.controls.pIsreferralcommissionapplicable.value;
    if (IsReferralCommission) {
        let commisionval=this.ReferralCommissionform.controls.pCommissionValue.value;
                   
      commisionval = parseFloat(commisionval.toString().replace(/,/g, ""));
      if(commisionval<=0){
          this.ReferralCommissionform.controls.pCommissionValue.setValue('');
           this._CommonService.showWarningMessage('Commision Value Must be Greater Than Zero.');
           return;
      }
      this.ReferralCommissionform.controls.pCommissionValue.setValue(commisionval);
      
    }
        
        this.loading = true;
          this.button = 'Save';
         
          // console.log(Jsondata)
          let buttontype = this._savingaccountconfigService.GetButtonClickType()
          this.ReferralCommissionform.controls.pSavingConfigid.setValue(this.SavingConfigid)
          this.ReferralCommissionform.controls.pSavingAccname.setValue(this.SavingAccname)
          
         // this.ReferralCommissionform.controls.ptypeofoperation.setValue("CREATE")
          let FormData = (this.ReferralCommissionform.value);

          let Jsondata = JSON.stringify(FormData);
          this.button='Processing';
          this.disablesavebutton=true;
          let buttonstatus= this.ReferralCommissionform.controls.ptypeofoperation.value;
          this._savingaccountconfigService.SaveReferralCommission(Jsondata).subscribe(res => {

            if (res) {
              if(buttonstatus=='UPDATE'){
                  this._CommonService.showInfoMessage("Updated Successfully")
              }
              else{
                this._CommonService.showInfoMessage("Saved Successfully");
              }
              this._loanmasterservice.SetButtonClickType(undefined)
              this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
              this.ReferralCommissionform.reset()
              this.loading = false;
              this.button = 'Save';
              this.disablesavebutton=false;
              this.router.navigateByUrl("/SavingsView")
              //location.reload();
            }
          }, err => {
              this.loading = false;
              this.button='Save';
              this.disablesavebutton=false;
            this.toaster.error("Error while saving")
          });


       
      }
      else {
         $('.nav-item a[href="#' + formname + '"]').tab('show');
      }
     
    }


  }

  public GetAccountNameAndCode() {
    this._savingaccountconfigService._GetAccountNameAndCode().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        debugger;
        //console.log("LoanDetails : ",res);
        this.SavingConfigid = res.Accountconfigid;
        this.SavingAccname = res.AccName;
        //console.log("res in master", res);

      }
    })
  }

  public referralCommissionChange() {
    debugger;
    let IsReferralCommission = this.ReferralCommissionform.controls.pIsreferralcommissionapplicable.value;
    if (IsReferralCommission) {
      this.loanyes = true;
      //this.ReferralCommissionform.controls.pCommissionValue.setValue('');
      this.ReferralCommissionform.controls.pCommissionValue.setValidators([Validators.required]);
      this.ReferralCommissionform.controls.pCommissionValue.updateValueAndValidity();


    }
    else {
      this.loanyes = false;
      this.ReferralCommissionform.controls.pCommissionValue.clearValidators();
      this.ReferralCommissionform.controls.pCommissionValue.updateValueAndValidity();
      this.ReferralCommissionform.controls.pCommissionValue.setValue('');
      this.ReferralCommissionform.controls.pIstdsapplicable.setValue(false);
      this.tdsCheck();
    }
    this.BlurEventAllControll(this.ReferralCommissionform);
    this.ReferralCommissionErrorMessages = {};
  }
  public tdsCheck() {
    debugger;
    let tdssection = this.ReferralCommissionform.controls.pIstdsapplicable.value;
    if (tdssection) {
      this.ReferralCommissionform.controls.ptdssection.setValidators([Validators.required]);
      this.ReferralCommissionform.controls.ptdssection.updateValueAndValidity();
      this.tdsshow = true;
    }
    else {
      this.tdsshow = false;
      this.ReferralCommissionform.controls.ptdssection.clearValidators();
      this.ReferralCommissionform.controls.ptdssection.updateValueAndValidity();
      this.ReferralCommissionform.controls.ptdssection.setValue('');
    }
    this.BlurEventAllControll(this.ReferralCommissionform);
    this.ReferralCommissionErrorMessages = {};
  }
  clear()
  {
    debugger
    this.tdsshow=false;
    this.button='Save';
    this.disablesavebutton=false;
    this.ReferralCommissionform.controls.pIstdsapplicable.setValue(false);
    this.ReferralCommissionform.controls.pIsreferralcommissionapplicable.setValue(false);
    this.referralCommissionChange();
    this.tdsCheck();
    this.loanyes = false;
    
  }
}
