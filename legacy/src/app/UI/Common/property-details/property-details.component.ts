import { Component, OnInit, Output, EventEmitter, Input, AfterViewChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
declare let $: any
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  propertyDetailForm: FormGroup;

  @Output() propertyDetailsEmitEvent = new EventEmitter(); 

  @Input() loanType: string;
  @Input() lstApplicantsandothers: any =[];
  @Input() showPropertyDetails: any;
  
  propertyGridData: any = [];
  tempArr = [];
  propertyDetailFormData = [];
  
  securityConfigErrorMessage:any;
  propertyDetailFileResponse: any;
  propertyDetailFileName: any;
  propertyDetailFilePath: any;
  applicantContactId:any;
  applicantReferenceId = null;

  today: Date = new Date();
  formatDateType = 'dd/MM/yyyy';

  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private commomService: CommonService,
    private formBuilder: FormBuilder, 
    private datePipe: DatePipe,
    private http: HttpClient, 
    private fIIndividualService: FIIndividualService) { 
      this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
      this.pdateofestablishmentConfig.showWeekNumbers = false;
      this.pdateofestablishmentConfig.maxDate = new Date();
      this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';
    }

  ngOnInit() {
    this.propertyGridData=[];
   this.loadInitData();
}

emptyPropertyDetails() {
  this.propertyGridData = [];
}

/**<------(start) uploading file functionality (start)------->*/
uploadAndProgressPropertyDetail(event, files) {
  let file = event.target.files[0];
  if (event && file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      this.propertyDetailFileResponse = {
        name: file.name,
        fileType: "propertyDetailFileResponse",
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
    formData.append('NewFileName', this.propertyDetailForm.value["pTypeofproperty"] + '.' + files[i]["name"].split('.').pop());
  }
  size = size / 1024;
  this.commomService.fileUpload(formData).subscribe(data => {
    this.propertyDetailFileName = data[1];
    this.propertyDetailFilePath = data[0];
  }
  )
}
/**<------(end) uploading file functionality (end)------->*/
  

/**<------(start)checking validations(start)------->*/
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
/**<------(end)checking validations(end)------->*/

/**<------(start) saving data of property details(add to grid)(start)------->*/
addPropertyDetails() {
  this.propertyDetailFileResponse = null;
  let isvalid = true;
  let addFalg: boolean = false;
  if(this.propertyDetailForm.value.pTypeofproperty || 
    this.propertyDetailForm.value.pTitledeed ||
    this.propertyDetailForm.value.pPropertyownername || 
    this.propertyDetailForm.value.pAddressofproperty || 
    this.propertyDetailForm.value.pEstimatedmarketvalue  ) {
      addFalg = true;
    }
    else {
      addFalg = false;
    }
    if(addFalg) {      
      if (this.checkValidations(this.propertyDetailForm, isvalid)) {
        this.propertyDetailFormData.push(this.propertyDetailForm.getRawValue());
        let kk = this.propertyDetailForm.value;
        
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
            this.applicantContactId = this.lstApplicantsandothers[i].pcontactid;        
            this.applicantReferenceId = this.lstApplicantsandothers[i].pcontactreferenceid;
          }
        }
        this.propertyDetailForm.controls.pTypeofproperty.setValue(this.propertyDetailForm.value["pTypeofproperty"]);
        this.propertyDetailForm.controls.pTitledeed.setValue(this.propertyDetailForm.value["pTitledeed"]);        
        this.propertyDetailForm.controls.pDeeddate.setValue(this.propertyDetailForm.value["pDeeddate"]);
        this.propertyDetailForm.controls.pPropertyownername.setValue(this.propertyDetailForm.value["pPropertyownername"]);
        this.propertyDetailForm.controls.pAddressofproperty.setValue(this.propertyDetailForm.value["pAddressofproperty"]);
        this.propertyDetailForm.controls.pEstimatedmarketvalue.setValue(this.propertyDetailForm.value["pEstimatedmarketvalue"] ? this.commomService.currencyformat(this.propertyDetailForm.value["pEstimatedmarketvalue"]) : 0);
        this.propertyDetailForm.controls.pPropertydocpathname.setValue(this.propertyDetailFileName);
        this.propertyDetailForm.controls.pPropertydocpath.setValue(this.propertyDetailFilePath);        
        this.propertyDetailForm.controls.pContactid.setValue(this.applicantContactId);
        this.propertyDetailForm.controls.pContactreferenceid.setValue(this.applicantReferenceId);
        
        this.tempArr = [];
        this.tempArr.push(this.propertyDetailForm.value);
        if ($('#filePropertyDetail').val()) {
          $('#filePropertyDetail').val(null);
        }
        if(this.propertyGridData && this.propertyGridData.length > 0) {
          this.propertyGridData = [...this.propertyGridData,...this.tempArr]
        }
        else {
          this.propertyGridData = this.tempArr;
        }
         
        this.propertyDetailsEmitEvent.emit(this.propertyGridData);
        this.propertyDetailFileName = '';
        this.propertyDetailFilePath = '';
        this.propertyDetailForm = this.formBuilder.group({
          createdby: 1,
          modifiedby: [0],
          pIsapplicable: true,
          pRecordid: [0],
          pContactid: [0],
          pContactreferenceid: [''],
          pTypeofproperty: [''],
          pTitledeed: ['Leasehold'],
          pDeeddate: [new Date()],
          pPropertyownername: [''],
          pAddressofproperty: [''],
          pEstimatedmarketvalue: [''],
          pPropertydocpath: [''],
          pPropertydocpathname: [''],
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
    
        this.propertyDetailFileName = null;
        this.BlurEventAllControll(this.propertyDetailForm)
      }
    }
}
/**<------(end) saving data of property details(add to grid)(end)------->*/

/**<------(start)deleting particular row in grid(start)------->*/
removeHandler(event){
  this.propertyGridData.splice(event.rowIndex,1)
}
/**<------(end)deleting particular row in grid(end)------->*/

loadInitData() {
  this.securityConfigErrorMessage = {};
    this.propertyDetailForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [0],
      pContactreferenceid: [''],
      pTypeofproperty: [''],
      pTitledeed: ['Leasehold'],
      pDeeddate: [new Date()],
      pPropertyownername: [''],
      pAddressofproperty: [''],
      pEstimatedmarketvalue: [''],
      pPropertydocpath: [''],
      pPropertydocpathname: [''],
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

    this.BlurEventAllControll(this.propertyDetailForm);
}

}