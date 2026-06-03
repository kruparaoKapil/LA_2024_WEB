import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface VehicleModel {
  modeltype: string;
}

/**
 * Loan-type-specific dispatch (gold / personal / property / vehicle /
 * consumable). Each loan template has its own save endpoint; this
 * service routes to the right one based on the loan type chosen on the
 * Application tab.
 */
@Injectable({ providedIn: 'root' })
export class FIIndividualLoanSpecificService {
  private readonly api = inject(ApiClient);

  // Static catalog migrated verbatim from the legacy service.
  readonly vehicleModels: readonly VehicleModel[] = [
    'Aircraft',
    'APRILIA',
    'ASHOK LEYLAND',
    'AUDI INDIA',
    'BAJAJ AUTO LTD',
    'BENELLI',
    'BMW INDIA',
    'CHINKARA MOTORS',
    'FORCE MOTORS',
    'FORD INDIA',
    'HERO ELECTRIC',
    'HERO MOTOCORP LTD',
    'Heavy Motor Vehicle',
    'HINDUSTAN MOTORS',
    'HONDA CARS INDIA',
    'HONDA MOTORCYCLE & SCOOTER INDIA (PVT) LTD',
    'HYOSUNG',
    'HYUNDAI MOTOR INDIA',
    'INDIA YAMAHA MOTOR PVT LTD',
    'ISUZU MOTORS INDIA',
    'JAWA',
    'JEEP INDIA',
    'KIA MOTORS INDIA',
    'KTM',
    'MAHINDRA & MAHINDRA',
    'MAHINDRA TWO WHEELERS LTD',
    'MARUTI SUZUKI',
    'MERCEDES-BENZ INDIA',
    'MG MOTOR INDIA',
    'NISSAN MOTOR INDIA',
    'PIAGGIO VEHICLES PVT LTD',
    'PORSCHE INDIA',
    'PREMIER',
    'RENAULT INDIA',
    'REVA',
    'ROYAL ENFIELD',
    'SKODA INDIA',
    'SUZUKI MOTORCYCLE INDIA PVT LTD',
    'TARA INTERNATIONAL',
    'TATA MOTORS',
    'TOYOTA KIRLOSKAR MOTOR',
    'TVS MOTOR COMPANY LTD',
    'UM LOHIA TWO WHEELERS PVT LTD',
    'VOLKSWAGEN INDIA',
    'Watercraft',
  ].map((name) => ({ modeltype: name }));

  getGoldLoanTypes(goldArticleTypeId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/ChargesMaster/GetLoanWiseChargesName',
      { loanid: goldArticleTypeId },
    );
  }

  saveLoanSpecificDetails(payload: {
    pApplicationid: number;
    pVchapplicationid: string;
    [key: string]: unknown;
  }): Observable<unknown> {
    const qs = new URLSearchParams({
      applicationid: String(payload.pApplicationid),
      strapplictionid: payload.pVchapplicationid,
    }).toString();
    return this.api.post(
      `/loans/Transactions/Firstinformation/SaveLoanSpecificDetails?${qs}`,
      payload,
    );
  }

  savePersonalLoanDetails(payload: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/saveApplicatntPersonalLoan',
      payload,
    );
  }

  saveLoanAgainstPropertyDetails(payload: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/saveApplicationLoanAgainstpropertyLoanspecificfiels',
      payload,
    );
  }

  getApplicationIdsByLoanType(loanType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetApplicationIds',
      { LoanType: loanType },
    );
  }

  getApplicantLoanSpecificDetails(strApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicantLoanSpecificDetails',
      { strapplictionid: strApplicationId },
    );
  }

  getPersonalLoanEighthTabData(strApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicationPersonalLoanInformation',
      { strapplictionid: strApplicationId },
    );
  }

  getConsumableProductTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetConsumableproductTypes',
    );
  }

  saveConsumableProductTypes(payload: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/SaveConsumableproductTypes',
      payload,
    );
  }
}
