import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketModifyComponent } from './ticket-modify.component';

describe('TicketModifyComponent', () => {
  let component: TicketModifyComponent;
  let fixture: ComponentFixture<TicketModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
