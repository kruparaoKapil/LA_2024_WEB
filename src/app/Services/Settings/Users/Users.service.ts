import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'
import { CommonService } from '../../common.service';
import { User } from 'src/app/Services/Settings/Users/_helpers/user';
import { Router } from '@angular/router';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  UserDet: any;
  UserRoles: any;

  constructor(private router: Router, private http: HttpClient, private _CommonService: CommonService) { }

  GetUsers(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Settings/Users/UserAccess/GetAllEmployees', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetUserForms(User): Observable<any> {

    try {
      const params = new HttpParams().set('UserName', User)
      return this._CommonService.callGetAPI('/Settings/Users/UserRights/GetUserRightsBasedonUserName', params, 'YES')
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  _getRoles() {

    return sessionStorage.getItem('Urc');
  }
  _getUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }
  GetRoles(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Settings/Users/UserRights/GetRoles', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  _getUserForms(user, designation) {

    try {
      const params = new HttpParams()
      params.append('Type', user)
      params.append('UserOrDesignation', designation)
      let httpParams = new HttpParams().set('Type', user).set('UserOrDesignation', designation);
      return this._CommonService.callGetAPI('/Settings/Users/UserRights/GetUserRights', httpParams, 'YES')
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  CheckUserName(User): Observable<any> {

    try {
      const params = new HttpParams().set('UserName', User)
      return this._CommonService.callGetAPI('/Settings/Users/UserAccess/CheckUserName', params, 'YES')
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  CheckContactId(User): Observable<any> {

    try {
      const params = new HttpParams().set('Contactrefid', User)
      return this._CommonService.callGetAPI('/Settings/Users/UserAccess/CheckUsercontactRefID', params, 'YES')
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  SaveRegistaration(Data: any) {


    try {
      return this._CommonService.callPostAPI('/Settings/Users/UserAccess/SaveUserAccess', Data);
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }

  }
  UpdatePass(User, pass) {


    try {
      return this._CommonService.callPostAPI('/Settings/Users/UserAccess/ChangePassword?Username=' + User + '&password=' + pass + '', "");
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }

  }
  _loginUser(Data: any) {

    try {
      return this._CommonService.callPostAPI('/login', Data);
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }


  }
  _VerifyOTP(Data: any) {

    try {
      return this._CommonService.callPostAPI('/VerifyOtp', Data);
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }


  }
  _logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('Urc');
    sessionStorage.removeItem('companydetails');
    sessionStorage.removeItem('SetBranch');
    this.router.navigate(['/']);
  }
  SelectUser() {
    try {
      return this._CommonService.callGetAPI('/Settings/Users/UserRights/GetUsers', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetNavigation(Type, UserOrDesignation) {
    try {
      const params = new HttpParams().set('Type', Type).set('UserOrDesignation', UserOrDesignation);
      return this._CommonService.callGetAPI('/Settings/Users/UserRights/GetUserRights', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  SaveNavigation(Type, UserOrDesignation, data) {
    try {
      const params = new HttpParams().set('Type', Type).set('UserOrDesignation', UserOrDesignation).set('UserRightsFunctionsDTO', data);
      let Url = '/Settings/Users/UserRights/SaveUserRight?Type=' + Type + '&UserOrDesignation=' + UserOrDesignation + ''
      return this._CommonService.callPostAPI(Url, data);
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  Selectuserview() {
    try {
      return this._CommonService.callGetAPI('/Settings/Users/UserAccess/GetUserView', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  Resetpassword(UserName) {
    try {
      let Url = '/Settings/Users/UserAccess/ResetPassword?Username=' + UserName
      return this._CommonService.callPostAPI(Url, '');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  Status(userid, status) {
    try {
      let Url = '/Settings/Users/UserAccess/UserActiveInactive?Userid=' + userid + '&Status=' + status;
      return this._CommonService.callPostAPI(Url, '');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Settings/Branch/GetBranchLocationDetails

  getBranchLocations() {
    try {
      return this._CommonService.callGetAPI('/Settings/Branch/GetBranchLocationDetails', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  //Settings/Branch/GetBranchNameDetails?branchname=BHEL
  getBranchNameDetails(branchname) {
    try {
      const params = new HttpParams().set('branchname', branchname);
      return this._CommonService.callGetAPI('/Settings/Branch/GetBranchNameDetails', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/FdReceipt/getDepositesDatadashboard

  // getDepositesDatadashboard(datetype,fromdate,todate): Observable<any> {

  //     try {
  //     const params = new HttpParams().set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
  //     return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDepositesDatadashboard', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  //   }


  getDepositesDatadashboard(datetype): Observable<any> {

    try {
      const params = new HttpParams().set('datetype', datetype);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDepositesDatadashboard', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/Banking/Transactions/FdReceipt/getMaturityDatadashboard

  getMaturityDatadashboard(): Observable<any> {

    try {
      // const params = new HttpParams().set('datetype', datetype);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getMaturityDatadashboard', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  ///api/Banking/Transactions/FdReceipt/getPreMaturityDatadashboard
  getPreMaturityDatadashboard(): Observable<any> {

    try {
      // const params = new HttpParams().set('datetype', datetype);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getPreMaturityDatadashboard', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  //Banking/Transactions/FdReceipt/getDetailedCertificatesDashboard

  // getDetailedCertificatesDashboard(datetype,fromdate,todate): Observable<any> {
  // debugger;
  //    try {
  //     const params = new HttpParams().set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
  //     return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedCertificatesDashboard', params, 'YES');
  //   }
  //     catch (e) {
  //       this._CommonService.showErrorMessage(e);
  //     }
  //   }


  getDetailedCertificatesDashboard(betweendates, fromdate, todate): Observable<any> {
    debugger;
    try {
      const params = new HttpParams().set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedCertificatesDashboard', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  getDetailedLiveCertificatesDashboard(betweendates, fromdate, todate): Observable<any> {
    debugger;

    let params = new HttpParams().set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate);

    return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedLiveCertificatesData', params, 'YES');
  }

  getLiveCertificatesDatadashboard(datetype): Observable<any> {

    try {
      const params = new HttpParams().set('datetype', datetype);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getLiveCertificatesData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/Banking/Transactions/FdReceipt/getDetailedMaturityDashboard

  getDetailedMaturityDashboard(betweendates, fromdate, todate): Observable<any> {
    debugger;
    try {
      const params = new HttpParams().set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedMaturityDashboard', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/Banking/Transactions/FdReceipt/getDetailedPreMaturityDashboard

  getDetailedPreMaturityDashboard(betweendates, fromdate, todate): Observable<any> {
    debugger;
    try {
      const params = new HttpParams().set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedPreMaturityDashboard', params, 'YES');
      // return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getPreMaturityDatadashboard', params, 'YES');


    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getCount(selectedMonth, product): Observable<any> {
    try {
      const params = new HttpParams().set('selectedMonth', selectedMonth).set('product', product);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/GetProjectionData', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  //Banking/Transactions/FdReceipt/getDetailedCertificatesByBranch

  //   getDetailedCertificatesByBranch(branchName,datetype,fromdate,todate,schemName) {
  //   try {
  //     const params = new HttpParams().set('branchName', branchName).set('datetype', datetype).set('fromdate', fromdate).set('todate', todate).set('schemName', schemName);
  //     return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedCertificatesByBranch', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }


  getDetailedCertificatesByBranch(branchName, betweendates, fromdate, todate, schemName): Observable<any> {
    debugger;
    try {
      let params = new HttpParams().set('branchName', branchName).set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate).set('schemName', schemName);

      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedCertificatesByBranch', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getDetailedLiveCertificatesByBranch(branchName, betweendates, fromdate, todate, schemName): Observable<any> {
    debugger;
    try {
      let params = new HttpParams().set('branchName', branchName).set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate).set('schemName', schemName);

      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getDetailedLiveCertificatesByBranch', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  // getAgentSummaryDashboard(datetype,fromdate,todate): Observable<any> {

  //    try {
  //     const params = new HttpParams().set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
  //     return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getAgentSummaryDashboard', params, 'YES');
  //   }
  //     catch (e) {
  //       this._CommonService.showErrorMessage(e);
  //     }
  //   }


  // getAgentSummaryDashboard(): Observable<any> {
  //   debugger;

  //    try {
  //         return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getAgentSummaryDashboard', '', 'NO');
  //   }
  //     catch (e) {
  //       this._CommonService.showErrorMessage(e);
  //     }
  //   }
  getAgentSummaryDashboard(datetype): Observable<any> {
    debugger;

    try {
      const params = new HttpParams().set('datetype', datetype);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getAgentSummaryDashboard', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  GetAgentReportdetails(betweendates, fromdate, todate, agentId) {
    debugger
    let params = new HttpParams().set('betweendates', betweendates).set('fromdate', fromdate).set('todate', todate).set('agentId', agentId);;
    return this._CommonService.callGetAPI('/Banking/Transactions/IntrestPayment/GetAgentReportdetails', params, 'Yes')

  }

  //   GetStatutoryDetails(): Observable<any> {
  // return this._CommonService.callGetAPI('/Banking/Transactions/IntrestPayment/GetStatutoryDetails','', 'NO')

  //   }
  GetStatutoryDetails() {
    const params = new HttpParams();
    return this._CommonService.callGetAPI(
      '/Banking/Transactions/IntrestPayment/GetStatutoryCompliancedetails', params, 'Yes');
  }


  GetIntersestReportdetails(): Observable<any> {

    return this._CommonService.callGetAPI('/Banking/Transactions/IntrestPayment/GetIntersestReportdetails', '', 'NO')

  }



  //Banking/Transactions/FdReceipt/getAgentSummaryByAgentId

  getAgentSummaryByAgentId(agentId, datetype, fromdate, todate) {
    try {
      const params = new HttpParams().set('agentId', agentId).set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getAgentSummaryByAgentId', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/FdReceipt/getBankDataDashboard



  getBankDataDashboard(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getBankDataDashboard', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //api/Banking/Transactions/FdReceipt/getBankDataAmountTotal  today
  getBankDataAmountTotal(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getBankDataAmountTotal', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getBankDetailedDashboard(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getBankDetailedDashboard', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/FdReceipt/getInterestDataDashboard

  getInterestDataDashboard(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getInterestDataDashboard', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/FdReceipt/getOldRenewalsDashboard

  getOldRenewalsDashboard(paymenFromDate, paymentToDate, transFromDate, transToDate) {
    try {
      const params = new HttpParams().set('paymenFromDate', paymenFromDate).set('paymentToDate', paymentToDate).set('transFromDate', transFromDate).set('transToDate', transToDate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getOldRenewalsDashboard', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Banking/Transactions/FdReceipt/getFreshRenewals

  getFreshRenewals(paymenFromDate, paymentToDate, transFromDate, transToDate) {
    try {
      const params = new HttpParams().set('paymenFromDate', paymenFromDate).set('paymentToDate', paymentToDate).set('transFromDate', transFromDate).set('transToDate', transToDate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getFreshRenewals', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  SaveProjection(Data: any) {
    try {
      // return this._CommonService.callPostAPI1('/Accounting/AccountingReports/SaveProjection', Data);
      return this._CommonService.callPostAPI('/Accounting/AccountingReports/SaveProjectionReport', Data);
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  //bhargavi
  ///api/Banking/Transactions/FdReceipt/getNetBusinessFreshRenewals
  getNetBusinessFreshRenewals(receiptFromDate, receiptToDate, chequeFromDate, chequeToDate, prevreceiptfromdate, prerecepttodate, prevchequefromdate, prevchequetodate, lastreceiptfromdate, lastreceipttodate, lastchequefromdate, lastchequetodate) {
    try {
      const params = new HttpParams().set('receiptFromDate', receiptFromDate).set('receiptToDate', receiptToDate).set('chequeFromDate', chequeFromDate).set('chequeToDate', chequeToDate).set('prevreceiptfromdate', prevreceiptfromdate).set('prerecepttodate', prerecepttodate).set('prevchequefromdate', prevchequefromdate).set('prevchequetodate', prevchequetodate).set('lastreceiptfromdate', lastreceiptfromdate).set('lastreceipttodate', lastreceipttodate).set('lastchequefromdate', lastchequefromdate).set('lastchequetodate', lastchequetodate);
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/getNetBusinessFreshRenewals', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  getNetBusiness(month: string) {
    try {
      const params = new HttpParams()
        .set('month', month);

      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/GetNetBusinessTotal', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
  SaveProjectionAchievedReport(saveData: any) {
    try {
      // return this._CommonService.callPostAPI1('/Accounting/AccountingReports/SaveProjection', Data);
      return this._CommonService.callPostAPI('/Accounting/AccountingReports/SaveProjectionAchievedReport', saveData);
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetProductList(): Observable<any> {

    try {
      return this._CommonService.callGetAPI('/Banking/Transactions/FdReceipt/GetProducts', '', 'NO');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


}
