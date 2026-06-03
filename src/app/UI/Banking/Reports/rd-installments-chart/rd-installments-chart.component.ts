import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RdInstallmentsChartService } from 'src/app/Services/Banking/Transactions/rd-installments-chart.service';

@Component({
  selector: 'app-rd-installments-chart',
  templateUrl: './rd-installments-chart.component.html',
  styleUrls: ['./rd-installments-chart.component.css']
})
export class RdInstallmentsChartComponent implements OnInit {

  public InstalmentsReportData: any = [];
  public totalinstalmentamount: any = 0;
  public totinstalmentpaidamount: any = 0;
  public totinsdueamount: any = 0;

  constructor(private activatedroute: ActivatedRoute, private _RdInstallmentsChartService:RdInstallmentsChartService) { }

  ngOnInit() {
    this.InstalmentsReportData = [];
    this.totalinstalmentamount = 0;
    this.totinstalmentpaidamount = 0;
    this.totinsdueamount = 0;
    let Rdaccountno = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    this.collectionreport(Rdaccountno);
  }
  public collectionreport(Rdaccountno) {
    debugger
    this._RdInstallmentsChartService.GetMemberDetails(Rdaccountno).subscribe(json => {
      debugger;
      if (json) {
        this.InstalmentsReportData = json;
        this.totalinstalmentamount = this.InstalmentsReportData.reduce((sum, c) => sum + c.pinstalmentamount, 0).toFixed(2);
      }
    });
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printid').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Plot/Unit Installment Chart</title>
         
        <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
        <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@swimlane/ngx-datatable@17.0.0/index.css"/>
        
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
<style>
   
  @media print {
      html,
      body {
          width: 210mm;
          height: 297mm;
          background: #fff !important;
          margin-left: 25px !important;
          margin-top: 10px !important;
      }
      
  }
  </style>
      </html>`
    );
    popupWin.document.close();
  }

  /**Print and Pdf General Receipt */


  pdfs() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>General Receipt</title>
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
