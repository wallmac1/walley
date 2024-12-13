import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { TranslateModule } from '@ngx-translate/core';
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

  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  @Input() line!: FormGroup;
  @Input() index: number = -1;
  @Input() voucherId: number = 0;
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<number>();

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getFiles();
    this.getMeasurmentUnits();
  }

  openImageModal(file: LineFile): void {
    this.dialog.open(ImageViewerComponent, {
      data: { file: file},
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
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

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
      { idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload-'+this.line.get('idvoucherline')?.value) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    this.connectServerService.postRequest<ApiResponse<{files: LineFile[]}>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles', 
      {idvoucher: this.voucherId, idvoucherline: this.line.get('idvoucherline')?.value})
      .subscribe((val: ApiResponse<{attachments: LineFile[]}>) => {
        if(val.data) {
          this.files = val.data.attachments;
          console.log(this.files)
        }
    })
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
