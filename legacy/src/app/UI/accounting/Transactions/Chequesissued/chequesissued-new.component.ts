import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { runInThisContext } from 'vm';
declare let $: any;
@Component({
  selector: 'app-chequesissued-new',
  templateUrl: './chequesissued-new.component.html',
  styles: []
})
export class ChequesissuedNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  gridData = [];
  gridDatatemp = [];
  BanksList = [];
  ChequesIssuedData = [];
  ChequesClearReturnData = [];
  ChequesClearReturnDataBasedOnBrs: any;
  DataForSaving = [];
  ChequesIssuedValidation:any = {};
  all: any;
  chequesissued: any;
  onlinepayments: any;
  cleared: any;
  returned: any;
  cancelled: any;
  bankname: any;
  // bankaccountnumber:any;
  bankbalance: any;
  brsdate: any;
  validate: any;
  bankbalancedetails: any;
  bankdetails: any;
  bankid: any;
  status = "all"
  pdfstatus="All";
  public selectableSettings: SelectableSettings;
  public checkbox = false;
  banknameshowhide: any;
  datetitle: any;
  buttonname = "Save";
  disablesavebutton = false;
  brsdateshowhidecleared = false;
  brsdateshowhidereturned = false;
  brsdateshowhidecancelled = false;
  showhidegridcolumns = false;
  saveshowhide = true;
  validatebrsdatecancel = false;
  validatebrsdatereturn = false;
  validatebrsdateclear = false;
  hiddendate = true;
  ChequesIssuedForm: FormGroup;
  BrsReturnForm: FormGroup;
  BrsCancelForm: FormGroup;
  public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' } ];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private _accountingtransaction: AccountingTransactionsService, private _commonService: CommonService, private fb: FormBuilder, private datepipe: DatePipe, private toastr: ToastrService) {
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brsfromConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brsfromConfig.maxDate = new Date();
    this.brstoConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brstoConfig.maxDate = new Date();
    this.brsfromConfig.showWeekNumbers = false;
    this.brsfromConfig.containerClass = 'theme-dark-blue';
    this.brstoConfig.showWeekNumbers = false;
    this.brstoConfig.containerClass = 'theme-dark-blue';
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.ChequesIssuedForm = this.fb.group({
      ptransactiondate: [new Date(), Validators.required],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      pchequesOnHandlist: [],
      SearchClear: ['']
    })
    this.BrsReturnForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    })
    this.BrsCancelForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    })
    this.bankid = 0;
    this.banknameshowhide = false;
    this._accountingtransaction.GetBanksList().subscribe(bankslist => {
      
      this.BanksList = bankslist;
    })
    this.GetBankBalance(this.bankid)
    this.GetChequesIssued(this.bankid);
   
    this.BlurEventAllControll(this.ChequesIssuedForm);
  }

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkbox,
      //mode: this.mode
      mode: "multiple"
    };
  }
