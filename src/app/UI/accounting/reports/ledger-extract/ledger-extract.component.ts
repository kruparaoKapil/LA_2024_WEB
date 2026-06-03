import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor,SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { LedgerExtractReportService } from 'src/app/Services/Accounting/ledger-extract-report.service';
@Component({
  selector: 'app-ledger-extract',
  templateUrl: './ledger-extract.component.html',
  styles: [`.k-grid table td:nth-child(4) {
     text-align: right !important; 
}`]
})
export class LedgerExtractComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public savebutton = 'Generate Report';
  public submitted = false;
  public ledgerExtractReportForm: FormGroup;
  public today: Date = new Date();
  public hdnCol = true;
  public isLoading = false;
  public loading = false;
  public startDate: any = new Date();
  public endDate: any = new Date();
  public paymentVouecherServicesData: any;
  public ledgerextractData: any = [];
  public totaldebitamount: any;
  public totalcreditamount: any;
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  public aggregates: any[] = [{ field: 'pdebitamount', aggregate: 'sum' }, { field: 'pcreditamount', aggregate: 'sum' }, { field: "totaldebitamount", aggregate: "sum" }, { field: "totalcreditamount", aggregate: "sum" }];
  public groups: GroupDescriptor[] = [{ field: 'pparentname', aggregates: this.aggregates }, { field: 'paccountname', aggregates: this.aggregates }];

  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private toaster: ToastrService, private _ledgerExtractreport: LedgerExtractReportService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    this.startDate = this.datePipe.transform(this.startDate, "dd-MMM-yyyy");
    this.endDate = this.datePipe.transform(this.endDate, "dd-MMM-yyyy");
    this.ledgerExtractReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    });
    this.getledgerExtractReports();
  }
  get f() { return this.ledgerExtractReportForm.controls; }
  public ToDateChange(event) {
    this.dpConfig1.minDate = event;
  }
  public FromDateChange(event) {
    this.dpConfig.maxDate = event;
  }
  public getledgerExtractReports() {
    debugger
    this.submitted = true;
    if (this.ledgerExtractReportForm.valid) {
      this.loading = true
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        let fromDate = this.ledgerExtractReportForm['controls']['fromDate'].value;
        let toDate = this.ledgerExtractReportForm['controls']['toDate'].value;
        this.startDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
        this.endDate = this.datePipe.transform(toDate, "dd-MMM-yyyy");
        this._ledgerExtractreport.GetLedgerExtractReport(this.startDate, this.endDate).subscribe(res => {
          debugger
          this.ledgerextractData = res;
          if (this.ledgerextractData.length > 0) {
        
            let tc = this.ledgerextractData.reduce((sum, c) => sum + c.pdebitamount, 0);
            this.totaldebitamount = parseFloat(Number(tc).toFixed(2));
            //this.totaldebitamount = parseFloat(this.totaldebitamount).toFixed(2);
            this.totalcreditamount = this.ledgerextractData.reduce((sum, c) => sum + c.pcreditamount, 0);
            this.totalcreditamount = parseFloat(Number(this.totalcreditamount).toFixed(2));
          }
          this.isLoading = false;
          this.savebutton = 'Generate Report';
          this.loading = false;
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
          <title>Ledger Extract</title>
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
}
