import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistryComponent } from './company-registry.component';

describe('CompanyRegistryComponent', () => {
  let component: CompanyRegistryComponent;
  let fixture: ComponentFixture<CompanyRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRegistryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
