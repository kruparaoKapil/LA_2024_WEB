import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined, debug } from 'util';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { SAReceiptService } from 'src/app/Services/Banking/Transactions/sa-receipt.service';
import { MaturityPaymentService } from 'src/app/Services/Banking/Transactions/maturity-payment.service';
declare var $: any;
@Component({
  selector: 'app-fdreceipt-new',
  templateUrl: './fdreceipt-new.component.html',
  styles: []
})
export class FdreceiptNewComponent implements OnInit {
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  dates: any = []
  events: Event[] = [];
  FdreceiptForm: FormGroup;
  receiptForm: FormGroup;
  public bankshowhide: boolean = false;
  public walletshowhide: boolean = false;
  public chequeshowhide: boolean = false;
  public onlineshowhide: boolean = false;
  public DebitShowhide: boolean = false;
  public creditShowhide: boolean = false;
  public SavingAccountShowhide: boolean = false;


  public DepositBankDisable: boolean = false;
  public MemberchangeFlag: boolean = false;
  public notEditable: boolean = true;
  public isLoading: boolean = false;
  public IsMemberType: boolean = false;
  disabledforButtons: boolean = true;
  public ShowFixeddepositdetails: boolean = false;
  public ShowRecenttransaction: boolean = false;
  public banklist: any;
  public modeoftransactionslist: any;
  public typeofpaymentlist: any;
  public ledgeraccountslist: any;
  public partylist: any;
  public gstlist: any;
  public debitcardlist: any;
  public BranchDetails: any;
  public MemberDetails: any = [];
  public FDMemberDetails: any = [];
  public FdDetailsList: any;
  public SavingsAccounts: any = [];

  public FdDetailsListByid: any;
  public DuesList: any = [];
  public TransactionList: any = [];
  public MemberchangeDetails: any = [];


  public membertypedetails: any = [];
  public bankbookBalance: any = '0' + 'Dr';
  public bankpassbookBalance: any = '0' + 'Dr';
  public ledgerBalance: any;
  public subledgerBalance: any;
  public partyBalance: any;
  public Transtype: any;
  public TotalAmount: any = 0;
  public DueAmount: any = 0;
  public ReceivedAmount: any;
  public BalanceAmount: any = 0;
  public BalanceDue: any = 0;
  public PendingChequeAmount: any = 0;
  public TransDate: any;

  public Fdaccountno: any;
  public Membername: any;
  public Deposiamount: any;
  public Maturityamount: any;
  public Tenortype: any;
  public Tenor: any;
  public Interesttype: any;
  public Interestrate: any;
  public InterestPayble: any;
  public InterestPayout: any;
  public MemberType: any;
  public Depositamount: any;
  public DepositDate: any;
  public MaturityDate: any;
  public cashBalance: number = 0;
  public bankBalance: number = 0;
  public SavingsMemberBalance: any;

