import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVatPopupComponent } from './add-vat-popup.component';

describe('AddVatPopupComponent', () => {
  let component: AddVatPopupComponent;
  let fixture: ComponentFixture<AddVatPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVatPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
