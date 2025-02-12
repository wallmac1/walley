import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHeadquarterPopupComponent } from './company-headquarter-popup.component';

describe('CompanyHeadquarterPopupComponent', () => {
  let component: CompanyHeadquarterPopupComponent;
  let fixture: ComponentFixture<CompanyHeadquarterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHeadquarterPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyHeadquarterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
