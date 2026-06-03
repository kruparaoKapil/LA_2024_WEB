import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeDetailsComponent } from 'src/app/UI/Common/employee-details/employee-details.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { CommonService } from 'src/app/Services/common.service';
import { EmployeeDetailsNewComponent } from 'src/app/UI/Common/employee-details/employee-details-new.component';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { DatePipe } from '@angular/common';
declare let $: any
@Component({
  selector: 'app-contact-more',
  templateUrl: './contact-more.component.html',
  styles: []
})
export class ContactMoreComponent implements OnInit {
  @ViewChild(EmployeeDetailsNewComponent, { static: false }) employeeDetails: EmployeeDetailsNewComponent;
  contactMoreForm: FormGroup;
  ID: string;
  contactValidationErrors: any;
    contacttype:any;
  tabstatus:boolean=false;
  name:string;
  MobileNo: string;
  imageResponse: any;
  kycFilePath: any;
  kycFileName: any;
  IntroducerList: any = [];
  TDSsectiondetails: any;
  Name: string;
  ContactData: any
  isshowpanno = false;
  croppedImage: any
  DisplayCardData: any
  ShowImageCard: Boolean
  public isLoading: boolean = false;
  formEntryType = "Contact";
  contactId=0;
  panno:string;
  // istrue=false;
  savebutton = "Save";
  buttonEmployeeName = "Save";
  disablesavesupplierbutton = false;
  savebuttonsupplier = "Save";
  disablesaveadvocatebutton = false;
  btnsaveadvocate = "Save";
  disablesavebutton = false;
  nopan: boolean = false;
  isshowUploadDocument = false;
  referraltaxdetailslist: [];
  patternname: string;
  isshowpannocheckbox=false
  constructor(private dataRoute: ActivatedRoute,private router:Router, private _contacmasterservice: ContacmasterService, private formbuilder: FormBuilder, private _commonService: CommonService, private _routes: Router, private _defaultimage: DefaultProfileImageService, private _TdsService: TdsdetailsService,private datePipe: DatePipe) { }

