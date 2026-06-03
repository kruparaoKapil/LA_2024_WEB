import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';

declare let $: any
@Component({
  selector: 'app-rdreceipt-new',
  templateUrl: './rdreceipt-new.component.html',
  styles: []
})
export class RdreceiptNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  formValidationMessages: any;
  RdreceiptForm: FormGroup;
  receiptForm: FormGroup;
  public today: Date = new Date();
  buttonName = "Save";
  public isLoading: boolean = false;
  public banklist: any;
  public modeoftransactionslist: any;
  public typeofpaymentlist: any;
  public ledgeraccountslist: any;
  public partylist: any;
  public gstlist: any;
  public debitcardlist: any;
  public cashBalance: number = 0;
  public bankBalance: number = 0;
  public bankbookBalance: any = '0' + 'Dr';
  public bankpassbookBalance: any = '0' + 'Dr';
  public ledgerBalance: any;
  public subledgerBalance: any;
  public partyBalance: any;

  public bankshowhide: boolean = false;
  public walletshowhide: boolean = false;
  public chequeshowhide: boolean = false;
  public onlineshowhide: boolean = false;
  public DebitShowhide: boolean = false;
  public creditShowhide: boolean = false;
  public DepositBankDisable: boolean = false;
  public MemberchangeFlag: boolean = false;
  public SavingAccountShowhide: boolean = false;
  public Modeofpayment: any;
  public Transtype: any;
  public membertypedetails: any = [];
  public memberdetails: any = [];
  public selectmemberdetails: any = [];
  public AccountDetails: any = [];
  public SavingsAccounts: any = [];
  public SelectAccountdata: any = [];
  public Duesdata: any = [];
  ShowAccountDetails = true;
  public SavingsMemberBalance: any;
  public totalInstalmentamount:any;
  public totalPenalty:any;
  public Transdate:any;
  ShowDuesDetails = false;
  disabletransactiondate = false;
  constructor(private formbuilder: FormBuilder, private _Accountservice: AccountingTransactionsService, private _commonService: CommonService, private _RdReceiptService: RdReceiptService, private router: Router) {
    // window['CallingFunctionOutsideMemberData'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.MemberChange(value),
    //   component: this,
    // };
    // window['CallingFunctionToMemberHideCard'] = {
    //   zone: this.zone,
    //   componentFn: () => this.HideCard(),
    //   component: this,
    // };
    this.dpConfig2.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig2.maxDate = new Date();
    this.dpConfig2.showWeekNumbers = false;

    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    //this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    if (this._commonService.comapnydetails != null)
    this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.buttonName = "Save";
    this.isLoading = false;
    this.banklist = '';
    this.modeoftransactionslist = '';
    this.typeofpaymentlist = '';
    this.ledgeraccountslist = '';
    this.partylist = '';
    this.gstlist = ''
    this.debitcardlist = '';
    this.cashBalance = 0;
    this.bankBalance = 0;
    this.bankbookBalance = '0' + 'Dr';
    this.bankpassbookBalance = '0' + 'Dr';
    this.ledgerBalance = '';
    this.subledgerBalance = '';
    this.partyBalance = '';
    this.Transdate='';
    this.bankshowhide = false;
    this.walletshowhide = false;
    this.chequeshowhide = false;
    this.onlineshowhide = false;
    this.DebitShowhide = false;
    this.creditShowhide = false;
    this.DepositBankDisable = false;
    this.MemberchangeFlag = false;
    this.SavingAccountShowhide = false;
    this.Modeofpayment = '';
    this.Transtype = '';
    this.membertypedetails = [];
    this.memberdetails = [];
    this.selectmemberdetails = [];
    this.AccountDetails = [];

    this.SavingsAccounts = [];
    this.SelectAccountdata = [];
    this.Duesdata = [];
    this.ShowAccountDetails = true;
    this.ShowDuesDetails = false;
    this.formValidationMessages = {};
    this.ReceiptFormGroup();
    this.RdreceiptFormGroup();
    this.getLoadData();
    this.Paymenttype("Cash");
    this.GetMemberTypeDetails();
    this.GetSAandTransDetails('')
    this.BlurEventAllControll(this.receiptForm)
    this.BlurEventAllControll(this.RdreceiptForm)
this.totalInstalmentamount=0;
this.totalPenalty=0;
  }

  ReceiptFormGroup() {
    this.receiptForm = this.formbuilder.group({
      pReceiptdate: [this.today, Validators.required],
      pModeofreceipt: ['CASH'],
      pbankname: [''],
      pBranch: [''],
      pbranchname: [''],
      ptranstype: [''],
      ptypeofpayment: [''],
      pChequenumber: [''],
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
      pCreatedby: [this._commonService.pCreatedby],
      pSavingsMemberAccountid: ['0'],
      pSavingsMemberBalance: ['']
    });
  }
  RdreceiptFormGroup() {
    this.RdreceiptForm = this.formbuilder.group({
      pRecordid: 0,
      pReceiptdate: [this.today, Validators.required],
      pMembertypeid: [''],
      pMembertype: ['', Validators.required],
      pMemberid: ['', Validators.required],
      pMembername: ['', Validators.required],
      pMembercode: [''],
      pAccountid: [''],
      pAccountno: ['', Validators.required],
      pDeposittype: ['RD'],
      pInstalmentamount: ['', Validators.required],
      pPenaltyamount: [0],
      pReceivedamount: 0, pContactid: [0],
      pSubledgerid: [0],
      pNarration: ['', Validators.required]

    });
  }
  public GetMemberTypeDetails() {
    this._commonService.Getmemberdetails('RECURRING DEPOSIT').subscribe(json => {
      this.membertypedetails = json;
    });
  }
  MemberTypeChange(event) {
    debugger;
    if (event != undefined && event != "" && event != null) {
      this.memberdetails = [];
      this.selectmemberdetails = [];
      this.Transdate='';
      this.RdreceiptForm.controls.pMemberid.setValue('');
      this.RdreceiptForm.controls.pMembername.setValue('');
      this.RdreceiptForm.controls.pAccountid.setValue('');
      this.RdreceiptForm.controls.pAccountno.setValue('');
      this.formValidationMessages.pMembername = '';
      this.formValidationMessages.pAccountno = '';
      this.RdreceiptForm.controls.pMembercode.setValue('');
      this.AccountDetails = [];
      this.SavingsAccounts = [];
      this.SelectAccountdata = [];
      this.Duesdata = [];
      let membertype = event.pmembertype;
      this.RdreceiptForm.controls.pMembertype.setValue(event.pmembertype);
      this.RdreceiptForm.controls.pMembertypeid.setValue(event.Membertypeid);
      this.Paymenttype('Cash');
      this.GetMemberDetails(membertype)

    }

  }
  back() {
    debugger;
    this.router.navigate(['/RdreceiptView']);
  }
