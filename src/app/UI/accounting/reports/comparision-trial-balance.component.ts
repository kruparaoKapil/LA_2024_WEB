import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { match } from 'minimatch';
import { isNullOrUndefined } from 'util';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-comparision-trial-balance',
  templateUrl: './comparision-trial-balance.component.html',
  styles: []
})
export class ComparisionTrialBalanceComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public submitted = false;
  ComparisionTBForm: FormGroup;
  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();
  from: any;
  to: any;
  public hdnparentaccountname = true;
  public totaldebitamount1: any;
  public totalcreditamount1: any;
  public totaldebitamount2: any;
  public totalcreditamount2: any;
  public totaldebitamount3: any;
  public totalcreditamount3: any;
  gridData: any = [];
  public loading = false;
  public isLoading = false;
  difference = 0;
  hideprint = true;
  public groups: GroupDescriptor[] = [{
    field: 'pparentaccountName', aggregates: [{ field: "pdebitamount1", aggregate: "sum" }, { field: "pcreditamount1", aggregate: "sum" }, { field: "pdebitamount2", aggregate: "sum" }, { field: "pcreditamount2", aggregate: "sum" }, { field: "pdebittotal", aggregate: "sum" }, { field: "pcredittotal", aggregate: "sum" }],
    }];

  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService) {
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
    this.submitted = true;
    
    this.ComparisionTBForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    })
    this.startDate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.endDate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.from = this.startDate;
    this.to = this.endDate;
   // this.GetComparisionTBReports();
  }
  OnBrsDateChanges(fromdate, todate): boolean {

    let isvalidate = true;
    if (todate != "") {
      if (fromdate > todate) {
        isvalidate = true;
      }
      else {
        isvalidate = true;
      }
    }
    return isvalidate;
  }

  GetComparisionTBReports() {
    
    this.loading = true;
    this.isLoading = true;
    let fromdate;
    let todate;
    this.startDate = this.datePipe.transform(this.ComparisionTBForm.controls.fromDate.value, "dd-MMM-yyyy");
    this.endDate = this.datePipe.transform(this.ComparisionTBForm.controls.toDate.value, "dd-MMM-yyyy");
    this.from = this.datePipe.transform(this.ComparisionTBForm.controls.fromDate.value, "dd-MMM-yyyy");
    this.to = this.datePipe.transform(this.ComparisionTBForm.controls.toDate.value, "dd-MMM-yyyy");
    if (this.OnBrsDateChanges(this.ComparisionTBForm.controls.fromDate.value, this.ComparisionTBForm.controls.toDate.value)) {
      
      fromdate = this.datePipe.transform(this.ComparisionTBForm.controls.fromDate.value, "yyyy-MM-dd");
      todate = this.datePipe.transform(this.ComparisionTBForm.controls.toDate.value, "yyyy-MM-dd");
      this._reportservice.GetComparisionTB(fromdate, todate).subscribe(res => {
        debugger;
        this.loading = false;
        this.isLoading = false;
        this.gridData = res;
        this.getColumnWisetotals();
        
      })
    }




  }

  getColumnWisetotals() {
    if (this.gridData.length > 0) {
      this.totaldebitamount1 = this.gridData.reduce((sum, c) => sum + c.pdebitamount1, 0);
      this.totaldebitamount1 = parseFloat(this.totaldebitamount1)
      this.totalcreditamount1 = this.gridData.reduce((sum, c) => sum + c.pcreditamount1, 0);
      this.totalcreditamount1 = parseFloat(this.totalcreditamount1)
      this.totaldebitamount2 = this.gridData.reduce((sum, c) => sum + c.pdebitamount2, 0);
      this.totaldebitamount2 = parseFloat(this.totaldebitamount2)
      this.totalcreditamount2 = this.gridData.reduce((sum, c) => sum + c.pcreditamount2, 0);
      this.totalcreditamount2 = parseFloat(this.totalcreditamount2)
      this.totaldebitamount3 = this.gridData.reduce((sum, c) => sum + c.pdebittotal, 0);
      this.totaldebitamount3 = parseFloat(this.totaldebitamount3)
      this.totalcreditamount3 = this.gridData.reduce((sum, c) => sum + c.pcredittotal, 0);
      this.totalcreditamount3 = parseFloat(this.totalcreditamount3)
      this.difference = Math.abs(this.totaldebitamount1 - this.totalcreditamount1);
      if (this.difference != 0) {
        this.hideprint = false;
      }
    }
    else {
      this.totaldebitamount1 = 0;
      this.totalcreditamount1 = 0;
      this.totaldebitamount2 = 0;
      this.totalcreditamount2 = 0;
      this.totaldebitamount3 = 0;
      this.totalcreditamount3 = 0;
    }
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=-10%,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Comparision Trail Balance</title>
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
