import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { DatePipe } from '@angular/common';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { log } from 'util';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-interest-report-new1',
  templateUrl: './interest-report-new1.component.html',
  styles: []
})
export class InterestReportNew1Component implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild('kendoGrid', { static: false }) kendoGrid: GridComponent;
  InterestReportForm: FormGroup;
  public total: number = 0;
  public today: Date = new Date();
  paymenttype = 'SELF';
  schemeid: any;
  showCheque: any;
  public SchemeDetails: any = []
  public BranchDetails: any = []
  public CompanyDetails: any = []
  public Showmembers: any = [];
  public ShowmembersFil: any = [];
  showBank: boolean = false;
public BankDetails: any = [];
  intrestpaymentlist: any;
  monthof: any;
  companyname: string;
  branchname: string
  showOnline: any;
  showdebitcard: any;
  showupi: any;
  showCompany: any;
  InterestPaymentErrors: any
  totalAdvanceAmount: number = 0
  totalinterestpayable: number = 0
  totalinterestamount: number = 0;
  totaltdsamount: number = 0
  totalnetamount: number = 0
  public pageSize = 10;
  //bstart
  bkorbranch: any = [];
  showbnkbranch: any = [];
  storebkorbh: any;
  bankparts: any = [];
  groupedData: { bank: any; data: any; }[];
  pdfData: any[] = [];
 bankNameDisplay :any;
 selectedInterestRows: any[] = [];
