import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTaxableComponent } from './article-taxable.component';

describe('ArticleTaxableComponent', () => {
  let component: ArticleTaxableComponent;
  let fixture: ComponentFixture<ArticleTaxableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleTaxableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleTaxableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
