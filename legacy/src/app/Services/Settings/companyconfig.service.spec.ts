import { TestBed } from '@angular/core/testing';

import { CompanyconfigService } from './companyconfig.service';

describe('CompanyconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyconfigService = TestBed.get(CompanyconfigService);
    expect(service).toBeTruthy();
  });
});
