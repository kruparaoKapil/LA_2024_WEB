import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface LoanType {
  pLoanTypeID: number;
  pLoanTypeName: string;
  [key: string]: unknown;
}

export interface LoanName {
  pLoanID: number;
  pLoanName: string;
  pLoanTypeID?: number;
  [key: string]: unknown;
}

export interface SchemeRow {
  pSchemeID: number;
  pSchemeName: string;
  pSchemeCode: string;
  pLoanID?: number;
  pLoanName?: string;
  pInterestRate?: number;
  pTenure?: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class SchemeService {
  private readonly api = inject(ApiClient);

  readonly editingRow = signal<SchemeRow | null>(null);
  readonly editingRecordId = signal<{ sid: number; lid: number } | null>(null);
  readonly newFormStatus = signal<string>('');

  getLoanTypes(): Observable<LoanType[]> {
    return this.api.get<LoanType[]>('/loans/masters/loanmaster/getLoanTypes');
  }

  getLoanNames(loanTypeId: number): Observable<LoanName[]> {
    return this.api.get<LoanName[]>('/loans/masters/loanmaster/getLoanNames', {
      loanTypeId,
    });
  }

  getLoanSpecificSchemes(loanId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/schememaster/getLoanspecificSchemeMasterDetails',
      { loanid: loanId },
    );
  }

  list(): Observable<SchemeRow[]> {
    // Legacy endpoint has trailing whitespace; preserve verbatim because the
    // backend route may match exactly.
    return this.api.get<SchemeRow[]>(
      '/loans/masters/schememaster/getSchemeMasterDetailsgrid',
    );
  }

  save(data: SchemeRow): Observable<unknown> {
    return this.api.post('/loans/masters/schememaster/saveSchemeMaster', data);
  }

  update(data: SchemeRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/schememaster/UpdateSchemeMaster',
      data,
    );
  }

  delete(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/schememaster/DeleteSchemeMaster',
      data,
    );
  }

  getById(schemeId: number, loanId: number): Observable<unknown> {
    return this.api.get('/loans/masters/schememaster/getSchemeMasterDetailsbyId', {
      schemeId,
      loanId,
    });
  }

  checkDuplicateName(schemeName: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/schememaster/CheckDuplicateSchemeNames',
      { Schemename: schemeName },
    );
  }

  checkDuplicateCode(schemeCode: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/schememaster/CheckDuplicateSchemeCodes',
      { schemecode: schemeCode },
    );
  }
}
