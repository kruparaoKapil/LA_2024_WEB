import { TestBed } from '@angular/core/testing';

import { LAReportsService } from './lareports.service';

describe('LAReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LAReportsService = TestBed.get(LAReportsService);
    expect(service).toBeTruthy();
  });
});
