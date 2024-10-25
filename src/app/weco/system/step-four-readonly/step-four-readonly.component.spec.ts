import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFourReadonlyComponent } from './step-four-readonly.component';

describe('StepFourReadonlyComponent', () => {
  let component: StepFourReadonlyComponent;
  let fixture: ComponentFixture<StepFourReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFourReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepFourReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
