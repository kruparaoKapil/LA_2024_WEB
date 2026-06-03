import { Component, OnInit, ViewChild, ViewContainerRef, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe, JsonPipe } from '@angular/common'
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
    selector: 'app-generalreceipt-new',
    templateUrl: './generalreceipt-new.component.html',
    styles: []
})
export class GeneralreceiptNewComponent implements OnInit {
    showModeofPayment = false;
    GeneralReceiptForm: FormGroup;
    myDateValue: Date;
    bsValue = new Date();
    public submitted = false;
    dateCustomClasses: DatepickerDateCustomClasses[];
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public bankshowhide: boolean = false;
    public walletshowhide: boolean = false;
    public chequeshowhide: boolean = false;
    public onlineshowhide: boolean = false;
    public DebitShowhide: boolean = false;
    public creditShowhide: boolean = false;
    public disabled: boolean = true
    public banklist: any;
    public modeoftransactionslist: any;
    gst: boolean = true
    tds: boolean = true
    paymentlistcolumnwiselist: any
    public typeofpaymentlist: any;
    public ledgeraccountslist: any;
    public partylist: any;
    public gstlist: any;
    public debitcardlist: any;
    public tdssectionlist: any;
    public statelist: any;
    public showgst = true;
    public showtds = true;
    public chequenumberslist: any;
    public upinameslist: any;
    public Modeofpayment: any;
    public Transtype: any;
    public DepositBankDisable: boolean = false;
    //public StateGSTDisable: boolean = false;
    public SwitchDisable: boolean = true;
    public subledgeraccountslist: any;
    public showigst = false;
    public showcgst = false;
    public showsgst = false; //
    public showutgst = false;
    public showgstno = false;
    public showgstamount = false;
    public showsubledger: boolean = true;
    public today: Date = new Date();
    public WalletBalance: number = 0;
    public cashBalance: number = 0;
    public bankBalance: number = 0;
    public paymentslist: any = 0;
    public partyjournalentrylist: any;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public disablesavebutton = false;
    public savebutton = "Save";
    public selectableSettings: SelectableSettings;
    public bankbookBalance: any = '0' + 'Dr';
    public TempGSTtype: any = '';
    public TempModeofReceipt: any = '';
    public bankpassbookBalance: any = '0' + 'Dr';
    public ledgerBalance: any;
    public subledgerBalance: any;
    public partyBalance: any;
    public groups: GroupDescriptor[] = [{ field: 'accountname' }];
    public formValidationMessages: any;
    public gridView: DataResult;
    public showupi: boolean;
    public tdspercentagelist: any;
    public tdslist: any;
    public temporaryamount: number = 0;
    public imageResponse: any;
    public kycFileName: any;
    public kycFilePath: any;
    public data: any;
    public TempgstshowInclude: boolean = true;
    public TempgstshowExclude: boolean = true;
    public tempState: any = '';
    public tempgstno: any = '';
    disabletransactiondate = false;
    public Bankbuttondata: any = [{ id: 1, type: "Cheque", chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false }, { id: 2, type: "Online", chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false }, { id: 3, type: "Debit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false }, { id: 4, type: "Credit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }];

    public Paymentbuttondata: any = [{ id: 1, type: "Cash", bankshowhide: false, walletshowhide: false }, { id: 2, type: "Bank", bankshowhide: true, walletshowhide: false }, { id: 3, type: "Wallet", bankshowhide: false, walletshowhide: true }];
    public JSONdataItem: any = [];


    constructor(private _CommonService: CommonService, public datepipe: DatePipe, private _FormBuilder: FormBuilder, private _Accountservice: AccountingTransactionsService, private _commonService: CommonService, private _routes: Router) {
        this.dpConfig.containerClass = 'theme-dark-blue';
        this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
        // this.dpConfig.minDate = new Date();
        this.dpConfig.showWeekNumbers = false;
        this.dpConfig1.containerClass = 'theme-dark-blue';
        this.dpConfig1.dateInputFormat = 'DD/MM/YYYY';
        this.dpConfig1.maxDate = new Date();
        this.dpConfig1.showWeekNumbers = false;
    }
    trackByFn(index, item) {
        return index; // or item.id
    }
    ngOnInit() {
      debugger
        if (this._commonService.comapnydetails != null)
            this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
        this.paymentlistcolumnwiselist = {};
        this.formValidationMessages = {};
        this.paymentslist = [];
        this.GeneralReceiptForm = this._FormBuilder.group({
            preceiptid: [''],
            preceiptdate: [''],
            pmodofreceipt: ['BANK'],
            ptotalreceivedamount: [0],
            pnarration: ['', Validators.required],
            ppartyname: [''],
            ppartyid: [''],
            pistdsapplicable: [false],
            pTdsSection: [''],
            pTdsPercentage: [0],
            ptdsamount: [0],
            ptdscalculationtype: [''],
            ppartypannumber: [''],
            pbankname: [''],
            pbranchname: [''],
            ptranstype: [''],
            ptypeofpayment: [''],
            pChequenumber: [''],
            pchequedate: [this.today],
            pbankid: [0],
            pCardNumber: [''],
            pdepositbankid: [0],
            pdepositbankname: [''],
            pRecordid: [0],
            pUpiname: [''],
            pUpiid: [''],
            pCreatedby: [this._commonService.pCreatedby],
            pModifiedby: [0],
            pStatusid: [''],
            pStatusname: [this._commonService.pStatusname],
            pEffectfromdate: [''],
            pEffecttodate: [''],
            ptypeofoperation: [this._commonService.ptypeofoperation],
            ppartyreferenceid: [''],
            ppartyreftype: [''],
            preceiptslist: this.preceiptslist(),
            pFilename: [''],
            pFilepath: [''],
            pFileformat: [''],

            pDocStorePath: ['']
        });
        let date = new Date();
        this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
        this.getLoadData()
        this.isgstapplicableChange();
        this.istdsapplicableChange();
        this.BlurEventAllControll(this.GeneralReceiptForm);

        this.Paymenttype('Bank');
    }

    preceiptslist(): FormGroup {
        return this._FormBuilder.group({
            isGstapplicable: [false],
            pState: [''],
            pStateId: [''],
            pgstpercentage: [0],
            pamount: [0],
            pgsttype: [''],
            pgstcalculationtype: [''],

            pigstamount: [0],
            pcgstamount: [0],
            psgstamount: [0],
            putgstamount: [0],


            psubledgerid: [null],
            psubledgername: [''],
            pledgerid: [null, Validators.required],

            pledgername: ['', Validators.required],
            pCreatedby: [this._commonService.pCreatedby],
            pStatusname: [this._commonService.pStatusname],
            pModifiedby: [0],
            pStatusid: [''],
            pEffectfromdate: [''],
            pEffecttodate: [''],
            ptypeofoperation: [this._commonService.ptypeofoperation],
            pgstamount: [''],
            pgstno: [''],
            pigstpercentage: [''],
            pcgstpercentage: [''],
            psgstpercentage: [''],
            putgstpercentage: [''],
            pactualpaidamount: ['', Validators.required],
            ptotalamount: ['']
        })
    }

