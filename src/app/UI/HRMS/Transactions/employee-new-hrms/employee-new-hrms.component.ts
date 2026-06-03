import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { SscAgendaService } from 'src/app/Services/HRMS/Transactions/ssc-agenda.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
@Component({
  selector: 'app-employee-new-hrms',
  templateUrl: './employee-new-hrms.component.html',
  styles: []
})
export class EmployeeNewHrmsComponent implements OnInit {


  public datepickerConfig0: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig3: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig4: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig5: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig6: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig7: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public datepickerConfig8: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  showgeneralinformation : boolean = false;
  showfamilydetails : boolean = false;
  familydetailsarray : any = [];
  showeducation : boolean = false;
  educationdetailsarray : any = [];
  showpreviousexperience : boolean = false;
  previousexperiencearray : any = [];
  showkapilcareer : boolean = false;
  kapilcareerarray : any = [];
  showdepartmenttraining : boolean = false;
  departmenttrainingarray : any = [];
  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;
  pDocFileType: any;
  newEmployeeForm : FormGroup;
  familyDetailsForm:FormGroup;
  educationDetailsForm: FormGroup;
  previousExpDetailsForm: FormGroup;
  kapilCareerDetailsForm: FormGroup;
  departmentTrainingDetailsForm: FormGroup;


  //Bindings
  empdesignationsList : any = [];
  empRolesList : any = [];
  branchnamesList : any = [];
  relationList: any = [];
  educationList: any = [];
  employeeHRMSValidation: any = {};
  saveOrUpdateButton :  string = "Save";
  branchName : any;


  lstbloodgroup :any  = [{ bloodgroup: 'A+', bloodgroupid: 'A+' }, { bloodgroup: 'A-', bloodgroupid: 'A-' }, { bloodgroup: 'B+', bloodgroupid: 'B+' }, { bloodgroup: 'B-', bloodgroupid: 'B-' }, { bloodgroup: 'O+', bloodgroupid: 'O+' }, { bloodgroup: 'O-', bloodgroupid: 'O-' }, { bloodgroup: 'AB+', bloodgroupid: 'AB+' }, { bloodgroup: 'AB-', bloodgroupid: 'AB-' }];

  communityList : any =[
    {pminoritycommunity:'Buddhist'},
    {pminoritycommunity:'Christian'},
    {pminoritycommunity:'Hindu'},
    {pminoritycommunity:'Jain'},
    {pminoritycommunity:'Muslim'},
    {pminoritycommunity:'Sikh'},
    {pminoritycommunity:'Zorostrian'},
    {pminoritycommunity:'None of these'}
  ];

  countryList : any =[
    {pCountryId:1,country:'India'},
  ];

  branchList :any = [];

  kapilCarrerList: any = [];
  trainingList : any = [];
  previousexpList : any = [];
  educationListData : any = [];
  familyDetailsList : any = [];
  contactList: any = [];
  branchId: any;
  ctc : any;
  patternname: string;
  basicSalary: number;
  variablepay: number;
  Index: any;
  gridButton:any = 'Add';
  esiNoFlag: boolean = false;
  pfNoFlag: boolean;
  pHandicapFlag: boolean;


  constructor(private _commonService : CommonService,private _SscAgeService:SscAgendaService,private _fb:FormBuilder, private contacmaster:ContacmasterService, private datePipe: DatePipe,private router:Router,private activetedRoute:ActivatedRoute) { 

      this.datepickerConfig0.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig0.maxDate = new Date();
      this.datepickerConfig0.showWeekNumbers = false;
      this.datepickerConfig1.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig1.maxDate = new Date();
      this.datepickerConfig1.showWeekNumbers = false;
      this.datepickerConfig2.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig2.maxDate = new Date();
      this.datepickerConfig2.showWeekNumbers = false;
      this.datepickerConfig3.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig3.maxDate = new Date();
      this.datepickerConfig3.showWeekNumbers = false;
      this.datepickerConfig4.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig4.maxDate = new Date();
      this.datepickerConfig4.showWeekNumbers = false;
      this.datepickerConfig5.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig5.maxDate = new Date();
      this.datepickerConfig5.showWeekNumbers = false;
      this.datepickerConfig6.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig6.maxDate = new Date();
      this.datepickerConfig6.showWeekNumbers = false;
      this.datepickerConfig7.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig7.maxDate = new Date();
      this.datepickerConfig7.showWeekNumbers = false;
      this.datepickerConfig8.dateInputFormat = 'DD/MM/YYYY'
      this.datepickerConfig8.maxDate = new Date();
      this.datepickerConfig8.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger;
    this.patternname = "[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
    this.newEmployeeForm = this._fb.group({
      payrolleligible :true,
      basicSalary : [0,Validators.required],
      variablepay :[0,Validators.required],
      designationid : ['',Validators.required],
      pEmploymentRoleId : [''],
      pdesignation : [],
      branchName : [''],
      residentalstatus :['R',Validators.required],
      placeofbirth :[],
      country : [],
      nationality:[],
      pminoritycommunity : [],
      maritalstatus :['Ma',Validators.required],
      pEntitytype: ['Individual'],
      esieligible :false,
      pfeligible :[],
      khcno :[],
      passportno :[],
      pancardno :['',[Validators.required, Validators.pattern(this.patternname)]],
      pIsPanNoAvailable :[],
      licenseno :[],
      department :['',Validators.required],
      joindate : ['',Validators.required],
      dateofreporting :['',Validators.required],
      previousearnedleaves :[],
      mdesignationid :[],
      pEmploymentRoleName :[],
      pCountryId :[],
      pextracurricularactivities :[],
      pdisciplinaryactions :[],
      contact :['',Validators.required],
      pJoinedAs : ['',Validators.required],
      pjoinedasid : [],
      relationship : [],
      education : [],
      bloodgroup : [],
      uanno :[],
      physicalhandicap :[],
      esiNo:[''],
      pfNo:[''],
      healthProblems:[''],
      branchNameClaim : [],
      pjoinedas :[],
      contactId : [0]
    });

    this.familyDetailsForm = this._fb.group({
      familyrelationshipid:[''],
      familyrelationship:['', Validators.required],
      familyName:['', Validators.required],
      familyDOB:['', Validators.required],
      familyAge:[''],
      familyGender:['M'],
      familyMartialstatus:['M'],
      familyeducationid:[''],
      familyeducation:[''],
      familyoccupation:[''],
      familyphno:[''],
    });
    this.educationDetailsForm = this._fb.group({
     educationCourse:['', Validators.required],
     educationGroup:['', Validators.required],
     educationSchool:['', Validators.required],
     educationPlace:['', Validators.required],
     educationYear:[''],
     educationMarks:['']

    });

    this.previousExpDetailsForm = this._fb.group({
      previousorginazationname: ['',Validators.required],
      previousdesignationname: ['',Validators.required],
      previousdesignationid: [''],
      previousfromdate: [''],
      previoustodate: [''],
      previouslastpay: [''],
      previousreasonforleaving: [''],
    });

    
    this.kapilCareerDetailsForm = this._fb.group({
      company:['', Validators.required],
      designationCareer:['', Validators.required],
      designationidCareer:[''],
      fromDate:[''],
      toDate:[''],
      sscMinutesNo:[''],
      reasonForTransfer:['', Validators.required],
    });

    this.departmentTrainingDetailsForm = this._fb.group({
      depttrainingcoursename:['', Validators.required],
      depttrainingdate:['', Validators.required],
     
    });  

    this.saveOrUpdateButton = "Save";
    let branch =JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = branch.pbranch_id;
    this.branchName = branch.pbranch_name;

    this.esiNoFlag  = false;
    this.pfNoFlag = false;
    this.pHandicapFlag = false;
    debugger;
    if(this.activetedRoute.snapshot.params['id']){
      console.log("edit id is : ",this.activetedRoute.snapshot.params['id']);
      if(this._SscAgeService._getEmployeeEditDataStatus() == "edit"){
        this.saveOrUpdateButton = "Update";
        this.editEmployeeData();
      }
    }
    else{
      this.saveOrUpdateButton = "Save";
    }
    this.getEmployeeRoles();
    this.getEmployeeDesignations();
    this.GetBranchNames();
    this.getRelationShip();
    this.ViewQualificationDetails();
    this.getContacmaster();
    this.generalinfoshow();
    debugger
   
  
   // {"pbranch_id":34,"pbranch_name":"TEST_SANGAREDDY_25112024"}


  //  this.ctc = this.newEmployeeForm.controls.basicSalary.value + this.newEmployeeForm.controls.variablepay.value;
  this.BlurEventAllControll(this.newEmployeeForm);
  this.BlurEventAllControll(this.familyDetailsForm);
  this.BlurEventAllControll(this.educationDetailsForm);
  this.BlurEventAllControll(this.previousExpDetailsForm);
  this.BlurEventAllControll(this.kapilCareerDetailsForm);
  this.BlurEventAllControll(this.departmentTrainingDetailsForm);

  }


