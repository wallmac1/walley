import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article-average-price',
  standalone: true,
  imports: [],
  templateUrl: './article-average-price.component.html',
  styleUrl: './article-average-price.component.scss'
})
export class ArticleAveragePriceComponent {

  @Input() idarticle: number = 0;
  averagePrice: {avgTaxable: string; avgTaxableRecommended: string; avgTaxableSold: string} = {
    avgTaxable: '100€', avgTaxableRecommended: '98€', avgTaxableSold: '120€'
  }

  constructor() {}

  ngOnInit(): void {
    this.getAvgPrice();
  }

  getAvgPrice() {

  }

}
