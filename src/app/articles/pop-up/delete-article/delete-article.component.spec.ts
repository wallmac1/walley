import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteArticleComponent } from './delete-article.component';

describe('DeleteArticleComponent', () => {
  let component: DeleteArticleComponent;
  let fixture: ComponentFixture<DeleteArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
