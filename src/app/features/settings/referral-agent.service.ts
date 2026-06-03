import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface ReferralAgentRow {
  pAgentID: number;
  pName: string;
  pCode?: string;
  pPhone?: string;
  pEmail?: string;
  pCommissionPercent?: number;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class ReferralAgentService {
  private readonly api = inject(ApiClient);

  list(): Observable<ReferralAgentRow[]> {
    return this.api.get<ReferralAgentRow[]>(
      '/Settings/ReferralAgent/GetReferralAgentView',
    );
  }

  getById(id: number): Observable<ReferralAgentRow> {
    return this.api.get<ReferralAgentRow>(
      '/Settings/ReferralAgent/GetReferralAgentOnId',
      { id },
    );
  }

  save(data: ReferralAgentRow): Observable<unknown> {
    return this.api.post('/Settings/ReferralAgent/SaveReferralAgent', data);
  }

  update(data: ReferralAgentRow): Observable<unknown> {
    return this.api.post('/Settings/ReferralAgent/UpdateReferralAgent', data);
  }

  delete(id: number): Observable<unknown> {
    return this.api.post(
      `/Settings/ReferralAgent/DeleteReferralAgent?id=${id}`,
      '',
    );
  }
}
