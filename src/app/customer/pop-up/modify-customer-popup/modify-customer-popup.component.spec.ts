import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCustomerPopupComponent } from './modify-customer-popup.component';

describe('ModifyCustomerPopupComponent', () => {
  let component: ModifyCustomerPopupComponent;
  let fixture: ComponentFixture<ModifyCustomerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyCustomerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
