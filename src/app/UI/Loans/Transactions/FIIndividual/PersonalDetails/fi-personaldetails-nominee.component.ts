import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../Services/common.service';
import { FIIndividualService } from '../../../../../Services/Loans/Transactions/fiindividual.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

declare let $: any
@Component({
  selector: 'app-fi-personaldetails-nominee',
  templateUrl: './fi-personaldetails-nominee.component.html',
  styles: []
})
export class FiPersonaldetailsNomineeComponent implements OnInit {
  nomineeForm: FormGroup;

  @Input() showNominee: any;
  
    nomineeList = [];

    formValidationMessages: any;
    idProofTypeList: any;
    showpercentage:boolean=false
    showpercentageintable:boolean=false
    idProofList: any;
    imageResponse: any;
    kycFilePath:any;
    kycFileName:any;

  public pdateofbirthConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(
    private datepipe: DatePipe, 
    private _FormBuilder: FormBuilder, 
    private _commonService: CommonService, 
    private _FIIndividualService: FIIndividualService) {
    this.pdateofbirthConfig.containerClass = 'theme-dark-blue';
    this.pdateofbirthConfig.showWeekNumbers = false;
    this.pdateofbirthConfig.maxDate = new Date();
    this.pdateofbirthConfig.dateInputFormat = 'DD-MM-YYYY'
  }

