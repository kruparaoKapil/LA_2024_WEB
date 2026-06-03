import { Component, OnInit, ViewChild } from '@angular/core';
import { SanctionletterService } from '../../../../Services/Loans/Transactions/sanctionletter.service';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

import { from } from 'rxjs';
@Component({
  selector: 'app-sanction-letter',
  templateUrl: './sanction-letter.component.html',
  styles: []
})
export class SanctionLetterComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private datepipe: DatePipe, private _SanctionletterService: SanctionletterService, private _CommonService: CommonService, private toastr: ToastrService) {
    this.allData = this.allData.bind(this);
  }
  SanctionLetterdata: any;
  date: any;
  today: any;
  sanctiondate: any;
  loading = false;
  loadingletters = false;
  SanctionLettertempdata: any;
  SanctionLettercountdata: any;
  SanctionLetter: any;
  SanctionLetterdataByid: any;
  loantypeandCode: any;
  pLoantype:any;
  pInteresttype:any;
  pLoanname: any;
  applicantname: any;
  approvedloanamount: any;
  tenureofloan: any;
  loanpayin: any;
  downpayment: any;
  installmentamount: any;
  chargesList: any = [];
  applicantEmail: any;
  applicantMobileNo: any;
  Titlename: any;

  paddress: any;
 ppurposeofloan: any;

  coapplicantslist: any = [];
  indexlength: any;

  Savebbutton = false;
  pVchapplicationIDGrid: any;
  notsend: any;
  send: any;
  Letterstatus: any;
  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  ngOnInit() {
    debugger
    this.SanctionLetter = '';
    this.Letterstatus = 'n';
    this.Savebbutton = true;
    this.GetSanctionLetter(this.Letterstatus);
  }

  GetSanctionLetter(letterstatus) {
    this.loading = true;
    this._SanctionletterService.GetSanctionLetterBystatus(letterstatus).subscribe(data => {
      if (data != null) {
        debugger
        this.SanctionLetterdata = data;
        this.SanctionLetterdata.filter(function (df) { df.pIsprimaryAccount = false; });
        this.SanctionLettertempdata = this.SanctionLetterdata;

      }
      this.loading = false;

    });
    this.GetSanctionLettercount();

  }
  GetSanctionLettercount() {

    this._SanctionletterService.GetSanctionLetterAllcount().subscribe(data => {
      this.SanctionLettercountdata = data;
      if (this.SanctionLettercountdata[0]['pStatus'] == 'NOT SENT') {
        this.notsend = this.SanctionLettercountdata[0]['pCount'];
        this.send = this.SanctionLettercountdata[1]['pCount'];
      }
      else {
        this.notsend = this.SanctionLettercountdata[1]['pCount'];
        this.send = this.SanctionLettercountdata[0]['pCount'];
      }

    });
  }
  Clicknotsend() {
    this.GetSanctionLetter('n');
    this.SanctionLetter = '';
    this.Savebbutton = true;

  }
  Clicksend() {
    this.SanctionLetterdata = '';
    this.SanctionLettertempdata = '';
    this.SanctionLetter = '';
    this.GetSanctionLetter('y');
    this.Savebbutton = false;

  }

  selectsanctionletter(dataItem, row) {

    let i = -1;
    this.SanctionLetterdata.filter(function (df) {
      i++;
      if (row == i) {
        df.pIsprimaryAccount = true;
      }
      else {
        df.pIsprimaryAccount = false;
      }
    });
    let applicationid = dataItem['pVchapplicationID'];
    this.Sanctionletterdetails(applicationid);
    this.SanctionLetter = 'show';
  }
  Sanctionletterdetails(applicationid) {
    debugger
    this.loadingletters = true;
    this.pInteresttype='';
    this.paddress='';
    this.ppurposeofloan='';
    this.date = new Date();
    this.today = this.datepipe.transform(this.date, 'd/MM/y');

    this._SanctionletterService.SanctionletterdetailsByID(applicationid).subscribe(data => {
      this.SanctionLetterdataByid = data;
      //this.SanctionLetterdataByid = this.SanctionLetterdataByid.filter(x => x.pApprovedDate = this._CommonService.formatDateFromDDMMYYYY(x.pApprovedDate));
      // this.sanctiondate = this.datepipe.transform(this.SanctionLetterdataByid['pApprovedDate'], 'dd/MM/yyyy');

      this.sanctiondate = this.SanctionLetterdataByid['pApprovedDate'];
      this.pVchapplicationIDGrid = this.SanctionLetterdataByid['pVchapplicationID'];
      this.paddress=this.SanctionLetterdataByid['paddress'];
      this.ppurposeofloan=this.SanctionLetterdataByid['ppurposeofloan'];
      this.pLoanname = this.SanctionLetterdataByid['pLoanname'];
      this.pLoantype = this.SanctionLetterdataByid['pLoantype'];
      this.pInteresttype=this.SanctionLetterdataByid['pInteresttype'];
      this.applicantname = this.SanctionLetterdataByid['pApplicantname'];
      this.approvedloanamount = this.SanctionLetterdataByid['pApprovedloanamount'];
      this.loantypeandCode = this.SanctionLetterdataByid['pLoantypeandCode'];
      this.tenureofloan = this.SanctionLetterdataByid['pTenureofloan'];
      this.loanpayin = this.SanctionLetterdataByid['pLoanpayin'];
      this.downpayment = this.SanctionLetterdataByid['pDownpayment'];
      this.installmentamount = this.SanctionLetterdataByid['pInstallmentamount'];
      this.chargesList = this.SanctionLetterdataByid['pChargesList'];
      this.applicantEmail = this.SanctionLetterdataByid['pApplicantEmail'];
      this.applicantMobileNo = this.SanctionLetterdataByid['pApplicantMobileNo'];
      this.Titlename = this.SanctionLetterdataByid['pTitlename'];

      this.coapplicantslist = [];
      for (let i = 0; this.SanctionLetterdataByid['pCoapplicantslist'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pCoapplicantslist'][i]);
      }
      for (let i = 0; this.SanctionLetterdataByid['pGuarantorslist'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pGuarantorslist'][i]);
      }
      for (let i = 0; this.SanctionLetterdataByid['pPromoterslist'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pPromoterslist'][i]);
      }
      for (let i = 0; this.SanctionLetterdataByid['pPartnerslist'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pPartnerslist'][i]);
      }
      for (let i = 0; this.SanctionLetterdataByid['pGuardianOrParentlist'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pGuardianOrParentlist'][i]);
      }
      for (let i = 0; this.SanctionLetterdataByid['pJointOwnersList'].length > i; i++) {
        this.coapplicantslist.push(this.SanctionLetterdataByid['pJointOwnersList'][i]);
      }

      this.indexlength = this.coapplicantslist.length + 1;
      this.loadingletters = false;

    });

  }
  save() {

    this.SanctionLetterdataByid['createdby'] = this._CommonService.pCreatedby;
    this._SanctionletterService.SaveSanctionLetterdata(this.SanctionLetterdataByid).subscribe(res => {
      this.toastr.success("successfully Save", "Success");
      this.SanctionLetterdata = '';
      this.GetSanctionLetter(this.Letterstatus);
      this.Savebbutton = false;
      this.SanctionLetter = '';

    });
  }
  print() {

    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Sanction Letter</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
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
  onFilterNotsend(inputValue: string) {

    this.SanctionLetterdata = process(this.SanctionLettertempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApprovedloanamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantMobileNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantEmail',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.SanctionLetterdata, { sort: [{ field: 'pVchapplicationID', dir: 'desc' }] }).data
    };

    return result;
  }
}
