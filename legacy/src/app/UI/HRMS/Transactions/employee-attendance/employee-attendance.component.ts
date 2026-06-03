import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { State } from '@progress/kendo-data-query';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { EmployeeAttendanceService } from 'src/app/Services/HRMS/Transactions/employee-attendance.service';
import { error } from 'console';
@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styles: []
})
export class EmployeeAttendanceComponent implements OnInit {
  EmployyeAttendForm: FormGroup;
  public CalendarYear: any;
  public CalendarMonth: any;
  employeeList: any = [];
  MonthName: any;
  GridData: any = [];
  formValidationMessages: any = {};
  public disablesavebutton=false;
  editing = {};
  contactSearchevent = new Subject<string>();
  savebutton = 'Save';

  dropDownControlName: any = '';
  showEmployeeGrid: any = false;
  controleventstatus: any = false;
  pageeventstatus: any = false;
  calendarYearData: any = [];
  calendarMonthData: any = [];
  EmployyeAttendarray: any = [];
  public isLoading : boolean = false;

  public pageSize = 10;

   public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  attendanceService: any;
  CalendarId: string;
  pCreatedby: any;
  pipaddress: any;


  constructor(private fb: FormBuilder, private commonservice: CommonService, private _employeeAtt: EmployeeAttendanceService, private http: HttpClient) { }
  MonthId: any;
  BranchId: any;
  EmployeeCode: any;
  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.BranchId = data.pbranch_id;
    this.contactSearch();
   this.bindformControls();
    this.GetCalendarYear();
  }
   bindformControls() {
    this.EmployyeAttendForm = this.fb.group({
      pEmployeecode: [''],
      pPeriodType: ['',Validators.required],
      pCalendarMonth:['',Validators.required],
      pEmployeeName:[''],
    })
  }

  private contactSearch() {
    debugger;
    this._employeeAtt.getEmployeeDetails( this.BranchId).subscribe(result => {
      debugger;
      console.log(result);
      let staticarray = [{"pEmployeeName":'All',"pEmployeecode":'KHE00',"pContactNo":0}];
      this.employeeList = staticarray;
      //this.employeeList = [...staticarray,...result];
   })
  }


  ContactGridRowSelect(selected) {
    debugger;
    try {
      if (selected) {
        this.EmployyeAttendForm.controls['pEmployeeName'].setValue(selected.pEmployeeName.toString());
      }
      else {
        this.EmployyeAttendForm.controls['pEmployeecode'].setValue('');
        this.EmployyeAttendForm.controls['pEmployeeName'].setValue('');
        this.EmployyeAttendForm.controls.pPeriodType.setValue('');
        this.EmployyeAttendForm.controls.pCalendarMonth.setValue('');
        this.calendarMonthData = [];
        this.GridData = [];
      }
    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('Employee Attendance', 'ContactGridRowSelect', error);
    }
  }


  GetCalendarYear() {
    debugger;
    this._employeeAtt.GetCalendarYear().subscribe(result => {
      debugger;
      this.calendarYearData = result;
      console.log("yearsList", this.calendarYearData);
    });
  }


  GetCalendarYearMonth(event) {
    debugger;
    this.CalendarYear=event.pPeriodType;
    this._employeeAtt.GetCalendarYearMonth(event.pCalenderPeriodId).subscribe(result => {
      debugger;
      this.calendarMonthData = result;
      console.log("monthList", this.calendarMonthData);
      this.GridData = [];
    });
  }

  calendarMonthChange(event){
    debugger;
    this.CalendarMonth=event.pCalendarMonth;
    this.GridData = [];
  }


  GetEmployeeAttendanceDetails(code: any) {
    debugger;
    this.GridData = [];
    let data = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.BranchId = data.pbranch_id;
    this.isLoading = true;
    this._employeeAtt.GetEmployeeAttendanceDetails(this.BranchId,this.CalendarYear,this.CalendarMonth).subscribe(result=>{
      debugger;
      console.log(result);
      this.GridData = result;
      this.isLoading = false;
      if(this.GridData.length ==0){
        this.commonservice.showWarningMessage("No Data To Show");
      }
    },(error) =>{
      this.commonservice.showErrorMessage(error);
    });
  }

  updateValue(event, cell, typeofedit, rowIndex, row) {
    debugger;
    let SLeaves = row.pSL;
    let CLeaves = row.pCL;
    let SL = 0;
    let CL = 0;
    let LOP = 0;
    let OThers = 0;
    let splitnum = [];
    let currntnumber;
    let currentValue = row[typeofedit];
    if (currentValue && currentValue.toString().includes('.')) {
      splitnum = currentValue.split('.');
      currntnumber = splitnum[1];
      if (currntnumber != "5" && currntnumber != "" && currntnumber > 0) {
        this.commonservice.showWarningMessage("Half Day Allows only Decimal 5");
        row[typeofedit] = splitnum[0];
      }
    }
    if (typeofedit == "SL") {
      if (currentValue > SLeaves) {
        this.commonservice.showWarningMessage("SL should not be greater than Total SL");
        row[typeofedit] = '';
      }
    } else if (typeofedit == "CL") {
      if (currentValue > CLeaves) {
        this.commonservice.showWarningMessage("CL should not be greater than Total CL");
        row[typeofedit] = '';
      }
    } else if (typeofedit == "OT") {
      if (currentValue > 30) {
        this.commonservice.showWarningMessage("Others should not be greater than Month Days");
        row[typeofedit] = '';
      }
    } else {
      if (currentValue > 30) {
        this.commonservice.showWarningMessage("LOP should not be greater than Month Days");
        row[typeofedit] = '';
      }
    }
    SL = parseFloat(row.pSLeave);
    CL = parseFloat(row.pCLeave);
    OThers = parseFloat(row.pOthers);
    LOP = parseFloat(row.pLOP);
    SL = isNaN(SL) ? 0 : SL;
    CL = isNaN(CL) ? 0 : CL;
    OThers = isNaN(OThers) ? 0 : OThers;
    LOP = isNaN(LOP) ? 0 : LOP;
    let totalLeaves = CL + SL + OThers + LOP;
    if (totalLeaves > 30) {
      this.commonservice.showWarningMessage("Total Leaves should not be greater than Month Days");
      row[typeofedit] = '';
    }
    this.GridData = this.GridData.slice();
    console.log(this.GridData);
  }


  SaveEmployeeAttendance() {
    debugger;
    if (this.GridData.length > 0) {
      let count = 0;
      for (let k = 0; k < this.GridData.length; k++) {
        const Sleave = this.GridData[k].pSLeave;
        const cleave = this.GridData[k].pCLeave;
        const others = this.GridData[k].pOthers;
        const Lop = this.GridData[k].pLOP;
        if (Sleave == null && cleave == null && others == null && Lop == null) {
          count++;
        }
      }
      if (this.CalendarYear !== "" && this.CalendarYear !== undefined) {
        if (this.CalendarMonth === "" || this.CalendarMonth === undefined) {
          this.commonservice.showWarningMessage("Select Calendar Month");
          return false;
        }
      }
      if (this.GridData.length === count) {
        this.commonservice.showWarningMessage("Enter At least one row");
        return false;
      }
      if (confirm("Do you want to save?")) {
        for (let i = 0; i < this.GridData.length; i++) {
          this.GridData[i].pPeriodType = this.CalendarYear;
          this.GridData[i].pCalendarMonth = this.CalendarMonth;
          this.GridData[i].schemaname = this.BranchId;
          if (this.GridData[i].pCLeave == null) this.GridData[i].pCLeave = 0;
          if (this.GridData[i].pSLeave == null) this.GridData[i].pSLeave = 0;
          if (this.GridData[i].pLOP == null) this.GridData[i].pLOP = 0;
          let totalcl = parseFloat(this.GridData[i].pCLeave) + this.GridData[i].pUsedCl;
          let cl = this.GridData[i].pCL;
          let totalsl = parseFloat(this.GridData[i].pSLeave) + this.GridData[i].pUsedSl;
          let sl = this.GridData[i].pSL;
          let lop = parseFloat(this.GridData[i].pLOP) || 0;
          if (totalcl > cl) {
            this.GridData[i].pLOP = (lop || 0) + (totalcl - cl);
          }
          if (totalsl > sl) {
            this.GridData[i].pLOP = (lop || 0) + (totalsl - sl);
          }
          this.GridData[i].pAvbCL = this.GridData[i].pCL - parseFloat(this.GridData[i].pCLeave);
          this.GridData[i].pAvbSL = this.GridData[i].pSL - parseFloat(this.GridData[i].pSLeave);
          let session = JSON.parse(sessionStorage.getItem('currentUser'));
          this.GridData[i].pCreatedby = session.pCreatedby;
        }

        this.GridData = this.GridData.map(obj => {
          obj.pbranchid = this.BranchId;
          delete obj.schemaname;
          return obj;
        });

        let formdata = {
          "pEmployeecode":this.EmployyeAttendForm.controls.pEmployeeName.value,
          "pPeriodType": this.CalendarYear,
          "pCalendarMonth": this.CalendarMonth,
          "lstEmployeeDTO": this.GridData,
        };

        console.log('FormData to be saved:', formdata);
       debugger
        this._employeeAtt.SaveEmployeeAttendance(formdata).subscribe(res => {
          debugger;
          if (res != null) {
            this.commonservice.showInfoMessage('Saved Successfully');
            this.GridData = [];
            this.EmployyeAttendForm.reset();
            this.clearAllFielsd();
          }
        },(error)=>{
          this.commonservice.showErrorMessage(error);
        });
      }
    } else {
      this.commonservice.showWarningMessage("No Data in Grid");
    }
  }

  ClearDetails(){
    this.clearAllFielsd();
  }

  clearAllFielsd() {
    this.bindformControls();
    this.calendarMonthData = [];
    this.MonthName = "";
    this.CalendarYear = "";
    this.GridData = [];
    this.GetCalendarYear();
  }


  checkValidations(form: FormGroup): boolean {
    const year = form.get('pPeriodType');
    const month = form.get('pCalendarMonth');

    if ((year && year.invalid) || (month && month.invalid)) {
      console.log('Year or Month is invalid');

      if (year) {
        year.markAsTouched();
      }

      if (month) {
        month.markAsTouched();
      }

      return false;
    }

    return true;
  }

  RunPayRollProcess() {
    debugger;

    if (!this.checkValidations(this.EmployyeAttendForm)) {
      console.log("Please fill in both Year and Month.");
      return;
    }

    this.disablesavebutton = true;

    let code = this.EmployyeAttendForm.controls.pEmployeecode.value;

    this.GetEmployeeAttendanceDetails(code);
  }


}
