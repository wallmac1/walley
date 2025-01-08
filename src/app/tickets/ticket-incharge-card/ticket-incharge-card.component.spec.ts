import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketInchargeCardComponent } from './ticket-incharge-card.component';

describe('TicketInchargeCardComponent', () => {
  let component: TicketInchargeCardComponent;
  let fixture: ComponentFixture<TicketInchargeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketInchargeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketInchargeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
