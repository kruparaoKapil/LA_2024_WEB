import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdtransactionNew1Component } from './fdtransaction-new1.component';

describe('FdtransactionNew1Component', () => {
  let component: FdtransactionNew1Component;
  let fixture: ComponentFixture<FdtransactionNew1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdtransactionNew1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdtransactionNew1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
