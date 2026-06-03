import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { SAReceiptService } from 'src/app/Services/Banking/Transactions/sa-receipt.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';

declare var $: any;
@Component({
  selector: 'app-share-withdrawal',
  templateUrl: './share-withdrawal.component.html',
  styles: []
})
export class ShareWithdrawalComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  sharewithdrawalform: FormGroup;
  withdrwalPaymentsList:FormGroup;
  buttonName = 'Save';
  disablesavebutton = false;
  savebutton = 'Save';
  formValidationMessages: any;
  public today: Date = new Date();
  ShareAccountNames:any = [];
  MemberDetails:any = [];
  ShareAccountNumbers:any=[];
 ShareAccountDetails:any=[];
 ptotalamount :any;
 pnomineename :any;
 pfacevalue  :any;
 pnoofsharesissued :any;
 pshareaccountnumber  :any;
 psharename :any;
 pmembername :any;
 pmembertype :any;
 psharesissuedate:any;


 public cashBalance: number = 0;
    public bankBalance: number = 0;
   banklist:any=[];
   banklist1:any=[];
  modeoftransactionslist:any=[];
  debitcardlist:any=[];
  SavingsMemberBalance:any=[];
  SavingAccountShowhide = false;
  showModeofPayment = false;
 showtranstype = false;
 showCheque = false;
 showOnline = false;
 showdebitcard = false;
 CommisionPaymentErrors:any=[];
 showupi:any;
   chequenumberslist:any = [];
   upiidlist:any=[];
   upinameslist:any;
   public typeofpaymentlist: any[];
   public commissionpaymentlist: any = [];
   total:any;
   pagentname : any = [];
   SavingsAccounts: any = [];
   pcommissionpaymentlist: any=[];
   agentcontactlist:any=[];
   bankbookBalance:any;
  bankpassbookBalance:any;
  ledgerBalance:any;
  subledgerBalance:any;
  partyBalance:any;

  displayCardName:any;
 showTypeofPayment = false;
 showbranch = false;
 showfinancial = false;
 showchequno = false;
 showbankcard = false;
 displaychequeno:any;
 disabletransactiondate = false;
  constructor(private formbuilder: FormBuilder,  private _commonService: CommonService, private datePipe: DatePipe, private router: Router, private _SaReceiptService: SAReceiptService, private _ShareapplicationService: ShareapplicationService,private _AccountingTransactionsService: AccountingTransactionsService) {

    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    //this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger;
    if (this._commonService.comapnydetails != null)
    this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.buttonName = 'Save';
    this.disablesavebutton = false;
    this.savebutton = 'Save';
    this.formValidationMessages = {};
    this.CommisionPaymentErrors={};
    this.ShareAccountDetails=[];
 this.getsharewithdrawalform();
 this.withdrwalPaymentsList=this.formbuilder.group(
  {
    "ppaymentid": '',
    "pTransType": '',
    "pTransTypeid": [0],
    "pPaidAmount": 0,
    "pOutstandingAmount": 0,
    "pLateFeeAmount": 0,
    "pVoucherid": '',
    "pAccountno": 0
  });
  this.BlurEventAllControll(this.sharewithdrawalform);
this.GetShareAccountNames();
this.getLoadData();
  }
  getsharewithdrawalform(){
    this.sharewithdrawalform = this.formbuilder.group({
      ppaymentdate: [this.today, Validators.required],
      ptotalpaidamount: '',
      pnarration:[''],
      pmodofpayment:['CASH'],
      pbankname: [''],
      pbranchname:[''],
      ptranstype:['CASH'],
      pCardNumber: [''],
      pUpiname: [''],
      pUpiid:[''],
      ptypeofpayment: [''],
      pChequenumber:[''],
      preferencenoonline:[''],
      pchequedate: [this.today, Validators.required],
      pfinancialservice:[''],
      preferencenodcard:[''],
      
       pbankid: 0,
       pSavingsMemberAccountid:[''],
       pShareconfigid:['',Validators.required],
       pshareaccountid:['',Validators.required],
       pshareaccountnumber:['',Validators.required],
       pShareNameCode:['',Validators.required],

       pCreatedby: [this._commonService.pCreatedby],
       pStatusname: [this._commonService.pStatusname],
       pMemberid:[''],
       pMembername: [''],
       ptypeofoperation: [this._commonService.ptypeofoperation],
       pPaymentType: ['CASH'],
       pNarration: ['',Validators.required],
       pStatus: [true],
    });
  }
  public GetShareAccountNames() {
    this.ShareAccountNames = [];
    this.MemberDetails = [];
    this._SaReceiptService.GetShareAccountNames().subscribe(json => {
      debugger;
      if (json) {
        this.ShareAccountNames = json;
      }
    });
  }
  AccountName_Change(event) {
    debugger;
     this.ShareAccountNumbers = [];
     this.ShareAccountDetails=[];
    this.sharewithdrawalform.controls.pmodofpayment.setValue('CASH');
     this.modeofPaymentChange();
     this.SavingsAccounts=[];
     this.sharewithdrawalform.controls.ptotalpaidamount.setValue('');
    this.sharewithdrawalform.controls.pshareaccountid.setValue('');
    this.formValidationMessages.pshareaccountid = null;
    this.sharewithdrawalform.controls.pshareaccountnumber.setValue('');
    this.sharewithdrawalform.controls.pMemberid.setValue('');
    this.sharewithdrawalform.controls.pMembername.setValue('');
    if (event != '') {
      let ShareConfigid = event.pShareconfigid;
      this.sharewithdrawalform.controls.pShareNameCode.setValue(event.pShareNameCode);
      this._ShareapplicationService.GetShareAccountNumbers(parseInt(ShareConfigid)).subscribe(res => {
        debugger;
        if (res) {
          this.ShareAccountNumbers = res;
        }
      })
    }
   

  }
  SharingAccountNo_Change(event) {
    debugger;
  //  this.cleartransDetails();
    if (event) {
     // this.GetSAandTransDetails('AccountDetails');
     this.sharewithdrawalform.controls.pmodofpayment.setValue('CASH');
     this.modeofPaymentChange();
     this.ShareAccountDetails = event;
      this.ptotalamount = this.ShareAccountDetails.ptotalamount;
      this.pnomineename = this.ShareAccountDetails.pnomineename;
      this.pfacevalue = this.ShareAccountDetails.pfacevalue;
      this.pnoofsharesissued = this.ShareAccountDetails.pnoofsharesissued;
      this.psharesissuedate = this.ShareAccountDetails.psharesissuedate;
  this.sharewithdrawalform.controls.pAccountno= event.pAccountid;
  this.withdrwalPaymentsList.controls.pTransTypeid.setValue(event.pshareaccountid);
  this.withdrwalPaymentsList.controls.pAccountno.setValue(event.pAccountid);

    
      this.pshareaccountnumber = this.ShareAccountDetails.pshareaccountnumber;
      this.psharename = this.ShareAccountDetails.psharename;
      this.pmembername = this.ShareAccountDetails.pmembername;
      this.pmembertype=this.ShareAccountDetails.pmembertype;
      this.sharewithdrawalform.controls.ptotalpaidamount.setValue(this._commonService.currencyformat(event.ptotalamount));
      this.sharewithdrawalform.controls.pMemberid.setValue(event.pmemberid);
      this.sharewithdrawalform.controls.pshareaccountnumber.setValue(event.pshareaccountnumber);
      this.sharewithdrawalform.controls.pMembername.setValue(event.pmembername);
      let ShareAccountId = parseInt(event.pshareaccountid);
      this.SavingsAccounts=[];
        this._SaReceiptService.GetSAvingsAccountDetails(event.pmembercode).subscribe(details => {
        this.SavingsAccounts = details;
      })
    }
   
  }

  getLoadData() {

    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {

      //console.log(json)
      if (json != null) {

        this.banklist = json.banklist;
        this.modeoftransactionslist = json.modeofTransactionslist;
        this.typeofpaymentlist = this.gettypeofpaymentdata();

        this.debitcardlist = json.bankdebitcardslist;
        debugger;
        this.setBalances('CASH', json.cashbalance);
        this.setBalances('BANK', json.bankbalance);

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

  modeofPaymentChange() {
    debugger;
     this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].setValue(0);
      this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].clearValidators();
      this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
      this.SavingsMemberBalance = 0;
    if (this.sharewithdrawalform.controls.pmodofpayment.value == "CASH") {
      this.sharewithdrawalform['controls']['pbankid'].setValue(0);
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.SavingAccountShowhide=false;
      this.showtranstype = false;

    }
    else if (this.sharewithdrawalform.controls.pmodofpayment.value == "BANK") {
      this.sharewithdrawalform['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.SavingAccountShowhide=false;
      this.showtranstype = true;
    }
    else if (this.sharewithdrawalform.controls.pmodofpayment.value == "ADJUSTMENT") {
      this.sharewithdrawalform['controls']['pbankid'].setValue(0);
      this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].setValue('');
      this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
      this.sharewithdrawalform['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
      this.SavingsMemberBalance = 0;
      this.SavingAccountShowhide=true;
      this.showModeofPayment = false;
      this.showtranstype = false;
    }
    else {
      this.showModeofPayment = true;
      this.SavingAccountShowhide=false;
      this.showtranstype = false;
    }
    this.transofPaymentChange();
    this.BlurEventAllControll(this.sharewithdrawalform);
  }
  transofPaymentChange() {
    debugger;
    this.displayCardName = 'Debit Card';
    this.showTypeofPayment = false;
    this.showbranch = false;
    this.showfinancial = false;
    this.showchequno = false;
    this.showbankcard = true;
    this.showupi = false;
    this.displaychequeno = 'Reference No';
    if (this.sharewithdrawalform.controls.ptranstype.value == "CHEQUE") {
      this.showbankcard = true;
      this.displaychequeno = 'Cheque No';
      this.showbranch = true;
      this.showchequno = true;
    }
    else if (this.sharewithdrawalform.controls.ptranstype.value == "ONLINE") {
      this.showbankcard = true;
      this.showTypeofPayment = true;
      this.showfinancial = false;
    }
    else if (this.sharewithdrawalform.controls.ptranstype.value == "DEBIT CARD") {
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
  addModeofpaymentValidations() {

    let modeofpaymentControl = <FormGroup>this.sharewithdrawalform['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.sharewithdrawalform['controls']['ptranstype'];
    let bankControl = <FormGroup>this.sharewithdrawalform['controls']['pbankid'];
    let chequeControl = <FormGroup>this.sharewithdrawalform['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.sharewithdrawalform['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.sharewithdrawalform['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

    let UpinameControl = <FormGroup>this.sharewithdrawalform['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.sharewithdrawalform['controls']['pUpiid'];

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
    this.sharewithdrawalform['controls']['pbankid'].setValue(0);
    this.sharewithdrawalform['controls']['pbankname'].setValue('');
    this.sharewithdrawalform['controls']['pCardNumber'].setValue('');
    this.sharewithdrawalform['controls']['ptypeofpayment'].setValue('');
    this.sharewithdrawalform['controls']['pbranchname'].setValue('');
    this.sharewithdrawalform['controls']['pUpiname'].setValue('');
    this.sharewithdrawalform['controls']['pUpiid'].setValue('');
    this.sharewithdrawalform['controls']['pChequenumber'].setValue('');
    this.formValidationMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
  }

  bankName_Change($event: any): void {
    debugger;
    const pbankid = $event.target.value;
    // this.upinameslist = [];
    this.chequenumberslist = [];
    //this.InterestPaymentForm['controls']['pchequeno'].setValue('');
    //this.InterestPaymentForm['controls']['pUpiname'].setValue('');
    //this.InterestPaymentForm['controls']['pUpiid'].setValue('');
    if (pbankid && pbankid != '' && pbankid != 'Select') {
      const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.sharewithdrawalform['controls']['pbankname'].setValue(bankname);
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      // this.InterestPaymentForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      //this.InterestPaymentForm['controls']['pbankname'].setValue('');
    }

    //this.GetValidationByControl(this.InterestPaymentForm, 'pbankname', true);
    // this.formValidationMessages['pchequeno'] = '';
    this.GetValidationByControl(this.sharewithdrawalform, 'pbankid', true);
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

        this._commonService.showErrorMessage(error);
      });
  }
  getBankBranchName(pbankid) {
    debugger;
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.sharewithdrawalform['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
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
      this.sharewithdrawalform['controls']['pUpiid'].setValue('');
      //this.contactForm['controls']['pAddressControls']['controls'][upid_change'pDistrict'].setValue('');
    }
    this.GetValidationByControl(this.sharewithdrawalform, 'pUpiname', true);
  }
  upid_change() {
    this.GetValidationByControl(this.sharewithdrawalform, 'pUpiid', true);

  }
  chequenumber_Change() {

    this.GetValidationByControl(this.sharewithdrawalform, 'pChequenumber', true);
  }
  typeofPaymentChange() {
    debugger;
    let UpinameControl = <FormGroup>this.sharewithdrawalform['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.sharewithdrawalform['controls']['pUpiid'];
    if (this.sharewithdrawalform.controls.ptypeofpayment.value == 'UPI') {
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
    this.GetValidationByControl(this.sharewithdrawalform, 'ptypeofpayment', true);
  }
  debitCard_Change() {

    let data = this.getbankname(this.sharewithdrawalform.controls.pCardNumber.value);
    this.sharewithdrawalform['controls']['pbankname'].setValue(data.pbankname);
    this.sharewithdrawalform['controls']['pbankid'].setValue(data.pbankid);
    this.GetValidationByControl(this.sharewithdrawalform, 'pCardNumber', true);
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
SaveShareWithdrawal() {
  debugger;
  let isValid: boolean = true;
  
  if (this.checkValidations(this.sharewithdrawalform,isValid)) {
  
    let narration=this.sharewithdrawalform.controls.pNarration.value;
    this.sharewithdrawalform['controls']['pnarration'].setValue(narration);
      let PaidAmount=this._commonService.removeCommasForEntredNumber(this.sharewithdrawalform.controls.ptotalpaidamount.value);
    this.sharewithdrawalform['controls']['ptotalpaidamount'].setValue(PaidAmount);
    this.withdrwalPaymentsList['controls'].pPaidAmount.setValue(PaidAmount);
    debugger;
    let withdrwalPaymentsList={'withdrwalPaymentsList':[this.withdrwalPaymentsList.value]};
    let sharewithdrawalformdata = Object.assign(this.sharewithdrawalform.value,withdrwalPaymentsList);
  let newdata = JSON.stringify(sharewithdrawalformdata);
   
   this._ShareapplicationService.SaveShareAccountWithdrwals(newdata).subscribe(result=>{
    debugger;
    if(result){
      this.savebutton='Save';
      this.disablesavebutton=false;
      this._commonService.showInfoMessage("Saved Successfully");
      this.router.navigate(['/ShareWithdrawalview'])

    }
  },
  error=>{
    this._commonService.showErrorMessage(error);
    this.savebutton='Save';
    this.disablesavebutton=false;
  })
   
  }

}

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
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
      return false;
    }
    return isValid;
  }

}
