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
  SelectComponent,
  ValidationMessageComponent,
} from '../../../shared/ui';
import {
  TdsService,
  type PanContactRow,
} from '../services/tds.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ToastService } from '../../../core/notifications/toast.service';

const PAN_RX = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;

@Component({
  selector: 'app-pan-update',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectComponent,
    ValidationMessageComponent,
  ],
  template: `
    <div class="pan-upd">
      <header><h2>PAN Update</h2></header>
      <p-card>
        <div class="grid">
          <label class="field">
            <span>Contact<sup>*</sup></span>
            <app-select
              [options]="contacts()"
              optionLabel="pContactName"
              optionValue="pContactID"
              [(ngModel)]="contactId"
              placeholder="Select contact without PAN"
            />
          </label>
          <label class="field">
            <span>PAN Number<sup>*</sup></span>
            <input
              pInputText
              [(ngModel)]="panNumber"
              name="pan"
              maxlength="10"
              style="text-transform: uppercase"
            />
            <app-validation-message [message]="panError()" />
          </label>
        </div>
        <p-button
          label="Save PAN"
          icon="pi pi-save"
          class="mt"
          (onClick)="save()"
          [loading]="saving()"
          [disabled]="!isValid()"
        />
      </p-card>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .pan-upd { display: flex; flex-direction: column; gap: 0.75rem; }
      header h2 { margin: 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(260px, 1fr));
        gap: 0.75rem 1rem;
      }
      .field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; }
      .field span sup { color: var(--p-red-500, #dc2626); }
      .mt { margin-top: 0.75rem; }
    `,
  ],
})
export class PanUpdateComponent implements OnInit {
  private readonly api = inject(TdsService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);

  protected readonly contacts = signal<PanContactRow[]>([]);
  protected readonly saving = signal(false);
  protected readonly panError = signal('');

  protected contactId: number | null = null;
  protected panNumber = '';

  protected readonly isValid = () =>
    this.contactId != null && PAN_RX.test(this.panNumber.trim());

  ngOnInit(): void {
    this.loadContacts();
  }

  private loadContacts(): void {
    this.loader.show();
    this.api.getContactsWithoutPan().subscribe({
      next: (rows) => this.contacts.set(rows ?? []),
      error: (err) => this.toast.error(err?.message ?? 'Failed to load contacts'),
      complete: () => this.loader.hide(),
    });
  }

  protected save(): void {
    if (!this.isValid()) {
      this.panError.set(
        PAN_RX.test(this.panNumber.trim())
          ? 'Select a contact.'
          : 'PAN must match AAAAA9999A format.',
      );
      return;
    }
    this.saving.set(true);
    const payload = {
      pContactdId: this.contactId,
      pDocreferenceno: this.panNumber.toUpperCase(),
      pDocName: 'PAN CARD',
      pDocType: 'PAN',
      pDocumentid: 17,
    };
    this.api.savePanDetails(payload).subscribe({
      next: () => {
        this.toast.success('PAN saved.');
        this.contactId = null;
        this.panNumber = '';
        this.loadContacts();
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error(err?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }
}
