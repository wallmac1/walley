import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInfoPopupComponent } from './system-info-popup.component';

describe('SystemInfoPopupComponent', () => {
  let component: SystemInfoPopupComponent;
  let fixture: ComponentFixture<SystemInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemInfoPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
