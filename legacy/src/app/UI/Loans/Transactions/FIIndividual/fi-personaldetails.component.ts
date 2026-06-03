import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FiPersonaldetailsEmploymentComponent } from './PersonalDetails/fi-personaldetails-employment.component';
import { PersonalDetailsComponent } from '../../../Common/personal-details/personal-details.component'
import { FiPersonaldetailsFamilyComponent } from './PersonalDetails/fi-personaldetails-family.component';
import { FiPersonaldetailsNomineeComponent } from './PersonalDetails/fi-personaldetails-nominee.component';
import { BankdetailsComponent } from '../../../Common/bankdetails/bankdetails.component'
import { FiPersonaldetailsIncomeComponent } from './PersonalDetails/fi-personaldetails-income.component';
import { FiPersonaldetailsOtherincomeComponent } from './PersonalDetails/fi-personaldetails-otherincome.component';
import { FiPersonaldetailsEducationComponent } from './PersonalDetails/fi-personaldetails-education.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { FIIndividualService } from '../../../../Services/Loans/Transactions/fiindividual.service';
import { FiPersonalinformationModel } from '../../../../Models/Loans/Transasctions/fi-personalinformation-model';
import { FiContacttypeComponent } from './fi-contacttype.component';
import { FiPersonaldetailsBusinessComponent } from './PersonalDetails/fi-personaldetails-business.component';
import { FiPersonaldetailsFinancialperformanceComponent } from './PersonalDetails/fi-personaldetails-financialperformance.component';
import { log } from 'util';
import { MemberService } from '../../../../Services/Banking/member.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { forkJoin } from 'rxjs';
declare let $: any
@Component({
  selector: 'app-fi-personaldetails',
  templateUrl: './fi-personaldetails.component.html',
  styles: []
})
export class FiPersonaldetailsComponent implements OnInit {

  @ViewChild(FiContacttypeComponent, { static: false }) fiContacttypeComponent: FiContacttypeComponent;
  @ViewChild(FiPersonaldetailsFinancialperformanceComponent, { static: false }) BusinessfinanicialDetails: FiPersonaldetailsFinancialperformanceComponent;
  @ViewChild(FiPersonaldetailsBusinessComponent, { static: false }) BusinessactivityDetails: FiPersonaldetailsBusinessComponent;
  @ViewChild(FiPersonaldetailsIncomeComponent, { static: false }) incomeDetails: FiPersonaldetailsIncomeComponent;
  @ViewChild(FiPersonaldetailsOtherincomeComponent, { static: false }) otherIncomeDetails: FiPersonaldetailsOtherincomeComponent;
  @ViewChild(FiPersonaldetailsEducationComponent, { static: false }) educationDetails: FiPersonaldetailsEducationComponent;
  @ViewChild(FiPersonaldetailsEmploymentComponent, { static: false }) employmentDetails: FiPersonaldetailsEmploymentComponent;
  @ViewChild(PersonalDetailsComponent, { static: false }) personalDetails: PersonalDetailsComponent;
  @ViewChild(FiPersonaldetailsFamilyComponent, { static: false }) familytDetails: FiPersonaldetailsFamilyComponent;
  @ViewChild(FiPersonaldetailsNomineeComponent, { static: false }) nomineeDetails: FiPersonaldetailsNomineeComponent;
  @ViewChild(BankdetailsComponent, { static: false }) bankDetails: BankdetailsComponent;
  @ViewChild(FiPersonaldetailsOtherincomeComponent, { static: false }) otherincomeDetails: FiPersonaldetailsOtherincomeComponent;

  // for 1st tab select contact type - Kiran Gaikwad
  @Input() selectedContactType: string;
  @Input() forClearButton: boolean;

  @Output() selectedContactTypeForPersonalLoan = new EventEmitter();
  @Output() enteredEmployeeDetails = new EventEmitter();
  @Output() enteredIncomeDetails = new EventEmitter();
  @Output() enteredOtherIncomeDetails = new EventEmitter();
  @Output() forSecurityColletralGetData = new EventEmitter();
  @Output() enteredBusinessActivityDetails = new EventEmitter();
  @Output() enteredBusinessFinancialDetails = new EventEmitter();
  @Output() forGettingKYCDataEmit = new EventEmitter();
  @Output() forGettingFIMemberReferenceDataEmit = new EventEmitter();

  incomeFormData: any;
  lstApplicantsandothers: any;
  selectedRowIndex: any;
  previousRowData: any;
  newlist: any;
  enteredEmployeeData: any;
  ///Mahesh M
  FiMemberFormDetails: any;
  FormName: any;

  forIndividualFlag: boolean = false;
  forBusinessEntityFlag: boolean = false;
  dataAdded: boolean = false;
  addCheckFlag: boolean = false;
  loading: boolean = false;
  applicantConfigDetailsStatus = false;
  isapplicable = true;
  isApplicant: boolean = false;
  showForm = true;
  showEmployeement = true;
  showPersonal = true;
  showFamily = true;
  showNominee = true;
  showBank = true;
  showIncome = true;
  showEducation = true;
  showBusinessActivity = true;
  showBusinessFinacial = true;
  public isLoading: boolean = false;
  notApplicableForAll: boolean = true;
  //Mahesh M
  ContactDetailsShowOrHideForMember: Boolean

  applicantsConfigDetails = '';
  vchapplicationId = '';
  typeofoperation = 'CREATE';
  buttonName = "Save & Continue";
  dropdoenTabname: string;

  FiPersonalinformationModel: FiPersonalinformationModel = {};

  listEmployeementRowIndex = 0;

