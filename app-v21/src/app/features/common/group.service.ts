import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface GroupRow {
  pGroupid: number;
  pGroupcode: string;
  pGroupname: string;
  pGrouptype?: string;
  pMembercount?: number;
}

export interface GroupRoleOption {
  pGrouproleID: number;
  pRoleInGroup: string;
}

export interface GroupMember {
  pContactID: number;
  pMemberId: number;
  pContactName: string;
  pContactRefId?: string;
  pContactNo?: string;
  pGrouproleID: number;
  pRoleInGroup?: string;
  pTypeofOperation?: 'create' | 'update' | 'delete';
  pRecordId?: number;
}

export interface GroupSavePayload {
  pGroupID?: number;
  pGroupCode: string;
  pGroupName: string;
  pGroupType?: string;
  pCreatedby: number;
  pTypeofoperation: 'CREATE' | 'UPDATE';
  pListGroupDetails: GroupMember[];
}

export interface GroupDeletePayload {
  pGroupID: number;
  pMemberId: number;
  pTransactionType: 'DELETE';
  pGroupName: string;
  pCreatedby: number;
  pTypeofoperation: 'VIEW';
}

/**
 * GroupService — port of legacy `Services/Common/group.service.ts`.
 * Uses the new `ApiClient` (single-trip API host, signal-friendly state).
 */
@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly api = inject(ApiClient);

  /** Stash for the legacy "click row → navigate to creation" pattern. */
  private readonly rowEditId = signal<number | null>(null);

  getGroupView(): Observable<GroupRow[]> {
    return this.api.get<GroupRow[]>('/Settings/GroupCreation/GetgroupView');
  }

  getRoles(): Observable<GroupRoleOption[]> {
    return this.api.get<GroupRoleOption[]>('/Settings/GroupCreation/GetRoles');
  }

  saveGroupConfig(data: GroupSavePayload): Observable<unknown> {
    return this.api.post('/Settings/GroupCreation/saveGroupConfig', data);
  }

  updateGroupDetails(data: GroupSavePayload): Observable<unknown> {
    return this.api.post('/Settings/GroupCreation/UpdateGroupDetails', data);
  }

  deleteGroupDetails(data: GroupDeletePayload): Observable<unknown> {
    return this.api.post('/Settings/GroupCreation/DeleteGroupDetails', data);
  }

  getGroupForEdit(groupId: number): Observable<unknown> {
    return this.api.get('/Settings/GroupCreation/Getgroupedit', { Groupid: groupId });
  }

  checkDuplicateGroupName(
    groupId: number,
    groupName: string,
    groupCode: string,
  ): Observable<number> {
    return this.api.get<number>('/Settings/GroupCreation/GroupNameandCodeCount', {
      Groupid: groupId,
      GroupName: groupName,
      GroupCode: groupCode,
    });
  }

  setRowEditId(id: number): void {
    this.rowEditId.set(id);
  }
  getRowEditId(): number | null {
    return this.rowEditId();
  }
  clearRowEditId(): void {
    this.rowEditId.set(null);
  }
}
