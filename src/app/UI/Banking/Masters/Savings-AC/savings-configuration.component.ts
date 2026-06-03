import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common'
import { CommonService } from '../../../../Services/common.service';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { ToastrService } from 'ngx-toastr';
import { State } from '@progress/kendo-data-query';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { debug } from 'util';
declare let $: any
@Component({
  selector: 'app-savings-configuration',
  templateUrl: './savings-configuration.component.html',
  styles: []
})
export class SavingsConfigurationComponent implements OnInit {
  SavingAccountConfigurationform: FormGroup
  MembertypeDetails: any
  ApplicantTypes: any;
  buttonsave='Save & Continue';
  disablesavebutton=false;
  Interestpayouts: any;
  public SavingConfigid: any;
  public SavingAccname: any;
  submitted = false;
  GridData: any = [];
  membertype: any = [];
  applicanttype: any = [];
  AccountConfigErrorMessages: any;
  public Issavingspayinapplicable: boolean = false;
  public Iswithdrawallimitapplicable: boolean = false;
  public ShowPenaltyvalue: boolean = false;
  public loading = false;
  public PenaltyDisable=false;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  constructor(private _CommonService: CommonService, private fb: FormBuilder, private _loanmasterservice: LoansmasterService, private _savingaccountconfigService: SavingaccountconfigService, private toaster: ToastrService) { }

