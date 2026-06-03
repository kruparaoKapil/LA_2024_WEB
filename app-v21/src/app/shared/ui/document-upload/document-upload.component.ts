import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

import { ApiClient } from '../../../core/api/api-client.service';
import { ToastService } from '../../../core/notifications/toast.service';

export interface DocumentReference {
  /** Server-relative path returned by the upload endpoint. */
  filePath: string;
  /** Display-friendly file name. */
  fileName: string;
}

/**
 * Generic document-upload widget. Replaces the per-component
 * file-upload code copy-pasted across legacy KYC, property, movable-
 * property, employee, and verification screens.
 *
 * Defaults to the legacy `/Common/UploadFile` endpoint but can be
 * pointed at any upload URL. The endpoint is expected to return a
 * tuple `[filePath, fileName]` (the legacy convention).
 *
 *   <app-document-upload
 *     [(ngModel)]="kycDoc"
 *     newFileName="PAN-card"
 *     accept=".pdf,.jpg,.png"
 *   />
 */
@Component({
  selector: 'app-document-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, FileUploadModule, TooltipModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentUploadComponent),
      multi: true,
    },
  ],
  template: `
    <div class="doc-upload">
      @if (current(); as ref) {
        <div class="doc-upload-current" pTooltip="{{ ref.filePath }}">
          <i class="pi pi-file"></i>
          <a
            [href]="resolvedHref()"
            target="_blank"
            rel="noopener noreferrer"
            class="doc-upload-link"
          >
            {{ ref.fileName }}
          </a>
          @if (!disabled()) {
            <p-button
              icon="pi pi-times"
              [rounded]="true"
              [text]="true"
              severity="danger"
              size="small"
              pTooltip="Remove"
              (onClick)="clear()"
            />
          }
        </div>
      } @else {
        <p-fileUpload
          mode="basic"
          [auto]="true"
          chooseLabel="Choose file"
          [accept]="accept()"
          [maxFileSize]="maxFileSize()"
          [disabled]="disabled() || uploading()"
          [customUpload]="true"
          (onSelect)="onSelect($event)"
        />
        @if (uploading()) {
          <span class="doc-upload-status">Uploading…</span>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .doc-upload {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .doc-upload-current {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--p-surface-300);
        border-radius: 0.5rem;
        background: var(--p-surface-50);
      }
      .doc-upload-link {
        color: var(--p-primary-color);
        text-decoration: underline;
      }
      .doc-upload-status {
        font-size: 0.85rem;
        color: var(--p-text-muted-color, var(--p-surface-500));
      }
    `,
  ],
})
export class DocumentUploadComponent implements ControlValueAccessor {
  private readonly api = inject(ApiClient);
  private readonly toast = inject(ToastService);

  /** Upload endpoint, defaults to the legacy `/Common/UploadFile`. */
  readonly uploadUrl = input<string>('/Common/UploadFile');
  /** Optional rename hint sent as `NewFileName` form field. */
  readonly newFileName = input<string>('');
  /** Optional URL prefix for displaying the uploaded link. */
  readonly downloadPrefix = input<string>('');
  readonly accept = input<string>('.pdf,.jpg,.jpeg,.png,.doc,.docx');
  /** PrimeNG max-file-size in bytes; default 5 MB. */
  readonly maxFileSize = input<number>(5 * 1024 * 1024);

  readonly fileUploaded = output<DocumentReference>();
  readonly fileRemoved = output<void>();

  protected readonly current = signal<DocumentReference | null>(null);
  protected readonly uploading = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);

  protected readonly resolvedHref = computed(() => {
    const c = this.current();
    if (!c) return '';
    const prefix = this.downloadPrefix();
    return prefix ? `${prefix}/${c.filePath}` : c.filePath;
  });

  // ----- CVA -----
  private internalChange: (val: DocumentReference | null) => void = () => {};
  private internalTouched: () => void = () => {};

  writeValue(val: DocumentReference | string | null): void {
    if (!val) {
      this.current.set(null);
      return;
    }
    if (typeof val === 'string') {
      const parts = val.split('/');
      this.current.set({ filePath: val, fileName: parts[parts.length - 1] });
    } else {
      this.current.set(val);
    }
  }
  registerOnChange(fn: (val: DocumentReference | null) => void): void {
    this.internalChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.internalTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // ----- handlers -----
  protected onSelect(evt: FileSelectEvent): void {
    const file = evt.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(file.name, file);
    if (this.newFileName()) {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
      formData.append('NewFileName', `${this.newFileName()}.${ext}`);
    }

    this.uploading.set(true);
    this.api.post<[string, string]>(this.uploadUrl(), formData).subscribe({
      next: (res) => {
        const [filePath, fileName] = res ?? ['', file.name];
        const ref: DocumentReference = {
          filePath,
          fileName: fileName || file.name,
        };
        this.current.set(ref);
        this.internalChange(ref);
        this.fileUploaded.emit(ref);
      },
      error: (err) => this.toast.error(err?.message ?? 'Upload failed'),
      complete: () => {
        this.uploading.set(false);
        this.internalTouched();
      },
    });
  }

  protected clear(): void {
    this.current.set(null);
    this.internalTouched();
    this.internalChange(null);
    this.fileRemoved.emit();
  }
}
