import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Status } from '../interfaces/status';
import { StatusLine } from '../interfaces/status-line';
import { TicketLine } from '../interfaces/ticket-lines';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-status-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './ticket-status-card.component.html',
  styleUrl: './ticket-status-card.component.scss'
})
export class TicketStatusCardComponent {

  @Input() status!: TicketLine;
  @Input() ticketId: number = 0;

  constructor() {}

}
