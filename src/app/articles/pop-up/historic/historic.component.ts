import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Article, ArticleData } from '../../interfaces/article';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-historic',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule
  ],
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.scss'
})
export class HistoricComponent {
  
  articles: ArticleData[] = [];
  id: number | null = null;

  constructor(public dialogRef: MatDialogRef<HistoricComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.articleid;
  }

  ngOnInit(): void {
    this.getArticleHistory();
  }

  getArticleHistory() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articleDataHistory', {idarticle: this.id})
      .subscribe((val: ApiResponse<any>) => {
        if(val.data) {
          this.articles = val.data.articleHistory;
          console.log(val.data)
        }
      })

    // CHIAMATA AL SERVER PER OTTENERE LA STORIA DEGLI ARTICOLI
    // const articlesData: ArticleData[] = [
    //   {
    //     title: "Article 1",
    //     description: "This is the first article.",
    //     refidarticle: 101,
    //     um: { id: 1, acronym: 'kg', description: "" },
    //     date_snapshot: "2025-01-01 - 12:00:00Z",
    //     user_created: {
    //       id: 1,
    //       nickname: "creator1",
    //       datetime: "2025-01-01T10:00:00Z",
    //     },
    //     user_updated: {
    //       id: 2,
    //       nickname: "updater1",
    //       datetime: "2025-01-01T11:00:00Z",
    //     },
    //   },
    //   {
    //     title: "Article 2",
    //     description: null,
    //     refidarticle: 102,
    //     um: { id: 2, acronym: 'm', description: "" },
    //     date_snapshot: "2025-01-02 - 12:00:00Z",
    //     user_created: {
    //       id: 3,
    //       nickname: "creator2",
    //       datetime: "2025-01-02T10:00:00Z",
    //     },
    //     user_updated: {
    //       id: 4,
    //       nickname: "updater2",
    //       datetime: "2025-01-02T11:00:00Z",
    //     },
    //   },
    //   {
    //     title: "Article 3",
    //     description: "This is the third article.",
    //     refidarticle: 103,
    //     um: { id: 3, acronym: 'lt', description: "" },
    //     date_snapshot: "2025-01-03 - 12:00:00Z",
    //     user_created: {
    //       id: 5,
    //       nickname: "creator3",
    //       datetime: "2025-01-03 - 10:00:00Z",
    //     },
    //     user_updated: {
    //       id: 6,
    //       nickname: "updater3",
    //       datetime: "2025-01-03 - 11:00:00Z",
    //     },
    //   }
    // ];

    // this.articles = articlesData;
  }

  close() {
    this.dialogRef.close();
  }

}
