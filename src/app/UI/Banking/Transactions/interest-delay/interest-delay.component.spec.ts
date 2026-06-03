import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDelayComponent } from './interest-delay.component';

describe('InterestDelayComponent', () => {
  let component: InterestDelayComponent;
  let fixture: ComponentFixture<InterestDelayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestDelayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
