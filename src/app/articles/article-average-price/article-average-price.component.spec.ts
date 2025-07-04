import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAveragePriceComponent } from './article-average-price.component';

describe('ArticleAveragePriceComponent', () => {
  let component: ArticleAveragePriceComponent;
  let fixture: ComponentFixture<ArticleAveragePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleAveragePriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleAveragePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
