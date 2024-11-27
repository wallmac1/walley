import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherInfoComponent } from './voucher-info.component';

describe('VoucherInfoComponent', () => {
  let component: VoucherInfoComponent;
  let fixture: ComponentFixture<VoucherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
