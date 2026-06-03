import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';

@Component({
  selector: 'app-section-wise-report',
  templateUrl: './section-wise-report.component.html',
  styles: []
})
export class SectionWiseReportComponent implements OnInit {
  sectionWiseForm  : FormGroup
  sectionList: any = [];
  sectionWiseValidationErrors: any;
  gridData: any=[];
  selecteddate: boolean = true;
  betweendates: any;
  fromdate: any;
  date: any;
  FromDate: any;
  inbetween: any;
  showdate: boolean = true;
  todate: any;
  betweento: any;
  betweenfrom: any;
  validation: boolean = false;
  constructor(private fb:FormBuilder, private _commonService:CommonService, private _contacmasterservice :ContacmasterService, private datepipe:DatePipe, private tdsService:TdsreportService ) { }

  ngOnInit() {

    this.sectionWiseForm = this.fb.group({
      section : ['',Validators.required],
      pSectionname : [''],
      dfromdate : [''],
      dtodate : [''],
      pDocType : [''],
      date : [''],
    })
    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "As On"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''

    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "As On"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''
    this.sectionWiseForm['controls']['date'].setValue(true)
    this.sectionWiseForm['controls']['dfromdate'].setValue(this.date);
    this.sectionWiseForm['controls']['dtodate'].setValue(this.date);
    this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
    debugger
    this.getSectionList();
    this.sectionWiseValidationErrors = {};
    this.BlurEventAllControll(this.sectionWiseForm);
  }

  getSectionList() {
    try {
      debugger;
      this.tdsService.getTDSSections().subscribe(json => {
        debugger;
        try {
          if (json != null) {
            this.sectionList = json;

          }
        }
        catch (error) {
          
        }
      },
        (error) => {

          this._commonService.showErrorMessage(error);
        });
    }
    catch (error) {
      //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
    }
  }

  sectionChange(event){
    debugger;
    this.sectionWiseForm.controls.pSectionname.setValue(event.pSectionname);
    

  }

  getSectionReport(){
    debugger;
    let isvalid = true;
    if (this.checkValidations(this.sectionWiseForm, isvalid)) {
    let data = JSON.stringify(this.sectionWiseForm.value);
    }
  }

  checkox(event) {

    this.sectionWiseForm.controls.dfromdate.setValue(new Date());
    this.sectionWiseForm.controls.dtodate.setValue(new Date());
    
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

      //this.hidegridcolumn = false;


    }
    else {
      this.betweendates = "As On"
      this.inbetween = ""
      this.showdate = false;
      this.selecteddate = true;
      this.todate = "";
      this.FromDate = '';
      this.betweento = ""
      this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
      //this.hidegridcolumn = true;
    }
  }

  checkfromdate() {
     
    debugger
    this.fromdate = this.sectionWiseForm['controls']['dfromdate'].value
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
    this.todate = this.sectionWiseForm['controls']['dtodate'].value
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
      this.fromdate = this.sectionWiseForm.controls.dfromdate.value
      this.todate = this.sectionWiseForm.controls.dfromdate.value
    }
    else {
      this.fromdate = this.sectionWiseForm.controls.dfromdate.value
      this.todate = this.sectionWiseForm.controls.dtodate.value
    }
    this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
    this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
    return isValid
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
          this.sectionWiseValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.sectionWiseValidationErrors[key] += errormessage + ' ';
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

}
