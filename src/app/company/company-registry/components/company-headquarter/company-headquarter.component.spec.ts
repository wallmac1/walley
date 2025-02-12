import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHeadquarterComponent } from './company-headquarter.component';

describe('CompanyHeadquarterComponent', () => {
  let component: CompanyHeadquarterComponent;
  let fixture: ComponentFixture<CompanyHeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHeadquarterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
