import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export type DepositKind = 'fd' | 'rd';

export interface MemberRow {
  pMemberId?: number;
  pMemberCode?: string;
  pMemberName: string;
  pMemberType: string;
  pMemberTypeCode?: string;
  pContactType?: string;
  pDateOfBirth?: string;
  pPhone?: string;
  pEmail?: string;
  pAddress?: string;
  pStatus?: string;
  ptypeofoperation?: string;
  [key: string]: unknown;
}

export interface MemberTypeRow {
  pMemberTypeId?: number;
  pMemberType: string;
  pMemberTypeCode?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

export interface DepositConfigRow {
  pConfigId?: number;
  pName: string;
  pCode: string;
  pTenureMode?: string;
  pTenure?: number;
  pInterestRate?: number;
  pInterestPayout?: string;
  pCalculationType?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

/**
 * Replaces the legacy `MemberService` (156 LOC), `FdRdServiceService`
 * (159 LOC), `ShareconfigService` (122 LOC), `SavingaccountconfigService`
 * (188 LOC) and the masters slice of `LienEntryService` (254 LOC).
 *
 * Each legacy service was 80% identical save/list/get/check-duplicate
 * scaffolding around its own URL family. Consolidating here gives one
 * surface that the masters shells can drive uniformly.
 */
@Injectable({ providedIn: 'root' })
export class BankingMastersService {
  private readonly api = inject(ApiClient);

  // ---- cross-screen edit handoff (replaces legacy mutable state) ----
  readonly editingMemberId = signal<number | null>(null);
  readonly editingMemberData = signal<MemberRow | null>(null);
  readonly newFormStatus = signal<string>('');

  readonly editingFdConfig = signal<{ name: string; code: string } | null>(null);
  readonly editingRdConfig = signal<{ name: string; code: string } | null>(null);

  // ---- member type ----
  listMemberTypes(): Observable<MemberTypeRow[]> {
    return this.api.get<MemberTypeRow[]>(
      '/Banking/Masters/MemberType/GetMemberDetails',
    );
  }

  saveMemberType(data: MemberTypeRow): Observable<unknown> {
    return this.api.post('/Banking/Masters/MemberType/SaveMemberType', data);
  }

  updateMemberType(data: MemberTypeRow): Observable<unknown> {
    return this.api.post('/Banking/Masters/MemberType/UpdateMemberType', data);
  }

  deleteMemberType(memberId: number): Observable<unknown> {
    const path = `/Banking/Masters/MemberType/DeleteMemberType?MemberID=${memberId}`;
    return this.api.post(path, {});
  }

  checkMemberTypeDuplicate(memberType: string): Observable<number> {
    return this.api.get<number>(
      '/Banking/Masters/MemberType/CheckDuplicateMemberType',
      { MemberType: memberType },
    );
  }

  checkMemberNameCodeDuplicate(args: {
    memberId: number;
    memberType: string;
    memberTypeCode: string;
  }): Observable<number> {
    return this.api.get<number>(
      '/Banking/Masters/MemberType/CheckDuplicateMemberNameCode',
      {
        memberid: args.memberId,
        MemberType: args.memberType,
        MemberTypeCode: args.memberTypeCode,
      },
    );
  }

  // ---- members (FI Members) ----
  listFiMembers(): Observable<MemberRow[]> {
    return this.api.get<MemberRow[]>('/Banking/Masters/GetallFIMembers');
  }

  getFiMember(memberRefId: string): Observable<MemberRow> {
    return this.api.get<MemberRow>(
      '/Banking/Masters/FIMember/GetFIMemberData',
      { MemberReferenceId: memberRefId },
    );
  }

  saveFiMemberMaster(data: MemberRow): Observable<unknown> {
    return this.api.post('/Banking/Masters/FIMember/SaveFIMemberMasterData', data);
  }

  saveFiMemberReference(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FIMember/SaveFIMemberReferenceData',
      data,
    );
  }

  saveFiMemberReferral(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FIMember/SaveFIMemberReferralData',
      data,
    );
  }

  deleteFiMember(memberRefId: string, userId: number): Observable<unknown> {
    const path =
      `/Banking/Masters/FIMember/DeleteFIMember` +
      `?MemberReferenceID=${encodeURIComponent(memberRefId)}` +
      `&Userid=${userId}`;
    return this.api.post(path, {});
  }

  checkContactInMaster(contactReferenceId: number): Observable<number> {
    return this.api.get<number>(
      '/Banking/Masters/checkMemberCountinMaster',
      { ContactReferenceId: contactReferenceId },
    );
  }

