import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
} from '../../../shared/ui';
import {
  HrmsService,
  type CalendarMonth,
  type CalendarYear,
  type HrmsReportRow,
} from '../services/hrms.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type PayrollKind = 'process' | 'approval';

const TITLES: Record<PayrollKind, string> = {
  process: 'Payroll Process',
  approval: 'Payroll Approval',
};

@Component({
  selector: 'app-payroll-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataGridComponent,
    SelectComponent,
  ],
  template: `
    <div class="pay-shell">
      <header><h2>{{ title() }}</h2></header>
      <p-card>
        <div class="filters">
          <label class="field">
            <span>Calendar Year</span>
            <app-select
              [options]="years()"
              optionLabel="pYearName"
              optionValue="pCalendarId"
              [(ngModel)]="calendarId"
              (ngModelChange)="onYearChange()"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>Month</span>
            <app-select
              [options]="months()"
              optionLabel="pMonthName"
              optionValue="pMonthYear"
              [(ngModel)]="monthYear"
              [showClear]="false"
            />
          </label>
          <p-button label="Load" icon="pi pi-search" (onClick)="load()" [loading]="loading()" />
          <p-button
            [label]="kind() === 'process' ? 'Save Payroll' : 'Authorise'"
            icon="pi pi-save"
            severity="success"
            [disabled]="!rows().length"
            (onClick)="save()"
          />
        </div>
      </p-card>
      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns"
          selectionMode="multi"
          [(selection)]="selectedRows"
          [exportFilename]="title()"
          emptyMessage="Pick year + month and load employees."
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .pay-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem 1rem;
        flex-wrap: wrap;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class PayrollShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<PayrollKind>('process');
  protected readonly rows = signal<HrmsReportRow[]>([]);
  protected readonly loading = signal(false);
  protected readonly years = signal<CalendarYear[]>([]);
  protected readonly months = signal<CalendarMonth[]>([]);
  protected selectedRows: HrmsReportRow[] = [];

  protected calendarId: number | null = null;
  protected monthYear = '';
  protected branchId = 1;

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Payroll');

  protected readonly columns: DataGridColumn<HrmsReportRow>[] = [
    { field: 'pEmployeeCode', header: 'Code', sortable: true, filter: true },
    { field: 'pEmployeeName', header: 'Name', sortable: true, filter: true },
    { field: 'pDeptName', header: 'Department', sortable: true },
    {
      field: 'pGrossSalary',
      header: 'Gross',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : String(v ?? ''),
    },
    {
      field: 'pNetSalary',
      header: 'Net',
      align: 'right',
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : String(v ?? ''),
    },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as PayrollKind | undefined;
    if (k) this.kind.set(k);
    this.api.getCalendarYear().subscribe({
      next: (y) => this.years.set(y ?? []),
    });
  }

  protected onYearChange(): void {
    if (this.calendarId == null) return;
    const fetch =
      this.kind() === 'approval'
        ? this.api.getCalendarYearMonthPayrollBeforeAuthorised(this.calendarId)
        : this.api.getCalendarYearMonthPayroll(this.calendarId);
    fetch.subscribe({
      next: (m) => this.months.set(m ?? []),
    });
  }

  protected load(): void {
    if (!this.monthYear) {
      this.toast.warn('Select a payroll month.');
      return;
    }
    this.loading.set(true);
    this.loaderSvc.show();
    const fetch =
      this.kind() === 'approval'
        ? this.api.getEmployeeDetailsPayrollApproval(this.branchId, this.monthYear)
        : this.api.getEmployeeDetailsPayroll(this.branchId, this.monthYear);
    fetch.subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Load failed');
        this.loading.set(false);
        this.loaderSvc.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loaderSvc.hide();
      },
    });
  }

  protected save(): void {
    const payload = { rows: this.selectedRows.length ? this.selectedRows : this.rows() };
    const save =
      this.kind() === 'approval'
        ? this.api.authoriseEmpPayroll('APPROVE', payload)
        : this.api.saveEmpPayroll(payload);
    this.loaderSvc.show();
    save.subscribe({
      next: () => {
        this.toast.success(`${this.title()} saved.`);
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.loaderSvc.hide();
      },
      complete: () => this.loaderSvc.hide(),
    });
  }
}
