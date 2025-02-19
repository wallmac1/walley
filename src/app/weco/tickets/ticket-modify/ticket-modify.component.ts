import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketInfo } from '../interfaces/ticket-info';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-ticket-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule,
    InViewportDirective
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef;
  isNewMessage: boolean = false;
  ticketInfo: TicketInfo | null = null;
  isSmallScreen: boolean = false;

  newAttachedFiles: any[] = [];
  newMessageForm = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string | null>(null),
    date: new FormControl<string | null>(null),
    time: new FormControl<string | null>(null),
  });

  //firstCard: {id: number, description: string, attached: any[], date: string, sender: number}
  messagesList: { id: number, description: string, attached: any[], date: string, sender: number }[] = [];

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.getData();
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

  newMessage(): void {
    this.isNewMessage = true;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const timeStr = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    this.newMessageForm.patchValue({
      date: dateStr,
      time: timeStr,
    });
    setTimeout(() => {
      this.bottomAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  sendMessage() {

  }

  getData() {
    this.ticketInfo = {
      id: 123,
      progressive: "001",
      openingDate: "2023-04-10T12:00:00Z",
      description: "Richiesta di assistenza",
      requestType: "Assistenza",
      email: "example@example.com",
      inverterList: [
        { id: 1, sn: "INV-001" },
        { id: 2, sn: "INV-002" }
      ],
      batteryList: [
        { id: 10, sn: "BAT-001" },
        { id: 11, sn: "BAT-002" }
      ]
    };

    this.messagesList = [
      {
        id: 1,
        description: "Questo è il primo messaggio",
        attached: [{id: 0, src: "wecoW.png"}, {id: 1, src: "profileThumb.jpg"}],
        date: "2023-05-25T14:00:00Z",
        sender: 1
      },
      {
        id: 2,
        description: "Questo è il secondo messaggio senza allegati",
        attached: [{id: 0, src: "wecoW.png"}, {id: 1, src: "profileThumb.jpg"}],
        date: "2023-05-26T09:30:00Z",
        sender: 2
      },
      {
        id: 3,
        description: "Messaggio finale con allegato",
        attached: [{id: 0, src: "wecoW.png"}, {id: 1, src: "profileThumb.jpg"}],
        date: "2023-05-27T16:45:00Z",
        sender: 1
      },
      {
        id: 4,
        description: "Questo è il primo messaggio",
        attached: [{id: 0, src: "wecoW.png"}, {id: 1, src: "profileThumb.jpg"}],
        date: "2023-05-25T14:00:00Z",
        sender: 1
      },
      {
        id: 5,
        description: "Questo è il secondo messaggio senza allegati",
        attached: [],
        date: "2023-05-26T09:30:00Z",
        sender: 2
      },
      {
        id: 6,
        description: "Messaggio finale con allegato",
        attached: [{id: 0, src: "wecoW.png"}, {id: 1, src: "profileThumb.jpg"}],
        date: "2023-05-27T16:45:00Z",
        sender: 1
      }
    ]
  }

}
