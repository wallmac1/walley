import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTicketsListComponent } from './system-tickets-list.component';

describe('SystemTicketsListComponent', () => {
  let component: SystemTicketsListComponent;
  let fixture: ComponentFixture<SystemTicketsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemTicketsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemTicketsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
