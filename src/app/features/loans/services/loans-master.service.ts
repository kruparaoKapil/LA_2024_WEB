import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface LoanMasterRow {
  pLoanid: number;
  pLoanName: string;
  pLoanCode?: string;
  pLoanTypeName?: string;
  pInterestRateType?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

/**
 * Trim version of the legacy 358-LOC `LoansmasterService`. The legacy
 * service mixed remote API calls with cross-tab state-bag plumbing for
 * the multi-tab Loan Creation form. Here we keep only the API surface;
 * tab state is kept inside the (Phase 7B) LoanCreation component using
 * signals.
 */
@Injectable({ providedIn: 'root' })
export class LoansMasterService {
  private readonly api = inject(ApiClient);

  readonly editingRow = signal<LoanMasterRow | null>(null);
  readonly buttonClickType = signal<'Save' | 'Update' | 'Delete' | ''>('');

  list(): Observable<LoanMasterRow[]> {
    return this.api.get<LoanMasterRow[]>(
      '/loans/masters/loanmaster/getLoanMasterDetailsgrid',
    );
  }

  getLoanTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/loans/masters/loanmaster/getLoanTypes');
  }

  getLoanNames(loanTypeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/loans/masters/loanmaster/getLoanNames', {
      loanTypeId,
    });
  }

  getLoanPayins(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/loans/masters/loanmaster/getLoanpayins');
  }

  getLoanInterestRateTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/loanmaster/getLoanInterestratetypes',
    );
  }

  getApplicantTypes(contactType: string, loanId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/getApplicanttypes', {
      contacttype: contactType,
      loanid: loanId,
    });
  }

  getLoanForEdit(loanId: number): Observable<unknown> {
    return this.api.get('/loans/masters/loanmaster/getLoanMasterDetails', {
      Loanid: loanId,
    });
  }

  save(data: LoanMasterRow): Observable<unknown> {
    return this.api.post('/loans/masters/loanmaster/saveLoanMaster', data);
  }

  update(data: LoanMasterRow): Observable<unknown> {
    return this.api.post('/loans/masters/loanmaster/updateLoanMaster', data);
  }

  delete(loanId: number, modifiedBy: number): Observable<unknown> {
    return this.api.post('/loans/masters/loanmaster/DeleteLoanMaster', {
      pLoanid: loanId,
      pModifiedby: modifiedBy,
    });
  }

  checkDuplicate(
    loanName: string,
    loanCode: string,
    checkParamType: 'Name' | 'Code',
    loanId: number,
  ): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/loanmaster/checkInsertLoanNameandCodeDuplicates',
      { loanname: loanName, loancode: loanCode, checkparamtype: checkParamType, loanid: loanId },
    );
  }

  getCompanyBranchDetails(): Observable<unknown> {
    return this.api.get('/Settings/getCompanyandbranchdetails');
  }

  getGstPercentages(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/accounting/accountingtransactions/GetGstPercentages',
    );
  }

  getLoanNamesForReceipt(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/loans/Transactions/Receipts/GetLoannames');
  }
}
