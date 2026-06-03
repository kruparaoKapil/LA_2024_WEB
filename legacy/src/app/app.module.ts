import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { ExportAsModule } from 'ngx-export-as';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


// import { AccountingModule } from '../app/UI/accounting/accounting.module'

import { NumbersonlyDirective } from './Directives/numbersonly.directive';
import { NumbersWithZeroDirective } from './Directives/nuberswithzero.directive';
import { AddressformatDirective } from './Directives/addressformat.directive';
import { CharactersonlyDirective } from './Directives/charactersonly.directive';
import { EmailpatternDirective } from './Directives/emailpattern.directive';
import { MycurrencyFormatterDirective } from './Directives/mycurrency-formatter.directive';
import { NewlineDirective } from './Directives/newline.directive';
import { TitlecasewordDirective } from './Directives/titlecaseword.directive';
import { EmailFormatDirective } from './Directives/emailformat.directive';
import { EnterpriseNameFormatDirective } from './Directives/enterprisenameformat';
import { ThreeDigitNumberDirective } from './Directives/ThreeDigitNumber.directive,'
import { TwoDigitDecimaNumberDirective } from './Directives/two-digit-decima-number.directive';
import { ThreeDigitDecimaNumberDirective } from './Directives/three-digit-decima-number.directive';
import { InitCapDirective } from './Directives/InitCap.directive';


import { AppComponent } from './app.component';
import { FilterPipeModule } from 'ngx-filter-pipe'

import { DashboardComponent } from './UI/Home/dashboard.component';
import { NavigationComponent } from './UI/Home/navigation.component';

import { ChargesMasterComponent } from './UI/Loans/Masters/charges/charges-master.component';
import { ChargeconfigurationViewComponent } from './UI/Loans/Masters/charges/chargeconfiguration-view.component';
import { ChargeconfigurationMasterComponent } from './UI/Loans/Masters/charges/chargeconfiguration-master.component';

import { ContactComponent } from './UI/Loans/Masters/contact-old/contact.component';
import { ContactViewComponent } from './UI/Loans/Masters/contact-old/contact-view.component';
import { ContactIndividualComponent } from './UI/Loans/Masters/contact-old/contact-individual.component';
import { ContactBusinessComponent } from './UI/Loans/Masters/contact-old/contact-business.component';

import { DocumentsComponent } from './UI/Loans/Masters/documents/documents.component';
import { LoansComponent } from './UI/Loans/Masters/loans/loans.component';
import { LoansCreationComponent } from './UI/Loans/Masters/loans/loans-creation.component';

import { SchemeViewComponent } from './UI/Loans/Masters/scheme/scheme-view.component';
import { SchemeMasterComponent } from './UI/Loans/Masters/scheme/scheme-master.component';


import { LoansnamecodeComponent } from './UI/Loans/Masters/loans/loansnamecode.component';
import { LoansinstallmentduedateComponent } from './UI/Loans/Masters/loans/loansinstallmentduedate.component';
import { LoansconfigurationComponent } from './UI/Loans/Masters/loans/loansconfiguration.component';
import { LoanspenalinterestComponent } from './UI/Loans/Masters/loans/loanspenalinterest.component';
import { LoansidentificationdocumentsComponent } from './UI/Loans/Masters/loans/loansidentificationdocuments.component';
import { LoansreferralcommissionComponent } from './UI/Loans/Masters/loans/loansreferralcommission.component';
import { PhotouploadComponent } from './UI/Loans/Masters/contact-old/photoupload.component';


import { CookieService } from 'ngx-cookie-service';

import { PreclosureMasterComponent } from './UI/Loans/Masters/preclosure/preclosure-master.component';
import { PreclosureViewComponent } from './UI/Loans/Masters/preclosure/preclosure-view.component';

