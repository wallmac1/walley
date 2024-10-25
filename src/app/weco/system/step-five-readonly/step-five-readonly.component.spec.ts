import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFiveReadonlyComponent } from './step-five-readonly.component';

describe('StepFiveReadonlyComponent', () => {
  let component: StepFiveReadonlyComponent;
  let fixture: ComponentFixture<StepFiveReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFiveReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepFiveReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
