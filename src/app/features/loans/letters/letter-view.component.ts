import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
} from '../../../shared/ui';
import {
  LoanLettersService,
  type LetterKind,
  type LetterRow,
} from '../services/loan-letters.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const TITLES: Record<LetterKind, string> = {
  sanction: 'Sanction Letters',
  disbursement: 'Disbursement Letters',
  deliveryorder: 'Delivery Orders',
  acknowledgement: 'Acknowledgements',
};

const LETTER_DETAIL_ROUTE: Record<LetterKind, string> = {
  sanction: '/loans/SanctionLetter',
  disbursement: '/loans/DisburementLetter',
  deliveryorder: '/loans/DeliveryorderNew',
  acknowledgement: '/loans/AcknowledgementsNew',
};

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Sent', value: 'Sent' },
  { label: 'All', value: 'All' },
];

/**
 * Single list shell for sanction / disbursement / delivery-order /
 * acknowledgement letters. The active `kind` is detected from the
 * route's `data.letterKind`. Sharing one component avoids duplicating
 * ~250 LOC of grid/filter scaffolding four times.
 */
@Component({
  selector: 'app-letter-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DataGridComponent, SelectComponent],
  template: `
    <div class="lt-view">
      <header>
        <h2>{{ title() }}</h2>
        @if (kind() !== 'acknowledgement') {
          <div class="filter">
            <label>Status</label>
            <app-select
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="status"
              [showClear]="false"
            />
          </div>
        }
      </header>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        [exportFilename]="exportFilename()"
        (rowDblClick)="open($event)"
      />
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 0.75rem;
      }
      header h2 { margin: 0; }
      .filter { display: flex; flex-direction: column; gap: 0.25rem; min-width: 200px; }
      .filter label { font-size: 0.85rem; }
    `,
  ],
})
export class LetterViewComponent implements OnInit {
  private readonly api = inject(LoanLettersService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<LetterKind>('sanction');
  protected readonly rows = signal<LetterRow[]>([]);
  protected readonly statusOptions = STATUS_OPTIONS;
  protected status: string = 'Pending';

  protected readonly columns: DataGridColumn<LetterRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Customer', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    { field: 'pVoucherno', header: 'Voucher', sortable: true, filter: true },
    {
      field: 'pAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pLetterDate', header: 'Date', sortable: true, align: 'center' },
    { field: 'pStatus', header: 'Status', sortable: true, align: 'center' },
  ];

  constructor() {
    effect(() => {
      const _s = this.status;
      this.load();
    });
  }

  ngOnInit(): void {
    const k = this.route.snapshot.data['letterKind'] as LetterKind | undefined;
    if (k) this.kind.set(k);
  }

  protected title(): string {
    return TITLES[this.kind()] ?? 'Letters';
  }

  protected exportFilename(): string {
    return `letters-${this.kind()}`;
  }

  private load(): void {
    this.loader.show();
    this.api.list(this.kind(), this.status).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load letters');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  open(row: LetterRow): void {
    const path = LETTER_DETAIL_ROUTE[this.kind()];
    void this.router.navigate([path, row.pVchapplicationid]);
  }
}
