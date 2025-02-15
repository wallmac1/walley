import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBrokerComponent } from './company-broker.component';

describe('CompanyBrokerComponent', () => {
  let component: CompanyBrokerComponent;
  let fixture: ComponentFixture<CompanyBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBrokerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
