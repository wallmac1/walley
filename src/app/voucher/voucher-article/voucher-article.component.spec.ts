import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherArticleComponent } from './voucher-article.component';

describe('VoucherArticleComponent', () => {
  let component: VoucherArticleComponent;
  let fixture: ComponentFixture<VoucherArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
