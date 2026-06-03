import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { PayrollApprovalService } from 'src/app/Services/HRMS/Transactions/payroll-approval.service'
import { PayrollProcessService } from 'src/app/Services/HRMS/Transactions/payroll-process.service';
@Component({
  selector: 'app-salary-statement-report-new',
  templateUrl: './salary-statement-report-new.component.html',
  styles: []
})

export class SalaryStatementReportNewComponent implements OnInit {

  loading: boolean = false;
  salaryStatementListData: any = [];
  salaryForm: FormGroup;
  employeeHRMSValidation: any = {};
  yearsList: any = [];
  monthsList: any = [];
  branchId: number;
  monthYear: string;
  isLoading: boolean = false;
  showLoading: boolean = false;
  reimbursementLoading: boolean = false;
  reimbursementListData: any = [];
  showSalaryGrid = false;
  showReimbursementGrid = false;
  reportType: string = '';
  constructor(private _payrollapprovalservice: PayrollApprovalService, private fb: FormBuilder, private _commser: CommonService, private payroolserv: PayrollProcessService) {
  }

  ngOnInit() {
    debugger;
    let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = SetBranch.pbranch_id;

    this.salaryForm = this.fb.group({
      year: ['', Validators.required],
      month: ['', Validators.required]
    });
    this.getCalendarYear();
    this.BlurEventAllControll(this.salaryForm);
  }


