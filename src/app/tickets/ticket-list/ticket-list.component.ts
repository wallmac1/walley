import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    FiltersComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatDividerModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {
  isSmall: boolean = false;
  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  ticketListStatus: Status[] = [];
  ticketListSubstatus: SubStatus[] = [];
  ticketList: TicketTable[] = [];
  ticketListReduced: any[] = []
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  displayedColumns: string[] = ['creation', 'customer', 'title', 'status', 'lastupdate', 'info'];
  displayedColumnsSmall: string[] = ['smallScreenCol']

  lastSearch: Filters = {
    customer: null,
    incharge: null,
    department: null,
    status: null,
    substatus: null,
    notclosed: 1,
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FiltersComponent) filtersChild!: FiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isSmall = screenWidth < 576;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 1;
      this.getTicketList(2);
    });
    this.getTicketList(2);
  }

  changeOrderCreation() {
    if (this.orderby_creation == 'asc' || this.orderby_creation == 'null') {
      this.orderby_creation = 'desc';
    }
    else {
      this.orderby_creation = 'asc';
    }
    this.getTicketList(2)
  }

  getTicketList(type: number) {
    if (type == 1) {
      this.lastSearch = this.filtersChild.getFilters();
    }
  
    // console.log('filters')
    if (this.sort.active === 'creation') {
      this.orderby_creation = this.sort.direction;
      this.orderby_update = null;
      console.log("CREATION", this.orderby_creation)
    } else if (this.sort.active === 'lastupdate') {
      this.orderby_update = this.sort.direction;
      this.orderby_creation = null;
      console.log("UPDATE", this.orderby_update)
    }
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketsList', {
      idcustomer: this.lastSearch.customer || null, idstatusticket: this.lastSearch.status || null,
      idsubstatusticket: this.lastSearch.substatus || null, incharge: this.lastSearch.incharge || null,
      iddepartment: this.lastSearch.department || null, notclosed: this.lastSearch.notclosed, orderby_creation: this.orderby_creation,
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
      this.getTicketList(2);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getTicketList(2);
    }
  }

  newTicket() {
    this.router.navigate(['newTicket']);
  }

  gotoTicket(row: TicketTable) {
    this.router.navigate(['ticket', row.idticket]);
  }
}
