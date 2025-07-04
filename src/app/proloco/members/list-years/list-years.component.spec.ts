import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYearsComponent } from './list-years.component';

describe('ListYearsComponent', () => {
  let component: ListYearsComponent;
  let fixture: ComponentFixture<ListYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListYearsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
