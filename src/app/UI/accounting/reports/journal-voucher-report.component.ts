import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { JournalVoucherService } from 'src/app/Services/Accounting/journal-voucher.service';
import { GroupDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-journal-voucher-report',
  templateUrl: './journal-voucher-report.component.html',
  styles: []
})
export class JournalVoucherReportComponent implements OnInit {
  public loading = false;
  public pCreatedby:any;
  public submitted = false;
  public JournalVoucherForm: FormGroup;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public today: number = Date.now();
  public todayDate: any;
  public JournalVoucherData: any;
  public paymentVouecherServicesData: any;
  public pJvDate: any;
  public pJvnumber: any;
  public pNarration: any;
  public pNarrationnull = false;
  public pDebitamount: any;
  public pCreditAmount: any;
  public receiptName: any;
  constructor(private Datepipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _JvReportService: JournalVoucherService, public toaster: ToastrService, private activatedroute: ActivatedRoute) {
  }


  ngOnInit() {
    debugger;
    this.pCreatedby = this._CommonService.pCreatedby;
    this.todayDate = this.Datepipe.transform(this.today, "dd-MMM-yyyy h:mm:ss a");
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",");
    this.pJvnumber = splitData[0];
    this.receiptName = splitData[1];
    this.GetJvReportbyid(this.pJvnumber);
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
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
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

  public GetJvReportbyid(ReceiptId) {
    debugger;
    this._JvReportService.GetJvReport(ReceiptId).subscribe(res => {
      debugger;
      this.JournalVoucherData = res;
      if (this.JournalVoucherData != '') {
        
        // this.pDebitamount = res.reduce((sum, item) => sum + item.pDebitamount, 0);
        // this.pCreditAmount = res.reduce((sum, item) => sum + item.pCreditAmount, 0);

        let damount = res.reduce((sum, item) => sum + item.pDebitamount, 0);
        this.pDebitamount = Number(damount).toFixed(2);

        let camount = res.reduce((sum, item) => sum + item.pCreditAmount, 0);
        this.pCreditAmount = Number(camount).toFixed(2);

        var x = 0;
        var len = this.JournalVoucherData.length;
        
        while (x < len) {
          let pDebitamountfixed = this.JournalVoucherData[x].pDebitamount.toFixed(2);
          this.JournalVoucherData[x].pDebitamount = pDebitamountfixed;

          let pCreditAmountfixed = this.JournalVoucherData[x].pCreditAmount.toFixed(2);
          this.JournalVoucherData[x].pCreditAmount = pCreditAmountfixed;

          x++
        }


        this.pJvDate = this.JournalVoucherData[0].pJvDate;
        this.pNarration = this.JournalVoucherData[0].pNarration;
      }
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
          <title>Journal-Voucher-Report</title>
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
