import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { CommonService } from 'src/app/Services/common.service';


declare let $: any;

@Component({
  selector: 'app-loanspenalinterest',
  templateUrl: './loanspenalinterest.component.html',
  styles: []
})
export class LoanspenalinterestComponent implements OnInit {
  constructor(private _loanmasterservice: LoansmasterService, private _FormBuilder: FormBuilder, private _Commonservice: CommonService) { }
  LoansPenalinterestForm: FormGroup;
  public ShowDueText: boolean = false;
  public ShowOverDueText: boolean = false;
  public PenalInterestTypesPush = [];
  public submitted: boolean = false;
  public ShowClear: boolean = true;
  ngOnInit() {
    this.GetFormData();
    this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {


      this.submitted = true;
      let Status = this._loanmasterservice._getValidationStatus();

      if (Status == true) {
        if (this.LoansPenalinterestForm.valid) {
          if(this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.value == false)
          {
            this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.setValue(true)
          }
          else{
            this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.setValue(false)
          }
          this.PenalInterestTypesPush = [];
          this.PenalInterestTypesPush.push(this.LoansPenalinterestForm.value);
          this._loanmasterservice._addDataToLoanMaster(this.PenalInterestTypesPush, "penaltyConfigurationList")
          this._loanmasterservice._setValidationStatus(true);
        }
        else {

          this._loanmasterservice._setValidationStatus(false);
          let str = "penalinterest"
          $('.nav-item a[href="#' + str + '"]').tab('show');

        }
      }


    });
    this._loanmasterservice._GetLoanNameAndCodeDataInTabs().subscribe(loandata => {
      
      if (loandata != "" && loandata != undefined) {
        this.LoansPenalinterestForm.controls.pLoantypeId.setValue(loandata.pLoantypeid)
      } else {
        this.LoansPenalinterestForm.controls.pLoantypeId.setValue(0)
      }
    });
    this._loanmasterservice.GetNameCodeData().subscribe(json => {
      
      let res = this._loanmasterservice.GetPenalinterestData()
      let buttontype = this._loanmasterservice.GetButtonClickType()
      if (buttontype != "New") {
        
        if (res != null) {
          this.ShowClear = false;
          this.LoansPenalinterestForm.controls.ppenaltyid.setValue(res[0].ppenaltyid);
          this.LoansPenalinterestForm.controls.pLoantypeId.setValue(res[0].pLoantypeId);
          this.LoansPenalinterestForm.controls.pLoanid.setValue(res[0].pLoanid);
          this.LoansPenalinterestForm.controls.ptypeofpenalinterest.setValue(res[0].ptypeofpenalinterest);
          if(res[0].pisloanpayinmodeapplicable == false)
          {
            this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.setValue(true)
          }
          else{
            this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.setValue(false)
          }
         // this.LoansPenalinterestForm.controls.pisloanpayinmodeapplicable.setValue(res[0].pisloanpayinmodeapplicable);
          this.LoansPenalinterestForm.controls.pduepenaltyvalue.setValue(res[0].pduepenaltyvalue);
          this.LoansPenalinterestForm.controls.poverduepenaltytype.setValue(res[0].poverduepenaltytype);
          this.LoansPenalinterestForm.controls.pduepenaltytype.setValue(res[0].pduepenaltytype);
          this.LoansPenalinterestForm.controls.poverduepenaltyvalue.setValue(res[0].poverduepenaltyvalue);
          this.LoansPenalinterestForm.controls.ppenaltygraceperiod.setValue(res[0].ppenaltygraceperiod);
          this.LoansPenalinterestForm.controls.pPenaltygraceperiodtype.setValue(res[0].pPenaltygraceperiodtype);
          if(res[0].ptypeofoperation == null){
            this.LoansPenalinterestForm.controls.ptypeofoperation.setValue('UPDATE');
          }
        }
      }
    });
  }

  public GetFormData() {
    this.ShowDueText = true;
    this.ShowOverDueText = true;
    this.LoansPenalinterestForm = this._FormBuilder.group({
      ppenaltyid: [0],
      pLoantypeId: [0],
      pLoanid: [0],
      ptypeofpenalinterest: ['Simple Interest'],
      pisloanpayinmodeapplicable: [false],
      pduepenaltytype: ['Fixed'],
      pduepenaltyvalue: [0, Validators.required],
      poverduepenaltytype: ['Fixed'],
      poverduepenaltyvalue: [0, Validators.required],
      ppenaltygraceperiod: [0, Validators.required],
      pPenaltygraceperiodtype: ['Days'],
      pCreatedby: [this._Commonservice.pCreatedby],
      pModifiedby: [0],
      pStatusid: [1],
      pStatusname: [this._Commonservice.pStatusname],
      pEffectfromdate: [''],
      pEffecttodate: [''],
      ptypeofoperation: ['CREATE']
    });
  }
  get f() { return this.LoansPenalinterestForm.controls; }
  NextTabClick() {
    
    this.submitted = true;

    if (this.LoansPenalinterestForm.valid) {
      this.PenalInterestTypesPush = [];
      this.PenalInterestTypesPush.push(this.LoansPenalinterestForm.value);
      //this.PenalInterestTypesPush = this.LoansPenalinterestForm.value;
      this._loanmasterservice._addDataToLoanMaster(this.PenalInterestTypesPush, "penaltyConfigurationList");
      this._loanmasterservice._setValidationStatus(true);
      let str = "mandatorykyc"
      this._loanmasterservice._SetSelectTitileInLoanCreation("Identification Documents")
      $('.nav-item a[href="#' + str + '"]').tab('show');

    }
    else {
      this._loanmasterservice._setValidationStatus(false);
    }

  }

  public DueType(type) {
    
    if (type == 'Fixed') {
      this.ShowDueText = true
    }
    else {
      this.ShowDueText = false;
    }
    this.LoansPenalinterestForm.controls.pduepenaltyvalue.setValue('')
  }

  public OverDueType(type) {
    
    if (type == 'Fixed') {
      this.ShowOverDueText = true;
    }
    else {
      this.ShowOverDueText = false;
    }
    this.LoansPenalinterestForm.controls.poverduepenaltyvalue.setValue('')
  }

  public ClearClick() {
    
    this.submitted = false;
    this.GetFormData();
  }

  public validategraceperiod(event){
    
    if(event.target.value > 15){
      this.LoansPenalinterestForm.controls.ppenaltygraceperiod.setValue('')
    }
  }
}
