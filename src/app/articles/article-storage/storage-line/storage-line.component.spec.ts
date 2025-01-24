import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLineComponent } from './storage-line.component';

describe('StorageLineComponent', () => {
  let component: StorageLineComponent;
  let fixture: ComponentFixture<StorageLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
