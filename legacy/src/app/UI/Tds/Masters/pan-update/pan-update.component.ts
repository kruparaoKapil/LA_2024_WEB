import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';

@Component({
  selector: 'app-pan-update',
  templateUrl: './pan-update.component.html',
  styles: []
})
export class PanUpdateComponent implements OnInit {
  panUpdateForm:FormGroup;
  contactsList: any = [];
  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;
  patternname: string;
  PlotsLayoutsValidationErrors: any;
  datetimeimgpath: string;
  datetimeimg: string;

  constructor(private FB:FormBuilder, private _commonService:CommonService, private _contacmasterservice:ContacmasterService, private datepipe: DatePipe) { }

  ngOnInit() {
    // this.patternname = "^[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
    debugger
    this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";

    this.panUpdateForm = this.FB.group({
      pContactdId: ['',Validators.required],
      pContactType: [''],
      pDocreferenceno: ['',[Validators.required, Validators.pattern(this.patternname)]],
      pDocName: ['PAN CARD'],
      pDocType: ['PAN'],
      pDocumentid: [17],
      pCreatedby: [this._commonService.pCreatedby],
      pDocumentName: [''],
      pDocStorePath: [''],
  })
  
  this.GetContactsList();
  this.PlotsLayoutsValidationErrors = {};
  this.BlurEventAllControll(this.panUpdateForm);


  }

  GetContactsList() {
    try {
      debugger;
      this._contacmasterservice.GetContactPanList().subscribe(json => {
        debugger;
        try {
          if (json != null) {
            this.contactsList = json;

          }
        }
        catch (error) {
          
        }
      },
        (error) => {

          this._commonService.showErrorMessage(error);
        });
    }
    catch (error) {
      //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
    }
  }

  customSearchFn(term: string, item: any) {
    debugger
    term = term.toLowerCase();
    
    const contactName = item.pContactName ? item.pContactName.toLowerCase() : '';
    const contactreferenceid = item.pContactreferenceid ? item.pContactreferenceid.toLowerCase() : '';
    const contactNumber = item.pContactNumber ? item.pContactNumber.toLowerCase() : '';
  
    return contactName.indexOf(term) > -1 || contactreferenceid.indexOf(term) > -1 || contactNumber.indexOf(term) > -1;
  }

  ContactGridRowSelect(event){
    debugger;
    this.panUpdateForm.controls.pContactType.setValue(event.pContactType);


    
  }

  savePanDeails(){
    debugger;
    let isvalid = true;
    if (this.checkValidations(this.panUpdateForm, isvalid)) {
let panCard =  this.panUpdateForm.controls.pDocreferenceno.value;
      this._contacmasterservice.duplicatornotpancard(panCard).subscribe(res => {
        let count = res.pcount;

if(count == 0){
  let data = JSON.stringify(this.panUpdateForm.value);

  this._contacmasterservice.savePanDeails(data).subscribe(result => {
    debugger;
    this._commonService.showInfoMessage('Saved Successfully');

    this.panUpdateForm.reset();

    this.panUpdateForm.controls.pDocName.setValue('PAN CARD');
    this.panUpdateForm.controls.pDocType.setValue('PAN');
    this.panUpdateForm.controls.pCreatedby.setValue(this._commonService.pCreatedby);
    this.panUpdateForm.controls.pDocumentid.setValue(17);
    this.GetContactsList();
    this.PlotsLayoutsValidationErrors.pContactdId = '';
    this.PlotsLayoutsValidationErrors.pDocreferenceno = '';

})
}
else{
  this._commonService.showWarningMessage('Pan Card No. already exists');
  this.panUpdateForm.controls.pDocreferenceno.setValue('');
}

      })






    
}
    
    // this._contacmasterservice.savePanDeails(data).subscribe(res => {
    //   this._commonService.showInfoMessage('Saved Successfully')
    // })
  }

  validateFile(fileName) {
    debugger
    if (fileName == undefined || fileName == "") {
        return true
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'exe') {
  
            return false
        }
    }
    return true
  }

  uploadAndProgress(event: any, files) {
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value
      )) {
          this._commonService.showWarningMessage("should not upload exe files");
      }
      else {
    this.datetimeimgpath = '';
    this.datetimeimg = '';
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
    let fileToUpload = <File>files[0];
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name

      let nameWithoutExt = fname.split('.').slice(0, -1).join('.');

      this.datetimeimg = this.datepipe.transform(new Date(), "ddMMyyyyhmmss") + '-' +
        'ttt' + '.' + extention;
      this.datetimeimgpath = this.datepipe.transform(new Date(), "ddMMyyyyhmmss") + '-' + 'ttt' + '.' + extention;

      this.datetimeimgpath = fname + ' ' + this.datetimeimgpath;
      this.datetimeimg = nameWithoutExt + ' ' + this.datetimeimg;

      formData.append('file', fileToUpload, this.datetimeimg);
      // formData.append(files[i].name, files[i]);
      // formData.append('NewFileName', this.panUpdateForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUploadinfolder('Documents',formData).subscribe(data => {
      
      if( extention.toLowerCase() == 'pdf')
      {
       this.imageResponse.name = data[1];
       this.kycFileName = data[0];
       this.kycFilePath = data[0];
      }
      else
      {
       this.kycFileName = data[1];
         if(this.imageResponse)
         
         this.imageResponse.name = data[1];
         this.kycFilePath = data[0];
         
      }
    })
  }
  }

  // 

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
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.PlotsLayoutsValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.PlotsLayoutsValidationErrors[key] += errormessage + ' ';
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

}
