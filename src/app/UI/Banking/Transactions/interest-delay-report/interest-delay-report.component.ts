import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-interest-delay-report',
  templateUrl: './interest-delay-report.component.html',
  styleUrls: ['./interest-delay-report.component.css']
})
export class InterestDelayReportComponent implements OnInit {
  interestdelayform: FormGroup
  public today: Date = new Date();
  fromdate: any;
  todate: any;
  frommonthof: any;
  tomonthof: any;
  validation: boolean;
  gridData: any = []
  todate2: any;
  loading: boolean = false;
  showgrid: boolean = false;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private _commonservice: CommonService) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger
    this.Formgroup()
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.allData = this.allData.bind(this);
  }
  Formgroup() {
    this.interestdelayform = this.fb.group({
      pFromDate: [this.today],
      pToDate: [this.today]
    })
  }

  FromDateChange(event) {
    debugger;
    this.gridData = [];
    this.frommonthof = event;
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");

    // if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
    //   //this.validatedates();
    // }
  }
  ToDateChange(event) {
    debugger;
    this.gridData = [];
    this.tomonthof = event;
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    // if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
    //   //this.validatedates();
    // }
  }
  //   validatedates() {
  //   debugger;
  //   if (this.fromdate > this.todate) {

  //     this.validation = true
  //   }

  //   else {
  //     this.validation = false;
  //   }

  // }
  GetInterestDelayData() {
    debugger;
    this.loading = true;
    this.showgrid = true;
    let fromdate = this.datePipe.transform(this.interestdelayform['controls']['pFromDate'].value, "dd-MMM-yyyy");
    let todate = this.datePipe.transform(this.interestdelayform['controls']['pToDate'].value, "dd-MMM-yyyy");
    this.frommonthof = fromdate;
    this.todate2 = todate
    this._commonservice.GetInterestDelayData(fromdate, todate).subscribe(res => {
      debugger;
      this.loading = false;
      this.gridData = res;
      if (this.gridData && this.gridData.length > 0) {
        this.gridData.forEach(item => {
          item.pdepositdate = this.datePipe.transform(item.pdepositdate, 'dd-MM-yyyy');
          item.pmaturitydate = this.datePipe.transform(item.pmaturitydate, 'dd-MM-yyyy');
        });

        console.log("grid ", this.gridData);
      }
      else {
        this._commonservice.showWarningMessage('No Data To Show For The Date of' + ' ' + fromdate);
        this.loading = false;
      }

    }, (error) => {
      this._commonservice.showErrorMessage(error);
      this.loading = false;
    })
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

}
