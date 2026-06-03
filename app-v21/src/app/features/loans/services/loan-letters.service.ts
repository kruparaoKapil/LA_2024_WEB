import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type LetterKind =
  | 'sanction'
  | 'disbursement'
  | 'deliveryorder'
  | 'acknowledgement';

export interface LetterRow {
  pVchapplicationid: string;
  pContactName?: string;
  pLoanName?: string;
  pVoucherno?: string;
  pStatus?: string;
  pLetterDate?: string;
  pAmount?: number;
  [key: string]: unknown;
}

export interface LetterCount {
  pPending?: number;
  pSent?: number;
  pAll?: number;
  [key: string]: unknown;
}

/**
 * Consolidates the four legacy letter services (sanction, disbursement,
 * delivery-order, acknowledgement) into a single API surface keyed by
 * `LetterKind`. Each kind hits the same endpoint shape so the UI shells
 * can drive every flavour through a single component.
 */
@Injectable({ providedIn: 'root' })
export class LoanLettersService {
  private readonly api = inject(ApiClient);

  getCount(kind: LetterKind): Observable<LetterCount | null> {
    if (kind === 'acknowledgement') {
      return this.api.get('/loans/Transactions/Firstinformation/GetAcknowledgementDetails');
    }
    const url = this.countUrlFor(kind);
    return this.api.get<LetterCount | null>(url);
  }

  list(kind: LetterKind, status: string): Observable<LetterRow[]> {
    if (kind === 'acknowledgement') {
      // Acknowledgements list = same details endpoint, status filter is client-side.
      return this.api.get<LetterRow[]>(
        '/loans/Transactions/Firstinformation/GetAcknowledgementDetails',
      );
    }
    const url = this.listUrlFor(kind);
    return this.api.get<LetterRow[]>(url, { Letterstatus: status });
  }

  getById(
    kind: LetterKind,
    applicationId: string,
    voucherNo?: string,
  ): Observable<unknown> {
    if (kind === 'acknowledgement') {
      return this.api.get(
        '/loans/Transactions/Firstinformation/GetAcknowledgementDetails',
        { strapplicationid: applicationId },
      );
    }
    const url = this.detailUrlFor(kind);
    const params: Record<string, string> = { VchapplicationID: applicationId };
    if (kind === 'disbursement' && voucherNo) params['Voucherno'] = voucherNo;
    return this.api.get(url, params);
  }

  save(kind: LetterKind, data: unknown): Observable<unknown> {
    const url = this.saveUrlFor(kind);
    return this.api.post(url, data);
  }

  // ---- url helpers ----
  private countUrlFor(kind: LetterKind): string {
    switch (kind) {
      case 'sanction':
        return '/Loans/Reports/GetSanctionLettersCount';
      case 'disbursement':
        return '/Loans/Reports/GetDisbursementLettersCount';
      case 'deliveryorder':
        return '/Loans/Reports/GetDeliveryOrdersCount';
      default:
        return '';
    }
  }

  private listUrlFor(kind: LetterKind): string {
    switch (kind) {
      case 'sanction':
        return '/Loans/Reports/GetSanctionLetterMainData';
      case 'disbursement':
        return '/Loans/Reports/GetDisbursalLetterMainData';
      case 'deliveryorder':
        return '/Loans/Reports/GetDeliveryOrderLetterMainData';
      default:
        return '';
    }
  }

  private detailUrlFor(kind: LetterKind): string {
    switch (kind) {
      case 'sanction':
        return '/Loans/Reports/GetSanctionLetterData';
      case 'disbursement':
        return '/Loans/Reports/GetDisbursalLetterData';
      case 'deliveryorder':
        return '/Loans/Reports/GetDeliveryOrderLetterData';
      default:
        return '';
    }
  }

  private saveUrlFor(kind: LetterKind): string {
    switch (kind) {
      case 'sanction':
        return '/Loans/Reports/Savesanctionletter';
      case 'disbursement':
        return '/Loans/Reports/SaveDisbursalLetter';
      case 'deliveryorder':
        return '/Loans/Reports/Savedeliveryorderletter';
      case 'acknowledgement':
        return '/loans/Transactions/Firstinformation/SaveAcknowledgementDetails';
      default:
        return '';
    }
  }
}
