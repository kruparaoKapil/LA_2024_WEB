import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEnquiryComponent } from './member-enquiry.component';

describe('MemberEnquiryComponent', () => {
  let component: MemberEnquiryComponent;
  let fixture: ComponentFixture<MemberEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