typeofDepositBank(args) {
        
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
  GetMemberDetails(MemberType) {
    debugger
    this._RdReceiptService.GetMemberDetails(MemberType).subscribe(json => {
      this.memberdetails = json
    })
  }
  MemberChanges(event) {
    debugger
    if (event) {
      this.totalInstalmentamount = 0;
      this.totalPenalty =0;
      this.Transdate='';
      this.RdreceiptForm.controls.pInstalmentamount.setValue(0);
      this.RdreceiptForm.controls.pPenaltyamount.setValue(0);
      this.RdreceiptForm.controls.pReceivedamount.setValue(0);
      this.Paymenttype('Cash')
      this.GetSAandTransDetails('');
      let Membercode = event.pMembercode;
      this.selectmemberdetails = event;
      this.RdreceiptForm.controls.pMemberid.setValue(event.pMemberid);
      this.RdreceiptForm.controls.pMembername.setValue(event.pName);
      this.RdreceiptForm.controls.pMembercode.setValue(event.pMembercode);
      this.RdreceiptForm.controls.pContactid.setValue(event.pConid);
      this.AccountDetails = [];
      this.SavingsAccounts = [];
      this.SelectAccountdata = [];
      this.Duesdata = [];
      this.RdreceiptForm.controls.pAccountid.setValue('');
      this.RdreceiptForm.controls.pAccountno.setValue('');
      this.formValidationMessages.pAccountno = '';
      this.GetAccountDetails(Membercode);
    }
  }
  GetAccountDetails(Membercode) {
    debugger
    this._RdReceiptService.GetAccountDetails(Membercode).subscribe(json => {
      this.AccountDetails = json["rdAccountDetailsDTOList"];
      this.SavingsAccounts = json["rdSavingsAccountDetailsDTOList"];
    });
  }
  AccountChanges(event) {
    debugger;
    this.GetSAandTransDetails('AccountDetails');
    this.RdreceiptForm.controls.pAccountid.setValue(event.paccountid);
    this.RdreceiptForm.controls.pAccountno.setValue(event.paccountno);
    this.RdreceiptForm.controls.pSubledgerid.setValue(event.pSubledgerid);
    this.Transdate='';
    this.SelectAccountDetails(event.paccountno);
    let transdate = this.RdreceiptForm.controls['pReceiptdate'].value;
    this.GetViewDues(event.paccountno, transdate);
  }
  SavingsAccountsChanges(event) {
    debugger
    this.receiptForm.controls.pSavingsMemberAccountid.setValue(event.pSavingsMemberAccountid);
    this.SavingsMemberBalance = event.pSavingsMemberBalance;
    this.formValidationMessages['pSavingsMemberAccountid'] = '';
  }
  SelectAccountDetails(accountno) {
    debugger
    this._RdReceiptService.GetselectAccountDetails(accountno).subscribe(json => {
      this.SelectAccountdata = json;
      this.Transdate=new Date(json[0]['pTransdate']);
      this.ReceiptDateChange();
    });
  }
  ReceiptDateChange(){
    let Receiptdate = this.RdreceiptForm.controls['pReceiptdate'].value;
    this.receiptForm.controls.pReceiptdate.setValue(Receiptdate);
    if(Receiptdate<this.Transdate){
      this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
       this.RdreceiptForm.controls.pReceiptdate.setValue(new Date());
       this.receiptForm.controls.pReceiptdate.setValue(new Date());
    }
  }
  GetViewDues(accountno, transdate) {
    this._RdReceiptService.GetViewDues(accountno, transdate).subscribe(json => {
      this.Duesdata = json
      this.totalInstalmentamount = this.Duesdata.reduce((sum, c) => sum + c.pinstalmentamount, 0);
      this.totalPenalty = this.Duesdata.reduce((sum, c) => sum + c.pPenalty, 0);

      this.RdreceiptForm.controls.pInstalmentamount.setValue(this._commonService.currencyformat(this.totalInstalmentamount));
      this.TotalAmount();
    });
  }
  GetSAandTransDetails(type) {
    debugger;
    if (type == 'AccountDetails') {
      this.ShowAccountDetails = true;
      this.ShowDuesDetails = false;
    }
    else if(type=='DuesDetails'){
      this.ShowAccountDetails = false;
      this.ShowDuesDetails = true;
    }
    else{
       this.ShowAccountDetails = false;
      this.ShowDuesDetails = false;
    }
  }
  TotalAmount() {
    let Receivedamount = this.RdreceiptForm.controls['pInstalmentamount'].value;
    let penaltyAmount = this.RdreceiptForm.controls['pPenaltyamount'].value;
    if (penaltyAmount == '') {
      penaltyAmount = 0;
    }
    if (Receivedamount == '') {
      Receivedamount = 0;
    }
    let total = 0;
    total = parseInt(Receivedamount.toString().replace(/,/g, "")) + parseInt(penaltyAmount.toString().replace(/,/g, ""));
    this.RdreceiptForm.controls.pReceivedamount.setValue(this._commonService.currencyformat(total));
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
  public Paymentbuttondata: any = [{ id: 1, type: "Cash", bankshowhide: false, walletshowhide: false, SavingAccountShowhide: false }, { id: 2, type: "Bank", bankshowhide: true, walletshowhide: false, SavingAccountShowhide: false }, { id: 3, type: "Wallet", bankshowhide: false, walletshowhide: true, SavingAccountShowhide: false }, { id: 4, type: "ADJUSTMENT", bankshowhide: false, walletshowhide: false, SavingAccountShowhide: true }];
  public Paymenttype(type) {
    debugger;

    for (var n = 0; n < this.Paymentbuttondata.length; n++) {
      if (this.Paymentbuttondata[n].type === type) {
        this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
        this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
        this.SavingAccountShowhide = this.Paymentbuttondata[n].SavingAccountShowhide;
      }
    }
    this.receiptForm.controls.pModeofreceipt.setValue(type);
    this.receiptForm.controls['pbankname'].setValue('');
    this.receiptForm.controls['pChequenumber'].setValue('');
    this.receiptForm.controls['pchequedate'].setValue(this.today);
    this.receiptForm.controls['pdepositbankname'].setValue('');
    this.receiptForm.controls['ptypeofpayment'].setValue('');
    this.receiptForm.controls['pbranchname'].setValue('');
    this.receiptForm.controls['pCardNumber'].setValue('');
    this.receiptForm['controls']['pSavingsMemberAccountid'].setValue(0);
    if (type == 'Bank') {
      this.receiptForm.controls.ptranstype.setValue('Cheque');
      this.Banktype('Cheque')
      this.Modeofpayment = type;
    }
     else if (type == 'ADJUSTMENT') {
      this.SavingAccountShowhide = true;
      this.receiptForm['controls']['pSavingsMemberAccountid'].setValue('');
      this.receiptForm['controls']['pSavingsMemberAccountid'].setValidators([Validators.required]);
      this.receiptForm['controls']['pSavingsMemberAccountid'].updateValueAndValidity();
      // this.RdreceiptForm.controls['pSavingsMemberBalance'].setValue(0);
      this.SavingsMemberBalance = 0;
    }
    else {
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
    if(type=='Cheque'){
     let formname='CHEQUE';
     let ProjectLaunchDate=new Date().toISOString();
     this._commonService.GetChequeMinDate(formname,ProjectLaunchDate).subscribe(res=>{
       debugger;
       if(res){
         let minmonthsordays= res[0].pTenure;
         let tenuretype= (res[0].pTenurMode).toUpperCase();
         let mindate=new Date();
         let maxdate=new Date();
         if(tenuretype=='MONTHS'){
              mindate.setMonth(mindate.getMonth() - minmonthsordays);
         }
         else{
             mindate.setDate(mindate.getDate() - minmonthsordays);
         }
          this.dpConfig.minDate =mindate;
       }
     },error=>{

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
        
        this.GetValidationByControl(this.receiptForm, 'ptypeofpayment', true);
        let type = args.target.options[args.target.selectedIndex].text;
        // if(type != 'Select'){
        if (this.Transtype != '') {
            //console.log(this.modeoftransactionslist);
            //console.log(JSON.stringify(this.modeoftransactionslist))
            this.receiptForm.controls.pdepositbankid.setValue('');
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

            // "BANK"
            // ptranstype: "Online"
            // ptypeofoperation: null
            // ptypeofpayment: "Cheque"
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



  saveReceipt() {
    debugger;
    let isvalid = true;
    //&& this.checkValidations(this.receiptForm, isvalid)
    if (this.checkValidations(this.RdreceiptForm, isvalid) && this.checkValidations(this.receiptForm, isvalid)) {
       let instalmentamount= parseFloat(this.RdreceiptForm.controls.pInstalmentamount.value.toString().replace(/,/g, ""));
       if(instalmentamount<=0){
         this.RdreceiptForm.controls.pInstalmentamount.setValue('');
          this._commonService.showWarningMessage('Instalment Amount should be greater Than Zero.');
          return;
       }
      if (this.receiptForm.controls.pModeofreceipt.value == 'ADJUSTMENT') {
        if (this.SavingsMemberBalance < parseFloat(this.RdreceiptForm.controls.pInstalmentamount.value.toString().replace(/,/g, ""))) {
          this._commonService.showWarningMessage('Instalment Amount should be Less Than or Equal to Saving Account Balance');
          return;
        }
      }
      this.RdreceiptForm.controls.pInstalmentamount.setValue(this._commonService.removeCommasForEntredNumber(this.RdreceiptForm.controls.pInstalmentamount.value));
      this.RdreceiptForm.controls.pPenaltyamount.setValue(this._commonService.removeCommasForEntredNumber(this.RdreceiptForm.controls.pPenaltyamount.value));
      this.RdreceiptForm.controls.pReceivedamount.setValue(this._commonService.removeCommasForEntredNumber(this.RdreceiptForm.controls.pReceivedamount.value));

      let Formdata = Object.assign(this.RdreceiptForm.value, this.receiptForm.value);
      let saveReceiptdata = JSON.stringify(Formdata);
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._RdReceiptService.SaveReceipt(saveReceiptdata).subscribe(result => {
        debugger;
        if (result) {
            if (this.receiptForm.controls.pModeofreceipt.value != 'ADJUSTMENT') {
            let receipt = btoa(result['pReceiptId'] + ',' + 'Receipt Voucher');
            window.open('/#/GeneralReceiptReports?id=' + receipt);
          }
          else {
            let receipt = btoa(result[1]['pJvnumber'] + ',' + 'Journal Voucher');
            window.open('/#/JournalvoucherReport?id=' + receipt);
          }
        }
          this.buttonName = 'Save';
          this.isLoading = false;
          this._commonService.showInfoMessage("Saved Successfully");
          this.SelectAccountdata=[];
         // this.SelectAccountdata[0].pInstalmentamount='';
          this.RdreceiptForm.controls.pReceiptdate.setValue(new Date);
          this.Cleardetails();
        //}
      },
        error => {
          this._commonService.showErrorMessage(error);
          this.buttonName = 'Save';
          this.isLoading = false;
          // this.disablesavebutton=false;
        })
    }
  }

  Cleardetails() {
    debugger;
    this.ngOnInit();
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
