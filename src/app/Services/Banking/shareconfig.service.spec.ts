import { TestBed } from '@angular/core/testing';

import { ShareconfigService } from './shareconfig.service';

describe('ShareconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareconfigService = TestBed.get(ShareconfigService);
    expect(service).toBeTruthy();
  });
});
