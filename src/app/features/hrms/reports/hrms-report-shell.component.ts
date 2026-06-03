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
import { InputTextModule } from 'primeng/inputtext';

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

export type HrmsReportKind =
  | 'salary-statement'
  | 'payroll-approval-report'
  | 'pay-slip'
  | 'loyalty-statement'
  | 'employee-monthly-bonus'
  | 'esi-statement'
  | 'pf-statement'
  | 'professional-tax'
  | 'earned-leaves'
  | 'biometric-attendance'
  | 'biometric-summary';

const TITLES: Record<HrmsReportKind, string> = {
  'salary-statement': 'Salary Statement',
  'payroll-approval-report': 'Payroll Approval Report',
  'pay-slip': 'Pay Slip',
  'loyalty-statement': 'Loyalty Statement',
  'employee-monthly-bonus': 'Employee Monthly Bonus',
  'esi-statement': 'ESI Statement',
  'pf-statement': 'PF Statement',
  'professional-tax': 'Professional Tax',
  'earned-leaves': 'Earned Leaves',
  'biometric-attendance': 'Biometric Attendance Report',
  'biometric-summary': 'Biometric Attendance Summary',
};

@Component({
  selector: 'app-hrms-report-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DataGridComponent,
    SelectComponent,
  ],
  template: `
    <div class="rep-shell">
      <header><h2>{{ title() }}</h2></header>
      <p-card>
        <div class="filters">
          @if (showCalendar()) {
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
          }
          @if (showDateRange()) {
            <label class="field">
              <span>From (YYYY-MM-DD)</span>
              <input pInputText [(ngModel)]="fromDate" name="from" />
            </label>
            <label class="field">
              <span>To</span>
              <input pInputText [(ngModel)]="toDate" name="to" />
            </label>
            <label class="field">
              <span>Branch Schema</span>
              <input pInputText [(ngModel)]="branchSchema" name="schema" />
            </label>
            @if (kind() === 'biometric-summary') {
              <label class="field">
                <span>Employee Code</span>
                <input pInputText [(ngModel)]="empCode" name="emp" />
              </label>
            }
            <label class="field">
              <span>Leave Type</span>
              <input pInputText [(ngModel)]="leaveType" name="leave" />
            </label>
          }
          <p-button label="Run" icon="pi pi-play" (onClick)="run()" [loading]="loading()" />
          @if (kind() === 'pay-slip') {
            <p-button
              label="Print"
              icon="pi pi-print"
              severity="secondary"
              [outlined]="true"
              [disabled]="!rows().length"
              (onClick)="print()"
            />
          }
        </div>
      </p-card>
      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns()"
          [exportFilename]="title()"
          emptyMessage="Select filters and run."
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .rep-shell { display: flex; flex-direction: column; gap: 0.75rem; }
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
export class HrmsReportShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<HrmsReportKind>('salary-statement');
  protected readonly rows = signal<HrmsReportRow[]>([]);
  protected readonly columns = signal<DataGridColumn<HrmsReportRow>[]>([]);
  protected readonly loading = signal(false);
  protected readonly years = signal<CalendarYear[]>([]);
  protected readonly months = signal<CalendarMonth[]>([]);

  protected calendarId: number | null = null;
  protected monthYear = '';
  protected branchId = 1;
  protected fromDate = '';
  protected toDate = '';
  protected branchSchema = '';
  protected empCode = '';
  protected leaveType = '';

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'HRMS Report');
  protected readonly showCalendar = computed(
    () => !['biometric-attendance', 'biometric-summary'].includes(this.kind()),
  );
  protected readonly showDateRange = computed(() =>
    ['biometric-attendance', 'biometric-summary'].includes(this.kind()),
  );

  ngOnInit(): void {
    const k = this.route.snapshot.data['reportKind'] as HrmsReportKind | undefined;
    if (k) this.kind.set(k);
    if (this.showCalendar()) {
      this.api.getCalendarYear().subscribe({
        next: (y) => this.years.set(y ?? []),
      });
    }
  }

  protected onYearChange(): void {
    if (this.calendarId == null) return;
    const fetch =
      this.kind() === 'loyalty-statement'
        ? this.api.getLoyaltyCalendarYearMonth(this.calendarId)
        : this.api.getCalendarYearMonthPayrollAuthorised(this.calendarId);
    fetch.subscribe({
      next: (m) => this.months.set(m ?? []),
    });
  }

  protected run(): void {
    this.loading.set(true);
    this.loaderSvc.show();
    const fetch = (() => {
      const k = this.kind();
      const m = this.monthYear;
      switch (k) {
        case 'pay-slip':
          return this.api.getPayslipDetails(m);
        case 'professional-tax':
          return this.api.getProfessionalTaxDetails(m);
        case 'esi-statement':
          return this.api.getEmployeeEsiDetails(this.branchId, m);
        case 'pf-statement':
          return this.api.getEmployeePfDetails(this.branchId, m);
        case 'loyalty-statement':
          return this.api.getLoyaltyReport(m);
        case 'employee-monthly-bonus':
          return this.api.getEmployeeBonusDetails(m);
        case 'earned-leaves':
          return this.api.getEmployeeElDetails(m);
        case 'payroll-approval-report':
          return this.api.getEmployeeDetailsPayrollApproved(this.branchId, m);
        case 'biometric-attendance':
          return this.api.getBiometricAttendanceReport(
            this.branchSchema,
            this.fromDate,
            this.toDate,
            this.leaveType,
          );
        case 'biometric-summary':
          return this.api.getBiometricAttendanceSummary(
            this.branchSchema,
            this.empCode,
            this.fromDate,
            this.toDate,
            this.leaveType,
          );
        case 'salary-statement':
        default:
          return this.api.getEmployeeDetailsPayroll(this.branchId, m);
      }
    })();

    fetch.subscribe({
      next: (data) => {
        const rows = Array.isArray(data) ? data : [];
        this.rows.set(rows);
        this.columns.set(this.deriveColumns(rows));
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Report failed');
        this.loading.set(false);
        this.loaderSvc.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loaderSvc.hide();
      },
    });
  }

  protected print(): void {
    window.print();
  }

  private deriveColumns(rows: HrmsReportRow[]): DataGridColumn<HrmsReportRow>[] {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first).map((field) => ({
      field,
      header: field.replace(/^p_?/i, '').replace(/([A-Z])/g, ' $1').trim(),
      sortable: true,
      filter: true,
      align:
        typeof first[field] === 'number'
          ? ('right' as const)
          : ('left' as const),
      format:
        typeof first[field] === 'number'
          ? (v: unknown) =>
              typeof v === 'number'
                ? new Intl.NumberFormat('en-IN').format(v)
                : String(v ?? '')
          : undefined,
    }));
  }
}
