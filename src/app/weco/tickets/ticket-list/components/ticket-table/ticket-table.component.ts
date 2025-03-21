import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TicketTable } from '../../../interfaces/ticket-table';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { Connect } from '../../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule
  ],
  templateUrl: './ticket-table.component.html',
  styleUrl: './ticket-table.component.scss'
})
export class TicketTableComponent {

  displayedColumns: string[] = ['idticket', 'progressive', 'ticket_date', 'description', 'ticketStatus', 'incharge', 'public'];
  dataSource = new MatTableDataSource<TicketTable>([]);
  totalResults: number = 0;
  itemsPerPage: number = 100;
  currentPage: number = 1;
  totalPages: number = 1;
  order_by: string = 'desc';
  ticket_opened: number = 1;
  ticket_closed: number = 1;
  filters: { status: number | null; system: string | null; technician: string | null; owner: string | null } =
    { status: null, system: null, technician: null, owner: null };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getTicketList()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    // Imposta il sortingDataAccessor per la colonna "ticket_date" se necessario:
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'ticket_date') {
        // Converti la stringa in data (timestamp) per ordinare correttamente
        return new Date(item.ticket_date).getTime();
      }
      return (item as any)[property];
    };
  }

  getTicketList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/ticketsList',
      {
        orderby_ticketdate: this.order_by, idstatus: this.filters.status, system_name: this.filters.system,
        installer_companyname: this.filters.technician, owner_denomination: this.filters.owner,
        ticket_opened: this.ticket_opened, ticket_closed: this.ticket_closed, itemsPerPage: this.itemsPerPage,
        currentPageIndex: this.currentPage
      })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.dataSource.data = val.data.tickets;
          this.currentPage = val.data.pagination.currentPage;
          this.totalPages = val.data.pagination.lastPage;
          this.totalResults = val.data.pagination.total;
        }
      })
  }

  onSelectionChange(event: any, index: number) {
    if (index == 1) {
      this.ticket_closed = event.selected ? 1 : 0;
    }
    if (index == 2) {
      this.ticket_opened = event.selected ? 1 : 0;
    }

    this.getTicketList();
  }

  goToTicket(id: number) {
    console.log(id)
    this.router.navigate(['ticket', id]);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getTicketList();
    }
  }

  nextPage() {
    if (this.totalPages > this.currentPage) {
      this.currentPage += 1;
      this.getTicketList();
    }
  }

  sortTicket(event: any) {
    this.order_by = event.direction
    this.getTicketList();
  }

}
