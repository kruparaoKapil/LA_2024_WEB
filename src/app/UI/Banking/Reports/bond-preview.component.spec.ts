import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BondPreviewComponent } from './bond-preview.component';

describe('BondPreviewComponent', () => {
  let component: BondPreviewComponent;
  let fixture: ComponentFixture<BondPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BondPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
