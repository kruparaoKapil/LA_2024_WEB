import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form121Component } from './form121.component';

describe('Form121Component', () => {
  let component: Form121Component;
  let fixture: ComponentFixture<Form121Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form121Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form121Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
