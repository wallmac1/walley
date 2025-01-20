import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleStorageComponent } from './article-storage.component';

describe('ArticleStorageComponent', () => {
  let component: ArticleStorageComponent;
  let fixture: ComponentFixture<ArticleStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleStorageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
