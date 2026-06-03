import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { match } from 'minimatch';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styles: []
})
export class BalanceSheetComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public submitted = false;
  BalanceSheetForm: FormGroup;
  public today: Date = new Date();
  public startDate: any = new Date();
  public isLoading: boolean = false;
  ShowAsOn = false;
  asondate: any;
  validate: any;
  gridData: any = [];
  balancesheetdata: any = [];
  TotalAmount = 0;
  fontcolor: any;
  public loading = false;
  hideprint = true;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.submitted = true;
    this.BalanceSheetForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required]
    })
    this.submitted = false;
    this.startDate = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
    this.GetBalanceSheetReports();
  }
  GetBalanceSheetReports() {
    let fromdate;
    let data;
    let Assetsmount;
    let Liabilityamount;
    let TotalAmount;
    this.loading = true
    this.isLoading = true;
    let pamount;
    this.asondate = this.datePipe.transform(this.BalanceSheetForm.controls.fromDate.value, "dd-MMM-yyyy");
    fromdate = this.datePipe.transform(this.BalanceSheetForm.controls.fromDate.value, "yyyy-MM-dd");
    this._reportservice.GetBalanceSheet(fromdate).subscribe(res => {
      
      this.loading = false
      this.isLoading = false;
      this.gridData = res;
      if (this.gridData.length > 0) {
        //total amount
        data = this.gridData.find(itm => itm.pAccountid == 1);
        Assetsmount = isNullOrUndefined(data) ? '0' : data.pAmount;

        Assetsmount = Assetsmount.replace('(', '').replace(')', '');
        data = this.gridData.find(itm => itm.pAccountid == 2);
        Liabilityamount = isNullOrUndefined(data) ? '0' : data.pAmount;
        Liabilityamount = Liabilityamount.replace('(', '').replace(')', '');
        TotalAmount = (parseFloat(Assetsmount) - parseFloat(Liabilityamount)).toFixed(2);
        this.TotalAmount = TotalAmount < 0 ? '(' + Math.abs(TotalAmount) + ')' : TotalAmount;
        if (this.TotalAmount != 0) {
          this.hideprint = false;
        }
        // convert amount to currency format
        this.gridData.reduce((acc, item, index) => {
          if (item.pAmount.includes('(')) {
            pamount = item.pAmount.replace('(', '').replace(')', '');
            pamount = '(' + this._CommonService.currencyformat(pamount) + ')';
            this.gridData[index].pAmount = pamount;
          }
          else {
            pamount = this.gridData[index].pAmount;
            this.gridData[index].pAmount = this._CommonService.currencyformat(pamount);
          }
        }, 0);
        /////////
      }


      else {
        this.TotalAmount = 0;
      }
    })
  }
  //this.asondate = this.datePipe.transform(this.ProfitAndLossForm.controls.fromDate.value, "dd-MMM-yyyy");

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Balance Sheet</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
        <style>
           span.text-danger {
           left: 483px !important;
           }
         span.text-primary {
           left: 483px !important;
            }

          span.text-success {
         left: 483px !important;
          }

         span.text-body {
        left: 483px !important;
         }
       total{
      left:-15px !important;
      }
          </style>
 
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
