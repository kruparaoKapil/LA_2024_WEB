import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface CountryOption {
  pCountryId: number;
  pCountryName: string;
}
export interface StateOption {
  pStateId: number;
  pStateName: string;
  pCountryId?: number;
}
export interface DistrictOption {
  pDistrictId: number;
  pDistrictName: string;
  pStateId?: number;
}

/**
 * Country / State / District lookup with simple caching.
 *
 * Replaces the legacy `ContacmasterService.getCountryDetails / getStates /
 * getDistrictDetails` and the dozens of components that re-implemented the
 * same load-on-init / cascade pattern.
 */
@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly api = inject(ApiClient);

  readonly countries = signal<CountryOption[]>([]);
  private readonly statesByCountry = new Map<number, StateOption[]>();
  private readonly districtsByState = new Map<number, DistrictOption[]>();

  async loadCountries(): Promise<CountryOption[]> {
    if (this.countries().length) return this.countries();
    const list = await firstValueFrom(
      this.api.get<CountryOption[]>('/Settings/getCountries'),
    );
    this.countries.set(list ?? []);
    return this.countries();
  }

  async getStates(countryId: number): Promise<StateOption[]> {
    if (!countryId) return [];
    if (this.statesByCountry.has(countryId)) {
      return this.statesByCountry.get(countryId)!;
    }
    const list = await firstValueFrom(
      this.api.get<StateOption[]>('/Settings/getStates', { id: countryId }),
    );
    this.statesByCountry.set(countryId, list ?? []);
    return list ?? [];
  }

  async getDistricts(stateId: number): Promise<DistrictOption[]> {
    if (!stateId) return [];
    if (this.districtsByState.has(stateId)) {
      return this.districtsByState.get(stateId)!;
    }
    const list = await firstValueFrom(
      this.api.get<DistrictOption[]>('/Settings/getDistricts', { id: stateId }),
    );
    this.districtsByState.set(stateId, list ?? []);
    return list ?? [];
  }

  /** Drop cached states/districts for one country (e.g. on selection change). */
  invalidateStatesFor(countryId: number): void {
    this.statesByCountry.delete(countryId);
  }
  invalidateDistrictsFor(stateId: number): void {
    this.districtsByState.delete(stateId);
  }
}
