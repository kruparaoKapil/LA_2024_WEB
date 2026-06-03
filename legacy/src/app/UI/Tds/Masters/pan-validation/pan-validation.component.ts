import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { error } from 'console';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
import { concat, of, Subject } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
//import { PageCriteria } from 'src/app/Models/pagecriteria';
//import { VerificationService } from 'src/app/Services/BPO/verification.service';
//import { CommonService } from 'src/app/Services/common.service';
//import { ContacmasterService } from 'src/app/Services/Configuration/ContactConfiguration/contacmaster.service';
//import { Psspecimen1Service } from 'src/app/Services/PSInfo/psspecimen1.service';
//import { GeneralReceiptCancelService } from 'src/app/Services/Transactions/general-receipt-cancel.service';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { CommonService } from 'src/app/Services/common.service';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pan-validation',
  templateUrl: './pan-validation.component.html',
  styleUrls: ['./pan-validation.component.css']
})
export class PanValidationComponent implements OnInit {

  PanvalidaionForm: FormGroup;
  PanvalidaionFormvalidation: any = {};
  pageCriteria: PageCriteria;
  disablesavebutton: boolean = false
  GridData: any = []
  ColumnMode = ColumnMode;
  selected = [];
  SelectionType = SelectionType;
  verificatype = []
  DocumentProofs = []
  voterdetails: any = []
  states: any = []
  serviceproviders: any = []
  button = 'Show'
  panbool: boolean = false
  elebool: boolean = false
  voterbool: boolean = false
  adharbool: boolean = false
  form15hstatus: boolean = false
  approovedstatus: boolean = true
  requestid = ''
  panvalidatestatus: any = []
  loginUserId: any;
  ipAddress: any;
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  savepan: any;
  imageResponse: any;
  kycFileName: any;
  authorizedbylist: any = [];
  originalPanStatusList: any[];
  updatetype: any;
  viewstatus: boolean = false
  gridLoading: boolean = false
  filteredPanStatus: any[] = [];
  contactSearchevent = new Subject<string>();
  type: string;
  filetype: any;
  // sanitizer: any;
  iframeurl: any;
  downloadurl: string;
  imageshow: boolean = false;
  pdfshow: boolean = false;
  base64download: string;
  base64: string;
  datetimeimgpath: string;
  datetimeimg: string;

  constructor(private _CommonService: CommonService, private fb: FormBuilder, private _VerificationService: VerificationService,
    private _contacmasterservice: ContacmasterService, public sanitizer: DomSanitizer, private datePipe: DatePipe) {
    this.pageCriteria = new PageCriteria();
    this.dpConfig2.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig2.containerClass = this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig2.showWeekNumbers = false;
    this.dpConfig2.maxDate = new Date();
  }
  dropDownDataSearchLength: any = this._CommonService.searchfilterlength;
  searchplaceholder: any = this._CommonService.searchplaceholder;
  ngOnInit(): void {
    debugger;
    this.BuildForm();
    this.setPageModel1();

    this.BlurEventAllControll(this.PanvalidaionForm)
    this.getDocumentProofs()
    //this.panstatus()
    this.verificatype = [{ "verifytype": "PAN" }, { "verifytype": "ADHAR" }]
    this.loginUserId = sessionStorage.getItem('LoginUserid');
    this.ipAddress = sessionStorage.getItem('ipaddress');
    this.contactSearch();
  }

