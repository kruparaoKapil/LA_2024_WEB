import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
import { FiApplicantsandothersComponent } from './fi-applicantsandothers.component';
import { MemberService } from '../../../../Services/Banking/member.service';
import { Router } from '@angular/router';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';

declare let $: any
@Component({
  selector: 'app-fi-kycandidentification',
  templateUrl: './fi-kycandidentification.component.html',
  styles: []
})
export class FiKycandidentificationComponent implements OnInit {

  @ViewChild(KYCDocumentsComponent, { static: false }) kycDocumentsComponent: KYCDocumentsComponent;
  @ViewChild(FiApplicantsandothersComponent, { static: false }) fiApplicantAndOthers: FiApplicantsandothersComponent;

  @Output() kycDocumentdetailsTOBusiness = new EventEmitter();
  @Output() forPersonalDetailsGetAndEditEmitEvent = new EventEmitter();
  @Output() forPersonalDetailsGetAndEditEmitEventInFiMemberForm = new EventEmitter();
  @Output() forGettingApplicantAndOthersDataEmit = new EventEmitter();

  @Input() forClearButton: boolean;

  deletedContactRefId: any;
  pVchapplicationId: any;
  pApplicantId: any;
  creditFileName: any;
  creditFilePath: any;
  selectedFiles: any;
  applicantData: any;
  kycDocumentConfigErrorMessage: any;
  lstApplicantsandothers: any;
  KycOfApplicantData: any;
  selectedApplicantData: any;
  imageResponse: any;
  existedlstKYCDcumentsDetailsDTO: any;
  dropdoenTabname: any;
  ///Mahesh M
  FiMemberFormDetails: any;
  FormName: any;
  ///

  creditCount = 0;
  kycCount = 0;
  indexValue: number;
  forIndividualCreditStatus: number = 0;
  forIndividualKYCStatus: number = 0;

  isAllAplicable: boolean = false;
  isCreditCardDisable = false;
  isKycDocumentDisable = false;
  isAllFormDisable = false;
  updateCreditScore: boolean = false;
  isEditable = false;
  submitted = false;
  showKycDocument = true;
  showCreditScore = true;
  notApplicableForAll: boolean = true;
  addBoolean: boolean = false;
  forCreate: boolean = false;
  loading: boolean = false;
  public isLoading: boolean = false;
  public showKYCandIdentificationDocumentsForm: boolean = true;
  public showCreditScoreForm: boolean = true;
  public showKYCDocumentsForm: boolean = true;
  CreditAndContactDetailsShowOrHideForMember: Boolean;
  getContactDetailsEmployeeKyc:any=[];
  creditScoreFileName: string;
  buttonName = "Save & Continue";

  kYCIdentificationForm: FormGroup;
  CreditScoreForm: FormGroup;
  kycDocumentForm: FormGroup

  today: Date = new Date();

