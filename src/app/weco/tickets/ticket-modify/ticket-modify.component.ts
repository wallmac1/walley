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
import { ActivatedRoute, Router } from '@angular/router';
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

  newAttachedFiles: any[] = [];
  newMessageForm = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string | null>(null),
    date: new FormControl<string | null>(null),
    time: new FormControl<string | null>(null),
  });
  oldMessagesForm!: FormGroup;
  ticketInfoForm!: FormGroup;

  //firstCard: {id: number, description: string, attached: any[], date: string, sender: number}
  messagesList: Message[] = [];

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller,
    private connectServerService: ConnectServerService, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
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
    this.getStatus();
    this.getData();
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
      attached_files: [message.attached_files],
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
      selected_inverter: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected_battery: [battery.sn],
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

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraApi, 'system/systemStatus', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ status: { id: number, name: string, color: string } }>) => {
          if (val.data) {
            this.systemStatus = val.data.status;
          }
        })
    }
  }

  sendMessage() {

  }

  viewImage(img: Image) {
    console.log(img)
    if (img.ext != 'pdf' && this.acceptedExt.includes(img.ext || '')) {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        maxWidth: '90%',
        minWidth: '350px',
        maxHeight: '90%',
        data: { image: img }
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

  getData() {
    this.ticketInfo = {
      id: 123,
      public: 1,
      progressive: "001",
      openingDate: "2023-04-10T12:00:00Z",
      description: "Richiesta di assistenza",
      requestType: 1,
      email: "example@example.com",
      internalNotes: "Note interne per i tecnici",
      attachedFiles: [{ id: 1, src: 'wecoW.jpg', ext: 'jpg', folder: '', title: '' }],
      inverterList: [
        { id: 1, sn: "INV-001", selected_inverter: 0 },
        { id: 2, sn: "INV-002", selected_inverter: 1 }
      ],
      batteryList: [
        { id: 10, sn: "BAT-001", selected_battery: 1 },
        { id: 11, sn: "BAT-002", selected_battery: 1 }
      ]
    };

    this.initTicketInfoForm()

    this.messagesList = [
      {
        id: 1,
        description: "Messaggio di benvenuto",
        public: 1,
        attached_files: [
          { id: 101, src: "trial.jpeg", ext: "jpeg", title: "Immagine 1" }
        ],
        portal: 0,
        user_created: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 2,
        description: "Documentazione aggiornata",
        public: 0,
        attached_files: [
          { id: 102, src: "pic1.jpg", ext: "jpg", title: "Manuale" }
        ],
        portal: 1,
        user_created: {
          id: 2,
          nickname: "user123",
          datetime: "2023-02-10T14:45:00",
          date_only: "2023-02-10",
          time_only: "14:45:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 3,
        description: "Nota interna",
        public: null,
        attached_files: [],
        portal: 0,
        user_created: {
          id: 3,
          nickname: "supervisor",
          datetime: "2023-03-05T09:15:00",
          date_only: "2023-03-05",
          time_only: "09:15:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 4,
        description: "Aggiornamento sistema",
        public: 1,
        attached_files: [
          { id: 103, src: "office.png", ext: "png", title: "Schermata" }
        ],
        portal: 1,
        user_created: {
          id: 4,
          nickname: "devteam",
          datetime: "2023-04-12T16:30:00",
          date_only: "2023-04-12",
          time_only: "16:30:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 5,
        description: "Messaggio pubblico",
        public: 1,
        attached_files: [
          { id: 104, src: "pic2.jpg", ext: "jpg", title: "Annuncio" }
        ],
        portal: 0,
        user_created: {
          id: 5,
          nickname: "public_user",
          datetime: "2023-05-22T11:50:00",
          date_only: "2023-05-22",
          time_only: "11:50:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 6,
        description: "Messaggio riservato",
        public: 0,
        attached_files: [],
        portal: 1,
        user_created: {
          id: 6,
          nickname: "manager",
          datetime: "2023-06-15T13:10:00",
          date_only: "2023-06-15",
          time_only: "13:10:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 7,
        description: null,
        public: 1,
        attached_files: [
          { id: 105, src: "pic3.jpg", ext: "jpg", title: "Diagramma" }
        ],
        portal: 0,
        user_created: {
          id: 7,
          nickname: "analyst",
          datetime: "2023-07-01T08:25:00",
          date_only: "2023-07-01",
          time_only: "08:25:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 8,
        description: "Comunicazione importante",
        public: 1,
        attached_files: [],
        portal: 1,
        user_created: {
          id: 8,
          nickname: "support",
          datetime: "2023-08-18T17:40:00",
          date_only: "2023-08-18",
          time_only: "17:40:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 9,
        description: "Nota tecnica",
        public: null,
        attached_files: [
          { id: 106, src: "logo.png", ext: "png", title: "Documento tecnico" }
        ],
        portal: 0,
        user_created: {
          id: 9,
          nickname: "technician",
          datetime: "2023-09-10T15:20:00",
          date_only: "2023-09-10",
          time_only: "15:20:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      },
      {
        id: 10,
        description: "Promemoria evento",
        public: 1,
        attached_files: [],
        portal: 1,
        user_created: {
          id: 10,
          nickname: "event_manager",
          datetime: "2023-10-05T10:00:00",
          date_only: "2023-10-05",
          time_only: "10:00:00"
        },
        user_updated: {
          id: 1,
          nickname: "admin",
          datetime: "2023-01-15T10:30:00",
          date_only: "2023-01-15",
          time_only: "10:30:00"
        }
      }
    ]

    this.createMessageList(this.messagesList);
  }

  /**
   * Quando si seleziona i file
   * @param event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.fileList = Array.from(input.files);
      this.uploadFilesServer();
    }
  }
  /**
   * Reset la selezione dei file quando importato
   */
  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload2') as HTMLInputElement;
    fileInput.value = '';
    this.fileList = [];
  }

  private uploadFilesServer() {
    // this.imagesStep2 = this.uploadImageService.getImagesStep2();
    const formData = new FormData();
    formData.append("folder", Connect.FOLDER_STEP_TWO);
    formData.append("size", Connect.FILE_SIZE.toString());
    formData.append("size_string", Connect.FILE_SIZE_STRING);
    //formData.append("idsystem", this.idsystem.toString());
    formData.append("step_position", "2");
    if (this.fileList && this.fileList.length + this.imagesList.length <= this.maxImages) {
      this.fileList.forEach((file, index) => {
        formData.append(`files[]`, file);
      });
      //this.setImages(formData);
      this.imageSpaceLeft = true;
    }
    else {
      this.imageSpaceLeft = false;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'ticket/filesList',
      {
        //idsystem: this.idsystem,
        //step_position: 2
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesList = val.data.listFiles.map(image => {
            // Chiama ImageLoaderService solo una volta per immagine
            // this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFile + image.src).subscribe(
            //   (safeUrl) => {
            //     image.src = safeUrl; // Assegna l'URL sicuro all'immagine
            //   }
            // );
            return image;
          });
        }
      })
  }

  takeOnCharge() { }

  release() { }

  changeStatus() {
    const dialogRef = this.dialog.open(ChangeStatusPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '400px',
      width: '90%',
      data: { idticket: this.ticketInfo?.id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  updateMessage(message: Message) {

  }

  deleteMessage(id: number) {

  }

  // setImages(formData: FormData) {
  //   this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/uploadFiles',
  //     formData)
  //     .subscribe((val: ApiResponse<null>) => {
  //       this.popupDialogService.alertElement(val);
  //       this.resetFileInput();
  //       this.getImages();
  //     })
  // }

  // deleteImg(idimage: number) {
  //   this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/deleteFile',
  //     { idsystem: this.idsystem, idimage: idimage })
  //     .subscribe((val: ApiResponse<null>) => {
  //       this.popupDialogService.alertElement(val);
  //       this.getImages();
  //     })
  // }


}