  BuildForm() {
    this.PanvalidaionForm = this.fb.group({
      verifytype: [null, Validators.required],
      proffnumer: ["", Validators.required],
      //branchschema:[this._CommonService.getschemaname()],
      //Createdby:[this._CommonService.getcreatedby()],
      pFilename: [''],
      pDocStorePath: ['']
    })
  }
  getDocumentProofs(): void {
    this._contacmasterservice.getDocumentProofs().subscribe(json => {
      if (json != null) {
        // this.DocumentProofs = json
        // this.DocumentProofs = this.DocumentProofs.filter(element => {
        //   if ((element == '121') || (element == '15H')) {
        //     return element
        //   }
        //})
        this.DocumentProofs = json;
        this.DocumentProofs = this.DocumentProofs.filter((element: any) => {
          return element.pverificationtype === '121' || element.pverificationtype === '15H';
        });      
  }
},
(error) => {

  this.showErrorMessage(error);
});
  }



setPageModel1() {
  this.pageCriteria.pageSize = this._CommonService.pageSize;
  this.pageCriteria.offset = 0;
  this.pageCriteria.pageNumber = 1;
  this.pageCriteria.footerPageHeight = 50;
}

checkValidations(group: FormGroup, isValid: boolean): boolean {
  debugger;
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
        this.PanvalidaionFormvalidation[key] = '';
        if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
          let lablename;
          lablename = (document.getElementById(key) as HTMLInputElement).title;
          let errormessage;
          for (const errorkey in formcontrol.errors) {
            if (errorkey) {
              errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
              this.PanvalidaionFormvalidation[key] += errormessage + ' ';
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
  this._CommonService.showErrorMessage(errormsg);
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

onFooterPageChange(event): void {
  this.pageCriteria.offset = event.page - 1;
  this.pageCriteria.CurrentPage = event.page;
  if(this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
  this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
}
    else {
  this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
}
  }

updateValue(event1, event2, rowIndex, cell){
  debugger;
  this.voterdetails[rowIndex][cell] = event1.target.value;
  this.voterdetails = [...this.voterdetails]

}


// panstatus(){
//   debugger;
//   this._VerificationService.GetPanValidStatus().subscribe(res=>{
//     this.panvalidatestatus=res
//     this.panvalidatestatus[0]['panStatusId']=1 
//     this.panvalidatestatus[1]['panStatusId']=2
//     this.panvalidatestatus[2]['panStatusId']=3
//     this.panvalidatestatus[3]['panStatusId']=4
//     console.log(this.panvalidatestatus);
//   })
// }

panstatus() {
  debugger;
  this._VerificationService.GetPanValidStatus().subscribe((response: any) => {
    const res = Array.isArray(response) ? response : response.body || response.data || [];
    this.originalPanStatusList = res as any[];
    if (this.originalPanStatusList.length >= 4) {
      this.originalPanStatusList[0]['panStatusId'] = 1;
      this.originalPanStatusList[1]['panStatusId'] = 2;
      this.originalPanStatusList[2]['panStatusId'] = 3;
      this.originalPanStatusList[3]['panStatusId'] = 4;
    }
    this.panvalidatestatus = [...this.originalPanStatusList];
    console.log('PAN status list:', this.panvalidatestatus);
  });
}


Receipt_Select(row, rowIndex, cell){
  this.voterdetails.forEach(element => {
    element.savebutton = true;
  });
  this.voterdetails[rowIndex][cell] = false;
  this.voterdetails = [...this.voterdetails]
}

Show(){
  debugger;
  this.voterdetails = []
  if (this.checkValidations(this.PanvalidaionForm, true)) {
    debugger
    this.contactSearch();
    this.disablesavebutton = true
    this.button = "Processing"
    //let searchtext=this.PanvalidaionForm.controls.proffnumer.value
    let searchtext = this.PanvalidaionForm.controls.proffnumer.value;
    let searchtype = this.type;
    this._VerificationService.GetPanValidDetails(searchtext, searchtype).subscribe(res => {
      this.disablesavebutton = false
      this.button = "Show"
      this.voterdetails = res
      let tempp = this.panvalidatestatus
      if (this.type === '15H' || this.type === '121') {
        if (!this.voterdetails[0].filename || this.voterdetails[0].filename === "") {
          this.approovedstatus = false;
          this.viewstatus = false
        }
        else {
          this.viewstatus = true;
          this.approovedstatus = true;

        }
      } else {
        this.viewstatus = false;
      }
      this.voterdetails.forEach(element => {
      element["savebutton"] = true;
      if (!element.filename) {
        element["documentupload"] = "";
       element["displayname"] = "";
      } else {
       element["documentupload"] = element.guid_filename || null;
       element["displayname"]    = element.filename || "";    
      }
       element["approvedby"] = "";
       element["type"] = "";
       element["panStatusId"] = "";
     });
      for (let i = 0; i < this.voterdetails.length; i++) {
        debugger
        if (this.voterdetails[i].panStatusId) {
          for (let j = 0; j < this.panvalidatestatus.length; j++) {
            if (this.voterdetails[i].panStatusId == this.panvalidatestatus[j].panStatusId) {
              this.voterdetails[i]['panStatusName'] = this.panvalidatestatus[j].panStatusName;


            }

          }
        }
        console.log(this.voterdetails);
      }
      let value
      this.pageCriteria.totalrows = this.voterdetails.length;
      this.pageCriteria.TotalPages = 1;
      this.pageCriteria.CurrentPage = 1;
      if (this.pageCriteria.totalrows > 10) {
        value = this.pageCriteria.totalrows / 10;
        if (value.toString().includes('.')) {
          this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        }
        else {
          this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString());
        }
      }
      if (this.voterdetails.length < this.pageCriteria.pageSize) {
        this.pageCriteria.currentPageRows = this.voterdetails.length;
      }
      else {
        this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
      }
    }, (error) => {
      this._CommonService.showErrorMessage(error)
      this.disablesavebutton = false
      this.button = "Show"
    })




  }
}

ConfirmSaveRowData(row) {
  debugger
  let panstatusId = row.panStatusId;
  let contactId = row.contactId;
  let document = row.documentupload;
  let approvedby = row.approvedby;

  // let documentToCheck = row.displayname ? row.displayname : row.documentupload;

  if (this.type == '15H' || this.type == '121') {
    if (!this.viewstatus) {
      if (!isNullOrEmptyString(row.displayname) && isNullOrEmptyString(row.approvedby)) {
        this.SaveRowData(row);
      } else {
        this._CommonService.showWarningMessage("Please Upload document !!");
      }
    } else if (this.viewstatus) {
      if (!isNullOrEmptyString(row.approvedby) && !isNullOrEmptyString(row.panStatusId) && !isNullOrEmptyString(row.displayname)) {
        this.SaveRowData(row);
      } else {
        this._CommonService.showWarningMessage("Please Select Approved By and Status !!");
      }
    }
  } else {
    if ((row.panStatusId == "1") && !isNullOrEmptyString(row.approvedby) && !isNullOrEmptyString(row.displayname)) {
      this.SaveRowData(row);
    } else {
      this._CommonService.showWarningMessage("Please Check Status Or enter Approved by and document details !!");
    }
  }
}
SaveRowData(row) {
  const document     = row.displayname    || null;  // friendly → file_name
  const guidfilename = row.documentupload || null;  // GUID     → guid_filename
  const approvedby   = row.approvedby     || null;  // no row mutation
  let panstatus;
  let contactId;
  let searchtype;

  if (this.type == '15H' || this.type == '121') {
    panstatus = row.panStatusId === true ? true : row.panStatusId === false ? false : null;
    contactId = row.contactReferenceId;
    searchtype = this.type;
  } else {
    panstatus  = row.panStatusId;
    contactId  = row.contactId;
    searchtype = this.type;
  }

  if (confirm("Do you want to save ?")) {
    this._VerificationService.SavePanValidDetails(
      panstatus, contactId, this.loginUserId,
      this.ipAddress, document, guidfilename, approvedby, searchtype
    ).subscribe(json => {
      if (json) {
        this.voterdetails = [];
        this.PanvalidaionForm.controls.proffnumer.clearValidators();
        this.PanvalidaionForm.controls.proffnumer.updateValueAndValidity();
        this._CommonService.showSuccessMessage();
      } else {
        this._CommonService.showErrorMessage("Failed");
      }
    }, (error) => {
      this._CommonService.showErrorMessage(error);
    });
  }
}

uploadAndProgress(event: any, files: FileList, formname: string, rowIndex: number) {
  debugger;

  if (!files || files.length === 0) return;

  const file = files[0];
  const extension = file.name.split('.').pop().toLowerCase();

  if (!this.validateFile(file.name)) {
    this._CommonService.showWarningMessage("Upload jpg or png or pdf files");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    this.imageResponse = {
      name: file.name,
      fileType: "imageResponse",
      contentType: file.type,
      size: file.size,
    };
  };

  const formData = new FormData();
  let fname = '';
  this.datetimeimgpath = '';
  this.datetimeimg = '';

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];
    fname = currentFile.name;
    let nameWithoutExt = fname.split('.').slice(0, -1).join('.');
    this.datetimeimg = this.datePipe.transform(new Date(), "ddMMyyyyhmmss") + '-' + 'ttt' + '.' + extension;
    this.datetimeimgpath = fname + ' ' + this.datetimeimg;
    this.datetimeimg = nameWithoutExt + ' ' + this.datetimeimg;

    if (formname === 'savepan') {
      this.PanvalidaionForm.controls.pFilename.setValue(this.datetimeimg);
      this.PanvalidaionForm.controls.pDocStorePath.setValue(this.datetimeimg);
      // formData.append(currentFile.name, currentFile);
      // formData.append('NewFileName', 'savepan.' + currentFile.name.split('.').pop());
      formData.append('file', currentFile, this.datetimeimg);
    }
  }

  this._CommonService.fileUploadS3("Form121", formData).subscribe({
    next: (data: any) => {
    const uploadedFileName = data[0];  // GUID
    this.kycFileName = uploadedFileName;
    this.imageResponse.name = uploadedFileName;

    if (formname === 'savepan') {
     this.voterdetails[rowIndex]['documentupload'] = uploadedFileName;  // GUID → guid_filename
     this.voterdetails[rowIndex]['displayname'] = this.datetimeimg;     // friendly → file_name
      this.voterdetails = [...this.voterdetails];
    }
   },
    error: (err) => {
      console.error(err);
      this._CommonService.showErrorMessage("File upload failed");
    }
  });
}

//   uploadAndProgress(event: any, files: FileList, formname: string, rowIndex: number) {
//   debugger;

//   if (!files || files.length === 0) return;

//   const file = files[0];
//   this.MaturityPaymentForm.controls.pFilename.setValue(file.name);
//   const extension = file.name.split('.').pop().toLowerCase();

//   if (!this.validateFile(file.name)) {
//     this._commonService.showWarningMessage("Upload jpg or png or pdf files");
//     return;
//   }

//     this.isFileUploading = true;

//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => {
//     this.imageResponse = {
//       name: file.name,
//       fileType: "imageResponse",
//       contentType: file.type,
//       size: file.size,
//     };
//   };

//   const formData = new FormData();
//   let fname = '';

//   for (let i = 0; i < files.length; i++) {
//     const currentFile = files[i];
//     fname = currentFile.name;

//     if (formname === 'delayinterest') {
//       this.MaturityPaymentForm.controls.pDocStorePath.setValue(fname);

//       formData.append(currentFile.name, currentFile);
//       formData.append(
//         'NewFileName',
//         'savepan.' + currentFile.name.split('.').pop()
//       );
//     }
//   }



//   this._commonService.fileUploadS3("DocumentStore", formData)
//     .subscribe({
//       next: (data: any) => {
//         debugger;

//         const uploadedFileName = data[0];

//         this.kycFileName = uploadedFileName;
//         this.imageResponse.name = uploadedFileName;

//         if (formname === 'delayinterest') {
//           this.MaturityPaymentForm.controls.pDocStorePath.setValue(uploadedFileName);
//         }

//         if (rowIndex !== null && rowIndex !== undefined) {
//           this.FdDetailsList[rowIndex]['documentupload'] = uploadedFileName;
//           this.FdDetailsList = [...this.FdDetailsList];
//         }
//         this.isFileUploading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this._commonService.showErrorMessage("File upload failed");
//       }
//     });
// }

// uploadAndProgress(event: any, files, formname, rowIndex) {
//   debugger;

//   const extention = event.target.value.substring(
//     event.target.value.lastIndexOf('.') + 1
//   );

//   // Validate file type
//   if (!this.validateFile(event.target.value)) {
//     this._CommonService.showWarningMessage(
//       "Upload jpg or png or pdf files"
//     );
//     return;
//   }

//   let file = event.target.files[0];

//   // File preview / info
//   if (event && file) {
//     let reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = (e) => {
//       this.imageResponse = {
//         name: file.name,
//         fileType: "imageResponse",
//         contentType: file.type,
//         size: file.size
//       };
//     };
//   }

//   let fname = "";

//   if (!files || files.length === 0) {
//     return;
//   }

//   let size = 0;
//   const formData = new FormData();

//   for (let i = 0; i < files.length; i++) {
//     size += files[i].size;
//     fname = files[i].name;

//     if (formname === "savepan") {
//       this.PanvalidaionForm.controls.pFilename.setValue(fname);
//     }

//     formData.append("files", files[i], files[i].name);
//   }

//   formData.append("subfoldername", "Documents"); 
//   formData.append("Branch", "Hyderabad");

//   size = size / 1024;

//   this._CommonService.fileUpload1(formData).subscribe(
//     (data: any) => {
//       debugger;
//       this.imageResponse.name = data[1];
//       this.kycFileName = data[1];

//       if (formname === "savepan") {
//         this.PanvalidaionForm.controls.pFilename.setValue(
//           this.imageResponse.name
//         );

//         this.voterdetails[rowIndex]["documentupload"] =
//           this.imageResponse.name;
//       }
//     },
//     (error) => {
//       console.error(error);
//       this._CommonService.showErrorMessage(
//         "File upload failed"
//       );
//     }
//   );
// }





validateFile(fileName) {
  try {
    debugger
    if (fileName == undefined || fileName == "") {
      return true
    }
    else {
      var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf') {

        return true
      }
    }
    return false
  }
  catch (e) {
    this._CommonService.showErrorMessage(e);
  }
}
contactSearch() {
  debugger;
  this._VerificationService.getEmployeeName("").subscribe(res => {
    // if( (this.type === '15H' && res[0].form15h_apporval_status === true)){
    //  this.authorizedbylist=res;
    // }
    this.authorizedbylist = res;
    console.log(this.authorizedbylist);

    // if (this.type === '15H') {
    //   this.authorizedbylist = res;
    //   this.authorizedbylist = this.authorizedbylist.filter(
    //     (emp: any) => emp.form15h_apporval_status === true
    //   );
    // }
    // console.log(this.authorizedbylist);
  })
}
approvedbyChange($event, rowIndex, cell) {
  debugger
  if ($event != undefined && $event.target.value != "Select") {
    this.voterdetails[rowIndex][cell] = $event.target.value;
    this.voterdetails = [...this.voterdetails]
  } else {
    this.voterdetails[rowIndex][cell] = null;
  }
}




