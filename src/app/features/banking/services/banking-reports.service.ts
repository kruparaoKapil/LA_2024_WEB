import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface BankingReportRow {
  [key: string]: unknown;
}

/**
 * Replaces the legacy 443-LOC `LAReportsService` plus the 86-LOC
 * `MembrEnquiryService`. The legacy class even shipped a 175-LOC
 * inline jsPDF builder — that responsibility now lives in the
 * `<app-data-grid>` PDF export so the service stays focused on data.
 *
 * Drives the generic `<app-banking-report-shell>` which renders ~50
 * report kinds (interest payment, maturity, pre-maturity, lien release,
 * member-wise receipts, branch-wise receipts, share issue, savings,
 * agent commission, target, application form, cash flow, etc.).
 */
@Injectable({ providedIn: 'root' })
export class BankingReportsService {
  private readonly api = inject(ApiClient);

  // ---- interest payment + trend ----
  getInterestPaymentReport(): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowInterestPaymentReport',
    );
  }

  getInterestTrendBySchemeAndDate(
    schemeName: string,
    maturityDate: string,
  ): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowInterestTrendShemeAndDatewiseDetails',
      { schemename: schemeName, maturitydate: maturityDate },
    );
  }

  getInterestTrendGrandTotalByDate(
    maturityDate: string,
  ): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowInterestTrendGrandTotalDatewiseDetails',
      { maturitydate: maturityDate },
    );
  }

  printInterestTrendDetails(
    maturityDate: string,
  ): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/PrintInterestTrendDetailsReport',
      { maturitydate: maturityDate },
    );
  }

  // ---- maturity ----
  getMaturityTrendReport(): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowMaturityTrendReport',
    );
  }

  getMaturityTrendHeader(): Observable<unknown> {
    return this.api.get(
      '/Banking/Report/LAReports/ShowMaturityTrendGridHeader',
    );
  }

  printMaturityTrendDetails(
    maturityDate: string,
  ): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/PrintMaturityTrendDetailsReport',
      { maturitydate: maturityDate },
    );
  }

  getMaturityIntimationReport(args: {
    schemeId: number;
    branchName: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowMaturityIntimationReport',
      {
        schemeid: args.schemeId,
        branchname: args.branchName,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getMaturityIntimationLetter(
    fdAccountNo: string,
  ): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetMaturityIntimationLetter',
      { fdaccountno: fdAccountNo },
    );
  }

  saveMaturityIntimationReport(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Report/LAReports/SaveMaturityIntimationReport',
      data,
    );
  }

  getMaturityScheme(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetMaturityscheme',
    );
  }

  getMaturityBranch(schemeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetMaturitybrnach',
      { schemeid: schemeId },
    );
  }

  // ---- pre-maturity ----
  getPreMaturityReport(args: {
    fromDate: string;
    toDate: string;
    type: string;
    dateChecked: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowPreMaturityReport',
      {
        fromdate: args.fromDate,
        todate: args.toDate,
        type: args.type,
        pdatecheked: args.dateChecked,
      },
    );
  }

  getPreMaturityMonthwise(args: {
    maturityType: string;
    dateType: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Transactions/MaturityPayment/GetPreMaturityMonthwise',
      {
        maturitytype: args.maturityType,
        datetype: args.dateType,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  // ---- lien release ----
  getLienReleaseReport(args: {
    branchName: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowLienReleaseReport',
      {
        branchname: args.branchName,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getLienBranches(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetLienbrnach',
    );
  }

  // ---- self adjustment ----
  getSelfAdjustmentReport(args: {
    paymentType: string;
    companyName: string;
    branchName: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowSelfAdjustmentReport',
      {
        paymenttype: args.paymentType,
        companyname: args.companyName,
        branchname: args.branchName,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getSelfAdjustmentBranches(companyName: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetSelfAdjustmentbrnach',
      { companyname: companyName },
    );
  }

  getSelfAdjustmentCompanies(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetSelfAdjustmentcompany',
    );
  }

  // ---- member-wise / branch-wise receipts ----
  getMemberWiseReceiptsReport(args: {
    memberId: number;
    fromDate: string;
    toDate: string;
    dateChecked: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowMemberwiseReceiptsReport',
      {
        memberid: args.memberId,
        fromdate: args.fromDate,
        todate: args.toDate,
        pdatecheked: args.dateChecked,
      },
    );
  }

  getBranchWiseReceiptsReport(args: {
    branchId: number;
    branchName: string;
    fromDate: string;
    toDate: string;
    dateChecked: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/ShowBrancwiseReceiptsReport',
      {
        Branchid: args.branchId,
        BranchName: args.branchName,
        fromdate: args.fromDate,
        todate: args.toDate,
        pdatecheked: args.dateChecked,
      },
    );
  }

  // ---- agent commission / points / target ----
  getAgentPointsSummary(args: {
    receiptFromDate: string;
    receiptToDate: string;
    chequeFromDate: string;
    chequeToDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetAgentPointsSummary',
      {
        receiptfromdate: args.receiptFromDate,
        receipttodate: args.receiptToDate,
        chequefromdate: args.chequeFromDate,
        chequetodate: args.chequeToDate,
      },
    );
  }

  getAgentWiseBusinessReport(args: {
    receiptFromDate: string;
    receiptToDate: string;
    chequeFromDate: string;
    chequeToDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetAgentwiseBusinessReport',
      {
        receiptfromdate: args.receiptFromDate,
        receipttodate: args.receiptToDate,
        chequefromdate: args.chequeFromDate,
        chequetodate: args.chequeToDate,
      },
    );
  }

  getTargetReportSummary(args: {
    receiptFromDate: string;
    receiptToDate: string;
    chequeFromDate: string;
    chequeToDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetTargetReportSummary',
      {
        receiptfromdate: args.receiptFromDate,
        receipttodate: args.receiptToDate,
        chequefromdate: args.chequeFromDate,
        chequetodate: args.chequeToDate,
      },
    );
  }

  // ---- cash flow ----
  getCashFlowSummary(date: string, months: number): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetCashFlowSummary',
      { date, months },
    );
  }

  getCashFlowDetails(asOnMonth: string, month: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetCashFlowDetails',
      { Asonmonth: asOnMonth, month },
    );
  }

  // ---- application form / member enquiry ----
  getApplicationFormDetails(fdAccountNo: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/LAReports/GetApplicationFormDetails',
      { FdAccountNo: fdAccountNo },
    );
  }

  getMemberEnquiryDetails(fdAccountNo: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/MemberEnquiry/GetMemberEnquiryDetailsReport',
      { FdAccountNo: fdAccountNo },
    );
  }

  getMemberDetailsReport(args: {
    dateCheck: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/MemberEnquiry/GetMemberDetailsReport',
      {
        datecheck: args.dateCheck,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getShareIssueReport(args: {
    dateCheck: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/MemberEnquiry/GetShareIssueReport',
      {
        datecheck: args.dateCheck,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getSavingsAccountReport(args: {
    dateCheck: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/MemberEnquiry/GetSavingAccountReport',
      {
        datecheck: args.dateCheck,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  getShareSavingsWithdrawDetails(args: {
    accountType: string;
    dateCheck: string;
    fromDate: string;
    toDate: string;
  }): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Report/MemberEnquiry/GetShareSavingWithdrawDetails',
      {
        accounttype: args.accountType,
        datecheck: args.dateCheck,
        fromdate: args.fromDate,
        todate: args.toDate,
      },
    );
  }

  // ---- production / target ----
  getProductSummary(selectedMonth: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Transactions/FdReceipt/GetProjectSummarydata',
      { selectedmonth: selectedMonth },
    );
  }

  getProductionAchieved(selectedMonth: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Transactions/FdReceipt/GetProjectAchievedData',
      { selectedmonth: selectedMonth },
    );
  }

  getProductionTarget(selectedMonth: string): Observable<BankingReportRow[]> {
    return this.api.get<BankingReportRow[]>(
      '/Banking/Transactions/FdReceipt/GetTargetAchievedData',
      { selectedmonth: selectedMonth },
    );
  }

  // ---- shared lookups ----
  getMemberNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetMemberName',
    );
  }

  getInterestReportSchemes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetInterestreportscheme',
    );
  }

  getCompanyDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Report/LAReports/GetSelfAdjustmentcompany',
    );
  }
}
