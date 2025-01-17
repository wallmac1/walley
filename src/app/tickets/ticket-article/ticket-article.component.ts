import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Article, MeasurementUnit } from '../interfaces/article';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Connect } from '../../classes/connect';
import { LineFile } from '../../voucher/interfaces/line-file';
import { Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConnectServerService } from '../../services/connect-server.service';
import { SearchPopupComponent } from '../../voucher/search-popup/search-popup.component';
import { ImageViewerComponent } from '../../voucher/image-viewer/image-viewer.component';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TicketLine } from '../interfaces/ticket-lines';

@Component({
  selector: 'app-ticket-article',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './ticket-article.component.html',
  styleUrl: './ticket-article.component.scss'
})
export class TicketArticleComponent {

  isProductSelected: boolean = false;
  //tooltipLineCreation: any;
  filteredArticles$!: Observable<Article[]>
  isOpenInformations = false;
  screenWidth: number = window.innerWidth;
  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  articleForm!: FormGroup;

  @Input() article!: TicketLine;
  @Input() index: number = -1;
  @Input() ticketId: number = 0;
  @Input() measurmentUnit: MeasurementUnit[] = [];
  @Output() getLine = new EventEmitter<{ index: number, idticketline: number }>()
  @Output() delete = new EventEmitter<{ index: number, idticketline: number }>()

