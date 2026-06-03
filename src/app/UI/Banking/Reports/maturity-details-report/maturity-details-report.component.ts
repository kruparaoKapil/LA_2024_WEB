import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-maturity-details-report',
  templateUrl: './maturity-details-report.component.html',
  styles: []
})
export class MaturityDetailsReportComponent implements OnInit {
  Type: any;
  maturityView: boolean = false;
  preMaturityView: boolean = false;
  public today: Date = new Date();
  maturityDetailsReportForm: FormGroup;
  gridData: any = [];
  maturityList: any = [];
  IssuedChequeValidation: any = {};
  showdate = true;
  todate: any;
  selecteddate = true;
  betweendates: any;
  FromDate: any;
  inbetween: any;
  betweenfrom: any;
  betweento: any;
  fromdate: any;
  hidegridcolumn = true;
  date: any;
  validation = false;
  maturityDetailsList: any = [];
  fromDates: any;
  toDates: any;






  constructor(private _CommonService: CommonService, private formbuilder: FormBuilder, private datepipe: DatePipe, private maturityService:LAReportsService) { 
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.maturityDetailsReportForm = this.formbuilder.group({
      fromDate: [this.today],
      toDate: [this.today],

      dfromdate: [''],
      dtodate: [''],
      date: [''],
      pMaturityType: [''],
    })
    this.getMaturityTypes();
    this.maturityClick()

    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "ASON"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''
    this.hidegridcolumn = true;

    this.maturityDetailsReportForm['controls']['date'].setValue(true)
    this.maturityDetailsReportForm['controls']['dfromdate'].setValue(this.date);
    this.maturityDetailsReportForm['controls']['dtodate'].setValue(this.date);
    this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
  }

  checkox(event) {

    this.maturityDetailsReportForm.controls.dfromdate.setValue(new Date());
    this.maturityDetailsReportForm.controls.dtodate.setValue(new Date());

    this.gridData = []
    if (event.target.checked == false) {
      this.selecteddate = false
      this.showdate = true;
      this.betweendates = "Between"
      this.FromDate = 'From Date'
      this.inbetween = "and";
      this.validationfordates();
      this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");

      this.hidegridcolumn = false;


    }
    else {
      this.betweendates = "ASON"
      this.inbetween = ""
      this.showdate = false;
      this.selecteddate = true;
      this.todate = "";
      this.FromDate = '';
      this.betweento = ""
      this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
      this.hidegridcolumn = true;
    }
  }

  checkfromdate() {

    debugger
    this.fromdate = this.maturityDetailsReportForm['controls']['dfromdate'].value
    this.fromdate = this.datepipe.transform(this.fromdate, "dd/MM/yyyy");
    this.validationfordates()
    if (this.fromdate > this.todate) {
      this.validation = true;
    }
    else {
      this.validation = false;
    }

  }
  checktodate() {
    debugger
    this.todate = this.maturityDetailsReportForm['controls']['dtodate'].value
    this.todate = this.datepipe.transform(this.todate, "dd/MM/yyyy");

    this.validationfordates()
    if (this.fromdate > this.todate) {
      this.validation = true;
    }
    else {
      this.validation = false;
    }

  }
  validationfordates() {

    let isValid = true;


    if (this.selecteddate == true) {
      this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
      this.todate = this.maturityDetailsReportForm.controls.dfromdate.value
    }
    else {
      this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
      this.todate = this.maturityDetailsReportForm.controls.dtodate.value
    }
    this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
    this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
    return isValid
  }

  getMaturityTypes() {
    this.maturityList = [{ maturityType: 'Maturity' }, { maturityType: 'Pre-Maturity' }];
  }
  maturityChange() { }

  maturityClick() {
    debugger;
    this.Type = "MATURITY";
    this.maturityView = true;
    this.preMaturityView = false;
    this.maturityDetailsReportForm.controls.dfromdate.setValue(this.today);
    this.maturityDetailsReportForm.controls.dtodate.setValue(this.today);
    // this.IssuedChequeValidation.pbankname = '';
    this.maturityDetailsList = [];
  }

  preMaturityClick() {
    debugger
    this.Type = "PRE-MATURITY";
    this.maturityView = false;
    this.preMaturityView = true;
    this.maturityDetailsReportForm.controls.dfromdate.setValue(this.today);
    this.maturityDetailsReportForm.controls.dtodate.setValue(this.today);
    // this.IssuedChequeValidation.pbankname = '';
    this.maturityDetailsList = [];
  }

  getMaturityDetails(){
    debugger;  
    let fromDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "yyyy/MM/dd");
    let toDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "yyyy/MM/dd");

    this.fromDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "dd-MM-yyyy");
    this.toDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "dd-MM-yyyy");

    this.maturityService.getPreMaturityMonthWise(this.Type,this.betweendates,fromDate,toDate).subscribe(details => {
      this.maturityDetailsList = details;
      if(this.maturityDetailsList.length == 0){
        this._CommonService.showWarningMessage('No Data To Show');
      }
    })
  }

   public allData(): ExcelExportData {
      const result: ExcelExportData = {
        data: process(this.maturityDetailsList, {}).data,
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
