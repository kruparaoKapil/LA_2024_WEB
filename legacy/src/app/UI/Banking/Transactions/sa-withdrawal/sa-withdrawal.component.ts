import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { SAReceiptService } from 'src/app/Services/Banking/Transactions/sa-receipt.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';

declare var $: any;
@Component({
  selector: 'app-sa-withdrawal',
  templateUrl: './sa-withdrawal.component.html',
  styles: []
})
export class SaWithdrawalComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  savebutton='Save';
  disablesavebutton=false;
  SAwithdrawalForm: FormGroup;
  withdrwalPaymentsList:FormGroup;
  public today: Date = new Date();
  AccountType:any=[];
  MemberDetails:any=[];
  formValidationMessages:any;
  SavingAccountNumbers:any=[];
  balanceamount:any;
  savingaccountDetails:any=[];
  pmembername:any;
psavingaccname:any;
pcontactno:any;
psavingsamount:any;
pinterestrate:any;
pinterestpayout:any;
pmaxwithdrawallimit:any;
pminopenamount:any;
pminmaintainbalance:any;
psavingmindepositamount:any;
psavingmaxdepositamount:any;
pissavingspayinapplicable:any;
receiptcount:any;
savingTranshistoryDetails:any=[];
ShowSavingAccountDetails=false;
ShowSavingTransDetails=false;

public cashBalance: number = 0;
public bankBalance: number = 0;
banklist:any=[];
banklist1:any=[];
modeoftransactionslist:any=[];
debitcardlist:any=[];
typeofpaymentlist:any=[];

