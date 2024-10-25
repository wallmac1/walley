import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneReadonlyComponent } from './step-one-readonly.component';

describe('StepOneReadonlyComponent', () => {
  let component: StepOneReadonlyComponent;
  let fixture: ComponentFixture<StepOneReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepOneReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepOneReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
