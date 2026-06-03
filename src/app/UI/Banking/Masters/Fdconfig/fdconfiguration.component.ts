import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { DueReportsComponent } from 'src/app/UI/Loans/Reports/due-reports/due-reports.component';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { isNullOrUndefined } from 'util';
import { IfStmt } from '@angular/compiler';
declare var $: any;

@Component({
  selector: 'app-fdconfiguration',
  templateUrl: './fdconfiguration.component.html',
  styles: []
})
export class FdconfigurationComponent implements OnInit {
  TDSsectiondetails: any = []
  fiViewDepositeData = [];
  fiViewConfigData = [];
  public mySelection: string[] = [];
  public gridViewDeposite: any = [];
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  forMonthly: string;
  forQuarterly: string;
 
  forHalfYearly: string;
  forYearly: string;
  forOnMaturity: string = 'On Maturity';
  showCompoundInterest: boolean = false;
  pMembertypeid: any = null;
  pApplicanttype: any = null;
  enteredFromValue: any;
  enteredToValue: any;
  forFromToFlag: boolean = true;
  memberTypeError: boolean = false;
  showmultipesof: boolean = false;
  applicantTypeError: boolean = false;
  notEditable: boolean = false;
  globaleDepositeAmount: any;
  interestpayoutvalidation:boolean=true
  interetsFromTo: boolean = false;

  globalTensureFlag: boolean = true;
  globalTensureModeFlag: boolean = true;
  // globalPayinFlag: boolean = true;
  globalInterestFlag: boolean = true;
  globalDepositeAmountFlag: boolean = true;
  globalMinAmountFlag: boolean = true;
  globalMaxAmountFlag: boolean = true;
  globalrefferalcommisiontype: boolean = true
  investPeriodFromFlag: boolean = true;
  investPeriodToFlag: boolean = true;
  Valueper100: boolean = false;
  Intrestrate: boolean = false;
  public monthlycheckedstatus:boolean=false;;
  public Quarterlycheckedstatus:boolean=false;
  public halfyearlycheckedstatus:boolean=false;
  public yearlycheckedstatus:boolean=false;
  public onmaturitycheckedstatus:boolean=true;
  public gridViewConfig: any = [];
  public headerCells: any = {
    textAlign: 'center'
  };
  public groups: GroupDescriptor[] = [];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  constructor(private fb: FormBuilder,
    private _CommonService: CommonService,
    private _fdrdservice: FdRdServiceService,
    private _loanmasterservice: LoansmasterService, private _TdsService: TdsdetailsService) {
    // this.loadFiDatas();
    this.allDepositeData = this.allDepositeData.bind(this);
    this.allConfigData = this.allConfigData.bind(this);
  }
  fdConfigurationForm: FormGroup
  showInterestRate: any;
  showupdatetable: any;
  ApplicantTypes: any;
  tdsshow: any;
  tenureamnt: any;
  tds: any;
  payinamnt: any;
  fromnoofyears: any;
  investfrom: any;
  investto: any;
  fromnoofdays: any;
  fromnoofmonths: any;
  tonoofyears: any;
  tonoofdays: any;
  tonoofmonths: any;
  showrate: boolean = true;
  mininstalamunt: any;
  maxinstalamunt: any;
  depositamnt: any;
  validationformin: boolean;
  maturityamnt: any;
  Tdssection:any
  Interestpayouts: any;
  showvalue: any;
  DepositGridData: any = []
  fdcongiggriddata: any = []
  MembertypeDetails: any;
  AccountConfigErrorMessages: any;
  membertype = [];
  applicanttype = [];
  showcommissionpayout: any;
  forFixed: any;
  forPercentage: any;
  ngOnInit() {
    this.AccountConfigErrorMessages = {};
    this.DepositGridData=[];
    this.showInterestRate = true;
    this.showupdatetable = false;
    this.showvalue = true;
    this.showrate = true;
    this.forFixed = false;
    this.forOnMaturity='On Maturity';
    this.forPercentage = true;
    this.validationformin = false;
    this.showcommissionpayout = false;
    this.monthlycheckedstatus=false;
    this.Quarterlycheckedstatus=false;
    this.halfyearlycheckedstatus=false;
    this.yearlycheckedstatus=false;
    this.onmaturitycheckedstatus = true;
    this.notEditable = false;
    this.tdsshow = true;
  
    
    // this.fdConfigurationForm = new FormGroup({

    //   pMembertype: new FormControl(''),
    //   pApplicanttype:new FormControl('',[Validators.required]),
    //   pMembertypeid:new FormControl('',[Validators.required]),
    //   ptypeofoperation: new FormControl(this._CommonService.pCreatedby),

    //   lstFDConfigartionDetailsDTO: new FormGroup({
    //     pInterestcaltype: new FormControl('0'),
    //     pinterestamount: new FormControl('0'),
    //     pdepositamount: new FormControl('0'),
    //     pmaturityamount: new FormControl('0'),
    //     pFDcalucationmode: new FormControl('Update table'),
    //     ptenure: new FormControl('0'),
    //     ptenuremode: new FormControl(''),
    //     pTypeofOperation: new FormControl(this._CommonService.ptypeofoperation),
    //     pPayindenomination:new FormControl('0'),
    //     pInterestpayuot: new FormControl('')
    //   }),  
    //   "lstFDConfigartionDetailsDTO": new FormGroup({
    //     "precordid": new FormControl('0'),

    //     "pFDcalucationmode": new FormControl('Interest rate'),
    //     "pMininstalmentamount": new FormControl('0'),
    //     "pMaxinstalmentamount": new FormControl('0'),
    //     "pInstalmentpayin": new FormControl(''),
    //     "pInvestmentperiodfrom": new FormControl('0'),
    //     'pInvestmentperiodto': new FormControl('0'),
    //     'pInterestpayuot': new FormControl(''),
    //     "pInteresttype": new FormControl('Simple Interest'),
    //     'pInterestCompunding': new FormControl(''),
    //     'pInterestratefrom': new FormControl(''),
    //     'pfromnoofyears':  new FormControl(''),
    //     'pfromnoofmonths': new FormControl(''),
    //     'pfromnoofdays': new FormControl(''),
    //     'ptonoofyears':  new FormControl(''),
    //     'ptonoofmonths':  new FormControl(''),
    //     'ptonoofdays':  new FormControl(''),
    //     'pInterestrateto': new FormControl(''),
    //     'pValueper100':new FormControl('0'),
    //     'pTypeofOperation': new FormControl(this._CommonService.ptypeofoperation),

    //   })
    // })


    this.fdConfigurationForm = new FormGroup({
      pMembertype: new FormControl(''),
      pApplicanttype: new FormControl(''),
      pMembertypeid: new FormControl(''),
      pCreatedby: new FormControl(''),
      pFdconfigid: new FormControl(''),
      pFdname: new FormControl(''),
      forType: new FormControl('Interest rate'),
      pFdcode: new FormControl(''),
      pFdnamecode: new FormControl(''),


      "lstFDConfigartionDetailsDTO": new FormGroup({
        "precordid": new FormControl('0'),
        "pFDcalucationmode": new FormControl('Interest rate'),
        "pMininstalmentamount": new FormControl(''),
        "pMaxinstalmentamount": new FormControl(''),
        // "pInstalmentpayin": new FormControl(''),
        "pInvestmentperiodfrom": new FormControl(''),
        "pReferralcommissiontype": new FormControl('percentage'),
        "pCommissionValue": new FormControl(0),
        "pIstdsapplicable": new FormControl(true),
        "pTdssection": new FormControl(),
        "pTdsaccountid": new FormControl(''),
        "pTdspercentage": new FormControl(0),
        "pIsreferralcommissionapplicable": new FormControl(false),
        'pInvestmentperiodto': new FormControl(''),
        'pInterestpayuot': new FormControl(''),
        "pInteresttype": new FormControl('Simple Interest'),
        'pInterestCompunding': new FormControl(''),
        'pInterestratefrom': new FormControl('', [Validators.required]),
        'pfromnoofyears': new FormControl(''),
        'pfromnoofmonths': new FormControl(''),
        'pfromnoofdays': new FormControl(''),
        'ptonoofyears': new FormControl(''),
        'ptonoofmonths': new FormControl(''),
        'ptonoofdays': new FormControl(''),
        'pInterestrateto': new FormControl('', [Validators.required]),
        "pMultiplesofamount": new FormControl(0),
        "pRatepersquareyard": new FormControl('', [Validators.required]),
        'pValueper100': new FormControl('', [Validators.required]),
        'pCaltype':new FormControl(''),
        "ptenure": new FormControl(''),
        "ptenuremode": new FormControl(''),
        "pinterestamount": new FormControl(''),
        "pdepositamount": new FormControl(''),
        "pmaturityamount": new FormControl(''),
        // "pPayindenomination": new FormControl(''),
        'pTypeofOperation': new FormControl(this._CommonService.ptypeofoperation),

      })
      
    })


    this._CommonService.Getmemberdetails('member').subscribe(json => {
      debugger;
      if (json) {

        this.MembertypeDetails = json
        let obj = [];
        let obj1 = ({ pmembertypeid: this.MembertypeDetails[0].pmembertypeid, pmembertype: this.MembertypeDetails[0].pmembertype })
        obj.push(obj1);
       // this.pMembertypeid = [1];
        this.MemberTypeChange(obj);




      }
    });
    this.clearvalidations();
    this.getApplicantTypes("Individual");
    this.GetInterestPayout();
    this.BlurEventAllControll(this.fdConfigurationForm);
    this.getTDSsectiondetails();
  }

