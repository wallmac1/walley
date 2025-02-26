import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingReadonlyComponent } from './heading-readonly.component';

describe('HeadingReadonlyComponent', () => {
  let component: HeadingReadonlyComponent;
  let fixture: ComponentFixture<HeadingReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
