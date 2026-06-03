import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { InsuranceMemberService } from '../../../../Services/Insurance/insurance-member.service';

import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { FIIndividualService } from '../../../../Services/Loans/Transactions/fiindividual.service';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { runInThisContext } from 'vm';
import { templateJitUrl } from '@angular/compiler';
import { count } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-insurance-member-new',
  templateUrl: './insurance-member-new.component.html',
  styles: []
})
export class InsuranceMemberNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig3: Partial<BsDatepickerConfig> = new BsDatepickerConfig();


  public transdate: Date = new Date();
  public loading = false;
  Insurancememberform: FormGroup;
  MembertypeDetails: any;
  MemberDetailsList: any;
  ApplicantList: any;
  Datatobind:any;
  AllInsuranceMembers: any;
  InsuranceSchemeDetails: any;
  idProofTypeList: any;
  idProofList: any;
  InsuranceMemberErrorMessages: any;
  InsuranceSchemeDetailsView: any;
  NomineeDetailslist: any = [];

  SchemeCode: any;
  claimType: any;
  claimAmount: any;
  premiumAmount: any;
  premiumPayin: any;
  schemeDuration: any;
  paidStatus: any;
  startdate: any;
  Contactid: any;
  enddate: any;
  kycFilePath: any;
  kycFileName: any;
  imageResponse: any;
  coveragePeriod: any;
  buttontype:any;
  accountHoldername: any;
  membercontactId: any;
  memberId: any;
  Doj: any;
  membertype: any;
  Dob: any;
  age: any;
  nominee: any;
  relation: any;


  IsSchemeviewdetails: boolean = false;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  constructor(private _insurancememberService: InsuranceMemberService, private fb: FormBuilder, private datePipe: DatePipe, private _CommonService: CommonService, private _FIIndividualService: FIIndividualService, private router: Router) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig1.showWeekNumbers = false;

    this.dpConfig2.containerClass = 'theme-dark-blue';
    this.dpConfig2.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig2.maxDate = new Date();
    this.dpConfig2.showWeekNumbers = false;

    this.dpConfig3.containerClass = 'theme-dark-blue';
    this.dpConfig3.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig3.maxDate = new Date();
    this.dpConfig3.showWeekNumbers = false;
  }

  ngOnInit() 
  {
    debugger
    //this.MembertypeDisable = true;
    //this.ApplicanttypeDisable = true;
    //this.InsuranceSchemeDisable = true;
    

    this.InsuranceMemberErrorMessages = {}
    this.Insurancememberform = this.fb.group({
      pInsuranceType: ['', [Validators.required]],
      pTransdate: [this.transdate],
      pMembertype: [''],
      pMembertypeId: [null, [Validators.required]],
      pMemberCodeandName: [''],
      pMemberId: [null, [Validators.required]],
      pSchemeName: [''],
      pSchemeId: [null, [Validators.required]],
      pPolicystartdate: [''],
      pPolicyenddate: [''],
      pPolicycoveragePeriod: [''],
      ptypeofoperation: ['CREATE'],
      pApplicanttype: [null, [Validators.required]],
      pPremiumamount:['0'],
      pCreatedby: [this._CommonService.pCreatedby],
      pRecordid:[0],
      InsuranceMemberNomineeDetailsList: this.addInsuranceMemberNomineeDetails()
    });
    this.Insurancememberform.controls.pInsuranceType.setValue('Individual Policy');
    this.GetMemberDetailsList();
    this.getidProofTypeList();
    this.GetApplicantsDetails();
    this.BlurEventAllControll(this.Insurancememberform);
    this.buttontype=this._insurancememberService.GetButtonClickType()
    console.log(this.buttontype)
    if(this.buttontype=="Edit")
    {
      this.GetInsurancedetailsForEdit()
      
    }
    
  }
  addInsuranceMemberNomineeDetails(): FormGroup {
    return this.fb.group({
      pNomineeName: ['',[Validators.required]],
      pNomimneeRelation: [''],
      pMemberId: [''],
      Dateofbirth: [''],
      pAge: ['0'],
      ContactNo: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      IdproofId: [null],
      IdproofType: [null],
      IdProofname: [null],
      Idproofpath: [''],
      Contactid: ['0'],
      pContactrefid: [''],
      pMemberrefcode: [''],
      ptypeofoperation: ['CREATE'],
      pRecordid: [0],
      pCreatedby: [this._CommonService.pCreatedby]

    });
  }
  public GetMemberDetailsList() {
    debugger
    // this._insurancememberService.GetMemberDetailsList().subscribe(json => {
      
    //   if (json) {
    //     this.MembertypeDetails = json
    //   }
    // });
    this._insurancememberService.GetMemberDetailsformname('member').subscribe(json => {
      if (json) {
        this.MembertypeDetails = json
      }
    });
  }
  public GetAllInsuranceMembers(MembertypeID) {

    debugger;
    this.Insurancememberform.controls.pMemberId.setValue(null);
    this.Insurancememberform.controls.pMemberCodeandName.setValue('');
    this.InsuranceMemberErrorMessages.pMemberId = "";
    this._insurancememberService.GetallInsurancemembers(MembertypeID).subscribe(json => {
      if (json) {
        this.AllInsuranceMembers = json
      }
    });
  }
  public GetInsurenceSchemes() {
    debugger;
    let Membertype = this.buttontype != 'Edit' ? this.Insurancememberform.controls.pMembertype.value : this.Datatobind.pMembertype;
    let Applicanttype = this.buttontype != 'Edit' ? this.Insurancememberform.controls.pApplicanttype.value : this.Datatobind.pApplicanttype;
    this.Insurancememberform.controls.pSchemeId.setValue(null);
    this.Insurancememberform.controls.pSchemeName.setValue('');
    this.InsuranceMemberErrorMessages.pSchemeId = "";
    this._insurancememberService.GetInsuranceSchemes(Membertype, Applicanttype).subscribe(json => {
      debugger;
      if (json) {
        this.InsuranceSchemeDetails = json
      }
    });
  }
  public GetApplicantsDetails() {
    this._insurancememberService.GetApplicantsDetails().subscribe(json => {
      debugger;
      if (json) {
        this.ApplicantList = json
      }
    });
  }
  GetMemberDetailsByid(Memberid) {
    this._insurancememberService.GetMemberDetailsforview(Memberid).subscribe(json => {
      debugger;
      if (json) {
        this.MemberDetailsList = json
        this.accountHoldername = this.MemberDetailsList.pAccountholdername;
        this.membercontactId = this.MemberDetailsList.pContactrefid;
        this.memberId = this.MemberDetailsList.pMemberrefcode;
        this.Doj = this.MemberDetailsList.pJoiningDate;
        this.membertype = this.MemberDetailsList.pMembertype;
        this.Dob = this.MemberDetailsList.pDateofbirth;
        this.age = this.MemberDetailsList.pAge;
        this.nominee = this.MemberDetailsList.pNomineeName;
        this.relation = this.MemberDetailsList.pNomimneeRelation;
      }
    });
  }
  getidProofTypeList() {
    this._FIIndividualService.getDocumentGroupNames().subscribe(json => {

      if (json != null) {
        this.idProofTypeList = json
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });

  }
  GetInsurancedetailsForEdit()
  {
    debugger
    this.Datatobind=this._insurancememberService.GiveInsuranceMemberDetailsForEdit()
     console.log("Data to bind",this.Datatobind)
    this.Insurancememberform.controls.pMembertypeId.disable();
    this.Insurancememberform.controls.pApplicanttype.disable();
    this.Insurancememberform.controls.pSchemeId.disable();
    this.Insurancememberform.controls.pMemberId.disable();
    this.GetInsurenceSchemes();
    this.GetAllInsuranceMembers(this.Datatobind.pMembertypeId);
    this.Insurancememberform.patchValue({
      ptypeofoperation: 'UPDATE',
      pRecordid:this.Datatobind.pRecordid,
      pMembertypeId:this.Datatobind.pMembertypeId,
      pMembertype:this.Datatobind.pMembertype,
      pApplicanttype:this.Datatobind.pApplicanttype,
      pTransdate:this.Datatobind.pTransdate,
      pInsuranceType:this.Datatobind.pInsuranceType,
      pPolicystartdate:this.Datatobind.pPolicystartdate != null ? this.Datatobind.pPolicystartdate : '',
      pPolicyenddate:this.Datatobind.pPolicyenddate != null ? this.Datatobind.pPolicyenddate : '',
      pPolicycoveragePeriod: this.Datatobind.pPolicycoveragePeriod,
      pSchemeName:this.Datatobind.pSchemeName,
      pSchemeId:this.Datatobind.pSchemeId,
      pMemberId:this.Datatobind.pMemberId,
      pMemberCodeandName:this.Datatobind.pMemberCodeandName
    });
    
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Contactid'].setValue(this.Datatobind.contactid);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pContactrefid'].setValue(this.Datatobind.pContactrefid);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pMemberrefcode'].setValue(this.Datatobind.pMemberCodeandName);
    this.Contactid = this.Datatobind.contactid;
    if(this.Datatobind._InsuranceschemeDetailsEdit!=null)
    {
      this.IsSchemeviewdetails = true;
      this.SchemeCode = this.Datatobind._InsuranceschemeDetailsEdit.insuranceschemeCode;
      this.claimType = this.Datatobind._InsuranceschemeDetailsEdit.claimType;
      this.claimAmount = this.Datatobind._InsuranceschemeDetailsEdit.claimamount;
      this.premiumAmount = this.Datatobind._InsuranceschemeDetailsEdit.premiumamount;
      this.premiumPayin = this.Datatobind._InsuranceschemeDetailsEdit.premiumPayin;
      this.schemeDuration =this.Datatobind._InsuranceschemeDetailsEdit.insuranceschemeDuration;
      this.paidStatus = this.Datatobind._InsuranceschemeDetailsEdit.ispremiumRefund;
    }
    else{
      this.IsSchemeviewdetails=false
    }
    if(this.Datatobind._InsuranceMemberNomineeDetailsEditList.length>0)
    {
      this.NomineeDetailslist=this.Datatobind._InsuranceMemberNomineeDetailsEditList
      this.NomineeDetailslist.filter(item=>{
        item.pCreatedby=this._CommonService.pCreatedby
      })
    }
    

    //this.MembertypeDisable = true;
    //this.ApplicanttypeDisable = true;
    //this.InsuranceSchemeDisable = true;
    //this.MembernameDisable = true;
  }
  
  MembertypeChange(event) {
    let membertypeName = event.pmembertype;
    let membertypeId = event.pmembertypeid;
    this.Insurancememberform.controls.pMembertype.setValue(membertypeName);
    this.GetInsurenceSchemes();
    this.GetAllInsuranceMembers(membertypeId);
   
  }
  ApplicantypeChange(event) {
    this.GetInsurenceSchemes();
  }
  MemberChange(event) {
    debugger;
    let Membername = event.pMemberCodeandName;
    this.Insurancememberform.controls.pMemberCodeandName.setValue(Membername);
    this.Contactid = event.contactid;
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Contactid'].setValue(event.contactid);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pContactrefid'].setValue(event.pContactrefid);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pMemberrefcode'].setValue(event.pMemberCodeandName);
    this.checkInsuranceMemberDuplicates();
    this.GetMemberDetailsByid(event.pMemberId);
    
  }

  pidprooftypeChange($event) {
    debugger;
    const pDocumentId = $event.pDocumentGroupId;
    this.idProofList = [];

    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.pDocumentGroup;
      this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['IdproofType'].setValue(pDocumentGroup);
      this.getidProofList(pDocumentId)
    }
    

  }

  getidProofList(pDocumentId) {
    this._FIIndividualService.getDocumentNames(pDocumentId).subscribe(json => {
      if (json != null) {
        this.idProofList = json
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });

  }
  public InsuranceSchemeDetailsChange(event) {
    debugger;

    let SchemeId = this.Insurancememberform.controls.pSchemeId.value;
    let schemename = event.pInsurencename;
  
    this.Insurancememberform.controls.pSchemeName.setValue(schemename);
    if (SchemeId != "") {
      this._insurancememberService.GetInsurenceSchemeDetails(SchemeId).subscribe(json => {
        debugger;
        if (json) {
          this.IsSchemeviewdetails = true;
          this.InsuranceSchemeDetailsView = json
          this.SchemeCode = this.InsuranceSchemeDetailsView.insuranceschemeCode;
          this.claimType = this.InsuranceSchemeDetailsView.claimType;
          this.claimAmount = this.InsuranceSchemeDetailsView.claimamount;
          this.premiumAmount = this.InsuranceSchemeDetailsView.premiumamount;
          this.premiumPayin = this.InsuranceSchemeDetailsView.premiumPayin;
          this.schemeDuration = this.InsuranceSchemeDetailsView.insuranceschemeDuration;
          this.paidStatus = this.InsuranceSchemeDetailsView.ispremiumRefund;
          
        }
        else {
          this.IsSchemeviewdetails = false;
        }
      });
    }
  }
  policyStartDatechange(event) {
    this.dpConfig1.minDate = event;
    this.startdate = this.datePipe.transform(event, "MM/dd/yyyy");
    
      let coveragePeriod = this._CommonService.ageCalculatorYYYYMMDD(this.startdate, this.enddate);
      if (!isNullOrEmptyString(coveragePeriod)) {
        this.coveragePeriod = coveragePeriod;
        this.Insurancememberform.controls.pPolicycoveragePeriod.setValue(this.coveragePeriod);
     
    }
  }
  policyEndDatechange(event) {
    debugger;
    
    this.enddate = this.datePipe.transform(event, "MM/dd/yyyy");
    let coveragePeriod = this._CommonService.ageCalculatorYYYYMMDD(this.startdate, this.enddate);
      if (!isNullOrEmptyString(coveragePeriod)) {
        this.coveragePeriod = coveragePeriod;
        this.Insurancememberform.controls.pPolicycoveragePeriod.setValue(this.coveragePeriod);
      }
   
  }
  Datevalidation(): boolean {
    let fromdate = new Date(this.startdate);
    let todate = new Date(this.enddate);
    if (todate > fromdate) {


      this.Insurancememberform.controls.pPolicystartdate.setValue(new Date());
      return true;
    }
    else {
      return false;
    }
  }
  Dobchange(event) {
    debugger;
    let dob = this.datePipe.transform(event, "MM/dd/yyyy");
    let age = this._CommonService.ageCalculation(dob);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pAge'].setValue(age);
    //this.Insurancememberform.controls.InsuranceMemberNomineeDetailsList.controls.pAge.se
  }
  uploadAndProgress(event: any, files) {
    debugger;
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
      formData.append('NewFileName', this.Insurancememberform.value["IdProofname"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._CommonService.fileUpload(formData).subscribe(data => {
      this.kycFileName = data[1];
      this.imageResponse.name = data[1];
      this.kycFilePath = data[0];
    })
  }
  AddDataToDataTable() {
    debugger;
    //this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pNomineeName'].setValidators([Validators.required]);
    
    let isValid: boolean = true;
    const formControl = <FormGroup>this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList'];
    if (this.checkValidations(formControl, isValid)) {
      let dob = this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Dateofbirth'].value;
      dob = this.datePipe.transform(dob, "dd/MM/yyyy");
      this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Dateofbirth'].setValue(dob);
      this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Contactid'].setValue(this.Contactid);
      this.NomineeDetailslist.push(this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList'].value)
      console.log(this.NomineeDetailslist)
      this.ClearnomineeDetails();
    }
  }
  ClearnomineeDetails() {
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList'].reset();
    this.addInsuranceMemberNomineeDetails();
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pAge'].setValue(0);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pRecordid'].setValue(0);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['Contactid'].setValue(this.Contactid);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);
    this.InsuranceMemberErrorMessages = {};
  }
  SaveInsurancemember() {
    debugger;
    if (this.validateSavingAccountConfiguration()) {
      debugger;
      
      this.loading = true;
      if(this.buttontype=="Edit")
      {
        if(this.Datatobind._InsuranceschemeDetailsEdit!=undefined)
        {
          this.Insurancememberform.controls.pPremiumamount.setValue(this.Datatobind._InsuranceschemeDetailsEdit.premiumAmount)
        }
      }
     else{
      this.Insurancememberform.controls.pPremiumamount.setValue(this.premiumAmount)
      }
      let duplicatecount = 0;
      let Membercode = "";
      let MemberType = this.Insurancememberform.controls.pMemberCodeandName.value;
      if (!isNullOrEmptyString(MemberType))
        Membercode = MemberType.split('_')[0];
      let insuranceConfigid = this.Insurancememberform.controls.pSchemeId.value;
      let InsuranceType = this.Insurancememberform.controls.pInsuranceType.value;
      let Recordid = this.Insurancememberform.controls.pRecordid.value;
      this._insurancememberService.checkInsuranceMemberDuplicates(Membercode, insuranceConfigid, InsuranceType, Recordid).subscribe(count => {
        debugger;
        
        let typeofoperation = this.Insurancememberform.controls.ptypeofoperation.value;
       
        if (count) {

          this._CommonService.showWarningMessage('Member Name already exist');
          this.Insurancememberform.controls.pMemberId.setValue(null);
          this.Insurancememberform.controls.pMemberCodeandName.setValue('');
          this.loading = false;
        }
        else {
          let newdata = { _InsuranceMemberNomineeDetailsListSave: this.NomineeDetailslist };
          let Insurancememberdata = Object.assign(this.Insurancememberform.getRawValue(), newdata);
          let data = JSON.stringify(Insurancememberdata);
          this._insurancememberService.saveInsurenceMemberDetail(data).subscribe(res => {
            if (res) {
              this.loading = false;
              this.ClearInsuranceMember();
              this._CommonService.showInfoMessage('Saved Sucessfully')
              this.router.navigateByUrl("/InsuranceMemberView")
            }
            else {
              this.loading = false;
            }


          }, err => {
            this.loading = false;
            // this.toaster.error("Error while saving")
          });
        }
      });
     
      
     
    }
  }

  validateSavingAccountConfiguration(): boolean {
    let isValid: boolean = true;
    
    try {

      isValid= this.checkValidations(this.Insurancememberform, isValid)
      
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    return isValid;
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
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          
          //if (key != 'InsuranceMemberNomineeDetailsList')
          //  this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.InsuranceMemberErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
              
                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.InsuranceMemberErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }

    }
    catch (e) {
      this._CommonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
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
      this._CommonService.showErrorMessage(e);
      return false;
    }



  }

  public removeHandler({ dataItem }) {

    const index: number = this.NomineeDetailslist.indexOf(dataItem);
    if (index !== -1) {
      this.NomineeDetailslist.splice(index, 1);
    }

  }
  datatableclickedit(dataItem)
  {
    debugger
    console.log(dataItem);
    this.Insurancememberform.value['InsuranceMemberNomineeDetailsList'].pNomineeName.setValue(this.Datatobind._InsuranceMemberNomineeDetailsEditList[0].pNomineeName)
    //this.Insurancememberform.controls.InsuranceMemberNomineeDetailsList.setValue(this.Datatobind._InsuranceMemberNomineeDetailsEditList)
  }

  ClearInsuranceMember() {
    this.Insurancememberform.reset();
    this.Insurancememberform.controls.pCreatedby.setValue(this._CommonService.pCreatedby);
    this.Insurancememberform['controls']['InsuranceMemberNomineeDetailsList']['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);
    this.InsuranceMemberErrorMessages = {};
  }
  checkInsuranceMemberDuplicates() {
    debugger;
    let Membercode = "";
    let MemberType = this.Insurancememberform.controls.pMemberCodeandName.value;
    if (!isNullOrEmptyString(MemberType))
      Membercode = MemberType.split('_')[0];
    let insuranceConfigid = this.Insurancememberform.controls.pSchemeId.value;
    let InsuranceType = this.Insurancememberform.controls.pInsuranceType.value;
    let Recordid = this.Insurancememberform.controls.pRecordid.value;
    this._insurancememberService.checkInsuranceMemberDuplicates(Membercode, insuranceConfigid, InsuranceType, Recordid).subscribe(count => {
      debugger;
      if (count) {
        this._CommonService.showWarningMessage('Member Name already exist');
        this.Insurancememberform.controls.pMemberId.setValue(null);
        this.Insurancememberform.controls.pMemberCodeandName.setValue('');
      }
    });
  }

  back(){
    debugger;
    this.router.navigate(['/InsuranceMemberView']);
  }
}
