import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMessagePopupComponent } from './delete-message-popup.component';

describe('DeleteMessagePopupComponent', () => {
  let component: DeleteMessagePopupComponent;
  let fixture: ComponentFixture<DeleteMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMessagePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
