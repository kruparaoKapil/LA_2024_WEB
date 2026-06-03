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
  DateInputComponent,
} from '../../../shared/ui';
import { HrmsService, type HrmsReportRow } from '../services/hrms.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type HrmsChallanaKind = 'entry' | 'view';

@Component({
  selector: 'app-challana-hrms-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DataGridComponent,
    DateInputComponent,
  ],
  template: `
    <div class="ch-shell">
      <header><h2>{{ title() }}</h2></header>
      @if (kind() === 'entry') {
        <p-card>
          <div class="grid">
            <label class="field">
              <span>Challana Date</span>
              <app-date-input [(ngModel)]="challanaDate" name="date" />
            </label>
            <label class="field">
              <span>Amount</span>
              <input type="number" pInputText [(ngModel)]="amount" name="amt" />
            </label>
            <label class="field span-2">
              <span>Remarks</span>
              <input pInputText [(ngModel)]="remarks" name="rem" maxlength="200" />
            </label>
          </div>
          <p-button label="Save" icon="pi pi-save" class="mt" (onClick)="save()" [loading]="saving()" />
        </p-card>
      } @else {
        <p-card>
          <app-data-grid [rows]="rows()" [columns]="columns" exportFilename="hrms-challana" />
        </p-card>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .ch-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .span-2 { grid-column: span 2; }
      .mt { margin-top: 0.75rem; }
    `,
  ],
})
export class ChallanaHrmsShellComponent implements OnInit {
  private readonly api = inject(HrmsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<HrmsChallanaKind>('entry');
  protected readonly rows = signal<HrmsReportRow[]>([]);
  protected readonly saving = signal(false);

  protected challanaDate: Date | null = new Date();
  protected amount: number | null = null;
  protected remarks = '';

  protected readonly title = computed(() =>
    this.kind() === 'entry' ? 'Challana Entry (HRMS)' : 'View Challana Entry (HRMS)',
  );

  protected readonly columns: DataGridColumn<HrmsReportRow>[] = [
    { field: 'pChallanaNo', header: 'Challana #', sortable: true },
    { field: 'pChallanaDate', header: 'Date', align: 'center' },
    { field: 'pAmount', header: 'Amount', align: 'right' },
    { field: 'pRemarks', header: 'Remarks' },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as HrmsChallanaKind | undefined;
    if (k) this.kind.set(k);
    if (this.kind() === 'view') this.load();
  }

  private load(): void {
    this.loaderSvc.show();
    this.api.viewHrmsChallana().subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => this.toast.error(err?.message ?? 'Load failed'),
      complete: () => this.loaderSvc.hide(),
    });
  }

  protected save(): void {
    this.saving.set(true);
    this.api
      .saveHrmsChallana({
        pChallanaDate: this.challanaDate,
        pAmount: this.amount,
        pRemarks: this.remarks,
      })
      .subscribe({
        next: () => {
          this.toast.success('Challana saved.');
          this.amount = null;
          this.remarks = '';
          this.saving.set(false);
        },
        error: (err) => {
          this.toast.error(err?.message ?? 'Save failed');
          this.saving.set(false);
        },
      });
  }
}
