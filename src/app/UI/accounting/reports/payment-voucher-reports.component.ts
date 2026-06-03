import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../Services/common.service';
import { DatePipe } from '@angular/common';
import { PaymentVoucherService } from 'src/app/Services/Accounting/payment-voucher.service';

@Component({
  selector: 'app-payment-voucher-reports',
  templateUrl: './payment-voucher-reports.component.html',
  styles: []
})
export class PaymentVoucherReportsComponent implements OnInit {
  public loading = false;
  public paymentVouecherServicesData: any = [];
  public paymentVouecherServicesDataErrors: any;
  public today: number = Date.now();
  public todayDate: any;
  public printFileName: any;
  public paymentDate: any;
  public totalParticulars: any = [];
  public tempPaymentData: any = [];
  public pvnumber: any;
  public receiptName: any;
  constructor(private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _paymentVouecherServices: PaymentVoucherService, private Datepipe: DatePipe, private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    debugger;
    this.todayDate = this.Datepipe.transform(this.today, "dd-MMM-yyyy h:mm:ss a");
    //const routeParams = this.activatedroute.snapshot.params['id'];
    const routeParams: string = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",");
    this.pvnumber = splitData[0];
    this.receiptName = splitData[1];
    this.GetPaymentVoucherReportDataById(this.pvnumber);
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
    debugger;
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

  /**
   * GetPaymentVoucherReportDataById
   */
  public GetPaymentVoucherReportDataById(PaymentVoucherId) {
    debugger;
    this._paymentVouecherServices.GetPaymentVoucherbyId(PaymentVoucherId).subscribe(res => {
      debugger;
      this.tempPaymentData = res;
      let totamount: number = 0;
      let gstamount: number = 0;
      let tdsamount: number = 0;
      this.tempPaymentData.filter(function (Details) {
        Details["totvalue"] = 0;
        Details["gstvalue"] = 0;
        return Details;
      });
      for (let i = 0; i < this.tempPaymentData.length; i++) {
        totamount = this.tempPaymentData[i].ppaymentslist.reduce((sum, item) => sum + item.pLedgeramount, 0);
        gstamount = this.tempPaymentData[i].ppaymentslist.reduce((sum, item) => sum + item.pcgstamount + item.psgstamount + item.pigstamount, 0);
        tdsamount = this.tempPaymentData[i].ppaymentslist.reduce((sum, item) => sum + item.ptdsamount, 0);
        this.tempPaymentData[i].totvalue = totamount.toFixed(2);
        this.tempPaymentData[i].gstvalue = gstamount.toFixed(2);
        this.tempPaymentData[i].tdsvalue = tdsamount.toFixed(2);
        totamount = 0;
        gstamount = 0;
        tdsamount = 0;
      }


      var y = 0;
      var leng = this.tempPaymentData.length


      while (y < leng) {
        var x = 0;
        var len = this.tempPaymentData[x].ppaymentslist.length
        
        while (x < len) {
          let pLedgeramountfixed = this.tempPaymentData[y].ppaymentslist[x].pLedgeramount.toFixed(2);
          this.tempPaymentData[y].ppaymentslist[x].pLedgeramount = pLedgeramountfixed;
          x++
        }
        y++;
      }

    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  /**Print and Pdf General Receipt */
  // print() {
  //   let printContents, popupWin;
  //   printContents = document.getElementById('temp-box').innerHTML;
  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //   popupWin.document.open();
  //   popupWin.document.write(`
  //     <html>
  //       <head>
  //         <title>Payment Voucher</title>
  //         <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
  //          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
  //          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
  //          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
  //        <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
  //         <style>
  //         //........Customized style.......
  //         </style>
  //       </head>
  //   <body onload="window.print();window.close()">${printContents}</body>
  //     </html>`
  //   );
  //   popupWin.document.close();
  // }

}
