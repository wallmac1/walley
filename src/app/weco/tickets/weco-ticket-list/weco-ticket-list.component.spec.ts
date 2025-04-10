import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WecoTicketListComponent } from './weco-ticket-list.component';

describe('WecoTicketListComponent', () => {
  let component: WecoTicketListComponent;
  let fixture: ComponentFixture<WecoTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WecoTicketListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WecoTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
