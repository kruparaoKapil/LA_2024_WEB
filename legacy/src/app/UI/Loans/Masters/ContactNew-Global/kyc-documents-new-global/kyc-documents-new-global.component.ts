import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { EventEmitter } from 'events';
import { MemberService } from 'src/app/Services/Banking/member.service';
declare const $: any;
@Component({
  selector: 'app-kyc-documents-new-global',
  templateUrl: './kyc-documents-new-global.component.html',
  styles: []
})
export class KycDocumentsNewGlobalComponent implements OnInit {
  @Input() selectedApplicantData: any;
  @Input() proofType: any;
  @Input() showKycDocument: boolean;
  @Input() notApplicableForAll: boolean;
  @Input() lstApplicantsandothers = [];
  @Input() creditCount;

  @Output() emitListUsers = new EventEmitter();

  public gridData: any[] = [];
  gridDataTemp = [];
  idProofType = [];
  deletedKycdocuments = [];
  kycFilePath: any;
  kycFileName: any;
  ils: any;
  idProofTypeErrorMessage = {};
  kycValidationErrors: any;
  kycDocumentType: any;
  kycDocumentTypes: any
  kycDocumentName: any;
  kYcDocumnetsErrorMessage: any;
  groupDetails: any;
  documentDetails: any;
  idProofdetails: any;
  pDid: any;
  pDoc: any;
  pDidd: any;
  pDocs: any;
  idProofTypeDeta;
  data: any;
  imageResponse: any;
  contactname: any;
  selectedIdProofType: any;

  fileName: any = '';

  fileData = null;
  percentDone: number;
  indexValue: number;
  public months: any;
  uploadSuccess: boolean;
  isEditable = false;

  kycDocumentForm: FormGroup;
  idProofTypeModelForm: FormGroup;
  idProofModelForm: FormGroup;

  today: Date = new Date();
  documentid: any;
  documentname: any;
  patternname: string;
  aadharPattern: string;

  constructor(private http: HttpClient,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _commonService: CommonService,
    private fIIndividualService: FIIndividualService,
    private _Employee: EmployeeService, private memberservice: MemberService) { }
  idProof = ['Pan Card', 'Aadhar Card', 'Driving License', 'Passport', 'Voter ID', 'Govt issued doc with date of birth'];


