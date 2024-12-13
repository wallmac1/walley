import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { Line } from 'ngx-extended-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { LineFile } from '../interfaces/line-file';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Article } from '../interfaces/article';

@Component({
  selector: 'app-voucher-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
  templateUrl: './voucher-article.component.html',
  styleUrl: './voucher-article.component.scss'
})
export class VoucherArticleComponent {

  filteredArticles$!: Observable<Article[]>

  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line!: FormGroup;
  @Input() index: number = -1;
  @Input() voucherId: number = 0;
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<number>();

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getFiles();
    this.getMeasurmentUnits();
    this.searchArticle();
    this.formLogic();
  }

  formLogic() {
    this.line.get('code')?.disable();
  }

  openImageModal(file: LineFile): void {
    console.log('Qui', file)
    this.dialog.open(ImageViewerComponent, {
      data: { file: file },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  displayArticleName(article?: Article): string {
    return article ? article.title! : '';
  }

  private searchArticle() {
    const customer_field = this.line.get('article');
    if (customer_field) {
      this.filteredArticles$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.title || ''),
          filter(value => value.length > 0),
          debounceTime(600),
          switchMap((value: string) =>
            value ? this.getArticles(value) : [])
        );
    }
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
        id: 1,
        title: "Prodotto A",
        description: "Descrizione del prodotto A.",
        code: "A123",
        refidum: 10,
        taxable_purchase: 100.50,
        taxable_sale: 150.75
    },
    {
        id: 2,
        title: "Prodotto B",
        description: "Descrizione del prodotto B.",
        code: "B456",
        refidum: 20,
        taxable_purchase: 200.00,
        taxable_sale: 250.50
    },
    {
        id: 3,
        title: "Prodotto C",
        description: "Descrizione del prodotto C.",
        code: "C789",
        refidum: 30,
        taxable_purchase: 300.75,
        taxable_sale: 350.00
    },
    {
        id: 4,
        title: "Prodotto D",
        description: "Descrizione del prodotto D.",
        code: "D012",
        refidum: 40,
        taxable_purchase: 400.25,
        taxable_sale: 450.75
    }
    ];

    // Restituisce la lista come Observable
    return of(articles);
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement
    const formData: FormData = new FormData();

    if (input.files) {
      formData.append('idvoucher', String(this.voucherId))
      formData.append('idvoucherline', String(this.line.get('idvoucherline')?.value));
      const selectedFiles = Array.from(input.files);
      selectedFiles.forEach(element => {
        formData.append('files[]', element);
      });

      // Invia i file al server
      this.connectServerService.postRequest<File[]>(Connect.urlServerLaraApi, 'voucher/voucherUploadFiles', formData)
        .subscribe((val: any) => {
          if (val) {
            this.resetFileInput();
            this.getFiles();
          }
        });
    }
  }

  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload-' + this.line.get('idvoucherline')?.value) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
      { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value })
      .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
        if (val.data) {
          this.files = val.data.attachments;
          console.log(this.files)
        }
      })
  }

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  deleteArticle(i: number) {
    this.delete.emit(this.index);
  }

  saveArticle(i: number) {
    this.submitted = true;
    if (this.line.valid) {
      this.line.markAsPristine();
      this.submitted = false;
      this.save.emit(this.index);
    }
  }

  private getMeasurmentUnits() {
    // CHIAMATA AL SERVER PER PRENDERE LE UNITA' DI MISURA
    this.measurmentUnit = [
      {
        id: 1,
        acronym: "kg"
      },
      {
        id: 2,
        acronym: "pcs"
      },
      {
        id: 3,
        acronym: "m"
      },
      {
        id: 4,
        acronym: "l"
      }
    ]
  }

}
