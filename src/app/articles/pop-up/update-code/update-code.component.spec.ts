import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCodeComponent } from './update-code.component';

describe('UpdateCodeComponent', () => {
  let component: UpdateCodeComponent;
  let fixture: ComponentFixture<UpdateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
