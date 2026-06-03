import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDelayReportComponent } from './interest-delay-report.component';

describe('InterestDelayReportComponent', () => {
  let component: InterestDelayReportComponent;
  let fixture: ComponentFixture<InterestDelayReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestDelayReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestDelayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
