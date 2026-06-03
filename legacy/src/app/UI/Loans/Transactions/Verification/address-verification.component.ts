import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { CommonService } from '../../../../Services/common.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import {DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-address-verification',
  templateUrl: './address-verification.component.html',
  styles: []
})
export class AddressVerificationComponent implements OnInit {

  FieldVerificationForm: FormGroup
  addressconfirmed: boolean;
  personMet: boolean;
  gridData: any;
  Employees: any;
  Investigationexecutivename: any;
  InvestigationexecutivenameId: any;
  NeighbourgridData: any;
  ApplicantName: any;
  LoanType: any;
  LoanName: any;
  MobileNo: any;
  ApplicationID: any
  FieldVeriEditData: any;
  submitted = false;
  isLoading = false;
  button = 'Submit';
  
  url: any;
  urlSafe: SafeResourceUrl;
  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDobConfigage: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  Age: any;
  time: any;
  public showverobservation: boolean = true;
  public Showneighbour: boolean = true;
  public ShowChildren: boolean = false;
  Addrestypes: any;
  ProffTypes: any;
  ShowPoliticalAffiliation: boolean;
    Applicantstay: boolean;
    disabletransactiondate = false;
    selectAddressListdata:any=[];
    platitude: any;
plongitude: any;
  constructor(private datePipe: DatePipe, private _VerificationService: VerificationService, private _commonService: CommonService, private router: Router, private activatedroute: ActivatedRoute, private _contacmasterservice: ContacmasterService,private sanitizer: DomSanitizer) {
    this.pDobConfig.containerClass = 'theme-dark-blue';
    this.pDobConfig.showWeekNumbers = false;
    // this.pDobConfig.minDate = new Date();
    // this.pDobConfig.maxDate = new Date();
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY'
    this.pDobConfigage.containerClass = 'theme-dark-blue';
    this.pDobConfigage.showWeekNumbers = false;
    this.pDobConfigage.dateInputFormat = 'DD/MM/YYYY'
    //let date = this.datePipe.transform(new Date(), 'dd/MM/yyyy').split('-')
    //let newdate = date[0] + '-' + date[1] + '-' + (parseInt(date[2]) - 10);
    
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let ndate = this.datePipe.transform(date, 'dd/MM/yyyy').split('-')
    let newdate = ndate[0] + '/' + ndate[1] + '/' + (parseInt(ndate[2]));
    this.pDobConfigage.maxDate = this._commonService.formatDateFromDDMMYYYY(newdate);
  }

