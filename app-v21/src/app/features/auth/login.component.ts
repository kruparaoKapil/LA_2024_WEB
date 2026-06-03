import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

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
            [ngModel]="username()"
            (ngModelChange)="username.set($event)"
            autocomplete="username"
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
          />
        </div>
        <p-button
          label="Sign in"
          icon="pi pi-sign-in"
          [loading]="loading()"
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
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService, { optional: true });

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly loading = signal(false);

  protected signIn(): void {
    if (!this.username() || !this.password()) {
      this.messages?.add({
        severity: 'warn',
        summary: 'Missing credentials',
        detail: 'Enter both username and password.',
      });
      return;
    }
    this.loading.set(true);
    // Real auth wiring lands in Phase 2 once AuthService is ported.
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/Dashboard']);
    }, 300);
  }
}
