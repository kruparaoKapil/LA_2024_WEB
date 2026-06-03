import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { STRING_TYPE } from '@angular/compiler';
import { AddressComponent } from 'src/app/UI/Common/address/address.component';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-educationloan',
  templateUrl: './educationloan.component.html',
  styles: []
})

export class EducationloanComponent implements OnInit {
  // @ViewChild(AddressComponent,{ static: false }) addressFormdata:AddressComponent;
  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  EducationLoanFeeDetailsForm:FormGroup;

  isEditable = false;
  submitted1 = false;
  submitted2 = false;
  valid: boolean;
  arrow:boolean=true
  arrowforfee: boolean=true;
  arrowforeducation: boolean=true;
  arrowforeducationaddress: boolean=true;
  diableforscholar:boolean = false;


  indexValue: number;
  addressForm:FormGroup;
  educationloanform: FormGroup;
  coursedetailsform:FormGroup;
  completededucationloanform:FormGroup;
  FeedetailsForm: FormGroup;
  educationLoanConfigErrorMessage: any;
  edutype: FormGroup
  yearType: FormGroup
  Feeeduqualification: FormGroup;
  computedfeevalue:number;

  pqualification: any = [ { quali: 'Graduation' }, { quali: 'Intermediate' }, { quali: 'Postgraduation' },{ quali: 'SSC/SSLC/CBSE/ICSE (10th)' }]
  yeartype: any = [{ year: '1st year' }, { year: '2nd year' }, { year: '3rd year' }]
  feequalification: any = [ { quali: 'Clothing' }, { quali: 'Computer' }, { quali: 'Essential Books Stationary Equipment' },{ quali: 'Examination Fees' }, { quali: 'Hostel Fee/Rent' }, { quali: 'Laboratory Fees' }, { quali: 'Library Fees' },  { quali: 'Study Tour for Project' }, { quali: 'Sundries' },{ quali: 'Tuition Fees' },]
 

  formDetails = []
  formDetails2 = []
  myDateValue: Date;
  FeedetailsFormerror: any;
 

