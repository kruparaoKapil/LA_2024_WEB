import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';

@Component({
  selector: 'app-maturity-payment-preview',
  templateUrl: './maturity-payment-preview.component.html',
  styles: []
})
export class MaturityPaymentPreviewComponent implements OnInit {
  printFileName : any = 'Maturity Payment'
  maturityPaymentId: any;
  MaturityPayment: any;
  OldDataMaturity: any = [];
  appName: any;
  totalAmount: any;
  period: any;
  adjustedAmount: any;
  extraReturnAmount: any;
  maturityDate: any;
  lessRenewalAmount: any;
  actualExtraReturnAmount: any;
  pTotal_amount: any;
  newDataMaturity: any = [];
  appNameNew: any;
  amountNew: any;
  periodNew: any;
  modeOfExtraReturn: any;
  modeOfExtraReturnNew: any;
  jvNoNew: any;
  noOfDaysExtraNew: any;
  perDayIntrestAmountNew: any;
  extraDaysInterestAmountNew: any;
  modeOfExtraReturnOld: any;

  constructor(private activatedroute: ActivatedRoute, private coreferral:CoReferralService) { }

  ngOnInit() {
    debugger
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",");
    this.maturityPaymentId = splitData[0];
    this.MaturityPayment = splitData[1];

    this.GetMaturityPaymetOldById(this.maturityPaymentId);

    this.GetMaturityPaymetNewById(this.maturityPaymentId);
  }

  GetMaturityPaymetOldById(oldData){
    this.coreferral.GetMaturityPaymetOldById(oldData).subscribe(data => {
      this.OldDataMaturity = data;

    this.appName =  data['pAppnName'];
    this.totalAmount =  data['pDepositamount'];
    this.adjustedAmount =  data['pPaid_amount'];
    this.period =  data['pTenor'];
    this.modeOfExtraReturnOld =  data['pInterestpayout'];
    this.extraReturnAmount =  data['pInterest_payble'];
    this.actualExtraReturnAmount =  data['pInterestpayable'];
    this.pTotal_amount =  data['pTotal_amount'];
    this.maturityDate =  data['pMaturitydate'];
    this.lessRenewalAmount =  data['pLess_renewal_amount'];



    })
  }

  GetMaturityPaymetNewById(newData){
    debugger
    this.coreferral.GetMaturityPaymetNewById(newData).subscribe(result => {
      this.newDataMaturity = result;
      this.appNameNew = result['pAppnName'];
      this.amountNew = result['pDepositamount'];
      this.periodNew = result['pTenor'];
      this.modeOfExtraReturnNew = result['pInterestpayout'];
      this.jvNoNew = result['pJvnumber'];
      this.noOfDaysExtraNew = result['pNemberof_daysextra'];
      this.perDayIntrestAmountNew = result['pPerday_interest_amount'];
      this.extraDaysInterestAmountNew = result['pExtradays_interest_amoun'];


      

    })
  }

}
