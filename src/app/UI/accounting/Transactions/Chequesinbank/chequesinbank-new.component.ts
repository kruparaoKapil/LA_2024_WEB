import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

declare let $: any;
@Component({
  selector: 'app-chequesinbank-new',
  templateUrl: './chequesinbank-new.component.html',
  styles: []
})
export class ChequesinbankNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  BanksList = [];
  ChequesInBankData = [];
  gridData = [];
  gridDatatemp = [];
  ChequesClearReturnData = [];
  DataForSaving = [];
  all: any;
  chequesdeposited: any;
  onlinereceipts: any;
  cleared: any;
  returned: any;
  PopupData:any;
  bankdetails: any;
  bankid: any;
  datetitle: any;
  validate: any;
  bankname: any;
  //  bankaccountnumber:any;
  brsdate: any;
  bankbalancedetails: any;
  bankbalance: any;
  ChequesClearReturnDataBasedOnBrs: any;
  showhidegridcolumns = false;
  saveshowhide: any;
  chequenumber: any;
  status = "all";
  pdfstatus="All";
  buttonname = "Save";
  disablesavebutton = false;
  hiddendate = true;
  banknameshowhide = false;
  brsdateshowhidecleared = false;
  brsdateshowhidereturned = false;
  validatebrsdateclear = false;
  validatebrsdatereturn = false;
  ChequesInBankForm: FormGroup;
  BrsDateForm: FormGroup;
  ChequesInBankValidation:any = {};
  public selectableSettings: SelectableSettings;
  public checkbox = false;
  public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  checkedorNot: any;
  constructor(private _accountingtransaction: AccountingTransactionsService, private fb: FormBuilder, private datepipe: DatePipe, private _commonService: CommonService, private toastr: ToastrService) {
    this.setSelectableSettings();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    let currentDate = new Date();
      
    currentDate.setMonth(currentDate.getMonth() - 3);
    console.log(currentDate);

    this.dpConfig.minDate = currentDate;
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brsfromConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brsfromConfig.maxDate = new Date();
    this.brstoConfig.dateInputFormat = 'DD/MM/YYYY';
    this.brstoConfig.maxDate = new Date();
    this.allData = this.allData.bind(this);

    this.dpConfig.containerClass = 'theme-dark-blue';
    this.brsfromConfig.showWeekNumbers = false;
    this.brsfromConfig.containerClass = 'theme-dark-blue';
    this.brstoConfig.showWeekNumbers = false;
    this.brstoConfig.containerClass = 'theme-dark-blue';
   }

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkbox,
      //mode: this.mode
      mode: "multiple"
    };
  }

  ngOnInit() {
    this.ChequesInBankForm = this.fb.group({
      ptransactiondate: [new Date(), Validators.required],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      pchequesOnHandlist: [],
      SearchClear: ['']
    })
    this.BrsDateForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    })
    this.bankid = 0;
    this.banknameshowhide = false;
    this._accountingtransaction.GetBanksList().subscribe(bankslist => {
      
      this.BanksList = bankslist;
    })
    this.GetBankBalance(this.bankid)
    this.GetChequesInBank(this.bankid);
    this.BlurEventAllControll(this.ChequesInBankForm);

    
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
    this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
    this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
    this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
    this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
  })
}
  GetChequesInBank(bankid) {
    
   
    this._accountingtransaction.GetChequesInBankData(bankid).subscribe(data => {
      
      console.log("hiii",data);
        this.ChequesInBankData = data.pchequesOnHandlist;
        this.ChequesClearReturnData = data.pchequesclearreturnlist;
        this.CountOfRecords();
    
   
      if (this.status == "all") {
        this.All();
      }
      if (this.status == "chequesdeposited") {
        this.ChequesDeposited();
      }
      if (this.status == "onlinereceipts") {
        this.OnlineReceipts();
      }
      if (this.status == "cleared") {
        this.Cleared();
      }
      if (this.status == "returned") {
        this.Returned();
      }
    }, error => { this._commonService.showErrorMessage(error) })
  }

  All() {
    
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "all";
    this.pdfstatus="All";
    this.gridData = this.ChequesInBankData;
    this.gridDatatemp = this.ChequesInBankData;
  }

  ChequesDeposited() {
    
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "chequesdeposited";
    this.pdfstatus="Cheques Deposited";
    for (let i = 0; i < this.ChequesInBankData.length; i++) {
      if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
        this.gridData.push(this.ChequesInBankData[i]);
        this.gridDatatemp.push(this.ChequesInBankData[i]);
      }
    }
  }

  OnlineReceipts() {
    
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsShow();
    this.status = "onlinereceipts";
    this.pdfstatus="Online Receipts";
    for (let j = 0; j < this.ChequesInBankData.length; j++) {
      if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE") {
        this.gridData.push(this.ChequesInBankData[j]);
        this.gridDatatemp.push(this.ChequesInBankData[j]);
      }
    }
  }

  Cleared() {
    
    this.datetitle = "Cleared Date"
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsHide();
    this.brsdateshowhidecleared = true;
    this.brsdateshowhidereturned = false;
    this.status = "cleared";
    this.pdfstatus="Cleared";
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
        this.gridData.push(this.ChequesClearReturnData[i]);
        this.gridDatatemp.push(this.ChequesClearReturnData[i]);
      }
    }
  }

  Returned() {
    
    this.datetitle = "Returned Date";
    this.gridData = [];
    this.gridDatatemp = [];
    this.GridColumnsHide();
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidereturned = true;
    this.status = "returned";
    this.pdfstatus="Returned";
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "R") {
        this.gridData.push(this.ChequesClearReturnData[i]);
        this.gridDatatemp.push(this.ChequesClearReturnData[i]);
      }
    }
  }

  GridColumnsShow() {
    this.showhidegridcolumns = false;
    this.saveshowhide = true;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidereturned = false;
    this.hiddendate = true;
  }

  GridColumnsHide() {
    // this.cleared = 0;
    // this.returned = 0;
    this.showhidegridcolumns = true;
    this.saveshowhide = false;
    this.hiddendate = false;
   // this.CountOfRecords();
  }

  CountOfRecords() {
    this.all = 0;
    this.chequesdeposited = 0;
    this.onlinereceipts = 0;
    this.cleared = 0;
    this.returned = 0;
    this.all = this.ChequesInBankData.length;
    for (let j = 0; j < this.ChequesInBankData.length; j++) {
      if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE") {
        this.onlinereceipts = this.onlinereceipts + 1;
      }
    }
    for (let i = 0; i < this.ChequesInBankData.length; i++) {
      if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
        this.chequesdeposited = this.chequesdeposited + 1;
      }
    }
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
        this.cleared = this.cleared + 1;
      }
    }
    for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
      if (this.ChequesClearReturnData[i].pchequestatus == "R") {
        this.returned = this.returned + 1;
      }
    }
  }

  SelectBank(event) {
    debugger
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
    // this.bankaccountnumber = this.bankdetails.pbankaccountnumber;
    // if(this.bankdetails.ptobrsdate!=null){
    //   this.brsdate = this.datepipe.transform(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate), 'dd/MM/yyyy');
    //   this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
    //   this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
    // }
    // else{
    //   this.brsdate=""
    // }
    // if(this.bankdetails.pfrombrsdate!=null){
    //   this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
    //   this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
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
    this.GetChequesInBank(this.bankid);
    this.GetBankBalance(this.bankid);
    this.ChequesInBankForm.controls.SearchClear.setValue('');
  }

