import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeReadonlyComponent } from './step-three-readonly.component';

describe('StepThreeReadonlyComponent', () => {
  let component: StepThreeReadonlyComponent;
  let fixture: ComponentFixture<StepThreeReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepThreeReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepThreeReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