  viewContactEmployee(){
    debugger;
    this.router.navigate(['/EmployeeNewView']);
  }


  editEmployeeData(){
    debugger;
    const employeeNewViewEditData = this._SscAgeService._getEmployeeEditData();
    if(employeeNewViewEditData){
      debugger; 
      document.getElementById('inlineRadio2').setAttribute('disabled',"true");
      document.getElementById('inlineRadio3').setAttribute('disabled',"true");
      document.getElementById('inlineRadio4').setAttribute('disabled',"true");
      document.getElementById('inlineRadio5').setAttribute('disabled',"true");
      document.getElementById('inlineRadio6').setAttribute('disabled',"true");      
      console.log("emp edit data is ",employeeNewViewEditData);
      this.ctc = employeeNewViewEditData.pctcamount;
      //this.contactName = employeeNewViewEditData.pcontactmailingname ;
      //this.contactId = employeeNewViewEditData.pcontactid;
      this.branchId = employeeNewViewEditData.pbranchid;
      this.newEmployeeForm.patchValue({
        basicSalary : this._commonService.currencyformat(employeeNewViewEditData.pbasiamount),
        joindate : new Date(employeeNewViewEditData.pdateofjoining),
        esieligible : employeeNewViewEditData.pisesieligible,
        esiNo : employeeNewViewEditData.pesino,
        pfeligible : employeeNewViewEditData.pispfeligible,
        pfNo : employeeNewViewEditData.ppfno,
        pancardno : employeeNewViewEditData.ppannumber,
        department : employeeNewViewEditData.pdepartment,
        dateofreporting : new Date(employeeNewViewEditData.pdateofreporting),
        payrolleligible : employeeNewViewEditData.pispayrolleligible,
        contact : employeeNewViewEditData.pcontactmailingname,
        healthProblems : employeeNewViewEditData.phealthissues,
        physicalhandicap : employeeNewViewEditData.pisphysicalhandicaped,
        variablepay : this._commonService.currencyformat(employeeNewViewEditData.pallowanceamount),
        designationid : employeeNewViewEditData.pdesignationname,
        mdesignationid : employeeNewViewEditData.pdesignationid,
        pEmploymentRoleId : employeeNewViewEditData.proleid,
        pEmploymentRoleName : employeeNewViewEditData.prolename,
        branchName : this.branchName,
        residentalstatus : employeeNewViewEditData.presidentialstatus,
        placeofbirth : employeeNewViewEditData.pplaceofbirth,
        country : 'India',
        nationality : 'Indian',
        pminoritycommunity : employeeNewViewEditData.pcommunity,
        maritalstatus : employeeNewViewEditData.pmartialstatus,
        khcno : employeeNewViewEditData.pkhcno,
        passportno : employeeNewViewEditData.ppassportno,
        licenseno : employeeNewViewEditData.pdrivinglicenseno,
        pjoinedasid : employeeNewViewEditData.pjoinedas,
        pJoinedAs : employeeNewViewEditData.pdesignationname,
        previousearnedleaves : employeeNewViewEditData.ppreviousearnedleavesclaimdate,
        bloodgroup : employeeNewViewEditData.pbloodgroup,
        uanno : employeeNewViewEditData.puannumber,
        branchNameClaim : this.branchName,
        contactId : employeeNewViewEditData.contactid,
        pCountryId : 1
      });
     
      if(this.newEmployeeForm.controls.esieligible.value == true){
        this.esiNoFlag = true;
      }
      else{
        this.esiNoFlag = false;
      }

      if(this.newEmployeeForm.controls.pfeligible.value == true){
        this.pfNoFlag = true;
      }
      else{
        this.pfNoFlag = false;
      }

      if(this.newEmployeeForm.controls.physicalhandicap.value == true){
        this.pHandicapFlag = true;
      }
      else{
        this.pHandicapFlag = false;
      }

      if(this.newEmployeeForm.controls.pancardno.value){
        this.newEmployeeForm.controls.pIsPanNoAvailable.setValue(true);
      }
      else{
        this.newEmployeeForm.controls.pIsPanNoAvailable.setValue(false);
      }
    }

    this.newEmployeeForm.controls.basicSalary.disable();
    this.newEmployeeForm.controls.contact.disable();
    this.newEmployeeForm.controls.joindate.disable();
  }


  changeJoinDate(){
    debugger;
   let minDate =  this.newEmployeeForm.controls.joindate.value;
   this.datepickerConfig1.minDate = minDate;
   this.newEmployeeForm.controls.dateofreporting.setValue('');
   this.employeeHRMSValidation.dateofreporting = '';
  }

