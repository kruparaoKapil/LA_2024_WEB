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
import { MaturityPaymentRenewalComponent } from './maturity-payment-renewal.component';
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
  selector: 'app-maturity-paymentnew',
  templateUrl: './maturity-paymentnew.component.html',
  styleUrls: ['./maturity-paymentnew.component.css']
})
export class MaturityPaymentnewComponent implements OnInit {

  @ViewChild(MaturityPaymentRenewalComponent, { static: false }) maturityPaymentRenewalComponent: MaturityPaymentRenewalComponent;

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
  totalRenewalAmount: any;
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
  ShowRenewal: boolean = false;
  ShowRenewalFdTransaction: boolean = false;
  ShowmaturityBondsList: boolean = false;
  allRowsSelected: boolean = false;
  disablesavebutton = false;
  ShowPaymentGrid: boolean = false;
  ShowRenewalGrid: boolean = false;
  showMaturitytab: boolean = false;
  ShowFixeddepositdetails: boolean = false;
  showPrematurity: boolean = false;
  savebutton = "Next";
  MaturityPaymentList: any = [];
    userDetails: any;
    userNameF: any;
    userIdF: any;

    subledgeraccountslist: any;
   showsubledger = true;
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
      pLateFeeAmount: [0]
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
   // this.PaymentTypeList = [{ PaymentType: 'Payment' }, { PaymentType: 'Renewal' }];
   this.PaymentTypeList = [{ PaymentType: 'Payment' }];
  }
  GetMaturityMembers(PaymentType,Depositype) {
    this._MaturityPaymentService.GetMaturityMembers(PaymentType,Depositype).subscribe(result => {
      this.MaturityMemberDetails = result;
    })
  }
  MemberChange(event) {
    debugger;
    this.FdDetailsList = [];
    this.staticFDDetails=[];
    this.MaturityPaymentList = [];
    this.SavingsAccounts=[];
    this.allRowsSelected = false;
    this.showMaturitytab = false;
    this.ShowFixeddepositdetails = false;
    let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
    let paymentDate = this.MaturityPaymentForm.controls.pMaturitypaymentdate.value;
    this._CoJointmemberService._setfdMembercode(event.pMembercode, event.pMemberid);
    //this.formValidationMessages.pTransTypeid = "";
    if (!isNullOrUndefined(event)) {
      this.GetAccountDetails(event.pMembercode);
      this.MaturityPaymentForm.controls.pMembername.setValue(event.pMembername);
      this._MaturityPaymentService.GetMaturityFdDetails(PaymentType, event.pMemberid, this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")).subscribe(result => {
        this.FdDetailsList = result;
        this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
        this.FdDetailsList.filter(function (df) { df.pStatus = false; df.IsRenewal = false; df.pRenewalAmount, df.Editable = true ,df.islatefee=false});
        if (PaymentType == "Payment") {
          this.ShowPaymentGrid = true;
          this.ShowRenewalGrid = false;
        }
        if (PaymentType == "Renewal") {
          this.ShowPaymentGrid = false;
          this.ShowRenewalGrid = true;
        }

      })
      this.MemberEvent = ({ pMemberId: event.pMemberid, pMemberName: event.pMembername, pMemberCode: event.pMembercode, pContactid: event.pContactid, pContactrefid: event.pContactrefid, pMemberTypeid: event.pMemberTypeid, pMemberType: event.pMemberType })
      this.MaturityPaymentForm.controls.pBranch.setValue(event.pBranch);
      this.MaturityPaymentForm.controls.pBranchId.setValue(event.pBranchId);

//       this.maturityPaymentRenewalComponent.FdTranscationform['controls']['pChitbranchname'].setValue(event.pBranch)

//  this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(event.pBranch);
//     this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(event.pBranchId);

    }
    else {
      this.ShowmaturityBondsList = false;
      this.MemberEvent = "";
    }
  }
  PaymentTypeChange(event,PaymentTypes) {
debugger
    this.MaturityPaymentForm.controls.pmodofpayment.setValue('BANK');
    this.modeofPaymentChange();
    this.MaturityPaymentForm.controls.pMemberid.setValue(null);
    this.FdDetailsList = [];
    this.staticFDDetails=[];
    this.SavingsAccounts=[];
    this.MaturityMemberDetails = [];
    this.formValidationMessages.pMemberid='';
    this.ShowmaturityBondsList = false;
    this.showMaturitytab = false;
    this.ShowFixeddepositdetails = false;
    let pPaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
    let Depositype = this.MaturityPaymentForm.controls.Depositype.value;
    if (!isNullOrUndefined(event)) {
      if(PaymentTypes=='Payment Type'){
        this.MaturityPaymentForm.controls.pMemberid.setValue('');
        this.MaturityPaymentForm.controls.Depositype.setValue('FD');
        this.formValidationMessages.pMemberid='';
       // this.MaturityMemberDetails=[];


      //

      this.MaturityPaymentForm.controls.pMemberid.setValue('');
      this.formValidationMessages.pMemberid='';
      //this.MaturityPaymentForm.controls.Depositype.setValue('');
     // this.MaturityMemberDetails=[];
     this.MaturityPaymentForm.controls.pmodofpayment.setValue('CASH');
      this.modeofPaymentChange();
      if(this.MaturityPaymentForm.controls.pPaymentType.value!='Renewal'){
        this.Showpayment = true;
        this.MaturityPaymentForm.controls.pmodofpayment.setValue('BANK');
        this.MaturityPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
        this.showModeofPayment = true;
        this.SavingAccountShowhide=false;
        this.showtranstype = true;
      }
      else{
        this.Showpayment = false;
      }
      this.ShowRenewal = true;
      this.ShowRenewalFdTransaction = false;
      this.disablesavebutton = false;
      this.GetMaturityMembers(pPaymentType,'FD');
      }
      // else if(PaymentTypes=='Deposit Type'){
      //   this.MaturityPaymentForm.controls.pMemberid.setValue('');
      //   this.formValidationMessages.pMemberid='';
      //   //this.MaturityPaymentForm.controls.Depositype.setValue('');
      //  // this.MaturityMemberDetails=[];
      //  this.MaturityPaymentForm.controls.pmodofpayment.setValue('CASH');
      //   this.modeofPaymentChange();
      //   if(this.MaturityPaymentForm.controls.pPaymentType.value!='Renewal'){
      //     this.Showpayment = true;
      //   }
      //   else{
      //     this.Showpayment = false;
      //   }
      //   this.ShowRenewal = true;
      //   this.ShowRenewalFdTransaction = false;
      //   this.disablesavebutton = false;
      //   this.GetMaturityMembers(pPaymentType,event.PaymentType);
      // }
      // if (pPaymentType == "Payment") {

      //   // this.Showpayment = true;
      //   // this.ShowRenewal = false;
      //   // this.ShowRenewalFdTransaction = false;
      //   //this.disablesavebutton = false;
      //   this.GetMaturityMembers(event.PaymentType,Depositype);
      // }
      // else {
      //   // this.MaturityPaymentForm.controls.pmodofpayment.setValue('CASH');
      //   // this.modeofPaymentChange();
      //   // this.Showpayment = true;
      //   // this.ShowRenewal = true;
      //   // this.ShowRenewalFdTransaction = false;
      //   // this.disablesavebutton = false;
      //   this.GetMaturityMembers(pPaymentType,event.PaymentType);
      // }

    }
    else {
      this.Showpayment = false;
      this.ShowRenewal = false;
      this.ShowRenewalFdTransaction = false;

    }
  }


  SelectMaturitybond(event, dataItem, rowIndex) {
    debugger;
    if (event.target.checked) {
      this.FdDetailsList[rowIndex].pStatus = true;
      this.FdDetailsList[rowIndex].IsRenewal = true;
      this.FdDetailsList[rowIndex].islatefee = false;
      this.FdDetailsList[rowIndex].Editable = false;
      this.FdDetailsList[rowIndex].pRenewalAmount = "";
      this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;
      //const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
      //control.controls.pTransTypeid.setValue(dataItem.pFdaccountid);
      //control.controls.pPaidAmount.setValue(dataItem.pNetPayable);
      //control.controls.pAccountno.setValue(dataItem.pAccountno);
      //this.allRowsSelected = this.FdDetailsList.length == this.MaturityPaymentList.length ? true : false;
      //this.MaturityPaymentList.push(control.value);




    }
    else {
      this.FdDetailsList[rowIndex].pStatus = false;
      this.FdDetailsList[rowIndex].IsRenewal = false;
      this.FdDetailsList[rowIndex].islatefee = false;
      this.FdDetailsList[rowIndex].Editable = true;
      this.FdDetailsList[rowIndex].pNetPayable = this.staticFDDetails[rowIndex].pNetPayable
      this.FdDetailsList[rowIndex].pLateFeeAmount =this.staticFDDetails[rowIndex].pLateFeeAmount
      this.FdDetailsList[rowIndex].pPending_Amount = this.staticFDDetails[rowIndex].pPending_Amount
      this.FdDetailsList[rowIndex].pRenewalAmount = "";


      this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;
      //const index: number = this.MaturityPaymentList.findIndex(elem => { return elem.pTransTypeid === dataItem.pFdaccountid});

      //if (index !== -1) {
      //  this.MaturityPaymentList.splice(index, 1);
      //}
      //this.allRowsSelected = this.FdDetailsList.length == this.MaturityPaymentList.length ? true : false;


    }
  }

  selectAll(event, row, rowIndex) {
    debugger;
    //this.MaturityPaymentList = [];
    if (event.target.checked) {
      this.allRowsSelected = true;
      this.FdDetailsList.filter(x => x.pStatus = true);
      this.FdDetailsList.filter(x => x.IsRenewal = true);
      this.FdDetailsList.filter(x => x.islatefee = false);
      this.FdDetailsList.filter(x => x.Editable = false);
      this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;
      //const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
      //for (let i = 0; i < this.FdDetailsList.length; i++) {
      //  control.controls.pTransTypeid.setValue(this.FdDetailsList[i].pFdaccountid);
      //  control.controls.pPaidAmount.setValue(this.FdDetailsList[i].pNetPayable);
      //  control.controls.pAccountno.setValue(this.FdDetailsList[i].pAccountno);
      //  this.MaturityPaymentList.push(control.value);
      //}
    }
    else {
      this.allRowsSelected = false;
      this.FdDetailsList=this.staticFDDetails;
      this.FdDetailsList.filter(x => x.pStatus = false);
      this.FdDetailsList.filter(x => x.IsRenewal = false);
      this.FdDetailsList.filter(x => x.islatefee = false);
      this.FdDetailsList.filter(x => x.Editable = true);
      this.FdDetailsList.filter(x => x.pRenewalAmount = "");
      this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;

    }
  }

  saveMaturityPayment() {
    debugger;
    try {
      this.disablesavebutton = true;
      this.savebutton = 'Processing';
      let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
      let IsValid: boolean = true;
      if (isNullOrEmptyString(PaymentType)) {
        this.disablesavebutton = false;
        this.savebutton = 'Save & Continue';
        this.checkValidations(this.MaturityPaymentForm, IsValid);
      }
      if (PaymentType == "Payment") { this.SavePayments(); }
      if (PaymentType == "Renewal") {
        let data = [];
        data = this.FdDetailsList.filter(item => item.pStatus == true);
        let count = data.filter(item => isNullOrEmptyString(item.pRenewalAmount)).length;
        if (count == 0) {

          let validation=this._CoJointmemberService._GettCoJointmembervalidation();
          if(validation=='success'){
       this.Tabposition = 3;
          }
          if (this.Tabposition == 1)
            this.FisrtTabSave();
          if (this.Tabposition == 2)
            this.SecondTabSave();
          if (this.Tabposition == 3)
            this.ThirdTabSave();




        }
        else {
          this.disablesavebutton = false;
          this.savebutton = 'Save & Continue';
        }

      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      this.disablesavebutton = false;
      this.savebutton = 'Save & Continue';
    }

  }

  FisrtTabSave() {
    debugger;
    this.MaturityPaymentForm.controls.ptotalpaidamount.setValue(this.MaturityPaymentList.reduce((sum, c) => sum + parseFloat(c.pPaidAmount), 0));
    if (this.validatesaveMaturityPayment()) {
      let paymentdata = [];
      this.MaturityPaymentList = [];
      let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
      const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
      if (this.FdDetailsList.length > 0)
        paymentdata = this.FdDetailsList.filter(item => item.pStatus == true);

      for (let i = 0; i < paymentdata.length; i++) {
        let fddata = [];
        fddata = this.FdDetailsList.filter(item => item.pFdaccountid == paymentdata[0].pFdaccountid);
        control.controls.pTransTypeid.setValue(fddata[0].pFdaccountid);
        if(fddata[0].pRenewalAmount){
          fddata[0].pRenewalAmount=this._commonService.removeCommasForEntredNumber(fddata[0].pRenewalAmount)
          fddata[0].pRenewalAmount = parseInt(fddata[0].pRenewalAmount);
          control.controls.pPaidAmount.setValue(fddata[0].pRenewalAmount);

          // fddata[i].pRenewalAmount = parseInt(fddata[i].pRenewalAmount);
          // control.controls.pPaidAmount.setValue(this._commonService.removeCommasForEntredNumber(fddata[i].pRenewalAmount));
        }
        // if(fddata[0].pAccountno==null){
        //   fddata[0].pAccountno=0;
        // }
        control.controls.pAccountno.setValue(fddata[0].pFdaccountid);
        control.controls.pOutstandingAmount.setValue(fddata[0].pNetPayable);
        control.controls.pLateFeeAmount.setValue(fddata[0].pLateFeeAmount);
        if (PaymentType !== "Payment") {
          let newdata = { IsRenewal: fddata[0].IsRenewal, pRenewalAmount: fddata[0].pRenewalAmount };
          let Renewaldata = Object.assign(control.value, newdata);
          this.MaturityPaymentList.push(Renewaldata);
        }
        else {
          this.MaturityPaymentList.push(control.value);
        }
      }
      // if (this.maturityPaymentRenewalComponent.ValidateFirstTab()) {
        if (this.maturityPaymentRenewalComponent.FdTranscationform.controls.pMaturityAmount.value == 0) {
          let tenuremode = this.maturityPaymentRenewalComponent.TenureMode.toUpperCase()
          let tenure = parseInt(this.maturityPaymentRenewalComponent.Tenure)
          let intrestpayout = this.maturityPaymentRenewalComponent.Intrestpayout.toUpperCase()
          let depositamount = parseInt(this.maturityPaymentRenewalComponent.depositamount)
          let intrestcompunding = this.maturityPaymentRenewalComponent.IntrestCompounding.toUpperCase()
          this._fdrdttranscationservice.GetIntrestAmount(tenuremode, tenure, depositamount,
            intrestpayout, intrestcompunding, this.maturityPaymentRenewalComponent.Intrestrate, this.maturityPaymentRenewalComponent.Caltype).subscribe(res => {
              debugger
              console.log("maturiti amount", res)

              //this.maturityPaymentRenewalComponent.Showmaturityamountforintrest = true;
              // this.maturityPaymentRenewalComponent.ShowIntrestamountforintrest = true;
              this.maturityPaymentRenewalComponent.FdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
              this.maturityPaymentRenewalComponent.MaturityAmnt = res[0].pMatueritytAmount
              this.maturityPaymentRenewalComponent.IntrestAmount = res[0].pInterestamount
              this.maturityPaymentRenewalComponent.FdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount)
              this.SaveRenewal()

            })
        }
        else {
          this.SaveRenewal()

        }
      // }
      // else {
      //   this.disablesavebutton = false;
      //   this.savebutton = 'Save & Continue';
      // }
    }
    else {
      this.disablesavebutton = false;
      this.savebutton = 'Save & Continue';
    }
  }

  SecondTabSave() {
    debugger
    //5157
   this.disablesavebutton = false;
   this.savebutton = 'Save & Continue';
    this.maturityPaymentRenewalComponent.SecondTabSave();

      //  this.disablesavebutton = false;
      //  this.savebutton = 'Save & Continue';
      //  this.Tabposition = 3;
    // this.SaveJointAndNominee();
    // this.maturityPaymentRenewalComponent.fdJointmemberComponent.ShowSaveClearbuttons = false;
    // debugger;
    // this.maturityPaymentRenewalComponent.fdJointmemberComponent.GetDataForJointMember()
    // this.maturityPaymentRenewalComponent.fdJointmemberComponent.GetMemberdetails()
    // let isValid = true
    // let fidata = JSON.stringify(this.maturityPaymentRenewalComponent.fdJointmemberComponent.nomineeDetails.nomineeList)
    // this.maturityPaymentRenewalComponent.fdJointmemberComponent.nomineeDetails.nomineeList
    // console.log("fidata", fidata)
    // debugger
    // this.maturityPaymentRenewalComponent.fdJointmemberComponent.contacttype = this._fdrdttranscationservice.GetBusinessEntityStatus()
    // if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.contacttype == true) {
    //   this.maturityPaymentRenewalComponent.fdJointmemberComponent.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
    // }
    // let status: boolean = false;
    // status = (this.maturityPaymentRenewalComponent.fdJointmemberComponent.jointMembervalidation && this.maturityPaymentRenewalComponent.fdJointmemberComponent.fdMembersandContactDetailsList.length > 0) ? true : !this.maturityPaymentRenewalComponent.fdJointmemberComponent.jointMembervalidation ? true : false;
    // if (status) {
    //   if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.nomineeDetails.nomineeList.length != 0) {
    //     if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.validatepercentage()) {
    //       if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.checkcount()) {
    //         this.SaveJointAndNominee()
    //       }
    //       else { this.disablesavebutton = false; this.savebutton = 'Save & Continue'; }
    //     }
    //     else { this.disablesavebutton = false; this.savebutton = 'Save & Continue'; }
    //   }
    //   else {
    //     if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.value == true) {
    //       if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.nomineeDetails.checkedlist.length != 0) {
    //         this.SaveJointAndNominee()
    //       }
    //       else {
    //         this._commonService.showWarningMessage("Enter Nominee Details")
    //         this.disablesavebutton = false;
    //         this.savebutton = 'Save & Continue';
    //       }
    //     }
    //     else {
    //       this.SaveJointAndNominee()
    //     }


    //   }

    // }
    // else {
    //   this.disablesavebutton = false;
    //   this.savebutton = 'Save & Continue';
    //   this._commonService.showWarningMessage("Enter Joint Member")
    // }
  }
  ThirdTabSave() {
    debugger
    this.disablesavebutton = false;
    this.savebutton = 'Save & Continue';
        this.maturityPaymentRenewalComponent.ThirdTabSave();

    // let isValid = true;
    // this.maturityPaymentRenewalComponent.fdReferralComponent.GetDataForJointMember()
    // if (this.maturityPaymentRenewalComponent.fdReferralComponent.ShowReferral == true) {


    //   if (this.maturityPaymentRenewalComponent.fdReferralComponent.checkValidations(this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm, isValid)) {
    //     this.savereferal()
    //   }


    //   else {
    //     if (this.maturityPaymentRenewalComponent.fdReferralComponent.checkValidations(this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm, isValid)) {
    //       this.savereferal()
    //     }
    //   }
    // }
    // else {
    //   this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm.controls.pReferralId.setValue(0);
    //   this.savereferal()
    // }
  }

  SaveJointAndNominee() {

    // if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.fdMembersandContactDetailsList.length > 0 || this.maturityPaymentRenewalComponent.fdJointmemberComponent.nomineeDetails.nomineeList.length > 0) {
    //   if (this.maturityPaymentRenewalComponent.fdJointmemberComponent.showNominee) {
    //     this.maturityPaymentRenewalComponent.fdJointmemberComponent.getConfigNomineeDetails();
    //   }
    // }

    // //FD Transaction
    // debugger
    // let contactdetails = { fdMembersandContactDetailsList: this.maturityPaymentRenewalComponent.fdJointmemberComponent.fdMembersandContactDetailsList }

    // let contactdetailsform = Object.assign(this.maturityPaymentRenewalComponent.fdJointmemberComponent.JointMemberAndNomineeForm.value, contactdetails);

    // let nominedetails = { fdMemberNomineeDetailsList: this.maturityPaymentRenewalComponent.fdJointmemberComponent.newlist }
    // let nomineeform = Object.assign(this.maturityPaymentRenewalComponent.fdJointmemberComponent.JointMemberAndNomineeForm.value, nominedetails);

    // let data = JSON.stringify(nomineeform)
    // console.log(data)
    // debugger


    // this._CoJointmemberService.SaveJointMember(data).subscribe(json => {
    //   if (json) {
    //     this.maturityPaymentRenewalComponent.fdJointmemberComponent.clear()
    //     let str = "refferral"
    //     $('.nav-item a[href="#' + str + '"]').tab('show');
    //     this.maturityPaymentRenewalComponent.fdReferralComponent.ShowSaveClearbuttons = false;
    //     this.disablesavebutton = false;
    //     this.savebutton = "Save & Continue";
    //     this.Tabposition = 3;
    //   }
    //   else { this.disablesavebutton = false; this.savebutton = 'Save & Continue'; }
    // })
  }

  savereferal() {
    debugger
    this.maturityPaymentRenewalComponent.fdReferralComponent.firsttabdata = this._fdrdttranscationservice._Getgriddata()
    this.maturityPaymentRenewalComponent.fdReferralComponent.firsttabdata = []
    let commisiondata = this._fdrdttranscationservice._GetCommisiontype()
    console.log(commisiondata)
    debugger
    this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm.controls.pCommisionValue.setValue(commisiondata['commissionvalue'])
    this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm.controls.pCommissionType.setValue(commisiondata['commissiontype'])
    debugger
    let data = JSON.stringify(this.maturityPaymentRenewalComponent.fdReferralComponent.referralForm.value)
    console.log(data)
    this._CoReferralService.SaveReferralData(data).subscribe(json => {
      if (json) {

        this._commonService.showInfoMessage("Saved successfully")
        this.maturityPaymentRenewalComponent.fdReferralComponent.FormGroup();

        this.maturityPaymentRenewalComponent.fdReferralComponent.ShowReferral = false;
        let str = "selectmember"
        $('.nav-item a[href="#' + str + '"]').tab('show');
        this.ClearDetails();
        this.Tabposition = 1;
        this.disablesavebutton = false;
        this.savebutton = 'Save & Continue';
      }
    }, (error) => {
      //this.isLoading = false;
      this._commonService.showErrorMessage(error);
      this.disablesavebutton = false;
      this.savebutton = "Save & Continue";
    })
  }
  calculateRatePerSqaureYard() {
    debugger;

    if (this.maturityPaymentRenewalComponent.ratepersquareyard != 0 && this.maturityPaymentRenewalComponent.ratepersquareyard != undefined) {
      this.maturityPaymentRenewalComponent.ratesquareyard = this.maturityPaymentRenewalComponent.depositamount / this.maturityPaymentRenewalComponent.ratepersquareyard;
      this.maturityPaymentRenewalComponent.FdTranscationform.controls.pSquareyard.setValue(this.maturityPaymentRenewalComponent.ratesquareyard);

    }

  }
  SaveRenewal() {
    this.calculateRatePerSqaureYard();



    if(this.maturityPaymentRenewalComponent.Showmaturityamountforintrest == false && this.maturityPaymentRenewalComponent.ShowIntrestamountforintrest == false){
      this.savebutton = 'Next';
      this._commonService.showWarningMessage("Please Click Calculate Button")
    return;
    }

    if(this.maturityPaymentRenewalComponent.MaturityAmnt == '' && this.maturityPaymentRenewalComponent.IntrestAmount == ''){
      this.savebutton = 'Next';
      this._commonService.showWarningMessage("Please Click Calculate Button")
    return;
    }

    if(this.maturityPaymentRenewalComponent.FdTranscationform.controls.pContactid.value==""){
      this.maturityPaymentRenewalComponent.FdTranscationform.controls.pContactid.setValue(0);
    }
    this.maturityPaymentRenewalComponent.FdTranscationform.controls.pMemberId.setValue(this.maturityPaymentRenewalComponent.MemberidSave);
    let isValid = true;
    //let data = JSON.stringify(this.maturityPaymentRenewalComponent.FdTranscationform.value)

    debugger
    this.maturityPaymentRenewalComponent.FdTranscationform.controls.pContacttype.setValue(this.maturityPaymentRenewalComponent.contactType)
    this.maturityPaymentRenewalComponent.FdTranscationform.controls.pTransdate.setValue(this.MaturityPaymentForm.controls.pMaturitypaymentdate.value);
    // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(this.MaturityPaymentForm.controls.pBranch.value);
    // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(this.MaturityPaymentForm.controls.pBranchId.value);
    let newdata = { MaturityPaymentsList: this.MaturityPaymentList, _FdMemberandSchemeSave: this.maturityPaymentRenewalComponent.FdTranscationform.value };
    let paymentVoucherdata = Object.assign(this.MaturityPaymentForm.value, newdata);
    let data = JSON.stringify(paymentVoucherdata)
    console.log(data)
    this._MaturityPaymentService.SaveMaturityRenewal(data).subscribe(json => {
      debugger;
      console.log(json)
      this._commonService.showWarningMessage("Add Nominee Details");

      if(json){

        // sessionStorage.setItem('referralStatus', JSON.stringify(true));
        sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(true));
        sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(true));

      }
      else{
        // sessionStorage.setItem('referralStatus', JSON.stringify(false));
        sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(false));
        sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(false));


    }

      let str = "add-joint-member"
      $('.nav-item a[href="#' + str + '"]').tab('show');
      this.Tabposition = 2;
      this.disablesavebutton = false;
      this.savebutton = 'Next';
    //   this._rdttranscationservice.GetMemberNomineeDetails(this.maturityPaymentRenewalComponent.Membercode).subscribe(json => {
    //     debugger
    //       this._CoJointmemberService.sendMemberNomineeDetails(json);
    //  })
     let resdata = { accountId:json['pFdAccountId'], accountNo:json['pFdaccountNo'] };
     this._CoJointmemberService._SetShareAccountdata(resdata);
      this.maturityPaymentRenewalComponent.fdJointmemberComponent.ShowSaveClearbuttons = false;
      this.maturityPaymentRenewalComponent.GetApplicanttypes(this.maturityPaymentRenewalComponent.contactType);
      this.maturityPaymentRenewalComponent.clearform();
      this.maturityPaymentRenewalComponent.showgrid = false;
      // this.griddata=[]
      this._fdrdttranscationservice._Setgriddata(this.maturityPaymentRenewalComponent.griddata)
      this.maturityPaymentRenewalComponent.FdaccountNo = json['pFdaccountNo']
      this.maturityPaymentRenewalComponent.FdAccountId = json['pFdAccountId']
      this._fdrdttranscationservice._SetDataForJointMember(this.maturityPaymentRenewalComponent.Applicanttype, this.maturityPaymentRenewalComponent.FdAccountId, this.maturityPaymentRenewalComponent.FdaccountNo, this.maturityPaymentRenewalComponent.Contactid, this.maturityPaymentRenewalComponent.contactrefid)

      this._rdttranscationservice.GetMemberNomineeDetails(this.maturityPaymentRenewalComponent.Membercode).subscribe(json => {
        debugger

        this.maturityPaymentRenewalComponent.Nomineedetails = json;
        this._fdrdttranscationservice._SetNomineedetails(this.maturityPaymentRenewalComponent.Nomineedetails)
      })
      debugger

      this.maturityPaymentRenewalComponent.showIntrestcompounding = false;
      this.maturityPaymentRenewalComponent.showintrestrate = false;
      this.maturityPaymentRenewalComponent.FdSchemeDetails = ""
      this.maturityPaymentRenewalComponent.DepositAmountBaseconintrest = false
      this.maturityPaymentRenewalComponent.Showmaturityamount = false;

      this.maturityPaymentRenewalComponent.Multiplesof = ""
      this.maturityPaymentRenewalComponent.IntrestCompounding = ""

    }, (error) => {
      //this.isLoading = false;
      this._commonService.showErrorMessage(error);
      this.disablesavebutton = false;
      this.savebutton = 'Save & Continue';
    })

  }
  SavePayments() {

    debugger;

    if ((this.MaturityPaymentForm.controls.pmodofpayment.value).toUpperCase() == "ADJUSTMENT") {
    if (!this.MaturityPaymentForm.controls.pledgername.value) {
      this._commonService.showWarningMessage("Please Select Ledger Account.");
      this.disablesavebutton = false;
      this.savebutton = "Save & Continue";
      return;
    }
    if (!this.MaturityPaymentForm.controls.psubledgername.value) {
      this._commonService.showWarningMessage("Please Select Sub Ledger Account.");
      this.disablesavebutton = false;
      this.savebutton = "Save & Continue";
      return;
    }
  }

    if (this.validatesaveMaturityPayment()) {
      let paymentdata = [];
      this.MaturityPaymentList = [];

      const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
      console.log('control:', control);
      if (this.FdDetailsList.length > 0)
        paymentdata = this.FdDetailsList.filter(item => item.pStatus == true);

      for (let i = 0; i < paymentdata.length; i++) {

        let fddata = [];
        fddata = this.FdDetailsList.filter(item => item.pFdaccountid == paymentdata[i].pFdaccountid);


        control.controls.pTransTypeid.setValue(fddata[0].pFdaccountid);
        //control.controls.pPaidAmount.setValue(this.FdDetailsList[i].pNetPayable);
        if(fddata[0].pRenewalAmount){
          fddata[0].pRenewalAmount=this._commonService.removeCommasForEntredNumber(fddata[0].pRenewalAmount)
          fddata[0].pRenewalAmount = parseInt(fddata[0].pRenewalAmount);
          control.controls.pPaidAmount.setValue(fddata[0].pRenewalAmount);
        }
        //  fddata[i].pLateFeeAmount=this._commonService.removeCommasForEntredNumber(fddata[i].pLateFeeAmount)
        // if(fddata[0].pAccountno==null){
        //   fddata[0].pAccountno=0;
        // }
        control.controls.pAccountno.setValue(fddata[0].pAccountno);
        control.controls.pOutstandingAmount.setValue(fddata[0].pNetPayable);
        control.controls.pLateFeeAmount.setValue(fddata[0].pLateFeeAmount);
        this.MaturityPaymentList.push(control.value);

      }
      this.MaturityPaymentForm.controls.ptotalpaidamount.setValue(this.MaturityPaymentList.reduce((sum, c) => sum + parseFloat(c.pPaidAmount), 0));
      if(this.MaturityPaymentList.length>0){
        this.MaturityPaymentList.filter(row=>row.pLateFeeAmount=this._commonService.removeCommasForEntredNumber(row.pLateFeeAmount))
      }
       let newdata = { MaturityPaymentsList: this.MaturityPaymentList };
      let paymentVoucherdata = Object.assign(this.MaturityPaymentForm.value, newdata);
      debugger;
      let data = JSON.stringify(paymentVoucherdata);
      console.log(data);
      if ((this.MaturityPaymentForm.controls.pmodofpayment.value).toUpperCase() == "ADJUSTMENT") {
        // let data = JSON.stringify(paymentVoucherdata);
        // console.log(data);
        this._MaturityPaymentService.SaveMaturityPaymentForAdjustment(data).subscribe(res => {
          if (res) {
            debugger;
            this._commonService.showInfoMessage("Saved Successfully");
            if (res[0]['pJvnumber'] != undefined || res[0]['pJvnumber'] != null || res[0]['pJvnumber'] != '') {
              window.open('/#/JournalvoucherReport?id=' + btoa(res[0]['pJvnumber'] + ',' + 'Journal Voucher'));
            }
            // let receipt = btoa(res[0]['ppaymentid'] + ',' + 'Payment Voucher');
            // window.open('/#/PaymentVoucherReports?id=' + receipt);
            this.ClearDetails();
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          }
          else {
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          }

        },
          (error) => {
            //this.isLoading = false;
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          });
      }
      else {
        this._MaturityPaymentService.SaveMaturityPayment(data).subscribe(res => {
          if (res) {
            debugger;
            this._commonService.showInfoMessage("Saved Successfully");
            //this.toastr.success("Saved Successfully");
            let receipt = btoa(res[0]['ppaymentid'] + ',' + 'Payment Voucher');
            window.open('/#/PaymentVoucherReports?id=' + receipt);
            this.ClearDetails();
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          }
          else {
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          }
        },
          (error) => {
            //this.isLoading = false;
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.savebutton = "Save & Continue";
          });
      }


    }
    else {
      this.disablesavebutton = false;
      this.savebutton = "Save & Continue";
    }

  }
  ClearDetails() {
    this.ngOnInit();
    this.Showpayment = false;
    this.ShowRenewal = false;
    this.ShowPaymentGrid = false;
    this.ShowPaymentGrid = false;
    this.ShowRenewalGrid = false;
    this.ShowRenewalFdTransaction = false;
    this.showMaturitytab = false;
    this.ShowFixeddepositdetails = false;
    this.FdDetailsList = [];
    this.staticFDDetails=[];
    this.SavingsAccounts=[];
    this.MaturityPaymentList = [];
  }
  validatesaveMaturityPayment(): boolean {
    let isValid: boolean = true;
    let data = [];
    isValid = this.checkValidations(this.MaturityPaymentForm, isValid);
    data = this.FdDetailsList.filter(item => item.pStatus == true);
    if (data.length == 0) {
      this._commonService.showWarningMessage("Please Select Atleast One Checkbox")
      //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
      isValid = false;
    }
    else {
      let emptyamount = [];
      let latefeeamount=[];
      emptyamount = data.filter(item => isNullOrEmptyString(item.pRenewalAmount));
      if (emptyamount.length > 0) {
        this._commonService.showWarningMessage("Please Enter the Amount.")
        isValid = false;
      }
      latefeeamount = data.filter(item => isNullOrEmptyString(item.pLateFeeAmount));
      if (latefeeamount.length > 0) {
        this._commonService.showWarningMessage("Please Enter Late Fee Amount.")
        isValid = false;
      }

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
  checkRenewalAmount(event, rowIndex) {
    this.FdDetailsList[rowIndex].IsRenewal = isNullOrEmptyString(event.target.value) ? true : false;
    this.FdDetailsList[rowIndex].pRenewalAmount = isNullOrEmptyString(event.target.value) ? "" : event.target.value;
    console.log(event.target.value);
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
  AddRenewal() {
    debugger;
    let data = [];
    data = this.FdDetailsList.filter(item => item.pStatus == true);
    if (data.length == 0) {
      this._commonService.showWarningMessage("Please Select Atleast One Checkbox")
    }
    else {
      let FdAccountnos = "";

      for (let i = 0; i < data.length; i++) {
        FdAccountnos += '@' + data[i].pFdaccountno + '@,'
      }
      let count = data.filter(item => isNullOrEmptyString(item.pRenewalAmount)).length;
      if (count == 0) {
        FdAccountnos = FdAccountnos.toString().replace(/@/g, "'").slice(0, -1)
        this.GetFdTransactionDetails(FdAccountnos);
        this.ShowRenewalFdTransaction = true;
        this.disablesavebutton = false;

      }

    }
  }
  GetFdTransactionDetails(FdAccountnos) {
    if (!isNullOrEmptyString(FdAccountnos)) {
      this._MaturityPaymentService.GetFdTransactionDetails(FdAccountnos).subscribe(result => {
        debugger;
        let JointmemberDetails = [];
        let NomineeDetails = [];
        let JointmemberComponent = this.maturityPaymentRenewalComponent.fdJointmemberComponent;
        this.maturityPaymentRenewalComponent.RenewalAmount = this.totalRenewalAmount;

        this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(this.MaturityPaymentForm.controls.pBranch.value);
        this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(this.MaturityPaymentForm.controls.pBranchId.value);

        JointmemberDetails = result["fdMembersandContactDetailsList"];
        NomineeDetails = result["fdMemberNomineeDetailsList"];
        this.maturityPaymentRenewalComponent.MemberChanges(this.MemberEvent);
        if (JointmemberDetails.length > 0) {
          JointmemberComponent.ShowJointmemberstable = true;
          JointmemberComponent.ShowJointmembers = true;
          JointmemberComponent.JointMemberAndNomineeForm.controls.pIsjointMembersapplicableorNot.setValue(true);
          JointmemberComponent.fdMembersandContactDetailsList = JointmemberDetails
        }
        JointmemberComponent.nomineeDetails.nomineeList = NomineeDetails;
        // this.maturityPaymentRenewalComponent.fdJointmemberComponent.fdMembersandContactDetailsList = JointmemberAndNmineeDetaails["fdMembersandContactDetailsList"];
        //this.fdJointmemberComponent.nomineeDetails.nomineeList = JointmemberAndNmineeDetaails["FDMemberNomineeDetailsList"];
      })
    }
  }
  ValidateRenewalAmount(event, dataItem, rowIndex) {
    debugger;
    if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(dataItem.pPending_Amount)) {
      this._commonService.showWarningMessage("Renewal Amount Should not be greter than Pending Amount..")
      this.FdDetailsList[rowIndex].IsRenewal = true;
      this.FdDetailsList[rowIndex].pRenewalAmount = "";
    }
    else {
      this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;
    }
  }
  ValidatePayAmount(event, dataItem, rowIndex) {
    debugger;
    if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(dataItem.pPending_Amount)) {
      this._commonService.showWarningMessage("Pay Amount Should not be greter than Pending Amount..")
      this.FdDetailsList[rowIndex].IsRenewal = true;
      this.FdDetailsList[rowIndex].pRenewalAmount = "";
    }
    //else {
    //  this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
    //  if (isNaN(this.totalRenewalAmount))
    //    this.totalRenewalAmount = 0;
    //}
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
   debugger;
    this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

       console.log(json)
      if (json != null) {

        this.subledgeraccountslist = json;

        let subLedgerControl = <FormGroup>this.MaturityPaymentForm['controls']['psubledgername'];
        if (this.subledgeraccountslist.length > 0) {
           this.showsubledger = true;
          subLedgerControl.setValidators(Validators.required);
        }
        else {
          subLedgerControl.clearValidators();
          this.showsubledger = false;
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


  //#endregion
}
