import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusPopupComponent } from './change-status-popup.component';

describe('ChangeStatusPopupComponent', () => {
  let component: ChangeStatusPopupComponent;
  let fixture: ComponentFixture<ChangeStatusPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStatusPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
