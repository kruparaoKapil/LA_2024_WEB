import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyconfigPromotorsComponent } from './companyconfig-promotors.component';

describe('CompanyconfigPromotorsComponent', () => {
  let component: CompanyconfigPromotorsComponent;
  let fixture: ComponentFixture<CompanyconfigPromotorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyconfigPromotorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyconfigPromotorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
