import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

import { AuthService } from '../../core/auth/auth.service';
import { clearAuthSession } from '../../core/auth/session-clear.util';
import { PreLoginBranchService } from '../../core/auth/pre-login-branch.service';
import { ToastService } from '../../core/notifications/toast.service';
import { LoaderService } from '../../core/loader/loader.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-shell">
      <p-card header="LA 2024 — Sign in" styleClass="login-card">
        @if (branchLabel(); as branch) {
          <p class="branch-banner">
            <i class="pi pi-building"></i>
            Branch: <strong>{{ branch }}</strong>
            <button type="button" class="change-branch" (click)="changeBranch()">
              Change
            </button>
          </p>
        }
        <div class="field">
          <label for="username">Username</label>
          <input
            id="username"
            pInputText
            autocomplete="username"
            [ngModel]="username()"
            (ngModelChange)="username.set($event)"
            (keyup.enter)="signIn()"
          />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <p-password
            inputId="password"
            [ngModel]="password()"
            (ngModelChange)="password.set($event)"
            [feedback]="false"
            [toggleMask]="true"
            (keyup.enter)="signIn()"
          />
        </div>
        <p-button
          label="Sign in"
          icon="pi pi-sign-in"
          [loading]="busy()"
          [disabled]="signInDisabled()"
          (onClick)="signIn()"
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      .login-shell {
        display: grid;
        place-items: center;
        min-height: 100dvh;
        padding: 1.5rem;
        background: var(--p-surface-50);
      }
      :host ::ng-deep .login-card {
        width: min(420px, 100%);
      }
      .branch-banner {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.35rem 0.5rem;
        margin: 0 0 1rem;
        padding: 0.6rem 0.75rem;
        background: var(--p-surface-100);
        border-radius: var(--p-border-radius, 6px);
        font-size: 0.9rem;
      }
      .change-branch {
        margin-left: auto;
        border: none;
        background: none;
        color: var(--p-primary-color);
        cursor: pointer;
        font-size: 0.85rem;
        text-decoration: underline;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cookies = inject(CookieService);
  private readonly branchSvc = inject(PreLoginBranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);
  protected readonly branchLabel = signal<string | null>(null);

  protected readonly signInDisabled = computed(
    () => this.busy() || !this.username().trim() || !this.password(),
  );

  ngOnInit(): void {
    clearAuthSession(this.auth.store, this.cookies);
    this.loader.reset();
    const branch = this.branchSvc.readSelection();
    if (!branch?.pbranch_name) {
      void this.router.navigate(['/']);
      return;
    }
    this.branchLabel.set(branch.pbranch_name);
    this.auth.store.setBranch({
      pbranch_id: branch.pbranch_id,
      pbranch_name: branch.pbranch_name,
      pbranch_location: branch.pbranch_location,
      pBranchID: branch.pbranch_id,
      pBranchName: branch.pbranch_name,
    });
  }

  protected changeBranch(): void {
    this.branchSvc.clearSelection();
    void this.router.navigate(['/']);
  }

  protected signIn(): void {
    if (this.signInDisabled()) {
      this.toast.warn('Enter both username and password.', 'Missing credentials');
      return;
    }
    this.busy.set(true);
    this.loader.show('Signing in…');
    this.auth.login({
      pUserName: this.username().trim(),
      pPassword: this.password(),
      pOtp: '',
    })
      .pipe(
        finalize(() => {
          this.busy.set(false);
          this.loader.hide();
        }),
      )
      .subscribe({
        next: () => {
          const target = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/Dashboard';
          void this.router.navigateByUrl(target);
        },
        error: () => {
          // toast raised by errorInterceptor
        },
      });
  }
}
