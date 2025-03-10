import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewPopupComponent } from './payment-overview-popup.component';

describe('PaymentOverviewPopupComponent', () => {
  let component: PaymentOverviewPopupComponent;
  let fixture: ComponentFixture<PaymentOverviewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOverviewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOverviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
