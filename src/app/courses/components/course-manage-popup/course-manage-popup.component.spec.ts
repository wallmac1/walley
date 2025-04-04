import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseManagePopupComponent } from './course-manage-popup.component';

describe('CourseManagePopupComponent', () => {
  let component: CourseManagePopupComponent;
  let fixture: ComponentFixture<CourseManagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseManagePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseManagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
