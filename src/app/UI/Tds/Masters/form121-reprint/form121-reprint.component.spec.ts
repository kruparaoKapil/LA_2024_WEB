import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form121ReprintComponent } from './form121-reprint.component';

describe('Form121ReprintComponent', () => {
  let component: Form121ReprintComponent;
  let fixture: ComponentFixture<Form121ReprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form121ReprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form121ReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
