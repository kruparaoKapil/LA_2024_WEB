import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import type { MenuItem } from 'primeng/api';

import { AuthService } from '../core/auth/auth.service';

/**
 * Application chrome rendered around every authenticated route.
 *
 * Replaces the legacy `dashboard.component.html` / `navigation.component`
 * pair: top bar (brand, current company, user menu) + collapsible left
 * panel-menu sidebar + `<router-outlet>`.
 *
 * Menu items mirror the legacy 387-route grouping by feature area
 * (Loans, Banking, Accounting, HRMS, TDS, Settings) so users land on
 * familiar URLs as features come online in Phases 5–10.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    ButtonModule,
    MenuModule,
    PanelMenuModule,
    AvatarModule,
    TooltipModule,
  ],
  template: `
    <header class="app-header">
      <div class="brand">
        <p-button
          icon="pi pi-bars"
          [text]="true"
          [rounded]="true"
          severity="secondary"
          (onClick)="toggleSidebar()"
        />
        <a class="brand-title" routerLink="/Dashboard">LA 2024</a>
        @if (companyName(); as name) {
          <span class="company">— {{ name }}</span>
        }
      </div>

      <div class="header-right">
        <div class="user-block">
          <p-avatar [label]="userInitial()" shape="circle" size="normal" />
          <div class="user-meta">
            <span class="user-name">{{ userName() }}</span>
            @if (userRole(); as role) {
              <span class="user-role">{{ role }}</span>
            }
          </div>
        </div>
        <p-button
          icon="pi pi-sign-out"
          severity="secondary"
          [outlined]="true"
          [rounded]="true"
          pTooltip="Sign out"
          tooltipPosition="left"
          (onClick)="signOut()"
        />
      </div>
    </header>

    <main class="app-main">
      <aside class="app-sidebar" [class.collapsed]="sidebarCollapsed()">
        <p-panelMenu [model]="menu()" styleClass="w-full app-panelmenu" />
      </aside>

      <section class="app-content">
        <router-outlet />
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background: var(--p-surface-0);
        border-bottom: 1px solid var(--p-surface-200);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }
      .brand-title {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--p-primary-color);
        text-decoration: none;
      }
      .company {
        color: var(--p-text-muted-color, var(--p-surface-500));
        font-size: 0.95rem;
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .user-block {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }
      .user-meta {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }
      .user-name {
        font-weight: 600;
      }
      .user-role {
        font-size: 0.8rem;
        color: var(--p-text-muted-color, var(--p-surface-500));
      }
      .app-main {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-height: calc(100dvh - 56px);
      }
      .app-main:has(.app-sidebar.collapsed) {
        grid-template-columns: 0 1fr;
      }
      .app-sidebar {
        background: var(--p-surface-0);
        border-right: 1px solid var(--p-surface-200);
        overflow: auto;
        padding: 0.75rem 0.5rem;
        transition: width 200ms ease;
      }
      .app-sidebar.collapsed {
        width: 0;
        padding: 0;
        overflow: hidden;
      }
      .app-content {
        padding: 1rem 1.25rem;
        overflow: auto;
      }
      :host ::ng-deep .app-panelmenu .p-panelmenu-header-link {
        font-weight: 600;
      }
    `,
  ],
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);

  protected readonly sidebarCollapsed = signal<boolean>(false);

  protected readonly userName = computed(
    () => this.auth.store.user()?.pUserName ?? 'Guest',
  );
  protected readonly userInitial = computed(() =>
    (this.userName() ?? 'U').charAt(0).toUpperCase(),
  );
  protected readonly userRole = computed(
    () => this.auth.store.roles()?.pDesignation ?? '',
  );
  protected readonly companyName = computed(
    () => this.auth.store.company()?.pCompanyName ?? '',
  );

  /**
   * Static feature menu — items become enabled as their feature phase ports
   * the corresponding routes. `disabled: true` items remain visible so users
   * see what's coming.
   */
  protected readonly menu = computed<MenuItem[]>(() => [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/Dashboard',
    },
    {
      label: 'Loans',
      icon: 'pi pi-credit-card',
      items: [
        { label: 'Masters', icon: 'pi pi-folder', routerLink: '/loans/masters' },
        { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', routerLink: '/loans/transactions' },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/loans/reports' },
      ],
    },
    {
      label: 'Banking',
      icon: 'pi pi-building-columns',
      items: [
        { label: 'Masters', icon: 'pi pi-folder', routerLink: '/banking/masters' },
        { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', routerLink: '/banking/transactions' },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/banking/reports' },
        { label: 'Letters', icon: 'pi pi-file-edit', routerLink: '/banking/letters' },
      ],
    },
    {
      label: 'Accounting',
      icon: 'pi pi-calculator',
      items: [
        { label: 'Masters', icon: 'pi pi-folder', routerLink: '/accounting/masters' },
        { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', routerLink: '/accounting/transactions' },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/accounting/reports' },
      ],
    },
    {
      label: 'HRMS',
      icon: 'pi pi-users',
      items: [
        { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', routerLink: '/hrms/transactions' },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/hrms/reports' },
      ],
    },
    {
      label: 'TDS',
      icon: 'pi pi-percentage',
      items: [
        { label: 'Masters', icon: 'pi pi-folder', routerLink: '/tds/masters' },
        { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', routerLink: '/tds/transactions' },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/tds/reports' },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-user', routerLink: '/settings/users' },
        { label: 'User Rights', icon: 'pi pi-shield', routerLink: '/settings/user-rights' },
        { label: 'Add Menu', icon: 'pi pi-plus-circle', routerLink: '/settings/add-menu' },
        { label: 'Menu Sorting', icon: 'pi pi-sort', routerLink: '/settings/menu-sorting' },
        { label: 'Branch Config', icon: 'pi pi-building', routerLink: '/settings/branch-config' },
        { label: 'Company Config', icon: 'pi pi-building-columns', routerLink: '/settings/company-config' },
        { label: 'Employees', icon: 'pi pi-id-card', routerLink: '/settings/employees' },
        { label: 'Advocates / Lawyers', icon: 'pi pi-briefcase', routerLink: '/settings/advocate-lawyer' },
        { label: 'Referral Agents', icon: 'pi pi-users', routerLink: '/settings/referral-agent' },
        { label: 'Contacts', icon: 'pi pi-address-book', routerLink: '/settings/contacts' },
        { label: 'Generate ID Master', icon: 'pi pi-key', routerLink: '/settings/generate-id' },
      ],
    },
  ]);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  protected signOut(): void {
    this.auth.logout();
  }
}
