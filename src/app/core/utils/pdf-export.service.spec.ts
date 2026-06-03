import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';

import { PdfExportService } from './pdf-export.service';

describe('PdfExportService', () => {
  let service: PdfExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExportService);
  });

  it('saveTable generates a PDF without throwing', () => {
    expect(() =>
      service.saveTable(
        ['Code', 'Amount'],
        [
          ['A1', 100],
          ['B2', 200],
        ],
        { filename: 'report.pdf', title: 'Test Report' },
      ),
    ).not.toThrow();
  });
});