  panAvalableOrNot(){
    debugger;
    if(this.newEmployeeForm.controls.pancardno.value == ''){
      this.newEmployeeForm.controls.pIsPanNoAvailable.setValue(false);
    }
    else{
      this.newEmployeeForm.controls.pIsPanNoAvailable.setValue(true);

    }
    
  }

  totalSalaryCalculation(){
    debugger;
    this.basicSalary = this._commonService.removeCommasInAmount(this.newEmployeeForm.controls.basicSalary.value);

    if(this.newEmployeeForm.controls.variablepay.value != ''){
    this.variablepay = this._commonService.removeCommasInAmount(this.newEmployeeForm.controls.variablepay.value);
    }
    else{
      this.variablepay = 0;
    }

    let totalCost = this.basicSalary + this.variablepay;

    this.ctc = totalCost;

  }

  getContacmaster(){
     this.contacmaster.GetEmployeeContacts().subscribe(contacData => {
      this.contactList = contacData;
     })
  }

  contactChange(event){
    debugger;
    this.newEmployeeForm.controls.contact.setValue(event.contact_mailing_name);
    this.newEmployeeForm.controls.contactId.setValue(event.contactid);
  }


 payrollEligibleChange(event){
   if(event.target.checked){
    this.newEmployeeForm.controls.payrolleligible.setValue(true);
   }
   else{
    this.newEmployeeForm.controls.payrolleligible.setValue(false);
   }
 }

 pfEligibleChange(event){
  if(event.target.checked){
    this.newEmployeeForm.controls.pfeligible.setValue(true);
    this.pfNoFlag = true;
    // this.newEmployeeForm.controls.pfNo.setValidators(Validators.required);
    // this.newEmployeeForm.controls.pfNo.updateValueAndValidity();
    // this.BlurEventAllControll(this.newEmployeeForm);
  }
  else{
    this.newEmployeeForm.controls.pfeligible.setValue(false);
    this.pfNoFlag = false;
    //this.clearPFEligibleValidation();    
  }
 }
//  clearPFEligibleValidation(){
//   this.newEmployeeForm.controls.pfNo.clearValidators();
//   this.newEmployeeForm.controls.pfNo.updateValueAndValidity();
//   this.BlurEventAllControll(this.newEmployeeForm);
//  }
 

 esiEligibleChange(event){
  if(event.target.checked){
    this.newEmployeeForm.controls.esieligible.setValue(true);
    this.esiNoFlag = true;
    // this.newEmployeeForm.controls.esiNo.setValidators(Validators.required);
    // this.newEmployeeForm.controls.esiNo.updateValueAndValidity();
    // this.BlurEventAllControll(this.newEmployeeForm);
  }
  else{
    this.newEmployeeForm.controls.esieligible.setValue(false);
    this.esiNoFlag = false;
    // this.newEmployeeForm.controls.esiNo.clearValidators();
    // this.newEmployeeForm.controls.esiNo.updateValueAndValidity();
    // this.BlurEventAllControll(this.newEmployeeForm);
  }
 }

 physicalHadicapChange(event){
  debugger
  if(event.target.checked){
    this.newEmployeeForm.controls.physicalhandicap.setValue('Physical handicap');
    this.pHandicapFlag = true;
    // this.newEmployeeForm.controls.healthProblems.setValidators(Validators.required);
    // this.newEmployeeForm.controls.healthProblems.updateValueAndValidity();
    // this.BlurEventAllControll(this.newEmployeeForm);
  }
  else{
    this.newEmployeeForm.controls.physicalhandicap.setValue(false);
    this.pHandicapFlag = false;
    // this.newEmployeeForm.controls.healthProblems.clearValidators();
    // this.newEmployeeForm.controls.healthProblems.updateValueAndValidity();
    // this.BlurEventAllControll(this.newEmployeeForm);
  }
 }

 
 ageCalculator(event){
  debugger;
  let age;
    let dob = event;
    if (dob != '' && dob != null) {
      let currentdate = Date.now();
      let agedate = new Date(dob).getTime();
      let timeDiff = Math.abs(currentdate - agedate);
      if (timeDiff.toString() != 'NaN')
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

      this.familyDetailsForm.controls.familyAge.setValue(age);

    }
    else {
      age = 0;
    }
 }

  


 


