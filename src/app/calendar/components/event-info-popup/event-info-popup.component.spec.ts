import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoPopupComponent } from './event-info-popup.component';

describe('EventInfoPopupComponent', () => {
  let component: EventInfoPopupComponent;
  let fixture: ComponentFixture<EventInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
