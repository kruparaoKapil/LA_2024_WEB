import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataGridComponent, type DataGridColumn } from '../../../shared/ui';
import {
  VerificationService,
  type VerificationRow,
  type VerificationKind,
} from '../services/verification.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

/**
 * Verification list — used by Tele / Document / Field verification routes
 * which all share the same applicants endpoint and only differ by the
 * detail screen. The active `kind` is detected from the route data.
 */
@Component({
  selector: 'app-verification-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent],
  template: `
    <div class="ver-view">
      <h2>{{ title() }}</h2>
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
      .ver-view h2 { margin: 0 0 0.75rem 0; }
    `,
  ],
})
export class VerificationViewComponent implements OnInit {
  private readonly api = inject(VerificationService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly rows = signal<VerificationRow[]>([]);
  protected readonly kind = signal<VerificationKind>('Tele');

  protected title(): string {
    const k = this.kind();
    return `${k} Verification`;
  }

  protected exportFilename(): string {
    return `verification-${this.kind().toLowerCase()}`;
  }

  protected readonly columns: DataGridColumn<VerificationRow>[] = [
    { field: 'pVchapplicationid', header: 'Application ID', sortable: true, filter: true },
    { field: 'pContactName', header: 'Applicant', sortable: true, filter: true },
    { field: 'pLoanName', header: 'Loan', sortable: true, filter: true },
    { field: 'pSchemeName', header: 'Scheme', sortable: true, filter: true },
    {
      field: 'pLoanAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : (v as string) ?? '',
    },
    { field: 'pStatus', header: 'Status', sortable: true, filter: true, align: 'center' },
  ];

  ngOnInit(): void {
    const dataKind = this.route.snapshot.data['kind'] as VerificationKind | undefined;
    if (dataKind) this.kind.set(dataKind);
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.getAllApplicantVerifications().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load verifications');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  open(row: VerificationRow): void {
    const seg = this.kind() === 'Field'
      ? 'Fieldverification'
      : this.kind() === 'Document'
        ? 'Documentverification'
        : 'Televerification';
    void this.router.navigate(['/loans', seg, row.pVchapplicationid]);
  }
}
