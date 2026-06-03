import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type DepositKind = 'fd' | 'rd';

export interface DepositAccountRow {
  pAccountId?: number;
  pAccountNo?: string;
  pMemberCode?: string;
  pMemberName?: string;
  pSchemeName?: string;
  pDepositAmount?: number;
  pTenure?: number;
  pTenureMode?: string;
  pInterestRate?: number;
  pMaturityAmount?: number;
  pMaturityDate?: string;
  pStatus?: string;
  [key: string]: unknown;
}

export interface SchemeOption {
  pSchemeid?: number;
  pSchemecode?: string;
  pSchemename?: string;
  [key: string]: unknown;
}

export interface BondPreviewRow {
  pAccountNo: string;
  pMemberName: string;
  pSchemeName: string;
  pDepositAmount: number;
  pInterestRate: number;
  pMaturityAmount: number;
  pIssueDate: string;
  pMaturityDate: string;
  [key: string]: unknown;
}

/**
 * Replaces the legacy 302-LOC `FdRdTransactionsService` plus the
 * 365-LOC `RdTransactionsService` and the 185-LOC
 * `MaturityPaymentService`. All three were 70%+ duplicated since FD
 * and RD share the same scheme + tenure + maturity workflow.
 *
 * Drives the consolidated deposit account creation, maturity, and
 * interest-payment shells.
 */
@Injectable({ providedIn: 'root' })
export class DepositsService {
  private readonly api = inject(ApiClient);

  // ---- cross-screen state (replaces legacy mutable fields) ----
  readonly editingDeposit = signal<{
    accountId: number;
    accountNo: string;
    kind: DepositKind;
  } | null>(null);
  readonly nomineeDetails = signal<unknown[]>([]);
  readonly jointMembers = signal<unknown[]>([]);
  readonly newFormStatus = signal<string>('');

  // ---- list views ----
  listFdAccounts(): Observable<DepositAccountRow[]> {
    return this.api.get<DepositAccountRow[]>('/Banking/GetFdTransactionData');
  }

