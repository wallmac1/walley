import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTaxRepresentativeComponent } from './company-tax-representative.component';

describe('CompanyTaxRepresentativeComponent', () => {
  let component: CompanyTaxRepresentativeComponent;
  let fixture: ComponentFixture<CompanyTaxRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyTaxRepresentativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyTaxRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
