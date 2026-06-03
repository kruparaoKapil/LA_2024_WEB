import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface BranchRow {
  pBranchID: number;
  pBranchName: string;
  pBranchCode: string;
  pAddress1?: string;
  pAddress2?: string;
  pcity?: string;
  pCountry?: string;
  pState?: string;
  pDistrict?: string;
  pPincode?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class BranchConfigService {
  private readonly api = inject(ApiClient);

  getBranchDetails(): Observable<BranchRow[]> {
    return this.api.get<BranchRow[]>('/Settings/Branch/getBranchDetails');
  }

  getAddressTypes(contactType = 'BUSINESS ENTITY'): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmaster/GetAddressType',
      { contactype: contactType },
    );
  }

  checkBranchNameDuplicates(
    branchname: string,
    branchcode: string,
    branchid: number,
  ): Observable<number> {
    return this.api.get<number>('/Settings/Branch/checkbranchnameDuplicates', {
      branchname,
      branchcode,
      branchid,
    });
  }

  saveBranch(data: BranchRow): Observable<unknown> {
    return this.api.post('/Settings/Branch/SaveBranchDetails', data);
  }
}
