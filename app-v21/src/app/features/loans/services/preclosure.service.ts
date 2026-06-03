import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';
import type { LoanType } from './scheme.service';

export interface PreclosureRow {
  pRecordid: number;
  pLoanid: number;
  pLoanName?: string;
  pPreclosureType?: string;
  pAmount?: number;
  pPercentage?: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class PreclosureService {
  private readonly api = inject(ApiClient);

  readonly editingRow = signal<PreclosureRow | null>(null);
  readonly status = signal<string>('');

  getLoanTypes(): Observable<LoanType[]> {
    return this.api.get<LoanType[]>('/loans/masters/loanmaster/getLoanTypes');
  }

  list(): Observable<PreclosureRow[]> {
    return this.api.get<PreclosureRow[]>(
      '/loans/masters/ChargesMaster/ViewPreclouserCharges',
    );
  }

  save(data: PreclosureRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/ChargesMaster/SavePreclouserCharges',
      data,
    );
  }

  update(data: PreclosureRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/ChargesMaster/UpdatePreclouserCharges',
      data,
    );
  }

  getById(recordId: number, loanId: number): Observable<unknown> {
    return this.api.get(
      '/loans/masters/ChargesMaster/GetePreclouserCharges',
      { Recordid: recordId, Loanid: loanId },
    );
  }

  delete(loanId: number, recordId: number, userId: number): Observable<unknown> {
    return this.api.post(
      `/loans/masters/ChargesMaster/DeletePreclouserCharges?Loanid=${loanId}&Recordid=${recordId}&userid=${userId}`,
      '',
    );
  }

  checkDuplicate(loanId: number): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/ChargesMaster/CheckDuplicateLoanid',
      { Loanid: loanId },
    );
  }
}
