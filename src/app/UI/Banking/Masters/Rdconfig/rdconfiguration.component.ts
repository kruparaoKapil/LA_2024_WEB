import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { PageChangeEvent, DataBindingDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-rdconfiguration',
  templateUrl: './rdconfiguration.component.html',
  styles: []
})
export class RdconfigurationComponent implements OnInit {

  Rdconfigurationform: FormGroup;

  fiViewDepositeData = [];
  fiViewConfigData = [];
  public mySelection: string[] = [];
  public gridViewDeposite: any = [];
  private data: Object[];
  public gridViewConfig: any = [];
  public groups: GroupDescriptor[] = [];
  DepositGridData: any = []
  Rdcongiggriddata: any = []
  membertype = [];
  applicanttype = [];

  public pageSize = 10;
  public skip = 0;

  showCompoundInterest: boolean = false;
  forFromToFlag: boolean = true;
  globalPayinFlag: boolean = true;
  globalTensureFlag: boolean = true;
  globalTensureModeFlag: boolean = true;
  globalInterestFlag: boolean = true;
  globalDepositeAmountFlag: boolean = true;
  globalMinAmountFlag: boolean = true;
  globalMaxAmountFlag: boolean = true;
  forInterestFromTo: boolean = true;
  globalInstallmentFlag: boolean = true;
  memberTypeError: boolean = false;
  applicantTypeError: boolean = false;
  showrate: boolean = true;
  validationformin: boolean;

  onMaturity: string = '';

  enteredFromValue: any;
  enteredToValue: any;
  pApplicanttype: any = null;
  pMembertypeid: any = null;
  showInterestRate=true;
  showupdatetable=false;
  Intrestrate: boolean = false;
  Valueper100: boolean = false;
  investPeriodFromFlag:boolean=true;
  investPeriodToFlag:boolean=true;
  ApplicantTypes: any;
  tenureamnt: any;
  payinamnt: any;
  fromnoofyears: any;
  investfrom: any;
  investto: any;
  public multiplesstatus=false;
  fromnoofdays: any;
  fromnoofmonths: any;
  tonoofyears: any;
  tonoofdays: any;
  tonoofmonths: any;
  mininstalamunt: any;
  maxinstalamunt: any;
  depositamnt: any;
  maturityamnt: any;
  Interestpayouts: any;
  showvalue: any;
  interetsFromTo: boolean = false;
  MembertypeDetails: any;
  AccountConfigErrorMessages: any;

  public headerCells: any = {
    textAlign: 'center'
  };

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  showcommissionpayout: boolean;
  tdsshow: boolean;
  forFixed: boolean;
  forPercentage: boolean;

  Tdssection: any;
  TDSsectiondetails: any = [];
  showmultipesof: boolean = false;
  compoundinginterest: boolean = false;
  forPenaltyFixed: boolean = false;
  forPenaltyPercentage: boolean = true;
  showpenalty: boolean = false;
  constructor(private fb: FormBuilder,
    private _CommonService: CommonService,
    private _fdrdservice: FdRdServiceService,
    private _loanmasterservice: LoansmasterService, private _TdsService: TdsdetailsService) {
    // this.loadFiDatas();
    this.allDepositeData = this.allDepositeData.bind(this);
    this.allConfigData = this.allConfigData.bind(this);
  }

  ngOnInit() {
    this.onMaturity = 'On Maturity';
    this.showupdatetable = false;
    this.showInterestRate = true;
    this.interetsFromTo= false;
    this.DepositGridData=[];
    this.AccountConfigErrorMessages = {};
    this.validationformin = false;
    this.showvalue = true;
    this.showrate = true;
    this.tdsshow = true;
    this.showcommissionpayout = false;
    this.forFixed = false;
    this.forPercentage = true;
    this.showmultipesof = false;
    this.multiplesstatus=false;
    this.clearvalidations();
    // this.Rdconfigurationform = new FormGroup({
    //   pMembertype: new FormControl(''),
    //   pApplicanttype:new FormControl(''),
    //   ptypeofoperation: new FormControl(this._CommonService.pCreatedby),
    //   pMembertypeid:new FormControl(''),
    //   lstRdConfigartionDetails: new FormGroup({
    //     pInterestcaltype: new FormControl('0'),
    //     pInterestamount: new FormControl('0'),
    //     pDepositamount: new FormControl('0'),
    //     pMaturityamount: new FormControl('0'),
    //     pTenure: new FormControl('0'),
    //     pTenuremode: new FormControl('0'),
    //     pTypeofOperation: new FormControl(this._CommonService.ptypeofoperation),
    //     pPayindenomination:new FormControl('0'),
    //     pInterestpayuot: new FormControl('')
    //   }),  
    //   "lstRdConfigartionDetails": new FormGroup({
    //     "precordid": new FormControl('0'),
    //     "pRdcalucationmode": new FormControl(''),
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

    this.Rdconfigurationform = new FormGroup({
    
      pMembertype: new FormControl(''),
      pApplicanttype: new FormControl(''),
      pMembertypeid: new FormControl(''),
      pRdconfigid: new FormControl(''),
      pRdname: new FormControl(''),
      forType: new FormControl('Interest rate'),
      pRdnamecode: new FormControl(''),
      pCreatedby: new FormControl(this._CommonService.pCreatedby),
      pStatusid: new FormControl(1),
      pStatusname: new FormControl(''),
      pEffectfromdate: new FormControl(''),
      pEffecttodate: new FormControl(''),
      ptypeofoperation: new FormControl(this._CommonService.ptypeofoperation),

      lstRdConfigartionDetails: new FormGroup({
        precordid: new FormControl('0'),
        pMembertypeid: new FormControl(''),
        pMembertype: new FormControl(''),
        pApplicanttype: new FormControl(''),
        pRdcalucationmode: new FormControl('Interest rate'),
        pMininstalmentamount: new FormControl(''),
        pMaxinstalmentamount: new FormControl(''),
        pInstalmentpayin: new FormControl(''),
        pInvestmentperiodfrom: new FormControl(''),
        pInvestmentperiodto: new FormControl(''),
        pfromnoofyears: new FormControl(''),
        pfromnoofmonths: new FormControl(''),
        pfromnoofdays: new FormControl(''),
        ptonoofyears: new FormControl(''),
        ptonoofmonths: new FormControl(''),
        ptonoofdays: new FormControl(''),
        pInterestpayuot: new FormControl(''),
        pInteresttype: new FormControl('Simple Interest'),
        pCompoundInteresttype: new FormControl(''),
        pInterestratefrom: new FormControl('',[Validators.required]),
        pInterestrateto: new FormControl('',[Validators.required]),
        pMultiplesofamount: new FormControl(0),
        pValueper100: new FormControl('0'),
        pTenure: new FormControl(''),
        pTenuremode: new FormControl(''),
        pPayindenomination: new FormControl(''),
        pInterestamount: new FormControl(''),
        pDepositamount: new FormControl(''),
        pMaturityamount: new FormControl(''),
        pReferralcommissiontype: new FormControl('percentage'),
        pCommissionValue: new FormControl(0),
        pIstdsapplicable: new FormControl(true),
        pTdssection: new FormControl(),
        pTdsaccountid: new FormControl(''),
        pTdspercentage: new FormControl(0),
        pIsreferralcommissionapplicable: new FormControl(false),
        pIspenaltyapplicable: new FormControl(false),
        pPenaltytype: new FormControl(''),
        pPenaltyvalue: new FormControl(0),
        pTypeofOperation: new FormControl(this._CommonService.ptypeofoperation)
      })
    });
    /**------> Get member details--------- */
    this._CommonService.Getmemberdetails('member').subscribe(json => {
      if (json) {
        this.MembertypeDetails = json;
      }
    });
    /**------> Get Applicant type details */
    this.getApplicantTypes("Individual");
    /**------> Get Loan Installement pay-in's----------- */
    this.GetInterestPayout();
    this.BlurEventAllControll(this.Rdconfigurationform);

    this.getTDSsectiondetails();
  }
clearvalidations(){
  debugger;
  this.forFromToFlag = true;
  this.globalPayinFlag = true;
  this.globalTensureFlag= true;
  this.globalTensureModeFlag = true;
  this.globalInterestFlag = true;
  this.globalDepositeAmountFlag = true;
  this.globalMinAmountFlag= true;
  this.globalMaxAmountFlag = true;
  this.forInterestFromTo = true;
  this.globalInstallmentFlag = true;
  this.memberTypeError = false;
  this.applicantTypeError= false;
}

