
import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ReplaySubject } from 'rxjs';
declare let $: any
@Component({
  selector: 'app-employee-details-new',
  templateUrl: './employee-details-new.component.html',
  styles: []
})
export class EmployeeDetailsNewComponent implements OnInit {
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  ctc=0;
  basic:any;
  allowance:any;
  contactEmployeeForm: FormGroup;
  EmployeeDetailsValidation:any;
  Traings:any;
  familydetailsTransType="Add";
  //TrainingcontrolsTransType="Add";
  //KapilCareercontrolsTransType="Add";
  //priviousexpControlsTransType="Add";
  //EducationControlsTransType="Add";
  buttonName = "Save";
  showhealthproblems=false;
  showesi=false;
  showpf=false;
  public isLoading: boolean = false;
  checked = 'Resident';
  pMaritalChecked = 'Married';
  countryDetails: any;
  lstemployess:any= [];
  qualificationlist:any=[];
  Branchlist:any=[];
  //lsteducation:any= [];
  relationshipList:any=[];
  rolesList:any=[];
  //lstpreviousexp:any= [];
  lstDesignation:any;
  //lstkapilcarrer:any= [];
  //lsttrainigdetails:any= [];
 
  familyindex = 0;
  //educationindex = 0;
  public isAgecalculation: boolean = true;
  //prvexpindex = 0;

  //carrerindex = 0;

  //trainingindex = 0;

  
 
  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDobConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDobConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDobConfig3: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  datej: string;


  constructor(private toastr: ToastrService, private _FIIndividualService: FIIndividualService,private _route: ActivatedRoute, private _Employee: EmployeeService, private _commonService: CommonService, private formbuilder: FormBuilder, private _contacmasterservice: ContacmasterService,private datePipe: DatePipe,private _routes: Router) 
  { 
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY'
   // this.pDobConfig.containerClass = this._commonService.DatePickerDateFormat("containerClass");
    this.pDobConfig.showWeekNumbers = false;
    this.pDobConfig.maxDate = new Date();
    //this.pDobConfig.dateInputFormat = this._commonService.DatePickerDateFormat("dateInputFormat");
  }