  ngOnInit() {
    this.buttonsave='Save & Continue';
    this.disablesavebutton=false;
    this.PenaltyDisable=true;
    this.AccountConfigErrorMessages = {}
    this.SavingAccountConfigurationform = this.fb.group({
      pMembertypeid: [null, [Validators.required]],
      pMembertype: [''],
      pApplicanttype: ['', [Validators.required]],
      pMinopenamount: [0, [Validators.required]],
      pInterestpayout: ['', [Validators.required]],
      pInterestrate: [0, [Validators.required]],
      pMinbalance: [0, [Validators.required]],
      pSavingmindepositamount: [''],
      pSavingmaxdepositamount: [''],
      pPenaltyvalue: [''],
      pSavingspayinmode: [''],
      pMaxwithdrawllimit: [''],
      pIspenaltyapplicableonminbal:[false],
      pIswithdrawallimitapplicable: [false],
      pIssavingspayinapplicable: [false],
      pModifiedby: [this._CommonService.pCreatedby],
      pCreatedby:  [this._CommonService.pCreatedby],
      pCreateddate: [null],
      ptypeofoperation: [''],
      pSavingConfigid: [''],
      pSavingAccname: [''],
      pRecordid:[0]


    })
    this.GetAccountNameAndCode();
    this._CommonService.Getmemberdetails('member').subscribe(json => {
      debugger;
      if (json) {
        this.MembertypeDetails = json}
    });
    this.getApplicantTypes("Individual");
    this.GetInterestPayout();
    this.BlurEventAllControll(this.SavingAccountConfigurationform);
   

    let type = this._savingaccountconfigService.GetButtonClickType();
    if (type == "Edit") {
      debugger;
      let Edit_data = this._savingaccountconfigService.GetDatatableRowEditClick()
      this.SavingConfigid = Edit_data.savingAccountNameandCodelist.pSavingAccountid;
      this.SavingAccname = Edit_data.savingAccountNameandCodelist.pSavingAccountname;
      this.GridData = Edit_data.savingAccountConfiglist;
      let createdby = this._CommonService.pCreatedby;
      this.GridData.filter(function (Data) {
        Data.pCreatedby = createdby;
      });
    }
    
  }
  getApplicantTypes(type) {
    debugger;
    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type,0).subscribe(json => {
        if (json) {
          this.ApplicantTypes = json
        }
      })
    }
  }
  GetInterestPayout() {
  this._loanmasterservice._getLoanpayins().subscribe(json => {
    if (json) {
      this.Interestpayouts = json
    }
  });
  }
  trackByFn(index, item) {
    return index; // or item.id
  }

  AddDataToDataTable() {
    debugger;
     this.CheckMaxMinValues();
    if (this.validateAddSavingAccountConfiguration()) {
      this.SavingAccountConfigurationform.controls.ptypeofoperation.setValue("CREATE");
      if (this.membertype.length != 0 && this.applicanttype.length != 0) {
        this.membertype.reduce((acc, memberitem) => {
          for (let i = 0; i < this.applicanttype.length; i++) {
            debugger;
            const Checkexistcount = this.GridData.filter(s => s.pMembertype == memberitem.membertypename && s.pApplicanttype == this.applicanttype[i].applicanttype).length;
            if (Checkexistcount == 0) {
              this.SavingAccountConfigurationform.controls.pMembertypeid.setValue(memberitem.membertypeid);
              this.SavingAccountConfigurationform.controls.pMembertype.setValue(memberitem.membertypename);

              this.SavingAccountConfigurationform.controls.pApplicanttype.setValue(this.applicanttype[i].applicanttype);
              this.GridData.push(this.SavingAccountConfigurationform.value);
              this.GridData.filter(row=>{
                 if(row.pMinopenamount){
                row.pMinopenamount=this._CommonService.removeCommasForEntredNumber(row.pMinopenamount);
                 }
                 if(row.pMinbalance){
                row.pMinbalance=this._CommonService.removeCommasForEntredNumber(row.pMinbalance);
                 }
                if(row.pPenaltyvalue){
                row.pPenaltyvalue=this._CommonService.removeCommasForEntredNumber(row.pPenaltyvalue);
                }
                // row.pIssavingspayinapplicable=this._CommonService.removeCommasForEntredNumber(row.pIssavingspayinapplicable);
                // row.pSavingspayinmode=this._CommonService.removeCommasForEntredNumber(row.pSavingspayinmode);
                if(row.pSavingmindepositamount){
                row.pSavingmindepositamount=this._CommonService.removeCommasForEntredNumber(row.pSavingmindepositamount);
                }
                if(row.pSavingmaxdepositamount){
               row.pSavingmaxdepositamount=this._CommonService.removeCommasForEntredNumber(row.pSavingmaxdepositamount);
                }
                if(row.pMaxwithdrawllimit){
                row.pMaxwithdrawllimit=this._CommonService.removeCommasForEntredNumber(row.pMaxwithdrawllimit);
                }

              })
            }
            else {
              this._CommonService.showWarningMessage("Details already exists in grid.")
            }
          }
        }, []);

      }
    
      this.clearAccountConfiguration();
      this.IssavingspayinChange();
      this.IswithdrawallimitChange();
      this.IspenaltyapplicableChange();
    }
   
  }
  clearAccountConfiguration() {
    debugger;
    this.SavingAccountConfigurationform.reset();
    this.SavingAccountConfigurationform.controls.pMembertypeid.setValue(null);
    this.SavingAccountConfigurationform.controls.pMembertype.setValue('');
    this.SavingAccountConfigurationform.controls.pApplicanttype.setValue(null);
    this.SavingAccountConfigurationform.controls.pMinopenamount.setValue(0);
    this.SavingAccountConfigurationform.controls.pMinbalance.setValue(0);
    this.SavingAccountConfigurationform.controls.pInterestpayout.setValue('');
    this.SavingAccountConfigurationform.controls.pInterestrate.setValue(0);
    this.SavingAccountConfigurationform.controls.pModifiedby.setValue(this._CommonService.pCreatedby);
    this.SavingAccountConfigurationform.controls.pCreatedby.setValue(this._CommonService.pCreatedby);
    this.SavingAccountConfigurationform.controls.pRecordid.setValue(0);
    
     this.Issavingspayinapplicable = false;
  this.Iswithdrawallimitapplicable = false;
  this.ShowPenaltyvalue = false;
  this.PenaltyDisable=true;
    this.AccountConfigErrorMessages = {};
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
      debugger;
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.AccountConfigErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.AccountConfigErrorMessages[key] += errormessage + ' ';
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
  validateAddSavingAccountConfiguration(): boolean {
    
    let isValid: boolean = true;
    try {
      debugger;
      isValid = this.checkValidations(this.SavingAccountConfigurationform, isValid)
      //let membertype = this.SavingAccountConfigurationform.controls.pMembertype.value;
      //let Aplicanttype = this.SavingAccountConfigurationform.controls.pApplicanttype.value;
      //let count = 0;
      //for (let i = 0; i < this.GridData.length; i++) {
      //  if (this.GridData[i].pMembertype == membertype && this.GridData[i].pApplicanttype == Aplicanttype) {
      //    count = 1;
      //    break;
      //  }

      //}
      //if (count == 1) {
      //  this._CommonService.showWarningMessage('Member Type, Applicant Type  already exists in grid');
      //  isValid = false;
      //}
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    return isValid;
  }
  IssavingspayinChange() {
    debugger;
    let Issavingspayin = this.SavingAccountConfigurationform.controls.pIssavingspayinapplicable.value;
    if (Issavingspayin) {
      this.Issavingspayinapplicable = true;
      this.SavingAccountConfigurationform.controls.pSavingspayinmode.setValidators([Validators.required]);
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.setValidators([Validators.required]);
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.setValidators([Validators.required]);

      this.SavingAccountConfigurationform.controls.pSavingspayinmode.setValue('');
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.setValue('');
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.setValue('');

      this.SavingAccountConfigurationform.controls.pSavingspayinmode.updateValueAndValidity();
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.updateValueAndValidity();
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.updateValueAndValidity();
    }
    else {
      this.Issavingspayinapplicable = false;
      this.SavingAccountConfigurationform.controls.pIssavingspayinapplicable.setValue(false)
      this.SavingAccountConfigurationform.controls.pSavingspayinmode.clearValidators();
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.clearValidators();
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.clearValidators();
      this.SavingAccountConfigurationform.controls.pSavingspayinmode.setValue('');
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.setValue('');
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.setValue('');
      this.SavingAccountConfigurationform.controls.pSavingspayinmode.updateValueAndValidity();
      this.SavingAccountConfigurationform.controls.pSavingmindepositamount.updateValueAndValidity();
      this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.updateValueAndValidity();
    }
    this.BlurEventAllControll(this.SavingAccountConfigurationform);
    this.AccountConfigErrorMessages = {};
  }
  IswithdrawallimitChange() {
    debugger
    let Iswithdrawallimit = this.SavingAccountConfigurationform.controls.pIswithdrawallimitapplicable.value;
    if (Iswithdrawallimit) {
      this.Iswithdrawallimitapplicable = true;
      this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.setValidators([Validators.required]);
    
      this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.setValue('');
     

      this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.updateValueAndValidity();
     
    }
    else {
      this.Iswithdrawallimitapplicable = false;
      this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.clearValidators();
       this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.updateValueAndValidity();
      this.SavingAccountConfigurationform.controls.pIswithdrawallimitapplicable.setValue(false);
      this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.setValue('');
    
    }
    this.BlurEventAllControll(this.SavingAccountConfigurationform);
    this.AccountConfigErrorMessages = {};
  }
MaxWithdrawLimit_Change(){
  debugger;
  if(Number(this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.value)==0){
    this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.setValue('');
  }
  else{
    this.compareLimit();
  }
  
}
compareLimit(){
  let maxDepositAmount=0;
  let maxWithdrawalLimit=0;
  if(this.SavingAccountConfigurationform.controls.pIssavingspayinapplicable.value && this.SavingAccountConfigurationform.controls.pIswithdrawallimitapplicable.value){

   maxDepositAmount=this._CommonService.removeCommasForEntredNumber(this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.value)
 
   maxWithdrawalLimit=this._CommonService.removeCommasForEntredNumber(this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.value);
  
  if(Number(maxWithdrawalLimit)>Number(maxDepositAmount)){
     this._CommonService.showWarningMessage('Maximum Withdrawal Amount per Day must be less than or equal to Max Deposit Amount.');
     this.SavingAccountConfigurationform.controls.pMaxwithdrawllimit.setValue('');
     return;
  }
  }
}
  validateSavingAccountConfiguration(): boolean {
    let isValid: boolean = true;
    debugger;
    try {
      if (this.GridData.length == 0) {
        this.checkValidations(this.SavingAccountConfigurationform, isValid)
        isValid = false;
      }
      else{
        isValid = true;
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    return isValid;
  }
  nexttabclick() {


   
    debugger;
   
   // let isValid = true
    if (this.validateSavingAccountConfiguration()) {
      this.loading = true;
     
      //this.SavingAccountConfigurationform.controls.pSavingConfigid.setValue(this.SavingConfigid);
      //this.SavingAccountConfigurationform.controls.pSavingAccname.setValue(this.SavingAccname);
      let SavingConfigid = this.SavingConfigid;
      let SavingAccname = this.SavingAccname;
      this.GridData.filter(function (Data) { Data.pSavingConfigid = SavingConfigid; Data.pSavingAccname = SavingAccname; });
      let formdata = { pSavingAccountid: SavingConfigid, pSavingAccountname: SavingAccname, pCreatedby: this._CommonService.pCreatedby, savingAccountConfiglist: this.GridData }
      let jsondata = JSON.stringify(formdata);
      this.buttonsave='Processing';
      this.disablesavebutton=true;
      this._savingaccountconfigService.saveAccountConfig(jsondata).subscribe(res => {
        this.loading = false;
        if (res) {
          this.loading = false;
          this.buttonsave='Save & Continue';
          this.disablesavebutton=false;
          this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.GridData, "Accountconfiguration");
          this._savingaccountconfigService._setValidationStatus(true);
          let str = "loanfacility"

          $('.nav-item a[href="#' + str + '"]').tab('show');
        }
      }, err => {
        this.loading = false;
        this.buttonsave='Save & Continue';
        this.disablesavebutton=false;
        this.toaster.error("Error while saving")
      });
      
    }
    else {
      this._savingaccountconfigService._setValidationStatus(false);
      let str = "savingconfig"

      $('.nav-item a[href="#' + str + '"]').tab('show');

    }
  }
  
  public CheckMaxMinValues() {
    debugger;
    this.ValidateAmount();
    let minvalue = +this.SavingAccountConfigurationform.controls['pSavingmindepositamount'].value;
    let maxvalue = +this.SavingAccountConfigurationform.controls['pSavingmaxdepositamount'].value
    if (maxvalue < minvalue) {
      this._CommonService.showWarningMessage('Max Deposit Amount Must be Greater Than Min Deposit Amount')
      this.SavingAccountConfigurationform.controls['pSavingmaxdepositamount'].setValue('');
      return;
    }
    this.compareLimit();
  }
  MemberTypeChange($event) {
    debugger;
    this.membertype = []; 
    if ($event.length > 0) {
      $event.reduce((acc, item) => {
        this.membertype.push({ membertypeid: item.pmembertypeid, membertypename: item.pmembertype })
        }, []);
    //const MemberTypename = $event.target.options[$event.target.selectedIndex].text;
    //  this.SavingAccountConfigurationform.controls.pMembertype.setValue(MemberTypename);
    }
    console.log(this.membertype);
  }
  MinBalance_Change(){
    debugger;
    this.PenaltyDisable=true;
    if(this.SavingAccountConfigurationform.controls.pMinbalance.value)
    {
      this.AccountConfigErrorMessages.pMinbalance='';
      let minbalance=this._CommonService.removeCommasForEntredNumber(this.SavingAccountConfigurationform.controls.pMinbalance.value);
      if(Number(minbalance)>0){
        this.PenaltyDisable=false;
      }
      else{
        this.PenaltyDisable=true;
        this.SavingAccountConfigurationform.controls.pPenaltyvalue.setValue(0);
      }
    }
    else{
      this.AccountConfigErrorMessages.pMinbalance='Minimum Balance Required.';
       this.SavingAccountConfigurationform.controls.pPenaltyvalue.setValue(0);
    }
  }
  ApplicanttypeChange($event) {
    this.applicanttype = [];
    if ($event.length > 0) {
      $event.reduce((acc, item) => {
        this.applicanttype.push({ applicanttype: item.pApplicanttype })
      }, []);
     
    }
    console.log(this.applicanttype);
  }
  IspenaltyapplicableChange() {
    let Ispenalty = this.SavingAccountConfigurationform.controls.pIspenaltyapplicableonminbal.value;
    if (Ispenalty == true) {
      this.ShowPenaltyvalue = true;
      this.SavingAccountConfigurationform.controls.pPenaltyvalue.setValidators([Validators.required])
      this.SavingAccountConfigurationform.controls.pPenaltyvalue.updateValueAndValidity()
    }
    else {
      this.ShowPenaltyvalue = false;
      this.SavingAccountConfigurationform.controls.pIspenaltyapplicableonminbal.setValue(false);
      this.SavingAccountConfigurationform.controls.pPenaltyvalue.clearValidators()
      this.SavingAccountConfigurationform.controls.pPenaltyvalue.updateValueAndValidity()
      this.SavingAccountConfigurationform.controls.pPenaltyvalue.setValue('');
     
    }
    this.BlurEventAllControll(this.SavingAccountConfigurationform);
   
  }

  public removeHandler({ dataItem }) {

    const index: number = this.GridData.indexOf(dataItem);
    if (index !== -1) {
      this.GridData.splice(index, 1);
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
  public clearConfig() {
    this.clearAccountConfiguration();
    this.IspenaltyapplicableChange();
    this.IssavingspayinChange();
    this.IswithdrawallimitChange();
  }
  public clearConfigurationList() {
    this.GridData = [];
    this.clearAccountConfiguration();
    this.IspenaltyapplicableChange();
    this.IssavingspayinChange();
    this.IswithdrawallimitChange();
  }
  ValidateAmount(){
    debugger;
    let Minopenamount=this.SavingAccountConfigurationform.controls.pMinopenamount.value;
    if (isNullOrEmptyString(Minopenamount)) {
      Minopenamount = 0;
    }
    else {
     Minopenamount=this._CommonService.removeCommasForEntredNumber(Minopenamount);
    }
    let Savingmindepositamount=this.SavingAccountConfigurationform.controls.pSavingmindepositamount.value
    if (isNullOrEmptyString(Savingmindepositamount)) {
      Savingmindepositamount = 0;
    }
    else {
     Savingmindepositamount=this._CommonService.removeCommasForEntredNumber(Savingmindepositamount);
    }
    let Savingmaxdepositamount=this.SavingAccountConfigurationform.controls.pSavingmaxdepositamount.value
     if (isNullOrEmptyString(Savingmindepositamount)) {
      Savingmaxdepositamount = 0;
    }
    else {
    Savingmaxdepositamount=this._CommonService.removeCommasForEntredNumber(Savingmaxdepositamount)
    }
    let savingspayinapplicable=this.SavingAccountConfigurationform.controls.pIssavingspayinapplicable.value;
    if(savingspayinapplicable){
      if(Savingmindepositamount>Savingmaxdepositamount){
          this._CommonService.showWarningMessage('Max.Deposit Value  must be  greater than Min. Deposit Value');
            this.SavingAccountConfigurationform.controls.pSavingmindepositamount.setValue('');
            return;
      }
       if(Minopenamount>Savingmaxdepositamount){
          this._CommonService.showWarningMessage('Min. Opening Amount must be less than or equal to Max. Deposit Value');
            this.SavingAccountConfigurationform.controls.pMinopenamount.setValue('');
            return;
       }
    }
  }
}
