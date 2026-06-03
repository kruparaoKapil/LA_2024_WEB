import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { CompanyconfigService } from 'src/app/Services/Settings/companyconfig.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const $: any;
@Component({
  selector: 'app-companyconfig-documents',
  templateUrl: './companyconfig-documents.component.html',
  styleUrls: ['./companyconfig-documents.component.css']
})
export class CompanyconfigDocumentsComponent implements OnInit {
  @ViewChild(KYCDocumentsComponent, { static: false }) kycDetails;
  @Input() lstApplicantsandothers = [];
  groupDetails: any;
  selectedIdProofType:any;
  kycDocumentType: any;
  kycDocumentName: any;
  pDid: any;
  kycFileName: any;
  kycFilePath: any;
  imageResponse: any;
  uploadSuccess=false;
  pDoc: any;
  pDidd: any;
  pDocs: any;
  companyconfigdocumentvalidations: any = {};
  public gridData: any[] = [];
  constructor(private _commonService:CommonService,private fIIndividualService: FIIndividualService,private _companyconfigservice:CompanyconfigService) { }
  companyconfigdocumentsform = new FormGroup({
    pCompanyId: new FormControl(0),
    pRecordId: new FormControl(0),
    pDOCUMENTID: new FormControl('',Validators.required),  
    pDOCUMENTGROUPID:new FormControl('',Validators.required),
    pDOCUMENTGROUPNAME: new FormControl(''),
    pDOCUMENTNAME: new FormControl(''),
    pDOCSTOREPATH:new FormControl('') ,
    pDOCFILETYPE: new FormControl(''),
    pDOCFILENAME: new FormControl(''),
    pDOCREFERENCENO: new FormControl(''),
    pDOCISDOWNLOADABLE: new FormControl('true'),
    ptypeofoperation: new FormControl(this._commonService.ptypeofoperation)
  })
  ngOnInit()
  {
    this.companyconfigdocumentsform;
    this.getDocumentGroupNames();
    this._commonService._GetKYCUpdate().subscribe(data => 
    {
      this.gridData = data;
      console.log(this.gridData)
    });
    this.BlurEventAllControll(this.companyconfigdocumentsform)
  }
  getDocumentGroupNames() 
  {
    debugger
    this.fIIndividualService.getDocumentGroupNames().subscribe(json => {
      if (json != null) {
        this.groupDetails = json
      }
    
    })
  }
  removeHandler(event)
  {
    this.gridData.splice(event.rowIndex, 1);
  }
  