  ngOnInit() {
    this.months = [{ name: 'Jan' }, { name: 'Feb' }, { name: 'Mar' }, { name: 'Apr' }, { name: 'May' }, { name: 'Jun' }, { name: 'Jul' }, { name: 'Aug' }, { name: 'Sep' }, { name: 'Oct' }, { name: 'Nov' }, { name: 'Dec' }];

    this.getDocumentGroupNames();
    this.gridData = [];
    this.getFormKeys();
    this.deletedKycdocuments = [];
    this.idProofTypeModelForm = this.formBuilder.group({
      pDocumentGroup: ['', Validators.required],
      pStatusname: [''],
      pCreatedby: [this._commonService.pCreatedby],
    })

    this.idProofModelForm = this.formBuilder.group({
      pDocumentName: ['', Validators.required],
      pStatusname: [''],
      pCreatedby: [this._commonService.pCreatedby],

    })
    this.BlurEventAllControll(this.kycDocumentForm);
    // this.kycDocumentForm.get('pDocumentReferenceMonth').disable();
    // this.kycDocumentForm.get('pDocumentReferenceYear').disable();

    this._commonService._GetContactData().subscribe(data => {
      //console.log("data : ", data);
      debugger;
      if (data.pContactName) {
        this.contactname = data.pContactName;
        this.selectedApplicantData = { "pApplicantname": data.pContactName, "pApplicantype": data.pContacttype, "pContactreferenceid": data.pReferenceId, "pcontactid": data.pContactId }
      }

      if (data.pApplicantname) {
        this.contactname = data.pApplicantname;
        this.selectedApplicantData = { "pApplicantname": data.pApplicantname, "pApplicantype": data.pApplicanttype, "pContactreferenceid": data.pContactreferenceid, "pcontactid": data.pApplicantid }
      }


    });
    this._commonService._GetKYCUpdate().subscribe(data => {
      this.gridData = data;
    });
    this.patternname = "[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
    this.aadharPattern="^[0-9]{12}$"
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
          this.kYcDocumnetsErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.kYcDocumnetsErrorMessage[key] += errormessage + ' ';
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

  trackByFn(index, item) {
    return index; // or item.id
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  /**------- (Start) --------- For getting Id proof type dropdown data --- (Start) ---- */
  getDocumentGroupNames() {
    debugger;
    this.fIIndividualService.getDocumentGroupNames().subscribe(json => {
      debugger;
      if (json != null) {
        this.groupDetails = json
      }
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  /**------- (End) --------- For getting Id proof type dropdown data --- (End) ---- */


  /**-------- (Start) ----- For side modal pop-up (plus symbol beside of Id proof type) -------- (Start)---
   * -------> Actually that plus symbol is hidden now.
   */
  saveIdProofType(): void {
    try {
      let isValid = true;
      this.idProofTypeModelForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      this.idProofTypeModelForm['controls']['pStatusname'].setValue('Active');
      let data = JSON.stringify(this.idProofTypeModelForm.value)
      this.fIIndividualService.saveIdProofType(data).subscribe(res => {
        this.showInfoMessage("Saved Sucessfully");
        $('#idProofTypeModel').modal('hide');
        this.idProofTypeModelForm['controls']['pDocumentGroup'].setValue('');
        this.getDocumentGroupNames();
      },
        (error) => {
          this.showErrorMessage(error);
        });

    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  /**-------- (End) ----- For side modal pop-up (plus symbol beside of Id proof type) -------- (End)--- */

  /**-------- (Start) ----- For side modal pop-up (plus symbol beside of Id proof) -------- (Start)---
   * -------> Actually that plus symbol is hidden now.
   */
  saveIdProof(): void {
    try {
      let isValid = true;
      this.idProofModelForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      this.idProofModelForm['controls']['pStatusname'].setValue('Active');
      var mergedData = Object.assign(this.idProofModelForm.value, { "pDocumentGroupId": this.pDid, "pDocumentGroup": this.pDoc });
      let data = JSON.stringify(mergedData);
      this.fIIndividualService.saveIdProof(data).subscribe(res => {
        this.showInfoMessage("Saved Sucessfully");
        $('#idProofModel').modal('hide');
        this.idProofModelForm['controls']['pDocumentName'].setValue('');
        this.getDocumentGroupNames();
        this.fIIndividualService.getDocumentNames(this.pDid).subscribe(response => {
          this.kycDocumentType = response;
        });
      },
        (error) => {

          this.showErrorMessage(error);
        });
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  /**-------- (End) ----- For side modal pop-up (plus symbol beside of Id proof) -------- (End)--- */

  clearIdProofType() {
    this.idProofTypeModelForm.reset();
    this.idProofModelForm.reset();
  }


  /** ----------(Start)----------- change event for Id proof type----------(Start)------------ */
  idProofType_Change($event: any): void {
    this.kycDocumentForm.controls.pDocReferenceno.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceMonth.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceYear.setValue('');
    this.kycDocumentForm.controls.pDocStorePath.setValue('');

    this.kycDocumentForm.controls.pFilename.setValue('');
    this.kycDocumentForm.controls.pDocFileType.setValue('');
    this.kYcDocumnetsErrorMessage['pDocReferenceno'] = '';
    this.selectedIdProofType = $event.pDocumentGroupId;
    // if (!this.selectedApplicantData) {
    //   this._commonService.showWarningMessage("Please select any contact type");
    // }
    const pDocumentId = $event.pDocumentGroupId;
    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.pDocumentGroup;
      this.kycDocumentForm['controls']['pDocumentGroup'].setValue(pDocumentGroup);
      //---Calling ID proofs based on the ID proof type ID
      this.pIdsProof_Change($event)
    }
    else {
      this.kycDocumentType = [];
      this.kycDocumentForm['controls']['pDocumentGroup'].setValue('');
    }
  }
  /** ----------(End)----------- change event for Id proof type----------(End)------------ */

  /**---------- (Start) ---- based on Id proof type Id we will call API to get Id proofs ------(Start) */
  pIdsProof_Change($event: any) {
    this.kycDocumentForm.controls.pDocReferenceno.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceMonth.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceYear.setValue('');
    this.kycDocumentForm.controls.pDocStorePath.setValue('');
    this.kYcDocumnetsErrorMessage['pDocReferenceno'] = '';

    this.kycDocumentForm.controls.pFilename.setValue('');
    this.kycDocumentForm.controls.pDocFileType.setValue('');
    const pDocumentId = $event.pDocumentGroupId;
    if (pDocumentId && pDocumentId != '') {
      const documentName = $event.pDocumentGroup;
      this.pDoc = documentName;
      this.pDid = pDocumentId;
      this.kycDocumentType = [];
      this.kycDocumentForm['controls']['pDocumentId'].setValue('');
      this.kYcDocumnetsErrorMessage.pDocumentId = '';
      this.fIIndividualService.getDocumentNames(pDocumentId).subscribe(response => {
        if (response.length != 0) {
          this.kycDocumentType = response;
        }
        this.kycDocumentForm['controls']['pDocumentId'].value;

      });
    }
    else {
      this.kycDocumentName = [];
      this.kycDocumentForm['controls']['pDocumentId'].setValue('');

    }
    this.onChanges();
  }
  /**---------- (End) ---- based on Id proof type Id we will call API to get Id proofs ------(End) */


  /**-------(Start)------ change event for ID proof dropdown -------------(Start)-------
   * ------> Here ID proof Type and ID proofs, both are different.
    */
  pIdProof_Change($event: any) {
    debugger;
    this.documentid = $event.pDocumentId;
    this.documentname = $event.pDocumentName;
    this.kycDocumentForm.controls.pDocReferenceno.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceMonth.setValue('');
    this.kycDocumentForm.controls.pDocumentReferenceYear.setValue('');
    this.kycDocumentForm.controls.pDocStorePath.setValue('');
    this.kYcDocumnetsErrorMessage.pDocReferenceno = null;
    this.kycDocumentForm.controls.pFilename.setValue('');
    this.kycDocumentForm.controls.pDocFileType.setValue('');

    let upperdocumentname = this.documentname.toUpperCase();
    let finaldocname = upperdocumentname.replace(/\s/g, "").replace("/", "");
    if (finaldocname == 'PANCARD') {
      this.kycDocumentForm.controls.pDocReferenceno.setValidators([Validators.required, Validators.maxLength(10), Validators.pattern(this.patternname)]);
      this.kycDocumentForm.controls.pDocReferenceno.updateValueAndValidity();
    }
     else if (finaldocname == 'AADHARCARD') {
     this.kycDocumentForm.controls.pDocReferenceno.setValidators([Validators.required,Validators.pattern(this.aadharPattern),Validators.maxLength(12)])
     this.kycDocumentForm.controls.pDocReferenceno.updateValueAndValidity();
    }
    else {
      this.kycDocumentForm.controls.pDocReferenceno.setValidators([Validators.required]);
      this.kycDocumentForm.controls.pDocReferenceno.updateValueAndValidity();
    }
    this.kYcDocumnetsErrorMessage.pDocReferenceno = null;
    // if (this.selectedApplicantData) {
    for (let i = 0; i < this.gridData.length; i++) {
      if (this.selectedApplicantData.pcontactid == this.gridData[i].pContactId) {
        if ((this.selectedIdProofType == Number(this.gridData[i].pDocumentGroupId)) && (Number(this.gridData[i].pDocumentId) == $event.pDocumentId)) {
          this._commonService.showWarningMessage("Already existed");
          setTimeout(() => {
            this.kycDocumentForm.controls['pDocumentId'].setValue('');
            if (this.kycDocumentForm.controls['pDocumentName'].value) {
              this.kycDocumentForm.controls['pDocumentName'].setValue('');
            }
            this.kYcDocumnetsErrorMessage.pDocumentId = '';
          }, 0);
          setTimeout(() => {
            this.BlurEventAllControll(this.kycDocumentForm)
          }, 100);
          break;
        }
      }
    }
    // }
    // else {
    //   this._commonService.showWarningMessage("Please select any contact type");
    // }
    const pDocumentId = $event.pDocumentId;
    if (pDocumentId && pDocumentId != '') {
      const documentName = $event.pDocumentName;
      this.pDocs = documentName;
      this.kycDocumentForm.controls.pDocumentName.setValue(documentName);
      this.pDocs = documentName;

      this.fIIndividualService.getDocumentNames(this.pDid).subscribe(response => {
        if (response.length != 0) {
          this.kycDocumentType = response;
        }
        this.kycDocumentForm['controls']['pDocumentId'].value;

      });
    }
    else {
      this.kycDocumentName = [];
      this.kycDocumentForm['controls']['pDocumentId'].setValue('');
    }
    //---> This method is for add two extra fields based on ID proof like ex:- pay-slip
    this.onChanges();
  }
  /**-------(End)------ change event for ID proof dropdown -------------(End)------- */

  /**------(Start)----- For getting previous existing KYC documents data--------(Start)---------  */
  getExistedKycAplicantDetails() {
    this.gridData = [];

    for (let index = 0; index < this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO.length; index++) {
      let lstKYCDcumentsDetailsDTO = {
        pApplicantname: this.selectedApplicantData.pApplicantname + '-' + this.selectedApplicantData.pApplicantype,
        pDocumentGroup: this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO[index].pIdprooftype,
        pDocumentName: this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO[index].pIdproofname,
        pDocReferenceno: this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO[index].pIdreferencenumber,
        pFilename: this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO[index].pFilename ? this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO[index].pFilename : 'NA',
      }
      this.gridData.push(lstKYCDcumentsDetailsDTO);
    }
  }


  /**------(End)----- For getting previous existing KYC documents data--------(End)---------  */

  /**-------(Start)--------adding data to KYC grid------------------(Start)------------- */
  addKycDocument() {
    debugger
    this.imageResponse = null;
    let isvalid = true;
    // this.contactname = this.selectedApplicantData.pApplicantname;
    // if (this.contactname != "" && this.contactname != undefined)
    //  {
    if (this.checkValidations(this.kycDocumentForm, true)) {
      let kk = this.kycDocumentForm.value;
      this.memberservice.CheckDocumentList(this.documentid, this.kycDocumentForm.controls.pDocReferenceno.value).subscribe(res => {
        debugger;
        if (!res) {
          this.kycDocumentForm.controls.pApplicantname.setValue(this.selectedApplicantData.pApplicantname);
          this.kycDocumentForm.controls.pApplicantype.setValue(this.selectedApplicantData.pApplicantype);
          this.kycDocumentForm.controls.pContactreferenceid.setValue(this.selectedApplicantData.pContactreferenceid);
          this.kycDocumentForm.controls.pFilename.setValue(this.kycFileName);
          if (this.selectedApplicantData.pcontactid == '') {
            this.kycDocumentForm.controls.pContactId.setValue(0);
          } else {
            this.kycDocumentForm.controls.pContactId.setValue(this.selectedApplicantData.pcontactid);
          }
          this.kycDocumentForm.controls.pCreatedby.setValue(this._commonService.pCreatedby);
          this.kycDocumentForm.controls.pName.setValue(this.selectedApplicantData.pApplicantname);
          this.kycDocumentForm.controls.pisapplicable.setValue(!this.showKycDocument);
          this.kycDocumentForm.controls.pContactType.setValue(this.selectedApplicantData.pApplicantype);
          this.kycDocumentForm.controls.pDocStorePath.setValue(this.kycFilePath);

          this.gridData = [... this.gridData, this.kycDocumentForm.value];

          // this.gridData.push(this.kycDocumentForm.value);
          for (let i = 0; i < this.gridData.length; i++) {
            let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.gridData[i].pContactreferenceid);
            if (this.lstApplicantsandothers[index])
              this.lstApplicantsandothers[index].status = true;
          }
          if (this.gridData.length > 0) {
            this.gridData = this.gridData.filter(row => row.pDocumentId != '');
          }
          this.Datapassing(this.gridData)
          this.getFormKeys();
          this.selectedIdProofType = null;
          this.kycDocumentType = [];
          this.kycFileName = null;
          this.kycFilePath = null;
          $('#fileInput1').val(null);
          this.BlurEventAllControll(this.kycDocumentForm)
          if (this.imageResponse) {
            this.imageResponse.name = '';
          }
        }
        else {
          this._commonService.showWarningMessage(this.documentname + " Already existed")
        }
      })

    } else {
      if ($('#fileInput1').val()) {
        $('#fileInput1').val(null);
        if (this.imageResponse) {
          this.imageResponse.name = '';
        }
        this.kycFileName = null;
        this.kycFilePath = null;
      }
    }
    // }
  }
  /**-------(End)--------adding data to KYC grid------------------(End)------------- */

  /**------(Start)------------ For adding pCreatedBy for already existed and currently added grid data---(Start)-- */
  retutnKycComponentGrid() {
    if (this.gridData && this.gridData.length > 0) {
      for (let i = 0; i < this.gridData.length; i++) {
        this.gridData[i].pCreatedby = this._commonService.pCreatedby;
      }
      return this.gridData;
    }
    else {
      return [];
    }
  }
  /**------(End)------------ For adding pCreatedBy for already existed and currently added grid data---(End)-- */

  public editHandler({ sender, rowIndex, dataItem }) {

  }

  /**------(Start)------ For delete data in KYC grid data-----------(Start)------
   * -----> Here we are emitting users, because after deleting records
   *        from grid data we have to update status.
  */


  removeHandler($event, row, rowIndex, group) {
    debugger;
    debugger;
    if (row.ptypeofoperation != 'CREATE') {
      let deleterow: [] = row;
      this.deletedKycdocuments = [...this.deletedKycdocuments, ...deleterow]
      this.deletedKycdocuments = this.deletedKycdocuments.filter(data => data.ptypeofoperation = 'DELETE')

    }
    this.gridData = this.gridData.filter(function (loanname) {
      return loanname.pDocumentId != row.pDocumentId;
    });
    this.Datapassing(this.gridData);
    // let count = 0;
    // let data = {
    //   lstApplicantsandothers: this.lstApplicantsandothers,
    //   count: count,
    //   gridData: this.gridData,
    //   // pContactreferenceid: this.gridData[rowIndex].pContactreferenceid,
    //   pDocumentGroupId:this.gridData[rowIndex].pDocumentGroupId,
    // }
    // this.gridData.splice(this.gridData[rowIndex].pDocumentId,1);
    // this.emitListUsers.emit(data);
  }
  /**------(End)------ For delete data in KYC grid data-----------(End)------ */

  edit(obj, index) {
    this.isEditable = true;
    this.indexValue = index + 1;
    this.kycDocumentForm.patchValue({
      index: index,
      pDocumentGroupId: obj.pDocumentGroupId,
      pDocumentId: obj.pDocumentId,
      pDocReferenceno: obj.pDocReferenceno,
      pDocumentReferenceMonth: obj.pDocumentReferenceMonth,
      pDocumentReferenceYear: obj.pDocumentReferenceYear,
    })

    this.Datapassing(this.gridData)
  }

  /**--------(Start)------ Load KYC form with default values----------------(Start) */
  getFormKeys() {
    this.kYcDocumnetsErrorMessage = {};
    this.kycDocumentForm = this.formBuilder.group({
      pContactType: [''],
      createdby: [this._commonService.pCreatedby],
      modifiedby: [0],
      pDocstoreId: [0],
      pContactId: [0],
      pLoanId: [0],
      pisapplicable: [!this.showKycDocument],
      pApplicantname: '',
      pApplicantype: '',
      pContactreferenceid: '',
      pApplicationNo: [0],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pTransactionType: [''],
      pDocumentId: ['', Validators.required],
      pDocumentGroupId: ['', Validators.required],
      pDocumentGroup: [''],
      pDocumentName: [''],
      pDocStorePath: [''],
      pFilename: [''],
      pDocFileType: [''],
      // pRecordid: [0],
      pDocReferenceno: ['', Validators.required],
      pDocIsDownloadable: [true],
      pDocumentReferenceMonth: [''],
      pDocumentReferenceYear: ['', Validators.minLength(2)],
      pipaddress: [sessionStorage.getItem("ipaddress")],
      pCreatedby: [this._commonService.pCreatedby],
      //pEffectfromdate: [''],
      // pEffecttodate: ['']
      pName: ['']
    })
  }
  /**--------(End)------ Load KYC form with default values----------------(End) */

  paySlipFlag = false;
  /**---------(Start)---- for getting two extra input text boxes for ID proof ex:- pay-slip-----(Start)- */
  onChanges() {
    this.kycDocumentType;
    if (this.kycDocumentForm.get('pDocumentId')) {
      this.kycDocumentForm.get('pDocumentId').valueChanges
        .subscribe(selectedpDocumentId => {
          let selectedPayslip: String
          this.kycDocumentType.forEach(function (value) {
            if (value.pDocumentId == Number(selectedpDocumentId)) {
              selectedPayslip = value.pDocumentName.replace(/\s/g, "");
            }
          });
          if (selectedPayslip) {
            // if (selectedPayslip.toUpperCase() != 'PAYSLIP') {
            //   this.paySlipFlag = false;
            //   this.kycDocumentForm.get('pDocumentReferenceMonth').disable();
            //   this.kycDocumentForm.get('pDocumentReferenceYear').disable();
            //   this.kycDocumentForm['controls']['pDocumentReferenceMonth'].setValue('');
            //   this.kycDocumentForm['controls']['pDocumentReferenceYear'].setValue('');
            // }
            // else {
            //   const d = new Date();
            //   this.paySlipFlag = true;
            //   this.kycDocumentForm.get('pDocumentReferenceMonth').enable();
            //   this.kycDocumentForm.get('pDocumentReferenceYear').enable();
            //   this.kycDocumentForm['controls']['pDocumentReferenceMonth'].setValue(this.months[d.getMonth()]);
            //   this.kycDocumentForm['controls']['pDocumentReferenceYear'].setValue(new Date().getFullYear());
            // }
          }
        });
    }
  }
  /**---------(End)---- for getting two extra input text boxes for ID proof ex:- pay-slip-----(End)- */

  Datapassing(data) {
    this._commonService._SetKYCData(data)
  }

  /**----------(Start)-------To reset form and load initial data ---(Start)--------- */
  clearfn() {
    this.kycDocumentForm.reset();
    // this.gridData = [];
    this.deletedKycdocuments = [];
    this.getFormKeys();
  }
  /**----------(End)-------To reset form and load initial data ---(End)--------- */

  GetDataForEmployeeUpdate(data) {
    this.gridData = data;
  }
  // File Upload file types validation

  /**--------(Start)------------ To file upload --------------------(Start)------- */





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
    debugger;
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value
    )) {
      this._commonService.showWarningMessage("should not upload exe files");
    }
    else {
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
        formData.append('NewFileName', this.kycDocumentForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
      }
      size = size / 1024;
      this._commonService.fileUpload(formData).subscribe(data => {

        if (extention.toLowerCase() == 'pdf') {
          debugger;
          this.imageResponse.name = data[0];
          this.kycFileName = data[1];
          this.kycFilePath = data[0];
        }
        else {
          debugger;
          this.kycFileName = data[1];
          if (this.imageResponse)

            this.imageResponse.name = data[1];
          this.kycFilePath = data[0];

        }
      })
    }
  }
}

