import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface GenerateIdRow {
  pTransactionID?: number;
  pFormName: string;
  pModeOfTransaction: string;
  pTransactionCode: string;
  pPrefix?: string;
  pSuffix?: string;
  pStartFrom?: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class GenerateIdService {
  private readonly api = inject(ApiClient);

  getFormNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/GetFormnames');
  }

  getModeOfTransaction(formName: string): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/GetModeofTransaction', {
      Formname: formName,
    });
  }

  checkTransactionCodeExist(transactionCode: string): Observable<number> {
    return this.api.get<number>('/Settings/checkTransactionCodeExist', {
      TransactionCode: transactionCode,
    });
  }

  save(data: GenerateIdRow): Observable<unknown> {
    return this.api.post('/Settings/SaveGenerateIdMaster', data);
  }

  list(): Observable<GenerateIdRow[]> {
    return this.api.get<GenerateIdRow[]>('/Settings/GetGenerateidmasterList');
  }
}
