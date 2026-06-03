import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form15hreprintComponent } from './form15hreprint.component';

describe('Form15hreprintComponent', () => {
  let component: Form15hreprintComponent;
  let fixture: ComponentFixture<Form15hreprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form15hreprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form15hreprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