allInterestRowsSelected: boolean = false;
bankDropdownSettings: IDropdownSettings = {};
selectedBanks: any[] = [];
public gridDisplayData: any[] = [];
public isPdfExporting: boolean = false;
public isExcelExporting: boolean = false;
  // Branchdetails: any;
  // branchselflag: boolean = false;
  //bend
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public interestpaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  nettotalamount: number = 0;
  schemeName: any;
  minDate: Date;
  loading: boolean = false;
  public group: GroupDescriptor[] = [{ field: 'bankName' }];

  //public group: GroupDescriptor[] = [{ field: 'pMembername' }];
  //public sort: SortDescriptor[] = [{ field: 'pmaturitydate', dir: 'asc' }];

  constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private _fdrdttranscationservice: FdRdTransactionsService, private cdr: ChangeDetectorRef) {
    this.dpConfig.dateInputFormat = 'MMM-YYYY'
    // this.dpConfig.maxDate = new Date();
    // this.dpConfig.showWeekNumbers = false;
    this.dpConfig.minMode = 'month';
    this.dpConfig.minDate = this.minDate = new Date('2024-07-01T00:00:00+05:30');

    this.dpConfig.maxDate = this.today;
    this.allData = this.allData.bind(this);

  }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  ngOnInit() {
    this.bankDropdownSettings = {
    singleSelection: false,
    idField: 'pBankName',
    textField: 'pBankName',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Un Select All',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 2,
    searchPlaceholderText: 'Search Bank',
    noDataAvailablePlaceholderText: 'No Banks Found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false
  };
    this.InterestReportForm = this.FB.group({
      ppaymentid: [''],

      padjustmenttype: [''],

      pCreatedby: [this._CommonService.pCreatedby],


      pschemename: ['', Validators.required],
      pSchemeId: ['', Validators.required],

      pcompanyname: ['', Validators.required],
      pbranchnamemain: ['', Validators.required],
      pMonthOf: ['', Validators.required],
      // pbranchself: ['']
      pbankname: ['']




    })
    this.InterestReportForm.controls.padjustmenttype.value == 'SELF'
    this.InterestReportForm.controls.padjustmenttype.value == 'ADJUSTMENT'
    this.GetSchemedetails();
    this.showCheque = true;
    this.showOnline = false;
    this.showdebitcard = false;
    this.showCompany = false;
    // this.GetCompanydetails();

    this.InterestPaymentErrors = {};

    this.BlurEventAllControll(this.InterestReportForm);
    // this.branchselflag = true;
    // this.GetBranchdetails();
  }
  //bhargvai
  // GetBranchdetails() {

  //   this._fdrdttranscationservice.Getbranchdetails().subscribe(res => {
  //     debugger
  //     this.Branchdetails = res
  //   })

  // }
  //bhargvai

  GetSchemedetails() {
    debugger;
    this._LienEntryService.GetSchemedetails().subscribe(result => {
      debugger;
      this.SchemeDetails = result;
      console.log(this.SchemeDetails)
    })
  }
  GetCompanydetails() {
    debugger;
    this._LienEntryService.GetCompanydetails().subscribe(result => {
      debugger;
      this.CompanyDetails = result;
      console.log(this.CompanyDetails)
    })
  }
  DateChange($event: any) {
    debugger;
    this.monthof = this.datepipe.transform($event, 'MMM-yyyy');

    let minMonth = new Date('2024-06-01');
    let selectedMonth = new Date($event);

    if (selectedMonth < minMonth) {
      this.InterestReportForm['controls']['pMonthOf'].setValue('');
      this._CommonService.showWarningMessage('The selected month should not be before JULY 2024.');
      return
    }
  }
  GetShowmemberdetails() {
    debugger;

    this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.gridDisplayData = [];
    let isValid = false;
    this.Showmembers = [];
    this.totalAdvanceAmount = 0;
    this.totalinterestpayable = 0;
    this.totalinterestamount = 0;
    this.totaltdsamount = 0;
    this.totalnetamount = 0;
    this.nettotalamount = 0;
    this.showbtnvalidation(this.paymenttype)
    this.Showmembers.empty;
    debugger;
    if (this.paymenttype === 'SELF' && (!this.selectedBanks || this.selectedBanks.length === 0)) {
    this._CommonService.showWarningMessage('Please select at least one Bank Name.');
    return;
  }
    this.loading = true;

      //let bankname = this.InterestReportForm.controls.pbankname.value || 'ALL';
//       let bankname = this.InterestReportForm.controls.pbankname.value;

// if (!bankname || bankname.trim() === '') {
//   bankname = 'ALL';
// }

let bankname: string;
if (this.paymenttype === 'SELF') {
  if (this.selectedBanks && this.selectedBanks.length > 0) {
    bankname = this.selectedBanks.map(b => b.pBankName).join(',');
  } else {
    bankname = 'ALL';
  }
} else {
  bankname = 'ALL';
}
    this._LienEntryService.GetInterestReport1(this.monthof, this.schemeid, this.paymenttype, this.companyname, this.branchname,  bankname ).subscribe(result => {
      debugger;
      //bstart
      this.Showmembers = result;

      console.log('this is interest eport:', this.Showmembers);

      // console.log('first array value:', this.Showmembers[0].pbankname_bankbranch_banAccountno);
      // sir  5-08-2025 this.Showmembers.forEach(member => {
      //   const rawValue = member.pbankname_bankbranch_banAccountno || '';

      //   const parts = rawValue.split('/').filter(p => p.trim() !== '');

      //   const accountNumber = parts.pop() || '';
      //   const branch = parts.pop() || '';
      //   const bankName = parts.join('/') || '';

      //   if(bankName !='' ){
      //   member.bankName = bankName + ' / ' + branch;
      //   }
      //   else{
      //      member.bankName = bankName
      //   }
      //   member.branch = branch;
      //   member.accountNumber = accountNumber;

      //   console.log(`Bank Name: ${bankName}, Branch: ${branch}, Account: ${accountNumber}`);
      // });

      this.Showmembers.forEach(member => {
        if (!member || !member.pbankname_bankbranch_banAccountno) {
          member = member || {};
          member.bankName = '';
          member.branch = '';
          member.accountNumber = '';
          return;
        }

        const rawValue = member.pbankname_bankbranch_banAccountno || '';

        const parts = rawValue.split('/');

        // const accountNumber = parts[2] || '';
        // const branch = parts[1] || '';
        // const bankName = parts[0] || '';
        const accountNumber = parts[2] ? parts[2].trim() : '';
       const branch = parts[1] ? parts[1].trim() : '';
       const bankName = parts[0] ? parts[0].trim() : '';

        if (bankName !== '') {
          // member.bankName = bankName + (branch ? ' / ' + branch : '');
         // member.bankName = bankName;
          member.bankName = (bankName || '').trim();
        } else {
          member.bankName = '';
        }

        member.branch = branch;
        member.accountNumber = accountNumber;

        console.log(`Bank Name: ${bankName}, Branch: ${branch}, Account: ${accountNumber}`);
      });

      //bend
      // console.log('this is  grid data:', this.Showmembers);
      this.ShowmembersFil = result;
      // console.log(this.Showmembers);
      this.loading = false;
      let month = this.datepipe.transform(this.InterestReportForm['controls']['pMonthOf'].value, 'MMM-yyyy');
      if (this.Showmembers.length == 0) {
        this._CommonService.showWarningMessage('No Data To Show For The Month of' + ' ' + month);
        this.loading = false;
      }
      for (let i = 0; i < this.Showmembers.length; i++) {
        // this.totalAdvanceAmount = this.totalAdvanceAmount + this.Showmembers[i].pdepositeamount;
        //         this.totalinterestamount = this.totalinterestamount + this.Showmembers[i].pIntrestamount;
        // this.totaltdsamount = this.totaltdsamount + this.Showmembers[i].pTdsamount;

        this.totalAdvanceAmount = this.Showmembers.reduce((sum, c) => sum + Number(c.pdepositeamount || 0), 0);
       this.totalinterestamount = this.Showmembers.reduce((sum, c) => sum + Number(c.pIntrestamount || 0), 0);
       this.totaltdsamount = this.Showmembers.reduce((sum, c) => sum + Number(c.pTdsamount || 0), 0);

        // this.totalinterestpayable=this.totalinterestpayable + this.Showmembers[i].pInterestPayable;

        //  this.totalnetamount=this.totalnetamount + this.Showmembers[i].ptotalamount;

        //  let invoiceAmount = this.Showmembers.reduce((sum, item) => sum + Number(item.invoice_amount), 0).toFixed(2);

        // this.totamountEX = this.Showmembers[i].ptotalamount.reduce((sum, item) => sum + item.ptotalamount, 0);
      }
      // console.log("totamountEX8888",this.totamountEX)
      console.log("members", this.totalAdvanceAmount)
      console.log("int", this.totalinterestamount)
      console.log("net", this.totalnetamount)
      this.nettotalamount = this.Showmembers.reduce((sum, item) => sum + Number(item.ptotalamount), 0).toFixed(2);

      console.log("nettotalamount", this.nettotalamount)

      // this.Showmembers = this.Showmembers.map(obj => {
      //   obj.fullData = obj.pbankname_bankbranch_banAccountno.split('/');
      //   obj.companySplit = obj.fullData[0].trim();
      //   obj.branchSplit = obj.fullData[1].trim();
      //   obj.groupCodeSplit = obj.fullData[2].trim();
      //   return obj;
      // });
      this.Showmembers = this.Showmembers.map(obj => {
        const fullValue = obj.pbankname_bankbranch_banAccountno;
        console.log('this is all data:', fullValue);

        if (fullValue) {
          obj.fullData = fullValue.split('/');
          obj.companySplit = obj.fullData[0] ? obj.fullData[0].trim() : '';
          obj.branchSplit = obj.fullData[1] ? obj.fullData[1].trim() : '';
          obj.groupCodeSplit = obj.fullData[2] ? obj.fullData[2].trim() : '';

        } else {
          obj.fullData = [];
          obj.companySplit = '';
          obj.branchSplit = '';
          obj.groupCodeSplit = '';
        }

        return obj;
      });

      this.selectedInterestRows = [];
   this.allInterestRowsSelected = false;
    this.gridDisplayData = [...this.Showmembers];

    }, (error) => {
      this._CommonService.showErrorMessage(error);
      this.loading = false;
    });


  }
  showbtnvalidation(type) {
    debugger

    let pSchemeId = <FormGroup>this.InterestReportForm['controls']['pSchemeId'];
    let padjustmenttype = <FormGroup>this.InterestReportForm['controls']['padjustmenttype'];
    let pcompanyname = <FormGroup>this.InterestReportForm['controls']['pcompanyname'];
    let pbranchnamemain = <FormGroup>this.InterestReportForm['controls']['pbranchnamemain'];
    let pMonthOf = <FormGroup>this.InterestReportForm['controls']['pMonthOf'];
     let pbankname = this.InterestReportForm.controls['pbankname'];

    if (type == 'SELF' || type == 'ALL') {

      pSchemeId.setValidators(Validators.required)
      padjustmenttype.setValidators(Validators.required)
      pMonthOf.setValidators(Validators.required)
      this.companyname = '';
      this.branchname = ''
         if (type == 'SELF') {
      pbankname.setValidators(Validators.required);
    } else {
      pbankname.clearValidators();
    }



    }
    else if (type == 'ADJUSTMENT') {

      pSchemeId.setValidators(Validators.required)
      padjustmenttype.setValidators(Validators.required)
      pMonthOf.setValidators(Validators.required)
      pcompanyname.setValidators(Validators.required)
      pbranchnamemain.setValidators(Validators.required)
        pbankname.clearValidators();


    }
    else {

      pSchemeId.clearValidators()
      padjustmenttype.clearValidators()
      pMonthOf.clearValidators()
      pcompanyname.clearValidators()
      pbranchnamemain.clearValidators()
        pbankname.clearValidators();
    }



    pSchemeId.updateValueAndValidity();
    padjustmenttype.updateValueAndValidity();
    pMonthOf.updateValueAndValidity();
    pcompanyname.updateValueAndValidity();
    pbranchnamemain.updateValueAndValidity();
     pbankname.updateValueAndValidity();


  }
  shemename_change($event: any) {
    debugger;
    this.intrestpaymentlist = [];
    this.Showmembers = [];
    this.schemeid = $event.target.value;

    this.schemeName = $event.target.options[$event.target.selectedIndex].text

  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
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
          this.InterestPaymentErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.InterestPaymentErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    debugger;
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
      this.showErrorMessage(e);
      return false;
    }
  }
  // adjustmentTypeChange($event: any) {
  //   debugger;
  //   const typevalue = $event.target.value;
  //   this.paymenttype = $event.target.value;
  //   this.CompanyDetails = [];
  //   this.BranchDetails = [];
  //   this.intrestpaymentlist = [];
  //   this.Showmembers = [];
  //   if (typevalue == "ADJUSTMENT") {
  //     this.showCompany = true;
  //        this.showBank = false;

  //     this.InterestReportForm.controls.pcompanyname.setValue('');
  //     this.InterestReportForm.controls.pbranchnamemain.setValue('');
  //     // this.branchselflag = false;
  //     this.GetCompanydetails();

  //   }
  //     else if (typevalue == "SELF") {
  //       this.showCompany = false;
  //   this.showBank = true;

  //   this._LienEntryService.GetBankNames().subscribe(result => {
  //     this.BankDetails = result;
  //     console.log("Bank List:", this.BankDetails);
  //   });
  // }

  //   else {
  //     this.showCompany = false;
  //     // this.branchselflag = true;
  //     this.showBank = false;

  //   }


  // }

  adjustmentTypeChange($event: any) {
  const typevalue = $event.target.value;
  this.paymenttype = typevalue;

  this.CompanyDetails = [];
  this.BranchDetails = [];
  this.intrestpaymentlist = [];
  this.Showmembers = [];

  this.gridDisplayData = [];
  this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.totalinterestamount = 0;
  this.totaltdsamount = 0;
  this.nettotalamount = 0;

  if (typevalue == "ADJUSTMENT") {
    this.showCompany = true;
    this.showBank = false;

    // CLEAR BANK VALIDATION
    //this.InterestReportForm.controls.pbankname.clearValidators();
    //this.InterestReportForm.controls.pbankname.updateValueAndValidity();

    this.InterestReportForm.controls.pcompanyname.setValue('');
    this.InterestReportForm.controls.pbranchnamemain.setValue('');

    this.GetCompanydetails();
  }

  else if (typevalue == "SELF") {
    this.showCompany = false;
    this.showBank = true;
     this.selectedBanks = []; 
      this._LienEntryService.GetBankNames().subscribe(result => {
    this.BankDetails = result;
    this.InterestReportForm.controls.pbankname.setValue('');
  });
    //this.InterestReportForm.controls.pbankname.setValidators(Validators.required);
    //this.InterestReportForm.controls.pbankname.updateValueAndValidity();


    // this._LienEntryService.GetBankNames().subscribe(result => {
    //   this.BankDetails = result;
    //    this.InterestReportForm.controls.pbankname.setValue('ALL');
    // });

  }

  else {
    this.showCompany = false;
    this.showBank = false;
    //  CLEAR VALIDATION
   // this.InterestReportForm.controls.pbankname.clearValidators();
   // this.InterestReportForm.controls.pbankname.updateValueAndValidity();
    //  CLEAR VALUE
    this.InterestReportForm.controls.pbankname.setValue('');
  }
}
  branchNameChange($event: any) {
    debugger;

    this.intrestpaymentlist = [];
    this.Showmembers = [];
    this.branchname = $event.target.value;

  }
  GetBranchDetailsIP($event: any) {
    debugger;
    this.companyname = $event.target.value;
    const typevalue = $event.target.value;
    // this.InterestReportForm.controls.pbranchnamemain.setValue('');
    // this.intrestpaymentlist = [];
    this.Showmembers = [];
    this._LienEntryService.GetBranchName1(typevalue).subscribe(result => {
      debugger;
      this.BranchDetails = result;
    })
  }

  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.Showmembers, {
  //       // group: this.group,
  //       sort: [{ field: "preceiptdate", dir: "asc" }],
  //     }).data,
  //     //  group: this.group,
  //   };

  //   return result;
  // }
public allData(): ExcelExportData {
  const exportData = this.selectedInterestRows.length > 0
    ? this.selectedInterestRows
    : this.Showmembers;

  const cleanData = exportData.map((item) => {
    const obj = { ...item };
    delete obj.add;
    return obj;
  });

  const result: ExcelExportData = {
    data: process(cleanData, {
      sort: [{ field: "preceiptdate", dir: "asc" }],
    }).data,
  };
  return result;
}

  onFilter(inputValue: string) {

    this.Showmembers = process(this.ShowmembersFil, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pFdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pdepositeamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }



  // onPdfExport(e: any) {
  //   this.pdfData = [...this.Showmembers];
  //   this.pdfData = this.pdfData.sort((a, b) => {
  //     const bankA = (a.bankName || '').trim();
  //     const bankB = (b.bankName || '').trim();

  //     if (!bankA && bankB) return 1;
  //     if (bankA && !bankB) return -1;

  //     return bankA.localeCompare(bankB);
  //   });
  // }

  // exportToExcelSheetJS() {

  //   if (!this.Showmembers || this.Showmembers.length === 0) return;

  //   let excelData: any[] = [];


  //   //  SELF
  //   if (this.paymenttype === 'SELF') {
  //     excelData = this.Showmembers.map((item, index) => ({
  //      "S.No": index + 1,   
  //      "App Id": item.pFdaccountno || '',
  //       "Name": item.pMembername || '',
  //       "Amount": item.pdepositeamount || 0,
  //       "App Date": item.pdepositedate || '',
  //       "Maturity Date": item.pmaturitydate || '',
  //       "Branch Name": item.pChitBranchName || '',
  //       "Ext Ret Rate": item.pinterestrate || 0,
  //       "Ext Ret Amount": item.pIntrestamount || 0,
  //       "TDS Amount": item.pTdsamount || 0,
  //       "Extra Ret Net Pay": item.ptotalamount || 0,
  //       "Bank Account.No": item.accountNumber || '',
  //       "IFSC Code": item.pifsccode || '',
  //       "Bank Name": item.bankName || '',
  //       "Bank Branch Name": item.branch || '',
  //     }));
  //   }

  //   //  ADJUSTMENT
  //   else if (this.paymenttype === 'ADJUSTMENT') {
  //     excelData = this.Showmembers.map((item,index) => ({
  //       "S.No": index + 1, 
  //       "App Id": item.pFdaccountno || '',
  //       "Name": item.pMembername || '',
  //       "Amount": item.pdepositeamount || 0,
  //       "App Date": item.pdepositedate || '',
  //       "Maturity Date": item.pmaturitydate || '',
  //       "Branch Name": item.pChitBranchName || '',
  //       "Ext Ret Rate": item.pinterestrate || 0,
  //       "Ext Ret Amount": item.pIntrestamount || 0,
  //       "TDS Amount": item.pTdsamount || 0,
  //       "Net Ext. Pay": item.ptotalamount || 0,
  //       "Company": item.companySplit || '',
  //       "Branch": item.branchSplit || '',
  //       "Group Code": item.groupCodeSplit || ''
  //     }));
  //   }

  //   //  ALL
  //   else {
  //     excelData = this.Showmembers.map((item, index) => ({
  //       "S.No": index + 1, 
  //       "App Id": item.pFdaccountno || '',
  //       "Name": item.pMembername || '',
  //       "Amount": item.pdepositeamount || 0,
  //       "App Date": item.pdepositedate || '',
  //       "Maturity Date": item.pmaturitydate || '',
  //       "Branch Name": item.pChitBranchName || '',
  //       "Ext Ret Rate": item.pinterestrate || 0,
  //       "Ext Ret Amount": item.pIntrestamount || 0,
  //       "TDS Amount": item.pTdsamount || 0,
  //       "Extra Ret Net Pay": item.ptotalamount || 0,
  //       "Bank Name": item.bankName || '',
  //       "Bank Branch Name": item.branch || '',
  //       "Bank Account.No": item.accountNumber || '',
  //       "IFSC Code": item.pifsccode || '',
  //       "Net Ext. Pay": item.ptotalamount || 0,
  //       "Company": item.companySplit || '',
  //       "Branch": item.branchSplit || '',
  //       "Group Code": item.groupCodeSplit || ''
  //     }));
  //   }

  //   //  TOTAL ONLY FOR AMOUNT COLUMNS
  //   const totals: any = {};
  //   const keys = Object.keys(excelData[0]);

  //   const totalColumns = [
  //     "Ext Ret Amount",
  //     "TDS Amount",
  //     "Extra Ret Net Pay",
  //     "Net Ext. Pay"
  //   ];

  //   keys.forEach(k => {
  //     totals[k] = totalColumns.indexOf(k) !== -1 ? excelData.reduce((s, r) => s + (Number(r[k]) || 0), 0) : '';
  //   });

  //   totals["Name"] = "TOTAL";

  //   //  EMPTY ROW
  //   const emptyRow: any = {};
  //   keys.forEach(k => emptyRow[k] = '');

  //   //  ADD GAP + TOTAL
  //   excelData.push(emptyRow);
  //   excelData.push(totals);

  //   //  CREATE SHEET
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  //   // COLUMN WIDTH
  //   const colWidths = keys.map(key => {
  //     const values = excelData.map(row => row[key]);
  //     const maxLength = Math.max(
  //       key.length,
  //       ...values.map(v => v ? v.toString().length : 0)
  //     );
  //     const isNumberColumn = values.every(v => !isNaN(v));
  //     if (isNumberColumn) {
  //       // numbers (tight)
  //       return { wch: Math.min(Math.max(maxLength + 2, 10), 18) };
  //     }
  //     //  text columns (more space)
  //     if (maxLength > 20) {
  //       return { wch: Math.min(maxLength + 5, 50) };
  //     }
  //     //  medium columns
  //     return { wch: Math.min(Math.max(maxLength + 3, 12), 30) };

  //   });
  //   ws['!cols'] = colWidths;

  //   //  HEADER SIMPLE FORMAT
  //   Object.keys(ws).forEach(cell => {
  //     if (cell[0] === '!') return;

  //     const cellRef = XLSX.utils.decode_cell(cell);

  //     if (cellRef.r === 0) {
  //       ws[cell].v = "  " + ws[cell].v.toString().toUpperCase();
  //     }
  //   });

  //   //  LOCK ALL CELLS (IMPORTANT)
  //   Object.keys(ws).forEach(cell => {
  //     if (cell[0] === '!') return;

  //     if (!ws[cell].s) ws[cell].s = {};
  //     ws[cell].s.protection = { locked: true };
  //   });

  //   // PROTECT SHEET
  //   ws['!protect'] = {
  //     password: '123',
  //     selectLockedCells: true,
  //     selectUnlockedCells: false
  //   };

  //   //  FREEZE HEADER
  //   ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  //   //  EXPORT
  //   const wb: XLSX.WorkBook = {
  //     Sheets: { 'Interest Report': ws },
  //     SheetNames: ['Interest Report']
  //   };

  //   const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  //   const blob = new Blob([buffer], { type: 'application/octet-stream' });

  //   saveAs(blob, 'Interest_Report.xlsx');
  // }

//   onPdfExport(e: any) {
//   this.pdfData = [...this.getInterestExportData()].sort((a, b) => {
//     const bankA = (a.bankName || '').trim();
//     const bankB = (b.bankName || '').trim();
//     if (!bankA && bankB) return 1;
//     if (bankA && !bankB) return -1;
//     return bankA.localeCompare(bankB);
//   });

//   const originalData = [...this.Showmembers];
//   const originalGroup = [...this.group]; // ← save current grouping

//   this.group = [];                        // ← clear grouping before PDF renders
//   this.Showmembers = [...this.pdfData];

//  setTimeout(() => {
//     this.Showmembers = originalData;
//     this.group = originalGroup;
//   }, 5000); 
// }

onPdfExport() {
 debugger;
  const exportData = this.selectedInterestRows.length > 0
    ? [...this.selectedInterestRows]
    : [...this.Showmembers];

  const sortedData = exportData
    .map(({ add, ...rest }) => rest)
    .sort((a, b) => {
      const bankA = (a.bankName || '').trim();
      const bankB = (b.bankName || '').trim();
      if (!bankA && bankB) return 1;
      if (bankA && !bankB) return -1;
      return bankA.localeCompare(bankB);
    });

  const originalData = [...this.gridDisplayData];
  const originalGroup = [...this.group];

  
   this.loading = true;
  // hide checkbox column first
  this.isPdfExporting = true;
  this.gridDisplayData = sortedData;
  this.group = [];

  // force DOM to update before PDF renders
  this.cdr.detectChanges();

  // trigger PDF after DOM is updated
  setTimeout(() => {
    this.kendoGrid.saveAsPDF();

    // restore grid after PDF is triggered
    setTimeout(() => {
      this.isPdfExporting = false;
      this.gridDisplayData = originalData;
      this.group = originalGroup;
      this.cdr.detectChanges();
      this.loading = false;
    }, 200);
  }, 100);
}

exportToExcelSheetJS() {
  const exportData = this.selectedInterestRows.length > 0
    ? this.selectedInterestRows
    : this.Showmembers;

  if (!exportData || exportData.length === 0) return;

  let excelData: any[] = [];

  if (this.paymenttype === 'SELF') {
    excelData = exportData.map((item, index) => ({
      "S.No": index + 1,
      "App Id": item.pFdaccountno || '',
      "Name": item.pMembername || '',
      "Amount": item.pdepositeamount || 0,
      "App Date": item.pdepositedate || '',
      "Maturity Date": item.pmaturitydate || '',
      "Branch Name": item.pChitBranchName || '',
      "Ext Ret Rate": item.pinterestrate || 0,
      "Ext Ret Amount": item.pIntrestamount || 0,
      "TDS Amount": item.pTdsamount || 0,
      "Extra Ret Net Pay": item.ptotalamount || 0,
      "Bank Account.No": item.accountNumber || '',
      "IFSC Code": item.pifsccode || '',
      "Bank Name": item.bankName || '',
      "Bank Branch Name": item.branch || '',
    }));
  } else if (this.paymenttype === 'ADJUSTMENT') {
    excelData = exportData.map((item, index) => ({
      "S.No": index + 1,
      "App Id": item.pFdaccountno || '',
      "Name": item.pMembername || '',
      "Amount": item.pdepositeamount || 0,
      "App Date": item.pdepositedate || '',
      "Maturity Date": item.pmaturitydate || '',
      "Branch Name": item.pChitBranchName || '',
      "Ext Ret Rate": item.pinterestrate || 0,
      "Ext Ret Amount": item.pIntrestamount || 0,
      "TDS Amount": item.pTdsamount || 0,
      "Net Ext. Pay": item.ptotalamount || 0,
      "Company": item.companySplit || '',
      "Branch": item.branchSplit || '',
      "Group Code": item.groupCodeSplit || ''
    }));
  } else {
    excelData = exportData.map((item, index) => ({
      "S.No": index + 1,
      "App Id": item.pFdaccountno || '',
      "Name": item.pMembername || '',
      "Amount": item.pdepositeamount || 0,
      "App Date": item.pdepositedate || '',
      "Maturity Date": item.pmaturitydate || '',
      "Branch Name": item.pChitBranchName || '',
      "Ext Ret Rate": item.pinterestrate || 0,
      "Ext Ret Amount": item.pIntrestamount || 0,
      "TDS Amount": item.pTdsamount || 0,
      "Extra Ret Net Pay": item.ptotalamount || 0,
      "Bank Name": item.bankName || '',
      "Bank Branch Name": item.branch || '',
      "Bank Account.No": item.accountNumber || '',
      "IFSC Code": item.pifsccode || '',
      "Net Ext. Pay": item.ptotalamount || 0,
      "Company": item.companySplit || '',
      "Branch": item.branchSplit || '',
      "Group Code": item.groupCodeSplit || ''
    }));
  }

  const keys = Object.keys(excelData[0]);

  const totalColumns = [
    "Ext Ret Amount",
    "TDS Amount",
    "Extra Ret Net Pay",
    "Net Ext. Pay"
  ];

  const totals: any = {};
  keys.forEach(k => {
    totals[k] = totalColumns.includes(k)
      ? excelData.reduce((s, r) => s + (Number(r[k]) || 0), 0)
      : '';
  });
  totals["Name"] = "TOTAL";

  const emptyRow: any = {};
  keys.forEach(k => emptyRow[k] = '');

  excelData.push(emptyRow);
  excelData.push(totals);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  const colWidths = keys.map(key => {
    const values = excelData.map(row => row[key]);
    const maxLength = Math.max(
      key.length,
      ...values.map(v => v ? v.toString().length : 0)
    );
    const isNumberColumn = values.every(v => !isNaN(v));
    if (isNumberColumn) {
      return { wch: Math.min(Math.max(maxLength + 2, 10), 18) };
    }
    if (maxLength > 20) {
      return { wch: Math.min(maxLength + 5, 50) };
    }
    return { wch: Math.min(Math.max(maxLength + 3, 12), 30) };
  });
  ws['!cols'] = colWidths;

  Object.keys(ws).forEach(cell => {
    if (cell[0] === '!') return;
    const cellRef = XLSX.utils.decode_cell(cell);
    if (cellRef.r === 0) {
      ws[cell].v = "  " + ws[cell].v.toString().toUpperCase();
    }
  });

  Object.keys(ws).forEach(cell => {
    if (cell[0] === '!') return;
    if (!ws[cell].s) ws[cell].s = {};
    ws[cell].s.protection = { locked: true };
  });

  ws['!protect'] = {
    password: '123',
    selectLockedCells: false,
    selectUnlockedCells: false
  };

  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  const wb: XLSX.WorkBook = {
    Sheets: { 'Interest Report': ws },
    SheetNames: ['Interest Report']
  };

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, 'Interest_Report.xlsx');
}


exportBankPrint() {
  if (this.paymenttype !== 'SELF') return;

  const exportData = this.selectedInterestRows.length > 0
    ? this.selectedInterestRows
    : this.Showmembers;

  if (!exportData || exportData.length === 0) return;

  const excelData = exportData.map((item, index) => ({
    "S.No": index + 1,
    "Name": item.pMembername || '',
    "Extra Ret Net Pay": item.ptotalamount || 0,
    "Bank Account.No": item.accountNumber || '',
    "IFSC Code": item.pifsccode || '',
    "Bank Name": item.bankName || '',
    "Bank Branch Name": item.branch || '',
  }));

  const keys = Object.keys(excelData[0]);
  const totalColumns = ["Extra Ret Net Pay"];

  const totals: any = {};
  keys.forEach(k => {
    totals[k] = totalColumns.includes(k)
      ? excelData.reduce((s, r) => s + (Number(r[k]) || 0), 0)
      : '';
  });
  totals["Name"] = "TOTAL";

  const emptyRow: any = {};
  keys.forEach(k => emptyRow[k] = '');

  excelData.push(emptyRow);
  excelData.push(totals);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  Object.keys(ws).forEach(cell => {
    if (cell[0] === '!') return;
    if (!ws[cell].s) ws[cell].s = {};
    ws[cell].s.alignment = { horizontal: 'center', vertical: 'center' };
  });

  ws['!cols'] = [
    { wch: 8 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 28 },
    { wch: 25 }
  ];

  Object.keys(ws).forEach(cell => {
    if (cell[0] === '!') return;
    const cellRef = XLSX.utils.decode_cell(cell);
    if (cellRef.r === 0) {
      ws[cell].v = "  " + ws[cell].v.toString().toUpperCase();
    }
  });

  Object.keys(ws).forEach(cell => {
    if (cell[0] === '!') return;
    if (!ws[cell].s) ws[cell].s = {};
    ws[cell].s.protection = { locked: true };
  });

  ws['!protect'] = { password: '123', selectLockedCells: false, selectUnlockedCells: false };
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  const wb: XLSX.WorkBook = {
    Sheets: { 'Interest_Report': ws },
    SheetNames: ['Interest_Report']
  };

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, 'Interest_Report.xlsx');
}


