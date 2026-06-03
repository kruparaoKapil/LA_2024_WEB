import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CommonService } from 'src/app/Services/common.service';
import { PhotouploadService } from 'src/app/Services/Loans/Masters/photoupload.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
//import { BankdetailsComponent } from 'src/app/UI/Common/bankdetails/bankdetails.component';
import { TDSDetailsComponent } from 'src/app/UI/Common/tdsdetails/tdsdetails.component';
//import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
// import { SelectsubscriberComponent } from './selectsubscriber.component';
//import { BankdetailsNewComponent } from 'src/app/UI/Common/bank-details-new/bankdetails-new.component';
import { BankdetailsnewComponent } from 'src/app/UI/Common/bankdetails-new/bankdetailsnew.component';
//import { KycdocumentsNewComponent } from 'src/app/UI/Common/kycdocuments-new/kycdocuments-new.component';
import { KycdocumentsnewComponent } from 'src/app/UI/Common/kycdocuments-new/kycdocuments-new.component';

import { SelectSubscriberGlobalComponent } from '../select-subscriber-global/select-subscriber-global.component';
//import { KycDocumentsNewGlobalComponent } from 'src/app/UI/Common/kyc-documents-new-global/kyc-documents-new-global.component';
import { KycDocumentsNewGlobalComponent } from '../kyc-documents-new-global/kyc-documents-new-global.component';
//import { BankDetailsNewGlobalComponent } from 'src/app/UI/Common/bank-details-new-global/bank-details-new-global.component';
import { BankDetailsNewGlobalComponent } from '../bank-details-new-global/bank-details-new-global.component';

declare var $: any;
@Component({
  selector: 'app-contact-new-business-global',
  templateUrl: './contact-new-business-global.component.html',
  styles: []
})
export class ContactNewBusinessGlobalComponent implements OnInit {
  @Output() uploadPhoto: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitevent = new EventEmitter()
  @Input() referenceid: any;
  @Input() formtype: any;
  @Input() contactType: any;
  @Output() returnedData = new EventEmitter();
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  branchdetails: [];
  public columns: Array<object>;
  public ColumnMode = ColumnMode;
  public rows = [];
  public selected = [];
  public SelectionType = SelectionType;
  formName = 'Contact Master';
  controlName = 'Contact';
  contactForm: FormGroup;
  addresstypeForm: FormGroup;
  disablecontactname: boolean = false;
  enterpriseTypeForm: FormGroup;
  businesstypeForm: FormGroup;
  public load = false;
  relationshipList: any = [];
  showEnterprise = false;
  showBusinessNature = false;
  croppedImage: any
  showPage = true;
  ContactMore = false;
  datatabledisplay: any = []
  contactRecordId: any;
  contactRecordId1: any;
  contactSubmitted = false;
  contactdeletdrows: any = [];
  addressdeletedrows: any = [];
  contacAddrSubmitted = false;
  isbusineetype = false;
  isenterprise = false;
  ischckbusiness = false;
  ischeckenteriprze = false;
  firstbusiness = false;
  firstenterprise = false;
  lstaddressdetails = [];
  uploaddocumentslist = [];
  documentstorelist: [];
  referralbankdetailslist: [];
  lstbusinessperson: any = [];
  lstContactDetailsByID: any;
  typeofEnterpriseDetails: any;
  natureofBussinessDetails: any;
  addressTypeDetails: any;
  lstDesignation: any;
  lstContacts: any;
  countryDetails: any;
  stateDetails: any;
  districtDetails: any;
  addressTransType = 'Add';
  BusinessPersonTransType = 'Add';
  addressindex = 0;
  Businessindex = 0;
  readonlyaddressdetals = false;
  readonlycontactdetails = false;
  disablesavebutton = false;
  savebutton = "Submit";
  disableaddresstypesavebutton = false;
  saveaddresstypebutton = "Save";
  documentStoreList: any = [];
  constructor(private _commonService: CommonService, private _profileuploadSer: PhotouploadService, private _defaultimage: DefaultProfileImageService, private formbuilder: FormBuilder, private _contacmasterservice: ContacmasterService, private toastr: ToastrService, private _routes: Router) { }
  contactValidationErrors: any = {};
  addressTypeErrorMessage: any = {};
  contactpersons: any = {};


  imageChangedEvent: any = '';

  croppedImageImageurl: any;
  generatedImage: any;
  imageResponse: any;
  FileName: any;
  FilePath: any;

