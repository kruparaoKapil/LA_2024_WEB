import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { CompanyconfigService } from 'src/app/Services/Settings/companyconfig.service';
import { CompanyconfigPromotorsComponent } from './companyconfig-promotors/companyconfig-promotors.component';
import { CompanyconfigDocumentsComponent } from './companyconfig-documents/companyconfig-documents.component';
import { AddressComponent } from '../../Common/address/address.component';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
declare let $: any;

@Component({
  selector: 'app-company-config',
  templateUrl: './company-config.component.html',
  styles: []
})
export class CompanyConfigComponent implements OnInit {
  @ViewChild(CompanyconfigPromotorsComponent, { static: false }) promotorformdetails;
  @ViewChild(CompanyconfigDocumentsComponent, { static: false }) documentformdetails;
  @ViewChild(AddressComponent, { static: false }) addressdetails;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  companyconfigform: FormGroup;
  CompanyContactpromotorsForm: any;
  CompanyContactdocumentsForm: any;
  addresstypeForm: FormGroup
  croppedImage: any
  AddressForm: any;
  rowindex: any;
  buttontype = 'Add'
  enterprisename: any = []
  showEnterprise = false;
  public disablesavebutton = false;
  disablesaveadressbutton = false;
  saveadressbutton = 'Save'
  showBusinessNature = false;
  selectedtype: any;
  griddata: any = []
  companyconfigvalidations: any = {};
  typeofEnterpriseDetails: any;
  path: any;
  addressTypeDetails: any;
  contacttype = "Business Entity"
  buttonname: any;

  Title: any;
  imageResponse: any;
  imageResponsedata:any;
  FileName: any;
  FilePath: any;
  constructor(private formbuilder: FormBuilder, private titlecasepipe: TitleCasePipe, private router: Router, private _defaultimage: DefaultProfileImageService, private _commonService: CommonService, private _contacmasterservice: ContacmasterService, private _companyconfigservice: CompanyconfigService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.minDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
  }

  ngOnInit() {
    debugger
    this.imageResponsedata='';
    this.selectedtype = "Basic Information";
    this._companyconfigservice.getTitleOnClick(this.selectedtype);
    this.buttonname = "Next"
    this.getformdata();
    this.getAddressTypeDetails()
    this.BlurEventAllControll(this.companyconfigform);
    this.getTypeofEnterprise()

    this._companyconfigservice._GetButtonName().subscribe(data => {
      this.buttonStatus("Basic Information");
    })
    this.addresstypeForm = this.formbuilder.group({
      pContactType: [''],
      pAddressType: [''],
      pStatusname: [this._commonService.pStatusname],
      pCreatedby: [this._commonService.pCreatedby],
    })
    this.croppedImage = this._defaultimage.GetdefaultImage();
    this.loadeditdata()
   

  }

  getformdata() {
    this.companyconfigform = this.formbuilder.group({
      pcreatedby: [this._commonService.pCreatedby],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pnameofenterprise: ['', Validators.required],
      penterprisecode: ['', Validators.required],
      imageString:[''],
      pAddressTypeChk: [''],
      pPhoto: [''],
      ppancard: [''],
      ptypeofenterprise: [''],
      pestablishmentdate: [''],
      pcommencementdate: [''],
      pcinnumber: [''],
      pgstinnumber: [''],
      pAddressType: [''],
      potherenterprise: [''],
      pPriority: [''],
      pdatepickerenablestatus:['true'],
      pCompanyId: ['0'],
      pRecordId: ['0'],
      pcontactnumber: ['', Validators.required],
      pemailid: [''],
      pemailid2: [''],
      ppriority: [''],
      pAlternativeNo: [''],
      lstCompanyContactDTO: this.formbuilder.array([]),
      lstCompanyAddressDTO: this.formbuilder.array([]),
      lstCompanyDocumentsDTO: this.formbuilder.array([]),
      lstCompanyPromotersDTO: this.formbuilder.array([])
    })

  }

  addcontactControls(): FormGroup {
    return this.formbuilder.group({
      pCompanyId: ['0'],
      pRecordId: ['0'],
      pcontactnumber: [''],
      pemailid: [''],
      ppriority: [''],
      ptypeofoperation: ['']
    })
  }

