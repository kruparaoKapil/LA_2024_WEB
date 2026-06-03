import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { debug, log, isNullOrUndefined } from 'util';
import { GroupService } from 'src/app/Services/Common/group.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service';
import { NomineedetailsComponent } from '../FD-AC-Creation/nomineedetails.component';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
declare let $: any
@Component({
  selector: 'app-savings-transactions-new',
  
  templateUrl: './savings-transactions-new.component.html',
  styles: []
})
export class SavingsTransactionsNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  @ViewChild(NomineedetailsComponent, { static: false }) nomineeDetails: NomineedetailsComponent
  SavingTranscationForm: FormGroup
  disablesavebutton=false;
  savebutton='Save & Continue';
  SavingType: string;
  constructor(private _fb: FormBuilder, private router:Router,private zone: NgZone,private _commonservice: CommonService, private _loanmasterservice: LoansmasterService, private savingtranscationservice: SavingtranscationService,private ActRoute: ActivatedRoute,private _CoJointmemberService:CoJointmemberService, private _rdtranscationservice: RdTransactionsService,private _GroupService: GroupService) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    window['CallingFunctionOutsideMemberData'] = {
      zone: this.zone,
      componentFn: (value) => this.MemberChange(value),
      component: this,
    };
    window['CallingFunctionToHideCard'] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };
  }
  SelectType: any;
  contactType: any;
  Applicanttype: any;
  SavingConfigid: any;
  SavingCode: any;
  MinAmount: any;
  Minmaintainbalance:any;
  SavingPayin: any;
  IntrestPayout: any;
  buttontype: any;
  groupshow:boolean=false;
  showmember:boolean=true;
  GroupDetails:any=[];
  Issavingpayinapplicable: any;
  MaxDepositAmount:any;
  MinDepositAmount: any;
  SavingTranscationErrorMessages: any;
  SavingAccountid: any;
  SelectedMembertypeid: any;
  selectedMemberdetails: any;

  membertypedetails: any = [];
  memberdetails: any = [];
  ApplicantTypes: any = [];
  ContactDetails: any = [];
  SavingAccDetails: any = [];

  Showdepositamount: boolean = false;
  ShowAccountConfigDetails: boolean = false;
  forMemberNameErrorMsg: boolean = false;
  notEditable: boolean = false;
  public loading = false;
  Nomineedetails: any = []
  disabletransactiondate = false;
  ngOnInit() {
    debugger;
    if (this._commonservice.comapnydetails != null)
    this.disabletransactiondate = this._commonservice.comapnydetails.pdatepickerenablestatus;

    this.disablesavebutton=false;
    this.savebutton='Save & Continue';
    this.SavingTranscationErrorMessages = {}
    this.Showdepositamount = false;

    this.SelectType = 'Individual';
    this.contactType = "Individual";
    this.SavingType = "CREATE";
    this.GetMemberTypeDetails();
    this.getApplicantTypes("Individual");
    this.FormGroup();
    this.GroupDetails=[];
    this.groupshow=false;
    this.showmember=true;
    this.SavingTranscationForm.controls.pContacttype.setValue('Individual');
    this.SelectTypeChange('Individual');
    //this.SavingTranscationForm.controls.pEntitytype.setValue("Individual")
    this.BlurEventAllControll(this.SavingTranscationForm);
    
    if (this.ActRoute.snapshot.params['id']) {
      debugger;
      this.buttontype = this.savingtranscationservice.GetButtonClickType();
       if (this.buttontype == "Edit") {
        this.BindData()
        this.notEditable = true;
       }
    }
    else{
        this.savingtranscationservice.SetButtonClickType('');
    }
  }

  FormGroup() {
    this.SavingTranscationForm = this._fb.group
      ({
        pTransdate: [new Date()],
        pSavingaccountid: [0],
        pSavingaccountno: [''],
        pMembertype: [''],
        pApplicanttype: [null, [Validators.required]],
        pContacttype: [''],
        pMembername: [''],
        pMembercode:[''],
        pGroupID:[0],
        pMemberid: [''],
        pSavingaccname: [''],
        pSavingconfigid: [null, [Validators.required]],
        pMembertypeid: [null, [Validators.required]],
        pInterestpayout: [''],
        pContactid: [0],
        pContactreferenceid: [''],
        pSavingsamount: [''],
        pSavingsamountpayin: [''],
        pIsjointapplicable: [false],
        pIsreferralapplicable: [false],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._commonservice.pCreatedby],

      })
  }
  public GetMemberTypeDetails() {
    this._commonservice.Getmemberdetails('SAVING ACCOUNT').subscribe(json => {
      this.membertypedetails = json;
    });
  }
  GetContactDetails(MemberID) {
    debugger
    if (MemberID && MemberID != undefined && MemberID != '') {
      this.savingtranscationservice.GetContactDetails(MemberID).subscribe(json => {
        debugger
        this.ContactDetails = json
        this.SavingTranscationForm.controls.pContactid.setValue(this.ContactDetails.pContactid);
        this.SavingTranscationForm.controls.pContactreferenceid.setValue(this.ContactDetails.pContactreferenceid);
      })
    }

  }
  GetMemberDetails(contacttype, membertype,GroupID)  {
    debugger
     if (membertype != "") {
      this._rdtranscationservice.GetMembersForRd(contacttype, membertype,GroupID).subscribe(json => {
        debugger;
        this.memberdetails = json;
        // $("#MemberData").kendoMultiColumnComboBox({
        //   dataTextField: "pMembername",
        //   dataValueField: "pMemberid",
        //   height: 400,
        //   columns: [
        //     { field: "pMembername", title: "Member Name", width: 200},
        //     { field: "pMembercode", title: "Member code", width: 200 },
        //     { field: "pContacttype", title: "Contact type", width: 200 },

        //   ],
        //   filter: "contains",
        //   filterFields: ["pMembername", "pMembercode", "pContacttype"],
        //   dataSource: this.memberdetails,
        //   select: this.SelectMemberData,
        //  change: this.CancelClick
        // });

      })
    }
  }
  SelectMemberData(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideMemberData'].componentFn(dataItem)

    }
  }
  CancelClick() {
    window['CallingFunctionToHideCard'].componentFn()
  }
  HideCard() {
    
    if (this.SavingTranscationForm.controls['pMemberid'].value) {
      this.SavingTranscationForm.controls['pMemberid'].setValue('');
      this.SavingTranscationForm.controls['pMembername'].setValue('');
      this.SavingTranscationErrorMessages.pMemberid = '';
    }
  }
  getApplicantTypes(type) {

    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, 0).subscribe(json => {
        if (json) {
          this.ApplicantTypes = json
        }
      })
    }
  }
  GroupName_Change(event){
    debugger;
    this.showmember=true;
    this.SavingTranscationForm.controls.pApplicanttype.setValue('');
    this.SavingTranscationForm.controls.pSavingaccname.setValue('');
    this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
    this.SavingTranscationForm.controls.pSavingsamount.clearValidators();
    this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
    this.SavingTranscationForm.controls.pSavingsamount.setValue('');
    this.SavingTranscationErrorMessages={};
    this.SavingAccDetails=[];
    this.forMemberNameErrorMsg = false;
    this.forMemberNameErrorMsg = false;
    this.SavingTranscationForm.controls.pMemberid.setValue('');
    this.SavingTranscationErrorMessages.pMemberid='';
    let MemberNamecontrol = this.SavingTranscationForm.controls['pMemberid'];
    MemberNamecontrol.clearValidators();
    let SelectedMembertype= this.SavingTranscationForm.controls.pMembertype.value;
    if(event.pGrouptype=='Individual Liability'){
      this.GetMemberDetails(this.contactType,SelectedMembertype,parseInt(event.pGroupid));
      MemberNamecontrol.setValidators([Validators.required]);
    }
    else{
      this.showmember=false;
       MemberNamecontrol.clearValidators();
       this.SavingTranscationForm.controls.pMemberid.setValue(1);
        this.SavingTranscationForm.controls.pContactid.setValue(1);
      // this.MemberidSave=1;
    }
   // MemberNamecontrol.updateValueAndValidity();
    this.SavingTranscationErrorMessages.pMemberid='';
     this.BlurEventAllControll(this.SavingTranscationForm);
  }
  GroupName_ChangeEdit(groupid){
    debugger;
    this.showmember=true;
    let grouptype=this.GroupDetails.filter(function(row){
      if(row.pGroupid==groupid){
        return row.pGrouptype;
      }
    });
    if(grouptype){
    this.SavingTranscationErrorMessages.pMemberid='';
    let MemberNamecontrol = this.SavingTranscationForm.controls['pMemberid'];
    MemberNamecontrol.clearValidators();
    let SelectedMembertype= this.SavingTranscationForm.controls.pMembertype.value;
    if(grouptype[0].pGrouptype=='Individual Liability'){
      this.GetMemberDetails(this.contactType,SelectedMembertype,parseInt(groupid));
      MemberNamecontrol.setValidators([Validators.required]);
    }
    else{
      this.showmember=false;
       MemberNamecontrol.clearValidators();
       this.SavingTranscationForm.controls.pMemberid.setValue(1);
        this.SavingTranscationForm.controls.pContactid.setValue(1);
      // this.MemberidSave=1;
    }
    MemberNamecontrol.updateValueAndValidity();
     this.BlurEventAllControll(this.SavingTranscationForm);
    }
  }
  MemberTypeChange(event) {
    debugger;
    if (event != undefined && event != "" && event != null) {
      this.clearControls();
      this.SavingTranscationForm.controls.pContacttype.setValue('Individual');
      this.SelectTypeChange('Individual');
      this.SavingTranscationForm.controls.pMemberid.setValue('');
      this.SavingTranscationForm.controls.pApplicanttype.setValue('');
      this.SavingTranscationForm.controls.pSavingaccname.setValue('');
      this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
      this.SavingTranscationForm.controls.pSavingsamount.clearValidators();
      this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
      this.SavingTranscationErrorMessages={};
      this.SavingAccDetails=[];
      this.forMemberNameErrorMsg = false;
      this.SelectedMembertypeid = event.pmembertypeid;
      this.SavingTranscationForm.controls.pMembertype.setValue(event.pmembertype);
      let ApplicantType = this.SavingTranscationForm.controls.pApplicanttype.value;
      // this.SavingTranscationForm.controls.pMemberid.setValue('');
     this.GetMemberDetails( this.contactType,event.pmembertype,0)
      this.GetSavingAccountDetails(this.SelectedMembertypeid, ApplicantType, "CREATE");
    }
    

  }
  MemberChange(event) {
    debugger;
    if (event != undefined && event != "" && event != null) {
      this.clearControls();
      this.SavingTranscationForm.controls.pApplicanttype.setValue('');
      this.SavingTranscationForm.controls.pSavingaccname.setValue('');
      this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
      this.SavingTranscationForm.controls.pSavingsamount.clearValidators();
      this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
      this.SavingTranscationErrorMessages={};
      this.SavingAccDetails=[];
      this.forMemberNameErrorMsg = false;
      this.forMemberNameErrorMsg = false;
      if (this.CheckMemberDuplicates(event.pMemberId)) {
        this.selectedMemberdetails = event;
        this.SavingTranscationForm.controls.pMembercode.setValue(event.pMemberCode);
        this.SavingTranscationForm.controls.pMembername.setValue(event.pMemberName);
       this.SavingTranscationForm.controls.pMemberid.setValue(event.pMemberId);
       this._CoJointmemberService._setfdMembercode(event.pMemberCode,event.pMemberId)

        this.GetContactDetails(event.pMemberId)
      }
    }

  }
  CheckMemberDuplicates(Memberid): boolean {
    
    let isValid: boolean = true;

    let errormsg = "";
    this.SavingAccountid = 0;
    this.savingtranscationservice.CheckMemberDuplicates(Memberid, this.SavingAccountid).subscribe(count => {
      debugger;
      if (count==0) {
        isValid = true;
      }
      else {
        errormsg = "Member Already Exists";
          this._commonservice.showWarningMessage(errormsg);
          this.SavingTranscationForm.controls.pMemberid.setValue('');
          this.SavingTranscationForm.controls.pMembername.setValue('');
          this.selectedMemberdetails = [];
          isValid = false;
          return
        }
    })
    return isValid;
  }
  SelectTypeChange(type) {
    debugger
    this.contactType = type
    this.ShowAccountConfigDetails=false;
    this.groupshow=false;
    this.showmember=true;
    this.Showdepositamount=false;
    this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
    this.SavingAccDetails=[];
    this.SavingTranscationForm.controls.pMemberid.setValue(null)
    this.SavingTranscationForm.controls.pApplicanttype.setValue("");
     this.SavingTranscationForm.controls.pGroupID.setValue('');
     this.SavingTranscationForm.controls.pMembername.setValue('');
    let GroupNamecontrol = this.SavingTranscationForm.controls['pGroupID'];
    GroupNamecontrol.clearValidators();
    let MemberNamecontrol = this.SavingTranscationForm.controls['pMemberid'];
    MemberNamecontrol.setValidators([Validators.required]);
    this.memberdetails=[];
    this.GroupDetails=[];
    this.selectedMemberdetails = [];
    let SelectedMembertype= this.SavingTranscationForm.controls.pMembertype.value;
     if (this.contactType == "Individual") {
      this.GetMemberDetails(this.contactType,SelectedMembertype,0);
      this.SavingTranscationForm.controls.pGroupID.setValue(0);
      this.getApplicantTypes(this.contactType);
    }
    else if (this.contactType == "Business Entity"){
      this.GetMemberDetails(this.contactType,SelectedMembertype,0); 
      this.getApplicantTypes(this.contactType);
       this.SavingTranscationForm.controls.pGroupID.setValue(0);
    }
    else{
      this.groupshow=true;
      this.GetGroupNames();
      this.getApplicantTypes('');
      GroupNamecontrol.setValidators([Validators.required]);
    }
     MemberNamecontrol.updateValueAndValidity();
     GroupNamecontrol.updateValueAndValidity(); 
     this.SavingTranscationErrorMessages = {}; 
     this.BlurEventAllControll(this.SavingTranscationForm);
     
   
  }
  GetGroupNames(){
    debugger;
    debugger;
     this._GroupService.GetGroupDetails().subscribe(res => {
      debugger;
      this.GroupDetails= res;
      let typeofoperation=this.SavingTranscationForm.controls.ptypeofoperation.value;
      if(typeofoperation=='UPDATE'){
        let groupid=this.SavingTranscationForm.controls.pGroupID.value;
        this.GroupName_ChangeEdit(groupid);
      }
    },
      (error) => {
        this._commonservice.showErrorMessage(error);
      });
  }
  GetSavingAccountDetails(Membertypeid, Applicanttype, savingtype) {
    debugger
    this.savingtranscationservice.GetSavingAccountDetails(Membertypeid, Applicanttype, savingtype).subscribe(json => {
      this.SavingAccDetails = json;
     
    })
  }
   ClearForm(){
    debugger;
    if(this.buttontype=='Edit'){
      this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
      this.ShowAccountConfigDetails=false;
      this.Showdepositamount=false;
    }
    else
    {
    this.clearControls();
    this.disablesavebutton=false;
    this.savebutton='Save & Continue';
    this.SavingTranscationErrorMessages = {}
    this.Showdepositamount = false;
    this.SelectType = 'Individual';
    this.contactType = "Individual";
    this.SavingType = "CREATE";
    this.GetMemberTypeDetails();
    this.getApplicantTypes("Individual");
    this.FormGroup();
    this.GroupDetails=[];
    this.groupshow=false;
    this.showmember=true;
    this.SavingTranscationForm.controls.pContacttype.setValue('Individual');
    this.SelectTypeChange('Individual');
    this.BlurEventAllControll(this.SavingTranscationForm);
  }
  }
  clearControls(){
          this.SavingCode = '';
          this.SavingPayin =''
          this.IntrestPayout ='';
          this.MinAmount ='';
          this.Minmaintainbalance='';
          this.MaxDepositAmount = '';
          this.MinDepositAmount = '';
          this.Issavingpayinapplicable ='';
          this.ShowAccountConfigDetails=false;
          this.Showdepositamount=false;
  }
  changedepositamount(event)
  {
   debugger;
  
   if(event.target.value!="")
   {
     this.SavingTranscationErrorMessages.pSavingsamount=null;
     let DepositAmount = parseFloat(event.target.value.toString().replace(/,/g, ""));
     if (DepositAmount > this.MaxDepositAmount || DepositAmount<this.MinDepositAmount)
    {
      this._commonservice.showWarningMessage("The Amount Should be in between " + this.MinDepositAmount + "&" + this.MaxDepositAmount);
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
    }
   }
   else{
     this.SavingTranscationErrorMessages.pSavingsamount='Deposit Amount Required';
   }
   
  }
  SavingAccChange(event) {
    debugger;
  
    if (event != undefined) {
      
      this.SavingTranscationErrorMessages.pSavingconfigid = '';
      if (this.SelectedMembertypeid != undefined) {
        this.SavingTranscationForm.controls.pSavingconfigid.setValue(event.pSavingconfigid);
        this.SavingTranscationForm.controls.pSavingaccname.setValue(event.pSavingaccname);
        this.SavingTranscationForm.controls.pSavingsamount.setValue('');
        
          this.savingtranscationservice.GetSavingAccountConfigDetails(event.pSavingconfigid, this.SelectedMembertypeid, this.Applicanttype, this.SavingType).subscribe(json => {
          debugger
          let Configdetails = json[0];
          this.ShowAccountConfigDetails = true;
          this.SavingCode = Configdetails.pSavingaccnamecode;
          this.SavingPayin = Configdetails.pSavingspayinmode;
          this.IntrestPayout = Configdetails.pInterestpayout;
          this.MinAmount = Configdetails.pMinopenamount;
          this.Minmaintainbalance=Configdetails.pMinmaintainbalance;
          this.MaxDepositAmount = Configdetails.pSavingmaxdepositamount;
          this.MinDepositAmount = Configdetails.pSavingmindepositamount;
          this.Issavingpayinapplicable = Configdetails.pIssavingspayinapplicable;
          this.SavingTranscationForm.controls.pInterestpayout.setValue(this.IntrestPayout); 
          if (this.Issavingpayinapplicable == true) {
            this.SavingTranscationErrorMessages.pSavingsamount = '';
              this.SavingTranscationForm.controls.pSavingsamount.setValidators(Validators.required);
            //  this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
             // this.SavingTranscationErrorMessages = {};
            //  this.BlurEventAllControll(this.SavingTranscationForm);
              this.Showdepositamount = true
            }
            else{
              this.SavingTranscationForm.controls.pSavingsamount.clearValidators();
              this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
          ///    this.SavingTranscationErrorMessages = {};
          //   this.BlurEventAllControll(this.SavingTranscationForm);
              this.Showdepositamount = false;
            }
          

        })
      }
    }

  }
  ApplicanttypeChange(event)
  {
    debugger;
    if (event != undefined && event != "" && event != null) {
      this.clearControls();
      this.SavingTranscationForm.controls.pSavingaccname.setValue('');
      this.SavingTranscationForm.controls.pSavingconfigid.setValue('');
      this.SavingTranscationForm.controls.pSavingsamount.clearValidators();
      this.SavingTranscationForm.controls.pSavingsamount.updateValueAndValidity();
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
      this.SavingTranscationErrorMessages={};
      this.Applicanttype = event.pApplicanttype     
      let Membertypeid = this.SavingTranscationForm.controls.pMembertypeid.value;
      this.Showdepositamount = false;
      this.SavingAccDetails=[];
      this.GetSavingAccountDetails(Membertypeid, this.Applicanttype, "CREATE");
      
    }
  }
  //NextTabClick() {
  //  debugger;
  //  let isValid: boolean = true;
  //  if (this.selectedMemberdetails) {
  //    this.SavingTranscationForm.controls.pMembercode.setValue(this.selectedMemberdetails.pMembercode);
  //    this.SavingTranscationForm.controls.pMembername.setValue(this.selectedMemberdetails.pMembername);
  //    this.SavingTranscationForm.controls.pMemberid.setValue(this.selectedMemberdetails.pMemberid);
  //  }
  //  let memberid = this.SavingTranscationForm.controls['pMemberid'].value;
  //  if (this.checkValidations(this.SavingTranscationForm, isValid)) {
  //    if (memberid == '' ||memberid == null ||memberid == undefined) {
  //      this.forMemberNameErrorMsg = true;
  //    }
  //    else {
  //      this.SavingTranscationForm.controls.pSavingconfigid.setValidators(Validators.required);
  //      this.SavingTranscationForm.controls.pSavingconfigid.updateValueAndValidity();
  //      this.BlurEventAllControll(this.SavingTranscationForm);
  //      let str = "savings-ac"
  //      $('.nav-item a[href="#' + str + '"]').tab('show');
  //    }
  //  }
    
  //}
  SaveForm() {
    debugger;
    let Savingsamount=this.SavingTranscationForm.controls.pSavingsamount.value;
    let DepositAmount = parseFloat(Savingsamount.toString().replace(/,/g, ""));
     if (DepositAmount > this.MaxDepositAmount || DepositAmount<this.MinDepositAmount)
    {
      this._commonservice.showWarningMessage("The Amount Should be in between " + this.MinDepositAmount + "&" + this.MaxDepositAmount);
      this.SavingTranscationForm.controls.pSavingsamount.setValue('');
     return
    }
    this.loading = true;
    let isValid: boolean = true;
    // if (this.selectedMemberdetails) {
    //   this.SavingTranscationForm.controls.pMembercode.setValue(this.selectedMemberdetails.pMembercode);
    //   this.SavingTranscationForm.controls.pMembername.setValue(this.selectedMemberdetails.pMembername);
    //   this.SavingTranscationForm.controls.pMemberid.setValue(this.selectedMemberdetails.pMemberid);
    // }
    
    if (this.checkValidations(this.SavingTranscationForm, isValid)) {
             // if(this.SavingTranscationForm.controls.pTransdate.value!=null){
        //   let transactiondate=this.SavingTranscationForm.controls.pTransdate.value.toISOString();
        //   this.SavingTranscationForm.controls.pTransdate.setValue(transactiondate);
        // }
      let formdata = (this.SavingTranscationForm.getRawValue())
      let jsondata = JSON.stringify(formdata);
      this.savingtranscationservice.SaveSavingAccountTransaction(jsondata).subscribe(res => {
        debugger;
        // this.loading = false;
        if (res) {
          let resdata={accountId:res['pSavingaccountid'],accountNo:res['pSavingaccountno']};
          this._CoJointmemberService._SetShareAccountdata(resdata);
          let SavingAccounttransdetails = null;
          // this.loading = false;
          SavingAccounttransdetails = Object.assign(this.ContactDetails, res);
          this.disablesavebutton=true;
          this.savebutton='Processing';
          this.savingtranscationservice.SetAccountNoAndId(SavingAccounttransdetails);
          this.loading = false;
          let str = "add-joint-member"
          $('.nav-item a[href="#' + str + '"]').tab('show');
          if (this.buttontype == "Edit") {
       //     this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
            this._commonservice.showInfoMessage("Update successfully");
            let pMembercode = this.SavingTranscationForm.controls.pMembercode.value;
            this._CoJointmemberService.GetMemberEditNomineeDetails(pMembercode,'Savings Transaction').subscribe(json => {
              debugger
            
               this._CoJointmemberService.sendMemberNomineeDetails(json);
           
      
            });
          }
          else{
            this._commonservice.showInfoMessage("Saved successfully");
            let pMembercode = this.SavingTranscationForm.controls.pMembercode.value;
            this._rdtranscationservice.GetMemberNomineeDetails(pMembercode).subscribe(json => {
              debugger
              this.Nomineedetails = [];
              this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
              this.Nomineedetails = json;
               this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
           
      
            });
          }
        

        }
      }, err => {
        // this.loading = false;
        this._commonservice.showErrorMessage("Error while saving")
        this.loading = false;
         this.disablesavebutton=false;
         this.savebutton='Save & Continue';
      });
    }
    else{
      this.loading = false;
       this.disablesavebutton=false;
    this.savebutton='Save & Continue';
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
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
     
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          //if (key != 'InsuranceMemberNomineeDetailsList')
          //  this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.SavingTranscationErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {

                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.SavingTranscationErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }

    }
    catch (e) {
      this._commonservice.showErrorMessage(key);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._commonservice.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
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
      this._commonservice.showErrorMessage(e);
      return false;
    }



  }

  BindData() {
    debugger;
    let EditData = this.savingtranscationservice.GetSavingTransactionDetailsForEdit();
  //  let savingTransData = EditData[0].savingAccountTransactionlist;
    this.GetSavingAccountDetails(EditData.pMembertypeid, EditData.pApplicanttype, "EDIT");
    this.GetContactDetails(EditData.pMemberid)
    this.GetMemberDetails(EditData.pContacttype,EditData.pMembertype, EditData.pGroupID)
    this.savingtranscationservice.SetAccountNoAndId(EditData);
    this.SelectType = EditData.pContacttype;
    this._CoJointmemberService._setfdMembercode(EditData.pSavingaccountno,EditData.pSavingaccountid);
    this.SavingTranscationForm.controls.pMembercode.setValue(EditData.pMembercode);
    this.SavingTranscationForm.controls.pMembername.setValue(EditData.pMembername);
    this.SavingTranscationForm.controls.pMemberid.setValue(EditData.pMemberid);
    let Savingsamount=this._commonservice.currencyformat(EditData.pSavingsamount);
    this.SavingTranscationForm.patchValue({
      ptypeofoperation: "UPDATE",
      pSavingaccountid: EditData.pSavingaccountid,
      pSavingaccountno: EditData.pSavingaccountno,
      pTransdate: this._commonservice.formatDateFromDDMMYYYY(EditData.pTransdate),
      pMembertype: EditData.pMembertype,
      pApplicanttype: EditData.pApplicanttype,
      pContacttype: EditData.pContacttype,
      pMembername: EditData.pMembername,
      pMembercode: EditData.pMembercode,
      pMemberid: EditData.pMemberid,
      pSavingaccname: EditData.pSavingaccname,
      pSavingconfigid: EditData.pSavingconfigid,
      pMembertypeid: EditData.pMembertypeid,
      pInterestpayout: EditData.pInterestpayout,
      pContactid: EditData.pContactid,
      pGroupID:EditData.pGroupID==''?EditData.pGroupID=0:EditData.pGroupID,
      pContactreferenceid: EditData.pContactreferenceid,
      pSavingsamount:Savingsamount
    
    });
   
   
    debugger;
  
    this.SelectedMembertypeid = EditData.pMembertypeid;
    this.contactType = EditData.pContacttype;
    this.Applicanttype = EditData.pApplicanttype;
    let savingaccobj = ({ pSavingaccname: EditData.pSavingaccname, pSavingconfigid: EditData.pSavingconfigid })
    let groupid=EditData.pGroupID==''?EditData.pGroupID=0:EditData.pGroupID;
    this.SelectTypeEdit(EditData.pContacttype);
    this.GetMemberDetails(EditData.pContacttype, EditData.pMemberType,groupid);
    this.SavingType = "EDIT"
    this.SavingAccChange(savingaccobj);
    this.SavingTranscationForm.controls.pSavingsamount.setValue(Savingsamount);
     
        
          
  }
