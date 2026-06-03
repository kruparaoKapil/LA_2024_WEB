import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trialbalance-accountledger',
  templateUrl: './trialbalance-accountledger.component.html',
  styles: []
})
export class TrialbalanceAccountledgerComponent implements OnInit {

  @Input() accountledgerdetails;
@Input() fromdate;
@Input() todate;
@Input() accountid;
@Input() GroupType;
gridView:any;
  constructor(private _reportservice:ReportService, private toastr:ToastrService) { }

  ngOnInit() {
    
    if(this.GroupType=="ASON"){
      this.fromdate="01-Jan-0001";
    }
    this._reportservice.GetLedgerReport(this.fromdate,this.todate,this.accountid,this.accountledgerdetails.paccountid).subscribe(data=>{
      this.gridView=data;
    },error=>{this.toastr.error(error, 'Error')})
  }

  click(data){
    
    if(data.pFormName == "GENERAL VOUCHER")
    {
      let receipt =btoa(data.ptransactionno); 
    window.open('/#/GeneralReceiptReports?id=' + receipt);
    }
    if(data.pFormName == "PAYMENT VOUCHER"){
      let receipt =btoa(data.ptransactionno); 
      window.open('/#/PaymentVoucherReports?id=' + receipt  );
    }
    if(data.pFormName == "JOURNAL VOUCHER"){
      let receipt = btoa(data.ptransactionno); 
      window.open('/#/JournalvoucherReport?id=' + receipt);
    }
    if(data.pFormName == "CHEQUES IN BANK"){
      this._reportservice.GetReferenceNo(data.pFormName,data.ptransactionno).subscribe(referenceno=>{
        
        let id=btoa(referenceno[0]);
        window.open('/#/GeneralReceiptReports?id=' + id );
      })
    }
  }
}
