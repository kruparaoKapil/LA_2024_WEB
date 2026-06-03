import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { anyChanged, isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { State } from '@progress/kendo-data-query';



@Component({
    selector: 'app-commission-payement-new',
    templateUrl: './commission-payement-new.component.html',
    styles: []
})
export class CommissionPayementNewComponent implements OnInit {
    showModeofPayment = false;
    showtranstype = false;
    public SavingAccountShowhide: boolean = false;
    CommissionPaymentForm: FormGroup
    showCheque: any;
    showOnline: any;
    showdebitcard: any;
    public ShowAgentnames: any = []
    public SavingsAccounts: any = [];
    showupi: any;
    upiidlist: any;
    upinameslist: any;
    chequenumberslist: any;
    clickedRowItem: any;
    pcommissionpaymentlist: any;
    public total: number = 0;
    public today: Date = new Date();
    asondate: any;
    agentid: any;
    pmembername: any;
    pagentname: any;
    pfdname: any;
    pfdaccountno: any;
    ptransdate: any;
    ptenortype: any;
    ptenor: any;
    pdepositamount: any;
    pinteresttype: any;
    pinterestrate: any;
    pmaturityamount: any;
    pinterestpayable: any;
    pdepositdate: any;
    pmaturitydate: any;
    psalespersonname: any;
    pcommsssionvalue: any;

    CommisionPaymentErrors: any;
    pCommissionpaymentDate: any;
    formValidationMessages: any;
    public allSelectedModels: any = []
    savebutton = "Save";
    public banklist: any[]
    public banklist1: any[]
    public debitcardlist: any[]
    public typeofpaymentlist: any[]
    public modeoftransactionslist: any[]
    public cashBalance: number = 0;
    public bankBalance: number = 0;
    JSONdataItem: any = [];
    disablesavebutton = false;
    public ShowAgentDetails: any = []
    public pageSize = 5;
    public skip = 0;
    public commissionpaymentlist: any = []
    public agentcontactlist: any = []
    allStudentsSelected: boolean = false;

    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public SavingsMemberBalance: any;
    disabletransactiondate = false;

    constructor(private CommissionFormBuilder: FormBuilder, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private _AccountingTransactionsService: AccountingTransactionsService) {

        this.dpConfig.dateInputFormat = "DD/MM/YYYY";
        this.dpConfig.maxDate = new Date();
        this.dpConfig.showWeekNumbers = false;

    }
    ngOnInit() {
        if (this._CommonService.comapnydetails != null)
        this.disabletransactiondate = this._CommonService.comapnydetails.pdatepickerenablestatus;
        this.CommissionPaymentForm = this.CommissionFormBuilder.group({

            pCommissionpaymentDate: [this.today, Validators.required],
            asondate: [this.today],
            pagentname: ['', Validators.required],
            pagentid: ['', Validators.required],
            pTotalpaymentamount: [''],
            pnarration: ['', Validators.required],
            ppaymentid: [''],
            pModeofreceipt: ['BANK'],
            ptranstype: ['CHEQUE'],
            pCreatedby: [this._CommonService.pCreatedby],


            pbankid: ['', Validators.required],
            pbankname: [''],
            pbranchname: ['', Validators.required],
            pchequeno: ['', Validators.required],

            ptypeofpayment: ['', Validators.required],
            preferencenoonline: ['', Validators.required],
            pUpiname: ['', Validators.required],
            pUpiid: ['', Validators.required],
            pdebitcard: ['', Validators.required],
            pfinancialservice: ['', Validators.required],
            preferencenodcard: ['', Validators.required],
            pSavingsMemberAccountid: ['0'],
            pSavingsMemberBalance: [''],
            pIscheck: [''],


            pcommissionpaymentlist: this.addCommissionpaymentlistcontrols(),
        })
        this.showCheque = true;
        this.showOnline = false;
        this.showdebitcard = false;
        this.asondate = this.today;
        this.SavingsAccounts = [];
        this.GetAgentDetails();
        this.getLoadData();
        this.Paymenttype();
        this.CommisionPaymentErrors = {};
        this.BlurEventAllControll(this.CommissionPaymentForm);


    }
    addCommissionpaymentlistcontrols(): FormGroup {
        return this.CommissionFormBuilder.group({
            pMembername: [''],
            pSchemeAccountno: [''],
            pDepositamount: [''],
            pMaturityamount: [''],
            pCommissionamount: [''],
            pTdsamount: [''],
            ptotalamount: [''],
            pdebitaccountid: [''],

        })

    }



    // Validation Methods ---------------
    checkValidations(group: FormGroup, isValid: boolean): boolean {
        debugger
        try {

            Object.keys(group.controls).forEach((key: string) => {

                isValid = this.GetValidationByControl(group, key, isValid);
            })

        }
        catch (e) {
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
                    this.CommisionPaymentErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.CommisionPaymentErrors[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            // this.showErrorMessage(e);
            // return false;
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
    // End Validation Methods --------------



    getLoadData() {
        debugger;
        this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {
            debugger;
            console.log(json)
            if (json != null) {

                console.log("cashbalance", json)
                this.banklist = json.banklist;
                this.banklist1 = json.banklist;
                this.modeoftransactionslist = json.modeofTransactionslist;
                this.debitcardlist = json.bankdebitcardslist;
                this.setBalances('BANK', json.bankbalance);
                this.setBalances('CASH', json.cashbalance);


            }
            this.typeofpaymentlist = this.gettypeofpaymentdata();
        },
            (error) => {

                this._CommonService.showErrorMessage(error);
            });
    }
    setBalances(balancetype, balanceamount) {

        let balancedetails;
        if (parseFloat(balanceamount) < 0) {
            balancedetails = this._CommonService.currencyformat(Math.abs(balanceamount)) + ' Cr';
        }
        else if (parseFloat(balanceamount) >= 0) {
            balancedetails = this._CommonService.currencyformat(balanceamount) + ' Dr';
        }
        if (balancetype == 'CASH')
            this.cashBalance = balancedetails;
        if (balancetype == 'BANK')
            this.bankBalance = balancedetails;

    }
    saveCommisionPayment() {
        debugger;
      
        let isValid = true;
        if (this.checkValidations(this.CommissionPaymentForm, isValid)) {
            let paymentamount: any;
            //----as per laxman sir
            // paymentamount = parseFloat(this.total.toString().replace(/,/g, ""))
            // if (paymentamount == 0) {
            //     this._CommonService.showWarningMessage('Total Payment Amount should be greater than zero');
            //     return;
            // }

            let newdata = { pcommissionpaymentlist: this.allSelectedModels };
            let Commisionpaymentdata = Object.assign(this.CommissionPaymentForm.value, newdata);
            
            //----as per laxman sir
            // if (this.CommissionPaymentForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
            //     if (this.SavingsMemberBalance < parseFloat(this.total.toString().replace(/,/g, ""))) {
            //         this._CommonService.showWarningMessage('Total Payment Amount should be greater than or equal to Savings Balance');
            //         return;
            //     }
            // }

            this.disablesavebutton = true;
            this.savebutton = 'Processing';
            let data = JSON.stringify(Commisionpaymentdata);
            debugger;
            this._LienEntryService.SaveCommisionPayment(data).subscribe(res => {

                if (res) {
                    console.log("result is", res['pvoucherid']);
                    this.JSONdataItem = res;
                   
                    debugger;
                    this._CommonService.showInfoMessage("Saved Sucessfully");
                    this.total=0;
                    if (this.CommissionPaymentForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
                        window.open('/#/PaymentVoucherReports?id=' + btoa(res['pvoucherid'] + ',' + 'Payment Voucher'));

                    }
                    else {
                        let receipt = btoa(res[1]['pJvnumber'] + ',' + 'Journal Voucher');
                        window.open('/#/JournalvoucherReport?id=' + receipt);
                    }
                    this.clearCommisionPayment();
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                    debugger;
                    this.router.navigate(['/CommissionPaymentView']);

                }

            },
                (error) => {

                    this._CommonService.showErrorMessage(error);
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                });
        }
        else {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
        }
    }
    gettypeofpaymentdata(): any {
        debugger;
        let data = this.modeoftransactionslist.filter(function (payment) {
            return payment.ptranstype != payment.ptypeofpayment;
        });
        return data;
    }
    ShowPromoterSalaryDetails() {
        debugger;
        // this.showbtnvalidation('GET')
        this.GetValidationByControl(this.CommissionPaymentForm, 'pagentid', true);
        this.commissionpaymentlist = [];
        debugger;

        let date = this.datepipe.transform(new Date(this.CommissionPaymentForm.controls.pCommissionpaymentDate.value), "dd-MMM-yyyy");
        if (this.agentid != undefined && date != undefined) {
            this._LienEntryService.ShowPromoterSalaryDetails(this.agentid, date).subscribe(result => {
                debugger;
                this.commissionpaymentlist = result;

            })
        }



    }
    //DebitCard_Change($event: any): void {
    //    debugger;
    //    const pbankid = $event.target.value;
    //    if (pbankid && pbankid != '' && pbankid != 'Select') {
    //        const bankname = $event.target.options[$event.target.selectedIndex].text;
    //        this.CommissionPaymentForm['controls']['pbankname'].setValue(bankname);

    //    }
    //    else {


    //    }


    //}
    agentnamechange(event) {
        debugger;
        let earray=[];
        this.commissionpaymentlist=[...earray];
        this.total=0;
        this.agentid = event.pagentid;
        this.allStudentsSelected = false;
        this.agentcontactlist = [];
        this.SavingsAccounts=[];
        this.CommissionPaymentForm.controls.pModeofreceipt.setValue("BANK");
        this.Paymenttype();
        debugger;
        this._LienEntryService.GetAgentContactDetails(this.agentid).subscribe(result => {

            debugger;

            this.agentcontactlist = result;
            console.log("agent list", this.agentcontactlist)
            this.pmembername = Array.from(new Set(this.agentcontactlist.map(bill => bill.pmembername)))[0];
            this.pagentname = Array.from(new Set(this.agentcontactlist.map(bill => bill.pagentname)));
            this.pfdname = Array.from(new Set(this.agentcontactlist.map(bill => bill.pfdname)))[0];


        })
        let contactid = event.pcontactid;
        this._LienEntryService.GetCPAdjustmentDetils(contactid).subscribe(json => {
            this.SavingsAccounts = json;
        });
  
    }

    SavingsAccountsChanges(event) {
        debugger
        this.CommissionPaymentForm.controls.pSavingsMemberAccountid.setValue(event.pSavingsMemberAccountid);
        this.SavingsMemberBalance = event.pSavingsMemberBalance;
        this.CommisionPaymentErrors['pSavingsMemberAccountid'] = '';
    }
    selectAllStudentsChange($event: any, dataItem, rowIndex) {
        debugger
        this.total = 0;
        if ($event.target.checked) {
            this.allStudentsSelected = true;
            for (let i = 0; i < this.commissionpaymentlist.length; i++) {
                this.commissionpaymentlist[i].add = true;
                this.total += (this.commissionpaymentlist[i].ptotalamount);
                //this.total += parseFloat(dataItem.ptotalamount);
                this.allSelectedModels.push(this.commissionpaymentlist[i]);
            }
        } else {
            this.allStudentsSelected = false;
            for (let i = 0; i < this.commissionpaymentlist.length; i++) {
                this.commissionpaymentlist[i].add = false;

                this.total = 0;
                this.allSelectedModels.splice(rowIndex, 1)
            }
        }
        this.CommissionPaymentForm.controls.pTotalpaymentamount.setValue(this.total);

    }


    clickselectforpayments($event: any, dataItem, rowIndex) {
        debugger;
        if (this.commissionpaymentlist.length == 1) {
            this.allStudentsSelected = true;
        }
        //else {
        //    this.allStudentsSelected = false;
        //}
        if ($event.target.checked) {
            this.total += parseFloat(dataItem.ptotalamount);
            this.allSelectedModels.push(dataItem);
        }
        else {

            if (this.total > parseFloat(dataItem.ptotalamount)) {
                this.total -= parseFloat(dataItem.ptotalamount);
            }
            else {
                this.total = parseFloat(dataItem.ptotalamount) - this.total;
            }
            this.allSelectedModels.splice(rowIndex, 1);
            this.allStudentsSelected = false;

        }
         this.allSelectedModels=[... this.allSelectedModels]
        this.CommissionPaymentForm.controls.pTotalpaymentamount.setValue(this.total);



    }
    Datechange(event) {
        debugger;
        this.asondate = this.datepipe.transform(event, 'yyyy-MM-dd');
    }
    GetAgentDetails() {
        debugger;
        this._LienEntryService.GetAgentDetails().subscribe(result => {
            debugger;

            if (result) {
                this.ShowAgentnames = result;


            }

        })
    }
    transofPaymentChange(type) {
        debugger;

        if (type == "CHEQUE") {
            this.showCheque = true;
            this.showOnline = false;
            this.showdebitcard = false;

        }
        else if (type == "ONLINE") {
            this.showOnline = true;
            this.showCheque = false;
            this.showdebitcard = false;


        }
        else if (type == "DEBIT CARD") {
            this.showdebitcard = true;
            this.showCheque = false;
            this.showOnline = false;

        }
        else {
            this.showdebitcard = false;
            this.showCheque = false;
            this.showOnline = false;
        }
        this.modeofpaymentvalidation(type);
        this.clearmodeofpaymentDetails();

    }

    typeofPaymentChange() {
        debugger;
        let UpinameControl = <FormGroup>this.CommissionPaymentForm['controls']['pUpiname'];
        let UpiidControl = <FormGroup>this.CommissionPaymentForm['controls']['pUpiid'];
        if (this.CommissionPaymentForm.controls.ptypeofpayment.value == 'UPI') {
            this.showupi = true;
            UpinameControl.setValidators(Validators.required);
            UpiidControl.setValidators(Validators.required);
        }
        else {
            this.showupi = false;
            UpinameControl.clearValidators();
            UpiidControl.clearValidators();
        }
        UpinameControl.updateValueAndValidity();
        UpiidControl.updateValueAndValidity();
        this.GetValidationByControl(this.CommissionPaymentForm, 'ptypeofpayment', true);
    }

    GetBankDetailsbyId(pbankid) {
        debugger;
        this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(json => {

            if (json != null) {
                this.upinameslist = json.bankupilist;
                this.chequenumberslist = json.chequeslist;

            }
        },
            (error) => {

                this._CommonService.showErrorMessage(error);
            });
    }



    //---------Validations and Clear wing--------------------------
    showbtnvalidation(type) {
        debugger;
        // this.CommisionPaymentErrors = {};
        let pagentid = <FormGroup>this.CommissionPaymentForm['controls']['pagentid'];
        if (type == 'GET') {

            pagentid.setValidators(Validators.required)
        }
        else {
            pagentid.clearValidators()
        }
        // let pCommissionpaymentDate = <FormGroup>this.CommissionPaymentForm['controls']['pCommissionpaymentDate'];


        // pCommissionpaymentDate.setValidators(Validators.required)


        //pCommissionpaymentDate.clearValidators()
        //pagentid.clearValidators()

        //pCommissionpaymentDate.updateValueAndValidity();
        pagentid.updateValueAndValidity();






    }
    upiName_Change($event: any): void {

        debugger
        const districtid = $event.target.value;

        if (districtid && districtid != '') {
            const districtname = $event.target.options[$event.target.selectedIndex].text;
            let data1 = this.upinameslist.filter(x => x.pUpiname == districtname);
            this.upiidlist = data1;


        }
        else {
            this.upiidlist = [];
            this.CommissionPaymentForm['controls']['pUpiid'].setValue('');
            //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
        }
        this.GetValidationByControl(this.CommissionPaymentForm, 'pUpiname', true);
    }
    upid_change() {
        this.GetValidationByControl(this.CommissionPaymentForm, 'pUpiid', true);

    }
    modeofpaymentvalidation(type) {
        debugger
        this.CommisionPaymentErrors = {}
        let pbankid = <FormGroup>this.CommissionPaymentForm['controls']['pbankid'];
        let pbranchname = <FormGroup>this.CommissionPaymentForm['controls']['pbranchname'];
        let pchequeno = <FormGroup>this.CommissionPaymentForm['controls']['pchequeno'];
        // let pbankidonline = <FormGroup>this.InterestPaymentForm['controls']['pbankid'];
        let ptypeofpayment = <FormGroup>this.CommissionPaymentForm['controls']['ptypeofpayment'];
        const ptypeofpayment1 = <FormGroup>this.CommissionPaymentForm['controls']['ptypeofpayment'];

        let preferencenoonline = <FormGroup>this.CommissionPaymentForm['controls']['preferencenoonline'];
        let pUpiname = <FormGroup>this.CommissionPaymentForm['controls']['pUpiname'];
        let pUpiid = <FormGroup>this.CommissionPaymentForm['controls']['pUpiid'];
        let pdebitcard = <FormGroup>this.CommissionPaymentForm['controls']['pdebitcard'];
        let pfinancialservice = <FormGroup>this.CommissionPaymentForm['controls']['pfinancialservice'];
        let preferencenodcard = <FormGroup>this.CommissionPaymentForm['controls']['preferencenodcard'];
        let pTotalpaymentamount = <FormGroup>this.CommissionPaymentForm['controls']['pTotalpaymentamount'];

        pTotalpaymentamount.setValidators(Validators.required)

        if (type == 'CHEQUE') {
            pbankid.setValidators(Validators.required)
            pbranchname.setValidators(Validators.required)
            pchequeno.setValidators(Validators.required)

            ptypeofpayment.clearValidators()
            preferencenoonline.clearValidators()

            pdebitcard.clearValidators()
            pfinancialservice.clearValidators()
            preferencenodcard.clearValidators()

        }
        else if (type == 'ONLINE') {
            pbankid.setValidators(Validators.required)
            ptypeofpayment.setValidators(Validators.required)
            preferencenoonline.setValidators(Validators.required)


            if (this.showupi) {
                pUpiname.setValidators(Validators.required);
                pUpiid.setValidators(Validators.required);
            }
            else {
                pUpiname.clearValidators();
                pUpiid.clearValidators();
            }

            pbranchname.clearValidators()
            pchequeno.clearValidators()

            pdebitcard.clearValidators()
            pfinancialservice.clearValidators()
            preferencenodcard.clearValidators()

        }
        else if (type == 'DEBIT CARD') {
            pdebitcard.setValidators(Validators.required)
            pfinancialservice.setValidators(Validators.required)
            preferencenodcard.setValidators(Validators.required)

            pbankid.clearValidators()
            pbranchname.clearValidators()
            pchequeno.clearValidators()

            ptypeofpayment.clearValidators()
            preferencenoonline.clearValidators()

        }

        pbankid.updateValueAndValidity()
        pbranchname.updateValueAndValidity()
        pchequeno.updateValueAndValidity()

        pbankid.updateValueAndValidity()
        ptypeofpayment.updateValueAndValidity()
        preferencenoonline.updateValueAndValidity()

        pdebitcard.updateValueAndValidity()
        pfinancialservice.updateValueAndValidity()
        preferencenodcard.updateValueAndValidity()



    }
    clearmodeofpaymentDetails() {
        debugger
        this.chequenumberslist = [];
        this.CommissionPaymentForm['controls']['pbankid'].setValue('');
        this.CommissionPaymentForm['controls']['pbankname'].setValue('');
        this.CommissionPaymentForm['controls']['pbranchname'].setValue('');
        this.CommissionPaymentForm['controls']['pchequeno'].setValue('');

        this.CommissionPaymentForm['controls']['ptypeofpayment'].setValue('');
        this.CommissionPaymentForm['controls']['preferencenoonline'].setValue('');
        this.CommissionPaymentForm['controls']['pUpiname'].setValue('');

        this.CommissionPaymentForm['controls']['pUpiid'].setValue('');
        this.CommissionPaymentForm['controls']['pdebitcard'].setValue('');
        this.CommissionPaymentForm['controls']['pfinancialservice'].setValue('');
        this.CommissionPaymentForm['controls']['preferencenodcard'].setValue('');


        this.CommisionPaymentErrors = {};

    }
    clearCommisionPayment() {

        try {
            this.agentcontactlist = [];
            this.commissionpaymentlist = [];
            this.CommissionPaymentForm.reset();
            this.CommissionPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
            this.CommissionPaymentForm['controls']['pModeofreceipt'].setValue('BANK');
            this.clearmodeofpaymentDetails();
            this.clearCommisionPaymentDetails();
            let date = new Date();
            this.CommissionPaymentForm['controls']['pCommissionpaymentDate'].setValue(date);
            this.CommissionPaymentForm['controls']['pTotalpaymentamount'].setValue('');
            this.CommisionPaymentErrors = {};
            this.pcommissionpaymentlist = {};
            this.CommissionPaymentForm.controls.pModeofreceipt.setValue("BANK");
            this.Paymenttype();
            this.disablesavebutton = false;
            this.savebutton = "Save";
            this.transofPaymentChange('CHEQUE');
            this.commissionpaymentlist = []
            this.total = 0;
            this.pagentname = ['']
            this.SavingsMemberBalance = 0;
            this.SavingsAccounts = []

        } catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    clearCommisionPaymentDetails() {

        const formControl = <FormGroup>this.CommissionPaymentForm['controls']['pcommissionpaymentlist'];
        formControl.reset();

        this.CommissionPaymentForm['controls']['pcommissionpaymentlist']['controls']['pMembername'].setValue(false);
        this.CommissionPaymentForm['controls']['pcommissionpaymentlist']['controls']['pSchemeAccountno'].setValue(false);
        this.CommissionPaymentForm['controls']['pcommissionpaymentlist']['controls']['pCommissionamount'].setValue(false);
        this.CommissionPaymentForm['controls']['pcommissionpaymentlist']['controls']['pTdsamount'].setValue(null);
        this.CommissionPaymentForm['controls']['pcommissionpaymentlist']['controls']['ptotalamount'].setValue(null);

        this.formValidationMessages = {};

    }

    //---------End Validations--------------------------
    //---------Change Events wing
    bankName_Change($event: any): void {
        debugger;
        const pbankid = $event.target.value;
        this.upinameslist = [];
        this.chequenumberslist = [];
        //this.CommissionPaymentForm['controls']['pchequeno'].setValue('');
        //this.CommissionPaymentForm['controls']['pUpiname'].setValue('');
        //this.CommissionPaymentForm['controls']['pUpiid'].setValue('');
        if (pbankid && pbankid != '' && pbankid != 'Select') {
            const bankname = $event.target.options[$event.target.selectedIndex].text;
            this.GetBankDetailsbyId(pbankid);
            this.getBankBranchName(pbankid);
            this.CommissionPaymentForm['controls']['pbankname'].setValue(bankname);

        }
        else {

            //this.CommissionPaymentForm['controls']['pbankname'].setValue('');
        }

        //this.GetValidationByControl(this.CommissionPaymentForm, 'pbankname', true);
        //this.formValidationMessages['pchequeno'] = '';
    }
    chequenumber_Change() {

        this.GetValidationByControl(this.CommissionPaymentForm, 'pchequeno', true);
    }
    debitCard_Change() {

        let data = this.getbankname(this.CommissionPaymentForm.controls.pdebitcard.value);
        this.CommissionPaymentForm['controls']['pbankname'].setValue(data.pbankname);
        this.CommissionPaymentForm['controls']['pbankid'].setValue(data.pbankid);
        this.CommissionPaymentForm['controls']['pfinancialservice'].setValue(data.pbankname);
        this.GetValidationByControl(this.CommissionPaymentForm, 'pCardNumber', true);
    }
    getBankBranchName(pbankid) {

        let data = this.banklist.filter(function (bank) {
            return bank.pbankid == pbankid;
        });
        this.CommissionPaymentForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    }
    getbankname(cardnumber) {
        try {
            let data = this.debitcardlist.filter(function (debit) {
                return debit.pCardNumber == cardnumber;
            })[0];
            this.getBankBranchName(data.pbankid);
            return data;
        } catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    gridUserSelectionChange(gridUser, selection) {
        debugger;
        // let selectedData = gridUser.data.data[selection.index];
        const selectedData = selection.selectedRows[0].dataItem;
        console.log(selectedData);
    }

    Paymenttype() {
        debugger;
           this.SavingsMemberBalance='';
            this.SavingAccountShowhide = true;
            this.CommissionPaymentForm['controls']['pbankid'].setValue(0);
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].setValue(0);
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].clearValidators();
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();

        if (this.CommissionPaymentForm.controls.pModeofreceipt.value == "CASH") {
              this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].setValue(0);
            this.CommissionPaymentForm['controls']['pbankid'].setValue(0);
            //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
            this.CommissionPaymentForm['controls']['ptranstype'].setValue('CASH');
            this.showModeofPayment = false;
            this.showtranstype = false;
            this.SavingAccountShowhide = false;

        }
        else if (this.CommissionPaymentForm.controls.pModeofreceipt.value == "BANK") {
              this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].setValue(0);
            this.CommissionPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
            this.showModeofPayment = true;
            this.showtranstype = true;
            this.SavingAccountShowhide = false;
        }
        else {
            this.CommissionPaymentForm['controls']['ptranstype'].setValue('ADJUSTMENT');
            this.showModeofPayment = false;
            this.showtranstype = false;
            this.SavingAccountShowhide = true;
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].setValue('');
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
            this.CommissionPaymentForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
        }

    }

    //---------End Change Events wing--------------------------



    back() {
        this.router.navigate(['/CommissionPaymentView']);
    }



    //--------------------END------------------------------------------------
}
