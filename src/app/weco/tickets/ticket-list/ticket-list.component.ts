import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketTableComponent } from "./components/ticket-table/ticket-table.component";

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    InViewportDirective,
    TicketTableComponent
],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {

}
