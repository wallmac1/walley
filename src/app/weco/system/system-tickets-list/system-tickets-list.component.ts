import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketTable } from '../interfaces/ticket-table';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../interfaces/api-response';

@Component({
  selector: 'app-system-tickets-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './system-tickets-list.component.html',
  styleUrl: './system-tickets-list.component.scss'
})
export class SystemTicketsListComponent {

  idsystem: number = 95;
  displayedColumns: string[] = ['id', 'num_date', 'status', 'message', 'user_created', 'incharge', 'public'];
  dataSource = new MatTableDataSource<TicketTable>([]);
  ticketList: TicketTable[] = [];

  constructor(private dialog: MatDialog, private router: Router, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getTicketList();
  }

  createTicket() {
    this.router.navigate(['newTicket'], { queryParams: { idsystem: this.idsystem } });
  }

  getTicketList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'lavorazioni/ticketsListForSystem', { idsystem: this.idsystem })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.ticketList = val.data.tickets;
          this.dataSource.data = this.ticketList;
        }
      })
  }

  sortData(sort: Sort) {
    console.log(sort)
    if (sort.active === 'status') {
      const isAsc = sort.direction === 'asc';
      this.dataSource.data = [...this.ticketList].sort((a, b) => {
        return this.compare(a.ticketStatus.name, b.ticketStatus.name, isAsc);
      });
    }
    else if (sort.active == 'num_date') {
      const isAsc = sort.direction === 'asc';
      this.dataSource.data = [...this.ticketList].sort((a, b) => {
        return this.compare(a.ticket_date, b.ticket_date, isAsc);
      });
    }
    else {
      // Reimposta i dati originali se non è ordinamento per "status"
      this.dataSource.data = [...this.ticketList];
    }
  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  goToTicket(id: number) {
    this.router.navigate(['ticket', id])
  }

}
