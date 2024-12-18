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
    public dialogRef: MatDialogRef<SearchPopupComponent>) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.articleForm = new FormGroup({
      article: new FormControl<string>(this.data.text)
    })
    this.searchArticle();
  }

  closeModal() {
    this.dialogRef.close();
  }

  displayArticleName(article?: any): string {
    return article;
  }

  print() {
    console.log("PRINT", this.articleForm.get('article')?.value)
  }

  private searchArticle() {
    this.filteredArticles$ = this.articleForm.get('article')!.valueChanges.pipe(
      startWith(this.articleForm.get('article')?.value || ''),
      filter(value => value.length > 0),
      debounceTime(300),
      switchMap((value: string) => this.getArticles(value))
    );
  }

  private getArticles(val: string): Observable<Article[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const articles: Article[] = [
      {
        id: 6,
        code: "8745",
        article_data: {
          id: 48,
          title: "Prodotto D",
          description: "Descrizione del prodotto D.",
          refidum: 4,
        },
        article_price: {
          id: 5,
          taxablepurchase: 400.25,
          taxablesale: 450.75,
          serialnumber: "35467", 
        }
      }
    ];

    // Restituisce la lista come Observable
    return of(articles).pipe(
      map(items => items.filter(article =>
        article.article_data.title.toLowerCase().includes(val.toLowerCase())
      ))
    );
  }

  save(option: any) {
    this.dialogRef.close(option);
  }

  close() {
    this.dialogRef.close(null);
  }
}
