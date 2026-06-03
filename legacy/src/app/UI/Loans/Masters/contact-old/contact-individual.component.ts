import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { Contactmaster, Conatactdetais, Contactaddress } from './../../../../Models/Loans/Masters/contactmaster';
import { ContacmasterService } from '../../../../Services/Loans/Masters/contacmaster.service'
import { DefaultProfileImageService } from '../../../../Services/Loans/Masters/default-profile-image.service';
import { PhotouploadService } from '../../../../Services/Loans/Masters/photoupload.service'
import { CommonService } from '../../../../Services/common.service'
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

declare var $: any;
@Component({
    selector: 'app-contact-individual',
    templateUrl: './contact-individual.component.html',
    styles: []
})
export class ContactIndividualComponent implements OnInit {
    @Input() referenceid: any;
    @Input() formtype: any;
    @Input() contactType: any;
    contactForm: FormGroup;
    addresstypeForm: FormGroup;
    croppedImage: any
    showPage = true;
    disablecontactname: boolean = false;
    contactRecordId: any;
    contactRecordId1: any;
    contactSubmitted = false;
    contacAddrSubmitted = false;
    lstaddressdetails = [];
    lstContactDetailsByID: any;
    _contactmaster: Contactmaster;
    titleDetails: any;
    addressTypeDetails: any;
    countryDetails: any;
    stateDetails: any;
    districtDetails: any;
    addressTransType = 'Add';
    addressindex = 0;

    readonlyaddressdetals = false;
    readonlycontactdetails = false;

    disablesavebutton = false;
    savebutton = "Submit";


    disableaddresstypesavebutton = false;
    saveaddresstypebutton = "Save";

    public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

    constructor(private _commonService: CommonService, private _profileuploadSer: PhotouploadService, private _defaultimage: DefaultProfileImageService, private formbuilder: FormBuilder, private _contacmasterservice: ContacmasterService, private _routes: Router, private datePipe: DatePipe, private toastr: ToastrService) {
        this.pDobConfig.containerClass = 'theme-dark-blue';
        this.pDobConfig.showWeekNumbers = false;
        //this.pDobConfig.minDate = new Date('2019/02/28');
        this.pDobConfig.maxDate = new Date();
        this.pDobConfig.dateInputFormat = 'DD-MM-YYYY'
    }

    public loading = false;
    contactValidationErrors: any;
    addressTypeErrorMessage: any = {};

    ngOnInit() {
        if (this.contactType == 'Individual') {
            this.showPage = true;
        }
        else {
            this.showPage = false;
        }
        this.contactValidationErrors = [];

        //this._profileuploadSer.GetProfileImage().subscribe(json => {

        //  if (json != "" || json != null) {
        //    this.croppedImage = "data:image/png;base64," + json
        //  }
        //})

        this.addresstypeForm = this.formbuilder.group({
            pContactType: [''],
            pAddressType: ['', Validators.required],
            pStatusname: [this._commonService.pStatusname],
            pCreatedby: [this._commonService.pCreatedby],
        })
        this.contactForm = this.formbuilder.group({
            pReferenceId: [''],
            pPhoto: [''],
            pName: ['', Validators.required],
            pBusinessEntityEmailid: [''],
            pBusinessEntityContactno: [''],
            pContactType: [''],
            pSurName: [''],
            pDob: [''],
            pGender: ['',Validators.required],
            pCreatedby: [this._commonService.pCreatedby],
            pStatusname: [this._commonService.pStatusname],
            pFatherName: [''],
            pSpouseName: [''],
            pAge: [''],
            pTitleName: ['', Validators.required],
            pAddressTypeChk: [''],
            pContactName: [''],
            pEmailId: ['', Validators.pattern],
            pEmailId2: ['', Validators.pattern],
            pContactNumber: ['', [Validators.required, Validators.minLength(10)]],
            pAlternativeNo: [''],
            pRecordId: [''],
            pRecordId1: [''],
            pPriority: [''],

            pEmailidsList: this.formbuilder.array([]),
            pAddressControls: this.addAddressControls(),
            pAddressList: this.formbuilder.array([]),


        })
        //this.clearContactFormDeatails();
        this.getAddressTypeDetails();
        this.gettitleDetails();
        this.getCountryDetails();
        this.loadEditDetails();
        this.BlurEventAllControll(this.contactForm);
        if (this.formtype == 'Save')
            this.croppedImage = this._defaultimage.GetdefaultImage();
    }


