import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { SscAgendaService } from 'src/app/Services/HRMS/Transactions/ssc-agenda.service';

@Component({
  selector: 'app-ssc-agenda',
  templateUrl: './ssc-agenda.component.html',
  styles: []
})
export class SSCAgendaComponent implements OnInit {

  public datepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  sscAgendaForm : FormGroup;
  selectedEmployeeDetails :any = [];
  employeenamesList : any = [];
  branchId : any;
  designationsList :any = [];
  sscAgendaValidation = {};
  currentdate : Date = new Date();
  EmployeeName_Code : string;
  loading : boolean = false;

  constructor(private fb:FormBuilder,private _sscagendaservice:SscAgendaService,private _commser : CommonService,private datepipe:DatePipe) { 
    this.datepickerConfig.maxDate = new Date();
    this.datepickerConfig1.maxDate = new Date();
    this.datepickerConfig.dateInputFormat = "DD/MM/YYYY";
    this.datepickerConfig.showWeekNumbers = false;
    this.datepickerConfig1.dateInputFormat = "DD/MM/YYYY";
    this.datepickerConfig1.showWeekNumbers = false;
  }


  ngOnInit() {
    debugger;
    this.sscAgendaForm = this.fb.group({
      pAgendaType:['C'],
      pEmployeeName :[null,[Validators.required]],
      pSscAgendaType :['C'],
      designation :[null,[Validators.required]],
      dateofconfirmation :[this.currentdate],
      remarks:[''],
      refno:[''],
      minutesdate:[this.currentdate],
      pEmployeeId :[''],
      pContactId :[''],
      pDateOfReporting :[''],
      pDateOfJoining :[''],
      pDesignationId :[''],
      pStatusid :[''],
      pStatusname :[''],
      pEffectfromdate :[''],
      pEffecttodate :[''],
    
    });

    let branch =JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = branch.pbranch_id;

    this.getSSCAgendaEmployeeDetails();
    this.GetDesignations();
    this.BlurEventAllControll(this.sscAgendaForm);

  }


  getSSCAgendaEmployeeDetails(){
    debugger;
    this.loading = true;
    let sscagendatype = this.sscAgendaForm.controls.pAgendaType.value;
    this._sscagendaservice.getSSCAgendaEmployeeDetails(sscagendatype).subscribe( json =>{
      debugger;
      this.loading = false;
      this.employeenamesList = json;
      console.log("employee names data is : ",json);
    },(error) =>{
      this.loading = false;
    });
  }


  GetDesignations(){
    debugger;
    this._sscagendaservice.GetDesignations().subscribe(res =>{
      debugger;
      console.log(res);
      this.designationsList = res;
    });
  }

  designationChange(event){
    debugger;
    this.sscAgendaForm.controls.pDesignationId.setValue(event.designationid);
  }


  grouptype_change(status){
    debugger;
    if(status=='Conformation'){
      this.sscAgendaForm.controls.pAgendaType.setValue('C');
    }
  }


  bindSelectedEmployee(event){
    debugger;
    if(this.employeenamesList != null){
      this.EmployeeName_Code = event.pEmployeeName+" - "+event.pEmployeecode;
      this.selectedEmployeeDetails = event;
      this.sscAgendaForm.controls.pContactId.setValue(event.pContactId);
      this.sscAgendaForm.controls.pDateOfReporting.setValue(event.pDateOfReporting);
      this.sscAgendaForm.controls.pDateOfJoining.setValue(event.pDateOfJoining);
      this.sscAgendaForm.controls.pEmployeeId.setValue(event.pEmployeeId);
      this.sscAgendaForm.controls.pEmployeeName.setValue(event.pEmployeeName);
      this.sscAgendaForm.controls.pStatusid.setValue(event.pStatusid);
      this.sscAgendaForm.controls.pStatusname.setValue(event.pStatusname);
      this.sscAgendaForm.controls.pEffectfromdate.setValue(event.pEffectfromdate);
      this.sscAgendaForm.controls.pEffecttodate.setValue(event.pEffecttodate);
    }
  }


  clearDetails(){
    debugger;
    this.sscAgendaForm.reset();
    this.selectedEmployeeDetails = [];
    this.sscAgendaValidation = [];
  }


  saveSscAgenda(){
    debugger;
    if(this.checkValidations(this.sscAgendaForm,true)){

    let data = {
      "pbranchid": this.branchId,
      "pSscAgendaType": this.sscAgendaForm.controls.pAgendaType.value,
      "pEmployeeContactId": this.sscAgendaForm.controls.pContactId.value,
      "pDateofConfirmation": this.sscAgendaForm.controls.dateofconfirmation.value,
      "pDateOfReporting": this.sscAgendaForm.controls.pDateOfReporting.value,
      "pDateOfJoining": this.sscAgendaForm.controls.pDateOfJoining.value,
      "pDesignationId": this.sscAgendaForm.controls.pDesignationId.value,
      "pRemarks": this.sscAgendaForm.controls.remarks.value,
      "pSscMinutesDate":  this.sscAgendaForm.controls.minutesdate.value,
      "pEmployeeId": this.sscAgendaForm.controls.pEmployeeId.value,
      "pEmployeeName": this.sscAgendaForm.controls.pEmployeeName.value,
      "createdby": 0,
      "modifiedby": 0,
      "pCreatedby": 0,
      "pModifiedby": 0,
      "pStatusid": this.sscAgendaForm.controls.pStatusid.value,
      "pStatusname": this.sscAgendaForm.controls.pStatusname.value,
      "pEffectfromdate": this.sscAgendaForm.controls.pEffectfromdate.value,
      "pEffecttodate": this.sscAgendaForm.controls.pEffecttodate.value,
      "ptypeofoperation": "CREATE"
    };

    console.log(data);
    let contactid = this.sscAgendaForm.controls.pContactId.value;
    let ssagendatype = this.sscAgendaForm.controls.pAgendaType.value;
    this._sscagendaservice.getSSCAgendaExistingornot(contactid,ssagendatype).subscribe(res =>{
      debugger;
      if(res ==0){
        this._sscagendaservice.SaveSscAgenda(data).subscribe( json =>{
          debugger;
          console.log(json);
          this._commser.showInfoMessage('Successfully Saved');
          this.sscAgendaForm.reset();
          this.sscAgendaForm.controls.pAgendaType.setValue('C');
          this.selectedEmployeeDetails = [];
          this.sscAgendaValidation = [];
          this.EmployeeName_Code ="";
          this.getSSCAgendaEmployeeDetails();
        },(error) =>{
          this._commser.showErrorMessage(error);
        });
      }
      else{
        this._commser.showWarningMessage('Already Exists.');
      }
    },(error) =>{
      this._commser.showErrorMessage(error);
    });
   
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
        this.sscAgendaValidation[key] = '';
        if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
          let lablename;
          lablename = (document.getElementById(key) as HTMLInputElement).title;
          let errormessage;
          for (const errorkey in formcontrol.errors) {
            if (errorkey) {
              errormessage = this._commser.getValidationMessage(formcontrol, errorkey, lablename, key, '');
              this.sscAgendaValidation[key] += errormessage + ' ';
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
