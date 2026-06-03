import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { ReprintService } from 'src/app/Services/Accounting/reprint.service';
import { saveAs } from '@progress/kendo-file-saver';
import { CommonService } from 'src/app/Services/common.service';

import { AccountingTransactionsService } from '../../../Services/Accounting/accounting-transactions.service';

@Component({
  selector: 'app-lien-entry-preview',
  templateUrl: './lien-entry-preview.component.html',
  styles: []
})
export class LienEntryPreviewComponent implements OnInit {
  todaydate: any;
  branch: any;
  member: any;
  fdaccount: any;
  amount: any;
  adjustto: any;
  lienamount: any;
  date:any
  public lienid: any;
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
  companyName: string;
  pAddressF: string;
  pCompanybranch: string;
  lienId: string;
  lienIdData: any;
  lienEntryList: any = [];

  constructor(private FB: FormBuilder,private _CommonService: CommonService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private router: Router, private toastr: ToastrService, private activatedroute: ActivatedRoute, private _reprintservices: ReprintService) { }

  ngOnInit() {
    debugger;
    this.todaydate = new Date();
    debugger;
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));

    console.log("routeParams", routeParams);

    debugger;
    let splitData = routeParams.split(",");
    this.lienIdData = splitData[0];

    this.GetLienentryById(this.lienIdData);
    // this.date=splitData[0];
    // this.branch = splitData[1];
    // this.member = splitData[2];
    // this.fdaccount = splitData[3];
    // this.amount = splitData[4];
    // this.adjustto = splitData[5];
    // this.companyName = splitData[7];
    // this.pAddressF = splitData[8];
    // this.pCompanybranch = splitData[9];
    //this.lienamount = this._CommonService.currencyformat(parseFloat(splitData[6]).toFixed(2));
   // this.lienamount=splitData[6];
    this.getComapnyName() ;
  }

  GetLienentryById(id){
    debugger
    this._LienEntryService.GetLienentryById(id).subscribe(data => {
      this.lienEntryList = data;
      // let address = data['pAddress'].toString().replace(/@/g,"'").slice(0,-1);
      // this.pAddressF = address;
      this.pAddress1 = data['pAddress1'];
      this.pAddress2 = data['pAddress2'];
      this.pcity = data['city'];
      this.pState = data['state'];
      this.pPincode =  data['pincode'];
      this.member = data['pMembername'];
      this.companyName = data['pCompanyname'];
      this.pCompanybranch = data['pCompanybranch'];
      this.adjustto = data['pLienadjuestto'];
      this.fdaccount = data['pFdaccountno'];
      this.amount = data['pDepositamount'];
      this.lienamount = data['pLienamount'];
      this.date = data['pLiendate'];

    })

  }




  pdfGenerate() {
    debugger;
    let printContents, popupWin;
    printContents = document.getElementById('lienpdf').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Lien Entry</title>
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
    printContents = document.getElementById('lienpdf').innerHTML;
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
              @media print {
                @page {
                  size:A4;
                  margin:1cm;
                  width:210mm;
                  height:297mm;
                }
                p {
                  font-size:20px !important;
                }
              }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }





}