SelectTypeEdit(type){
  debugger;
 this.contactType = type;
    this.groupshow=false;
    this.showmember=true;
    let GroupNamecontrol = this.SavingTranscationForm.controls['pGroupID'];
    GroupNamecontrol.clearValidators();
    let MemberNamecontrol = this.SavingTranscationForm.controls['pMemberid'];
    MemberNamecontrol.setValidators([Validators.required]);
    
    let SelectedMembertype= this.SavingTranscationForm.controls.pMembertype.value;
     if (this.contactType == "Individual") {
      this.GetMemberDetails(this.contactType,SelectedMembertype,0);
      this.getApplicantTypes(this.contactType);
    }
    else if (this.contactType == "Business Entity"){
      this.GetMemberDetails(this.contactType,SelectedMembertype,0);
      this.getApplicantTypes(this.contactType);
    }
    else{
      this.groupshow=true;
      this.GetGroupNames();
      this.getApplicantTypes('');
      GroupNamecontrol.setValidators([Validators.required]);
    }
     MemberNamecontrol.updateValueAndValidity();
     GroupNamecontrol.updateValueAndValidity();
     this.BlurEventAllControll(this.SavingTranscationForm);
     this.SavingTranscationErrorMessages = {}
}
  back(){
    debugger;
    this.router.navigate(['/SavingsTransactionsView']);
  }
}
