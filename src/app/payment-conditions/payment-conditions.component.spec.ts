import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConditionsComponent } from './payment-conditions.component';

describe('PaymentConditionsComponent', () => {
  let component: PaymentConditionsComponent;
  let fixture: ComponentFixture<PaymentConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