  addFamilyDetails(){
    debugger;
    // if(this.newEmployeeForm.controls.familyrelationship.value == ''){
    //   this._commonService.showWarningMessage('Please Select Relationship');
    //   return
    // }
    // else if(this.newEmployeeForm.controls.familyName.value == ''){
    //   this._commonService.showWarningMessage('Please Enter Family Name');
    //   return
    // }
    // else if(this.newEmployeeForm.controls.familyDOB.value == '' || this.newEmployeeForm.controls.familyDOB.value == null){
    //   this._commonService.showWarningMessage('Please Select Date of Birth');
    //   return
    // }

   let isValid = true;   
      
    if (this.checkValidations(this.familyDetailsForm, isValid)) {

      if(this.gridButton == 'Update'){
        this.updateFamilyDetails();
      }
      else{

    let familyData = {
      "relationshipid": this.familyDetailsForm.controls.familyrelationshipid.value,
      "relationshipname": this.familyDetailsForm.controls.familyrelationship.value,
      "pname": this.familyDetailsForm.controls.familyName.value,
      "pdateofbirth":this.datePipe.transform(this.familyDetailsForm.controls.familyDOB.value, "yyyy-MM-dd"),
      "page": this.familyDetailsForm.controls.familyAge.value,
      "pgender": this.familyDetailsForm.controls.familyGender.value,
      "pmaritialstatus": this.familyDetailsForm.controls.familyMartialstatus.value,
      "qualificationid": this.familyDetailsForm.controls.familyeducationid.value,
      "qualificationname": this.familyDetailsForm.controls.familyeducation.value,
      "poccupation": this.familyDetailsForm.controls.familyoccupation.value,
      "pphoneno": this.familyDetailsForm.controls.familyphno.value,
      "ptypeofoperation": 'CREATE'
    };
    console.log(familyData);
    this.familydetailsarray.push(familyData);
    this.familyDetailsList = [...this.familydetailsarray];   
    
    this.clearFamilyDetails();

  }
}
}

editFamilyDetails(dataItem){
  debugger;
  this.gridButton = 'Update';
  this.Index = dataItem.rowIndex;
    
  this.familyDetailsForm.controls.familyrelationshipid.setValue(dataItem.dataItem.relationshipid);
  this.familyDetailsForm.controls.familyrelationship.setValue(dataItem.dataItem.relationshipname);
  this.familyDetailsForm.controls.familyName.setValue(dataItem.dataItem.pname);
  this.familyDetailsForm.controls.familyoccupation.setValue(dataItem.dataItem.poccupation);
  this.familyDetailsForm.controls.familyeducation.setValue(dataItem.dataItem.qualificationname);
  this.familyDetailsForm.controls.familyeducationid.setValue(dataItem.dataItem.qualificationid);
  this.familyDetailsForm.controls.familyAge.setValue(dataItem.dataItem.page);
  this.familyDetailsForm.controls.familyphno.setValue(dataItem.dataItem.pphoneno);
  this.familyDetailsForm.controls.familyDOB.setValue(new Date(dataItem.dataItem.pdateofbirth));
  this.familyDetailsForm.controls.familyphno.setValue(dataItem.dataItem.pphoneno);
  this.familyDetailsForm.controls.familyGender.setValue(dataItem.dataItem.pgender);
  this.familyDetailsForm.controls.familyMartialstatus.setValue(dataItem.dataItem.pmaritialstatus);

}

updateFamilyDetails(){
  debugger;
  this.familyDetailsList[this.Index].relationshipid = this.familyDetailsForm.controls.familyrelationshipid.value;
  this.familyDetailsList[this.Index].relationshipname = this.familyDetailsForm.controls.familyrelationship.value;
  this.familyDetailsList[this.Index].pname = this.familyDetailsForm.controls.familyName.value;
  this.familyDetailsList[this.Index].pdateofbirth = this.datePipe.transform(this.familyDetailsForm.controls.familyDOB.value, "yyyy-MM-dd");
  this.familyDetailsList[this.Index].page = this.familyDetailsForm.controls.familyAge.value;
  this.familyDetailsList[this.Index].qualificationname = this.familyDetailsForm.controls.familyeducation.value;
  this.familyDetailsList[this.Index].qualificationid = this.familyDetailsForm.controls.familyeducationid.value;
  this.familyDetailsList[this.Index].poccupation = this.familyDetailsForm.controls.familyoccupation.value;
  this.familyDetailsList[this.Index].pphoneno = this.familyDetailsForm.controls.familyphno.value;
  this.familyDetailsList[this.Index].pgender = this.familyDetailsForm.controls.familyGender.value;
  this.familyDetailsList[this.Index].pmaritialstatus = this.familyDetailsForm.controls.familyMartialstatus.value;

  this.clearFamilyDetails();
}

clearFamilyDetails(){
  this.familyDetailsForm.controls.familyrelationshipid.setValue('');
   this.familyDetailsForm.controls.familyrelationship.setValue('');
   this.familyDetailsForm.controls.familyName.setValue('');
   this.familyDetailsForm.controls.familyDOB.setValue('');
   this.familyDetailsForm.controls.familyAge.setValue('');
   this.familyDetailsForm.controls.familyGender.setValue('M');
   this.familyDetailsForm.controls.familyMartialstatus.setValue('M');
   this.familyDetailsForm.controls.familyeducationid.setValue('');
   this.familyDetailsForm.controls.familyeducation.setValue('');
   this.familyDetailsForm.controls.familyoccupation.setValue('');
   this.familyDetailsForm.controls.familyphno.setValue('');
   this.employeeHRMSValidation.familyrelationship = '';
   this.employeeHRMSValidation.familyName = '';
   this.employeeHRMSValidation.familyDOB = '';
   this.gridButton = 'Add';
}


  familyRelationshipChange(event){
    debugger;
    this.familyDetailsForm.controls.familyrelationshipid.setValue(event.relationshipid);
  }

  familyEducationChange(event){
    debugger;
    this.familyDetailsForm.controls.familyeducationid.setValue(event.qualificationid);
  }

