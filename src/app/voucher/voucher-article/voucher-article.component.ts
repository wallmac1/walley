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
    InViewportDirective
  ],
  templateUrl: './voucher-article.component.html',
  styleUrl: './voucher-article.component.scss',
})
export class VoucherArticleComponent {

  filteredArticles$!: Observable<Article[]>
  isOpenInformations = false;

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
    this.formLogic();
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

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result)
      if (result) {
        this.line.get('title')?.setValue(result.title);
        this.line.get('title')?.disable();
        this.line.get('refidum')?.setValue(result.refidum);
        this.line.get('code')?.setValue(result.code);
        this.line.get('description')?.setValue(result.description);
        this.line.get('id')?.setValue(result.id);
        this.line.get('taxable_purchase')?.setValue(result.taxable_purchase);
        this.line.get('taxable_sale')?.setValue(result.taxable_sale);
        this.line.get('quantity')?.setValue(1);
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
    this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
      { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value })
      .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
        if (val.data) {
          this.files = val.data.attachments;
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

  resetForm() {
    this.line.get('title')?.setValue(null);
    this.line.get('title')?.enable();
    this.line.get('description')?.setValue(null);
    this.line.get('id')?.setValue(0);
    this.line.get('refidum')?.setValue(0);
    this.line.get('taxable_purchase')?.setValue(0);
    this.line.get('taxable_sale')?.setValue(0);
    this.line.get('quantity')?.setValue(0);
    this.line.get('code')?.setValue(null);
    this.line.markAsPristine();
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