  ngOnInit() {
    this.selectAddressListdata=[];
    this.platitude='';
   this.plongitude='';
      if (this._commonService.comapnydetails != null)
          this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.time = this.datePipe.transform(new Date(), 'shortTime');
   
    this.addressconfirmed = false;
    this.personMet = false;
    this.gridData = [];
    this.NeighbourgridData = [];
    this.FieldVerificationForm = new FormGroup({
      "createdby": new FormControl(this._commonService.pCreatedby),
      "modifiedby": new FormControl(this._commonService.pCreatedby),
      "papplicationid": new FormControl(),
      "pvchapplicationid": new FormControl(),
      "pcontactid": new FormControl(),
      "pcontactreferenceid": new FormControl(),
      "precordid": new FormControl(1),
      "pverificationdate": new FormControl('', Validators.required),
      "pverificationtime": new FormControl('', Validators.required),
      "pInvestigationexecutiveid": new FormControl('', Validators.required),
      "pInvestigationexecutivename": new FormControl(),
      "paddresstype": new FormControl('', Validators.required),
      "pFieldVerifiersComments": new FormControl('', Validators.required),
      "pFieldVerifiersRating": new FormControl("Positive", Validators.required),
      "pCreatedby": new FormControl(),
      "pModifiedby": new FormControl(),
      "pStatusid": new FormControl(),
      "pStatusname": new FormControl(),
      "pEffectfromdate": new FormControl(),
      "pEffecttodate": new FormControl(),
      "ptypeofoperation": new FormControl(),
      "addressconfirmedDTO": new FormGroup({
        "pisaddressconfirmed": new FormControl("true", Validators.required),
        "pUploaddocumentname": new FormControl(),
        "puploadlocationdocpath": new FormControl(),
        "plongitude": new FormControl(),
        "pLatitude": new FormControl(),
        "pNoofyearsatpresentaddress": new FormControl(0),
        "pHouseownership": new FormControl(),
        "pPersonmet": new FormControl('applicant'),
        "pPersonname": new FormControl(),
        "pRelationshipwithapplicant": new FormControl(),
        "pDateofbirth": new FormControl(),
        "pMaritalStatus": new FormControl('Single'),
        "pTotalnoofmembersinfamily": new FormControl(0),
        "pEarningmembers": new FormControl(0),
        "pChildren": new FormControl(0),
        "pEmploymentorbusinessdetails": new FormControl(),
        "pMonthlyincome": new FormControl(),
        "pFieldVerifiersComments": new FormControl(),
        "pFieldVerifiersRating": new FormControl(),
        "lstFielddocumentverificationDTO": new FormGroup({
          "precordid": new FormControl(),
          "pdocprooftype": new FormControl(),
          "pdocproofname": new FormControl(),
          "pisdocumentverified": new FormControl(),
          "ptypeofoperation": new FormControl(this._commonService.ptypeofoperation)

        })
      }),
      "fieldVerifiersobservationDTO": new FormGroup({
        "precordid": new FormControl(0),
        "pAddressLocalityDescription": new FormControl(),
        "pAccessability": new FormControl(),
        "pTypeofAccomodation": new FormControl(),
        "pApproxArea": new FormControl(),
        "pVisiblePoliticalAffiliation": new FormControl("false"),
        "pAffiliationRemarks": new FormControl(),
        "pAddressFurnishing": new FormControl(),
        "pVisibleAssets": new FormControl(),
        "pCustomerCooperation": new FormControl(),
        "pCustomerAvailability": new FormControl(true),
        "pFieldVerifiersComments": new FormControl(),
        "pFieldVerifiersRating": new FormControl()

      }),
      "fieldVerifyneighbourcheckDTO": new FormGroup({
        "precordid": new FormControl(),
        "pNameoftheNeighbour": new FormControl(),
        "pAddressofNeighbour": new FormControl(),
        "pisApplicantstayhere": new FormControl('true'),
        "pHouseOwnership": new FormControl(),
        "papplicantisstayingsince": new FormControl(),
        "papplicantisstayingMontsOrYears": new FormControl('Months'),
        "pFieldVerifiersComments": new FormControl(),
        "pFieldVerifiersRating": new FormControl()
      })

    });
    let date = new Date()
    this.FieldVerificationForm.controls.pverificationdate.setValue(this.datePipe.transform(date, 'dd/MM/yyyy'));
    this.FieldVerificationForm.controls.pverificationtime.setValue(this.datePipe.transform(new Date(), 'hh:mm'))
    this._VerificationService.GetEmployees().subscribe(res => {
      this.Employees = res;
    });
    // const routeParams = this.activatedroute.snapshot.params['id'];
    const routeParams = atob(this.activatedroute.snapshot.params['id']);
    if (routeParams !== undefined && routeParams != "") {
      
      this._VerificationService.GetFieldverificationdetails(routeParams).subscribe(res => {
        
        this.FieldVeriEditData = res;
        let mindate = this._commonService.formatDateFromDDMMYYYY(res["pDateofApplication"]);
        this.pDobConfig.minDate = this._commonService.formatDateFromDDMMYYYY(res["pDateofApplication"]);
        this.pDobConfig.maxDate = this._commonService.formatDateFromDDMMYYYY(res["pDateofDisbursement"]);
        this.ApplicantName = this.FieldVeriEditData["pApplicantName"]
        this.LoanType = this.FieldVeriEditData["pLoantype"]
        this.LoanName = this.FieldVeriEditData["pLoanName"]
        this.MobileNo = this.FieldVeriEditData["pconctano"]
        this.ApplicationID = this.FieldVeriEditData["pvchapplicationid"]
        this.ProffTypes = this.FieldVeriEditData["lstProffType"]
        this.Addrestypes = this.FieldVeriEditData["lstaddrestype"]
      });
    }
    this.Addressconfirmed("Yes");
    this.MaritalStatusClick('Single');
    this.ApplicantStayHere("Yes");
  }
  Addressconfirmed(status) {

    if (status == "Yes") { this.addressconfirmed = true; }
    if (status == "No") { this.addressconfirmed = false; }
  }
  // VerificationDate_Channge(event){
  //   debugger;
  // let date = event;
  // if((date.toString()).indexOf("/")== -1){
  //   this.FieldVerificationForm.controls.pverificationdate.setValue(this.datePipe.transform(date, 'dd/MM/yyyy'));
  // }
  // }
  
