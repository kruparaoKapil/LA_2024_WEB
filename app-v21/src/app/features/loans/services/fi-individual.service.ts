import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface FIApplicationRow {
  pApplicationid: number;
  pVchapplicationid: string;
  pContactName?: string;
  pContactReferenceId?: string;
  pLoanName?: string;
  pSchemeName?: string;
  pLoanAmount?: number;
  pStatus?: string;
  [key: string]: unknown;
}

export interface FITabSection {
  pTabsectionid: string;
  pTabsectionname: string;
  pSortOrder?: number;
  [key: string]: unknown;
}

/**
 * FI-Individual API surface (legacy 543-LOC `FIIndividualService`).
 *
 * Cross-tab data sharing that lived on the service as `Subject`s and
 * plain fields (`FiTab1Details`, `FITabFdRdDetailsData`,
 * `getApplicantandOthersData`, `CoApplicantList`) becomes signals here so
 * the multi-tab FIIndividual shell can react via `effect()`/`computed()`.
 */
@Injectable({ providedIn: 'root' })
export class FIIndividualService {
  private readonly api = inject(ApiClient);

  // ---- cross-tab signal state ----
  readonly currentTabId = signal<string>('');
  readonly currentTabName = signal<string>('');
  readonly tabSections = signal<FITabSection[]>([]);
  readonly tab1Data = signal<unknown>(null);
  readonly fdRdData = signal<{ tabdata: unknown; loanType: string } | null>(null);
  readonly coApplicantList = signal<unknown[]>([]);
  readonly applicantsAndOthers = signal<unknown>(null);
  readonly kycAndCreditScore = signal<unknown>(null);

  // ---- tabs ----
  getFirstInformationTabs(): Observable<FITabSection[]> {
    return this.api.get<FITabSection[]>(
      '/loans/Transactions/Firstinformation/GetFirstInformationTabs',
    );
  }

