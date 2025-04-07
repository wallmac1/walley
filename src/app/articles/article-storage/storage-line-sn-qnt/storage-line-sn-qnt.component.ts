import { Component, HostListener, Input } from '@angular/core';
import { ModifyComponent } from '../../pop-up/modify/modify.component';
import { DeleteComponent } from '../../pop-up/delete/delete.component';
import { Article } from '../../interfaces/article';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-storage-line-sn-qnt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './storage-line-sn-qnt.component.html',
  styleUrl: './storage-line-sn-qnt.component.scss'
})
export class StorageLineSnQntComponent {
checkboxGroup = document.querySelector('#groupAction') as HTMLElement;
  storageForm: FormGroup;
  isSmall: boolean = false;

  @Input() idarticle: number = 0;
  @Input() manage_sn: boolean = false;
  @Input() manage_qnt: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private connectServerService: ConnectServerService) {
    this.storageForm = this.fb.group({
      articles: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getArticles();
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if(window.innerWidth < 700) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  // formLogicGroup() {
  //   let articleSelected: number[] = [];
  //   this.articles.controls.forEach((element, index) => {
  //     if (element.get('action')?.value == 1) {
  //       articleSelected.push(index);
  //     }
  //   });

  //   if (articleSelected.length == 0) {
  //     this.articles.controls.forEach((element) => {
  //       element.get('action')?.setValue(true);
  //     });
  //   }
  //   else {
  //     this.articles.controls.forEach((element) => {
  //       element.get('action')?.setValue(false);
  //     });
  //   }
  // }

  // formLogic() {
  //   let articleSelected: number[] = [];
  //   this.articles.controls.forEach((element, index) => {
  //     if (element.get('action')?.value == 1) {
  //       articleSelected.push(index);
  //     }
  //   });

  //   if (this.storageForm.get('groupAction')?.value == false && articleSelected.length > 0) {
  //     this.storageForm.get('groupAction')?.setValue(true);
  //   }
  //   else if (this.storageForm.get('groupAction')?.value == true && articleSelected.length == 0) {
  //     this.storageForm.get('groupAction')?.setValue(false);
  //   }
  // }

  getArticles() {
    // CHIAMATA AL SERVER PER OTTENERE GLI ARTICOLI E CREARE I FORM ARRAY NEL SUBSCRIBE
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articlePricesList', {idarticle: this.idarticle})
      .subscribe((val: ApiResponse<any>) => {

      })
    //this.createArticlesForm(this.articlesTemporary);
  }

  // get articles(): FormArray {
  //   return this.storageForm.get('articles') as FormArray;
  // }

  // createArticlesForm(articles: Article[]) {
  //   articles.forEach((article: Article) => {
  //     this.articles.push(this.createArticle(article));
  //   });
  // }

  // createArticle(article: Article) {
  //   const group = this.fb.group({
  //     id: [article.id],
  //     unit: [article.unit],
  //     serialnumber: [article.article_price.serialnumber],
  //     taxablepurchase: [article.article_price.taxablepurchase],
  //     pricesale: [article.article_price.taxablesale], // DA CAMBIARE QUANDO FINITA INTERFACCIA
  //     pricerecommended: [article.article_price.taxablesale], // DA CAMBIARE QUANDO FINITA INTERFACCIA
  //     taxablerecommended: [article.article_price.taxablerecommended],
  //     vatpurchase: [article.article_price.vatpurchase],
  //     vatrecommended: [article.article_price.vatrecommended],
  //     stored_qnt: [50],
  //     available_qnt: [40]
  //   })

  //   Object.keys(group.controls).forEach(controlName => {
  //     if (controlName !== 'action') {
  //       group.get(controlName)?.disable();
  //     }
  //   });

  //   return group;
  // }

  deletePopUp(articles: any) {
    // let data = articles;
    // if (Array.isArray(data)) {
    //   this.articles.controls.forEach((element) => {
    //     if (element.get('action')?.value == true) {
    //       data.push(element.getRawValue());
    //     }
    //   })
    // }
    this.dialog.open(DeleteComponent, {
      maxWidth: '700px',
      maxHeight: '500px',
      width: '94%',
      data: { articles: articles }
    });
  }

  modifyPopUp(article: any) {
    this.dialog.open(ModifyComponent, {
      maxWidth: '800px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article }
    });
  }

  articlesTemporary = [
    {
      id: 1,
      code: "ART001",
      progressive: 1,
      unit: 1,
      article_data: {
        title: "Article One",
        description: "First article with serial number",
        refidarticle: 101,
        um: { acronym: "kg", id: 1, description: "" },
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
      unit: 1,
      article_data: {
        title: "Article Two",
        description: "Second article with serial number",
        refidarticle: 102,
        um: { acronym: "kg", id: 1, description: "" },
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
      unit: 10,
      article_data: {
        title: "Article Three",
        description: "Article without serial number",
        refidarticle: 103,
        um: { acronym: "kg", id: 1, description: "" },
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
