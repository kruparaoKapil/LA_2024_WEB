import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BankbookService } from 'src/app/Services/Accounting/bankbook.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';
import { GroupDescriptor, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import Rx from 'rxjs/Rx';

@Component({
  selector: 'app-bank-recon-statment',
  templateUrl: './bank-recon-statment.component.html',
  styles: []
})
export class BankReconStatmentComponent implements OnInit {
  public hdnTranDate = true;
  public loading = false;
  public BRStatmentForm: FormGroup;
  public submitted = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public bankData: any;
  public gridView: any;
  public startDate: any;
  public bankname: any;
  public pBankBookBalance = 0;
  public show = false;
  public chequesdepositedbutnotcredited: any;
  public CHEQUESISSUEDBUTNOTCLEARED: any;
  public Balanceasperbankbook: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public pBankBookBalancenagitive: any;
  public aggregates: any[] = [{ field: 'ptotalreceivedamount', aggregate: 'sum' }];
  public groups: GroupDescriptor[] = [{ field: 'pGroupType', aggregates: this.aggregates }];
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _bankBookService: BankbookService, public toaster: ToastrService, private brstatement: BrStatementService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.submitted = false;
    this.BRStatmentForm = this.formbuilder.group({
      fromDate: [this.today],
      pbankname: ['', Validators.required]
    })
    this.bankBookDetails();
  }
  get f() { return this.BRStatmentForm.controls; }

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


  public bankBookDetails() {
    this._bankBookService.GetBankNames().subscribe(res => {

      this.bankData = res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  public getBRStatmentReports() {
    debugger
    this.gridView = [];
    this.bankname = '';
    this.startDate = '';
    this.show = false;
    this.submitted = true;
    if (this.BRStatmentForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {

        this.BRStatmentForm.value;
        let fromDate = this.BRStatmentForm['controls']['fromDate'].value;
        let pbankname = this.BRStatmentForm['controls']['pbankname'].value;
        let filterResult: any = this.bankData.filter(u =>
          u.pbankaccountid == pbankname);

        this.bankname = filterResult[0].pbankname
        // this.bankname = this.bankData.filter(item => item.pbankaccountid === pbankname);
        fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
        this.startDate = this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, "dd-MMM-yyyy");
        this.brstatement.GetBrStatementReportbyDates(fromDate, pbankname).subscribe(res => {

          this.gridView = res;

          if (this.gridView != '') {
             //this.gridView = this.gridView.filter(x => x.ptransactiondate = this._CommonService.getFormatDate(x.ptransactiondate));
            let TotalAmount = this.gridView[0]['pBankBookBalance'].toFixed(2);
            this.chequesdepositedbutnotcredited = this.gridView.filter(item => item.pGroupType === 'CHEQUES DEPOSITED BUT NOT CREDITED')
              .reduce((chequesdepositedbutnotcredited, current) => chequesdepositedbutnotcredited + current.ptotalreceivedamount, 0);

            this.CHEQUESISSUEDBUTNOTCLEARED = this.gridView.filter(item => item.pGroupType === 'CHEQUES ISSUED BUT NOT CLEARED')
              .reduce((CHEQUESISSUEDBUTNOTCLEARED, current) => CHEQUESISSUEDBUTNOTCLEARED + current.ptotalreceivedamount, 0);
            let bankblnce = TotalAmount - this.chequesdepositedbutnotcredited + this.CHEQUESISSUEDBUTNOTCLEARED;

            this.Balanceasperbankbook = bankblnce < 0 ? '(' + this._CommonService.currencyformat(Math.abs(bankblnce)) + ')' : this._CommonService.currencyformat(bankblnce);

            this.pBankBookBalance = TotalAmount;

        

            this.savebutton = 'Generate Report';
            this.show = true;
            this.isLoading = false;
            this.loading = false;

          } else {
            this.savebutton = 'Generate Report';
            this.show = false;
            this.isLoading = false;
            this.loading = false;
          }

        },
          (error) => {
            this.showErrorMessage(error);
            this.isLoading = false;
            this.savebutton = 'Generate Report';
            this.loading = false;
          });


      } catch (e) {
        this.showErrorMessage(e);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
      if(this.gridView.length == 0){
        let pbankname = this.BRStatmentForm['controls']['pbankname'].value;
        this.brstatement.GetBrsamoune(pbankname).subscribe(resss => {
          this.show = true;
          this.pBankBookBalance = resss['pBankBookBalance'];
          this.chequesdepositedbutnotcredited = 0;
          this.CHEQUESISSUEDBUTNOTCLEARED = 0;
          this.Balanceasperbankbook = this.pBankBookBalance;
        })
      }
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
          <title>Bank Reconciliation Report</title>
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
