import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { log, debug } from 'util';
import { NomineedetailsComponent } from '../FD-AC-Creation/nomineedetails.component';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { GroupService } from 'src/app/Services/Common/group.service';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service';
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';
declare let $: any

@Component({
  selector: 'app-rd-transaction-new',
  templateUrl: './rd-transaction-new.component.html',
  styles: []
})
export class RdTransactionNewComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public depositdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  @ViewChild(NomineedetailsComponent, { static: false }) nomineeDetails: NomineedetailsComponent
  public maturitydateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  interestvalidation: number;
  ratepersquareyard: any;
  ratesquareyard: number;
  constructor(private _route: ActivatedRoute, private _fb: FormBuilder, private datePipe: DatePipe, private zone: NgZone, private _rdtranscationservice: RdTransactionsService, private commonservice: CommonService, private savingtranscationservice: SavingtranscationService, private router: Router, private _CoJointmemberService: CoJointmemberService, private _CoReferralService: CoReferralService, private _GroupService: GroupService) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.depositdateConfig.dateInputFormat = 'DD/MM/YYYY'
    this.depositdateConfig.minDate = new Date();
    this.depositdateConfig.showWeekNumbers = false;

    this.maturitydateConfig.dateInputFormat = 'DD/MM/YYYY'
    this.maturitydateConfig.maxDate = new Date();
    this.maturitydateConfig.showWeekNumbers = false;

    // window['CallingFunctionOutsideMemberData'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.MemberChanges(value),
    //   component: this,
    // };
    // window['CallingFunctionToHideCard'] = {
    //   zone: this.zone,
    //   componentFn: () => this.HideCard(),
    //   component: this,
    // };
  }
  status = false;
  disablevalueper100: boolean = false;
  RdTranscationform: FormGroup;
  SelectType: any;
  RdtranscationErrors: any;
  contactType: any;
  showcard: boolean = false;
  showgrid: boolean;
  Rdconfigid: any;
  MaturityAmnt: any;
  IntrestAmount: any;
  Rdname: any;
  Memberid: any;
  Businessentitystatus: boolean = false;
  groupshow: boolean = false;
  showmember: boolean = true;
  GroupDetails: any = [];
  tenuremodelist: any = []
  filtertenuremodelist = [];
  Contactid: any;
  tenureontable: boolean = false;
  pinstallmentAmount: any;
  Caltype: any;
  Intrestpayout: any;
  MemberidSave: any;
  Showmaturityamountforintrest: boolean = false;
  ShowIntrestamountforintrest: boolean = false;
  Intrestrate = 0
  contactrefid: any;
  showIntrestcompounding: boolean;
  calculatedepositamount: any;
  showintrestrate: boolean;
  showvalueper100: boolean
  Showmaturityamount: boolean;
  Nomineedetails: any = []
  ShowIntrestamount: boolean;
  DepositAmountBaseconintrest: boolean = false;
  DepositAmountBasedontable: boolean = false
  Matrityamountontable: any = 0;
  memberdetails: any = [];
  FdDetailsRecordid: any;
  RdnameandCode: any;
  RdCalculationmode: any;
  TenureMode: any;
  Tenure: any;
  Investmentperiodfrom: any;
  Investmentperiodto: any;
  IntrestrateFrom: any;
  Totalnooffromdays: any;
  Totalnooftodays: any;
  Membercode: any;
  IntrestrateTo: any;
  pMaxInstallmentAmount: any;
  depositamountontable: any;
  intrestamountontable: any;
  ptotaldepositamount: any = 0;
  pMinInstallmentAmount: any;
  Valueper100: any;
  membertypedetails: any = [];
  Tenuremodedetails: any = [];
  DepositAmountdetails: any;
  RdSchemes: any = [];
  Multiplesof: any;
  RdAccountId: any;
  RdaccountNo: any;
  Datatobind: any;
  RdSchemeDetails: any = []
  griddata: any = []
  Branchdetails: any = []
  Applicanttype: any;
  showchit = false;
  showcalculate: boolean = false;
  showtenureonintrest: boolean = false
  buttontype: any;
  IntrestCompounding: any;
  maturitydate: any
  SelectedMembertype: any;
  ApplicantTypes: any = [];
  Intrestratedisable: boolean;
  DateLockStatus: boolean = true;
  formattedData: any;
  ngOnInit() {
    this.memberdetails = [];
    this.SelectType = 'Contact';
    this.contactType = "Individual";
    this._rdtranscationservice.setcontacttype(this.contactType);
    this.GroupDetails = [];
    this.groupshow = false;
    this.showmember = true;
    this.FormGroup();
    this.SelectTypeChange('Individual');
    this.RdTranscationform.controls.pEntitytype.setValue("Individual")
    this.RdtranscationErrors = {}
    this.buttontype = this._rdtranscationservice.Newstatus();
    this.maturitydate = true;
    this.showgrid = false;
    this.Intrestratedisable = false
    if (this._route.snapshot.params['id']) {
      if (this.buttontype == "edit") {

        this.griddata = [];
        this.Rdname = "";

        this.GetDetailsToBind()
      }
    }
    //this.showchit=true
    this.GetApplicanttypes(this.contactType);
    //this.ngOnInit()
    //this.GetMemberDetails(this.contactType,"")
    this.GetBranchstatus()
    this.GetDateLockStatus();
    this.BlurEventAllControll(this.RdTranscationform)



  }
  GetDateLockStatus() {
    debugger;
    this.commonservice.GetDateLockStatus().subscribe(json => {
      debugger;
      this.DateLockStatus = json ? false : true;
    })
  }
  FormGroup() {
    this.RdTranscationform = this._fb.group({
      pTransdate: [new Date(), Validators.required],
      pMemberType: [''],
      pContactid: [0],
      pContactrefid: [''],
      pSquareyard: [''],
      pMembertypeId: ['', Validators.required],
      pApplicantType: [null, Validators.required],
      pGroupID: [0],
      pContacttype: [''],
      pEntitytype: [''],
      pMemberName: [''],
      pMemberCode: [''],
      pCaltype: [''],
      pMemberId: [0],
      pRdConfigId: [null, Validators.required],
      pRdname: [''],
      pRdcode: [''],
      rdtranscationradio: [''],
      rdtranscationradio1: [''],
      pRdnameCode: [''],
      pRdAccountNo: ['0'],
      pRdAccountId: ['0'],
      pInterestRate: ['', Validators.required],
      pRdCalculationmode: [''],
      pInterestPayOut: ['On Maturity', Validators.required],
      pInterestType: [''],
      pInterestTenureMode: ['', Validators.required],
      pTenortype: ['', Validators.required],
      pInterestTenure: ['', Validators.required],
      pChitbranchId: ['0'],
      pChitbranchname: [''],
      pinstallmentAmount: ['', Validators.required],
      pMaturityAmount: [0],
      pInterestAmount: [0],

      pDepositAmount: [this.ptotaldepositamount],
      pMaturityDate: [new Date()],
      pDepositDate: [new Date()],
      pIsAutoRenew: [false],
      pIsinterestDepositinBank: [false],
      pIsRenewOnlyPrincipleandInterest: [false],
      pIsRenewOnlyPrinciple: [false],
      pIsinterestDepositinSaving: [false],
      pIsJointMembersapplicable: [false],
      pIsReferralsapplicable: [false],
      pIsNomineesapplicable: [false],
      pCreatedby: this.commonservice.pCreatedby,
      pTypeofOperation: ['CREATE']
    })

  }
  Transdateclick() {
    let Transdate = this.RdTranscationform.controls.pTransdate.value;
    this.depositdateConfig.minDate = Transdate;
    let DepositDate = this.RdTranscationform.controls.pDepositDate.value;
    if (Transdate > DepositDate) {
      this.RdTranscationform.controls.pDepositDate.setValue(Transdate);
      this.DepositDatechanges();
    }
  }
  SelectTypeChange(type) {
    debugger
    this.contactType = type;
    this.groupshow = false;
    this.showmember = true;
    this.RdTranscationform.controls.pinstallmentAmount.setValue("");
    this._rdtranscationservice.setcontacttype(this.contactType);
    // this._rdtranscationservice.setcontacttype(this.contactType);
    this.RdTranscationform.controls.pMemberId.setValue(null)
    this.RdTranscationform.controls.pApplicantType.setValue("");
    this.clearfields();
    this.RdTranscationform.controls.pRdConfigId.setValue("");
    this.RdTranscationform.controls.pGroupID.setValue("");
    let GroupNamecontrol = this.RdTranscationform.controls['pGroupID'];
    GroupNamecontrol.clearValidators();
    let MemberNamecontrol = this.RdTranscationform.controls['pMemberId'];
    MemberNamecontrol.setValidators([Validators.required]);
    this.RdSchemes = [];
    this.memberdetails = "";
    this.griddata = [];
    this.filtertenuremodelist = [];
    this.DepositAmountBasedontable = false;
    this.RdTranscationform.controls.pDepositAmount.setValue('');
    this.DepositAmountdetails = [];
    //this.RdTranscationform.controls.pInterestPayOut.setValue('');
    this.RdSchemeDetails = [];
    this.showintrestrate = false;
    this.RdTranscationform.controls.pInterestRate.setValue('');
    this.showvalueper100 = false;
    this.showcalculate = false;
    this.ShowIntrestamount = false;
    this.showgrid = false;
    this.ptotaldepositamount = 0;
    this.intrestamountontable = 0;
    this.Showmaturityamount = false
    this.Matrityamountontable = 0;
    this.ShowIntrestamountforintrest = false;
    this.IntrestAmount = 0;
    this.Showmaturityamountforintrest = false;
    this.MaturityAmnt = 0;
    this.RdTranscationform.controls.pMaturityDate.setValue(new Date());
    this.RdTranscationform.controls.pDepositDate.setValue(new Date());
    this.RdtranscationErrors = {};



    if (this.contactType == "Individual") {
      this.Businessentitystatus = false;
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, 0);
      this.RdTranscationform.controls.pGroupID.setValue(0);
      this.GetApplicanttypes(this.contactType);
    }
    else if (this.contactType == "Business Entity") {
      this.Businessentitystatus = true;
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, 0);
      this.GetApplicanttypes(this.contactType);
      this.RdTranscationform.controls.pGroupID.setValue(0);
    }
    else {
      this.groupshow = true;
      this.GetGroupNames();
      this.GetApplicanttypes('');
      GroupNamecontrol.setValidators([Validators.required]);
    }
    MemberNamecontrol.updateValueAndValidity();
    GroupNamecontrol.updateValueAndValidity();
    this.RdtranscationErrors = {}
    this.BlurEventAllControll(this.RdTranscationform);
  }
  SelectTypeEdit(type) {
    debugger
    this.contactType = type;
    this.groupshow = false;
    this.showmember = true;
    this._rdtranscationservice.setcontacttype(this.contactType);
    let GroupNamecontrol = this.RdTranscationform.controls['pGroupID'];
    GroupNamecontrol.clearValidators();
    let MemberNamecontrol = this.RdTranscationform.controls['pMemberId'];
    MemberNamecontrol.setValidators([Validators.required]);

    if (this.contactType == "Individual") {
      this.Businessentitystatus = false;
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, 0);

      this.GetApplicanttypes(this.contactType);
    }
    else if (this.contactType == "Business Entity") {
      this.Businessentitystatus = true;
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, 0);
      this.GetApplicanttypes(this.contactType);
    }
    else {
      this.groupshow = true;
      this.GetGroupNames();
      this.GetApplicanttypes('');
      GroupNamecontrol.setValidators([Validators.required]);
    }
    MemberNamecontrol.updateValueAndValidity();
    GroupNamecontrol.updateValueAndValidity();
    this.RdtranscationErrors = {}
    this.BlurEventAllControll(this.RdTranscationform);

  }
  GetGroupNames() {
    debugger;
    this._GroupService.GetGroupDetails().subscribe(res => {
      debugger;
      this.GroupDetails = res;
      let typeofoperation = this.RdTranscationform.controls.pTypeofOperation.value;
      if (typeofoperation == 'UPDATE') {
        this.GroupName_ChangeEdit(this.Datatobind.pGroupID);
      }
    },
      (error) => {
        this.commonservice.showErrorMessage(error);
      });
  }
  GroupName_Change(event) {
    debugger;
    this.showmember = true;
    this.RdTranscationform.controls.pMemberId.setValue(null);
    let MemberNamecontrol = this.RdTranscationform.controls['pMemberId'];
    MemberNamecontrol.clearValidators();
    if (event.pGrouptype == 'Individual Liability') {
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, parseInt(event.pGroupid));
      MemberNamecontrol.setValidators([Validators.required]);
    }
    else {
      this.showmember = false;
      MemberNamecontrol.clearValidators();
      this.RdTranscationform.controls.pMemberId.setValue(1);
      this.RdTranscationform.controls.pContactid.setValue(1);
      this.MemberidSave = 1;
    }
    MemberNamecontrol.updateValueAndValidity();
    this.RdtranscationErrors.pMemberId = '';
    this.BlurEventAllControll(this.RdTranscationform);
  }
  GroupName_ChangeEdit(groupid) {
    debugger;
    this.showmember = true;
    let grouptype = this.GroupDetails.filter(function (row) {
      if (row.pGroupid == groupid) {
        return row.pGrouptype;
      }
    });
    if (grouptype) {
      this.RdtranscationErrors.pMemberId = '';
      let MemberNamecontrol = this.RdTranscationform.controls['pMemberId'];
      MemberNamecontrol.clearValidators();
      if (grouptype[0].pGrouptype == 'Individual Liability') {
        this.GetMemberDetails(this.contactType, this.SelectedMembertype, parseInt(groupid));
        MemberNamecontrol.setValidators([Validators.required]);
      }
      else {
        this.showmember = false;
        MemberNamecontrol.clearValidators();
        this.RdTranscationform.controls.pMemberId.setValue(1);
        this.RdTranscationform.controls.pContactid.setValue(1);
        this.MemberidSave = 1;
      }
      MemberNamecontrol.updateValueAndValidity();
      this.BlurEventAllControll(this.RdTranscationform);
    }
  }
  Radiobuttontype(type) {
    debugger
    // this.RdTranscationform.controls.pIsinterestDepositinSaving.setValue(false)
    // this.RdTranscationform.controls.pIsinterestDepositinBank.setValue(false)    
    // this.RdTranscationform.controls.pIsRenewOnlyPrincipleandInterest.setValue(false) 
    // this.RdTranscationform.controls.pIsRenewOnlyPrinciple.setValue(false)
    // this.RdTranscationform.controls.pIsAutoRenew.setValue(false)   
    if (type == 'Savings A/C') {
      this.RdTranscationform.controls.pIsinterestDepositinSaving.setValue(true)
      this.RdTranscationform.controls.rdtranscationradio.setValue(type)
    }
    else if (type == "Bank A/C") {
      this.RdTranscationform.controls.pIsinterestDepositinBank.setValue(true)
      this.RdTranscationform.controls.rdtranscationradio.setValue(type)
    }
    else if (type == "Renew Principal and interest") {
      this.RdTranscationform.controls.pIsRenewOnlyPrincipleandInterest.setValue(true)
      this.RdTranscationform.controls.rdtranscationradio1.setValue(type)
    }
    else if (type == "Renew Prinicipal only") {
      this.RdTranscationform.controls.pIsRenewOnlyPrinciple.setValue(true)
      this.RdTranscationform.controls.rdtranscationradio1.setValue(type)
    }
    else if (type == "Do not renew") {
      this.RdTranscationform.controls.pIsAutoRenew.setValue(true)
      this.RdTranscationform.controls.rdtranscationradio1.setValue(type)
    }
  }
  GetDetailsToBind() {
    debugger
    this.Datatobind = this._rdtranscationservice.GetDetailsForEdit();
    console.log('Edit Dara', this.Datatobind);
    this._CoJointmemberService._setfdMembercode(this.Datatobind.pMembercode, this.Datatobind.pMemberid);
    this.RdTranscationform.controls.pSquareyard.setValue(this.Datatobind.pSquareyard)
    // this.ratepersquareyard=this.Datatobind.pSquareyard
    this.RdTranscationform.controls.pTransdate.setValue(this.commonservice.formatDateFromDDMMYYYY(this.Datatobind.pTransDate))
    this.RdTranscationform.controls.pContacttype.setValue(this.Datatobind.pContacttype)
    // this.RdTranscationform.controls.pEntitytype.setValue(this.Datatobind.pContacttype == "Individual" ? this.Businessentitystatus = false : this.Businessentitystatus = true)
    this.RdTranscationform.controls.pEntitytype.setValue(this.Datatobind.pContacttype)
    this.RdTranscationform.controls.pMemberType.setValue(this.Datatobind.pMemberType)
    this.RdTranscationform.controls.pMembertypeId.setValue(this.Datatobind.pMembertypeId)
    this.RdTranscationform.controls.pApplicantType.setValue(this.Datatobind.pApplicantType)
    this.RdTranscationform.controls.pGroupID.setValue(this.Datatobind.pGroupID == '' ? this.Datatobind.pGroupID = 0 : this.Datatobind.pGroupID)
    //this.commonservice.getFormatDate(this.Datatobind.pDepositDate)
    this.RdTranscationform.controls.pTypeofOperation.setValue("UPDATE")

    // if(this.Datatobind.pContacttype=='Group'){
    // this.GroupName_ChangeEdit(this.Datatobind.pGroupID)
    // }
    debugger;
    this.SelectedMembertype = this.Datatobind.pMemberType
    this.Applicanttype = this.Datatobind.pApplicantType
    this.Rdconfigid = this.Datatobind.pRdConfigId;
    this.Rdname = this.Datatobind.pRdname;
    this.RdCalculationmode = this.Datatobind.pRdCalculationmode
    this.Contactid = this.Datatobind.pContactid
    this.contactrefid = this.Datatobind.pContactrefid;
    this.contactType = this.Datatobind.pContacttype;
    let groupid = this.Datatobind.pGroupID;
    this.RdTranscationform.controls.pCreatedby.setValue(this.commonservice.pCreatedby);
    this.SelectTypeEdit(this.Datatobind.pContacttype);
    this.GetMemberDetails(this.Datatobind.pContacttype, this.Datatobind.pMemberType, groupid);
    this.GetRdSchemes(this.Datatobind.pApplicantType, this.Datatobind.pMemberType)
    this.Rdschemechange(this.Datatobind.pRdConfigId);
    this.GetDataBasedOnTenureFn(this.Datatobind.pApplicantType, this.Datatobind.pMemberType, this.Datatobind.pRdConfigId, this.Datatobind.pRdname, this.Datatobind.pInterestTenure, this.Datatobind.pInterestTenureMode, this.Datatobind.pinstallmentAmount);
    this.RdnameandCode = this.Datatobind.pRdnameCode
    this.RdCalculationmode = this.Datatobind.pRdCalculationmode;
    //this.RdTranscationform.controls.pRdConfigId.setValue(event.pRdConfigId)
    this.Rdconfigid = this.Datatobind.pRdConfigId;
    this.Rdname = this.Datatobind.pRdname;
    if (this.RdCalculationmode == "TABLE") {
      this.tenureontable = true;
      this.DepositAmountBasedontable = true;
      this.DepositAmountBaseconintrest = false;
      this.showtenureonintrest = false;
      this.showintrestrate = false;
      this.showcalculate = false;
      this.IntrestCompounding = false;
      this.GetRdTotalDetails(this.Datatobind.pRdname, this.Applicanttype, this.SelectedMembertype)
      this.ptotaldepositamount = this.Datatobind.pDepositamount;
    }
    else {
      this.GetDataBasedOnTenure()
      this.tenureontable = false;
      this.showtenureonintrest = true;
      this.DepositAmountBasedontable = false;
      this.DepositAmountBaseconintrest = true;
      this.GetRdTotalDetails(this.Rdname, this.Applicanttype, this.SelectedMembertype)
      this.GetRdSchemeTenureModes(this.Rdname, this.Applicanttype, this.SelectedMembertype)
      // this.showintrestrate=true;
      // this.showcalculate = true;


    }
    this.RdTranscationform.controls.pRdConfigId.setValue(this.Datatobind.pRdConfigId)
    this.RdTranscationform.controls.pRdname.setValue(this.Datatobind.pRdname)
    this.RdTranscationform.controls.pRdcode.setValue(this.Datatobind.pRdcode)
    this.RdTranscationform.controls.pRdCalculationmode.setValue(this.Datatobind.pRdCalculationmode)
    this.RdTranscationform.controls.pRdAccountNo.setValue(this.Datatobind.pRdAccountNo)
    this.RdTranscationform.controls.pChitbranchId.setValue(this.Datatobind.pChitbranchId)
    this.RdTranscationform.controls.pChitbranchname.setValue('')
    this.RdTranscationform.controls.pRdAccountId.setValue(this.Datatobind.pRdAccountId)
    this.RdTranscationform.controls.pRdnameCode.setValue(this.Datatobind.pRdnameCode)
    this.RdTranscationform.controls.pContactid.setValue(this.Datatobind.pContactid)
    this.RdTranscationform.controls.pContactrefid.setValue(this.Datatobind.pContactrefid)
    this.RdTranscationform.controls.pInterestType.setValue(this.Datatobind.pInterestType)
    this.MemberidSave = this.Datatobind.pMemberId
    this.RdTranscationform.controls.pMemberId.setValue(this.Datatobind.pMemberId)
    this.RdTranscationform.controls.pMemberCode.setValue(this.Datatobind.pMemberCode)
    this.RdTranscationform.controls.pMemberName.setValue(this.Datatobind.pMemberName)
    //this.RdTranscationform.controls.pInterestPayOut.setValue(this.Datatobind.pInterestPayOut)
    this._rdtranscationservice._setrdMembercode(this.Datatobind.pMemberCode, this.Datatobind.pMemberId)
    this.Intrestpayout = 'On Maturity';
    this.TenureMode = this.Datatobind.pInterestTenureMode;
    this.Tenure = this.Datatobind.pInterestTenure;
    if (this.Datatobind.pRdCalculationmode == 'Interest rate') {
      this.Intrestpayoutchanges(this.Datatobind.pInterestPayOut);
      this.GetRDMaturityamount();
      this.showtenureonintrest = true;
      this.DepositAmountBaseconintrest = true;
      this.Caltype = this.Datatobind.pCaltype;
      this.RdTranscationform.controls.pCaltype.setValue(this.Datatobind.pCaltype)
      this.RdTranscationform.controls.pSquareyard.setValue(this.Datatobind.pSquareyard)
      this.RdTranscationform.controls.pinstallmentAmount.setValue(this.commonservice.currencyformat(this.Datatobind.pinstallmentAmount));
      this.pinstallmentAmount = this.commonservice.removeCommasForEntredNumber(this.Datatobind.pinstallmentAmount);
      this.RdTranscationform.controls.pDepositAmount.setValue(this.commonservice.currencyformat(this.Datatobind.pDepositAmount))
      this.ptotaldepositamount = this.commonservice.removeCommasForEntredNumber(this.Datatobind.pDepositAmount)

      this.RdTranscationform.controls.pInterestAmount.setValue(this.commonservice.currencyformat(this.Datatobind.pInterestAmount))
      this.intrestamountontable = this.commonservice.removeCommasForEntredNumber(this.Datatobind.pInterestAmount)
      this.GetRdSchemeTenureModes(this.Datatobind.pRdname, this.Datatobind.pApplicantType, this.SelectedMembertype);
      this.GetRdTotalDetails(this.Datatobind.pRdname, this.Datatobind.pApplicantType, this.SelectedMembertype)

      this.showgrid = true;
      this._rdtranscationservice._setcommisiontype(this.Datatobind.pReferralcommisiontype, this.Datatobind.pCommisionValue)
      this.RdTranscationform.controls.pTenortype.setValue(this.Datatobind.pTenortype)
      this.changeTenureTypeEdit(this.Datatobind.pTenortype);
      this.RdTranscationform.controls.pInterestTenureMode.setValue(this.Datatobind.pInterestTenureMode)
      this.RdTranscationform.controls.pInterestTenure.setValue(this.Datatobind.pInterestTenure)
      this.Showmaturityamountforintrest = true
      this.ShowIntrestamountforintrest = true
      this.RdTranscationform.controls.pMaturityAmount.setValue(this.Datatobind.pMaturityAmount)
      // this.showintrestrate=true;
      if (this.Datatobind.pCaltype == "Value Per 100") {
        this.Intrestratedisable = true;
        this.showvalueper100 = true;
        this.showintrestrate = false
      }
      else {
        this.Intrestratedisable = false;
        this.showvalueper100 = false;
        this.showintrestrate = true;
        this.showcalculate = true;
      }
      this.RdTranscationform.controls.pInterestRate.setValue(this.Datatobind.pInterestRate)
      this.Intrestrate = this.Datatobind.pInterestRate;
      this.MaturityAmnt = Math.round(this.Datatobind.pMaturityAmount);
      this.IntrestAmount = this.Datatobind.pInterestAmount
      this.RdTranscationform.controls.pInterestAmount.setValue(this.Datatobind.pInterestAmount)
      this.Datatobind.pIsAutoRenew == true ? this.Radiobuttontype('Do not renew') : '';
      this.Datatobind.pIsRenewOnlyPrinciple == true ? this.Radiobuttontype('Renew Prinicipal only') : '';
      this.Datatobind.pIsRenewOnlyPrincipleandInterest == true ? this.Radiobuttontype('Renew Principal and interest') : '';
      this.Datatobind.pIsinterestDepositinBank == true ? this.Radiobuttontype('Bank A/C') : '';
      this.Datatobind.pIsinterestDepositinSaving == true ? this.Radiobuttontype('Savings A/C') : '';
    }
    else {
      debugger;

      this.Tenuremodechanges(this.Datatobind.pInterestTenureMode, 2);
      this.Tenurechanges(this.Datatobind.pInterestTenure, 2)
      this.tenureontable = true;
      this.DepositAmountBasedontable = true;
      //this.RdTranscationform.controls.pDepositAmount.setValue(this.Datatobind.pDepositAmount)
      this.RdTranscationform.controls.pInterestTenureMode.setValue(this.Datatobind.pInterestTenureMode)
      this.RdTranscationform.controls.pTenortype.setValue(this.Datatobind.pTenortype)
      this.RdTranscationform.controls.pInterestTenure.setValue(this.Datatobind.pInterestTenure)
      this.Tenure = this.Datatobind.pInterestTenure;
      this.TenureMode = this.Datatobind.pInterestTenureMode;

      this.showintrestrate = false;
      this.Showmaturityamount = true;
      this.ShowIntrestamount = true;
      this.intrestamountontable = this.Datatobind.pInterestAmount;
      this.ptotaldepositamount = this.Datatobind.pDepositAmount;
      this.Matrityamountontable = Math.round(this.Datatobind.pMaturityAmount);
      debugger;
      this.RdTranscationform.controls.pMaturityAmount.setValue(Math.round(this.Datatobind.pMaturityAmount));
      this.RdTranscationform.controls.pInterestAmount.setValue(this.Datatobind.pInterestAmount)
      this.depositamountontable = parseInt(this.Datatobind.pinstallmentAmount);
      this.DepositAmountontablechanges(this.Datatobind.pinstallmentAmount)
      this.RdTranscationform.controls.pDepositAmount.setValue(parseInt(this.Datatobind.pDepositamount));
      this._rdtranscationservice.GetRdInstallmentsamountsofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.Tenure, this.SelectedMembertype)
      //this.RdTranscationform.controls.pinstallmentAmount.setValue(this.depositamountontable)
      this.Datatobind.pIsAutoRenew == true ? this.Radiobuttontype('Do not renew') : '';
      this.Datatobind.pIsRenewOnlyPrinciple == true ? this.Radiobuttontype('Renew Prinicipal only') : '';
      this.Datatobind.pIsRenewOnlyPrincipleandInterest == true ? this.Radiobuttontype('Renew Principal and interest') : '';
      this.Datatobind.pIsinterestDepositinBank == true ? this.Radiobuttontype('Bank A/C') : '';
      this.Datatobind.pIsinterestDepositinSaving == true ? this.Radiobuttontype('Savings A/C') : '';
      this.RdTranscationform.controls.pinstallmentAmount.setValue(this.depositamountontable)
    }
    this.RdTranscationform.controls.pDepositDate.setValue(this.commonservice.formatDateFromDDMMYYYY(this.Datatobind.pDepositDate))
    this.RdTranscationform.controls.pMaturityDate.setValue(this.commonservice.formatDateFromDDMMYYYY(this.Datatobind.pMaturityDate))
    this.formattedData = this.RdTranscationform.value;
  }
  GetRDMaturityamount() {
    debugger
    let isvalid = true;

    let tenuremode = this.TenureMode.toUpperCase()
    let tenure = parseInt(this.Tenure)
    let intrestpayout = 'ON MATURITY';
    let pinstallmentAmount = parseInt(this.pinstallmentAmount);
    if (this.IntrestCompounding)
      this.IntrestCompounding.toUpperCase();

    if (tenuremode != "" && !isNaN(tenure) && intrestpayout != "" && !isNaN(pinstallmentAmount) && this.IntrestCompounding != "") {
      this._rdtranscationservice.GetRDMaturityamount(tenuremode, tenure, pinstallmentAmount,
        intrestpayout, this.IntrestCompounding, this.griddata[0].pCompoundType, this.Intrestrate, this.Caltype).subscribe(res => {
          debugger
          this.Showmaturityamountforintrest = true;
          this.ShowIntrestamountforintrest = true;
          this.RdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
          this.MaturityAmnt = Math.round(res[0].pMatueritytAmount);
          this.IntrestAmount = res[0].pInterestamount
          this.RdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount);
          this.ptotaldepositamount = tenure * pinstallmentAmount;
          this.RdTranscationform.controls.pDepositAmount.setValue(this.ptotaldepositamount);
          isvalid = true;
          this.calculateMaturityDate();
        })

    } else {
      //this.Showmaturityamountforintrest = false;
      //this.ShowIntrestamountforintrest = false;
      this.RdTranscationform.controls.pMaturityAmount.setValue(0)
      this.MaturityAmnt = 0;
      // this.IntrestAmount = 0;
      // this.RdTranscationform.controls.pInterestAmount.setValue(0);
      // this.ptotaldepositamount = 0;
      // this.RdTranscationform.controls.pDepositAmount.setValue(0);
      //isvalid = false;
    }
    return isvalid
  }
  GetApplicanttypes(type) {
    debugger
    this._rdtranscationservice.GetapplicantTypes(this.contactType).subscribe(json => {
      debugger;
      // this.membertypedetails = json['_FIMembertypeDTOList'];


      this.ApplicantTypes = json['_FIApplicantTypeDTO'];



      // this.RdTranscationform.controls.pMembertypeId.setValue(this.membertypedetails[0].pMembertypeId)
      // let obj = ({pMemberType: this.membertypedetails[0].pMemberType })
      // this.MemberTypeChange(obj)


    })
    this.commonservice.Getmemberdetails('RECURRING DEPOSIT').subscribe(json => {
      this.membertypedetails = json;
    });
  }
  GetRdTotalDetails(Rdname, applicantype, MemberType) {
    debugger
    this._rdtranscationservice.GetRdTotalDetails(Rdname, applicantype, MemberType).subscribe(json => {
      debugger
      this.griddata = json;
      this.showgrid = true
    })
  }
  GetBranchdetails() {

    this._rdtranscationservice.Getbranchdetails().subscribe(res => {
      debugger
      this.Branchdetails = res;
    })

  }
  GetBranchstatus() {
    debugger
    this._rdtranscationservice.Getbranchstatus().subscribe(json => {
      debugger
      if (json) {
        this.showchit = true;
        this.GetBranchdetails();
      }
    })
  }
  MemberTypeChange(event) {
    debugger
    // this.RdTranscationform.controls.pMemberName.setValue("")
    if (event != undefined) {
      this.SelectType = 'Contact';
      this.contactType = "Individual";
      this.RdTranscationform.controls.pEntitytype.setValue("Individual")
      this.SelectTypeChange('Individual');
      this.RdTranscationform.controls['pMemberId'].setValue('');
      this.RdTranscationform.controls['pMemberName'].setValue('');
      this.RdtranscationErrors = '';
      this.RdTranscationform.controls.pRdConfigId.setValue("");
      this.RdTranscationform.controls.pApplicantType.setValue("");
      this.memberdetails = "";
      //this.ApplicantTypes=[];
      this.RdSchemes = [];
      this.RdSchemes = [];
      this.clearRdschemechange()
      this.griddata = [];
      this.showgrid = false;
      this.tenureontable = false;
      this.DepositAmountBasedontable = false;
      this.DepositAmountBaseconintrest = false;
      this.showtenureonintrest = false;
      this.showintrestrate = false;
      this.showcalculate = false;
      this.IntrestCompounding = false;
      this.DepositAmountBaseconintrest = false;
      this.SelectedMembertype = event.pmembertype
      //this.RdTranscationform.controls.pMemberName.setValue(event.pMemberName)
      this.RdTranscationform.controls.pMemberType.setValue(event.pmembertype)
      this.GetMemberDetails(this.contactType, this.SelectedMembertype, 0)
      //   this.RdTranscationform.controls.pRdConfigId.setValue("")
      // this.GetRdSchemes(this.Applicanttype, this.SelectedMembertype)
      //this.RdTranscationform.controls.pRdConfigId.setValue("")

      // var multicolumncombobox: any;
      // multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
      // if (multicolumncombobox)
      //   multicolumncombobox.value("");
      // this.GetDataBasedOnTenure()
    }
    else {
      this.GetMemberDetails(this.contactType, "", 0)
    }

  }
  MemberChanges(event) {
    debugger
    if (event != undefined) {
      this.RdTranscationform.controls.pRdConfigId.setValue("");
      this.RdTranscationform.controls.pApplicantType.setValue("");
      this.RdTranscationform.controls.pMemberId.setValue("");
      //this.memberdetails=[];
      //this.ApplicantTypes=[];
      //this.RdSchemes=[];
      this.clearRdschemechange();
      this.RdSchemes = [];
      this.griddata = [];
      this.showgrid = false;
      this.Memberid = event.pMemberId
      this.Membercode = event.pMemberCode
      this.Contactid = event.pContactid;
      this.contactrefid = event.pContactrefid
      this._CoJointmemberService._setfdMembercode(event.pMemberCode, event.pMemberId)
      //this.RdtranscationErrors.pMemberId=''
      let data = ({ pMemberId: event.pMemberId, pMemberCode: event.pMemberCode, pMemberName: event.pMemberName })
      this.GetContactDetails(data)
      // this.RdTranscationform.controls.pRdConfigId.setValue("")

    }
  }
  GetContactDetails(event) {
    debugger
    if (event.pMemberId && event.pMemberId != undefined && event.pMemberId != '') {
      this.savingtranscationservice.GetContactDetails(event.pMemberId).subscribe(json => {
        debugger
        // this.ContactDetails = json;
        this.MemberidSave = event.pMemberId;
        this.RdTranscationform.controls.pMemberId.setValue(event.pMemberId)
        this.RdTranscationform.controls.pMemberCode.setValue(event.pMemberCode)
        this.RdTranscationform.controls.pMemberName.setValue(event.pMemberName)
        this.RdTranscationform.controls.pContactid.setValue(json['pContactid']);
        this.RdTranscationform.controls.pContactrefid.setValue(json['pContactreferenceid']);
      })
    }

  }
  ApplicanttypeChange(event) {
    debugger
    if (event != undefined) {
      this.griddata = [];
      this.showgrid = false;
      this.Applicanttype = event.pApplicantType
      this.RdTranscationform.controls.pRdConfigId.setValue("")
      this.RdtranscationErrors = {}
      this.clearfields()
      //this.clearTableRDInstallmentAmount();
      this.tenureontable = false;
      this.DepositAmountBasedontable = false;
      this.DepositAmountBaseconintrest = false;
      this.showtenureonintrest = false;
      this.showintrestrate = false;
      this.showcalculate = false;
      this.IntrestCompounding = false;
      this.GetRdSchemes(this.Applicanttype, this.SelectedMembertype)

      this.GetDataBasedOnTenure()
    }
  }
  clearInstallmentPaypin() {
    this.DepositAmountBasedontable = false;
    this.RdTranscationform.controls.pDepositAmount.setValue('');
    this.DepositAmountdetails = [];
    //this.RdTranscationform.controls.pInterestPayOut.setValue('');
    this.RdSchemeDetails = [];
    this.showintrestrate = false;
    this.RdTranscationform.controls.pInterestRate.setValue('');
    this.showvalueper100 = false;
    this.RdTranscationform.controls.pInterestRate.setValue('');
    this.showcalculate = false;
    this.ShowIntrestamount = false;
    this.ptotaldepositamount = 0;
    this.intrestamountontable = 0;
    this.Showmaturityamount = false
    this.Matrityamountontable = 0;
    this.ShowIntrestamountforintrest = false;
    this.IntrestAmount = 0;
    this.Showmaturityamountforintrest = false;
    this.MaturityAmnt = 0;
    this.RdTranscationform.controls.pMaturityDate.setValue(new Date());
    this.RdTranscationform.controls.pDepositDate.setValue(new Date());
    this.TenureMode = "";
    this.Tenure = "";
    this.IntrestAmount = "";
    this.MaturityAmnt = 0;
    this.intrestamountontable = 0;
    this.Matrityamountontable = 0;
    this.RdtranscationErrors = {};
  }
  clearRdschemechange() {
    this.RdTranscationform.controls.pDepositAmount.setValue('');
    //this.tenureontable = false;
    this.RdTranscationform.controls.pinstallmentAmount.setValue('');
    this.RdTranscationform.controls.pInterestTenure.setValue('');
    //this.Tenuremodedetails = [];
    //this.showtenureonintrest = false;
    this.RdTranscationform.controls.pInterestTenureMode.setValue('');
    this.filtertenuremodelist = [];
    //this.tenuremodelist = [];
    this.DepositAmountBasedontable = false;
    this.RdTranscationform.controls.pDepositAmount.setValue('');
    this.DepositAmountdetails = [];
    //this.RdTranscationform.controls.pInterestPayOut.setValue('');
    this.RdSchemeDetails = [];
    this.showintrestrate = false;
    this.RdTranscationform.controls.pInterestRate.setValue('');
    this.showvalueper100 = false;
    this.RdTranscationform.controls.pInterestRate.setValue('');
    this.showcalculate = false;
    this.ShowIntrestamount = false;
    this.intrestamountontable = 0;
    this.Showmaturityamount = false
    this.Matrityamountontable = 0;
    this.ShowIntrestamountforintrest = false;
    this.IntrestAmount = 0;
    this.Showmaturityamountforintrest = false;
    this.MaturityAmnt = 0;
    this.RdTranscationform.controls.pMaturityDate.setValue(new Date());
    this.RdTranscationform.controls.pDepositDate.setValue(new Date());
    this.TenureMode = "";
    this.Tenure = "";
    this.IntrestAmount = "";
    this.intrestamountontable = "";
    this.Matrityamountontable = 0;
    this.RdtranscationErrors = {};
    this.showgrid = false;
  }
  clearfields() {
    this.TenureMode = "";
    this.Tenure = ""
    this.RdTranscationform.controls.pInterestTenure.setValue("");
    this.RdTranscationform.controls.pInterestTenureMode.setValue("")
    this.ShowIntrestamountforintrest = false;
    this.Showmaturityamountforintrest = false;
    //this.RdTranscationform.controls.pinstallmentAmount.setValue("");
    //this.RdTranscationform.controls.pInterestPayOut.setValue("");
    this.RdTranscationform.controls.pInterestRate.setValue("")
    this.MaturityAmnt = 0;
    this.showintrestrate = false;
    this.showvalueper100 = false;
    // this.groupshow=false;
    // this.showmember=true;
    this.IntrestAmount = "";
    this.Matrityamountontable = 0;
    this.intrestamountontable = "";
    this.ptotaldepositamount = 0;
    this.RdTranscationform.controls.pDepositAmount.setValue(0);
    this.RdtranscationErrors = {};

    // this.tenureontable = false;
    // this.DepositAmountBasedontable = false;
    // this.DepositAmountBaseconintrest = false;
    // this.showtenureonintrest = false;
    // this.showintrestrate = false;
    // this.showcalculate = false;
    this.IntrestCompounding = false;
    // this.RdTranscationform.controls.pMaturityDate.setValue(new Date());
    // this.RdTranscationform.controls.pDepositDate.setValue(new Date());

    // this.Tenuremodedetails = [];
    // this.tenuremodelist = [];
    // this.DepositAmountdetails = [];
    // this.RdSchemeDetails = [];
    //this.clearRdschemechange();
  }
  GetMemberDetails(contacttype, membertype, GroupID) {
    debugger
    if (membertype != "") {
      this._rdtranscationservice.GetMembersForRd(this.contactType, this.SelectedMembertype, GroupID).subscribe(json => {
        debugger
        this.memberdetails = json;
        // $("#MemberData").kendoMultiColumnComboBox({
        //   dataTextField: "pMemberName",
        //   dataValueField: "pMemberId",
        //   height: 400,
        //   columns: [
        //     { field: "pMemberName", title: "Member", width: 200 },
        //     { field: "pMemberCode", title: "Member code", width: 200 },
        //     { field: "pContactnumber", title: "Contact No.", width: 200 },

        //   ],
        //   filter: "contains",
        //   filterFields: ["pMemberName", "pMemberId", "pContactnumber"],
        //   dataSource: this.memberdetails,
        //   select: this.SelectMemberData,
        //   change: this.CancelClick
        // });

      })
    }
    else {
      this.memberdetails = ""
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
    debugger
    window['CallingFunctionToHideCard'].componentFn()
  }
  HideCard() {
    debugger
    if (this.RdTranscationform.controls['pMemberId'].value) {
      this.RdTranscationform.controls['pMemberId'].setValue('');
      this.RdTranscationform.controls['pMemberName'].setValue('');
      this.RdtranscationErrors = '';
    }
  }
  GetRdSchemes(Applicanttype, membertype) {
    debugger
    if (Applicanttype != undefined || membertype != undefined) {
      this._rdtranscationservice.GetRdSchemes(this.Applicanttype, this.SelectedMembertype).subscribe(json => {
        debugger
        this.RdSchemes = json;
      })
    }

  }
  Rdschemechange(event) {
    debugger;
    let a = this.buttontype;
    //this.buttontype == "edit"
    //this.TenureMode = this.buttontype == "edit" ? event : event.target.value
    this.TenureMode = this.buttontype == "edit" ? event : event.pRdConfigId;
    if (event != undefined) {
      this.clearRdschemechange();
      this.RdnameandCode = event.pRdnameCode
      this.RdCalculationmode = event.pRdCalculationmode;
      //this.RdTranscationform.controls.pRdConfigId.setValue(event.pRdConfigId)
      this.Rdconfigid = event.pRdConfigId;
      this.Rdname = event.pRdname;
      this.RdTranscationform.controls.pRdname.setValue(event.pRdname)
      this.RdTranscationform.controls.pRdcode.setValue(event.pRdcode)
      this.RdTranscationform.controls.pRdnameCode.setValue(event.pRdnameCode)
      this.RdTranscationform.controls.pRdCalculationmode.setValue(event.pRdCalculationmode);
      this.clearfields()
      // this._rdtranscationservice.GetRdSchemeDetails(event.pFdDetailsRecordid).subscribe(json => {
      //   debugger;
      if (this.RdCalculationmode == "TABLE") {
        this.tenureontable = true;
        this.DepositAmountBasedontable = true;
        this.DepositAmountBaseconintrest = false;
        this.showtenureonintrest = false;
        this.showintrestrate = false;
        this.showcalculate = false;
        this.IntrestCompounding = false;
        this.GetRdTotalDetails(this.Rdname, this.Applicanttype, this.SelectedMembertype)

      }
      else {
        this.GetDataBasedOnTenure()
        this.tenureontable = false;
        this.showtenureonintrest = true;
        this.DepositAmountBasedontable = false;
        this.DepositAmountBaseconintrest = true;
        this.showintrestrate = true;
        this.showcalculate = true;
        this.GetRdTotalDetails(this.Rdname, this.Applicanttype, this.SelectedMembertype)
        this.GetRdSchemeTenureModes(this.Rdname, this.Applicanttype, this.SelectedMembertype)

      }
    }

  }
  Tenuremodechanges(event, v) {
    debugger
    //this.clearTableRDInstallmentAmount();
    this.DepositAmountdetails = [];
    this.Tenuremodedetails = [];
    //  this.clearInstallmentPaypin();
    //this.ShowIntrestamount=false;
    //this.Showmaturityamount=false;
    //this.RdTranscationform.controls.pInterestTenure.setValue('');
    //this.RdTranscationform.controls.pinstallmentAmount.setValue('');

    //  this.clearInstallmentPaypin();
    //this.buttontype == "edit"
    //this.RdTranscationform.controls.pInterestTenureMode.setValue(event.pTenurename);
    //this.TenureMode=this.RdTranscationform.controls.pInterestTenureMode.value;
    this.TenureMode = v == 1 ? event.target.value : event;
    if (this.RdCalculationmode == "TABLE") {
      this.RdTranscationform.controls.pInterestTenure.setValue('');
      this.RdtranscationErrors.pInterestTenure = '';
      this.ptotaldepositamount=0;
      this.intrestamountontable=0;
      this.Matrityamountontable=0;
      this._rdtranscationservice.GetRdTenuresofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.SelectedMembertype).subscribe(json => {
        debugger

        this.Tenuremodedetails = json
        this.calculateMaturityDate()
        this.GetRDMaturityamount();
      })
      //this.GetDataBasedOnTenure()

    }
    else {
      if (this.TenureMode != undefined && this.Tenure != "" && this.TenureMode != "" && this.Tenure != undefined) {
        // this.CalculationforTenure(this.TenureMode, this.Tenure)
        // this.RdTranscationform.controls.pInterestPayOut.setValue("");
        // this.RdtranscationErrors={}
        //this.GetRDTenureandMininterestRateofInterestRate();
        this.calculateMaturityDate()
        this.GetDataBasedOnTenure()
        this.showcard = true

      }

    }
    this.Intrestpayoutchanges('On Maturity');
    this.GetRDMaturityamount();
  }
  GetRDTenureandMininterestRateofInterestRate() {
    debugger
    if (this.TenureMode != "" && this.Tenure != "" && this.RdCalculationmode != "TABLE" && this.Rdname != "" && this.pinstallmentAmount != "" && this.Tenure != "" && this.TenureMode != "" && this.Intrestpayout != "" && this.SelectedMembertype != "" && this.Rdname != undefined && this.pinstallmentAmount != undefined && this.Tenure != undefined && this.TenureMode != undefined && this.Intrestpayout != undefined && this.SelectedMembertype != undefined) {
      this._rdtranscationservice.GetRDTenureandMininterestRateofInterestRate(this.Rdname, this.pinstallmentAmount, this.Tenure, this.TenureMode, this.Intrestpayout, this.SelectedMembertype).subscribe(res => {
        debugger;

        this.Caltype = res['pCaltype']
        //commisiontype:res['pReferralcommisiontype'],commisionvalue:res['pReferralCommisionvalue']}
        this._rdtranscationservice._setcommisiontype(res['pReferralcommisiontype'], res['pReferralCommisionvalue'])
        this._CoReferralService._setcommisiontype(res['pReferralcommisiontype'], res['pReferralCommisionvalue']);
        this.RdTranscationform.controls.pCaltype.setValue(res['pCaltype'])
        if (res['pTenureCount'] != 0) {
          if (res['pMinInterestRate'] && res['pMaxInterestRate'] != 0) {
            this.showintrestrate = true;
            this.showcalculate = true;
            this.showvalueper100 = false;
            this.Intrestratedisable = false;
            this.IntrestrateFrom = res['pMinInterestRate'];
            this.ratepersquareyard = res['pRatePerSquareYard']
            this.Intrestrate = this.IntrestrateFrom;
            this.RdTranscationform.controls.pInterestRate.setValue(this.IntrestrateFrom)
            this.IntrestrateTo = res['pMaxInterestRate'];
            if (this.interestvalidation != 0 && this.interestvalidation != undefined && this.interestvalidation != null) {
              this.callintrestratevalidation();
            }
          }
          else {

            this.Intrestratedisable = true;
            this.showcalculate = true;
            this.ratepersquareyard = res['pRatePerSquareYard']
            this.Intrestrate = res['pValuefor100']
            this.RdTranscationform.controls.pInterestRate.setValue(res['pValuefor100'])
            this.showvalueper100 = true;
            this.showintrestrate = false;
          }
          this.GetDataBasedOnTenure()
        }
        else {
          this.commonservice.showWarningMessage("Enter valid tenure");
          this.RdTranscationform.controls.pInterestTenure.setValue("");
          this.RdTranscationform.controls.pInterestTenureMode.setValue("");
          this.RdTranscationform.controls.pTenortype.setValue('')
          this.RdTranscationform.controls.pInterestRate.setValue(0)
          this.TenureMode = "";
          this.Tenure = "";

          //this.RdTranscationform.controls.pInterestPayOut.setValue("")
        }
      })
    }

  }

  public clearTableRDInstallmentAmount() {
    //this.pinstallmentAmount = 0;
    this.intrestamountontable = 0;
    this.Matrityamountontable = 0;
    this.ShowIntrestamount = false;
    this.ShowIntrestamountforintrest = true;
    this.RdTranscationform.controls.pInterestAmount.setValue('')
    this.Showmaturityamount = false;
    this.Showmaturityamountforintrest = true;
    this.RdTranscationform.controls.pMaturityAmount.setValue(0)
    this.RdTranscationform.controls.pDepositAmount.setValue(0);
    this.ptotaldepositamount = 0;
    this.RdSchemeDetails = [];
  }

  Tenurechanges(event, value) {
    debugger
    this.DepositAmountdetails = [];
    this.clearTableRDInstallmentAmount();
    //this.buttontype == "edit";
    //this.Tenure = this.RdTranscationform.controls.pInterestTenure.value;
    this.ShowIntrestamount = false;
    //this.Showmaturityamount=false;
    //this.RdTranscationform.controls.pinstallmentAmount.setValue('');
    this.Tenure = value == 2 ? event : event.target.value
    if (this.Tenure != '' || this.Tenure != null || this.Tenure != undefined) {
      if (this.RdCalculationmode == "TABLE") {
        this._rdtranscationservice.GetRdInstallmentsamountsofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.Tenure, this.SelectedMembertype).subscribe(json => {
          debugger
          this.DepositAmountdetails = json;
          this.DepositAmountBasedontable = true;
          this.calculateMaturityDate()
          if (this.buttontype == "new") {
            this.RdTranscationform.controls.pinstallmentAmount.setValue('')
            this.RdtranscationErrors.pinstallmentAmount = '';

          }
          else {
            //this.RdTranscationform.controls.pinstallmentAmount.setValue('')
            this.RdtranscationErrors.pinstallmentAmount = '';
          }
          this.GetRDMaturityamount();
        })
      }
      // this.GetDataBasedOnTenure()

      else {
        if (this.TenureMode != undefined && this.Tenure != "" && this.TenureMode != "") {
          // this.CalculationforTenure(this.TenureMode, this.Tenure);
          this.GetDataBasedOnTenure()

          this.showcard = true;
          // this.RdTranscationform.controls.pInterestPayOut.setValue("")
          // this.RdtranscationErrors={}
          //  this.calculateMaturityDate()
          this.GetRDTenureandMininterestRateofInterestRate();
          //  this.GetDataBasedOnTenure()
          this.GetRDMaturityamount();
        }
      }

    }
  }

  GetRdSchemeTenureModes(Rdname, Applicanttype, SelectedMembertype) {
    debugger
    this._rdtranscationservice.GetRdSchemeTenureModes(Rdname, Applicanttype, SelectedMembertype).subscribe(json => {
      if (json != null) {
        console.log('Tenure Data', json);
        this.tenuremodelist = json;
        if (this.buttontype == 'edit') {
          this.changeTenureTypeEdit(this.RdTranscationform.controls.pTenortype.value);
        }
        // if (this.tenuremodelist.length > 0) {
        //   this.tenuremodelist = this.tenuremodelist.filter(itm => itm.pTenurenature = itm.pTenurenature[0].toUpperCase() + itm.pTenurenature.substr(1).toLowerCase());
        // }
      }
    })
  }
  changeTenureType(event) {
    debugger
    this.clearTableRDInstallmentAmount();
    this.DepositAmountdetails = [];
    if (event.target.value) {
      if (this.tenuremodelist.length > 0) {
        let tenurename = event.target.value.toUpperCase();
        this.RdTranscationform.controls.pInterestTenureMode.setValue('');
        this.filtertenuremodelist = [];
        let filterArray = this.tenuremodelist.filter(itm => itm.pTenurenature == tenurename);
        this.filtertenuremodelist = filterArray;
        this.RdtranscationErrors = {};
      }
    }
  }
  changeTenureTypeEdit(type) {
    debugger
    if (type) {
      if (this.tenuremodelist.length > 0) {
        let tenurename = type.toUpperCase();
        let filterArray = this.tenuremodelist.filter(itm => itm.pTenurenature == tenurename);
        this.filtertenuremodelist = filterArray;
        this.RdtranscationErrors = {};
      }
    }
  }
  GetDataBasedOnTenureFn(Applicanttype, SelectedMembertype, Rdconfigid, Rdname, Tenure, TenureMode, pinstallmentAmount) {
    this._rdtranscationservice.GetRdSchemeDetails(Applicanttype, SelectedMembertype, Rdconfigid, Rdname, Tenure, TenureMode, pinstallmentAmount).subscribe(json => {
      if (this.RdCalculationmode != null) {
        this._rdtranscationservice._setcommisiontype(this.RdCalculationmode.pReferralcommisiontype, this.RdCalculationmode.pReferralCommsionvalue);
        if (this.RdCalculationmode == "TABLE") {
          this.showIntrestcompounding = false

          this.Showmaturityamountforintrest = false;
          this.ShowIntrestamountforintrest = false;
          this.Showmaturityamount = true;
          this.ShowIntrestamount = true;
          this.DepositAmountBasedontable = true
          this.DepositAmountBaseconintrest = false;
          this.IntrestCompounding = false;
          // this.RdTranscationform.controls.pInterestTenureMode.setValue(json['pInterestTenureMode'])
          // this._rdtranscationservice.GetRdTenuresofTable(this.RdTranscationform.controls.pRdname, this.Rdconfigid)
          // this.RdTranscationform.controls.pInterestTenure.setValue(json['pInterestTenure'])
          this.RdSchemeDetails = json['rdInterestPayoutList']
          //this.RdTranscationform.controls.pDepositAmount.setValue(json['pDepositAmount'])
          //  this.RdTranscationform.controls.pMaturityAmount.setValue(json['pMaturityAmount'])
          //  this.RdTranscationform.controls.pInterestAmount.setValue(json['pInterestAmount'])
          this.RdTranscationform.controls.pInterestRate.setValue(0)

        }
        else {
          if (json['rdInterestPayoutList'] != null) {
            debugger
            this.RdSchemeDetails = json['rdInterestPayoutList'];
            this.showIntrestcompounding = true;

            this.Showmaturityamount = false;
            this.ShowIntrestamount = false;

            this.Multiplesof = json['pMultiplesof']
            this.IntrestCompounding = json['pInterestType']

            //this.RdTranscationform.controls.pDepositAmount.setValue(0)
            this.RdTranscationform.controls.pMaturityAmount.setValue(0)
            this.Investmentperiodfrom = json['pInvestmentPeriodFrom']
            this.CalculationforInvestmentperiodfrom(this.Investmentperiodfrom)
            this.Investmentperiodto = json['pInvestmentPeriodTo']
            this.CalculationforInvestmentperiodTo(this.Investmentperiodto)
            this.IntrestrateFrom = json['pInterestRateFrom'];
            this.IntrestrateTo = json['pInterestRateTo'];
            this.pMaxInstallmentAmount = json['pMaxInstallmentAmount']
            this.pMinInstallmentAmount = json['pMinInstallmentAmount']
            //this.CalculationforIntrestRateFrom(this.IntrestrateFrom)
            this.Valueper100 = json['pInterestOrValueForHundred']
            this.RdTranscationform.controls.pInterestType.setValue(json['pInterestType'])

          }
          else {
            this.RdSchemeDetails = "";
            // this.commonservice.showErrorMessage("Enter Valid Tenure");
            this.clearfields()
          }


          // this.RdTranscationform.controls.pInterestPayOut.setValue(json['pInterestPayOut'])
        }
      }

    })
  }
  GetDataBasedOnTenure() {
    debugger
    if (this.Applicanttype != undefined && this.SelectedMembertype != undefined && this.Rdconfigid != undefined &&
      this.Rdname != undefined && this.Tenure != undefined && this.Tenure != "" && this.TenureMode != "" && this.TenureMode != undefined && this.pinstallmentAmount != undefined) {
      debugger
      this._rdtranscationservice.GetRdSchemeDetails(this.Applicanttype, this.SelectedMembertype, this.Rdconfigid,
        this.Rdname, this.Tenure, this.TenureMode, this.pinstallmentAmount).subscribe(json => {
          if (this.RdCalculationmode != null) {
            if (this.RdCalculationmode == "TABLE") {
              this.showIntrestcompounding = false

              this.Showmaturityamountforintrest = false;
              this.ShowIntrestamountforintrest = false;
              this.Showmaturityamount = true;
              this.ShowIntrestamount = true;
              this.DepositAmountBasedontable = true
              this.DepositAmountBaseconintrest = false;
              this.IntrestCompounding = false;
              // this.RdTranscationform.controls.pInterestTenureMode.setValue(json['pInterestTenureMode'])
              // this._rdtranscationservice.GetRdTenuresofTable(this.RdTranscationform.controls.pRdname, this.Rdconfigid)
              // this.RdTranscationform.controls.pInterestTenure.setValue(json['pInterestTenure'])
              this.RdSchemeDetails = json['rdInterestPayoutList']
              //this.RdTranscationform.controls.pDepositAmount.setValue(json['pDepositAmount'])
              //  this.RdTranscationform.controls.pMaturityAmount.setValue(json['pMaturityAmount'])
              //  this.RdTranscationform.controls.pInterestAmount.setValue(json['pInterestAmount'])
              this.RdTranscationform.controls.pInterestRate.setValue(0)

            }
            else {
              if (json['rdInterestPayoutList'] != null) {
                debugger
                this.RdSchemeDetails = json['rdInterestPayoutList'];
                this.showIntrestcompounding = true;

                this.Showmaturityamount = false;
                this.ShowIntrestamount = false;

                this.Multiplesof = json['pMultiplesof']
                this.IntrestCompounding = json['pInterestType']

                //this.RdTranscationform.controls.pDepositAmount.setValue(0)
                this.RdTranscationform.controls.pMaturityAmount.setValue(0)
                this.Investmentperiodfrom = json['pInvestmentPeriodFrom']
                this.CalculationforInvestmentperiodfrom(this.Investmentperiodfrom)
                this.Investmentperiodto = json['pInvestmentPeriodTo']
                this.CalculationforInvestmentperiodTo(this.Investmentperiodto)
                this.IntrestrateFrom = json['pInterestRateFrom'];
                this.IntrestrateTo = json['pInterestRateTo'];
                this.pMaxInstallmentAmount = json['pMaxInstallmentAmount']
                this.pMinInstallmentAmount = json['pMinInstallmentAmount']
                //this.CalculationforIntrestRateFrom(this.IntrestrateFrom)
                this.Valueper100 = json['pInterestOrValueForHundred']
                this.RdTranscationform.controls.pInterestType.setValue(json['pInterestType'])

              }
              else {
                this.RdSchemeDetails = "";
                //  this.commonservice.showErrorMessage("Enter Valid Tenure");
                this.clearfields()
              }


              // this.RdTranscationform.controls.pInterestPayOut.setValue(json['pInterestPayOut'])
            }
          }

        })

    }

  }

  Depositchanges(event) {
    debugger
    this.pinstallmentAmount = this.commonservice.removeCommasForEntredNumber(event.target.value)
    this.GetDataBasedOnTenure()
    this.TenureMode = "";
    this.Tenure = "";
    this.RdTranscationform.controls.pInterestTenure.setValue("");
    this.RdTranscationform.controls.pInterestTenureMode.setValue("");
    this.RdTranscationform.controls.pTenortype.setValue('')
    this.RdTranscationform.controls.pInterestRate.setValue("");
    //this.RdTranscationform.controls.pInterestPayOut.setValue("");
    this.IntrestAmount = "";
    this.MaturityAmnt = 0;
    this.ptotaldepositamount = 0;
    this.RdTranscationform.controls.pDepositAmount.setValue(0);
    this.intrestamountontable = "";
    this.Matrityamountontable = 0;
    // if(this.RdCalculationmode=='TABLE')
    // {

    // }
    // else
    // {
    //   if(this.Multiplesof!=0)
    //   {
    //     this.calculatedepositamount= this.depositamount%this.Multiplesof  
    //   if (this.depositamount >= this.pMinInstallmentAmount &&  this.depositamount <= this.pMaxInstallmentAmount)
    //  {
    //   this.CalculationForDepositAmount(this.calculatedepositamount)

    //   }
    //   else{
    //     this.commonservice.showWarningMessage("Deposit Amount is in between " + this.pMinInstallmentAmount + "&" + this.pMaxInstallmentAmount)
    //     this.RdTranscationform.controls.pDepositAmount.setValue("")
    //   }
    //   }
    //   else{
    //     if (this.depositamount < this.pMinInstallmentAmount ||  this.depositamount > this.pMaxInstallmentAmount)
    //     {
    //       this.commonservice.showWarningMessage("Deposit Amount is in between " + this.pMinInstallmentAmount + "&" + this.pMaxInstallmentAmount)   
    //       this.RdTranscationform.controls.pDepositAmount.setValue("")   
    //      }
    //   }
    // }
    this.RdtranscationErrors = {}

    this.GetDepositCount()
  }
  GetDepositCount() {
    debugger
    this._rdtranscationservice.GetRDDepositamountCountofInterestRate(this.Rdname, this.pinstallmentAmount, this.SelectedMembertype).subscribe(res => {
      let count = res
      if (!count) {
        this.commonservice.showWarningMessage("Enter Valid Amount");
        this.RdTranscationform.controls.pinstallmentAmount.setValue("");
        this.pinstallmentAmount = ""
      }
    })
  }
  CalculationForDepositAmount(depositamount) {
    if (this.calculatedepositamount != 0) {
      this.commonservice.showWarningMessage("Deposit Amount is Multiples of" + this.pMinInstallmentAmount + "&" + this.pMaxInstallmentAmount)
      this.RdTranscationform.controls.pinstallmentAmount.setValue("")
    }

  }
  CalculationforTenure(tenuremode, tenure) {
    debugger;

    if (this.Totalnooffromdays != undefined || this.Totalnooftodays != undefined) {
      if (tenuremode == "Months") {
        let DaysinMonths = Number(tenure * 30)
        if (DaysinMonths < this.Totalnooffromdays || DaysinMonths > this.Totalnooftodays) {
          this.commonservice.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
          this.RdTranscationform.controls.pInterestTenureMode.setValue("")
          this.RdTranscationform.controls.pTenortype.setValue('');
        }
      }
      else if (tenuremode == "Years") {
        let DaysinYears = Number(tenure * 365)
        if (DaysinYears < this.Totalnooffromdays || DaysinYears > this.Totalnooftodays) {
          this.commonservice.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
          this.RdTranscationform.controls.pInterestTenureMode.setValue("")
          this.RdTranscationform.controls.pTenortype.setValue('');
        }
      }
      else if (tenuremode == "Days") {
        let Days = Number(tenure);
        if (Days < this.Totalnooffromdays || Days > this.Totalnooftodays) {
          this.commonservice.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
          this.RdTranscationform.controls.pInterestTenureMode.setValue("")
          this.RdTranscationform.controls.pTenortype.setValue('');
        }
      }
    }


  }
  DepositDatechanges() {
    debugger;

    this.calculateMaturityDate()
  }
  CalculationforInvestmentperiodfrom(Investmentperiodfrom) {
    debugger
    if (Investmentperiodfrom != 0 && Investmentperiodfrom != null) {
      let a = Investmentperiodfrom.split(' ')
      let Noofdaysinyears = (a[0].slice(0, -1)) * 365
      let Noofdaysinmonths = (a[0].slice(0, -1)) * 30
      let Noofdays = Number((a[0].slice(0, -1)))
      this.Totalnooffromdays = Noofdaysinyears + Noofdaysinmonths + Noofdays
    }
    else {

    }

  }
  CalculationforInvestmentperiodTo(InvestmentperiodTo) {
    debugger
    if (InvestmentperiodTo != 0 && InvestmentperiodTo != null) {
      let a = InvestmentperiodTo.split(' ')
      let Noofdaysinyears = (a[0].slice(0, -1)) * 365
      let Noofdaysinmonths = (a[0].slice(0, -1)) * 30
      let Noofdays = Number((a[0].slice(0, -1)))
      this.Totalnooftodays = Noofdaysinyears + Noofdaysinmonths + Noofdays
    }

  }
  calculateMaturityDate() {
    debugger
    let tenuremode = '';
    tenuremode = this.RdTranscationform.controls.pTenortype.value;
    if (this.RdCalculationmode == "TABLE") {
      tenuremode = this.RdTranscationform.controls.pInterestTenureMode.value;
    }
    let tenure = this.RdTranscationform.controls.pInterestTenure.value;
    let depositdate = this.RdTranscationform.controls.pDepositDate.value;
    var maturityDate = new Date(depositdate);
    if (tenuremode == 'Days') {
      maturityDate.setDate(depositdate.getDate() + Number(tenure));
      this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
    } else if (tenuremode == 'Months') {
      maturityDate.setMonth((depositdate.getMonth()) + Number(tenure));
      // maturityDate.setDate(maturityDate.getDate()-1);
      this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
    } else {
      maturityDate.setFullYear(depositdate.getFullYear() + Number(tenure));
      // maturityDate.setDate(maturityDate.getDate()-1);
      this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
    }
  }
  // calculateMaturityDate() {
  //   debugger
  //   let tenuremode = this.RdTranscationform.controls.pInterestTenureMode.value;
  //   let tenure = this.RdTranscationform.controls.pInterestTenure.value;
  //   let depositdate = this.RdTranscationform.controls.pDepositDate.value;
  //   var maturityDate = new Date(depositdate);
  //   if (this.RdCalculationmode != 'TABLE') {
  //     if (this.tenuremodelist.length > 0) {
  //       let tenureModeFilter = this.tenuremodelist.filter(itm => itm.pTenurename = tenuremode);
  //       let tenurenature = tenureModeFilter[0].pTenurenature;
  //       let Payinduration = tenureModeFilter[0].pPayinduration;
  //       if (tenurenature == 'DAYS' && tenuremode == 'Daily') {
  //         maturityDate.setDate(depositdate.getDate() + Number(tenure));
  //         this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //       } else if (tenurenature == 'MONTHS' && tenuremode == 'Monthly') {
  //         maturityDate.setMonth((depositdate.getMonth()) + Number(tenure));

  //         this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //       }
  //       else if (tenurenature == 'MONTHS' && tenuremode == 'Yearly') {
  //         maturityDate.setFullYear(depositdate.getFullYear() + Number(tenure));

  //         this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //       }
  //       else if (tenurenature == 'DAYS') {
  //         maturityDate.setDate(depositdate.getDate() + (Number(tenure) / Number(Payinduration)));
  //         this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //       }
  //       else if (tenurenature == 'MONTHS') {
  //         maturityDate.setMonth((depositdate.getMonth() + Number(Payinduration)) * Number(tenure));
  //         this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //       }

  //     }
  //   }
  //   else {
  //     if (tenuremode == 'Days') {
  //       maturityDate.setDate(depositdate.getDate() + Number(tenure));
  //       this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //     } else if (tenuremode == 'Months') {
  //       maturityDate.setMonth((depositdate.getMonth()) + Number(tenure));
  //       // maturityDate.setDate(maturityDate.getDate()-1);
  //       this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //     } else {
  //       maturityDate.setFullYear(depositdate.getFullYear() + Number(tenure));
  //       // maturityDate.setDate(maturityDate.getDate()-1);
  //       this.RdTranscationform.controls.pMaturityDate.setValue(maturityDate);
  //     }
  //   }
  // }
  NextTabClick() {

    let str = "fd-ac"
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }
  Intrestpayoutchanges(event) {
    debugger
    this.Intrestpayout = event;
    //this.Showmaturityamountforintrest=true;
    this.GetRDTenureandMininterestRateofInterestRate()
    //this.ShowIntrestamountforintrest=true;
  }
  Intrestratechanges(event) {
    debugger

    this.GetRDMaturityamount();

    this.GetRDTenureandMininterestRateofInterestRate()

    this.Intrestrate = this.commonservice.removeCommasForEntredNumber(event.target.value);
    this.interestvalidation = this.Intrestrate
    // if(this.IntrestrateFrom >0 && this.IntrestrateTo>0)
    // {
    //   if(event.target.value  < this.IntrestrateFrom || event.target.value > this.IntrestrateTo)
    //   {
    //     this.commonservice.showWarningMessage("Intrest rate is in between" + this.IntrestrateFrom + "&" + this.IntrestrateTo)
    //     this.RdTranscationform.controls.pInterestRate.setValue("")
    //   }
    // }
    this.GetDataBasedOnTenure()

  }
  callintrestratevalidation() {
    debugger
    if (this.IntrestrateFrom > 0 && this.IntrestrateTo > 0) {
      if (this.interestvalidation < this.IntrestrateFrom || this.interestvalidation > this.IntrestrateTo) {
        this.commonservice.showWarningMessage("Enter valid Interest Rate")
        this.RdTranscationform.controls.pInterestRate.setValue("")
      }
      else {
        this.RdTranscationform.controls.pInterestRate.setValue(this.interestvalidation);
        this.Intrestrate = this.interestvalidation
      }
    }

  }
  chitbranchchanges(event) {
    debugger;
    this.RdTranscationform.controls.pChitbranchId.setValue(event.pBranchId)
    //this.RdTranscationform.controls.pChitbranchname.setValue(event.pBranchname)
  }
  DepositAmountontablechanges(event) {
    debugger
    this.RdtranscationErrors.pinstallmentAmount = '';
    let installmentAmount = this.buttontype == "edit" ? event : event.target.value
    this.pinstallmentAmount = this.depositamountontable = parseInt(installmentAmount);
    this.callintrestAmount()
    //this.Intrestpayoutchanges('On Maturity');
  }
  callintrestAmount() {
    this._rdtranscationservice.GetRDInterestamountsofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.Tenure, this.depositamountontable, this.SelectedMembertype).subscribe(json => {
      this.intrestamountontable = parseInt(json[0].pInterestAmount)
      debugger
      if (this.intrestamountontable > 0) {
        this.ShowIntrestamount = true;
        this.ShowIntrestamountforintrest = false;
        this.RdTranscationform.controls.pInterestAmount.setValue(json[0].pInterestAmount)
        this.CallMaturityAmount()
      }
    })
  }
  CallMaturityAmount() {
    debugger
    this._rdtranscationservice.GetRDMaturityamountsofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.Tenure, this.depositamountontable, this.intrestamountontable, this.SelectedMembertype).subscribe(json => {
      console.log('RD Amountssssss', json)
      this.Matrityamountontable = Math.round(json[0].pMaturityAmount)
      if (this.Matrityamountontable > 0) {
        this.Showmaturityamount = true;
        this.Showmaturityamountforintrest = false;

        this.RdTranscationform.controls.pMaturityAmount.setValue(Math.round(json[0].pMaturityAmount));
        this.RdTranscationform.controls.pDepositAmount.setValue(parseInt(json[0].pDepositamount));
        this.ptotaldepositamount = json[0].pDepositamount;
        this.CallIntrestPayout()
      }

    })
  }
  CallIntrestPayout() {
    debugger
    this._rdtranscationservice.GetRDPayoutsofTable(this.Rdname, this.Rdconfigid, this.TenureMode, this.Tenure, this.depositamountontable, this.intrestamountontable, this.Matrityamountontable).subscribe(json => {
      this.RdSchemeDetails = json
    })
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
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
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.RdtranscationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.RdtranscationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this.commonservice.showErrorMessage(errormsg);
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

  SaveForm() {
    this.status = true;
    this.RdTranscationform.controls.pMemberId.setValue(this.MemberidSave)
    debugger
    let isValid = true;
    let data = JSON.stringify(this.RdTranscationform.value)
    if (this.checkValidations(this.RdTranscationform, isValid)) {
      debugger
      this.RdTranscationform.controls.pContacttype.setValue(this.contactType)
      //if(this.buttontype=="edit")
      //{
      //  debugger

      //  this.RdTranscationform.controls.pTransdate.setValue(this.datePipe.transform(this.RdTranscationform.controls.pTransdate.value, "yyyy/dd/MM"))
      //  this.RdTranscationform.controls.pDepositDate.setValue(this.datePipe.transform(this.RdTranscationform.controls.pDepositDate.value, "yyyy/dd/MM"))
      //  this.RdTranscationform.controls.pMaturityDate.setValue(this.datePipe.transform(this.RdTranscationform.controls.pMaturityDate.value,"yyyy/dd/MM"))
      //}
      //if(this.RdTranscationform.controls.pMaturityAmount)
      if (this.RdTranscationform.controls.pMaturityAmount.value == 0) {
        let tenuremode
        let tenure
        let depositamount
        let intrestpayout = 'ON MATURITY';

        let intrestcompunding;
        if (this.buttontype == 'edit') {
          depositamount = this.Datatobind.pinstallmentAmount
          tenuremode = this.Datatobind.pInterestTenureMode;
          tenure = parseInt(this.Datatobind.pInterestTenure);
          intrestcompunding = this.RdTranscationform.controls.pInterestType.value.toUpperCase();
        } else {
          depositamount = parseInt(this.pinstallmentAmount)
          tenuremode = this.TenureMode.toUpperCase()
          tenure = parseInt(this.Tenure)
          intrestcompunding = this.IntrestCompounding.toUpperCase();
        }
        this._rdtranscationservice.GetRDMaturityamount(tenuremode, tenure, depositamount,
          intrestpayout, intrestcompunding, this.griddata[0].pCompoundType, this.Intrestrate, this.Caltype).subscribe(res => {
            debugger
            //this.Showmaturityamountforintrest=true;
            //this.ShowIntrestamountforintrest=true;
            this.RdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
            this.MaturityAmnt = Math.round(res[0].pMatueritytAmount);
            this.IntrestAmount = res[0].pInterestamount
            this.RdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount)
            this.Save()

          })

      }
      else {
        this.Save()

      }

      //this.RdTranscationform.controls.pMemberId.setValue(this.Memberid)
      //this.RdTranscationform.controls.pRdConfigId.setValue(this.Rdconfigid)
    }
  }
  calculateRatePerSqaureYard() {
    debugger;

    if (this.ratepersquareyard != 0 && this.ratepersquareyard != undefined) {
      this.ratesquareyard = this.pinstallmentAmount / this.ratepersquareyard;
      this.RdTranscationform.controls.pSquareyard.setValue(this.ratesquareyard);

    }

  }
  Save() {


    this.calculateRatePerSqaureYard()
    let Rdname = this.RdTranscationform.controls.pRdname.value;
    let applicantype = this.RdTranscationform.controls.pApplicantType.value;
    let MemberType = this.RdTranscationform.controls.pMemberType.value;
    let data = JSON.stringify(this.RdTranscationform.value);
    this._rdtranscationservice.SetBusinessEntityStatus(this.Businessentitystatus)
    this._rdtranscationservice.SaveRDMemberandSchemeData(data).subscribe(json => {
      debugger;
      //window.open('/#/RdInstallmentsChart?id=' + btoa(json['pRdaccountNo']));
      //$('.nav-item a').removeClass('disableTabs');
      //let res = { pshareapplicationid: 17, pShareAccountNo: "SHKAFDFD2000017" };
      //json = {pRdAccountId: 8, pRdaccountNo: "RTIKAFDFD2000002"}

      let resdata = { accountId: json['pRdAccountId'], accountNo: json['pRdaccountNo'] };
      this._CoJointmemberService._SetShareAccountdata(resdata);
      //this._CoJointmemberService._SetShareAccountdata(json);


      this._CoJointmemberService._setfdMembercode(this.Membercode, this.Memberid)
      let str = "add-joint-member"
      $('.nav-item a[href="#' + str + '"]').tab('show');

      // let str = "add-joint-member"
      // $('.nav-item a[href="#' + str + '"]').tab('show');


      this.contactType = "Individual";
      this.GetApplicanttypes(this.contactType);
      this.RdTranscationform.controls.pEntitytype.setValue("Individual")


      if (this.buttontype == "edit") {
        this.Membercode = this.RdTranscationform.controls.pMemberCode.value;
        this.RdTranscationform.controls.pIsJointMembersapplicable.setValue(this.Datatobind.pIsJointMembersapplicable);
        this.RdTranscationform.controls.pIsReferralsapplicable.setValue(this.Datatobind.pIsReferralsapplicable);
        this.RdTranscationform.controls.pIsNomineesapplicable.setValue(this.Datatobind.pIsNomineesapplicable);
        this._rdtranscationservice._Seteditdata(this.griddata)
      }
      //this._rdtranscationservice._setrdMembercode(this.Membercode, this.Memberid)
      this._CoJointmemberService._setfdMembercode(this.Membercode, this.Memberid)


      this.showgrid = false;
      // this.griddata=[]
      this._rdtranscationservice._Setgriddata(this.griddata)
      this.RdaccountNo = json['pRdaccountNo']
      this.RdAccountId = json['pRdAccountId']
      this._rdtranscationservice._SetDataForJointMember(this.Applicanttype, this.RdAccountId, this.RdaccountNo, this.Contactid, this.contactrefid)


      if (this.buttontype == "edit") {
        this.commonservice.showInfoMessage("Update successfully");
        this._CoJointmemberService.GetMemberEditNomineeDetails(this.Membercode, 'RD Transaction').subscribe(json => {
          debugger

          this._CoJointmemberService.sendMemberNomineeDetails(json);


        });
      } else {
        this.commonservice.showInfoMessage("Saved successfully");
        this._rdtranscationservice.GetMemberNomineeDetails(this.Membercode).subscribe(json => {
          debugger
          this.Nomineedetails = [];
          this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
          this.Nomineedetails = json;
          // this._rdtranscationservice._GetNomineeDetails();
          //this._rdtranscationservice.sendMemberNomineeDetails(this.Nomineedetails);
          this._rdtranscationservice.NomineeDetails.next(this.Nomineedetails);
          this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);

          this.clearform();

        })
      }

      this.showIntrestcompounding = false;
      this.showintrestrate = false;
      this.showvalueper100 = false
      this.RdSchemeDetails = ""
      this.DepositAmountBaseconintrest = false
      this.Showmaturityamount = false;
      this.showgrid = true;
      this.Multiplesof = ""
      this.IntrestCompounding = ""
      this._rdtranscationservice.GetRdTotalDetails(Rdname, applicantype, MemberType).subscribe(json => {
        debugger
        this.griddata = json;
        this.showgrid = true
      })
    })

  }


  back() {
    debugger;
    this.router.navigate(['/RdTransactionView']);
    // this.nomineeDetails.nomineeList=[];

  }


  clearform() {
    this.FormGroup();
    this.buttontype = "new";
    this.SelectType = 'Contact';
    this.contactType = "Individual";
    this.RdTranscationform.controls.pEntitytype.setValue("Individual")
    this.RdTranscationform.controls['pMemberId'].setValue('');
    this.RdTranscationform.controls['pMemberName'].setValue('');
    this.RdtranscationErrors = '';
    this.RdTranscationform.controls.pRdConfigId.setValue("");
    this.RdTranscationform.controls.pApplicantType.setValue("");
    this.showgrid = false;
    this.RdSchemes = [];
    this.clearRdschemechange()
    //this.griddata = [];
    //this.showgrid=false;
    this.tenureontable = false;
    this.DepositAmountBasedontable = false;
    this.DepositAmountBaseconintrest = false;
    this.showtenureonintrest = false;
    this.showintrestrate = false;
    this.showcalculate = false;
    this.IntrestCompounding = false;
    this.DepositAmountBaseconintrest = false;
    this.memberdetails = ""
    //this.ApplicantTypes="";
    this.RdSchemes = [];
    this.RdTranscationform.controls.pMemberId.setValue(null)
    this.IntrestAmount = "";
    this.MaturityAmnt = 0;
    this.intrestamountontable = "";
    this.Matrityamountontable = 0;
    this.ptotaldepositamount = 0;
    this.RdTranscationform.controls.pDepositAmount.setValue(0);
    this.showcalculate = false;
    this.groupshow = false;
    this.showmember = true;
    this.ShowIntrestamount = false;
    this.showintrestrate = false;
    this.showvalueper100 = false;
    this.Memberid = "";
    this.MemberidSave = ""
    this.Intrestratedisable = false
    this.Showmaturityamount = false;
    this.showtenureonintrest = false;
    this.Showmaturityamountforintrest = false;
    this.ShowIntrestamountforintrest = false;
    //this.griddata = [];
    this.showgrid = true;
    this.Rdname = "";
    this._rdtranscationservice.Newformstatus("new");
    this.SelectTypeChange('Individual');
   // this.ngOnInit()



  }

}
