import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemReviewComponent } from './system-review.component';

describe('SystemReviewComponent', () => {
  let component: SystemReviewComponent;
  let fixture: ComponentFixture<SystemReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
