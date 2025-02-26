import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDataReadonlyComponent } from './customer-data-readonly.component';

describe('CustomerDataReadonlyComponent', () => {
  let component: CustomerDataReadonlyComponent;
  let fixture: ComponentFixture<CustomerDataReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDataReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDataReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
