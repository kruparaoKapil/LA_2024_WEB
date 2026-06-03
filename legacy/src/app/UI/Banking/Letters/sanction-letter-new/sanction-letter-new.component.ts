import { Component, OnInit } from '@angular/core';
import { SanctionletterService } from '../../../../Services/Loans/Transactions/sanctionletter.service';
@Component({
  selector: 'app-sanction-letter-new',
  templateUrl: './sanction-letter-new.component.html',
  styleUrls: []
})
export class SanctionLetterNewComponent implements OnInit {
  SanctionLetterdataByid:any=[];
  constructor(private _SanctionletterService: SanctionletterService) { }

  ngOnInit() {
    this.Sanctionletterdetails();
  }
  Sanctionletterdetails(){
    debugger;
    let applicationid='PLTLMKITGB2100001';
    this._SanctionletterService.SanctionletterdetailsByID(applicationid).subscribe(data => {
      this.SanctionLetterdataByid = data;
   
      // this.sanctiondate = this.SanctionLetterdataByid['pApprovedDate'];
      // this.pVchapplicationIDGrid = this.SanctionLetterdataByid['pVchapplicationID'];

      // this.pLoanname = this.SanctionLetterdataByid['pLoanname'];
      // this.pLoantype = this.SanctionLetterdataByid['pLoantype'];
      // this.applicantname = this.SanctionLetterdataByid['pApplicantname'];
      // this.approvedloanamount = this.SanctionLetterdataByid['pApprovedloanamount'];
      // this.loantypeandCode = this.SanctionLetterdataByid['pLoantypeandCode'];
      // this.tenureofloan = this.SanctionLetterdataByid['pTenureofloan'];
      // this.loanpayin = this.SanctionLetterdataByid['pLoanpayin'];
      // this.downpayment = this.SanctionLetterdataByid['pDownpayment'];
      // this.installmentamount = this.SanctionLetterdataByid['pInstallmentamount'];
      // this.chargesList = this.SanctionLetterdataByid['pChargesList'];
      // this.applicantEmail = this.SanctionLetterdataByid['pApplicantEmail'];
      // this.applicantMobileNo = this.SanctionLetterdataByid['pApplicantMobileNo'];
      // this.Titlename = this.SanctionLetterdataByid['pTitlename'];

      // this.coapplicantslist = [];
      // for (let i = 0; this.SanctionLetterdataByid['pCoapplicantslist'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pCoapplicantslist'][i]);
      // }
      // for (let i = 0; this.SanctionLetterdataByid['pGuarantorslist'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pGuarantorslist'][i]);
      // }
      // for (let i = 0; this.SanctionLetterdataByid['pPromoterslist'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pPromoterslist'][i]);
      // }
      // for (let i = 0; this.SanctionLetterdataByid['pPartnerslist'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pPartnerslist'][i]);
      // }
      // for (let i = 0; this.SanctionLetterdataByid['pGuardianOrParentlist'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pGuardianOrParentlist'][i]);
      // }
      // for (let i = 0; this.SanctionLetterdataByid['pJointOwnersList'].length > i; i++) {
      //   this.coapplicantslist.push(this.SanctionLetterdataByid['pJointOwnersList'][i]);
      // }

      // this.indexlength = this.coapplicantslist.length + 1;
      // this.loadingletters = false;

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
