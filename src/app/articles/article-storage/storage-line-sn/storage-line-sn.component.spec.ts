import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLineSnComponent } from './storage-line-sn.component';

describe('StorageLineSnComponent', () => {
  let component: StorageLineSnComponent;
  let fixture: ComponentFixture<StorageLineSnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLineSnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLineSnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
