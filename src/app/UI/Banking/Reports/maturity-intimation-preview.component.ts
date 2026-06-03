import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { ReprintService } from 'src/app/Services/Accounting/reprint.service';
import { saveAs } from '@progress/kendo-file-saver';
import { LAReportsService } from '../../../Services/Banking/lareports.service';
import { AccountingTransactionsService } from '../../../Services/Accounting/accounting-transactions.service';

@Component({
    selector: 'app-maturity-intimation-preview',
    templateUrl: './maturity-intimation-preview.component.html',
    styles: []
})
export class MaturityIntimationPreviewComponent implements OnInit {
    griddata: any = [];
    ShowData: any = [];
    ShowData1: any = [];
    pschemename: any;
    pbranchname: any;
    pmembername: any;
    pfdaccountno: any;
    pdepositamount: any;
    pmaturitydate: any;
    todaydate: any;
    public comapnydata: any;
    public pCompanyName: any;

    public pAddress1: any;
    public pAddress2: any;
    public pcity: any;
    public pCountry: any;
    public pState: any;
    public pDistrict: any;
    public pPincode: any;
    public pCinNo: any;
    public pGstinNo: any;
    public pBranchname: any
    public today: Date = new Date();


    constructor(private activatedroute: ActivatedRoute, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private datepipe: DatePipe, private router: Router, private toastr: ToastrService,  private _reprintservices: ReprintService) { }

    ngOnInit() {
        debugger;
        let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
        this.todaydate = new Date();
        this.getComapnyName();
        routeParams = routeParams.toString().replace(/@/g, " ").slice(0, -1);           
        this.GetMaturityIntimationLetter(routeParams);      
        console.log(this.ShowData);
     

        for (let i = 0; i < this.ShowData.length; i++)
        {
            if (this.ShowData[i].pschemename.length != 0) {
                this.pschemename = this.ShowData[i].pschemename;
            }
            else {

            }
            if (this.ShowData[i].pmembername.length != 0) {
                this.pmembername = this.ShowData[i].pmembername;
            }
            else {

            }
            if (this.ShowData[i].pfdaccountno.length != 0) {
                this.pfdaccountno = this.ShowData[i].pfdaccountno;
            }
            else {

            }
            if (this.ShowData[i].pbranchname.length != 0) {
                this.pbranchname = this.ShowData[i].pbranchname;
            }
            else {

            }
            if (this.ShowData[i].pdepositamount.length != 0) {
                // this.pdepositamount = this._CommonService.currencyformat(parseFloat(this.ShowData[i].pdepositamount).toFixed(2));
                this.pdepositamount = this.ShowData[i].pdepositamount;
            }
            else {

            }
            if (this.ShowData[i].pmaturitydate.length != 0) {
                this.pmaturitydate = this.ShowData[i].pmaturitydate;
            }
            else {

            }
        }
    }
    
    GetMaturityIntimationLetter(routeParams) {
        debugger;
        this._LAReportsService.GetMaturityIntimationLetter(routeParams).subscribe(result => {
            this.ShowData = result;
            console.log(this.ShowData);
        })
        
    }
    public getComapnyName() {
        debugger;
        this.comapnydata = this._CommonService.comapnydetails;;
        this.pCompanyName = this.comapnydata['pCompanyName'];
        this.pAddress1 = this.comapnydata['pAddress1'];
        this.pAddress2 = this.comapnydata['pAddress2'];
        this.pcity = this.comapnydata['pcity'];
        this.pCountry = this.comapnydata['pCountry'];
        this.pState = this.comapnydata['pState'];
        this.pDistrict = this.comapnydata['pDistrict'];
        this.pPincode = this.comapnydata['pPincode'];
        this.pCinNo = this.comapnydata['pCinNo'];
        this.pGstinNo = this.comapnydata['pGstinNo'];
        this.pBranchname = this.comapnydata['pBranchname'];
    }
    print() {
        debugger;
        let printContents, popupWin;
        printContents = document.getElementById('maturityletter').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Lien Entry</title>
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
