import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { DisbursmentReportsService } from 'src/app/Services/Loans/Transactions/disbursment-reports.service';

@Component({
  selector: 'app-trend-disbursement-report',
  templateUrl: './trend-disbursement-report.component.html',
  styles: []
})
export class TrendDisbursementReportComponent implements OnInit {
gridData:any=[];
monthlist:any=[];
countamountlist:any=[];
loandisbursed:any=[];
showCount=true;
showValue=false;
showreport=false;
reportTitle:any;
@Input() data:any;
type="LOAN TYPE";
title:any;
pcount1sum:any;
pcount2sum:any;
pcount3sum:any;
pcount4sum:any;
pcount5sum:any;
pcount6sum:any;
pcount7sum:any;
pcount8sum:any;
pcount9sum:any;
pcount10sum:any;
pcount11sum:any;
pcount12sum:any;
pamount1sum:any;
pamount2sum:any;
pamount3sum:any;
pamount4sum:any;
pamount5sum:any;
pamount6sum:any;
pamount7sum:any;
pamount8sum:any;
pamount9sum:any;
pamount10sum:any;
pamount11sum:any;
pamount12sum:any;
public loading: boolean = false;
public headerCells: any = {
  textAlign: 'center'
};

  constructor(private _reportservice:ReportService,private _DisbursmentReportsService:DisbursmentReportsService, private datepipe:DatePipe, private toastr:ToastrService, private _CommonService:CommonService) { }

  ngOnInit() {
    debugger
    this.loading=true;
    let month=this.datepipe.transform(this.data,'MMM-yyyy');
  this._reportservice.GetTrendReport(month).subscribe(data=>{
   this.gridData=data['pdisbursementtrenddailylist'];
   this.monthlist=data['pmonthlist'];
   this.countamountlist=data['pdisbursementtrendlist'];
   console.log(this.countamountlist)
   this.CountGridSum();
   this.loading=false;
  }, error => { this.toastr.error(error, 'Error');
  this.loading=false;})
}
  TrendReportSelection(event){
    if(event.target.value=="Count"){
      this.showCount=true;
      this.showValue=false;
    }
    if(event.target.value=="Value"){
      this.showValue=true;
      this.showCount=false;
    }
  }

   LoanDisbursed(dataItem,monthyear) {
    debugger
    this.showreport=true;
    // this.gridData = '';
    let fieldname = "ALL" ;
    let mm='01-' + monthyear;
    let newmonth=new Date(mm);
    // let mmstring=this.datepipe.transform(newmonth,'dd/MM/yyyy');
    // let fromdate=this._CommonService.formatDateFromDDMMYYYY(mmstring);
     //let newmonth = this._CommonService.formatDateFromDDMMYYYY(month);
    // //let selectedmonth = this.datePipe.transform(newmonth, "dd-MMM-yyyy");
    let lastDayofmonth = new Date(newmonth.getFullYear(), newmonth.getMonth() + 1, 0);
    this.reportTitle='Between:  ' +this.datepipe.transform(newmonth,'dd-MMM-yyyy')+ '  and  '+ this.datepipe.transform(lastDayofmonth,'dd-MMM-yyyy') ;
     let Disbursementdata = { pfieldname: fieldname, ptype: this.type, pfromdate: newmonth, ptodate:lastDayofmonth };
     let data = JSON.stringify(Disbursementdata);
     this._DisbursmentReportsService.GetDisbursedReportDuesDetails(data).subscribe(res => {
       debugger
       this.loandisbursed = res;
       });
  }

  LoanDisbursedCountValue(dataItem,monthyear){
    debugger
    
    this.showreport=true;
    let fieldname = "ALL" ;
    let mm=dataItem.precordid + '-' + monthyear; 
    let newmonth=new Date(mm);
    this.reportTitle=this.datepipe.transform(newmonth,'dd-MMM-yyyy');
    let lastDayofmonth = new Date(mm);
     let Disbursementdata = { pfieldname: fieldname, ptype: this.type, pfromdate: newmonth, ptodate:lastDayofmonth };
     let data = JSON.stringify(Disbursementdata);
     this._DisbursmentReportsService.GetDisbursedReportDuesDetails(data).subscribe(res => {
       debugger
       this.loandisbursed = res;
       });
  }

  CountGridSum(){
    this.pcount1sum = this.gridData.reduce((sum, item) => sum + item.pcount1, 0);
    this.pcount2sum = this.gridData.reduce((sum, item) => sum + item.pcount2, 0);
    this.pcount3sum = this.gridData.reduce((sum, item) => sum + item.pcount3, 0);
    this.pcount4sum = this.gridData.reduce((sum, item) => sum + item.pcount4, 0);
    this.pcount5sum = this.gridData.reduce((sum, item) => sum + item.pcount5, 0);
    this.pcount6sum = this.gridData.reduce((sum, item) => sum + item.pcount6, 0);
    this.pcount7sum = this.gridData.reduce((sum, item) => sum + item.pcount7, 0);
    this.pcount8sum = this.gridData.reduce((sum, item) => sum + item.pcount8, 0);
    this.pcount9sum = this.gridData.reduce((sum, item) => sum + item.pcount9, 0);
    this.pcount10sum = this.gridData.reduce((sum, item) => sum + item.pcount10, 0);
    this.pcount11sum = this.gridData.reduce((sum, item) => sum + item.pcount11, 0);
    this.pcount12sum = this.gridData.reduce((sum, item) => sum + item.pcount12, 0);


    this.pamount1sum = this.gridData.reduce((sum, item) => sum + item.pamount1, 0);
    this.pamount2sum = this.gridData.reduce((sum, item) => sum + item.pamount2, 0);
    this.pamount3sum = this.gridData.reduce((sum, item) => sum + item.pamount3, 0);
    this.pamount4sum = this.gridData.reduce((sum, item) => sum + item.pamount4, 0);
    this.pamount5sum = this.gridData.reduce((sum, item) => sum + item.pamount5, 0);
    this.pamount6sum = this.gridData.reduce((sum, item) => sum + item.pamount6, 0);
    this.pamount7sum = this.gridData.reduce((sum, item) => sum + item.pamount7, 0);
    this.pamount8sum = this.gridData.reduce((sum, item) => sum + item.pamount8, 0);
    this.pamount9sum = this.gridData.reduce((sum, item) => sum + item.pamount9, 0);
    this.pamount10sum = this.gridData.reduce((sum, item) => sum + item.pamount10, 0);
    this.pamount11sum = this.gridData.reduce((sum, item) => sum + item.pamount11, 0);
    this.pamount12sum = this.gridData.reduce((sum, item) => sum + item.pamount12, 0);
  }

}


