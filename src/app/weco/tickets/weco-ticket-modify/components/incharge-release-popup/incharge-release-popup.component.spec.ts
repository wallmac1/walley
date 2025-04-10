import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InchargeReleasePopupComponent } from './incharge-release-popup.component';

describe('InchargeReleasePopupComponent', () => {
  let component: InchargeReleasePopupComponent;
  let fixture: ComponentFixture<InchargeReleasePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InchargeReleasePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InchargeReleasePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