  ngOnInit() 
  {
    this.getCountryDetails();
    this.GetRoles();
    this.GetDesignations();
    this.GetRealtions();
    this.GetQualifications();
    this.GetBranches();
    this.tabsClick('family-details');
    this.EmployeeDetailsValidation = {};
    this.Traings = {};
    this.contactEmployeeForm = this.formbuilder.group({
      precordid: [''],
      pcontactid: [''],
      pemployeecode: [''],
      //schemaid: [this._commonService.pschemaname],
      //schemaname: ['schemaname'],
      //samebranchcode: [this._commonService.pschemaname],
      pEmploymentBasicSalary: ['', Validators.required],
      pEmploymentAllowanceORvda: ['', Validators.required],
      pEmploymentCTC: [''],
      mdesignationname: ['', Validators.required],
      mdesignationid: [''],
      // pEmploymentDesignation: [''],
      pEmploymentRoleId: ['', Validators.required],
      pEmploymentRoleName: [''],
      pEmploymentJoiningDate: ['', Validators.required],
      presidentialstatus: ['Resident'],
      pplaceofbirth: [''],
      pCountryId: ['', Validators.required],
      pCountry: [''],
      pnationality: [''],
      pminoritycommunity: [''],
      pmaritalstatus: ['Married'],
      pkhcno: [''],
      pesino: [''],
      ppfno: [''],
      pispf: false,
      pisesi: false,
      ppassportno: [''],
      pBranchId: [''],
      pBranchName: [''],
      // ppancardno:['',[Validators.required,Validators.pattern]],
      // pdrivinglicienceno:['',Validators.required],
      pdesignation: [''],
      //pdepartment:['',Validators.required],
      pbasicsalary: [0],
      // pdateofreporting:['',Validators.required],
      // pjoinedasid:['',Validators.required],
      pjoinedas: [''],
      // pjoindate:['',Validators.required],    
      ppreviouesearnedleavesdate: [''],
      pearnedleavesclaimbranch: [''],
      phealthproblems: [''],
      pishandicaped: false,
      lstemployess: [],
      //lsteducation: [],
      //lstpreviousexp:[],
      //lstkapilcarrer:[],
      //lsttrainigdetails:[],
      pdisciplinaryactions: [''],
      pextracurricularactivities: [''],
      plistofcopies: [''],
      FamilyControls: this.addFamilyDetailscontrlos(),
      //EducationControls:this.addEducationDetailscontrlos(),
      //priviousexpControls:this.addPrvExpDetailscontrlos(),
      //KapilCareercontrols:this.addkapilcarrierdetails(),
      //Trainingcontrols:this.addtrainingdetails(),
      plstemployess: this.formbuilder.array([]),
      //plsteducation: this.formbuilder.array([]),    
      //plstpreviousexp: this.formbuilder.array([]),    
      //plstkapilcarrer: this.formbuilder.array([]),    
      //plsttrainigdetails: this.formbuilder.array([]),    
    });
    this.BlurEventAllControll(this.contactEmployeeForm);
    // debugger;
    // const deapartmenttrainingControls = <FormGroup>this.contactEmployeeForm['controls']['Trainingcontrols']; 
    // this.BlurEventAllControll(deapartmenttrainingControls);

  }
  addFamilyDetailscontrlos(): FormGroup {
    return this.formbuilder.group({
      precordid: [''],
      relationshipid: ['', Validators.required],
      relationshipname: [''],
      pname: ['', Validators.required],
      pdateofbirth: [''],
      page: [''],
      pgender: ['Male'],
      pmaritialstatus: ['Married'],
      qualificationid: [''],
      qualificationname: [''],
      poccupation: [''],
      pphoneno: ['',Validators.minLength(10)],
      pdob:[''],
      ptypeofoperation: [''],
    })
  }


  // validate:any
  //   Validations(){

  //     let isValid = true;
  //     if (this.checkValidations(this.contactEmployeeForm, isValid)) {
  //      this.validate=true;
  //     }
  //     else{
  //       this.validate=false;
  //     }

  //   }


