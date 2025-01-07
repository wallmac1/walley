import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, viewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LineFile } from '../interfaces/line-file';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { VoucherLine } from '../interfaces/lines';

@Component({
  selector: 'app-voucher-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './voucher-work.component.html',
  styleUrl: './voucher-work.component.scss'
})
export class VoucherWorkComponent {

  tooltipLineCreation: any;
  screenWidth: number = window.innerWidth;
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line: VoucherLine = {
    idvoucherline: 0,
    type_line: 1,
    description: '',
    hours: 0,
    quantity: '',
    minutes: 0,
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
  @Input() hours: {id: number, value: number}[] = [];
  @Input() minutes: {id: number, value: number}[] = [];
  @Output() delete = new EventEmitter<{index: number, id: number}>();
  @Output() save = new EventEmitter<{index: number, line: VoucherLine}>();
  lineForm!: FormGroup;

  submitted = false;

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initLine();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initLine() {
    this.lineForm = this.fb.group({
      idvoucherline: [this.line.idvoucherline],
      type_line: [this.line.type_line],
      description: [this.line.description, Validators.required],
      hours: [this.line.hours || null, Validators.required],
      minutes: [this.line.minutes || null, Validators.required],
      user_created: [this.line.user_created || null],
      user_updated: [this.line.user_updated || null],
    })

    let created_at: string = '';
    let updated_at: string = '';
    if(this.line.user_created != null) {
      created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.line.user_created.nickname + ' - ' + 
      this.line.user_created.datetime + ', '
    }
    if(this.line.user_updated != null) {
      updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.line.user_updated.nickname +
      ' - ' + this.line.user_updated.datetime;
    }
    this.tooltipLineCreation = created_at + updated_at
       
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

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.voucherId, idvoucherline: this.line.idvoucherline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload-' + this.line.idvoucherline) as HTMLInputElement;
    fileInput.value = '';
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

  deleteWork() {
    this.delete.emit({index: this.index, id: this.line.idvoucherline});
  }

  saveWork(i: number) {
    this.submitted = true;
    if (this.lineForm.valid) {
      this.lineForm.markAsPristine();
      this.submitted = false;
      this.save.emit({index: i, line: this.lineForm.getRawValue()});
    }
  }

  
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
