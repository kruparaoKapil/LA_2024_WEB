import { Component, OnInit } from '@angular/core';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../../../../Services/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-document-verification',
  templateUrl: './document-verification.component.html',
  styles: []
})
export class DocumentVerificationComponent implements OnInit {

  DocumentVerificationForm: FormGroup
  FiDocumentsList: any;
  EducationDetails: any;
  Reference: any;
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
  ContactDetails: any;
  ContactAddress: any;
  button = 'Submit';
  submitted = false;
  isLoading = false;
  BusinessDetails: any;
  BusinessFinancialDetails: any;
  BusinessFinancialDetailsshow: boolean;
  BusinessDetailsshow: boolean;
  loanspecificgoldloan: any;
  loanspecifichomeloan: any;
  loanspecificeducationqualificationdetails:any = [];
  loanspecificgoldloandetails:any =[];
  addressforloanspecificbusinessloan:any = [];
  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDobConfigage: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(private datePipe: DatePipe, private _VerificationService: VerificationService, private _commonService: CommonService, private router: Router, private activatedroute: ActivatedRoute) {
     this.pDobConfig.containerClass = 'theme-dark-blue';
    this.pDobConfig.showWeekNumbers = false;
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit() {
    this.FiDocumentsList = [];
    this.DocumentVerificationForm = new FormGroup({
      pFIVerifierscomments: new FormControl('', Validators.required),
      pFIVerifiersrating: new FormControl('Positive', Validators.required),
      pverificationdate: new FormControl(),
      pverificationtime: new FormControl()

    });
    let date = new Date()
    this.DocumentVerificationForm.controls.pverificationdate.setValue(this.datePipe.transform(date, 'dd/MM/yyyy'));
    // const routeParams = this.activatedroute.snapshot.params['id'];
    const routeParams = atob(this.activatedroute.snapshot.params['id']);
    if (routeParams !== undefined && routeParams != "") {
      this._VerificationService.GetFiDocumentsToVerify(routeParams).subscribe(res => {
  debugger;
        this.FiDocumentsList = res;
        if(this.FiDocumentsList.firstinformationDTO.length>0){
          //this.pDobConfigage.minDate()=this.FiDocumentsList.firstinformationDTO[0].pDateofapplication;
          this.pDobConfig.minDate = this._commonService.formatDateFromDDMMYYYY(this.FiDocumentsList.firstinformationDTO[0].pDateofapplication); 
           this.pDobConfig.maxDate = this._commonService.formatDateFromDDMMYYYY(this.FiDocumentsList.firstinformationDTO[0].pDateofDisbursement);
        }
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
        //  this.loanspecificunitaddress = this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["businessancillaryunitaddressdetailsDTO"]
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


      });
    }
  }
  SaveFiVerificationDocuments() {
debugger
    this.submitted = true;
    if (this.DocumentVerificationForm.valid) {

      this.FiDocumentsList["pCreatedby"] = this._commonService.pCreatedby;
      this.FiDocumentsList["pModifiedby"] = this._commonService.pCreatedby;
         let date = this.DocumentVerificationForm.value["pverificationdate"];
      if((date.toString()).indexOf("/")!== -1){
        let d = this.DocumentVerificationForm.value["pverificationdate"].split('/')
        this.DocumentVerificationForm.value["pverificationdate"] = (d[2] + '-' + d[1] + '-' + d[0]);
      }
      else {
        this.DocumentVerificationForm.value["pverificationdate"] = this.datePipe.transform(this.DocumentVerificationForm.value["pverificationdate"], 'yyyy-MM-dd');
        // this.DocumentVerificationForm.value["pverificationtime"] = this.datePipe.transform(this.DocumentVerificationForm.value["pverificationdate"], 'hh:mm');

      }
    //  this.FiDocumentsList["pverificationtime"] = this.DocumentVerificationForm.value["pverificationtime"];
     this.FiDocumentsList["pverificationdate"] =this.DocumentVerificationForm.value["pverificationdate"];
      this.FiDocumentsList["pFIVerifiersrating"] = this.DocumentVerificationForm.value["pFIVerifiersrating"]
      this.FiDocumentsList["pFIVerifierscomments"] = this.DocumentVerificationForm.value["pFIVerifierscomments"]
      this.FiDocumentsList["pVerificationstatus"] = "Good";
      this.button = 'Processing';
      this.isLoading = true;
      let d = JSON.stringify(this.FiDocumentsList)
      console.log('Verification',d)
      this._VerificationService.SaveDocumentVerification(this.FiDocumentsList).subscribe(res => {
        this.isLoading = false;
        this.button = 'Submit';
        this.router.navigate(['/VerificationView']);
      }, (error) => {
        this.isLoading = false;
        this.button = 'Submit';
        this._commonService.showErrorMessageForLessTime(error);
      });
    }
  }

  VerifyLoanApplicationDetails(Status, FiDocument, SectionName, rowIndex) {

    if (Status == true) {

      if (SectionName == "LoanDetails") { FiDocument['firstinformationDTO'][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "EducationDetails") { this.FiDocumentsList["applicationPersonal"]["personalEducationList"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "Reference") { this.FiDocumentsList["applicationReferencesDTO"]["lobjAppReferences"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "ExistingLoan") { this.FiDocumentsList["applicationExistingLoanDetailsDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "NomineeDetails") { this.FiDocumentsList["applicationPersonal"]["personalNomineeList"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "IncomeDetails") { this.FiDocumentsList["applicationPersonal"]["personalIncomeList"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "EmployementDetails") { this.FiDocumentsList["applicationPersonal"]["personalEmployeementList"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "BankDetails") { this.FiDocumentsList["applicationPersonal"]["personalBankList"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "PersonalDetails") { this.FiDocumentsList["applicationPersonal"]["personalFamilyList"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "KYCIdentificationDetails") { this.FiDocumentsList["applicationKYCDocumentsDTO"]["documentstorelist"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "CreditScore") { this.FiDocumentsList["applicationKYCDocumentsDTO"]["lstCreditscoreDetailsDTO"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "SecurityandCollateralIMmovable") { this.FiDocumentsList["applicationSecurityandCollateralDTO"]["imMovablePropertyDetailsList"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "SecurityandCollateralMovable") { this.FiDocumentsList["applicationSecurityandCollateralDTO"]["movablePropertyDetailsList"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "ContactDetails") { this.FiDocumentsList["lstApplicationContactPersonalDetailsDTO"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "ContactAddress") { this.FiDocumentsList["lstcontactPersonalAddressDTO"][rowIndex]["isVerified"] = "Verified"; }


      if (SectionName == "BusinessDetails") { this.FiDocumentsList["applicationPersonal"]["businessDetailsDTOList"][rowIndex]["isVerified"] = "Verified"; }
      if (SectionName == "BusinessFinancialDetails") { this.FiDocumentsList["applicationPersonal"]["businessfinancialdetailsDTOList"][rowIndex]["isVerified"] = "Verified"; }

      if (SectionName == "FinancialPerformance") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessfinancialperformanceDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "CreditTrendofPurchases") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendpurchasesDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "CreditTrendofSales") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendsalesDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "StockPosition") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessstockpositionDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "CostofProject") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscostofprojectDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "TurnOverandProfit/LossDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanturnoverandprofitorloss"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "AssociateConcernDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanassociateconcerndetails"][rowIndex]["isVerified"] = "Verified" }
      
      if (SectionName == "Educational Institution and Course Details") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["isVerified"] = "Verified" }
      if (SectionName == "AddressofInstitution") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationInstutiteAddressDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "EducationalQualification") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationQualifcationDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "SourceofFunds") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanFeeDetailsDTO"][rowIndex]["isVerified"] = "Verified" }
      if (SectionName == "FeeDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanyearwiseFeedetailsDTO"][rowIndex]["isVerified"] = "Verified" }

      if (SectionName == "ProductDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["consumerLoanDTO"]["lstConsumerLoanDetailsDTO"][rowIndex]["isVerified"] = "Verified" }

      if (SectionName == "VehicleDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstVehicleLoanDTO"][rowIndex]["isVerified"] = "Verified" }

      if (SectionName == "LoanagainstDeposits") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstLoanagainstDepositDTO"][rowIndex]["isVerified"] = "Verified" }

      if (SectionName == "HomeLoanDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["_HomeLoanDTOLst"][rowIndex]["isVerified"] = "Verified" }

    }
    if (Status == false) {

      if (SectionName == "LoanDetails") { FiDocument['firstinformationDTO'][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "EducationDetails") { this.FiDocumentsList["applicationPersonal"]["personalEducationList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "Reference") { this.FiDocumentsList["applicationReferencesDTO"]["lobjAppReferences"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "ExistingLoan") { this.FiDocumentsList["applicationExistingLoanDetailsDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "NomineeDetails") { this.FiDocumentsList["applicationPersonal"]["personalNomineeList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "IncomeDetails") { this.FiDocumentsList["applicationPersonal"]["personalIncomeList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "EmployementDetails") { this.FiDocumentsList["applicationPersonal"]["personalEmployeementList"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "BankDetails") { this.FiDocumentsList["applicationPersonal"]["personalBankList"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "PersonalDetails") { this.FiDocumentsList["applicationPersonal"]["personalFamilyList"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "KYCIdentificationDetails") { this.FiDocumentsList["applicationKYCDocumentsDTO"]["documentstorelist"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "CreditScore") { this.FiDocumentsList["applicationKYCDocumentsDTO"]["lstCreditscoreDetailsDTO"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "SecurityandCollateralIMmovable") { this.FiDocumentsList["applicationSecurityandCollateralDTO"]["imMovablePropertyDetailsList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "SecurityandCollateralMovable") { this.FiDocumentsList["applicationSecurityandCollateralDTO"]["movablePropertyDetailsList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "ContactDetails") { this.FiDocumentsList["lstApplicationContactPersonalDetailsDTO"][rowIndex]["isVerified"] = "Not Verified"; }
      if (SectionName == "ContactAddress") { this.FiDocumentsList["lstcontactPersonalAddressDTO"][rowIndex]["isVerified"] = "Not Verified"; }

      if (SectionName == "BusinessDetails") { this.FiDocumentsList["applicationPersonal"]["businessDetailsDTOList"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "BusinessFinancialDetails") { this.FiDocumentsList["applicationPersonal"]["businessfinancialdetailsDTOList"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "FinancialPerformance") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessfinancialperformanceDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "CreditTrendofPurchases") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendpurchasesDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "CreditTrendofSales") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscredittrendsalesDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "StockPosition") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessstockpositionDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "CostofProject") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinesscostofprojectDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "TurnOverandProfit/LossDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanturnoverandprofitorloss"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "AssociateConcernDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["businessLoanDTO"]["lstBusinessloanassociateconcerndetails"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "AddressofInstitution") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationInstutiteAddressDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "EducationalQualification") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationQualifcationDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "SourceofFunds") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanFeeDetailsDTO"][rowIndex]["isVerified"] = "Not Verified" }
      if (SectionName == "FeeDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["educationLoanDTO"]["lstEducationLoanyearwiseFeedetailsDTO"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "ProductDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["consumerLoanDTO"]["lstConsumerLoanDetailsDTO"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "VehicleDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstVehicleLoanDTO"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "LoanagainstDeposits") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["lstLoanagainstDepositDTO"][rowIndex]["isVerified"] = "Not Verified" }

      if (SectionName == "HomeLoanDetails") { this.FiDocumentsList["_ApplicationLoanSpecificDTOinVerification"]["_HomeLoanDTOLst"][rowIndex]["isVerified"] = "Not Verified" }
    }

  }


}

