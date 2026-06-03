import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-brs-reports',
  templateUrl: './brs-reports.component.html',
  styles: []
})
export class BRSReportsComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  gridview: any = [];
  Type: any;
  bankCreditView: boolean = false;
  bankDebitView: boolean = false;
  bankJvView: boolean = false;
  public today: Date = new Date();
  brsReportForm: FormGroup;
  public isLoading = false;
  public loading = false;
  IssuedChequeValidation: any = {};
  public BanksList: any = [];
  gridData: any = [];
  bankId: any;
  ChequesClearReturnData = [];
  public group: GroupDescriptor[] = [{ field: 'pchequestatus' }];
  public hdnpPaymentstatus = true;
  jvdataView: boolean = false;
  jvgriddataView: any = [];
  from_date: any;
  to_date: any;


  constructor(private formbuilder: FormBuilder, private _CommonService: CommonService, private _accountingtransaction: AccountingTransactionsService, private datepipe: DatePipe) {

    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;

    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    this.Type = 'BANKCREDIT';

    this.brsReportForm = this.formbuilder.group({
      fromDate: [this.today],
      toDate: [this.today],
      pbankname: ['', Validators.required],
    })

    this.bankCreditClick();
    this.GetBanksList();
    this.BlurEventAllControll(this.brsReportForm);

  }

  bankCreditClick() {
    debugger;
    this.Type = "BANKCREDIT";
    this.gridData = [];
    this.jvgriddataView = []
    this.bankCreditView = true;
    this.bankDebitView = false;
    this.jvdataView = false;
    this.brsReportForm.controls.pbankname.setValue('');
    this.brsReportForm.controls.fromDate.setValue(this.today);
    this.brsReportForm.controls.toDate.setValue(this.today);
    this.IssuedChequeValidation.pbankname = '';
    this.gridData = [];
  }

  bankDebitClick() {
    debugger
    this.Type = "BANKDEBIT";
    this.gridData = [];
    this.jvgriddataView = []
    this.bankCreditView = false;
    this.bankDebitView = true;
    this.jvdataView = false;
    this.brsReportForm.controls.pbankname.setValue('');
    this.brsReportForm.controls.fromDate.setValue(this.today);
    this.brsReportForm.controls.toDate.setValue(this.today);
    this.IssuedChequeValidation.pbankname = '';
    this.gridData = [];
  }

  // jvDataClick() {
  //   debugger
  //   this.Type = "JVDATA";
  //   this.bankCreditView = false;
  //   this.bankDebitView = false;
  //   this.jvdataView = true;
  //   this.brsReportForm.controls.pbankname.setValue('');
  //   this.brsReportForm.controls.fromDate.setValue(this.today);
  //   this.brsReportForm.controls.toDate.setValue(this.today);
  //   this.IssuedChequeValidation.pbankname = '';
  //   this.gridData = [];
  // }

  jvDataClick() {
    this.Type = "BANKJV";
    this.gridData = [];
    this.jvgriddataView = []
    this.bankCreditView = false;
    this.bankDebitView = false;
    this.bankJvView = true;
    this.brsReportForm.controls.pbankname.setValue('');
    this.brsReportForm.controls.fromDate.setValue(this.today);
    this.brsReportForm.controls.toDate.setValue(this.today);
    this.IssuedChequeValidation.pbankname = '';

  }

  GetBanksList() {
    debugger;
    this._accountingtransaction.GetBanksList().subscribe(bankslist => {
      this.BanksList = bankslist;
    })
  }

  BankName_Change(event) {
    debugger
    this.bankId = event.pbankid
  }

  public ToDateChange(event) {
    debugger
    this.dpConfig1.minDate = event;
  }
  public FromDateChange(event) {
    debugger
    this.dpConfig.maxDate = event;
  }

  // brsReports() {
  //   debugger;
  //   let isValid = true;
  //   if (this.checkValidations(this.brsReportForm, isValid)) {
  //     this.loading = true
  //     this.isLoading = true;
  //     let from_date = this.datepipe.transform(this.brsReportForm.controls.fromDate.value, 'yyyy-MM-dd');
  //     let to_date = this.datepipe.transform(this.brsReportForm.controls.toDate.value, 'yyyy-MM-dd');

  //     if (this.bankCreditView == false) {

  //       this._accountingtransaction.GetBrsstatementdeposite(from_date, to_date, this.bankId).subscribe(res => {
  //         this.gridData = res.pchequesOnHandlist;
  //         this.gridview = this.gridData;
  //         console.log(this.gridData);

  //         this.loading = false
  //         this.isLoading = false;
  //       })
  //     }

  //     if (this.bankCreditView == true) {

  //       this._accountingtransaction.GetBrsstatementcredit(from_date, to_date, this.bankId).subscribe(res => {
  //         this.gridData = res.pchequesOnHandlist;
  //         this.gridview = this.gridData;
  //         console.log(this.gridData);
  //         this.loading = false
  //         this.isLoading = false;
  //       })
  //     }

  //   }
  // }


  brsReports() {
    debugger;
    let isValid = true;
    this.gridData = [];
    this.jvgriddataView = []
    if (!this.checkValidations(this.brsReportForm, isValid)) {
      return;
    }

    this.loading = true;
    this.isLoading = true;

    this.from_date = this.datepipe.transform(this.brsReportForm.controls.fromDate.value, 'yyyy-MM-dd');
    this.to_date = this.datepipe.transform(this.brsReportForm.controls.toDate.value, 'yyyy-MM-dd');

    let apiCall;

    if (this.bankCreditView) {
      debugger;
      apiCall = this._accountingtransaction.GetBrsstatementcredit(this.from_date, this.to_date, this.bankId);
    } else if (this.bankDebitView) {
      debugger;
      apiCall = this._accountingtransaction.GetBrsstatementdeposite(this.from_date, this.to_date, this.bankId);
    } else if (this.bankJvView) {
      debugger;
      apiCall = this._accountingtransaction.GetBrsstatementJv(this.from_date, this.to_date, this.bankId)
    } else {
      this.loading = false;
      this.isLoading = false;
      return;
    }

    // apiCall.subscribe(
    //   (res: any) => {
    //     this.gridData = res.pchequesOnHandlist;
    //     this.gridview = this.gridData;
    //     this.jvgriddataView=this.gridData
    //     console.log('griddata:',this.gridData);
    //     this.loading = false;
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     // console.error(err);
    //     this._CommonService.showWarningMessage('No Data To Show')
    //     this.loading = false;
    //     this.isLoading = false;
    //   }
    // );
    apiCall.subscribe(res => {
      this.gridData = res.pchequesOnHandlist;
      if (this.gridData !== 0) {
        // this.gridData = res.pchequesOnHandlist;
        this.gridview = this.gridData;
        this.jvgriddataView = this.gridData
        console.log('griddata:', this.gridData);
        this.loading = false;
        this.isLoading = false;
      }
      else {
        this._CommonService.showWarningMessage('No Data To Show For The  Date Of' + ' ' + this.from_date)
        this.loading = false;
        this.isLoading = false;
      }
    });
  }

  onFilter(inputValue: string) {
    debugger
    this.gridData = process(this.gridview, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pLiendate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pDepositdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLienamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pCompanybranch',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLienadjuestto',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {

      }).data,
    };

    return result;
  }

  // VALIDATIONS

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
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
          this.IssuedChequeValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.IssuedChequeValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
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
      this._CommonService.showErrorMessage(e);
      return false;
    }



  }


}
