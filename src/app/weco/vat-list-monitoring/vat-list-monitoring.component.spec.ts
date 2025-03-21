import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatListMonitoringComponent } from './vat-list-monitoring.component';

describe('VatListMonitoringComponent', () => {
  let component: VatListMonitoringComponent;
  let fixture: ComponentFixture<VatListMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VatListMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatListMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
