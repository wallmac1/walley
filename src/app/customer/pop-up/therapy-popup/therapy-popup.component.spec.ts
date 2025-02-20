import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapyPopupComponent } from './therapy-popup.component';

describe('TherapyPopupComponent', () => {
  let component: TherapyPopupComponent;
  let fixture: ComponentFixture<TherapyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
