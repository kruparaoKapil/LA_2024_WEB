import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import {
  DataGridComponent,
  type DataGridColumn,
  DateInputComponent,
} from '../../../shared/ui';
import {
  DepositsService,
  type BondPreviewRow,
} from '../services/deposits.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Bond preview: pick the issue date, list bonds eligible for printing,
 * select rows and print as native browser preview. Replaces the
 * Kendo-based 800+ LOC `bond-preview.component.ts`.
 */
@Component({
  selector: 'app-bond-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataGridComponent,
    DateInputComponent,
  ],
  template: `
    <div class="bp">
      <header>
        <h2>Bond Preview</h2>
        <div class="filters">
          <app-date-input [(ngModel)]="issueDate" name="issueDate" placeholder="Issue date" />
          <p-button
            label="Load"
            icon="pi pi-search"
            (onClick)="load()"
            [loading]="loading()"
          />
          <p-button
            label="Print Selected"
            icon="pi pi-print"
            severity="secondary"
            [outlined]="true"
            [disabled]="!selectedRows.length"
            (onClick)="print()"
          />
        </div>
      </header>

      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns"
          selectionMode="multi"
          [(selection)]="selectedRows"
          exportFilename="bond-preview"
          emptyMessage="Pick an issue date and load."
        />
      </p-card>

      <div class="printable" *ngIf="selectedRows.length">
        @for (row of selectedRows; track row.pAccountNo) {
          <div class="bond-card">
            <h3>Fixed Deposit Bond</h3>
            <table>
              <tr><td>Account No</td><td>{{ row.pAccountNo }}</td></tr>
              <tr><td>Member</td><td>{{ row.pMemberName }}</td></tr>
              <tr><td>Scheme</td><td>{{ row.pSchemeName }}</td></tr>
              <tr><td>Issue Date</td><td>{{ row.pIssueDate }}</td></tr>
              <tr><td>Maturity Date</td><td>{{ row.pMaturityDate }}</td></tr>
              <tr><td>Deposit Amount</td><td>{{ row.pDepositAmount | number: '1.0-0':'en-IN' }}</td></tr>
              <tr><td>Interest Rate</td><td>{{ row.pInterestRate }}%</td></tr>
              <tr><td>Maturity Amount</td><td>{{ row.pMaturityAmount | number: '1.0-0':'en-IN' }}</td></tr>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .bp { display: flex; flex-direction: column; gap: 0.75rem; }
      header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
      header h2 { margin: 0; }
      .filters { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
      .printable { display: none; }
      .bond-card {
        border: 2px solid #000;
        padding: 1rem;
        margin-bottom: 1rem;
        page-break-after: always;
      }
      .bond-card h3 { margin: 0 0 0.5rem 0; text-align: center; }
      .bond-card table { width: 100%; border-collapse: collapse; }
      .bond-card td { padding: 0.25rem 0.5rem; border: 1px solid #999; }
      .bond-card td:first-child { font-weight: 600; width: 40%; }
      @media print {
        header, p-card { display: none !important; }
        .printable { display: block; }
      }
    `,
  ],
})
export class BondPreviewComponent implements OnInit {
  private readonly api = inject(DepositsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);

  protected issueDate: Date | null = new Date();
  protected readonly rows = signal<BondPreviewRow[]>([]);
  protected selectedRows: BondPreviewRow[] = [];
  protected readonly loading = signal<boolean>(false);

  protected readonly columns: DataGridColumn<BondPreviewRow>[] = [
    { field: 'pAccountNo', header: 'Account No', sortable: true, filter: true },
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
    { field: 'pIssueDate', header: 'Issue Date', sortable: true, align: 'center' },
    { field: 'pMaturityDate', header: 'Maturity Date', sortable: true, align: 'center' },
  ];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loader.show();
    const d = this.issueDate ? this.issueDate.toISOString().slice(0, 10) : undefined;
    this.api.getBondPreviewList(d).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load bonds');
        this.loading.set(false);
        this.loader.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loader.hide();
      },
    });
  }

  protected print(): void {
    const accNos = this.selectedRows.map((r) => r.pAccountNo).join(',');
    if (!accNos) return;
    this.api.saveBondPreview({ fdaccountnos: accNos, printedOn: new Date() }).subscribe({
      next: () => window.print(),
      error: (err) => this.toast.error(err?.message ?? 'Failed to record print'),
    });
  }
}
