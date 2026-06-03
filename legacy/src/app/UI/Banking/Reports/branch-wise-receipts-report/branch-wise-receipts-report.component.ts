import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from "@angular/common";
import { Page } from 'src/app/UI/Common/Paging/page'
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
@Component({
  selector: 'app-branch-wise-receipts-report',
  templateUrl: './branch-wise-receipts-report.component.html',
  styles: []
})
export class BranchWiseReceiptsReportComponent implements OnInit {
  MemberwisereceiptForm: FormGroup;
  frommonthof: any;
  public today: Date = new Date();
  tomonthof: any;
  frommonthof1: any;
  tomonthof1: any;
  pDatetype: ['ASON'];
  displaytodate = "As On";
  public loading = false;
  public isLoading = false;
  validation = false;
  pdatecheked = "ASON";
  public betweenorason = "As On";

  membername = 0;
  membertype: any
  public savebutton = 'Show';
  getmemberreceipt: any;
  showFrommonth: any;
  showTomonth: any;
  selecteddate = true;
  formValidationMessages: any;
  fromdate: any;
  todate: any;
  date: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  table: any;
  returndata: any[];
  Memberwisereceiptlist: any;
  MemberwisereceiptErrors: any
  membernameid="undefined";
  commencementgridPage = new Page();
  startindex: any;
  endindex: any;
  Branchdetails: any = [];
  branchWiseList: any = [];
  branchNames: any;
  constructor(private FB: FormBuilder, private _LAReportsService: LAReportsService, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private exportAsService: ExportAsService, private _fdrdttranscationservice:FdRdTransactionsService) {

    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.MemberwisereceiptForm = this.FB.group({

      pDatetype: ['ASON', Validators.required],
      pFromMonthOf: [this.today, Validators.required],
      pToMonthOf: [this.today, Validators.required],

      pmemberid: ['0', Validators.required],
      pmembername:[''],
    })
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 3;
    this.startindex = 0;
    this.endindex = this.commencementgridPage.size;
    this.commencementgridPage.totalElements = 3;
    this.DatetypeChange('ASON');
    this.date = new Date();
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.MemberwisereceiptForm['controls']['pToMonthOf'].setValue(this.date);
    this.MemberwisereceiptErrors = {};
    this.GetMemberdetails();

  }
  GetMemberdetails() {

    this._LAReportsService.GetMemberdetails().subscribe(result => {
      debugger;
      this.getmemberreceipt = result;

    })
    this.GetBranchdetails();
  }
  GetBranchdetails() {

    this._fdrdttranscationservice.Getbranchdetails().subscribe(res => {
      debugger
      this.Branchdetails = res
    })

  }
  DatetypeChange(type) {
    debugger;

    if (type == "ASON") {
      this.MemberwisereceiptForm['controls']['pToMonthOf'].setValue(this.date);
      this.showFrommonth = false;
      this.showTomonth = true;
      this.displaytodate = "As On";
      this.pdatecheked = "ASON";
      this.betweenorason="As On";
    }
    else if (type == "BETWEEN") {
      this.MemberwisereceiptForm['controls']['pFromMonthOf'].setValue(this.date);
      this.MemberwisereceiptForm['controls']['pToMonthOf'].setValue(this.date);
      this.showFrommonth = true;
      this.showTomonth = true;
      this.displaytodate = "To Date";
      this.pdatecheked = "BETWEEN";
      this.betweenorason="Between";
    }
    else {
      this.showFrommonth = false;
      this.showTomonth = false;
      this.displaytodate = "Month Of";

    }
    //this.datechangevalidations(type);
    //this.cleardatechange();

  }
  FromDateChange($event: any) {
    debugger;

    this.frommonthof = $event;
    this.Memberwisereceiptlist = [];
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    if (this.pdatecheked == "BETWEEN") {
      if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
        this.validatedates();
      }
    }

  }
  ToDateChange($event: any) {
    debugger;
    this.Memberwisereceiptlist = [];
    this.tomonthof = $event;
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    if (this.pdatecheked == "BETWEEN") {
      if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
        this.validatedates();
      }
    }

  }
  validatedates() {

    if (this.fromdate > this.todate) {
      this.validation = true
    }
    else {
      this.validation = false;
    }

  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }
  Member_change($event: any) {
    debugger;
    this.Memberwisereceiptlist = [];
   this.membername = $event.target.value;
   this.membernameid=$event.target.options[$event.target.selectedIndex].text;   
  }
  Getmemberwisereceiptdetails() {
    debugger;
    if (this.showbtnvalidation) {
      this.Memberwisereceiptlist = [];
      debugger;
      this.frommonthof = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
      this.tomonthof = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
      this._LAReportsService.ShowmemberreceiptReport(this.membername, this.frommonthof, this.tomonthof, this.pdatecheked).subscribe(result => {
        if (result != null) {
          this.Memberwisereceiptlist = result
        }

        console.log("Grid data", this.Memberwisereceiptlist)

      })

    }


  }
  branchChange(event){
    debugger
 this.branchNames =    event.target.options[event.target.selectedIndex].text;

  }

  showBrancwiseReceiptsReport(){
    debugger;
    this.frommonthof = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.tomonthof = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    let memberId = this.MemberwisereceiptForm.controls.pmemberid.value;
    this._LAReportsService.showBrancwiseReceiptsReport(memberId,this.branchNames,this.frommonthof,this.tomonthof,this.pdatecheked).subscribe(results => {
      this.branchWiseList = results;
    })
  }


  showbtnvalidation() {
    debugger
    let pmemberid = <FormGroup>this.MemberwisereceiptForm['controls']['pmemberid'];
    let pFromMonthOf = <FormGroup>this.MemberwisereceiptForm['controls']['pFromMonthOf'];
    let pToMonthOf = <FormGroup>this.MemberwisereceiptForm['controls']['pToMonthOf'];



    pmemberid.setValidators(Validators.required)
    pToMonthOf.setValidators(Validators.required)
    if (this.pdatecheked == 'BETWEEN') {
      pFromMonthOf.setValidators(Validators.required)
    }
    pFromMonthOf.updateValueAndValidity();
    pToMonthOf.updateValueAndValidity();
    pmemberid.updateValueAndValidity();



  }
  // pdf() {
  //   debugger;
  //   let temp;
  //   let rows = [];
  //   let type;
  //   let gridheaders;
  //   let reportname = "Member Wise Receipt";

  //   gridheaders = ["Advance Account No.", "Scheme Name", "Advance Amount", "Advance Date", "FD Receipt Date", "Receipt Date", "Installment Amount", "Received Amount", "ModeofReceipt", "Agent Name", "Commission Percentage"];

  //   let colWidthHeight = {
  //     paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
  //   }

  //   let data = "true"
  //   if (data == "true") {
  //     this.returndata = this._CommonService._getGroupingGridExportData(this.Memberwisereceiptlist, "pMembername", false)
  //   }
  //   else {
  //     this.returndata = this.Memberwisereceiptlist
  //   }
  //   this.returndata.forEach(element => {
  //     let deposit;
  //      let fdreceiptdate;
  //      let receiptdate1;
  //     let depositedate = element.pDepositdate;
  //     let Fdreceiptdate = element.pFDReceiptDate;
  //     let receiptdate = element.pReceiptDate;
  //     // if (depositedate !== null) {
  //     //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositedate);
  //     //   deposit = this.datepipe.transform(DateFormat3, 'yyyy-MM-dd')
  //     // }
      

  //     // else {
  //     //   deposit = depositedate;
  //     // }
  //     // if (Fdreceiptdate !== null) {
  //     //   let DateFormat4 = this._CommonService.formatDateFromYYYYMMDD(Fdreceiptdate);
  //     //   maturity = this.datepipe.transform(DateFormat4, 'MM/dd/yyyy')
  //     // }
  //     // else {
  //     //   maturity = Fdreceiptdate;
  //     // }
  //     // if (receiptdate !== null) {
  //     //     let DateFormat5 = this._CommonService.formatDateFromYYYYMMDD(receiptdate);
  //     //     payment = this.datepipe.transform(DateFormat5, 'dd-MM-yyyy')
  //     // }
  //     // else {
  //     //     payment = receiptdate;
  //     // }
  //     deposit=depositedate;
  //     fdreceiptdate=Fdreceiptdate;
  //     receiptdate1=receiptdate;

  //     let pDepositamount = this._CommonService.currencyformat(parseFloat(element.pDepositamount).toFixed(2));
  //     let pCommissionValue = this._CommonService.currencyformat(parseFloat(element.pCommissionValue).toFixed(2));
  //     let pInstallmentamount = this._CommonService.currencyformat(parseFloat(element.pInstallmentamount).toFixed(2));
  //     let pReceivedamount = this._CommonService.currencyformat(parseFloat(element.pReceivedamount).toFixed(2));
  //     if (element.group !== undefined) {
  //       temp = [element.group, element.pFdAccountNo, element.pSchemename, pDepositamount, deposit, fdreceiptdate, receiptdate1, pInstallmentamount, pReceivedamount, element.pModeofReceipt, element.pAgentName, pCommissionValue,];
  //     }

  //     else {
  //       temp = [element.pFdAccountNo, element.pSchemename, pDepositamount, deposit, fdreceiptdate, receiptdate1, pInstallmentamount, pReceivedamount, element.pModeofReceipt, element.pAgentName, pCommissionValue,];
  //     }


  //     rows.push(temp);
  //   });
  //   // pass Type of Sheet Ex : a4 or lanscspe  
  //   this._CommonService._downloadReportsPdf1(reportname, rows, gridheaders, colWidthHeight, "landscape",this.betweenorason, this.frommonthof, this.tomonthof);



  // }

  pdf() {
    debugger;
    let temp;
    let rows = [];
    let type;
    let gridheaders;
    let reportname = "Branch Wise Receipt";
   
    gridheaders = ["Advance Account No.","Scheme Name","Advance Amount",  "Advance Date","Advance Receipt Date", "Received Amount",  "Mode of Receipt", "Agent Name", "Commission Percentage","Receipt No.","Cheque Status"];
    
    let colWidthHeight = {
       // paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
       0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' ,halign: 'right'  }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto',halign: 'right'}, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto'  },8: { cellWidth: 'auto'  },9: { cellWidth: 'auto' },10: { cellWidth: 'auto' }
    }

    let data = "true"
    if (data == "true") {
      debugger;
        this.returndata = this._CommonService._getGroupingGridExportData(this.branchWiseList, "pBranchname", false)
    }
    else {
        this.returndata = this.branchWiseList
    }
    debugger;
    this.returndata.forEach(element => {
      debugger;
      let depositedate;
      let depositdate = element.pDepositdate;
      // if (depositdate !== null) {
      //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositdate);
      //   depositedate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
      // }
      let FDRecepitdate;
      let fddate = element.pFDReceiptDate;
      // if (mdate !== null) {
      //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(mdate);
      //   maturitydate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
      // }
      let date;
      let ReceiptDate = element.pReceiptDate;
      depositedate=depositdate;
      FDRecepitdate=fddate;
    //  date=ReceiptDate
      let pDepositamount = this._CommonService.currencyformat(parseFloat(element.pDepositamount).toFixed(2));
      let pInstallmentamount = this._CommonService.currencyformat(parseFloat(element.pInstallmentamount).toFixed(2));
      let pReceivedamount = this._CommonService.currencyformat(parseFloat(element.pReceivedamount).toFixed(2));
     debugger;
        if (element.group !== undefined) {
            temp = [element.group,  element.pFdAccountNo ,element.pSchemename, pDepositamount,depositedate, FDRecepitdate,  pReceivedamount,element.pModeofReceipt,element.pAgentName,element.pCommissionValue,element.pReceiptVoucherno,,element.pChequeStatus];
        }
        else {
            temp = [element.pFdAccountNo ,element.pSchemename,pDepositamount,depositedate, FDRecepitdate, pReceivedamount, element.pModeofReceipt,element.pAgentName,element.pCommissionValue,element.pReceiptVoucherno,,element.pChequeStatus];
        } 


        rows.push(temp);
});
    // pass Type of Sheet Ex : a4 or lanscspe  
    debugger;
    this._CommonService._downloadReportsPdfmemberwisereceipt(reportname, rows, gridheaders, colWidthHeight, "landscape",this.betweenorason, this.frommonthof, this.tomonthof,this.membernameid);



}

  // Validation Methods ---------------
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
          this.MemberwisereceiptErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.MemberwisereceiptErrors[key] += errormessage + ' ';
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
  // End Validation Methods --------------

}
