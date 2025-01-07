import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from './components/filters/filters.component';
import { Status } from '../interfaces/status';
import { SubStatus } from '../interfaces/substatus';
import { TicketTable } from '../interfaces/ticket-table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConnectServerService } from '../../services/connect-server.service';
import { Router } from '@angular/router';
import { Filters } from '../interfaces/filters';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    FiltersComponent,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {
  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  ticketListStatus: Status[] = [];
  ticketListSubstatus: SubStatus[] = [];
  ticketList: TicketTable[] = [];
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 10;
  displayedColumns: string[] = ['creation', 'customer', 'description', 'status', 'lastupdate', 'info'];
  filters: Filters | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FiltersComponent) filtersChild!: FiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 1;
      this.getTicketList();
    });
    this.getTicketList();
  }

  changeOrderCreation() {
    if (this.orderby_creation == 'asc' || this.orderby_creation == 'null') {
      this.orderby_creation = 'desc';
    }
    else {
      this.orderby_creation = 'asc';
    }
    this.getTicketList()
  }

  getTicketList() {
    this.filters = this.filtersChild.getFilters();
    // console.log('filters')
    if (this.sort.active === 'creation') {
      this.orderby_creation = this.sort.direction;
      this.orderby_update = null;
      console.log("CREATION",this.orderby_creation)
    } else if (this.sort.active === 'lastupdate') {
      this.orderby_update = this.sort.direction;
      this.orderby_creation = null;
      console.log("UPDATE",this.orderby_update)
    }
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketsList', {
      idcustomer: this.filters.customer || null, idstatusticket: this.filters.status || null, 
      idsubstatustiket: this.filters.substatus || null, incharge: this.filters.incharge || null,
      iddepartment: this.filters.department || null, notclosed: this.filters.notclosed, orderby_creation: this.orderby_creation,
      orderby_lastupdate: this.orderby_update, itemsPerPage: this.itemsPerPage, currentPageIndex: this.currentPage
    }).subscribe((val: ApiResponse<any>) => {
      if (val) {
        //console.log(val.data)
        this.ticketList = val.data.tickets;
        this.totalResults = val.data.pagination.total;
        this.totalPages = val.data.pagination.lastPage;
      }
    })
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getTicketList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getTicketList();
    }
  }

  newTicket() {
    this.router.navigate(['newTicket']);
  }

  gotoTicket(row: TicketTable) {
    this.router.navigate(['ticket', row.idticket]);
  }
}
