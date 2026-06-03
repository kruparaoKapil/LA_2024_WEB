import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type VoucherKind =
  | 'payment'
  | 'receipt'
  | 'journal'
  | 'tdsPayment'
  | 'gstPayment'
  | 'fundTransfer';

export interface LedgerOption {
  pledgerid: number;
  pledgername: string;
  pledgertype?: string;
  [key: string]: unknown;
}

export interface VoucherListRow {
  pVoucherId?: number;
  pVoucherNo?: string;
  pVoucherDate?: string;
  pNarration?: string;
  pTotalAmount?: number;
  pPartyName?: string;
  pStatus?: string;
  ptypeofoperation?: string;
  [key: string]: unknown;
}

export interface VoucherLine {
  pledgerid: number | null;
  pledgername: string;
  psubledgerid?: number | null;
  psubledgername?: string;
  pamount: number;
  pactualpaidamount?: number;
  pisgstapplicable?: boolean;
  pgstpercentage?: number;
  pgstamount?: number;
  pcgstamount?: number;
  psgstamount?: number;
  pigstamount?: number;
  putgstamount?: number;
  pistdsapplicable?: boolean;
  ptdsamount?: number;
  pTdsSection?: string;
  pTdsPercentage?: number;
  ppartyid?: number | null;
  ppartyname?: string;
  ppartypannumber?: string;
  ppartyreftype?: string;
  ppartyreferenceid?: number | null;
  ptypeofoperation: 'CREATE' | 'UPDATE' | 'DELETE' | 'OLD';
  [key: string]: unknown;
}

/**
 * Consolidates the legacy 389-LOC `AccountingTransactionsService` into a
 * focused voucher API. Accounts (master) endpoints live in
 * `accounting-masters.service.ts`; cheque-and-BRS endpoints live in
 * `cheques.service.ts`; this file owns:
 *
 *   Payment Voucher / TDS Payment Voucher
 *   General Receipt
 *   Journal Voucher
 *   GST Voucher / GST Payment Voucher
 *   Fund Transfer (and pending fund-transfer receipt)
 */
@Injectable({ providedIn: 'root' })
export class VoucherService {
  private readonly api = inject(ApiClient);

  // ---- list / load shared lookups ----
  getReceiptsAndPaymentsLoading(formName: string): Observable<unknown> {
    return this.api.get(
      '/accounting/accountingtransactions/GetReceiptsandPaymentsLoadingData',
      { formname: formName },
    );
  }

  getLedgerAccountList(formName: string): Observable<LedgerOption[]> {
    return this.api.get<LedgerOption[]>(
      '/Accounting/AccountingTransactions/GetLedgerAccountList',
      { formname: formName },
    );
  }

  getSubLedgerData(ledgerId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/accounting/accountingtransactions/GetSubLedgerData',
      { pledgerid: ledgerId },
    );
  }

  getBankDetailsById(bankId: number): Observable<unknown> {
    return this.api.get(
      '/accounting/accountingtransactions/GetBankDetailsbyId',
      { pbankid: bankId },
    );
  }

  getPartyDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetPartyDetails',
    );
  }

  getPartyDetailsById(partyId: number): Observable<unknown> {
    return this.api.get(
      '/accounting/accountingtransactions/getPartyDetailsbyid',
      { ppartyid: partyId },
    );
  }

  getTdsLedgerAccountHeads(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Accounting/AccountingTransactions/GetTdsLedgerAccountHeads',
    );
  }

  getTdsPartyById(partyId: number): Observable<unknown> {
    return this.api.get(
      '/accounting/accountingtransactions/getTdsPartyid',
      { ppartyid: partyId },
    );
  }

  // ---- list views ----
  getPaymentVoucherExisting(): Observable<VoucherListRow[]> {
    return this.api.get<VoucherListRow[]>(
      '/accounting/accountingtransactions/GetPaymentVoucherExistingData',
    );
  }

  getGeneralReceiptsExisting(): Observable<VoucherListRow[]> {
    return this.api.get<VoucherListRow[]>(
      '/Accounting/AccountingTransactions/GetGeneralReceiptsData',
    );
  }

  getJournalVouchers(): Observable<VoucherListRow[]> {
    return this.api.get<VoucherListRow[]>(
      '/accounting/accountingtransactions/GetJournalVoucherData',
    );
  }

  getPendingFundTransfers(loginBranchId: string): Observable<VoucherListRow[]> {
    return this.api.get<VoucherListRow[]>(
      '/Accounting/AccountingTransactions/GetPendingFundTransfers',
      { logincompanybranch: loginBranchId },
    );
  }

  // ---- save (one method per kind to keep the API discoverable) ----
  savePayment(data: unknown): Observable<unknown> {
    return this.api.post(
      '/accounting/accountingtransactions/SavePaymentVoucher',
      data,
    );
  }

  saveTdsPayment(data: unknown): Observable<unknown> {
    return this.api.post(
      '/accounting/accountingtransactions/SaveTdsPaymentVoucher',
      data,
    );
  }

  saveReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/SaveGeneralReceipt',
      data,
    );
  }

  saveJournal(data: unknown): Observable<unknown> {
    return this.api.post(
      '/accounting/accountingtransactions/SaveJournalVoucher',
      data,
    );
  }

  saveGstVoucher(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/savegstvocuher',
      data,
    );
  }

  saveGstPaymentVoucher(data: unknown): Observable<unknown> {
    // Legacy URL is missing the leading "/Accounting" path segment; we
    // preserve the verbatim path for backend parity.
    return this.api.post('/AccountingTransactions/SaveGSTPaymentVoucher', data);
  }

  saveFundTransfer(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/SaveFundTransfer',
      data,
    );
  }

  saveFundTransferReceipt(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Accounting/AccountingTransactions/SaveFundTransferReceipt',
      data,
    );
  }

  // ---- helpers ----
  saveByKind(kind: VoucherKind, data: unknown): Observable<unknown> {
    switch (kind) {
      case 'payment':
        return this.savePayment(data);
      case 'tdsPayment':
        return this.saveTdsPayment(data);
      case 'receipt':
        return this.saveReceipt(data);
      case 'journal':
        return this.saveJournal(data);
      case 'gstPayment':
        return this.saveGstPaymentVoucher(data);
      case 'fundTransfer':
        return this.saveFundTransfer(data);
    }
  }

  getInvoiceCount(invoiceNo: string): Observable<number> {
    return this.api.get<number>(
      '/Accounting/AccountingTransactions/getInvoiceCount',
      { invoiceNo },
    );
  }

  getGstVoucherDetailsById(contactId: number): Observable<unknown> {
    return this.api.get(
      '/Accounting/AccountingTransactions/getGSTVoucherDetailsByID',
      { contactId },
    );
  }
}