onBankSelect(item: any) {
  this.updateBanknameControl();
  this.gridDisplayData = [];
  this.Showmembers = [];
  this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.totalinterestamount = 0;
  this.totaltdsamount = 0;
  this.nettotalamount = 0;
}

onBankDeSelect(item: any) {
  this.updateBanknameControl();
  this.gridDisplayData = [];
  this.Showmembers = [];
  this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.totalinterestamount = 0;
  this.totaltdsamount = 0;
  this.nettotalamount = 0;
}

onBankSelectAll(items: any[]) {
  this.selectedBanks = items;
  this.updateBanknameControl();
  this.gridDisplayData = [];
  this.Showmembers = [];
  this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.totalinterestamount = 0;
  this.totaltdsamount = 0;
  this.nettotalamount = 0;
}

onBankDeSelectAll(items: any[]) {
  this.selectedBanks = [];
  this.InterestReportForm.controls.pbankname.setValue('');
  this.gridDisplayData = [];
  this.Showmembers = [];
  this.selectedInterestRows = [];
  this.allInterestRowsSelected = false;
  this.totalinterestamount = 0;
  this.totaltdsamount = 0;
  this.nettotalamount = 0;
}

updateBanknameControl() {
  if (this.selectedBanks.length === 0) {
    this.InterestReportForm.controls.pbankname.setValue('');
  } else {
    // Join selected bank names as comma-separated string
    const bankNames = this.selectedBanks.map(b => b.pBankName).join(',');
    this.InterestReportForm.controls.pbankname.setValue(bankNames);
  }
}


