import { Component, OnInit,ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { State, GroupDescriptor, DataResult, process ,SortDescriptor, orderBy} from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { DuesReportsService } from 'src/app/Services/Loans/Transactions/dues-reports.service';

@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styles: []
})
export class GSTReportComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public savebutton = 'Show';
  public submitted = false;
  public GstReportForm: FormGroup;
  public today: Date = new Date();
  public isLoading = false;
  public loading = false;
  public startDate: any = new Date();
  public endDate: any = new Date();
  GSTReportData:any=[];
  GridData:any=[];
  public headerCells: any = {
    textAlign: 'center'
  };
  public hdtaxabletype=true;
  public groups: GroupDescriptor[] = [{ field: 'taxabletype' }];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService,private _DueReportsServices: DuesReportsService) { 
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
    this.GstReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    });
  }
GetGSTReportDetails(){
  debugger;
  let gridEffectfromdate = this.datePipe.transform(this.GstReportForm.controls.fromDate.value, "dd-MM-yyyy");
    let gridEffectToDate = this.datePipe.transform(this.GstReportForm.controls.toDate.value, "dd-MM-yyyy");
     if( this._CommonService.formatDateFromDDMMYYYY(gridEffectfromdate) > this._CommonService.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._CommonService.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }
     let FromDate= this.datePipe.transform(this.GstReportForm.controls.fromDate.value,"yyyy-MM-dd");
     let ToDate= this.datePipe.transform(this.GstReportForm.controls.toDate.value,"yyyy-MM-dd");
    this._DueReportsServices.GetGSTReportDetails(FromDate,ToDate).subscribe(res=>{
      debugger;
    if(res){
      this.GSTReportData=res;
      this.GridData=res;
    }
    })
}
checkingfrommdate() {
    this.dpConfig1.minDate = this.GstReportForm.controls.fromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.GstReportForm.controls.toDate.value
  }
  public onFilter(inputValue: string): void {
    this.GSTReportData = process(this.GridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'taxabletype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'gstinno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'invoiceno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'invoicedate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'placeofsupply',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'typeofregistration',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  print(){
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>GST Report</title>
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
