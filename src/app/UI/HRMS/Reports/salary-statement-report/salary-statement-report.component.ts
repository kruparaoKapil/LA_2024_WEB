import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { PayrollApprovalService } from 'src/app/Services/HRMS/Transactions/payroll-approval.service'
import { PayrollProcessService } from 'src/app/Services/HRMS/Transactions/payroll-process.service';
@Component({
  selector: 'app-salary-statement-report',
  templateUrl: './salary-statement-report.component.html',
  styles: []
})
export class SalaryStatementReportComponent implements OnInit {

  loading :boolean = false;
  salaryStatementListData : any =[];
  Basic_pdfCalculations: number;
  Special_Allowance_pdfCalculations: number;
  Income_Tax_pdfCalculations: number;
  VDA_pdfCalculations: number;
  Increment_Protection_pdfCalculations: number;
  PF_pdfCalculations: number;
  Arrears_pdfCalculations: number;
  Insurance_pdfCalculations: number;
  Allowances_pdfCalculations: number;
  Recoveries_pdfCalculations: number;
  Prof_Tax_pdfCalculations: number;
  Total_Net_Salary_pdfCalculations: number;
  Total_Deductions_pdfCalculations: number;
  Total_Gross_Salary_pdfCalculations : number;
  Basic_Protection_pdfCalculations :number;
  countOfEmployees : number;
  monthyear :string;
  showpage : boolean = false;
  salaryForm : FormGroup;
  employeeHRMSValidation : any = {};
  yearsList : any = [];
  monthsList : any = [];
  branchId : number ;
  monthYear :string;
  showbutton : boolean = false;
  Advance_pdfCalculations : number;
  ESI_pdfCalculations :number;
  constructor(private router:Router,private activatedroute: ActivatedRoute,private _payrollapprovalservice : PayrollApprovalService,private fb:FormBuilder,private _commser:CommonService, private payroolserv:PayrollProcessService) { 
  }

  ngOnInit() {
    debugger;
    let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = SetBranch.pbranch_id;    
    let url = sessionStorage.getItem('pFunctionUrl');
      debugger; 
      let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
      console.log("routeParams", routeParams);
      let splitData = {};
      splitData = routeParams.split("@");
      console.log(splitData);
      this.getEmployeeDetailsPayrollApproved(splitData);
  } 

  getEmployeeDetailsPayrollApproved(splitData){
    debugger;
    //alert("i am approval report");
    this._payrollapprovalservice.getEmployeeDetailsPayrollApproved(splitData[0],splitData[1]).subscribe(res =>{
      debugger;
      console.log(res);
      this.showpage = false;
      this.showbutton = false;
      this.salaryStatementListData = res;
      this.countOfEmployees = res.length;
      this.monthyear = splitData[0];

      this.pdfCalculations();

    });
  }

