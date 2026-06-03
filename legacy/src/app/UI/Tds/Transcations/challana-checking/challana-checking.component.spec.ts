import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanaCheckingComponent } from './challana-checking.component';

describe('ChallanaCheckingComponent', () => {
  let component: ChallanaCheckingComponent;
  let fixture: ComponentFixture<ChallanaCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanaCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanaCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
