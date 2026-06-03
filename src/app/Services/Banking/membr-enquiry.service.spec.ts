import { TestBed } from '@angular/core/testing';

import { MembrEnquiryService } from './membr-enquiry.service';

describe('MembrEnquiryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MembrEnquiryService = TestBed.get(MembrEnquiryService);
    expect(service).toBeTruthy();
  });
});
