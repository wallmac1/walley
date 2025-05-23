import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTicketPopupComponent } from './delete-ticket-popup.component';

describe('DeleteTicketPopupComponent', () => {
  let component: DeleteTicketPopupComponent;
  let fixture: ComponentFixture<DeleteTicketPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTicketPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTicketPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
