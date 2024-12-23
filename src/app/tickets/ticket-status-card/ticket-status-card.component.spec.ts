import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStatusCardComponent } from './ticket-status-card.component';

describe('TicketStatusCardComponent', () => {
  let component: TicketStatusCardComponent;
  let fixture: ComponentFixture<TicketStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStatusCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
