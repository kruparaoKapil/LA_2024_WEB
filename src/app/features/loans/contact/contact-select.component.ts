import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

import {
  ContactMasterService,
  type ContactRow,
  type ContactType,
} from '../services/contact-master.service';

export interface ContactSelectionEvent {
  contactId: number;
  referenceId: string;
  contactName: string;
  contactType: ContactType;
  contactNo?: string;
  raw: ContactRow;
}

/**
 * Replaces legacy `<app-contact-select>` (kendo-multi-column-combobox plus
 * `window` global callbacks).
 *
 * Modern signal-driven autocomplete; we display the selected contact as a
 * compact card (mirrors the kendo-template card the legacy version drew).
 */
@Component({
  selector: 'app-contact-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AutoCompleteModule, CardModule, AvatarModule],
  template: `
    <div class="contact-select">
      <p-autoComplete
        [(ngModel)]="picked"
        [suggestions]="suggestions()"
        (completeMethod)="search($event)"
        (onSelect)="onSelect($event)"
        (onClear)="onClear()"
        field="pContactName"
        [placeholder]="placeholder()"
        [forceSelection]="true"
        [delay]="250"
        [appendTo]="'body'"
        [styleClass]="'w-full'"
      >
        <ng-template let-row pTemplate="item">
          <div class="suggestion">
            <strong>{{ row.pContactName }}</strong>
            @if (row.pContactNo) {
              <span class="muted"> · {{ row.pContactNo }}</span>
            }
            @if (row.pContactRefId) {
              <span class="muted"> · {{ row.pContactRefId }}</span>
            }
          </div>
        </ng-template>
      </p-autoComplete>

      @if (selected(); as row) {
        <p-card styleClass="contact-select-card">
          <ng-template pTemplate="header">
            <div class="contact-card-header">
              <p-avatar
                icon="pi pi-user"
                styleClass="contact-avatar"
                shape="circle"
              />
              <div>
                <div class="primary">{{ row.pContactName }}</div>
                <div class="muted">
                  {{ row.pContactRefId }}
                  @if (row.pContactNo) { · {{ row.pContactNo }} }
                </div>
              </div>
            </div>
          </ng-template>
          @if (row.pEmail || row.pPanNumber) {
            <div class="contact-card-body">
              @if (row.pEmail) {
                <div><i class="pi pi-envelope"></i> {{ row.pEmail }}</div>
              }
              @if (row.pPanNumber) {
                <div><i class="pi pi-id-card"></i> {{ row.pPanNumber }}</div>
              }
            </div>
          }
        </p-card>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .contact-select {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .suggestion .muted,
      .contact-card-header .muted {
        color: var(--p-text-muted-color, var(--p-surface-500));
        font-size: 0.85rem;
      }
      .contact-card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
      }
      .contact-card-header .primary {
        font-weight: 600;
      }
      .contact-card-body {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class ContactSelectComponent {
  private readonly contactsService = inject(ContactMasterService);

  /** "Contact" → individual contacts; "Business Entity" → businesses. */
  readonly selectType = input<'Contact' | 'Business Entity' | 'Employee' | string>(
    'Contact',
  );
  readonly placeholder = input<string>('Search contact name, mobile, or PAN…');
  /** When provided, preselects this contact (by reference id). */
  readonly preselectedRefId = input<string | null>(null);

  readonly contactSelected = output<ContactSelectionEvent>();
  readonly contactCleared = output<void>();

  protected readonly contactType = computed<ContactType>(() => {
    const t = this.selectType();
    if (t === 'Contact') return 'Individual';
    if (t === 'Business Entity') return 'BUSINESS ENTITY';
    return t;
  });

  protected readonly suggestions = signal<ContactRow[]>([]);
  protected readonly selected = signal<ContactRow | null>(null);
  protected picked: ContactRow | null = null;

  constructor() {
    effect(() => {
      const refId = this.preselectedRefId();
      if (!refId) return;
      this.contactsService.getContactsList().subscribe((rows) => {
        const match = rows.find((r) => r.pContactRefId === refId);
        if (match) {
          this.picked = match;
          this.selected.set(match);
        }
      });
    });
  }

  protected search(evt: AutoCompleteCompleteEvent): void {
    const term = (evt.query ?? '').trim().toLowerCase();
    this.contactsService.getContactTotalDetails(this.contactType()).subscribe((rows) => {
      if (!term) {
        this.suggestions.set(rows.slice(0, 50));
        return;
      }
      const filtered = rows.filter((r) =>
        [r.pContactName, r.pContactNo, r.pContactRefId, r.pPanNumber, r.pEmail]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term)),
      );
      this.suggestions.set(filtered.slice(0, 50));
    });
  }

  protected onSelect(evt: { value: ContactRow }): void {
    const row = evt.value;
    this.selected.set(row);
    this.contactSelected.emit({
      contactId: row.pContactID,
      referenceId: row.pContactRefId,
      contactName: row.pContactName,
      contactType: row.pContacttype ?? this.contactType(),
      contactNo: row.pContactNo,
      raw: row,
    });
  }

  protected onClear(): void {
    this.selected.set(null);
    this.picked = null;
    this.contactCleared.emit();
  }

  /** Imperative API: pre-load + select contact by reference id. */
  selectByRefId(refId: string): void {
    this.contactsService.getContactDetailsByRefId(refId).subscribe((row) => {
      const r = row as ContactRow;
      if (r) {
        this.selected.set(r);
        this.picked = r;
      }
    });
  }

  /** Imperative reset (used after submit). */
  reset(): void {
    this.selected.set(null);
    this.picked = null;
  }
}