  ngOnInit() {
    this.nomineeList = [];
    this.formValidationMessages = {};
    this.nomineeForm = this._FormBuilder.group({
      precordid: [0],
      pnomineename: [''],
      prelationship: ['', Validators.required],
      pdateofbirth: [''],
      page: [''],
      pcontactno: ['',[Validators.maxLength(12),Validators.minLength(10)]],
      pidprooftype: [''],
      pDocumentGroup: [''],
      pDocumentGroupId: [''],
      pidproofname: [''],
      pDocumentId: [''],
     

      pisprimarynominee: [false],
      pDocumentName: [''],
      preferencenumber: [''],
      pdocidproofpath: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],
    })
    this.BlurEventAllControll(this.nomineeForm);
    this.getidProofTypeList();
  }
  trackByFn(index, item) {
    return index; // or item.id
  }

  /**<-----(start) checking validations based on formgroup(start)-------> */
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
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
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
  /**<-----(end) checking validations based on formgroup(end)-------> */

  /**<-----(start) checking validations of nominee form(start)-------> */
  validateNominee() {    
    let isValid = true;
    let addFlag = false;
    let fullname = this.nomineeForm.controls.pnomineename.value;
    fullname = fullname.trim();
    if(fullname) {
      if(this.nomineeForm.value.pnomineename ||
        this.nomineeForm.value.prelationship ||
        this.nomineeForm.value.pdateofbirth ||
        this.nomineeForm.value.pcontactno ||
        this.nomineeForm.value.pidproofname        
        ) {
          addFlag = true;
          isValid = addFlag;
        }
        else {
          addFlag = false;
          isValid = addFlag;          
        }
        this.formValidationMessages.pnomineename = "";
        this.BlurEventAllControll(this.nomineeForm);
    }
    else {
      addFlag = false;
      isValid = addFlag;
      this.BlurEventAllControll(this.nomineeForm);
      this.formValidationMessages.pnomineename = "Full Name is required";
    }      
       if(addFlag){         
        if(this.nomineeList.length > 0) {    
          for (let i = 0; i < this.nomineeList.length; i++) {     
            if(this.nomineeList[i].pnomineename == this.nomineeForm.value.pnomineename && 
              this.nomineeList[i].prelationship == this.nomineeForm.value.prelationship)  {
                this._commonService.showWarningMessage("Already existed");
                isValid = false;
               break;
              } 
              else {
                isValid = true;
              } 
          }
        }
      }
    return isValid;
  }
  /**<-----(end) checking validations of nominee form(end)-------> */

  /**<-----(start) add nominee form data to grid(start)-------> */
  Percentagechange(event){
   this.nomineeForm.controls.pPercentage.setValue(event.target.value);
  }
  addNominee() {   
    debugger;
    try {      
           if (this.validateNominee()) {   
            if(this.nomineeForm.value.prelationship==''){
              this._commonService.showWarningMessage("Add Relationship");
              return;
            }   
          let latest_date = this.nomineeForm.controls.pdateofbirth.value;
          this.nomineeForm['controls']['pdateofbirth'].setValue(latest_date);
          this.nomineeForm['controls']['pdocidproofpath'].setValue(this.kycFilePath);
          this.nomineeForm['controls']['pidproofname'].setValue(this.kycFileName);
          if(this.nomineeList.length == 0) {
            this.nomineeForm['controls']['pisprimarynominee'].setValue(true);
          }
          else {
            this.nomineeForm['controls']['pisprimarynominee'].setValue(false);
          }
          this.nomineeList.push(this.nomineeForm.value);
         // this.nomineeForm.controls.pPercentage.setValue('0');
        this.nomineeForm.reset();
       //this.nomineeForm.controls.pPercentage.setValue('');
        this.kycFileName='';
        this.kycFilePath='';
        this.formValidationMessages = {};
        if(this.imageResponse)
        this.imageResponse.name='';
        $('#fileKycNomineeDetails').val(null);
        this.nomineeForm = this._FormBuilder.group({
          precordid: [0],
          pnomineename: [''],
          prelationship: ['', Validators.required],
          pdateofbirth: [''],
          page: [''],
          pcontactno: ['',[Validators.maxLength(12),Validators.minLength(10)]],
          pisprimarynominee: [false],
          pidprooftype: [''],
          pDocumentGroup: [''],
          pDocumentGroupId: [''],
          pidproofname: [''],
          pDocumentId: [''],
          pDocumentName: [''],
          preferencenumber: [''],
          pdocidproofpath: [''],
          pPercentage:['0'],

          pCreatedby: [this._commonService.pCreatedby],
          pStatusname: ['ACTIVE'],
          ptypeofoperation: ['CREATE'],
        })
        this.BlurEventAllControll(this.nomineeForm);
      }else{
        if ($('#fileKycNomineeDetails').val()) {
          $('#fileKycNomineeDetails').val(null);
          if(this.imageResponse)
          this.imageResponse.name='';
        }
      }
    } catch (e) {
    }
  }
  /**<-----(end) add nominee form data to grid(end)-------> */

  /**<-----(start) remove one record to grid(start)-------> */
  deleteNominee(index) {
    this.nomineeList.splice(index, 1);
  }
  /**<-----(end) remove one record to grid(end)-------> */

  /**<-----(start) get id proof type list from api(start)-------> */
   getidProofTypeList() {
    this._FIIndividualService.getDocumentGroupNames().subscribe(json => {
      
      if (json != null) {
        this.idProofTypeList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });

  }
  /**<-----(end) get id proof type list from api(end)-------> */

  /**<-----(start) change id proof type functionality(start)-------> */
   pidprooftypeChange($event) {
    const pDocumentId = $event.target.value;
    this.idProofList = [];

    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.nomineeForm['controls']['pidprooftype'].setValue(pDocumentGroup);
      this.nomineeForm['controls']['pDocumentGroup'].setValue(pDocumentGroup);
      this.getidProofList(pDocumentId)
    }
    else {
      this.nomineeForm['controls']['pidprooftype'].setValue('');
      this.nomineeForm['controls']['pDocumentGroup'].setValue('');
    }
  }
  /**<-----(end) change id proof type functionality(end)-------> */

  /**<-----(start) get id proof list from api(start)-------> */
  getidProofList(pDocumentId) {
    this._FIIndividualService.getDocumentNames(pDocumentId).subscribe(json => {
      if (json != null) {
        this.idProofList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  /**<-----(end) get id proof list from api(end)-------> */

  /**<-----(start) change id proof functionality(start)-------> */
  pidproofChange($event) {
    const pDocumentId = $event.target.value;

    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.nomineeForm['controls']['pidproofname'].setValue(pDocumentGroup);
    }
    else {
      this.nomineeForm['controls']['pidproofname'].setValue('');
      this.nomineeForm['controls']['pDocumentName'].setValue('');
    }
  }
  /**<-----(end) change id proof functionality(end)-------> */

  /**<-----(start) age calculation functionality based on year(start)-------> */
  ageCalculation() {
    let age;
    let dob = this.nomineeForm['controls']['pdateofbirth'].value;
    if (dob != '' && dob != null) {
      let currentdate = Date.now();
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
    this.nomineeForm['controls']['page'].setValue(age);
  }
  /**<-----(end) age calculation functionality based on year(end)-------> */

  /**<-----(start)upload file functionlity(start)-------> */
  uploadAndProgress(event: any, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
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
      formData.append('NewFileName', this.nomineeForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {
      this.kycFileName = data[1];
      if(this.imageResponse)
      this.imageResponse.name = data[1];
      this.kycFilePath = data[0];
    })
  }
  /**<-----(end)upload file functionlity(end)-------> */

  loadInitData() {
    this.formValidationMessages = {};
    this.nomineeForm = this._FormBuilder.group({
      precordid: [0],
      pnomineename: [''],
      prelationship: ['', Validators.required],
      pdateofbirth: [''],
      page: [''],
      pcontactno: [''],
      pidprooftype: [''],
      pDocumentGroup: [''],
      pDocumentGroupId: [''],
      pidproofname: [''],
      pDocumentId: [''],
      pisprimarynominee: [false],
      pDocumentName: [''],
      preferencenumber: [''],
      pdocidproofpath: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],
    })
    this.BlurEventAllControll(this.nomineeForm);
  }
  primarychecked(event,index){
    debugger
    let data=event
    this.nomineeList.filter(data => { data.pisprimarynominee = "false" });
    this.nomineeList[index].pisprimarynominee="true";
    data.pisprimarynominee="true"
    
    
  }
}
