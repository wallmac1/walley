import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { Article, MeasurementUnit } from '../interfaces/article';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  tooltipLineCreation: any;
  filteredArticles$!: Observable<Article[]>
  isOpenInformations = false;
  screenWidth: number = window.innerWidth;
  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() articleForm!: FormGroup;
  @Input() article!: Article;
  @Input() index: number = -1;
  @Input() ticketId: number = 0;

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService, public dialog: MatDialog,
    private translate: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.initLine();
    this.getFiles();
    this.getMeasurmentUnits();
    this.formLogic();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initForm() {
    if(this.article.quantity != null) {
      this.article.quantity = this.article.quantity.replace('.', ','); 
    }
    if(this.article.taxablepurchase != null) {
      this.article.taxablepurchase = this.article.taxablepurchase.replace('.', ',');
    }
    if(this.article.taxablesale != null) {
      this.article.taxablesale = this.article.taxablesale.replace('.', ',');
    }
    this.articleForm = this.fb.group({
      title: [this.article.title],
      description: [this.article.description],
      code: [this.article.code],
      serialnumber: [this.article.serialnumber],
      quantity: [this.article.quantity || '0,00', this.numberWithCommaValidator()],
      refidum: [this.article.refidum],
      refidarticle: [this.article.refidarticle],
      refidarticledata: [this.article.refidarticledata],
      refidarticleprice: [this.article.refidarticleprice],
      taxablepurchase: [this.article.taxablepurchase || '0,00', this.numberWithCommaValidator()],
      taxablesale: [this.article.taxablesale || '0,00', this.numberWithCommaValidator()],
    })
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

  private initLine() {
    if (this.articleForm.get('refidarticle')?.value != null) {
      this.articleForm.get('title')?.disable();
      this.isProductSelected = true;
    }

    let created_at: string = '';
    let updated_at: string = '';
    if (this.articleForm.get('user_created')?.value != null) {
      created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.article.user_created.nickname + ' - ' +
        this.article.user_created.datetime + ', '
    }
    if (this.article.user_updated != null) {
      updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.article.user_updated.nickname +
        ' - ' + this.article.user_updated.datetime;
    }
    this.tooltipLineCreation = created_at + updated_at
  }

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
      console.log(result)
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

      formData.append('idvoucher', String(this.ticketId))
      formData.append('idvoucherline', String(this.article.idticketline));
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
    const fileInput = document.getElementById('fileUpload-' + this.article.idticketline) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    if (this.article.idticketline > 0) {
      this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
        { idvoucher: this.ticketId, idvoucherline: this.article.idticketline })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.files = val.data.attachments;
          }
        })
    }
  }

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.ticketId, idvoucherline: this.article.idticketline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  deleteArticle() {

  }

  saveArticle() {
    this.submitted = true;
    console.log(this.articleForm.get('refidum')?.value)
    if (this.articleForm.valid) {
      this.articleForm.markAsPristine();
      this.submitted = false;
    }
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

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }
}
