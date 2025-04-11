import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { UpdateQntUntComponent } from '../../pop-up/update-qnt-unt/update-qnt-unt.component';
import { DeleteStorageRowComponent } from '../../pop-up/delete-storage-row/delete.storage.row';
import { Article, ArticleStorage } from '../../interfaces/article';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-storage-line-sn',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './storage-line-sn.component.html',
  styleUrl: './storage-line-sn.component.scss'
})
export class StorageLineSnComponent {

  submitted: boolean = false;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalPages: number = 1;
  articles: ArticleStorage[] = [];

  filterForm = new FormGroup({
    serialnumber: new FormControl<string | null>(null, Validators.required)
  })

  dataSource = new MatTableDataSource<ArticleStorage>([]);
  displayedColumns = ['serialnumber', 'unit_available', 'unit_storage', 'unit_taxablepurchase', 'vatpurchase',
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

  prevPage() {

  }

  nextPage() {

  }

  filter() {
    this.submitted = true;
    if (this.filterForm.valid) {
      this.submitted = false;
    }
  }

  getArticles() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articlePricesList', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {
        this.articles = val.data.warehouse;
        this.dataSource.data = this.articles;
      })
  }

  documentsPopup() { }

  deletePopUp(article: Article) {
    this.dialog.open(DeleteStorageRowComponent, {
      maxWidth: '700px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article, management_type: 1 }
    });
  }

  modifyPopUp(article: any) {
    const dialogRef = this.dialog.open(UpdateQntUntComponent, {
      maxWidth: '900px',
      maxHeight: '500px',
      width: '94%',
      data: { article: article, management_type: 1, idarticlestorage: article.idarticlestorage, idarticle: this.idarticle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.getArticles();
        this.refreshArticle.emit();
      }
    });
  }
}
