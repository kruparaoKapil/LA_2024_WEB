import { TestBed } from '@angular/core/testing';

import { PayrollApprovalService } from './payroll-approval.service';

describe('PayrollApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayrollApprovalService = TestBed.get(PayrollApprovalService);
    expect(service).toBeTruthy();
  });
});
