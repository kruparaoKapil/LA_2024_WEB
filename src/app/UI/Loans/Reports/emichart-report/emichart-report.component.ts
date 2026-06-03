import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';

import { GroupDescriptor } from '@progress/kendo-data-query';
import { DisbusementService } from '../../../../Services/Loans/Transactions/disbusement.service';
@Component({
  selector: 'app-emichart-report',
  templateUrl: './emichart-report.component.html',
  styles: []
})
export class EmichartReportComponent implements OnInit {
  @Input() Vchapplicationid;
  public Loanname: any;
  public Loanamount: any;
  public Tenure: any;
  public Rateofinterest: any;
  public Installmentamount: any;
  public Payinmode: any;
  public TotalInterest: any;
  public Totalprinciple: any;
public Totalinstallmentmount: any;
  public Emistartdate: any;
  public Loanaccountno: any;
  public EmichartData: any;
  public GridData: any[];
  public Applicationid: any;
  public Applicantname: any;
  public loantype: any;
  public installmentmode: any;
  public ppartprinciplepaidinterval: any;
  public interesttype: any;
  public loading = true;
  constructor(private Datepipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _DisbusementService: DisbusementService, public toaster: ToastrService, private activatedroute: ActivatedRoute) { }

    ngOnInit() {
        debugger;
    this.loading = true;
    let applicationid;
    if (this.Vchapplicationid != '' && this.Vchapplicationid != 'undefined' && this.Vchapplicationid != null) {
      applicationid = this.Vchapplicationid;
    }
    else {
      applicationid = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    } 
    this.GetEmiChartReportbyid(applicationid);
    this.loading = false;
  }
  public GetEmiChartReportbyid(Applicationid) {
    
    this._DisbusementService.GetEmiChartReport(Applicationid).subscribe(res => {
      
      this.EmichartData = res;
      this.GridData = this.EmichartData.pEmichartlist;
      this.TotalInterest = this.GridData.reduce((sum, item) => sum + item.pInstalmentinterest, 0);
      this.Totalprinciple = this.GridData.reduce((sum, item) => sum + item.pInstalmentprinciple, 0);
      this.Totalinstallmentmount = this.GridData.reduce((sum, item) => sum + item.pInstalmentamount, 0);

      //this.GridData = this.GridData.filter(x => x.pInstalmentprinciple = x.pInstalmentprinciple);
      //this.GridData = this.GridData.filter(x => x.pInstalmentinterest = x.pInstalmentinterest);
      //this.GridData = this.GridData.filter(x => x.pInstalmentamount = x.pInstalmentamount);

      this.Loanname = this.EmichartData.pLoanname;
      this.Loanamount = this.EmichartData.pLoanamount;
      this.Tenure = this.EmichartData.pTenureofloan;
      this.Rateofinterest = this.EmichartData.pRateofinterest;
      this.interesttype = this.EmichartData.pInteresttype;
      this.Installmentamount = this.EmichartData.pinstallmentamount;
      this.Payinmode = this.EmichartData.pPayinmode;
      //this.Emistartdate = this.Datepipe.transform(this.EmichartData.pEmistartdate, "dd-MMM-yyyy");]
      this.Emistartdate =this.EmichartData.pEmistartdate;
      this.Applicationid = this.EmichartData.pApplicationid;
      this.Applicantname = this.EmichartData.pApplicantname;
      this.loantype = this.EmichartData.pLoantype;
      this.installmentmode = this.EmichartData.pInstalmentpaymentmode;
      this.ppartprinciplepaidinterval = this.EmichartData.ppartprinciplepaidinterval;
    
      this.loading = false;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Emi Chart Report</title>
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

}
