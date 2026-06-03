import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface BankInformationRow {
  precordid?: number;
  pbankname: string;
  pbranchname?: string;
  paccountname?: string;
  paccountnumber?: string;
  pifsccode?: string;
  pmicrcode?: string;
  pUpiId?: string;
  [key: string]: unknown;
}

export interface ChequeManagementRow {
  precordid?: number;
  pBankId: number;
  pBookId?: number;
  pChqFromNo: number;
  pChqToNo: number;
  pTotalLeaves?: number;
  pIssueDate?: string;
  [key: string]: unknown;
}

export interface AccountTreeNode {
  pAccountId: number;
  pAccountName: string;
  pParentId?: number;
  pAccountType?: string;
  children?: AccountTreeNode[];
  [key: string]: unknown;
}

export interface HsnCodeRow {
  pHsnId?: number;
  pHsnCode: string;
  pProductName: string;
  pGstPercentage: number;
  [key: string]: unknown;
}

/**
 * Replaces the legacy 172-LOC `AccountingMastresService`. Keeps the
 * masters-side of accounting (banks, cheque book, account tree, HSN
 * codes, sub-categories) on the modern signal-driven API.
 *
 * Voucher-related calls (formerly mixed in with the legacy "masters"
 * service) live in `voucher.service.ts`.
 */
@Injectable({ providedIn: 'root' })
export class AccountingMastersService {
  private readonly api = inject(ApiClient);

  // Cross-screen edit handoff (replaces legacy `getbankdetails` mutable field).
  readonly editingBankRecordId = signal<number | null>(null);
  readonly newFormStatus = signal<string>('');

  // ---- bank information ----
  listBanks(): Observable<BankInformationRow[]> {
    return this.api.get<BankInformationRow[]>(
      '/Accounting/Masters/ViewBankInformationDetails',
    );
  }

  getBank(recordId: number): Observable<BankInformationRow> {
    return this.api.get<BankInformationRow>(
      '/Accounting/Masters/ViewBankInformation',
      { precordid: recordId },
    );
  }

  saveBank(data: BankInformationRow): Observable<unknown> {
    return this.api.post('/Accounting/Masters/SaveBankInformation', data);
  }

  getBankUpiDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Accounting/Masters/GetBankUPIDetails');
  }

  checkDuplicateDebitCardNo(data: BankInformationRow): Observable<unknown> {
    return this.api.post(
      '/Accounting/Masters/GetCheckDuplicateDebitCardNo',
      data,
    );
  }

  // ---- cheque management ----
  listChequeManagement(): Observable<ChequeManagementRow[]> {
    return this.api.get<ChequeManagementRow[]>(
      '/Accounting/Masters/ViewChequeManagementDetails',
    );
  }

  generateBookId(): Observable<{ pBookId: number } | null> {
    return this.api.get('/Accounting/Masters/GenerateBookId');
  }

  saveChequeManagement(data: ChequeManagementRow): Observable<unknown> {
    // Legacy URL has a literal trailing space; preserved on purpose for parity.
    return this.api.post(
      '/Accounting/Masters/SaveChequeManagement    ',
      data,
    );
  }

  getExistingChequeCount(
    bankId: number,
    fromNo: number,
    toNo: number,
  ): Observable<number> {
    return this.api.get<number>(
      '/Accounting/Masters/GetExistingChequeCount',
      { BankId: bankId, ChqFromNo: fromNo, ChqToNo: toNo },
    );
  }

  // ---- account tree / accounts ----
  getAccountTree(): Observable<AccountTreeNode[]> {
    return this.api.get<AccountTreeNode[]>(
      '/accounting/accountingtransactions/GetAccountTree',
    );
  }

  getAccountTreeNew(): Observable<AccountTreeNode[]> {
    return this.api.get<AccountTreeNode[]>(
      '/Accounting/AccountingTransactions/AccountTreeNew',
    );
  }

  getAccountTreeList(): Observable<AccountTreeNode[]> {
    return this.api.get<AccountTreeNode[]>(
      '/Accounting/AccountingTransactions/GetAccountTreeList',
    );
  }

  searchAccountTree(searchTerm: string): Observable<AccountTreeNode[]> {
    return this.api.get<AccountTreeNode[]>(
      '/accounting/accountingtransactions/AccountTreeSearch',
      { searchterm: searchTerm },
    );
  }

  saveAccount(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/SaveAccountMaster',
      data,
    );
  }

  saveAccountHeads(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/SaveAccountHeads',
      data,
    );
  }

  checkAccountNameDuplicate(
    accountName: string,
    accountType: string,
    parentId: number,
  ): Observable<number> {
    return this.api.get<number>(
      '/Accounting/AccountingTransactions/checkAccountnameDuplicates',
      {
        Accountname: accountName,
        AccountType: accountType,
        ParentId: parentId,
      },
    );
  }

  getTwoTypeAccountHeads(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetTwotypeAccountHeads',
    );
  }

  getThreeTypeAccountHeads(parentId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetthreetypeAccountHeads',
      { parentid: parentId },
    );
  }

  getThreeTypeAccountNameCount(
    accountId: number,
    accountName: string,
  ): Observable<number> {
    return this.api.get<number>(
      '/Accounting/AccountingTransactions/Getthreetypeaccountnamecount',
      { accountid: accountId, ACCOUNTNAME: accountName },
    );
  }

  getTwoTypeTotalTransactionsCount(accountId: number): Observable<number> {
    return this.api.get<number>(
      '/Accounting/AccountingTransactions/Gettwotypetotaltransactionscount',
      { accountid: accountId },
    );
  }

  saveThreeTypeSubcategory(
    accountName: string,
    accountId: number,
  ): Observable<unknown> {
    const path =
      `/Accounting/AccountingTransactions/SavethreetypeSubcategory` +
      `?ACCOUNTNAME=${encodeURIComponent(accountName)}` +
      `&accountid=${accountId}`;
    return this.api.post(path, {});
  }

  // ---- HSN codes ----
  getHsnCodes(): Observable<HsnCodeRow[]> {
    return this.api.get<HsnCodeRow[]>(
      '/Accounting/AccountingTransactions/getHsnCodes',
    );
  }

  saveHsnCodes(data: HsnCodeRow): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/saveHsnCodes',
      data,
    );
  }

  getProductNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/getProductNames',
    );
  }

  getHsnCodeByProductName(productName: string): Observable<unknown> {
    return this.api.get(
      '/Accounting/AccountingTransactions/getHSNCodeByProductNames',
      { productName },
    );
  }

  // ---- shared lookups ----
  getGstPercentages(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/accounting/accountingtransactions/GetGstPercentages',
    );
  }

  getTdsSectionDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/accounting/accountingtransactions/getTdsSectionNo',
    );
  }

  getTdsSectionsById(section: string): Observable<unknown> {
    return this.api.get(
      '/accounting/accountingtransactions/getTdsectionsbyid',
      { section },
    );
  }

  getTdsections(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/accounting/accountingtransactions/getTdsections',
    );
  }

  getCompanyCodes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetUsersCompanyCodes',
    );
  }

  getBranchCodes(args: {
    companyName: string;
    loginBranch: string;
    loginCompanyName: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetUsersBranchCodes',
      {
        company_name: args.companyName,
        login_branch: args.loginBranch,
        login_company_name: args.loginCompanyName,
      },
    );
  }
}
