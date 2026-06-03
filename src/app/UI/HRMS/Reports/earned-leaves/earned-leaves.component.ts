import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { CommonService } from 'src/app/Services/common.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
@Component({
  selector: 'app-earned-leaves',
  templateUrl: './earned-leaves.component.html',
  styles: []
})
export class EarnedLeavesComponent implements OnInit {

  earnedleavesForm : FormGroup;
  BranchId :number;
  employeenamesList : any = [];
  empcontactId :number;
  yearsList : any = [];
  monthList : any = [];
  monthYear : string;
  earnedLeavesValidation :any = {};
  isLoading : boolean = false;
  earnedLeavesData : any = [];


  constructor(private fb:FormBuilder,private _professionalTaxService:ProfessionaltaxService,private _commonService:CommonService ,private datePipe:DatePipe) { }

  ngOnInit() {
    debugger;
    this.earnedleavesForm = this.fb.group({
      employeename : [''],
      year : ['',Validators.required],
      month : ['',Validators.required]
    });

    let data = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.BranchId = data.pbranch_id;

    this.getEmployeeDetails();
    this.GetCalendarYear();
    this.BlurEventAllControll(this.earnedleavesForm);
  }


  getEmployeeDetails(){
    debugger;
    this._professionalTaxService.getEmployeeDetails(this.BranchId).subscribe(json =>{
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
    this._professionalTaxService.GetCalendarYear().subscribe(json =>{
      debugger;
      console.log(json);
      this.yearsList = json;
    });
  }


  yearChange(event){
    debugger;
    const calenderId = event.pCalenderPeriodId;
    this.earnedleavesForm['controls']['month'].setValue('');
    this.earnedLeavesValidation['month'] = '';
    this._professionalTaxService.GetCalendarYearMonthDetails(calenderId,null).subscribe(json =>{
      debugger;
      console.log(json);
      this.monthList = json;
    });
  }


  monthChange(event){
    debugger;
    this.monthYear = event.pCalendarMonth;
    this.earnedLeavesData = [];
  }


  showEarnedLeaves(){
    debugger;
    if(this.checkValidations(this.earnedleavesForm,true)){
      this.isLoading = true;
      this._professionalTaxService.getEmployeeELDetails(this.monthYear).subscribe(json =>{
        debugger;
        console.log(json);
        this.earnedLeavesData = json;
        if(this.earnedLeavesData.length == 0){
          this._commonService.showWarningMessage('No Data To Show');
        }
        this.isLoading = false;
      },(error)=>{
        this._commonService.showErrorMessage(error);
        this.isLoading = false;
      });
    }
  }


  saveEarnedLeaves(){
    debugger;
    if (this.earnedLeavesData.length > 0) {
      if (confirm("Do you want to save ?")) {
        debugger;
        for (let i = 0; i < this.earnedLeavesData.length; i++) {

          this.earnedLeavesData[i].pPayrollMonth = this.monthYear;
          this.earnedLeavesData[i].pElsClaimDate = this._commonService.getFormatDateNormal(new Date());
          //this.earnedLeavesData[i].schemaname = this._commonService.getschemaname();
          this.earnedLeavesData[i].pCreatedby = 14;
          this.earnedLeavesData[i].pbranchid = this.BranchId;
          this.earnedLeavesData[i].employeecontactid = this.earnedLeavesData[i].pEmployeeId;
        }
        debugger;
        let formdata = JSON.stringify(this.earnedLeavesData);
        console.log(formdata);
        let dataWithList = {
          _lstallowancedetails : this.earnedLeavesData
        }
        this._professionalTaxService.saveEarnedLeaves(dataWithList).subscribe(res => {
          if (res) {
            this._commonService.showInfoMessage("Data Saved SuccessFully");
            this.earnedLeavesData = [];
            this.earnedleavesForm.patchValue({
              employeename :'',
              year : '',
              month :''
            });
            this.earnedLeavesValidation['year'] = '';
            this.earnedLeavesValidation['month'] = '';
          }
        },(error)=>{
          this._commonService.showErrorMessage(error);
        });
      }
    }
    else {
      this._commonService.showWarningMessage("Please Add Data To Grid");
    }
  }


  pdfOrprint(printorpdf) {
    debugger;
    if (this.earnedLeavesData.length > 0) {
      let rows = [];
      let reportname = "Earned Leaves";

      let gridheaders = ["Emp ID", "Employee Name", "Basic Salary", "V.D.A", "Earned Leaves", "E.L Amount", "Joining Date", "Last E.L Date"];
  
      let fromDate = "";
      let toDate = new Date();

      let colWidthHeight = {
        0: { cellWidth: 'auto', halign: 'left' }, 1: { cellWidth: 'auto', halign: 'left' }, 2: { cellWidth: 'auto', halign: 'right' }, 3: { cellWidth: 'auto', halign: 'right' }, 4: { cellWidth: 20, halign: 'center' }, 5: { cellWidth: 'auto', halign: 'right' }, 6: { cellWidth: 20, halign: 'center' }, 7: { cellWidth: 20, halign: 'center' }
      }
      this.earnedLeavesData.forEach(element => {
        debugger;
        let temp;
        let baiscamt = this._commonService.currencyformat(element.pBasicAmount);
        let elamount = this._commonService.currencyformat(element.pElsAmount);
        let VDA = this._commonService.currencyformat(element.pVdaAmt);
        //let Dateofjoin = this._commonService.getFormatDateGlobal(element.pDateOfJoining);
        //let elDate = this._commonService.getFormatDateGlobal(element.pPrevElsClaimDate);
         let Dateofjoin = this.datePipe.transform(element.pDateOfJoining, 'dd-MMM-yyyy');
         let elDate = this.datePipe.transform(element.pPrevElsClaimDate, 'dd-MMM-yyyy');

        if (elDate == null || elDate == "") {
          elDate = "--NA--"
        }
        temp = [element.pEmployeecode, element.pEmployeeName, baiscamt, VDA, element.pEls, elamount, Dateofjoin, elDate];
        rows.push(temp);
      });
      this._professionalTaxService._downLoadEarnedLeavesPDF(reportname, rows, gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, printorpdf);
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
          this.earnedLeavesValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.earnedLeavesValidation[key] += errormessage + ' ';
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
