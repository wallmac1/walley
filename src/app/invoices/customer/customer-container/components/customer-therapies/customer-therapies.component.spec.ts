import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTherapiesComponent } from './customer-therapies.component';

describe('CustomerTherapiesComponent', () => {
  let component: CustomerTherapiesComponent;
  let fixture: ComponentFixture<CustomerTherapiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTherapiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTherapiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
