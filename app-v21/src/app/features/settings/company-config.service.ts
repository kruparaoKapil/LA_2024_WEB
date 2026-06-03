import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

@Injectable({ providedIn: 'root' })
export class CompanyConfigService {
  private readonly api = inject(ApiClient);

  /** Replaces legacy ad-hoc `tabname` field used to coordinate sibling tabs. */
  readonly activeTab = signal<string>('details');

  saveCompany(data: unknown): Observable<unknown> {
    return this.api.post('/Settings/Company/SaveCompanyDetails', data);
  }

  getCompanyDetails(): Observable<unknown> {
    return this.api.get('/Settings/Company/getCompanyDetails');
  }
}
