import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerModifyComponent } from './customer-modify.component';

describe('CustomerModifyComponent', () => {
  let component: CustomerModifyComponent;
  let fixture: ComponentFixture<CustomerModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