  ProfileUploadSubscriber: any
  @ViewChild(SelectSubscriberGlobalComponent, { static: false }) ContactSelectComponent: SelectSubscriberGlobalComponent;
  @ViewChild(BankDetailsNewGlobalComponent, { static: false }) BankDetailsComponent: BankDetailsNewGlobalComponent;
  @ViewChild(TDSDetailsComponent, { static: false }) Taxes: TDSDetailsComponent;
  @ViewChild(KycDocumentsNewGlobalComponent, { static: false }) IdentificationDocuments: KycDocumentsNewGlobalComponent;
  ngOnInit() {
    this.contactdeletdrows = [];
    this.addressdeletedrows = [];
    // this.BankDetailsComponent.deletedBankDetails=[];
    // this.IdentificationDocuments.deletedKycdocuments=[];
    if (this.contactType != 'Individual') {
      this.showPage = true;
    }
    else {
      this.showPage = false;
    }
    this.croppedImage = this._defaultimage.GetdefaultImage();
    this._commonService._GetKYCData().subscribe(data => {
      debugger;
      this.contactForm.controls.documentstorelist.setValue(data);
    });
    this._commonService._GetBankData().subscribe(data => {
      this.contactForm.controls.referralbankdetailslist.setValue(data);
    });
    let contactdata = { "pContactName": '', "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    this._commonService._SetContactData(contactdata);
    this.addresstypeForm = this.formbuilder.group({
      pContactType: [''],
      pAddressType: ['', Validators.required],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
    })

    this.enterpriseTypeForm = this.formbuilder.group({

      pEnterpriseType: ['', Validators.required],
      pStatusname: [this._commonService.pStatusname],
      pCreatedby: [this._commonService.pCreatedby],
    })
    this.businesstypeForm = this.formbuilder.group({

      pBusinesstype: ['', Validators.required],
      pStatusname: [this._commonService.pStatusname],
      pCreatedby: [this._commonService.pCreatedby],
    })
    this.contactForm = this.formbuilder.group({
      pTypeofEnterpriseMst: [''],
      pBusinesstypeMst: [''],
      pReferenceId: [''],
      //schemaid: [this._commonService.pschemaname],
      //schemaname: ['schemaname'],
      //samebranchcode: [this._commonService.pschemaname],
      pBusinessEntityEmailid: ['', [Validators.pattern]],
      pBusinessEntityContactno: ['', [Validators.required, Validators.minLength(10)]],
      pName: ['', Validators.required],
      pPhoto: [''],
      pContactimagepath: [''],
      documentstorelist: [],
      lstbusinessperson: [''],
      //  referralbankdetailslist: [],
      pContactType: [''],
      pSurName: [''],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pactivitytype: ['C'],
      pNatureofBussinessMst: [''],
      pAddressTypeChk: [''],
      pBusinessTypeChk: [''],
      pEnterpriseType: [''],
      pBusinesstype: [''],
      pContactName: [''],
      pStatusname: [this._commonService.pStatusname],
      // pEmailId: ['', Validators.pattern],
      // pEmailId2: ['', Validators.pattern],
      // pContactNumber: [''],
      // pAlternativeNo: [''],
      pRecordId: [''],
      pRecordId1: [''],
      pBusinessPriority: Boolean,
      pAddressPriority: Boolean,
      pPriority: [''],
      pEmailidsList: this.formbuilder.array([]),
      pAddressControls: this.addAddressControls(),
      pAddressList: this.formbuilder.array([]),
      businesspersoncontrols: this.addbusinesspersoncontrlos(),
      pbusinessList: this.formbuilder.array([]),
      referralbankdetailslist: this.formbuilder.array([]),
    })
    this.loadEditDetails();
    /*friday*/
    this.getDesignations();
    this.BlurEventAllControll(this.contactForm);
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
  addbusinesspersoncontrlos(): FormGroup {
    return this.formbuilder.group({
      precordid: [''],
      pContactId: [''],
      pContactName: [''],
      designationid: ['', Validators.required],
      designationname: [''],
      pBusinessPriority: Boolean,
      ptypeofoperation: [''],
    })

  }
  addcontactControls(): FormGroup {
    return this.formbuilder.group({
      pContactName: [''],
      pEmailId: [''],
      pContactNumber: [''],
      pPriority: Boolean,
      pRecordId: [''],
    })
  }
  addBankcontrlos(): FormGroup {
    return this.formbuilder.group({
      precordid: [0],
      pBankId: [''],
      pBankName: ['', Validators.required],
      pBankAccountNo: ['', Validators.required],
      pBankifscCode: [''],
      pBankBranch: [''],
      pIsprimaryAccount: Boolean,
      ptypeofoperation: [''],
    })

  }
  addAddressControls(): FormGroup {
    return this.formbuilder.group({
      pRecordId: [''],
      pAddressTypeChk: [''],
      pAddressType: ['', Validators.required],
      pAddress1: ['', Validators.required],
      pAddress2: [''],
      pState: ['', Validators.required],
      pStateId: [''],
      pDistrict: ['', Validators.required],
      pDistrictId: [''],
      pCity: ['', Validators.required],
      pCountry: ['', Validators.required],
      plongitude: ['',],
      platitude: ['',],
      pCountryId: ['',],
      pPinCode: ['', [Validators.required, Validators.minLength(6)]],
      pAddressPriority: [''],
      pPriority: [''],
      ptypeofoperation: [''],
      pAddressDetails: [''],
      pStatusname: [''],
      pPriorityCon: Boolean,


    })
  }

  tabsClick(tabname) {
    if (tabname == 'bank') {


      this.BankDetailsComponent.showBank = true;
      //this.BankDetailsComponent.showBankTitle = false;

    }
  }
  // relation ship drop down change event

  validateFile(fileName) {
    debugger
    if (fileName == undefined || fileName == "") {
      return true
    }
    else {
      var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png') {

        return true
      }
    }
    return false
  }
  uploadAndProgress(event: any, files) {
    debugger;
    if (!this.validateFile(event.target.value
    )) {
      this.toastr.error("Upload jpg or png files");
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
        formData.append('NewFileName', files[i]["name"].split('.').pop());
      }
      size = size / 1024;
      // this.croppedImage = "data:image/png;base64," + EventData[0];
      // this.contactForm['controls']['pPhoto'].setValue(EventData[0]);
      // this.contactForm['controls']['pContactimagepath'].setValue(EventData[1]);
      this._commonService.fileUpload(formData).subscribe(data => {
        debugger;

        //this.FilePath = data[0];
        this.FileName = data;
        if (this.imageResponse)
          this.croppedImage = data[0];
        //this.croppedImage = "data:image/png;base64," + data[0];
        this._commonService.GetImage(data[0]).subscribe(res => {
          console.log("imageresponse", res);
          this.croppedImage = "data:image/png;base64," + res[0];
        })
        this.contactForm['controls']['pPhoto'].setValue(data[0]);
        this.contactForm['controls']['pContactimagepath'].setValue(data[1]);
        // this.uploadPhoto.emit(this.FileName)
      })
    }

  }
  BlurEventAllControll(fromgroup: FormGroup) {
    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        if (key != 'pEmailidsList' && key != 'pAddressList')
          this.setBlurEvent(key);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
  }

  GetContactPersonData(event) {
    debugger;
    if (this.contactForm.controls.pContactId.value == 0) {
      debugger;
      this.contactForm.controls.pContactId.setValue(event.pContactId);

      this.contactForm.controls.pTitleName.setValue(event.pTitleName);
      this.contactForm.controls.pName.setValue(event.pContactName);
      this.contactForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      this._commonService._SetContactData(event);
    }
    else {
      this.contactForm.controls.pContactId.setValue(event.pContactId);
      this.contactForm.controls.pTitleName.setValue(event.pTitleName);
      this.contactForm.controls.pName.setValue(event.pContactName);
      this.contactForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      this._commonService._SetContactData(event);
    }

  }

