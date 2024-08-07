import { TestBed } from '@angular/core/testing';

import { TicketsInfoService } from './tickets-info.service';

describe('TicketsInfoService', () => {
  let service: TicketsInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
