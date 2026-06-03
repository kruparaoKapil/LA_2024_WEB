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
  selector: 'app-jv-details-shell',
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
    <div class="jv-shell">
      <header><h2>JV Details</h2></header>
      <p-card>
        <div class="filters">
          <label class="field">
            <span>JV Type</span>
            <app-select
              [options]="jvTypes()"
              optionLabel="pTypeName"
              optionValue="pTypeName"
              [(ngModel)]="jvType"
              [showClear]="false"
            />
          </label>
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
          <p-button label="Load" icon="pi pi-search" (onClick)="load()" />
          <p-button label="Save" icon="pi pi-save" severity="success" [disabled]="!rows().length" (onClick)="save()" />
        </div>
      </p-card>
      <p-card>
        <app-data-grid [rows]="rows()" [columns]="columns" exportFilename="jv-details" />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .jv-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: flex-end; gap: 0.5rem 1rem; flex-wrap: wrap; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class JvDetailsShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);

  protected readonly rows = signal<HrmsReportRow[]>([]);
  protected readonly years = signal<CalendarYear[]>([]);
  protected readonly months = signal<CalendarMonth[]>([]);
  protected readonly jvTypes = signal<Record<string, unknown>[]>([]);

  protected jvType = '';
  protected calendarId: number | null = null;
  protected monthYear = '';

  protected readonly columns: DataGridColumn<HrmsReportRow>[] = [
    { field: 'pLedgerName', header: 'Ledger', sortable: true, filter: true },
    { field: 'pAmount', header: 'Amount', align: 'right', sortable: true },
    { field: 'pNarration', header: 'Narration' },
  ];

  ngOnInit(): void {
    this.api.getJvAllowanceTypes().subscribe({
      next: (t) => this.jvTypes.set((t as Record<string, unknown>[]) ?? []),
    });
    this.api.getCalendarYear().subscribe({
      next: (y) => this.years.set(y ?? []),
    });
  }

  protected onYearChange(): void {
    if (this.calendarId == null) return;
    this.api
      .getCalendarYearMonthPayrollAuthorised(this.calendarId)
      .subscribe({
        next: (m) => this.months.set(m ?? []),
      });
  }

  protected load(): void {
    if (!this.jvType || !this.monthYear) return;
    this.loaderSvc.show();
    this.api.getJvDetailsByType(this.jvType, this.monthYear).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => this.toast.error(err?.message ?? 'Load failed'),
      complete: () => this.loaderSvc.hide(),
    });
  }

  protected save(): void {
    this.loaderSvc.show();
    this.api
      .saveJvDetails({ rows: this.rows(), jvType: this.jvType, monthYear: this.monthYear })
      .subscribe({
        next: () => {
          this.toast.success('JV details saved.');
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
