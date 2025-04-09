import { Component, ViewChild } from '@angular/core';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../services/connect-server.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Article } from '../interfaces/article';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss'
})
export class ArticleListComponent {

  submitted: boolean = false;

  filterForm = new FormGroup({
      title: new FormControl<string | null>(null),
      code: new FormControl<string | null>(null)
    })
  
    alphabeth: { id: number, name: string, isSelected: boolean }[] = [
      { id: 1, name: 'A', isSelected: false },
      { id: 2, name: 'B', isSelected: false },
      { id: 3, name: 'C', isSelected: false },
      { id: 4, name: 'D', isSelected: false },
      { id: 5, name: 'E', isSelected: false },
      { id: 6, name: 'F', isSelected: false },
      { id: 7, name: 'G', isSelected: false },
      { id: 8, name: 'H', isSelected: false },
      { id: 9, name: 'I', isSelected: false },
      { id: 10, name: 'J', isSelected: false },
      { id: 11, name: 'K', isSelected: false },
      { id: 12, name: 'L', isSelected: false },
      { id: 13, name: 'M', isSelected: false },
      { id: 14, name: 'N', isSelected: false },
      { id: 15, name: 'O', isSelected: false },
      { id: 16, name: 'P', isSelected: false },
      { id: 17, name: 'Q', isSelected: false },
      { id: 18, name: 'R', isSelected: false },
      { id: 19, name: 'S', isSelected: false },
      { id: 20, name: 'T', isSelected: false },
      { id: 21, name: 'U', isSelected: false },
      { id: 22, name: 'V', isSelected: false },
      { id: 23, name: 'W', isSelected: false },
      { id: 24, name: 'X', isSelected: false },
      { id: 25, name: 'Y', isSelected: false },
      { id: 26, name: 'Z', isSelected: false },
      { id: 27, name: 'All', isSelected: true }
    ];
    articleList: Article[] = [];
    dataSource = new MatTableDataSource<Article>([]);
    displayedColumns: string[] = ['id', 'code', 'title', 'total_unitstorage', 'total_unitavailable', 'total_quantitystorage', 'total_quantityavailable'];
    orderby_creation: string | null = 'asc';
    orderby_update: string | null = null;
    currentPage: number = 1;
    totalPages: number = 1;
    totalResults: number = 0;
    itemsPerPage: number = 50;
    path: string = '';
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(private router: Router, private connectServerService: ConnectServerService) { }
  
    ngOnInit(): void {
      this.getArticleList();
    }
  
    getArticleList() {
      this.articleList = [
        {
          idarticle: 1,
          code: 'ART-001',
          progressive: 1,
          total_quantityavailable: 100,
          total_quantitystorage: 120,
          total_unitavailable: 50,
          total_unitstorage: 60,
          management_sn: 1,
          management_qnt: 1,
          article_data: {
            idarticledata: 1001,
            title: 'Articolo 1',
            description: 'Descrizione articolo 1',
            note: 'Nota articolo 1',
            date_snapshot: '2024-12-01T10:00:00Z',
            um: {
              id: 1,
              acronym: 'pz',
              description: 'pezzi'
            },
            user_created: {
              id: 1,
              nickname: 'admin',
              datetime: '2024-11-20T09:00:00Z'
            },
            user_updated: {
              id: 2,
              nickname: 'editor',
              datetime: '2025-01-01T10:00:00Z'
            }
          },
          article_storage: []
        },
        {
          idarticle: 2,
          code: 'ART-002',
          progressive: 2,
          total_quantityavailable: 80,
          total_quantitystorage: 100,
          total_unitavailable: 40,
          total_unitstorage: 45,
          management_sn: 0,
          management_qnt: 1,
          article_data: {
            idarticledata: 1002,
            title: 'Articolo 2',
            description: 'Descrizione articolo 2',
            note: null,
            date_snapshot: '2024-12-05T12:00:00Z',
            um: {
              id: 2,
              acronym: 'kg',
              description: 'chilogrammi'
            },
            user_created: {
              id: 3,
              nickname: 'user123',
              datetime: '2024-12-06T11:00:00Z'
            },
            user_updated: {
              id: 3,
              nickname: 'user123',
              datetime: '2024-12-07T08:30:00Z'
            }
          },
          article_storage: []
        },
        {
          idarticle: 3,
          code: 'ART-003',
          progressive: 3,
          total_unitavailable: 30,
          total_unitstorage: 35,
          management_sn: 1,
          management_qnt: 0,
          article_data: {
            idarticledata: 1003,
            title: 'Articolo 3',
            description: null,
            note: 'Attenzione: aggiornare la descrizione',
            date_snapshot: null,
            um: null,
            user_created: {
              id: 4,
              nickname: 'techUser',
              datetime: '2025-01-10T13:45:00Z'
            },
            user_updated: {
              id: 5,
              nickname: 'manager',
              datetime: '2025-01-15T16:20:00Z'
            }
          },
          article_storage: []
        }
      ];
      this.dataSource.data = this.articleList;

      // const letter = this.alphabeth.find((val) => val.isSelected == true)?.name;
      // this.connectServerService.getRequest(Connect.urlServerLaraApi, 'article/articleList', {
      //   itemsPerPage: this.itemsPerPage, currentPageIndex: this.currentPage, letter: letter
      // })
      //   .subscribe((val: ApiResponse<any>) => {
      //     if (val.data) {
      //       this.customerList = val.data.customerList.customers;
      //       this.dataSource.data = this.customerList;
  
      //       // Pagination info
      //       this.currentPage = val.data.customerList.paginator.currentPage;
      //       this.totalPages = val.data.customerList.paginator.lastPage;
      //       this.totalResults = val.data.customerList.paginator.total;
  
      //       this.path = val.data.path;
      //     }
      //   });
    }
  
    letterFilter(id: number) {
      // CHIAMATA AL SERVER PER OTTENERE TUTTI I CLIENTI CON QUELLA LETTERA
      let index = -1;
      index = this.alphabeth.findIndex((letter) => letter.isSelected == true);
      if (index >= 0) {
        this.alphabeth[index].isSelected = false;
      }
  
      index = this.alphabeth.findIndex((letter) => letter.id == id);
      if (index >= 0) {
        this.alphabeth[index].isSelected = true;
      }
  
      this.getArticleList();
  
    }

    textFilter() {

    }
  
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.getArticleList();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.getArticleList();
      }
    }
  
    goToArticle(id: number) {
      this.router.navigate(["article", id]);
    }

    createArticle() {
      this.router.navigate(['articleNew']);
    }

}