  addEducationDetails(){
    debugger;
   let isValid = true;   
      
    if (this.checkValidations(this.educationDetailsForm, isValid)) {

      if(this.gridButton == 'Update'){
        this.updateEducationDetails();
      }
      else{

    let educationData = {
      "pcourse": this.educationDetailsForm.controls.educationCourse.value,
      "pgroup": this.educationDetailsForm.controls.educationGroup.value,
      "pschool": this.educationDetailsForm.controls.educationSchool.value,
      "pplace": this.educationDetailsForm.controls.educationPlace.value,
      "pyear": this.educationDetailsForm.controls.educationYear.value,
      "ppercentofmarks": +this.educationDetailsForm.controls.educationMarks.value,
      "ptypeofoperation": 'CREATE'
    };
    console.log(educationData);
    this.educationdetailsarray.push(educationData);
    this.educationListData = [...this.educationdetailsarray];   

    this.clearEducationDetails();
  }
  }
}

editEducationDetails(event){
  debugger;
  this.Index = event.rowIndex;
  this.gridButton = 'Update';
  this.educationDetailsForm.controls.educationCourse.setValue(event.dataItem.pcourse),
   this.educationDetailsForm.controls.educationGroup.setValue(event.dataItem.pgroup),
    this.educationDetailsForm.controls.educationSchool.setValue(event.dataItem.pschool),
   this.educationDetailsForm.controls.educationPlace.setValue(event.dataItem.pplace),
   this.educationDetailsForm.controls.educationYear.setValue(event.dataItem.pyear),
   this.educationDetailsForm.controls.educationMarks.setValue(event.dataItem.ppercentofmarks)
}

updateEducationDetails(){
  debugger;
  this.educationListData[this.Index].pcourse = this.educationDetailsForm.controls.educationCourse.value;
  this.educationListData[this.Index].pgroup = this.educationDetailsForm.controls.educationGroup.value;
  this.educationListData[this.Index].pschool = this.educationDetailsForm.controls.educationSchool.value;
  this.educationListData[this.Index].pplace = this.educationDetailsForm.controls.educationPlace.value;
  this.educationListData[this.Index].pyear = this.educationDetailsForm.controls.educationYear.value;
  this.educationListData[this.Index].ppercentofmarks = this.educationDetailsForm.controls.educationMarks.value;

  this.clearEducationDetails();
}

clearEducationDetails(){
  debugger;
  this.educationDetailsForm.controls.educationCourse.setValue('');
  this.educationDetailsForm.controls.educationGroup.setValue('');
  this.educationDetailsForm.controls.educationSchool.setValue('');
  this.educationDetailsForm.controls.educationPlace.setValue('');
  this.educationDetailsForm.controls.educationYear.setValue('');
  this.educationDetailsForm.controls.educationMarks.setValue('');

  this.employeeHRMSValidation.educationCourse = '';
  this.employeeHRMSValidation.educationGroup = '';
  this.employeeHRMSValidation.educationSchool = '';
  this.employeeHRMSValidation.educationPlace = '';
  this.gridButton = 'Add';
}

addPreviousExp(){
  debugger;
  let isValid = true;   
    
  if (this.checkValidations(this.previousExpDetailsForm, isValid)) {
    if(this.gridButton == 'Update'){
      this.updatePrevExp();
    }
    else{
  let previousExpData = {
    "porginazationname": this.previousExpDetailsForm.controls.previousorginazationname.value,
    "pdesignationname": this.previousExpDetailsForm.controls.previousdesignationname.value,
    "pdesignationid": this.previousExpDetailsForm.controls.previousdesignationid.value,
    "pfromdate": this.datePipe.transform(this.previousExpDetailsForm.controls.previousfromdate.value, "yyyy-MM-dd"),
    "ptodate": this.datePipe.transform(this.previousExpDetailsForm.controls.previoustodate.value, "yyyy-MM-dd"),
    "plastpay":this._commonService.removeCommasInAmount(this.previousExpDetailsForm.controls.previouslastpay.value),
    "preasonforleaving": this.previousExpDetailsForm.controls.previousreasonforleaving.value,
    "ptypeofoperation": 'CREATE'
  };
  console.log(previousExpData);
  this.previousexperiencearray.push(previousExpData);
  this.previousexpList = [...this.previousexperiencearray];

  this.clearPreviousExpDetaisl();
}
}
}

editPrevExp(event){
  debugger;
  this.gridButton = 'Update';
  this.Index = event.rowIndex;

  this.previousExpDetailsForm.controls.previousorginazationname.setValue(event.dataItem.porginazationname),
  this.previousExpDetailsForm.controls.previousdesignationname.setValue(event.dataItem.pdesignationname),
  this.previousExpDetailsForm.controls.previousdesignationid.setValue(event.dataItem.pdesignationid),
  this.previousExpDetailsForm.controls.previousfromdate.setValue(new Date(event.dataItem.pfromdate)),
  this.previousExpDetailsForm.controls.previoustodate.setValue(new Date(event.dataItem.ptodate)),
  this.previousExpDetailsForm.controls.previouslastpay.setValue(event.dataItem.plastpay),
  this.previousExpDetailsForm.controls.previousreasonforleaving.setValue(event.dataItem.preasonforleaving)
}

updatePrevExp(){
  debugger;
  this.previousexpList[this.Index].porginazationname = this.previousExpDetailsForm.controls.previousorginazationname.value;
  this.previousexpList[this.Index].pdesignationname = this.previousExpDetailsForm.controls.previousdesignationname.value;
  this.previousexpList[this.Index].pdesignationid = this.previousExpDetailsForm.controls.previousdesignationid.value;
  this.previousexpList[this.Index].pfromdate = this.datePipe.transform(this.previousExpDetailsForm.controls.previousfromdate.value, "yyyy-MM-dd");
  this.previousexpList[this.Index].ptodate = this.datePipe.transform(this.previousExpDetailsForm.controls.previoustodate.value, "yyyy-MM-dd");
  this.previousexpList[this.Index].plastpay = this._commonService.removeCommasInAmount(this.previousExpDetailsForm.controls.previouslastpay.value);
  this.previousexpList[this.Index].preasonforleaving = this.previousExpDetailsForm.controls.previousreasonforleaving.value;

  this.clearPreviousExpDetaisl();
}

clearPreviousExpDetaisl(){
  this.previousExpDetailsForm.controls.previousorginazationname.setValue('');
  this.previousExpDetailsForm.controls.previousdesignationname.setValue('');
  this.previousExpDetailsForm.controls.previousdesignationid.setValue('');
  this.previousExpDetailsForm.controls.previousfromdate.setValue('');
  this.previousExpDetailsForm.controls.previoustodate.setValue('');
  this.previousExpDetailsForm.controls.previouslastpay.setValue('');
  this.previousExpDetailsForm.controls.previousreasonforleaving.setValue('');

  this.employeeHRMSValidation.previousorginazationname = '';
  this.employeeHRMSValidation.previousdesignationname = '';
  this.gridButton = 'Add';
}




previousExpDesignationChange(event){
  debugger;
  this.previousExpDetailsForm.controls.previousdesignationid.setValue(event.designationid);
}

addKapilCareer(){
  debugger;
  let isValid = true;   
    
  if (this.checkValidations(this.kapilCareerDetailsForm, isValid)) {
    if(this.gridButton == 'Update'){
      this.updateKapilCareer();
    }
    else{
  let kapilCareerData =  {

    "pcompanyname":this.kapilCareerDetailsForm.controls.company.value,
    "designationname": this.kapilCareerDetailsForm.controls.designationCareer.value,
    "designationid": this.kapilCareerDetailsForm.controls.designationidCareer.value,
    "pfromdate": this.datePipe.transform(this.kapilCareerDetailsForm.controls.fromDate.value, "yyyy-MM-dd"),
    "ptodate": this.datePipe.transform(this.kapilCareerDetailsForm.controls.toDate.value, "yyyy-MM-dd"),
    "psscminutesno": this.kapilCareerDetailsForm.controls.sscMinutesNo.value,
    "preasonfortransfer": this.kapilCareerDetailsForm.controls.reasonForTransfer.value,
    "ptypeofoperation": 'CREATE'
  }

  console.log(kapilCareerData);

  this.kapilcareerarray.push(kapilCareerData);

  this.kapilCarrerList = [...this.kapilcareerarray];
  this.clearKapilCareer();
}
  }
}

editkapilCareer(event){
  debugger;
  this.Index = event.rowIndex;
  this.gridButton = 'Update';
  this.kapilCareerDetailsForm.controls.company.setValue(event.dataItem.pcompanyname),
  this.kapilCareerDetailsForm.controls.designationCareer.setValue(event.dataItem.designationname),
  this.kapilCareerDetailsForm.controls.designationidCareer.setValue(event.dataItem.designationid),
  this.kapilCareerDetailsForm.controls.fromDate.setValue(new Date(event.dataItem.pfromdate)),
  this.kapilCareerDetailsForm.controls.toDate.setValue(new Date(event.dataItem.ptodate)),
  this.kapilCareerDetailsForm.controls.sscMinutesNo.setValue(event.dataItem.psscminutesno),
  this.kapilCareerDetailsForm.controls.reasonForTransfer.setValue(event.dataItem.preasonfortransfer)

}

updateKapilCareer(){
  debugger;
  this.kapilCarrerList[this.Index].pcompanyname = this.kapilCareerDetailsForm.controls.company.value;
  this.kapilCarrerList[this.Index].designationname = this.kapilCareerDetailsForm.controls.designationCareer.value;
  this.kapilCarrerList[this.Index].designationid = this.kapilCareerDetailsForm.controls.designationidCareer.value;
  this.kapilCarrerList[this.Index].pfromdate = this.datePipe.transform(this.kapilCareerDetailsForm.controls.fromDate.value, "yyyy-MM-dd");
  this.kapilCarrerList[this.Index].ptodate = this.datePipe.transform(this.kapilCareerDetailsForm.controls.toDate.value, "yyyy-MM-dd");
  this.kapilCarrerList[this.Index].psscminutesno = this.kapilCareerDetailsForm.controls.sscMinutesNo.value;
  this.kapilCarrerList[this.Index].preasonfortransfer = this.kapilCareerDetailsForm.controls.reasonForTransfer.value;
  this.clearKapilCareer();
}

clearKapilCareer(){
  this.kapilCareerDetailsForm.controls.company.setValue('');
  this.kapilCareerDetailsForm.controls.designationCareer.setValue('');
  this.kapilCareerDetailsForm.controls.designationidCareer.setValue('');
  this.kapilCareerDetailsForm.controls.fromDate.setValue('');
  this.kapilCareerDetailsForm.controls.toDate.setValue('');
  this.kapilCareerDetailsForm.controls.sscMinutesNo.setValue('');
  this.kapilCareerDetailsForm.controls.reasonForTransfer.setValue('');

  this.employeeHRMSValidation.company = '';
  this.employeeHRMSValidation.designationCareer = '';
  this.employeeHRMSValidation.reasonForTransfer = '';
  this.gridButton = 'Add';
}

designationKapilCareer(event){
  debugger;
  this.kapilCareerDetailsForm.controls.designationidCareer.setValue(event.designationid);

}




addDeptTraining(){
  debugger;
  let isValid = true;   
    
  if (this.checkValidations(this.departmentTrainingDetailsForm, isValid)) {
    if(this.gridButton == 'Update'){
      this.updateDepTraining();
    }
    else{
  let deptrainingData = {
    "pcoursename": this.departmentTrainingDetailsForm.controls.depttrainingcoursename.value,
    "pdate": this.datePipe.transform(this.departmentTrainingDetailsForm.controls.depttrainingdate.value, "yyyy-MM-dd"),
    "ptypeofoperation": 'CREATE'
  }
  console.log(deptrainingData);
  this.departmenttrainingarray.push(deptrainingData);
  this.trainingList = [...this.departmenttrainingarray];

  this.clearDepTraining();
}
  }
}

editDeptTraining(event){
  debugger;
  this.Index = event.rowIndex;
  this.gridButton = 'Update';
  this.departmentTrainingDetailsForm.controls.depttrainingcoursename.setValue(event.dataItem.pcoursename);
  this.departmentTrainingDetailsForm.controls.depttrainingdate.setValue(new Date(event.dataItem.pdate));
}

updateDepTraining(){
  debugger;
  this.trainingList[this.Index].pcoursename = this.departmentTrainingDetailsForm.controls.depttrainingcoursename.value;

  this.trainingList[this.Index].pdate = this.datePipe.transform(this.departmentTrainingDetailsForm.controls.depttrainingdate.value, "yyyy-MM-dd");

  this.clearDepTraining();
}



clearDepTraining(){ 
  this.departmentTrainingDetailsForm.controls.depttrainingcoursename.setValue('');
  this.departmentTrainingDetailsForm.controls.depttrainingdate.setValue('');

  this.employeeHRMSValidation.depttrainingcoursename = '';
  this.employeeHRMSValidation.depttrainingdate = '';
  this.gridButton = 'Add';
}


