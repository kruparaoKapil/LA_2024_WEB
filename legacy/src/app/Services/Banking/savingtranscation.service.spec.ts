import { TestBed } from '@angular/core/testing';

import { SavingtranscationService } from './savingtranscation.service';

describe('SavingtranscationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavingtranscationService = TestBed.get(SavingtranscationService);
    expect(service).toBeTruthy();
  });
});
