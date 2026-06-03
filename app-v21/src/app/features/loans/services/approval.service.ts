import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type ApprovalViewType = 'PENDING' | 'APPROVED' | 'REJECTED' | string;

export interface ApprovalRow {
  pApplicationid: number;
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pSchemeName?: string;
  pLoanAmount?: number;
  pApprovedAmount?: number;
  pStatus?: string;
  [key: string]: unknown;
}

/**
 * Replaces 43-LOC legacy `ApprovalService`. Same endpoints, transport
 * via `ApiClient`.
 */
@Injectable({ providedIn: 'root' })
export class ApprovalService {
  private readonly api = inject(ApiClient);

  getApprovalsByStatus(viewType: ApprovalViewType): Observable<ApprovalRow[]> {
    return this.api.get<ApprovalRow[]>(
      '/loans/Transactions/Approval/ViewApplications',
      { Viewtype: viewType },
    );
  }

  getApprovalById(applicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Approval/ViewApplicationsbyid',
      { applicationid: applicationId },
    );
  }

  saveApproval(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Approval/Saveapprovedapplications',
      data,
    );
  }

  getLoanWiseCharges(args: {
    loanName: string;
    amount: number;
    tenor: number;
    applicantType: string;
    loanPayIn: string;
    transDate: string;
    schemeId: number;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Approval/GetLoanwisecharges',
      {
        Loanname: args.loanName,
        Amount: args.amount,
        tenor: args.tenor,
        applicanttype: args.applicantType,
        Loanpayin: args.loanPayIn,
        tranddate: args.transDate,
        schemeid: args.schemeId,
      },
    );
  }

  getSavingDetails(applicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Approval/GetSavingdetails',
      { Applicationid: applicationId },
    );
  }

  getExistingLoanDetails(applicationId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Approval/GetExstingloandetails',
      { Applicationid: applicationId },
    );
  }
}
