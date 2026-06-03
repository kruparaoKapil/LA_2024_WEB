import { TestBed } from '@angular/core/testing';

import { TdsreportService } from './tdsreport.service';

describe('TdsreportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TdsreportService = TestBed.get(TdsreportService);
    expect(service).toBeTruthy();
  });
});
