import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyReadonlyComponent } from './body-readonly.component';

describe('BodyReadonlyComponent', () => {
  let component: BodyReadonlyComponent;
  let fixture: ComponentFixture<BodyReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
