import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { type RowInput, type Styles } from 'jspdf-autotable';

/**
 * Replacement for `@progress/kendo-angular-pdf-export`.
 * Used both for tabular receipts and for any feature that needs ad-hoc PDF.
 *
 * Narrative letters (sanction letter, loan agreement, …) take the alternative
 * path: an HTML print route with print-CSS, kept under `features/banking/letters/`.
 */
export interface PdfTableOptions {
  filename: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter';
  margin?: number;
  headStyles?: Partial<Styles>;
}

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  saveTable(
    headers: ReadonlyArray<string>,
    rows: ReadonlyArray<ReadonlyArray<string | number | null>>,
    opts: PdfTableOptions,
  ): void {
    const doc = new jsPDF({
      orientation: opts.orientation ?? 'portrait',
      unit: 'pt',
      format: opts.pageSize ?? 'a4',
    });

    const margin = opts.margin ?? 32;
    let startY = margin;

    if (opts.title) {
      doc.setFontSize(14);
      doc.text(opts.title, margin, margin);
      startY = margin + 18;
    }

    autoTable(doc, {
      startY,
      head: [headers as string[]],
      body: rows as RowInput[],
      margin: { top: margin, left: margin, right: margin, bottom: margin },
      headStyles: { fillColor: [33, 96, 184], textColor: 255, ...opts.headStyles },
      styles: { fontSize: 9, cellPadding: 4 },
      theme: 'striped',
    });

    doc.save(opts.filename.endsWith('.pdf') ? opts.filename : `${opts.filename}.pdf`);
  }
}
