import { Component, OnInit, ViewChild } from '@angular/core';
import { DisbursmentLetterService } from '../../../../Services/Loans/Transactions/disbursment-letter.service';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JsonpInterceptor } from '@angular/common/http';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-welcome-letter',
  templateUrl: './welcome-letter.component.html',
  styleUrls: []
})
export class WelcomeLetterComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private datepipe: DatePipe, private _DisbursmentLetterService: DisbursmentLetterService, private _CommonService: CommonService, private toastr: ToastrService) {

    this.allData = this.allData.bind(this);
  }

  DisburementLetter: any;
  Disburementdate: any;

  Letterstatus: any;
  loading: any;
  loadingletters: any;

  date: any;
  today: any;

  DisburementLetterdata: any;
  DisburementLettertepdata: any;
  DisburementLetterdataByid: any;

  Savebbutton: any;

  Applicantname: any;
  Applicantaddress1: any;
  Applicantcity: any;
  Applicantdistrict: any;
  ApplicantState: any;
  Applicantpincode: any;
  Loantype: any;
  VchapplicationID: any;
  ApplicantMobileNo: any;
  Approvedloanamount: any;
  ApprovedDate: any;
  Disbursalamount: any;
  Modeofpayment: any;
  InterestRate: any;
  Interesttype: any;
  Loanpayin: any;
  Installmentamount: any;
  Voucherno: any;
  Tenureofloan: any;
  pLoanname:any;
  DisburementLettercountdata: any;
  notsend: any;
  send: any;
  pInstallmentenddate:any;
  pInstallmentstartdate:any;
  totaldisburseamount:any=0;
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

    this.date = new Date();
    this.today = this.datepipe.transform(this.date, 'd/MM/y');
    this.DisburementLetter = '';
    this.Letterstatus = 'n';
    this.Savebbutton = true;
    this.GetDisburementLetter(this.Letterstatus);

  }
  GetDisburementLetter(letterstatus) {
    this.loading = true;
    this._DisbursmentLetterService.GetDisbursmentLetterBystatus(letterstatus).subscribe(data => {

      if (data != null) {
        this.DisburementLetterdata = data;
        this.DisburementLetterdata.filter(function (df) { df.pIsprimaryAccount = false; });
        this.DisburementLettertepdata = this.DisburementLetterdata;
      }
      this.loading = false;
    });
    this.GetDisburementLettercount();
  }

  GetDisburementLettercount() {
    this._DisbursmentLetterService.GetDisbursmentLetterAllcount().subscribe(data => {
      this.DisburementLettercountdata = data;
      if (this.DisburementLettercountdata[0]['pStatus'] == 'NOT SENT') {
        this.notsend = this.DisburementLettercountdata[0]['pCount'];
        this.send = this.DisburementLettercountdata[1]['pCount'];
      }
      else {
        this.notsend = this.DisburementLettercountdata[1]['pCount'];
        this.send = this.DisburementLettercountdata[0]['pCount'];
      }
    });
  }

  Clicknotsend() {

    this.DisburementLetterdata = '';
    this.DisburementLettertepdata = '';
    this.DisburementLetter = '';
    this.GetDisburementLetter('n');
    this.DisburementLetter = '';
    this.Savebbutton = true;

  }
  Clicksend() {
    this.DisburementLetterdata = '';
    this.DisburementLettertepdata = '';
    this.DisburementLetter = '';
    this.GetDisburementLetter('y');
    this.Savebbutton = false;

  }

  selectDisbursalletter(dataItem, row) {

    let i = -1;
    this.DisburementLetterdata.filter(function (df) {
      i++;
      if (row == i) {
        df.pIsprimaryAccount = true;
      }
      else {
        df.pIsprimaryAccount = false;
      }
    });
    let applicationid = dataItem['pVchapplicationID'];
    let voucherno = dataItem['pVoucherno'];
    this.Sanctionletterdetails(applicationid, voucherno);
    this.DisburementLetter = 'show';
  }
  Sanctionletterdetails(applicationid, voucherno) {
    this.loadingletters = true;

    debugger
    //this.date = new Date();
    // this.today = this.datepipe.transform(this.date, 'd/MM/y');

    this._DisbursmentLetterService.DisbursmentLetterdetailsByID(applicationid, voucherno).subscribe(data => {
      this.DisburementLetterdataByid = data;
      this.Applicantname = this.DisburementLetterdataByid['pApplicantname'];
      this.Applicantaddress1 = this.DisburementLetterdataByid['pApplicantaddress1'];
      this.Applicantcity = this.DisburementLetterdataByid['pApplicantcity'];
      this.Applicantdistrict = this.DisburementLetterdataByid['pApplicantdistrict'];
      this.ApplicantState = this.DisburementLetterdataByid['pApplicantState'];
      this.Applicantpincode = this.DisburementLetterdataByid['pApplicantpincode'];
      this.Loantype = this.DisburementLetterdataByid['pLoantype'];
      this.VchapplicationID = this.DisburementLetterdataByid['pVchapplicationID'];
      this.Voucherno = this.DisburementLetterdataByid['pVoucherno'];
      this.ApplicantMobileNo = this.DisburementLetterdataByid['pApplicantMobileNo'];
      this.Approvedloanamount = this.DisburementLetterdataByid['pApprovedloanamount'];
      this.ApprovedDate = this.DisburementLetterdataByid['pApprovedDate'];
      this.Disbursalamount = this.DisburementLetterdataByid['pDisbursalamount'];
      this.Modeofpayment = this.DisburementLetterdataByid['pModeofpayment'];
      this.InterestRate = this.DisburementLetterdataByid['pInterestRate'];
      this.Interesttype = this.DisburementLetterdataByid['pInteresttype'];
      this.Loanpayin = this.DisburementLetterdataByid['pLoanpayin'];
      this.Installmentamount = this.DisburementLetterdataByid['pInstallmentamount'];
      this.Tenureofloan = this.DisburementLetterdataByid['pTenureofloan'];
      this.Disburementdate = this.DisburementLetterdataByid['pDisbursedDate'];
      this.pLoanname = this.DisburementLetterdataByid['pLoanname'];
      this.pInstallmentstartdate = this.DisburementLetterdataByid['pInstallmentstartdate'];
      this.pInstallmentenddate = this.DisburementLetterdataByid['pInstallmentenddate'];
    });
    this.loadingletters = false;
  }
  save() {

    this.DisburementLetterdataByid['createdby'] = this._CommonService.pCreatedby;
    this._DisbursmentLetterService.SaveDisbursmentLetterdata(JSON.stringify(this.DisburementLetterdataByid)).subscribe(res => {
      this.Savebbutton = false;
      this.DisburementLetter = '';
      this.DisburementLetterdata = '';
      this.GetDisburementLetter(this.Letterstatus);
      this.toastr.success("successfully Save", "Success")
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
            <title>Delivery Order</title>
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
  onFilter(inputValue: string) {

    this.DisburementLetterdata = process(this.DisburementLettertepdata, {
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
      data: process(this.DisburementLetterdata, { sort: [{ field: 'pVchapplicationid', dir: 'desc' }] }).data
    };

    return result;
  }
}
