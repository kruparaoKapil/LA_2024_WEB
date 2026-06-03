import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { PartMasterService } from 'src/app/Services/Loans/Masters/part-master.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-contact-list-party',
    templateUrl: './contact-list-party.component.html',
    styles: []
})
export class ContactListPartyComponent implements OnInit {
    @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
    AccountLedger: FormGroup;
    public startDatesReport: any;
    public PartyName: any;
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
    hideLedgerAndSubledger = false;
    public ContactRefID: any;
    public Contacttemprefid: any;
    public hdnTranDate = true;
    public isLoading: boolean = false;
    public savebutton: any = 'Generate Report';
    public showreport = false;
    constructor(private _Partyservice: PartMasterService, private _ReportService: ReportService, private _Accountservice: AccountingTransactionsService, private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, ) {
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
        debugger;
        this.startDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    }



    public loadData(ContactRefID,PartyName,PartyData) {

        let isValid = true;
        //this.isLoading = true;
        this.ContactRefID = ContactRefID;
        this.gridData = PartyData;
        this.gridData = this.gridData.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))

        this.gridView = this.gridData;
        this.PartyName = PartyName;
        //this.totaldebitamount = this.gridData.reduce((sum, c) => sum + c.pdebitamount, 0);
        //this.totalcreditamount = this.gridData.reduce((sum, c) => sum + c.pcreditamount, 0);
        //this.totalbalanceamount = this.gridData.reduce((sum, c) => sum + c.popeningbal, 0);
        //this.isLoading = false;
        this.savebutton = 'Generate Report';
    }



    public print() {
        let printContents, popupWin;
        printContents = document.getElementById('temp-box').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Party Ledger</title>
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

