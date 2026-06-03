import { Component, OnInit, } from '@angular/core';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styles: []
})
export class FamilyDetailsComponent implements OnInit {
  gridData = [];

  familyData: any;
  employeeid: any;
  EmployeeId: any;
  dataToBind: any;
  editIndex: any;
  FamilyDetailsValidation: any = {};

  buttonname = "Add";

  constructor(
    private _Employee: EmployeeService, 
    private _route: ActivatedRoute, 
    private _commonService: CommonService) { }

  FamilyDetailsForm = new FormGroup({
    pEmployeeid: new FormControl(0),
    pTotalnoofmembers: new FormControl('', Validators.required),
    pContactpersonname: new FormControl('', Validators.required),
    pRelationwithemployee: new FormControl('', Validators.required),
    pContactnumber: new FormControl('', Validators.required),
    ptypeofoperation: new FormControl('Create'),
    pfamilyrecordid: new FormControl(0)
  })

  ngOnInit() {   
    this._commonService._GetFiTab1Data().subscribe(data => {
    })
    this.BlurEventAllControll(this.FamilyDetailsForm);
  }
/**<------(start)Get family details from personal details component (start)------->*/
  GetDataForFamilyDetailsUpdate(familydata) {   
    for (let i = 0; i < familydata.length; i++) {
      this.gridData[i] = familydata[i];
      this.gridData[i].ptypeofoperation = "Update";
      this.FamilyDetailsForm.controls.pTotalnoofmembers.setValue(familydata[i].pTotalnoofmembers);
    }
    this.familyData = familydata;
    this._Employee.getFamilyDetailsForm(this.familyData);
  }
/**<------(end)Get family details from personal details component (end)------->*/

  addDataToGrid() {  
    let isValid = true;
    if (this.checkValidations(this.FamilyDetailsForm, isValid)) {
      if (this.buttonname == "Add") {
        if (this.gridData.length < this.FamilyDetailsForm.controls.pTotalnoofmembers.value && this.FamilyDetailsForm.controls.pContactnumber.value!="0000000000") {
          if (this.gridData.length == 0) {
            this.gridData.push(this.FamilyDetailsForm.value);
          }
          else {
            let arr = this.gridData.filter(data => {
              return data.pContactpersonname == this.FamilyDetailsForm.controls.pContactpersonname.value;
            });
            if (arr.length == 0) {
              this.gridData.push(this.FamilyDetailsForm.value);

            }
          }
        }
        this._Employee.getFamilyDetailsForm(this.gridData);
        this.FamilyDetailsForm.controls.pContactpersonname.reset();
        this.FamilyDetailsForm.controls.pRelationwithemployee.reset();
        this.FamilyDetailsForm.controls.pContactnumber.reset();
        this.FamilyDetailsForm.controls.pEmployeeid.setValue(0);
        this.FamilyDetailsForm.controls.pRelationwithemployee.setValue('');
        this.FamilyDetailsForm.controls.ptypeofoperation.setValue('Create');
        this.FamilyDetailsValidation = {};
      }
      if (this.buttonname == "Update") {
        this.employeeid = this._Employee.SendEmployeeIdForUpdate();
        this.FamilyDetailsForm.controls.pEmployeeid.setValue(this.employeeid);
        this.FamilyDetailsForm.controls.ptypeofoperation.setValue("Update")
        this.gridData[this.editIndex] = this.FamilyDetailsForm.value;
        this._Employee.getFamilyDetailsForm(this.gridData);
        this.buttonname = "Add";
        this.FamilyDetailsForm.controls.pContactpersonname.reset();
        this.FamilyDetailsForm.controls.pRelationwithemployee.reset();
        this.FamilyDetailsForm.controls.pContactnumber.reset();
        this.FamilyDetailsForm.controls.pRelationwithemployee.setValue("");
        this.FamilyDetailsValidation = {};
      }

    }
  }

  editHandler(event) {
    this.buttonname = "Update"
    this.FamilyDetailsForm.controls.pTotalnoofmembers.setValue(event.dataItem.pTotalnoofmembers);
    this.FamilyDetailsForm.controls.pContactpersonname.setValue(event.dataItem.pContactpersonname);
    this.FamilyDetailsForm.controls.pRelationwithemployee.setValue(event.dataItem.pRelationwithemployee);
    this.FamilyDetailsForm.controls.pContactnumber.setValue(event.dataItem.pContactnumber);
    this.FamilyDetailsForm.controls.pfamilyrecordid.setValue(event.dataItem.pfamilyrecordid);
    this.editIndex = event.rowIndex;
  }

  removeHandler(event) {
    this.gridData.splice(event.rowIndex, 1);
    //console.log(this.gridData);
    this._Employee.getFamilyDetailsForm(this.gridData);
  }

  Clear() {
    this.FamilyDetailsForm.reset();
    this.FamilyDetailsForm.controls.pRelationwithemployee.setValue('');
    this.gridData = [];
    this.FamilyDetailsValidation = {};
  }


  Validations() {
    if (this.gridData == null) {

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
          this.FamilyDetailsValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.FamilyDetailsValidation[key] += errormessage + ' ';
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