onVerificationTypeChange(selectedType: any) {
  debugger;
  // this.type = selectedType.DocumentProofs || selectedType;
  this.type = selectedType.pverificationtype || selectedType;

  console.log("Selected Type:", this.type);

  this.PanvalidaionForm.get('proffnumer').reset();
  this.voterdetails = [];
  if (this.pageCriteria) {
    this.pageCriteria.offset = 0;
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.TotalPages = 0;
    this.pageCriteria.totalrows = 0;
  }

  if (this.type === '15H' || this.type === '121') {
    this.form15hstatus = true;
    this.panvalidatestatus = [
      //{ panStatusId: false, panStatusName: '' },
      { panStatusId: true, panStatusName: 'Approved' },
      { panStatusId: false, panStatusName: 'Rejected' }
    ];
    // this.PanvalidaionForm.get('panStatusId')?.setValue(0);
  }
  else if (this.type === 'PAN') {
    this.approovedstatus = true;
    this.form15hstatus = false;
    this.panvalidatestatus = [
      // { panStatusId: 0, panStatusName: 'Select' },
      { panStatusId: 1, panStatusName: 'Valid PAN' },
      { panStatusId: 2, panStatusName: 'Valid PAN Inoperative' },
      { panStatusId: 3, panStatusName: 'InValid PAN' },
      { panStatusId: 4, panStatusName: 'No PAN' },
    ];
    // this.PanvalidaionForm.get('panStatusId')?.setValue(0);
  }
  else {
    this.panvalidatestatus = [...this.originalPanStatusList];
  }
  console.log('Current Status List:', this.panvalidatestatus);
}

