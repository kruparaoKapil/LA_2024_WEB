import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { BranchconfigService } from '../../../Services/Settings/branchconfig.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AddressComponent } from '../../Common/address/address.component';
import { ContacmasterService } from '../../../Services/Loans/Masters/contacmaster.service';
import { CompanyconfigDocumentsComponent } from '../company-config/companyconfig-documents/companyconfig-documents.component';
import { debug, log } from 'util';
declare let $: any;

@Component({
  selector: 'app-branch-config',
  templateUrl: './branch-config.component.html',
  styles: []
})
export class BranchConfigComponent implements OnInit {
  @ViewChild(AddressComponent, { static: false }) addresscomponent: AddressComponent;
  @ViewChild(CompanyconfigDocumentsComponent, { static: false }) documentformdetails: CompanyconfigDocumentsComponent;

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public clearbuttonshow: boolean = false;


  minDate: Date
  maxDate: Date = new Date();
  BranchConfigvalidators: any;
  griddata: any = []
  buttonname: any


  branchConfigform: FormGroup;
  addresstypeForm: FormGroup;

  contacttype = "Business Entity"


  addressTypes: any;
  addressFormdata: any;
  lstaddressdetails = [];
  bsValue = new Date();
  constructor(private fb: FormBuilder, private _commonservice: CommonService, private _branchconfigService: BranchconfigService, private toastr: ToastrService, private _router: Router, private _contacmasterservice: ContacmasterService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    // this.dpConfig.minDate = new Date();
    this.dpConfig.showWeekNumbers = false;

  }



  ngOnInit() {


    this.getAddressTypes();
    this.BranchConfigvalidators = {};

    this.branchConfigform = this.fb.group({
      pbranchid: [0],
      pbranchname: ['', Validators.required],
      pbranchcode: ['', Validators.required],
      pAddressType: [''],
      pgstinnumber: [''],
      pcontactnumber: ['', [Validators.required, Validators.minLength(10)]],
      pemailid: ['', Validators.pattern],
      pCreatedby: [this._commonservice.pCreatedby],
      ptypeofoperation: [this._commonservice.ptypeofoperation],
      pPriority: [''],
      lstBranchAddressDTO: this.fb.array([]),
      lstBranchDocStoreDTO: this.fb.array([])
    })
    this.loadAddressInitData();
    this.addAddressControls();
    this.BlurEventAllControll(this.branchConfigform);

    this.getLoadBranchDetails();

    this.buttonname = "Save";


  }
  getLoadBranchDetails() {
    debugger
    this._branchconfigService.getBranchDetails().subscribe(data => {

      console.log(data);
      debugger;
      this.branchConfigform.patchValue({
        pbranchid: data.pbranchid ? data.pbranchid : 0,
        pbranchname: data.pbranchname ? data.pbranchname : '',
        pbranchcode: data.pbranchcode ? data.pbranchcode : '',
        pestablishmentdate: data.pestablishmentdate,
        pgstinnumber: data.pgstinnumber ? data.pgstinnumber : '',
        pcontactnumber: data.pcontactnumber ? data.pcontactnumber : '',
        pemailid: data.pemailid ? data.pemailid : '',
        ptypeofoperation: 'UPDATE'

      })
      this.griddata = data['lstBranchAddressDTO']
      this.documentformdetails.gridData = data['lstBranchDocStoreDTO']
      this.BranchConfigvalidators = {};
      this.BlurEventAllControll(this.branchConfigform);
      if (this.branchConfigform.controls.ptypeofoperation.value == 'UPDATE') {
        this.buttonname = 'Update';
      }
      else {
        this.buttonname = "Save";
      }
      this.clearbuttonshow!=this.clearbuttonshow
    })
  }