  loadInitData() {
    debugger;

    let minDamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount;
    let maxDamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount;
    //let referalapplicable = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIsreferralcommissionapplicable;
   // let commissionvalue = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pCommissionValue;
    let Referralcommissiontype = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pReferralcommissiontype;
    let tds = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIstdsapplicable;
    let tdssection = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pTdssection;
    let multiplesof = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMultiplesofamount;
    let Ratepersquareyard = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pRatepersquareyard;
    this.notEditable = false;
    let membertypeid=this.fdConfigurationForm.controls.pMembertypeid.value;
    let applicationtype=this.fdConfigurationForm.controls.pApplicanttype.value;

    this.fdConfigurationForm = new FormGroup({


      pCreatedby: new FormControl(this._CommonService.pCreatedby),
      pFdconfigid: new FormControl(''),
      pFdname: new FormControl(''),
      pFdcode: new FormControl(''),
      forType: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
      pFdnamecode: new FormControl(''),
       pMembertypeid:new FormControl(membertypeid),
       pApplicanttype:new FormControl(applicationtype),
       ptypeofoperation: new FormControl(this._CommonService.ptypeofoperation),
      "lstFDConfigartionDetailsDTO": new FormGroup({
        "precordid": new FormControl('0'),
        "pFDcalucationmode": new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
        "pMininstalmentamount": new FormControl(''),
        "pMaxinstalmentamount": new FormControl(''),
        // "pInstalmentpayin": new FormControl(''),
        "pInvestmentperiodfrom": new FormControl(''),
        'pInvestmentperiodto': new FormControl(''),
        'pInterestpayuot': new FormControl(''),
        "pInteresttype": new FormControl('Simple Interest'),
         "pReferralcommissiontype": new FormControl(Referralcommissiontype),
         "pIsreferralcommissionapplicable": new FormControl(false),
        "pCommissionValue": new FormControl(0),
       "pIstdsapplicable": new FormControl(true),
         "pTdssection": new FormControl(this.Tdssection),
        "pTdsaccountid": new FormControl(''),
        "pTdspercentage": new FormControl(0),
        'pInterestCompunding': new FormControl(''),
        'pInterestratefrom': new FormControl('', [Validators.required]),
        "pMultiplesofamount": new FormControl(0),
        "pRatepersquareyard": new FormControl('', Validators.required),
        'pfromnoofyears': new FormControl(''),
        'pfromnoofmonths': new FormControl(''),
        'pfromnoofdays': new FormControl(''),
        'ptonoofyears': new FormControl(''),
        'ptonoofmonths': new FormControl(''),
        'ptonoofdays': new FormControl(''),
        'pInterestrateto': new FormControl('', [Validators.required]),
        'pValueper100': new FormControl(''),
        'pCaltype':new FormControl(''),
        "ptenure": new FormControl(''),
        "ptenuremode": new FormControl(''),
        "pinterestamount": new FormControl(''),
        "pdepositamount": new FormControl(''),
        "pmaturityamount": new FormControl(''),
        // "pPayindenomination": new FormControl(''),
        'pTypeofOperation': new FormControl(this._CommonService.ptypeofoperation),

      })
    })
    // if (referalapplicable == true) {
    //   this.showcommissionpayout = true;
    //   this.tdsshow = true;
    // }
    // else {
    //   this.showcommissionpayout = false;
    //   this.tdsshow = false;
    // }

    // this.showInterestRate = true;
    // this.showupdatetable = false;
    //  this.pApplicanttype = null;
    // this.pMembertypeid = null;
    this.showvalue = true;
    this.showrate = true;
    this.showcommissionpayout = false;
    this.forFixed = false;
    this.forPercentage = true;
    this.tdsshow = false;
    this.showmultipesof=false;
     this.clearvalidations();
     this.Valueper100 = false;
      this.Intrestrate = false;
        this.monthlycheckedstatus = false;
      this.Quarterlycheckedstatus = false;
      this.halfyearlycheckedstatus = false;
      this.yearlycheckedstatus = false;
      this.onmaturitycheckedstatus = true;
      this.investPeriodFromFlag=true;
      this.investPeriodToFlag=true;
      this.notEditable = false;
      this.forMonthly = '';
      this.forQuarterly = '';
      this.forHalfYearly = '';
      this.forYearly = '';
      this.forOnMaturity = 'On Maturity' ;
      this.AccountConfigErrorMessages={};
  }
  interestratechecked(event) {
    debugger

    if (event.target.checked) {
      let Interestratefrom = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestratefrom'];
      let pInterestrateto = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestrateto'];
      let Valueper100 = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pValueper100'];
      let Ratepersquareyard = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pRatepersquareyard'];
      Interestratefrom.setValidators(Validators.required);
      Interestratefrom.updateValueAndValidity();
      pInterestrateto.setValidators(Validators.required);
      pInterestrateto.updateValueAndValidity();
      Valueper100.setValidators(Validators.required);
      Valueper100.updateValueAndValidity();
      Ratepersquareyard.setValidators(Validators.required);
      Ratepersquareyard.updateValueAndValidity();


      this.showInterestRate = true;
      this.showupdatetable = false;
      // this.fdcongiggriddata = [];
      // this.DepositGridData = [];
      // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.patchValue({
      //   pFDcalucationmode:  event.target.value
      // })
    }
   // this.pApplicanttype = null;
    // this.pMembertypeid = null;
    //this.refreshData();
    this.loadInitData();
  }

