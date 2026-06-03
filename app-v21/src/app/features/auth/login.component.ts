import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/notifications/toast.service';
import { LoaderService } from '../../core/loader/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-shell">
      <p-card header="LA 2024 — Sign in" styleClass="login-card">
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
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);

  protected readonly signInDisabled = computed(
    () => this.busy() || !this.username().trim() || !this.password(),
  );

  protected signIn(): void {
    if (this.signInDisabled()) {
      this.toast.warn('Enter both username and password.', 'Missing credentials');
      return;
    }
    this.busy.set(true);
    this.loader.show('Signing in…');
    this.auth
      .login({ username: this.username().trim(), password: this.password() })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.loader.hide();
          const target = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/Dashboard';
          void this.router.navigateByUrl(target);
        },
        error: () => {
          // toast already raised by errorInterceptor
          this.busy.set(false);
          this.loader.hide();
        },
      });
  }
}
