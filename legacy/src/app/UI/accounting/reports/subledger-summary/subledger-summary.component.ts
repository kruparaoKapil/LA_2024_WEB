import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SubledgersummaryReportService } from 'src/app/Services/Accounting/subledgersummary-report.service';
import { MycurrencypipePipe } from 'src/app/Pipes/mycurrencypipe.pipe';
import { NegativevaluePipe } from 'src/app/Pipes/negativevalue.pipe';
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  type: 'text' | 'numeric' | 'boolean' | 'date' | MycurrencypipePipe;
}

@Component({
  selector: 'app-subledger-summary',
  templateUrl: './subledger-summary.component.html',
  styles: []
})

export class SubledgerSummaryComponent implements OnInit {


  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public defaultItem: { text: string, value: number } = { text: "Select", value: null };
  SubLedgerSummaryForm: FormGroup;
  MonthlyComparisonForm: FormGroup;
  public isLoading: boolean = false;
  public savebutton: any = 'Generate Report';
  public hdnTranDate = true;
  public submitted = false;
  public startDatesReport: any;;
  public endDatesReport: any;
  public MainAccountheadArray: any = [];
  public Accountheads: any = [];
  public gridData: ColumnSetting[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public LedgerName: any = [];
  public SubLedgerName: any = [];
  public partylist: any = [];
  public groups: GroupDescriptor[] = [];
  public today: Date = new Date();
  public LedgerValidationErrors: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig3: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public SubLedgerSummary = false;
  public MonthlyComparison = false;
  public MonthlystartDatesReport: any;

  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _sublugdersummaryservices: SubledgersummaryReportService, private negativevalue: NegativevaluePipe) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;