  /** Returns next tab section after the supplied tab name. */
  computeNextTab(
    sections: FITabSection[],
    currentTabName: string,
  ): { tabId: string; tabName: string } {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].pTabsectionname === currentTabName) {
        const nxt = sections[i + 1];
        return nxt
          ? { tabId: nxt.pTabsectionid, tabName: nxt.pTabsectionname }
          : { tabId: '', tabName: '' };
      }
    }
    return { tabId: '', tabName: '' };
  }

  // ---- view list ----
  getFiView(): Observable<FIApplicationRow[]> {
    return this.api.get<FIApplicationRow[]>(
      '/loans/Transactions/Firstinformation/GetFirstInformationView',
    );
  }

  getFiUserData(applicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetAllLoandetails',
      { Applicationid: applicationId },
    );
  }

  // ---- documents lookups ----
  getDocumentGroupNames(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/documentsmaster/GetDocumentGroupNames',
    );
  }
  getDocumentNames(documentId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/ReferralAdvocate/GetDocumentProofs',
      { DocId: documentId },
    );
  }
  getIdProofTypeDetails(proofType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/documentsmaster/GetDocumentGroupNames',
      { pDocumentGroup: proofType },
    );
  }

  // ---- application personal info ----
  getEmploymentRoles(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetEmployementRoles',
    );
  }

  saveApplicationPersonalInformation(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/SaveApplicationPersonalInformation',
      data,
    );
  }

  getApplicationPersonalInformation(strApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicationPersonalInformation',
      { strapplictionid: strApplicationId },
    );
  }

  // ---- existing loans tab ----
  getApplicationExistingLoans(
    contactReferenceId: string,
    vchApplicationId: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicationExistingLoanDetails',
      {
        contactreferenceid: contactReferenceId,
        vchapplicationid: vchApplicationId,
      },
    );
  }
  saveApplicationExistingLoans(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/SaveApplicationexistingloansDetails',
      data,
    );
  }

  // ---- application tab + scheme + interest + EMI ----
  getSchemeNames(loanId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetSchemenamescodes',
      { Loanid: loanId },
    );
  }
  getInterestRates(payload: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/GetInterestRates',
      payload,
    );
  }
  getEmiSchedule(args: {
    loanamount: number;
    interesttype: string;
    loanpayin: string;
    interestrate: number;
    tenureofloan: number;
    Loaninstalmentmode: string;
    emiprincipalpayinterval: string;
    emitype: string;
  }): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetFiEmiSchesuleview',
      args as unknown as Record<string, string | number | boolean>,
    );
  }

  saveApplication(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/Saveapplication',
      data,
    );
  }

  // ---- security & collateral ----
  getSecurityCollateralDetails(
    applicationId: string,
    strApplicationId: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/getSecurityCollateralDetails',
      { applicationid: applicationId, strapplicationid: strApplicationId },
    );
  }
  saveSecurityCollateral(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/saveApplicationSecurityCollateral',
      data,
    );
  }

  // ---- KYC + credit-score tab ----
  getApplicantCreditAndKyc(
    applicationId: string,
    strApplicationId: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicantCreditandkycdetails',
      { applicationid: applicationId, strapplicationid: strApplicationId },
    );
  }
  saveKycAndIdentificationDocuments(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/Savekycandidentificationdocuments',
      data,
    );
  }

  // ---- reference data ----
  getApplicationReferenceData(
    applicationId: string,
    vchApplicationId: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetApplicationReferenceData',
      { applicationId, vchapplicationID: vchApplicationId },
    );
  }
  saveApplicationReferenceData(
    data: unknown,
    applicationId: string,
    strApplicationId: string,
  ): Observable<unknown> {
    return this.api.post(
      `/loans/Transactions/Firstinformation/SaveApplicationReferenceData?applicationid=${encodeURIComponent(
        applicationId,
      )}&strapplictionid=${encodeURIComponent(strApplicationId)}`,
      data,
    );
  }

  // ---- co-applicants & sureties ----
  getSuretyApplicants(contactType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetSurityapplicants',
      { contacttype: contactType },
    );
  }
  getCoApplicantsAndGuarantors(applicationId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/Getsurietypersondetails',
      { Applicationid: applicationId },
    );
  }
  saveApplicantsAndOthers(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/Transactions/Firstinformation/Saveapplicationsurityapplicantdetails',
      data,
    );
  }
  deleteApplicantAndOthers(args: {
    strapplictionid: string;
    strconrefid: string;
    Createdby: number;
  }): Observable<unknown> {
    const qs = new URLSearchParams(
      Object.entries(args).reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {}),
    ).toString();
    return this.api.post(
      `/loans/Transactions/Firstinformation/Deletesueritydetails?${qs}`,
      null,
    );
  }

  // ---- referral / employee / loan-type lookups ----
  getReferralAgentDetails(type: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/ReferralAdvocate/getReferralAgentDetails',
      { Type: type },
    );
  }
  getReferralDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/ReferralAdvocate/getReferralDetails',
    );
  }
  getAllEmployeeDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/Employee/GetallEmployeeDetails');
  }
  getFiLoanTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/loanmaster/getfiLoanTypes',
    );
  }
  getFiCompany(): Observable<unknown> {
    return this.api.get('/loans/Transactions/Firstinformation/GetFICompany');
  }
  getInstallmentModes(loanPayIn: string, interestType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/getLoaninstalmentmodes',
      { loanpayin: loanPayIn, interesttype: interestType },
    );
  }
  getContactTypes(loanId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/getContacttypes', {
      loanid: loanId,
    });
  }
  getLoanPayins(
    loanId: number,
    contactType: string,
    applicantType: string,
    schemeId: number,
  ): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetLoanpayin',
      {
        Loanid: loanId,
        Contacttype: contactType,
        Applicanttype: applicantType,
        schemeid: schemeId,
      },
    );
  }
  getLoanInterestTypes(args: {
    loanId: number;
    schemeId: number;
    contactType?: string;
    applicantType?: string;
    loanPayIn?: string;
  }): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetLoanInterestTypes',
      {
        Loanid: args.loanId,
        schemeid: args.schemeId,
        Contacttype: args.contactType ?? '',
        Applicanttype: args.applicantType ?? '',
        Loanpayin: args.loanPayIn ?? '',
      },
    );
  }
  getLoanMinAndMax(args: {
    loanId: number;
    contactType: string;
    applicantType: string;
    loanPayIn: string;
    interestType: string;
    schemeId: number;
  }): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetLoanMinandmaxAmounts',
      {
        Loanid: args.loanId,
        Contacttype: args.contactType,
        Applicanttype: args.applicantType,
        Loanpayin: args.loanPayIn,
        schemeid: args.schemeId,
        interesttype: args.interestType,
      },
    );
  }

  // ---- FI Member (FD/RD-as-collateral) tabs ----
  getFiMemberApplicationReferenceData(vchApplicationId: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FIMember/GetFIMemberReferenceInformation',
      { Applicationid: vchApplicationId },
    );
  }
  getFITabFdRdEditDetails(applicationId: string, loanName: string): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetFITabFdRdEditDetails',
      { Applicationid: applicationId, LoanName: loanName },
    );
  }
  getFITabFdRdEditDepositsAsLien(
    applicationId: string,
    loanName: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetFITabFdRdEditDepositsasLien',
      { Applicationid: applicationId, LoanName: loanName },
    );
  }
  getFITabFdRdEditLoanAgainstDeposit(
    applicationId: string,
    loanName: string,
  ): Observable<unknown> {
    return this.api.get(
      '/loans/Transactions/Firstinformation/GetFITabFdRdEditLoanagainstDeposit',
      { Applicationid: applicationId, LoanName: loanName },
    );
  }
}
