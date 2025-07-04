import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WecoTicketNewComponent } from './weco-ticket-new.component';

describe('WecoTicketNewComponent', () => {
  let component: WecoTicketNewComponent;
  let fixture: ComponentFixture<WecoTicketNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WecoTicketNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WecoTicketNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
