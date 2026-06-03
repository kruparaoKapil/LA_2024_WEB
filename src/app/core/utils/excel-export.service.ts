import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Replacement for `@progress/kendo-angular-excel-export` and
 * the ad-hoc `XLSX` helpers scattered across legacy services.
 *
 * One service = one place for spreadsheet output. Used by the upcoming
 * `<app-data-grid>` toolbar (Phase 3) and any feature that needs export.
 */
@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  /** Save an array of plain objects as an .xlsx workbook. */
  saveAsExcel<T extends Record<string, unknown>>(
    rows: ReadonlyArray<T>,
    filename: string,
    sheetName = 'Sheet1',
  ): void {
    const ws = XLSX.utils.json_to_sheet(rows as T[]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  }

  /** Save a 2-D array (header + rows) as an .xlsx. */
  saveAsExcelTable(
    rows: ReadonlyArray<ReadonlyArray<string | number | null>>,
    filename: string,
    sheetName = 'Sheet1',
  ): void {
    const ws = XLSX.utils.aoa_to_sheet(rows as (string | number | null)[][]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  }
}
