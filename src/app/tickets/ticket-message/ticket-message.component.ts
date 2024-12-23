import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  files: LineFile[] = [];
  messageForm!: FormGroup;
  urlServerLaraFile = Connect.urlServerLaraFile;

  @Input() message!: Message;
  @Input() ticketId: number = 0;
  @Input() index: number = 0;

  constructor(private connectServerService: ConnectServerService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();
  }

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
  
        formData.append('idvoucher', String(this.ticketId))
        formData.append('idvoucherline', String(this.message.idticketline));
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
      const fileInput = document.getElementById('fileUpload-' + this.message.idticketline) as HTMLInputElement;
      fileInput.value = '';
    }
  
    getFiles() {
      if (this.message.idticketline > 0) {
        this.connectServerService.postRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'voucher/voucherListFiles',
          { idvoucher: this.ticketId, idvoucherline: this.message.idticketline })
          .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
            if (val.data) {
              this.files = val.data.attachments;
            }
          })
      }
    }
  
    deleteFile(filename: string) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/voucherDeleteFile',
        { idvoucher: this.ticketId, idvoucherline: this.message.idticketline, filename: filename })
        .subscribe((val: any) => {
          this.resetFileInput();
          this.getFiles();
        })
    }

    deleteMessage() {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/ticketDeleteMessage',
        { idticket: this.ticketId, idticketline: this.message.idticketline })
        .subscribe((val: any) => {
          this.resetFileInput();
          this.getFiles();
        })
    }

    saveMessage() { }
}
