import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { CommonService } from "../../../../Services/common.service"
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { ApprovalService } from "../../../../Services/Loans/Transactions/approval.service"
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { ChargemasterService } from '../../../../Services/Loans/Masters/chargemaster.service';
import { FIIndividualService } from '../../../../Services/Loans//Transactions/fiindividual.service'
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { timingSafeEqual } from 'crypto';
import { parse } from 'querystring';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { debug } from 'util';
import { DisbusementService } from 'src/app/Services/Loans/Transactions/disbusement.service';


declare let $: any

@Component({
  selector: 'app-aproval-new',
  templateUrl: './aproval-new.component.html',
  styles: []
})
export class AprovalNewComponent implements OnInit {

  button = 'Loan Approved';
  RejectButton = 'Loan Rejected'
  isLoading = false;

  notEditable:boolean=true
  GracePeriodShowOrHide: Boolean
  RemainingPercentageShowOrHide: Boolean
  AcceptChecked: Boolean
  StageWiseAmountFlag: Boolean
  IfLoanAcceptedData: Boolean
  IfLoanRejectdData: Boolean
  IfStageWisePaymentData: Boolean
  Ifmultidisbursal: Boolean
  DisableStagePayment: Boolean
  DisablePercentageEntry: Boolean
  Disablemultidisbursal: Boolean
  Disablemitype: Boolean
  checkedsinglestage: Boolean
  checkedstagewise: Boolean
  checkedmultidisbursal: Boolean
  DisableSinglePayment: Boolean
  paymenthide: Boolean
  paymentshow: Boolean
  emiModelShowFlag: Boolean = false;
  KendoTextBoxShowHide: Boolean
  BusinessFinancialDetailsshow: boolean;
  BusinessDetailsshow: boolean;
  Verificationdata: Response;
  InstallmentDueDateHide: Boolean
  submitted = false;
  LoanSubmitStatus = false

  SavedStatusType: any



  LoanDetailsErrorMessages: any
  IntrestRatesList: any
  minValue: any;
  maxValue: any;
  enteredAmountRequestedValue: any;

  public gridView: any = [];
  modalData = [];
  Loaninstalmentpaymentmode: any
  currencyFormatModalData = [];
  emiAggregates: any;


  emiprincipalpayinterval: any
  total = 'Total';

  FiApprovalForm: FormGroup


  installmentAmount: any
  fiEmiSchesuleview: any

  ChargesAndFees: any
  TempGridDataChargesFees: any
  TempGridDataChargesFeesCopy: any
  ChargesDataToBindInCancelClick: any
  Sactionedamount: any




  paymentarray = [];
  Temppaymentarray = [];
  TempChargesDatatoSavee = []

  stageWiseAmouts = []
  stageTotalamount = 0
  maxlength = 12
  id = 0;
  Sid = 1
  Stage = "Stage "
  stageid: any

