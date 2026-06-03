import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { TabsComponent, type TabItem } from '../../../shared/ui';
import { ContactSelectComponent, type ContactSelectionEvent } from '../contact/contact-select.component';
import { BankDetailsSubformComponent, type BankRecord } from '../sub-forms/bank-details-subform.component';
import { KycDocumentsSubformComponent, type KycRecord } from '../sub-forms/kyc-documents-subform.component';
import { PersonalDetailsSubformComponent, type PersonalDetailsValue } from '../sub-forms/personal-details-subform.component';
import { AddressSubformComponent } from '../../common/address/address-subform.component';
import { FeaturePlaceholderComponent } from '../../../shared/ui';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { FIIndividualService } from '../services/fi-individual.service';

const TAB_IDS = {
  applicant: 'applicant',
  application: 'application',
  bank: 'bank',
  kyc: 'kyc',
  address: 'address',
  personal: 'personal',
  family: 'family',
  property: 'property',
  movable: 'movable',
  employment: 'employment',
  coApplicant: 'co-applicant',
  nominee: 'nominee',
  referral: 'referral',
  tds: 'tds',
} as const;

type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

/**
 * FI-Individual shell — replaces the legacy multi-thousand-LOC nested
 * tabset (`<app-tabset>` ⇒ kendo-tabstrip ⇒ 14 sub-tabs ⇒ 14 different
 * components, each with their own `_GetXxxUpdate` Subject hand-shake).
 *
 * Phase 7B delivers the shell + 4 fully wired tabs:
 *   - Applicant (contact picker)
 *   - Address (Phase 5 sub-form)
 *   - Bank Details (this phase)
 *   - KYC Documents (this phase)
 *   - Personal Details (this phase)
 *
 * Remaining tabs render an `<app-feature-placeholder>` so the rest of the
 * route tree resolves, keeping the cutover incremental.
 */
