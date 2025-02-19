import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomerPopupComponent } from './select-customer-popup.component';

describe('SelectCustomerPopupComponent', () => {
  let component: SelectCustomerPopupComponent;
  let fixture: ComponentFixture<SelectCustomerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCustomerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
