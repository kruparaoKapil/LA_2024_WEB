import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective, SelectableSettings } from '@progress/kendo-angular-grid';
import { State, process,GroupDescriptor } from '@progress/kendo-data-query';
import { PayrollProcessService } from 'src/app/Services/HRMS/Transactions/payroll-process.service';
declare let $: any;

@Component({
  selector: 'app-payroll-process',
  templateUrl: './payroll-process.component.html',
  styles: []
})
export class PayrollProcessComponent implements OnInit {
  ///
    PayrollProcessForm : FormGroup;
    payrollprocessListData :any = [];
  
    employeenamesList : any = [];
  
    yearsList :any = [];
    monthList :any = [];
    pbranch_id :any;
  
    ErrorMessages: { [key: string]: string } = {};
  
    public pageSize = 10;  public gridState: State = {
      sort: [],
      take: 10
    };
  
    public headerCells: any = {
      textAlign: 'center'
    };
    EmployeeName: any;
    EmployeeCode: any;
    DeptName: any;
    BasicAmount: string;
    BasicProtection: string;
    VdaAmt: string;
    ArrearsAmt: string;
    AllowancesAmt: number;
    SpecialAllowAmt: string;
    IncrementProtection: string;
    OtherAllowAmt: string;
    GrossSalary: any;
    AdvanceAmt: string;
    InsuranceAmt: string;
    RecoveryAmt: string;
    EsiAmt: string;
    PFAmt: string;
    LossOfPayAmt: string;
    ProffTaxAmt: string;
    DedectionAmt: any;
    IncomeTaxAmt: string;
    NetSalary: any;
    Pfno: any;
    PanNO: any;
    MonthName : string;
    VehicleAllowance : string;
    isLoading : boolean = false;
    ///
    Basic_pdfCalculations :number;
    Special_Allowance_pdfCalculations : number;
    Income_Tax_pdfCalculations : number;
    VDA_pdfCalculations :number;
    Increment_Protection_pdfCalculations :number;
    PF_pdfCalculations :number;
    Arrears_pdfCalculations :number;
    Advance_pdfCalculations :number;
    ESI_pdfCalculations :number;
    Basic_Protection_pdfCalculations :number;
    Insurance_pdfCalculations :number;
    Absent_pdfCalculations : number;
    Allowances_pdfCalculations : number;
    Recoveries_pdfCalculations :number;
    Prof_Tax_pdfCalculations :number;
    Total_Gross_Salary_pdfCalculations :number;
    Total_Deductions_pdfCalculations :number;
    Total_Net_Salary_pdfCalculations  :number;
    countOfEmployees: number;
  
  
    constructor(private fb : FormBuilder, private _commonservice : CommonService,private _payrollprocessservice : PayrollProcessService) {
      //this.allData = this.allData.bind(this);
     }
  
    ngOnInit() {
      debugger;
      this.PayrollProcessForm = this.fb.group({
        employeename : [null],
        selectedyear : [null,Validators.required],
        selectedmonth : [null,Validators.required],
        empcode : [''],
        contactid : []
      });
      this.payrollprocessListData = [];
      let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
      this.pbranch_id = SetBranch.pbranch_id;
      this.getProcessApproveEmployes(this.pbranch_id);
      this.getCalendarYear();
      this.BlurEventAllControll(this.PayrollProcessForm);
      this.clearpdfCalculations();
    }
  
  
    getProcessApproveEmployes(pbranch_id){
      debugger;
      this._payrollprocessservice.getProcessApproveEmployes(pbranch_id).subscribe(res =>{
        debugger;
        let staticarray = [{"pEmployeeId":0,"pEmployeeName":'All'}];
        this.employeenamesList = [...staticarray,...res];
      });
    }
  
  
    employeeNameChange(event){
      debugger;
      this.PayrollProcessForm.controls.contactid.setValue(event.pContactId);
      this.PayrollProcessForm.controls.empcode.setValue(event.pEmployeecode);
    }
  
  
    getCalendarYear(){
      debugger;
      this._payrollprocessservice.getCalendarYear().subscribe( res =>{
        debugger;
        this.yearsList = res;
      });
    }
  
  
    yearChange(event){
      debugger;
      this.PayrollProcessForm.controls.selectedmonth.setValue('');
      this.ErrorMessages.selectedmonth = '';
  
      this._payrollprocessservice.getCalendarYearMonth(event.pCalenderPeriodId).subscribe( json =>{
        debugger;
        this.monthList = json;
      });
    }
  
