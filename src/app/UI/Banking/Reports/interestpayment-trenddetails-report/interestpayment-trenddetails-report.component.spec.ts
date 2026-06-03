import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestpaymentTrenddetailsReportComponent } from './interestpayment-trenddetails-report.component';

describe('InterestpaymentTrenddetailsReportComponent', () => {
  let component: InterestpaymentTrenddetailsReportComponent;
  let fixture: ComponentFixture<InterestpaymentTrenddetailsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestpaymentTrenddetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestpaymentTrenddetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