  notApplicable(event) {
    debugger;
    this.AccountConfigErrorMessages.pCommissionValue=null;
      this.forFixed = false;
      this.forPercentage = true;
    if (event.target.checked) {
      //let applicable=true
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIsreferralcommissionapplicable.value = true;
      // this.tds=true;
      // this.validatetds(this.tds)
      //this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pinterestamount 
      this.showcommissionpayout = true;
      this.tdsshow = true
    }
    else {
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIsreferralcommissionapplicable.value = false;
      // this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIstdsapplicable.value=false;
      //this.tdsshow=false
      this.showcommissionpayout = false;
      this.tdsshow = false
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pReferralcommissiontype.value = 'percentage'
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pTdspercentage.value = 0;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pCommissionValue.value = 0;
      //  this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pTdssection.value = 0;
    }
  }


  notApplicablePenalty(event) {
    debugger;
    //this.AccountConfigErrorMessages.pPenaltyValue=null;
      this.forPenaltyFixed = false;
      this.forPenaltyPercentage = true;
    if (event.target.checked) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIspenaltyapplicable.setValue(true);
      //<FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIspenaltyapplicable.setValue(true); 
      this.showpenalty = true;
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltytype.setValue('percentage');
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.setValue('');
      // <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.setValidators(Validators.required);
      // <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.updateValueAndValidity();
    }
    else {
       this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIspenaltyapplicable.setValue(false);
     // <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pIspenaltyapplicable.setValue(false);
      this.showpenalty = false;
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltytype.setValue('percentage');
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.setValue(0);
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.clearValidators();
      <FormGroup>this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.updateValueAndValidity();
    }
  }

  moveCursorToEnd(input) {
    var originalValue = input.val();
    input.val('');
    input.blur().focus().val(originalValue);
  }

  /**--------(Start)----- To load Initial form data --------(Start)----------------- */
  loadInitData() {
    debugger;
    let referalapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIsreferralcommissionapplicable;
    let commissionvalue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue;

    let tds = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIstdsapplicable;
    let tdssection = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTdssection;
    let Referralcommissiontype = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pReferralcommissiontype;
        let membertypeid=this.Rdconfigurationform.controls.pMembertypeid.value;
    let applicationtype=this.Rdconfigurationform.controls.pApplicanttype.value;
   // let membertype=(this.Rdconfigurationform.controls.pMembertype.value)[0].toString();
   let pPenaltytype = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltytype;
    this.Rdconfigurationform = new FormGroup({
        pApplicanttype: new FormControl(applicationtype),
       pMembertypeid: new FormControl(membertypeid),
       pRdconfigid: new FormControl(''),
      forType: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
      pRdname: new FormControl(''),
      pRdnamecode: new FormControl(''),
      pCreatedby: new FormControl(this._CommonService.pCreatedby),
      pStatusid: new FormControl(''),
      pStatusname: new FormControl(''),
      pEffectfromdate: new FormControl(''),
      pEffecttodate: new FormControl(''),
      ptypeofoperation: new FormControl(this._CommonService.ptypeofoperation),
      lstRdConfigartionDetails: new FormGroup({
        precordid: new FormControl('0'),
        pMembertypeid: new FormControl(membertypeid),
        pApplicanttype: new FormControl(applicationtype),
        pRdcalucationmode: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
        pMininstalmentamount: new FormControl(''),
        pMaxinstalmentamount: new FormControl(''),
        pInstalmentpayin: new FormControl(''),
        pInvestmentperiodfrom: new FormControl(''),
        pInvestmentperiodto: new FormControl(''),
        pInterestpayuot: new FormControl(''),
        pMultiplesofamount: new FormControl(0),
        pInteresttype: new FormControl('Simple Interest'),
        pReferralcommissiontype: new FormControl('percentage'),
        pIsreferralcommissionapplicable: new FormControl(false),
        pCommissionValue: new FormControl(0),
        pIstdsapplicable: new FormControl(tds),
        pTdssection: new FormControl(tdssection),
        pTdsaccountid: new FormControl(''),
        pTdspercentage: new FormControl(0),
        pCompoundInteresttype: new FormControl(''),
        pInterestratefrom: new FormControl('', [Validators.required]),
        pInterestrateto: new FormControl('', [Validators.required]),
        pfromnoofyears: new FormControl(''),
        pfromnoofmonths: new FormControl(''),
        pfromnoofdays: new FormControl(''),
        ptonoofyears: new FormControl(''),
        ptonoofmonths: new FormControl(''),
        ptonoofdays: new FormControl(''),
        pValueper100: new FormControl('0'),
        pTenure: new FormControl(''),
        pTenuremode: new FormControl(''),
        pPayindenomination: new FormControl(''),
        pInterestamount: new FormControl(''),
        pDepositamount: new FormControl(''),
        pMaturityamount: new FormControl(''),
        pIspenaltyapplicable: new FormControl(false),
        pPenaltytype: new FormControl(''),
        pPenaltyvalue: new FormControl(0),
        pTypeofOperation: new FormControl(this._CommonService.ptypeofoperation)
      })

      
    });
      if (referalapplicable == true) {
      this.showcommissionpayout = true;
      this.tdsshow = true;
    }
    else {
      this.showcommissionpayout = false;
      this.tdsshow = true;
    }
    if (pPenaltytype == true) {
      this.showpenalty = true;
    } else {
      this.showpenalty = false;
    }
      this.showcommissionpayout = false;
      this.forFixed = false;
      this.forPercentage = true;
      this.tdsshow = false
      this.showmultipesof = false;
      this.investPeriodFromFlag=true;
      this.investPeriodToFlag=true;
      this.multiplesstatus=false;
      this.clearvalidations();
     // this.Valueper100 = false;
      this.Intrestrate = false;
      this.showvalue=true;
      this.showrate=true;
      this.AccountConfigErrorMessages={};
  }
  multipesof(event) {
    debugger;
     this.AccountConfigErrorMessages.pMultiplesofamount='';
    if (event.target.checked) {
      this.showmultipesof = true;
      this.multiplesstatus=true;
    }
    else {
      this.showmultipesof = false;
      this.multiplesstatus=false;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue(0);
    }
  }

  Multiplesofchanges(event) {
    debugger;
    if(event.target.value){
      if(event.target.value==0){
         this._CommonService.showWarningMessage("Multiples Of Must be Greater than Zero.");
         this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue("");
         this.AccountConfigErrorMessages.pMultiplesofamount='Multiples Of Required.';
         return;
      }
      this.AccountConfigErrorMessages.pMultiplesofamount='';
    this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue(event.target.value);
    let amount = this._CommonService.removeCommasForEntredNumber(event.target.value)
    let multiple = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.value;
    if (amount > this.maxinstalamunt) {
      this._CommonService.showWarningMessage("Should not be greater than Max Deposit Amount")
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue("");
      this.AccountConfigErrorMessages.pMultiplesofamount='Multiples of Required.';
    }
    }
    else{
       this.AccountConfigErrorMessages.pMultiplesofamount='Multiples of Required.';
    }

  }
  getTDSsectiondetails() {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
          console.log("tds details", this.TDSsectiondetails[0].pTdsSection);
          this.Tdssection = "194H"

          this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pTdssection.setValue(this.Tdssection)
          //this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pTdsSection.setValue(this.Tdssection);
          // this.Rdconfigurationform.controls.lstRdConfigartionDetails.pTdsSection.setValue


        }
      },
      (error) => {

        this._CommonService.showErrorMessage(error);
      }
    );
  }
  /**--------(End)----- To load Initial form data --------(End)----------------- */

  /**-------(Start)---- It will call when we are clicking on interest rate button--------(Start)--- */
  interestratechecked(event) {
    if (event.target.checked) {
       let Interestratefrom = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestratefrom'];
      let pInterestrateto = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestrateto'];
      // let Valueper100 = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pValueper100'];

      Interestratefrom.setValidators(Validators.required);
      Interestratefrom.updateValueAndValidity();
      pInterestrateto.setValidators(Validators.required);
      pInterestrateto.updateValueAndValidity();
      // Valueper100.setValidators(Validators.required);
      // Valueper100.updateValueAndValidity();
       this.AccountConfigErrorMessages.pInterestratefrom = "";
      this.AccountConfigErrorMessages.pInterestrateto = "";
      // this.AccountConfigErrorMessages.pValueper100 = "";
      this.showInterestRate = true;
      this.showupdatetable = false;
    }
    else{
      this.showInterestRate = false;
      this.showupdatetable = true;
    }
   // this.pApplicanttype = null;
   // this.pMembertypeid = null;
   // this.refreshData();
   this.loadInitData();
  }
  /**-------(End)---- It will call when we are clicking on interest rate button--------(End)--- */
  onCommissionChange(event) {
    debugger
    this.AccountConfigErrorMessages.pCommissionValue=null;
    console.log("event taeget : ", event.target.value);
    let type = event.target.value;
    if (type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
        pCommissionValue: '',
        pReferralcommissiontype: type
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
        pCommissionValue: '',
        pReferralcommissiontype: type
      })
    }
  }

  onPenaltyChange(event) {
    debugger
    this.AccountConfigErrorMessages.pPenaltyvalue=null;
    let type = event.target.value;
    if (type == 'fixed') {
      this.forPenaltyFixed = true;
      this.forPenaltyPercentage = false;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
        pPenaltyvalue: '',
        pPenaltytype: type
      })
    }
    else {
      this.forPenaltyFixed = false;
      this.forPenaltyPercentage = true;
      this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
        pPenaltyvalue: '',
        pPenaltytype: type
      })
    }
  }


  updatetablechecked(event) {
    debugger
    if (event.target.checked) {
            let Interestratefrom = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestratefrom'];
      let pInterestrateto = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestrateto'];
      // let Valueper100 = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pValueper100'];

      Interestratefrom.clearValidators();
      Interestratefrom.updateValueAndValidity();
      pInterestrateto.clearValidators();
      pInterestrateto.updateValueAndValidity();
      // Valueper100.clearValidators();
      // Valueper100.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestratefrom = "";
      this.AccountConfigErrorMessages.pInterestrateto = "";
      // this.AccountConfigErrorMessages.pValueper100 = "";
      this.showInterestRate = false;
      this.showupdatetable = true
    }
    else{
     this.showInterestRate = true;
      this.showupdatetable = false;
    }
    // this.pApplicanttype = null;
    // this.pMembertypeid = null;
   // this.refreshData();
   this.loadInitData();
   this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInteresttype='';
  }
  // intrestratechecked(event) {
  //   debugger;
  //  this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
  //     pInterestratefrom:'',
  //     pInterestrateto:'',
  //     pValueper100:''
  //   })
  //   if (event.target.checked) {
  //     this.showvalue = false;
  //     this.showrate = true;
  //   }
  //   else {
  //     this.showvalue = true;
  //     this.showrate = false;
  //   }
  // }
  RdConfigartionDetails() {
    return this.fb.group
      ({

      })
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
  InvestmentPeriodToChange(event) {
    debugger;
    let InvestmentPeriodTo = event.target.value;
    if (!isNullOrUndefined(InvestmentPeriodTo) || !isNullOrUndefined(this.investto)) {
      this.investPeriodToFlag = true;
    }
    else {
      this.investPeriodToFlag = false;
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
  //   this.Rdconfigurationform.controls.pMembertype.setValue(MemberTypename);
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
  Payindenomination(event) {
    let payInId = document.getElementById('payIn');
    payInId.focus()
    let eneteredPayin = event.target.value;
    if (eneteredPayin != null && eneteredPayin != '' && eneteredPayin != undefined) {
      this.globalPayinFlag = true;
    }
    else {
      this.globalPayinFlag = false;
    }
    this.calculationofdepositamount()
  }
  calculationofdepositamount() {
    debugger
    this.payinamnt = 0;
    this.tenureamnt = 0;
    this.maturityamnt = 0;
    let tamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pTenure.value
    let payamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPayindenomination.value
    let intrstamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInterestamount.value
    if (isNullOrEmptyString(payamount)) {
      payamount = 0;
    }
    else {
      this.payinamnt = payamount ? parseFloat(payamount.toString().replace(/,/g, "")) : 0;
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

    this.depositamnt = Math.round((this.payinamnt * this.tenureamnt))
    this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pDepositamount.setValue(this._CommonService.currencyformat(this.depositamnt))

    this.maturityamnt = Math.round((this.depositamnt + this.maturityamnt))
    this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMaturityamount.setValue(this._CommonService.currencyformat(this.maturityamnt))

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
  //   // debugger
  //   //  this.DepositGridData.push(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value)

  //   //  this.DepositGridData.filter(item => {
  //   //   item.pMembertype =this.Rdconfigurationform.controls.pMembertype.value
  //   //   item.pMembertypeid=this.Rdconfigurationform.controls.pMembertypeid.value
  //   //   item.pApplicanttype=this.Rdconfigurationform.controls.pApplicanttype.value
  //   // })

  //   if (this.validateAddSavingAccountConfiguration()) {
  //     this.Rdconfigurationform.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
  //     if (this.membertype.length != 0 && this.applicanttype.length != 0) {
  //       // this.membertype.reduce((acc, memberitem) => {
  //       //   for (let i = 0; i < this.applicanttype.length; i++) {
  //       //     debugger;
  //       //     const Checkexistcount = this.DepositGridData.filter(s => s.pMembertype == memberitem.membertypename && s.pApplicanttype == this.applicanttype[i].applicanttype).length;
  //       //     if (Checkexistcount == 0) {
  //       //       // console.log("memberitem : ",memberitem);
  //       //       // console.log("this.applicanttype[i] : ",this.applicanttype[i]);
  //       //     this.Rdconfigurationform.controls.pMembertypeid.setValue(memberitem.membertypeid);
  //       //     this.Rdconfigurationform.controls.pMembertype.setValue(memberitem.membertypename);
  //       //     this.Rdconfigurationform.controls.pApplicanttype.setValue(this.applicanttype[i].applicanttype);
  //       //       this.DepositGridData.push(Object.assign(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value));
  //       //       // console.log("this.DepositGridData : ",this.DepositGridData);

  //       //     }
  //       //   }
  //       // }, []);
  //       let tempArr = [];
  //       console.log("this.DepositGridData : 111222 ",JSON.parse(JSON.stringify(this.DepositGridData)));

  //       for (let k = 0; k < this.membertype.length; k++) {
  //        for (let p = 0; p < this.applicanttype.length; p++) {
  //         console.log("this.membertype[k] : ",this.membertype[k]);

  //          let obj1 = JSON.parse(JSON.stringify({pMembertype:this.membertype[k].membertypename,pMembertypeid:this.membertype[k].membertypeid}));           
  //          let obj2 = JSON.parse(JSON.stringify({pApplicanttype:this.applicanttype[p].applicanttype}));
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount.toString().replace(/,/g,""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount.toString().replace(/,/g,""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount.toString().replace(/,/g,""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure.toString().replace(/,/g,""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination.toString().replace(/,/g,""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = this.onMaturity;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100.toString().replace(/,/g,""))) : 0;

  //         if(this.DepositGridData && this.DepositGridData.length > 0) {
  //           let count = 0;
  //           for (let i = 0; i < this.DepositGridData.length; i++) {
  //             if(this.DepositGridData[i].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //             this.DepositGridData[i].pMembertype == (this.membertype[k].membertypename) &&
  //             Number(this.DepositGridData[i].pInterestamount.toString().replace(/,/g,"")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount.toString().replace(/,/g,"")) &&
  //             (this.DepositGridData[i].pTenuremode) == (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenuremode) &&
  //             Number(this.DepositGridData[i].pPayindenomination.toString().replace(/,/g,"")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination.toString().replace(/,/g,""))  
  //             ) {
  //               this._CommonService.showWarningMessage("Already existed");
  //               return;
  //             }       
  //             else {
  //               count++;
  //             }   
  //           }
  //           if(count == this.DepositGridData.length) {
  //             this.DepositGridData.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
  //           }
  //         }
  //         else {
  //           this.DepositGridData.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
  //         }
  //         // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pRdcalucationmode = 'TABLE';
  //         // this.Rdcongiggriddata.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
  //        }          
  //       // }
  //       console.log("this.DepositGridData 1 : ",this.DepositGridData);
  //       // this.DepositGridData = tempArr;
  //       debugger;

  //     }
  //     this.gridViewDeposite = [];
  //     this.gridViewDeposite = this.DepositGridData;
  //     this.loadInitData();
  //     this.AccountConfigErrorMessages = {};
  //     this.BlurEventAllControll(this.Rdconfigurationform);
  //   }
  // }

  // }



  addDataToTable() {
    debugger
    if (this.checkValidations(this.Rdconfigurationform, true)) {
      debugger
      if (this.pMembertypeid && this.pApplicanttype) {
        this.memberTypeError = false;
        this.applicantTypeError = false;
        if (this.showupdatetable) {

          let tenureFlag = true;
          let tenureModeFlag = true;
          let payinFlag = true;
          let interestAmountFlag = true;
          // this.Rdconfigurationform.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);

          let tensure = this.Rdconfigurationform.value.lstRdConfigartionDetails.pTenure;
          tensure = tensure ? tensure.toString().replace(/,/g, "") : 0;
          if (tensure == 0) {
            // this._CommonService.showWarningMessage("Total Tenure should be greater that zero");
            tenureFlag = false;
            // return;
          }
          else {
            tenureFlag = true;
          }
          this.globalTensureFlag = tenureFlag;
          let tensureMode = this.Rdconfigurationform.value.lstRdConfigartionDetails.pTenuremode;
          if (tensureMode == '') {
            // this._CommonService.showWarningMessage("Please select Tenure Mode");
            tenureModeFlag = false;
            // return;
          }
          else {
            tenureModeFlag = true;
          }
          this.globalTensureModeFlag = tenureModeFlag;
          let pPayin = this.Rdconfigurationform.value.lstRdConfigartionDetails.pPayindenomination;
          pPayin = pPayin ? pPayin.toString().replace(/,/g, "") : 0;
          if (pPayin == 0) {
            // this._CommonService.showWarningMessage("Pay-In Denomination should be greater that zero");
            payinFlag = false;
            // return;
          }
          else {
            payinFlag = true;
          }
          this.globalPayinFlag = payinFlag;
          let interset = this.Rdconfigurationform.value.lstRdConfigartionDetails.pInterestamount;
          interset = interset ? interset.toString().replace(/,/g, "") : 0;
          if (interset != '' && interset != null && interset != undefined) {
            // this._CommonService.showWarningMessage("Interest Amount should be greater that zero");
            interestAmountFlag = true;
            // return;
          }
          else {
            interestAmountFlag = false;
          }
          let referalapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIsreferralcommissionapplicable;
          if(referalapplicable){
            let commissionvalue=this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue;
           if(commissionvalue==null || commissionvalue=='' || commissionvalue==0){
              this._CommonService.showWarningMessage("Commission Payout Must be Greater Than Zero.");
              this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pCommissionValue.setValue('');
              this.AccountConfigErrorMessages.pCommissionValue="Commission Payout Required";
              return;
            }
          }
          this.globalInterestFlag = interestAmountFlag;
          if (tenureFlag && tenureModeFlag && interestAmountFlag && payinFlag) {
            if (this.membertype.length != 0 && this.applicanttype.length != 0) {
              let tempArr = [];
             
              for (let k = 0; k < this.membertype.length; k++) {
                for (let p = 0; p < this.applicanttype.length; p++) {

                  let obj1 = JSON.parse(JSON.stringify({ pMembertype: this.membertype[k].membertypename, pMembertypeid: this.membertype[k].membertypeid }));
                  let obj2 = JSON.parse(JSON.stringify({ pApplicanttype: this.applicanttype[p].applicanttype }));
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pDepositamount.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaturityamount.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue.toString().replace(/,/g, ""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltyvalue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltyvalue ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltyvalue.toString().replace(/,/g, ""))) : 0;
                  
                  // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination.toString().replace(/,/g,""))) : 0;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = this.onMaturity;
                  this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInteresttype='';


                  let eneteredValue: string = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot;
                  eneteredValue = eneteredValue.trim();

                  if (eneteredValue) {
                    if (eneteredValue.charAt(eneteredValue.length - 1) == ',') {
                      eneteredValue = eneteredValue.substr(0, eneteredValue.length - 1);
                    }
                    this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = eneteredValue;
                  }
                  if (this.DepositGridData && this.DepositGridData.length > 0) {



                    if (this.showupdatetable) {
                      let countForCheckInterest = 0;
                      let countFroCheckTable = 0;
                      for (let g = 0; g < this.DepositGridData.length; g++) {


                        if (this.DepositGridData[g].pRdcalucationmode != 'TABLE') {
                          if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                            this._CommonService.showWarningMessage("Already existed");
                            return;
                          }
                          else {
                            countForCheckInterest++;
                          }
                        }
                        else {
                          //as per KT session on 17-05-2021(srinivas sir) ,pInterestamount is replaced with pPayindenomination in below conditon for inserting records in grid//
                         let intamountlst=Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination.toString().replace(/,/g, ""));
                         let intamtgrd=Number(this.DepositGridData[g].pPayindenomination.toString().replace(/,/g, ""))
                         let tenuregrd=Number(this.DepositGridData[g].pTenure.toString().replace(/,/g, ""));
                         let tenurelist=Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure.toString().replace(/,/g, ""));

                          if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                            Number(this.DepositGridData[g].pPayindenomination.toString().replace(/,/g, "")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPayindenomination.toString().replace(/,/g, "")) &&
                            Number(this.DepositGridData[g].pTenure.toString().replace(/,/g, "")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure.toString().replace(/,/g, "")) &&
                            (this.DepositGridData[g].pTenuremode) == (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenuremode)) {
                            this._CommonService.showWarningMessage("Already existed");
                            return;
                          }
                          else {
                            countForCheckInterest++;
                          }
                        }
                      }

                      if (countForCheckInterest == this.DepositGridData.length) {
                        this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 })
                      }
                    }
                    else {
                      let countForCheckInterest = 0;
                      let countFroCheckTable = 0;
                      for (let g = 0; g < this.DepositGridData.length; g++) {
                        if (this.DepositGridData[g].pRdcalucationmode == 'TABLE') {
                          if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                            this._CommonService.showWarningMessage("Already existed");
                            return;
                          }
                          else {
                            countForCheckInterest++;
                          }
                        }
                        else {
                          let enteredPayin: string = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInstalmentpayin;
                          enteredPayin = enteredPayin.trim();
                          let entered1 = (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
                          let entered2 = (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
                          let previous1 = this.DepositGridData[g].pMininstalmentamount ? Number(this.DepositGridData[g].pMininstalmentamount.toString().replace(/,/g, "")) : 0;
                          let previous2 = this.DepositGridData[g].pMaxinstalmentamount ? Number(this.DepositGridData[g].pMaxinstalmentamount.toString().replace(/,/g, "")) : 0;
                          if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                            this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                            this.validateRange(entered1, entered2, previous1, previous2)) {
                            this._CommonService.showWarningMessage("Already existed");
                            return;
                          }
                          else {
                            countForCheckInterest++;
                          }
                        }
                      }
                      if (countForCheckInterest == this.DepositGridData.length) {
                        this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 })
                      }
                    }


                  }
                  else {
                    this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 })
                  }
                  // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pFDcalucationmode = 'TABLE';
                  // this.fdcongiggriddata.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
                }
                // }
                // this.DepositGridData = tempArr;

              }
              this.gridViewDeposite = [];
              this.gridViewDeposite = this.DepositGridData;
              this.refreshData();
              this.showCompoundInterest = false;
              this.AccountConfigErrorMessages = {};
              this.BlurEventAllControll(this.Rdconfigurationform);
            }
          }
          else {
            if (tenureFlag == false) {
              this.globalTensureFlag = false;
            }
            if (tenureModeFlag == false) {
              this.globalTensureModeFlag = false;
            }
            if (payinFlag == false) {
              this.globalPayinFlag = false;
            }
            if (interestAmountFlag == false) {
              this.globalInterestFlag = false;
            }
          }
        }
        else {
          //   if (!isNullOrEmptyString(this.investfrom) && !isNullOrEmptyString(this.investto)) {
          // if (this.validateRDConfigDetails()){
          if (this.validationformin == false) {
            if (this.forInterestFromTo) {
              let maxAmountFlag = true;
              let minAmountFlag = true;
              let instaPayinFlag = true;
              let pMininstalmentamount = this.Rdconfigurationform.value.lstRdConfigartionDetails.pMininstalmentamount;
              pMininstalmentamount = pMininstalmentamount ? Number(pMininstalmentamount.toString().replace(/,/g, "")) : 0;

              if (pMininstalmentamount == 0) {
                minAmountFlag = false;
              }
              else {
                minAmountFlag = true;
              }
              this.globalMinAmountFlag = minAmountFlag;
              let pMaxinstalmentamount = this.Rdconfigurationform.value.lstRdConfigartionDetails.pMaxinstalmentamount;
              pMaxinstalmentamount = pMaxinstalmentamount ? Number(pMaxinstalmentamount.toString().replace(/,/g, "")) : 0;

              if (pMaxinstalmentamount == 0) {
                maxAmountFlag = false;
              }
              else {
                maxAmountFlag = true;
              }
              this.globalMaxAmountFlag = maxAmountFlag;
              let pInstalmentpayin = this.Rdconfigurationform.value.lstRdConfigartionDetails.pInstalmentpayin;
              if (pInstalmentpayin == '') {
                // this._CommonService.showWarningMessage("Please select Tenure Mode");
                instaPayinFlag = false;
                // return;
              }
              else {
                instaPayinFlag = true;
              }
               let referalapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIsreferralcommissionapplicable;
          if(referalapplicable){
            let commissionvalue=this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue;
            if(commissionvalue==null || commissionvalue=='' || commissionvalue==0){
              this._CommonService.showWarningMessage("Commission Payout Must be Greater Than Zero.");
             this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pCommissionValue.setValue('');
              this.AccountConfigErrorMessages.pCommissionValue="Commission Payout Required";
              return;
            }

          }
          let pIspenaltyapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIspenaltyapplicable;
          if(pIspenaltyapplicable){
            let pPenaltyvalue=this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltyvalue;
            if(pPenaltyvalue==null || pPenaltyvalue=='' || pPenaltyvalue==0){
              this._CommonService.showWarningMessage("Penalty Value Must be Greater Than Zero.");
             this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pPenaltyvalue.setValue('');
              this.AccountConfigErrorMessages.pPenaltyvalue="Penalty Value Required";
              return;
            }

          }

          
          if(this.showmultipesof==true){
             let Multiplesofamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMultiplesofamount;
            if(Multiplesofamount==null || Multiplesofamount=='' || Multiplesofamount==0){
              this._CommonService.showWarningMessage("Multiples of Must be Greater Than Zero.");
             this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue('');
              this.AccountConfigErrorMessages.pMultiplesofamount="Multiples of Required";
              return;
            }
          }
              this.globalInstallmentFlag = instaPayinFlag;
              if (minAmountFlag && maxAmountFlag && instaPayinFlag) {
                if (this.forFromToFlag == true) {
                  if (this.membertype.length != 0 && this.applicanttype.length != 0) {
                     if (!isNullOrEmptyString(this.investfrom) && !isNullOrEmptyString(this.investto)) {
                    if (this.validateRDConfigDetails()){
                    let tempArr = [];
                    for (let k = 0; k < this.membertype.length; k++) {
                      for (let p = 0; p < this.applicanttype.length; p++) {
                        let obj1 = JSON.parse(JSON.stringify({ pMembertype: this.membertype[k].membertypename, pMembertypeid: this.membertype[k].membertypeid }));
                        let obj2 = JSON.parse(JSON.stringify({ pApplicanttype: this.applicanttype[p].applicanttype }));
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount ? this._CommonService.currencyformat(((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount.toString()).replace(/,/g, ""))) : 0;
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount ? this._CommonService.currencyformat(((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount.toString()).replace(/,/g, ""))) : 0;
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100 ? this._CommonService.currencyformat((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100.toString().replace(/,/g, ""))) : 0;
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = this.onMaturity;
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom : 0;
                        this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto ? this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto : 0;

                        let eneteredValue: string = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot;
                        eneteredValue = eneteredValue.trim();

                        let enteredPayin: string = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInstalmentpayin;
                        enteredPayin = enteredPayin.trim();

                        if (eneteredValue) {
                          if (eneteredValue.charAt(eneteredValue.length - 1) == ',') {
                            eneteredValue = eneteredValue.substr(0, eneteredValue.length - 1);
                          }
                          this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = eneteredValue;
                        }
                        if (this.DepositGridData && this.DepositGridData.length > 0) {
                          if (this.showupdatetable) {

                            let countForCheckInterest = 0;
                            let countFroCheckTable = 0;
                            for (let g = 0; g < this.DepositGridData.length; g++) {
                              if (this.DepositGridData[g].pRdcalucationmode != 'TABLE') {
                                if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                                  this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                                  this._CommonService.showWarningMessage("Already existed");
                                  return;
                                }
                                else {
                                  countForCheckInterest++;
                                }
                              }
                              else {
                                if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                                  this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                                  Number(this.DepositGridData[g].pInterestamount.toString().replace(/,/g, "")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestamount.toString().replace(/,/g, "")) &&
                                  Number(this.DepositGridData[g].pTenure.toString().replace(/,/g, "")) == Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenure.toString().replace(/,/g, "")) &&
                                  (this.DepositGridData[g].pTenuremode) == (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTenuremode)) {
                                  this._CommonService.showWarningMessage("Already existed");
                                  return;
                                }
                                else {
                                  countForCheckInterest++;
                                }
                              }
                            }
                            if (countForCheckInterest == this.DepositGridData.length) {
                              this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 });
                                // this.Valueper100 = false;
                            this.Intrestrate = false;
                            }
                            // if(countFroCheckTable == this.DepositGridData.length) {
                            //   this.DepositGridData.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
                            // }
                          }
                          else {
                            let countForCheckInterest = 0;
                            let countFroCheckTable = 0;
                            for (let g = 0; g < this.DepositGridData.length; g++) {
                              if (this.DepositGridData[g].pRdcalucationmode == 'TABLE') {

                                if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                                  this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename)) {
                                  this._CommonService.showWarningMessage("Already existed");
                                  return;
                                }
                                else {
                                  countForCheckInterest++;
                                }
                              }
                              else {
                                let enteredPayin: string = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInstalmentpayin;
                                enteredPayin = enteredPayin.trim();
                                let entered1 = (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount.toString().replace(/,/g, "")) : 0)
                                let entered2 = (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount.toString().replace(/,/g, "")) : 0)
                                let previous1 = this.DepositGridData[g].pMininstalmentamount ? Number(this.DepositGridData[g].pMininstalmentamount.toString().replace(/,/g, "")) : 0;
                                let previous2 = this.DepositGridData[g].pMaxinstalmentamount ? Number(this.DepositGridData[g].pMaxinstalmentamount.toString().replace(/,/g, "")) : 0;
                                if (this.DepositGridData[g].pApplicanttype == (this.applicanttype[p].applicanttype) &&
                                  this.DepositGridData[g].pMembertype == (this.membertype[k].membertypename) &&
                                  this.validateRange(entered1, entered2, previous1, previous2)
                                ) {
                                  this._CommonService.showWarningMessage("Already existed");
                                  return;
                                }
                                else {
                                  countForCheckInterest++;
                                }
                              }
                            }
                            if (countForCheckInterest == this.DepositGridData.length) {
                              this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 });
                              this.Intrestrate = false;
                            }
                          }


                        }
                        else {
                          this.DepositGridData.push({ ...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value, ...obj1, ...obj2 })
                          this.Intrestrate = false;
                        }
                      }
                    }
                    // this.DepositGridData = tempArr;
                    this.gridViewDeposite = [];
                    this.gridViewDeposite = this.DepositGridData;
                     this.Intrestrate = false;
                    //this.loadInitData();
                    this.refreshData();
                    this.showCompoundInterest = false;
                    this.AccountConfigErrorMessages = {};
                    this.BlurEventAllControll(this.Rdconfigurationform);
                    this.pMembertypeid = null;
                    this.pApplicanttype = null;
                   }
                 }
                 else{
                  this.investPeriodFromFlag =false;
                  this.investPeriodToFlag =false;
                 }
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
          }//MAX CHECK
      //   }//INTEREST RATE
 
      // }//INVEST PERIOD
      // else {
      //   this.investPeriodFromFlag =false;
      //   this.investPeriodToFlag =false;
      // }
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
PenaltyValue_change(event){
  debugger;
  let pPenaltyvalue=event.target.value;
  if(pPenaltyvalue!=''){
    this.AccountConfigErrorMessages.pPenaltyvalue=null;
  }
  else{
    this.AccountConfigErrorMessages.pPenaltyvalue="Penalty Value Required";
  }
}
  // adddatatogrid()
  // {
  //   //  debugger;
  //   //  this.Rdcongiggriddata.push(this.Rdconfigurationform.controls.lstRdConfigartionDetails.value)
  //   //  this.Rdcongiggriddata.filter(item => {
  //   //   item.pMembertype =this.Rdconfigurationform.controls.pMembertype.value
  //   //   item.pMembertypeid=this.Rdconfigurationform.controls.pMembertypeid.value
  //   //   item.pApplicanttype=this.Rdconfigurationform.controls.pApplicanttype.value
  //   // })
  //   if (this.validateAddSavingAccountConfiguration()) {
  //     this.Rdconfigurationform.controls.ptypeofoperation.setValue(this._CommonService.pCreatedby);
  //     if (this.membertype.length != 0 && this.applicanttype.length != 0) {

  //       let tempArr = [];
  //       for (let k = 0; k < this.membertype.length; k++) {
  //        for (let p = 0; p < this.applicanttype.length; p++) {
  //          let obj1 = JSON.parse(JSON.stringify({pMembertype:this.membertype[k].membertypename,pMembertypeid:this.membertype[k].membertypeid}));
  //          let obj2 = JSON.parse(JSON.stringify({pApplicanttype:this.applicanttype[p].applicanttype}));
  //          this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount ? this._CommonService.currencyformat(((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMininstalmentamount.toString()).replace(/,/g, ""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount ? this._CommonService.currencyformat(((this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pMaxinstalmentamount.toString()).replace(/,/g, ""))) : 0;
  //         this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestpayuot = this.onMaturity;
  //         if(this.Rdcongiggriddata && this.Rdcongiggriddata.length > 0) {
  //           let count = 0;
  //           for (let i = 0; i < this.Rdcongiggriddata.length; i++) {
  //             if(this.Rdcongiggriddata[i].pApplicanttype == (this.applicanttype[p].applicanttype) &&
  //             this.Rdcongiggriddata[i].pMembertype == (this.membertype[k].membertypename))
  //             {
  //               this._CommonService.showWarningMessage("Already existed");
  //               return;
  //             }
  //             else {
  //               count++;
  //             }
  //           }
  //           if(count == this.Rdcongiggriddata.length) {
  //             this.Rdcongiggriddata.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})     
  //           }
  //         }
  //         else {
  //           this.Rdcongiggriddata.push({...this.Rdconfigurationform.controls.lstRdConfigartionDetails.value,...obj1,...obj2})
  //         }
  //        }          
  //       }
  //       // this.Rdcongiggriddata = tempArr;
  //       this.gridViewConfig = this.Rdcongiggriddata;
  //       this.loadInitData();
  //           this.AccountConfigErrorMessages = {};
  //           this.BlurEventAllControll(this.Rdconfigurationform);
  //       console.log("tempArr : ",tempArr);
  //     }

  //   }


  // }
  Investmentfrom() {
    debugger;
    this.fromnoofyears = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofyears.value) ? ""
      : this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofyears.value + 'Y'
    this.fromnoofmonths = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofmonths.value) ? "" :
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofmonths.value + 'M'
    this.fromnoofdays = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.value) ? "" :
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.value + 'D'
    this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
    this.investfrom = this.investfrom.trim(" ")
    this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodfrom.setValue(this.investfrom)


    let fromYears = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofyears.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofyears.value.toString().replace(/,/g, "")) : 0;
    let fromMonths = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofmonths.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofmonths.value.toString().replace(/,/g, "")) : 0;
    let fromDays = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.value.toString().replace(/,/g, "")) : 0;
    this.enteredFromValue = (fromYears * 365) + (fromMonths * 30) + (fromDays);
    let years = fromYears * 12;
    let months = fromMonths * 30;
    let days = fromYears * 365;
    if (fromYears != 0) {

      if (fromMonths > 11) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofmonths.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Months");
        this.fromnoofmonths="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }
    if (fromMonths != 0) {


      if (fromDays > 29) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.fromnoofdays="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }
    else if (fromYears != 0) {

      if (fromDays > 29) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pfromnoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.fromnoofdays="";
        this.investfrom = this.fromnoofyears + " " + this.fromnoofmonths + " " + this.fromnoofdays
        this.investfrom = this.investfrom.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodfrom.setValue(this.investfrom)
      }
    }
      if ( !isNullOrUndefined(this.investfrom)) {
      this.investPeriodFromFlag= true;
    }
    else {
      this.investPeriodFromFlag = false;
    }
    this.checkForFromAndToDays()

  }
  Investto() {
    debugger;
    this.tonoofyears = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofyears.value) ? "" :
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofyears.value + 'Y'
    this.tonoofmonths = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofmonths.value) ? "" :
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofmonths.value + 'M'
    this.tonoofdays = isNullOrEmptyString(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.value) ? "" :
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.value + 'D'
    this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
    this.investto = this.investto.trim(" ")
    this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodto.setValue(this.investto)

    let toYears = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofyears.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofyears.value.toString().replace(/,/g, "")) : 0;
    let toMonths = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofmonths.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofmonths.value.toString().replace(/,/g, "")) : 0;
    let tomDays = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.value ? Number(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.value.toString().replace(/,/g, "")) : 0;
    this.enteredToValue = (toYears * 365) + (toMonths * 30) + (tomDays);
    let years = toYears * 12;
    let months = toMonths * 30;
    let days = toYears * 365;
    if (toYears != 0) {
      if (toMonths > 11) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofmonths.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Months");
        this.tonoofmonths=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodto.setValue(this.investto)
       
      }
    }
    if (toMonths != 0) {
      if (tomDays > 29) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.tonoofmonths=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodto.setValue(this.investto)
      }
    }
    else if (toYears != 0) {
      if (tomDays > 29) {
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].ptonoofdays.setValue("");
        this._CommonService.showWarningMessage("Enter Valid No Of Days");
        this.tonoofdays=""
        this.investto = this.tonoofyears + " " + this.tonoofmonths + " " + this.tonoofdays
        this.investto = this.investto.trim(" ")
        this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pInvestmentperiodto.setValue(this.investto)
      }
    }
    if ( !isNullOrUndefined(this.investto)) {
      this.investPeriodToFlag = true;
    }
    else {
      this.investPeriodToFlag = false;
    }

    this.checkForFromAndToDays()
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
    let eneteredMaxAmount = event.target.value;
       if (eneteredMaxAmount != null && eneteredMaxAmount != '' && eneteredMaxAmount != undefined) {
      this.globalMaxAmountFlag = true;
    }
    else {
      this.globalMaxAmountFlag = false;
    }
    this.validate(event);
  }