selectInterestRow(event: any, dataItem: any, rowIndex: number) {
  const matchMember = this.Showmembers.find(r => r.pFdaccountno === dataItem.pFdaccountno);
  if (matchMember) matchMember.add = event.target.checked;

  const matchGrid = this.gridDisplayData.find(r => r.pFdaccountno === dataItem.pFdaccountno);
  if (matchGrid) matchGrid.add = event.target.checked;
  //dataItem.add = event.target.checked;

  if (event.target.checked) {
    if (!this.selectedInterestRows.find(r => r.pFdaccountno === dataItem.pFdaccountno)) {
      this.selectedInterestRows.push(matchMember || dataItem);
    }
    this.allInterestRowsSelected = this.Showmembers.every(r => r.add === true);
  } else {
    this.selectedInterestRows = this.selectedInterestRows.filter(
      row => row.pFdaccountno !== dataItem.pFdaccountno
    );
    this.allInterestRowsSelected = false;
  }

  if (this.selectedInterestRows.length > 0) {
    // SELECTED rows totals
    this.totalinterestamount = this.selectedInterestRows.reduce(
      (sum, c) => sum + Number(c.pIntrestamount || 0), 0
    );
    this.totaltdsamount = this.selectedInterestRows.reduce(
      (sum, c) => sum + Number(c.pTdsamount || 0), 0
    );
    this.nettotalamount = this.selectedInterestRows.reduce(
      (sum, c) => sum + Number(c.ptotalamount || 0), 0
    );
  } else {
    // NONE SELECTED — show full grid totals
    this.totalinterestamount = this.Showmembers.reduce(
      (sum, c) => sum + Number(c.pIntrestamount || 0), 0
    );
    this.totaltdsamount = this.Showmembers.reduce(
      (sum, c) => sum + Number(c.pTdsamount || 0), 0
    );
    this.nettotalamount = this.Showmembers.reduce(
      (sum, c) => sum + Number(c.ptotalamount || 0), 0
    );
  }
}


