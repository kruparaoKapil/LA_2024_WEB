import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type ContactType =
  | 'INDIVIDUAL'
  | 'BUSINESS'
  | 'BUSINESS ENTITY'
  | 'EMPLOYEE'
  | 'REFERRAL'
  | string;

export interface ContactRow {
  pContactID: number;
  pContactRefId: string;
  pContactName: string;
  pContacttype?: ContactType;
  pContactNo?: string;
  pEmail?: string;
  pPanNumber?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

export interface ContactPersonDetails {
  pContactID: number;
  pContactName: string;
  pContactRefId: string;
  pContactNo?: string;
  pPanNumber?: string;
  [key: string]: unknown;
}

/**
 * Replaces legacy 549-LOC `ContacmasterService` (`contactmasterNew/*`
 * endpoints). API surface is preserved verbatim — only the transport
 * (legacy `CommonService.callGetAPI / callPostAPI`) swaps to `ApiClient`.
 *
 * State stashes (`editinfo`, `status`, `contactDataOnChange`) are migrated
 * to signals.
 */
@Injectable({ providedIn: 'root' })
export class ContactMasterService {
  private readonly api = inject(ApiClient);

  // ---- signal-stashed state (replaces plain fields on legacy service) ----
  readonly editingInfo = signal<{ referenceId: string; contactType: ContactType } | null>(null);
  readonly contactStatus = signal<string>('');
  readonly contactDataOnChange = signal<unknown>(null);

  // ---- contact CRUD ----
  saveContact(data: unknown, isUpdate: boolean): Observable<unknown> {
    const path = isUpdate
      ? '/loans/masters/contactmasterNew/UpdateContact'
      : '/loans/masters/contactmasterNew/Savecontact';
    return this.api.post(path, data);
  }

  deleteContact(data: unknown): Observable<unknown> {
    return this.api.post('/loans/masters/contactmasterNew/DeleteContact', data);
  }

  checkContactExists(data: unknown): Observable<number> {
    return this.api.post<number>(
      '/loans/masters/contactmasterNew/GetPersonCount',
      data,
    );
  }

  getContactTotalDetails(type: ContactType): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetContactDetails',
      { Type: type },
    );
  }

  getContactsByName(viewName: string): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetcontactviewByName',
      { ViewName: viewName },
    );
  }

  getContactsByNamePaged(
    viewName: string,
    endIndex: number,
    searchBy: string,
  ): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetcontactviewByName',
      { ViewName: viewName, endindex: endIndex, searchby: searchBy },
    );
  }

  getContactCount(viewName: string, searchBy: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/GetContactCount',
      { ViewName: viewName, searchby: searchBy },
    );
  }

  getContactById(referenceId: string): Observable<unknown> {
    return this.api.get('/loans/masters/contactmasterNew/ViewContact', {
      refernceid: referenceId,
    });
  }

  getContactDetailsByRefId(referenceId: string): Observable<unknown> {
    return this.api.get('/loans/masters/contactmasterNew/GetContactViewbyid', {
      refid: referenceId,
    });
  }

  getContactsList(): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetContactsList',
    );
  }

  getContactPanList(): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetNousepanContactView',
    );
  }

  // ---- ancillary lookups ----
  getTitleDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Settings/getContacttitles');
  }
  getDesignations(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/GetDesignations',
    );
  }
  getEnterpriseTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/GetEnterpriseType',
    );
  }
  getBusinessTypes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/GetBusinessTypes',
    );
  }
  getQualifications(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/ViewQualificationDetails',
    );
  }
  getRelationships(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmaster/getRelationShip',
    );
  }
  getIntroducerDetails(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/GetInterducedDetails',
    );
  }
  getDocumentProofs(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/Banking/GetDocumentTypes');
  }

  // ---- enterprise type / business type / address type CRUD ----
  saveAddressType(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveAddressType',
      data,
    );
  }
  saveEnterpriseType(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveEnterpriseType',
      data,
    );
  }
  saveBusinessType(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveBusinessTypes',
      data,
    );
  }

  checkEnterpriseTypeDuplicate(enterpriseType: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/checkInsertEnterpriseTypeDuplicates',
      { enterprisetype: enterpriseType },
    );
  }
  checkBusinessTypeDuplicate(businessType: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/checkInsertBusinessTypesDuplicates',
      { businesstype: businessType },
    );
  }
  checkAddressTypeDuplicate(
    addressType: string,
    contactType: string,
  ): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/checkInsertAddressTypeDuplicates',
      { addresstype: addressType, contactype: contactType },
    );
  }

  getAddressTypes(contactType: ContactType): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/masters/contactmasterNew/GetAddressType',
      { contactype: contactType },
    );
  }

  // ---- contact-data overview pulls ----
  getContactPersonDetails(refId: string): Observable<ContactPersonDetails> {
    return this.api.get<ContactPersonDetails>(
      '/Settings/Users/ContactData/GetContactData',
      { ContactRefID: refId },
    );
  }
  getContactDataDetails(loadDataType: string, refId: string): Observable<unknown> {
    return this.api.get('/Settings/Users/ContactData/GetContactDataDetails', {
      loaddataType: loadDataType,
      ContactRefID: refId,
    });
  }
  getContactPersonLoans(refId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/Users/ContactData/GetLoansByContactRefId',
      { contactRefId: refId },
    );
  }
  getContactPersonGuarantors(refId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/Users/ContactData/GetGurantorsLoansByContactRefId',
      { contactRefId: refId },
    );
  }
  getContactPersonCoApplicants(refId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/Users/ContactData/GetCoApplicantsLoansByContactRefId',
      { contactRefId: refId },
    );
  }
  getContactPersonTransactions(loanId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Receipts/GetTransactions',
      { loanid: loanId },
    );
  }

  // ---- KYC / PAN ----
  checkDuplicateKyc(docName: string, docNumber: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmaster/DuplicateKYCTesting',
      { docname: docName, docnumber: docNumber },
    );
  }
  savePanDetails(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/savePandocumentstore',
      data,
    );
  }
  checkPanDuplicate(panNo: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/duplicatornotpancard',
      { PANNO: panNo },
    );
  }

  // ---- referral / employee / supplier ----
  saveReferralDetails(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveContactReferral',
      data,
    );
  }
  getReferralContact(referenceId: string): Observable<unknown> {
    return this.api.get(
      '/loans/masters/contactmasterNew/ViewReferralContactDetails',
      { refernceid: referenceId },
    );
  }
  saveEmployeeDetails(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveContactEmployee',
      data,
    );
  }
  getEmployeeContact(referenceId: string): Observable<unknown> {
    return this.api.get(
      '/loans/masters/contactmasterNew/ViewEmployeeContactDetails',
      { refernceid: referenceId },
    );
  }
  saveSupplier(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/SaveContactSupplier',
      data,
    );
  }
  getEmployeeContacts(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/HRMS/GetEmployeeContacts');
  }

  // ---- global contact (cross-DB) ----
  getContactGlobalWith(searchByValue: string): Observable<ContactRow[]> {
    return this.api.get<ContactRow[]>(
      '/loans/masters/contactmasterNew/GetContactGlobal',
      { searchbyvalue: searchByValue },
    );
  }
  getPersonGlobalCount(referenceId: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/contactmasterNew/GetPersonGlobalCount',
      { referenceid: referenceId },
    );
  }
  viewContactGlobal(referenceId: string): Observable<unknown> {
    return this.api.get(
      '/loans/masters/contactmasterNew/ViewContactGlobal',
      { refernceid: referenceId },
    );
  }
}
