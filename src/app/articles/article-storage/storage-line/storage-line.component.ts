import { Component, HostListener, Input } from '@angular/core';
import { ModifyComponent } from '../../pop-up/modify/modify.component';
import { DeleteComponent } from '../../pop-up/delete/delete.component';
import { Article, ArticleStorage } from '../../interfaces/article';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

//NO SERIAL NUMBER, NO QUANTITY

@Component({
  selector: 'app-storage-line',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './storage-line.component.html',
  styleUrl: './storage-line.component.scss'
})
export class StorageLineComponent {

  dataSource = new MatTableDataSource<ArticleStorage>([]);
  displayedColumns = ['unit_available', 'unit_storage', 'unit_taxablepurchase', 'vatpurchase', 
    'pricepurchase', 'unit_taxablerecommended', 'vatrecommended', 'pricerecommended', 'actions'];

  //checkboxGroup = document.querySelector('#groupAction') as HTMLElement;
  //storageForm: FormGroup;
  isSmall: boolean = false;

  @Input() idarticle: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private connectServerService: ConnectServerService) {
    // this.storageForm = this.fb.group({
    //   articles: this.fb.array([])
    // })
  }

  ngOnInit(): void {
    this.getArticles();
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 700) {
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
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articlePricesList', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {

      })
    //this.createArticlesForm(this.articlesTemporary);
    this.dataSource.data = this.articlesTemporary.article_storage;
    console.log(this.dataSource.data)
  }

  // get articles(): FormArray {
  //   return this.storageForm.get('articles') as FormArray;
  // }

  // createArticlesForm(articles: Article[]) {
  //   this.dataSource.data = articles;
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

  documentsPopup() { }

  deletePopUp(article: Article) {
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
      data: { article: article, management_type: 0 }
    });
  }

  modifyPopUp(article: any) {
    this.dialog.open(ModifyComponent, {
      maxWidth: '800px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article, management_type: 0 }
    });
  }

  articlesTemporary =
    {
      idarticle: 1,
      code: "ART-001",
      progressive: 1001,
      total_quantityavailable: 150,
      total_quantitystorage: 200,
      total_unitavailable: 15,
      total_unitstorage: 20,
      management_sn: 1,
      management_qnt: 1,
      article_data: {
        idarticledata: 10,
        title: "Articolo Esempio",
        description: "Descrizione esempio per articolo",
        note: "Note aggiuntive",
        um: {
          id: 1,
          acronym: "pz",
          description: "Pezzo"
        },
        date_snapshot: "2024-11-01T10:00:00Z",
        user_created: {
          id: 2,
          nickname: "admin",
          datetime: "2024-10-01T09:30:00Z"
        },
        user_updated: {
          id: 3,
          nickname: "editor",
          datetime: "2025-03-25T14:45:00Z"
        }
      },
      article_storage: [
        {
          idarticlestorage: 100,
          serialnumber: "SN123456789",
          unit_taxablepurchase: "10.00",
          unit_taxablerecommended: "12.00",
          unit_storage: 5,
          unit_available: 3,
          qnt_taxablepurchase: "50.00",
          qnt_taxablerecommended: "60.00",
          qnt_storage: 10,
          qnt_available: 8,
          vatpurchase: "22",
          vatrecommended: "22",
          pricepurchase: "12.20",
          pricerecommended: "14.64",
          user_created: {
            id: 4,
            nickname: "creator1",
            datetime: "2024-12-01T11:00:00Z"
          },
          user_updated: {
            id: 5,
            nickname: "updater1",
            datetime: "2025-02-20T16:15:00Z"
          }
        },
        {
          idarticlestorage: 101,
          serialnumber: "SN613456780",
          unit_taxablepurchase: "10.00",
          unit_taxablerecommended: "12.00",
          unit_storage: 8,
          unit_available: 6,
          qnt_taxablepurchase: "50.00",
          qnt_taxablerecommended: "60.00",
          qnt_storage: 10,
          qnt_available: 8,
          vatpurchase: "22",
          vatrecommended: "22",
          pricepurchase: "12.20",
          pricerecommended: "14.64",
          user_created: {
            id: 4,
            nickname: "creator1",
            datetime: "2024-12-01T11:00:00Z"
          },
          user_updated: {
            id: 5,
            nickname: "updater1",
            datetime: "2025-02-20T16:15:00Z"
          }
        }
      ]
    }
}
