
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-interest-delay',
//   templateUrl: './interest-delay.component.html',
//   styleUrls: ['./interest-delay.component.css']
// })
// export class InterestDelayComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {


//   }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { MaturityPaymentService } from '../../../../Services/Banking/Transactions/maturity-payment.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
//import { MaturityPaymentRenewalComponent } from './maturity-payment-renewal.component';
//import { MaturityPaymentRenewalComponent } from '../Maturity Payment/maturity-payment-renewal.component';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { FdJointmemberComponent } from '../FD-AC-Creation/fd-jointmember.component';
import { NomineedetailsComponent } from '../FD-AC-Creation/nomineedetails.component';
import { FdReceiptService } from '../../../../Services/Banking/Transactions/fd-receipt.service';
import { DatePipe } from '@angular/common';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';
import { ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';
declare let $: any

@Component({
  selector: 'app-interest-delay',
  templateUrl: './interest-delay.component.html',
  styleUrls: ['./interest-delay.component.css']
})
export class InterestDelayComponent implements OnInit {


  //@ViewChild(MaturityPaymentRenewalComponent, { static: false }) maturityPaymentRenewalComponent: MaturityPaymentRenewalComponent;

  MaturityPaymentForm: FormGroup;
  formValidationMessages: any;
  showtranstype: any;
  chequenumberslist: any;
  modeoftransactionslist: any;
  banklist: any;
  SavingsMemberBalance:any;
  typeofpaymentlist: any;
  debitcardlist: any;
  PaymentTypeList: any;
   ledgeraccountslist: any;
  //FdDetailsList: any;
  cashBalance: any;
  bankBalance: any;
  bankbookBalance: any;
  bankpassbookBalance: any;
  upinameslist: any;
  upiidlist: any;
  ledgerBalance: any;
  subledgerBalance: any;
  partyBalance: any;
  Editdata: any;
  MemberEvent: any;
  MaturityMemberDetails: any;
  Tabposition = 1;
  public staticFDDetails:any;
  public FdDetailsList: any;
  //public staticFDDetails :any=[];
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';
  SavingsAccounts:any=[];
  showTypeofPayment = false;
  showbranch = true;
  showfinancial = true;
  showupi = false;
  showchequno = true;
  showbankcard = true;
  showModeofPayment = false;
  SavingAccountShowhide=false;
  Showpayment: boolean = false;
  kycFileName:any;
    imageResponse:any;

  ShowmaturityBondsList: boolean = false;
  allRowsSelected: boolean = false;
  disablesavebutton = false;
  ShowPaymentGrid: boolean = false;

  showMaturitytab: boolean = false;
  ShowFixeddepositdetails: boolean = false;
  showPrematurity: boolean = false;
  savebutton = "Save";
  MaturityPaymentList: any = [];
    userDetails: any;
    userNameF: any;
    userIdF: any;

    subledgeraccountslist: any;
     datetimeimgpath: string;
  datetimeimg: string;

  public Fdaccountno: any;
  public Membername: any;
  public Depositamount: any;
  public Maturityamount: any;
  public Tenortype: any;
  public Tenor: any;
  public Interesttype: any;
  public Interestrate: any;
  public InterestPayble: any;
  public InterestPayout: any;
  public MemberType: any;
  public DepositDate: any;
  public MaturityDate: any;
  public AgentConsolidated: any;
  public Damages: any;
  public OutstandingAmount: any;
  public latefeeamount:any;
  disabletransactiondate = false;
  public Depositypes = [
    {PaymentType: 'FD'},
    {PaymentType: 'RD'}
];
  public pMaturitypaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  branchDetails: any = [];
  currreferralStatus: any;
  currNomineeAndReferralStatus: any;
  showModal: boolean = false;
  subledgerName: string;

  ledgerName: any;
  isDisabled: boolean;
  isFileUploading: boolean = false;
  constructor(private _FormBuilder: FormBuilder, private _commonService: CommonService, private toastr: ToastrService, private _AccountingTransactionsService: AccountingTransactionsService,
    private _MaturityPaymentService: MaturityPaymentService, private router: Router, private _fdrdttranscationservice: FdRdTransactionsService, private _FdReceiptService: FdReceiptService,
    private datePipe: DatePipe, private _ShareApplication:ShareapplicationService, private _CoJointmemberService: CoJointmemberService, private _rdttranscationservice: RdTransactionsService,  public _CoReferralService: CoReferralService,private _RdReceiptService: RdReceiptService) {
    this.pMaturitypaymentdateConfig.containerClass = 'theme-dark-blue';
    this.pMaturitypaymentdateConfig.showWeekNumbers = false;
    this.pMaturitypaymentdateConfig.maxDate = new Date();
    this.pMaturitypaymentdateConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit() {
    if (this._commonService.comapnydetails != null)
            this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.formValidationMessages = {};
    this.SavingsAccounts=[];
    this.SavingsMemberBalance=0;

            this.userDetails = JSON.parse(sessionStorage.getItem("Urc"));
        this.userNameF = this.userDetails.pUserName;
        this.userIdF = this.userDetails.pUserID;
    this.MaturityPaymentForm = this._FormBuilder.group({
      psubledgerid: [0],
      psubledgername: [''],
      pledgerid: [0],
      pledgername: [''],
      ppaymentid: [''],
      ptotalpaidamount: [''],
      Depositype: [''],
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
      pbankid: [0],
      //  pSavingsMemberAccountid:[0],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pMemberid: [null, Validators.required],
      pBranch: [''],
      pBranchId: [''],
      pMembername: [''],
      pTransTypeid: [''],
      pMaturitypaymentdate: [new Date(), Validators.required],
      pPaymentType: [null, Validators.required],
      pDocStorePath: [''],
      // pNarration: [''],
      pStatus: [true],
      pFilename: ['', Validators.required],

      pMaturityPaymentlist: this.addMaturityPaymentslistcontrols()
    })
    this.modeofPaymentChange();
    this.getLoadData();
    this.GetPaymentTypes();
    //this.GetMaturityMembers();
    this._fdrdttranscationservice.Newformstatus("New");
    this.BlurEventAllControll(this.MaturityPaymentForm);
    this. _CoJointmemberService._SetCoJointmembervalidation('unsuccess');

    this.getBranchDetails();
  }
  addMaturityPaymentslistcontrols(): FormGroup {
    return this._FormBuilder.group({

      pTransTypeid: [''],
      pMaturityjvdate: [''],
      pPaidAmount: [0],
      pAccountno: [0],
      pJvid: 0,
      pVoucherid:0,
      pOutstandingAmount: [0],
      pLateFeeAmount: [0],

    //      pTenor: [0],
    // pDepositAmount: [0],
    // pMaturityAmount: [0],
    // pInterestPayout: [0],
    // pInterestPayable: [0],
    // pDepositDate: [''],
    // pMaturityDate: [''],
    // pRateOfInterest: [0]
    pTenor: [0],
    pDepositAmount: [0],
    pMaturityAmount: [0],
    pInterestPayout: [''],
    pInterestPayable: [0],
    pDepositDate: [null],
    pMaturityDate: [null],
    pRateOfInterest: [0],
    pLateFeeDays: [0],
    pMembername: [''],
    pFdaccountno: [''],
    pTDSAmount: [0],
    pNetInterest: [0],
    pTDSRate: [0],
    pSystemRateOfInterest: [0] 

    })
  }
  GetAccountDetails(Membercode) {
    debugger
    this._RdReceiptService.GetAccountDetails(Membercode).subscribe(json => {
    debugger;
    if(json){
        this.SavingsAccounts = json["rdSavingsAccountDetailsDTOList"];
    }

    });
  }
  modeofPaymentChange() {
    debugger;
    //  this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].setValue(0);
    //   this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].clearValidators();
    //   this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();


    this.MaturityPaymentForm.controls.pledgername.clearValidators();
        this.MaturityPaymentForm.controls.pledgername.updateValueAndValidity();
    this.MaturityPaymentForm.controls.psubledgername.clearValidators();
    this.MaturityPaymentForm.controls.psubledgername.updateValueAndValidity();

    this.SavingsMemberBalance = 0;
    if (this.MaturityPaymentForm.controls.pmodofpayment.value == "CASH") {
      this.MaturityPaymentForm['controls']['pbankid'].setValue(0);
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.SavingAccountShowhide=false;
      this.showtranstype = false;

    }
    else if (this.MaturityPaymentForm.controls.pmodofpayment.value == "BANK") {
      this.MaturityPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.SavingAccountShowhide=false;
      this.showtranstype = true;
    }
    else if (this.MaturityPaymentForm.controls.pmodofpayment.value == "ADJUSTMENT") {
      this.MaturityPaymentForm['controls']['pbankid'].setValue(0);
      // this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].setValue('');
      // this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
      // this.MaturityPaymentForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
      this.MaturityPaymentForm.controls.pledgername.setValidators(Validators.required);
      this.MaturityPaymentForm.controls.psubledgername.setValidators(Validators.required);
      this.MaturityPaymentForm.controls.psubledgername.updateValueAndValidity();
      this.MaturityPaymentForm.controls.pledgername.updateValueAndValidity();


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
    this.BlurEventAllControll(this.MaturityPaymentForm);
  }
  SavingsAccountsChanges(event) {
    debugger
    this.MaturityPaymentForm.controls.pSavingsMemberAccountid.setValue(event.pSavingsMemberAccountid);
    this.SavingsMemberBalance = event.pSavingsMemberBalance;
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
    if (this.MaturityPaymentForm.controls.ptranstype.value == "CHEQUE") {
      this.showbankcard = true;
      this.displaychequeno = 'Cheque No';
      this.showbranch = true;
      this.showchequno = true;
    }
    else if (this.MaturityPaymentForm.controls.ptranstype.value == "ONLINE") {
      this.showbankcard = true;
      this.showTypeofPayment = true;
      this.showfinancial = false;
    }
    else if (this.MaturityPaymentForm.controls.ptranstype.value == "DEBIT CARD") {
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

    let modeofpaymentControl = <FormGroup>this.MaturityPaymentForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.MaturityPaymentForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.MaturityPaymentForm['controls']['pbankid'];
    let chequeControl = <FormGroup>this.MaturityPaymentForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.MaturityPaymentForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.MaturityPaymentForm['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

    let UpinameControl = <FormGroup>this.MaturityPaymentForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.MaturityPaymentForm['controls']['pUpiid'];

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
    this.MaturityPaymentForm['controls']['pbankid'].setValue(0);
    this.MaturityPaymentForm['controls']['pbankname'].setValue('');
    this.MaturityPaymentForm['controls']['pCardNumber'].setValue('');
    this.MaturityPaymentForm['controls']['ptypeofpayment'].setValue('');
    this.MaturityPaymentForm['controls']['pbranchname'].setValue('');
    this.MaturityPaymentForm['controls']['pUpiname'].setValue('');
    this.MaturityPaymentForm['controls']['pUpiid'].setValue('');
    this.MaturityPaymentForm['controls']['pChequenumber'].setValue('');
    this.formValidationMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
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
  debitCard_Change() {

    let data = this.getbankname(this.MaturityPaymentForm.controls.pCardNumber.value);
    this.MaturityPaymentForm['controls']['pbankname'].setValue(data.pbankname);
    this.MaturityPaymentForm['controls']['pbankid'].setValue(data.pbankid);
    this.GetValidationByControl(this.MaturityPaymentForm, 'pCardNumber', true);
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
  getLoadData() {

    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {

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
  trackByFn(index, item) {
    return index; // or item.id
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
      this.MaturityPaymentForm['controls']['pbankname'].setValue(bankname);
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      // this.InterestPaymentForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      //this.InterestPaymentForm['controls']['pbankname'].setValue('');
    }

    //this.GetValidationByControl(this.InterestPaymentForm, 'pbankname', true);
    // this.formValidationMessages['pchequeno'] = '';
    this.GetValidationByControl(this.MaturityPaymentForm, 'pbankid', true);
  }
  getBankBranchName(pbankid) {
    debugger;
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.MaturityPaymentForm['controls']['pbranchname'].setValue(data[0].pbranchname);
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
      this.MaturityPaymentForm['controls']['pUpiid'].setValue('');
      //this.contactForm['controls']['pAddressControls']['controls'][upid_change'pDistrict'].setValue('');
    }
    this.GetValidationByControl(this.MaturityPaymentForm, 'pUpiname', true);
  }
  upid_change() {
    this.GetValidationByControl(this.MaturityPaymentForm, 'pUpiid', true);

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
  BankNameChange() {

  }
  typeofPaymentChange() {
    debugger;
    let UpinameControl = <FormGroup>this.MaturityPaymentForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.MaturityPaymentForm['controls']['pUpiid'];
    if (this.MaturityPaymentForm.controls.ptypeofpayment.value == 'UPI') {
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
    this.GetValidationByControl(this.MaturityPaymentForm, 'ptypeofpayment', true);
  }
  chequenumber_Change() {

    this.GetValidationByControl(this.MaturityPaymentForm, 'pChequenumber', true);
  }

  //#region Maturity Payment
  GetPaymentTypes() {
    this.PaymentTypeList = [{ PaymentType: 'Delay Interest' },
      //{ PaymentType: 'Renewal' }

    ];
  }
  GetMaturityMembers(PaymentType,Depositype) {
    this._MaturityPaymentService.Getdelayinterestmembers(PaymentType,Depositype).subscribe(result => {
      this.MaturityMemberDetails = result;
    })
  }
//   MemberChange(event) {
//     debugger;
//     this.FdDetailsList = [];
//     this.staticFDDetails=[];
//     this.MaturityPaymentList = [];
//     this.SavingsAccounts=[];
//     this.allRowsSelected = false;
//     this.showMaturitytab = false;
//     this.ShowFixeddepositdetails = false;
//     let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
//     let paymentDate = this.MaturityPaymentForm.controls.pMaturitypaymentdate.value;
//     this._CoJointmemberService._setfdMembercode(event.pMembercode, event.pMemberid);
//     //this.formValidationMessages.pTransTypeid = "";
//     if (!isNullOrUndefined(event)) {
//       this.GetAccountDetails(event.pMembercode);
//       this.MaturityPaymentForm.controls.pMembername.setValue(event.pMembername);
//       this._MaturityPaymentService.GetMaturityFdDetails(PaymentType, event.pMemberid, this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")).subscribe(result => {
//         this.FdDetailsList = result;
//         this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
//        // this.FdDetailsList.filter(function (df) { df.pStatus = false;  df.Editable = true ,df.islatefee=false ,  });
//                this.FdDetailsList.filter(function (df) { df.pStatus = false; df.IsRenewal = false; df.pRenewalAmount, df.Editable = true ,df.islatefee=false});

//         if (PaymentType == "Payment") {
//           this.ShowPaymentGrid = true;
//          // this.ShowRenewalGrid = false;
//         }
//         // if (PaymentType == "Renewal") {
//         //   this.ShowPaymentGrid = false;
//         //   this.ShowRenewalGrid = true;
//         // }

//       })
//       this.MemberEvent = ({ pMemberId: event.pMemberid, pMemberName: event.pMembername, pMemberCode: event.pMembercode, pContactid: event.pContactid, pContactrefid: event.pContactrefid, pMemberTypeid: event.pMemberTypeid, pMemberType: event.pMemberType })
//       this.MaturityPaymentForm.controls.pBranch.setValue(event.pBranch);
//       this.MaturityPaymentForm.controls.pBranchId.setValue(event.pBranchId);

// //       this.maturityPaymentRenewalComponent.FdTranscationform['controls']['pChitbranchname'].setValue(event.pBranch)

// //  this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(event.pBranch);
// //     this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(event.pBranchId);

//     }
//     else {
//       this.ShowmaturityBondsList = false;
//       this.MemberEvent = "";
//     }
//   }

MemberChange(event) {
  debugger;

  this.FdDetailsList = [];
  this.staticFDDetails = [];
  this.MaturityPaymentList = [];
  this.SavingsAccounts = [];
  this.allRowsSelected = false;

  this.showMaturitytab = false;
  this.ShowFixeddepositdetails = false;

  let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
  let paymentDate = this.MaturityPaymentForm.controls.pMaturitypaymentdate.value;

  this._CoJointmemberService._setfdMembercode(event.pMembercode, event.pMemberid);

  if (!isNullOrUndefined(event)) {

    this.GetAccountDetails(event.pMembercode);

    this.MaturityPaymentForm.controls.pMembername.setValue(event.pMembername);

    this._MaturityPaymentService
      .GetMaturityDelayFdDetails(
        PaymentType,
        event.pMemberid,
        this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")
      )
      .subscribe(result => {

        this.FdDetailsList = result;
        console.log('First row full object:', JSON.stringify(this.FdDetailsList[0]));
        this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
        this.FdDetailsList.forEach(df => {
          df.pStatus = false;
          df.Editable = true;
          df.islatefee = false;
          df.pPaid_Amount = 0;
          df.pTDSAmount = 0;       
          df.pNetInterest = 0;     
          df.pTDSRate = 0;        
          df.pPanno = df.pPanno || '';
          df.pSystemRateOfInterest = 9;
          // if (!df.pPanno || df.pPanno === '') {
          //   this._commonService.showWarningMessage(
          //     df.pFdaccountno + ': PAN is empty, TDS will be 20%'
          //   );
          // }

        });

        if (PaymentType == "Delay Interest") {
          this.ShowPaymentGrid = true;
        }

      });

    this.MemberEvent = {
      pMemberId: event.pMemberid,
      pMemberName: event.pMembername,
      pMemberCode: event.pMembercode,
      pContactid: event.pContactid,
      pContactrefid: event.pContactrefid,
      pMemberTypeid: event.pMemberTypeid,
      pMemberType: event.pMemberType
    };

    this.MaturityPaymentForm.controls.pBranch.setValue(event.pBranch);
    this.MaturityPaymentForm.controls.pBranchId.setValue(event.pBranchId);

  } else {
    this.ShowmaturityBondsList = false;
    this.MemberEvent = "";
  }
}

PaymentTypeChange(event, PaymentTypes) {
  debugger;

  // Reset basic data
  this.MaturityPaymentForm.controls.pMemberid.setValue(null);
  this.FdDetailsList = [];
  this.staticFDDetails = [];
  this.SavingsAccounts = [];
  this.MaturityMemberDetails = [];
  this.formValidationMessages.pMemberid = '';

  this.ShowmaturityBondsList = false;
  this.showMaturitytab = false;
  this.ShowFixeddepositdetails = false;

  let pPaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;

  if (!isNullOrUndefined(event)) {

    if (PaymentTypes === 'Payment Type') {
      this.MaturityPaymentForm.controls.Depositype.setValue('FD');
      this.MaturityPaymentForm.controls.pmodofpayment.setValue('BANK');
      this.MaturityPaymentForm.controls.ptranstype.setValue('CHEQUE');
      this.Showpayment = true;
      this.showModeofPayment = true;
      this.SavingAccountShowhide = false;
      this.showtranstype = true;
      this.disablesavebutton = false;
      this.GetMaturityMembers(pPaymentType, 'FD');
    }

  } else {
    this.Showpayment = false;
  }
}

//   SelectMaturitybond(event, dataItem, rowIndex) {
//   if (event.target.checked) {
//     this.FdDetailsList[rowIndex].pStatus = true;
//     this.FdDetailsList[rowIndex].Editable = false;
//     this.FdDetailsList[rowIndex].islatefee = false;
//   } else {
//     this.FdDetailsList[rowIndex].pStatus = false;
//     this.FdDetailsList[rowIndex].Editable = true;

//     this.FdDetailsList[rowIndex] = { ...this.staticFDDetails[rowIndex] };
//   }
// }

SelectMaturitybond(event, dataItem, rowIndex) {
 if (event.target.checked) {
    this.FdDetailsList[rowIndex] = {
      ...this.FdDetailsList[rowIndex],
      pStatus: true,
      Editable: false,
      islatefee: false,
      pPaid_Amount: this.FdDetailsList[rowIndex].pPending_Amount || 0,
      pTDSAmount: 0,
      pNetInterest: 0,
      pTDSRate: 0 
    };
    this.calculateTDSAndNetInterest(rowIndex);
  } else {
    this.FdDetailsList[rowIndex] = {
      ...this.staticFDDetails[rowIndex],
      pStatus: false,
      Editable: true,
      pPaid_Amount: 0,
      pTDSAmount: 0,
      pNetInterest: 0,
      pTDSRate: 0
    };
    this.FdDetailsList = [...this.FdDetailsList];
  }
}

selectAll(event, row, rowIndex) {
  if (event.target.checked) {
    this.allRowsSelected = true;

    this.FdDetailsList.filter(x => x.pStatus = true);
    this.FdDetailsList.filter(x => x.islatefee = false);
    this.FdDetailsList.filter(x => x.Editable = false);

  } else {
    this.allRowsSelected = false;

    this.FdDetailsList = this.staticFDDetails;

    this.FdDetailsList.filter(x => x.pStatus = false);
    this.FdDetailsList.filter(x => x.islatefee = false);
    this.FdDetailsList.filter(x => x.Editable = true);
  }
}
saveMaturityPayment() {
  debugger;
  try {
    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;

    if (!PaymentType) {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
      this.checkValidations(this.MaturityPaymentForm, true);
      return;
    }

    // ONLY PAYMENT FLOW
    this.SavePayments();

  } catch (e) {
    this._commonService.showErrorMessage(e);
    this.disablesavebutton = false;
    this.savebutton = 'Save';
  }
}




SavePayments() {
debugger;
  if (this.validatesaveMaturityPayment()) {
 console.log(" FdDetailsList ", this.FdDetailsList);
    let paymentdata = [];
    this.MaturityPaymentList = [];

    const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];

    if (this.FdDetailsList.length > 0)
      paymentdata = this.FdDetailsList.filter(item => item.pStatus == true);

for (let i = 0; i < paymentdata.length; i++) {

  const control = this.addMaturityPaymentslistcontrols();

  let fddata = this.FdDetailsList.filter(item =>
    item.pFdaccountid == paymentdata[i].pFdaccountid
  );

  control.controls.pTransTypeid.setValue(fddata[0].pFdaccountid);

  let paidAmount = fddata[0].pPaid_Amount
    ? this._commonService.removeCommasForEntredNumber(fddata[0].pPaid_Amount.toString())
    : '0';

  control.controls.pPaidAmount.setValue(Number(paidAmount) || 0);

  control.controls.pAccountno.setValue(fddata[0].pAccountno);
  control.controls.pFdaccountno.setValue(fddata[0].pFdaccountno || '');
  control.controls.pMembername.setValue(fddata[0].pMembername || '');
  control.controls.pOutstandingAmount.setValue(fddata[0].pNetPayable);
  control.controls.pLateFeeAmount.setValue(fddata[0].pLateFeeAmount);

  control.controls.pTenor.setValue(fddata[0].pTenor || 0);

  control.controls.pDepositAmount.setValue(fddata[0].pDepositamount || 0);
  control.controls.pMaturityAmount.setValue(fddata[0].pMatureAmount || 0);

  control.controls.pInterestPayout.setValue(fddata[0].pInterestPayout || '');

  control.controls.pInterestPayable.setValue(fddata[0].pInterestpayble || 0);

control.controls.pDepositDate.setValue(
  fddata[0].pDepositdate ? fddata[0].pDepositdate.toString().substring(0, 10) : null
);

control.controls.pMaturityDate.setValue(
  fddata[0].pMaturitydate ? fddata[0].pMaturitydate.toString().substring(0, 10) : null
);

  control.controls.pRateOfInterest.setValue(fddata[0].pPreinterestrate || 0);
  control.controls.pLateFeeDays.setValue(fddata[0].pLatefeedays || 0);

  control.controls.pRateOfInterest.setValue(fddata[0].pRateOfInterest? Number(this._commonService.removeCommasForEntredNumber(fddata[0].pRateOfInterest.toString())): 0);

  control.controls.pSystemRateOfInterest.setValue(fddata[0].pSystemRateOfInterest || 9);

  control.controls.pTDSAmount.setValue(fddata[0].pTDSAmount || 0);
  control.controls.pNetInterest.setValue(fddata[0].pNetInterest || 0);
  control.controls.pTDSRate.setValue(fddata[0].pTDSRate || 0);

  this.MaturityPaymentList.push(control.value);
}

    this.MaturityPaymentForm.controls.ptotalpaidamount.setValue(
      this.MaturityPaymentList.reduce((sum, c) => sum + parseFloat(c.pPaidAmount || 0), 0)
    );
    if (this.MaturityPaymentList.length > 0) {
      this.MaturityPaymentList.forEach(row => {
        row.pLateFeeAmount = this._commonService.removeCommasForEntredNumber(row.pLateFeeAmount);
      });
    }

    let newdata = { MaturityPaymentsList: this.MaturityPaymentList };
    let paymentVoucherdata = Object.assign(this.MaturityPaymentForm.value, newdata);
    console.log(" FINAL PAYLOAD ", paymentVoucherdata);

    //let data = JSON.stringify(paymentVoucherdata);
    let data = paymentVoucherdata;

    if ((this.MaturityPaymentForm.controls.pmodofpayment.value).toUpperCase() == "ADJUSTMENT") {

      this._MaturityPaymentService.SaveMaturityPaymentForAdjustment(data).subscribe(res => {
        if (res) {
          this._commonService.showInfoMessage("Saved Successfully");

          if (res[0]['pJvnumber']) {
            window.open('/#/JournalvoucherReport?id=' +
              btoa(res[0]['pJvnumber'] + ',' + 'Journal Voucher'));
          }

          this.ClearDetails();
        }

        this.disablesavebutton = false;
        this.savebutton = "Save & Continue";

      }, error => {
        this._commonService.showErrorMessage(error);
        this.disablesavebutton = false;
        this.savebutton = "Save & Continue";
      });

    } else {
      debugger;

      this._MaturityPaymentService.SaveDelayIntrest(data).subscribe(res => {
        if (res) {
          this._commonService.showInfoMessage("Saved Successfully");

          let receipt = btoa(res[0]['ppaymentid'] + ',' + 'Payment Voucher');
          window.open('/#/PaymentVoucherReports?id=' + receipt);

          this.ClearDetails();
        }

        this.disablesavebutton = false;
        this.savebutton = "Save";

      }, error => {
        this._commonService.showErrorMessage(error);
        this.disablesavebutton = false;
        this.savebutton = "Save & Continue";
      });
    }

  } else {
    this.disablesavebutton = false;
    this.savebutton = "Save";
  }
}
  // ClearDetails() {
  //   this.ngOnInit();
  //   this.Showpayment = false;

  //   this.ShowPaymentGrid = false;
  //   this.ShowPaymentGrid = false;
  //   this.showMaturitytab = false;
  //   this.ShowFixeddepositdetails = false;
  //   this.FdDetailsList = [];
  //   this.staticFDDetails=[];
  //   this.SavingsAccounts=[];
  //   this.MaturityPaymentList = [];
  // }
ClearDetails() {
    this.ngOnInit();
    this.Showpayment = false;
    this.ShowPaymentGrid = false;
    this.showMaturitytab = false;
    this.ShowFixeddepositdetails = false;
    this.FdDetailsList = [];
    this.staticFDDetails = [];
    this.SavingsAccounts = [];
    this.MaturityPaymentList = [];
    this.MaturityPaymentForm.controls['pDocStorePath'].setValue('');
    this.MaturityPaymentForm.controls['pFilename'].setValue('');
    this.isFileUploading = false;
    this.kycFileName = null;
    this.imageResponse = null;
}

  validatesaveMaturityPayment(): boolean {

  if (isNullOrEmptyString(this.MaturityPaymentForm.controls.pFilename.value)) {
    this._commonService.showWarningMessage("Please upload document !!");
    return false;
  }

  let isValid: boolean = true;

  isValid = this.checkValidations(this.MaturityPaymentForm, isValid);

  let selectedRows = this.FdDetailsList.filter(item => item.pStatus == true);

  if (selectedRows.length == 0) {
    this._commonService.showWarningMessage("Please Select Atleast One Checkbox");
    return false;
  }
  let invalid = selectedRows.filter(x => !x.pPaid_Amount || x.pPaid_Amount == 0);

  if (invalid.length > 0) {
    this._commonService.showWarningMessage("Enter Pay Amount for selected rows");
    return false;
  }

  return isValid;
}
  back() {
    debugger;
      debugger;
      if(sessionStorage.referralStatusMP!=undefined || sessionStorage.nomineeDetailsMP!=undefined){
        if(sessionStorage.referralStatusMP!=undefined){
        this.currreferralStatus = JSON.parse(sessionStorage.referralStatusMP);
        }
        if(sessionStorage.nomineeDetailsMP!=undefined){
          this.currNomineeAndReferralStatus = JSON.parse(sessionStorage.nomineeDetailsMP);;
          }
        if(this.currreferralStatus==true || this.currNomineeAndReferralStatus==true){
        //this._commonService.showWarningMessage('Please Add Nominee and Referral Details');
        this.showModal = true;
           return;
        }
        else{
          this.router.navigate(['/MaturitypaymentView']);
        }
      }
      else{
        this.router.navigate(['/MaturitypaymentView']);
      }
      // this.nomineeDetails.nomineeList=[];

  //this.router.navigate(['/MaturitypaymentView']);
    // this.router.navigate(['/MaturityRenewal']);

  }
  closeModal(): void {
    this.showModal = false;
    // this.showModal1 = false;
  }

  CheckLateFeeAmount(event,rowIndex,dataItem) {
    debugger;
         let OutstandingAmount =isNullOrEmptyString( this.staticFDDetails[rowIndex].pNetPayable)? 0 : this.staticFDDetails[rowIndex].pNetPayable.toString().replace(/,/g, "");
         let Oldlatefeeamount=isNullOrEmptyString(this.staticFDDetails[rowIndex].pLateFeeAmount)?0 : this.staticFDDetails[rowIndex].pLateFeeAmount.toString().replace(/,/g, "");
         let paidamount=isNullOrEmptyString(this.staticFDDetails[rowIndex].pPaid_Amount) ? 0 : this.staticFDDetails[rowIndex].pPaid_Amount.toString().replace(/,/g, "");

         let NewLateFeeAmount=isNullOrEmptyString(event.target.value)? 0 : event.target.value;
         let oustandingwithoutLFee=Number(OutstandingAmount)-Number(Oldlatefeeamount);

         //this.FdDetailsList[rowIndex].pLateFeeAmount.push(NewLateFeeAmount);
         this.FdDetailsList[rowIndex].pNetPayable=Number(oustandingwithoutLFee)+Number(NewLateFeeAmount.toString().replace(/,/g, ""));
         this.FdDetailsList[rowIndex].pPending_Amount=Number(this.FdDetailsList[rowIndex].pNetPayable)-Number(paidamount);
         this.FdDetailsList=[...this.FdDetailsList]
    if(!isNullOrEmptyString(event.target.value)){
     this.FdDetailsList[rowIndex].islatefee =false;
     this.FdDetailsList[rowIndex].pLateFeeAmount=event.target.value;
    }
    else{
      this.FdDetailsList[rowIndex].islatefee =true;
       this.FdDetailsList[rowIndex].pLateFeeAmount ='';
    }



  }


  // ValidatePayAmount(event, dataItem, rowIndex) {
  //   debugger;
  //   // if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(dataItem.pPending_Amount)) {
  //   //   this._commonService.showWarningMessage("Pay Amount Should not be greter than Pending Amount..")
  //   //   //this.FdDetailsList[rowIndex].pRenewalAmount = "";
  //   // }
  //   //else {
  //   //  this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
  //   //  if (isNaN(this.totalRenewalAmount))
  //   //    this.totalRenewalAmount = 0;
  //   //}
  // }


  ValidatePayAmount(event, dataItem, rowIndex) {
      debugger;
   this.FdDetailsList[rowIndex].pPaid_Amount = event.target.value;
  this.calculateTDSAndNetInterest(rowIndex);
}
ValidateRateOfInterest(event, dataItem, rowIndex) {
    debugger;
  this.FdDetailsList[rowIndex].pRateOfInterest = event.target.value;
  this.FdDetailsList = [...this.FdDetailsList];
}

calculateTDSAndNetInterest(rowIndex: number) {
  debugger;
  const row = this.FdDetailsList[rowIndex];

  const paidAmount = parseFloat(
    row.pPaid_Amount ? row.pPaid_Amount.toString().replace(/,/g, '') : '0'
  ) || 0;

  // Reset if amount is zero
  if (paidAmount <= 0) {
    this.FdDetailsList[rowIndex] = {
      ...this.FdDetailsList[rowIndex],
      pTDSAmount: 0,
      pNetInterest: 0,
      pTDSRate: 0
    };
    this.FdDetailsList = [...this.FdDetailsList];
    return;
  }

  // PAN from row — returned by GetDelayInterestFdDetails → fn_delay_intrest_details1
  const panCard = (row.pPanno || '').toString().trim();

  // ***  IF NUMAMT > 0 AND HCOUNT > 0 ***
  // pPanno undefined/null = no PAN document exists = HCOUNT = 0
  const hcount = (row.pPanno !== undefined && row.pPanno !== null) ? 1 : 0;

  if (hcount === 0) {
    // ***  ELSE NUMTDSAMT := 0 (no PAN document exists) ***
    this.FdDetailsList[rowIndex] = {
      ...this.FdDetailsList[rowIndex],
      pTDSAmount: 0,
      pNetInterest: paidAmount,
      pTDSRate: 0
    };
    this.FdDetailsList = [...this.FdDetailsList];
    return;
  }

  // *** HCOUNT > 0 — PAN document exists ***
  this._MaturityPaymentService.getTDSExemptCount(row.pFdaccountno).subscribe(res => {

    // *** inopcnt from tabinoperative ***
    const inopCount = res['inopCount'] || 0;

    // *** tdscnt from tabtdsnotdct ***
    const tdsExemptCount = res['tdsExemptCount'] || 0;

    let tdsAmount = 0;
    let tdsRate   = 0;

    if (panCard === null || panCard === '') {
      // *** IF PANCARD IS NULL OR PANCARD='' → CEIL(NUMAMT*20/100) ***
      tdsRate   = 20;
      tdsAmount = Math.ceil(paidAmount * 20 / 100);

    } else if (panCard.toUpperCase() === 'NO PAN' || inopCount > 0) {
      // *** IF UPPER(PANCARD)='NO PAN' OR inopcnt>0 → CEIL(NUMAMT*20/100) ***
      tdsRate   = 20;
      tdsAmount = Math.ceil(paidAmount * 20 / 100);

    } else if (tdsExemptCount > 0) {
      // *** if tdscnt>0 → NUMTDSAMT=0 (Form 15G/15H exempt) ***
      tdsRate   = 0;
      tdsAmount = 0;

    } else {
      // *** NUMTDSAMT := CEIL(NUMAMT*10/100) (valid PAN) ***
      tdsRate   = 10;
      tdsAmount = Math.ceil(paidAmount * 10 / 100);
    }

    const netInterest = paidAmount - tdsAmount;

    this.FdDetailsList[rowIndex] = {
      ...this.FdDetailsList[rowIndex],
      pTDSAmount: tdsAmount,
      pNetInterest: netInterest,
      pTDSRate: tdsRate
    };
    this.FdDetailsList = [...this.FdDetailsList];

  }, (error) => {
    // on error — default to 20% safe side
    const tdsAmount   = Math.ceil(paidAmount * 20 / 100);
    const netInterest = paidAmount - tdsAmount;
    this.FdDetailsList[rowIndex] = {
      ...this.FdDetailsList[rowIndex],
      pTDSAmount: tdsAmount,
      pNetInterest: netInterest,
      pTDSRate: 20
    };
    this.FdDetailsList = [...this.FdDetailsList];
    this._commonService.showErrorMessage(error);
  });
}
  ViewDetails(event, dataItem, rowIndex) {
    debugger;
    this._FdReceiptService.GetFdDetailsById(dataItem.pFdaccountno,dataItem.pFdaccountid).subscribe(result => {
      debugger;
      this.showMaturitytab = true;
      this.ShowFixeddepositdetails = true;
      if (result) {

        this.Fdaccountno = result[0].pFdaccountno;
        this.Membername = result[0].pMembername;
        this.Depositamount = result[0].pDeposiamount;
        this.Maturityamount = result[0].pMaturityamount;
        this.DepositDate = result[0].pDeposidate;
        this.MaturityDate = result[0].pMaturitydate;
        this.Tenortype = result[0].pTenortype;
        this.Tenor = result[0].pTenor;
        this.Interesttype = result[0].pInteresttype;
        this.Interestrate = result[0].pInterestrate;
        this.InterestPayble = result[0].pInterestPayble;
        this.InterestPayout = result[0].pInterestPayout;
        this.Damages = dataItem.pDamages;
        this.AgentConsolidated = dataItem.pAgentcommssionpayable;
        this.OutstandingAmount = dataItem.pNetPayable
        this.showPrematurity = dataItem.pMaturityType == "Pre-Maturity" ? true : false;
      }
    })



  }
  //#endregion

  //#region Validation controls
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
        formcontrol = <FormGroup>this.MaturityPaymentForm['controls']['ppaymentsslistcontrols'].get(key);
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

  getBranchDetails() {
    this._FdReceiptService.GetFDReceiptBranchDetails().subscribe(result => {
      this.branchDetails = result;
    })
  }

  BranchChange(event) {

  }



  ledgerName_Change($event: any): void {
    debugger
    const pledgerid = $event.pledgerid;
    this.subledgeraccountslist = [];
    this.subledgerName = '';
    this.MaturityPaymentForm['controls']['psubledgerid'].setValue(null);
    this.MaturityPaymentForm['controls']['psubledgername'].setValue('');
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
      this.MaturityPaymentForm['controls']['pledgername'].setValue(ledgername);
    }
    else {

      this.setBalances('LEDGER', 0);
      this.MaturityPaymentForm['controls']['pledgername'].setValue('');
    }

  }


  GetSubLedgerData(pledgerid) {

    this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

      //console.log(json)
      if (json != null) {

        this.subledgeraccountslist = json;

        let subLedgerControl = <FormGroup>this.MaturityPaymentForm['controls']['psubledgername'];
        if (this.subledgeraccountslist.length > 0) {
          // this.showsubledger = true;
          subLedgerControl.setValidators(Validators.required);
        }
        else {
          subLedgerControl.clearValidators();
          // this.showsubledger = false;
          this.MaturityPaymentForm['controls']['psubledgerid'].setValue(pledgerid);
          this.MaturityPaymentForm['controls']['psubledgername'].setValue(this.MaturityPaymentForm.get('pledgername').value);
          // this.formValidationMessages['psubledgername'] = '';
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

      this.MaturityPaymentForm['controls']['psubledgername'].setValue(subledgername);
      let data = this.subledgeraccountslist.filter(function (ledger) {
        return ledger.psubledgerid == psubledgerid;
      })[0];
      this.setBalances('SUBLEDGER', data.accountbalance);

    }
    else {

      this.MaturityPaymentForm['controls']['psubledgername'].setValue('');
      this.setBalances('SUBLEDGER', 0);
    }
    this.GetValidationByControl(this.MaturityPaymentForm, 'psubledgername', true);
  }

uploadAndProgress(event: any, files: FileList, formname: string, rowIndex: number) {
  debugger;

  if (!files || files.length === 0) return;

  const file = files[0];
  this.MaturityPaymentForm.controls.pFilename.setValue(file.name);
  const extension = file.name.split('.').pop().toLowerCase();

  if (!this.validateFile(file.name)) {
    this._commonService.showWarningMessage("Upload jpg or png or pdf files");
    return;
  }

    this.isFileUploading = true;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    this.imageResponse = {
      name: file.name,
      fileType: "imageResponse",
      contentType: file.type,
      size: file.size,
    };
  };

  const formData = new FormData();
  let fname = '';
   this.datetimeimgpath = '';
    this.datetimeimg = '';

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];
    fname = currentFile.name;

    let nameWithoutExt = fname.split('.').slice(0, -1).join('.');
    this.datetimeimg = this.datePipe.transform(new Date(), "ddMMyyyyhmmss") + '-' + 'ttt' + '.' + extension;
    this.datetimeimgpath = this.datePipe.transform(new Date(), "ddMMyyyyhmmss") + '-' + 'ttt' + '.' + extension;
    this.datetimeimgpath = fname + ' ' + this.datetimeimgpath;
    this.datetimeimg = nameWithoutExt + ' ' + this.datetimeimg;

    if (formname === 'delayinterest') {
      //this.MaturityPaymentForm.controls.pDocStorePath.setValue(fname);
      //this.MaturityPaymentForm.controls.pFilename.setValue(this.datetimeimg);
      // this.MaturityPaymentForm.controls.pDocStorePath.setValue(this.datetimeimg);
      // formData.append(currentFile.name, currentFile);
      // formData.append('NewFileName','savepan.' + currentFile.name.split('.').pop());
       formData.append('file', currentFile, this.datetimeimg); 
    }
  }



  this._commonService.fileUploadS3("DelayInterest", formData)
    .subscribe({
      next: (data: any) => {
        debugger;

        const uploadedFileName = data[0];

        this.kycFileName = uploadedFileName;
        this.imageResponse.name = uploadedFileName;

        if (formname === 'delayinterest') {
          this.MaturityPaymentForm.controls.pFilename.setValue(this.datetimeimg);
          this.MaturityPaymentForm.controls.pDocStorePath.setValue(uploadedFileName);
        }

        if (rowIndex !== null && rowIndex !== undefined) {
          this.FdDetailsList[rowIndex]['documentupload'] = uploadedFileName;
          this.FdDetailsList = [...this.FdDetailsList];
        }
        this.isFileUploading = false;
      },
      error: (err) => {
        console.error(err);
         this.imageResponse = null;
        this.kycFileName = null;
        this.datetimeimg = '';
        this.datetimeimgpath = '';

        this.MaturityPaymentForm.controls.pFilename.setValue('');
        this.MaturityPaymentForm.controls.pDocStorePath.setValue('');

        this.isFileUploading = false;
        this._commonService.showErrorMessage("File upload failed");
      }
    });
}

// uploadAndProgress(event: any, files: FileList, formname: string, rowIndex: number) {
//   debugger;

//   if (!files || files.length === 0) return;

//   const file = files[0];

//   this.MaturityPaymentForm.controls.pFilename.setValue(file.name);

//   if (!this.validateFile(file.name)) {
//     this._commonService.showWarningMessage(
//       "Upload jpg or png or pdf files"
//     );
//     return;
//   }

//   this.isFileUploading = true;

//   const reader = new FileReader();
//   reader.readAsDataURL(file);

//   reader.onload = () => {
//     this.imageResponse = {
//       name: file.name,
//       fileType: "imageResponse",
//       contentType: file.type,
//       size: file.size
//     };
//   };

//   const formData = new FormData();
//   let fname = "";

//   for (let i = 0; i < files.length; i++) {
//     const currentFile = files[i];
//     fname = currentFile.name;

//     if (formname === "delayinterest") {
//       this.MaturityPaymentForm.controls.pDocStorePath.setValue(fname);
//     }
//     formData.append("files", currentFile, currentFile.name);
//   }

//   this._commonService.fileUpload1(formData).subscribe({
//     next: (data: any) => {
//       debugger;

//       const uploadedFileName = data[1];

//       this.kycFileName = uploadedFileName;
//       this.imageResponse.name = uploadedFileName;

//       if (formname === "delayinterest") {
//         this.MaturityPaymentForm.controls.pDocStorePath.setValue(
//           uploadedFileName
//         );
//       }

//       if (rowIndex !== null && rowIndex !== undefined) {
//         this.FdDetailsList[rowIndex]["documentupload"] = uploadedFileName;
//         this.FdDetailsList = [...this.FdDetailsList];
//       }

//       this.isFileUploading = false;
//     },

//     error: (err) => {
//       console.error(err);
//       this.isFileUploading = false;
//       this._commonService.showErrorMessage(
//         "File upload failed"
//       );
//     }
//   });
// }
  validateFile(fileName) {
    try {
      debugger
      if (fileName == undefined || fileName == "") {
        return true
      }
      else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf') {

          return true
        }
      }
      return false
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }


  //#endregion
}
