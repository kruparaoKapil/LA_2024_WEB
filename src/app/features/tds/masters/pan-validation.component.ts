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
import { InputTextModule } from 'primeng/inputtext';

import {
  DataGridComponent,
  type DataGridColumn,
  SelectComponent,
} from '../../../shared/ui';
import {
  TdsService,
  type TdsReportRow,
} from '../services/tds.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-pan-validation',
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
    <div class="pan-val">
      <header><h2>PAN Validation</h2></header>
      <p-card>
        <div class="filters">
          <label class="field">
            <span>Search Type</span>
            <app-select
              [options]="searchTypes"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="searchType"
              [showClear]="false"
            />
          </label>
          <label class="field">
            <span>Search Text</span>
            <input pInputText [(ngModel)]="searchText" name="search" />
          </label>
          <p-button label="Search" icon="pi pi-search" (onClick)="search()" [loading]="loading()" />
        </div>
      </p-card>
      <p-card>
        <app-data-grid
          [rows]="rows()"
          [columns]="columns"
          selectionMode="single"
          [(selection)]="selectedRow"
          exportFilename="pan-validation"
        />
        @if (selectedRow) {
          <p-button
            label="Approve Selected"
            icon="pi pi-check"
            severity="success"
            class="mt"
            (onClick)="approve()"
          />
        }
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .pan-val { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .filters { display: flex; align-items: flex-end; gap: 0.5rem 1rem; flex-wrap: wrap; }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .mt { margin-top: 0.75rem; }
    `,
  ],
})
export class PanValidationComponent implements OnInit {
  private readonly api = inject(TdsService);
  private readonly toast = inject(ToastService);
  private readonly loaderSvc = inject(LoaderService);

  protected readonly rows = signal<TdsReportRow[]>([]);
  protected readonly loading = signal(false);

  protected searchType = 'PAN';
  protected searchText = '';
  protected selectedRow: TdsReportRow | null = null;

  protected readonly searchTypes = [
    { label: 'PAN', value: 'PAN' },
    { label: 'Contact Name', value: 'NAME' },
    { label: 'Reference ID', value: 'REF' },
  ];

  protected readonly columns: DataGridColumn<TdsReportRow>[] = [
    { field: 'pContactName', header: 'Contact', sortable: true, filter: true },
    { field: 'pPanNo', header: 'PAN', sortable: true, filter: true },
    { field: 'pValidationStatus', header: 'Status', align: 'center' },
    { field: 'pApprovedBy', header: 'Approved By' },
  ];

  ngOnInit(): void {
    this.api.getPanValidStatus().subscribe();
  }

  protected search(): void {
    if (!this.searchText.trim()) {
      this.toast.warn('Enter search text.');
      return;
    }
    this.loading.set(true);
    this.loaderSvc.show();
    this.api.getPanValidDetails(this.searchText, this.searchType).subscribe({
      next: (rows) => this.rows.set(Array.isArray(rows) ? rows : []),
      error: (err) => {
        this.toast.error(err?.message ?? 'Search failed');
        this.loading.set(false);
        this.loaderSvc.hide();
      },
      complete: () => {
        this.loading.set(false);
        this.loaderSvc.hide();
      },
    });
  }

  protected approve(): void {
    const row = this.selectedRow;
    if (!row) return;
    this.api
      .savePanValidDetails({
        panValidId: Number(row['pPanValidId'] ?? 0),
        contactId: Number(row['pContactId'] ?? 0),
        userId: 1,
        ipAddress: '',
        documentFileName: String(row['pDocumentFileName'] ?? ''),
        guidFileName: String(row['pGuidFileName'] ?? ''),
        approvedBy: 'System',
        searchType: this.searchType,
      })
      .subscribe({
        next: () => {
          this.toast.success('PAN validation approved.');
          this.search();
        },
        error: (err) => this.toast.error(err?.message ?? 'Approve failed'),
      });
  }
}
