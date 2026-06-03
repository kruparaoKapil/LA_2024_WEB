import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BankdetailsComponent } from 'src/app/UI/Common/bankdetails/bankdetails.component';
import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
import { ContactSelectComponent } from 'src/app/UI/Common/contact-select/contact-select.component';
import { TDSDetailsComponent } from 'src/app/UI/Common/tdsdetails/tdsdetails.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PhotouploadService } from 'src/app/Services/Loans/Masters/photoupload.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
//import { BankdetailsNewComponent } from 'src/app/UI/Common/bank-details-new/bankdetails-new.component';
import { BankdetailsnewComponent } from 'src/app/UI/Common/bankdetails-new/bankdetailsnew.component';
//import { KycdocumentsNewComponent } from 'src/app/UI/Common/kycdocuments-new/kycdocuments-new.component';
import { KycdocumentsnewComponent } from 'src/app/UI/Common/kycdocuments-new/kycdocuments-new.component';
import { HttpClient } from '@angular/common/http';
//import { KycDocumentsNewGlobalComponent } from 'src/app/UI/Common/kyc-documents-new-global/kyc-documents-new-global.component';
//import { BankDetailsNewGlobalComponent } from 'src/app/UI/Common/bank-details-new-global/bank-details-new-global.component';
import { BankDetailsNewGlobalComponent } from '../bank-details-new-global/bank-details-new-global.component';
import { KycDocumentsNewGlobalComponent } from '../kyc-documents-new-global/kyc-documents-new-global.component';

declare var $: any;
@Component({
  selector: 'app-contact-new-individual-global',
  templateUrl: './contact-new-individual-global.component.html',
  styles: []
})
export class ContactNewIndividualGlobalComponent implements OnInit {


