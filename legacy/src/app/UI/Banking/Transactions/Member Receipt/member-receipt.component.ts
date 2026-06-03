import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { MemberReceiptService } from 'src/app/Services/Banking/Transactions/member-receipt.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined, debug } from 'util';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-member-receipt',
  templateUrl: './member-receipt.component.html',
  styles: []
})
export class MemberReceiptComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  receiptform: FormGroup;
  memberreceiptdetailsform: FormGroup;
  memberdetailform: FormGroup;
  buttonName = 'Save';
  memberdetailDTO: any = [];
  memberDocumentsDetailsDTO: any = [];
  public bankshowhide: boolean = false;
  public walletshowhide: boolean = false;
  public chequeshowhide: boolean = false;
  public onlineshowhide: boolean = false;
  public DebitShowhide: boolean = false;
  public creditShowhide: boolean = false;
  public DepositBankDisable: boolean = false;
  public MemberchangeFlag: boolean = false;
  public notEditable: boolean = true;
  public isLoading: boolean = false;
  public pReceivedamountDisable: boolean = false;
  Modeofpayment: any;
  formValidationMessages: any;
  membertypedetails: any = [];
  MemberDetails: any = [];
  partyBalance: any;
  subledgerBalance: any;
  ledgerBalance: any;
  bankBalance: any;
  gstlist: any;
  banklist: any;
  modeoftransactionslist: any;
  typeofpaymentlist: any;
  ledgeraccountslist: any;
  Transtype: any;
  partylist: any;
  cashBalance: any;
  debitcardlist: any;
  bankbookBalance: any;
  bankpassbookBalance: any;
  disabletransactiondate = false;
  public today: Date = new Date();

  constructor(private formbuilder: FormBuilder, private zone: NgZone, private toastr: ToastrService, private _commonService: CommonService, private datePipe: DatePipe, private router: Router, private _memberreceiptservice: MemberReceiptService) {

    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    //this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

  }

  ngOnInit() {
    debugger;
    if (this._commonService.comapnydetails != null)
    this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.buttonName = 'Save';
    this.partyBalance = '';
    this.subledgerBalance = '';
    this.ledgerBalance = '';
    this.bankBalance = '';
    this.gstlist = '';
    this.banklist = '';
    this.modeoftransactionslist = '';
    this.typeofpaymentlist = '';
    this.ledgeraccountslist = '';
    this.partylist = '';
    this.cashBalance = '';
    this.debitcardlist = '';
    this.bankbookBalance = '';
    this.bankpassbookBalance = '';
    this.Transtype = '';
    this.bankshowhide = false;
    this.walletshowhide = false;
    this.chequeshowhide = false;
    this.onlineshowhide = false;
    this.DebitShowhide = false;
    this.creditShowhide = false;
    this.DepositBankDisable = false;
    this.MemberchangeFlag = false;
    this.notEditable = true;
    this.isLoading = false;
    this.Modeofpayment = '';
    this.memberDocumentsDetailsDTO = [];
    this.membertypedetails = [];
    this.MemberDetails = [];
    this.memberdetailDTO = [];
    this.formValidationMessages = {};
    this.receiptform = this.formbuilder.group({
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

    });
    this.memberdetailform = this.formbuilder.group({
      pRecordid: [0],
      pConid: [0],
      pContactid: [0],
      pMemberid: [0],
      pReceiptno: [0],
      pStatus: [true],
      pCreatedby: [this._commonService.pCreatedby],
      pModifiedby: [0],
      pStatusid: [''],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pReceiptdate: [this.today, Validators.required],
      pMembertypeid: ['', Validators.required],
      pMemberName: ['', Validators.required],
      pMembercode: [''],
    });
    this.memberreceiptdetailsform = this.formbuilder.group({
      pReceivedamount: ['', Validators.required],
      pNarration: ['', Validators.required],
    });
    this.Paymenttype("Cash");
    this.GetMemberTypeDetails();
    this.getLoadData();
    this.clearMemberDetailsTab();
    this.BlurEventAllControll(this.receiptform);
    this.BlurEventAllControll(this.memberreceiptdetailsform);
    this.BlurEventAllControll(this.memberdetailform);
  }
  typeofPaymentChange(args) {

    this.GetValidationByControl(this.receiptform, 'ptypeofpayment', true);
    let type = args.target.options[args.target.selectedIndex].text;
    // if(type != 'Select'){
    if (this.Transtype != '') {
      //console.log(this.modeoftransactionslist);
      //console.log(JSON.stringify(this.modeoftransactionslist))
      this.receiptform.controls.pdepositbankid.setValue('');
      this.receiptform.controls.pdepositbankname.setValue('');
      let DepositBankDisable
      let Modeofpayment = this.receiptform.controls.pModeofreceipt.value.toUpperCase();
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
      const DepositBankIDControl = <FormGroup>this.receiptform['controls']['pdepositbankid'];
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
  public getLoadData() {
    this._memberreceiptservice.GetReceiptsandPaymentsLoadingData('GENERAL RECEIPT').subscribe(json => {
      debugger;
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
  typeofDepositBank(args) {

    this.GetValidationByControl(this.receiptform, 'pdepositbankid', true);
    let type = args.target.options[args.target.selectedIndex].text;

    this.receiptform.controls.pdepositbankname.setValue(type)

    this.getBankBranchName(this.receiptform.controls.pdepositbankid.value);
  }
  getBankBranchName(pbankid) {
    let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
    });
    this.receiptform['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
  }
  public GetMemberTypeDetails() {
    this.membertypedetails = [];
    this.MemberDetails = [];
    this._commonService.Getmemberdetails('MEMBER RECEIPT').subscribe(json => {
      debugger;
      if (json) {
        this.membertypedetails = json;
      }
    });
  }
  public Paymentbuttondata: any = [{ id: 1, type: "Cash", bankshowhide: false, walletshowhide: false }, { id: 2, type: "Bank", bankshowhide: true, walletshowhide: false }, { id: 3, type: "Wallet", bankshowhide: false, walletshowhide: true }];

  public Bankbuttondata: any = [{ id: 1, type: "Cheque", chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false }, { id: 2, type: "Online", chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false }, { id: 3, type: "Debit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false }, { id: 4, type: "Credit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }];

  public Paymenttype(type) {
    debugger;
    for (var n = 0; n < this.Paymentbuttondata.length; n++) {
      if (this.Paymentbuttondata[n].type === type) {
        this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
        this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
      }
    }
    this.receiptform.controls['pbankname'].setValue('');
    this.receiptform.controls['pChequenumber'].setValue('');
    this.receiptform.controls['pchequedate'].setValue(this.today);
    this.receiptform.controls['pdepositbankname'].setValue('');
    this.receiptform.controls['ptypeofpayment'].setValue('');
    this.receiptform.controls['pbranchname'].setValue('');
    this.receiptform.controls['pCardNumber'].setValue('');
    if (type == 'Bank') {
      this.receiptform.controls.ptranstype.setValue('Cheque');
      this.Banktype('Cheque')
      this.Modeofpayment = type;
    }
    else {
      this.receiptform.controls.ptranstype.setValue('');
      let DepositBankNameControl = this.receiptform.controls['pdepositbankname']
      let BankControl = this.receiptform.controls['pbankname'];
      let ChequeControl = this.receiptform.controls['pChequenumber']
      let TypeofPAymentControl = this.receiptform.controls['ptypeofpayment'];
      let BranchControl = this.receiptform.controls['pbranchname'];
      let CardNumberControl = this.receiptform.controls['pCardNumber'];
      let ChequeDateControl = this.receiptform.controls['pchequedate']
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
      this.receiptform.controls.ptranstype.setValue('');
    }
  }
  public Banktype(type) {
    debugger;
    this.validation(type);
    this.receiptform.controls['pbankname'].setValue('');
    this.receiptform.controls['pChequenumber'].setValue('');
    this.receiptform.controls['pchequedate'].setValue(this.today);
    this.receiptform.controls['pdepositbankname'].setValue('');
    this.receiptform.controls['ptypeofpayment'].setValue('');
    this.receiptform.controls['pbranchname'].setValue('');
    this.receiptform.controls['pCardNumber'].setValue('');
    this.receiptform.controls['pdepositbankid'].setValue('');

    this.Transtype = type;
    for (var n = 0; n < this.Bankbuttondata.length; n++) {
      if (this.Bankbuttondata[n].type === type) {

        this.chequeshowhide = this.Bankbuttondata[n].chequeshowhide;
        this.onlineshowhide = this.Bankbuttondata[n].onlineshowhide;
        this.creditShowhide = this.Bankbuttondata[n].creditShowhide;
        this.DebitShowhide = this.Bankbuttondata[n].DebitShowhide;
      }
    }
    // this.receiptform.controls.pdepositbankid.setValue(0);
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
    this.receiptform.controls.pdepositbankname.setValue('');
    if (type == 'Online' || type == 'Cheque') {
      this.receiptform.controls.ptypeofpayment.setValue('');
      this.DepositBankDisable = true;
      this.receiptform.controls.pdepositbankid.setValue(0);
    }
    else {
      this.receiptform.controls.ptypeofpayment.setValue(type);
      if (type == 'Debit Card' || type == 'Credit Card') {

        let DepositBankDisable
        let Modeofpayment = this.receiptform.controls.pModeofreceipt.value.toUpperCase();
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
        const DepositBankIDControl = <FormGroup>this.receiptform['controls']['pdepositbankid'];
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
    this.BlurEventAllControll(this.receiptform);
    this.formValidationMessages = {};

  }
  validation(type) {
    this.formValidationMessages = {};
    let ChequeControl = this.receiptform.controls['pChequenumber']
    let ChequeDateControl = this.receiptform.controls['pchequedate'];
    let TypeofPaymentControl = this.receiptform.controls['ptypeofpayment']
    let BankControl = this.receiptform.controls['pbankname']
    let CardNumberControl = this.receiptform.controls['pCardNumber']
    let DepositBankNameControl = this.receiptform.controls['pdepositbankid'];
    DepositBankNameControl.clearValidators();
    ChequeControl.setValidators([Validators.required]);

    if (type == 'Online' || type == 'Cheque') {
      ChequeDateControl.setValidators([Validators.required]);
      if (type = 'Online') {
        BankControl.setValidators([Validators.required]);
        TypeofPaymentControl.clearValidators();
      }
      else {
        TypeofPaymentControl.setValidators([Validators.required]);
        BankControl.clearValidators();
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
    this.BlurEventAllControll(this.receiptform)
  }
  MemberChange(event) {
    debugger;
    this.cleartransDetails();
    this.memberdetailform.controls.pMemberName.setValue(event.pMemberName);
    this.memberdetailform.controls.pMembercode.setValue(event.pMemberCode);
    this.memberdetailform.controls.pMemberid.setValue(event.pMemberId);
    this.memberdetailform.controls.pContactid.setValue(event.pContactid);
    this.memberdetailDTO = event;
    if (event.memberDocumentsDetailsDTO.length > 0) {
      this.memberDocumentsDetailsDTO = event.memberDocumentsDetailsDTO[0];
    }

  }
  cleartransDetails() {
    this.partyBalance = '';
    this.subledgerBalance = '';
    this.ledgerBalance = '';
    this.bankBalance = '';
    this.gstlist = '';
    this.banklist = '';
    this.modeoftransactionslist = '';
    this.typeofpaymentlist = '';
    this.ledgeraccountslist = '';
    this.partylist = '';
    this.cashBalance = '';
    this.debitcardlist = '';
    this.bankbookBalance = '';
    this.bankpassbookBalance = '';
    this.Transtype = '';
    this.bankshowhide = false;
    this.walletshowhide = false;
    this.chequeshowhide = false;
    this.onlineshowhide = false;
    this.DebitShowhide = false;
    this.creditShowhide = false;
    this.DepositBankDisable = false;
    this.MemberchangeFlag = false;
    this.notEditable = true;
    this.Modeofpayment = '';
    this.Paymenttype("Cash");
    this.getLoadData();
    this.clearMemberDetailsTab();
    this.memberDocumentsDetailsDTO = [];
    if (this.pReceivedamountDisable == false) {
      this.memberreceiptdetailsform.controls.pReceivedamount.setValue('');
    }
    this.memberreceiptdetailsform.controls.pNarration.setValue('');
    this.formValidationMessages.pReceivedamount = null;
    this.formValidationMessages.pNarration = null;
  }
  MemberTypeChange(event) {
    debugger;
    this.cleartransDetails();
    this.MemberDetails = [];
    this.memberdetailform.controls.pMemberName.setValue('');
    this.memberdetailform.controls.pMemberid.setValue('');
    this.memberdetailform.controls.pMembercode.setValue('');
    this.formValidationMessages.pMemberName = null;
    let memberType = event.pmembertype;
    this.memberdetailform.controls.pMembertypeid.setValue(event.pmembertypeid);
    if (event.pmemberfee > 0) {
      let pmemberfee = this._commonService.currencyformat(event.pmemberfee);
      this.memberreceiptdetailsform.controls.pReceivedamount.setValue(pmemberfee);
      this.pReceivedamountDisable = true;
    } else {
      this.memberreceiptdetailsform.controls.pReceivedamount.setValue('');
      this.formValidationMessages.pReceivedamount = null;
      this.pReceivedamountDisable = false;
    }

    this._memberreceiptservice.GetMembersForFd('both', memberType).subscribe(json => {
      debugger;
      if (json) {
        this.MemberDetails = json;

      }
    });
  }
  clearMemberDetailsTab() {
    debugger;
    this.memberdetailDTO = [];
  }
  BankNameChange() {
    this.GetValidationByControl(this.receiptform, 'pbankname', true);
  }
  ChequeNoChange() {
    this.GetValidationByControl(this.receiptform, 'pChequeisNullOrUndefinednumber', true);
  }
  ChequeDateChange() {
    this.GetValidationByControl(this.receiptform, 'pchequedate', true);
  }
  CardNoChange() {
    this.GetValidationByControl(this.receiptform, 'pCardNumber', true);
  }
  // ReceiptDateChange() {
  //   debugger;
  //   let receiptDate = this.datePipe.transform(new Date(this.receiptForm.controls.pReceiptdate.value), "dd-MMM-yyyy");
  //   if (!isNullOrEmptyString(this.TransDate)) {
  //     let TransactionDate = this.datePipe.transform(new Date(this.TransDate), "dd-MMM-yyyy");
  //     if (receiptDate < TransactionDate) {
  //       this._commonService.showWarningMessage("Receipt Date should not be less than Transaction Date.");
  //       this.receiptForm.controls.pReceiptdate.setValue(new Date);
  //     }
  //   }
  // }
  Cleardetails() {
    debugger;
    this.clearMemberDetailsTab();
    this.ngOnInit();

  }
  checkValidationAll(): boolean {
    let isvalid1 = true;
    let isvalid2 = true;
    let isvalid3 = true;
    isvalid1 = this.checkValidations(this.memberdetailform, isvalid1);
    isvalid2 = this.checkValidations(this.receiptform, isvalid2);
    isvalid3 = this.checkValidations(this.memberreceiptdetailsform, isvalid3);
    if (isvalid1 && isvalid2 && isvalid3) {
      return true;
    }
    else {
      return false;
    }
  }
  SaveMemberReceipt() {
    debugger;
    let isvalid: boolean = true;
    isvalid = this.checkValidationAll();
    if (isvalid) {
      this.memberreceiptdetailsform.controls.pReceivedamount.setValue(this._commonService.removeCommasForEntredNumber(this.memberreceiptdetailsform.controls.pReceivedamount.value));
      this.isLoading = true;
      this.buttonName = "Processing";
      let Formdata = Object.assign(this.receiptform.value, this.memberdetailform.value, this.memberreceiptdetailsform.value);
      debugger;
      let newdata = JSON.stringify(Formdata);
      this._memberreceiptservice.SaveMemberReceipt(newdata).subscribe(result => {
        this.isLoading = false;
        this.buttonName = "Save";
        if (result) {
          debugger;
          this._commonService.showInfoMessage("Saved Successfully");
          let receipt = btoa(result['pReceiptId'] + ',' + 'Receipt Voucher');
          window.open('/#/GeneralReceiptReports?id=' + receipt);
          this.memberdetailform.controls.pReceiptdate.setValue(new Date);
          this.Cleardetails();
          // this.router.navigate(['/MemberReceiptView'])
        }
      },
        err => {
          this.isLoading = false;
          this.buttonName = "Save";
          this._commonService.showErrorMessage("Error while saving");
        });
    }
    else {
      this.isLoading = false;
      this.buttonName = "Save";
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