  pdfOrprint(printorpdf) {
    debugger;
    let Designation;
    if (this.salaryStatementListData.length > 0) {
      let rows = [];
      let reportname = "Salary Statement for the Month of "+this.monthYear;
      let gridheaders = [
        ['Emp ID', 'Employee Name','Date Of Joining',   'Basic', 'VDA', 'Arrears', 'Basic\nProtection', 'Allowance', 'Special\nAllowances', 'Increment\nProtection','Gross Salary', 'Advance','Vehicle Allowance'],
        [
          { content: '', colSpan: 9 },
        ],
        ['','','Other Allowance', 'Designation', 'Insurance','Recoveries', 'Income Tax',  'PF Amount',  'ESI Amount', 'Absenties', 'Prof. Tax','Deductions','Net Salary'],
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
      this.salaryStatementListData.forEach(element => {
        let pGrossSalary = this._commser.currencyformat(element.pGrossSalary);
        let pNetSalary = this._commser.currencyformat(element.pNetSalary);
        let pBasicAmount = this._commser.currencyformat(element.pBasicAmount);
        let pVdaAmt = this._commser.currencyformat(element.pVdaAmt);
        let pArrearsAmt = this._commser.currencyformat(element.pArrearsAmt);
        let pVehicleAllowAmt = this._commser.currencyformat(element.pVehicleAllowAmt);
        let pEducationAllowAmt = this._commser.currencyformat(element.pEducationAllowAmt);
        let pLoyaltyAllowAmt = this._commser.currencyformat(element.pLoyaltyAllowAmt);
        let pSpecialAllowAmt = this._commser.currencyformat(element.pSpecialAllowAmt);
        let pAllowancesAmt = this._commser.currencyformat(element.pAllowancesAmt);
        let pDedectionAmt = this._commser.currencyformat(element.pDedectionAmt);
        let pInsuranceAmt = this._commser.currencyformat(element.pInsuranceAmt);
        let pRecoveryAmt = this._commser.currencyformat(element.pRecoveryAmt);
        let pIncomeTaxAmt = this._commser.currencyformat(element.pIncomeTaxAmt);
        let pEmployerPFAmt = this._commser.currencyformat(element.pEmployerPFAmt);
        let pEmpPFAmt = this._commser.currencyformat(element.pEmpPFAmt);
        let pPFAmt = this._commser.currencyformat(element.pPFAmt);
        let pEmployerEsiAmt = this._commser.currencyformat(element.pEmployerEsiAmt);
        let pEmpEsiAmt = this._commser.currencyformat(element.pEmpEsiAmt);
        let pEsiAmt = this._commser.currencyformat(element.pEsiAmt);
        let pLossOfPayAmt = this._commser.currencyformat(element.pLossOfPayAmt);
        let pProffTaxAmt = this._commser.currencyformat(element.pProffTaxAmt)
        let pBasicProtection = this._commser.currencyformat(element.pBasicProtection);
        let pIncrementalProtection = this._commser.currencyformat(element.pIncrementalProtection);
        let pAdvanceAmt = this._commser.currencyformat(element.pAdvanceAmt);
        let pOtherAllowAmt = this._commser.currencyformat(element.pOtherAllowAmt);
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
         this._commser.currencyformat(pBasicAmount),
         this._commser.currencyformat(pVdaAmt),
         this._commser.currencyformat(pArrearsAmt),
         this._commser.currencyformat(pBasicProtection),
         this._commser.currencyformat(pAllowancesAmt),
         this._commser.currencyformat(pSpecialAllowAmt),
         this._commser.currencyformat(pIncrementalProtection),
         this._commser.currencyformat(pGrossSalary),
         this._commser.currencyformat(pAdvanceAmt),
         this._commser.currencyformat(pVehicleAllowAmt),

        ]
        rows.push(temp);

        let temp1 = [
          this._commser.currencyformat(pOtherAllowAmt),
          Designation,
          this._commser.currencyformat(pInsuranceAmt),
          this._commser.currencyformat(pRecoveryAmt),
          this._commser.currencyformat(pIncomeTaxAmt),
        // pEmployerPFAmt,
        this._commser.currencyformat(pEmpPFAmt),
        //  pPFAmt,
         //  pEmployerEsiAmt,
         this._commser.currencyformat(pEmpEsiAmt),
         // pEsiAmt,
         this._commser.currencyformat(pLossOfPayAmt),
         this._commser.currencyformat(pProffTaxAmt),
         this._commser.currencyformat(pDedectionAmt),
         this._commser.currencyformat(pNetSalary)

        ]
          rows.push(temp1)
      })
      let gridtotals={};
      gridtotals['basic'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pBasicAmount, 0);
       gridtotals['basic'] = this._commser.currencyformat(gridtotals['basic']);
      gridtotals['vda'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pVdaAmt, 0);
       gridtotals['vda'] = this._commser.currencyformat(gridtotals['vda']);
      gridtotals['arrears'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pArrearsAmt, 0);
       gridtotals['arrears'] = this._commser.currencyformat(gridtotals['arrears']);
      gridtotals['basicprotection'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pBasicProtection, 0);
       gridtotals['basicprotection'] =this._commser.currencyformat(gridtotals['basicprotection']);
      gridtotals['allowances'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pAllowancesAmt, 0);
       gridtotals['allowances'] = this._commser.currencyformat(gridtotals['allowances']);
      gridtotals['incrementprotection'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pIncrementalProtection, 0);
      gridtotals['incrementprotection'] = this._commser.currencyformat(gridtotals['incrementprotection']);
      gridtotals['specialallowance'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pSpecialAllowAmt, 0);
       gridtotals['specialallowance'] =this._commser.currencyformat(gridtotals['specialallowance']);
      gridtotals['gross'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pGrossSalary, 0);
      gridtotals['gross'] = this._commser.currencyformat(gridtotals['gross']);
      gridtotals['advances'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pAdvanceAmt, 0);
      gridtotals['advances'] = this._commser.currencyformat(gridtotals['advances']);
      gridtotals['insurance'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pInsuranceAmt, 0);
      gridtotals['insurance'] = this._commser.currencyformat(gridtotals['insurance']);
      gridtotals['recoveries'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pRecoveryAmt, 0);
      gridtotals['recoveries'] = this._commser.currencyformat(gridtotals['recoveries']);
      gridtotals['incometax'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pIncomeTaxAmt, 0);
      gridtotals['incometax'] = this._commser.currencyformat(gridtotals['incometax']);
      gridtotals['pf'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pEmpPFAmt, 0);
      gridtotals['pf'] = this._commser.currencyformat(gridtotals['pf']);
      gridtotals['esi'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pEmpEsiAmt, 0);
       gridtotals['esi'] = this._commser.currencyformat(gridtotals['esi']);
      gridtotals['absenties'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pLossOfPayAmt, 0);
       gridtotals['absenties'] = this._commser.currencyformat(gridtotals['absenties']);
      gridtotals['proftax'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pProffTaxAmt, 0);
      gridtotals['proftax'] = this._commser.currencyformat(gridtotals['proftax']);
      gridtotals['deductions'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pDedectionAmt, 0);
      gridtotals['deductions'] = this._commser.currencyformat(gridtotals['deductions']);
      gridtotals['net'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pNetSalary, 0);
       gridtotals['net'] = this._commser.currencyformat(gridtotals['net']);
       gridtotals['pOtherAllowAmt'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pOtherAllowAmt, 0);
       gridtotals['pOtherAllowAmt'] = this._commser.currencyformat(gridtotals['pOtherAllowAmt']);
       gridtotals['pVehicleAllowAmt'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pVehicleAllowAmt, 0);
       gridtotals['pVehicleAllowAmt'] = this._commser.currencyformat(gridtotals['pVehicleAllowAmt']);
      // // pass Type of Sheet Ex : a4 or lanscspe
      if (printorpdf == "Pdf") {
        debugger;
        this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commser.getFormatDateGlobal(new Date()), null, printorpdf,gridtotals,this.salaryStatementListData.length);
      }
      else {
        debugger;
        this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commser.getFormatDateGlobal(new Date()), "", printorpdf,gridtotals,this.salaryStatementListData.length);
      }
    }
  }

  pdfCalculations(){
    debugger;
    this.Basic_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pBasicAmount)), 0);
  
    this.Special_Allowance_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pSpecialAllowAmt)), 0);
  
      this.Income_Tax_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pIncomeTaxAmt)), 0);
  
      this.VDA_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pVdaAmt)), 0);
  
      this.Increment_Protection_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pIncrementalProtection)), 0);
  
      this.PF_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pEmpPFAmt)), 0);
  
      this.Arrears_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pArrearsAmt)), 0);
  
      this.Insurance_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pInsuranceAmt)), 0);
  
      this.Allowances_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pAllowancesAmt)), 0);
  
      this.Recoveries_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pRecoveryAmt)), 0);
  
      this.Prof_Tax_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pProffTaxAmt)), 0);
  
      this.Total_Gross_Salary_pdfCalculations=  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pGrossSalary)), 0);
  
      this.Total_Deductions_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pDedectionAmt)), 0);
  
      this.Total_Net_Salary_pdfCalculations =  this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pNetSalary)), 0);

      this.Basic_Protection_pdfCalculations = this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pBasicProtection)), 0);

      this.Advance_pdfCalculations = this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pAdvanceAmt)), 0);

      this.ESI_pdfCalculations = this.salaryStatementListData.reduce((sum, c) => sum + parseFloat((c.pEmpEsiAmt)), 0);
  }

}