  addAddressControls() {
    return this.fb.group({
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


  loadAddressInitData() {
    this.addresstypeForm = this.fb.group({
      pContactType: [''],
      pAddressType: ['', Validators.required],
      pStatusname: ['ACTIVE', Validators.required],
      pCreatedby: ['', Validators.required]
    })
  }

  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {

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
      return false;
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {

      return false;
    }
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      debugger
      formcontrol = formGroup.get(key);

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.BranchConfigvalidators[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.BranchConfigvalidators[key] += errormessage + ' ';
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

  saveaddresstype() {
    debugger
    this.addresstypeForm.controls.pContactType.setValue(this.contacttype);
    this.addresstypeForm.controls.pCreatedby.setValue(this._commonservice.pCreatedby);
    console.log("this.addresstypeForm.value : ", this.addresstypeForm.value);

    let data = JSON.stringify(this.addresstypeForm.value);

    this._contacmasterservice.checkAddressType(this.addresstypeForm.controls.pContactType.value, this.addresstypeForm.controls.pAddressType.value).subscribe(res => {

      if (res == 0) {
        this._contacmasterservice.saveAddressType(data).subscribe(response => {
          if (response == true) {

            $('#addresstype').modal('hide');
            this.loadAddressInitData();
            this.getAddressTypes();
          }
          else {
            // this._commonservice.showErrorMessage("Something went wrong from serverside, Please try after sometime!  ");
          }

        })
      }
      else {
        this._commonservice.showWarningMessage("Already Exists");
      }
    });
  }

  getAddressTypes() {
    this._branchconfigService.getAddressTypes().subscribe(data => {
      this.addressTypes = data;
    })
  }

  /** address type validation dont check in saving */
  addresstype(type) {
    let isValid = true;
    debugger
    let pAddressType = <FormGroup>this.branchConfigform['controls']['pAddressType'];
    if (type == 'GET') {
      pAddressType.setValidators(Validators.required);
    }
    else {
      pAddressType.clearValidators();
    }
    pAddressType.updateValueAndValidity();
    this.BranchConfigvalidators = {}
    this.BlurEventAllControll(this.branchConfigform);
  }

  /** Adding address details to grid */
  addAddressDetails() {

    let isValid = true;
    this.addressFormdata = this.addresscomponent.addressForm.value;
    this.addresstype('GET');
    this.addresstypecheckValidations(this.branchConfigform, isValid)
    if (this.addresscomponent.checkValidations(this.addresscomponent.addressForm, isValid)) {

      let objpAddressType = {
        pAddressType: this.branchConfigform.value.pAddressType
      }
      debugger
      this.branchConfigform.value.lstBranchAddressDTO = [];
      this.branchConfigform.value.lstBranchAddressDTO.push({ ...this.addresscomponent.addressForm.value, ...objpAddressType });
      
      if (this.griddata.length == 0) {
        this.branchConfigform.value["lstBranchAddressDTO"][0]["pPriority"] = true
        this.branchConfigform.value["lstBranchAddressDTO"][0]["ptypeofoperation"] = 'CREATE';


        this.griddata = this.branchConfigform.value.lstBranchAddressDTO
        this.addresscomponent.ngOnInit();
        this.addresstype('SET')
      }
      else {
        let count = 0;

        for (let i = 0; i < this.griddata.length; i++) {
          if (objpAddressType.pAddressType == this.griddata[i]['pAddressType']) {
            this._commonservice.showWarningMessage("Already Exists");
            break;
          }
          else {
            count++;
          }
        }
        if (count == this.griddata.length) {
          this.branchConfigform.value["lstBranchAddressDTO"][0]["pPriority"] = false
          this.branchConfigform.value["lstBranchAddressDTO"][0]["ptypeofoperation"] = 'CREATE'
          this.griddata = [...this.griddata, ...this.branchConfigform.value.lstBranchAddressDTO];
          this.addresscomponent.ngOnInit();
          this.addresstype('SET')
        }

      }
      this.branchConfigform.controls.lstBranchAddressDTO = this.griddata;
      this.branchConfigform.controls['pAddressType'].setValue('')
      this.addresscomponent.clear();
    }
  }
  removeHandler(event) {
    this.griddata.splice(event.rowIndex, 1);
  }


  addresstypecheckValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
    try {
      Object.keys(group.controls).forEach((key: string) => {
        if (key == 'pAddressType')

          isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }


  /** save branch configuration **/
  saveBranchConfigform() {
    debugger
    let isvalid = true;
    console.log("--->", this.branchConfigform.valid)
    this.addresstype('SET');
    if (this.checkValidations(this.branchConfigform, isvalid)) {

      debugger;
      this.buttonname = "Processing";
      this.branchConfigform.value['lstBranchAddressDTO'] = this.griddata;
      this.branchConfigform.value['lstBranchDocStoreDTO'] = this.documentformdetails.gridData;
      let formdata = JSON.stringify(this.branchConfigform.value);
      this._branchconfigService.saveBranchconfigformdata(formdata).subscribe(value => {

        this.toastr.success("Saved Successfully", 'Success')
        this.buttonname = "Save";
        this.branchConfigform.clearValidators();
        this.addresscomponent.clear();
        this.documentformdetails.clear();
        this.getLoadBranchDetails();
      }, error => {
        this.toastr.error(error, 'Error')
        this.buttonname = "Save";

      })
    }
  }

  clear() {
    debugger
    this.branchConfigform.reset();
    this.branchConfigform.controls.pCreatedby.setValue(this._commonservice.pCreatedby)
    this.buttonname = 'Save';
  }

  showErrorMessage(errormsg: string) {
    this._commonservice.showErrorMessage(errormsg);
  }
}
