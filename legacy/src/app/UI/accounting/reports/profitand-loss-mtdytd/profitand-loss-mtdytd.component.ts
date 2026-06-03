import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process, aggregateBy } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { DuesReportsService } from 'src/app/Services/Loans/Transactions/dues-reports.service';
import { ProfiandlossMtdytdReportService } from 'src/app/Services/Accounting/profiandloss-mtdytd-report.service';
import { MycurrencypipePipe } from 'src/app/Pipes/mycurrencypipe.pipe';
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  type: 'text' | 'numeric' | 'boolean' | 'date' | MycurrencypipePipe;
}
@Component({
  selector: 'app-profitand-loss-mtdytd',
  templateUrl: './profitand-loss-mtdytd.component.html',
  styles: []
})
export class ProfitandLossMTDYTDComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public startDate: any;
  public MTDAndYTDForm: FormGroup;
  public submitted = false;
  public savebutton: any;
  public isLoading = false;
  public loading = false;
  public duesData: any;
  public hdpLoantype = true;
  public gridColoumn = [];
  public MtdData: any = [];
  public YtdData: any = [];
  public hdnJvNo = true;
  public showData = false;


  public aggregates: any =[{ field: 'pApr', aggregate: 'sum' },{ field: 'pMay', aggregate: 'sum' },{ field: 'pJun', aggregate: 'sum' },{ field: 'pJul', aggregate: 'sum' },{ field: 'pAug', aggregate: 'sum' },{ field: 'pSep', aggregate: 'sum' },{ field: 'pOct', aggregate: 'sum' },{ field: 'pNov', aggregate: 'sum' },{ field: 'pDec', aggregate: 'sum' },{ field: 'pJan', aggregate: 'sum' },{ field: 'pFeb', aggregate: 'sum' },{ field: 'pMar', aggregate: 'sum' }];
  // = [{ field: 'pApr', aggregate: 'sum' },{ field: 'pMay', aggregate: 'sum' },{ field: 'pJun', aggregate: 'sum' },{ field: 'pJul', aggregate: 'sum' },{ field: 'pAug', aggregate: 'sum' },{ field: 'pSep', aggregate: 'sum' },{ field: 'pOct', aggregate: 'sum' },{ field: 'pNov', aggregate: 'sum' },{ field: 'pDec', aggregate: 'sum' },{ field: 'pJan', aggregate: 'sum' },{ field: 'pFeb', aggregate: 'sum' },{ field: 'pMar', aggregate: 'sum' }];
  public groups: GroupDescriptor[] = [{ field: "plevel1"}, { field: 'plevel2'}, { field: 'plevel3'}];
  public groupdetails: GroupDescriptor[] = [{ field: "plevel0" }, { field: "plevel1" }, { field: 'plevel2' }, { field: 'plevel3' }];
  public month: any;
  public lastDayofmonth: any;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private toastr: ToastrService, private _profitandlossmtdytdservice: ProfiandlossMtdytdReportService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }


  ngOnInit() {
    this.savebutton = 'Generate Report';
    this.submitted = false;
    this.startDate = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.MTDAndYTDForm = this.formbuilder.group({
      ReportType: ['', Validators.required],
      fromDate: [this.today, Validators.required]
    })

  }
  get f() { return this.MTDAndYTDForm.controls; }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  public GetMTDYTDReportData() {
    debugger;
    this.gridColoumn = [];
    this.MtdData = [];
    this.YtdData = [];
    this.submitted = true;
    this.showData = false;
    if (this.MTDAndYTDForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        this.MTDAndYTDForm.value;


        let ReportType = this.MTDAndYTDForm['controls']['ReportType'].value;
        let fromDate = this.MTDAndYTDForm['controls']['fromDate'].value;
        this.month = this.datePipe.transform(fromDate, "MMM-yyyy");
        let asonDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");

        this._profitandlossmtdytdservice.GetMtdYtdPandL(ReportType, asonDate).subscribe(json => {
          this.gridColoumn = json['plstmtdytdColumnslist'];
          this.MtdData = json['plstMtdytdpandl'];
          this.YtdData = json['plstMtdytdpandldetails'];
          //this.gridColoumn.forEach(x => this.aggregates.push({ field: x.field, aggregate: 'sum' }));
          
          this.showData = true;
          this.loading = false;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
        },
          (error) => {
            this.showErrorMessage(error);
            this.isLoading = false;
            this.savebutton = 'Generate Report';
            this.loading = false;
          });


      } catch (e) {
        this.showErrorMessage(e);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
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
          <title>Due Reports</title>
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


  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  public setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }


}
