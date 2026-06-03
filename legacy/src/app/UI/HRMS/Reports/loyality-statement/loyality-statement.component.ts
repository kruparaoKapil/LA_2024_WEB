import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { State, process} from '@progress/kendo-data-query';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-loyality-statement',
  templateUrl: './loyality-statement.component.html',
  styles: []
})
export class LoyalityStatementComponent implements OnInit {
  loyalityStatementForm: FormGroup;
  calendarYearData: any =[];
  gridData:any = [];
  monthYear: string;
  calendarMonthData: any = [];
  isLoading : boolean = false;
  loyalityStatementValidation :any = {};
  totalLoyaltyallowance : number;

  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };


  constructor(private _commonService:CommonService,private fb:FormBuilder,private _ProfessionalTaxService:ProfessionaltaxService, private datepipe:DatePipe) {
  }


  ngOnInit() {
    debugger;
    this.loyalityStatementForm = this.fb.group({
      year: ['',Validators.required],
      month: ['',Validators.required]
    });

    this.BindCalendarYear(); 
    this.BlurEventAllControll(this.loyalityStatementForm);
  }


  BindCalendarYear() {
    debugger;
    this._ProfessionalTaxService.GetCalendarYear().subscribe(json =>{
      debugger;
      console.log(json);
      this.calendarYearData = json;
    }); 
  }


  CalendarYear_change(event) {
    debugger;
    const calenderId = event.pCalenderPeriodId;
    this.loyalityStatementForm['controls']['month'].setValue('');
    this.loyalityStatementValidation['month'] = '';
    this.gridData = [];
    this._ProfessionalTaxService.getLoyalityCalendarYearMonth(calenderId).subscribe(json =>{
      debugger;
      console.log(json);
      this.calendarMonthData = json;
    });
  }


  CalendarMonth_change(event) {
    debugger;
    this.monthYear = event.pCalendarMonth;
    this.gridData = [];
  }


  RunLoyalityStatement(){
    debugger;
    if(this.checkValidations(this.loyalityStatementForm,true)){
      this.isLoading = true;
      this._ProfessionalTaxService.getLoyalityReport(this.monthYear).subscribe(data =>{
        debugger;
        this.gridData = data;
        if(this.gridData.length == 0){
          this._commonService.showWarningMessage("No Data To Show");
        }
        this.totalLoyaltyallowance = this.gridData.reduce((sum, c) => sum + parseFloat(c.allowanceamount), 0);
        this.isLoading = false;
      },(error) =>{
        this.isLoading = false;
        this._commonService.showErrorMessage(error);
      });
    }
  }


  pdfOrprint(printorpdf) {
    debugger;
    if (this.gridData.length > 0) {
      let rows = [];
      let reportname = "Loyalty Statement for the Month of "+this.monthYear;

      let gridheaders = ["Emp Code", "Employee Name", "Loyalty Allowances Amount", "Joining Date", "Years"];
      let format = "";
      let fromDate = "";
      let toDate = new Date();

      let colWidthHeight = {
        0: { cellWidth: '20', halign: 'center' }, 1: { cellWidth: '30', halign: 'center' }, 2: { cellWidth: '25', halign: 'right' }, 3: { cellWidth: '30', halign: 'center' }, 4: { cellWidth: 20, halign: 'center' }
      }
      this.gridData.forEach(element => {
        debugger;
        let temp;
        let baiscamt = this._commonService.currencyformat(element.allowanceamount);
        
        let Dateofjoin = this.datepipe.transform(element.dateofjoining, 'dd-MM-yyyy') ;
     
        temp = [element.employee_code, element.contactmailingname, baiscamt,Dateofjoin,element.years];
        rows.push(temp);
      });
      //Grand Totals
      let gridtotals={};
      gridtotals['grandtotal'] = this._commonService.currencyformat(this.totalLoyaltyallowance);
      let total=["","Grand Total : ",gridtotals['grandtotal'],"",""];
      rows.push(total);

      this._ProfessionalTaxService._downLoadLoyaltystatementPDF(reportname, rows, gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, printorpdf);
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
          this.loyalityStatementValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.loyalityStatementValidation[key] += errormessage + ' ';
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
