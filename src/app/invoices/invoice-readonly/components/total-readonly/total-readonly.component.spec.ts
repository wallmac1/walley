import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalReadonlyComponent } from './total-readonly.component';

describe('TotalReadonlyComponent', () => {
  let component: TotalReadonlyComponent;
  let fixture: ComponentFixture<TotalReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
