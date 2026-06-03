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
import { BankdetailsnewComponent } from 'src/app/UI/Common/bankdetails-new/bankdetailsnew.component';
import { KycdocumentsnewComponent } from 'src/app/UI/Common/kycdocuments-new/kycdocuments-new.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-contact-new-individual',
  templateUrl: './contact-new-individual.component.html',
  styles: []
})
export class ContactNewIndividualComponent implements OnInit {
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
  isEmployee: boolean = false;
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
  addressdeletedrows=[];
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
  showfirstname=false;
  showlastname=false;
  firstnamwithlastname='';
  lastnamwithfirstname='';

  disableaddresstypesavebutton = false;
  saveaddresstypebutton = "Save";

  map:any=[];
  public latitude:any;
  longitude:any;
  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  gender: any;
  contactname: any;
  guardianListData: any = [];
  RelationshipData: any = [];
  patterMobile: any;
  kyclist: any = [];
 constructor(private _commonService:CommonService,private _contacmasterservice: ContacmasterService,private formbuilder:FormBuilder,private _profileuploadSer: PhotouploadService, private _defaultimage: DefaultProfileImageService, private _routes: Router, private datePipe: DatePipe, private toastr: ToastrService, private http: HttpClient)
   { 
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY'
    
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
   @ViewChild(BankdetailsnewComponent, { static: false }) BankDetailsComponent:BankdetailsnewComponent;
   @ViewChild(TDSDetailsComponent, { static: false }) Taxes: TDSDetailsComponent;
   @ViewChild(KycdocumentsnewComponent, { static: false }) IdentificationDocuments: KycdocumentsnewComponent;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;	
  branchdetails: [];	
  public columns: Array<object>;	
  public ColumnMode = ColumnMode;	
  public rows = [];	
  public selected = [];	
  public SelectionType = SelectionType;
  isGuardian :boolean = false;
   ngOnInit()
   {
    this.addressdeletedrows=[];
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
   this.patterMobile = /^[6789]\d{9}$/;
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
     pSurName: ['', Validators.required],
     pDob: [''],
     pGender: ['Male'],
     pEmployee:[''],
     Name: [''],
    // pipaddress: [this._commonService.ipaddress],
     pCreatedby: [this._commonService.pCreatedby],
     pactivitytype: ['C'],
     pFatherName: ['',Validators.required],
     pSpouseName: [''],
     pAge: [''],
     pTitleName: [null, Validators.required],
     pContactName: ['Firstname'],
     pEmailId: ['', Validators.pattern],
     pEmailId2: ['', Validators.pattern],
     pContactNumber: ['', [Validators.required, Validators.minLength(10),Validators.pattern(this.patterMobile)]],
     pAlternativeNo: ['',Validators.minLength(10)],
     pRecordId: [''],
     pRecordId1: [''],
     pContactId:[0],
     pAddressPriority: [''],
     pPriority:[''],
     pguardianname:[''],
     pguardianrelation:[''],
     pguardiancontactid:[0],
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
     pAddressPriority:[''],
     pPriority:[''],
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
   if(this.contactForm.controls.pSurName.value!='')
   {
     this.showfirstname=true;

     this.firstnamwithlastname=event.target.value +' '+this.contactForm.controls.pSurName.value;
     this.lastnamwithfirstname=this.contactForm.controls.pSurName.value+' '+event.target.value;

   }
   else
   {
     if(event.target.value!='')
     {
       this.showfirstname=true;

   this.firstnamwithlastname=event.target.value;
     }
   }

 }
 filter1($event) {  
  // let contactdata = { "pContactName": $event.target.value, "pContacttype": '', "pReferenceId": '', "pContactId": '' }
   //let data={text: event.target.value, selected: false};
   // this._commonService._SetContactData(contactdata);
   if(this.contactForm.controls.pName.value!='')
   {
     this.showlastname=true;

   this.firstnamwithlastname=this.contactForm.controls.pName.value+' '+$event.target.value;
   this.lastnamwithfirstname=$event.target.value+' '+this.contactForm.controls.pName.value;
   }
   else
   {
     if($event.target.value!='')
     {
       this.showlastname=true;
     this.lastnamwithfirstname=$event.target.value;
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

 // binding saved details to the controls while editing
 loadEditDetails() {
   debugger;

   // let contactdata = { "pContactName": '', "pContacttype": '', "pReferenceId": '', "pContactId": '' }
   // this._commonService._SetContactData(contactdata);
    this.addressdeletedrows=[];
   if (this.formtype == 'Update' && this.contactType == 'Individual') {
    
     this.loading = true;
     this.readonlycontactdetails = true;
     this._contacmasterservice.getContactDetailsByID(this.referenceid).subscribe(json => {
       try {
         if (json != null) {
           this.contactForm.patchValue(json);
           console.log("edit details",json)
           debugger;
           let contactdata = { "pContactName": json.pName, "pContacttype": json.pContactType, "pReferenceId": '', "pContactId": json.pContactId }
           
           this.contactForm.controls.pguardianname.setValue(json.pguardianname);
           this.contactForm.controls.pguardianrelation.setValue(json.pguardianrelation);

            
           this.contactForm.controls.pEmailId.setValue(json.pBusinessEntityEmailid)
           this.contactForm.controls.pContactNumber.setValue(this.contactForm.controls.pBusinessEntityContactno.value);
           this.contactForm.controls.pContactId.setValue(this.contactForm.controls.pContactId.value);
           if (json.pName !='') {
             this.showfirstname=true;
             this.firstnamwithlastname=json.pName;
             //this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pName.value+' '+this.contactForm.controls.pSurName.value);
           }
           if (json.pSurName!='') {
             this.showlastname=true;
             this.lastnamwithfirstname=json.pSurName;
            // this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pSurName.value+' '+this.contactForm.controls.pName.value);
           }
           if (json.pName !='' && json.pSurName!='')
           {
             this.showlastname=true;
             this.showfirstname=true;
             this.firstnamwithlastname=json.pName+' '+json.pSurName;
             this.lastnamwithfirstname=json.pSurName+' '+json.pName;
           }
if(json.pContactName==this.firstnamwithlastname)
{
             this.contactForm.controls.pContactName.setValue('Firstname');

}
if(json.pContactName==this.lastnamwithfirstname)
{
            this.contactForm.controls.pContactName.setValue('Lastname');

}
debugger;
           this._commonService._SetContactData(contactdata);
           if (json.documentstorelist != null) {
             this._commonService._SetKYCUpdate(json.documentstorelist);
            // this.IdentificationDocuments.gridData=[];
           }
           else {
             this._commonService.GetContactDetailsforKYC(this.referenceid).subscribe(data => {
               this._commonService._SetKYCUpdate(data);
                console.log('setttedd kyc data:', data);
               
                //this.IdentificationDocuments.gridData=[];
             })
           }

           if (json.referralbankdetailslist != null) {
             this._commonService._SetBankUpdate(json.referralbankdetailslist);
              this.BankDetailsComponent.deletedBankDetails=[];
           }
           else {
             this._commonService._SetBankUpdate(json.referralbankdetailslist);
              this.BankDetailsComponent.deletedBankDetails=[];
           }
           this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
           this.contactType = json.pContactType;
           if (json.pcontactexistingstatus) {
             this.disablecontactname = true
           }
           else {
             this.disablecontactname = false;
           }

           if (json.pGender == 'M') {
             this.contactForm.controls.pGender.setValue("Male");

           }
           if (json.pGender == 'F') {
             this.contactForm.controls.pGender.setValue("Female");

           }
           if (json.pGender == 'T') {
             this.contactForm.controls.pGender.setValue("Third Gender");
           }
           if (json.pPhoto)
             this.croppedImage = "data:image/png;base64," + json.pPhoto;
           else
             this.croppedImage = this._defaultimage.GetdefaultImage();
           if (json.pDob != null && json.pDob != '') {
             let date = this._commonService.formatDateFromDDMMYYYY(json.pDob);
             this.contactForm['controls']['pDob'].setValue(date);
             this.contactForm.controls.pDob.setValue(date);

           }
           debugger;
           this.lstaddressdetails = json.pAddressList;
           let datatabledisplay = json.pAddressList.filter(function(loanname) {
             return loanname.pPriorityCon == true;
           });


           this.lstaddressdetails = json.pAddressList;
           if (this.lstaddressdetails.length > 0)
             debugger;
             this.contactForm['controls']['pAddressTypeChk'].setValue(datatabledisplay[0].pAddressType);
           if (json.pDob != null && json.pDob != '') {
             this.ageCalculation();
           }
          //  this.contactForm['controls']['pTitleName'].disable();
          //  this.contactForm['controls']['pName'].disable();
          //  this.contactForm['controls']['pSurName'].disable();
          //  this.contactForm['controls']['pFatherName'].disable();
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
     this.contactValidationErrors.pState=null;
     this.contactValidationErrors.pDistrict=null;
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
     this.contactValidationErrors.pDistrict=null;
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
 }
 // Address Type drop down change event
 pAddressType_Change($event: any): void {
   this.GetContactValidationByControl('pAddressType', true);
 }
 // Address priority  grid radio button event
 changeAddressPriority(index: number) {
   //console.log(this.contactForm.value)


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

 ageCalculation() 
 {
   debugger
   let age;
   //let dob = this.contactForm.controls.pDob.value;
   let dob = this.datePipe.transform(this.contactForm.controls.pDob.value, "yyyy-MM-dd");
   //let dob =Fromdate.;
   if (dob != '' && dob != null) {
     let currentdate = Date.now();
     //let agedate = new Date(dob);
     let agedate = new Date(dob).getTime();
     let timeDiff = Math.abs(currentdate - agedate);
     if (timeDiff.toString() != 'NaN')
       age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
     if (age >= 18) {
       debugger;
       this.contactForm['controls']['pAge'].setValue(age);
       this.isGuardian = false;

       this.contactForm.controls.pguardianname.clearValidators()
       this.contactForm.controls.pguardianname.updateValueAndValidity();

       this.contactForm.controls.pguardianrelation.clearValidators()
       this.contactForm.controls.pguardianrelation.updateValueAndValidity();
     }
     else {
      this.isGuardian = true;
      this.contactForm['controls']['pAge'].setValue(age);

       if(this.formtype != 'Update'){

       this.contactForm['controls']['pguardianname'].setValue('');
       this.contactForm['controls']['pguardianrelation'].setValue('');
      }
      this.contactForm.controls.pguardianname.setValidators(Validators.required);
    this.contactForm.controls.pguardianname.updateValueAndValidity();
    this.BlurEventAllControll(this.contactForm);

    this.contactForm.controls.pguardianrelation.setValidators(Validators.required);
    this.contactForm.controls.pguardianrelation.updateValueAndValidity();
    this.BlurEventAllControll(this.contactForm);

      this.getGurdianDetails("Contacts", 0, '')

      //  this._commonService.showWarningMessage("Sorry, only persons over the age of 18");
      //  this.contactForm['controls']['pDob'].setValue('');
      //  this.contactForm['controls']['pAge'].setValue('');

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
         if (this.lstaddressdetails[i].pAddressType === addresstype && i != this.addressindex) {
           count = 1;
           break;
         }
       }
       else {
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
         if (this.lstaddressdetails[i].pPriorityCon === true) {
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
   if (!this.validateFile(event.target.value)) {
    this._commonService.showWarningMessage("Upload jpg or png files");
    // this.contactForm['controls']['pPhoto'].setValue('');
    // this.contactForm['controls']['pContactimagepath'].setValue('');
    $('#upload').val('');
    this.croppedImage='';
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

     this._commonService.fileUploadinfolder('Documents',formData).subscribe(data => {
       debugger;
       this.FileName = data;
       if (this.imageResponse)
       this.croppedImage =  data[0];
        // this.croppedImage = "data:image/png;base64," + data[0];
        this._commonService.GetImage(data[0]).subscribe(res=>{
          console.log("imageresponse",res);
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
           this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
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
       this.lstaddressdetails=[...this.lstaddressdetails];
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
 // editing method for edit row from address details grid
 editAddressDeatails(index): void {
debugger;
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
 deleteAddressDeatails(row,index): void {

   try {
if(row.ptypeofoperation!='CREATE'){
    let deleterow:[]=row;
    this.addressdeletedrows=[...this.addressdeletedrows,...deleterow]
    this.addressdeletedrows=this.addressdeletedrows.filter(data=>data.ptypeofoperation='DELETE')
   
   }

     this.lstaddressdetails.splice(index, 1);
     this.lstaddressdetails=[...this.lstaddressdetails];
     this.addressTransType = 'Add';
     this.addressindex = 0;
     if (this.lstaddressdetails.length >= 1) {
       this.contactForm['controls']['pAddressTypeChk'].setValue(this.lstaddressdetails[0].pAddressType);
       this.lstaddressdetails[0].pPriorityCon = true;
        this.lstaddressdetails[0].pAddressPriority='PRIMARY';
        this.lstaddressdetails[0].ptypeofoperation = 'UPDATE';
        this.lstaddressdetails[0].pPriority='PRIMARY';
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
   this.contactForm['controls']['pAddressControls']['controls']['pCountryId'].setValue(null);
   this.contactForm['controls']['pAddressControls']['controls']['plongitude'].setValue('');
   this.contactForm['controls']['pAddressControls']['controls']['platitude'].setValue('');
   this.stateDetails = [];
   this.districtDetails = [];
   this.contactValidationErrors = {};
   this.addressTransType = 'Add';
   this.readonlyaddressdetals = false;
 }
 // save / update method for contact details from

//  saveContactDetails(): Observable<any> {
//    debugger;
//    this.disablesavebutton = true;
//    this.contactrefid = 0;
//    this.savebutton = "Processing";
//    try {
//      this.contactSubmitted = true;
//      debugger;
//      this._commonService._GetKYCData().subscribe(data => {
//        debugger;
//        let kycdetails=[];
//        kycdetails=data;
//        if(this.IdentificationDocuments.gridData.length>0){
//          if(kycdetails==null){
//            kycdetails=[];
//          }
//          if(kycdetails.length>0){
//            kycdetails=[...kycdetails,...this.IdentificationDocuments.gridData];
//          }
//          else{
//             kycdetails=[...this.IdentificationDocuments.gridData];
//          }
//           this.IdentificationDocuments.gridData=[];
//        }
//                this.contactForm.controls.documentstorelist.setValue(kycdetails);
//        // this.contactForm.controls.documentstorelist.setValue(data);
//      });
    
//      this.contactForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
//      this.contactForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
//      //this.contactForm['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);

//      if (this.contactForm.controls.pAge.value == null || this.contactForm.controls.pAge.value == '') {
//        this.contactForm['controls']['pAge'].setValue(0);
//      }
//      this.contactForm['controls']['pTitleName'].setValue(this.contactForm.controls.pTitleName.value);
//      this.contactForm['controls']['pReferenceId'].setValue(this.referenceid);
//      this.contactForm['controls']['pContactType'].setValue(this.contactType);
//      this.contactForm['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);
//      this.contactForm['controls']['pAlternativeNo'].setValue(this.contactForm.controls.pAlternativeNo.value);
//      this.contactForm['controls']['pEmailId'].setValue(this.contactForm.controls.pEmailId.value);
//      this.contactForm['controls']['pEmailId2'].setValue(this.contactForm.controls.pEmailId2.value);
//      this.contactForm['controls']['pContactName'].setValue(this.contactForm.controls.pContactName.value);
//      // this.contactForm['controls']['pcontactmailingname'].setValue(this.contactForm.controls.pName + ' ' + this.contactForm.controls.pSurName);
//      this.contactForm['controls']['pBusinessEntityEmailid'].setValue(this.contactForm.controls.pEmailId.value);
//      this.contactForm['controls']['pBusinessEntityContactno'].setValue(this.contactForm.controls.pContactNumber.value);
//      if(this.contactForm.controls.pContactNumber.value==''|| this.contactForm.controls.pName.value==''){
//       this._commonService.showWarningMessage('Enter Personal  Details');
//       return;
//      }
     
//      // for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++){

//      // this.contactForm
//      //   debugger;
//      // const bankcontrols = <FormArray>this.BankDetailsComponent.BankForm['controls']['pAddressList'];
//      // bankcontrols.pus
//      // }

//      if (this.validateSaveDeatails(this.contactForm)) {
//        debugger;
//  if (this.contactForm.controls.pGender.value == "Male") {
//        this.contactForm.controls.pGender.setValue("M");
//      }

     
//      if (this.contactForm.controls.pGender.value == "Female") {
//        this.contactForm.controls.pGender.setValue("F");
//      }
//      if (this.contactForm.controls.pGender.value == "Third Gender") {
//        this.contactForm.controls.pGender.setValue("T");
//      }

//      this.gender=this.contactForm.controls.pGender.value;
     
//      this.contactname=this.contactForm.controls.pContactName.value
//      if (this.contactForm.controls.pContactName.value == "Firstname") {
//        this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pName.value+' '+this.contactForm.controls.pSurName.value);
//      }
//      if (this.contactForm.controls.pContactName.value == "Lastname") {
//        this.contactForm.controls.pContactName.setValue(this.contactForm.controls.pSurName.value+' '+this.contactForm.controls.pName.value);
//      }
//      //adding deleted bank details

//        if(this.BankDetailsComponent.deletedBankDetails.length>0){
//          if( this.BankDetailsComponent.bankdetailslist.length>0){
//             this.BankDetailsComponent.bankdetailslist=[...this.BankDetailsComponent.bankdetailslist,...this.BankDetailsComponent.deletedBankDetails];
//          }
//          else{
//             this.BankDetailsComponent.bankdetailslist=[...this.BankDetailsComponent.deletedBankDetails];
//          }
//          this.BankDetailsComponent.deletedBankDetails=[];
//        }

//        for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++) {
//          const bankcontrol = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
//          bankcontrol.push(this.addBankcontrlos());
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['precordid'].setValue(this.BankDetailsComponent.bankdetailslist[i].precordid);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankId'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankId);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankName'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankName);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankAccountNo'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankAccountNo);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankifscCode'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankifscCode);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankBranch'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankBranch);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pIsprimaryAccount'].setValue(this.BankDetailsComponent.bankdetailslist[i].pIsprimaryAccount);
//          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['ptypeofoperation'].setValue(this.BankDetailsComponent.bankdetailslist[i].ptypeofoperation);

//        }
//        //removing empty records
//         let bankdetails= [];
//        bankdetails=this.contactForm['controls']['referralbankdetailslist'].value;
//        if(bankdetails!=null){
//            if(bankdetails.length>0){
//                bankdetails=bankdetails.filter(row=>row.pBankId!='');
//             }
//          }
//         this.contactForm['controls']['referralbankdetailslist'].setValue(bankdetails);

// //adding deleted address details
//         if(this.addressdeletedrows.length>0){
//        if(this.lstaddressdetails.length>0){
//    this.lstaddressdetails=[...this.lstaddressdetails,...this.addressdeletedrows];
//  }
//  else{
//    this.lstaddressdetails=[...this.addressdeletedrows];
//  }
//  this.addressdeletedrows=[];
// }
//        for (let i = 0; i < this.lstaddressdetails.length; i++) {
//          const addresscontrol = <FormArray>this.contactForm['controls']['pAddressList'];
//          addresscontrol.push(this.addAddressControls());
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressType'].setValue(this.lstaddressdetails[i].pAddressType);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress1'].setValue(this.lstaddressdetails[i].pAddress1);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress2'].setValue(this.lstaddressdetails[i].pAddress2);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pState'].setValue(this.lstaddressdetails[i].pState);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStateId'].setValue(this.lstaddressdetails[i].pStateId);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrict'].setValue(this.lstaddressdetails[i].pDistrict);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrictId'].setValue(this.lstaddressdetails[i].pDistrictId);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCity'].setValue(this.lstaddressdetails[i].pCity);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountry'].setValue(this.lstaddressdetails[i].pCountry);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStatusname'].setValue(this.lstaddressdetails[i].pStatusname);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountryId'].setValue(this.lstaddressdetails[i].pCountryId);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPinCode'].setValue(this.lstaddressdetails[i].pPinCode);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['plongitude'].setValue(this.lstaddressdetails[i].plongitude);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['platitude'].setValue(this.lstaddressdetails[i].platitude);
//          if (this.lstaddressdetails[i].pPriorityCon == true) {
//            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriorityCon'].setValue(true);
//            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressPriority'].setValue('PRIMARY');
//            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('PRIMARY');
//          }
//          else {
//            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriorityCon'].setValue(false);
//            this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressPriority'].setValue('');
//             this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPriority'].setValue('');
//          }
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['ptypeofoperation'].setValue(this.lstaddressdetails[i].ptypeofoperation);
//          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pRecordId'].setValue(this.lstaddressdetails[i].pRecordId);
//        }
//        //  let lstRelatedPartysDTO = { lstRelatedPartysDTO: this.lstRelatedPartysDTO}
//        //    let formdata = Object.assign(this.contactForm.value)
//        //     console.log(formdata);
       
//        // if(this.contactForm['controls'].documentstorelist==null)
//        // {
//        //     this.documentstorelist=[];
//        // }
//        // if(this.contactForm['controls'].referralbankdetailslist==null)
//        // {
//        //     this.referralbankdetailslist=[];
//        // }
//        // documentstorelist: ""
//        // referralbankdetailslist: ""
//        let documentDetailsList =this.contactForm.controls.documentstorelist.value;
//        if(documentDetailsList!=null){
//           documentDetailsList=documentDetailsList.filter(row=>row.pDocumentName!=null && row.pDocumentName!="" && row.pDocumentName!='');
//        this.contactForm.controls.documentstorelist.setValue(documentDetailsList);
//        }

//        let data = JSON.stringify(this.contactForm.value)
//        console.log("contact-new data",data)
//        debugger;
//        const addressControl = <FormArray>this.contactForm.controls['pAddressList'];
//        for (let i = addressControl.length - 1; i >= 0; i--) {
//          addressControl.removeAt(i)
//        }
//        let count = 0;
//              if (confirm("Do you want to save ?")) {

//                debugger
//        // checking contact details existed or not if existed retun  Contact already exists other wise will go to save method
//        this._contacmasterservice.checkContactIndividual(data).subscribe(res => {
//         //  if (res > 0) 
//         //  {
//         //    debugger
//         //    this.disablesavebutton = false;
//         //    this.savebutton = "Submit";
//         //    count = 1;
//         //    this._commonService.showWarningMessage('Contact already exists');
//         //    this.gender=this.gender=='M'?'Male':this.gender=='F'?'Female':this.gender=='T'?'Third Gender':"";
//         //    this.contactForm['controls']['pGender'].setValue(this.gender)
//         //    //this.contactForm.controls.pGender.value;
//         //  this.contactForm['controls']['pContactName'].setValue(this.contactname); 
//         //  }
//          //else if (res == 0) {
//            debugger;
//            this._contacmasterservice.saveContactIndividual(data, this.formtype).subscribe(res => {
//              debugger;
//              this.disablesavebutton = false;
//              this.savebutton = "Submit";
             
//              if (res[0] == 'TRUE') {
              
//                if (this.ContactMore == true) {
//                  let contactTypeForTabDisable=this.contactType;
//                  this.clearContactFormDeatails();
                 
//                  // this.JSONdataItem = res;
//                  //  this.returnedData.emit(res);
//                this._routes.navigate(['/ContactMore'], { queryParams: { ID: res[1],name:"employee",contacttype :contactTypeForTabDisable } })

//                }
//                else {
//                  if (this.formtype == 'Save')
//                    this._commonService.showInfoMessage("Saved sucessfully");
//                  else
//                    this._commonService.showInfoMessage("Updated sucessfully");
//                  this.clearContactFormDeatails();
//                  this._routes.navigate(['/contactView']);

//                }

//              }
//              else {
//                if (this.formtype == 'Save')
//                  this.toastr.error("Error while saving");
//                else
//                  this.toastr.error("Error while updating");
//              }
//            },
//              (error) => {
//                this.disablesavebutton = false;
//                this.savebutton = "Submit";
//                this.toastr.error(error);
//              });
//          //}
//        },
//          (error) => {
//            this.disablesavebutton = false;
//            this.savebutton = "Submit";
//            this.toastr.error(error);
          
//          });
//        }
//      }
//      else {
//        this.disablesavebutton = false;
//        this.savebutton = "Submit";
//      }

//    }
//    catch (e) {
//      this.showErrorMessage(e);
//    }
   
//    return this.JSONdataItem;
//  }

  saveContactDetails(): Observable<any> {
    debugger;
    this.disablesavebutton = true;
    this.contactrefid = 0;
    this.savebutton = "Processing";
    try {
      this.contactSubmitted = true;
      debugger;
      this._commonService._GetKYCData().subscribe(data => {
        debugger;
        let kycdetails = [];
        kycdetails = data;
        if (this.IdentificationDocuments.gridData.length > 0) {
          if (kycdetails == null) {
            kycdetails = [];
          }
          if (kycdetails.length > 0) {
            kycdetails = [...kycdetails, ...this.IdentificationDocuments.gridData];
          }
          else {
            kycdetails = [...this.IdentificationDocuments.gridData];
          }
          this.IdentificationDocuments.gridData = [];
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
      this.contactForm['controls']['pContactType'].setValue(this.contactType);
      this.contactForm['controls']['pContactNumber'].setValue(this.contactForm.controls.pContactNumber.value);
      this.contactForm['controls']['pAlternativeNo'].setValue(this.contactForm.controls.pAlternativeNo.value);
      this.contactForm['controls']['pEmailId'].setValue(this.contactForm.controls.pEmailId.value);
      this.contactForm['controls']['pEmailId2'].setValue(this.contactForm.controls.pEmailId2.value);
      this.contactForm['controls']['pContactName'].setValue(this.contactForm.controls.pContactName.value);
      // this.contactForm['controls']['pcontactmailingname'].setValue(this.contactForm.controls.pName + ' ' + this.contactForm.controls.pSurName);
      this.contactForm['controls']['pBusinessEntityEmailid'].setValue(this.contactForm.controls.pEmailId.value);
      this.contactForm['controls']['pBusinessEntityContactno'].setValue(this.contactForm.controls.pContactNumber.value);
      if (this.contactForm.controls.pContactNumber.value == '' || this.contactForm.controls.pName.value == '') {
        this._commonService.showWarningMessage('Enter Personal  Details');
        return;
      }

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

        for (let i = 0; i < this.BankDetailsComponent.bankdetailslist.length; i++) {
          const bankcontrol = <FormArray>this.contactForm['controls']['referralbankdetailslist'];
          bankcontrol.push(this.addBankcontrlos());
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['precordid'].setValue(this.BankDetailsComponent.bankdetailslist[i].precordid);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankId'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankId);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankName'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankName);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankAccountNo'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankAccountNo);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankifscCode'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankifscCode);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pBankBranch'].setValue(this.BankDetailsComponent.bankdetailslist[i].pBankBranch);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['pIsprimaryAccount'].setValue(this.BankDetailsComponent.bankdetailslist[i].pIsprimaryAccount);
          this.contactForm['controls']['referralbankdetailslist']['controls'][i]['controls']['ptypeofoperation'].setValue(this.BankDetailsComponent.bankdetailslist[i].ptypeofoperation);

        }
        //removing empty records
        let bankdetails = [];
        bankdetails = this.contactForm['controls']['referralbankdetailslist'].value;
        if (bankdetails != null) {
          if (bankdetails.length > 0) {
            bankdetails = bankdetails.filter(row => row.pBankId != '');
          }
        }
        this.contactForm['controls']['referralbankdetailslist'].setValue(bankdetails);

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
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddressType'].setValue(this.lstaddressdetails[i].pAddressType);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress1'].setValue(this.lstaddressdetails[i].pAddress1);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pAddress2'].setValue(this.lstaddressdetails[i].pAddress2);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pState'].setValue(this.lstaddressdetails[i].pState);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStateId'].setValue(this.lstaddressdetails[i].pStateId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrict'].setValue(this.lstaddressdetails[i].pDistrict);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pDistrictId'].setValue(this.lstaddressdetails[i].pDistrictId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCity'].setValue(this.lstaddressdetails[i].pCity);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountry'].setValue(this.lstaddressdetails[i].pCountry);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pStatusname'].setValue(this.lstaddressdetails[i].pStatusname);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pCountryId'].setValue(this.lstaddressdetails[i].pCountryId);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['pPinCode'].setValue(this.lstaddressdetails[i].pPinCode);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['plongitude'].setValue(this.lstaddressdetails[i].plongitude);
          this.contactForm['controls']['pAddressList']['controls'][i]['controls']['platitude'].setValue(this.lstaddressdetails[i].platitude);
          if (this.lstaddressdetails[i].pPriorityCon == true) {
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
        this.kyclist = documentDetailsList
        if (documentDetailsList != null) {
          documentDetailsList = documentDetailsList.filter(row => row.pDocumentName != null && row.pDocumentName != "" && row.pDocumentName != '');
          this.contactForm.controls.documentstorelist.setValue(documentDetailsList);
        }

        let data = JSON.stringify(this.contactForm.value)
        console.log("contact-new data", data)
        debugger;
        const addressControl = <FormArray>this.contactForm.controls['pAddressList'];
        for (let i = addressControl.length - 1; i >= 0; i--) {
          addressControl.removeAt(i)
        }
        let count = 0;

        //bhargavi
        if (this.kyclist && this.kyclist.length > 0) {
          // if(this.kyclist.pDocumentName === 'Aadhaar'){
          let hasAadhaar = this.kyclist.some(doc => doc.pDocumentName === 'Aadhaar');

          if (hasAadhaar) {
            
            if (confirm("Do you want to save ?")) {
              debugger;

              //this.isEmployee = true;

              // if (!this.isEmployee) {
              //   this.isEmployee = true;
              //   return;
              // }

              // if (!this.contactForm.controls.pEmployee.value) {
              //   this._commonService.showWarningMessage('Please select whether you are an employee or not.');
              //   return;
              // }

              // if (this.contactForm.controls.pEmployee.value === 'Yes') {
              //   this._routes.navigate(['/ContactMore'], { queryParams: { ID: 0, name: 'employee', contacttype: this.contactType } });
              //   return;
              // }

              // if (this.contactForm.controls.pEmployee.value === 'No') {
              // checking contact details existed or not if existed return  Contact already exists other wise will go to save method
              this._contacmasterservice.checkContactIndividual(data).subscribe(res => {
                //  if (res > 0) 
                //  {
                //    debugger
                //    this.disablesavebutton = false;
                //    this.savebutton = "Submit";
                //    count = 1;
                //    this._commonService.showWarningMessage('Contact already exists');
                //    this.gender=this.gender=='M'?'Male':this.gender=='F'?'Female':this.gender=='T'?'Third Gender':"";
                //    this.contactForm['controls']['pGender'].setValue(this.gender)
                //    //this.contactForm.controls.pGender.value;
                //  this.contactForm['controls']['pContactName'].setValue(this.contactname); 
                //  }
                //else if (res == 0) {
                debugger;
                this._contacmasterservice.saveContactIndividual(data, this.formtype).subscribe(res => {
                  debugger;
                  this.disablesavebutton = false;
                  this.savebutton = "Submit";

                  if (res[0] == 'TRUE') {

                    // if (this.ContactMore == true) {
                    //   let contactTypeForTabDisable = this.contactType;
                    //   this.clearContactFormDeatails();

                    //   // this.JSONdataItem = res;
                    //   //  this.returnedData.emit(res);
                    //   this._routes.navigate(['/ContactMore'], { queryParams: { ID: res[1], name: "employee", contacttype: contactTypeForTabDisable } })

                    // }
                    // else {
                    if (this.formtype == 'Save')
                      this._commonService.showInfoMessage("Saved sucessfully");
                    else
                      this._commonService.showInfoMessage("Updated sucessfully");
                    this.clearContactFormDeatails();
                    this._routes.navigate(['/contactView']);

                    // }

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
                //}
              },
                (error) => {
                  this.disablesavebutton = false;
                  this.savebutton = "Submit";
                  this.toastr.error(error);

                });
           // }
          }


        }
        else {
          // alert('please enter aadhar')
          this._commonService.showWarningMessage('please enter Aadhaar')
        }
      }


      else {
        // alert('kyc is not enterd')
        this._commonService.showWarningMessage('please enter KYC Documents')

      }
      //bhargavi end
    }
      else {
      this.disablesavebutton = false;
      this.savebutton = "Submit";
    }

  }
  catch(e) {
    this.showErrorMessage(e);
  }

    return this.JSONdataItem;
  }

 // clear all form controls
 clearContactFormDeatails(): void {
   this.contactForm.reset();
   this.emitevent.emit()
    this.addressdeletedrows=[];
   this.lstaddressdetails = [];
   this.contactForm['controls']['pTitleName'].setValue(null);
   this.contactForm['controls']['pGender'].setValue('Male');
   this.contactForm['controls']['pContactName'].setValue('Firstname');   
   this.contactForm['controls']['pContactId'].setValue(0);
   this.contactForm['controls']['pSurName'].setValue(""); 
   this.showfirstname=false;
   this.showlastname=false;
   this.firstnamwithlastname='';
   this.lastnamwithfirstname='';
   this.clearAddressDeatails();
   this.BankDetailsComponent.bankdetailslist = [];
   this.IdentificationDocuments.gridData = [];
   this.IdentificationDocuments.gridData=[];
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
 clearAddressTypemodal(): void {
  this.addresstypeForm.reset();
  this.addressTypeErrorMessage = {};
}
 clearAddressType(): void 
 {
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
   pAlternativeNo: ['',Validators.minLength(10)],
   pRecordId: [''],
   pRecordId1: [''],
   pContactId:[0],
   pAddressPriority: [''],
   pPriority:[''],
   pguardianname:[''],
   pguardianrelation:[''],
   pguardiancontactid:[0],
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
 addressTypemodal(){
   debugger
   this.addresstypeForm.controls.pAddressType.setValue('');
   let x=this.latitude;
 }
 Pincode(){
  debugger;
  
  const control = <FormGroup>this.contactForm['controls']['pAddressControls'];
 let PinCode= control.controls.pPinCode.value;
 if(PinCode.length==6){
  let addres=control.controls.pAddress2.value
  + "," + control.controls.pCity.value + "," + control.controls.pState.value
  + "," + control.controls.pCountry.value + "," +  control.controls.pPinCode.value
 this.getLatitudeLongitude(addres);
 }
 else{
  this.longitude='';
  this.latitude='';
  this.contactForm['controls']['pAddressControls']['controls']['plongitude'].setValue(this.longitude);
  this.contactForm['controls']['pAddressControls']['controls']['platitude'].setValue(this.latitude);
  this.map = { lat: this.latitude, lng: this.longitude };
 }
 
}
getLatitudeLongitude(addres) {
 this.map = [];
  let self = this;  
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+addres+'&key=',
    type: "GET",
    dataType: 'json',
     async: false,
    success: function(data){ 
      var results = data.results;
 self.map=results[0].geometry.location;
    }
  });
let longitudeandlatitudedata=self.map;
this.longitude=longitudeandlatitudedata.lng;
this.latitude=longitudeandlatitudedata.lat;
this.contactForm['controls']['pAddressControls']['controls']['plongitude'].setValue(this.longitude);
this.contactForm['controls']['pAddressControls']['controls']['platitude'].setValue(this.latitude);
this.map = { lat: this.latitude, lng: this.longitude };
 
}
//TargetReport
//"Contacts", this.offsetp, ''



getGurdianDetails(Contacts, pageno, searchby) {
  this._contacmasterservice.GetContactDetailsListIndex(Contacts, pageno, searchby).subscribe(result => {
    debugger;
    this.guardianListData = result;
    //console.log("details", this.guardianListData)

    this.RelationshipData = this._commonService.GetRelationshipData();
    console.log("details", this.RelationshipData);    
  })
}

guardianChange(event){
  debugger;
  this.contactForm.controls.pguardiancontactid.setValue(event.pContactdId)
}
}


