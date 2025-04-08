import { Component, HostListener, Input } from '@angular/core';
import { UpdateQntUntComponent } from '../../pop-up/update-qnt-unt/update-qnt-unt.component';
import { DeleteStorageRowComponent } from '../../pop-up/delete-storage-row/delete.storage.row';
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

  isSmall: boolean = false;

  @Input() idarticle: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private connectServerService: ConnectServerService) {}

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

  getArticles() {
    // CHIAMATA AL SERVER PER OTTENERE GLI ARTICOLI E CREARE I FORM ARRAY NEL SUBSCRIBE
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articlePricesList', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {

      })
    //this.createArticlesForm(this.articlesTemporary);
    this.dataSource.data = this.articlesTemporary.article_storage;
    console.log(this.dataSource.data)
  }

  documentsPopup() { }

  deletePopUp(article: Article) {
    this.dialog.open(DeleteStorageRowComponent, {
      maxWidth: '700px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article, management_type: 0 }
    });
  }

  modifyPopUp(article: any) {
    this.dialog.open(UpdateQntUntComponent, {
      maxWidth: '900px',
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
