import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface DisbursementRow {
  pApplicationid: number;
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pApprovedAmount?: number;
  pDisbursedAmount?: number;
  pStatus?: string;
  [key: string]: unknown;
}

/**
 * Replaces 44-LOC legacy `DisbusementService` (note the legacy spelling).
 */
@Injectable({ providedIn: 'root' })
export class DisbursementService {
  private readonly api = inject(ApiClient);

  getDisbursementView(): Observable<DisbursementRow[]> {
    return this.api.get<DisbursementRow[]>(
      '/loans/Transactions/Disbursement/GetDisbursementViewData',
    );
  }

  getApprovedById(vchApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Disbursement/GetApprovedApplicationsByID',
      { vchapplicationid: vchApplicationId },
    );
  }

  saveDisbursement(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Disbursement/SaveLoanDisbursement',
      data,
    );
  }

  getEmiChartReport(vchApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Disbursement/GetEmiChartReport',
      { vchapplicationid: vchApplicationId },
    );
  }

  getEmiChartView(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Disbursement/GetEmiChartView',
    );
  }

  getBrokenDaysAndAmount(args: {
    disbursementMode: string;
    vchApplicationId: string;
    emiDay: number;
    approvedLoanAmount: number;
    disbursableAmount: number;
    interestRate: number;
    tenure: number;
    disburseDate: string;
    firstInstallmentDate: string;
    disbursementStatus: string;
    loanPayIn: string;
  }): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Disbursement/GetBrowkenDaysandAmount',
      {
        disbursementmode: args.disbursementMode,
        applicationid: args.vchApplicationId,
        emiday: args.emiDay,
        loanamount: args.approvedLoanAmount,
        disburseamount: args.disbursableAmount,
        intrestrate: args.interestRate,
        tenure: args.tenure,
        disbursedate: args.disburseDate,
        firstinstallmentdate: args.firstInstallmentDate,
        disbursementstatus: args.disbursementStatus,
        ploanpayin: args.loanPayIn,
      },
    );
  }

  getAdvanceEmiAmount(args: {
    disburseAmount: number;
    interestRate: number;
    tenure: number;
    emiType: string;
  }): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Disbursement/GetAdvanceEMIAmount',
      {
        disburseamount: args.disburseAmount,
        intrestrate: args.interestRate,
        tenure: args.tenure,
        emitype: args.emiType,
      },
    );
  }
}
