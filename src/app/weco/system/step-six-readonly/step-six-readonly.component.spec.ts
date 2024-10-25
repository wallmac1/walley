import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSixReadonlyComponent } from './step-six-readonly.component';

describe('StepSixReadonlyComponent', () => {
  let component: StepSixReadonlyComponent;
  let fixture: ComponentFixture<StepSixReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSixReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepSixReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
