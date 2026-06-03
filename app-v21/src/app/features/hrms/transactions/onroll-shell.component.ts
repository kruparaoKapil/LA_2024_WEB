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
  TabsComponent,
  type TabItem,
} from '../../../shared/ui';
import { HrmsService, type HrmsReportRow } from '../services/hrms.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

interface EmployeeOption {
  pEmployeeId: number;
  pEmployeeName: string;
  pEmployeeCode?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-onroll-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataGridComponent,
    SelectComponent,
    TabsComponent,
  ],
  template: `
    <div class="on-shell">
      <header><h2>Employee On-Roll</h2></header>
      <p-card>
        <label class="field">
          <span>Employee</span>
          <app-select
            [options]="employees()"
            optionLabel="pEmployeeName"
            optionValue="pEmployeeId"
            [(ngModel)]="employeeId"
            (ngModelChange)="loadTab()"
            placeholder="Pick employee"
          />
        </label>
      </p-card>
      <app-tabs [items]="tabs" [(active)]="activeTab">
        <ng-template #tabContent let-id>
          @switch (id) {
            @case ('allowances') {
              <app-data-grid [rows]="allowances()" [columns]="lineColumns" [paginator]="false" />
            }
            @case ('recoveries') {
              <app-data-grid [rows]="recoveries()" [columns]="lineColumns" [paginator]="false" />
            }
            @case ('advances') {
              <app-data-grid [rows]="advances()" [columns]="lineColumns" [paginator]="false" />
            }
          }
        </ng-template>
      </app-tabs>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .on-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; max-width: 320px; }
    `,
  ],
})
export class OnrollShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);

  protected readonly tabs: TabItem[] = [
    { id: 'allowances', label: 'Allowances' },
    { id: 'recoveries', label: 'Recoveries' },
    { id: 'advances', label: 'Advances' },
  ];
  protected activeTab = 'allowances';

  protected readonly employees = signal<EmployeeOption[]>([]);
  protected readonly allowances = signal<HrmsReportRow[]>([]);
  protected readonly recoveries = signal<HrmsReportRow[]>([]);
  protected readonly advances = signal<HrmsReportRow[]>([]);

  protected employeeId: number | null = null;
  protected branchId = 1;

  protected readonly lineColumns: DataGridColumn<HrmsReportRow>[] = [
    { field: 'pTypeName', header: 'Type', sortable: true },
    { field: 'pAmount', header: 'Amount', align: 'right', sortable: true },
    { field: 'pRemarks', header: 'Remarks' },
  ];

  ngOnInit(): void {
    this.loaderSvc.show();
    this.api.getEmployeeDetailsOnroll(this.branchId).subscribe({
      next: (rows) =>
        this.employees.set((rows as EmployeeOption[]) ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load employees'),
      complete: () => this.loaderSvc.hide(),
    });
  }

  protected loadTab(): void {
    if (this.employeeId == null) return;
    this.loaderSvc.show();
    const id = this.employeeId;
    const done = () => this.loaderSvc.hide();
    if (this.activeTab === 'allowances') {
      this.api.getAllowanceDetails(id).subscribe({
        next: (r) => this.allowances.set((r as HrmsReportRow[]) ?? []),
        error: (e) => this.toast.error(e?.message ?? 'Load failed'),
        complete: done,
      });
    } else if (this.activeTab === 'recoveries') {
      this.api.getRecoveryDetails(id).subscribe({
        next: (r) => this.recoveries.set((r as HrmsReportRow[]) ?? []),
        error: (e) => this.toast.error(e?.message ?? 'Load failed'),
        complete: done,
      });
    } else {
      this.api.getAdvanceDetails(id).subscribe({
        next: (r) => this.advances.set((r as HrmsReportRow[]) ?? []),
        error: (e) => this.toast.error(e?.message ?? 'Load failed'),
        complete: done,
      });
    }
  }
}
