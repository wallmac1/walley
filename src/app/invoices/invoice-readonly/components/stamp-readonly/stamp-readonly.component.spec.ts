import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampReadonlyComponent } from './stamp-readonly.component';

describe('StampReadonlyComponent', () => {
  let component: StampReadonlyComponent;
  let fixture: ComponentFixture<StampReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StampReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
