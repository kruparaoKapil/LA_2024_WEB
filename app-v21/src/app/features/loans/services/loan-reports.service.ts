import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface ReportRow {
  [key: string]: unknown;
}

export interface DueReportArgs {
  fromDate: string;
  toDate: string;
  recordId?: number;
  fieldName?: string;
  fieldType?: string;
  duesType: string;
}

/**
 * Consolidates the legacy report services (loan-statement, due-reports,
 * disbursement-reports). Banking & accounting reports keep their own
 * services in their own feature folders.
 */
@Injectable({ providedIn: 'root' })
export class LoanReportsService {
  private readonly api = inject(ApiClient);

  // ---- account / loan statement ----
  getAccountStatement(vchApplicationId: string): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>(
      '/Loans/Reports/GetAccountstatementReport',
      { VchapplicationID: vchApplicationId },
    );
  }

  // ---- due reports ----
  getDuesSummary(args: DueReportArgs): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/Loans/Reports/GetDuesSummaryReport', {
      FromDate: args.fromDate,
      ToDate: args.toDate,
      recordid: args.recordId ?? 0,
      fieldname: args.fieldName ?? '',
      fieldtype: args.fieldType ?? '',
      duestype: args.duesType,
    });
  }

  getEmiDuesByDate(
    loanId: string,
    transDate: string,
    toDate: string,
    duesType: string,
  ): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>(
      '/Loans/Transactions/Receipts/ViewParticularsDetails',
      {
        loanid: loanId,
        transdate: transDate,
        todate: toDate,
        duestype: duesType,
      },
    );
  }

  // ---- disbursement reports ----
  getDisbursedReport(payload: unknown): Observable<ReportRow[]> {
    return this.api.post<ReportRow[]>(
      '/loans/Transactions/Disbursement/GetDisbursedReportDetails',
      payload,
    );
  }

  getDisbursedReportDues(payload: unknown): Observable<ReportRow[]> {
    return this.api.post<ReportRow[]>(
      '/loans/Transactions/Disbursement/GetDisbursedReportDuesDetails',
      payload,
    );
  }

  // ---- gst report ----
  getGstReport(fromDate: string, toDate: string): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/Loans/Reports/GetGSTReport', {
      FromDate: fromDate,
      ToDate: toDate,
    });
  }

  // ---- emi chart (re-uses disbursement service endpoint) ----
  getEmiChartReport(vchApplicationId: string): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>(
      '/loans/Transactions/Disbursement/GetEmiChartReport',
      { vchapplicationid: vchApplicationId },
    );
  }

  getEmiChartList(): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>(
      '/loans/Transactions/Disbursement/GetEmiChartView',
    );
  }
}
