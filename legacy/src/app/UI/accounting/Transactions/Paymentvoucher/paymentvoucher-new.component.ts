import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { debug } from 'util';

@Component({
  selector: 'app-paymentvoucher-new',
  templateUrl: './paymentvoucher-new.component.html',
  styles: []
})
export class PaymentvoucherNewComponent implements OnInit {
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
  imageResponse: any;
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
  pledgername: any;

  bankBalance: any; list: any;
  ;
  bankbookBalance: any;;
  bankpassbookBalance: any;;
  ledgerBalance: any;;
  subledgerBalance: any;;
  partyBalance: any;;
  partyjournalentrylist: any;
  gst: boolean = true
  tds: boolean = true
  disablegst: boolean;
  disabletds = false;
  disableaddbutton = false;
  addbutton = "Add";
  disablesavebutton = false;
  savebutton = "Save";

  JSONdataItem: any = [];

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public selectableSettings: SelectableSettings;
  public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  disabletransactiondate = false;
  bankcount: number = 0;
  cashBalanceAmount: number = 0;
  constructor(private _FormBuilder: FormBuilder, private datepipe: DatePipe, private zone: NgZone, private _commonService: CommonService, private _routes: Router, private _AccountingTransactionsService: AccountingTransactionsService) {
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.showWeekNumbers = false;
    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.dateInputFormat = 'DD/MM/YYYY';
  }
  paymentVoucherForm: FormGroup;
  public groups: GroupDescriptor[] = [{ field: 'type' }];

  public gridView: DataResult;
  ngOnInit() {
    debugger;
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.disablegst = false;
    this.paymentlistcolumnwiselist = {};
    this.paymentslist = [];
    this.formValidationMessages = {};
    this.paymentVoucherForm = this._FormBuilder.group({
      ppaymentid: [''],
      ppaymentdate: ['', Validators.required],
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
      pDocStorePath: ['']
    })
    this.modeofPaymentChange();

    this.isgstapplicableChange();
    this.istdsapplicableChange();
    let date = new Date();

    this.paymentVoucherForm['controls']['ppaymentdate'].setValue(date);
    this.getLoadData();
    this.BlurEventAllControll(this.paymentVoucherForm);

  }