    this.dpConfig3.containerClass = 'theme-dark-blue';
    this.dpConfig3.dateInputFormat = 'MMM-YYYY';
    this.dpConfig3.maxDate = new Date();
    this.dpConfig3.showWeekNumbers = false;
  }

  ngOnInit() {
    this.Accountheads = [];
    this.gridData = [];
    this.gridView = [];
    this.endDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.startDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.GetformData();
    this.GetSubledgersummaryAccNames();
    this.Isseleted("Sub Ledger Summary");
  }


  public Isseleted(data) {
    debugger
    if (data == "Sub Ledger Summary") {
      this.submitted = false;
      this.LedgerName = '';
      this.Accountheads = [];
      this.gridData = [];
      this.gridView = [];
      this.isLoading = false;
      this.GetformData();

      this.SubLedgerSummary = true;
      this.MonthlyComparison = false;
    }
    if (data == "Monthly Comparison") {
      this.submitted = false;
      this.LedgerName = '';
      this.Accountheads = [];
      this.gridData = [];
      this.gridView = [];
      this.monthlyCompForm();
      let fromDate = this.MonthlyComparisonForm['controls']['fromDate'].value;
      this.MonthlystartDatesReport = this.datePipe.transform(fromDate, "MMM-yyyy");
      this.SubLedgerSummary = false;
      this.MonthlyComparison = true;
    }
  }
  public GetformData() {

    this.SubLedgerSummaryForm = this.formbuilder.group({
      MainAccounthead: [null, Validators.required],
      Accounthead: [null, Validators.required],
      fromDate: [this.today],
      toDate: [this.today],
    })
  }


  public monthlyCompForm() {

    this.MonthlyComparisonForm = this.formbuilder.group({
      MainAccounthead: [null, Validators.required],
      Accounthead: [null, Validators.required],
      fromDate: [this.today],
      toDate: [null],
    })
  }
  get f() { return this.SubLedgerSummaryForm.controls; }
  get g() { return this.MonthlyComparisonForm.controls; }


  public GetSubledgersummaryAccNames() {
    this._sublugdersummaryservices.GetSubLedgerAccountNames().subscribe(json => {
      if (json != null) {
        this.MainAccountheadArray = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  MainAccounthead_Change($event: any, formname): void {
    let paccountname;
    if ($event != undefined) {
      paccountname = $event.paccountname;
    }
    this.Accountheads = [];
    if (formname == "SubLedgerSummary") {
      this.SubLedgerSummaryForm['controls']['Accounthead'].setValue(null);
    }
    if (formname == "MonthlyComparison") {
      this.MonthlyComparisonForm['controls']['Accounthead'].setValue(null);
    }
    if (paccountname && paccountname != '') {
      this.LedgerName = $event.paccountname;
      const pAccountType = $event.pAccountType;
      this.GetAccHeadsData(pAccountType);
    }

  }

  GetAccHeadsData(pAccountType) {
    debugger
    this._sublugdersummaryservices.GetAccountHeadNames(pAccountType).subscribe(json => {
      if (json != null) {
        this.Accountheads = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  SubmitSubLedgerSummaryForm() {
    this.gridData = [];
    this.gridView = [];
    this.submitted = true;
    if (this.SubLedgerSummaryForm.valid) {
      this.isLoading = true;
      this.savebutton = 'Processing';
      let MainAccountheadId = this.SubLedgerSummaryForm['controls']['MainAccounthead'].value;
      let accountheadid = this.SubLedgerSummaryForm['controls']['Accounthead'].value;
      if (accountheadid == null) {
        accountheadid = 0;
      } else {
        accountheadid = accountheadid.join(',');
      }
      let fromDate = this.SubLedgerSummaryForm['controls']['fromDate'].value;
      let todate = this.SubLedgerSummaryForm['controls']['toDate'].value;
      fromDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
      todate = this.datePipe.transform(todate, "dd-MMM-yyyy");
      this.startDatesReport = fromDate;
      this.endDatesReport = todate;

      this._sublugdersummaryservices.GetSubLedgerSummaryReportData(MainAccountheadId, accountheadid, fromDate, todate).subscribe(json => {
        debugger
        if (json != null) {

          this.gridData = json['columnData'];
          this.gridView = json['gridData'];
          // for(let i=0; this.gridData.length>0;i++){
          // let field =   this.gridData[i]['field'];
          // this.gridView.reduce((acc, item, index) => {
          //   this.gridView[index].field = item.field < 0 ? '(' + this._CommonService.currencyformat(Math.abs(item.field)) + ')' : this._CommonService.currencyformat(item.field);

          // }, 0);
          // }

          this.gridView.reduce((acc, item, index) => {
            this.gridView[index].total = item.total < 0 ? '(' + this._CommonService.currencyformat(Math.abs(item.total)) + ')' : this._CommonService.currencyformat(item.total);

          }, 0);




          this.isLoading = false;
          this.savebutton = 'Generate Report';
        }

      },
        (error) => {
          this._CommonService.showErrorMessage(error);
        });
    }
  }





  SubmitMonthlyComForm() {
    debugger
    this.submitted = true;
    this.gridData = [];
    this.gridView = [];
    if (this.MonthlyComparisonForm.valid) {
      this.isLoading = true;
      this.savebutton = 'Processing';
      let MainAccountheadId = this.MonthlyComparisonForm['controls']['MainAccounthead'].value;
      let accountheadid = this.MonthlyComparisonForm['controls']['Accounthead'].value;
      if (accountheadid == null) {
        accountheadid = 0;
      } else {
        accountheadid = accountheadid.join(',');
      }
      let fromDate = this.MonthlyComparisonForm['controls']['fromDate'].value;
      fromDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
      this.MonthlystartDatesReport = this.datePipe.transform(fromDate, "MMM-yyyy");

      this.startDatesReport = fromDate;
      //this.endDatesReport = todate;
      this._sublugdersummaryservices.GetMonthlyComparisionReportData(MainAccountheadId, accountheadid, fromDate, fromDate).subscribe(json => {
        debugger
        if (json != null) {
          // this.gridData = this.tempArray[0]['columnData'];
          // this.gridView = this.tempArray[0]['gridData'];
          this.gridData = json['columnData'];
          this.gridView = json['gridData'];
          this.isLoading = false;
          this.savebutton = 'Generate Report';
        }

      },
        (error) => {
          this._CommonService.showErrorMessage(error);
        });
    }
  }

  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  public print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
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
          this.LedgerValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LedgerValidationErrors[key] += errormessage + ' ';
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
  public FromDateChange(event) {

    this.dpConfig1.minDate = event;
    this.SubLedgerSummaryForm.controls.toDate.setValue(this.today)
  }
}
