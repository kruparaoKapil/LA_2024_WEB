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
import { HrmsService } from '../services/hrms.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DataGridComponent],
  template: `
    <div class="emp-view">
      <header>
        <h2>Employees</h2>
        <p-button label="New Employee" icon="pi pi-plus" (onClick)="newEmployee()" />
      </header>
      <app-data-grid
        [rows]="rows()"
        [columns]="columns"
        selectionMode="single"
        exportFilename="employees"
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
export class EmployeeViewComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly rows = signal<Record<string, unknown>[]>([]);

  protected readonly columns: DataGridColumn<Record<string, unknown>>[] = [
    { field: 'pEmployeeCode', header: 'Code', sortable: true, filter: true },
    { field: 'pEmployeeName', header: 'Name', sortable: true, filter: true },
    { field: 'pDesignation', header: 'Designation', sortable: true, filter: true },
    { field: 'pBranchName', header: 'Branch', sortable: true },
    { field: 'pStatus', header: 'Status', align: 'center' },
  ];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loader.show();
    this.api.listEmployees().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Failed to load employees');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  protected newEmployee(): void {
    this.api.editingEmployeeId.set(null);
    this.api.editingEmployeeData.set(null);
    void this.router.navigate(['/hrms/EmployeeNewHrms']);
  }

  protected edit(row: Record<string, unknown>): void {
    const id = row['pEmployeeId'] as number | undefined;
    this.api.editingEmployeeId.set(id ?? null);
    this.api.editingEmployeeData.set(row);
    void this.router.navigate(['/hrms/EmployeeNewHrms', id ?? '']);
  }
}
