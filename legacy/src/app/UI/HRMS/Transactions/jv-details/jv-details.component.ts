import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { JvDetailsService } from 'src/app/Services/HRMS/Transactions/jv-details.service';
@Component({
  selector: 'app-jv-details',
  templateUrl: './jv-details.component.html'
})
export class JvDetailsComponent implements OnInit {

  jvDetailsForm : FormGroup;
  selectedjvDd :any;

  yearsList : any = [];
  monthsList : any = [];
  pbranch_id : number;
  employeesList  : any = [];
  jvTypesList : any = [];
  allowance_type_id : any;
  MonthYear : any;
  EmployeeCode :any;
  jvDetailsList : any = [];
  ErrorMessages: { [key: string]: string } = {};
  _HRMSJVDetails : any =[];
  _HRMSJVDetailsarray:any = [];
  ///
  debitamount_Total :number;
  creditamount_Total:number;
  public isLoading = false;


  constructor(private _fb:FormBuilder , private _commonService : CommonService,private _jvservice:JvDetailsService,private datepipe:DatePipe) { }

  ngOnInit() {
    debugger;
    this.jvDetailsForm = this._fb.group({
      employee : [''],
      //pContactId : [],
      year : [null,Validators.required],
      month : [null,Validators.required],
      jvtype : [null,Validators.required]
    });

    //this.getEmployeeDetails();
    this.getCalendarYear();
    this.getAllowanceTypes_jvtypes();
    this.BlurEventAllControll(this.jvDetailsForm);

  }


  // getEmployeeDetails(){
  //   debugger;
  //   let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
  //   this.pbranch_id = SetBranch.pbranch_id;
  //   this._jvservice.getEmployeeDetails(this.pbranch_id).subscribe(res =>{
  //     debugger;
  //     console.log(res);
  //     let staticarray = [{"pEmployeeId":0,"pEmployeeName":"All"}];
  //     this.employeesList = [...staticarray,...res];
  //   });
  // }


  // employeeChange(event){
  //   debugger;
  //   this.jvDetailsForm.controls.pContactId.setValue(event.pContactId);
  //   this.EmployeeCode = event.pEmployeecode;
  // }


  getCalendarYear(){
    debugger;
    this._jvservice.getCalendarYear().subscribe(res =>{
      debugger;
      console.log(res);
      this.yearsList = res;
    });
  }


  yearChange(event){
    debugger;
    //let pContactId = this.jvDetailsForm.controls.pContactId.value;
    this.jvDetailsForm.controls.month.setValue('');
    this.ErrorMessages.month = '';
    this._jvservice.getCalendarYearMonthPayrollAuthorised(event.pCalenderPeriodId,0).subscribe(res =>{
      debugger;
      this.monthsList = res;
    });
  }


  monthChange(event){
    debugger;
    this.MonthYear = event.pCalendarMonth;
  }

  getAllowanceTypes_jvtypes(){
    debugger;
    this.jvDetailsList = [];
    this._jvservice.getAllowanceTypes_jvtypes().subscribe(res =>{
      debugger;
      console.log(res);
      this.jvTypesList = res;
    });
  }


  jvtypeChange(event){
    debugger;
    this.jvDetailsList = [];
    this.allowance_type_id = event.allowance_type_id;
    this.selectedjvDd = event.allowance_Name;
  }


  showJvDetails(){
    debugger;
    this.jvDetailsList = [];
    if(this.checkValidations(this.jvDetailsForm,true)){
      debugger;
      this.isLoading = true;
      this._jvservice.getJVDetailsByType(this.allowance_type_id,this.MonthYear,'All').subscribe( res=>{
        debugger;
        console.log(res);
        this.jvDetailsList = res;
        this.isLoading = false;
        this.debitamount_Total =  this.jvDetailsList.reduce((sum, c) => sum + parseFloat((c.debit_amount)), 0);
          this.creditamount_Total =  this.jvDetailsList.reduce((sum, c) => sum + parseFloat((c.credit_amount)), 0);
        if(this.jvDetailsList.length == 0){
          this._commonService.showWarningMessage("No Data To Show");
        }
      },
      (error) => {
        this.showErrorMessage(error);
        this.isLoading = false;
      });
    }
  }


  clearDetails(){
    debugger;
    this.jvDetailsForm.reset();
    this.ErrorMessages = {};
    this.jvDetailsList = [];
    this.allowance_type_id = "";
    this._HRMSJVDetails = [];
    this._HRMSJVDetailsarray = [];
  }


  saveJvDetails(){
    debugger;
    if(this.checkValidations(this.jvDetailsForm,true)){
      debugger;
      if(this.jvDetailsList.length >0){
        if(confirm("Do you want to save ?")){
          debugger;
          this._jvservice.getJVDetailsDuplicateCheck(this.allowance_type_id,this.MonthYear).subscribe( res=>{
            debugger;
            console.log(res);
            if(res > 0){
              this._commonService.showWarningMessage("Already Exists");
              this.clearDetails();
            }
            else{
              for(let i=0;i<this.jvDetailsList.length;i++){
                debugger;
                let data = {
                "employee_code": this.jvDetailsList[i].employee_code,
                "account_id": this.jvDetailsList[i].account_id,
                "account_trans_type": this.jvDetailsList[i].account_trans_type,
                "particulars": this.jvDetailsList[i].particulars,
                "debit_amount": this.jvDetailsList[i].debit_amount,
                "credit_amount": this.jvDetailsList[i].credit_amount,
                "payroll_month": this.MonthYear,
                "transaction_date": this.datepipe.transform(new Date(),"yyyy-MM-dd"),
                "jv_type": this.allowance_type_id,
                "pPFAmt": this.jvDetailsList[i].pPFAmt,
                "pProffTaxAmt": this.jvDetailsList[i].pProffTaxAmt,
                "pEsiAmt": this.jvDetailsList[i].pEsiAmt
                }
                this._HRMSJVDetailsarray.push(data);
              }
              this._HRMSJVDetails = [...this._HRMSJVDetailsarray];

              let data = {
                "_HRMSJVDetails": this._HRMSJVDetails,
                "createdby": 0,
                "modifiedby": 0,
                "pCreatedby": 14,
                "pModifiedby": 0,
                "ptypeofoperation": "CREATE"
              };

              console.log(data);
              debugger;
              this._jvservice.saveJvDetails(data).subscribe(json =>{
                debugger;
                console.log(json);
                this._commonService.showInfoMessage("Successfully Saved");
               
                // window.open('/#/JournalvoucherReport?id=' + btoa(json[0] + ',' + 'Journal Voucher'));
                this.clearDetails();
              },
              (error) => {
                this.showErrorMessage(error);
              });
            }
          },(error) =>{
            this._commonService.showErrorMessage(error);
          });
        }
      }
    }
  }


 //VALIDATIONS

  BlurEventAllControll(fromgroup: FormGroup) : boolean
  {
    debugger;
    try {
      debugger
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
      return true;
    }
    catch (e) {
      debugger
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
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
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
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
    debugger
    this._commonService.showErrorMessage(errormsg);
  }

}
