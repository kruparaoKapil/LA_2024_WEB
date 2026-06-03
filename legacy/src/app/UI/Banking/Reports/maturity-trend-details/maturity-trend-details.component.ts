import { Component, OnInit } from '@angular/core';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maturity-trend-details',
  templateUrl: './maturity-trend-details.component.html',
  styleUrls: ['./maturity-trend-details.component.css']
})
export class MaturityTrendDetailsComponent implements OnInit
 {
  public groups: GroupDescriptor[] = [{field:'pMonth'},{field:'pSchemename1'}];
 //public groups: GroupDescriptor[] = [{field:'pMonth'}];
 // public groups: GroupDescriptor[] =[{field:'pSchemename1'},{field:'pMaturitydate'}]
  Detailsdata:any=[]
  totalmaturityamount: any;
  constructor(private _LAReportsService:LAReportsService,private activatedroute: ActivatedRoute) { }
  hiddenmonth=true
  hiddenname=true
  ngOnInit() 
  { 
    
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
      console.log("routeParams",routeParams);


    this._LAReportsService.PrintMaturityTrendDetails(routeParams).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
     
      this.getDetailsColumnWisetotals();
      
  })
  }
  getDetailsColumnWisetotals() {
    if (this.Detailsdata.length > 0) {
        this.totalmaturityamount = this.Detailsdata.reduce((sum, c) => sum + c.pMaturityamount, 0);
        this.totalmaturityamount = parseFloat(this.totalmaturityamount)


    }
    else {
        this.totalmaturityamount = 0;

    }
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
        <title>Maturity Trend</title>
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
