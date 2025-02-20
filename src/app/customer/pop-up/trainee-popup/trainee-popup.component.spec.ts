import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineePopupComponent } from './trainee-popup.component';

describe('TraineePopupComponent', () => {
  let component: TraineePopupComponent;
  let fixture: ComponentFixture<TraineePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
