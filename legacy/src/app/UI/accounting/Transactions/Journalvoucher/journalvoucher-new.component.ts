import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { State, DataResult } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { debug } from 'util';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';

@Component({
    selector: 'app-journalvoucher-new',
    templateUrl: './journalvoucher-new.component.html',
    styles: []
})
export class JournalvoucherNewComponent implements OnInit {
    showModeofPayment = false;
    showTypeofPayment = false;
    showtranstype = false;
    showbankcard = true;
    showbranch = true;
    showfinancial = true;
    showupi = false;
    showchequno = true;
    showgst = true;
    showtds = true;
    showgstandtds = false;
    imageResponse: any;
    readonlydebit = false;
    readonlycredit = false;
    showgstamount = false;
    showigst = false;
    showcgst = false;
    showsgst = false;
    showutgst = false;
    showgstno = false;
    showsubledger = true;
    formValidationMessages: any;
    paymentlistcolumnwiselist: any;
    displayCardName = 'Debit Card';
    displaychequeno = 'Cheque No';

    banklist: any;
    modeoftransactionslist: any;
    typeofpaymentlist: any;
    ledgeraccountslist: any;
    subledgeraccountslist: any;
    partylist: any;
    gstlist: any;
    tdslist: any;
    tdssectionlist: any;
    tdspercentagelist: any;
    debitcardlist: any;
    statelist: any;
    chequenumberslist: any;
    upinameslist: any;
    upiidlist: any;
    paymentslist: any;

    cashBalance: any; 
    ledgerName: any;
    subledgerName: any;
    bankBalance: any;userName: any;
    userDetails: any;
    userNameF: any;
    userIdF: any;
;
    bankbookBalance: any;;
    bankpassbookBalance: any;;
    ledgerBalance: any;;
    subledgerBalance: any;;
    partyBalance: any;;
    partyjournalentrylist: any;
    amounttype: any;
    disablegst: boolean;
    disabletds = false;
    disablesavebutton = false;
    savebutton = "Save";
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    disabletransactiondate = false;
    isDisabled: boolean = false;
    public selectableSettings: SelectableSettings;
    public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    constructor(private _FormBuilder: FormBuilder, private datepipe: DatePipe, private zone: NgZone, private _commonService: CommonService, private _routes: Router, private _AccountingTransactionsService: AccountingTransactionsService) {
        this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
        this.ppaymentdateConfig.showWeekNumbers = false;
        this.ppaymentdateConfig.maxDate = new Date();
        this.ppaymentdateConfig.dateInputFormat = 'DD-MM-YYYY';
    }
    paymentVoucherForm: FormGroup;
    public gridView: DataResult;

    ngOnInit() {
debugger
        if (this._commonService.comapnydetails != null)
            this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
        this.paymentlistcolumnwiselist = {};
        this.paymentslist = [];
        this.formValidationMessages = {};

        this.userDetails = JSON.parse(sessionStorage.getItem("Urc"));
        this.userNameF = this.userDetails.pUserName;
        this.userIdF = this.userDetails.pUserID;

        this.paymentVoucherForm = this._FormBuilder.group({
            ppaymentid: [''],
            pjvdate: ['', Validators.required],
            ptotalpaidamount: [''],
            pnarration: ['', Validators.required],
            pmodofpayment: ['CASH'],
            pbankname: [''],
            pbranchname: [''],
            ptranstype: [''],
            pCardNumber: [''],
            pUpiname: [''],
            pUpiid: [''],

            ptypeofpayment: [''],
            pChequenumber: [''],
            pchequedate: [''],
            pbankid: [''],

            pCreatedby: [this._commonService.pCreatedby],
            pStatusname: [this._commonService.pStatusname],
            ptypeofoperation: [this._commonService.ptypeofoperation],

            ppaymentsslistcontrols: this.addppaymentsslistcontrols(),
            pFilename: [''],
            pFilepath: [''],
            pFileformat: [''],

            pDocStorePath: ['']
        })




        this.isgstapplicableChange();
        this.istdsapplicableChange();
        let date = new Date();
        this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
        this.getLoadData();
        this.BlurEventAllControll(this.paymentVoucherForm);   
    }
    addppaymentsslistcontrols(): FormGroup {
        return this._FormBuilder.group({
            psubledgerid: [null],
            psubledgername: [''],
            pledgerid: [null],
            pledgername: ['', Validators.required],
            pamount: ['', Validators.required],
            pactualpaidamount: [0],
            pgsttype: [''],
            pisgstapplicable: [false, Validators.required],
            pgstcalculationtype: [''],
            pgstpercentage: [''],
            pgstamount: [''],
            pigstamount: [''],
            pcgstamount: [''],
            psgstamount: [''],
            putgstamount: [''],
            ppartyname: [''],
            ppartyid: [''],
            ppartyreftype: [''],
            ppartyreferenceid: [''],
            ppartypannumber: [''],
            pistdsapplicable: [false, Validators.required],
            pgstno: [''],
            pTdsSection: [''],
            pTdsPercentage: [''],
            ptdsamount: [''],
            ptdscalculationtype: [''],
            ppannumber: [''],
            pState: [''],
            pStateId: [''],
            pdebitamount: ['', Validators.required],
            pcreditamount: ['', Validators.required],
            pigstpercentage: [''],
            pcgstpercentage: [''],
            psgstpercentage: [''],
            putgstpercentage: [''],
            ptotalcreditamount: [''],
            ptotaldebitamount: [''],
            ptranstype: [''],
            ptypeofoperation: [this._commonService.ptypeofoperation],
            ptotalamount: [''],
        })
    }

    BlurEventAllControll(fromgroup: FormGroup) {

        try {

            Object.keys(fromgroup.controls).forEach((key: string) => {
                this.setBlurEvent(fromgroup, key);
            })

        }
        catch (e) {
            this._commonService.showErrorMessage(e);
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
            this._commonService.showErrorMessage(e);
            return false;
        }



    }