  @Output() uploadPhoto: EventEmitter<string> = new EventEmitter<string>();
  @Input() referenceid: any;
  @Input() formtype: any;
  @Input() contactType: any;
  @Output() emitevent = new EventEmitter()
  @Output() returnedData = new EventEmitter();
  contactForm: FormGroup;
  addresstypeForm: FormGroup;
  relationshipList: any = [];
  croppedImage: any
  showPage = true;
  list1 = [];
  // list1 = [
  //   { text: 'item 1', selected: false },
  //   { text: 'item 2', selected: false },
  //   { text: 'item 3', selected: false },
  //   { text: 'item 4', selected: false },
  //   { text: 'item 5', selected: false }
  // ];
  disablecontactname: boolean = false;
  contactRecordId: any;
  contactrefid: any;
  JSONdataItem: any = [];
  contactRecordId1: any;
  contactSubmitted = false;
  contacAddrSubmitted = false;
  ContactMore = false;
  lstaddressdetails = [];
  addressdeletedrows = [];
  documentstorelist: [];
  referralbankdetailslist: any[];
  lstbusinessperson: [];
  pAddressTypeChk: any;
  lstContactDetailsByID: any;
  titleDetails: any;
  addressTypeDetails: any;
  countryDetails: any;
  stateDetails: any;
  districtDetails: any;
  addressTransType = 'Add';
  addressindex = 0;
  readonlyaddressdetals = false;
  readonlycontactdetails = false;
  disablesavebutton = false;
  savebutton = "Submit";
  showfirstname = false;
  showlastname = false;
  firstnamwithlastname = '';
  lastnamwithfirstname = '';
  latitude: any;
  longitude: any;
  disableaddresstypesavebutton = false;
  saveaddresstypebutton = "Save";
  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  gender: any;
  contactname: any;
  dateOfBirth: any;
  ContactListData: any = [];
  flagGrid: boolean = false;
  constructor(private _commonService: CommonService, private _contacmasterservice: ContacmasterService, private formbuilder: FormBuilder, private _profileuploadSer: PhotouploadService, private _defaultimage: DefaultProfileImageService, private _routes: Router, private datePipe: DatePipe, private toastr: ToastrService, private http: HttpClient) {
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY'
    this.pDobConfig.containerClass = 'theme-dark-blue';
    this.pDobConfig.showWeekNumbers = false;
    this.pDobConfig.maxDate = new Date();
    //this.pDobConfig.dateInputFormat = this._commonService.DatePickerDateFormat("dateInputFormat");
  }
  public loading = false;
  contactValidationErrors: any;
  addressTypeErrorMessage: any = {};
  lstRelatedPartysDTO: any = [];
  PartyValidationErrors: any = {};
  imageChangedEvent: any = '';
  croppedImageImageurl: any;
  generatedImage: any;
  imageResponse: any;
  FileName: any;
  FilePath: any;
  ProfileUploadSubscriber: any
  @ViewChild(ContactSelectComponent, { static: false }) _ContactSelectComponent: ContactSelectComponent;
  @ViewChild(BankDetailsNewGlobalComponent, { static: false }) BankDetailsComponent: BankDetailsNewGlobalComponent;
  @ViewChild(TDSDetailsComponent, { static: false }) Taxes: TDSDetailsComponent;
  @ViewChild(KycDocumentsNewGlobalComponent, { static: false }) IdentificationDocuments: KycDocumentsNewGlobalComponent;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  branchdetails: [];
  public columns: Array<object>;
  public ColumnMode = ColumnMode;
  public rows = [];
  public selected = [];
  public SelectionType = SelectionType;
  ngOnInit() {
    this.GetContactDetails("Contacts", 0, '');
    this.addressdeletedrows = [];
    debugger
    if (this.contactType == 'Individual') {
      this.showPage = true;
    }
    else {
      this.showPage = false;
    }
    this._commonService._GetKYCData().subscribe(data => {
      debugger;
      this.contactForm.controls.documentstorelist.setValue(data);
    });
    this._commonService._GetBankData().subscribe(data => {
      this.contactForm.controls.referralbankdetailslist.setValue(data);
    });
    this.contactValidationErrors = [];
    let contactdata = { "pContactName": '', "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    debugger;
    this._commonService._SetContactData(contactdata);
    this.addresstypeForm = this.formbuilder.group({
      pContactType: [''],
      //pAddressType: ['', Validators.required],
      pAddressType: [{ value: '', disabled: true }, Validators.required],
      // pipaddress: [this._commonService.ipaddress],
      pStatusname: [this._commonService.pStatusname],
      pCreatedby: [this._commonService.pCreatedby],
    })
    this.contactForm = this.formbuilder.group({
      pReferenceId: [''],
      pAddressTypeChk: [''],
      pPhoto: [''],
      //schemaid: [this._commonService.pschemaname],
      //schemaname: ['schemaname'],
      //samebranchcode: [this._commonService.pschemaname],
      pStatusname: [this._commonService.pStatusname],
      pContactimagepath: [''],
      pName: ['', Validators.required],
      pBusinessEntityEmailid: [''],
      pBusinessEntityContactno: [''],
      pContactType: [''],
      documentstorelist: [],
      // referralbankdetailslist: [],
      lstbusinessperson: [''],
      pSurName: [''],
      pDob1: ['', Validators.required],
      pDob: [''],
      pGender: ['Male'],
      Name: [''],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pactivitytype: ['C'],
      pFatherName: ['', Validators.required],
      pSpouseName: [''],
      pAge: [''],
      pTitleName: [null, Validators.required],
      pContactName: ['Firstname'],
      pEmailId: ['', Validators.pattern],
      pEmailId2: ['', Validators.pattern],
      pContactNumber: ['', [Validators.required, Validators.minLength(10)]],
      pAlternativeNo: ['', Validators.minLength(10)],
      pRecordId: [''],
      pRecordId1: [''],
      pContactId: [0],
      pAddressPriority: [''],
      pPriority: [''],
      //  pEmailidsList: this.formbuilder.array([]),
      pAddressControls: this.addAddressControls(),
      pAddressList: this.formbuilder.array([]),
      referralbankdetailslist: this.formbuilder.array([]),

    })
    this.getAddressTypeDetails();
    this.gettitleDetails();
    this.getCountryDetails();
    this.loadEditDetails();
    this.BlurEventAllControll(this.contactForm);
    // if (this.formtype == 'Save')
    this.croppedImage = this._defaultimage.GetdefaultImage();
  }


  addBankcontrlos(): FormGroup {
    return this.formbuilder.group({
      precordid: [0],
      pBankId: [''],
      pnameasperbank: [''],
      pBankName: ['', Validators.required],
      pBankAccountNo: ['', Validators.required],
      pBankifscCode: [''],
      pBankBranch: [''],
      pIsprimaryAccount: Boolean,
      ptypeofoperation: [''],
    })

  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
  // addcontactControls(): FormGroup {
  //     return this.formbuilder.group({
  //         pContactName: [''],
  //         pEmailId: [''],
  //         pContactNumber: [''],
  //         pPriority: Boolean,
  //         pRecordId: [''],
  //     })
  // }
  addAddressControls(): FormGroup {
    return this.formbuilder.group({
      pRecordId: [''],
      // pAddressTypeChk:[''],
      pAddressType: ['', Validators.required],
      pAddress1: ['', Validators.required],
      pAddress2: [''],
      pState: ['', Validators.required],
      pStateId: [''],
      pDistrict: ['', Validators.required],
      pDistrictId: [''],
      pCity: ['', Validators.required],
      pCountry: ['', Validators.required],
      pCountryId: [null],
      pPinCode: ['', [Validators.required, Validators.minLength(6)]],
      plongitude: ['',],
      platitude: ['',],
      pPriorityCon: Boolean,
      ptypeofoperation: [''],
      pAddressDetails: [''],
      pStatusname: [''],
      pAddressPriority: [''],
      pPriority: [''],
    })
  }
  GetContactPersonData(event) {
    debugger;
    if (this.contactForm.controls.pContactId.value == 0) {
      debugger;
      this.contactForm.controls.pContactId.setValue(event.pContactId);
      this.contactForm.controls.pTitleName.setValue(event.pTitleName);
      this.contactForm.controls.pName.setValue(event.pContactName);
      this.contactForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      debugger;
      this._commonService._SetContactData(event);
    }
    else {
      this.contactForm.controls.pContactId.setValue(event.pContactId);
      this.contactForm.controls.pTitleName.setValue(event.pTitleName);
      this.contactForm.controls.pName.setValue(event.pContactName);
      this.contactForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      debugger;
      this._commonService._SetContactData(event);
    }

  }

  filter(event) {
    debugger;

    let contactdata = { "pContactName": event.target.value, "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    //let data={text: event.target.value, selected: false};
    debugger;
    this._commonService._SetContactData(contactdata);
    if (this.contactForm.controls.pSurName.value != '') {
      this.showfirstname = true;

      this.firstnamwithlastname = event.target.value + ' ' + this.contactForm.controls.pSurName.value;
      this.lastnamwithfirstname = this.contactForm.controls.pSurName.value + ' ' + event.target.value;

    }
    else {
      if (event.target.value != '') {
        this.showfirstname = true;

        this.firstnamwithlastname = event.target.value;
      }
    }

  }
  filter1($event) {
    // let contactdata = { "pContactName": $event.target.value, "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    //let data={text: event.target.value, selected: false};
    // this._commonService._SetContactData(contactdata);
    if (this.contactForm.controls.pName.value != '') {
      this.showlastname = true;

      this.firstnamwithlastname = this.contactForm.controls.pName.value + ' ' + $event.target.value;
      this.lastnamwithfirstname = $event.target.value + ' ' + this.contactForm.controls.pName.value;
    }
    else {
      if ($event.target.value != '') {
        this.showlastname = true;
        this.lastnamwithfirstname = $event.target.value;
      }
    }
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    debugger;
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {

        if (key != 'pAddressList')
          this.setBlurEvent(key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
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
      this.showErrorMessage(e);
      return false;
    }
  }

  GetContactDetails(Contacts, pageno, searchby) {
    this.ContactListData = [];
    this._contacmasterservice.GetContactDetailsListIndex(Contacts, pageno, searchby).subscribe(result => {
      debugger;
      this.ContactListData = result;

    })
  }

  // binding saved details to the controls while editing
  loadEditDetails() {
    debugger;

    // let contactdata = { "pContactName": '', "pContacttype": '', "pReferenceId": '', "pContactId": '' }
    // this._commonService._SetContactData(contactdata);
    this.addressdeletedrows = [];
    let daaaaya = this._contacmasterservice.getContactGlobalDataOnChange();
    if (daaaaya != '') {
      if (daaaaya.contactname != '' || daaaaya.contactmobilenumber || '') {
        this.flagGrid = true;
      }
    }
    if (this.formtype == 'Save' && this.contactType == 'Individual' && this.flagGrid) {

      this.loading = true;
      this.readonlycontactdetails = true;
      this._contacmasterservice.GetPersonGlobalCount(this.referenceid).subscribe(count => {
        let countValue = count;
        if (countValue > 0) {
          this.formtype = 'Update';
          this.savebutton = 'Update';
        }
        else {
          this.formtype = 'Save';
          this.savebutton = 'Save';
        }
      })
      this._contacmasterservice.ViewContactGlobal(this.referenceid).subscribe(json => {
        try {
          if (json != null) {
            //this.contactForm.patchValue(json);
            this.contactForm.controls.pContactNumber.setValue(json.gBusinessEntityContactno);
            this.contactForm['controls']['pContactNumber'].setValue(json.gBusinessEntityContactno);
            this.contactForm['controls']['pAlternativeNo'].setValue(json.gBusinessEntityContactno);
            this.contactForm['controls']['pSurName'].setValue(json.gContactSurname);
            this.contactForm.controls.pTitleName.setValue(json.gContactTitleName);
            this.contactForm.controls.pContactType.setValue(json.gContactEntityType);
            this.contactForm.controls.pName.setValue(json.gContactName);
            this.contactForm.controls.pContactId.setValue(json.gContactId);
            this.contactForm.controls.pFatherName.setValue(json.gFatherName);
            this.contactForm.controls.pSpouseName.setValue(json.gSpouseName);
            this.contactForm.controls.pGender.setValue(json.gGender);
            let onlyDate = json.gDob;
            this.dateOfBirth = onlyDate;
            this.contactForm.controls.pDob1.setValue(onlyDate);
            if (onlyDate == '') {
              this.contactForm['controls']['pAge'].setValue(0);
            }
            this.firstnamwithlastname = json.gContactMaillingName;

            // const control = <FormGroup>this.contactForm['controls']['pAddressControls'];

            // control.controls.pAddress1.setValue(json.gContactAddressList[0].gAddress1);
            // control.controls.pAddress2.setValue(json.gContactAddressList[0].gArea);
            // control.controls.pState.setValue(json.gContactAddressList[0].gStateName);
            // control.controls.pStateId.setValue(json.gContactAddressList[0].gStateId);
            // control.controls.pDistrict.setValue(json.gContactAddressList[0].gDistrictNames);
            // control.controls.pDistrictId.setValue(json.gContactAddressList[0].gDistrictId);
            // control.controls.pCity.setValue(json.gContactAddressList[0].gCityName);
            // control.controls.pPinCode.setValue(json.gContactAddressList[0].gPincode);
            // control.controls.pAddressType.setValue(json.gContactAddressList[0].gAddressType);
            // control.controls.ptypeofoperation.setValue('CREATE');
            // control.controls.pCountry.setValue('INDIA');
            // control.controls.pCountryId.setValue(1);
            // control.controls.pAddress1.setValue(json.gAddress1);

            console.log("edit details", json)
            debugger;
            let contactdata = { "pContactName": json.gContactName, "pContacttype": json.gContactEntityType, "pReferenceId": '', "pContactId": json.gContactId }

            this.contactForm.controls.pEmailId.setValue(json.pBusinessEntityEmailid)
            this.contactForm.controls.pContactNumber.setValue(json.gBusinessEntityContactno);
            this.contactForm.controls.pContactId.setValue(this.contactForm.controls.pContactId.value);
            if (json.gContactMaillingName != '') {
              this.showfirstname = true;
              this.firstnamwithlastname = json.gContactMaillingName;
              //this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pName.value+' '+this.contactForm.controls.pSurName.value);
            }
            if (json.gContactSurname != '') {
              this.showlastname = true;
              this.lastnamwithfirstname = json.gContactSurname;
              // this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pSurName.value+' '+this.contactForm.controls.pName.value);
            }
            if (json.gContactName != '' && json.gContactSurname != '') {
              this.showlastname = true;
              this.showfirstname = true;
              this.firstnamwithlastname = json.gContactName + ' ' + json.gContactSurname;
              this.lastnamwithfirstname = json.gContactSurname + ' ' + json.gContactName;
            }
            if (json.pContactName == this.firstnamwithlastname) {
              this.contactForm.controls.pContactName.setValue('Firstname');

            }
            if (json.pContactName == this.lastnamwithfirstname) {
              this.contactForm.controls.pContactName.setValue('Lastname');

            }
            debugger;
            this._commonService._SetContactData(contactdata);
            const list = json.gContactdocumentslist;

            const distinctList = Object.values(
              list.reduce((acc, item) => {
                const key = item.gDocumentProofsType;

                if (!acc[key]) {
                  acc[key] = item;
                } else {

                  const existing = acc[key];

                  // Check empty filename without using ?.
                  const existingFile = existing.gDocumentFileName ? existing.gDocumentFileName.trim() : "";
                  const newFile = item.gDocumentFileName ? item.gDocumentFileName.trim() : "";

                  const hasFileExisting = existingFile !== "";
                  const hasFileNew = newFile !== "";

                  // Prefer the object with a valid file name
                  if (!hasFileExisting && hasFileNew) {
                    acc[key] = item;
                  }
                }

                return acc;
              }, {})
            );


            this.contactForm.controls.documentstorelist.setValue(distinctList)
            if (distinctList != null) {
              this._commonService._SetKYCUpdate(distinctList);
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
            this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
            this.contactType = json.pContactType;
            if (json.pcontactexistingstatus) {
              this.disablecontactname = true
            }
            else {
              this.disablecontactname = false;
            }

            if (json.gGender == 'M') {
              this.contactForm.controls.pGender.setValue("Male");

            }
            if (json.gGender == 'F') {
              this.contactForm.controls.pGender.setValue("Female");

            }
            if (json.gGender == 'T') {
              this.contactForm.controls.pGender.setValue("Third Gender");
            }
            if (json.pPhoto)
              this.croppedImage = "data:image/png;base64," + json.pPhoto;
            else
              this.croppedImage = this._defaultimage.GetdefaultImage();
            if (json.pDob != null && json.pDob != '') {
              let date = this._commonService.formatDateFromDDMMYYYY(json.pDob);
              this.contactForm['controls']['pDob1'].setValue(date);
              this.contactForm.controls.pDob1.setValue(date);

            }
            debugger;
            if (json.gContactAddressList.length == 1) {
              json.gContactAddressList[0].pPriorityCon = true;
              json.gContactAddressList[0].pAddressPriority = 'PRIMARY';
              json.gContactAddressList[0].priority = 'PRIMARY';
            }
            if (json.gContactAddressList.length > 0) {
              this.lstaddressdetails = json.gContactAddressList;
              let datatabledisplay = json.gContactAddressList.filter(function (loanname) {
                return loanname.gIsPrimary == true;
              });
              this.lstaddressdetails = json.gContactAddressList;
              if (this.lstaddressdetails.length > 0)
                debugger;
              this.contactForm['controls']['pAddressTypeChk'].setValue(datatabledisplay[0].gAddressType);
            }

            if (onlyDate != null && onlyDate != '') {
              this.ageCalculation();
            }
            this.contactForm['controls']['pContactNumber'].setValue(json.gBusinessEntityContactno)


          }
        } catch (e) {
          this.showErrorMessage(e);
        }
        this.loading = false;
      },
        (error) => {

          this.showErrorMessage(error);
        });
    }
    else {
      this.readonlycontactdetails = false;
    }

  }
  loadImages(EventData: any) {
    debugger;
    this.croppedImage = "data:image/png;base64," + EventData[0];
    this.contactForm['controls']['pPhoto'].setValue(EventData[0]);
    this.contactForm['controls']['pContactimagepath'].setValue(EventData[1]);
  }
  // binding Contact Titles to Title Drodown
  gettitleDetails(): void {
    debugger;
    this._contacmasterservice.gettitleDetails().subscribe(json => {
      if (json != null) {
        this.titleDetails = json
      }
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  // binding Address Types  to Address Type Dropdown
  getAddressTypeDetails(): void {
    debugger;
    this._contacmasterservice.getAddressTypeDetails(this.contactType).subscribe(
      (json) => {

        if (json != null) {
          this.addressTypeDetails = json;
        }
      },
      (error) => {

        this.showErrorMessage(error);
      }
    );
  }
  // binding Country Details  Country Dropdown
  getCountryDetails(): void {

    this._contacmasterservice.getCountryDetails().subscribe(json => {
      debugger
      if (json != null) {
        this.countryDetails = json;

      }
    },
      (error) => {

        this.showErrorMessage(error);
      });

  }
  // Clearing country state and district and binding states based on country id while Country change event
  pCountry_Change($event: any): void {
    debugger;
    this.stateDetails = [];
    this.districtDetails = [];
    //this.contactForm['controls']['pAddressControls']['controls']['pCountry'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pStateId'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');
    this.contactValidationErrors.pState = null;
    this.contactValidationErrors.pDistrict = null;
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

        this.showErrorMessage(error);
      });
  }
  //  binding districts based on state id  while state change event if state id is null or empty it will clear states and districts
  pState_Change($event: any) {
    debugger;
    this.districtDetails = [];
    this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue('');
    this.contactValidationErrors.pDistrict = null;
    const stateid = $event.pStateId;
    if (stateid && stateid != '') {
      const statename = $event.pState;

      this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue(statename);
      this.getDistrictDetails(stateid);
      this.getLatitudeLongitude();

    }
    else {
      this.districtDetails = [];
      this.contactForm['controls']['pAddressControls']['controls']['pState'].setValue('');
    }

  }
  //  binding districts based on state id
  getDistrictDetails(stateid) {
    debugger;
    this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {
      this.districtDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  // District drop down change event
  pDistrict_Change($event: any) {

    const districtid = $event.pDistrictId;

    if (districtid && districtid != '') {
      const districtname = $event.pDistrict;
      this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);
    }
    else {
      this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    }
    this.getLatitudeLongitude();

  }
  // Address Type drop down change event
  pAddressType_Change($event: any): void {
    this.GetContactValidationByControl('pAddressType', true);
  }
  // Address priority  grid radio button event
  changeAddressPriority(index: number) {
    //console.log(this.contactForm.value)


    this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[index].gAddressType);
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
    this.getLatitudeLongitude();

  }

  ageCalculation() {
    debugger
    let age;
    let dob = this.contactForm.controls.pDob1.value;
    if (dob != '' && dob != null) {
      let currentdate = Date.now();
      //let agedate = new Date(dob);
      let [day, month, year] = dob.split("-");

      let agedate = new Date(+year, +month - 1, +day).getTime();
      // let agedate = new Date(dob).getTime();
      let timeDiff = Math.abs(currentdate - agedate);
      if (timeDiff.toString() != 'NaN')
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      if (age > 18) {
        debugger;
        this.contactForm['controls']['pAge'].setValue(age);
      }
      else if (age < 18) {

        this._commonService.showWarningMessage("Sorry, only persons over the age of 18");
        this.contactForm['controls']['pDob1'].setValue('');
        this.contactForm['controls']['pAge'].setValue('');

      }
    }
    else {
      age = 0;
    }


  }
  checkContactValidations(group: FormGroup, isValid: boolean): boolean {
    debugger;
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetContactValidationByControl(key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, 'pDob');
                this.contactValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      this.disablesavebutton = false;
      this.savebutton = "Submit";
      this.showErrorMessage(e);
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
      let addresstype = addressFormControl.controls.pAddressType.value;
      for (let i = 0; i < this.lstaddressdetails.length; i++) {
        if (this.addressTransType == 'Update') {
          if (this.lstaddressdetails[i].gAddressType === addresstype && i != this.addressindex) {
            count = 1;
            break;
          }
        }
        else {
          if (this.lstaddressdetails[i].gAddressType === addresstype) {
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
          if (this.lstaddressdetails[i].gIsPrimary === true) {
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

if ( this.contactForm.controls.pFatherName.value == '' ||this.contactForm.controls.pFatherName.value == null)
    {
       this._commonService.showWarningMessage('Please Add Father Name in KGMS');
       return false;
    }
    return isValid;
  }

  tabsClick(tabname) {
    if (tabname == 'bank') {


      this.BankDetailsComponent.showBank = true;
      //  this.BankDetailsComponent.showBankTitle = false;

    }
  }
  // File Upload file types validation
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
  // upload and display image
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

      this._commonService.fileUpload(formData).subscribe(data => {
        debugger;
        this.FileName = data;
        if (this.imageResponse)
          this.croppedImage = data[0];
        // this.croppedImage = "data:image/png;base64," + data[0];
        this._commonService.GetImage(data[0]).subscribe(res => {
          console.log("imageresponse", res);
          this.croppedImage = "data:image/png;base64," + res[0];
        })

        this.contactForm['controls']['pPhoto'].setValue(data[0]);
        this.contactForm['controls']['pContactimagepath'].setValue(data[1]);
      })
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
            this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].gAddressType);
            this.lstaddressdetails[this.addressindex].pAddressPriority = 'PRIMARY';
            this.lstaddressdetails[this.addressindex].pPriority = 'PRIMARY';
          }
        }
        else {
          control['controls']['ptypeofoperation'].setValue('CREATE');
          if (this.lstaddressdetails.length == 0) {
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
        this.getLatitudeLongitude();

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
  // editing method for edit row from address details grid
  editAddressDeatails(index): void {
    debugger;
    try {

      //this.getSateDetails(1);
     // this.getDistrictDetails(this.lstaddressdetails[index].gStateId);

      const control = <FormGroup>this.contactForm['controls']['pAddressControls'];

      control.controls.pAddress1.setValue(this.lstaddressdetails[index].gAddress1);
      control.controls.pAddress2.setValue(this.lstaddressdetails[index].gArea);
      // control.controls.pState.setValue(this.lstaddressdetails[index].gStateName);
      // control.controls.pStateId.setValue(this.lstaddressdetails[index].gStateId);
      // control.controls.pDistrict.setValue(this.lstaddressdetails[index].gDistrictName);
      // control.controls.pDistrictId.setValue(this.lstaddressdetails[index].gDistrictId);
//       control.controls.pState.setValue(this.lstaddressdetails[index].gStateName);

       this.stateDetails = [ {
             pStateId: this.lstaddressdetails[index].gStateId,
            pState: this.lstaddressdetails[index].gStateName }];

      this.districtDetails = [ {
            pDistrictId: this.lstaddressdetails[index].gDistrictId,
           pDistrict: this.lstaddressdetails[index].gDistrictName}];

      control.controls.pStateId.setValue(this.lstaddressdetails[index].gStateId);
      control.controls.pDistrictId.setValue(this.lstaddressdetails[index].gDistrictId);
      control.controls.pCity.setValue(this.lstaddressdetails[index].gCityName);
      control.controls.pPinCode.setValue(this.lstaddressdetails[index].gPincode);
      control.controls.pAddressType.setValue(this.lstaddressdetails[index].gAddressType);
      control.controls.ptypeofoperation.setValue('Update');
      control.controls.pCountry.setValue('INDIA');
      control.controls.pCountryId.setValue(1);
      //control.patchValue(this.lstaddressdetails[index])
      this.addressTransType = 'Update';
      this.addressindex = index;
      this.readonlyaddressdetals = true;
      this.getLatitudeLongitude();

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
      this.lstaddressdetails = [...this.lstaddressdetails];
      this.addressTransType = 'Add';
      this.addressindex = 0;
      if (this.lstaddressdetails.length >= 1) {
        this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].gAddressType);
        this.lstaddressdetails[0].pPriorityCon = true;
        this.lstaddressdetails[0].pAddressPriority = 'PRIMARY';
        this.lstaddressdetails[0].ptypeofoperation = 'UPDATE';
        this.lstaddressdetails[0].pPriority = 'PRIMARY';
      }
      this.clearAddressDeatails();
      this.getLatitudeLongitude();

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
    this.contactForm['controls']['pAddressControls']['controls']['pCountryId'].setValue(null);
    this.contactForm['controls']['pAddressControls']['controls']['plongitude'].setValue('');
    this.contactForm['controls']['pAddressControls']['controls']['platitude'].setValue('');
    this.stateDetails = [];
    this.districtDetails = [];
    this.contactValidationErrors = {};
    this.addressTransType = 'Add';
    this.readonlyaddressdetals = false;
    this.getLatitudeLongitude();
  }
  checkDocumentsAndStop(docList: any[]): boolean {

    // sir originalconst types = docList.map(d =>
    //   (d.gDocumentProofsType ? d.gDocumentProofsType.toLowerCase().trim() : '')
    // );

    const types = docList.map(d => {
      const type = d.gDocumentProofsType || d.pDocumentName || '';
      return type.toLowerCase().trim();
    });

    const hasPan = types.includes('pan card');
    const hasAadhar = types.includes('aadhar card');

    if (!hasPan) {
      this._commonService.showWarningMessage("Please add PAN Card details in KGMS Application to continue");
      return false;
    }

    if (!hasAadhar) {
      this._commonService.showWarningMessage("Please add Aadhar Card details in KGMS Application to continue");
      return false;
    }

    return true;
  }


  // save / update method for contact details fromm

  saveContactDetails(): Observable<any> {
    debugger;
    this.disablesavebutton = true;
    this.contactrefid = 0;
    this.savebutton = "Processing";
    if (!this.contactForm.controls.pFatherName.value && !this.contactForm.controls.pSpouseName.value) {
      this._commonService.showWarningMessage('Please enter either Father Name or Spouse Name');
      return;
    }
    if (this.dateOfBirth == '') {
      this.contactForm['controls']['pAge'].setValue(0);
      this._commonService.showWarningMessage("Please add Date Of Birth in KGMS Application to continue");
      return
    }
    let dateOfBirth = this.contactForm.controls.pDob1.value;
    // this.contactForm.controls.pDob.setValue(this.datePipe.transform(dateOfBirth,'yyyy-MM-dd'))
    let cleanDate = dateOfBirth.replace(/[-/]/g, '-');  // becomes "15-07-1989"

    let parts = cleanDate.split('-'); // ["15", "07", "1989"]

    let dob = new Date(+parts[2], +parts[1] - 1, +parts[0]);

    this.contactForm.controls.pDob.setValue(this.datePipe.transform(dob, 'yyyy-MM-dd')
    );
    try {
      this.contactSubmitted = true;
      debugger;
      this._commonService._GetKYCData().subscribe(data => {
        debugger;
        let kycdetails = [];
        kycdetails = data;
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

      this.contactForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
      this.contactForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
      //this.contactForm['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);

      if (this.contactForm.controls.pAge.value == null || this.contactForm.controls.pAge.value == '') {
        this.contactForm['controls']['pAge'].setValue(0);
      }
      this.contactForm['controls']['pTitleName'].setValue(this.contactForm.controls.pTitleName.value);
      this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
      this.contactForm['controls']['pContactType'].setValue(this.contactForm.controls.pContactType.value);
      this.contactForm['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);
      this.contactForm['controls']['pAlternativeNo'].setValue(this.contactForm.controls.pAlternativeNo.value);
      this.contactForm['controls']['pEmailId'].setValue(this.contactForm.controls.pEmailId.value);
      this.contactForm['controls']['pEmailId2'].setValue(this.contactForm.controls.pEmailId2.value);
      this.contactForm['controls']['pContactName'].setValue(this.contactForm.controls.pContactName.value);
      // this.contactForm['controls']['pcontactmailingname'].setValue(this.contactForm.controls.pName + ' ' + this.contactForm.controls.pSurName);
      this.contactForm['controls']['pBusinessEntityEmailid'].setValue(this.contactForm.controls.pEmailId.value);
      this.contactForm['controls']['pBusinessEntityContactno'].setValue(this.contactForm.controls.pContactNumber.value);
      // for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++){

      // this.contactForm
      //   debugger;
      // const bankcontrols = <FormArray>this.BankDetailsComponent.BankForm['controls']['pAddressList'];
      // bankcontrols.pus
      // }

      if (this.validateSaveDeatails(this.contactForm)) {
        debugger;
        if (this.contactForm.controls.pGender.value == "Male") {
          this.contactForm.controls.pGender.setValue("M");
        }


        if (this.contactForm.controls.pGender.value == "Female") {
          this.contactForm.controls.pGender.setValue("F");
        }
        if (this.contactForm.controls.pGender.value == "Third Gender") {
          this.contactForm.controls.pGender.setValue("T");
        }

        this.gender = this.contactForm.controls.pGender.value;

        this.contactname = this.contactForm.controls.pContactName.value
        if (this.contactForm.controls.pContactName.value == "Firstname") {
          this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pName.value + ' ' + this.contactForm.controls.pSurName.value);
        }
        if (this.contactForm.controls.pContactName.value == "Lastname") {
          this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pSurName.value + ' ' + this.contactForm.controls.pName.value);
        }
        //adding deleted bank details

        if (this.BankDetailsComponent.deletedBankDetails.length > 0) {
          if (this.BankDetailsComponent.bankdetailslist.length > 0) {
            this.BankDetailsComponent.bankdetailslist = [...this.BankDetailsComponent.bankdetailslist, ...this.BankDetailsComponent.deletedBankDetails];
          }
          else {
            this.BankDetailsComponent.bankdetailslist = [...this.BankDetailsComponent.deletedBankDetails];
          }
          this.BankDetailsComponent.deletedBankDetails = [];
        }
        if (this.BankDetailsComponent.bankdetailslist.length > 0) {
          for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++) {
            const bankcontrol = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
            bankcontrol.push(this.addBankcontrlos());
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['precordid'].setValue(1);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankId'].setValue(this.BankDetailsComponent.bankdetailslist[i].gBankId);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankName'].setValue(this.BankDetailsComponent.bankdetailslist[i].gBankName);

            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pnameasperbank'].setValue(this.firstnamwithlastname);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankAccountNo'].setValue(this.BankDetailsComponent.bankdetailslist[i].gBankAccountNumber);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankifscCode'].setValue(this.BankDetailsComponent.bankdetailslist[i].gBankIfscCode);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankBranch'].setValue(this.BankDetailsComponent.bankdetailslist[i].gBankBranchName);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pIsprimaryAccount'].setValue(this.BankDetailsComponent.bankdetailslist[i].gStatus);
            this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['ptypeofoperation'].setValue("CREATE");

          }
        }
        //removing empty records
        let bankdetails = [];
        if (this.BankDetailsComponent.bankdetailslist.length > 0) {
          bankdetails = this.contactForm['controls']['referralbankdetailslist'].value;
        }
        //disabled of bank not

        // if(bankdetails!=null){
        //     if(bankdetails.length>0){
        //         bankdetails=bankdetails.filter(row=>row.pBankId!='');
        //      }
        //   }
        this.contactForm['controls']['referralbankdetailslist'].setValue(bankdetails);
        //this.referralbankdetailslist.push(bankdetails);

        //adding deleted address details
        if (this.addressdeletedrows.length > 0) {
          if (this.lstaddressdetails.length > 0) {
            this.lstaddressdetails = [...this.lstaddressdetails, ...this.addressdeletedrows];
          }
          else {
            this.lstaddressdetails = [...this.addressdeletedrows];
          }
          this.addressdeletedrows = [];
        }
        for (let i = 0; i < this.lstaddressdetails.length; i++) {
          const addresscontrol = <FormArray>this.contactForm['controls']['pAddressList'];
          addresscontrol.push(this.addAddressControls());
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressType'].setValue(this.lstaddressdetails[i].gAddressType);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress1'].setValue(this.lstaddressdetails[i].gAddress1);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress2'].setValue(this.lstaddressdetails[i].gArea);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pState'].setValue(this.lstaddressdetails[i].gStateName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStateId'].setValue(this.lstaddressdetails[i].gStateId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrict'].setValue(this.lstaddressdetails[i].gDistrictName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrictId'].setValue(this.lstaddressdetails[i].gDistrictId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCity'].setValue(this.lstaddressdetails[i].gCityName);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountry'].setValue('INDIA');
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStatusname'].setValue(this.lstaddressdetails[i].gAddressStatus);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountryId'].setValue(1);
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
        //  let lstRelatedPartysDTO = { lstRelatedPartysDTO: this.lstRelatedPartysDTO}
        //    let formdata = Object.assign(this.contactForm.value)
        //     console.log(formdata);

        // if(this.contactForm['controls'].documentstorelist==null)
        // {
        //     this.documentstorelist=[];
        // }
        // if(this.contactForm['controls'].referralbankdetailslist==null)
        // {
        //     this.referralbankdetailslist=[];
        // }
        // documentstorelist: ""
        // referralbankdetailslist: ""


        let documentDetailsList = this.contactForm.controls.documentstorelist.value;
        if (!this.checkDocumentsAndStop(documentDetailsList)) {
          return;
        }
        let selectedItemsdata = [];
        //let  ppaymentslistDAta = [];
        // for (let i = 0; i < documentDetailsList.length; i++) {
        //   let data1 = {
        //     "pDocumentId": documentDetailsList[i].gDocumentProofsId,
        //     "pDocReferenceno": documentDetailsList[i].gDocumentReferenceNo,
        //     "pDocumentName": documentDetailsList[i].gDocumentProofsType,
        //     "pContactreferenceid": this.referenceid,
        //    // "pDocumentGroup": "Identification Documents",
        //     //"pDocumentGroupId": 2,
        //     "pDocumentGroupId": 6,
        //     "pContactId": this.contactForm.controls.pContactId.value,
        //     'ptypeofoperation': "CREATE",
        //     'pisapplicable': true


        //   }



        //   selectedItemsdata.push(data1)

        // }

        for (let i = 0; i < documentDetailsList.length; i++) {

          let docType = documentDetailsList[i].gDocumentProofsType;

          //let documentId = 0;
          let documentGroupId = 0;
          let documentGroupName = "";
          if (docType === "Pan Card") {
            documentGroupId = 6;
            documentGroupName = "PAN / FORM 60";
          }
          else if (docType === "Aadhar Card") {
            documentGroupId = 7;
            documentGroupName = "Identification Documents";
          }

          let data1 = {
            pDocReferenceno: documentDetailsList[i].gDocumentReferenceNo,
            pDocumentName: docType,
            pDocumentGroup: documentGroupName,
            pDocumentGroupId: documentGroupId,
            pContactreferenceid: this.referenceid,
            pContactId: this.contactForm.controls.pContactId.value,
            ptypeofoperation: "CREATE",
            pisapplicable: true
          };

          selectedItemsdata.push(data1);
        }


        if (documentDetailsList != null) {
          documentDetailsList = documentDetailsList.filter(row => row.gDocumentProofsType != null && row.gDocumentProofsType != "" && row.gDocumentProofsType != '');
          this.contactForm.controls.documentstorelist.setValue(selectedItemsdata);
        }
        let panCardData = documentDetailsList.filter(panCardData => panCardData.gDocumentProofsType == "Pan Card");

        let aadharData = documentDetailsList.filter(aadharData => aadharData.gDocumentProofsType == "Aadhar Card");
        let refData
        if (panCardData.length != 0) {
          refData = panCardData[0].gDocumentReferenceNo;
        }
        let refDataAadhar
        if (aadharData.length != 0) {
          refDataAadhar = aadharData[0].gDocumentReferenceNo;
        }


        let data = JSON.stringify(this.contactForm.value)
        console.log("contact-new data", data)
        debugger;
        const addressControl = <FormArray>this.contactForm.controls['pAddressList'];
        for (let i = addressControl.length - 1; i >= 0; i--) {
          addressControl.removeAt(i)
        }
        let count = 0;
        if (confirm("Do you want to save ?")) {

          debugger
          // checking contact details existed or not if existed retun  Contact already exists other wise will go to save method
          this._contacmasterservice.GetPersonGlobalCount(refDataAadhar).subscribe(res => {
            if (res > 0) {
              this.disablesavebutton = false;
              this.savebutton = "Submit";
              count = 1;
              this._commonService.showWarningMessage('Contact already exists');
              this.gender = this.gender == 'M' ? 'Male' : this.gender == 'F' ? 'Female' : this.gender == 'T' ? 'Third Gender' : "";
              this.contactForm['controls']['pGender'].setValue(this.gender)
              //this.contactForm.controls.pGender.value;
              this.contactForm['controls']['pContactName'].setValue(this.contactname);
            }
            else {

              this._contacmasterservice.GetPersonGlobalCount(refData).subscribe(res => {
                if (res > 0) {
                  debugger
                  this.disablesavebutton = false;
                  this.savebutton = "Submit";
                  count = 1;
                  this._commonService.showWarningMessage('Contact already exists');
                  this.gender = this.gender == 'M' ? 'Male' : this.gender == 'F' ? 'Female' : this.gender == 'T' ? 'Third Gender' : "";
                  this.contactForm['controls']['pGender'].setValue(this.gender)
                  //this.contactForm.controls.pGender.value;
                  this.contactForm['controls']['pContactName'].setValue(this.contactname);
                }
                else if (res == 0) {
                  debugger;
                  this.formtype = 'Save';

                  this._contacmasterservice.saveContactIndividual(data, this.formtype).subscribe(res => {
                    debugger;
                    this.disablesavebutton = false;
                    this.savebutton = "Submit";

                    if (res[0] == 'TRUE') {

                      if (this.ContactMore == true) {
                        let contactTypeForTabDisable = this.contactType;
                        this.clearContactFormDeatails();

                        // this.JSONdataItem = res;
                        //  this.returnedData.emit(res);
                        this._routes.navigate(['/ContactMoreNew'], { queryParams: { ID: res[1], name: "employee", contacttype: contactTypeForTabDisable } })

                      }
                      else {
                        debugger
                        if (this.formtype == 'Save')
                          this._commonService.showInfoMessage("Saved sucessfully");
                        else
                          this._commonService.showInfoMessage("Updated sucessfully");
                        this.clearContactFormDeatails();
                        this._routes.navigate(['/contactView']);

                      }

                    }
                    else {
                      if (this.formtype == 'Save')
                        this.toastr.error("Error while saving");
                      else
                        this.toastr.error("Error while updating");
                    }
                  },
                    (error) => {
                      this.disablesavebutton = false;
                      this.savebutton = "Submit";
                      this.toastr.error(error);
                    });
                }
              },
                (error) => {
                  this.disablesavebutton = false;
                  this.savebutton = "Submit";
                  this.toastr.error(error);

                });
            }
          })
        }
      }
      else {
        this.disablesavebutton = false;
        this.savebutton = "Submit";
      }

    }
    catch (e) {
      this.showErrorMessage(e);
    }

    return this.JSONdataItem;
  }
  // clear all form controls
  clearContactFormDeatails(): void {
    this.contactForm.reset();
    this.emitevent.emit()
    this.addressdeletedrows = [];
    this.lstaddressdetails = [];
    this.contactForm['controls']['pTitleName'].setValue(null);
    this.contactForm['controls']['pGender'].setValue('Male');
    this.contactForm['controls']['pContactName'].setValue('Firstname');
    this.contactForm['controls']['pContactId'].setValue(0);
    this.contactForm['controls']['pSurName'].setValue("");
    this.showfirstname = false;
    this.showlastname = false;
    this.firstnamwithlastname = '';
    this.lastnamwithfirstname = '';
    this.clearAddressDeatails();
    this.BankDetailsComponent.bankdetailslist = [];
    this.IdentificationDocuments.gridData = [];
    this.IdentificationDocuments.deletedKycdocuments = [];
    this.lstRelatedPartysDTO = [];
    this.documentstorelist = [];
    this.formtype = 'Save';
    this.readonlycontactdetails = false;
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
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  // save address type and binding to address type drop down

  saveAddressType(): void {
    try {

      this.disableaddresstypesavebutton = true;
      this.saveaddresstypebutton = "Processing";
      let isValid = true;


      if (this.GetAddressTypeValidationByControl('pAddressType', isValid)) {
        this.addresstypeForm['controls']['pContactType'].setValue(this.contactType);

        let data = JSON.stringify(this.addresstypeForm.value)

        this._contacmasterservice.checkAddressType(this.addresstypeForm.controls.pAddressType.value, this.contactType).subscribe(res => {

          if (res == 0) {
            debugger
            this._contacmasterservice.saveAddressType(data).subscribe(res => {
              this.disableaddresstypesavebutton = false;
              this.saveaddresstypebutton = "Save";
              this.toastr.success("Saved Sucessfully");

              $('#addresstype').modal('hide');
              this.addresstypeForm['controls']['pAddressType'].setValue('');
              //this.clearAddressType();
              this.getAddressTypeDetails();

            },
              (error) => {
                this.disableaddresstypesavebutton = false;
                this.saveaddresstypebutton = "Save";
                this.showErrorMessage(error);
              });
          }
          else {
            let lablename = (document.getElementById('pAddressTypeMst') as HTMLInputElement).title;

            this.toastr.warning(lablename + ' already exists')
            this.disableaddresstypesavebutton = false;
            this.saveaddresstypebutton = "Save";
          }

        },
          (error) => {
            this.disableaddresstypesavebutton = false;
            this.saveaddresstypebutton = "Save";
            this.showErrorMessage(error);
          });
      }
      else {
        this.disableaddresstypesavebutton = false;
        this.saveaddresstypebutton = "Save";
      }

    }
    catch (e) {
      this.showErrorMessage(e);
    }


  }
  // close  address type  popup

  closeAddressType(): void {

    $('#addresstype').modal('hide');
    //this.clearAddressType();
  }
  // clear method wile save new address type in popup
  getLatitudeLongitude() {
    debugger
    let arr = [];

    for (let i = 0; i < this.lstaddressdetails.length; i++) {
      if (this.lstaddressdetails[i].pPriority == 'PRIMARY') {
        arr.push(this.lstaddressdetails[i])

      }
    }
    if (arr.length != 0) {
      let geoCodeApiUrl = "http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address="
        + arr[0].paddress1 + "," + arr[0].paddress2
        + "," + arr[0].pcity + "," + arr[0].pState
        + "," + arr[0].pCountry + "," + arr[0].pincode
        + "&key=AIzaSyAdjvx40arfFIKZTq6bIenG586DP5kjJFw";
      this.http.get(geoCodeApiUrl).subscribe(res => {
        debugger
        let data = res['results'];
        this.contactForm['controls']['pAddressControls']['controls'].latitude.setValue(data[0].geometry.location.lat);
        this.contactForm['controls']['pAddressControls']['controls'].longitude.setValue(data[0].geometry.location.lng);
        this.latitude = data[0].geometry.location.lat;
        this.longitude = data[0].geometry.location.lng;

      })
    }
    else {
      this.longitude = "";
      this.latitude = "";
    }
  }
  clearAddressType(): void {
    //this.addresstypeForm.reset();
    debugger
    this.addresstypeForm = this.formbuilder.group({
      pContactType: [''],
      pAddressType: ['', Validators.required],
      // pipaddress: [this._commonService.ipaddress],
      pStatusname: [this._commonService.pStatusname],
      pCreatedby: [this._commonService.pCreatedby],
    })
    this.contactForm = this.formbuilder.group({
      pReferenceId: [''],
      pAddressTypeChk: [''],
      pPhoto: [''],
      //schemaid: [this._commonService.pschemaname],
      //schemaname: ['schemaname'],
      //samebranchcode: [this._commonService.pschemaname],
      pStatusname: [this._commonService.pStatusname],
      pContactimagepath: [''],
      pName: ['', Validators.required],
      pBusinessEntityEmailid: [''],
      pBusinessEntityContactno: [''],
      pContactType: [''],
      documentstorelist: [],
      // referralbankdetailslist: [],
      lstbusinessperson: [''],
      pSurName: [''],
      pDob1: [''],
      pDob: [''],
      pGender: ['Male'],
      Name: [''],
      // pipaddress: [this._commonService.ipaddress],
      pCreatedby: [this._commonService.pCreatedby],
      pactivitytype: ['C'],
      pFatherName: [''],
      pSpouseName: [''],
      pAge: [''],
      pTitleName: [null, Validators.required],
      pContactName: ['Firstname'],
      pEmailId: ['', Validators.pattern],
      pEmailId2: ['', Validators.pattern],
      pContactNumber: ['', [Validators.required, Validators.minLength(10)]],
      pAlternativeNo: ['', Validators.minLength(10)],
      pRecordId: [''],
      pRecordId1: [''],
      pContactId: [0],
      pAddressPriority: [''],
      pPriority: [''],
      //  pEmailidsList: this.formbuilder.array([]),
      pAddressControls: this.addAddressControls(),
      pAddressList: this.formbuilder.array([]),
      referralbankdetailslist: this.formbuilder.array([]),

    })
    this.contactForm.controls.pContactId.setValue(0)
    this.getAddressTypeDetails();
    this.gettitleDetails();
    this.getCountryDetails();
    this.addressTypeErrorMessage = {};

  }
  clearAddressdataType() {
    debugger
    this.addresstypeForm.reset();
    this.addressTypeErrorMessage = {};
  }




}
