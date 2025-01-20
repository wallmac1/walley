import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Article } from '../interfaces/article';

@Component({
  selector: 'app-article-storage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './article-storage.component.html',
  styleUrl: './article-storage.component.scss'
})
export class ArticleStorageComponent {

  storageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.storageForm = this.fb.group({
      groupAction: [0],
      articles: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    // CHIAMATA AL SERVER PER OTTENERE GLI ARTICOLI E CREARE I FORM ARRAY NEL SUBSCRIBE
    this.createArticlesForm(this.articlesTemporary);
    this.storageForm.disable();
  }

  get articles(): FormArray {
    return this.storageForm.get('articles') as FormArray;
  }

  createArticlesForm(articles: Article[]) {
    articles.forEach((article: Article) => {
      this.articles.push(this.createArticle(article));
    });
  }

  createArticle(article: Article) {
    return this.fb.group({
      action: [0],
      id: [article.id],
      quantity: [article.quantity],
      serialnumber: [article.article_price.serialnumber],
      taxablepurchase: [article.article_price.taxablepurchase],
      pricesale: [article.article_price.taxablesale], // DA CAMBIARE QUANDO FINITA INTERFACCIA
      pricerecommended: [article.article_price.taxablesale], // DA CAMBIARE QUANDO FINITA INTERFACCIA
      taxablerecommended: [article.article_price.taxablerecommended],
      vatpurchase: [article.article_price.vatpurchase],
      vatrecommended: [article.article_price.vatrecommended],
    })
  }

  articlesTemporary = [
    {
      id: 1,
      code: "ART001",
      progressive: 1,
      quantity: "1",
      article_data: {
        title: "Article One",
        description: "First article with serial number",
        refidarticle: 101,
        um: {acronym: "kg", id: 1, description: ""},
        date_snapshot: "2025-01-20T10:00:00Z",
        user_created: {
          id: 1,
          nickname: "creator1",
          datetime: "2025-01-20T09:00:00Z"
        },
        user_updated: {
          id: 2,
          nickname: "updater1",
          datetime: "2025-01-20T09:30:00Z"
        }
      },
      article_price: {
        refidarticle: 101,
        serialnumber: "SN001",
        taxablepurchase: "100.00",
        taxablesale: "150.00",
        taxablerecommended: "160.00",
        vatpurchase: "22",
        vatsale: "22",
        vatrecommended: "22",
        user_created: {
          id: 1,
          nickname: "creator1",
          datetime: "2025-01-20T09:00:00Z"
        },
        user_updated: {
          id: 2,
          nickname: "updater1",
          datetime: "2025-01-20T09:30:00Z"
        }
      }
    },
    {
      id: 2,
      code: "ART002",
      progressive: 2,
      quantity: "1",
      article_data: {
        title: "Article Two",
        description: "Second article with serial number",
        refidarticle: 102,
        um: {acronym: "kg", id: 1, description: ""},
        date_snapshot: "2025-01-21T10:00:00Z",
        user_created: {
          id: 3,
          nickname: "creator2",
          datetime: "2025-01-21T09:00:00Z"
        },
        user_updated: {
          id: 4,
          nickname: "updater2",
          datetime: "2025-01-21T09:30:00Z"
        }
      },
      article_price: {
        refidarticle: 102,
        serialnumber: "SN002",
        taxablepurchase: "200.00",
        taxablesale: "250.00",
        taxablerecommended: "260.00",
        vatpurchase: "22",
        vatsale: "22",
        vatrecommended: "22",
        user_created: {
          id: 3,
          nickname: "creator2",
          datetime: "2025-01-21T09:00:00Z"
        },
        user_updated: {
          id: 4,
          nickname: "updater2",
          datetime: "2025-01-21T09:30:00Z"
        }
      }
    },
    {
      id: 3,
      code: "ART003",
      progressive: 3,
      quantity: "10",
      article_data: {
        title: "Article Three",
        description: "Article without serial number",
        refidarticle: 103,
        um: {acronym: "kg", id: 1, description: ""},
        date_snapshot: "2025-01-22T10:00:00Z",
        user_created: {
          id: 5,
          nickname: "creator3",
          datetime: "2025-01-22T09:00:00Z"
        },
        user_updated: {
          id: 6,
          nickname: "updater3",
          datetime: "2025-01-22T09:30:00Z"
        }
      },
      article_price: {
        refidarticle: 103,
        serialnumber: "",
        taxablepurchase: "300.00",
        taxablesale: "350.00",
        taxablerecommended: "360.00",
        vatpurchase: "22",
        vatsale: "22",
        vatrecommended: "22",
        user_created: {
          id: 5,
          nickname: "creator3",
          datetime: "2025-01-22T09:00:00Z"
        },
        user_updated: {
          id: 6,
          nickname: "updater3",
          datetime: "2025-01-22T09:30:00Z"
        }
      }
    }
  ];

}
