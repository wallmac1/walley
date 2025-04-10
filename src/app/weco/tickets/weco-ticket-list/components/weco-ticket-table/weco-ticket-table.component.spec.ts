import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WecoTicketTableComponent } from './weco-ticket-table.component';

describe('WecoTicketTableComponent', () => {
  let component: WecoTicketTableComponent;
  let fixture: ComponentFixture<WecoTicketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WecoTicketTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WecoTicketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
