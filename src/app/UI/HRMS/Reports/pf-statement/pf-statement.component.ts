import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { State, process} from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { PfstatementService } from 'src/app/Services/HRMS/Reports/pfstatement.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-pf-statement',
  templateUrl: './pf-statement.component.html',
  styles: []
})

export class PFStatementComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  PfStatementForm: FormGroup;
  employeeList: any = [];
  calendarYearData: any =[];
  PFStateGrid:any = [];
  today: string;
  public CalendarMonth: any;
  public disableshowbutton = false;
  dropDownControlName: any = '';
  currencysymbol: any;
  monthYear: string;
  calendarMonthData: any = [];
  isLoading : boolean = false;

  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  empContactId: any;
  selectedEmployeeCId: number;
  BranchId: any;
  EmployeeCode: any;
  pfStatementValidation :any  = {};
  //pdf
  totalGrossSalary :any;
  employeecontributiontotal : any;
  employeercontributiontotal : any;
  emppfwagestotal : any;
  TotalContribution : any;
  EmployerContribution : any;
  PFContribution : any;
  EmployeeContribution : any;
  basictotal:any;
  vdaTotal : any;
  total : any;


constructor(private _commonService:CommonService,private fb:FormBuilder,private _pfstatementservice:PfstatementService) {
   this.allData = this.allData.bind(this);
   }


  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch') || '{}');
    if (data && data.pbranch_id) {
      this.BranchId = data.pbranch_id;
    }
    this.PfStatementForm = this.fb.group({
      employee : [''],
      year : ['',[Validators.required]],
      month : ['',[Validators.required]],
    });
    this.getProcessApproveEmployes();
    this.BindCalendarYear();
    
    this.BlurEventAllControll(this.PfStatementForm);
  }


  getProcessApproveEmployes() {
    debugger;
    this._pfstatementservice.getProcessApproveEmployes(this.BranchId).subscribe(res => {
      debugger;
      console.log(res);
      this.employeeList =res;
    })
  }


  employeeChange(event) {
    debugger;
    this.selectedEmployeeCId = event.pContactId;
  }


  BindCalendarYear() {
    debugger;
    this._pfstatementservice.GetCalendarYear().subscribe(res => {
      debugger;
      console.log(res);
      this.calendarYearData = res;
    });
  }


  calenderYearChange(event) {
    debugger;
    const calenderId = event.pCalenderPeriodId;
    this.PfStatementForm['controls']['month'].setValue('');
    this.pfStatementValidation['month'] = '';
    this._pfstatementservice.GetCalendarYearMonthDetails(calenderId, null).subscribe(res => {
      debugger;
      console.log(res);
      this.calendarMonthData = res;
    });
  }
 

  calenderMonthChange(event) {
    debugger;
    this.PFStateGrid = [];
    this.monthYear = event.pCalendarMonth;
  }



  runPFStatement(){
    debugger;
    if (this.checkValidations(this.PfStatementForm, true)) {
      debugger;
      this.isLoading = true;
      this._pfstatementservice.GetPFStatementDetails(this.monthYear,this.BranchId).subscribe(
        res => {
          debugger;
          this.isLoading = false;
          console.log(res);
          this.PFStateGrid = res;
          if(this.PFStateGrid.length == 0){
            this._commonService.showWarningMessage("No Data To Show");
          }
          let empcon = this.PFStateGrid.reduce((sum, c) => sum + c.pEmpPFAmt, 0);
        let emprcon = this.PFStateGrid.reduce((sum, c) => sum + c.pEmployerPFAmt, 0);
        this.basictotal = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pBasicAmount, 0));
        this.vdaTotal = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pVdaAmt, 0));
        this.total = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pTotal_Basic_Incremental, 0));
        this.emppfwagestotal = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEffPFWages, 0));
        this.employeecontributiontotal = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEmpPFAmt, 0));
        this.employeercontributiontotal = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEmployerPFAmt, 0));
        debugger
        this.TotalContribution = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEffPFWages, 0)).toFixed(2);
        this.totalGrossSalary = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pGrossSalary, 0));
        console.log( this.totalGrossSalary);

        this.EmployeeContribution = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEmpPFAmt, 0)).toFixed(2);
        this.EmployerContribution = parseFloat(this.PFStateGrid.reduce((sum, c) => sum + c.pEmployerPFAmt, 0)).toFixed(2);
        this.PFContribution = parseFloat(empcon + emprcon).toFixed(2);
        },(error) =>{
          this._commonService.showErrorMessage(error);
          this.isLoading = false;
        });
    }
  }


  pdfOrprint(printorpdf) {
    debugger;
    if (this.PFStateGrid.length > 0) {
      let rows = [];
      let reportname = "PF Statement for the Month of " + this.monthYear;
      //let gridheaders = ["Emp ID", "PF No.", "UAN No.", "Emp Name", "Aadhar No.", "Absent Days", "Basic Amt", "VDA", "Arrears", "Basic  ", "Increment", "Total", "Eff PF\nWages", "Emp\nContribution", "Employer\nContribution"];
      let gridheaders = ["Emp ID", "PF No.", "UAN No.", "Employee Name", "Absent\nDays", "Basic", "VDA", "Arrears", "BP", "InP", "Total","Gross", "Emp PF\nWages", "Employee\nContribution", "Employer\nContribution"];
      let PUANno;
      let AadharNO;
      let format = "";
      let fromDate = "";
      let toDate = new Date();
      let LOP;

      let colWidthHeight = {
        // 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 40, halign: 'left' }, 4: { cellWidth: 30 }, 5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 30, halign: 'right' }, 7: { cellWidth: 30, halign: 'right' }, 8: { cellWidth: 30, halign: 'right' }, 9: { cellWidth: 30, halign: 'right' }, 10: { cellWidth: 30, halign: 'right' }, 11: { cellWidth: 30, halign: 'right' }, 12: { cellWidth: 30, halign: 'right' }, 13: { cellWidth: 30, halign: 'right' }, 14: { cellWidth: 30, halign: 'right' }
        0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 40, halign: 'left' }, 4: { cellWidth: 30 },
        5: { cellWidth: 'auto', halign: 'right' }, 6: { cellWidth: 30, halign: 'right' }, 7: { cellWidth: 30, halign: 'right' }, 8: { cellWidth: 30, halign: 'right' }, 9: { cellWidth: 30, halign: 'right' }, 10: { cellWidth: 30, halign: 'right' }, 11:{cellWidth: 30, halign: 'right'},  12: { cellWidth: 30, halign: 'right' }, 13: { cellWidth: 30, halign: 'right' }, 14: { cellWidth: 30, halign: 'right' }
      }
      this.PFStateGrid.forEach(element => {
        debugger;
        let temp;
        let baiscamt = this._commonService.currencyformat(element.pBasicAmount);
        let effpfwages = this._commonService.currencyformat(element.pEffPFWages);
        let VDA = this._commonService.currencyformat(element.pVdaAmt);
        let Arrears = this._commonService.currencyformat(element.pArrearsAmt);
        let Basicprotection = this._commonService.currencyformat(element.pBasicProtection);
        let IncrementProtec = this._commonService.currencyformat(element.pIncrementalProtection);
        let Total = this._commonService.currencyformat(element.pTotal_Basic_Incremental);
        let Gross=this._commonService.currencyformat(element.pGrossSalary);
        let EmpPF = this._commonService.currencyformat(element.pEmpPFAmt);
        let EmployerPF = this._commonService.currencyformat(element.pEmployerPFAmt);
        debugger;
        if (element.pUANno != undefined) {
          PUANno = element.pUANno;
        }
        else {
          PUANno = "";
        }
        LOP = (element.pNoofLOP).toString();
        // if (element.pAadharNo == 0) {
        //   AadharNO = "--NA--";
        // }
        // else {
        //   AadharNO = element.pAadharNo;
        // }

        // temp = [element.pEmployeecode, element.pPfno, PUANno, element.pEmployeeName, AadharNO, LOP, baiscamt, VDA, Arrears, Basicprotection, IncrementProtec, Total, effpfwages, EmpPF, EmployerPF];
        temp = [element.pEmployeecode, element.pPfno, PUANno, element.pEmployeeName, LOP, baiscamt, VDA, Arrears, Basicprotection, IncrementProtec, Total,Gross,effpfwages, EmpPF, EmployerPF];
        rows.push(temp);
      });
      // pass Type of Sheet Ex : a4 or lanscspe  
      let gridtotals = {};

      gridtotals['totalGrossSalary'] = this._commonService.currencyformat(this.totalGrossSalary);
      gridtotals['totalGrossSalary'] = this._commonService.currencyformat(gridtotals['totalGrossSalary']);
      gridtotals['employeecontributiontotal'] = this._commonService.currencyformat(this.employeecontributiontotal);
      gridtotals['employeecontributiontotal'] = this._commonService.currencyformat(gridtotals['employeecontributiontotal']);
      gridtotals['employeercontributiontotal'] = this._commonService.currencyformat(this.employeercontributiontotal);
      gridtotals['employeercontributiontotal'] = this._commonService.currencyformat(gridtotals['employeercontributiontotal']);
      gridtotals['emppfwagestotal'] = this._commonService.currencyformat(this.emppfwagestotal);
      gridtotals['emppfwagestotal'] = this._commonService.currencyformat(gridtotals['emppfwagestotal']);
      let totalContribution = this._commonService.currencyformat(this.TotalContribution);
      let employerContribution = this._commonService.currencyformat(this.EmployerContribution);
      let employeeContribution = this._commonService.currencyformat(this.EmployeeContribution);
      let pfContribution = this._commonService.currencyformat(this.PFContribution);
      this._pfstatementservice._downloadPFStatementReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, totalContribution, employerContribution, employeeContribution, pfContribution, printorpdf,gridtotals);
    }
    else {
      this._commonService.showInfoMessage("No Data");
    }
  }


  public allData(): ExcelExportData {
   const result: ExcelExportData = {
     data: process(this.PFStateGrid,{}).data,
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
          this.pfStatementValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.pfStatementValidation[key] += errormessage + ' ';
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
