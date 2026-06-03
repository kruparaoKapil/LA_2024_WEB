import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { FamilyDetailsComponent } from '../family-details/family-details.component';
import { CommonService } from 'src/app/Services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { log } from 'util';
declare let $: any;

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.component.html',
    styles: []
})

export class PersonalDetailsComponent implements OnInit {
    @ViewChild(FamilyDetailsComponent, { static: false }) familyDetails;

    PersonalDetailsForm: FormGroup;

    @Input() showstatus: Boolean;
    @Input() showPersonal: any;

    employeeid: any;
    buttonstatus: any;
    dataToBind: any;
    validation: any;
    PersonalDetailsValidations: any = {};
    familydetailsshowhide: Boolean = false;
    checked = 'Resident';
    pMaritalChecked = 'Married'
    countryDetails: any;
    constructor(private _Employee: EmployeeService,
        private _route: ActivatedRoute,
        private _commonService: CommonService,
        private _contacmasterservice: ContacmasterService) { }


    ngOnInit() {
        this.getCountryDetails()
        this.loadInitData();
        if (this.showstatus == true) {
            this.familydetailsshowhide = this.showstatus
        } else {
            this.familydetailsshowhide = false
        }
    }
    loadInitData() {
        this.PersonalDetailsForm = new FormGroup({
            presidentialstatus: new FormControl('Resident'),
            pplaceofbirth: new FormControl(''),
            pcountryofbirth: new FormControl(''),
            pnationality: new FormControl(''),
            pminoritycommunity: new FormControl(''),
            pmaritalstatus: new FormControl('Married'),
            pStatusname: new FormControl('Active'),
            ptypeofoperation: new FormControl('CREATE')
        })
        this.BlurEventAllControll(this.PersonalDetailsForm);
    }

    Clear() {
        this.PersonalDetailsForm.reset();
        this.PersonalDetailsForm.controls.pminoritycommunity.setValue("");
        this.PersonalDetailsForm.controls.presidentialstatus.setValue("Resident"); this.PersonalDetailsForm.controls.pmaritalstatus.setValue("Married");
        this.familyDetails.Clear();
        this.PersonalDetailsValidations = {};
    }

    getEmployeeDataForUpdate(data) {

        this.PersonalDetailsForm.controls.presidentialstatus.setValue(data.presidentialstatus);
        this.PersonalDetailsForm.controls.pplaceofbirth.setValue(data.pplaceofbirth);
        this.PersonalDetailsForm.controls.pcountryofbirth.setValue(data.pcountryofbirth);
        this.PersonalDetailsForm.controls.pnationality.setValue(data.pnationality);
        this.PersonalDetailsForm.controls.pminoritycommunity.setValue(data.pminoritycommunity);
        this.PersonalDetailsForm.controls.pmaritalstatus.setValue(data.pmaritalstatus);
        this.familyDetails.GetDataForFamilyDetailsUpdate(data.pListFamilyDetails);
    }

    Validations() {

        let isValid = true;
        if (this.checkValidations(this.PersonalDetailsForm, isValid)) {
            this.validation = true;
        }
        else {
            this.validation = false;
        }
    }

/**<------(start)send form data(start)------->*/
    sendFormData() {

        this.Validations();
        if (this.validation == true) {
            return this.PersonalDetailsForm.value
        }
        else {
            return null;
        }
    }
/**<------(end)send form data(end)------->*/

/**<------(start)checking validations(start)------->*/
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
                    this.PersonalDetailsValidations[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.PersonalDetailsValidations[key] += errormessage + ' ';
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
/**<------(start)checking validations(start)------->*/

/**<------(start)set data to form(start)------->*/
   setFormData(formData) {
        try {
            this.PersonalDetailsForm.reset();
            this.clearForm();
            if (formData) {
                this.PersonalDetailsForm.patchValue(formData);
                if (formData.presidentialstatus) {
                    this.checked = formData.presidentialstatus;
                }
            } else {
                this.checked = 'Resident';
            }
        }
        catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }
/**<------(end)set data to form(end)------->*/

    clearForm() {
        this.PersonalDetailsForm.reset();
        this.loadInitData();
    }

    getCountryDetails(): void {
        this._contacmasterservice.getCountryDetails().subscribe(json => {
            if (json != null) {
                this.countryDetails = json;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }

    pCountry_Change($event: any): void {

        const countryid = $event.target.value;
        if (countryid && countryid != '') {
            const countryName = $event.target.options[$event.target.selectedIndex].text;
            this.PersonalDetailsForm['controls']['pcountryofbirth'].setValue(countryName);
        }
    }


}
