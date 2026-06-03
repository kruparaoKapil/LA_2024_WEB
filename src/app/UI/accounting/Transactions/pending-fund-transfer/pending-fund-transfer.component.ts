import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CommonService } from 'src/app/Services/common.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-pending-fund-transfer',
  templateUrl: './pending-fund-transfer.component.html',
  styles: []
})
export class PendingFundTransferComponent implements OnInit {
  // ── Grid ─
  pendingList: any[] = [];
  selectedRow: any = null;
  public gridState: State = { sort: [], skip: 0, take: 10 };

  // ── Form ─
  ReceiptForm: FormGroup;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // ── Mode of Payment flags ──
  bankshowhide = true;
  chequeshowhide = true;
  onlineshowhide = false;
  DebitShowhide = false;
  creditShowhide = false;
  DepositBankDisable = false;

  // ── Lists ────────────────────────────────────────────────────────────────────
  banklist: any[] = [];
  modeoftransactionslist: any[] = [];
  typeofpaymentlist: any[] = [];

  // ── Balances ──
  cashBalance = '0 Dr';
  bankBalance = '0 Dr';
  bankbookBalance = '0 Dr';
  bankpassbookBalance = '0 Dr';

  // ── UI ───
  savebutton = 'Save';
  disablesavebutton = false;
  formValidationMessages: any = {};
  today: Date = new Date();

  // ── Login info ──
  loginbranchid = '';
  loginbranchname = '';
 loginbranchlocation: any = '';
  public Modeofpayment: any;
  public Transtype: any;
  logincompanyname: any = '';
logincompanybranch: any = '';

  public Bankbuttondata: any = [
    { id: 1, type: 'Cheque', chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false },
    { id: 2, type: 'Online', chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false },
    { id: 3, type: 'Debit Card', chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false },
    { id: 4, type: 'Credit Card', chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }
  ];

  public Paymentbuttondata: any = [
    { id: 1, type: 'Cash', bankshowhide: false },
    { id: 2, type: 'Bank', bankshowhide: true }
  ];

