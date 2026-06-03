import { Component, OnInit, NgZone, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanreceiptService } from 'src/app/Services/Loans/Transactions/loanreceipt.service';
import { LoanStatementServicesService } from 'src/app/Services/Loans/Transactions/loan-statement-services.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
declare var $: any;

@Component({
  selector: 'app-loan-statement-report',
  templateUrl: './loan-statement-report.component.html',
  styles: []
})
export class LoanStatementReportComponent implements OnInit {


  public formValidationMessages: any;
  public LoanTypes: Response;
  public pLoanid: any;
  public LoanStatementForm: FormGroup
  public isLoading = false;
  public loading = false;

  public loanreceiptAppliactionId: any;
  public pApplicationid: any;
  public dynamicLoanapplicationId: any;
  public loantypeid: any;
  public pLoantype: any;
  public LoanNames: any;
  public savebutton = 'Generate Report';
  public LoanStatementData: any;

  public pName: any;
  public pFathername: any;
  public pAddress: any;
  public pMobileno: any;
  public pEmailid: any;
  public pAadharno: any;
  public pPanNo: any;
  public pLoanno: any;
  public pInstalmentamount: any;
  public pLoanamount: any;
  public pFirstinstalmentdate: any;
  public pLoantypes: any;
  public pLastinstalmentdate: any;
  public pTenure: any;
  public pLoanpayin: any;
  public pCurrentStatus: any;
  public pInterest: any;
  public pLoanclosedDate: any;
  public pDisbursedDate: any;
  public pApplicationids: any;
  public pVchapplicationid: any;
  public pLoanname: any;
  public pTitlename: any;
  public todaydate: any;
  public ploaninstalmentpaymentmode: any;

  public pTransactionListDetails: any;
  public papplicantdocuments: any;
  public pContactImagePath: any;
  public LoanAccountStatementView = false;
  constructor(public datePipe: DatePipe, private _commonService: CommonService, private _loanmasterservice: LoansmasterService, private formbuilder: FormBuilder, private router: Router, private _loaanreceiptServie: LoanreceiptService, private zone: NgZone, private _LoanStatementServicesService: LoanStatementServicesService, private _defaultimage: DefaultProfileImageService) {

  }

  ngOnInit() {
    debugger;
    //this.LoanStatement();
  }

  public LoanStatement(applicationnumber) {
    debugger;
    let isvalid = true;


    try {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';

      this._LoanStatementServicesService.GetAccountstatementReport(applicationnumber).subscribe(res => {

        if (res !== null) {
          this.LoanAccountStatementView = true;
          this.LoanStatementData = res;
          this.pTransactionListDetails = this.LoanStatementData['pTransactionListDetails'];
          this.papplicantdocuments = this.LoanStatementData['pDocumentstoredetails'];
          this.pName = this.LoanStatementData['pName'];
          this.pFathername = this.LoanStatementData['pFathername'];
          this.pAddress = this.LoanStatementData['pAddress'];
          this.pMobileno = this.LoanStatementData['pMobileno'];
          this.pEmailid = this.LoanStatementData['pEmailid'];
          this.pAadharno = this.LoanStatementData['pAadharno'];
          this.pPanNo = this.LoanStatementData['pPanNo'];
          this.pLoanno = this.LoanStatementData['pLoanno'];
          this.pInstalmentamount = this.LoanStatementData['pInstalmentamount'];
          this.pLoanamount = this.LoanStatementData['pLoanamount'];
          this.pFirstinstalmentdate = this.LoanStatementData['pFirstinstalmentdate'];
          this.pLoantypes = this.LoanStatementData['pLoantype'];
          this.pLastinstalmentdate = this.LoanStatementData['pLastinstalmentdate'];
          this.pTenure = this.LoanStatementData['pTenure'];
          this.pLoanpayin = this.LoanStatementData['pLoanpayin'];
          this.pCurrentStatus = this.LoanStatementData['pCurrentStatus'];
          this.pInterest = this.LoanStatementData['pInterest'];
          this.pLoanclosedDate = this.LoanStatementData['pLoanclosedDate'];
          this.pDisbursedDate = this.LoanStatementData['pDisbursedDate'];
          this.pApplicationids = this.LoanStatementData['pApplicationid'];
          this.pVchapplicationid = this.LoanStatementData['pVchapplicationid'];
          this.pLoanname = this.LoanStatementData['pLoanname'];
          this.pTitlename = this.LoanStatementData['pTitlename'];
          this.ploaninstalmentpaymentmode = this.LoanStatementData['ploaninstalmentpaymentmode'];
          if (this.LoanStatementData['pContactImagePath'] == "") {
            this.pContactImagePath = this._defaultimage.GetdefaultImage()
          }
          else {
            this._commonService.ConvertImagepathtobase64(this.LoanStatementData['pContactImagePath']).subscribe(imagepath => {
              this.pContactImagePath = "data:image/png;base64," + imagepath;

            })
          }
          this.loading = false;
          this.isLoading = false;

        }
        else {
          this.loading = false;
          this.isLoading = false;

        }
      },
        (error) => {
          this._commonService.showErrorMessage(error);
          this.loading = false;
          this.isLoading = false;

        });


    } catch (e) {
      this._commonService.showErrorMessage(e);
      this.loading = false;
      this.isLoading = false;

    }


  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  public print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Loan Statement</title>
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

