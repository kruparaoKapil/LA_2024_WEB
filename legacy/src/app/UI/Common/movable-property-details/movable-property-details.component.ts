import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { FiSecurityandcollateralComponent } from '../../Loans/Transactions/FIIndividual/fi-securityandcollateral.component';

declare let $: any
@Component({
  selector: 'app-movable-property-details',
  templateUrl: './movable-property-details.component.html',
  styleUrls: ['./movable-property-details.component.css']
})
export class MovablePropertyDetailsComponent implements OnInit {
  @Output() movablepropertyDetailsEmitEvent = new EventEmitter();
  movablePropertyGridData: any = [];
  @Input() lstApplicantsandothers: any = [];
  @Input() showMovablePropertyDetails: any;

  movablePropertyDetailsForm: FormGroup;

  today: Date = new Date();
  tempArr = [];
  // showMovablePropertyDetails = true;
  applicantRefereneId = null;
  movablePropertyDetailFormData = [];
  // movablePropertyGridData = [];

  securityConfigErrorMessage: any;
  movablePropertyDetailFilePath: any;
  movablePropertyDetailFileName: any;
  movablePropertyFileResponse: any;
  applicantContactId: any;

  constructor(private commomService: CommonService,
    private formBuilder: FormBuilder, private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    //validations for movable property details
    this.movablePropertyGridData = [];
    this.loadInitData();

  }
  //file upload
  uploadAndProgressMovableProperty(event, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.movablePropertyFileResponse = {
          name: file.name,
          fileType: "movablePropertyFileResponse",
          contentType: file.type,
          size: file.size,

        };
      };
    }
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name
      formData.append(files[i].name, files[i]);
      formData.append('NewFileName', this.movablePropertyDetailsForm.value["pTypeofvehicle"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this.commomService.fileUpload(formData).subscribe(data => {
      this.movablePropertyDetailFileName = data[1];
      this.movablePropertyDetailFilePath = data[0];
    })
  }
//checking validations started
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

      formcontrol = formGroup.get(key);

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.securityConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commomService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.securityConfigErrorMessage[key] += errormessage + ' ';
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
  //checking validations "ended"

  //not applicable check box
  // notApplicableMovablePropertyDetails(event) {
  //   let checked;
  //   if (event == true || event == false) {
  //     checked = event;
  //   }
  //   else {
  //     checked = event.target.checked;
  //   }
  //   if (checked == true) {
  //     this.showMovablePropertyDetails = false;
  //   }
  //   else {
  //     this.showMovablePropertyDetails = true;
  //   }

  // }

//saving data of movable property details
  addMovablePropertyDetails() {
    this.movablePropertyFileResponse = null;
    let isvalid = true;
    let addFlag: boolean = false;
    if(this.movablePropertyDetailsForm.value.pTypeofvehicle ||
      this.movablePropertyDetailsForm.value.pVehicleownername ||
      this.movablePropertyDetailsForm.value.pVehiclemodelandmake ||
      this.movablePropertyDetailsForm.value.pRegistrationno ||
      this.movablePropertyDetailsForm.value.pEstimatedmarketvalue) {
        addFlag = true;
      }
      else {
        addFlag = false
        if ($('#fileMovableProperty').val()) {
          $('#fileMovableProperty').val(null);
          this.movablePropertyDetailFileName = '';
          this.movablePropertyDetailFilePath = '';
        }
      }

      if(addFlag) {
        if (this.checkValidations(this.movablePropertyDetailsForm, isvalid)) {
          this.movablePropertyDetailFormData.push(this.movablePropertyDetailsForm.getRawValue());
          let mpd = this.movablePropertyDetailsForm.value;
          
          for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
            if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
              this.applicantContactId = this.lstApplicantsandothers[i].pcontactid;
              this.applicantRefereneId = this.lstApplicantsandothers[i].pcontactreferenceid;
            }
          }
          
          this.movablePropertyDetailsForm.controls.pTypeofvehicle.setValue(this.movablePropertyDetailsForm.value["pTypeofvehicle"]);
          this.movablePropertyDetailsForm.controls.pVehicleownername.setValue(this.movablePropertyDetailsForm.value["pVehicleownername"]);
          this.movablePropertyDetailsForm.controls.pVehiclemodelandmake.setValue(this.movablePropertyDetailsForm.value["pVehiclemodelandmake"]);
          this.movablePropertyDetailsForm.controls.pRegistrationno.setValue(this.movablePropertyDetailsForm.value["pRegistrationno"]);
          this.movablePropertyDetailsForm.controls.pEstimatedmarketvalue.setValue(this.movablePropertyDetailsForm.value["pEstimatedmarketvalue"] ? this.commomService.currencyformat(this.movablePropertyDetailsForm.value["pEstimatedmarketvalue"]) : 0);
          this.movablePropertyDetailsForm.controls.pVehicledocpathname.setValue(this.movablePropertyDetailFileName);
          this.movablePropertyDetailsForm.controls.pVehicledocpath.setValue(this.movablePropertyDetailFilePath);
          this.movablePropertyDetailsForm.controls.pContactreferenceid.setValue(this.applicantRefereneId);
          this.movablePropertyDetailsForm.controls.pContactid.setValue(this.applicantContactId);
          this.tempArr = [];
          this.tempArr.push(this.movablePropertyDetailsForm.value);
          
          if(this.movablePropertyGridData && this.movablePropertyGridData.length > 0) {
            this.movablePropertyGridData = [...this.movablePropertyGridData,...this.tempArr]
          }
          else {
            this.movablePropertyGridData = this.tempArr;
          }
          
          // this.movablePropertyGridData.push(this.movablePropertyDetailsForm.value);
          this.movablepropertyDetailsEmitEvent.emit(this.movablePropertyGridData);
          this.movablePropertyDetailFileName = '';
          this.movablePropertyDetailFilePath = '';
          if ($('#fileMovableProperty').val()) {
            $('#fileMovableProperty').val(null);
          }
          this.movablePropertyDetailsForm = this.formBuilder.group({
            createdby: 1,
            modifiedby: [0],
            pIsapplicable: true,
            pRecordid: [0],
            pContactid: [0],
            pContactreferenceid: [''],
            // pTypeofvehicle: ['',Validators.required],
            // pVehicleownername: ['',Validators.required],
            pTypeofvehicle: [''],
            pVehicleownername: [''],
            pVehiclemodelandmake: [''],
            pRegistrationno: [''],
            // pEstimatedmarketvalue: ['',Validators.required],
            pEstimatedmarketvalue: [''],
            pVehicledocpath: [''],
            pVehicledocpathname: [''],
            pCreatedby: [this.commomService.pCreatedby],
            pModifiedby: [0],
            pCreateddate: [this.today],
            pModifieddate: [''],
            pStatusid: "",
            pStatusname: ['ACTIVE'],
            pEffectfromdate: "",
            pEffecttodate: "",
            ptypeofoperation: ['CREATE']
    
          })
          this.BlurEventAllControll(this.movablePropertyDetailsForm)
        }
      }
  }
//deleting particular row in grid
  removeHandler(event) {
    this.movablePropertyGridData.splice(event.rowIndex, 1)
  }

  // ngAfterViewChecked() {
  //   if(this.movableproperDetails && this.movableproperDetails.length > 0) {
  //     this.movablePropertyGridData = this.movableproperDetails;
  //   }
  // }
  loadInitData() {
    this.securityConfigErrorMessage = {};
    this.movablePropertyDetailsForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [1],
      pContactreferenceid: [''],
      // pTypeofvehicle: ['',Validators.required],
      // pVehicleownername: ['',Validators.required],
      pTypeofvehicle: [''],
      pVehicleownername: [''],
      pVehiclemodelandmake: [''],
      pRegistrationno: [''],
      // pEstimatedmarketvalue: ['',Validators.required],
      pEstimatedmarketvalue: [''],
      pVehicledocpath: [''],
      pVehicledocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusid: "",
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: ['CREATE']

    })
    this.BlurEventAllControll(this.movablePropertyDetailsForm);
  }
}