  constructor(
    private fb: FormBuilder,
    private _CommonService: CommonService,
    private _AccountingTransactionsService: AccountingTransactionsService
  ) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig1.showWeekNumbers = false;
    this.dpConfig1.maxDate = new Date();
  }

  ngOnInit(): void {
    debugger;
    try {
      const setBranchRaw = sessionStorage.getItem('SetBranch');
      if (setBranchRaw) {
        const d = JSON.parse(setBranchRaw);
        this.loginbranchid = d.pbranch_id ? String(d.pbranch_id) : '';
        this.loginbranchname = d.pbranch_name ? String(d.pbranch_name) : '';
        this.loginbranchlocation = d.pbranch_location ? String(d.pbranch_location) : '';
      }
    } catch (e) { }
    this.getLoginBranchInfo();
    this.ReceiptForm = this.fb.group({
      preceiptdate: [new Date()],
      pmodofreceipt: ['BANK'],
      ptranstype: ['Cheque'],
      ptypeofpayment: ['Cheque'],
      pbankname: [''],
      pbranchname: [''],
      pChequenumber: [''],
      pchequedate: [this.today],
      pbankid: [0],
      pCardNumber: [''],
      pdepositbankid: [0],
      pdepositbankname: [''],
      pUpiname: [''],
      pUpiid: [''],
      pnarration: ['', Validators.required],
      pCreatedby: [this._CommonService.pCreatedby],
      ptotalreceivedamount: [0],
      pFilename: [''],
      pFilepath: [''],
      pFileformat: [''],
      pistdsapplicable: [false],
      pTdsSection: [''],
      pTdsPercentage: [0],
      ptdsamount: [0],
      ptdscalculationtype: [''],
      ppartypannumber: [''],
      ppartyid: [0],
      ppartyname: [''],
      ppartyreferenceid: [''],
      ppartyreftype: [''],
      pStatusname: [this._CommonService.pStatusname],
      ptypeofoperation: [this._CommonService.ptypeofoperation]
    });

    this.BlurEventAllControll(this.ReceiptForm);
    this.getLoadData();
    this.Paymenttype('Bank');
  }

  // ── Load pending list from API ──
  loadPendingTransfers(): void {
    debugger;
    try {
       if (!this.logincompanybranch) { return; }
      this._AccountingTransactionsService.GetPendingFundTransfers(this.logincompanybranch).subscribe(
        data => { this.pendingList = data || []; },
        err  => { this._CommonService.showErrorMessage(err); }
      );
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  // ── Row select ───
  onRadioSelect(row: any): void {
    this.selectedRow = row;
    this.ReceiptForm.get('ptotalreceivedamount').setValue(row.voucher_amount || 0);
    this.formValidationMessages = {};
  }

  // ── Load data ───
  getLoadData(): void {
    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('GENERAL RECEIPT').subscribe(
      json => {
        if (!json) { return; }
        this.banklist = json.banklist || [];
        this.modeoftransactionslist = json.modeofTransactionslist || [];
        this.typeofpaymentlist = this.modeoftransactionslist.filter(p => p.ptranstype !== p.ptypeofpayment);
        this.setBalances('CASH', json.cashbalance || 0);
        this.setBalances('BANK', json.bankbalance || 0);
      },
      err => { this._CommonService.showErrorMessage(err); }
    );
  }

  // ── Mode of payment ──
  Paymenttype(type: string): void {
    for (const item of this.Paymentbuttondata) {
      if (item.type === type) {
        this.bankshowhide = item.bankshowhide;
      }
    }
    this.ReceiptForm.get('pbankname').setValue('');
    this.ReceiptForm.get('pChequenumber').setValue('');
    this.ReceiptForm.get('pchequedate').setValue(this.today);
    this.ReceiptForm.get('pdepositbankname').setValue('');
    this.ReceiptForm.get('ptypeofpayment').setValue('');
    this.ReceiptForm.get('pbranchname').setValue('');
    this.ReceiptForm.get('pCardNumber').setValue('');

    if (type === 'Bank') {
      this.ReceiptForm.get('ptranstype').setValue('Cheque');
      this.Banktype('Cheque');
      this.Modeofpayment = type;
    } else {
      this.ReceiptForm.get('ptranstype').setValue('');
      this.chequeshowhide = false;
      this.onlineshowhide = false;
      this.DebitShowhide = false;
      this.creditShowhide = false;
      this.Modeofpayment = type;
      this.Transtype = '';
    }
  }

  Banktype(type: string): void {
    this.ReceiptForm.get('pbankname').setValue('');
    this.ReceiptForm.get('pChequenumber').setValue('');
    this.ReceiptForm.get('pchequedate').setValue(this.today);
    this.ReceiptForm.get('pdepositbankname').setValue('');
    this.ReceiptForm.get('ptypeofpayment').setValue('');
    this.ReceiptForm.get('pbranchname').setValue('');
    this.ReceiptForm.get('pCardNumber').setValue('');

    this.Transtype = type;
    for (const item of this.Bankbuttondata) {
      if (item.type === type) {
        this.chequeshowhide = item.chequeshowhide;
        this.onlineshowhide = item.onlineshowhide;
        this.DebitShowhide = item.DebitShowhide;
        this.creditShowhide = item.creditShowhide;
      }
    }

    if (type === 'Online') {
      this.DepositBankDisable = true;
      this.ReceiptForm.get('ptypeofpayment').setValue('');
    } else {
      this.DepositBankDisable = false;
      this.ReceiptForm.get('ptypeofpayment').setValue(type);
    }

    this.bankbookBalance = '0 Dr';
    this.bankpassbookBalance = '0 Dr';
  }

  bankName_Change($event: any): void {
    const pbankid = $event.target.value;
    if (pbankid && pbankid !== '') {
      const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.ReceiptForm.get('pbankname').setValue(bankname);
      this.getBankBranchName(pbankid);
    } else {
      this.ReceiptForm.get('pbankname').setValue('');
    }
  }

  getBankBranchName(pbankid: any): void {
    const data = this.banklist.filter(b => b.pbankid == pbankid);
    if (data && data.length > 0) {
      this.ReceiptForm.get('pbranchname').setValue(data[0].pbranchname);
      this.setBalances('BANKBOOK', data[0].pbankbalance || 0);
      this.setBalances('PASSBOOK', data[0].pbankpassbookbalance || 0);
    }
  }

  typeofDepositBank($event: any): void {
    const text = $event.target.options[$event.target.selectedIndex].text;
    this.ReceiptForm.get('pdepositbankname').setValue(text);
  }

  typeofPaymentChange($event: any): void {
    this.GetValidationByControl(this.ReceiptForm, 'ptypeofpayment', true);
  }

  setBalances(type: string, amount: any): void {
    const n = parseFloat(amount);
    const label = isNaN(n) ? '0 Dr' : (n < 0
      ? Math.abs(n).toLocaleString() + ' Cr'
      : n.toLocaleString() + ' Dr');
    if (type === 'CASH') { this.cashBalance = label; }
    if (type === 'BANK') { this.bankBalance = label; }
    if (type === 'BANKBOOK') { this.bankbookBalance = label; }
    if (type === 'PASSBOOK') { this.bankpassbookBalance = label; }
  }
getLoginBranchInfo(): void {
  debugger;
  try {
    if (!this.loginbranchid) { return; }
    this._AccountingTransactionsService.GetLoginBranchInfo(this.loginbranchid).subscribe(
      (data: any) => {
        if (data) {
          this.logincompanyname   = data.company_name;
          this.logincompanybranch = data.company_branch;
          console.log('logincompanyname   :', this.logincompanyname);
          console.log('logincompanybranch :', this.logincompanybranch);
          this.loadPendingTransfers();  // ← reload after getting branch info
        }
      },
      error => { this._CommonService.showErrorMessage(error); }
    );
  } catch (e) {
    this._CommonService.showErrorMessage(e);
  }
}
  // ── Save ──
  save(): void {
    try {
      if (!this.selectedRow) {
        this._CommonService.showWarningMessage('Please select a pending transfer.');
        return;
      }
      if (!this.checkValidations(this.ReceiptForm, true)) { return; }

      this.disablesavebutton = true;
      this.savebutton = 'Processing';

      const receiptDate = this.ReceiptForm.get('preceiptdate').value;
      const formattedDate = receiptDate
        ? this._CommonService.getFormatDate(receiptDate)
        : this._CommonService.getFormatDate(new Date());

      const payload = {
        ...this.ReceiptForm.value,
        preceiptdate: formattedDate,
        ptotalreceivedamount: this.selectedRow.voucher_amount || 0,
        ppartyid: 0,
        ppartyname: '',
        pistdsapplicable: false,
        pTdsSection: '',
        pTdsPercentage: 0,
        ptdsamount: 0,
        ptdscalculationtype: '',
        ppartypannumber: '',
        ppartyreferenceid: '',
        ppartyreftype: '',
        fund_transfer_recordid: this.selectedRow.recordid,
        from_company_id: this.selectedRow.from_company_id || '',
        from_company_name: this.selectedRow.from_company_name || '',
        from_branch_id: this.selectedRow.from_branch_id || '',
        from_branch_name: this.selectedRow.from_branch_name || '',
        to_branch_id:            this.selectedRow.to_branch_id      || '', 
  to_branch_name:          this.selectedRow.to_branch_name    || '',  
  to_company_id:           this.selectedRow.to_company_id     || '',  
  to_company_name:         this.selectedRow.to_company_name   || '',  
  login_company_id:        this.loginbranchid,
  login_company_name:      this.logincompanyname,                     
  login_branch_location:   this.logincompanybranch,                    
        preceiptslist: [{
          pledgerid: 0,
          pledgername: '',
          psubledgerid: 0,
          psubledgername: '',
          pamount: this.selectedRow.voucher_amount || 0,
          pgsttype: '',
          pgstcalculationtype: '',
          pgstpercentage: 0,
          pigstamount: 0,
          pcgstamount: 0,
          psgstamount: 0,
          putgstamount: 0,
          pState: '',
          pStateId: 0,
          pgstno: '',
          IsGstapplicable: false,
          ptdsamountindividual: 0,
          ptdssection: '',
          ptdspercentage: 0,
          ptotalamount: String(this.selectedRow.voucher_amount || 0),
          pgstamount: '0',
          pCreatedby: this._CommonService.pCreatedby,
          pStatusname: this._CommonService.pStatusname,
          ptypeofoperation: this._CommonService.ptypeofoperation
        }]
      };

      console.log('Fund Transfer Receipt Payload:', JSON.stringify(payload));

      this._AccountingTransactionsService.SaveFundTransferReceipt(payload).subscribe(
        res => {
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          if (res) {
            this._CommonService.showInfoMessage('Receipt saved successfully.');
            this.clearSelection();
            this.loadPendingTransfers();
          }
        },
        err => {
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          this._CommonService.showErrorMessage(err);
        }
      );
    } catch (e) {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
      this._CommonService.showErrorMessage(e);
    }
  }

  // ── Clear ───
  clearSelection(): void {
    this.selectedRow = null;
    this.ReceiptForm.reset({
      preceiptdate: new Date(),
      pmodofreceipt: 'BANK',
      ptranstype: 'Cheque',
      ptypeofpayment: 'Cheque',
      pbankid: 0,
      pdepositbankid: 0,
      pCreatedby: this._CommonService.pCreatedby
    });
    this.formValidationMessages = {};
    this.bankbookBalance = '0 Dr';
    this.bankpassbookBalance = '0 Dr';
    this.Paymenttype('Bank');
  }

  // ── Validation ───
  BlurEventAllControll(fromgroup: FormGroup): void {
    try {
      Object.keys(fromgroup.controls).forEach(key => this.setBlurEvent(fromgroup, key));
    } catch (e) { this._CommonService.showErrorMessage(e); }
  }

  setBlurEvent(fromgroup: FormGroup, key: string): void {
    try {
      const ctrl = fromgroup.get(key);
      if (ctrl && !(ctrl instanceof FormGroup) && ctrl.validator) {
        fromgroup.get(key).valueChanges.subscribe(() =>
          this.GetValidationByControl(fromgroup, key, true)
        );
      }
    } catch (e) { this._CommonService.showErrorMessage(e); }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach(key => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    } catch (e) { return false; }
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      const ctrl = formGroup.get(key);
      if (ctrl && !(ctrl instanceof FormGroup) && ctrl.validator) {
        this.formValidationMessages[key] = '';
        if (ctrl.invalid) {
          const labelEl = document.getElementById(key) as HTMLInputElement;
          const label = labelEl ? labelEl.title : key;
          for (const errorkey in ctrl.errors) {
            if (ctrl.errors.hasOwnProperty(errorkey)) {
              this.formValidationMessages[key] += this._CommonService.getValidationMessage(ctrl, errorkey, label, key, '') + ' ';
              isValid = false;
            }
          }
        }
      }
    } catch (e) { this._CommonService.showErrorMessage(e); }
    return isValid;
  }

  trackByFn(index: number): number { return index; }
}