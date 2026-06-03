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
  AccountingMastersService,
  type BankInformationRow,
} from '../services/accounting-masters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-bank-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="bank-view">
      <header>
        <h2>Bank Information</h2>
        <p-button label="New Bank" icon="pi pi-plus" (onClick)="newBank()" />
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="banks"
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
export class BankViewComponent implements OnInit {
  private readonly api = inject(AccountingMastersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<BankInformationRow[]>([]);

  protected readonly columns: DataGridColumn<BankInformationRow>[] = [
    { field: 'pbankname', header: 'Bank', sortable: true, filter: true },
    { field: 'pbranchname', header: 'Branch', sortable: true, filter: true },
    { field: 'paccountname', header: 'Account Name', sortable: true, filter: true },
    { field: 'paccountnumber', header: 'Account No', sortable: true, filter: true },
    { field: 'pifsccode', header: 'IFSC', sortable: true, filter: true },
    { field: 'pmicrcode', header: 'MICR', sortable: true, filter: true },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.listBanks().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load banks');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newBank(): void {
    this.api.newFormStatus.set('New');
    this.api.editingBankRecordId.set(null);
    void this.router.navigate(['/accounting/BankMaster']);
  }

  protected edit(row: BankInformationRow): void {
    this.api.newFormStatus.set('Edit');
    this.api.editingBankRecordId.set(row.precordid ?? null);
    void this.router.navigate(['/accounting/BankMaster']);
  }
}
