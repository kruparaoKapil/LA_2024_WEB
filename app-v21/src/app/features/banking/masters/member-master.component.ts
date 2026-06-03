import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  BankingMastersService,
  type MemberRow,
  type MemberTypeRow,
} from '../services/banking-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const EMPTY_MEMBER: MemberRow = {
  pMemberName: '',
  pMemberType: '',
  pContactType: 'Individual',
  pPhone: '',
  pEmail: '',
  pAddress: '',
  pStatus: 'Active',
  ptypeofoperation: 'CREATE',
};

const CONTACT_TYPE_OPTIONS = [
  { label: 'Individual', value: 'Individual' },
  { label: 'Business', value: 'Business' },
];

const PHONE_RX = /^[6-9]\d{9}$/;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-member-master',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="mem-form">
      <header class="mh">
        <div>
          <h2>{{ heading() }}</h2>
          <p class="muted">{{ subtitle() }}</p>
        </div>
        <div class="actions">
          <p-button
            label="Save"
            icon="pi pi-save"
            (onClick)="save()"
            [loading]="saving()"
            [disabled]="!isValid()"
          />
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            icon="pi pi-times"
            (onClick)="cancel()"
          />
        </div>
      </header>

      <p-card>
        <div class="grid">
          <label class="field">
            <span>Member Name<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="member.pMemberName"
              name="memberName"
              maxlength="100"
            />
            <app-validation-message [message]="errors().pMemberName" />
          </label>
          <label class="field">
            <span>Member Type<sup>*</sup></span>
            <app-select
              [options]="memberTypes()"
              optionLabel="pMemberType"
              optionValue="pMemberType"
              [(ngModel)]="member.pMemberType"
              name="memberType"
              placeholder="Pick type"
            />
            <app-validation-message [message]="errors().pMemberType" />
          </label>
          <label class="field">
            <span>Contact Type</span>
            <app-select
              [options]="contactTypeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="member.pContactType"
              name="contactType"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>Date of Birth</span>
            <app-date-input
              [(ngModel)]="member.pDateOfBirth"
              name="dob"
              [maxDate]="today"
            />
          </label>
          <label class="field">
            <span>Phone<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="member.pPhone"
              name="phone"
              maxlength="10"
            />
            <app-validation-message [message]="errors().pPhone" />
          </label>
          <label class="field">
            <span>Email</span>
            <input
              pInputText
              [(ngModel)]="member.pEmail"
              name="email"
              maxlength="100"
            />
            <app-validation-message [message]="errors().pEmail" />
          </label>
          <label class="field span-3">
            <span>Address</span>
            <input
              pInputText
              [(ngModel)]="member.pAddress"
              name="address"
              maxlength="200"
            />
          </label>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .mem-form { display: flex; flex-direction: column; gap: 0.75rem; }
      .mh {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .mh h2 { margin: 0; }
      .muted { color: var(--p-text-muted-color, var(--p-surface-500)); margin: 0.25rem 0 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .span-3 { grid-column: span 3; }
    `,
  ],
})
export class MemberMasterComponent implements OnInit {
  private readonly api = inject(BankingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly contactTypeOptions = CONTACT_TYPE_OPTIONS;

  protected readonly memberTypes = signal<MemberTypeRow[]>([]);
  protected readonly saving = signal<boolean>(false);

  protected member: MemberRow = { ...EMPTY_MEMBER };
  protected readonly errors = signal<{
    pMemberName: string;
    pMemberType: string;
    pPhone: string;
    pEmail: string;
  }>({ pMemberName: '', pMemberType: '', pPhone: '', pEmail: '' });

  protected readonly heading = computed(() =>
    this.api.editingMemberId() ? 'Edit Member' : 'New Member',
  );
  protected readonly subtitle = computed(() => {
    const id = this.api.editingMemberId();
    return id ? `Member #${id}` : 'Add a new member to the master.';
  });

  protected readonly isValid = computed(() => {
    const m = this.member;
    return (
      !!m.pMemberName &&
      !!m.pMemberType &&
      !!m.pPhone &&
      PHONE_RX.test(String(m.pPhone)) &&
      (!m.pEmail || EMAIL_RX.test(String(m.pEmail)))
    );
  });

  ngOnInit(): void {
    this.api.listMemberTypes().subscribe({
      next: (rows) => this.memberTypes.set((rows as MemberTypeRow[]) ?? []),
      error: (err) =>
        this.toast.error(err?.message ?? 'Failed to load member types'),
    });

    const cached = this.api.editingMemberData();
    if (cached) {
      this.member = { ...EMPTY_MEMBER, ...cached };
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loader.show();
      this.api.getFiMember(id).subscribe({
        next: (data) => {
          if (data) this.member = { ...EMPTY_MEMBER, ...data };
        },
        error: (err) => this.toast.error(err?.message ?? 'Failed to load member'),
        complete: () => this.loader.hide(),
      });
    }
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        pMemberName: this.member.pMemberName ? '' : 'Name is required.',
        pMemberType: this.member.pMemberType ? '' : 'Type is required.',
        pPhone: !this.member.pPhone
          ? 'Phone is required.'
          : !PHONE_RX.test(String(this.member.pPhone))
            ? 'Phone must be 10 digits starting with 6-9.'
            : '',
        pEmail:
          this.member.pEmail && !EMAIL_RX.test(String(this.member.pEmail))
            ? 'Invalid email format.'
            : '',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveFiMemberMaster(this.member).subscribe({
      next: () => {
        this.toast.success(
          `Member ${this.api.editingMemberId() ? 'updated' : 'created'}.`,
        );
        this.cancel();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate(['/banking/MemberView']);
  }
}
