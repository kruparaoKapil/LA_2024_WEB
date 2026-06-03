import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyconfigDocumentsComponent } from './companyconfig-documents.component';

describe('CompanyconfigDocumentsComponent', () => {
  let component: CompanyconfigDocumentsComponent;
  let fixture: ComponentFixture<CompanyconfigDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyconfigDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyconfigDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
