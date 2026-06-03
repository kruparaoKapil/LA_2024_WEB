import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralReceiptService } from 'src/app/Services/Accounting/general-receipt.service';
import { DatePipe } from '@angular/common';
import { ReprintService } from 'src/app/Services/Accounting/reprint.service';
import { saveAs } from '@progress/kendo-file-saver';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';
import { NumberToWordsPipe } from 'src/app/Pipes/number-to-words.pipe';
import { CommonService } from 'src/app/Services/common.service';
import { RePrintComponent } from 'src/app/UI/accounting/reports/re-print.component';

@Component({
  selector: 'app-general-receipt-report-duplicate',
  templateUrl: './general-receipt-report-duplicate.component.html',
  styles: []
})

export class GeneralReceiptReportDuplicateComponent implements OnInit {
  // @Input() generalreceiptID: string;
  // @Output() receipt: any;
  public generalreceiptID: any;
  public loading = false;
  public GeneralReceiptServiceData: any = [];
  public GroupcreationValidationErrors: any;
  public pGstno: any;
  public pAccountname: any;
  public pAmountinWords: any;
  public pContactname: any;
  public pCrdAccountId: any;
  public pLedgeramount: any;
  public pModeofreceipt: any;
  public pNarration: any;
  public pReceiptId: any;
  public pReceiptdate: any;
  public today: number = Date.now();
  public todayDate: any;
  public totalParticularsRs: any;
  public printFileName: any;
  public ReceiptIds: any;
  public pTypeofpayment: any;
  public pReferenceorChequeNo: any;
  public pPosted: any;
  public reprintID: any;
  public pChequedate: any;
  public receiptName: any;
  public totalGstAmt: any;
  public totalTdsAmt: any;
  a: any
  public totalParticularsRsinwords: any;
  pbankname: any;
  constructor(private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _GeneralReceiptService: GeneralReceiptService, private Datepipe: DatePipe, private activatedroute: ActivatedRoute, private _reprintservices: ReprintService) {
  }
  ngOnInit() {
    debugger
    this.a = 5000
    this.todayDate = this.Datepipe.transform(this.today, "dd-MMM-yyyy h:mm:ss a");
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",");
    this.generalreceiptID = splitData[0];
    this.receiptName = splitData[1];

    //let splitData = this.generalreceiptID.split(",");
    //this.generalreceiptID = splitData[0];
    // this.receiptName = splitData[1];
    this.getGeneralreceiptDatabyId(this.generalreceiptID);
  }

  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
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
          this.GroupcreationValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.GroupcreationValidationErrors[key] += errormessage + ' ';
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

  /**
   * getGeneralreceiptDatabyId
   */
  public getGeneralreceiptDatabyId(ReceiptId) {
    debugger
    this.loading = true;
    this._GeneralReceiptService.GetGeneralReceiptbyId(ReceiptId).subscribe(res => {
      this.GeneralReceiptServiceData = res;
      debugger;
      //this.GeneralReceiptServiceData = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList.map(x => x.pLedgeramount = parseFloat(Number(x.pLedgeramount).toFixed(2)));
      this.pGstno = this.GeneralReceiptServiceData['pGstno'];
      this.pAccountname = this.GeneralReceiptServiceData['pAccountname'];
      this.pAmountinWords = this.GeneralReceiptServiceData['pAmountinWords'];
      this.pContactname = this.GeneralReceiptServiceData['pContactname'];
      this.pCrdAccountId = this.GeneralReceiptServiceData['pCrdAccountId'];
      this.pLedgeramount = this.GeneralReceiptServiceData['pLedgeramount'];
      this.pModeofreceipt = this.GeneralReceiptServiceData['pModeofreceipt'];
      this.pNarration = this.GeneralReceiptServiceData['pNarration'];
      this.pTypeofpayment = this.GeneralReceiptServiceData['pTypeofpayment'];
      this.pReceiptId = this.GeneralReceiptServiceData['pReceiptId'];
      this.pPosted = this.GeneralReceiptServiceData['pPostedby'];
      let chequedate = this.GeneralReceiptServiceData['pChequedate'];
      this.pChequedate = this.Datepipe.transform(chequedate, "dd-MM-yyyy");
      this.pbankname = this.GeneralReceiptServiceData['pbankname'];
      this.pReferenceorChequeNo = this.GeneralReceiptServiceData['pReferenceorChequeNo'];
      let Receiptdate = this.GeneralReceiptServiceData['pReceiptdate'];
      this.pReceiptdate = this.Datepipe.transform(Receiptdate, "dd-MM-yyyy");
      let fReceiptdate = this.Datepipe.transform(Receiptdate, "ddMMyyyy");
      let ptodayDate = this.Datepipe.transform(this.today, "ddMMyyyyhmmssa");
      this.printFileName = "GR_" + this.pReceiptId + "_RD_" + fReceiptdate + "_PD_" + ptodayDate;
      let totalParticularsRsf = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList.reduce((sum, item) => sum + item.pLedgeramount, 0);
      this.totalParticularsRs = Number(totalParticularsRsf).toFixed(2);
      //this.totalParticularsRsinwords = Math.round(this.totalParticularsRs);
      this.totalGstAmt = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList.reduce((sum, item) => sum + item.pcgstamount, 0);
      this.totalGstAmt = parseFloat(Number(this.totalGstAmt).toFixed(2));
      this.totalTdsAmt = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList.reduce((sum, item) => sum + item.ptdsamount, 0);
      this.totalTdsAmt = parseFloat(Number(this.totalTdsAmt).toFixed(2));
      var x = 0;
      var len = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList.length
      while (x < len) {
        let pLedgeramountfixed = this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList[x].pLedgeramount.toFixed(2)
        this.GeneralReceiptServiceData.pGeneralReceiptSubDetailsList[x].pLedgeramount = pLedgeramountfixed;
        x++
      }
      this.ReceiptIds = '';
      this.loading = false;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  /**Print and Pdf General Receipt */
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>General Receipt</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  pdfs() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>General Receipt</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
