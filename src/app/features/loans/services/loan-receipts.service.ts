import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type ReceiptFormName =
  | 'Receipt'
  | 'PartPayment'
  | 'Moratorium'
  | 'Preclosure'
  | string;

export interface ReceiptListRow {
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pTransDate?: string;
  pAmountReceived?: number;
  pBalance?: number;
  pStatus?: string;
  [key: string]: unknown;
}

export interface ParticularRow {
  pParticularName: string;
  pParticularAmount: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

export interface InstallmentDueRow {
  pInstallmentNo: number;
  pDueDate: string;
  pPrincipal: number;
  pInterest: number;
  pPenalInterest: number;
  pTotal: number;
  pPaid?: number;
  [key: string]: unknown;
}

/**
 * Consolidates the legacy `LoanreceiptService` (51 LOC) and
 * `MoratoriumService` (76 LOC). They share the `/Receipts` API surface;
 * splitting them was an artefact of the legacy multi-screen architecture.
 *
 * Used by Receipts View/New, PartPayment View/New, Moratorium View/New
 * components — each scopes its API calls via `formname`.
 */
@Injectable({ providedIn: 'root' })
export class LoanReceiptsService {
  private readonly api = inject(ApiClient);

  // ---- list views ----
  getReceiptView(
    fromDate: string,
    toDate: string,
    formName: ReceiptFormName,
  ): Observable<ReceiptListRow[]> {
    return this.api.get<ReceiptListRow[]>(
      '/loans/Transactions/Receipts/Viewtodayreceipts',
      { fromdate: fromDate, todate: toDate, formname: formName },
    );
  }

  getMoratoriumView(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/ViewMoratoriumLoanDetails',
    );
  }

  getLoanNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/GetLoannames',
    );
  }

  getReceiptApplicationId(
    loanType: string,
    formName: ReceiptFormName,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/GetApplicantionid',
      { loanname: loanType, formname: formName },
    );
  }

  getPartPaymentApplicationId(
    loanType: string,
    formName: ReceiptFormName,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/GetPartPaymentApplicationID',
      { loanname: loanType, formname: formName },
    );
  }

  // ---- detail / lookups ----
  getTransactionsByLoan(loanId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/GetTransactions',
      { loanid: loanId },
    );
  }

  getInstallmentsView(
    loanId: string,
    receiptDate: string,
    duesType: string,
  ): Observable<InstallmentDueRow[]> {
    return this.api.get<InstallmentDueRow[]>(
      '/loans/Transactions/Receipts/ViewParticularsDetails',
      {
        loanid: loanId,
        transdate: receiptDate,
        todate: receiptDate,
        duestype: duesType,
      },
    );
  }

  getParticulars(
    loanId: string,
    receiptDate: string,
    formName: ReceiptFormName,
  ): Observable<ParticularRow[]> {
    return this.api.get<ParticularRow[]>(
      '/loans/Transactions/Receipts/GetParticulars',
      { loanid: loanId, transdate: receiptDate, formname: formName },
    );
  }

  getLoanDetailsForReceipt(loanId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Receipts/GetLoandetails',
      { loanid: loanId },
    );
  }

  getNextEmiDate(args: {
    loanPayIn: string;
    moratoriumDate: string;
    moratoriumMonths: number;
    applicationId: string;
  }): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Receipts/GetNextEmiDate',
      {
        loanpayin: args.loanPayIn,
        moratoriumdate: args.moratoriumDate,
        moratoriummonths: args.moratoriumMonths,
        applicationid: args.applicationId,
      },
    );
  }

  // ---- save ----
  saveReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Receipts/SaveEmiReceipt',
      data,
    );
  }

  savePartPayment(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Receipts/SavePartPaymentReceipt',
      data,
    );
  }

  saveMoratorium(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Receipts/SaveMoratorium',
      data,
    );
  }

  updateMoratoriumInstalments(args: {
    applicationId: string;
    moratoriumDate: string;
    moratoriumMonthsCount: number;
    interestMode: string;
  }): Observable<unknown> {
    const path =
      `/loans/Transactions/Receipts/Updatemoratoriuminstalments` +
      `?applicationid=${encodeURIComponent(args.applicationId)}` +
      `&moratoriumdate=${encodeURIComponent(args.moratoriumDate)}` +
      `&moratoriummonthscount=${args.moratoriumMonthsCount}` +
      `&interestmode=${encodeURIComponent(args.interestMode)}`;
    return this.api.post(path, {});
  }
}
