import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWorkComponent } from './ticket-work.component';

describe('TicketWorkComponent', () => {
  let component: TicketWorkComponent;
  let fixture: ComponentFixture<TicketWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
