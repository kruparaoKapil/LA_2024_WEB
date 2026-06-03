import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { SscAgendaService } from 'src/app/Services/HRMS/Transactions/ssc-agenda.service';
@Component({
  selector: 'app-salary-update',
  templateUrl: './salary-update.component.html',
  styles: []
})
export class SalaryUpdateComponent implements OnInit {

  empsalUpdateForm  : FormGroup;
  employeesList : any = [];
  selectedEmployeeDetails : any = [];
  public dateofpromotionDPconfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public minutesdateDPconfig : Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  empSalaryUpdateValidation : any = {};
  EmployeeName: string;
  newDesignationsList :any = [];
  pbranch_id: any;
  currentdate :Date = new Date();

  constructor(private fb:FormBuilder,private _commonService:CommonService,private _sscagendaservice:SscAgendaService,private datepipe:DatePipe) { }

  ngOnInit() {
    debugger;
    this.empsalUpdateForm = this.fb.group({
      employee : ['',Validators.required],
      newdesignation : ['',Validators.required],
      dateofpromotion : [this.currentdate],
      remarks : [''],
      refno : ['',Validators.required],
      minutesdate : [this.currentdate],
      newbasicsal : [''],
      newallowance : [''],
      pSscAgendaType: ['P'],
      pEmployeeContactId :[''],
      pDateOfReporting :[''],
      pDateOfJoining :[''],
      pDesignationId :[''],
      pEmployeeId :[''],
      pEmployeeName :[''],
      pNewDesignationId :[''],
      pOldDesignationName :[''],
      pNewDesiganationName :[''],
      pOldBasicAmount :[''],
      pOldAllowanceAmount :[''],
      pStatusid:[''],
      pStatusname :[''],
      pEffecttodate :[''],
      pEffectfromdate :['']
    });

    this.BlurEventAllControll(this.empsalUpdateForm);
    this.getSSCAgendaEmployeeDetails('P');
    this.GetDesignations();
  }


  getSSCAgendaEmployeeDetails(agendatype){
    debugger;
    this._sscagendaservice.getSSCAgendaEmployeeDetails(agendatype).subscribe(res =>{
      debugger;
      this.employeesList = res;
    });
  }


  employeeChange(event){
    debugger;
    console.log(event);
    this.selectedEmployeeDetails = event;
    this.EmployeeName = event.pEmployeeName + "-" + event.pEmployeecode;
    this.empsalUpdateForm.controls.pEmployeeContactId.setValue(event.pContactId);
    this.empsalUpdateForm.controls.pDateOfReporting.setValue(event.pDateOfReporting);
    this.empsalUpdateForm.controls.pDateOfJoining.setValue(event.pDateOfJoining);
    this.empsalUpdateForm.controls.pDesignationId.setValue(event.pDesignationId);
    this.empsalUpdateForm.controls.pEmployeeId.setValue(event.pEmployeeId);
    this.empsalUpdateForm.controls.pEmployeeName.setValue(event.pEmployeeName);
    this.empsalUpdateForm.controls.pOldDesignationName.setValue(event.pDesignation);
    this.empsalUpdateForm.controls.pOldBasicAmount.setValue(event.pBasicAmount);
    this.empsalUpdateForm.controls.pOldAllowanceAmount.setValue(event.pAllowanceAmount);
    this.empsalUpdateForm.controls.pStatusid.setValue(event.pStatusid);
    this.empsalUpdateForm.controls.pStatusname.setValue(event.pStatusname);
    this.empsalUpdateForm.controls.pEffectfromdate.setValue(event.pEffectfromdate);
    this.empsalUpdateForm.controls.pEffecttodate.setValue(event.pEffecttodate); 
  }


  GetDesignations(){
    debugger;
    this._sscagendaservice.GetDesignations().subscribe(res =>{
      debugger;
      this.newDesignationsList = res;
    });
  }


  newDesignationChange(event){
    debugger;
    console.log(event);
    this.empsalUpdateForm.controls.pNewDesignationId.setValue(event.designationid);
    this.empsalUpdateForm.controls.pNewDesiganationName.setValue(event.designationname);
  }


