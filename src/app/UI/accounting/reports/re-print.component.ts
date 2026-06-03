import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ReprintService } from 'src/app/Services/Accounting/reprint.service';

@Component({
  selector: 'app-re-print',
  templateUrl: './re-print.component.html',
  styles: []
})
export class RePrintComponent implements OnInit {
  public loading = false;
  public RePrintForm: FormGroup;
  public submitted = false;
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public reprintData: any;
  public gridView: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public recordid: any;
  public Transactiontypename: string;
  public TransactiontypeData: string;
  public receiptno: any;
  public generalreceiptreportsshow = false;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, public toaster: ToastrService, private reprintservices: ReprintService) { }

  ngOnInit() {
    
    this.submitted = false;
    this.transctionTypes();
    this.RePrintForm = this.formbuilder.group({
      Transactiontype: ['', Validators.required],
      TransactionNo: ['', Validators.required]
    })
  }
  get f() { return this.RePrintForm.controls; }

  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
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
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
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
  public BlurEventAllControll(fromgroup: FormGroup) {
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
  public setBlurEvent(fromgroup: FormGroup, key: string) {
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
  public transctionTypes() {
    this.reprintservices.GetTransactiontypeData().subscribe(res => {
      
      this.TransactiontypeData = res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  receiptnos: any;

  public getReprintReport() {
    debugger
    this.submitted = true;
   
    if (this.RePrintForm.valid) {
      this.generalreceiptreportsshow = false;
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      this.recordid = '';
      this.recordid = this.RePrintForm.controls['Transactiontype'].value;
      let sendreceiptno = this.RePrintForm.controls['TransactionNo'].value;
      this.reprintservices.GetReprintData(sendreceiptno, this.recordid).subscribe(res => {
        
        if (res == 0) {
          this.loading = false;
          this.generalreceiptreportsshow = false;
          this.toaster.info('Invalid Transaction Number');
          this.isLoading = false;
          this.savebutton = 'Generate Report';
          return;
        } else {
          this.loading = false;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
          this.receiptno = sendreceiptno;
          if (this.recordid == 1) {
            debugger
            //this.receiptnos = this.receiptno + ',' + 'General Receipt';
            //this.reprintservices._setreprintid(btoa(this.receiptno + ',' + 'General Receipt'));
            // this.generalreceiptreportsshow = true;
            
            window.open('/#/GeneralReceiptReportsDuplicate?id=' + btoa(this.receiptno + ',' + 'General Receipt'));
          
          }
          if (this.recordid == 2) {
            window.open('/#/PaymentVoucherReportsDuplicate?id=' + btoa(this.receiptno + ',' + 'Payment Voucher'));
          }
          if (this.recordid == 3) {
            window.open('/#/JournalvoucherReportDuplicate?id=' + btoa(this.receiptno + ',' + 'Journal Voucher'));
          }
        }

      },
        (error) => {
          this.showErrorMessage(error);
          this.isLoading = false;
          this.savebutton = 'Generate Report';
          this.loading = false;
        });
    }
  }
  public print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
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
