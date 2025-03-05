import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketTableComponent } from "./components/ticket-table/ticket-table.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    TicketTableComponent,
    ReactiveFormsModule
],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {

  submitted: boolean = false;
  statusList: {id: number, name: string, color: string}[] = [];
  //lastFilterSearch: {};
  filterForm = new FormGroup({
    status: new FormControl<number | null>(null),
    system: new FormControl<string | null>(null),
    technician: new FormControl<string | null>(null),
    owner: new FormControl<string | null>(null),
  })

}