MultpleMaxAmountChange(event){
  debugger;
   let eneteredMaxAmount = event.target.value;
     if (eneteredMaxAmount != null && eneteredMaxAmount != '' && eneteredMaxAmount != undefined) {
      this.globalMaxAmountFlag = true;
      if(this.showmultipesof){
      
       let amount = this._CommonService.removeCommasForEntredNumber(this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.value)
    let multiple = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.value;
    if (amount > this.maxinstalamunt) {
      this._CommonService.showWarningMessage("Should not be greater than Max Deposit Amount")
      this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMultiplesofamount.setValue("");
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
  validate(event) {
    debugger
    this.mininstalamunt = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMininstalmentamount.value
    this.maxinstalamunt = this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pMaxinstalmentamount.value
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
    if (this.maxinstalamunt > 0) {
      if (this.mininstalamunt > this.maxinstalamunt) {
        this.validationformin = true;
      }
      else {
        this.validationformin = false
      }
    }
  }

  changeLoanInstallments(event) {
    debugger
    let selectedValue = event.pLoanpayin;
    
    if (selectedValue != null && selectedValue != null && selectedValue != undefined) {
      this.globalInstallmentFlag = true;

      if(selectedValue=='Daily' || selectedValue=='Weekly' ||  selectedValue=='Bi-Weekly' ||  selectedValue=='Fortnightly' ){
        this.compoundinginterest=false;
      }else{
        this.compoundinginterest=true;
      }
    }
    else {
      this.globalInstallmentFlag = false;
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
          this.checkValidations(formcontrol, isValid)
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
      isValid = this.checkValidations(this.Rdconfigurationform, isValid)
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

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadFiDatas();
  }
  private loadFiDatas(): void {
    this.gridViewDeposite = {
      data: this.fiViewDepositeData.slice(this.skip, this.skip + this.pageSize),
      total: this.fiViewDepositeData.length
    };
    this.gridViewConfig = {
      data: this.fiViewConfigData.slice(this.skip, this.skip + this.pageSize),
      total: this.fiViewConfigData.length
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

  public onFilter(inputValue: string): void {

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
            field: 'pRdcalucationmode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTenure',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPayindenomination',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterestamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaturityamount',
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
          // {
          //   field: 'pValueper100',
          //   operator: 'contains',
          //   value: inputValue
          // }
        ]
      }
    }).data;

  }



  editHandler(event, type) {
    let vchApplicationId = btoa(event.dataItem.pVchapplicationid);
  }

  public removeHandler(dataItem, type) {

    if (type == 'deposite') {
      // const index: number = this.gridViewDeposite.indexOf(dataItem);

      // if (index !== -1) {
      // this.gridViewDeposite.splice(dataItem.rowIndex, 1);
      this.DepositGridData.splice(dataItem.rowIndex, 1)
            this.DepositGridData=[...this.DepositGridData];
      // }
    }
    else {
      // const index: number = this.gridViewConfig.indexOf(dataItem);
      // if (index !== -1) {
      this.Rdcongiggriddata.splice(dataItem.rowIndex, 1);
      // }
    }
  }

  changeInterestType(event) {
    let selectedValue = event.target.value;
    // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom='';
    // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto='';
    // this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pValueper100='';
  //  this.Valueper100 = false;
      this.Intrestrate = false;
      this.showvalue=true;
      this.showrate=true;
    this.Rdconfigurationform.controls.lstRdConfigartionDetails.patchValue({
      pCompoundInteresttype: '',
      pInterestratefrom:'',
      pInterestrateto:'',
      pValueper100:'0',
    })
    this.AccountConfigErrorMessages.pInterestratefrom=null;
    this.AccountConfigErrorMessages.pInterestrateto=null;
    this.AccountConfigErrorMessages.pInterestrateto=null;

    if (selectedValue == 'Compounding Interest') {
      this.showCompoundInterest = true;
    }
    else {
      this.showCompoundInterest = false;
    }
  }

  forInterestPayout(event) {
    let selectedPayout = event.target.checked;
    if (selectedPayout) {
      this.onMaturity = 'On Maturity';
    }
    else {
      this.onMaturity = '';
    }
  }

  checkForFromAndToDays() {
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
    else if ((entered1) >= (previous1) && (entered1) <= (previous2) && (entered2) >= (previous2)) {
      //this.showErrorMessage('Given range already exists');
      isValid = true;
    }
    else if ((entered1) <= (previous1) && (entered2) <= (previous2) && (entered2) >= (previous1)) {
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

  refreshData() {
   debugger;
    let referalapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIsreferralcommissionapplicable;
    let pPenaltytype = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pPenaltytype;
    let commissionvalue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pCommissionValue;
    let pIspenaltyapplicable = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIspenaltyapplicable
    let tds = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pIstdsapplicable;
    let tdssection = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pTdssection;
    let Referralcommissiontype = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pReferralcommissiontype;
    this.Rdconfigurationform = new FormGroup({
      lstRdConfigartionDetails: new FormGroup({
        precordid: new FormControl('0'),
        pMembertypeid: new FormControl(''),
        pMembertype: new FormControl(''),
        pApplicanttype: new FormControl(''),
        pRdcalucationmode: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
        pMininstalmentamount: new FormControl(''),
        pMaxinstalmentamount: new FormControl(''),
        pInstalmentpayin: new FormControl(''),
        pInvestmentperiodfrom: new FormControl(''),
        pInvestmentperiodto: new FormControl(''),
        pInterestpayuot: new FormControl(''),
        pMultiplesofamount: new FormControl(0),
        pInteresttype: new FormControl('Simple Interest'),
        pReferralcommissiontype: new FormControl('percentage'),
        pIsreferralcommissionapplicable: new FormControl(false),
        pCommissionValue: new FormControl(0),
        pIstdsapplicable: new FormControl(tds),
        pTdssection: new FormControl(tdssection),
        pTdsaccountid: new FormControl(''),
        pTdspercentage: new FormControl(0),
        pCompoundInteresttype: new FormControl(''),
        pInterestratefrom: new FormControl('', [Validators.required]),
        pInterestrateto: new FormControl('', [Validators.required]),
        pfromnoofyears: new FormControl(''),
        pfromnoofmonths: new FormControl(''),
        pfromnoofdays: new FormControl(''),
        ptonoofyears: new FormControl(''),
        ptonoofmonths: new FormControl(''),
        ptonoofdays: new FormControl(''),
        pValueper100: new FormControl('0'),
        pTenure: new FormControl(''),
        pTenuremode: new FormControl(''),
        pPayindenomination: new FormControl(''),
        pInterestamount: new FormControl(''),
        pDepositamount: new FormControl(''),
        pMaturityamount: new FormControl(''),
        pIspenaltyapplicable: new FormControl(false),
        pPenaltytype: new FormControl(''),
        pPenaltyvalue: new FormControl(0),
        pTypeofOperation: new FormControl(this._CommonService.ptypeofoperation)
      }),
      pMembertype: new FormControl(''),
      pApplicanttype: new FormControl(''),
      pMembertypeid: new FormControl(''),
      pRdconfigid: new FormControl(''),
      forType: new FormControl(this.showupdatetable ? 'TABLE' : 'Interest rate'),
      pRdname: new FormControl(''),
      pRdnamecode: new FormControl(''),
      pCreatedby: new FormControl(this._CommonService.pCreatedby),
      pStatusid: new FormControl(''),
      pStatusname: new FormControl(''),
      pEffectfromdate: new FormControl(''),
      pEffecttodate: new FormControl(''),
      ptypeofoperation: new FormControl(this._CommonService.ptypeofoperation)
    });
      if (referalapplicable == true) {
      this.showcommissionpayout = true;
      this.tdsshow = true;
    }
    
    else {
      this.showcommissionpayout = false;
      this.tdsshow = true;
    }
    if (pPenaltytype == true) {
      this.showpenalty = true;
    } else {
      this.showpenalty = false;
    }
      this.pMembertypeid = null;
      this.pApplicanttype = null;
      this.showpenalty = false;
      this.forPenaltyPercentage = false;
      this.forPenaltyFixed = false;
      this.showcommissionpayout = false;
      this.forFixed = false;
      // this.Valueper100 = false;
      this.Intrestrate = false;
      this.showvalue=true;
      this.showrate=true;
      this.forPercentage = true;
      this.tdsshow = false
      this.showmultipesof = false;
      this.multiplesstatus=false;
      this.clearvalidations();
      this.AccountConfigErrorMessages={};
  }

  checkFromToValue() {

    debugger
    let fromValue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestratefrom;
       let toValue = this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto;
    if (fromValue != "" ||  toValue!="") {
    
      // let Valueper100 = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pValueper100'];
       if(fromValue != ""){
         this.AccountConfigErrorMessages.pInterestratefrom=null;
        }
        if(toValue != ""){
         this.AccountConfigErrorMessages.pInterestrateto=null;
        }
      // Valueper100.clearValidators();
      // Valueper100.updateValueAndValidity();
      // this.AccountConfigErrorMessages.pValueper100 = "";
      // this.Valueper100 = true
    }
    // else {
    //   let Valueper100 = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pValueper100'];
    //   Valueper100.setValidators(Validators.required);
    //   Valueper100.updateValueAndValidity();

    //   this.Valueper100 = false
    // }
    if (this.Rdconfigurationform.controls.lstRdConfigartionDetails.value.pInterestrateto) {
      fromValue = fromValue ? Number(fromValue) : 0;
      toValue = toValue ? Number(toValue) : 0; 

      if (fromValue > toValue) {
        this.interetsFromTo = true;
        this._CommonService.showWarningMessage("From value should be less than To value");
        this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestrateto'].setValue('')
       

      }
      else {
        this.interetsFromTo = false;
      }
      // this.Rdconfigurationform.controls.lstRdConfigartionDetails['controls'].pValueper100.disable()
      //this.Valueper100=true
    }
  }
  validateRDConfigDetails(): boolean {
    debugger
    let isValid: boolean = true;

    const formControl = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails'];
    try {

      let isValid1;
      let isValid2;
      let isValid3;
     
      isValid1 = this.GetValidationByControl(formControl, 'pInterestratefrom', true);
      isValid2 = this.GetValidationByControl(formControl, 'pInterestrateto', true);
      // isValid3 = this.GetValidationByControl(formControl, 'pValueper100', true);
      // isvalid4 = this.GetValidationByControl(formControl, 'pRatepersquareyard', true);
      if (isValid1 && isValid2) {
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
  valueentered(event) {
    debugger;

    if (event.target.value == "") {
     //  this.AccountConfigErrorMessages.pValueper100 = "";
      let Interestratefrom = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestratefrom'];
      let Interestrateto = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestrateto'];
      Interestratefrom.setValidators(Validators.required);
      Interestratefrom.updateValueAndValidity();

      Interestrateto.setValidators(Validators.required);
      Interestrateto.updateValueAndValidity();

      // this.notEditable = false;
      this.Intrestrate = false

    }
    else {

      let Valueper100=event.target.value
      let Interestratefrom = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestratefrom'];
      let Interestrateto = <FormGroup>this.Rdconfigurationform['controls']['lstRdConfigartionDetails']['controls']['pInterestrateto'];
      Interestratefrom.clearValidators();
      Interestratefrom.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestratefrom = "";
      Interestrateto.clearValidators();
      Interestrateto.updateValueAndValidity();
      this.AccountConfigErrorMessages.pInterestrateto = "";
       this.Intrestrate = true;
     
    }

  }
}
