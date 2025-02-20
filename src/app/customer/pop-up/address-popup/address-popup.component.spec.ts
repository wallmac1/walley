import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPopupComponent } from './address-popup.component';

describe('AddressPopupComponent', () => {
  let component: AddressPopupComponent;
  let fixture: ComponentFixture<AddressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
