import { Component, OnInit, Input } from '@angular/core';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
@Component({
  selector: 'app-fd-transcation-details',
  templateUrl: './fd-transcation-details.component.html',
  styles: []
})
export class FdTranscationDetailsComponent implements OnInit {
  public FdDetailsListByid: any;
  public Fdaccountno: any;
  public Membername: any;
  public Deposiamount: any;
  public Maturityamount: any;
  public Tenortype: any;
  public Tenor: any;
  public Interesttype: any;
  public Interestrate: any;
  public InterestPayble: any;
  public InterestPayout: any;
  public MemberType: any;
  public Depositamount: any;
  public TransDate: any;
  public DepositDate: any;
  public MaturityDate: any;
  public TotalAmount: any = 0;
  public ReceivedAmount: any;
  public BalanceAmount: any = 0;
  public PendingChequeAmount: any = 0;

  public disabledforButtons: boolean = true;
  
  constructor(private _FdReceiptService: FdReceiptService) { }

  ngOnInit() {
    //this.BindData();
  }
  BindData(InputFdAccountNo,pFdaccountid) {
    this._FdReceiptService.GetFdDetailsById(InputFdAccountNo,pFdaccountid).subscribe(result => {
      debugger;

      if (result) {

        this.FdDetailsListByid = result;
        this.Fdaccountno = this.FdDetailsListByid[0].pFdaccountno;
        this.Membername = this.FdDetailsListByid[0].pMembername;
        this.Deposiamount = this.FdDetailsListByid[0].pDeposiamount;
        this.Maturityamount = this.FdDetailsListByid[0].pMaturityamount;
        this.Tenortype = this.FdDetailsListByid[0].pTenortype;
        this.Tenor = this.FdDetailsListByid[0].pTenor;
        this.Interesttype = this.FdDetailsListByid[0].pInteresttype;
        this.Interestrate = this.FdDetailsListByid[0].pInterestrate;
        this.InterestPayble = this.FdDetailsListByid[0].pInterestPayble;
        this.InterestPayout = this.FdDetailsListByid[0].pInterestPayout;
        this.Depositamount = this.FdDetailsListByid[0].pDeposiamount;
        this.DepositDate = this.FdDetailsListByid[0].pDeposidate;
        this.MaturityDate = this.FdDetailsListByid[0].pMaturitydate;
        this.TransDate = this.FdDetailsListByid[0].pTransdate;
        this.TotalAmount = this.FdDetailsListByid[0].pDeposiamount;
        this.ReceivedAmount = this.FdDetailsListByid[0].pClearedmount;
        this.BalanceAmount = this.FdDetailsListByid[0].pBalanceamount;
        this.PendingChequeAmount = this.FdDetailsListByid[0].pPendingchequeamount;
        
      }
    })
  }
}
