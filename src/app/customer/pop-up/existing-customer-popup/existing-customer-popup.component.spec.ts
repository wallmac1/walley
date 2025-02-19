import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCustomerPopupComponent } from './existing-customer-popup.component';

describe('ExistingCustomerPopupComponent', () => {
  let component: ExistingCustomerPopupComponent;
  let fixture: ComponentFixture<ExistingCustomerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingCustomerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