  getCalendarYear() {
    debugger;
    this.loading = true;
    this._payrollapprovalservice.getCalendarYear().subscribe(res => {
      debugger;
      console.log(res);
      this.yearsList = res;
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }


  yearChange(event) {
    debugger;
    let calenderid = event.pCalenderPeriodId;
    this.salaryForm.controls.month.setValue('');
    this.employeeHRMSValidation.month = '';
    this._payrollapprovalservice.getCalendarYearMonthPayrollAuthorised(calenderid, null).subscribe(res => {
      debugger;
      console.log(res);
      this.monthsList = res;
    });
  }

  monthChange(event) {
    debugger;
    this.monthYear = event.pCalendarMonth;
  }

  showSalaryStatement() {
    debugger;
    this.reportType = 'SALARY';
    this.salaryStatementListData = [];
    if (this.checkValidations(this.salaryForm, true)) {
      debugger;
      this.showLoading = true;
      this.showSalaryGrid = true;
      this.showReimbursementGrid = false;
      this._payrollapprovalservice.getEmployeeDetailsPayrollApproved(this.monthYear, this.branchId).subscribe(res => {
        debugger;
        console.log(res);
        this.salaryStatementListData = res;
        if (this.salaryStatementListData.length == 0) {
          this._commser.showWarningMessage("No Data To Show");
        }
        this.showLoading = false;
      }, (error) => {
        this._commser.showErrorMessage(error);
        this.showLoading = false;
      });
    }
  }

  showSalaryReimReimbursement() {
    this.reportType = 'REIMBURSEMENT';
    this.reimbursementListData = [];

    if (this.checkValidations(this.salaryForm, true)) {

      this.reimbursementLoading = true;
      this.showSalaryGrid = false;
      this.showReimbursementGrid = true;

      this._payrollapprovalservice.GetEmployeeSalaryReimbursement(this.monthYear, this.branchId).subscribe(res => {

        this.reimbursementListData = res;
        console.log('Reimbursement Data:', JSON.stringify(res[0]));
        if (!this.reimbursementListData || this.reimbursementListData.length === 0) {
          this._commser.showWarningMessage("No Data To Show");
        }

        this.reimbursementLoading = false;

      }, err => {
        this._commser.showErrorMessage(err);
        this.reimbursementLoading = false;
      });
    }
  }
  // 
  pdfOrprint(printorpdf) {
    debugger;
    if (this.reportType === 'SALARY') {
      let Designation;
      if (this.salaryStatementListData.length > 0) {
        let rows = [];
        let reportname = "Salary Statement for the Month of " + this.monthYear;
        let gridheaders = [
          ['Emp ID', 'Employee Name', 'Date Of Joining', 'Basic', 'VDA', 'Arrears', 'Basic\nProtection', 'Allowance', 'Special\nAllowances', 'Increment\nProtection', 'Gross Salary', 'Advance', 'Vehicle Allowance'],
          [
            { content: '', colSpan: 9 },
          ],
          ['', '', 'Other Allowance', 'Designation', 'Insurance', 'Recoveries', 'Income Tax', 'PF Amount', 'ESI Amount', 'Absenties', 'Prof. Tax', 'Deductions', 'Net Salary'],
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
        let gridtotals = {};
        gridtotals['basic'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pBasicAmount, 0);
        gridtotals['basic'] = this._commser.currencyformat(gridtotals['basic']);
        gridtotals['vda'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pVdaAmt, 0);
        gridtotals['vda'] = this._commser.currencyformat(gridtotals['vda']);
        gridtotals['arrears'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pArrearsAmt, 0);
        gridtotals['arrears'] = this._commser.currencyformat(gridtotals['arrears']);
        gridtotals['basicprotection'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pBasicProtection, 0);
        gridtotals['basicprotection'] = this._commser.currencyformat(gridtotals['basicprotection']);
        gridtotals['allowances'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pAllowancesAmt, 0);
        gridtotals['allowances'] = this._commser.currencyformat(gridtotals['allowances']);
        gridtotals['incrementprotection'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pIncrementalProtection, 0);
        gridtotals['incrementprotection'] = this._commser.currencyformat(gridtotals['incrementprotection']);
        gridtotals['specialallowance'] = this.salaryStatementListData.reduce((sum, c) => sum + c.pSpecialAllowAmt, 0);
        gridtotals['specialallowance'] = this._commser.currencyformat(gridtotals['specialallowance']);
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
          this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commser.getFormatDateGlobal(new Date()), null, printorpdf, gridtotals, this.salaryStatementListData.length);
        }
        else {
          debugger;
          this.payroolserv._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commser.getFormatDateGlobal(new Date()), "", printorpdf, gridtotals, this.salaryStatementListData.length);
        }
      }
    }

    if (this.reportType === 'REIMBURSEMENT') {

      if (!this.reimbursementListData.length) return;

      let rows = [];
      let reportname = "Reimbursement Report " + this.monthYear;

      let gridheaders = [
        ['Employee Name', 'Education', 'Loyalty', 'Vehicle'],
        [{ content: '', colSpan: 4 }],
      ];

      let colWidthHeight = {
        0: { cellWidth: 60, halign: 'left' },
        1: { cellWidth: 'auto', halign: 'right' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' },
      };

      this.reimbursementListData.forEach(e => {

        rows.push([
          e.pEmployeeName,
          this._commser.currencyformat(e.pEducationAllowAmt),
          this._commser.currencyformat(e.pLoyaltyAllowAmt),
          this._commser.currencyformat(e.pVehicleAllowAmt),
        ]);

      });
      let grandTotal = this._commser.currencyformat(
        this.reimbursementListData.reduce((s, c) => s + (c.pEducationAllowAmt || 0) + (c.pLoyaltyAllowAmt || 0) + (c.pVehicleAllowAmt || 0), 0)
      );

      let educationTotal = this.reimbursementListData.reduce((s, c) => s + (Number(c.pEducationAllowAmt) || 0), 0);
      let loyaltyTotal = this.reimbursementListData.reduce((s, c) => s + (Number(c.pLoyaltyAllowAmt) || 0), 0);
      let vehicleTotal = this.reimbursementListData.reduce((s, c) => s + (Number(c.pVehicleAllowAmt) || 0), 0);

      let gridtotals1 = {
        education: this._commser.currencyformat(educationTotal),
        loyalty: this._commser.currencyformat(loyaltyTotal),
        vehicle: this._commser.currencyformat(vehicleTotal),
        total: this._commser.currencyformat(educationTotal + loyaltyTotal + vehicleTotal),
      };
      if (printorpdf == "Pdf") {
        this.payroolserv._downloadReimbursementPdf(
          reportname, rows, gridheaders, colWidthHeight,
          "landscape", "As On",
          this._commser.getFormatDateGlobal(new Date()),
          null, printorpdf, gridtotals1, this.reimbursementListData.length
        );
      } else {
        this.payroolserv._downloadReimbursementPdf(
          reportname, rows, gridheaders, colWidthHeight,
          "landscape", "As On",
          this._commser.getFormatDateGlobal(new Date()),
          "", printorpdf, gridtotals1, this.reimbursementListData.length
        );
      }
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
      this._commser.showErrorMessage(e);
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
          this.employeeHRMSValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commser.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.employeeHRMSValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this._commser.showErrorMessage(e);
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
      this._commser.showErrorMessage(e);
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
      this._commser.showErrorMessage(e);
      return false;
    }



  }


}
