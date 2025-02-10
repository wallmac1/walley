import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHistoricizePopupComponent } from './update-historicize-popup.component';

describe('UpdateHistoricizePopupComponent', () => {
  let component: UpdateHistoricizePopupComponent;
  let fixture: ComponentFixture<UpdateHistoricizePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHistoricizePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHistoricizePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
