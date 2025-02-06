import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSystemComponent } from './tax-system.component';

describe('TaxSystemComponent', () => {
  let component: TaxSystemComponent;
  let fixture: ComponentFixture<TaxSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
