import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { State, GroupDescriptor } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styles: []
})
export class TrialBalanceComponent implements OnInit {
hide=true;
validate:any;
grouptype:any;
gridData:any=[];
gridDatatemp=[];
debittotal:any;
credittotal:any;
TrialBalanceDifference=false;
hidetypeofaccount=true;
pdfandprint=true;
ShowAsOn=false;
ShowBetween=false;
difference:any;
buttonName="Generate Report"
asondate:any;
from:any;
  to: any;
  FromDate ="From Date";
endDatesReport:any;
startDatesReport:any;
TrialBalanceForm:FormGroup;
public isLoading: boolean = false;
public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
public groups: GroupDescriptor[] = [{ field: 'pparentname' }];
  constructor(private fb:FormBuilder, private _reportservice:ReportService, private datePipe:DatePipe, private toastr:ToastrService, private _commonservice:CommonService, private datepipe:DatePipe) {
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.containerClass = 'theme-dark-blue';
   }

  ngOnInit() {
    
    this.TrialBalanceForm=this.fb.group({
      fromdate:[new Date()],
      todate:[new Date()]
    });
    this.endDatesReport = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
     this.startDatesReport = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.from= this.startDatesReport;
    this.to=this.endDatesReport ;
    this.grouptype="BETWEEN";
    this.ShowBetween=true;
    this.GetTBalance(this.from,this.to,this.grouptype)
  }

  checkboxChecked(event){

    if(event.target.checked==true){
     this.hide=false;
     this.grouptype="ASON";
     this.TrialBalanceForm.controls.fromdate.setValue(new Date());
      this.TrialBalanceForm.controls.todate.setValue("");
      this.FromDate = "Date"
    }
    else{
      this.hide=true;
      this.grouptype="BETWEEN";
      this.TrialBalanceForm.controls.fromdate.setValue(new Date());
      this.TrialBalanceForm.controls.todate.setValue(new Date());
      this.FromDate = "From Date"
    }

  }

//   OnBrsDateChanges(fromdate, todate) {
//     
//     if(todate!=""){
//     if (fromdate > todate) {
//         this.validate = true;
//     }
//     else {
//         this.validate = false;
//     }
//   }
// }

  Report(){
    
       
    let fromdate;
    let todate;
   
    this.gridData=[];
    
    if(this.grouptype=="ASON"){
      this.ShowAsOn=true;
      this.ShowBetween=false;
      this.asondate=this.datePipe.transform(this.TrialBalanceForm.controls.fromdate.value, "dd-MMM-yyyy");
    }
    if(this.grouptype=="BETWEEN"){
      this.ShowAsOn=false;
     this.ShowBetween=true;
      this.from=this.datePipe.transform(this.TrialBalanceForm.controls.fromdate.value, "dd-MMM-yyyy");
      this.to=this.datePipe.transform(this.TrialBalanceForm.controls.todate.value, "dd-MMM-yyyy");
    }
  //  this. OnBrsDateChanges(this.TrialBalanceForm.controls.fromdate.value,this.TrialBalanceForm.controls.todate.value);
  //  fromdate=this.datepipe.transform(this.TrialBalanceForm.controls.fromdate.value,'yyyy/MM/dd');
  this.from=this.datePipe.transform(this.TrialBalanceForm.controls.fromdate.value, "dd-MMM-yyyy");
    if(this.grouptype=="ASON"){
      //todate=this.datepipe.transform(this.TrialBalanceForm.controls.fromdate.value,'yyyy/MM/dd');
      this.to=this.datePipe.transform(this.TrialBalanceForm.controls.fromdate.value, "dd-MMM-yyyy");
      this.asondate=this.datePipe.transform(this.TrialBalanceForm.controls.fromdate.value, "dd-MMM-yyyy");
    }
    else{
      this.ShowAsOn=false;
    }
    if(this.grouptype=="BETWEEN"){
     // todate=this.datepipe.transform(this.TrialBalanceForm.controls.todate.value,'yyyy/MM/dd');
     this.to=this.datePipe.transform(this.TrialBalanceForm.controls.todate.value, "dd-MMM-yyyy");
    }
    else{
      this.ShowBetween=false;
    }
    this.endDatesReport = this.to;
    this.startDatesReport = this.from;
    this.GetTBalance(this.from,this.to,this.grouptype);
  }

  GetTBalance(from,to,grouptype){
    this.debittotal=0;
    this.credittotal=0;
    this.difference=0;
    this.isLoading = true;
    this.buttonName="Processing";
    this._reportservice.GetTrialBalance(from, to,grouptype).subscribe(data=>{
      
      this.gridData=data;
      for(let i=0;i<this.gridData.length;i++){
        this.gridData[i].pcreditamount=Math.abs(this.gridData[i].pcreditamount);
        this.debittotal=this.debittotal + this.gridData[i].pdebitamount;
        this.credittotal=this.credittotal + this.gridData[i].pcreditamount;
      }
      this.debittotal=this.debittotal.toFixed(2);
      this.credittotal=this.credittotal.toFixed(2);
    if(this.debittotal!=this.credittotal){
      this.TrialBalanceDifference=true;
      this.pdfandprint=false;
       this.difference=Math.abs(this.debittotal-this.credittotal);
       this.difference=this.difference.toFixed(2);
    }
    else{
      this.TrialBalanceDifference=false;
      this.pdfandprint=true;
    }
    this.isLoading = false;
    this.buttonName="Generate Report";
    },error=>{this.toastr.error(error, 'Error');
    this.isLoading = false;
    this.buttonName="Generate Report";}) 
  
  }
  DateChange(event){
    this.dpConfig1.minDate = event;
  //  this.TrialBalanceForm.controls.toDate.setValue(new Date());
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Trial Balance</title>
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
