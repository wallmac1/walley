import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQntUntComponent } from './add-qnt-unt.component';

describe('AddQntUntComponent', () => {
  let component: AddQntUntComponent;
  let fixture: ComponentFixture<AddQntUntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQntUntComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQntUntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
