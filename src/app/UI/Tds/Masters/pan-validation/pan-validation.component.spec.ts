import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanValidationComponent } from './pan-validation.component';

describe('PanValidationComponent', () => {
  let component: PanValidationComponent;
  let fixture: ComponentFixture<PanValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
