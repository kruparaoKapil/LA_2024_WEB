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
  ApprovalService,
  type ApprovalRow,
  type ApprovalViewType,
} from '../services/approval.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const STATUS_OPTIONS: { label: string; value: ApprovalViewType }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'All', value: 'ALL' },
];

/**
 * Approval list — filtered by status segment. Replaces the legacy
 * `ApprovalListComponent` (kendo-grid + tab pills).
 */
@Component({
  selector: 'app-approval-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DataGridComponent, SelectComponent],
  template: `
    <div class="approval-view">
      <header>
        <h2>Loan Approvals</h2>
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
      </header>

      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="approvals"
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
export class ApprovalViewComponent implements OnInit {
  private readonly api = inject(ApprovalService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly rows = signal<ApprovalRow[]>([]);
  protected status: ApprovalViewType = 'PENDING';

  protected readonly columns: DataGridColumn<ApprovalRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Applicant', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    { field: 'pSchemeName', header: 'Scheme', sortable: true, filter: true },
    {
      field: 'pLoanAmount',
      header: 'Requested',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    {
      field: 'pApprovedAmount',
      header: 'Approved',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, filter: true, align: 'center' },
  ];

  constructor() {
    effect(() => {
      const _ = this.status;
      this.load();
    });
  }

  ngOnInit(): void {
    const initial = this.route.snapshot.data['status'] as ApprovalViewType | undefined;
    if (initial) this.status = initial;
  }

  private load(): void {
    this.loader.show();
    this.api.getApprovalsByStatus(this.status).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load approvals');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  open(row: ApprovalRow): void {
    void this.router.navigate(['/loans/Approval', row.pVchapplicationid]);
  }
}