  ngOnInit()
   {
    debugger;
    
    // this.croppedImage = "assets/images/user.svg"
    this.contactValidationErrors = [];

     this.dataRoute
       .queryParams
       .subscribe(params => {
                  this.ID = params['ID'];
           this.name=params['name'];
       this.contacttype=params['contacttype'];
       });
       this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
         if(this.contacttype=='Individual'){
         this.tabstatus=false;
         if(this.name=='refferral'){
              this.name='refferral';
         }

         else if(this.name=='supplier'){
          this.name ='supplier'
         }
         else{
            this.name='employee';
         }
       
       }
       else{
          this.tabstatus=true;
            this.name='refferral';
       }
     // this._commonService._GetTDSData().subscribe(data => {
     //   debugger;
     //   this.contactMoreForm.controls.referraltaxdetailslist.setValue(data);
     // });


 if(this.name!=null)
 {
     this.tabsClick(this.name);
 }
     this.contactMoreForm = this.formbuilder.group({
       //schemaid: [this._commonService.pschemaname],
       //schemaname: ['schemaname'],
       //samebranchcode: [this._commonService.pschemaname],
          pipaddress: [sessionStorage.getItem("ipaddress")],
             pCreatedby: [this._commonService.pCreatedby],
       pContactId: [''],
       // pIsSupplier:false,
       pIsPanNoAvailable: false,
       pDocumentName: [''],
       pFilename: [''],
       pDocStorePath: [''],
       check:[''],
       pPanNumber: ['',Validators.pattern(this.patternname)],
       introducedname:['Direct'],
       introducedid: [0,Validators.required],
       ptdsSectionName: ['',Validators.required],
     })
     this.loaddetails();
     this.getTDSsectiondetails();
    //  this.contactMoreForm.controls.pPanNumber.setValidators([Validators.required,Validators.pattern(this.patternname)]);
    //  this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
     this.BlurEventAllControll(this.contactMoreForm);

  }



  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
}
showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
}
  BlurEventAllControll(fromgroup: FormGroup) {
    debugger;
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {


        this.setBlurEvent(key);




      })
    }
    catch (e) {
        this.showErrorMessage(e);
        return false;
    }
}
checkContactValidations(group: FormGroup, isValid: boolean): boolean {

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

      formcontrol = this.contactMoreForm.get(key);

      if (formcontrol) {
          if (formcontrol instanceof FormGroup) {


                  this.checkContactValidations(formcontrol, isValid)
          }
          else if (formcontrol.validator) {
              this.contactValidationErrors[key] = '';
              if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                  let lablename;



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
     // this.disablesavebutton = false;
     // this.savebutton = "Submit";
      this.showErrorMessage(e);
      return false;
  }
  return isValid;
}
Introducer_Change($event: any) {
  debugger;
  try {
    if ($event) {
      this.contactMoreForm.controls.introducedid.setValue($event.introducedid);
      this.contactMoreForm.controls.introducedname.setValue($event.introducedname);
    }
  }
  catch (error) {
   // this._commonService.exceptionHandlingMessages('referral', 'introducer_Change', error);

    return false;
  }
}
setBlurEvent(key: string) {

    try {
        let formcontrol;
        formcontrol = this.contactMoreForm.get(key);
        if (formcontrol) {
            if (formcontrol instanceof FormGroup) {
                this.BlurEventAllControll(formcontrol)
            }
            else {
                if (formcontrol.validator)
                    this.contactMoreForm.get(key).valueChanges.subscribe((data) => { this.GetContactValidationByControl(key, true) })
            }
        }

    }
    catch (e) {
        this.showErrorMessage(e);
        return false;
    }
}
  loaddetails() {
    this._contacmasterservice.getIntoducerDetails().subscribe(data => {
      debugger;
      this.IntroducerList = data;
if(data==''){}
    });
    debugger;
    //this._contacmasterservice.getContactDetailsMoreByID(this.ID).subscribe(json => {

    this._contacmasterservice.getContactDetailsrefid(this.ID).subscribe(json => {
      if (json.pPhoto != '' && json.pPhoto != null)
      this.croppedImage = "data:image/png;base64," + json.pPhoto;
      else
                             this.croppedImage = this._defaultimage.GetdefaultImage();


      // this.Name = json.pName + ' ' + json.pSurName;
      this.Name = json.pContactName;
      this.MobileNo = json.pContactNumber;
      debugger;
      this.DisplayCardData = json;
     // alert(json.pContactimagepath);
      // if (json.pIsPanNoAvailable == true) {
      //   this.isshowpanno = true;
      //   // this.istrue=true;
      //   this.contactMoreForm.controls.pIsPanNoAvailable.setValue(json.pIsPanNoAvailable);
      //   let pan = json.pPanNumber.substr(-4, 4);
      //   this.contactMoreForm.controls.pPanNumber.setValue('XXXXXX' + pan);

      // }
      // else {
      //   this.isshowpanno = false;
      //   // this.istrue=false;
      // }

      // if (this.DisplayCardData.pContactimagepath == "") {
      //   this.croppedImage = this._defaultimage.GetdefaultImage()

      // }
      // else {
      //   this._commonService.ConvertImagepathtobase64(this.DisplayCardData.pContactimagepath).subscribe(imagepath => {
      //     this.croppedImage = "data:image/png;base64," + imagepath;

      //   }
      //    )
      //  }

    });
  }
  onFilterChangeSupplier(eve: any) {

    if (eve.target.checked == true) {
      this.contactMoreForm.controls.pIsSupplier.setValue(true);
    }
    else {
      this.contactMoreForm.controls.pIsSupplier.setValue(false);

    }

  }
  tabsClick(tabname) {
    debugger;
    //if (tabname == 'subscriber') {
    //  $('.nav-item a[href="#subscriber"]').tab('show');

    //}
    if (tabname == 'employee') {
      $('.nav-item a[href="#employee"]').tab('show');
      this._contacmasterservice.getContactDetailsEmployeeByID(this.ID).subscribe(json => {

        if(json!=null)
        {
          debugger;
          if(json.precordid==null)
          {
            this.buttonEmployeeName="Save";
            this.employeeDetails.buttonName="Save";
          }
          else
          {
            this.buttonEmployeeName="Update";
            this.employeeDetails.buttonName="Update";

          }
         // this.employeeDetails.contactEmployeeForm.controls.precordid.setValue(0);
         // this.employeeDetails.contactEmployeeForm.controls.pschemaname.setValue(this.contactMoreForm.controls.pschemaname.value);
         // this.employeeDetails.contactEmployeeForm.controls.schemaid.setValue(this.contactMoreForm.controls.schemaid.value);
         // this.employeeDetails.contactEmployeeForm.controls.samebranchcode.setValue(this.contactMoreForm.controls.samebranchcode.value);


          this.employeeDetails.contactEmployeeForm.controls.pEmploymentBasicSalary.setValue(this._commonService.currencyformat(json.pEmploymentBasicSalary));
          this.employeeDetails.contactEmployeeForm.controls.pEmploymentAllowanceORvda.setValue(this._commonService.currencyformat(json.pEmploymentAllowanceORvda));
          this.employeeDetails.contactEmployeeForm.controls.pEmploymentCTC.setValue(json.pEmploymentCTC);
          if(json.pEmploymentJoiningDate!='' && json.pEmploymentJoiningDate!=undefined)
          {
          this.employeeDetails.contactEmployeeForm.controls.pEmploymentJoiningDate.setValue(this._commonService.formatDateFromDDMMYYYY(json.pEmploymentJoiningDate));
          }
          this.employeeDetails.ctcCalculation();



          this.employeeDetails.contactEmployeeForm.controls.mdesignationid.setValue(parseInt(json.mdesignationid));
          this.employeeDetails.contactEmployeeForm.controls.mdesignationname.setValue(json.mdesignationname);

          this.employeeDetails.contactEmployeeForm.controls.pEmploymentRoleId.setValue(parseInt(json.pEmploymentRoleId));
          this.employeeDetails.contactEmployeeForm.controls.pEmploymentRoleName.setValue(json.pEmploymentRoleName);


          this.employeeDetails.contactEmployeeForm.controls.pCountryId.setValue(json.pCountryId);

          if(json.presidentialstatus=='R')
          {
            this.employeeDetails.contactEmployeeForm.controls.presidentialstatus.setValue('Resident');

          }
          if(json.presidentialstatus=='N')
          {
            this.employeeDetails.contactEmployeeForm.controls.presidentialstatus.setValue('Non-Resident');

          }
          if(json.presidentialstatus=='F')
          {
            this.employeeDetails.contactEmployeeForm.controls.presidentialstatus.setValue('Foreign National');

          }
          if(json.presidentialstatus=='P')
          {
            this.employeeDetails.contactEmployeeForm.controls.presidentialstatus.setValue('Person Of Indian Origin');

          }
         // this.employeeDetails.contactEmployeeForm.controls.presidentialstatus.setValue(json.presidentialstatus);
          this.employeeDetails.contactEmployeeForm.controls.pplaceofbirth.setValue(json.pplaceofbirth);
          this.employeeDetails.contactEmployeeForm.controls.pnationality.setValue(json.pnationality);

          this.employeeDetails.contactEmployeeForm.controls.pminoritycommunity.setValue(json.pminoritycommunity);
if(json.pmaritalstatus=='Ma')
{
  this.employeeDetails.contactEmployeeForm.controls.pmaritalstatus.setValue('Married');

}
if(json.pmaritalstatus=='Si')
{
  this.employeeDetails.contactEmployeeForm.controls.pmaritalstatus.setValue('Single');

}
if(json.pmaritalstatus=='Se')
{
  this.employeeDetails.contactEmployeeForm.controls.pmaritalstatus.setValue('Separated');

}
if(json.pmaritalstatus=='Wi')
{
  this.employeeDetails.contactEmployeeForm.controls.pmaritalstatus.setValue('Widowed');

}

          this.employeeDetails.contactEmployeeForm.controls.pkhcno.setValue(json.pkhcno);

          if(json.pisesi==true)
          {
            this.employeeDetails.showesi=true;
this.employeeDetails.contactEmployeeForm.controls.pisesi.setValue(true);
this.employeeDetails.contactEmployeeForm.controls.pesino.setValue(json.pesino);

          }
          else
          {
            this.employeeDetails.showesi=false;
            this.employeeDetails.contactEmployeeForm.controls.pisesi.setValue(false);
          }
          if(json.pispf==true)
          {
            this.employeeDetails.showpf=true;
            this.employeeDetails.contactEmployeeForm.controls.pispf.setValue(true);
          this.employeeDetails.contactEmployeeForm.controls.ppfno.setValue(json.ppfno);

          }
          else{
            this.employeeDetails.showpf=false;
            this.employeeDetails.contactEmployeeForm.controls.pispf.setValue(false);
          }


//           this.employeeDetails.contactEmployeeForm.controls.ppassportno.setValue(json.ppassportno);
//           this.employeeDetails.contactEmployeeForm.controls.ppancardno.setValue(json.ppancardno);
//           this.employeeDetails.contactEmployeeForm.controls.pdrivinglicienceno.setValue(json.pdrivinglicienceno);
//           this.employeeDetails.contactEmployeeForm.controls.pdepartment.setValue(json.pdepartment);
// if(json.pdateofreporting!='')
// {
//          this.employeeDetails.contactEmployeeForm.controls.pdateofreporting.setValue(this._commonService.formatDateFromDDMMYYYY(json.pdateofreporting));
// }
// if(json.pjoindate!='')
// {
//           this.employeeDetails.contactEmployeeForm.controls.pjoindate.setValue(this._commonService.formatDateFromDDMMYYYY(json.pjoindate));
// }
// if(json.pjoinedasid!='')
//           {
//           this.employeeDetails.contactEmployeeForm.controls.pjoinedasid.setValue(parseInt(json.pjoinedasid));
//           }
//           if(json.ppreviouesearnedleavesdate!='')
//           {
//           this.employeeDetails.contactEmployeeForm.controls.ppreviouesearnedleavesdate.setValue(this._commonService.formatDateFromDDMMYYYY(json.ppreviouesearnedleavesdate));
//           }
//           if(json.pBranchId!='')
//           {
//           this.employeeDetails.contactEmployeeForm.controls.pBranchId.setValue(parseInt(json.pBranchId));
//           }
//           if(json.pishandicaped==true)
//           {
//             this.employeeDetails.showhealthproblems=true;
//             this.employeeDetails.contactEmployeeForm.controls.pishandicaped.setValue(true);
//             this.employeeDetails.contactEmployeeForm.controls.phealthproblems.setValue(json.phealthproblems);
//           }
//           else
//           {
//             this.employeeDetails.showhealthproblems=false;
//             this.employeeDetails.contactEmployeeForm.controls.pishandicaped.setValue(false);
//           }
//           this.employeeDetails.contactEmployeeForm.controls.pdisciplinaryactions.setValue(json.pdisciplinaryactions);
//           this.employeeDetails.contactEmployeeForm.controls.pextracurricularactivities.setValue(json.pextracurricularactivities);
          if(json.plstemployess!=null)
          {
            // debugger;
            // for (let i = 0; i < json.plstemployess.length; i++) {
            //   json.plstemployess[i].pdateofbirth=this._commonService.formatDateFromDDMMYYYY(json.plstemployess[i].pdateofbirth);
            // }
           debugger;
             for(let i=0;i<json.plstemployess.length;i++){
if(!isNullOrEmptyString(json.plstemployess[i].pdateofbirth)){

  json.plstemployess[i].pdateofbirth= new Date(json.plstemployess[i].pdateofbirth);
}
             }


            this.employeeDetails.lstemployess=json.plstemployess;
          }

        }
        this.employeeDetails.EmployeeDetailsValidation={};
        });
    }
    if (tabname == 'refferral') {
      $('.nav-item a[href="#refferral"]').tab('show');

      this._contacmasterservice.getContactDetailsReferralByID(this.ID).subscribe(json => {
      if(json.introducedid!=null)
      {
            this.contactMoreForm.controls.introducedid.setValue(parseInt(json.introducedid));
            this.contactMoreForm.controls.introducedname.setValue(json.introducedname);

      }
      if(json.precordid>0)
      {
       this.savebutton="Update";
      }
      if(json.ptdsSectionName!=null)
      {
            this.contactMoreForm.controls.ptdsSectionName.setValue(json.ptdsSectionName);
      }
      if(json.pPanNumber!=null && json.pPanNumber!='')
      {

        debugger
        if (json.pIsPanNoAvailable == true) {
          this.isshowpanno = true;

          // this.istrue=true;
          this.contactMoreForm.controls.pIsPanNoAvailable.setValue(json.pIsPanNoAvailable);
          let pan = json.pPanNumber.substr(-4, 4);
          if(json.pPanNumber=="No pan")
          {
            this.contactMoreForm.controls.pPanNumber.clearValidators();
             this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
           // this.contactMoreForm.controls.pPanNumber.setValue("No pan")
            this.patternname="";
            this.nopan=true;
            this.panno='';
            this.isshowpannocheckbox=true;
          this.isshowpanno = false;
          this.isshowUploadDocument = true;
           this.contactValidationErrors.pPanNumber = "";
            this.patternname = "[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$"
            // this.contactMoreForm.controls.pPanNumber.setValidators([Validators.pattern(this.patternname)]);
            // this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
          }
          else
          {

            this.nopan=false;
            this.isshowpanno = true;
            this.isshowpannocheckbox=true;
            this.isshowUploadDocument = true;
            // this.patternname = "[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$"
            // //this.contactMoreForm.controls.pPanNumber.setValue("");
            // this.contactMoreForm.controls.pPanNumber.setValidators([Validators.pattern(this.patternname)]);
             this.contactMoreForm.controls.pPanNumber.clearValidators();
           this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
        //  this.contactMoreForm.controls.pPanNumber.setValue('XXXXXX' + pan);
        this.panno='XXXXXX' + pan;

          }
          this.contactMoreForm.controls.pPanNumber.setValue(json.pPanNumber);
          this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();

        }
      }
        else

        {

          this.isshowUploadDocument = false;
          this.contactMoreForm.controls.pIsPanNoAvailable.setValue(false);

        }


      });
    }
    if (tabname == 'supplier') {
      $('.nav-item a[href="#supplier"]').tab('show');

    }
    // if (tabname == 'advocate') {
    //   $('.nav-item a[href="#advocate"]').tab('show');

    // }
  }
  onFilterChangeAdvocate(eve: any) {
    if (eve.target.checked == true) {
      this.contactMoreForm.controls.pIsAdvocate.setValue(true);
    }
    else {
      this.contactMoreForm.controls.pIsAdvocate.setValue(false);

    }

  }
  checkox(event)
  {
    debugger;
    this.imageResponse=null;
    this.contactMoreForm.controls.pDocStorePath.setValue('');
    if(event.target.checked==true)
    {
      this.nopan=true;
      this.isshowUploadDocument = true;
      this.contactMoreForm.controls.pPanNumber.clearValidators();
       this.contactMoreForm.controls.pPanNumber.setValue("No pan")
       this.patternname="";
     this.contactValidationErrors.pPanNumber="";
    }
    else{
      this.nopan=false;
      this.isshowUploadDocument = false;
      this.contactMoreForm.controls.pPanNumber.setValue("")
      this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$"
      this.contactMoreForm.controls.pPanNumber.setValidators([Validators.pattern(this.patternname)]);
    }
    this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
  }
  getTDSsectiondetails(): void {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
        }
      },
      (error) => {

        this._commonService.showErrorMessage(error);
      }
    );
  }
  // saveadvocate() {
  //   let Advocatedata = { "pContactId": this.ID, "pIsAdvocate": true }
  //         if (confirm("Do you want to save ?")) {

  //   this._contacmasterservice.saveAdvocateDetails(Advocatedata).subscribe(res => {
  //     this._commonService.showInfoMessage("Advocate Saved Successfully");


  //   }
  //   )
  //         }
  // }

  SavecontactEmployeeForm() {


    //this.employeeDetails.buttonName = "Save";
    this.employeeDetails.contactEmployeeForm.controls.pcontactid.setValue(this.ID);
    this.employeeDetails.SaveEmployeeForm();

    this.buttonEmployeeName="Save";

  }
  clearDeatails()
  {
    //this.employeeDetails.clearMainDeatails();
  }
  clearEmployeeDeatails()
  {
    this.employeeDetails.clearMainDeatails();
    this.employeeDetails.showesi=false;
    this.employeeDetails.showpf=false;
    this.employeeDetails.showhealthproblems=false;
    this.buttonEmployeeName="Save";
    this.employeeDetails.buttonName="Save";
  }

  clearReferralDeatails()
  {
    this.contactMoreForm.controls.check.setValue(false);
    this.contactMoreForm.controls.introducedid.setValue('');
    this.contactMoreForm.controls.ptdsSectionName.setValue('');
    this.contactMoreForm.controls.pPanNumber.setValue("")
      this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
      this.contactMoreForm.controls.pPanNumber.setValidators([Validators.pattern(this.patternname)]);
      //this.contactMoreForm.controls['pPanNumber'].updateValueAndValidity();

      this.BlurEventAllControll(this.contactMoreForm);

    this.savebutton="Save";
    this.nopan=false
    this.isshowpanno=false;
    this.isshowUploadDocument=false;
    this.isshowpannocheckbox=false;
    this.isshowpanno=false;
    this.isshowUploadDocument=false;
  }
  savesupplier() {
    let Supplierdata = { "pContactId": this.ID, "pIsSupplier": true }
      if (confirm("Do you want to save ?")) {

    this._contacmasterservice.SaveContactSupplier(Supplierdata).subscribe(res => {
      this._commonService.showInfoMessage(" Supplier Saved Successfully");


    }
    )
      }
  }
  validateFile(fileName) {
    debugger
    if (fileName == undefined || fileName == "") {
        return true
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'exe' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' ) {

            return false
        }
    }
    return true
  }
  uploadAndProgress(event: any, files) {
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value
      )) {
          this._commonService.showWarningMessage("Upload jpg files");
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
      formData.append('NewFileName', this.contactMoreForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {

      if( extention.toLowerCase() == 'pdf')
      {
       this.imageResponse.name = data[0];
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





  // uploadAndProgress(event: any, files) {
  //   debugger
  //   let file = event.target.files[0];

  //   if (event && file) {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = e => {
  //       this.imageResponse = {
  //         name: file.name,
  //         fileType: "imageResponse",
  //         contentType: file.type,
  //         size: file.size,

  //       };
  //     };
  //   }
  //   let fname = "";
  //   if (files.length === 0) {
  //     return;
  //   }
  //   var size = 0;
  //   const formData = new FormData();
  //   for (var i = 0; i < files.length; i++) {
  //     size += files[i].size;
  //     fname = files[i].name
  //     formData.append(files[i].name, files[i]);
  //     formData.append('NewFileName', this.contactMoreForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
  //   }
  //   size = size / 1024;
  //   this._commonService.fileUpload(formData).subscribe(data => {

  //     this.kycFileName = data[1];
  //     if(this.imageResponse)
  //     this.imageResponse.name = data[1];
  //     this.kycFilePath = data[0];
  //   })
  // }
  validateSaveDeatails(control: FormGroup): boolean {
    let isValid = true;

    try {
        isValid = this.checkContactValidations(control, isValid);
    } catch (e) {
        this.showErrorMessage(e);

    }
    return isValid;
}
  saveReferral() {
    debugger;
   let check=this.contactMoreForm.controls.pPanNumber.value;
   if(check==''){
    this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
    this.contactMoreForm.controls.pPanNumber.setValidators([Validators.pattern(this.patternname)]);
   this.contactMoreForm.controls['pPanNumber'].updateValueAndValidity();
   }
    this.contactMoreForm.controls.pContactId.setValue(this.ID);
    this.contactMoreForm.controls.pFilename.setValue(this.kycFileName);

    if (this.validateSaveDeatails(this.contactMoreForm))
    {


      if (confirm("Do you want to save ?")) {

        debugger;
    let data = JSON.stringify(this.contactMoreForm.value);
    console.log("refferal data",data)
    this._contacmasterservice.saveReferralDetails(data).subscribe(res => {
      this.contactMoreForm.reset();
      if(this.savebutton=="Save")
      {
      this._commonService.showInfoMessage(" Referral Saved Successfully");
      this.savebutton="Save";
      this.nopan=false;
      this.router.navigate(['/ContactViewNew']);
      }
      if(this.savebutton=="Update")
      {
        this._commonService.showInfoMessage(" Referral Updated Successfully");
        this.savebutton="Save";
        this.nopan=false;
        this.router.navigate(['/ContactViewNew']);

      }
      this.contactValidationErrors = {};


    }

    )
          }
  }
  }
  DuplicateK(){
    debugger
    let PanNumber=this.contactMoreForm.controls.pPanNumber.value;
if(PanNumber.length>9){
  let docname='PAN CARD';
  
  this._contacmasterservice.GetDuplicateKYCTesting(docname,PanNumber).subscribe(json => {
  if(json==true){
    this.contactMoreForm.controls.pPanNumber.setValue("");
    // this.patternname="[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$"
    //   this.contactMoreForm.controls.pPanNumber.setValidators([Validators.required,Validators.pattern(this.patternname)]);
    //   this.contactMoreForm.controls.pPanNumber.updateValueAndValidity();
    this._commonService.showWarningMessage("PAN Card Already Exists");
  }
  });
  
}
  }
}

