import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoReadonlyComponent } from './step-two-readonly.component';

describe('StepTwoReadonlyComponent', () => {
  let component: StepTwoReadonlyComponent;
  let fixture: ComponentFixture<StepTwoReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTwoReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepTwoReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
