import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, filter, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { Article } from '../interfaces/article';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';

@Component({
  selector: 'app-search-popup',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    CommonModule,
    MatOptionModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './search-popup.component.html',
  styleUrl: './search-popup.component.scss'
})
export class SearchPopupComponent {

  submitted = false;
  filteredArticles$!: Observable<Article[]>

  articleForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text: string },
    public dialogRef: MatDialogRef<SearchPopupComponent>,
    private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.articleForm = new FormGroup({
      article: new FormControl<Article | null>(null)
    })
    this.searchArticle();
  }

  closeModal() {
    this.dialogRef.close();
  }

  displayArticleName(article?: Article): string {
    console.log(article)
    let returnString = '';
    if (article) {
      if (article.serialnumber) {
        returnString = article.code + ' - ' + article.title + ' - ' + article.serialnumber;
      }
      else {
        returnString = article.code + ' - ' + article.title;
      }
    }
    return returnString;
  }

  private searchArticle() {
    const article_field = this.articleForm.get('article');
    if (article_field) {
      this.filteredArticles$ = article_field.valueChanges
      .pipe(
        startWith(this.articleForm.get('article')?.value || ''),
        map(value => typeof value === 'string' ? value : value?.title || value.serialnumber || value.code || ''),
        filter(value => value.length > 0),
        debounceTime(300),
        switchMap((value: string) => 
          value ? this.getArticles(value) : [])
      );
    }
  }

  private getArticles(val: string): Observable<Article[]> {
    return this.connectServerService.getRequest<ApiResponse<{ article: Article[] }>>(Connect.urlServerLaraApi, 'articles/searchArticles',
      {
        query: val
      }).pipe(
        map(response => response.data.cities)
      );
  }

  save(option: any) {
    this.dialogRef.close(option);
  }

  close() {
    this.dialogRef.close(null);
  }
}
