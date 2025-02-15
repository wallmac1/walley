import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDataPopupComponent } from './company-data-popup.component';

describe('CompanyDataPopupComponent', () => {
  let component: CompanyDataPopupComponent;
  let fixture: ComponentFixture<CompanyDataPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDataPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
