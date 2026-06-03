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
  SelectComponent,
} from '../../../shared/ui';
import {
  TdsService,
  type TdsReportRow,
} from '../services/tds.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

export type ChallanaTdsKind = 'checking' | 'payment' | 'cin-entry';

const TITLES: Record<ChallanaTdsKind, string> = {
  checking: 'Challana Checking',
  payment: 'Challana Payment',
  'cin-entry': 'CIN Entry',
};

@Component({
  selector: 'app-challana-tds-shell',
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
    SelectComponent,
  ],
  template: `
    <div class="ch-shell">
      <header><h2>{{ title() }}</h2></header>
      <p-card>
        <div class="filters">
          @if (kind() === 'checking') {
            <label class="field">
              <span>From</span>
              <app-date-input [(ngModel)]="fromDate" name="from" />
            </label>
            <label class="field">
              <span>To</span>
              <app-date-input [(ngModel)]="toDate" name="to" />
            </label>
            <label class="field">
              <span>Section</span>
              <app-select
                [options]="sections()"
                optionLabel="pSectionName"
                optionValue="pSectionName"
                [(ngModel)]="sectionName"
              />
            </label>
            <p-button label="Load" icon="pi pi-search" (onClick)="loadChecking()" />
            <p-button
              label="Save Selected"
              icon="pi pi-save"
              severity="success"
              [disabled]="!selectedRows.length"
              (onClick)="saveChallanaEntry()"
            />
          } @else {
            <label class="field">
              <span>Challana #</span>
              <app-select
                [options]="challanaNumbers()"
                optionLabel="pChallanaNo"
                optionValue="pChallanaNo"
                [(ngModel)]="challanaNo"
                (ngModelChange)="loadByChallana()"
              />
            </label>
            @if (kind() === 'cin-entry') {
              <label class="field">
                <span>CIN Number</span>
                <input pInputText [(ngModel)]="cinNumber" name="cin" maxlength="30" />
              </label>
            }
            <p-button
              [label]="kind() === 'payment' ? 'Save Payment' : 'Save CIN'"
              icon="pi pi-save"
              (onClick)="save()"
              [loading]="saving()"
            />
          }
        </div>
      </p-card>
      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns"
          [selectionMode]="kind() === 'checking' ? 'multi' : 'none'"
          [(selection)]="selectedRows"
          [exportFilename]="title()"
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .ch-shell { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: flex-end; gap: 0.5rem 1rem; flex-wrap: wrap; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
    `,
  ],
})
export class ChallanaTdsShellComponent implements OnInit {
  private readonly api = inject(TdsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind = signal<ChallanaTdsKind>('checking');
  protected readonly rows = signal<TdsReportRow[]>([]);
  protected readonly sections = signal<Record<string, unknown>[]>([]);
  protected readonly challanaNumbers = signal<Record<string, unknown>[]>([]);
  protected readonly saving = signal(false);
  protected selectedRows: TdsReportRow[] = [];

  protected fromDate: Date | null = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  })();
  protected toDate: Date | null = new Date();
  protected sectionName = '';
  protected challanaNo = '';
  protected cinNumber = '';
  protected companyType = '';
  protected panPer = '';

  protected readonly title = computed(() => TITLES[this.kind()] ?? 'Challana');

  protected readonly columns: DataGridColumn<TdsReportRow>[] = [
    { field: 'pPanNo', header: 'PAN', sortable: true, filter: true },
    { field: 'pPartyName', header: 'Party', sortable: true, filter: true },
    {
      field: 'pTdsAmount',
      header: 'TDS',
      align: 'right',
      sortable: true,
      format: (v) =>
        typeof v === 'number'
          ? new Intl.NumberFormat('en-IN').format(v)
          : String(v ?? ''),
    },
    { field: 'pSection', header: 'Section', sortable: true },
  ];

  ngOnInit(): void {
    const k = this.route.snapshot.data['kind'] as ChallanaTdsKind | undefined;
    if (k) this.kind.set(k);
    this.api.getChallanaSections().subscribe({
      next: (s) => this.sections.set((s as Record<string, unknown>[]) ?? []),
    });
    if (this.kind() !== 'checking') {
      const nums =
        this.kind() === 'payment'
          ? this.api.getChallanaPaymentNumbers()
          : this.api.getCinEntryChallanaNumbers();
      nums.subscribe({
        next: (n) => this.challanaNumbers.set((n as Record<string, unknown>[]) ?? []),
      });
    }
  }

  protected loadChecking(): void {
    const from = this.fromDate?.toISOString().slice(0, 10) ?? '';
    const to = this.toDate?.toISOString().slice(0, 10) ?? '';
    this.loaderSvc.show();
    this.api
      .getChallanaDetails({
        fromDate: from,
        toDate: to,
        sectionName: this.sectionName,
        companyType: this.companyType,
        panPer: this.panPer,
        section: this.sectionName,
      })
      .subscribe({
        next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
        error: (err) => this.toast.error(err?.message ?? 'Load failed'),
        complete: () => this.loaderSvc.hide(),
      });
  }

  protected loadByChallana(): void {
    if (!this.challanaNo) return;
    this.loaderSvc.show();
    const fetch =
      this.kind() === 'payment'
        ? this.api.getChallanaPaymentDetails(this.challanaNo, this.sectionName)
        : this.api.getCinEntryData(this.challanaNo);
    fetch.subscribe({
      next: (data) => {
        const rows = Array.isArray(data) ? data : data ? [data as TdsReportRow] : [];
        this.rows.set(rows);
      },
      error: (err) => this.toast.error(err?.message ?? 'Load failed'),
      complete: () => this.loaderSvc.hide(),
    });
  }

  protected saveChallanaEntry(): void {
    this.loaderSvc.show();
    this.api.saveChallanaEntry({ rows: this.selectedRows }).subscribe({
      next: () => {
        this.toast.success('Challana entry saved.');
        this.loadChecking();
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.loaderSvc.hide();
      },
      complete: () => this.loaderSvc.hide(),
    });
  }

  protected save(): void {
    this.saving.set(true);
    const save =
      this.kind() === 'payment'
        ? this.api.saveChallanaPayment({
            challanaNo: this.challanaNo,
            rows: this.rows(),
          })
        : this.api.saveCinEntry({
            challanaNo: this.challanaNo,
            cinNumber: this.cinNumber,
          });
    save.subscribe({
      next: () => {
        this.toast.success('Saved.');
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }
}
