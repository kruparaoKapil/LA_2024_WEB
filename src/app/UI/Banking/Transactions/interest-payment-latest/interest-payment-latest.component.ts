import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';

import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { DataBindingDirective, RowArgs } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
@Component({
  selector: 'app-interest-payment-latest',
  templateUrl: './interest-payment-latest.component.html',
  styles: []
})



export class InterestPaymentLatestComponent implements OnInit {
    @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

    InterestPaymentForm: FormGroup;
    public SavingAccountShowhide: boolean = false;
    showModeofPayment = false;
    showtranstype = false;
    showCheque: any;
    monthof: any;
    clickedRowItem: any;
    public total: number = 0;
    public today: Date = new Date();
    paymenttype = "";
    schemeid: any;
    companyname = "";
    branchname = "";
    typevalue: any;
    showOnline: any;
    showdebitcard: any;
    showupi: any;
    showCompany: any;
    chequenumberslist: any;
    formValidationMessages: any;
    upinameslist: any;
    upiidlist: any;
    intrestpaymentlist: any;
    disablesavebutton = false;
    savebutton = "Save";
    public allSelectedModels: any = []
    public SchemeDetails: any = []
    public BranchDetails: any = []
    public CompanyDetails: any = []
    public Showmembers: any = []
    public banklist: any[]
    public banklist1: any[]
    public debitcardlist: any[]
    public typeofpaymentlist: any[]
    InterestPaymentErrors: any
    intrestpaymentlistcolumnwiselist: any = []
    modeoftransactionslist: any;
    JSONdataItem: any = [];
    pintrestpaymentlist: any = [];
    public bankBalance: number = 0;
    public cashBalance: number = 0;

    public pageSize = 5;
    public skip = 0;
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public interestpaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    allRowsSelected: boolean;
    allStudentsSelected: boolean;