  idProofType_Change($event: any): void {
   
    debugger;
    
    this.selectedIdProofType = $event.target.value;
    console.log( this.selectedIdProofType)
    const pDocumentId = $event.target.value;
    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.companyconfigdocumentsform['controls']['pDOCUMENTGROUPNAME'].setValue(pDocumentGroup);

      this.pIdsProof_Change($event)
    }
    else {
      this.kycDocumentType = [];
      this.companyconfigdocumentsform['controls']['pDOCUMENTGROUPNAME'].setValue('');
    }
    
  }
  pIdsProof_Change($event: any) {
    debugger
    
    const pDocumentId = $event.target.value;
    if (pDocumentId && pDocumentId != '') {
      const documentName = $event.target.options[$event.target.selectedIndex].text;
      this.pDoc = documentName;
      this.pDid = pDocumentId;
      this.kycDocumentType = [];
      this.companyconfigdocumentsform['controls']['pDOCUMENTID'].setValue('');
      this.fIIndividualService.getDocumentNames(pDocumentId).subscribe(response => {
        if (response.length != 0) 
        {
          debugger
          this.kycDocumentType = response;
        }
        this.companyconfigdocumentsform['controls']['pDOCUMENTID'].value;
        
      });
    }
    else {
      this.kycDocumentName = [];
      this.companyconfigdocumentsform['controls']['pDOCUMENTID'].setValue('');

    }
  }
  pIdProof_Change($event: any) {
   
    debugger
    for (let i = 0; i < this.gridData.length; i++) {
    
        if ((this.selectedIdProofType == Number(this.gridData[i].pDocumentGroupId)) && (Number(this.gridData[i].pDocumentId) == $event.target.value)) {
          this._commonService.showWarningMessage("Already existed");
          setTimeout(() => {
            this.companyconfigdocumentsform.controls['pDOCUMENTID'].setValue('');
            if (this.companyconfigdocumentsform.controls['pDOCUMENTNAME'].value) {
              this.companyconfigdocumentsform.controls['pDOCUMENTNAME'].setValue('');
            }
            this.companyconfigdocumentsform.controls['pDOCUMENTID'].setValue('');
            // this.kycDocumentForm.patchValue({
            //   pDocumentId: null
            // })
          }, 0);
         
          break;
        }
      
    }
  
      const pDocumentId = $event.target.value;
      console.log("pDocumentId : ",pDocumentId);
      
      if (pDocumentId && pDocumentId != '') {
        const documentName = $event.target.options[$event.target.selectedIndex].text;
  
        this.pDocs = documentName;
  
        this.companyconfigdocumentsform.controls.pDOCUMENTNAME.setValue(documentName);
        this.pDocs = documentName;
  
        this.fIIndividualService.getDocumentNames(this.pDid).subscribe(response => {
          if (response.length != 0) 
          {
            debugger
            this.kycDocumentType = response;
          }
          this.companyconfigdocumentsform['controls']['pDOCUMENTID'].value;
          this.kycDocumentName = [];
        });
      }
      else {
        this.kycDocumentName = [];
        this.companyconfigdocumentsform['controls']['pDOCUMENTID'].setValue('');
      }
   
  }
  Datapassing(data) {
    this._commonService._SetKYCData(data)
  }
  addKycDocument() {
    
    debugger
    this.imageResponse = null;
    let isValid = true;
    if(this.checkValidations(this.companyconfigdocumentsform,isValid))
    {
      if (this.companyconfigdocumentsform.value.pDOCUMENTGROUPID ||
        this.companyconfigdocumentsform.value.pDOCUMENTID ||
        this.companyconfigdocumentsform.value.pDOCUMENTGROUPID) {

           
        this.companyconfigdocumentsform.controls.pDOCFILENAME.setValue(this.kycFileName);      
        this.companyconfigdocumentsform.controls.pDOCSTOREPATH.setValue(this.kycFilePath);
        let documentdata = [];
        documentdata = this.gridData.filter(data => {
        return data.pDOCUMENTNAME == this.companyconfigdocumentsform.controls['pDOCUMENTNAME'].value;
      })

      if (documentdata.length == 0) {
        this.gridData.push(this.companyconfigdocumentsform.value);    
        this.companyconfigdocumentvalidations={}   
      }
        else{
          this._commonService.showWarningMessage('Id Proof already exists')
         
        }
             
        this.companyconfigdocumentsform.reset()
        this.companyconfigdocumentvalidations={}   
        this.Datapassing(this.gridData)

        //console.log(this.gridData);     
        this.selectedIdProofType = null;
        this.kycDocumentType = [];
        this.kycFileName = null;
        this.kycFilePath = null;
        $('#fileInput1').val(null);
       
        if (this.imageResponse) {
          this.imageResponse.name = '';
        }
        // }
      }else{
        if ($('#fileInput1').val()) {
            $('#fileInput1').val(null);
            if (this.imageResponse) {
              this.imageResponse.name = '';
            }
            this.kycFileName = null;
            this.kycFilePath = null;
        }
      }
    }
     
     
    
    
  }
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
      formData.append('NewFileName', this.companyconfigdocumentsform.value["pDOCUMENTNAME"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {
      
      this.kycFileName = data[1];
      if(this.imageResponse)
      this.imageResponse.name = data[1];
      this.kycFilePath = data[0];
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
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
          this.companyconfigdocumentvalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.companyconfigdocumentvalidations[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      //this.showErrorMessage(e);
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
  clear()
  {
    debugger
    this.gridData=[]
    this.companyconfigdocumentsform.reset()
    this.companyconfigdocumentvalidations={} 
  }
}
