import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleInputOutputReservedComponent } from './article-input-output-reserved.component';

describe('ArticleInputOutputReservedComponent', () => {
  let component: ArticleInputOutputReservedComponent;
  let fixture: ComponentFixture<ArticleInputOutputReservedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleInputOutputReservedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleInputOutputReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
