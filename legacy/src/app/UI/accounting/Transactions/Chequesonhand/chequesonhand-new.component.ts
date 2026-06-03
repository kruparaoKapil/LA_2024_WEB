import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { State, process, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { debug } from 'util';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
declare let $: any;
@Component({
    selector: 'app-chequesonhand-new',
    templateUrl: './chequesonhand-new.component.html',
    styles: []
})
export class ChequesonhandNewComponent implements OnInit {
    @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
    showhidegridcolumns = false;
    gridData: any = [];
    //  public gridView: DataResult;
    gridDatatemp = [];
    BanksList = [];
    ChequesOnHandData = [];
    ChequesClearReturnData = [];
    // transdatevalid:any;
    ChequesClearReturnDataBasedOnBrs: any = [];
    DataForSaving = [];
    buttonname = "Save";
    bankdetails: any;
    all = 0;
    chequesreceived = 0;
    onlinereceipts = 0;
    deposited = 0;
    cancelled = 0;
    brsdateshowhidedeposited = false;
    brsdateshowhidecancelled = false;
    validatebrsdatedeposit = false;
    validatebrsdatecancel = false;
    validate: any;
    banknameshowhide: any;
    bankname: any;
    bankbalance: any;
    // bankaccountnumber: any;
    brsdate: any;
    bankid: any;
    saveshowhide = true;
    status = "all";
    pdfstatus = "All";
    count = 0;
    // cancel = false;
    // bankselection = false;
    hiddendate = true;
    datetitle: any;
    chequenumber: any;
    bankbalancedetails: any;
    ChequesOnHandValidation: any = {};
    ChequesOnHandForm: FormGroup;
    BrsDateForm: FormGroup;
    depositchecked = false;
    cancelchecked = false;
    public disablesavebutton = false;
    public selectableSettings: SelectableSettings;
    public checkbox = false;
    PopupData: any;
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
    SelectBankData: any;
    ShowBankErrorMsg: Boolean = false;
    constructor(private fb: FormBuilder, private _accountingtransaction: AccountingTransactionsService, private toastr: ToastrService, private _commonService: CommonService, private datepipe: DatePipe) {
        this.setSelectableSettings();
        this.dpConfig.containerClass = 'theme-dark-blue';
        this.dpConfig.showWeekNumbers = false;
        this.dpConfig.maxDate = new Date();
        this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
        this.brsfromConfig.dateInputFormat = 'DD/MM/YYYY';
        this.brsfromConfig.maxDate = new Date();
        this.brstoConfig.dateInputFormat = 'DD/MM/YYYY';
        this.brstoConfig.maxDate = new Date();
        this.allData = this.allData.bind(this);
        this.brsfromConfig.containerClass = 'theme-dark-blue';
        this.brsfromConfig.showWeekNumbers = false;
        this.brstoConfig.containerClass = 'theme-dark-blue';
        this.brstoConfig.showWeekNumbers = false;
    }

    ngOnInit() {

        this.ChequesOnHandForm = this.fb.group({
            ptransactiondate: [new Date(), Validators.required],
            pfrombrsdate: [''],
            ptobrsdate: [''],
            pchequesOnHandlist: [],
            SearchClear: ['']
        })

        this.BrsDateForm = this.fb.group({
            frombrsdate: [''],
            tobrsdate: ['']
        })
        this.bankid = 0;
        this.banknameshowhide = false;
        this.GetBankBalance(this.bankid);
        this._accountingtransaction.GetBanksList().subscribe(bankslist => {

            this.BanksList = bankslist;
            //console.log(this.BanksList)
        })

        this.GetChequesOnHand(this.bankid);
        this.BlurEventAllControll(this.ChequesOnHandForm);
    }

    public setSelectableSettings(): void {
        this.selectableSettings = {
            checkboxOnly: this.checkbox,
            //mode: this.mode
            mode: "multiple"
        };
    }
    GetBankBalance(bankid) {
        this._accountingtransaction.GetBankBalance(bankid).subscribe(bankdetails => {

            this.bankbalancedetails = bankdetails;
            if (this.bankid == 0) {
                if (this.bankbalancedetails._BankBalance < 0) {
                    let bal = Math.abs(this.bankbalancedetails._BankBalance)
                    this.bankbalance = ' ' + this._commonService.currencyformat(bal) + ' ' + " Cr";
                }
                else if (this.bankbalancedetails._BankBalance == 0) {
                    this.bankbalance = ' ' + 0;
                }
                else {
                    this.bankbalance = ' ' + this._commonService.currencyformat(this.bankbalancedetails._BankBalance) + ' ' + " Dr";
                }

            }

            this.brsdate = this.datepipe.transform(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate), 'dd/MM/yyyy')
            this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
            this.ChequesOnHandForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
            this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
            this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
        })
    }
    // public groupChange(groups: GroupDescriptor[]): void {
    //     this.groups = groups;
    //     this.loadgrid();
    // }
    // private loadgrid(): void {
    //     this.gridView = process(this.gridData, { group: this.groups });
    // }
    GetChequesOnHand(bankid) {


        this._accountingtransaction.GetChequesOnHandData(bankid).subscribe(data => {

            if (bankid == 0) {
                this.ChequesOnHandData = data.pchequesOnHandlist;
                this.ChequesClearReturnData = data.pchequesclearreturnlist;
                this.CountOfRecords();
            }
            if (bankid != 0) {
                this.ChequesClearReturnData = data.pchequesclearreturnlist;
                //  this.CountOfRecords();
                this.deposited = 0;
                this.cancelled = 0;
                for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                    if (this.ChequesClearReturnData[i].pchequestatus == "C") {
                        this.cancelled = this.cancelled + 1;
                    }
                }
                for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                    if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                        this.deposited = this.deposited + 1;
                    }
                }
            }
            if (this.status == "all") {
                this.All();
            }
            if (this.status == "chequesreceived") {
                this.ChequesReceived();
            }
            if (this.status == "onlinereceipts") {
                this.OnlineReceipts();
            }
            if (this.status == "deposited") {
                this.Deposited();
            }
            if (this.status == "cancelled") {
                this.Cancelled();
            }
        }, error => { this._commonService.showErrorMessage(error) })
    }

    SelectBank(event) {
        debugger
        this.ShowBankErrorMsg = false;
        document.getElementById('bankselection').style.border = "";
        if (event.target.value == "") {
            this.bankid = 0;
            this.bankname = "";
            this.banknameshowhide = false;
        }
        else {
            this.SelectBankData = event.target.value;
            this.banknameshowhide = true;
            for (let i = 0; i < this.BanksList.length; i++) {
                if (event.target.value == this.BanksList[i].pdepositbankname) {
                    this.bankdetails = this.BanksList[i];
                    break;
                }
            }
            this.bankid = this.bankdetails.pbankid;
            this.bankname = this.bankdetails.pdepositbankname;

            // this.bankselection = true;
            // this.bankaccountnumber = this.bankdetails.pbankaccountnumber;

            // if(this.bankdetails.ptobrsdate!=null){
            //     this.brsdate = this.datepipe.transform(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate), 'dd/MM/yyyy');
            //     this.ChequesOnHandForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
            //     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
            // }
            // else{
            //     this.brsdate="";
            // }
            // if(this.bankdetails.pfrombrsdate!=null){
            //     this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
            //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
            // }


            if (this.bankdetails.pbankbalance < 0) {
                let bal = Math.abs(this.bankdetails.pbankbalance);
                this.bankbalance = ' ' + this._commonService.currencyformat(bal) + ' ' + "Cr";
            }
            else if (this.bankdetails.pbankbalance == 0) {
                this.bankbalance = ' ' + 0;
            }
            else {
                this.bankbalance = ' ' + this._commonService.currencyformat(this.bankdetails.pbankbalance) + ' ' + "Dr";
            }
        }
        this.GetChequesOnHand(this.bankid);
        this.GetBankBalance(this.bankid);
        this.ChequesOnHandForm.controls.SearchClear.setValue('');
    }

    checkedDeposit(event, data) {
        debugger;
        if (event.target.checked == true) {
            //this.ShowDateErrMssg=false;
            let transdate = this.datepipe.transform(this.ChequesOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            let chequedate = this._commonService.formatDateFromDDMMYYYY(data.pchequedate);
            let receiptdate = this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
            let transactiondate = this._commonService.formatDateFromDDMMYYYY(transdate);
            let todaydate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
            let today = this._commonService.formatDateFromDDMMYYYY(todaydate)
            if (today >= chequedate) {
                if (transactiondate >= receiptdate) {
                    data.pdepositstatus = true;
                    data.pcancelstatus = false;
                    data.pchequestatus = "P";
                }
                else {
                    data.pdepositstatus = false;
                    data.pcancelstatus = false;
                    data.pchequestatus = "N";
                    $('#' + event.target.id + '').prop("checked", false);
                    this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
                }
            }
            else {
                data.pdepositstatus = false;
                data.pcancelstatus = false;
                data.pchequestatus = "N";
                $('#' + event.target.id + '').prop("checked", false);
                this._commonService.showWarningMessage("Post Dated Cheques Are Not Allowed");

            }
        }
        else {
            data.pdepositstatus = false;
            data.pchequestatus = "N";
        }
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == data.preceiptid) {
                this.gridData[i] = data;
                //console.log(this.gridData[i])
                break;

            }
        }

    }

    checkedCancel(event, data) {

        this.PopupData = data;
        if (event.target.checked == true) {
            let transdate = this.datepipe.transform(this.ChequesOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            let receiptdate = this._commonService.formatDateFromDDMMYYYY(data.preceiptdate);
            let transactiondate = this._commonService.formatDateFromDDMMYYYY(transdate)
            if (transactiondate >= receiptdate) {
                data.pcancelstatus = true;
                data.pdepositstatus = false;
                data.pchequestatus = "C";
                $("#cancelcharges").val(data.pcancelcharges);
                this.chequenumber = data.pChequenumber;
                $('#add-detail').modal('show');
            }
            else {
                data.pdepositstatus = false;
                data.pcancelstatus = false;
                data.pchequestatus = "N";

                $('#' + data.preceiptid + '').prop("checked", false);
                this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
            }
        }
        else {
            data.pcancelstatus = false;
            data.pchequestatus = "N";
        }
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == data.preceiptid) {
                this.gridData[i] = data;
                break;
            }
        }
    }

    CancelChargesOk(value) {

        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
                this.gridData[i].pactualcancelcharges = value;
            }
        }
    }

    GridColumnsShow() {
        this.showhidegridcolumns = false;
        this.saveshowhide = true;
        this.brsdateshowhidedeposited = false;
        this.brsdateshowhidecancelled = false;
        this.hiddendate = true;
    }

    GridColumnsHide() {
        // this.deposited = 0;
        // this.cancelled = 0;
        this.showhidegridcolumns = true;
        this.saveshowhide = false;
        this.hiddendate = false;
        //this.CountOfRecords();
    }

    CountOfRecords() {

        this.all = 0;
        this.chequesreceived = 0;
        this.onlinereceipts = 0;
        this.cancelled = 0;
        this.deposited = 0;
        this.all = this.ChequesOnHandData.length;
        for (let j = 0; j < this.ChequesOnHandData.length; j++) {
            if (this.ChequesOnHandData[j].ptypeofpayment != "CHEQUE") {
                this.onlinereceipts = this.onlinereceipts + 1;
            }
        }
        for (let i = 0; i < this.ChequesOnHandData.length; i++) {
            if (this.ChequesOnHandData[i].ptypeofpayment == "CHEQUE") {
                this.chequesreceived = this.chequesreceived + 1;
            }
        }
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            if (this.ChequesClearReturnData[i].pchequestatus == "C") {
                this.cancelled = this.cancelled + 1;
            }
        }
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                this.deposited = this.deposited + 1;
            }
        }
    }

    All() {

        this.gridData = [];
        this.gridDatatemp = [];
        this.GridColumnsShow();
        this.status = "all";
        this.pdfstatus = "All"
        this.gridData = this.ChequesOnHandData;
        this.gridDatatemp = this.ChequesOnHandData;
        //   this.gridView=this.gridData
    }

    ChequesReceived() {

        this.gridData = [];
        this.gridDatatemp = [];
        this.GridColumnsShow();
        this.status = "chequesreceived";
        this.pdfstatus = "Cheques Received";
        for (let i = 0; i < this.ChequesOnHandData.length; i++) {
            if (this.ChequesOnHandData[i].ptypeofpayment == "CHEQUE") {
                this.gridData.push(this.ChequesOnHandData[i]);
                this.gridDatatemp.push(this.ChequesOnHandData[i])
            }
        }
    }

    OnlineReceipts() {

        this.gridData = [];
        this.gridDatatemp = [];
        this.GridColumnsShow();
        this.status = "onlinereceipts";
        this.pdfstatus = "Online Receipts";
        for (let j = 0; j < this.ChequesOnHandData.length; j++) {
            if (this.ChequesOnHandData[j].ptypeofpayment != "CHEQUE") {
                this.gridData.push(this.ChequesOnHandData[j]);
                this.gridDatatemp.push(this.ChequesOnHandData[j])
            }
        }
    }

    Deposited() {

        this.status = "deposited";
        this.pdfstatus = "Deposited";
        this.datetitle = "Deposited Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // if (this.bankselection == true) {
        //     this.GetChequesOnHand(this.bankid);
        //     this.bankselection = false;
        // }
        this.deposited = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = true;
        this.brsdateshowhidecancelled = false;
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                this.gridData.push(this.ChequesClearReturnData[i]);
                this.gridDatatemp.push(this.ChequesClearReturnData[i]);
                this.deposited = this.deposited + 1;
            }
        }
    }

    Cancelled() {

        this.status = "cancelled";
        this.pdfstatus = "Cancelled"
        this.datetitle = "Cancelled Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // if (this.cancel == true) {
        //     let id = 0;
        //     this.GetChequesOnHand(id);
        //     this.bankselection = true;
        // }
        this.cancelled = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = false;
        this.brsdateshowhidecancelled = true;
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            if (this.ChequesClearReturnData[i].pchequestatus == "C") {
                this.gridData.push(this.ChequesClearReturnData[i]);
                this.gridDatatemp.push(this.ChequesClearReturnData[i]);
                this.cancelled = this.cancelled + 1;
            }
        }
    }

    Save() {

        this.count = 0;
        this.DataForSaving = [];
        let isValid = true;
        debugger;
        if (this.checkValidations(this.ChequesOnHandForm, isValid)) {


            if (this.SelectBankData == "" || this.SelectBankData == undefined) {
                this.ShowBankErrorMsg = true;
                document.getElementById('bankselection').style.border = "1px solid red";
                return
            }
            if (this.gridData.length == 0) {
                if (this.SelectBankData == "" || this.SelectBankData == undefined) {
                    this.ShowBankErrorMsg = true;
                    document.getElementById('bankselection').style.border = "1px solid red";
                    return
                }
            }
            for (let i = 0; i < this.gridData.length; i++) {
                if (this.gridData[i].pchequestatus == "P") {
                    this.count++;
                    if (this.SelectBankData != "" && this.SelectBankData != undefined) {
                        this.gridData[i].pdepositbankid = this.bankdetails.pdepositbankid;
                        this.gridData[i].pdepositbankname = this.bankdetails.pdepositbankname;
                        this.DataForSaving.push(JSON.parse(JSON.stringify(this.gridData[i])));
                    }
                    else {
                        this.ShowBankErrorMsg = true;
                        document.getElementById('bankselection').style.border = "1px solid red";
                        this.disablesavebutton = false;
                        this.buttonname = 'Save';
                    }
                }
                if (this.gridData[i].pchequestatus == "C") {
                    this.count++;
                    this.DataForSaving.push(JSON.parse(JSON.stringify(this.gridData[i])));
                }
            }

            if (this.DataForSaving.length != 0) {
                for (let i = 0; i < this.DataForSaving.length; i++) {
                    if (this.DataForSaving[i].pchequedate != null) {
                        this.DataForSaving[i].pchequedate = this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].pchequedate);
                    }
                    this.DataForSaving[i].pCreatedby = this._commonService.pCreatedby;
                    this.DataForSaving[i].preceiptdate = this._commonService.formatDateFromDDMMYYYY(this.DataForSaving[i].preceiptdate);
                }
            }
            if (this.DataForSaving.length == this.count && this.DataForSaving.length != 0) {

                this.ChequesOnHandForm.controls.pchequesOnHandlist.setValue(this.DataForSaving);
                this.disablesavebutton = true;
                this.buttonname = 'Processing';
                let form = JSON.stringify(this.ChequesOnHandForm.value);
                this._accountingtransaction.SaveChequesOnHand(form).subscribe(data => {

                    if (data) {
                        this._commonService.showInfoMessage("Saved Successfully");
                        this.Clear();
                    }
                    this.disablesavebutton = false;
                    this.buttonname = "Save";
                }, error => {
                    this._commonService.showErrorMessage(error);
                    this.disablesavebutton = false;
                    this.buttonname = "Save";
                    this.Clear()
                });
            }
            else {
                this._commonService.showWarningMessage("Please Select any One Check Box in Grid");
                this.disablesavebutton = false;
                this.buttonname = "Save";
                return;
            }
        }
        else {
            this.disablesavebutton = false;
            this.buttonname = "Save";
        }
    }

    Clear() {

        this.ChequesOnHandForm.reset();
        this.ngOnInit();
        this.count = 0;
        this.DataForSaving = [];
        $("#bankselection").val("");
        this.ShowBankErrorMsg = false;
        this.SelectBankData = "";
        document.getElementById('bankselection').style.border = "";
        this.ChequesOnHandValidation = {};
    }

    ShowBrsDeposit() {
        this.gridData = [];
        this.deposited = 0;

        let fromdate = this.ChequesOnHandForm.controls['pfrombrsdate'].value;
        let todate = this.ChequesOnHandForm.controls['ptobrsdate'].value;
        this.OnBrsDateChanges(fromdate, todate);
        if (this.validate == false) {
            fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
            todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
            this.validatebrsdatedeposit = false;
            this.GetDataOnBrsDates(fromdate, todate, this.bankid);
            if (this.bankid == 0) {
                this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
                this.ChequesOnHandForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
            }
            else {
                this.ChequesOnHandForm.controls.ptobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
                this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
            }

        }
        else {
            this.validatebrsdatedeposit = true;
        }
    }

    ShowBrsCancel() {
        this.gridData = [];
        this.cancelled = 0;
        let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
        let todate = this.BrsDateForm.controls['tobrsdate'].value;
        this.OnBrsDateChanges(fromdate, todate);
        if (this.validate == false) {
            fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
            todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
            this.validatebrsdatecancel = false;
            this.GetDataOnBrsDates(fromdate, todate, this.bankid);
            if (this.bankid == 0) {
                this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.pfrombrsdate));
                this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankbalancedetails.ptobrsdate));
            }
            else {
                this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.pfrombrsdate));
                this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.formatDateFromDDMMYYYY(this.bankdetails.ptobrsdate));
            }

        }
        else {
            this.validatebrsdatecancel = true;
        }
    }

    GetDataOnBrsDates(frombrsdate, tobrsdate, bankid) {


        this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid).subscribe(
            clearreturndata => {

                let kk = [];
                this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
                for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
                    if (this.status == "deposited" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "P") {
                        kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                        this.deposited = this.deposited + 1;
                    }
                    if (this.status == "cancelled" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "C") {
                        kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                        this.cancelled = this.cancelled + 1;
                    }
                }
                this.gridData = kk;
            }, error => { this._commonService.showErrorMessage(error) })
    }

    OnBrsDateChanges(fromdate, todate) {

        if (fromdate > todate) {
            this.validate = true;
        }
        else {
            this.validate = false;
        }
    }

    DateChange(event) {

        this.GetChequesOnHand(this.bankid);
    }
    SearchRecord(inputValue: string) {

        this.gridData = process(this.gridDatatemp, {
            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'preceiptid',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'preceiptdate',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pdepositcleardate',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pChequenumber',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'ptypeofpayment',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'ppartyname',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'ptotalreceivedamount',
                        operator: 'contains',
                        value: inputValue
                    }
                ],
            }
        }).data;
        this.dataBinding.skip = 0;
    }
    // showInfoMessage(errormsg: string) {
    //     this.toastr.success(errormsg);
    // }
    // showErrorMessage(errormsg: string) {
    //   this.toastr.error(errormsg);
    // }
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
                    this.ChequesOnHandValidation[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.ChequesOnHandValidation[key] += errormessage + ' ';
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
        this._commonService.showErrorMessage(errormsg);
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
    public group: any[] = [{
        field: 'preceiptdate'
    }, {
        field: 'pChequenumber', dir: 'desc'
    }
    ];
    public allData(): ExcelExportData {
        const result: ExcelExportData = {
            data: process(this.gridData, { group: this.group, sort: [{ field: 'preceiptdate', dir: 'desc' }, { field: 'pChequenumber', dir: 'desc' }] }).data,
            group: this.group
        };

        return result;
    }
}
