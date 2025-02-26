import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatReadonlyComponent } from './vat-readonly.component';

describe('VatReadonlyComponent', () => {
  let component: VatReadonlyComponent;
  let fixture: ComponentFixture<VatReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VatReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
