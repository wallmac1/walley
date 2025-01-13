import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Message } from '../interfaces/message';
import { ConnectServerService } from '../../services/connect-server.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LineFile } from '../../voucher/interfaces/line-file';
import { Connect } from '../../classes/connect';
import { ImageViewerComponent } from '../../voucher/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { TicketLine } from '../interfaces/ticket-lines';

@Component({
  selector: 'app-ticket-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatExpansionModule,
    TranslateModule
  ],
  templateUrl: './ticket-message.component.html',
  styleUrl: './ticket-message.component.scss'
})
export class TicketMessageComponent {

  screenWidth: number = window.innerWidth;
  //tooltipLineCreation = '';
  files: LineFile[] = [];
  messageForm!: FormGroup;
  urlServerLaraFile = Connect.urlServerLaraFile;
  submitted = false;

  @Input() message!: TicketLine;
  @Input() ticketId: number = 0;
  @Input() index: number = 0;
  @Output() getLine = new EventEmitter<{ index: number, idticketline: number }>()
  @Output() delete = new EventEmitter<{ index: number, idticketline: number }>()

  constructor(private connectServerService: ConnectServerService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.message.attachments) {
      this.files = this.message.attachments;
    }

    //this.initLine();
    this.initForm();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  // private initLine() {
  //   let created_at: string = '';
  //   let updated_at: string = '';
  //   if (this.messageForm.get('user_created')?.value != null) {
  //     created_at = this.messageForm.instant('VOUCHER.CREATED') + ': ' + this.messageForm.get('user_created')?.value.nickname + ' - ' +
  //       this.messageForm.get('user_created')?.value.datetime + ', '
  //   }
  //   if (this.messageForm.get('user_updated')?.value != null) {
  //     updated_at = this.messageForm.instant('VOUCHER.UPDATED') + ': ' + this.messageForm.get('user_updated')?.value.nickname +
  //       ' - ' + this.messageForm.get('user_updated')?.value.datetime;
  //   }
  //   this.tooltipLineCreation = created_at + updated_at
  // }

  private initForm() {
    this.messageForm = this.fb.group({
      public: [this.message.public],
      description: [this.message.description, Validators.required]
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

      formData.append('idticket', String(this.ticketId))
      formData.append('idticketline', String(this.message.idticketline));
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
    const fileInput = document.getElementById('fileUpload-' + this.message.idticketline) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    if (this.message.idticketline > 0) {
      this.connectServerService.getRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'ticket/ticketLineFilesList',
        { idticket: this.ticketId, idticketline: this.message.idticketline })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.files = val.data.attachments;
          }
        })
    }
  }

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/ticketLineDeleteFile',
      { idticket: this.ticketId, idticketline: this.message.idticketline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  getMessage() {
    if (this.message.idticketline > 0) {
      this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketLine',
        { idticket: this.ticketId, idticketline: this.message.idticketline })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            this.message = val.data.ticketLineInfo;
            this.messageForm.patchValue(this.message);
          }
        })
    }
  }

  deleteMessage() {
    this.delete.emit({ index: this.index, idticketline: this.message.idticketline });
  }

  saveMessage() {
    this.submitted = true;
    if (this.messageForm.valid) {
      const line_copy = JSON.parse(JSON.stringify(this.messageForm.getRawValue()));
      line_copy.idticketline = this.message.idticketline;
      line_copy.idticket = this.ticketId;
      line_copy.type_line = 3;
      line_copy.quantity = null;
      line_copy.title = null;
      line_copy.refidum = null;
      line_copy.taxablepurchase = null;
      line_copy.taxablesale = null;
      line_copy.refidarticle = null;
      line_copy.refidarticledata = null;
      line_copy.refidarticleprice = null;
      line_copy.public = line_copy.public ? 1 : 0;

      this.submitted = false;
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicketLine', { obj_line: line_copy })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            if (this.message.idticketline == 0) {
              this.getLine.emit({ index: this.index, idticketline: val.data.idticketline });
            }
            else {
              this.getLine.emit({ index: this.index, idticketline: this.message.idticketline });
            }
            this.messageForm.markAsPristine();
          }
        })
    }
  }
}
