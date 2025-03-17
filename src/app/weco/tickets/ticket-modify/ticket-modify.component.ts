import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, SecurityContext, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketInfo } from '../interfaces/ticket-info';
import { MatIcon } from '@angular/material/icon';
import { Image } from '../../interfaces/image';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiResponse } from '../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { ImageViewerComponent } from '../../../voucher/image-viewer/image-viewer.component';
import { SystemInfoPopupComponent } from '../../system/system-info-popup/system-info-popup.component';
import { MatMenuModule } from '@angular/material/menu';
import { Message } from '../interfaces/message';
import { QuillModule } from 'ngx-quill';
import { ChangeStatusPopupComponent } from './components/change-status-popup/change-status-popup.component';
import { DeleteMessagePopupComponent } from './components/delete-message-popup/delete-message-popup.component';
import { InchargeReleasePopupComponent } from './components/incharge-release-popup/incharge-release-popup.component';
import { DeleteTicketPopupComponent } from './components/delete-ticket-popup/delete-ticket-popup.component';

@Component({
  selector: 'app-ticket-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule,
    InViewportDirective,
    MatMenuModule,
    QuillModule
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  @ViewChild('panel') panelComponent!: MatExpansionPanel;
  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef;

  // Ticket & Status Variables
  isNewMessage: boolean = false;
  idticket: number = 0;
  ticketInfo: TicketInfo | null = null;
  idsystem: number = 0;
  systemStatus: { id: number, name: string, color: string } = { id: 0, name: '', color: '' };
  requestList: { id: number, title: string }[] = [];
  submittedInfo: boolean = false;
  submittedNewMessage: boolean = false;
  submittedOldMessage: boolean[] = [];

  isSmallScreen: boolean = false;
  isLargeScreen: boolean = false;
  visualizeAll = true;

  // Attachments Variables
  maxImages: number = 10;
  maxFileSize = 5 * 1024 * 1024;
  maxFiles = 3;
  acceptedExt: string[] = ['jpg', 'png', 'jpeg'];
  fileListInfo: File[] = [];
  removedFilesInfo: number[] = [];
  imageSpaceLeftInfo: boolean = true;
  fileListOldMessages: { files: File[] }[] = [];
  removedFilesOldMessages: { index: number, id: number[] }[] = [];
  fileListNewMessage: File[] = [];
  newAttachedFiles: any[] = [];
  urlMultimedia: string = Connect.urlServerLaraFile;

  newMessageForm!: FormGroup;
  oldMessagesForm!: FormGroup;
  ticketInfoForm!: FormGroup;

  //firstCard: {id: number, description: string, attached: any[], date: string, sender: number}
  messagesList: Message[] = [];

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller,
    private connectServerService: ConnectServerService, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idticket = parseInt(id);
      }
    });

    this.newMessageForm = this.fb.group({
      description: ['', Validators.required],
      date: [''],
      time: [''],
      public: [0],
      attachments: this.fb.array([])
    });

    this.ticketInfoForm = this.fb.group({
      email: [null, Validators.required],
      inverterList: this.fb.array([]),
      batteryList: this.fb.array([]),
      description: [null, Validators.required],
      note: [null],
      public: [null]
    });

    this.oldMessagesForm = this.fb.group({
      messages: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idsystem = params['idsystem'];
    });
    this.getTicketInfo();
    this.updateWindowDimensions();
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }

    if (window.innerWidth < 1400) {
      this.isLargeScreen = false;
    }
    else {
      this.isLargeScreen = true;
    }
  }

  private scrollToTop(): void {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack() {
    this.router.navigate(['systemOverview', this.idsystem]);
  }

  get newAttachments(): FormArray {
    return this.newMessageForm.get('attachments') as FormArray;
  }

  get inverterList(): FormArray {
    return this.ticketInfoForm.get('inverterList') as FormArray;
  }

  get batteryList(): FormArray {
    return this.ticketInfoForm.get('batteryList') as FormArray;
  }

  get messages(): FormArray {
    return this.oldMessagesForm.get('messages') as FormArray;
  }

  addNewMessageAttachment(img: Image) {
    this.newAttachments.push(this.fb.group({
      id: 0,
      src: [img.src],
      ext: [img.ext],
      title: [img.title]
    }));
  }

  createMessage(message: Message) {
    return this.fb.group({
      idticketline: [message.idticketline],
      description: [message.description, Validators.required],
      public: [message.public],
      portal: [message.portal],
      attachments: [message.attachments],
      date_only: [message.date_only],
      time_only: [message.time_only],
      user_created: [message.user_created]
    })
  }

  createMessageList(messages: Message[]) {
    this.messages.controls.splice(0, this.messages.length);
    this.fileListOldMessages = [];
    this.removedFilesOldMessages = [];
    this.submittedOldMessage = [];
    let i = 0;
    messages.forEach((message) => {
      this.messages.push(this.createMessage(message));
      this.fileListOldMessages.push({ files: [] });
      this.removedFilesOldMessages.push({ index: i, id: [] });
      this.submittedOldMessage.push(false);
      i += 1;
    })
    //console.log(this.messages.getRawValue())
  }

  createInverter(inverter: any) {
    return this.fb.group({
      id: [inverter.id],
      sn: [inverter.sn],
      selected: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected: [battery.selected],
    })
  }

  createInverterList(inverterList: any[]) {
    this.inverterList.reset();
    inverterList.forEach((inverter) => {
      this.inverterList.push(this.createInverter(inverter));
    })
  }

  createBatteryList(batteryList: any[]) {
    //console.log(this.batteryList.controls)
    this.batteryList.reset();
    batteryList.forEach((battery) => {
      this.batteryList.push(this.createBattery(battery));
    })
  }

  changeVisualization() {
    this.visualizeAll = !this.visualizeAll;
  }

  newMessage(): void {
    this.isNewMessage = true;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const timeStr = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    this.newMessageForm.patchValue({
      date: dateStr,
      time: timeStr,
    });
    this.panelComponent.close();
    setTimeout(() => {
      this.bottomAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  viewImage(img: Image) {
    //console.log(img)
    if (img.ext != 'pdf' && this.acceptedExt.includes(img.ext || '')) {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        maxWidth: '800px',
        width: '90%',
        minWidth: '350px',
        data: { file: img }
      });
    }
    // else if (img.ext == 'pdf') {
    //   const dialogRef = this.dialog.open(PdfViewerComponent, {
    //     maxWidth: '700px',
    //     minWidth: '350px',
    //     maxHeight: '500px',
    //     data: { pdf: img }
    //   });
    // }
    else {
      if(img.id > 0) {
        const urlString = this.sanitizer.sanitize(SecurityContext.URL, img.src);
        const newTab = window.open(this.urlMultimedia+urlString!, "_blank");
      }
      else {
        const newTab = window.open(img.src.toString(), '_blank');
      }
    }
  }

  systemInfoPopup() {
    //console.log("IDSYSTEM", this.idsystem)
    const dialogRef = this.dialog.open(SystemInfoPopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: { idsystem: this.idsystem }
    });
  }

  initTicketInfoForm() {
    this.ticketInfoForm.get('request')?.setValue(this.ticketInfo?.requestType);
    this.ticketInfoForm.get('email')?.setValue(this.ticketInfo?.email);
    this.ticketInfoForm.get('description')?.setValue(this.ticketInfo?.description);
    this.ticketInfoForm.get('note')?.setValue(this.ticketInfo?.note);
    this.ticketInfoForm.get('public')?.setValue(this.ticketInfo?.public);
    this.inverterList.controls.splice(0, this.inverterList.length);
    this.batteryList.controls.splice(0, this.batteryList.length);
    if (this.ticketInfo?.batteryList) {
      this.createBatteryList(this.ticketInfo?.batteryList);
    }
    if (this.ticketInfo?.inverterList) {
      this.createInverterList(this.ticketInfo?.inverterList);
    }
  }

  getTicketInfo() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'lavorazioni/ticketDetail', { idticket: this.idticket })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.ticketInfo = val.data.ticketInfo;
          this.idsystem = val.data.ticketInfo.idsystem;
          if (this.ticketInfo) {
            this.initTicketInfoForm();
          }
          if (val.data.ticketMessages) {
            this.createMessageList(val.data.ticketMessages);
          }
        }
      })
  }

  getTicketLines() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'lavorazioni/ticketLines', { idticket: this.idticket })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data.lines) {
          this.createMessageList(val.data.lines);
        }
      })
  }

  // SALVATAGGIO INFO
  saveTicketInfo() {
    const formData = new FormData();
    this.submittedInfo = true;

    if (this.ticketInfoForm.valid) {
      this.convertBooleanToNumber();
      // Aggiungi i file al formData
      this.fileListInfo.forEach((file) => {
        formData.append('attachments[]', file);
      })

      // Aggiungi i valori del form al formData
      Object.keys(this.ticketInfoForm.controls).forEach(key => {
        const control = this.ticketInfoForm.get(key);

        if (control instanceof FormArray) {
          // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
          formData.append(key, JSON.stringify(control.value));
        } else {
          formData.append(key, control?.value);
        }
      });

      // Aggiungi array ID rimossi
      formData.append('removeAttachments', JSON.stringify(this.removedFilesInfo));

      // Aggiungi ID del sistema e del ticket
      formData.append('idticket', this.idticket.toString());
      formData.append('idsystem', this.idsystem.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicket', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.getTicketInfo();
            this.removedFilesInfo = [];
            this.fileListInfo = [];
          }
        })
    }
  }

  // SALVATAGGIO NUOVO MESSAGGIO
  saveTicketNewMessage() {
    const formData = new FormData();
    this.submittedNewMessage = true;
    //console.log(this.newTicketForm.getRawValue())
    if (this.newMessageForm.valid) {
      // Aggiungi i file al formData
      this.fileListNewMessage.forEach((file) => {
        formData.append('attachments[]', file);
      })

      // Aggiungi i valori del form al formData
      this.newMessageForm.get('public')?.setValue(this.newMessageForm.get('public')?.value ? 1 : 0);
      Object.keys(this.newMessageForm.controls).forEach(key => {
        const control = this.newMessageForm.get(key);
        if (key != 'attachments') {
          if (control instanceof FormArray) {
            // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
            formData.append(key, JSON.stringify(control.value));
          } else {
            formData.append(key, control?.value);
          }
        }
      });

      // Aggiungi ID del sistema e del ticket
      formData.append('idticket', this.idticket.toString());
      formData.append('idticketline', "0");
      formData.append('idsystem', this.idsystem.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicketLine', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.getTicketLines();
            this.newMessageForm.reset();
            this.fileListNewMessage = [];
            this.isNewMessage = false;
            this.submittedNewMessage = false;
          }
        })
    }
  }

  // SALVATAGGIO OLD MESSAGGIO
  saveTicketOldMessage(index: number) {
    const formData = new FormData();
    this.submittedOldMessage[index] = true;

    if (this.messages.at(index).valid) {
      this.messages.at(index).get('public')?.setValue(this.messages.at(index).get('public')?.value ? 1 : 0);
      // Aggiungi i file al formData
      this.fileListOldMessages[index].files.forEach((file) => {
        formData.append('attachments[]', file);
      })
      console.log("QUI", formData.getAll)

      // Aggiungi i valori del form al formData
      Object.keys(this.oldMessagesForm.get('messages')?.value.at(index)).forEach(key => {
        const control = this.messages.at(index).get(key);

        if (key != 'attachments' && key != 'user_created') {
          if (control instanceof FormArray) {
            // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
            formData.append(key, JSON.stringify(control.value));
          } else {
            formData.append(key, control?.value);
          }
        }
      });

      // Array dei files rimossi
      formData.append('removeAttachments', JSON.stringify(this.removedFilesOldMessages[index].id))

      // Aggiungi ID del sistema e del ticket
      formData.append('idticket', this.idticket.toString());
      formData.append('idsystem', this.idsystem.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicketLine', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.fileListOldMessages = [];
            this.getTicketLines();
            this.submittedOldMessage[index] = false;
          }
        })
    }
  }

  // AGGIUNTA FILE
  onFileSelectedInfo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      //console.log("Files:", files.length, "FileListInfo:", this.fileListInfo.length, "TicketInfoAttachments:", this.ticketInfo?.attachments.length);
      if (files.length + this.ticketInfo?.attachments.length! > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        } else {
          this.fileListInfo.push(file);

          // Creare un'anteprima dell'immagine
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileExtension = file.name.split('.').pop() || '';
            const image: Image = {
              id: 0, // Puoi aggiornare l'id successivamente se necessario
              ext: fileExtension,
              src: e.target.result,
              title: file.name,
            };
            this.ticketInfo?.attachments.push(image);
          };
          reader.readAsDataURL(file);
        }
      });
      // Reset Input
      //console.log("files", input.value);
      input.value = '';
    }
  }

  onFileSelectedOldMessage(event: Event, msgIndex: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      if (this.messages.at(msgIndex).get('attachments')?.value.length + files.length > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        }
        else {
          this.fileListOldMessages[msgIndex].files.push(file);

          // Creare un'anteprima dell'immagine
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileExtension = file.name.split('.').pop() || '';
            const image: Image = {
              id: 0, // Puoi aggiornare l'id successivamente se necessario
              ext: fileExtension,
              src: e.target.result,
              title: file.name,
            };
            this.messages.at(msgIndex).get('attachments')?.value.push(image);
            //console.log(this.fileListOldMessages[msgIndex])
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onFileSelectedNewMessage(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      //console.log("Files:", files.length, "FilesNewMessagesImg:", this.fileListNewMessage.length);
      if (files.length + this.fileListNewMessage.length > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        } else {
          this.fileListNewMessage.push(file);

          // Creare un'anteprima dell'immagine
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileExtension = file.name.split('.').pop() || '';
            const image: Image = {
              id: 0,
              ext: fileExtension,
              src: e.target.result,
              title: file.name,
            };
            this.addNewMessageAttachment(image);
          };
          reader.readAsDataURL(file);
        }
      });
      // Reset Input
      //console.log("files", input.value);
      input.value = '';
    }
  }

  // ELIMINAZIONE FILES 
  deleteFileInfo(index: number): void {
    const fileId = this.ticketInfo?.attachments[index].id
    if (fileId && fileId > 0) {
      this.removedFilesInfo.push(fileId);
    }
    this.fileListInfo.splice(index, 1);
    this.ticketInfo?.attachments.splice(index, 1);
  }

  deleteFileOldMessage(index: number, msgIndex: number): void {
    const fileId = this.messages.controls[msgIndex].get('attachments')?.value[index].id;
    if (fileId > 0) {
      this.removedFilesOldMessages[msgIndex].id.push(fileId);
    }
    this.fileListOldMessages[msgIndex].files.splice(index, 1);
    this.messages.controls[msgIndex].get('attachments')?.value.splice(index, 1);
  }

  deleteFileNewMessage(index: number) {
    this.fileListNewMessage.splice(index, 1);
    this.newAttachments.removeAt(index);
  }

  takeOnChargeOrRelease(request_type: number) { 
    const dialogRef = this.dialog.open(InchargeReleasePopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: { 
        idticket: this.idticket,
        request_type: request_type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result.incharge) {
        this.ticketInfo!.incharge = result.incharge;
      }
    });
  }

  changeStatus() {
    const dialogRef = this.dialog.open(ChangeStatusPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: { 
        idticket: this.idticket 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null && result.ticketStatus) {
        this.ticketInfo!.ticketStatus = result.ticketStatus;
      }
    });
  }

  deleteMessage(idticketline: number) {
    const dialogRef = this.dialog.open(DeleteMessagePopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: {
        idticket: this.idticket,
        idticketline: idticketline
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.fileListOldMessages = [];
        this.getTicketLines();
        this.submittedOldMessage = [];
      }
    });
  }

  deleteTicket() {
    const dialogRef = this.dialog.open(DeleteTicketPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: {
        idticket: this.idticket,
        idsystem: this.idsystem
      }
    });
  }

  convertBooleanToNumber() {
    this.inverterList.controls.forEach(inverter => {
      inverter.get('selected')?.setValue(inverter.get('selected')?.value ? 1 : 0);
    });

    this.batteryList.controls.forEach(battery => {
      battery.get('selected')?.setValue(battery.get('selected')?.value ? 1 : 0);
    });

    this.ticketInfoForm.get('public')?.setValue(this.ticketInfoForm.get('public')?.value ? 1 : 0);
  }

}
