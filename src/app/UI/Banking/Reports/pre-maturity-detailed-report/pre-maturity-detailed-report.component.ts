import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelExportData, ExcelExporter } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { Workbook } from '@progress/kendo-angular-excel-export';//excel converter
import { DatePipe } from '@angular/common';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
@Component({
  selector: 'app-pre-maturity-detailed-report',
  templateUrl: './pre-maturity-detailed-report.component.html',
  styles: []
})
export class PreMaturityDetailedReportComponent implements OnInit{
 
  @ViewChild('pdfExport', { static: true }) pdfExport!: PDFExportComponent;
  kycFileName: any;
  imageResponse: any;
  kycFilePath: any;
  excelList:any[]=[
    // {
    //   s_no:1,Member_Name:'fghfg',FD_Account_No:56757, FD_Amount:345,Applicant_Date:'4-23-52003',Mature_Date:'4-23-03',
    //   Tenure:58,Interest_Rate:56 ,Mode_of_Interest:566675,Premature_Date:5464,
    //   Premature_period_in_days:5,Premature_Interest_Rate:65,Premature_InterestAmount:7868,
    //   Agent_Name_ID:567,Commission:9879,Released_Amount:6757,Collected_Interest:6576,
    //   commission:6867,Net_payable_Amount:54646,PV_No:56,PV_Date:'4-23-90'
    // },
    // {
    //   s_no:2,Member_Name:'fghfg',FD_Account_No:56757, FD_Amount:345,Applicant_Date:'4-23-2003',Mature_Date:'4-23-03',
    //   Tenure:58,Interest_Rate:56 ,Mode_of_Interest:566675,Premature_Date:5464,
    //   Premature_period_in_days:5,Premature_Interest_Rate:65,Premature_InterestAmount:7868,
    //   Agent_Name_ID:567,Commission:9879,Released_Amount:6757,Collected_Interest:6576,
    //   commission:6867,Net_payable_Amount:54646,PV_No:56,PV_Date:'4-67-39'
    // }
  
   ]
   Insurancememberform:FormGroup;
   maturityDetailsReportForm:FormGroup;
   public today: Date = new Date();
   maturityList: any = [];
  IssuedChequeValidation: any = {};
  showdate = true;
  todate: any;
  selecteddate = true;
  betweendates: any;
  FromDate: any;
  inbetween: any;
  betweenfrom: any;
  betweento: any;
  fromdate: any;
  hidegridcolumn = true;
  date: any;
  validation = false;
  maturityDetailsList: any = [];
  fromDates: any;
  toDates: any;
  Type: any = 'Pre-Maturity';
  gridData: any = [];
  public pageSize = 10;


    constructor(private fb:FormBuilder , private _CommonService: CommonService, private datepipe: DatePipe, private formbuilder:FormBuilder, private maturityService:LAReportsService) { 
      this.allData = this.allData.bind(this);

    }
    ngOnInit(): void {

     this.maturityDetailsReportForm = this.formbuilder.group({
      fromDate: [this.today],
      toDate: [this.today],

      dfromdate: [''],
      dtodate: [''],
      date: [''],
      pMaturityType: [''],
    })

    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "ASON"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''
    this.hidegridcolumn = true;

    this.maturityDetailsReportForm['controls']['date'].setValue(true)
    this.maturityDetailsReportForm['controls']['dfromdate'].setValue(this.date);
    this.maturityDetailsReportForm['controls']['dtodate'].setValue(this.date);
    this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");

    this.maturityDetailsReportForm.controls.dfromdate.setValue(this.today);
    this.maturityDetailsReportForm.controls.dtodate.setValue(this.today);

    }

    checkox(event) {

      this.maturityDetailsReportForm.controls.dfromdate.setValue(new Date());
      this.maturityDetailsReportForm.controls.dtodate.setValue(new Date());
  
      this.gridData = []
      if (event.target.checked == false) {
        this.selecteddate = false
        this.showdate = true;
        this.betweendates = "Between"
        this.FromDate = 'From Date'
        this.inbetween = "and";
        this.validationfordates();
        this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
        this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");
  
        this.hidegridcolumn = false;
  
  
      }
      else {
        this.betweendates = "ASON"
        this.inbetween = ""
        this.showdate = false;
        this.selecteddate = true;
        this.todate = "";
        this.FromDate = '';
        this.betweento = ""
        this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
        this.hidegridcolumn = true;
      }
    }
  
    checkfromdate() {
  
      debugger
      this.fromdate = this.maturityDetailsReportForm['controls']['dfromdate'].value
      this.fromdate = this.datepipe.transform(this.fromdate, "dd/MM/yyyy");
      this.validationfordates()
      if (this.fromdate > this.todate) {
        this.validation = true;
      }
      else {
        this.validation = false;
      }
  
    }
    checktodate() {
      debugger
      this.todate = this.maturityDetailsReportForm['controls']['dtodate'].value
      this.todate = this.datepipe.transform(this.todate, "dd/MM/yyyy");
  
      this.validationfordates()
      if (this.fromdate > this.todate) {
        this.validation = true;
      }
      else {
        this.validation = false;
      }
  
    }
    validationfordates() {
  
      let isValid = true;
  
  
      if (this.selecteddate == true) {
        this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
        this.todate = this.maturityDetailsReportForm.controls.dfromdate.value
      }
      else {
        this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
        this.todate = this.maturityDetailsReportForm.controls.dtodate.value
      }
      this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
      this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
      return isValid
    }
  

  getMaturityDetails(){
    debugger;  
    let fromDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "yyyy/MM/dd");
    let toDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "yyyy/MM/dd");

    this.fromDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "dd-MM-yyyy");
    this.toDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "dd-MM-yyyy");

    this.maturityService.GetPreMaturityMonthwise1(this.betweendates,fromDate,toDate).subscribe(details => {
      this.maturityDetailsList = details;
      this.gridData = details;
      if(this.maturityDetailsList.length == 0){
        this._CommonService.showWarningMessage('No Data To Show');
      }
      else{
        this.maturityDetailsList.forEach(item => {
          const transDate = new Date(item.pTransdate); // ISO format is fine
        
          if (item.pprematurity_date) {
            // Parse 'dd/MMM/yyyy' like '24/Jan/2025'
            const [day, monStr, year] = item.pprematurity_date.split('/');
        
            const monthsMap = {
              Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
              Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
        
            const month = monthsMap[monStr];
            if (month !== undefined) {
              const preMaturityDate = new Date(Number(year), month, Number(day));
              
              // Calculate difference in days
              const diffTime = preMaturityDate.getTime() - transDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              item.diffInDays = diffDays;
            } else {
              item.diffInDays = null; // Invalid month
            }
          } else {
            item.diffInDays = null; // Date missing
          }
        });
      }
    })
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        // group: this.group,
        sort: [{ field: "pMembername", dir: "asc" }],
      }).data,
    //  group: this.group,
    };

    return result;
  }
 
  
  
  }
