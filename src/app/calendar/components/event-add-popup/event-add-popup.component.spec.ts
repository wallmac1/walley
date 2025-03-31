import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAddPopupComponent } from './event-add-popup.component';

describe('EventAddPopupComponent', () => {
  let component: EventAddPopupComponent;
  let fixture: ComponentFixture<EventAddPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAddPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventAddPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