  addAddressControls(): FormGroup {
    return this.formbuilder.group({
      pRecordId: ['0'],
      pAddressType: ['',],
      pAddress1: [''],
      pAddress2: [''],
      pState: ['',],
      pStateId: [''],
      pDistrict: ['',],
      pDistrictId: [''],
      pCity: [''],
      pCountry: ['',],
      pCountryId: ['',],
      pPinCode: [''],
      pPriority: [''],
      pCreatedby:[''],
      ptypeofoperation: [''],

    })
  }
  getAddressTypeDetails(): void {

    this._contacmasterservice.getAddressTypeDetails(this.contacttype).subscribe(
      (json) => {

        if (json != null) {
          this.addressTypeDetails = json;

          //this.addressTypeDetails = json as string
          //this.addressTypeDetails = eval("(" + this.addressTypeDetails + ')');
          //this.addressTypeDetails = this.addressTypeDetails.FT;
        }
      })


  }
  loadeditdata() {
    debugger
    this._companyconfigservice.Getcompanydetails().subscribe(data => {
      debugger
      console.log("get data:",data)
      if (data['pnameofenterprise'] != undefined || data['pnameofenterprise'] != null) {
        this.croppedImage= "data:image/png;base64," + data['pPhoto'];
        
        this.companyconfigform.controls.imageString.setValue(data['imageString'])
        this.companyconfigform.controls.ptypeofoperation.setValue('UPDATE')
        this.companyconfigform.controls.pCompanyId.setValue(data['pCompanyId'])
        this.companyconfigform.controls.pRecordId.setValue(data['pRecordId'])
        this.companyconfigform.controls.pnameofenterprise.setValue(data['pnameofenterprise'])
        this.companyconfigform.controls.penterprisecode.setValue(data['penterprisecode'])
        this.companyconfigform.controls.ppancard.setValue(data['ppancard'])
        this.companyconfigform.controls.pcreatedby.setValue(this._commonService.pCreatedby)
        this.companyconfigform.controls.pestablishmentdate.setValue(this._commonService.formatDateFromDDMMYYYY(data['pestablishmentdate']))
        this.companyconfigform.controls.pcommencementdate.setValue(this._commonService.formatDateFromDDMMYYYY(data['pcommencementdate']))
        this.companyconfigform.controls.pcinnumber.setValue(data['pcinnumber'])
        this.companyconfigform.controls.pgstinnumber.setValue(data['pgstinnumber'])
      let enterprise =  this.typeofEnterpriseDetails.filter(ent=>
        { return ent.pEnterpriseType==data['ptypeofenterprise']})
        if(enterprise.length==0)
        {
          let aa=data['ptypeofenterprise']
          this.companyconfigform.controls.potherenterprise.setValue(aa);
          this.companyconfigform.controls.ptypeofenterprise.setValue('Other')
          this.showEnterprise=true
        }
        else{
          this.companyconfigform.controls.ptypeofenterprise.setValue(data['ptypeofenterprise'])
        }
        this.griddata = data['lstCompanyAddressDTO']
        this.documentformdetails.gridData = data['lstCompanyDocumentsDTO']
        this.promotorformdetails.lstCompanyContactDTO = data['lstCompanyPromotersDTO']
      
        if(data['lstCompanyContactDTO'].length>0)
        {
          for(let i=0;i<data['lstCompanyContactDTO'].length;i++)
          {
             if(data['lstCompanyContactDTO'][i].ppriority=='PRIMARY')
             {
              this.companyconfigform.controls.pemailid.setValue(data['lstCompanyContactDTO'][i].pemailid)
              this.companyconfigform.controls.pcontactnumber.setValue(data['lstCompanyContactDTO'][i].pcontactnumber)
              this.companyconfigform.controls.ppriority.setValue(data['lstCompanyContactDTO'][i].ppriority)
              this.companyconfigform.controls.pRecordId.setValue(data['lstCompanyContactDTO'][i].pRecordId)
             
             }
             else{
              this.companyconfigform.controls.pemailid2.setValue(data['lstCompanyContactDTO'][i].pemailid)
              this.companyconfigform.controls.pAlternativeNo.setValue(data['lstCompanyContactDTO'][i].pcontactnumber)
              this.companyconfigform.controls.ppriority.setValue(data['lstCompanyContactDTO'][i].ppriority)
              this.companyconfigform.controls.pRecordId.setValue(data['lstCompanyContactDTO'][i].pRecordId)
             
             }
          }
        }
        console.log( this.documentformdetails.gridData)
        console.log(this.promotorformdetails.lstCompanyContactDTO)
      }
    })
  }
  getTypeofEnterprise(): void {

    this._contacmasterservice.getTypeofEnterprise().subscribe(json => {

      //console.log(json)
      if (json != null) {
        this.typeofEnterpriseDetails = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    })


  }

  addresstype(type) {
    let isValid = true;
    debugger
    let pAddressType = <FormGroup>this.companyconfigform['controls']['pAddressType'];
    if (type == 'GET') {
      pAddressType.setValidators(Validators.required);


    }
    else {
      pAddressType.clearValidators();
    }
    pAddressType.updateValueAndValidity();
    this.companyconfigvalidations = {}
    this.BlurEventAllControll(this.companyconfigform);

  }

  adddata() {
    debugger;
    let isValid = true;
    this.AddressForm = this.addressdetails.addressForm.value;
    this.addresstype('GET')
    this.addresscheckValidations(this.companyconfigform, isValid)
    if (this.addressdetails.checkValidations(this.addressdetails.addressForm, isValid)) {

      debugger
      let Chargescontroladress = <FormArray>this.companyconfigform.controls['lstCompanyAddressDTO'];
      Chargescontroladress.push(this.addAddressControls());
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pAddress1"] = this.AddressForm['paddress1']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pAddress2"] = this.AddressForm['paddress2']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pCity"] = this.AddressForm['pcity']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pState"] = this.AddressForm['pState']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pDistrict"] = this.AddressForm['pDistrict']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pCountry"] = this.AddressForm['pCountry']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pPinCode"] = this.AddressForm['Pincode']
      this.companyconfigform.value['lstCompanyAddressDTO'][0]['pDistrictId'] = this.AddressForm['pDistrictId']
      this.companyconfigform.value['lstCompanyAddressDTO'][0]['pStateId'] = this.AddressForm['pStateId']
      this.companyconfigform.value['lstCompanyAddressDTO'][0]['pCountryId'] = this.AddressForm['pCountryId']
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pCreatedby"] = this.companyconfigform.controls['pcreatedby'].value;
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["ptypeofoperation"] = this.companyconfigform.controls['ptypeofoperation'].value
      this.companyconfigform.value["lstCompanyAddressDTO"][0]["pAddressType"] = this.companyconfigform.controls['pAddressType'].value;

