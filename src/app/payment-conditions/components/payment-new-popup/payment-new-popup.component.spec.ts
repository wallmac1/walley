import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentNewPopupComponent } from './payment-new-popup.component';

describe('PaymentNewPopupComponent', () => {
  let component: PaymentNewPopupComponent;
  let fixture: ComponentFixture<PaymentNewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentNewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentNewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
