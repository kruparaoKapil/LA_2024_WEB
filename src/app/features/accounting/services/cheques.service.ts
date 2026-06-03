import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type ChequeBucket = 'OnHand' | 'Issued' | 'InBank';

export interface ChequeRow {
  pChequeNo: string;
  pBankName?: string;
  pPartyName?: string;
  pChequeAmount: number;
  pChequeDate?: string;
  pStatus?: string;
  pVoucherNo?: string;
  ptypeofoperation?: string;
  [key: string]: unknown;
}

/**
 * Replaces the cheque-and-BRS slice of the legacy 389-LOC
 * `AccountingTransactionsService` plus the 539-LOC `BrStatementService`.
 * One service drives Cheques-On-Hand, Cheques-Issued, Cheques-In-Bank
 * and the BRS statement screens.
 */
@Injectable({ providedIn: 'root' })
export class ChequesService {
  private readonly api = inject(ApiClient);

  // ---- bank list ----
  getBanksList(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetBankntList',
    );
  }

  // ---- on-hand ----
  getChequesOnHand(bankId: number): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetChequesOnHandData',
      { _BankId: bankId },
    );
  }

  saveChequesOnHand(data: unknown): Observable<unknown> {
    return this.api.post('/Accounting/ChequesOnHand/SaveChequesOnHand', data);
  }

  getOnHandByBrsRange(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetChequesOnHandData_New',
      {
        BrsFromDate: args.fromDate,
        BrsTodate: args.toDate,
        _BankId: args.bankId,
      },
    );
  }

  // ---- issued ----
  getChequesIssued(bankId: number): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetChequesIssued',
      { _BankId: bankId },
    );
  }

  saveChequesIssued(data: unknown): Observable<unknown> {
    return this.api.post('/Accounting/ChequesOnHand/SaveChequesIssued', data);
  }

  getIssuedByBrsRange(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetIssuedCancelledCheques_New',
      {
        BrsFromDate: args.fromDate,
        BrsTodate: args.toDate,
        _BankId: args.bankId,
      },
    );
  }

  // ---- in-bank (cleared/returned) ----
  getChequesInBank(bankId: number): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetChequesInBankData',
      { depositedBankid: bankId },
    );
  }

  saveChequesInBank(data: unknown): Observable<unknown> {
    return this.api.post('/Accounting/ChequesOnHand/SaveChequesInBank', data);
  }

  getInBankByBrsRange(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<ChequeRow[]> {
    return this.api.get<ChequeRow[]>(
      '/Accounting/ChequesOnHand/GetClearedReturnedCheques_New',
      {
        BrsFromDate: args.fromDate,
        BrsTodate: args.toDate,
        depositedBankid: args.bankId,
      },
    );
  }

  // ---- BRS statement ----
  getBrsDeposits(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/ChequesOnHand/GetBrsstatementdeposite',
      {
        FromDate: args.fromDate,
        Todate: args.toDate,
        _BankId: args.bankId,
      },
    );
  }

  getBrsCredits(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/ChequesOnHand/GetBrsstatementcredit',
      {
        FromDate: args.fromDate,
        Todate: args.toDate,
        Bankid: args.bankId,
      },
    );
  }

  getBrsJv(args: {
    fromDate: string;
    toDate: string;
    bankId: number;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/ChequesOnHand/GetBrsstatementJv',
      {
        FromDate: args.fromDate,
        Todate: args.toDate,
        _BankId: args.bankId,
      },
    );
  }

  getBankBalance(bankId: number): Observable<unknown> {
    // Legacy implementation passed an empty params object; preserve.
    return this.api.get(
      '/Accounting/ChequesOnHand/GetBankBalance',
      { _recordid: bankId },
    );
  }

  // ---- cheque enquiry / cancel / return ----
  getIssuedChequesDetails(chqNo: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingReports/GetIssuedChequesDetails',
      { pChequeNo: chqNo },
    );
  }

  getReceivedChequesDetails(chqNo: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingReports/GetReceivedChequesDetails',
      { pChequeNo: chqNo },
    );
  }

  getChequeCancelDetails(
    fromDate: string,
    toDate: string,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingReports/GetChequeCancelDetails',
      { fromdate: fromDate, todate: toDate },
    );
  }

  getChequeReturnDetails(
    fromDate: string,
    toDate: string,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingReports/GetChequeReturnDetails',
      { fromdate: fromDate, todate: toDate },
    );
  }

  getBankChequeDetails(bankId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingReports/GetIssuedChequeNumbers',
      { _BankId: bankId },
    );
  }

  unusedChequeCancel(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingReports/UnusedhequeCancel',
      data,
    );
  }
}
