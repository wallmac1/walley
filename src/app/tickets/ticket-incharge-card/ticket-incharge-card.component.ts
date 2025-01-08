import { Component, Input } from '@angular/core';
import { TicketLine } from '../interfaces/ticket-lines';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-incharge-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './ticket-incharge-card.component.html',
  styleUrl: './ticket-incharge-card.component.scss'
})
export class TicketInchargeCardComponent {

  @Input() incharge!: TicketLine;
  @Input() ticketId: number = 0;

  constructor() { }

}
