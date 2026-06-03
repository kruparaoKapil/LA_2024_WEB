import { Component, OnInit, ViewChild } from '@angular/core';
import { State, GroupDescriptor,process } from '@progress/kendo-data-query';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { CommonService } from 'src/app/Services/common.service';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styles: []
})
export class DayBookComponent implements OnInit 
{
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public groups: GroupDescriptor[] = [{ field: 'prcpttransactiondate' }];

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  Daybook: FormGroup
  date: any;
  constructor(private fb: FormBuilder, private _reportservice: ReportService, private datepipe: DatePipe, private _commonservice: CommonService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'


    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD/MM/YYYY'

    this.allData = this.allData.bind(this);

  }
  public mySelection: string[] = [];
  updategrid: any = [];
  savebutton="Generate Report"
  public isLoading = false;
  public loading = false;
  gridData: any = [];
  totalbalancegrid: any = [];
  datepicker = true;
  selecteddate = true;
  fdate: any;
  showdate; any;
  FromDate: any;
  tdate: any;
  hidedate=true;
  Receiptsamount = 0
  paymentsamount = 0;
  betweendates: any;
  betweenfromdate: any;
  betweentodate: any;
  fromdate: any;
  todate: any;
  validation = false;
  ngOnInit() {
    
    this.Daybook = this.fb.group
      ({
        dfromdate: [''],
        dtodate: [''],
        date: ['']
      })
    this.date = new Date();
    this.showdate = "Date"
    this.betweendates = "";
    this.hidedate=true;
    this.datepicker = false;
    this.Daybook['controls']['date'].setValue(true)
    //this.checkdatevalidation()
    this.Daybook['controls']['dfromdate'].setValue(this.date);
    this.Daybook['controls']['dtodate'].setValue(this.date);
    this.betweenfromdate = this.datepipe.transform(this.date, "dd-MMM-yyyy");
    this.getdaybookdata();

  }
  checkox(event) {
    

    this.Daybook.controls.dfromdate.setValue(new Date());
    this.Daybook.controls.dtodate.setValue(new Date());

    //console.log(this.selecteddate)
    if (event.target.checked == false) {
      this.selecteddate = false
      this.datepicker = true;
      this.FromDate="From Date"
      this.showdate = "Between";
      this.betweendates = "and";
      this.validatedates();
      this.betweenfromdate = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      this.betweentodate = this.datepipe.transform(this.todate, "dd-MMM-yyyy");

    }
    else {
      this.selecteddate = true
      this.showdate = "Date"
      this.betweendates = "";
      this.FromDate=""
      this.betweentodate = "";
      this.datepicker = false;
      this.betweenfromdate = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");

    }

  }
  validatedates(): boolean {
     debugger;
    let isValid = true;
    if (this.selecteddate == true) {
      this.fromdate = this.Daybook.controls.dfromdate.value
      this.todate = this.Daybook.controls.dfromdate.value

    }
    else {
      this.fromdate = this.Daybook.controls.dfromdate.value
      this.todate = this.Daybook.controls.dtodate.value
    }
    this.fdate = this.datepipe.transform(this.fromdate, "dd/MMM/yyyy");
    this.tdate = this.datepipe.transform(this.todate, "dd/MMM/yyyy");

    return isValid
  }
  checkdatevalidation() {
   debugger;
    this.todate = this.Daybook.controls.dtodate.value
    this.tdate = this.datepipe.transform(this.todate, "dd/MMM/yyyy");
    this.validatedates();
    if (this.fromdate > this.todate) {
      this.validation = true
    }
    else {
      this.validation = false;
    }
  }
  checkingfrommdate() {

    this.fromdate = this.Daybook.controls.dfromdate.value
    this.fdate = this.datepipe.transform(this.fromdate, "dd/MMM/yyyy");
    this.validatedates();
    if (this.fromdate > this.todate) {
      this.validation = true
    }
    else {
      this.validation = false;
    }
   
  }

  getdaybookdata() {
    debugger;
    this.validatedates();
    //this.checkdatevalidation();
    this.Receiptsamount = 0;
    this.paymentsamount = 0;
    this.betweenfromdate = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
    if (this.selecteddate == true) {
      this.betweentodate = ""
    }
    else {
      this.betweentodate = this.datepipe.transform(this.todate, "dd-MMM-yyyy");
    }
    this.loading = true
    this.isLoading = true;
      this.savebutton = 'Processing';
    this._reportservice.GetDayBook(this.fdate, this.tdate).subscribe(res => {

      
      this.isLoading = false;
      this.loading = false;
      this.savebutton = 'Generate Report';
      this.gridData = res['plstdaybookdata'];
      this.gridData = this.gridData.filter(x => x.prcpttransactiondate = this._commonservice.formatDateFromDDMMYYYY(x.prcpttransactiondate))
      for (let i = 0; i < this.gridData.length; i++) {
        this.Receiptsamount = this.Receiptsamount + this.gridData[i].prcptdebitamount
        this.paymentsamount = this.paymentsamount + this.gridData[i].pcreditamount
      }
      this.Receiptsamount=Math.round(this.Receiptsamount);
      this.paymentsamount=Math.round(this.paymentsamount)

      this.totalbalancegrid = res['plstdaybooktotals']

      for (let j = 0; j < this.totalbalancegrid.length; j++) {

        if (this.totalbalancegrid[j].popeningbal < 0) {
          let openingbal = Math.abs(this.totalbalancegrid[j].popeningbal)
          this.totalbalancegrid[j].popeningbal = this._commonservice.currencyformat(openingbal.toFixed(2)) + ' ' + " Cr";
        }
        else if (this.totalbalancegrid[j].popeningbal == 0) {
          this.totalbalancegrid[j].popeningbal = ' '
        }
        else {
          this.totalbalancegrid[j].popeningbal = this._commonservice.currencyformat(this.totalbalancegrid[j].popeningbal) + ' ' + " Dr";
        }
        if (this.totalbalancegrid[j].pclosingbal < 0) {
          let closingbal = Math.abs(this.totalbalancegrid[j].pclosingbal)

          this.totalbalancegrid[j].pclosingbal = this._commonservice.currencyformat(closingbal) + ' ' + " Cr";
        }
        else if (this.totalbalancegrid[j].pclosingbal == 0) {
          this.totalbalancegrid[j].pclosingbal = ' ' 
        }
        else {
          this.totalbalancegrid[j].pclosingbal = this._commonservice.currencyformat(this.totalbalancegrid[j].pclosingbal) + ' ' + " Dr";
        }
      }

    })
 
  }


  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData,{}).data,
    };
      return result;
   }


  print() {
    debugger;
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Day Book</title>
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
