import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { Line } from 'ngx-extended-pdf-viewer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { SearchPopupComponent } from '../search-popup/search-popup.component';
import { InViewportDirective } from '../../directives/in-viewport.directive';

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
  styleUrl: './voucher-article.component.scss',
})
export class VoucherArticleComponent {

  isProductSelected: boolean = false;
  tooltipLineCreation: any;
  filteredArticles$!: Observable<Article[]>
  isOpenInformations = false;
  screenWidth: number = window.innerWidth;
  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line!: FormGroup;
  @Input() index: number = -1;
  @Input() voucherId: number = 0;
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<number>();

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService, public dialog: MatDialog,
    private translate: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initLine();
    this.getFiles();
    this.getMeasurmentUnits();
    this.formLogic();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initLine() {
    if(this.line.get('refidarticle')?.value != null){
      this.line.get('title')?.disable();
      this.isProductSelected = true;
    }
    this.line.get('description')?.clearValidators();
    this.line.get('hours')?.clearValidators();
    this.line.get('minutes')?.clearValidators();
    
    let created_at: string = '';
    let updated_at: string = '';
    if(this.line.get('user_created')?.value != null) {
      created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.line.get('user_created')?.value.nickname + ' - ' + 
      this.line.get('user_created')?.value.datetime + ', '
    }
    if(this.line.get('user_updated')?.value != null) {
      updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.line.get('user_updated')?.value.nickname +
      ' - ' + this.line.get('user_updated')?.value.datetime;
    }
    this.tooltipLineCreation = created_at + updated_at
  }

  formLogic() {
    this.line.get('code')?.disable();
  }

  openInformation() {
    this.isOpenInformations = !this.isOpenInformations;
  }

  openPopup() {
    const dialogRef = this.dialog.open(SearchPopupComponent, {
      data: { text: this.line.get('title')?.value },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: Article | null) => {
      console.log(result)
      if (result) {
        this.line.get('title')?.setValue(result.article_data.title);
        this.line.get('title')?.disable();
        this.line.get('refidum')?.setValue(result.article_data.refidum);
        this.line.get('code')?.setValue(result.code);
        this.line.get('description')?.setValue(result.article_data.description);
        this.line.get('id')?.setValue(result.id);
        this.line.get('taxablepurchase')?.setValue(result.article_price.taxablepurchase?.toString().replace('.', ','));
        this.line.get('taxablesale')?.setValue(result.article_price.taxablesale?.toString().replace('.', ','));
        this.line.get('refidarticle')?.setValue(result.id);
        this.line.get('refidarticledata')?.setValue(result.article_data.id);
        this.line.get('refidarticleprice')?.setValue(result.article_price.id);
        this.line.get('serialnumber')?.setValue(result.article_price.serialnumber);
        this.line.get('quantity')?.setValue('1,00');
        this.isProductSelected = true;
        this.line.markAsDirty();
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

      formData.append('idvoucher', String(this.voucherId))
      formData.append('idvoucherline', String(this.line.get('idvoucherline')?.value));
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
    if (this.line.get('idvoucherline')?.value > 0) {
      this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
        { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.files = val.data.attachments;
          }
        })
    }
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
    console.log(this.line.get('refidum')?.value)
    if (this.line.valid) {
      this.line.markAsPristine();
      this.submitted = false;
      this.save.emit(this.index);
    }
  }

  resetForm() {
    this.line.get('title')?.setValue(null);
    this.line.get('title')?.enable();
    this.line.get('description')?.setValue(null);
    this.line.get('id')?.setValue(0);
    this.line.get('refidum')?.setValue(null);
    this.line.get('refidarticle')?.setValue(null);
    this.line.get('refidarticledata')?.setValue(null);
    this.line.get('refidarticleprice')?.setValue(null);
    this.line.get('serialnumber')?.setValue(null);
    this.line.get('taxablepurchase')?.setValue('0,00');
    this.line.get('taxablesale')?.setValue('0,00');
    this.line.get('quantity')?.setValue('0,00');
    this.line.get('code')?.setValue(null);
    this.isProductSelected = false;
    this.line.markAsPristine();
  }

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{unitOfMeasurements: MeasurementUnit[]}>) => {
        if(val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }

}
