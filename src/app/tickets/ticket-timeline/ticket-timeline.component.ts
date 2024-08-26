import { Component } from '@angular/core';
import { TicketWorkComponent } from "../ticket-work/ticket-work.component";
import { CommonModule } from '@angular/common';
import { Work } from '../interfaces/work';

@Component({
  selector: 'app-ticket-timeline',
  standalone: true,
  imports: [
    TicketWorkComponent,
    CommonModule
  ],
  templateUrl: './ticket-timeline.component.html',
  styleUrl: './ticket-timeline.component.scss'
})
export class TicketTimelineComponent {

  

}
