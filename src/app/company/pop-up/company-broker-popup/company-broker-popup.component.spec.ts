import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBrokerPopupComponent } from './company-broker-popup.component';

describe('CompanyBrokerPopupComponent', () => {
  let component: CompanyBrokerPopupComponent;
  let fixture: ComponentFixture<CompanyBrokerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBrokerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBrokerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
