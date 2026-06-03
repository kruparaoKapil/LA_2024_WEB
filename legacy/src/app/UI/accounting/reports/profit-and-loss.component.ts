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
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styles: []
})
export class ProfitAndLossComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public submitted = false;
  ProfitAndLossForm: FormGroup;
  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();
  ShowAsOn = false;
  ShowBetween = true;
  asondate: any;
  from: any;
  to: any;
  validate: any;
  endDatesReport: any;
  startDatesReport: any;
  TotalAmount = 0;
  hide = true;
  gridData: any = [];
  profitandlossdata = [];
  grouptype = "BETWEEN";
  FromDate = "Date";
  fontcolor: any;
  public loading = false;
  public isLoading = false;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService, private toastr: ToastrService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    this.submitted = true;
    
    this.ProfitAndLossForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    })
    this.submitted = false;
    //this.startDate = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
    //this.endDate = this.datePipe.transform(this.endDate, "dd-MM-yyyy");
    this.hide = false;
    this.grouptype = "ASON";
    this.ShowAsOn = true;
    this.ShowBetween = false;
    this.ProfitAndLossForm.controls.fromDate.setValue(new Date());
    this.ProfitAndLossForm.controls.toDate.setValue(new Date());
    this.asondate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.GetProfitandlossReports();
  }
  checkboxChecked(event) {
    
    if (event.target.checked == true) {
      this.hide = false;
      this.grouptype = "ASON";
      this.ProfitAndLossForm.controls.fromDate.setValue(new Date());
      this.ProfitAndLossForm.controls.toDate.setValue(new Date());
      this.FromDate = "Date";
    }
    else {
      this.hide = true;
      this.grouptype = "BETWEEN";
      this.ProfitAndLossForm.controls.fromDate.setValue(new Date());
      this.ProfitAndLossForm.controls.toDate.setValue(new Date());
      this.FromDate = "From Date";
    }

  }

  OnBrsDateChanges(fromdate, todate): boolean {

    let isvalidate = true;
    if (todate != "") {
      if (fromdate > todate) {
        isvalidate = true;
      }
      else {
        isvalidate = true;
      }
    }
    return isvalidate;
  }
  GetProfitandlossReports() {
    

    let fromdate;
    let todate;
    let Incomeamount;
    let Expensesamount;
    let data;
    let TotalAmount;
    let pamount;
    if (this.OnBrsDateChanges(this.ProfitAndLossForm.controls.fromDate.value, this.ProfitAndLossForm.controls.toDate.value)) {
      this.loading = true
      this.isLoading = true;
      fromdate = this.datePipe.transform(this.ProfitAndLossForm.controls.fromDate.value, 'MM/dd/yyyy');
      todate = this.datePipe.transform(this.ProfitAndLossForm.controls.toDate.value, 'MM/dd/yyyy');

      if (this.grouptype == "ASON") {
        this.asondate = this.datePipe.transform(this.ProfitAndLossForm.controls.fromDate.value, "dd-MMM-yyyy");
        this.ShowAsOn = true;
        this.ShowBetween = false;
      }
      else {
        this.ShowAsOn = false;
      }
      if (this.grouptype == "BETWEEN") {

        this.from = this.datePipe.transform(this.ProfitAndLossForm.controls.fromDate.value, "dd-MMM-yyyy");
        this.to = this.datePipe.transform(this.ProfitAndLossForm.controls.toDate.value, "dd-MMM-yyyy");
        this.ShowAsOn = false;
        this.ShowBetween = true;
      }
      else {
        this.ShowBetween = false;
      }
      this.endDatesReport = todate;
      this.startDatesReport = fromdate;
      fromdate = this.datePipe.transform(fromdate, "yyyy-MM-dd");
      todate = this.datePipe.transform(todate, "yyyy-MM-dd");
      this._reportservice.GetProfitAndLossdata(fromdate, todate, this.grouptype).subscribe(res => {
        
        this.loading = false;
        this.isLoading = false;
        this.gridData = res;
        if (this.gridData.length > 0) {
          data = this.gridData.find(itm => itm.pAccountname == 'INCOME');
          Incomeamount = isNullOrUndefined(data) ? '0' : data.pAmount;
          data = this.gridData.find(itm => itm.pAccountname == 'EXPENSES');
          Expensesamount = isNullOrUndefined(data) ? '0' : data.pAmount;
          TotalAmount = (parseFloat(Incomeamount) - parseFloat(Expensesamount)).toFixed(2);
          this.TotalAmount = TotalAmount < 0 ? '(' + this._CommonService.currencyformat(Math.abs(TotalAmount)) + ')' : this._CommonService.currencyformat(TotalAmount);
          this.fontcolor = TotalAmount < 0 ? "text-danger" : "text-success";
          //set currencyformat
          this.gridData.reduce((acc, item, index) => {
            this.gridData[index].pAmount = item.pAmount < 0 ? '(' + this._CommonService.currencyformat(Math.abs(item.pAmount)) + ')' : this._CommonService.currencyformat(item.pAmount);

          }, 0);
          //get total amount
          // data = this.gridData.find(itm => itm.pAccountname == 'INCOME');
          // Incomeamount = isNullOrUndefined(data) ? '0' : data.pAmount;
          //  Incomeamount = Incomeamount.replace('(', '').replace(')', '');
          // data = this.gridData.find(itm => itm.pAccountname == 'EXPENSES');
          // Expensesamount = isNullOrUndefined(data) ? '0' : data.pAmount;
          // Expensesamount = Expensesamount.replace('(', '').replace(')', '');
          // TotalAmount = (parseFloat(Incomeamount) - parseFloat(Expensesamount)).toFixed(2);
          // //this._CommonService.currencyformat(balanceamount)
          // this.TotalAmount = TotalAmount < 0 ? '(' + this._CommonService.currencyformat(Math.abs(TotalAmount)) + ')' : this._CommonService.currencyformat(TotalAmount);
          // this.fontcolor = TotalAmount < 0 ? "text-danger" : "texkt-success";
          // //set currencyformat
          //this.gridData.reduce((acc, item, index) => {
          //   if (item.pAmount.includes('(')) {
          //     pamount = item.pAmount.replace('(', '').replace(')', '');
          //     pamount = '(' + this._CommonService.currencyformat(pamount) + ')';
          //     this.gridData[index].pAmount = pamount;
          //  }
          //   else {
          //     pamount = this.gridData[index].pAmount;
          //     this.gridData[index].pAmount = this._CommonService.currencyformat(pamount);
          //   }
          // }, 0);
        }
        else {
          this.TotalAmount = 0;
        }
      })
    }




  }
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Profit and Loss</title>
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
profitloassstyle{
left: 483px !important;
}
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
