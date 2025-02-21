import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPopupComponent } from './student-popup.component';

describe('StudentPopupComponent', () => {
  let component: StudentPopupComponent;
  let fixture: ComponentFixture<StudentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