  listMembers(contactType: string, memberType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetallFDMembers', {
      ContactType: contactType,
      MemberType: memberType,
    });
  }

  // ---- scheme cascade ----
  getFdSchemes(applicantType: string, memberType: string): Observable<SchemeOption[]> {
    return this.api.get<SchemeOption[]>('/Banking/GetFdSchemes', {
      ApplicantType: applicantType,
      MemberType: memberType,
    });
  }

  getTenureModes(args: {
    fdName: string;
    applicantType: string;
    memberType: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetFdSchemeTenureModes', {
      Fdname: args.fdName,
      ApplicantType: args.applicantType,
      MemberType: args.memberType,
    });
  }

  getTenures(args: {
    fdName: string;
    fdConfigId: number;
    tenureMode: string;
    memberType: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetFdTenuresofTable', {
      FDName: args.fdName,
      FdconfigId: args.fdConfigId,
      TenureMode: args.tenureMode,
      MemberType: args.memberType,
    });
  }

  getDepositAmounts(args: {
    fdName: string;
    fdConfigId: number;
    tenureMode: string;
    tenure: number;
    memberType: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetFdDepositamountsofTable', {
      FDName: args.fdName,
      FdconfigId: args.fdConfigId,
      TenureMode: args.tenureMode,
      Tenure: args.tenure,
      MemberType: args.memberType,
    });
  }

  getInterestRates(args: {
    fdName: string;
    fdConfigId: number;
    tenureMode: string;
    tenure: number;
    depositAmount: number;
    memberType: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/InterestamountsofTable', {
      FDName: args.fdName,
      FdconfigId: args.fdConfigId,
      TenureMode: args.tenureMode,
      Tenure: args.tenure,
      Depositamount: args.depositAmount,
      MemberType: args.memberType,
    });
  }

  getMaturityAmount(args: {
    interestMode: string;
    interestTenure: number;
    depositAmount: number;
    interestPayout: string;
    interestType: string;
    interestRate: number;
    calType: string;
  }): Observable<unknown> {
    return this.api.get('/Banking/GetMaturityamount', {
      pInterestMode: args.interestMode,
      pInterestTenure: args.interestTenure,
      pDepositAmount: args.depositAmount,
      pInterestPayOut: args.interestPayout,
      pCompoundorSimpleInterestType: args.interestType,
      pInterestRate: args.interestRate,
      pCalType: args.calType,
    });
  }

  // ---- save / edit ----
  saveMemberAndScheme(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/SaveFDMemberandSchemeData', data);
  }

  saveJointMember(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/SaveFDJointMembersandNomineeData', data);
  }

  saveReferral(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/SaveFDReferralData', data);
  }

  deleteFdAccount(accountNo: string, createdBy: number): Observable<unknown> {
    const path =
      `/Banking/DeleteFdTransactions` +
      `?FdAccountNo=${encodeURIComponent(accountNo)}` +
      `&pCreatedby=${createdBy}`;
    return this.api.post(path, {});
  }

  getDepositForEdit(args: {
    accountNo: string;
    accountId: number;
  }): Observable<unknown> {
    return this.api.get('/Banking/GetFdTransactionDetailsforEdit', {
      FdAccountNo: args.accountNo,
      FdAccountId: args.accountId,
      accounttype: 'FD Transaction',
    });
  }

  getMemberNomineeDetails(memberCode: string): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetFDMemberNomineeDetails', {
      MemberCode: memberCode,
    });
  }

  // ---- branches ----
  getBranches(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetchitBranchDetails');
  }

  getGlobalBranches(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetGlobalBranches',
    );
  }

  // ---- bond preview ----
  getBondPreviewList(date?: string): Observable<BondPreviewRow[]> {
    return this.api.get<BondPreviewRow[]>(
      '/Banking/Transactions/BondsPreview/GetBondsDetails',
      date ? { date } : undefined,
    );
  }

  getBondPreviewReport(fdAccountNos: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/BondsPreview/GetBondsPreviewDetails',
      { fdaccountnos: fdAccountNos },
    );
  }

  saveBondPreview(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/BondsPreview/SaveBondsPrint',
      data,
    );
  }

  // ---- transfer ----
  getTransferSchemes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/Transactions/GetFdSchemes');
  }

  getFromAccounts(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/Transactions/GetFdFromDetails');
  }

  getToAccounts(branchName: string, memberCode: string): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/Transactions/GetFdToDetails', {
      BranchName: branchName,
      Membercode: memberCode,
    });
  }

  saveTransfer(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/Transactions/SaveFdTransfer', data);
  }

  // ---- maturity / pre-maturity / interest payment ----
  getMaturityBranches(maturityType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetMaturityBranchDetails',
      { MaturityType: maturityType },
    );
  }

  getMaturitySchemes(branchName: string, maturityType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetSchemeType',
      { BranchName: branchName, MaturityType: maturityType },
    );
  }

  getMaturityMembers(paymentType: string, depositType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetMaturityMembers',
      { PaymentType: paymentType, Depositype: depositType },
    );
  }

  getMaturityFdDetails(args: {
    paymentType: string;
    memberId: number;
    date: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetMaturityFdDetails',
      {
        PaymentType: args.paymentType,
        Memberid: args.memberId,
        Date: args.date,
      },
    );
  }

  getPreMaturityDetails(args: {
    fdAccountNo: string;
    date: string;
    type: string;
  }): Observable<unknown> {
    return this.api.get(
      '/Banking/Transactions/MaturityPayment/GetPreMaturityDetails',
      {
        FDAccountno: args.fdAccountNo,
        Date: args.date,
        type: args.type,
      },
    );
  }

  getMaturityPaymentView(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetMaturityPaymentView',
    );
  }

  getMaturityRenewalView(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetMaturityRenewaltView',
    );
  }

  saveMaturityPayment(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/MaturityPayment/SaveMaturityPayment',
      data,
    );
  }

  saveMaturityRenewal(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/MaturityPayment/SaveMaturityRenewal',
      data,
    );
  }

  saveMaturityBond(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/MaturityPayment/SaveMaturitybond',
      data,
    );
  }

  saveDelayInterest(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/DelayInterest/SaveDelayInterest',
      data,
    );
  }

  getInterestPaymentDetails(
    fromDate: string,
    toDate: string,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/IntrestPayment/GetInterestpaymentdetails',
      { fromdate: fromDate, todate: toDate },
    );
  }

  // ---- lien release ----
  getLienDetails(fdAccountNo: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/MaturityPayment/GetLienDetails',
      { FdAccountNo: fdAccountNo },
    );
  }

  // ---- shared lookups ----
  getSchemeNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Masters/SelfAdjustment/GetSchemeType',
    );
  }
}