  updatetablechecked(event) {
    debugger
    if (event.target.checked) {
      let Interestratefrom = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestratefrom'];
      let pInterestrateto = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestrateto'];
      let Valueper100 = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pValueper100'];
      let Ratepersquareyard = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pRatepersquareyard'];

      Interestratefrom.clearValidators();
      Interestratefrom.updateValueAndValidity();
      pInterestrateto.clearValidators();
      pInterestrateto.updateValueAndValidity();
      Valueper100.clearValidators();
      Valueper100.updateValueAndValidity();
      Ratepersquareyard.clearValidators();
      Ratepersquareyard.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestratefrom = "";
      this.AccountConfigErrorMessages.pInterestrateto = "";
      this.AccountConfigErrorMessages.pValueper100 = "";
      this.AccountConfigErrorMessages.pRatepersquareyard = "";

      this.showInterestRate = false;
      this.showupdatetable = true;
      // this.fdcongiggriddata = [];
      // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.patchValue({
      //   pFDcalucationmode:  event.target.value
      // })
    }
   // this.pApplicanttype = null;
    //this.pMembertypeid = null;
   // this.refreshData();
      this.loadInitData();
  }
  // intrestratechecked(event)
  // {
  //   if(event.target.checked)
  //   {
  //     this.showvalue=false;
  //     this.showrate=true;
  //   }
  //   else{
  //     this.showvalue=true;
  //     this.showrate=false;
  //   }
  // }
  RdConfigartionDetails() {
    return this.fb.group
      ({

      })
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
  GetInterestPayout() {
    this._loanmasterservice._getLoanpayins().subscribe(json => {
      if (json) {
        this.Interestpayouts = json
      }
    });
  }
  // MemberTypeChange($event) {
  //   debugger;
  //   const MemberTypename = $event.target.options[$event.target.selectedIndex].text;
  //   this.fdConfigurationForm.controls.pMembertype.setValue(MemberTypename);
  // }

  MemberTypeChange($event) {
    debugger;
    this.membertype = [];
    if ($event.length > 0) {
      this.memberTypeError = false;
      $event.reduce((acc, item) => {
        this.membertype.push({ membertypeid: item.pmembertypeid, membertypename: item.pmembertype })
      }, []);
      //const MemberTypename = $event.target.options[$event.target.selectedIndex].text;
      //  this.SavingAccountConfigurationform.controls.pMembertype.setValue(MemberTypename);
    }
    else {
      this.memberTypeError = true;
    }
  }

  ApplicanttypeChange($event) {
    this.applicanttype = [];
    if ($event.length > 0) {
      this.applicantTypeError = false;
      $event.reduce((acc, item) => {
        this.applicanttype.push({ applicanttype: item.pApplicanttype })
      }, []);

    }
    else {
      this.applicantTypeError = true;
    }
  }


  TenureAmount(event) {
    let eneteredTenureValue = event.target.value;
    if (eneteredTenureValue) {
      this.globalTensureFlag = true;
    }
    else {
      this.globalTensureFlag = false;
    }
    this.calculationofdepositamount()
  }
  // Payindenomination(event) {
  //   debugger
  //   this.calculationofdepositamount()
  // }
  calculationofdepositamount() {
    debugger
    this.globaleDepositeAmount = 0;
    this.tenureamnt = 0;
    this.maturityamnt = 0;
    let tamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptenure.value
    let depositeAmount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pdepositamount.value
    let intrstamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pinterestamount.value
    if (isNullOrEmptyString(depositeAmount)) {
      depositeAmount = 0;
    }
    else {
      this.globaleDepositeAmount = depositeAmount ? parseFloat(depositeAmount.toString().replace(/,/g, "")) : 0;
    }
    if (isNullOrEmptyString(tamount)) {
      tamount = 0;
    }
    else {
      this.tenureamnt = tamount ? parseFloat(tamount.toString().replace(/,/g, "")) : 0;
    }
    if (isNullOrEmptyString(intrstamount)) {
      intrstamount = 0;
    }
    else {
      this.maturityamnt = intrstamount ? parseFloat(intrstamount.toString().replace(/,/g, "")) : 0;
    }

    // this.depositamnt = Math.round(( this.tenureamnt))
    // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pdepositamount.setValue(this._CommonService.currencyformat(this.depositamnt))

    this.maturityamnt = Math.round((this.globaleDepositeAmount + this.maturityamnt))
    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pmaturityamount.setValue(this._CommonService.currencyformat(this.maturityamnt))

  }
  notApplicable(event) {
    debugger;
      this.forFixed = false;
      this.forPercentage = true;
    this.AccountConfigErrorMessages.pCommissionValue=null;
    if (event.target.checked) {
      //let applicable=true
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pIsreferralcommissionapplicable.value = true;
      // this.tds=true;
      // this.validatetds(this.tds)
      //this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount 
      this.showcommissionpayout = true;
      this.tdsshow = true
    }
    else {
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pIsreferralcommissionapplicable.value = false;
      // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pIstdsapplicable.value=false;
      //this.tdsshow=false
      this.showcommissionpayout = false;
      this.tdsshow = false
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pReferralcommissiontype.value = 'percentage'
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pTdspercentage.value = 0;
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pCommissionValue.value = 0;
    //  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pTdssection.value = 0;
    }
  }
  validatetds(tds) {
    debugger
    let isValid = true;
    if (tds) {
      this.globalrefferalcommisiontype = true;
      isValid = true
    }
    else {
      this.globalrefferalcommisiontype = false;
      isValid = false
    }
    return isValid
  }
  getTDSsectiondetails() {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
          console.log("tds details",this.TDSsectiondetails[0].pTdsSection);
          this.Tdssection="194H"
          
          this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pTdssection.setValue(this.Tdssection)
          //this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pTdsSection.setValue(this.Tdssection);
         // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.pTdsSection.setValue
          
          
        }
      },
      (error) => {

        this._CommonService.showErrorMessage(error);
      }
    );
  }
  Intrestamount(event) {
    let eneteredInterestAmount = event.target.value;
    if (eneteredInterestAmount) {
      this.globalInterestFlag = true;
    }
    else {
      this.globalInterestFlag = false;
    }
    this.calculationofdepositamount()
  }

  depositeAmountChange(event) {
    let eneteredDepositeAmount = event.target.value;
    if (eneteredDepositeAmount) {
      this.globalDepositeAmountFlag = true;
    }
    else {
      this.globalDepositeAmountFlag = false;
    }
    this.calculationofdepositamount();
  }

  onModeChange(event) {
    let selectedMode = event.target.value;
    if (selectedMode && selectedMode != '') {
      this.globalTensureModeFlag = true;
    }
    else {
      this.globalTensureModeFlag = false;
    }
  }
  // addDataToTable()
  // {

  //   if (this.checkValidations(this.fdConfigurationForm, true)) {
  //     if(this.showupdatetable) {

  //       let tenureFlag = true;
  //       let tenureModeFlag = true;
  //       // let payinFlag = true;
  //       let interestAmountFlag = true;
  //       // this.fdConfigurationForm.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
  //       // console.log("--->",this.fdConfigurationForm.value);

  //       let tensure = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.ptenure;
  //       tensure = tensure ? tensure.toString().replace(/,/g,"") : 0;
  //       if(tensure == 0) {
  //         // this._CommonService.showWarningMessage("Total Tenure should be greater that zero");
  //         tenureFlag = false;
  //         // return;
  //       }
  //       else {
  //         tenureFlag = true;
  //       }
  //       this.globalTensureFlag = tenureFlag;
  //       let tensureMode = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.ptenuremode;
  //       if(tensureMode == '') {
  //         // this._CommonService.showWarningMessage("Please select Tenure Mode");
  //         tenureModeFlag = false;
  //         // return;
  //       }
  //       else {
  //         tenureModeFlag = true;
  //       }
  //       this.globalTensureModeFlag = tenureModeFlag;
  //       // let pPayin = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pPayindenomination;
  //       // pPayin = pPayin ? pPayin.toString().replace(/,/g,"") : 0;
  //       // if(pPayin == 0) {
  //       //   // this._CommonService.showWarningMessage("Pay-In Denomination should be greater that zero");
  //       //   payinFlag = false;
  //       //   // return;
  //       // }
  //       // else {
  //       //   payinFlag = true;
  //       // }
  //       // this.globalPayinFlag = payinFlag;
  //       let interset = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pinterestamount;
  //       interset = interset ? interset.toString().replace(/,/g,"") : 0;
  //       if(interset == 0) {
  //         // this._CommonService.showWarningMessage("Interest Amount should be greater that zero");
  //         interestAmountFlag = false;
  //         // return;
  //       }
  //       else {
  //         interestAmountFlag = true;
  //       }
  //       this.globalInterestFlag = interestAmountFlag;
  //       if(tenureFlag && tenureModeFlag && interestAmountFlag) {
  //         if (this.membertype.length != 0 && this.applicanttype.length != 0) {
  //           let tempArr = [];
  //           // console.log("this.DepositGridData : 111222 ",JSON.parse(JSON.stringify(this.DepositGridData)));

  //           for (let k = 0; k < this.membertype.length; k++) {
  //            for (let p = 0; p < this.applicanttype.length; p++) {
  //             // console.log("this.membertype[k] : ",this.membertype[k]);

  //              let obj1 = JSON.parse(JSON.stringify({pMembertype:this.membertype[k].membertypename,pMembertypeid:this.membertype[k].membertypeid}));           
  //              let obj2 = JSON.parse(JSON.stringify({pApplicanttype:this.applicanttype[p].applicanttype}));
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100.toString().replace(/,/g,""))) : 0;
  //             // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = (this.forMonthly ? (this.forMonthly + ',') : '')+(this.forQuarterly ? (this.forQuarterly + ',') : '')+
  //             (this.forHalfYearly ? (this.forHalfYearly + ',') : '')+(this.forYearly ? (this.forYearly + ',') : '')+(this.forOnMaturity ? (this.forOnMaturity + ',') : '')
  //             let eneteredValue:string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot;
  //             eneteredValue = eneteredValue.trim();

  //             if(eneteredValue) {
  //               if(eneteredValue.charAt(eneteredValue.length-1) == ',') {
  //                 eneteredValue = eneteredValue.substr(0,eneteredValue.length-1);
  //               }
  //               this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = eneteredValue;
  //             }
  //             if(this.DepositGridData && this.DepositGridData.length > 0) {


  //               if(this.showupdatetable) {


  //                 let countForCheckInterest = 0;
  //                 let countFroCheckTable = 0;
  //                 for (let g = 0; g < this.DepositGridData.length; g++) {
  //                     if(this.DepositGridData[g].pFDcalucationmode != 'TABLE') {
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
  //                              this._CommonService.showWarningMessage("Already existed");
  //                              return;
  //                            }
  //                            else {
  //                             countForCheckInterest++;
  //                            }
  //                     }    
  //                     else {

  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                       this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
  //                       Number(this.DepositGridData[g].pinterestamount.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g,"")) &&
  //                       Number(this.DepositGridData[g].ptenure.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g,"")) &&
  //                        (this.DepositGridData[g].ptenuremode) == (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode)) {
  //                          this._CommonService.showWarningMessage("Already existed");
  //                          return;
  //                        }
  //                        else {
  //                         countForCheckInterest++;
  //                        }
  //                     }                
  //                 }

  //                 if(countForCheckInterest == this.DepositGridData.length) {
  //                   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})

  //               }
  //               else {
  //                 let countForCheckInterest = 0;
  //                 let countFroCheckTable = 0;
  //                 for (let g = 0; g < this.DepositGridData.length; g++) {
  //                     if(this.DepositGridData[g].pFDcalucationmode == 'TABLE') {
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
  //                             this._CommonService.showWarningMessage("Already existed "+this.this.applicanttype[p].applicanttype + ' with ' + this.membertype[k].membertypename + 'in Interest Rate');
  //                              return;
  //                            }
  //                            else {
  //                             countForCheckInterest++;
  //                            }
  //                     }    
  //                     else {
  //                       let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
  //                        enteredPayin = enteredPayin.trim();
  //                       let entered1 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
  //                     let entered2 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
  //                     let previous1 = this.DepositGridData[g].pMininstalmentamount  ? Number(this.DepositGridData[g].pMininstalmentamount ) : 0;
  //                     let previous2 = this.DepositGridData[g].pMaxinstalmentamount ? Number(this.DepositGridData[g].pMaxinstalmentamount) : 0;
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                       this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) && 
  //                       this.validateRange(entered1, entered2, previous1, previous2) && (enteredPayin == this.DepositGridData[g].pInstalmentpayin)) {
  //                          this._CommonService.showWarningMessage("Already existed");
  //                          return;
  //                        }
  //                        else {
  //                         countForCheckInterest++;
  //                        }
  //                     }                
  //                 }
  //                 if(countForCheckInterest == this.DepositGridData.length) {
  //                   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //                 }
  //               }


  //             }
  //             else {
  //               this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //             }
  //             // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pFDcalucationmode = 'TABLE';
  //             // this.fdcongiggriddata.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //            }          
  //           // }
  //           // this.DepositGridData = tempArr;

  //         }
  //         this.gridViewDeposite = [];
  //         this.gridViewDeposite = this.DepositGridData;
  //         this.loadInitData();
  //         this.showCompoundInterest = false;
  //         this.AccountConfigErrorMessages = {};
  //         this.BlurEventAllControll(this.fdConfigurationForm);
  //       }
  //       }
  //     }
  //     else {
  //       // this.fdConfigurationForm.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
  //       if(this.forFromToFlag == true) {
  //         if (this.membertype.length != 0 && this.applicanttype.length != 0) {

  //           let tempArr = [];
  //           for (let k = 0; k < this.membertype.length; k++) {
  //            for (let p = 0; p < this.applicanttype.length; p++) {
  //              let obj1 = JSON.parse(JSON.stringify({pMembertype:this.membertype[k].membertypename,pMembertypeid:this.membertype[k].membertypeid}));
  //              let obj2 = JSON.parse(JSON.stringify({pApplicanttype:this.applicanttype[p].applicanttype}));
  //              this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString()).replace(/,/g, ""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString()).replace(/,/g, ""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100.toString().replace(/,/g,""))) : 0;
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = (this.forMonthly ? (this.forMonthly + ',') : '')+(this.forQuarterly ? (this.forQuarterly + ',') : '')+
  //             (this.forHalfYearly ? (this.forHalfYearly + ',') : '')+(this.forYearly ? (this.forYearly + ',') : '')+(this.forOnMaturity ? (this.forOnMaturity + ',') : '')
  //              let eneteredValue: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot;
  //              eneteredValue = eneteredValue.trim();

  //              let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
  //              enteredPayin = enteredPayin.trim();

  //             if(eneteredValue) {
  //               if(eneteredValue.charAt(eneteredValue.length-1) == ',') {
  //                 eneteredValue = eneteredValue.substr(0,eneteredValue.length-1);
  //               }
  //               this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = eneteredValue;
  //             }
  //             if(this.DepositGridData && this.DepositGridData.length > 0) {
  //               if(this.showupdatetable) {

  //                 let countForCheckInterest = 0;
  //                 let countFroCheckTable = 0;
  //                 for (let g = 0; g < this.DepositGridData.length; g++) {
  //                     if(this.DepositGridData[g].pFDcalucationmode != 'TABLE') {
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
  //                             this._CommonService.showWarningMessage("Already existed "+this.this.applicanttype[p].applicanttype + ' with ' + this.membertype[k].membertypename + 'in Update Table');
  //                              return;
  //                            }
  //                            else {
  //                             countForCheckInterest++;
  //                            }
  //                     }    
  //                     else {
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                       this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
  //                       Number(this.DepositGridData[g].pinterestamount.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g,"")) &&
  //                       Number(this.DepositGridData[g].ptenure.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g,"")) &&
  //                        (this.DepositGridData[g].ptenuremode) == (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode)) {
  //                          this._CommonService.showWarningMessage("Already existed");
  //                          return;
  //                        }
  //                        else {
  //                         countForCheckInterest++;
  //                        }
  //                     }                
  //                 }
  //                 if(countForCheckInterest == this.DepositGridData.length) {
  //                   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //                 }
  //                 // if(countFroCheckTable == this.DepositGridData.length) {
  //                 //   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //                 // }
  //               }
  //               else {
  //                 let countForCheckInterest = 0;
  //                 let countFroCheckTable = 0;
  //                 for (let g = 0; g < this.DepositGridData.length; g++) {
  //                     if(this.DepositGridData[g].pFDcalucationmode == 'TABLE') {

  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
  //                             this._CommonService.showWarningMessage("Already existed "+this.this.applicanttype[p].applicanttype + ' with ' + this.membertype[k].membertypename + 'in Interest Rate');
  //                              return;
  //                            }
  //                            else {
  //                             countForCheckInterest++;
  //                            }
  //                     }    
  //                     else {
  //                       let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
  //                        enteredPayin = enteredPayin.trim();
  //                       let entered1 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
  //                     let entered2 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
  //                     let previous1 = this.DepositGridData[g].pMininstalmentamount  ? Number(this.DepositGridData[g].pMininstalmentamount ) : 0;
  //                     let previous2 = this.DepositGridData[g].pMaxinstalmentamount ? Number(this.DepositGridData[g].pMaxinstalmentamount) : 0;
  //                       if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //                       this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
  //                       this.validateRange(entered1, entered2, previous1, previous2) && (enteredPayin == this.DepositGridData[g].pInstalmentpayin)) {
  //                          this._CommonService.showWarningMessage("Already existed");
  //                          return;
  //                        }
  //                        else {
  //                         countForCheckInterest++;
  //                        }
  //                     }                
  //                 }
  //                 if(countForCheckInterest == this.DepositGridData.length) {
  //                   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //                 }
  //               }


  //             }
  //             else {
  //               this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //             }
  //            }          
  //           }
  //           // this.DepositGridData = tempArr;
  //           this.gridViewConfig = this.DepositGridData;
  //           this.loadInitData();
  //           this.showCompoundInterest = false;
  //               this.AccountConfigErrorMessages = {};
  //               this.BlurEventAllControll(this.fdConfigurationForm);
  //         }
  //       }
  //       else {
  //         this._CommonService.showWarningMessage("Investment From Period should be less than Investment To Period ");
  //       }
  //     }
  //   }


  // }

  multipesof(event) {
    debugger
     this.AccountConfigErrorMessages.pMultiplesofamount='';
    if (event.target.checked) {
      this.showmultipesof = true
    }
    else {
      this.showmultipesof = false
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue(0)
    }
  }
  Multiplesofchanges(event) {
    debugger;
     if(event.target.value){
      if(event.target.value==0){
         this._CommonService.showWarningMessage("Multiples Of Must be Greater than Zero.");
         this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue("");
         this.AccountConfigErrorMessages.pMultiplesofamount='Multiples Of Required.';
         return;
      }
      this.AccountConfigErrorMessages.pMultiplesofamount='';
    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue(event.target.value);
    
     let amount = this._CommonService.removeCommasForEntredNumber(event.target.value)
    let multiple = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.value;

    if (amount > this.maxinstalamunt) {
      this._CommonService.showWarningMessage("Should not be greater than Max Deposit Amount")
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue("");
       this.AccountConfigErrorMessages.pMultiplesofamount='Multiples of Required.';
    }
    }
    else{
       this.AccountConfigErrorMessages.pMultiplesofamount='Multiples of Required.';
    }

  }
  MultpleMaxAmountChange(event){
  debugger;
   let eneteredMaxAmount = event.target.value;
     if (eneteredMaxAmount != null && eneteredMaxAmount != '' && eneteredMaxAmount != undefined) {
      this.globalMaxAmountFlag = true;
      if(this.showmultipesof){
      
       let amount = this._CommonService.removeCommasForEntredNumber(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.value)
    let multiple = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.value;
    if (amount > this.maxinstalamunt) {
      this._CommonService.showWarningMessage("Should not be greater than Max Deposit Amount")
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue("");
      this.AccountConfigErrorMessages.pMultiplesofamount='Multiples of Required.';
      return;
    }
      }
    }
    else {
      this.globalMaxAmountFlag = false;
    }
    this.validate(event);
}
  addDataToTable() {
    debugger

   if(this.interestpayoutvalidation)
   {
    if (this.checkValidations(this.fdConfigurationForm, true)) {
      debugger
      // if(this.showcommissionpayout==true)
      // {
      //   this.validatetds(true)
      // }
      let referalstatus = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIsreferralcommissionapplicable;
      let tdssctionno = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pTdssection;
      if (this.pMembertypeid && this.pApplicanttype) {
        this.memberTypeError = false;
        this.applicantTypeError = false;
        if (referalstatus && (tdssctionno == undefined || tdssctionno == "" || tdssctionno == null)) {

          this.globalrefferalcommisiontype = false;
        }
        else {
          this.callupdateandintrestrate();
          this.globalrefferalcommisiontype = true
        }

      }
      else {

        if (this.pMembertypeid == null || this.pMembertypeid == '' || this.pMembertypeid == undefined) {
          this.memberTypeError = true;
        }
        if (this.pApplicanttype == null || this.pApplicanttype == '' || this.pApplicanttype == undefined) {
          this.applicantTypeError = true;
        }
      }
    }
    else {
      console.log("in else ");

    }
   }
   else{
     this._CommonService.showWarningMessage("Interest Payout is Required")
   }
     
    
    
   

  }

  ValidateGridData(payoutvalue) {
   debugger;
    let isValid = false

    let from;
    let to;
    // let applicanttype;
    // let membertypeid;

    if (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount != null)
      from = parseFloat(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, ""));
    if (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount != null)
      to = parseFloat(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, ""));
      let membertypeid=this.fdConfigurationForm.controls.pMembertypeid.value;
    let applicationtype=this.fdConfigurationForm.controls.pApplicanttype.value;

    // let Applicanttype = this.chequemanagementform.controls.pApplicanttype.value;


    let data = this.DepositGridData;
    let Interestexistcount = this.DepositGridData.filter(s => s.pFDcalucationmode != "TABLE").length;
    isValid = Interestexistcount > 0 ? false : true;
    if (data != null) {
      if (data.length > 0) {


        for (let i = 0; i < data.length; i++) {
          debugger;
          let fromdays;
          let todays;
          let payoutInGrid;
          let applicanttypegrid;
          let pMembertypeidgrid;
          if (data[i].pFDcalucationmode != "TABLE") {

            if (data[i].pMininstalmentamount != null)
              fromdays = parseFloat(data[i].pMininstalmentamount.toString().replace(/,/g, ""));
            if (data[i].pMaxinstalmentamount != null)
              todays = parseFloat(data[i].pMaxinstalmentamount.toString().replace(/,/g, "")); 
              payoutInGrid = data[i].pInterestpayuot;
              applicanttypegrid = data[i].pApplicanttype;
              pMembertypeidgrid=data[i].pMembertypeid;


            // if(parseFloat(from) == parseFloat(fromdays) && parseFloat(to) == parseFloat(todays)){
            //   isValid = true;
            //   break;
            // }
            if (parseFloat(from) == parseFloat(fromdays) && parseFloat(to) === parseFloat(todays)) {
              isValid = this.CallInvestmentperiod();
              break;
            }
            if (parseFloat(from) <= parseFloat(fromdays)) {
              isValid = true;

            }
            if (parseFloat(to) >= parseFloat(todays)) {
              isValid = true;

            }
           debugger;
              if (parseFloat(from) >= parseFloat(fromdays) && parseFloat(from) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                if(applicanttypegrid==applicationtype[0] && parseInt(pMembertypeidgrid)==parseInt(membertypeid[0])){
                isValid = payoutvalue == payoutInGrid ? false : true;
                if (!isValid) { break; };
                }
              }
              if (parseFloat(to) >= parseFloat(fromdays) && parseFloat(to) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                 if(applicanttypegrid==applicationtype[0] && parseInt(pMembertypeidgrid)==parseInt(membertypeid[0])){
                isValid = payoutvalue == payoutInGrid ? false : true;
                if (!isValid) { break; };
                 }
              }
              if (parseFloat(from) <= parseFloat(fromdays) && parseFloat(to) >= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                 if(applicanttypegrid==applicationtype[0] && parseInt(pMembertypeidgrid)==parseInt(membertypeid[0])){
                isValid = payoutvalue == payoutInGrid ? false : true;
                if (!isValid) { break; };
                 }
              }
              if (parseFloat(from) >= parseFloat(fromdays) && parseFloat(to) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                 if(applicanttypegrid==applicationtype[0] && parseInt(pMembertypeidgrid)==parseInt(membertypeid[0])){
                isValid = payoutvalue == payoutInGrid ? false : true;
                if (!isValid) { break; };
                 }
            }
            
                     // if(((parseFloat(from)<=parseFloat(fromdays))&&(parseFloat(from)<=parseFloat(todays))
            // &&(parseFloat(to)<=parseFloat(fromdays))&&(parseFloat(to)<=parseFloat(todays)))||
            // ((parseFloat(from)>=parseFloat(fromdays))&&(parseFloat(from)>=parseFloat(todays))&&(parseFloat(to)>=parseFloat(fromdays))&&(parseFloat(to)>=parseFloat(todays))))
            // {
            //    isValid=true
            // }

          }




        }
      }
      else {
        isValid = true;
      }
    }


    return isValid;

  }
  CallInvestmentperiod() {
    debugger
    let isValid = true;
    let investperiodfrom;
    let investperiodto;
    let min;
    let max;
    if (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount != null)
      min = parseFloat(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, ""));
    if (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount != null)
      max = parseFloat(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, ""));
    investperiodfrom = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInvestmentperiodfrom


    investperiodto = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInvestmentperiodto


    let checkinvestperiod = this.DepositGridData.filter(s => s.pInvestmentperiodfrom == investperiodfrom && s.pInvestmentperiodto == investperiodto && s.pMininstalmentamount == min && s.pMaxinstalmentamount == max).length
    if (checkinvestperiod == 0) {
      isValid = true
    }
    else {
      isValid = false
    }
    return isValid
  }
  updatetable() {

    debugger
    let tenureFlag = true;
    let tenureModeFlag = true;
    let depositFlag = true;
    let interestAmountFlag = true;
    let tensure = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.ptenure;
    tensure = tensure ? tensure.toString().replace(/,/g, "") : 0;
    tenureFlag = tensure == 0 ? false : true;
    this.globalTensureFlag = tenureFlag;
    let tensureMode = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.ptenuremode;
    tenureModeFlag = tensureMode == '' ? false : true;
    this.globalTensureModeFlag = tenureModeFlag;
    let eneteredDepositeAmount = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pdepositamount;
    eneteredDepositeAmount = eneteredDepositeAmount ? eneteredDepositeAmount.toString().replace(/,/g, "") : 0;
    depositFlag = eneteredDepositeAmount == 0 ? false : true
    this.globalDepositeAmountFlag = depositFlag;
    let interset = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pinterestamount;
    interestAmountFlag = (interset != '' && interset != null && interset != undefined) ? true : false;
    this.globalInterestFlag = interestAmountFlag;
     let referalapplicable = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIsreferralcommissionapplicable;
          if(referalapplicable){
            let commissionvalue=this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pCommissionValue;
             if(commissionvalue==null || commissionvalue=='' || commissionvalue==0){
              this._CommonService.showWarningMessage("Commission Payout Must be Greater Than Zero.");
             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pCommissionValue.setValue('');
              this.AccountConfigErrorMessages.pCommissionValue="Commission Payout Required";
              return;
            }
          }
    if (tenureFlag && tenureModeFlag && interestAmountFlag && depositFlag) {
      if (this.membertype.length != 0 && this.applicanttype.length != 0) {
        let tempArr = [];
        // console.log("this.DepositGridData : 111222 ",JSON.parse(JSON.stringify(this.DepositGridData)));

        for (let k = 0; k < this.membertype.length; k++) {
          for (let p = 0; p < this.applicanttype.length; p++) {
            // console.log("this.membertype[k] : ",this.membertype[k]);

            let obj1 = JSON.parse(JSON.stringify({ pMembertype: this.membertype[k].membertypename, pMembertypeid: this.membertype[k].membertypeid }));
            let obj2 = JSON.parse(JSON.stringify({ pApplicanttype: this.applicanttype[p].applicanttype }));
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g, ""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount.toString().replace(/,/g, ""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pmaturityamount.toString().replace(/,/g, ""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g, ""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100.toString().replace(/,/g, ""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom ? this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto ? this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto : 0;
            // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pPayindenomination.toString().replace(/,/g,""))) : 0;
            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = (this.forMonthly ? (this.forMonthly + ',') : '') + (this.forQuarterly ? (this.forQuarterly + ',') : '') +
              (this.forHalfYearly ? (this.forHalfYearly + ',') : '') + (this.forYearly ? (this.forYearly + ',') : '') + (this.forOnMaturity ? (this.forOnMaturity + ',') : '')

            let eneteredValue: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot;
            eneteredValue = eneteredValue.trim();

            debugger
            if (eneteredValue) {
              if (eneteredValue.charAt(eneteredValue.length - 1) == ',') {
                eneteredValue = eneteredValue.substr(0, eneteredValue.length - 1);
              }
              this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = eneteredValue;
            }

             let payoutvalue = [];
                  payoutvalue = eneteredValue.split(',');

            let Checkexistcount = this.DepositGridData.filter(s => s.pApplicanttype == this.applicanttype[p].applicanttype && s.pMembertype == this.membertype[k].membertypename && s.pFDcalucationmode == "Interest rate").length;
            debugger
            if (Checkexistcount == 0) {
              debugger
               for (let i = 0; i < payoutvalue.length; i++) {
              Checkexistcount = this.DepositGridData.filter(s =>
               s.pApplicanttype == this.applicanttype[p].applicanttype && s.pMembertype == this.membertype[k].membertypename && s.pFDcalucationmode == "Interest rate" &&
                s.ptenure == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure
                && s.ptenuremode == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode
                && Number(s.pdepositamount.toString().replace(/,/g, "") )==Number (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount.toString().replace(/,/g, ""))  && s.pInterestpayuot == payoutvalue[i]).length;

            if (Checkexistcount == 0) {
              
              Checkexistcount = this.DepositGridData.filter(s =>
               s.pApplicanttype == this.applicanttype[p].applicanttype && s.pMembertype == this.membertype[k].membertypename && s.pFDcalucationmode.toUpperCase()== "TABLE" &&
                s.ptenure == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure
                && s.ptenuremode == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode
                && Number(s.pdepositamount.toString().replace(/,/g, "") )==Number (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pdepositamount.toString().replace(/,/g, ""))  && s.pInterestpayuot == payoutvalue[i]).length;

                if(Checkexistcount == 0){

                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = payoutvalue[i];
                  this.DepositGridData.push({ ...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value, ...obj1, ...obj2 })
                }
              else {
              this._CommonService.showWarningMessage("Already existed");
              return
            }
              }

            else {
              this._CommonService.showWarningMessage("Already existed");
              return
            }
               }



            // if(this.DepositGridData && this.DepositGridData.length > 0) {




            //     let countForCheckInterest = 0;
            //     let countFroCheckTable = 0;
            //     for (let g = 0; g < this.DepositGridData.length; g++) {


            //           if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
            //           this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
            //           Number(this.DepositGridData[g].pinterestamount.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g,"")) &&
            //           Number(this.DepositGridData[g].ptenure.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g,"")) &&
            //            (this.DepositGridData[g].ptenuremode) == (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode)) {
            //              //this._CommonService.showWarningMessage("Already existed with same Tenure, Tenure mode and Interest Amount");
            //              this._CommonService.showWarningMessage("Already existed");
            //              return;
            //            }
            //            else {
            //             countForCheckInterest++;
            //            }

            //     }

            //     if(countForCheckInterest == this.DepositGridData.length) {
            //       this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
            //     }




            // }
            // else {
            //   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
            // }
            // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pFDcalucationmode = 'TABLE';
            // this.fdcongiggriddata.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
          }
             else {
               this._CommonService.showWarningMessage("Already existed");
               return;
             }
          // }
          // this.DepositGridData = tempArr;

        }
        }
        this.gridViewDeposite = [];
        this.gridViewDeposite = this.DepositGridData;
        this.refreshData();
        this.showCompoundInterest = false;
        this.AccountConfigErrorMessages = {};
        this.BlurEventAllControll(this.fdConfigurationForm);
      }
    }

  }

CommissionValue_change(event){
  debugger;
  let commissionvalue=event.target.value;
  if(commissionvalue!=''){
    this.AccountConfigErrorMessages.pCommissionValue=null;
  }
  else{
    this.AccountConfigErrorMessages.pCommissionValue="Commission Payout Required";
  }
}
  InterestTable() {

    debugger;
    if (this.validationformin == false) {
      if (this.interetsFromTo == false) {
        let maxAmountFlag = true;
        let minAmountFlag = true;
        let instaPayinFlag = true;

        let pMininstalmentamount = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pMininstalmentamount;
        pMininstalmentamount = pMininstalmentamount ? Number(pMininstalmentamount.toString().replace(/,/g, "")) : 0;
        minAmountFlag = pMininstalmentamount == 0 ? false : true

        this.globalMinAmountFlag = minAmountFlag;
        let pMaxinstalmentamount = this.fdConfigurationForm.value.lstFDConfigartionDetailsDTO.pMaxinstalmentamount;
        pMaxinstalmentamount = pMaxinstalmentamount ? Number(pMaxinstalmentamount.toString().replace(/,/g, "")) : 0;
        maxAmountFlag = pMaxinstalmentamount == 0 ? false : true

        this.globalMaxAmountFlag = maxAmountFlag;
          if(this.showmultipesof==true){
             let Multiplesofamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMultiplesofamount;
            if(Multiplesofamount==null || Multiplesofamount=='' || Multiplesofamount==0){
              this._CommonService.showWarningMessage("Multiples of Must be Greater Than Zero.");
             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMultiplesofamount.setValue('');
              this.AccountConfigErrorMessages.pMultiplesofamount="Multiples of Required";
              return;
            }
          }
           let referalapplicable = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIsreferralcommissionapplicable;
          if(referalapplicable){
            let commissionvalue=this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pCommissionValue;
             if(commissionvalue==null || commissionvalue=='' || commissionvalue==0){
              this._CommonService.showWarningMessage("Commission Payout Must be Greater Than Zero.");
             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pCommissionValue.setValue('');
              this.AccountConfigErrorMessages.pCommissionValue="Commission Payout Required";
              return;
            }
          }
        if (minAmountFlag && maxAmountFlag && instaPayinFlag) {
          // this.fdConfigurationForm.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
          if (this.forFromToFlag == true) {
            if (this.membertype.length != 0 && this.applicanttype.length != 0) {

              let tempArr = [];
              for (let k = 0; k < this.membertype.length; k++) {
                for (let p = 0; p < this.applicanttype.length; p++) {
                  let obj1 = JSON.parse(JSON.stringify({ pMembertype: this.membertype[k].membertypename, pMembertypeid: this.membertype[k].membertypeid }));
                  let obj2 = JSON.parse(JSON.stringify({ pApplicanttype: this.applicanttype[p].applicanttype }));
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString()).replace(/,/g, ""))) : 0;
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString()).replace(/,/g, ""))) : 0;
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pRatepersquareyard = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pRatepersquareyard ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pRatepersquareyard.toString()).replace(/,/g, ""))) : 0;
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100 ? this._CommonService.currencyformat((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pValueper100.toString().replace(/,/g, ""))) : 0;
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = (this.forMonthly ? (this.forMonthly + ',') : '') + (this.forQuarterly ? (this.forQuarterly + ',') : '') +
                    (this.forHalfYearly ? (this.forHalfYearly + ',') : '') + (this.forYearly ? (this.forYearly + ',') : '') + (this.forOnMaturity ? (this.forOnMaturity + ',') : '')
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom ? this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom : 0;
                  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto ? this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto : 0;

                  let eneteredValue: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot;
                  eneteredValue = eneteredValue.trim();
                  
                  //  let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
                  //  enteredPayin = enteredPayin.trim();

                  if (eneteredValue) {
                    if (eneteredValue.charAt(eneteredValue.length - 1) == ',') {
                      eneteredValue = eneteredValue.substr(0, eneteredValue.length - 1);
                    }
                    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = eneteredValue;
                  }
                  
                  
                  
                  let payoutvalue = [];
                  payoutvalue = eneteredValue.split(',');
                  console.log(payoutvalue)


                 
                    debugger;
                    let Checkexistcount = this.DepositGridData.filter(s => s.pApplicanttype == this.applicanttype[p].applicanttype
                      && s.pMembertype == this.membertype[k].membertypename && s.pFDcalucationmode == 'TABLE').length;

                    if (Checkexistcount == 0) {
                      for (let i = 0; i < payoutvalue.length; i++) {
                        debugger;
                        Checkexistcount = this.DepositGridData.filter(s => s.pApplicanttype == this.applicanttype[p].applicanttype && Number(s.pMininstalmentamount.toString().replace(/,/g, "")) == Number(pMininstalmentamount.toString().replace(/,/g, "")) && Number(s.pMaxinstalmentamount.toString().replace(/,/g, "")) == Number(pMaxinstalmentamount.toString().replace(/,/g, ""))
                          && s.pInvestmentperiodfrom == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInvestmentperiodfrom
                          && s.pInvestmentperiodto == this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInvestmentperiodto && s.pInterestpayuot == payoutvalue[i] && s.pMembertype==this.membertype[p].pMembertype).length
                        if (Checkexistcount == 0) {
                          if (this.ValidateGridData(payoutvalue[i])) {
                            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = payoutvalue[i];
                            this.DepositGridData.push({ ...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value, ...obj1, ...obj2 })
                            this.Valueper100 = false;
                            this.Intrestrate = false;
                          }
                           else {
                          this._CommonService.showWarningMessage("Already existed");
                          return
                        }

                        }
                        else {
                          this._CommonService.showWarningMessage("Already existed");
                          return;
                        }
                      
                    }

                  }
                     else {
                          this._CommonService.showWarningMessage("Already existed");
                          return;
                        }

                  
                  // if(this.DepositGridData && this.DepositGridData.length > 0) {
                  //   if(this.showupdatetable) {

                  //     let countForCheckInterest = 0;
                  //     let countFroCheckTable = 0;
                  //     for (let g = 0; g < this.DepositGridData.length; g++) {
                  //         if(this.DepositGridData[g].pFDcalucationmode != 'TABLE') {
                  //           if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                  //                this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                  //                 //this._CommonService.showWarningMessage("Already existed "+ this.membertype[k].membertypename + ' with ' + this.applicanttype[p].applicanttype + ' in Interest Rate');
                  //                 this._CommonService.showWarningMessage("Already existed");
                  //                  return;
                  //                }
                  //                else {
                  //                 countForCheckInterest++;
                  //                }
                  //         }    
                  //         else {
                  //           if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                  //           this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                  //           Number(this.DepositGridData[g].pinterestamount.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pinterestamount.toString().replace(/,/g,"")) &&
                  //           Number(this.DepositGridData[g].ptenure.toString().replace(/,/g,"")) == Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenure.toString().replace(/,/g,"")) &&
                  //            (this.DepositGridData[g].ptenuremode) == (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.ptenuremode)) {
                  //             //this._CommonService.showWarningMessage("Already existed with same Tenure, Tenure mode and Interest Amount");
                  //             this._CommonService.showWarningMessage("Already existed");
                  //              return;
                  //            }
                  //            else {
                  //             countForCheckInterest++;
                  //            }
                  //         }                
                  //     }
                  //     if(countForCheckInterest == this.DepositGridData.length) {
                  //       this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
                  //     }
                  //     // if(countFroCheckTable == this.DepositGridData.length) {
                  //     //   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
                  //     // }
                  //   }
                  //   else {
                  //     let countForCheckInterest = 0;
                  //     let countFroCheckTable = 0;
                  //     for (let g = 0; g < this.DepositGridData.length; g++) {
                  //         if(this.DepositGridData[g].pFDcalucationmode == 'TABLE') {

                  //           if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                  //                this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                  //                 //this._CommonService.showWarningMessage("Already existed "+ this.membertype[k].membertypename + ' with ' + this.applicanttype[p].applicanttype + ' in Update Table');
                  //                 this._CommonService.showWarningMessage("Already existed");
                  //                  return;
                  //                }
                  //                else {
                  //                 countForCheckInterest++;
                  //                }
                  //         }    
                  //         else {
                  //           // let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
                  //           //  enteredPayin = enteredPayin.trim();
                  //           let entered1 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
                  //         let entered2 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
                  //         let previous1 = this.DepositGridData[g].pMininstalmentamount  ? Number(this.DepositGridData[g].pMininstalmentamount ) : 0;
                  //         let previous2 = this.DepositGridData[g].pMaxinstalmentamount ? Number(this.DepositGridData[g].pMaxinstalmentamount) : 0;
                  //           if(this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                  //           this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                  //           this.validateRange(entered1,entered2,previous1,previous2)) {
                  //             //this._CommonService.showWarningMessage("Already existed with same Range and Pay-in");
                  //             this._CommonService.showWarningMessage("Already existed");
                  //              return;
                  //            }
                  //            else {
                  //             countForCheckInterest++;
                  //            }
                  //         }                
                  //     }
                  //     if(countForCheckInterest == this.DepositGridData.length) {
                  //       this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
                  //     }
                  //   }


                  // }
                  // else {
                  //   this.DepositGridData.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
                  // }
                }
              }
              // this.DepositGridData = tempArr;
              this.gridViewDeposite = [];
              this.gridViewDeposite = this.DepositGridData;
              //this.loadInitData();
              this.refreshData();
              this.investfrom = undefined;
              this.investto = undefined;
              //  this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom.setValue("")
              // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto.setValue("")
              this.showCompoundInterest = false;
              this.AccountConfigErrorMessages = {};
              this.BlurEventAllControll(this.fdConfigurationForm);
              // this.pMembertypeid = null;
              //this.pApplicanttype = null;
            }
          }
          else {
            this._CommonService.showWarningMessage("Investment From Period should be less than Investment To Period ");
          }
        }
      }
      else {
        this._CommonService.showWarningMessage("From value should be less than To value");
      }
    }

  }
  callupdateandintrestrate() {
    debugger

    if (this.showupdatetable) {
      this.updatetable()
    }
    else {
      if (!isNullOrEmptyString(this.investfrom) && !isNullOrEmptyString(this.investto)) {
        if (this.valiFDConfigDetails())
          this.InterestTable()
      }
      else {
        this.investPeriodFromFlag = !isNullOrUndefined(this.investfrom) ? true : false;
        this.investPeriodToFlag = !isNullOrUndefined(this.investto) ? true : false;
      }

    }


  }
  // adddatatogrid()
  // {


  //   //  debugger;
  //   //  this.fdcongiggriddata.push(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value)
  //   //  this.fdcongiggriddata.filter(item => {
  //   //   item.pMembertype =this.fdConfigurationForm.controls.pMembertype.value
  //   //   item.pMembertypeid=this.fdConfigurationForm.controls.pMembertypeid.value
  //   //   item.pApplicanttype=this.fdConfigurationForm.controls.pApplicanttype.value
  //   // })
  //   if (this.checkValidations(this.fdConfigurationForm, true)) {
  //     this.fdConfigurationForm.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
  //     if(this.forFromToFlag == true) {
  //       if (this.membertype.length != 0 && this.applicanttype.length != 0) {

  //         let tempArr = [];
  //         for (let k = 0; k < this.membertype.length; k++) {
  //          for (let p = 0; p < this.applicanttype.length; p++) {
  //            let obj1 = JSON.parse(JSON.stringify({pMembertype:this.membertype[k].membertypename,pMembertypeid:this.membertype[k].membertypeid}));
  //            let obj2 = JSON.parse(JSON.stringify({pApplicanttype:this.applicanttype[p].applicanttype}));
  //            this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString()).replace(/,/g, ""))) : 0;
  //           this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount ? this._CommonService.currencyformat(((this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString()).replace(/,/g, ""))) : 0;

  //           this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = (this.forMonthly ? (this.forMonthly + ',') : '')+(this.forQuarterly ? (this.forQuarterly + ',') : '')+
  //           (this.forHalfYearly ? (this.forHalfYearly + ',') : '')+(this.forYearly ? (this.forYearly + ',') : '')+(this.forOnMaturity ? (this.forOnMaturity + ',') : '')
  //            let eneteredValue: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot;
  //            eneteredValue = eneteredValue.trim();

  //            let enteredPayin: string = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInstalmentpayin;
  //            enteredPayin = enteredPayin.trim();

  //           if(eneteredValue) {
  //             if(eneteredValue.charAt(eneteredValue.length-1) == ',') {
  //               eneteredValue = eneteredValue.substr(0,eneteredValue.length-1);
  //             }
  //             this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestpayuot = eneteredValue;
  //           }
  //           if(this.fdcongiggriddata && this.fdcongiggriddata.length > 0) {
  //             let count = 0;
  //             for (let i = 0; i < this.fdcongiggriddata.length; i++) {
  //               if(this.fdcongiggriddata[i].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //               this.fdcongiggriddata[i].pMembertype == (this.membertype[k].membertypename) &&
  //                (enteredPayin == this.fdcongiggriddata[i].pInstalmentpayin)  )
  //               {
  //                 let entered1 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
  //                 let entered2 = (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
  //                 let previous1 = this.fdcongiggriddata[i].pMininstalmentamount  ? Number(this.fdcongiggriddata[i].pMininstalmentamount ) : 0;
  //                 let previous2 = this.fdcongiggriddata[i].pMaxinstalmentamount ? Number(this.fdcongiggriddata[i].pMaxinstalmentamount) : 0;
  //                 if(this.validateRange(entered1, entered2, previous1, previous2)) {
  //                   this._CommonService.showWarningMessage("Already existed");
  //                   return;
  //                 }
  //                 else {
  //                   count++;
  //                 }
  //               }
  //               else {
  //                 count++;
  //               }
  //             }
  //             if(count == this.fdcongiggriddata.length) {
  //               this.fdcongiggriddata.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})     
  //             }
  //           }
  //           else {
  //             this.fdcongiggriddata.push({...this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value,...obj1,...obj2})
  //           }
  //          }          
  //         }
  //         // this.fdcongiggriddata = tempArr;
  //         this.gridViewConfig = this.fdcongiggriddata;
  //         this.loadInitData();
  //         this.showCompoundInterest = false;
  //             this.AccountConfigErrorMessages = {};
  //             this.BlurEventAllControll(this.fdConfigurationForm);
  //         console.log("tempArr : ",tempArr);
  //       }
  //     }
  //     else {
  //       this._CommonService.showWarningMessage("Investment From Period should be less than Investment To Period ");
  //     }

  //   }


  // }
  InvestmentPeriodToChange(event) {
    let InvestmentPeriodTo = event.target.value;
    if (!isNullOrUndefined(InvestmentPeriodTo) || !isNullOrUndefined(this.investto)) {
      this.investPeriodToFlag = true;
    }
    else {
      this.investPeriodToFlag = false;
    }
  }
  InvestmentPeriodfromChange(event) {
    let InvestmentPeriodfrom = event.target.value;
    if (!isNullOrUndefined(InvestmentPeriodfrom) || !isNullOrUndefined(this.investfrom)) {
      this.investPeriodFromFlag = true;
    }
    else {
      this.investPeriodFromFlag = false;
    }
  }
  Investmentfrom() {
    debugger;
    this.fromnoofyears = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofyears.value) ? ""
      : this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofyears.value + 'Y'
    this.fromnoofmonths = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.value) ? "" :
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.value + 'M'
    this.fromnoofdays = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.value) ? "" :
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.value + 'D'
    this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
    this.investfrom = this.investfrom.trim(" ")
    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodfrom.setValue(this.investfrom)


    let fromYears = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofyears.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofyears.value.toString().replace(/,/g, "")) : 0;
    let fromMonths = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.value.toString().replace(/,/g, "")) : 0;
    let fromDays = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.value.toString().replace(/,/g, "")) : 0;
    this.enteredFromValue = (fromYears * 365) + (fromMonths * 30) + (fromDays);
    let years = fromYears * 12;
    let months = fromMonths * 30;
    let days = fromYears * 365;
    if (fromYears != 0) {

      if (fromMonths > 11) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Months");
        this.fromnoofmonths="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }
    if (fromMonths != 0) {


      if (fromDays > 29) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.fromnoofdays="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }
    else if (fromYears != 0) {

      if (fromDays > 29) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.fromnoofdays="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }

    this.checkForFromAndToDays()
    // if(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofyears.value && 
    // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofmonths.value &&
    // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pfromnoofdays.value) {

    // }

  }
  Investto() {
    debugger;
    this.tonoofyears = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofyears.value) ? "" :
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofyears.value + 'Y'
    this.tonoofmonths = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.value) ? "" :
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.value + 'M'
    this.tonoofdays = isNullOrEmptyString(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.value) ? "" :
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.value + 'D'
    this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
    this.investto = this.investto.trim(" ")
    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodto.setValue(this.investto)

    let toYears = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofyears.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofyears.value.toString().replace(/,/g, "")) : 0;
    let toMonths = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.value.toString().replace(/,/g, "")) : 0;
    let tomDays = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.value ? Number(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.value.toString().replace(/,/g, "")) : 0;
    this.enteredToValue = (toYears * 365) + (toMonths * 30) + (tomDays);
    let years = toYears * 12;
    let months = toMonths * 30;
    let days = toYears * 365;
    if (toYears != 0) {
      if (toMonths > 11) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Months");
        this.tonoofmonths=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodto.setValue(this.investto)
       
      }
    }
    if (toMonths != 0) {
      if (tomDays > 29) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.tonoofmonths=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodto.setValue(this.investto)
      }
    }
    else if (toYears != 0) {
      if (tomDays > 29) {
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.tonoofdays=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pInvestmentperiodto.setValue(this.investto)
    
      //  let str=this.investto.trim("  ")
        //var res = str.slice(0, 5);
      }
    }

    this.checkForFromAndToDays()
    // if(this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofyears.value && 
    // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofmonths.value &&
    // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].ptonoofdays.value) {

    // }
  }

  minAmountChange(event) {
    let eneteredMinAmount = event.target.value;
    if (eneteredMinAmount != null && eneteredMinAmount != '' && eneteredMinAmount != undefined) {
      this.globalMinAmountFlag = true;
    }
    else {
      this.globalMinAmountFlag = false;
    }
    this.validate(event);
  }

  mixAmountChange(event) {
    debugger;
    let eneteredMaxAmount = event.target.value;
    if (eneteredMaxAmount != null && eneteredMaxAmount != '' && eneteredMaxAmount != undefined) {
      this.globalMaxAmountFlag = true;
    }
    else {
      this.globalMaxAmountFlag = false;
    }
    this.validate(event);
  }

  validate(event) {
    debugger
    this.mininstalamunt = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMininstalmentamount.value
    this.maxinstalamunt = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pMaxinstalmentamount.value
    if (isNullOrEmptyString(this.mininstalamunt)) {
      this.mininstalamunt = 0;
    }
    else {
      this.mininstalamunt = parseFloat(this.mininstalamunt.toString().replace(/,/g, ""));
    }
    if (isNullOrEmptyString(this.maxinstalamunt)) {
      this.maxinstalamunt = 0;
    }
    else {
      this.maxinstalamunt = parseFloat(this.maxinstalamunt.toString().replace(/,/g, ""));
    }
    if (this.mininstalamunt == 0) {
      this.globalMinAmountFlag = false;
    }
    if (this.maxinstalamunt == 0) {
      this.globalMaxAmountFlag = false;
    }
    if (this.maxinstalamunt > 0) {
      if (this.mininstalamunt > this.maxinstalamunt) {
        this.validationformin = true;
      }
      else {
        this.validationformin = false
      }
    }
    else {
      this.globalMinAmountFlag = true;
      this.globalMaxAmountFlag = true;
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
  valiFDConfigDetails(): boolean {
    debugger
    let isValid: boolean = true;

    const formControl = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO'];
    try {

      let isValid1;
      let isValid2;
      let isValid3;
     
      isValid1 = this.GetValidationByControl(formControl, 'pInterestratefrom', true);
      isValid2 = this.GetValidationByControl(formControl, 'pInterestrateto', true);
      isValid3 = this.GetValidationByControl(formControl, 'pValueper100', true);
      // isvalid4 = this.GetValidationByControl(formControl, 'pRatepersquareyard', true);
      if (isValid1 && isValid2 && isValid3) {
        isValid = true;
      }
      else {
        isValid = false
      }

    }

    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    //this.formValidationMessages['pdebitamount'] = 'required';
    //this.formValidationMessages['pcreditamount'] = 'required';

    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          if (key != 'lstFDConfigartionDetailsDTO')
            this.checkValidations(formcontrol, isValid)
          //this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.AccountConfigErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.AccountConfigErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
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
  validateAddSavingAccountConfiguration(): boolean {

    let isValid: boolean = true;
    try {
      debugger;
      isValid = this.checkValidations(this.fdConfigurationForm, isValid)
      //let membertype = this.SavingAccountConfigurationform.controls.pMembertype.value;
      //let Aplicanttype = this.SavingAccountConfigurationform.controls.pApplicanttype.value;
      //let count = 0;
      //for (let i = 0; i < this.GridData.length; i++) {
      //  if (this.GridData[i].pMembertype == membertype && this.GridData[i].pApplicanttype == Aplicanttype) {
      //    count = 1;
      //    break;
      //  }

      //}
      //if (count == 1) {
      //  this._CommonService.showWarningMessage('Member Type, Applicant Type  already exists in grid');
      //  isValid = false;
      //}
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    return isValid;
  }

  public pageChange(event: PageChangeEvent, take): void {
    debugger
    this.skip = event.skip;
    this.pageSize = take;
    this.loadFiDatas();
  }
  private loadFiDatas(): void {
    debugger
    this.DepositGridData = {
      data: this.DepositGridData.slice(this.skip, this.skip + this.pageSize),
      total: this.DepositGridData.length
    };
    this.gridViewConfig = {
      data: this.gridViewConfig.slice(this.skip, this.skip + this.pageSize),
      total: this.gridViewConfig.length
    };
  }


  public allDepositeData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridViewDeposite, { group: this.groups, sort: [] }).data,
      group: this.groups
    };

    return result;
  }
  public allConfigData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridViewConfig, { group: this.groups, sort: [] }).data,
      group: this.groups
    };

    return result;
  }

  public onFilter(inputValue: string, ): void {

    this.DepositGridData = process(this.gridViewDeposite, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pMembertype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicanttype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFDcalucationmode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptenure',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pinterestamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdepositamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmaturityamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMininstalmentamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaxinstalmentamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInvestmentperiodfrom',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInvestmentperiodto',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInstalmentpayin',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterestpayuot',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInteresttype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pValueper100',
            operator: 'contains',
            value: inputValue
          }
        ]
      }
    }).data;

  }

  editHandler(event, type) {
    //console.log("event : ", event);
    let vchApplicationId = btoa(event.dataItem.pVchapplicationid);
  }

  onCommissionChange(event) {
    debugger
    console.log("event taeget : ", event.target.value);
    let type = event.target.value;
    if (type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.patchValue({
        pCommissionValue: '',
        pReferralcommissiontype: type
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.patchValue({
        pCommissionValue: '0',
        pReferralcommissiontype: type
      })
    }
  }
  valueentered(event) {
    debugger;

    if (event.target.value == "") {
        this.AccountConfigErrorMessages.pValueper100 = "";
      let Interestratefrom = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestratefrom'];
      let Interestrateto = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestrateto'];
      Interestratefrom.setValidators(Validators.required);
      Interestratefrom.updateValueAndValidity();

      Interestrateto.setValidators(Validators.required);
      Interestrateto.updateValueAndValidity();

      // this.notEditable = false;
      this.Intrestrate = false

    }
    else {

      let Valueper100=event.target.value
      let Interestratefrom = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestratefrom'];
      let Interestrateto = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pInterestrateto'];
      Interestratefrom.clearValidators();
      Interestratefrom.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestratefrom = "";
      Interestrateto.clearValidators();
      Interestrateto.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestrateto = "";
      this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pCaltype'].setValue(Valueper100)
      this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pCaltype'].setValue("Value Per 100")
       this.Intrestrate = true;
      // this.monthlycheckedstatus = false;
      // this.Quarterlycheckedstatus = false;
      // this.halfyearlycheckedstatus = false;
      // this.yearlycheckedstatus = false;
      // this.onmaturitycheckedstatus = true;
      // this.notEditable = true;
      // this.forMonthly = '';
      // this.forQuarterly = '';
      // this.forHalfYearly = '';
      // this.forYearly = '';
      // this.forOnMaturity = 'On Maturity' 
    }

  }
  public removeHandler(dataItem, type) {

    if (type == 'deposite') {
      // const index: number = this.gridViewDeposite.indexOf(dataItem);
      // console.log("index : ",index);

      // if (index !== -1) {
      // this.gridViewDeposite.splice(dataItem.rowIndex, 1);
      this.DepositGridData.splice(dataItem.rowIndex, 1);
      this.DepositGridData=[...this.DepositGridData];
      // console.log("---->",this.DepositGridData);

      // }
    }
    else {
      // const index: number = this.gridViewConfig.indexOf(dataItem);
      // if (index !== -1) {
      this.fdcongiggriddata.splice(dataItem.rowIndex, 1);
      // }
    }
  }

  forInterestPayout(event, type) {
    debugger;
    let value = event.target.checked;
    event.target.autocomplete = value;
    if (type == 'Monthly') {
      if (value)
       {
        this.forMonthly = 'Monthly';
        

      }
      else {
        this.forMonthly = '';
       
      }
    }
    else if (type == 'Quarterly') {
      if (value) {
        this.forQuarterly = 'Quarterly';
       
      }
      else {
        this.forQuarterly = '';
        
      }
    }
    else if (type == 'Half-Yearly') {
      if (value) {
        this.forHalfYearly = 'Half-Yearly';
        
      }
      else {
        this.forHalfYearly = '';
        
      }
    }
    else if (type == 'Yearly') {
      if (value) {
        this.forYearly = 'Yearly';
        
      }
      else {
        this.forYearly = '';
        
      }
    }
    else {
      if (value) {
        this.forOnMaturity = 'On Maturity';
        
      }
      else {
        this.forOnMaturity = '';
        
      }
    }
    if(isNullOrEmptyString(this.forMonthly) && isNullOrEmptyString(this.forQuarterly) && isNullOrEmptyString(this.forHalfYearly)
    && isNullOrEmptyString(this.forYearly) && isNullOrEmptyString(this.forOnMaturity))
    {
       this.interestpayoutvalidation=false
    }
    else{
      this.interestpayoutvalidation=true
    }
  }

  changeInterestType(event) {
    let selectedValue = event.target.value;
    this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.patchValue({
      pInterestCompunding: ''
    })
    if (selectedValue == 'Compounding Interest') {
      this.showCompoundInterest = true;
    }
    else {
      this.showCompoundInterest = false;
    }
  }
  checkFromToValue() {

    debugger
    let fromValue = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestratefrom;
    

    let toValue = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto;
    if (fromValue != "" ||  toValue!="") {

      this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pCaltype'].setValue("Interest rate")
      let Valueper100 = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pValueper100'];
             if(fromValue != ""){
         this.AccountConfigErrorMessages.pInterestratefrom=null;
        }
        if(toValue != ""){
         this.AccountConfigErrorMessages.pInterestrateto=null;
        }
      Valueper100.clearValidators();
      Valueper100.updateValueAndValidity();
      this.AccountConfigErrorMessages.pValueper100 = "";
      this.Valueper100 = true
    }
    else {
      let Valueper100 = <FormGroup>this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pValueper100'];
      Valueper100.setValidators(Validators.required);
      Valueper100.updateValueAndValidity();

      this.Valueper100 = false
    }
    if (this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pInterestrateto) {
      fromValue = fromValue ? Number(fromValue) : 0;
      toValue = toValue ? Number(toValue) : 0; 
      this.fdConfigurationForm['controls']['lstFDConfigartionDetailsDTO']['controls']['pCaltype'].setValue("Interest rate")

      if (fromValue > toValue) {
        this.interetsFromTo = true;
        this._CommonService.showWarningMessage("From value should be less than To value");
      }
      else {
        this.interetsFromTo = false;
      }
      // this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO['controls'].pValueper100.disable()
      //this.Valueper100=true
    }
    // else{
    //   this.Valueper100=false
    // }
  }

  checkForFromAndToDays() {
    debugger;
   
    //setTimeout(() => {
    //   }, 200);
    this.checkInterestPayoutcondition();

    if (this.enteredFromValue > this.enteredToValue) {
      this._CommonService.showWarningMessage("Investment From Period should be less than Investment To Period ");
      this.forFromToFlag = false;
    }
    else if (this.enteredFromValue == 0 && this.enteredToValue == 0) {
      this.forFromToFlag = true;
    }
    else {
      this.forFromToFlag = true;
    }
    
  }
  checkInterestPayoutcondition() {
    debugger;
    if ((isNullOrEmptyString(this.fromnoofyears) && isNullOrEmptyString(this.fromnoofmonths) && !isNullOrEmptyString(this.fromnoofdays)) && (isNullOrEmptyString(this.tonoofyears) && (isNullOrEmptyString(this.tonoofmonths) && !isNullOrEmptyString(this.tonoofdays)))) {
      this.monthlycheckedstatus = false;
      this.Quarterlycheckedstatus = false;
      this.halfyearlycheckedstatus = false;
      this.yearlycheckedstatus = false;
      this.onmaturitycheckedstatus = true;
      this.notEditable = true;
      this.forMonthly = '';
      this.forQuarterly = '';
      this.forHalfYearly = '';
      this.forYearly = '';
      this.forOnMaturity = 'On Maturity' 
    }
    else {
      this.notEditable = false;
    }
  }
  validateRange(entered1, entered2, previous1, previous2) {
    let isValid = false;
    if ((entered1) >= (previous1) && (entered1) <= (previous2)) {
      //this.showErrorMessage('Given range already exists');
      isValid = true;
    }
    else if ((entered2) >= (previous1) && (entered2) <= (previous2)) {
      //this.showErrorMessage('Given range already exists');
      isValid = true;
    }
    else if ((entered1) <= (previous1) && (entered2) >= (previous2)) {
      //this.showErrorMessage('Given range already exists');
      isValid = true;
    }
    else if ((entered1) >= (previous1) && (entered2) <= (previous2)) {
      //this.showErrorMessage('Given range already exists');
      isValid = true;
    }
    else {
      isValid = false;
    }
    return isValid;
  }

  forClear() {
    this.refreshData();
  }

  clearvalidations(){
  debugger;
  this.forFromToFlag = true;
  //this.globalPayinFlag = true;
  this.globalTensureFlag= true;
  this.globalTensureModeFlag = true;
  this.globalInterestFlag = true;
  this.globalDepositeAmountFlag = true;
  this.globalMinAmountFlag= true;
  this.globalMaxAmountFlag = true;
  //this.forInterestFromTo = true;
  //this.globalInstallmentFlag = true;
  this.memberTypeError = false;
  this.applicantTypeError= false;
}

  refreshData() {
    debugger
    let referalapplicable = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIsreferralcommissionapplicable;
    let commissionvalue = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pCommissionValue;

    let tds = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pIstdsapplicable;
    let tdssection = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pTdssection;
    let Referralcommissiontype = this.fdConfigurationForm.controls.lstFDConfigartionDetailsDTO.value.pReferralcommissiontype;
    
    this.fdConfigurationForm = new FormGroup({


      pCreatedby: new FormControl(this._CommonService.pCreatedby),
      pFdconfigid: new FormControl(''),
      pFdname: new FormControl(''),
      forType: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
      pFdcode: new FormControl(''),
      pFdnamecode: new FormControl(''),
      pMembertypeid: new FormControl(''),
      pApplicanttype: new FormControl(''),
      "lstFDConfigartionDetailsDTO": new FormGroup({
        "precordid": new FormControl('0'),
        "pFDcalucationmode": new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
        "pMininstalmentamount": new FormControl(''),
        "pMaxinstalmentamount": new FormControl(''),
        // "pInstalmentpayin": new FormControl(''),
        "pInvestmentperiodfrom": new FormControl(''),
        'pInvestmentperiodto': new FormControl(''),
        "pMultiplesofamount": new FormControl(0),
        "pRatepersquareyard": new FormControl('', [Validators.required]),
        'pInterestpayuot': new FormControl(''),
        "pInteresttype": new FormControl('Simple Interest'),
        "pReferralcommissiontype": new FormControl('percentage'),
        "pIsreferralcommissionapplicable": new FormControl(false),
        "pCommissionValue": new FormControl(0),
        "pIstdsapplicable": new FormControl(true),
        "pTdssection": new FormControl(this.Tdssection),
        "pTdsaccountid": new FormControl(''),
        "pTdspercentage": new FormControl(0),
        'pInterestCompunding': new FormControl(''),
        'pInterestratefrom': new FormControl('', [Validators.required]),
        'pfromnoofyears': new FormControl(''),
        'pfromnoofmonths': new FormControl(''),
        'pCaltype':new FormControl(''),
        'pfromnoofdays': new FormControl(''),
        'ptonoofyears': new FormControl(''),
        'ptonoofmonths': new FormControl(''),
        'ptonoofdays': new FormControl(''),
        'pInterestrateto': new FormControl('', [Validators.required]),
        'pValueper100': new FormControl('', [Validators.required]),
        "ptenure": new FormControl(''),
        "ptenuremode": new FormControl(''),

        "pinterestamount": new FormControl(''),
        "pdepositamount": new FormControl(''),
        "pmaturityamount": new FormControl(''),
        // "pPayindenomination": new FormControl(''),
        'pTypeofOperation': new FormControl(this._CommonService.ptypeofoperation),

      })
    })
    if (referalapplicable == true) {
      this.showcommissionpayout = true;
      this.tdsshow = true;
    }
    else {
      this.showcommissionpayout = false;
      this.tdsshow = true;
    }
     this.pApplicanttype = null;
    this.pMembertypeid = null;
      this.showcommissionpayout = false;
      this.forFixed = false;
      this.forPercentage = true;
      this.tdsshow = false
       this.showvalue = true;
       this.showrate = true;
       this.Valueper100 = false;
      this.Intrestrate = false;
      this.clearvalidations();
       this.monthlycheckedstatus = false;
      this.Quarterlycheckedstatus = false;
      this.halfyearlycheckedstatus = false;
      this.yearlycheckedstatus = false;
      this.onmaturitycheckedstatus = true;
      this.notEditable = false;
      this.forMonthly = '';
      this.forQuarterly = '';
      this.forHalfYearly = '';
      this.forYearly = '';
      this.showmultipesof=false;
      this.forOnMaturity = 'On Maturity' ;
      this.AccountConfigErrorMessages={};
  }
}