  PercentageTotal = 0
  TempPercentageTotal = 0
  RemainingPercentage = 0
  ArrayListTotalPercentage = 0
  private editedRowIndex: number;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5
  };

  newstage: any
  stageIncrease = 0
  stagegridData = [];
  FiDocumentsList: any;
  EducationDetails: any;
  Reference: any;
  ExistingLoan: any;
  SecurityandCollateralIMmovable: any;
  SecurityandCollateralMovable: any;
  NomineeDetails: any;
  IncomeDetails: any;
  EmployementDetails: any;
  BankDetails: any;
  PersonalDetails: any;
  KYCIdentificationDetails: any;
  CreditScore: any;
  ContactDetails: any
  ContactAddress: any
  BusinessDetails: any;
  BusinessFinancialDetails: any;

  loantype: any;
  loanspecificfinacialperformance: any;
  loanspecificcredittrendpurchase: any;
  loanspecificcredittrendsales: any;
  loanspecificstockposition: any;
  loanspecificcostofprojection: any;
  loanspecificunitaddress: any;
  loanspecificturnoverandprofitorloss: any;
  loanspecificassociateconcern: any;
  loanspecificeducationinstituteaddress: any;
  loanspecificeducationqualification: any;
  loanspecificeducationfeedetails: any;
  loanspecificloanyearwizefee: any;
  loanspecificconsumerloandata: any;
  loanspecificloanagainstdeposit: any;
  loanspecificvehicledata: any;
  loanspecificgoldloan: any;
  loanspecifichomeloan: any;
  loanspecificeducationqualificationdetails:any = [];
  loanspecificgoldloandetails:any =[];
  addressforloanspecificbusinessloan:any = [];


  ApplicantName: any;
  LoanType: any;
  LoanName: any;
  MobileNo: any;
  ApplicationID: any

  FieldVeriEditData: any;
  ApplicationData: any

  LoanInterestratetypes: any;
  Loanpayins: any;

  ChargesDatatoGrid: any
  ChargesDatatoSave: any
  Stageno: any

  AmountReqLable: any
  TenureOfLaonLable: any
  IntrestTypeLable: any
  IntrestRateLable: any
  LaonPayInsLable: any

  ExistingsTotalAmount: number = 0
  SavingsTotalAmount: number = 0
  CashFlowTotalAmount: number=0
  CashFlowPerMonth: number

  rowIndex: any



  FiDocVerifierRating: any
  FiDocVerifierComments: any
  FiDocVerifiedDate: any
  FiDocVerifiedTime: any
  FiDocVerifierOfcrName: any



  Availability: any
  SpokenApplicantName: any
  ContactThrough: any
  ContactNo: any
  VerifierOfficer: any
  Rating: any
  Comments: any
  SpokenTo: any
  SpokenOtherRelationship: any
  teleVerificationDate: any

  HouseWonerShip: any
  RelationShipWithApplicant: any
  PersonMet: any
  VerifierName: any
  VerifiedDate: any
  VerifierTime: any
  AppName: any
  AddressType: any
  IsAddVerified: any
  NoOfYrsStyng: any
  FieldVerifierCommnt: any
  FieldVerifierRating: any

  minDate: Date
  maxDate: Date = new Date();
  AddressVerificationDetails: any
  AddressVerificationDetailsTemp: any
  VerifiersObservationDetails: any
  VerifiersObservationDetailsTemp: any
  NeighbourhoodCheckDetails: any

  SavingDetails: any
  ExistingDetails: any


  VisiblePoliticalAffiliation: any
  DoesAppStayHear: any


  paramLoanName: any
  paramRequiredAmount: any
  paramTenure: any
  paramApplicantType: any
  paramLoanPayIn: any
  paramTransactionDate: any
  paramSchemeId: any
  paramContactType: any
  paramLoanId: any
  paramInterestType: any
  paramInterestRate: any
  mininterestrate:any;
  bsValue = new Date();

  ParameterRoute: any
  disabletransactiondate = false;

  emidays:any=[];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private fb: FormBuilder, private _CommonService: CommonService, private _VerificationService: VerificationService, private _ApprovalService: ApprovalService, private activatedroute: ActivatedRoute,
    private _loanmasterservice: LoansmasterService, private _ChargemasterService: ChargemasterService,
    private router: Router, private _FIIndividualService: FIIndividualService, private datepipe: DatePipe, private toaster: ToastrService, private _DisbusementService :DisbusementService) {
    //   this.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'

  }

  ngOnInit() {
    debugger
    this.GracePeriodShowOrHide = false
    if (this._CommonService.comapnydetails != null)
      this.disabletransactiondate = this._CommonService.comapnydetails.pdatepickerenablestatus;
    this.RemainingPercentage = 100;
    this.stagegridData = []
    this.emiAggregates = {};
    this.LoanDetailsErrorMessages = {}
    this.submitted = false
    this.LoanSubmitStatus = false
    //this.stagegridData = [{ pStagename: 'Stage1', pPaymentreleasepercentage: '', pPaymentreleaseamount: '' }];
    this.paymentshow = true
    this.TempGridDataChargesFees = []
    this.ChargesDataToBindInCancelClick = []
    this.AddressVerificationDetailsTemp = []
    this.VerifiersObservationDetailsTemp = []
    this.ChargesDatatoSave = []
    this.stageid = this.Stage + "" + this.Sid
    this.IfLoanAcceptedData = false
    this.IfLoanRejectdData = false
    this.IfStageWisePaymentData = false

    this.KendoTextBoxShowHide = false

    this.InstallmentDueDateHide = false

    this.FiApprovalForm = this.fb.group({
      papprovestatus: [''],
      pApplicationid: [''],
      pVchapplicationid: [''],
      pApproveddate: [new Date()],
      pApprovedby: [this._CommonService.pCreatedby],
      pDisbursmentdate: [''],
      pAmountrequested: [''],
      pApprovedloanamount: ['', Validators.required],
      pLoanpayin: [''],
      pInteresttype: [''],
      pRateofinterest: ['', Validators.required],
      pTenureofloan: ['', Validators.required],
      pTenuretype: [''],
      pVchaccintrest: [''],
      pLoaninstalmentpaymentmode: [''],
      // pOldInstallmentstartdate: [''],
      pOldInstallmentstartdate: [new Date()],
      pInstallmentamount: ['0'],
      pInstallmentstartdate: [new Date()],
      // pInstallmentstartdate: [''],
      pHolidayperiodpayin: [''],
      pHolidayperiodvalue: ['0'],
      pMoratoriumperiodpayin: [''],
      pMoratoriumperiodvalue: ['0'],
      pRemarks: [''],
      pDisbursementpayinmode: [''],
      emitype: ['REGULAR'],
      pemitype: [''],
      pGraceperiod: ['0', Validators.required],
      emiday:[0],
      pemiday:[0],
      lstStagewisepayments: new FormGroup({

      }),
      lstApprovedloancharges: new FormGroup({

      }),
      pCreatedby: [this._CommonService.pCreatedby],
      pStatusid: ['1'],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],

      pDateofapplication: [''],
      pApplicantname: [''],
      pLoantype: [''],
      pLoantypeid: [''],
      pLoanid: [''],
      pLoanname: [''],
      pMobileno: [''],
      pPurposeofloan: [''],




      pAmount: [''],
      pChargename: [''],
      pInterevels: [],
    })

    this.FiApprovalForm.controls.pApproveddate.setValue(new Date())

    this.BlurEventAllControll(this.FiApprovalForm);

    this._ChargemasterService.getChargeNames('ACTIVE').subscribe(json => {
      if (json != null) {
        this.ChargesAndFees = json
      }
    })

    //depends on fi
    // this._loanmasterservice._getLoanInterestratetypes( ).subscribe(json => {
    //   if (json) {
    //     this.LoanInterestratetypes = json
    //   }
    // });


    // let id = this.activatedroute.snapshot.params['id'];
    // var decodedString = atob(id);  
    // const routeParams = this.activatedroute.snapshot.params['id'];

    const routeParams = atob(this.activatedroute.snapshot.params['id']);
    this.ParameterRoute = routeParams
    if (routeParams != undefined) {
      this.BindingLoanApplicationData(routeParams)
    }
    this.emidays=[];
    for(var i = 1; i <= 28; i++){
      this.emidays.push(i); 
    }
  }

  BindingLoanApplicationData(routeParams) {
    
    let GetApprovalDataByID = this._ApprovalService.GetApprovalDataByID(routeParams)
    let GetFiDocumentsToVerify = this._VerificationService.GetFiDocumentsToVerify(routeParams)
    let GetVerificationdetails = this._VerificationService.GetVerificationdetails(routeParams)
    let GetFieldverificationdetails = this._VerificationService.GetFieldverificationdetails(routeParams)
    let GetSavingdetails = this._ApprovalService.GetSavingdetails(routeParams)
    let GetExstingloandetails = this._ApprovalService.GetExstingloandetails(routeParams)

    forkJoin([GetApprovalDataByID, GetFiDocumentsToVerify, GetVerificationdetails, GetFieldverificationdetails, GetSavingdetails, GetExstingloandetails])
      .subscribe(result => {

        //1 Binding GetApprovalDataByID Details Start

        this.ApplicationData = result[0]
        this.FiApprovalForm.controls.emitype.setValue(this.ApplicationData[0].pemitype)
        this.FiApprovalForm.controls.pApplicationid.setValue(this.ApplicationData[0].pApplicationid)
        this.FiApprovalForm.controls.pVchapplicationid.setValue(this.ApplicationData[0].pVchapplicationid)
        this.FiApprovalForm.controls.pApplicantname.setValue(this.ApplicationData[0].pApplicantname)
        this.minDate = this._CommonService.formatDateFromDDMMYYYY(this.ApplicationData[0].pDateofapplication)
        this.FiApprovalForm.controls.pDateofapplication.setValue(this.ApplicationData[0].pDateofapplication)
        this.FiApprovalForm.controls.pLoantype.setValue(this.ApplicationData[0].pLoantype)
        this.FiApprovalForm.controls.pLoantypeid.setValue(this.ApplicationData[0].pLoantypeid)
        this.FiApprovalForm.controls.pLoanname.setValue(this.ApplicationData[0].pLoanname)
        this.FiApprovalForm.controls.pLoanid.setValue(this.ApplicationData[0].pLoanid)
        this.FiApprovalForm.controls.pPurposeofloan.setValue(this.ApplicationData[0].pPurposeofloan)
        this.FiApprovalForm.controls.pAmountrequested.setValue(this.ApplicationData[0].pAmountrequested)
        let amount = this._CommonService.currencyformat(this.ApplicationData[0].pAmountrequested)
        this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
        this.AmountReqLable = this.ApplicationData[0].pAmountrequested
        this.Sactionedamount = this.ApplicationData[0].pAmountrequested
        this.FiApprovalForm.controls.pTenureofloan.setValue(this.ApplicationData[0].pTenureofloan)
        this.TenureOfLaonLable = this.ApplicationData[0].pTenureofloan
        this.FiApprovalForm.controls.pInteresttype.setValue(this.ApplicationData[0].pInteresttype)
        this.IntrestTypeLable = this.ApplicationData[0].pInteresttype
        this.FiApprovalForm.controls.pLoanpayin.setValue(this.ApplicationData[0].pLoanpayin);
        this.FiApprovalForm.controls.pInterevels.setValue(this.ApplicationData[0].pInterevels)
        this.LaonPayInsLable = this.ApplicationData[0].pLoanpayin
        if (this.LaonPayInsLable != "Monthly" && this.LaonPayInsLable != "Quarterly" && this.LaonPayInsLable != "Half-Yearly" && this.LaonPayInsLable != "Yearly") {
          this.GracePeriodShowOrHide = false
        } else {
          this.GracePeriodShowOrHide = true
        }
        if (this.LaonPayInsLable == "Weekly") {
          this.Disablemultidisbursal = true
          this.Disablemitype=true;
        } else {
          this.Disablemultidisbursal = false
          this.Disablemitype=false;
        }

        this.emiprincipalpayinterval = this.ApplicationData[0].pInterevels;
        //if (this.ApplicationData[0].pLoaninstalmentpaymentmode == "Part Principal paid in intervals") {
        //    this.emiprincipalpayinterval = this.ApplicationData[0].pInterevels
        //} else {
        //    this.emiprincipalpayinterval = 0
        //}
        this.FiApprovalForm.controls.pMobileno.setValue(this.ApplicationData[0].pMobileno)
        let Instalmentamount = this._CommonService.currencyformat(this.ApplicationData[0].pInstalmentamount)
        this.FiApprovalForm.controls.pInstallmentamount.setValue(Instalmentamount)
        this.FiApprovalForm.controls.pLoaninstalmentpaymentmode.setValue(this.ApplicationData[0].pLoaninstalmentpaymentmode)
        this.Loaninstalmentpaymentmode = this.ApplicationData[0].pLoaninstalmentpaymentmode
        this.FiApprovalForm.controls.pGraceperiod.setValue(this.ApplicationData[0].pGraceperiod)
        if (this.ApplicationData[0].pLoaninstalmentpaymentmode == "Equated Instalments") {
          if (this.LaonPayInsLable == "Monthly" || this.LaonPayInsLable == "Quarterly" || this.LaonPayInsLable == "Half-Yearly" || this.LaonPayInsLable == "Yearly") {
            this.checkedsinglestage = true
            this.DisableSinglePayment = false
            this.DisableStagePayment = false
            this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
          }
          else {
            this.checkedsinglestage = true
            this.DisableSinglePayment = false
            this.DisableStagePayment = true
            this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
          }
        }
        else {
          this.checkedsinglestage = true
          this.DisableSinglePayment = false
          this.DisableStagePayment = true
          this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
        }
        this.paramLoanId = this.ApplicationData[0].pLoanid
        this.paramContactType = this.ApplicationData[0].pContacttype
        this.paramInterestType = this.ApplicationData[0].pInteresttype
        this.paramSchemeId = this.ApplicationData[0].pschemeid
        this.paramLoanName = this.ApplicationData[0].pLoanname
        this.paramRequiredAmount = this.ApplicationData[0].pAmountrequested
        this.paramTenure = this.ApplicationData[0].pTenureofloan
        this.paramApplicantType = this.ApplicationData[0].pApplicanttype
        this.paramLoanPayIn = this.ApplicationData[0].pLoanpayin
        this.paramTransactionDate = this.datepipe.transform(this.FiApprovalForm.controls.pApproveddate.value, "yyyy-MM-dd")

        this.getFiLoanData(this.paramLoanId, this.paramContactType, this.paramApplicantType, this.paramSchemeId,this.paramLoanPayIn);

        this.GetChargesData();

        this.FiApprovalForm.controls.pRateofinterest.setValue(this.ApplicationData[0].pRateofinterest)
        this.IntrestRateLable = this.ApplicationData[0].pRateofinterest;
        this.getInterestRates();
        // End Of GetApprovalDataByID Details

        //2 Binding GetFiDocumentsToVerify Details start
        this.FiDocumentsList = result[1];
        this.loantype = this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.pLoantype;
        this.EducationDetails = this.FiDocumentsList["applicationPersonal"]["personalEducationList"]
        this.Reference = this.FiDocumentsList["applicationReferencesDTO"]["lobjAppReferences"]
        this.ExistingLoan = this.FiDocumentsList["applicationExistingLoanDetailsDTO"]
        this.SecurityandCollateralIMmovable = this.FiDocumentsList["applicationSecurityandCollateralDTO"]["imMovablePropertyDetailsList"];
        this.SecurityandCollateralMovable = this.FiDocumentsList["applicationSecurityandCollateralDTO"]["movablePropertyDetailsList"];
        this.NomineeDetails = this.FiDocumentsList["applicationPersonal"]["personalNomineeList"];
        this.IncomeDetails = this.FiDocumentsList["applicationPersonal"]["personalIncomeList"];
        this.EmployementDetails = this.FiDocumentsList["applicationPersonal"]["personalEmployeementList"];
        this.PersonalDetails = this.FiDocumentsList["applicationPersonal"]["personalFamilyList"];
        this.CreditScore = this.FiDocumentsList["applicationKYCDocumentsDTO"]["lstCreditscoreDetailsDTO"];
        this.KYCIdentificationDetails = this.FiDocumentsList["applicationKYCDocumentsDTO"]["documentstorelist"];
        this.BankDetails = this.FiDocumentsList["applicationPersonal"]["personalBankList"];
        this.ContactDetails = this.FiDocumentsList["lstApplicationContactPersonalDetailsDTO"];
        this.ContactAddress = this.FiDocumentsList["lstcontactPersonalAddressDTO"];
        this.BusinessDetails = this.FiDocumentsList["applicationPersonal"]["businessDetailsDTOList"]
        this.BusinessFinancialDetails = this.FiDocumentsList["applicationPersonal"]["businessfinancialdetailsDTOList"]

        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.businessLoanDTO) {
          this.loanspecificfinacialperformance = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessfinancialperformanceDTO"]
          this.loanspecificcredittrendpurchase = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendpurchasesDTO"]
          this.loanspecificcredittrendsales = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendsalesDTO"]
          this.loanspecificstockposition = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessstockpositionDTO"]
          this.loanspecificcostofprojection = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscostofprojectDTO"]
          this.addressforloanspecificbusinessloan.push(this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["businessancillaryunitaddressdetailsDTO"])
          this.loanspecificturnoverandprofitorloss = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanturnoverandprofitorloss"]
          this.loanspecificassociateconcern = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanassociateconcerndetails"]
        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.educationLoanDTO) {
          this.loanspecificeducationqualificationdetails.push(this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]) 
          this.loanspecificeducationinstituteaddress = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationInstutiteAddressDTO"]
          this.loanspecificeducationqualification = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationQualifcationDTO"]
          this.loanspecificeducationfeedetails = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanFeeDetailsDTO"]
          this.loanspecificloanyearwizefee = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanyearwiseFeedetailsDTO"]

        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.consumerLoanDTO) {
          this.loanspecificconsumerloandata = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["consumerLoanDTO"]["lstConsumerLoanDetailsDTO"]
        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification._HomeLoanDTOLst) {
          this.loanspecifichomeloan = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["_HomeLoanDTOLst"]
        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.lstLoanagainstDepositDTO) {
          this.loanspecificloanagainstdeposit = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstLoanagainstDepositDTO"]
        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.lstVehicleLoanDTO) {
          this.loanspecificvehicledata = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstVehicleLoanDTO"]
        }
        if (this.FiDocumentsList._ApplicationLoanSpecificDTOinVerification.lstGoldLoanDTO) {
          this.loanspecificgoldloandetails.push(this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstGoldLoanDTO"])
          this.loanspecificgoldloan = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstGoldLoanDTO"]["lstGoldLoanDetailsDTO"]
        }


        if (this.BusinessDetails.length == 0) {
          this.BusinessDetailsshow = false;
        }
        else {
          this.BusinessDetailsshow = true;
        }
        if (this.BusinessFinancialDetails.length == 0) {
          this.BusinessFinancialDetailsshow = false;
        }
        else {
          this.BusinessFinancialDetailsshow = true;
        }
        this.FiDocVerifierRating = this.FiDocumentsList["pFIVerifiersrating"]
        this.FiDocVerifierComments = this.FiDocumentsList["pFIVerifierscomments"]
        this.FiDocVerifiedDate = this.FiDocumentsList["pverificationdate"]
        this.FiDocVerifiedTime = this.FiDocumentsList["pverificationtime"]
        this.FiDocVerifierOfcrName = this.FiDocumentsList['firstinformationDTO'][0].pVerifierName
        //End Of GetFiDocumentsToVerify Details

        //3 Binding GetVerificationdetails Details start
        this.Verificationdata = result[2];
        this.ApplicantName = this.Verificationdata["pApplicantName"]
        this.LoanType = this.Verificationdata["pLoantype"]
        this.LoanName = this.Verificationdata["pLoanName"]
        this.MobileNo = this.Verificationdata["pconctano"]
        this.ApplicationID = this.Verificationdata['pvchapplicationid']
        this.teleVerificationDate = this.Verificationdata["pverificationdate"]
        if (this.Verificationdata["customerAvailabilityDTO"].pcustomeravailability == true) {
          this.Availability = "Yes"
          this.ContactThrough = this.Verificationdata["customerAvailabilityDTO"].pcontacttype
          if (this.ContactThrough == "MobileNo") {
            this.ContactThrough = ", On Mobile :"
          }
          else if (this.ContactThrough == "AlternateNo :") {
            this.ContactThrough = ", On Alternate No :"
          } else if (this.ContactThrough == "OfficeNumber :") {
            this.ContactThrough = ", On Office Number :"
          } else if (this.ContactThrough == "ResidenceNumber :") {
            this.ContactThrough = ", On Residence Number :"
          }
          this.SpokenApplicantName =": "+this.Verificationdata["pApplicantName"]
          this.ContactNo = this.Verificationdata["pconctano"]
          this.VerifierOfficer = this.Verificationdata["pinvestigationexecutivename"]
          this.Rating = this.Verificationdata["pteleverifiersrating"]
          this.Comments = this.Verificationdata["pteleverifierscomments"]
          this.SpokenTo = this.Verificationdata["spoketoDTO"].pspoketo
          if (this.SpokenTo == "Other") {
            this.SpokenApplicantName = ": "+this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].pnameoftheperson + " , " + this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].prelationshipwithapplicant
          }
        }
        else {
          //this.Availability = "No"
          this.Availability = ""
          this.ContactThrough = ""
          if (this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].pnameoftheperson != null && this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].prelationshipwithapplicant != null) {
            this.SpokenApplicantName =": "+ this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].pnameoftheperson + " , " + this.Verificationdata["spoketoDTO"]["spoketoOtherDTO"].prelationshipwithapplicant
          } else {
            this.SpokenApplicantName = ""
          }

          this.ContactNo = ""
          this.VerifierOfficer = this.Verificationdata["pinvestigationexecutivename"]
          this.Rating = this.Verificationdata["pteleverifiersrating"]
          this.Comments = this.Verificationdata["pteleverifierscomments"]
          this.SpokenTo = this.Verificationdata["spoketoDTO"].pspoketo
        }
        //End Of GetVerificationdetails Details


        //4 Binding GetFieldverificationdetails Details start
        let PdocprooffName = "";
        this.FieldVeriEditData = result[3];

        //Storing Address Details --Start
        this.AddressVerificationDetails = this.FieldVeriEditData["addressconfirmedDTO"]

        this.HouseWonerShip = this.AddressVerificationDetails["pHouseownership"]
        this.RelationShipWithApplicant = this.AddressVerificationDetails["pRelationshipwithapplicant"]

        this.PersonMet = this.AddressVerificationDetails["pPersonmet"]
        if (this.PersonMet == "personmetother") {
          this.AppName =": "+ this.AddressVerificationDetails["pPersonname"]
        } else {
          if (this.PersonMet == "applicant") {
            this.AppName =": "+ this.FieldVeriEditData["pApplicantName"]
          }
        }


        this.VerifierName = this.FieldVeriEditData["pInvestigationexecutivename"]



        this.VerifiedDate = this.FieldVeriEditData["pverificationdate"]

        this.VerifierTime = this.FieldVeriEditData["pverificationtime"]





        this.AddressType = this.FieldVeriEditData["paddresstype"]
        if (this.AddressType != undefined && this.AddressType != null && this.AddressType != "") {
          this.AddressType = "," + this.AddressType
        }
        this.NoOfYrsStyng = this.AddressVerificationDetails["pNoofyearsatpresentaddress"]
        if (this.NoOfYrsStyng == 0) {
          this.NoOfYrsStyng = ""
        } else {
          this.NoOfYrsStyng = this.NoOfYrsStyng + "  Years"
        }
        this.FieldVerifierCommnt = this.FieldVeriEditData["pFieldVerifiersComments"]
        this.FieldVerifierRating = this.FieldVeriEditData["pFieldVerifiersRating"]

        if (this.AddressVerificationDetails["pisaddressconfirmed"] == true) {
          this.IsAddVerified = "Yes"
        } else {
          //this.IsAddVerified = "No"
          this.IsAddVerified = ""
        }

        if (this.AddressVerificationDetails["lstFielddocumentverificationDTO"].length > 0) {
          for (var i = 0; i < this.AddressVerificationDetails["lstFielddocumentverificationDTO"].length; i++) {
            if (PdocprooffName == "") {
              PdocprooffName = this.AddressVerificationDetails["lstFielddocumentverificationDTO"][i].pdocproofname
            }
            else {
              PdocprooffName = PdocprooffName + ',' + this.AddressVerificationDetails["lstFielddocumentverificationDTO"][i].pdocproofname
            }
          }

        } else {
          PdocprooffName = ""
        }

        this.AddressVerificationDetailsTemp.push({
          "pdocproofname": PdocprooffName,
          "pDateofbirth": this.AddressVerificationDetails["pDateofbirth"],
          "pEarningmembers": this.AddressVerificationDetails["pEarningmembers"],
          "pChildren": this.AddressVerificationDetails["pChildren"],
          "pEmploymentorbusinessdetails": this.AddressVerificationDetails["pEmploymentorbusinessdetails"],
          "pFieldVerifiersComments": this.AddressVerificationDetails["pFieldVerifiersComments"],
          "pFieldVerifiersRating": this.AddressVerificationDetails["pFieldVerifiersRating"],
          "pHouseownership": this.AddressVerificationDetails["pHouseownership"],
          "pMaritalStatus": this.AddressVerificationDetails["pMaritalStatus"],
          "pLatitude": this.AddressVerificationDetails["pLatitude"],
          "pMonthlyincome": this.AddressVerificationDetails["pMonthlyincome"],
          "pNoofyearsatpresentaddress": this.AddressVerificationDetails["pNoofyearsatpresentaddress"],
          "pPersonmet": this.AddressVerificationDetails["pPersonmet"],
          "pPersonname": this.AddressVerificationDetails["pPersonname"],
          "pRelationshipwithapplicant": this.AddressVerificationDetails["pRelationshipwithapplicant"],
          "pTotalnoofmembersinfamily": this.AddressVerificationDetails["pTotalnoofmembersinfamily"],
          "pUploaddocumentname": this.AddressVerificationDetails["pUploaddocumentname"],
          "pisaddressconfirmed": this.AddressVerificationDetails["pisaddressconfirmed"],
          "plongitude": this.AddressVerificationDetails["plongitude"],
          "puploadlocationdocpath": this.AddressVerificationDetails["puploadlocationdocpath"],
          "pAge": this.AddressVerificationDetails["pAge"]
        })
        // --End

        //Storing Verifier Observation Details --Start
        this.VerifiersObservationDetails = this.FieldVeriEditData["fieldVerifiersobservationDTO"]

        if (this.VerifiersObservationDetails["pVisiblePoliticalAffiliation"] == true) {
          this.VisiblePoliticalAffiliation = "Yes"
        } else {
          if(this.VerifiersObservationDetails["pAddressLocalityDescription"]){
            this.VisiblePoliticalAffiliation = "NO"
          }else{
            this.VisiblePoliticalAffiliation = ""
          }
         
        }
        this.VerifiersObservationDetailsTemp.push({
          "pAccessability": this.VerifiersObservationDetails["pAccessability"],
          "pAddressFurnishing": this.VerifiersObservationDetails["pAddressFurnishing"],
          "pAddressLocalityDescription": this.VerifiersObservationDetails["pAddressLocalityDescription"],
          "pAffiliationRemarks": this.VerifiersObservationDetails["pAffiliationRemarks"],
          "pApproxArea": this.VerifiersObservationDetails["pApproxArea"],
          "pCustomerAvailability": this.VerifiersObservationDetails["pCustomerAvailability"],
          "pCustomerCooperation": this.VerifiersObservationDetails["pCustomerCooperation"],
          "pFieldVerifiersComments": this.VerifiersObservationDetails["pFieldVerifiersComments"],
          "pFieldVerifiersRating": this.VerifiersObservationDetails["pFieldVerifiersRating"],
          "pTypeofAccomodation": this.VerifiersObservationDetails["pTypeofAccomodation"],
          "pVisibleAssets": this.VerifiersObservationDetails["pVisibleAssets"],
          "pVisiblePoliticalAffiliation": this.VisiblePoliticalAffiliation,
        })
        //--End

        //Storing Neighbourhood Details --Start
        this.NeighbourhoodCheckDetails = this.FieldVeriEditData["fieldVerifyneighbourcheckDTO"]
        if (this.NeighbourhoodCheckDetails.length > 0) {

          for (var i = 0; i < this.NeighbourhoodCheckDetails.length; i++) {
            if (this.NeighbourhoodCheckDetails[i].pisApplicantstayhere == true) {
              this.NeighbourhoodCheckDetails[i].pisApplicantstayhere = "Yes"
            } else {
              this.NeighbourhoodCheckDetails[i].pisApplicantstayhere = "No"
            }
          }
        }
        // --End
        //End Of GetFieldverificationdetails Details


        //5 Binding GetSavingdetails Details start
        this.SavingDetails = result[4]
        if (this.SavingDetails.length > 0) {
          this.SavingsTotalAmount = this.SavingDetails.reduce((sum, c) => sum + c.pSavingsamount, 0);
          // for (var i = 0; i < this.SavingDetails.length; i++) {
          //     this.SavingsTotalAmount += this.SavingDetails[i].pSavingsamount
          // }
           if (this.SavingsTotalAmount != undefined && this.ExistingsTotalAmount != undefined) {
               this.CashFlowTotalAmount = this.SavingsTotalAmount - this.ExistingsTotalAmount
               this.CashFlowPerMonth = Math.round(this.CashFlowTotalAmount / 12)
           }
        }
        //End Of GetSavingdetails Details

        //6 Binding GetExstingloandetails Details start
        this.ExistingDetails = result[5]
        if (this.ExistingDetails.length > 0) {
          this.ExistingsTotalAmount = this.ExistingDetails.reduce((sum, c) => sum + c.pInstalmentamount, 0)
          // for (var i = 0; i < this.ExistingDetails.length; i++) {
          //     this.ExistingsTotalAmount += this.ExistingDetails[i].pInstalmentamount
          // }

          debugger
          if (this.SavingsTotalAmount != undefined && this.ExistingsTotalAmount != undefined) {
            this.CashFlowTotalAmount = this.SavingsTotalAmount - this.ExistingsTotalAmount
            this.CashFlowPerMonth = Math.round(this.CashFlowTotalAmount / 12)
          }
        }
        //End Of GetExstingloandetails Details



      })
  }

  dateChnage(event) {
    if (event) {
      debugger
      this.paramTransactionDate = this.datepipe.transform(event, "yyyy-MM-dd").toString();

      this.GetChargesData();
    }
    // this.changeLoanApplicationId();
  }

  CheckLoanApprovedDate() {
    debugger
    let approveddate = this.FiApprovalForm.controls.pApproveddate.value

    let loandate = this.FiApprovalForm.controls.pDateofapplication.value

  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  ChangeChargeNames() {
    this.FiApprovalForm.controls.pAmount.setValue("")
  }

  LoanAcceptedOrRejected(LoanStatus) {
    debugger
    if (LoanStatus == "Accepted") {
      this.SavedStatusType = "Accepted"
      this.IfLoanAcceptedData = true
      this.IfLoanRejectdData = false
      this.FiApprovalForm.controls.papprovestatus.setValue("Approve")
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
      this.checkedsinglestage = true
      this.checkedstagewise = false

    } else {
      this.SavedStatusType = "Reject"
      this.IfLoanAcceptedData = false
      this.IfLoanRejectdData = true
      this.FiApprovalForm.controls.papprovestatus.setValue("Reject")
      this.FiApprovalForm.controls.pGraceperiod.setValue("0")
      this.FiApprovalForm.controls.pApprovedloanamount.clearValidators()
      this.FiApprovalForm.controls.pApprovedloanamount.updateValueAndValidity()

      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
      this.stagegridData = []
      this.IfStageWisePaymentData = false
    }
  }
  PaymentStageSelect(PaymentStage) {
    debugger

    if (PaymentStage == "Stage wise payment") {
      this.Ifmultidisbursal = false;
      this.FiApprovalForm.controls['emiday'].setValue(0)
      this.FiApprovalForm.controls['emiday'].clearValidators();
      this.FiApprovalForm.controls['emiday'].updateValueAndValidity();
      this.RemainingPercentage = 100
      this.IfStageWisePaymentData = true
      this.paymentshow = true
      this.PercentageTotal = 0
      let newstage = this.Stage + "" + 1
      //const control = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
      // control.push(this.getUnit(newstage));
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Stage Payment")
      let NewLength = 1
      if (this.stagegridData.length == 0) {
        // this.stagegridData.push({ pStagename: 'Stage' + NewLength + '', pPaymentreleasepercentage: '', pPaymentreleaseamount: '' })
        this.stagegridData = [{ pStageno: '1', pStagename: 'Stage 01', pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" }];
      }
    }else if(PaymentStage=="Multiple Disbursement"){
      this.Ifmultidisbursal = true
      this.IfStageWisePaymentData = false
      this.paymentarray = []
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Multiple Disbursement");
      this.stagegridData = [];
      this.LoanDetailsErrorMessages.emiday="";
      this.FiApprovalForm.controls['emiday'].setValue(0)
      this.FiApprovalForm.controls['emiday'].setValidators([Validators.required])
      this.FiApprovalForm.controls['emiday'].updateValueAndValidity();
    }
    else{
       
      this.IfStageWisePaymentData = false
      this.paymentarray = []
      //const paymentcontrols = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
      // for (let i = paymentcontrols.length - 1; i >= 0; i--) {
      //   paymentcontrols.removeAt(i)
      //}
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")
      this.stagegridData = []
      this.Ifmultidisbursal = false;
      this.FiApprovalForm.controls['emiday'].setValue(0)
      this.FiApprovalForm.controls['emiday'].clearValidators();
      this.FiApprovalForm.controls['emiday'].updateValueAndValidity();
    }

  }
  AddToGrid() {
    debugger
    this.submitted = true
    if (this.FiApprovalForm.valid) {



      if (this.FiApprovalForm.controls.pChargename.value != "" && this.FiApprovalForm.controls.pAmount.value != "") {
        let IsValidStatus: boolean
        let chargename = this.FiApprovalForm.controls.pChargename.value
        let amount = this.FiApprovalForm.controls.pAmount.value

        for (var i = 0; i < this.TempGridDataChargesFees.length; i++) {
          if (this.TempGridDataChargesFees[i].pChargename != chargename) {
            IsValidStatus = true
          } else {
            IsValidStatus = false
            alert("Duplicate Charge Names Are Not Allowed")
            this.FiApprovalForm.controls.pChargename.setValue("")
            this.FiApprovalForm.controls.pAmount.setValue("")
            return
          }
        }
        if (IsValidStatus == true || IsValidStatus == undefined) {
          this.TempGridDataChargesFees.push({ "pChargename": chargename, "pChargereceivableamount": amount, "pChargewaiveoffamount": "0", "IsDisbursemenet": false, "IsBorrower": false, "ptypeofoperation": "CREATE" })
          this.FiApprovalForm.controls.pChargename.setValue("")
          this.FiApprovalForm.controls.pAmount.setValue("")
        }
      }
      else {
        alert("Select Charge Name And Enter Charge Amount")
      }
    }
  }
  DisbursementOrBorrowerCheck(event, data, type) {
    debugger
    if (type == "disbursement amount") {
      if (event.target.checked == true) {

        data.IsDisbursemenet = true;
        data.IsBorrower = false;
      } else if (event.target.checked == false) {
        data.IsDisbursemenet = false;
        data.pdepositstatus = false;
      }

    }
    else {
      if (event.target.checked == true) {
        data.IsDisbursemenet = false;
        data.IsBorrower = true;
      } else if (event.target.checked == false) {
        data.IsBorrower = false;
        data.pcancelstatus = false;
      }
    }
  }

  private getUnit(stageid) {
    return this.fb.group({
      id: [''],
      pStageno: [''],
      pStagename: [stageid],
      pPaymentreleasetype: ["Stage"],
      pPaymentreleasepercentage: ['', Validators.required],
      pPaymentreleaseamount: ['', Validators.required],
      ptypeofoperation: "CREATE"

    });
  }

  private getstageWiseUnit() {
    return this.fb.group({
      pStageno: [''],
      pStagename: [''],
      pPaymentreleasetype: ["Stage"],
      pPaymentreleasepercentage: ['', Validators.required],
      pPaymentreleaseamount: ['', Validators.required],
      ptypeofoperation: "CREATE"

    });
  }
  private getChargesUnit() {
    return this.fb.group({
      // id: [''],   
      pChargestype: [''],
      pChargename: [''],
      pChargereceivableamount: [''],
      pChargewaiveoffamount: [''],
      pChargepaymentmode: [''],

      pActualchargeamount: [''],

      pGsttype: [''],
      pGstcaltype: [''],
      pGstpercentage: [''],

      pCgstamount: [''],
      pCgstpercentage: [''],

      pSgstamount: [''],
      pSgstpercentage: [''],

      pUtgstamount: [''],
      pUtsgtpercentage: [''],

      pIgstamount: [''],
      pIgstpercentage: [''],

      pTotalgstamount: [''],
      pTotalchargeamount: [''],

      ptypeofoperation: "CREATE"

    });
    
  }


  //==========Start===========

  CheckGracePeriod(event) {
    let enteredGracePeriod = Number(event.target.value);
    if (enteredGracePeriod > 15) {
      this.toaster.warning("Grace period should be lessthan or equal to 15 days")
      this.FiApprovalForm.controls.pGraceperiod.setValue("")
    }

  }
  onChangeInterestRate(event) {
    debugger;
    let enteredInterestRate = this.FiApprovalForm.controls.pRateofinterest.value;
    //this.paramInterestRate = event.target.value;
    if (enteredInterestRate == 0 || enteredInterestRate == 0.0 || enteredInterestRate == 0.) {

      this.LoanDetailsErrorMessages.pRateofinterest = 'Please enter valid Interest Rate';
      this._CommonService.showWarningMessage(" Interest Rate should be greater than zero");
      this.FiApprovalForm.controls.pRateofinterest.setValue('')
      //this.interestFlag = false;
      this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    }
    else if (enteredInterestRate > 0) {
      if(this.paramInterestRate>0){
        if(enteredInterestRate>this.paramInterestRate || enteredInterestRate< this.mininterestrate){
          this._CommonService.showWarningMessage('Interest Rate between' +this.mininterestrate +' & '+ this.paramInterestRate);
       this.FiApprovalForm.controls.pRateofinterest.setValue('')
       this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }
      }
      else{
      this.FiApprovalForm.controls.pRateofinterest.setValue(this._CommonService.currencyformat(enteredInterestRate.toString().replace(/,/g, "").replace(/^0+/, '')));
      }
      //this.interestFlag = true;
    } else {
      this.LoanDetailsErrorMessages.pRateofinterest = '';
      //this.interestFlag = true;
    }
    if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined && this.mininterestrate != "" && this.mininterestrate != undefined) {
      this.getFiEmiSchesuleview()
    } else {
      this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    }
    //this.getFiEmiSchesuleview()
  }

  

  onTensureOfLoanChange(event) {
    debugger
    let enteredTensure = Number(event.target.value);
    if (enteredTensure == 0) {
      // this.tensureFlag = false;
      this.LoanDetailsErrorMessages.pTenureofloan = 'Tenure of Loan should be greater than zero';
      this._CommonService.showWarningMessage("Please enter valid Tenure of Loan");
      this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
      this.FiApprovalForm.controls.pTenureofloan.setValue("")
    } else if (enteredTensure > 0) {
      this.FiApprovalForm.controls.pTenureofloan.setValue(this._CommonService.currencyformat(enteredTensure.toString().replace(/,/g, "").replace(/^0+/, '')));
      //this.tensureFlag = true;
    }
    else {
      this.LoanDetailsErrorMessages.pTenureofloan = '';
      this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
      //this.tensureFlag = true;
    }
    // if( this.FiApprovalForm.value.pPartprinciplepaidinterval) {
    //   this.FiLoanDetailsForm.patchValue({
    //     pPartprinciplepaidinterval : ''
    //   })
    // }

    //this.GetChargesData();
    //this.getInterestRates();
    this.GetInterestRateandChargesData();
    // if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined) {
    //   this.getFiEmiSchesuleview()
    // } else {
    //   this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    // }
  }

  getInterestRates() {
    debugger
    let reqAmount = this._CommonService.functiontoRemoveCommas(this.FiApprovalForm.value.pApprovedloanamount)
    let data = {
      pLoanid: this.paramLoanId ? this.paramLoanId : 0,
      pContacttype: this.paramContactType ? this.paramContactType : '',
      pApplicanttype: this.paramApplicantType ? this.paramApplicantType : '',
      pLoanpayin: this.paramLoanPayIn ? this.paramLoanPayIn : '',
      pInteresttype: this.paramInterestType ? this.paramInterestType : '',
      pAmountrequested: this.paramRequiredAmount ? this.paramRequiredAmount : 0,
      pDateofapplication: this.FiApprovalForm.controls.pApproveddate.value,
      pTenureofloan: Number(this.FiApprovalForm.value.pTenureofloan) ? Number(this.FiApprovalForm.value.pTenureofloan) : 0,
      pschemeid: this.paramSchemeId ? this.paramSchemeId : 0
    }
    this._FIIndividualService.GetInterestRates(data).subscribe(rates => {
      debugger
      this.IntrestRatesList = rates;
      if (this.IntrestRatesList && this.IntrestRatesList.length > 0) {
        this.paramInterestRate = this.IntrestRatesList[0].pRateofinterest;
        this.mininterestrate=this.IntrestRatesList[0].pMinInterest;
        if(Number(this.IntrestRateLable)>=Number(this.mininterestrate) && Number(this.IntrestRateLable)<=Number(this.paramInterestRate)){
          this.FiApprovalForm.patchValue({
          pRateofinterest:this.FiApprovalForm.controls.pRateofinterest.value
        });
        this.onChangeInterestRate(null);
        }
        else{
        this.FiApprovalForm.patchValue({
          pRateofinterest: this.IntrestRatesList[0].pMinInterest
        });
        }
        if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined && this.mininterestrate !="" && this.mininterestrate!=undefined) {
          this.getFiEmiSchesuleview()
        } else {
          this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }
      }
      else {
        this.FiApprovalForm.controls.pRateofinterest.setValue('');
        this.paramInterestRate = undefined
        this.mininterestrate=undefined;
        this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        this.LoanDetailsErrorMessages.pRateofinterest = ''
      }

    })
  }

  GetInterestRateandChargesData() {
    //Getting Interest Rates
    let data = {
      pLoanid: this.paramLoanId ? this.paramLoanId : 0,
      pContacttype: this.paramContactType ? this.paramContactType : '',
      pApplicanttype: this.paramApplicantType ? this.paramApplicantType : '',
      pLoanpayin: this.paramLoanPayIn ? this.paramLoanPayIn : '',
      pInteresttype: this.paramInterestType ? this.paramInterestType : '',
      pAmountrequested: this.paramRequiredAmount ? this.paramRequiredAmount : 0,
      pDateofapplication: this.FiApprovalForm.controls.pApproveddate.value,
      pTenureofloan: Number(this.FiApprovalForm.value.pTenureofloan) ? Number(this.FiApprovalForm.value.pTenureofloan) : 0,
      pschemeid: this.paramSchemeId ? this.paramSchemeId : 0
    }

    let GetInterestRates = this._FIIndividualService.GetInterestRates(data)
    let GetChargesDatatoGrid = this._ApprovalService.GetChargesDatatoGrid(this.paramLoanName, this.paramRequiredAmount, this.paramTenure, this.paramApplicantType, this.paramLoanPayIn, this.paramTransactionDate,this.paramSchemeId)

    forkJoin([GetInterestRates, GetChargesDatatoGrid]).subscribe(result => {
   debugger;
      //Binding Interest Rates
      this.IntrestRatesList = result[0];
      if (this.IntrestRatesList && this.IntrestRatesList.length > 0) {
        this.paramInterestRate = this.IntrestRatesList[0].pRateofinterest;
        this.mininterestrate=this.IntrestRatesList[0].pMinInterest;
        if(Number(this.IntrestRateLable)>=Number(this.mininterestrate) && Number(this.IntrestRateLable)<=Number(this.paramInterestRate)){
          this.FiApprovalForm.patchValue({
          pRateofinterest:this.FiApprovalForm.controls.pRateofinterest.value
        });
        this.onChangeInterestRate(null);
        }
        else{
        this.FiApprovalForm.patchValue({
          pRateofinterest: this.IntrestRatesList[0].pMinInterest
        });
        }
        if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined  && this.mininterestrate != "" && this.mininterestrate != undefined) {
          this.getFiEmiSchesuleview()
        } else {
          this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }
      }
      else {
        this.FiApprovalForm.controls.pRateofinterest.setValue('');
        this.paramInterestRate = undefined
        this.mininterestrate=undefined;
        this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        this.LoanDetailsErrorMessages.pRateofinterest = ''
      }
      //End

      //Binding Charges Data to Grid
      this.ChargesDatatoGrid = result[1]
      if (this.ChargesDatatoGrid.length > 0) {
        this.TempGridDataChargesFees = []
        this.TempGridDataChargesFeesCopy = []
        for (var i = 0; i < this.ChargesDatatoGrid.length; i++) {

          this.TempGridDataChargesFees.push(
            {
              "pChargename": this.ChargesDatatoGrid[i].pChargename,

              "PchargeamountTemp": this.ChargesDatatoGrid[i].pChargeamount,
              "pChargereceivableamount": this.ChargesDatatoGrid[i].pTotalchargeamount,

              "pActualchargeamount": this.ChargesDatatoGrid[i].pActualchargeamount,
              "pChargewaiveoffamount": "0",

              "pGstcaltype": this.ChargesDatatoGrid[i].pGstcaltype,
              "pGstpercentage": this.ChargesDatatoGrid[i].pGstpercentage,
              "pGsttype": this.ChargesDatatoGrid[i].pGsttype,

              "pIgstamount": this.ChargesDatatoGrid[i].pIgstamount,
              "pIgstpercentage": this.ChargesDatatoGrid[i].pIgstpercentage,

              "pSgstamount": this.ChargesDatatoGrid[i].pSgstamount,
              "pSgstpercentage": this.ChargesDatatoGrid[i].pSgstpercentage,

              "pCgstamount": this.ChargesDatatoGrid[i].pCgstamount,
              "pCgstpercentage": this.ChargesDatatoGrid[i].pCgstpercentage,


              "pTotalchargeamount": this.ChargesDatatoGrid[i].pTotalchargeamount,
              "pTotalgstamount": this.ChargesDatatoGrid[i].pTotalgstamount,

              "pTotalgstamountTemp": this.ChargesDatatoGrid[i].pTotalgstamount,

              "pUtgstamount": this.ChargesDatatoGrid[i].pUtgstamount,
              "pUtsgtpercentage": this.ChargesDatatoGrid[i].pUtsgtpercentage,

              "IsDisbursemenet": false,
              "IsBorrower": false,
              "pChargepaymentmode": "A",
              "ptypeofoperation": "CREATE"

            })

          for (var j = 0; j < this.TempGridDataChargesFees.length; j++) {
            if (this.TempGridDataChargesFees[j].pGstcaltype == "Include") {
              this.TempGridDataChargesFees[j].pTotalgstamountTemp = 0
              debugger;
            }
          }
          $('#waveamount' + i + '').val('')
        }
        this.TempGridDataChargesFeesCopy = JSON.parse(JSON.stringify(this.TempGridDataChargesFees))
      }
      else {
        this.TempGridDataChargesFees = []
      }
      //End
    })

  }

  GetChargesData() {
    debugger

    if (this.paramLoanName != undefined && this.paramRequiredAmount != undefined && this.paramTenure != undefined && this.paramApplicantType != undefined && this.paramLoanPayIn != undefined && this.paramTransactionDate != undefined) {

    this._ApprovalService.GetChargesDatatoGrid(this.paramLoanName, this.paramRequiredAmount, this.paramTenure, this.paramApplicantType, this.paramLoanPayIn, this.paramTransactionDate,this.paramSchemeId).subscribe(res => {
      debugger
      this.ChargesDatatoGrid = res
      if (this.ChargesDatatoGrid.length > 0) {
        this.TempGridDataChargesFees = []
        this.TempGridDataChargesFeesCopy = []
        for (var i = 0; i < this.ChargesDatatoGrid.length; i++) {


          this.TempGridDataChargesFees.push(
            {
              "pChargename": this.ChargesDatatoGrid[i].pChargename,

              "PchargeamountTemp": this.ChargesDatatoGrid[i].pChargeamount,
              "pChargereceivableamount": this.ChargesDatatoGrid[i].pTotalchargeamount,

              "pActualchargeamount": this.ChargesDatatoGrid[i].pActualchargeamount,
              "pChargewaiveoffamount": "0",

              "pGstcaltype": this.ChargesDatatoGrid[i].pGstcaltype,
              "pGstpercentage": this.ChargesDatatoGrid[i].pGstpercentage,
              "pGsttype": this.ChargesDatatoGrid[i].pGsttype,

              "pIgstamount": this.ChargesDatatoGrid[i].pIgstamount,
              "pIgstpercentage": this.ChargesDatatoGrid[i].pIgstpercentage,

              "pSgstamount": this.ChargesDatatoGrid[i].pSgstamount,
              "pSgstpercentage": this.ChargesDatatoGrid[i].pSgstpercentage,

              "pCgstamount": this.ChargesDatatoGrid[i].pCgstamount,
              "pCgstpercentage": this.ChargesDatatoGrid[i].pCgstpercentage,


              "pTotalchargeamount": this.ChargesDatatoGrid[i].pTotalchargeamount,
              "pTotalgstamount": this.ChargesDatatoGrid[i].pTotalgstamount,

              "pTotalgstamountTemp": this.ChargesDatatoGrid[i].pTotalgstamount,

              "pUtgstamount": this.ChargesDatatoGrid[i].pUtgstamount,
              "pUtsgtpercentage": this.ChargesDatatoGrid[i].pUtsgtpercentage,

              "IsDisbursemenet": false,
              "IsBorrower": false,
              "pChargepaymentmode": "A",
              "ptypeofoperation": "CREATE"

            })

          for (var j = 0; j < this.TempGridDataChargesFees.length; j++) {
            if (this.TempGridDataChargesFees[j].pGstcaltype == "Include") {
              this.TempGridDataChargesFees[j].pTotalgstamountTemp = 0
            }
          }
          $('#waveamount' + i + '').val('')
        }
        this.TempGridDataChargesFeesCopy = JSON.parse(JSON.stringify(this.TempGridDataChargesFees))
      }
      else {
        this.TempGridDataChargesFees = []
      }
      // this.getInterestRates();
      // this.getFiEmiSchesuleview()
    })
      }
  }

  onChangeInterestType(event) {
    debugger
    this.paramInterestType = event.target.value;
    this.getInterestRates();
    // if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined) {
    //   this.getFiEmiSchesuleview()
    // } else {
    //   this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    // }

  }
  changeLoanPayIn(event) {
    debugger
    let payin = event.currentTarget.value;
    this.paramLoanPayIn = payin
    if (this.ApplicationData[0].pLoaninstalmentpaymentmode == "Equated Instalments") {
    if (this.paramLoanPayIn == "Monthly" || this.paramLoanPayIn == "Quarterly" || this.paramLoanPayIn == "Half-Yearly" || this.paramLoanPayIn == "Yearly") {

      this.checkedsinglestage = true
      this.DisableSinglePayment = false
      this.DisableStagePayment = false
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")

      this.GracePeriodShowOrHide = true
    } 
  }else {

      this.checkedsinglestage = true
      this.DisableSinglePayment = false
      this.DisableStagePayment = true
      this.FiApprovalForm.controls.pDisbursementpayinmode.setValue("Single Payment")

      this.GracePeriodShowOrHide = false
    }
    debugger
    this._FIIndividualService.getLoanInterestTypes(this.paramLoanId, this.paramSchemeId,  this.paramContactType, this.paramApplicantType,this.paramLoanPayIn).subscribe(interestRates => {
      if (interestRates != null) {
        this.LoanInterestratetypes = interestRates;
      }
    });


    this.GetInterestRateandChargesData();
    this.onEnteredAmountValue(null);
    // this.GetChargesData()
    //  this.getInterestRates();

    // this.getFiEmiSchesuleview()
    // if (this.paramInterestType != "" && this.paramLoanPayIn != "" && this.paramTenure != "" && this.paramRequiredAmount != "" && this.paramInterestRate != "" && this.paramInterestRate != undefined) {
    //   this.getFiEmiSchesuleview()
    // } else {
    //   this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    // }
    // this.getLoanInstallmentModes((this.loadPayIn ? this.loadPayIn : ''),(this.interestType ? this.interestType : ''));
  }

  onEnteredAmountValue(event) {
    debugger
    //     let Amount = event.currentTarget.value;

    // this.paramRequiredAmount = this._CommonService.removeCommasForEntredNumber(Amount)

    if (this.FiApprovalForm.controls.pApprovedloanamount.value == 0) {
      // this.amountRequestedFlag = false;
      this.LoanDetailsErrorMessages.pApprovedloanamount = 'Amount Requested should be greater than zero';
      this._CommonService.showWarningMessage("Please enter valid Amount Requested");
      this.TempGridDataChargesFees = []
      this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
    }
    else {
      this.FiApprovalForm.controls.pApprovedloanamount.setValue(this._CommonService.currencyformat(this.FiApprovalForm.controls.pApprovedloanamount.value.toString().replace(/,/g, "").replace(/^0+/, '')));

      this.LoanDetailsErrorMessages.pApprovedloanamount = '';
      let validateFlag: boolean = false;
      this._FIIndividualService.getLoanMinAndMaxValues(this.paramLoanId, this.paramContactType, this.paramApplicantType, this.paramLoanPayIn, this.paramInterestType, this.paramSchemeId).subscribe((response: any) => {
        debugger
        this.minValue = Number(response[0].pMinloanamount);
        this.maxValue = Number(response[0].pMaxloanamount);
        //this.enteredAmountRequestedValue = this._CommonService.functiontoRemoveCommas(this.FiApprovalForm.controls.pApprovedloanamount.value);
        this.enteredAmountRequestedValue = Number(this._CommonService.functiontoRemoveCommas(this.FiApprovalForm.controls.pApprovedloanamount.value));
        this.paramRequiredAmount = this.enteredAmountRequestedValue
        if (this.minValue <= this.enteredAmountRequestedValue && this.enteredAmountRequestedValue <= this.maxValue) {
          
          this.GetInterestRateandChargesData();
          validateFlag = true;
          this.LoanDetailsErrorMessages.pApprovedloanamount = '';
          this.FiApprovalForm.controls['pApprovedloanamount'].clearValidators();
          this.FiApprovalForm.controls['pApprovedloanamount'].updateValueAndValidity();
          this.Sactionedamount = this.enteredAmountRequestedValue
          // this.GetChargesData()
        }
        else if (this.minValue == 0 && this.maxValue == 0) {
          validateFlag = true;
          // this.getInterestRates();
          this.GetInterestRateandChargesData();
          this.LoanDetailsErrorMessages.pApprovedloanamount = '';
          this.FiApprovalForm.controls['pApprovedloanamount'].clearValidators();
          this.FiApprovalForm.controls['pApprovedloanamount'].updateValueAndValidity();
          this.Sactionedamount = this.enteredAmountRequestedValue
          //this.GetChargesData()
        }
        else {
          validateFlag = false;
          // this.FiApprovalForm.controls['pApprovedloanamount'].setValue('')
          this.FiApprovalForm.controls['pApprovedloanamount'].setValidators([Validators.required])
          this.FiApprovalForm.controls['pApprovedloanamount'].updateValueAndValidity();
          this.LoanDetailsErrorMessages.pApprovedloanamount = "Amount should be in between " + this._CommonService.currencyformat(this.minValue) + ' and ' + this._CommonService.currencyformat(this.maxValue);
          this.TempGridDataChargesFees = []
          this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }
        if (validateFlag == false) {

          this._CommonService.showWarningMessage("Amount should be in between " + this._CommonService.currencyformat(this.minValue) + ' and ' + this._CommonService.currencyformat(this.maxValue));
          this.TempGridDataChargesFees = []
          this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }


      })

      //this.getInterestRates();



    }


  }

  getFiLoanData(LoanidforSchems, pContactType, pApplicantType, schemeid,loanpayin) {
    this._FIIndividualService.getLoanpayins(LoanidforSchems, pContactType, pApplicantType, schemeid).subscribe(payins => {
      if (payins != null) {
        this.Loanpayins = payins
      }
    });
    this._FIIndividualService.getLoanInterestTypes(LoanidforSchems, schemeid, pContactType, pApplicantType, loanpayin).subscribe(interestRates => {
      if (interestRates != null) {
        this.LoanInterestratetypes = interestRates;
      }
    });
  }

  // getFiEmiSchesuleview() {
  //     debugger
  //     this.gridView = [];
  //     try {
  //         let isValid = true;

  //         if (this.checkValidations(this.FiApprovalForm, isValid)) {
  //             this.emiModelShowFlag = true
  //             let loanamount = ((this.FiApprovalForm.controls['pApprovedloanamount'].value).toString()).replace(/,/g, "");
  //             let interesttype = this.FiApprovalForm.controls['pInteresttype'].value;
  //             let loanpayin = this.FiApprovalForm.controls['pLoanpayin'].value;
  //             let interestrate = this.FiApprovalForm.controls['pRateofinterest'].value;
  //             let tenureofloan = this.FiApprovalForm.controls['pTenureofloan'].value;
  //             let Loaninstalmentmode = this.Loaninstalmentpaymentmode;

  //             this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode, this.emiprincipalpayinterval).subscribe(response => {
  //                 if (response != null) {
  //                     this.fiEmiSchesuleview = response;
  //                     this.modalData = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO;
  //                     this.calculateAggregat(this.modalData);
  //                     this.loadEmiDatas();
  //                     this.installmentAmount = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO[0] ? this._CommonService.currencyformat(this.fiEmiSchesuleview.lstInstalmentsgenerationDTO[0].pInstalmentamount) : 0;

  //                     if (this.installmentAmount) {
  //                         let Instalmentamount = this._CommonService.currencyformat(this.installmentAmount)
  //                         this.FiApprovalForm.controls.pInstallmentamount.setValue(Instalmentamount)
  //                         //this.FiApprovalForm.value.pInstalmentamount = this.installmentAmount;
  //                     }

  //                 } else {
  //                     this._CommonService.showErrorMessage('No data Foound');
  //                 }
  //             })
  //         } else {
  //             this.emiModelShowFlag = false
  //             // this.BlurEventAllControll(this.FiApprovalForm);
  //         }

  //     } catch (error) {
  //         this._CommonService.showErrorMessage(error);
  //     }

  // }


  getFiEmiSchesuleview() {
    debugger
    this.gridView = [];
    try {
      let pdate = <FormGroup>this.FiApprovalForm['controls']['pApproveddate'];
      pdate.clearValidators();
      pdate.updateValueAndValidity();
      let prem = <FormGroup>this.FiApprovalForm['controls']['pRemarks'];
      prem.clearValidators();
      prem.updateValueAndValidity();
      let isValid = true;

      if (this.checkValidations(this.FiApprovalForm, isValid)) {

        /////
        this._FIIndividualService.getLoanMinAndMaxValues(this.paramLoanId, this.paramContactType, this.paramApplicantType, this.paramLoanPayIn, this.paramInterestType, this.paramSchemeId).subscribe((response: any) => {
          debugger
          this.minValue = Number(response[0].pMinloanamount);
          this.maxValue = Number(response[0].pMaxloanamount);
          this.enteredAmountRequestedValue = Number(this._CommonService.functiontoRemoveCommas(this.FiApprovalForm.controls.pApprovedloanamount.value));

          if (this.minValue <= this.enteredAmountRequestedValue && this.enteredAmountRequestedValue <= this.maxValue) {

            // this.emiModelShowFlag = true
            $('#emiModel').modal('show');
            let loanamount = ((this.FiApprovalForm.controls['pApprovedloanamount'].value).toString()).replace(/,/g, "");
            let interesttype = this.FiApprovalForm.controls['pInteresttype'].value;
            let loanpayin = this.FiApprovalForm.controls['pLoanpayin'].value;
            let interestrate = this.FiApprovalForm.controls['pRateofinterest'].value;
            let tenureofloan = this.FiApprovalForm.controls['pTenureofloan'].value;
            let emitype = this.FiApprovalForm.controls['emitype'].value;
            let Loaninstalmentmode = this.Loaninstalmentpaymentmode;
            this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode, this.emiprincipalpayinterval,emitype).subscribe(response => {
              if (response != null) {
                this.fiEmiSchesuleview = response;
                this.modalData = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO;
                this.calculateAggregat(this.modalData);
                this.loadEmiDatas();
                let pInstalmentamounts = [];
                if (this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.length > 0) {
                  this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.forEach(element => {
                    pInstalmentamounts.push(Number(element.pInstalmentamount));
                  });
                  this.installmentAmount = pInstalmentamounts.length ? this._CommonService.currencyformat(Math.max(...pInstalmentamounts)) : 0;
                }

                if (this.installmentAmount) {
                  let Instalmentamount = this._CommonService.currencyformat(this.installmentAmount)
                  this.FiApprovalForm.controls.pInstallmentamount.setValue(Instalmentamount)
                }
                this.emiModelShowFlag = true
              }
              else {
                this._CommonService.showErrorMessage('No data Found');
              }
            })
          }
          else if (this.minValue == 0 && this.maxValue == 0) {

            // this.emiModelShowFlag = true
            $('#emiModel').modal('show');
            let loanamount = ((this.FiApprovalForm.controls['pApprovedloanamount'].value).toString()).replace(/,/g, "");
            let interesttype = this.FiApprovalForm.controls['pInteresttype'].value;
            let loanpayin = this.FiApprovalForm.controls['pLoanpayin'].value;
            let interestrate = this.FiApprovalForm.controls['pRateofinterest'].value;
            let tenureofloan = this.FiApprovalForm.controls['pTenureofloan'].value;
            let Loaninstalmentmode = this.Loaninstalmentpaymentmode;
            let emitype = this.FiApprovalForm.controls['emitype'].value;
            this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode, this.emiprincipalpayinterval,emitype).subscribe(response => {
              debugger
              if (response != null) {
                this.fiEmiSchesuleview = response;
                this.modalData = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO;
                this.calculateAggregat(this.modalData);
                this.loadEmiDatas();
                let pInstalmentamounts = [];
                if (this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.length > 0) {
                  this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.forEach(element => {
                    pInstalmentamounts.push(Number(element.pInstalmentamount));
                  });
                  this.installmentAmount = pInstalmentamounts.length ? this._CommonService.currencyformat(Math.max(...pInstalmentamounts)) : 0;
                }

                if (this.installmentAmount) {
                  let Instalmentamount = this._CommonService.currencyformat(this.installmentAmount)
                  this.FiApprovalForm.controls.pInstallmentamount.setValue(Instalmentamount)
                }
                this.emiModelShowFlag = true
              }
              else {
                this._CommonService.showErrorMessage('No data Found');
              }
            })

          }
          else {
            this.FiApprovalForm.controls['pApprovedloanamount'].setValue('')
            this.FiApprovalForm.controls['pApprovedloanamount'].setValidators([Validators.required])
            this.FiApprovalForm.controls['pApprovedloanamount'].updateValueAndValidity();
            this.LoanDetailsErrorMessages.pApprovedloanamount = "Amount should be in between " + this._CommonService.currencyformat(this.minValue) + ' and ' + this._CommonService.currencyformat(this.maxValue);
            this.TempGridDataChargesFees = []
            this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
          }
        })
      }
      else {
        // this.emiModelShowFlag = false
      }

    } catch (error) {
      this._CommonService.showErrorMessage(error);
    }

  }



  calculateAggregat(modalData) {
    debugger
    let totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentprinciple)), 0);
    this.emiAggregates['pInstalmentprinciple'] = totalamount;

    totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentinterest)), 0);
    this.emiAggregates['pInstalmentinterest'] = totalamount;


    totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentamount)), 0);
    this.emiAggregates['pInstalmentamount'] = totalamount;
  }
  private loadEmiDatas(): void {
    this.currencyFormatModalData = [];
    for (let index = 0; index < this.modalData.length; index++) {
      let dataModal = {
        pInstalmentno: this.modalData[index].pInstalmentno,
        pInstalmentprinciple: this._CommonService.currencyformat(this.modalData[index].pInstalmentprinciple),
        pInstalmentinterest: this._CommonService.currencyformat(this.modalData[index].pInstalmentinterest),
        pInstalmentamount: this._CommonService.currencyformat(this.modalData[index].pInstalmentamount)
      }
      this.currencyFormatModalData.push(dataModal);
      this.gridView = this.currencyFormatModalData;
    }

  }


  //Checking validations Start
  // GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
  //     try {
  //         let formcontrol;
  //         formcontrol = formGroup.get(key);
  //         if (formcontrol) {
  //             if (formcontrol instanceof FormGroup) {
  //                 this.checkValidations(formcontrol, isValid)
  //             }
  //             else if (formcontrol.validator && key != "pApproveddate" && key != "pDisbursementpayinmode" && key != "pGraceperiod") {
  //                 this.LoanDetailsErrorMessages[key] = '';
  //                 if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
  //                     let lablename;
  //                     lablename = (document.getElementById(key) as HTMLInputElement).title;
  //                     let errormessage;
  //                     for (const errorkey in formcontrol.errors) {
  //                         if (errorkey) {
  //                             errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
  //                             this.LoanDetailsErrorMessages[key] += errormessage + ' ';
  //                             isValid = false;
  //                         }
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     catch (e) {
  //         // this.showErrorMessage(e);
  //         return false;
  //     }
  //     return isValid;
  // }
  // showErrorMessage(errormsg: string) {
  //     this._CommonService.showErrorMessage(errormsg);
  // }
  // BlurEventAllControll(fromgroup: FormGroup) {
  //     try {
  //         Object.keys(fromgroup.controls).forEach((key: string) => {
  //             this.setBlurEvent(fromgroup, key);
  //         })
  //     }
  //     catch (e) {
  //         this.showErrorMessage(e);
  //         return false;
  //     }
  // }
  // setBlurEvent(fromgroup: FormGroup, key: string) {
  //     try {
  //         let formcontrol;
  //         formcontrol = fromgroup.get(key);
  //         if (formcontrol) {
  //             if (formcontrol instanceof FormGroup) {
  //                 this.BlurEventAllControll(formcontrol)
  //             }
  //             else {
  //                 if (formcontrol.validator)
  //                     fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
  //             }
  //         }
  //     }
  //     catch (e) {
  //         this.showErrorMessage(e);
  //         return false;
  //     }
  // }
  // checkValidations(group: FormGroup, isValid: boolean): boolean {
  //     try {
  //         Object.keys(group.controls).forEach((key: string) => {
  //             isValid = this.GetValidationByControl(group, key, isValid);
  //         })
  //     }
  //     catch (e) {

  //         this.showErrorMessage(e);
  //         return false;
  //     }
  //     return isValid;
  // }

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
          this.LoanDetailsErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LoanDetailsErrorMessages[key] += errormessage + ' ';
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

  //Checking validations End
  //==========End===========
  getControls() {
    return (<FormArray>this.FiApprovalForm.get('lstStagewisepayments')).controls;
  }

  get f() { return this.FiApprovalForm.controls; }

  private addUnit() {
    debugger
    this.Sid++
    this.stageIncrease++

    let i = this.FiApprovalForm.controls['lstStagewisepayments']["controls"].length - 1
    this.id = this.id + 1;
    this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls']['id'].setValue(this.id)
    this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls']['pStageno'].setValue(this.id)
    let amountreceived = this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleaseamount'].value;
    amountreceived = this._CommonService.removeCommasForEntredNumber(amountreceived)
    this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleaseamount'].setValue(amountreceived);

    this.paymentarray = this.paymentarray.concat(this.FiApprovalForm['controls']['lstStagewisepayments'].value)

    if (this.SavedStatusType != "Reject") {

      let a = this.paymentarray.length
      this.Stageno = a + 1
      this.stageid = this.Stage + "" + this.Stageno

      const control = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
      if (this.PercentageTotal != 100) {
        control.push(this.getUnit(this.stageid));
      }

    }
  }


  CalCulateStageAmount($event, rowData, rowIndex) {
    debugger;
    let percentageEnterd = $event.currentTarget.value
    if (percentageEnterd > 0) {
      let NewLength = this.stagegridData.length + 1;
      let amt = (+percentageEnterd * this.Sactionedamount / 100)
      rowData["pPaymentreleasepercentage"] = percentageEnterd;
      rowData["pPaymentreleaseamount"] = amt;
      let percentageadded = 0;
      this.stagegridData.filter(function (data) {
        if (data["pPaymentreleasepercentage"] !== undefined && data["pPaymentreleasepercentage"] != null)
          percentageadded += parseFloat(data["pPaymentreleasepercentage"])
      })
      this.PercentageTotal = percentageadded;
      this.RemainingPercentage = 100 - this.PercentageTotal;

      this.stagegridData.push({ pStageno: NewLength, pStagename: 'Stage' + NewLength + '', pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" })
    }
  }

  onKeydown(event, rowData, rowIndex) {
    debugger

    let element = event.srcElement.nextElementSibling;

    if (event.key === "Enter" || event.key === "Tab") {
      let percentageEnterd = $('#percentage' + rowIndex + '').val()
      if (percentageEnterd > 0) {

        if (parseFloat(percentageEnterd) <= this.RemainingPercentage) {
            let NewLength = this.stagegridData.length + 1;
            let stagename;
            if (NewLength < 10)
                stagename = '0' + NewLength.toString();
            else
                stagename = NewLength.toString();

          let amt = (+percentageEnterd * this.Sactionedamount / 100)
          rowData["pPaymentreleasepercentage"] = percentageEnterd;
          rowData["pPaymentreleaseamount"] = Math.ceil(amt);
          let percentageadded = 0;
          this.stagegridData.filter(function (data) {
            if (data["pPaymentreleasepercentage"] !== undefined && data["pPaymentreleasepercentage"] != null)
              percentageadded += parseFloat(data["pPaymentreleasepercentage"])
          })
          this.PercentageTotal = percentageadded;
          this.RemainingPercentage = 100 - this.PercentageTotal;
          if (this.RemainingPercentage == 0) {
            let Amountadd = 0;
            this.stagegridData.filter(function (data) {
              Amountadd += parseFloat(data["pPaymentreleaseamount"])
            })
            let TotaldiffAmount = Amountadd - this.Sactionedamount;
            let lastlenth = parseFloat(this.stagegridData.length.toString()) - 1;
            this.stagegridData[lastlenth]["pPaymentreleaseamount"] = this.stagegridData[lastlenth]["pPaymentreleaseamount"] - TotaldiffAmount
          }
          $('#percentage' + rowIndex + '').attr("disabled", true);
          if (this.RemainingPercentage != 0)
              this.stagegridData.push({ pStageno: NewLength, pStagename: 'Stage ' + stagename + '', pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" })

          // this.stagegridData[1].pPaymentreleasepercentage.focus()
        }
        else {
          $('#percentage' + rowIndex + '').val('')
          this.toaster.warning("Percentage should be equal to Remaining Percentage")
        }
      }
      else {
        $('#percentage' + rowIndex + '').val('')
        this.toaster.warning("Percentage should be greater than 0(zero)")
      }
    }

  }

  AddNewStage(rowData, rowIndex) {
    debugger;

    let percentageEnterd = $('#percentage' + rowIndex + '').val()
    if (percentageEnterd > 0) {

      if (parseFloat(percentageEnterd) <= this.RemainingPercentage) {
          let NewLength = this.stagegridData.length + 1;
          let stagename;
          if (NewLength < 10)
              stagename = '0' + NewLength.toString();
          else
              stagename = NewLength.toString();
        let amt = (+percentageEnterd * this.Sactionedamount / 100)
        rowData["pPaymentreleasepercentage"] = percentageEnterd;
        rowData["pPaymentreleaseamount"] = Math.ceil(amt);
        let percentageadded = 0;
        this.stagegridData.filter(function (data) {
          if (data["pPaymentreleasepercentage"] !== undefined && data["pPaymentreleasepercentage"] != null)
            percentageadded += parseFloat(data["pPaymentreleasepercentage"])
        })
        this.PercentageTotal = percentageadded;
        this.RemainingPercentage = 100 - this.PercentageTotal;
        if (this.RemainingPercentage == 0) {
          let Amountadd = 0;
          this.stagegridData.filter(function (data) {
            Amountadd += parseFloat(data["pPaymentreleaseamount"])
          })
          let TotaldiffAmount = Amountadd - this.Sactionedamount;
          let lastlenth = parseFloat(this.stagegridData.length.toString()) - 1;
          this.stagegridData[lastlenth]["pPaymentreleaseamount"] = this.stagegridData[lastlenth]["pPaymentreleaseamount"] - TotaldiffAmount
        }
        $('#percentage' + rowIndex + '').attr("disabled", true);
        if (this.RemainingPercentage != 0)
            this.stagegridData.push({ pStageno: NewLength, pStagename: 'Stage ' + stagename + '', pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" })
      } else {
        $('#percentage' + rowIndex + '').val('')
        this.toaster.warning("Percentage should be equal to Remaining Percentage")
      }
    } else {
      $('#percentage' + rowIndex + '').val('')
      this.toaster.warning("Percentage should be greater than 0(zero)")
    }

  }

  RemoveStage(dataItem, rowIndex) {
    debugger;
    let gridData = this.stagegridData;
    gridData.splice(rowIndex, 1);
    this.stagegridData = [];
    this.stagegridData = gridData;
    let empty = ""
    let percentageadded = 0;
    let i = 0;
    let Sactionedamountnew = this.Sactionedamount
    this.stagegridData.filter(function (data) {
      i++;

      data["pStageno"] = i
      data["pStagename"] = "Stage" + i;
      let newamt = (+data["pPaymentreleasepercentage"] * Sactionedamountnew / 100)
      data["pPaymentreleasepercentage"] = data["pPaymentreleasepercentage"];
      data["pPaymentreleaseamount"] = Math.ceil(newamt);
      let j = i - 1;
      $('#percentage' + j + '').val(data["pPaymentreleasepercentage"])

      if (data["pPaymentreleasepercentage"] != "" && data["pPaymentreleasepercentage"] !== undefined && data["pPaymentreleasepercentage"] != null) {
        $('#percentage' + j + '').attr("disabled", true);
        percentageadded += parseFloat(data["pPaymentreleasepercentage"]);
        empty = "No";
      } else {

        $('#percentage' + j + '').attr("disabled", false);
        empty = "Yes";
      }
    })
    this.PercentageTotal = percentageadded;
    this.RemainingPercentage = 100 - this.PercentageTotal;
    if (this.stagegridData.length == 0) {
      this.stagegridData = [{ pStageno: '1', pStagename: 'Stage1', pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" }];
      $('#percentage0').attr("disabled", false);
      $('#percentage0').val('')
    }
    if (this.RemainingPercentage != 100 && empty == "No") {
      let A = parseFloat(this.stagegridData.length.toString()) + 1;
      let stagename = 'Stage' + A

      this.stagegridData.push({ pStageno: A, pStagename: stagename, pPaymentreleasepercentage: '', pPaymentreleaseamount: '', ptypeofoperation: "CREATE", pPaymentreleasetype: "Stage" });
      let newlen = parseFloat(this.stagegridData.length.toString()) - 1
      $('#percentage' + newlen + '').attr("disabled", false);
      $('#percentage' + newlen + '').val('')
    }

  }

  CheckPercentage($event, rowIndex) {
    let percentageEnterd = $event.currentTarget.value
    if (+percentageEnterd > this.RemainingPercentage) {
      this.toaster.warning("Percentage should be equal to Remaining Percentage")
      $('#percentage' + rowIndex + '').val('')
    }
  }

  removepayment(i: any) {
    debugger
    this.stageIncrease = 0
    if (this.FiApprovalForm['controls']['lstStagewisepayments']['controls'].length > 0) {
      if (this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls']['pPaymentreleasepercentage'].value != "") {
        let amount = this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls'].pPaymentreleaseamount.value
        amount = this._CommonService.removeCommasForEntredNumber(amount)
        this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls'].pPaymentreleaseamount.setValue(amount)
        this.paymentarray = this.paymentarray.concat(this.FiApprovalForm['controls']['lstStagewisepayments'].value)
      }
    }
    this.paymentarray = this.paymentarray.filter(person => person.id != i.id);
    let p = i.pPaymentreleasepercentage
    let q = +p
    this.PercentageTotal = this.PercentageTotal - q
    this.RemainingPercentage = 100 - this.PercentageTotal
    if (this.RemainingPercentage < 100) {
      this.RemainingPercentageShowOrHide = true
      this.DisablePercentageEntry = false
    }
    for (var m = 0; m < this.paymentarray.length; m++) {
      this.stageIncrease++
      this.paymentarray[m].pStagename = this.Stage + "" + this.stageIncrease
      this.paymentarray[m].id = this.stageIncrease
      this.paymentarray[m].pStageno = this.stageIncrease
      this.Sid = this.stageIncrease
    }
    if (this.PercentageTotal < 100) {
      const paymentcontrols = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
      for (let i = paymentcontrols.length - 1; i >= 0; i--) {
        paymentcontrols.removeAt(i)
      }
      const control = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
      control.push(this.getUnit(this.newstage));
      this.paymentshow = true;
    }
    this.newstage = this.Stage + "" + ++this.stageIncrease
    this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][0]['controls']['pStagename'].setValue(this.newstage);

  }


  AmountBinding(event) {
    debugger
    let i = this.FiApprovalForm.controls['lstStagewisepayments']["controls"].length - 1
    if (this.FiApprovalForm.controls.pApprovedloanamount.value != "") {
      this.RemainingPercentageShowOrHide = true
      this.DisablePercentageEntry = false
      let per = event.currentTarget.value
      // if (+per > 0) {

      let percentageadded = 0;
      if (this.paymentarray.length > 0)
        this.paymentarray.filter(function (data) {
          if (data["pPaymentreleasepercentage"] !== undefined && data["pPaymentreleasepercentage"] != null)
            percentageadded += parseFloat(data["pPaymentreleasepercentage"])
        })
      this.PercentageTotal = percentageadded;
      if (this.PercentageTotal != 100) {
        this.PercentageTotal = this.PercentageTotal + +per
        this.TempPercentageTotal = this.PercentageTotal
      } else {
        this.TempPercentageTotal = this.PercentageTotal + +per
      }

      if (this.PercentageTotal < 100) {
        let amt = (+per * this.Sactionedamount / 100)
        amt = this._CommonService.currencyformat(amt)
        this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleaseamount'].setValue(amt);
      }
      else if (this.PercentageTotal == 100) {
        if (this.TempPercentageTotal == 100) {
          this.DisablePercentageEntry = true
          let amt = (+per * this.Sactionedamount / 100)
          amt = this._CommonService.currencyformat(amt)
          let i = this.FiApprovalForm.controls['lstStagewisepayments']["controls"].length - 1
          this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleaseamount'].setValue(amt);

          this.RemainingPercentageShowOrHide = false
          this.RemainingPercentage = 0
        } else {
          this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleasepercentage'].setValue("");
          this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleaseamount'].setValue("");
        }
      }
      else {
        this.PercentageTotal = this.PercentageTotal - +per
        this.TempPercentageTotal = this.PercentageTotal
        this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleasepercentage'].setValue("");
      }

      this.RemainingPercentage = 100 - this.PercentageTotal

      //}
      // else {
      //   this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleasepercentage'].setValue("");
      // }
    } else {
      this.FiApprovalForm['controls']['lstStagewisepayments']['controls'][i]['controls']['pPaymentreleasepercentage'].setValue("");
     this._CommonService.showWarningMessage("Enter Requested Amount")
    }

  }

  BindWaveAmountToGrid(event, rowIndex) {
    debugger

    let a = this.rowIndex
    let value = event.currentTarget.value
    value = this._CommonService.removeCommasForEntredNumber(value)
    value = + value
    if (!isNaN(value)) {
      if (value <= this.TempGridDataChargesFees[a].PchargeamountTemp) {

        this.TempGridDataChargesFees[a].pChargewaiveoffamount = value
        this.TempGridDataChargesFees[a].pChargeamount = this.TempGridDataChargesFees[a].PchargeamountTemp - this.TempGridDataChargesFees[a].pChargewaiveoffamount
        this.TempGridDataChargesFees[a].pChargereceivableamount = this.TempGridDataChargesFees[a].PchargeamountTemp

        if (this.TempGridDataChargesFees[a].pGstcaltype == "Include") {

          let GSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pIgstpercentage) / (100 + this.TempGridDataChargesFees[a].pGstpercentage));
          if (isNaN(GSTamount)) {
            GSTamount = 0
          }
          this.TempGridDataChargesFees[a].pTotalgstamount = GSTamount

          if (this.TempGridDataChargesFees[a].pGsttype == "IGST") {

            let IGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pIgstpercentage) / (100 + this.TempGridDataChargesFees[a].pIgstpercentage));
            if (isNaN(IGSTamount)) {
              IGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pIgstamount = IGSTamount

            this.TempGridDataChargesFees[a].pChargeamount = this.TempGridDataChargesFees[a].pChargeamount - IGSTamount
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + IGSTamount

          }
          else if (this.TempGridDataChargesFees[a].pGsttype == "CGST/SGST") {

            let CGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pCgstpercentage) / (100 + this.TempGridDataChargesFees[a].pIgstpercentage));
            if (isNaN(CGSTamount)) {
              CGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pCgstamount = CGSTamount
            let SGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pSgstpercentage) / (100 + this.TempGridDataChargesFees[a].pIgstpercentage));
            if (isNaN(SGSTamount)) {
              SGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pSgstamount = SGSTamount

            this.TempGridDataChargesFees[a].pChargeamount = this.TempGridDataChargesFees[a].pChargeamount - (CGSTamount + SGSTamount);
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + (CGSTamount + SGSTamount)
            // this.TempGridDataChargesFees[a].pChargereceivableamount= this.TempGridDataChargesFees[a].pTotalchargeamount
          }
          else if (this.TempGridDataChargesFees[a].pGsttype == "CGST/UTGST") {

            let CGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pCgstpercentage) / (100 + this.TempGridDataChargesFees[a].pIgstpercentage));
            if (isNaN(CGSTamount)) {
              CGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pCgstamount = CGSTamount
            let UGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pUtsgtpercentage) / (100 + this.TempGridDataChargesFees[a].pIgstpercentage));
            if (isNaN(UGSTamount)) {
              UGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pUtgstamount = UGSTamount
            this.TempGridDataChargesFees[a].pChargeamount = this.TempGridDataChargesFees[a].pChargeamount - (CGSTamount + UGSTamount);
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + (CGSTamount + UGSTamount)
            // this.TempGridDataChargesFees[a].pChargereceivableamount= this.TempGridDataChargesFees[a].pTotalchargeamount

          }


        }
        else if (this.TempGridDataChargesFees[a].pGstcaltype == "Exclude") {

          let GSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pGstpercentage) / (100));
          if (isNaN(GSTamount)) {
            GSTamount = 0
          }
          this.TempGridDataChargesFees[a].pTotalgstamount = GSTamount
          this.TempGridDataChargesFees[a].pTotalgstamountTemp = GSTamount


          if (this.TempGridDataChargesFees[a].pGsttype == "IGST") {
            let IGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pIgstpercentage) / (100));
            if (isNaN(IGSTamount)) {
              IGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pIgstamount = IGSTamount
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + IGSTamount
            //this.TempGridDataChargesFees[a].pChargereceivableamount= this.TempGridDataChargesFees[a].pTotalchargeamount
          }
          else if (this.TempGridDataChargesFees[a].pGsttype == "CGST/SGST") {
            let CGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pCgstpercentage) / (100));
            if (isNaN(CGSTamount)) {
              CGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pCgstamount = CGSTamount
            let SGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pSgstpercentage) / (100));
            if (isNaN(SGSTamount)) {
              SGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pSgstamount = SGSTamount
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + (CGSTamount + SGSTamount)
            // this.TempGridDataChargesFees[a].pChargereceivableamount= this.TempGridDataChargesFees[a].pTotalchargeamount
          }
          else if (this.TempGridDataChargesFees[a].pGsttype == "CGST/UTGST") {
            let CGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pCgstpercentage) / (100));
            if (isNaN(CGSTamount)) {
              CGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pCgstamount = CGSTamount
            let UGSTamount = Math.round((this.TempGridDataChargesFees[a].pChargeamount * this.TempGridDataChargesFees[a].pUtsgtpercentage) / (100));
            if (isNaN(UGSTamount)) {
              UGSTamount = 0
            }
            this.TempGridDataChargesFees[a].pUtgstamount = UGSTamount
            this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount + (CGSTamount + UGSTamount)
            // this.TempGridDataChargesFees[a].pChargereceivableamount= this.TempGridDataChargesFees[a].pTotalchargeamount
          }



        } else {

          this.TempGridDataChargesFees[a].pTotalchargeamount = this.TempGridDataChargesFees[a].pChargeamount

        }

        this.TempGridDataChargesFees[a].pActualchargeamount = this.TempGridDataChargesFees[a].pChargeamount
        this.ChargesDataToBindInCancelClick = []
        this.ChargesDataToBindInCancelClick = this.TempGridDataChargesFees

      } else {
        $('#waveamount' + rowIndex + '').val('')
        this._CommonService.showWarningMessage("Waiver amount should be lessthan or equal to " + this.TempGridDataChargesFees[a].pChargename + "amount")
      }
    } else {
      this.TempGridDataChargesFees[a].pTotalgstamountTemp = this.TempGridDataChargesFeesCopy[a].pTotalgstamountTemp
      this.TempGridDataChargesFees[a].pTotalgstamount = this.TempGridDataChargesFeesCopy[a].pTotalgstamountTemp

    }

    let aaa = this.TempGridDataChargesFees


  }
  public editHandler({ rowIndex }) {
    //debugger
    this.rowIndex = rowIndex
  }

  BindScanctionedAmount(event) {
    //debugger
    let value = event.currentTarget.value
    let amount = this._CommonService.removeCommasForEntredNumber(value)
    this.Sactionedamount = amount
  }

  CalculateEMI() {
    //debugger
    let loanamount = this.FiApprovalForm.controls['pApprovedloanamount'].value.replace(/,/g, "");
    let interesttype = this.FiApprovalForm.controls['pInteresttype'].value;
    let loanpayin = this.FiApprovalForm.controls['pLoanpayin'].value;
    let interestrate = this.FiApprovalForm.controls['pRateofinterest'].value;
    let tenureofloan = this.FiApprovalForm.controls['pTenureofloan'].value;
    let Loaninstalmentmode = this.FiApprovalForm.controls['pLoaninstalmentpaymentmode'].value;
    let emitype = this.FiApprovalForm.controls['emitype'].value;
    this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode, '0',emitype).subscribe(response => {
      //debugger
      if (response != null) {
        this.fiEmiSchesuleview = response;
        this.installmentAmount = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO[0] ? this.fiEmiSchesuleview.lstInstalmentsgenerationDTO[0].pInstalmentamount : '0';
      }
    })



  }

  SumOfExistingAmounts(data) {
    debugger
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        this.ExistingsTotalAmount += data[i].pInstalmentamount
      }
    }
  }

  SumOfSavingAmounts(data) {
    debugger
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        this.SavingsTotalAmount += data[i].pSavingsamount
      }
    }
  }
  get C() { return this.FiApprovalForm.controls; }

  LoanApproved() {
    debugger
    let pdate = <FormGroup>this.FiApprovalForm['controls']['pApproveddate'];
    pdate.clearValidators();
    pdate.updateValueAndValidity();
    let prem = <FormGroup>this.FiApprovalForm['controls']['pRemarks'];
    prem.clearValidators();
    prem.updateValueAndValidity();
    let isValid = true;
    if (this.checkValidations(this.FiApprovalForm, isValid)) {
      if (this.FiApprovalForm.controls.pDisbursementpayinmode.value == "Stage Payment") {
        if (this.PercentageTotal < 100) {
          this.StageWiseAmountFlag = false
          this._CommonService.showWarningMessage("Stage wise payments percentage should be equal to Remaining Percentage")
        }
        else if (this.PercentageTotal == 100) {
          this.StageWiseAmountFlag = true
        }
      } else {
        this.StageWiseAmountFlag = true
      }
      if (this.FiApprovalForm.controls.pDisbursementpayinmode.value == "Multiple Disbursement") {
        let  emiday = this.FiApprovalForm.controls.emiday.value;
        this.FiApprovalForm.controls.pemiday.setValue(emiday)
      }else{
        this.FiApprovalForm.controls.pemiday.setValue(0);
      }
      if (this.StageWiseAmountFlag == true) {

        this.LoanSubmitStatus = true
        let ChargesDatatoSavee = []
        let aaa = this.TempGridDataChargesFees.filter(function (fdata) {
          let b = fdata
          if (fdata.IsDisbursemenet != false) {
            debugger
            fdata.pChargepaymentmode = "A"
            ChargesDatatoSavee.push(fdata)
          } else if (fdata.IsBorrower != false) {
            fdata.pChargepaymentmode = "R"
            ChargesDatatoSavee.push(fdata)
          }
        })
        let cc = ChargesDatatoSavee

        let amount = this._CommonService.removeCommasForEntredNumber(this.FiApprovalForm.controls.pApprovedloanamount.value)
        if (amount > 0) {
          this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
        } else {
          this.FiApprovalForm.controls.pApprovedloanamount.setValue(0)
        }

        let Installmentamount = this._CommonService.removeCommasForEntredNumber(this.FiApprovalForm.controls.pInstallmentamount.value)
        if (Installmentamount > 0) {
          this.FiApprovalForm.controls.pInstallmentamount.setValue(Installmentamount)
        } else {
          this.FiApprovalForm.controls.pInstallmentamount.setValue(0)
        }

        this.FiApprovalForm.controls.pVchaccintrest.setValue(this.FiApprovalForm.controls.pRateofinterest.value)

        let date = this.FiApprovalForm.controls.pDateofapplication.value
        if (date.toString().includes('/')) {
          this.FiApprovalForm.controls.pDateofapplication.setValue(this._CommonService.formatDateFromDDMMYYYY(this.FiApprovalForm.controls.pDateofapplication.value))
        } else {

        }


        let Approveddate = new Date(Date.UTC(this.FiApprovalForm.controls.pApproveddate.value.getFullYear(), this.FiApprovalForm.controls.pApproveddate.value.getMonth(), this.FiApprovalForm.controls.pApproveddate.value.getDate()))
        this.FiApprovalForm.controls.pApproveddate.setValue(Approveddate);
        let emitype = this.FiApprovalForm.controls.emitype.value;
        this.FiApprovalForm.controls.pemitype.setValue(emitype);

        this.FiApprovalForm.value["lstStagewisepayments"] = this.stagegridData;
        this.FiApprovalForm.value["lstApprovedloancharges"] = ChargesDatatoSavee;
     
        let Data = JSON.stringify(this.FiApprovalForm.value)
        console.log("Approvaldatatosave", Data)
        if (this.FiApprovalForm.valid) {

          if (this.SavedStatusType != "Reject") {
            if (ChargesDatatoSavee.length == 0 && this.TempGridDataChargesFees.length != 0) {
              if (confirm("Do you want to save with out selecting Charges")) {

                this.isLoading = true;
                this.button = 'Processing';
                this._ApprovalService.SaveApprovalData(Data).subscribe(res => {
                  debugger
                  let a = res
                  if (this.SavedStatusType == "Accepted") {
                    this.toaster.success("Approved Succesfully")
                  } else {
                    this.toaster.success("Rejected Succesfully")
                  }

                  this.router.navigate(['/AprovalView'])
                },
                  (err) => {
                    // debugger          
                    this.isLoading = false;
                    let amount = this._CommonService.currencyformat(this.ApplicationData[0].pAmountrequested)
                    this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
                    this.toaster.error("Error Occured While Approving,Check Details Again");
                    const paymentcontrols = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
                    for (let i = paymentcontrols.length - 1; i >= 0; i--) {
                      paymentcontrols.removeAt(i)
                    }
                    this.paymentarray = []
                    this.paymentarray = this.Temppaymentarray

                  }
                )
              }
              else {
                //Binding Data Again
                this.BindingLoanApplicationData(this.ParameterRoute)
              }
            } else {
              this.isLoading = true;
              this.button = 'Processing';
              this._ApprovalService.SaveApprovalData(Data).subscribe(res => {
                debugger
                let a = res
                if (this.SavedStatusType == "Accepted") {
                  this.toaster.success("Approved Succesfully")
                } else {
                  this.toaster.success("Rejected Succesfully")
                }

                this.router.navigate(['/AprovalView'])
              },
                (err) => {
                  // debugger          
                  this.isLoading = false;
                  this.button = 'Save';
                  let amount = this._CommonService.currencyformat(this.ApplicationData[0].pAmountrequested)
                  this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
                  this.FiApprovalForm.controls.pDateofapplication.setValue(this.ApplicationData[0].pDateofapplication)
                  this.toaster.error("Error Occured While Approving,Check Details Again");
                  const paymentcontrols = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
                  for (let i = paymentcontrols.length - 1; i >= 0; i--) {
                    paymentcontrols.removeAt(i)
                  }
                  this.paymentarray = []
                  this.paymentarray = this.Temppaymentarray

                }
              )
            }
          }
          else {
            this.isLoading = true;
            this.RejectButton = 'Processing';
            this._ApprovalService.SaveApprovalData(Data).subscribe(res => {
              debugger
              let a = res
              if (this.SavedStatusType == "Accepted") {
                this.toaster.success("Approved Succesfully")
              } else {
                this.toaster.success("Rejected Succesfully")
              }

              this.router.navigate(['/AprovalView'])
            },
              (err) => {
                // debugger   
                this.isLoading = false;
                this.button = 'Save';
                let amount = this._CommonService.currencyformat(this.ApplicationData[0].pAmountrequested)
                this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
                this.FiApprovalForm.controls.pDateofapplication.setValue(this.ApplicationData[0].pDateofapplication)
                this.toaster.error("Error Occured While Approving,Check Details Again");
                const paymentcontrols = <FormArray>this.FiApprovalForm.controls['lstStagewisepayments'];
                for (let i = paymentcontrols.length - 1; i >= 0; i--) {
                  paymentcontrols.removeAt(i)
                }
                this.paymentarray = []
                this.paymentarray = this.Temppaymentarray

              }
            )
          }


        }
        else {
          let amount = this._CommonService.currencyformat(this.ApplicationData[0].pAmountrequested)
          this.FiApprovalForm.controls.pApprovedloanamount.setValue(amount)
          this.toaster.error("Error Occured While Approving,Check Details Again");
        }
      }
    }
    else {
      this.toaster.error("Error Occured While Approving,Check Details Again");
    }

  }




}
