import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trialbalance-ledgersummery',
  templateUrl: './trialbalance-ledgersummery.component.html',
  styles: []
})
export class TrialbalanceLedgersummeryComponent implements OnInit {
  @Input() ledgersummarydetails;
  @Input() fromdate;
  @Input() todate;
  @Input() Grouptype;
  id:any;
  gridData:any;
  hidegridcolumn=true;
  public loading=false;
    constructor(private _reportservice:ReportService, private toastr:ToastrService, private _commonservice:CommonService ) { }
  
    ngOnInit() {
    if(this.Grouptype=="ASON"){
      this.hidegridcolumn=false;
    }
    if(this.Grouptype=="BETWEEN"){
      this.hidegridcolumn=true;
    }
  this.id=this.ledgersummarydetails.paccountid;
    this._reportservice.GetLedgerSummary(this.fromdate,this.todate,this.id).subscribe(data=>{
      
      this.gridData=data;
      for(let i=0;i<this.gridData.length;i++){
        if (this.gridData[i].pdebitamount < 0) {
          let debitamount = Math.abs(this.gridData[i].pdebitamount)
          this.gridData[i].pdebitamount = debitamount
        }
        if (this.gridData[i].pcreditamount < 0) {
          let creditamount = Math.abs(this.gridData[i].pcreditamount)
          this.gridData[i].pcreditamount = creditamount
        }
    //  this.caldebitamount = this.caldebitamount + this.gridData[i].pdebitamount
    //  this.calcreditamount = this.calcreditamount + this.gridData[i].pcreditamount
      if (this.gridData[i].popeningbal < 0) {
        let openingbal = Math.abs(this.gridData[i].popeningbal)
        this.gridData[i].popeningbal = this._commonservice.currencyformat(openingbal) + ' ' + " Cr";
      }
      else if (this.gridData[i].popeningbal == 0) {
        this.gridData[i].popeningbal = ' '
      }
      else {
        this.gridData[i].popeningbal = this._commonservice.currencyformat(this.gridData[i].popeningbal) + ' ' + " Dr";
      }
      if (this.gridData[i].pclosingbal < 0) {
        let closingbal = Math.abs(this.gridData[i].pclosingbal)
  
        this.gridData[i].pclosingbal = this._commonservice.currencyformat(closingbal) + ' ' + " Cr";
      }
      else if (this.gridData[i].pclosingbal == 0) {
        this.gridData[i].pclosingbal = ' ' 
      }
      else {
        this.gridData[i].pclosingbal = this._commonservice.currencyformat(this.gridData[i].pclosingbal) + ' ' + " Dr";
      }
    } 
    },error=>{this.toastr.error(error, 'Error')})
  }
  

}
