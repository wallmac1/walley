import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Status } from '../interfaces/status';
import { StatusLine } from '../interfaces/status-line';

@Component({
  selector: 'app-ticket-status-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ticket-status-card.component.html',
  styleUrl: './ticket-status-card.component.scss'
})
export class TicketStatusCardComponent {

  @Input() statusInfo!: StatusLine; 
  @Input() ticketId: number = 0;

}