showModeofPayment = false;
showtranstype = false;
SavingAccountShowhide = false;
public SavingsMemberBalance: any;
showdebitcard = false;
showCheque = false;
showOnline = false;
chequenumberslist:any=[];
showupi: any;
upinameslist:any=[];
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
 upiidlist:any=[];
 disabletransactiondate = false;
  constructor(private formbuilder: FormBuilder,private _commonService: CommonService, private datePipe: DatePipe, private _SaReceiptService: SAReceiptService,private router: Router, private savingtranscationservice: SavingtranscationService, private _AccountingTransactionsService: AccountingTransactionsService) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    //this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
    
   }

  ngOnInit() {
    if (this._commonService.comapnydetails != null)
    this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
     this.formValidationMessages= {};
   this.SAwithdrawalForm= this.formbuilder.group({
    ppaymentdate: [this.today, Validators.required],
    ptotalpaidamount: [ ,Validators.required],
    pnarration:[''],
    pmodofpayment:['CASH'],
    pbankname: [''],
    pbranchname:[''],
    ptranstype:[''],
    pCardNumber: [''],
    pUpiname: [''],
    pUpiid:[''],
    ptypeofpayment: [''],
    pChequenumber:[''],
    pchequedate: [this.today, Validators.required],
    pbankid: 0,
     pCreatedby: [this._commonService.pCreatedby],
     pStatusname:  [this._commonService.pStatusname],
     pSavingAccNameCode:['',Validators.required],
     psavingaccountno:['',Validators.required],
     pMemberid:[''],
     pMembername: [''],
     ptypeofoperation: [this._commonService.ptypeofoperation],
     pPaymentType: ['CASH'],
     pNarration: ['',Validators.required],
     pStatus: [true],
   
   });
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
   this.BlurEventAllControll(this.SAwithdrawalForm);
   this.GetAccountType();
   this.getLoadData();
  }
  GetAccountType(){
    debugger;
    this.AccountType=[];
    this.MemberDetails=[];
     this._SaReceiptService.GetSavingAccountType().subscribe(json => {
       debugger;
       if(json){
            this.AccountType = json;
       }
     });
  }

  AccountType_Change(event){
    debugger;
    this.ShowSavingAccountDetails=false;
    this.ShowSavingTransDetails=false;
    this.SavingAccountNumbers=[];
    this.savingaccountDetails=[];
    this.savingTranshistoryDetails=[];
    this.balanceamount='';
    this.pmembername='';
this.psavingaccname='';
this.pcontactno='';
this.pinterestrate='';
this.pmaxwithdrawallimit='';
this.pminmaintainbalance='';
this.psavingmindepositamount='';
this.psavingmaxdepositamount='';
this.pinterestpayout='';
    this.SAwithdrawalForm.controls.pSavingAccNameCode.setValue(event.pSavingAccNameCode);
     this.SAwithdrawalForm.controls.psavingaccountno.setValue('');
     this.formValidationMessages.psavingaccountno=null;
     this.SAwithdrawalForm.controls.pMemberid.setValue('');
     this.SAwithdrawalForm.controls.pMembername.setValue('');
    if(event!=''){
      let SavingConfigid=event.pSavingConfigid;
       this._SaReceiptService.GetSavingAccountNumbers(parseInt(SavingConfigid)).subscribe(res=>{
        debugger;
        if(res){
          this.SavingAccountNumbers=res;
        }
      })
    }
    
    
  }

  SavingAccountNumber_Change(event){
    debugger
    this.balanceamount='';
    if(event){
    
      this.ShowSavingAccountDetails=true;
      this.ShowSavingTransDetails=false;
     this.savingaccountDetails=event;
     this.pmembername=this.savingaccountDetails.pmembername;
     this.psavingaccname=this.savingaccountDetails.psavingaccname;
     this.pcontactno=this.savingaccountDetails.pcontactno;
     this.psavingsamount=this.savingaccountDetails.psavingsamount;
     this.pinterestrate=this.savingaccountDetails.pinterestrate;
     this.pinterestpayout=this.savingaccountDetails.pinterestpayout;
     this.pmaxwithdrawallimit=this.savingaccountDetails.pmaxwithdrawallimit;
     this.pminopenamount=this.savingaccountDetails.pminopenamount;
     this.pminmaintainbalance=this.savingaccountDetails.pminmaintainbalance;
     this.psavingmindepositamount=this.savingaccountDetails.psavingmindepositamount;
     this.psavingmaxdepositamount=this.savingaccountDetails.psavingmaxdepositamount;
     this.pissavingspayinapplicable=this.savingaccountDetails.pissavingspayinapplicable;
     this.receiptcount=this.savingaccountDetails.receiptcount;
     this.SAwithdrawalForm.controls.pMemberid.setValue(this.savingaccountDetails.pmemberid);
     this.SAwithdrawalForm.controls.pMembername.setValue(this.pmembername);

     this.SAwithdrawalForm.controls.psavingaccountno.setValue(event.psavingaccountno);
   
     this.withdrwalPaymentsList['controls'].pTransTypeid.setValue(event.psavingaccountid);
     this.withdrwalPaymentsList['controls'].pAccountno.setValue(event.pAccountid);
     let SavingAccountId=parseInt(event.psavingaccountid);
     this._SaReceiptService.GetWithDrawalTransaction(SavingAccountId).subscribe(res=>{
       debugger;
       if(res){
         this.savingTranshistoryDetails=res;
         this.getbalanceamount(event.pAccountid);
       }
     })
    }
    else{
       this.dpConfig1.minDate=null;
    }
  }
  getbalanceamount(SavingAccountId){
    this._SaReceiptService.getViewBalanceAmout(SavingAccountId).subscribe(res=>{
      debugger;
      if(res){
        this.balanceamount=this._commonService.currencyformat(res[0]['pBalanceamount']);
      }
    })
  }
  GetSAandTransDetails(type){
    debugger;
    if(type=='AccountDetails'){
       this.ShowSavingAccountDetails=true;
       this.ShowSavingTransDetails=false;
    }
    else if(type=='TransactionDetails'){
      this.ShowSavingAccountDetails=false;
       this.ShowSavingTransDetails=true;
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
  gettypeofpaymentdata(): any {

    let data = this.modeoftransactionslist.filter(function (payment) {
      return payment.ptranstype != payment.ptypeofpayment;
    });
    return data;
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
  modeofPaymentChange() {
    debugger;
     
      this.SavingsMemberBalance = 0;
    if (this.SAwithdrawalForm.controls.pmodofpayment.value == "CASH") {
      this.SAwithdrawalForm['controls']['pbankid'].setValue(0);
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.SavingAccountShowhide=false;
      this.showtranstype = false;

    }
    else if (this.SAwithdrawalForm.controls.pmodofpayment.value == "BANK") {
      this.SAwithdrawalForm['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.SavingAccountShowhide=false;
      this.showtranstype = true;
    }
    else if (this.SAwithdrawalForm.controls.pmodofpayment.value == "ADJUSTMENT") {
      this.SAwithdrawalForm['controls']['pbankid'].setValue(0);
     
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
    this.BlurEventAllControll(this.SAwithdrawalForm);
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
    if (this.SAwithdrawalForm.controls.ptranstype.value == "CHEQUE") {
      this.showbankcard = true;
      this.displaychequeno = 'Cheque No';
      this.showbranch = true;
      this.showchequno = true;
    }
    else if (this.SAwithdrawalForm.controls.ptranstype.value == "ONLINE") {
      this.showbankcard = true;
      this.showTypeofPayment = true;
      this.showfinancial = false;
    }
    else if (this.SAwithdrawalForm.controls.ptranstype.value == "DEBIT CARD") {
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

    let modeofpaymentControl = <FormGroup>this.SAwithdrawalForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.SAwithdrawalForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.SAwithdrawalForm['controls']['pbankid'];
    let chequeControl = <FormGroup>this.SAwithdrawalForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.SAwithdrawalForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.SAwithdrawalForm['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

    let UpinameControl = <FormGroup>this.SAwithdrawalForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.SAwithdrawalForm['controls']['pUpiid'];

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
    this.SAwithdrawalForm['controls']['pbankid'].setValue(0);
    this.SAwithdrawalForm['controls']['pbankname'].setValue('');
    this.SAwithdrawalForm['controls']['pCardNumber'].setValue('');
    this.SAwithdrawalForm['controls']['ptypeofpayment'].setValue('');
    this.SAwithdrawalForm['controls']['pbranchname'].setValue('');
    this.SAwithdrawalForm['controls']['pUpiname'].setValue('');
    this.SAwithdrawalForm['controls']['pUpiid'].setValue('');
    this.SAwithdrawalForm['controls']['pChequenumber'].setValue('');
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
      this.SAwithdrawalForm['controls']['pbankname'].setValue(bankname);
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      // this.InterestPaymentForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      //this.InterestPaymentForm['controls']['pbankname'].setValue('');
    }

    //this.GetValidationByControl(this.InterestPaymentForm, 'pbankname', true);
    // this.formValidationMessages['pchequeno'] = '';
    this.GetValidationByControl(this.SAwithdrawalForm, 'pbankid', true);
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
    this.SAwithdrawalForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
  }
  debitCard_Change() {

    let data = this.getbankname(this.SAwithdrawalForm.controls.pCardNumber.value);
    this.SAwithdrawalForm['controls']['pbankname'].setValue(data.pbankname);
    this.SAwithdrawalForm['controls']['pbankid'].setValue(data.pbankid);
    this.GetValidationByControl(this.SAwithdrawalForm, 'pCardNumber', true);
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
      this.SAwithdrawalForm['controls']['pUpiid'].setValue('');
      //this.contactForm['controls']['pAddressControls']['controls'][upid_change'pDistrict'].setValue('');
    }
    this.GetValidationByControl(this.SAwithdrawalForm, 'pUpiname', true);
  }
  upid_change() {
    this.GetValidationByControl(this.SAwithdrawalForm, 'pUpiid', true);

  }
  chequenumber_Change() {

    this.GetValidationByControl(this.SAwithdrawalForm, 'pChequenumber', true);
  }
  typeofPaymentChange() {
    debugger;
    let UpinameControl = <FormGroup>this.SAwithdrawalForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.SAwithdrawalForm['controls']['pUpiid'];
    if (this.SAwithdrawalForm.controls.ptypeofpayment.value == 'UPI') {
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
    this.GetValidationByControl(this.SAwithdrawalForm, 'ptypeofpayment', true);
  }
 
  AmountReceived_Change(){
    debugger;
 
    let balanceamount=this._commonService.removeCommasForEntredNumber(this.balanceamount);
    let minwithdrawallimit=balanceamount-this.pminmaintainbalance;
    let amountreceived=this._commonService.removeCommasForEntredNumber(this.SAwithdrawalForm.controls.ptotalpaidamount.value);
    if(amountreceived==0){
      this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
      return;
    }
    if(amountreceived>minwithdrawallimit){
      this._commonService.showWarningMessage('Insufficient Balance in Your Account');
      this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
      return;
    }
    if(this.pmaxwithdrawallimit!=0){
let today= this.datePipe.transform(this.today, "dd/MM/yyyy");;

let todaywithdrawa = this.savingTranshistoryDetails.filter(x => x.ptransdate == today);

let  todaywithdrawalamount = todaywithdrawa.reduce((sum, c) => sum + c.pWithDrawamount, 0);
// if(minwithdrawallimit<this.pmaxwithdrawallimit){
//   this._commonService.showWarningMessage('Today your Limit is Exceeded');
// ;
//              this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
//            return;
// }
let todaywithdrawallimitamount=this.pmaxwithdrawallimit-todaywithdrawalamount;
if(amountreceived>todaywithdrawallimitamount){
  this._commonService.showWarningMessage('Today your Limit is Exceeded');

  this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
  return;
}
    }

    
    }

   

SaveSAWithdrawal(){
  debugger;
  let amountreceived=this._commonService.removeCommasForEntredNumber(this.SAwithdrawalForm.controls.ptotalpaidamount.value);
  if(amountreceived<100){
    this._commonService.showWarningMessage('Withdrawal Amount must be greater than or equal 100');
    this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
    return;
  }
 
  let isvalid:boolean = true;
  isvalid=this.checkValidationAll();
if (isvalid) {
  this.disablesavebutton = true;
  let narration=this.SAwithdrawalForm.controls.pNarration.value;
  this.SAwithdrawalForm['controls']['pnarration'].setValue(narration);
  let PaidAmount=this.SAwithdrawalForm.controls.ptotalpaidamount.value;
  this.withdrwalPaymentsList['controls'].pPaidAmount.setValue(PaidAmount);
  let withdrwalPaymentsList={'withdrwalPaymentsList':[this.withdrwalPaymentsList.value]};
  let SAwithdrawalFormdata = Object.assign(this.SAwithdrawalForm.value,withdrwalPaymentsList);
  let newdata = JSON.stringify(SAwithdrawalFormdata);
  this.savingtranscationservice.SaveSavingAccountWithdrwals(newdata).subscribe(result=>{
    debugger;
    if(result){
      this.savebutton='Save';
      this.disablesavebutton=false;
      this._commonService.showInfoMessage("Saved Successfully");
      this.router.navigate(['/SaWithdrawalview'])
      // this.SADetailsForm.controls.pReceiptdate.setValue(new Date);
      // this.Cleardetails();
    }
  },
  error=>{
    this._commonService.showErrorMessage(error);
    this.savebutton='Save';
    this.disablesavebutton=false;
  })
}
}
//51
Cleardetails(){
  debugger;
  this.ShowSavingAccountDetails=false;
    this.ShowSavingTransDetails=false;
    this.SavingAccountNumbers=[];
    this.savingaccountDetails=[];
    this.savingTranshistoryDetails=[];
    this.balanceamount='';
    this.pmembername='';
this.psavingaccname='';
this.pcontactno='';
this.pinterestrate='';
this.pmaxwithdrawallimit='';
this.pminmaintainbalance='';
this.psavingmindepositamount='';
this.psavingmaxdepositamount='';
this.pinterestpayout='';
    this.SAwithdrawalForm.controls.pSavingAccNameCode.setValue('');
    this.formValidationMessages.pSavingAccNameCode='';
     this.SAwithdrawalForm.controls.psavingaccountno.setValue('');
     this.formValidationMessages.psavingaccountno=null;
     this.SAwithdrawalForm.controls.pMemberid.setValue('');
     this.SAwithdrawalForm.controls.pMembername.setValue('');
     this.SAwithdrawalForm.controls.ptotalpaidamount.setValue('');
     this.formValidationMessages.ptotalpaidamount='';
     this.SAwithdrawalForm.controls.pNarration.setValue('');
     this.formValidationMessages.pNarration='';
     this.SAwithdrawalForm.controls.pmodofpayment.setValue('CASH');
     this.modeofPaymentChange();
  }
checkValidationAll():boolean{
  let isvalid1 = true;
  isvalid1= this.checkValidations(this.SAwithdrawalForm, isvalid1);
  if(isvalid1){
    return true;
  }
  else{
    return false;
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
