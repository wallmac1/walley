import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReadonlyComponent } from './invoice-readonly.component';

describe('InvoiceReadonlyComponent', () => {
  let component: InvoiceReadonlyComponent;
  let fixture: ComponentFixture<InvoiceReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
