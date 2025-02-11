import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SystemTable } from '../../interfaces/system-table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from './components/filters/filters.component';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../interfaces/api-response';

@Component({
  selector: 'app-systems-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    FiltersComponent
  ],
  templateUrl: './systems-list.component.html',
  styleUrl: './systems-list.component.scss'
})
export class SystemsListComponent {

  dataSource = new MatTableDataSource<SystemTable>([]);
  isSmall: boolean = false;
  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  invoiceList: SystemTable[] = [];
  invoiceListReduced: any[] = []
  orderby_creation: string | null = 'desc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 10;
  previousSearch: {status: number | null} =  {status: null};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FiltersComponent) filtersChild!: FiltersComponent;

  displayedColumns: string[] = ['insertion_date', 'status', 'title', 'ticket_list', 'rma_list', 'owner', 'user',
    'installer_companyname', 'installation_date', 'product_systemcomposition', 'product_systemweco', 'battery_model', 'battery_type'];

  constructor(private router: Router, private connectServerService: ConnectServerService) { }


  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
    //this.verifyTextTruncated();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isSmall = screenWidth < 576;
  }

  ngAfterViewInit(): void {
    //this.verifyTextTruncated();
    // this.sort.sortChange.subscribe(() => {
    //   this.changeOrderCreation();
    //   this.currentPage = 1;
    //   this.getSystemList(2);
    // });
    this.getSystemList(2);

    this.dataSource.sort = this.sort;

    // Imposta un sorting accessor per la colonna "insertion_date"
    this.dataSource.sortingDataAccessor = (item: SystemTable, property: string): any => {
      if (property === 'insertion_date') {
        return new Date(item.insertion_date).getTime();
      }
    };
  }

  changeOrderCreation() {
    if (this.orderby_creation == 'asc') {
      this.orderby_creation = 'desc';
    }
    else {
      this.orderby_creation = 'asc';
    }
    this.currentPage = 1;
    this.getSystemList(2)
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getSystemList(2);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getSystemList(2);
    }
  }

  getSystemList(type: number) {
    // SE TYPE 1 RICERCA CON FILTRI
    if (type == 1) {
      this.previousSearch = {
        status: this.filtersChild.filterForm.get('status')?.value || null
      }
      this.currentPage = 1;
    }

    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/systemsList',
      { orderby_creation: this.orderby_creation, itemsPerPage: this.itemsPerPage, currentPageIndex: this.currentPage,
        filter_status: this.previousSearch.status
       })
      .subscribe((val: ApiResponse<{ systemsList: SystemTable[], pagination: {lastPage: number, totalResults: number }}>) => {
        if (val.data) {
          this.dataSource.data = val.data.systemsList;
          this.totalPages = val.data.pagination.lastPage;
          this.totalResults = val.data.pagination.totalResults;
        }
      })
  }

  goToTicket(id: number) {
    this.router.navigate(['ticket', id])
  }

  goToSystem(system: {id: number, path: string}) {
    this.router.navigate([system.path, system.id]);
  }
}
