import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

import { saveAs } from 'file-saver';

import { ExcelExportService } from './excel-export.service';

describe('ExcelExportService', () => {
  let service: ExcelExportService;

  beforeEach(() => {
    vi.mocked(saveAs).mockClear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelExportService);
  });

  it('exports object rows as xlsx', () => {
    service.saveAsExcel([{ code: 'A1', amount: 100 }], 'test-export', 'Data');
    expect(saveAs).toHaveBeenCalledTimes(1);
    const blob = vi.mocked(saveAs).mock.calls[0]?.[0] as Blob;
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('exports aoa table as xlsx', () => {
    service.saveAsExcelTable(
      [
        ['Code', 'Amount'],
        ['A1', 100],
      ],
      'table-export.xlsx',
    );
    expect(saveAs).toHaveBeenCalledTimes(1);
  });
});
