import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModifyPopupComponent } from './payment-modify-popup.component';

describe('PaymentModifyPopupComponent', () => {
  let component: PaymentModifyPopupComponent;
  let fixture: ComponentFixture<PaymentModifyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentModifyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentModifyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
