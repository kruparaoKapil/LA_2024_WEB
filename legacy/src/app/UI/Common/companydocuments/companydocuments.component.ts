import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { CompanyconfigService } from 'src/app/Services/Settings/companyconfig.service';
declare const $: any;
@Component({
  selector: 'app-companydocuments',
  templateUrl: './companydocuments.component.html',
  styleUrls: ['./companydocuments.component.css']
})
export class CompanydocumentsComponent implements OnInit {
  @ViewChild(KYCDocumentsComponent, { static: false }) kycDetails;
  @Input() lstApplicantsandothers = [];
  groupDetails: any;
  selectedIdProofType: any;
  kycDocumentType: any;
  kycDocumentName: any;
  pDid: any;

  kycFileName: any;
  kycFilePath: any;
  imageResponse: any;
  uploadSuccess = false;
  pDoc: any;
  pDidd: any;
  pDocs: any;
  public gridData: any[] = [];
  constructor(private _commonService: CommonService, private fIIndividualService: FIIndividualService, private _companyconfigservice: CompanyconfigService) { }
  companydocumentsform = new FormGroup({
    pCompanyId: new FormControl(0),
    pRecordId: new FormControl(''),
    pDOCUMENTID: new FormControl(''),
    ptypeofoperation: new FormControl('Create'),
    pCreatedby: new FormControl(this._commonService.pCreatedby),
    pDOCUMENTGROUPID: new FormControl(''),
    pDOCUMENTGROUPNAME: new FormControl(''),
    pDOCUMENTNAME: new FormControl(''),
    pDOCSTOREPATH: new FormControl(''),
    pDOCFILETYPE: new FormControl(''),
    pDOCFILENAME: new FormControl(''),
    pDOCREFERENCENO: new FormControl(''),
    pDOCISDOWNLOADABLE: new FormControl('true')

  })
  ngOnInit() {
    this.getDocumentGroupNames();
    this._commonService._GetKYCUpdate().subscribe(data => {
      this.gridData = data;
      console.log(this.gridData)
    });
  }
  getDocumentGroupNames() {
    this.fIIndividualService.getDocumentGroupNames().subscribe(json => {
      if (json != null) {
        this.groupDetails = json
      }

    })
  }
  idProofType_Change($event: any): void {

    debugger;

    this.selectedIdProofType = $event.target.value;
    console.log(this.selectedIdProofType)
    const pDocumentId = $event.target.value;
    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.companydocumentsform['controls']['pDOCUMENTGROUPNAME'].setValue(pDocumentGroup);

      this.pIdsProof_Change($event)
    }
    else {
      this.kycDocumentType = [];
      this.companydocumentsform['controls']['pDOCUMENTGROUPNAME'].setValue('');
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
      this.companydocumentsform['controls']['pDOCUMENTID'].setValue('');
      this.fIIndividualService.getDocumentNames(pDocumentId).subscribe(response => {
        if (response.length != 0) {
          debugger
          this.kycDocumentType = response;
        }
        this.companydocumentsform['controls']['pDOCUMENTID'].value;

      });
    }
    else {
      this.kycDocumentName = [];
      this.companydocumentsform['controls']['pDOCUMENTID'].setValue('');

    }
  }
  pIdProof_Change($event: any) {

    debugger
    for (let i = 0; i < this.gridData.length; i++) {

      if ((this.selectedIdProofType == Number(this.gridData[i].pDocumentGroupId)) && (Number(this.gridData[i].pDocumentId) == $event.target.value)) {
        this._commonService.showWarningMessage("Already existed");
        setTimeout(() => {
          this.companydocumentsform.controls['pDOCUMENTID'].setValue('');
          if (this.companydocumentsform.controls['pDOCUMENTNAME'].value) {
            this.companydocumentsform.controls['pDOCUMENTNAME'].setValue('');
          }
          this.companydocumentsform.controls['pDOCUMENTID'].setValue('');
          // this.kycDocumentForm.patchValue({
          //   pDocumentId: null
          // })
        }, 0);

        break;
      }

    }

    const pDocumentId = $event.target.value;
    if (pDocumentId && pDocumentId != '') {
      const documentName = $event.target.options[$event.target.selectedIndex].text;

      this.pDocs = documentName;

      this.companydocumentsform.controls.pDOCUMENTNAME.setValue(documentName);
      this.pDocs = documentName;

      this.fIIndividualService.getDocumentNames(this.pDid).subscribe(response => {
        if (response.length != 0) {
          debugger
          this.kycDocumentType = response;
        }
        this.companydocumentsform['controls']['pDOCUMENTID'].value;
        this.kycDocumentName = [];
      });
    }
    else {
      this.kycDocumentName = [];
      this.companydocumentsform['controls']['pDOCUMENTID'].setValue('');
    }

  }
  Datapassing(data) {
    this._commonService._SetKYCData(data)
  }
  addKycDocument() {
    
    debugger
    this.imageResponse = null;
    let isvalid = true;
    //console.log("this.selectedApplicantData : ", this.selectedApplicantData);
    //console.log("this.contactname ", this.contactname);
   
   

      // if (this.checkValidations(this.kycDocumentForm, isvalid)) { //----> previous for Kyc form validations
      if (this.companydocumentsform.value.pDOCUMENTGROUPID ||
        this.companydocumentsform.value.pDOCUMENTID ||
        this.companydocumentsform.value.pDOCUMENTGROUPID) {

        let kk = this.companydocumentsform.value;
       

       
        this.companydocumentsform.controls.pDOCFILENAME.setValue(this.kycFileName);
        
       
       

        this.companydocumentsform.controls.pDOCSTOREPATH.setValue(this.kycFilePath);
        let documentdata = [];
        documentdata = this.gridData.filter(data => {
        return data.pDOCUMENTNAME == this.companydocumentsform.controls['pDOCUMENTNAME'].value;
      })

      if (documentdata.length == 0) {
        this.gridData.push(this.companydocumentsform.value);       
      }
        else{
          this._commonService.showWarningMessage('Id Proof already exists')
         
        }
             
        this.companydocumentsform.reset()
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
      // else{

      //   let str = "selectemployee";
      //  $('.nav-item a[href="#' + str + '"]').tab('show');
      //  this._Employee._SetButtonShowHide();

      // }
    
    
  }
  removeHandler(event)
  {
    this.gridData.splice(event.rowIndex, 1);
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
      formData.append('NewFileName', this.companydocumentsform.value["pDOCUMENTNAME"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {

      this.kycFileName = data[1];
      this.imageResponse.name = data[1];
      this.kycFilePath = data[0];
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
}

