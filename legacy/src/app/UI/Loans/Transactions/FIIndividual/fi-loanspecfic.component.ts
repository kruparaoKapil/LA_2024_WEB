import { Component, OnInit, ViewChild, EventEmitter, Output, Input, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { EducationloanComponent } from './Loans/educationloan.component';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { CommonService } from 'src/app/Services/common.service';
import { LogicalCellDirective } from '@progress/kendo-angular-grid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GoldloanComponent } from './Loans/goldloan.component';
import { BusinessloanComponent } from './Loans/businessloan.component';
import { HomeloanComponent } from './Loans/homeloan.component';
import { ConsumerloanComponent } from './Loans/consumerloan.component';
import { VehicleLoanComponent } from './Loans/vehicle-loan.component';
import { PersonalLoanComponent } from './Loans/personal-loan.component';
import { LoanagainstpropertyloanComponent } from './Loans/loanagainstpropertyloan.component';
import { tick } from '@angular/core/testing';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { LoanagainstdepositsloanComponent } from './Loans/loanagainstdepositsloan.component';
import { Router } from '@angular/router';

declare let $: any

@Component({
  selector: 'app-fi-loanspecfic',
  templateUrl: './fi-loanspecfic.component.html',
  styles: [],
  providers: [DatePipe]
})
export class FiLoanspecficComponent implements OnInit {
  @ViewChild(PersonalLoanComponent, { static: false }) personalFormdata: PersonalLoanComponent;
  @ViewChild(LoanagainstpropertyloanComponent, { static: false }) loanagainstPropertyFormdata: LoanagainstpropertyloanComponent;
  @ViewChild(EducationloanComponent, { static: false }) educationFormdata: EducationloanComponent;
  @ViewChild(GoldloanComponent, { static: false }) goldLoan: GoldloanComponent;
  @ViewChild(BusinessloanComponent, { static: false }) businessFormdata: BusinessloanComponent;
  @ViewChild(HomeloanComponent, { static: false }) homeFormdata: HomeloanComponent;
  @ViewChild(ConsumerloanComponent, { static: false }) consumerLoan: ConsumerloanComponent;
  @ViewChild(VehicleLoanComponent, { static: false }) vehicleFormdata: VehicleLoanComponent;
  @ViewChild(LoanagainstdepositsloanComponent,{static:false}) loanagainstdepositsloan:LoanagainstdepositsloanComponent;

  @Input() properDetails: any;
  @Input() movableproperDetails: any;
  @Input() selectedContactTypeForPersonalLoanComponent: any;
  @Input() enteredEmployeeDataToChild: any;
  @Input() forClearButton: boolean;
  @Input() loanDetailsofchild: any;

  @Output() eightTabPersonalData = new EventEmitter();
  @Output() getFiReferencesGetDataEmit = new EventEmitter();
  @Output() forMasterPropertyDetailsEmit = new EventEmitter();
  @Output() forMasterMovalbleProprtyDetailsEmit = new EventEmitter();
  @Output() forGettingExistingLoansDataEmit = new EventEmitter();

  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }

  loanspecificForm: FormGroup

  lstApplicantandOthersData = [];
  districtDetails = [];
  stateDetails = [];
  countryDetails = [];
  istand2nddata: any[];

  loantype: any = "";
  pAmountrequested: any;
  forEmitDataForReferencesTab: any;
  selectedloanTypeData: any;
  ApplicantLoanSpecificDetails: any;
  loantypeId: any;
  strapplictionid: any;
  vchapplicationid: any;
  oldData: any;
  applicant: any;
  pRateofinterest: any;
  pInteresttype: any;
  pTenureofloan: any;
  payin: any;
  pContactId: any;
  custId: any;
  dataOFCompute: any;
  dropdoenTabname: string;

  colorBoolean: boolean;
  saveFlag:boolean=false;
  loading: boolean = false;
  forEmployeeFlag: boolean = false;
  forIncomeFlag: boolean = false;
  forBusinessActivityFlag: boolean = false;
  public isLoading: boolean = false;
  FdRdTabData:any=[];
  buttonName = "Save & Continue";

  constructor(private formBuilder: FormBuilder, 
    private _contacmasterservice: ContacmasterService,
    private _commonService: CommonService, 
    private http: HttpClient, 
    public datePipe: DatePipe,
    private fIIndividualLoanspecficService: FIIndividualLoanspecficService,
    private fiIndividualService: FIIndividualService, private router:Router) { }

  ngOnInit() {
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {        
        this.oldData = res;
        
        this.vchapplicationid = res.pVchapplicationid;
        this.pContactId = res.pApplicantid;
        this.loantype = res.pLoantype;
        this.applicant = res.pApplicantname;
        this.custId = res.pContactreferenceid;  
        if(this.loantype=='Loan Against Deposits' && (res.pLoanname=='Fd Loan' || res.pLoanname=='Rd Loan')){
        this.fiIndividualService.GetFITabFdRdEditLoanagainstDeposit(res.pVchapplicationid, res.pLoanname).subscribe((resposne: any) => {
          this.FdRdTabData=resposne;
        }); 
      }     
      }
    })
    this.loanspecificForm = this.formBuilder.group({
      pApplicationID: [''],
      loantypeId: ['', Validators.required],
      strapplictionid: ['', Validators.required],
    })
    this.loantype = this.loanspecificForm.value.loantypeId;
  }

  /** <-------(start) getting 2nd tab details and showing in loan specific component(start)------> */
  ngAfterViewChecked() {
    if (this.loanDetailsofchild) {
      if( this.loanagainstdepositsloan){
        this.loanagainstdepositsloan.applicationdate = this.loanDetailsofchild.pDateofapplication; 
      }
      this.pAmountrequested = this.loanDetailsofchild.pAmountrequested ?  this._commonService.currencyformat(this.loanDetailsofchild.pAmountrequested) : 0;
      this.pRateofinterest = this.loanDetailsofchild.pRateofinterest;
      this.pInteresttype = this.loanDetailsofchild.pInteresttype
      this.pTenureofloan = this.loanDetailsofchild.pTenureofloan;
      this.payin =this.loanDetailsofchild.pLoanpayin;
    }
  }
  /** <-------(end) getting 2nd tab details and showing in loan specific component(end)------> */


  nextTabClick() {

    /** <-------(start) calling goldloan and consumr loan api to add the goldloan, loan against deposits and consumer component data(start)------->*/
    if (this.loantype == 'Consumer Loan') {
      if(this.consumerLoan) {
        this.buttonName = "Processing";
        this.isLoading = true;
        this.consumerLoan.saveToApi();
        this.buttonName="Save & Continue";
        this.isLoading=false;
        this.dropdoenTabname="References";
        this.getFiReferencesGetDataEmit.emit(true);
      
      }
    } else if (this.loantype == 'Gold Loan') {
      this.buttonName = "Processing";
      this.isLoading = true;
      this.goldLoan.addGoldLoanData();
      this.buttonName="Save & Continue";
      this.isLoading=false;
      this.dropdoenTabname="References";


      this.getFiReferencesGetDataEmit.emit(true);
    }else if (this.loantype == 'Loan Against Deposits') {
      this.buttonName = "Processing";
      this.isLoading = true;
      this.loanagainstdepositsloan.saveLoanAgainstDepositsData();
      this.buttonName="Save & Continue";
      this.isLoading=false;
      this.dropdoenTabname="References";


      this.getFiReferencesGetDataEmit.emit(true);
    }
    else {
      this.submitData();
    }
    /** <-------(end) calling goldloan and consumr loan api to add the goldloan, loan against deposits and consumer component data(end)------->*/
  }

  /** <-------(start) this is event from consumer loan component (start)------->*/
  forFiReferencesDataForGetData(event) {
    // if(event) {
    //   this.forEmitDataForReferencesTab = true;
    // }
  }
  /** <-------(end) this is event from consumer loan component (end)------->*/

 /** <-------(start) getting data from api for all forms of 8th tab (start)------->*/
  getApplicantLoanSpecificDetails(vchapplicationid): void {
    if (vchapplicationid) {
      this.loading = true;
      this.fIIndividualLoanspecficService.getApplicantLoanSpecificDetails(vchapplicationid).subscribe(response => {
        this.ApplicantLoanSpecificDetails = response;
        if (this.loantype == 'Business Loan') {
          if( this.businessFormdata) {

            this.businessFormdata.gridData = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinessfinancialperformanceDTO.length; i++) {
              let financialObj = {
                pRecordid: Number(response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pRecordid),
                finyear: response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pfinacialyear,
                finturnover: response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pturnoveramount ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pturnoveramount):0,
                finnetprofit:  response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pnetprofitamount ?  this._commonService.currencyformat(response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pnetprofitamount):0,
                pProoffilepath: response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pbalancesheetdocpath,
                pTypeofoperation: response.businessLoanDTO.lstBusinessfinancialperformanceDTO[i].pTypeofoperation,
  
              }
              this.businessFormdata.gridData.push(financialObj);
            }
            this.businessFormdata.ceditpurchasedetails = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO.length; i++) {
              let purchaseObj = {
                pRecordid: Number(response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pRecordid),
                trendpurchaseperiod: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pfinacialyear,
                trendpurchasemajorsup: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].psuppliername,
                trendpurchaseAddress: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].paddress,
                trendpurchaseConNo: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pcontactno,
                trendpurchasemaxcreditrec: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pmaxcreditreceived ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pmaxcreditreceived):0,
                trendpurchasemincreditrec: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pmincreditreceived ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pmincreditreceived):0,
                trendpurtotalrec: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pavgtotalcreditreceived ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pavgtotalcreditreceived):0,
                pTypeofoperation: response.businessLoanDTO.lstBusinesscredittrendpurchasesDTO[i].pTypeofoperation,
  
              }
              this.businessFormdata.ceditpurchasedetails.push(purchaseObj);
            }
            this.businessFormdata.ceditsalesdetails = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinesscredittrendsalesDTO.length; i++) {
              let salesObj = {
                pRecordid:  Number(response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pRecordid),
                salesperiod: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pfinacialyear,
                salesnameofmajorcust: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pcustomername,
                dalesaddress: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].paddress,
                salescontactno: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pcontactno,
                salesmaxcredit:  response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pmaxcreditgiven ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pmaxcreditgiven):0,
                salesmincredit: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pmincreditgiven ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pmincreditgiven):0,
                salestotalcredit:  response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].ptotalcreditsales ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].ptotalcreditsales):0,
                pTypeofoperation: response.businessLoanDTO.lstBusinesscredittrendsalesDTO[i].pTypeofoperation,
  
  
              }
              this.businessFormdata.ceditsalesdetails.push(salesObj);
            }
            this.businessFormdata.stockposdetails = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinessstockpositionDTO.length; i++) {
              let stockPos = {
                pRecordid:  Number(response.businessLoanDTO.lstBusinessstockpositionDTO[i].pRecordid),
                stockperiod: response.businessLoanDTO.lstBusinessstockpositionDTO[i].pfinacialyear,
                stockmaxcarried: response.businessLoanDTO.lstBusinessstockpositionDTO[i].pmaxstockcarried ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessstockpositionDTO[i].pmaxstockcarried):0,
                stockmincarried: response.businessLoanDTO.lstBusinessstockpositionDTO[i].pminstockcarried ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessstockpositionDTO[i].pminstockcarried):0,
                stockavgcarried: response.businessLoanDTO.lstBusinessstockpositionDTO[i].pavgtotalstockcarried ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessstockpositionDTO[i].pavgtotalstockcarried):0,
                pTypeofoperation: response.businessLoanDTO.lstBusinessstockpositionDTO[i].pTypeofoperation,
  
  
              }
              this.businessFormdata.stockposdetails.push(stockPos);
            }
            this.businessFormdata.costprojdetails = response.businessLoanDTO.lstBusinesscostofprojectDTO
  
            for (let i = 0; i < response.businessLoanDTO.lstBusinesscostofprojectDTO.length; i++) {
              
              this.businessFormdata.costofprojectform.patchValue({
                costofland: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pcostoflandincludingdevelopment ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pcostoflandincludingdevelopment):0,
                bulidingcivilworks: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pbuildingandothercivilworks ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pbuildingandothercivilworks):0,
                plantandmachine: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pplantandmachinery ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pplantandmachinery):0,
                Equipment: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pequipmenttools ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pequipmenttools):0,
                Testingequ:  response.businessLoanDTO.lstBusinesscostofprojectDTO[i].ptestingequipment ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].ptestingequipment):0,
                misc: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pmiscfixedassets ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pmiscfixedassets):0,
                Erection: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].perectionorinstallationcharges ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].perectionorinstallationcharges):0,
                Preliminary: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].ppreliminaryorpreoperativeexpenses ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].ppreliminaryorpreoperativeexpenses):0,
                provision: response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pprovisionforcontingencies ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pprovisionforcontingencies):0,
                marginofworking:  response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pmarginforworkingcapital ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinesscostofprojectDTO[i].pmarginforworkingcapital):0,
  
  
              })
            }
  
             this.businessFormdata.getSateDetails(response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pcountryid);
            this.businessFormdata.getDistrictDetails(response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pstateid);

            this.businessFormdata.businessaddressForm.patchValue({
              businesspaddress1: response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pAddress1,
              businesspaddress2:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pAddress2,
               pCountryId:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pcountryid,
               pStateId:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pstateid,
               pDistrictId:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pdistrictid,
               businessPincode:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pPincode,
              businesspcity:response.businessLoanDTO.businessancillaryunitaddressdetailsDTO.pcity,
  
  
  
            })
           
           
            
            this.businessFormdata.pdescriptionoftheactivity=response.businessLoanDTO.pdescriptionoftheactivity
  
            this.businessFormdata.unitDetails = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinessloanassociateconcerndetails.length; i++) {
              let unitObj = {
                pRecordid:  Number(response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pRecordid),
                associateconcern: response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pnameofassociateconcern,
                natureassociation: response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pnatureofassociation,
                natureofactivity: response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pnatureofactivity,
                itemstraded: response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pitemstradedormanufactured,
                pTypeofoperation: response.businessLoanDTO.lstBusinessloanassociateconcerndetails[i].pTypeofoperation,
  
              }
              this.businessFormdata.unitDetails.push(unitObj);
            }
            this.businessFormdata.turnoverDetails = [];
            for (let i = 0; i < response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss.length; i++) {
              let turnObj = {
                pRecordid:  Number(response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pRecordid),
                turnoveryear: response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pturnoveryear,
                turnover: response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pturnoveramount ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pturnoveramount):0,
                turnoverprofit: response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pturnoverprofit ? this._commonService.currencyformat(response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pturnoverprofit):0,
                pTypeofoperation: response.businessLoanDTO.lstBusinessloanturnoverandprofitorloss[i].pTypeofoperation,
  
              }
              this.businessFormdata.turnoverDetails.push(turnObj);
          }
          }
        } else if (this.loantype == 'Consumer Loan') {
          if(this.consumerLoan) {
            this.consumerLoan.gridData = [];
            for (let index = 0; index < this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO.length; index++) {
              let gridObj = {
                "pRecordid": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pRecordid,
                "pproducttype": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pproducttype,
                "pproductname": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pproductname,
                "pproductmodel": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pproductmodel,
                "pquantity": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pquantity,
                "pcostofproduct": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pcostofproduct ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pcostofproduct):0,
                "pinsurancecostoftheproduct": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pinsurancecostoftheproduct ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pinsurancecostoftheproduct):0,
                "pothercost": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pothercost ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pothercost):0,
                "ptotalcostofproduct": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].ptotalcostofproduct ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].ptotalcostofproduct):0,
                "pperiod": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pperiod,
                "pperiodtype": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pperiodtype,
                "piswarrantyapplicable": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].piswarrantyapplicable,
                "pmanufacturer": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pmanufacturer,
                "pdownpayment": this.ApplicantLoanSpecificDetails.consumerLoanDTO.pdownpayment ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.pdownpayment):0,
                "pbalanceamount": this.ApplicantLoanSpecificDetails.consumerLoanDTO.pbalanceamount ? this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.pbalanceamount):0,
                "pTypeofoperation": this.ApplicantLoanSpecificDetails.consumerLoanDTO.lstConsumerLoanDetailsDTO[index].pTypeofoperation,
              }
              this.consumerLoan.gridData.push(gridObj);
              this.consumerLoan.totalBalance = this.ApplicantLoanSpecificDetails.consumerLoanDTO.pbalanceamount ?  this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.pbalanceamount):0;
              this.consumerLoan.totalDownPayment = this.ApplicantLoanSpecificDetails.consumerLoanDTO.pdownpayment ?  this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.pdownpayment):0;
              this.consumerLoan.totalProducts = this.ApplicantLoanSpecificDetails.consumerLoanDTO.ptotalproductcost ?  this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.consumerLoanDTO.ptotalproductcost):0;
        
            }
            this.consumerLoan.getConsumableproductTypes();
          }
        }
        else if (this.loantype == 'Vehicle Loan') {
          let getdataofvehicleArr = [];
          if(this.vehicleFormdata) {
            this.vehicleFormdata.vehicleData = (response.lstVehicleLoanDTO)
            for (let i = 0; i < this.vehicleFormdata.vehicleData.length; i++) {
  
              this.vehicleFormdata.vehicleForm.patchValue({
                pShowroomName: this.vehicleFormdata.vehicleData[i].pShowroomName,
                pVehicleManufacturer: this.vehicleFormdata.vehicleData[i].pVehicleManufacturer,
                pVehicleModel: this.vehicleFormdata.vehicleData[i].pVehicleModel,
                pActualcostofVehicle: this.vehicleFormdata.vehicleData[i].pActualcostofVehicle ? this._commonService.currencyformat(this.vehicleFormdata.vehicleData[i].pActualcostofVehicle):0,
                pDownPayment: this.vehicleFormdata.vehicleData[i].pDownPayment ? this._commonService.currencyformat(this.vehicleFormdata.vehicleData[i].pDownPayment):0,
                pOnroadprice: this.vehicleFormdata.vehicleData[i].pOnroadprice ? this._commonService.currencyformat(this.vehicleFormdata.vehicleData[i].pOnroadprice):0,
                pRequestedLoanAmount: this.vehicleFormdata.vehicleData[i].pRequestedLoanAmount ? this._commonService.currencyformat(this.vehicleFormdata.vehicleData[i].pRequestedLoanAmount):0,
                pEngineNo: this.vehicleFormdata.vehicleData[i].pEngineNo,
                pChassisNo: this.vehicleFormdata.vehicleData[i].pChassisNo,
                pRegistrationNo: this.vehicleFormdata.vehicleData[i].pRegistrationNo,
                pYearofMake: this.vehicleFormdata.vehicleData[i].pYearofMake,
                pAnyotherRemarks: this.vehicleFormdata.vehicleData[i].pAnyotherRemarks,
  
              })
            }
          }
        }
        else if (this.loantype == 'Gold Loan'){
          if(this.goldLoan){
            this.goldLoan.goldForm.patchValue({
              pAppraisalDate:this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.pAppraisalDate,
              pAppraisorName:this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.pAppraisorName,
              });
              this.goldLoan.computeTotalAppraisedValue = 0;
              for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
                this.goldLoan.computeTotalAppraisedValue = Number(this.goldLoan.computeTotalAppraisedValue) + Number(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue);
              }
              this.goldLoan.computeTotalAppraisedValue = this._commonService.currencyformat(this.goldLoan.computeTotalAppraisedValue);
              for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
                this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue = this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue);
                
              }
          }
        }
        else if (this.loantype == 'Education Loan'){
          if(this.educationFormdata){
            this.educationFormdata.educationloanform.patchValue({
              pNameoftheinstitution:this.ApplicantLoanSpecificDetails.educationLoanDTO.pNameoftheinstitution,
              pNameofProposedcourse:this.ApplicantLoanSpecificDetails.educationLoanDTO.pNameofProposedcourse,
              pselectionoftheinstitute:this.ApplicantLoanSpecificDetails.educationLoanDTO.pselectionoftheinstitute,
            });
            this.educationFormdata.coursedetailsform.patchValue({
              pRankingofinstitution:this.ApplicantLoanSpecificDetails.educationLoanDTO.pRankingofinstitution,
              pDurationofCourse:this.ApplicantLoanSpecificDetails.educationLoanDTO.pDurationofCourse,
              pDateofCommencement:this.ApplicantLoanSpecificDetails.educationLoanDTO.pDateofCommencement ? this._commonService.formatDateFromDDMMYYYY(this.ApplicantLoanSpecificDetails.educationLoanDTO.pDateofCommencement):null,
              pseatsecured:this.ApplicantLoanSpecificDetails.educationLoanDTO.pseatsecured,
            });
            for (let i = 0; i < this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO.length; i++) {
              if(this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pCountryid && this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pStateid){

                this.educationFormdata.getSateDetails(this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pCountryid);
                this.educationFormdata.getDistrictDetails(this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pStateid);
              }
            this.educationFormdata.addressForm.patchValue({
              paddress1: this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pAddress1,
              paddress2:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pAddress2,
              pCountryId:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pCountryid,
              pState:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pState,
              pDistrict:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pDistrict,
              pCountry:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pCountry,
               pStateId:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pStateid,
               pDistrictId:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pDistrictid,
               Pincode:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pPincode,
              pcity:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO[i].pCity,
            })              
            }
            this.educationFormdata.formDetails = this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationQualifcationDTO;
            this.educationFormdata.formDetails2 = this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanyearwiseFeedetailsDTO;
            for (let i = 0; i < this.educationFormdata.formDetails2.length; i++) {
              this.educationFormdata.formDetails2[i].pfee =  this._commonService.currencyformat(this.educationFormdata.formDetails2[i].pfee);             
            }
            for (let i = 0; i < this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO.length; i++) {
              this.educationFormdata.computedfeevalue = this._commonService.currencyformat(this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO[i].ptotalfundrequirement);
              this.educationFormdata.EducationLoanFeeDetailsForm.patchValue({
                pnonrepayablescholarship:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO[i].pnonrepayablescholarship,
                prepayablescholarship:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO[i].prepayablescholarship,
                pfundsavailablefromfamily:this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO[i].pfundsavailablefromfamily,

            })
          }   
        }
      }       
      else if (this.loantype == 'Loan Against Property'){     
        }
        else if (this.loantype == 'Home Loan'){
          this.ApplicantLoanSpecificDetails = response;
          if(response) {
            if(this.homeFormdata) {

              response.homeLoanDTO.pbuildertieup = response.homeLoanDTO.pbuildertieup ? response.homeLoanDTO.pbuildertieup : 'no';
              
              response.homeLoanDTO.pbookingdate = response.homeLoanDTO.pbookingdate ? 
              this._commonService.formatDateFromDDMMYYYY(response.homeLoanDTO.pbookingdate) :  new Date();
       
              response.homeLoanDTO.pcompletiondate = response.homeLoanDTO.pcompletiondate ? 
              this._commonService.formatDateFromDDMMYYYY(response.homeLoanDTO.pcompletiondate) :  new Date();
       
              response.homeLoanDTO.poccupancycertificatedate = response.homeLoanDTO.poccupancycertificatedate ? 
              this._commonService.formatDateFromDDMMYYYY(response.homeLoanDTO.poccupancycertificatedate) :  new Date();

              response.homeLoanDTO.pinitialpayment = this._commonService.currencyformat(response.homeLoanDTO.pinitialpayment);
              response.homeLoanDTO.pactualcost = this._commonService.currencyformat(response.homeLoanDTO.pactualcost);
              response.homeLoanDTO.psaleagreementvalue = this._commonService.currencyformat(response.homeLoanDTO.psaleagreementvalue);
              response.homeLoanDTO.pstampdutycharges = this._commonService.currencyformat(response.homeLoanDTO.pstampdutycharges);
              response.homeLoanDTO.potheramenitiescharges = this._commonService.currencyformat(response.homeLoanDTO.potheramenitiescharges);
              response.homeLoanDTO.potherincidentalexpenditure = this._commonService.currencyformat(response.homeLoanDTO.potherincidentalexpenditure);
              response.homeLoanDTO.poriginalcostofproperty = this._commonService.currencyformat(response.homeLoanDTO.poriginalcostofproperty);
              response.homeLoanDTO.pestimatedvalueofrepairs = this._commonService.currencyformat(response.homeLoanDTO.pestimatedvalueofrepairs);
              response.homeLoanDTO.pamountalreadyspent = this._commonService.currencyformat(response.homeLoanDTO.pamountalreadyspent);
              response.homeLoanDTO.potherborrowings = this._commonService.currencyformat(response.homeLoanDTO.potherborrowings);
              response.homeLoanDTO.ptotalvalueofproperty = this._commonService.currencyformat(response.homeLoanDTO.ptotalvalueofproperty);
              debugger
              this.homeFormdata.getSateDetails(Number(response.homeLoanDTO.pCountryId));
              this.homeFormdata.getDistrictDetails(Number(response.homeLoanDTO.pStateId));
              this.homeFormdata.HomeloanForm.patchValue(response.homeLoanDTO);
            }
          }
        
        }
        else if (this.loantype == 'Loan Against Deposits'){
          if (this.ApplicantLoanSpecificDetails && this.ApplicantLoanSpecificDetails != undefined) {
            this.loanagainstdepositsloan.loanAgainstDeposits=this.ApplicantLoanSpecificDetails.lstLoanagainstDepositDTO;
            if (this.loanagainstdepositsloan.loanAgainstDeposits.length !=0) {
              this.loanagainstdepositsloan.totalDepositValue = 0;
              for (let index = 0; index < this.loanagainstdepositsloan.loanAgainstDeposits.length; index++) {
                this.loanagainstdepositsloan.loanAgainstDeposits[index].pdepositamount = this._commonService.currencyformat(this.loanagainstdepositsloan.loanAgainstDeposits[index].pdepositamount);
                this.loanagainstdepositsloan.totalDepositValue = (this.loanagainstdepositsloan.totalDepositValue ? Number((this.loanagainstdepositsloan.totalDepositValue.toString()).replace(/,/g, "")) : 0) + (this.loanagainstdepositsloan.loanAgainstDeposits[index].pdepositamount ?  Number((this.loanagainstdepositsloan.loanAgainstDeposits[index].pdepositamount.toString()).replace(/,/g, "")) : 0);
                this.loanagainstdepositsloan.totalDepositValue = this._commonService.currencyformat(this.loanagainstdepositsloan.totalDepositValue);
              }
            }
          }
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    }
  }
 /** <-------(end) getting data from api for all forms of 8th tab (end)------->*/

 /** <-------(start) getting data from api for LoanAgainstProperty of 8th tab (start)------->*/
  getLoanAgainstPropertyEightTabData() {
    if(this.loantype == 'Loan Against Property') {
      this.loading = true;
      this.fiIndividualService.getFiSecurityAndColletralData(this.pContactId, this.vchapplicationid).subscribe((resposne: any) => {
        
        if (resposne) {
          this.properDetails = resposne.imMovablePropertyDetailsList ? [...resposne.imMovablePropertyDetailsList] : null;;
          this.movableproperDetails = resposne.movablePropertyDetailsList ? [...resposne.movablePropertyDetailsList] : null;
          this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData = resposne.imMovablePropertyDetailsList ? [...resposne.imMovablePropertyDetailsList] : null;
          this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData = resposne.movablePropertyDetailsList ? [...resposne.movablePropertyDetailsList] : null;
          if (this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData && this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData !=null) {
            for (let i = 0; i < this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData.length; i++) {
              this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData[i].pEstimatedmarketvalue = this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData[i].pEstimatedmarketvalue  ? this._commonService.currencyformat(this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData[i].pEstimatedmarketvalue) : 0;
            }
          }
          if ( this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData &&  this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData != null) {
            for (let i = 0; i < this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData.length; i++) {
              this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData[i].pEstimatedmarketvalue = this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData[i].pEstimatedmarketvalue  ? this._commonService.currencyformat(this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData[i].pEstimatedmarketvalue) : 0;
            }
          }
        }
        this.loading = false;
      })
    }
  }
 /** <-------(end) getting data from api for LoanAgainstProperty of 8th tab (end)------->*/

 /** <-------(start) getting data from api for Personal Loan of 8th tab (start)------->*/
  getPersonalLoanDetailsForEightTab() {
    if(this.loantype == 'Personal Loan') {
      this.loading = true;
    this.fIIndividualLoanspecficService.getPersonalLoanEightTabData(this.vchapplicationid).subscribe((response: any) => {
      if(response) {        
        let employeeArr = response.personalEmployeementList;
        let incomeArr = response.personalIncomeList;
        let businessActivityArr = response.businessDetailsDTOList;
        if(employeeArr && employeeArr.length > 0) {
          let employeeObj = response.personalEmployeementList[0];
          this.forEmployeeFlag = true;
          if(this.personalFormdata){
            this.personalFormdata.setFormData(employeeObj);

            if (this.personalFormdata.employeemetForm.controls.pemploymenttype.value.toUpperCase() == 'EMPLOYED') {
              this.personalFormdata.showEmployedDetails = true;
              this.personalFormdata.showSelfEmployedDetails = false;
              this.personalFormdata.experenceDisplayName = 'Enter Total Work experience in years';
            }
            else {
              this.personalFormdata.showEmployedDetails = false;
              this.personalFormdata.showSelfEmployedDetails = true;
              this.personalFormdata.experenceDisplayName = 'Enter Total Industry experience in years';
            }
          }
        }
        else {
          this.forEmployeeFlag = false;
        }
        let incomeObj: any;
        if(incomeArr && incomeArr.length > 0) {
          incomeObj = response.personalIncomeList[0];
          if(this.personalFormdata && this.personalFormdata.IncomeFormdata) {
            this.personalFormdata.IncomeFormdata.setFormData(incomeObj);
            this.personalFormdata.incomeFormDataFromPersonalLoan = incomeObj;
          }
          this.forIncomeFlag = true;
        }
        else {
          this.forIncomeFlag = false;
        }
        let ontherIncomeGridArr = response.personalOtherIncomeList;
        if(ontherIncomeGridArr && ontherIncomeGridArr.length > 0) {
          for (let i = 0; i < ontherIncomeGridArr.length; i++) {
            ontherIncomeGridArr[i].pgrossannual = ontherIncomeGridArr[i].pgrossannual ? this._commonService.currencyformat(ontherIncomeGridArr[i].pgrossannual) : 0;
          }
        }
        if(this.personalFormdata && this.personalFormdata.otherIncomeFormdata) {
          this.personalFormdata.otherIncomeFormdata.otherIncomeGridData = ontherIncomeGridArr;
        }
        if(incomeObj && ontherIncomeGridArr && ontherIncomeGridArr.length > 0){
          this.computeData(incomeObj,ontherIncomeGridArr);
        }
        let financeGridArr = response.businessfinancialdetailsDTOList;
        if(businessActivityArr && businessActivityArr.length > 0) {
          let businessActivityObj = response.businessDetailsDTOList[0];
          if(this.personalFormdata && this.personalFormdata.activityDetails) {
            this.personalFormdata.activityDetails.setFormData(businessActivityObj);
          }
          this.forBusinessActivityFlag = true;
        }
        else {
          this.forBusinessActivityFlag = false;
        }
        if(financeGridArr && financeGridArr.length > 0) {
          for (let i = 0; i < financeGridArr.length; i++) {
            financeGridArr[i].pturnoveramount = financeGridArr[i].pturnoveramount ? this._commonService.currencyformat(financeGridArr[i].pturnoveramount) : 0;          
            financeGridArr[i].pnetprofitamount = financeGridArr[i].pnetprofitamount ? this._commonService.currencyformat(financeGridArr[i].pnetprofitamount) : 0;
          }
        }
        if(this.personalFormdata && this.personalFormdata.financialDetails) {
          this.personalFormdata.financialDetails.businessFincialGriddata = financeGridArr;
        }
      }
      this.loading = false;
    })
  }
}
 /** <-------(end) getting data from api for Personal Loan of 8th tab (end)------->*/

 /** <-------(start) compute otherincome data of personal loan(individual) for 8th tab (start)------->*/
  computeData(incomeObj,ontherIncomeGridArr){  
     let previousData = 0;
  
    for (let i = 0; i < ontherIncomeGridArr.length; i++) {      
     previousData = previousData + Number(((ontherIncomeGridArr[i].pgrossannual).toString()).replace(/,/g, "")) ;

   }
   if(incomeObj) {
     this.dataOFCompute = 
     (Number(((incomeObj.pnetannualincome).toString()).replace(/,/g, "")) - Number(((incomeObj.paverageannualexpenses).toString()).replace(/,/g, "")))+Number(previousData);
        this.dataOFCompute = this.dataOFCompute ?  this._commonService.currencyformat(this.dataOFCompute) : 0;
   }
   let tempData = JSON.parse(JSON.stringify(this.dataOFCompute));
   let tempDataWitoutCommas = tempData ? (tempData.toString()).replace(/,/g, "") : 0;
   if(tempDataWitoutCommas < 0) {
     this.colorBoolean = true;
   }
   else {
    this.colorBoolean = false;
   }  
   this.personalFormdata.otherIncomeFormdata.colorBoolean = this.colorBoolean;
   this.personalFormdata.otherIncomeFormdata.dataOFCompute = this.dataOFCompute;
 return this.dataOFCompute;
}
 /** <-------(end) compute otherincome data of personal loan(individual) for 8th tab (end)------->*/

  getCountryDetails(): void {

    this._contacmasterservice.getCountryDetails().subscribe(json => {
      if (json != null) {
        this.countryDetails = json;
      }
    },
      (error) => {

        this.showErrorMessage(error);
      });

  }
  getSateDetails(pCountryId) {
      this._contacmasterservice.getSateDetails(pCountryId).subscribe(json => {
      this.stateDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }

  getDistrictDetails(pStateId) {

    this._contacmasterservice.getDistrictDetails(pStateId).subscribe(json => {
      this.districtDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

 /** <-------(start) saving data to api for all forms of 8th tab (start)------->*/
 submitData() 
 {    
   debugger
    if (this.loantype == 'Education Loan') {
      let formatDate = 'dd-MM-yyyy';
     let lstEducationLoanFeeDetailsDTO = []
      let lstEducationQualifcationDTO = this.educationFormdata.formDetails;
      this.educationFormdata.EducationLoanFeeDetailsForm.value.pfundsavailablefromfamily = Number(this.educationFormdata.EducationLoanFeeDetailsForm.value.pfundsavailablefromfamily);
      this.educationFormdata.EducationLoanFeeDetailsForm.value.ptotalfundrequirement = this.educationFormdata.computedfeevalue ? Number((this.educationFormdata.computedfeevalue.toString()).replace(/,/g, "")) : 0;
      lstEducationLoanFeeDetailsDTO.push(this.educationFormdata.EducationLoanFeeDetailsForm.value);

      this.ApplicantLoanSpecificDetails.educationLoanDTO.pNameoftheinstitution = this.educationFormdata.educationloanform.value.pNameoftheinstitution;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pNameofProposedcourse = this.educationFormdata.educationloanform.value.pNameofProposedcourse;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pselectionoftheinstitute = this.educationFormdata.educationloanform.value.pselectionoftheinstitute;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pRankingofinstitution = this.educationFormdata.coursedetailsform.value.pRankingofinstitution;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pDurationofCourse = this.educationFormdata.coursedetailsform.value.pDurationofCourse;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pDateofCommencement = this.educationFormdata.coursedetailsform.value.pDateofCommencement ? new Date(Date.UTC(this.educationFormdata.coursedetailsform.value.pDateofCommencement.getFullYear(),this.educationFormdata.coursedetailsform.value.pDateofCommencement.getMonth(),this.educationFormdata.coursedetailsform.value.pDateofCommencement.getHours(),this.educationFormdata.coursedetailsform.value.pDateofCommencement.getMinutes())) : null;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.pseatsecured = this.educationFormdata.coursedetailsform.value.pseatsecured;
      let addressObj = {
        pAddress1: this.educationFormdata.addressForm.value.paddress1,
        pAddress2: this.educationFormdata.addressForm.value.paddress2,
        pCity: this.educationFormdata.addressForm.value.pcity,
        pState: (this.educationFormdata.addressForm.value.pState),
        pDistrict: (this.educationFormdata.addressForm.value.pDistrict),
        pCountry: (this.educationFormdata.addressForm.value.pCountry),
        pPincode: this.educationFormdata.addressForm.value.Pincode,
        pcountryid:this.educationFormdata.addressForm.value.pCountryId ? this.educationFormdata.addressForm.value.pCountryId :0,
        pstateid: this.educationFormdata.addressForm.value.pStateId ? this.educationFormdata.addressForm.value.pStateId : 0,
        pdistrictid:this.educationFormdata.addressForm.value.pDistrictId ? this.educationFormdata.addressForm.value.pDistrictId :0
      }
      this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO = [];
      this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationInstutiteAddressDTO.push(addressObj)
      this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanFeeDetailsDTO = lstEducationLoanFeeDetailsDTO;
      this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationQualifcationDTO = lstEducationQualifcationDTO;

      for (let i = 0; i < this.educationFormdata.formDetails2.length; i++) {
        
        this.educationFormdata.formDetails2[i].pfee = this.educationFormdata.formDetails2[i].pfee ? Number(((this.educationFormdata.formDetails2[i].pfee).toString()).replace(/,/g, "")) : 0;
      }
      this.ApplicantLoanSpecificDetails.educationLoanDTO.lstEducationLoanyearwiseFeedetailsDTO=this.educationFormdata.formDetails2;
      
      if (this.ApplicantLoanSpecificDetails) {
        this.ApplicantLoanSpecificDetails.pCreatedby=this._commonService.pCreatedby;
      }
      this.buttonName = "Processing";
      this.isLoading = true;
        this.fIIndividualLoanspecficService.saveLoanData(this.ApplicantLoanSpecificDetails).subscribe(res => {
          if(res){
            this.buttonName="Save & Continue";
            this.isLoading=false;
          //   let str = "references"
          //   this.dropdoenTabname="References"
  
          // $('.nav-item a[href="#' + str + '"]').tab('show');
          let str;
          let temptabname;
          this.dropdoenTabname = this._commonService.GetFiTabName();
          let tempFirstInformationTabsData = this._FirstInformationTabsData;
          let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
          str = data.tabId;
          temptabname = data.tabName;
          if(str=='' && temptabname==''){
            this.buttonName = "Submit";
            this.isLoading = false;
            this._commonService.showInfoMessage('Saved successfully');
            this.router.navigateByUrl('/FiView');
            return
          }
          this._commonService.SetFiTabName(temptabname);
          this.dropdoenTabname = temptabname;
          $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            this.getFiReferencesGetDataEmit.emit(true);
          }
          else {
            this.buttonName="Save & Continue";
            this.isLoading=false;
          }
        },
          (error) => {
            this.buttonName="Save & Continue";
            this.isLoading=false;
            this.showErrorMessage(error);
          });
    }
    else if (this.loantype == 'Business Loan') {      
       let inValid=true;
      this.businessFormdata.checkValidations(this.businessFormdata.businessaddressForm, inValid);
      this.businessFormdata.BlurEventAllControll(this.businessFormdata.businessaddressForm);
      this.businessFormdata.checkValidations(this.businessFormdata.costofprojectform, inValid);
      this.businessFormdata.BlurEventAllControll(this.businessFormdata.costofprojectform);
      let lstBusinesscostofprojectDTO = [];
      let lstBusinesscredittrendpurchasesDTO = [];
      let lstBusinesscredittrendsalesDTO = [];
      let lstBusinessfinancialperformanceDTO = [];
      let lstBusinessstockpositionDTO = [];
      let lstBusinessloanturnoverandprofitorloss = [];
      let lstBusinessloanassociateconcerndetails = [];      
        for (let i = 0; i < this.businessFormdata.gridData.length; i++) {
          let financialperformance = {
            pRecordid: Number(this.businessFormdata.gridData[i].pRecordid),
  
            pfinacialyear: this.businessFormdata.gridData[i].finyear,
            pturnoveramount:(this.businessFormdata.gridData[i].finturnover) ? Number((this.businessFormdata.gridData[i].finturnover.toString()).replace(/,/g, "")):0,
            pnetprofitamount: (this.businessFormdata.gridData[i].finnetprofit)? Number((this.businessFormdata.gridData[i].finnetprofit.toString()).replace(/,/g, "")):0,
            pbalancesheetdocpath: this.businessFormdata.gridData[i].pProoffilepath,
            pTypeofoperation: this.businessFormdata.gridData[i].pTypeofoperation 
          }
          lstBusinessfinancialperformanceDTO.push(financialperformance)
        }     
      for (let i = 0; i < this.businessFormdata.ceditpurchasedetails.length; i++) {
        let purchasesDTO = {
          pRecordid: Number(this.businessFormdata.ceditpurchasedetails[i].pRecordid),
          pfinacialyear: this.businessFormdata.ceditpurchasedetails[i].trendpurchaseperiod,
          psuppliername: this.businessFormdata.ceditpurchasedetails[i].trendpurchasemajorsup,
          paddress: this.businessFormdata.ceditpurchasedetails[i].trendpurchaseAddress,
          pcontactno: this.businessFormdata.ceditpurchasedetails[i].trendpurchaseConNo,
          pmaxcreditreceived: (this.businessFormdata.ceditpurchasedetails[i].trendpurchasemaxcreditrec) ? Number(((this.businessFormdata.ceditpurchasedetails[i].trendpurchasemaxcreditrec).toString()).replace(/,/g, "")):0,
          pmincreditreceived: (this.businessFormdata.ceditpurchasedetails[i].trendpurchasemincreditrec) ? Number(((this.businessFormdata.ceditpurchasedetails[i].trendpurchasemincreditrec).toString()).replace(/,/g, "")):0,
          pavgtotalcreditreceived: (this.businessFormdata.ceditpurchasedetails[i].trendpurtotalrec) ? Number(((this.businessFormdata.ceditpurchasedetails[i].trendpurtotalrec).toString()).replace(/,/g, "")):0,
          pTypeofoperation: this.businessFormdata.ceditpurchasedetails[i].pTypeofoperation
        }
        lstBusinesscredittrendpurchasesDTO.push(purchasesDTO)
      }
      for (let i = 0; i < this.businessFormdata.ceditsalesdetails.length; i++) {
        let salesDTO = {
          pRecordid: Number(this.businessFormdata.ceditsalesdetails[i].pRecordid),
          pfinacialyear: this.businessFormdata.ceditsalesdetails[i].salesperiod,
          pcustomername: this.businessFormdata.ceditsalesdetails[i].salesnameofmajorcust,
          paddress: this.businessFormdata.ceditsalesdetails[i].dalesaddress,
          pcontactno: this.businessFormdata.ceditsalesdetails[i].salescontactno,
          pmaxcreditgiven: (this.businessFormdata.ceditsalesdetails[i].salesmaxcredit) ? Number(((this.businessFormdata.ceditsalesdetails[i].salesmaxcredit).toString()).replace(/,/g, "")) : 0,
          pmincreditgiven: (this.businessFormdata.ceditsalesdetails[i].salesmincredit) ? Number(((this.businessFormdata.ceditsalesdetails[i].salesmincredit).toString()).replace(/,/g, "")) :0,
          ptotalcreditsales: (this.businessFormdata.ceditsalesdetails[i].salestotalcredit) ? Number(((this.businessFormdata.ceditsalesdetails[i].salestotalcredit).toString()).replace(/,/g, "")) :0,
          pTypeofoperation: this.businessFormdata.ceditsalesdetails[i].pTypeofoperation
        }
        lstBusinesscredittrendsalesDTO.push(salesDTO)
      }   
      for (let i = 0; i < this.businessFormdata.stockposdetails.length; i++) {
        let stockpositionDTO = {
          pRecordid: Number(this.businessFormdata.stockposdetails[i].pRecordid),

          pfinacialyear: this.businessFormdata.stockposdetails[i].stockperiod,
          pmaxstockcarried: (this.businessFormdata.stockposdetails[i].stockmaxcarried) ? Number(((this.businessFormdata.stockposdetails[i].stockmaxcarried).toString()).replace(/,/g, "")) :0,
          pminstockcarried: (this.businessFormdata.stockposdetails[i].stockmincarried) ? Number(((this.businessFormdata.stockposdetails[i].stockmincarried).toString()).replace(/,/g, "")) :0,
          pavgtotalstockcarried:(this.businessFormdata.stockposdetails[i].stockavgcarried) ? Number(((this.businessFormdata.stockposdetails[i].stockavgcarried).toString()).replace(/,/g, "")) :0,
          pTypeofoperation: this.businessFormdata.stockposdetails[i].pTypeofoperation
        }
        lstBusinessstockpositionDTO.push(stockpositionDTO)
      }     
        let projectDTO = {
         pcostoflandincludingdevelopment: this.businessFormdata.costofprojectform.value.costofland ? Number(((this.businessFormdata.costofprojectform.value.costofland).toString()).replace(/,/g, "")) :0,
          pbuildingandothercivilworks: this.businessFormdata.costofprojectform.value.bulidingcivilworks ? Number(((this.businessFormdata.costofprojectform.value.bulidingcivilworks).toString()).replace(/,/g, "")) :0,
          pplantandmachinery: this.businessFormdata.costofprojectform.value.plantandmachine ? Number(((this.businessFormdata.costofprojectform.value.plantandmachine).toString()).replace(/,/g, "")) :0,
          pequipmenttools: this.businessFormdata.costofprojectform.value.Equipment ? Number(((this.businessFormdata.costofprojectform.value.Equipment).toString()).replace(/,/g, "")) :0,
          ptestingequipment: this.businessFormdata.costofprojectform.value.Testingequ ? Number(((this.businessFormdata.costofprojectform.value.Testingequ).toString()).replace(/,/g, "")) :0,
          pmiscfixedassets: this.businessFormdata.costofprojectform.value.misc ? Number(((this.businessFormdata.costofprojectform.value.misc).toString()).replace(/,/g, "")) :0,
          perectionorinstallationcharges: this.businessFormdata.costofprojectform.value.Erection ? Number(((this.businessFormdata.costofprojectform.value.Erection).toString()).replace(/,/g, "")) :0,
          ppreliminaryorpreoperativeexpenses: this.businessFormdata.costofprojectform.value.Preliminary ?  Number(((this.businessFormdata.costofprojectform.value.Preliminary).toString()).replace(/,/g, "")) :0,
          pprovisionforcontingencies: this.businessFormdata.costofprojectform.value.provision ? Number(((this.businessFormdata.costofprojectform.value.provision).toString()).replace(/,/g, "")) :0,
          pmarginforworkingcapital: this.businessFormdata.costofprojectform.value.marginofworking ? Number(((this.businessFormdata.costofprojectform.value.marginofworking).toString()).replace(/,/g, "")) :0
        }
        lstBusinesscostofprojectDTO.push(projectDTO)
      let addressObj = {
        pAddress1: this.businessFormdata.businessaddressForm.value.businesspaddress1,
        pAddress2: this.businessFormdata.businessaddressForm.value.businesspaddress2,
        pCity: this.businessFormdata.businessaddressForm.value.businesspcity,
        pState: (this.businessFormdata.businessaddressForm.value.businesspState),
        pDistrict: (this.businessFormdata.businessaddressForm.value.businesspDistrict),
        pCountry: (this.businessFormdata.businessaddressForm.value.businesspCountry),
        pPincode: this.businessFormdata.businessaddressForm.value.businessPincode,
        pcountryid:this.businessFormdata.businessaddressForm.value.pCountryId ? this.businessFormdata.businessaddressForm.value.pCountryId :0,
        pstateid: this.businessFormdata.businessaddressForm.value.pStateId ? this.businessFormdata.businessaddressForm.value.pStateId : 0,
        pdistrictid:this.businessFormdata.businessaddressForm.value.pDistrictId ? this.businessFormdata.businessaddressForm.value.pDistrictId :0
      }
      
       this.businessFormdata.associateConcernDetails ? (this.ApplicantLoanSpecificDetails.businessLoanDTO.businessancillaryunitaddressdetailsDTO = addressObj) : this.ApplicantLoanSpecificDetails.businessLoanDTO.businessancillaryunitaddressdetailsDTO={};  
       for (let i = 0; i < this.businessFormdata.turnoverDetails.length; i++) {
        let turnOver = {
          pRecordid: Number(this.businessFormdata.turnoverDetails[i].pRecordid),
          pturnoveramount: (this.businessFormdata.turnoverDetails[i].turnover) ? Number(((this.businessFormdata.turnoverDetails[i].turnover).toString()).replace(/,/g, "")):0,
          pturnoverprofit: (this.businessFormdata.turnoverDetails[i].turnoverprofit) ? Number(((this.businessFormdata.turnoverDetails[i].turnoverprofit).toString()).replace(/,/g, "")) :0,
          pturnoveryear: this.businessFormdata.turnoverDetails[i].turnoveryear,
          pTypeofoperation: this.businessFormdata.turnoverDetails[i].pTypeofoperation
        }
        lstBusinessloanturnoverandprofitorloss.push(turnOver)
      }
  
      for (let i = 0; i < this.businessFormdata.unitDetails.length; i++) {
        let associate = {
          pRecordid: Number(this.businessFormdata.unitDetails[i].pRecordid),
          pnameofassociateconcern: this.businessFormdata.unitDetails[i].associateconcern,
          pnatureofassociation: this.businessFormdata.unitDetails[i].natureassociation,
          pnatureofactivity: this.businessFormdata.unitDetails[i].natureofactivity,
          pitemstradedormanufactured: this.businessFormdata.unitDetails[i].itemstraded,
          pTypeofoperation: this.businessFormdata.unitDetails[i].pTypeofoperation
        }
        lstBusinessloanassociateconcerndetails.push(associate)
      }    
      this.ApplicantLoanSpecificDetails.businessLoanDTO.pRecordid = 0,
      this.ApplicantLoanSpecificDetails.businessLoanDTO.pdescriptionoftheactivity = this.businessFormdata.pdescriptionoftheactivity,
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinessfinancialperformanceDTO = lstBusinessfinancialperformanceDTO;
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinesscredittrendpurchasesDTO = lstBusinesscredittrendpurchasesDTO;
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinesscredittrendsalesDTO = lstBusinesscredittrendsalesDTO;
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinessstockpositionDTO = lstBusinessstockpositionDTO;
      this.businessFormdata.pisscholarshipsapplicable == false?this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinesscostofprojectDTO = lstBusinesscostofprojectDTO:null;
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinessloanturnoverandprofitorloss = lstBusinessloanturnoverandprofitorloss;
      this.ApplicantLoanSpecificDetails.businessLoanDTO.lstBusinessloanassociateconcerndetails = lstBusinessloanassociateconcerndetails;

      if (this.ApplicantLoanSpecificDetails) {
        this.ApplicantLoanSpecificDetails.pCreatedby=this._commonService.pCreatedby;
      }
      this.buttonName = "Processing";
      this.isLoading = true;
      this.fIIndividualLoanspecficService.saveLoanData(this.ApplicantLoanSpecificDetails).subscribe(res => {
        if(res) {
          this.buttonName="Save & Continue";
          this.isLoading=false;
      //     let str = "references"
      //     this.dropdoenTabname="References"
  
      // $('.nav-item a[href="#' + str + '"]').tab('show');
      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
      str = data.tabId;
      temptabname = data.tabName;
      if(str=='' && temptabname==''){
        this.buttonName = "Submit";
        this.isLoading = false;
        this._commonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
        return
      }
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.getFiReferencesGetDataEmit.emit(true);
        }
        else {
          this.buttonName="Save & Continue";
          this.isLoading=false;
        }
      },
        (error) => {
          this.buttonName="Save & Continue";
          this.isLoading=false;
          this.showErrorMessage(error);
        });
      }
    else if (this.loantype == 'Home Loan') 
    {     
      debugger
      console.log( "home loan form",this.homeFormdata.HomeloanForm.value)
      let formatDate = 'dd/MM/yyyy';     
      this.homeFormdata.HomeloanForm.value.pbookingdate = this.homeFormdata.HomeloanForm.value.pbookingdate ? 
       this.homeFormdata.HomeloanForm.value.pbookingdate :  new Date();
       this.homeFormdata.HomeloanForm.value.pcompletiondate = this.homeFormdata.HomeloanForm.value.pcompletiondate ? 
       this.homeFormdata.HomeloanForm.value.pcompletiondate:  new Date();
       this.homeFormdata.HomeloanForm.value.poccupancycertificatedate = this.homeFormdata.HomeloanForm.value.poccupancycertificatedate ? 
       this.homeFormdata.HomeloanForm.value.poccupancycertificatedate :  new Date();
       this.homeFormdata.HomeloanForm.value.pinitialpayment = this.homeFormdata.HomeloanForm.value.pinitialpayment ? Number(this.homeFormdata.HomeloanForm.value.pinitialpayment.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.pactualcost = this.homeFormdata.HomeloanForm.value.pactualcost ? Number(this.homeFormdata.HomeloanForm.value.pactualcost.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.psaleagreementvalue = this.homeFormdata.HomeloanForm.value.psaleagreementvalue ? Number(this.homeFormdata.HomeloanForm.value.psaleagreementvalue.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.pstampdutycharges = this.homeFormdata.HomeloanForm.value.pstampdutycharges ? Number(this.homeFormdata.HomeloanForm.value.pstampdutycharges.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.potheramenitiescharges = this.homeFormdata.HomeloanForm.value.potheramenitiescharges ? Number(this.homeFormdata.HomeloanForm.value.potheramenitiescharges.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.potherincidentalexpenditure = this.homeFormdata.HomeloanForm.value.potherincidentalexpenditure ? Number(this.homeFormdata.HomeloanForm.value.potherincidentalexpenditure.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.poriginalcostofproperty = this.homeFormdata.HomeloanForm.value.poriginalcostofproperty ? Number(this.homeFormdata.HomeloanForm.value.poriginalcostofproperty.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.pestimatedvalueofrepairs = this.homeFormdata.HomeloanForm.value.pestimatedvalueofrepairs ? Number(this.homeFormdata.HomeloanForm.value.pestimatedvalueofrepairs.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.pamountalreadyspent = this.homeFormdata.HomeloanForm.value.pamountalreadyspent ? Number(this.homeFormdata.HomeloanForm.value.pamountalreadyspent.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.potherborrowings = this.homeFormdata.HomeloanForm.value.potherborrowings ? Number(this.homeFormdata.HomeloanForm.value.potherborrowings.toString().replace(/,/g, "")) : 0;
       this.homeFormdata.HomeloanForm.value.ptotalvalueofproperty = this.homeFormdata.HomeloanForm.value.ptotalvalueofproperty ? Number(this.homeFormdata.HomeloanForm.value.ptotalvalueofproperty.toString().replace(/,/g, "")) : 0;       
       
      let homeLoanDTO = this.homeFormdata.HomeloanForm.value;
      console.log(this.homeFormdata.HomeloanForm.value);
       if(this.ApplicantLoanSpecificDetails)
      this.ApplicantLoanSpecificDetails.homeLoanDTO = homeLoanDTO;
      if (this.ApplicantLoanSpecificDetails) {
        this.ApplicantLoanSpecificDetails.pCreatedby=this._commonService.pCreatedby;
        this.ApplicantLoanSpecificDetails.ptypeofoperation=this._commonService.ptypeofoperation;
      }
      this.buttonName = "Processing";
      this.isLoading = true;
      console.log(this.ApplicantLoanSpecificDetails);

      this.fIIndividualLoanspecficService.saveLoanData(this.ApplicantLoanSpecificDetails).subscribe(res => {
        if(res) {
          this.buttonName="Save & Continue";
          this.isLoading=false;
      //     let str = "references"
      //     this.dropdoenTabname="References"
  
      // $('.nav-item a[href="#' + str + '"]').tab('show');
      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
      str = data.tabId;
      temptabname = data.tabName;
      if(str=='' && temptabname==''){
        this.buttonName = "Submit";
        this.isLoading = false;
        this._commonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
        return
      }
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.getFiReferencesGetDataEmit.emit(true);
        }
        else {
          this.buttonName="Save & Continue";
          this.isLoading=false;
        }
      },
        (error) => {
          this.buttonName="Save & Continue";
          this.isLoading=false;
          this.showErrorMessage(error);
        });

    }
    else if (this.loantype == 'Vehicle Loan') {
     
    let isValid=true;
    this.vehicleFormdata.BlurEventAllControll(this.vehicleFormdata.vehicleForm);
    this.vehicleFormdata.checkValidations(this.vehicleFormdata.vehicleForm, isValid);
      let tempArr = [];
      if(this.vehicleFormdata.addFlagForCost){
      this.vehicleFormdata.vehicleForm.value.pRequestedLoanAmount = 100000;
      this.vehicleFormdata.vehicleForm.value.pActualcostofVehicle=(this.vehicleFormdata.vehicleForm.value.pActualcostofVehicle) ? Number(((this.vehicleFormdata.vehicleForm.value.pActualcostofVehicle).toString()).replace(/,/g, "")):0;
      this.vehicleFormdata.vehicleForm.value.pDownPayment=(this.vehicleFormdata.vehicleForm.value.pDownPayment) ? Number(((this.vehicleFormdata.vehicleForm.value.pDownPayment).toString()).replace(/,/g, "")):0;
      this.vehicleFormdata.vehicleForm.value.pOnroadprice=(this.vehicleFormdata.vehicleForm.value.pOnroadprice) ? Number(((this.vehicleFormdata.vehicleForm.value.pOnroadprice).toString()).replace(/,/g, "")):0;
      tempArr.push(this.vehicleFormdata.vehicleForm.value)
      this.ApplicantLoanSpecificDetails.lstVehicleLoanDTO = tempArr;
      if (this.ApplicantLoanSpecificDetails) {
        this.ApplicantLoanSpecificDetails.pCreatedby=this._commonService.pCreatedby;
      }
      if(this.vehicleFormdata.addDownPayment == false && 
        this.vehicleFormdata.addOnRoadPrice == false && 
        this.vehicleFormdata.addActualCost == false) {
          this.buttonName = "Processing";
          this.isLoading = true;
          this.fIIndividualLoanspecficService.saveLoanData(this.ApplicantLoanSpecificDetails).subscribe(res => {
            if(res) {
              this.buttonName="Save & Continue";
              this.isLoading=false;
              // let str = "references"
              // this.dropdoenTabname="References"
      
              // $('.nav-item a[href="#' + str + '"]').tab('show');
              let str;
              let temptabname;
              this.dropdoenTabname = this._commonService.GetFiTabName();
              let tempFirstInformationTabsData = this._FirstInformationTabsData;
              let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
              str = data.tabId;
              temptabname = data.tabName;
              if(str=='' && temptabname==''){
                this.buttonName = "Submit";
                this.isLoading = false;
                this._commonService.showInfoMessage('Saved successfully');
                this.router.navigateByUrl('/FiView');
                return
              }
              this._commonService.SetFiTabName(temptabname);
              this.dropdoenTabname = temptabname;
              $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
              this.getFiReferencesGetDataEmit.emit(true);
            }
            else {
              this.buttonName="Save & Continue";
              this.isLoading=false;
            }
          },
            (error) => {
              this.buttonName="Save & Continue";
              this.isLoading=false;
              this.showErrorMessage(error);
            });
        }
        else {
          if(this.vehicleFormdata.addDownPayment == true) {
            this._commonService.showWarningMessage("Downpayment cost can not be greter than actual cost");
          }
          else if(this.vehicleFormdata.addActualCost == true) {
            this._commonService.showWarningMessage("Actual cost should be greter than Downpayment cost");
          }
          else if(this.vehicleFormdata.addOnRoadPrice == true) {
            this._commonService.showWarningMessage("Onroadprice cost can not be less than actual cost");
          }
        }
  }
}

    else if (this.loantype == 'Personal Loan') {
      this.eightTabPersonalData.emit(this.personalFormdata.employeemetForm.value);
      let personalDetailsList = [];
      let personalEmployeementList = [];
      let personalFamilyList = [];
      let personalNomineeList = [];
      let personalBankList = [];
      let personalIncomeList = [];
      let personalOtherIncomeList = [];
      let personalEducationList = [];
      let businessDetailsDTOList = [];
      let businessfinancialdetailsDTOList = [];
      this._commonService._GetFiTab1Data().subscribe(res => {

        if (res != null && res != undefined && res != "") {

          this.vchapplicationid = res.pVchapplicationid;
        }
      })
      let obj;
      for (let i = 0; i < this.lstApplicantandOthersData.length; i++) {
        if (this.lstApplicantandOthersData[i].papplicanttype == "Applicant") {
          obj = this.lstApplicantandOthersData[i]
        }
      }
      let flag = {
        pisapplicable: true
      }
      if(this.oldData.pContacttype == 'Individual') {

        let finalEmployementObj = Object.assign(this.personalFormdata.employeemetForm.value, obj);
        personalEmployeementList.push(finalEmployementObj);
        let finalIncomeObj = Object.assign(this.personalFormdata.IncomeFormdata.personalIncomeDetailsIncomeForm.value, obj, flag);
        personalIncomeList.push(finalIncomeObj);
        for (let i = 0; i < this.personalFormdata.otherIncomeFormdata.otherIncomeGridData.length; i++) {
  
          this.personalFormdata.otherIncomeFormdata.otherIncomeGridData[i] = Object.assign(this.personalFormdata.otherIncomeFormdata.otherIncomeGridData[i], obj, flag);
        }
        personalOtherIncomeList = this.personalFormdata.otherIncomeFormdata.otherIncomeGridData;
  
        for (let i = 0; i < personalEmployeementList.length; i++) {
          let checkFlagForDate: boolean = false;
          let checkFlagForCommence : boolean = false;
          if(personalEmployeementList[i].pdateofcommencement) {
            checkFlagForCommence = (personalEmployeementList[i].pdateofcommencement).toString().includes('/');
          }
          if(personalEmployeementList[i].pdateofestablishment) {
            checkFlagForDate = (personalEmployeementList[i].pdateofestablishment).toString().includes('/');
          }
          if(checkFlagForDate == true) {
            personalEmployeementList[i].pdateofestablishment = personalEmployeementList[i].pdateofestablishment ? this._commonService.formatDateFromDDMMYYYY(personalEmployeementList[i].pdateofestablishment) : new Date();
            personalEmployeementList[i].pdateofestablishment = new Date(Date.UTC(personalEmployeementList[i].pdateofestablishment.getFullYear(), personalEmployeementList[i].pdateofestablishment.getMonth(), personalEmployeementList[i].pdateofestablishment.getDate(), personalEmployeementList[i].pdateofestablishment.getHours(), personalEmployeementList[i].pdateofestablishment.getMinutes()))
          }
          if(checkFlagForCommence == true) {
            personalEmployeementList[i].pdateofcommencement = personalEmployeementList[i].pdateofcommencement ? this._commonService.formatDateFromDDMMYYYY(personalEmployeementList[i].pdateofcommencement) : new Date();
            personalEmployeementList[i].pdateofcommencement = new Date(Date.UTC(personalEmployeementList[i].pdateofcommencement.getFullYear(), personalEmployeementList[i].pdateofcommencement.getMonth(), personalEmployeementList[i].pdateofcommencement.getDate(), personalEmployeementList[i].pdateofcommencement.getHours(), personalEmployeementList[i].pdateofcommencement.getMinutes()))
          }
          personalEmployeementList[i].pemployeeexp =  personalEmployeementList[i].pemployeeexp ? Number(personalEmployeementList[i].pemployeeexp) : 0;
          personalEmployeementList[i].ptotalworkexp =  personalEmployeementList[i].ptotalworkexp ? Number(personalEmployeementList[i].ptotalworkexp) : 0;   
        }
        for (let j = 0; j < personalIncomeList.length; j++) {
          personalIncomeList[j].pgrossannualincome =  personalIncomeList[j].pgrossannualincome ? Number((personalIncomeList[j].pgrossannualincome.toString()).replace(/,/g, "")) : 0; 
          personalIncomeList[j].paverageannualexpenses =  personalIncomeList[j].paverageannualexpenses ? Number((personalIncomeList[j].paverageannualexpenses.toString()).replace(/,/g, "")) : 0; 
          personalIncomeList[j].pnetannualincome =  personalIncomeList[j].pnetannualincome ? Number((personalIncomeList[j].pnetannualincome.toString()).replace(/,/g, "")) : 0; 
        }
        for (let k = 0; k < personalOtherIncomeList.length; k++) {
          personalOtherIncomeList[k].pgrossannual = personalOtherIncomeList[k].pgrossannual ? Number((personalOtherIncomeList[k].pgrossannual.toString()).replace(/,/g, "")) : 0;
        }
      }
      else {
        let obj;
      for (let i = 0; i < this.lstApplicantandOthersData.length; i++) {
        if (this.lstApplicantandOthersData[i].papplicanttype == "Applicant") {
          obj = this.lstApplicantandOthersData[i]
        }
      }
        let formData = Object.assign(this.personalFormdata.activityDetails.businessActivityForm.value,obj);
        businessDetailsDTOList.push(formData);
        for (let i = 0; i < this.personalFormdata.financialDetails.businessFincialGriddata.length; i++) {
          this.personalFormdata.financialDetails.businessFincialGriddata[i].pnetprofitamount = this.personalFormdata.financialDetails.businessFincialGriddata[i].pnetprofitamount ? Number((this.personalFormdata.financialDetails.businessFincialGriddata[i].pnetprofitamount).toString().replace(/,/g, "")) : 0;
          this.personalFormdata.financialDetails.businessFincialGriddata[i].pturnoveramount = this.personalFormdata.financialDetails.businessFincialGriddata[i].pturnoveramount ? Number((this.personalFormdata.financialDetails.businessFincialGriddata[i].pturnoveramount).toString().replace(/,/g, "")) : 0;
          this.personalFormdata.financialDetails.businessFincialGriddata[i] = Object.assign(this.personalFormdata.financialDetails.businessFincialGriddata[i],obj);
        }
        businessfinancialdetailsDTOList = this.personalFormdata.financialDetails.businessFincialGriddata;
      }

      for (let i = 0; i < personalEmployeementList.length; i++) {
        personalEmployeementList[i].pisapplicable = true;
        personalEmployeementList[i].pCreatedby = this._commonService.pCreatedby;
        if(this.forEmployeeFlag == false) {
          personalEmployeementList[i].ptypeofoperation = "CREATE";  
        }
        else {
          personalEmployeementList[i].ptypeofoperation = "UPDATE";        
        }
      }

      for (let i = 0; i < personalIncomeList.length; i++) {
        personalIncomeList[i].pisapplicable = true;
        personalIncomeList[i].pCreatedby = this._commonService.pCreatedby;  
        if(this.forIncomeFlag == false) {
          personalIncomeList[i].ptypeofoperation = "CREATE";      
        }
        else{
          personalIncomeList[i].ptypeofoperation = "UPDATE";      
        }
      }

      for (let i = 0; i < personalOtherIncomeList.length; i++) {
        personalOtherIncomeList[i].pisapplicable = true;
        personalOtherIncomeList[i].pCreatedby =  this._commonService.pCreatedby;      
      }
      for (let i = 0; i < businessDetailsDTOList.length; i++) {
        businessDetailsDTOList[i].pisapplicable = true;
        let establishDate: boolean = false;
        let commenceDate: boolean = false;
        if(businessDetailsDTOList[i].pestablishmentdate) {
          establishDate = (businessDetailsDTOList[i].pestablishmentdate).toString().includes('/');
        }
        if(businessDetailsDTOList[i].pcommencementdate) {
          commenceDate = (businessDetailsDTOList[i].pcommencementdate).toString().includes('/');
        }
        if(establishDate == true) {
          businessDetailsDTOList[i].pestablishmentdate = businessDetailsDTOList[i].pestablishmentdate ? this._commonService.formatDateFromDDMMYYYY(businessDetailsDTOList[i].pestablishmentdate) : new Date();
          businessDetailsDTOList[i].pestablishmentdate = new Date(Date.UTC(businessDetailsDTOList[i].pestablishmentdate.getFullYear(), businessDetailsDTOList[i].pestablishmentdate.getMonth(), businessDetailsDTOList[i].pestablishmentdate.getDate(), businessDetailsDTOList[i].pestablishmentdate.getHours(), businessDetailsDTOList[i].pestablishmentdate.getMinutes()))
        }
        if(commenceDate == true) {
          businessDetailsDTOList[i].pcommencementdate = businessDetailsDTOList[i].pcommencementdate ? this._commonService.formatDateFromDDMMYYYY(businessDetailsDTOList[i].pcommencementdate) : new Date();
          businessDetailsDTOList[i].pcommencementdate = new Date(Date.UTC(businessDetailsDTOList[i].pcommencementdate.getFullYear(), businessDetailsDTOList[i].pcommencementdate.getMonth(), businessDetailsDTOList[i].pcommencementdate.getDate(), businessDetailsDTOList[i].pcommencementdate.getHours(), businessDetailsDTOList[i].pcommencementdate.getMinutes()))
        }
        businessDetailsDTOList[i].pCreatedby = this._commonService.pCreatedby;        
      }
      for (let i = 0; i < businessfinancialdetailsDTOList.length; i++) {
        businessfinancialdetailsDTOList[i].pisapplicable = true;
        businessfinancialdetailsDTOList[i].pCreatedby = this._commonService.pCreatedby;   
        if(this.forBusinessActivityFlag == false) {
          businessfinancialdetailsDTOList[i].ptypeofoperation == 'CREATE';
        }     
        else{
          businessfinancialdetailsDTOList[i].ptypeofoperation == 'UPDATE';
        }
      }
      let data = {
        papplicationid: 0,
        pvchapplicationid: this.vchapplicationid,
        pCreatedby: this._commonService.pCreatedby,
        personalDetailsList: personalDetailsList,
        personalEmployeementList: personalEmployeementList,
        personalFamilyList: personalFamilyList,
        personalNomineeList: personalNomineeList,
        personalBankList: personalBankList,
        personalIncomeList: personalIncomeList,
        personalOtherIncomeList: personalOtherIncomeList,
        personalEducationList: personalEducationList,
        businessDetailsDTOList: businessDetailsDTOList,
        businessfinancialdetailsDTOList: businessfinancialdetailsDTOList


      }
      this.buttonName = "Processing";
      this.isLoading = true;
      this.fIIndividualLoanspecficService.savePersonalLoanData(data).subscribe(res => {
        if(res) {
          this.buttonName="Save & Continue";
          this.isLoading=false;
      //     let str = "references"
      //     this.dropdoenTabname="References"
  
      // $('.nav-item a[href="#' + str + '"]').tab('show');
      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
      str = data.tabId;
      temptabname = data.tabName;
      if(str=='' && temptabname==''){
        this.buttonName = "Submit";
        this.isLoading = false;
        this._commonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
        return
      }
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.getFiReferencesGetDataEmit.emit(true);
        }
        else {
          this.buttonName="Save & Continue";
          this.isLoading=false;
        }
      },
        (error) => {
          this.buttonName="Save & Continue";
          this.isLoading=false;
          this.showErrorMessage(error);
        })
      // }
    }
    else if (this.loantype == 'Loan Against Property') {
      let imMovablePropertyDetailsList = [];
      let movablePropertyDetailsList = [];
      let securitychequesList = [];
      let depositsasLienList = [];
      let otherPropertyorsecurityDetailsList = [];
      this._commonService._GetFiTab1Data().subscribe(res => {

        if (res != null && res != undefined && res != "") {

          this.vchapplicationid = res.pVchapplicationid;
        }
      })
      imMovablePropertyDetailsList = this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData ? this.loanagainstPropertyFormdata.propertydetailsParent.propertyGridData : [];
      movablePropertyDetailsList = this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData ? this.loanagainstPropertyFormdata.movablepropertydetailsParent.movablePropertyGridData : [];
      if(imMovablePropertyDetailsList && imMovablePropertyDetailsList.length > 0) {
        for (let i = 0; i < imMovablePropertyDetailsList.length; i++) {
          imMovablePropertyDetailsList[i].pisapplicable = true;        
        }
      }
      if(movablePropertyDetailsList && movablePropertyDetailsList.length > 0) {
        for (let i = 0; i < movablePropertyDetailsList.length; i++) {
          movablePropertyDetailsList[i].pisapplicable = true;          
        }
      }
      let data = {
        papplicationid: 0,
        pCreatedby: this._commonService.pCreatedby,
        pvchapplicationid: this.vchapplicationid,
        imMovablePropertyDetailsList: imMovablePropertyDetailsList,
        movablePropertyDetailsList: movablePropertyDetailsList,
        securitychequesList,
        depositsasLienList,
        otherPropertyorsecurityDetailsList,

      }
      this.buttonName = "Processing";
      this.isLoading = true;
      this.fIIndividualLoanspecficService.saveloanAgainstPropertyData(data).subscribe(res => {
        if(res) {
          this.buttonName="Save & Continue";
          this.isLoading=false;
          // let str = "references"
          // this.dropdoenTabname="References"
  
          // $('.nav-item a[href="#' + str + '"]').tab('show');
          let str;
          let temptabname;
          this.dropdoenTabname = this._commonService.GetFiTabName();
          let tempFirstInformationTabsData = this._FirstInformationTabsData;
          let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
          str = data.tabId;
          temptabname = data.tabName;
          if(str=='' && temptabname==''){
            this.buttonName = "Submit";
            this.isLoading = false;
            this._commonService.showInfoMessage('Saved successfully');
            this.router.navigateByUrl('/FiView');
            return
          }
          this._commonService.SetFiTabName(temptabname);
          this.dropdoenTabname = temptabname;
          $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
          this.getFiReferencesGetDataEmit.emit(true);
        }
        else {
          this.buttonName="Save & Continue";
          this.isLoading=false;
        }
      },
        (error) => {
          this.buttonName="Save & Continue";
          this.isLoading=false;
          this.showErrorMessage(error);
        })   
    }
    
  }
 /** <-------(end) saving data to api for all forms of 8th tab (end)------->*/

 /** <-------(start) emit the data from security and colletral component (PropertyDetails) (start)------->*/
  forSecurityColletralPropertyDetailsEmit(event) {    
    if(event) {      
      this.forMasterPropertyDetailsEmit.emit(event);
    }
  }
 /** <-------(end) emit the data from security and colletral component (PropertyDetails) (end)------->*/

 /** <-------(start) emit the data from security and colletral component (Movable PropertyDetails) (start)------->*/
  forSecurityColletralMovablePropertyDetailsEmit(event) {
    if(event) {
      this.forMasterMovalbleProprtyDetailsEmit.emit(event);
    }
  }
 /** <-------(end) emit the data from security and colletral component (Movable PropertyDetails) (end)------->*/

  moveToPreviousTab() {
    // let str = 'existing-loans'
    // this.dropdoenTabname = "Existing Loans";
    // $('.nav-item a[href="#' + str + '"]').tab('show');
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
    this.forGettingExistingLoansDataEmit.emit(true);
  }

  clearForm() {
    if(this.personalFormdata) {
      this.personalFormdata.loadEmploymentInitData();
      if(this.personalFormdata.IncomeFormdata) {
        this.personalFormdata.IncomeFormdata.clearForm();
      }
      if(this.personalFormdata.otherIncomeFormdata) {
        this.personalFormdata.otherIncomeFormdata.ngOnInit();
        this.personalFormdata.otherIncomeFormdata.dataOFCompute = null;
      }
      if(this.personalFormdata.activityDetails) {
        this.personalFormdata.activityDetails.ngOnInit();
      }
      if(this.personalFormdata.financialDetails) {
        this.personalFormdata.financialDetails.ngOnInit();
      }
    }
    else if(this.loanagainstPropertyFormdata) {
      if(this.loanagainstPropertyFormdata.movablepropertydetailsParent) {
        this.loanagainstPropertyFormdata.movablepropertydetailsParent.loadInitData();
      }
      if(this.loanagainstPropertyFormdata.propertydetailsParent) {
        this.loanagainstPropertyFormdata.propertydetailsParent.loadInitData();
      }
    }
    else if(this.educationFormdata) {
      this.educationFormdata.ngOnInit();
    }
    else if(this.goldLoan) {
      this.goldLoan.ngOnInit();
    }
    else if(this.businessFormdata) {
      this.businessFormdata.ngOnInit();
      this.businessFormdata.pdescriptionoftheactivity = null;
    }
    else if(this.homeFormdata) {
      this.homeFormdata.ngOnInit();
    }
    else if(this.consumerLoan) {
      this.consumerLoan.loadInitData();
    }
    else if(this.vehicleFormdata) {
      this.vehicleFormdata.ngOnInit();
    }
    else if(this.loanagainstdepositsloan) {
      this.loanagainstdepositsloan.ngOnInit();
    }
  }
}

