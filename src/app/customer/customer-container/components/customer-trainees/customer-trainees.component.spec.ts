import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTraineesComponent } from './customer-trainees.component';

describe('CustomerTraineesComponent', () => {
  let component: CustomerTraineesComponent;
  let fixture: ComponentFixture<CustomerTraineesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTraineesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTraineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