  _FirstInformationTabsData: any = [];
  permissionData: any = [];
  public PersonalDetailsIndividualTab: boolean = true;
  public EmploymentDetailsTab: boolean = true;
  public PersonalDetailsTab: boolean = true;
  public FamilyDetailsTab: boolean = true;
  public NomineeDetailsTab: boolean = true;
  public BankDetailsTab: boolean = true;
  public IncomeDetailsTab: boolean = true;
  public EducationDetailsTab: boolean = true;
public contacmasterContactDetails:any;
public ContactDetailsByID:any;
public ContactDetailsByIDbankdetailslist:any;
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }

  constructor(private _route: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _commonService: CommonService,
    private _FIIndividualService: FIIndividualService,
    private _MemberService: MemberService, private _contacmasterservice: ContacmasterService ) { }

  ngOnChanges(): void {
    var isPresent = this._FirstInformationTabsData.some(function (el) { return el.pTabsectionname === "Personal Details" });
    if (isPresent == true) {
      const example = this._FirstInformationTabsData.filter(data => data.pTabsectionname === "Personal Details");
      this.permissionData = example[0].lstFITabSubsection;
      if (this.permissionData[0].psubsectionenablestatus == true) {
        this.PersonalDetailsIndividualTab = true;
      } else {
        this.PersonalDetailsIndividualTab = false;
      }
      if (this.permissionData[1].psubsectionenablestatus == true) {
        this.EmploymentDetailsTab = true;
      } else {
        this.EmploymentDetailsTab = false;
      }
      if (this.permissionData[2].psubsectionenablestatus == true) {
        this.PersonalDetailsTab = true;
      } else {
        this.PersonalDetailsTab = false;
      }
      if (this.permissionData[3].psubsectionenablestatus == true) {
        this.FamilyDetailsTab = true;
      } else {
        this.FamilyDetailsTab = false;
      }
      if (this.permissionData[4].psubsectionenablestatus == true) {
        this.NomineeDetailsTab = true;
      } else {
        this.NomineeDetailsTab = false;
      }
      if (this.permissionData[5].psubsectionenablestatus == true) {
        this.BankDetailsTab = true;
      } else {
        this.BankDetailsTab = false;
      }
      if (this.permissionData[6].psubsectionenablestatus == true) {
        this.IncomeDetailsTab = true;
      } else {
        this.IncomeDetailsTab = false;
      }
      if (this.permissionData[7].psubsectionenablestatus == true) {
        this.EducationDetailsTab = true;
      } else {
        this.EducationDetailsTab = false;
      }
    }
  }
  ngOnInit() {
    this.contacmasterContactDetails='';
    this.FiPersonalinformationModel = {}
    this.ContactDetailsShowOrHideForMember = true;

    ///Mahesh M 
    this._MemberService._GetFiMemberTab1Data().subscribe(res => {
      // debugger
      if (res != null && res != undefined && res != "") {
        this.FiMemberFormDetails = res
        this.vchapplicationId = this.FiMemberFormDetails[0].pMemberReferenceId;
        this.FormName = this.FiMemberFormDetails[0].fromForm
        if (this.FormName == "FiMemberDetailsForm") {
          this.ContactDetailsShowOrHideForMember = false;
        } else {
          this.ContactDetailsShowOrHideForMember = true;
        }
      }
    });
    ///

    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        if (this.lstApplicantsandothers && this.lstApplicantsandothers.length > 0) {
          for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
            /**
             * ----> To show default selection of Applicant radio button, Here I wrote Jquery
             *       code to select applicant as default, by using dynamic id. i.e. #perapplicant
             */
            if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
              $('#perapplicant-' + i).prop('checked', true);
              this.applicantsConfigDetails = this.lstApplicantsandothers[i].papplicantname + '-' + this.lstApplicantsandothers[i].papplicanttype;
              this.selectedRowIndex = i;
              this.loadPreviousData(true);
              if (this.bankDetails)
                this.bankDetails.Bankpersonname = this.lstApplicantsandothers[i].papplicantname;
              this.isApplicant = true;
              break;
            }
            else {
              this.isApplicant = false;
            }
          }
        }

        //Mahesh M
        this.vchapplicationId = res.pVchapplicationid;
        //
      }
    })

    this.newlist = [];
    if (this.personalDetails) {
      this.personalDetails.familydetailsshowhide = false;
    }
    const routeParams = this._route.snapshot.params['id'];
    if (routeParams !== undefined) {
      this.typeofoperation = 'Update';
    }

    this.notApplicableAll(this.notApplicableForAll);
  }

  /**--------(Start)---- change event on radio button of users data(Contact data)-------(Start)------ */
  applicantNameChange(rowIndex) {
    if (this.notApplicableForAll == false) {
      this.addCheckFlag = false;
    }
    this.selectedRowIndex = rowIndex;
    let rowdata = this.lstApplicantsandothers[rowIndex];
    if (rowdata.papplicanttype == 'Applicant' || rowdata.papplicanttype == 'Member') {
      this.isApplicant = true;
    }
    else {
      this.isApplicant = false;
    }
    this.applicantsConfigDetails = rowdata.papplicantname + ' - ' + rowdata.papplicanttype;
    this.applicantConfigDetailsStatus = true;
    let data = { pcontactid: rowdata.pcontactid, pcontactreferenceid: rowdata.pcontactreferenceid, papplicanttype: rowdata.papplicanttype, pisapplicable: this.isapplicable };
    this.previousRowData = data;
    /***
     * -----> Here based on selected contact type, we are retrieving (binding or getting) 
     *        data of that checked radio button of particular user. Here data is fetching from
     *        model i.e. FiPersonalinformationModel
     */
    if (this.selectedContactType == 'Individual') {
      this.setConfigEmploymentDetails(rowdata);
      this.setConfigPersonalDetails(rowdata);
      this.setConfigFamilyDetails(rowdata);
      this.setConfigNomineeDetails(rowdata);
      this.setConfigIncomeDetails(rowdata);
      this.setConfigOtherIncomeDetails(rowdata);
      this.setConfigEducationDetails(rowdata);
      this.setConfigBankDetails(rowdata);
    }
    else if (this.selectedContactType == "Business Entity") {
      this.setConfigBusinessactivityDetails(rowdata);
      this.setConfigBusinessfinanicialDetails(rowdata);
      this.setConfigBankDetails(rowdata);
    }

    this.bankDetails.Bankpersonname = rowdata.papplicantname;
    /**---- (Start)----- This method is using for status od particular user, after adding -----(Start)--- */
    this.forStatus(rowdata.pcontactreferenceid, this.selectedRowIndex);
    /**---- (End)-----This method is using for status od particular user, after adding -----(End)--- */

    /**--------(Start)------ For disable or enable main Not applicable button----(Start)---- */
    this.disablePersonalDetail();
    /**--------(End)------ For disable or enable main Not applicable button----(End)---- */

  }
  /**--------(End)---- change event on radio button of users data(Contact data)-------(End)------ */

  /**--(Start)-- For selected contact we are using this method, and here we are adding extra---(Start)
   *             keys as pisapplicable, ptypeofoperation, pCreatedby
   */
  loadPreviousData(isapplicable): any {
    let rowdata = this.lstApplicantsandothers[this.selectedRowIndex];
    let data;
    data = { pcontactid: rowdata.pcontactid, pcontactreferenceid: rowdata.pcontactreferenceid, papplicanttype: rowdata.papplicanttype, pisapplicable: isapplicable, ptypeofoperation: this.typeofoperation, pCreatedby: this._commonService.pCreatedby }
    return data;
  }
  /**--(End)-- For selected contact we are using this method, and here we are adding extra---(End) */

  /**-----(Start)------This is used for load previous data form model-----------(Start)-------- */
  loadNewListData(): any {
    return this.newlist;
  }
  /**-----(End)------This is used for load previous data form model-----------(End)-------- */

  /**--------(Start)-------Adding data to FiPersonalinformationModel acording to selecting user ----(Start)----
   * -------> Here after adding to FiPersonalinformationModel we are setting again data from FiPersonalinformationModel
   *          to that perticular user, so here we are setting data after adding.
   */
  applicantConfigDetails() {
    this.dataAdded = true;
    let bankDetails: boolean = false;
    let employmentDetails: boolean = false;
    let personalDetails: boolean = false;
    let familyDetails: boolean = false;
    let nomineeDetails: boolean = false;
    let incomeDetails: boolean = false;
    let otherIncomeDetails: boolean = false;
    let educationDetails: boolean = false;
    let businessActivity: boolean = false;
    let businessFinancialDetails: boolean = false;
    let selectedUserData = this.lstApplicantsandothers[this.selectedRowIndex];
    let commonUserDataForAll = {
      pcontactid: selectedUserData.pcontactid,
      pcontactreferenceid: selectedUserData.pcontactreferenceid,
      papplicanttype: selectedUserData.papplicanttype,
      ptypeofoperation: 'CREATE',
    }
    /**
     * ------> Here we are adding data based on type i.e. Individual or Business Entity.
     *         And here for every collapse panel I taken booleans.
     *         Those booleans are above declared booleans. Based on main Not applicable and 
     *         based on Individual Not Applicable flag I am changing those boolean true or false.
     */
    if (this.selectedContactType == 'Individual') {
      if (!this.showEmployeement) {
        this.getConfigEmploymentDetails();
        employmentDetails = true;
      }
      else {
        employmentDetails = true;
      }

      if (!this.showPersonal) {
        this.getConfigPersonalDetails();
        personalDetails = true;
      }
      else {
        personalDetails = true;
      }

      if (!this.showFamily) {
        this.getConfigFamilyDetails();
        familyDetails = true;
      }
      else {
        familyDetails = true;
      }

      if (!this.showNominee) {
        this.getConfigNomineeDetails();
        nomineeDetails = true;
      }
      else {
        nomineeDetails = true;
      }

      if (!this.showIncome) {
        this.getConfigIncomeDetails();
        this.getConfigOtherIncomeDetails();
        otherIncomeDetails = true;
        incomeDetails = true;
      }
      else {
        incomeDetails = true;
        otherIncomeDetails = true;
      }

      if (!this.showEducation) {
        this.getConfigEducationDetails();
        educationDetails = true;
      }
      else {
        educationDetails = true;
      }
    }

    if (this.selectedContactType == 'Business Entity') {
      if (!this.showBusinessActivity) {
        this.getConfigBusinessactivityDetails();
        businessActivity = true;
      }
      else {
        businessActivity = true;
      }
      if (!this.showBusinessFinacial) {
        this.getConfigBusinessfinanicialDetails();
        businessFinancialDetails = true;
      }
      else {
        businessFinancialDetails = true;
      }
    }
    /**
     * ---->Here bank is common for both Indivdual and Business Entity. That's why I wrote seperately.
     */
    if (!this.showBank) {
      this.getConfigBankDetails();
      bankDetails = true;
    }
    else {
      bankDetails = true;
    }
    /**
     * ----> Based on booleans I am showing message as Added successfully.
     *       And flag i.e. forIndividualFlag is used for validations. But we removed those validations.
     *       So this forIndividualFlag is not using now. But I won't remove this. If we need validations
     *       this flag may help while saving application (in SaveApplicationPersonalInformation() method)
     */
    if (this.selectedContactType == 'Individual') {
      if (!this.notApplicableForAll) {

        if (employmentDetails && personalDetails && familyDetails
          && nomineeDetails && incomeDetails && otherIncomeDetails
          && educationDetails && bankDetails) {
          this.forIndividualFlag = true;
          this.otherIncomeDetails.dataOFCompute = null;
          if (this.FormName != "FiMemberDetailsForm") {
            this._commonService.showInfoMessage("Personal details added successfully!");
          }
        }
        else {
          this.forIndividualFlag = false;
        }
      }
      else {
        if (employmentDetails && personalDetails && familyDetails
          && nomineeDetails && incomeDetails && otherIncomeDetails
          && educationDetails && bankDetails) {
          this.forIndividualFlag = true;
        }
      }
    }
    else if (this.selectedContactType == "Business Entity") {
      if (!this.notApplicableForAll) {
        if (businessActivity && businessFinancialDetails && bankDetails) {
          this.forBusinessEntityFlag = true;
          if (this.FormName != "FiMemberDetailsForm") {
            this._commonService.showInfoMessage("Personal details added successfully!");
          }
        }
        else {
          this.forBusinessEntityFlag = false;;
        }
      }
      else {
        if (businessActivity && businessFinancialDetails && bankDetails) {
          this.forBusinessEntityFlag = true;
        }
      }
    }

    /**
     * -----> Here incomeFormdata is for calcualting for date of compute value in Income and other Income
     *        Details, SO this incomeFormData coming from 
     *        <app-fi-personaldetails-income> by using forComputeDetailsEmit() 
     *        and we are sending this incomeFormData to 
     *        <app-fi-personaldetails-otherincome> by using [incomeFormData]
     */
    if (this.otherIncomeDetails) {
      this.otherIncomeDetails.incomeFormData = null;
    }

    /**
     * -----> After adding to FiPersonalinformationModel we have to change status. For change status 
     *        we are using this forStatus()
     */
    this.forStatus(selectedUserData.pcontactreferenceid, this.selectedRowIndex);

    /**-----(Start)---After adding to FiPersonalinformationModel - binding data-------(Start)--------------
     *      we must bind data of that perticular user.
     *      So that's why calling or setting data from FiContacttypeComponent here again 
     */
    let rowdata = this.lstApplicantsandothers[this.selectedRowIndex];
    if (this.selectedContactType == 'Individual') {
      if (this.showEmployeement == false) {
        this.setConfigEmploymentDetails(rowdata);
      }
      if (this.showPersonal == false) {
        this.setConfigPersonalDetails(rowdata);
      }
      if (this.showFamily == false) {
        this.setConfigFamilyDetails(rowdata);
      }
      if (this.showNominee == false) {
        this.setConfigNomineeDetails(rowdata);
      }
      if (this.showIncome == false) {
        this.setConfigIncomeDetails(rowdata);
        this.setConfigOtherIncomeDetails(rowdata);
      }
      if (this.showEducation == false) {
        this.setConfigEducationDetails(rowdata);
      }
      if (this.showBank == false) {
        this.setConfigBankDetails(rowdata);
      }
    }
    else if (this.selectedContactType == "Business Entity") {
      if (this.showBusinessActivity == false) {
        this.setConfigBusinessactivityDetails(rowdata);
      }
      if (this.showBusinessFinacial == false) {
        this.setConfigBusinessfinanicialDetails(rowdata);
      }
      if (this.showBank == false) {
        this.setConfigBankDetails(rowdata);
      }
    }
    /**-----(End)---After adding to FiPersonalinformationModel - binding data -------(End)-------------- */

  }
  /**--------(End)-------Adding data to FiPersonalinformationModel acording to selecting user ----(End) */

  /**
   * -------(Start)----- For moving from 5th tab to 6th tab-----------(Start)---------------
   */
  NextTabClick() {
    debugger
    //Mahesh M
    if (this.FormName == "FiMemberDetailsForm") {
      let str = "references"
      this.dropdoenTabname = "references"
      $('.nav-item a[href="#' + str + '"]').tab('show');
      // let str;
      // let temptabname;
      // this.dropdoenTabname = this._commonService.GetFiTabName();
      // let tempFirstInformationTabsData = this._FirstInformationTabsData;
      // for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      //   let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      //   if (pTabsectionname == this.dropdoenTabname) {
      //     str = tempFirstInformationTabsData[i + 4].pTabsectionid;
      //     temptabname = tempFirstInformationTabsData[i + 4].pTabsectionname;
      //   }
      // }
      // this._commonService.SetFiTabName(temptabname);
      // this.dropdoenTabname = temptabname;
      // $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    }
    else {
      let str;
      let temptabname;
      let tempdropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let datas = this._FIIndividualService.moevToNextTab(tempFirstInformationTabsData, tempdropdoenTabname);
      str = datas.tabId;
      temptabname = datas.tabName;
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      // str = "security-collateral"
      // this.dropdoenTabname = "Security and Collateral"
      // $('.nav-item a[href="#' + str + '"]').tab('show');
    }
    //
  }
  /**-------(End)----- For moving from 5th tab to 6th tab-----------(End)--------------- */

  /**-----(Start)---- For saving Persoanl details(5th tab)------------------ (Start)-------- */
  SaveApplicationPersonalInformation() {
    debugger;
    let saveFlag: boolean = false;
    if (this.FormName == "FiMemberDetailsForm") {
      this.applicantConfigDetails();
    }
    if (this.notApplicableForAll) {
      saveFlag = true;
    }
    /**
     * ----> Here this.dataAdded boolean for sending empty arrays to APIs
     *       when doesn't click on Add button. When on page load this dataAdded boolean false. 
     *       So it will send all empty arrays 
     */
    if (this.dataAdded) {
      if (this.selectedContactType == 'Individual') {
        // if(this.forIndividualFlag) {
        saveFlag = true;
        // }
      }
      else {
        // if (this.forBusinessEntityFlag) {
        saveFlag = true;
        // }
      }
    }
    else {
      if (this.selectedContactType == 'Individual') {
        if (!(this.FiPersonalinformationModel.PersonalEmployeementList) || this.FiPersonalinformationModel.PersonalEmployeementList.length == 0) {
          this.FiPersonalinformationModel.PersonalEmployeementList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalDetailsList) || this.FiPersonalinformationModel.PersonalDetailsList.length == 0) {
          this.FiPersonalinformationModel.PersonalDetailsList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalFamilyList) || this.FiPersonalinformationModel.PersonalFamilyList.length == 0) {
          this.FiPersonalinformationModel.PersonalFamilyList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalNomineeList) || this.FiPersonalinformationModel.PersonalNomineeList.length == 0) {
          this.FiPersonalinformationModel.PersonalNomineeList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalBankList) || this.FiPersonalinformationModel.PersonalBankList.length == 0) {
          this.FiPersonalinformationModel.PersonalBankList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalIncomeList) || this.FiPersonalinformationModel.PersonalIncomeList.length == 0) {
          this.FiPersonalinformationModel.PersonalIncomeList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalOtherIncomeList) || this.FiPersonalinformationModel.PersonalOtherIncomeList.length == 0) {
          this.FiPersonalinformationModel.PersonalOtherIncomeList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalEducationList) || this.FiPersonalinformationModel.PersonalEducationList.length == 0) {
          this.FiPersonalinformationModel.PersonalEducationList = [];
        }
        saveFlag = true;
      }
      else if (this.selectedContactType == 'Business Entity') {
        if (!(this.FiPersonalinformationModel.businessDetailsDTOList) || this.FiPersonalinformationModel.businessDetailsDTOList.length == 0) {
          this.FiPersonalinformationModel.businessDetailsDTOList = [];
        }
        if (!(this.FiPersonalinformationModel.businessfinancialdetailsDTOList) || this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length == 0) {
          this.FiPersonalinformationModel.businessfinancialdetailsDTOList = [];
        }
        if (!(this.FiPersonalinformationModel.PersonalBankList) || this.FiPersonalinformationModel.PersonalBankList.length == 0) {
          this.FiPersonalinformationModel.PersonalBankList = [];
        }
        saveFlag = true;
      }
    }

    if (saveFlag) {
      let employeeFlag: boolean = false;
      let financilaFlag: boolean = false;
      let incomeFlag: boolean = false;
      let otherIncomeFlag: boolean = false;

      if (this.FiPersonalinformationModel.PersonalEmployeementList && this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
        let tempEmployementArr = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.PersonalEmployeementList));
        for (let i = 0; i < tempEmployementArr.length; i++) {
          tempEmployementArr[i].pCreatedby = this._commonService.pCreatedby;
          let checkFlagForEstDate: boolean = false;
          let checkFlagForCommenceDate: boolean = false;
          if (tempEmployementArr[i].pdateofestablishment) {
            checkFlagForEstDate = (tempEmployementArr[i].pdateofestablishment).toString().includes('/');
          }
          if (tempEmployementArr[i].pdateofcommencement) {
            checkFlagForCommenceDate = (tempEmployementArr[i].pdateofcommencement).toString().includes('/');
          }
          if (checkFlagForEstDate == true) {
            tempEmployementArr[i].pdateofestablishment = tempEmployementArr[i].pdateofestablishment ? this._commonService.formatDateFromDDMMYYYY(tempEmployementArr[i].pdateofestablishment) : new Date();
            tempEmployementArr[i].pdateofestablishment = new Date(Date.UTC(tempEmployementArr[i].pdateofestablishment.getFullYear(), tempEmployementArr[i].pdateofestablishment.getMonth(), tempEmployementArr[i].pdateofestablishment.getDate(), tempEmployementArr[i].pdateofestablishment.getHours(), tempEmployementArr[i].pdateofestablishment.getMinutes()));
          }
          if (checkFlagForCommenceDate == true) {
            tempEmployementArr[i].pdateofcommencement = tempEmployementArr[i].pdateofcommencement ? this._commonService.formatDateFromDDMMYYYY(tempEmployementArr[i].pdateofcommencement) : new Date();
            tempEmployementArr[i].pdateofcommencement = new Date(Date.UTC(tempEmployementArr[i].pdateofcommencement.getFullYear(), tempEmployementArr[i].pdateofcommencement.getMonth(), tempEmployementArr[i].pdateofcommencement.getDate(), tempEmployementArr[i].pdateofcommencement.getHours(), tempEmployementArr[i].pdateofcommencement.getMinutes()));
          }

          tempEmployementArr[i].ptypeofoperation = (tempEmployementArr[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
          tempEmployementArr[i].pemployeeexp = tempEmployementArr[i].pemployeeexp ? Number(tempEmployementArr[i].pemployeeexp) : 0;
          tempEmployementArr[i].ptotalworkexp = tempEmployementArr[i].ptotalworkexp ? Number(tempEmployementArr[i].ptotalworkexp) : 0;
        }
        this.FiPersonalinformationModel.PersonalEmployeementList = tempEmployementArr;
      }

      if (this.FiPersonalinformationModel.PersonalDetailsList && this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.PersonalDetailsList.length; i++) {
          this.FiPersonalinformationModel.PersonalDetailsList[i].ptypeofoperation = (this.FiPersonalinformationModel.PersonalDetailsList[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
        }
      }

      if (this.FiPersonalinformationModel.PersonalFamilyList && this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.PersonalFamilyList.length; i++) {
          this.FiPersonalinformationModel.PersonalFamilyList[i].ptypeofoperation = (this.FiPersonalinformationModel.PersonalFamilyList[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
        }
      }

      if (this.FiPersonalinformationModel.PersonalEducationList && this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.PersonalEducationList.length; i++) {
          this.FiPersonalinformationModel.PersonalEducationList[i].ptypeofoperation = (this.FiPersonalinformationModel.PersonalEducationList[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
        }
      }

      if (this.FiPersonalinformationModel.PersonalNomineeList && this.FiPersonalinformationModel.PersonalNomineeList.length > 0) {
        let tempNomineeeArr = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.PersonalNomineeList));
        for (let i = 0; i < tempNomineeeArr.length; i++) {
          tempNomineeeArr[i].pCreatedby = this._commonService.pCreatedby;
          let checkFlagForDate: boolean = false;
          if (tempNomineeeArr[i].pdateofbirth && tempNomineeeArr[i].pdateofbirth != undefined && tempNomineeeArr[i].pdateofbirth != '') {
            checkFlagForDate = (tempNomineeeArr[i].pdateofbirth).toString().includes('/');
            if (checkFlagForDate == true) {
              tempNomineeeArr[i].pdateofbirth = tempNomineeeArr[i].pdateofbirth ? this._commonService.formatDateFromDDMMYYYY(tempNomineeeArr[i].pdateofbirth) : new Date();
              tempNomineeeArr[i].pdateofbirth = new Date(Date.UTC(tempNomineeeArr[i].pdateofbirth.getFullYear(), tempNomineeeArr[i].pdateofbirth.getMonth(), tempNomineeeArr[i].pdateofbirth.getDate(), tempNomineeeArr[i].pdateofbirth.getHours(), tempNomineeeArr[i].pdateofbirth.getMinutes()));
            }
          }
        }
        this.FiPersonalinformationModel.PersonalNomineeList = tempNomineeeArr;
      }

      // }, 0);
      // setTimeout(() => {
      if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList) {
        for (let i = 0; i < this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length; i++) {

          this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pturnoveramount = (this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pturnoveramount ? Number((this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pturnoveramount.toString()).replace(/,/g, "")) : 0);
          this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pnetprofitamount = (this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pnetprofitamount ? Number((this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pnetprofitamount.toString()).replace(/,/g, "")) : 0);
        }
      }
      // }, 0);
      // setTimeout(() => {
      if (this.FiPersonalinformationModel.PersonalIncomeList && this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.PersonalIncomeList.length; i++) {
          this.FiPersonalinformationModel.PersonalIncomeList[i].paverageannualexpenses = this.FiPersonalinformationModel.PersonalIncomeList[i].paverageannualexpenses ? Number((this.FiPersonalinformationModel.PersonalIncomeList[i].paverageannualexpenses).toString().replace(/,/g, "")) : 0;
          this.FiPersonalinformationModel.PersonalIncomeList[i].pgrossannualincome = this.FiPersonalinformationModel.PersonalIncomeList[i].pgrossannualincome ? Number((this.FiPersonalinformationModel.PersonalIncomeList[i].pgrossannualincome).toString().replace(/,/g, "")) : 0;
          this.FiPersonalinformationModel.PersonalIncomeList[i].pnetannualincome = this.FiPersonalinformationModel.PersonalIncomeList[i].pnetannualincome ? Number((this.FiPersonalinformationModel.PersonalIncomeList[i].pnetannualincome).toString().replace(/,/g, "")) : 0;
          this.FiPersonalinformationModel.PersonalIncomeList[i].ptypeofoperation = (this.FiPersonalinformationModel.PersonalIncomeList[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
        }
      }
      // }, 0);
      this.FiPersonalinformationModel.pvchapplicationid = this.vchapplicationId;
      this.FiPersonalinformationModel.pCreatedby = this._commonService.pCreatedby;
      this.FiPersonalinformationModel.pIspersonaldetailsapplicable = !this.notApplicableForAll;
      // setTimeout(() => {
      if (this.FiPersonalinformationModel.PersonalOtherIncomeList && this.FiPersonalinformationModel.PersonalOtherIncomeList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.PersonalOtherIncomeList.length; i++) {
          this.FiPersonalinformationModel.PersonalOtherIncomeList[i].pgrossannual = this.FiPersonalinformationModel.PersonalOtherIncomeList[i].pgrossannual ? Number((this.FiPersonalinformationModel.PersonalOtherIncomeList[i].pgrossannual).toString().replace(/,/g, "")) : 0;
        }
      }

      if (this.FiPersonalinformationModel.businessDetailsDTOList && this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
        for (let i = 0; i < this.FiPersonalinformationModel.businessDetailsDTOList.length; i++) {
          this.FiPersonalinformationModel.businessDetailsDTOList[i].pCreatedby = this._commonService.pCreatedby;
          let checkFlagForEstDate: boolean = false;
          let checkFlagForCommenceDate: boolean = false;
          this.FiPersonalinformationModel.businessDetailsDTOList[i].ptypeofoperation = (this.FiPersonalinformationModel.businessDetailsDTOList[i].ptypeofoperation == 'OLD') ? 'UPDATE' : 'CREATE';
          if (this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate) {
            checkFlagForEstDate = (this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate).toString().includes('/');
          }
          if (this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate) {
            checkFlagForCommenceDate = (this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate).toString().includes('/');
          }
          if (checkFlagForEstDate == true) {
            this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate = this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate ? this._commonService.formatDateFromDDMMYYYY(this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate) : new Date();
            this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate = new Date(Date.UTC(this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate.getFullYear(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate.getMonth(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate.getDate(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate.getHours(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pestablishmentdate.getMinutes()));
          }
          if (checkFlagForCommenceDate == true) {
            this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate = this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate ? this._commonService.formatDateFromDDMMYYYY(this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate) : new Date();
            this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate = new Date(Date.UTC(this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate.getFullYear(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate.getMonth(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate.getDate(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate.getHours(), this.FiPersonalinformationModel.businessDetailsDTOList[i].pcommencementdate.getMinutes()));
          }
        }
      }

      this.buttonName = "Processing";
      this.isLoading = true;

      let Data = JSON.stringify(this.FiPersonalinformationModel)
      console.log("FiMember-PersonalData-Save", Data)
      this._FIIndividualService.SaveApplicationPersonalInformation(this.FiPersonalinformationModel).subscribe(json => {

        if (json) {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
          //this._commonService.showInfoMessage('Saved Sucessfully');
          this.FiPersonalinformationModel = {};
          if (this.FormName == "FiMemberDetailsForm") {
            this.forGettingFIMemberReferenceDataEmit.emit(true)
          } else {
            this.forSecurityColletralGetData.emit(true);
          }


          this.NextTabClick();
        }
        else {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        }
      },
        (error) => {
          this.buttonName = "Save & Continue";
          this.isLoading = false;

          this._commonService.showErrorMessage(error);
        });
      // }, 0);
      // let data = JSON.stringify(this.FiPersonalinformationModel);
    }


  }
  /**-----(End)---- For saving Persoanl details(5th tab)------------------ (End)-------- */

  //Employeement Details Set and Get Details
  setConfigEmploymentDetails(rowdata) {
    let existingTotalEmployeementData = this.FiPersonalinformationModel.PersonalEmployeementList;
    let existingEmployeementData;
    let p = 0;
    if (existingTotalEmployeementData) {
      for (let i = 0; i < existingTotalEmployeementData.length; i++) {
        if (existingTotalEmployeementData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingEmployeementData = existingTotalEmployeementData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingTotalEmployeementData.length) {
        this.showEmployeement = true;
      }
      else {
        this.showEmployeement = false;
      }
      if (this.employmentDetails) {

        this.employmentDetails.setFormData(existingEmployeementData);
      }
    }
  }
  getConfigEmploymentDetails() {

    this.newlist = [];
    let transType = 'NEW';
    let formData;

    if (!this.showEmployeement) {
      if (this.employmentDetails) {
        formData = this.employmentDetails.getFormData();
      }
    }
    let employeementData = this.loadPreviousData(!this.showEmployeement);
    employeementData = Object.assign(employeementData, formData);
    if (employeementData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.PersonalEmployeementList) {
        if (this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEmployeementList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            if (this.FiPersonalinformationModel.PersonalEmployeementList[i].pcontactreferenceid === employeementData.pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEmployeementList[i].pisapplicable = !this.showEmployeement;
              if (!this.showEmployeement) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }
      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.PersonalEmployeementList) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEmployeementList.length; i++) {
            if (this.FiPersonalinformationModel.PersonalEmployeementList[i].ptotalworkexp == null || this.FiPersonalinformationModel.PersonalEmployeementList[i].ptotalworkexp == '') {
              this.FiPersonalinformationModel.PersonalEmployeementList[i].ptotalworkexp = 0;
              this.FiPersonalinformationModel.PersonalEmployeementList[i].pemployeeexp = 0;
            }
            this.FiPersonalinformationModel.PersonalEmployeementList[i].ptotalworkexp = Number(this.FiPersonalinformationModel.PersonalEmployeementList[i].ptotalworkexp);
            this.FiPersonalinformationModel.PersonalEmployeementList[i].pemployeeexp = Number(this.FiPersonalinformationModel.PersonalEmployeementList[i].pemployeeexp);

          }
          this.newlist = this.FiPersonalinformationModel.PersonalEmployeementList;
        }
        employeementData.ptotalworkexp = employeementData.ptotalworkexp ? Number(employeementData.ptotalworkexp) : 0;
        employeementData.pemployeeexp = employeementData.pemployeeexp ? Number(employeementData.pemployeeexp) : 0;
        this.newlist.push(employeementData);
        this.FiPersonalinformationModel.PersonalEmployeementList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.PersonalEmployeementList[updateIndex] = employeementData;
      }
    }
    if (this.employmentDetails)
      this.employmentDetails.ngOnInit();
  }

  //Personal Details Set and Get Details
  setConfigPersonalDetails(rowdata) {
    let existingTotalPersonalData = this.FiPersonalinformationModel.PersonalDetailsList;
    let existingPersonalData;

    let p = 0;
    if (existingTotalPersonalData) {
      for (let i = 0; i < existingTotalPersonalData.length; i++) {
        if (existingTotalPersonalData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingPersonalData = existingTotalPersonalData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingTotalPersonalData.length) {
        this.showPersonal = true;
      }
      else {
        this.showPersonal = false;
      }

      if (this.personalDetails) {
        this.personalDetails.setFormData(existingPersonalData);
      }
    }
  }

  getConfigPersonalDetails() {
    this.newlist = [];
    let transType = 'NEW';
    let formData;
    if (!this.showPersonal) {
      if (this.personalDetails)
        formData = this.personalDetails.sendFormData();
    }
    let PersonalData = this.loadPreviousData(!this.showPersonal);

    PersonalData = Object.assign(PersonalData, formData);
    if (PersonalData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.PersonalDetailsList) {
        if (this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalDetailsList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            if (this.FiPersonalinformationModel.PersonalDetailsList[i].pcontactreferenceid === PersonalData.pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalDetailsList[i].pisapplicable = !this.showPersonal;
              if (!this.showPersonal) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }
      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.PersonalDetailsList) {
          this.newlist = this.FiPersonalinformationModel.PersonalDetailsList;
        }
        this.newlist.push(PersonalData);
        this.FiPersonalinformationModel.PersonalDetailsList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.PersonalDetailsList[updateIndex] = PersonalData;
      }
    }
    if (this.personalDetails)
      this.personalDetails.ngOnInit();
  }

  //Family Details Set and Get Details
  setConfigFamilyDetails(rowdata) {
    debugger;
    let existingTotalFamilyData = this.FiPersonalinformationModel.PersonalFamilyList;
    let existingFamilyData;
    let p = 0;
    if (existingTotalFamilyData) {
      for (let i = 0; i < existingTotalFamilyData.length; i++) {
        if (existingTotalFamilyData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingFamilyData = existingTotalFamilyData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingTotalFamilyData.length) {
        this.showFamily = true;
      }
      else {
        this.showFamily = false;
      }
      if (this.familytDetails) {
        this.familytDetails.setFormData(existingFamilyData);
      }
    }
  }

  getConfigFamilyDetails() {
    this.newlist = [];
    let transType = 'NEW';
    let formData;
    if (!this.showFamily) {
      if (this.familytDetails) {
        formData = this.familytDetails.getFormData();
        formData.ptotalnoofmembers = Number(formData.ptotalnoofmembers);
        formData.pnoofearningmembers = Number(formData.pnoofearningmembers);
        formData.pnoofboyschild = Number(formData.pnoofboyschild);
        formData.pnoofgirlchild = Number(formData.pnoofgirlchild);
      }
    }

    let FamilyData = this.loadPreviousData(!this.showFamily);
    FamilyData = Object.assign(FamilyData, formData);
    if (FamilyData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.PersonalFamilyList) {
        if (this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalFamilyList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            let newcontacreferenceid = FamilyData.pcontactreferenceid;
            let existingcontacreferenceid = this.FiPersonalinformationModel.PersonalFamilyList[i].pcontactreferenceid;
            if (this.FiPersonalinformationModel.PersonalFamilyList[i].pcontactreferenceid === FamilyData.pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalFamilyList[i].pisapplicable = !this.showPersonal;
              if (!this.showFamily) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }

      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.PersonalFamilyList) {
          this.newlist = this.FiPersonalinformationModel.PersonalFamilyList;
        }
        this.newlist.push(FamilyData);
        this.FiPersonalinformationModel.PersonalFamilyList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.PersonalFamilyList[updateIndex] = FamilyData;
      }
    }
    if (this.familytDetails)
      this.familytDetails.ngOnInit();
  }

  //Bank Details Set and Get Details
  setConfigBankDetails(rowdata) {
    let existingTotalBankData = this.FiPersonalinformationModel.PersonalBankList;
    let existingBankData = [];
    let p = 0;
    if (existingTotalBankData) {
      for (let i = 0; i < existingTotalBankData.length; i++) {
        if (existingTotalBankData[i].pcontactreferenceid == rowdata.pcontactreferenceid && existingTotalBankData[i].pBankAccountNo) {
          existingBankData.push(existingTotalBankData[i]);
        }
        else {
          p++;
        }
      }
      if (p == existingTotalBankData.length) {
        this.showBank = true;
      }
      else {
        this.showBank = false;
      }
      if (this.bankDetails) {
        this.bankDetails.setFormData(existingBankData);
      }
    }
  }

  getConfigBankDetails() {
    this.newlist = [];
    let bankData = this.loadPreviousData(!this.showBank);
    let data1 = [];
    if (this.FiPersonalinformationModel.PersonalBankList) {
      data1 = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.PersonalBankList));
    }
    let remainingData = [];
    if (data1) {
      remainingData = data1.filter(item => item.pcontactreferenceid != bankData.pcontactreferenceid);
    }

    let formData;
    if (!this.showBank) {
      if (this.bankDetails) {

        formData = this.bankDetails.bankdetailslist;
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            let bankData = null;
            bankData = this.loadPreviousData(!this.showBank);
            bankData = Object.assign(bankData, formData[i])
            this.newlist.push(bankData);
          }
        }
        this.FiPersonalinformationModel.PersonalBankList = [...remainingData, ...this.loadNewListData()];
      }
    }
    else {
      if (this.showBank) {
        this.FiPersonalinformationModel.PersonalBankList.push(bankData);
      }
    }
    if (this.bankDetails) {
      this.bankDetails.bankdetailslist = [];
    }

  }
  //busimness details Set and Get Details
  setConfigBusinessactivityDetails(rowdata) {
    let existingTotalBusinessactivityData = this.FiPersonalinformationModel.businessDetailsDTOList;
    let existingBusinessactivityData;
    let p = 0;
    if (existingTotalBusinessactivityData) {
      for (let i = 0; i < existingTotalBusinessactivityData.length; i++) {
        if (existingTotalBusinessactivityData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingBusinessactivityData = existingTotalBusinessactivityData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingTotalBusinessactivityData.length) {
        this.showBusinessActivity = true;
      }
      else {
        this.showBusinessActivity = false;
      }
      if (this.BusinessactivityDetails) {
        let checkFlagForEstimateDate: boolean = false;
        let checkFlagForCommmenceneDate: boolean = false;
        if (existingBusinessactivityData) {
          if (existingBusinessactivityData.pestablishmentdate) {
            checkFlagForEstimateDate = (existingBusinessactivityData.pestablishmentdate).toString().includes('/');
          }
          if (existingBusinessactivityData.pcommencementdate) {
            checkFlagForCommmenceneDate = (existingBusinessactivityData.pcommencementdate).toString().includes('/');
          }
          if (checkFlagForEstimateDate) {
            existingBusinessactivityData.pestablishmentdate = this._commonService.formatDateFromDDMMYYYY(existingBusinessactivityData.pestablishmentdate)
          }
          if (checkFlagForCommmenceneDate) {
            existingBusinessactivityData.pcommencementdate = this._commonService.formatDateFromDDMMYYYY(existingBusinessactivityData.pcommencementdate)
          }
        }
        if (this.BusinessactivityDetails) {
          this.BusinessactivityDetails.setFormData(existingBusinessactivityData);
        }
      }
    }
  }
  getConfigBusinessactivityDetails() {
    this.newlist = [];
    let transType = 'NEW';
    let formData;
    if (!this.showBusinessActivity) {
      if (this.BusinessactivityDetails)
        formData = this.BusinessactivityDetails.businessActivityForm.value;
      formData.pCreatedby = this._commonService.pCreatedby;
    }
    let BusinessData = this.loadPreviousData(!this.showBusinessActivity);
    BusinessData = Object.assign(BusinessData, formData);
    if (BusinessData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.businessDetailsDTOList) {
        if (this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.businessDetailsDTOList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            if (this.FiPersonalinformationModel.businessDetailsDTOList[i].pcontactreferenceid === BusinessData.pcontactreferenceid) {
              this.FiPersonalinformationModel.businessDetailsDTOList[i].pisapplicable = !this.showBusinessActivity;
              if (!this.showBusinessActivity) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }
      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.businessDetailsDTOList) {
          this.newlist = this.FiPersonalinformationModel.businessDetailsDTOList;
        }
        this.newlist.push(BusinessData);
        this.FiPersonalinformationModel.businessDetailsDTOList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.businessDetailsDTOList[updateIndex] = BusinessData;
      }
    }
    if (this.BusinessactivityDetails)
      this.BusinessactivityDetails.ngOnInit();
  }

  //businessfinanicial details Set and Get Details
  setConfigBusinessfinanicialDetails(rowdata) {
    let existingTotalBusinessfinanicialData = this.FiPersonalinformationModel.businessfinancialdetailsDTOList;
    let existingBusinessfinanicialData = [];
    let p = 0;
    if (existingTotalBusinessfinanicialData) {
      for (let i = 0; i < existingTotalBusinessfinanicialData.length; i++) {
        if (existingTotalBusinessfinanicialData[i].pcontactreferenceid == rowdata.pcontactreferenceid && existingTotalBusinessfinanicialData[i].pturnoveramount) {
          existingBusinessfinanicialData.push(existingTotalBusinessfinanicialData[i]);
        }
        else {
          p++;
        }
      }
      if (p == existingTotalBusinessfinanicialData.length) {
        this.showBusinessFinacial = true;
      }
      else {
        this.showBusinessFinacial = false;
      }
      if (this.BusinessfinanicialDetails) {
        this.BusinessfinanicialDetails.businessFincialGriddata = existingBusinessfinanicialData;
      }
    }
  }

  getConfigBusinessfinanicialDetails() {
    this.newlist = [];
    let businessfinData = this.loadPreviousData(!this.showBusinessFinacial);
    let data1 = []
    if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList) {
      data1 = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.businessfinancialdetailsDTOList));
    }
    let remainingData = []
    if (data1) {
      remainingData = data1.filter(item => item.pcontactreferenceid != businessfinData.pcontactreferenceid);
    }

    let formData;
    if (!this.showBusinessFinacial) {
      if (this.BusinessfinanicialDetails) {
        formData = this.BusinessfinanicialDetails.getFormData();
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            let businessfinDataForEach = null;
            businessfinDataForEach = this.loadPreviousData(!this.showBusinessFinacial);
            businessfinDataForEach = Object.assign(businessfinDataForEach, formData[i]);
            this.newlist.push(businessfinDataForEach);
          }
        }
        else {
          this.newlist.push(businessfinData);
        }
        this.FiPersonalinformationModel.businessfinancialdetailsDTOList = [...remainingData, ...this.loadNewListData()];
      }
    }
    else {
      if (this.showBusinessFinacial) {
        this.FiPersonalinformationModel.businessfinancialdetailsDTOList.push(businessfinData);
      }
    }
    if (this.BusinessfinanicialDetails) {
      this.BusinessfinanicialDetails.businessFincialGriddata = []
    }
  }

  //Nominee Details Set and Get Details
  setConfigNomineeDetails(rowdata) {
    let existingTotalNomineeData = this.FiPersonalinformationModel.PersonalNomineeList;
    let existingNomineeData = [];
    let p = 0;
    if (existingTotalNomineeData) {
      for (let i = 0; i < existingTotalNomineeData.length; i++) {
        if (existingTotalNomineeData[i].pcontactreferenceid == rowdata.pcontactreferenceid && existingTotalNomineeData[i].pnomineename) {
          existingNomineeData.push(existingTotalNomineeData[i]);
        }
        else {
          p++;
        }
      }
      if (p == existingTotalNomineeData.length) {
        this.showNominee = true;
      }
      else {
        this.showNominee = false;
      }
      if (this.nomineeDetails) {
        this.nomineeDetails.nomineeList = existingNomineeData;
      }
    }
  }

  getConfigNomineeDetails() {
    this.newlist = [];
    let NomineeData = this.loadPreviousData(!this.showNominee);
    let data1 = []
    if (this.FiPersonalinformationModel.PersonalNomineeList) {
      data1 = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.PersonalNomineeList));
    }
    let remainingData = []
    if (data1) {
      remainingData = data1.filter(item => item.pcontactreferenceid != NomineeData.pcontactreferenceid);
    }

    let formData;
    if (!this.showNominee) {
      if (this.nomineeDetails) {
        formData = this.nomineeDetails.nomineeList;
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            let NomineeData = null;
            NomineeData = this.loadPreviousData(!this.showNominee);
            NomineeData = Object.assign(NomineeData, formData[i]);
            this.newlist.push(NomineeData);
          }
        }
        else {
          this.newlist.push(NomineeData);
        }
        this.FiPersonalinformationModel.PersonalNomineeList = [...remainingData, ...this.loadNewListData()];
      }
    }
    else {
      if (this.showNominee) {
        this.FiPersonalinformationModel.PersonalNomineeList.push(NomineeData);
      }
    }
    if (this.nomineeDetails)
      this.nomineeDetails.nomineeList = [];
  }

  //income details Set and Get Details
  setConfigIncomeDetails(rowdata) {
    let existingTotalIncomeData = this.FiPersonalinformationModel.PersonalIncomeList;
    let existingIncData;
    let p = 0;
    if (existingTotalIncomeData) {
      for (let i = 0; i < existingTotalIncomeData.length; i++) {
        if (existingTotalIncomeData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingIncData = existingTotalIncomeData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingTotalIncomeData.length) {
        this.showIncome = true;
      }
      else {
        this.showIncome = false;
      }
      if (this.incomeDetails) {
        this.incomeDetails.setFormData(existingIncData);
      }
    }
  }

  getConfigIncomeDetails() {
    this.newlist = [];
    let transType = 'NEW';
    let formData;
    if (this.incomeDetails) {
      formData = this.incomeDetails.personalIncomeDetailsIncomeForm.value;
      this.incomeDetails.personalIncomeDetailsIncomeForm.value.pgrossannualincome = Number(((this.incomeDetails.personalIncomeDetailsIncomeForm.value.pgrossannualincome).toString()).replace(/,/g, ""));
      this.incomeDetails.personalIncomeDetailsIncomeForm.value.pnetannualincome = Number(((this.incomeDetails.personalIncomeDetailsIncomeForm.value.pnetannualincome).toString()).replace(/,/g, ""));
      this.incomeDetails.personalIncomeDetailsIncomeForm.value.paverageannualexpenses = Number(((this.incomeDetails.personalIncomeDetailsIncomeForm.value.paverageannualexpenses).toString()).replace(/,/g, ""));
    }
    let incomeData = this.loadPreviousData(!this.showIncome);
    incomeData = Object.assign(incomeData, formData);
    if (incomeData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.PersonalIncomeList) {
        if (this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalIncomeList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            if (this.FiPersonalinformationModel.PersonalIncomeList[i].pcontactreferenceid === incomeData.pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalIncomeList[i].pisapplicable = !this.showIncome;
              if (!this.showIncome) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }
      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.PersonalIncomeList) {
          this.newlist = this.FiPersonalinformationModel.PersonalIncomeList;
        }
        this.newlist.push(incomeData);
        this.FiPersonalinformationModel.PersonalIncomeList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.PersonalIncomeList[updateIndex] = incomeData;
      }
    }
    if (this.incomeDetails) {
      this.incomeDetails.ngOnInit();
    }
  }

  //other income details Set and Get Details
  setConfigOtherIncomeDetails(rowdata) {
    let existingotherIncomeData = this.FiPersonalinformationModel.PersonalOtherIncomeList;
    let existingotherData = [];
    let p = 0;
    if (existingotherIncomeData) {
      for (let i = 0; i < existingotherIncomeData.length; i++) {
        if (existingotherIncomeData[i].pcontactreferenceid == rowdata.pcontactreferenceid && existingotherIncomeData[i].psourcename) {
          existingotherData.push(existingotherIncomeData[i]);
        }
        else {
          p++;
        }
      }
      if (p == existingotherIncomeData.length) {
        // this.showIncome = true;
      }
      else {
        // this.showIncome = false;
      }
      console.log("existingotherData :", existingotherData);
      if (this.otherIncomeDetails) {
        for (let i = 0; i < existingotherData.length; i++) {

          existingotherData[i].pgrossannual = this._commonService.currencyformat(existingotherData[i].pgrossannual);
        }
        this.otherIncomeDetails.otherIncomeGridData = existingotherData;
        this.otherIncomeDetails.otherIncomeGridData;
        this.otherIncomeDetails.incomeFormData = this.incomeDetails.personalIncomeDetailsIncomeForm.value;
        this.otherIncomeDetails.dataOFCompute = this.otherIncomeDetails.computeData();
      }
    }


  }

  getConfigOtherIncomeDetails() {
    this.newlist = [];
    let otherIncomeData = this.loadPreviousData(!this.showIncome);
    let data1 = []
    if (this.FiPersonalinformationModel.PersonalOtherIncomeList) {
      data1 = JSON.parse(JSON.stringify(this.FiPersonalinformationModel.PersonalOtherIncomeList));
    }
    let remainingData = []
    if (data1) {
      remainingData = data1.filter(item => item.pcontactreferenceid != otherIncomeData.pcontactreferenceid);
    }
    let formData;
    if (!this.showIncome) {
      if (this.otherIncomeDetails) {
        formData = this.otherIncomeDetails.otherIncomeGridData;
        console.log("this.otherIncomeDetails.otherIncomeGridData : ", this.otherIncomeDetails.otherIncomeGridData);
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            formData[i].pgrossannual = Number(((formData[i].pgrossannual).toString()).replace(/,/g, ""));
            let otherIncomeData = null;
            otherIncomeData = this.loadPreviousData(!this.showIncome);
            otherIncomeData = Object.assign(otherIncomeData, formData[i]);
            this.newlist.push(otherIncomeData);
          }
        }
        else {
          this.newlist.push(otherIncomeData);
        }
        this.FiPersonalinformationModel.PersonalOtherIncomeList = [...remainingData, ...this.loadNewListData()];
      }
    }
    else {
      if (this.showIncome) {
        this.FiPersonalinformationModel.PersonalOtherIncomeList.push(otherIncomeData);
      }
    }
    if (this.otherIncomeDetails) {
      this.otherIncomeDetails.otherIncomeGridData = [];
      this.otherIncomeDetails.dataOFCompute = null;
    }
  }

  //education details Set and Get Details
  setConfigEducationDetails(rowdata) {
    let existingEducationData = this.FiPersonalinformationModel.PersonalEducationList;
    let existingEduData;
    let p = 0;
    if (existingEducationData) {
      for (let i = 0; i < existingEducationData.length; i++) {
        if (existingEducationData[i].pcontactreferenceid == rowdata.pcontactreferenceid) {
          existingEduData = existingEducationData[i];
          break;
        }
        else {
          p++;
        }
      }
      if (p == existingEducationData.length) {
        this.showEducation = true;
      }
      else {
        this.showEducation = false;
      }
      if (this.educationDetails) {
        this.educationDetails.setFormData(existingEduData);
      }
    }
  }

  getConfigEducationDetails() {
    this.newlist = [];
    let transType = 'NEW';
    let formData;
    if (!this.showEducation) {
      if (this.educationDetails)
        formData = this.educationDetails.getFormData();
    }
    let educationData = this.loadPreviousData(!this.showEducation);
    educationData = Object.assign(educationData, formData);
    if (educationData != null) {
      let updateIndex;
      let insertRowIndex = 0;
      if (this.FiPersonalinformationModel.PersonalEducationList) {
        if (this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEducationList.length; i++) {
            insertRowIndex = insertRowIndex + 1;
            if (this.FiPersonalinformationModel.PersonalEducationList[i].pcontactreferenceid === educationData.pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEducationList[i].pisapplicable = !this.showEducation;
              if (!this.showEducation) {
                transType = 'EXISTING';
                updateIndex = i;
              }
              else {
                transType = 'NEW';
                updateIndex = i;
              }
            }
          }
        }
      }
      if (transType == 'NEW') {
        if (this.FiPersonalinformationModel.PersonalEducationList) {
          this.newlist = this.FiPersonalinformationModel.PersonalEducationList;
        }
        this.newlist.push(educationData);
        this.FiPersonalinformationModel.PersonalEducationList = this.loadNewListData();
      }
      else if (transType == 'EXISTING') {
        this.FiPersonalinformationModel.PersonalEducationList[updateIndex] = educationData;
      }
    }
    if (this.educationDetails) {
      this.educationDetails.ngOnInit();
    }
  }

  /**
   * ------> (Start)---- Global Not Applicable change event----------------(Start)------------
   * ------> Here If we will do Not Applicable (means red colour) 
   *         we are assigning pisapplicable to false in all based on Contact type.
   *         
   */
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
      if (this.selectedContactType == 'Individual') {
        this.showEmployeement = true;
        this.showPersonal = true;
        this.showFamily = true;
        this.showNominee = true;
        this.showIncome = true;
        this.showEducation = true;

        if (this.FiPersonalinformationModel.PersonalEmployeementList && this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalEmployeementList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEmployeementList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEmployeementList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalDetailsList && this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalDetailsList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalDetailsList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalDetailsList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalFamilyList && this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalFamilyList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalFamilyList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalFamilyList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalNomineeList && this.FiPersonalinformationModel.PersonalNomineeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalNomineeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalNomineeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalNomineeList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalIncomeList && this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalIncomeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalIncomeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalIncomeList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalOtherIncomeList && this.FiPersonalinformationModel.PersonalOtherIncomeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalOtherIncomeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalOtherIncomeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalOtherIncomeList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalEducationList && this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalEducationList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEducationList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEducationList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else if (this.selectedContactType == 'Business Entity') {
        this.showBusinessActivity = true;
        this.showBusinessFinacial = true;
        if (this.FiPersonalinformationModel.businessDetailsDTOList && this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.businessDetailsDTOList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.businessDetailsDTOList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.businessDetailsDTOList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList && this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.businessfinancialdetailsDTOList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.businessfinancialdetailsDTOList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      this.showBank = true;
      if (this.FiPersonalinformationModel.PersonalBankList && this.FiPersonalinformationModel.PersonalBankList.length > 0) {
        for (let p = 0; p < this.FiPersonalinformationModel.PersonalBankList.length; p++) {
          if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalBankList[p].pcontactreferenceid) {
            this.FiPersonalinformationModel.PersonalBankList[p].pisapplicable = false;
            break;
          }
        }
      }
    }
    else {

      if (this.selectedContactType == 'Individual') {
        this.showEmployeement = false;
        this.showPersonal = false;
        this.showFamily = false;
        this.showNominee = false;
        this.showIncome = false;
        this.showEducation = false;
        // if (this.FiPersonalinformationModel.PersonalEmployeementList && this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
        //   let count = 0;
        //   for (let m = 0; m < this.FiPersonalinformationModel.PersonalEmployeementList.length; m++) {
        //     if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEmployeementList[m].pcontactreferenceid) {
        //       this.getConfigEmploymentDetails();
        //     }
        //     else {
        //       count++;
        //     }
        //   }
        //   if (count == this.FiPersonalinformationModel.PersonalEmployeementList.length) {
        //     this.employmentDetails.ngOnInit();
        //   }
        // }
      }
      else if (this.selectedContactType == 'Business Entity') {
        this.showBusinessActivity = false;
        this.showBusinessFinacial = false;
      }
      this.showBank = false;
      setTimeout(() => {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
            this.bankDetails.Bankpersonname = this.lstApplicantsandothers[i].papplicantname;
          }
        }
      }, 0);
    }

  }
  /**------> (End)---- Global Not Applicable change event----------------(End)------------ */

  /**------- (Start) This method is for Individual Not Applicable change event-------(Start)-------
   * ------> Here we are assigning pisapplicable to false for particular collapse panel based on type.
   * ------> Here disablePersonalDetail() method is used for global Not Applicable button.
    */
  notApplicable(event, type) {
    setTimeout(() => {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
          if (this.bankDetails)
            this.bankDetails.Bankpersonname = this.lstApplicantsandothers[i].papplicantname;
        }
      }
    }, 0);
    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }
    if (type == 'businessActivity') {
      if (checked == true) {
        this.showBusinessActivity = true;
        if (this.FiPersonalinformationModel.businessDetailsDTOList && this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.businessDetailsDTOList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.businessDetailsDTOList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.businessDetailsDTOList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showBusinessActivity = false;
      }
      // this.getConfigBusinessactivityDetails();
    }
    else if (type == 'financialInfo') {
      if (checked == true) {
        this.showBusinessFinacial = true;
        if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList && this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.businessfinancialdetailsDTOList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.businessfinancialdetailsDTOList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showBusinessFinacial = false;
      }
      // this.getConfigBusinessfinanicialDetails();
    }
    else if (type == 'employeement') {
      if (checked == true) {
        this.showEmployeement = true;
        if (this.FiPersonalinformationModel.PersonalEmployeementList && this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalEmployeementList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEmployeementList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEmployeementList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        debugger;
        this.showEmployeement = false;
        if (this.FiPersonalinformationModel.PersonalEmployeementList && this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          let count = 0;
          for (let m = 0; m < this.FiPersonalinformationModel.PersonalEmployeementList.length; m++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEmployeementList[m].pcontactreferenceid) {
              this.getConfigEmploymentDetails();
            }
            else {
              count++;
            }
          }
          if (count == this.FiPersonalinformationModel.PersonalEmployeementList.length) {
            this.employmentDetails.ngOnInit();
          }
        }
        this.employmentDetails.clearForm();
      }
    }
    else if (type == 'personal') {
      if (checked == true) {
        this.showPersonal = true;
        if (this.FiPersonalinformationModel.PersonalDetailsList && this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalDetailsList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalDetailsList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalDetailsList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showPersonal = false;
        this.personalDetails.clearForm();
      }
      // this.getConfigPersonalDetails();
    }
    else if (type == 'family') {
      if (checked == true) {
        this.showFamily = true;
        if (this.FiPersonalinformationModel.PersonalFamilyList && this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalFamilyList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalFamilyList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalFamilyList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showFamily = false;
        this.familytDetails.clearForm();
      }
      // this.getConfigFamilyDetails();
    }
    else if (type == 'nominee') {
      if (checked == true) {
        this.showNominee = true;
        if (this.FiPersonalinformationModel.PersonalNomineeList && this.FiPersonalinformationModel.PersonalNomineeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalNomineeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalNomineeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalNomineeList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showNominee = false;
        this.nomineeDetails.nomineeForm.reset();
        this.nomineeDetails.ngOnInit();
      }
      // this.getConfigNomineeDetails();
    }
    else if (type == 'bank') {
      if (checked == true) {
        this.showBank = true;
        if (this.FiPersonalinformationModel.PersonalBankList && this.FiPersonalinformationModel.PersonalBankList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalBankList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalBankList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalBankList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showBank = false;
        this.bankDetails.ngOnInit();
      }
      // this.getConfigBankDetails();
    }
    else if (type == 'income') {
      if (checked == true) {
        this.showIncome = true;
        if (this.FiPersonalinformationModel.PersonalIncomeList && this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalIncomeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalIncomeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalIncomeList[p].pisapplicable = false;
              break;
            }
          }
        }
        if (this.FiPersonalinformationModel.PersonalOtherIncomeList && this.FiPersonalinformationModel.PersonalOtherIncomeList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalOtherIncomeList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalOtherIncomeList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalOtherIncomeList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showIncome = false;
        this.otherIncomeDetails.otherIncomeGridData = [];
        this.otherIncomeDetails.dataOFCompute = 0;
        this.incomeDetails.ngOnInit();
        this.otherIncomeDetails.ngOnInit();
      }
      // this.getConfigIncomeDetails();
      // this.getConfigOtherIncomeDetails();
    }
    else if (type == 'education') {
      if (checked == true) {
        this.showEducation = true;
        if (this.FiPersonalinformationModel.PersonalEducationList && this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
          for (let p = 0; p < this.FiPersonalinformationModel.PersonalEducationList.length; p++) {
            if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEducationList[p].pcontactreferenceid) {
              this.FiPersonalinformationModel.PersonalEducationList[p].pisapplicable = false;
              break;
            }
          }
        }
      }
      else {
        this.showEducation = false;
        this.educationDetails.clearForm();
      }
      // this.getConfigEducationDetails();
    }
    this.disablePersonalDetail();
  }
  /**------- (End) This method is for Individual Not Applicable change event-------(End)------- */

  /**---------(Start)----- This is used for global Not Applicable button---------(Start)------ */
  disablePersonalDetail() {
    if (this.selectedContactType == 'Individual') {
      if (this.showEmployeement == true
        && this.showPersonal == true
        && this.showFamily == true
        && this.showIncome == true
        && this.showNominee == true
        && this.showBank == true
        && this.showEducation == true) {
        this.notApplicableForAll = true;
      }
      else {
        this.notApplicableForAll = false;
      }
    }
    else {
      if (this.showBusinessActivity == true &&
        this.showBank == true &&
        this.showBusinessFinacial == true) {
        this.notApplicableForAll = true;
      }
      else {
        this.notApplicableForAll = false;
      }
    }
  }
  /**---------(End)----- This is used for global Not Applicable button---------(End)------ */

  /**----(start)---This is Output event emittter from <app-fi-personaldetails-employment>--(Start)-----
   *        compoent. but we are not using this enteredEmployeeData. It have written for 
   *        validation purpose, but now we removed all validations.
   */
  enteredEmploeeData(event) {
    this.enteredEmployeeData = event.value;
  }
  /**----(End)---This is Output event emittter from <app-fi-personaldetails-employment>--(End)----- */

  /**-------(Start)------ For getting Personal details --------------(Start)------------- */
  getPersonalDetailsDataForEditingAndGetting() {
    debugger
    if (this.notApplicableForAll == false) {
      this.addCheckFlag = false;
    }
    /**
     * ----> Here forStatus() with two parameters is using for to update status to red to green 
     *       based on pcontactreferenceid and index position of that particular user.
     *       So this method is calling for every user with index.
     */
    if (this.lstApplicantsandothers && this.lstApplicantsandothers.length > 0) {
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant' || this.lstApplicantsandothers[i].papplicanttype == 'Member') {
          $('#perapplicant-' + i).prop('checked', true);
          this.applicantsConfigDetails = this.lstApplicantsandothers[i].papplicantname + '-' + this.lstApplicantsandothers[i].papplicanttype;
          this.selectedRowIndex = i;
          this.loadPreviousData(true);
          this.forStatus(this.lstApplicantsandothers[i].pcontactreferenceid, this.selectedRowIndex);
          this.isApplicant = true;
          let rowdata = this.lstApplicantsandothers[i];
          if (rowdata.papplicanttype == 'Applicant' || rowdata.papplicanttype == 'Member') {
            this.isApplicant = true;
          }
          else {
            this.isApplicant = false;
          }
          this.forStatus(rowdata.pcontactreferenceid, this.selectedRowIndex)
          break;
        }
        else {
          this.isApplicant = false;
        }
      }
    }
    this.buttonName = 'Processing';
    this.isLoading = true;
    this.loading = true;
    
    let id=this.lstApplicantsandothers[0].pcontactreferenceid;
    let ContactDetails= this._contacmasterservice.getContactDetailsEmployeeByID(id);
    let getContactDetails= this._contacmasterservice.getContactDetailsByID(id);
    let getFIPersonalDetails= this._FIIndividualService.getFIPersonalDetailsData(this.vchapplicationId);
    forkJoin([ContactDetails,getContactDetails,getFIPersonalDetails]).subscribe(result => 
      {
        debugger
          
        this.contacmasterContactDetails=result[0];
        this.ContactDetailsByID=result[2];
       let bbb=result[1].referralbankdetailslist;
       this.ContactDetailsByIDbankdetailslist = bbb.map(v => ({...v, pcontactreferenceid: this.lstApplicantsandothers[0].pcontactreferenceid,papplicanttype:this.lstApplicantsandothers[0].papplicanttype}));
       this.ContactDetailsByIDbankdetailslist.filter(Arrayc =>Arrayc.ptypeofoperation = 'CREATE');
       this.ContactDetailsByIDbankdetailslist.filter(Arrayc =>Arrayc.pCreatedby = this._commonService.pCreatedby);
       this.ContactDetailsByIDbankdetailslist.filter(Arrayc =>Arrayc.pStatusname = 'ACTIVE');
       this.ContactDetailsByIDbankdetailslist.filter(Arrayc =>Arrayc.pBankAccountname = result[1].pContactName);
       let response=this.ContactDetailsByID;
       if (response) {

        this.loading = false;
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        this.notApplicableForAll = !(response.pIspersonaldetailsapplicable);
        this.FiPersonalinformationModel.PersonalEmployeementList = response.personalEmployeementList;
        this.FiPersonalinformationModel.PersonalDetailsList = response.personalDetailsList;
        
      
          
        if(response.personalDetailsList.length==0){
          let PersonalDetailsListtext=[];
          if(this.contacmasterContactDetails.pmaritalstatus=='Ma'){
            this.contacmasterContactDetails.pmaritalstatus='Married';
          }
          if(this.contacmasterContactDetails.pmaritalstatus=='Si'){
            this.contacmasterContactDetails.pmaritalstatus='Single';
          }
          if(this.contacmasterContactDetails.pmaritalstatus=='Se'){
            this.contacmasterContactDetails.pmaritalstatus='Separated';
          }
          if(this.contacmasterContactDetails.pmaritalstatus=='Wi'){
            this.contacmasterContactDetails.pmaritalstatus='Widowed';
          }
          if(this.contacmasterContactDetails.presidentialstatus=='R'){
            this.contacmasterContactDetails.presidentialstatus='Resident';
          }
          if(this.contacmasterContactDetails.presidentialstatus=='N'){
            this.contacmasterContactDetails.presidentialstatus='Non-Resident';
          }
          if(this.contacmasterContactDetails.presidentialstatus=='F'){
            this.contacmasterContactDetails.presidentialstatus='Foreign National';
          }
          if(this.contacmasterContactDetails.presidentialstatus=='P'){
            this.contacmasterContactDetails.presidentialstatus='Person of Indian Origin';
          }
         
          
          PersonalDetailsListtext=   [         {
            createdby: this._commonService.pCreatedby,
          
            papplicanttype:this.lstApplicantsandothers[0].papplicanttype,
            pcontactid: this.lstApplicantsandothers[0].pcontactid,
            pcontactreferenceid:this.lstApplicantsandothers[0].pcontactreferenceid,
            pcountryofbirth: this.contacmasterContactDetails.pCountry,
            pisapplicable: true,
            pmaritalstatus: this.contacmasterContactDetails.pmaritalstatus,
            pminoritycommunity: this.contacmasterContactDetails.pminoritycommunity,
            pnationality: this.contacmasterContactDetails.pnationality,
            pplaceofbirth: this.contacmasterContactDetails.pplaceofbirth,
            presidentialstatus: this.contacmasterContactDetails.presidentialstatus,
            ptypeofoperation: "UPDATE",
       
           
            }];
          this.FiPersonalinformationModel.PersonalDetailsList=PersonalDetailsListtext;
          response.personalDetailsList=PersonalDetailsListtext;
        }
        this.FiPersonalinformationModel.PersonalNomineeList = response.personalNomineeList;
        this.FiPersonalinformationModel.PersonalBankList = response.personalBankList;
        if(this.FiPersonalinformationModel.PersonalBankList.length==0){
          this.FiPersonalinformationModel.PersonalBankList = this.ContactDetailsByIDbankdetailslist;
          response.personalBankList=this.ContactDetailsByIDbankdetailslist
        }
        this.FiPersonalinformationModel.PersonalEducationList = response.personalEducationList;
        this.FiPersonalinformationModel.PersonalFamilyList = response.personalFamilyList;
        this.FiPersonalinformationModel.PersonalIncomeList = response.personalIncomeList;
        this.FiPersonalinformationModel.PersonalOtherIncomeList = response.personalOtherIncomeList;
        this.FiPersonalinformationModel.businessfinancialdetailsDTOList = response.businessfinancialdetailsDTOList;
        this.FiPersonalinformationModel.businessDetailsDTOList = response.businessDetailsDTOList;
        /**
         * ----> But here this forEditingStatus() with no arguments is calling only once. 
         *       For changing the statuses of that particular user from red to green. 
         *       This method is changing the status based on the FiPersonalinformationModel's
         *       arrays length.
         */
        this.forEditingStatus();

        if (this.lstApplicantsandothers && this.lstApplicantsandothers.length > 0) {
          /**
           * ----> Here we are checking the array length. If array length is greater that zero 
           *       we will change individual Not Applicable button based on pisapplicable key.
           */
          if (response.personalEmployeementList && response.personalEmployeementList.length > 0) {
            for (let i = 0; i < response.personalEmployeementList.length; i++) {
              this.showEmployeement = !(response.personalEmployeementList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalEmployeementList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalEmployeementList[i].pisapplicable));
                if (response.personalEmployeementList[i].papplicanttype == 'Applicant' || response.personalEmployeementList[i].papplicanttype == 'Member') {
                  this.setConfigEmploymentDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showEmployeement = true;
          }

          if (response.personalDetailsList && response.personalDetailsList.length > 0) {
            for (let i = 0; i < response.personalDetailsList.length; i++) {
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalDetailsList[i].pcontactreferenceid) {
                this.showPersonal = !(response.personalDetailsList[i].pisapplicable);
                this.loadPreviousData(!(response.personalDetailsList[i].pisapplicable));
                if (response.personalDetailsList[i].papplicanttype == 'Applicant' || response.personalDetailsList[i].papplicanttype == 'Member') {
                  this.setConfigPersonalDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showPersonal = true;
          }
          if (response.personalFamilyList && response.personalFamilyList.length > 0) {
            for (let i = 0; i < response.personalFamilyList.length; i++) {
              this.showFamily = !(response.personalFamilyList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalFamilyList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalFamilyList[i].pisapplicable));
                if (response.personalFamilyList[i].papplicanttype == 'Applicant' || response.personalFamilyList[i].papplicanttype == 'Member') {
                  this.setConfigFamilyDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }

              }
            }
          }
          else {
            this.showFamily = true;
          }
          if (response.personalNomineeList && response.personalNomineeList.length > 0) {
            for (let i = 0; i < response.personalNomineeList.length; i++) {
              this.showNominee = !(response.personalNomineeList[i].pisapplicable);
              let checkFlagForDate: boolean = false;
              if (response.personalNomineeList[i].pdateofbirth) {
                checkFlagForDate = (response.personalNomineeList[i].pdateofbirth).toString().includes('/');
              }
              if (checkFlagForDate == true) {
                response.personalNomineeList[i].pdateofbirth = response.personalNomineeList[i].pdateofbirth ? this._commonService.formatDateFromDDMMYYYY(response.personalNomineeList[i].pdateofbirth) : new Date();
              }
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalNomineeList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalNomineeList[i].pisapplicable));
                if (response.personalNomineeList[i].papplicanttype == 'Applicant' || response.personalNomineeList[i].papplicanttype == 'Member') {
                  this.setConfigNomineeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showNominee = true;
          }
          if (response.personalBankList && response.personalBankList.length > 0) {
            for (let i = 0; i < response.personalBankList.length; i++) {
              this.showBank = !(response.personalBankList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalBankList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalBankList[i].pisapplicable));
                if (response.personalBankList[i].papplicanttype == 'Applicant' || response.personalBankList[i].papplicanttype == 'Member') {
                  this.setConfigBankDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showBank = true;
          }
          if (response.personalIncomeList && response.personalIncomeList.length > 0) {
            for (let i = 0; i < response.personalIncomeList.length; i++) {
              response.personalIncomeList[i].paverageannualexpenses = (response.personalIncomeList[i].paverageannualexpenses.toString().replace(/,/g, ""));
              response.personalIncomeList[i].pgrossannualincome = (response.personalIncomeList[i].pgrossannualincome.toString().replace(/,/g, ""));
              response.personalIncomeList[i].pnetannualincome = (response.personalIncomeList[i].pnetannualincome.toString().replace(/,/g, ""));
              this.showIncome = !(response.personalIncomeList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalIncomeList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalIncomeList[i].pisapplicable));
                if (response.personalIncomeList[i].papplicanttype == 'Applicant' || response.personalIncomeList[i].papplicanttype == 'Member') {
                  this.setConfigIncomeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showIncome = true;
          }
          if (response.personalOtherIncomeList && response.personalOtherIncomeList.length > 0) {
            for (let i = 0; i < response.personalOtherIncomeList.length; i++) {
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalOtherIncomeList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalOtherIncomeList[i].pisapplicable));
                if (response.personalOtherIncomeList[i].papplicanttype == 'Applicant' || response.personalOtherIncomeList[i].papplicanttype == 'Member') {
                  this.setConfigOtherIncomeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            // this.showIncome = true;
          }
          if (response.personalEducationList && response.personalEducationList.length > 0) {
            for (let i = 0; i < response.personalEducationList.length; i++) {
              this.showEducation = !(response.personalEducationList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalEducationList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.personalEducationList[i].pisapplicable));
                if (response.personalEducationList[i].papplicanttype == 'Applicant' || response.personalEducationList[i].papplicanttype == 'Member') {
                  this.setConfigEducationDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showEducation = true;
          }
          if (response.businessDetailsDTOList && response.businessDetailsDTOList.length > 0) {
            for (let i = 0; i < response.businessDetailsDTOList.length; i++) {
              this.showBusinessActivity = !(response.businessDetailsDTOList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.businessDetailsDTOList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.businessDetailsDTOList[i].pisapplicable));
                if (response.businessDetailsDTOList[i].papplicanttype == 'Applicant' || response.businessDetailsDTOList[i].papplicanttype == 'Member') {
                  this.setConfigBusinessactivityDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showBusinessActivity = true;
          }
          if (response.businessfinancialdetailsDTOList && response.businessfinancialdetailsDTOList.length > 0) {
            for (let i = 0; i < response.businessfinancialdetailsDTOList.length; i++) {
              response.businessfinancialdetailsDTOList[i].pnetprofitamount = response.businessfinancialdetailsDTOList[i].pnetprofitamount ? this._commonService.currencyformat(response.businessfinancialdetailsDTOList[i].pnetprofitamount) : 0;
              response.businessfinancialdetailsDTOList[i].pturnoveramount = response.businessfinancialdetailsDTOList[i].pturnoveramount ? this._commonService.currencyformat(response.businessfinancialdetailsDTOList[i].pturnoveramount) : 0;
              this.showBusinessFinacial = !(response.businessfinancialdetailsDTOList[i].pisapplicable);
              if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.businessfinancialdetailsDTOList[i].pcontactreferenceid) {
                this.loadPreviousData(!(response.businessfinancialdetailsDTOList[i].pisapplicable));
                if (response.businessfinancialdetailsDTOList[i].papplicanttype == 'Applicant' || response.businessfinancialdetailsDTOList[i].papplicanttype == 'Member') {
                  this.setConfigBusinessfinanicialDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
                }
              }
            }
          }
          else {
            this.showBusinessFinacial = true;
          }
        }
        this.disablePersonalDetail();

      }
      else {
        this.loading = false;
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      }
      })
    // this._contacmasterservice.getContactDetailsEmployeeByID(id).subscribe(json => {
    // this.contacmasterContactDetails=json;
    // });
    // this._contacmasterservice.getContactDetailsByID(id).subscribe(json => {
    //   this.ContactDetailsByID=json;
    //   this.ContactDetailsByIDbankdetailslist=this.ContactDetailsByID.referralbankdetailslist;
    //   });
    
    // this._FIIndividualService.getFIPersonalDetailsData(this.vchapplicationId).subscribe((response: any) => {

    //   debugger;
    //   if (response) {

    //     this.loading = false;
    //     this.buttonName = 'Save & Continue';
    //     this.isLoading = false;
    //     this.notApplicableForAll = !(response.pIspersonaldetailsapplicable);
    //     this.FiPersonalinformationModel.PersonalEmployeementList = response.personalEmployeementList;
    //     this.FiPersonalinformationModel.PersonalDetailsList = response.personalDetailsList;
        
      
          
    //     if(response.personalDetailsList.length==0){
    //       let PersonalDetailsListtext=[];
    //       if(this.contacmasterContactDetails.pmaritalstatus=='Ma'){
    //         this.contacmasterContactDetails.pmaritalstatus='Married';
    //       }
    //       if(this.contacmasterContactDetails.pmaritalstatus=='Si'){
    //         this.contacmasterContactDetails.pmaritalstatus='Single';
    //       }
    //       if(this.contacmasterContactDetails.pmaritalstatus=='Se'){
    //         this.contacmasterContactDetails.pmaritalstatus='Separated';
    //       }
    //       if(this.contacmasterContactDetails.pmaritalstatus=='Wi'){
    //         this.contacmasterContactDetails.pmaritalstatus='Widowed';
    //       }
    //       if(this.contacmasterContactDetails.presidentialstatus=='R'){
    //         this.contacmasterContactDetails.presidentialstatus='Resident';
    //       }
    //       if(this.contacmasterContactDetails.presidentialstatus=='N'){
    //         this.contacmasterContactDetails.presidentialstatus='Non-Resident';
    //       }
    //       if(this.contacmasterContactDetails.presidentialstatus=='F'){
    //         this.contacmasterContactDetails.presidentialstatus='Foreign National';
    //       }
    //       if(this.contacmasterContactDetails.presidentialstatus=='P'){
    //         this.contacmasterContactDetails.presidentialstatus='Person of Indian Origin';
    //       }
         
          
    //       PersonalDetailsListtext=   [         {
    //         createdby: this._commonService.pCreatedby,
          
    //         papplicanttype:this.lstApplicantsandothers[0].papplicanttype,
    //         pcontactid: this.lstApplicantsandothers[0].pcontactid,
    //         pcontactreferenceid:this.lstApplicantsandothers[0].pcontactreferenceid,
    //         pcountryofbirth: this.contacmasterContactDetails.pCountry,
    //         pisapplicable: true,
    //         pmaritalstatus: this.contacmasterContactDetails.pmaritalstatus,
    //         pminoritycommunity: this.contacmasterContactDetails.pminoritycommunity,
    //         pnationality: this.contacmasterContactDetails.pnationality,
    //         pplaceofbirth: this.contacmasterContactDetails.pplaceofbirth,
    //         presidentialstatus: this.contacmasterContactDetails.presidentialstatus,
    //         ptypeofoperation: "UPDATE",
       
           
    //         }];
    //       this.FiPersonalinformationModel.PersonalDetailsList=PersonalDetailsListtext;
    //       response.personalDetailsList=PersonalDetailsListtext;
    //     }
    //     this.FiPersonalinformationModel.PersonalNomineeList = response.personalNomineeList;
    //     this.FiPersonalinformationModel.PersonalBankList = response.personalBankList;
    //    // if(this.FiPersonalinformationModel.PersonalBankList.length==0){
    //       this.FiPersonalinformationModel.PersonalBankList = this.ContactDetailsByIDbankdetailslist;
    //       response.personalBankList=this.ContactDetailsByIDbankdetailslist
    //    // }
    //     this.FiPersonalinformationModel.PersonalEducationList = response.personalEducationList;
    //     this.FiPersonalinformationModel.PersonalFamilyList = response.personalFamilyList;
    //     this.FiPersonalinformationModel.PersonalIncomeList = response.personalIncomeList;
    //     this.FiPersonalinformationModel.PersonalOtherIncomeList = response.personalOtherIncomeList;
    //     this.FiPersonalinformationModel.businessfinancialdetailsDTOList = response.businessfinancialdetailsDTOList;
    //     this.FiPersonalinformationModel.businessDetailsDTOList = response.businessDetailsDTOList;
    //     /**
    //      * ----> But here this forEditingStatus() with no arguments is calling only once. 
    //      *       For changing the statuses of that particular user from red to green. 
    //      *       This method is changing the status based on the FiPersonalinformationModel's
    //      *       arrays length.
    //      */
    //     this.forEditingStatus();

    //     if (this.lstApplicantsandothers && this.lstApplicantsandothers.length > 0) {
    //       /**
    //        * ----> Here we are checking the array length. If array length is greater that zero 
    //        *       we will change individual Not Applicable button based on pisapplicable key.
    //        */
    //       if (response.personalEmployeementList && response.personalEmployeementList.length > 0) {
    //         for (let i = 0; i < response.personalEmployeementList.length; i++) {
    //           this.showEmployeement = !(response.personalEmployeementList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalEmployeementList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalEmployeementList[i].pisapplicable));
    //             if (response.personalEmployeementList[i].papplicanttype == 'Applicant' || response.personalEmployeementList[i].papplicanttype == 'Member') {
    //               this.setConfigEmploymentDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showEmployeement = true;
    //       }

    //       if (response.personalDetailsList && response.personalDetailsList.length > 0) {
    //         for (let i = 0; i < response.personalDetailsList.length; i++) {
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalDetailsList[i].pcontactreferenceid) {
    //             this.showPersonal = !(response.personalDetailsList[i].pisapplicable);
    //             this.loadPreviousData(!(response.personalDetailsList[i].pisapplicable));
    //             if (response.personalDetailsList[i].papplicanttype == 'Applicant' || response.personalDetailsList[i].papplicanttype == 'Member') {
    //               this.setConfigPersonalDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showPersonal = true;
    //       }
    //       if (response.personalFamilyList && response.personalFamilyList.length > 0) {
    //         for (let i = 0; i < response.personalFamilyList.length; i++) {
    //           this.showFamily = !(response.personalFamilyList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalFamilyList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalFamilyList[i].pisapplicable));
    //             if (response.personalFamilyList[i].papplicanttype == 'Applicant' || response.personalFamilyList[i].papplicanttype == 'Member') {
    //               this.setConfigFamilyDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }

    //           }
    //         }
    //       }
    //       else {
    //         this.showFamily = true;
    //       }
    //       if (response.personalNomineeList && response.personalNomineeList.length > 0) {
    //         for (let i = 0; i < response.personalNomineeList.length; i++) {
    //           this.showNominee = !(response.personalNomineeList[i].pisapplicable);
    //           let checkFlagForDate: boolean = false;
    //           if (response.personalNomineeList[i].pdateofbirth) {
    //             checkFlagForDate = (response.personalNomineeList[i].pdateofbirth).toString().includes('/');
    //           }
    //           if (checkFlagForDate == true) {
    //             response.personalNomineeList[i].pdateofbirth = response.personalNomineeList[i].pdateofbirth ? this._commonService.formatDateFromDDMMYYYY(response.personalNomineeList[i].pdateofbirth) : new Date();
    //           }
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalNomineeList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalNomineeList[i].pisapplicable));
    //             if (response.personalNomineeList[i].papplicanttype == 'Applicant' || response.personalNomineeList[i].papplicanttype == 'Member') {
    //               this.setConfigNomineeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showNominee = true;
    //       }
    //       if (response.personalBankList && response.personalBankList.length > 0) {
    //         for (let i = 0; i < response.personalBankList.length; i++) {
    //           this.showBank = !(response.personalBankList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalBankList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalBankList[i].pisapplicable));
    //             if (response.personalBankList[i].papplicanttype == 'Applicant' || response.personalBankList[i].papplicanttype == 'Member') {
    //               this.setConfigBankDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showBank = true;
    //       }
    //       if (response.personalIncomeList && response.personalIncomeList.length > 0) {
    //         for (let i = 0; i < response.personalIncomeList.length; i++) {
    //           response.personalIncomeList[i].paverageannualexpenses = (response.personalIncomeList[i].paverageannualexpenses.toString().replace(/,/g, ""));
    //           response.personalIncomeList[i].pgrossannualincome = (response.personalIncomeList[i].pgrossannualincome.toString().replace(/,/g, ""));
    //           response.personalIncomeList[i].pnetannualincome = (response.personalIncomeList[i].pnetannualincome.toString().replace(/,/g, ""));
    //           this.showIncome = !(response.personalIncomeList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalIncomeList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalIncomeList[i].pisapplicable));
    //             if (response.personalIncomeList[i].papplicanttype == 'Applicant' || response.personalIncomeList[i].papplicanttype == 'Member') {
    //               this.setConfigIncomeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showIncome = true;
    //       }
    //       if (response.personalOtherIncomeList && response.personalOtherIncomeList.length > 0) {
    //         for (let i = 0; i < response.personalOtherIncomeList.length; i++) {
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalOtherIncomeList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalOtherIncomeList[i].pisapplicable));
    //             if (response.personalOtherIncomeList[i].papplicanttype == 'Applicant' || response.personalOtherIncomeList[i].papplicanttype == 'Member') {
    //               this.setConfigOtherIncomeDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         // this.showIncome = true;
    //       }
    //       if (response.personalEducationList && response.personalEducationList.length > 0) {
    //         for (let i = 0; i < response.personalEducationList.length; i++) {
    //           this.showEducation = !(response.personalEducationList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.personalEducationList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.personalEducationList[i].pisapplicable));
    //             if (response.personalEducationList[i].papplicanttype == 'Applicant' || response.personalEducationList[i].papplicanttype == 'Member') {
    //               this.setConfigEducationDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showEducation = true;
    //       }
    //       if (response.businessDetailsDTOList && response.businessDetailsDTOList.length > 0) {
    //         for (let i = 0; i < response.businessDetailsDTOList.length; i++) {
    //           this.showBusinessActivity = !(response.businessDetailsDTOList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.businessDetailsDTOList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.businessDetailsDTOList[i].pisapplicable));
    //             if (response.businessDetailsDTOList[i].papplicanttype == 'Applicant' || response.businessDetailsDTOList[i].papplicanttype == 'Member') {
    //               this.setConfigBusinessactivityDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showBusinessActivity = true;
    //       }
    //       if (response.businessfinancialdetailsDTOList && response.businessfinancialdetailsDTOList.length > 0) {
    //         for (let i = 0; i < response.businessfinancialdetailsDTOList.length; i++) {
    //           response.businessfinancialdetailsDTOList[i].pnetprofitamount = response.businessfinancialdetailsDTOList[i].pnetprofitamount ? this._commonService.currencyformat(response.businessfinancialdetailsDTOList[i].pnetprofitamount) : 0;
    //           response.businessfinancialdetailsDTOList[i].pturnoveramount = response.businessfinancialdetailsDTOList[i].pturnoveramount ? this._commonService.currencyformat(response.businessfinancialdetailsDTOList[i].pturnoveramount) : 0;
    //           this.showBusinessFinacial = !(response.businessfinancialdetailsDTOList[i].pisapplicable);
    //           if (this.lstApplicantsandothers[this.selectedRowIndex].pcontactreferenceid == response.businessfinancialdetailsDTOList[i].pcontactreferenceid) {
    //             this.loadPreviousData(!(response.businessfinancialdetailsDTOList[i].pisapplicable));
    //             if (response.businessfinancialdetailsDTOList[i].papplicanttype == 'Applicant' || response.businessfinancialdetailsDTOList[i].papplicanttype == 'Member') {
    //               this.setConfigBusinessfinanicialDetails(this.lstApplicantsandothers[this.selectedRowIndex]);
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         this.showBusinessFinacial = true;
    //       }
    //     }
    //     this.disablePersonalDetail();

    //   }
    //   else {
    //     this.loading = false;
    //     this.buttonName = 'Save & Continue';
    //     this.isLoading = false;
    //   }
    // }, (error) => {
    //   this.loading = false;
    //   this.buttonName = 'Save & Continue';
    //   this.isLoading = false;
    // })
  }
  /**-------(End)------ For getting Personal details --------------(End)------------- */

  /**-------(Start)--- For calculating Compute value in Other incoem details---------(Start)
   * ------> This event is coming form <app-fi-personaldetails-income> component
   */
  forComputeDetailsEmit(event) {
    this.incomeFormData = event;
    this.otherIncomeDetails.incomeFormData = event;
    this.otherIncomeDetails.computeData();
  }
  /**-------(End)--- For calculating Compute value in Other incoem details---------(End) */

  /**----(Start)----- For changing the statuses of users after adding to FiPersonalinformationModel-------(Start)--
   * ------> This method will call every time for radio button change event of user selection.
   *         It is working with pcontactreferenceid and selected user's index from lstApplicantsandothers array.
   */
  forStatus(selectedContactReferenceId, indexIs) {

    let statusBoolean: boolean = false;
    if (this.selectedContactType == 'Individual') {
      if (this.showEmployeement == false) {
        if (this.FiPersonalinformationModel.PersonalEmployeementList &&
          this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEmployeementList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalEmployeementList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showPersonal == false) {
        if (this.FiPersonalinformationModel.PersonalDetailsList &&
          this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalDetailsList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalDetailsList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showFamily == false) {
        if (this.FiPersonalinformationModel.PersonalFamilyList &&
          this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalFamilyList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalFamilyList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showNominee == false) {
        if (this.FiPersonalinformationModel.PersonalNomineeList &&
          this.FiPersonalinformationModel.PersonalNomineeList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalNomineeList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalNomineeList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showBank == false) {

        if (this.FiPersonalinformationModel.PersonalBankList &&
          this.FiPersonalinformationModel.PersonalBankList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalBankList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalBankList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showIncome == false) {
        if (this.FiPersonalinformationModel.PersonalIncomeList &&
          this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalIncomeList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalIncomeList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showEducation == false) {
        if (this.FiPersonalinformationModel.PersonalEducationList &&
          this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEducationList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalEducationList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
    }
    else {
      if (this.showBusinessActivity == false) {
        if (this.FiPersonalinformationModel.businessDetailsDTOList &&
          this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.businessDetailsDTOList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.businessDetailsDTOList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showBusinessFinacial == false) {
        if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList &&
          this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
      if (this.showBank == false) {
        if (this.FiPersonalinformationModel.PersonalBankList &&
          this.FiPersonalinformationModel.PersonalBankList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalBankList.length; i++) {
            if (selectedContactReferenceId == this.FiPersonalinformationModel.PersonalBankList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[indexIs].status = true;
              break;
            }
          }
        }
      }
    }
    // return statusBoolean;
  }
  /**----(End)----- For changing the statuses of users after adding to FiPersonalinformationModel-------(End)-- */

  /**-----(Start)---- This method also for status and will call when the get API will call ----(Start)---
   * ------> This method will call only once whem we are calling get API. Because in get API, we have to get
   *         total data, based on that total data we have to show statuses either in red color or in green.
   *         So when we are callin get API there is no radio button change event. At on page load we will
   *         get total data. After this total data. when we clicking on radio button the above 
   *         forStatus() method will call.
   */
  forEditingStatus() {

    let statusBoolean: boolean = false;
    for (let b = 0; b < this.lstApplicantsandothers.length; b++) {
      if (this.selectedContactType == 'Individual') {
        // if(this.showEmployeement == false) {
        let employeeCount = 0;
        if (this.FiPersonalinformationModel.PersonalEmployeementList &&
          this.FiPersonalinformationModel.PersonalEmployeementList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEmployeementList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEmployeementList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              employeeCount++;
            }
          }
          if (employeeCount == this.FiPersonalinformationModel.PersonalEmployeementList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let personalCount = 0;
        if (this.FiPersonalinformationModel.PersonalDetailsList &&
          this.FiPersonalinformationModel.PersonalDetailsList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalDetailsList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalDetailsList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              personalCount++;
            }
          }
          if (personalCount == this.FiPersonalinformationModel.PersonalDetailsList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let famliyCount = 0;
        if (this.FiPersonalinformationModel.PersonalFamilyList &&
          this.FiPersonalinformationModel.PersonalFamilyList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalFamilyList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalFamilyList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              famliyCount++;
            }
          }
          if (famliyCount == this.FiPersonalinformationModel.PersonalFamilyList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let nomineeCount = 0;
        if (this.FiPersonalinformationModel.PersonalNomineeList &&
          this.FiPersonalinformationModel.PersonalNomineeList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalNomineeList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalNomineeList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              nomineeCount++;
            }
          }
          if (nomineeCount == this.FiPersonalinformationModel.PersonalNomineeList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let bankCount = 0;
        if (this.FiPersonalinformationModel.PersonalBankList &&
          this.FiPersonalinformationModel.PersonalBankList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalBankList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalBankList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              bankCount++;
            }
          }
          if (bankCount == this.FiPersonalinformationModel.PersonalBankList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let incomeCount = 0;
        if (this.FiPersonalinformationModel.PersonalIncomeList &&
          this.FiPersonalinformationModel.PersonalIncomeList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalIncomeList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalIncomeList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              incomeCount++;
            }
          }
          if (incomeCount == this.FiPersonalinformationModel.PersonalIncomeList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let educationCount = 0;
        if (this.FiPersonalinformationModel.PersonalEducationList &&
          this.FiPersonalinformationModel.PersonalEducationList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalEducationList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalEducationList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              educationCount++;
            }
          }
          if (educationCount == this.FiPersonalinformationModel.PersonalEducationList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
      }
      else {
        let businessCount = 0;
        if (this.FiPersonalinformationModel.businessDetailsDTOList &&
          this.FiPersonalinformationModel.businessDetailsDTOList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.businessDetailsDTOList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.businessDetailsDTOList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              businessCount++;
            }
          }
          if (businessCount == this.FiPersonalinformationModel.businessDetailsDTOList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let financeCount = 0;
        if (this.FiPersonalinformationModel.businessfinancialdetailsDTOList &&
          this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.businessfinancialdetailsDTOList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              financeCount++;
            }
          }
          if (financeCount == this.FiPersonalinformationModel.businessfinancialdetailsDTOList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
        let personalBankCount = 0;
        if (this.FiPersonalinformationModel.PersonalBankList &&
          this.FiPersonalinformationModel.PersonalBankList.length > 0) {
          for (let i = 0; i < this.FiPersonalinformationModel.PersonalBankList.length; i++) {
            if (this.lstApplicantsandothers[b].pcontactreferenceid == this.FiPersonalinformationModel.PersonalBankList[i].pcontactreferenceid) {
              statusBoolean = true;
              this.lstApplicantsandothers[b].status = true;
              // break;
            }
            else {
              personalBankCount++;
            }
          }
          if (personalBankCount == this.FiPersonalinformationModel.PersonalBankList.length) {
            this.lstApplicantsandothers[b].status = false;
          }
        }
      }
    }
  }
  /**-----(End)---- This method also for status and will call when the get API will call ----(End)--- */

  /**------(Start)---- Move to previous tab---------------(Start)----------
   * -----> here we have one event emitter to call 4th tab KYC get API in <fi-master> component
   */
  moveToPreviousTab() {
    if (this.FormName == "FiMemberDetailsForm") {
      let str = 'kyc-Documents'
      this.dropdoenTabname = "KYC Documents";
      $('.nav-item a[href="#' + str + '"]').tab('show');
    } else {
      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
        let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
        if (pTabsectionname == this.dropdoenTabname) {
          str = tempFirstInformationTabsData[i - 1].pTabsectionid;
          temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
          this._commonService.SetFiTabName(temptabname);
        }
      }
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    }
    this.forGettingKYCDataEmit.emit(true);
  }
  /**------(End)---- Move to previous tab---------------(End)---------- */

  /**-------(Start)----- For Clear button--------------------(Start)----- */
  clearForm() {
    if (this.employmentDetails) {
      this.employmentDetails.clearForm();
    }
    if (this.nomineeDetails) {
      this.nomineeDetails.loadInitData();
    }
    if (this.familytDetails) {
      this.familytDetails.clearForm();
    }
    if (this.personalDetails) {
      this.personalDetails.clearForm();
    }
    if (this.bankDetails) {
      this.bankDetails.clearfn();
    }
    if (this.BusinessactivityDetails) {
      this.BusinessactivityDetails.ngOnInit();
    }
    if (this.BusinessfinanicialDetails) {
      this.BusinessfinanicialDetails.ngOnInit();
    }
    if (this.incomeDetails) {
      this.incomeDetails.clearForm();
    }
    if (this.otherIncomeDetails) {
      this.otherIncomeDetails.ngOnInit();
      this.otherIncomeDetails.dataOFCompute = null;
    }
    if (this.educationDetails) {
      this.educationDetails.clearForm();
    }
  }
  /**-------(End)----- For Clear button--------------------(end)----- */
}
