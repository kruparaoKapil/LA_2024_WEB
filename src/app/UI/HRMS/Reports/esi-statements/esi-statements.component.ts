import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { State, process} from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { EsistatementService } from 'src/app/Services/HRMS/Reports/esistatement.service';
@Component({
  selector: 'app-esi-statements',
  templateUrl: './esi-statements.component.html',
  styles: []
})


export class ESIStatementsComponent implements OnInit {

  ESIStatementForm:FormGroup;
  employeeList: any = [];
  empcontactId : number;
  calendarYearData: any = [];
  esistatementdatalist:any[];
  monthYear: string;
  CalendarYear: any;
  calendarMonthData: any = [];
  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  empContactId: any;
  selectedEmployeeId: string;
  MonthId: any;
  BranchId: any;
  EsiStatementFormValidationErrorMessages = {};
  isLoading : boolean = false;
  totalGrossSalary : number;
  totalEmpEsiAmount : number;
  employercontributionamount : number;
  totalEsiAmount : number;
  grosssalary : number;
  EmpEsiAmount : number;


  constructor(private _commonService:CommonService,private fb:FormBuilder,private _esistatementservice:EsistatementService) {
  }


  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch') || '{}');
    if (data && data.pbranch_id) {
      this.BranchId = data.pbranch_id;
    }
    
    this.ESIStatementForm = this.fb.group({
      employee: [''],
      year: ['',Validators.required],
      month: ['',Validators.required],
    });

    this.getProcessApproveEmployes();
    this.BindCalendarYear();
    this.BlurEventAllControll(this.ESIStatementForm);
  }


  getProcessApproveEmployes() {
    debugger;
    this._esistatementservice.getProcessApproveEmployes(this.BranchId).subscribe(res => {
      debugger;
      let staticarray = [{"pEmployeeName":'All',"pContactId":0}];
      this.employeeList =[...staticarray,...res];
    });
  }


  EmployeeId_change(event) {
    debugger;
    this.empcontactId = event.pContactId;
  }


  BindCalendarYear() {
    debugger;
    this._esistatementservice.GetCalendarYear().subscribe(res => {
      debugger;
      if (res != null) {
        this.calendarYearData = res;
      }
    });
  }


  CalendarYear_change(event) {
    debugger;
      const calenderId = event.pCalenderPeriodId;
      this.ESIStatementForm.controls.month.setValue('');
      this.EsiStatementFormValidationErrorMessages['month'] = '';
      this._esistatementservice.GetCalendarYearMonthDetails(calenderId, null).subscribe(res => {
        debugger;
        console.log(res);
        this.calendarMonthData = res;
    });
  }


  CalendarMonth_change(event) {
    debugger;
    this.esistatementdatalist = [];
    this.monthYear = event.pCalendarMonth;
  }


  showESIStatement(){
    debugger;
    if (this.checkValidations(this.ESIStatementForm, true)) {
      debugger;
      this._esistatementservice.showEsiStatementDetails(this.monthYear).subscribe(
        res => {
          debugger;
          console.log(res);
          this.esistatementdatalist = res;
          if(this.esistatementdatalist.length == 0){
            this._commonService.showWarningMessage("No Data To Show");
          }
          this.totalGrossSalary = this.esistatementdatalist.reduce((sum, c) => sum + parseFloat(c.pGrossSalary), 0);

          this.totalEmpEsiAmount = this.esistatementdatalist.reduce((sum, c) => sum + parseFloat(c.pEmpEsiAmt), 0);

          this.employercontributionamount = this.esistatementdatalist.reduce((sum, c) => sum + parseFloat(c.pEmployerEsiAmt), 0);
          this.totalEsiAmount = this.totalEmpEsiAmount + this.employercontributionamount;
        },
      );
    }
  }


  pdfOrprint(printorpdf) {
    debugger;
    let rows = [];
    let reportname = "ESI Statement for the Month of " + this.monthYear;
    let gridheaders = ["Employee ID", "E.S.I Number", "Employee Name", "Absent Days", "Total Monthly Wages", "Employee Contribution(0.75%)"];
    let fromDate = ""
    let colWidthHeight = {
      0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 'auto', halign: 'center' }, 4: { cellWidth: 'auto', halign: 'right' }, 5: { cellWidth: 'auto', halign: 'right' }
    }
    debugger;
    this.esistatementdatalist.forEach(element => {

      if (element.pGrossSalary) {
        this.grosssalary = this._commonService.currencyformat(element.pGrossSalary)
      }
      else {
        this.grosssalary = this._commonService.currencyformat(element.pGrossSalary)
      }
      if (element.pEmpEsiAmt) {
        this.EmpEsiAmount = this._commonService.currencyformat(element.pEmpEsiAmt);
      }
      else {
        this.EmpEsiAmount = this._commonService.currencyformat(element.pEmpEsiAmt);
      }

      let temp = [element.pEmployeecode, element.pEsino, element.pEmployeeName, element.pNoofLOP, this.grosssalary, this.EmpEsiAmount];
      rows.push(temp);
    });
    let gridtotals = {};

    gridtotals['totalGrossSalary'] = this._commonService.currencyformat(this.totalGrossSalary);
    gridtotals['totalGrossSalary'] = this._commonService.currencyformat(gridtotals['totalGrossSalary']);
    gridtotals['totalEmpEsiAmount'] = this._commonService.currencyformat(this.totalEmpEsiAmount);
    gridtotals['totalEmpEsiAmount'] = this._commonService.currencyformat(gridtotals['totalEmpEsiAmount']);

    let employeercontributionamt = this._commonService.currencyformat(this.employercontributionamount);
    let totalempesiamt = this._commonService.currencyformat(this.totalEmpEsiAmount);
    let totalesiamt = this._commonService.currencyformat(this.totalEsiAmount);
    
    this._esistatementservice._downloadEsiStatementReportPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", fromDate, employeercontributionamt, totalempesiamt, totalesiamt, printorpdf, gridtotals);
  }


  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.esistatementdatalist, {}).data,
    };
    return result;
  }


  //Validations

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
          this.EsiStatementFormValidationErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.EsiStatementFormValidationErrorMessages[key] += errormessage + ' ';
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