  checkValidationsTraining(group: FormGroup): boolean {

    let isValid = true;
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControlTraining(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControlTraining(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {

      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidationsTraining(formcontrol)
        }
        else if (formcontrol.validator) {
          this.EmployeeDetailsValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.EmployeeDetailsValidation[key] += errormessage + ' ';
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
  getCountryDetails(): void {
    
    this._contacmasterservice.getCountryDetails().subscribe(json => {

      debugger;
      if (json != null) {
        this.countryDetails = json;

      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });

  }
  designationname_Change($event: any) {
    this.contactEmployeeForm['controls']['mdesignationname'].setValue($event.designationname);
    this.contactEmployeeForm['controls']['mdesignationid'].setValue($event.designationid);
  }
  joined_Change($event: any) {
    this.contactEmployeeForm['controls']['pjoinedas'].setValue($event.designationname);
    this.contactEmployeeForm['controls']['pjoinedasid'].setValue($event.designationid);
  }
  Branch_Change($event: any) {
    this.contactEmployeeForm['controls']['pBranchName'].setValue($event.pBranchName);
    this.contactEmployeeForm['controls']['pBranchId'].setValue($event.pBranchId);
  }
  role_Change($event: any) {
    this.contactEmployeeForm['controls']['pEmploymentRoleName'].setValue($event.pemploymentrole);
    this.contactEmployeeForm['controls']['pEmploymentRoleId'].setValue($event.pemploymentroleid);
  }

  tabsClick(tabname) {
    debugger;
    $('.nav-item a[href="#family-details"]').tab('show');
  }
  designationname_Changecarrer($event: any) {
    const carrercontrols = <FormGroup>this.contactEmployeeForm['controls']['KapilCareercontrols'];
    carrercontrols['controls']['designationname'].setValue($event.designationname);
    carrercontrols['controls']['designationid'].setValue($event.designationid);

  }
  designationname_Changeexp($event: any) {
    const Educatioexpcontrol = <FormGroup>this.contactEmployeeForm['controls']['priviousexpControls'];
    Educatioexpcontrol['controls']['pdesignationname'].setValue($event.designationname);
    Educatioexpcontrol['controls']['pdesignationid'].setValue($event.designationid);

  }
  relationship_Change($event: any) {
    debugger;

    this.contactEmployeeForm['controls']['FamilyControls']['controls']['relationshipid'].setValue($event.relationshipid);
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['relationshipname'].setValue($event.relationshipname);

  }
  Qualification_Change($event: any) {
    debugger;

    this.contactEmployeeForm['controls']['FamilyControls']['controls']['qualificationid'].setValue($event.qualificationid);
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['qualificationname'].setValue($event.qualificationname);

  }
  pCountry_Change($event: any) {

    // this.contactEmployeeForm['controls']['designationname'].setValue($event.target.options[$event.target.selectedIndex].text);
    this.contactEmployeeForm['controls']['pCountryId'].setValue($event.target.value);

  }
  addFamilyDetails(): void {
    debugger;
    const FamilyControls = <FormGroup>this.contactEmployeeForm['controls']['FamilyControls'];
    if (this.checkValidationsTraining(FamilyControls)) {

      if (this.familydetailsTransType == 'Update') {

        if (this.lstemployess[this.familyindex].precordid > 0) {
          FamilyControls['controls']['ptypeofoperation'].setValue('UPDATE');
        }
        else {
          FamilyControls['controls']['ptypeofoperation'].setValue('CREATE');
        }
       // this.datePipe.transform(this.FdTranscationform.controls.pDepositDate.value, "yyyy/dd/MM"
      // let date=this.datePipe.transform(FamilyControls['controls']['pdateofbirth'].value,"dd/MM/yyyy")
      //  FamilyControls['controls']['pdateofbirth'].setValue(date);
      let dob=FamilyControls['controls']['pdateofbirth'].value;
      let dateofbirth=(isNullOrEmptyString(dob) || isNullOrUndefined(dob))?"":this.datePipe.transform(new Date(dob),"dd/MM/yyyy"); 
      FamilyControls['controls']['pdob'].setValue(dateofbirth);
      FamilyControls['controls']['precordid'].setValue(this.lstemployess[this.familyindex].precordid);
        //this.lstaddressdetails.splice(this.addressindex);
        this.lstemployess[this.familyindex] = FamilyControls.value;
      }
      else {
        debugger
       // this.isAgecalculation=false;
       let dob=FamilyControls['controls']['pdateofbirth'].value;
       let dateofbirth=(isNullOrEmptyString(dob) || isNullOrUndefined(dob))?"":this.datePipe.transform(new Date(dob),"dd/MM/yyyy");
FamilyControls.patchValue(
  {
    precordid:0,
    ptypeofoperation:'CREATE',
    //pdateofbirth:dateofbirth,
    pdob:dateofbirth,
  }
);
       // FamilyControls['controls']['precordid'].setValue(0);
       // FamilyControls['controls']['ptypeofoperation'].setValue('CREATE');
       // let dob=FamilyControls['controls']['pdateofbirth'].value;
     //let date=this.datePipe.transform(new Date(FamilyControls['controls']['pdateofbirth'].value),"dd/MM/yyyy")
     //   FamilyControls['controls']['pdateofbirth'].setValue(date);
       //FamilyControls['controls']['pdateofbirth'].setValue(this._commonService.DateFormatForGrid(FamilyControls['controls']['pdateofbirth'].value));
        debugger;
        this.lstemployess.push(FamilyControls.value);
       // FamilyControls['controls']['pdateofbirth'].setValue(dob);
      }
      this.familydetailsTransType = 'Add';
      this.clearEmployeeDeatails();
    }

  }





  onFilterChagephc(eve: any) {
    const control = <FormGroup>this.contactEmployeeForm['controls']['phealthproblems'];

    if (eve.target.checked == true) {
      this.contactEmployeeForm.controls.pishandicaped.setValue(true);
      control.setValidators(Validators.required);
      this.showhealthproblems = true;
    }
    else {
      this.contactEmployeeForm.controls.pishandicaped.setValue(false);
      control.clearValidators();
      this.showhealthproblems = false;
    }
    control.updateValueAndValidity();

  }
  clearMainDeatails(): void {
    this.contactEmployeeForm.reset();
    this.buttonName = "Save";
    this.clearEmployeeDeatails();

    //this.clearcarrerDeatails();


    this.lstemployess = [];
    this.EmployeeDetailsValidation = {};
    this.ctc = 0;
    this.contactEmployeeForm['controls']['pmaritalstatus'].setValue('Married');
    this.contactEmployeeForm['controls']['presidentialstatus'].setValue('Resident');
    //  location.reload();
  }







  GetRealtions() {
    this._contacmasterservice.getRelationShip().subscribe(json => {

      if (json != null) {
        this.relationshipList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }

  GetRoles() {
    //this._contacmasterservice.getRoles().subscribe(json => {
    this._FIIndividualService.getEmployementRoleList().subscribe(json => {
      debugger;
      if (json != null) {
        this.rolesList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }

  GetBranches() {
    //  this._contacmasterservice.getBranches().subscribe(json => {

    //    if (json != null) {
    //        this.Branchlist = json           
    //    }
    //},
    //    (error) => {
    //        this._commonService.showErrorMessage(error);
    //    });
  }
  editemployeeDeatails(index): void {
    debugger;
    try {


      const control = <FormGroup>this.contactEmployeeForm['controls']['FamilyControls'];
      debugger;


      control.patchValue(this.lstemployess[index])
      control.controls.relationshipid.setValue(parseInt(this.lstemployess[index].relationshipid));
      control.controls.relationshipname.setValue(this.lstemployess[index].relationshipname);
      control.controls.pmaritialstatus.setValue(this.lstemployess[index].pmaritialstatus);
      if (this.lstemployess[index].qualificationid != '') {
        control.controls.qualificationid.setValue(parseInt(this.lstemployess[index].qualificationid));
        control.controls.qualificationname.setValue(this.lstemployess[index].qualificationname);
        let date1 = this._commonService.getFormatDate(this.lstemployess[index].pdateofbirth)
        control.controls.pdateofbirth.setValue(this._commonService.formatDateFromDDMMYYYY(date1));
        
      }
      this.contactEmployeeForm['controls']['FamilyControls']['controls']['pmaritialstatus'].setValue(this.lstemployess[index].pmaritialstatus);
      this.familydetailsTransType = 'Update';
      this.familyindex = index;
      // this.readonlyaddressdetals = true;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }

  clearEmployeeDeatails(): void {
    //this.contactEmployeeForm['controls']['FamilyControls'].reset();
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['precordid'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['relationshipid'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['relationshipname'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['pname'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['pdateofbirth'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['page'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['pgender'].setValue('Male');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['pmaritialstatus'].setValue('Married');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['qualificationid'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['qualificationname'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['poccupation'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['pphoneno'].setValue('');
    this.contactEmployeeForm['controls']['FamilyControls']['controls']['ptypeofoperation'].setValue('');
    this.EmployeeDetailsValidation = {};
    this.familydetailsTransType = 'Add';
  }




  deleteemployeeDeatails(index): void {

    try {

      this.lstemployess.splice(index, 1);
      this.familydetailsTransType = 'Add';
      this.familyindex = 0;

    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }

  GetQualifications() {
    this._contacmasterservice.getQualifications().subscribe(json => {

      if (json != null) {
        this.qualificationlist = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }




  GetDesignations() {
    this._contacmasterservice.getdesignations().subscribe(json => {

      if (json != null) {
        this.lstDesignation = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  // pCountry_Change($event: any): void {
  // debugger;
  //   const countryid = $event.target.value;
  //   debugger;
  //   if (countryid && countryid != '') {
  //       const countryName = $event.target.options[$event.target.selectedIndex].text;
  //       this.contactEmployeeForm['controls']['pcountryofbirth'].setValue(countryName);
  //   }
  // }
  ctcCalculation() {

    let a = this.contactEmployeeForm.controls.pEmploymentBasicSalary.value;
    let b = this.contactEmployeeForm.controls.pEmploymentAllowanceORvda.value;
    this.ctc = 0;
    if (a != "" && a != null) {
      if (a.toString().includes(',')) {
        this.basic = this.functiontoRemoveCommas(a);
        this.basic = +this.basic;
      }
      else {
        this.basic = +a
      }
    }
    else {
      this.basic = +a;
    }
    if (b != "" && b != null) {
      if (b.toString().includes(',')) {
        this.allowance = this.functiontoRemoveCommas(b);
        this.allowance = +this.allowance
      }
      else {
        this.allowance = +b;
      }
    }
    else {
      this.allowance = +b;
    }
    if (this.basic == "" && this.allowance == "") {
      this.ctc = 0;
    }
    else {
      this.ctc = this.basic + this.allowance;
      this.contactEmployeeForm.controls.pEmploymentCTC.setValue(this.ctc);
    }


  }
  public functiontoRemoveCommas(value) {
    let a = value.split(',')
    let b = a.join('')
    let c = b
    return c;
  }
  SaveEmployeeForm() {
    // this.Validations();
    debugger;
    let relationshipid= this.contactEmployeeForm['controls']['FamilyControls']['controls']['relationshipid'].value;
    if(relationshipid!=''){
      this._commonService.showWarningMessage('Enter Family Details.')
        return;
    }
    let CountryofBirth=this.contactEmployeeForm['controls']['pCountryId'].value;
    if(CountryofBirth==null){
      this._commonService.showWarningMessage('Select Country of Birth.')
      return;
    }
    // this.employeeDetails.contactEmployeeForm.controls.precordid.setValue(0);
    // this.employeeDetails.contactEmployeeForm.controls.pschemaname.setValue(this.contactMoreForm.controls.pschemaname.value);
    // this.employeeDetails.contactEmployeeForm.controls.schemaid.setValue(this.contactMoreForm.controls.schemaid.value);
    // this.employeeDetails.contactEmployeeForm.controls.samebranchcode.setValue(this.contactMoreForm.controls.samebranchcode.value);
    if (this.validateSaveDeatails(this.contactEmployeeForm)) {
      //       if(this.contactEmployeeForm.controls.precordid.value==null)
      // {
      //   this.contactEmployeeForm.controls.precordid.setValue('');
      // }
      // if(this.contactEmployeeForm.controls.pschemaname.value==null)
      // {
      //   this.contactEmployeeForm.controls.pschemaname.setValue('');
      // }
      // if(this.contactEmployeeForm.controls.schemaid.value==null)
      // {
      //   this.contactEmployeeForm.controls.schemaid.setValue('');
      // }
      // if(this.contactEmployeeForm.controls.samebranchcode.value==null)
      // {
      //   this.contactEmployeeForm.controls.samebranchcode.setValue('');
      // }
      this.contactEmployeeForm.controls.pEmploymentBasicSalary.setValue(this._commonService.functiontoRemoveCommas(this.contactEmployeeForm.controls.pEmploymentBasicSalary.value));
        let basicsalary=this.contactEmployeeForm.controls.pEmploymentBasicSalary.value;
      if(basicsalary<=0){
        this.contactEmployeeForm.controls.pEmploymentBasicSalary.setValue('');
        this._commonService.showWarningMessage('Basic Salary Must be Greater than Zero.')
        return;
      }
      this.contactEmployeeForm.controls.pEmploymentAllowanceORvda.setValue(this._commonService.functiontoRemoveCommas(this.contactEmployeeForm.controls.pEmploymentAllowanceORvda.value));
      // this.contactEmployeeForm.controls.pEmploymentCTC.setValue(this._commonService.removeCommasInAmount(this.contactEmployeeForm.controls.pEmploymentCTC.value));


      if (this.contactEmployeeForm.controls.presidentialstatus.value == "Resident") {
        this.contactEmployeeForm.controls.presidentialstatus.setValue("R");
      }
      if (this.contactEmployeeForm.controls.presidentialstatus.value == "Non-Resident") {
        this.contactEmployeeForm.controls.presidentialstatus.setValue("N");
      }
      if (this.contactEmployeeForm.controls.presidentialstatus.value == "Foreign National") {
        this.contactEmployeeForm.controls.presidentialstatus.setValue("F");
      }
      if (this.contactEmployeeForm.controls.presidentialstatus.value == "Person of Indian Origin") {
        this.contactEmployeeForm.controls.presidentialstatus.setValue("P");
      }
      if (this.contactEmployeeForm.controls.pmaritalstatus.value == "Married") {
        this.contactEmployeeForm.controls.pmaritalstatus.setValue("Ma");
      }

      if (this.contactEmployeeForm.controls.pmaritalstatus.value == "Un-Married") {
        this.contactEmployeeForm.controls.pmaritalstatus.setValue("U");
      }
      if (this.contactEmployeeForm.controls.pmaritalstatus.value == "Single") {
        this.contactEmployeeForm.controls.pmaritalstatus.setValue("Si");
      }
      if (this.contactEmployeeForm.controls.pmaritalstatus.value == "Separated") {
        this.contactEmployeeForm.controls.pmaritalstatus.setValue("Se");
      }
      if (this.contactEmployeeForm.controls.pmaritalstatus.value == "Widowed") {
        this.contactEmployeeForm.controls.pmaritalstatus.setValue("Wi");
      }



      for (let i = 0; i < this.lstemployess.length; i++) {
        debugger;
        const Employeeoncontol = <FormArray>this.contactEmployeeForm['controls']['plstemployess'];
        Employeeoncontol.push(this.addFamilyDetailscontrlos());
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['precordid'].setValue(this.lstemployess[i].precordid);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['relationshipid'].setValue(this.lstemployess[i].relationshipid);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['relationshipname'].setValue(this.lstemployess[i].relationshipname);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pname'].setValue(this.lstemployess[i].pname);
       // let dob = this.datePipe.transform( this.lstemployess[i].pname.value);      
       let dob = this.datePipe.transform(this.lstemployess[i].pdateofbirth, "yyyy-MM-dd");

       this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pdateofbirth'].setValue(dob);
       this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pdob'].setValue(dob);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['page'].setValue(this.lstemployess[i].page);
        if (this.lstemployess[i].pgender == "Male") {
          this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pgender'].setValue('M');
        }
        if (this.lstemployess[i].pgender == "Female") {
          this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pgender'].setValue('F');

        }
        if (this.lstemployess[i].pgender == "Third Gender") {
          this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pgender'].setValue('T');
        }
        if (this.lstemployess[i].pmaritialstatus == "Married") {
          this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pmaritialstatus'].setValue('M');

        }
        if (this.lstemployess[i].pmaritialstatus == "Un-Married") {
          this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pmaritialstatus'].setValue('U');

        }
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['qualificationid'].setValue(this.lstemployess[i].qualificationid);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['qualificationname'].setValue(this.lstemployess[i].qualificationname);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['poccupation'].setValue(this.lstemployess[i].poccupation);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['pphoneno'].setValue(this.lstemployess[i].pphoneno);
        this.contactEmployeeForm['controls']['plstemployess']['controls'][i]['controls']['ptypeofoperation'].setValue(this.lstemployess[i].ptypeofoperation);
      }
      this.datej = this.datePipe.transform(new  Date(this.contactEmployeeForm.controls.pEmploymentJoiningDate.value), 'yyyy-MM-dd');
      this.contactEmployeeForm.controls.pEmploymentJoiningDate.setValue(this.datej)
      
      let data = JSON.stringify(this.contactEmployeeForm.value);
      debugger;
      const Employeeoncontol = <FormArray>this.contactEmployeeForm['controls']['plstemployess'];
      for (let i = Employeeoncontol.length - 1; i >= 0; i--) {
        Employeeoncontol.removeAt(i)
      }




      debugger;
      if (confirm("Do you want to save ?")) {

        this._contacmasterservice.saveEmployeeDetails(data).subscribe(res => {
          if (this.buttonName == "Save") {
            this._commonService.showInfoMessage("Employee Details Saved Successfully");
          }
          if (this.buttonName == "Update") {
            this._commonService.showInfoMessage("Employee Details Updated Successfully");
          }
          this.clearMainDeatails();
          // this._routes.navigate(['/configuration/ContactListView'], { queryParams: { ID: this.contactEmployeeForm.id} })

        }
        )
      }
    }
  }


  validateSaveDeatails(control: FormGroup): boolean {
    let isValid = true;

    try {
      isValid = this.checkValidations(control, isValid);

    } catch (e) {
      this.showErrorMessage(e);

    }
    return isValid;
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(key: string, isValid: boolean): boolean {
    try {

      let formcontrol;
      formcontrol = this.contactEmployeeForm.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.contactEmployeeForm['controls']['FamilyControls'].get(key);
      // formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          if (key != 'FamilyControls')
            this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.EmployeeDetailsValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.EmployeeDetailsValidation[key] += errormessage + ' ';
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

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup) {

    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {


        this.setBlurEvent(key);



        // this.setBlurEvent(key);
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
      formcontrol = this.contactEmployeeForm.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            this.contactEmployeeForm.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(key, true) })
        }
      }

      else {

        formcontrol = <FormGroup>this.contactEmployeeForm['controls']['FamilyControls'].get(key);
        if (formcontrol) {
          if (formcontrol instanceof FormGroup) {

            this.BlurEventAllControll(formcontrol)
          }
          else {
            if (formcontrol.validator)
              this.contactEmployeeForm['controls']['FamilyControls'].get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(key, true) })
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  ageCalculation(event) {
    debugger
    let age;
    if(this.isAgecalculation){
     // let dob = this.contactEmployeeForm['controls']['FamilyControls']['controls']['pdateofbirth'].value;
      let dob = event;
      if (dob != '' && dob != null) {
        let currentdate = Date.now();
        //let agedate = new Date(dob);
        let agedate = new Date(dob).getTime();
        let timeDiff = Math.abs(currentdate - agedate);
        if (timeDiff.toString() != 'NaN')
          age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        
          
          // this.contactForm['controls']['pAge'].setValue(age);
          this.contactEmployeeForm['controls']['FamilyControls']['controls']['page'].setValue(age);
        
        // else if (age < 18) {
  
        //   this._commonService.showWarningMessage("Sorry, only persons over the age of 18");
        //   this.contactEmployeeForm['controls']['FamilyControls']['controls']['pdateofbirth'].setValue('');
        //   this.contactEmployeeForm['controls']['FamilyControls']['controls']['page'].setValue('');
  
  
        // }
      }
      else {
        age = 0;
      }
    }
    


  }
}