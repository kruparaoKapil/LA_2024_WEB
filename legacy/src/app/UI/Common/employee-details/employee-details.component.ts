import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { CommonService } from 'src/app/Services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
declare let $: any;
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styles: []
})
export class EmployeeDetailsComponent implements OnInit {
ctc=0;
basic:any;
allowance:any;
EmployeeRoleList:any;
roleValidation=false;
EmployeeDetailsValidation:any;
buttonStatus:any;
dataToBind:any;
Employeeid:any;
public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  EmployeeDetailsForm = new FormGroup({
    pEmploymentBasicSalary : new FormControl('',Validators.required),
    pEmploymentAllowanceORvda : new FormControl(),
    pEmploymentCTC : new FormControl(''),
    pEmploymentDesignation : new FormControl(''),
    pEmploymentRoleId : new FormControl(''),
    pEmploymentRoleName : new FormControl(''),
    pEmploymentJoiningDate : new FormControl('')
  })

  RoleForm = new FormGroup({
    createdby : new FormControl(1),
    pEmployeeRoleID : new FormControl(0),
    pEmployeeRoleName : new FormControl('',Validators.required),
    pCreatedby : new FormControl(this._commonService.pCreatedby),
    pStatusname : new FormControl('Active'),
    ptypeofoperation : new FormControl('Create')
  })

  constructor(private _FIIndividualService:FIIndividualService, private toastr: ToastrService, private _route: ActivatedRoute,  private _Employee:EmployeeService, private _commonService:CommonService) { 
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.containerClass = 'theme-dark-blue';
  }

  ngOnInit() {
    
  this.EmployeeDetailsValidation={};
    this._FIIndividualService.getEmployementRoleList().subscribe(data=>{
      this.EmployeeRoleList=data;
    })
    this.BlurEventAllControll(this.EmployeeDetailsForm)
  }

  ctcCalculation(){
    
    let a=this.EmployeeDetailsForm.controls.pEmploymentBasicSalary.value;
    let b=this.EmployeeDetailsForm.controls.pEmploymentAllowanceORvda.value;
    this.ctc=0;
    if(a!="" && a!=null){
      if(a.toString().includes(',')){
        this.basic=this.functiontoRemoveCommas(a);
        this.basic=+this.basic;
      }
      else{
        this.basic=+a
      }
    }
    else{
      this.basic=+a;
    }
    if(b!="" && b!=null){
      if(b.toString().includes(',')){
        this.allowance=this.functiontoRemoveCommas(b);
        this.allowance=+this.allowance
      }
      else{
        this.allowance=+b;
      }
    }
    else{
      this.allowance=+b;
    }
    if(this.basic=="" && this.allowance==""){
      this.ctc=0;
    }
    else{
      this.ctc=this.basic + this.allowance;
      this.EmployeeDetailsForm.controls.pEmploymentCTC.setValue(this.ctc);
    }
    // if(this.basic!="" && this.allowance!="" && this.basic!=undefined && this.allowance!=undefined){
     
    // }

  }

  public functiontoRemoveCommas(value) {
    let a = value.split(',')
    let b = a.join('')
    let c = b
    return c;
  }

  clickToAddRole(){
    this.clearRole();
  }

  clearRole(){
    this.roleValidation=false;
    this.RoleForm.controls.pEmployeeRoleName.reset();
  }

  addRole(){
    
    this.roleValidation=true;
    if(this.RoleForm.controls.pEmployeeRoleName.value!="" && this.RoleForm.controls.pEmployeeRoleName.value!=null){
      let roleform=JSON.stringify(this.RoleForm.value);
      this._Employee.CheckEmployeeRoleDuplicates(this.RoleForm.controls.pEmployeeRoleName.value).subscribe(value=>{
         
        if(value){
           this.toastr.info("Role Already Exists",'Info')
        }
        else{
          this._Employee.SaveEmployeeRole(roleform).subscribe(data=>{
            
            if(data){
              this._FIIndividualService.getEmployementRoleList().subscribe(data=>{
                this.EmployeeRoleList=data;
              })
            }
          })
        }
  })
  this.clearRole();
  $('#add-detail').modal('hide');
  }
  }
  Clear(){
    this.EmployeeDetailsForm.reset();
    this.EmployeeDetailsForm.controls.pEmploymentRoleName.setValue("");
    this.ctc=0;
   this.EmployeeDetailsValidation={}
  }

  employeeRoleId(){
    for(let i=0; i<this.EmployeeRoleList.length; i++){
      if(this.EmployeeRoleList[i].pemploymentrole==this.EmployeeDetailsForm.controls.pEmploymentRoleName.value){
        this.EmployeeDetailsForm.controls.pEmploymentRoleId.setValue(this.EmployeeRoleList[i].pemploymentroleid);
      }
    }
  }

validate:any
  Validations(){
    
    let isValid = true;
    if (this.checkValidations(this.EmployeeDetailsForm, isValid)) {
     this.validate=true;
    }
    else{
      this.validate=false;
    }
   
  }

  GetDataForEmployeeUpdate(data){
    
    this.EmployeeDetailsForm.controls.pEmploymentBasicSalary.setValue(this._commonService.currencyformat(data.pEmploymentBasicSalary));
    this.EmployeeDetailsForm.controls.pEmploymentAllowanceORvda.setValue(this._commonService.currencyformat(data.pEmploymentAllowanceORvda));
    this.ctc=data.pEmploymentCTC;
    this.EmployeeDetailsForm.controls.pEmploymentCTC.setValue(this.ctc);
    this.EmployeeDetailsForm.controls.pEmploymentRoleId.setValue(data.pEmploymentRoleId);
    this.EmployeeDetailsForm.controls.pEmploymentRoleName.setValue(data.pEmploymentRoleName);
    this.EmployeeDetailsForm.controls.pEmploymentDesignation.setValue(data.pEmploymentDesignation);
    if(data.pEmploymentJoiningDate=="01/01/0001"){
      this.EmployeeDetailsForm.controls.pEmploymentJoiningDate.setValue("");
    }
    else{
      this.EmployeeDetailsForm.controls.pEmploymentJoiningDate.setValue(this._commonService.formatDateFromDDMMYYYY(data.pEmploymentJoiningDate));
    }
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
          this.EmployeeDetailsValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.EmployeeDetailsValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
      this.showErrorMessage(e);
      return false;
    }
  }
 
}
