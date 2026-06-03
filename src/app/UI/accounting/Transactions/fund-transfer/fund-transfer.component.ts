import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CommonService } from 'src/app/Services/common.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';


@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent implements OnInit {


  fundTransferForm: FormGroup;

  ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // ── Visibility flags ────
  isVoucher = false;
  showModeofPayment = false;
  showCheque = false;
  showOnline = false;
  showdebitcard = false;
  showamountpaid = false;
  showupi = false;

  // ── Lists ───
  companies: any[] = [];
  offices: any[] = [];
  banklist: any[] = [];
  banklist1: any[] = [];
  modeoftransactionslist: any[] = [];
  debitcardlist: any[] = [];
  typeofpaymentlist: any[] = [];
  chequenumberslist: any[] = [];
  upinameslist: any[] = [];
  upiidlist: any[] = [];


  // ── Balances ────
  cashBalance = '0 Dr';
  bankBalance = '0 Dr';
  bankbookBalance = '0 Dr';
  bankpassbookBalance = '0 Dr';


  // ── Grid ───
  paymentslist: any[] = [];
  paymentlistcolumnwiselist: any = {};
  showgrid = true;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public selectableSettings: SelectableSettings;
  // ── UI state ────
  savebutton = 'Save';
  disablesavebutton = false;
  disabletransactiondate = false;
  imageResponse: any;

  // ── Validation ───
  formValidationMessages: any = {};
  CommisionPaymentErrors: any = {};

  // ── Misc ───
  comoanycodeid: any;
  loginbranchname: any;
  loginbranchid: any = '';
 loginbranchlocation: any = '';
 company_name: any = '';
 logincompanyname: any = '';
logincompanybranch: any = '';
  constructor(
    private fb: FormBuilder,
    private _CommonService: CommonService,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private _routes: Router
  ) {
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.showWeekNumbers = false;
    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    debugger;
    try {
      if (this._CommonService.comapnydetails != null) {
        this.disabletransactiondate = this._CommonService.comapnydetails.pdatepickerenablestatus;
        console.log('comapnydetails:', JSON.stringify(this._CommonService.comapnydetails));
      }
      this.loginbranchname = this._CommonService.getloginbranchanme();

      try {
        const setBranchRaw = sessionStorage.getItem('SetBranch');
        if (setBranchRaw) {
          const setBranchData = JSON.parse(setBranchRaw);
          this.loginbranchid = setBranchData.pbranch_id ? String(setBranchData.pbranch_id) : '';
          this.loginbranchname = setBranchData.pbranch_name ? String(setBranchData.pbranch_name) : '';
          this.loginbranchlocation = setBranchData.pbranch_location ? String(setBranchData.pbranch_location) : '';
        }
      } catch (e) { }
      this.getLoginBranchInfo();  
      console.log('pCreatedby:', this._CommonService.pCreatedby);

      this.fundTransferForm = this.fb.group({
        company_code: ['', Validators.required],
        branch_code: ['', Validators.required],

        ppaymentdate: [new Date(), Validators.required],
        pModeofreceipt: [null],
        ptranstype: [null],
        pactualpaidamount: [''],
        pnarration: [''],
        pDocStorePath: [''],
        pFilename: [''],
        pFilepath: [''],
        pFileformat: [''],

        pbankid: [''],
        pbankname: [''],
        pbranchname: [''],
        pchequeno: [''],
        ptypeofpayment: [''],
        preferencenoonline: [''],
        pUpiname: [''],
        pUpiid: [''],
        pdebitcard: [''],
        pfinancialservice: [''],
        preferencenodcard: [''],


        pCreatedby: [this._CommonService.pCreatedby],
      });

      this.formValidationMessages = {};
      this.CommisionPaymentErrors = {};

      this.BlurEventAllControll(this.fundTransferForm);
      this.isVoucher = true;
      this.fundTransferForm.get('pModeofreceipt').setValue('BANK');
      this.fundTransferForm.get('ptranstype').setValue('CHEQUE');
      this.modeofPaymentChange();
      this.getcompanyNames();
      this.getLoadData();

    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  // ── Validation ─────
  BlurEventAllControll(fromgroup: FormGroup): void {
    try {
      Object.keys(fromgroup.controls).forEach(key => this.setBlurEvent(fromgroup, key));
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  setBlurEvent(fromgroup: FormGroup, key: string): void {
    try {
      const ctrl = fromgroup.get(key);
      if (ctrl) {
        if (ctrl instanceof FormGroup) {
          this.BlurEventAllControll(ctrl);
        } else if (ctrl.validator) {
          fromgroup.get(key).valueChanges.subscribe(() =>
            this.GetValidationByControl(fromgroup, key, true)
          );
        }
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger;
    try {
      Object.keys(group.controls).forEach(key => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    } catch (e) {
      return false;
    }
    return isValid;
  }

GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    debugger;
    try {
      const ctrl = formGroup.get(key);
      if (ctrl) {
        if (ctrl instanceof FormGroup) {
          if (key !== 'ppaymentsslistcontrols') {
            this.checkValidations(ctrl, isValid);
          }
        } else if (ctrl.validator) {
          this.formValidationMessages[key] = '';
          this.CommisionPaymentErrors[key] = '';
          if (ctrl.invalid) {
            const labelEl = document.getElementById(key) as HTMLInputElement;
            const label = labelEl ? labelEl.title : key;
            for (const errorkey in ctrl.errors) {
              if (ctrl.errors.hasOwnProperty(errorkey)) {
                const msg = this._CommonService.getValidationMessage(ctrl, errorkey, label, key, '');
                this.formValidationMessages[key] += msg + ' ';
                this.CommisionPaymentErrors[key] += msg + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    return isValid;
  }


  // ── Mode of payment ────
  modeofPaymentChange(): void {
    debugger;
    try {
      const mode = this.fundTransferForm.get('pModeofreceipt').value;

      if (mode === 'CASH') {
        this.fundTransferForm.get('pbankid').setValue(0);
        this.fundTransferForm.get('ptranstype').setValue('CASH');
        this.showModeofPayment = false;
        this.showCheque = false;
        this.showOnline = false;
        this.showdebitcard = false;
        this.showamountpaid = true;
      } else if (mode === 'BANK') {
        this.fundTransferForm.get('ptranstype').setValue('CHEQUE');
        this.showModeofPayment = true;
        this.showCheque = true;
        this.showOnline = false;
        this.showdebitcard = false;
        this.showamountpaid = false;
        this.modeofpaymentvalidation('CHEQUE');
        this.clearmodeofpaymentDetails();
      } else {
        this.showModeofPayment = false;
        this.showCheque = false;
        this.showOnline = false;
        this.showdebitcard = false;
        this.showamountpaid = false;
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  transofPaymentChange(type: string): void {
    debugger;
    try {
      this.showCheque = type === 'CHEQUE';
      this.showOnline = type === 'ONLINE';
      this.showdebitcard = type === 'DEBIT CARD';
      this.modeofpaymentvalidation(type);
      this.clearmodeofpaymentDetails();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  private modeofpaymentvalidation(type: string): void {
    debugger;
    this.CommisionPaymentErrors = {};
    const f = this.fundTransferForm.controls;

    const setReq = (c: any) => c.setValidators(Validators.required);
    const clearV = (c: any) => c.clearValidators();
    const update = (...cs: any[]) => cs.forEach(c => c.updateValueAndValidity());

    if (type === 'CHEQUE') {
      setReq(f['pbankid']); setReq(f['pbranchname']); setReq(f['pchequeno']);
      clearV(f['ptypeofpayment']); clearV(f['preferencenoonline']);
      clearV(f['pdebitcard']); clearV(f['pfinancialservice']); clearV(f['preferencenodcard']);
    } else if (type === 'ONLINE') {
      setReq(f['pbankid']); setReq(f['ptypeofpayment']); setReq(f['preferencenoonline']);
      if (this.showupi) { setReq(f['pUpiname']); setReq(f['pUpiid']); }
      else { clearV(f['pUpiname']); clearV(f['pUpiid']); }
      clearV(f['pbranchname']); clearV(f['pchequeno']);
      clearV(f['pdebitcard']); clearV(f['pfinancialservice']); clearV(f['preferencenodcard']);
    } else if (type === 'DEBIT CARD') {
      setReq(f['pdebitcard']); setReq(f['pfinancialservice']); setReq(f['preferencenodcard']);
      clearV(f['pbankid']); clearV(f['pbranchname']); clearV(f['pchequeno']);
      clearV(f['ptypeofpayment']); clearV(f['preferencenoonline']);
    }

    update(
      f['pbankid'], f['pbranchname'], f['pchequeno'],
      f['ptypeofpayment'], f['preferencenoonline'],
      f['pdebitcard'], f['pfinancialservice'], f['preferencenodcard'],
      f['pUpiname'], f['pUpiid']
    );
  }

  private clearmodeofpaymentDetails(): void {
    debugger;
    ['pbankid', 'pbankname', 'pbranchname', 'pchequeno', 'ptypeofpayment',
      'preferencenoonline', 'pUpiname', 'pUpiid', 'pdebitcard',
      'pfinancialservice', 'preferencenodcard'
    ].forEach(k => this.fundTransferForm.get(k).setValue(''));
    this.chequenumberslist = [];
    this.CommisionPaymentErrors = {};
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
        }
      },
      error => { this._CommonService.showErrorMessage(error); }
    );
  } catch (e) {
    this._CommonService.showErrorMessage(e);
  }
}
  // ── Bank ───
  bankName_Change($event: any): void {
    debugger;
    try {
      const pbankid = $event.target.value;
      this.upinameslist = [];
      this.chequenumberslist = [];
      this.showupi = false;
      ['ptypeofpayment', 'preferencenoonline', 'pUpiname', 'pUpiid']
        .forEach(k => this.fundTransferForm.get(k).setValue(''));
      this.CommisionPaymentErrors = {};

      if (pbankid && pbankid !== '' && pbankid !== 'Select') {
        const bankname = $event.target.options[$event.target.selectedIndex].text;
        this.fundTransferForm.get('pbankname').setValue(bankname);
        this.GetBankDetailsbyId(pbankid);
        this.getBankBranchName(pbankid);
      } else {
        this.fundTransferForm.get('pbankname').setValue('');
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  private getBankBranchName(pbankid: any): void {
    debugger;
    const data = this.banklist.filter(b => b.pbankid == pbankid);
    if (data && data.length > 0) {
      this.fundTransferForm.get('pbranchname').setValue(data[0].pbranchname);
      this.setBalances('BANKBOOK', data[0].pbankbalance || 0);
      this.setBalances('PASSBOOK', data[0].pbankpassbookbalance || 0);
    }
  }

  typeofPaymentChange(): void {
    debugger;
    this.showupi = this.fundTransferForm.controls['ptypeofpayment'].value === 'UPI';
  }

  upiName_Change($event: any): void {
    debugger;
    try {
      const name = $event.target.options[$event.target.selectedIndex].text;
      this.upiidlist = this.upinameslist.filter(x => x.pUpiname === name);
      if (!$event.target.value) {
        this.upiidlist = [];
        this.fundTransferForm.get('pUpiid').setValue('');
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  debitCard_Change($event: any): void {
    debugger;
    try {
      const card = this.debitcardlist.find(
        d => d.pCardNumber == this.fundTransferForm.controls['pdebitcard'].value
      );
      if (card) {
        this.fundTransferForm.get('pfinancialservice').setValue(card.pbankname);
        this.fundTransferForm.get('pbankid').setValue(card.pbankid);
        this.setBalances('BANKBOOK', card.pbankbookbalance || 0);
        this.setBalances('PASSBOOK', card.ppassbookbalance || 0);
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  chequenumber_Change(): void {
    debugger;
    try {
      this.GetValidationByControl(this.fundTransferForm, 'pchequeno', true);
       this.autoAddToGrid();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  pamount_change(): void {
    debugger;
    try {
      // ── Voucher section amount ───
      const voucherAmt = this.fundTransferForm.get('pactualpaidamount').value;
      if (voucherAmt !== null && voucherAmt !== '') {
        const parsed = parseFloat(voucherAmt.toString().replace(/,/g, ''));
        if (!isNaN(parsed)) {
          this.fundTransferForm.get('pactualpaidamount').setValue(
            this._CommonService.currencyformat(parsed),
            { emitEvent: false }
          );
        }
      }
      this.autoAddToGrid();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

autoAddToGrid(): void {
    debugger;
    try {
      const company_code      = this.fundTransferForm.get('company_code').value;
      const branch_code       = this.fundTransferForm.get('branch_code').value;
      const pactualpaidamount = this.fundTransferForm.get('pactualpaidamount').value;
      const parsedAmt         = parseFloat((pactualpaidamount || '0').toString().replace(/,/g, ''));

      if (!company_code || !branch_code) { return; }
      if (!pactualpaidamount || pactualpaidamount === '' || isNaN(parsedAmt) || parsedAmt <= 0) { return; }
   
      const row = {
        company_code:       company_code,
        branch_code:        branch_code,
        company_name:       this.getCompanyName(),
        branch_name:        this.getBranchName(),
        pModeofreceipt:     this.fundTransferForm.get('pModeofreceipt').value,
        ptranstype:         this.fundTransferForm.get('ptranstype').value,
        pbankname:          this.fundTransferForm.get('pbankname').value,
        pbranchname:        this.fundTransferForm.get('pbranchname').value,
        pchequeno:          this.fundTransferForm.get('pchequeno').value,
        ptypeofpayment:     this.fundTransferForm.get('ptypeofpayment').value,
        preferencenoonline: this.fundTransferForm.get('preferencenoonline').value,
        pdebitcard:         this.fundTransferForm.get('pdebitcard').value,
        preferencenodcard:  this.fundTransferForm.get('preferencenodcard').value,
        pactualpaidamount:  parsedAmt,
      };

      const existingIndex = this.paymentslist.findIndex(
        r => r.company_code === company_code && r.branch_code === branch_code
      );

      if (existingIndex >= 0) {
        this.paymentslist[existingIndex] = row;
        this.paymentslist = [...this.paymentslist];
      } else {
        this.paymentslist = [...this.paymentslist, row];
      }

      this.getPaymentListColumnWisetotals();
      this.showgrid = true;
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  // ── Grid operations ───────
  addPaymentDetails(): void {
    debugger;
    try {
      if (!this.fundTransferForm.get('company_code').value) {
        this._CommonService.showWarningMessage('Please select a Company.');
        return;
      }
      if (!this.fundTransferForm.get('branch_code').value) {
        this._CommonService.showWarningMessage('Please select an Office.');
        return;
      }
      const amt = this.fundTransferForm.get('pactualpaidamount').value;
      if (!amt || amt === '' || amt === '0') {
        this._CommonService.showWarningMessage('Please enter Amount Paid.');
        return;
      }

      const row = {
        company_code: this.fundTransferForm.get('company_code').value,
        branch_code: this.fundTransferForm.get('branch_code').value,
        company_name: this.getCompanyName(),
        branch_name: this.getBranchName(),
        pModeofreceipt: this.fundTransferForm.get('pModeofreceipt').value,
        ptranstype: this.fundTransferForm.get('ptranstype').value,
        pbankname: this.fundTransferForm.get('pbankname').value,
        pbranchname: this.fundTransferForm.get('pbranchname').value,
        pchequeno: this.fundTransferForm.get('pchequeno').value,
        ptypeofpayment: this.fundTransferForm.get('ptypeofpayment').value,
        preferencenoonline: this.fundTransferForm.get('preferencenoonline').value,
        pdebitcard: this.fundTransferForm.get('pdebitcard').value,
        preferencenodcard: this.fundTransferForm.get('preferencenodcard').value,
        pactualpaidamount: this.fundTransferForm.get('pactualpaidamount').value,
      };

      this.paymentslist = [...this.paymentslist, row];
      this.getPaymentListColumnWisetotals();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  removeHandler({ dataItem }): void {
    debugger;
    try {
      const index = this.paymentslist.indexOf(dataItem);
      if (index !== -1) {
        this.paymentslist.splice(index, 1);
        this.paymentslist = [...this.paymentslist];
      }
      this.getPaymentListColumnWisetotals();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getPaymentListColumnWisetotals(): void {
    debugger;
    try {
      const total = this.paymentslist.reduce((sum, c) => {
        const val = parseFloat(
          (c.pactualpaidamount || '0').toString().replace(/,/g, '')
        );
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      this.paymentlistcolumnwiselist['pactualpaidamount'] =
        this._CommonService.currencyformat(total);
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  private getCompanyName(): string {
    try {
      const ctrl = this.fundTransferForm.get('company_code');
      const code = ctrl ? ctrl.value : '';
      if (!code) return '';
      const co = this.companies ? this.companies.find(o => String(o.branch_id) === String(code)) : null;
      return co ? co.company_name : '';
    } catch (e) { return ''; }
  }


  private getBranchName(): string {
    try {
      const ctrl = this.fundTransferForm.get('branch_code');
      const code = ctrl ? ctrl.value : '';
      if (!code) return '';
      const br = this.offices ? this.offices.find(o => String(o.branch_id) === String(code)) : null;
      return br ? br.company_branch : '';
    } catch (e) { return ''; }
  }

  // ── Save ───
  savePaymentVoucher(): void {
    debugger;
    try {
      if (!this.checkValidations(this.fundTransferForm, true)) { return; }
      if (this.paymentslist.length === 0) {
        this._CommonService.showWarningMessage('Please add at least one payment entry.');
        return;
      }
      this.disablesavebutton = true;
      this.savebutton = 'Processing';

      const rawDate = this.fundTransferForm.get('ppaymentdate').value;
      const formattedDate = rawDate
        ? this._CommonService.getFormatDate(rawDate)
        : this._CommonService.getFormatDate(new Date());

      console.log('loginbranchid at save time:', this.loginbranchid);
      console.log('paymentslist:', this.paymentslist);

      const rawAmt = this.fundTransferForm.get('pactualpaidamount').value;
      const data = {
        ...this.fundTransferForm.value,
        ppaymentdate: formattedDate,
        pactualpaidamount: rawAmt ? parseFloat(rawAmt.toString().replace(/,/g, '')) : 0,
        pPaymentVoucherlist: this.paymentslist,
        login_company_id: this.loginbranchid ? this.loginbranchid : '',
        // login_company_name: this.loginbranchname ? this.loginbranchname : '',
        // login_branch_location:  this.loginbranchlocation || '',
        login_company_name:     this.logincompanyname     ? this.logincompanyname     : '', 
        login_branch_location:  this.logincompanybranch   ? this.logincompanybranch   : '',  

        pCreatedby: this._CommonService.pCreatedby
      };
      console.log('full payload:', JSON.stringify(data));
      this._AccountingTransactionsService.saveFundTransfer(data).subscribe(
        res => {
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          if (res && res[0] === 'TRUE') {
            this._CommonService.showInfoMessage('Saved successfully');
            this.clearPaymentVoucher();
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
  clearPaymentVoucher(): void {
    debugger;
    try {
      this.paymentslist = [];
      this.paymentlistcolumnwiselist = {};
      this.showgrid = false;
      this.fundTransferForm.reset({
        ppaymentdate: new Date(),
        pModeofreceipt: 'BANK',
        ptranstype: 'CHEQUE',
        pCreatedby: this._CommonService.pCreatedby
      });
      this.formValidationMessages = {};
      this.CommisionPaymentErrors = {};
      this.cashBalance = '0 Dr';
      this.bankBalance = '0 Dr';
      this.bankbookBalance = '0 Dr';
      this.bankpassbookBalance = '0 Dr';
      this.modeofPaymentChange();
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  // ── Data loading ───
  getcompanyNames(): void {
    debugger;
    try {
      this._AccountingTransactionsService.GetUsersCompanyCodes().subscribe(
        data => {
          this.companies = data;
        },
        error => { this._CommonService.showErrorMessage(error); }
      );
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  onCompanyChange($event: any): void {
    debugger;
    try {
        if (!$event) { 
    this.offices = [];
    this.fundTransferForm.get('branch_code').setValue('');
    return; 
  }
      this.company_name = $event.company_name;

      this._AccountingTransactionsService.GetUsersBranchCodes(this.company_name,this.logincompanybranch, this.logincompanyname ).subscribe(
        (data: any) => {
          this.offices = (data || [])
            .map((b: any) => ({   
              branch_id:      b.branch_id,           
              company_branch: b.company_branch
            }));
            this.fundTransferForm.get('branch_code').setValue('');
        },
        error => { this._CommonService.showErrorMessage(error); }
      );
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  // private getLoadData(): void {
  //   this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData2(
  //     'PAYMENT VOUCHER',
  //     this._CommonService.getbranchname(),
  //     this._CommonService.getschemaname(),
  //     this._CommonService.getCompanyCode(),
  //     this._CommonService.getBranchCode(),
  //     'taxes'
  //   ).subscribe(
  getLoadData(): void {
    debugger;
    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER',).subscribe(
      json => {
        if (!json) { return; }
        this.banklist = json.banklist || [];
        this.banklist1 = json.banklist || [];
        this.modeoftransactionslist = json.modeofTransactionslist || [];
        this.debitcardlist = json.bankdebitcardslist || [];
        this.setBalances('CASH', json.cashbalance || 0);
        this.setBalances('BANK', json.bankbalance || 0);
        this.typeofpaymentlist = this.modeoftransactionslist.filter(
          p => p.ptranstype !== p.ptypeofpayment
        );
      },
      err => { this._CommonService.showErrorMessage(err); }
    );
  }

  private GetBankDetailsbyId(pbankid: any): void {
    debugger;
    // this._AccountingTransactionsService.GetBankDetailsbyId1(
    //   pbankid,
    //   this._CommonService.getbranchname(),
    //   this._CommonService.getschemaname(),
    //   this._CommonService.getCompanyCode(),
    //   this._CommonService.getBranchCode()
    // ).subscribe(
    this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(
      json => {
        if (json) {
          this.upinameslist = json.bankupilist || [];
          this.chequenumberslist = json.chequeslist || [];
        }
      },
      err => { this._CommonService.showErrorMessage(err); }
    );
  }


  private setBalances(type: string, amount: any): void {
    debugger;
    const n = parseFloat(amount);
    const label = isNaN(n) ? '0 Dr' : (n < 0
      ? Math.abs(n).toLocaleString() + ' Cr'
      : n.toLocaleString() + ' Dr');
    if (type === 'CASH') { this.cashBalance = label; }
    if (type === 'BANK') { this.bankBalance = label; }
    if (type === 'BANKBOOK') { this.bankbookBalance = label; }
    if (type === 'PASSBOOK') { this.bankpassbookBalance = label; }
  }

  uploadAndProgress(event: any, files: FileList): void {
    debugger;
    try {
      if (!files || files.length === 0) { return; }
      const file = files[0];
      this.imageResponse = { name: file.name };
      const formData = new FormData();
      formData.append('file', file);
      const ext = file.name.split('.').pop();
      formData.append('NewFileName', 'FundTransfer.' + ext);
      this._CommonService.fileUploadS3('FundTransfer', formData).subscribe(
        (data: any) => {
          this.imageResponse.name = data[1];
          this.fundTransferForm.patchValue({
            pFilename: data[1],
            pFileformat: data[0],
            pFilepath: data[1] && data[1].split('.')[1]
          });
        },
        err => { this._CommonService.showErrorMessage(err); }
      );
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  trackByFn(index: number): number { return index; }
}