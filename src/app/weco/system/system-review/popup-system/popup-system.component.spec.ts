import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSystemComponent } from './popup-system.component';

describe('PopupWarrantyComponent', () => {
  let component: PopupSystemComponent;
  let fixture: ComponentFixture<PopupSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
