import { Component, OnInit } from '@angular/core';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from '../../../../Services/common.service';

@Component({
  selector: 'app-loansreferralcommission',
  templateUrl: './loansreferralcommission.component.html',
  styles: []
})
export class LoansreferralcommissionComponent implements OnInit {


  Data: any
  button = 'Submit';
  isLoading = false;
  ReferralCommissionForm: FormGroup

  CommissionPayoutShow: Boolean
  fixedtextboxshow: Boolean
  percentagetextboxshow: Boolean
  applicantTypesPush: any
  radiobuttoncheck: any
  Commissionpayouttype: any

  SaveButtonShowHide: Boolean
  UpdateButtonShowHide: Boolean

  submitted = false;

  constructor(private _CommonService: CommonService, private router: Router, private toaster: ToastrService, private _loanmasterservice: LoansmasterService, private fb: FormBuilder) { }


  ngOnInit() {
    this.SaveButtonShowHide = false
    this.UpdateButtonShowHide = true
    this.applicantTypesPush = [];
    this._loanmasterservice._getDatafromLoanMaster();
    this.ReferralCommissionForm = this.fb.group({
      pIsreferralcomexist: [''],
      pCommissionpayouttype: [''],
      pCommissionpayout: ['']

    })

    this.radiobuttoncheck = false
    this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(false)
    this.ReferralCommissionForm.controls.pCommissionpayout.setValue(0)

    this.DataBindingToEdit();

  }

  DataBindingToEdit() {
    
    let buttontype = this._loanmasterservice.GetButtonClickType()
    if (buttontype != "New") {
      this.SaveButtonShowHide = true
      this.UpdateButtonShowHide = false
      let res = this._loanmasterservice.GetLoanReferralCommissionData()

      if (res != null) {

        if (res[0].pIsreferralcomexist != false) {

          this.radiobuttoncheck = res[0].pIsreferralcomexist
          this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(res[0].pIsreferralcomexist)
          this.CommissionPayoutShow = true

          if (res[0].pCommissionpayouttype == "Fixed") {

            this.Commissionpayouttype = res[0].pCommissionpayouttype
            this.fixedtextboxshow = true
            this.percentagetextboxshow = false
            this.ReferralCommissionForm.controls.pCommissionpayout.setValue(this._CommonService.currencyformat(res[0].pCommissionpayout))
            this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(res[0].pCommissionpayouttype)

          } else {

            this.Commissionpayouttype = res[0].pCommissionpayouttype
            this.fixedtextboxshow = false
            this.percentagetextboxshow = true
            this.ReferralCommissionForm.controls.pCommissionpayout.setValue(res[0].pCommissionpayout)
            this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(res[0].pCommissionpayouttype)

          }
        }
        //  else {
        //   this.radiobuttoncheck = true
        //   this.CommissionPayoutShow = true
        // }
      }

    }
  }

  IscommissionPaid(type) {
    
    if (type == "Yes") {
      this.CommissionPayoutShow = true
      // this.fixedtextboxshow = false
      // this.percentagetextboxshow = false
      this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(true)

      this.fixedtextboxshow = true
      this.percentagetextboxshow = false
      this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue("Fixed")
      this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")
      this.Commissionpayouttype = "Fixed"
      this.ReferralCommissionForm.controls.pCommissionpayout.setValidators([Validators.required])
      this.ReferralCommissionForm.controls.pCommissionpayout.updateValueAndValidity()


      this.DataBindingToEdit();
    }
    else {
      this.CommissionPayoutShow = false
      this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(false)
      this.submitted = false
      this.ReferralCommissionForm.controls.pCommissionpayout.clearValidators()
      this.ReferralCommissionForm.controls.pCommissionpayout.updateValueAndValidity()

      this.ReferralCommissionForm.controls.pCommissionpayout.setValue(0)
      this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue("")


    }
  }

