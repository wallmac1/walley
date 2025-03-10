import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDeletePopupComponent } from './payment-delete-popup.component';

describe('PaymentDeletePopupComponent', () => {
  let component: PaymentDeletePopupComponent;
  let fixture: ComponentFixture<PaymentDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDeletePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
