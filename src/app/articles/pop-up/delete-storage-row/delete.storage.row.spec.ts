import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStorageRowComponent } from './delete.storage.row';

describe('DeleteStorageRowComponent', () => {
  let component: DeleteStorageRowComponent;
  let fixture: ComponentFixture<DeleteStorageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteStorageRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteStorageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
