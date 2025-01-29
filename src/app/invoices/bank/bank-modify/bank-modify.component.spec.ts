import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankModifyComponent } from './bank-modify.component';

describe('BankModifyComponent', () => {
  let component: BankModifyComponent;
  let fixture: ComponentFixture<BankModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
