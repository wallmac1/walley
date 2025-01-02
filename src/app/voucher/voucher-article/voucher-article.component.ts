import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { Title } from '@angular/platform-browser';

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
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line: Lines = {
    idvoucherline: 0,
    type_line: 2,
    description: '',
    code: '',
    title: '',
    quantity: '1,00',
    refidum: 0,
    refidarticle: null,
    refidarticledata: null,
    refidarticleprice: null,
    serialnumber: 0,
    taxablepurchase: '0,00',
    taxablesale: '0,00',
    attachments: [],
    user_created: {
      id: 0,
      nickname: '',
      datetime: ''
    },
    user_updated: {
      id: 0,
      nickname: '',
      datetime: ''
    }
  };

  @Input() index: number = -1;
  @Input() voucherId: number = 0;
  @Output() delete = new EventEmitter<{index: number, id: number}>();
  @Output() save = new EventEmitter<{index: number, line: Lines}>();
  lineForm!: FormGroup;

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService, public dialog: MatDialog,
    private translate: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initLine();
    this.getMeasurmentUnits();
    this.formLogic();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initLine() {
    this.line.quantity = this.line.quantity.replace('.', ',');
    if (this.line.taxablepurchase) {
      this.line.taxablepurchase = this.line.taxablepurchase.replace('.', ',');
    }
    if (this.line.taxablesale) {
      this.line.taxablesale = this.line.taxablesale.replace('.', ',');
    }

    this.lineForm = this.fb.group({
      idvoucherline: [this.line.idvoucherline],
      type_line: [this.line.type_line],
      description: [this.line.description, Validators.required],
      quantity: [this.line.quantity, [Validators.required, this.notZeroValidator(), this.numberWithCommaValidator()]],
      taxablepurchase: [this.line.taxablepurchase || '0,00', [Validators.required, this.numberWithCommaValidator()]],
      taxablesale: [this.line.taxablesale || '0,00', [Validators.required, this.numberWithCommaValidator()]],
      user_created: [this.line.user_created || null],
      user_updated: [this.line.user_updated || null],
      refidarticle: [this.line.refidarticle || null],
      refidarticledata: [this.line.refidarticledata || null],
      refidarticleprice: [this.line.refidarticleprice || null],
      serialnumber: [this.line.serialnumber],
      refidum: [this.line.refidum, Validators.required],
      title: [this.line.title, Validators.required],
      code: [this.line.code],
    })

    if (this.line.refidarticle != null) {
      this.lineForm.get('title')?.disable();
      this.isProductSelected = true;
    }

    let created_at: string = '';
    let updated_at: string = '';
    if (this.line.user_created != null) {
      created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.line.user_created.nickname + ' - ' +
        this.line.user_created.datetime + ', '
    }
    if (this.line.user_updated != null) {
      updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.line.user_updated.nickname +
        ' - ' + this.line.user_updated.datetime;
    }
    this.tooltipLineCreation = created_at + updated_at
  }

  formLogic() {
    this.lineForm.get('code')?.disable();
  }

  openInformation() {
    this.isOpenInformations = !this.isOpenInformations;
  }

  openPopup() {
    const dialogRef = this.dialog.open(SearchPopupComponent, {
      data: { text: this.lineForm.get('title')?.value },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: Article | null) => {
      console.log(result)
      if (result) {
        this.lineForm.get('title')?.setValue(result.article_data.title);
        this.lineForm.get('title')?.disable();
        this.lineForm.get('refidum')?.setValue(result.article_data.refidum);
        this.lineForm.get('code')?.setValue(result.code);
        this.lineForm.get('description')?.setValue(result.article_data.description);
        this.lineForm.get('id')?.setValue(result.id);
        this.lineForm.get('taxablepurchase')?.setValue(result.article_price.taxablepurchase?.toString().replace('.', ','));
        this.lineForm.get('taxablesale')?.setValue(result.article_price.taxablesale?.toString().replace('.', ','));
        this.lineForm.get('refidarticle')?.setValue(result.id);
        this.lineForm.get('refidarticledata')?.setValue(result.article_data.id);
        this.lineForm.get('refidarticleprice')?.setValue(result.article_price.id);
        this.lineForm.get('serialnumber')?.setValue(result.article_price.serialnumber);
        this.lineForm.get('quantity')?.setValue('1,00');
        this.isProductSelected = true;
        this.lineForm.markAsDirty();
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

      const totalFilesCount = this.line.attachments.length + selectedFiles.length;

      // Verifica il limite massimo
      if (totalFilesCount > 5) {
        alert(`Puoi caricare un massimo di 5 file.`);
        this.resetFileInput();  // Ripristina l'input file
        return;
      }

      formData.append('idvoucher', String(this.voucherId))
      formData.append('idvoucherline', String(this.line.idvoucherline));
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
    const fileInput = document.getElementById('fileUpload-' + this.line.idvoucherline) as HTMLInputElement;
    fileInput.value = '';
  }

  notZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { zero: true }; // Se il campo è vuoto, consideralo non valido
      }

      const isValid = parseFloat(value.replace(',', '.')) > 0;

      return isValid ? null : { zero: true }; // Restituisci l'errore se non valido
    };
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

  getFiles() {
    if (this.line.idvoucherline > 0) {
      this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
        { idvoucher: this.voucherId, idvoucherline: this.line.idvoucherline })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.line.attachments = val.data.attachments;
          }
        })
    }
  }

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.voucherId, idvoucherline: this.line.idvoucherline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  deleteArticle() {
    this.delete.emit({index: this.index, id: this.line.idvoucherline});
  }

  saveArticle(i: number) {
    this.submitted = true;
    console.log(this.lineForm.get('refidum')?.value)
    if (this.lineForm.valid) {
      this.lineForm.markAsPristine();
      this.submitted = false;
      this.save.emit({index: i, line: this.lineForm.getRawValue()});
    }
  }

  resetForm() {
    this.lineForm.get('title')?.setValue(null);
    this.lineForm.get('title')?.enable();
    this.lineForm.get('description')?.setValue(null);
    this.lineForm.get('id')?.setValue(0);
    this.lineForm.get('refidum')?.setValue(null);
    this.lineForm.get('refidarticle')?.setValue(null);
    this.lineForm.get('refidarticledata')?.setValue(null);
    this.lineForm.get('refidarticleprice')?.setValue(null);
    this.lineForm.get('serialnumber')?.setValue(null);
    this.lineForm.get('taxablepurchase')?.setValue('0,00');
    this.lineForm.get('taxablesale')?.setValue('0,00');
    this.lineForm.get('quantity')?.setValue('1,00');
    this.lineForm.get('code')?.setValue(null);
    this.isProductSelected = false;
    this.lineForm.markAsPristine();
  }

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }

  // addLines(lines: Lines[]) {
  //   this.linesArray.clear();
  //   lines.forEach((line: Lines) => {
  //     this.attachments.push({ files: line.attachments ? line.attachments : [] });
  //     line.quantity = line.quantity.replace('.', ',');
  //     line.taxablepurchase = line.taxablepurchase?.replace('.', ',');
  //     line.taxablesale = line.taxablesale?.replace('.', ',');
  //     this.linesArray.push(this.createLine(line))
  //   })
  // }

  // addLine(type: number) {
  //   this.linesArray.insert(0, this.createLineEmpty(type));
  // }

  // private createLine(line: Lines): FormGroup {
  //   return this.fb.group({
  //     idvoucherline: [line.idvoucherline],
  //     type_line: [line.type_line],
  //     description: [line.description, Validators.required],
  //     quantity: [line.quantity, [this.numberWithCommaValidator(), Validators.required]],
  //     refidum: [line.refidum || null, Validators.required],
  //     code: [line.code || null],
  //     serialnumber: [line.serialnumber || null],
  //     taxablepurchase: [line.taxablepurchase || '0,00', this.numberWithCommaValidator()],
  //     taxablesale: [line.taxablesale || '0,00', this.numberWithCommaValidator()],
  //     title: [line.title || null, Validators.required],
  //     refidarticle: [line.refidarticle || null],
  //     refidarticledata: [line.refidarticledata || null],
  //     refidarticleprice: [line.refidarticleprice || null],
  //     hours: [line.hours || { id: 1, value: 0 }, Validators.required],
  //     minutes: [line.minutes || { id: 1, value: 0 }, Validators.required],
  //     user_created: [line.user_created],
  //     user_updated: [line.user_updated],
  //   })
  // }

  // private createLineEmpty(type: number): FormGroup {
  //   this.attachments.push({ files: [] });
  //   return this.fb.group({
  //     idvoucherline: [0],
  //     type_line: [type],
  //     description: [null, Validators.required],
  //     quantity: ['1,00', [this.numberWithCommaValidator(), this.notZeroValidator(), Validators.required]],
  //     refidum: [null, Validators.required],
  //     code: [null],
  //     serialnumber: [null],
  //     taxablepurchase: ['0,00', this.numberWithCommaValidator()],
  //     taxablesale: ['0,00', this.numberWithCommaValidator()],
  //     title: [null, Validators.required],
  //     hours: [null, Validators.required],
  //     minutes: [null, Validators.required],
  //     refidarticle: [null],
  //     refidarticledata: [null],
  //     refidarticleprice: [null],
  //     user_created: [null],
  //     user_updated: [null],
  //   })
  // }

  // deleteLine(i: number) {
  //   const line = this.linesArray.at(i).getRawValue();
  //   if (line.idvoucherline != 0) {
  //     this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/deleteVoucherLine',
  //       { idvoucher: this.voucherId, idvoucherline: line.idvoucherline })
  //       .subscribe((val: ApiResponse<any>) => {
  //         if (val) {
  //           this.linesArray.removeAt(i)
  //           this.attachments.splice(i, 1);
  //         }
  //       })
  //   }
  //   else {
  //     this.linesArray.removeAt(i);
  //     this.attachments.splice(i, 1);
  //   }
  // }

  // saveLine(index: number) {
  //   // Chiama il server e salva la linea specifica
  //   const line = this.linesArray.at(index).getRawValue();
  //   const line_copy = JSON.parse(JSON.stringify(line));
  //   line_copy.idvoucher = this.voucherId;
  //   if (line_copy.type_line == 1) {
  //     line_copy.quantity = null;
  //     line_copy.title = null;
  //     line_copy.refidum = null;
  //     line_copy.taxablepurchase = null;
  //     line_copy.taxablesale = null;
  //     line_copy.refidarticle = null;
  //     line_copy.refidarticledata = null;
  //     line_copy.refidarticleprice = null;
  //   } else {
  //     line_copy.quantity = parseFloat(line_copy.quantity.replace(',', '.'));
  //     line_copy.taxablepurchase = line_copy.taxablepurchase != null ? parseFloat(line_copy.taxablepurchase.replace(',', '.')) : null;
  //     line_copy.taxablesale = line_copy.taxablesale != null ? parseFloat(line_copy.taxablesale.replace(',', '.')) : null;
  //     line_copy.minutes = null;
  //     line_copy.hours = null;
  //   }
  //   this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/saveVoucherLine',
  //     { obj_line: line_copy })
  //     .subscribe((val: ApiResponse<any>) => {
  //       if (val) {
  //         if (val.data && val.data.idvoucherline) {
  //           this.linesArray.at(index).get('idvoucherline')?.setValue(val.data.idvoucherline);
  //         }
  //         this.getLineServer(this.linesArray.at(index).get('idvoucherline')!.value, index);
  //       }
  //     })
  // }

}
