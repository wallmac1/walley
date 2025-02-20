import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContainerComponent } from './customer-container.component';

describe('CustomerContainerComponent', () => {
  let component: CustomerContainerComponent;
  let fixture: ComponentFixture<CustomerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
