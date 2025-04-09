import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleFindComponent } from './article-find.component';

describe('ArticleFindComponent', () => {
  let component: ArticleFindComponent;
  let fixture: ComponentFixture<ArticleFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleFindComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
