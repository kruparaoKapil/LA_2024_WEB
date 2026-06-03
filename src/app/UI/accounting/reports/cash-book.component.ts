import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { CashbookService } from 'src/app/Services/Accounting/cashbook.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor,SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styles: []
})
export class CashBookComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public loading = false;
  public hdnTranDate = true;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public startDate: any = new Date();
  public startDates: any;
  public bsRangeValue: Date[];
  public endDate: any = new Date();
  public endDates: any;
  public temppsubarray = [];
  public gridView: any[];
  public CashBookReportForm: FormGroup;
  public typeOfSelect: any;
  public submitted = false;
  hidetransactiondate = true;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public ptranstype: any;
  public groups: GroupDescriptor[] = [{ field: 'ptransactiondate' }];
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _cashBookService: CashbookService, private toastr: ToastrService) {
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
    this.startDate = this.datePipe.transform(this.startDate, "dd-MMM-yyyy");
    this.endDate = this.datePipe.transform(this.endDate, "dd-MMM-yyyy");
    this.CashBookReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      ptranstype: ['BOTH', Validators.required]

    })

    this.cashBookData();
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {
      }).data
    };

    return result;
  }
 

  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public BlurEventAllControll(fromgroup: FormGroup) {
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
  public setBlurEvent(fromgroup: FormGroup, key: string) {
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
  public onChange(dataSorting) {
    let tempStartDate = this.datePipe.transform(dataSorting[0], "yyyy-MM-dd");
    this.startDates = this.datePipe.transform(tempStartDate, "dd-MM-yyyy");
    let tempEndDate = this.datePipe.transform(dataSorting[1], "yyyy-MM-dd");
    this.endDates = this.datePipe.transform(tempEndDate, "dd-MM-yyyy");
  }

  get f() { return this.CashBookReportForm.controls; }

  public ToDateChange(event) {
    
    this.dpConfig1.minDate = event;
  }
  public FromDateChange(event) {
    this.dpConfig.maxDate = event;
    //this.CashBookReportForm['controls']['fromDate'].setValue(event)
  }
  public cashBookData() {
    
    this.submitted = true;
    if (this.CashBookReportForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        this.CashBookReportForm.value;
        let fromDate = this.CashBookReportForm['controls']['fromDate'].value;
        let toDate = this.CashBookReportForm['controls']['toDate'].value;
        this.ptranstype = this.CashBookReportForm['controls']['ptranstype'].value;
        fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
        toDate = this.datePipe.transform(toDate, "yyyy-MM-dd");

        this.startDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
        this.endDate = this.datePipe.transform(toDate, "dd-MMM-yyyy");

        this._cashBookService.GetCashBookReportbyDates(this.startDate, this.endDate, this.ptranstype).subscribe(res => {
          this.temppsubarray = res['plstcashbookdata'];
          this.gridView = this.temppsubarray;
          this.gridView = this.gridView.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))
          this.loading = false;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
        },
          (error) => {
            this.showErrorMessage(error);
            this.isLoading = false;
            this.savebutton = 'Generate Report';
            this.loading = false;
          });


      } catch (e) {
        this.showErrorMessage(e);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
    }



  }
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  pdfGenerate() {
    debugger;
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Cash Book</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.pdf();window.download();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  public onFilter(inputValue: string): void {

    this.gridView = process(this.temppsubarray, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'ptransactiondate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptransactionno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pparticulars',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdescription',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }


  click(data) {
    
    if (data.pFormName == "GENERAL VOUCHER") {
      let receipt = btoa(data.ptransactionno);
      window.open('/#/GeneralReceiptReports?id=' + receipt);
    }
    if (data.pFormName == "PAYMENT VOUCHER") {
      let receipt = btoa(data.ptransactionno);
      window.open('/#/PaymentVoucherReports?id=' + receipt);
    }
    if (data.pFormName == "JOURNAL VOUCHER") {
      let receipt = btoa(data.ptransactionno);
      window.open('/#/JournalvoucherReport?id=' + receipt);
    }
    // if(data.pFormName == "CHEQUES IN BANK"){
    //   this._reportservice.GetReferenceNo(data.pFormName,data.ptransactionno).subscribe(referenceno=>{
    //     ;
    //     let id=btoa(referenceno[0]);
    //     window.open('/#/GeneralReceiptReports?id=' + id  );
    //   })
    // }
  }
}
