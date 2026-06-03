import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-gst-payment-voucher',
  templateUrl: './gst-payment-voucher.component.html',
  styles: []
})
export class GstPaymentVoucherComponent implements OnInit {
  gstForm: FormGroup;

  GridData1: any = [];
  checkedValuesForSave: any = [];
  paymentVoucherForm: FormGroup;
  allChecked: boolean = false;
  upinameslist = [];
  invoicedueGridTotal: any = 0;
  amountTopayGridTotal: any = 0;
  isLoading: boolean = false;
  GridData: any = [];
  pcontactid: number = 0;
  partyNamesList: any = [];
  chequenumberslist = [];
  bankbookBalance: any;
  bankpassbookBalance: any;
  currentDate: Date = new Date();
  ledgerBalance: any;
  subledgerBalance: any;
  partyBalance: any;
  showModeofPayment = true;
  showTypeofPayment = false;
  showtranstype = false;
  showbankcard = true;
  showbranch = true;
  showfinancial = true;
  showupi: boolean = false;
  showchequno = true;
  showgst = true;
  showtds = true;
  upiidlist: any;
  imageResponse: any;
  showgstamount = false;
  showigst = false;
  showcgst = false;
  showsgst = false;
  showutgst = false;
  showgstno = false;
  banklist: any = [];
  modeoftransactionslist: any = [];
  typeofpaymentlist: any = [];
  ledgeraccountslist: any = [];
  partylist: any = [];
  gstlist: any = [];
  debitcardlist: any = [];
  showsubledger = true;
  disablesavebutton = false;
  savebutton = "Save";
  paymentlistcolumnwiselist: any;
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';
  bankBalance: any = 0;
  showTDS: boolean = false;
  cashBalance: any = 0;
  errorMessages: any = {};

