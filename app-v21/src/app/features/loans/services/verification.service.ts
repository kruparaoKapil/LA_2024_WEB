import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type VerificationKind = 'Tele' | 'Document' | 'Field';

export interface VerificationRow {
  pApplicationid: number;
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pSchemeName?: string;
  pLoanAmount?: number;
  pStatus?: string;
  [key: string]: unknown;
}

/**
 * Replaces 159-LOC `VerificationService`. The legacy service stashed
 * three independent form snapshots on plain fields (`Telecerification`,
 * `Documentverification`, `Fieldverification`) for cross-tab share. We
 * keep that pattern but back it with signals so consumers can compute
 * derived state.
 */
@Injectable({ providedIn: 'root' })
export class VerificationService {
  private readonly api = inject(ApiClient);

  // ---- cross-tab signal state ----
  readonly teleSnapshot = signal<unknown>(null);
  readonly documentSnapshot = signal<unknown>(null);
  readonly fieldSnapshot = signal<unknown>(null);

  setSnapshot(kind: VerificationKind, data: unknown): void {
    if (kind === 'Tele') this.teleSnapshot.set(data);
    if (kind === 'Document') this.documentSnapshot.set(data);
    if (kind === 'Field') this.fieldSnapshot.set(data);
  }

  getSnapshot(kind: VerificationKind): unknown {
    if (kind === 'Tele') return this.teleSnapshot();
    if (kind === 'Document') return this.documentSnapshot();
    return this.fieldSnapshot();
  }

  // ---- list / detail ----
  getAllApplicantVerifications(): Observable<VerificationRow[]> {
    return this.api.get<VerificationRow[]>(
      '/loans/Transactions/Verification/GetAllApplicantVerificationDetails',
    );
  }

  getVerificationDetails(applicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Verification/GetVerificationDetails',
      { strapplicationid: applicationId },
    );
  }

  getFieldVerificationDetails(applicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Verification/GetFieldVerificationDetails',
      { strapplicationid: applicationId },
    );
  }

  getDocumentsToVerify(applicationId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetFiDocumentlDetails',
      { strapplicationid: applicationId },
    );
  }

  // ---- save ----
  saveTeleVerification(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Verification/SaveVerificationDetails',
      data,
    );
  }

  saveFieldVerification(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Verification/Savefieldverification',
      data,
    );
  }

  saveDocumentVerification(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Verification/SaveFIVerificationDetails',
      data,
    );
  }

  // ---- ancillary lookups ----
  getEmployees(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/Employee/GetallEmployeeDetails');
  }

  getEmployeeName(searchType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetSubInterducedDetails', {
      searchtype: searchType,
    });
  }
}
