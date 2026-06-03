import { Component, OnInit } from '@angular/core';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { ActivatedRoute } from '@angular/router';
import { GroupDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-interestpayment-trenddetails-report',
  templateUrl: './interestpayment-trenddetails-report.component.html',
  styleUrls: ['./interestpayment-trenddetails-report.component.css']
})
export class InterestpaymentTrenddetailsReportComponent implements OnInit {
  Detailsdata: any=[]
  hiddenmonth=true
  public groups: GroupDescriptor[] = [{field:'pMonth'},{field:'pSchemename1'}];
  hiddenname=true
  constructor(private _LAReportsService:LAReportsService,private activatedroute: ActivatedRoute) { }
  totalpinterestamount:any;
  ngOnInit()
   {
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
    console.log("routeParams",routeParams);
    this._LAReportsService.PrintInterestPaymentTrendDetails(routeParams).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
     
      this.getDetailsColumnWisetotals();
      
  })
  }
  getDetailsColumnWisetotals() {
    if (this.Detailsdata.length > 0) {
        this.totalpinterestamount = this.Detailsdata.reduce((sum, c) => sum + c.pTotalinterestamount, 0);
        this.totalpinterestamount = parseFloat(this.totalpinterestamount)

        
    }
    else {
        this.totalpinterestamount = 0;
       
    }
}
rint() {
  debugger;
  let printContents, popupWin;
  printContents = document.getElementById('temp-box').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Interest Payment Trend</title>
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