//   CheckedClear(event, data) {
//     debugger;
//     if (event.target.checked == true) {
// this.checkedorNot  = event.target.checked;
// console.log(this.checkedorNot);

//       data.pdepositstatus = '';
//             data.preturnstatus = '';
//             data.pchequestatus = "";

//       let currentDate = new Date();
      
//       currentDate.setMonth(currentDate.getMonth() - 3);
//       console.log(currentDate);

//       let transdate=this.datepipe.transform(this.ChequesInBankForm.controls.ptransactiondate.value,'dd/MM/yyyy');
//       let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.pdepositeddate);
//      let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate)
//           if(receiptdate  >= currentDate){
//             data.pdepositstatus = true;
//             data.preturnstatus = false;
//             data.pchequestatus = "Y";
//            }
//           else{
//             data.pdepositstatus = false;
//             data.pchequestatus = "N";
//               $('#' + event.target.id + ''). prop("checked", false);
//               this._commonService.showWarningMessage("Transaction Date Should be Greater than Deposited Date");
//           } 
//     }
//     else {
//       this.checkedorNot = false;
//       data.pdepositstatus = false;
//       data.pchequestatus = "N";
//     }
//     for (let i = 0; i < this.gridData.length; i++) {
//       if (this.gridData[i].preceiptid == data.preceiptid) {
//          //
//        let txtentereddata = document.getElementById(`txtenterdata_${data.preceiptid}`) as HTMLInputElement;
//         if(txtentereddata.value == '' && event.target.checked == true){
//           this._commonService.showWarningMessage("Please Enter Data For Checked Field");
//           return;
//         }
//         else if(event.target.checked == true && txtentereddata.value != ''){
//           //this.gridData[i] = 
//         }
//         this.gridData[i] = data;
//         break;
//       }
//     }
//   }



  CheckedClear(event, data) {
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
    data.pchequestatusnarration = '';

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);

    const transdate = this.datepipe.transform(this.ChequesInBankForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
    const receiptdate = this._commonService.formatDateFromDDMMYYYY(data.pdepositeddate);
    const transactiondate = this._commonService.formatDateFromDDMMYYYY(transdate);

    if (receiptdate >= currentDate) {
      data.pdepositstatus = true;
      data.preturnstatus = false;
      data.pchequestatus = "Y";
    } else {
      data.pdepositstatus = false;
      data.pchequestatus = "N";
      $('#' + event.target.id).prop("checked", false);
      this._commonService.showWarningMessage("Transaction Date Should be Greater than Deposited Date");
    }

    this.updateGridData(data, event);
  }

  unsetCheckedStatus(data) {
    debugger;
    data.pdepositstatus = false;
    data.pchequestatus = "N";
    this.updateGridData(data, null);
    data.pchequestatusnarration = '';
  }

  updateGridData(data, event) {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
      if (this.gridData[i].preceiptid == data.preceiptid) {
          if(event && data.pchequestatusnarration == ''){
            //this._commonService.showWarningMessage("Please Enter Data For Checked Field");
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

  // CheckedReturn(event, data) {
  //   debugger;
  //   this.PopupData = data;
  //   if (event.target.checked == true) {
  //     let transdate=this.datepipe.transform(this.ChequesInBankForm.controls.ptransactiondate.value,'dd/MM/yyyy');
  //     let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.pdepositeddate);
  //    let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate)
  //         if(transactiondate >= receiptdate){
  //           data.preturnstatus = true;
  //           data.pdepositstatus = false;
  //           data.pchequestatus = "R";
  //           $("#cancelcharges").val(data.pcancelcharges);
  //           this.chequenumber = data.pChequenumber;
  //           $('#add-detail').modal('show');
  //          }
  //         else{
  //           data.preturnstatus = false;
  //           data.pchequestatus = "N";
  //             $('#' + data.preceiptid + ''). prop("checked", false);
  //             this._commonService.showWarningMessage("Transaction Date Should be Greater than Deposited Date");
  //         } 
     
  //   }
  //   else {
  //     data.preturnstatus = false;
  //     data.pchequestatus = "N";
  //     let txtentereddata = document.getElementById('txtenterdata') as HTMLInputElement;
  //     txtentereddata.value == '';
  //   }
  //   for (let i = 0; i < this.gridData.length; i++) {
  //     if (this.gridData[i].preceiptid == data.preceiptid) {
  //       this.gridData[i] = data;
  //       break;
  //     }
  //   }
  // }

  CheckedReturn(event, data) {
    debugger;
    if (event.target.checked) {
      this.setCheckedStatusReturn(data, event);
    } else {
      this.unsetCheckedStatusReturn(data);
    }
  }

  setCheckedStatusReturn(data, event) {
    debugger;
    data.pdepositstatus = '';
    data.preturnstatus = '';
    data.pchequestatus = "";
    data.pchequestatusnarration = '';
    this.PopupData = data;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);

      let transdate=this.datepipe.transform(this.ChequesInBankForm.controls.ptransactiondate.value,'dd/MM/yyyy');
      let receiptdate=this._commonService.formatDateFromDDMMYYYY(data.pdepositeddate);
     let  transactiondate=this._commonService.formatDateFromDDMMYYYY(transdate);

     if(transactiondate >= receiptdate){
      data.pdepositstatus = false;
      data.preturnstatus = true;
      data.pchequestatus = "R";
      $("#cancelcharges").val(data.pcancelcharges);
      this.chequenumber = data.pChequenumber;
      $('#add-detail').modal('show');
    } else {
      data.pdepositstatus = false;
      data.pchequestatus = "N";
      data.preturnstatus = false;
      $('#' + event.target.id).prop("checked", false);
      this._commonService.showWarningMessage("Transaction Date Should be Greater than Deposited Date");
    }

    this.updateGridDataReturn(data, event);
  }

  unsetCheckedStatusReturn(data) {
    debugger;
    data.pdepositstatus = false;
    data.pchequestatus = "N";
    data.preturnstatus = false;
    this.updateGridDataReturn(data, null);
    data.pchequestatusnarration = '';
  }

  updateGridDataReturn(data, event) {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
      if (this.gridData[i].preceiptid == data.preceiptid) {
          if(event && data.pchequestatusnarration == ''){
            //this._commonService.showWarningMessage("Please Enter Data For Checked Field");
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

  Save() {
    debugger
    this.DataForSaving = [];
   
    let isValid = true;
    if (this.checkValidations(this.ChequesInBankForm, isValid)) {
      
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].pchequestatus == "Y" || this.gridData[i].pchequestatus == "R") {
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

          this.DataForSaving[i].pCreatedby=this._commonService.pCreatedby;
          this.DataForSaving[i].pchequedate=this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].pchequedate);
          this.DataForSaving[i].pdepositeddate=this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].pdepositeddate);
          this.DataForSaving[i].preceiptdate=this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].preceiptdate);
          this.DataForSaving[i].pchequestatusnarration = this.DataForSaving[i].pchequestatusnarration +"-"+ lastTwoDigits;
          
        }
       
        this.ChequesInBankForm.controls.pchequesOnHandlist.setValue(this.DataForSaving);
        this.disablesavebutton = true;
        this.buttonname = "Processing";
        let form = JSON.stringify(this.ChequesInBankForm.value);
        this._accountingtransaction.SaveChequesInBank(form).subscribe(data => {
          
          if (data) {
            this._commonService.showInfoMessage("Saved Successfully");
            this.Clear();
          }
          this.disablesavebutton = false;
          this.buttonname = "Save";
        }, error => { this._commonService.showErrorMessage(error);
        this.disablesavebutton = false;
        this.buttonname = "Save";
        this.Clear()});
      }
      else{
        if(this.checkedorNot == true){
          this._commonService.showWarningMessage("You Cant clear the cheque because it is more than 3 months ");
          this.disablesavebutton = false;
        this.buttonname = "Save";
         return;
        }
         this._commonService.showWarningMessage("Please Select any One Check Box in Grid");
          this.disablesavebutton = false;
        this.buttonname = "Save";
         return;
      }
     
    }
  }

  Clear() {
    
    this.ChequesInBankForm.reset();
    this.ngOnInit();
    $("#bankselection").val("");
    this.ChequesInBankValidation = {};
  }

  ShowBrsClear() {
    
    this.gridData = [];
    this.cleared = 0;
    let fromdate = this.ChequesInBankForm.controls['pfrombrsdate'].value;
    let todate = this.ChequesInBankForm.controls['ptobrsdate'].value;
    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate == false) {
      fromdate = this.datepipe.transform(fromdate,'dd-MMM-yyyy')
      todate = this.datepipe.transform(todate,'dd-MMM-yyyy')
      this.validatebrsdateclear = false;
      this.GetDataOnBrsDates(fromdate, todate, this.bankid)
    if(this.bankid==0){
      this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
      this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
    }
    else{
      this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
      this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
    }
     
    }
    else {
      this.validatebrsdateclear = true;
    }
  }

  ShowBrsReturn() {
    
    this.gridData = [];
    this.returned = 0;
    let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
    let todate = this.BrsDateForm.controls['tobrsdate'].value;
    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate == false) {
      fromdate = this.datepipe.transform(fromdate,'dd-MMM-yyyy')
      todate = this.datepipe.transform(todate,'dd-MMM-yyyy')
      this.validatebrsdatereturn = false;
        this.GetDataOnBrsDates(fromdate, todate, this.bankid);
    if(this.bankid==0){
      this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
      this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
    }
    else{
      this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
      this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
    }
    }
    else {
      this.validatebrsdatereturn = true;
    }
  }

  GetDataOnBrsDates(frombrsdate, tobrsdate, bankid) {
    debugger;

    this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid).subscribe(
      clearreturndata => {
        
        let kk = [];
        this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
        for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
          if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "Y") {
            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
            this.cleared = this.cleared + 1;
          }
          if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
            kk.push(this.ChequesClearReturnDataBasedOnBrs[i])
            this.returned = this.returned + 1;
          }
        }
        this.gridData = kk;
      }, error => { this._commonService.showWarningMessage(error) })
  }

  CancelChargesOk(value) {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
            this.gridData[i].pactualcancelcharges = value;
        }
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

  DateChange(event){
    debugger
    this.GetChequesInBank(this.bankid)
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
            field: 'ppartyname',
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
          this.ChequesInBankValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ChequesInBankValidation[key] += errormessage + ' ';
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
