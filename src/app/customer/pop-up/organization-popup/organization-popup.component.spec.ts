import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPopupComponent } from './organization-popup.component';

describe('OrganizationPopupComponent', () => {
  let component: OrganizationPopupComponent;
  let fixture: ComponentFixture<OrganizationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
