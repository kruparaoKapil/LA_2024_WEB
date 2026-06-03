import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLedgerMigrationComponent } from './account-ledger-migration.component';

describe('AccountLedgerMigrationComponent', () => {
  let component: AccountLedgerMigrationComponent;
  let fixture: ComponentFixture<AccountLedgerMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLedgerMigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLedgerMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