    public SavingsMemberBalance: any;
    disabletransactiondate = false;
    public minDate: Date;
    subLedgerAmount: any = [];
    selectedrow: any = [];
    selectedvalues: string = "";
    subLedgerBalanceList: any = [];
    loading: boolean = false;
    gridview: any = [];



    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService) {
        this.dpConfig.dateInputFormat = 'MM/YYYY'
        this.dpConfig.maxDate = new Date();
        this.dpConfig.minDate = this.minDate = new Date('2024-07-01T00:00:00+05:30');
        this.dpConfig.showWeekNumbers = false;

        this.interestpaymentdateConfig.dateInputFormat = "DD-MMM-YYYY";
        this.interestpaymentdateConfig.maxDate = new Date();
        this.interestpaymentdateConfig.showWeekNumbers = false;

        var allSelectedModels = [];

        this.allData = this.allData.bind(this);

    }


    public onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    }


    ngOnInit() {
        if (this._CommonService.comapnydetails != null)
            this.disabletransactiondate = this._CommonService.comapnydetails.pdatepickerenablestatus;
        this.InterestPaymentForm = this.FB.group({
            ppaymentid: [''],
            pModeofreceipt: ['BANK'],
            ptranstype: ['CHEQUE'],
            padjustmenttype: [''],
            ppaymentdate: [''],
            ptotalpaidamount: [''],
            pCreatedby: [this._CommonService.pCreatedby],

            pnarration: ['', Validators.required],
            pbankid: ['', Validators.required],
            pbankname: [''],
            pbranchname: ['', Validators.required],
            pchequeno: ['', Validators.required],
            pbankidonline: ['', Validators.required],
            ptypeofpayment: ['', Validators.required],
            preferencenoonline: ['', Validators.required],
            pUpiname: ['', Validators.required],
            pUpiid: ['', Validators.required],
            pdebitcard: ['', Validators.required],
            pfinancialservice: ['', Validators.required],
            preferencenodcard: ['', Validators.required],
            pschemename: ['', Validators.required],
            pSchemeId: ['', Validators.required],

            pcompanyname: ['', Validators.required],
            pbranchnamemain: ['', Validators.required],
            pMonthOf: ['', Validators.required],
            pmodofPayment: [''],

            pIscheck: [''],
            pTotalpaymentamount: ['', Validators.required],
            pInterestpaymentDate: [this.today],
            pInterestpaymentid: [''],

            pSavingsMemberAccountid: ['0'],
            pSavingsMemberBalance: [''],
            pintrestpaymentlist: this.addpinterestpaymentsslistcontrols(),

        })

        this.showCheque = true;
        this.showOnline = false;
        this.showdebitcard = false;
        this.showCompany = false;
        //this.GetCompanydetails();     
        this.GetSchemedetails();
        this.getLoadData();
        // this.IsFunctionRun();
        this.Paymenttype();
        this.InterestPaymentErrors = {};
        this.intrestpaymentlistcolumnwiselist = {};
        this.BlurEventAllControll(this.InterestPaymentForm);


    }


    addpinterestpaymentsslistcontrols(): FormGroup {
        return this.FB.group({
            pInterestpaymentid: [''],
            pMembername: [''],
            pFdaccountno: [''],
            pIntrestamount: [''],
            pTdsamount: [''],
            ptotalamount: [''],
            pdebitaccountid: [''],

        })
    }
    // IsFunctionRun() {
    //     debugger;
    //     this._LienEntryService.RunInterestPaymentFunction().subscribe(json => {
    //         debugger;

    //     },
    //         (error) => {

    //             this._CommonService.showErrorMessage(error);
    //         });
    // }
    getLoadData() {
        debugger;
        this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {
            debugger;
            //console.log(json)
            if (json != null) {

                console.log("cashbalance", json.cashbalance)
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
    //shiva shankar 11-07-2025
    //  selectAllStudentsChange($event: any, dataItem, rowIndex) {
    //     debugger;
    //     this.total = 0;
    //     if ($event.target.checked) {

    //         this.allStudentsSelected = true;
    //         for (let i = 0; i < this.Showmembers.length; i++) {
    //             this.Showmembers[i].add = true;
    //             this.total += (this.Showmembers[i].pIntrestamount);
    //             this.allSelectedModels.push(this.Showmembers[i]);
    //             console.log(this.allSelectedModels)
    //         }
    //         for (let i = 0; i < this.allSelectedModels.length; i++) {                
    //             this.selectedvalues+='@'+this.allSelectedModels[i].pdebitaccountid+'@,';               

    //           }
    //           this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
    //           this.getLedgerBalance(this.selectedvalues);
    //             console.log(this.allSelectedModels)
    //     } else {
    //         this.allStudentsSelected = false;
    //         for (let i = 0; i < this.Showmembers.length; i++) {
    //             this.Showmembers[i].add = false;
    //             this.total = 0;
    //             this.allSelectedModels.splice(rowIndex, 1);
    //             console.log(this.allSelectedModels)
    //         }

    //         for (let i = 0; i < this.allSelectedModels.length; i++) {                
    //             this.selectedvalues+='@'+this.allSelectedModels[i].pdebitaccountid+'@,';               

    //           }
    //           this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
    //           this.getLedgerBalance(this.selectedvalues);
    //             console.log(this.allSelectedModels)
    //     }
    //     this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);

    // }
    // selectAllStudentsChange($event: any, dataItem, rowIndex) {
    selectAllStudentsChange($event: any) {
        debugger;
        this.allSelectedModels = [];
        this.allStudentsSelected = $event.target.checked;
        this.selectedvalues = "";
        this.total = 0;

        if (!this.Showmembers || this.Showmembers.length === 0) {
            return;
        }

        this.Showmembers.forEach(item => {
            item.add = this.allStudentsSelected;
        });
        // (document.getElementById('onFilterKey') as HTMLInputElement).value = '';
        // this.onFilter('');
        if (this.allStudentsSelected) {
            this.total = this.Showmembers.reduce((sum, item) => sum + item.pIntrestamount, 0);
            this.Showmembers.forEach(item => {
                this.selectedvalues += '@' + item.pdebitaccountid + '@,';
            });
            this.selectedvalues = this.selectedvalues.toString().replace(/@/g, "'").slice(0, -1);
            this.getLedgerBalance(this.selectedvalues);
        }

        this.Showmembers.forEach(item => {
            if (item.add) {
                this.allSelectedModels = [...this.allSelectedModels, item];
            }
        });

        this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);
        
        // this.total = 0;
        // if ($event.target.checked) {

        // this.allStudentsSelected = true;
        // for (let i = 0; i < this.Showmembers.length; i++) {
        //     this.Showmembers[i].add = true;
        //     this.total += (this.Showmembers[i].pIntrestamount);
        //     this.allSelectedModels.push(this.Showmembers[i]);
        //     console.log(this.allSelectedModels)
        // }
        // for (let i = 0; i < this.allSelectedModels.length; i++) {                
        //     this.selectedvalues+='@'+this.allSelectedModels[i].pdebitaccountid+'@,';               

        //   }
        //this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
        // this.getLedgerBalance(this.selectedvalues);
        //         console.log(this.allSelectedModels);
        // } else {
        //     this.allStudentsSelected = false;
        //     for (let i = 0; i < this.Showmembers.length; i++) {
        //         this.Showmembers[i].add = false;
        //         this.total = 0;
        //         //this.allSelectedModels.splice(rowIndex, 1);
        //         console.log(this.allSelectedModels)
        //     }

        //     for (let i = 0; i < this.allSelectedModels.length; i++) {                
        //         this.selectedvalues+='@'+this.allSelectedModels[i].pdebitaccountid+'@,';               

        //       }
        //       this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
        //       this.getLedgerBalance(this.selectedvalues);
        //         console.log(this.allSelectedModels)
        // }
        // this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);

    }
    //shiva shankar 11-07-2025
    setBalances(balancetype, balanceamount) {
        debugger;
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


    Paymenttype() {
        debugger
        if (this.InterestPaymentForm.controls.pModeofreceipt.value == "CASH") {
            this.InterestPaymentForm['controls']['pbankid'].setValue(0);
            this.InterestPaymentForm['controls']['ptranstype'].setValue('CASH');
            //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
            this.showModeofPayment = false;
            this.showtranstype = false;
            this.SavingAccountShowhide = false;

        }
        else if (this.InterestPaymentForm.controls.pModeofreceipt.value == "BANK") {
            this.InterestPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
            this.showModeofPayment = true;
            this.showtranstype = true;
            this.SavingAccountShowhide = false;
        }
        else {
            this.InterestPaymentForm['controls']['ptranstype'].setValue('ADJUSTMENT');
            this.showModeofPayment = false;
            this.showtranstype = false;
            this.SavingAccountShowhide = true;
            this.InterestPaymentForm['controls']['pSavingsMemberAccountid'].setValue('');
            this.InterestPaymentForm['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
            this.InterestPaymentForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
        }

    }

    SavingsAccountsChanges(event) {
        debugger
        this.InterestPaymentForm.controls.pSavingsMemberAccountid.setValue(event.pSavingsMemberAccountid);
        this.SavingsMemberBalance = event.pSavingsMemberBalance;
        this.InterestPaymentForm['pSavingsMemberAccountid'] = '';
    }

    saveIntrestPayment() {
        debugger;
        let isValid = true;
        console.log(this.InterestPaymentForm.value);
        console.log("selected ids are : ",this.selectedvalues);
        if (this.checkValidations(this.InterestPaymentForm, isValid)) {

            let stopExecution = false;

            this.allSelectedModels.forEach(firstItem => {

                if (stopExecution) return;

                this.subLedgerBalanceList.forEach(secondItem => {

                    if (firstItem.pdebitaccountid === secondItem.accountid) {
                        secondItem.transactionamount = this._CommonService.currencyformat(Math.abs(secondItem.transactionamount));
                        secondItem.transactionamount = this._CommonService.removeCommasForEntredNumber(secondItem.transactionamount);

                        if (firstItem.ptotalamount > secondItem.transactionamount) {
                            this._CommonService.showErrorMessage(`Amount should not be greater than Sub Ledger for Account : ${firstItem.pMembername}` + ' - ' + `${firstItem.pFdaccountno}`);
                            stopExecution = true;
                        }
                    }
                });
            });

            if (stopExecution) return;

            if (this.InterestPaymentForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
                let checksavingsaccountid: any = [];
                checksavingsaccountid = this.allSelectedModels.filter(x => x.psavingsaccountid == null);
                if (checksavingsaccountid.length > 0) {
                    this._CommonService.showWarningMessage('Selected FD Account Numbers should have savings accounts to adjust interest amount');
                    return;
                }
            }

            this.allSelectedModels = this.allSelectedModels.map(obj => {
                obj.pconcatinateMember = '';
                obj.pformname = 'INTEREST PAYABLE';
                return obj;
            });

            for (let index = 0; index < this.allSelectedModels.length; index++) {
                this.allSelectedModels[index].pconcatinateMember = this.allSelectedModels[index].pFdaccountno + '-' + this.allSelectedModels[index].pMembername;
            }

            let newdata = { pintrestpaymentlist: this.allSelectedModels };
            let Intrestpaymentdata = Object.assign(this.InterestPaymentForm.value, newdata);
            let data = JSON.stringify(Intrestpaymentdata);
            console.log("save data is :",data);
            debugger;

            this.disablesavebutton = true;
            this.savebutton = 'Processing';
            this._LienEntryService.saveInterestPayment(data).subscribe(res => {
                debugger;
                if (res) {
                    console.log("result is", res['pvoucherid']);
                    this._CommonService.showInfoMessage("Saved Successfully");

                    if (this.InterestPaymentForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
                        window.open('/#/PaymentVoucherReports?id=' + btoa(res['pvoucherid'] + ',' + 'Payment Voucher'));
                    }
                    this.clearInterestPayment();
                    this.router.navigate(['/InterestpaymentView']);
                }
            },
                (error) => {
                    this._CommonService.showErrorMessage(error);
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                });
        } else {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
        }
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
                    this.InterestPaymentErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.InterestPaymentErrors[key] += errormessage + ' ';
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
        debugger;
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

    //---------Get Data wing---------------
    getBankBranchName(pbankid) {

        let data = this.banklist.filter(function (bank) {
            return bank.pbankid == pbankid;
        });
        this.InterestPaymentForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    }
    GetBankDetailsbyId(pbankid) {
        debugger;
        this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(json => {
            debugger
            //console.log(json)
            //if (json != null) {
            console.log(json)
            this.upinameslist = json.bankupilist;
            this.chequenumberslist = json.chequeslist;

            //}
        },
            (error) => {

                this._CommonService.showErrorMessage(error);
            });
    }
    GetBranchDetailsIP($event: any) {
        debugger;
        this.allStudentsSelected = false;
        this.allSelectedModels = [];
        this.intrestpaymentlist = [];
        this.Showmembers = [];
        this.total = 0;

        this.companyname = $event.target.value;
        const typevalue = $event.target.value;
        this.intrestpaymentlist = [];
        this.Showmembers = [];
        this._LienEntryService.GetBranchName1(typevalue).subscribe(result => {
            debugger;
            this.BranchDetails = result;
        })
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
            this.InterestPaymentForm['controls']['pUpiid'].setValue('');
            //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
        }
        this.GetValidationByControl(this.InterestPaymentForm, 'pUpiname', true);
    }
    upid_change() {
        this.GetValidationByControl(this.InterestPaymentForm, 'pUpiid', true);

    }
    GetSchemedetails() {
        debugger;
        this._LienEntryService.GetSchemedetails().subscribe(result => {
            debugger;
            this.SchemeDetails = result;
            console.log(this.SchemeDetails)
        })
    }
    GetCompanydetails() {
        debugger;
        this._LienEntryService.GetCompanydetails().subscribe(result => {
            debugger;
            this.CompanyDetails = result;
            console.log(this.CompanyDetails)
        })
    }
    totalAmount: 0;
    // clickselectforpayments($event: any, dataItem, rowIndex) {
    //     debugger;

    //     if ($event.target.checked) {
    //         this.total += dataItem.pIntrestamount;
    //         this.allSelectedModels.push(dataItem);
    //         console.log(this.allSelectedModels)
    //     }
    //     else {
    //         if (this.total > parseFloat(dataItem.pIntrestamount)) {
    //             this.total -= parseFloat(dataItem.pIntrestamount);
    //         }
    //         else {
    //             this.total = parseFloat(dataItem.pIntrestamount) - this.total;

    //         }

    //         this.allSelectedModels.splice(rowIndex, 1);
    //         console.log(this.allSelectedModels)

    //     }
    //     this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);


    // }
    //shiva shankar 11-07-2025 commented
    // clickselectforpayments($event: any, dataItem, rowIndex) {
    //     debugger
    //     const isChecked = $event.target.checked;
    //     this.total += isChecked ? dataItem.pIntrestamount : -dataItem.pIntrestamount;

    //     if (isChecked) {
    //         this.allSelectedModels = [...this.allSelectedModels, dataItem];

    //         this.selectedrow.push(dataItem.pdebitaccountid);
    //         this.selectedvalues = ""
    //         for (let i = 0; i < this.selectedrow.length; i++) {                
    //             this.selectedvalues+='@'+this.selectedrow[i]+'@,';


    //           }
    //           this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
    //           this.getLedgerBalance(this.selectedvalues);
    //     } else {
    //         this.allSelectedModels = this.allSelectedModels.filter(item => item.pInterestpaymentid !== dataItem.pInterestpaymentid);
    //         this.selectedrow.splice($event.rowIndex, 1);
    //   this.selectedvalues = ""
    //   for (let i = 0; i < this.allSelectedModels.length; i++) {
    //     this.selectedvalues += '@' + this.allSelectedModels[i].pdebitaccountid + '@,';
    //   }
    //   this.selectedvalues = this.selectedvalues.toString().replace(/@/g, '').slice(0, -1); 
    //   this.getLedgerBalance(this.selectedvalues)
    //     }
    //     console.log(this.allSelectedModels);
    //     this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);
    // }
    //shiva shankar 11-07-2025
    clickselectforpayments($event: any, dataItem) {
        debugger;
        this.selectedvalues = "";
        this.allSelectedModels = [];
        this.total = 0;
        const isChecked = $event.target.checked;
        if (!this.gridview || this.gridview.length === 0) {
            return;
        }
        dataItem.add = isChecked;
        if (!isChecked) {
            this.allStudentsSelected = false;
        } 

        // (document.getElementById('onFilterKey') as HTMLInputElement).value = '';
        // this.onFilter('');

        this.gridview.forEach(item => {
            if (item.add) {
                this.selectedvalues += '@' + item.pdebitaccountid + '@,';
                this.total = this.total + Number(item.pIntrestamount);
            }
        });
        this.selectedvalues = this.selectedvalues.toString().replace(/@/g, "'").slice(0, -1);
        this.getLedgerBalance(this.selectedvalues);

        this.gridview.forEach(item => {
            if (item.add) {
                this.allSelectedModels = [...this.allSelectedModels, item];
            }
        });

        this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);
        
        
        //const isChecked = $event.target.checked;
        //this.total += isChecked ? dataItem.pIntrestamount : -dataItem.pIntrestamount;

        //if (isChecked) {
        //this.allSelectedModels = [...this.allSelectedModels, dataItem];

        // this.selectedrow.push(dataItem.pdebitaccountid);
        //  this.selectedvalues = ""
        // for (let i = 0; i < this.selectedrow.length; i++) {                
        //     this.selectedvalues+='@'+this.selectedrow[i]+'@,';


        //   }
        //   this.selectedvalues = this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1); 
        //   this.getLedgerBalance(this.selectedvalues);
        //     } else {
        //         this.allSelectedModels = this.allSelectedModels.filter(item => item.pInterestpaymentid !== dataItem.pInterestpaymentid);
        //         this.selectedrow.splice($event.rowIndex, 1);
        //   this.selectedvalues = ""
        //   for (let i = 0; i < this.allSelectedModels.length; i++) {
        //     this.selectedvalues += '@' + this.allSelectedModels[i].pdebitaccountid + '@,';
        //   }
        //   this.selectedvalues = this.selectedvalues.toString().replace(/@/g, '').slice(0, -1); 
        //   this.getLedgerBalance(this.selectedvalues)
        //     }
        //     console.log(this.allSelectedModels);
        //     this.InterestPaymentForm.controls.pTotalpaymentamount.setValue(this.total);
    }

    getLedgerBalance(accountid) {
        debugger;
        this._LienEntryService.getLedgerBalance(accountid).subscribe(res => {
            this.subLedgerBalanceList = res;

            // if (parseFloat(this.subLedgerAmount) < 0) {
            //     this.subLedgerAmount = this._CommonService.currencyformat(Math.abs(this.subLedgerAmount));
            //   }
            //   else if (parseFloat(this.subLedgerAmount) >= 0) {
            //     this.subLedgerAmount = this._CommonService.currencyformat(this.subLedgerAmount);
            //   }

            console.log(this.subLedgerBalanceList);

        })
    }

    GetShowmemberdetails() {
        debugger;
        let isValid = false;
        this.allStudentsSelected = false;
        this.total = 0;
        this.showbtnvalidation(this.paymenttype)
        this.Showmembers = [];
        this.loading = true;
        debugger;
        this._LienEntryService.GetShowmemberdetails(this.schemeid, this.paymenttype, this.companyname, this.branchname, this.monthof).subscribe(result => {
            debugger;
            this.Showmembers = result;
            this.gridview = result;
            this.loading = false;
            let month = this.datepipe.transform(this.InterestPaymentForm['controls']['pMonthOf'].value, 'MMM-yyyy');
            if (this.Showmembers.length == 0) {
                this._CommonService.showWarningMessage('No Data To Show For The Month of' + ' ' + month);
                this.loading = false;
            }
            console.log(this.Showmembers)

        }, (error) => {
            this._CommonService.showErrorMessage(error);
            this.loading = false;
        })


    }
    gettypeofpaymentdata(): any {
        debugger;
        let data = this.modeoftransactionslist.filter(function (payment) {
            return payment.ptranstype != payment.ptypeofpayment;
        });
        return data;
    }
    //---------End Get DAta -------------


    ////---------Change Events wing
    //DebitCard_Change($event: any): void {
    //    debugger;
    //    const pbankid = $event.target.value;       
    //    if (pbankid && pbankid != '' && pbankid != 'Select') {
    //        const bankname = $event.target.options[$event.target.selectedIndex].text;           
    //        this.InterestPaymentForm['controls']['pbankname'].setValue(bankname);

    //    }
    //    else {


    //    }


    //}
    bankName_Change($event: any): void {
        debugger;
        const pbankid = $event.target.value;
        this.upinameslist = [];
        this.chequenumberslist = [];
        //this.InterestPaymentForm['controls']['pchequeno'].setValue('');
        //this.InterestPaymentForm['controls']['pUpiname'].setValue('');
        //this.InterestPaymentForm['controls']['pUpiid'].setValue('');
        if (pbankid && pbankid != '' && pbankid != 'Select') {
            const bankname = $event.target.options[$event.target.selectedIndex].text;
            this.GetBankDetailsbyId(pbankid);
            this.getBankBranchName(pbankid);
            this.InterestPaymentForm['controls']['pbankname'].setValue(bankname);

        }
        else {

            //this.InterestPaymentForm['controls']['pbankname'].setValue('');
        }

        //this.GetValidationByControl(this.InterestPaymentForm, 'pbankname', true);
        // this.formValidationMessages['pchequeno'] = '';
    }
    chequenumber_Change() {

        this.GetValidationByControl(this.InterestPaymentForm, 'pchequeno', true);
    }
    debitCard_Change() {
        debugger;
        let data = this.getbankname(this.InterestPaymentForm.controls.pdebitcard.value);
        this.InterestPaymentForm['controls']['pbankname'].setValue(data.pbankname);
        this.InterestPaymentForm['controls']['pbankid'].setValue(data.pbankid);
        this.InterestPaymentForm['controls']['pfinancialservice'].setValue(data.pbankname);
        this.GetValidationByControl(this.InterestPaymentForm, 'pdebitcard', true);
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
    DateChange($event: any) {
        debugger;
        // this.allSelectedModels = [];
        this.intrestpaymentlist = [];
        this.Showmembers = [];
        this.total = 0;
        this.monthof = this.datepipe.transform($event, 'MMM-yyyy');

        let minMonth = new Date('2024-06-01');
        let selectedMonth = new Date($event);

        if (selectedMonth < minMonth) {
            this.InterestPaymentForm['controls']['pMonthOf'].setValue('');
            this._CommonService.showWarningMessage('The selected month should not be before JULY 2024.');
            return
        }
        let today: Date = new Date()

        if (selectedMonth > today) {
            this.InterestPaymentForm['controls']['pMonthOf'].setValue('');
        }
    }
    gridUserSelectionChange(gridUser, selection) {
        debugger;
        // let selectedData = gridUser.data.data[selection.index];
        const selectedData = selection.selectedRows[0].dataItem;
        console.log(selectedData);
    }
    adjustmentTypeChange($event: any) {
        debugger;
        const typevalue = $event.target.value;
        this.paymenttype = $event.target.value;
        this.CompanyDetails = [];
        this.BranchDetails = [];
        this.intrestpaymentlist = [];
        this.Showmembers = [];
        this.allSelectedModels = [];
        this.total = 0;
        if (typevalue == "ADJUSTMENT") {
            this.showCompany = true;
            this.GetCompanydetails();

        }
        else {
            this.showCompany = false;

        }
        this.clearadjustmenttypechange();
        this.showbtnvalidation(typevalue);

    }
    shemename_change($event: any) {
        debugger;
        this.intrestpaymentlist = [];
        this.allSelectedModels = [];
        this.Showmembers = [];
        this.total = 0;
        this.schemeid = $event.target.value;

    }
    branchNameChange($event: any) {
        debugger;
        this.allStudentsSelected = false;
        this.intrestpaymentlist = [];
        this.Showmembers = [];
        this.total = 0;
        this.allSelectedModels = [];
        this.branchname = $event.target.value;

    }
    //---------End Change Events wing--------------------------

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
        let UpinameControl = <FormGroup>this.InterestPaymentForm['controls']['pUpiname'];
        let UpiidControl = <FormGroup>this.InterestPaymentForm['controls']['pUpiid'];
        if (this.InterestPaymentForm.controls.ptypeofpayment.value == 'UPI') {
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
        this.GetValidationByControl(this.InterestPaymentForm, 'ptypeofpayment', true);
    }
    //---------Validations and Clear wing--------------------------
    showbtnvalidation(type) {
        debugger
        let pInterestpaymentDate = <FormGroup>this.InterestPaymentForm['controls']['pInterestpaymentDate'];
        let pSchemeId = <FormGroup>this.InterestPaymentForm['controls']['pSchemeId'];
        let padjustmenttype = <FormGroup>this.InterestPaymentForm['controls']['padjustmenttype'];
        let pcompanyname = <FormGroup>this.InterestPaymentForm['controls']['pcompanyname'];
        let pbranchnamemain = <FormGroup>this.InterestPaymentForm['controls']['pbranchnamemain'];
        let pMonthOf = <FormGroup>this.InterestPaymentForm['controls']['pMonthOf'];

        if (type == 'SELF') {
            pInterestpaymentDate.setValidators(Validators.required)
            pSchemeId.setValidators(Validators.required)
            padjustmenttype.setValidators(Validators.required)
            pMonthOf.setValidators(Validators.required)


        }
        else if (type == 'ADJUSTMENT') {
            pInterestpaymentDate.setValidators(Validators.required)
            pSchemeId.setValidators(Validators.required)
            padjustmenttype.setValidators(Validators.required)
            pMonthOf.setValidators(Validators.required)
            pcompanyname.setValidators(Validators.required)
            pbranchnamemain.setValidators(Validators.required)


        }
        else {
            // pInterestpaymentDate.clearValidators()
            // pSchemeId.clearValidators()
            // padjustmenttype.clearValidators()
            // pMonthOf.clearValidators()
            // pcompanyname.clearValidators()
            // pbranchnamemain.clearValidators()
            pInterestpaymentDate.setValidators(Validators.required)
            pSchemeId.setValidators(Validators.required)
            pMonthOf.setValidators(Validators.required)

        }


        pInterestpaymentDate.updateValueAndValidity()
        pSchemeId.updateValueAndValidity();
        padjustmenttype.updateValueAndValidity();
        pMonthOf.updateValueAndValidity();
        pcompanyname.updateValueAndValidity();
        pbranchnamemain.updateValueAndValidity();

    }
    modeofpaymentvalidation(type) {
        debugger
        this.InterestPaymentErrors = {}
        let pbankid = <FormGroup>this.InterestPaymentForm['controls']['pbankid'];
        let pbranchname = <FormGroup>this.InterestPaymentForm['controls']['pbranchname'];
        let pchequeno = <FormGroup>this.InterestPaymentForm['controls']['pchequeno'];
        // let pbankidonline = <FormGroup>this.InterestPaymentForm['controls']['pbankid'];
        let ptypeofpayment = <FormGroup>this.InterestPaymentForm['controls']['ptypeofpayment'];
        const ptypeofpayment1 = <FormGroup>this.InterestPaymentForm['controls']['ptypeofpayment'];

        let preferencenoonline = <FormGroup>this.InterestPaymentForm['controls']['preferencenoonline'];
        let pUpiname = <FormGroup>this.InterestPaymentForm['controls']['pUpiname'];
        let pUpiid = <FormGroup>this.InterestPaymentForm['controls']['pUpiid'];
        let pdebitcard = <FormGroup>this.InterestPaymentForm['controls']['pdebitcard'];
        let pfinancialservice = <FormGroup>this.InterestPaymentForm['controls']['pfinancialservice'];
        let preferencenodcard = <FormGroup>this.InterestPaymentForm['controls']['preferencenodcard'];
        let pTotalpaymentamount = <FormGroup>this.InterestPaymentForm['controls']['pTotalpaymentamount'];

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
    clearadjustmenttypechange() {
        this.InterestPaymentForm.patchValue({
            pcompanyname: '',
            pbranchnamemain: '',
        })
        this.InterestPaymentErrors = {}
    }
    clearInterestPayment() {

        try {
            this.intrestpaymentlist = [];
            this.InterestPaymentForm.reset();
            this.InterestPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
            this.InterestPaymentForm['controls']['pModeofreceipt'].setValue('BANK');
            this.InterestPaymentForm['controls']['padjustmenttype'].setValue('');
            this.clearmodeofpaymentDetails();
            this.clearInterestPaymentDetails();
            let date = new Date();
            this.InterestPaymentForm['controls']['pInterestpaymentDate'].setValue(date);
            this.InterestPaymentForm['controls']['pTotalpaymentamount'].setValue('');
            this.formValidationMessages = {};
            this.pintrestpaymentlist = {};
            this.InterestPaymentErrors = {};
            this.disablesavebutton = false;
            this.savebutton = "Save";
            this.transofPaymentChange('CHEQUE');
            this.Showmembers = []
            this.total = 0;
            this.allSelectedModels = [];
            this.allStudentsSelected = false;
            this.selectedvalues = "";

        } catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    clearInterestPaymentDetails() {

        const formControl = <FormGroup>this.InterestPaymentForm['controls']['pintrestpaymentlist'];
        formControl.reset();

        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['pMembername'].setValue(false);
        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['pFdaccountno'].setValue(false);
        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['pInterestpaymentid'].setValue(false);
        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['pIntrestamount'].setValue(null);
        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['pTdsamount'].setValue(null);
        this.InterestPaymentForm['controls']['pintrestpaymentlist']['controls']['ptotalamount'].setValue(null);

        this.formValidationMessages = {};

    }
    clearmodeofpaymentDetails() {
        debugger
        this.chequenumberslist = [];
        this.InterestPaymentForm['controls']['pbankid'].setValue('');
        this.InterestPaymentForm['controls']['pbankname'].setValue('');
        this.InterestPaymentForm['controls']['pbranchname'].setValue('');
        this.InterestPaymentForm['controls']['pchequeno'].setValue('');
        // this.InterestPaymentForm['controls']['pbanknameonline'].setValue('');
        this.InterestPaymentForm['controls']['ptypeofpayment'].setValue('');
        this.InterestPaymentForm['controls']['preferencenoonline'].setValue('');
        this.InterestPaymentForm['controls']['pUpiname'].setValue('');

        this.InterestPaymentForm['controls']['pUpiid'].setValue('');
        this.InterestPaymentForm['controls']['pdebitcard'].setValue('');
        this.InterestPaymentForm['controls']['pfinancialservice'].setValue('');
        this.InterestPaymentForm['controls']['preferencenodcard'].setValue('');


        this.InterestPaymentErrors = {};

    }
    //---------End Validations--------------------------
    back() {
        this.router.navigate(['/InterestpaymentView']);
    }

    onFilter(inputValue: string) {
        debugger
        // this.allSelectedModels = [];
        //this.selectedrow = [];
        //this.selectedvalues = '';
        //this.total = 0;
        this.Showmembers = process(this.gridview, {
            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'pMembername',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pFdaccountno',
                        operator: 'contains',
                        value: inputValue
                    }, {
                        field: 'pinterestpayable',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pIntrestamount',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pTdsamount',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'ptotalamount',
                        operator: 'contains',
                        value: inputValue
                    }
                ],
            }
        }).data;
        this.dataBinding.skip = 0;
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData = {
            data: process(this.Showmembers, {
                // group: this.group,
                // sort: [{ field: "preceiptdate", dir: "asc" }],
            }).data,
            //  group: this.group,
        };

        return result;
    }
}