pdf(row, guid, formName) {
  debugger;
  if (guid !== null && guid !== "") {
    this.gridLoading = true
    //let type = guid.split(".")[1];
    let type = guid.split(".").pop().toLowerCase();
    this.filetype = type;    
    this.filetype = type;
    if (type !== "pdf") {
      try {
        this._CommonService.DownloadS3filesI(formName, guid).subscribe(base64Data => {
          if (base64Data["base64image"] !== "") {
            this.imageshow = true
            this.pdfshow = false
            this.base64 = ''
            var a = document.createElement("a"); //Create <a>
            a.href = "data:image/png;base64," + base64Data["base64image"];
            this.base64 = "data:image/png;base64," + base64Data["base64image"]; //Image Base64 Goes here
            this.base64download = "data:image/png;base64," + base64Data["base64image"]; //Image Base64 Goes here
            // a.download = "Image.png"; //File name Here
            // a.click();
            this.gridLoading = false;
          }
        }, (error) => {
          this._CommonService.showErrorMessage(error);
          this.gridLoading = false;
        });
      }
      catch (e) {
        this._CommonService.showErrorMessage(e);
        return false;
      }
    } else {
      try {
        this._CommonService.DownloadS3files(formName, guid).subscribe((data: Blob) => {
          // const blob = new Blob([data]);
          this.iframeurl = ''
          this.imageshow = false
          this.pdfshow = true
          let responseType = data.type;
          const url = window.URL.createObjectURL(data);
          // this.downloadurl = url;
          this.iframeurl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0')
          this.gridLoading = false;
          window.open(url);
        }, (error) => {
          this._CommonService.showErrorMessage(error);
          this.gridLoading = false;
        });
      }
      catch (e) {
        this._CommonService.showErrorMessage(e);
        return false;
      }
    }
  }


}


}

