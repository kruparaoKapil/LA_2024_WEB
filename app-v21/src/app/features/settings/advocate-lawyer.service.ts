import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface AdvocateLawyerRow {
  pAdvocateID: number;
  pName: string;
  pCode?: string;
  pPhone?: string;
  pEmail?: string;
  pSpecialization?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

/**
 * Replaces the empty legacy stub `Services/Settings/advocate-lawyer.service.ts`
 * with a real service so the master CRUD screens can ship.
 */
@Injectable({ providedIn: 'root' })
export class AdvocateLawyerService {
  private readonly api = inject(ApiClient);

  list(): Observable<AdvocateLawyerRow[]> {
    return this.api.get<AdvocateLawyerRow[]>(
      '/Settings/AdvocateLawyer/GetAdvocateLawyerView',
    );
  }

  getById(id: number): Observable<AdvocateLawyerRow> {
    return this.api.get<AdvocateLawyerRow>(
      '/Settings/AdvocateLawyer/GetAdvocateLawyerOnId',
      { id },
    );
  }

  save(data: AdvocateLawyerRow): Observable<unknown> {
    return this.api.post('/Settings/AdvocateLawyer/SaveAdvocateLawyer', data);
  }

  update(data: AdvocateLawyerRow): Observable<unknown> {
    return this.api.post('/Settings/AdvocateLawyer/UpdateAdvocateLawyer', data);
  }

  delete(id: number): Observable<unknown> {
    return this.api.post(
      `/Settings/AdvocateLawyer/DeleteAdvocateLawyer?id=${id}`,
      '',
    );
  }
}