  stateDetails:any
  districtDetails:any
  countryDetails:any;
  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(private formBuilder: FormBuilder, private router: Router,private _contacmasterservice: ContacmasterService, private _commonService: CommonService, private loanSpecificService: FIIndividualLoanspecficService) { 
    this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
    this.pdateofestablishmentConfig.showWeekNumbers = false;
    this.pdateofestablishmentConfig.maxDate = new Date();
    this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit() {
  
//console.log("addressFormdata",this.addressFormdata);
// this.LoanErrorMessage={}
      this.addressForm = this.formBuilder.group({
  
      paddress1: ['',Validators.maxLength(200)],
      paddress2: ['',Validators.maxLength(200)],
      pcity: ['',Validators.maxLength(75)],
      pCountryId: [''],
      pStateId: [''],
      pDistrictId: [''],
      pCountry: [''],
      pState: [''],
      pDistrict: [''],
      Pincode: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pTypeofoperation:['CREATE'],
      pRecordid:[0]
      })
      this.BlurEventAllControll(this.addressForm);
      this.getCountryDetails();
  

    this.educationLoanConfigErrorMessage = {};

    this.myDateValue = new Date();
    this.edutype = this.formBuilder.group({
      quali: ['']
    })

    this.yearType = this.formBuilder.group({
      year: ['']
    })

    this.Feeeduqualification = this.formBuilder.group({
      quali: ['']
    })

    this.educationloanform = this.formBuilder.group({
      pNameoftheinstitution: [''],
      pNameofProposedcourse: [''],
      pselectionoftheinstitute: [''],
      pStatusname: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pTypeofoperation:['CREATE']

    })
    this.BlurEventAllControll(this.educationloanform);
    this.coursedetailsform = this.formBuilder.group({

    pRankingofinstitution: [''],
    pDurationofCourse: [''],
    pDateofCommencement: [''],
    pseatsecured: [''],
    pCreatedby: [this._commonService.pCreatedby],
    pTypeofoperation:['CREATE']
  })
  this.BlurEventAllControll(this.coursedetailsform);

  this.completededucationloanform = this.formBuilder.group({

  pqualification: [''],
  pinstitute: [''],
  pyearofpassing: [''],
  pnoofattempts: [''],
  pmarkspercentage: [''],
  pgrade: [''],
  pisscholarshipsapplicable: [false],
  pscholarshiporprize: [''],
  pscholarshipname: [''],
  pCreatedby: [this._commonService.pCreatedby],
  pTypeofoperation:['CREATE']
  })
  this.BlurEventAllControll(this.completededucationloanform);

    this.FeedetailsForm = this.formBuilder.group({
      pyear: [''],
      pqualification: [''],
      pfee: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pTypeofoperation:['CREATE']
    })
    this.BlurEventAllControll(this.FeedetailsForm);

    this.EducationLoanFeeDetailsForm=this.formBuilder.group({
      ptotalfundrequirement:[''],
      pnonrepayablescholarship:[''],
      prepayablescholarship:[''],
      pfundsavailablefromfamily:[''],
      pCreatedby: [this._commonService.pCreatedby],
      pTypeofoperation:['CREATE']

    })

  }
 //<-----accordian arrow transisition (started)---->
  arrowChange(){
    this.arrow=!this.arrow
    
  }
  arrowChangeforfeedetilas(){
    this.arrowforfee=!this.arrowforfee

  }
  arrowChangeforeducation(){
    this.arrowforeducation=!this.arrowforeducation

  }
  arrowChangeforeducationaddress(){
    this.arrowforeducationaddress =! this.arrowforeducationaddress

  }
 //<-----accordian arrow transisition (ended)---->

//<------add education details to grid (started)--->
submitcompletededucationloan() {
    // if(this.addressFormdata.addressForm) {
    //   this.addressFormdata.checkValidations(this.addressFormdata.addressForm,true);
    // }
    // let isvalid = true;
    // if (this.checkValidations(this.completededucationloanform, isvalid)) {
  
    //console.log("this.educationloanform.value :",this.educationloanform.value);
    if(this.completededucationloanform.value.pqualification ||
      this.completededucationloanform.value.pinstitute ||
      this.completededucationloanform.value.pyearofpassing ||
      this.completededucationloanform.value.pnoofattempts ||
      this.completededucationloanform.value.pmarkspercentage ||
      this.completededucationloanform.value.pgrade ||
      this.completededucationloanform.value.pisscholarshipsapplicable ||
      this.completededucationloanform.value.pscholarshiporprize ||
      this.completededucationloanform.value.pscholarshipname ){

    let educationalQulificationObj= {
      pRecordid:0,
      pqualification:this.completededucationloanform.value.pqualification,
      pinstitute:this.completededucationloanform.value.pinstitute,
      pyearofpassing:this.completededucationloanform.value.pyearofpassing,
      pnoofattempts:this.completededucationloanform.value.pnoofattempts,
      pmarkspercentage:this.completededucationloanform.value.pmarkspercentage,
      pgrade:this.completededucationloanform.value.pgrade,
      pisscholarshipsapplicable:this.completededucationloanform.value.pisscholarshipsapplicable,
      pscholarshiporprize:this.completededucationloanform.value.pscholarshiporprize,
      pscholarshipname:this.completededucationloanform.value.pscholarshipname,
      pTypeofoperation:'CREATE',
    }
    if (this.completededucationloanform.valid) {
      this.isEditable ? this.formDetails.splice(this.indexValue, 1, this.educationloanform.value) : this.formDetails.push(educationalQulificationObj)
      for (let i = 0; i < this.pqualification.length; i++) {
          if (this.pqualification[i].quali == this.completededucationloanform.value.pqualification) {
            this.pqualification.splice(i,1);             
        }
      }
   // this.formDetails.push(educationalQulificationObj)
    console.log("hi", this.pqualification);
    }
    this.completededucationloanform = this.formBuilder.group({
      // pNameoftheinstitution: [''],
      // pNameofProposedcourse: [''],
      // pselectionoftheinstitute: [''],
      // pRankingofinstitution: [''],
      // pDurationofCourse: [''],
      // pDateofCommencement: [''],
      // pseatsecured: [''],
     
      pqualification: [''],
      pinstitute: [''],
      pyearofpassing: [''],
      pnoofattempts: [''],
      pmarkspercentage: [''],
      pgrade: [''],
      pisscholarshipsapplicable: [false],
      pscholarshiporprize: [''],
      pscholarshipname: [''],
      pStatusname: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pTypeofoperation:['CREATE']

    })
 
    this.BlurEventAllControll(this.completededucationloanform);
  }

  }
//<------add education details to grid (ended)--->

  onDateChange(newDate: Date) {
    //console.log(newDate);
  }

  //<------add fee details to grid (started)--->
  submitFeeDetails() {
    let isvalid = true;
    // if (this.checkValidations(this.FeedetailsForm, isvalid)) {
 if(this.FeedetailsForm.value.pyear ||
  this.FeedetailsForm.value.pqualification ||
  this.FeedetailsForm.value.pfee ){
   
    // if (this.FeedetailsForm.valid) {
      this.FeedetailsForm.value.pfee = this._commonService.currencyformat(this.FeedetailsForm.value.pfee);
      if(this.formDetails2 && this.formDetails2.length > 0 ) {
        let count = 0;
        for (let k = 0; k < this.formDetails2.length; k++) {
          if((this.formDetails2[k].pyear == this.FeedetailsForm.value.pyear) && 
          (this.formDetails2[k].pfee == this.FeedetailsForm.value.pfee)) {
            this._commonService.showWarningMessage("Already existed");
            return;
          }
          else {
            count++;
          }
        }
        if(count == this.formDetails2.length) {
          this.formDetails2.push(this.FeedetailsForm.value);
        }
      }
      else {
        this.formDetails2.push(this.FeedetailsForm.value)
      }

      //------------previous code is start--------------------------------------------------------------------------------------------------------------------------//
        // this.isEditable ? this.formDetails2.splice(this.indexValue, 1, this.FeedetailsForm.value) : this.formDetails2.push(this.FeedetailsForm.value)
      //------------previous code is end--------------------------------------------------------------------------------------------------------------------------//
      this.computeFeedetails();
    
      //this.formDetails2.push(this.FeedetailsForm.value)
      //console.log("hi", this.FeedetailsForm.value);
   
   
      this.FeedetailsForm = this.formBuilder.group({
        pyear: [''],
        pqualification: [''],
        pfee: [''],
        pTypeofoperation:['CREATE'],
        pCreatedby: [this._commonService.pCreatedby],

      })
  // }
    this.BlurEventAllControll(this.FeedetailsForm);
  }

  }
//<------add fee details to grid (ended)--->

//<------calculation of fee details(started)--->
  computeFeedetails(){
    this.computedfeevalue = 0;
    console.log(this.formDetails2,"this.formDetails2");
    if(this.formDetails2){
    for (let i = 0; i < this.formDetails2.length; i++) {
      this.computedfeevalue = this.computedfeevalue + (this.formDetails2[i].pfee ?  Number((this.formDetails2[i].pfee.toString()).replace(/,/g, "")) : 0);
    }
  }
    this.computedfeevalue =  this._commonService.currencyformat(this.computedfeevalue);
  }
//<------calculation of fee details(ended)--->

//<-----add field to dropdown (started)---->
  saveAddressType() {
    this.pqualification[0] = this.edutype.value;
  }
  saveYear() {
    this.yeartype[0] = this.yearType.value;
  }
  savefeequalification() {
    this.feequalification[0] = this.Feeeduqualification.value;
  }
//<-----add field to dropdown (ended)---->

//<----update the grid data for educationdetails (started)---->
  editforEdu(event) {
    this.isEditable = true;
    this.indexValue = event.rowIndex;
    this.educationloanform.patchValue({
      pNameoftheinstitution: event.dataItem.pNameoftheinstitution,
      pNameofProposedcourse: event.dataItem.pNameofProposedcourse,
      pselectionoftheinstitute: event.dataItem.pselectionoftheinstitute,
      pRankingofinstitution: event.dataItem.pRankingofinstitution,
      pDurationofCourse: event.dataItem.pDurationofCourse,
      pDateofCommencement: event.dataItem.pDateofCommencement,
      pseatsecured: event.dataItem.pseatsecured,
      address1: event.dataItem.address1,
      address2: event.dataItem.address2,
      city: event.dataItem.city,
      Country: event.dataItem.Country,
      State: event.dataItem.State,
      District: event.dataItem.District,
      Pincode: event.dataItem.Pincode,
      pqualification: event.dataItem.pqualification,
      pinstitute: event.dataItem.pinstitute,
      pyearofpassing: event.dataItem.pyearofpassing,
      pnoofattempts: event.dataItem.pnoofattempts,
      pmarkspercentage: event.dataItem.pmarkspercentage,
      pgrade: event.dataItem.pgrade,
      pisscholarshipsapplicable: event.dataItem.pisscholarshipsapplicable,
      pscholarshiporprize: event.dataItem.AcademicDistinctionprize,
      pscholarshipname: event.dataItem.pscholarshipname,


    })
  }
//<----update the grid data for educationdetails (ended)---->

//<----delete the grid data for educationdetails (started)---->
  deleteforEdu(event) {
    console.log("eventfordelete",event);
    if(event.dataItem.pqualification){
      let data={
        quali:event.dataItem.pqualification
      }
      this.pqualification.push(data);
    }
    this.formDetails.splice(event.rowIndex, 1);
        console.log(this.pqualification);
  }
//<----delete the grid data for educationdetails (ended)---->

//<----delete the grid data for fee details (started)---->
  deleteforFee(event) {
    this.formDetails2.splice(event.rowIndex, 1);
    this.computeFeedetails()
  }
//<----delete the grid data for fee details (ended)---->

//<----update the grid data for fee details (started)---->
  editforFee(event) {
    this.isEditable = true;
    this.indexValue = event.rowIndex;
    this.FeedetailsForm.patchValue({
      pyear: event.dataItem.pyear,
      pqualification: event.dataItem.pqualification,
      pfee: event.dataItem.pfee
    })
  }
//<----update the grid data for fee details (ended)---->

  notApplicableKyc(event) {
    this.educationloanform.value.pisscholarshipsapplicable = true;
    this.completededucationloanform.patchValue({
      pscholarshiporprize:null,
      pscholarshipname:null
    })
    this.diableforscholar = event.target.checked;

  }

//<-----validations of formgroup (started)----->
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
          this.educationLoanConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

         
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.educationLoanConfigErrorMessage[key] += errormessage + ' ';
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
   showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
//<-----validations of formgroup (ended)----->


  addAddressControls(): FormGroup {
    return this.formBuilder.group({
      pRecordId: [''],
      pAddressType: [''],
      pAddress1: [''],
      pAddress2: [''],
      pState: [''],
      pStateId: [''],
      pDistrict: [''],
      pDistrictId: [''],
      pCity: [''], 
      pCountry: [''],
      pCountryId: ['',],
      pPinCode: ['', Validators.minLength(6)],
      pPriority: [''],
      ptypeofoperation: [''],
      pAddressDetails: [''],
      pStatusname: [''],
    })
  }

 

  pCountry_Change($event: any): void {

    const countryid = $event.target.value;
    
    if (countryid && countryid != '') {
          this.getSateDetails(countryid);
          const countryName = $event.target.options[$event.target.selectedIndex].text;
          this.addressForm['controls']['pCountry'].setValue(countryName);
    }
    else {
      this.stateDetails = [];
      this.districtDetails = [];
      this.addressForm['controls']['pStateId'].setValue('');
      this.addressForm['controls']['pDistrictId'].setValue('');      

    }
  }
  pState_Change($event: any): void {
    const stateid = $event.target.value;
    if (stateid && stateid != '') {
      const statename = $event.target.options[$event.target.selectedIndex].text;
      this.addressForm['controls']["pStateId"].value;
      if(statename)
       this.addressForm['controls']['pState'].setValue(statename);
      this.getDistrictDetails(stateid);
    }
    else {
      this.districtDetails = [];
      this.addressForm['controls']['pDistrictId'].setValue('');
    }
  }
  getCountryDetails(): void {
    this._contacmasterservice.getCountryDetails().subscribe(json => {
      if (json != null) {
        this.countryDetails = json;
        //console.log('this.countryDetails  ',this.countryDetails);
      }
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  getSateDetails(countryid) {  
    this._contacmasterservice.getSateDetails(countryid).subscribe(json => {
      this.stateDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }

  getDistrictDetails(stateid) {
    this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {
      this.districtDetails = json;
      //console.log('this. districtDetails  ',this.districtDetails);

    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  pDistrict_Change($event: any): void {
   const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      this.addressForm['controls']['pDistrict'].setValue(districtname);
      //this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue(districtid);
    }
    else {
      this.addressForm['controls']['pDistrict'].setValue('');
    }
  }
  }