    public groupChange(groups: GroupDescriptor[]): void {
        this.groups = groups;
        this.loadgrid();
    }
    private loadgrid(): void {
        this.gridView = process(this.partyjournalentrylist, { group: this.groups });
    }
    gst_Change($event: any): void {

        const gstpercentage = $event.target.value;
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pigstpercentage'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pcgstpercentage'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psgstpercentage'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['putgstpercentage'].setValue('');
        if (gstpercentage && gstpercentage != '') {
            this.getgstPercentage(gstpercentage);

            this.formValidationMessages["pgstpercentage"] = "";
        }
    }

    getgstPercentage(gstpercentage) {

        let data = this.gstlist.filter(function (tds) {
            return tds.pgstpercentage == gstpercentage;
        });
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
        this.claculategsttdsamounts();
    }

    partyName_Change($event: any): void {
        this.gst = false;
        this.tds = false
        this.tempState = '';
        this.tempgstno = '';
        this.TempGSTtype = '';
        this.TempModeofReceipt = '';
        this.TempgstshowInclude = true;
        this.TempgstshowExclude = true;
        this.showtds = false;
        let ppartyid;
        if ($event != undefined) {
            ppartyid = $event.ppartyid;
        }
        this.statelist = [];
        this.tdssectionlist = [];
        this.tdspercentagelist = [];
        this.clearPaymentDetails();
        this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
        this.paymentslist = [];
        this.partyjournalentrylist = [];
        this.gridView = process(this.partyjournalentrylist, { group: this.groups });
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue('');
        // this.GeneralReceiptForm['controls']['pTdsSection'].setValue('');
        this.GeneralReceiptForm.controls.pTdsSection.setValue('')
        // this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        this.GeneralReceiptForm.controls.pTdsPercentage.setValue(0);
        this.GeneralReceiptForm.controls.ppartyreferenceid.setValue('');
        this.GeneralReceiptForm.controls.ppartyreftype.setValue('');
        this.GeneralReceiptForm.controls.ppartypannumber.setValue('');
        this.partyBalance = '0' + 'Dr';
        if (ppartyid && ppartyid != '') {
            const ledgername = $event.ppartyname;
            this.getPartyDetailsbyid(ppartyid);
            this.GeneralReceiptForm.controls.ppartyname.setValue(ledgername);
            //let data = (this.partylist.filter(x => x.ppartyid = ppartyid))[0];
            let emptydata = []
            this.partylist.filter(function (ReqData) {

                //if (ReqData.ppartyname == ledgername) {
                emptydata.push(ReqData);
                //}
            })
            this.data = emptydata;
            let arraydata = this.data
            // this.modeoftransactionslist.filter(function (Data) {
            //   if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
            this.GeneralReceiptForm.controls.ppartyreferenceid.setValue(arraydata[0].ppartyreferenceid);
            this.GeneralReceiptForm.controls.ppartyreftype.setValue(arraydata[0].ppartyreftype);
            this.GeneralReceiptForm.controls.ppartypannumber.setValue(arraydata[0].ppartypannumber);
        }
        else {
            this.setBalances('PARTY', 0);
            this.GeneralReceiptForm.controls.ppartyname.setValue('');
        }
    }