    showErrorMessage(errormsg: string) {
        this._commonService.showErrorMessage(errormsg);
    }

    showInfoMessage(errormsg: string) {
        this._commonService.showInfoMessage(errormsg);
    }

    addcontactControls(): FormGroup {
        return this.formbuilder.group({
            pContactName: [''],
            pEmailId: [''],
            pContactNumber: [''],
            pPriority: [''],
            pRecordId: [''],
        })
    }
    addAddressControls(): FormGroup {
        return this.formbuilder.group({
            pRecordId: [''],
            pAddressType: ['', Validators.required],
            pAddress1: [''],
            pAddress2: [''],
            pState: ['', Validators.required],
            pStateId: [''],
            pDistrict: ['', Validators.required],
            pDistrictId: [''],
            pCity: ['', Validators.required],

            pCountry: ['', Validators.required],
            pCountryId: ['',],
            pPinCode: ['', [Validators.required, Validators.minLength(6)]],
            pPriority: [''],
            ptypeofoperation: [''],
            pAddressDetails: [''],
            pStatusname: [''],
        })
    }

    BlurEventAllControll(fromgroup: FormGroup) {

        try {

            Object.keys(fromgroup.controls).forEach((key: string) => {

                if (key != 'pEmailidsList' && key != 'pAddressList')
                    this.setBlurEvent(key);
            })

        }
        catch (e) {
            this.showErrorMessage(e);
            return false;
        }
    }
    setBlurEvent(key: string) {

        try {
            let formcontrol;

            formcontrol = this.contactForm.get(key);


            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {

                    this.BlurEventAllControll(formcontrol)
                }
                else {
                    if (formcontrol.validator)
                        this.contactForm.get(key).valueChanges.subscribe((data) => { this.GetContactValidationByControl(key, true) })


                }
            }
            else {

                formcontrol = <FormGroup>this.contactForm['controls']['pAddressControls'].get(key);
                if (formcontrol) {
                    if (formcontrol instanceof FormGroup) {

                        this.BlurEventAllControll(formcontrol)
                    }
                    else {
                        if (formcontrol.validator)
                            this.contactForm['controls']['pAddressControls'].get(key).valueChanges.subscribe((data) => { this.GetContactValidationByControl(key, true) })


                    }
                }
            }
        }
        catch (e) {
            this.showErrorMessage(e);
            return false;
        }



    }

    loadEditDetails() {

        
        if (this.formtype == 'Update' && this.contactType == 'Individual') {
            this.loading = true;
            this.readonlycontactdetails = true;
            this._contacmasterservice.getContactDetailsByID(this.referenceid).subscribe(json => {
                //console.log(json)
                
                try {
                    if (json != null) {


                        this.contactForm.patchValue(json);
                        this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
                        this.contactType = json.pContactType;
                        if (json.pcontactexistingstatus) {
                            this.disablecontactname = true
                        }
                        else {
                            this.disablecontactname = false;
                        }
                        if (json.pPhoto)
                            this.croppedImage = "data:image/png;base64," + json.pPhoto;
                        else
                            this.croppedImage = this._defaultimage.GetdefaultImage();
                        if (json.pDob != null && json.pDob != '') {
                            let date = this._commonService.formatDateFromDDMMYYYY(json.pDob);
                            this.contactForm['controls']['pDob'].setValue(date);
                        }
                        for (let i = 0; i < json.pEmailidsList.length; i++) {
                            if (json.pEmailidsList[i].pPriority == 'PRIMARY') {
                                this.contactForm['controls']['pEmailId'].setValue(json.pEmailidsList[i].pEmailId);
                                this.contactForm['controls']['pContactNumber'].setValue(json.pEmailidsList[i].pContactNumber);
                                this.contactForm['controls']['pRecordId'].setValue(json.pEmailidsList[i].pRecordId);
                                this.contactRecordId = json.pEmailidsList[i].pRecordId;
                            }
                            else {
                                this.contactForm['controls']['pEmailId2'].setValue(json.pEmailidsList[i].pEmailId);
                                this.contactForm['controls']['pAlternativeNo'].setValue(json.pEmailidsList[i].pContactNumber);
                                this.contactForm['controls']['pRecordId1'].setValue(json.pEmailidsList[i].pRecordId);
                                this.contactRecordId1 = json.pEmailidsList[i].pRecordId;
                            }
                        }
                        this.lstaddressdetails = json.pAddressList;
                        let datatabledisplay = json.pAddressList.filter(function (loanname) {
                            return loanname.pPriority == 'PRIMARY';
                        });

                        this.lstaddressdetails = json.pAddressList;
                        if (this.lstaddressdetails.length > 0)
                            this.contactForm['controls']['pAddressTypeChk'].setValue(datatabledisplay[0].pAddressType);
                        this.ageCalculation();
                        //this.lstContactDetailsByID = json as string
                        //this.lstContactDetailsByID = eval("(" + this.lstContactDetailsByID + ')');
                        //this.lstContactDetailsByID = this.lstContactDetailsByID.FT;
                    }
                } catch (e) {
                    this.showErrorMessage(e);
                }
                this.loading = false;
            },
                (error) => {

                    this.showErrorMessage(error);
                });
        }
        else {
            this.readonlycontactdetails = false;
        }

    }
    loadImages(EventData: string) {


        this.croppedImage = "data:image/png;base64," + EventData;
        this.contactForm['controls']['pPhoto'].setValue(EventData);

    }

    gettitleDetails(): void {

        this._contacmasterservice.gettitleDetails().subscribe(json => {
            
            //console.log(json)
            if (json != null) {
                this.titleDetails = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    getAddressTypeDetails(): void {

        this._contacmasterservice.getAddressTypeDetails(this.contactType).subscribe(
            (json) => {

                if (json != null) {
                    this.addressTypeDetails = json;
                    //this.addressTypeDetails = json as string
                    //this.addressTypeDetails = eval("(" + this.addressTypeDetails + ')');
                    //this.addressTypeDetails = this.addressTypeDetails.FT;
                }
            },
            (error) => {

                this.showErrorMessage(error);
            }
        );
    }
    getCountryDetails(): void {

        this._contacmasterservice.getCountryDetails().subscribe(json => {

            //console.log(json)
            if (json != null) {
                this.countryDetails = json;
                //this.countryDetails = json as string
                //this.countryDetails = eval("(" + this.countryDetails + ')');
                //this.countryDetails = this.countryDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }

    pCountry_Change($event: any): void {
        
        const countryid = $event.target.value;
        if (countryid && countryid != '') {
            const countryname = $event.target.options[$event.target.selectedIndex].text;
            this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue(countryname);

            this.getSateDetails(countryid);

        }
        else {
            this.stateDetails = [];
            this.districtDetails = [];
            this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue('');
            this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
            this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue('');
            this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
            this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');

        }
    }

    getSateDetails(countryid) {
        this._contacmasterservice.getSateDetails(countryid).subscribe(json => {


            //console.log(json)
            //if (json != null) {
            this.stateDetails = json;
            //this.stateDetails = json as string
            //this.stateDetails = eval("(" + this.stateDetails + ')');
            //this.stateDetails = this.stateDetails.FT;
            //}

        },
            (error) => {

                this.showErrorMessage(error);
            });
    }
    pState_Change($event: any){

        const stateid = $event.target.value;
        if (stateid && stateid != '') {
            const statename = $event.target.options[$event.target.selectedIndex].text;

            this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue(statename);
            //this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue(stateid);
            this.getDistrictDetails(stateid);


        }
        else {
            this.districtDetails = [];
            this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
        }

    }
    getDistrictDetails(stateid) {
        this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {

            //console.log(json)
            //if (json != null) {
            this.districtDetails = json;
            //this.districtDetails = json as string
            //this.districtDetails = eval("(" + this.districtDetails + ')');
            //this.districtDetails = this.districtDetails.FT;
            //}
        },
            (error) => {

                this.showErrorMessage(error);
            });
    }


    pDistrict_Change($event: any) {

        const districtid = $event.target.value;

        if (districtid && districtid != '') {
            const districtname = $event.target.options[$event.target.selectedIndex].text;

            this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);
            //this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue(districtid);
        }
        else {

            this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
        }
    }

    pAddressType_Change($event: any): void {

        this.GetContactValidationByControl('pAddressType', true);

    }

    changeAddressPriority(index: number) {
        //console.log(this.contactForm.value)


        this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[index].pAddressType);
        for (let i = 0; i < this.lstaddressdetails.length; i++) {

            if (this.lstaddressdetails[i].ptypeofoperation != 'CREATE')
                this.lstaddressdetails[i].ptypeofoperation = 'UPDATE';

            if (index == i) {
                this.lstaddressdetails[i].pPriority = 'PRIMARY';
                //this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('PRIMARY');
            }
            else {
                this.lstaddressdetails[i].pPriority = '';

                //this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue(' ');
            }
        }
    }

    ageCalculation() {


        let age;
        let dob = this.contactForm['controls']['pDob'].value;
        if (dob != '' && dob != null) {
            let currentdate = Date.now();
            //let agedate = new Date(dob);
            let agedate = new Date(dob).getTime();
            let timeDiff = Math.abs(currentdate - agedate);
            if (timeDiff.toString() != 'NaN')
                age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            else
                age = 0;
        }
        else {
            age = 0;
        }
        this.contactForm['controls']['pAge'].setValue(age);

    }


    checkContactValidations(group: FormGroup, isValid: boolean): boolean {

        try {

            Object.keys(group.controls).forEach((key: string) => {

                isValid = this.GetContactValidationByControl(key, isValid);
            })

        }
        catch (e) {
            this.showErrorMessage(e);
            return false;
        }
        return isValid;
    }
    GetContactValidationByControl(key: string, isValid: boolean): boolean {

        try {
            let formcontrol;

            formcontrol = this.contactForm.get(key);
            if (!formcontrol)
                formcontrol = <FormGroup>this.contactForm['controls']['pAddressControls'].get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {

                    if (key != 'pAddressControls')
                        this.checkContactValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.contactValidationErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;

                        //if (key == 'pTitleName')
                        //  lablename = 'Title';
                        //else
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;

                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, 'pDob');
                                this.contactValidationErrors[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }

                    }
                }
            }
        }
        catch (e) {
            this.disablesavebutton = false;
            this.savebutton = "Submit";
            this.showErrorMessage(e);
            return false;
        }
        return isValid;
    }

    validateAddressDeatails(addressFormControl: FormGroup): boolean {
        let isValid = true;

        try {
            isValid = this.checkContactValidations(addressFormControl, isValid);

            let count = 0;
            let addresstype = addressFormControl.controls.pAddressType.value;
            for (let i = 0; i < this.lstaddressdetails.length; i++) {
                if (this.addressTransType == 'Update') {
                    if (this.lstaddressdetails[i].pAddressType === addresstype && i != this.addressindex) {
                        count = 1;
                        break;
                    }
                }
                else {
                    if (this.lstaddressdetails[i].pAddressType === addresstype) {
                        count = 1;
                        break;
                    }
                }
            }

            if (count > 0) {
                //this.showInfoMessage('Address Type Already Exist in Address Details');
                isValid = false;
            }

        } catch (e) {
            this.showErrorMessage(e);
        }
        return isValid;
    }
    validateSaveDeatails(control: FormGroup): boolean {
        let isValid = true;

        try {
            isValid = this.checkContactValidations(control, isValid);


            if (this.lstaddressdetails.length == 0) {
                //this.showErrorMessage('Enter Address Details');
                //isValid = false;
            }
            else {
                let count = 0;

                for (let i = 0; i < this.lstaddressdetails.length; i++) {
                    if (this.lstaddressdetails[i].pPriority === 'PRIMARY') {
                        count = 1;
                        break;
                    }
                }

                if (count == 0) {
                    this.showErrorMessage('Select primary address in address details');
                    isValid = false;
                }
            }

        } catch (e) {
            this.showErrorMessage(e);
            this.disablesavebutton = false;
            this.savebutton = "Submit";
        }
        return isValid;
    }

    addAddressDeatails(): void {
        try {
            const control = <FormGroup>this.contactForm['controls']['pAddressControls'];

            let addressdetails = '';

            if (control.controls.pAddress1.value && control.controls.pAddress1.value != '')
                addressdetails += control.controls.pAddress1.value + ', ';

            if (control.controls.pAddress2.value && control.controls.pAddress2.value != '')
                addressdetails += control.controls.pAddress2.value + ', ';

            if (control.controls.pCity.value && control.controls.pCity.value != '')
                addressdetails += control.controls.pCity.value + ', ';

            if (control.controls.pDistrict.value && control.controls.pDistrict.value != '')
                addressdetails += control.controls.pDistrict.value + ', ';

            if (control.controls.pState.value && control.controls.pState.value != '')
                addressdetails += control.controls.pState.value + ', ';

            if (control.controls.pCountry.value && control.controls.pCountry.value != '')
                addressdetails += control.controls.pCountry.value;

            if (control.controls.pPinCode.value && control.controls.pPinCode.value != '')
                addressdetails += ' - ' + control.controls.pPinCode.value;

            control['controls']['pAddressDetails'].setValue(addressdetails);
            control['controls']['pStatusname'].setValue('ACTIVE');

            if (this.validateAddressDeatails(control)) {


                if (this.addressTransType == 'Update') {
                    control['controls']['ptypeofoperation'].setValue('UPDATE');

                    control['controls']['pRecordId'].setValue(this.lstaddressdetails[this.addressindex].pRecordId);
                    //this.lstaddressdetails.splice(this.addressindex);
                    this.lstaddressdetails[this.addressindex] = control.value;
                    if (this.lstaddressdetails.length == 1) {
                        this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
                        this.lstaddressdetails[this.addressindex].pPriority = 'PRIMARY';
                    }
                }
                else {
                    control['controls']['ptypeofoperation'].setValue('CREATE');
                    if (this.lstaddressdetails.length == 0) {
                        this.contactForm['controls']['pAddressTypeChk'].setValue(control.controls.pAddressType.value);
                        control['controls']['pPriority'].setValue('PRIMARY');
                    }
                    else {
                        control['controls']['pPriority'].setValue('  ');
                    }
                    control['controls']['pRecordId'].setValue(0);
                    this.lstaddressdetails.push(control.value);
                }
                this.addressTransType = 'Add';


                //(<FormArray>this.contactForm['controls']['pAddressList']['controls']).push(control);

                this.clearAddressDeatails();
            }
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }

    AddressDeatails(index): void {

        try {

            this.getSateDetails(this.lstaddressdetails[index].pCountryId);
            this.getDistrictDetails(this.lstaddressdetails[index].pStateId);
            const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
            control.patchValue(this.lstaddressdetails[index])
            this.addressTransType = 'Update';
            this.addressindex = index;
            this.readonlyaddressdetals = true;
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    editAddressDeatails(index): void {

        try {

            this.getSateDetails(this.lstaddressdetails[index].pCountryId);
            this.getDistrictDetails(this.lstaddressdetails[index].pStateId);
            const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
            control.patchValue(this.lstaddressdetails[index])
            this.addressTransType = 'Update';
            this.addressindex = index;
            this.readonlyaddressdetals = true;
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    deleteAddressDeatails(index): void {

        try {

            //'IN-ACTIVE'
            this.lstaddressdetails.splice(index, 1);
            this.addressTransType = 'Add';
            this.addressindex = 0;
            if (this.lstaddressdetails.length == 1) {
                this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
                this.lstaddressdetails[0].pPriority = 'PRIMARY';
            }
            this.clearAddressDeatails();
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    clearAddressDeatails(): void {
        this.contactForm['controls']['pAddressControls'].reset();
        this.contactForm['controls']['pAddressControls']['controls']['pAddressType'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue('');
        this.contactForm['controls']['pAddressControls']['controls']['pCountryId'].setValue('');
        this.stateDetails = [];
        this.districtDetails = [];
        this.contactValidationErrors = {};
        this.addressTransType = 'Add';
        this.readonlyaddressdetals = false;
    }
    saveContactDetails(): void {

        this.disablesavebutton = true;
        this.savebutton = "Processing";
        try {

            this.contactSubmitted = true;
            if (this.contactForm.controls.pAge.value == null || this.contactForm.controls.pAge.value == '') {
                this.contactForm['controls']['pAge'].setValue(0);
            }
            this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
            this.contactForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            this.contactForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
            this.contactForm['controls']['pContactType'].setValue(this.contactType);

            if (this.validateSaveDeatails(this.contactForm)) {

                const control = <FormArray>this.contactForm.controls['pEmailidsList'];
                control.push(this.addcontactControls());

                this.contactForm['controls']['pEmailidsList']['controls'][0]['controls']['pEmailId'].setValue(this.contactForm.controls.pEmailId.value);
                this.contactForm['controls']['pEmailidsList']['controls'][0]['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);
                this.contactForm['controls']['pEmailidsList']['controls'][0]['controls']['pPriority'].setValue('PRIMARY');
                this.contactForm['controls']['pEmailidsList']['controls'][0]['controls']['pRecordId'].setValue(this.contactRecordId);
                this.contactForm['controls']['pEmailidsList']['controls'][0]['controls']['pContactName'].setValue(this.contactForm.controls.pName + ' ' + this.contactForm.controls.pSurName);

                this.contactForm['controls']['pBusinessEntityEmailid'].setValue(this.contactForm.controls.pEmailId.value);
                this.contactForm['controls']['pBusinessEntityContactno'].setValue(this.contactForm.controls.pContactNumber.value);





                const control1 = <FormArray>this.contactForm.controls['pEmailidsList'];
                control1.push(this.addcontactControls());

                if (this.contactForm.controls.pAlternativeNo.value == null || this.contactForm.controls.pAlternativeNo.value == '')
                    this.contactForm.controls.pAlternativeNo.setValue(0);
                this.contactForm['controls']['pEmailidsList']['controls'][1]['controls']['pEmailId'].setValue(this.contactForm.controls.pEmailId2.value);
                this.contactForm['controls']['pEmailidsList']['controls'][1]['controls']['pContactNumber'].setValue(this.contactForm.controls.pAlternativeNo.value);
                this.contactForm['controls']['pEmailidsList']['controls'][1]['controls']['pPriority'].setValue(' ');
                this.contactForm['controls']['pEmailidsList']['controls'][1]['controls']['pRecordId'].setValue(this.contactRecordId1);
                this.contactForm['controls']['pEmailidsList']['controls'][1]['controls']['pContactName'].setValue(this.contactForm.controls.pName + ' ' + this.contactForm.controls.pSurName);

                //this.contactForm.value['pAddressList'][0].push(this.lstaddressdetails);
                //const addresscontrol = <FormArray>this.contactForm['controls']['pAddressList'];
                //addresscontrol.push(this.lstaddressdetails);



                //(<FormArray>this.contactForm['controls']['pAddressList']).setValue(this.lstaddressdetails);

                //this.contactForm.setValue(this.lstaddressdetails);


                for (let i = 0; i < this.lstaddressdetails.length; i++) {
                    const addresscontrol = <FormArray>this.contactForm['controls']['pAddressList'];
                    addresscontrol.push(this.addAddressControls());
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressType'].setValue(this.lstaddressdetails[i].pAddressType);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress1'].setValue(this.lstaddressdetails[i].pAddress1);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress2'].setValue(this.lstaddressdetails[i].pAddress2);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pState'].setValue(this.lstaddressdetails[i].pState);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStateId'].setValue(this.lstaddressdetails[i].pStateId);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrict'].setValue(this.lstaddressdetails[i].pDistrict);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrictId'].setValue(this.lstaddressdetails[i].pDistrictId);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCity'].setValue(this.lstaddressdetails[i].pCity);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountry'].setValue(this.lstaddressdetails[i].pCountry);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStatusname'].setValue(this.lstaddressdetails[i].pStatusname);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountryId'].setValue(this.lstaddressdetails[i].pCountryId);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPinCode'].setValue(this.lstaddressdetails[i].pPinCode);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue(this.lstaddressdetails[i].pPriority);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['ptypeofoperation'].setValue(this.lstaddressdetails[i].ptypeofoperation);
                    this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pRecordId'].setValue(this.lstaddressdetails[i].pRecordId);

                }
                let data = JSON.stringify(this.contactForm.value)
                const contactControl = <FormArray>this.contactForm.controls['pEmailidsList'];
                for (let i = contactControl.length - 1; i >= 0; i--) {
                    contactControl.removeAt(i)
                }
                const addressControl = <FormArray>this.contactForm.controls['pAddressList'];
                for (let i = addressControl.length - 1; i >= 0; i--) {
                    addressControl.removeAt(i)
                }

                let count = 0;
                //if (this.formtype == 'Save') {
                this._contacmasterservice.checkContactIndividual(data).subscribe(res => {
                    if (res > 0) {
                        this.disablesavebutton = false;
                        this.savebutton = "Submit";
                        count = 1;
                        this.showErrorMessage('Contact already exists');
                    }
                    else if (res == 0) {
                        this._contacmasterservice.saveContactIndividual(data, this.formtype).subscribe(res => {
                            this.disablesavebutton = false;
                            this.savebutton = "Submit";

                            if (res) {
                                if (this.formtype == 'Save')
                                    this.showInfoMessage("Saved sucessfully");
                                else
                                    this.showInfoMessage("Updated sucessfully");
                                this.clearContactFormDeatails();

                                this._routes.navigate(['/ContactView'])
                            }
                            else {
                                if (this.formtype == 'Save')
                                    this.showErrorMessage("Error while saving");
                                else
                                    this.showErrorMessage("Error while updating");
                            }
                        },
                            (error) => {
                                this.disablesavebutton = false;
                                this.savebutton = "Submit";
                                this.showErrorMessage(error);
                            });
                    }
                },
                    (error) => {
                        this.disablesavebutton = false;
                        this.savebutton = "Submit";
                        this.showErrorMessage(error);
                    });
                //}


            }
            else {
                this.disablesavebutton = false;
                this.savebutton = "Submit";
            }
            //this.contactForm['controls']['pAddressList'].setValue(this.lstaddressdetails);
        }
        catch (e) {
            this.showErrorMessage(e);
        }
        //this.contactForm  pAddressList

    }
    clearContactFormDeatails(): void {
        this.contactForm.reset();
        this.lstaddressdetails = [];

        this.contactForm['controls']['pTitleName'].setValue('');
        this.clearAddressDeatails();
        this.formtype = 'Save';
        this.readonlycontactdetails = false;
        this.croppedImage = this._defaultimage.GetdefaultImage();
        this._contacmasterservice.loadContactForm.emit();

    }

    GetAddressTypeValidationByControl(key: string, isValid: boolean): boolean {

        try {
            let formcontrol;

            formcontrol = this.addresstypeForm.get(key);

            if (formcontrol) {
                if (formcontrol.validator) {
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        key = key + 'Mst';
                        let lablename;
                        this.contactValidationErrors[key] = '';
                        //if (key == 'pTitleName')
                        //  lablename = 'Title';
                        //else
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;

                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                if (errorkey == 'required')
                                    errormessage = lablename + ' ' + errorkey;
                                if (errorkey == 'email')
                                    errormessage = 'Invalid ' + lablename;
                                this.addressTypeErrorMessage[key] = errormessage + ' ';
                                isValid = false;
                            }
                        }

                    }
                }
            }
        }
        catch (e) {
            this.disableaddresstypesavebutton = false;
            this.saveaddresstypebutton = "Save";
            this.showErrorMessage(e);
            return false;
        }
        return isValid;
    }
    saveAddressType(): void {
        try {

            this.disableaddresstypesavebutton = true;
            this.saveaddresstypebutton = "Processing";
            let isValid = true;


            if (this.GetAddressTypeValidationByControl('pAddressType', isValid)) {
                this.addresstypeForm['controls']['pContactType'].setValue(this.contactType);
                this.addresstypeForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
                this.addresstypeForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
                let data = JSON.stringify(this.addresstypeForm.value)

                this._contacmasterservice.checkAddressType(this.addresstypeForm.controls.pAddressType.value, this.contactType).subscribe(res => {
               
                    if (res == 0) {

                        this._contacmasterservice.saveAddressType(data).subscribe(res => {
                            this.disableaddresstypesavebutton = false;
                            this.saveaddresstypebutton = "Save";
                            this.showInfoMessage("Saved Sucessfully");
                            $('#addresstype').modal('hide');
                            this.addresstypeForm['controls']['pAddressType'].setValue('');
                            this.clearAddressType();
                            this.getAddressTypeDetails();

                        },
                            (error) => {
                                this.disableaddresstypesavebutton = false;
                                this.saveaddresstypebutton = "Save";
                                this.showErrorMessage(error);
                            });
                    }
                    else {
                        let lablename = (document.getElementById('pAddressTypeMst') as HTMLInputElement).title;

                        this.showErrorMessage(lablename + ' already exists')
                        this.disableaddresstypesavebutton = false;
                        this.saveaddresstypebutton = "Save";
                    }

                },
                    (error) => {
                        this.disableaddresstypesavebutton = false;
                        this.saveaddresstypebutton = "Save";
                        this.showErrorMessage(error);
                    });
            }
            else {
                this.disableaddresstypesavebutton = false;
                this.saveaddresstypebutton = "Save";
            }

        }
        catch (e) {
            this.showErrorMessage(e);
        }
        //this.contactForm  pAddressList

    }
    closeAddressType(): void {

        $('#addresstype').modal('hide');
        this.clearAddressType();
    }
    clearAddressType(): void {
        this.addresstypeForm.reset();
        this.addressTypeErrorMessage = {};

    }
}
