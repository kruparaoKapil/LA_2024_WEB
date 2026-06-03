import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { State, process,GroupDescriptor, SortDescriptor} from '@progress/kendo-data-query';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';

@Component({
  selector: 'app-professional-tax',
  templateUrl: './professional-tax.component.html',
  styles: []
})
export class ProfessionalTaxComponent implements OnInit {

  ProfessionalTaxForm: FormGroup;
  employeeList: any[] = [];
  calendarYearData: any;
  ProfessionalTaxList: any = [];
  monthYear: any;
  ProfessionalTaxFormValidationErrorMessages : any = {};
  calendarMonthData: any = [];
  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  empcontactId: any;
  BranchId: any;
  //pdf Properties
  totalGrossSalary: string = '0';
  totalNetSalary: string = '0';
  totalTax: string = '0';
  group: { field: string, dir: string }[] = [{ field: 'pEmployeecode', dir: 'asc' }];
  groups: any[] = this.group;
  isLoading : boolean = false;


  //pdf properties 
  grosssalary :any;
  netsalary :any ;
  proffessionaltax :any;


constructor(private _commonService:CommonService,private fb:FormBuilder,private _contactMaster:ProfessionaltaxService) {}


  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch') || '{}');
    if (data && data.pbranch_id) {
      this.BranchId = data.pbranch_id;
    }

    this.ProfessionalTaxForm = this.fb.group({
      employee: [''],
      year: [''],
      month: [''],
    });

    this.getProcessApproveEmployes();
    this.BindCalendarYear();
  }


  getProcessApproveEmployes() {
    debugger;
    this._contactMaster.getProcessApproveEmployes(this.BranchId).subscribe(res => {
      this.employeeList =res;
    })
  }


  EmployeeId_change(event) {
    debugger;
    this.empcontactId = event.pContactId;
  }


  BindCalendarYear() {
    debugger;
    this._contactMaster.GetCalendarYear().subscribe(res => {
      debugger;
      console.log(res);
      this.calendarYearData = res;
    })
  }


  CalendarYear_change(event) {
    debugger;
    this.ProfessionalTaxForm['controls']['month'].setValue('');
    this.ProfessionalTaxFormValidationErrorMessages['month'] = '';
    const calenderId = event.pCalenderPeriodId;
    this._contactMaster.GetCalendarYearMonthDetails(calenderId, null).subscribe(res => {
        this.calendarMonthData = res;
    });
  }


  CalendarMonth_change(event) {
    debugger;
    this.ProfessionalTaxList = [];
    this.totalGrossSalary = '';
    this.totalNetSalary = '';
    this.totalTax = '';
    this.monthYear = event.pCalendarMonth;
  }


  showProfessionalTax(){
      debugger;
      this.totalGrossSalary = '0';
      this.totalNetSalary= '0';
      this. totalTax= '0';
      this.ProfessionalTaxList=[];
      if (this.checkValidations(this.ProfessionalTaxForm, true)) {
        debugger;
        this.isLoading = true;
        this._contactMaster.showProffesionalTaxDetails(this.monthYear).subscribe(json=>{
          this.ProfessionalTaxList=json;
          if(this.ProfessionalTaxList.length == 0){
            this._commonService.showWarningMessage("No Data To Show");
          }
          let aaa:any = json;
          console.log(json);

          let bbb :any = json;
          console.log(bbb);

          this.ProfessionalTaxList = bbb.map(obj => {
            obj.pGrossSalary = obj.pNetSalary - obj.pProffesionalTax ;
            return obj;
          });

          console.log(this.ProfessionalTaxList);

          this.totalGrossSalary = aaa.reduce((sum, item) => sum + Number(item.pGrossSalary), 0).toFixed(2);
          this.totalNetSalary = aaa.reduce((sum, item) => sum + Number(item.pNetSalary), 0).toFixed(2);
          this.totalTax = aaa.reduce((sum, item) => sum + Number(item.pProffesionalTax), 0).toFixed(2);
          this.isLoading = false;
          
        },(error) =>{
          this._commonService.showErrorMessage(error);
          this.isLoading = false;
        }
      );
    }
  }


  pdfOrprint(printorpdf) {
    debugger;
    let rows = [];
    let reportname = "Professional Tax for the Month of "+this.monthYear ;
    let gridheaders = ["Emp ID", "PF No.", "UAN No", "Employee Name", "Gross Salary", "Net Salary", "Professional Tax"];

    let fromDate = this._commonService.getFormatDateNormal(new Date());

    let colWidthHeight = {
      0: { cellWidth: 20 }, 1: { cellWidth: 40 }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 }, 4: { cellWidth: 'auto', halign: 'right' }, 5: { cellWidth: 'auto', halign: 'right' }, 6: { cellWidth: 'auto', halign: 'right' }
    }

    this.ProfessionalTaxList.forEach(element => {
      debugger; 
      if (element.pGrossSalary) {
        this.grosssalary = this._commonService.currencyformat(element.pGrossSalary)
      }
      else {
        this.grosssalary = this._commonService.currencyformat(element.pGrossSalary)
      }
      if (element.pNetSalary) {
        this.netsalary = this._commonService.currencyformat(element.pNetSalary)
      }
      else {
        this.netsalary = this._commonService.currencyformat(element.pNetSalary)
      }
      if (element.pProffesionalTax) {
        this.proffessionaltax = this._commonService.currencyformat(element.pProffesionalTax)
      }
      else {
        this.proffessionaltax = this._commonService.currencyformat(element.pProffesionalTax)
      }

      let temp = [element.pEmployeecode, element.pPfno, element.pUANno, element.pEmployeeName, this.grosssalary, this.netsalary, this.proffessionaltax];
      rows.push(temp);
    });

    let gridtotals = {};

    gridtotals['totalGrossSalary'] = this._commonService.currencyformat(this.totalGrossSalary);
    gridtotals['totalGrossSalary'] = this._commonService.currencyformat(gridtotals['totalGrossSalary']);
    gridtotals['totalNetSalary'] = this._commonService.currencyformat(this.totalNetSalary);
    gridtotals['totalNetSalary'] = this._commonService.currencyformat(gridtotals['totalNetSalary']);
    gridtotals['totalTax'] = this._commonService.currencyformat(this.totalTax);
    gridtotals['totalTax'] = this._commonService.currencyformat(gridtotals['totalTax']);
    debugger;
    this._contactMaster._downloadProffesionalTaxReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "As on", fromDate, printorpdf, gridtotals);

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
          this.ProfessionalTaxFormValidationErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ProfessionalTaxFormValidationErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
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
