import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  DateInputComponent,
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import { HrmsService } from '../services/hrms.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

interface EmployeeForm {
  pEmployeeId?: number;
  pEmployeeCode: string;
  pEmployeeName: string;
  pDesignation: string;
  pBranchName: string;
  pPhone: string;
  pEmail: string;
  pDateOfJoining: Date | null;
  pDateOfBirth: Date | null;
  pPanNumber: string;
  pStatus: string;
  [key: string]: unknown;
}

const EMPTY: EmployeeForm = {
  pEmployeeCode: '',
  pEmployeeName: '',
  pDesignation: '',
  pBranchName: '',
  pPhone: '',
  pEmail: '',
  pDateOfJoining: new Date(),
  pDateOfBirth: null,
  pPanNumber: '',
  pStatus: 'Active',
};

@Component({
  selector: 'app-employee-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DateInputComponent,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="emp-form">
      <header class="eh">
        <h2>{{ heading() }}</h2>
        <div class="actions">
          <p-button label="Save" icon="pi pi-save" (onClick)="save()" [loading]="saving()" [disabled]="!isValid()" />
          <p-button label="Cancel" severity="secondary" [outlined]="true" icon="pi pi-times" (onClick)="cancel()" />
        </div>
      </header>
      <p-card>
        <div class="grid">
          <label class="field">
            <span>Employee Code<sup>*</sup></span>
            <input pInputText [(ngModel)]="form.pEmployeeCode" maxlength="20" />
            <app-validation-message [message]="errors().code" />
          </label>
          <label class="field">
            <span>Name<sup>*</sup></span>
            <input pInputText [(ngModel)]="form.pEmployeeName" maxlength="100" />
            <app-validation-message [message]="errors().name" />
          </label>
          <label class="field">
            <span>Designation</span>
            <app-select
              [options]="designations()"
              optionLabel="pDesignationName"
              optionValue="pDesignationName"
              [(ngModel)]="form.pDesignation"
            />
          </label>
          <label class="field">
            <span>Branch</span>
            <app-select
              [options]="branches()"
              optionLabel="pBranchName"
              optionValue="pBranchName"
              [(ngModel)]="form.pBranchName"
            />
          </label>
          <label class="field">
            <span>Phone</span>
            <input pInputText [(ngModel)]="form.pPhone" maxlength="10" />
          </label>
          <label class="field">
            <span>Email</span>
            <input pInputText [(ngModel)]="form.pEmail" maxlength="100" />
          </label>
          <label class="field">
            <span>PAN</span>
            <input pInputText [(ngModel)]="form.pPanNumber" maxlength="10" />
          </label>
          <label class="field">
            <span>Date of Joining</span>
            <app-date-input [(ngModel)]="form.pDateOfJoining" />
          </label>
          <label class="field">
            <span>Date of Birth</span>
            <app-date-input [(ngModel)]="form.pDateOfBirth" [maxDate]="today" />
          </label>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .emp-form { display: flex; flex-direction: column; gap: 0.75rem; }
      .eh { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
      .eh h2 { margin: 0; }
      .actions { display: flex; gap: 0.5rem; }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
    `,
  ],
})
export class EmployeeShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly today = new Date();
  protected readonly designations = signal<Record<string, unknown>[]>([]);
  protected readonly branches = signal<Record<string, unknown>[]>([]);
  protected readonly saving = signal(false);

  protected form: EmployeeForm = { ...EMPTY };
  protected readonly errors = signal({ code: '', name: '' });

  protected readonly heading = computed(() =>
    this.api.editingEmployeeId() ? 'Edit Employee' : 'New Employee',
  );
  protected readonly isValid = computed(
    () => !!this.form.pEmployeeCode && !!this.form.pEmployeeName,
  );

  ngOnInit(): void {
    this.api.getDesignations().subscribe({
      next: (r) => this.designations.set((r as Record<string, unknown>[]) ?? []),
    });
    this.api.getBranchNames().subscribe({
      next: (r) => this.branches.set((r as Record<string, unknown>[]) ?? []),
    });

    const cached = this.api.editingEmployeeData();
    if (cached) {
      this.form = { ...EMPTY, ...cached } as EmployeeForm;
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loader.show();
      this.api.getEmployeeById(Number(id)).subscribe({
        next: (data) => {
          if (data && typeof data === 'object') {
            this.form = { ...EMPTY, ...(data as Record<string, unknown>) } as EmployeeForm;
          }
        },
        error: (err) => this.toast.error(err?.message ?? 'Load failed'),
        complete: () => this.loader.hide(),
      });
    }
  }

  protected save(): void {
    if (!this.isValid()) {
      this.errors.set({
        code: this.form.pEmployeeCode ? '' : 'Code is required.',
        name: this.form.pEmployeeName ? '' : 'Name is required.',
      });
      return;
    }
    this.saving.set(true);
    this.api.saveContactEmployee(this.form).subscribe({
      next: () => {
        this.toast.success('Employee saved.');
        this.cancel();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }

  protected cancel(): void {
    void this.router.navigate(['/hrms/EmployeeNewView']);
  }
}