GetBankBalance(bankid){
  this._accountingtransaction.GetBankBalance(bankid).subscribe(bankdetails => {
    
    this.bankbalancedetails = bankdetails;
    if(this.bankid==0){
      if (this.bankbalancedetails._BankBalance < 0) {
        let bal = Math.abs(this.bankbalancedetails._BankBalance)
        this.bankbalance = ' ' + this._commonService.currencyformat(bal) + ' ' + "Cr";
      }
      else if (this.bankbalancedetails._BankBalance == 0) {
        this.bankbalance = ' ' + 0;
      }
      else {
        this.bankbalance = ' ' + this._commonService.currencyformat(this.bankbalancedetails._BankBalance) + ' ' + "Dr";
      }
    }
    
    //this.bankbalance = this._commonService.currencyformat(this.bankbalancedetails._BankBalance);
    this.brsdate = this.datepipe.transform(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate), 'dd/MM/yyyy')
    this.ChequesIssuedForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
    this.ChequesIssuedForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
    this.BrsReturnForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
    this.BrsReturnForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
    this.BrsCancelForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
    this.BrsCancelForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
  })
}
  GetChequesIssued(bankid) {
    
    debugger
    this.gridData = [];
    this._accountingtransaction.GetChequesIssuedData(bankid).subscribe(data => {
      debugger
    
        this.ChequesIssuedData = data.pchequesOnHandlist;
        this.ChequesClearReturnData = data.pchequesclearreturnlist;
        this.CountOfRecords();
  
   
      if (this.status == "all") {
        this.All();
      }
      if (this.status == "chequesissued") {
        this.ChequesIssued();
      }
      if (this.status == "onlinepayment") {
        this.OnlinePayments();
      }
      if (this.status == "cleared") {
        this.Cleared();
      }
      if (this.status == "returned") {
        this.Returned();
      }
      if (this.status == "cancelled") {
        this.Cancelled();
      }
    }, error => { this._commonService.showErrorMessage(error) })
  }

  All() {
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "all";
    this.pdfstatus="All";
    this.gridData = this.ChequesIssuedData;
    this.gridDatatemp = this.ChequesIssuedData;
  }

  ChequesIssued() {
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "chequesissued";
    this.pdfstatus="Cheques Issued";
    for (let i = 0; i < this.ChequesIssuedData.length; i++) {
      if (this.ChequesIssuedData[i].ptypeofpayment == "CHEQUE") {
        this.gridData.push(this.ChequesIssuedData[i]);
        this.gridDatatemp.push(this.ChequesIssuedData[i]);
      }
    }
  }

  OnlinePayments() {
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "onlinepayment";
    this.pdfstatus="Online Payments";
    for (let j = 0; j < this.ChequesIssuedData.length; j++) {
      if (this.ChequesIssuedData[j].ptypeofpayment != "CHEQUE") {
        this.gridData.push(this.ChequesIssuedData[j]);
        this.gridDatatemp.push(this.ChequesIssuedData[j]);
      }
    }
  }

  Cleared() {
    
    this.datetitle = "Cleared Date";
    this.gridData = [];
    this.gridDatatemp = [];
    this.status = "cleared";
    this.pdfstatus="Cleared";
    this.brsdateshowhidecleared = true;
    this.brsdateshowhidereturned = false;
    this.brsdateshowhidecancelled = false;
    this.GridColumnsHide();
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "P") {
        this.gridData.push(this.ChequesClearReturnData[i]);
        this.gridDatatemp.push(this.ChequesClearReturnData[i]);
      }
    }
  }

  Returned() {
    this.gridData = [];
    this.gridDatatemp = [];
    this.datetitle = "Returned Date";
    this.status = "returned";
    this.pdfstatus="Returned";
    this.GridColumnsHide();
    this.brsdateshowhidereturned = true;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidecancelled = false;
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "R") {
        this.gridData.push(this.ChequesClearReturnData[i]);
        this.gridDatatemp.push(this.ChequesClearReturnData[i]);
      }
    }
  }

  Cancelled() {
    this.gridData = [];
    this.gridDatatemp = [];
    this.datetitle = "Cancelled Date";
    this.status = "cancelled";
    this.pdfstatus="Cancelled";
    this.GridColumnsHide();
    this.brsdateshowhidereturned = false;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidecancelled = true;
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "C") {
        this.gridData.push(this.ChequesClearReturnData[i]);
        this.gridDatatemp.push(this.ChequesClearReturnData[i]);
      }
    }
  }

  GridColumnsShow() {
    this.showhidegridcolumns = false;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidereturned = false;
    this.brsdateshowhidecancelled = false;
    this.saveshowhide = true;
    this.hiddendate = true;
  }

  GridColumnsHide() {
    // this.cleared = 0;
    // this.returned = 0;
    // this.cancelled = 0;
    this.showhidegridcolumns = true;
    this.saveshowhide = false;
    this.hiddendate = false;
   // this.CountOfRecords();
  }

  SelectBank(event) {
    
    if(event.target.value==""){
      this.bankid=0;
      this.bankname="";
      this.banknameshowhide = false;
  }
  else{
    this.banknameshowhide = true;
    for (let i = 0; i < this.BanksList.length; i++) {
      if (event.target.value == this.BanksList[i].pdepositbankname) {
        this.bankdetails = this.BanksList[i];
        break;
      }
    }
   
    this.bankid = this.bankdetails.pbankid;
    this.bankname = this.bankdetails.pdepositbankname;
    
    //this.bankaccountnumber = this.bankdetails.pbankaccountnumber;
    // if(this.bankdetails.pfrombrsdate!=null){
    //   this.ChequesIssuedForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
    //   this.BrsReturnForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
    //   this.BrsCancelForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
    // }
    // if(this.bankdetails.ptobrsdate!=null){
    //   this.brsdate = this.datepipe.transform(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate), 'dd/MM/yyyy')

    //   this.ChequesIssuedForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
  
    //   this.BrsReturnForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
    
    //   this.BrsCancelForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
    // }
    // else{
    //   this.brsdate=""
    // }
   
    if (this.bankdetails.pbankbalance < 0) {
      let bal = Math.abs(this.bankdetails.pbankbalance);
      this.bankbalance = ' ' + this._commonService.currencyformat(bal) + ' ' + "Cr";
    }
    else if (this.bankdetails.pbankbalance == 0) {
      this.bankbalance = ' ' + 0;
    }
    else {
      this.bankbalance = ' ' + this._commonService.currencyformat(this.bankdetails.pbankbalance) + ' ' + "Dr";
    }
  }
  this.GetBankBalance(this.bankid)
  this.GetChequesIssued(this.bankid);
  this.ChequesIssuedForm.controls.SearchClear.setValue('');
  }

  CountOfRecords() {
    this.all = 0;
    this.chequesissued = 0;
    this.onlinepayments = 0;
    this.cleared = 0;
    this.returned = 0;
    this.cancelled = 0;
    this.all = this.ChequesIssuedData.length;
    for (let j = 0; j < this.ChequesIssuedData.length; j++) {
      if (this.ChequesIssuedData[j].ptypeofpayment != "CHEQUE") {
        this.onlinepayments = this.onlinepayments + 1;
      }
    }
    for (let i = 0; i < this.ChequesIssuedData.length; i++) {
      if (this.ChequesIssuedData[i].ptypeofpayment == "CHEQUE") {
        this.chequesissued = this.chequesissued + 1;
      }
    }
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "P") {
        this.cleared = this.cleared + 1;
      }
    }
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "R") {
        this.returned = this.returned + 1;
      }
    }
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "C") {
        this.cancelled = this.cancelled + 1;
      }
    }
  }

  GetDataOnBrsDates(frombrsdate, tobrsdate, bankid) {
    
    this._accountingtransaction.DataFromBrsDatesChequesIssued(frombrsdate, tobrsdate, bankid).subscribe(
      clearreturndata => {
        
        let kk = [];
        this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
        for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
          if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "P") {
            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
            this.cleared = this.cleared + 1;
          }
          if (this.status == "cancelled" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "C") {
            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
            this.cancelled = this.cancelled + 1;
          }
          if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
            this.returned = this.returned + 1;
          }
        }
        this.gridData = kk;
      }, error => { this._commonService.showErrorMessage(error) })
  }

  ShowBrsClear() {
    
    this.gridData = [];
    this.cleared = 0;
    let fromdate = this.ChequesIssuedForm.controls['pfrombrsdate'].value;
    let todate = this.ChequesIssuedForm.controls['ptobrsdate'].value;
    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate == false) {
      fromdate = this.datepipe.transform(fromdate,'dd-MMM-yyyy')
      todate = this.datepipe.transform(todate,'dd-MMM-yyyy')
      this.validatebrsdateclear = false;
      this.GetDataOnBrsDates(fromdate, todate, this.bankid);
      if(this.bankid==0){
        this.ChequesIssuedForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
        this.ChequesIssuedForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
      }
      else{
        this.ChequesIssuedForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
        this.ChequesIssuedForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
      }
    }
    else {
      this.validatebrsdateclear = true;
    }
  }

  ShowBrsReturn() {
    
    this.gridData = [];
    this.returned = 0;
    let fromdate = this.BrsReturnForm.controls['frombrsdate'].value;
    let todate = this.BrsReturnForm.controls['tobrsdate'].value;
    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate == false) {
      fromdate = this.datepipe.transform(fromdate,'dd-MMM-yyyy')
      todate = this.datepipe.transform(todate,'dd-MMM-yyyy')
      this.validatebrsdatereturn = false;
      this.GetDataOnBrsDates(fromdate, todate, this.bankid);
      if(this.bankid==0){
        this.BrsReturnForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
        this.BrsReturnForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
      }
      else{
        this.BrsReturnForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
        this.BrsReturnForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
      }
    }
    else {
      this.validatebrsdatereturn = true;
    }
  }

  ShowBrsCancel() {
    
    this.gridData = [];
    this.cancelled = 0;
    let fromdate = this.BrsCancelForm.controls['frombrsdate'].value;
    let todate = this.BrsCancelForm.controls['tobrsdate'].value;
    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate == false) {
      fromdate = this.datepipe.transform(fromdate,'dd-MMM-yyyy')
      todate = this.datepipe.transform(todate,'dd-MMM-yyyy')
      this.validatebrsdatecancel = false;
      this.GetDataOnBrsDates(fromdate, todate, this.bankid);
      if(this.bankid==0){
        this.BrsCancelForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
        this.BrsCancelForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
      }
      else{
        this.BrsCancelForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
        this.BrsCancelForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
      }
    }
    else {
      this.validatebrsdatecancel = true;
    }
  }

  OnBrsDateChanges(fromdate, todate) {
    if (fromdate > todate) {
      this.validate = true;
    }
    else {
      this.validate = false;
    }
  }

  Clear() {
    
    this.ChequesIssuedForm.reset();
    this.ngOnInit();
    $("#bankselection").val("");
    this.ChequesIssuedValidation = {};
  }

  Save() {
    debugger
    this.DataForSaving = [];
    let isValid = true;
    if (this.checkValidations(this.ChequesIssuedForm, isValid)) {
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].pchequestatus == "P" || this.gridData[i].pchequestatus == "R" || this.gridData[i].pchequestatus == "C") {
          this.DataForSaving.push(JSON.parse(JSON.stringify(this.gridData[i])));
        }
      }
      if (this.DataForSaving.length != 0) {
   
        for(let i=0;i<this.DataForSaving.length;i++){
          if(this.DataForSaving[i].pchequestatusnarration == ''){
            this._commonService.showWarningMessage("Please Enter Value for all Checked Fields");
            return;
          }
        }

        for(let j=0;j<this.gridData.length;j++){
          for(let k=0;k<this.DataForSaving.length;k++){
            if(this.gridData[j].pchequestatusnarration == this.DataForSaving[k].pchequestatusnarration && this.gridData[j].preceiptid != this.DataForSaving[k].preceiptid){
              this._commonService.showWarningMessage("Please Enter Different Values");
              return;
            }
          }
        }

       let cdate = new Date();
       let year = cdate.getFullYear();
       let lastTwoDigits = year % 100; 
console.log(lastTwoDigits); 

        for(let i=0;i<this.DataForSaving.length;i++){

          if(this.DataForSaving[i].pchequedate!=null){
            this.DataForSaving[i].pchequedate=this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].pchequedate);
          }
         
          this.DataForSaving[i].preceiptdate=this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].preceiptdate);
          this.DataForSaving[i].pCreatedby=this._commonService.pCreatedby;
          this.DataForSaving[i].pchequestatusnarration = this.DataForSaving[i].pchequestatusnarration +"-"+ lastTwoDigits;
          
        }
      
        this.ChequesIssuedForm.controls.pchequesOnHandlist.setValue(this.DataForSaving);
        this.buttonname = "Processing";
        this.disablesavebutton = true;
        let form = JSON.stringify(this.ChequesIssuedForm.value);
        this._accountingtransaction.SaveChequesIssued(form).subscribe(data => {
          
          if (data) {
            this._commonService.showInfoMessage("Saved Successfully");
            this.Clear();
          }
          this.disablesavebutton = false;
          this.buttonname = "Save";
        }, error => { this._commonService.showErrorMessage(error) ;
        this.disablesavebutton = false;
        this.buttonname = "Save";
        this.Clear()});
      }
      else{
         this._commonService.showWarningMessage("Please Select any One Check Box in Grid");
         this.buttonname="Save";
        this.disablesavebutton = false;
         return;
      }
    }
    else{
      this.buttonname="Save";
      this.disablesavebutton = false;
    }
  }
  

  // checkedClear(event, data) {
    
  //   if (event.target.checked == true) {
  //     let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
  //     let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
  //    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate)
  //         if(transactiondate >= receiptdate){
  //           data.pdepositstatus = true;
  //           data.preturnstatus = false;
  //           data.pcancelstatus = false;
  //           data.pchequestatus = "P";
  //          }
  //         else{
  //           data.pclearstatus = false;
  //           data.pchequestatus = "N";
  //             $('#' + event.target.id + ''). prop("checked", false);
  //             this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
  //         } 
     
  //   }
  //   else {
  //     data.pclearstatus = false;
  //     data.pchequestatus = "N";
  //   }
  //   for (let i = 0; i < this.gridData.length; i++) {
  //     if (this.gridData[i].preceiptid == data.preceiptid) {
  //       this.gridData[i] = data;
  //       break;
  //     }
  //   }
  // }

  checkedClear(event, data) {
    debugger;
    if (event.target.checked) {
        this.setCheckedStatus(data, event);
    } else {
        this.unsetCheckedStatus(data);
    }
  }
  
  setCheckedStatus(data, event) {
    debugger;
    data.pdepositstatus = '';
    data.preturnstatus = '';
    data.pchequestatus = "";
    data.pcancelstatus = '';
    data.pclearstatus = false;
    data.pchequestatusnarration = '';

    let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
    let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate);
  
     if(transactiondate >= receiptdate){
        data.pdepositstatus = true;
        data.preturnstatus = false;
        data.pcancelstatus = false;
        data.pchequestatus = "P";
        data.pclearstatus = false;
    } else {
        data.pclearstatus = false;
        data.pchequestatus = "N";
        data.preturnstatus = false;
        data.pcancelstatus = false;
        data.pdepositstatus = false;
        $('#' + event.target.id + ''). prop("checked", false);
        this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
    }
  
    this.updateGridData(data, event);
  }
  
  unsetCheckedStatus(data) {
    debugger;
    data.preturnstatus = false;
    data.pchequestatus = "N";
    data.pcancelstatus = false;
    data.pdepositstatus = false;
    data.pclearstatus = false;
    this.updateGridData(data, null);
    data.pchequestatusnarration = '';
  }
  
  updateGridData(data, event) {
    debugger;
    let tempdata = [];
    for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].preceiptid == data.preceiptid) {
            if(event && data.pchequestatusnarration == ''){
             // this._commonService.showWarningMessage("Please Enter Data For Checked Field");
              data.pchequestatusnarration = '';
            }
            else if (event) {            
            this.gridData[i].pchequestatusnarration = data.pchequestatusnarration;
            }
            this.gridData[i] = data;
            break;
        }
    }
    
  }
  

