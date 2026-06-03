import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import {
  DataGridComponent,
  type DataGridColumn,
} from '../../../shared/ui';
import {
  DepositsService,
  type DepositAccountRow,
} from '../services/deposits.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-deposit-account-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="da-view">
      <header>
        <h2>Deposit Accounts</h2>
        <p-button label="New FD Account" icon="pi pi-plus" (onClick)="newAccount()" />
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="fd-accounts"
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
export class DepositAccountViewComponent implements OnInit {
  private readonly api = inject(DepositsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<DepositAccountRow[]>([]);

  protected readonly columns: DataGridColumn<DepositAccountRow>[] = [
    { field: 'pAccountNo', header: 'Account No', sortable: true, filter: true },
    { field: 'pMemberCode', header: 'Member Code', sortable: true, filter: true },
    { field: 'pMemberName', header: 'Member', sortable: true, filter: true },
    { field: 'pSchemeName', header: 'Scheme', sortable: true, filter: true },
    {
      field: 'pDepositAmount',
      header: 'Deposit',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pInterestRate',
      header: 'Rate %',
      align: 'right',
      sortable: true,
      format: (v) => (typeof v === 'number' ? `${v.toFixed(2)}%` : ''),
    },
    {
      field: 'pMaturityAmount',
      header: 'Maturity',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pMaturityDate', header: 'Maturity Date', sortable: true, align: 'center' },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.listFdAccounts().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load deposits');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newAccount(): void {
    this.api.editingDeposit.set(null);
    this.api.newFormStatus.set('New');
    void this.router.navigate(['/banking/FDACCreationNew']);
  }

  protected edit(row: DepositAccountRow): void {
    this.api.editingDeposit.set({
      accountId: row.pAccountId ?? 0,
      accountNo: row.pAccountNo ?? '',
      kind: 'fd',
    });
    this.api.newFormStatus.set('Edit');
    void this.router.navigate(['/banking/FDACCreationNew', row.pAccountNo]);
  }
}
