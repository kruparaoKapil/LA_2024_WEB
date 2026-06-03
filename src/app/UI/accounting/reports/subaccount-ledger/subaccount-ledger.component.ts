import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor,SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SubaccountledgerReportService } from 'src/app/Services/Accounting/subaccountledger-report.service';
@Component({
  selector: 'app-subaccount-ledger',
  templateUrl: './subaccount-ledger.component.html',
  styles: []
})
export class SubaccountLedgerComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  SubAccountLedger: FormGroup;
  public isLoading: boolean = false;
  public savebutton: any = 'Generate Report';
  public hdnTranDate = true;
  public startDatesReport: any;
  public endDatesReport: any;
  public ledgeraccountslist: any = [];
  public subledgeraccountslist: any = [];
  public gridData: any[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public LedgerName: any = [];
  public SubLedgerName: any = [];
  public partylist: any = [];
  public groups: GroupDescriptor[] = [ { field: 'pparentname' },{ field: 'ptransactiondate' }];
  public today: Date = new Date();
  public LedgerValidationErrors: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public totaldebitamount: any;
  public totalcreditamount: any;
  public totalbalanceamount: any;
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  constructor(private _ReportService: ReportService, private _Accountservice: AccountingTransactionsService, private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _SubaccoountLedgerServices:SubaccountledgerReportService) {
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
    debugger
    this.endDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.startDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.GetformData();
    this.getLoadData();
    this.BlurEventAllControll(this.SubAccountLedger)
  }
   public GetformData() {
    this.LedgerValidationErrors = {}
    this.SubAccountLedger = this.formbuilder.group({
      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null, Validators.required],
      pledgername: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  public getLoadData() {
    debugger
    this._SubaccoountLedgerServices.GetSubAccountLedger().subscribe(json => {
      debugger
      let JSONDATA = json
      if (json != null) {
        this.ledgeraccountslist = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  ledgerName_Change($event: any): void {
    debugger
    let paccountname;
    if ($event != undefined) {
      paccountname = $event.paccountname;
    }
    this.subledgeraccountslist = [];
    if (paccountname && paccountname != '') {
      const ledgername = $event.paccountname;
      this.GetSubLedgerData(ledgername);
      this.SubAccountLedger['controls']['pledgername'].setValue(ledgername);
    }
    else {
      this.SubAccountLedger['controls']['pledgername'].setValue('');
    }

  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  GetSubLedgerData(ledgername) {

    this._SubaccoountLedgerServices.GetAccountLedgerNames(ledgername).subscribe(json => {

      if (json != null) {
        this.subledgeraccountslist = json;
      }
      this.SubAccountLedger['controls']['psubledgername'].setValue('');
      this.SubAccountLedger['controls']['psubledgerid'].setValue(null);
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  AddEvent() {
    debugger
    let isValid = true;
    if (this.checkValidations(this.SubAccountLedger, isValid)) {
      this.isLoading = true;
      this.savebutton = 'Processing';
      let fromDate = this.datePipe.transform(this.SubAccountLedger['controls']['fromDate'].value, "dd-MMM-yyyy");
      let toDate = this.datePipe.transform(this.SubAccountLedger['controls']['toDate'].value, "dd-MMM-yyyy");
      this.startDatesReport = fromDate;
      this.endDatesReport = toDate
      let SubLedgerName = this.SubAccountLedger['controls']['pledgerid'].value;
      let parentid = this.SubAccountLedger['controls']['psubledgerid'].value;
      this.LedgerName = this.SubAccountLedger['controls']['pledgername'].value
      this.SubLedgerName = this.SubAccountLedger['controls']['psubledgername'].value
      if (parentid == '' || parentid == null) {
        parentid = 0
      }
      this._SubaccoountLedgerServices.GetSubAccountLedgerReportData(SubLedgerName, parentid,fromDate, toDate).subscribe(json => {
        debugger
        this.gridData = json;
        this.gridView = this.gridData;
      //  this.gridView = this.gridView.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))
        this.totaldebitamount = this.gridData.reduce((sum, c) => sum + c.pdebitamount, 0);
        this.totalcreditamount = this.gridData.reduce((sum, c) => sum + c.pcreditamount, 0);
        this.totalbalanceamount = this.gridData.reduce((sum, c) => sum + c.pclosingbal, 0);
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
    debugger
    let psubledgerid;
    if ($event != undefined) {
      psubledgerid = $event.pparentid;
    }
    if (psubledgerid && psubledgerid != '') {
      const pparentname = $event.pparentname;
      this.SubAccountLedger['controls']['psubledgername'].setValue(pparentname);
    }
    else {
      this.SubAccountLedger['controls']['psubledgername'].setValue('');
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
          <title>Sub Account Ledger</title>
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
    this.SubAccountLedger.controls.toDate.setValue(this.today)
  }

}