  ApplicantStayHere(status) {
    
    if (status == "Yes") {
    this.Applicantstay = true; this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingsince").setValue('');
      this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingMontsOrYears").setValue('Months'); }
    if (status == "No") {
    this.Applicantstay = false; this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingsince").setValue('');
      this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingMontsOrYears").setValue('Months'); }
  }
  PersonMetWith(Person) {
    
    if (Person == "Applicant") { this.personMet = false; }
    if (Person == "Other") { this.personMet = true; }
  }

  PoliticalAffiliation(Person) {
    
    if (Person == "Yes") { this.ShowPoliticalAffiliation = true; }
    if (Person == "No") { this.ShowPoliticalAffiliation = false; }
  }
  AddDocuments() {
    
    let DocumentName = this.FieldVerificationForm.value["addressconfirmedDTO"]["lstFielddocumentverificationDTO"]["pdocproofname"];
    let gridLength = this.gridData.length;
    if (DocumentName != null)
      if (DocumentName.length > 0) {
        let addDatatoGrid = { Id: gridLength + 1, "precordid": 0, "pdocprooftype": DocumentName, "pdocproofname": DocumentName, "pisdocumentverified": true, "ptypeofoperation": "CREATE" }
        let DocumentExist = 0;
        this.gridData.filter(function (data) {
          if (data["pdocproofname"] == DocumentName) {
            DocumentExist = 1;
          }
        })
        if (DocumentExist == 0)
          this.gridData.push(addDatatoGrid);
      }
  }
  AddNeighbourhood() {
    
    let NeighbourName = this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"]["pNameoftheNeighbour"]
    let AddressofNeighbour = this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"]["pAddressofNeighbour"]
    let HouseOwnership = this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"]["pHouseOwnership"]
    let Applicantisstayingsince = this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"]["papplicantisstayingsince"]
    let ApplicantisstayingMontsOrYears = this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"]["papplicantisstayingMontsOrYears"]

    if ((NeighbourName != "" && NeighbourName != null) || (AddressofNeighbour != "" && AddressofNeighbour != null) || (HouseOwnership != "" && HouseOwnership != null)) {
      let gridLength = this.NeighbourgridData.length;
      let addDatatoGrid = {
        Id: gridLength + 1, "precordid": 0, "pNameoftheNeighbour": NeighbourName, "pAddressofNeighbour": AddressofNeighbour, "pisApplicantstayhere": true, "pHouseOwnership": HouseOwnership, "papplicantisstayingsince": Applicantisstayingsince, "papplicantisstayingMontsOrYears": ApplicantisstayingMontsOrYears, "pFieldVerifiersComments": "", "pFieldVerifiersRating": "", "pTypeofoperation": "CREATE"
      }
      this.NeighbourgridData.push(addDatatoGrid);
    }

    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("pNameoftheNeighbour").setValue('');
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("pAddressofNeighbour").setValue('');
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("pisApplicantstayhere").setValue('false');
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("pHouseOwnership").setValue('');
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingsince").setValue('');
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingMontsOrYears").setValue('Months');
  }
  ChangeAplicantStayingType(event) {
    
    let type = event.currentTarget.value
    this.FieldVerificationForm.controls.fieldVerifyneighbourcheckDTO.get("papplicantisstayingMontsOrYears").setValue(type);

  }
  EmployeeSelect($event) {
    this.selectAddressListdata=[];
    this.platitude='';
   this.plongitude='';
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['plongitude'].setValue('');
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['pLatitude'].setValue('');
    this.Investigationexecutivename = $event.target.options[$event.target.options.selectedIndex].text;
    this.InvestigationexecutivenameId = $event.target.options[$event.target.options.selectedIndex].value;
   let a= this.Employees;
   let selectEmployeedata = this.Employees.filter(Employees => Employees.pEmployeeId == this.InvestigationexecutivenameId);

    this.selectgetContactDetailsByID(selectEmployeedata[0].pContactRefNo);
  

  }
  selectgetContactDetailsByID(id){
    this._contacmasterservice.getContactDetailsByID(id).subscribe(res => {
     debugger
     this.selectAddressListdata=res.pAddressList;
    });
  }
  AddressTypeSelect($event){
    this.platitude='';
   this.plongitude='';
 
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['plongitude'].setValue('');
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['pLatitude'].setValue('');
   let AddressType= $event.target.options[$event.target.options.selectedIndex].text;
   let srlctAddressType=this.selectAddressListdata.filter(Address => Address.pAddressType == AddressType);
   this.platitude=srlctAddressType[0].platitude;
   this.plongitude=srlctAddressType[0].plongitude;

   this.url = 'https://maps.google.com/maps?q='+this.platitude+','+this.plongitude+'&z=15&output=embed';
   this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['plongitude'].setValue(this.plongitude);
   this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['pLatitude'].setValue(this.platitude);
  }
  ageCalculation() {

    
    let age;
    let dob = this.FieldVerificationForm.value["addressconfirmedDTO"]['pDateofbirth'];
    if (dob != '' && dob != null) {
      let currentdate = Date.now();
      //let agedate = new Date(dob);
      let agedate = new Date(dob).getTime();
      let timeDiff = Math.abs(currentdate - agedate);
      if (timeDiff.toString() != 'NaN')
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      else
        age = 0;
    }
    else {
      age = 0;
    }
    this.Age = (age);

  }

  Earningmembers(){
  let Totalnoofmembersinfamily=  Number(this.FieldVerificationForm.value["addressconfirmedDTO"]["pTotalnoofmembersinfamily"]);
  let Earningmembers=Number(this.FieldVerificationForm.value["addressconfirmedDTO"]["pEarningmembers"]);

  if(Totalnoofmembersinfamily==0){
    this._commonService.showWarningMessage('Please Enter Total No of Members in Family');
    this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['pEarningmembers'].setValue(0);
    return;
  }
  if(Totalnoofmembersinfamily<Earningmembers){
    this._commonService.showWarningMessage('Please Enter Total No of Members in Family less than or equal to Earning Members');
    this.FieldVerificationForm['controls']['addressconfirmedDTO']['controls']['pEarningmembers'].setValue(0);
    
  }
  }
  SaveFieldVerification() {
    debugger

    this.submitted = true;
    if (this.FieldVerificationForm.valid) {
      


      this.FieldVerificationForm.value["addressconfirmedDTO"]["lstFielddocumentverificationDTO"] = this.gridData;
      this.FieldVerificationForm.value["fieldVerifyneighbourcheckDTO"] = this.NeighbourgridData;
      this.FieldVerificationForm.value["pApplicantName"] = this.FieldVeriEditData["pApplicantName"]
      this.FieldVerificationForm.value["papplicationid"] = this.FieldVeriEditData["papplicationid"]
      this.FieldVerificationForm.value["pconctano"] = this.FieldVeriEditData["pconctano"]
      this.FieldVerificationForm.value["pcontactid"] = this.FieldVeriEditData["pcontactid"]
      this.FieldVerificationForm.value["pcontactreferenceid"] = this.FieldVeriEditData["pcontactreferenceid"]
      this.FieldVerificationForm.value["pCreatedby"] = this._commonService.pCreatedby;
      this.FieldVerificationForm.value["pModifiedby"] = this._commonService.pCreatedby;
      this.FieldVerificationForm.value["pLoanName"] = this.FieldVeriEditData["pLoanName"]
      this.FieldVerificationForm.value["pLoantype"] = this.FieldVeriEditData["pLoantype"]
      this.FieldVerificationForm.value["precordid"] = 0;
      this.FieldVerificationForm.value["pvchapplicationid"] = this.FieldVeriEditData["pvchapplicationid"]
      this.FieldVerificationForm.value["pInvestigationexecutivename"] = this.Investigationexecutivename
      this.FieldVerificationForm.value["pInvestigationexecutiveid"] = parseInt(this.InvestigationexecutivenameId);
      let date = this.FieldVerificationForm.value["pverificationdate"];
      if((date.toString()).indexOf("/")!== -1){
        let d = this.FieldVerificationForm.value["pverificationdate"].split('/')
        this.FieldVerificationForm.value["pverificationdate"] = (d[2] + '-' + d[1] + '-' + d[0]);
      }
      else {
        this.FieldVerificationForm.value["pverificationdate"] = this.datePipe.transform(this.FieldVerificationForm.value["pverificationdate"], 'yyyy-MM-dd');

      }

      this.FieldVerificationForm.value["addressconfirmedDTO"]['pDateofbirth'] = this.datePipe.transform(this.FieldVerificationForm.value["addressconfirmedDTO"]['pDateofbirth'], 'yyyy-MM-dd');


      let FieldVerificationData = this.FieldVerificationForm.value
      debugger
      let FieldVerificationJsonData = JSON.stringify(FieldVerificationData);
      
      this.isLoading = true;
      this.button = 'Processing';
      this._VerificationService.SaveFieldVerification(FieldVerificationData).subscribe(res => {
        
        this.isLoading = false;
        this.button = 'Submit';
        this.router.navigate(['/VerificationView']);
      });
    }

  }
  clearFieldVerification() {
    
    this.FieldVerificationForm.reset();
    let date = new Date()

    this.FieldVerificationForm.patchValue({
      pFieldVerifiersRating: "Positive",
      "precordid": 1,
      "createdby": 1,
      "modifiedby": 1,
      pverificationdate: this.datePipe.transform(date, 'dd/MM/yyyy'),
      pverificationtime: this.datePipe.transform(new Date(), 'hh:mm'),
      addressconfirmedDTO: {
        "pisaddressconfirmed": "true", pPersonmet: 'applicant', pMaritalStatus: 'Single', "pNoofyearsatpresentaddress": 0, "pTotalnoofmembersinfamily": 0
        , "pEarningmembers": 0, "pChildren": 0
      },
      fieldVerifiersobservationDTO: {
        "precordid": 0, pVisiblePoliticalAffiliation: "false", pCustomerAvailability: true
      },

    });
    this.Addressconfirmed('Yes');
    this.PersonMetWith('Applicant');
    this.submitted = false;
      this.FieldVerificationForm.clearValidators();
      this.Age = '';
  }

  notApplicableForm(event, type) {
    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }

    if (type == 'Verifiers observation') {
      if (checked == true) {
        this.showverobservation = false;
      }
      else {
        this.showverobservation = true;
      }
    }
    else if (type == 'Neighbourhood Check') {
      if (checked == true) {
        this.Showneighbour = false;
      }
      else {
        this.Showneighbour = true;
      }
    }
  }

  public MaritalStatusClick(status) {
    if (status == 'Single') {
      this.ShowChildren = false
    }
    else {
      this.ShowChildren = true;
    }
  }
}
