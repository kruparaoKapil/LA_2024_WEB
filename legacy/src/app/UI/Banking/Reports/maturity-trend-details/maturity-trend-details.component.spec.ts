import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityTrendDetailsComponent } from './maturity-trend-details.component';

describe('MaturityTrendDetailsComponent', () => {
  let component: MaturityTrendDetailsComponent;
  let fixture: ComponentFixture<MaturityTrendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaturityTrendDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityTrendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