  addppaymentsslistcontrols(): FormGroup {
    return this._FormBuilder.group({

      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null],

      pledgername: ['', Validators.required],
      pamount: [''],
      pactualpaidamount: ['', Validators.required],
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

      pigstpercentage: [''],
      pcgstpercentage: [''],
      psgstpercentage: [''],
      putgstpercentage: [''],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      ptotalamount: [''],
    })
  }


  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.loadgrid();
  }
  private loadgrid(): void {
    this.gridView = process(this.partyjournalentrylist, { group: this.groups });
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

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;

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

  modeofPaymentChange() {

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
    else {
      this.showModeofPayment = true;
      this.showtranstype = false;
    }
    this.transofPaymentChange();
    this.getpartyJournalEntryData();

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

  isgstapplicable_Checked() {

    let ppartyname = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ppartyname').value;
    let checkexistingcount = 0;

    let griddata = this.paymentslist.filter(x => x.ppartyname == ppartyname);
    if (griddata != null) {
      if (griddata.length > 0) {
        checkexistingcount = 1;
      }
    }
    if (checkexistingcount == 1) {
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(griddata[0].pisgstapplicable);
    }
    this.isgstapplicableChange();

    //console.log(this.showgst);

  }

  istdsapplicable_Checked() {

    let ppartyname = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ppartyname').value;
    let checkexistingcount = 0;

    let griddata = this.paymentslist.filter(x => x.ppartyname == ppartyname);
    if (griddata != null) {
      if (griddata.length > 0) {
        checkexistingcount = 1;
      }
    }
    if (checkexistingcount == 1) {
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(griddata[0].pistdsapplicable);

    }
    this.istdsapplicableChange();

  }
  isgstapplicableChange() {


    let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;

    let gstCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'];
    let gstpercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'];
    let stateControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'];
    let gstamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'];

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


      this.showgst = false;
      if (this.disablegst == false)
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('');
    }
    gstCalculationControl.updateValueAndValidity();
    gstpercentageControl.updateValueAndValidity();
    stateControl.updateValueAndValidity();
    gstamountControl.updateValueAndValidity();

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
    debugger;
    this.cashBalanceAmount = 0;
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
        this._AccountingTransactionsService.setFilterAccountHeads(this.ledgeraccountslist);
        this.ledgeraccountslist = this._AccountingTransactionsService.getLedgerAccountsList1();
        this.ledgeraccountslist = this.ledgeraccountslist.filter(item => {
                    if (!item.pledgername) return true;
                    let name = item.pledgername.toLowerCase();
                    return !(
                        name.includes('sa transfer') ||
                        name.includes('rsd-transfer')
                    );
                });
        // this.ledgeraccountslist = this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' && item.pledgername !== 'TDS-194H PAYABLE' && item.pledgername !== 'TDS-194J PAYABLE' && item.pledgername !== 'HS-SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE-HRB' && item.pledgername !== 'OS-SALE ADVANCE' && item.pledgername !== 'INTEREST PAIDTO APPLICANT' && item.pledgername !== 'OUT STANDING PAYABLE' && item.pledgername !== 'OUTSTANDING PROMOTER SALARY' && item.pledgername !== 'INTEREST PAID A/C');

        this.cashBalanceAmount = json.cashbalance;

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

  // Getledgeraccountslist():any{     
  //   let list=this.ledgeraccountslist.filter(item => item.pledgername !== 'TDS-194A PAYABLE' && item.pledgername !== 'TDS-194H PAYABLE' && item.pledgername !== 'TDS-194J PAYABLE' && item.pledgername !== 'HS-SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE' && item.pledgername !== 'SALE ADVANCE-HRB' && item.pledgername !== 'OS-SALE ADVANCE' && item.pledgername !== 'INTEREST PAIDTO APPLICANT' && item.pledgername !== 'OUT STANDING PAYABLE' && item.pledgername !== 'OUTSTANDING PROMOTER SALARY' && item.pledgername !== 'INTEREST PAID A/C');
  //   return list;
  // }

  gettypeofpaymentdata(): any {

    let data = this.modeoftransactionslist.filter(function (payment) {
      return payment.ptranstype != payment.ptypeofpayment;
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
    debugger;
    this.bankcount = 0;
    let pledgerid;
    if (this.cashBalanceAmount && $event.pledgerid) {
      this._AccountingTransactionsService.getbankcount($event.pledgerid).subscribe(res => {
        if (res) {
          this.bankcount = res.pbankcount;
        }
      }, error => {
        this._commonService.showErrorMessage(error);
      });
    }

    if ($event != undefined) {
      pledgerid = $event.pledgerid;
      this.pledgername = $event.pledgername;
    }
    this.subledgeraccountslist = [];
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
    this.ledgerBalance = '';
    this.subledgerBalance = '';
    if (pledgerid && pledgerid != '') {

      const ledgername = $event.pledgername;

      let data = this.ledgeraccountslist.filter(function (ledger) {
        return ledger.pledgerid == pledgerid;
      })[0];
      this.setBalances('LEDGER', data.accountbalance);
      this.GetSubLedgerData(pledgerid);
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue(ledgername);
    }
    else {

      this.setBalances('LEDGER', 0);
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue('');
    }
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
    let psubledgerid;
    if ($event != undefined) {
      psubledgerid = $event.psubledgerid;
    }
    this.subledgerBalance = '';
    if (psubledgerid && psubledgerid != '') {
      const subledgername = $event.psubledgername;
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(subledgername);
      let data = this.subledgeraccountslist.filter(function (ledger) {
        return ledger.psubledgerid == psubledgerid;
      })[0];
      this.setBalances('SUBLEDGER', data.accountbalance);

    }
    else {

      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
      this.setBalances('SUBLEDGER', 0);
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername', true);
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
    debugger;
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
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
    this.gst = false
    this.tds = false;
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
        //gstnoControl.setValidators(Validators.required);
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
    debugger
    //let paidamount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value.toString().replace(/,/g, ""));

    //if (isNaN(paidamount))
    //    paidamount = 0;

    //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(paidamount);


    let amountPaid = parseFloat(this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value.toString().replace(/,/g, ""));
    let cashValidation = this.cashBalance.split(' ');
    if (cashValidation[0] == "0" && this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
      this._commonService.showWarningMessage('Cash Balance Not Available');
      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
      return;
    }

    let cashvalue = Number(cashValidation[0].toString().replace(/,/g, ""));


    if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
      if (this.bankcount == 1) {
        if (amountPaid > cashvalue) {
          this._commonService.showWarningMessage('Cash Payment Dosenot  Accept More Than Cash Balance');
          this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
          return
        }
      }
      else if (amountPaid > 10000 || amountPaid > cashvalue) {
        this._commonService.showWarningMessage('Cash Payment Dosenot  Accept More Than 10,000');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
        return
      }
    }

    let paidAmount = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value;

    let subBal = this.subledgerBalance.split(' ');

    let actSubBal = Number(subBal[0].toString().replace(/,/g, ""));

    if (this.pledgername == 'OUTSTANDING PROMOTER SALARY' || this.pledgername == 'SALE ADVANCE-HRB' || this.pledgername == 'OUT STANDING PAYABLE' || this.pledgername == 'INTEREST PAID A/C') {
      if (amountPaid > actSubBal) {
        this._commonService.showWarningMessage('Paid Amount Shouldnot Be Greaterthan Sub Ledger Balance');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
        return
      }
    }

    if (this.pledgername == 'INTEREST PAYABLE' || this.pledgername == 'PLOT ADVANCE' || this.pledgername == 'SALE ADVANCE') {
      if (amountPaid > actSubBal) {
        this._commonService.showWarningMessage('Paid Amount Shouldnot Be Greaterthan Sub Ledger Balance');
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
        return
      }
    }

    this.claculategsttdsamounts();
  }

  claculategsttdsamounts() {
    debugger;
    try {

      let paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pactualpaidamount').value;
      if (isNullOrEmptyString(paidamount))
        paidamount = 0;
      else
        paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));

      if (isNaN(paidamount))
        paidamount = 0;

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
            tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (100 + tdspercentage));
          }
          actualpaidamount = actualpaidamount - tdsamount;

        }
        else if (tdscalculationtype == 'EXCLUDE') {
          tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (100));

          actualpaidamount = actualpaidamount - tdsamount;
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


      gstamount = sgstamount + igstamount + cgstamount + utgstamount;
      totalamount = actualpaidamount + sgstamount + igstamount + cgstamount + utgstamount;
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

      this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalamount'].setValue(this._commonService.currencyformat(Math.round(totalamount)));

      this.formValidationMessages['pamount'] = '';
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  validateaddPaymentDetails(): boolean {

    let isValid: boolean = true;
    const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
    try {
      let verifyamount = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value;
      if (verifyamount == 0) {
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('')
      }
      isValid = this.checkValidations(formControl, isValid)
      let ledgername = formControl.controls.pledgername.value;
      let subledgername = formControl.controls.psubledgername.value;
      let partyid = formControl.controls.ppartyid.value;

      let griddata = this.paymentslist;

      let count = 0;


      for (let i = 0; i < griddata.length; i++) {
        if (griddata[i].pledgername == ledgername && griddata[i].psubledgername == subledgername && griddata[i].ppartyid == partyid) {
          count = 1;
          break;
        }

      }
      if (count == 1) {
        //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
        isValid = false;
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }


    return isValid;
  }
  addPaymentDetails() {
    debugger
    this.disableaddbutton = true;
    this.addbutton = "Processing";
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

      let partyidd = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ppartyid').value;
      if (isNullOrEmptyString(partyidd))
        this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(0);

      this.paymentslist.push(control.value);
      this.getpartyJournalEntryData();
      this.clearPaymentDetails();
      this.getPaymentListColumnWisetotals();
    }
    this.disableaddbutton = false;
    this.addbutton = "Add";
    this.bankcount = 0;
  }
  getPaymentListColumnWisetotals() {
    let totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0);
    this.paymentlistcolumnwiselist['ptotalamount'] = this._commonService.currencyformat(totalamount);

    totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount).replace(/,/g, "")), 0);
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
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue("");


    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
    this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
    this.setBalances('LEDGER', 0);
    this.setBalances('SUBLEDGER', 0);
    this.setBalances('PARTY', 0);
    this.istdsapplicable_Checked();
    this.isgstapplicable_Checked();
    this.formValidationMessages = {};

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
  validatesavePaymentVoucher(): boolean {

    let isValid: boolean = true;
    try {
      isValid = this.checkValidations(this.paymentVoucherForm, isValid);
      if (this.paymentslist.length == 0) {
        //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
        isValid = false;
      }
      if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
        if (this.cashBalance.indexOf('D') > -1) {
          let cashvalue = this.cashBalance.split('D')[0];

          cashvalue = parseFloat(cashvalue.toString().replace(/,/g, ""));
          let paidvalue = this.paymentVoucherForm.controls.ptotalpaidamount.value;
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
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }


    return isValid;
  }
  clearPaymentVoucher() {

    try {
      this.paymentslist = [];
      this.paymentVoucherForm.reset();
      this.cleartranstypeDetails();
      this.clearPaymentDetails();
      this.paymentVoucherForm['controls']['pmodofpayment'].setValue('CASH');
      this.modeofPaymentChange();

      let date = new Date();
      this.paymentVoucherForm['controls']['pInterestpaymentDate'].setValue(date);
      this.formValidationMessages = {};
      this.paymentlistcolumnwiselist = {};

      this.bankbookBalance = '0';
      this.bankpassbookBalance = '0';
      this.ledgerBalance = '0';
      this.subledgerBalance = '0';
      this.partyBalance = '0';
      this.partyjournalentrylist = [];
      this.imageResponse = {
        name: '',
        fileType: "imageResponse",
        contentType: '',
        size: 0,

      };
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  savePaymentVoucher() {
    debugger
    if (this.paymentslist.length <= 0) {
      this._commonService.showWarningMessage('Add Atleast One Item to Grid.');
      return;
    }

    this.disablesavebutton = true;

    this.savebutton = 'Processing';





    this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0));
    if (this.validatesavePaymentVoucher()) {
      //let bankid = this.paymentVoucherForm.controls.pbankid.value;
      //if (bankid == "" || bankid == null)
      //    this.paymentVoucherForm['controls']['pbankid'].setValue(0);

      if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
        this.paymentVoucherForm['controls']['pbankid'].setValue(0);
      }

      let newdata = { ppaymentslist: this.paymentslist };
      let paymentVoucherdata = Object.assign(this.paymentVoucherForm.value, newdata);
      debugger;
      let data = JSON.stringify(paymentVoucherdata);

      this._AccountingTransactionsService.savePaymentVoucher(data).subscribe(res => {
        debugger;
        console.log('this is payemmt dta:', res);

        if (res[0] == 'TRUE') {
          this.JSONdataItem = res;
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          this._commonService.showInfoMessage("Saved sucessfully");
          this.clearPaymentVoucher();
          this._routes.navigate(['/PaymentvoucherView']);

          window.open('/#/PaymentVoucherReports?id=' + btoa(res[1] + ',' + 'Payment Voucher'));

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
    debugger
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
          .filter(c => c.pledgername === ledgerdata[i]).reduce((sum, c) => (sum + parseFloat((c.pamount).replace(/,/g, "")) + parseFloat((c.ptdsamount).replace(/,/g, ""))), 0);
        dataobject = { type: 'Payment Voucher', accountname: ledgerdata[i], debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
        this.partyjournalentrylist.push(dataobject);

        let tdsdata = this.paymentslist.filter(c => c.pledgername === ledgerdata[i]);
        tdssectionwisedata = tdsdata.map(item => item.pTdsSection)
          .filter((value, index, self) => self.indexOf(value) === index)

        for (let j = 0; j < tdssectionwisedata.length; j++) {
          journalentryamount = tdsdata
            .filter(c => c.pTdsSection === tdssectionwisedata[j]).reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
          dataobject = { type: 'Journal Voucher' + index, accountname: 'TDS-' + tdssectionwisedata[j] + ' RECIVABLE', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
          tdsjournalentrylist.push(dataobject);
        }

        journalentryamount = tdsdata.reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
        if (journalentryamount > 0) {
          dataobject = { type: 'Journal Voucher' + index, accountname: ledgerdata[i], debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount) }
          tdsjournalentrylist.push(dataobject);
        }
        index = index + 1;
      }

      journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pigstamount).replace(/,/g, "")), 0);
      if (journalentryamount > 0) {
        dataobject = { type: 'Payment Voucher', accountname: 'P-IGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
        this.partyjournalentrylist.push(dataobject);
      }
      journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pcgstamount).replace(/,/g, "")), 0);
      if (journalentryamount > 0) {
        dataobject = { type: 'Payment Voucher', accountname: 'P-CGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
        this.partyjournalentrylist.push(dataobject);
      }
      journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.psgstamount).replace(/,/g, "")), 0);
      if (journalentryamount > 0) {
        dataobject = { type: 'Payment Voucher', accountname: 'P-SGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
        this.partyjournalentrylist.push(dataobject);
      }
      journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.putgstamount).replace(/,/g, "")), 0);
      if (journalentryamount > 0) {
        dataobject = { type: 'Payment Voucher', accountname: 'P-UTGST', debitamount: this._commonService.currencyformat(journalentryamount), creditamount: '' }
        this.partyjournalentrylist.push(dataobject);
      }

      journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0);
      if (journalentryamount > 0) {
        this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(this._commonService.currencyformat(journalentryamount));
        if (this.paymentVoucherForm.controls.pmodofpayment.value == "CASH") {
          dataobject = {
            type: 'Payment Voucher', accountname: 'CASH ON HAND', debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount)
          }
        }
        else {
          dataobject = { type: 'Payment Voucher', accountname: 'BANK', debitamount: '', creditamount: this._commonService.currencyformat(journalentryamount) }
        }
        this.partyjournalentrylist.push(dataobject);
      }
      //for (let i = 0; i < tdsjournalentrylist.length; i++) {
      //  this.partyjournalentrylist.push(tdsjournalentrylist[i]);
      //}

      this.loadgrid();
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  public removeHandler({ dataItem }) {

    const index: number = this.paymentslist.indexOf(dataItem);
    if (index !== -1) {
      this.paymentslist.splice(index, 1);
    }
    let journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount).replace(/,/g, "")), 0);
    this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(this._commonService.currencyformat(journalentryamount));
    this.getpartyJournalEntryData();
    this.clearPaymentDetails();
    this.getPaymentListColumnWisetotals()
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
