import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { GroupDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { DuesReportsService } from 'src/app/Services/Loans/Transactions/dues-reports.service';
import { CommonService } from 'src/app/Services/common.service';
import { NgTypeToSearchTemplateDirective } from '@ng-select/ng-select/lib/ng-templates.directive';
declare let $:any;
@Component({
  selector: 'app-trend-collection-report',
  templateUrl: './trend-collection-report.component.html',
  styles: []
})
export class TrendCollectionReportComponent implements OnInit {

@Input() month:any;
@Input() type:any;
  gridData: any=[];
  monthlist: any=[];
  countamountlist: any=[];
  gridView:any=[];
  duesData:any=[];
  showduereport=false;
  collectionreport=false;
  title:any;
  startDate:any;
  grouptype:any;
  ShowAsOn=false;
  ShowBetween=false;
  asondate:any;
  from:any;
  to:any;
  id:any
  hide=false;
  collectionid:any;
  startDatesReport:any;
  endDatesReport:any;
  totalprincipleamount:any;
  totalInterestamount:any;
  totalPenalityamount:any;
  totalChargesamount:any;
  totalTotalamount:any;
  collectionreporttitle:any;
  duereporttitle:any;
  fromdate:any;
  todate:any;
  groupinglist=[];
  public loading: boolean = false;
  public groups: GroupDescriptor[] = [{field:'precordid',dir:'asc'}];
  public group: GroupDescriptor[] = [{ field: 'pLoantype' }];
  public headerCells: any = {
    textAlign: 'center'
  };
 constructor(private datepipe:DatePipe,private _CommonService:CommonService, private _DueReportsServices:DuesReportsService, private _reportservice:ReportService, private toastr:ToastrService) { }

  ngOnInit() {
    debugger;
    if(this.type=="LOAN TYPE"){
      this.title="Loan Type"
    }
    if(this.type=="APPLICANT TYPE"){
      this.title="Applicant Type"
    }
    this.loading=true;
    let month=this.datepipe.transform(this.month,'MMM-yyyy');
    this._reportservice.GetCollectionDuesTrendReport(month,this.type).subscribe(data=>{
     debugger;
    this.gridData=data['pdisbursementtrenddailylist'];
    this.monthlist=data['pmonthlist'];
    //console.log(this.monthlist)
    this.countamountlist=data['pdisbursementtrendlist']
    //console.log( this.countamountlist)
   this.gridData.filter(data=>{
     debugger
     this.groupinglist[data.precordid]=data.ptype;
     console.log( this.groupinglist)
   })
    this.loading=false;
   }, error => { this.toastr.error(error, 'Error');
   this.loading=false;})
 }

 CollectionDues(dataItem,monthyear,status){
   debugger;
   
  let fieldname;
  if(status=="ALL"){
     fieldname="ALL";
  }
  else{
     fieldname=dataItem.pparticulars
  }
  let recordid=dataItem.precordid;
  let fieldtype=this.type;
  if(dataItem.precordid==1 || dataItem.precordid==2){
    if(status=="ALL"){
      this.duereporttitle="Due Report"+ ' ' + '(' + dataItem.pparticulars + ')'
    }
    if(status=="NONE"){
     this.duereporttitle="Due Report"+ ' ' + '(' +dataItem.ptype+ ' - ' + dataItem.pparticulars + ')'
   }
  }
 if(dataItem.precordid==1){
  this.id=dataItem.precordid;
  this.grouptype="ASON";
  
   this.hide=true;
   this.showduereport=true;
   this.collectionreport=false;
   let mm='01-' + monthyear;
   let newmonth=new Date(mm);
    let lastDayofmonth = new Date(newmonth.getFullYear(), newmonth.getMonth(),0);
   // this.startDate = this.datepipe.transform(lastDayofmonth,'dd-MMM-yyyy');
    this.fromdate=this.datepipe.transform(lastDayofmonth,'yyyy-MM-dd');
    this.todate=this.datepipe.transform(lastDayofmonth,'yyyy-MM-dd');
    this.ShowAsOn=true;
  this.ShowBetween=false;
  this.asondate=this.datepipe.transform(newmonth, "dd-MMM-yyyy");
    this._DueReportsServices.GetDueReportByDate(this.fromdate, this.todate,recordid,fieldname,fieldtype,this.grouptype).subscribe(res => {
      debugger;
      this.duesData = res;
    });
 }
 if(dataItem.precordid==2){
  this.id=dataItem.precordid;
  this.hide=false;
  this.grouptype="BETWEEN";
   this.showduereport=true;
   this.collectionreport=false;
  let mm='01-' + monthyear;
  let newmonth=new Date(mm);
  let lastDayofmonth = new Date(newmonth.getFullYear(), newmonth.getMonth() + 1, 0);
  this.startDate = this.datepipe.transform(lastDayofmonth,'dd-MMM-yyyy');;
   this.fromdate=this.datepipe.transform(newmonth,'yyyy-MM-dd');
  this.todate=this.datepipe.transform(lastDayofmonth,'yyyy-MM-dd');
  this.ShowAsOn=false;
     this.ShowBetween=true;
      this.from=this.datepipe.transform(newmonth, "dd-MMM-yyyy");
      this.to=this.datepipe.transform(lastDayofmonth, "dd-MMM-yyyy");
      this._DueReportsServices.GetDueReportByDate(this.fromdate, this.todate,recordid,fieldname,fieldtype,this.grouptype).subscribe(res => {
        debugger;
        this.duesData = res;
      });
    }
    if(dataItem.precordid==4 || dataItem.precordid==5 || dataItem.precordid==6){
      if(dataItem.precordid!=6){
        if(status=="ALL"){
          this.collectionreporttitle="Collection Report"+ ' ' + '(' + dataItem.pparticulars + ')'
        }
        if(status=="NONE"){
         this.collectionreporttitle="Collection Report"+ ' ' + '(' +dataItem.ptype+ ' - ' + dataItem.pparticulars + ')'
       }
      }
      else{
        this.collectionreporttitle="Collection Report"
      }
      this.collectionid=dataItem.precordid
      this.showduereport=false;
      this.collectionreport=true;
      let mm='01-' + monthyear;
      let newmonth=new Date(mm);
      let lastDayofmonth = new Date(newmonth.getFullYear(), newmonth.getMonth() + 1, 0);
      let fromdate=this.datepipe.transform(newmonth,"dd-MMM-yyyy");
      let todate=this.datepipe.transform(lastDayofmonth,"dd-MMM-yyyy")
      this.startDatesReport = fromdate;
      this.endDatesReport = todate;
      this._CommonService.GetCollectionReport(fromdate, todate,recordid,fieldname,fieldtype).subscribe(json => {
        this.gridView = json;
        console.log(this.gridView)
        let totprincipleamount:number = this.gridView.reduce((sum, c) => sum + c.pPrinciple, 0);
        this.totalprincipleamount = totprincipleamount.toFixed(2);
  
        let totInterestamount:number = this.gridView.reduce((sum, c) => sum + c.pInterest, 0);
        this.totalInterestamount = totInterestamount.toFixed(2);
  
        let totPenalityamount:number = this.gridView.reduce((sum, c) => sum + c.pPenality, 0);
        this.totalPenalityamount = totPenalityamount.toFixed(2);
        
        let totChargesamount:number = this.gridView.reduce((sum, c) => sum + c.pCharges, 0);
        this.totalChargesamount = totChargesamount.toFixed(2);
  
        let totTotalamount:number = this.gridView.reduce((sum, c) => sum + c.pTotalamount, 0);
        this.totalTotalamount = totTotalamount.toFixed(2);
       // this.ShowDetailSection = false;
      });

    }
  }
 
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Due Reports</title>
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
 
  print1(){
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Collection Report</title>
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
