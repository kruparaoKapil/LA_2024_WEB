import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralReceiptService } from 'src/app/Services/Accounting/general-receipt.service';

@Component({
  selector: 'app-pre-maturity-preview',
  templateUrl: './pre-maturity-preview.component.html',
  styles: []
})
export class PreMaturityPreviewComponent implements OnInit {
  printFileName : any = 'PreMaturityDetails'
  originalCertificate: any;
  paCard: string;
  preMaturityDataId: any;
  PreMaturityDetailsList: any = [];
  preMaturityType: any;
  pBranchName: any;
  pDepositDate: any;
  pInterestpayout: any;
  pDepositamount: any;
  pInterestpayable: any;
  pMaturitydate: any;
  pTenor: any;
  pNetpayable: any;
  pMembername: any;
  pTdsamount: any;
  pPeriodin_days: any;
  pPre_Maturitydate: any;
  pInterestrate: any;
  pPre_interest_rate: any;
  pInterest_paid: any;
  pDamages: any;
  pAgent_commssion_payable: any;
  pTotal: any;
  pCalculate_extra_return: any;
  lienReleaseList: any = [];
  showGrid: boolean;
  pInterestpayoutPre: any;
  pInterestpayoutMA: any;


  constructor(private activatedroute: ActivatedRoute, private _GeneralReceiptService: GeneralReceiptService) { }
  ngOnInit() {
    debugger;
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",");
    this.preMaturityDataId = splitData[0];
    this.preMaturityType = splitData[1];
    this.getMaturityBondById();
   }
   
   getMaturityBondById(){
    debugger;
    this._GeneralReceiptService.getMaturityBondById(this.preMaturityDataId,this.preMaturityType).subscribe(result => {
      console.log('this is premat:',result);
      
      if(this.preMaturityType == 'Pre-Maturity'){
      this.PreMaturityDetailsList = result;
      this.pBranchName = result.pBranchName;
      this.pDepositDate = result.pDepositDate;
      this.pInterestpayout = result.pInterestpayout;
      this.pDepositamount = result.pDepositamount;
      this.pInterestpayable = result.pInterestpayable;
      this.pMaturitydate = result.pMaturitydate;
      this.pTenor = result.pTenor;
      this.pNetpayable = result.pNetpayable;
      this.pMembername = result.pFdaccountno + ' ' + '-' +  ' ' +  result.pMembername;
      this.pTdsamount = result.pTdsamount;  
      this.pPeriodin_days = result.pPeriodin_days;
      this.pPre_Maturitydate = result.pPre_Maturitydate;
      this.pInterestrate = result.pInterestrate;
      this.pPre_interest_rate = result.pPre_interest_rate;
      this.pInterest_paid = result.pInterest_paid;
      this.pDamages = result.pDamages;
      this.pAgent_commssion_payable = result.pAgent_commssion_payable;
      this.pTotal = result.pTotal;
      this.pCalculate_extra_return = result.pCalculate_extra_return;
      this.pInterestpayoutPre = result.pInterestpayout;
      }


      if(this.preMaturityType == 'Maturity'){
        this.PreMaturityDetailsList = result;
      this.pBranchName = result.pBranchName;
      this.pDepositDate = result.pDepositDate;
      this.pInterestpayout = result.pInterestpayout;
      this.pDepositamount = result.pDepositamount;
      this.pInterestpayable = result.pInterestpayable;
      this.pMaturitydate = result.pMaturitydate;
      this.pTenor = result.pTenor;
      this.pNetpayable = result.pNetpayable;
      this.pMembername = result.pFdaccountno + ' ' + '-' +  ' ' +  result.pMembername;
      this.pTdsamount = result.pTdsamount;  
      this.lienReleaseList = result.lienrealses;
      this.pInterestpayoutMA = result.pInterestpayout;
      }

      if(this.lienReleaseList != 0){
        this.showGrid = true;

      }
      if(this.lienReleaseList == 0){
        this.showGrid = false;
        
      }
         
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
          <title>Maturity Details</title>
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