ValidatingNarration(dataItem: any): void {
  debugger
  const newValue = dataItem.pchequestatusnarration;
  const duplicateExists = this.gridData.some(item => item.pchequestatusnarration === newValue && item !== dataItem);

  if (duplicateExists) {
    this._commonService.showWarningMessage('This narration already exists. Please enter a unique value.');
    dataItem.pchequestatusnarration = '';  
  } else {
    console.log('Valid narration:', newValue);
  }
}

  // checkedReturn(event, data) {
    
  //   if (event.target.checked == true) {
  //     let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
  //     let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
  //    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate)
  //         if(transactiondate >= receiptdate){
  //           data.preturnstatus = true;
  //        data.pcancelstatus = false;
  //        data.pdepositstatus = false;
  //         data.pchequestatus = "R";
  //          }
  //         else{
  //           data.pclearstatus = false;
  //           data.preturnstatus = false;
  //           data.pchequestatus = "N";
  //             $('#' + event.target.id + ''). prop("checked", false);
  //             this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
  //         } 
     
  //     }
  //   else {
  //     data.preturnstatus = false;
  //     data.pchequestatus = "N";
  //   }
  //   for (let i = 0; i < this.gridData.length; i++) {
  //     if (this.gridData[i].preceiptid == data.preceiptid) {
  //       this.gridData[i] = data;
  //       break;
  //     }
  //   }
  // }

  checkedReturn(event, data) {
    debugger;
    if (event.target.checked) {
      this.setCheckedStatusReturn(data, event);
    } else {
      this.unsetCheckedStatusReturn(data);
    }
  }
  
  setCheckedStatusReturn(data, event) {
    debugger;
    data.preturnstatus = '';
    data.pcancelstatus = '';
    data.pdepositstatus = '';
    data.pchequestatus = "";
    data.pclearstatus = '';
    data.pchequestatusnarration = '';

    let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
    let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate);
  
     if(transactiondate >= receiptdate){
      data.preturnstatus = true;
      data.pcancelstatus = false;
      data.pdepositstatus = false;
      data.pclearstatus = false;
      data.pchequestatus = "R";
    } else {
        data.pclearstatus = false;
        data.preturnstatus = false;
        data.pcancelstatus = false;
        data.pclearstatus = false;
        data.pchequestatus = "N";
        $('#' + event.target.id + ''). prop("checked", false);
        this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
    }
  
    this.updateGridDataReturn(data, event);
  }
  
  unsetCheckedStatusReturn(data) {
    debugger;
    data.preturnstatus = false;
    data.pchequestatus = "N";
    data.pcancelstatus = false;
    data.pdepositstatus = false;
    data.pclearstatus = false;
    this.updateGridDataReturn(data, null);
    data.pchequestatusnarration = '';
  }
  
  updateGridDataReturn(data, event) {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].preceiptid == data.preceiptid) {
            if(event && data.pchequestatusnarration == ''){
             // this._commonService.showWarningMessage("Please Enter Data For Checked Field");
              data.pchequestatusnarration = '';
            }
            else if (event) {
            
            this.gridData[i].pchequestatusnarration = data.pchequestatusnarration;
            }
            this.gridData[i] = data;
            break;
        }
    }
  }

  // checkedCancel(event, data) {
    
  //   if (event.target.checked == true) {
  //     let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
  //     let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
  //    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate)
  //         if(transactiondate >= receiptdate){
  //           data.pcancelstatus = true;
  //           data.pdepositstatus = false;
  //           data.preturnstatus = false;
  //           data.pchequestatus = "C";
  //          }
  //         else{
  //           data.pclearstatus = false;
  //           data.preturnstatus = false;
  //           data.pcancelstatus = false;
  //           data.pchequestatus = "N";
  //             $('#' + data.preceiptid + ''). prop("checked", false);
  //             this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
  //         } 
     
  //   }
  //   else {
  //     data.pcancelstatus = false;
  //     data.pchequestatus = "N";
  //   }
  //   for (let i = 0; i < this.gridData.length; i++) {
  //     if (this.gridData[i].preceiptid == data.preceiptid) {
  //       this.gridData[i] = data;
  //       break;
  //     }
  //   }
  // }

  checkedCancel(event, data) {
    debugger;
    if (event.target.checked) {
      this.setCheckedStatusCancel(data, event);
      data.pchequestatusnarration = 'CHCANCEL';
    } else {
      this.unsetCheckedStatusCancel(data);
      data.pchequestatusnarration = '';
    }
  }
  
  setCheckedStatusCancel(data, event) {
    debugger;
    data.pcancelstatus = '';
    data.pdepositstatus = false;
    data.preturnstatus = false;
    data.pchequestatus = "";
    data.pchequestatusnarration = '';
    data.pclearstatus = false;

    let transdate=this.datepipe.transform(this.ChequesIssuedForm.controls.ptransactiondate.value,'dd/MM/yyyy');
    let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate);
  
     if(transactiondate >= receiptdate){
      data.pcancelstatus = true;
      data.pdepositstatus = false;
      data.preturnstatus = false;
      data.pchequestatus = "C";
      data.pclearstatus = false;
    } else {
        data.pclearstatus = false;
        data.pcancelstatus = false;
        data.preturnstatus = false;
        data.pchequestatus = "N";
        data.pdepositstatus = false;
        $('#' + event.target.id + ''). prop("checked", false);
        this._commonService.showWarningMessage("Transaction Date Should be Greater than Payment Date");
    }
  
    this.updateGridDataCancel(data, event);
  }
  
  unsetCheckedStatusCancel(data) {
    debugger;
    data.pcancelstatus = false;
    data.pchequestatus = "N";
    data.preturnstatus = false;
    data.pclearstatus = false;
    data.pdepositstatus = false;
    this.updateGridDataCancel(data, null);
    data.pchequestatusnarration = '';
  }
  
  updateGridDataCancel(data, event) {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].preceiptid == data.preceiptid) {
            if(event && data.pchequestatusnarration == ''){
            //  this._commonService.showWarningMessage("Please Enter Data For Checked Field");
              data.pchequestatusnarration = '';
            }
            else if (event) {
              this.gridData[i].pchequestatusnarration = data.pchequestatusnarration;
            }
            this.gridData[i] = data;
            break;
        }
    }
  }

  DateChange(event){
      this.GetChequesIssued(this.bankid)
  }

  SearchRecord(inputValue: string) {
    
    this.gridData = process(this.gridDatatemp, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'preceiptid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'preceiptdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdepositcleardate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequenumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptypeofpayment',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptotalreceivedamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  // showInfoMessage(errormsg: string) {
  //   this.toastr.success(errormsg);
  // }
  // showErrorMessage(errormsg: string) {
  //   this.toastr.error(errormsg);
  // }
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
          this.ChequesIssuedValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ChequesIssuedValidation[key] += errormessage + ' ';
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
  public group: any[] = [{
    field: 'preceiptdate'
  }, {
    field: 'pChequenumber'
  }
  ];
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, { group: this.group, sort: [{ field: 'preceiptdate', dir: 'desc' }, { field: 'pChequenumber', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }
}
