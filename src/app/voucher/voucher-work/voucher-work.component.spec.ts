import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherWorkComponent } from './voucher-work.component';

describe('VoucherWorkComponent', () => {
  let component: VoucherWorkComponent;
  let fixture: ComponentFixture<VoucherWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
