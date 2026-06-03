import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../Services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { DisbusementService } from '../../../../Services/Loans/Transactions/disbusement.service';
import { debug } from 'util';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Observable } from 'rxjs/Rx'
import { delay, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

@Component({
  selector: 'app-disbursement-new',
  templateUrl: './disbursement-new.component.html',
  styles: []
})
export class DisbursementNewComponent implements OnInit {

  showsubledger: Boolean
  constructor(private _FormBuilder: FormBuilder, private datepipe: DatePipe, private zone: NgZone, private _commonService: CommonService, private _routes: Router, private _route: ActivatedRoute, private _AccountingTransactionsService: AccountingTransactionsService, private _DisbusementService: DisbusementService) {
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.showWeekNumbers = false;
    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pinstallmentstartdateConfig.containerClass = 'theme-dark-blue';
    this.pinstallmentstartdateConfig.showWeekNumbers = false;
    this.pinstallmentstartdateConfig.minDate = new Date();
    this.pinstallmentstartdateConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pinstallmentstartdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  paymentVoucherForm: FormGroup;
  paymentslist: any;
  formValidationMessages: any;
  showModeofPayment = false;
  showTypeofPayment = false;
  showtranstype = false;
  showbankcard = true;
  showbranch = true;
  showfinancial = true;
  showupi = false;
  showchequno = true;
  showadjustment = false;
  showadjustmentradio = false;
  showstagepament = false;
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';
  chequenumberslist: any;
  ledgeraccountslist: any;
  subledgeraccountslist: any;
  upinameslist: any;
  upiidlist: any;
  cashBalance: any;
  bankBalance: any;
  bankbookBalance: any;
  bankpassbookBalance: any;
  banklist: any;
  modeoftransactionslist: any;
  typeofpaymentlist: any;
  ledgerBalance: any;;
  subledgerBalance: any;

  debitcardlist: any;
  adjustchargeslist: any = [];
  chargesreceiptlist: any;
  otheroutstandingloanslist: any;
  stagepaymentlist: any;
  partpaymentlist: any;
  installmentdateslist: any;
  disbleinstallmentdate = false;
  showAdvanceEmi: Boolean;
  disablesavebutton = false;
  savebutton = "Save";
  formloading = false;
  emiData: any = [];

  disabletransactiondate = false;
  ngOnInit() {

    debugger;
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.showsubledger = true;
    this.paymentslist = [];
    this.formValidationMessages = {};
    this.paymentVoucherForm = this._FormBuilder.group({
      ppaymentid: [''],
      papplicantid: [''],
      ppaymentdate: ['', Validators.required],
      ptotalpaidamount: [''],
      pnarration: [''],
      pmodofpayment: ['CASH'],
      pbankname: [''],
      pbranchname: [''],
      ptranstype: ['CHEQUE'],
      pCardNumber: [''],
      pUpiname: [''],
      pUpiid: [''],
      ptypeofpayment: [''],
      pChequenumber: [''],
      pchequedate: [''],
      pbankid: [''],
      pchargesadjustedamount: [''],
      pexistingloanssadjustedamount: [''],
      papplicantname: [''],
      pcontactreferenceid: [''],
      ploanname: [''],
      papplicationid: [''],
      pvchapplicationid: [''],
      pdateofapplication: [''],
      ppurposeofloan: [''],
      papprovedloanamount: [''],
      ppreviousdisbursedamount: [0],
      ptenureofloan: [''],
      pinteresttype: [''],
      prateofinterest: [''],
      ploanpayin: [''],
      ploaninstallment: [''],
      pinstallmentstartdate: [''],
      papprovedstatus: [''],
      pdisbursedtype: [''],
      pdebtorsaccountid: [''],
      ploanpayoutamount: [''],
      papproveddate: [''],
      ploanadjustmentamount: [''],
      ploandisbusableamount: [''],
      ploandisbusalamount: [''],
      ppayinnature: [''],
      ppayinduration: [''],
      pledgerid: [null],
      pledgername: [''],
      psubledgername: [''],
      psubledgerid: [''],
      pcancelchequesamount: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      ppreviousdisbursedtdate: [''],
      ploaninstalmentpaymentmode: [''],
      pexistingdisbursestatus: [''],
      pBrowkenAmount: [0],
      pAdvanceEmiAmount: [0],
      pBrowkendays: [0],
      emitype: [''],
      pemitype: [''],
      pemiday: [0],
      pdisbursestatus: []
    })
    //this.paymentVoucherForm['controls']['pinstallmentstartdate'].disable()



    this.modeofPaymentChange();
    this.BlurEventAllControll(this.paymentVoucherForm);

    this.getLoadData();
    debugger
    let aa = this._route.snapshot.params['id']
    const routeParams = atob(this._route.snapshot.params['id']);
    // const routeParams=
    if (!isNullOrEmptyString(routeParams)) {
      this.GetApprovedApplicationsByID(routeParams);
    }
    //  this.paymentVoucherForm['controls']['emitype'].setValue('REGULAR');

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
  getLoadData() {

    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('DISBURSEMENT').subscribe(json => {

      //console.log(json)
      if (json != null) {

        this.banklist = json.banklist;
        this.modeoftransactionslist = json.modeofTransactionslist;
        this.typeofpaymentlist = this.gettypeofpaymentdata();
        this.ledgeraccountslist = json.accountslist;
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
  setBalances(balancetype, balanceamount) {

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
    //if (balancetype == 'LEDGER')
    //    this.ledgerBalance = balancedetails;
    //if (balancetype == 'SUBLEDGER')
    //    this.subledgerBalance = balancedetails;
    //if (balancetype == 'PARTY')
    //    this.partyBalance = balancedetails;
  }
  gettypeofpaymentdata(): any {

    let data = this.modeoftransactionslist.filter(function (payment) {
      return payment.ptranstype != payment.ptypeofpayment;
    });
    return data;
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;
      if (key == 'pCardNumber' || isValid == false) {

        //alert('Fired');
      }

      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {


            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                let errormessage;

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
      this._commonService.showErrorMessage(key);
      return false;
    }
    //if (isValid == false) {
    //    {
    //        //alert(key);
    //    }
    //}
    return isValid;
  }
  modeofPaymentChange() {
    this.showadjustment = false;
    if (this.paymentVoucherForm.controls.pmodofpayment.value == "CASH") {
      this.paymentVoucherForm['controls']['pbankid'].setValue(0);
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.showtranstype = false;

    }
    else if (this.paymentVoucherForm.controls.pmodofpayment.value == "BANK") {
      this.paymentVoucherForm['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.showtranstype = true;

    }
    else if (this.paymentVoucherForm.controls.pmodofpayment.value == "ADJUSTMENT") {

      this.showModeofPayment = true;
      this.showtranstype = false;
      this.showadjustment = true;
    }
    else {
      this.showModeofPayment = true;
      this.showtranstype = false;
    }
    this.transofPaymentChange();


  }
  transofPaymentChange() {

    this.displayCardName = 'Debit Card';
    this.showTypeofPayment = false;
    this.showbranch = false;
    this.showfinancial = false;
    this.showchequno = false;
    this.showbankcard = true;
    this.showupi = false;
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
    this.cleartranstypeDetails();
  }
  typeofPaymentChange() {


    debugger;
    let UpinameControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiid'];
    if (this.paymentVoucherForm.controls.ptypeofpayment.value == 'UPI') {
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

    this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment', true);
  }
  addModeofpaymentValidations() {
    debugger;
    let modeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.paymentVoucherForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.paymentVoucherForm['controls']['pbankname'];
    let chequeControl = <FormGroup>this.paymentVoucherForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.paymentVoucherForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

    let UpinameControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiid'];
    let LedgerControl = <FormGroup>this.paymentVoucherForm['controls']['pledgername'];
    if (this.showModeofPayment == true) {


      modeofpaymentControl.setValidators(Validators.required);
      bankControl.setValidators(Validators.required);
      chequeControl.setValidators(Validators.required);

      if (this.showadjustment == true) {
        transtypeControl.clearValidators();
        bankControl.clearValidators();
        chequeControl.clearValidators();
        cardControl.clearValidators();
        typeofpaymentControl.clearValidators();
        //branchnameControl.clearValidators();
        UpinameControl.clearValidators();
        UpiidControl.clearValidators();
        LedgerControl.setValidators(Validators.required);
      }
      else {
        LedgerControl.clearValidators();

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
        //if (this.showbranch) {
        //    branchnameControl.setValidators(Validators.required);
        //}
        //else {
        //    branchnameControl.clearValidators();
        //}
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
    }
    else {
      modeofpaymentControl.clearValidators();
      bankControl.clearValidators();
      chequeControl.clearValidators();
      LedgerControl.clearValidators();
      UpinameControl.clearValidators();
      UpiidControl.clearValidators();
      typeofpaymentControl.clearValidators();
    }


    modeofpaymentControl.updateValueAndValidity();
    transtypeControl.updateValueAndValidity();
    cardControl.updateValueAndValidity();
    bankControl.updateValueAndValidity();
    chequeControl.updateValueAndValidity();
    typeofpaymentControl.updateValueAndValidity();
    //branchnameControl.updateValueAndValidity();

    UpinameControl.updateValueAndValidity();
    UpiidControl.updateValueAndValidity();
    LedgerControl.updateValueAndValidity();
  }

  bankName_Change($event: any): void {

    const pbankid = $event.target.value;
    this.upinameslist = [];
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pChequenumber'].setValue('');
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
      this.getBankBranchName(data.pbankid);
      return data;
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  ledgerName_Change($event: any): void {

    const pledgerid = $event.pledgerid;
    this.subledgeraccountslist = [];
    this.paymentVoucherForm['controls']['psubledgerid'].setValue('');
    this.paymentVoucherForm['controls']['psubledgername'].setValue('');
    this.ledgerBalance = '';
    this.subledgerBalance = '';
    if (pledgerid && pledgerid != '') {
      const ledgername = $event.pledgername;
      let data = this.ledgeraccountslist.filter(function (ledger) {
        return ledger.pledgerid == pledgerid;
      })[0];
      this.setBalances('LEDGER', data.accountbalance);
      this.GetSubLedgerData(pledgerid);
      this.paymentVoucherForm['controls']['pledgername'].setValue(ledgername);
    }
    else {

      this.setBalances('LEDGER', 0);
      this.paymentVoucherForm['controls']['pledgername'].setValue('');
    }
  }

  GetSubLedgerData(pledgerid) {

    this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

      //console.log(json)
      if (json != null) {

        this.subledgeraccountslist = json;

        let subLedgerControl = <FormGroup>this.paymentVoucherForm['controls']['psubledgername'];
        if (this.subledgeraccountslist.length > 0) {
          this.showsubledger = true;
          subLedgerControl.setValidators(Validators.required);
        }
        else {
          subLedgerControl.clearValidators();
          this.showsubledger = false;
          this.paymentVoucherForm['controls']['psubledgerid'].setValue(pledgerid);
          this.paymentVoucherForm['controls']['psubledgername'].setValue(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pledgername').value);
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

    const psubledgerid = $event.target.value;
    this.subledgerBalance = '';
    if (psubledgerid && psubledgerid != '') {
      const subledgername = $event.target.options[$event.target.selectedIndex].text;

      this.paymentVoucherForm['controls']['psubledgername'].setValue(subledgername);
      let data = this.subledgeraccountslist.filter(function (ledger) {
        return ledger.psubledgerid == psubledgerid;
      })[0];
      this.setBalances('SUBLEDGER', data.accountbalance);

    }
    else {

      this.paymentVoucherForm['controls']['psubledgername'].setValue('');
      this.setBalances('SUBLEDGER', 0);
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername', true);
  }
  upiName_Change($event: any): void {

    const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      let data1 = this.upinameslist.filter(x => x.pUpiname == districtname);
      this.upiidlist = data1;


    }
    else {
      this.upiidlist = [];
      this.paymentVoucherForm['controls']['pUpiid'].setValue('');
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
  cleartranstypeDetails() {
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pbankid'].setValue('');
    this.paymentVoucherForm['controls']['pbankname'].setValue('');
    this.paymentVoucherForm['controls']['pCardNumber'].setValue('');
    this.paymentVoucherForm['controls']['ptypeofpayment'].setValue('');
    this.paymentVoucherForm['controls']['pbranchname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiid'].setValue('');
    this.paymentVoucherForm['controls']['pChequenumber'].setValue('');
    this.formValidationMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
  }
  GetApprovedApplicationsByID(pvchapplicationid) {
    this.formloading = true;
    this._DisbusementService.GetApprovedApplicationsByID(pvchapplicationid).subscribe(json => {

      console.log('disbursment data', json)
      if (json != null) {
        this.formloading = false;
        if (json.ploantype.toUpperCase() == 'CONSUMER LOAN' || json.ploantype.toUpperCase() == 'VEHICLE LOAN') {
          this.showadjustmentradio = true
        }
        else {
          this.showadjustmentradio = false
        }
        if (json.pdisbursedtype == 'STAGE PAYMENT') {
          this.partpaymentlist = [];
          this.stagepaymentlist = json.pstagewisepaymentslist.filter(c => (c.pstageamount = this._commonService.currencyformat(c.pstageamount)));
          this.showstagepament = true;
        }
        else {
          this.stagepaymentlist = [];
          this.showstagepament = false;
          this.partpaymentlist = json.pPartPaymentslist.filter(c => (c.pdisburedamount = this._commonService.currencyformat(c.pdisburedamount)));
        }
        if (json.ploanpayin == "Weekly") {
          this.showAdvanceEmi = false;
        } else {
          this.showAdvanceEmi = true
        }

        this.adjustchargeslist = json.padjustchargeslist.filter(c => (c.pchargeamount = this._commonService.currencyformat(c.pchargeamount)));

        this.adjustchargeslist = this.adjustchargeslist.filter(c => (c.pchargebalance = this._commonService.currencyformat(c.pchargebalance)));

        this.chargesreceiptlist = json.pchargereceiptslist.filter(c => (c.pchargeamount = this._commonService.currencyformat(c.pchargeamount)));

        json.papprovedloanamount = this._commonService.currencyformat(json.papprovedloanamount);
        json.ploaninstallment = this._commonService.currencyformat(json.ploaninstallment);

        let newdate = this._commonService.formatDateFromDDMMYYYY(json.papproveddate);
        this.ppaymentdateConfig.minDate = newdate;
        this.paymentVoucherForm.patchValue(json);

        //let date = new Date();
        ////date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        //this.paymentVoucherForm['controls']['ppaymentdate'].setValue(date);
        this.otheroutstandingloanslist = json.pexistingloanslist.filter(c => (c.poutstandingamount = this._commonService.currencyformat(c.poutstandingamount)));


        this.installmentdateslist = json.pInstallmentdatelist;
        if (this.paymentVoucherForm.controls.pexistingdisbursestatus.value == 'NO') {
          let date = new Date();
          this.paymentVoucherForm['controls']['ppaymentdate'].setValue(date);
          this.setInstallmentDate();
        }
        else {
          let ppreviousdisbursedtdate = this._commonService.formatDateFromDDMMYYYY(json.ppreviousdisbursedtdate);

          this.ppaymentdateConfig.minDate = ppreviousdisbursedtdate;

          this.paymentVoucherForm['controls']['ppaymentdate'].setValue(ppreviousdisbursedtdate);
          this.paymentVoucherForm['controls']['ppreviousdisbursedtdate'].setValue(json.ppreviousdisbursedtdate);

          let insdate = this._commonService.formatDateFromDDMMYYYY(json.pinstallmentstartdate);
          this.paymentVoucherForm['controls']['pinstallmentstartdate'].setValue(insdate);
          if (json.pdisbursedtype == 'MULTIPLE DISBURSEMENT' || json.pdisbursedtype == 'SINGLE PAYMENT') {
            this.pinstallmentstartdateConfig.minDate = this.paymentVoucherForm['controls']['ppaymentdate'].value;
          }
          this.disbleinstallmentdate = true;
        }
        if (this.adjustchargeslist.length > 0)
          this.setAdjustChargesAmount();
        this.calculateDisbursalAmount();
        this.paymentVoucherForm['controls']['pemitype'].setValue(json.pemitype);
        this.paymentVoucherForm['controls']['emitype'].setValue(json.pemitype);
        if (this.paymentVoucherForm.controls.pdisbursedtype.value == 'SINGLE PAYMENT') {
          this.paymentVoucherForm['controls']['pemiday'].setValue(0);
        } else {
          this.paymentVoucherForm['controls']['pemiday'].setValue(json.pemiday);
        }
        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;

        this.GetBrowkenDaysandAmount();

      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  getPaymentDate() {
    return this.paymentVoucherForm.controls.ppaymentdate.value;
  }
  setInstallmentDate() {
    debugger;
    try {
      if (this.paymentVoucherForm.controls.pexistingdisbursestatus.value == 'NO') {
        if (this.paymentVoucherForm.controls.ppaymentdate.value != null) {
          this.disbleinstallmentdate = false;

          let insdate = this._commonService.getFormatDate(this.paymentVoucherForm.controls.ppaymentdate.value);
          let disbursementdate = this._commonService.formatDateFromDDMMYYYY(JSON.parse(JSON.stringify(insdate)));

          let payinnature = this.paymentVoucherForm.controls.ppayinnature.value;
          let payinduration = this.paymentVoucherForm.controls.ppayinduration.value;

          let installmentdate = disbursementdate;
          let newdate = installmentdate;

          if (this.installmentdateslist != null) {
            if (this.installmentdateslist.length > 0) {

              //if (payinnature == 'DAYS') {
              //    newdate = installmentdate;
              //    //installmentdate = this.datepipe.transform(installmentdate.setDate(installmentdate.getDate() + parseFloat(payinduration)), 'dd-MM-yyyy');
              //}
              //else {

              if (payinnature == 'MONTHS') {

                for (let i = 0; i < this.installmentdateslist.length; i++) {

                  if (this.installmentdateslist[i].pinstallmentdatetype.toUpperCase() == 'BASED ON LOAN DISBURSAL DATE') {
                    newdate = installmentdate;
                  }
                  else if (this.installmentdateslist[i].pinstallmentdatetype.toUpperCase() == 'INSTALLMENT DUE DATE') {
                    let disburseday = this.getDay(this._commonService.getFormatDate(installmentdate));
                    let fromday = this.installmentdateslist[i].pdisbursefromno;
                    let today = this.installmentdateslist[i].pdisbursetono;

                    if (disburseday >= fromday && disburseday <= today) {
                      newdate = this.getMonthYear(this._commonService.getFormatDate(installmentdate), this.installmentdateslist[i].pinstallmentdatedueno);
                      this.disbleinstallmentdate = true;
                    }
                  }
                  else if (this.installmentdateslist[i].pinstallmentdatetype.toUpperCase() == 'A FIXED DATE OF A MONTH') {
                    newdate = this.getMonthYear(this._commonService.getFormatDate(installmentdate), this.installmentdateslist[i].pinstallmentdatedueno);
                    this.disbleinstallmentdate = true;
                  }

                }
              }

            }
          }

          installmentdate = this.getNewDate(newdate, parseFloat(payinduration), payinnature);
          this.pinstallmentstartdateConfig.minDate = this.paymentVoucherForm['controls']['ppaymentdate'].value;
          this.paymentVoucherForm['controls']['pinstallmentstartdate'].setValue(installmentdate);
          // let removeDays = this.paymentVoucherForm['controls']['pinstallmentstartdate'].value;
          // this.pinstallmentstartdateConfig.minDate = new Date(removeDays.setDate(removeDays.getDate() - 30));
          this.ploandisbusalamount_change()
        }
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);

    }
  }
  setinstallmentdate(date) {
    this.paymentVoucherForm['controls']['pinstallmentstartdate'].setValue(date);
  }
  getNewDate(date, payinduration, payinnature) {
    if (payinnature == 'DAYS') {
      return new Date(date.setDate(date.getDate() + payinduration));
    }
    else if (payinnature == 'MONTHS') {
      return new Date(date.setMonth(date.getMonth() + payinduration));
    }
    else {
      return date;
    }
  }
  getMonthYear(date, day): any {
    let datevalue;
    let monthyear;
    if (date.indexOf('/') > -1) {
      datevalue = date.split('/');
      monthyear = day + '/' + datevalue[1] + '/' + datevalue[2]
    }
    if (date.indexOf('-') > -1) {
      datevalue = date.split('-');
      monthyear = day + '-' + datevalue[1] + '-' + datevalue[2]
    }
    if (date.indexOf(' ') > -1) {
      datevalue = date.split(' ');
      monthyear = day + ' ' + datevalue[1] + ' ' + datevalue[2]
    }
    monthyear = this._commonService.formatDateFromDDMMYYYY(monthyear);
    return monthyear;
  }
  getDay(date): any {
    let datevalue;
    let day;
    if (date.indexOf('/') > -1) {
      datevalue = date.split('/');
    }
    if (date.indexOf('-') > -1) {
      datevalue = date.split('-');
    }
    if (date.indexOf(' ') > -1) {
      datevalue = date.split(' ');
    }
    day = parseFloat(datevalue[0]);
    return day;
  }
  stagestatus_Checked(event, data) {
    if (event.target.checked == true) {
      data.pstagestatus = true;
    }
    else {
      data.pstagestatus = false;
    }
    for (let i = 0; i < this.stagepaymentlist.length; i++) {
      if (this.stagepaymentlist[i].pstagename == data.pstagename) {
        this.stagepaymentlist[i] = data;
      }
    }
    this.calculateDisbursalAmount();
  }
  setAdjustChargesAmount() {

    try {
      let loanadjustmentamount = 0;
      let loanadjustmentremainingamount = 0;

      if (this.adjustchargeslist != null) {
        if (this.adjustchargeslist.length) {
          loanadjustmentamount = this.adjustchargeslist.reduce((sum, c) => sum + parseFloat((c.pchargebalance.toString()).replace(/,/g, "")), 0);
        }
      }

      if (this.otheroutstandingloanslist != null) {
        if (this.otheroutstandingloanslist.length) {
          loanadjustmentamount = loanadjustmentamount + this.otheroutstandingloanslist.reduce((sum, c) => sum + parseFloat((c.padjustedamount.toString()).replace(/,/g, "")), 0);
        }
      }

      if (this.showstagepament) {
        loanadjustmentremainingamount = loanadjustmentamount;
        for (let i = 0; i < this.stagepaymentlist.length; i++) {
          if (loanadjustmentremainingamount > 0 && this.stagepaymentlist[i].pstagepaidstatus == false) {
            this.stagepaymentlist[i].pstagestatus = true;
            this.stagepaymentlist[i].pstagepaidstatus = true;
            this.stagepaymentlist[i].pstageadjuststatus = true;
            let stageamount = parseFloat((this.stagepaymentlist[i].pstageamount.toString()).replace(/,/g, ""));
            loanadjustmentremainingamount = loanadjustmentremainingamount - stageamount;
            if (loanadjustmentremainingamount <= 0) {
              loanadjustmentremainingamount = 0;
            }
          }
        }
      }

      this.paymentVoucherForm['controls']['ploanadjustmentamount'].setValue(this._commonService.currencyformat(loanadjustmentamount));
    } catch (e) {

    }
  }
  calculateDisbursalAmount() {
    try {


      let loanamount = this.paymentVoucherForm.controls.papprovedloanamount.value;
      if (isNullOrEmptyString(loanamount))
        loanamount = 0;
      else
        loanamount = parseFloat(loanamount.toString().replace(/,/g, ""));

      let loanpayoutamount = this.paymentVoucherForm.controls.ploanpayoutamount.value;
      if (isNullOrEmptyString(loanpayoutamount))
        loanpayoutamount = 0;
      else
        loanpayoutamount = parseFloat(loanpayoutamount.toString().replace(/,/g, ""));

      let previousdisbursedamount = loanamount - loanpayoutamount;
      let loanadjustmentamount = this.paymentVoucherForm.controls.ploanadjustmentamount.value;
      if (isNullOrEmptyString(loanadjustmentamount))
        loanadjustmentamount = 0;
      else
        loanadjustmentamount = parseFloat(loanadjustmentamount.toString().replace(/,/g, ""));

      let loandisbursableamount = 0;
      let loandisbursalamount = 0;
      let loanstagepayableamount = 0;


      if (this.showstagepament) {
        let stagepaymentdata = this.stagepaymentlist.filter(x => x.pstagestatus == true && x.pstagepreviouspaidstatus == 'NO'
        );
        if (stagepaymentdata != null) {
          if (stagepaymentdata.length > 0)
            loanstagepayableamount = stagepaymentdata.reduce((sum, c) => sum + parseFloat((c.pstageamount.toString()).replace(/,/g, "")), 0);
        }
        if (loanstagepayableamount > 0)
          loandisbursalamount = loanstagepayableamount;

        if (loanadjustmentamount > 0)
          loandisbursalamount = parseFloat((loandisbursalamount - loanadjustmentamount).toFixed(2));
      }

      loandisbursableamount = parseFloat((loanadjustmentamount + loandisbursalamount).toFixed(2));


      this.paymentVoucherForm['controls']['ploanpayoutamount'].setValue(this._commonService.currencyformat(loanpayoutamount));

      if (loandisbursableamount != 0)
        this.paymentVoucherForm['controls']['ploandisbusableamount'].setValue(this._commonService.currencyformat(loandisbursableamount));
      if (loandisbursalamount > 0)
        this.paymentVoucherForm['controls']['ploandisbusalamount'].setValue(this._commonService.currencyformat(parseFloat(loandisbursalamount.toFixed(2))));
      else
        this.paymentVoucherForm['controls']['ploandisbusalamount'].setValue(0);



      if (previousdisbursedamount > 0)
        this.paymentVoucherForm['controls']['ppreviousdisbursedamount'].setValue(this._commonService.currencyformat(parseFloat(previousdisbursedamount.toFixed(2))));
      else
        this.paymentVoucherForm['controls']['ppreviousdisbursedamount'].setValue(0);


    } catch (e) {
      this._commonService.showErrorMessage(e);
    }

    //for (let i = 0; i < this.stagepaymentlist.length; i++) {
    //  if (this.stagepaymentlist[i].pstagename == data.pstagename) {
    //    this.stagepaymentlist[i] = data;
    //    if (data.pstagestatus == true)
    //      disbursalamount = disbursalamount + data.pstageamount;
    //    //break;
    //  }
    //  else {
    //    if (this.stagepaymentlist[i].pstagestatus == true) {
    //      disbursalamount = disbursalamount + this.stagepaymentlist[i].pstageamount;
    //    }
    //  }
    //}

  }


  checkStageWisePayments(isValid): boolean {
    debugger;
    if (this.paymentVoucherForm.controls.pdisbursedtype.value == 'STAGE PAYMENT') {
      let stagedata = this.stagepaymentlist.filter(c => c.pstagepaidstatus == false || c.pstageadjuststatus == true);

      let stageselecteddata = stagedata.filter(c => (c.pstagestatus == true || c.pstageadjuststatus == true));

      let stagecount = 0;
      if (stageselecteddata != null) {
        if (stageselecteddata.length > 0) {
          for (let i = 0; i < stagedata.length; i++) {

            let status = stagedata[i].pstagestatus;
            if (status == false) {
              stagecount = 1;
            }
            else {
              if (stagecount > 0) {
                isValid = false;
                break;
              }
            }
          }
          if (!isValid) {
            this._commonService.showWarningMessage('Select stages in sequence order');
          }
        }
        else {
          isValid = false;
          this._commonService.showWarningMessage('Select stage wise payments');
        }
      }
      else {
        isValid = false;
        this._commonService.showWarningMessage('Select stage wise payments');
      }
    }
    return isValid;
  }
  validateLoanDisbursement(): boolean {

    let isValid = true;
    isValid = this.checkValidations(this.paymentVoucherForm, isValid);
    if (isValid) {
      isValid = this.checkStageWisePayments(isValid);
    }

    if (isValid) {



      let loandisbusalamount = this.paymentVoucherForm.controls.ploandisbusalamount.value;
      if (isNullOrEmptyString(loandisbusalamount)) {
        loandisbusalamount = 0;

        this.formValidationMessages['ploandisbusalamount'] = 'Current Loan Payout Amount';
        isValid = false;
      }
      else
        loandisbusalamount = parseFloat(loandisbusalamount.toString().replace(/,/g, ""));

      let loandisbusableamount = this.paymentVoucherForm.controls.ploanpayoutamount.value;
      if (isNullOrEmptyString(loandisbusableamount))
        loandisbusableamount = 0;
      else
        loandisbusableamount = parseFloat(loandisbusableamount.toString().replace(/,/g, ""));

      let loandisbusedamount = this.paymentVoucherForm.controls.ploandisbusableamount.value;
      if (isNullOrEmptyString(loandisbusedamount))
        loandisbusedamount = 0;
      else
        loandisbusedamount = parseFloat(loandisbusedamount.toString().replace(/,/g, ""));

      if (loandisbusableamount < loandisbusedamount) {
        isValid = false;
        this._commonService.showWarningMessage('Amount disbursed should be less than or equal to Amount available to disburse');
      }

      let approveddate = this._commonService.formatDateFromDDMMYYYY(this.paymentVoucherForm.controls.papproveddate.value);
      let installmentdate = this.paymentVoucherForm.controls.pinstallmentstartdate.value;
      let disburseddate = this.paymentVoucherForm.controls.ppaymentdate.value;
      if (new Date(disburseddate) < new Date(approveddate)) {
        this._commonService.showWarningMessage('Disburse date should be greater than or equal to approved date');
        isValid = false;
      }
      debugger;
      if (this.paymentVoucherForm.controls.pexistingdisbursestatus.value == 'NO' && this.paymentVoucherForm.controls.pdisbursestatus.value == 'FINAL') {
        if (new Date(installmentdate) < new Date(disburseddate)) {
          this._commonService.showWarningMessage('Installment Start Date should be greater than or equal to disburse date');
          isValid = false;
        }
      }

      let receiptlist = this.chargesreceiptlist.filter(x => x.pchequestatus == 'NO')
      if (receiptlist != null) {
        if (receiptlist.length > 0) {
          this._commonService.showWarningMessage('Previous transation has not reconsolate');
          isValid = false;
        }
      }
      debugger;
      let paidvalue = this.paymentVoucherForm.controls.ploandisbusalamount.value;

      if (!isNullOrEmptyString(paidvalue))
        paidvalue = parseFloat(paidvalue.toString().replace(/,/g, ""));
      else
        paidvalue = 0;
      if (paidvalue <= 0) {

        this._commonService.showWarningMessage('Amount disbursed should be greater than zero');
        isValid = false;

      }
      if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
        if (this.cashBalance.indexOf('D') > -1) {
          let cashvalue = this.cashBalance.split('D')[0];

          cashvalue = parseFloat(cashvalue.toString().replace(/,/g, ""));

          let paidvalue = this.paymentVoucherForm.controls.ploandisbusalamount.value;
          if (!isNullOrEmptyString(paidvalue))
            paidvalue = parseFloat(paidvalue.toString().replace(/,/g, ""));
          else
            paidvalue = 0;
          if (parseFloat(paidvalue) > parseFloat(cashvalue)) {
            this._commonService.showWarningMessage('Insufficient Cash Balance');
            isValid = false;
          }
        }
        else {
          this._commonService.showWarningMessage('Insufficient Cash Balance');
          isValid = false;
        }
      }

      let pdisbursedtype = this.paymentVoucherForm.controls.pdisbursedtype.value;
      if (pdisbursedtype == "MULTIPLE DISBURSEMENT" && this.paymentVoucherForm.controls.pdisbursestatus.value == 'FINAL') {

        let pemiday = parseFloat(this.paymentVoucherForm.controls.pemiday.value);
        let firstinstallmentdate = this.paymentVoucherForm.controls.pinstallmentstartdate.value
        let selectedEmiDay = parseFloat(firstinstallmentdate.getDate());
        if (pemiday != selectedEmiDay) {
          this._commonService.showWarningMessage('Installment start day must be equal to emi day...');
          isValid = false;
        }
      }
    }
    return isValid;

  }
  clearLoanDisbursement() {
    this.ngOnInit();
  }
  SaveLoanDisbursement() {
    debugger;
    this.disablesavebutton = true;
    this.savebutton = 'Processing';
    //console.log(this.formValidationMessages);
    if (this.validateLoanDisbursement()) {

      let loanchargestamount = this.adjustchargeslist.reduce((sum, c) => sum + parseFloat((c.pchargebalance.toString()).replace(/,/g, "")), 0);
      let existingloanssadjustedamount = this.otheroutstandingloanslist.reduce((sum, c) => sum + parseFloat((c.padjustedamount.toString()).replace(/,/g, "")), 0);

      this.paymentVoucherForm['controls']['pchargesadjustedamount'].setValue(loanchargestamount);

      this.paymentVoucherForm['controls']['pexistingloanssadjustedamount'].setValue(this._commonService.currencyformat(existingloanssadjustedamount));
      if (this.paymentVoucherForm.controls.pmodofpayment.value == 'ADJUSTMENT' || this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
        this.paymentVoucherForm['controls']['pbankid'].setValue(0);
      }

      let stagewisedata = this.stagepaymentlist.filter(x => x.pstagestatus == true)
      let stagewisepaymentslist = { pstagewisepaymentslist: stagewisedata };

      let adjustchargeslist = { padjustchargeslist: this.adjustchargeslist };

      this.paymentVoucherForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      this.paymentVoucherForm['controls']['ptypeofoperation'].setValue(this._commonService.ptypeofoperation);





      let pAdvanceEmiAmount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].value);

      let pBrowkenAmount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['pBrowkenAmount'].value);
      if (this.paymentVoucherForm.controls.ploanpayin.value == 'Weekly') {
        this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(0);
      } else {
        this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(pAdvanceEmiAmount);
      }
      this.paymentVoucherForm['controls']['pBrowkenAmount'].setValue(pBrowkenAmount);
      let Disbursementdata = Object.assign(this.paymentVoucherForm.value, stagewisepaymentslist, adjustchargeslist);





      let data = JSON.stringify(Disbursementdata);

      this._DisbusementService.SaveLoanDisbursement(data).subscribe(res => {
        debugger

        if (res[0] == 'TRUE') {

          let modeoftype = this.paymentVoucherForm.controls.pmodofpayment.value;
          this._commonService.showInfoMessage("Saved sucessfully");

          let vchapplicationid = this.paymentVoucherForm.controls.pvchapplicationid.value;
          // this.clearLoanDisbursement();
          this._routes.navigate(['/DisbursementView'])
          this.enableSavebutton();

          let papprovedloanamount = this.paymentVoucherForm.controls.papprovedloanamount.value;
          if (isNullOrEmptyString(papprovedloanamount))
            papprovedloanamount = 0;
          else
            papprovedloanamount = parseFloat(papprovedloanamount.toString().replace(/,/g, ""));

          let ppreviousdisbursedamount = this.paymentVoucherForm.controls.ppreviousdisbursedamount.value;
          if (isNullOrEmptyString(ppreviousdisbursedamount))
            ppreviousdisbursedamount = 0;
          else
            ppreviousdisbursedamount = parseFloat(ppreviousdisbursedamount.toString().replace(/,/g, ""));

          let ploandisbusableamount = this.paymentVoucherForm.controls.ploandisbusableamount.value;
          if (isNullOrEmptyString(ploandisbusableamount))
            ploandisbusableamount = 0;
          else
            ploandisbusableamount = parseFloat(ploandisbusableamount.toString().replace(/,/g, ""));

          let ploanadjustmentamount = this.paymentVoucherForm.controls.ploanadjustmentamount.value;
          if (isNullOrEmptyString(ploanadjustmentamount))
            ploanadjustmentamount = 0;
          else
            ploanadjustmentamount = parseFloat(ploanadjustmentamount.toString().replace(/,/g, ""));

          let pBrowkenAmount = this.paymentVoucherForm.controls.pBrowkenAmount.value;
          if (isNullOrEmptyString(pBrowkenAmount))
            pBrowkenAmount = 0;
          else
            pBrowkenAmount = parseFloat(pBrowkenAmount.toString().replace(/,/g, ""));

          let pAdvanceEmiAmount = this.paymentVoucherForm.controls.pAdvanceEmiAmount.value;
          if (isNullOrEmptyString(pAdvanceEmiAmount))
            pAdvanceEmiAmount = 0;
          else
            pAdvanceEmiAmount = parseFloat(pAdvanceEmiAmount.toString().replace(/,/g, ""));

          let paidLoanAmount = ppreviousdisbursedamount + ploandisbusableamount;
          if (paidLoanAmount == papprovedloanamount) {
            window.open('/#/EmiChartReport?id=' + btoa(vchapplicationid));
          }
          if (modeoftype != "ADJUSTMENT") {
            let receipt = btoa(res[1] + ',' + 'Payment Voucher');
            window.open('/#/PaymentVoucherReports?id=' + receipt);
          }
          else {

            let receipt = btoa(res[1] + ',' + 'Journal Voucher');

            window.open('/#/JournalvoucherReport?id=' + receipt);
          }

        }
      },
        (error) => {
          //this.isLoading = false;
          this.enableSavebutton();
          this._commonService.showErrorMessage(error);
        });
    }
    else {
      this.enableSavebutton();
    }
  }
  enableSavebutton() {
    this.disablesavebutton = false;
    this.savebutton = 'Save';
  }

  ploandisbusalamount_change() {
    debugger
    this.formValidationMessages['ploandisbusableamount'] = '';
    // this.getDisburmentalData();
    this.GetAdvanceEMIAmount();
    this.GetBrowkenDaysandAmount()
    this.loandisbursalCal();
  }

  loandisbursalCal() {
    let loanadjustmentamount = this.paymentVoucherForm.controls.ploanadjustmentamount.value;
    if (isNullOrEmptyString(loanadjustmentamount))
      loanadjustmentamount = 0;
    else
      loanadjustmentamount = parseFloat(loanadjustmentamount.toString().replace(/,/g, ""));

    let loandisbursedamountamount = this.paymentVoucherForm.controls.ploandisbusableamount.value;
    if (isNullOrEmptyString(loandisbursedamountamount))
      loandisbursedamountamount = 0;
    else
      loandisbursedamountamount = parseFloat(loandisbursedamountamount.toString().replace(/,/g, ""));

    let pBrowkenAmount = this.paymentVoucherForm['controls']['pBrowkenAmount'].value;
    if (isNullOrEmptyString(pBrowkenAmount))
      pBrowkenAmount = 0;
    else
      pBrowkenAmount = parseFloat(pBrowkenAmount.toString().replace(/,/g, ""));


    let pAdvanceEmiAmount = this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].value;
    if (isNullOrEmptyString(pAdvanceEmiAmount))
      pAdvanceEmiAmount = 0;
    else
      pAdvanceEmiAmount = parseFloat(pAdvanceEmiAmount.toString().replace(/,/g, ""));


    let loandisbursableamount = parseFloat((loandisbursedamountamount - loanadjustmentamount - pBrowkenAmount - pAdvanceEmiAmount).toFixed(2));

    this.paymentVoucherForm['controls']['ploandisbusalamount'].setValue(this._commonService.currencyformat(loandisbursableamount));
  }

  GetBrowkenDaysandAmount() {
    debugger
    this.paymentVoucherForm['controls']['pBrowkenAmount'].setValue(0);
    this.paymentVoucherForm['controls']['pBrowkendays'].setValue(0);
    let ploandisbusableamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.ploandisbusableamount.value);
    let ploandisbusalamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ploandisbusalamount'].value);
    let intrestrate = this.paymentVoucherForm.controls.prateofinterest.value;
    let tenure = this.paymentVoucherForm.controls.ptenureofloan.value;
    let disbursedate = this.paymentVoucherForm.controls.ppaymentdate.value
    disbursedate = this.datepipe.transform(disbursedate, 'yyyy-MM-dd');
    let firstinstallmentdate = this.paymentVoucherForm.controls.pinstallmentstartdate.value;
    firstinstallmentdate = this.datepipe.transform(firstinstallmentdate, 'yyyy-MM-dd');
    let pdisbursedtype = this.paymentVoucherForm.controls.pdisbursedtype.value;
    let pvchapplicationid = this.paymentVoucherForm.controls.pvchapplicationid.value;
    let ploanpayin = this.paymentVoucherForm.controls.ploanpayin.value;
    let emiday = this.paymentVoucherForm.controls.pemiday.value;
    let papprovedloanamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.papprovedloanamount.value);
    let ppreviousdisbursedamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.ppreviousdisbursedamount.value);
    let disbursementstatus: any;
    let paidLoanAmount = ppreviousdisbursedamount + ploandisbusableamount;
    if (paidLoanAmount == papprovedloanamount) {
      disbursementstatus = 'FINAL';

    } else {
      disbursementstatus = '';
    }
    this.paymentVoucherForm.controls.pdisbursestatus.setValue(disbursementstatus);
    this.emiData = [];
    if (this.paymentVoucherForm.controls.pdisbursedtype.value == 'MULTIPLE DISBURSEMENT') {
      this.paymentVoucherForm['controls']['pBrowkenAmount'].setValue(0);
      this.paymentVoucherForm['controls']['pBrowkendays'].setValue(0);
      this.loandisbursalCal();
      return
    }
    if (pdisbursedtype && pvchapplicationid && papprovedloanamount && ploandisbusableamount && intrestrate && tenure && disbursedate && firstinstallmentdate) {
      this._commonService.GetBrowkenDaysandAmountData(pdisbursedtype, pvchapplicationid, emiday, papprovedloanamount, ploandisbusableamount, intrestrate, tenure, disbursedate, firstinstallmentdate, disbursementstatus, ploanpayin).subscribe(browkenDaysandAmountData => {
        this.paymentVoucherForm['controls']['pBrowkenAmount'].setValue(0);
        this.paymentVoucherForm['controls']['pBrowkendays'].setValue(0);
        this.paymentVoucherForm['controls']['pBrowkenAmount'].setValue(this._commonService.currencyformat(browkenDaysandAmountData[0].pBrowkenAmount));
        this.paymentVoucherForm['controls']['pBrowkendays'].setValue(browkenDaysandAmountData[0].pBrowkendays);
        // let ploanadjustmentamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.ploanadjustmentamount.value);
        // let pBrowkenAmount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.pBrowkenAmount.value);
        // let ploandisbusalamountvalue = ploandisbusalamount - pBrowkenAmount;
        // this.paymentVoucherForm['controls']['ploandisbusalamount'].setValue(this._commonService.currencyformat(ploandisbusalamountvalue));
        this.loandisbursalCal();
      });
    }
  }
  GetAdvanceEMIAmount() {
    debugger
    this.emiData = [];
    this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(0);
    let intrestrate = this.paymentVoucherForm.controls.prateofinterest.value;
    let tenure = this.paymentVoucherForm.controls.ptenureofloan.value;
    let papprovedloanamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.papprovedloanamount.value);
    let emitype = this.paymentVoucherForm.controls.emitype.value;
    if (papprovedloanamount && intrestrate && tenure && emitype) {
      this._DisbusementService.GetAdvanceEMIAmount(papprovedloanamount, intrestrate, tenure, emitype).subscribe(res => {
        debugger
        this.emiData = res;
        this.bindEmiType()
      });
    }
  }
  bindEmiType() {

    let ploandisbusalamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ploandisbusalamount'].value);
    let ploandisbusableamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.ploandisbusableamount.value);
    let papprovedloanamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.papprovedloanamount.value);
    let emitype = this.paymentVoucherForm.controls.emitype.value;
    let ppreviousdisbursedamount = this.paymentVoucherForm.controls.ppreviousdisbursedamount.value;
    if (isNullOrEmptyString(ppreviousdisbursedamount))
      ppreviousdisbursedamount = 0;
    else
      ppreviousdisbursedamount = parseFloat(ppreviousdisbursedamount.toString().replace(/,/g, ""));
    let paidLoanAmount = ppreviousdisbursedamount + ploandisbusableamount;
    if (paidLoanAmount == papprovedloanamount && emitype == 'ADVANCE') {
      this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(0);
      this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(this._commonService.currencyformat(this.emiData[0].pAdvanceEmiAmount));
      this.loandisbursalCal();
      // let pAdvanceEmiAmount = this._commonService.removeCommasInAmount(this.paymentVoucherForm.controls.pAdvanceEmiAmount.value);
      // let ploandisbusalamountvalue = ploandisbusalamount - pAdvanceEmiAmount;
      // this.paymentVoucherForm['controls']['ploandisbusalamount'].setValue(this._commonService.currencyformat(ploandisbusalamountvalue));
    } else {
      this.paymentVoucherForm['controls']['pAdvanceEmiAmount'].setValue(0);
      this.loandisbursalCal();
    }
  }

}
