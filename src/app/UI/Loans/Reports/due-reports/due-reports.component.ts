import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { DuesReportsService } from 'src/app/Services/Loans/Transactions/dues-reports.service';

@Component({
  selector: 'app-due-reports',
  templateUrl: './due-reports.component.html',
  styles: []
})
export class DueReportsComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public startDate: any;
  public DueReportForm: FormGroup;
  public submitted = false;
  public savebutton: any;
  public isLoading = false;
  public loading = false;
  public duesData: any;
  public hdpLoantype=true;
  grouptype="ASON";
  hide=false;
  FromDate ="Date";
  startDatesReport:any;
  endDatesReport:any;
  ShowAsOn=false;
ShowBetween=false;
asondate:any;
from:any;
  to: any;
  public groups: GroupDescriptor[] = [{ field: 'pLoantype' }];
  
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private toastr: ToastrService, private _DueReportsServices: DuesReportsService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    
    this.savebutton = 'Generate Report';
    this.submitted = false;
    this.startDate = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.DueReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate:[this.today]
    })
    let fromDate = this.DueReportForm['controls']['fromDate'].value;
        fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
    this.dueReportData();
  }

  DateChange(event){
    debugger
    this.dpConfig1.minDate = event;
  }

  get f() { return this.DueReportForm.controls; }

  public dueReportData() {
    debugger
    if(this.grouptype=="ASON"){
      this.ShowAsOn=true;
      this.ShowBetween=false;
      this.asondate=this.datePipe.transform(this.DueReportForm.controls.fromDate.value, "dd-MMM-yyyy");
    }
    if(this.grouptype=="BETWEEN"){
      this.ShowAsOn=false;
     this.ShowBetween=true;
      this.from=this.datePipe.transform(this.DueReportForm.controls.fromDate.value, "dd-MMM-yyyy");
      this.to=this.datePipe.transform(this.DueReportForm.controls.toDate.value, "dd-MMM-yyyy");
    }
    this.submitted = true;
    if (this.DueReportForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        this.DueReportForm.value;
        // // let fromDate = this.DueReportForm['controls']['fromDate'].value;
        // // fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
        // this.startDate = this.datePipe.transform(fromDate, "dd-MMM-yyyy");
        let fromdate=this.datePipe.transform(this.DueReportForm.controls.fromDate.value, "yyyy-MM-dd");
        let todate;
        if(this.grouptype=="ASON"){
          //todate=this.datepipe.transform(this.TrialBalanceForm.controls.fromdate.value,'yyyy/MM/dd');
          todate=this.datePipe.transform(this.DueReportForm.controls.fromDate.value, "yyyy-MM-dd");
          this.asondate=this.datePipe.transform(this.DueReportForm.controls.fromDate.value, "dd-MMM-yyyy");
        }
        if(this.grouptype=="BETWEEN"){
          todate=this.datePipe.transform(this.DueReportForm.controls.toDate.value, "yyyy-MM-dd");
         }
         this.startDatesReport=fromdate;
         this.endDatesReport=todate;
        let recordid=0;
        let fieldname="ALL";
        let fieldtype="ALL"
        this._DueReportsServices.GetDueReportByDate(fromdate,todate,recordid,fieldname,fieldtype,this.grouptype).subscribe(res => {
          this.duesData = res;
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

  checkboxChecked(event){
debugger
    if(event.target.checked==true){
     this.hide=false;
     this.grouptype="ASON";
     this.DueReportForm.controls.fromDate.setValue(new Date());
      this.DueReportForm.controls.toDate.setValue("");
      this.FromDate = "Date"
    }
    else{
      this.hide=true;
      this.grouptype="BETWEEN";
      this.DueReportForm.controls.fromDate.setValue(new Date());
      this.DueReportForm.controls.toDate.setValue(new Date());
      this.FromDate = "From Date"
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
          <title>Due Reports</title>
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



}
