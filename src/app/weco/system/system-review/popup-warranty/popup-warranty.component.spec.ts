import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupWarrantyComponent } from './popup-warranty.component';

describe('PopupWarrantyComponent', () => {
  let component: PopupWarrantyComponent;
  let fixture: ComponentFixture<PopupWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupWarrantyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
