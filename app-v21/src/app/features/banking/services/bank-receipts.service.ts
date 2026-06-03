import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type BankReceiptKind = 'fd' | 'rd' | 'savings' | 'share' | 'member';

export interface BankReceiptRow {
  pReceiptId?: number;
  pReceiptNo?: string;
  pReceiptDate?: string;
  pAccountNo?: string;
  pMemberName?: string;
  pAmount?: number;
  pMode?: string;
  pStatus?: string;
  [key: string]: unknown;
}

/**
 * Consolidates the 5 legacy receipt services:
 *   - FdReceiptService (52 LOC)
 *   - RdReceiptService (52 LOC)
 *   - SAReceiptService (149 LOC) — savings + share
 *   - MemberReceiptService (48 LOC)
 *
 * Each was a thin wrapper over a different `/Receipt/Get*` family
 * with the same `Save*Receipt` shape. One service drives the unified
 * `<app-bank-receipt-shell>`.
 */
@Injectable({ providedIn: 'root' })
export class BankReceiptsService {
  private readonly api = inject(ApiClient);

  // ---- list views ----
  getFdReceiptView(fromDate: string, toDate: string): Observable<BankReceiptRow[]> {
    return this.api.get<BankReceiptRow[]>(
      '/Banking/Transactions/FdReceipt/GetFDReceiptDetails',
      { FromDate: fromDate, Todate: toDate },
    );
  }

  getRdReceiptView(fromDate: string, toDate: string): Observable<BankReceiptRow[]> {
    return this.api.get<BankReceiptRow[]>(
      '/Banking/Transactions/RDReceipt/GetRDReceiptDetails',
      { FromDate: fromDate, Todate: toDate },
    );
  }

  getSavingsReceiptView(fromDate: string, toDate: string): Observable<BankReceiptRow[]> {
    return this.api.get<BankReceiptRow[]>(
      '/Banking/Transactions/SDReceipt/GetSavingReceiptView',
      { FromDate: fromDate, Todate: toDate },
    );
  }

  getShareReceiptView(fromDate: string, toDate: string): Observable<BankReceiptRow[]> {
    return this.api.get<BankReceiptRow[]>(
      '/Banking/Transactions/SDReceipt/GetShareReceiptView',
      { FromDate: fromDate, Todate: toDate },
    );
  }

  // ---- common: members + branch ----
  getMemberDetails(memberType: string, branchName: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetMemberDetails',
      { MemberType: memberType, BranchName: branchName },
    );
  }

  getFdBranches(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetFDBranchDetails',
    );
  }

  // ---- account dropdowns ----
  getFdAccountsByMember(
    memberCode: string,
    chitBranch: string,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetFdDetails',
      { Membercode: memberCode, ChitBranch: chitBranch },
    );
  }

  getFdAccountById(accountNo: string, accountId: number): Observable<unknown> {
    return this.api.get(
      '/Banking/Transactions/FdReceipt/GetFdDetailsByid',
      { FdAccountNo: accountNo, FdaccountId: accountId },
    );
  }

  getSavingsAccountNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetSavingAccountNameDetails',
    );
  }

  getSavingsAccountNumbers(savingConfigId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetSavingAccountNumberDetails',
      { SavingConfigid: savingConfigId },
    );
  }

  getShareAccountNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetShareAccountNameDetails',
    );
  }

  getShareAccountNumbers(shareConfigId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetShareAccountNumberDetails',
      { ShareConfigid: shareConfigId },
    );
  }

  // ---- transactions / particulars ----
  getFdTransactions(fdAccountNo: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetTransactionslist',
      { FdAccountNo: fdAccountNo },
    );
  }

  getSavingsTransactions(savingAccountId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetSavingTransaction',
      { SavingAccountId: savingAccountId },
    );
  }

  getShareTransactions(shareAccountId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/SDReceipt/GetShareTransaction',
      { ShareAccountId: shareAccountId },
    );
  }

  // ---- savings withdrawal balance ----
  getSavingsBalance(savingAccountId: number): Observable<unknown> {
    return this.api.get(
      '/Banking/Transactions/Withdraw/ViewBalanceAmout',
      { accountid: savingAccountId },
    );
  }

  getWithdrawalTransactions(savingAccountId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/Withdraw/GetWithDrawalTransaction',
      { accountid: savingAccountId },
    );
  }

  // ---- save ----
  saveFdReceipt(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/Transactions/FdReceipt/SaveFdReceipt', data);
  }

  saveFdReceiptAdjustment(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/FdReceipt/SaveFdReceiptadjustment',
      data,
    );
  }

  saveRdReceipt(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/Transactions/RDReceipt/SaveRdReceipt', data);
  }

  saveSavingsReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/SDReceipt/SaveSavingsReceipt',
      data,
    );
  }

  saveShareReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/SDReceipt/SaveShareReceipt',
      data,
    );
  }

  saveMemberReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/SDReceipt/SaveMemberReceipt',
      data,
    );
  }

  // ---- generic dispatcher ----
  saveByKind(kind: BankReceiptKind, data: unknown): Observable<unknown> {
    switch (kind) {
      case 'fd':
        return this.saveFdReceipt(data);
      case 'rd':
        return this.saveRdReceipt(data);
      case 'savings':
        return this.saveSavingsReceipt(data);
      case 'share':
        return this.saveShareReceipt(data);
      case 'member':
        return this.saveMemberReceipt(data);
    }
  }

  getViewByKind(
    kind: BankReceiptKind,
    fromDate: string,
    toDate: string,
  ): Observable<BankReceiptRow[]> {
    switch (kind) {
      case 'fd':
        return this.getFdReceiptView(fromDate, toDate);
      case 'rd':
        return this.getRdReceiptView(fromDate, toDate);
      case 'savings':
        return this.getSavingsReceiptView(fromDate, toDate);
      case 'share':
        return this.getShareReceiptView(fromDate, toDate);
      case 'member':
        return this.getFdReceiptView(fromDate, toDate);
    }
  }
}
