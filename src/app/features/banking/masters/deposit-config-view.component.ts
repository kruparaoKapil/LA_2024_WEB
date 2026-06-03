import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import {
  DataGridComponent,
  type DataGridColumn,
} from '../../../shared/ui';
import {
  BankingMastersService,
  type DepositConfigRow,
  type DepositKind,
} from '../services/banking-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<DepositKind, string> = {
  fd: 'FD Configurations',
  rd: 'RD Configurations',
};

const NEW_ROUTE: Record<DepositKind, string> = {
  fd: '/banking/FdNew',
  rd: '/banking/RdNew',
};

/**
 * Single list shell for FD-Config and RD-Config screens, parameterised
 * by `data.kind`. Replaces two near-identical legacy view components.
 */
@Component({
  selector: 'app-deposit-config-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="dc-view">
      <header>
        <h2>{{ title() }}</h2>
        <p-button
          [label]="'New ' + (kind() === 'fd' ? 'FD' : 'RD')"
          icon="pi pi-plus"
          (onClick)="newConfig()"
        />
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        [exportFilename]="exportFilename()"
        (rowDblClick)="edit($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      header h2 { margin: 0; }
    `,
  ],
})
export class DepositConfigViewComponent implements OnInit {
  private readonly api = inject(BankingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<DepositKind>('fd');
  protected readonly rows = signal<DepositConfigRow[]>([]);

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Deposit Configs');
  protected readonly exportFilename = computed(() =>
    this.kind() === 'fd' ? 'fd-configs' : 'rd-configs',
  );

  protected readonly columns: DataGridColumn<DepositConfigRow>[] = [
    { field: 'pName', header: 'Name', sortable: true, filter: true },
    { field: 'pCode', header: 'Code', sortable: true, filter: true },
    { field: 'pTenureMode', header: 'Tenure Mode', sortable: true, align: 'center' },
    {
      field: 'pTenure',
      header: 'Tenure',
      sortable: true,
      align: 'right',
    },
    {
      field: 'pInterestRate',
      header: 'Rate %',
      sortable: true,
      align: 'right',
      format: (v) => (typeof v === 'number' ? `${v.toFixed(2)}%` : ''),
    },
    { field: 'pInterestPayout', header: 'Payout', sortable: true, align: 'center' },
    { field: 'pIsActive', header: 'Active', align: 'center' },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as DepositKind | undefined;
    if (k) this.kind.set(k);
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.listDepositConfigs(this.kind()).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load configs');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newConfig(): void {
    if (this.kind() === 'fd') this.api.editingFdConfig.set(null);
    else this.api.editingRdConfig.set(null);
    this.api.newFormStatus.set('New');
    void this.router.navigate([NEW_ROUTE[this.kind()]]);
  }

  protected edit(row: DepositConfigRow): void {
    const ref = { name: row.pName ?? '', code: row.pCode ?? '' };
    if (this.kind() === 'fd') this.api.editingFdConfig.set(ref);
    else this.api.editingRdConfig.set(ref);
    this.api.newFormStatus.set('Edit');
    void this.router.navigate([NEW_ROUTE[this.kind()], row.pConfigId ?? '']);
  }
}
