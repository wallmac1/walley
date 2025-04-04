import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagePopupComponent } from './event-manage-popup.component';

describe('EventManagePopupComponent', () => {
  let component: EventManagePopupComponent;
  let fixture: ComponentFixture<EventManagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventManagePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventManagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
