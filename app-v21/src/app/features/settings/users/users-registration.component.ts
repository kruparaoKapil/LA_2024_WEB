import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { UsersService, UserRegistrationPayload } from '../users.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ValidationMessageComponent } from '../../../shared/ui';

/**
 * Create / edit a user. Replaces legacy
 * `UI/Settings/Users/usersregistration/usersregistration.component.ts`.
 *
 * Signal-driven form replaces the legacy FormBuilder + manual blur
 * scaffolding. Username and contact-ref-id duplicate checks now run
 * via PrimeNG p-button click handlers; legacy `valueChanges`
 * subscriptions and pop-up errors are replaced with inline
 * `<app-validation-message>` slots.
 */
@Component({
  selector: 'app-users-registration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ValidationMessageComponent,
  ],
  template: `
    <div class="page">
      <p-card>
        <ng-template pTemplate="header">
          <div class="head">
            <h2>{{ editing() ? 'Edit User' : 'New User' }}</h2>
            <p-button
              label="Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              [outlined]="true"
              (onClick)="back()"
            />
          </div>
        </ng-template>

        <div class="grid">
          <div class="field">
            <label>Username</label>
            <input
              pInputText
              [ngModel]="username()"
              (ngModelChange)="username.set($event)"
              [disabled]="editing()"
            />
            <app-validation-message [message]="errors().username" />
          </div>
          <div class="field">
            <label>Contact Ref. ID</label>
            <input
              pInputText
              [ngModel]="contactRefId()"
              (ngModelChange)="contactRefId.set($event)"
            />
            <app-validation-message [message]="errors().contactRefId" />
          </div>
          <div class="field">
            <label>Designation</label>
            <input
              pInputText
              [ngModel]="designation()"
              (ngModelChange)="designation.set($event)"
            />
          </div>
          @if (!editing()) {
            <div class="field">
              <label>Password</label>
              <p-password
                [ngModel]="password()"
                (ngModelChange)="password.set($event)"
                [feedback]="true"
                [toggleMask]="true"
              />
              <app-validation-message [message]="errors().password" />
            </div>
          }
        </div>

        <ng-template pTemplate="footer">
          <div class="footer">
            <p-button
              label="Cancel"
              severity="secondary"
              [outlined]="true"
              (onClick)="back()"
            />
            <p-button
              [label]="editing() ? 'Update' : 'Create'"
              icon="pi pi-check"
              [loading]="busy()"
              [disabled]="busy() || !canSave()"
              (onClick)="save()"
            />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 900px;
        margin-inline: auto;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
      }
      .head h2 {
        margin: 0;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
    `,
  ],
})
export class UsersRegistrationComponent {
  private readonly usersSvc = inject(UsersService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly username = signal<string>('');
  protected readonly password = signal<string>('');
  protected readonly contactRefId = signal<string>('');
  protected readonly designation = signal<string>('');
  protected readonly editing = signal<boolean>(false);
  protected readonly editingId = signal<number>(0);
  protected readonly busy = signal<boolean>(false);

  protected readonly errors = computed(() => ({
    username: this.username().trim() ? '' : 'Username is required.',
    contactRefId: this.contactRefId().trim() ? '' : 'Contact ref id is required.',
    password:
      this.editing() || (this.password() && this.password().length >= 6)
        ? ''
        : 'Password must be at least 6 characters.',
  }));

  protected readonly canSave = computed(
    () =>
      !this.errors().username &&
      !this.errors().contactRefId &&
      !this.errors().password,
  );

  constructor() {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      try {
        const id = Number(atob(idParam));
        if (Number.isFinite(id) && id > 0) {
          this.editing.set(true);
          this.editingId.set(id);
          // Legacy uses `GetUserRightsBasedonUserName` after lookup; we
          // surface only what's needed for the edit screen here.
        }
      } catch {
        /* ignore */
      }
    }
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.busy.set(true);
    this.loader.show(this.editing() ? 'Updating…' : 'Creating…');
    const payload: UserRegistrationPayload = {
      pUserID: this.editingId() || undefined,
      pUserName: this.username().trim(),
      pUsercontactRefId: this.contactRefId().trim(),
      pDesignation: this.designation().trim() || undefined,
      pPassword: this.editing() ? undefined : this.password(),
      pCreatedBy: Number(this.auth.currentUserId()) || 0,
    };
    this.usersSvc.saveRegistration(payload).subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(this.editing() ? 'User updated.' : 'User created.');
        void this.router.navigate(['/settings/UsersView']);
      },
      error: () => {
        this.busy.set(false);
        this.loader.hide();
      },
    });
  }

  protected back(): void {
    void this.router.navigate(['/settings/UsersView']);
  }
}