  designationChange(event){
    debugger;
    this.newEmployeeForm.controls.designationid.setValue(event.designationname);
    this.newEmployeeForm.controls.mdesignationid.setValue(event.designationid);
    //const carrercontrols = <FormGroup>this.contactEmployeeForm['controls']['KapilCareercontrols']; 

  //carrercontrols['controls']['designationname'].setValue($event.target.options[$event.target.selectedIndex].text);
  //carrercontrols['controls']['designationid'].setValue($event.target.value);
    //this.newEmployeeForm.controls.designationname.this.newEmployeeForm.controls.designationCareer.value
  }

  getEmployeeDesignations(){
  this._SscAgeService.getEmployeeDesignations().subscribe(json =>{
    debugger;
    console.log(json);
    this.empdesignationsList = json;
  });
}

joinedAsChange(event){
  debugger;
  this.newEmployeeForm.controls.pjoinedasid.setValue(event.designationid);
  this.newEmployeeForm.controls.pJoinedAs.setValue(event.designationname);

}


  getEmployeeRoles(){
    this._SscAgeService.getEmployeeRoles().subscribe(json =>{
      debugger;
      console.log(json);
      this.empRolesList = json;
    });
  }

  roleChange(event){
    debugger;
    this.newEmployeeForm.controls.pEmploymentRoleId.setValue(event.pEmploymentRoleId);
    this.newEmployeeForm.controls.pEmploymentRoleName.setValue(event.pEmploymentRoleName);
  }

  GetBranchNames(){
    debugger;
    // this._SscAgeService.GetBranchNames().subscribe(res => {
    //   this.branchnamesList = res;
    // })
    let SetBranch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchnamesList = [...SetBranch];
    this.branchList = [...SetBranch];
  }

  claimBranchChange(event){
    debugger;
  }

  getRelationShip(){
    this._SscAgeService.getRelationShip().subscribe(res =>{
      this.relationList = res;
    })
  }

  ViewQualificationDetails(){
    this._SscAgeService.ViewQualificationDetails().subscribe(res => {
      this.educationList = res;
    })
  }

  branchNameChange(event){
    debugger;
    //this.newEmployeeForm.controls.
  }

  countryNameChange(event){
    debugger;
    this.newEmployeeForm.controls.pCountryId.setValue(event.pCountryId);

  }



  generalinfoshow(){
    this.showgeneralinformation = true;
    this.showfamilydetails = false;
    this.showeducation = false;
    this.showpreviousexperience = false;
    this.showkapilcareer = false;
    this.showdepartmenttraining = false;
  }

  familydetailsshow(){
    this.showfamilydetails = true;
    this.showgeneralinformation = false;
    this.showeducation = false;
    this.showpreviousexperience = false;
    this.showkapilcareer = false;
    this.showdepartmenttraining = false;
  }


  editHandler(event){

  }


  removeHandler(event){

  }

  educationshow(){
    this.showeducation = true;
    this.showfamilydetails = false;
    this.showgeneralinformation = false;
    this.showpreviousexperience = false;
    this.showkapilcareer = false;
    this.showdepartmenttraining = false;
  }


  educationeditHandler(event){

  }


  educationremoveHandler(event){

  }


  previousexperienceshow(){
    this.showpreviousexperience = true;
    this.showeducation = false;
    this.showfamilydetails = false;
    this.showgeneralinformation = false;
    this.showkapilcareer = false;
    this.showdepartmenttraining = false;
  }


  experienceeditHandler(event){

  }


  experienceremoveHandler(event){

  }


