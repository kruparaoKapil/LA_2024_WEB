import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor,process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';


@Component({
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styles: []
})

export class AccountLedgerComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  AccountLedger: FormGroup;
  public isLoading: boolean = false;
  public savebutton: any = 'Generate Report';
  public hdnTranDate = true;
  public startDatesReport: any;;
  public endDatesReport: any;
  public ledgeraccountslist: any = [];
  public subledgeraccountslist: any = [];
  public gridData: any[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public LedgerName: any = [];
  public SubLedgerName: any = [];
  public partylist: any = [];
  public groups: GroupDescriptor[] = [{ field: 'ptransactiondate' }];
  public today: Date = new Date();
  public LedgerValidationErrors: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public totaldebitamount: any;
  public totalcreditamount: any;
  public totalbalanceamount: any;

  creditamount:number=0;
  constructor(private _ReportService: ReportService, private _Accountservice: AccountingTransactionsService, private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
    this.allData = this.allData.bind(this);

  }

  ngOnInit() {

    this.endDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.startDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.GetformData();
    this.getLoadData();
    this.BlurEventAllControll(this.AccountLedger)
  }

  public GetformData() {
    this.LedgerValidationErrors = {}
    this.AccountLedger = this.formbuilder.group({
      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null, Validators.required],
      pledgername: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  public getLoadData() {

    this._ReportService.GetLedgerAccountList('ACCOUNT LEDGER').subscribe(json => {

      let JSONDATA = json
      if (json != null) 
      {
        this.ledgeraccountslist = json;
        console.log("list",this.ledgeraccountslist)
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  ledgerName_Change($event: any): void {

    let pledgerid;
    if ($event != undefined) {
      pledgerid = $event.pledgerid;
    }
    this.subledgeraccountslist = [];
    if (pledgerid && pledgerid != '') {
      const ledgername = $event.pledgername;
      this.GetSubLedgerData(pledgerid);
      this.AccountLedger['controls']['pledgername'].setValue(ledgername);
    }
    else {
      this.AccountLedger['controls']['pledgername'].setValue('');
    }

  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  GetSubLedgerData(pledgerid) {

    this._Accountservice.GetSubLedgerData(pledgerid).subscribe(json => {

      if (json != null) {
        this.subledgeraccountslist = json;
      }
      this.AccountLedger['controls']['psubledgername'].setValue('');
      this.AccountLedger['controls']['psubledgerid'].setValue(null);
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  AddEvent() {
debugger;
    let isValid = true;
    if (this.checkValidations(this.AccountLedger, isValid)) {
      this.isLoading = true;
      this.savebutton = 'Processing';
      let fromDate = this.datePipe.transform(this.AccountLedger['controls']['fromDate'].value, "dd-MMM-yyyy");
      let toDate = this.datePipe.transform(this.AccountLedger['controls']['toDate'].value, "dd-MMM-yyyy");
      this.startDatesReport = fromDate;
      this.endDatesReport = toDate
      let pAccountId = this.AccountLedger['controls']['pledgerid'].value;
      let pSubAccountId = this.AccountLedger['controls']['psubledgerid'].value;
      this.LedgerName = this.AccountLedger['controls']['pledgername'].value
      this.SubLedgerName = this.AccountLedger['controls']['psubledgername'].value
      if (pSubAccountId == '' || pSubAccountId == null) {
        pSubAccountId = 0
      }
      this._ReportService.GetLedgerReport(fromDate, toDate, pAccountId, pSubAccountId).subscribe(json => {

          this.gridData = json;
          console.log("account ledger",this.gridData)
          this.gridData = this.gridData.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))
          this.gridView = this.gridData;

         this.creditamount=Number(this.gridView[0].pcreditamount||0);
         this.totaldebitamount = this.gridData.reduce((sum, c) => sum + c.pdebitamount, 0).toFixed(2);
         this.totalcreditamount =Number( this.gridData.reduce((sum, c) => sum + c.pcreditamount, 0));
         this.totalbalanceamount = this.gridData.reduce((sum, c) => sum + c.popeningbal, 0).toFixed(2);
        let challanaValue = this.totalcreditamount - this.creditamount;
        console.log('this is acount led value:',challanaValue);
       this._Accountservice.setChallanaAmount(challanaValue);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        // this.GetformData();
      },
        (error) => {

          this.isLoading = false;
          this.savebutton = 'Generate Report';
        });
    }
    else {
      this.isLoading = false;
      this.savebutton = 'Generate Report';
    }
  }

  subledger_Change($event) {
    let psubledgerid;
    if ($event != undefined) {
      psubledgerid = $event.psubledgerid;
    }
    if (psubledgerid && psubledgerid != '') {
      const subledgername = $event.psubledgername;
      this.AccountLedger['controls']['psubledgername'].setValue(subledgername);
    }
    else {
      this.AccountLedger['controls']['psubledgername'].setValue('');
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
          <title>Account Ledger</title>
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


  //----------------VALIDATION----------------------- //
  checkValidations(group: FormGroup, isValid: boolean): boolean {
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
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
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

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                let errormessage;
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
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {
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
  setBlurEvent(fromgroup: FormGroup, key: string) {
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
  //----------------VALIDATION----------------------- //

  public ChequeDateChange(event) {

    this.dpConfig1.minDate = event;
    this.AccountLedger.controls.toDate.setValue(this.today)
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {
        group: this.groups,
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
      group: this.groups,
    };

    return result;
  }
}
