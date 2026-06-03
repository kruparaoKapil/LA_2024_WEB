import { Component, OnInit, DoCheck, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../Services/common.service';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
declare let $: any

@Component({
  selector: 'app-tdsdetails',
  templateUrl: './tdsdetails.component.html',
  styles: []
})
export class TDSDetailsComponent implements OnInit {
  public TDSdetailsForm: FormGroup;
  public MasterForm: FormGroup;
  public today = new Date();
  public TDSsectiondetails: any;
  public tdsValidationErrors: any;
  public ModelValidationErrors: any
  public stateDetails: any;
  public GSTdetails: any;
  public savebuttonshow: boolean = true;
  public submitted = false;
  public labelname: any;
  public savingdata: any;
  public ShowTds: boolean = true;
  public ShowGst: boolean = true;
  public tdsshow: boolean = true;
  public gstshow: boolean = true;
  public Formvalidation: boolean = true;
  public formarray: any = [{ id: 1, data: "pGstType" }, { id: 2, data: "pGstNo" }, { id: 3, data: "pStateName" }];
  constructor(private formbuilder: FormBuilder, private _contacmasterservice: ContacmasterService, public Toast: ToastrService, private _commonService: CommonService, private _TdsService: TdsdetailsService) { }

  ngOnInit() {
    debugger
    this.tdsValidationErrors = {};
    this.tdsshow = true;
    this.gstshow = true;

    this.ModelValidationErrors = {};
    this.getformdata();
    this.MasterForm = this.formbuilder.group({
      pTdsSection: [''],
      pGstType: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ['Active'],
    })
    this.getTDSsectiondetails();
    this.getStateDetails();
    this.getGSTdetails()
    this.ModelBlurEventAllControll(this.MasterForm);
    this._commonService._GetTDSUpdate().subscribe(data => {
      debugger
      if (data == null) {
        this.updatingdata();

      } else {

        // this.TDSdetailsForm.setValue({"createdby": data.createdby, "pContactName": '', "modifiedby": data.modifiedby, "pReferralId": data.pReferralId, "pRefTaxId": data.pRefTaxId, "pIstdsApplicable": data.pIstdsApplicable, "ptdsSectionName": data.ptdsSectionName, "pIsgstApplicable": data.pIsgstApplicable, "pStateName": data.pStateName, "pGstType": data.pGstType,"pCreatedby": data.pCreatedby, "pModifiedby": data.pModifiedby, "pCreateddate": data.pCreateddate, "pModifieddate": data.pModifieddate, "pStatusid": data.pStatusid, "pStatusname": data.pStatusname, "pEffectfromdate": '', "pEffecttodate": '',"ptypeofoperation": 'UPDATE'});
        if (data.pIstdsApplicable == false) {
          this.tdsCheck(false)
        }
        else {
          this.tdsCheck(true)
        }
        this.TDSdetailsForm.controls.pIsgstApplicable.setValue(data.pIsgstApplicable);
        if (data.pIsgstApplicable == false) {
          this.gstCheck(false)
        }
        else {
          this.gstCheck(true)
        }
        this.TDSdetailsForm.controls.pReferralId.setValue(data.pReferralId);
        this.TDSdetailsForm.controls.pRefTaxId.setValue(data.pRefTaxId);
        this.TDSdetailsForm.controls.pIstdsApplicable.setValue(data.pIstdsApplicable);

        this.TDSdetailsForm.controls.pStateName.setValue(data.pStateName);
        this.TDSdetailsForm.controls.pGstType.setValue(data.pGstType);
        this.TDSdetailsForm.controls.pGstNo.setValue(data.pGstNo);

        this.TDSdetailsForm.controls.modifiedby.setValue(1);
        this.TDSdetailsForm.controls.ptdsSectionName.setValue(data.ptdsSectionName);

        this.TDSdetailsForm.controls.pStatusname.setValue(data.pStatusname);
        this.TDSdetailsForm.controls.ptypeofoperation.setValue('UPDATE');

        let isValid = true;
        if (this.checkValidations(this.TDSdetailsForm, isValid)) {
          this.updatingdata();
        }
      }
    });

    //this.TDSdetailsForm.controls.pReferralId.setValue(this._commonService._GetReferralid());
  }

  getformdata() {

    this.TDSdetailsForm = this.formbuilder.group({
      createdby: [this._commonService.pCreatedby],
      modifiedby: [0],
      pReferralId: [0],  //
      pRefTaxId: [0],   //
      pIstdsApplicable: [false],
      ptdsSectionName: [''],
      pIsgstApplicable: [false],
      pStateName: [''],
      pGstType: [''],
      pGstNo: [''],
      pCreatedby: [this._commonService.pCreatedby],
      // pModifiedby: [0],
      // pCreateddate: [this.today],
      // pModifieddate: [''],
      // pStatusid: [1],
      pStatusname: [this._commonService.pStatusname],
      //  pEffectfromdate: [''],
      //  pEffecttodate: [''],
      ptypeofoperation: [this._commonService.ptypeofoperation]

    });
    this.tdsCheck(false)
    this.gstCheck(false)
    this.BlurEventAllControll(this.TDSdetailsForm);

  }
  tdsCheck(event) {

    if (event == false || event == true) {
      var checked = event;
    }
    else {
      var checked = event.target.checked;
    }
    //var checked = event.target.checked;
    this.TDSdetailsForm.controls['ptdsSectionName'].setValue('');
    if (checked == false) {
      //this.TDSdetailsForm.controls['ptdsSectionName'].disable();
      this.tdsshow = false;
      this.TDSdetailsForm.controls['ptdsSectionName'].clearValidators();
      this.TDSdetailsForm.controls['ptdsSectionName'].updateValueAndValidity();
    }
    else {
      //this.TDSdetailsForm.controls['ptdsSectionName'].enable();
      this.tdsshow = true;
      this.TDSdetailsForm.controls['ptdsSectionName'].setValidators([Validators.required]);
      this.TDSdetailsForm.controls['ptdsSectionName'].updateValueAndValidity();
    }
    this.BlurEventAllControll(this.TDSdetailsForm);
    //this.TDSdetailsForm.controls['pIsgstApplicable'].setValue(checked);
    //this.gstCheck(checked)
  }

  gstCheck(checked) {

    if (checked == false || checked == true) {
      var checked = checked;
    }
    else {
      var checked = checked.target.checked;
    }
    for (var n = 0; n < this.formarray.length; n++) {
      this.TDSdetailsForm.controls[this.formarray[n].data].setValue('');
    }
    if (checked == false) {
      this.gstshow = false;
      for (var n = 0; n < this.formarray.length; n++) {
        this.TDSdetailsForm.controls[this.formarray[n].data].clearValidators();
        this.TDSdetailsForm.controls[this.formarray[n].data].updateValueAndValidity();
      }
    }
    else {
      this.gstshow = true;
      for (var n = 0; n < this.formarray.length; n++) {
        this.TDSdetailsForm.controls[this.formarray[n].data].setValidators([Validators.required]);
        this.TDSdetailsForm.controls[this.formarray[n].data].updateValueAndValidity();
      }

    }
    this.TDSdetailsForm.controls['pIsgstApplicable'].setValue(checked);
    this.BlurEventAllControll(this.TDSdetailsForm);
    this.tdsValidationErrors = {};
  }



  getTDSsectiondetails(): void {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
        }
      },
      (error) => {

        this.showErrorMessage(error);
      }
    );
  }
  getGSTdetails(): void {

    this._TdsService.getGSTdetails().subscribe(
      (json) => {

        if (json != null) {
          this.GSTdetails = json;
        }
      },
      (error) => {

        this.showErrorMessage(error);
      }
    );
  }
  public getStateDetails() {

    this._contacmasterservice.getSateDetails(1).subscribe(json => {


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
  //----------------VALIDATION----------------------- //
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
          this.tdsValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.tdsValidationErrors[key] += errormessage + ' ';
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
  //----------------VALIDATION----------------------- //

  //----------------VALIDATION----------------------- //
  ModelcheckValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.ModelGetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  ModelGetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.ModelValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ModelValidationErrors[key] += errormessage + ' ';
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
  ModelshowErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  ModelBlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.ModelsetBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.ModelshowErrorMessage(e);
      return false;
    }
  }
  ModelsetBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.ModelBlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.ModelshowErrorMessage(e);
      return false;
    }
  }

  //----------------VALIDATION----------------------- //

  OpenModel(form) {

    if (form == "TDS") {
      this.labelname = "TDS";
      this.ShowTds = true;
      this.ShowGst = false;
      this.MasterForm.controls['pGstType'].setValue('');
      this.MasterForm.controls['pGstType'].clearValidators();
      this.MasterForm.controls['pGstType'].updateValueAndValidity();
      this.MasterForm.controls['pTdsSection'].setValue('');
      this.MasterForm.controls['pTdsSection'].setValidators([Validators.required]);
      this.MasterForm.controls['pTdsSection'].updateValueAndValidity();
    }
    if (form == "GST") {
      this.labelname = "GST";
      this.ShowTds = false;
      this.ShowGst = true;
      this.MasterForm.controls['pTdsSection'].setValue('');
      this.MasterForm.controls['pTdsSection'].clearValidators();
      this.MasterForm.controls['pTdsSection'].updateValueAndValidity();
      this.MasterForm.controls['pGstType'].setValue('');
      this.MasterForm.controls['pGstType'].setValidators([Validators.required]);
      this.MasterForm.controls['pGstType'].updateValueAndValidity();
    }
    // this.chargemasterservice.SetButtonType(undefined)
    this.savebuttonshow = true
    this.submitted = false

    $('#add-detail').modal('show');
  }
  CloseModel() {

    this.MasterForm.reset();
    this.labelname = "";
    this.submitted = false
    $('#add-detail').modal('hide');
    //this.chargemasterservice.SetButtonType(undefined)
    this.savebuttonshow = true
  }
  savemodel() {

    let isValid = true;
    let count = 0;
    //if (this.ModelcheckValidations(this.MasterForm, isValid)) {
    if (this.labelname === 'TDS' || this.labelname == 'GST') {
      this.MasterForm.controls.pStatusname.setValue('Active');
      this.MasterForm.controls.pCreatedby.setValue(this._commonService.pCreatedby);
      if (this.MasterForm.valid) {
        if (this.labelname === 'TDS') {
          let Tds = this.MasterForm.controls.pTdsSection.value;
          this._TdsService.checkTDS(Tds).subscribe(res => {
            if (res > 0) {
              count = 1;
              this.showErrorMessage('TDS already exists');
            }
            else {
              this.MasterForm.controls.pGstType.setValue('No data');
              this.savingdata = this.MasterForm.value;
              this.savingdata = JSON.stringify(this.savingdata);
              this._TdsService.saveTDS(this.savingdata).subscribe(res => {
                if (res) {
                  this.getTDSsectiondetails();
                  this.MasterForm.reset();
                  $('#add-detail').modal('hide');
                }
              })
            }
          });
        } else {
          let GST = this.MasterForm.controls.pGstType.value;
          this._TdsService.checkGST(GST).subscribe(res => {
            if (res > 0) {
              count = 1;
              this.showErrorMessage('GST already exists');
            }
            else {
              this.MasterForm.controls.pTdsSection.setValue('No data');
              this.savingdata = this.MasterForm.value
              this.savingdata = JSON.stringify(this.savingdata);
              this._TdsService.saveGST(this.savingdata).subscribe(res => {
                if (res) {
                  this.getGSTdetails();
                  this.MasterForm.reset();
                  $('#add-detail').modal('hide');
                }
              })
            }
          });

        }
      }
    }
    //   }
  }
  Clearmodel() {
    this.MasterForm.reset();
  }
  clearfn() {

    this.TDSdetailsForm.reset();
    this.MasterForm.reset();
    this.CloseModel();
    this.getformdata();
  }


  updatingdata() {
    let data = this.TDSdetailsForm.value;
    // let TDS = this.TDSdetailsForm.controls.pIstdsApplicable.value;
    // let GST = this.TDSdetailsForm.controls.pIsgstApplicable.value;
    // if (TDS == false && GST == false) {
    //   this._commonService._SetTDSData('')
    // }
    // else {
      this._commonService._SetTDSData(data)
    //}
  }

  AddorUpdatedata() {
    let isValid = true;
    if (this.checkValidations(this.TDSdetailsForm, isValid)) {
      this.updatingdata();
      this.setFormData(true);
    }
    else {
      this.setFormData(false);
    }
  }

  getFormData(): any {
    return this.Formvalidation;
  }
  setFormData(formData) {
    this.Formvalidation = formData;
  }
}

