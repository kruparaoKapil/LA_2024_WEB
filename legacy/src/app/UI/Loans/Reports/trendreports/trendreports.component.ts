import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrendCollectionReportComponent } from './trend-collection-report.component';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-trendreports',
  templateUrl: './trendreports.component.html',
  styles: []
})
export class TrendreportsComponent implements OnInit {
  @ViewChild(TrendCollectionReportComponent, {static:false}) trendcollection;
  showtrenddisbursement=false;
  showcollectionandscope=false;
  ShowReportErrorMsg=false;
  showloantypeapplicant=false;
  TrendReportValidation:any;
  type='LOAN TYPE';
  TrendsReport:FormGroup;
  @Output() date:any;
  public today: Date = new Date();
  public isLoading: boolean = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(private _commonService:CommonService) { 
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig.maxDate = new Date();
 
    this.dpConfig.dateInputFormat = 'MMM-YYYY'
  }

  ngOnInit() {
    this.TrendReportValidation={};
    this.TrendsReport=new FormGroup({
      reportType: new FormControl('',Validators.required),
      monthname:new FormControl(this.today)
    })
 
  }
 

  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
    this.showcollectionandscope=false;
    this.showtrenddisbursement=false;

  }

  GenerateReport() {
    debugger;
    this.date=this.TrendsReport.controls.monthname.value;
    if(this.TrendsReport.controls.reportType.value==""){
      this.showtrenddisbursement=false;
      this.showcollectionandscope=false;
      this.ShowReportErrorMsg = true;
      document.getElementById('reportType').style.border = "1px solid red";  
    }
  
    if(this.TrendsReport.controls.reportType.value=="Loans Disbursed"){
      this.showtrenddisbursement=true;
      this.showcollectionandscope=false; 
    }
    if(this.TrendsReport.controls.reportType.value=="Collection and Dues"){
      this.showtrenddisbursement=false;
      this.showcollectionandscope=true; 
    }
  }
  
  SelectTrendReport(event){
    if(event.target.value=="Loans Disbursed" && this.showcollectionandscope==true){
        this.showcollectionandscope=false;
    }
    if(event.target.value=="Collection and Dues" && this.showtrenddisbursement==true){
      this.showtrenddisbursement=false;
    }
    if(event.target.value==""){
      this.showtrenddisbursement=false;
      this.showcollectionandscope=false; 
      this.showloantypeapplicant=false;
    }
    if(event.target.value=="Loans Disbursed" || event.target.value=="Collection and Dues"){
      this.ShowReportErrorMsg = false;
    document.getElementById('reportType').style.border = "";
    }
    if(event.target.value=="Loans Disbursed"){
      this.showloantypeapplicant=false;
    }
    if(event.target.value=="Collection and Dues"){
      this.showloantypeapplicant=true;
    }
  }

  LoantypeSelect(data){
    debugger
    if(this.type=="LOAN TYPE") 
    {
      if(this.showcollectionandscope==true){
        this.showcollectionandscope=true;
      }
      if(this.showtrenddisbursement==true){
        this.showtrenddisbursement=true;
      }
    }
    else{
      this.type=data;
      this.showcollectionandscope=false;
      this.showtrenddisbursement=false;
    }
   
  }

  ApplicantTypeSelect(data){
    debugger
    if(this.type=="APPLICANT TYPE") 
    {
      if(this.showcollectionandscope==true){
        this.showcollectionandscope=true;
      }
      if(this.showtrenddisbursement==true){
        this.showtrenddisbursement=true;
      }
     
    }
    else{
      this.type=data;
      this.showcollectionandscope=false;
      this.showtrenddisbursement=false;
    }
   
  }
}