  saveEmployeeSalaryUpdate(){
    debugger;
    let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.pbranch_id = SetBranch.pbranch_id;
    if(this.checkValidations(this.empsalUpdateForm,true))
    {
      debugger;
      let data = {
        "pbranchid": Number(this.pbranch_id),
        "pSscAgendaType": this.empsalUpdateForm.controls.pSscAgendaType.value,
        "pEmployeeContactId": Number(this.empsalUpdateForm.controls.pEmployeeContactId.value),
        //"pDateofConfirmation": {},
        "pDateofPromotion": this.datepipe.transform(this.empsalUpdateForm.controls.dateofpromotion.value,"yyyy-MM-dd"),
        //"pDateOfTransfer": {},
        "pDateOfReporting": this.datepipe.transform(this.empsalUpdateForm.controls.pDateOfReporting.value,"yyyy-MM-dd"),
        "pDateOfJoining": this.datepipe.transform(this.empsalUpdateForm.controls.pDateOfJoining.value,"yyyy-MM-dd"),
        //"pTrnsferTo": {},
        "pDesignationId": Number(this.empsalUpdateForm.controls.pDesignationId.value),
        //"pResignationAuthorityId": {},
        //"pDateOfResignation": {},
        "pRemarks": this.empsalUpdateForm.controls.remarks.value,
        "pSscMinutesNo": this.empsalUpdateForm.controls.refno.value,
        "pSscMinutesDate": this.datepipe.transform(this.empsalUpdateForm.controls.minutesdate.value,"yyyy-MM-dd"),
        //"pFileName": {},
        //"pStatus": {},
        "pEmployeeId": Number(this.empsalUpdateForm.controls.pEmployeeId.value),
        "pEmployeeName": this.empsalUpdateForm.controls.pEmployeeName.value,
        "pNewDesignationId": Number(this.empsalUpdateForm.controls.pNewDesignationId.value),
        "pOldDesignationName": this.empsalUpdateForm.controls.pOldDesignationName.value,
        "pNewDesiganationName": this.empsalUpdateForm.controls.pNewDesiganationName.value,
        "pOldBasicAmount": this._commonService.removeCommasInAmount(this.empsalUpdateForm.controls.pOldBasicAmount.value),
        "pNewBasicAmount": this._commonService.removeCommasInAmount(this.empsalUpdateForm.controls.newbasicsal.value),
        "pOldAllowanceAmount": this._commonService.removeCommasInAmount(this.empsalUpdateForm.controls.pOldAllowanceAmount.value),
        "pNewAllowanceAmount": this._commonService.removeCommasInAmount(this.empsalUpdateForm.controls.newallowance.value),
        //"pPromotionAuthorityId": {},
        "pPromationCreatedBy": 0,
        //"pDateOfCreated":{},
        "createdby": 0,
        "modifiedby": 0,
        "pCreatedby": 0,
        "pModifiedby": 0,
        "pStatusid": this.empsalUpdateForm.controls.pStatusid.value,
        "pStatusname": this.empsalUpdateForm.controls.pStatusname.value,
        "pEffectfromdate": this.datepipe.transform(this.empsalUpdateForm.controls.pEffectfromdate.value,"yyyy-MM-dd"),
        "pEffecttodate": this.datepipe.transform(this.empsalUpdateForm.controls.pEffecttodate.value,"yyyy-MM-dd"),
        "ptypeofoperation": "UPDATE"
      };
      console.log(data);
      this._sscagendaservice.saveEmployeeSalaryUpdate(data).subscribe(res =>{
        debugger;
        console.log(res);
        this._commonService.showInfoMessage("Saved Successfully!");
        this.clearDetails();
      });
    }
  }


  clearDetails(){
    debugger;
    this.empsalUpdateForm.reset();
    this.empSalaryUpdateValidation = {};
    this.selectedEmployeeDetails = [];
    this.EmployeeName = "";
    this.empsalUpdateForm.controls.dateofpromotion.setValue(this.currentdate);
    this.empsalUpdateForm.controls.minutesdate.setValue(this.currentdate);
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
          this.empSalaryUpdateValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.empSalaryUpdateValidation[key] += errormessage + ' ';
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
