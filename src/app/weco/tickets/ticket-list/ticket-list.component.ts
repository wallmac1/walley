import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketTableComponent } from "./components/ticket-table/ticket-table.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Router } from '@angular/router';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../interfaces/api-response';
import { TicketStatus } from '../interfaces/ticket-status';

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

  @ViewChild('ticketTable') ticketTable!: TicketTableComponent;

  submitted: boolean = false;
  statusList: TicketStatus[] = [];
  lastFilterSearch: { status: string | null; system: string | null; technician: string | null; owner: string | null } =
    { status: null, system: null, technician: null, owner: null };

  filterForm = new FormGroup({
    status: new FormControl<number | null>(null),
    system: new FormControl<string | null>(null),
    technician: new FormControl<string | null>(null),
    owner: new FormControl<string | null>(null),
  })

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  ngOnInit(): void {
    this.getStatusList();
  }

  getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/ticketStatusList', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.statusList = val.data.statuses;
        }
      })
  }

  filter() {
    // Filtra gli elementi e poi inseriscili in lastFilterSearch
    Object.keys(this.filterForm.controls).forEach(key => {
      const control = this.filterForm.get(key);
      if (control?.value == '') {
        control.setValue(null);
      }
    })

    this.lastFilterSearch.status = this.statusList.find((status) => status.id == this.filterForm.get('status')?.value)?.name || null;
    this.lastFilterSearch.owner = this.filterForm.get('owner')?.value || null;
    this.lastFilterSearch.system = this.filterForm.get('system')?.value || null;
    this.lastFilterSearch.technician = this.filterForm.get('technician')?.value || null;

    this.ticketTable.filters = this.filterForm.getRawValue();
    this.ticketTable.getTicketList();
  }

}