  KycOfApplicant = [];
  creditScoreData = [];
  public gridData: any[] = [];
  gridDataTemp = [];

  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }

  constructor(private http: HttpClient, private fiIndividualService: FIIndividualService,
    private formBuilder: FormBuilder, private commomService: CommonService,
    private _MemberService: MemberService, private router: Router, private _contacmasterservice: ContacmasterService) { }

  ngOnChanges(): void {
    var isPresent = this._FirstInformationTabsData.some(function (el) { return el.pTabsectionname === "KYC Documents" });
    if (isPresent == true) {
      const example = this._FirstInformationTabsData.filter(data => data.pTabsectionname === "KYC Documents");
      if (example[0].lstFITabSubsection[0].psubsectionenablestatus == true) {
        this.showKYCandIdentificationDocumentsForm = true;
      } else {
        this.showKYCandIdentificationDocumentsForm = false;
      }
      if (example[0].lstFITabSubsection[1].psubsectionenablestatus == true) {
        this.showCreditScoreForm = true;
      } else {
        this.showCreditScoreForm = false;
      }
      if (example[0].lstFITabSubsection[2].psubsectionenablestatus == true) {
        this.showKYCDocumentsForm = true;
      } else {
        this.showKYCDocumentsForm = false;
      }
    }
  }

  ngOnInit() {
    this.getContactDetailsEmployeeKyc=[];
    this.lstApplicantsandothers = [];
    this.CreditAndContactDetailsShowOrHideForMember = true
    ///Mahesh M 
    this._MemberService._GetFiMemberTab1Data().subscribe(res => {
      //debugger
      if (res != null && res != undefined && res != "") {
        this.FiMemberFormDetails = res
        this.pVchapplicationId = this.FiMemberFormDetails[0].pMemberReferenceId;
        this.pApplicantId = this.FiMemberFormDetails[0].pMemberId;;
        this.FormName = this.FiMemberFormDetails[0].fromForm
        if (this.FormName == "FiMemberDetailsForm") {
          this.CreditAndContactDetailsShowOrHideForMember = false
        } else {
          this.CreditAndContactDetailsShowOrHideForMember = true
        }
      }
    })
    ///

    this.commomService._GetFiTab1Data().subscribe(res => {
      debugger
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        /**
         * ----(Start)--- For showing default Applicant select ----------------(Start)--------------
         */
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
          this.onChangeKycApplicant(i);
        }
        /**----(End)--- For showing default Applicant select ----------------(End)-------------- */
      }
      if (res != null && res != undefined && res != "") {
        this.pVchapplicationId = (res.pVchapplicationid);
        this.pApplicantId = (res.pApplicantid);
      }
    })

    this.kycDocumentConfigErrorMessage = {};
    this.kYCIdentificationForm = this.formBuilder.group({
      SelectContactType: ['', Validators.required]
    })

    this.CreditScoreForm = this.formBuilder.group({
      index: [null],
      createdby: [1],
      modifiedby: [0],
      pDocstoreId: [0],
      pContactId: [0],
      pisapplicable: [!this.showCreditScore],
      pLoanId: [0],
      pRecordid: [0],
      pApplicationNo: [0],
      ptypeofoperation: ['CREATE'],
      pTransactionType: [''],
      pCiccompany: [''],
      pCreditscore: ['', Validators.maxLength(3)],
      pMaxcreditscore: [''],
      pCreditscorefilepath: [''],
      pDocFileType: [''],
      pDocIsDownloadable: [true],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusid: [1],
      pIscreditscoreapplicable: [false],
      pStatusname: ['Active'],
      pEffectfromdate: [''],
      pEffecttodate: [''],
    })

    this.BlurEventAllControll(this.CreditScoreForm);
    this.KycOfApplicant = this.fiIndividualService.CoApplicantList;
  }

  //Validation
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
          this.kycDocumentConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commomService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.kycDocumentConfigErrorMessage[key] += errormessage + ' ';
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

  /** -----------(Start)-------------- Adding data to Credit score grid -------------(Start)-------- */
  addCreditScore() {
    this.imageResponse = null;

    let index = this.gridData.findIndex(item => item.pcontactid == this.selectedApplicantData.pcontactid);
    if (this.confirm() == true) {
      return;
    }
    let isvalid = true;
    if (this.addBoolean == true) {
      if (this.CreditScoreForm.value.pCiccompany ||
        this.CreditScoreForm.value.pMaxcreditscore ||
        this.CreditScoreForm.value.pCreditscore) {
        this.creditScoreData.push(this.CreditScoreForm.getRawValue());
        let cs = this.CreditScoreForm.value;
        let addDatatoGrid = {
          "pContactreferenceid": this.selectedApplicantData.pContactreferenceid,
          "pApplicantname": this.selectedApplicantData.pApplicantname,
          "pFilename": this.creditFileName,
          "pApplicanttype": this.selectedApplicantData.pApplicantype,
        };
        this.CreditScoreForm.controls.pContactId.setValue(this.selectedApplicantData.pcontactid);
        this.CreditScoreForm.controls.pCiccompany.setValue(this.CreditScoreForm.value["pCiccompany"]);
        this.CreditScoreForm.controls.pCreditscore.setValue(this.CreditScoreForm.value["pCreditscore"]);
        this.CreditScoreForm.controls.pMaxcreditscore.setValue((this.CreditScoreForm.value["pCreditscore"] && this.CreditScoreForm.value["pMaxcreditscore"]) ? (((Number(this.CreditScoreForm.value["pCreditscore"])) / (Number(this.CreditScoreForm.value["pMaxcreditscore"]))) * 100).toFixed(2) : 0);
        this.CreditScoreForm.controls.pCreditscorefilepath.setValue(this.creditFilePath);
        this.CreditScoreForm.controls.pIscreditscoreapplicable.setValue(!this.showCreditScore);
        this.CreditScoreForm.controls.pisapplicable.setValue(!this.showCreditScore);
        this.CreditScoreForm.controls.pCreatedby.setValue(this.commomService.pCreatedby);
        this.gridData.push(Object.assign(addDatatoGrid, this.CreditScoreForm.value));

        /** ------- (Start) ------- For status afer adding credit score to grid ---- (Start) -----
         * -------> It is not only depend upon this Credit Score grid data, It will also depend on 
         *          KYC documents grid data.
         */
        for (let i = 0; i < this.gridData.length; i++) {
          let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.gridData[i].pContactreferenceid);
          this.lstApplicantsandothers[index].status = true;
        }
        /**------- (End) ------- For status afer adding credit score to grid ---- (End) ----- */

        $('#fileCreditScore').val(null);
        this.CreditScoreForm = this.formBuilder.group({
          createdby: [1],
          modifiedby: [0],
          pDocstoreId: [0],
          pContactId: [0],
          pLoanId: [0],
          pApplicationNo: [0],
          pisapplicable: [!this.showCreditScore],
          ptypeofoperation: ['CREATE'],
          pTransactionType: [''],
          pCiccompany: [''],
          pCreditscore: ['', Validators.maxLength(3)],
          pMaxcreditscore: [''],
          pCreditscorefilepath: [''],
          pDocFileType: [''],
          pDocIsDownloadable: [true],
          pCreatedby: [this.commomService.pCreatedby],
          pModifiedby: [0],
          pCreateddate: [this.today],
          pModifieddate: [''],
          pStatusid: [1],
          pRecordid: [0],
          pStatusname: ['Active'],
          pEffectfromdate: [''],
          pEffecttodate: [''],
          pIscreditscoreapplicable: [false]
        })
        this.creditFileName = null;
        this.creditFilePath = null;
        this.BlurEventAllControll(this.CreditScoreForm);
      }
    }
    /**
     * ----- (Start) ------- to overcome file duplicate issue --- (Start) ---------------
     */
    if ($('#fileCreditScore').val()) {
      $('#fileCreditScore').val(null);
      this.creditFileName = null;
      this.creditFilePath = null;
      if (this.imageResponse)
        this.imageResponse.name = ''
    }
    /**----- (End) ------- to overcome file duplicate issue --- (End) --------------- */
  }
  /** -----------(End)-------------- Adding data to Credit score grid -------------(End)-------- */

  /**-------(Strat)------------------remove data from Credit score grid ------- (Start)-----------
   * ------> In this method we are not only deleting records from Credit score grid, we are also changing
   *         the statuses of users data. This statuses not only depends upon Credit data, but also on the
   *         KYC documents grid data.
   */
  removeHandler(event) {
    let count = 0;
    let id = this.gridData[event.rowIndex].pContactreferenceid;
    if (this.gridData && this.gridData.length > 0) {
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[event.rowIndex].pContactreferenceid == this.gridData[i].pContactreferenceid) {
          count++;
        }
      }
      let kycCounter = 0;
      for (let h = 0; h < this.lstApplicantsandothers.length; h++) {
        for (let j = 0; j < this.kycDocumentsComponent.gridData.length; j++) {
          if (id == this.kycDocumentsComponent.gridData[j].pContactreferenceid) {
            kycCounter++;
          }
        }
      }
      this.kycCount = kycCounter;
      /**
       * ----> Here count and kycCount variables are using for No of records present in BOth grids.
       *       kycCount variable is using for KYC compoenet grid data.
       */
      if (count == 1 && this.kycCount == 0) {
        let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.gridData[event.rowIndex].pContactreferenceid);
        this.lstApplicantsandothers[index].status = false;
      }
    }
    else {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        this.lstApplicantsandothers[i].status = false;
      }
    }
    this.creditCount = count;
    this.gridData.splice(event.rowIndex, 1);
  }
  /**-------(End)------------------remove data from Credit score grid ------- (End)----------- */

  confirm() {
    let index = this.gridData.findIndex(item => item.pcontactid == this.selectedApplicantData.pcontactid);
    if (index >= 0) {
      if (this.gridData[index].pCiccompany == this.CreditScoreForm.value["pCiccompany"]) {
        $("#myModal").modal("show");
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  confirmForCreditScoeUpdate() {
    this.updateCreditScore = false;
  }

  cancel() {
    this.CreditScoreForm = this.formBuilder.group({
      createdby: [1],
      modifiedby: [0],
      pDocstoreId: [0],
      pContactId: [0],
      pLoanId: [0],
      pApplicationNo: [0],
      ptypeofoperation: ['CREATE'],
      pTransactionType: [''],
      pCiccompany: [''],
      pCreditscore: ['', [Validators.minLength(3), Validators.maxLength(3)]],
      pMaxcreditscore: [''],
      pProoffilepath: [''],
      pDocFileType: [''],
      pDocIsDownloadable: [true],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pRecordid: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusid: [1],
      pStatusname: ['Active'],
      pEffectfromdate: [''],
      pEffecttodate: ['']
    })
    this.BlurEventAllControll(this.CreditScoreForm);
  }

  /**-----(Start)-------------For File upload --------- (Start)-------------------- */
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
      formData.append('NewFileName', this.CreditScoreForm.value["pCiccompany"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this.commomService.fileUpload(formData).subscribe(data => {
      this.creditFileName = data[1];
      if (this.imageResponse)
        this.imageResponse.name = data[1];
      this.creditFilePath = data[0];
      let index = this.gridData.findIndex(item => item.pcontactid == this.selectedApplicantData.pcontactid);
    }
    )
  }
  /**-----(End)-------------For File upload --------- (End)-------------------- */

  delete(i) {
    this.creditScoreData.splice(i, 1);
  }

  getData(event) {
    this.KycOfApplicantData = event;
  }

  // Not Applicable Toggle
  /**----------- (Start) ------ For main Not applicable ----- (Start)-------------------- */
  notApplicableAll(event) {
    debugger;
    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }
    if (checked == true) {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        this.lstApplicantsandothers[i].status = false;
      }
      this.showCreditScore = true;
      this.showKycDocument = true;
    }
    else {
      this.showKycDocument = false;
      this.showCreditScore = false;
      this.forStatus()
      this.kycDocumentsComponent.kycDocumentForm.reset();
    }
  }
  /**----------- (End) ------ For main Not applicable ----- (End)-------------------- */

  /**----------- (Start) ------ For Credit score Not applicable ----- (Start)-------------------- */
  notApplicableForm(event, type) {
    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }

    if (type == 'creditScore') {
      if (checked == true) {
        this.showCreditScore = true;
        this.forIndividualCreditStatus = 0;
      }
      else {
        this.showCreditScore = false;
        this.forStatus()
      }
    }
    else if (type == 'kycDocument') {
      if (checked == true) {
        this.showKycDocument = true;
        this.forIndividualKYCStatus = 0;
      }
      else {
        this.showKycDocument = false;
        this.forStatus()
      }
    }
    this.disableKycDocument();
  }
  /**----------- (End) ------ For Credit score Not applicable ----- (End)-------------------- */

  /**-------- (Start) ---- This method is calling for Individual not applicable switch -------- (Start)--- */
  disableKycDocument() {
    if (this.showCreditScore == true
      && this.showKycDocument == true) {
      this.notApplicableForAll = true;
    }
    else {
      this.notApplicableForAll = false;
    }
    if (this.forIndividualKYCStatus == 0 && this.forIndividualCreditStatus == 0) {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        this.lstApplicantsandothers[i].status = false;
      }
    }
  }
  /**-------- (End) ---- This method is calling for Individual not applicable switch -------- (End)--- */

  /**-------(Start)------ For changing type of user radio button ------- (Start)--------------- */
  onChangeKycApplicant(index) {
    let applicantObj = this.lstApplicantsandothers[index];
    this.selectedApplicantData = null;
    this.selectedApplicantData = {
      pcontactid: applicantObj.pcontactid,
      pApplicantname: applicantObj.papplicantname,
      pApplicantype: applicantObj.papplicanttype,
      pContactreferenceid: applicantObj.pcontactreferenceid,
      existedlstKYCDcumentsDetailsDTO: '',
      status: applicantObj.status
    }
    this.pApplicantId = applicantObj.pcontactid;
    let getFlag: boolean = true;
  }
  /**-------(End)------ For changing type of user radio button ------- (End)--------------- */

  // to retrive the exiseting  Applicant Credit and kycdetails
  getExistedGetApplicantCreditandkycdetails(strapplictionid) {
    this.fiIndividualService.getExistedGetApplicantCreditandkycdetails(strapplictionid).subscribe(response => {
      if (response != null) {
        this.selectedApplicantData.existedlstKYCDcumentsDetailsDTO = (response[0].lstKYCDcumentsDetailsDTO);
        for (let index = 0; index < response[0].lstCreditscoreDetailsDTO.length; index++) {
          let lstCreditscoreDetailsObject = {
            pApplicantname: this.selectedApplicantData.pApplicantname,
            pApplicanttype: this.selectedApplicantData.pApplicantype,
            pContactreferenceid: response[0].lstCreditscoreDetailsDTO[index].pContactreferenceid,
            pCiccompany: response[0].lstCreditscoreDetailsDTO[index].pCiccompany,
            pCreditscore: response[0].lstCreditscoreDetailsDTO[index].pCreditscore,
            pMaxcreditscore: response[0].lstCreditscoreDetailsDTO[index].pMaxcreditscore,
            pFilename: 'NA',
            pProoffilepath: response[0].lstCreditscoreDetailsDTO[index].pCreditscorefilepath ? response[0].lstCreditscoreDetailsDTO[index].pCreditscorefilepath : 'NA',

          }
          this.gridData.push(lstCreditscoreDetailsObject);
        }
        //calling function in kycdocumnets component to show the exsted data.
        if (this.kycDocumentsComponent)
          this.kycDocumentsComponent.getExistedKycAplicantDetails();
      }
    });
  }

  showErrorMessage(errormsg: string) {
    this.commomService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this.commomService.showInfoMessage(errormsg);
  }

  edit(obj, index) {
    this.isEditable = true;
    this.indexValue = index + 1;
    this.CreditScoreForm.patchValue({
      index: index,
      pCiccompany: obj.pCiccompany,
      pCreditscore: obj.pCreditscore,
      pMaxcreditscore: obj.pMaxcreditscore,
      pCreditscorefilepath: obj.pCreditscorefilepath,
    })

  }

  retutnCreditScoreComponentGrid() { return this.gridData; }

  /** -----------(Start) ---------- For saving 4th tab data --------- (Start)------------- */
  nextTabClick() {
    debugger
    let KycDetails: any;
    let saveFlag: boolean = false;
    if (this.notApplicableForAll) {
      saveFlag = true;
      let creditTemp = [];
      let kycDataTemp = [];
      let dataObj = {
        pcontactid: this.selectedApplicantData.pcontactid,
        pApplicantname: this.selectedApplicantData.pApplicantname,
        pApplicantype: this.selectedApplicantData.pApplicantype,
        pContactreferenceid: this.selectedApplicantData.pContactreferenceid,
        pCreatedby: this.commomService.pCreatedby
      }
      let creditObj = {
        pisapplicable: !this.showCreditScore,
        ptypeofoperation: 'CREATE',
      }

      let kycGridObj = {
        pisapplicable: !this.showKycDocument,
        ptypeofoperation: 'CREATE',
      }
      creditTemp.push(Object.assign(dataObj, creditObj));
      kycDataTemp.push(Object.assign(kycGridObj, dataObj));
      this.gridDataTemp = creditTemp;
      this.kycDocumentsComponent.gridDataTemp = kycDataTemp;
      if (this.gridDataTemp && this.gridDataTemp.length > 0) {
        for (let i = 0; i < this.gridDataTemp.length; i++) {
          this.gridDataTemp[i].pCreatedby = this.commomService.pCreatedby;
        }
      }
      if (this.kycDocumentsComponent.gridDataTemp && this.kycDocumentsComponent.gridDataTemp.length > 0) {
        for (let i = 0; i < this.kycDocumentsComponent.gridDataTemp.length; i++) {
          this.kycDocumentsComponent.gridDataTemp[i].pCreatedby = this.commomService.pCreatedby;
        }
      }
      KycDetails = {
        pApplicationid: 0,
        pVchapplicationid: this.pVchapplicationId,
        pisKYCapplicable: !this.notApplicableForAll,
        pCreatedby: this.commomService.pCreatedby,
        lstCreditscoreDetailsDTO: this.gridDataTemp,
        documentstorelist: this.kycDocumentsComponent ? this.kycDocumentsComponent.gridDataTemp : []
      };
    }
    else {
      saveFlag = true;
      for (let i = 0; i < this.gridData.length; i++) {
        this.gridData[i].pCreatedby = this.commomService.pCreatedby;
        this.gridData[i].pMaxcreditscore = this.gridData[i].pMaxcreditscore ? Number(this.gridData[i].pMaxcreditscore) : 0;
        this.gridData[i].pCreditscore = this.gridData[i].pCreditscore ? Number(this.gridData[i].pCreditscore) : 0;
      }
      for (let i = 0; i < this.kycDocumentsComponent.gridData.length; i++) {
        this.kycDocumentsComponent.gridData[i].pCreatedby = this.commomService.pCreatedby;
        this.kycDocumentsComponent.gridData[i].pDocumentId = this.kycDocumentsComponent.gridData[i].pDocumentId ? Number(this.kycDocumentsComponent.gridData[i].pDocumentId) : 0;
        this.kycDocumentsComponent.gridData[i].pDocstoreId = this.kycDocumentsComponent.gridData[i].pDocstoreId ? Number(this.kycDocumentsComponent.gridData[i].pDocstoreId) : 0;
      }

      KycDetails = {
        pApplicationid: 0,
        //mahesh m 
        pVchapplicationid: this.pVchapplicationId,
        pisKYCapplicable: !this.notApplicableForAll,
        lstCreditscoreDetailsDTO: this.gridData,
        pCreatedby: this.commomService.pCreatedby,
        documentstorelist: this.kycDocumentsComponent ? this.kycDocumentsComponent.retutnKycComponentGrid() : []
      };
    }
    if (saveFlag) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      });

      let options = {
        headers: httpHeaders,
      };

      this.kycDocumentdetailsTOBusiness.emit(this.kycDocumentsComponent.retutnKycComponentGrid());

      if (this.forCreate == true) {

        for (let p = 0; p < KycDetails.documentstorelist.length; p++) {
          KycDetails.documentstorelist[p].ptypeofoperation = 'CREATE';
        }
      }
      this.buttonName = "Processing";
      this.isLoading = true;
      let kdata = JSON.stringify(KycDetails)
      this.fiIndividualService.savekycandidentificationdocuments(KycDetails).subscribe(event => {
        debugger
        if (event) {
          this.buttonName = "Save & Continue";
          this.isLoading = false;

          // let str;
          // let temptabname;
          // this.dropdoenTabname = this.commomService.GetFiTabName();
          // let tempFirstInformationTabsData = this._FirstInformationTabsData;
          // let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
          // str = data.tabId;
          // temptabname = data.tabName;
          // if (str == '' && temptabname == '') {
          //   this.buttonName = "Submit";
          //   this.isLoading = false;
          //   this.commomService.showInfoMessage('Saved successfully');
          //   this.router.navigateByUrl('/FiView');
          //   return
          // }
          // this.commomService.SetFiTabName(temptabname);
          // // let str = "applicants-others"
          // // this.dropdoenTabname = "Applicants and Others";
          // this.dropdoenTabname = temptabname;
          // $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');

          // let str = "personal-details"
          // this.dropdoenTabname = "Personal Details"
          // $('.nav-item a[href="#' + str + '"]').tab('show');

          ///Mahesh M 
          // this.forPersonalDetailsGetAndEditEmitEvent.emit(true);
          if (this.FormName == "FiMemberDetailsForm") {
            this.forPersonalDetailsGetAndEditEmitEventInFiMemberForm.emit(true);
            let str = "personal-details"
            this.dropdoenTabname = "Personal Details"
            $('.nav-item a[href="#' + str + '"]').tab('show');
          } else {
            let str;
            let temptabname;
            this.dropdoenTabname = this.commomService.GetFiTabName();
            let tempFirstInformationTabsData = this._FirstInformationTabsData;
            let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
            str = data.tabId;
            temptabname = data.tabName;
            if (str == '' && temptabname == '') {
              this.buttonName = "Submit";
              this.isLoading = false;
              this.commomService.showInfoMessage('Saved successfully');
              this.router.navigateByUrl('/FiView');
              return
            }
            this.commomService.SetFiTabName(temptabname);
            // let str = "applicants-others"
            // this.dropdoenTabname = "Applicants and Others";
            this.dropdoenTabname = temptabname;
            $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            this.forPersonalDetailsGetAndEditEmitEvent.emit(true);
          }
          ///
        }
        else {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        }
      },
        (error) => {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        });
    }
  }
  /** -----------(End) ---------- For saving 4th tab data --------- (End)------------- */

  /**------- (Start) ------ For changing Company change event, for company validations ----- (Start)----  */
  companyChange(event) {
    if (this.selectedApplicantData) {
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.selectedApplicantData.pcontactid == this.gridData[i].pContactId) {
          if (this.gridData[i].pCiccompany == event.target.value) {
            this.commomService.showWarningMessage("Already existed");
            setTimeout(() => {
              this.CreditScoreForm.patchValue({
                pCiccompany: ''
              })
            }, 0);
            setTimeout(() => {
              this.BlurEventAllControll(this.CreditScoreForm)
            }, 100);
            break;
          }
        }
      }
    }
    else {
      this.commomService.showWarningMessage("Please select any contact type");
    }
  }
  /**------- (End) ------ For changing Company change event, for company validations ----- (End)----  */

  /**---------- (Start)------ Getting 4th tab data while editing ------(Start)-------------- */
  getKYCAndCreditScoreDataForEditing() {
    this.gridData = [];
    this.getContactDetailsEmployeeKyc=[];
    for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
      let obj = {
        status: false
      }
      this.lstApplicantsandothers[i] = Object.assign(obj, this.lstApplicantsandothers[i])
      if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
        this.onChangeKycApplicant(i);
      }
    }
    this.loading = true;
  
    this.fiIndividualService.getFiCreditAndKYCDocumentsData(this.pVchapplicationId, this.pApplicantId).subscribe((response: any) => {
      if (response) {
        this._contacmasterservice.getContactDetailsByID('CID00001').subscribe((data: any) => {
          //5157
          this.getContactDetailsEmployeeKyc=data.documentstorelist;
        });
        this.loading = false;
        let creditTempData = response.lstCreditscoreDetailsDTO;
        let kycTempData = response.documentstorelist;
        if(kycTempData.length==0){
          kycTempData= this.getContactDetailsEmployeeKyc;
        }
        if (response.documentstorelist && response.documentstorelist.length > 0) {
          for (let i = 0; i < kycTempData.length; i++) {
            kycTempData[i].pCreatedby = this.commomService.pCreatedby;
            for (let j = 0; j < this.lstApplicantsandothers.length; j++) {
              if (kycTempData[i].pContactreferenceid == this.lstApplicantsandothers[j].pcontactreferenceid) {
                this.lstApplicantsandothers[j].status = true;
                kycTempData[i].pContactType = this.lstApplicantsandothers[j].papplicanttype;
              }
            }
          }
        }
        if (creditTempData && creditTempData.length > 0) {
          for (let index = 0; index < creditTempData.length; index++) {
            creditTempData[index].pCreatedby = this.commomService.pCreatedby;
            for (let j = 0; j < this.lstApplicantsandothers.length; j++) {
              if (creditTempData[index].pContactreferenceid == this.lstApplicantsandothers[j].pcontactreferenceid) {
                this.lstApplicantsandothers[j].status = true;
              }
            }
          }
          this.showCreditScore = false;
          this.gridData = creditTempData;
        }
        else {
          this.showCreditScore = true;
        }
        if (kycTempData && kycTempData.length > 0) {
          this.showKycDocument = false;
          let count = 0;
          for (let i = 0; i < kycTempData.length; i++) {
            if (this.selectedApplicantData.pContactreferenceid == kycTempData[i].pContactreferenceid) {
              count++;
            }
          }
          this.kycCount = count;
          this.kycDocumentsComponent.gridData = kycTempData;
        }
        else {
          this.showKycDocument = true;
        }
        if (this.showKycDocument == true && this.showCreditScore == true) {
          this.notApplicableForAll = true;
        }
        else {
          this.notApplicableForAll = false;
        }
      }
      else {
        this.loading = false;
        // this.commomService.showErrorMessage("Something went wrong from server side, please try after sometime");
      }
    }, (error) => {
      this.loading = false;
    })
  }
  /**---------- (End)------ Getting 4th tab data while editing ------(End)-------------- */

  /** -----(Start)------- Credit score validations - for entered value -------(Start)--------------- */
  enteredCreditScore(event) {
    let maxCreditScore = Number(this.CreditScoreForm.value['pMaxcreditscore']);
    let enteredCreditScoreValue = Number(event.target.value);
    if (maxCreditScore != 0) {
      if (enteredCreditScoreValue > maxCreditScore) {
        this.addBoolean = false;
        this.commomService.showWarningMessage("Credit score should not be greater than Maximum credit score");
      }
      else {
        this.addBoolean = true;
      }
    }
  }
  /** -----(End)------- Credit score validations - for entered value -------(End)--------------- */

  /** -----(Start)------- Credit score validations - for dropdown selection value -------(Start)--------------- */
  onChangeMaxCreditScore(event) {
    let isvalid = true;
    let selectedMaxCreditScoreValue = Number(event.target.value);
    let enteredCreditScore = Number(this.CreditScoreForm.value['pCreditscore']);

    if (this.checkValidations(this.CreditScoreForm, isvalid)) {
      if (enteredCreditScore && (selectedMaxCreditScoreValue != 0)) {
        if (enteredCreditScore > selectedMaxCreditScoreValue) {
          this.addBoolean = false;
          this.commomService.showWarningMessage("Credit score should not be greater than Maximum credit score");
        }
        else {
          this.addBoolean = true;
        }
      }
    }
  }
  /** -----(End)------- Credit score validations - for dropdown selection value -------(End)--------------- */

  /**---------(Start)------- Users data emitting to <app-kycdocuments> component ----- (Start)-------- */
  emitListUsers(data) {
    this.deletedContactRefId = data.pContactreferenceid;
    if (this.gridData.length == 0 && data.gridData.length == 0) {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        this.lstApplicantsandothers[i].status = false;
      }
    }
    let count = 0;
    for (let j = 0; j < data.gridData.length; j++) {
      if (this.deletedContactRefId == data.gridData[j].pContactreferenceid) {
        count++;
      }
    }
    this.kycCount = count;
    if (this.gridData && this.gridData.length == 0) {
      if (this.kycCount == 0) {
        let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.deletedContactRefId);
        this.lstApplicantsandothers[index].status = false;
      }
    }
  }
  /**---------(End)------- Users data emitting to <app-kycdocuments> component ----- (End)-------- */

  /**-------- (Start) ----- To move previous tab ------ (Start)------------------------ */
  moveToPreviousTab() {
    debugger;

    if (this.FormName == "FiMemberDetailsForm") {
      let str = 'selectmember';
      // this.dropdoenTabname = "Applicants and Others";
      $('.nav-item a[href="#' + str + '"]').tab('show');
      //this.forGettingApplicantAndOthersDataEmit.emit(true);
      this.kycDocumentsComponent.kycDocumentForm.reset();
    } else {
      // let str = 'applicants-others';
      // this.dropdoenTabname = "Applicants and Others";
      // $('.nav-item a[href="#' + str + '"]').tab('show');
      let str;
      let temptabname;
      this.dropdoenTabname = this.commomService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
        let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
        if (pTabsectionname == this.dropdoenTabname) {
          str = tempFirstInformationTabsData[i - 1].pTabsectionid;
          temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
          this.commomService.SetFiTabName(temptabname);
        }
      }
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.forGettingApplicantAndOthersDataEmit.emit(true);
    }
  }
  /**-------- (End) ----- To move previous tab ------ (End)------------------------ */

  /**------ (Start) ------- FOr Status ------- (Start)---------------------------- */
  forStatus() {
    let kycCount: number = 0;
    let creditCount = 0;

    for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
      if (this.showCreditScore == false) {
        for (let j = 0; j < this.gridData.length; j++) {
          if (this.lstApplicantsandothers[i].pcontactreferenceid == this.gridData[j].pContactreferenceid) {
            creditCount++;
            this.lstApplicantsandothers[i].status = true;
          }
        }
      }
      if (this.showKycDocument == false) {
        for (let k = 0; k < this.kycDocumentsComponent.gridData.length; k++) {
          if (this.lstApplicantsandothers[i].pcontactreferenceid == this.kycDocumentsComponent.gridData[k].pContactreferenceid) {
            kycCount++;
            this.lstApplicantsandothers[i].status = true;
          }
        }
      }
    }

    this.forIndividualCreditStatus = creditCount;
    this.forIndividualKYCStatus = kycCount;
  }
  /**------ (End) ------- FOr Status ------- (End)---------------------------- */

  clearForm() {
    this.kycDocumentConfigErrorMessage = {};
    this.CreditScoreForm = this.formBuilder.group({
      index: [null],
      createdby: [1],
      modifiedby: [0],
      pDocstoreId: [0],
      pContactId: [0],
      pisapplicable: [!this.showCreditScore],
      pLoanId: [0],
      pRecordid: [0],
      pApplicationNo: [0],
      ptypeofoperation: ['CREATE'],
      pTransactionType: [''],
      pCiccompany: [''],
      pCreditscore: ['', Validators.maxLength(3)],
      pMaxcreditscore: [''],
      pCreditscorefilepath: [''],
      pDocFileType: [''],
      pDocIsDownloadable: [true],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusid: [1],
      pIscreditscoreapplicable: [false],
      pStatusname: ['Active'],
      pEffectfromdate: [''],
      pEffecttodate: [''],
    })

    this.BlurEventAllControll(this.CreditScoreForm);

    this.kycDocumentsComponent.getFormKeys();
  }
}
