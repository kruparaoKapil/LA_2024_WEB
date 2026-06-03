import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../api/api-client.service';

/** Row from `/Settings/Branch/GetBranchLocationDetails` */
export interface BranchLocationRow {
  pbranchlocation: string;
  pbranch_id?: number;
  [key: string]: unknown;
}

/** Row from `/Settings/Branch/GetBranchNameDetails` */
export interface BranchNameRow {
  pbranch_id: number;
  pbranchname: string;
  pbranchlocation: string;
  [key: string]: unknown;
}

export interface PreLoginBranchSelection {
  pbranch_id: number;
  pbranch_name: string;
  pbranch_location: string;
}

const KEY_BRANCH = 'SetBranch';

/**
 * Pre-login branch picker APIs (legacy {@link BranchSelectionComponent}).
 * No authentication required — same endpoints as Angular 8.
 */
@Injectable({ providedIn: 'root' })
export class PreLoginBranchService {
  private readonly api = inject(ApiClient);

  getBranchLocations(): Observable<BranchLocationRow[]> {
    return this.api.get<BranchLocationRow[]>('/Settings/Branch/GetBranchLocationDetails');
  }

  getBranchNameDetails(branchLocation: string): Observable<BranchNameRow[]> {
    return this.api.get<BranchNameRow[]>('/Settings/Branch/GetBranchNameDetails', {
      branchname: branchLocation,
    });
  }

  readSelection(): PreLoginBranchSelection | null {
    const raw = sessionStorage.getItem(KEY_BRANCH) ?? localStorage.getItem(KEY_BRANCH);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PreLoginBranchSelection;
    } catch {
      return null;
    }
  }

  saveSelection(selection: PreLoginBranchSelection): void {
    const json = JSON.stringify(selection);
    sessionStorage.setItem(KEY_BRANCH, json);
    localStorage.setItem(KEY_BRANCH, json);
  }

  clearSelection(): void {
    sessionStorage.removeItem(KEY_BRANCH);
    localStorage.removeItem(KEY_BRANCH);
  }
}