  commissionPayout(type) {
    
    this.ReferralCommissionForm.controls.pCommissionpayout.setValidators([Validators.required])
    this.ReferralCommissionForm.controls.pCommissionpayout.updateValueAndValidity()
    if (type == "Fixed") {
      this.fixedtextboxshow = true
      this.percentagetextboxshow = false
      this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(type)
      this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")

      let buttontype = this._loanmasterservice.GetButtonClickType()
      if (buttontype != "New") {
        this.SaveButtonShowHide = true
        this.UpdateButtonShowHide = false
        let res = this._loanmasterservice.GetLoanReferralCommissionData()
        if (res != null) {
          if (res[0].pIsreferralcomexist != false) {
            this.radiobuttoncheck = res[0].pIsreferralcomexist
            this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(res[0].pIsreferralcomexist)
            this.CommissionPayoutShow = true
            if (res[0].pCommissionpayouttype == "Fixed") {
              this.Commissionpayouttype = res[0].pCommissionpayouttype
              this.fixedtextboxshow = true
              this.percentagetextboxshow = false
              this.ReferralCommissionForm.controls.pCommissionpayout.setValue(this._CommonService.currencyformat(res[0].pCommissionpayout))
              this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(res[0].pCommissionpayouttype)
            }
            else {
              this.Commissionpayouttype = res[0].pCommissionpayouttype
              this.fixedtextboxshow = true
              this.percentagetextboxshow = false
              this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")
              this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(type)

            }
          }
          // else {
          //   this.radiobuttoncheck = res[0].pIsreferralcomexist
          //   this.CommissionPayoutShow = false
          // }
        }

      }


    } else {
      this.fixedtextboxshow = false
      this.percentagetextboxshow = true
      this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(type)
      this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")

      let buttontype = this._loanmasterservice.GetButtonClickType()
      if (buttontype != "New") {
        this.SaveButtonShowHide = true
        this.UpdateButtonShowHide = false
        let res = this._loanmasterservice.GetLoanReferralCommissionData()
        if (res != null) {
          if (res[0].pIsreferralcomexist != false) {
            this.radiobuttoncheck = res[0].pIsreferralcomexist
            this.ReferralCommissionForm.controls.pIsreferralcomexist.setValue(res[0].pIsreferralcomexist)
            this.CommissionPayoutShow = true
            if (res[0].pCommissionpayouttype == "Percentage") {
              this.Commissionpayouttype = res[0].pCommissionpayouttype
              this.fixedtextboxshow = false
              this.percentagetextboxshow = true
              this.ReferralCommissionForm.controls.pCommissionpayout.setValue(this._CommonService.currencyformat(res[0].pCommissionpayout))
              this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(res[0].pCommissionpayouttype)
            }
            else {
              this.Commissionpayouttype = res[0].pCommissionpayouttype
              this.fixedtextboxshow = false
              this.percentagetextboxshow = true
              this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")
              this.ReferralCommissionForm.controls.pCommissionpayouttype.setValue(type)

            }
          }
          //  else {
          //   this.radiobuttoncheck = res[0].pIsreferralcomexist
          //   this.CommissionPayoutShow = false
          // }
        }

      }


    }

  }



  ClearButtonClick(){
    this.ReferralCommissionForm.controls.pCommissionpayout.setValue("")
  }

  SaveLoanMaster() {
    
debugger;
    this.submitted = true

    if (this.ReferralCommissionForm.valid) {

      this.applicantTypesPush = []
      this.applicantTypesPush.push(this.ReferralCommissionForm.value);
      let d = this.applicantTypesPush[0].pCommissionpayout;
      if (d.toString().includes(',')) {
        let s = d.split(',');
        let n = s.join('')
        d = n;
        this.applicantTypesPush[0].pCommissionpayout = d
      }
      this._loanmasterservice._addDataToLoanMaster(this.applicantTypesPush, "ReferralCommissioLoanList")

      this._loanmasterservice._checkValidationsBetweenComponents();

      let validationStatus = this._loanmasterservice._getValidationStatus();

      if (validationStatus == true) {
        this.isLoading = true;
          this.button = 'Processing';

          debugger;
        let FormData = (this._loanmasterservice._getDatafromLoanMaster());
        
        let Jsondata = JSON.stringify(FormData);
        console.log(Jsondata)
        let buttontype = this._loanmasterservice.GetButtonClickType()
        if (buttontype != "New" && buttontype != undefined) {
          this._loanmasterservice.UpdateLoanMaster(FormData).subscribe(res => {
            
            if (res) {
              this.toaster.success("Updated Successfully", 'Success')
              this._loanmasterservice.SetButtonClickType(undefined)
              this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
              this.router.navigateByUrl("/LoansMaster")
              // location.reload();
            }
          },err=>{
                  this.isLoading = false;
                  this.button = 'Submit'
             this.toaster.error("Error while updating")
          });

        } else {
          debugger;
          this._loanmasterservice.saveLoanMaster(FormData).subscribe(res => {

            if (res) {
              this.toaster.success("Saved Successfully", 'Success')
              this._loanmasterservice.SetButtonClickType(undefined)
              this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
              this.ReferralCommissionForm.reset()
              this.isLoading = false;
              this.button = 'Submit'
              this.router.navigateByUrl("/LoansMaster")
              //location.reload();
            }
          },err=>{ 
                  this.isLoading = false;
                  this.button = 'Submit'
          this.toaster.error("Error while saving")
          });
        }

      }
    }


  }



}
