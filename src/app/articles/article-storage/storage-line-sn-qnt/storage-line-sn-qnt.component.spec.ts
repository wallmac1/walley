import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLineSnQntComponent } from './storage-line-sn-qnt.component';

describe('StorageLineSnQntComponent', () => {
  let component: StorageLineSnQntComponent;
  let fixture: ComponentFixture<StorageLineSnQntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLineSnQntComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLineSnQntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
