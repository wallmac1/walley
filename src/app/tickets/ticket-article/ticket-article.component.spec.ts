import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketArticleComponent } from './ticket-article.component';

describe('TicketArticleComponent', () => {
  let component: TicketArticleComponent;
  let fixture: ComponentFixture<TicketArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