import { FiViewComponent } from './UI/Loans/Transactions/FIIndividual/fi-view.component';
import { FiMasterComponent } from './UI/Loans/Transactions/FIIndividual/fi-master.component';
import { FiContacttypeComponent } from './UI/Loans/Transactions/FIIndividual/fi-contacttype.component';
import { FiLoandetailsComponent } from './UI/Loans/Transactions/FIIndividual/fi-loandetails.component';
import { FiApplicantsandothersComponent } from './UI/Loans/Transactions/FIIndividual/fi-applicantsandothers.component';
import { FiKycandidentificationComponent } from './UI/Loans/Transactions/FIIndividual/fi-kycandidentification.component';
import { FiPersonaldetailsComponent } from './UI/Loans/Transactions/FIIndividual/fi-personaldetails.component';
import { FiSecurityandcollateralComponent } from './UI/Loans/Transactions/FIIndividual/fi-securityandcollateral.component';
import { FiExistingloansComponent } from './UI/Loans/Transactions/FIIndividual/fi-existingloans.component';
import { FiReferencesComponent } from './UI/Loans/Transactions/FIIndividual/fi-references.component';
import { FiReferralComponent } from './UI/Loans/Transactions/FIIndividual/fi-referral.component';
import { BusinessloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/businessloan.component';
import { ConsumerloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/consumerloan.component';
import { EducationloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/educationloan.component';
import { GoldloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/goldloan.component';
import { HomeloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/homeloan.component';
import { LoanagainstdepositsloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/loanagainstdepositsloan.component';
import { LoanagainstpropertyloanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/loanagainstpropertyloan.component';
import { PersonalLoanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/personal-loan.component';
import { VehicleLoanComponent } from './UI/Loans/Transactions/FIIndividual/Loans/vehicle-loan.component';
import { ReferralAgentViewComponent } from './UI/Settings/Referral-Agent/referral-agent-view.component';
import { ReferralAgentMasterComponent } from './UI/Settings/Referral-Agent/referral-agent-master.component';
import { AdvocateLawyerMasterComponent } from './UI/Settings/Advocate-Lawyer/advocate-lawyer-master.component';
import { AdvocateLawyerViewComponent } from './UI/Settings/Advocate-Lawyer/advocate-lawyer-view.component';
import { EmployeeViewComponent } from './UI/Settings/Employee/employee-view.component';
import { EmployeeMasterComponent } from './UI/Settings/Employee/employee-master.component';

import { MycurrencypipePipe } from './Pipes/mycurrencypipe.pipe';
import { FiLoanspecficComponent } from './UI/Loans/Transactions/FIIndividual/fi-loanspecfic.component';
//import { ReferralAgentContactComponent } from './UI/Settings/Referral-Agent/referral-agent-contact.component';
//import { ReferralAgentKycdocumentsComponent } from './UI/Settings/Referral-Agent/referral-agent-kycdocuments.component';
//import { ReferralAgentBankdetailsComponent } from './UI/Settings/Referral-Agent/referral-agent-bankdetails.component';
//import { ReferralAgentTdsdetailsComponent } from './UI/Settings/Referral-Agent/referral-agent-tdsdetails.component';
// import { AdvocateLawyerTdsdetailsComponent } from './UI/Settings/Advocate-Lawyer/advocate-lawyer-tdsdetails.component';
// import { AdvocateLawyerBankdetailsComponent } from './UI/Settings/Advocate-Lawyer/advocate-lawyer-bankdetails.component';
// import { AdvocateLawyerKycdocumentsComponent } from './UI/Settings/Advocate-Lawyer/advocate-lawyer-kycdocuments.component';
// import { AdvocateSelectComponent } from './UI/Settings/Advocate-Lawyer/advocate-select.component';

import { PartyViewComponent } from './UI/Settings/contact-party/party-view.component';
import { PartyMasterComponent } from './UI/Settings/contact-party/party-master.component';
// import { PartyBankdetailsComponent } from './UI/Settings/contact-party/party-bankdetails.component';
// import { PartyKycdocumentsComponent } from './UI/Settings/contact-party/party-kycdocuments.component';
// import { PartySelectComponent } from './UI/Settings/contact-party/party-select.component';
// import { PartyTdsdetailsComponent } from './UI/Settings/contact-party/party-tdsdetails.component';





import { KYCDocumentsComponent } from './UI/Common/kycdocuments/kycdocuments.component';
import { BankdetailsComponent } from './UI/Common/bankdetails/bankdetails.component';
import { TDSDetailsComponent } from './UI/Common/tdsdetails/tdsdetails.component';
import { RoundecimalDirective } from './Directives/roundecimal.directive';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { GroupViewComponent } from './UI/Common/group-view/group-view.component';
import { GroupCreationComponent } from './UI/Common/group-creation/group-creation.component';
import { ContactSelectComponent } from './UI/Common/contact-select/contact-select.component';

import { FiPersonaldetailsEmploymentComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-employment.component';
import { FiPersonaldetailsBusinessComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-business.component';
import { FiPersonaldetailsFinancialperformanceComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-financialperformance.component';

import { FiPersonaldetailsFamilyComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-family.component';
import { FiPersonaldetailsNomineeComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-nominee.component';

import { FiPersonaldetailsIncomeComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-income.component';
import { FiPersonaldetailsOtherincomeComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-otherincome.component';
import { FiPersonaldetailsEducationComponent } from './UI/Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-education.component';

import { PersonalDetailsComponent } from './UI/Common/personal-details/personal-details.component';
import { FamilyDetailsComponent } from './UI/Common/family-details/family-details.component';
import { EmployeeDetailsComponent } from './UI/Common/employee-details/employee-details.component';
import { ValidationMessageComponent } from './UI/Common/validation-message/validation-message.component';
import { AddressComponent } from './UI/Common/address/address.component';
import { ButtonDoubleClickDirective } from './Directives/button-double-click.directive';
import { AlphaNumericDirective } from './Directives/alpha-numeric.directive';
import { AlphanumericcharsonlyDirective } from './Directives/alphanumericcharsonly.directive';
import { appAlphanumericwithSpecialCharactersDirective } from './Directives/AlphaNumericWithSpecialCharacters.directive';
import { PropertyDetailsComponent } from './UI/Common/property-details/property-details.component';
import { MovablePropertyDetailsComponent } from './UI/Common/movable-property-details/movable-property-details.component';
import { TimeMaskDirective } from './Directives/time-mask.directive'

///
import { ChequemanagementViewComponent } from '../app/UI/accounting/masters/Chequemanagement/chequemanagement-view.component';
import { ChequemanagementMasterComponent } from '../app/UI/accounting/masters/Chequemanagement/chequemanagement-master.component';
import { AccountsMasterComponent } from '../app/UI/accounting/masters/Accounts/accounts-master.component';
import { AccountsViewComponent } from '../app/UI/accounting/masters/Accounts/accounts-view.component';
import { BankViewComponent } from '../app/UI/accounting/masters/Bankinformation/bank-view.component';
import { BankMasterComponent } from '../app/UI/accounting/masters/Bankinformation/bank-master.component';

import { GeneralreceiptViewComponent } from '../app/UI/accounting/Transactions/Generalreceipt/generalreceipt-view.component';
import { GeneralreceiptNewComponent } from '../app/UI/accounting/Transactions/Generalreceipt/generalreceipt-new.component';
import { PaymentvoucherViewComponent } from '../app/UI/accounting/Transactions/Paymentvoucher/paymentvoucher-view.component';
import { PaymentvoucherNewComponent } from '../app/UI/accounting/Transactions/Paymentvoucher/paymentvoucher-new.component';
import { JournalvoucherNewComponent } from '../app/UI/accounting/Transactions/Journalvoucher/journalvoucher-new.component';
import { JournalvoucherViewComponent } from '../app/UI/accounting/Transactions/Journalvoucher/journalvoucher-view.component';

import { ChequesonhandNewComponent } from '../app/UI/accounting/Transactions/Chequesonhand/chequesonhand-new.component';
import { ChequesissuedNewComponent } from '../app/UI/accounting/Transactions/Chequesissued/chequesissued-new.component';
import { ChequesinbankNewComponent } from '../app/UI/accounting/Transactions/Chequesinbank/chequesinbank-new.component';
import { VerificationNewComponent } from './UI/Loans/Transactions/Verification/verification-new.component';
import { VerificationViewComponent } from './UI/Loans/Transactions/Verification/verification-view.component';
import { AprovalViewComponent } from './UI/Loans/Transactions/Aproval/aproval-view.component';
import { AprovalNewComponent } from './UI/Loans/Transactions/Aproval/aproval-new.component';
import { DisbursementNewComponent } from './UI/Loans/Transactions/Disbursement/disbursement-new.component';
import { DisbursementViewComponent } from './UI/Loans/Transactions/Disbursement/disbursement-view.component';
import { DeliveryorderNewComponent } from './UI/Loans/Reports/Deliveryorder/deliveryorder-new.component';
import { AcknowledgementsNewComponent } from './UI/Loans/Reports/Acknowledgements/acknowledgements-new.component';
import { TeleVrificationComponent } from './UI/Loans/Transactions/Verification/tele-vrification.component';
import { AddressVerificationComponent } from './UI/Loans/Transactions/Verification/address-verification.component';
import { DocumentVerificationComponent } from './UI/Loans/Transactions/Verification/document-verification.component';
import { IfsccodevalidatorDirective } from './Directives/ifsccodevalidator.directive';
import { SanctionLetterComponent } from './UI/Loans/Reports/sanction-letter/sanction-letter.component';
//import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { DisburementLetterComponent } from './UI/Loans/Reports/disburement-letter/disburement-letter.component';
import { LoanreceiptViewComponent } from './UI/Loans/Transactions/loanreceipt/loanreceipt-view.component';
import { LoanreceiptNewComponent } from './UI/Loans/Transactions/loanreceipt/loanreceipt-new.component';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { AddMenuComponent } from './UI/Settings/add-menu/add-menu.component';
import { UserRightsComponent } from './UI/Settings/user-rights/user-rights.component';


import { GeneralReceiptReportsComponent } from './UI/accounting/reports/general-receipt-reports.component';
import { PaymentVoucherReportsComponent } from './UI/accounting/./reports/payment-voucher-reports.component';
import { NumberToWordsPipe } from './Pipes/number-to-words.pipe';
import { UsersviewComponent } from './UI/Settings/Users/usersview/usersview.component';
import { UsersregistrationComponent } from './UI/Settings/Users/usersregistration/usersregistration.component';
import { CashBookComponent } from './UI/accounting/reports/cash-book.component';
import { BankBookComponent } from './UI/accounting/reports/bank-book.component';
import { UppercaseDirective } from './Directives/uppercase.directive';

import { LoginComponent } from './login/login.component';
import { UserLoginComponent } from './UI/Settings/Users/user-login/user-login.component';
import { JwtInterceptor } from './Services/Settings/Users/_helpers/jwt.interceptor';
import { ErrorInterceptor } from './Services/Settings/Users/_helpers/error.interceptor';
import { AuthGuard } from './Services/Settings/Users/_helpers/auth.guard';
import { AccountLedgerComponent } from './UI/accounting/reports/account-ledger.component';
import { DayBookComponent } from './UI/accounting/reports/day-book.component';
import { PartyLedgerComponent } from './UI/accounting/reports/party-ledger.component';
import { CollectionsReportComponent } from './UI/Loans/Reports/collections-report/collections-report.component';
import { BankReconStatmentComponent } from './UI/accounting/reports/bank-recon-statment.component';
import { TrialBalanceComponent } from './UI/accounting/reports/trialbalance/trial-balance.component';

import { ContactListComponent } from './UI/Settings/contacts/contact-list/contact-list.component';
import { ContactListDetailViewComponent } from './UI/Settings/contacts/contact-list-detail-view/contact-list-detail-view.component';
import { AutoFocusDirective } from './Directives/auto-focus.directive';

import { BalanceSheetComponent } from './UI/accounting/reports/balance-sheet.component';
import { ProfitAndLossComponent } from './UI/accounting/reports/profit-and-loss.component';
import { ComparisionTrialBalanceComponent } from './UI/accounting/reports/comparision-trial-balance.component';
import { AccountSummaryDetailsComponent } from './UI/accounting/reports/account-summary-details.component';
import { RePrintComponent } from './UI/accounting/reports/re-print.component';
import { JournalVoucherReportComponent } from './UI/accounting/reports/journal-voucher-report.component';
import { CompanyDetailsComponent } from './UI/Common/company-details/company-details.component';
import { TrialbalanceLedgersummeryComponent } from './UI/accounting/reports/trialbalance/trialbalance-ledgersummery.component';
import { TrialbalanceAccountledgerComponent } from './UI/accounting/reports/trialbalance/trialbalance-accountledger.component';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { EmichartReportComponent } from './UI/Loans/Reports/emichart-report/emichart-report.component';

import { DueReportsComponent } from './UI/Loans/Reports/due-reports/due-reports.component';
import { DisbursmentReportComponent } from './UI/Loans/Reports/disbursment-report/disbursment-report.component';
import { RemoveZeroDirective } from './Directives/remove-zero.directive';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ZeroDirective } from './Directives/zero.directive';
import { LoanStatementComponent } from './UI/Loans/Reports/loan-statement/loan-statement.component';

import { EmichartViewComponent } from './UI/Loans/Reports/emichart-report/emichart-view.component';

import { DuereportsEmiComponent } from './UI/Loans/Reports/due-reports/duereports-emi.component';
import { GenerateidMasterComponent } from './UI/Settings/generateid-master/generateid-master.component';
import { ChequeEnquiryComponent } from './UI/accounting/reports/cheque-enquiry/cheque-enquiry.component';
import { JvListComponent } from './UI/accounting/reports/jv-list/jv-list.component';
import { LedgerExtractComponent } from './UI/accounting/reports/ledger-extract/ledger-extract.component';
import { ChequeCancelComponent } from './UI/accounting/reports/cheque-cancel/cheque-cancel.component';
import { ChequeReturnComponent } from './UI/accounting/reports/cheque-return/cheque-return.component';

import { IssuedChequeComponent } from './UI/accounting/reports/issued-cheque/issued-cheque.component';

import { CompanyConfigComponent } from './UI/Settings/company-config/company-config.component';
import { BranchConfigComponent } from './UI/Settings/branch-config/branch-config.component';
import { CompanyconfigDocumentsComponent } from './UI/Settings/company-config/companyconfig-documents/companyconfig-documents.component';
import { CompanyconfigPromotorsComponent } from './UI/Settings/company-config/companyconfig-promotors/companyconfig-promotors.component';

import { TrendreportsComponent } from './UI/Loans/Reports/trendreports/trendreports.component';
import { TrendDisbursementReportComponent } from './UI/Loans/Reports/trendreports/trend-disbursement-report.component';
import { TrendCollectionReportComponent } from './UI/Loans/Reports/trendreports/trend-collection-report.component';
import { SubaccountLedgerComponent } from './UI/accounting/reports/subaccount-ledger/subaccount-ledger.component';
import { MembertypeViewComponent } from './UI/Banking/Masters/Membertype/membertype-view.component';
import { MembertypeNewComponent } from './UI/Banking/Masters/Membertype/membertype-new.component';
import { MemberNewComponent } from './UI/Banking/Masters/Member/member-new.component';
import { MemberViewComponent } from './UI/Banking/Masters/Member/member-view.component';
import { CompanydocumentsComponent } from './UI/Common/companydocuments/companydocuments.component';

import { CollectionReportsDetailSectionComponent } from './UI/Loans/Reports/collections-report/collection-reports-detail-section.component';
import { SubledgerSummaryComponent } from './UI/accounting/reports/subledger-summary/subledger-summary.component';


import { FdconfigNewComponent } from './UI/Banking/Masters/Fdconfig/fdconfig-new.component';
import { FdConfigViewComponent } from './UI/Banking/Masters/Fdconfig/fd-config-view.component';
import { RdconfigNewComponent } from './UI/Banking/Masters/Rdconfig/rdconfig-new.component';
import { RdconfigViewComponent } from './UI/Banking/Masters/Rdconfig/rdconfig-view.component';
import { SavingsConfigNewComponent } from './UI/Banking/Masters/Savings-AC/savings-config-new.component';
import { SavingsConfigViewComponent } from './UI/Banking/Masters/Savings-AC/savings-config-view.component';
import { SharesConfigViewComponent } from './UI/Banking/Masters/Shares/shares-config-view.component';
import { SharesConfigNewComponent } from './UI/Banking/Masters/Shares/shares-config-new.component';
import { CompanynameCompanycodeComponent } from './UI/Common/companyname-companycode/companyname-companycode.component';

import { ShareCapitalComponent } from './UI/Banking/Masters/Shares/share-capital.component';
import { ShareReferralCommissionComponent } from './UI/Banking/Masters/Shares/share-referral-commission.component';

import { SavingsNameCodeComponent } from './UI/Banking/Masters/Savings-AC/savings-name-code.component';
import { SavingsConfigurationComponent } from './UI/Banking/Masters/Savings-AC/savings-configuration.component';
import { LoanFacilityComponent } from './UI/Banking/Masters/Savings-AC/loan-facility.component';
import { ReferralCommissionComponent } from './UI/Banking/Masters/Savings-AC/referral-commission.component';
import { IdentificationDocumentsComponent } from './UI/Common/identification-documents/identification-documents.component';
import { DecimalwithcurrencyformatDirective } from './Directives/decimalwithcurrencyformat.directive';
import { ProfitandLossMTDYTDComponent } from './UI/accounting/reports/profitand-loss-mtdytd/profitand-loss-mtdytd.component';
import { LoanpreclosureViewComponent } from './UI/Loans/Transactions/loanpreclosure/loanpreclosure-view.component';
import { LoanpreclosureNewComponent } from './UI/Loans/Transactions/loanpreclosure/loanpreclosure-new.component';
import { RdnameandcodeComponent } from './UI/Banking/Masters/Rdconfig/rdnameandcode.component';
import { RdconfigurationComponent } from './UI/Banking/Masters/Rdconfig/rdconfiguration.component';
import { RdloanandfacilityComponent } from './UI/Banking/Masters/Rdconfig/rdloanandfacility.component';
import { RdidentificationComponent } from './UI/Banking/Masters/Rdconfig/rdidentification.component';
import { RdrefferalcommisionComponent } from './UI/Banking/Masters/Rdconfig/rdrefferalcommision.component';
import { CurrencypipewithdecimalPipe } from './Pipes/currencypipewithdecimal.pipe';
import { InsuranceMemberViewComponent } from './UI/Banking/Masters/Insurance/insurance-member-view.component';
import { InsuranceMemberNewComponent } from './UI/Banking/Masters/Insurance/insurance-member-new.component';
import { InsuranceConfigViewComponent } from './UI/Banking/Masters/Insurance/insurance-config-view.component';
import { InsuranceConfigNewComponent } from './UI/Banking/Masters/Insurance/insurance-config-new.component';
import { FdconfigurationComponent } from './UI/Banking/Masters/Fdconfig/fdconfiguration.component';
import { FdloanandfacilityComponent } from './UI/Banking/Masters/Fdconfig/fdloanandfacility.component';
import { FdidentificationComponent } from './UI/Banking/Masters/Fdconfig/fdidentification.component';
import { FdrefferalcommisionComponent } from './UI/Banking/Masters/Fdconfig/fdrefferalcommision.component';
import { FdnameandcodeComponent } from './UI/Banking/Masters/Fdconfig/fdnameandcode.component';

import { LoanStatementReportComponent } from './UI/Loans/Reports/loan-statement/loan-statement-report.component';

import { SavingsTransactionsViewComponent } from './UI/Banking/Transactions/Savings-AC/savings-transactions-view.component';
import { SavingsTransactionsNewComponent } from './UI/Banking/Transactions/Savings-AC/savings-transactions-new.component';
import { ShareApplicationComponent } from './UI/Banking/Transactions/share-application/share-application.component';
import { ContactListPartyComponent } from './UI/Settings/contacts/contact-list-party/contact-list-party.component';
import { ShareAppViewComponent } from './UI/Banking/Transactions/share-application/share-app-view.component';
import { FdTransactionViewComponent } from './UI/Banking/Transactions/FD-AC-Creation/fd-transaction-view.component';
import { FdTransactionNewComponent } from './UI/Banking/Transactions/FD-AC-Creation/fd-transaction-new.component';
import { RdTransactionNewComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-transaction-new.component';
import { RdTransactionViewComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-transaction-view.component';


import { FdJointmemberComponent } from './UI/Banking/Transactions/FD-AC-Creation/fd-jointmember.component';
import { FdReferralComponent } from './UI/Banking/Transactions/FD-AC-Creation/fd-referral.component';




import { JointmemberNomineeComponent } from './UI/Banking/Transactions/Savings-AC/jointmember-nominee.component';
import { ReferralComponent } from './UI/Banking/Transactions/Savings-AC/referral.component';

import { RdRecurringdepositComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-recurringdeposit.component'
import { RdJointmemberComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-jointmember.component'
import { RdReferralComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-referral.component';
import { NegativevaluePipe } from './Pipes/negativevalue.pipe';
import { LienEntryComponent } from './UI/Banking/Masters/lien-entry/lien-entry.component'
import { LienEntryViewComponent } from './UI/Banking/Masters/lien-entry/lien-entry-view.component'
import { SelfOrAdjustmentViewComponent } from './UI/Banking/Transactions/SelfOrAdustment/self-or-adjustment-view.component'
import { SelfOrAdjustmentNewComponent } from './UI/Banking/Transactions/SelfOrAdustment/self-or-adjustment-new.component';
import { LienReleaseNewComponent } from './UI/Banking/Transactions/Lien-Release/lien-release-new.component';
import { LienReleaseViewComponent } from './UI/Banking/Transactions/Lien-Release/lien-release-view.component'
import { NomineedetailsComponent } from './UI/Banking/Transactions/FD-AC-Creation/nomineedetails.component';
import { FdreceiptViewComponent } from './UI/Banking/Transactions/FD-Receipt/fdreceipt-view.component';
import { FdreceiptNewComponent } from './UI/Banking/Transactions/FD-Receipt/fdreceipt-new.component';
import { InterestpaymentViewComponent } from './UI/Banking/Transactions/Interest Payment/interestpayment-view.component';
import { InterestpaymentNewComponent } from './UI/Banking/Transactions/Interest Payment/interestpayment-new.component';
import { MaturityPaymentnewComponent } from './UI/Banking/Transactions/Maturity Payment/maturity-paymentnew.component';
import { MaturityBondnewComponent } from './UI/Banking/Transactions/Maturity Bond/maturity-bondnew.component';
import { CommissionPayementNewComponent } from './UI/Banking/Transactions/Commission Payment/commission-payement-new.component';
import { CommissionPayementViewComponent } from './UI/Banking/Transactions/Commission Payment/commission-payement-view.component';
import { TransferNewComponent } from './UI/Banking/Transactions/Transfer/transfer-new.component';
import { BondPreviewNewComponent } from './UI/Banking/Transactions/Bond-Preview/bond-preview-new.component';


import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BondPreviewComponent } from './UI/Banking/Reports/bond-preview.component';
import { MaturityBondViewComponent } from './UI/Banking/Transactions/Maturity Bond/maturity-bond-view.component';
import { InterestPaymentReportComponent } from './UI/Banking/Reports/interest-payment-report/interest-payment-report.component';
import { InterestpaymentpreviewComponent } from './UI/Banking/Reports/interestpaymentpreview/interestpaymentpreview.component';
import { MaturityPaymentViewComponent } from './UI/Banking/Transactions/Maturity Payment/maturity-payment-view.component';
import { MaturityPaymentRenewalComponent } from './UI/Banking/Transactions/Maturity Payment/maturity-payment-renewal.component';
import { PromoteSalaryReportComponent } from './UI/Banking/Reports/promote-salary-report.component';
import { MaturityIntimationReportComponent } from './UI/Banking/Reports/maturity-intimation-report.component';
import { LienReleaseReportComponent } from './UI/Banking/Reports/lien-release-report.component';
import { SelfAdjustmentReportComponent } from './UI/Banking/Reports/self-adjustment-report.component';
import { PreMaturityReportComponent } from './UI/Banking/Reports/pre-maturity-report.component';
import { FdTranscationDetailsComponent } from './UI/Banking/Transactions/FD-AC-Creation/fd-transcation-details.component';
import { MemberEnquiryComponent } from './UI/Banking/Reports/member-enquiry/member-enquiry.component';
import { MemberenquiryreceiptsRDComponent } from './UI/Banking/Reports/member-enquiry/member-enquiry-receipts-rd.component';
import { MemberenquiryreceiptsSAComponent } from './UI/Banking/Reports/member-enquiry/member-enquiry-receipts-sa.component';
import { MemberenquiryreceiptsShareComponent } from './UI/Banking/Reports/member-enquiry/member-enquiry-receipts-share.component';



import { TrendReportComponent } from './UI/Banking/Reports/trend-report.component';
import { MemberenquiryreceiptsComponent } from './UI/Banking/Reports/member-enquiry/memberenquiryreceipts.component';
import { InterestPaymentTrendReportComponent } from './UI/Banking/Reports/interest-payment-trend-report.component';
import { MemberWiseReceiptsReportComponent } from './UI/Banking/Reports/member-wise-receipts-report.component';
import { LienEntryPreviewComponent } from './UI/Banking/Reports/lien-entry-preview.component';
import { MaturityIntimationPreviewComponent } from './UI/Banking/Reports/maturity-intimation-preview.component';
import { AgentPointsReportComponent } from './UI/Banking/Reports/agent-points-report.component';
import { TargetReportComponent } from './UI/Banking/Reports/target-report.component';
import { CashFlowReportComponent } from './UI/Banking/Reports/cash-flow-report.component';
import { ContactNewComponent } from './UI/Loans/Masters/contact-new/contact-new.component';
import { ContactNewIndividualComponent } from './UI/Loans/Masters/contact-new/contact-new-individual.component';
import { ContactNewBusinessComponent } from './UI/Loans/Masters/contact-new/contact-new-business.component';
import { ContactNewPhotouploadComponent } from './UI/Loans/Masters/contact-new/contact-new-photoupload.component';
import { SelectsubscriberComponent } from './UI/Loans/Masters/contact-new/selectsubscriber.component';
import { BankdetailsnewComponent } from './UI/Common/bankdetails-new/bankdetailsnew.component';
import { KycdocumentsnewComponent } from './UI/Common/kycdocuments-new/kycdocuments-new.component';
import { AccountTreeComponent } from './UI/accounting/masters/Account-Tree/account-tree.component';
import { ContactNewViewComponent } from './UI/Loans/Masters/contact-new/contact-new-view.component';
import { ContactNewDetailedNewComponent } from './UI/Loans/Masters/contact-new/contact-new-detailed-new.component';
import { ContactMoreComponent } from './UI/Loans/Masters/contact-more/contact-more.component';
import { EmployeeDetailsNewComponent } from './UI/Common/employee-details/employee-details-new.component';
import { NumberRangeDirective } from './Directives/longitudeformat.directive';
import { InterestReportComponent } from './UI/Banking/Reports/interest-report.component';
import { TdsReportComponent } from './UI/Tds/Transcations/Tds report/tds-report.component';
import { ChallanaCheckingComponent } from './UI/Tds/Transcations/challana-checking/challana-checking.component';
import { ChallanaPaymentComponent } from './UI/Tds/Transcations/challana-payment.component';
import { CINEntryComponent } from './UI/Tds/Transcations/cin-entry.component';
import { CINEntryReportComponent } from './UI/Tds/Transcations/Cin-entryReport/cin-entry-report.component';
import { ChallanaPaymentReportComponent } from './UI/Tds/Transcations/challana-payment-report.component';
import { MaturityTrendDetailsComponent } from './UI/Banking/Reports/maturity-trend-details/maturity-trend-details.component';
import { MemberEnquiryDetailsComponent } from './UI/Banking/Reports/member-enquiry-details.component';
import { InterestpaymentTrenddetailsReportComponent } from './UI/Banking/Reports/interestpayment-trenddetails-report/interestpayment-trenddetails-report.component';
import { ApplicationFormComponent } from './UI/Banking/Reports/application-form.component';
import { ApplicationFormReportComponent } from './UI/Banking/Reports/application-form-report.component';
import { RdreceiptNewComponent } from './UI/Banking/Transactions/RD-Receipt/rdreceipt-new/rdreceipt-new.component';
import { SAReceiptComponent } from './UI/Banking/Transactions/SA-Receipt/sa-receipt.component';
import { MemberReceiptComponent } from './UI/Banking/Transactions/Member Receipt/member-receipt.component';
import { MemberReceiptViewComponent } from './UI/Banking/Transactions/Member Receipt/member-receipt-view.component';
import { SavingReceiptViewComponent } from './UI/Banking/Transactions/SA-Receipt/sa-receipt-view.component';
import { RdNomineedetailsComponent } from './UI/Banking/Transactions/RD-AC-Creation/rd-nomineedetails.component';
import { SpJointmemberComponent } from './UI/Banking/Transactions/share-application/sp-jointmember.component';
import { SpReferralComponent } from './UI/Banking/Transactions/share-application/sp-referral.component';
import { CoReferralComponent } from './UI/Common/co-referral/co-referral.component';
import { CoJointmemberComponent } from './UI/Common/co-jointmember/co-jointmember.component';
import { CoNomineedetailsComponent } from './UI/Common/co-nomineedetails/co-nomineedetails.component';
import { ShareReceiptComponent } from './UI/Banking/Transactions/share-receipt/share-receipt.component';
import { ShareReceiptViewComponent } from './UI/Banking/Transactions/share-receipt/share-receipt-view.component';
import { RdInstallmentsChartComponent } from './UI/Banking/Reports/rd-installments-chart/rd-installments-chart.component';
import { RdreceiptViewComponent } from './UI/Banking/Transactions/RD-Receipt/rdreceipt-new/rdreceipt-view.component';
import { MemberSelectComponent } from './UI/Common/member-select/member-select.component';
import { SaWithdrawalComponent } from './UI/Banking/Transactions/sa-withdrawal/sa-withdrawal.component';
import { ShareWithdrawalComponent } from './UI/Banking/Transactions/share-withdrawal/share-withdrawal.component';
import { SaWithdrawalViewComponent } from './UI/Banking/Transactions/sa-withdrawal/sa-withdrawal-view.component';
import { ShareWithdrawalViewComponent } from './UI/Banking/Transactions/share-withdrawal/share-withdrawal-view.component';
import { CharacterwithspecialDirective } from './Directives/characterwithspecial.directive';
import { PaymentReceiptDetailsComponent } from './UI/Banking/Reports/payment-receipts-details/payment-receipts-details.component';
import { DepositWithdrawalDepositsComponent } from './UI/Banking/Reports/deposit-withdrawal-deposits/deposit-withdrawal-deposits.component';
import { DepositWithdrawalWithdrawalComponent } from './UI/Banking/Reports/deposit-withdrawal-withdrawal/deposit-withdrawal-withdrawal.component';
import { DueRDInstalmentsComponent } from './UI/Banking/Reports/due-rd-instalments/due-rd-instalments.component';
import { FDFieldDepositsComponent } from './UI/Banking/Reports/fd-field-deposits/fd-field-deposits.component';
import { FDRecurringDepositsComponent } from './UI/Banking/Reports/fd-recurring-deposits/fd-recurring-deposits.component';
import { FDRenewalsComponent } from './UI/Banking/Reports/fd-renewals/fd-renewals.component';
import { FDShareCapitalsComponent } from './UI/Banking/Reports/fd-share-capitals/fd-share-capitals.component';
import { RDAdvancePaidListComponent } from './UI/Banking/Reports/rd-advance-paid-list/rd-advance-paid-list.component';
// import { RDInstalmentsComponent } from './UI/Banking/Reports/rd-instalments/rd-instalments.component';
import { MemberDetailsReportComponent } from './UI/Banking/Reports/member-details-report/member-details-report.component';
import { SavingAccountReportComponent } from './UI/Banking/Reports/saving-account-report/saving-account-report.component';
import { ShareIssueReportComponent } from './UI/Banking/Reports/share-issue-report/share-issue-report.component';
import { ShareSavingWithdrawDetailsComponent } from './UI/Banking/Reports/share-saving-withdraw-details/share-saving-withdraw-details.component';
import { RdInstalmentsReportComponent } from './UI/Loans/Reports/rd-instalments-report/rd-instalments-report.component';
import { EditorModule } from '@progress/kendo-angular-editor';
import { WelcomeLetterComponent } from './UI/Banking/Letters/welcome-letter/welcome-letter.component';
import { DefaultReminderLetterComponent } from './UI/Banking/Letters/default-reminder-letter/default-reminder-letter.component';
import { LoanClosingCoveringLetterComponent } from './UI/Banking/Letters/loan-closing-covering-letter/loan-closing-covering-letter.component';
import { ForeclosurePrepaymentRequestLetterComponent } from './UI/Banking/Letters/foreclosure-prepayment-request-letter/foreclosure-prepayment-request-letter.component';
import { LoanClosureCertificateComponent } from './UI/Banking/Letters/loan-closure-certificate/loan-closure-certificate.component';
import { PartDisbursementAdviceComponent } from './UI/Banking/Letters/part-disbursement-advice/part-disbursement-advice.component';
import { FinalDisbursementAdviceComponent } from './UI/Banking/Letters/final-disbursement-advice/final-disbursement-advice.component';
import { ChequeSubmissionComponent } from './UI/Banking/Letters/cheque-submission/cheque-submission.component';
import { LoanAgreementComponent } from './UI/Banking/Letters/loan-agreement/loan-agreement.component';
import { DisbursementRequestFormComponent } from './UI/Banking/Letters/disbursement-request-form/disbursement-request-form.component';
import { DemandPromsoryNoteComponent } from './UI/Banking/Letters/demand-promsory-note/demand-promsory-note.component';
import { SanctionLetterNewComponent } from './UI/Banking/Letters/sanction-letter-new/sanction-letter-new.component';
import { FixedDepositReceiptComponent } from './UI/Banking/Transactions/FD-Receipt/fixed-deposit-receipt/fixed-deposit-receipt.component';
import { PartpaymentComponent } from './UI/Loans/Transactions/partpayment/partpayment.component';
import { PartpaymentViewComponent } from './UI/Loans/Transactions/partpayment/partpayment-view.component';
import { MoratoriumComponent } from './UI/Loans/Transactions/moratorium/moratorium.component';
import { GSTReportComponent } from './UI/Loans/Reports/gst-report/gst-report.component';
import { MoratoriumViewComponent } from './UI/Loans/Transactions/moratorium/moratorium-view/moratorium-view.component';
import { BranchSelectionComponent } from './UI/Settings/Users/branch-selection/branch-selection.component';
import { MaturityPreviewComponent } from './UI/Banking/Reports/maturity-preview/maturity-preview.component';
import { PreMaturityPreviewComponent } from './UI/Banking/Reports/pre-maturity-preview/pre-maturity-preview.component';
import { MaturityPaymentPreviewComponent } from './UI/Banking/Reports/maturity-payment-preview/maturity-payment-preview.component';
import { BranchWiseReceiptsReportComponent } from './UI/Banking/Reports/branch-wise-receipts-report/branch-wise-receipts-report.component';
import { ScheduleTrailBalanceReportComponent } from './UI/Banking/Reports/schedule-trail-balance-report/schedule-trail-balance-report.component';
import { CoReferral1Component } from './UI/Common/co-referral1/co-referral1.component';
import { JournalVoucherReportDuplicateComponent } from './UI/accounting/reports/journal-voucher-report-duplicate/journal-voucher-report-duplicate.component';
import { GeneralReceiptReportDuplicateComponent } from './UI/accounting/reports/general-receipt-report-duplicate/general-receipt-report-duplicate.component';
import { PaymentVoucherReportDuplicateComponent } from './UI/accounting/reports/payment-voucher-report-duplicate/payment-voucher-report-duplicate.component';
import { PanUpdateComponent } from './UI/Tds/Masters/pan-update/pan-update.component';
import { TdsAccountsSetupComponent } from './UI/Tds/Masters/tds-accounts-setup/tds-accounts-setup.component';
import { SectionWiseReportComponent } from './UI/Tds/Reports/section-wise-report/section-wise-report.component';
import { SubCategoryComponent } from './UI/accounting/masters/sub-category/sub-category.component';
import { AgentWiseBusinessComponent } from './UI/Banking/Reports/agent-wise-business/agent-wise-business.component';
import { InterestReportNewComponent } from './UI/Banking/Reports/interest-report-new/interest-report-new.component';
import { MenuSortingComponent } from './UI/Settings/menu-sorting/menu-sorting.component';
import { BankReconStatementNewComponent } from './UI/accounting/reports/bank-recon-statement-new/bank-recon-statement-new.component';
import { BrsPreviewComponent } from './UI/Banking/Reports/brs-preview/brs-preview.component';
import { LienEntryNewComponent } from './UI/Banking/Masters/lien-entry-new/lien-entry-new.component';
import { LienEntryPreviewNewComponent } from './UI/Banking/Reports/lien-entry-preview-new/lien-entry-preview-new.component';
import { AgentCommissionReportComponent } from './UI/Banking/Reports/agent-commission-report/agent-commission-report.component';
import { CoJointmember1Component } from './UI/Common/co-jointmember1/co-jointmember1.component';
import { BRSReportsComponent } from './UI/accounting/reports/brs-reports/brs-reports.component';
import { TDSPaymentvoucherComponent } from './UI/accounting/Transactions/tds-paymentvoucher/tds-paymentvoucher.component';
import { TdsPaymentVoucherViewComponent } from './UI/accounting/Transactions/tds-payment-voucher-view/tds-payment-voucher-view.component';
import { TdsPaymentVoucherReportsComponent } from './UI/accounting/reports/tds-payment-voucher-reports/tds-payment-voucher-reports.component';
import { RePrintNewComponent } from './UI/accounting/reports/re-print-new/re-print-new.component';
import { SSCAgendaComponent } from './UI/HRMS/Transactions/ssc-agenda/ssc-agenda.component';
import { PayrollProcessComponent } from './UI/HRMS/Transactions/payroll-process/payroll-process.component';
import { ESIStatementsComponent } from './UI/HRMS/Reports/esi-statements/esi-statements.component';
import { PFStatementComponent } from './UI/HRMS/Reports/pf-statement/pf-statement.component';
import { EmployeeNewHrmsComponent } from './UI/HRMS/Transactions/employee-new-hrms/employee-new-hrms.component';
import { MaturityReportsComponent } from './UI/Banking/Reports/maturity-reports/maturity-reports.component';
import { EmployeeOnrollComponent } from './UI/HRMS/Transactions/employee-onroll/employee-onroll.component';
import { EmployeeAttendanceComponent } from './UI/HRMS/Transactions/employee-attendance/employee-attendance.component';
import { JvDetailsComponent } from './UI/HRMS/Transactions/jv-details/jv-details.component';
import { PayrollApprovalComponent } from './UI/HRMS/Transactions/payroll-approval/payroll-approval.component';
import { ProfitAndLossNewComponent } from './UI/Banking/Reports/profit-and-loss-new/profit-and-loss-new.component';
import { SalaryUpdateComponent } from './UI/HRMS/Transactions/salary-update/salary-update.component';
import { SalaryStatementReportComponent } from './UI/HRMS/Reports/salary-statement-report/salary-statement-report.component';
import { ProfessionalTaxComponent } from './UI/HRMS/Reports/professional-tax/professional-tax.component';
import { PayrollApprovalReportComponent } from './UI/HRMS/Reports/payroll-approval-report/payroll-approval-report.component';
import { PaySlipComponent } from './UI/HRMS/Reports/pay-slip/pay-slip.component';
import { PaySlipPreviewComponent } from './UI/HRMS/Reports/pay-slip-preview/pay-slip-preview.component';
import { LoyalityStatementComponent } from './UI/HRMS/Reports/loyality-statement/loyality-statement.component';
import { EmployeeSalaryUpdateComponent } from './UI/HRMS/Reports/employee-salary-update/employee-salary-update.component';
import { SalaryStatementReportNewComponent } from './UI/HRMS/Reports/salary-statement-report-new/salary-statement-report-new.component';
import { AgeingReportComponent } from './UI/accounting/reports/ageing-report/ageing-report.component';
import { EarnedLeavesComponent } from './UI/HRMS/Reports/earned-leaves/earned-leaves.component';
import { EmployeeMontlyBonusComponent } from './UI/HRMS/Reports/employee-montly-bonus/employee-montly-bonus.component';
import { BondPreviewDuplicateComponent } from './UI/Banking/Transactions/bond-preview-duplicate/bond-preview-duplicate.component';
import { MaturityPaymentRenewalNewComponent } from './UI/Banking/Transactions/maturity-payment-renewal-new/maturity-payment-renewal-new.component';
import { EmployeeNewViewComponent } from './UI/HRMS/Transactions/employee-new-view/employee-new-view.component';
import { RsdReportComponent } from './UI/accounting/reports/rsd-report/rsd-report.component';
import { MaturityDetailsReportComponent } from './UI/Banking/Reports/maturity-details-report/maturity-details-report.component';
import { AgreementForSaleComponent } from './UI/Banking/Transactions/agreement-for-sale/agreement-for-sale.component';
import { AdvanceAgreementLetterComponent } from './UI/Banking/Transactions/advance-agreement-letter/advance-agreement-letter.component';
import { GstVoucherComponent } from './UI/accounting/Transactions/gst-voucher/gst-voucher.component';
import { GstReportNewComponent } from './UI/accounting/reports/gst-report-new/gst-report-new.component';
import { SaleAgreementPreviewComponent } from './UI/Banking/Transactions/sale-agreement-preview/sale-agreement-preview.component';
import { InterestReportNew1Component } from './UI/Banking/Reports/interest-report-new1/interest-report-new1.component';
import { MaturityReportNew1Component } from './UI/Banking/Reports/maturity-report-new1/maturity-report-new1.component';
import { InterestReportNew2Component } from './UI/Banking/Reports/interest-report-new2/interest-report-new2.component';
import { AgentCommissionReportNewComponent } from './UI/Banking/Reports/agent-commission-report-new/agent-commission-report-new.component';
import { AgreementForSaleHotelSpaceComponent } from './UI/Banking/Transactions/agreement-for-sale-hotel-space/agreement-for-sale-hotel-space.component';
import { PreMaturityDetailedReportComponent } from './UI/Banking/Reports/pre-maturity-detailed-report/pre-maturity-detailed-report.component';
import { InterestReportDetailedComponent } from './UI/Banking/Reports/interest-report-detailed/interest-report-detailed.component';
import { DetailedAgentCommissionComponent } from './UI/Banking/Reports/detailed-agent-commission/detailed-agent-commission.component';
import { GstPaymentVoucherComponent } from './UI/accounting/Transactions/gst-payment-voucher/gst-payment-voucher.component';
import { HsnCodesComponent } from './UI/accounting/masters/hsn-codes/hsn-codes.component';
import { InterestPaymentLatestComponent } from './UI/Banking/Transactions/interest-payment-latest/interest-payment-latest.component';
import { AgreementForSaleDhakshinComponent } from './UI/Banking/Transactions/agreement-for-sale-dhakshin/agreement-for-sale-dhakshin.component';
import { AgreementForSaleKousalyaInfraComponent } from './UI/Banking/Transactions/agreement-for-sale-kousalya-infra/agreement-for-sale-kousalya-infra.component';
import { AuthorizedPersonsComponent } from './Services/Banking/Transactions/authorized-persons/authorized-persons.component';
import { ProjectionAchievedReportComponent } from './UI/Banking/Reports/projection-achieved-report/projection-achieved-report.component';
import { ProjectionsComponent } from './UI/Banking/Reports/projections/projections.component';
import { ProjectionsPreviewComponent } from './UI/Banking/Reports/projections-preview/projections-preview.component';
import { ProjectionAchievedPreviewComponent } from './UI/Banking/Reports/projection-achieved-preview/projection-achieved-preview.component';
import { CpannelnewComponent } from './UI/Banking/Reports/cpannelnew/cpannelnew.component';
import { ProjectionReprintComponent } from './UI/Banking/Reports/projection-reprint/projection-reprint.component';
import { ChallanaEntryHrmsComponent } from './UI/HRMS/Transactions/challana-entry-hrms/challana-entry-hrms.component';
import { ViewChallanaEntryHrmsComponent } from './UI/HRMS/Reports/view-challana-entry-hrms/view-challana-entry-hrms.component';
import { AchievedpreviewComponent } from './UI/Banking/Reports/achieved/achievedpreview/achievedpreview.component';
import { AchievedComponent } from './UI/Banking/Reports/achieved/achieved.component';
import { ProjectionVsAchievedComponent } from './UI/Banking/Reports/projection-vs-achieved/projection-vs-achieved.component';
import { Form15HComponent } from './UI/Tds/Masters/form15-h/form15-h.component';
import { Form15hreprintComponent } from './UI/Tds/Masters/form15hreprint/form15hreprint.component';
import { ComparisionTrialBalanceNewComponent } from './UI/Banking/Reports/comparision-trial-balance-new/comparision-trial-balance-new.component';
import { FdtransactionNew1Component } from './UI/Banking/Transactions/FD-AC-Creation/fdtransaction-new1/fdtransaction-new1.component';
import { FdtransactionView1Component } from './UI/Banking/Transactions/FD-AC-Creation/fdtransaction-view1/fdtransaction-view1.component';
import { PanValidationComponent } from './UI/Tds/Masters/pan-validation/pan-validation.component';
import { AccountLedgerMigrationComponent } from './UI/accounting/reports/account-ledger-migration/account-ledger-migration.component';
import { ContactNewGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/contact-new-global/contact-new-global.component';
import { ContactNewIndividualGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/contact-new-individual-global/contact-new-individual-global.component';
import { ContactNewBusinessGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/contact-new-business-global/contact-new-business-global.component';
import { ContactMoreNewComponent } from './UI/Loans/Masters/ContactNew-Global/contact-more-new/contact-more-new.component';
import { KycDocumentsNewGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/kyc-documents-new-global/kyc-documents-new-global.component';
import { SelectSubscriberGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/select-subscriber-global/select-subscriber-global.component';
import { BankDetailsNewGlobalComponent } from './UI/Loans/Masters/ContactNew-Global/bank-details-new-global/bank-details-new-global.component';
//import { InterestDelayComponent } from './UI/Transactions/interest-delay/interest-delay.component';
import { Form121Component } from './UI/Tds/Masters/form121/form121.component';
import { Form121ReprintComponent } from './UI/Tds/Masters/form121-reprint/form121-reprint.component';
//import { AchievedReportComponent } from './UI/Banking/Reports/achieved-report/achieved-report.component';
import { InterestDelayComponent } from './UI/Banking/Transactions/interest-delay/interest-delay.component';
import { InterestDelayReportComponent } from './UI/Banking/Transactions/interest-delay-report/interest-delay-report.component';
import { MaturityRenewalComponent } from './UI/Banking/Transactions/maturity-renewal/maturity-renewal.component';
import { MaturityRenewalViewComponent } from './UI/Banking/Transactions/maturity-renewal/maturity-renewal-view/maturity-renewal-view.component';
import { LeaveDeatailsComponent } from './UI/HRMS/Transactions/leave-deatails/leave-deatails.component';
import { BiometricAttendanceReportComponent } from './UI/HRMS/Reports/biometric-attendance-report/biometric-attendance-report.component';
import { BiometricAttendenceSummaryReportComponent } from './UI/HRMS/Reports/biometric-attendence-summary-report/biometric-attendence-summary-report.component';
import { FundTransferComponent } from './UI/accounting/Transactions/fund-transfer/fund-transfer.component';
import { PendingFundTransferComponent } from './UI/accounting/Transactions/pending-fund-transfer/pending-fund-transfer.component';



export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD/MM/YYYY'
  });
}

const appRoutes: Routes = [

  {path: '',component:BranchSelectionComponent},


  { path: 'Login', component: UserLoginComponent },


  {
    path: '', component: NavigationComponent,
    children: [
      { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'LoansMaster', component: LoansComponent },
      { path: 'ChargesMaster', component: ChargesMasterComponent, canActivate: [AuthGuard] },
      { path: 'ChargeconfigurationView', component: ChargeconfigurationViewComponent },
      { path: 'ChargeconfigurationMaster', component: ChargeconfigurationMasterComponent, canActivate: [AuthGuard] },
      { path: 'Documents', component: DocumentsComponent, canActivate: [AuthGuard] },
      { path: 'SchemeView', component: SchemeViewComponent, canActivate: [AuthGuard] },
      { path: 'SchemeMaster', component: SchemeMasterComponent },
      { path: 'PreclosureView', component: PreclosureViewComponent},
      { path: 'PreclosureMaster', component: PreclosureMasterComponent, canActivate: [AuthGuard] },
      { path: 'ContactForm', component: ContactComponent },
      { path: 'ContactMore', component: ContactMoreComponent },
       { path: 'ContactMoreNew', component: ContactMoreNewComponent },
      { path: 'ContactNew', component: ContactNewComponent },
       {path:'ContactNewGlobal',component:ContactNewGlobalComponent},
      { path: 'ContactNewViewDetailed', component: ContactNewDetailedNewComponent },
      { path: 'ContactViewNew', component: ContactNewViewComponent },
      { path: 'ContactView', component: ContactViewComponent },
      { path: 'ContactIndividual', component: ContactIndividualComponent },
      { path: 'ContactBusiness', component: ContactBusinessComponent },
      { path: 'LoansCreation', component: LoansCreationComponent, canActivate: [AuthGuard] },
      { path: 'FiView', component: FiViewComponent },
      { path: 'Fiindividual', component: FiMasterComponent, canActivate: [AuthGuard]},
      { path: 'Fiindividual/:id', component: FiMasterComponent },
      { path: 'AdvocateLawyerView', component: AdvocateLawyerViewComponent, canActivate: [AuthGuard] },
      { path: 'AdvocateLawyerMaster', component: AdvocateLawyerMasterComponent },
      { path: 'AdvocateLawyerMaster/:id', component: AdvocateLawyerMasterComponent },
      { path: 'ReferralAgentView', component: ReferralAgentViewComponent, canActivate: [AuthGuard] },
      { path: 'ReferralAgentMaster', component: ReferralAgentMasterComponent },
      { path: 'ReferralAgentMaster/:id', component: ReferralAgentMasterComponent },
      { path: 'PartyView', component: PartyViewComponent, canActivate: [AuthGuard] },
      { path: 'PartyMaster', component: PartyMasterComponent },
      { path: 'PartyMaster/:id', component: PartyMasterComponent },
      { path: 'GroupView', component: GroupViewComponent },
      { path: 'GroupCreation', component: GroupCreationComponent },
      { path: 'EmployeeView', component: EmployeeViewComponent, canActivate: [AuthGuard] },
      { path: 'EmployeeMaster', component: EmployeeMasterComponent },
      { path: 'EmployeeMaster/:id', component: EmployeeMasterComponent },
      { path: 'VerificationView', component: VerificationViewComponent, canActivate: [AuthGuard] },
      { path: 'Televerification', component: TeleVrificationComponent },
      { path: 'Documentverification', component: DocumentVerificationComponent },
      { path: 'Fieldverification', component: AddressVerificationComponent },
      { path: 'Televerification/:id', component: TeleVrificationComponent },
      { path: 'Documentverification/:id', component: DocumentVerificationComponent },
      { path: 'Fieldverification/:id', component: AddressVerificationComponent },
      { path: 'AprovalView', component: AprovalViewComponent, canActivate: [AuthGuard] },
      { path: 'DisbursementView', component: DisbursementViewComponent, canActivate: [AuthGuard] },
      { path: 'VerificationNew', component: VerificationNewComponent },
      { path: 'AprovalNew', component: AprovalNewComponent },
      { path: 'DisbursementNew', component: DisbursementNewComponent },
      { path: 'VerificationNew/:id', component: VerificationNewComponent },
      { path: 'AprovalNew/:id', component: AprovalNewComponent },
      { path: 'DisbursementNew/:id', component: DisbursementNewComponent },
      { path: 'DeliveryorderNew', component: DeliveryorderNewComponent },
      { path: 'AcknowledgementsNew', component: AcknowledgementsNewComponent },
      { path: 'SanctionLetter', component: SanctionLetterComponent },
      { path: 'DeliveryorderNew/:id', component: DeliveryorderNewComponent },
      { path: 'AcknowledgementsNew/:id', component: AcknowledgementsNewComponent },
      { path: 'SanctionLetter/:id', component: SanctionLetterComponent },
      { path: 'AccountsView', component: AccountsViewComponent, canActivate: [AuthGuard] },
      { path: 'BankView', component: BankViewComponent, canActivate: [AuthGuard] },
      { path: 'ChequemanagementView', component: ChequemanagementViewComponent, canActivate: [AuthGuard] },
      { path: 'AccountsMaster', component: AccountsMasterComponent },
      { path: 'BankMaster', component: BankMasterComponent },
      { path: 'ChequemanagementMaster', component: ChequemanagementMasterComponent },
      { path: 'GeneralreceiptView', component: GeneralreceiptViewComponent},
      { path: 'PaymentvoucherView', component: PaymentvoucherViewComponent },
      { path: 'TdsPaymentvoucherView', component: TdsPaymentVoucherViewComponent },
      { path: 'JournalvoucherView', component: JournalvoucherViewComponent, canActivate: [AuthGuard] },
      { path: 'GeneralreceiptNew', component: GeneralreceiptNewComponent },
      { path: 'PaymentvoucherNew', component: PaymentvoucherNewComponent, canActivate: [AuthGuard]  },
      { path: 'TDSPaymentvoucher', component: TDSPaymentvoucherComponent, canActivate: [AuthGuard]  },
      { path: 'JournalvoucherNew', component: JournalvoucherNewComponent },
      { path: 'GeneralreceiptNew/:id', component: GeneralreceiptNewComponent },
      { path: 'PaymentvoucherNew/:id', component: PaymentvoucherNewComponent },
      { path: 'JournalvoucherNew/:id', component: JournalvoucherNewComponent },
      { path: 'ChequesonHandNew', component: ChequesonhandNewComponent, canActivate: [AuthGuard] },
      { path: 'ChequesinBankNew', component: ChequesinbankNewComponent, canActivate: [AuthGuard] },
      { path: 'ChequesIssuedNew', component: ChequesissuedNewComponent, canActivate: [AuthGuard] },
      { path: 'DisburementLetter', component: DisburementLetterComponent },
      { path: 'DisburementLetter/:id', component: DisburementLetterComponent },
      { path: 'LoanreceiptView', component: LoanreceiptViewComponent },
      { path: 'LoanreceiptNew', component: LoanreceiptNewComponent, canActivate: [AuthGuard]  },
      { path: 'LoanreceiptNew/:id', component: LoanreceiptNewComponent },
      { path: 'AddMenu', component: AddMenuComponent, canActivate: [AuthGuard] },
      { path: 'AddMenu/:id', component: AddMenuComponent },
      { path: 'UserRights', component: UserRightsComponent, canActivate: [AuthGuard] },
      { path: 'UserRights/:id', component: UserRightsComponent },
      { path: 'UsersView', component: UsersviewComponent, canActivate: [AuthGuard] },
      { path: 'UsersRegistration', component: UsersregistrationComponent },
      { path: 'CashBook', component: CashBookComponent, canActivate: [AuthGuard] },
      { path: 'CashBook/:id', component: CashBookComponent },
      { path: 'BankBook', component: BankBookComponent, canActivate: [AuthGuard] },
      { path: 'BankBook/:id', component: BankBookComponent },
      { path: 'AccountLedger', component: AccountLedgerComponent, canActivate: [AuthGuard] },
      { path: 'AccountLedger/:id', component: AccountLedgerComponent },
      { path: 'AccountLedgerMigration', component: AccountLedgerMigrationComponent, canActivate: [AuthGuard] },
      { path: 'AccountLedgerMigration/:id', component: AccountLedgerMigrationComponent },
      { path: 'DayBook', component: DayBookComponent, canActivate: [AuthGuard] },
      { path: 'DayBook/:id', component: DayBookComponent },
      { path: 'TrialBalance', component: TrialBalanceComponent, canActivate: [AuthGuard] },
      { path: 'TrialBalance/:id', component: TrialBalanceComponent },
      { path: 'PartyLedger', component: PartyLedgerComponent, canActivate: [AuthGuard] },
      { path: 'PartyLedger/:id', component: PartyLedgerComponent },
      { path: 'CollectionsReport', component: CollectionsReportComponent, canActivate: [AuthGuard] },
      { path: 'CollectionsReport/:id', component: CollectionsReportComponent },
      { path: 'ContactList', component: ContactListComponent, canActivate: [AuthGuard] },
      { path: 'ContactList/:id', component: ContactListComponent },
      { path: 'ContactListDetailView', component: ContactListDetailViewComponent },
      { path: 'ContactListDetailView/:id', component: ContactListDetailViewComponent },
      // { path: 'BRStatment', component: BankReconStatmentComponent, canActivate: [AuthGuard] },
      { path: 'BRStatment', component: BankReconStatementNewComponent, canActivate: [AuthGuard] },
      { path: 'BRStatment/:id', component: BankReconStatmentComponent },
      { path: 'BRStatmentNew', component: BankReconStatementNewComponent, canActivate: [AuthGuard] },
      { path: 'BrsReports', component: BRSReportsComponent },

      { path: 'BalanceSheet', component: BalanceSheetComponent, canActivate: [AuthGuard] },
      { path: 'BalanceSheet/:id', component: BalanceSheetComponent },
      { path: 'ProfitAndLoss', component: ProfitAndLossComponent, canActivate: [AuthGuard] },
      { path: 'ProfitAndLoss/:id', component: ProfitAndLossComponent },
      { path: 'ComparisionTrialBalance', component: ComparisionTrialBalanceComponent, canActivate: [AuthGuard] },
      { path: 'ComparisionTrialBalance/:id', component: ComparisionTrialBalanceComponent },
      { path: 'AccountSummaryDetails', component: AccountSummaryDetailsComponent, canActivate: [AuthGuard] },
      { path: 'AccountSummaryDetails/:id', component: AccountSummaryDetailsComponent },
      { path: 'RePrint', component: RePrintComponent, canActivate: [AuthGuard] },
      { path: 'RePrint/:id', component: RePrintComponent },

      { path: 'DuplicateMaturity', component: RePrintNewComponent, canActivate: [AuthGuard] },
      { path: 'DuplicateMaturity/:id', component: RePrintNewComponent },
      { path: 'RSDReport', component: RsdReportComponent },

      { path: 'Duereports', component: DueReportsComponent, canActivate: [AuthGuard] },
      { path: 'Duereports/:id', component: DueReportsComponent },
      { path: 'DisbursmentReports', component: DisbursmentReportComponent, canActivate: [AuthGuard] },
      { path: 'DisbursmentReports/:id', component: DisbursmentReportComponent },
      { path: 'LoanStatement', component: LoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LoanStatement/:id', component: LoanStatementComponent },
      { path: 'EmiChartView', component: EmichartViewComponent },
      { path: 'GenerateidMaster', component: GenerateidMasterComponent },
      { path: 'ChequeEnquiry', component: ChequeEnquiryComponent },
      { path: 'ChequeCancel', component: ChequeCancelComponent },
      { path: 'ChequeReturn', component: ChequeReturnComponent },
      { path: 'IssuedCheque', component: IssuedChequeComponent },
      { path: 'JvList', component: JvListComponent },

      { path: 'LedgerExtract', component: LedgerExtractComponent },
      { path: 'CompanyConfig', component: CompanyConfigComponent },
      { path: 'BranchConfig', component: BranchConfigComponent },
      { path: 'Trendreports', component: TrendreportsComponent },
      // {path:'report',component:TrendDisbursementReportComponent},

      { path: 'MembertypeView', component: MembertypeViewComponent },
      { path: 'MembertypeNew', component: MembertypeNewComponent },
      // { path: 'Fiindividual/:id', component: FiMasterComponent },
      { path: 'MemberNew/:id', component: MemberNewComponent },
      { path: 'MemberNew', component: MemberNewComponent },
      { path: 'MemberView', component: MemberViewComponent },
      { path: 'SubaccountLedgerreports', component: SubaccountLedgerComponent },
      { path: 'SubledgerSummary', component: SubledgerSummaryComponent },
      { path: 'FdView', component: FdConfigViewComponent },
      { path: 'FdNew', component: FdconfigNewComponent },
      { path: 'FdNew/:id', component: FdconfigNewComponent },
      { path: 'RdView', component: RdconfigViewComponent },
      { path: 'RdNew', component: RdconfigNewComponent },
      { path: 'RdNew/:id', component: RdconfigNewComponent },
      { path: 'SavingsView', component: SavingsConfigViewComponent },
      { path: 'SavingsNew', component: SavingsConfigNewComponent },
      { path: 'SavingsNameCode', component: SavingsNameCodeComponent },
      { path: 'SharesConfigView', component: SharesConfigViewComponent },
      { path: 'SharesConfigNew', component: SharesConfigNewComponent },
      { path: 'ProfitandLossMTDYTD', component: ProfitandLossMTDYTDComponent },
      { path: 'LoanpreclosureView', component: LoanpreclosureViewComponent },
      { path: 'LoanpreclosureNew', component: LoanpreclosureNewComponent },
      { path: 'InsuranceMemberView', component: InsuranceMemberViewComponent },
      { path: 'InsuranceMemberNew', component: InsuranceMemberNewComponent },
      { path: 'InsuranceConfigView', component: InsuranceConfigViewComponent },
      { path: 'InsuranceConfigNew', component: InsuranceConfigNewComponent },
      { path: 'InsuranceConfigNew/:urlObject', component: InsuranceConfigNewComponent },


      { path: 'SavingsTransactionsView', component: SavingsTransactionsViewComponent },
      { path: 'SavingsTransactionsNew', component: SavingsTransactionsNewComponent },
      { path: 'ShareApplication', component: ShareAppViewComponent },
      { path: 'shareAppNewComponent', component: ShareApplicationComponent },
      { path: 'TdsReport', component: TdsReportComponent },
      { path: 'ChallanaChecking', component: ChallanaCheckingComponent },
      { path: 'ChallanaPayment', component: ChallanaPaymentComponent },
      { path: 'ApplicationForm', component: ApplicationFormComponent },
      { path: 'CIN-Entry', component: CINEntryComponent },
      { path: 'CIN-Entry-Report', component: CINEntryReportComponent },
      { path: 'FdTransactionView', component: FdTransactionViewComponent },
      { path: 'FdTransactionNew', component: FdTransactionNewComponent },
      { path: 'FdTransactionView1', component: FdtransactionView1Component },
      { path: 'FdTransactionNew1', component: FdtransactionNew1Component },
      { path: 'RdTransactionView', component: RdTransactionViewComponent },
      { path: 'RdTransactionNew', component: RdTransactionNewComponent },
      { path: 'LienEntryNew', component: LienEntryComponent },
      { path: 'LienEntryNews', component: LienEntryNewComponent },
      { path: 'LienEntryView', component: LienEntryViewComponent },
      { path: 'RdTransactionNew', component: RdTransactionNewComponent },
      { path: 'SelfOrAdjustmentView', component: SelfOrAdjustmentViewComponent },
      { path: 'SelfOrAdjustmentNew', component: SelfOrAdjustmentNewComponent },
      { path: 'LienReleaseNew', component: LienReleaseNewComponent },
      { path: 'LienReleaseView', component: LienReleaseViewComponent },
      { path: 'FdreceiptNew', component: FdreceiptNewComponent },
      { path: 'FdreceiptView', component: FdreceiptViewComponent },
      { path: 'RdreceiptView', component: RdreceiptViewComponent },
      { path: 'InterestpaymentView', component: InterestpaymentViewComponent },
      //{ path: 'InterestpaymentNew', component: InterestpaymentNewComponent },
      { path: 'InterestpaymentNew', component: InterestPaymentLatestComponent },
      { path: 'InterestpaymentReport', component: InterestPaymentReportComponent },
      //{ path: 'PromoteSalaryReport', component: PromoteSalaryReportComponent },
      { path: 'PromoteSalaryReport', component: AgentCommissionReportComponent },
      { path: 'MaturityIntimationReport', component: MaturityIntimationReportComponent },
      { path: 'MaturityReport', component: MaturityReportsComponent },
      { path: 'LienReleaseReport', component: LienReleaseReportComponent },
      { path: 'MemberEnquiry', component: MemberEnquiryComponent },
      { path: 'SelfAdjustmentReport', component: SelfAdjustmentReportComponent },
      { path: 'PreMaturityReport', component: PreMaturityReportComponent },
      { path: 'TrendReport', component: TrendReportComponent },
      { path: 'InterestPaymentTrendReport', component: InterestPaymentTrendReportComponent },
      { path: 'MemberWiseReceiptsReport', component: MemberWiseReceiptsReportComponent },
      { path: 'BranchWiseReceiptsReport', component: BranchWiseReceiptsReportComponent },
      { path: 'AccountTreeNew', component: AccountTreeComponent },

      { path: 'MaturitypaymentNew', component: MaturityPaymentnewComponent },
      { path: 'MaturityRenewalNew', component: MaturityRenewalComponent },
       { path: 'InterestDelay', component: InterestDelayComponent },
       { path: 'InterestDelayReport', component: InterestDelayReportComponent },

      { path: 'MaturitypaymentView', component: MaturityPaymentViewComponent },
      { path: 'MaturityrenewalView', component: MaturityRenewalViewComponent },
      { path: 'MaturitypaymentDuplicate', component: MaturityPaymentRenewalNewComponent },

      { path: 'MaturityBondNew', component: MaturityBondnewComponent },
      { path: 'MaturityBondView', component: MaturityBondViewComponent },
      { path: 'MaturityRenewal', component: MaturityPaymentRenewalComponent },
      { path: 'CommissionPaymentNew', component: CommissionPayementNewComponent },
      { path: 'CommissionPaymentView', component: CommissionPayementViewComponent },
      { path: 'TransferNew', component: TransferNewComponent },
      { path: 'BondPreviewNew', component: BondPreviewNewComponent },
      { path: 'Interestpaymentpreview', component: InterestPaymentReportComponent },
      { path: 'AgentPointsReport', component: AgentPointsReportComponent },
      { path: 'TargetReport', component: TargetReportComponent },
      { path: 'InterestReport', component: InterestReportNew1Component },
      // { path: 'InterestReport', component: InterestReportComponent },
      { path: 'InterestReportNew', component: InterestReportNewComponent },
      { path: 'CashFlow', component: CashFlowReportComponent },
      { path: 'ScheduleTrailBalance', component: ScheduleTrailBalanceReportComponent },
      { path: 'AgentWiseBusiness', component: AgentWiseBusinessComponent },

      { path: 'InterestPaymentPreview', component: InterestpaymentpreviewComponent },
      { path: 'InterestPaymentPreview/:id', component: InterestpaymentpreviewComponent },
      { path: 'Rdreceipt', component: RdreceiptNewComponent },
      { path: 'SAreceipt', component: SAReceiptComponent },
      { path: 'Memberreceipt', component: MemberReceiptComponent },
      { path: 'MemberReceiptView', component: MemberReceiptViewComponent },
      { path: 'SavingReceiptView', component: SavingReceiptViewComponent },
      { path: 'ShareReceipt', component: ShareReceiptComponent },
      { path: 'ShareReceiptView', component: ShareReceiptViewComponent },
      { path: 'SaWithdrawal', component: SaWithdrawalComponent },
      { path: 'ShareWithdrawal', component: ShareWithdrawalComponent },
      { path: 'SaWithdrawalview', component: SaWithdrawalViewComponent },
      { path: 'ShareWithdrawalview', component: ShareWithdrawalViewComponent },
      { path: 'PaymentReceiptDetails', component: PaymentReceiptDetailsComponent },

      { path: 'DepositWithdrawalDeposits', component: DepositWithdrawalDepositsComponent },
      { path: 'DepositWithdrawalWithdrawal', component: DepositWithdrawalWithdrawalComponent },
      { path: 'DueRDInstalments', component: DueRDInstalmentsComponent },
      { path: 'FDFieldDeposits', component: FDFieldDepositsComponent },
      { path: 'FDRecurringDeposits', component: FDRecurringDepositsComponent },
      { path: 'FDRenewals', component: FDRenewalsComponent },
      { path: 'FDShareCapitals', component: FDShareCapitalsComponent },
      { path: 'RDAdvancePaidList', component: RDAdvancePaidListComponent },
      // { path:'RDInstalments',component:RDInstalmentsComponent},
      { path: 'MemberDetailsReport', component: MemberDetailsReportComponent },
      { path: 'ShareIssueReport', component: ShareIssueReportComponent },
      { path: 'SavingAccountReportComponent', component: SavingAccountReportComponent },
      { path: 'ShareSavingWithdrawDetails', component: ShareSavingWithdrawDetailsComponent },
      { path: 'RdInstalmentsReport', component: RdInstalmentsReportComponent },
      { path: 'WelcomeLetter', component: WelcomeLetterComponent },
      { path: 'WelcomeLetter/:id', component: WelcomeLetterComponent },
      { path: 'Partpayment', component: PartpaymentComponent },
      { path: 'PartpaymentView', component: PartpaymentViewComponent },
      { path: 'Moratorium', component: MoratoriumComponent },
      { path: 'GSTReport', component: GSTReportComponent },
      { path: 'MoratoriumView', component: MoratoriumViewComponent },
      { path: 'MaturityDetailsPreview', component: MaturityPreviewComponent },
      { path: 'SubCategory', component: SubCategoryComponent },
      { path: 'ProfitAndLossNew', component: ProfitAndLossNewComponent },
      {path : 'AgeingReport',component:AgeingReportComponent},
      { path: 'BondPreviewDuplicate', component: BondPreviewDuplicateComponent },
      { path: 'MaturityDetails', component: MaturityDetailsReportComponent },
      //{ path: 'AgreementForSale', component: AgreementForSaleComponent },
      // { path: 'AdvanceAgreementLetter', component: AdvanceAgreementLetterComponent },
      { path: 'GSTVoucher', component: GstVoucherComponent },
      { path: 'GSTReportNew', component: GstReportNewComponent },
      { path: 'SaleAgreementPreview', component: SaleAgreementPreviewComponent },
      { path: 'InterestReportNew1', component: InterestReportNew1Component },
      { path: 'MaturityReportNew', component: MaturityReportNew1Component },
      { path: 'InterestReportNew2', component: InterestReportNew2Component },
      { path: 'AgentCommissionReportNew', component: AgentCommissionReportNewComponent },
      { path: 'PreMaturityDetailedReport', component: PreMaturityDetailedReportComponent },
      { path: 'DetailedInterestReport', component: InterestReportDetailedComponent },
      { path: 'DetailedAgentCommissionReport', component: DetailedAgentCommissionComponent },
      { path: 'AuthorizedPersons', component: AuthorizedPersonsComponent },
      { path: 'FundTransfer', component: FundTransferComponent },
      { path: 'PendingFundTransfer', component: PendingFundTransferComponent },



      // TDS NEW COMPONENTS

      { path: 'PanUpdate', component: PanUpdateComponent },
      //sathwika
      { path: 'Form15h', component: Form15HComponent },
      { path: 'PanValidation', component: PanValidationComponent },
      { path: 'Form121', component: Form121Component },
      //sathwika
      { path: 'SectionWise', component: SectionWiseReportComponent },
      { path: 'MenuSorting', component: MenuSortingComponent },
      { path: 'AgentCommissionReport', component: AgentCommissionReportComponent },

      //HRMS COMPONENTS

      {path : 'SscAgenda', component:SSCAgendaComponent},
      {path : 'EmployeeNew', component:EmployeeNewHrmsComponent},
      {path : 'EmployeeNewView',component:EmployeeNewViewComponent},
      {path : 'EmployeeOnroll', component:EmployeeOnrollComponent},
      {path : 'EmployeeAttendance', component:EmployeeAttendanceComponent},
      {path : 'LeaveDeatails', component:LeaveDeatailsComponent},
      {path :'BiometricAttendanceReport',component:BiometricAttendanceReportComponent},
      {path :'BiometricAttendenceSummaryReport',component:BiometricAttendenceSummaryReportComponent},
      {path : 'PayrollProcess', component:PayrollProcessComponent},
      {path : 'JvDetails', component:JvDetailsComponent},
      {path : 'PayrollApproval', component:PayrollApprovalComponent},
      {path : 'EmployeeSalaryUpdate', component:SalaryUpdateComponent},

      {path:'ESIStatement',component:ESIStatementsComponent},
      {path:'PFStatement',component:PFStatementComponent},
      {path:'ProfessionalTax',component:ProfessionalTaxComponent},
      //{path :'SalaryStatementReport',component:PayrollApprovalReportComponent},
      {path :'PaySlip',component:PaySlipComponent},
      {path :'LoyaltyStatement',component:LoyalityStatementComponent},
      {path :'EmployeeSalaryUpdateReport',component:EmployeeSalaryUpdateComponent},
      {path :'SalaryStatementReport',component:SalaryStatementReportNewComponent},
      {path :'EarnedLeaves',component:EarnedLeavesComponent},
      {path:'MonthlyBonus',component:EmployeeMontlyBonusComponent},

      {path:'HSNCODE',component:HsnCodesComponent},
      {path:'GstpaymentVocher',component:GstPaymentVoucherComponent},

 //new report--projections 15-09-2025

      // { path: 'projections', component: ProjectionReportComponent }
      { path: 'ProjectionsAchievedReport', component: ProjectionAchievedReportComponent },
      { path: 'Projections', component: ProjectionsComponent },
      //sathwika
      { path: 'Achieved', component: AchievedComponent },
      { path: 'ProjectionReprint', component: ProjectionReprintComponent },
      {path:'ProjectionVsAchieved',component:ProjectionVsAchievedComponent},
      //sathwika
      {path:'DashBoard',component:CpannelnewComponent},
      {path:'ChallanaEntryHRMS',component:ChallanaEntryHrmsComponent},
      {path:'ViewChallanaEntryHRMS',component:ViewChallanaEntryHrmsComponent},
      {path:'ProjectionVsAchieved',component:ProjectionVsAchievedComponent},
      {path:'ComparisionTB',component:ComparisionTrialBalanceNewComponent},








    ]
  },
  { path: 'PaymentVoucherReports', component: PaymentVoucherReportsComponent },
  { path: 'PaymentVoucherReports/:id', component: PaymentVoucherReportsComponent },
  { path: 'TdsPaymentVoucherReports', component: TdsPaymentVoucherReportsComponent },
  { path: 'TdsPaymentVoucherReports/:id', component: TdsPaymentVoucherReportsComponent },
  { path: 'PaymentVoucherReportsDuplicate', component: PaymentVoucherReportDuplicateComponent },
  { path: 'PaymentVoucherReportsDuplicate/:id', component: PaymentVoucherReportDuplicateComponent },
  { path: 'GeneralReceiptReports', component: GeneralReceiptReportsComponent },
  { path: 'GeneralReceiptReports/:id', component: GeneralReceiptReportsComponent },
  { path: 'GeneralReceiptReportsDuplicate', component: GeneralReceiptReportDuplicateComponent },
  { path: 'GeneralReceiptReportsDuplicate/:id', component: GeneralReceiptReportDuplicateComponent },
  { path: 'PreMaturityDetailsPreview', component: PreMaturityPreviewComponent },
  { path: 'PreMaturityDetailsPreview/:id', component: PreMaturityPreviewComponent },

  { path: 'MaturityPaymentPreview', component: MaturityPaymentPreviewComponent },
  { path: 'MaturityPaymentPreview/:id', component: MaturityPaymentPreviewComponent },


  { path: 'JournalvoucherReport', component: JournalVoucherReportComponent },
  { path: 'JournalvoucherReport/:id', component: JournalVoucherReportComponent },
  { path: 'JournalvoucherReportDuplicate', component: JournalVoucherReportDuplicateComponent },
  { path: 'JournalvoucherReportDuplicate/:id', component: JournalVoucherReportDuplicateComponent },
  { path: 'EmiChartReport', component: EmichartReportComponent },
  { path: 'EmiChartReport/:id', component: EmichartReportComponent },
  { path: 'ApplicationFormReport', component: ApplicationFormReportComponent },
  { path: 'ApplicationFormReport/:id', component: ApplicationFormReportComponent },
  { path: 'BondPreview', component: BondPreviewComponent },
  { path: 'BondPreview/:id', component: BondPreviewComponent },
  { path: 'Challanapaymentreport', component: ChallanaPaymentReportComponent },
  { path: 'Challanapaymentreport/:id', component: ChallanaPaymentReportComponent },
  { path: 'Maturitytrenddetails', component: MaturityTrendDetailsComponent },
  { path: 'Maturitytrenddetails/:id', component: MaturityTrendDetailsComponent },
  { path: 'Interestpaymentrenddetails', component: InterestpaymentTrenddetailsReportComponent },
  { path: 'Interestpaymentrenddetails/:id', component: InterestpaymentTrenddetailsReportComponent },
  { path: 'LienEntryPreview', component: LienEntryPreviewComponent },
  { path: 'LienEntryPreview/:id', component: LienEntryPreviewComponent },
  { path: 'LienEntryPreviewNew', component: LienEntryPreviewNewComponent },
  { path: 'LienEntryPreviewNew/:id', component: LienEntryPreviewNewComponent },
  { path: 'BRSPreview', component: BrsPreviewComponent },
  { path: 'BRSPreview/:id', component: BrsPreviewComponent },
 //bhargavi
   { path: 'projectionAchievedPreview', component: ProjectionAchievedPreviewComponent },
  { path: 'projectionAchievedPreview/:id', component: ProjectionAchievedPreviewComponent },
     { path: 'projectionsPreview', component: ProjectionsPreviewComponent },
  { path: 'projectionsPreview/:id', component: ProjectionsPreviewComponent },
  //bhrgavi
  { path: 'AgreementForSale', component: AgreementForSaleComponent },
  { path: 'AgreementForSale/:id', component: AgreementForSaleComponent },

  { path: 'AgreementForSaleDhakshin', component: AgreementForSaleDhakshinComponent },
  { path: 'AgreementForSaleDhakshin/:id', component: AgreementForSaleDhakshinComponent },

  { path: 'AgreementForSaleKousalyaInfra', component: AgreementForSaleKousalyaInfraComponent },
  { path: 'AgreementForSaleKousalyaInfra/:id', component: AgreementForSaleKousalyaInfraComponent },

  { path: 'AgreementForSaleHotelSpace', component: AgreementForSaleHotelSpaceComponent },
  { path: 'AgreementForSaleHotelSpace/:id', component: AgreementForSaleHotelSpaceComponent },

  { path: 'AdvanceAgreementLetter', component: AdvanceAgreementLetterComponent },
  { path: 'AdvanceAgreementLetter/:id', component: AdvanceAgreementLetterComponent },

    //sathwika
   { path: 'form15ReprintPreview', component: Form15hreprintComponent },
  { path: 'form15ReprintPreview/:id', component: Form15hreprintComponent },
  { path: 'Form121Reprint', component: Form121ReprintComponent },
  { path: 'Form121Reprint/:id', component: Form121ReprintComponent },

  //sathwika

  // {path :'SalaryStatementReport',component:SalaryStatementReportComponent},
  // {path :'SalaryStatementReport/:id',component:SalaryStatementReportComponent},

  {path :'PayRollApproval',component:SalaryStatementReportComponent},
  {path :'PayRollApproval/:id',component:SalaryStatementReportComponent},

  {path :'PaySlipData',component:PaySlipPreviewComponent},
  {path :'PaySlipData/:id',component:PaySlipPreviewComponent},


  { path: 'MaturityIntimationPreview', component: MaturityIntimationPreviewComponent },
  { path: 'MaturityIntimationPreview', component: MaturityIntimationPreviewComponent },
  { path: 'MemberEnquirydetails', component: MemberEnquiryDetailsComponent },
  { path: 'MemberEnquirydetails/:id', component: MemberEnquiryDetailsComponent },
  { path: 'MaturityIntimationPreview/:id', component: MaturityIntimationPreviewComponent },
  { path: 'RdInstallmentsChart', component: RdInstallmentsChartComponent },

  { path: 'RdInstallmentsChart/:id', component: RdInstallmentsChartComponent },
  { path: 'fdLoanFacility', component: FdloanandfacilityComponent },
  { path: 'DefaultReminderLetter', component: DefaultReminderLetterComponent },
  { path: 'LoanClosureCertificateLetter', component: LoanClosureCertificateComponent },
  { path: 'LoanClosingCoveringLetter', component: LoanClosingCoveringLetterComponent },
  { path: 'ForeclosurePrepaymentRequestLetter', component: ForeclosurePrepaymentRequestLetterComponent },
  { path: 'PartDisbursementAdviceLetter', component: PartDisbursementAdviceComponent },
  { path: 'FinalDisbursementAdviceLetter', component: FinalDisbursementAdviceComponent },
  { path: 'ChequeSubmissionLetter', component: ChequeSubmissionComponent },
  { path: 'SanctionLetter', component: SanctionLetterComponent },
  { path: 'LoanAgreementLetter', component: LoanAgreementComponent },
  { path: 'DisbursementRequestLetter', component: DisbursementRequestFormComponent },
  { path: 'DemandPromsoryNoteLette', component: DemandPromsoryNoteComponent },
  { path: 'SanctionLetterNew', component: SanctionLetterNewComponent },

  { path: 'DemandPromsoryNoteLetter', component: DemandPromsoryNoteComponent },
 { path: 'Achievedpreview', component: AchievedpreviewComponent },



];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    ContactComponent,
    LoansCreationComponent,
    ChargesMasterComponent,
    DocumentsComponent,
    ContactIndividualComponent,
    ContactBusinessComponent,
    LoansComponent,
    LoansnamecodeComponent,
    LoansinstallmentduedateComponent,
    LoansconfigurationComponent,
    LoanspenalinterestComponent,
    LoansidentificationdocumentsComponent,
    LoansreferralcommissionComponent,
    ContactViewComponent,
    PhotouploadComponent,
    NumbersonlyDirective, NumbersWithZeroDirective,
    UserLoginComponent,
    AddressformatDirective,
    CharactersonlyDirective,
    UppercaseDirective,
    EmailpatternDirective,
    EmailFormatDirective,
    EnterpriseNameFormatDirective,
    ThreeDigitDecimaNumberDirective,
    TwoDigitDecimaNumberDirective,
    ThreeDigitNumberDirective,
    NumberRangeDirective,
    MycurrencyFormatterDirective,
    UppercaseDirective,
    NewlineDirective,
    TitlecasewordDirective,
    SchemeMasterComponent,
    AddMenuComponent,
    UserRightsComponent,
    ChargeconfigurationViewComponent,
    ChargeconfigurationMasterComponent,
    PreclosureMasterComponent,
    PreclosureViewComponent,
    SchemeViewComponent,
    InitCapDirective,
    FiViewComponent,
    FiMasterComponent,
    FiContacttypeComponent,
    FiLoandetailsComponent,
    FiApplicantsandothersComponent,
    FiKycandidentificationComponent,
    FiPersonaldetailsComponent,
    FiSecurityandcollateralComponent,
    FiExistingloansComponent,
    FiReferencesComponent,
    FiReferralComponent,
    BusinessloanComponent,
    ConsumerloanComponent,
    EducationloanComponent,
    GoldloanComponent,
    HomeloanComponent,
    LoanagainstdepositsloanComponent,
    LoanagainstpropertyloanComponent,
    PersonalLoanComponent,
    VehicleLoanComponent,
    ReferralAgentViewComponent,
    ReferralAgentMasterComponent,
    AdvocateLawyerMasterComponent,
    AdvocateLawyerViewComponent,
    EmployeeViewComponent,
    EmployeeMasterComponent,

    MycurrencypipePipe,
    IfsccodevalidatorDirective,
    FiLoanspecficComponent,
    AutoFocusDirective,
    TrialBalanceComponent,

    // ReferralAgentContactComponent,

    // ReferralAgentKycdocumentsComponent,

    // ReferralAgentBankdetailsComponent,

    // ReferralAgentTdsdetailsComponent,

    // AdvocateLawyerTdsdetailsComponent,

    // AdvocateLawyerBankdetailsComponent,

    // AdvocateLawyerKycdocumentsComponent,

    // AdvocateSelectComponent,

    KYCDocumentsComponent,

    BankdetailsComponent,

    TDSDetailsComponent,


    RoundecimalDirective,

    PartyViewComponent,

    PartyMasterComponent,

    // PartyBankdetailsComponent,

    // PartyKycdocumentsComponent,

    // PartySelectComponent,

    // PartyTdsdetailsComponent,

    GroupViewComponent,

    GroupCreationComponent,

    ContactSelectComponent,



    FiPersonaldetailsEmploymentComponent,

    FiPersonaldetailsBusinessComponent,

    FiPersonaldetailsFinancialperformanceComponent,



    FiPersonaldetailsFamilyComponent,

    FiPersonaldetailsNomineeComponent,



    FiPersonaldetailsIncomeComponent,

    FiPersonaldetailsOtherincomeComponent,

    FiPersonaldetailsEducationComponent,

    PersonalDetailsComponent,

    FamilyDetailsComponent,

    EmployeeDetailsComponent,

    ValidationMessageComponent,

    AddressComponent,

    ButtonDoubleClickDirective,

    AlphaNumericDirective,
    AlphanumericcharsonlyDirective,
    appAlphanumericwithSpecialCharactersDirective,

    TimeMaskDirective,
    PropertyDetailsComponent,
    MovablePropertyDetailsComponent,
    VerificationNewComponent,
    VerificationViewComponent,
    AprovalViewComponent,
    AprovalNewComponent,
    DisbursementNewComponent,
    DisbursementViewComponent,
    DeliveryorderNewComponent,
    AcknowledgementsNewComponent,
    TeleVrificationComponent,
    AddressVerificationComponent,
    DocumentVerificationComponent,
    ChequemanagementViewComponent, ChequemanagementMasterComponent, AccountsMasterComponent, AccountsViewComponent, BankViewComponent, BankMasterComponent, GeneralreceiptViewComponent, GeneralreceiptNewComponent, PaymentvoucherViewComponent, PaymentvoucherNewComponent, JournalvoucherNewComponent, JournalvoucherViewComponent, ChequesonhandNewComponent, ChequesissuedNewComponent, ChequesinbankNewComponent, SanctionLetterComponent, DisburementLetterComponent, LoanreceiptViewComponent, LoanreceiptNewComponent,
    GeneralReceiptReportsComponent, PaymentVoucherReportsComponent, NumberToWordsPipe, AddMenuComponent, UserRightsComponent, UsersviewComponent, UsersregistrationComponent, CashBookComponent, BankBookComponent,
    LoginComponent,



    UserLoginComponent,



    AccountLedgerComponent, DayBookComponent, PartyLedgerComponent, CollectionsReportComponent, ContactListComponent, ContactListDetailViewComponent, BankReconStatmentComponent, BalanceSheetComponent, ProfitAndLossComponent, ComparisionTrialBalanceComponent, AccountSummaryDetailsComponent, RePrintComponent, JournalVoucherReportComponent, CompanyDetailsComponent, TrialbalanceLedgersummeryComponent, TrialbalanceAccountledgerComponent, EmichartReportComponent, DueReportsComponent, DisbursmentReportComponent, RemoveZeroDirective, ZeroDirective, LoanStatementComponent, EmichartViewComponent, DuereportsEmiComponent, GenerateidMasterComponent, ChequeEnquiryComponent, JvListComponent, LedgerExtractComponent, ChequeCancelComponent, ChequeReturnComponent, CompanyConfigComponent, BranchConfigComponent, CompanyconfigDocumentsComponent, CompanyconfigPromotorsComponent,

    TrendreportsComponent, TrendDisbursementReportComponent, TrendCollectionReportComponent, MembertypeViewComponent, MembertypeNewComponent, MemberNewComponent, MemberViewComponent, IssuedChequeComponent, SubaccountLedgerComponent, CompanydocumentsComponent
    , TrendDisbursementReportComponent, TrendCollectionReportComponent, MembertypeViewComponent, MembertypeNewComponent, MemberNewComponent, MemberViewComponent, IssuedChequeComponent, SubaccountLedgerComponent, CollectionReportsDetailSectionComponent,



    FdconfigNewComponent, FdConfigViewComponent, RdconfigNewComponent, RdconfigViewComponent, CompanynameCompanycodeComponent, SavingsConfigViewComponent, SavingsConfigNewComponent, SharesConfigViewComponent, SharesConfigNewComponent, SubledgerSummaryComponent, ShareCapitalComponent, ShareReferralCommissionComponent, SavingsNameCodeComponent, SavingsConfigurationComponent, LoanFacilityComponent, ReferralCommissionComponent, IdentificationDocumentsComponent, DecimalwithcurrencyformatDirective, ProfitandLossMTDYTDComponent, LoanpreclosureViewComponent, LoanpreclosureNewComponent, RdnameandcodeComponent, RdconfigurationComponent, RdloanandfacilityComponent, RdidentificationComponent, RdrefferalcommisionComponent, CurrencypipewithdecimalPipe, InsuranceMemberViewComponent, InsuranceMemberNewComponent, InsuranceConfigViewComponent, InsuranceConfigNewComponent, FdnameandcodeComponent, FdconfigurationComponent, FdloanandfacilityComponent, FdidentificationComponent, FdrefferalcommisionComponent, SavingsTransactionsViewComponent, SavingsTransactionsNewComponent, ShareApplicationComponent, LoanStatementReportComponent, ContactListPartyComponent, FdTransactionViewComponent, FdTransactionNewComponent, RdTransactionNewComponent, RdTransactionViewComponent
    , ShareAppViewComponent, JointmemberNomineeComponent, ReferralComponent,
    LienEntryComponent, LienEntryViewComponent, PromoteSalaryReportComponent,
    FdReferralComponent, FdJointmemberComponent, RdRecurringdepositComponent, RdJointmemberComponent, RdReferralComponent, NegativevaluePipe, SelfOrAdjustmentViewComponent, SelfOrAdjustmentNewComponent, LienReleaseNewComponent, LienReleaseViewComponent, NomineedetailsComponent, FdreceiptViewComponent, RdreceiptViewComponent, FdreceiptNewComponent, InterestpaymentViewComponent, InterestpaymentNewComponent, MaturityPaymentnewComponent, CommissionPayementNewComponent, CommissionPayementViewComponent, MaturityBondnewComponent, MaturityPaymentRenewalComponent, TransferNewComponent, BondPreviewNewComponent, BondPreviewComponent, MaturityBondViewComponent, InterestPaymentReportComponent, InterestpaymentpreviewComponent, MaturityPaymentViewComponent, PromoteSalaryReportComponent, MaturityIntimationReportComponent, LienReleaseReportComponent, SelfAdjustmentReportComponent, PreMaturityReportComponent, FdTranscationDetailsComponent, MemberEnquiryComponent, MemberenquiryreceiptsComponent, TrendReportComponent, InterestPaymentTrendReportComponent, MemberWiseReceiptsReportComponent, LienEntryPreviewComponent, MaturityIntimationPreviewComponent, AgentPointsReportComponent, TargetReportComponent, CashFlowReportComponent, ContactNewComponent, ContactNewIndividualComponent, ContactNewBusinessComponent, ContactNewPhotouploadComponent, SelectsubscriberComponent, BankdetailsnewComponent, KycdocumentsnewComponent, AccountTreeComponent, ContactNewViewComponent, ContactNewDetailedNewComponent, ContactMoreComponent, EmployeeDetailsNewComponent, InterestReportComponent, TdsReportComponent, ChallanaCheckingComponent, ChallanaPaymentComponent, CINEntryComponent, CINEntryReportComponent, ChallanaPaymentReportComponent, MaturityTrendDetailsComponent,
    MemberEnquiryDetailsComponent,
    InterestpaymentTrenddetailsReportComponent,
    ApplicationFormComponent,
    ApplicationFormReportComponent,
    RdreceiptNewComponent,
    SAReceiptComponent,
    MemberReceiptComponent, MemberReceiptViewComponent, RdNomineedetailsComponent, SpJointmemberComponent, SpReferralComponent, CoReferralComponent, CoJointmemberComponent, CoNomineedetailsComponent, SavingReceiptViewComponent, ShareReceiptComponent, ShareReceiptViewComponent, RdInstallmentsChartComponent, MemberSelectComponent, SaWithdrawalComponent, ShareWithdrawalComponent, SaWithdrawalViewComponent, ShareWithdrawalViewComponent, CharacterwithspecialDirective, PaymentReceiptDetailsComponent, DepositWithdrawalDepositsComponent, DepositWithdrawalWithdrawalComponent, DueRDInstalmentsComponent, FDFieldDepositsComponent, FDRecurringDepositsComponent, FDRenewalsComponent, FDShareCapitalsComponent, RDAdvancePaidListComponent, MemberenquiryreceiptsRDComponent, MemberenquiryreceiptsSAComponent, MemberenquiryreceiptsShareComponent, MemberDetailsReportComponent, SavingAccountReportComponent, ShareIssueReportComponent, ShareSavingWithdrawDetailsComponent, RdInstalmentsReportComponent, WelcomeLetterComponent, DefaultReminderLetterComponent, LoanClosingCoveringLetterComponent, ForeclosurePrepaymentRequestLetterComponent, LoanClosureCertificateComponent, PartDisbursementAdviceComponent, FinalDisbursementAdviceComponent, ChequeSubmissionComponent, LoanAgreementComponent, DisbursementRequestFormComponent, DemandPromsoryNoteComponent, SanctionLetterNewComponent, FixedDepositReceiptComponent, PartpaymentComponent, PartpaymentViewComponent, MoratoriumComponent, GSTReportComponent, MoratoriumViewComponent, BranchSelectionComponent, MaturityPreviewComponent, PreMaturityPreviewComponent, MaturityPaymentPreviewComponent, BranchWiseReceiptsReportComponent, ScheduleTrailBalanceReportComponent, CoReferral1Component, JournalVoucherReportDuplicateComponent, GeneralReceiptReportDuplicateComponent, PaymentVoucherReportDuplicateComponent, PanUpdateComponent, TdsAccountsSetupComponent, SectionWiseReportComponent, SubCategoryComponent, AgentWiseBusinessComponent, InterestReportNewComponent, MenuSortingComponent, BankReconStatementNewComponent, BrsPreviewComponent, LienEntryNewComponent, LienEntryPreviewNewComponent, AgentCommissionReportComponent, CoJointmember1Component, BRSReportsComponent, TDSPaymentvoucherComponent, TdsPaymentVoucherViewComponent, TdsPaymentVoucherReportsComponent, RePrintNewComponent, SSCAgendaComponent, PayrollProcessComponent, ESIStatementsComponent, PFStatementComponent, EmployeeNewHrmsComponent, MaturityReportsComponent, EmployeeOnrollComponent, EmployeeAttendanceComponent, JvDetailsComponent, PayrollApprovalComponent, ProfitAndLossNewComponent, SalaryUpdateComponent, SalaryStatementReportComponent, ProfessionalTaxComponent, PayrollApprovalReportComponent, PaySlipComponent, PaySlipPreviewComponent, LoyalityStatementComponent, EmployeeSalaryUpdateComponent, SalaryStatementReportNewComponent, AgeingReportComponent, EarnedLeavesComponent, EmployeeMontlyBonusComponent, BondPreviewDuplicateComponent, MaturityPaymentRenewalNewComponent,
    MemberReceiptComponent, MemberReceiptViewComponent, RdNomineedetailsComponent, SpJointmemberComponent, SpReferralComponent, CoReferralComponent, CoJointmemberComponent, CoNomineedetailsComponent, SavingReceiptViewComponent, ShareReceiptComponent, ShareReceiptViewComponent, RdInstallmentsChartComponent, MemberSelectComponent, SaWithdrawalComponent, ShareWithdrawalComponent, SaWithdrawalViewComponent, ShareWithdrawalViewComponent, CharacterwithspecialDirective, PaymentReceiptDetailsComponent, DepositWithdrawalDepositsComponent, DepositWithdrawalWithdrawalComponent, DueRDInstalmentsComponent, FDFieldDepositsComponent, FDRecurringDepositsComponent, FDRenewalsComponent, FDShareCapitalsComponent, RDAdvancePaidListComponent, MemberenquiryreceiptsRDComponent, MemberenquiryreceiptsSAComponent, MemberenquiryreceiptsShareComponent, MemberDetailsReportComponent, SavingAccountReportComponent, ShareIssueReportComponent, ShareSavingWithdrawDetailsComponent, RdInstalmentsReportComponent, WelcomeLetterComponent, DefaultReminderLetterComponent, LoanClosingCoveringLetterComponent, ForeclosurePrepaymentRequestLetterComponent, LoanClosureCertificateComponent, PartDisbursementAdviceComponent, FinalDisbursementAdviceComponent, ChequeSubmissionComponent, LoanAgreementComponent, DisbursementRequestFormComponent, DemandPromsoryNoteComponent, SanctionLetterNewComponent, FixedDepositReceiptComponent, PartpaymentComponent, PartpaymentViewComponent, MoratoriumComponent, GSTReportComponent, MoratoriumViewComponent, BranchSelectionComponent, MaturityPreviewComponent, PreMaturityPreviewComponent, MaturityPaymentPreviewComponent, BranchWiseReceiptsReportComponent, ScheduleTrailBalanceReportComponent, CoReferral1Component, JournalVoucherReportDuplicateComponent, GeneralReceiptReportDuplicateComponent, PaymentVoucherReportDuplicateComponent, PanUpdateComponent, TdsAccountsSetupComponent, SectionWiseReportComponent, SubCategoryComponent, AgentWiseBusinessComponent, InterestReportNewComponent, MenuSortingComponent, BankReconStatementNewComponent, BrsPreviewComponent, LienEntryNewComponent, LienEntryPreviewNewComponent, AgentCommissionReportComponent, CoJointmember1Component, BRSReportsComponent, TDSPaymentvoucherComponent, TdsPaymentVoucherViewComponent, TdsPaymentVoucherReportsComponent, RePrintNewComponent, SSCAgendaComponent, PayrollProcessComponent, ESIStatementsComponent, PFStatementComponent, EmployeeNewHrmsComponent, MaturityReportsComponent, EmployeeOnrollComponent, EmployeeAttendanceComponent, JvDetailsComponent, PayrollApprovalComponent, ProfitAndLossNewComponent, SalaryUpdateComponent, SalaryStatementReportComponent, ProfessionalTaxComponent, PayrollApprovalReportComponent, PaySlipComponent, PaySlipPreviewComponent, LoyalityStatementComponent, EmployeeSalaryUpdateComponent, SalaryStatementReportNewComponent, AgeingReportComponent, EarnedLeavesComponent, EmployeeMontlyBonusComponent, BondPreviewDuplicateComponent, EmployeeNewViewComponent, RsdReportComponent, MaturityDetailsReportComponent, AgreementForSaleComponent, AdvanceAgreementLetterComponent, GstVoucherComponent, GstReportNewComponent, SaleAgreementPreviewComponent, InterestReportNew1Component, MaturityReportNew1Component, InterestReportNew2Component, AgentCommissionReportNewComponent, AgreementForSaleHotelSpaceComponent, PreMaturityDetailedReportComponent, InterestReportDetailedComponent, DetailedAgentCommissionComponent, GstPaymentVoucherComponent, HsnCodesComponent, InterestPaymentLatestComponent, AgreementForSaleDhakshinComponent, AgreementForSaleKousalyaInfraComponent, AuthorizedPersonsComponent, ProjectionAchievedReportComponent, ProjectionsComponent, ProjectionsPreviewComponent, ProjectionAchievedPreviewComponent, CpannelnewComponent, ProjectionReprintComponent, ChallanaEntryHrmsComponent, ViewChallanaEntryHrmsComponent,
    MemberReceiptComponent, MemberReceiptViewComponent, RdNomineedetailsComponent, SpJointmemberComponent, SpReferralComponent, CoReferralComponent, CoJointmemberComponent, CoNomineedetailsComponent, SavingReceiptViewComponent, ShareReceiptComponent, ShareReceiptViewComponent, RdInstallmentsChartComponent, MemberSelectComponent, SaWithdrawalComponent, ShareWithdrawalComponent, SaWithdrawalViewComponent, ShareWithdrawalViewComponent, CharacterwithspecialDirective, PaymentReceiptDetailsComponent, DepositWithdrawalDepositsComponent, DepositWithdrawalWithdrawalComponent, DueRDInstalmentsComponent, FDFieldDepositsComponent, FDRecurringDepositsComponent, FDRenewalsComponent, FDShareCapitalsComponent, RDAdvancePaidListComponent, MemberenquiryreceiptsRDComponent, MemberenquiryreceiptsSAComponent, MemberenquiryreceiptsShareComponent, MemberDetailsReportComponent, SavingAccountReportComponent, ShareIssueReportComponent, ShareSavingWithdrawDetailsComponent, RdInstalmentsReportComponent, WelcomeLetterComponent, DefaultReminderLetterComponent, LoanClosingCoveringLetterComponent, ForeclosurePrepaymentRequestLetterComponent, LoanClosureCertificateComponent, PartDisbursementAdviceComponent, FinalDisbursementAdviceComponent, ChequeSubmissionComponent, LoanAgreementComponent, DisbursementRequestFormComponent, DemandPromsoryNoteComponent, SanctionLetterNewComponent, FixedDepositReceiptComponent, PartpaymentComponent, PartpaymentViewComponent, MoratoriumComponent, GSTReportComponent, MoratoriumViewComponent, BranchSelectionComponent, MaturityPreviewComponent, PreMaturityPreviewComponent, MaturityPaymentPreviewComponent, BranchWiseReceiptsReportComponent, ScheduleTrailBalanceReportComponent, CoReferral1Component, JournalVoucherReportDuplicateComponent, GeneralReceiptReportDuplicateComponent, PaymentVoucherReportDuplicateComponent, PanUpdateComponent, TdsAccountsSetupComponent, SectionWiseReportComponent, SubCategoryComponent, AgentWiseBusinessComponent, InterestReportNewComponent, MenuSortingComponent, BankReconStatementNewComponent, BrsPreviewComponent, LienEntryNewComponent, LienEntryPreviewNewComponent, AgentCommissionReportComponent, CoJointmember1Component, BRSReportsComponent, TDSPaymentvoucherComponent, TdsPaymentVoucherViewComponent, TdsPaymentVoucherReportsComponent, RePrintNewComponent, SSCAgendaComponent, PayrollProcessComponent, ESIStatementsComponent, PFStatementComponent, EmployeeNewHrmsComponent, MaturityReportsComponent, EmployeeOnrollComponent, EmployeeAttendanceComponent, JvDetailsComponent, PayrollApprovalComponent, ProfitAndLossNewComponent, SalaryUpdateComponent, SalaryStatementReportComponent, ProfessionalTaxComponent, PayrollApprovalReportComponent, PaySlipComponent, PaySlipPreviewComponent, LoyalityStatementComponent, EmployeeSalaryUpdateComponent, SalaryStatementReportNewComponent, AgeingReportComponent, EarnedLeavesComponent, EmployeeMontlyBonusComponent, BondPreviewDuplicateComponent, EmployeeNewViewComponent, RsdReportComponent, MaturityDetailsReportComponent, AgreementForSaleComponent, AdvanceAgreementLetterComponent, GstVoucherComponent, GstReportNewComponent, SaleAgreementPreviewComponent, InterestReportNew1Component, MaturityReportNew1Component, InterestReportNew2Component, AgentCommissionReportNewComponent, AgreementForSaleHotelSpaceComponent, PreMaturityDetailedReportComponent, InterestReportDetailedComponent, DetailedAgentCommissionComponent, GstPaymentVoucherComponent, HsnCodesComponent, InterestPaymentLatestComponent, AgreementForSaleDhakshinComponent, AgreementForSaleKousalyaInfraComponent, AuthorizedPersonsComponent, ProjectionAchievedReportComponent, ProjectionsComponent, ProjectionsPreviewComponent, ProjectionAchievedPreviewComponent, CpannelnewComponent, ProjectionReprintComponent, AchievedComponent, AchievedpreviewComponent, ProjectionVsAchievedComponent, Form15HComponent, Form15hreprintComponent, ComparisionTrialBalanceNewComponent, FdtransactionNew1Component, FdtransactionView1Component, PanValidationComponent, AccountLedgerMigrationComponent, ContactNewGlobalComponent, ContactNewIndividualGlobalComponent, ContactNewBusinessGlobalComponent, ContactMoreNewComponent, KycDocumentsNewGlobalComponent, SelectSubscriberGlobalComponent, BankDetailsNewGlobalComponent, InterestDelayComponent,
    MemberReceiptComponent, MemberReceiptViewComponent, RdNomineedetailsComponent, SpJointmemberComponent, SpReferralComponent, CoReferralComponent, CoJointmemberComponent, CoNomineedetailsComponent, SavingReceiptViewComponent, ShareReceiptComponent, ShareReceiptViewComponent, RdInstallmentsChartComponent, MemberSelectComponent, SaWithdrawalComponent, ShareWithdrawalComponent, SaWithdrawalViewComponent, ShareWithdrawalViewComponent, CharacterwithspecialDirective, PaymentReceiptDetailsComponent, DepositWithdrawalDepositsComponent, DepositWithdrawalWithdrawalComponent, DueRDInstalmentsComponent, FDFieldDepositsComponent, FDRecurringDepositsComponent, FDRenewalsComponent, FDShareCapitalsComponent, RDAdvancePaidListComponent, MemberenquiryreceiptsRDComponent, MemberenquiryreceiptsSAComponent, MemberenquiryreceiptsShareComponent, MemberDetailsReportComponent, SavingAccountReportComponent, ShareIssueReportComponent, ShareSavingWithdrawDetailsComponent, RdInstalmentsReportComponent, WelcomeLetterComponent, DefaultReminderLetterComponent, LoanClosingCoveringLetterComponent, ForeclosurePrepaymentRequestLetterComponent, LoanClosureCertificateComponent, PartDisbursementAdviceComponent, FinalDisbursementAdviceComponent, ChequeSubmissionComponent, LoanAgreementComponent, DisbursementRequestFormComponent, DemandPromsoryNoteComponent, SanctionLetterNewComponent, FixedDepositReceiptComponent, PartpaymentComponent, PartpaymentViewComponent, MoratoriumComponent, GSTReportComponent, MoratoriumViewComponent, BranchSelectionComponent, MaturityPreviewComponent, PreMaturityPreviewComponent, MaturityPaymentPreviewComponent, BranchWiseReceiptsReportComponent, ScheduleTrailBalanceReportComponent, CoReferral1Component, JournalVoucherReportDuplicateComponent, GeneralReceiptReportDuplicateComponent, PaymentVoucherReportDuplicateComponent, PanUpdateComponent, TdsAccountsSetupComponent, SectionWiseReportComponent, SubCategoryComponent, AgentWiseBusinessComponent, InterestReportNewComponent, MenuSortingComponent, BankReconStatementNewComponent, BrsPreviewComponent, LienEntryNewComponent, LienEntryPreviewNewComponent, AgentCommissionReportComponent, CoJointmember1Component, BRSReportsComponent, TDSPaymentvoucherComponent, TdsPaymentVoucherViewComponent, TdsPaymentVoucherReportsComponent, RePrintNewComponent, SSCAgendaComponent, PayrollProcessComponent, ESIStatementsComponent, PFStatementComponent, EmployeeNewHrmsComponent, MaturityReportsComponent, EmployeeOnrollComponent, EmployeeAttendanceComponent, JvDetailsComponent, PayrollApprovalComponent, ProfitAndLossNewComponent, SalaryUpdateComponent, SalaryStatementReportComponent, ProfessionalTaxComponent, PayrollApprovalReportComponent, PaySlipComponent, PaySlipPreviewComponent, LoyalityStatementComponent, EmployeeSalaryUpdateComponent, SalaryStatementReportNewComponent, AgeingReportComponent, EarnedLeavesComponent, EmployeeMontlyBonusComponent, BondPreviewDuplicateComponent, EmployeeNewViewComponent, RsdReportComponent, MaturityDetailsReportComponent, AgreementForSaleComponent, AdvanceAgreementLetterComponent, GstVoucherComponent, GstReportNewComponent, SaleAgreementPreviewComponent, InterestReportNew1Component, MaturityReportNew1Component, InterestReportNew2Component, AgentCommissionReportNewComponent, AgreementForSaleHotelSpaceComponent, PreMaturityDetailedReportComponent, InterestReportDetailedComponent, DetailedAgentCommissionComponent, GstPaymentVoucherComponent, HsnCodesComponent, InterestPaymentLatestComponent, AgreementForSaleDhakshinComponent, AgreementForSaleKousalyaInfraComponent, AuthorizedPersonsComponent, ProjectionAchievedReportComponent, ProjectionsComponent, ProjectionsPreviewComponent, ProjectionAchievedPreviewComponent, CpannelnewComponent, ProjectionReprintComponent, AchievedComponent, AchievedpreviewComponent, ProjectionVsAchievedComponent, Form15HComponent, Form15hreprintComponent, ComparisionTrialBalanceNewComponent, FdtransactionNew1Component, FdtransactionView1Component, PanValidationComponent, AccountLedgerMigrationComponent, Form121Component, Form121ReprintComponent, InterestDelayReportComponent, MaturityRenewalComponent, MaturityRenewalViewComponent, LeaveDeatailsComponent, BiometricAttendanceReportComponent, BiometricAttendenceSummaryReportComponent, FundTransferComponent, PendingFundTransferComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ExportAsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    Ng4LoadingSpinnerModule.forRoot(),
    HttpClientModule,
    AmazingTimePickerModule,
    ReactiveFormsModule,
    ImageCropperModule,
    BrowserAnimationsModule, NgxDatatableModule,
    GridModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ExcelModule,
    PDFModule,
    FilterPipeModule,
    TreeViewModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    NgxLoadingModule.forRoot({}),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      // timeOut: 1000,
      positionClass: 'toast-top-right',
      closeButton: true,
      preventDuplicates: true
    }),
    


    RouterModule.forRoot(appRoutes, { useHash: true, scrollPositionRestoration: 'enabled' }),


    PDFExportModule,


    EditorModule,
    NgMultiSelectDropDownModule.forRoot(),

  ],
  providers: [
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    { provide: LOCALE_ID, useValue: "en-IN" },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService, DatePipe, TitleCasePipe, NegativevaluePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
