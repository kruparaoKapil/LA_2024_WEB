import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface TdsReportRow {
  [key: string]: unknown;
}

export interface PanContactRow {
  pContactID?: number;
  pContactName: string;
  pContactreferenceid?: string;
  pContactNumber?: string;
  [key: string]: unknown;
}

/**
 * Consolidates legacy `TdsreportService` (91 LOC) plus TDS-related
 * endpoints that lived in the 2800+ LOC `CommonService` (Form 15-H,
 * PAN validation, PAN update). PDF generation is handled by
 * `<app-data-grid>` export, not inline jsPDF.
 */
@Injectable({ providedIn: 'root' })
export class TdsService {
  private readonly api = inject(ApiClient);

  // ---- sections ----
  getTdsSections(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/TDS/GetTdsSectionss');
  }

  getChallanaSections(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/TDS/Challana/GetTdssectiondetails');
  }

  // ---- TDS report ----
  getTdsReport(
    fromDate: string,
    toDate: string,
    sectionName: string,
  ): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/GetTdsReportDetails',
      { FromDate: fromDate, ToDate: toDate, SectionName: sectionName },
    );
  }

  getSectionWiseReport(
    fromDate: string,
    toDate: string,
    sectionName: string,
  ): Observable<TdsReportRow[]> {
    return this.getTdsReport(fromDate, toDate, sectionName);
  }

  // ---- challana checking / entry ----
  getChallanaDetails(args: {
    fromDate: string;
    toDate: string;
    sectionName: string;
    companyType: string;
    panPer: string;
    section: string;
  }): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/Challana/GetChallanaDetails',
      {
        FromDate: args.fromDate,
        ToDate: args.toDate,
        SectionName: args.sectionName,
        CompanyType: args.companyType,
        panper: args.panPer,
        Section: args.section,
      },
    );
  }

  getZeroTdsChallanaDetails(args: {
    fromDate: string;
    toDate: string;
    sectionName: string;
    companyType: string;
    panPer: string;
    section: string;
  }): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/Challana/GetZeroTdsChallanaDetails',
      {
        FromDate: args.fromDate,
        ToDate: args.toDate,
        SectionName: args.sectionName,
        CompanyType: args.companyType,
        panper: args.panPer,
        Section: args.section,
      },
    );
  }

  saveChallanaEntry(data: unknown): Observable<unknown> {
    return this.api.post('/TDS/Challana/SaveChallanaEntry', data);
  }

  getChallanaNumbers(): Observable<unknown[]> {
    return this.api.get<unknown[]>('/TDS/Challana/GetChallanaNumbers');
  }

  getChallanaPaymentNumbers(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/TDS/Challana/GetChallanaPaymentNumbers',
    );
  }

  // ---- challana payment ----
  getChallanaPaymentDetails(
    challanaNo: string,
    section: string,
  ): Observable<unknown> {
    return this.api.get(
      '/TDS/Challana/GetChallanaEntryDetails',
      { ChallanaNO: challanaNo, section },
    );
  }

  saveChallanaPayment(data: unknown): Observable<unknown> {
    return this.api.post('/TDS/Challana/SaveChallanaPayment', data);
  }

  getChallanaPaymentReport(challanaNo: string): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/Challana/GetChallanaPaymentReport',
      { ChallanaNO: challanaNo },
    );
  }

  // ---- CIN entry ----
  getCinEntryData(challanaNo: string): Observable<unknown> {
    return this.api.get(
      '/TDS/Challana/GetChallanaPaymentDetails',
      { ChallanaNO: challanaNo },
    );
  }

  saveCinEntry(data: unknown): Observable<unknown> {
    return this.api.post('/TDS/Challana/SaveCinEntry', data);
  }

  getCinEntryByChallanaNo(challanaNo: string): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/Challana/GetCinEntryReportByChallanaNo',
      { ChallanaNO: challanaNo },
    );
  }

  getCinEntryReportsBetweenDates(
    fromDate: string,
    toDate: string,
  ): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/TDS/Challana/GetCinEntryReportsBetweenDates',
      { FromDate: fromDate, ToDate: toDate },
    );
  }

  getCinEntryChallanaNumbers(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/TDS/Challana/GetCinEntryChallanaNumbers',
    );
  }

  // ---- PAN update ----
  getContactsWithoutPan(): Observable<PanContactRow[]> {
    return this.api.get<PanContactRow[]>(
      '/loans/masters/contactmasterNew/GetNousepanContactView',
    );
  }

  savePanDetails(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/contactmasterNew/savePandocumentstore',
      data,
    );
  }

  checkDuplicatePan(panNo: string): Observable<unknown> {
    return this.api.get(
      '/loans/masters/contactmasterNew/duplicatornotpancard',
      { PANNO: panNo },
    );
  }

  // ---- Form 15-H / 121 (shared save endpoint in legacy) ----
  saveForm15H(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Transactions/FdReceipt/SaveForm15H',
      data,
    );
  }

  getForm15HReport(uid: string): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/Banking/Transactions/FdReceipt/GetForm15HReportDetails',
      { uid },
    );
  }

  checkForm15hContactExist(
    contactId: number,
    finYear: string,
    companyId: number,
  ): Observable<unknown> {
    return this.api.get(
      '/Banking/Transactions/FdReceipt/GetForm15hContactExist',
      { Contactid: contactId, finyear: finYear, companyid: companyId },
    );
  }

  getForm15HContactDetails(
    contactId: number,
    finYear: string,
    companyId: number,
  ): Observable<unknown> {
    return this.api.get(
      '/Subscriber/GetForm15HContactDetails',
      { Contact_id: contactId, finyear: finYear, companyid: companyId },
    );
  }

  getForm15HDetailsForEdit(uid: string): Observable<unknown> {
    return this.api.get('/ContactMaster/GetForm15HDetailsforEdit', { uid });
  }

  checkPanValidForForm15h(contactId: number): Observable<unknown> {
    return this.api.get(
      '/Configuration/GlobalConfiguration/CheckPanValidForForm15h',
      { Contactid: contactId },
    );
  }

  // ---- PAN validation ----
  getPanValidStatus(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Transactions/FdReceipt/GetPanValidStatus',
    );
  }

  getPanValidDetails(
    searchText: string,
    searchType: string,
  ): Observable<TdsReportRow[]> {
    return this.api.get<TdsReportRow[]>(
      '/Banking/GetPanValidDetails',
      { searchtext: searchText, searchtype: searchType },
    );
  }

  savePanValidDetails(args: {
    panValidId: number;
    contactId: number;
    userId: number;
    ipAddress: string;
    documentFileName: string;
    guidFileName: string;
    approvedBy: string;
    searchType: string;
  }): Observable<unknown> {
    const q =
      `PanValidId=${args.panValidId}` +
      `&ContactId=${args.contactId}` +
      `&UserId=${args.userId}` +
      `&pipaddress=${encodeURIComponent(args.ipAddress)}` +
      `&DocumentFileName=${encodeURIComponent(args.documentFileName)}` +
      `&GuidFileName=${encodeURIComponent(args.guidFileName)}` +
      `&ApprovedBy=${encodeURIComponent(args.approvedBy)}` +
      `&searchtype=${encodeURIComponent(args.searchType)}`;
    return this.api.post(
      `/Banking/Transactions/FdReceipt/SavePanValidDetails?${q}`,
      {},
    );
  }
}
