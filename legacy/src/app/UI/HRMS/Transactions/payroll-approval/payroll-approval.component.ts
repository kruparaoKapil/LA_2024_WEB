import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { State, process} from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { PayrollProcessService } from 'src/app/Services/HRMS/Transactions/payroll-process.service';


declare let $: any;
@Component({
  selector: 'app-payroll-approval',
  templateUrl: './payroll-approval.component.html',
  styles: []
})
export class PayrollApprovalComponent implements OnInit {
  PayrollApprovalForm: FormGroup;
  employeeList: any = [];
  payrollGrid: any = [];
  calendarYearData: any = [];
  disablesavebutton = true;
  MonthName: any;
  CalendarYear: any;
  public Type: any;
  calendarMonthData: any = [];
  EmployeeName: any;
  DeptName: any;
  BasicAmount: any;
  BasicProtection: any;
  VdaAmt: any;
  AdvanceAmt: any;
  RecoveryAmt: any;
  InsuranceAmt: any;
  VehicleAllowAmt: any;
  AllowancesAmt: any;
  NetSalary: any;
  SpecialAllowAmt: any;
  DedectionAmt: any;
  OtherAllowAmt: any;
  IncrementProtection: any;
  PFAmt: any;
  EsiAmt: any;
  GrossSalary: any;
  LossOfPayAmt: any;
  ProffTaxAmt: any;
  IncomeTaxAmt: any;
  ArrearsAmt: any;
  Pfno: any
  PanNO: any;
  formValidationMessages: any = {};
  empContactId: any;
  selectedEmployeeId: string;
  CalendarId: string;
  MonthId: any;
  BranchId: any;
  EmployeeCode: any;
  VehicleAllowance : any ;
  isLoading :boolean = false;


  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };


  constructor(private fb: FormBuilder, private commonservice: CommonService, private payroolserv:PayrollProcessService, private _contactMaster: ContacmasterService, private datePipe: DatePipe,) { 
    //this.allData = this.allData.bind(this); 
  }


  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch') || '{}');
    if (data && data.pbranch_id) {
      this.BranchId = data.pbranch_id;
    }

    this.bindformControls();
    this.getProcessApproveEmployes();
    this.BindCalendarYear();
    this.BlurEventAllControll(this.PayrollApprovalForm);
  }


  bindformControls() {
    debugger;
    this.PayrollApprovalForm = this.fb.group({
      pEmployeeId : [''],
      pPeriodType : ['',Validators.required],
      pCalendarMonth : ['',Validators.required]
    })
  }


  getProcessApproveEmployes() {
    debugger;
    this.payroolserv.getProcessApproveEmployes(this.BranchId).subscribe(res => {
      let tempArray = [{"pEmployeeId":0,"pEmployeeName":'All'}];
      this.employeeList = [...tempArray,...res];
    })
  }


  BindCalendarYear() {
    debugger;
    this.payroolserv.GetCalendarYear().subscribe(res => {
      if (res != null) {
        this.calendarYearData = res;
      }
    })
  }


  CalendarYear_change(event) {
    debugger;
    this.CalendarId = event.pCalenderPeriodId;
    this.CalendarYear = event.pPeriodType;
    this.payroolserv.GetCalendarYearMonthDetails(this.CalendarId).subscribe(res => {
      if (res != null) {
        this.calendarMonthData = res;
      }
    });
  }


  EmployeeId_change(event) {
    debugger;
    this.empContactId = event.pEmployeeId;
  }


  CalendarMonth_change(event) {
    debugger;
    this.MonthId = event.pCalenderPeriodDetailsId;
    this.MonthName = event.pCalendarMonth;
  }


  RunPayRollProcess() {
    debugger;
    this.payrollGrid = [];
    if (this.checkValidations(this.PayrollApprovalForm, true)) {
      debugger;
      this.isLoading = true;
      this.payroolserv.GetPayRollApprovalDetails(this.BranchId, this.MonthName).subscribe(
        res => {
          console.log(res);
          this.payrollGrid = res;
          this.isLoading = false;
          if(this.payrollGrid.length == 0){
            this.commonservice.showWarningMessage("No Data To Show");
          }
          this.disablesavebutton = false;
        },(error) =>{
          this.commonservice.showErrorMessage(error);
          this.isLoading = false;
        }
      );
    }
  }


  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.payrollGrid, {}).data,
  //   };

  //   return result;
  // }


  SavePayrollApprove(status) {
    debugger;
    let msg;
    if (this.checkValidations(this.PayrollApprovalForm, true)) {
      if (this.payrollGrid.length > 0) {
        if (status == 'Approve') {
          this.Type = 'A';
        }
        else {
          this.Type = 'R';
        }
        if (status == 'Approve') {
          msg = "Approve ?";
        }
        else {
          msg = "RollBack ?";
        }
        if (confirm("Do you want to  " + msg)) {
          debugger;
          for (let i = 0; i < this.payrollGrid.length; i++) {
            this.payrollGrid[i].pPayrollMonth = this.MonthName;
            this.payrollGrid[i].pContactId = this.payrollGrid[i].pEmployeeId;
          }

          debugger;
          let data = {
            "pEmployeeId": this.empContactId,
            //"pPeriodType": this.CalendarYear,
            //"pCalendarMonth": this.MonthName,
            "pbranchid": this.BranchId,
            "pPayrollMonth": this.MonthName,
            "_lstallowancedetails": this.payrollGrid
          };
          console.log('Approval data', data);

          this.payroolserv.SavePayrollApproval(data, this.Type).subscribe(res => {
            debugger;
            if(res) {
              if(status == 'Approve'){
                this.commonservice.showInfoMessage('Approved Successfully');
                let selectedValues = this.MonthName + "@"+this.BranchId;
                window.open('/#/PayRollApproval?id=' + btoa(selectedValues));
              }
              else{
                this.commonservice.showInfoMessage('Roll Back Successfully');
              }
              this.clearDetails();
              this.disablesavebutton = true;
            }
          },(error) =>{
            this.commonservice.showErrorMessage(error);
          });
        }
      }
      else {
        this.commonservice.showWarningMessage("No Data In Grid!");
      }
    }
  }


  clearDetails(){
    this.calendarMonthData = [];
    this.MonthName = "";
    this.CalendarYear = "";
    this.payrollGrid = [];
    this.empContactId = 0;
    this.PayrollApprovalForm.reset();
    this.formValidationMessages = {};
  }


  openPopupView(dataItem: any) {
    const parseToValidFloat = (value: any): number => {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? 0 : parsedValue;
    };
    this.EmployeeName = dataItem.pEmployeeName;
    this.EmployeeCode = dataItem.pEmployeecode;
    this.DeptName = dataItem.pDeptName;
    this.BasicAmount = parseToValidFloat(dataItem.pBasicAmount).toFixed(2);
    this.BasicProtection = parseToValidFloat(dataItem.pBasicProtection).toFixed(2);
    this.VdaAmt = parseToValidFloat(dataItem.pVdaAmt).toFixed(2);
    this.ArrearsAmt = parseToValidFloat(dataItem.pArrearsAmt).toFixed(2);
    this.AllowancesAmt = parseToValidFloat(dataItem.pAllowancesAmt).toFixed(2);
    this.SpecialAllowAmt = parseToValidFloat(dataItem.pSpecialAllowAmt).toFixed(2);
    this.IncrementProtection = parseToValidFloat(dataItem.pIncrementalProtection).toFixed(2);
    this.OtherAllowAmt = parseToValidFloat(dataItem.pOtherAllowAmt).toFixed(2);
    //this.GrossSalary = parseToValidFloat(dataItem.pGrossSalary).toFixed(2);
    this.AdvanceAmt = parseToValidFloat(dataItem.pAdvanceAmt).toFixed(2);
    this.InsuranceAmt = parseToValidFloat(dataItem.pInsuranceAmt).toFixed(2);
    this.RecoveryAmt = parseToValidFloat(dataItem.pRecoveryAmt).toFixed(2);
    this.PFAmt = parseToValidFloat(dataItem.pEmpPFAmt).toFixed(2);
    this.EsiAmt = parseToValidFloat(dataItem.pEsiAmt).toFixed(2);
    this.LossOfPayAmt = parseToValidFloat(dataItem.pLossOfPayAmt).toFixed(2);
    this.ProffTaxAmt = parseToValidFloat(dataItem.pProffTaxAmt).toFixed(2);
    this.IncomeTaxAmt = parseToValidFloat(dataItem.pIncomeTaxAmt).toFixed(2);
    this.DedectionAmt = parseToValidFloat(dataItem.pDedectionAmt).toFixed(2);
    this.VehicleAllowance = parseToValidFloat(dataItem.pVehicleAllowAmt).toFixed(2);


    this.GrossSalary = dataItem.pGrossSalary;
    
    this.MonthName = dataItem.pPayrollMonth;
    //this.VehicleAllowance = dataItem.pVehicleAllowAmt;
    //this.NetSalary = parseToValidFloat(dataItem.NetSalary).toFixed(2);

    //this.NetSalary = this.GrossSalary - this.DedectionAmt;
    this.NetSalary = dataItem.pNetSalary;
  
    // } else {
    //   const totalDeductions = parseToValidFloat(this.DedectionAmt);
    //   const grossSalary = parseToValidFloat(this.GrossSalary);
    //   this.NetSalary = (grossSalary - totalDeductions).toFixed(2);
    // }
    this.Pfno = dataItem.pPfno;
    this.PanNO = dataItem.pPanNo;
    $('#view-Modal').modal('show');
  }

  closemodel(){
    $('#view-Modal').modal('hide');
  }

  pdfOrprint(printorpdf) {
    debugger;
    let Designation;
    let totals:any={};
    if (this.payrollGrid.length > 0) {
      let rows = [];
      let reportname = "Payroll Approval for the Month of "+this.MonthName;
      let gridheaders = [
        ['Emp ID', 'Employee Name','Date Of Joining',   'Basic', 'VDA', 'Arrears', 'Basic\nProtection', 'Allowance', 'Special\nAllowances', 'Increment\nProtection', 'Gross Salary', 'Advance','Vehicle Allowance'],
        [
          { content: '', colSpan: 9 },
        ],
        ['', '','Other Allowance','Designation','Insurance','Recoveries', 'Income Tax', 'PF Amount', ' ESI Amount', 'Absenties', 'Prof. Tax','Deductions','Net Salary'],
      ];
      // let colWidthHeight={};
      let colWidthHeight = {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'right' },
        5: { cellWidth: 'auto', halign: 'right' },
        6: { cellWidth: 'auto', halign: 'right' },
        7: { cellWidth: 'auto', halign: 'right' },
        8: { cellWidth: 'auto', halign: 'right' },
        9: { cellWidth: 'auto', halign: 'right' },
        10: { cellWidth: 'auto', halign: 'right' },
        11: { cellWidth: 'auto', halign: 'right' },
        12: { cellWidth: 'auto', halign: 'right' },
        13: { cellWidth: 'auto', halign: 'right' },
        14: { cellWidth: 'auto', halign: 'right' },
        15: { cellWidth: 'auto', halign: 'right' },
        16: { cellWidth: 'auto', halign: 'right' },
        17: { cellWidth: 'auto', halign: 'right' },
        18: { cellWidth: 'auto', halign: 'right' },
        19: { cellWidth: 'auto', halign: 'right' },
        20: { cellWidth: 'auto', halign: 'right' },
        21: { cellWidth: 'auto', halign: 'right' },
        22: { cellWidth: 'auto', halign: 'right' },
        23: { cellWidth: 'auto', halign: 'right' },
        24: { cellWidth: 'auto', halign: 'right' },
        25: { cellWidth: 'auto', halign: 'right' }
      }
      this.payrollGrid.forEach(element => {
        debugger
        let pGrossSalary = this.commonservice.currencyformat(element.pGrossSalary);
        let pNetSalary = this.commonservice.currencyformat(element.pNetSalary);
        let pBasicAmount = this.commonservice.currencyformat(element.pBasicAmount);
        let pVdaAmt = this.commonservice.currencyformat(element.pVdaAmt);
        let pArrearsAmt = this.commonservice.currencyformat(element.pArrearsAmt);
        let pVehicleAllowAmt = this.commonservice.currencyformat(element.pVehicleAllowAmt);
        let pEducationAllowAmt = this.commonservice.currencyformat(element.pEducationAllowAmt);
        let pLoyaltyAllowAmt = this.commonservice.currencyformat(element.pLoyaltyAllowAmt);
        let pSpecialAllowAmt = this.commonservice.currencyformat(element.pSpecialAllowAmt);
        let pAllowancesAmt = this.commonservice.currencyformat(element.pAllowancesAmt);
        let pDedectionAmt = this.commonservice.currencyformat(element.pDedectionAmt);
        let pInsuranceAmt = this.commonservice.currencyformat(element.pInsuranceAmt);
        let pRecoveryAmt = this.commonservice.currencyformat(element.pRecoveryAmt);
        let pIncomeTaxAmt = this.commonservice.currencyformat(element.pIncomeTaxAmt);
        let pEmployerPFAmt = this.commonservice.currencyformat(element.pEmployerPFAmt);
        let pEmpPFAmt = this.commonservice.currencyformat(element.pEmpPFAmt);
        let pPFAmt = this.commonservice.currencyformat(element.pPFAmt);
        let pEmployerEsiAmt = this.commonservice.currencyformat(element.pEmployerEsiAmt);
        let pEmpEsiAmt = this.commonservice.currencyformat(element.pEmpEsiAmt);
        let pEsiAmt = this.commonservice.currencyformat(element.pEsiAmt);
        let pLossOfPayAmt = this.commonservice.currencyformat(element.pLossOfPayAmt);
        let pProffTaxAmt = this.commonservice.currencyformat(element.pProffTaxAmt)
        let pBasicProtection = this.commonservice.currencyformat(element.pBasicProtection);
        let pIncrementalProtection = this.commonservice.currencyformat(element.pIncrementalProtection);
        let pAdvanceAmt = this.commonservice.currencyformat(element.pAdvanceAmt);
        let pOtherAllowAmt = this.commonservice.currencyformat(element.pOtherAllowAmt);
        let pDateOfReporting = element.pDateOfReporting;
        if (element.pDeptName != undefined) {
          Designation = element.pDeptName;
        }
        else {
          Designation = "";
        }
        let temp = [
          element.pEmployeecode,
          element.pEmployeeName,
          pDateOfReporting,
          this.commonservice.currencyformat(pBasicAmount),
          this.commonservice.currencyformat(pVdaAmt),
          this.commonservice.currencyformat(pArrearsAmt),
          this.commonservice.currencyformat(pBasicProtection),
          this.commonservice.currencyformat(pAllowancesAmt),
          this.commonservice.currencyformat(pSpecialAllowAmt),
          this.commonservice.currencyformat(pIncrementalProtection),
          this.commonservice.currencyformat(pGrossSalary),
          this.commonservice.currencyformat(pAdvanceAmt),
          this.commonservice.currencyformat(pVehicleAllowAmt),


        ]
        rows.push(temp);

        let temp1 = [
          this.commonservice.currencyformat(pOtherAllowAmt),
          Designation,
          this.commonservice.currencyformat(pInsuranceAmt),
          this.commonservice.currencyformat(pRecoveryAmt),
         this.commonservice.currencyformat(pIncomeTaxAmt),
         //this.commonservice.currencyformat(pEmployerPFAmt),
         this.commonservice.currencyformat(pEmpPFAmt),
         // this.commonservice.currencyformat(pPFAmt),
          //this.commonservice.currencyformat( pEmployerEsiAmt),
          this.commonservice.currencyformat(pEmpEsiAmt),
        //  this.commonservice.currencyformat(pEsiAmt),
          this.commonservice.currencyformat(pLossOfPayAmt),
          this.commonservice.currencyformat(pProffTaxAmt),
          this.commonservice.currencyformat(pDedectionAmt),
          this.commonservice.currencyformat(pNetSalary)
        ]
          rows.push(temp1)
      })
      let gridtotals={};
      gridtotals['basic'] = this.payrollGrid.reduce((sum, c) => sum + c.pBasicAmount, 0);
      gridtotals['basic'] = this.commonservice.currencyformat(gridtotals['basic']);
      gridtotals['vda'] = this.payrollGrid.reduce((sum, c) => sum + c.pVdaAmt, 0);
      gridtotals['vda'] = this.commonservice.currencyformat(gridtotals['vda']);
      gridtotals['arrears'] = this.payrollGrid.reduce((sum, c) => sum + c.pArrearsAmt, 0);
      gridtotals['arrears'] = this.commonservice.currencyformat(gridtotals['arrears']);
      gridtotals['basicprotection'] = this.payrollGrid.reduce((sum, c) => sum + c.pBasicProtection, 0);
      gridtotals['basicprotection'] = this.commonservice.currencyformat(gridtotals['basicprotection']);
      gridtotals['allowances'] = this.payrollGrid.reduce((sum, c) => sum + c.pAllowancesAmt, 0);
      gridtotals['allowances'] = this.commonservice.currencyformat(gridtotals['allowances']);
      gridtotals['incrementprotection'] = this.payrollGrid.reduce((sum, c) => sum + c.pIncrementalProtection, 0);
      gridtotals['incrementprotection'] = this.commonservice.currencyformat(gridtotals['incrementprotection']);
      gridtotals['specialallowance'] = this.payrollGrid.reduce((sum, c) => sum + c.pSpecialAllowAmt, 0);
      gridtotals['specialallowance'] = this.commonservice.currencyformat(gridtotals['specialallowance']);
      gridtotals['gross'] = this.payrollGrid.reduce((sum, c) => sum + c.pGrossSalary, 0);
      gridtotals['gross'] = this.commonservice.currencyformat(gridtotals['gross']);
      gridtotals['advances'] = this.payrollGrid.reduce((sum, c) => sum + c.pAdvanceAmt, 0);
      gridtotals['advances'] = this.commonservice.currencyformat(gridtotals['advances']);
      gridtotals['insurance'] = this.payrollGrid.reduce((sum, c) => sum + c.pInsuranceAmt, 0);
      gridtotals['insurance'] = this.commonservice.currencyformat(gridtotals['insurance']);
      gridtotals['recoveries'] = this.payrollGrid.reduce((sum, c) => sum + c.pRecoveryAmt, 0);
      gridtotals['recoveries'] = this.commonservice.currencyformat(gridtotals['recoveries']);
      gridtotals['incometax'] = this.payrollGrid.reduce((sum, c) => sum + c.pIncomeTaxAmt, 0);
      gridtotals['incometax'] = this.commonservice.currencyformat(gridtotals['incometax']);
      gridtotals['pf'] = this.payrollGrid.reduce((sum, c) => sum + c.pEmpPFAmt, 0);
      gridtotals['pf'] = this.commonservice.currencyformat(gridtotals['pf']);
      gridtotals['esi'] = this.payrollGrid.reduce((sum, c) => sum + c.pEmpEsiAmt, 0);
      gridtotals['esi'] = this.commonservice.currencyformat(gridtotals['esi']);
      gridtotals['absenties'] = this.payrollGrid.reduce((sum, c) => sum + c.pLossOfPayAmt, 0);
      gridtotals['absenties'] = this.commonservice.currencyformat(gridtotals['absenties']);
      gridtotals['proftax'] = this.payrollGrid.reduce((sum, c) => sum + c.pProffTaxAmt, 0);
      gridtotals['proftax'] = this.commonservice.currencyformat(gridtotals['proftax']);
      gridtotals['deductions'] = this.payrollGrid.reduce((sum, c) => sum + c.pDedectionAmt, 0);
      gridtotals['deductions'] = this.commonservice.currencyformat(gridtotals['deductions']);
      gridtotals['net'] = this.payrollGrid.reduce((sum, c) => sum + c.pNetSalary, 0);
      gridtotals['net'] = this.commonservice.currencyformat(gridtotals['net']);
      gridtotals['pOtherAllowAmt'] = this.payrollGrid.reduce((sum, c) => sum + c.pOtherAllowAmt, 0);
       gridtotals['pOtherAllowAmt'] = this.commonservice.currencyformat(gridtotals['pOtherAllowAmt']);
       gridtotals['pVehicleAllowAmt'] = this.payrollGrid.reduce((sum, c) => sum + c.pVehicleAllowAmt, 0);
       gridtotals['pVehicleAllowAmt'] = this.commonservice.currencyformat(gridtotals['pVehicleAllowAmt']);
      // // pass Type of Sheet Ex : a4 or lanscspe
      if (printorpdf == "Pdf") {
        this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this.commonservice.getFormatDateGlobal(new Date()), null, printorpdf,gridtotals,this.payrollGrid.length);
      }
      else {
        this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this.commonservice.getFormatDateGlobal(new Date()), "", printorpdf,gridtotals,this.payrollGrid.length);
      }
    }
  }


  //Validations

  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PayRoll Approval', 'BlurEventAllControll', error);

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
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PayRoll Approval', 'setBlurEvent', error);

      return false;
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
        if (!isValid)
          console.log(key + ' : ' + isValid);
      })

    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PayRoll Approval', 'checkValidations', error);

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
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages(' PayRoll Approval', 'GetValidationByControl', error);
      this.commonservice.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

}
