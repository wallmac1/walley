import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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

  articleStorageList: ArticleStorage[] = [];
  dataSource = new MatTableDataSource<ArticleStorage>([]);
  displayedColumns = ['unit_available', 'unit_storage', 'unit_taxablepurchase', 'vatpurchase',
    'pricepurchase', 'unit_taxablerecommended', 'vatrecommended', 'pricerecommended', 'actions'];

  isSmall: boolean = false;

  @Input() idarticle: number = 0;
  @Output() refreshArticle = new EventEmitter<null>;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private connectServerService: ConnectServerService) { }

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
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articlePricesList', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.articleStorageList = val.data.warehouse;
          this.dataSource.data = this.articleStorageList;
        }
      })
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
    const dialogRef = this.dialog.open(UpdateQntUntComponent, {
      maxWidth: '900px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article, management_type: 0, idddt: article.idddt, idarticle: this.idarticle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.getArticles();
        this.refreshArticle.emit();
      }
    });
  }

}
