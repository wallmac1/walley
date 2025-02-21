import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStudentsComponent } from './customer-students.component';

describe('CustomerStudentsComponent', () => {
  let component: CustomerStudentsComponent;
  let fixture: ComponentFixture<CustomerStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
