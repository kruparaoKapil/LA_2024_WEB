import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-gst-report-new',
  templateUrl: './gst-report-new.component.html',
  styles: []
})
export class GstReportNewComponent implements OnInit {
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  gstReportForm: FormGroup;
  public paymentsDateHide = true;
  public submitted = false;
  gridData: any = [];
  public RadioStatus: any;
  // public dipositdatehide = true;
  public ledgeraccountslist: any = [];
  public summaryGridData: any = [];
  public payemntsDataList: any = [];
  public today: Date = new Date();
  formValidationMessages: any;
  public isLoading = false;
  isLoading1 = false;
  gstPrintFlag: boolean = false;
  gstSummaryFlag: boolean = false;
  paymentGridFlag: boolean = false;
  isReceiptsDisabled :boolean  = true;

  constructor(private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService, private datePipe: DatePipe) {
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'MMM-YYYY';
    const newdate = new Date();
    this.dpConfig1.maxDate = new Date(newdate.setMonth(newdate.getMonth() - 0));
    this.dpConfig1.showWeekNumbers = false;

    this.dpConfig2.containerClass = 'theme-dark-blue';
    this.dpConfig2.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig2.maxDate = new Date();
    this.dpConfig2.showWeekNumbers = false;

    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    //this.submitted = false;
    this.gstReportForm = this.formbuilder.group({
      ChkrbtType: ['2', Validators.required],
      debitparentid: ['', Validators.required],
      forthemonth: [this.today, Validators.required],
      fromdate: [this.today],
      todate: [this.today],
    })
    this.gstReportForm.controls.ChkrbtType.setValue('2');
    this.Isseleted();

    this.getLoadData();
    this.formValidationMessages = {};

  }

  Isseleted() {
    debugger;
    this.paymentGridFlag = false;
    this.gstSummaryFlag = false;
    this.gstPrintFlag = false;
    let rdbType = this.gstReportForm.controls.ChkrbtType.value;
    this.gstReportForm.controls.debitparentid.setValue('');
    this.gstReportForm.controls.forthemonth.setValue('');
    this.gstReportForm.controls.fromdate.setValue(new Date());
    this.gstReportForm.controls.todate.setValue(new Date());
    if (rdbType == "1") {
      this.summaryGridData = [];
      this.RadioStatus = "Receipts";
      this.paymentsDateHide = true;
    }
    else {
      this.summaryGridData = [];
      this.payemntsDataList = [];
      this.RadioStatus = "Payments";
      this.paymentsDateHide = false;
    }
  }

  public getLoadData() {
    debugger
    this._reportservice.GetAccountledger().subscribe(json => {

      let JSONDATA = json
      if (json != null) {
        this.ledgeraccountslist = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  dateChnage(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  checkingfrommdate(container) {
    debugger
    const newdate = new Date();
    let lm = new Date(newdate.setMonth(newdate.getMonth() - 0));
    if (container > lm) {
      this.gstReportForm.controls.forthemonth.setValue(lm);
      this._CommonService.showWarningMessage("Only Current Month Can be Selected");
    }


  }


  getGstPrint() {
    //this.isLoading = true;
    this.gstPrintFlag = true;
    this.gstSummaryFlag = false;
    this.paymentGridFlag = false;


  }
  getGstSummary() {
    debugger;
    let isvalid = true;
    if (this.checkValidations(this.gstReportForm, isvalid)) {
      this.isLoading1 = true;

      this.gstSummaryFlag = true;
      this.gstPrintFlag = false;
      this.paymentGridFlag = false;




      this.summaryGridData = [{
        "company": "Ramya", "state": "Telangana", "transtype": "CR", "fromno": "CR37958/23", "tono": "CR37965/23", "count": 1
      }]
    }
  }
  getPayments() {
    debugger;
    this.paymentGridFlag = true;
    this.gstSummaryFlag = false;
    this.gstPrintFlag = false;

    let fromdate = this.datePipe.transform(this.gstReportForm.controls.fromdate.value, "dd-MMM-yyyy");;
    let todate = this.datePipe.transform(this.gstReportForm.controls.todate.value, "dd-MMM-yyyy");;
    this._reportservice.Getgstreport(fromdate, todate).subscribe(data => {
      this.paymentGridFlag = true;
      this.gstSummaryFlag = false;
      this.gstPrintFlag = false;
      this.payemntsDataList = data;
      this.payemntsDataList.forEach(item => {
        const [day, month, yearTime] = item.pgstvoucherdate.split('-');
        const [year, time] = yearTime.split(' ');
        item.pgstvoucherdate = new Date(`${year}-${month}-${day}T${time || '00:00:00'}`);
      });
    })
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.payemntsDataList,{}).data,
    };
      return result;
   }

  // VALIDATIONS

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
        formcontrol = <FormGroup>this.gstReportForm['controls']['ppaymentsslistcontrols'].get(key);
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
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
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

}
