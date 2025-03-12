import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, SecurityContext, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  isNewMessage: boolean = false;
  idticket: number = 0;
  ticketInfo: TicketInfo | null = null;
  isSmallScreen: boolean = false;
  maxImages: number = 10;
  requestList: { id: number, title: string }[] = [];
  fileList: File[] = [];
  imagesList: Image[] = [];
  acceptedExt: string[] = ['jpg', 'png', 'jpeg'];
  imageSpaceLeft: boolean = true;
  idsystem: number = 0;
  systemStatus: { id: number, name: string, color: string } = { id: 0, name: '', color: '' };
  // isAtBottom: boolean = false;
  // isAtBottomSm: boolean = false;
  visualizeAll = true;
  submitted: boolean = false;
  maxFileSize = 5 * 1024 * 1024;
  maxFiles = 3;

  newAttachedFiles: any[] = [];
  newMessageForm = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string | null>(null),
    date: new FormControl<string | null>(null),
    time: new FormControl<string | null>(null),
    //attachments: new FormControl<Image[]>([]),
  });
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

    this.ticketInfoForm = this.fb.group({
      email: [null],
      request: [null],
      inverterList: this.fb.array([]),
      batteryList: this.fb.array([]),
      description: [null],
      internalNotes: [null],
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
  }

  private scrollToTop(): void {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack() {
    this.router.navigate(['systemOverview', this.idsystem]);
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

  createMessage(message: Message) {
    return this.fb.group({
      id: [message.id],
      description: [message.description],
      public: [message.public],
      portal: [message.portal],
      attachments: [message.attachments],
      user_created: [message.user_created]
    })
  }

  createMessageList(messages: Message[]) {
    this.messages.reset();
    messages.forEach((message) => {
      this.messages.push(this.createMessage(message));
    })
    console.log(this.messages.getRawValue())
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
      selected: [battery.sn],
    })
  }

  createInverterList(inverterList: any[]) {
    this.inverterList.reset();
    inverterList.forEach((inverter) => {
      this.inverterList.push(this.createInverter(inverter));
    })
  }

  createBatteryList(batteryList: any[]) {
    console.log(this.batteryList.controls)
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
    console.log(img)
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
      const urlString = this.sanitizer.sanitize(SecurityContext.URL, img.src);
      const newTab = window.open(urlString!, "_blank");
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
    this.ticketInfoForm.get('internalNotes')?.setValue(this.ticketInfo?.internalNotes);
    this.ticketInfoForm.get('public')?.setValue(this.ticketInfo?.public);
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
        if (val.data.ticketLines) {
          this.createMessageList(val.data.ticketLines);
        }
      })
  }

  saveTicketInfo() {
    const formData = new FormData();
    this.submitted = true;
    //console.log(this.newTicketForm.getRawValue())
    if (this.ticketInfoForm.valid) {
      this.convertBooleanToNumber();
      // Aggiungi i file al formData
     
      // TODO AGGIUNGERE LE FOTO AL FORMDATA

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

      // Aggiungi ID del sistema e del ticket
      formData.append('idticket', this.idticket.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicket', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            
          }
        })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      if (this.fileList.length + files.length > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        } else {
          this.fileList.push(file);

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
            this.imagesList.push(image);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onFileSelectedOnMessage(event: Event, msgIndex: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      if (this.messages.controls[msgIndex].get('attached_files')?.value.length + files.length > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        } else {
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
            this.messages.controls[msgIndex].get('attached_files')?.value.push(image);
            console.log(this.messages.controls[msgIndex].get('attached_files')?.value)
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  deleteFile(index: number): void {
    this.imagesList.splice(index, 1);
    this.fileList.splice(index, 1);
  }

  deleteFileOnMessage(index: number, msgIndex: number): void {
    this.messages.controls[msgIndex].get('attached_files')?.value.splice(index, 1);
  }

  takeOnCharge() { }

  release() { }

  changeStatus() {
    const dialogRef = this.dialog.open(ChangeStatusPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: { idticket: this.ticketInfo?.idsystem }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  sendMessage() {
    // CHIAMATA AL SERVER E POI SI NAVIGA ALLA PAGINA CON L'ID DEL TICKET RESTITUITO
    const formData = new FormData();
    //this.submitted = true;
    //console.log(this.newTicketForm.getRawValue())
    if (this.newMessageForm.valid) {
      // Aggiungi i file al formData

      // TODO AGGIUNGERE ALLEGATI AL FORMDATA

      // Aggiungi i valori del form al formData
      Object.keys(this.newMessageForm.controls).forEach(key => {
        const control = this.newMessageForm.get(key);

        if (control instanceof FormArray) {
          // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
          formData.append(key, JSON.stringify(control.value));
        } else {
          formData.append(key, control?.value);
        }
      });

      // Aggiungi ID del sistema e del ticket
      formData.append('idticket', this.idticket.toString());
      formData.append('idticketline', "0");

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicket', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.getTicketLines();
          }
        })
    }
  }

  updateMessage(message: Message) {

  }

  deleteMessage(id: number) {

  }

  convertBooleanToNumber() {
    this.inverterList.controls.forEach(inverter => {
      inverter.get('selected')?.setValue(inverter.get('selected')?.value ? 1 : 0);
    });

    this.batteryList.controls.forEach(battery => {
      battery.get('selected')?.setValue(battery.get('selected')?.value ? 1 : 0);
    });
  }

  create() {
    // CHIAMATA AL SERVER E POI SI NAVIGA ALLA PAGINA CON L'ID DEL TICKET RESTITUITO
    const formData = new FormData();
    this.submitted = true;
    console.log(this.newMessageForm.getRawValue())
    if (this.newMessageForm.valid) {

      this.convertBooleanToNumber();
      // Aggiungi i file al formData
      this.fileList.forEach((file, index) => {
        formData.append('attachments[]', file);
      });

      // Aggiungi i valori del form al formData
      Object.keys(this.newMessageForm.controls).forEach(key => {
        const control = this.newMessageForm.get(key);

        if (control instanceof FormArray) {
          // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
          formData.append(key, JSON.stringify(control.value));
        } else {
          formData.append(key, control?.value);
        }
      });

      // Aggiungi ID del sistema e del ticket
      formData.append('idsystem', this.idsystem.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/saveTicket', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            //this.popupDialogService.alertElement(val);
            this.router.navigate(['ticketModify', val.data.idticket]);
          }
        })

      const idticket = 0;
      this.router.navigate(['ticket', idticket])
    }
  }

}
