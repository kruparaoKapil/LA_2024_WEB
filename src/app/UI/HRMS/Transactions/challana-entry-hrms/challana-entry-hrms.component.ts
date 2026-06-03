import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { EmployeeAttendanceService } from 'src/app/Services/HRMS/Transactions/employee-attendance.service';

@Component({
  selector: 'app-challana-entry-hrms',
  templateUrl: './challana-entry-hrms.component.html',
  styles: []
})
export class ChallanaEntryHrmsComponent implements OnInit {
  challanaEntryForm: FormGroup;
  calendarYearData: any = [];
  calendarMonthData: any = [];
  CalendarYear: any;
  CalendarMonth: any;
  challanaTypeList: any = [];
  gridData: any = [];
  public datepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  BranchId: any;
  gridData1: any = [];
  gridButton: any = 'Add';
  Index: any;
  formValidationMessages: any;
  constructor(private fb: FormBuilder, private challanaService: EmployeeAttendanceService, private commonService:CommonService, private datePipe:DatePipe) {
    this.datepickerConfig.maxDate = new Date();
    this.datepickerConfig.dateInputFormat = "DD/MM/YYYY";
    this.datepickerConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.challanaEntryForm = this.fb.group({
      pPeriodType: ['',Validators.required],
      pCalendarMonth: ['',Validators.required],
      pChallanaType: ['',Validators.required],
      challanaNo: ['',Validators.required],
      challanaDate: [new Date(),Validators.required],
      challanaAmount: ['',Validators.required],
    });
    this.GetCalendarYear();
    this.challanaTypeList = [{ id: 1, challanaType: 'ESI' }, { id: 2, challanaType: 'PF' }, { id: 3, challanaType: 'PT' }];
    let data = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.BranchId = data.pbranch_id;
    this.formValidationMessages = {};
  }

  GetCalendarYear() {
    debugger;
    this.challanaService.GetCalendarYear().subscribe(result => {
      debugger;
      this.calendarYearData = result;
    });
  }


  GetCalendarYearMonth(event) {
    debugger;
    this.CalendarYear = event.pPeriodType;
    this.challanaService.GetCalendarYearMonth(event.pCalenderPeriodId).subscribe(result => {
      debugger;
      this.calendarMonthData = result;
      console.log("monthList", this.calendarMonthData);
    });
  }

  calendarMonthChange(event) {
    debugger;
    this.CalendarMonth = event.pCalendarMonth;
  }

  changeChallanaType(event) {
    debugger;
    
  }

  clearDetails() { 
    this.challanaEntryForm.controls.pChallanaType.setValue('');
  this.challanaEntryForm.controls.challanaDate.setValue(new Date());
  this.challanaEntryForm.controls.challanaNo.setValue('');
  this.challanaEntryForm.controls.challanaAmount.setValue('');
  this.challanaEntryForm.controls.pCalendarMonth.setValue('');
  this.challanaEntryForm.controls.pPeriodType.setValue('');
  }

  addToGrid() {
    debugger;
    let isvalid = true;
    if (this.checkValidations(this.challanaEntryForm, isvalid)) {
    if(this.gridButton == 'Add'){
    let pchallandate = this.datePipe.transform(this.challanaEntryForm.controls.challanaDate.value,'yyyy-MM-dd');
    let data = {
      //"pchallanid": 0,
      "pbranchid": this.BranchId,
      "pchallantype": this.challanaEntryForm.controls.pChallanaType.value,
      "pchallandate": pchallandate,
      "pchallanno": this.challanaEntryForm.controls.challanaNo.value,
      "pchallanamount": this.commonService.removeCommasForEntredNumber(this.challanaEntryForm.controls.challanaAmount.value),
      "pchallanmonth": this.challanaEntryForm.controls.pCalendarMonth.value,
      "pchallanyear": this.challanaEntryForm.controls.pPeriodType.value,
      "pcreatedby": this.commonService.pCreatedby,
      "pchallanmonthForBinding": this.CalendarMonth,
      "pchallanyearForBinding": this.CalendarYear,
      "pTypeofoperation": 'CREATE',
    }

    this.gridData1.push(data);
    this.gridData = [...this.gridData1];
    this.clearDetails();
  }
  else{
    this.updateGriddata();
  }
}
  }

  editGridData(dataItem){
  debugger;
  this.gridButton = 'Update';
  this.Index = dataItem.rowIndex;
    
  this.challanaEntryForm.controls.pChallanaType.setValue(dataItem.dataItem.pchallantype);
  this.challanaEntryForm.controls.challanaDate.setValue(new Date(dataItem.dataItem.pchallandate));
  this.challanaEntryForm.controls.challanaNo.setValue(dataItem.dataItem.pchallanno);
  this.challanaEntryForm.controls.challanaAmount.setValue(this.commonService.currencyformat(dataItem.dataItem.pchallanamount));
  this.challanaEntryForm.controls.pCalendarMonth.setValue(dataItem.dataItem.pchallanmonth);
  this.challanaEntryForm.controls.pPeriodType.setValue(dataItem.dataItem.pchallanyear);

}

updateGriddata(){
  debugger;
  let pchallandate = this.datePipe.transform(this.challanaEntryForm.controls.challanaDate.value,'yyyy-MM-dd');
  this.gridData[this.Index].pchallantype = this.challanaEntryForm.controls.pChallanaType.value;
  this.gridData[this.Index].pchallandate = pchallandate;
  this.gridData[this.Index].pchallanno = this.challanaEntryForm.controls.challanaNo.value;
  this.gridData[this.Index].pchallanamount = this.challanaEntryForm.controls.challanaAmount.value;
  this.gridData[this.Index].pchallanmonth = this.challanaEntryForm.controls.pCalendarMonth.value;
  this.gridData[this.Index].pchallanyear = this.challanaEntryForm.controls.pPeriodType.value;
  this.gridData[this.Index].pchallanmonthForBinding = this.CalendarMonth;
  this.gridData[this.Index].pchallanyearForBinding = this.CalendarYear;

  this.gridButton = 'Add';

  this.clearDetails();
}

saveChallanaEntry(){
  debugger;
  let data = {
    hrmsChallanaDetailsList : this.gridData
  }
  this.challanaService.saveHrmsChallana(data).subscribe(res => {
    this.commonService.showInfoMessage('Saved Succesfully');
    this.gridData = [];
    this.gridData1 = [];
  })
}

// 

BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this.commonService.showErrorMessage(e);
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
      this.commonService.showErrorMessage(e);
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
        formcontrol = <FormGroup>this.challanaEntryForm['controls']['ppaymentsslistcontrols'].get(key);
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
                errormessage = this.commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
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
