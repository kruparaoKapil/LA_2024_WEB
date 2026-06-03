import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client.service';

export interface DocumentGroupRow {
  pDocGroupID: number;
  pDocGroupName: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

export interface IdentificationDocumentRow {
  pDocumenId: number;
  pDocGroupName: string;
  pDocName: string;
  pDocType?: string;
  pIsActive?: boolean;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly api = inject(ApiClient);

  getDocumentGroupNames(): Observable<DocumentGroupRow[]> {
    return this.api.get<DocumentGroupRow[]>(
      '/loans/masters/documentsmaster/GetDocumentGroupNames',
    );
  }

  saveDocumentGroup(data: DocumentGroupRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/documentsmaster/SaveDocumentGroup',
      data,
    );
  }

  saveIdentificationDocument(data: IdentificationDocumentRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/documentsmaster/SaveIdentificationDocuments',
      data,
    );
  }

  updateIdentificationDocument(data: IdentificationDocumentRow): Observable<unknown> {
    return this.api.post(
      '/loans/masters/documentsmaster/UpdateIdentificationDocuments',
      data,
    );
  }

  deleteIdentificationDocument(data: unknown): Observable<unknown> {
    return this.api.post(
      '/loans/masters/documentsmaster/DeleteIdentificationDocuments',
      data,
    );
  }

  /**
   * Legacy quirk: GET-shaped query but uses POST verb. Preserved verbatim
   * to keep the backend contract.
   */
  getDocumentIdProofTypes(loanId = 0): Observable<unknown> {
    return this.api.post(
      `/loans/masters/documentsmaster/GetdocumentidproffDetails?pLoanId=${loanId}`,
      '',
    );
  }

  checkProofTypeDuplicates(docGroupName: string): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/documentsmaster/CheckDuplicateGroupNames',
      { DocGroupName: docGroupName },
    );
  }

  checkDocumentDuplicates(
    proofType: string,
    proof: string,
    id: number,
  ): Observable<number> {
    return this.api.get<number>(
      '/loans/masters/documentsmaster/CheckDuplicateDocNamesBasedonGroupName',
      { DocGroupName: proofType, DocName: proof, DocumenId: id },
    );
  }
}