      if (this.griddata.length == 0) {

        this.companyconfigform.controls['pAddressTypeChk'].setValue(true)
        this.companyconfigform.value["lstCompanyAddressDTO"][0]["pPriority"] = 'PRIMARY';
        this.griddata.push(this.companyconfigform.value["lstCompanyAddressDTO"][0])
        this.companyconfigform.controls['pAddressType'].setValue('')
        this.addresstype('SET')
        this.addressdetails.clear();
      }
      else {

        let addressdata = [];
        addressdata = this.griddata.filter(data => {
          return data.pAddressType == this.companyconfigform.controls['pAddressType'].value;
        })

        if (addressdata.length == 0) {
          if (this.buttontype == 'Add') {
            this.griddata.push(this.companyconfigform.value["lstCompanyAddressDTO"][0]);
            this.companyconfigform.controls['pAddressType'].setValue('')
            this.addressdetails.clear();
            this.addresstype('SET')
          }
          else if (this.buttontype == "Update") {
            this.griddata[this.rowindex] = this.companyconfigform.value["lstCompanyAddressDTO"][0]
            this.griddata[this.rowindex].pPriority  = this.companyconfigform.controls.pPriority.value;
            this.companyconfigform.controls['pAddressType'].setValue('')
            this.addressdetails.clear();
            this.addresstype('SET')
            this.rowindex = ''
          }

        }
        else {
          if (this.buttontype == 'Add') {
            this.showWarningMessage('Address already exists')
          }
          else if (this.buttontype == "Update") {
            this.griddata[this.rowindex] = this.companyconfigform.value["lstCompanyAddressDTO"][0]
           
            this.companyconfigform.controls['pAddressType'].setValue('')
            this.addressdetails.clear();
            this.addresstype('SET')
            this.rowindex = ''
          }

        }

      }


    }
    this.buttontype = 'Add'
    //console.log(this.companyconfigform.value)
    let Chargescontroladress1 = <FormArray>this.companyconfigform.controls['lstCompanyAddressDTO'];
    for (let i = Chargescontroladress1.length - 1; i >= 0; i--) {
      Chargescontroladress1.removeAt(i)
    }
  }
  testlinks(data, type) {
    debugger
    let str = data
    this.path = data
    this.selectedtype = type;
    this._companyconfigservice.getTitleOnClick(this.selectedtype)
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }
  ShowTitle(title) {
    debugger
    this.selectedtype = title;
    this._companyconfigservice.getTitleOnClick(this.selectedtype)
    this.buttonStatus(title);
  }
  Nextclick() {
    this.Title = this._companyconfigservice.sendTitle()
    if (this.Title == "Basic Information") {
      let str = "documents";
      $('.nav-item a[href="#' + str + '"]').tab('show');
      this.selectedtype = "Documents";
      this._companyconfigservice.getTitleOnClick(this.selectedtype)
      this.buttonStatus(this.selectedtype);

    }
    if (this.Title == "Documents") {
      let str = "promotors";
      $('.nav-item a[href="#' + str + '"]').tab('show');
      this.selectedtype = "Promotors";
      this._companyconfigservice.getTitleOnClick(this.selectedtype)
      this.buttonStatus(this.selectedtype);


    }

  }

  savecompanyconfigform()
   {
     debugger
    let isValid = true;
    this.companyconfigform.controls.pdatepickerenablestatus.setValue(true)
    if (this.companyconfigform.controls.ptypeofenterprise.value == 'Other' && this.buttonname=='Update') {
      this.companyconfigform['controls']['ptypeofenterprise'].setValue(this.companyconfigform.controls.potherenterprise.value);
    }

    if (this.checkValidations(this.companyconfigform, isValid)) {
      debugger;

      this.Nextclick()

      const control = <FormArray>this.companyconfigform.controls['lstCompanyContactDTO'];
      control.push(this.addcontactControls());
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][0]['controls']['pemailid'].setValue(this.companyconfigform.controls.pemailid.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][0]['controls']['pcontactnumber'].setValue(this.companyconfigform.controls.pcontactnumber.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][0]['controls']['ppriority'].setValue('PRIMARY');
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][0]['controls']['pRecordId'].setValue(this.companyconfigform.controls.pRecordId.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][0]['controls']['ptypeofoperation'].setValue(this.companyconfigform.controls.ptypeofoperation.value);
      const control1 = <FormArray>this.companyconfigform.controls['lstCompanyContactDTO'];
      control1.push(this.addcontactControls());

      if (this.companyconfigform.controls.pAlternativeNo.value == null || this.companyconfigform.controls.pAlternativeNo.value == '')
        this.companyconfigform.controls.pAlternativeNo.setValue(0);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][1]['controls']['pemailid'].setValue(this.companyconfigform.controls.pemailid2.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][1]['controls']['pcontactnumber'].setValue(this.companyconfigform.controls.pAlternativeNo.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][1]['controls']['ppriority'].setValue(' ');
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][1]['controls']['pRecordId'].setValue(this.companyconfigform.controls.pRecordId.value);
      this.companyconfigform['controls']['lstCompanyContactDTO']['controls'][1]['controls']['ptypeofoperation'].setValue(this.companyconfigform.controls.ptypeofoperation.value);
      this.CompanyContactdocumentsForm = this.documentformdetails.gridData
      this.companyconfigform.value['lstCompanyDocumentsDTO'] = this.CompanyContactdocumentsForm
      this.CompanyContactpromotorsForm = this.promotorformdetails.lstCompanyContactDTO
      this.companyconfigform.value['lstCompanyPromotersDTO'] = this.CompanyContactpromotorsForm
      this.companyconfigform.value['lstCompanyAddressDTO'] = this.griddata
      // console.log(this.companyconfigform.value)
      
      let data = JSON.stringify(this.companyconfigform.value)
      console.log(this.companyconfigform.value)
      if (this.Title == "Promotors") {
        this.disablesavebutton = true;
        this.buttonname = 'Processing'
        this._companyconfigservice.savecompanyconfig(data).subscribe(res => {
          let a=this._commonService.comapnydetails;
          a['pPhoto']=this.imageResponsedata;
          sessionStorage.setItem('companydetails', JSON.stringify(a));
          this._commonService._setCompanyDetails();
          console.log(res)
          if (res) {
           debugger 
            if(this.companyconfigform.controls.ptypeofoperation.value=="UPDATE")
            {
              this.showInfoMessage('Updated Successfully')
              this.disablesavebutton = false;
              location.reload();
            }
            else{
              this.showInfoMessage('Saved Successfully')
              this.disablesavebutton = false;
              
            }                 
            let str = "basicinfo";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Basic Information";
            this.buttonname="Next"
            this._companyconfigservice.getTitleOnClick(this.selectedtype)
            this.companyconfigform.reset()
            this.griddata = []
            this.companyconfigvalidations = {}
            this.documentformdetails.clear()
            this.promotorformdetails.clear()
            this.loadeditdata()
          }

        }, (error) => {
          this._commonService.showErrorMessage(error)
          this.disablesavebutton = false;
          if (this.companyconfigform.controls.ptypeofoperation.value == 'UPDATE') {
            this.buttonname = 'Update'
          }
          else {
            this.buttonname = 'Save'
          }

        })
      }


      const contactControl = <FormArray>this.companyconfigform.controls['lstCompanyContactDTO'];
      for (let i = contactControl.length - 1; i >= 0; i--) {
        contactControl.removeAt(i)
      }
      const addressControl = <FormArray>this.companyconfigform.controls['lstCompanyContactDTO'];
      for (let i = addressControl.length - 1; i >= 0; i--) {
        addressControl.removeAt(i)
      }

    }
    else {
      let str = "basicinfo";
      $('.nav-item a[href="#' + str + '"]').tab('show');
      this.selectedtype = "Basic Information";
      this._companyconfigservice.getTitleOnClick(this.selectedtype)
    }
  }
  enterpriseChange() {
    try {

      const control = <FormGroup>this.companyconfigform['controls']['ptypeofenterprise'];
      if (this.companyconfigform.controls.ptypeofenterprise.value == 'Other') {

       
        this.showEnterprise = true;

      }
      else {
        control.clearValidators();
        this.showEnterprise = false;
      }
      



    } catch (e) {
      this.showErrorMessage(e);
    }
   
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
  addresscheckValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        if (key == 'pAddressType')
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
          this.companyconfigvalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.companyconfigvalidations[key] += errormessage + ' ';
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
  changeAddressPriority(dataItem, rowIndex) {
    debugger;

    this.griddata.filter(data => { data.pPriority = "" })
    console.log(this.griddata)
    dataItem.pPriority = 'PRIMARY'
    this.griddata[rowIndex] = dataItem

  }
  loadImages(EventData: string) {
    this.croppedImage = "data:image/png;base64," + EventData;
    this.companyconfigform['controls']['pPhoto'].setValue(EventData);

  }
  removeHandler(event) {
    this.griddata.splice(event.rowIndex, 1);
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
  showWarningMessage(errormsg: string) {
    this._commonService.showWarningMessage(errormsg)
  }
  saveaddresstype() {
    debugger
    this.addresstypeForm['controls']['pContactType'].setValue(this.contacttype);
    this.addresstypeForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
    this.addresstypeForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);

    let data = JSON.stringify(this.addresstypeForm.value)

    this._contacmasterservice.checkAddressType(this.addresstypeForm.controls.pAddressType.value, this.contacttype).subscribe(res => {
      this.disablesaveadressbutton = true;
      this.saveadressbutton = 'Processing';
      debugger;
      if (res == 0) {

        this._contacmasterservice.saveAddressType(data).subscribe(res => {

          debugger;
          $('#addresstype').modal('hide');
          this.showInfoMessage("Saved Sucessfully");
          this.addresstypeForm['controls']['pAddressType'].setValue('');
          this.getAddressTypeDetails();
          this.disablesaveadressbutton = false
          this.saveadressbutton = 'Save';
        })
      }


    })
  }
  editHandler(event, rowIndex) {
    debugger
    this.rowindex = event.rowIndex
    this.buttontype = 'Update'
    this.addressdetails.editdata(event.dataItem, 'companyconfig')
    console.log(event.dataItem.pAddressType)
    this.companyconfigform.controls.pAddressType.setValue(event.dataItem.pAddressType)
    this.companyconfigform.controls.pPriority.setValue(event.dataItem.pPriority)

  }
  buttonStatus(title) {
    debugger

    if (title == "Basic Information") {
      this.buttonname = "Next"
    }
    if (title == "Documents") {
      this.buttonname = "Next"
    }
    if (title == "Promotors") {
      if (this.companyconfigform.controls.ptypeofoperation.value == 'UPDATE') {
        this.buttonname = 'Update'
      }
      else {
        this.buttonname = "Save"
      }

    }
  }
  clear() {
    debugger
    this.Title = this._companyconfigservice.sendTitle()
    if (this.Title == "Basic Information") {
      this.companyconfigform.reset()
      this.griddata = []
      this.companyconfigvalidations = {}
    }
    if (this.Title == "Documents") {
      this.documentformdetails.clear()
    }
    if (this.Title == "Promotors") {
      this.promotorformdetails.clear()
    }
  }
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
 
      this._commonService.fileUpload(formData).subscribe(data => {
        debugger;
        this.FileName = data;
        if (this.imageResponse)
        this.croppedImage =  data[0];
         // this.croppedImage = "data:image/png;base64," + data[0];
         this._commonService.GetImage(data[0]).subscribe(res=>{
           console.log("imageresponse",res);
           this.imageResponsedata=res[0];
           this.croppedImage = "data:image/png;base64," + res[0];

             })
       
        //  this.companyconfigform['controls']['pPhoto'].setValue(data[0]);
         this.companyconfigform['controls']['imageString'].setValue(data[0]);
      })
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
}
