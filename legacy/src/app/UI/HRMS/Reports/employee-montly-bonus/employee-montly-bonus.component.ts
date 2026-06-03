import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupDescriptor,SortDescriptor } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
@Component({
  selector: 'app-employee-montly-bonus',
  templateUrl: './employee-montly-bonus.component.html',
  styles: []
})

export class EmployeeMontlyBonusComponent implements OnInit {

  EmployeeMonthBonusForm : FormGroup;
  BranchId : number;
  employeenamesList : any = [];
  empcontactId : number;
  yearsList : any = [];
  monthList : any = [];
  monthYear :string;
  monthbonusData : any = [];
  monthBonusValidation : any = {};
  isLoading : boolean = false;

  //Grid Calculations
  grid_totalSalary :number;
  grid_totalvda : number;
  grid_totalarrears : number;
  grid_totalabsents : number;
  grid_totaltotalsalary : number;
  grid_totalbonusamount : number;
 

  group: GroupDescriptor[] = [{
    field: 'pEmployeecode',
    aggregates: [
      { field: 'pBasicAmount', aggregate: 'sum' },
      { field: 'pVdaAmt', aggregate: 'sum' },
      { field: 'pArrearsAmt', aggregate: 'sum' },
      { field: 'pLossOfPayAmt', aggregate: 'sum' },
      { field: 'pTotalSalary', aggregate: 'sum' },
      { field: 'pBonusAmt', aggregate: 'sum' }
    ]
  }];

  public sort: SortDescriptor[] = [{
    field: 'pPayrollMonth',
    dir: 'asc'
  }];
  

  constructor(private fb:FormBuilder,private _ProfessionalTaxService:ProfessionaltaxService,private _commonService:CommonService) { }


  ngOnInit() {
    debugger;
    this.EmployeeMonthBonusForm = this.fb.group({
      employeename : [''],
      year : ['',Validators.required],
      month : ['',Validators.required]
    });

    let data = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.BranchId = data.pbranch_id;

    this.getEmployeeDetails();
    this.GetCalendarYear();
    this.BlurEventAllControll(this.EmployeeMonthBonusForm);
  }


  getEmployeeDetails(){
    debugger;
    this._ProfessionalTaxService.getEmployeeDetails(this.BranchId).subscribe(json =>{
      debugger;
      console.log(json);
      let staticarray = [{"pEmployeeName":'All',"pContactId":0}];
      this.employeenamesList = [...staticarray,...json];
    });
  }


  employeeNameChange(event){
    debugger;
    this.empcontactId = event.pContactId;
  }


  GetCalendarYear(){
    debugger;
    this._ProfessionalTaxService.GetCalendarYear().subscribe(json =>{
      debugger;
      console.log(json);
      this.yearsList = json;
    });
  }


  yearChange(event){
    debugger;
    const calenderId = event.pCalenderPeriodId;
    this.EmployeeMonthBonusForm['controls']['month'].setValue('');
    this.monthBonusValidation['month'] = '';
    this._ProfessionalTaxService.GetCalendarYearMonthDetails(calenderId,null).subscribe(json =>{
      debugger;
      console.log(json);
      this.monthList = json;
    });
  }


  monthChange(event){
    debugger;
    this.monthYear = event.pCalendarMonth;
    this.monthbonusData = [];
  }


  showMonthBonus(){
    debugger;
    if(this.checkValidations(this.EmployeeMonthBonusForm,true)){
      this.isLoading = true;
      this._ProfessionalTaxService.getEmployeeBonusDetails(this.monthYear).subscribe(data =>{
        debugger;
        console.log(data);
        this.monthbonusData = data;
        if(this.monthbonusData.length ==0){
          this._commonService.showWarningMessage('No Data To Show');
        }
        this.isLoading = false;
      },(error)=>{
        this._commonService.showErrorMessage(error);
        this.isLoading = false;
      });
    }
  }


  pdfOrprint(printorpdf) {

    if (this.monthbonusData.length > 0) {
      let rows = [];
      let retungridData;
      let reportname = "Employee Month Bonus";

      let gridheaders = ["Month", "Employee Name", "Basic Salary", "V.D.A", "Arrears", "Absents", "Total Salary", "Bounus Amount"];

      let fromDate = "";
      let toDate = "";

      let colWidthHeight = {
        0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto', halign: 'right' }, 3: { cellWidth: 'auto', halign: 'right' }, 4: { cellWidth: 'auto', halign: 'right' }, 5: { cellWidth: 'auto', halign: 'right' }, 6: { cellWidth: 'auto', halign: 'right' }, 7: { cellWidth: 'auto', halign: 'right' }
      }
      retungridData = this._ProfessionalTaxService._groupwiseGridwithSummaryExportData(this.monthbonusData, "pEmployeecode", "pBasicAmount", "pVdaAmt", "pArrearsAmt", "pLossOfPayAmt", "pTotalSalary", "pBonusAmt", "Total", false)
      console.log(retungridData)
      retungridData.forEach(element => {

        let temp;
        let baiscamt;
        let arrears;
        let VDA;
        let absent ;
        let totalsal;
        let bonusamt;
        if(element.pBasicAmount)
        {
          baiscamt = this._commonService.currencyformat(element.pBasicAmount);
        }
        else{
          baiscamt = this._commonService.currencyformat(0);
        }
        if(element.pArrearsAmt)
        {
          arrears = this._commonService.currencyformat(element.pArrearsAmt);
        }
        else{
          arrears = this._commonService.currencyformat(0);
        }
       if(element.pVdaAmt)
       {
        VDA = this._commonService.currencyformat(element.pVdaAmt);
       }
       else{
        VDA = this._commonService.currencyformat(0);
       }
       if(element.pLossOfPayAmt)
       {
        absent = this._commonService.currencyformat(element.pLossOfPayAmt);
       }
       else{
        absent = this._commonService.currencyformat(0);
       }
       if(element.pTotalSalary)
       {
        totalsal = this._commonService.currencyformat(element.pTotalSalary);
       }
       else{
        totalsal = this._commonService.currencyformat(0);
       }
       if(element.pBonusAmt)
       {
        bonusamt = this._commonService.currencyformat(element.pBonusAmt);
       }
       else{
        bonusamt = this._commonService.currencyformat(0);
       }
       

        if (element.group !== undefined) {
          temp = [element.group, element.pPayrollMonth, element.pEmployeeName, baiscamt, VDA, arrears, absent, totalsal, bonusamt];
        }
        else {
          temp = [element.pPayrollMonth, element.pEmployeeName, baiscamt, VDA, arrears, absent, totalsal, bonusamt];
        }

        rows.push(temp);
      });
      this._ProfessionalTaxService._downloadEmpBonusReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, printorpdf);
    }
    else {
      this._commonService.showInfoMessage("No Data");
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
          this.monthBonusValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.monthBonusValidation[key] += errormessage + ' ';
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
