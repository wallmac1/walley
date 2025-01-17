import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleModifyComponent } from './article-modify.component';

describe('ArticleModifyComponent', () => {
  let component: ArticleModifyComponent;
  let fixture: ComponentFixture<ArticleModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