  formValidationMessages: any;
  Modeofpayment: any;
  public today: Date = new Date();
  buttonName = "Save";

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  paidAmount: any = 0;
  remainingAmountBind: any = 0;
  panAvailable:any = 'No PAN'
  showGrid: boolean = false;
  pAgentpan: any;
  pMamberpan: any;
  ShowRenewalGrid: boolean = false;
  ShowRenewal: boolean = false;
  FdDetailsToList: any = [];
  staticFDDetails: any;
  MaturityMemberDetails: any = [];
  allRowsSelected: boolean = false;
  totalRenewalAmount: any;
  totalAdvanceAmount: any = 0;
  constructor(private formbuilder: FormBuilder, private zone: NgZone, private _Accountservice: AccountingTransactionsService, private toastr: ToastrService, private _commonService: CommonService, private datePipe: DatePipe, private _LienEntryService: LienEntryService,
    private _FdReceiptService: FdReceiptService, private router: Router, private _SaReceiptService: SAReceiptService, private _MaturityPaymentService:MaturityPaymentService) {
    window['CallingFunctionOutsideMemberData'] = {
      zone: this.zone,
      componentFn: (value) => this.MemberChange(value),
      component: this,
    };
    window['CallingFunctionToMemberHideCard'] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };
    this.dpConfig2.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig2.maxDate = new Date();
    this.dpConfig2.showWeekNumbers = false;

    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    //this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.formValidationMessages = {};
    this.ReceiptFormGroup();
    this.FdReceiptFormGroup();
    this.getLoadData();
    this.GetBranchDetails();
    this.GetMemberTypeDetails();
    this.Paymenttype("Bank");
    this.GetDateLockStatus();
    debugger;
    let object = ({ PDueAmount: "", Pdeduction: "", pReceivedamount: "", PbalanceDue: "" });
    this.DuesList.push(object);
    this.BlurEventAllControll(this.FdreceiptForm);
  }
  GetDateLockStatus() {
    debugger;
    this._commonService.GetDateLockStatus().subscribe(json => {
      debugger;
      this.notEditable = json ? false : true;
    })
  }
  ReceiptFormGroup() {
    this.receiptForm = this.formbuilder.group({
      pModeofreceipt: ['Bank'],
      pbankname: [''],
      pBranch: [''],
      pbranchname: [''],
      ptranstype: [''],
      ptypeofpayment: [''],
      pChequenumber: [0],
      pchequedate: [this.today],
      pDattransdate: [this.today, Validators.required],
      pBank: [''],
      pbankid: [0],
      pCardNumber: [''],
      pdepositbankid: [0],
      pdepositbankname: [''],
      pRecordid: [0],
      pUpiname: [''],
      pUpiid: [''],
      pSavingsMemberAccountid: ['0'],
      pSavingsMemberBalance: ['']

    });
  }
  FdReceiptFormGroup() {
    this.FdreceiptForm = this.formbuilder.group({
      pReceiptdate: [this.today, Validators.required],
      pBranch: [''],
      pMembertypeid: [null, [Validators.required]],
      pMemberid: [''],
      pMembercode: [null, [Validators.required]],
      pFdaccountid: [null, [Validators.required]],
      pInstalmentamount: ['', [Validators.required]],
      pReceivedamount: [0, [Validators.required]],
      pWaiver: [''],
      pBalance: [''],
      pDeposittype: [''],
      pSubledgerid: [''],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [this._commonService.pCreatedby],
      pNarration: ['', [Validators.required]],
      pContactid: [''],
      pMembername: [''],
      pContacttype: [''],
      pStatus: [true],
      pDueAmount: ['']

    })
  }
  //#region Payment modes
  public getLoadData() {
    this._Accountservice.GetReceiptsandPaymentsLoadingData('GENERAL RECEIPT').subscribe(json => {
      if (json != null) {

        this.banklist = json.banklist;
        this.modeoftransactionslist = json.modeofTransactionslist;  //Bank
        this.typeofpaymentlist = this.gettypeofpaymentdata();
        this.ledgeraccountslist = json.accountslist;
        this.partylist = json.partylist;
        this.gstlist = json.gstlist;
        this.debitcardlist = json.bankdebitcardslist;
        this.setBalances('CASH', json.cashbalance);
        this.setBalances('BANK', json.bankbalance);

      }
    },
      (error) => {
      });
  }
  public gettypeofpaymentdata(): any {
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
  public Bankbuttondata: any = [{ id: 1, type: "Cheque", chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false }, { id: 2, type: "Online", chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false }, { id: 3, type: "Debit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false }, { id: 4, type: "Credit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }];

  public Paymentbuttondata: any = [{ id: 1, type: "Cash", bankshowhide: false, walletshowhide: false }, { id: 2, type: "Bank", bankshowhide: true, walletshowhide: false }, { id: 3, type: "Wallet", bankshowhide: false, walletshowhide: true }, { id: 4, type: "ADJUSTMENT", bankshowhide: false, walletshowhide: false, SavingAccountShowhide: true },
    //{ id: 1, type: "JV", bankshowhide: false, walletshowhide: false }
  ];
  public Paymenttype(type) {
    debugger;

    for (var n = 0; n < this.Paymentbuttondata.length; n++) {
      if (this.Paymentbuttondata[n].type === type) {
        this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
        this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
        this.SavingAccountShowhide = this.Paymentbuttondata[n].SavingAccountShowhide;
      }
    }

    this.receiptForm.controls['pModeofreceipt'].setValue(type);
    this.receiptForm.controls['pbankname'].setValue('');
    this.receiptForm.controls['pChequenumber'].setValue('');
    this.receiptForm.controls['pchequedate'].setValue(this.today);
    this.receiptForm.controls['pdepositbankname'].setValue('');
    this.receiptForm.controls['ptypeofpayment'].setValue('');
    this.receiptForm.controls['pbranchname'].setValue('');
    this.receiptForm.controls['pCardNumber'].setValue('');
    if (type == 'Bank') {
      this.SavingAccountShowhide = false;
      this.ShowRenewalGrid = false;
      this.totalAdvanceAmount = 0;
      this.receiptForm.controls.ptranstype.setValue('Cheque');
      this.Banktype('Cheque')
      this.Modeofpayment = type;
      this.FdreceiptForm.controls['pNarration'].setValue('BEING THE AMOUNT RECEIVED FROM Mr./Mrs./Ms' + ' ' + (this.FdreceiptForm.controls.pMembername.value).toUpperCase() + ' ' + 'TOWARDS SALE ADVANCE-HRB SCHEME 1ST INSTALLMENT');
    }
    else if (type == 'ADJUSTMENT') {
      this.SavingAccountShowhide = true;
      this.totalAdvanceAmount = 0;
      this.GetMaturityMembers();
      this.receiptForm['controls']['pSavingsMemberAccountid'].setValue('');
      this.receiptForm['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
      this.receiptForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
      // this.RdreceiptForm.controls['pSavingsMemberBalance'].setValue(0);
      this.SavingsMemberBalance = 0;
      this.FdreceiptForm.controls['pNarration'].setValue('BEING THE AMOUNT RECEIVED FROM Mr./Mrs./Ms' + ' ' + (this.FdreceiptForm.controls.pMembername.value).toUpperCase() + ' ' + 'TOWARDS RENEWAL-JV');
    }
    else {
      this.SavingAccountShowhide = false;
      this.ShowRenewalGrid = false;
      this.totalAdvanceAmount = 0;
      this.receiptForm.controls.ptranstype.setValue('');
      let DepositBankNameControl = this.receiptForm.controls['pdepositbankname']
      let BankControl = this.receiptForm.controls['pbankname'];
      let ChequeControl = this.receiptForm.controls['pChequenumber']
      let TypeofPAymentControl = this.receiptForm.controls['ptypeofpayment'];
      let BranchControl = this.receiptForm.controls['pbranchname'];
      let CardNumberControl = this.receiptForm.controls['pCardNumber'];
      let ChequeDateControl = this.receiptForm.controls['pchequedate']
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
      this.receiptForm.controls.ptranstype.setValue('');
      this.FdreceiptForm.controls['pNarration'].setValue('BEING THE AMOUNT RECEIVED FROM Mr./Mrs./Ms' + ' ' + (this.FdreceiptForm.controls.pMembername.value).toUpperCase() + ' ' + 'TOWARDS SALE ADVANCE-HRB SCHEME 1ST INSTALLMENT');
    }

  }
  public Banktype(type) {
    debugger;
    this.validation(type);
    this.receiptForm.controls['pbankname'].setValue('');
    this.receiptForm.controls['pChequenumber'].setValue('');
    this.receiptForm.controls['pchequedate'].setValue(this.today);
    this.receiptForm.controls['pdepositbankname'].setValue('');
    this.receiptForm.controls['ptypeofpayment'].setValue('');
    this.receiptForm.controls['pbranchname'].setValue('');
    this.receiptForm.controls['pCardNumber'].setValue('');
    this.receiptForm.controls['pdepositbankid'].setValue('');

    this.Transtype = type;
    for (var n = 0; n < this.Bankbuttondata.length; n++) {
      if (this.Bankbuttondata[n].type === type) {

        this.chequeshowhide = this.Bankbuttondata[n].chequeshowhide;
        this.onlineshowhide = this.Bankbuttondata[n].onlineshowhide;
        this.creditShowhide = this.Bankbuttondata[n].creditShowhide;
        this.DebitShowhide = this.Bankbuttondata[n].DebitShowhide;
      }
    }
    if (type == 'Cheque') {
      let formname = 'CHEQUE';
      let ProjectLaunchDate = new Date().toISOString();
      this._commonService.GetChequeMinDate(formname, ProjectLaunchDate).subscribe(res => {
        debugger;
        if (res) {
          let minmonthsordays = res[0].pTenure;
          let tenuretype = (res[0].pTenurMode).toUpperCase();
          let mindate = new Date();
          let maxdate = new Date();
          if (tenuretype == 'MONTHS') {
            mindate.setMonth(mindate.getMonth() - minmonthsordays);
          }
          else {
            mindate.setDate(mindate.getDate() - minmonthsordays);
          }
          this.dpConfig.minDate = mindate;
        }
      }, error => {

      })
    }
    //  else{
    //     this.dpConfig.maxDate =new Date();
    //  }
    this.receiptForm.controls.pdepositbankname.setValue('');
    if (type == 'Online' || type == 'Cheque') {
      this.receiptForm.controls.ptypeofpayment.setValue('');
      this.DepositBankDisable = true;
      this.receiptForm.controls.pdepositbankid.setValue(0);
    }
    else {
      this.receiptForm.controls.ptypeofpayment.setValue(type);
      if (type == 'Debit Card' || type == 'Credit Card') {

        let DepositBankDisable
        let Modeofpayment = this.receiptForm.controls.pModeofreceipt.value.toUpperCase();
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
        const DepositBankIDControl = <FormGroup>this.receiptForm['controls']['pdepositbankid'];
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
    this.bankbookBalance = '0' + 'Dr';
    this.bankpassbookBalance = '0' + 'Dr';
    this.BlurEventAllControll(this.receiptForm);
    this.formValidationMessages = {};

  }
  validation(type) {
    this.formValidationMessages = {};
    let ChequeControl = this.receiptForm.controls['pChequenumber']
    let ChequeDateControl = this.receiptForm.controls['pchequedate'];
    let TypeofPaymentControl = this.receiptForm.controls['ptypeofpayment']
    let BankControl = this.receiptForm.controls['pbankname']
    let CardNumberControl = this.receiptForm.controls['pCardNumber']
    let DepositBankNameControl = this.receiptForm.controls['pdepositbankid'];
    DepositBankNameControl.clearValidators();
    ChequeControl.setValidators([Validators.required]);

    if (type == 'Online' || type == 'Cheque') {
      ChequeDateControl.setValidators([Validators.required]);
      if (type = 'Online') {
        BankControl.setValidators([Validators.required]);
        TypeofPaymentControl.clearValidators();
      }
      else {
        BankControl.clearValidators();
        TypeofPaymentControl.setValidators([Validators.required]);
      }
      CardNumberControl.clearValidators();
    }
    else {
      ChequeDateControl.clearValidators();
      BankControl.clearValidators();
      CardNumberControl.setValidators([Validators.required]);
      DepositBankNameControl.setValidators([Validators.required]);
    }


    ChequeDateControl.updateValueAndValidity();
    ChequeControl.updateValueAndValidity();
    TypeofPaymentControl.updateValueAndValidity();
    BankControl.updateValueAndValidity();
    CardNumberControl.updateValueAndValidity();
    DepositBankNameControl.updateValueAndValidity();
    //this.BlurEventAllControll(this.receiptForm)
  }
  BankNameChange() {
    this.GetValidationByControl(this.receiptForm, 'pbankname', true);
  }
  ChequeNoChange() {
    this.GetValidationByControl(this.receiptForm, 'pChequeisNullOrUndefinednumber', true);
  }
  ChequeDateChange() {
    this.GetValidationByControl(this.receiptForm, 'pchequedate', true);
  }
  CardNoChange() {
    this.GetValidationByControl(this.receiptForm, 'pCardNumber', true);
  }
  typeofPaymentChange(args) {
    debugger;
    this.formValidationMessages.pdepositbankid = '';
    this.GetValidationByControl(this.receiptForm, 'ptypeofpayment', true);
    let type = args.target.options[args.target.selectedIndex].text;
    if (this.Transtype != '') {
      this.receiptForm.controls.pdepositbankid.setValue(0);
      this.receiptForm.controls.pdepositbankname.setValue('');
      let DepositBankDisable
      let Modeofpayment = this.receiptForm.controls.pModeofreceipt.value.toUpperCase();
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
      const DepositBankIDControl = <FormGroup>this.receiptForm['controls']['pdepositbankid'];
      this.DepositBankDisable = DepositBankDisable
      if (this.DepositBankDisable == true) {
        DepositBankIDControl.clearValidators();
      }
      else {
        DepositBankIDControl.setValidators(Validators.required)
      }
      DepositBankIDControl.updateValueAndValidity();
    }
    this.BlurEventAllControll(this.receiptForm);
    this.formValidationMessages = {};
  }
  typeofDepositBank(args) {
    debugger;
    this.GetValidationByControl(this.receiptForm, 'pdepositbankid', true);
    let type = args.target.options[args.target.selectedIndex].text;

    this.receiptForm.controls.pdepositbankname.setValue(type)

    this.getBankBranchName(this.receiptForm.controls.pdepositbankid.value);
  }
  getBankBranchName(pbankid) {
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.receiptForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
  }
  //#endregion

  //#region FdReceipt
  GetBranchDetails() {
    this._FdReceiptService.GetFDReceiptBranchDetails().subscribe(result => {
      this.BranchDetails = result;
    })
  }
  public GetMemberTypeDetails() {

    this._commonService.Getmemberdetails('FIXED DEPOSIT').subscribe(json => {
      debugger;
      this.membertypedetails = json;
      // this.FdreceiptForm.controls.pMembertypeid.setValue(this.membertypedetails[0].pmembertypeid);
      this.MemberType = this.membertypedetails[0].pmembertype;
      // let objetct = ({ pmembertype: this.MemberType });
      // this.MemberTypeChange(objetct);

    });
  }
  MemberTypeChange(event) {
    debugger;

    this.ClearMemberAndFdDetails();
    if (!isNullOrUndefined(event)) {
      this.GetMemberDetails(event.pmembertype, '');
    }
    else {
      this.ClearMemberAndFdDetails();
    }

  }
  GetMemberDetails(MemberType, BranchName) {
    debugger;
    this._FdReceiptService.GetMemberDetails(MemberType, BranchName).subscribe(result => {
      debugger;
      if (result) {
        this.MemberDetails = result;
        this.FDMemberDetails = result;
        $("#MemberData").kendoMultiColumnComboBox({
          dataTextField: "pMembercode",
          dataValueField: "pMembercode",
          height: 400,
          columns: [
            { field: "pName", title: "Member Name", width: 200 },
            { field: "pMembercode", title: "Member code", width: 200 },
            { field: "pBusinessentitycontactno", title: "Contact Number", width: 200 },


          ],
          filter: "contains",
          filterFields: ["pName", "pMembercode", "pBusinessentitycontactno"],
          dataSource: this.MemberDetails,
          select: this.SelectMemberData,
          change: this.CancelClick
        });
      }

    })
  }
  BranchChange(event) {
    debugger;
    this.TransDate = "";
    this.FdreceiptForm.controls.pMembercode.setValue('');
    this.FdreceiptForm.controls.pFdaccountid.setValue('');
    this.formValidationMessages.pFdaccountid=''
    //this.ClearMemberAndFdDetails();
    this.disabledforButtons = true;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.showGrid = false;

    if (!isNullOrUndefined(event)) {

      //let Memberid = this.FdreceiptForm.controls.pMemberid.value;
      //let Membercode = this.FdreceiptForm.controls.pMembercode.value;
      //let object = { membercode: Membercode, memberid: Memberid, branch: event.pBranchname };
      this.GetMemberDetails(this.MemberType, event.pBranchname);
      // this.GetFdDetails(object);
    }
    else {
      this.FdDetailsList = [];
      this.SavingsAccounts = [];
      this.FdreceiptForm.controls['pAccountno'].setValue('');
      this.formValidationMessages.pAccountno = '';
    }

  }
  ReceiptDateChange() {
    debugger;
    let receiptDate = this.datePipe.transform(new Date(this.FdreceiptForm.controls.pReceiptdate.value), "dd-MMM-yyyy");
    if (!isNullOrEmptyString(this.TransDate)) {
      let TransactionDate = this.datePipe.transform(new Date(this.TransDate), "dd-MMM-yyyy");
      if (receiptDate < TransactionDate) {
        this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
        this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
      }
    }
  }
  ClearMemberAndFdDetails() {
    debugger;
    this.MemberDetails = [];
    this.FdDetailsList = [];
    this.SavingsAccounts = [];
    this.FdreceiptForm.controls.pMembercode.setValue(null);
    this.FdreceiptForm.controls.pMemberid.setValue('');
    this.FdreceiptForm.controls.pFdaccountid.setValue(null);
    this.FdreceiptForm.controls['pReceivedamount'].setValue('');
    this.FdreceiptForm.controls['pNarration'].setValue('');
    //this.notEditable = true;
    //this.receiptForm.controls.pReceiptdate.setValue(new Date());
    var multicolumncombobox: any;
    multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
    if (multicolumncombobox)
      multicolumncombobox.value("");
    this.formValidationMessages.pMembercode = '';
    this.formValidationMessages.pFdaccountid = '';
    this.disabledforButtons = true;
    this.TotalAmount = 0;
    this.DueAmount = 0;
    this.BalanceAmount = 0;
    this.BalanceDue = 0;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.Paymenttype('Bank');
    this.formValidationMessages = {};
  }
  MemberChange(event) {
    debugger;
    this.MemberchangeFlag = true;
    this.disabledforButtons = true;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.showGrid = false;

    this.TransDate = "";
    // this.notEditable = true;
    this.TotalAmount = 0;
    this.DueAmount = 0;
    this.BalanceAmount = 0;
    this.BalanceDue = 0;
    this.paidAmount = 0;
    this.remainingAmountBind = 0;
    this.FdreceiptForm.controls.pReceivedamount.setValue(0);
    let membercode = event.pMembercode;
    var Branch = this.FdreceiptForm.controls.pBranch.value;
    //let obj = [];
    //obj.push({ pMemberid: event.pMemberid, pMembercode: event.pMembercode, pContactreferenceid: event.pContactreferenceid, pName: event.pName})
    //this.MemberchangeDetails = obj;
    this.FdreceiptForm.controls.pMemberid.setValue(event.pMemberid);
    this.FdreceiptForm.controls.pContactid.setValue(event.pContactreferenceid);
    this.FdreceiptForm.controls.pMembername.setValue(event.pName);
    // this.receiptForm.controls.pReceiptdate.setValue(new Date());
    this.FdreceiptForm.controls['pNarration'].setValue('BEING THE AMOUNT RECEIVED FROM Mr./Mrs./Ms' + ' ' + (event.pName).toUpperCase() + ' ' + 'TOWARDS SALE ADVANCE-HRB SCHEME 1ST INSTALLMENT');
    let object = { membercode: membercode, memberid: event.pMemberid, branch: Branch };
    this.GetFdDetails(object);
    //this.LienReleaseformErrorMessages.pMembercode = "";
  }

  GetFdDetails(event) {
    debugger;
    this.FdreceiptForm.controls.pFdaccountid.setValue(null);
    this.formValidationMessages.pFdaccountid = "";
    if (!isNullOrEmptyString(event.membercode)) {
      this._FdReceiptService.GetFdDetails(event.membercode, event.branch).subscribe(result => {
        debugger;
        this.MemberchangeFlag = false;
        this.FdDetailsList = result;

      })
      this._SaReceiptService.GetSAvingsAccountDetails(event.membercode).subscribe(details => {
        this.SavingsAccounts = details;
      })
    }
  }

  FdAccountChange(event) {
    debugger;
    this.disabledforButtons = true;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.showGrid = false;
    // this.notEditable = true;
    //this.receiptForm.controls.pReceiptdate.setValue(new Date());
    if (!isNullOrEmptyString(event.pFdaccountno)) {
      this.paidAmount = 0;
      this.remainingAmountBind = 0;
      this.disabledforButtons = false;
      this.ShowFixeddepositdetails = true;
      this.ShowRecenttransaction = false;
      this._FdReceiptService.GetFdDetailsById(event.pFdaccountno,event.pFdaccountid).subscribe(result => {
        debugger;

        if (result) {

          this.FdDetailsListByid = result;
          this.Fdaccountno = this.FdDetailsListByid[0].pFdaccountno;
          this.Membername = this.FdDetailsListByid[0].pMembername;
          this.Deposiamount = this.FdDetailsListByid[0].pDeposiamount;
          this.Maturityamount = this.FdDetailsListByid[0].pMaturityamount;
          this.Tenortype = this.FdDetailsListByid[0].pTenortype;
          this.Tenor = this.FdDetailsListByid[0].pTenor;
          this.Interesttype = this.FdDetailsListByid[0].pInteresttype;
          this.Interestrate = this.FdDetailsListByid[0].pInterestrate;
          this.InterestPayble = this.FdDetailsListByid[0].pInterestPayble;
          this.InterestPayout = this.FdDetailsListByid[0].pInterestPayout;
          this.Depositamount = this.FdDetailsListByid[0].pDeposiamount;
          this.DepositDate = this.FdDetailsListByid[0].pDeposidate;
          this.MaturityDate = this.FdDetailsListByid[0].pMaturitydate;
          this.TotalAmount = this.FdDetailsListByid[0].pDeposiamount;
          this.ReceivedAmount = this.FdDetailsListByid[0].pClearedmount;
          this.BalanceAmount = this.FdDetailsListByid[0].pBalanceamount;
          this.PendingChequeAmount = this.FdDetailsListByid[0].pPendingchequeamount;
          this.TransDate = this.FdDetailsListByid[0].pTransdate;
          this.FdreceiptForm.controls.pSubledgerid.setValue(this.FdDetailsListByid[0].pAccountno);

          this.pAgentpan = this.FdDetailsListByid[0].pAgentpan;
          this.pMamberpan = this.FdDetailsListByid[0].pMamberpan;
          this.showGrid = true


          this.FdreceiptForm.controls.pInstalmentamount.setValue(this.BalanceAmount);
          let receiptDate = this.datePipe.transform(new Date(this.FdreceiptForm.controls.pReceiptdate.value), "dd-MMM-yyyy");
          let TransactionDate = this.datePipe.transform(new Date(this.TransDate), "dd-MMM-yyyy");
          let RDate = this.datePipe.transform(new Date(this.FdreceiptForm.controls.pReceiptdate.value), "yyyy-MM-dd");
          let TDate = this.datePipe.transform(new Date(this.TransDate), "yyyy-MM-dd");
          if (RDate < TDate) {
            this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
            this.receiptForm.controls.FdreceiptForm.setValue(new Date);
          }
          //this.dpConfig2.minDate = new Date(this.TransDate);
          //this.notEditable = false;
          // let paidAmount = 0;
          // paidAmount = this.TransactionList.reduce((sum, item) => sum + Number(item.pReceiptamount), 0);

          // this.paidAmount = paidAmount;
          // console.log(this.paidAmount);

          // let aaa = this.FdreceiptForm.controls.pInstalmentamount.value;
          // let bbb = this.paidAmount;

          // let ccc = aaa - bbb

          // this.remainingAmount = ccc;
        }
        this.amountChange();
      })
      this._FdReceiptService.GetTransactionslist(event.pFdaccountid).subscribe(data => {
        debugger;
        if (data) {
          this.TransactionList = data;

        }

      });



    }

  }

  amountChange(){
    debugger
    this.remainingAmountBind = 0;
          this.paidAmount = 0;
          let paidAmount = 0;
          let aaa = 0;
          let bbb = 0;
          let ccc = 0;

          paidAmount = this.TransactionList.reduce((sum, item) => sum + Number(item.pReceiptamount), 0);
          this.paidAmount = paidAmount;
          aaa = this.Depositamount;
          bbb = this.paidAmount;
          ccc =  aaa - bbb;
          this.remainingAmountBind = ccc;
  }

  SavingsAccountsChanges(event) {
    debugger
    this.receiptForm.controls.pSavingsMemberAccountid.setValue(event.pSavingsMemberAccountid);
    this.SavingsMemberBalance = event.pSavingsMemberBalance;
    this.formValidationMessages['pSavingsMemberAccountid'] = '';
  }

  GetMaturityMembers() {
    this._MaturityPaymentService.GetMaturityMembers('Renewal','FD').subscribe(result => {
      this.MaturityMemberDetails = result;
    })
  }

  MemberToChange(event){
    debugger;
    let PaymentType = 'Renewal';
    this.allRowsSelected = false;
    let paymentDate = this.today;
    this.totalAdvanceAmount = 0;

    this.receiptForm.controls.pSavingsMemberAccountid.setValue(event.pMemberid);
    this.formValidationMessages['pSavingsMemberAccountid'] = '';

    this._MaturityPaymentService.GetMaturityFdDetails(PaymentType, event.pMemberid, this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")).subscribe(result => {
      this.FdDetailsToList = result;
      this.FdDetailsToList = this.FdDetailsToList.map(obj => {

        obj.pmemberName = event.pMembername;
        obj.pmemberNameId = event.pMemberid;
        return obj;
      });
      this.totalAdvanceAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat((c.pDepositamount)), 0);
      this.receiptForm['controls']['pSavingsMemberBalance'].setValue(this.totalAdvanceAmount);
      this.staticFDDetails = this.FdDetailsToList.map(x => ({ ...x }));
      this.FdDetailsToList.filter(function (df) { df.pStatus = false; df.IsRenewal = false; df.pRenewalAmount, df.Editable = true ,df.islatefee=false});

        this.ShowRenewalGrid = true;
        this.ShowRenewal = true;


    })

  }

  ValidateRenewalAmount(event, dataItem, rowIndex) {
    debugger;
    let gridValue = parseFloat(event.target.value.toString().replace(/,/g, ""));
    let totalAmount = parseFloat(this.FdreceiptForm.controls.pReceivedamount.value.toString().replace(/,/g, ""));
    if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(dataItem.pPending_Amount)) {
      this._commonService.showWarningMessage("Renewal Amount Should not be greter than Pending Amount..")
      this.FdDetailsToList[rowIndex].IsRenewal = true;
      this.FdDetailsToList[rowIndex].pRenewalAmount = "";
    }
   else if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(this.remainingAmountBind)) {
      this._commonService.showWarningMessage("Renewal Amount Should not be greter than Balance  Amount..")
      this.FdDetailsToList[rowIndex].IsRenewal = true;
      this.FdDetailsToList[rowIndex].pRenewalAmount = "";
    }

    else if (gridValue != totalAmount) {
      this._commonService.showWarningMessage("Renewal Amount Should be equal to Total Received Amount..")
      this.FdDetailsToList[rowIndex].IsRenewal = true;
      this.FdDetailsToList[rowIndex].pRenewalAmount = "";
    }

    else {
      this.totalRenewalAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;
    }
  }

   checkRenewalAmount(event, rowIndex) {
    this.FdDetailsToList[rowIndex].IsRenewal = isNullOrEmptyString(event.target.value) ? true : false;
    this.FdDetailsToList[rowIndex].pRenewalAmount = isNullOrEmptyString(event.target.value) ? "" : event.target.value;
    console.log(event.target.value);
  }



  SelectMaturitybond(event, dataItem, rowIndex) {
    debugger;
    if (event.target.checked) {
      this.FdDetailsToList[rowIndex].pStatus = true;
      this.FdDetailsToList[rowIndex].IsRenewal = true;
      this.FdDetailsToList[rowIndex].islatefee = false;
      this.FdDetailsToList[rowIndex].Editable = false;
      this.FdDetailsToList[rowIndex].pRenewalAmount = "";
      this.totalRenewalAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;

    }
    else {
      this.FdDetailsToList[rowIndex].pStatus = false;
      this.FdDetailsToList[rowIndex].IsRenewal = false;
      this.FdDetailsToList[rowIndex].islatefee = false;
      this.FdDetailsToList[rowIndex].Editable = true;
      this.FdDetailsToList[rowIndex].pNetPayable = this.staticFDDetails[rowIndex].pNetPayable
      this.FdDetailsToList[rowIndex].pLateFeeAmount =this.staticFDDetails[rowIndex].pLateFeeAmount
      this.FdDetailsToList[rowIndex].pPending_Amount = this.staticFDDetails[rowIndex].pPending_Amount
      this.FdDetailsToList[rowIndex].pRenewalAmount = "";


      this.totalRenewalAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;



    }
  }

  selectAll(event, row, rowIndex) {
    //this.MaturityPaymentList = [];
    if (event.target.checked) {
      this.allRowsSelected = true;
      this.FdDetailsToList.filter(x => x.pStatus = true);
      this.FdDetailsToList.filter(x => x.IsRenewal = true);
      this.FdDetailsToList.filter(x => x.islatefee = false);
      this.FdDetailsToList.filter(x => x.Editable = false);
      this.totalRenewalAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;

    }
    else {
      this.allRowsSelected = false;
      this.FdDetailsToList=this.staticFDDetails;
      this.FdDetailsToList.filter(x => x.pStatus = false);
      this.FdDetailsToList.filter(x => x.IsRenewal = false);
      this.FdDetailsToList.filter(x => x.islatefee = false);
      this.FdDetailsToList.filter(x => x.Editable = true);
      this.FdDetailsToList.filter(x => x.pRenewalAmount = "");
      this.totalRenewalAmount = this.FdDetailsToList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
      if (isNaN(this.totalRenewalAmount))
        this.totalRenewalAmount = 0;

    }
  }
  SelectMemberData(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideMemberData'].componentFn(dataItem)
    }
    else {
      //var multicolumncombobox: any;
      //multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
      //if (multicolumncombobox)
      //  multicolumncombobox.value("");
    }
  }
  CancelClick() {
    window['CallingFunctionToMemberHideCard'].componentFn()
  }
  HideCard() {
    debugger;
    this.disabledforButtons = true;
    this.ShowFixeddepositdetails = false;
    if (!this.MemberchangeFlag) {
      if (this.FdreceiptForm.controls['pMembercode'].value) {

        this.FdreceiptForm.controls['pMembercode'].setValue('');
        this.FdreceiptForm.controls['pMemberid'].setValue('');
        this.FdreceiptForm.controls['pContactid'].setValue('');
        this.FdreceiptForm.controls['pMembername'].setValue('');
        //  this.FdreceiptForm.controls['pAccountno'].setValue('');
        this.FdDetailsList = [];
        this.formValidationMessages.pMemberid = '';
        this.formValidationMessages.pAccountno = '';
        this.FdDetailsList = [];
        this.FdreceiptForm.controls['pFdaccountid'].setValue(null);

      }
    }
  }
  DueAmountChange(event, rowIndex) {
    debugger;
    this.formValidationMessages.PDueAmount = isNullOrEmptyString(event.target.value) ? "Due Amount Required" : "";
    this.DuesList[rowIndex].PDueAmount = isNullOrEmptyString(event.target.value) ? "" : event.target.value;
  }
  WaiverAmountChange(event) {
    debugger;
    let TotalAmount = this.FdreceiptForm.controls.pInstalmentamount.value;
    let ReceivedAmount = this.FdreceiptForm.controls.pReceivedamount.value;
    let Waiver = this.FdreceiptForm.controls.pWaiver.value;
    //let Balance = (isNullOrEmptyString(TotalAmount) ? 0 : parseInt(TotalAmount.toString().replace(/,/g, ""))) - ((isNullOrEmptyString(ReceivedAmount) ? 0 : parseInt(ReceivedAmount.toString().replace(/,/g, ""))) + (isNullOrEmptyString(Waiver) ? 0 : parseInt(Waiver.toString().replace(/,/g, ""))));
    let Balance = this.BalanceAmount - ((isNullOrEmptyString(ReceivedAmount) ? 0 : parseInt(ReceivedAmount.toString().replace(/,/g, ""))) + (isNullOrEmptyString(Waiver) ? 0 : parseInt(Waiver.toString().replace(/,/g, ""))));
    if (Balance < 0) {
      this._commonService.showWarningMessage("Received Amount Should not be greater than Amount Due..")
      this.FdreceiptForm.controls.pReceivedamount.setValue('');
      this.FdreceiptForm.controls.pWaiver.setValue('');
      this.FdreceiptForm.controls.pBalance.setValue('');
    }
    else {
      this.FdreceiptForm.controls.pBalance.setValue(this._commonService.currencyformat(Balance));
      this.BalanceDue = Balance;
    }
  }
  ReceivedamountChange(event) {
    debugger;

    let TotalAmount = this.FdreceiptForm.controls.pInstalmentamount.value;
    let ReceivedAmount = this.FdreceiptForm.controls.pReceivedamount.value;
    ReceivedAmount = ReceivedAmount.replace(/,/g, "")
   let ReceivedAmount1 =  this._commonService.removeCommasForEntredNumber(ReceivedAmount);
   ReceivedAmount = ReceivedAmount1
   let Balance =this.remainingAmountBind;


console.log(ReceivedAmount);
console.log(Balance);

    // ReceivedAmount = (isNullOrEmptyString(ReceivedAmount) ? 0 : parseInt(ReceivedAmount.toString().replace(/,/g, ""))) + (isNullOrEmptyString(this.PendingChequeAmount) ? 0 : parseInt(this.PendingChequeAmount.toString().replace(/,/g, "")))

    // let Waiver = this.FdreceiptForm.controls.pWaiver.value;
    // let Balance = this.remainingAmountBind - ((isNullOrEmptyString(ReceivedAmount) ? 0 : parseInt(ReceivedAmount.toString().replace(/,/g, ""))) + (isNullOrEmptyString(Waiver) ? 0 : parseInt(Waiver.toString().replace(/,/g, ""))));



    if (ReceivedAmount > Balance) {
      this._commonService.showWarningMessage("Received Amount Should not be greater than Amount Due..")
      this.FdreceiptForm.controls.pReceivedamount.setValue('');
      this.FdreceiptForm.controls.pWaiver.setValue('');
      this.FdreceiptForm.controls.pBalance.setValue('');
    }
    else {
      this.FdreceiptForm.controls.pBalance.setValue(this._commonService.currencyformat(Balance));
      this.BalanceDue = Balance;
    }


    let av = parseFloat(this.FdreceiptForm.controls['pReceivedamount'].value.toString().replace(/,/g, ""));
    if (this.receiptForm.controls.pModeofreceipt.value == 'Cash' && av >= 200000) {
      this._commonService.showWarningMessage('Cash Dosenot Accept More Than 20,0000');
      this.FdreceiptForm.controls['pReceivedamount'].setValue('');
      return
    }
  }
  saveFDReceipt() {
    debugger;
    if (this.receiptForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
    let receiptDate = this.datePipe.transform(new Date(this.FdreceiptForm.controls.pReceiptdate.value), "dd-MMM-yyyy");
    // if (!isNullOrEmptyString(this.TransDate)) {
    //   let TransactionDate = this.datePipe.transform(new Date(this.TransDate), "dd-MMM-yyyy");
    //   if (receiptDate < TransactionDate) {
    //     this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
    //    // this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
    //    return;
    //   }
    // }
    let isvalid = true;
    let receivedamount = this.FdreceiptForm.controls.pReceivedamount.value;
    if (receivedamount == 0) {
      this.FdreceiptForm.controls.pReceivedamount.setValue('');
    }
    // let chequeno = this.receiptForm.controls.pChequenumber.value;
    // if (chequeno == 0) {
    //   this.receiptForm.controls.pChequenumber.setValue('');
    // }



    for (let index = 0; index < this.FdDetailsToList.length; index++) {
      if(this.FdreceiptForm.controls.pMembername.value != this.FdDetailsToList[index].pmemberName){
        if (confirm("Member Name and Renewal Member Name is not same Do you want to save ?")) {


    // if (this.checkValidations(this.receiptForm, isvalid) && this.checkValidations(this.FdreceiptForm, isvalid)) {

      if(this.pAgentpan == '' || this.pAgentpan == null){
        this._commonService.showWarningMessage('Agent Pan is empty please enter Agent Pan No.');
        return;
      }

      if(this.pMamberpan == '' || this.pMamberpan == null){
        this._commonService.showWarningMessage('Member Pan is empty please enter Member Pan No.');
        return;
      }

      if(this.pMamberpan == '' && this.pAgentpan == ''){
        this._commonService.showWarningMessage('Member Pan and Agent Pan is empty please enter Member and Agent Pan No.');
        return;
      }

      this.receiptForm.controls['pBank'].setValue(this.receiptForm.controls['pbankname'].value);




      this.FdreceiptForm.controls.pDeposittype.setValue("FD");
      this.FdreceiptForm.controls.pBalance.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pBalance.value));
      this.FdreceiptForm.controls.pInstalmentamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pInstalmentamount.value));
      this.FdreceiptForm.controls.pReceivedamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pReceivedamount.value));


      // if (this.receiptForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
      //   if (this.SavingsMemberBalance < parseFloat(this.FdreceiptForm.controls.pReceivedamount.value.toString().replace(/,/g, ""))) {
      //     this._commonService.showWarningMessage('Amount Received should be Less Than or Equal to Saving Account Balance');
      //     return;
      //   }
      // }
      this.isLoading = true;
      let selectedItemsdata =[];

      for(let i=0; i<this.FdDetailsToList.length; i++){
        let data ={
          "pTransTypeid":this.FdDetailsToList[i].pFdaccountid,
          "pTransType": this.FdDetailsToList[i].pFdaccountno,
          "pMaturityjvdate": this.datePipe.transform(this.FdDetailsToList[i].pTransdate,"dd-MM-yyyy"),
          "pPaidAmount": this.FdDetailsToList[i].pRenewalAmount,
          "pOutstandingAmount": this.FdDetailsToList[i].pNetPayable,
          "pLateFeeAmount": this.FdDetailsToList[i].pLateFeeAmount,
          "pMemberid": this.FdDetailsToList[i].pmemberNameId,

        }
        selectedItemsdata.push(data)

        this.receiptForm.controls.pSavingsMemberAccountid.setValue(this.FdDetailsToList[i].pAccountno);

      }

      let newdata1 = { maturityPaymentsList: selectedItemsdata };

      let Formdata = Object.assign(this.receiptForm.value, this.FdreceiptForm.value,newdata1);
      debugger;
      if (Formdata.ptranstype == 'Online' && Formdata.pdepositbankname == '') {
        this._commonService.showWarningMessage('Deposited Bank Name Select');
        this.isLoading = false;

        return;
      }

      let newdata = JSON.stringify(Formdata);
      console.log(newdata);
      this._FdReceiptService.SaveFdReceiptadjustment(newdata).subscribe(result => {
        this.isLoading = false;



        if (result) {
          debugger;
          this._commonService.showInfoMessage("Saved Successfully");
          // this.toastr.success("Saved Successfully");
          if (this.receiptForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
            let receipt = btoa(result['pReceiptId'] + ',' + 'Receipt Voucher');
            window.open('/#/GeneralReceiptReports?id=' + receipt);
          }
          else {
            let receipt = btoa(result[1]['pJvnumber'] + ',' + 'Journal Voucher');
            window.open('/#/JournalvoucherReport?id=' + receipt);
          }
          this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
          this.Cleardetails();
          this.router.navigateByUrl("/FdreceiptView")
          // this.LienReleaseform.reset();
        }
      },
        err => {
          this.isLoading = false;
          // this.loading = false;
          this._commonService.showErrorMessage("Error while saving");
        });
      }

      else{
        this._commonService.showWarningMessage('Please do check with Member Details')
      }
    }
    else{
      if(this.FdreceiptForm.controls.pMembername.value == this.FdDetailsToList[index].pmemberName){

      if(this.pAgentpan == '' || this.pAgentpan == null){
        this._commonService.showWarningMessage('Agent Pan is empty please enter Agent Pan No.');
        return;
      }

      if(this.pMamberpan == '' || this.pMamberpan == null){
        this._commonService.showWarningMessage('Member Pan is empty please enter Member Pan No.');
        return;
      }

      if(this.pMamberpan == '' && this.pAgentpan == ''){
        this._commonService.showWarningMessage('Member Pan and Agent Pan is empty please enter Member and Agent Pan No.');
        return;
      }

      this.receiptForm.controls['pBank'].setValue(this.receiptForm.controls['pbankname'].value);




      this.FdreceiptForm.controls.pDeposittype.setValue("FD");
      this.FdreceiptForm.controls.pBalance.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pBalance.value));
      this.FdreceiptForm.controls.pInstalmentamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pInstalmentamount.value));
      this.FdreceiptForm.controls.pReceivedamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pReceivedamount.value));



      this.isLoading = true;
      let selectedItemsdata =[];

      for(let i=0; i<this.FdDetailsToList.length; i++){
        let data ={
          "pTransTypeid":this.FdDetailsToList[i].pFdaccountid,
          "pTransType": this.FdDetailsToList[i].pFdaccountno,
          "pMaturityjvdate": this.datePipe.transform(this.FdDetailsToList[i].pTransdate,"dd-MM-yyyy"),
          "pPaidAmount": this.FdDetailsToList[i].pRenewalAmount,
          "pOutstandingAmount": this.FdDetailsToList[i].pNetPayable,
          "pLateFeeAmount": this.FdDetailsToList[i].pLateFeeAmount,
          "pMemberid": this.FdDetailsToList[i].pmemberNameId,

        }
        selectedItemsdata.push(data)

        this.receiptForm.controls.pSavingsMemberAccountid.setValue(this.FdDetailsToList[i].pAccountno);

      }

      let newdata1 = { maturityPaymentsList: selectedItemsdata };

      let Formdata = Object.assign(this.receiptForm.value, this.FdreceiptForm.value,newdata1);
      debugger;
      if (Formdata.ptranstype == 'Online' && Formdata.pdepositbankname == '') {
        this._commonService.showWarningMessage('Deposited Bank Name Select');
        this.isLoading = false;

        return;
      }

      let newdata = JSON.stringify(Formdata);
      console.log(newdata);
      this._FdReceiptService.SaveFdReceiptadjustment(newdata).subscribe(result => {
        this.isLoading = false;



        if (result) {
          debugger;
          this._commonService.showInfoMessage("Saved Successfully");
          // this.toastr.success("Saved Successfully");
          if (this.receiptForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
            let receipt = btoa(result['pReceiptId'] + ',' + 'Receipt Voucher');
            window.open('/#/GeneralReceiptReports?id=' + receipt);
          }
          else {
            let receipt = btoa(result[1]['pJvnumber'] + ',' + 'Journal Voucher');
            window.open('/#/JournalvoucherReport?id=' + receipt);
          }
          this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
          this.Cleardetails();
          this.router.navigateByUrl("/FdreceiptView")
          // this.LienReleaseform.reset();
        }
      },
        err => {
          this.isLoading = false;
          // this.loading = false;
          this._commonService.showErrorMessage("Error while saving");
        });



    }
    }
  }
}
else{
  let receiptDate = this.datePipe.transform(new Date(this.FdreceiptForm.controls.pReceiptdate.value), "dd-MMM-yyyy");
  // if (!isNullOrEmptyString(this.TransDate)) {
  //   let TransactionDate = this.datePipe.transform(new Date(this.TransDate), "dd-MMM-yyyy");
  //   if (receiptDate < TransactionDate) {
  //     this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
  //    // this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
  //    return;
  //   }
  // }
  let isvalid = true;
  let receivedamount = this.FdreceiptForm.controls.pReceivedamount.value;
  if (receivedamount == 0) {
    this.FdreceiptForm.controls.pReceivedamount.setValue('');
  }
  let chequeno = this.receiptForm.controls.pChequenumber.value;
  if (chequeno == 0) {
    this.receiptForm.controls.pChequenumber.setValue('');
  }






   if (this.checkValidations(this.receiptForm, isvalid) && this.checkValidations(this.FdreceiptForm, isvalid)) {

    if(this.pAgentpan == '' || this.pAgentpan == null){
      this._commonService.showWarningMessage('Agent Pan is empty please enter Agent Pan No.');
      return;
    }

    if(this.pMamberpan == '' || this.pMamberpan == null){
      this._commonService.showWarningMessage('Member Pan is empty please enter Member Pan No.');
      return;
    }

    if(this.pMamberpan == '' && this.pAgentpan == ''){
      this._commonService.showWarningMessage('Member Pan and Agent Pan is empty please enter Member and Agent Pan No.');
      return;
    }

    this.receiptForm.controls['pBank'].setValue(this.receiptForm.controls['pbankname'].value);




    this.FdreceiptForm.controls.pDeposittype.setValue("FD");
    this.FdreceiptForm.controls.pBalance.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pBalance.value));
    this.FdreceiptForm.controls.pInstalmentamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pInstalmentamount.value));
    this.FdreceiptForm.controls.pReceivedamount.setValue(this._commonService.removeCommasForEntredNumber(this.FdreceiptForm.controls.pReceivedamount.value));


    // if (this.receiptForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
    //   if (this.SavingsMemberBalance < parseFloat(this.FdreceiptForm.controls.pReceivedamount.value.toString().replace(/,/g, ""))) {
    //     this._commonService.showWarningMessage('Amount Received should be Less Than or Equal to Saving Account Balance');
    //     return;
    //   }
    // }
    this.isLoading = true;

    let Formdata = Object.assign(this.receiptForm.value, this.FdreceiptForm.value);
    debugger;
    if (Formdata.ptranstype == 'Online' && Formdata.pdepositbankname == '') {
      this._commonService.showWarningMessage('Deposited Bank Name Select');
      this.isLoading = false;

      return;
    }
    let newdata = JSON.stringify(Formdata);
    console.log(newdata);


    this._FdReceiptService.SaveFdReceiptForm(newdata).subscribe(result => {
      this.isLoading = false;



      if (result) {
        debugger;
        this._commonService.showInfoMessage("Saved Successfully");
        // this.toastr.success("Saved Successfully");
        if (this.receiptForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
          let receipt = btoa(result['pReceiptId'] + ',' + 'Receipt Voucher');
          window.open('/#/GeneralReceiptReports?id=' + receipt);
        }
        else {
          let receipt = btoa(result[1]['pJvnumber'] + ',' + 'Journal Voucher');
          window.open('/#/JournalvoucherReport?id=' + receipt);
        }
        this.FdreceiptForm.controls.pReceiptdate.setValue(new Date);
        this.Cleardetails();
        this.router.navigateByUrl("/FdreceiptView")
        // this.LienReleaseform.reset();
      }
    },
      err => {
        this.isLoading = false;
        // this.loading = false;
        this._commonService.showErrorMessage("Error while saving");
      });


    }
    else {
      this.isLoading = false;
      this.buttonName = "Save";
    }
  }
  }
  Cleardetails() {
    debugger;
    this.ngOnInit();
    this.MemberDetails = [];
    var multicolumncombobox: any;
    multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
    if (multicolumncombobox)
      multicolumncombobox.value("");
    this.disabledforButtons = true;
    this.TotalAmount = 0;
    this.DueAmount = 0;
    this.BalanceAmount = 0;
    this.BalanceDue = 0;
    this.PendingChequeAmount = 0;
    this.ReceivedAmount = 0;
    this.TransDate = "";
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.paidAmount = 0;
    this.remainingAmountBind = 0;

    this.FdDetailsToList = [];

  }


  //#endregion
  customSearchFn(term: string, item: any) {
    debugger;
    //console.log(item)
    //term = term.toLowerCase();
    //return item.pName.toLowerCase().indexOf(term) > -1 || item.pMembercode.toLowerCase().indexOf(term) > -1 || item.pBusinessentitycontactno.toString().toLowerCase().indexOf(term) > -1;
    console.log(item)
    term = term.toLowerCase();
    if (isNullOrEmptyString(item.pBusinessentitycontactno)) {
      return item.pName.toLowerCase().indexOf(term) > -1 || item.pMembercode.toLowerCase().indexOf(term) > -1 || item.pBusinessentitycontactno.toString().toLowerCase().indexOf(term) > -1;
    }
    else {
      return item.pName.toLowerCase().indexOf(term) > -1 || item.pMembercode.toLowerCase().indexOf(term) > -1 || item.pBusinessentitycontactno.toString().toLowerCase().indexOf(term) > -1;
    }

  }
  back() {
    debugger;
    this.router.navigate(['/FdreceiptView']);
  }

  GetFDAndTransactionDetails(Type) {
    debugger;
    if (Type == "AccountDetails") {
      this.ShowFixeddepositdetails = true;
      this.ShowRecenttransaction = false;
    }
    else {
      this.ShowFixeddepositdetails = false;
      this.ShowRecenttransaction = true;
    }
  }
  //#region Validation Controlls
  ValidateDuesList(DuesList: any): boolean {
    debugger;
    let Isvalid: boolean = true;

    for (let i = 0; i < this.DuesList.length; i++) {
      this.formValidationMessages.PDueAmount = isNullOrEmptyString(this.DuesList[i].PDueAmount) ? "Due Amount Required" : "";
      this.formValidationMessages.Pdeduction = isNullOrEmptyString(this.DuesList[i].Pdeduction) ? "Waiver/Deduction Required" : "";
      this.formValidationMessages.pReceivedamount = isNullOrEmptyString(this.DuesList[i].pReceivedamount) ? "Received Amount Required" : "";
      Isvalid = (isNullOrEmptyString(this.DuesList[i].PDueAmount) && isNullOrEmptyString(this.DuesList[i].Pdeduction) && isNullOrEmptyString(this.DuesList[i].pReceivedamount)) ? false : true;
    }


    return Isvalid;
  }

  memberSearchFn(term: string, item: any) {
    debugger
    term = term.toLowerCase();

    const memberName = item.pMembername ? item.pMembername.toLowerCase() : '';
    const memberCode = item.pMembercode ? item.pMembercode.toLowerCase() : '';

    return memberName.indexOf(term) > -1 || memberCode.indexOf(term) > -1;
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
    debugger;
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
    debugger
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
  //#endregion
}