    getPartyDetailsbyid(ppartyid) {

        this._Accountservice.getPartyDetailsbyid(ppartyid).subscribe(json => {

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
                this.claculateTDSamount();
                this.setBalances('PARTY', json.accountbalance);
            }
        },
            (error) => {
                this._commonService.showErrorMessage(error);
            });
    }

    setBalances(balancetype, balanceamount) {

        let balancedetails;
        if (parseFloat(balanceamount) < 0) {
            balancedetails = this._commonService.currencyformat(Math.abs(balanceamount)) + ' Cr';
        }
        else if (parseFloat(balanceamount) >= 0) {
            balancedetails = this._commonService.currencyformat(balanceamount) + ' Dr';
        }
        // else {
        //   balancedetails = '';
        // }
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

    public Paymenttype(type) {
        debugger
        for (var n = 0; n < this.Paymentbuttondata.length; n++) {
            if (this.Paymentbuttondata[n].type === type) {
                // if(type == "BANK"){
                //     this.bankshowhide = true;
                // }
                this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
                this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
            }
        }
        this.GeneralReceiptForm.controls['pbankname'].setValue('');
        this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
        this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
        this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
        this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
        this.GeneralReceiptForm.controls['pbranchname'].setValue('');
        this.GeneralReceiptForm.controls['pCardNumber'].setValue('');
        if (type == 'Bank') {
            this.GeneralReceiptForm.controls.ptranstype.setValue('Cheque');
            this.Banktype('Cheque')
            this.Modeofpayment = type;
        }
        else {
            this.GeneralReceiptForm.controls.ptranstype.setValue('');
            let DepositBankNameControl = this.GeneralReceiptForm.controls['pdepositbankname']
            let BankControl = this.GeneralReceiptForm.controls['pbankname'];
            let ChequeControl = this.GeneralReceiptForm.controls['pChequenumber']
            let TypeofPAymentControl = this.GeneralReceiptForm.controls['ptypeofpayment'];
            let BranchControl = this.GeneralReceiptForm.controls['pbranchname'];
            let CardNumberControl = this.GeneralReceiptForm.controls['pCardNumber'];
            let ChequeDateControl = this.GeneralReceiptForm.controls['pchequedate']
            BankControl.clearValidators();
            ChequeControl.clearValidators();
            ChequeDateControl.clearValidators();
            DepositBankNameControl.clearValidators();
            TypeofPAymentControl.clearValidators();
            BranchControl.clearValidators();
            CardNumberControl.clearValidators();

            BankControl.updateValueAndValidity();
            ChequeControl.updateValueAndValidity();
            DepositBankNameControl.updateValueAndValidity();
            TypeofPAymentControl.updateValueAndValidity();
            BranchControl.updateValueAndValidity();
            CardNumberControl.updateValueAndValidity();
            ChequeDateControl.updateValueAndValidity();
            this.chequeshowhide = false;
            this.onlineshowhide = false;
            this.creditShowhide = false;
            this.DebitShowhide = false;
            this.Modeofpayment = type;
            this.Transtype = '';
            this.DepositBankDisable = false;
            //this.StateGSTDisable = false;
            this.GeneralReceiptForm.controls.ptranstype.setValue('');
        }
        //this.GeneralReceiptForm.controls['pmodofreceipt'].updateValueAndValidity();
    }

    public Banktype(type) {
        this.validation(type);
        // this.setBalances('BANKBOOK', 0);
        // this.setBalances('PASSBOOK', 0);
        this.GeneralReceiptForm.controls['pbankname'].setValue('');
        this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
        this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
        this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
        this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
        this.GeneralReceiptForm.controls['pbranchname'].setValue('');
        this.GeneralReceiptForm.controls['pCardNumber'].setValue('');

        this.Transtype = type;
        for (var n = 0; n < this.Bankbuttondata.length; n++) {
            if (this.Bankbuttondata[n].type === type) {

                this.chequeshowhide = this.Bankbuttondata[n].chequeshowhide;
                this.onlineshowhide = this.Bankbuttondata[n].onlineshowhide;
                this.creditShowhide = this.Bankbuttondata[n].creditShowhide;
                this.DebitShowhide = this.Bankbuttondata[n].DebitShowhide;
            }
        }

        // for (var i = 0; i > this.ValidationOperation.length; i++) {
        //   if (type == this.ValidationOperation.type) {
        //     if (this.ValidationOperation.Condition == true) {
        //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].setValidators([Validators.required]);
        //     }
        //     else {
        //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
        //     }
        //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
        //   }
        //   else {
        //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
        //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
        //   }
        // }
        this.GeneralReceiptForm.controls.pdepositbankid.setValue('');
        this.GeneralReceiptForm.controls.pdepositbankname.setValue('');
        if (type == 'Online') {
            this.GeneralReceiptForm.controls.ptypeofpayment.setValue('');
            this.DepositBankDisable = true
        }
        else {
            this.GeneralReceiptForm.controls.ptypeofpayment.setValue(type);
            if (type == 'Debit Card' || type == 'Credit Card') {

                let DepositBankDisable
                let Modeofpayment = this.GeneralReceiptForm.controls.pmodofreceipt.value.toUpperCase();
                let trantype = this.Transtype.toUpperCase();
                type = type.toUpperCase();
                this.modeoftransactionslist.filter(function (Data) {
                    if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
                        if (Data.pchqonhandstatus == 'Y') {
                            DepositBankDisable = true  //Enable
                        }
                        else if (Data.pchqonhandstatus == 'N') {
                            DepositBankDisable = false  //Disable
                        }
                    }
                })
                const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
                this.DepositBankDisable = DepositBankDisable
                if (this.DepositBankDisable == true) {
                    DepositBankIDControl.clearValidators();
                }
                else {
                    DepositBankIDControl.setValidators(Validators.required)
                }
                DepositBankIDControl.updateValueAndValidity();
            }
        }

        // if (this.GeneralReceiptForm.controls.ptypeofpayment.value == 'UPI') {
        //   this.showupi = true;
        // }
        // else {
        //   this.showupi = false;
        // }
        this.bankbookBalance = '0' + 'Dr';
        this.bankpassbookBalance = '0' + 'Dr';

    }

    validation(type) {


        this.formValidationMessages = {};
        let ChequeControl = this.GeneralReceiptForm.controls['pChequenumber']
        let ChequeDateControl = this.GeneralReceiptForm.controls['pchequedate'];
        let TypeofPaymentControl = this.GeneralReceiptForm.controls['ptypeofpayment']
        let BankControl = this.GeneralReceiptForm.controls['pbankname']
        let CardNumberControl = this.GeneralReceiptForm.controls['pCardNumber']
        //let BranchControl = this.GeneralReceiptForm.controls['pbranchname']
        let DepositBankNameControl = this.GeneralReceiptForm.controls['pdepositbankid'];
        DepositBankNameControl.clearValidators();
        ChequeControl.setValidators([Validators.required]);
        TypeofPaymentControl.setValidators([Validators.required]);
        if (type == 'Online' || type == 'Cheque') {
            ChequeDateControl.setValidators([Validators.required]);
            if (type = 'Online') {
                BankControl.setValidators([Validators.required]);
            }
            else {
                BankControl.clearValidators();
            }
            CardNumberControl.clearValidators();
        }
        else {
            ChequeDateControl.clearValidators();
            BankControl.clearValidators();
            CardNumberControl.setValidators([Validators.required]);
        }


        ChequeDateControl.updateValueAndValidity();
        ChequeControl.updateValueAndValidity();
        TypeofPaymentControl.updateValueAndValidity();
        BankControl.updateValueAndValidity();
        CardNumberControl.updateValueAndValidity();
        DepositBankNameControl.updateValueAndValidity();
        //this.BlurEventAllControll(this.GeneralReceiptForm)
    }

    typeofPaymentChange(args) {

        this.GetValidationByControl(this.GeneralReceiptForm, 'ptypeofpayment', true);
        let type = args.target.options[args.target.selectedIndex].text;
        // if(type != 'Select'){
        if (this.Transtype != '') {
            //console.log(this.modeoftransactionslist);
            //console.log(JSON.stringify(this.modeoftransactionslist))
            this.GeneralReceiptForm.controls.pdepositbankid.setValue('');
            this.GeneralReceiptForm.controls.pdepositbankname.setValue('');
            let DepositBankDisable
            let Modeofpayment = this.GeneralReceiptForm.controls.pmodofreceipt.value.toUpperCase();
            let trantype = this.Transtype.toUpperCase()
            this.modeoftransactionslist.filter(function (Data) {
                if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
                    if (Data.pchqonhandstatus == 'Y') {
                        DepositBankDisable = true
                    }
                    else if (Data.pchqonhandstatus == 'N') {
                        DepositBankDisable = false
                    }
                }
            })

            // "BANK"
            // ptranstype: "Online"
            // ptypeofoperation: null
            // ptypeofpayment: "Cheque"
            const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
            this.DepositBankDisable = DepositBankDisable
            if (this.DepositBankDisable == true) {
                DepositBankIDControl.clearValidators();
            }
            else {
                DepositBankIDControl.setValidators(Validators.required)
            }
            DepositBankIDControl.updateValueAndValidity();
        }
    }

    bankName_Change($event: any): void {

        const pbankid = $event.target.value;
        this.upinameslist = [];
        this.chequenumberslist = [];
        this.GeneralReceiptForm['controls']['pUpiname'].setValue('');
        this.GeneralReceiptForm['controls']['pUpiid'].setValue('');
        if (pbankid && pbankid != '') {
            const bankname = $event.target.options[$event.target.selectedIndex].text;
            this.GetBankDetailsbyId(pbankid);
            this.getBankBranchName(pbankid);
            this.GeneralReceiptForm['controls']['pbankname'].setValue(bankname);
        }
        else {
            this.GeneralReceiptForm['controls']['pbankname'].setValue('');
        }
    }
    getBankBranchName(pbankid) {
        let data = this.banklist.filter(function (bank) {
            return bank.pbankid == pbankid;
        });
        this.GeneralReceiptForm['controls']['pbranchname'].setValue(data[0].pbranchname);
        this.setBalances('BANKBOOK', data[0].pbankbalance);
        this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
    }

    GetBankDetailsbyId(pbankid) {

        this._Accountservice.GetReceiptsandPaymentsLoadingData('GENERAL RECEIPT').subscribe(json => {

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

    addvalidations(): boolean {
        this.formValidationMessages = {};
        let isValid = true;
        isValid = this.GetValidationByControl(this.GeneralReceiptForm, 'ppartyid', isValid);
        if (isValid) {
            let verifyamount = this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].value;
            if (verifyamount == 0) {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].setValue('')
            }
            const formControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'];
            isValid = this.checkValidations(formControl, isValid);

            if (isValid) {
                this.BlurEventAllControll(formControl);
                let ledgerid = formControl.controls.pledgerid.value;
                let subledgerid = formControl.controls.psubledgerid.value;
                let griddata = this.paymentslist;
                let count = 0;
                for (let i = 0; i < griddata.length; i++) {
                    if (griddata[i].pledgerid == ledgerid && griddata[i].psubledgerid == subledgerid) {
                        count = 1;
                        //alert("Ledger & Sub Ledger is already exists")
                        break;
                    }
                }
                if (count == 1) {
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    addPaymentDetails() {
        debugger;
        // const LedgerControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pledgerid'];
        const SubLedgerControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'];
        // const ActualAmountControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'];
        // LedgerControl.setValidators(Validators.required);
        // SubLedgerControl.setValidators(Validators.required);
        // ActualAmountControl.setValidators(Validators.required);
        //LedgerControl.updateValueAndValidity();
        // SubLedgerControl.updateValueAndValidity();
        // ActualAmountControl.updateValueAndValidity();

        if (this.addvalidations()) {

            const control = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'];
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pModifiedby'].setValue(this._commonService.pCreatedby);
            let tempamount = control.value.pamount;

            tempamount = parseFloat(tempamount.toString().replace(/,/g, ""));

            this.temporaryamount = this.temporaryamount + tempamount;
            let stateid = this.GeneralReceiptForm.get('preceiptslist').get('pStateId').value;
            //let gsteper = this.GeneralReceiptForm.get('preceiptslist').get('pgstpercentage').value;
            this.TempGSTtype = this.GeneralReceiptForm.get('preceiptslist').get('pgstcalculationtype').value
            this.TempModeofReceipt = this.GeneralReceiptForm.get('preceiptslist').get('isGstapplicable').value
            // if (gsteper == "" || gsteper == null)
            //     this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue(0);
            if (stateid == "" || stateid == null) {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'].setValue(0);
            }
            else {
                this.tempState = stateid;

                this.tempgstno = this.GeneralReceiptForm.get('preceiptslist').get('pgstno').value;
            }
            if (this.TempModeofReceipt == false) {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgsttype'].setValue('');
            }

            let gstpercentage = this.GeneralReceiptForm.get('preceiptslist').get('pgstpercentage').value;
            if (gstpercentage == "" || gstpercentage == null)
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue(0);


            //  let pamount = parseFloat(this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].value.toString().replace(/,/g, ""));
            // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].setValue(pamount);
            let abc = parseFloat(this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].value.toString().replace(/,/g, ""));
            if (this.GeneralReceiptForm.controls.pmodofreceipt.value == "CASH" && abc >= 200000) {
                this._commonService.showWarningMessage('Cash Dosenot Accept More Than 20,0000');
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].setValue('')
                return
            }
            this.paymentslist.push(control.value);
            this.claculateTDSamount();
            this.getpartyJournalEntryData();
            this.clearPaymentDetails();
            this.getPaymentListColumnWisetotals();
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue('');
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].setValue('');
            if (this.TempModeofReceipt == false) {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['isGstapplicable'].setValue(false);
            }

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue('');
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pigstamount'].setValue(0);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pcgstamount'].setValue(0);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psgstamount'].setValue(0);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['putgstamount'].setValue(0);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStatusname'].setValue(this._commonService.pStatusname);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['ptypeofoperation'].setValue(this._commonService.ptypeofoperation);
            //   LedgerControl.clearValidators();
            SubLedgerControl.clearValidators();
            // ActualAmountControl.clearValidators();
            // LedgerControl.updateValueAndValidity();
            // SubLedgerControl.updateValueAndValidity();
            // ActualAmountControl.updateValueAndValidity();
            this.formValidationMessages = {};
        }

    }
    getPaymentListColumnWisetotals() {
        let totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['ptotalamount'] = this._commonService.currencyformat(totalamount.toFixed(2));

        totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['pamount'] = this._commonService.currencyformat(totalamount.toFixed(2));


        totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pgstamount).replace(/,/g, "")), 0);
        this.paymentlistcolumnwiselist['pgstamount'] = this._commonService.currencyformat(totalamount);

        // totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
        // this.paymentlistcolumnwiselist['ptdsamount'] = this._commonService.currencyformat(totalamount);
    }
    clearPaymentDetails() {

        const formControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'];
        formControl.reset();
        this.showsubledger = true;
        this.showgstno = false;

        //this.GeneralReceiptForm['controls']['isGstapplicable'].setValue(false);
        if (this.TempModeofReceipt != '') {
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['isGstapplicable'].setValue(this.TempModeofReceipt);
            //this.SwitchDisable == true
            // document.getElementById("isGstapplicable").disabled = true;
        } else {
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['isGstapplicable'].setValue(false);
            //this.SwitchDisable == false
            //document.getElementById("isGstapplicable").disabled = false;
        }

        //this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);

        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pledgerid'].setValue(null);
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'].setValue(null);

        // this.GeneralReceiptForm.controls.ppartyid.setValue(0);

        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue('');
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStatusname'].setValue(this._commonService.pStatusname);
        this.isgstapplicableChange();
        this.formValidationMessages = {};
        this.subledgeraccountslist = [];
        this.ledgerBalance = '0' + 'Dr';
        this.subledgerBalance = '0' + 'Dr';
    }

    // clearPaymentVoucher() {
    //   try {
    //     this.paymentslist = [];
    //     this.GeneralReceiptForm.reset();
    //     //this.cleartranstypeDetails();
    //     this.clearPaymentDetails();
    //     this.GeneralReceiptForm['controls']['pmodofreceipt'].setValue('CASH');
    //     this.Paymenttype('CASH');

    //     let date = new Date();
    //     this.GeneralReceiptForm['controls']['ppaymentdate'].setValue(date);
    //     this.formValidationMessages = {};
    //this.paymentlistcolumnwiselist = {};
    //     this.cashBalance = 0;
    //     this.bankBalance = 0;
    //     this.bankbookBalance = '0' + ' Dr';;
    //     this.bankpassbookBalance = '0' + ' Dr';;
    //     this.ledgerBalance = '0';
    //     this.subledgerBalance = '0';
    //     this.partyBalance = '0';
    //     this.partyjournalentrylist = [];
    //   } catch (e) {
    //     this._commonService.showErrorMessage(e);
    //   }
    // }

    validatesaveGeneralReceipt(): boolean {

        let isValid: boolean = true;

        if (isValid) {
            try {
                isValid = this.checkValidations(this.GeneralReceiptForm, isValid);
                if (this.paymentslist.length == 0) {
                    //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
                    isValid = false;
                }
            } catch (e) {
                this._commonService.showErrorMessage(e);
            }
        }
        return isValid;
    }

    saveGenerealReceipt() {
        debugger;

        if(this.paymentslist.length<=0){
            this._commonService.showWarningMessage('Add Atleast One Item to Grid.');
            return;
          }

        this.paymentslist.length

        this.disablesavebutton = true;
        this.savebutton = 'Processing';
        if (this.validatesaveGeneralReceipt()) {


            let GstNo = this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].value;
            if (GstNo == "" || GstNo == null)
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].setValue(0);
            let bankid = this.GeneralReceiptForm.controls.pdepositbankid.value;
            if (bankid == "" || bankid == null)
                this.GeneralReceiptForm['controls']['pdepositbankid'].setValue(0);
            let TDS = this.GeneralReceiptForm.controls.pTdsPercentage.value;
            if (TDS == "" || TDS == null)
                this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue(0);
            let totalamount
            if (this.GeneralReceiptForm['controls']['ptdscalculationtype'].value == 'EXCLUDE') {
                let tdsamount = parseFloat((this.GeneralReceiptForm['controls']['ptdsamount'].value).replace(/,/g, ""));
                totalamount = +parseFloat((this.paymentlistcolumnwiselist.ptotalamount).replace(/,/g, "")) + +tdsamount

            } else {
                totalamount = parseFloat((this.paymentlistcolumnwiselist.ptotalamount).replace(/,/g, ""))
            }
            this.GeneralReceiptForm['controls']['ptotalreceivedamount'].setValue(totalamount);
            let Partyidd = this.GeneralReceiptForm.controls.ppartyid.value;
            if (isNullOrEmptyString(Partyidd)) {
                this.GeneralReceiptForm.controls.ppartyid.setValue(0);
            }

            //paymentlistcolumnwiselist.ptotalamount
            let newdata = { preceiptslist: this.paymentslist };
            if (this.GeneralReceiptForm.value.ptypeofpayment == 'Debit Card' || this.GeneralReceiptForm.value.ptypeofpayment == 'Credit Card') {
                this.GeneralReceiptForm.value.pchequedate = this.GeneralReceiptForm.value.preceiptdate;
            }

            let GeneralVoucherdata = Object.assign(this.GeneralReceiptForm.value, newdata);
            let data = JSON.stringify(GeneralVoucherdata);
            console.log("dta of general receipt", data);


            this._Accountservice.saveGeneralReceipt(data).subscribe(res => {
                if (res) {
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                    this.JSONdataItem = res;
                    this.ClearGenerealReceipt();
                    this._commonService.showInfoMessage("Saved sucessfully");
                    let value = 'General Receipt'
                    this._commonService._setReportLableName(value);
                    this._routes.navigate(['/GeneralreceiptView'])
                    let receipt = this.JSONdataItem.pReceiptId;
                    // this._routes.navigate(['/GeneralReceiptReports', receipt]);
                    window.open('/#/GeneralReceiptReports?id=' + btoa(receipt + ',' + 'General Receipt'));

                    this.JSONdataItem = [];
                }
            },
                (error) => {
                    //this.isLoading = false;
                    this._commonService.showErrorMessage(error);
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                });
        }
        else {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
        }

    }

    getpartyJournalEntryData() {

        try {

            let dataobject;
            let journalentryamount;
            let tdsjournalentrylist = [];
            let ledgerdata = this.paymentslist.map(item => item.pledgername)
                .filter((value, index, self) => self.indexOf(value) === index)

            let tdssectionwisedata;

            this.partyjournalentrylist = [];
            let index = 1;
            for (let i = 0; i < ledgerdata.length; i++) {

                journalentryamount = this.paymentslist
                //   .filter(c => c.pledgername === ledgerdata[i]).reduce((sum, c) => (sum + parseFloat((c.pamount).replace(/,/g, "")) + parseFloat((c.ptdsamount).replace(/,/g, ""))), 0);'
                journalentryamount = this.paymentslist
                    .filter(c => c.pledgername === ledgerdata[i]).reduce((sum, c) => (sum + parseFloat((c.pamount).replace(/,/g, ""))), 0);
                dataobject = { type: 'General Receipt', accountname: ledgerdata[i], debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                this.partyjournalentrylist.push(dataobject);

                let tdsdata = this.paymentslist.filter(c => c.pledgername === ledgerdata[i]);
                tdssectionwisedata = tdsdata.map(item => item.pTdsSection)
                    .filter((value, index, self) => self.indexOf(value) === index)

                // for (let j = 0; j < tdssectionwisedata.length; j++) {
                //   journalentryamount = tdsdata
                //     .filter(c => c.pTdsSection === tdssectionwisedata[j]).reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
                //   dataobject = { type: 'Journal Voucher' + index, accountname: 'TDS-' + tdssectionwisedata[j] + ' RECIVABLE', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                //   tdsjournalentrylist.push(dataobject);
                // }

                //journalentryamount = tdsdata.reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
                // if (journalentryamount > 0) {
                //   dataobject = { type: 'Journal Voucher' + index, accountname: ledgerdata[i], debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount) }
                //   tdsjournalentrylist.push(dataobject);
                // }
                index = index + 1;
            }

            journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pigstamount).replace(/,/g, "")), 0);
            if (journalentryamount > 0) {
                dataobject = { type: 'General Receipt', accountname: 'C-IGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                this.partyjournalentrylist.push(dataobject);
            }
            journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pcgstamount).replace(/,/g, "")), 0);
            if (journalentryamount > 0) {
                dataobject = { type: 'General Receipt', accountname: 'C-CGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                this.partyjournalentrylist.push(dataobject);
            }
            journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.psgstamount).replace(/,/g, "")), 0);
            if (journalentryamount > 0) {
                dataobject = { type: 'General Receipt', accountname: 'C-SGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                this.partyjournalentrylist.push(dataobject);
            }
            journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.putgstamount).replace(/,/g, "")), 0);
            if (journalentryamount > 0) {
                dataobject = { type: 'General Receipt', accountname: 'C-UTGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
                this.partyjournalentrylist.push(dataobject);
            }

            // journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount).replace(/,/g, "")), 0);
            journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0);
            if (journalentryamount > 0) {
                this.GeneralReceiptForm['controls']['ptotalreceivedamount'].setValue(this._commonService.currencyformat(journalentryamount));
                if (this.GeneralReceiptForm.controls.pmodofreceipt.value == "CASH") {
                    dataobject = { type: 'General Receipt', accountname: 'CASH ON HAND', debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount) }
                }
                else {
                    dataobject = { type: 'General Receipt', accountname: 'BANK', debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount) }
                }
                this.partyjournalentrylist.push(dataobject);
            }
            // for (let i = 0; i < tdsjournalentrylist.length; i++) {
            //   this.partyjournalentrylist.push(tdsjournalentrylist[i]);
            // }

            this.loadgrid();
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }

    public removeHandler({ dataItem }) {

        let tempamount = dataItem.pamount
        tempamount = parseFloat(tempamount.toString().replace(/,/g, ""));
        this.temporaryamount = this.temporaryamount - +tempamount;
        const index: number = this.paymentslist.indexOf(dataItem);
        if (index !== -1) {
            this.paymentslist.splice(index, 1);
        }
        if (this.paymentslist.length == 0) {
            this.tempState = '';
            this.tempgstno = '';
            this.TempGSTtype = '';
            this.TempModeofReceipt = false;
            this.clearPaymentDetails()
        }
        this.getpartyJournalEntryData();
        this.getPaymentListColumnWisetotals()
    }

    public getLoadData() {
        debugger

        this._Accountservice.GetReceiptsandPaymentsLoadingData('GENERAL RECEIPT').subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.banklist = json.banklist;
                this.modeoftransactionslist = json.modeofTransactionslist;  //Bank
                this.typeofpaymentlist = this.gettypeofpaymentdata();
                this.ledgeraccountslist = json.accountslist;
                this._Accountservice.setFilterAccountHeads(this.ledgeraccountslist);
                this.ledgeraccountslist = this._Accountservice.getLedgerAccountsList();
                this.ledgeraccountslist = this.ledgeraccountslist.filter(item => {
                    if (!item.pledgername) return true;
                    let name = item.pledgername.toLowerCase();
                    return !(
                        name.includes('sa transfer') ||
                        name.includes('rsd-transfer')
                    );
                });
                // this.ledgeraccountslist = this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' && item.pledgername !== 'TDS-194H PAYABLE' && item.pledgername !== 'TDS-194J PAYABLE' && item.pledgername !== 'HS-SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE-HRB' && item.pledgername !== 'OS-SALE ADVANCE');
                this.partylist = json.partylist;
                this.gstlist = json.gstlist;
                this.debitcardlist = json.bankdebitcardslist;
                this.setBalances('CASH', json.cashbalance);
                this.setBalances('BANK', json.bankbalance);
            }
        },
            (error) => {
                this._commonService.showErrorMessage(error);
            });
    }

    public gettypeofpaymentdata(): any {

        let data = this.modeoftransactionslist.filter(function (payment) {
            return payment.ptranstype != payment.ptypeofpayment;
        });
        return data;
    }

    tdsSection_Change($event: any): void {

        const pTdsSection = $event.target.value;
        this.tdspercentagelist = [];
        //this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        if (pTdsSection && pTdsSection != '') {

            this.gettdsPercentage(pTdsSection);

        }
        this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsSection', true);
    }
    gettdsPercentage(pTdsSection) {

        this.tdspercentagelist = this.tdslist.filter(function (tds) {
            return tds.pTdsSection == pTdsSection;
        });
        this.claculategsttdsamounts();
        this.claculateTDSamount();
    }
    isgstapplicableChange() {


        //let data = this.GeneralReceiptForm.controls.isGstapplicable.value
        let data = this.GeneralReceiptForm.get('preceiptslist').get('isGstapplicable').value;
        let gstControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'];
        let gstpercentageControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'];
        let stateControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'];
        let gstamountControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstamount'];
        if (this.TempGSTtype != '') {
            if (this.TempGSTtype == 'INCLUDE') {
                this.TempgstshowExclude = false;
                this.TempgstshowInclude = true;
            }
            else {


                this.TempgstshowExclude = true;
                this.TempgstshowInclude = false;
            }

            //this.StateGSTDisable = true;
            stateControl.setValue(this.tempState);
            gstControl.setValue(this.tempgstno)

            let data = this.GetStatedetailsbyId(this.tempState);

            this.showgstamount = true;
            this.showigst = false;
            this.showcgst = false;
            this.showsgst = false;
            this.showutgst = false;

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgsttype'].setValue(data.pgsttype);
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
            //this.StateGSTDisable = false;
            this.TempgstshowInclude = true;
            this.TempgstshowExclude = true;
        }
        if (data) {
            this.showgst = true;
            if (this.TempGSTtype == '') {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstcalculationtype'].setValue('INCLUDE')
            }
            else {
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstcalculationtype'].setValue(this.TempGSTtype)
            }

        }
        else {
            this.showgst = false;
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstcalculationtype'].setValue('')
        }
        this.claculategsttdsamounts();

        this.gstvalidation(data);
    }

    claculategsttdsamounts() {

        try {

            let paidamount = this.GeneralReceiptForm.get('preceiptslist').get('pactualpaidamount').value;
            if (isNullOrEmptyString(paidamount))
                paidamount = 0;
            else
                paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
            let actualpaidamount = paidamount;
            //let isgstapplicable = this.GeneralReceiptForm.controls.isGstapplicable.value;

            let isgstapplicable = this.GeneralReceiptForm.get('preceiptslist').get('isGstapplicable').value
            let gsttype = this.GeneralReceiptForm.get('preceiptslist').get('pgsttype').value;
            let gstcalculationtype = this.GeneralReceiptForm.get('preceiptslist').get('pgstcalculationtype').value;

            let igstpercentage = this.GeneralReceiptForm.get('preceiptslist').get('pigstpercentage').value;
            if (isNaN(igstpercentage))
                igstpercentage = 0;
            let cgstpercentage = this.GeneralReceiptForm.get('preceiptslist').get('pcgstpercentage').value;
            if (isNaN(cgstpercentage))
                cgstpercentage = 0;
            let sgstpercentage = this.GeneralReceiptForm.get('preceiptslist').get('psgstpercentage').value;
            if (isNaN(sgstpercentage))
                sgstpercentage = 0;
            let utgstpercentage = this.GeneralReceiptForm.get('preceiptslist').get('putgstpercentage').value;
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
                        cgstamount = parseFloat(((paidamount * cgstpercentage) / (100 + igstpercentage)).toFixed(2));
                        sgstamount = parseFloat(((paidamount * sgstpercentage) / (100 + igstpercentage)).toFixed(2));

                        actualpaidamount = paidamount - (cgstamount + sgstamount);
                    }
                    else if (gsttype == 'CGST,UTGST') {
                        cgstamount = parseFloat(((paidamount * cgstpercentage) / (100 + igstpercentage)).toFixed(2));
                        utgstamount = parseFloat(((paidamount * utgstpercentage) / (100 + igstpercentage)).toFixed(2));
                        actualpaidamount = paidamount - (cgstamount + utgstamount);
                    }
                }
                else if (gstcalculationtype == 'EXCLUDE') {
                    gstamount = Math.round((paidamount * igstpercentage) / (100));
                    if (gsttype == 'IGST') {
                        igstamount = Math.round((paidamount * igstpercentage) / (100));
                    }
                    else if (gsttype == 'CGST,SGST') {
                        cgstamount = parseFloat(((paidamount * cgstpercentage) / (100)).toFixed(2));
                        sgstamount = parseFloat(((paidamount * sgstpercentage) / (100)).toFixed(2));

                    }
                    else if (gsttype == 'CGST,UTGST') {
                        cgstamount = parseFloat(((paidamount * cgstpercentage) / (100)).toFixed(2));
                        utgstamount = parseFloat(((paidamount * utgstpercentage) / (100)).toFixed(2));
                    }
                    actualpaidamount = paidamount;
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
            gstamount = sgstamount + igstamount + cgstamount + utgstamount;
            totalamount = actualpaidamount + sgstamount + igstamount + cgstamount + utgstamount;
            if (isNaN(totalamount))
                totalamount = 0;

            if (actualpaidamount > 0)
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].setValue(this._commonService.currencyformat(actualpaidamount));
            else
                this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pamount'].setValue('');

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstamount'].setValue(this._commonService.currencyformat(gstamount));
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pigstamount'].setValue(this._commonService.currencyformat(igstamount));
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pcgstamount'].setValue(this._commonService.currencyformat(cgstamount));
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psgstamount'].setValue(this._commonService.currencyformat(sgstamount));
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['putgstamount'].setValue(this._commonService.currencyformat(utgstamount));

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['ptotalamount'].setValue(this._commonService.currencyformat(Math.round(totalamount)));

        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }

    claculateTDSamount() {
        debugger;
        let tdsamount = 0;
        let actualpaidamount = +this.temporaryamount;
        if (isNaN(tdsamount))
            tdsamount = 0;


        let tdscalculationtype = this.GeneralReceiptForm.controls.ptdscalculationtype.value
        let istdsapplicable = this.GeneralReceiptForm.controls.pistdsapplicable.value;
        let tdspercentage = parseFloat(this.GeneralReceiptForm.get('pTdsPercentage').value.toString().replace(/,/g, ""));

        if (isNaN(tdspercentage))
            tdspercentage = 0;


        if (istdsapplicable) {
            if (tdscalculationtype == 'INCLUDE') {
                tdsamount = Math.round((actualpaidamount * tdspercentage) / (100 + tdspercentage));
                actualpaidamount = actualpaidamount - tdsamount;

            }
            else if (tdscalculationtype == 'EXCLUDE') {
                tdsamount = Math.round((actualpaidamount * tdspercentage) / (100));

                actualpaidamount = actualpaidamount;
            }
        }
        else {
            this.GeneralReceiptForm.controls.pTdsSection.setValue('');
            this.GeneralReceiptForm.controls.pTdsPercentage.setValue(0);
            this.GeneralReceiptForm.controls.ptdsamount.setValue(0);
        }

        this.GeneralReceiptForm.controls.ptdsamount.setValue(this._commonService.currencyformat(tdsamount));
    }

    gsno_change() {
        //this.GetValidationByControl(this.GeneralReceiptForm, 'pgstno', true);
    }

    pamount_change() {

        // let paidamount = parseFloat(this.GeneralReceiptForm.get('preceiptslist').get('pamount').value.toString().replace(/,/g, ""));

        // if (isNaN(paidamount))
        //   paidamount = 0;

        // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].setValue(paidamount);

        this.claculategsttdsamounts();
    }

    state_change($event) {

        const pstateid = $event.target.value;
        //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue('');
        if (pstateid && pstateid != '') {

            this.formValidationMessages["pStateId"] = "";
            const statename = $event.target.options[$event.target.selectedIndex].text;
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue(statename);
            let gstnoControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'];

            let gstno = statename.split('-')[1];
            if (gstno) {
                this.showgstno = false;
                //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].clearValidators();
            }
            else {
                this.showgstno = true;
                //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].setValidators([Validators.required]);
            }
            //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].updateValueAndValidity();

            let data = this.GetStatedetailsbyId(pstateid);

            this.showgstamount = true;
            this.showigst = false;
            this.showcgst = false;
            this.showsgst = false;
            this.showutgst = false;

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgsttype'].setValue(data.pgsttype);
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

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue('');
        }
        this.claculategsttdsamounts();
        this.claculateTDSamount();
    }

    GetStatedetailsbyId(pstateid): any {
        return (this.statelist.filter(function (tds) {
            return tds.pStateId == pstateid;
        }))[0];
    }


    ledgerName_Change($event: any): void {


        let pledgerid
        if ($event != undefined) {
            pledgerid = $event.pledgerid;
        }
        this.subledgeraccountslist = [];
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'].setValue(null);
        this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgername'].setValue('');
        this.ledgerBalance = '';
        this.subledgerBalance = '';

        if (pledgerid && pledgerid != '') {

            const ledgername = $event.pledgername;

            let data = this.ledgeraccountslist.filter(function (ledger) {
                return ledger.pledgerid == pledgerid;
            })[0];
            this.setBalances('LEDGER', data.accountbalance);
            let subLedgerControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'];
            subLedgerControl.clearValidators();
            subLedgerControl.updateValueAndValidity();
            this.GetSubLedgerData(pledgerid);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pledgername'].setValue(ledgername);
        }
        else {

            this.setBalances('LEDGER', 0);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pledgername'].setValue('');
        }

    }

    subledger_Change($event) {
        let psubledgerid
        if ($event != undefined) {
            psubledgerid = $event.psubledgerid;
            this.formValidationMessages["psubledgerid"] = "";
        }
        else {
            let subLedgerControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'];
            subLedgerControl.clearValidators();
            subLedgerControl.updateValueAndValidity();

        }
        this.subledgerBalance = '';
        if (psubledgerid && psubledgerid != '') {
            const subledgername = $event.psubledgername;

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgername'].setValue(subledgername);
            let data = this.subledgeraccountslist.filter(function (ledger) {
                return ledger.psubledgerid == psubledgerid;
            })[0];
            this.setBalances('SUBLEDGER', data.accountbalance);

        }
        else {

            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgername'].setValue('');
            this.setBalances('SUBLEDGER', 0);
        }
        // this.GetValidationByControl(this.GeneralReceiptForm, 'psubledgername', true);
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
        //this.GetValidationByControl(this.GeneralReceiptForm, 'pUpiname', true);
    }
    upid_change() {
        //this.GetValidationByControl(this.GeneralReceiptForm, 'pUpiid', true);

    }
    GetSubLedgerData(pledgerid) {

        this._Accountservice.GetSubLedgerData(pledgerid).subscribe(json => {

            if (json != null) {

                this.subledgeraccountslist = json;

                let subLedgerControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'];
                if (this.subledgeraccountslist.length > 0) {
                    this.showsubledger = true;
                    subLedgerControl.setValidators(Validators.required);
                }
                else {
                    this.showsubledger = false;
                    subLedgerControl.clearValidators();
                    this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgerid'].setValue(pledgerid);

                    this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psubledgername'].setValue(this.GeneralReceiptForm.get('preceiptslist').get('pledgername').value);
                }
                subLedgerControl.updateValueAndValidity();
            }
        },
            (error) => {
                this._commonService.showErrorMessage(error);
            });
    }

    istdsapplicableChange() {
        let data = this.GeneralReceiptForm.get('pistdsapplicable').value;

        if (data) {
            this.showtds = true;
            this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('INCLUDE')
            this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        }
        else {
            this.showtds = false;
            this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('');
            this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        }
        this.claculateTDSamount();
        this.tdsvalidation(data);
    }

    tdsvalidation(data) {

        this.formValidationMessages = {};
        let TdsSectionControl = this.GeneralReceiptForm['controls']['pTdsSection'];
        let TdsPercentageControl = this.GeneralReceiptForm['controls']['pTdsPercentage'];
        if (data) {
            TdsSectionControl.setValidators([Validators.required]);
            TdsPercentageControl.setValidators([Validators.required]);
        }
        else {
            TdsSectionControl.clearValidators();
            TdsPercentageControl.clearValidators();
        }
        TdsSectionControl.updateValueAndValidity();
        TdsPercentageControl.updateValueAndValidity();
        //this.BlurEventAllControll(this.GeneralReceiptForm)
    }


    gstvalidation(data) {


        this.formValidationMessages = {};
        let gstpercentageControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'];
        let StateControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'];

        if (data) {
            StateControl.setValidators([Validators.required]);
            //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].setValidators([Validators.required]);
            gstpercentageControl.setValidators([Validators.required]);
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue('')
        }
        else {
            StateControl.clearValidators();
            //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].clearValidators();
            gstpercentageControl.clearValidators();
            this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstpercentage'].setValue('')
        }
        StateControl.updateValueAndValidity();

        gstpercentageControl.updateValueAndValidity();
        this.formValidationMessages = {};
    }

    tds_Change(): void {
        debugger
        if (this.GeneralReceiptForm['controls']['pTdsPercentage'].value != "") {
            this.formValidationMessages["pTdsPercentage"] = "";
        }
        // this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsPercentage', true);
        // this.GetValidationByControl(this.GeneralReceiptForm, 'ptdsamount', true);
        this.claculateTDSamount();
    }


    typeofDepositBank(args) {

        this.GetValidationByControl(this.GeneralReceiptForm, 'pdepositbankid', true);
        let type = args.target.options[args.target.selectedIndex].text;

        this.GeneralReceiptForm.controls.pdepositbankname.setValue(type)

        this.getBankBranchName(this.GeneralReceiptForm.controls.pdepositbankid.value);
    }


    ClearGenerealReceipt() {

        this.GeneralReceiptForm.controls.pmodofreceipt.setValue('BANK');
        this.Paymenttype('Bank');
        this.GeneralReceiptForm.controls.ppartyid.setValue(null);
        this.GeneralReceiptForm.controls.ppartyname.setValue('');
        this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
        this.istdsapplicableChange()
        this.paymentslist = [];
        this.partyjournalentrylist = [];
        this.tempState = '';
        this.tempgstno = '';
        this.TempGSTtype = '';
        this.partyBalance = '';
        this.TempModeofReceipt = false;
        this.clearPaymentDetails()
        this.GeneralReceiptForm['controls']['pnarration'].setValue('');
        this.temporaryamount = 0;
        this.GeneralReceiptForm['controls']['ptdsamount'].setValue('');
        let date = new Date();
        this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
        this.getpartyJournalEntryData();
        this.paymentlistcolumnwiselist = {};
        this.formValidationMessages = {};
        this.GeneralReceiptForm.controls.pFilename.setValue('');
        this.GeneralReceiptForm.controls.pFileformat.setValue('');
        this.GeneralReceiptForm.controls.pFilepath.setValue('');
        this.imageResponse = {
            name: '',
            fileType: "imageResponse",
            contentType: '',
            size: 0,

        };
    }


    //     pCardNumber: "5765889870980998"
    // pbankaccountnumber: null
    // pbankbalance: 0
    // pbankid: 117
    // pbankname: "SBI"
    // pbankpassbookbalance: 0
    // pbranchname: null
    // pdepositbankid: 0
    // pdepositbankname: null
    // pfrombrsdate: null
    // ptobrsdate: null


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
            if (!formcontrol)
                formcontrol = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'].get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    if (key != 'preceiptslist')
                        this.checkValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.formValidationMessages[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                let lablename;
                                lablename = (document.getElementById(key) as HTMLInputElement).title;
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
            // this.showErrorMessage(key);
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


    uploadAndProgress(event: any, files) {

        let file = event.target.files[0];
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
            this.kycFileName = data[1];
            this.imageResponse.name = data[1];
            this.kycFilePath = data[0];
            let Filepath = this.kycFileName.split(".");
            //console.log(Filepath[1])
            this.GeneralReceiptForm.controls.pFilename.setValue(this.kycFileName);
            this.GeneralReceiptForm.controls.pFileformat.setValue(Filepath[1]);
            this.GeneralReceiptForm.controls.pFilepath.setValue(this.kycFilePath);
        })
    }


    BankNameChange() {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pbankname', true);
    }

    ChequeNoChange() {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pChequenumber', true);
    }

    ChequeDateChange() {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pchequedate', true);
    }

    CardNoChange() {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pCardNumber', true);
    }



    //   let DepositBankNameControl = this.GeneralReceiptForm.controls['pdepositbankid'];

}