  getFiMemberNames(contactType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/loans/Transactions/Firstinformation/GetFIMemberNames',
      { ContactType: contactType },
    );
  }

  getApplicantTypes(contactType: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Masters/FIMember/GetapplicantTypes',
      { ContactType: contactType },
    );
  }

  // ---- FD config ----
  listFdConfigs(): Observable<DepositConfigRow[]> {
    return this.api.get<DepositConfigRow[]>(
      '/Banking/Masters/FdConfig/GetFdViewDetails',
    );
  }

  saveFdNameAndCode(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FdConfig/SaveFDNameAndCode',
      data,
    );
  }

  saveFdConfiguration(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FdConfig/SaveFDConfigurationDetails',
      data,
    );
  }

  saveFdLoanFacility(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FdConfig/SaveFDLoanFacilityDetails',
      data,
    );
  }

  saveFdIdentificationDocs(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FdConfig/SaveFDIdentificationDocumentsDetails',
      data,
    );
  }

  saveFdReferralCommission(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/FdConfig/SaveFDReferralCommissionDetails',
      data,
    );
  }

  getFdNameAndCode(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FdConfig/GetFdNameAndCode',
      { FDName: name, FdNameCode: code },
    );
  }

  getFdConfigurationDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FdConfig/GetFdConfigurationDetails',
      { FDName: name, FdNameCode: code },
    );
  }

  getFdLoanFacility(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FdConfig/GetFdLoanFacilityDetails',
      { FDName: name, FdNameCode: code },
    );
  }

  getFdReferralDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FdConfig/GetFdReferralCommissionDetails',
      { FDName: name, FdNameCode: code },
    );
  }

  getFdIdentificationDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/FdConfig/GetFdIdentificationDocumentsDetails',
      { FDName: name, FdNameCode: code },
    );
  }

  deleteFdConfig(configId: number): Observable<unknown> {
    const path = `/Banking/Masters/FdConfig/DeleteFixedDepositConfig?FdConfigId=${configId}`;
    return this.api.post(path, {});
  }

  checkFdNameDuplicate(args: {
    configId: number;
    name: string;
    code: string;
  }): Observable<number> {
    return this.api.get<number>(
      '/Banking/Masters/FdConfig/CheckDuplicateFDName',
      {
        FDConfigid: args.configId,
        FDName: args.name,
        FdnameCode: args.code,
      },
    );
  }

  // ---- RD config (mirrors FD config endpoints) ----
  listRdConfigs(): Observable<DepositConfigRow[]> {
    return this.api.get<DepositConfigRow[]>(
      '/Banking/Masters/RdConfig/GetRdViewDetails',
    );
  }

  saveRdNameAndCode(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/RdConfig/SaverdNameAndCode',
      data,
    );
  }

  saveRdConfiguration(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/RdConfig/Saverdconfigarationdetails',
      data,
    );
  }

  saveRdLoanFacility(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/RdConfig/SaveRdloanfacilityDetails',
      data,
    );
  }

  saveRdIdentificationDocs(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/RdConfig/SaveRDIdentificationDocumentsDetails',
      data,
    );
  }

  saveRdReferralCommission(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Banking/Masters/RdConfig/SaveRdReferralDetails',
      data,
    );
  }

  getRdNameAndCode(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/RdConfig/GetRdNameAndCodeDetails',
      { RdName: name, RdNameCode: code },
    );
  }

  getRdConfigurationDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/RdConfig/GetRdConfigurationDetails',
      { RdName: name, RdNameCode: code },
    );
  }

  getRdLoanFacility(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/RdConfig/GetRdloanfacilityDetails',
      { RdName: name, RdNameCode: code },
    );
  }

  getRdReferralDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/RdConfig/GetRdReferralDetails',
      { RdName: name, RdNameCode: code },
    );
  }

  getRdIdentificationDetails(name: string, code: string): Observable<unknown> {
    return this.api.get(
      '/Banking/Masters/RdConfig/GetRdIdentificationDocumentsDetails',
      { RdName: name, RdNameCode: code },
    );
  }

  deleteRdConfig(configId: number): Observable<unknown> {
    const path = `/Banking/Masters/RdConfig/DeleteRdConfiguration?RdConfigId=${configId}`;
    return this.api.post(path, {});
  }

  checkRdNameDuplicate(args: {
    configId: number;
    name: string;
    code: string;
  }): Observable<number> {
    return this.api.get<number>(
      '/Banking/Masters/RdConfig/CheckDuplicateRDName',
      {
        RDconfigid: args.configId,
        RDName: args.name,
        RdCode: args.code,
      },
    );
  }

  // ---- generic dispatcher: pick fd/rd at the call site ----
  listDepositConfigs(kind: DepositKind): Observable<DepositConfigRow[]> {
    return kind === 'fd' ? this.listFdConfigs() : this.listRdConfigs();
  }

  // ---- savings AC ----
  listSavingsConfig(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Masters/SavingsConfig/GetSavingsViewDetails',
    );
  }

  // ---- shares config ----
  listSharesConfig(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Masters/SharesConfig/GetSharesViewDetails',
    );
  }

  // ---- lien entry ----
  listLienEntries(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Banking/Masters/LienEntry/GetLienEntryDetails',
    );
  }

  saveLienEntry(data: unknown): Observable<unknown> {
    return this.api.post('/Banking/Masters/LienEntry/SaveLienEntry', data);
  }
}