selectAllInterestRows(event: any, dataItem: any, rowIndex: number) {
  this.allInterestRowsSelected = event.target.checked;

  this.Showmembers = this.Showmembers.map(row => ({ ...row, add: event.target.checked }));
  this.gridDisplayData = [...this.Showmembers];

  if (event.target.checked) {
    this.selectedInterestRows = [...this.Showmembers];
  } else {
    this.selectedInterestRows = [];
  }

  this.totalinterestamount = this.Showmembers.reduce((sum, c) => sum + Number(c.pIntrestamount || 0), 0);
  this.totaltdsamount = this.Showmembers.reduce((sum, c) => sum + Number(c.pTdsamount || 0), 0);
  this.nettotalamount = this.Showmembers.reduce((sum, c) => sum + Number(c.ptotalamount || 0), 0);
}

onExcelExport() {
  const exportData = this.selectedInterestRows.length > 0
    ? [...this.selectedInterestRows]
    : [...this.Showmembers];

  const cleanData = exportData.map((item) => {
    const obj = { ...item };
    delete obj.add;
    return obj;
  });

  const originalData = [...this.gridDisplayData];

  this.loading = true;
  // hide checkbox column
  this.isExcelExporting = true;
  this.gridDisplayData = cleanData;

  // force DOM update
  this.cdr.detectChanges();

  // trigger excel after DOM updates
  setTimeout(() => {
    this.kendoGrid.saveAsExcel();

    // restore grid after excel triggered
    setTimeout(() => {
      this.isExcelExporting = false;
      this.gridDisplayData = originalData;
      this.cdr.detectChanges();
      this.loading = false;
    }, 200);
  }, 100);
}


}