    monthyear : any;
    runpayroll(){
      debugger;
      this.payrollprocessListData = [];
      
      if(this.checkValidations(this.PayrollProcessForm,true)){
        debugger;
        this.isLoading = true;
        this.monthyear = this.PayrollProcessForm.controls.selectedmonth.value;
        this._payrollprocessservice.getEmployeeDetailsPayroll(this.pbranch_id,this.monthyear).subscribe(res =>{
          debugger;
          console.log(res);
          if(res){
            debugger;
            this.payrollprocessListData = res;
            this.isLoading = false;
            if(this.payrollprocessListData.length == 0){
              this._commonservice.showWarningMessage("No Data To Show");
            }
            this.countOfEmployees = res.length;
  
            this.Basic_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pBasicAmount)), 0);
  
            this.Special_Allowance_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pSpecialAllowAmt)), 0);
  
            this.Income_Tax_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pIncomeTaxAmt)), 0);
  
            this.VDA_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pVdaAmt)), 0);
  
            this.Increment_Protection_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pIncrementalProtection)), 0);
  
            this.PF_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pPFAmt)), 0);
  
            this.Arrears_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pArrearsAmt)), 0);
  
            this.Insurance_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pInsuranceAmt)), 0);
  
            this.Allowances_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pAllowancesAmt)), 0);
  
            this.Recoveries_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pRecoveryAmt)), 0);
  
            this.Prof_Tax_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pProffTaxAmt)), 0);
  
            this.Total_Gross_Salary_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pGrossSalary)), 0);
  
            this.Total_Deductions_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pDedectionAmt)), 0);
  
            this.Total_Net_Salary_pdfCalculations =  this.payrollprocessListData.reduce((sum, c) => sum + parseFloat((c.pNetSalary)), 0);
          }
        },(error)=>{
          this._commonservice.showErrorMessage(error);
          this.isLoading = false;
        });
      }
    }
  
  
    // public allData(): ExcelExportData {
    //     const result: ExcelExportData = {
    //       data: process(this.payrollprocessListData, {}).data,
    //     };
  
    //     return result;
    //   }
  
  clearpdfCalculations(){
    debugger;
    this.Basic_pdfCalculations = 0;
    this.Special_Allowance_pdfCalculations =0;
    this.Income_Tax_pdfCalculations =0;
    this.VDA_pdfCalculations =0;
    this.Increment_Protection_pdfCalculations =0;
    this.PF_pdfCalculations =0;
    this.Arrears_pdfCalculations =0;
    this.Advance_pdfCalculations =0;
    this.ESI_pdfCalculations =0;
    this.Basic_Protection_pdfCalculations =0;
    this.Insurance_pdfCalculations =0;
    //this.Absent_pdfCalculations =0;
    this.Allowances_pdfCalculations =0;
    this.Recoveries_pdfCalculations =0;
    this.Prof_Tax_pdfCalculations =0;
    this.Total_Gross_Salary_pdfCalculations =0;
    this.Total_Deductions_pdfCalculations =0;
    this.Total_Net_Salary_pdfCalculations =0;
  }
  
  
  savePayroll(){
    debugger;
    let length = this.payrollprocessListData.length;
    if(length != 0){
      for(let i=0 ;i<this.payrollprocessListData.length ; i++){
        this.payrollprocessListData[i].pContactId = this.payrollprocessListData[i].pEmployeeId;
      }
      let json = {
        "pContactId": this.PayrollProcessForm.controls.contactid.value,
        "pEmployeecode":this.PayrollProcessForm.controls.empcode.value,
        "pPayrollMonth":this.PayrollProcessForm.controls.selectedmonth.value,
        "_lstallowancedetails":this.payrollprocessListData
      };
      console.log(json);
      this._payrollprocessservice.saveEmpPayroll(json).subscribe( res =>{
        debugger;
        console.log(res);
        this._commonservice.showInfoMessage('Successfully Saved !');
        this.clearDetails();
      },(error)=>{
        this._commonservice.showErrorMessage(error);
      });
    }
    else{
      this._commonservice.showWarningMessage("Please Add Data To Grid!");
    }
  }
  
  
  clearDetails(){
    debugger;
    this.payrollprocessListData = [];
  
    this.PayrollProcessForm.controls.employeename.setValue('');
    this.PayrollProcessForm.controls.selectedyear.setValue('');
    this.PayrollProcessForm.controls.selectedmonth.setValue('');
  
    this.ErrorMessages.employeename = '';
    this.ErrorMessages.selectedyear = '';
    this.ErrorMessages.selectedmonth = '';
  }
  
  
  openPopupView(dataItem){
    debugger;
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
    this.AllowancesAmt = Number(parseToValidFloat(dataItem.pAllowancesAmt).toFixed(2));
    this.SpecialAllowAmt = parseToValidFloat(dataItem.pSpecialAllowAmt).toFixed(2);
    this.IncrementProtection = parseToValidFloat(dataItem.pIncrementalProtection).toFixed(2);
    this.OtherAllowAmt = parseToValidFloat(dataItem.pOtherAllowAmt).toFixed(2);    
    this.AdvanceAmt = parseToValidFloat(dataItem.pAdvanceAmt).toFixed(2);
    this.InsuranceAmt = parseToValidFloat(dataItem.pInsuranceAmt).toFixed(2);
    this.RecoveryAmt = parseToValidFloat(dataItem.pRecoveryAmt).toFixed(2);
    this.PFAmt = parseToValidFloat(dataItem.pEmpPFAmt).toFixed(2);
    this.EsiAmt = parseToValidFloat(dataItem.pEmpEsiAmt).toFixed(2);
    this.LossOfPayAmt = parseToValidFloat(dataItem.pLossOfPayAmt).toFixed(2);
    this.ProffTaxAmt = parseToValidFloat(dataItem.pProffTaxAmt).toFixed(2);
    this.IncomeTaxAmt = parseToValidFloat(dataItem.pIncomeTaxAmt).toFixed(2);
    this.DedectionAmt = parseToValidFloat(dataItem.pDedectionAmt).toFixed(2);
    this.MonthName = dataItem.pPayrollMonth;
    this.VehicleAllowance = dataItem.pVehicleAllowAmt;    
    //this.GrossSalary = parseToValidFloat(dataItem.pGrossSalary).toFixed(2);

    this.GrossSalary = dataItem.pGrossSalary;

    this.NetSalary = dataItem.pNetSalary;
    

    // if (dataItem.pNetSalary && !isNaN(dataItem.pNetSalary)) {
      
    // } else {
    // //   const totalDeductions = parseToValidFloat(this.DedectionAmt);
    // //   const grossSalary = parseToValidFloat(this.GrossSalary);
    // //   this.NetSalary = (grossSalary - totalDeductions).toFixed(2);
    // // }
    this.Pfno = dataItem.pPfno;
    this.PanNO = dataItem.pPanNo;
    $('#view-Modal').modal('show');
  
  }

  pdfOrprint(printorpdf) {
    debugger;
    let Designation;
    if (this.payrollprocessListData.length > 0) {
      let rows = [];
      let reportname = "Payroll Process for the Month of "+this.monthyear;
      let gridheaders = [
        ['Emp ID', 'Employee Name','Date Of Joining', 'Basic', 'VDA', 'Arrears', 'Basic\nProtection', 'Allowance', 'Special\nAllowances', 'Increment\nProtection','Gross Salary', 'Advance','Vehicle Allowance'],
        [
          { content: '', colSpan: 9 },
        ],
        ['','', 'Other Allowance','Designation', 'Insurance', 'Recoveries', 'Income Tax',   'PF Amount',  'ESI Amount', 'Absenties', 'Prof. Tax','Deductions','Net Salary'],
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
      this.payrollprocessListData.forEach(element => {
        debugger
        let pGrossSalary =this._commonservice.currencyformat(element.pGrossSalary);
        let pNetSalary = this._commonservice.currencyformat(element.pNetSalary);
        let pBasicAmount = this._commonservice.currencyformat(element.pBasicAmount);
        let pVdaAmt = this._commonservice.currencyformat(element.pVdaAmt);
        let pArrearsAmt = this._commonservice.currencyformat(element.pArrearsAmt);
        let pVehicleAllowAmt = this._commonservice.currencyformat(element.pVehicleAllowAmt);
        let pEducationAllowAmt = this._commonservice.currencyformat(element.pEducationAllowAmt);
        let pLoyaltyAllowAmt = this._commonservice.currencyformat(element.pLoyaltyAllowAmt);
        let pSpecialAllowAmt = this._commonservice.currencyformat(element.pSpecialAllowAmt);
        let pAllowancesAmt = this._commonservice.currencyformat(element.pAllowancesAmt);
        let pDedectionAmt = this._commonservice.currencyformat(element.pDedectionAmt);
        let pInsuranceAmt = this._commonservice.currencyformat(element.pInsuranceAmt);
        let pRecoveryAmt = this._commonservice.currencyformat(element.pRecoveryAmt);
        let pIncomeTaxAmt = this._commonservice.currencyformat(element.pIncomeTaxAmt);
        let pEmployerPFAmt = this._commonservice.currencyformat(element.pEmployerPFAmt);
        let pEmpPFAmt = this._commonservice.currencyformat(element.pEmpPFAmt);
        let pPFAmt = this._commonservice.currencyformat(element.pPFAmt);
        let pEmployerEsiAmt = this._commonservice.currencyformat(element.pEmployerEsiAmt);
        let pEmpEsiAmt = this._commonservice.currencyformat(element.pEmpEsiAmt);
        let pEsiAmt = this._commonservice.currencyformat(element.pEsiAmt);
        let pLossOfPayAmt = this._commonservice.currencyformat(element.pLossOfPayAmt);
        let pProffTaxAmt = this._commonservice.currencyformat(element.pProffTaxAmt)
        let pBasicProtection = this._commonservice.currencyformat(element.pBasicProtection);
        let pIncrementalProtection = this._commonservice.currencyformat(element.pIncrementalProtection);
        let pAdvanceAmt = this._commonservice.currencyformat(element.pAdvanceAmt);
        let pOtherAllowAmt = this._commonservice.currencyformat(element.pOtherAllowAmt);
        let pDateOfReporting =element.pDateOfReporting;

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
          this._commonservice.currencyformat(pBasicAmount),
          this._commonservice.currencyformat(pVdaAmt),
          this._commonservice.currencyformat(pArrearsAmt),
          this._commonservice.currencyformat(pBasicProtection),
          this._commonservice.currencyformat(pAllowancesAmt),
          this._commonservice.currencyformat(pSpecialAllowAmt),
          this._commonservice.currencyformat(pIncrementalProtection),
          this._commonservice.currencyformat(pGrossSalary),
          this._commonservice.currencyformat(pAdvanceAmt),
          this._commonservice.currencyformat(pVehicleAllowAmt),

        ]
        rows.push(temp);

        let temp1 = [
          this._commonservice.currencyformat(pOtherAllowAmt),
          Designation,
          this._commonservice.currencyformat(pInsuranceAmt),
         this._commonservice.currencyformat(pRecoveryAmt),
         this._commonservice.currencyformat(pIncomeTaxAmt),
        // this._commonservice.currencyformat(pEmployerPFAmt),
         this._commonservice.currencyformat(pEmpPFAmt),
        //  this._commonservice.currencyformat(pPFAmt),
        //  this._commonservice.currencyformat( pEmployerEsiAmt),
          this._commonservice.currencyformat(pEmpEsiAmt),
         // this._commonservice.currencyformat(pEsiAmt),
          this._commonservice.currencyformat(pLossOfPayAmt),
          this._commonservice.currencyformat(pProffTaxAmt),
          this._commonservice.currencyformat(pDedectionAmt),
          this._commonservice.currencyformat(pNetSalary),
        ]
          rows.push(temp1)
      })
      let gridtotals={};
      gridtotals['basic'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pBasicAmount, 0);
      gridtotals['basic'] = this._commonservice.currencyformat(gridtotals['basic']);
      gridtotals['vda'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pVdaAmt, 0);
      gridtotals['vda'] = this._commonservice.currencyformat(gridtotals['vda']);
      gridtotals['arrears'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pArrearsAmt, 0);
      gridtotals['arrears'] = this._commonservice.currencyformat(gridtotals['arrears']);
      gridtotals['basicprotection'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pBasicProtection, 0);
      gridtotals['basicprotection'] = this._commonservice.currencyformat(gridtotals['basicprotection']);
      gridtotals['allowances'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pAllowancesAmt, 0);
      gridtotals['allowances'] = this._commonservice.currencyformat(gridtotals['allowances']);
      gridtotals['incrementprotection'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pIncrementalProtection, 0);
      gridtotals['incrementprotection'] = this._commonservice.currencyformat(gridtotals['incrementprotection']);
      gridtotals['specialallowance'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pSpecialAllowAmt, 0);
      gridtotals['specialallowance'] = this._commonservice.currencyformat(gridtotals['specialallowance']);
      gridtotals['gross'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pGrossSalary, 0);
      gridtotals['gross'] = this._commonservice.currencyformat(gridtotals['gross']);
      gridtotals['advances'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pAdvanceAmt, 0);
      gridtotals['advances'] = this._commonservice.currencyformat(gridtotals['advances']);
      gridtotals['insurance'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pInsuranceAmt, 0);
      gridtotals['insurance'] =this._commonservice.currencyformat(gridtotals['insurance']);
      gridtotals['recoveries'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pRecoveryAmt, 0);
      gridtotals['recoveries'] =this._commonservice.currencyformat(gridtotals['recoveries']);
      gridtotals['incometax'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pIncomeTaxAmt, 0);
      gridtotals['incometax'] =this._commonservice.currencyformat(gridtotals['incometax']);
      gridtotals['pf'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pEmpPFAmt, 0);
      gridtotals['pf'] =this._commonservice.currencyformat(gridtotals['pf']);
      gridtotals['esi'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pEmpEsiAmt, 0);
      gridtotals['esi'] =this._commonservice.currencyformat(gridtotals['esi']);
      gridtotals['absenties'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pLossOfPayAmt, 0);
      gridtotals['absenties'] =this._commonservice.currencyformat(gridtotals['absenties']);
      gridtotals['proftax'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pProffTaxAmt, 0);
      gridtotals['proftax'] =this._commonservice.currencyformat(gridtotals['proftax']);
      gridtotals['deductions'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pDedectionAmt, 0);
      gridtotals['deductions'] =this._commonservice.currencyformat(gridtotals['deductions']);
      gridtotals['net'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pNetSalary, 0);
      gridtotals['net'] =this._commonservice.currencyformat(gridtotals['net']);
      gridtotals['pOtherAllowAmt'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pOtherAllowAmt, 0);
       gridtotals['pOtherAllowAmt'] = this._commonservice.currencyformat(gridtotals['pOtherAllowAmt']);
       gridtotals['pVehicleAllowAmt'] = this.payrollprocessListData.reduce((sum, c) => sum + c.pVehicleAllowAmt, 0);
       gridtotals['pVehicleAllowAmt'] = this._commonservice.currencyformat(gridtotals['pVehicleAllowAmt']);
      // // pass Type of Sheet Ex : a4 or lanscspe
      if (printorpdf == "Pdf") {
        this._payrollprocessservice._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commonservice.getFormatDateGlobal(new Date()), null, printorpdf,gridtotals,this.payrollprocessListData.length);
      }
      else {
        this._payrollprocessservice._downloadPayrollProcessApprovalPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As On", this._commonservice.getFormatDateGlobal(new Date()), "", printorpdf,gridtotals,this.payrollprocessListData.length);
      }
    }
  }
  
  
  closemodel(){
    $('#view-Modal').modal('hide');
  }
  
  
  BlurEventAllControll(fromgroup: FormGroup) : boolean
  {
    debugger;
    try {
      debugger;
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
      return true;
    }
    catch (e) {
      debugger;
      this._commonservice.showErrorMessage(e);
      return false;
    }
  }
  
  
  setBlurEvent(fromgroup: FormGroup, key: string) : boolean
  {
    debugger;
    try {
      debugger
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          debugger;
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
          }
      }
      return true;
    }
    catch (e) {
      debugger;
      this._commonservice.showErrorMessage(e);
      return false;
    }
  }
  
  
  checkValidations(group: FormGroup, isValid: boolean): boolean
  {
    debugger;
    try
    {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    }
    catch (e)
    {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  
  
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean
  {
    debugger;
    try
    {
      const formcontrol = formGroup.get(key);
      if (formcontrol)
      {
        if (formcontrol instanceof FormGroup)
        {
          this.checkValidations(formcontrol, isValid);
        }
        else if (formcontrol.validator)
        {
          this.ErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty)
          {
            const element = document.getElementById(key);
            const lablename = element ? element.title : key;
            let errormessage;
            for (const errorkey in formcontrol.errors)
            {
              if (errorkey)
              {
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e)
    {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  
  
  showErrorMessage(errormsg: any)
  {
    debugger;
    this._commonservice.showErrorMessage(errormsg);
  }

}

