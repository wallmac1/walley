import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsReadonlyComponent } from './payments-readonly.component';

describe('PaymentsReadonlyComponent', () => {
  let component: PaymentsReadonlyComponent;
  let fixture: ComponentFixture<PaymentsReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