  submitted = false;

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService, public dialog: MatDialog,
    private translate: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.article.attachments) {
      this.files = this.article.attachments;
    }

    this.initForm();
    //this.initLine();
    this.formLogic();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initForm() {
    if (this.article.quantity != null) {
      this.article.quantity = this.article.quantity.replace('.', ',');
    }
    if (this.article.taxablepurchase != null) {
      this.article.taxablepurchase = this.article.taxablepurchase.replace('.', ',');
    }
    if (this.article.taxablesale != null) {
      this.article.taxablesale = this.article.taxablesale.replace('.', ',');
    }
    this.articleForm = this.fb.group({
      title: [this.article.title, Validators.required],
      description: [this.article.description],
      code: [this.article.code],
      serialnumber: [this.article.serialnumber],
      quantity: [this.article.quantity || '0,00', [this.numberWithCommaValidator(), Validators.required]],
      refidum: [this.article.refidum, Validators.required],
      refidarticle: [this.article.refidarticle],
      refidarticledata: [this.article.refidarticledata],
      refidarticleprice: [this.article.refidarticleprice],
      taxablepurchase: [this.article.taxablepurchase || '0,00', this.numberWithCommaValidator()],
      taxablesale: [this.article.taxablesale || '0,00', this.numberWithCommaValidator()],
    })
    if (this.article.refidarticle) {
      this.isProductSelected = true;
      this.articleForm.get('title')?.disable();
    }
  }

  numberWithCommaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      // Controlla se il valore soddisfa i criteri
      const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  // private initLine() {
  //   if (this.articleForm.get('refidarticle')?.value != null) {
  //     this.articleForm.get('title')?.disable();
  //     this.isProductSelected = true;
  //   }

  //   let created_at: string = '';
  //   let updated_at: string = '';
  //   if (this.articleForm.get('user_created')?.value != null) {
  //     created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.article.user_created?.nickname + ' - ' +
  //       this.article.user_created?.datetime + ', '
  //   }
  //   if (this.article.user_updated != null) {
  //     updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.article.user_updated.nickname +
  //       ' - ' + this.article.user_updated.datetime;
  //   }
  //   this.tooltipLineCreation = created_at + updated_at
  // }

  formLogic() {
    this.articleForm.get('code')?.disable();
  }

  openInformation() {
    this.isOpenInformations = !this.isOpenInformations;
  }

  openPopup() {
    const dialogRef = this.dialog.open(SearchPopupComponent, {
      data: { text: this.articleForm.get('title')?.value },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any | null) => {
      if (result) {
        this.articleForm.get('title')?.setValue(result.article_data.title);
        this.articleForm.get('title')?.disable();
        this.articleForm.get('refidum')?.setValue(result.article_data.refidum);
        this.articleForm.get('code')?.setValue(result.code);
        this.articleForm.get('description')?.setValue(result.article_data.description);
        this.articleForm.get('taxablepurchase')?.setValue(result.article_price.taxablepurchase?.toString().replace('.', ','));
        this.articleForm.get('taxablesale')?.setValue(result.article_price.taxablesale?.toString().replace('.', ','));
        this.articleForm.get('refidarticle')?.setValue(result.id);
        this.articleForm.get('refidarticledata')?.setValue(result.article_data.id);
        this.articleForm.get('refidarticleprice')?.setValue(result.article_price.id);
        this.articleForm.get('serialnumber')?.setValue(result.article_price.serialnumber);
        this.articleForm.get('quantity')?.setValue('1,00');
        this.isProductSelected = true;
        this.articleForm.markAsDirty();
      }
    });
  }

  openImageModal(file: LineFile): void {
    this.dialog.open(ImageViewerComponent, {
      data: { file: file },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement
    const formData: FormData = new FormData();

    if (input.files) {
      // Calcola il totale dei file caricati
      const selectedFiles = Array.from(input.files);

      const totalFilesCount = this.files.length + selectedFiles.length;

      // Verifica il limite massimo
      if (totalFilesCount > 5) {
        alert(`Puoi caricare un massimo di 5 file.`);
        this.resetFileInput();  // Ripristina l'input file
        return;
      }

      formData.append('idticket', String(this.ticketId))
      formData.append('idticketline', String(this.article.idticketline));
      selectedFiles.forEach(element => {
        formData.append('files[]', element);
      });

      // Invia i file al server
      this.connectServerService.postRequest<File[]>(Connect.urlServerLaraApi, 'ticket/ticketLineUploadFiles', formData)
        .subscribe((val: any) => {
          if (val) {
            this.resetFileInput();
            this.getFiles();
          }
        });
    }
  }

  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload-' + this.article.idticketline) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    if (this.article.idticketline > 0) {
      this.connectServerService.getRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'ticket/ticketLineFilesList',
        { idticket: this.ticketId, idticketline: this.article.idticketline })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.files = val.data.attachments;
          }
        })
    }
  }

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/ticketLineDeleteFile',
      { idvoucher: this.ticketId, idvoucherline: this.article.idticketline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  resetForm() {
    this.articleForm.get('title')?.setValue(null);
    this.articleForm.get('title')?.enable();
    this.articleForm.get('description')?.setValue(null);
    this.articleForm.get('refidum')?.setValue(null);
    this.articleForm.get('refidarticle')?.setValue(null);
    this.articleForm.get('refidarticledata')?.setValue(null);
    this.articleForm.get('refidarticleprice')?.setValue(null);
    this.articleForm.get('serialnumber')?.setValue(null);
    this.articleForm.get('taxablepurchase')?.setValue('0,00');
    this.articleForm.get('taxablesale')?.setValue('0,00');
    this.articleForm.get('quantity')?.setValue('0,00');
    this.articleForm.get('code')?.setValue(null);
    this.isProductSelected = false;
    this.articleForm.markAsPristine();
  }

  deleteArticle() {
    this.delete.emit({ index: this.index, idticketline: this.article.idticketline });
  }

  saveArticle() {
    this.submitted = true;
    if (this.articleForm.valid) {
      const line_copy = JSON.parse(JSON.stringify(this.articleForm.getRawValue()));
      line_copy.idticketline = this.article.idticketline;
      line_copy.idticket = this.ticketId;
      line_copy.type_line = 2;
      line_copy.public = null;

      line_copy.quantity = parseFloat(line_copy.quantity.replace(',', '.'));
      line_copy.taxablepurchase = parseFloat(line_copy.taxablepurchase.replace(',', '.'));
      line_copy.taxablesale = parseFloat(line_copy.taxablesale.replace(',', '.'));

      this.submitted = false;
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicketLine', { obj_line: line_copy })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            if (this.article.idticketline == 0) {
              this.getLine.emit({ index: this.index, idticketline: val.data.idticketline });
            }
            else {
              this.getLine.emit({ index: this.index, idticketline: this.article.idticketline });
            }
            this.articleForm.markAsPristine();
          }
        })
    }
  }
}
