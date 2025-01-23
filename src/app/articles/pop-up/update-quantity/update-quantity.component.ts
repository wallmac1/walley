import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ModifyComponent } from '../modify/modify.component';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-update-quantity',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './update-quantity.component.html',
  styleUrl: './update-quantity.component.scss'
})
export class UpdateQuantityComponent {

  generated: boolean = false;
  isSmall: boolean = false;
  idarticle: number = 0;

  updateForm = new FormGroup({
    quantity: new FormControl<number | null>(null, Validators.required),
    taxablepurchase: new FormControl<string | null>(null),
    vatpurchase: new FormControl<string | null>(null),
    taxablerecommended: new FormControl<string | null>(null),
    vatrecommended: new FormControl<string | null>(null),
    isSerialNumber: new FormControl<boolean>(false),
    preCompiledArticles: new FormControl<boolean>(true)
  })

  serialNumberForm!: FormGroup;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(public dialogRef: MatDialogRef<ModifyComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    // Inizializza il form con i dati passati al dialog
    this.idarticle = data.idarticle;
    this.serialNumberForm = this.fb.group({
      articles: this.fb.array([])
    })
  }

  ngOnInit(): void {
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

  get articles(): FormArray {
    return this.serialNumberForm.get('articles') as FormArray;
  }

  createArticlesFormCompiled(article: any) {
    for (let i = 0; i < this.updateForm.get('quantity')?.value!; i++) {
      this.articles.push(this.createArticle(article));
    };
  }

  createArticlesFormEmpty() {
    for (let i = 0; i < this.updateForm.get('quantity')?.value!; i++) {
      this.articles.push(this.createArticle());
    };
  }

  createArticle(article?: any) {
    return this.fb.group({
      serialnumber: [null],
      taxablepurchase: [article.taxablepurchase || null],
      taxablerecommended: [article.taxablerecommended || null],
      vatpurchase: [article.vatpurchase || null],
      vatrecommended: [article.vatrecommended || null]
    })
  }

  generateArticles() {
    if (this.updateForm.get('isSerialNumber')?.value == true) {
      if (this.updateForm.get('preCompiledArticles')?.value == true) {
        const article = {
          taxablepurchase: this.updateForm.get('taxablepurchase')?.value,
          taxablerecommended: this.updateForm.get('taxablerecommended')?.value,
          vatpurchase: this.updateForm.get('vatpurchase')?.value,
          vatrecommended: this.updateForm.get('vatrecommended')?.value,
        }
        this.createArticlesFormCompiled(article);
      }
      else {
        this.createArticlesFormEmpty();
      }
      this.updateForm.disable();
      this.generated = true;
    }
    else {
      this.saveArticles();
    }
  }

  saveArticles() {
    const lines = [{
      quantity: this.updateForm.get('quantity')?.value,
      taxablepurchase: this.updateForm.get('taxablepurchase')?.value,
      taxablerecommended: this.updateForm.get('taxablerecommended')?.value,
      vatpurchase: this.updateForm.get('vatpurchase')?.value,
      vatrecommended: this.updateForm.get('vatrecommended')?.value,
      serialnumber: this.updateForm.get('serialnumber')?.value,
    }]
    console.log(lines)
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/addArticlePrices',
      { idarticle: this.idarticle, check_sn: this.updateForm.get('isSerialNumber')?.value, lines: lines })
      .subscribe((val: ApiResponse<any>) => {

      })
  }

  modifyArticle() {
    // CHIAMATA AL SERVER PER MODIFICARE L'ARTICOLO
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
