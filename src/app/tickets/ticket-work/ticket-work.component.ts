import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketWorksService } from '../services/ticket-works.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LineFile } from '../../voucher/interfaces/line-file';
import { Connect } from '../../classes/connect';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConnectServerService } from '../../services/connect-server.service';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { ImageViewerComponent } from '../../voucher/image-viewer/image-viewer.component';
import { Work } from '../interfaces/work';
import { TicketLine } from '../interfaces/ticket-lines';

@Component({
  selector: 'app-ticket-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatExpansionModule,
    TranslateModule
  ],
  templateUrl: './ticket-work.component.html',
  styleUrl: './ticket-work.component.scss'
})
export class TicketWorkComponent {

  //tooltipLineCreation: any;
  screenWidth: number = window.innerWidth;
  files: LineFile[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  workForm!: FormGroup;
  validHoursMinutes: boolean = false;

  @Input() work!: TicketLine;
  @Input() ticketId: number = 0;
  @Input() index: number = 0;
  @Input() hours: { id: number, value: number }[] = [];
  @Input() minutes: { id: number, value: number }[] = [];
  @Output() getLine = new EventEmitter<{ index: number, idticketline: number }>()
  @Output() delete = new EventEmitter<{ index: number, idticketline: number }>()

  submitted = false;

  constructor(private connectServerService: ConnectServerService, public dialog: MatDialog,
    private translate: TranslateService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.files = this.work.attachments;
    this.initForm();
    //this.initLine();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  initForm() {
    this.workForm = this.fb.group({
      description: [this.work.description, Validators.required],
      hours: [this.work.hours, Validators.required],
      minutes: [this.work.minutes, Validators.required],
      taxablepurchase: [this.work.taxablepurchase || null],
      taxablesale: [this.work.taxablesale || null],
    })
  }

  // private initLine() {
  //   let created_at: string = '';
  //   let updated_at: string = '';
  //   if (this.workForm.get('user_created')?.value != null) {
  //     created_at = this.translate.instant('VOUCHER.CREATED') + ': ' + this.workForm.get('user_created')?.value.nickname + ' - ' +
  //       this.workForm.get('user_created')?.value.datetime + ', '
  //   }
  //   if (this.workForm.get('user_updated')?.value != null) {
  //     updated_at = this.translate.instant('VOUCHER.UPDATED') + ': ' + this.workForm.get('user_updated')?.value.nickname +
  //       ' - ' + this.workForm.get('user_updated')?.value.datetime;
  //   }
  //   this.tooltipLineCreation = created_at + updated_at
  // }

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
      formData.append('idticketline', String(this.work.idticketline));
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

  deleteFile(filename: string) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/ticketLineDeleteFile',
      { idvoucher: this.ticketId, idvoucherline: this.work.idticketline, filename: filename })
      .subscribe((val: any) => {
        this.resetFileInput();
        this.getFiles();
      })
  }

  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload-' + this.work.idticketline) as HTMLInputElement;
    fileInput.value = '';
  }

  getFiles() {
    if (this.work.idticketline > 0) {
      this.connectServerService.getRequest<ApiResponse<{ files: LineFile[] }>>(Connect.urlServerLaraApi, 'ticket/ticketLineFilesList',
        { idticket: this.ticketId, idticketline: this.work.idticketline })
        .subscribe((val: ApiResponse<{ attachments: LineFile[] }>) => {
          if (val.data) {
            this.files = val.data.attachments;
            console.log(this.files)
          }
        })
    }
  }

  deleteWork() {
    this.delete.emit({ index: this.index, idticketline: this.work.idticketline });
  }

  saveWork() {
    this.checkHoursAndMinutes();
    this.submitted = true;
    if (this.workForm.valid && this.validHoursMinutes) {
      const line_copy = JSON.parse(JSON.stringify(this.workForm.getRawValue()));
      line_copy.idticketline = this.work.idticketline;
      line_copy.idticket = this.ticketId;
      line_copy.type_line = 1;
      line_copy.quantity = null;
      line_copy.title = null;
      line_copy.refidum = null;
      line_copy.taxablepurchase = null;
      line_copy.taxablesale = null;
      line_copy.refidarticle = null;
      line_copy.refidarticledata = null;
      line_copy.refidarticleprice = null;
      
      this.submitted = false;
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicketLine', { obj_line: line_copy})
        .subscribe((val: ApiResponse<any>) => {
          if(val) {
            if(this.work.idticketline == 0) {
              this.getLine.emit({index: this.index, idticketline: val.data.idticketline});
            }
            else {
              this.getLine.emit({index: this.index, idticketline: this.work.idticketline});
            }
          }
        })
    }
  }

  checkHoursAndMinutes() {
    if(this.workForm.get('hours')?.value == 0 && this.workForm.get('minutes')?.value == 0) {
      this.validHoursMinutes = false;
    }
    else {
      this.validHoursMinutes = true;
    }
  }

}
