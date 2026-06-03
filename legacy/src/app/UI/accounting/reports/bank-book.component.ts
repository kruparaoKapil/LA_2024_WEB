import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { CashbookService } from 'src/app/Services/Accounting/cashbook.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { BankbookService } from 'src/app/Services/Accounting/bankbook.service';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { Toast, ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor,SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';


@Component({
  selector: 'app-bank-book',
  templateUrl: './bank-book.component.html',
  styles: []
})
export class BankBookComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public hdnTranDate = true;
  public submitted = false;
  public BanknBookReportForm: FormGroup;
  public selectedbank:any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public startDate: any = new Date();
  public startDates: any;
  public bsRangeValue: Date[];
  public endDate: any = new Date();
  public endDates: any;
  public bankData: any;
  public bankname: any;
  public gridView: any;
  public bankid: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public loading = false;
  public groups: GroupDescriptor[] = [{ field: 'ptransactiondate' }];
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _bankBookService: BankbookService, public toaster: ToastrService) {
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
    this.submitted = false;
    // this.startDates = this.datePipe.transform(this.startDate, "dd-MMM-yyyy");
    // this.endDates = this.datePipe.transform(this.endDate, "dd-MMM-yyyy");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "dd-MMM-yyyy");
    this.endDate = this.datePipe.transform(this.endDate, "dd-MMM-yyyy");
    this.BanknBookReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      pbankname: ['', Validators.required]
    })
    this.bankBookDetails();
  }

  public ToDateChange(event) {
    this.dpConfig1.minDate = event;
  }

  public FromDateChange(event) {
    this.dpConfig.maxDate = event;
    //this.BanknBookReportForm['controls']['fromDate'].setValue(event)
  }
  public bankBookDetails() {
    this._bankBookService.GetBankNames().subscribe(res => {
      this.bankData = res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  Bankname(args)
  {
    
    this.selectedbank = args.target.options[args.target.selectedIndex].text
    
    
  }
  
  // public getBankBookData(event: any): void {
  //   this.bankid = event.target.value;
  //   if (this.bankid == '') {
  //     this.toaster.info('please select bank');
  //     this.gridView = [];
  //     return;
  //   }
  //   this.bankname = event.target.options[event.target.selectedIndex].text;
  // }

  get f() { return this.BanknBookReportForm.controls; }
  public getbankBookReports() {
    debugger
    this.submitted = true;
    if (this.BanknBookReportForm.valid) {
      this.loading = true
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        this.BanknBookReportForm.value;
        let fromDate = this.BanknBookReportForm['controls']['fromDate'].value;
        let toDate = this.BanknBookReportForm['controls']['toDate'].value;
        let pbankname = this.BanknBookReportForm['controls']['pbankname'].value;
        fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
        toDate = this.datePipe.transform(toDate, "yyyy-MM-dd");
        this.startDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
        this.endDate = this.datePipe.transform(toDate, "dd-MMM-yyyy");
        this._bankBookService.GetBankBookReportbyDates(fromDate, toDate, pbankname).subscribe(res => 
          {
            this.bankname= this.selectedbank
          this.gridView = res;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
          this.gridView = this.gridView.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))
          this.loading = false;
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

  public print() {
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
  
  // public onChange(dataSorting) {
  //   let tempStartDate = this.datePipe.transform(dataSorting[0], "yyyy-MM-dd");
  //   this.startDate = this.datePipe.transform(dataSorting[0], "yyyy-MM-dd");
  //   this.startDates = this.datePipe.transform(tempStartDate, "dd-MMM-yyyy");
  //   let tempEndDate = this.datePipe.transform(dataSorting[1], "yyyy-MM-dd");
  //   this.endDate = this.datePipe.transform(dataSorting[1], "yyyy-MM-dd");
  //   this.endDates = this.datePipe.transform(tempEndDate, "dd-MMM-yyyy");
  // }


  click(data){
    
    if(data.pFormName == "GENERAL VOUCHER")
    {
      let receipt =btoa(data.ptransactionno); 
    window.open('/#/GeneralReceiptReports?id=' + receipt);
    }
    if(data.pFormName == "PAYMENT VOUCHER"){
      let receipt =btoa(data.ptransactionno); 
      window.open('/#/PaymentVoucherReports?id=' + receipt );
    }
    if(data.pFormName == "JOURNAL VOUCHER"){
      let receipt = btoa(data.ptransactionno); 
      window.open('/#/JournalvoucherReport?id=' + receipt);
    }
    // if(data.pFormName == "CHEQUES IN BANK"){
    //   this._reportservice.GetReferenceNo(data.pFormName,data.ptransactionno).subscribe(referenceno=>{
    //     
    //     let id=btoa(referenceno[0]);
    //     window.open('/#/GeneralReceiptReports?id=' + id  );
    //   })
    // }
  }

  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.gridView, {
  //       group: this.groups,
  //       sort: [{ field: "ptransactiondate", dir: "asc" }],
  //     }).data,
  //     group: this.groups,
  //   };

  //   return result;
  // }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {
        group: this.groups,
        sort: [{ field: "ptransactiondate", dir: "asc" }],
      }).data,
      group: this.groups,
    };

    return result;
  }

}
