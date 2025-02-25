import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPaymentPopupComponent } from './modify-payment-popup.component';

describe('ModifyPaymentPopupComponent', () => {
  let component: ModifyPaymentPopupComponent;
  let fixture: ComponentFixture<ModifyPaymentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyPaymentPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyPaymentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
