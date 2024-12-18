import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LineFile } from '../interfaces/line-file';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

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
  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line!: FormGroup;
  @Input() index: number = -1;
  @Input() voucherId: number = 0;
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<number>();

  submitted = false;
  minutes: { id: number, value: number }[] = [];
  hours: { id: number, value: number }[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initLine();
    this.getFiles();
    this.getMinutesHours();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  private initLine() {
    this.line.get('refidum')?.clearValidators();
    this.line.get('title')?.clearValidators();
    this.line.get('quantity')?.clearValidators();

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

  private getMinutesHours() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/listHoursMinutesWork', {})
      .subscribe((val: ApiResponse<{hours: {id: number, value: number}[], minutes: {id: number, value: number}[]}>) => {
        if(val) {
          this.hours = val.data.hours;
          this.minutes = val.data.minutes;
        }
      })
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

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
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
            console.log(this.files)
          }
        })
    }
  }

  deleteWork(i: number) {
    this.delete.emit(this.index);
  }

  saveWork(i: number) {
    this.submitted = true;
    if (this.line.valid) {
      this.line.markAsPristine();
      this.submitted = false;
      this.save.emit(i);
    }
  }

}