    checkValidations(group: FormGroup, isValid: boolean): boolean {
        debugger
        try {

            Object.keys(group.controls).forEach((key: string) => {

                isValid = this.GetValidationByControl(group, key, isValid);
            })

        }
        catch (e) {
            //this.showErrorMessage(e);
            return false;
        }
        return isValid;
    }
    GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

        try {
            let formcontrol;

            formcontrol = formGroup.get(key);
            if (!formcontrol)
                formcontrol = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'].get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    if (key != 'ppaymentsslistcontrols')
                        this.checkValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.formValidationMessages[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;

                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;

                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.formValidationMessages[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }

                    }
                }
            }
        }
        catch (e) {
            //this._commonService.showErrorMessage(key);
            return false;
        }
        return isValid;
    }

    setBalances(balancetype, balanceamount) {
        debugger
        let balancedetails;
        if (parseFloat(balanceamount) < 0) {
            balancedetails = this._commonService.currencyformat(Math.abs(balanceamount)) + ' Cr';
        }
        else if (parseFloat(balanceamount) >= 0) {
            balancedetails = this._commonService.currencyformat(balanceamount) + ' Dr';
        }

        if (balancetype == 'CASH')
            this.cashBalance = balancedetails;
        if (balancetype == 'BANK')
            this.bankBalance = balancedetails;
        if (balancetype == 'BANKBOOK')
            this.bankbookBalance = balancedetails;
        if (balancetype == 'PASSBOOK')
            this.bankpassbookBalance = balancedetails;
        if (balancetype == 'LEDGER')
            this.ledgerBalance = balancedetails;
        if (balancetype == 'SUBLEDGER')
            this.subledgerBalance = balancedetails;
        if (balancetype == 'PARTY')
            this.partyBalance = balancedetails;
    }


    addModeofpaymentValidations() {

        let modeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['pmodofpayment'];
        let transtypeControl = <FormGroup>this.paymentVoucherForm['controls']['ptranstype'];
        let bankControl = <FormGroup>this.paymentVoucherForm['controls']['pbankname'];
        let chequeControl = <FormGroup>this.paymentVoucherForm['controls']['pChequenumber'];
        let cardControl = <FormGroup>this.paymentVoucherForm['controls']['pCardNumber'];
        let typeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['ptypeofpayment'];
        let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

        let UpinameControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiname'];
        let UpiidControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiid'];

        if (this.showModeofPayment == true) {
            modeofpaymentControl.setValidators(Validators.required);
            bankControl.setValidators(Validators.required);
            chequeControl.setValidators(Validators.required);
            if (this.showtranstype) {
                transtypeControl.setValidators(Validators.required);
            }
            else {
                transtypeControl.clearValidators();
            }
            if (this.showbankcard) {
                //bankControl.setValidators(Validators.required);
                cardControl.clearValidators();
            }
            else {
                cardControl.setValidators(Validators.required);
                //bankControl.clearValidators();
            }
            if (this.showTypeofPayment) {
                typeofpaymentControl.setValidators(Validators.required);
            }
            else {
                typeofpaymentControl.clearValidators();
            }
            if (this.showbranch) {
                branchnameControl.setValidators(Validators.required);
            }
            else {
                branchnameControl.clearValidators();
            }
            //if (this.showfinancial) {
            //  bankControl.setValidators(Validators.required);
            //}
            //else {

            //  if (this.showbankcard) {
            //    bankControl.setValidators(Validators.required);         
            //  }
            //  else {          
            //    bankControl.clearValidators();
            //  }
            //}

            /////

            if (this.showupi) {
                UpinameControl.setValidators(Validators.required);
                UpiidControl.setValidators(Validators.required);
            }
            else {
                UpinameControl.clearValidators();
                UpiidControl.clearValidators();
            }
        }
        else {
            modeofpaymentControl.clearValidators();
            bankControl.clearValidators();
            chequeControl.clearValidators();
        }


        modeofpaymentControl.updateValueAndValidity();
        transtypeControl.updateValueAndValidity();
        cardControl.updateValueAndValidity();
        bankControl.updateValueAndValidity();
        chequeControl.updateValueAndValidity();
        typeofpaymentControl.updateValueAndValidity();
        branchnameControl.updateValueAndValidity();

        UpinameControl.updateValueAndValidity();
        UpiidControl.updateValueAndValidity();
    }
    transofPaymentChange() {

        this.displayCardName = 'Debit Card';
        this.showTypeofPayment = false;
        this.showbranch = false;
        this.showfinancial = false;
        this.showchequno = false;
        this.showbankcard = true;
        this.displaychequeno = 'Reference No';
        if (this.paymentVoucherForm.controls.ptranstype.value == "CHEQUE") {
            this.showbankcard = true;
            this.displaychequeno = 'Cheque No';
            this.showbranch = true;
            this.showchequno = true;
        }
        else if (this.paymentVoucherForm.controls.ptranstype.value == "ONLINE") {
            this.showbankcard = true;
            this.showTypeofPayment = true;
            this.showfinancial = false;
        }
        else if (this.paymentVoucherForm.controls.ptranstype.value == "DEBIT CARD") {
            this.showbankcard = false;
            this.showfinancial = true;
        }
        else {
            this.displayCardName = 'Credit Card';
            this.showbankcard = false;
            this.showfinancial = true;
        }
        this.addModeofpaymentValidations();
        //  this.cleartranstypeDetails();
    }
    typeofPaymentChange() {

        if (this.paymentVoucherForm.controls.ptypeofpayment.value == 'UPI') {
            this.showupi = true;
        }
        else {
            this.showupi = false;
        }

        this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment', true);
    }
    isgstapplicable_Checked(event) {
        let checked = event.target.checked;
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(checked);
        this.isgstapplicableChange();
    }
    istdsapplicable_Checked(event) {
        let checked = event.target.checked;
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(checked);

        this.istdsapplicableChange();
    }
    isgstapplicableChange() {


        let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;

        let gstCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'];
        let gstpercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'];
        let stateControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'];
        let gstamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'];
        //let gstno = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

        if (data) {
            this.showgst = true;
            if (this.disablegst == false)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('INCLUDE')
            gstCalculationControl.setValidators(Validators.required);
            gstpercentageControl.setValidators(Validators.required);
            stateControl.setValidators(Validators.required);
            gstamountControl.setValidators(Validators.required);
        }
        else {
            gstCalculationControl.clearValidators();
            gstpercentageControl.clearValidators();
            stateControl.clearValidators();
            gstamountControl.clearValidators();
            //gstno.clearValidators();


            this.showgst = false;
            if (this.disablegst == false)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('');
        }
        gstCalculationControl.updateValueAndValidity();
        gstpercentageControl.updateValueAndValidity();
        stateControl.updateValueAndValidity();
        gstamountControl.updateValueAndValidity();
        //gstno.updateValueAndValidity();
        this.claculategsttdsamounts();
    }
    istdsapplicableChange() {


        let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;

        let tdsCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'];
        let tdspercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'];
        let sectionControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'];
        let tdsamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdsamount'];

        if (data) {
            this.showtds = true;
            if (this.disabletds == false)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('INCLUDE');
            tdsCalculationControl.setValidators(Validators.required);
            tdspercentageControl.setValidators(Validators.required);
            sectionControl.setValidators(Validators.required);
            tdsamountControl.setValidators(Validators.required);
        }
        else {
            this.showtds = false;
            if (this.disabletds == false)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('')
            tdsCalculationControl.clearValidators();
            tdspercentageControl.clearValidators();
            sectionControl.clearValidators();
            tdsamountControl.clearValidators();
        }

        tdsCalculationControl.updateValueAndValidity();
        tdspercentageControl.updateValueAndValidity();
        sectionControl.updateValueAndValidity();
        tdsamountControl.updateValueAndValidity();

        this.claculategsttdsamounts();

    }

    getLoadData() {
debugger
        this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('JOURNAL VOUCHER').subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.banklist = json.banklist;
                this.modeoftransactionslist = json.modeofTransactionslist;
                this.typeofpaymentlist = this.gettypeofpaymentdata();
                this.ledgeraccountslist = json.accountslist;
                if(this.userNameF != 'admin@kapilit.com'){
                this._AccountingTransactionsService.setFilterAccountHeads(this.ledgeraccountslist);
                this.ledgeraccountslist = this._AccountingTransactionsService.getLedgerAccountsList();
                this.ledgeraccountslist = this.ledgeraccountslist.filter(item => {
                    if (!item.pledgername) return true;
                    let name = item.pledgername.toLowerCase();
                    return !(
                        name.includes('sa transfer') ||
                        name.includes('rsd-transfer')
                    );
                });
                // this.ledgeraccountslist =  this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' &&  item.pledgername !== 'TDS-194H PAYABLE' && item.pledgername !== 'TDS-194J PAYABLE' && item.pledgername !== 'HS-SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE-HRB' && item.pledgername !== 'OS-SALE ADVANCE' );
                }
                // 
                this.partylist = json.partylist;
                this.gstlist = json.gstlist;

                this.debitcardlist = json.bankdebitcardslist;

                this.setBalances('CASH', json.cashbalance);
                this.setBalances('BANK', json.bankbalance);
                //this.lstLoanTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this._commonService.showErrorMessage(error);
            });
    }

    gettypeofpaymentdata(): any {

        let data = this.modeoftransactionslist.filter(function (payment) {
            return payment.ptranstype == payment.ptypeofpayment;
        });
        return data;
    }
    trackByFn(index, item) {
        return index; // or item.id
    }
    bankName_Change($event: any): void {

        const pbankid = $event.target.value;
        this.upinameslist = [];
        this.chequenumberslist = [];
        this.paymentVoucherForm['controls']['pUpiname'].setValue('');
        this.paymentVoucherForm['controls']['pUpiid'].setValue('');
        if (pbankid && pbankid != '') {
            const bankname = $event.target.options[$event.target.selectedIndex].text;
            this.GetBankDetailsbyId(pbankid);
            this.getBankBranchName(pbankid);
            this.paymentVoucherForm['controls']['pbankname'].setValue(bankname);

        }
        else {

            this.paymentVoucherForm['controls']['pbankname'].setValue('');
        }

        this.GetValidationByControl(this.paymentVoucherForm, 'pbankname', true);
        this.formValidationMessages['pChequenumber'] = '';
    }
    chequenumber_Change() {

        this.GetValidationByControl(this.paymentVoucherForm, 'pChequenumber', true);
    }
    debitCard_Change() {

        let data = this.getbankname(this.paymentVoucherForm.controls.pCardNumber.value);
        this.paymentVoucherForm['controls']['pbankname'].setValue(data.pbankname);
        this.paymentVoucherForm['controls']['pbankid'].setValue(data.pbankid);
        this.GetValidationByControl(this.paymentVoucherForm, 'pCardNumber', true);
    }
    getbankname(cardnumber) {
        try {
            let data = this.debitcardlist.filter(function (debit) {
                return debit.pCardNumber == cardnumber;
            })[0];
            this.setBalances('BANKBOOK', data.pbankbookbalance);
            this.setBalances('PASSBOOK', data.ppassbookbalance);
            return data;
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }
    ledgerName_Change($event: any): void {
        debugger
        const pledgerid = $event.pledgerid;
        this.subledgeraccountslist = [];
        this.subledgerName = '';
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
        this.ledgerBalance = '';
        this.subledgerBalance = '';
        if (pledgerid && pledgerid != '') {
            const ledgername = $event.pledgername;
            this.ledgerName = $event.pledgername;
            let data = this.ledgeraccountslist.filter(function (ledger) {
                return ledger.pledgerid == pledgerid;
            })[0];
            this.setBalances('LEDGER', data.accountbalance);
            this.GetSubLedgerData(pledgerid);
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue(ledgername);
            // Surendra 18-02-2025
            this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').setValue('');
                    this.formValidationMessages['pdebitamount'] = '';
					
					this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                    this.formValidationMessages['pcreditamount'] = '';
                    // Surendra 18-02-2025
        }
        else {

            this.setBalances('LEDGER', 0);
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue('');
        }
        // Surendra 18-02-2025
if(this.ledgerName == "INTEREST PAYABLE"){
        this.isDisabled = true;
        this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').disable();
}
else{
    //this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
    this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').enable(); // Enable the input
    this.formValidationMessages['pcreditamount'] = '';
}
// Surendra 18-02-2025
    }

    GetSubLedgerData(pledgerid) {

        this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.subledgeraccountslist = json;

                let subLedgerControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'];
                if (this.subledgeraccountslist.length > 0) {
                    this.showsubledger = true;
                    subLedgerControl.setValidators(Validators.required);
                }
                else {
                    subLedgerControl.clearValidators();
                    this.showsubledger = false;
                    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(pledgerid);
                    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pledgername').value);
                    this.formValidationMessages['psubledgername'] = '';
                }
                subLedgerControl.updateValueAndValidity();
                //this.lstLoanTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this._commonService.showErrorMessage(error);
            });
    }
    subledger_Change($event) {
        debugger
        let psubledgerid
        this.subledgerName = '';
        if ($event != undefined) {
            psubledgerid = $event.psubledgerid;
        }
        this.subledgerBalance = '';
        if (psubledgerid && psubledgerid != '') {
            const subledgername = $event.psubledgername;
            this.subledgerName = $event.psubledgername;

            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(subledgername);
            let data = this.subledgeraccountslist.filter(function (ledger) {
                return ledger.psubledgerid == psubledgerid;
            })[0];
            this.setBalances('SUBLEDGER', data.accountbalance);
            // Surendra 18-02-2025
            this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').setValue('');
            this.formValidationMessages['pdebitamount'] = '';
            
            this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
            this.formValidationMessages['pcreditamount'] = '';
            // Surendra 18-02-2025
        }
        else {

            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
            this.setBalances('SUBLEDGER', 0);
        }
        this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername', true);
    }
    upiName_Change($event: any): void {

        const districtid = $event.target.value;

        if (districtid && districtid != '') {
            const districtname = $event.target.options[$event.target.selectedIndex].text;

            //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);
            //this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue(districtid);
        }
        else {

            //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
        }
        this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname', true);
    }
    upid_change() {
        this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid', true);

    }
    GetBankDetailsbyId(pbankid) {

        this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.upinameslist = json.bankupilist;
                this.chequenumberslist = json.chequeslist;


                //this.lstLoanTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this._commonService.showErrorMessage(error);
            });
    }
    getBankBranchName(pbankid) {

        let data = this.banklist.filter(function (bank) {
            return bank.pbankid == pbankid;
        });
        this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
        this.setBalances('BANKBOOK', data[0].pbankbalance);
        this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
    }

    tdsSection_Change($event: any): void {

        const ptdssection = $event.target.value;
        this.tdspercentagelist = [];
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
        if (ptdssection && ptdssection != '') {

            this.gettdsPercentage(ptdssection);

        }
        this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection', true);
    }
    gettdsPercentage(ptdssection) {

        this.tdspercentagelist = this.tdslist.filter(function (tds) {
            return tds.pTdsSection == ptdssection;
        });
        this.claculategsttdsamounts();
    }
    tds_Change($event: any): void {
        this.GetValidationByControl(this.paymentVoucherForm, 'pTdsPercentage', true);
        this.GetValidationByControl(this.paymentVoucherForm, 'ptdsamount', true);
        this.claculategsttdsamounts();
    }
    gst_Change($event: any): void {

        const gstpercentage = $event.target.value;

        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue('');

        if (gstpercentage && gstpercentage != '') {

            this.getgstPercentage(gstpercentage);

        }
        this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
        this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
    }
    getgstPercentage(gstpercentage) {

        let data = this.gstlist.filter(function (tds) {
            return tds.pgstpercentage == gstpercentage;
        });

        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
        this.claculategsttdsamounts();

    }

    partyName_Change($event: any): void {

        let ppartyid;
        if ($event != undefined) {
            ppartyid = $event.ppartyid;
        }
        this.statelist = [];
        this.tdssectionlist = [];
        this.tdspercentagelist = [];
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue('');
        this.partyBalance = '';
        if (ppartyid && ppartyid != '') {
            //const ledgername = $event.target.options[$event.target.selectedIndex].text;
            //this.getPartyDetailsbyid(ppartyid);
            //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(ledgername);
            const partynamename = $event.ppartyname;
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(partynamename);
            let data = (this.partylist.filter(x => x.ppartyid == ppartyid))[0];
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue(data.ppartyreferenceid);
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue(data.ppartyreftype);
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue(data.ppartypannumber);
            this.getPartyDetailsbyid(ppartyid, partynamename);
            this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');
        }
        else {
            this.setBalances('PARTY', 0);
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue('');
        }
    }
    setenableordisabletdsgst(ppartyname, changetype) {


        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);
        let data = this.paymentslist.filter(x => x.ppartyname == ppartyname);
        if (data != null) {
            if (data.length > 0) {

                this.disablegst = true;
                this.disabletds = true;

                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(data[0].pistdsapplicable);
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(data[0].pisgstapplicable);
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue(data[0].pgstcalculationtype)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue(data[0].ptdscalculationtype)
            }
            else {
                this.disablegst = false;
                this.disabletds = false;
            }
        }
        else {
            this.disablegst = false;
            this.disabletds = false;
        }
        if (changetype = 'PARTYCHANGE') {
            this.isgstapplicableChange();
            this.istdsapplicableChange();
        }
    }
    getPartyDetailsbyid(ppartyid, partynamename) {

        this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid).subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.tdslist = json.lstTdsSectionDetails;
                let newdata = json.lstTdsSectionDetails.map(item => item.pTdsSection)
                    .filter((value, index, self) => self.indexOf(value) === index)
                for (let i = 0; i < newdata.length; i++) {
                    let object = { pTdsSection: newdata[i] }
                    this.tdssectionlist.push(object);
                }
                this.statelist = json.statelist;
                this.claculategsttdsamounts();
                this.setBalances('PARTY', json.accountbalance);

                //this.lstLoanTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this._commonService.showErrorMessage(error);
            });
    }
    gsno_change() {
        this.GetValidationByControl(this.paymentVoucherForm, 'pgstno', true);
    }
    state_change($event) {

        const pstateid = $event.target.value;
        //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
        if (pstateid && pstateid != '') {


            const statename = $event.target.options[$event.target.selectedIndex].text;
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue(statename);
            //let gstnoControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

            let gstno = statename.split('-')[1];
            if (gstno) {
                //gstnoControl.clearValidators();
                this.showgstno = false;
            }
            else {
                this.showgstno = true;
                //  gstnoControl.setValidators(Validators.required);
            }
            //gstnoControl.updateValueAndValidity();

            let data = this.GetStatedetailsbyId(pstateid);

            this.showgstamount = true;
            this.showigst = false;
            this.showcgst = false;
            this.showsgst = false;
            this.showutgst = false;

            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgsttype'].setValue(data.pgsttype);
            if (data.pgsttype == 'IGST')
                this.showigst = true;
            else {
                this.showcgst = true;
                if (data.pgsttype == 'CGST,SGST')
                    this.showsgst = true;
                if (data.pgsttype == 'CGST,UTGST')
                    this.showutgst = true;
            }
        }
        else {

            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
        }
        this.GetValidationByControl(this.paymentVoucherForm, 'pState', true);
        this.formValidationMessages['pigstpercentage'] = '';
        this.claculategsttdsamounts();
    }
    GetStatedetailsbyId(pstateid): any {
        return (this.statelist.filter(function (tds) {
            return tds.pStateId == pstateid;
        }))[0];
    }
    pamount_change() {
        debugger;
        //let paidamount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value);

        //if (isNaN(paidamount))
        //  paidamount = 0;

        //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(paidamount);
        // Surendra 18-02-2025
        // COmmented 23-05-2025

        // || this.ledgerName == "OUT STANDING PAYABLE"  || this.ledgerName == "SALE ADVANCE-HRB" || this.ledgerName == "SALE ADVANCE"

        if (this.ledgerName == "INTEREST PAYABLE" || this.ledgerName == "INTEREST PAID A/C" || this.ledgerName == "OUTSTANDING PROMOTER SALARY"   || this.ledgerName == "INTEREST PAID A/C" || this.ledgerName == "PLOT ADVANCE" ) {
            //this.readonlycredit = true;
            let debitAmount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value.toString().replace(/,/g, ""));
            let subBal = this.subledgerBalance.split(' ');
            let actSubBal = Number(subBal[0].toString().replace(/,/g, ""));
            let creditAmount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value.toString().replace(/,/g, ""));
            if (this.amounttype == 'Debit') {
                if (debitAmount > actSubBal) {
                    this._commonService.showWarningMessage('Debit Amount Shouldnot Be Greaterthan Sub Ledger Balance');
                    this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').setValue('');
                    this.formValidationMessages['pdebitamount'] = '';
                    return
                }
            }

            if (this.amounttype == 'Credit') {
                // if (creditAmount > actSubBal) {
                //     this._commonService.showWarningMessage('Credit Amount Shouldnot Be Greaterthan Sub Ledger Balance');
                //     this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                //     this.formValidationMessages['pcreditamount'] = '';
                //     return
                // }
                this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                this.formValidationMessages['pcreditamount'] = '';
            }
        }
    

    if(this.userNameF != 'admin@kapilit.com'){

        if (this.ledgerName == "SALE ADVANCE-HRB" || this.ledgerName == "OUT STANDING PAYABLE" || this.ledgerName == "SALE ADVANCE") {
            //this.readonlycredit = true;
            let debitAmount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value.toString().replace(/,/g, ""));
            let subBal = this.subledgerBalance.split(' ');
            let actSubBal = Number(subBal[0].toString().replace(/,/g, ""));
            let creditAmount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value.toString().replace(/,/g, ""));
            if (this.amounttype == 'Debit') {
                if (debitAmount > actSubBal) {
                    this._commonService.showWarningMessage('Debit Amount Shouldnot Be Greaterthan Sub Ledger Balance');
                    this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').setValue('');
                    this.formValidationMessages['pdebitamount'] = '';
                    return
                }
            }

            if (this.amounttype == 'Credit') {
                // if (creditAmount > actSubBal) {
                //     this._commonService.showWarningMessage('Credit Amount Shouldnot Be Greaterthan Sub Ledger Balance');
                //     this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                //     this.formValidationMessages['pcreditamount'] = '';
                //     return
                // }
                this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                this.formValidationMessages['pcreditamount'] = '';
            }
        }
    }

    
        // Surendra 18-02-2025
        this.claculategsttdsamounts();
    }
    claculategsttdsamounts() {

        try {

            let paidamount;
            let typeofamount = "";
            let typeoftotalamount = "";
            if (this.amounttype == 'Debit') {
                paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value;
                if (isNullOrEmptyString(paidamount))
                    paidamount = 0;
                else
                    paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
                typeoftotalamount = 'ptotaldebitamount';

            }
            if (this.amounttype == 'Credit') {

                paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value;
                if (isNullOrEmptyString(paidamount))
                    paidamount = 0;
                else
                    paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
                typeoftotalamount = 'ptotalcreditamount';
            }


            //paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get(typeofamount).value;
            if (isNaN(paidamount) || paidamount == null)
                paidamount = 0;
            else
                paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
            let actualpaidamount = paidamount;
            let isgstapplicable = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;
            let gsttype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgsttype').value;
            let gstcalculationtype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstcalculationtype').value;

            let igstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pigstpercentage').value;
            if (isNaN(igstpercentage))
                igstpercentage = 0;
            let cgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcgstpercentage').value;
            if (isNaN(cgstpercentage))
                cgstpercentage = 0;
            let sgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('psgstpercentage').value;
            if (isNaN(sgstpercentage))
                sgstpercentage = 0;
            let utgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('putgstpercentage').value;
            if (isNaN(utgstpercentage))
                utgstpercentage = 0;

            let gstamount = 0;
            let igstamount = 0;
            let cgstamount = 0;
            let sgstamount = 0;
            let utgstamount = 0;
            let totalamount = 0;


            if (isgstapplicable) {
                if (gstcalculationtype == 'INCLUDE') {
                    gstamount = Math.round((paidamount * igstpercentage) / (100 + igstpercentage));
                    if (gsttype == 'IGST') {
                        igstamount = Math.round((paidamount * igstpercentage) / (100 + igstpercentage));
                        actualpaidamount = paidamount - igstamount;
                    }

                    else if (gsttype == 'CGST,SGST') {
                        cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
                        sgstamount = Math.round((paidamount * sgstpercentage) / (100 + igstpercentage));

                        actualpaidamount = paidamount - (cgstamount + sgstamount);
                    }
                    else if (gsttype == 'CGST,UTGST') {
                        cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
                        utgstamount = Math.round((paidamount * utgstpercentage) / (100 + igstpercentage));
                        actualpaidamount = paidamount - (cgstamount + utgstamount);
                    }
                }
                else if (gstcalculationtype == 'EXCLUDE') {
                    gstamount = Math.round((paidamount * igstpercentage) / (100));
                    if (gsttype == 'IGST') {
                        igstamount = Math.round((paidamount * igstpercentage) / (100));
                    }
                    else if (gsttype == 'CGST,SGST') {
                        cgstamount = Math.round((paidamount * cgstpercentage) / (100));
                        sgstamount = Math.round((paidamount * sgstpercentage) / (100));

                    }
                    else if (gsttype == 'CGST,UTGST') {
                        cgstamount = Math.round((paidamount * cgstpercentage) / (100));
                        utgstamount = Math.round((paidamount * utgstpercentage) / (100));
                    }
                    actualpaidamount = paidamount;
                }
            }

            let tdscalculationtype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptdscalculationtype').value;
            let istdsapplicable = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;
            let tdspercentage = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value.toString().replace(/,/g, ""));

            if (isNaN(tdspercentage))
                tdspercentage = 0;

            let tdsamount = 0;

            if (istdsapplicable) {
                if (tdscalculationtype == 'INCLUDE') {
                    if (gstcalculationtype == 'INCLUDE') {
                        tdsamount = Math.round((actualpaidamount * tdspercentage) / (100 + tdspercentage));
                    }
                    else {
                        tdsamount = Math.round((paidamount * tdspercentage) / (100 + tdspercentage));
                    }
                    actualpaidamount = actualpaidamount - tdsamount;

                }
                else if (tdscalculationtype == 'EXCLUDE') {
                    tdsamount = Math.round((paidamount * tdspercentage) / (100));

                    actualpaidamount = actualpaidamount;
                }
            }

            if (isNaN(gstamount))
                gstamount = 0;
            if (isNaN(igstamount))
                igstamount = 0;
            if (isNaN(cgstamount))
                cgstamount = 0;
            if (isNaN(sgstamount))
                sgstamount = 0;
            if (isNaN(utgstamount))
                utgstamount = 0;
            if (isNaN(tdsamount))
                tdsamount = 0;

            totalamount = actualpaidamount + sgstamount + igstamount + cgstamount + utgstamount + tdsamount;
            if (isNaN(totalamount))
                totalamount = 0;


            if (actualpaidamount > 0)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue(this._commonService.currencyformat(actualpaidamount));
            else
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue('');

            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'].setValue(this._commonService.currencyformat(gstamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstamount'].setValue(this._commonService.currencyformat(igstamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstamount'].setValue(this._commonService.currencyformat(cgstamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstamount'].setValue(this._commonService.currencyformat(sgstamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstamount'].setValue(this._commonService.currencyformat(utgstamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdsamount'].setValue(this._commonService.currencyformat(tdsamount));
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalamount'].setValue(this._commonService.currencyformat(totalamount));
            if (this.amounttype == 'Debit') {
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotaldebitamount'].setValue(this._commonService.currencyformat(totalamount));
            }
            if (this.amounttype == 'Credit') {
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalcreditamount'].setValue(this._commonService.currencyformat(totalamount));
            }

            this.formValidationMessages['pamount'] = '';

            //if (typeofamount != '') {
            //  this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls'][typeoftotalamount].setValue(this._commonService.currencyformat(totalamount));
            ////  let Pamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value;
            // // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls'][typeofamount].setValue(Pamount);
            //  //let amount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get(typeofamount).value;
            //  //let gstamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstamount').value;
            //  //let tdsamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptdsamount').value;

            //  //amount = parseFloat(amount.toString().replace(/,/g, ""));
            //  //gstamount = parseFloat(gstamount.toString().replace(/,/g, ""));
            //  //tdsamount = parseFloat(tdsamount.toString().replace(/,/g, ""));

            //  //let totaldamount = amount + gstamount + tdsamount;
            //  //if (isNaN(totaldamount))
            //  //  totaldamount = '';



            //}
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }
    validateaddPaymentDetails(): boolean {
debugger
        let isValid: boolean = true;
        const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
        try {
            isValid = this.checkValidations(formControl, isValid)
            let ledgername = formControl.controls.pledgername.value;
            let subledgername = formControl.controls.psubledgername.value;
            let partyname = formControl.controls.ppartyname.value;

            let griddata = this.paymentslist;

            // 18-02-2025

            if(this.subledgerName == '' || this.subledgerName == undefined){
                this.subledgerName = this.ledgerName;
            }

            for (let i = 0; i < griddata.length; i++) {
                if (griddata[i].psubledgername == this.subledgerName && griddata[i].pledgername == this.ledgerName) {
                    this._commonService.showWarningMessage('Already data entered with Sub Ledger Name' + ' - ' + this.subledgerName);
                    this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').setValue('');
                    this.formValidationMessages['pdebitamount'] = '';
					
					this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').setValue('');
                    this.formValidationMessages['pcreditamount'] = '';
                    return;
                }

            }

            // 18-02-2025 Surendra
            

            let count = 0;


            for (let i = 0; i < griddata.length; i++) {
                if (griddata[i].pledgername == ledgername && griddata[i].psubledgername == subledgername && griddata[i].ppartyname == partyname) {
                    count = 1;
                    break;
                }

            }
            if (count == 1) {
                this._commonService.showWarningMessage('Ledgername, Party name  already exists in grid');
                isValid = false;
            }
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
        //this.formValidationMessages['pdebitamount'] = 'required';
        //this.formValidationMessages['pcreditamount'] = 'required';

        return isValid;
    }
    addPaymentDetails() {
        debugger
        const control = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
        if (this.validateaddPaymentDetails()) {

            let stateid = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pStateId').value;
            if (stateid == "" || stateid == null)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue(0);

            let tdspercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value;
            if (tdspercentage == "" || tdspercentage == null)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue(0);

            let gstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstpercentage').value;
            if (gstpercentage == "" || gstpercentage == null)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue(0);

            let debitamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptotaldebitamount').value;
            if (debitamount == "" || debitamount == null || debitamount == 0)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotaldebitamount'].setValue('');

            let creditamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptotalcreditamount').value;
            if (creditamount == "" || creditamount == null || creditamount == 0)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalcreditamount'].setValue('');

            let partyidd = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ppartyid').value;
            if (isNullOrEmptyString(partyidd))
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(0);

            let pactualpaidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pactualpaidamount').value;
            if (pactualpaidamount == "" || pactualpaidamount == null)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(0);

            this.paymentslist.push(control.value);
            this.getpartyJournalEntryData();
            this.clearPaymentDetails();
            this.getPaymentListColumnWisetotals();
            this.disableamounttype('');
            this.validateDebitCreditAmounts();

        }
    }
    getPaymentListColumnWisetotals() {

        let totaladebitmount = 0;

        let totalacreditmount = 0;
        //totaladebitmount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotaldebitamount).replace(/,/g, "")), 0);
        //if (isNaN(totaladebitmount)) { totaladebitmount = ""; }
        //if (totaladebitmount==0) { totaladebitmount = ""; }
        //else { totaladebitmount = this._commonService.currencyformat(totaladebitmount); }


        //this.paymentlistcolumnwiselist['ptotaldebitamount'] = totaladebitmount;

        //totalacreditmount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalcreditamount).replace(/,/g, "")), 0);
        //if (isNaN(totalacreditmount)) { totalacreditmount = ""; } if (totalacreditmount == 0) { totalacreditmount = ""; } else { totalacreditmount = this._commonService.currencyformat(totalacreditmount);}

        //this.paymentlistcolumnwiselist['ptotalcreditamount'] = totalacreditmount;

        this.paymentslist.reduce((acc, item) => {
            totaladebitmount += isNullOrEmptyString(item.ptotaldebitamount) ? parseFloat('0') : parseFloat(item.ptotaldebitamount.replace(/,/g, ""));
            totalacreditmount += isNullOrEmptyString(item.ptotalcreditamount) ? parseFloat('0') : parseFloat(item.ptotalcreditamount.replace(/,/g, ""));
        }, 0);
        if (totaladebitmount != 0) {
            totaladebitmount = this._commonService.currencyformat(totaladebitmount);
        }
        if (totalacreditmount != 0) {
            totalacreditmount = this._commonService.currencyformat(totalacreditmount);
        }
        this.paymentlistcolumnwiselist['ptotaldebitamount'] = totaladebitmount;
        this.paymentlistcolumnwiselist['ptotalcreditamount'] = totalacreditmount;


        let totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['pamount'] = this._commonService.currencyformat(totalamount);


        totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pgstamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['pgstamount'] = this._commonService.currencyformat(totalamount);

        totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['ptdsamount'] = this._commonService.currencyformat(totalamount);
    }
    clearPaymentDetails() {

        const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
        formControl.reset();
        this.showsubledger = true;
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);


        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].setValue(null);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(null);

        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
        this.setBalances('LEDGER', 0);
        this.setBalances('SUBLEDGER', 0);
        this.setBalances('PARTY', 0);
        this.isgstapplicableChange();
        this.istdsapplicableChange();
        this.formValidationMessages = {};

    }

    validatesaveJournalVoucher(): boolean {
        debugger
        let isValid: boolean = true;
        try {
            isValid = this.checkValidations(this.paymentVoucherForm, isValid);
            if (this.paymentslist.length == 0) {
                //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
                isValid = false;
            }
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }


        return isValid;
    }
    clearPaymentVoucher() {

        try {
            this.paymentslist = [];
            this.paymentVoucherForm.reset();

            this.clearPaymentDetails();



            let date = new Date();
            this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
            this.formValidationMessages = {};
            this.paymentlistcolumnwiselist = {};
            this.cashBalance = '0';
            this.bankBalance = '0';
            this.bankbookBalance = '0';
            this.bankpassbookBalance = '0';
            this.ledgerBalance = '0';
            this.subledgerBalance = '0';
            this.partyBalance = '0';
            this.partyjournalentrylist = [];
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }
    saveJournalVoucher() {
        debugger


        // this.disablesavebutton = true;

        this.disablesavebutton = true;


        // this.disablesavebutton = true;
        this.disablesavebutton = true;

        this.savebutton = 'Processing';
        if (this.validatesaveJournalVoucher()) {
            let bankid = this.paymentVoucherForm.controls.pbankid.value;
            if (bankid == "" || bankid == null)
                this.paymentVoucherForm['controls']['pbankid'].setValue(0);
            this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(0);
            this.paymentVoucherForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            let totaladebitmount = 0;
            let totalacreditmount = 0;

            let pactualpaidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pactualpaidamount').value;
            if (pactualpaidamount == "" || pactualpaidamount == null)
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(0);

            this.paymentslist.reduce((acc, item) => {
                totaladebitmount += isNullOrEmptyString(item.ptotaldebitamount) ? parseFloat('0') : parseFloat(item.ptotaldebitamount.replace(/,/g, ""));
                totalacreditmount += isNullOrEmptyString(item.ptotalcreditamount) ? parseFloat('0') : parseFloat(item.ptotalcreditamount.replace(/,/g, ""));
            }, 0);



            //let debittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotaldebitamount).replace(/,/g, "")), 0)
            //let credittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotalcreditamount).replace(/,/g, "")), 0)
            if (totaladebitmount != totalacreditmount) {
                this._commonService.showWarningMessage("Total Debit amount and Credit amount mismatch.");
                this.disablesavebutton = false;
                this.savebutton = 'Save';
            }
            else {
                let newdata = { pJournalVoucherlist: this.paymentslist };
                let paymentVoucherdata = Object.assign(this.paymentVoucherForm.value, newdata);
                let data = JSON.stringify(paymentVoucherdata);
                console.log("json data", data)
                this._AccountingTransactionsService.saveJournalVoucher(data).subscribe(res => {
                    console.log("res", res)
                    //if (res) {
                    //  this._commonService.showInfoMessage("Saved sucessfully");
                    // // this.clearPaymentVoucher();
                    //  this._routes.navigate(['/JournalvoucherView'])
                    //}
                    if (res[0] == 'TRUE') {
                        //this.JSONdataItem = res;
                        this.disablesavebutton = false;
                        this.savebutton = 'Save';
                        this._commonService.showInfoMessage("Saved sucessfully");
                        this.clearPaymentVoucher();
                        this._routes.navigate(['/JournalvoucherView']);
                        window.open('/#/JournalvoucherReport?id=' + btoa(res[1] + ',' + 'Journal Voucher'));

                    }

                },
                    (error) => {
                        //this.isLoading = false;
                        this._commonService.showErrorMessage(error);
                    });
            }
        }
        else {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
        }
    }
    getpartyJournalEntryData() {

        let dataobject = { accountname: '', debitamount: '', creditamount: '' }
        this.partyjournalentrylist = [];
        //this.partyjournalentrylist.push(dataobject);
        if (this.paymentVoucherForm.controls.pmodofpayment.value == "CASH") {
            dataobject = { accountname: 'To MAIN CASH', debitamount: '', creditamount: '1000' }
        }
        else {
            dataobject = { accountname: 'To BANK', debitamount: '', creditamount: '20000' }
        }
        this.partyjournalentrylist.push(dataobject);
    }
    disableamounttype(Amounttype) {


        let debitamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value;
        let creditamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value;

        if (!isNullOrEmptyString(debitamount)) {

            this.amounttype = Amounttype;
            this.readonlydebit = false;
            if(this.userNameF != 'admin@kapilit.com'){
            this.readonlycredit = true;
            }
            if(this.userNameF == 'admin@kapilit.com'){
            this.readonlycredit = false;
            }
            let creditamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'];
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('Debit');
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue(debitamount);
            creditamountControl.clearValidators();
            creditamountControl.updateValueAndValidity();
            this.formValidationMessages['pcreditamount'] = '';
            //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].clearValidators();
            //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].updateValueAndValidity();

        }
        else if (!isNullOrEmptyString(creditamount)) {
            this.amounttype = Amounttype;
            this.readonlydebit = true;
            this.readonlycredit = false;
            let debitamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'];
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('Credit');
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue(creditamount);
            debitamountControl.clearValidators();
            debitamountControl.updateValueAndValidity();
            this.formValidationMessages['pdebitamount'] = '';
            //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].clearValidators();
            //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].updateValueAndValidity();

        }
        else {
            //setValidators(Validators.required);
            this.readonlydebit = false;
            this.readonlycredit = false;
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('');
            this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue('');
            <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].setValidators(Validators.required);
            <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].setValidators(Validators.required);

        }
        this.validateDebitCreditAmounts();
    }
    validateDebitCreditAmounts() {

        let isValid: boolean = true;
        let debitamountcount = 0;
        let creditamountcount = 0;
        let griddata = this.paymentslist;
        try {
            for (let i = 0; i < griddata.length; i++) {
                if (!isNullOrEmptyString(griddata[i].pdebitamount)) {
                    debitamountcount = debitamountcount + 1;
                }
                if (!isNullOrEmptyString(griddata[i].pcreditamount)) {
                    creditamountcount = creditamountcount + 1;
                }
            }
            if (debitamountcount > 1 && creditamountcount == 1) {
                this.readonlydebit = false;
                this.readonlycredit = true;
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].clearValidators();
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].updateValueAndValidity();


            }
            else if (creditamountcount > 1 && debitamountcount == 1) {
                this.readonlydebit = true;
                this.readonlycredit = false;
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].clearValidators();
                this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].updateValueAndValidity();

            }

        } catch (e) {
            this._commonService.showErrorMessage(e);
        }

    }
    public removeHandler({ dataItem }) {

        const index: number = this.paymentslist.indexOf(dataItem);
        if (index !== -1) {
            this.paymentslist.splice(index, 1);
        }
        this.disableamounttype('');
        this.getPaymentListColumnWisetotals();

    }
    uploadAndProgress(event: any, files) {

        let file = event.target.files[0];
        this.imageResponse;
        if (event && file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                this.imageResponse = {
                    name: file.name,
                    fileType: "imageResponse",
                    contentType: file.type,
                    size: file.size,

                };
            };
        }
        let fname = "";
        if (files.length === 0) {
            return;
        }
        var size = 0;
        const formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            size += files[i].size;
            fname = files[i].name
            formData.append(files[i].name, files[i]);
            formData.append('NewFileName', 'General Receipt' + '.' + files[i]["name"].split('.').pop());
        }
        size = size / 1024;
        size = size / 1024
        this._commonService.fileUpload(formData).subscribe(data => {
            let kycFileName = data[1];
            this.imageResponse.name = data[1];
            let kycFilePath = data[0];
            let Filepath = kycFileName.split(".");

            this.paymentVoucherForm.controls.pFilename.setValue(kycFileName);
            this.paymentVoucherForm.controls.pFileformat.setValue(kycFilePath);
            this.paymentVoucherForm.controls.pFilepath.setValue(Filepath[1]);
        })
    }
}
