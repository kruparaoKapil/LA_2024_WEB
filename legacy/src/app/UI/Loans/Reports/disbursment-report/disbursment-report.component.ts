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
import { DisbursmentReportsService } from 'src/app/Services/Loans/Transactions/disbursment-reports.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Component({
  selector: 'app-disbursment-report',
  templateUrl: './disbursment-report.component.html',
  styles: []
})
export class DisbursmentReportComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public Loantype = true;
  public ApplicantType = false;
  public isLoading = false;
  public loading = false;
  public savebutton = 'Generate Report';
  public DisbursmentReportsForm: FormGroup;
  public submitted = false;
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public disbursedlist: any;
  public loantypelist: any;
  public applicanttypeslist: any;
  public LoantypeSelectValue = 'Loan Type';
  public month: any;
  public gridData: any;
  reportTitle:any;
  public LoanTypeGrid = false;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private toastr: ToastrService, private _DisbursmentReportsService: DisbursmentReportsService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'MMM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;

  }

  ngOnInit() {
    this.submitted = false;
    this.DisbursmentReportsForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required]
    });
    this.GetDisbursedReportData();
  }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  lastDayofmonth: any;
  public GetDisbursedReportData() {
    debugger
    this.LoanTypeGrid = false;
    this.submitted = true;
    if (this.DisbursmentReportsForm.valid) {
      this.gridData = '';
      this.disbursedlist = '';
      this.loantypelist = '';
      this.applicanttypeslist = '';
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        
        this.DisbursmentReportsForm.value;
        let fromDate = this.DisbursmentReportsForm['controls']['fromDate'].value;
        this.month = this.datePipe.transform(fromDate, "MM-yyyy");

        this.lastDayofmonth = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
        let newmonth = this._CommonService.formatDateFromDDMMYYYY('01-' + this.month);
        let Disbursementdata = { pfieldname: '', ptype: '', pfromdate: newmonth, ptodate: this.lastDayofmonth };
        let data = JSON.stringify(Disbursementdata);


        this._DisbursmentReportsService.GetDisbursedReportDetails(data).subscribe(res => {
          
          if (res != null) {
            this.disbursedlist = res['pdisbursedlist'];
            this.loantypelist = res['ploantypeslist'];
            this.applicanttypeslist = res['papplicanttypeslist'];
          }

          this.loading = false;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
        },
          (error) => {
            this.showErrorMessage(error);
            this.loading = false;
            this.isLoading = false;
            this.savebutton = 'Generate Report';
          });
      } catch (e) {
        this.showErrorMessage(e);
        this.loading = false;
        this.isLoading = false;
        this.savebutton = 'Generate Report';
      }
    }

  }

  public LoantypeSelect(type) {
    this.LoanTypeGrid = false;
    this.gridData = '';
    this.LoantypeSelectValue = type;
    this.Loantype = true;
    this.ApplicantType = false;
  }

  public ApplicantTypeSelect(type) {
    this.LoanTypeGrid = false;
    this.gridData = '';
    this.LoantypeSelectValue = type;
    this.Loantype = false;
    this.ApplicantType = true;
  }

  public LoanTypeData(dataItem) {
    this.gridData = '';
    this.loading = true;
    let fieldname = dataItem.ptype;
  
    let newmonth = this._CommonService.formatDateFromDDMMYYYY('01-' + this.month);
    //let selectedmonth = this.datePipe.transform(newmonth, "dd-MMM-yyyy");
    this.reportTitle=fieldname+ '-' + 'Disbursment Report' + ' ' + '(' +'Between:  ' +this.datePipe.transform(newmonth,'dd-MMM-yyyy')+ '  and  '+ this.datePipe.transform(this.lastDayofmonth,'dd-MMM-yyyy')+')'
    let Disbursementdata = { pfieldname: dataItem.ptype, ptype: this.LoantypeSelectValue, pfromdate: newmonth, ptodate: this.lastDayofmonth };
    let data = JSON.stringify(Disbursementdata);
    this._DisbursmentReportsService.GetDisbursedReportDuesDetails(data).subscribe(res => {
      this.gridData = res;
      this.LoanTypeGrid = true;
      this.isLoading = false;
      this.savebutton = 'Generate Report';
      this.loading = false;
    },
      (error) => {
        this.LoanTypeGrid = false;
        this.showErrorMessage(error);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      });

  }

  public ApplicantTypeData(dataItem) {
    debugger
    this.gridData = '';
    this.loading = true;
    let fieldname = dataItem.ptype;
    let newmonth = this._CommonService.formatDateFromDDMMYYYY('01-' + this.month);
    this.reportTitle=fieldname+ '-' + 'Disbursment Report' + ' ' + '(' +'Between:  ' +this.datePipe.transform(newmonth,'dd-MMM-yyyy')+ '  and  '+ this.datePipe.transform(this.lastDayofmonth,'dd-MMM-yyyy')+')'
    let Disbursementdata = { pfieldname: dataItem.ptype, ptype: this.LoantypeSelectValue, pfromdate: newmonth, ptodate: this.lastDayofmonth };
    let data = JSON.stringify(Disbursementdata);

    this._DisbursmentReportsService.GetDisbursedReportDuesDetails(data).subscribe(res => {
      this.gridData = res;
      this.LoanTypeGrid = true;
      this.isLoading = false;
      this.savebutton = 'Generate Report';
      this.loading = false;
    },
      (error) => {
        this.showErrorMessage(error);
        this.isLoading = false;
        this.LoanTypeGrid = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      });

  }
  public group: any[] = [{
    field: 'pvchapplicationid'
  }];
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, { group: this.group, sort: [{ field: 'pvchapplicationid', dir: 'desc' }] }).data,
      group: this.group
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
  public ToDateChange(event) {
    
    this.dpConfig1.minDate = event;
  }


}
