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

@Component({
  selector: 'app-attendance-shell',
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
    <div class="att-shell">
      <header><h2>Employee Attendance</h2></header>
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
            label="Save"
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
          exportFilename="employee-attendance"
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .att-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: flex-end; gap: 0.5rem 1rem; flex-wrap: wrap; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class AttendanceShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);

  protected readonly rows = signal<HrmsReportRow[]>([]);
  protected readonly loading = signal(false);
  protected readonly years = signal<CalendarYear[]>([]);
  protected readonly months = signal<CalendarMonth[]>([]);
  protected selectedRows: HrmsReportRow[] = [];

  protected calendarId: number | null = null;
  protected monthYear = '';
  protected branchId = 1;

  protected readonly columns: DataGridColumn<HrmsReportRow>[] = [
    { field: 'pEmployeeCode', header: 'Code', sortable: true, filter: true },
    { field: 'pEmployeeName', header: 'Name', sortable: true, filter: true },
    { field: 'pPresentDays', header: 'Present', align: 'right', sortable: true },
    { field: 'pAbsentDays', header: 'Absent', align: 'right', sortable: true },
    { field: 'pLossOfPay', header: 'LOP', align: 'right', sortable: true },
  ];

  ngOnInit(): void {
    this.api.getCalendarYear().subscribe({
      next: (y) => this.years.set(y ?? []),
    });
  }

  protected onYearChange(): void {
    if (this.calendarId == null) return;
    this.api.getCalendarYearMonth(this.calendarId).subscribe({
      next: (m) => this.months.set(m ?? []),
    });
  }

  protected load(): void {
    if (!this.monthYear) return;
    this.loading.set(true);
    this.loaderSvc.show();
    this.api
      .getEmployeeDetailsAttendance(this.branchId, this.monthYear)
      .subscribe({
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
    const payload = {
      rows: this.selectedRows.length ? this.selectedRows : this.rows(),
      MonthYear: this.monthYear,
    };
    this.loaderSvc.show();
    this.api.saveEmployeeAttendance(payload).subscribe({
      next: () => {
        this.toast.success('Attendance saved.');
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
