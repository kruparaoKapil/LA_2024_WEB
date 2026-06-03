import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';

@Component({
  selector: 'app-interestpaymentpreview',
  templateUrl: './interestpaymentpreview.component.html',
  styleUrls: ['./interestpaymentpreview.component.css']
})
export class InterestpaymentpreviewComponent implements OnInit {
    showCompany = false;
    ShowData: any = [];    
    todaydate: any;
    schemeid: any;
    schemename: any;
    paymenttype: any;
    adjustmenttype: any;
    companyname: any;
    branchname: any;
    monthof: any;
        
   

    constructor(private FB: FormBuilder, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private router: Router, private toastr: ToastrService, private activatedroute: ActivatedRoute) {
        this.showCompany = false;
    }
        griddata: any = [];
    

    ngOnInit() {
        debugger;
        this.todaydate = new Date()
       
        let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));


          let splitData = routeParams.split(",");
        this.schemeid = splitData[0];
        this.paymenttype = splitData[1];
        this.monthof = splitData[2];
        this.companyname = splitData[3];
        this.branchname = splitData[4];
        
        if (this.paymenttype == "ADJUSTMENT") {
            this.showCompany = true;
        }
        else {
            this.showCompany = false;
        }
        this._LienEntryService.GetShowmemberdetails(this.schemeid, this.paymenttype, this.companyname, this.branchname, this.monthof).subscribe(result => {
            debugger;
            this.ShowData = result;
            console.log(result)
            console.log("report result is", this.ShowData);

        })
        
      
    }
    print() {
        let printContents, popupWin;
        printContents = document.getElementById('temp-box').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
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


    pdfGenerate() {
        let printContents, popupWin;
        printContents = document.getElementById('temp-box').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.pdf();window.download();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }





}
