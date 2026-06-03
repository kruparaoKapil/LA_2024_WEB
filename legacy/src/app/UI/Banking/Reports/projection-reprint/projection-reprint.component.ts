//import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';

@Component({
  selector: 'app-projection-reprint',
  templateUrl: './projection-reprint.component.html',
  styles: []
})
export class ProjectionReprintComponent implements OnInit {
  projectionReprintForm: FormGroup;
selectedmonth: any;
  ProjectionReprintErrors: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  // Month Picker
  minDate: Date;
  month: string;
  months:any[]=[];
  savebutton = "Generate Report"
  today = new Date();
  tabledisable: boolean = false;

  monthPickerContainer: ElementRef;
  Data: any = []
  projData: any[] = [];
  projData1: any[] = [];
  @ViewChild('monthPickerContainer', { static: false })

  public isLoading = false;
  formattedmonth: string;
  schemenames: any[]=[];
  noRecords: boolean=false;
 constructor(private fb: FormBuilder, private _usersService: UsersService,
   private _LAReportsService: LAReportsService, private datepipe: DatePipe, 
   private _CommonService: CommonService) {
    //  this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    //  this.dpConfig.minDate = this.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minMode = 'month';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
  }

   ngOnInit() {
    let date = this.datepipe.transform(this.today, 'MMM-yyyy')
    console.log('latest date:', date);
    this.projectionReprintForm = this.fb.group({
      selectedMonth: [date],

    });
  }
  GenerateData() {
    debugger;
    this.isLoading = true;
    this.projData = [];

    this.formattedmonth = this.projectionReprintForm.controls.selectedMonth.value;
    this.selectedmonth = this.datepipe.transform(this.formattedmonth, 'MMM-yyyy');

    this._LAReportsService.GetProductSummaryData(this.selectedmonth).subscribe(res => {
      this.projData = res;

      console.log(this.projData);

      if (this.projData.length < 3) {
        this.noRecords = true;
        this._CommonService.showWarningMessage("No Records");
        this.tabledisable = false;
        return;
      }
       
       this.tabledisable = true;
    });
  }


  DateChange($event) {
    this.selectedmonth = this.datepipe.transform($event, 'MMM-yyyy');
  }

  onOpenCalendar(container) {
    if (container && container.setViewMode) {
      container.setViewMode('month');
    }
  }

  Print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
   
      <html>
        <head>
          <title>Projection Data</title>
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