  public dateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private fb: FormBuilder, private _commonService: CommonService, private _AccountingTransactionsService: AccountingTransactionsService) {
    this.dateConfig.dateInputFormat = "DD/MM/YYYY";
    this.dateConfig.showWeekNumbers = false;
  }

  ngOnInit() {

    this.gstForm = this.fb.group({
      partyName: [''],
      partyId: ['', Validators.required]
    });
    this.paymentVoucherForm = this.fb.group({
      ppaymentid: [''],
      ptotalpaidamount: [''],
      pnarration: ['', Validators.required],
      pmodofpayment: ['BANK'],
      pbankname: [''],
      pbranchname: [''],
      ptranstype: ['CHEQUE', Validators.required],
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
      pDocStorePath: [''],
      transDate: [this.currentDate]
    })
    this.getPartyDetails();
    this.getLoadData();
    this.BlurEventAllControll(this.gstForm);

    this.BlurEventAllControll(this.paymentVoucherForm);
  }
  getPartyDetails() {
    debugger;
    this._AccountingTransactionsService.getPartyDetail().subscribe(res => {
      this.partyNamesList = res;
      console.log("this is Part Names : ", res);
    })
  }

  partyNameChange(event) {
    debugger;
    this.GridData = [];
    this.amountTopayGridTotal = 0;
    this.invoicedueGridTotal = 0;
    this.pcontactid = 0;
    if (event.pcontactid) {
      this.pcontactid = event.pcontactid;
      this.gstForm.controls.partyName.setValue(event.pcontactmailingname);
    }
  }
  addppaymentsslistcontrols(): FormGroup {
    return this.fb.group({

      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null],

      pledgername: [''],
      pamount: [''],
      pactualpaidamount: [''],
      pgsttype: [''],
      pisgstapplicable: [false],
      pgstcalculationtype: [''],
      pgstpercentage: [0],
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
      pistdsapplicable: [true],
      pgstno: [''],
      pTdsSection: [''],
      pTdsSectionname: [''],
      pTdsPercentage: [0],
      ptdsamount: [''],
      ptdscalculationtype: ['EXCLUDE'],
      ppannumber: [''],
      pState: [''],
      pStateId: [0],

      pigstpercentage: [''],
      pcgstpercentage: [''],
      psgstpercentage: [''],
      putgstpercentage: [''],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      ptotalamount: [''],
    });
  }

  showGridData() {
    debugger;
    this.invoicedueGridTotal = 0;
    this.amountTopayGridTotal = 0;
    this.allChecked = false;
    if (this.checkValidations(this.gstForm, true)) {
      this.isLoading = true;
      this._AccountingTransactionsService.getGSTVoucherDetailsByID(this.pcontactid).subscribe(res => {
        console.log("this is Grid Data : ", res);
        this.isLoading = false;
        this.GridData = res;
        this.invoicedueGridTotal = this.GridData.reduce((sum, item) => sum + item.invoice_due_amount, 0);
        this.invoicedueGridTotal = this.invoicedueGridTotal.toFixed(2);
        this.GridData = this.GridData.map((item: any) => ({ ...item, originalTotalAmount: item.invoice_due_amount, amountToBepaid: item.invoice_due_amount }));

      }, error => {
        this._commonService.showErrorMessage(error);
      });
    }
  }
  toggleAllRows(event: any): void {
    debugger;
    this.allChecked = event.target.checked;

    this.amountTopayGridTotal = 0;

    if (!this.GridData || this.GridData.length === 0) {
      return;
    }

    this.GridData.forEach(item => {
      item.selectvalue = this.allChecked;
      this._commonService.currencyformat(item.invoice_paid_amount);
    });
    if (this.allChecked) {
      this.amountTopayGridTotal = this.GridData.reduce((sum, item) => sum + item.invoice_paid_amount, 0);
      this.amountTopayGridTotal = this.amountTopayGridTotal.toFixed(2);
    }
  }
  checkedRow(event, dataItem) {
    debugger;
    const isChecked = event.target.checked;
    if (event.target.checked) {
      dataItem.invoice_paid_amount = dataItem.invoice_due_amount;
      dataItem.selectvalue = true;
    }
    dataItem.selectvalue = isChecked;
    this.amountTopayGridTotal = 0;
    if (!isChecked) {
      this.allChecked = false;
      dataItem.selectvalue = false;
    }
    this.GridData.forEach(item => {
      if (item.selectvalue) {
        this.amountTopayGridTotal = this.amountTopayGridTotal + Number(item.invoice_paid_amount);
        this.amountTopayGridTotal = this.amountTopayGridTotal.toFixed(2);
      }
    });
  }
  getLoadData() {
    debugger
    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {

      //console.log(json)
      if (json != null) {

        this.banklist = json.banklist;
        this.modeoftransactionslist = json.modeofTransactionslist;
        this.typeofpaymentlist = this.gettypeofpaymentdata();
        this.ledgeraccountslist = json.accountslist;
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
  modeofPaymentChange() {
    debugger
    if (this.paymentVoucherForm.controls.pmodofpayment.value == "CASH") {
      this.paymentVoucherForm['controls']['pbankid'].setValue('');
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.showtranstype = false;

    }
    else if (this.paymentVoucherForm.controls.pmodofpayment.value == "BANK") {
      this.paymentVoucherForm['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.showtranstype = true;
    }
    else {
      this.showModeofPayment = true;
      this.showtranstype = false;
    }
    this.transofPaymentChange();
    //this.getpartyJournalEntryData();

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
  clear() {
    this.gstForm.controls.partyId.setValue('');
    this.GridData = [];
    this.modeofPaymentChange();
  }

  validateEnterAmount(dataItem) {
    debugger;
    this.amountTopayGridTotal = 0;
    const amounttopay = this._commonService.removeCommasInAmount(dataItem.invoice_paid_amount);
    const originalAmount = Number(this._commonService.removeCommasInAmount(dataItem.originalTotalAmount));
    if (amounttopay > 0) {
      if (amounttopay > originalAmount) {
        this._commonService.showWarningMessage("Entered amount cannot be more than the  due amount");
        dataItem.invoice_paid_amount = dataItem.originalTotalAmount;
        return;
      }
    }
    else {
      dataItem.invoice_paid_amount = dataItem.invoice_paid_amount;
    }
    this.GridData.forEach(item => {
      if (item.selectvalue) {
        this.amountTopayGridTotal = this.amountTopayGridTotal + Number(item.invoice_paid_amount);
      }
    });
  }
  addModeofpaymentValidations() {

    let modeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.paymentVoucherForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.paymentVoucherForm['controls']['pbankname'];
    let chequeControl = <FormGroup>this.paymentVoucherForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.paymentVoucherForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

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
    else {
      modeofpaymentControl.clearValidators();
      bankControl.clearValidators();
      chequeControl.clearValidators();

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
    this.errorMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
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

  gettypeofpaymentdata(): any {

    let data = this.modeoftransactionslist.filter(function (payment) {
      return payment.ptranstype != payment.ptypeofpayment;
    });
    return data;
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
  getBankBranchName(pbankid) {
    debugger;
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
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
          this.errorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;

              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.errorMessages[key] += errormessage + ' ';
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

  checkValidations(group: FormGroup, isValid: boolean): boolean {

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
      this.paymentVoucherForm['controls']['pUpiid'].setValue('');
      //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname', true);
  }
  upid_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid', true);

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
    this.errorMessages['pChequenumber'] = '';
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

  saveGSTPaymentVoucher() {
    debugger;


    this.checkedValuesForSave = this.GridData.filter(obj => obj.selectvalue == true);

    if (this.checkedValuesForSave.length == 0) {
      this._commonService.showWarningMessage('Please Select');
      return;
    }
    this.isLoading = true;


    const invalidInvoices = this.checkedValuesForSave.filter(item => item.invoice_due_amount === 0);

    if (invalidInvoices.length > 0) {
      this._commonService.showWarningMessage('One or more selected invoices have a due amount of 0. They cannot be saved.');
      return;
    }


    //let  ppaymentslistDAta = [];
    for (let i = 0; i < this.checkedValuesForSave.length; i++) {
      let data = {
        "pgstnumber": this.checkedValuesForSave[i].pgstvoucherno,
        "ppartyname": this.gstForm.controls.partyName.value,
        "ppartyid": this.pcontactid,
        // "pTdsSection": this.tdsshowForm.controls.sectionName.value,
        // "pTdsPercentage": this.tdsshowForm.controls.percentage.value,
        // "ptdsamount": this.tdsshowForm.controls.amount.value,
        "pgstvoucherno": this.checkedValuesForSave[i].pgstvoucherno,
        "pamount": this.checkedValuesForSave[i].invoice_paid_amount,
        "pgstpercentage": 0,
        "pigstamount": this.checkedValuesForSave[i].igst_amount,
        "pcgstamount": this.checkedValuesForSave[i].cgst_amount,
        "psgstamount": this.checkedValuesForSave[i].sgst_amount,
        "putgstamount": 0,
        "psubledgerid": this.checkedValuesForSave[i].pcreditaccountid,
        "pState": this.checkedValuesForSave[i].pstate,
        "pStateId": 0,
        "createdby": this._commonService.pCreatedby,
        "modifiedby": this._commonService.pCreatedby,
        "pCreatedby": this._commonService.pCreatedby,
        "pModifiedby": this._commonService.pCreatedby,

      }
      this.GridData1.push(data)

    }
    let data1 = {
      "ppartyname": this.gstForm.controls.partyName.value,
      "ppartyid": this.pcontactid,
      "pistdsapplicable": this.showTDS,
      // "pTdsSection": this.tdsshowForm.controls.sectionName.value,
      // "pTdsPercentage": this.tdsshowForm.controls.percentage.value,
      // "ptdsamount": this.tdsshowForm.controls.amount.value,

      "ppaymentslist": this.GridData1,
      "pFilename": "",
      "pFilepath": "",
      "pFileformat": "",
      "pFormName": "GST PAYMENT VOUCHER",
      "formname": "GST PAYMENT VOUCHER",
      "paymentType": {},
      "pbankname": this.paymentVoucherForm.controls.pbankname.value,
      "pbranchname": this.paymentVoucherForm.controls.pbranchname.value,
      "ptranstype": this.paymentVoucherForm.controls.ptranstype.value,
      "ptypeofpayment": this.paymentVoucherForm.controls.ptypeofpayment.value,
      "pChequenumber": this.paymentVoucherForm.controls.pChequenumber.value,
      "pparticulars": this.paymentVoucherForm.controls.pnarration.value,
      "pchequedate": this.paymentVoucherForm.controls.pchequedate.value,
      "pbankid": this.paymentVoucherForm.controls.pbankid.value,
      "pCardNumber": this.paymentVoucherForm.controls.pCardNumber.value,
      "ppaymentdate": this.paymentVoucherForm.controls.transDate.value,
      "pmodofPayment": this.paymentVoucherForm.controls.pmodofpayment.value,

      "pUpiname": this.paymentVoucherForm.controls.pUpiname.value,
      "pUpiid": this.paymentVoucherForm.controls.pUpiid.value,
      "createdby": this._commonService.pCreatedby,
      "modifiedby": this._commonService.pCreatedby,
      "pCreatedby": this._commonService.pCreatedby,
      "pModifiedby": this._commonService.pCreatedby,
      "ptypeofoperation": "CREATE"
    }
    if (confirm("Do you want to save ?")) {
      this._AccountingTransactionsService.saveGSTPaymentVoucher(data1).subscribe(res => {
        window.open('/#/PaymentVoucherReports?id=' + btoa(res[1] + ',' + 'Payment Voucher'));
        this._commonService.showInfoMessage('Saved Successfully');
        this.clear();
        this.isLoading = false;

      })
    }
    else {
      this.isLoading = false;

    }
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

}