@Component({
  selector: 'app-fi-individual-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TabsComponent,
    ContactSelectComponent,
    BankDetailsSubformComponent,
    KycDocumentsSubformComponent,
    PersonalDetailsSubformComponent,
    AddressSubformComponent,
    FeaturePlaceholderComponent,
  ],
  template: `
    <div class="fi-shell">
      <header class="fi-header">
        <div>
          <h2>{{ headerTitle() }}</h2>
          <p class="fi-subtitle">{{ headerSubtitle() }}</p>
        </div>
        <div class="fi-actions">
          <p-button
            label="Save Tab"
            icon="pi pi-save"
            (onClick)="saveCurrentTab()"
          />
          <p-button
            label="Save & Next"
            icon="pi pi-arrow-right"
            severity="success"
            (onClick)="saveAndNext()"
          />
          <p-button
            label="Back to List"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-list"
            (onClick)="backToList()"
          />
        </div>
      </header>

      <p-card styleClass="fi-applicant-banner">
        <div class="fi-applicant-row">
          <div class="fi-applicant-pick">
            <label>Applicant</label>
            <app-contact-select
              selectType="Contact"
              (contactSelected)="onContactSelected($event)"
              (contactCleared)="onContactCleared()"
            />
          </div>
          <div class="fi-applicant-meta">
            @if (selectedContact(); as c) {
              <div><strong>{{ c.contactName }}</strong></div>
              <div class="muted">{{ c.referenceId }}</div>
              @if (c.contactNo) {
                <div class="muted">{{ c.contactNo }}</div>
              }
            } @else {
              <div class="muted">No applicant selected.</div>
            }
          </div>
        </div>
      </p-card>

      <app-tabs [items]="tabs" [(active)]="activeTab">
        <ng-template #tabContent let-id>
          @switch (id) {
            @case ('applicant') {
              <p class="muted">
                Pick the applicant contact above. Loan-specific fields appear
                in the <em>Application</em> tab once an applicant is selected.
              </p>
            }
            @case ('address') {
              <app-address-subform
                [(ngModel)]="address"
                (ngModelChange)="dirty.set(true)"
              />
            }
            @case ('bank') {
              <app-bank-details-subform
                [contactId]="selectedContact()?.contactId ?? 0"
                [(ngModel)]="bankAccounts"
                (ngModelChange)="dirty.set(true)"
              />
            }
            @case ('kyc') {
              <app-kyc-documents-subform
                [contactId]="selectedContact()?.contactId ?? 0"
                [(ngModel)]="kycDocs"
                (ngModelChange)="dirty.set(true)"
              />
            }
            @case ('personal') {
              <app-personal-details-subform
                [(ngModel)]="personalDetails"
                (ngModelChange)="dirty.set(true)"
              />
            }
            @default {
              <app-feature-placeholder
                [title]="placeholderTitle(id)"
                description="Coming up in Phase 7C — Family, Property, Movable Property, Employment, Co-Applicant, Nominee, Referral, TDS."
              />
            }
          }
        </ng-template>
      </app-tabs>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .fi-shell {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .fi-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .fi-header h2 {
        margin: 0;
      }
      .fi-subtitle {
        margin: 0.25rem 0 0;
        color: var(--p-text-muted-color, var(--p-surface-500));
      }
      .fi-actions {
        display: flex;
        gap: 0.5rem;
      }
      :host ::ng-deep .fi-applicant-banner .p-card-body {
        padding: 0.75rem 1rem;
      }
      .fi-applicant-row {
        display: grid;
        grid-template-columns: minmax(280px, 1fr) auto;
        gap: 1.5rem;
        align-items: center;
      }
      .fi-applicant-pick label {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--p-text-muted-color, var(--p-surface-500));
        margin-bottom: 0.25rem;
      }
      .fi-applicant-meta .muted {
        color: var(--p-text-muted-color, var(--p-surface-500));
        font-size: 0.85rem;
      }
      .muted {
        color: var(--p-text-muted-color, var(--p-surface-500));
      }
    `,
  ],
})
export class FIIndividualShellComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fi = inject(FIIndividualService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  // ------ tabs ------
  readonly tabs: TabItem[] = [
    { id: TAB_IDS.applicant, label: 'Applicant', icon: 'pi pi-user' },
    { id: TAB_IDS.application, label: 'Application', icon: 'pi pi-file', disabled: false },
    { id: TAB_IDS.address, label: 'Address', icon: 'pi pi-map-marker' },
    { id: TAB_IDS.bank, label: 'Bank Details', icon: 'pi pi-credit-card' },
    { id: TAB_IDS.kyc, label: 'KYC Documents', icon: 'pi pi-id-card' },
    { id: TAB_IDS.personal, label: 'Personal', icon: 'pi pi-info-circle' },
    { id: TAB_IDS.family, label: 'Family', icon: 'pi pi-users' },
    { id: TAB_IDS.property, label: 'Property', icon: 'pi pi-home' },
    { id: TAB_IDS.movable, label: 'Movable Property', icon: 'pi pi-car' },
    { id: TAB_IDS.employment, label: 'Employment', icon: 'pi pi-briefcase' },
    { id: TAB_IDS.coApplicant, label: 'Co-Applicant', icon: 'pi pi-users' },
    { id: TAB_IDS.nominee, label: 'Nominee', icon: 'pi pi-user-plus' },
    { id: TAB_IDS.referral, label: 'Referral', icon: 'pi pi-share-alt' },
    { id: TAB_IDS.tds, label: 'TDS', icon: 'pi pi-percentage' },
  ];

  protected activeTab = signal<string>(TAB_IDS.applicant);

  // ------ state ------
  protected readonly applicationId = signal<string | null>(null);
  protected readonly selectedContact = signal<ContactSelectionEvent | null>(null);
  protected readonly dirty = signal<boolean>(false);

  // form models held on the shell so they survive tab switches.
  protected address: unknown = null;
  protected bankAccounts: BankRecord[] = [];
  protected kycDocs: KycRecord[] = [];
  protected personalDetails: PersonalDetailsValue | null = null;

  protected readonly headerTitle = computed(() =>
    this.applicationId() ? `Application ${this.applicationId()}` : 'New FI – Individual',
  );
  protected readonly headerSubtitle = computed(() =>
    this.selectedContact()
      ? `${this.selectedContact()!.contactName} · ${this.selectedContact()!.referenceId}`
      : 'Pick an applicant to begin.',
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('applicationId');
    if (id) {
      this.applicationId.set(id);
      this.loadApplication(id);
    }
  }

  private loadApplication(applicationId: string): void {
    this.loader.show();
    this.fi.getFiUserData(applicationId).subscribe({
      next: (data) => {
        const d = data as Record<string, unknown> | null;
        if (d) {
          if (Array.isArray(d['applicantBankAccounts'])) {
            this.bankAccounts = (d['applicantBankAccounts'] as BankRecord[]).map(
              (r) => ({ ...r, ptypeofoperation: 'OLD' as const }),
            );
          }
          if (Array.isArray(d['applicantKycDocuments'])) {
            this.kycDocs = (d['applicantKycDocuments'] as KycRecord[]).map(
              (r) => ({ ...r, ptypeofoperation: 'OLD' as const }),
            );
          }
        }
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load application');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  // ------ contact picker ------
  onContactSelected(evt: ContactSelectionEvent): void {
    this.selectedContact.set(evt);
    this.dirty.set(true);
  }
  onContactCleared(): void {
    this.selectedContact.set(null);
  }

  // ------ tab actions ------
  saveCurrentTab(): void {
    const tab = this.activeTab();
    if (!this.selectedContact()) {
      this.toast.warn('Pick an applicant first.');
      return;
    }
    if (tab === TAB_IDS.bank) {
      this.toast.info(`${this.bankAccounts.length} bank record(s) ready to save.`);
    } else if (tab === TAB_IDS.kyc) {
      this.toast.info(`${this.kycDocs.length} KYC document(s) ready to save.`);
    } else if (tab === TAB_IDS.personal) {
      this.toast.info('Personal details captured.');
    }
    this.dirty.set(false);
  }

  saveAndNext(): void {
    this.saveCurrentTab();
    const idx = this.tabs.findIndex((t) => t.id === this.activeTab());
    const next = this.tabs[idx + 1];
    if (next) this.activeTab.set(next.id);
  }

  backToList(): void {
    void this.router.navigate(['/loans/fi-individual']);
  }

  protected placeholderTitle(id: TabId): string {
    return this.tabs.find((t) => t.id === id)?.label ?? id;
  }
}
