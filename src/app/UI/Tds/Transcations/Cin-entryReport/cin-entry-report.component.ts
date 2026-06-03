import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { error } from 'console';


@Component({
  selector: 'app-cin-entry-report',
  templateUrl: './cin-entry-report.component.html',
  styles: []
})
export class CINEntryReportComponent implements OnInit {
  CINEntryReportform: FormGroup
  CommisionPaymentErrors = {};
  frommonthof: any;
  tomonthof: any;
  Betweengrid: any = []
  fromdate: any;
  todate: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  validation: boolean;
  showdate: boolean;
  showdropdown: boolean;
  challanalist: any = [];
  showchalanagrid: boolean
  gridData: any = []
  public today: Date = new Date();
  challanano: any;
  showbetweendates: boolean = false
  total: any;
  totalamount: any = 0;
  totaltdsamount: any = 0;
  loading: boolean = false;
  todate2:any;
  public groups: GroupDescriptor[] = [{ field: 'pChallanaNo', aggregates: [{ field: "pAmount", aggregate: "sum" }, { field: "pTdsAmount", aggregate: "sum" }] }];

  constructor(private CommissionFormBuilder: FormBuilder, private tdsreportservice: TdsreportService, private _CommonService: CommonService, private datePipe: DatePipe) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;

    this.allData = this.allData.bind(this);
    this.allData1 = this.allData1.bind(this);
  }

  ngOnInit() {
    debugger
    this.Formgroup()
    this.showdropdown = true;
    this.showdate = false;
    this.showbetweendates = false;
    this.showchalanagrid = true;
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.GetCinEntryChallanaNumbers();
    this.BlurEventAllControll(this.CINEntryReportform)
  }
  Formgroup() {
    this.CINEntryReportform = this.CommissionFormBuilder.group({

      date: [''],
      pChallanaNo: ['', Validators.required],
      pFromDate: [this.today],
      pToDate: [this.today],
      pChallanaId: [''],


      ptypeofoperation: ['CREATE']

    })
  }
  GetCinEntryChallanaNumbers() {


    this.tdsreportservice.GetCinEntryChallanaNumbers().subscribe(json => {
      this.challanalist = json;

    })
  }
  challanachange(event) {
    debugger;
    if (!isNullOrUndefined(event)) {
      this.challanano = event.pChallanaNo
    }
    else {
      this.gridData = []
    }


  }
  GetCinEntryData() {
    debugger
    let isValid = true;
    this.loading = true;
    this.GetValidationByControl(this.CINEntryReportform, 'pChallanaNo', true);
    this.totalamount = 0;
    this.totaltdsamount = 0;
    if (!isNullOrUndefined(this.challanano) && !isNullOrEmptyString(this.challanano)) {
      this.tdsreportservice.GetGridByChallanaNo(this.challanano).subscribe(json => {
        if (json) {
          debugger;
          this.gridData = json;
          console.log("grid 1", json);
          this.loading=false;
          this.challanano = "";
          this.showbetweendates = false
          if (this.gridData.length != 0) {

            this.totalamount = this.gridData.reduce((sum, c) => sum + Number(c.pAmount), 0).toFixed(2);
            this.totaltdsamount = this.gridData.reduce((sum, c) => sum + Number(c.pActualTdsAmount), 0).toFixed(2);
          }

        }
        else {
          this.gridData = []
        }

      })
    }
    else {
      let fromdate = this.datePipe.transform(this.CINEntryReportform
      ['controls']['pFromDate'].value, "dd-MMM-yyyy");
      let todate = this.datePipe.transform(this.CINEntryReportform['controls']['pToDate'].value, "dd-MMM-yyyy");
      this.frommonthof = fromdate;
      this.todate2=todate
      //sir this.tdsreportservice.GetCinEntryReportsBetweenDates(fromdate,todate).subscribe(
      //   json=>
      //   {
      //     if(json)
      //     {
      //       this.showbetweendates=true;
      //       this.Betweengrid=json;
      //       console.log("grid 2",json);
      //       this.total = this.Betweengrid.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
      //       this.CINEntryReportform.controls.pTotalpaymentamount.setValue(this.total);
      //     }
      //     else{
      //       this.Betweengrid=[]
      //     }
      // })
      //bhargavi start
      this.tdsreportservice.GetCinEntryReportsBetweenDates(fromdate, todate).subscribe(res => {
        debugger;
        this.loading = false;
        this.Betweengrid = res;
        if(this.Betweengrid != null && this.Betweengrid.length !== 0){
           this.showbetweendates=true;
            console.log("grid 2",this.Betweengrid);
            this.total = this.Betweengrid.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
            this.CINEntryReportform.controls.pTotalpaymentamount.setValue(this.total);
        }
        else{
          this._CommonService.showWarningMessage('No Data To Show For The Date of' + ' ' + fromdate);
          this.loading=false;
        }
        
      },(error)=>{
        this._CommonService.showErrorMessage(error);
        this.loading=false;
      })
      //bhargavi end

    }









  }
  FromDateChange(event) {
    debugger;
    this.gridData = [];


    this.frommonthof = event;
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");

    if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
      this.validatedates();
    }
  }
  ToDateChange(event) {
    debugger;
    this.gridData = [];
    this.tomonthof = event;
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
      this.validatedates();
    }
  }
  validatedates() {
    debugger;
    if (this.fromdate > this.todate) {

      this.validation = true
    }

    else {
      this.validation = false;
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
          this.CommisionPaymentErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.CommisionPaymentErrors[key] += errormessage + ' ';
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
  checkox(event) {
    debugger;
    this.Betweengrid = []
    this.gridData = []
    this.CINEntryReportform.controls.pChallanaNo.setValue("")
    if (event.target.checked == true) {
      this.showdate = true;
      this.showdropdown = false;
      this.showbetweendates = true;
      this.showchalanagrid = false;

    }
    else {
      this.showdate = false;
      this.showdropdown = true;
      this.showbetweendates = false;
      this.showchalanagrid = true;


    }

  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

  public allData1(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.Betweengrid, {
        sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }
  // OK

  // public allData1(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.Betweengrid, {
  //       sort: [{ field: "pDepositdate", dir: "asc" }],
  //       group:this.groups
  //     }).data,
  //     group: this.groups,
  //   };

  //   return result;
  // }


}
