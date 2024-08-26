import { TestBed } from '@angular/core/testing';

import { TicketWorksService } from './ticket-works.service';

describe('TicketWorksService', () => {
  let service: TicketWorksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketWorksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
