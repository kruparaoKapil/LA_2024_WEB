import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface ChargeRow {
  pChargeID: number;
  pChargeName: string;
  pChargeType?: string;
  pAmount?: number;
  pPercentage?: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

export interface LoanWiseChargeRow {
  pLoanChargeID: number;
  pLoanID: number;
  pChargeID: number;
  pChargeName?: string;
  pAmount?: number;
  pApplicantType?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class ChargesService {
  private readonly api = inject(ApiClient);

  /** Replaces legacy `editinfo` and `ButtonType` plain-field stash. */
  readonly editingRow = signal<ChargeRow | null>(null);
  readonly buttonType = signal<'Add' | 'Update' | 'Delete' | ''>('');

  // ---- Charges Master ----
  getChargeNames(chargeStatus: string): Observable<ChargeRow[]> {
    return this.api.get<ChargeRow[]>(
      '/loans/masters/ChargesMaster/GetChargesName',
      { chargeStatus },
    );
  }

  saveChargesName(data: ChargeRow): Observable<unknown> {
    return this.api.post('/loans/masters/ChargesMaster/SaveChargesName', data);
  }

  updateChargesName(data: ChargeRow): Observable<unknown> {
    return this.api.post('/loans/masters/ChargesMaster/UpdateChargeName', data);
  }

  deleteChargesName(data: ChargeRow): Observable<unknown> {
    return this.api.post('/loans/masters/ChargesMaster/DeleteChargesName', data);
  }

  checkChargeNameDuplicates(
    chargeName: string,
    chargeId: number,
  ): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/ChargesMaster/CheckDuplicateChargeNames',
      { ChargeName: chargeName, chargeid: chargeId },
    );
  }

  // ---- Loan-wise charges (used by Loan Master + Receipts) ----
  getLoanChargeTypes(loanId: number): Observable<LoanWiseChargeRow[]> {
    return this.api.get<LoanWiseChargeRow[]>(
      '/loans/masters/ChargesMaster/GetLoanWiseChargesName',
      { loanid: loanId },
    );
  }

  getLoanChargeConfig(loanChargeId: number): Observable<unknown> {
    return this.api.get('/loans/masters/ChargesMaster/GetLoanWiseChargeConfig', {
      loanChargeid: loanChargeId,
    });
  }

  saveLoanChargeTypes(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/ChargesMaster/SaveLoanWiseChargesName',
      data,
    );
  }

  saveLoanChargeConfig(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/ChargesMaster/UpdateLoanWiseChargeConfig',
      data,
    );
  }

  deleteLoanChargeType(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/ChargesMaster/DeleteLoanWiseChargeConfig',
      data,
    );
  }

  getApplicantTypes(loanId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/ChargesMaster/GetLoanWiseApplicantTypes',
      { loanid: loanId },
    );
  }

  getLoanPayins(loanId: number, applicantType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/ChargesMaster/GetLoanWiseLoanpayin',
      { loanid: loanId, applicanttype: applicantType },
    );
  }

  checkLoanChargeTypes(chargeId: number, loanId: number): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/ChargesMaster/CheckDuplicateChargeNamesByLoanid',
      { loanid: loanId, ChargeName: chargeId },
    );
  }

  /** Used by loan receipt screens to compute charge amount. */
  getChargesAmount(
    loanId: number,
    chargeName: string,
    amount: number,
  ): Observable<unknown> {
    return this.api.get('/loans/Transactions/Receipts/GetChargeAmount', {
      Loanid: loanId,
      ChargeName: chargeName,
      Amount: amount,
    });
  }
}