  setBlurEvent(key: string) {

    try {
      let formcontrol;

      formcontrol = this.contactForm.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            this.contactForm.get(key).valueChanges.subscribe((data) => { this.GetContactValidationByControl(key, true) })


        }
      }
      else {

        formcontrol = <FormGroup>this.contactForm['controls']['pAddressControls'].get(key);
        if (formcontrol) {
          if (formcontrol instanceof FormGroup) {

            this.BlurEventAllControll(formcontrol)
          }
          else {
            if (formcontrol.validator)
              this.contactForm['controls']['pAddressControls'].get(key).valueChanges.subscribe((data) => { this.GetContactValidationByControl(key, true) })

          }
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }

  }
  filter(event) {
    debugger;
    let contactdata = { "pContactName": event.target.value, "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    this._commonService._SetContactData(contactdata);
  }
  // binding saved details to the controls while editing
  loadEditDetails() {
    debugger;
    // let contactdata = { "pContactName":'', "pContacttype": '', "pReferenceId": '', "pContactId":'' }
    // this._commonService._SetContactData(contactdata);
    this.contactdeletdrows = [];
    this.addressdeletedrows = [];
    if (this.formtype == 'Save' && this.contactType != 'Individual') {

      this.readonlycontactdetails = true;
      this.getAddressTypeDetails();
      this.getTypeofEnterprise();
      this.getNatureofBussiness();
      this.getCountryDetails();

      this.load = true;
      this._contacmasterservice.ViewContactGlobal(this.referenceid).subscribe(json => {

        try {
          if (json != null) {

            //this.contactForm.patchValue(json);
            // this.contactForm.controls.pContactNumber.setValue(json.gBusinessEntityContactno);
            // this.contactForm['controls']['pContactNumber'].setValue(json.gBusinessEntityContactno);
            // this.contactForm['controls']['pAlternativeNo'].setValue(json.gBusinessEntityContactno);
            // this.contactForm['controls']['pSurName'].setValue(json.gContactSurname);
            // this.contactForm.controls.pTitleName.setValue(json.gContactTitleName);
            // this.contactForm.controls.pContactType.setValue(json.gContactEntityType);
            this.contactForm.controls.pName.setValue(json.gContactName);
            this.contactForm.controls.pBusinessEntityContactno.setValue(json.gBusinessEntityContactno);
            this.contactForm.controls.pBusinessEntityEmailid.setValue(json.pBusinessEntityEmailid);
            // this.contactForm.controls.pGender.setValue(json.gGender);
            // let onlyDate = json.gDob.split(' ')[0];
            // this.contactForm.controls.pDob.setValue(onlyDate);
            let contactdata = { "pContactName": json.gContactName, "pContacttype": '', "pReferenceId": '', "pContactId": json.gContactId }
            this._commonService._SetContactData(contactdata);
            this.documentStoreList = json.gContactdocumentslist;
            if (json.gContactdocumentslist != null) {
              this._commonService._SetKYCUpdate(json.gContactdocumentslist);
              this.IdentificationDocuments.deletedKycdocuments = [];
            }
            else {
              this._commonService.GetContactDetailsforKYC(this.referenceid).subscribe(data => {
                this._commonService._SetKYCUpdate(data);
                this.IdentificationDocuments.deletedKycdocuments = [];
              })
            }
            if (json.gContactReferralbankdetailslist != null) {
              this._commonService._SetBankUpdate(json.gContactReferralbankdetailslist);
              this.BankDetailsComponent.deletedBankDetails = [];
            }
            else {
              this._commonService._SetBankUpdate(json.gContactReferralbankdetailslist);
              this.BankDetailsComponent.deletedBankDetails = [];
            }
            this.contactType = json.gContactEntityType;
            //this.lstbusinessperson = json.pbusinessList;
            this.lstbusinessperson = [];
            if (json.pcontactexistingstatus) {
              this.disablecontactname = true
            }
            else {
              this.disablecontactname = false;
            }
            if (json.pPhoto)
              this.croppedImage = "data:image/png;base64," + json.pPhoto;
            else
              this.croppedImage = this._defaultimage.GetdefaultImage();
            this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
            this.load = false;
            debugger;

            this.datatabledisplay = json.gContactAddressList.filter(function (loanname) {
              debugger;
              return loanname.gIsPrimary == true;
            });
            this.lstaddressdetails = json.gContactAddressList;
            console.log("address", this.lstaddressdetails)
            console.log("line 462", this.datatabledisplay)
            // this.contactForm.controls.pAddressList['controls'].pAddressPriority.setValue(json.pAddressList[0].pAddressPriority)
            if (this.datatabledisplay.length > 0) {
              this.contactForm['controls']['pAddressTypeChk'].setValue(this.datatabledisplay[0].pAddressType)
            }
            debugger
            //02-03-2026 not coming from api
            // if (json.pbusinessList.length > 0) {
            //   let datatabledisplay1 = json.pbusinessList.filter(function (loanname1) {
            //     return loanname1.pBusinessPriority == true;
            //   }

            //   );

            //   this.lstbusinessperson = json.pbusinessList;
            //   this.contactForm['controls']['pBusinessTypeChk'].setValue(json.gContactName)


            // }
          }

        } catch (e) {
          this._commonService.showErrorMessage(e);
        }

      },
        (error) => {

          this._commonService.showErrorMessage(error);
        }
      );
    }
    else {
      // this.readonlycontactdetails = false;
    }
  }
  loadImages(EventData: string) {
    this.croppedImage = "data:image/png;base64," + EventData[0];
    this.contactForm['controls']['pPhoto'].setValue(EventData[0]);
    this.contactForm['controls']['pContactimagepath'].setValue(EventData[1]);
  }

  // binding enterprise types to radio buttons
  getTypeofEnterprise(): void {
    this._contacmasterservice.getTypeofEnterprise().subscribe(json => {

      if (json != null) {
        this.typeofEnterpriseDetails = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  getContacts(): void {
    this._contacmasterservice.getContactTotalDetails('').subscribe(json => {

      if (json != null) {
        this.lstContacts = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  /*friday*/
  getDesignations(): void {
    this._contacmasterservice.getdesignations().subscribe(json => {
      debugger
      if (json != null) {
        this.lstDesignation = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  // binding Nature of Bussiness  to radio buttons
  getNatureofBussiness(): void {

    this._contacmasterservice.getNatureofBussiness().subscribe(json => {


      if (json != null) {
        this.natureofBussinessDetails = json

      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });

  }
  // binding Address Types  to Address Type Dropdown

  getAddressTypeDetails(): void {

    this._contacmasterservice.getAddressTypeDetails(this.contactType).subscribe(
      (json) => {

        if (json != null) {
          this.addressTypeDetails = json;

        }
      },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  // binding Country Details  Country Dropdown

  getCountryDetails(): void {

    this._contacmasterservice.getCountryDetails().subscribe(json => {


      if (json != null) {
        this.countryDetails = json;

      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });

  }

  // Clearing country state and district and binding states based on country id while Country change event
  pCountry_Change($event: any): void {

    const countryid = $event.pCountryId;
    if (countryid && countryid != '') {
      const countryname = $event.pCountry;
      this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue(countryname);
      this.getSateDetails(countryid);
    }
    else {
      this.stateDetails = [];
      this.districtDetails = [];
      this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue('');
      this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
      this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue('');
      this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
      this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');
    }
  }
  // binding states based on Country Id
  getSateDetails(countryid) {
    this._contacmasterservice.getSateDetails(countryid).subscribe(json => {

      this.stateDetails = json;

    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  //  binding districts based on state id  while state change event if state id is null or empty it will clear states and districts
  pState_Change($event: any): void {

    const stateid = $event.pStateId;
    if (stateid && stateid != '') {
      const statename = $event.pState;
      this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue(statename);
      this.getDistrictDetails(stateid);
    }
    else {
      this.districtDetails = [];
      this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
    }

  }
  //  binding districts based on state id
  getDistrictDetails(stateid) {
    this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {
      this.districtDetails = json;

    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  // enterprise tyep radio button change event
  enterpriseChange() {
    try {

      const control = <FormGroup>this.contactForm['controls']['pTypeofEnterpriseMst'];
      if (this.contactForm.controls.pEnterpriseType.value == 'Other') {
        control.setValidators(Validators.required);
        this.showEnterprise = true;
      }
      else {
        control.clearValidators();
        this.showEnterprise = false;
      }
      control.updateValueAndValidity();
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  //  Nature of business radio button change event
  businessNatureChange() {
    try {

      const control = <FormGroup>this.contactForm['controls']['pNatureofBussinessMst'];
      if (this.contactForm.controls.pBusinesstype.value == 'Other') {

        control.setValidators(Validators.required);
        this.showBusinessNature = true;

      }
      else {
        control.clearValidators();
        this.showBusinessNature = false;
      }
      control.updateValueAndValidity();
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  // District drop down change event
  pDistrict_Change($event: any): void {

    const districtid = $event.pDistrictId;

    if (districtid && districtid != '') {
      const districtname = $event.pDistrict;

      this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);

    }
    else {

      this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    }
  }
  // Address Type drop down change event

  pAddressType_Change($event: any): void {
    console.log("702")
    this.GetContactValidationByControl('pAddressType', true);

  }
  // Address priority  grid radio button event
  changeAddressPriority(index: number) {
    debugger;
    //console.log(this.contactForm.value)
    console.log("709", this.lstaddressdetails[index].pAddressType)
    this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[index].pAddressType);
    for (let i = 0; i < this.lstaddressdetails.length; i++) {

      if (this.lstaddressdetails[i].ptypeofoperation != 'CREATE')
        this.lstaddressdetails[i].ptypeofoperation = 'UPDATE';

      if (index == i) {
        this.lstaddressdetails[i].pPriorityCon = true;
        this.lstaddressdetails[i].pAddressPriority = 'PRIMARY';
        this.lstaddressdetails[i].pPriority = 'PRIMARY';
        //this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('PRIMARY');
      }
      else {
        this.lstaddressdetails[i].pPriorityCon = false;
        this.lstaddressdetails[i].pAddressPriority = '';
        this.lstaddressdetails[i].pPriority = '';

        //this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue(' ');
      }
    }
  }
  changeBusinessPerson(index: number) {
    debugger;
    this.contactForm['controls']['pBusinessTypeChk'].setValue(this.lstbusinessperson[index].pContactName);

    for (let i = 0; i < this.lstbusinessperson.length; i++) {

      if (this.lstbusinessperson[i].ptypeofoperation != 'CREATE')
        this.lstbusinessperson[i].ptypeofoperation = 'UPDATE';
      if (index == i) {
        this.lstbusinessperson[i].pBusinessPriority = true;
      }
      else {
        this.lstbusinessperson[i].pBusinessPriority = false;
      }
    }
  }
  checkContactValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetContactValidationByControl(key, isValid);
      })

    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetContactValidationByControl(key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = this.contactForm.get(key);

      if (!formcontrol)
        formcontrol = <FormGroup>this.contactForm['controls']['pAddressControls'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          if (key != 'pAddressControls')
            this.checkContactValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.contactValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            //if (key == 'pTitleName')
            //  lablename = 'Title';
            //else
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.contactValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      //this.showErrorMessage(e);
      this.disablesavebutton = false;
      this.savebutton = "Submit";
      return false;
    }
    return isValid;
  }
  // checking Address type Address Details Grid
  validateAddressDeatails(addressFormControl: FormGroup): boolean {
    let isValid = true;
    debugger;
    try {
      isValid = this.checkContactValidations(addressFormControl, isValid);

      let count = 0;
      console.log("815", addressFormControl.controls.pAddressType.value)
      let addresstype = addressFormControl.controls.pAddressType.value;
      for (let i = 0; i < this.lstaddressdetails.length; i++) {
        if (this.addressTransType == 'Update') {
          console.log("820", this.lstaddressdetails[i].pAddressType)
          if (this.lstaddressdetails[i].pAddressType === addresstype && i != this.addressindex) {
            count = 1;
            break;
          }
        }
        else {
          console.log("827", this.lstaddressdetails[i].pAddressType)
          if (this.lstaddressdetails[i].pAddressType === addresstype) {
            count = 1;
            break;
          }
        }
      }

      if (count > 0) {
        this._commonService.showWarningMessage('Address Type Already Exist in Address Details');
        isValid = false;
      }

    } catch (e) {
      this.showErrorMessage(e);
    }
    return isValid;
  }
  validateSaveDeatails(control: FormGroup): boolean {
    let isValid = true;

    try {
      isValid = this.checkContactValidations(control, isValid);
      if (this.lstaddressdetails.length == 0) {
        this._commonService.showWarningMessage('Enter Address Details');
        isValid = false;
      }
      else {
        let count = 0;
        for (let i = 0; i < this.lstaddressdetails.length; i++) {
          if (this.lstaddressdetails[i].gAddressStatus === true) {
            count = 1;
            break;
          }
        }
        if (count == 0) {
          this._commonService.showErrorMessage('Select primary address in address details');
          isValid = false;
        }
      }
    } catch (e) {
      this.showErrorMessage(e);
      this.disablesavebutton = false;
      this.savebutton = "Submit";
    }
    return isValid;
  }
  designationname_Change($event: any) {
    this.contactForm['controls']['businesspersoncontrols']['controls']['designationname'].setValue($event.designationname);
    this.contactForm['controls']['businesspersoncontrols']['controls']['designationid'].setValue($event.designationid);

  }


  checkValidationsContactPersons(group: FormGroup): boolean {
    debugger;
    let isValid = true;
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControlBusiness(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControlBusiness(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      debugger;
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidationsContactPersons(formcontrol)
        }
        else if (formcontrol.validator) {
          this.contactpersons[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.contactpersons[key] += errormessage + ' ';
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




  addcontactdetails(): void {
    try {
      debugger;
      this.controlName = 'Contact';

      const businesscontrol = <FormGroup>this.contactForm['controls']['businesspersoncontrols'];
      let contacdata = this.ContactSelectComponent.contactSelectForm.value
      businesscontrol['controls']['precordid'].setValue(0);
      businesscontrol.controls.precordid.setValue(0)
      businesscontrol.controls.pContactId.setValue(contacdata.contactid)
      businesscontrol.controls.pContactName.setValue(contacdata.contactname)
      businesscontrol.controls.ptypeofoperation.setValue('CREATE')
      if (this.checkValidationsContactPersons(businesscontrol)) {


        let ContactPersonexist = true;
        let Contactidno = contacdata.contactid;
        if (Contactidno) {
          for (var i = 0; this.lstbusinessperson.length > i; i++) {
            if (this.lstbusinessperson[i].pContactId == Contactidno) {
              ContactPersonexist = false;
            }
          }
        }
        if (ContactPersonexist == true) {
          if (this.lstbusinessperson.length == 0) {
            debugger;
            this.contactForm['controls']['pBusinessTypeChk'].setValue(businesscontrol.controls.pContactName.value);
            businesscontrol['controls']['pBusinessPriority'].setValue(true);
          }
          else {
            businesscontrol['controls']['pBusinessPriority'].setValue(false);
          }
          this.lstbusinessperson.push(businesscontrol.value);
          this.BusinessPersonTransType = 'Add';
          this.clearcontactpersons();
        }
        else {
          this._commonService.showWarningMessage("Contact Person Already Exist");
          this.clearcontactpersons();
        }


      }
    }
    catch (e) {
      //  this._commonService.showErrorMessage(e);
    }


  }
  // Adding address details to grid when click on add button
  addAddressDeatails(): void {
    debugger;
    try {
      const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
      let addressdetails = '';
      if (control.controls.pAddress1.value && control.controls.pAddress1.value != '')
        addressdetails += control.controls.pAddress1.value + ', ';
      if (control.controls.pAddress2.value && control.controls.pAddress2.value != '')
        addressdetails += control.controls.pAddress2.value + ', ';
      if (control.controls.pCity.value && control.controls.pCity.value != '')
        addressdetails += control.controls.pCity.value + ', ';
      if (control.controls.pDistrict.value && control.controls.pDistrict.value != '')
        addressdetails += control.controls.pDistrict.value + ', ';
      if (control.controls.pState.value && control.controls.pState.value != '')
        addressdetails += control.controls.pState.value + ', ';
      if (control.controls.pCountry.value && control.controls.pCountry.value != '')
        addressdetails += control.controls.pCountry.value;
      if (control.controls.pPinCode.value && control.controls.pPinCode.value != '')
        addressdetails += ' - ' + control.controls.pPinCode.value;
      if (control.controls.plongitude.value && control.controls.plongitude.value != '')
        addressdetails += ' - ' + control.controls.plongitude.value;
      if (control.controls.platitude.value && control.controls.platitude.value != '')
        addressdetails += ' - ' + control.controls.platitude.value;

      control['controls']['pAddressDetails'].setValue(addressdetails);
      // this.contactForm['controls']['pAddressTypeChk'].setValue(control.controls.pAddressType.value);
      control['controls']['pStatusname'].setValue('ACTIVE');

      if (this.validateAddressDeatails(control)) {
        if (this.addressTransType == 'Update') {
          control['controls']['ptypeofoperation'].setValue('UPDATE');

          control['controls']['pRecordId'].setValue(this.lstaddressdetails[this.addressindex].pRecordId);
          //this.lstaddressdetails.splice(this.addressindex);
          this.lstaddressdetails[this.addressindex] = control.value;
          if (this.lstaddressdetails.length == 1) {
            console.log("1020", this.lstaddressdetails[0].pAddressType)
            this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
            this.lstaddressdetails[this.addressindex].pAddressPriority = 'PRIMARY';
            this.lstaddressdetails[this.addressindex].pPriority = 'PRIMARY';
          }
        }
        else {
          control['controls']['ptypeofoperation'].setValue('CREATE');
          if (this.lstaddressdetails.length == 0) {
            console.log("1029", control.controls.pAddressType.value)
            this.contactForm['controls']['pAddressTypeChk'].setValue(control.controls.pAddressType.value);
            control['controls']['pPriorityCon'].setValue(true);
            control['controls']['pAddressPriority'].setValue('PRIMARY');
            control['controls']['pPriority'].setValue('PRIMARY');

          }
          else {
            control['controls']['pPriorityCon'].setValue(false);
            control['controls']['pAddressPriority'].setValue('');
            control['controls']['pPriority'].setValue('');
          }
          control['controls']['pRecordId'].setValue(0);
          this.lstaddressdetails.push(control.value);
        }
        this.addressTransType = 'Add';
        this.lstaddressdetails = [...this.lstaddressdetails];
        this.clearAddressDeatails();
      }


    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  AddressDeatails(index): void {

    try {

      this.getSateDetails(this.lstaddressdetails[index].pCountryId);
      this.getDistrictDetails(this.lstaddressdetails[index].pStateId);
      const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
      control.patchValue(this.lstaddressdetails[index])
      this.addressTransType = 'Update';
      this.addressindex = index;
      this.readonlyaddressdetals = true;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  editContactDeatails(index): void {

    try {


      const control = <FormGroup>this.contactForm['controls']['businesspersoncontrols'];
      control.patchValue(this.lstbusinessperson[index])
      this.BusinessPersonTransType = 'Update';
      this.Businessindex = index;
      // this.readonlyaddressdetals = true;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  BusinessDeatails(index): void {

    try {
      const control = <FormGroup>this.contactForm['controls']['businesspersoncontrols'];
      control.patchValue(this.lstbusinessperson[index])
      this.BusinessPersonTransType = 'Update';
      this.Businessindex = index;

    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  // editing method for edit row from address details grid
  editAddressDeatails(index): void {

    try {

      this.getSateDetails(this.lstaddressdetails[index].pCountryId);
      this.getDistrictDetails(this.lstaddressdetails[index].pStateId);
      const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
      control.patchValue(this.lstaddressdetails[index])
      this.addressTransType = 'Update';
      this.addressindex = index;
      this.readonlyaddressdetals = true;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  // deleting method for remove row from address details grid
  deleteAddressDeatails(row, index): void {

    try {
      if (row.ptypeofoperation != 'CREATE') {
        let deleterow: [] = row;
        this.addressdeletedrows = [...this.addressdeletedrows, ...deleterow]
        this.addressdeletedrows = this.addressdeletedrows.filter(data => data.ptypeofoperation = 'DELETE')

      }
      this.lstaddressdetails.splice(index, 1);
      this.lstaddressdetails = [... this.lstaddressdetails];
      this.addressTransType = 'Add';
      this.addressindex = 0;
      if (this.lstaddressdetails.length >= 1) {
        console.log("1123", this.lstaddressdetails[0].pAddressType)
        this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
        this.lstaddressdetails[0].pPriorityCon = true;
        this.lstaddressdetails[0].ptypeofoperation = 'UPDATE';
        this.lstaddressdetails[0].pAddressPriority = 'PRIMARY';
        this.lstaddressdetails[0].pPriority = 'PRIMARY';
      }
      this.clearAddressDeatails();
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }

  // deleting method for remove row from contact details grid
  deleteContactDeatails(row, index): void {
    debugger;
    try {
      if (row.ptypeofoperation != 'CREATE') {
        let deleterow: [] = row;
        this.contactdeletdrows = [...this.contactdeletdrows, ...deleterow]
        this.contactdeletdrows = this.contactdeletdrows.filter(data => data.ptypeofoperation = 'DELETE')

      }
      this.lstbusinessperson.splice(index, 1);
      this.BusinessPersonTransType = 'Add';
      this.Businessindex = 0;
      if (this.lstbusinessperson.length >= 1) {
        this.contactForm['controls']['pBusinessTypeChk'].setValue(this.lstbusinessperson[0].pContactName);
        this.lstbusinessperson[0].pBusinessPriority = true;
        this.lstbusinessperson[0].ptypeofoperation = 'UPDATE';
      }
      this.clearAddressDeatails();
    }
    catch (e) {
      this.showErrorMessage(e);
    }


  }
  // clear address form controls
  clearAddressDeatails(): void {
    this.contactForm['controls']['pAddressControls'].reset();
    this.contactForm['controls']['pAddressControls']['controls']['pAddressType'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pCountryId'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['plongitude'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['platitude'].setValue('');
    this.stateDetails = [];
    this.districtDetails = [];
    this.contactValidationErrors = { pName: "" };
    this.addressTransType = 'Add';
    this.readonlyaddressdetals = false;
  }
  clearcontactpersons() {
    let formcontrol = <FormGroup>this.contactForm['controls']['businesspersoncontrols']
    formcontrol.reset();

    this.ContactSelectComponent.contactSelectForm.reset();
    // this.ContactSelectComponent.contactsSelected('');
    this.BusinessPersonTransType = 'Add';
    this.ContactSelectComponent.formValidationMessages = {};

    // this.contactForm['controls']['businesspersoncontrols']['controls']['pReferenceId'].setValue('');
    // this.contactForm['controls']['businesspersoncontrols']['controls']['designationname'].setValue('');

  }
  checkenterprisetype(): boolean {
    let isValid = false;
    debugger;
    if (this.contactForm.controls.pEnterpriseType.value == 'Other') {
      let enterpriseType = this.contactForm.controls.pTypeofEnterpriseMst.value;
      this._contacmasterservice.checkTypeofEnterprise(enterpriseType).subscribe(res => {
        debugger;
        if (res == 0) {
          this.enterpriseTypeForm['controls']['pEnterpriseType'].setValue(enterpriseType);
          let data = JSON.stringify(this.enterpriseTypeForm.value)

          this._contacmasterservice.saveTypeofEnterprise(data).subscribe(res => {

            isValid = true;
            this.firstenterprise = true
          },
            (error) => {

              this._commonService.showErrorMessage(error);

            });
        }
        if (res > 0 && this.firstenterprise == true) {
          isValid = true;
        }
        if (res > 0 && this.firstenterprise == false) {
          this._commonService.showWarningMessage("Type Of Enterprise Already Exist");
          isValid = false;
        }

      },
        (error) => {

          this._commonService.showErrorMessage(error);

        });
    }
    else {
      isValid = true;
      this.firstenterprise = true;
    }

    return isValid;
  }

  checkBusineetype(): boolean {
    let isValid = false;
    debugger;
    if (this.contactForm.controls.pBusinesstype.value == 'Other') {
      let businesstype = this.contactForm.controls.pNatureofBussinessMst.value;
      debugger;
      this._contacmasterservice.checkNatureofBussiness(businesstype).subscribe(res => {

        if (res == 0) {




          this.businesstypeForm['controls']['pBusinesstype'].setValue(businesstype);
          let data = JSON.stringify(this.businesstypeForm.value)

          this._contacmasterservice.saveNatureofBussiness(data).subscribe(res => {

            isValid = true;
            this.firstbusiness = true
          },
            (error) => {

              this._commonService.showErrorMessage(error);

            });
        }
        if (res > 0) {
          this._commonService.showWarningMessage("Nature Of Business Already Exist");
          isValid = false;
        }


      },
        (error) => {

          this._commonService.showErrorMessage(error);

        });
    }
    else {
      isValid = true;
    }

    return isValid;
  }
  // save / update method for contact details from
  saveContactDetails(): void {
    debugger
    try {
      this.isbusineetype = false;
      this.isenterprise = false;
      this.disablesavebutton = true;
      this.savebutton = "Processing";
      this.contactSubmitted = true;

      this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
      this.contactForm['controls']['pContactType'].setValue(this.contactType);

      this.contactForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      // if (this.contactForm.controls.pTypeofEnterpriseMst.value != '') {
      //     let enterpriseType = this.contactForm.controls.pTypeofEnterpriseMst.value;
      //     this._contacmasterservice.checkTypeofEnterprise(this.contactForm.controls.pTypeofEnterpriseMst.value).subscribe(res => {

      //         if (res == 0) {
      //             this.enterpriseTypeForm['controls']['pEnterpriseType'].setValue(enterpriseType);
      //            // this.enterpriseTypeForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      //           //  this.enterpriseTypeForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
      //             let data = JSON.stringify(this.enterpriseTypeForm.value)

      //             this._contacmasterservice.saveTypeofEnterprise(data).subscribe(res => { },
      //                 (error) => {

      //                     this.showErrorMessage(error);
      //                 });
      //         }
      //     },
      //         (error) => {

      //             this.showErrorMessage(error);
      //         });
      // }
      // if (this.contactForm.controls.pNatureofBussinessMst.value != '') {
      //     let businesstype = this.contactForm.controls.pNatureofBussinessMst.value;
      //     this._contacmasterservice.checkNatureofBussiness(this.contactForm.controls.pNatureofBussinessMst.value).subscribe(res => {

      //         if (res == 0) {
      //             this.businesstypeForm['controls']['pBusinesstype'].setValue(businesstype);
      //            // this.businesstypeForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      //           //  this.businesstypeForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
      //             let data = JSON.stringify(this.businesstypeForm.value)

      //             this._contacmasterservice.saveNatureofBussiness(data).subscribe(res => { },
      //                 (error) => {

      //                     this.showErrorMessage(error);
      //                 });
      //         }
      //     },
      //         (error) => {

      //             this.showErrorMessage(error);
      //         });
      // }
      this._commonService._GetKYCData().subscribe(data => {
        debugger;
        let kycdetails = data;
        if (this.IdentificationDocuments.deletedKycdocuments.length > 0) {
          if (kycdetails == null) {
            kycdetails = [];
          }
          if (kycdetails.length > 0) {
            kycdetails = [...kycdetails, ...this.IdentificationDocuments.deletedKycdocuments];
          }
          else {
            kycdetails = [...this.IdentificationDocuments.deletedKycdocuments];
          }
          this.IdentificationDocuments.deletedKycdocuments = [];
        }
        this.contactForm.controls.documentstorelist.setValue(kycdetails);
        // this.contactForm.controls.documentstorelist.setValue(data);
      });
      debugger;
      if (this.validateSaveDeatails(this.contactForm)) {
        this.isenterprise = this.checkenterprisetype();
        this.isbusineetype = this.checkBusineetype();
        if (this.BankDetailsComponent.deletedBankDetails.length > 0) {
          if (this.BankDetailsComponent.bankdetailslist.length > 0) {
            this.BankDetailsComponent.bankdetailslist = [...this.BankDetailsComponent.bankdetailslist, ...this.BankDetailsComponent.deletedBankDetails];
          }
          else {
            this.BankDetailsComponent.bankdetailslist = [...this.BankDetailsComponent.deletedBankDetails];
          }
          this.BankDetailsComponent.deletedBankDetails = [];
        }
        debugger;
        if (this.contactForm.controls.pEnterpriseType.value == 'Other')
          this.contactForm['controls']['pEnterpriseType'].setValue(this.contactForm.controls.pTypeofEnterpriseMst.value);
        if (this.contactForm.controls.pBusinesstype.value == 'Other')
          this.contactForm['controls']['pBusinesstype'].setValue(this.contactForm.controls.pNatureofBussinessMst.value);
        // Add a console.log BEFORE the bank loop in saveContactDetails()
console.log('bankdetailslist length:', this.BankDetailsComponent.bankdetailslist.length);
  
console.log('deletedBankDetails length:', this.BankDetailsComponent.deletedBankDetails.length);
  
console.log('bankdetailslist data:', this.BankDetailsComponent.bankdetailslist);
const bankFormArray = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
for (let i = bankFormArray.length - 1; i >= 0; i--) {
  bankFormArray.removeAt(i);
}
        // for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++) {
        //   const bankcontrol = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
        //   bankcontrol.push(this.addBankcontrlos());
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['precordid'].setValue(this.BankDetailsComponent.bankdetailslist[i].precordid);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankId'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankId);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankName'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankName);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankAccountNo'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankAccountNo);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankifscCode'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankifscCode);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankBranch'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankBranch);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pIsprimaryAccount'].setValue(this.BankDetailsComponent.bankdetailslist[i].pIsprimaryAccount);
        //   this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['ptypeofoperation'].setValue(this.BankDetailsComponent.bankdetailslist[i].ptypeofoperation);

        // }
        for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++) {
  const bankcontrol = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
  bankcontrol.push(this.addBankcontrlos());

  const row = this.BankDetailsComponent.bankdetailslist[i];

  this.contactForm['controls']['referralbankdetailslist']['controls'][i].patchValue({
    precordid:         row.gTblMstContactBankId || row.precordid         || 0,
    pBankId:           row.gBankId              || row.pBankId           || '',
    pBankName:         row.gBankName            || row.pBankName         || '',
    pBankAccountNo:    row.gBankAccountNumber   || row.pBankAccountNo    || '',
    pBankifscCode:     row.gBankIfscCode        || row.pBankifscCode     || '',
    pBankBranch:       row.gBankBranchName      || row.pBankBranch       || '',
    pIsprimaryAccount: row.gBankIsPrimary       || row.pIsprimaryAccount || false,
    ptypeofoperation:  row.ptypeofoperation     || 'UPDATE',
  });
}
        let bankdetails = [];
        bankdetails = this.contactForm['controls']['referralbankdetailslist'].value;
        if (bankdetails != null) {
          if (bankdetails.length > 0) {
            bankdetails = bankdetails.filter(row => row.pBankId != '');
          }
        }
        this.contactForm['controls']['referralbankdetailslist'].setValue(bankdetails);
        if (this.contactdeletdrows.length > 0) {
          if (this.lstbusinessperson.length > 0) {
            this.lstbusinessperson = [...this.lstbusinessperson, ...this.contactdeletdrows];
          }
          else {
            this.lstbusinessperson = [...this.contactdeletdrows];
          }
          this.contactdeletdrows = [];

        }
        const businessFormArray = <FormArray>this.contactForm['controls']['pbusinessList'];
for (let i = businessFormArray.length - 1; i >= 0; i--) {
  businessFormArray.removeAt(i);
}
        for (let i = 0; i < this.lstbusinessperson.length; i++) {
          debugger;
          const businesspersoncontol = <FormArray>this.contactForm['controls']['pbusinessList'];
          businesspersoncontol.push(this.addbusinesspersoncontrlos());
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['precordid'].setValue(this.lstbusinessperson[i].precordid);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['pContactId'].setValue(this.lstbusinessperson[i].pContactId);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['pContactName'].setValue(this.lstbusinessperson[i].pContactName);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['designationid'].setValue(this.lstbusinessperson[i].designationid);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['designationname'].setValue(this.lstbusinessperson[i].designationname);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['pBusinessPriority'].setValue(this.lstbusinessperson[i].pBusinessPriority);
          this.contactForm['controls']['pbusinessList']['controls'][i]['controls']['ptypeofoperation'].setValue(this.lstbusinessperson[i].ptypeofoperation);
        }
        if (this.addressdeletedrows.length > 0) {
          if (this.lstaddressdetails.length > 0) {
            this.lstaddressdetails = [...this.lstaddressdetails, ...this.addressdeletedrows];
          }
          else {
            this.lstaddressdetails = [...this.addressdeletedrows];
          }
          this.addressdeletedrows = [];
        }
        console.log('full lstaddressdetails:', JSON.stringify(this.lstaddressdetails));
const addressFormArray = <FormArray>this.contactForm['controls']['pAddressList'];
for (let i = addressFormArray.length - 1; i >= 0; i--) {
  addressFormArray.removeAt(i);
}
        for (let i = 0; i < this.lstaddressdetails.length; i++) {
          debugger;
          const addresscontrol = <FormArray>this.contactForm['controls']['pAddressList'];
          addresscontrol.push(this.addAddressControls());
          console.log("1373", this.lstaddressdetails[i].gAddressType)
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressType'].setValue(this.lstaddressdetails[i].gAddressType);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress1'].setValue(this.lstaddressdetails[i].gAddress1);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress2'].setValue(this.lstaddressdetails[i].gArea);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pState'].setValue(this.lstaddressdetails[i].gStateName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStateId'].setValue(this.lstaddressdetails[i].gStateId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrict'].setValue(this.lstaddressdetails[i].gDistrictName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrictId'].setValue(this.lstaddressdetails[i].gDistrictId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCity'].setValue(this.lstaddressdetails[i].gCityName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountry'].setValue('INDIA');
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountryId'].setValue(1);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStatusname'].setValue(this.lstaddressdetails[i].gAddressStatus);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPinCode'].setValue(this.lstaddressdetails[i].gPincode);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['plongitude'].setValue(this.lstaddressdetails[i].glonitude);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['platitude'].setValue(this.lstaddressdetails[i].glatitude);
          if (this.lstaddressdetails[i].gIsPrimary == true) {
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriorityCon'].setValue(true);
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressPriority'].setValue('PRIMARY');
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('PRIMARY');

          }
          else {
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriorityCon'].setValue(false);
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressPriority'].setValue('');
            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('');
          }

          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['ptypeofoperation'].setValue(this.lstaddressdetails[i].ptypeofoperation);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pRecordId'].setValue(this.lstaddressdetails[i].pRecordId);

        }
        let kycdetailsgrid = [];
        kycdetailsgrid = this.contactForm.controls.documentstorelist.value;
        // if (kycdetailsgrid != null) {
        //   if (kycdetailsgrid.length > 0) {
        //     kycdetailsgrid = kycdetailsgrid.filter(row => row.pDocumentId != '');
        //   }
        // }
        // this.contactForm.controls.documentstorelist.setValue(kycdetailsgrid);


kycdetailsgrid = this.contactForm.controls.documentstorelist.value;

this.contactForm.controls.documentstorelist.setValue(kycdetailsgrid);


        let data = JSON.stringify(this.contactForm.value)
        //let data = JSON.stringify(this.contactForm.getRawValue())



        const addressControl = <FormArray>this.contactForm.controls['pAddressList'];
        for (let i = addressControl.length - 1; i >= 0; i--) {
          addressControl.removeAt(i)
        }
        const businesspersoncontol = <FormArray>this.contactForm['controls']['pbusinessList'];
        for (let i = businesspersoncontol.length - 1; i >= 0; i--) {
          businesspersoncontol.removeAt(i)
        }

        let count = 0;
        let documentDetailsList = this.documentStoreList;
        let panCardData = documentDetailsList.filter(panCardData => panCardData.gDocumentProofsType == "Gst Number");
        let refData
        if(panCardData.length !=0){
        refData = panCardData[0].gDocumentReferenceNo;
        }
        if (confirm("Do you want to save ?")) {

          // checking contact details existed or not if existed retun  Contact already exists other wise will go to save method
          this._contacmasterservice.GetPersonGlobalCount(refData).subscribe(res => {
            if (res > 0) {
              this.disablesavebutton = false;
              this.savebutton = "Submit";
              count = 1;
              this._commonService.showWarningMessage('Contact already exists');
            }
            else if (res == 0) {


              console.log("business data", data)
              this._contacmasterservice.saveContactIndividual(data, this.formtype).subscribe(res => {
                this.disablesavebutton = false;
                this.savebutton = "Submit";
                if (res) {
                  if (this.ContactMore == true) {
                    this._routes.navigate(['/ContactViewNew'], { queryParams: { ID: res[1], name: "employee" } })
                    //this._routes.navigate(['/ContactMoreNew'], { queryParams: { ID: res[1], name: "employee" } })

                    this.clearContactFormDeatails();
                  }
                  else {
                    if (this.formtype == 'Save')
                      this._commonService.showInfoMessage("Saved sucessfully");
                    else
                      this._commonService.showInfoMessage("Updated sucessfully");
                    this._routes.navigate(['/contactView']);
                    this.clearContactFormDeatails();

                  }
                }
                else {
                  if (this.formtype == 'Save')
                    this._commonService.showErrorMessage("Error while saving");
                  else
                    this._commonService.showErrorMessage("Error while updating");
                }
              },
                (error) => {

                  this._commonService.showErrorMessage(error);
                });
            }
          },
            (error) => {
              this.disablesavebutton = false;
              this.savebutton = "Submit";
              this._commonService.showErrorMessage(error);
            });
          if (count == 0) {

          }
        }
      }
      else {
        this.disablesavebutton = false;
        this.savebutton = "Submit";
      }

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  // clear all form controls
  clearContactFormDeatails(): void {
    this.contactForm.reset();
    this.emitevent.emit()
    this.contactdeletdrows = [];
    this.addressdeletedrows = [];
    this.addresstypeForm = this.formbuilder.group({
      pContactType: [''],
      pAddressType: ['', Validators.required],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
    })

    this.enterpriseTypeForm = this.formbuilder.group({

      pEnterpriseType: ['', Validators.required],
      //  pStatusname: [this._commonService.pStatusname],
      //  pCreatedby: [this._commonService.pCreatedby],
    })
    this.businesstypeForm = this.formbuilder.group({

      pBusinesstype: ['', Validators.required],
      // pStatusname: [this._commonService.pStatusname],
      // pCreatedby: [this._commonService.pCreatedby],
    })
    this.contactForm = this.formbuilder.group({
      pTypeofEnterpriseMst: [''],
      pBusinesstypeMst: [''],
      pReferenceId: [''],
      //schemaid: [this._commonService.pschemaname],
      //schemaname: ['schemaname'],
      //samebranchcode: [this._commonService.pschemaname],
      pBusinessEntityEmailid: ['', [Validators.pattern]],
      pBusinessEntityContactno: ['', [Validators.required, Validators.minLength(10)]],
      pName: ['', Validators.required],
      pPhoto: [''],
      pContactimagepath: [''],
      documentstorelist: [],
      lstbusinessperson: [''],
      //  referralbankdetailslist: [],
      pContactType: [''],
      pSurName: [''],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pactivitytype: ['C'],
      pNatureofBussinessMst: [''],
      pAddressTypeChk: [''],
      pBusinessTypeChk: [''],
      pEnterpriseType: [''],
      pBusinesstype: [''],
      pContactName: [''],
      pStatusname: [this._commonService.pStatusname],
      // pEmailId: ['', Validators.pattern],
      // pEmailId2: ['', Validators.pattern],
      // pContactNumber: [''],
      // pAlternativeNo: [''],
      pRecordId: [''],
      pRecordId1: [''],
      pBusinessPriority: Boolean,
      pAddressPriority: Boolean,
      pEmailidsList: this.formbuilder.array([]),
      pAddressControls: this.addAddressControls(),
      pAddressList: this.formbuilder.array([]),
      businesspersoncontrols: this.addbusinesspersoncontrlos(),
      pbusinessList: this.formbuilder.array([]),
      referralbankdetailslist: this.formbuilder.array([]),
    })
    this.lstaddressdetails = [];
    this.lstbusinessperson = [];
    this.clearAddressDeatails();
    this.BankDetailsComponent.bankdetailslist = [];
    this.IdentificationDocuments.deletedKycdocuments = [];
    this.IdentificationDocuments.gridData = [];
    this.documentstorelist = [];
    this.formtype = 'Save';
    this.readonlycontactdetails = false;
    this.contactForm.controls.pTypeofEnterpriseMst.setValue("");
    this.contactForm.controls.pBusinesstypeMst.setValue("")
    this.croppedImage = this._defaultimage.GetdefaultImage();
    this._contacmasterservice.loadContactForm.emit();
    $('.nav-item a[href="##address"]').tab('show');

  }
  GetAddressTypeValidationByControl(key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = this.addresstypeForm.get(key);

      if (formcontrol) {
        if (formcontrol.validator) {
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            key = key + 'Mst';
            let lablename;
            this.contactValidationErrors[key] = '';
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                if (errorkey == 'required')
                  errormessage = lablename + ' ' + errorkey;
                if (errorkey == 'email')
                  errormessage = 'Invalid ' + lablename;
                this.addressTypeErrorMessage[key] = errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {

      this.disableaddresstypesavebutton = false;
      this.saveaddresstypebutton = "Save";
      return false;
    }
    return isValid;
  }

  // save address type and binding to address type drop down
  saveAddressType(): void {
    this.disableaddresstypesavebutton = true;
    this.saveaddresstypebutton = "Processing";
    try {
      let isValid = true;
      console.log("line 1541")
      if (this.GetAddressTypeValidationByControl('pAddressType', isValid)) {
        this.addresstypeForm['controls']['pContactType'].setValue(this.contactType);
        let data = JSON.stringify(this.addresstypeForm.value)
        console.log("1545", this.addresstypeForm.controls.pAddressType.value)
        this._contacmasterservice.checkAddressType(this.addresstypeForm.controls.pAddressType.value, this.contactType).subscribe(res => {
          if (res == 0) {

            this._contacmasterservice.saveAddressType(data).subscribe(res => {
              this.disableaddresstypesavebutton = false;
              this.saveaddresstypebutton = "Save";
              this._commonService.showInfoMessage("saved");
              $('#addresstype').modal('hide');
              console.log("1554", this.addresstypeForm['controls']['pAddressType'])
              this.addresstypeForm['controls']['pAddressType'].setValue('');
              //this.clearAddressType();
              this.getAddressTypeDetails();
            },
              (error) => {
                this._commonService.showErrorMessage(error);
              });
          }
          else if (res > 0) {
            let lablename = (document.getElementById('pAddressTypeMst') as HTMLInputElement).title;
            this._commonService.showWarningMessage(lablename + ' already exists')
          }

        },
          (error) => {
            this.disableaddresstypesavebutton = false;
            this.saveaddresstypebutton = "Save";
            this._commonService.showErrorMessage(error);
          });
      }
      else {
        this.disableaddresstypesavebutton = false;
        this.saveaddresstypebutton = "Save";
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  // clear method wile save new address type in popup
  clearAddressType(): void {
    this.addresstypeForm.reset();
    this.addressTypeErrorMessage = {};
  }
  // close  address type  popup
  closeAddressType(): void {
    $('#addresstype').modal('hide');
    this.clearAddressType();
  }


}





















