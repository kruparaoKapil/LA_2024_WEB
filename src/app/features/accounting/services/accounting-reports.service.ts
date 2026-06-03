import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface AccountingReportRow {
  [key: string]: unknown;
}

/**
 * Replaces the legacy 174-LOC `ReportService` and the smaller
 * `bankbook.service.ts`, `cashbook.service.ts`, `journal-voucher.service.ts`,
 * `payment-voucher.service.ts`, `general-receipt.service.ts`,
 * `ledger-extract-report.service.ts`, `subaccountledger-report.service.ts`,
 * `subledgersummary-report.service.ts`, `jv-list-report-services.service.ts`,
 * `profiandloss-mtdytd-report.service.ts`, and `reprint.service.ts` — all of
 * them just thin wrappers over the same `/AccountingReports` endpoint family.
 *
 * Drives the generic `<app-accounting-report-shell>`.
 */
@Injectable({ providedIn: 'root' })
export class AccountingReportsService {
  private readonly api = inject(ApiClient);

  // ---- core reports ----
  getDayBook(fromDate: string, toDate: string): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/getDaybook',
      { fromdate: fromDate, todate: toDate },
    );
  }

  getTrialBalance(
    fromDate: string,
    toDate: string,
    groupType: string,
  ): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetTrialBalance',
      { fromDate, todate: toDate, GroupType: groupType },
    );
  }

  getProfitAndLoss(
    fromDate: string,
    toDate: string,
    groupType: string,
  ): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetProfitAndLossData',
      { fromDate, todate: toDate, GroupType: groupType },
    );
  }

  getBalanceSheet(fromDate: string): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetBalanceSheetDetails',
      { fromDate },
    );
  }

  getComparisonTb(
    fromDate: string,
    toDate: string,
  ): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetComparisionTB',
      { fromDate, todate: toDate },
    );
  }

  // ---- ledger family ----
  getLedgerReport(args: {
    fromDate: string;
    toDate: string;
    accountId: number;
    subAccountId: number;
  }): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetAccountLedgerDetails',
      {
        fromDate: args.fromDate,
        toDate: args.toDate,
        pAccountId: args.accountId,
        pSubAccountId: args.subAccountId,
      },
    );
  }

  getPartyLedger(args: {
    fromDate: string;
    toDate: string;
    accountId: number;
    subAccountId: number;
    partyRefId: number;
  }): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetPartyLedgerDetails',
      {
        fromDate: args.fromDate,
        toDate: args.toDate,
        pAccountId: args.accountId,
        pSubAccountId: args.subAccountId,
        pPartyRefId: args.partyRefId,
      },
    );
  }

  getLedgerSummary(
    fromDate: string,
    toDate: string,
    accountId: number,
  ): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetLedgerSummary',
      { fromDate, todate: toDate, pAccountId: accountId },
    );
  }

  getLedgerMigrationList(formName: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetLedgerMigrationList',
      { formname: formName },
    );
  }

  getLedgerMigrationReport(args: {
    fromDate: string;
    toDate: string;
    ledgerName: string;
    subLedgerName: string;
  }): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingReports/GetLedgerMigrationDetails',
      {
        fromDate: args.fromDate,
        toDate: args.toDate,
        LedgerName: args.ledgerName,
        SubLedgerName: args.subLedgerName,
      },
    );
  }

  // ---- voucher reports ----
  getReferenceNo(formName: string, transNo: string): Observable<unknown> {
    return this.api.get(
      '/Accounting/AccountingReports/GetReferenceNo',
      { FormName: formName, TransactionNo: transNo },
    );
  }

  // ---- gst report ----
  getGstReport(
    fromDate: string,
    toDate: string,
  ): Observable<AccountingReportRow[]> {
    return this.api.get<AccountingReportRow[]>(
      '/Accounting/AccountingTransactions/Getgstreport',
      { fromdate: fromDate, todate: toDate },
    );
  }

  // ---- ledger account list (drives report filters) ----
  getLedgerAccountList(formName: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetLedgerAccountList',
      { formname: formName },
    );
  }

  getAccountLedger(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetAccountledger',
    );
  }
}
