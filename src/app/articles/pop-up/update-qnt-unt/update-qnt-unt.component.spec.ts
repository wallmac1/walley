import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQntUntComponent } from './update-qnt-unt.component';

describe('UpdateQntUntComponent', () => {
  let component: UpdateQntUntComponent;
  let fixture: ComponentFixture<UpdateQntUntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQntUntComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQntUntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