  kapilcareershow(){
    this.showkapilcareer = true;
    this.showeducation = false;
    this.showfamilydetails = false;
    this.showgeneralinformation = false;
    this.showpreviousexperience = false;
    this.showdepartmenttraining = false;
  }


  kapileditHandler(event){

  }


  kapilremoveHandler(event){

  }


  departmenttrainingshow(){
    this.showdepartmenttraining = true;
    this.showkapilcareer = false;
    this.showeducation = false;
    this.showfamilydetails = false;
    this.showgeneralinformation = false;
    this.showpreviousexperience = false;
  }


  departmenteditHandler(event){

  }


  departmentremoveHandler(event){

  }


  uploadAndProgress(event: any, files) {
    debugger;

    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
        if (extention.toLowerCase() != 'jpg' && extention.toLowerCase() != 'png' && extention.toLowerCase() != 'jpeg' && extention.toLowerCase() != 'pdf') {
          this._commonService.showWarningMessage("Upload jpg or pdf files");
          return
        }

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
          fname = files[i].name;
          formData.append(files[i].name, files[i]);
          //formData.append('NewFileName', this..value["inputfiles"] + '.' + files[i]["name"].split('.').pop());
        }
        size = size / 1024;
        console.log(formData);

        this._commonService.fileUpload(formData).subscribe(data => {
          debugger
          this.kycFileName = data[1];
          if (this.imageResponse)
            this.imageResponse.name = data[1];
          this.kycFilePath = data[0];
          this.pDocFileType = extention
        })
      }


  clearDetails(){
    this.newEmployeeForm.reset();
    this.newEmployeeForm.controls.residentalstatus.setValue('R');
    this.newEmployeeForm.controls.maritalstatus.setValue('Ma');
    this.newEmployeeForm.controls.pEntitytype.setValue('Individual');
    this.newEmployeeForm.controls.payrolleligible.setValue(true);
    this.employeeHRMSValidation.contact = '';
    this.ctc = '';

    this.employeeHRMSValidation.designationid = '';
    this.employeeHRMSValidation.basicSalary = '';
    this.employeeHRMSValidation.pEmploymentRoleId = '';
    this.employeeHRMSValidation.branchName = '';
    this.employeeHRMSValidation.pancardno = '';
    this.employeeHRMSValidation.department = '';
    this.employeeHRMSValidation.joindate = '';
    this.employeeHRMSValidation.pJoinedAs = '';
    this.employeeHRMSValidation.dateofreporting = '';

    //Family Details Clear
    this.familyDetailsForm.controls.familyrelationshipid.setValue('');
    this.familyDetailsForm.controls.familyrelationship.setValue('');
    this.familyDetailsForm.controls.familyName.setValue('');
    this.familyDetailsForm.controls.familyDOB.setValue('');
    this.familyDetailsForm.controls.familyAge.setValue('');
    this.familyDetailsForm.controls.familyGender.setValue('M');
    this.familyDetailsForm.controls.familyMartialstatus.setValue('M');
    this.familyDetailsForm.controls.familyeducationid.setValue('');
    this.familyDetailsForm.controls.familyeducation.setValue('');
    this.familyDetailsForm.controls.familyoccupation.setValue('');
    this.familyDetailsForm.controls.familyphno.setValue('');
    this.employeeHRMSValidation.familyrelationship = '';
    this.employeeHRMSValidation.familyName = '';
    this.employeeHRMSValidation.familyDOB = '';
    this.familydetailsarray = [];
    this.familyDetailsList = [];

    //Education Details Clear
    this.educationDetailsForm.controls.educationCourse.setValue('');
    this.educationDetailsForm.controls.educationGroup.setValue('');
    this.educationDetailsForm.controls.educationSchool.setValue('');
    this.educationDetailsForm.controls.educationPlace.setValue('');
    this.educationDetailsForm.controls.educationYear.setValue('');
    this.educationDetailsForm.controls.educationMarks.setValue('');
    this.employeeHRMSValidation.educationCourse = '';
    this.employeeHRMSValidation.educationGroup = '';
    this.employeeHRMSValidation.educationSchool = '';
    this.employeeHRMSValidation.educationPlace = '';
    this.educationdetailsarray = [];
    this.educationListData = [];

    //Previous Experience Clear
    this.previousExpDetailsForm.controls.previousorginazationname.setValue('');
    this.previousExpDetailsForm.controls.previousdesignationname.setValue('');
    this.previousExpDetailsForm.controls.previousdesignationid.setValue('');
    this.previousExpDetailsForm.controls.previousfromdate.setValue('');
    this.previousExpDetailsForm.controls.previoustodate.setValue('');
    this.previousExpDetailsForm.controls.previouslastpay.setValue('');
    this.previousExpDetailsForm.controls.previousreasonforleaving.setValue('');
    this.employeeHRMSValidation.previousorginazationname = '';
    this.employeeHRMSValidation.previousdesignationname = '';
    this.previousexperiencearray = [];
    this.previousexpList = [];

    //Kapil Carrer Clear
    this.kapilCareerDetailsForm.controls.company.setValue('');
    this.kapilCareerDetailsForm.controls.designationCareer.setValue('');
    this.kapilCareerDetailsForm.controls.designationidCareer.setValue('');
    this.kapilCareerDetailsForm.controls.fromDate.setValue('');
    this.kapilCareerDetailsForm.controls.toDate.setValue('');
    this.kapilCareerDetailsForm.controls.sscMinutesNo.setValue('');
    this.kapilCareerDetailsForm.controls.reasonForTransfer.setValue('');
    this.employeeHRMSValidation.company = '';
    this.employeeHRMSValidation.designationCareer = '';
    this.employeeHRMSValidation.reasonForTransfer = '';
    this.kapilcareerarray = [];
    this.kapilCarrerList = [];

    //Department Clear
    this.departmentTrainingDetailsForm.controls.depttrainingcoursename.setValue('');
    this.departmentTrainingDetailsForm.controls.depttrainingdate.setValue('');
    this.employeeHRMSValidation.depttrainingcoursename = '';
    this.employeeHRMSValidation.depttrainingdate = '';
    this.departmenttrainingarray = [];
    this.trainingList = [];

  }


  saveEmployee(){
    debugger;
    //this is temp
    let isValid = true;
    if (this.checkValidations(this.newEmployeeForm, isValid)) {
      debugger;
      if(this.newEmployeeForm.controls.basicSalary.value == 0){
        this._commonService.showWarningMessage('Basic Salary should be greather than zero(0)');
        return;
      }
      if(this.pfNoFlag == true && this.newEmployeeForm.controls.pfNo.value == ''){
        this._commonService.showWarningMessage('Please Add PF No.');
        return;
      }
      if(this.esiNoFlag == true && this.newEmployeeForm.controls.esiNo.value == ''){
        this._commonService.showWarningMessage('Please Add ESI No.');
        return;
      }
      if(this.pHandicapFlag == true && this.newEmployeeForm.controls.healthProblems.value == ''){
        this._commonService.showWarningMessage('Please Add Health Problems');
        return;
      }
      debugger;
      let data = {    
        "pCreatedby": 14,
	      "bloodgroup": this.newEmployeeForm.controls.bloodgroup.value,
	      "pDocumentName": this.pDocFileType,
	      "pFilename": this.kycFileName,
	      "pDocStorePath": this.kycFilePath,
	      //"precordid": {},
	      //"pemployeecode": {},
	      //"samebranchcode": {},
	      "mdesignationname":  this.newEmployeeForm.controls.designationid.value,
	      "mdesignationid": this.newEmployeeForm.controls.mdesignationid.value,
	      "pEmploymentRoleName":this.newEmployeeForm.controls.pEmploymentRoleName.value,
        //bhargavi start
	      "pEmploymentJoiningDate": this.datePipe.transform(this.newEmployeeForm.controls.joindate.value,"yyyy-MM-dd"),
        //bhargavi end
	      "pkhcno": this.newEmployeeForm.controls.khcno.value,
	      "pispf": this.pfNoFlag,
	      "pisesi": this.esiNoFlag,
	      "pesino": this.newEmployeeForm.controls.esiNo.value,
	      "ppfno": this.newEmployeeForm.controls.pfNo.value,
	      "ppassportno": this.newEmployeeForm.controls.passportno.value,
        //"pIsPanNoAvailable": true,
	      "pdrivinglicienceno":this.newEmployeeForm.controls.licenseno.value ,
	      "pdepartment": this.newEmployeeForm.controls.department.value,
	      "pjoinedasid": this.newEmployeeForm.controls.pjoinedasid.value,
	      "pjoinedas": this.newEmployeeForm.controls.pJoinedAs.value,
	      "pearnedleavesclaimbranch":this.newEmployeeForm.controls.branchNameClaim.value,
	      "phealthproblems": this.newEmployeeForm.controls.healthProblems.value,
	      "uan_number": this.newEmployeeForm.controls.uanno.value,
	      "pishandicaped": this.pHandicapFlag,
	      "pdisciplinaryactions": this.newEmployeeForm.controls.pdisciplinaryactions.value,
	      "pextracurricularactivities": this.newEmployeeForm.controls.pextracurricularactivities.value,
        "pEmploymentBasicSalary": this._commonService.removeCommasInAmount(this.newEmployeeForm.controls.basicSalary.value),
        "branchid": this.branchId,
        "branchName": this.newEmployeeForm.controls.branchName.value,
        "presidentialstatus": this.newEmployeeForm.controls.residentalstatus.value,
        "pplaceofbirth": this.newEmployeeForm.controls.placeofbirth.value,
        "pnationality": this.newEmployeeForm.controls.nationality.value,
        "pminoritycommunity": this.newEmployeeForm.controls.pminoritycommunity.value,
        "pmaritalstatus": this.newEmployeeForm.controls.maritalstatus.value,
        "pbasicsalary": this._commonService.removeCommasInAmount(this.newEmployeeForm.controls.basicSalary.value),
        "pBranchName": this.newEmployeeForm.controls.branchName.value,
        "payrolleligible": this.newEmployeeForm.controls.payrolleligible.value,
        "pcontactid": this.newEmployeeForm.controls.contactId.value,
        "ppancardno": this.newEmployeeForm.controls.pancardno.value,
        "pIsPanNoAvailable": this.newEmployeeForm.controls.pIsPanNoAvailable.value,
        "pEmploymentRoleId": this.newEmployeeForm.controls.pEmploymentRoleId.value,
        "pdesignation": this.newEmployeeForm.controls.pdesignation.value,
        "pCountryId": this.newEmployeeForm.controls.pCountryId.value,
        "pBranchId": this.branchId,
        "pdateofreporting": this.datePipe.transform(this.newEmployeeForm.controls.dateofreporting.value,"yyyy-MM-dd"),
        //"pjoindate": ,
        "ppreviouesearnedleavesdate": this.datePipe.transform(this.newEmployeeForm.controls.previousearnedleaves.value,"yyyy-MM-dd"),
        "pEmploymentCTC": this.ctc,
        "pEmploymentAllowanceORvda": this._commonService.removeCommasInAmount(this.newEmployeeForm.controls.variablepay.value),
        "plstkapilcarrer":this.kapilCarrerList,
        "plsttrainigdetails" : this.trainingList,
        "plstpreviousexp":this.previousexpList,
        "plsteducation":this.educationListData,
        "plstemployess":this.familyDetailsList
      }
  
      let formData =    JSON.stringify(data);
      console.log("this is save data :  ",formData);
      debugger;
      this._SscAgeService.SaveContactEmployee(formData).subscribe(res =>{
        debugger;
        if(this.saveOrUpdateButton == "Update"){
          this._commonService.showInfoMessage("Updated Successfully");
          this.saveOrUpdateButton = "Save";
          document.getElementById('inlineRadio2').removeAttribute('disabled');
          document.getElementById('inlineRadio3').removeAttribute('disabled');
          document.getElementById('inlineRadio4').removeAttribute('disabled');
          document.getElementById('inlineRadio5').removeAttribute('disabled');
          document.getElementById('inlineRadio6').removeAttribute('disabled');
          this._SscAgeService._setEmployeeEditDataStatus("");
          this._SscAgeService._setemployeeEditData("");
        }
        else if(this.saveOrUpdateButton == "Save"){
          this._commonService.showInfoMessage("Saved Successfully");
        }
        this.clearData();
      },(error)=>{
        this._commonService.showErrorMessage(error);
      });
    }
  }

  clearData(){
    this.newEmployeeForm.reset();
    this.newEmployeeForm.controls.residentalstatus.setValue('R');
    this.newEmployeeForm.controls.maritalstatus.setValue('Ma');
    this.newEmployeeForm.controls.pEntitytype.setValue('Individual');
    this.newEmployeeForm.controls.payrolleligible.setValue(true);
    this.employeeHRMSValidation.contact = '';
    this.ctc = 0;

    this.employeeHRMSValidation.designationid = '';
    this.employeeHRMSValidation.basicSalary = '';
    this.employeeHRMSValidation.pEmploymentRoleId = '';
    this.employeeHRMSValidation.branchName = '';
    this.employeeHRMSValidation.pancardno = '';
    this.employeeHRMSValidation.department = '';
    this.employeeHRMSValidation.joindate = '';
    this.employeeHRMSValidation.pJoinedAs = '';
    this.employeeHRMSValidation.dateofreporting = '';
    
    }

  // VALIDATIONS

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
          this.employeeHRMSValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.employeeHRMSValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
      return false;
    }



  }
}
