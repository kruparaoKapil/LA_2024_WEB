import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-employee-salary-update',
  templateUrl: './employee-salary-update.component.html',
  styles: []
})
export class EmployeeSalaryUpdateComponent implements OnInit {
  empSalaryUpdate:FormGroup;
  empSalaryValidation = {};
  public datepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  today: Date = new Date();
  updateIncrementdetails: any = [];
  constructor(private _commonService:CommonService, private fb:FormBuilder) { 
    this.datepickerConfig.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig.maxDate = new Date();
      this.datepickerConfig.showWeekNumbers = false;
      this.datepickerConfig1.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig1.maxDate = new Date();
      this.datepickerConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
     this.empSalaryUpdate = this.fb.group({
          
      fromDate: [this.today,Validators.required],
      toDate: [this.today,Validators.required],
      pFfromdate: [this.today,Validators.required],
      pFtodate: [this.today,Validators.required]
        });
  }

  changeFromDate(){}
  changeToDate(){}



  pdfOrprint(printorpdf){
    debugger;
    this.updateIncrementdetails = [
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},

      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},{'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
      // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1}
    ];

    this.showIncrementUpdate(printorpdf);
  }
  
  showIncrementUpdate(printorpdf)
    {
      debugger;
      let columstyles = {
        0: { cellWidth: 'auto', halign: 'center' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'center' },
        4: { cellWidth: 'auto', halign: 'center' },
        5: { cellWidth: 'auto', halign: 'left' },
        6: { cellWidth: 'auto', halign: 'left' },
        7: { cellWidth: 'auto', halign: 'right' },
        8: { cellWidth: 'auto', halign: 'right' },
        9: { cellWidth: 'auto', halign: 'right' },
        10:{ cellWidth: 'auto', halign: 'right' },
        11:{ cellWidth: 'auto', halign: 'center' },
        12:{ cellWidth: 'auto', halign: 'center' }
      }
      let gridheaders = [['Employee Id', '  Employee Name ', 'Reporting \n Date', 'Joining  Date', 'Date \n Of Promotion', 'Old \n Designation Name', 'new \n Designation Name', 'Old \n Basic Amount', 'New \n Basic Amount', 'Old Allowance', 'New Allowance', 'Ssc Minutes Date', 'Ssc Minutes No']];
      let reportName = 'Employee Salary Increment Details';
      let pagetype = 'landscape'
      let gridata = [];
      let temp;

      this.updateIncrementdetails.forEach(element => {
        console.log(element, 250);
        temp = [element.pEmployeeId, element.pEmployeeName, element.pDateOfReporting, element.pDateOfJoining, element.pDateofPromotion, element.pOldDesignationName, element.pNewDesiganationName, element.pOldBasicAmount, element.pNewBasicAmount, element.pOldAllowanceAmount, element.pNewAllowanceAmount, element.pSscMinutesDate, element.pSscMinutesNo];
        gridata.push(temp);
      });
      if (this.updateIncrementdetails.length > 0) {
        let fromdate = this.empSalaryUpdate.controls.fromDate.value;
        let todate = this.empSalaryUpdate.controls.toDate.value;
        this.downloadEmpTransferredReport(printorpdf, gridata, gridheaders, reportName, pagetype, columstyles, fromdate, todate);
      } else {
        this._commonService.showWarningMessage('No Data !!');
      }
    }

    downloadEmpTransferredReport(printorpdf, gridata, gridheaders, reportName, pagetype, columstyles, fromdate, todate) {
      debugger;
      let doc = new jsPDF(pagetype); //a4
      let address = this._commonService.comapnydetails.pAddress1 + ' ' + this._commonService.comapnydetails.pAddress2 + ' ' + this._commonService.comapnydetails.pDistrict + ' ' + this._commonService.comapnydetails.pcity + ' ' + this._commonService.comapnydetails.pState + ' - ' + this._commonService.comapnydetails.pPincode;
      let Companyreportdetails = this._commonService.comapnydetails;;
      let totalPagesExp = '{total_pages_count_string}'
      let today = this._commonService.pdfProperties("Date");
      let kapil_logo = this._commonService.getKapilGroupLogo();
      //var lMargin = 15; //left margin in mm
      var lMargin = -55; 
      //var rMargin = 15;//right margin in mm
      var rMargin = 0; 
      var pdfInMM = 233;
      doc.autoTable({
        theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
        headStyles: {
          fillColor: this._commonService.pdfProperties("Header Color"),
          halign: this._commonService.pdfProperties("Header Alignment"),
          fontSize: this._commonService.pdfProperties("Header Fontsize")
        }, // Red
        styles: {
          cellPadding: 1, fontSize: this._commonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
          rowPageBreak: 'avoid',
          overflow: 'linebreak'
        },
        head: gridheaders,
        bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
        columnStyles: columstyles,
        body: gridata,
        startY: 60,
        didDrawPage: function (data) {
          let pageSize = doc.internal.pageSize;
          let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          // Header
          doc.setFontStyle('normal');
          if (doc.internal.getNumberOfPages() == 1) {
            debugger;
            doc.setFontSize(15);
            doc.setFont("Times-Italic")
            if (pagetype == "landscape") {
               doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 16)
               doc.setTextColor('black');
              doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, 16, { align: 'center' });
              //Adress size
              doc.setFontSize(12);
              doc.text(address, pageWidth / 2, 23, { align: 'center' });
              if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
                doc.text('CIN : ' + Companyreportdetails.pCinNo + '', pageWidth / 2, 28, { align: 'center' });
              }
              doc.setFontSize(14);
              doc.text(reportName, pageWidth / 2, 38, { align: 'center' }); // actual=90
              doc.setFontSize(10);
                //doc.text('Printed On : ' + today + '', 15, 57);
              //doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 157, 52); //actual=163,50
              doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 225, 52); //actual=163,50

              //doc.text('From Date : ' + fromdate + ' ', 15, 52);//50
//doc.text('To Date : ' + todate, 54, 52);
             // doc.setDrawColor(0, 0, 0);
              pdfInMM = 233;
               doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
              doc.line(10, 56, (pdfInMM - lMargin - rMargin), 56) //added *
              doc.line(10, 56, (pdfInMM - lMargin - rMargin), 56)
            }
          }
          else {
            data.settings.margin.top = 20;
            data.settings.margin.bottom = 15;
          }
          debugger;
          var pageCount = doc.internal.getNumberOfPages();
          if (doc.internal.getNumberOfPages() == totalPagesExp) {
            debugger;
          }
          // Footer
          let page = "Page " + doc.internal.getNumberOfPages()
          // Total page number plugin only available in jspdf v1.0+
          if (typeof doc.putTotalPages === 'function') {
            debugger;
            page = page + ' of ' + totalPagesExp
          }
          doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal linev

          doc.setFontSize(10);
          //doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);

          doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
        },
        // willDrawCell:function(data){
        //   if (data.row.index === gridata.length - 1) {
        //     doc.setFontStyle("bold");
        //       doc.setFontSize(8);
        //   }
        // },
      });
      if (typeof doc.putTotalPages === 'function') {
        debugger;
        doc.putTotalPages(totalPagesExp);

      }
      if (printorpdf == "Pdf") {
        doc.save('' + reportName + '.pdf');
      }
      if (printorpdf == "Print") {
        this._commonService.setiFrameForPrint(doc);
      }
    }



    //FUTURE INCREMENT DETAILS
    FpdfOrprint(printorpdf)
    {
      debugger;
      let fromdate = this.empSalaryUpdate.controls.pFfromdate.value;
      let todate = this.empSalaryUpdate.controls.pFtodate.value;
      //this.reporttype = "Old"
      // this._hrmsreportsService.GetEmployeeSalaryUpdate(this.reporttype, fromdate, todate).subscribe(res => {
      //   console.log(res, 154);
        
      // });

      this.updateIncrementdetails = [
        // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1},
        // {'pEmployeeId' : 1, 'pEmployeeName' : 'Rama', 'pDateOfReporting': '05-01-2015', 'pDateOfJoining': '05-02-2015', 'pDateofPromotion': '05-01-2025', 'pOldDesignationName':'SR', 'pNewDesiganationName':'TL', 'pOldBasicAmount':15000, 'pNewBasicAmount':24000, 'pOldAllowanceAmount':10000, 'pNewAllowanceAmount':20000, 'pSscMinutesDate': '05-01-2025', 'pSscMinutesNo':1}
      ]
        console.log(this.updateIncrementdetails);
        this.showFutureIncrementUpdate(printorpdf);
    }
   
    showFutureIncrementUpdate(printorpdf)
      {
        debugger;
        let columstyles = {
          0: { cellWidth: 'auto', halign: 'center' },
          1: { cellWidth: 'auto', halign: 'left' },
          2: { cellWidth: 'auto', halign: 'center' },
          3: { cellWidth: 'auto', halign: 'center' },
          4: { cellWidth: 'auto', halign: 'left' },
          5: { cellWidth: 'auto', halign: 'right' },
          6: { cellWidth: 'auto', halign: 'right' }
        }
        let gridheaders = [['Employee Id', '  Employee Name ','Joining  Date', 'Old \n Promotion Date', 'Present \n Designation Name', 'Basic Amount', 'Allowance Amount']];
        let reportName = 'Employee Future Salary Increment Details';
        let pagetype = 'landscape'
        let gridata = [];
        let temp;
  
        this.updateIncrementdetails.forEach(element => {
          console.log(element, 250);
          temp = [element.pEmployeeId, element.pEmployeeName,element.pDateOfJoining, element.pDateofPromotion, element.pNewDesiganationName,element.pNewBasicAmount,element.pNewAllowanceAmount];
          gridata.push(temp);
        });
        if (this.updateIncrementdetails.length > 0) {
          let fromdate = this.empSalaryUpdate.controls.fromDate.value;
          let todate = this.empSalaryUpdate.controls.toDate.value;
          this.FdownloadEmpTransferredReport(printorpdf, gridata, gridheaders, reportName, pagetype, columstyles, fromdate, todate);
        } else {
          this._commonService.showWarningMessage('No Data !!');
        }
      }
  
      FdownloadEmpTransferredReport(printorpdf, gridata, gridheaders, reportName, pagetype, columstyles, fromdate, todate) {
        debugger;
        let doc = new jsPDF(pagetype); //a4
        let address = this._commonService.comapnydetails.pAddress1 + ' ' + this._commonService.comapnydetails.pAddress2 + ' ' + this._commonService.comapnydetails.pDistrict + ' ' + this._commonService.comapnydetails.pcity + ' ' + this._commonService.comapnydetails.pState + ' - ' + this._commonService.comapnydetails.pPincode;
        let Companyreportdetails = this._commonService.comapnydetails;
        let totalPagesExp = '{total_pages_count_string}'
        let today = this._commonService.pdfProperties("Date");
        let kapil_logo = this._commonService.getKapilGroupLogo();
        //var lMargin = 15; //left margin in mm
        var lMargin = -55; 
        //var rMargin = 15;//right margin in mm
        var rMargin = 0; 
        var pdfInMM = 233;
        doc.autoTable({
          theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
          headStyles: {
            fillColor: this._commonService.pdfProperties("Header Color"),
            halign: this._commonService.pdfProperties("Header Alignment"),
            fontSize: this._commonService.pdfProperties("Header Fontsize")
          }, // Red
          styles: {
            cellPadding: 1, fontSize: this._commonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
            rowPageBreak: 'avoid',
            overflow: 'linebreak'
          },
          head: gridheaders,
          bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
          columnStyles: columstyles,
          body: gridata,
          startY: 60,
          didDrawPage: function (data) {
            let pageSize = doc.internal.pageSize;
            let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
            let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            // Header
            doc.setFontStyle('normal');
            if (doc.internal.getNumberOfPages() == 1) {
              debugger;
              doc.setFontSize(15);
              doc.setFont("Times-Italic")
              if (pagetype == "landscape") {
                doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 16)
                doc.setTextColor('black');
                doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, 16, { align: 'center' });
                  //Adress size
                doc.setFontSize(12);
                doc.text(address, pageWidth / 2, 23, { align: 'center' });
                if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
                  doc.text('CIN : ' + Companyreportdetails.pCinNo + '', pageWidth / 2, 28, { align: 'center' });
                }
                doc.setFontSize(14);
                doc.text(reportName, pageWidth / 2, 38, { align: 'center' }); // actual=90
                doc.setFontSize(10);
                //  doc.text('Printed On : ' + today + '', 15, 57);
                //doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 157, 52); //actual=163,50
                doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 225, 52); //actual=163,50
  
                //doc.text('From Date : ' + fromdate + ' ', 15, 52);//50
                //doc.text('To Date : ' + todate, 54, 52);
                doc.setDrawColor(0, 0, 0);
                pdfInMM = 233;
                // doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
                //doc.line(10, 56, (pdfInMM - lMargin - rMargin), 56) //added *
                doc.line(10, 56, (pdfInMM - lMargin - rMargin), 56)
              }
            }
            else {
              data.settings.margin.top = 20;
              data.settings.margin.bottom = 15;
            }
            debugger;
            var pageCount = doc.internal.getNumberOfPages();
            if (doc.internal.getNumberOfPages() == totalPagesExp) {
              debugger;
            }
            // Footer
            let page = "Page " + doc.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
              debugger;
              page = page + ' of ' + totalPagesExp
            }
            doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal linev
  
            doc.setFontSize(10);
            //doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
  
            doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
          },
          // willDrawCell:function(data){
          //   if (data.row.index === gridata.length - 1) {
          //     doc.setFontStyle("bold");
          //       doc.setFontSize(8);
          //   }
          // },
        });
        if (typeof doc.putTotalPages === 'function') {
          debugger;
          doc.putTotalPages(totalPagesExp);
  
        }
        if (printorpdf == "Pdf") {
          doc.save('' + reportName + '.pdf');
        }
        if (printorpdf == "Print") {
          this._commonService.setiFrameForPrint(doc);
        }
      }

  // VALIDATIONS
  
    checkValidations(group: FormGroup, isValid: boolean): boolean {
    
      try {
        Object.keys(group.controls).forEach((key: string) => {
          isValid = this.GetValidationByControl(group, key, isValid);
        })
      }
      catch (e) {
        this._commonService.showErrorMessage(e);
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
            this.empSalaryValidation[key] = '';
            if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
              let lablename;
              lablename = (document.getElementById(key) as HTMLInputElement).title;
              let errormessage;
              for (const errorkey in formcontrol.errors) {
                if (errorkey) {
                  errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                  this.empSalaryValidation[key] += errormessage + ' ';
                  isValid = false;
                }
              }
            }
          }
        }
      }
      catch (e) {
        this._commonService.showErrorMessage(e);
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
        this._commonService.showErrorMessage(e);
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
        this._commonService.showErrorMessage(e);
        return false;
      }
    
    
    
    }

}
